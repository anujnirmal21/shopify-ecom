"use client";

import React from "react";
import { useWishlistStore } from "@/store/wishlist-store";
import ProductCard from "@/components/ProductCard";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { HeartOff } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist } = useWishlistStore();
  const hasMounted = useHasMounted();

  const wishlistItems = hasMounted ? wishlist : [];

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex items-center justify-between border-b border-border pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            My <span className="text-primary">Wishlist</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            {wishlistItems.length} Items
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="rounded-full bg-muted p-10">
              <HeartOff size={64} className="text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Your wishlist is empty
              </h2>
              <p className="mt-2 text-muted-foreground max-w-sm">
                Save items you like to your wishlist so you can find them later.
              </p>
            </div>
            <Link
              href="/products"
              className="rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg hover:opacity-90 transition-all active:scale-95"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
