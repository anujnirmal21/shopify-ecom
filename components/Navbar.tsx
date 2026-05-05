"use client";

import { useState, useEffect, useRef } from "react";
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
import { cn } from "@/lib/utils";
import { useHasMounted } from "../hooks/use-has-mounted";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

// --- Sub-components ---

const Logo = () => (
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
);

const DesktopSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "hidden sm:flex items-center transition-all duration-500 ease-in-out h-10",
        isExpanded
          ? "w-64 xl:w-80 bg-muted/30 rounded-full px-4 border border-border/40 focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 shadow-sm"
          : "w-10 justify-center",
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "transition-colors cursor-pointer",
          isExpanded
            ? "text-primary mr-2"
            : "text-foreground/70 hover:text-accent",
        )}
        aria-label="Search"
      >
        <SearchIcon size={20} strokeWidth={1.25} />
      </button>

      <div
        className={cn(
          "transition-all duration-500",
          isExpanded
            ? "w-full opacity-100 overflow-visible"
            : "w-0 opacity-0 overflow-hidden",
        )}
      >
        <Search hideIcon={true} transparent={true} />
      </div>
    </div>
  );
};

interface NavActionsProps {
  wishlistCount: number;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  setIsMobileSearchOpen: (open: boolean) => void;
  isMobileSearchOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const NavActions = ({
  wishlistCount,
  cartCount,
  setIsCartOpen,
  setIsMobileSearchOpen,
  isMobileSearchOpen,
  setIsMobileMenuOpen,
}: NavActionsProps) => (
  <div className="flex-shrink-0 flex items-center justify-end gap-3 sm:gap-5 z-50">
    <DesktopSearch />

    <button
      onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
      className={cn(
        "sm:hidden p-2 transition-colors cursor-pointer",
        isMobileSearchOpen
          ? "text-accent"
          : "text-foreground/70 hover:text-accent",
      )}
      aria-label="Toggle Search"
    >
      <SearchIcon size={20} strokeWidth={1.25} />
    </button>

    <div className="hidden sm:block">
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

    <button
      onClick={() => setIsMobileMenuOpen(true)}
      className="sm:hidden p-2 text-foreground/70 hover:text-accent transition-colors cursor-pointer ml-1"
      aria-label="Open Menu"
    >
      <Menu size={24} strokeWidth={1.25} />
    </button>
  </div>
);

const MobileMenu = ({
  isOpen,
  onClose,
  wishlistCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  wishlistCount: number;
}) => (
  <div
    className={cn(
      "fixed inset-0 z-[100] sm:hidden transition-opacity duration-500",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
    )}
  >
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    />
    <div
      className={cn(
        "absolute inset-y-0 right-0 w-[85vw] max-w-[400px] bg-background border-l border-border/50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex items-center justify-between p-6 border-b border-border/30">
        <span className="text-2xl font-serif tracking-[0.1em] text-foreground uppercase">
          Vantage
        </span>
        <button
          onClick={onClose}
          className="p-2 -mr-2 text-foreground/50 hover:text-accent transition-colors cursor-pointer bg-muted/20 rounded-full"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-10">
        <Link
          href="/wishlist"
          onClick={onClose}
          className={cn(
            "mt-2 flex items-center gap-4 text-foreground/70 hover:text-accent transition-colors duration-500 transform",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
          style={{ transitionDelay: "450ms" }}
        >
          <Heart size={22} strokeWidth={1.25} />
          <span className="text-sm font-medium tracking-widest uppercase">
            My Wishlist ({wishlistCount})
          </span>
        </Link>
      </div>

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
              onClick={onClose}
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
);

// --- Main Navbar ---

export default function Navbar() {
  const { setIsCartOpen, cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const cartCount = hasMounted ? cart?.totalQuantity || 0 : 0;
  const wishlistCount = hasMounted ? wishlist.length : 0;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl transition-all duration-500">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <Logo />

            <NavActions
              wishlistCount={wishlistCount}
              cartCount={cartCount}
              setIsCartOpen={setIsCartOpen}
              setIsMobileSearchOpen={setIsMobileSearchOpen}
              isMobileSearchOpen={isMobileSearchOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </div>
        </div>

        {/* Mobile Search - Fixed Results visibility */}
        <div
          className={cn(
            "lg:hidden transition-all duration-500 ease-in-out border-t border-border/20 bg-background relative z-30",
            isMobileSearchOpen
              ? "opacity-100 visible h-auto"
              : "opacity-0 invisible h-0 overflow-hidden",
          )}
        >
          <div className="py-4 px-5">
            <Search />
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        wishlistCount={wishlistCount}
      />
    </>
  );
}
