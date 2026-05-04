import Link from "next/link";
import Image from "next/image";
import { getProducts, getCollections } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles, TrendingUp, Package } from "lucide-react";

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts(8),
    getCollections(),
  ]);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center space-x-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-white/10 w-fit">
              <Sparkles size={16} />
              <span>New Season Arrival</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Elevate Your Lifestyle with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Premium Essentials
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Discover our curated collection of high-quality products designed
              for the modern individual. From tech to fashion, we bring you the
              best.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/products"
                className="rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 hover:scale-105 transition-all active:scale-95"
              >
                Shop Collection
              </Link>
              <Link
                href="/wishlist"
                className="text-sm font-semibold leading-6 text-white flex items-center group"
              >
                View Wishlist{" "}
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={16}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Shop by Category
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explore our diverse collections curated just for you.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/products?collection=${collection.handle}`}
                className="group relative h-96 w-full overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <Package size={48} className="text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-bold text-white">
                    {collection.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-300">
                    Explore Collection &rarr;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-primary" />
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Trending Now
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-primary hover:opacity-80"
            >
              See all products &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-background/10 p-8 sm:p-16 text-center border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Don&apos;t miss out on our latest updates.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-primary-foreground/80">
              Subscribe to our newsletter and get notified about new arrivals
              and exclusive discounts.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-80 rounded-full border-0 px-6 py-3 bg-background text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary transition-all"
              />
              <button className="w-full sm:w-auto rounded-full bg-primary-foreground px-8 py-3 text-base font-semibold text-primary shadow-sm hover:opacity-90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
