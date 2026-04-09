import { render } from "@react-email/components";
import { getLocale, getTranslations } from "next-intl/server";

import { WelcomeEmail } from "@/components/Emails/WelcomeEmail";
import { type Locale } from "@/i18n/config";
import { type Customer } from "@/types/cms";
import { sendEmail } from "@/utilities/nodemailer";

import type { CollectionAfterChangeHook } from "payload";

export const sendWelcomeEmail: CollectionAfterChangeHook<Customer> = async ({
  previousDoc,
  doc,
  req,
}) => {
  // Check if user just got verified


  // if (previousDoc._verified === false && doc._verified === true) {

  if (!doc._verified) {

    try {
      let locale: Locale = "en";

      if (req.headers instanceof Headers) {
        locale = (req.headers.get("x-locale") || "en") as Locale;
      } else if (typeof req.headers === "object") {
        locale = (req.headers["x-locale"] || "en") as Locale;
      }

      // const locale = (await getLocale()) as Locale;

      const html = await render(
        await WelcomeEmail({
          customer: doc,
          locale,
        })
      );

      const t = await getTranslations({ locale, namespace: "Emails.welcome" });

      await sendEmail({
        to: doc.email,
        subject: t("subject"),
        html,
      });
    } catch (error) {
      console.error(
        `[Welcome Email] ❌ Failed to send welcome email to --->${doc.email}`,
        error
      );
      console.error(
        `[Welcome Email] ❌ Failed to send welcome email to --->${doc.email}`,
        error
      );
      // Don't throw error - we don't want to break the registration flow
    }
  }
  //  else if (!previousDoc._verified && !doc._verified) {
  //   console.log(`[Welcome Email] User ${doc.email} not yet verified, skipping welcome email`);
  // }

  return doc;
};


