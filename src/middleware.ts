import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

/**
 * 1️⃣ Create the i18n middleware from next-intl
 */
const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl;
  const pathWithoutLocale = pathname.replace(/^\/(en|pl|hr)/, "");
  
  /**
   * --- Authentication & Protection ---
   * Renamed from payload-token to auth-token for native Next.js implementation
   */
  const authTokenName = "auth-token";

  /**
   * --- Administrative Protection ---
   */
  if (pathWithoutLocale.startsWith("/admin") || pathWithoutLocale.startsWith("/admin-dashboard")) {
    const token = req.cookies.get(authTokenName)?.value;
    
    // Ignore the login page itself to avoid infinite redirect loops
    if (pathWithoutLocale === "/admin/login" || pathWithoutLocale === "/admin-login") {
      return intlMiddleware(req);
    }

    if (!token) {
      const redirectURL = req.nextUrl.clone();
      const locale = pathname.split("/")[1] || "en";
      redirectURL.pathname = `/${locale}/admin/login`;
      return Response.redirect(redirectURL);
    }
  }

  /**
   * --- Checkout Protection ---
   */
  if (pathWithoutLocale.startsWith("/checkout")) {
    const token = req.cookies.get(authTokenName)?.value;
    if (!token) {
      const locale = pathname.split("/")[1] || "en";
      const redirectURL = req.nextUrl.clone();
      redirectURL.pathname = `/${locale}/login`;
      return Response.redirect(redirectURL);
    }
  }

  const host = req.headers.get("host") || "";
  const domain = host.replace(/:\d+$/, ""); // remove port
  const parts = domain.split(".");
  let tenant = "default";

  if (parts.length > 2) {
    tenant = parts[0]; // e.g. subdomain.example.com → subdomain
  }

  /**
   * --- Run next-intl middleware ---
   */
  const response = intlMiddleware(req);

  /**
   * --- Add tenant info to response headers ---
   */
  response.headers.set("x-tenant", tenant);
  response.headers.set("x-tenant-domain", domain);

  return response;
}

/**
 * 2️⃣ Matcher configuration (i18n + custom middleware)
 */
export const config = {
  matcher: [
    "/",
    "/(pl|en|hr)/:path*",
    "/((?!api|_next|next|admin|route|proxy|.*\\..*).*)",
  ]
};
