import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: string | number, currencyCode: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(typeof amount === "string" ? parseFloat(amount) : amount);
}

const domain =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  throw new Error("Missing Shopify environment variables");
}

const endpoint = `https://${domain}/api/2024-04/graphql.json`;

export async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache",
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<{ data: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
      },
      body: JSON.stringify({ query, variables }),
      // Only set revalidate if not bypassing cache
      ...(cache === "no-store" ? { cache } : { next: { revalidate: 60 } }),
    });

    return result.json();
  } catch (error) {
    console.error("Error fetching from Shopify:", error);
    throw new Error("Failed to fetch from Shopify");
  }
}
