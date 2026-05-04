"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../store/cart-store";
import { useWishlistStore } from "../store/wishlist-store";
import { Heart, ShoppingCart } from "lucide-react";
import { ShopifyProduct } from "@/lib/types";

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const variantId = product.variants.nodes[0]?.id;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantId) {
      await addItem(variantId);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(parseFloat(product.priceRange.minVariantPrice.amount));

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="aspect-h-1 aspect-w-1 bg-gray-100 dark:bg-gray-900 group-hover:opacity-90 transition-opacity relative h-80 overflow-hidden">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400">
            No image
          </div>
        )}

        {/* Actions Overlay */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full shadow-lg backdrop-blur-md transition-all cursor-pointer ${
              isWishlisted
                ? "bg-red-500 text-white hover:bg-red-600 border-transparent"
                : "bg-white/80 dark:bg-gray-950/80 text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
            } border`}
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formattedPrice}
          </p>
          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
