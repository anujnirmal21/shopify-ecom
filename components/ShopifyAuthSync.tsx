"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { syncWithShopify } from "@/lib/auth-sync";

/**
 * Handles background syncing of Clerk users with Shopify.
 * This component ensures that the Shopify customer token is set correctly
 * in a secure cookie by using a dedicated API route, avoiding the 
 * "cannot set cookie during render" issue in Next.js.
 */
export function ShopifyAuthSync() {
  const { user, isLoaded } = useUser();
  const syncInProgress = useRef(false);

  useEffect(() => {
    async function performSync() {
      if (!isLoaded || !user || syncInProgress.current) return;
      
      syncInProgress.current = true;
      
      try {
        console.log("[ShopifyAuthSync] Synchronizing user:", user.primaryEmailAddress?.emailAddress);
        
        const result = await syncWithShopify({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
        });

        if (result.success && result.accessToken) {
          // Use the dedicated API route to set the cookie reliably
          const response = await fetch("/api/shopify/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: result.accessToken,
              expiresAt: result.expiresAt,
            }),
          });

          if (!response.ok) {
            console.error("[ShopifyAuthSync] Failed to set Shopify token via API");
          } else {
            console.log("[ShopifyAuthSync] Shopify token synchronized successfully");
          }
        } else if (result.error) {
          console.error("[ShopifyAuthSync] Synchronization error:", result.error);
        }
      } catch (error) {
        console.error("[ShopifyAuthSync] Unexpected error during sync:", error);
      } finally {
        syncInProgress.current = false;
      }
    }

    performSync();
  }, [user, isLoaded]);

  return null;
}
