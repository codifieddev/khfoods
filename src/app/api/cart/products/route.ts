import { getCartProductsWithTotals } from "@/data/storefront/commerce";
import { type Locale } from "@/i18n/config";
import { type Cart } from "@/stores/CartStore/types";

export async function POST(req: Request) {
  try {
    const { cart, locale }: { cart: Cart | undefined; locale: Locale } = await req.json();

    if (!cart || cart.length === 0) {
      return Response.json({ status: 200, productsWithTotal: { filledProducts: [], total: [], totalQuantity: 0 } });
    }

    const productsWithTotal = await getCartProductsWithTotals({ cart, locale });

    return Response.json({ status: 200, productsWithTotal });
  } catch (error) {
    console.error("Cart Products API Error:", error);
    return Response.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}
