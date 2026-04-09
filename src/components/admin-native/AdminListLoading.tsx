export function AdminListLoading() {
  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-40 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-10 w-80 max-w-full rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-4 w-[32rem] max-w-full rounded-full bg-slate-100 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-32 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-12 w-40 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="h-14 rounded-2xl bg-slate-100 animate-pulse" />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between px-2">
          <div className="h-4 w-56 rounded-full bg-slate-100 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-10 w-10 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-10 w-10 rounded-xl bg-slate-100 animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
}
