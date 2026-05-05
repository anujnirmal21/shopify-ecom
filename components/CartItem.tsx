"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "../store/cart-store";
import { Trash2, Plus, Minus } from "lucide-react";
import { ShopifyCartLine } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  line: ShopifyCartLine;
}

export default function CartItem({ line }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const availableStock = line.merchandise.quantityAvailable ?? (line.merchandise.availableForSale ? Infinity : 0);
  const isOutOfStock = !line.merchandise.availableForSale || (line.merchandise.quantityAvailable !== undefined && line.merchandise.quantityAvailable <= 0);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (line.merchandise.quantityAvailable !== undefined && newQuantity > line.merchandise.quantityAvailable) return;

    setIsUpdating(true);
    try {
      await updateQuantity(line.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(line.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedPrice = formatPrice(
    line.merchandise.price.amount,
    line.merchandise.price.currencyCode
  );

  return (
    <li className="flex py-8 transition-colors">
      <div className="h-28 w-24 flex-shrink-0 overflow-hidden bg-muted border border-border/40">
        {line.merchandise.product.featuredImage && (
          <Image
            src={line.merchandise.product.featuredImage.url}
            alt={
              line.merchandise.product.featuredImage.altText ||
              line.merchandise.product.title
            }
            width={100}
            height={120}
            className="h-full w-full object-cover object-center"
          />
        )}
      </div>

      <div className="ml-6 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-sm font-light tracking-wide text-foreground line-clamp-1">
              {line.merchandise.product.title}
            </h3>
            <p className="ml-4 text-sm font-serif italic text-foreground/80">{formattedPrice}</p>
          </div>
          <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-primary mb-2">
            {line.merchandise.title}
          </p>
        </div>
        
        <div className="flex flex-1 items-end justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center space-x-1 border border-border/40 px-2 h-10">
              <button
                type="button"
                disabled={isUpdating || line.quantity <= 1}
                onClick={() => handleUpdateQuantity(line.quantity - 1)}
                className="p-1 text-foreground/40 hover:text-primary transition-colors disabled:opacity-20 cursor-pointer"
              >
                <Minus size={12} strokeWidth={1.5} />
              </button>
              <span className="w-8 text-center text-[10px] font-bold">
                {line.quantity}
              </span>
              <button
                type="button"
                disabled={isUpdating || (line.merchandise.quantityAvailable !== undefined && line.quantity >= line.merchandise.quantityAvailable)}
                onClick={() => handleUpdateQuantity(line.quantity + 1)}
                className="p-1 text-foreground/40 hover:text-primary transition-colors disabled:opacity-20 cursor-pointer"
              >
                <Plus size={12} strokeWidth={1.5} />
              </button>
            </div>
            {line.merchandise.quantityAvailable !== undefined && line.quantity >= line.merchandise.quantityAvailable && (
               <p className="text-[8px] text-orange-500 uppercase tracking-tighter font-bold">
                 Stock Limit Reached
               </p>
            )}
            {isOutOfStock && (
               <p className="text-[8px] text-red-500 uppercase tracking-tighter font-bold">
                 Currently Unavailable
               </p>
            )}
          </div>

          <button
            type="button"
            disabled={isUpdating}
            onClick={handleRemove}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 hover:text-destructive transition-colors disabled:opacity-20 cursor-pointer flex items-center gap-2"
          >
            <Trash2 size={12} strokeWidth={1.5} />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
