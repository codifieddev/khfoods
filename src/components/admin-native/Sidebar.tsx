"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tags, 
  Settings2, 
  FileText, 
  Image as ImageIcon,
  ChevronRight,
  LogOut,
  Store
} from "lucide-react";
import { cn } from "@/lib/cn";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Orders",
    icon: ShoppingBag,
    href: "/admin/orders",
  },
  {
    title: "Products",
    icon: Package,
    href: "/admin/products",
  },
  {
    title: "Categories",
    icon: Tags,
    href: "/admin/categories",
  },
  {
    title: "Attributes",
    icon: Settings2,
    href: "/admin/attributes",
  },
  {
    title: "Pages",
    icon: FileText,
    href: "/admin/pages",
  },
  {
    title: "Media Library",
    icon: ImageIcon,
    href: "/admin/media",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 shadow-2xl transition-all duration-300 ease-in-out">
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="flex h-20 items-center justify-center border-b border-white/5 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Store className="h-6 w-6 text-slate-900" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">NextAdmin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" 
                    : "hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-200"
                  )} />
                  {item.title}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-primary/70" />}
              </Link>
            );
          })}
        </nav>

        {/* User / Footer */}
        <div className="border-t border-white/5 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
