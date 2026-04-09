import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/admin-native/Sidebar";
import { Header } from "@/components/admin-native/Header";
import "../globals.css";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable} twp`} lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased overflow-x-hidden selection:bg-primary/20">
        <Sidebar />
        <Header />
        
        <main className="min-h-screen pt-20 pl-64 transition-all duration-300">
          <div className="mx-auto max-w-screen-2xl p-6 lg:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
};

export default AdminLayout;
