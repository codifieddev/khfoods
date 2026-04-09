"use client";

import React, { useState } from "react";
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const collection = searchParams.get("collection") || "customers";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/customers/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, collection }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Failed to reset password.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
        <div className="max-w-md w-full bg-white rounded-[32px] p-12 text-center shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
           </div>
           <h1 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight italic">Success!</h1>
           <p className="text-gray-500 font-medium mb-10 leading-relaxed">
             Your password has been reset successfully. Redirecting you to login...
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-[#f9fafb] px-4">
       <div className="max-w-md w-full bg-white rounded-[32px] p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-10 text-center">
             <div className="w-16 h-16 bg-[#eaba8815] rounded-2xl flex items-center justify-center text-[#eaba88] mx-auto mb-6">
                <Lock className="w-8 h-8" />
             </div>
             <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase italic">Reset Password</h1>
             <p className="text-gray-500 font-medium text-sm">Choose a strong new password for your account.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
             <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 pl-1">New Password</label>
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#eaba88] transition-colors" />
                   <Input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="pl-12 h-14 bg-gray-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#eaba88] font-medium shadow-inner transition-all" 
                     placeholder="••••••••" 
                     required
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 pl-1">Confirm Password</label>
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#eaba88] transition-colors" />
                   <Input 
                     type="password" 
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="pl-12 h-14 bg-gray-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#eaba88] font-medium shadow-inner transition-all" 
                     placeholder="••••••••" 
                     required
                   />
                </div>
             </div>

             {status === "error" && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-start gap-3 border border-red-100 text-sm font-medium">
                   <AlertCircle className="w-5 h-5 flex-shrink-0" />
                   <p>{errorMessage}</p>
                </div>
             )}

             <div className="pt-4">
                 <Button 
                   disabled={status === "loading" || !token}
                   className="w-full h-15 bg-black hover:bg-gray-800 text-white rounded-2xl font-black text-sm uppercase tracking-[0.1em] group shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
                 >
                    {status === "loading" ? 'Updating...' : 'Reset Password'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </Button>
             </div>
          </form>
       </div>
    </div>
  );
}
