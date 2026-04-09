import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminSettingsForm } from "@/components/admin-next/AdminSettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSettingsSnapshot } from "@/data/admin/settings";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";

const SettingsAdminPage = async () => {
  const administrator = await getAuthenticatedAdministrator();

  if (!administrator) {
    redirect("/admin/login");
  }

  const settings = await getAdminSettingsSnapshot();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin Settings</p>
            <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-600">
              Mongo-backed shop settings, email templates, and payment configuration without Payload globals.
            </p>
          </div>
          <Link className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline" href="/admin">
            Back to dashboard
          </Link>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Shop Configuration</CardTitle>
            <CardDescription>
              This replaces the old Payload globals flow with a single Next.js settings surface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminSettingsForm
              initialAdditionalText={settings.emailMessages.messages?.additionalText}
              initialAutopay={settings.payment?.autopay}
              initialAvailableCurrencies={settings.shopSettings.availableCurrencies ?? ["USD"]}
              initialCurrencyValues={settings.shopSettings.currencyValues}
              initialEnableOAuth={Boolean(settings.shopSettings.enableOAuth)}
              initialFulfilmentAddress={settings.fulfilment.shopAddress}
              initialP24={settings.payment?.p24}
              initialPaywall={settings.payment?.paywall}
              initialPrimaryColor={settings.siteSettings.primaryColor}
              initialShopTagline={settings.siteSettings.tagline}
              initialShopTitle={settings.siteSettings.sitetitle}
              initialSmtp={settings.emailMessages.smtp}
              initialStripe={settings.payment?.stripe}
              initialTemplate={settings.emailMessages.messages?.template ?? "default"}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SettingsAdminPage;
