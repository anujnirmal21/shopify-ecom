"use client";

import React from "react";
import Link from "next/link";
import { useCartStore } from "../store/cart-store";
import { useWishlistStore } from "../store/wishlist-store";
import { ShoppingBag, Heart, Menu, User } from "lucide-react";
import Search from "./Search";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { setIsCartOpen, cart } = useCartStore();
  const { wishlist } = useWishlistStore();

  const cartCount = cart?.totalQuantity || 0;
  const wishlistCount = wishlist.length;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-500">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex h-20 items-center justify-between gap-8">
          <div className="flex flex-shrink-0 items-center justify-center">
            <Link href="/" className="flex flex-col items-center">
              <span className="text-2xl font-serif tracking-[0.1em] text-foreground uppercase">
                Vantage
              </span>
              <span className="text-[8px] tracking-[0.4em] text-primary font-bold uppercase -mt-1">
                Premium Selection
              </span>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center justify-end space-x-2 lg:space-x-6 flex-1">
            <div className="hidden lg:flex w-full max-w-xs">
              <Search />
            </div>
            <ThemeToggle />

            <Link
              href="/wishlist"
              className="group relative p-2 text-foreground/70 hover:text-primary transition-all"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative p-2 text-foreground/70 cursor-pointer hover:text-primary transition-all"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Clerk Authentication */}
            <div className="flex items-center">
              <Show when={"signed-out"}>
                <SignInButton mode="modal">
                  <button className="p-2 text-foreground/70 hover:text-primary transition-all cursor-pointer">
                    <User size={20} strokeWidth={1.5} />
                  </button>
                </SignInButton>
              </Show>
              <Show when={"signed-in"}>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8 border border-border/50",
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
          </div>
        </div>
      </div>
    </nav>
  );
}
