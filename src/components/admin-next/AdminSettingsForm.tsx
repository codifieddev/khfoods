"use client";

import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Payment } from "@/types/cms";

export const AdminSettingsForm = ({
  initialAdditionalText,
  initialAvailableCurrencies,
  initialCurrencyValues,
  initialEnableOAuth,
  initialFulfilmentAddress,
  initialPaywall,
  initialPrimaryColor,
  initialShopTagline,
  initialShopTitle,
  initialSmtp,
  initialStripe,
  initialAutopay,
  initialP24,
  initialTemplate,
}: {
  initialAdditionalText?: string | null;
  initialAvailableCurrencies: string[];
  initialCurrencyValues?: { currency: string; value: number; id?: string | null }[] | null;
  initialEnableOAuth: boolean;
  initialFulfilmentAddress?: {
    address: string;
    city: string;
    country: string;
    email: string;
    name: string;
    phone: string;
    postalCode: string;
    region: string;
  } | null;
  initialPaywall?: Payment["paywall"];
  initialPrimaryColor?: string | null;
  initialShopTagline?: string | null;
  initialShopTitle?: string | null;
  initialSmtp?: {
    fromEmail: string;
    host: string;
    password: string;
    port: number;
    secure: boolean;
    user: string;
  } | null;
  initialStripe?: Payment["stripe"];
  initialAutopay?: Payment["autopay"];
  initialP24?: Payment["p24"];
  initialTemplate?: "default" | "template 1";
}) => {
  const router = useRouter();
  const [shopTitle, setShopTitle] = useState(initialShopTitle ?? "");
  const [shopTagline, setShopTagline] = useState(initialShopTagline ?? "");
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor ?? "#0070f3");
  const [availableCurrencies, setAvailableCurrencies] = useState(initialAvailableCurrencies.join(", "));
  const [currencyValuesJson, setCurrencyValuesJson] = useState(
    JSON.stringify(initialCurrencyValues ?? [], null, 2),
  );
  const [enableOAuth, setEnableOAuth] = useState(initialEnableOAuth);
  const [smtpHost, setSmtpHost] = useState(initialSmtp?.host ?? "");
  const [smtpPort, setSmtpPort] = useState(initialSmtp?.port ?? 587);
  const [smtpSecure, setSmtpSecure] = useState(Boolean(initialSmtp?.secure));
  const [smtpUser, setSmtpUser] = useState(initialSmtp?.user ?? "");
  const [smtpPassword, setSmtpPassword] = useState(initialSmtp?.password ?? "");
  const [fromEmail, setFromEmail] = useState(initialSmtp?.fromEmail ?? "");
  const [additionalText, setAdditionalText] = useState(initialAdditionalText ?? "");
  const [template, setTemplate] = useState<"default" | "template 1">(initialTemplate ?? "default");
  const [paywall, setPaywall] = useState<Payment["paywall"]>(initialPaywall ?? "stripe");
  const [stripeSecret, setStripeSecret] = useState(initialStripe?.secret ?? "");
  const [stripePublic, setStripePublic] = useState(initialStripe?.public ?? "");
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState(initialStripe?.webhookSecret ?? "");
  const [autopayServiceId, setAutopayServiceId] = useState(initialAutopay?.serviceID ?? "");
  const [autopayHashKey, setAutopayHashKey] = useState(initialAutopay?.hashKey ?? "");
  const [autopayEndpoint, setAutopayEndpoint] = useState(initialAutopay?.endpoint ?? "");
  const [p24PosId, setP24PosId] = useState(initialP24?.posId ?? "");
  const [p24Crc, setP24Crc] = useState(initialP24?.crc ?? "");
  const [p24SecretId, setP24SecretId] = useState(initialP24?.secretId ?? "");
  const [p24Endpoint, setP24Endpoint] = useState(initialP24?.endpoint ?? "");
  const [fulfilmentName, setFulfilmentName] = useState(initialFulfilmentAddress?.name ?? "");
  const [fulfilmentAddress, setFulfilmentAddress] = useState(initialFulfilmentAddress?.address ?? "");
  const [fulfilmentCity, setFulfilmentCity] = useState(initialFulfilmentAddress?.city ?? "");
  const [fulfilmentRegion, setFulfilmentRegion] = useState(initialFulfilmentAddress?.region ?? "");
  const [fulfilmentPostalCode, setFulfilmentPostalCode] = useState(initialFulfilmentAddress?.postalCode ?? "");
  const [fulfilmentCountry, setFulfilmentCountry] = useState(initialFulfilmentAddress?.country ?? "us");
  const [fulfilmentEmail, setFulfilmentEmail] = useState(initialFulfilmentAddress?.email ?? "");
  const [fulfilmentPhone, setFulfilmentPhone] = useState(initialFulfilmentAddress?.phone ?? "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const saveChanges = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const parsedCurrencyValues = JSON.parse(currencyValuesJson) as { currency: string; value: number }[];

      await axios.patch(
        "/api/admin/settings",
        {
          additionalText,
          availableCurrencies: availableCurrencies
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean),
          autopay: {
            endpoint: autopayEndpoint,
            hashKey: autopayHashKey,
            serviceID: autopayServiceId,
          },
          currencyValues: Array.isArray(parsedCurrencyValues) ? parsedCurrencyValues : [],
          enableOAuth,
          fulfilmentAddress: {
            address: fulfilmentAddress,
            city: fulfilmentCity,
            country: fulfilmentCountry,
            email: fulfilmentEmail,
            name: fulfilmentName,
            phone: fulfilmentPhone,
            postalCode: fulfilmentPostalCode,
            region: fulfilmentRegion,
          },
          p24: {
            crc: p24Crc,
            endpoint: p24Endpoint,
            posId: p24PosId,
            secretId: p24SecretId,
          },
          paywall,
          primaryColor,
          shopTagline,
          shopTitle,
          smtp: {
            fromEmail,
            host: smtpHost,
            password: smtpPassword,
            port: Number(smtpPort),
            secure: smtpSecure,
            user: smtpUser,
          },
          stripe: {
            public: stripePublic,
            secret: stripeSecret,
            webhookSecret: stripeWebhookSecret,
          },
          template,
        },
        {
          withCredentials: true,
        },
      );

      setMessage("Settings updated.");
      router.refresh();
    } catch (error) {
      if (isAxiosError(error)) {
        setMessage((error.response?.data as { message?: string } | undefined)?.message ?? "Failed to update settings.");
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to update settings.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">General Shop</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="shopTitle">Site Title</Label>
            <Input id="shopTitle" onChange={(event) => setShopTitle(event.target.value)} value={shopTitle} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shopTagline">Tagline</Label>
            <Input id="shopTagline" onChange={(event) => setShopTagline(event.target.value)} value={shopTagline} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input id="primaryColor" onChange={(event) => setPrimaryColor(event.target.value)} value={primaryColor} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availableCurrencies">Available Currencies</Label>
            <Input
              id="availableCurrencies"
              onChange={(event) => setAvailableCurrencies(event.target.value)}
              value={availableCurrencies}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currencyValues">Currency Values JSON</Label>
          <Textarea id="currencyValues" onChange={(event) => setCurrencyValuesJson(event.target.value)} rows={6} value={currencyValuesJson} />
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <Checkbox checked={enableOAuth} onCheckedChange={(checked) => setEnableOAuth(Boolean(checked))} />
          <span>Enable OAuth</span>
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Email Templates</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input id="smtpHost" onChange={(event) => setSmtpHost(event.target.value)} value={smtpHost} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input id="smtpPort" onChange={(event) => setSmtpPort(Number(event.target.value))} type="number" value={smtpPort} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUser">SMTP User</Label>
            <Input id="smtpUser" onChange={(event) => setSmtpUser(event.target.value)} value={smtpUser} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input id="smtpPassword" onChange={(event) => setSmtpPassword(event.target.value)} value={smtpPassword} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input id="fromEmail" onChange={(event) => setFromEmail(event.target.value)} value={fromEmail} />
          </div>
          <div className="space-y-2">
            <Label>Template</Label>
            <Select onValueChange={(value) => setTemplate(value as "default" | "template 1")} value={template}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">default</SelectItem>
                <SelectItem value="template 1">template 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <Checkbox checked={smtpSecure} onCheckedChange={(checked) => setSmtpSecure(Boolean(checked))} />
          <span>SMTP Secure</span>
        </label>
        <div className="space-y-2">
          <Label htmlFor="additionalText">Additional Email Text</Label>
          <Textarea id="additionalText" onChange={(event) => setAdditionalText(event.target.value)} rows={5} value={additionalText} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Payment</h3>
        <div className="space-y-2">
          <Label>Paywall</Label>
          <Select onValueChange={(value) => setPaywall(value as Payment["paywall"])} value={paywall ?? "stripe"}>
            <SelectTrigger>
              <SelectValue placeholder="Select paywall" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stripe">stripe</SelectItem>
              <SelectItem value="autopay">autopay</SelectItem>
              <SelectItem value="p24">p24</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="stripeSecret">Stripe Secret</Label>
            <Input id="stripeSecret" onChange={(event) => setStripeSecret(event.target.value)} value={stripeSecret} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripePublic">Stripe Public</Label>
            <Input id="stripePublic" onChange={(event) => setStripePublic(event.target.value)} value={stripePublic} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripeWebhookSecret">Stripe Webhook Secret</Label>
            <Input
              id="stripeWebhookSecret"
              onChange={(event) => setStripeWebhookSecret(event.target.value)}
              value={stripeWebhookSecret}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="autopayServiceId">Autopay Service ID</Label>
            <Input id="autopayServiceId" onChange={(event) => setAutopayServiceId(event.target.value)} value={autopayServiceId} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="autopayHashKey">Autopay Hash Key</Label>
            <Input id="autopayHashKey" onChange={(event) => setAutopayHashKey(event.target.value)} value={autopayHashKey} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="autopayEndpoint">Autopay Endpoint</Label>
            <Input id="autopayEndpoint" onChange={(event) => setAutopayEndpoint(event.target.value)} value={autopayEndpoint} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="p24PosId">P24 Pos ID</Label>
            <Input id="p24PosId" onChange={(event) => setP24PosId(event.target.value)} value={p24PosId} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p24Crc">P24 CRC</Label>
            <Input id="p24Crc" onChange={(event) => setP24Crc(event.target.value)} value={p24Crc} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p24SecretId">P24 Secret ID</Label>
            <Input id="p24SecretId" onChange={(event) => setP24SecretId(event.target.value)} value={p24SecretId} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p24Endpoint">P24 Endpoint</Label>
            <Input id="p24Endpoint" onChange={(event) => setP24Endpoint(event.target.value)} value={p24Endpoint} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Fulfilment</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fulfilmentName">Name</Label>
            <Input id="fulfilmentName" onChange={(event) => setFulfilmentName(event.target.value)} value={fulfilmentName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fulfilmentEmail">Email</Label>
            <Input id="fulfilmentEmail" onChange={(event) => setFulfilmentEmail(event.target.value)} value={fulfilmentEmail} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fulfilmentAddress">Address</Label>
            <Input id="fulfilmentAddress" onChange={(event) => setFulfilmentAddress(event.target.value)} value={fulfilmentAddress} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fulfilmentCity">City</Label>
            <Input id="fulfilmentCity" onChange={(event) => setFulfilmentCity(event.target.value)} value={fulfilmentCity} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fulfilmentRegion">Region</Label>
            <Input id="fulfilmentRegion" onChange={(event) => setFulfilmentRegion(event.target.value)} value={fulfilmentRegion} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fulfilmentPostalCode">Postal Code</Label>
            <Input id="fulfilmentPostalCode" onChange={(event) => setFulfilmentPostalCode(event.target.value)} value={fulfilmentPostalCode} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fulfilmentCountry">Country</Label>
            <Input id="fulfilmentCountry" onChange={(event) => setFulfilmentCountry(event.target.value)} value={fulfilmentCountry} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fulfilmentPhone">Phone</Label>
            <Input id="fulfilmentPhone" onChange={(event) => setFulfilmentPhone(event.target.value)} value={fulfilmentPhone} />
          </div>
        </div>
      </section>

      <Button disabled={isSaving} onClick={saveChanges}>
        {isSaving ? "Saving..." : "Save settings"}
      </Button>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
};
