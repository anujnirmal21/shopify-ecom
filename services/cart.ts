import { GRAPHQL_MUTATIONS, GRAPHQL_QUERIES } from "@/lib/shopify";
import { ShopifyCart } from "@/lib/types";
import { shopifyFetch } from "@/lib/utils";

export async function createCart(): Promise<ShopifyCart> {
  const res = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
    query: GRAPHQL_MUTATIONS.CREATE_CART,
    variables: { input: {} },
  });
  return res.data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1,
): Promise<ShopifyCart> {
  const res = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query: GRAPHQL_MUTATIONS.ADD_TO_CART,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });
  return res.data.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const res = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>({
    query: GRAPHQL_MUTATIONS.UPDATE_CART_LINE,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });
  return res.data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineId: string,
): Promise<ShopifyCart> {
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
    cache: "no-store",
  });
  return res.data.cart;
}
