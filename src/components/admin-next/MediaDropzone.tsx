"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, Check, Loader2, AlertCircle, FileIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

interface MediaDropzoneProps {
  onSuccess: (url: string, id: string) => void;
  onClose?: () => void;
}

export const MediaDropzone: React.FC<MediaDropzoneProps> = ({ onSuccess, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    // Create preview
    if (file.type.startsWith("image/")) {
       setFilePreview(URL.createObjectURL(file));
    }

    try {
      const filename = `${Date.now()}-${file.name}`;
      const response = await fetch(`/api/admin/upload?filename=${encodeURIComponent(filename)}`, {
        method: "POST",
        body: file, // Direct upload for Vercel Blob proxy
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data.url, data.id);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Upload failed. Check server logs.");
      }
    } catch (err) {
      setError("Network error. Could not connect to upload service.");
    } finally {
      setUploading(false);
    }
  }, [onSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: false,
  });

  return (
    <div className="bg-white p-8 rounded-[40px] border border-dashed border-gray-200 shadow-2xl relative overflow-hidden group">
      {/* Background Decorative Blur */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity" />

      <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg">
               <Upload className="w-5 h-5" />
            </div>
            <div>
               <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 leading-none mb-1">Asset Uploader</h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Vercel Blob Native Integration</p>
            </div>
         </div>
         {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-all">
               <X className="w-4 h-4" />
            </button>
         )}
      </div>

      <div 
        {...getRootProps()} 
        className={`min-h-[220px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-500 relative cursor-pointer ${isDragActive ? 'border-indigo-600 bg-indigo-50/30 scale-[0.98]' : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50/50'}`}
      >
        <input {...getInputProps()} />
        
        {filePreview && (
           <div className="absolute inset-4 z-0 overflow-hidden rounded-2xl shadow-xl">
               <img src={filePreview} alt="Preview" className="w-full h-full object-cover blur-sm opacity-40" />
           </div>
        )}

        <div className="relative z-10 flex flex-col items-center text-center">
            {uploading ? (
               <>
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" strokeWidth={1} />
                  <p className="font-black uppercase tracking-widest text-xs text-indigo-700 italic">Syncing with Cloud Storage...</p>
                  <p className="text-[10px] font-bold text-indigo-400 mt-2">Uploading to: ecommerce.vercel-blob.com</p>
               </>
            ) : error ? (
               <>
                  <AlertCircle className="w-12 h-12 text-red-500 mb-6" strokeWidth={1} />
                  <p className="font-black uppercase tracking-widest text-xs text-red-600 mb-4">{error}</p>
                  <Button variant="outline" className="h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px]">
                     Try Another File
                  </Button>
               </>
            ) : (
               <>
                  <div className="w-16 h-16 bg-gray-50 rounded-[30px] flex items-center justify-center text-gray-300 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                     <FileIcon className="w-8 h-8" strokeWidth={1} />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Drop it here</h4>
                  <p className="text-xs font-medium text-gray-500 px-10 max-w-sm">
                     Drag and drop an image or <span className="text-indigo-600 font-bold underline cursor-pointer">browse your files</span>.
                  </p>
                  <p className="mt-6 text-[10px] font-black text-gray-300 uppercase tracking-widest italic">JPG, PNG or WEBP (Max 4.5MB)</p>
               </>
            )}
        </div>
      </div>
    </div>
  );
};
