import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ShopifyProduct } from "@/lib/types";

function FeaturedSection({ products }: { products: ShopifyProduct[] }) {
  return (
    <section className="bg-background py-24 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-20 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
              Current Obsessions
            </h2>
            <p className="text-muted-foreground font-light tracking-widest uppercase text-xs">
              The most sought-after pieces in the VANTAGE catalog.
            </p>
          </div>
          <Link
            href="/products"
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary hover:opacity-80 transition-opacity border-b border-primary/20 pb-1"
          >
            Shop Full Catalog &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-24 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedSection;
