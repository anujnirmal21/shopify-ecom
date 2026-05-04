import { createShopifyCustomer, createCustomerAccessToken } from "./shopify";
import { cookies } from "next/headers";

const SHOPIFY_PASSWORD_SALT =
  process.env.SHOPIFY_PASSWORD_SALT || "default_salt_for_dev_only";

/**
 * Generates a stable, unique password for the Shopify shadow account
 * based on the Clerk User ID.
 */
function generateShopifyPassword(clerkUserId: string) {
  // In a real app, use a more secure hashing method
  return `${clerkUserId}_${SHOPIFY_PASSWORD_SALT}`;
}

export async function syncWithShopify(clerkUser: {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  const password = generateShopifyPassword(clerkUser.id);
  const cookieStore = await cookies();

  // 1. Try to get an access token (Login)
  let authResult = await createCustomerAccessToken(clerkUser.email, password);

  // Handle specific errors like CUSTOMER_DISABLED immediately
  let isDisabled = authResult.customerUserErrors.some(
    (error) => error.code === "CUSTOMER_DISABLED",
  );
  if (isDisabled) {
    return { success: false, error: "CUSTOMER_DISABLED" };
  }

  // 2. If login fails because user doesn't exist, create the customer
  if (
    authResult.customerUserErrors.some(
      (error) => error.code === "UNIDENTIFIED_CUSTOMER",
    )
  ) {
    const createResult = await createShopifyCustomer(
      clerkUser.email,
      password,
      clerkUser.firstName,
      clerkUser.lastName,
    );

    if (createResult.customerUserErrors.length > 0) {
      console.error(
        "Failed to create Shopify customer:",
        createResult.customerUserErrors,
      );
      return { error: createResult.customerUserErrors[0].message };
    }

    // 3. Try login again after creation
    authResult = await createCustomerAccessToken(clerkUser.email, password);
  }

  // Handle specific errors like CUSTOMER_DISABLED
  isDisabled = authResult.customerUserErrors.some(
    (error) => error.code === "CUSTOMER_DISABLED",
  );
  if (isDisabled) {
    console.warn(
      `Shopify customer account for ${clerkUser.email} is disabled (verification pending). Proceeding without token.`,
    );
    return { success: false, error: "CUSTOMER_DISABLED" };
  }

  if (authResult.customerAccessToken) {
    const { accessToken, expiresAt } = authResult.customerAccessToken;

    // 4. Store the token in a secure cookie
    cookieStore.set("shopify_customer_token", accessToken, {
      expires: new Date(expiresAt),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true, accessToken };
  }

  return {
    error: authResult.customerUserErrors[0]?.message || "Authentication failed",
  };
}
