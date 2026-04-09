"use client";

import React, { useState, useEffect } from "react";
import { 
  Files, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  ExternalLink,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/admin/pages/list", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setPages(data.docs || []);
        }
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const filteredPages = pages.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col no-prose">
       
       {/* Header */}
       <header className="mb-12 flex items-end justify-between">
          <div>
             <div className="flex items-center gap-3 mb-3">
                <span className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner text-2xl font-black">
                   <Files className="w-6 h-6" />
                </span>
                <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase italic leading-none">Site Framework</h1>
             </div>
             <p className="text-gray-500 font-medium">Coordinate your storefront's static pages and structural content layouts.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Identify page..." 
                  className="pl-12 h-12 bg-white border-gray-100 rounded-xl focus-visible:ring-black font-medium shadow-sm transition-all italic text-sm" 
                />
             </div>
             
             <Button className="bg-black hover:bg-gray-800 text-white rounded-xl font-black text-xs uppercase tracking-widest px-6 h-12 flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                <Plus className="w-4 h-4" />
                Construct Page
             </Button>
          </div>
       </header>

       {/* Pages Grid */}
       <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm flex-1">
          {loading ? (
             <div className="p-20 text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6" />
                <p className="font-black uppercase tracking-widest text-xs text-gray-400 italic">Mapping Site Map...</p>
             </div>
          ) : filteredPages.length === 0 ? (
             <div className="p-20 text-center">
                <Files className="w-16 h-16 text-gray-200 mx-auto mb-6" strokeWidth={1} />
                <p className="font-black uppercase tracking-widest text-xs text-gray-400 italic">No corresponding pages found.</p>
             </div>
          ) : (
             <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-50">
                   <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Node Configuration</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Visibility</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Last Modified</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-indigo-50/20 transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-indigo-300">
                                  <Globe className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="font-black text-gray-900 tracking-tight mb-1">{page.title || "New System Page"}</p>
                                  <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">/ {page.slug === 'home' ? '' : page.slug}</span>
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${page._status === 'published' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                               {page._status === 'published' ? 'Deployed' : 'Local Draft'}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-gray-500">
                               <Calendar className="w-4 h-4 text-gray-300" />
                               <span className="text-xs font-bold uppercase tracking-wider">{new Date(page.updatedAt || page.createdAt).toLocaleDateString()}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <a href={`/${page.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                  <ExternalLink className="w-4 h-4" />
                               </a>
                               <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-amber-600 hover:bg-amber-50">
                                  <Edit className="w-4 h-4" />
                               </Button>
                               <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50">
                                  <Trash2 className="w-4 h-4" />
                               </Button>
                            </div>
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
