"use client";

import React from "react";
import { useCartStore } from "../store/cart-store";
import CartItem from "./CartItem";
import { useHasMounted } from "../hooks/use-has-mounted";
import { X, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { ShopifyCartLine } from "@/lib/types";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, cartId, isLoading } = useCartStore();
  const hasMounted = useHasMounted();
  const router = useRouter();

  // Sync cartId to cookie for server-side access (checkout)
  React.useEffect(() => {
    if (cartId) {
      document.cookie = `cartId=${cartId}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [cartId]);

  if (!isCartOpen) return null;

  const lines = hasMounted ? cart?.lines?.nodes || [] : [];
  const totalAmount = hasMounted ? cart?.cost?.totalAmount : null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out">
          <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-950 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-8">
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.3em] text-primary font-bold uppercase mb-1">
                  Your Selection
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-serif text-foreground">
                    Shopping Cart
                  </h2>
                  {isLoading && (
                    <Loader2
                      size={16}
                      className="animate-spin text-primary opacity-60"
                    />
                  )}
                </div>
              </div>
              <button
                type="button"
                className="p-2 text-foreground/40 hover:text-primary transition-colors cursor-pointer"
                onClick={() => setIsCartOpen(false)}
              >
                <X size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              {lines.length === 0 && !isLoading ? (
                <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
                  <ShoppingBag
                    size={40}
                    strokeWidth={1}
                    className="text-muted-foreground/30"
                  />
                  <p className="text-xl font-serif italic text-muted-foreground">
                    Your collection is currently empty.
                  </p>
                  <Link
                    href="/products"
                    onClick={() => {
                      setIsCartOpen(false);
                    }}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary pb-1 hover:text-foreground hover:border-foreground transition-all cursor-pointer"
                  >
                    Explore Pieces &rarr;
                  </Link>
                </div>
              ) : lines.length === 0 && isLoading ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4">
                  <p className="text-[10px] italic text-primary tracking-widest font-bold animate-pulse">
                    almost there...
                  </p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-border/40">
                  {lines.map((line: ShopifyCartLine) => (
                    <CartItem key={line.id} line={line} />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="border-t border-border/40 bg-muted/20 px-6 py-10">
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Subtotal
                  </p>
                  <div className="flex items-center gap-2">
                    {isLoading && (
                      <Loader2
                        size={12}
                        className="animate-spin text-primary opacity-40"
                      />
                    )}
                    <p className="text-xl font-serif text-foreground">
                      {totalAmount
                        ? formatPrice(
                            totalAmount.amount,
                            totalAmount.currencyCode,
                          )
                        : "$0.00"}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-8">
                  Excluding shipping & taxes.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="flex w-full items-center justify-center bg-primary h-14 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-foreground hover:bg-white hover:text-black transition-all"
                  >
                    Begin Checkout
                  </Link>
                  <Link
                    href="/products"
                    className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors cursor-pointer"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Browsing
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
