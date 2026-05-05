"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ShopifyProduct } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { searchProducts } from "@/services/product";

export default function Search({
  hideIcon = false,
  transparent = false,
}: {
  hideIcon?: boolean;
  transparent?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const products = await searchProducts(searchQuery);
      setResults(products);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <div className={cn("relative w-full", !transparent && "max-w-lg")}>
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className={cn(
            "w-full py-2.5 pr-4 text-sm text-foreground focus:outline-none transition-all duration-500 placeholder:text-muted-foreground/40",
            !transparent &&
              "rounded-full border border-border bg-muted/20 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20",
            hideIcon ? (transparent ? "pl-0" : "pl-4") : "pl-10",
          )}
        />
        {!hideIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <SearchIcon size={18} strokeWidth={1.5} />
          </div>
        )}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute mt-3 sm:-left-[15%] w-full sm:w-[120%] overflow-hidden rounded-xl border border-border bg-popover shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
          {isSearching ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="mr-2 animate-spin" size={20} />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              <div className="p-2 border-b border-border text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60 px-4 py-3 bg-muted/10">
                Found in Collection
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.handle}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-4 p-3 hover:bg-accent/10 transition-colors"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted/20">
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {product.title}
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      {formatPrice(
                        product.priceRange.minVariantPrice.amount,
                        product.priceRange.minVariantPrice.currencyCode,
                      )}
                    </p>
                  </div>
                </Link>
              ))}
              <div className="p-2 bg-muted/5 border-t border-border">
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors cursor-pointer"
                >
                  View all results for &quot;{query}&quot;
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No products found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
