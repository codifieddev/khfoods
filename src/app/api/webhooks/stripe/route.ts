import Stripe from "stripe";
import { getStorefrontPaymentSettings, updateStorefrontOrderStatus } from "@/data/storefront/commerce";

export async function POST(req: Request) {
  try {
    const sig = req.headers.get("stripe-signature") ?? "";
    const paymentsapp = await getStorefrontPaymentSettings();
    const stripeOptions = paymentsapp?.stripe;
    const secret = stripeOptions?.secret;
    const webhookSecret = stripeOptions?.webhookSecret ?? "";

    if (!secret) {
      return Response.json({ error: "Stripe secret not configured" }, { status: 400 });
    }

    const rawBody = await req.text();
    const stripe = new Stripe(secret);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (error: any) {
      console.error("Stripe Webhook Verification Error:", error.message);
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderID = paymentIntent.metadata.orderID;

        if (paymentIntent.status === "succeeded") {
          await updateStorefrontOrderStatus({
            amountPaid: paymentIntent.amount_received / 100,
            orderNumber: orderID,
            status: "paid",
            transactionID: paymentIntent.id,
          });
        }
        break;
      }
      case "payment_intent.payment_failed":
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderID = paymentIntent.metadata.orderID;
        
        await updateStorefrontOrderStatus({
          orderNumber: orderID,
          status: "unpaid",
          transactionID: paymentIntent.id,
        });
        break;
      }
      default:
        if (process.env.NODE_ENV === "development") {
          console.log(`Stripe: Unhandled event type ${event.type}`);
        }
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe Webhook Processing Error:", error);
    return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }
}
