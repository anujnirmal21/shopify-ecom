import { currentUser } from "@clerk/nextjs/server";
import { syncWithShopify } from "@/lib/auth-sync";

import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Database,
  ShoppingBag,
  Calendar,
  Package,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { ShopifyOrder } from "@/lib/types";
import { getShopifyCustomer } from "@/services/customer";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Ensure Clerk user is synced with a Shopify customer account
  const syncResult = await syncWithShopify({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || "",
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
  });

  const cookieStore = await cookies();
  // Use the token from the cookie, or the one just returned from the sync result
  const shopifyToken =
    cookieStore.get("shopify_customer_token")?.value || syncResult.accessToken;

  let shopifyCustomer = null;
  if (shopifyToken) {
    shopifyCustomer = await getShopifyCustomer(shopifyToken);

    // If token is invalid/expired, re-sync once
    if (!shopifyCustomer) {
      const retrySync = await syncWithShopify({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      });
      if (retrySync.accessToken) {
        shopifyCustomer = await getShopifyCustomer(retrySync.accessToken);
      }
    }
  }

  const orders = shopifyCustomer?.orders?.edges || [];

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              My <span className="text-primary">Account</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your profile and view your order history.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sync Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Profile Summaries */}
          <div className="space-y-8 lg:col-span-1">
            {/* Clerk Profile Card */}
            <div className="overflow-hidden bg-card shadow-sm sm:rounded-2xl border border-border">
              <div className="px-6 py-5 bg-muted border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <ShieldCheck size={16} /> Identity
                </h3>
              </div>
              <div className="px-6 py-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Image
                      src={user.imageUrl}
                      alt={user.fullName || "User avatar"}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full ring-4 ring-muted"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-full shadow-sm">
                      <div className="bg-primary h-4 w-4 rounded-full border-2 border-background"></div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    {user.fullName}
                  </h4>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Mail size={14} /> {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Shopify Info Card */}
            <div className="overflow-hidden bg-card shadow-sm sm:rounded-2xl border border-border">
              <div className="px-6 py-5 bg-muted/50 border-b border-border">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <Database size={16} /> Commerce
                </h3>
              </div>
              <div className="px-6 py-6">
                {shopifyCustomer ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Customer ID
                      </span>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded truncate max-w-[120px]">
                        {shopifyCustomer.id.split("/").pop()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Status
                      </span>
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-400 uppercase">
                        Verified
                      </span>
                    </div>
                  </div>
                ) : syncResult.error === "CUSTOMER_DISABLED" ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-100 dark:border-amber-900/30 text-center">
                      <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase mb-2">
                        Action Required
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        Please check your email and click the verification link
                        to activate your Shopify commerce account.
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Status
                      </span>
                      <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                        Pending Verification
                      </span>
                    </div>
                  </div>
                ) : syncResult.error ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-center">
                      <p className="text-xs font-bold text-destructive uppercase mb-2">
                        Sync Error
                      </p>
                      <p className="text-xs text-destructive leading-relaxed">
                        {syncResult.error}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2">
            <div className="bg-card shadow-sm sm:rounded-2xl border border-border overflow-hidden min-h-[400px]">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ShoppingBag className="text-primary" size={20} /> Order
                  History
                </h3>
                <span className="bg-background border border-border text-xs font-bold text-muted-foreground px-3 py-1 rounded-full shadow-sm">
                  {orders.length} Orders
                </span>
              </div>

              <div className="divide-y divide-border">
                {orders.length > 0 ? (
                  orders.map(({ node: order }: { node: ShopifyOrder }) => (
                    <div
                      key={order.id}
                      className="p-6 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Package size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {order.name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar size={12} />{" "}
                              {new Date(order.processedAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: order.totalPrice.currencyCode,
                            }).format(parseFloat(order.totalPrice.amount))}
                          </p>
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase border border-primary/20">
                            Paid
                          </span>
                        </div>
                      </div>

                      {/* Line Items Preview */}
                      <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {order.lineItems.edges.map(
                          ({ node: item }, idx: number) => (
                            <div key={idx} className="flex-shrink-0 relative">
                              <div className="h-14 w-14 rounded-lg border border-border overflow-hidden bg-muted">
                                {item.variant?.image ? (
                                  <Image
                                    src={item.variant.image.url}
                                    alt={
                                      item.variant.image.altText || item.title
                                    }
                                    width={56}
                                    height={56}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                    <Package size={20} />
                                  </div>
                                )}
                              </div>
                              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-[10px] font-bold text-foreground">
                                {item.quantity}
                              </span>
                            </div>
                          ),
                        )}
                        {order.lineItems.edges.length > 5 && (
                          <div className="flex-shrink-0 h-14 w-14 rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-medium text-muted-foreground">
                            +{order.lineItems.edges.length - 5}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-border flex justify-end">
                        <Link
                          href="/"
                          className="text-xs font-bold text-primary hover:opacity-80 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Reorder Items <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                    <div className="rounded-full bg-muted p-6 mb-4">
                      <ShoppingBag
                        size={48}
                        className="text-muted-foreground"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-foreground">
                      No orders yet
                    </h4>
                    <p className="mt-2 text-muted-foreground max-w-sm">
                      When you place an order, it will appear here for you to
                      track and manage.
                    </p>
                    <Link
                      href="/products"
                      className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition-all"
                    >
                      Start Shopping <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
