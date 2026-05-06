"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart-store";

/**
 * Automatically fetches the latest cart data from Shopify on page load.
 * This ensures the cart is not empty after a refresh if the user has items.
 */
export function CartInitializer() {
  const { cartId, refreshCart } = useCartStore();
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (cartId && !initialFetchDone.current) {
      initialFetchDone.current = true;
      refreshCart();
    }
  }, [cartId, refreshCart]);

  return null;
}
