"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface AdminRouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function AdminRouteError({ error, reset }: AdminRouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-xl rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-2xl shadow-slate-200/40">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-500">Admin Error</p>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Something went wrong while loading this admin page.
        </h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
          The page failed to render, but the rest of the app should still be fine. Try reloading this section.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={() => reset()} className="rounded-xl bg-slate-900 px-5 font-bold text-white">
            Try again
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl border-slate-200 px-5 font-bold">
            Reload page
          </Button>
        </div>
      </div>
    </div>
  );
}
