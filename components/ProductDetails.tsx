"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "../store/cart-store";
import { ShopifyProduct, ShopifyProductVariant } from "@/lib/types";
import { Minus, Plus, ShoppingBag, Heart } from "lucide-react";

interface ProductDetailsProps {
  product: ShopifyProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyProductVariant | undefined
  >(product.variants.nodes[0]);
  const [selectedImage, setSelectedImage] = useState(
    product.images?.nodes[0] || product.featuredImage,
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;

    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: selectedVariant?.price.currencyCode || "USD",
  }).format(parseFloat(selectedVariant?.price.amount || "0"));

  const images =
    product.images?.nodes ||
    (product.featuredImage ? [product.featuredImage] : []);

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-20">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-16">
          
          {/* Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
               {images.map((image, index) => (
                 <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-20 h-24 flex-shrink-0 transition-all duration-300 ${
                      selectedImage?.url === image.url ? "border-primary" : "border-border/40 hover:border-foreground/20"
                    } border`}
                 >
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      fill
                      className="object-cover"
                    />
                 </button>
               ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow aspect-[4/5] relative bg-muted overflow-hidden">
               {selectedImage && (
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.altText || product.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
               )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 mt-12 lg:mt-0 sticky top-32">
            <div className="mb-2">
               <span className="text-primary tracking-[0.4em] text-[10px] font-bold uppercase">
                 The VANTAGE Edit
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4 leading-tight">
              {product.title}
            </h1>
            <p className="text-2xl font-light text-foreground/80 mb-8 italic">
              {formattedPrice}
            </p>

            <div className="h-[1px] w-full bg-border/40 mb-8" />

            <div className="mb-10">
              <div
                className="text-muted-foreground font-light leading-relaxed text-sm lg:text-base space-y-4"
                dangerouslySetInnerHTML={{
                  __html: product.descriptionHtml || product.description || "",
                }}
              />
            </div>

            <div className="space-y-10">
              {/* Variant selector */}
              {product.variants.nodes.length > 1 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground mb-4">
                    Selection
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.nodes.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.availableForSale}
                        className={`px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 ${
                          selectedVariant?.id === variant.id
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-foreground border-border/60 hover:border-foreground"
                        } border ${!variant.availableForSale ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-border/60 px-4 h-14">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-foreground/60 hover:text-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-foreground/60 hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="flex-grow h-14 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:bg-white hover:text-black disabled:opacity-30"
                >
                  <ShoppingBag size={16} />
                  {isAdding
                    ? "Securing..."
                    : selectedVariant?.availableForSale
                      ? "Add to Selection"
                      : "Out of Stock"}
                </button>
                
                <button className="h-14 w-14 border border-border/60 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary transition-all">
                   <Heart size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border/40">
               <div className="grid grid-cols-2 gap-8 text-[10px] tracking-[0.2em] font-bold uppercase text-muted-foreground">
                  <div className="flex items-center gap-3">
                     <div className="w-1 h-1 bg-primary rounded-full" />
                     Ethically Sourced
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-1 h-1 bg-primary rounded-full" />
                     Premium Materials
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-1 h-1 bg-primary rounded-full" />
                     Global Delivery
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-1 h-1 bg-primary rounded-full" />
                     Concierge Support
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
