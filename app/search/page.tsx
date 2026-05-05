"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { ShopifyProduct } from "@/lib/types";
import { searchProducts } from "@/services/product";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = React.useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const products = await searchProducts(query);
        setResults(products);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please enter a search query.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-medium">
          Searching for &quot;{query}&quot;...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 border-b border-border pb-8 mb-12">
        <SearchIcon className="text-muted-foreground" size={32} />
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Search Results for{" "}
          <span className="text-primary">&quot;{query}&quot;</span>
        </h1>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
          <p className="text-muted-foreground text-lg">
            No products found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-32">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
