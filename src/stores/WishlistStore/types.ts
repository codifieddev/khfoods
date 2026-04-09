import { type Product } from "@/types/cms";

export type WishListProduct = {
  id: Product["id"];
  choosenVariantSlug?: string;
};

export type WishList = WishListProduct[];
