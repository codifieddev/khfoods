import React from "react";
import { AdminSidebar } from "@/components/admin-next/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[#fcfcfd] min-h-screen no-prose">
      {/* Definitive Sidebar Shell */}
      <AdminSidebar />
      
      {/* Dynamic Content Panel */}
      <div className="flex-1 max-h-screen overflow-y-auto custom-scrollbar relative">
         <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-amber-500/5 to-transparent blur-3xl pointer-events-none" />
         <div className="relative z-10 p-8">
            {children}
         </div>
      </div>
    </div>
  );
}
