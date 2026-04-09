import { type Product } from "@/types/cms";

export type CartProduct = {
  id: Product["id"];
  quantity: number;
  choosenVariantSlug?: string;
};

export type Cart = CartProduct[];
