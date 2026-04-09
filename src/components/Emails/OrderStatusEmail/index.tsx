import { Html } from "@react-email/components";
import { type ReactNode } from "react";

import { getEmailMessagesData } from "@/data/storefront/globals";
import { type Locale } from "@/i18n/config";
import { type Order } from "@/types/cms";

import { Default } from "./variants/Default";

export const OrderStatusEmail = async ({ order, locale }: { order: Order; locale: Locale }) => {
  const { messages } = await getEmailMessagesData(locale);
  const template = messages?.template ?? "default";

  let Email: ReactNode = <Html></Html>;

  switch (template) {
    case "default":
      Email = <Default order={order} locale={locale} />;
  }
  return Email;
};

