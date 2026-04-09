import { NextResponse } from "next/server";

import { getAdminProductById, updateAdminProduct } from "@/data/admin/products";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import type { Product } from "@/types/cms";

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
    const product = await getAdminProductById({ id });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Admin product GET error:", error);
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
      highlight?: string;
      slug?: string;
      status?: string;
      stock?: number | null;
      title?: string;
      weight?: number | null;
    };

    const updatedProduct = await updateAdminProduct({
      highlight: body.highlight,
      id,
      slug: body.slug,
      status: body.status as Product["_status"] | undefined,
      stock: body.stock,
      title: body.title,
      weight: body.weight,
    });

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Admin product PATCH error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";
    const status =
      message === "Unauthorized" ? 401 : message === "Product not found" ? 404 : message.endsWith("required") ? 400 : 500;

    return NextResponse.json({ message }, { status });
  }
}

