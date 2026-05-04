"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ShopifyProduct } from "@/lib/types";
import { searchProducts } from "@/services/product";

export default function Search() {
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
    <div className="relative w-full max-w-lg">
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
          className="w-full rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all duration-300"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
          <SearchIcon size={18} />
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
          {isSearching ? (
            <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
              <Loader2 className="mr-2 animate-spin" size={20} />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              <div className="p-2 border-b border-gray-50 dark:border-gray-900 text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 px-4 py-2">
                Products Found
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.handle}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                    {product.featuredImage && (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                      {product.title}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency:
                          product.priceRange.minVariantPrice.currencyCode,
                      }).format(
                        parseFloat(product.priceRange.minVariantPrice.amount),
                      )}
                    </p>
                  </div>
                </Link>
              ))}
              <div className="p-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-900">
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  View all results for &quot;{query}&quot;
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No products found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
