"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  Palette, 
  Globe, 
  Layout, 
  LucideIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    sitetitle: "",
    tagline: "",
    primaryColor: "#000000",
    logoUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setSettings(data.data || settings);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setFeedback({ type: 'success', msg: "System configurations updated successfully" });
      } else {
        setFeedback({ type: 'error', msg: "Execution failed during update" });
      }
    } catch (error) {
       setFeedback({ type: 'error', msg: "Critical communication error with server" });
    } finally {
      setSaving(false);
      // Clear after 3 seconds
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  if (loading) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col no-prose">
       
       {/* Header */}
       <header className="mb-12 flex items-end justify-between">
          <div>
             <div className="flex items-center gap-3 mb-3">
                <span className="w-12 h-12 bg-gray-50 text-black rounded-2xl flex items-center justify-center shadow-inner text-2xl font-black">
                   <Settings className="w-6 h-6" />
                </span>
                <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase italic leading-none">System Settings</h1>
             </div>
             <p className="text-gray-500 font-medium">Coordinate your global storefront identity and structural preferences.</p>
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-black hover:bg-gray-800 text-white rounded-xl font-black text-xs uppercase tracking-widest px-8 h-14 flex items-center gap-2 shadow-2xl shadow-black/20 active:scale-95 transition-all"
          >
             <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
             {saving ? 'Syncing...' : 'Confirm Changes'}
          </Button>
       </header>

       {feedback && (
         <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-xs font-black uppercase tracking-widest">{feedback.msg}</span>
         </div>
       )}

       {/* Form Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Identity Section */}
          <section className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
             <SectionTitle icon={Globe} label="Site Identity" />
             
             <div className="space-y-6">
                <InputGroup label="Branding Title">
                   <Input 
                      value={settings.sitetitle}
                      onChange={e => setSettings({...settings, sitetitle: e.target.value})}
                      placeholder="e.g. KH Foods - Indian Essence" 
                      className="h-12 bg-gray-50 border-transparent rounded-xl focus-visible:ring-black font-medium italic text-sm" 
                   />
                </InputGroup>

                <InputGroup label="Tagline / Description">
                   <Input 
                      value={settings.tagline}
                      onChange={e => setSettings({...settings, tagline: e.target.value})}
                      placeholder="e.g. Pure Spice Excellence" 
                      className="h-12 bg-gray-50 border-transparent rounded-xl focus-visible:ring-black font-medium italic text-sm" 
                   />
                </InputGroup>
             </div>
          </section>

          {/* Branding Assets Section */}
          <section className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
             <SectionTitle icon={Layout} label="Visual Assets" />
             
             <div className="space-y-6">
                <InputGroup label="Primary Logo Variable (URL)">
                   <Input 
                      value={settings.logoUrl}
                      onChange={e => setSettings({...settings, logoUrl: e.target.value})}
                      placeholder="e.g. /assets/logo.png" 
                      className="h-12 bg-gray-50 border-transparent rounded-xl focus-visible:ring-black font-medium italic text-sm" 
                   />
                </InputGroup>
                
                {settings.logoUrl && (
                  <div className="h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-4">
                     <img src={settings.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                )}
             </div>
          </section>

          {/* Aesthetic Preferences Section */}
          <section className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm relative overflow-hidden md:col-span-2">
             <SectionTitle icon={Palette} label="Aesthetic Overlays" />
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <InputGroup label="Dominant Brand Color">
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl border-2 border-gray-100 shadow-inner overflow-hidden flex-shrink-0">
                         <input 
                           type="color" 
                           value={settings.primaryColor}
                           onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                           className="w-20 h-20 -m-4 cursor-pointer" 
                         />
                      </div>
                      <Input 
                         value={settings.primaryColor}
                         onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                         className="h-12 bg-gray-50 border-transparent rounded-xl focus-visible:ring-black font-mono text-sm" 
                      />
                   </div>
                </InputGroup>
             </div>
          </section>

       </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: LucideIcon, label: string }) {
   return (
      <div className="flex items-center gap-3 mb-8">
         <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
            <Icon className="w-5 h-5" />
         </div>
         <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 italic">{label}</h2>
      </div>
   )
}

function InputGroup({ label, children }: { label: string, children: React.ReactNode }) {
   return (
      <div className="space-y-2">
         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">{label}</label>
         {children}
      </div>
   )
}
