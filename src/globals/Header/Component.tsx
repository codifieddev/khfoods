import { headers } from "next/headers";


import HeaderMinor from "@/components/Header";
import HeaderCartIcon from "@/components/Header/HeaderCartIcon";

export async function Header({ disableCart }: { disableCart?: boolean }) {
  // ✅ FIXED: headers() is async in Next 15
  await headers();

  return (
    <div className="relative">
      <HeaderMinor />

      {!disableCart && (
        <div className="absolute right-6 top-6">
          <HeaderCartIcon />
        </div>
      )}
    </div>
  );
}


