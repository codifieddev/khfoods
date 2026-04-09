"use client";

import React, { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/administrators/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        window.location.href = "/admin-dashboard";
      } else {
        const data = await res.json();
        setError(data.errors?.[0]?.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
         <div className="bg-black/40 backdrop-blur-3xl rounded-[40px] border border-white/10 p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            
            <div className="mb-10 text-center">
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6 shadow-inner ring-1 ring-white/10">
                  <ShieldCheck className="w-8 h-8" />
               </div>
               <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase italic">Admin Access</h1>
               <p className="text-gray-500 font-medium text-sm">Secure terminal for KH Foods management.</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-1">Administrator Email</label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                     <Input 
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="pl-12 h-14 bg-white/5 border-white/5 text-white rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/50 font-medium transition-all" 
                       placeholder="admin@khfood.com" 
                       required
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-1">Security Key</label>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                     <Input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="pl-12 h-14 bg-white/5 border-white/5 text-white rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/50 font-medium transition-all" 
                       placeholder="••••••••" 
                       required
                     />
                  </div>
               </div>

               {error && (
                  <div className="bg-red-500/10 text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-500/20 text-sm font-bold animate-in shake duration-300">
                     <AlertCircle className="w-5 h-5 flex-shrink-0" />
                     <p>{error}</p>
                  </div>
               )}

               <div className="pt-6">
                   <Button 
                     disabled={loading}
                     className="w-full h-15 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] group shadow-[0_8px_32px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
                   >
                      {loading ? 'Authenticating...' : 'Enter Dashboard'}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </Button>
               </div>
            </form>
            
            <div className="mt-12 pt-8 border-t border-white/5 text-center">
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                  Restricted system. Unauthorized access is monitored.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
