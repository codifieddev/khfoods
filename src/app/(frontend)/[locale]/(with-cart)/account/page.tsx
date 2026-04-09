import React from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  ShoppingBag, 
  Heart,
  ChevronRight,
  User as UserIcon,
  Mail,
  Calendar
} from "lucide-react";

import { type Locale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { getCustomer } from "@/utilities/getCustomer";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export const dynamic = "force-dynamic";

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCustomer();
  const t = await getTranslations("Account.dashboard");

  if (!user) {
    // Should be handled by middleware, but fallback
    return null;
  }

  // Dashboard Sections
  const DASHBOARD_TILES = [
    {
      id: "orders",
      title: t("recent-orders"),
      icon: <Package className="w-6 h-6" />,
      href: "/account/orders",
      badge: "3", // Placeholder for actual count
      bg: "bg-blue-50",
      color: "text-blue-600"
    },
    {
       id: "addresses",
       title: t("shipping-billing"),
       icon: <MapPin className="w-6 h-6" />,
       href: "/account/orders-data",
       bg: "bg-green-50",
       color: "text-green-600"
     },
     {
       id: "settings",
       title: t("edit-password"),
       icon: <Settings className="w-6 h-6" />,
       href: "/account/settings",
       bg: "bg-[#eaba8815]",
       color: "text-[#eaba88]"
     },
     {
        id: "wishlist",
        title: "My Wishlist",
        icon: <Heart className="w-6 h-6" />,
        href: "/wishlist",
        bg: "bg-red-50",
        color: "text-red-500"
      }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 no-prose">
      {/* Header Section */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-16 h-16 rounded-full bg-[#eaba88] flex items-center justify-center text-white shadow-xl border-4 border-white">
                  <UserIcon className="w-8 h-8" />
               </div>
               <div>
                  <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">My Account</h1>
                  <p className="text-gray-500 font-medium">{t("greeting", { username: user.email })}</p>
               </div>
            </div>
          </div>
          <Link 
            href="/logout" 
            className="flex items-center gap-2 hover:bg-gray-100 px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all group font-bold tracking-tight uppercase text-xs"
          >
            <LogOut className="w-4 h-4" />
            {t("log-out")}
          </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <aside className="lg:col-span-1">
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] sticky top-32">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#eaba88] mb-8">Member Profile</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">Email Address</p>
                    <p className="font-bold text-gray-900 break-all">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-50">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">Member Since</p>
                    <p className="font-bold text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long' }) : "Recently Joined"}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                   <button className="w-full bg-black text-white rounded-xl py-4 font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-lg">
                      Update Profile
                   </button>
                </div>
              </div>
           </div>
        </aside>

        {/* Tiles Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-fit">
           {DASHBOARD_TILES.map((tile) => (
             <Link key={tile.id} href={tile.href} className="group relative bg-white border border-gray-100 rounded-3xl p-8 shadow-sm transition-all hover:scale-[1.03] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] flex flex-col justify-between overflow-hidden">
                <div className={`w-14 h-14 ${tile.bg} rounded-2xl flex items-center justify-center ${tile.color} mb-12 shadow-sm group-hover:rotate-6 transition-transform`}>
                   {tile.icon}
                </div>
                
                <div className="flex items-center justify-between">
                   <div>
                     <h4 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase">{tile.title}</h4>
                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Manage your information</p>
                   </div>
                   <ChevronRight className="w-5 h-5 text-[#eaba88] group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Abstract background element */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${tile.bg} opacity-20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-30 transition-opacity`} />
             </Link>
           ))}

           {/* Shopping Hero Callout */}
           <div className="sm:col-span-2 bg-gradient-to-r from-black to-gray-800 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden group">
              <div className="relative z-10 max-w-sm">
                 <h2 className="text-3xl font-black tracking-tight mb-3 uppercase italic">Discover our new hand-roasted collection</h2>
                 <p className="text-sm opacity-80 mb-6 font-medium">Explore the latest batch of hand-roasted peanuts, walnuts, and seasonal treats.</p>
                 <Link href="/products" className="bg-[#eaba88] text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-white transition-colors">
                    Shop Collection ↗
                 </Link>
              </div>
              <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex-shrink-0 opacity-80 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700">
                  <ShoppingBag className="w-full h-full text-[#eaba88] drop-shadow-3xl" strokeWidth={0.5} />
              </div>
              
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(234,186,136,0.15),transparent_70%)]" />
           </div>
        </div>
      </div>
    </div>
  );
}
