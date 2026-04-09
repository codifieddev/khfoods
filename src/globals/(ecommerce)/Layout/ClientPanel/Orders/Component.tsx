import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { getShopLayoutData } from "@/data/storefront/globals";
import { type Locale } from "@/i18n/config";

import { WithSidebarOrders } from "../variants/WithSidebar/components/WithSidebarOrders";

export const Orders = async () => {
  try {
    const locale = (await getLocale()) as Locale;
    const { clientPanel } = await getShopLayoutData(locale);

    let OrdersComponent: ReactNode = null;
    switch (clientPanel.type) {
      case "withSidebar":
        OrdersComponent = <WithSidebarOrders />;
        break;
    }

    if (!OrdersComponent) {
      notFound();
    }

    return OrdersComponent;
  } catch (error) {
    // console.log(error);
    notFound();
  }
};
