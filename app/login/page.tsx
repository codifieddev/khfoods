"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Lock, 
  Mail, 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { motion } from "motion/react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Welcome back, Excellence.", {
          description: "Authenticated successfully. Redirecting to executive hub.",
        });
        
        // Refresh the page to trigger middleware check and state update
        router.push("/admin");
      
      } else {
        toast.error("Authentication Failed", {
          description: data.message || "Invalid credentials provided.",
        });
      }
    } catch (error) {
      toast.error("Connection Error", {
        description: "Could not establish terminal link. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* LUXURY BACKGROUND ACCENTS */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C8A97E]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C8A97E]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 text-[#C8A97E]">
            <ShieldCheck size={20} className="animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.4em]">KHFood Secure Gateway</span>
          </div>
          <div className="space-y-2">
          <h2 className="text-3xl font-heading font-bold text-white tracking-tight">
            Store <span className="text-[#C8A97E]">Management</span>
          </h2>
          <p className="text-[13px] font-medium text-white/30 uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[3rem] shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C8A97E]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[3rem]" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative group/input">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-[#C8A97E] transition-colors" size={18} />
                        <Input 
                          placeholder="admin@khfood.com" 
                          {...field} 
                          className="h-14 bg-black border-white/5 rounded-2xl pl-16 pr-6 text-white placeholder:text-white/10 focus:border-[#C8A97E]/40 outline-none transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group/input">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-[#C8A97E] transition-colors" size={18} />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="h-14 bg-black border-white/5 rounded-2xl pl-16 pr-14 text-white placeholder:text-white/10 focus:border-[#C8A97E]/40 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/20 flex items-center justify-center gap-4 group/btn"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

          <div className="flex flex-col text-center">
            <h1 className="text-xl font-heading font-black text-white tracking-widest">
              KHFOOD
            </h1>
            <span className="text-[10px] font-bold text-[#C8A97E]/60 uppercase tracking-[0.4em]">
              Admin Login
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
