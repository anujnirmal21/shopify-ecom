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
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="rounded-lg bg-primary p-1.5 text-primary-foreground transition-transform group-hover:rotate-12 shadow-sm shadow-primary/20">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Shopify
                <span className="text-primary">Ecom</span>
              </span>
            </Link>
          </div>

          {/* Search - Hidden on small mobile */}
          <div className="hidden flex-1 sm:flex justify-center">
            <Search />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <ThemeToggle />

            <Link
              href="/wishlist"
              className="group relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-background">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative rounded-full p-2 text-muted-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Clerk Authentication */}
            <div className="flex items-center">
              <Show when={"signed-out"}>
                <SignInButton mode="modal">
                  <button className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer">
                    <User size={22} />
                  </button>
                </SignInButton>
              </Show>
              <Show when={"signed-in"}>
                <div className="flex items-center space-x-4">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-9 w-9",
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
                </div>
              </Show>
            </div>

            <button className="sm:hidden rounded-full p-2 text-muted-foreground hover:bg-accent transition-colors">
              <Menu size={22} className=" cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search - Visible only on mobile */}
      <div className="sm:hidden px-4 pb-3">
        <Search />
      </div>
    </nav>
  );
}
