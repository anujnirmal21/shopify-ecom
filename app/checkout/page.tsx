import { currentUser } from "@clerk/nextjs/server";
import { syncWithShopify } from "@/lib/auth-sync";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getCart } from "@/services/cart";
import { updateCartBuyerIdentity } from "@/services/customer";

export default async function CheckoutPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/checkout");
  }

  console.log(
    `[Checkout] Processing checkout for user: ${user.primaryEmailAddress?.emailAddress}`,
  );

  // 1. Ensure the user is synced with Shopify
  const syncResult = await syncWithShopify({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || "",
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
  });

  console.log(`[Checkout] Sync result:`, syncResult);

  // 2. Get the current cart ID from cookies
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  console.log(`[Checkout] Cart ID from cookie: ${cartId}`);

  if (!cartId) {
    console.warn(
      `[Checkout] No cart ID found in cookies. Redirecting to products.`,
    );
    redirect("/products");
  }

  // 3. Update the cart with the customer's identity
  const buyerIdentity: { customerAccessToken?: string; email: string } = {
    email: user.primaryEmailAddress?.emailAddress || "",
  };

  // Use the token from the cookie, or the one just returned from the sync result
  const shopifyToken =
    cookieStore.get("shopify_customer_token")?.value || syncResult.accessToken;
  if (shopifyToken) {
    buyerIdentity.customerAccessToken = shopifyToken;
    console.log(`[Checkout] Attaching customer access token to cart.`);
  }

  const identityResult = await updateCartBuyerIdentity(cartId, buyerIdentity);
  console.log(`[Checkout] Buyer identity update result:`, identityResult);

  if (identityResult.userErrors.length > 0) {
    console.error(
      `[Checkout] Failed to update buyer identity:`,
      identityResult.userErrors,
    );
    // Proceed anyway, Shopify might handle it or show error at checkout
  }

  // 4. Fetch the cart to get the final checkout URL
  // The updateCartBuyerIdentity mutation already returns the cart with the updated checkoutUrl
  const finalCart = identityResult.cart || (await getCart(cartId));

  if (finalCart?.checkoutUrl) {
    console.log(`[Checkout] Redirecting to: ${finalCart.checkoutUrl}`);
    redirect(finalCart.checkoutUrl);
  }

  console.error(`[Checkout] Could not determine checkout URL.`);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-background">
      <meta httpEquiv="refresh" content="3;url=/products" />
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg font-medium text-foreground">
        Something went wrong. Redirecting to products...
      </p>
    </div>
  );
}
