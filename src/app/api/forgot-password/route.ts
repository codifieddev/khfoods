import { randomBytes } from "crypto";
import { render } from "@react-email/components";
import { getLocale, getTranslations } from "next-intl/server";

import { ResetPasswordEmail } from "@/components/Emails/ResetPasswordEmail";
import { findAdministratorByEmail, normalizeAdministratorEmail } from "@/data/storefront/adminAccounts";
import { findCustomerByEmail, getLocaleFromRequest } from "@/data/storefront/customerAccounts";
import { getMongoDb } from "@/data/mongo/client";
import { type Locale } from "@/i18n/config";
import { type Customer, type Administrator } from "@/types/cms";
import { sendEmail } from "@/utilities/nodemailer";

const isCustomer = (user: Administrator | Customer): user is Customer => {
  return !(user as Administrator).name;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email: string;
      collection?: "administrators" | "customers";
    };
    const email = body.email;
    const collection: "administrators" | "customers" = body.collection === "customers" ? "customers" : "administrators";
    const token: string = randomBytes(20).toString("hex");
    let user: Administrator | Customer | null = null;

    if (collection === "customers") {
      const rawCustomer = await findCustomerByEmail(email);

      if (!rawCustomer) {
        return Response.json({ message: "Success" }, { status: 200 });
      }

      const db = await getMongoDb();
      await db.collection("customers").updateOne(
        { _id: rawCustomer._id },
        {
          $set: {
            resetPasswordExpiration: new Date(Date.now() + 3600000).toISOString(),
            resetPasswordToken: token,
            updatedAt: new Date().toISOString(),
          } as any,
        }
      );

      user = {
        ...rawCustomer,
        id: rawCustomer._id.toString(),
        email: typeof rawCustomer.email === "string" ? rawCustomer.email : email,
      } as unknown as Customer;
    } else {
      const rawAdministrator = await findAdministratorByEmail(normalizeAdministratorEmail(email));

      if (!rawAdministrator) {
        return Response.json({ message: "Success" }, { status: 200 });
      }

      const db = await getMongoDb();
      await db.collection("administrators").updateOne(
        { _id: rawAdministrator._id },
        {
          $set: {
            resetPasswordExpiration: new Date(Date.now() + 3600000).toISOString(),
            resetPasswordToken: token,
            updatedAt: new Date().toISOString(),
          } as any,
        }
      );

      user = {
        ...rawAdministrator,
        id: rawAdministrator._id.toString(),
        email: typeof rawAdministrator.email === "string" ? rawAdministrator.email : email,
      } as unknown as Administrator;
    }

    let locale: Locale;
    try {
      const resolvedLocale = await getLocale();
      locale = (resolvedLocale || getLocaleFromRequest(req)) as Locale;
    } catch {
      locale = getLocaleFromRequest(req) as Locale;
    }

    let name = "User";
    if (isCustomer(user) && user.firstName) {
      name = user.firstName;
    } else if (!isCustomer(user) && user.name) {
      name = user.name;
    }

    const html = await render(
      await ResetPasswordEmail({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/reset-password?token=${token}&collection=${collection}`,
        locale,
        name
      }),
    );

    const t = await getTranslations({ locale, namespace: "Emails.reset-password" });

    await sendEmail({ to: email, subject: t("subject"), html });
    
    return Response.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password API error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
