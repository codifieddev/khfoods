import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/data/mongo/client";
import { getCollectionDocumentById } from "@/data/storefront/mongoPayload";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import type {
  EmailMessage,
  Footer,
  Fulfilment,
  Header,
  InpostCourier,
  InpostCourierCod,
  ShopLayout,
  ShopSetting,
  Sitesetting,
} from "@/types/cms";
import { defaultSiteSettings } from "@/utilities/getSiteSettings";

export type StorefrontGlobal =
  | "emailMessages"
  | "footer"
  | "header"
  | "shopLayout"
  | "shopSettings"
  | "sitesetting"
  | "inpost-courier"
  | "inpost-courier-cod"
  | "fulfilment";

type StorefrontGlobalDataMap = {
  "emailMessages": EmailMessage;
  "footer": Footer;
  "fulfilment": Fulfilment;
  "header": Header;
  "inpost-courier": InpostCourier;
  "inpost-courier-cod": InpostCourierCod;
  "shopLayout": ShopLayout;
  "shopSettings": ShopSetting;
  "sitesetting": Sitesetting;
};

const cloneValue = <T>(value: T): T => {
  if (value === undefined) {
    return value;
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isLocalizedRecord = (value: unknown): value is Record<Locale, unknown> => {
  if (!isPlainObject(value)) {
    return false;
  }

  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => locales.includes(key as Locale));
};

const localizeValueDeep = (value: unknown, locale: Locale): unknown => {
  if (Array.isArray(value)) {
    return value.map((entry) => localizeValueDeep(entry, locale));
  }

  if (isLocalizedRecord(value)) {
    const localizedValue = value[locale] ?? value[defaultLocale] ?? Object.values(value)[0] ?? null;
    return localizeValueDeep(localizedValue, locale);
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, localizeValueDeep(entry, locale)]),
    );
  }

  return value;
};

export const normalizeRelationId = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof ObjectId) {
    return value.toString();
  }

  if (isPlainObject(value)) {
    if (typeof value.id === "string") {
      return value.id;
    }

    if (typeof value._id === "string") {
      return value._id;
    }

    if (value._id instanceof ObjectId) {
      return value._id.toString();
    }
  }

  return null;
};

const getNestedValue = (source: Record<string, unknown>, path: string) =>
  path.split(".").reduce<unknown>((current, key) => {
    if (!isPlainObject(current)) {
      return undefined;
    }

    return current[key];
  }, source);

const setNestedValue = (source: Record<string, unknown>, path: string, value: unknown) => {
  const parts = path.split(".");
  const lastPart = parts.pop();

  if (!lastPart) {
    return;
  }

  let current: Record<string, unknown> = source;

  for (const part of parts) {
    if (!isPlainObject(current[part])) {
      current[part] = {};
    }

    current = current[part] as Record<string, unknown>;
  }

  current[lastPart] = value;
};

const mediaPathsByGlobal: Partial<Record<StorefrontGlobal, string[]>> = {
  "emailMessages": ["messages.logo"],
  "header": ["logo"],
  "inpost-courier": ["icon"],
  "inpost-courier-cod": ["icon"],
  "sitesetting": ["logo", "logoLight", "logoDark", "favicon", "siteicon"],
};

const normalizeGlobalDocument = <T extends StorefrontGlobal>(
  slug: T,
  rawDocument: Record<string, unknown> | null,
  locale: Locale,
) => {
  const localizedDocument = localizeValueDeep(cloneValue(rawDocument ?? {}), locale) as Record<string, unknown>;

  if (!localizedDocument.id) {
    localizedDocument.id =
      typeof localizedDocument._id === "string"
        ? localizedDocument._id
        : localizedDocument._id?.toString?.() ?? slug;
  }

  delete localizedDocument._id;
  delete localizedDocument.__v;
  delete localizedDocument.globalType;

  if (slug === "sitesetting") {
    return {
      ...defaultSiteSettings,
      ...localizedDocument,
    } as unknown as StorefrontGlobalDataMap[T];
  }

  return localizedDocument as unknown as StorefrontGlobalDataMap[T];
};

const resolveGlobalMedia = async <T extends StorefrontGlobal>(
  slug: T,
  document: StorefrontGlobalDataMap[T],
  locale: Locale,
) => {
  const mediaPaths = mediaPathsByGlobal[slug];

  if (!mediaPaths?.length) {
    return document;
  }

  const resolvedDocument = cloneValue(document) as unknown as Record<string, unknown>;

  for (const path of mediaPaths) {
    const relationId = normalizeRelationId(getNestedValue(resolvedDocument, path));

    if (!relationId) {
      continue;
    }

    const media = await getCollectionDocumentById("media", relationId, locale, 0);

    if (media) {
      setNestedValue(resolvedDocument, path, media);
    }
  }

  return resolvedDocument as unknown as StorefrontGlobalDataMap[T];
};

const getStorefrontGlobalFromMongo = async <T extends StorefrontGlobal>(slug: T, locale: Locale) => {
  try {
    const db = await getMongoDb();
    const rawDocument = await db.collection("globals").findOne({ globalType: slug });
    const normalizedDocument = normalizeGlobalDocument(slug, rawDocument, locale);

    return await resolveGlobalMedia(slug, normalizedDocument, locale);
  } catch (error) {
    console.warn(`Falling back to default storefront global for "${slug}".`, error);
    return normalizeGlobalDocument(slug, null, locale);
  }
};

const buildSiteSettingsCss = (settings: Sitesetting) => `
  :root {
    --db-primary: ${settings.primaryColor};
    --db-primary-hover: ${settings.primaryHover};
    --db-primary-light: ${settings.primaryLight};

    --db-secondary: ${settings.secondaryColor};
    --db-secondary-hover: ${settings.secondaryHover};
    --db-secondary-light: ${settings.secondaryLight};

    --db-tertiary: ${settings.tertiaryColor};
    --db-tertiary-hover: ${settings.tertiaryHover};
    --db-tertiary-light: ${settings.tertiaryLight};

    --db-background: ${settings.backgroundColor};
    --db-background-secondary: ${settings.backgroundSecondary};
    --db-background-tertiary: ${settings.backgroundTertiary};

    --db-text-primary: ${settings.textPrimary};
    --db-text-secondary: ${settings.textSecondary};
    --db-text-muted: ${settings.textMuted};
    --db-text-link: ${settings.textLink};
    --db-text-link-hover: ${settings.textLinkHover};

    --db-success: ${settings.successColor};
    --db-warning: ${settings.warningColor};
    --db-error: ${settings.errorColor};
    --db-info: ${settings.infoColor};

    --db-border-color: ${settings.borderColor};
    --db-shadow-color: ${settings.shadowColor};

    --db-font-primary: ${settings.fontPrimary};
    --db-font-secondary: ${settings.fontSecondary};
    --db-font-mono: ${settings.fontMonospace};

    --db-fz-base: ${settings.fontSizeBase}px;
    --db-fz-h1: ${settings.fontSizeH1}px;
    --db-fz-h2: ${settings.fontSizeH2}px;
    --db-fz-h3: ${settings.fontSizeH3}px;
    --db-fz-h4: ${settings.fontSizeH4}px;
    --db-fz-h5: ${settings.fontSizeH5}px;
    --db-fz-h6: ${settings.fontSizeH6}px;
    --db-fz-small: ${settings.fontSizeSmall}px;
    --db-fz-large: ${settings.fontSizeLarge}px;

    --db-fw-light: ${settings.fontWeightLight};
    --db-fw-normal: ${settings.fontWeightNormal};
    --db-fw-medium: ${settings.fontWeightMedium};
    --db-fw-semibold: ${settings.fontWeightSemibold};
    --db-fw-bold: ${settings.fontWeightBold};

    --db-lh-base: ${settings.lineHeightBase};
    --db-lh-heading: ${settings.lineHeightHeading};

    --db-ls-normal: ${settings.letterSpacingNormal};
    --db-ls-wide: ${settings.letterSpacingWide};
  }

.db-bg-primary { background-color: var(--db-primary); }
.db-bg-primary-hover:hover { background-color: var(--db-primary-hover); }
.db-bg-primary-light { background-color: var(--db-primary-light); }

.db-bg-secondary { background-color: var(--db-secondary); }
.db-bg-secondary-hover:hover { background-color: var(--db-secondary-hover); }
.db-bg-secondary-light { background-color: var(--db-secondary-light); }

.db-bg-tertiary { background-color: var(--db-tertiary); }
.db-bg-tertiary-hover:hover { background-color: var(--db-tertiary-hover); }
.db-bg-tertiary-light { background-color: var(--db-tertiary-light); }

.db-bg-base { background-color: var(--db-background); }
.db-bg-base-2 { background-color: var(--db-background-secondary); }
.db-bg-base-3 { background-color: var(--db-background-tertiary); }

.db-text-primary { color: var(--db-text-primary); }
.db-text-secondary { color: var(--db-text-secondary); }
.db-text-muted { color: var(--db-text-muted); }
.db-text-link { color: var(--db-text-link); }
.db-text-link-hover:hover { color: var(--db-text-link-hover); }

.db-text-success { color: var(--db-success); }
.db-text-warning { color: var(--db-warning); }
.db-text-error { color: var(--db-error); }
.db-text-info { color: var(--db-info); }

.db-border-default { border-color: var(--db-border-color); }
.db-shadow-default { box-shadow: 0 4px 10px var(--db-shadow-color); }

.db-font-primary { font-family: var(--db-font-primary); }
.db-font-secondary { font-family: var(--db-font-secondary); }
.db-font-mono { font-family: var(--db-font-mono); }

.db-h1 { font-size: var(--db-fz-h1); line-height: var(--db-lh-heading); }
.db-h2 { font-size: var(--db-fz-h2); line-height: var(--db-lh-heading); }
.db-h3 { font-size: var(--db-fz-h3); line-height: var(--db-lh-heading); }
.db-h4 { font-size: var(--db-fz-h4); line-height: var(--db-lh-heading); }
.db-h5 { font-size: var(--db-fz-h5); line-height: var(--db-lh-heading); }
.db-h6 { font-size: var(--db-fz-h6); line-height: var(--db-lh-heading); }

.db-text-base { font-size: var(--db-fz-base); }
.db-text-small { font-size: var(--db-fz-small); }
.db-text-large { font-size: var(--db-fz-large); }

.db-fw-light { font-weight: var(--db-fw-light); }
.db-fw-normal { font-weight: var(--db-fw-normal); }
.db-fw-medium { font-weight: var(--db-fw-medium); }
.db-fw-semibold { font-weight: var(--db-fw-semibold); }
.db-fw-bold { font-weight: var(--db-fw-bold); }

.db-tracking-normal { letter-spacing: var(--db-ls-normal); }
.db-tracking-wide { letter-spacing: var(--db-ls-wide); }
`;

export const getStorefrontGlobal = async <T extends StorefrontGlobal>(
  slug: T,
  locale: Locale,
) => getStorefrontGlobalFromMongo(slug, locale);

export const getHeaderData = (locale: Locale, _depth = 1) => getStorefrontGlobal("header", locale);

export const getFooterData = (locale: Locale, _depth = 1) => getStorefrontGlobal("footer", locale);

export const getEmailMessagesData = (locale: Locale, _depth = 1): Promise<EmailMessage> =>
  getStorefrontGlobal("emailMessages", locale);

export const getShopLayoutData = (locale: Locale, _depth = 1) =>
  getStorefrontGlobal("shopLayout", locale);

export const getShopSettingsData = (locale: Locale, _depth = 1) =>
  getStorefrontGlobal("shopSettings", locale);

export const getSiteSettingsData = (locale: Locale, _depth = 1) =>
  getStorefrontGlobal("sitesetting", locale);

export const getCourierSettingsData = (slug: "inpost-courier" | "inpost-courier-cod", locale: Locale, _depth = 1) =>
  getStorefrontGlobal(slug, locale);

export const getFulfilmentData = (locale: Locale, _depth = 1) =>
  getStorefrontGlobal("fulfilment", locale);

export const getSiteSettingsCss = async (locale: Locale, _depth = 1) => {
  const settings = await getSiteSettingsData(locale);
  return buildSiteSettingsCss(settings);
};
