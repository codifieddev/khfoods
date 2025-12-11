import { render } from "@react-email/components";
import { getLocale, getTranslations } from "next-intl/server";

import { WelcomeEmail } from "@/components/Emails/WelcomeEmail";
import { type Locale } from "@/i18n/config";
import { type Customer } from "@/payload-types";
import { sendEmail } from "@/utilities/nodemailer";

import type { CollectionAfterChangeHook } from "payload";

export const sendWelcomeEmail: CollectionAfterChangeHook<Customer> = async ({
  previousDoc,
  doc,
}) => {
  // Check if user just got verified
  console.log("previousDoc._verified ===", previousDoc._verified);
  console.log("doc._verified ===", doc._verified);

  // if (previousDoc._verified === false && doc._verified === true) {

  if (!doc._verified) {
    console.log(
      `[Welcome Email] Attempting to send welcome email to: ${doc.email}`
    );

    try {
      const locale = (await getLocale()) as Locale;
      console.log("calling email");
      const html = await render(
        await WelcomeEmail({
          customer: doc,
          locale,
        })
      );

      const t = await getTranslations({ locale, namespace: "Emails.welcome" });

      const res = await sendEmail({
        to: doc.email,
        subject: t("subject"),
        html,
      });
      console.log(
        `[Welcome Email] ✅ Successfully sent welcome email to ---- ${doc.email}`,
        res
      );
    } catch (error) {
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
