"use client";

import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setRequestLocale } from "next-intl/server";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-[#f9fafb]">
       <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[32px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-gray-100 mx-4 animate-in fade-in zoom-in-95 duration-500">
          
          {/* Left Side: Visual/Branding (Premium Branding) */}
          <div className="hidden md:block relative bg-[#eaba88] p-16 text-black overflow-hidden group">
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-8 p-3 bg-white/30 backdrop-blur-md rounded-2xl w-fit shadow-sm border border-white/20 group-hover:scale-105 transition-transform">
                     <CheckCircle2 className="w-8 h-8 text-black" />
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 uppercase leading-tight">
                    Pure quality <br/>
                    <span className="text-white/80">Every bite</span>
                  </h2>
                  <p className="text-lg font-medium opacity-80 max-w-xs">
                    Hand-roasted peanuts and premium nuts, delivered directly from our zagrebačka kovačnica to your doorstep.
                  </p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-lg p-8 rounded-[24px] border border-white/30 shadow-inner">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-4 bg-black rounded-full scale-75 opacity-80" />)}
                  </div>
                  <p className="font-bold italic text-base leading-relaxed">
                    "The best hand-roasted nuts in the country. Quality you can taste in every single crunch."
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/10" />
                    <span className="font-bold text-sm tracking-wide">Karlo Ban, Founder</span>
                  </div>
                </div>
             </div>
             
             {/* Background Dynamic Elements */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-2xl" />
          </div>

          {/* Right Side: Form Content */}
          <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
             <div className="mb-12 text-center md:text-left">
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    {isLogin ? 'Welcome Back' : 'Join the Club'}
                </h1>
                <p className="text-gray-500 font-medium">Access your order history and preferences.</p>
             </div>

             <form 
              className="space-y-5" 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;

                try {
                  const res = await fetch("/api/customers/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                  });
                  
                  if (res.ok) {
                    window.location.href = "/account";
                  } else {
                    const data = await res.json();
                    alert(data.message || "Invalid credentials");
                  }
                } catch (err) {
                  alert("Something went wrong. Please try again.");
                }
              }}
             >
                {!isLogin && (
                   <div className="space-y-2">
                     <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 pl-1">Full Name</label>
                     <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#eaba88] transition-colors" />
                        <Input name="fullName" className="pl-12 h-14 bg-gray-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#eaba88] font-medium shadow-inner transition-all" placeholder="Enter your name" />
                     </div>
                   </div>
                )}
                
                <div className="space-y-2">
                   <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 pl-1">Email Address</label>
                   <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#eaba88] transition-colors" />
                      <Input name="email" type="email" className="pl-12 h-14 bg-gray-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#eaba88] font-medium shadow-inner transition-all" placeholder="your@email.com" required />
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                     <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 pl-1">Password</label>
                     {isLogin && <a href="/reset-password" className="text-[11px] font-bold text-[#eaba88] hover:text-[#d8a876] transition-colors uppercase tracking-wider">Forgot?</a>}
                   </div>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#eaba88] transition-colors" />
                      <Input name="password" type="password" className="pl-12 h-14 bg-gray-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#eaba88] font-medium shadow-inner transition-all" placeholder="••••••••" required />
                   </div>
                </div>

                <div className="pt-4">
                    <Button type="submit" className="w-full h-15 bg-black hover:bg-gray-800 text-white rounded-2xl font-black text-sm uppercase tracking-[0.1em] group shadow-xl active:scale-[0.98] transition-all">
                       {isLogin ? 'Sign In Now' : 'Create My Account'}
                       <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
             </form>

             <div className="mt-10 text-center">
                <p className="text-sm text-gray-500 font-medium">
                   {isLogin ? "New to KH Foods?" : "Already a member?"}{" "}
                   <button 
                     onClick={() => setIsLogin(!isLogin)} 
                     className="font-black text-[#eaba88] hover:text-[#d8a876] transition-colors decoration-2 underline-offset-4 hover:underline"
                   >
                      {isLogin ? 'Sign Up Free' : 'Sign In instead'}
                   </button>
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
