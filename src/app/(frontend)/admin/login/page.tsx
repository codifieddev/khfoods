import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin-next/AdminLoginForm";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";

const AdminLoginPage = async () => {
  const administrator = await getAuthenticatedAdministrator();

  if (administrator) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-white to-slate-200 px-6 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-between gap-12">
        <section className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">KH Foods Admin</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            A lighter admin entry point for the Next.js migration.
          </h1>
          <p className="text-lg text-slate-600">
            We are moving away from Payload step by step. This login opens the new admin shell first,
            while legacy collection screens remain available where we still need them.
          </p>
        </section>
        <AdminLoginForm />
      </div>
    </main>
  );
};

export default AdminLoginPage;
