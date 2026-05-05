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

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  image?: { url: string; altText?: string };
}
