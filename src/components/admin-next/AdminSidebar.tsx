"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  ShoppingBag, 
  Users, 
  Tags, 
  Settings, 
  ChevronRight,
  LogOut,
  Files,
  PenTool
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";

const menuItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/admin-dashboard' },
  { id: 'products', label: 'Product Catalog', icon: Package, href: '/admin-dashboard/products' },
  { id: 'orders', label: 'Shipments', icon: ShoppingBag, href: '/admin-dashboard/orders' },
  { id: 'media', label: 'Asset Library', icon: ImageIcon, href: '/admin-dashboard/media' },
  { id: 'taxonomy', label: 'Taxonomy', icon: Tags, href: '/admin-dashboard/taxonomy' },
  { id: 'customers', label: 'Customers', icon: Users, href: '/admin-dashboard/customers' },
  { id: 'posts', label: 'Blog Posts', icon: PenTool, href: '/admin-dashboard/posts' },
  { id: 'pages', label: 'Site Pages', icon: Files, href: '/admin-dashboard/pages' },
  { id: 'settings', label: 'Configurations', icon: Settings, href: '/admin-dashboard/settings' },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const activeId = menuItems.find(item => pathname.includes(item.href))?.id || 'dashboard';

  return (
    <aside className="w-80 h-screen bg-white border-r border-gray-100 sticky top-0 flex flex-col p-8 no-prose">
      {/* Branding */}
      <div className="flex items-center gap-4 mb-16 px-2">
         <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-3">
            <span className="font-black text-xl italic uppercase font-serif tracking-tighter">KH</span>
         </div>
         <div>
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 leading-none mb-1">Command Center</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">Native Next.js Shell</p>
         </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
         {menuItems.map((item) => {
            const isActive = activeId === item.id;
            return (
               <Link 
                 key={item.id} 
                 href={item.href}
                 className={`flex items-center justify-between group p-4 rounded-2xl transition-all duration-500 border-2 ${isActive ? 'bg-black border-black text-white shadow-2xl shadow-black/20' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-900 shadow-sm'}`}
               >
                  <div className="flex items-center gap-4">
                     <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-amber-500'}`} strokeWidth={2.5} />
                     <span className="text-[11px] font-black uppercase tracking-[0.15em] italic">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} strokeWidth={3} />
               </Link>
            );
         })}
      </nav>

      {/* Footer / Account */}
      <div className="mt-12 pt-8 border-t border-gray-50">
         <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Decommission</span>
         </button>
      </div>
    </aside>
  );
};
