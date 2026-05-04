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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Showing {products.length} products
            </p>
          </div>

          {/* Collection Filter Buttons */}
          <div className="mt-6 flex flex-wrap gap-2 md:mt-0">
            <Link
              href="/products"
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                !collectionHandle
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              All
            </Link>
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/products?collection=${col.handle}`}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  collectionHandle === col.handle
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {col.title}
              </Link>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground text-lg">
              No products found in this collection.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
