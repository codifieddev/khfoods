import { updateCustomerCart } from "@/data/storefront/commerce";
import { type Cart } from "@/stores/CartStore/types";
import { getCustomer } from "@/utilities/getCustomer";

export async function POST(req: Request) {
  try {
    const cart: Cart = await req.json();
    const user = await getCustomer();

    if (!user) {
      return Response.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }

    await updateCustomerCart({ cart, customerId: user.id });

    return Response.json({ status: 200, message: "Cart synchronized" });
  } catch (error) {
    console.error("Cart Sync API Error:", error);
    return Response.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCustomer();

    if (!user) {
      return Response.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }

    const cart = typeof user.cart === "string" ? JSON.parse(user.cart) : (user.cart || []);

    return Response.json({ status: 200, data: cart });
  } catch (error) {
    console.error("Cart Fetch API Error:", error);
    return Response.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}
