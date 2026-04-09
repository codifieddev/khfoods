"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Sparkles,
  Database,
  ListTree,
  Image as ImageIcon,
  Shield,
  Zap,
  Ticket,
  PlusCircle,
  Users,
  UserCog,
  Monitor,
  Truck,
  CheckCircle2,
  Megaphone,
  User2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: any;
  exact?: boolean;
  badge?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_ITEMS: NavGroup[] = [
  {
    label: "PERFORMANCE",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "LOGISTICS",
    items: [
      {
        title: "All Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        title: "Pending",
        href: "/admin/orders?status=pending",
        icon: Zap,
      },
      {
        title: "Shipped",
        href: "/admin/orders?status=shipped",
        icon: Truck,
      },
      {
        title: "Delivered",
        href: "/admin/orders?status=delivered",
        icon: CheckCircle2,
      },
    ],
  },
  {
    label: "INVENTORY",
    items: [
      {
        title: "All Products",
        href: "/admin/products",
        icon: Package,
      },
      {
        title: "Add Product",
        href: "/admin/products/new",
        icon: PlusCircle,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: ListTree,
      },
      {
        title: "Collections",
        href: "/admin/categories",
        icon: Database,
      },
    ],
  },
  {
    label: "CRM",
    items: [
      {
        title: "Customer List",
        href: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    label: "GROWTH",
    items: [
      {
        title: "Coupons / Discounts",
        href: "/admin/coupons",
        icon: Ticket,
      },
      {
        title: "Offers",
        href: "/admin/offers",
        icon: Megaphone,
      },
    ],
  },
  {
    label: "CREATIVE",
    items: [
      {
        title: "Banners",
        href: "/admin/banners",
        icon: Monitor,
      },
      {
        title: "Media Library",
        href: "/admin/media",
        icon: ImageIcon,
      },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      {
        title: "Users / Staff",
        href: "/admin/staff",
        icon: UserCog,
      },
      {
        title: "Roles & Permissions",
        href: "/admin/roles",
        icon: Shield,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-white/5 bg-[#050505] w-[280px]">
      <SidebarHeader className="p-8 pb-12">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-[#C8A97E]/10 border border-[#C8A97E]/20 flex items-center justify-center p-2 group-hover:bg-[#C8A97E]/20 transition-all">
            <Sparkles className="text-[#C8A97E]" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white uppercase tracking-tighter leading-none">
              KHFOOD
            </span>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1.5">
              Admin Suite
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-6 scrollbar-none">
        {NAV_ITEMS.map((group) => (
          <SidebarGroup key={group.label} className="mb-12 last:mb-0">
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-6 px-4">
               {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {group.items.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "group h-12 w-full px-5 transition-all duration-300 relative",
                          isActive
                            ? "bg-[#C8A97E]/10 text-white rounded-[2rem] border border-[#C8A97E]/10 shadow-[0_0_20px_rgba(200,169,126,0.05)]"
                            : "text-white/20 hover:text-white hover:bg-white/[0.02] rounded-[2rem] border border-transparent",
                          (item.title === "All Products" || item.title === "Add Product") && isActive && "shadow-[0_0_25px_rgba(200,169,126,0.1)]"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-4">
                          <item.icon
                            size={18}
                            className={cn(
                              "transition-transform duration-300 group-hover:scale-110",
                              isActive
                                ? "text-[#C8A97E]"
                                : "text-current group-hover:text-[#C8A97E]/40",
                            )}
                          />
                          <span className={cn(
                             "text-[13px] font-bold tracking-tight",
                             isActive ? "text-white font-extrabold" : "text-current"
                          )}>
                            {item.title}
                          </span>
                          
                          {isActive && (
                            <div className="absolute right-4 w-1 h-1 rounded-full bg-[#C8A97E] shadow-[0_0_10px_#C8A97E]" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-6 mt-auto">
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
              <User2 className="text-[#C8A97E]/40" size={24} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black text-white">Elite Admin</span>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">MASTER ACCESS</span>
            </div>
          </div>
          <button className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-white transition-all w-full pt-6 border-t border-white/5">
            <LogOut size={14} />
            LOGOUT
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
