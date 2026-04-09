import { render } from "@react-email/components";
import { getLocale, getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";

import { WelcomeEmail } from "@/components/Emails/WelcomeEmail";
import { findCustomerById, sanitizeCustomer } from "@/data/storefront/customerAccounts";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getMongoDb } from "@/data/mongo/client";
import { sendEmail } from "@/utilities/nodemailer";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Verification token is required" }, { status: 400 });
    }

    const db = await getMongoDb();
    const rawCustomer = await db.collection("customers").findOne({
      _verificationToken: token,
    } as any);

    if (!rawCustomer) {
      return NextResponse.json({ message: "Invalid verification token" }, { status: 400 });
    }

    await db.collection("customers").updateOne(
      { _id: rawCustomer._id },
      {
        $set: {
          _verified: true,
          updatedAt: new Date().toISOString(),
        } as any,
        $unset: {
          _verificationToken: "",
        } as any,
      }
    );

    let locale: Locale = defaultLocale;

    try {
      const resolvedLocale = await getLocale();
      locale = (resolvedLocale || defaultLocale) as Locale;
    } catch (error) {
      console.warn("Unable to resolve locale for verify-email route.", error);
    }

    try {
      const customer = await findCustomerById(rawCustomer._id.toString());

      if (customer) {
        const sanitizedCustomer = sanitizeCustomer(customer as Record<string, unknown>);
        const html = await render(await WelcomeEmail({ customer: sanitizedCustomer, locale }));
        const t = await getTranslations({ locale, namespace: "Emails.welcome" });

        await sendEmail({
          to: sanitizedCustomer.email,
          subject: t("subject"),
          html,
        });
      }
    } catch (error) {
      console.error("Customer welcome email error:", error);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/login?verified=true`);
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
