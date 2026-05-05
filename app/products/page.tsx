import ProductCard from "@/components/ProductCard";
import {
  getCollections,
  getCollectionProducts,
  getProducts,
} from "@/services/product";

import Link from "next/link";

interface ProductsPageProps {
  searchParams: Promise<{ collection?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { collection: collectionHandle } = await searchParams;

  let products;
  let title = "All Products";

  const collections = await getCollections();

  if (collectionHandle) {
    const collectionData = await getCollectionProducts(collectionHandle);
    products = collectionData.products.nodes;
    title = collectionData.title;
  } else {
    products = await getProducts(20);
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        {/* Collection Header */}
        <div className="flex flex-col mb-16 border-b border-border/40 pb-12">
          <div className="mb-4">
             <span className="text-primary tracking-[0.3em] text-[10px] font-bold uppercase">
               Shop The Edit
             </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h1 className="text-5xl md:text-6xl font-serif text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-sm font-light tracking-widest text-muted-foreground uppercase">
              {products.length} CURATED PIECES
            </p>
          </div>

          {/* Collection Filter Links - Minimalist style */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
            <Link
              href="/products"
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all pb-1 border-b ${
                !collectionHandle
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              All Items
            </Link>
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/products?collection=${col.handle}`}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all pb-1 border-b ${
                  collectionHandle === col.handle
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {col.title}
              </Link>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-32 text-center">
            <h2 className="text-2xl font-serif text-muted-foreground mb-4 italic">No pieces found in this edit.</h2>
            <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary pb-1">
               Return to All Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
