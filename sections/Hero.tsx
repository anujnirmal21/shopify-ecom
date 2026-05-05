"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import React, { useRef } from "react";

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToNextSection = () => {
    if (sectionRef.current) {
      const height = sectionRef.current.offsetHeight;
      window.scrollTo({
        top: height,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Layer - Minimalist & Clean */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2500&q=80"
          alt="Minimalist Luxury Interior"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-[10s] ease-out"
        />
        {/* Subtle Dark Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Layer - Simple & Balanced */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Tagline */}
          <span className="inline-block text-white/80 tracking-[0.4em] text-[10px] font-bold uppercase animate-[fade-in_1s_ease-out]">
            Premium Selection
          </span>

          {/* Heading - Reduced Size, Clearly Visible */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight tracking-tight animate-[fade-in_1.2s_ease-out]">
            Refined Living for the <br />
            Modern Individual
          </h1>

          {/* Paragraph - Clear and Minimal */}
          <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-lg mx-auto animate-[fade-in_1.4s_ease-out]">
            Discover our curated collection of artisanal pieces designed to
            bring timeless elegance to your personal sanctuary.
          </p>

          {/* Single Elegant CTA */}
          <div className="pt-4 animate-[fade-in_1.6s_ease-out]">
            <Button
              href="/products"
              className="sm:w-auto bg-primary text-white hover:text-black dark:bg-white dark:text-black
               hover:dark:text-white  shadow-xl"
              hoverClassName="bg-white dark:bg-primary"
            >
              Shop Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Down Option - Minimalist */}
      <div
        onClick={scrollToNextSection}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/50 group-hover:text-white transition-colors">
          Scroll Down
        </span>
        <ChevronDown className="w-5 h-5 text-white/30 group-hover:text-white animate-bounce transition-colors" />
      </div>
    </section>
  );
}

export default HeroSection;
