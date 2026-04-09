"use client";

import React, { useState, useEffect } from "react";
import { 
  PenTool, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts/list", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setPosts(data.docs || []);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col no-prose">
       
       {/* Header */}
       <header className="mb-12 flex items-end justify-between">
          <div>
             <div className="flex items-center gap-3 mb-3">
                <span className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                   <PenTool className="w-6 h-6" />
                </span>
                <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase italic leading-none">Editorial Posts</h1>
             </div>
             <p className="text-gray-500 font-medium">Manage your storefront's blog entries and editorial content natively.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..." 
                  className="pl-12 h-12 bg-white border-gray-100 rounded-xl focus-visible:ring-black font-medium shadow-sm transition-all italic text-sm" 
                />
             </div>
             
             {/* Note: The create post page isn't implemented yet, but keeping the button for UI completeness */}
             <Button className="bg-black hover:bg-gray-800 text-white rounded-xl font-black text-xs uppercase tracking-widest px-6 h-12 flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                <Plus className="w-4 h-4" />
                Draft Post
             </Button>
          </div>
       </header>

       {/* Posts Data Grid */}
       <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm flex-1">
          {loading ? (
             <div className="p-20 text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6" />
                <p className="font-black uppercase tracking-widest text-xs text-gray-400 italic">Syncing Editorial DB...</p>
             </div>
          ) : filteredPosts.length === 0 ? (
             <div className="p-20 text-center">
                <PenTool className="w-16 h-16 text-gray-200 mx-auto mb-6" strokeWidth={1} />
                <p className="font-black uppercase tracking-widest text-xs text-gray-400 italic">No corresponding articles found.</p>
             </div>
          ) : (
             <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-50">
                   <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Headline Context</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timeline</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Controls</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-amber-50/20 transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                                  {post.heroImage ? (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">IMG</div>
                                  ) : (
                                    <PenTool className="w-5 h-5 text-gray-300" />
                                  )}
                               </div>
                               <div>
                                  <p className="font-black text-gray-900 tracking-tight mb-1 line-clamp-1 max-w-[300px]">{post.title || "Untitled Draft"}</p>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.slug}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${post._status === 'published' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                               {post._status === 'published' ? 'Live' : 'Draft'}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-gray-500">
                               <Calendar className="w-4 h-4 text-gray-300" />
                               <span className="text-xs font-bold uppercase tracking-wider">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-blue-500 hover:bg-blue-50">
                                  <Eye className="w-4 h-4" />
                               </Button>
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
