import { isAxiosError } from "axios";
import { getLocale } from "next-intl/server";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import { getStorefrontOrderByNumber } from "@/data/storefront/commerce";
import { type Locale } from "@/i18n/config";

const createCouriers = async (locale: Locale) => {
  const couriersModule = await import(
    "@/globals/(ecommerce)/Couriers/utils/couriersConfig"
  );
  return couriersModule.createCouriers(locale);
};

export type Dimensions = {
  width: number;
  height: number;
  length: number;
  weight: number;
};

export async function POST(req: Request) {
  try {
    const {
      orderID,
      dimension,
      dimensions
    }: {
      orderID: string;
      dimension: string;
      dimensions: Dimensions;
    } = await req.json();

    if (!orderID) {
      return Response.json("Cannot find order ID", { status: 400 });
    }

    const user = await getAuthenticatedAdministrator();
    const locale = (await getLocale()) as Locale;

    if (!user) {
      return Response.json("Unauthorized", { status: 401 });
    }

    const order = await getStorefrontOrderByNumber(orderID);

    if (!order) {
      return Response.json("Cannot find order", { status: 400 });
    }

    const couriers = await createCouriers(locale);
    const courier = couriers.find(
      (c) => c.key === order.orderDetails?.shipping
    );

    const packageID = courier
      ? await courier.createPackage(order, dimension, dimensions)
      : null;

    if (!packageID) {
      return Response.json("Cannot create package", { status: 400 });
    }

    return Response.json(`${packageID}`, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      const typedError = error?.response?.data as {
        message: string;
        details: Record<string, unknown>;
      };
      return Response.json(
        `${typedError?.message || "Courier API Error"} \n Error details: ${JSON.stringify(typedError?.details || "")}`,
        { status: 400 }
      );
    } else {
      console.error("Shipping Package API Error:", error);
      return Response.json("Failed to create package", { status: 500 });
    }
  }
}
