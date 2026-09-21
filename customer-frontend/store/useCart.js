'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const rawPrice =
            product.price !== undefined && product.price !== null && product.price !== ''
              ? product.price
              : product.unitPrice !== undefined && product.unitPrice !== null && product.unitPrice !== ''
              ? product.unitPrice
              : 0;
          const numericPrice = Number(rawPrice) || 0;

          const existingIndex = state.items.findIndex(
            (item) =>
              (item.productId && product.productId && item.productId === product.productId && item.variantLabel === product.variantLabel) ||
              (item.id && product.id && item.id === product.id && item.variantLabel === product.variantLabel) ||
              (item.slug && product.slug && item.slug === product.slug && item.variantLabel === product.variantLabel) ||
              (item.name && product.name && item.name === product.name && item.variantLabel === product.variantLabel)
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              ...product,
              price: numericPrice || updatedItems[existingIndex].price || updatedItems[existingIndex].unitPrice || 0,
              unitPrice: numericPrice || updatedItems[existingIndex].unitPrice || updatedItems[existingIndex].price || 0,
              quantity: (updatedItems[existingIndex].quantity || 1) + (quantity || 1),
            };
            return { items: updatedItems, isDrawerOpen: true };
          } else {
            return {
              items: [
                ...state.items,
                {
                  ...product,
                  price: numericPrice,
                  unitPrice: numericPrice,
                  quantity: quantity || 1,
                },
              ],
              isDrawerOpen: true,
            };
          }
        });
      },

      removeItem: (productId, variantLabel) => {
        set((state) => ({
          items: state.items.filter((item) => {
            const matchesId = item.id === productId || item.slug === productId || item.productId === productId;
            if (matchesId && variantLabel) {
              return item.variantLabel !== variantLabel;
            }
            return !matchesId;
          }),
        }));
      },

      updateQuantity: (productId, variantLabelOrQty, maybeQty) => {
        const hasVariant = typeof variantLabelOrQty === 'string';
        const variantLabel = hasVariant ? variantLabelOrQty : null;
        const quantity = hasVariant ? maybeQty : variantLabelOrQty;

        if (quantity <= 0) {
          get().removeItem(productId, variantLabel);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            const matchesId = item.id === productId || item.slug === productId || item.productId === productId;
            const matchesVariant = !variantLabel || item.variantLabel === variantLabel;
            return matchesId && matchesVariant ? { ...item, quantity } : item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + (item.quantity || 1), 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const rawPrice =
            item.price !== undefined && item.price !== null && item.price !== ''
              ? item.price
              : item.unitPrice !== undefined && item.unitPrice !== null && item.unitPrice !== ''
              ? item.unitPrice
              : 0;
          const price = Number(rawPrice) || 0;
          const qty = Number(item.quantity) || 1;
          return total + price * qty;
        }, 0);
      },
    }),
    {
      name: 'crystal-cart-storage',
    }
  )
);
