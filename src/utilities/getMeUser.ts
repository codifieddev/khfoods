import { cookies } from "next/headers";

import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import { type Locale } from "@/i18n/config";
import { redirect } from "@/i18n/routing";

import type { Administrator } from "@/types/cms";

/**
 * Native Next.js utility to retrieve the current authenticated user session.
 */
export const getMeUser = async (args?: {
  nullUserRedirect?: string;
  locale?: Locale;
  validUserRedirect?: string;
}): Promise<{
  token: string;
  user: Administrator;
}> => {
  const { nullUserRedirect, validUserRedirect, locale } = args ?? {};
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const user = (await getAuthenticatedAdministrator()) as Administrator | null;

  if (validUserRedirect && user) {
    return redirect({ locale: locale ?? "en", href: validUserRedirect });
  }

  if (nullUserRedirect && !user) {
    return redirect({ locale: locale ?? "en", href: nullUserRedirect });
  }

  if (!user) {
    throw new Error("Administrator session is not available.");
  }

  // Token will exist here because if it doesn't the user will be redirected
  return {
    token: token!,
    user
  };
};
