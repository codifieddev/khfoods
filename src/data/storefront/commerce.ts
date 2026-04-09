import "server-only";

import { render } from "@react-email/components";
import { ObjectId } from "mongodb";
import { getTranslations } from "next-intl/server";

import { OrderStatusEmail } from "@/components/Emails/OrderStatusEmail";
import type { Country } from "@/globals/(ecommerce)/Couriers/utils/countryList";
import { getMongoDb } from "@/data/mongo/client";
import { normalizeCollectionDocument } from "@/data/storefront/mongoPayload";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getFilledProducts, type FilledProduct } from "@/lib/getFilledProducts";
import { getTotal } from "@/lib/getTotal";
import { getTotalWeight } from "@/lib/getTotalWeight";
import type { CheckoutFormData } from "@/schemas/checkoutForm.schema";
import type { Cart } from "@/stores/CartStore/types";
import type { Currency } from "@/stores/Currency/types";
import type { WishList } from "@/stores/WishlistStore/types";
import type { Order, Payment, Product } from "@/types/cms";
import { sendEmail } from "@/utilities/nodemailer";

const buildIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

const mapDocumentId = <T extends Record<string, unknown>>(document: T) => {
  const mappedDocument: Record<string, unknown> = {
    ...document,
    _id: document._id instanceof ObjectId ? document._id : document._id,
  };

  if (!mappedDocument.id && mappedDocument._id instanceof ObjectId) {
    mappedDocument.id = mappedDocument._id.toString();
  }

  if (!mappedDocument.id && typeof mappedDocument._id === "string") {
    mappedDocument.id = mappedDocument._id;
  }

  return mappedDocument;
};

const getOrderNumber = async () => {
  const db = await getMongoDb();
  const lastOrder = await db
    .collection("orders")
    .find({}, { projection: { id: 1 } })
    .sort({ id: -1 })
    .limit(1)
    .next();

  const lastId = typeof lastOrder?.id === "string" ? lastOrder.id : "00000000";
  return (Number.parseInt(lastId, 10) + 1).toString().padStart(8, "0");
};

const disabledOrderStatusEmails: Order["orderDetails"]["status"][] = ["cancelled", "completed", "pending"];

const sendOrderStatusUpdateEmail = async (order: Order, locale: Locale = defaultLocale) => {
  if (disabledOrderStatusEmails.includes(order.orderDetails.status)) {
    return;
  }

  const t = await getTranslations({ locale, namespace: "Order" });
  const html = await render(await OrderStatusEmail({ locale, order }));

  await sendEmail({
    html,
    subject: t(`${order.orderDetails.status}.title`),
    to: order.shippingAddress.email,
  });
};

const restoreOrderStocks = async (order: Order) => {
  if (!order.extractedFromStock || !order.products?.length) {
    return;
  }

  const db = await getMongoDb();
  const now = new Date().toISOString();

  await Promise.all(
    order.products.map(async (product) => {
      if (!product.id || typeof product.quantity !== "number") {
        return;
      }

      const rawProduct = await db.collection("products").findOne({
        _id: { $in: buildIdCandidates(product.id) },
      } as any);

      if (!rawProduct) {
        return;
      }

      if (rawProduct.enableVariants && product.variantSlug) {
        await db.collection("products").updateOne(
          {
            _id: rawProduct._id,
          },
          {
            $inc: {
              "variants.$[variant].stock": product.quantity,
            },
            $set: {
              updatedAt: now,
            },
          },
          {
            arrayFilters: [{ "variant.variantSlug": product.variantSlug }],
          },
        );
        return;
      }

      await db.collection("products").updateOne(
        {
          _id: rawProduct._id,
        },
        {
          $inc: {
            stock: product.quantity,
          },
          $set: {
            updatedAt: now,
          },
        },
      );
    }),
  );

  await db.collection("orders").updateOne(
    {
      id: order.id,
    },
    {
      $set: {
        extractedFromStock: false,
        updatedAt: now,
      },
    },
  );
};

export const getStorefrontProductsByIds = async ({
  ids,
  locale,
}: {
  ids: string[];
  locale: Locale;
}) => {
  if (ids.length === 0) {
    return [] as Product[];
  }

  const db = await getMongoDb();
  const uniqueCandidates = Array.from(
    new Map(
      ids.flatMap((id) => buildIdCandidates(id)).map((candidate) => [candidate.toString(), candidate]),
    ).values(),
  );

  const rawProducts = await db
    .collection("products")
    .find({
      $or: uniqueCandidates.map((candidate) => ({ _id: candidate })),
      _status: "published",
    } as any)
    .toArray();

  const products = await Promise.all(
    rawProducts.map((rawProduct) =>
      normalizeCollectionDocument("products", rawProduct as Record<string, unknown>, locale, 2),
    ),
  );

  return products.filter(Boolean) as Product[];
};

export const getCartProductsWithTotals = async ({
  cart,
  locale,
}: {
  cart: Cart | undefined;
  locale: Locale;
}) => {
  if (!cart || cart.length === 0) {
    return {
      filledProducts: [],
      total: [],
      totalQuantity: 0,
    };
  }

  const products = await getStorefrontProductsByIds({
    ids: cart.map((product) => product.id),
    locale,
  });

  const filledProducts = getFilledProducts(products, cart);

  return {
    filledProducts,
    total: getTotal(filledProducts),
    totalQuantity: filledProducts.reduce((acc, product) => acc + (product?.quantity ?? 0), 0),
  };
};

export const getWishlistProducts = async ({
  locale,
  wishlist,
}: {
  locale: Locale;
  wishlist: WishList | undefined;
}) => {
  if (!wishlist || wishlist.length === 0) {
    return [];
  }

  const products = await getStorefrontProductsByIds({
    ids: wishlist.map((product) => product.id),
    locale,
  });

  return getFilledProducts(products, wishlist);
};

export const updateCustomerCart = async ({
  cart,
  customerId,
}: {
  cart: Cart;
  customerId: string;
}) => {
  const db = await getMongoDb();
  await db.collection("customers").updateOne(
    {
      _id: { $in: buildIdCandidates(customerId) },
    } as any,
    {
      $set: {
        cart: JSON.stringify(cart),
        updatedAt: new Date().toISOString(),
      },
    },
  );
};

export const updateCustomerWishlist = async ({
  customerId,
  wishlist,
}: {
  customerId: string;
  wishlist: WishList;
}) => {
  const db = await getMongoDb();
  await db.collection("customers").updateOne(
    {
      _id: { $in: buildIdCandidates(customerId) },
    } as any,
    {
      $set: {
        updatedAt: new Date().toISOString(),
        wishlist: JSON.stringify(wishlist),
      },
    },
  );
};

export const updateCustomerLastBuyerType = async ({
  buyerType,
  customerId,
}: {
  buyerType: "individual" | "company";
  customerId: string;
}) => {
  const db = await getMongoDb();
  await db.collection("customers").updateOne(
    {
      _id: { $in: buildIdCandidates(customerId) },
    } as any,
    {
      $set: {
        lastBuyerType: buyerType,
        updatedAt: new Date().toISOString(),
      },
    },
  );
};

export const getStorefrontPaymentSettings = async () => {
  const db = await getMongoDb();
  const payment = await db.collection("payment").findOne({}, { sort: { createdAt: 1 } });

  if (!payment) {
    return null;
  }

  return mapDocumentId(payment as Record<string, unknown>) as unknown as Payment;
};

type CreateStorefrontOrderArgs = {
  cart: Cart;
  checkoutData: CheckoutFormData;
  currency: Currency;
  customerId?: string;
  filledProducts: FilledProduct[];
  selectedCountry: Country;
  shippingCost: number;
  shippingMethod: string;
  totalWeight: number;
};

export const createStorefrontOrder = async ({
  cart,
  checkoutData,
  currency,
  customerId,
  filledProducts,
  shippingCost,
  shippingMethod,
  totalWeight,
}: CreateStorefrontOrderArgs) => {
  const db = await getMongoDb();
  const now = new Date().toISOString();
  const total = getTotal(filledProducts);
  const orderId = await getOrderNumber();

  const orderDocument = {
    createdAt: now,
    customer: customerId ?? undefined,
    date: now,
    extractedFromStock: true,
    id: orderId,
    invoice: {
      address:
        checkoutData.individualInvoice && checkoutData.invoice
          ? checkoutData.invoice.address
          : checkoutData.shipping.address,
      city:
        checkoutData.individualInvoice && checkoutData.invoice
          ? checkoutData.invoice.city
          : checkoutData.shipping.city,
      country:
        checkoutData.individualInvoice && checkoutData.invoice
          ? checkoutData.invoice.country
          : checkoutData.shipping.country,
      isCompany: checkoutData.buyerType === "company",
      name:
        checkoutData.individualInvoice && checkoutData.invoice
          ? checkoutData.invoice.name
          : checkoutData.shipping.name,
      postalCode:
        checkoutData.individualInvoice && checkoutData.invoice
          ? checkoutData.invoice.postalCode
          : checkoutData.shipping.postalCode,
      region:
        checkoutData.individualInvoice && checkoutData.invoice
          ? checkoutData.invoice.region
          : checkoutData.shipping.region,
      tin: checkoutData.buyerType === "company" ? checkoutData.invoice?.tin : undefined,
    },
    orderDetails: {
      currency,
      shipping: shippingMethod,
      shippingCost,
      status: "pending",
      total: total.find((price) => price.currency === currency)?.value ?? 0,
      totalWithShipping: (total.find((price) => price.currency === currency)?.value ?? 0) + shippingCost,
    },
    printLabel: {
      weight: totalWeight / 1000,
    },
    products: filledProducts.map((product) => ({
      color: product.variant?.color?.slug ?? undefined,
      hasVariant: product.enableVariants && product.variant ? true : false,
      id: product.id,
      isFromAPI: true,
      price:
        product.variant?.pricing && product.enableVariantPrices
          ? (product.variant.pricing.find((price) => price.currency === currency)?.value ?? 0)
          : (product.pricing?.find((price) => price.currency === currency)?.value ?? 0),
      priceTotal:
        ((product.variant?.pricing && product.enableVariantPrices
          ? (product.variant.pricing.find((price) => price.currency === currency)?.value ?? 0)
          : (product.pricing?.find((price) => price.currency === currency)?.value ?? 0)) *
          (product.quantity ?? 0)),
      product: product.id,
      productName: product.title,
      quantity: product.quantity ?? 0,
      size: product.variant?.size?.slug ?? undefined,
      variantSlug: product.variant?.variantSlug ?? undefined,
    })),
    shippingAddress: {
      address: checkoutData.shipping.address,
      city: checkoutData.shipping.city,
      country: checkoutData.shipping.country,
      email: checkoutData.shipping.email,
      name: checkoutData.shipping.name,
      phone: checkoutData.shipping.phone,
      pickupPointAddress: checkoutData.shipping.pickupPointAddress,
      pickupPointID: checkoutData.shipping.pickupPointID,
      postalCode: checkoutData.shipping.postalCode,
      region: checkoutData.shipping.region,
    },
    updatedAt: now,
  };

  await db.collection("orders").insertOne(orderDocument);

  await Promise.all(
    filledProducts.map(async (product) => {
      const nextBought = (product.bought ?? 0) + (product.quantity ?? 0);

      if (product.enableVariants && product.variant?.variantSlug) {
        const nextVariantStock =
          typeof product.variant.stock === "number"
            ? Math.max(0, product.variant.stock - (product.quantity ?? 0))
            : undefined;

        await db.collection("products").updateOne(
          {
            _id: { $in: buildIdCandidates(product.id) },
          } as any,
          {
            $set: {
              bought: nextBought,
              ...(nextVariantStock !== undefined && { "variants.$[variant].stock": nextVariantStock }),
              updatedAt: now,
            },
          },
          {
            arrayFilters:
              nextVariantStock !== undefined
                ? [{ "variant.variantSlug": product.variant.variantSlug }]
                : undefined,
          },
        );
        return;
      }

      const nextStock = typeof product.stock === "number" ? Math.max(0, product.stock - (product.quantity ?? 0)) : 0;

      await db.collection("products").updateOne(
        {
          _id: { $in: buildIdCandidates(product.id) },
        } as any,
        {
          $set: {
            bought: nextBought,
            stock: nextStock,
            updatedAt: now,
          },
        },
      );
    }),
  );

  return orderDocument as Order;
};

export const getCheckoutProductsWithCouriers = async ({
  cart,
  locale,
}: {
  cart: Cart | undefined;
  locale: Locale;
}) => {
  const productsWithTotals = await getCartProductsWithTotals({ cart, locale });

  return {
    ...productsWithTotals,
    totalWeight: cart ? getTotalWeight(productsWithTotals.filledProducts, cart) : 0,
  };
};

export const getStorefrontOrderByNumber = async (id: string) => {
  const db = await getMongoDb();
  const order = await db.collection("orders").findOne({ id });

  if (!order) {
    return null;
  }

  return mapDocumentId(order as Record<string, unknown>) as unknown as Order;
};

export const getStorefrontOrderByPackageNumber = async (packageNumber: string | number) => {
  const db = await getMongoDb();
  const order = await db.collection("orders").findOne({
    $or: [
      { "printLabel.packageNumber": packageNumber },
      { "printLabel.packageNumber": String(packageNumber) },
    ],
  });

  if (!order) {
    return null;
  }

  return mapDocumentId(order as Record<string, unknown>) as unknown as Order;
};

export const updateStorefrontOrderStatus = async ({
  amountPaid,
  locale = defaultLocale,
  orderNumber,
  status,
  trackingNumber,
  transactionID,
}: {
  amountPaid?: number;
  locale?: Locale;
  orderNumber: string;
  status: Order["orderDetails"]["status"];
  trackingNumber?: string;
  transactionID?: string;
}) => {
  const db = await getMongoDb();
  const existingOrder = await getStorefrontOrderByNumber(orderNumber);

  if (!existingOrder) {
    return null;
  }

  const previousStatus = existingOrder.orderDetails.status;
  const now = new Date().toISOString();
  const updateFields: Record<string, unknown> = {
    "orderDetails.status": status,
    updatedAt: now,
  };

  if (transactionID !== undefined) {
    updateFields["orderDetails.transactionID"] = transactionID;
  }

  if (amountPaid !== undefined) {
    updateFields["orderDetails.amountPaid"] = amountPaid;
  }

  if (trackingNumber !== undefined) {
    updateFields["orderDetails.trackingNumber"] = trackingNumber;
  }

  await db.collection("orders").updateOne(
    {
      id: orderNumber,
    },
    {
      $set: updateFields,
    },
  );

  const updatedOrder: Order = {
    ...existingOrder,
    updatedAt: now,
    orderDetails: {
      ...existingOrder.orderDetails,
      ...(amountPaid !== undefined ? { amountPaid } : {}),
      status,
      ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      ...(transactionID !== undefined ? { transactionID } : {}),
    },
  };

  if (status === "cancelled") {
    await restoreOrderStocks(updatedOrder);
  }

  if (previousStatus !== status) {
    await sendOrderStatusUpdateEmail(updatedOrder, locale);
  }

  return updatedOrder;
};

export const updateStorefrontOrderStatusByPackageNumber = async ({
  locale = defaultLocale,
  packageNumber,
  status,
  trackingNumber,
}: {
  locale?: Locale;
  packageNumber: string | number;
  status: Order["orderDetails"]["status"];
  trackingNumber?: string;
}) => {
  const order = await getStorefrontOrderByPackageNumber(packageNumber);

  if (!order) {
    return null;
  }

  return updateStorefrontOrderStatus({
    locale,
    orderNumber: order.id,
    status,
    trackingNumber,
  });
};

export const getStorefrontCustomerOrders = async ({
  customerId,
  locale,
}: {
  customerId: string;
  locale: Locale;
}) => {
  const db = await getMongoDb();
  const rawOrders = await db
    .collection("orders")
    .find({
      customer: { $in: buildIdCandidates(customerId) },
    } as any)
    .sort({ createdAt: -1 })
    .toArray();

  if (rawOrders.length === 0) {
    return [] as Order[];
  }

  const productIds = Array.from(
    new Set(
      rawOrders.flatMap((order) =>
        Array.isArray(order.products)
          ? order.products
              .map((product) => {
                if (!product || typeof product !== "object") {
                  return null;
                }

                const typedProduct = product as { product?: unknown; id?: unknown };

                if (typeof typedProduct.product === "string") {
                  return typedProduct.product;
                }

                if (
                  typedProduct.product &&
                  typeof typedProduct.product === "object" &&
                  "id" in typedProduct.product &&
                  typeof (typedProduct.product as { id?: unknown }).id === "string"
                ) {
                  return (typedProduct.product as { id: string }).id;
                }

                return typeof typedProduct.id === "string" ? typedProduct.id : null;
              })
              .filter((id): id is string => Boolean(id))
          : [],
      ),
    ),
  );

  const products = await getStorefrontProductsByIds({ ids: productIds, locale });
  const productsById = new Map(products.map((product) => [product.id, product]));

  return rawOrders.map((rawOrder) => {
    const mappedOrder = mapDocumentId(rawOrder as Record<string, unknown>) as Record<string, unknown>;
    const orderProducts = Array.isArray(mappedOrder.products)
      ? mappedOrder.products.map((product) => {
          if (!product || typeof product !== "object") {
            return product;
          }

          const typedProduct = product as Record<string, unknown>;
          const productRelation = typedProduct.product;
          const productId =
            typeof productRelation === "string"
              ? productRelation
              : productRelation &&
                  typeof productRelation === "object" &&
                  "id" in productRelation &&
                  typeof (productRelation as { id?: unknown }).id === "string"
                ? ((productRelation as { id: string }).id ?? null)
                : typeof typedProduct.id === "string"
                  ? typedProduct.id
                  : null;

          return {
            ...typedProduct,
            ...(productId ? { product: productsById.get(productId) ?? productRelation } : {}),
          };
        })
      : mappedOrder.products;

    return {
      ...mappedOrder,
      products: orderProducts,
    } as unknown as Order;
  });
};

export const getFilledOrderProducts = async ({
  locale,
  orderProducts,
}: {
  locale: Locale;
  orderProducts: Order["products"] | null;
}) => {
  if (!orderProducts || orderProducts.length === 0) {
    return [];
  }

  const products = await Promise.all(
    orderProducts.map(async (product) => {
      const productId =
        typeof product.product === "string" ? product.product : (product.product?.id ?? product.id ?? "");

      if (!productId) {
        return null;
      }

      const [filledProduct] = await getStorefrontProductsByIds({ ids: [productId], locale });

      if (!filledProduct) {
        return null;
      }

      return {
        ...product,
        ...filledProduct,
      };
    }),
  );

  return products.filter((product): product is NonNullable<typeof product> => Boolean(product));
};

export const getStorefrontProductBySlug = async ({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) => {
  const db = await getMongoDb();
  const rawProduct = await db.collection("products").findOne({
    slug,
    _status: "published",
  } as any);

  if (!rawProduct) {
    return null;
  }

  return normalizeCollectionDocument(
    "products",
    rawProduct as Record<string, unknown>,
    locale,
    2,
  ) as Promise<Product>;
};
