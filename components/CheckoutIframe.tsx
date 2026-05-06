"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Loader2,
  CheckCircle2,
  ExternalLink,
  RefreshCcw,
  ShieldCheck,
  Lock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { getCart } from "@/services/cart";
import { cn } from "@/lib/utils";

export function CheckoutIframe({ checkoutUrl }: { checkoutUrl: string }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  const clearCart = useCartStore((state) => state.clearCart);
  const cartId = useCartStore((state) => state.cartId);

  const popupRef = useRef<Window | null>(null);
  const hasOpenedRef = useRef(false);

  const checkStatus = useCallback(
    async (manual = false) => {
      if (!cartId) return;

      if (manual) setIsChecking(true);

      try {
        const currentCart = await getCart(cartId);

        const isCartEmpty =
          !currentCart || currentCart.lines?.nodes?.length === 0;

        if (isCartEmpty) {
          if (popupRef.current) {
            try {
              popupRef.current.close();
            } catch (err) {
              console.warn(err);
            }
          }

          setIsCompleted(true);
          toast.success("Purchase Successful!", {
            description:
              "Thank you for your order. Your cart has been cleared.",
          });

          if (clearCart) clearCart();
          document.cookie =
            "cartId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          setTimeout(() => {
            router.push("/");
          }, 5000);
        } else if (manual) {
          toast.info("Still Processing", {
            description:
              "Payment not yet confirmed. Please finish in the checkout window.",
          });
        }
      } catch (error) {
        console.error("[Checkout] Error during status check:", error);
      } finally {
        if (manual) setIsChecking(false);
      }
    },
    [cartId, clearCart, router],
  );

  const openCheckoutPopup = useCallback(() => {
    const width = 600;
    const height = 800;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      checkoutUrl,
      "ShopifyCheckout",
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`,
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      setPopupBlocked(true);
      return false;
    } else {
      setPopupBlocked(false);
      popupRef.current = popup;
      hasOpenedRef.current = true;
      return true;
    }
  }, [checkoutUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const success = openCheckoutPopup();
      setIsInitializing(false);
    }, 800);

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SHOPIFY_CHECKOUT_SUCCESS") {
        checkStatus();
      }
    };

    window.addEventListener("message", handleMessage);

    const pollInterval = setInterval(() => {
      if (!isCompleted && cartId) {
        checkStatus();
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", handleMessage);
      clearInterval(pollInterval);
    };
  }, [openCheckoutPopup, checkStatus, isCompleted, cartId]);

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-serif text-foreground">
            Order Confirmed
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Your purchase was successful. We've sent a confirmation email to
            your inbox.
          </p>
        </div>
        <button
          onClick={() => router.push("/profile")}
          className="bg-primary text-primary-foreground px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all border border-primary shadow-lg"
        >
          View Orders
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center">
      <div
        className={cn(
          "max-w-md w-full space-y-8 p-10 bg-muted/5 border border-border/40 rounded-3xl backdrop-blur-xl transition-all duration-700",
          isInitializing ? "opacity-50 scale-95" : "opacity-100 scale-100",
        )}
      >
        {isInitializing && (
          <div className="space-y-6 py-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto opacity-50" />
            <div className="space-y-2">
              <h2 className="text-xl font-serif">Preparing Gateway</h2>
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                Securing your transaction...
              </p>
            </div>
          </div>
        )}

        {!isInitializing && popupBlocked && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/5 mb-2">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-serif">Proceed to Payment</h2>
              <p className="text-muted-foreground text-sm leading-relaxed px-4">
                To keep your transaction secure, our payment gateway opens in a
                focused window. Please click below to continue.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <button
                onClick={() => {
                  const success = openCheckoutPopup();
                  if (success) setPopupBlocked(false);
                }}
                className="w-full flex items-center justify-center space-x-3 bg-primary text-primary-foreground h-16 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all border border-primary shadow-xl shadow-primary/10 group"
              >
                <Lock
                  size={14}
                  className="group-hover:text-primary transition-colors"
                />
                <span>Open Secure Window</span>
                <ExternalLink size={14} className="opacity-50" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground uppercase tracking-widest bg-muted/30 py-2 rounded-full">
                <AlertCircle size={10} />
                <span>Browser popup permission may be required</span>
              </div>
            </div>
          </div>
        )}

        {!isInitializing && !popupBlocked && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 scale-150" />
                <div className="relative h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-serif">Verification in Progress</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Please finalize your payment in the separate checkout window.
                This page will update automatically.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <button
                onClick={() => checkStatus(true)}
                disabled={isChecking}
                className="w-full flex items-center justify-center space-x-2 border border-primary/20 bg-background text-foreground h-16 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 group"
              >
                <RefreshCcw
                  size={14}
                  className={cn(
                    "group-hover:rotate-180 transition-transform duration-500",
                    isChecking && "animate-spin",
                  )}
                />
                <span>
                  {isChecking ? "Verifying..." : "Confirm My Purchase"}
                </span>
              </button>

              <div className="text-[9px] uppercase tracking-[0.4em] text-primary font-bold animate-pulse">
                Awaiting Gateway Confirmation
              </div>
            </div>
          </div>
        )}

        <div className="pt-6">
          <button
            onClick={() => router.back()}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5"
          >
            Cancel and Return to Cart
          </button>
        </div>
      </div>

      <div className="mt-10 flex items-center space-x-4 text-muted-foreground/30">
        <div className="h-px w-12 bg-current" />
        <span className="text-[8px] uppercase tracking-[0.4em] font-bold">
          256-Bit SSL Encryption
        </span>
        <div className="h-px w-12 bg-current" />
      </div>
    </div>
  );
}
