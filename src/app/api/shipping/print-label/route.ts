import { isAxiosError } from "axios";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import { getStorefrontOrderByNumber } from "@/data/storefront/commerce";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderID = searchParams.get("orderID");
    const user = await getAuthenticatedAdministrator();

    if (!user) {
      return Response.json("Unauthorized", { status: 401 });
    }

    if (!orderID) {
      return Response.json("Cannot find order ID", { status: 400 });
    }

    const order = await getStorefrontOrderByNumber(orderID);

    if (!order || !order.printLabel?.labelurl) {
      return Response.json("Cannot find order or label URL", { status: 404 });
    }

    const url = order.printLabel.labelurl;
    const response = await fetch(url, { method: "GET" });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch label from ${url}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${orderID}.pdf"`
      }
    });
  } catch (error) {
    if (isAxiosError(error)) {
      const typedError = error.response?.data as { message: string; details: Record<string, unknown> };
      return Response.json(
        `${typedError?.message || "Courier API Error"} \n Error details: ${JSON.stringify(typedError?.details || "")}`,
        { status: 400 },
      );
    } else {
      console.error("Print Label API Error:", error);
      return Response.json("Failed to fetch shipping label", { status: 500 });
    }
  }
}
