import { LoginPageWithoutOAuth } from "@/components/(ecommerce)/LoginPage/WithoutOAuth";
import { getShopSettingsData } from "@/data/storefront/globals";
import { type Locale } from "@/i18n/config";
import { redirect } from "@/i18n/routing";
import { getCustomer } from "@/utilities/getCustomer";

export const dynamic = "force-dynamic";

const LoginPage = async ({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ verified?: string }>;
}) => {
  console.log("login page")
  const user = await getCustomer();
  const { locale } = await params;
  const { verified } = await searchParams;

  console.log("user data when login", user)
  if (user?.id) {
    return redirect({ locale: locale, href: "/account/orders" });
  }
  const shopSettings = await getShopSettingsData(locale, 1);


  return shopSettings.enableOAuth ? <></> : <LoginPageWithoutOAuth verified={verified} />;
};
export default LoginPage;
