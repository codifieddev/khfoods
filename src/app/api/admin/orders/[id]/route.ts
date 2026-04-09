import { NextResponse } from "next/server";

import { getAdminOrderById, updateAdminOrder } from "@/data/admin/orders";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import type { Order } from "@/types/cms";

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
    const order = await getAdminOrderById({ id });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Admin order GET error:", error);
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
      orderNote?: string;
      shippingDate?: string | null;
      status?: string;
      trackingNumber?: string | null;
    };

    const updatedOrder = await updateAdminOrder({
      id,
      orderNote: body.orderNote,
      shippingDate: body.shippingDate,
      status: body.status as Order["orderDetails"]["status"] | undefined,
      trackingNumber: body.trackingNumber,
    });

    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("Admin order PATCH error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "Unauthorized" ? 401 : message === "Order not found" ? 404 : 500;

    return NextResponse.json({ message }, { status });
  }
}

