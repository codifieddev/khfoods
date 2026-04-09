import { getFilledOrderProducts } from "@/data/storefront/commerce";
import { type Locale } from "@/i18n/config";
import { type Order } from "@/types/cms";

export const getOrderProducts = async (orderProducts: Order["products"] | null, locale: Locale) => {
  try {
    return await getFilledOrderProducts({ locale, orderProducts });
  } catch (error) {
    console.error(error);
    return [];
  }
};

