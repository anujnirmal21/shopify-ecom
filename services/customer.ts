import { GRAPHQL_MUTATIONS, GRAPHQL_QUERIES } from "@/lib/shopify";
import { ShopifyCustomer, ShopifyUserError, ShopifyCart } from "@/lib/types";
import { shopifyFetch } from "@/lib/utils";

export async function createShopifyCustomer(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
): Promise<{
  customer: ShopifyCustomer;
  customerUserErrors: ShopifyUserError[];
}> {
  const res = await shopifyFetch<{
    customerCreate: {
      customer: ShopifyCustomer;
      customerUserErrors: ShopifyUserError[];
    };
  }>({
    query: GRAPHQL_MUTATIONS.CUSTOMER_CREATE,
    variables: {
      input: { email, password, firstName, lastName },
    },
    cache: "no-store",
  });
  return res.data.customerCreate;
}

export async function createCustomerAccessToken(
  email: string,
  password: string,
): Promise<{
  customerAccessToken: { accessToken: string; expiresAt: string };
  customerUserErrors: ShopifyUserError[];
}> {
  const res = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string };
      customerUserErrors: ShopifyUserError[];
    };
  }>({
    query: GRAPHQL_MUTATIONS.CUSTOMER_ACCESS_TOKEN_CREATE,
    variables: {
      input: { email, password },
    },
    cache: "no-store",
  });
  return res.data.customerAccessTokenCreate;
}

export async function getShopifyCustomer(
  customerAccessToken: string,
): Promise<ShopifyCustomer | null> {
  const res = await shopifyFetch<{ customer: ShopifyCustomer }>({
    query: GRAPHQL_QUERIES.GET_CUSTOMER,
    variables: { customerAccessToken },
    cache: "no-store",
  });
  return res.data.customer;
}

export async function updateCartBuyerIdentity(
  cartId: string,
  buyerIdentity: { customerAccessToken?: string; email?: string },
): Promise<{ cart: ShopifyCart; userErrors: ShopifyUserError[] }> {
  const res = await shopifyFetch<{
    cartBuyerIdentityUpdate: {
      cart: ShopifyCart;
      userErrors: ShopifyUserError[];
    };
  }>({
    query: GRAPHQL_MUTATIONS.CART_BUYER_IDENTITY_UPDATE,
    variables: {
      cartId,
      buyerIdentity,
    },
    cache: "no-store",
  });
  return res.data.cartBuyerIdentityUpdate;
}

export async function createShopifyCustomerAdmin(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
): Promise<{ customerId: string | null; error?: string }> {
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const storeDomain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

  if (!adminToken) {
    return { customerId: null, error: "ADMIN_TOKEN_MISSING" };
  }

  try {
    const response = await fetch(
      `https://${storeDomain}/admin/api/2024-04/customers.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({
          customer: {
            email,
            password,
            password_confirmation: password,
            first_name: firstName ?? "",
            last_name: lastName ?? "",
            verified_email: true, // ← skips activation email entirely
            send_email_welcome: false,
          },
        }),
        cache: "no-store",
      },
    );

    const json = await response.json();

    // Log non-2xx for easy debugging (401 = bad token, 403 = wrong scope, 422 = validation)
    if (!response.ok) {
      const status = response.status;
      const logFn = status === 422 ? console.warn : console.error;
      logFn(
        `[shopify] Admin API returned HTTP ${status}:`,
        JSON.stringify(json),
      );

      if (status === 401)
        return { customerId: null, error: "ADMIN_TOKEN_INVALID" };
      if (status === 403)
        return { customerId: null, error: "ADMIN_TOKEN_MISSING_SCOPE" };
    }

    if (json.errors) {
      // If email is taken, try to find the customer and update their password
      // so the sync can still succeed with the generated password.
      const isEmailTaken = JSON.stringify(json.errors).includes(
        "already been taken",
      );
      if (isEmailTaken) {
        try {
          // Search for the customer by email
          const searchResponse = await fetch(
            `https://${storeDomain}/admin/api/2024-04/customers/search.json?query=${encodeURIComponent(`email:"${email}"`)}`,
            {
              headers: { "X-Shopify-Access-Token": adminToken },
              cache: "no-store",
            },
          );
          const searchJson = (await searchResponse.json()) as {
            customers?: { id: number }[];
          };
          const existingCustomer = searchJson.customers?.[0];

          if (existingCustomer) {
            // Update the existing customer's password and verify their email
            const updateResponse = await fetch(
              `https://${storeDomain}/admin/api/2024-04/customers/${existingCustomer.id}.json`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "X-Shopify-Access-Token": adminToken,
                },
                body: JSON.stringify({
                  customer: {
                    id: existingCustomer.id,
                    password,
                    password_confirmation: password,
                    verified_email: true,
                  },
                }),
                cache: "no-store",
              },
            );

            if (updateResponse.ok) {
              return { customerId: existingCustomer.id.toString() };
            }
          }
        } catch (searchErr) {
          console.error(
            "[shopify] Failed to recovery sync for existing customer:",
            searchErr,
          );
        }
      }

      // Shopify Admin REST error values can be string or string[] — normalise both
      const errorMsg = Object.entries(
        json.errors as Record<string, string | string[]>,
      )
        .map(([field, msgs]) => {
          const list = Array.isArray(msgs) ? msgs : [msgs];
          return `${field}: ${list.join(", ")}`;
        })
        .join("; ");
      return { customerId: null, error: errorMsg };
    }

    const customerId = json.customer?.id?.toString() ?? null;
    return { customerId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[shopify] Admin API customer creation failed:", message);
    return { customerId: null, error: `NETWORK_ERROR: ${message}` };
  }
}
