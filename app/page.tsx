import { getProducts, getCollections } from "@/services/product";
import HeroSection from "@/sections/Hero";
import BrandCategorySection from "@/sections/BrandCategory";
import FeaturedSection from "@/sections/FeaturedSection";
import NewsletterSection from "@/sections/NewsletterSection";

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts(8),
    getCollections(),
  ]);

  return (
    <div className="bg-background">
      <HeroSection />

      <BrandCategorySection collections={collections} />

      <FeaturedSection products={products} />

      <NewsletterSection />
    </div>
  );
}
