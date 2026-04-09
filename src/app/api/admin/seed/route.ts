import { NextResponse } from "next/server";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";

export const maxDuration = 240;

export async function POST(): Promise<Response> {
  const user = await getAuthenticatedAdministrator();

  if (!user) {
    return new Response("Action forbidden.", { status: 403 });
  }

  return NextResponse.json(
    {
      success: false,
      message: "Database seeding is disabled during the Next.js migration.",
    },
    { status: 410 },
  );
}
