"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  ShieldCheck,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/admin/customers/list", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.docs || []);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
       
       {/* Header */}
       <header className="mb-12 flex items-end justify-between">
          <div>
             <div className="flex items-center gap-3 mb-3">
                <span className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                   <Users className="w-6 h-6" />
                </span>
                <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase italic leading-none">Shopper Base</h1>
             </div>
             <p className="text-gray-500 font-medium">Manage your registered storefront users and their order history.</p>
          </div>
          
          <div className="relative w-[340px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <Input 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search by email or name..." 
               className="pl-12 h-14 bg-white border-gray-100 rounded-2xl focus-visible:ring-black font-medium shadow-sm transition-all italic text-sm" 
             />
          </div>
       </header>

       {/* Customer Data Table */}
       <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm flex-1">
          {loading ? (
             <div className="p-20 text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6" />
                <p className="font-black uppercase tracking-widest text-xs text-gray-400 italic">Syncing Customer Records...</p>
             </div>
          ) : filteredCustomers.length === 0 ? (
             <div className="p-20 text-center">
                <Users className="w-16 h-16 text-gray-200 mx-auto mb-6" strokeWidth={1.5} />
                <p className="font-black uppercase tracking-widest text-xs text-gray-400 italic">No corresponding shoppers found.</p>
             </div>
          ) : (
             <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-50">
                   <tr>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Account Status</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Registration</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Controls</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-blue-50/30 transition-colors group">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-black shadow-inner">
                                  {customer.name?.charAt(0).toUpperCase() || customer.email?.charAt(0).toUpperCase()}
                               </div>
                               <div>
                                  <p className="font-black text-gray-900 tracking-tight italic mb-0.5">{customer.name || "Unnamed Shopper"}</p>
                                  <div className="flex items-center gap-1.5 text-gray-400">
                                     <Mail className="w-3 h-3" />
                                     <span className="text-xs font-medium">{customer.email}</span>
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
                               <ShieldCheck className="w-3.5 h-3.5" />
                               Verified
                            </span>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-2 text-gray-500">
                               <Calendar className="w-4 h-4 text-gray-300" />
                               <span className="text-xs font-bold uppercase tracking-wider">{new Date(customer.createdAt).toLocaleDateString()}</span>
                            </div>
                         </td>
                         <td className="px-10 py-6 text-right">
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100">
                               <MoreHorizontal className="w-5 h-5" />
                            </Button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          )}
       </div>
    </div>
  );
}
