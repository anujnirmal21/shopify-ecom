import { GRAPHQL_QUERIES } from "@/lib/shopify";
import { ShopifyCollection, ShopifyProduct } from "@/lib/types";
import { shopifyFetch } from "@/lib/utils";

export async function getProducts(first = 20): Promise<ShopifyProduct[]> {
  const res = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>({
    query: GRAPHQL_QUERIES.GET_PRODUCTS,
    variables: { first },
  });

  return res.data.products.nodes;
}

export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
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
    cache: "no-store",
  });

  return res.data.search.nodes;
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  const res = await shopifyFetch<{
    collections: {
      nodes: {
        id: string;
        title: string;
        handle: string;
        image?: { url: string; altText?: string };
      }[];
    };
  }>({
    query: GRAPHQL_QUERIES.GET_COLLECTIONS,
  });

  return res.data.collections.nodes;
}

export async function getCollectionProducts(
  handle: string,
  first = 20,
): Promise<{ title: string; products: { nodes: ShopifyProduct[] } }> {
  const res = await shopifyFetch<{
    collection: { title: string; products: { nodes: ShopifyProduct[] } };
  }>({
    query: GRAPHQL_QUERIES.GET_COLLECTION_PRODUCTS,
    variables: { handle, first },
  });

  return res.data.collection;
}
