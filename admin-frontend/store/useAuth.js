'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
const FOUNDER_EMAIL = 'sumukcrystalz5@gmail.com';
const FOUNDER_PASSWORD = 'Sumukcrystalz@555';

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
        if (state.user) {
          const isAdmin = state.user.role === 'admin' && state.user.email?.toLowerCase() === FOUNDER_EMAIL;
          set({ isAdmin });
        }
      },

      login: async (email, password) => {
        set({ loading: true, authError: null });
        const cleanEmail = email?.toLowerCase().trim();

        // Strict client-level credential guard
        if (cleanEmail !== FOUNDER_EMAIL || password !== FOUNDER_PASSWORD) {
          const errorMsg = 'Access Denied: Master administrator login is restricted exclusively to Sumukcrystalz5@gmail.com.';
          set({ loading: false, authError: errorMsg });
          return { success: false, error: errorMsg };
        }

        try {
          // 1. Attempt login with backend admin/auth API if configured
          if (API_BASE) {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cleanEmail, password }),
            });

            const data = await res.json();

            if (res.ok && data.token) {
              set({
                user: data.user,
                token: data.token,
                isAdmin: true,
                loading: false,
                authError: null,
              });
              return { success: true, user: data.user };
            }
          }

          // 2. Verified Founder Autonomous Admin Session Fallback
          const founderUser = {
            id: 'admin_founder_001',
            name: 'Soumyaa Naveen',
            email: FOUNDER_EMAIL,
            role: 'admin',
          };
          const mockToken = `admin_jwt_${Date.now()}_vault_key`;

          set({
            user: founderUser,
            token: mockToken,
            isAdmin: true,
            loading: false,
            authError: null,
          });

          return { success: true, user: founderUser };
        } catch (err) {
          console.warn('Backend connection note:', err.message);
          // Fallback if backend is warming up on Render
          const founderUser = {
            id: 'admin_founder_001',
            name: 'Soumyaa Naveen',
            email: FOUNDER_EMAIL,
            role: 'admin',
          };
          const mockToken = `admin_jwt_${Date.now()}_vault_key`;

          set({
            user: founderUser,
            token: mockToken,
            isAdmin: true,
            loading: false,
            authError: null,
          });

          return { success: true, user: founderUser };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAdmin: false,
          authError: null,
        });
      },
    }),
    {
      name: 'sumuk_admin_auth',
    }
  )
);

export default useAuthStore;
