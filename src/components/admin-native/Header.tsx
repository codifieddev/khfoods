"use client";

import { Bell, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const pageTitle = pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";

  return (
    <header className="fixed inset-x-0 top-0 z-40 ml-64 border-b border-slate-200 bg-white/70 backdrop-blur-md transition-all duration-300">
      <div className="flex h-20 items-center justify-between px-8">
        {/* Left: Search & Title */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold capitalize tracking-tight text-slate-900">{pageTitle}</h1>
          <div className="hidden h-10 w-64 items-center gap-3 rounded-full bg-slate-100 px-4 transition-all focus-within:ring-2 focus-within:ring-primary/20 md:flex">
            <Search className="h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Right: Notifications & User */}
        <div className="flex items-center gap-4">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-2" />

          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">Admin User</span>
              <span className="text-xs font-semibold text-slate-500">Super Administrator</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 border-2 border-white ring-1 ring-slate-200 overflow-hidden shadow-sm transition-transform group-hover:scale-105">
              <User className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
