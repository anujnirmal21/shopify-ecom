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
  variables?: any;
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
      next: { revalidate: 60 }, // Global revalidation as requested
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

export async function getProducts(first = 20) {
  const res = await shopifyFetch<{ products: { nodes: any[] } }>({
    query: GRAPHQL_QUERIES.GET_PRODUCTS,
    variables: { first },
  });

  return res.data.products.nodes;
}

export async function getProductByHandle(handle: string) {
  const res = await shopifyFetch<{ product: any }>({
    query: GRAPHQL_QUERIES.GET_PRODUCT,
    variables: { handle },
  });

  return res.data.product;
}

export async function searchProducts(query: string) {
  const res = await shopifyFetch<{ search: { nodes: any[] } }>({
    query: GRAPHQL_QUERIES.SEARCH_PRODUCTS,
    variables: { query },
    cache: 'no-store',
  });

  return res.data.search.nodes;
}

export async function getCollections() {
  const res = await shopifyFetch<{ collections: { nodes: any[] } }>({
    query: GRAPHQL_QUERIES.GET_COLLECTIONS,
  });

  return res.data.collections.nodes;
}

export async function getCollectionProducts(handle: string, first = 20) {
  const res = await shopifyFetch<{ collection: { title: string; products: { nodes: any[] } } }>({
    query: GRAPHQL_QUERIES.GET_COLLECTION_PRODUCTS,
    variables: { handle, first },
  });

  return res.data.collection;
}

export async function createCart() {
  const res = await shopifyFetch<{ cartCreate: { cart: any } }>({
    query: GRAPHQL_MUTATIONS.CREATE_CART,
    variables: { input: {} },
  });
  return res.data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  const res = await shopifyFetch<{ cartLinesAdd: { cart: any } }>({
    query: GRAPHQL_MUTATIONS.ADD_TO_CART,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });
  return res.data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const res = await shopifyFetch<{ cartLinesUpdate: { cart: any } }>({
    query: GRAPHQL_MUTATIONS.UPDATE_CART_LINE,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });
  return res.data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineId: string) {
  const res = await shopifyFetch<{ cartLinesRemove: { cart: any } }>({
    query: GRAPHQL_MUTATIONS.REMOVE_FROM_CART,
    variables: {
      cartId,
      lineIds: [lineId],
    },
  });
  return res.data.cartLinesRemove.cart;
}

export async function getCart(cartId: string) {
  const res = await shopifyFetch<{ cart: any }>({
    query: GRAPHQL_QUERIES.GET_CART,
    variables: { cartId },
  });
  return res.data.cart;
}

export async function createShopifyCustomer(email: string, password: string, firstName?: string, lastName?: string) {
  const res = await shopifyFetch<{ customerCreate: { customer: any, customerUserErrors: any[] } }>({
    query: GRAPHQL_MUTATIONS.CUSTOMER_CREATE,
    variables: {
      input: { email, password, firstName, lastName }
    },
    cache: 'no-store'
  });
  return res.data.customerCreate;
}

export async function createCustomerAccessToken(email: string, password: string) {
  const res = await shopifyFetch<{ customerAccessTokenCreate: { customerAccessToken: any, customerUserErrors: any[] } }>({
    query: GRAPHQL_MUTATIONS.CUSTOMER_ACCESS_TOKEN_CREATE,
    variables: {
      input: { email, password }
    },
    cache: 'no-store'
  });
  return res.data.customerAccessTokenCreate;
}

export async function getShopifyCustomer(customerAccessToken: string) {
  const res = await shopifyFetch<{ customer: any }>({
    query: GRAPHQL_QUERIES.GET_CUSTOMER,
    variables: { customerAccessToken },
    cache: 'no-store'
  });
  return res.data.customer;
}

export async function updateCartBuyerIdentity(cartId: string, buyerIdentity: { customerAccessToken?: string, email?: string }) {
  const res = await shopifyFetch<{ cartBuyerIdentityUpdate: { cart: any, userErrors: any[] } }>({
    query: GRAPHQL_MUTATIONS.CART_BUYER_IDENTITY_UPDATE,
    variables: {
      cartId,
      buyerIdentity
    },
    cache: 'no-store'
  });
  return res.data.cartBuyerIdentityUpdate;
}
