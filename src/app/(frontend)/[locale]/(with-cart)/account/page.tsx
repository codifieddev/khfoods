import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { getCustomer } from "@/utilities/getCustomer";

export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const user = await getCustomer();
  const t = await getTranslations("Account.dashboard");

  if (!user) return null;

  return (
    <div className="no-prose">
      <h2 className="mb-8 text-xl font-bold">{t("title")}</h2>
      
      <div className="space-y-6">
        <p className="text-gray-700">
          {t("greeting", { username: user.email })} {!user.email?.includes("khfood") && (
            <>
              (not <strong>{user.email}</strong>?{" "}
              <Link href="/logout" className="text-main-600 hover:text-main-700">
                {t("log-out")}
              </Link>
              )
            </>
          )}
        </p>
        
        <p className="text-gray-600">
          {t("description")}{" "}
          <Link href="/account/orders" className="text-main-600 hover:text-main-700">
            {t("recent-orders")}
          </Link>
          , {t("manage-your")}{" "}
          <Link href="/account/orders-data" className="text-main-600 hover:text-main-700">
            {t("shipping-billing")}
          </Link>
          , {t("and")}{" "}
          <Link href="/account/settings" className="text-main-600 hover:text-main-700">
            {t("edit-password")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Page;
