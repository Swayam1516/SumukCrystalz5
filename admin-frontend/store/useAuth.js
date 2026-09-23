'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAdmin: false,
      loading: false,
      authError: null,

      initAuth: () => {
        const state = get();
        if (state.user && state.token) {
          const isAdmin = state.user.role === 'admin';
          set({ isAdmin });
        }
      },

      login: async (email, password) => {
        set({ loading: true, authError: null });
        const cleanEmail = email?.toLowerCase().trim();

        if (!cleanEmail || !password) {
          const errorMsg = 'Please enter both administrator email and password.';
          set({ loading: false, authError: errorMsg });
          return { success: false, error: errorMsg };
        }

        // Direct Founder Administrator Verification
        if (
          cleanEmail === 'sumukcrystalz5@gmail.com' ||
          cleanEmail === 'sumukcrystalz@gmail.com'
        ) {
          if (password === 'Sumukcrystalz@555' || password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            const adminUser = {
              id: 'admin_founder_001',
              name: 'Soumyaa Naveen',
              fullName: 'Soumyaa Naveen',
              email: cleanEmail,
              role: 'admin',
            };
            const adminToken = 'admin_jwt_session_' + Date.now();
            set({
              user: adminUser,
              token: adminToken,
              isAdmin: true,
              loading: false,
              authError: null,
            });
            return { success: true, user: adminUser };
          } else {
            const errorMsg = 'Invalid master password. Please verify your credentials.';
            set({ loading: false, authError: errorMsg });
            return { success: false, error: errorMsg };
          }
        }

        try {
          // 1. Authenticate against Backend Administrator Authentication API
          const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, password }),
          });

          const data = await res.json();

          if (res.ok && data.token && data.user) {
            if (data.user.role !== 'admin' && cleanEmail !== 'sumukcrystalz5@gmail.com') {
              const errorMsg = 'Access Denied: Administrator privileges required for this portal.';
              set({ loading: false, authError: errorMsg });
              return { success: false, error: errorMsg };
            }

            set({
              user: data.user,
              token: data.token,
              isAdmin: true,
              loading: false,
              authError: null,
            });
            return { success: true, user: data.user };
          }

          const errorMsg = data.error || data.message || 'Invalid administrator credentials.';
          set({ loading: false, authError: errorMsg });
          return { success: false, error: errorMsg };
        } catch (err) {
          const errorMsg = 'Failed to connect to authentication server. Please verify credentials.';
          set({ loading: false, authError: errorMsg });
          return { success: false, error: errorMsg };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAdmin: false,
          authError: null,
        });
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('sumuk_admin_auth');
          } catch (e) {}
        }
      },
    }),
    {
      name: 'sumuk_admin_auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

export default useAuthStore;
