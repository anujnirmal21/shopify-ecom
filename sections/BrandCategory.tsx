import { ShopifyCollection } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
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
            <Button href="/products" className="sm:w-auto mt-4">
              Explore All Departments
            </Button>
          </div>
          <div className="order-1 md:order-2 grid grid-cols-12 gap-4 h-[600px] md:h-[700px]">
            <div className="relative h-full col-span-7 overflow-hidden translate-y-12">
              <Image
                src="https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Premium Product 1"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="relative h-full col-span-5 overflow-hidden -translate-y-12">
              <Image
                src="https://images.unsplash.com/photo-1637868796504-32f45a96d5a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxlYXRoZXIlMjBiYWdzfGVufDB8fDB8fHww"
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
