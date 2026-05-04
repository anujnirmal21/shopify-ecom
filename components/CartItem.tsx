'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '../store/cart-store';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  line: {
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      product: {
        title: string;
        handle: string;
        featuredImage: {
          url: string;
          altText: string;
        };
      };
    };
  };
}

export default function CartItem({ line }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
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

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: line.merchandise.price.currencyCode,
  }).format(parseFloat(line.merchandise.price.amount));

  return (
    <li className="flex py-6 transition-colors">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        {line.merchandise.product.featuredImage && (
          <Image
            src={line.merchandise.product.featuredImage.url}
            alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
            width={100}
            height={100}
            className="h-full w-full object-cover object-center"
          />
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
            <h3 className="line-clamp-1">{line.merchandise.product.title}</h3>
            <p className="ml-4">{formattedPrice}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{line.merchandise.title}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={isUpdating || line.quantity <= 1}
              onClick={() => handleUpdateQuantity(line.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span className="text-gray-900 dark:text-white font-medium w-6 text-center text-xs">
              {line.quantity}
            </span>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdateQuantity(line.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex">
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleRemove}
              className="flex items-center space-x-1 font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline text-xs">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
