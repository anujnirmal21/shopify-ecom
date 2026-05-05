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
              availableForSale
              quantityAvailable
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
                availableForSale
                quantityAvailable
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
        handle
        description
        descriptionHtml
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
            quantityAvailable
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
            variants(first: 1) {
              nodes {
                id
                availableForSale
                quantityAvailable
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
                availableForSale
                quantityAvailable
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
