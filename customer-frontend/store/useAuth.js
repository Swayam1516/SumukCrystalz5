'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAdmin: false,
      isAuthModalOpen: false,
      authModalMode: 'login', // 'login' | 'register'
      loading: false,
      authError: null,

      openAuthModal: (mode = 'login') =>
        set({ isAuthModalOpen: true, authModalMode: mode, authError: null }),
      closeAuthModal: () => set({ isAuthModalOpen: false, authError: null }),
      setAuthModalMode: (mode) => set({ authModalMode: mode, authError: null }),

      initAuth: () => {
        const state = get();
        if (state.user) {
          const isAdmin = state.user.role === 'admin';
          set({ isAdmin });
        }
      },

      login: async (email, password) => {
        set({ loading: true, authError: null });
        try {
          const cleanEmail = email.trim().toLowerCase();
          const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

          const endpoints = [
            '/api/auth/login',
            `${API_BASE}/api/auth/login`,
          ];

          let authData = null;
          let lastError = null;

          for (const url of endpoints) {
            try {
              const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cleanEmail, password }),
              });
              const data = await res.json();
              if (res.ok && data.token) {
                authData = data;
                break;
              } else {
                lastError = data.error || data.message || 'Invalid email or password';
              }
            } catch (err) {
              lastError = err.message;
            }
          }

          if (authData && authData.token) {
            const isAdmin = authData.user?.role === 'admin';
            const user = {
              ...authData.user,
              role: isAdmin ? 'admin' : 'user',
            };

            set({
              user,
              token: authData.token,
              isAdmin,
              loading: false,
              isAuthModalOpen: false,
              authError: null,
            });

            return { success: true, ok: true, user, token: authData.token, isAdmin };
          }

          const errorMessage = lastError || 'Invalid credentials. Please verify and try again.';
          set({ authError: errorMessage, loading: false });
          return { success: false, ok: false, error: errorMessage };
        } catch (err) {
          set({ authError: err.message || 'Login failed', loading: false });
          return { success: false, ok: false, error: err.message };
        }
      },

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

          const { email, fullName, phone, pincode, dob, password } = payload;
          const cleanEmail = email?.trim()?.toLowerCase() || '';
          const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

          const endpoints = [
            '/api/auth/register',
            `${API_BASE}/api/auth/register`,
          ];

          let authData = null;
          let lastError = null;

          for (const url of endpoints) {
            try {
              const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email: cleanEmail, phone, pincode, dob, password }),
              });
              const data = await res.json();
              if (res.ok && data.token) {
                authData = data;
                break;
              } else {
                lastError = data.error || data.message || 'Registration failed';
              }
            } catch (e) {
              lastError = e.message;
            }
          }

          if (authData && authData.token) {
            const isAdmin = authData.user?.role === 'admin';
            const user = {
              ...authData.user,
              role: isAdmin ? 'admin' : 'user',
            };

            set({
              user,
              token: authData.token,
              isAdmin,
              loading: false,
              isAuthModalOpen: false,
              authError: null,
            });

            return { success: true, ok: true, user, token: authData.token, isAdmin };
          }

          const errorMessage = lastError || 'Registration failed. Please check your details.';
          set({ authError: errorMessage, loading: false });
          return { success: false, ok: false, error: errorMessage };
        } catch (err) {
          set({ authError: err.message || 'Registration failed', loading: false });
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

      logout: () => {
        set({
          user: null,
          token: null,
          isAdmin: false,
          authError: null,
          isAuthModalOpen: false,
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
    }
  )
);

