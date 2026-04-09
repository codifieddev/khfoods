import { randomBytes } from "crypto";
import { render } from "@react-email/components";
import { ObjectId } from "mongodb";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";

import { VerifyAccountEmail } from "@/components/Emails/VerifyAccountEmail";
import {
  buildCustomerFullName,
  createCustomerPasswordHash,
  findCustomerByEmail,
  getLocaleFromRequest,
  normalizeCustomerEmail,
  normalizeCustomerShippings,
  sanitizeCustomer,
} from "@/data/storefront/customerAccounts";
import { getMongoDb } from "@/data/mongo/client";
import { sendEmail } from "@/utilities/nodemailer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = typeof body.email === "string" ? normalizeCustomerEmail(body.email) : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const existingCustomer = await findCustomerByEmail(email);

    if (existingCustomer) {
      return NextResponse.json({ message: "Customer already exists." }, { status: 409 });
    }

    const locale = getLocaleFromRequest(request);
    const now = new Date().toISOString();
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : null;
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : null;
    const verificationToken = randomBytes(20).toString("hex");
    const { hash, salt } = createCustomerPasswordHash(password);

    const rawCustomer = {
      _id: new ObjectId(),
      createdAt: now,
      email,
      firstName,
      fullName: buildCustomerFullName(firstName, lastName),
      hash,
      lastBuyerType:
        body.lastBuyerType === "company" || body.lastBuyerType === "individual" ? body.lastBuyerType : null,
      lastName,
      sessions: [],
      shippings: normalizeCustomerShippings(body.shippings),
      salt,
      updatedAt: now,
      _verificationToken: verificationToken,
      _verified: false,
    };

    const db = await getMongoDb();
    await db.collection("customers").insertOne(rawCustomer as never);

    try {
      const html = await render(
        await VerifyAccountEmail({
          locale,
          name: firstName || "Customer",
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-email?token=${verificationToken}`,
        }),
      );
      const t = await getTranslations({ locale, namespace: "Emails.verify-email" });

      await sendEmail({
        to: email,
        subject: t("subject"),
        html,
      });
    } catch (error) {
      console.error("Customer verification email error:", error);
    }

    return NextResponse.json({ doc: sanitizeCustomer(rawCustomer) }, { status: 201 });
  } catch (error) {
    console.error("Customer register error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
