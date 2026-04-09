import { NextResponse } from "next/server";
import { getCustomer } from "@/utilities/getCustomer";
import { getAuthenticatedCustomer } from "@/data/storefront/customerAuth";
import {
  buildCustomerFullName,
  createCustomerPasswordHash,
  findCustomerByEmail,
  findCustomerById,
  normalizeCustomerEmail,
  normalizeCustomerShippings,
  sanitizeCustomer,
} from "@/data/storefront/customerAccounts";
import { getMongoDb } from "@/data/mongo/client";

export async function GET() {
  try {
    const user = await getCustomer();
    return Response.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Me API Error:", error);
    return Response.json({ user: null }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authenticatedCustomer = await getAuthenticatedCustomer();

    if (!authenticatedCustomer) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rawCustomer = await findCustomerById(authenticatedCustomer.id);

    if (!rawCustomer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (typeof body.email === "string") {
      const nextEmail = normalizeCustomerEmail(body.email);

      if (!nextEmail) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
      }

      if (nextEmail !== normalizeCustomerEmail(rawCustomer.email)) {
        const existingCustomer = await findCustomerByEmail(nextEmail);

        if (existingCustomer && existingCustomer._id.toString() !== rawCustomer._id.toString()) {
          return NextResponse.json({ message: "Email already in use" }, { status: 409 });
        }

        updateData.email = nextEmail;
      }
    }

    if (typeof body.birthDate === "string" || body.birthDate === null) {
      updateData.birthDate = body.birthDate;
    }

    if (body.lastBuyerType === "company" || body.lastBuyerType === "individual" || body.lastBuyerType === null) {
      updateData.lastBuyerType = body.lastBuyerType;
    }

    const nextFirstName =
      typeof body.firstName === "string" ? body.firstName.trim() : (rawCustomer.firstName ?? null);
    const nextLastName =
      typeof body.lastName === "string" ? body.lastName.trim() : (rawCustomer.lastName ?? null);

    if (typeof body.firstName === "string") {
      updateData.firstName = nextFirstName;
    }

    if (typeof body.lastName === "string") {
      updateData.lastName = nextLastName;
    }

    if ("firstName" in body || "lastName" in body) {
      updateData.fullName = buildCustomerFullName(nextFirstName, nextLastName);
    }

    if ("shippings" in body) {
      updateData.shippings = normalizeCustomerShippings(body.shippings);
    }

    if (typeof body.password === "string" && body.password.length > 0) {
      const { hash, salt } = createCustomerPasswordHash(body.password);
      updateData.hash = hash;
      updateData.salt = salt;
    }

    const db = await getMongoDb();
    const updatedCustomer = await db.collection("customers").findOneAndUpdate(
      { _id: rawCustomer._id },
      { $set: updateData } as any,
      { returnDocument: "after" },
    );

    if (!updatedCustomer) {
      return NextResponse.json({ message: "Unable to update customer" }, { status: 500 });
    }

    return NextResponse.json(
      { doc: sanitizeCustomer(updatedCustomer as Record<string, unknown>, authenticatedCustomer._sid) },
      { status: 200 },
    );
  } catch (error) {
    console.error("Customer profile update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
