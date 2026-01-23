import { headers } from "next/headers";

import { type Locale } from "@/i18n/config";
import { getCachedGlobal } from "@/utilities/getGlobals";
import type { Header as HeaderType, Media } from "@/payload-types";

import HeaderMinor from "@/components/Header";
import HeaderCartIcon from "@/components/Header/HeaderCartIcon";

export async function Header({ disableCart }: { disableCart?: boolean }) {
  // ✅ FIXED: headers() is async in Next 15
  const h = await headers();
  const pathname = h.get("x-pathname") || "";
  const locale = (pathname.split("/")[1] || "en") as Locale;

  const headerData: HeaderType =
    await getCachedGlobal("header", locale, 1)();

  const siteSettings =
    await getCachedGlobal("sitesetting", locale, 1)();

  const logourl = siteSettings?.logo as string | Media | null | undefined;

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


