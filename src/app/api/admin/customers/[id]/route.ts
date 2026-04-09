import { NextResponse } from "next/server";

import { getAdminCustomerById, updateAdminCustomer } from "@/data/admin/customers";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import type { Customer } from "@/types/cms";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const administrator = await getAuthenticatedAdministrator();

    if (!administrator) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const customer = await getAdminCustomerById({ id });

    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error("Admin customer GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      birthDate?: string | null;
      email?: string;
      firstName?: string;
      isVerified?: boolean;
      lastBuyerType?: Customer["lastBuyerType"];
      lastName?: string;
      unlockAccount?: boolean;
    };

    const updatedCustomer = await updateAdminCustomer({
      birthDate: body.birthDate,
      email: body.email,
      firstName: body.firstName,
      id,
      isVerified: body.isVerified,
      lastBuyerType: body.lastBuyerType,
      lastName: body.lastName,
      unlockAccount: body.unlockAccount,
    });

    return NextResponse.json({ customer: updatedCustomer }, { status: 200 });
  } catch (error) {
    console.error("Admin customer PATCH error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";
    const status =
      message === "Unauthorized"
        ? 401
        : message === "Customer not found"
          ? 404
          : message === "Email is required" || message === "Email already in use"
            ? 400
            : 500;

    return NextResponse.json({ message }, { status });
  }
}

