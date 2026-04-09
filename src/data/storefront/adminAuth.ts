import "server-only";

import { cookies } from "next/headers";

import { getAuthenticatedAdministratorFromToken, adminPayloadTokenCookieName } from "@/data/storefront/adminAccounts";

export const getAuthenticatedAdministrator = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminPayloadTokenCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    return await getAuthenticatedAdministratorFromToken(token);
  } catch (error) {
    console.error("Administrator auth error:", error);
    return null;
  }
};
