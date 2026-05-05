"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../store/cart-store";
import { useWishlistStore } from "../store/wishlist-store";
import { useHasMounted } from "../hooks/use-has-mounted";
import { Heart, ShoppingCart } from "lucide-react";
import { ShopifyProduct } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const hasMounted = useHasMounted();

  if (!product) return null;

  const firstVariant = product.variants.nodes[0];
  const variantId = firstVariant?.id;
  const isOutOfStock =
    !firstVariant?.availableForSale ||
    (firstVariant?.quantityAvailable !== undefined &&
      firstVariant?.quantityAvailable <= 0);
  const isWishlisted = hasMounted ? isInWishlist(product.id) : false;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantId && !isOutOfStock) {
      await addItem(variantId);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const price = product.priceRange?.minVariantPrice || firstVariant?.price;
  const formattedPrice = price
    ? formatPrice(price.amount, price.currencyCode)
    : "Price unavailable";
  const productImage = product.featuredImage || product.images?.nodes?.[0];

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group relative flex flex-col overflow-hidden bg-background border border-transparent hover:border-border transition-all duration-500"
    >
      <div className="aspect-[4/5] bg-muted relative overflow-hidden">
        {productImage ? (
          <Image
            src={productImage.url}
            alt={productImage.altText || product.title}
            width={600}
            height={750}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground font-light tracking-widest text-xs uppercase">
            Product Image
          </div>
        )}

        {/* Actions Overlay */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleToggleWishlist}
            className={cn(
              "p-1.5 rounded-full backdrop-blur-md transition-all duration-500 border cursor-pointer",
              isWishlisted
                ? "bg-gray-200/30 border-gray-200 text-primary shadow-xl shadow-red-500/10 scale-110"
                : "bg-black/20 border-white/10 text-white hover:bg-black/40 hover:scale-110",
            )}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              size={18}
              fill={isWishlisted ? "currentColor" : "none"}
              strokeWidth={isWishlisted ? 0 : 1.5}
              className="transition-transform duration-300 active:scale-125"
            />
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              "w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 hover:cursor-pointer",
              isOutOfStock
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/70 hover:text-black",
            )}
          >
            {isOutOfStock ? "Out of Stock" : "Quick Add To Cart"}
          </button>
        </div>
      </div>

      <div className="flex flex-col pt-6 pb-2 px-2">
        <h3 className="text-sm font-light tracking-wide text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className=" text-lg font-semibold font-serif italic text-muted-foreground">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}
