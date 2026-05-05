"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "../store/cart-store";
import { useWishlistStore } from "../store/wishlist-store";
import {
  ShoppingBag,
  Heart,
  Menu,
  User,
  Search as SearchIcon,
  X,
  ChevronRight,
} from "lucide-react";
import Search from "./Search";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { setIsCartOpen, cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const cartCount = cart?.totalQuantity || 0;
  const wishlistCount = wishlist.length;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl transition-all duration-500">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <div className="flex-shrink-0 flex items-center z-50">
              <Link href="/" className="flex flex-col group">
                <span className="text-2xl md:text-3xl font-serif tracking-[0.15em] text-foreground uppercase group-hover:text-primary transition-colors duration-500">
                  Vantage
                </span>
                <span className="text-[7px] md:text-[8px] tracking-[0.4em] text-accent font-semibold uppercase -mt-1 opacity-80">
                  Premium Selection
                </span>
              </Link>
            </div>

            <div className="flex-shrink-0 flex items-center justify-end gap-3 sm:gap-5 z-50">
              <div className="hidden lg:block w-48 xl:w-64">
                <Search />
              </div>

              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`lg:hidden p-2 transition-colors cursor-pointer ${isMobileSearchOpen ? "text-accent" : "text-foreground/70 hover:text-accent"}`}
                aria-label="Toggle Search"
              >
                <SearchIcon size={20} strokeWidth={1.25} />
              </button>

              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
              <Link
                href="/wishlist"
                className="group relative p-2 text-foreground/70 hover:text-accent transition-all hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.25} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="group relative p-2 text-foreground/70 cursor-pointer hover:text-accent transition-all"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.25} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Clerk Auth (Desktop) */}
              <div className="hidden sm:flex items-center pl-2 sm:pl-4 border-l border-border/40">
                <Show when={"signed-out"}>
                  <SignInButton mode="modal">
                    <button className="p-2 text-foreground/70 hover:text-accent transition-all cursor-pointer">
                      <User size={20} strokeWidth={1.25} />
                    </button>
                  </SignInButton>
                </Show>
                <Show when={"signed-in"}>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox:
                          "h-8 w-8 border border-border/50 hover:border-accent transition-colors",
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Profile"
                        labelIcon={<User size={14} />}
                        href="/profile"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </Show>
              </div>

              {/* Mobile Hamburger (Right aligned) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-foreground/70 hover:text-accent transition-colors cursor-pointer ml-1"
                aria-label="Open Menu"
              >
                <Menu size={24} strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </div>
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out border-t border-border/20 bg-background ${isMobileSearchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="py-4 px-5">
            <Search />
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className={`absolute inset-y-0 right-0 w-[85vw] max-w-[400px] bg-background border-l border-border/50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/30">
            <span className="text-2xl font-serif tracking-[0.1em] text-foreground uppercase">
              Vantage
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 -mr-2 text-foreground/50 hover:text-accent transition-colors cursor-pointer bg-muted/20 rounded-full"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-10">
            {/* Mobile Wishlist Link */}
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mt-2 flex items-center gap-4 text-foreground/70 hover:text-accent transition-colors duration-500 transform ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: "450ms" }}
            >
              <Heart size={22} strokeWidth={1.25} />
              <span className="text-sm font-medium tracking-widest uppercase">
                My Wishlist ({wishlistCount})
              </span>
            </Link>
          </div>

          {/* Footer (Auth & Appearance) */}
          <div className="p-6 bg-muted/30 border-t border-border/30 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground">
                Appearance
              </span>
              <ThemeToggle />
            </div>

            <div>
              <Show when={"signed-out"}>
                <SignInButton mode="modal">
                  <button className="w-full py-4 bg-foreground text-background text-[11px] font-bold tracking-[0.3em] uppercase rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-300">
                    Sign In / Register
                  </button>
                </SignInButton>
              </Show>
              <Show when={"signed-in"}>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full py-4 px-5 bg-background border border-border/50 hover:border-accent transition-colors rounded-sm group"
                >
                  <div className="flex items-center space-x-3">
                    <User
                      size={18}
                      strokeWidth={1.5}
                      className="text-foreground/70 group-hover:text-accent transition-colors"
                    />
                    <span className="text-xs font-semibold tracking-widest uppercase">
                      Account
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground group-hover:text-accent"
                  />
                </Link>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
