"use client";

import { useCart } from "@/stores/CartStore";
import { Link } from "@/i18n/routing";

const HeaderCartIcon = () => {
  const { cart } = useCart();

   console.log("HEADER CART STATE:", cart);

  const cartCount =
    cart?.reduce((total, item) => total + (item.quantity ?? 0), 0) ?? 0;

  return (
    <Link href="/cart" className="relative flex items-center">
      🛍️
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default HeaderCartIcon;
