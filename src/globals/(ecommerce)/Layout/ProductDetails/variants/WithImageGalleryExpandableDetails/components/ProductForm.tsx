"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { QuantityInput } from "@/components/(ecommerce)/QuantityInput";
import { type Product } from "@/payload-types";
import { useCart } from "@/stores/CartStore";
import { useWishList } from "@/stores/WishlistStore";
import { cn } from "@/utilities/cn";

import { type FilledVariant } from "../../../types";

export const ProductForm = ({
  product,
  selectedVariant,
  minQuantity,
  maxQuantity,
}: {
  product: Product;
  selectedVariant?: FilledVariant;
  minQuantity: number;
  maxQuantity: number;
}) => {
  const [quantity, setQuantity] = useState(1);

  // 🔥 IMPORTANT: setCart is REQUIRED to ADD items
  const { cart, setCart } = useCart();
  const { toggleWishList, wishlist } = useWishList();
  const t = useTranslations("ProductDetails");

  const handleAddToCart = () => {
    console.log("ADD TO CART CLICKED", product.id, quantity);

    if (quantity <= 0) return;

    setCart([
      ...(cart ?? []),
      {
        id: product.id,
        quantity,
        choosenVariantSlug: selectedVariant?.slug ?? undefined,
      },
    ]);
  };

  return (
    <div className="mt-6 relative z-[9999]">
      <div className="mt-10 grid grid-cols-2 gap-y-4 sm:flex">
        {/* ✅ ADD TO CART — GUARANTEED CLICKABLE */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="col-span-2 flex w-full items-center justify-center rounded-md bg-[#E7B27A] px-8 py-3 text-base font-semibold text-black hover:opacity-90"
          style={{
            pointerEvents: "auto",
            cursor: "pointer",
          }}
        >
          ADD TO CART
        </button>

        {/* QUANTITY */}
        <div className="flex">
          <QuantityInput
            productid={product.id}
            quantity={quantity}
            setQuantity={setQuantity}
            updateQuantity={(v) => setQuantity(v)}
            minQuantity={minQuantity}
            maxQuantity={maxQuantity}
          />

          {/* WISHLIST */}
          <button
            type="button"
            onClick={() =>
              toggleWishList([
                {
                  id: product.id,
                  choosenVariantSlug: selectedVariant?.slug ?? undefined,
                },
              ])
            }
            className="ml-4 flex items-center justify-center rounded-md px-3 py-3"
          >
            {wishlist?.find(
              (item) =>
                item.id === product.id &&
                item.choosenVariantSlug === selectedVariant?.slug
            ) ? (
              <FilledHeartIcon className="size-6" />
            ) : (
              <HeartIcon className="size-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
