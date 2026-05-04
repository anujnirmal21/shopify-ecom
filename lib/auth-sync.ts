"use server";

import {
  createShopifyCustomer,
  createShopifyCustomerAdmin,
  createCustomerAccessToken,
} from "./shopify";
import { cookies } from "next/headers";
import { createHash } from "crypto";

const SHOPIFY_PASSWORD_SALT =
  process.env.SHOPIFY_PASSWORD_SALT || "default_salt_for_dev_only";

/**
 * Generates a stable, unique password for the Shopify shadow account
 * based on the Clerk User ID.
 * Shopify limits passwords to 40 characters.
 */
function generateShopifyPassword(clerkUserId: string) {
  return createHash("sha256")
    .update(`${clerkUserId}${SHOPIFY_PASSWORD_SALT}`)
    .digest("hex")
    .slice(0, 32);
}

export async function syncWithShopify(clerkUser: {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  const password = generateShopifyPassword(clerkUser.id);
  const cookieStore = await cookies();

  // 1. Try to log in — works if the customer already exists and is verified
  let authResult = await createCustomerAccessToken(clerkUser.email, password);

  // CUSTOMER_DISABLED: account exists but was never verified via activation email.
  // This cannot be resolved programmatically via the Storefront API.
  const isDisabled = authResult.customerUserErrors.some(
    (e) => e.code === "CUSTOMER_DISABLED",
  );
  if (isDisabled) {
    console.warn(
      `[auth-sync] Shopify account for ${clerkUser.email} is disabled ` +
        `(email not verified). Set SHOPIFY_ADMIN_ACCESS_TOKEN to pre-verify future accounts.`,
    );
    return { success: false, error: "CUSTOMER_DISABLED" };
  }

  // 2. Customer doesn't exist yet — create them
  if (
    authResult.customerUserErrors.some(
      (e) => e.code === "UNIDENTIFIED_CUSTOMER",
    )
  ) {
    // Preferred path: Admin REST API sets verified_email=true → no activation email
    const adminResult = await createShopifyCustomerAdmin(
      clerkUser.email,
      password,
      clerkUser.firstName,
      clerkUser.lastName,
    );

    if (adminResult.error) {
      const shouldFallback =
        adminResult.error === "ADMIN_TOKEN_MISSING" ||
        adminResult.error === "ADMIN_TOKEN_INVALID" ||
        adminResult.error === "ADMIN_TOKEN_MISSING_SCOPE";

      if (shouldFallback) {
        // Fallback: Storefront API — customer WILL receive an activation email
        console.warn(
          `[auth-sync] Admin API unavailable (${adminResult.error}). ` +
            "Falling back to Storefront API — customer will get an activation email.",
        );
        const createResult = await createShopifyCustomer(
          clerkUser.email,
          password,
          clerkUser.firstName,
          clerkUser.lastName,
        );
        if (createResult.customerUserErrors.length > 0) {
          console.error(
            "[auth-sync] Storefront API customer creation failed:",
            createResult.customerUserErrors,
          );
          return { error: createResult.customerUserErrors[0].message };
        }
      } else if (!adminResult.error.includes("has already been taken")) {
        // Genuine error (not a duplicate)
        console.error(
          "[auth-sync] Admin API customer creation failed:",
          adminResult.error,
        );
        return { error: adminResult.error };
      }
      // "email already taken" → created previously, just try logging in
    }

    // 3. Re-attempt login after account creation
    authResult = await createCustomerAccessToken(clerkUser.email, password);
  }

  // Post-creation CUSTOMER_DISABLED check (only possible via Storefront API fallback)
  const stillDisabled = authResult.customerUserErrors.some(
    (e) => e.code === "CUSTOMER_DISABLED",
  );
  if (stillDisabled) {
    return { success: false, error: "CUSTOMER_DISABLED" };
  }

  if (authResult.customerAccessToken) {
    const { accessToken, expiresAt } = authResult.customerAccessToken;

    // 4. Store the token in a secure, httpOnly cookie
    try {
      cookieStore.set("shopify_customer_token", accessToken, {
        expires: new Date(expiresAt),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    } catch {
      // Silence error if called during render. The token is still returned
      // so the current request can proceed.
      console.debug(
        "[auth-sync] Cookie could not be set (likely called during render). " +
          "Token will be used for current request only.",
      );
    }

    return { success: true, accessToken };
  }

  return {
    error: authResult.customerUserErrors[0]?.message || "Authentication failed",
  };
}
