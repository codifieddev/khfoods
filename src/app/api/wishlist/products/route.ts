import { getWishlistProducts } from "@/data/storefront/commerce";
import { type Locale } from "@/i18n/config";
import { type WishList } from "@/stores/WishlistStore/types";

export async function POST(req: Request) {
  try {
    const { wishlist, locale }: { wishlist: WishList | undefined; locale: Locale } = await req.json();
    
    if (!wishlist || wishlist.length === 0) {
      return Response.json({ status: 200, filledProducts: [] });
    }

    const filledProducts = await getWishlistProducts({ locale, wishlist });

    return Response.json({ status: 200, filledProducts });
  } catch (error) {
    console.error("Wishlist Products API Error:", error);
    return Response.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}
