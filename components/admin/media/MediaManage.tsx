"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Link2,
  X,
  Search,
  Image as ImageIcon,
  Clock,
  Trash2,
  Plus,
  Terminal,
  Database,
  Layers,
  Sparkles,
  Award,
  Shield,
  Star,
  Download,
  Filter,
  Eye,
  FileText,
  Copy,
  Activity,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MediaUploader = ({
  onSelect,
  hideHeader = false,
}: {
  onSelect?: (item: any) => void;
  hideHeader?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [uploadMethod, setUploadMethod] = useState<string>("file");
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const fileObjects = files.map((file: File) => ({
      file,
      filename: file.name,
      alt: "",
      preview: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(0) + " KB",
      foldername: "",
      type: "image",
    }));
    setSelectedFiles([...selectedFiles, ...fileObjects]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const files = Array.from(e.dataTransfer.files);
    const fileObjects = files.map((file: File) => ({
      file,
      filename: file.name,
      alt: "",
      preview: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(0) + " KB",
      foldername: "",
      type: "image",
    }));
    setSelectedFiles([...selectedFiles, ...fileObjects]);
  };

  const updateFileMetadata = (index: number, field: string, value: string) => {
    const updated = [...selectedFiles];
    updated[index][field] = value;
    setSelectedFiles(updated);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const newMedia = selectedFiles.map((file: any, idx: number) => ({
      id: mediaLibrary.length + idx + 1,
      filename: file.filename,
      url: file.preview,
      alt: file.alt || file.filename,
      file: file.file,
      foldername: file.foldername ? file.foldername : "Uncategorized",
      type: file.type,
    }));

    const formData: any = new FormData();
    for (let i of newMedia) {
      formData.append("files", i.file);
      formData.append("name", i.filename);
      formData.append("altText", i.alt);
      formData.append("foldername", i.foldername);
    }

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setMediaLibrary([...data.data, ...mediaLibrary]);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUrlUpload = () => {
    if (!urlInput) return;

    const newMedia = {
      id: mediaLibrary.length + 1,
      name: "Image from URL",
      url: urlInput,
      alt: "Image from URL",
      date: new Date().toISOString().split("T")[0],
      size: "N/A",
    };

    setMediaLibrary([newMedia, ...mediaLibrary]);
    setUrlInput("");
  };

  const folders = Array.from(
    new Set(
      mediaLibrary
        .map((item: any) => item.foldername)
        .filter((name) => name && name.trim() !== ""),
    ),
  ).sort();

  const filteredMedia = mediaLibrary.filter((item: any) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder =
      selectedFolder === null || item.foldername === selectedFolder;

    return matchesSearch && matchesFolder;
  });

  useEffect(() => {
    async function getMedia() {
      const response = await fetch("/api/media");
      const data = await response.json();
      if (data.success) {
        setMediaLibrary(data.data);
      }
    }
    getMedia();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col space-y-12 pb-20 max-w-[1600px] mx-auto w-full"
    >
      {/* LUXURY HEADER */}
      {!hideHeader && (
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#C8A97E]">
              <ImageIcon size={16} />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
                Digital Asset Boutique
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
              Media <span className="text-[#C8A97E]">Library</span>
            </h1>
            <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
              Curate and manage your high-fidelity brand assets with uncompromising detail.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-full">
              {["upload", "library"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative px-8 h-11 text-[11px] font-bold uppercase tracking-widest transition-all duration-500 rounded-full",
                    activeTab === tab
                      ? "bg-[#C8A97E] text-black shadow-lg shadow-[#C8A97E]/20"
                      : "text-white/40 hover:text-white"
                  )}
                >
                  {tab === "upload" ? "Forge Assets" : "Collection"}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REFINED TOOLBAR */}
      {activeTab === "library" && (
        <section className="flex flex-col lg:flex-row items-center gap-6 bg-[#0A0A0A] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#C8A97E] transition-colors" />
            <input
              placeholder="Search assets by filename or collection tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 h-14 bg-[#050505] border border-white/5 rounded-2xl text-[13px] font-medium text-white placeholder:text-white/20 focus:border-[#C8A97E]/40 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest">
              <Sparkles size={14} className="animate-pulse" /> {filteredMedia.length} Curated Assets
            </div>
          </div>
        </section>
      )}

      {/* CONTENT ARCHITECTURE */}
      <AnimatePresence mode="wait">
        {activeTab === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-4">
              <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl">
                {[
                  { value: "file", icon: Download, label: "Local Asset" },
                  { value: "url", icon: Link2, label: "Network Link" },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setUploadMethod(value)}
                    className={cn(
                      "flex items-center gap-3 px-6 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                      uploadMethod === value
                        ? "bg-[#C8A97E]/10 text-[#C8A97E] border border-[#C8A97E]/20 shadow-lg"
                        : "text-white/20 hover:text-white"
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {uploadMethod === "file" ? (
              <div className="space-y-10">
                <motion.div
                  whileHover={{ scale: 1.002 }}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="relative group bg-[#0A0A0A] border-2 border-dashed border-white/5 rounded-[3rem] p-24 text-center cursor-pointer hover:border-[#C8A97E]/30 transition-all duration-700 shadow-2xl relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-[#C8A97E]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="w-24 h-24 mx-auto mb-10 bg-black border border-white/10 flex items-center justify-center rounded-[2rem] group-hover:border-[#C8A97E]/40 group-hover:rotate-6 transition-all duration-700 shadow-2xl relative z-10">
                    <Upload
                      className="text-white/20 group-hover:text-[#C8A97E] transition-colors"
                      size={32}
                    />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white tracking-tight mb-3 relative z-10">
                    Surrender Assets Here
                  </h3>
                  <p className="text-[13px] font-medium text-white/30 uppercase tracking-[0.2em] relative z-10">
                    Drop high-fidelity files or click to probe local archives
                  </p>
                </motion.div>

                {selectedFiles.length > 0 && (
                  <motion.div className="space-y-6">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2rem] flex items-center gap-10 shadow-xl group transition-all hover:border-[#C8A97E]/10"
                      >
                         <div className="h-32 w-32 rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-black">
                            <img
                              src={file.preview}
                              alt=""
                              className="w-full h-full object-cover scale-110 opacity-80 group-hover:opacity-100 transition-all duration-700"
                            />
                         </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-1">Asset Identity</label>
                                <input
                                  type="text"
                                  value={file.alt}
                                  onChange={(e) =>
                                    updateFileMetadata(index, "alt", e.target.value)
                                  }
                                  placeholder="DESCRIPTIVE TAG (ALT)"
                                  className="w-full h-12 bg-black border border-white/5 rounded-xl px-5 text-[12px] font-medium text-white focus:border-[#C8A97E]/30 outline-none transition-all uppercase tracking-wider"
                                />
                              </div>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-1">Boutique Collection</label>
                                <input
                                  type="text"
                                  value={file.foldername}
                                  onChange={(e) =>
                                    updateFileMetadata(
                                      index,
                                      "foldername",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="e.g. SUMMER RESERVES"
                                  className="w-full h-12 bg-black border border-white/5 rounded-xl px-5 text-[12px] font-medium text-white focus:border-[#C8A97E]/30 outline-none transition-all uppercase tracking-wider"
                                />
                              </div>
                           </div>
                        </div>

                        <button
                          onClick={() => removeFile(index)}
                          className="h-12 w-12 rounded-full border border-white/5 text-white/20 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all flex items-center justify-center shadow-xl active:scale-90"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={handleUpload}
                      className="w-full h-16 bg-[#C8A97E] text-black font-bold uppercase tracking-[0.3em] text-[13px] rounded-full hover:bg-white transition-all shadow-2xl shadow-[#C8A97E]/20 flex items-center justify-center gap-4"
                    >
                      Establish Visual Presence ({selectedFiles.length} Assets)
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[2.5rem] shadow-2xl">
                <label className="block text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest mb-6 px-4">
                  Remote Archive Intercept
                </label>
                <div className="flex gap-5">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="ENTER SECURE ASSET URL..."
                    className="flex-1 h-14 bg-black border border-white/5 rounded-2xl px-6 text-[14px] text-white focus:border-[#C8A97E]/30 outline-none transition-all uppercase tracking-wider"
                  />
                  <button
                    onClick={handleUrlUpload}
                    className="h-14 px-10 bg-[#C8A97E] text-black font-bold uppercase tracking-widest text-[13px] rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center gap-3"
                  >
                    <Plus size={18} strokeWidth={2.5} /> Intercept
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {folders.length > 0 && (
              <div className="flex flex-wrap gap-4 pb-8 border-b border-white/5">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={cn(
                    "px-8 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-500 border",
                    selectedFolder === null
                      ? "bg-[#C8A97E] text-black border-[#C8A97E] shadow-lg shadow-[#C8A97E]/10"
                      : "bg-white/5 text-white/40 border-white/5 hover:text-white"
                  )}
                >
                  Unified Archive
                </button>
                {folders.map((folder: any) => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className={cn(
                      "px-8 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-500 border",
                      selectedFolder === folder
                        ? "bg-[#C8A97E] text-black border-[#C8A97E] shadow-lg shadow-[#C8A97E]/10"
                        : "bg-white/5 text-white/40 border-white/5 hover:text-white"
                    )}
                  >
                    {folder}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              <AnimatePresence>
                {filteredMedia.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedMedia(item)}
                    className="group relative bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-[#C8A97E]/40 transition-all duration-500 shadow-xl"
                  >
                    <div className="aspect-square bg-black overflow-hidden relative">
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover scale-110 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    <div className="p-5 bg-[#0A0A0A] relative z-10 border-t border-white/5">
                      <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest truncate group-hover:text-[#C8A97E] transition-colors">
                        {item.filename}
                      </p>
                      <div className="flex items-center gap-2 mt-2 opacity-30 group-hover:opacity-60 transition-opacity">
                        <Clock size={12} className="text-[#C8A97E]" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                          {(item.size / 1024).toFixed(0)} KB • Curated
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      <button className="h-9 w-9 bg-black/80 backdrop-blur-md rounded-xl border border-white/20 text-white hover:text-[#C8A97E] hover:border-[#C8A97E]/40 transition-all shadow-2xl flex items-center justify-center">
                        <Plus size={16} />
                      </button>
                      <button className="h-9 w-9 bg-black/80 backdrop-blur-md rounded-xl border border-white/20 text-white hover:text-red-500 hover:border-red-500/40 transition-all shadow-2xl flex items-center justify-center">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredMedia.length === 0 && (
              <div className="text-center py-40 bg-[#0A0A0A] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Shield size={180} className="text-[#C8A97E]" strokeWidth={1} />
                </div>
                <div className="relative z-10">
                   <Activity className="mx-auto mb-10 text-white/10" size={80} strokeWidth={1} />
                   <h4 className="text-xl font-heading font-medium text-white/40 tracking-tight">Archives Empty in this Sector</h4>
                   <p className="text-[11px] font-bold text-white/10 uppercase tracking-[0.3em] mt-4">Initiate upload to populate repository</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOUTIQUE DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedMedia && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 z-[100]"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-[#0A0A0A] border border-[#C8A97E]/30 p-1.5 max-w-5xl w-full shadow-[0_0_100px_rgba(200,169,126,0.15)] rounded-[3rem] overflow-hidden"
            >
              <div className="bg-black p-10 rounded-[2.8rem]">
                <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
                  <div className="flex items-center gap-5">
                    <Award size={24} className="text-[#C8A97E]" />
                    <div className="space-y-1">
                      <h3 className="text-2xl font-heading font-bold text-white tracking-tight">
                        Asset <span className="text-[#C8A97E]">Portrayal</span>
                      </h3>
                      <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">Exhaustive Curation Analysis</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="h-12 w-12 rounded-full bg-white/5 text-white/20 hover:text-[#C8A97E] transition-all flex items-center justify-center"
                  >
                    <XCircle size={32} strokeWidth={1} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="bg-[#0A0A0A] p-4 border border-white/5 rounded-[2rem] shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C8A97E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <img
                      src={selectedMedia.url}
                      alt=""
                      className="w-full h-auto object-contain bg-black rounded-3xl relative z-10"
                    />
                  </div>

                  <div className="space-y-10 py-6">
                    <div className="space-y-6">
                      <div className="border-l-4 border-[#C8A97E] pl-6 space-y-1">
                        <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Digital Codename</p>
                        <p className="text-xl font-bold text-white tracking-tight">{selectedMedia.filename}</p>
                      </div>
                      <div className="border-l-4 border-white/10 pl-6 space-y-1">
                        <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Curation Sector</p>
                        <p className="text-xl font-bold text-[#C8A97E] tracking-tight">{selectedMedia.foldername || "PRIMARY ARCHIVE"}</p>
                      </div>
                      <div className="border-l-4 border-white/10 pl-6 space-y-1">
                        <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Asset Valuation</p>
                        <p className="text-xl font-bold text-white tracking-tight">
                          {typeof selectedMedia.size === "number"
                            ? `${(selectedMedia.size / 1024).toFixed(0)} KB`
                            : selectedMedia.size} • High Resolution
                        </p>
                      </div>
                    </div>

                    <div className="pt-10 flex gap-4">
                      {onSelect ? (
                        <button
                          onClick={() => {
                            onSelect(selectedMedia);
                            setSelectedMedia(null);
                          }}
                          className="flex-1 h-14 bg-[#C8A97E] text-black font-bold uppercase tracking-widest text-[12px] rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/20 flex items-center justify-center gap-3"
                        >
                           <Plus size={18} strokeWidth={2.5} /> Deploy to Interface
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedMedia.url);
                            setSelectedMedia(null);
                          }}
                          className="flex-1 h-14 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[12px] rounded-full hover:text-black hover:bg-white transition-all flex items-center justify-center gap-3"
                        >
                          <Copy size={18} /> Duplicate URL
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
