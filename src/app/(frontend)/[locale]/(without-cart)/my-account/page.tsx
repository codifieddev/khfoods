import { type Locale } from "@/i18n/config";
import { redirect } from "@/i18n/routing";
import { getCustomer } from "@/utilities/getCustomer";
import { MyAccountPage } from "@/components/(ecommerce)/MyAccountPage";

export const dynamic = "force-dynamic";

const MyAccount = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const user = await getCustomer();
  const { locale } = await params;

  if (user?.id) {
    return redirect({ locale: locale, href: "/account" });
  }

  return <MyAccountPage />;
};

export default MyAccount;
