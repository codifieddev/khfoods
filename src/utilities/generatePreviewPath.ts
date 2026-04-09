import { type Locale } from "@/i18n/config";

const collectionPrefixMap: Partial<Record<string, string>> = {
  posts: "/posts",
  pages: ""
};

type Props = {
  collection: string;
  slug: string;
  req: {
    query: {
        locale: string;
    };
    host: string;
    protocol: string;
  };
};

export const generatePreviewPath1 = ({ collection, slug, req }: Props) => {
  const locale = req.query.locale as Locale;
  const path = `${collectionPrefixMap[collection] || ""}/${slug}`;

  const params = {
    locale,
    slug,
    collection,
    path
  };

  const encodedParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    encodedParams.append(key, value);
  });

  const isProduction =
    process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  const protocol = isProduction ? "https:" : req.protocol;

  const url = `${protocol}//${req.host}/api/enable-preview?${encodedParams.toString()}`;

  return url;
};

export const generatePreviewPath = ({ path, locale }: { path: string; locale: string }) => {
  return `/api/enable-preview?path=${encodeURIComponent(path)}&locale=${locale}`;
};
