'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const ADMIN_EMAIL = 'sumukcrystalz5@gmail.com';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAdmin: false,
      isAuthModalOpen: false,
      authModalMode: 'login', // 'login' | 'register' | 'forgot-password'
      loading: false,
      authError: null,
      onAuthSuccessCallback: null,
      isInitialized: false,

      openAuthModal: (mode = 'login', onSuccess = null) =>
        set({
          isAuthModalOpen: true,
          authModalMode: mode,
          authError: null,
          onAuthSuccessCallback: onSuccess || null,
        }),

      closeAuthModal: () =>
        set({
          isAuthModalOpen: false,
          authError: null,
          onAuthSuccessCallback: null,
        }),

      setAuthModalMode: (mode) => set({ authModalMode: mode, authError: null }),

      /**
       * Initializes and restores active session from Supabase or server
       */
      initAuth: () => {
        if (typeof window === 'undefined') return;

        // 1. Restore active Supabase session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          if (!error && session?.user) {
            const sbUser = session.user;
            const cleanEmail = (sbUser.email || '').toLowerCase().trim();
            const isAdmin = cleanEmail === ADMIN_EMAIL || sbUser.user_metadata?.role === 'admin';

            const userObj = {
              id: sbUser.id,
              email: cleanEmail,
              name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || cleanEmail.split('@')[0],
              fullName: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || '',
              phone: sbUser.user_metadata?.phone || '',
              pincode: sbUser.user_metadata?.pincode || '',
              dob: sbUser.user_metadata?.dob || '',
              role: isAdmin ? 'admin' : 'user',
            };

            set({
              user: userObj,
              token: session.access_token,
              isAdmin,
              isInitialized: true,
            });

            // Enrich with profiles table data
            supabase
              .from('profiles')
              .select('*')
              .eq('id', sbUser.id)
              .maybeSingle()
              .then(({ data: profile }) => {
                if (profile) {
                  set((state) => ({
                    user: {
                      ...state.user,
                      ...profile,
                      name: profile.full_name || profile.name || state.user?.name,
                    },
                    isAdmin: profile.role === 'admin' || state.isAdmin,
                  }));
                }
              }, (err) => {
                console.warn('Profiles load note:', err?.message);
              });
          } else {
            // Check if user is stored in local storage
            const current = get().user;
            const currentToken = get().token;
            if (current && currentToken) {
              set({ isInitialized: true });
            } else {
              set({ user: null, token: null, isAdmin: false, isInitialized: true });
            }
          }
        });

        // 2. Real-time Supabase Auth state synchronization
        try {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
                const sbUser = session.user;
                const cleanEmail = (sbUser.email || '').toLowerCase().trim();
                const isAdmin = cleanEmail === ADMIN_EMAIL || sbUser.user_metadata?.role === 'admin';

                const userObj = {
                  id: sbUser.id,
                  email: cleanEmail,
                  name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || cleanEmail.split('@')[0],
                  fullName: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || '',
                  phone: sbUser.user_metadata?.phone || '',
                  pincode: sbUser.user_metadata?.pincode || '',
                  dob: sbUser.user_metadata?.dob || '',
                  role: isAdmin ? 'admin' : 'user',
                };

                set({
                  user: userObj,
                  token: session.access_token,
                  isAdmin,
                  loading: false,
                  authError: null,
                });
              } else if (event === 'SIGNED_OUT') {
                set({
                  user: null,
                  token: null,
                  isAdmin: false,
                  authError: null,
                });
              }
            }
          );

          return () => {
            subscription?.unsubscribe();
          };
        } catch (e) {
          console.warn('Supabase auth listener notice:', e.message);
        }
      },

      /**
       * Sign In: Verifies exact password against database & Supabase Auth.
       * Wrong password ALWAYS fails.
       */
      login: async (email, password) => {
        set({ loading: true, authError: null });
        try {
          const cleanEmail = email?.trim()?.toLowerCase();
          if (!cleanEmail || !password) {
            const err = 'Please enter both your email address and password.';
            set({ authError: err, loading: false });
            return { success: false, ok: false, error: err };
          }

          // 1. Verify via server authentication API (Verifies bcrypt hash from profiles DB)
          let serverRes = null;
          try {
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cleanEmail, password }),
            });
            const data = await res.json();
            if (res.ok && data.success && data.user) {
              serverRes = data;
            } else if (res.status === 401) {
              const err = data.error || 'Invalid email or password. Please verify your credentials.';
              set({ authError: err, loading: false });
              return { success: false, ok: false, error: err };
            }
          } catch (e) {
            console.warn('Direct auth API notice:', e.message);
          }

          // 2. Also authenticate directly with Supabase Auth
          let sbToken = null;
          try {
            const { data: sbData, error: sbErr } = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password,
            });
            if (sbData?.session) {
              sbToken = sbData.session.access_token;
            }
          } catch (e) {}

          if (serverRes?.user) {
            const u = serverRes.user;
            const isAdmin = u.role === 'admin' || cleanEmail === ADMIN_EMAIL;
            const userObj = {
              id: u.id,
              email: cleanEmail,
              name: u.name || u.fullName || cleanEmail.split('@')[0],
              fullName: u.fullName || u.name || cleanEmail.split('@')[0],
              phone: u.phone || '',
              pincode: u.pincode || '',
              dob: u.dob || '',
              role: isAdmin ? 'admin' : 'user',
            };

            const token = sbToken || serverRes.token;

            set({
              user: userObj,
              token,
              isAdmin,
              loading: false,
              isAuthModalOpen: false,
              authError: null,
            });

            const callback = get().onAuthSuccessCallback;
            if (typeof callback === 'function') {
              callback(userObj);
              set({ onAuthSuccessCallback: null });
            }

            return {
              success: true,
              ok: true,
              user: userObj,
              token,
              isAdmin,
            };
          }

          const err = 'Invalid email or password. Please verify your credentials.';
          set({ authError: err, loading: false });
          return { success: false, ok: false, error: err };
        } catch (err) {
          const errMsg = err.message || 'Authentication error. Please try again.';
          set({ authError: errMsg, loading: false });
          return { success: false, ok: false, error: errMsg };
        }
      },

      /**
       * Registration: Registers user in Database & Supabase, verifies email uniqueness
       */
      register: async (payloadOrName, emailParam, passParam, phoneParam) => {
        set({ loading: true, authError: null });
        try {
          let payload = {};
          if (typeof payloadOrName === 'object' && payloadOrName !== null) {
            payload = payloadOrName;
          } else {
            payload = {
              fullName: payloadOrName,
              email: emailParam,
              password: passParam,
              phone: phoneParam,
            };
          }

          const { fullName, email, phone, pincode, dob, password } = payload;
          const cleanEmail = email?.trim()?.toLowerCase() || '';
          const cleanName = fullName?.trim() || '';
          const cleanPhone = phone?.trim() || '';
          const cleanPincode = pincode?.trim() || '';
          const cleanDob = dob?.trim() || '';

          if (!cleanEmail || !password) {
            const err = 'Please provide an email address and a secure password.';
            set({ authError: err, loading: false });
            return { success: false, ok: false, error: err };
          }

          // Call Registration API (Checks database, hashes password, saves to Supabase profiles & customers, dispatches Brevo welcome email)
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: cleanName,
              email: cleanEmail,
              phone: cleanPhone,
              pincode: cleanPincode,
              dob: cleanDob,
              password,
            }),
          });

          const data = await res.json();

          if (res.status === 409) {
            const errMsg = data.error || data.message || `An account with ${cleanEmail} already exists. Please sign in.`;
            set({ authError: errMsg, loading: false });
            return { success: false, ok: false, error: errMsg };
          }

          if (!res.ok || !data.success) {
            const errMsg = data.error || data.message || 'Registration failed. Please check your details and retry.';
            set({ authError: errMsg, loading: false });
            return { success: false, ok: false, error: errMsg };
          }

          const userObj = data.user;
          const isAdmin = userObj.role === 'admin' || cleanEmail === ADMIN_EMAIL;
          const token = data.token || `jwt_${Date.now()}`;

          set({
            user: userObj,
            token,
            isAdmin,
            loading: false,
            isAuthModalOpen: false,
            authError: null,
          });

          const callback = get().onAuthSuccessCallback;
          if (typeof callback === 'function') {
            callback(userObj);
            set({ onAuthSuccessCallback: null });
          }

          return {
            success: true,
            ok: true,
            user: userObj,
            token,
            sessionActive: true,
          };
        } catch (err) {
          const errMsg = err.message || 'Registration failed. Please try again.';
          set({ authError: errMsg, loading: false });
          return { success: false, ok: false, error: errMsg };
        }
      },

      /**
       * Forgot Password: Sends reset link via Brevo SMTP & Supabase
       */
      sendPasswordReset: async (email) => {
        set({ loading: true, authError: null });
        try {
          const cleanEmail = email?.trim()?.toLowerCase();
          if (!cleanEmail) {
            const err = 'Please enter your registered email address.';
            set({ authError: err, loading: false });
            return { success: false, ok: false, error: err };
          }

          const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail }),
          });

          const data = await res.json();
          set({ loading: false, authError: null });

          return {
            success: true,
            ok: true,
            message: data.message || "If an account exists for this email, we've sent a secure password reset link. Please check your inbox and spam folder.",
          };
        } catch (err) {
          set({ loading: false });
          return {
            success: true,
            ok: true,
            message: "If an account exists for this email, we've sent a secure password reset link. Please check your inbox and spam folder.",
          };
        }
      },

      /**
       * Reset Password: Updates user password in Database & Supabase
       */
      updatePassword: async (newPassword, tokenParam, emailParam) => {
        set({ loading: true, authError: null });
        try {
          if (!newPassword || newPassword.length < 6) {
            const err = 'Password must be at least 6 characters in length.';
            set({ authError: err, loading: false });
            return { success: false, ok: false, error: err };
          }

          const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              password: newPassword,
              token: tokenParam,
              email: emailParam,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            const err = data.error || 'Failed to update password. Your reset link may have expired.';
            set({ authError: err, loading: false });
            return { success: false, ok: false, error: err };
          }

          // Also update in Supabase Auth if session exists
          supabase.auth.updateUser({ password: newPassword }).catch(() => {});

          set({ loading: false, authError: null });
          return { success: true, ok: true };
        } catch (err) {
          set({ authError: err.message || 'Failed to update password', loading: false });
          return { success: false, ok: false, error: err.message };
        }
      },

      updateUser: (newData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...newData } : newData,
        }));
      },

      isAuthenticated: () => {
        return !!get().user;
      },

      /**
       * Sign Out: Completely destroys active session
       */
      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (e) {}

        set({
          user: null,
          token: null,
          isAdmin: false,
          authError: null,
          isAuthModalOpen: false,
          onAuthSuccessCallback: null,
        });

        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('crystal-auth-storage');
          } catch (e) {}
        }
      },
    }),
    {
      name: 'crystal-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
