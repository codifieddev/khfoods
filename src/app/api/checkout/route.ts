import { headers } from "next/headers";
import { getCheckoutProductsWithCouriers } from "@/data/storefront/commerce";
import { type Locale } from "@/i18n/config";
import { type Cart } from "@/stores/CartStore/types";

export async function POST(req: Request) {
  try {
    const { cart, selectedCountry, locale }: { cart: Cart | null, selectedCountry: string, locale: Locale } = await req.json();

    if (!cart) {
      return Response.json({ status: 400, message: "Cart is empty" }, { status: 400 });
    }

    const data = await getCheckoutProductsWithCouriers({ cart, locale });

    // Mocking available couriers for now as in the original proxy
    // In a real scenario, this would fetch from a database or a courier service
    const couriers = [
      {
        slug: "standard",
        title: "Standard Shipping",
        turnaround: "3-5 business days",
        pricing: [{ currency: "USD", value: 5.00 }]
      },
      {
        slug: "express",
        title: "Express Shipping",
        turnaround: "1-2 business days",
        pricing: [{ currency: "USD", value: 15.00 }]
      }
    ];

    return Response.json({
      status: 200,
      productsWithTotalAndCouriers: {
        ...data,
        couriers
      }
    });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return Response.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}
