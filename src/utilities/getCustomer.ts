"use server";

import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

import { getAuthenticatedCustomer } from "@/data/storefront/customerAuth";

export const getCustomer = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const customer = await unstable_cache(
    async () => {
      try {
        return await getAuthenticatedCustomer();
      } catch (error) {
        console.error("Auth error:", error);
        return null;
      }
    },
    ["user-auth", cookieString],
    {
      revalidate: 1,
      tags: ["user-auth"]
    },
  )();

  return customer ?? undefined;
};
