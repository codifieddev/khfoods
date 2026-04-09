import { Html } from "@react-email/components";
import { type ReactNode } from "react";

import { getEmailMessagesData } from "@/data/storefront/globals";
import { type Locale } from "@/i18n/config";
import { type Customer, type EmailMessage } from "@/types/cms";

import { Default } from "./variants/Default";

export const WelcomeEmail = async ({ customer, locale }: { customer: Customer; locale: Locale }) => {
  const emailMessages = await getEmailMessagesData(locale);
  const { messages } = emailMessages as EmailMessage;
  const template = messages?.template ?? "default";

  let Email: ReactNode = <Html></Html>;

  switch (template) {
    case "default":
      Email = <Default customer={customer} locale={locale} emailMessages={emailMessages} />;
  }
  return Email;
};

