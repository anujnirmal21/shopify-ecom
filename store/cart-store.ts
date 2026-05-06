import { ShopifyCart, ShopifyCartLine } from "@/lib/types";
import {
  createCart,
  updateCartLine,
  addToCart,
  removeFromCart,
  getCart,
} from "@/services/cart";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cart: ShopifyCart | null;
  isCartOpen: boolean;
  cartId: string | null;
  isLoading: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  checkout: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isCartOpen: false,
      cartId: null,
      isLoading: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),

      clearCart: () => set({ cart: null, cartId: null }),

      checkout: () => {
        const cart = get().cart;
        if (cart?.checkoutUrl) {
          window.location.href = cart.checkoutUrl;
        }
      },

      addItem: async (variantId: string, quantity: number = 1) => {
        // Open the cart immediately for instant feedback
        set({ isCartOpen: true, isLoading: true });
        
        let currentCartId = get().cartId;

        try {
          if (!currentCartId) {
            const newCart = await createCart();
            currentCartId = newCart.id;
            document.cookie = `cartId=${currentCartId}; path=/; max-age=31536000; SameSite=Lax`;
            set({ cartId: currentCartId, cart: newCart });
          }

          if (currentCartId) {
            const cart = get().cart;
            const existingLine = cart?.lines?.nodes?.find(
              (line: ShopifyCartLine) => line.merchandise.id === variantId,
            );

            if (existingLine && cart) {
              // Optimistic update for existing item
              const newQuantity = existingLine.quantity + quantity;
              const updatedNodes = cart.lines.nodes.map(
                (line: ShopifyCartLine) =>
                  line.id === existingLine.id
                    ? { ...line, quantity: newQuantity }
                    : line,
              );
              set({
                cart: { ...cart, lines: { ...cart.lines, nodes: updatedNodes } },
              });

              await updateCartLine(currentCartId, existingLine.id, newQuantity);
            } else {
              // Add new line
              await addToCart(currentCartId, variantId, quantity);
            }
            await get().refreshCart();
          }
        } catch (error) {
          console.error("Failed to add to cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (lineId: string) => {
        const currentCartId = get().cartId;
        const cart = get().cart;
        if (!currentCartId || !cart) return;

        set({ isLoading: true });
        try {
          // Optimistic remove
          const updatedNodes = cart.lines.nodes.filter(
            (line: ShopifyCartLine) => line.id !== lineId,
          );
          set({
            cart: { ...cart, lines: { ...cart.lines, nodes: updatedNodes } },
          });

          await removeFromCart(currentCartId, lineId);
          await get().refreshCart();
        } catch (error) {
          console.error("Failed to remove item:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineId: string, quantity: number) => {
        const currentCartId = get().cartId;
        const cart = get().cart;
        if (!currentCartId || !cart) return;

        if (quantity < 1) {
          await get().removeItem(lineId);
          return;
        }

        set({ isLoading: true });
        try {
          // Optimistic update
          const updatedNodes = cart.lines.nodes.map((line: ShopifyCartLine) =>
            line.id === lineId ? { ...line, quantity } : line,
          );
          set({
            cart: { ...cart, lines: { ...cart.lines, nodes: updatedNodes } },
          });

          await updateCartLine(currentCartId, lineId, quantity);
          await get().refreshCart();
        } catch (error) {
          console.error("Failed to update quantity:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      refreshCart: async () => {
        const currentCartId = get().cartId;
        if (!currentCartId) return;
        set({ isLoading: true });
        try {
          const data = await getCart(currentCartId);
          if (data) {
            set({ cart: data });
          } else {
            set({ cartId: null, cart: null });
          }
        } catch (error) {
          console.error("Failed to refresh cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
);
