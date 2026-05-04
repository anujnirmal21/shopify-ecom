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

async function shopifyFetch<T>({
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

export const GRAPHQL_QUERIES = {
  GET_PRODUCTS: `
    query getProducts($first: Int) {
      products(first: $first) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            nodes {
              id
            }
          }
        }
      }
    }
  `,
  GET_CART: `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                  featuredImage {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `,
  GET_PRODUCT: `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        descriptionHtml
        images(first: 10) {
          nodes {
            url
            altText
            width
            height
          }
        }
        variants(first: 100) {
          nodes {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  `,
  SEARCH_PRODUCTS: `
    query searchProducts($query: String!) {
      search(query: $query, first: 10, types: PRODUCT) {
        nodes {
          ... on Product {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `,
  GET_COLLECTIONS: `
    query getCollections {
      collections(first: 10) {
        nodes {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  `,
  GET_COLLECTION_PRODUCTS: `
    query getCollectionProducts($handle: String!, $first: Int) {
      collection(handle: $handle) {
        title
        products(first: $first) {
          nodes {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              nodes {
                id
              }
            }
          }
        }
      }
    }
  `,
  GET_CUSTOMER: `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              name
              processedAt
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
};

export const GRAPHQL_MUTATIONS = {
  CREATE_CART: `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `,
  ADD_TO_CART: `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          totalQuantity
        }
      }
    }
  `,
  REMOVE_FROM_CART: `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          totalQuantity
        }
      }
    }
  `,
  UPDATE_CART_LINE: `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          totalQuantity
        }
      }
    }
  `,
  CUSTOMER_CREATE: `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `,
  CUSTOMER_ACCESS_TOKEN_CREATE: `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `,
  CART_BUYER_IDENTITY_UPDATE: `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
};

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    nodes: ShopifyProductVariant[];
  };
  images?: {
    nodes: {
      url: string;
      altText?: string;
      width: number;
      height: number;
    }[];
  };
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    nodes: ShopifyCartLine[];
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: ShopifyProductVariant & {
    product: {
      title: string;
      handle: string;
      featuredImage: {
        url: string;
        altText?: string;
      };
    };
  };
}

export async function getProducts(first = 20): Promise<ShopifyProduct[]> {
  const res = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>({
    query: GRAPHQL_QUERIES.GET_PRODUCTS,
    variables: { first },
  });

  return res.data.products.nodes;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const res = await shopifyFetch<{ product: ShopifyProduct }>({
    query: GRAPHQL_QUERIES.GET_PRODUCT,
    variables: { handle },
  });

  return res.data.product;
}

export async function searchProducts(query: string): Promise<ShopifyProduct[]> {
  const res = await shopifyFetch<{ search: { nodes: ShopifyProduct[] } }>({
    query: GRAPHQL_QUERIES.SEARCH_PRODUCTS,
    variables: { query },
    cache: 'no-store',
  });

  return res.data.search.nodes;
}

export async function getCollections(): Promise<{ id: string; title: string; handle: string; image?: { url: string; altText?: string } }[]> {
  const res = await shopifyFetch<{ collections: { nodes: { id: string; title: string; handle: string; image?: { url: string; altText?: string } }[] } }>({
    query: GRAPHQL_QUERIES.GET_COLLECTIONS,
  });

  return res.data.collections.nodes;
}

export async function getCollectionProducts(handle: string, first = 20): Promise<{ title: string; products: { nodes: ShopifyProduct[] } }> {
  const res = await shopifyFetch<{ collection: { title: string; products: { nodes: ShopifyProduct[] } } }>({
    query: GRAPHQL_QUERIES.GET_COLLECTION_PRODUCTS,
    variables: { handle, first },
  });

  return res.data.collection;
}

export async function createCart(): Promise<ShopifyCart> {
  const res = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
    query: GRAPHQL_MUTATIONS.CREATE_CART,
    variables: { input: {} },
  });
  return res.data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart> {
  const res = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query: GRAPHQL_MUTATIONS.ADD_TO_CART,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });
  return res.data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const res = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>({
    query: GRAPHQL_MUTATIONS.UPDATE_CART_LINE,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });
  return res.data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  const res = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>({
    query: GRAPHQL_MUTATIONS.REMOVE_FROM_CART,
    variables: {
      cartId,
      lineIds: [lineId],
    },
  });
  return res.data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const res = await shopifyFetch<{ cart: ShopifyCart }>({
    query: GRAPHQL_QUERIES.GET_CART,
    variables: { cartId },
  });
  return res.data.cart;
}

export interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  orders: {
    edges: {
      node: ShopifyOrder;
    }[];
  };
}

export interface ShopifyOrder {
  id: string;
  name: string;
  processedAt: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant?: {
          image?: {
            url: string;
            altText?: string;
          };
        };
      };
    }[];
  };
}

export interface ShopifyUserError {
  code: string;
  field: string[];
  message: string;
}

export async function createShopifyCustomer(email: string, password: string, firstName?: string, lastName?: string): Promise<{ customer: ShopifyCustomer, customerUserErrors: ShopifyUserError[] }> {
  const res = await shopifyFetch<{ customerCreate: { customer: ShopifyCustomer, customerUserErrors: ShopifyUserError[] } }>({
    query: GRAPHQL_MUTATIONS.CUSTOMER_CREATE,
    variables: {
      input: { email, password, firstName, lastName }
    },
    cache: 'no-store'
  });
  return res.data.customerCreate;
}

export async function createCustomerAccessToken(email: string, password: string): Promise<{ customerAccessToken: { accessToken: string, expiresAt: string }, customerUserErrors: ShopifyUserError[] }> {
  const res = await shopifyFetch<{ customerAccessTokenCreate: { customerAccessToken: { accessToken: string, expiresAt: string }, customerUserErrors: ShopifyUserError[] } }>({
    query: GRAPHQL_MUTATIONS.CUSTOMER_ACCESS_TOKEN_CREATE,
    variables: {
      input: { email, password }
    },
    cache: 'no-store'
  });
  return res.data.customerAccessTokenCreate;
}

export async function getShopifyCustomer(customerAccessToken: string): Promise<ShopifyCustomer | null> {
  const res = await shopifyFetch<{ customer: ShopifyCustomer }>({
    query: GRAPHQL_QUERIES.GET_CUSTOMER,
    variables: { customerAccessToken },
    cache: 'no-store'
  });
  return res.data.customer;
}

export async function updateCartBuyerIdentity(cartId: string, buyerIdentity: { customerAccessToken?: string, email?: string }): Promise<{ cart: ShopifyCart, userErrors: ShopifyUserError[] }> {
  const res = await shopifyFetch<{ cartBuyerIdentityUpdate: { cart: ShopifyCart, userErrors: ShopifyUserError[] } }>({
    query: GRAPHQL_MUTATIONS.CART_BUYER_IDENTITY_UPDATE,
    variables: {
      cartId,
      buyerIdentity
    },
    cache: 'no-store'
  });
  return res.data.cartBuyerIdentityUpdate;
}

/**
 * Creates a Shopify customer via the Admin REST API with email pre-verified.
 * This bypasses the activation email that the Storefront API always sends.
 * Requires a Private App / Custom App token with `write_customers` scope.
 */
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

  if (!adminToken || adminToken === 'your_admin_api_token_here') {
    return { customerId: null, error: 'ADMIN_TOKEN_MISSING' };
  }

  try {
    const response = await fetch(
      `https://${storeDomain}/admin/api/2024-04/customers.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({
          customer: {
            email,
            password,
            password_confirmation: password,
            first_name: firstName ?? '',
            last_name: lastName ?? '',
            verified_email: true,   // ← skips activation email entirely
            send_email_welcome: false,
          },
        }),
        cache: 'no-store',
      },
    );

    const json = await response.json();

    // Log non-2xx for easy debugging (401 = bad token, 403 = wrong scope, 422 = validation)
    if (!response.ok) {
      const status = response.status;
      const logFn = status === 422 ? console.warn : console.error;
      logFn(`[shopify] Admin API returned HTTP ${status}:`, JSON.stringify(json));
      
      if (status === 401) return { customerId: null, error: 'ADMIN_TOKEN_INVALID' };
      if (status === 403) return { customerId: null, error: 'ADMIN_TOKEN_MISSING_SCOPE' };
    }

    if (json.errors) {
      // If email is taken, try to find the customer and update their password
      // so the sync can still succeed with the generated password.
      const isEmailTaken = JSON.stringify(json.errors).includes('already been taken');
      if (isEmailTaken) {
        try {
          // Search for the customer by email
          const searchResponse = await fetch(
            `https://${storeDomain}/admin/api/2024-04/customers/search.json?query=${encodeURIComponent(`email:"${email}"`)}`,
            {
              headers: { 'X-Shopify-Access-Token': adminToken },
              cache: 'no-store',
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
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Shopify-Access-Token': adminToken,
                },
                body: JSON.stringify({
                  customer: {
                    id: existingCustomer.id,
                    password,
                    password_confirmation: password,
                    verified_email: true,
                  },
                }),
                cache: 'no-store',
              },
            );

            if (updateResponse.ok) {
              return { customerId: existingCustomer.id.toString() };
            }
          }
        } catch (searchErr) {
          console.error('[shopify] Failed to recovery sync for existing customer:', searchErr);
        }
      }

      // Shopify Admin REST error values can be string or string[] — normalise both
      const errorMsg = Object.entries(
        json.errors as Record<string, string | string[]>,
      )
        .map(([field, msgs]) => {
          const list = Array.isArray(msgs) ? msgs : [msgs];
          return `${field}: ${list.join(', ')}`;
        })
        .join('; ');
      return { customerId: null, error: errorMsg };
    }

    const customerId = json.customer?.id?.toString() ?? null;
    return { customerId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[shopify] Admin API customer creation failed:', message);
    return { customerId: null, error: `NETWORK_ERROR: ${message}` };
  }
}
