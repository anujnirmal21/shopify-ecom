import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlist: any[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (product) => {
        const { wishlist } = get();
        const exists = wishlist.find((p) => p.id === product.id);
        if (exists) {
          set({ wishlist: wishlist.filter((p) => p.id !== product.id) });
        } else {
          set({ wishlist: [...wishlist, product] });
        }
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((p) => p.id === productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
