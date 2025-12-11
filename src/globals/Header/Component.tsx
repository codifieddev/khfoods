import { getLocale } from "next-intl/server";

import { type Locale } from "@/i18n/config";
import { getCachedGlobal } from "@/utilities/getGlobals";

import { HeaderClient } from "./Component.client";

import type { Header } from "@/payload-types";
import HeaderMinor from "@/components/Header";

export async function Header({ disableCart }: { disableCart?: boolean }) {
  const locale = (await getLocale()) as Locale;
  const headerData: Header = await getCachedGlobal("header", locale, 1)();
  const data = getCachedGlobal("sitesetting", "en", 1);
  const d = await data()
  const logourl = d?.logo

  return (
    <>
      {/* <HeaderClient data={headerData} disableCart={disableCart} /> */}
      <HeaderMinor logourl={logourl}/>
    </>
  );
}
