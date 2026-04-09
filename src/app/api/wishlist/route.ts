import { revalidateTag } from "next/cache";
import { updateCustomerWishlist } from "@/data/storefront/commerce";
import { type WishList } from "@/stores/WishlistStore/types";
import { getCustomer } from "@/utilities/getCustomer";

export async function POST(req: Request) {
  try {
    const contentLength = req.headers.get("content-length");
    if (!contentLength || contentLength === "0") {
      return Response.json({ error: "Empty request body" }, { status: 400 });
    }

    let wishlist: WishList | undefined;
    try {
      wishlist = (await req.json()) as WishList | undefined;
    } catch {
      return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const user = await getCustomer();

    if (!wishlist || !user) {
      return Response.json({ status: 400, message: "Unauthorized or missing wishlist" }, { status: 400 });
    }

    await updateCustomerWishlist({ customerId: user.id, wishlist });
    revalidateTag("user-auth");

    return Response.json({ status: 200, message: "Wishlist saved successfully" });
  } catch (error) {
    console.error("Wishlist Save Error:", error);
    return Response.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCustomer();

    if (!user) {
      return Response.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }

    return Response.json({
      status: 200,
      data: typeof user.wishlist === "string" ? (JSON.parse(user.wishlist) as WishList) : (user.wishlist || [])
    });
  } catch (error) {
    console.error("Wishlist Fetch Error:", error);
    return Response.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}
