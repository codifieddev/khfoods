"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import debounce from "lodash.debounce";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PriceClient } from "@/components/(ecommerce)/PriceClient";
import { QuantityInput } from "@/components/(ecommerce)/QuantityInput";
import { Media as MediaComponent } from "@/components/Media";
import { type FilledVariant } from "@/globals/(ecommerce)/Layout/ProductDetails/types";
import { type Locale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { type Media, type Product } from "@/payload-types";
import { useCart } from "@/stores/CartStore";
import { type Cart } from "@/stores/CartStore/types";
import { type Currency } from "@/stores/Currency/types";

export type ProductWithFilledVariants = Omit<Product, "variants" | "pricing"> & {
  variant: FilledVariant | undefined;
  image: Media | null;
  quantity: number;
  pricing: {
    value: number;
    currency: Currency;
    id?: string | null;
  }[];
};

const CartPage = () => {
  const { cart, updateCart, setCart, removeFromCart } = useCart();

  const [cartProducts, setCartProducts] = useState<ProductWithFilledVariants[]>([]);
  const [total, setTotal] = useState<
    {
      currency: Currency;
      value: number;
    }[]
  >([]);

  const locale = useLocale() as Locale;
  const t = useTranslations("Cart");

  const fetchCartProducts = useCallback(
    async (cartToCalculate: Cart | null) => {
      try {
        const { data } = await axios.post<{
          status: number;
          productsWithTotal: {
            filledProducts: ProductWithFilledVariants[];
            total: {
              currency: Currency;
              value: number;
            }[];
            totalQuantity: number;
          };
        }>("/next/cartProducts", { cart: cartToCalculate, locale });
        const { filledProducts = [], total = [] } = data.productsWithTotal;
        setCartProducts(filledProducts);
        setTotal(total);
      } catch (error) {
        console.error(error);
      }
    },
    [locale, setCartProducts, setTotal],
  );

  const debouncedFetchCartProducts = useMemo(() => debounce(fetchCartProducts, 300), [fetchCartProducts]);

  useEffect(() => {
    void debouncedFetchCartProducts(cart);
  }, [cart, debouncedFetchCartProducts]);

  const setCartQuantity = (quantity: number, productID: string, productVariantSlug: string | undefined) => {
    setCart([
      ...(cart?.filter((cartProduct) => cartProduct.id !== productID) ?? []),
      {
        id: productID,
        quantity,
        choosenVariantSlug: productVariantSlug
      },
    ]);
  };

  const updateCartQuantity = (delta: number, productID: string, productVariantSlug: string | undefined) => {
    updateCart([
      {
        id: productID,
        quantity: delta,
        choosenVariantSlug: productVariantSlug
      },
    ]);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t("shopping-cart")}</h1>

        {cartProducts.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-gray-500">{t("empty-cart")}</p>
              <Link
                href="/our-products"
                className="mt-6 inline-block rounded-md bg-main-600 px-6 py-3 text-base font-medium text-white hover:bg-main-700"
              >
                {t("continue-shopping")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                {t("items-in-cart")}
              </h2>

              <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {
                cartProducts
                  .filter((product) => cart?.map((cartProduct) => cartProduct.id).includes(product.id))
                  .map((product) => {
                    const cartItem = cart?.find(
                      (item) => item.id === product.id && item.choosenVariantSlug === product.variant?.slug,
                    );

                    return (
                      <li key={`${product.id}-${product.variant?.slug}`} className="flex py-6 sm:py-10">
                        <div className="shrink-0">
                          <div className="size-24 overflow-hidden rounded-md border border-gray-200 sm:size-32">
                            {product.variant?.image?.url ? (
                              <MediaComponent
                                resource={product.variant.image}
                                className="size-full object-cover object-center"
                              />
                            ) : product.image?.url ? (
                              <MediaComponent
                                resource={product.image}
                                className="size-full object-cover object-center"
                              />
                            ) : null}
                          </div>
                        </div>

                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm">
                                  <Link
                                    href={`/product/${product.slug}`}
                                    className="font-medium text-gray-700 hover:text-gray-800"
                                  >
                                    {product.title}
                                  </Link>
                                </h3>
                              </div>
                              {product.variant && (
                                <div className="mt-1 flex text-sm">
                                  {product.variant?.color && (
                                    <p className="text-gray-500">
                                      {product.variant.color.label}
                                    </p>
                                  )}
                                  {product.variant?.color && product.variant?.size && (
                                    <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                      {product.variant.size.label}
                                    </p>
                                  )}
                                  {!product.variant?.color && product.variant?.size && (
                                    <p className="text-gray-500">{product.variant.size.label}</p>
                                  )}
                                </div>
                              )}
                              <div className="mt-1 flex text-sm font-medium text-gray-900">
                                <PriceClient pricing={product.pricing} />
                              </div>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:pr-9">
                              <QuantityInput
                                productid={product.id}
                                minQuantity={0}
                                maxQuantity={
                                  product.variant
                                    ? product.variant.stock ?? 0
                                    : product.enableVariants
                                      ? 0
                                      : product.stock ?? 0
                                }
                                quantity={cartItem?.quantity ?? 0}
                                setQuantity={(quantity) =>
                                  setCartQuantity(quantity, product.id, product.variant?.slug ?? undefined)
                                }
                                updateQuantity={(delta) =>
                                  updateCartQuantity(delta, product.id, product.variant?.slug ?? undefined)
                                }
                                inputVariant="cart"
                              />

                              <div className="absolute right-0 top-0">
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(product.id, product.variant?.slug ?? undefined)}
                                  className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                >
                                  <span className="sr-only">{t("remove")}</span>
                                  <XMarkIcon aria-hidden="true" className="size-5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                            {product.variant ? (
                              (product.variant.stock ?? 0) > 0 ? (
                                <span className="text-green-500">{t("in-stock")}</span>
                              ) : (
                                <span className="text-red-500">{t("out-of-stock")}</span>
                              )
                            ) : product.enableVariants ? null : (product.stock ?? 0) > 0 ? (
                              <span className="text-green-500">{t("in-stock")}</span>
                            ) : (
                              <span className="text-red-500">{t("out-of-stock")}</span>
                            )}
                          </p>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </section>

            {/* Order summary */}
            <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              {t("order-summary")}
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">{t("subtotal")}</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {total.map((totalItem) => (
                    <div key={totalItem.currency}>
                      <PriceClient
                        pricing={[
                          {
                            currency: totalItem.currency,
                            value: totalItem.value,
                          },
                        ]}
                      />
                    </div>
                  ))}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>{t("shipping-estimate")}</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">{t("calculated-at-checkout")}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">{t("order-total")}</dt>
                <dd className="text-base font-medium text-gray-900">
                  {total.map((totalItem) => (
                    <div key={totalItem.currency}>
                      <PriceClient
                        pricing={[
                          {
                            currency: totalItem.currency,
                            value: totalItem.value,
                          },
                        ]}
                      />
                    </div>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link
                href="/checkout"
                className="w-full rounded-md border border-transparent bg-main-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-main-700 focus:outline-hidden focus:ring-2 focus:ring-main-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                {t("checkout")}
              </Link>
            </div>

            <div className="mt-6 text-center text-sm">
              <p>
                {t("or")}{" "}
                <Link href="/our-products" className="font-medium text-main-600 hover:text-main-500">
                  {t("continue-shopping")}
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
