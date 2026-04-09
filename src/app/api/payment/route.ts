import { type Country } from "@/globals/(ecommerce)/Couriers/utils/countryList";
import {
  createStorefrontOrder,
  getCartProductsWithTotals,
  getStorefrontPaymentSettings,
  updateCustomerLastBuyerType,
} from "@/data/storefront/commerce";
import { type Locale } from "@/i18n/config";
import { getTotalWeight } from "@/lib/getTotalWeight";
import { getAutopayPaymentURL } from "@/lib/paywalls/getAutopayPaymentURL";
import { getP24PaymentURL } from "@/lib/paywalls/getP24PaymentURL";
import { getStripePaymentURL } from "@/lib/paywalls/getStripePaymentURL";
import { type CheckoutFormData } from "@/schemas/checkoutForm.schema";
import { type Cart } from "@/stores/CartStore/types";
import { type Currency } from "@/stores/Currency/types";
import { getCustomer } from "@/utilities/getCustomer";

const createCouriers = async (locale: Locale) => {
  const couriersModule = await import(
    "@/globals/(ecommerce)/Couriers/utils/couriersConfig"
  );
  return couriersModule.createCouriers(locale);
};

export async function POST(req: Request) {
  try {
    const {
      cart,
      selectedCountry,
      checkoutData,
      locale,
      currency
    }: {
      cart: Cart | undefined;
      selectedCountry: Country;
      locale: Locale;
      checkoutData: CheckoutFormData;
      currency: Currency;
    } = await req.json();

    if (!cart) {
      return Response.json({ status: 400, message: "Cart is empty" }, { status: 400 });
    }

    const { filledProducts, total } = await getCartProductsWithTotals({ cart, locale });
    const totalWeight = getTotalWeight(filledProducts, cart);
    const couriers = await createCouriers(locale);

    const courier = couriers.find(
      (courier) => courier?.key === checkoutData.deliveryMethod
    );
    if (!courier) {
      return Response.json({ status: 400, message: "Courier not found" }, { status: 400 });
    }

    const courierData = await courier.getSettings();
       
    const shippingCost = courierData?.deliveryZones
      ?.find((zone) => zone.countries.includes(selectedCountry))
      ?.range?.find(
        (range) =>
          range.weightFrom <= totalWeight && range.weightTo >= totalWeight
      )
      ?.pricing.find((pricing) => pricing.currency === currency)?.value;

    if (shippingCost === undefined) {
      return Response.json({ status: 400, message: "Shipping cost not found" }, { status: 400 });
    }

    const host = req.headers.get("host");

    if (!host) {
      return Response.json({ status: 400, message: "Host header missing" }, { status: 400 });
    }

    const paywalls = await getStorefrontPaymentSettings();

    if (!paywalls) {
      return Response.json({ status: 500, message: "Payment settings not found" }, { status: 500 });
    }

    let redirectURL: string | null = null;
    const user = await getCustomer();

    const order = await createStorefrontOrder({
      cart,
      checkoutData,
      currency,
      customerId: user?.id,
      filledProducts,
      selectedCountry,
      shippingCost,
      shippingMethod: courier.key,
      totalWeight,
    });

    if (user) {
      await updateCustomerLastBuyerType({
        buyerType: checkoutData.buyerType as "individual" | "company",
        customerId: user.id,
      });
    }

    if (courier.prepaid === false) {
      return Response.json({
        status: 200,
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/order/${order.id}`
      });
    }

    const totalWithShipping =
      (total.find((price) => price.currency === currency)?.value ?? 0) +
      shippingCost;

    try {
      switch (paywalls.paywall) {
        case "stripe":
          redirectURL = await getStripePaymentURL({
            filledProducts,
            shippingCost,
            shippingLabel: courierData.settings.label,
            currency,
            locale,
            apiKey: paywalls?.stripe?.secret ?? "",
            orderID: order.id,
            host: host
          });
          break;

        case "autopay":
          redirectURL = await getAutopayPaymentURL({
            total: totalWithShipping,
            autopay: paywalls?.autopay,
            orderID: order.id,
            currency,
            customerEmail: checkoutData.shipping.email
          });
          break;
        case "p24":
          redirectURL = await getP24PaymentURL({
            secretId: paywalls.p24?.secretId ?? "",
            posId: Number(paywalls.p24?.posId ?? 0),
            crc: paywalls.p24?.crc ?? "",
            endpoint: paywalls.p24?.endpoint ?? "",
            sessionId: order.id,
            amount: totalWithShipping,
            currency,
            description: `${locale} - ${order.id}`,
            email: order.shippingAddress.email,
            locale,
            client: user ? { ...user, id: user.id } as any : null
          });
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Payment Creation Error:", error);
      return Response.json({
        status: 500,
        message: "Error while creating payment"
      }, { status: 500 });
    }

    return Response.json({ status: 200, url: redirectURL });
  } catch (error) {
    console.error("Payment API Error:", error);
    return Response.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}
