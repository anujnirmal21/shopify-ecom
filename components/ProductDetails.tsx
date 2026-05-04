'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '../store/cart-store';

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    images: {
      nodes: Array<{
        url: string;
        altText: string;
        width: number;
        height: number;
      }>;
    };
    variants: {
      nodes: Array<{
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      }>;
    };
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants.nodes[0]);
  const [selectedImage, setSelectedImage] = useState(product.images.nodes[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;
    
    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedVariant?.price.currencyCode || 'USD',
  }).format(parseFloat(selectedVariant?.price.amount || '0'));

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6" aria-orientation="horizontal" role="tablist">
                {product.images.nodes.map((image, index) => (
                  <button
                    key={index}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white dark:bg-gray-900 text-sm font-medium uppercase text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    onClick={() => setSelectedImage(image)}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        width={100}
                        height={100}
                        className="h-full w-full object-cover object-center"
                      />
                    </span>
                    <span
                      className={`${
                        selectedImage.url === image.url ? 'ring-indigo-500' : 'ring-transparent'
                      } pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="aspect-h-1 aspect-w-1 w-full">
              <div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText || product.title}
                  fill
                  className="h-full w-full object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{product.title}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900 dark:text-gray-100">{formattedPrice}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="space-y-6 text-base text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>

            <div className="mt-10">
              {/* Variant selector */}
              {product.variants.nodes.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Variants</h3>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {product.variants.nodes.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.availableForSale}
                        className={`${
                          selectedVariant.id === variant.id
                            ? 'bg-indigo-600 text-white border-transparent'
                            : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800'
                        } ${
                          !variant.availableForSale ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50 dark:hover:bg-gray-800'
                        } flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase sm:flex-1 transition-all cursor-pointer`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Quantity</h3>
                <div className="mt-4 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium text-gray-900 dark:text-white w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-10 flex">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full transition-all cursor-pointer disabled:bg-gray-400 dark:disabled:bg-gray-800"
                >
                  {isAdding ? 'Adding...' : selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
