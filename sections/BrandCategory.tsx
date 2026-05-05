import { ShopifyCollection } from "@/lib/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

function BrandCategorySection({
  collections,
}: {
  collections: ShopifyCollection[];
}) {
  return (
    <section className="py-24 md:py-40 border-y border-border/40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-center">
          <div className="order-2 md:order-1">
            <span className="text-primary tracking-[0.3em] text-[10px] font-bold uppercase mb-6 block">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-6xl font-serif mb-10 text-foreground leading-tight">
              Quality that speaks <br /> for itself.
            </h2>
            <p className="text-muted-foreground text-lg mb-12 font-light leading-relaxed max-w-xl">
              Whether it&apos;s cutting-edge technology, timeless fashion, or
              artisanal craftsmanship, our mission is to provide products that
              define the pinnacle of their category.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 mb-16">
              {collections.slice(0, 4).map((collection) => (
                <Link
                  key={collection.id}
                  href={`/products?collection=${collection.handle}`}
                  className="group"
                >
                  <h3 className="text-xl font-serif mb-3 group-hover:text-primary transition-colors uppercase tracking-wider">
                    {collection.title}
                  </h3>
                  <div className="w-8 group-hover:w-full h-[1px] bg-primary transition-all duration-500" />
                </Link>
              ))}
            </div>
            <Link
              href="/products"
              className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.3em] border-b border-foreground pb-2 hover:text-primary hover:border-primary transition-all"
            >
              Explore All Departments <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>
          <div className="order-1 md:order-2 grid grid-cols-12 gap-4 h-[600px] md:h-[700px]">
            <div className="relative h-full col-span-7 overflow-hidden translate-y-12">
              <Image
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80"
                alt="Premium Product 1"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="relative h-full col-span-5 overflow-hidden -translate-y-12">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80"
                alt="Premium Product 2"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandCategorySection;
