"use client";

import { AdminRouteError } from "@/components/admin-native/AdminRouteError";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminRouteError error={error} reset={reset} />;
}
