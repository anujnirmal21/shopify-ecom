"use client";

import React from "react";
import { useCartStore } from "../store/cart-store";
import CartItem from "./CartItem";
import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ShopifyCartLine } from "@/lib/types";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, cartId } = useCartStore();

  // Sync cartId to cookie for server-side access (checkout)
  React.useEffect(() => {
    if (cartId) {
      document.cookie = `cartId=${cartId}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [cartId]);

  if (!isCartOpen) return null;

  const lines = cart?.lines?.nodes || [];
  const totalAmount = cart?.cost?.totalAmount;

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
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-6 sm:px-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Shopping Cart
                </h2>
              </div>
              <button
                type="button"
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-500 transition-colors cursor-pointer"
                onClick={() => setIsCartOpen(false)}
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-900 p-6">
                    <ShoppingBag
                      size={48}
                      className="text-gray-400 dark:text-gray-600"
                    />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Your cart is empty
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Looks like you haven&apos;t added anything to your cart yet.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-500 transition-colors cursor-pointer"
                  >
                    Start shopping &rarr;
                  </button>
                </div>
              ) : (
                <ul
                  role="list"
                  className="divide-y divide-gray-200 dark:divide-gray-800"
                >
                  {lines.map((line: ShopifyCartLine) => (
                    <CartItem key={line.id} line={line} />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                  <p>Subtotal</p>
                  <p>
                    {totalAmount
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: totalAmount.currencyCode,
                        }).format(parseFloat(totalAmount.amount))
                      : "$0.00"}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">
                  Shipping, taxes, and discounts calculated at checkout.
                </p>
                <div className="mt-8">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg font-bold text-white shadow-lg hover:bg-indigo-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
                <div className="mt-4 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    or{" "}
                    <button
                      type="button"
                      className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors cursor-pointer"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
