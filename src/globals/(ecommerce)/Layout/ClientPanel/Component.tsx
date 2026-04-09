import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { getShopLayoutData } from "@/data/storefront/globals";
import { type Locale } from "@/i18n/config";

import { WithSidebar } from "./variants/WithSidebar";

export const ClientPanel = async ({ children }: { children: ReactNode }) => {
  try {
    const locale = (await getLocale()) as Locale;
    const { clientPanel } = await getShopLayoutData(locale);

    let ClientPanelComponent: ReactNode = null;
    switch (clientPanel.type) {
      case "withSidebar":
        ClientPanelComponent = <WithSidebar>{children}</WithSidebar>;
        break;
    }

    if (!ClientPanelComponent) {
      notFound();
    }

    return ClientPanelComponent;
  } catch (error) {
    // console.log(error);
    notFound();
  }
};
