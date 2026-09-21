'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  MoveLeft,
  MoveRight,
  Crown,
  Sparkles,
  Plus,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  Eye
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LuxuryImageUploader({
  images = [],
  onChange,
  maxImages = 10,
  onError,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Process & Optimize Selected Files
  const processFiles = async (fileList) => {
    const files = Array.from(fileList);
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB max

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      onError?.(`Maximum ${maxImages} images allowed. Please remove some images first.`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    setUploading(true);
    setUploadProgress(15);

    const newImageUrls = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];

      // Validate Type
      if (!validExtensions.includes(file.type.toLowerCase())) {
        onError?.(`"${file.name}" is an invalid file format. Please upload JPG, PNG, or WEBP.`);
        continue;
      }

      // Validate Size
      if (file.size > maxFileSize) {
        onError?.(`"${file.name}" exceeds 10MB limit. Please upload a smaller image.`);
        continue;
      }

      try {
        setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 80));

        // Attempt Supabase Storage upload if bucket exists, fallback to optimized DataURL
        let publicUrl = null;
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `crystal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const filePath = `products/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true,
            });

          if (!uploadError && uploadData) {
            const { data: publicData } = supabase.storage
              .from('product-images')
              .getPublicUrl(filePath);
            if (publicData?.publicUrl) {
              publicUrl = publicData.publicUrl;
            }
          }
        } catch (storageErr) {
          // Silent fallback to DataURL
        }

        // If storage didn't yield a URL, convert to Base64 Data URL for instant, permanent client display
        if (!publicUrl) {
          publicUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          });
        }

        newImageUrls.push(publicUrl);
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }

    setUploadProgress(100);
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      if (newImageUrls.length > 0) {
        onChange([...images, ...newImageUrls]);
      }
    }, 400);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add URL manually
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://') && !urlInput.startsWith('data:image/')) {
      onError?.('Please enter a valid HTTP/HTTPS image URL.');
      return;
    }
    if (images.length >= maxImages) {
      onError?.(`Maximum ${maxImages} images allowed.`);
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  // Delete image
  const handleDeleteImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Set as Hero image (Move to index 0)
  const handleSetHero = (index) => {
    if (index === 0) return;
    const item = images[index];
    const filtered = images.filter((_, i) => i !== index);
    onChange([item, ...filtered]);
  };

  // Move image left
  const handleMoveLeft = (index) => {
    if (index === 0) return;
    const copy = [...images];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  // Move image right
  const handleMoveRight = (index) => {
    if (index === images.length - 1) return;
    const copy = [...images];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.01]'
            : 'border-[#D4AF37]/30 hover:border-[#D4AF37]/70 bg-stone-900/40 hover:bg-stone-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileInput}
          className="hidden"
        />

        {uploading ? (
          <div className="py-4 space-y-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mx-auto" />
            <p className="text-sm font-medium text-[#E5D5BA]">
              Optimizing and uploading crystal photography... {uploadProgress}%
            </p>
            <div className="w-48 h-1.5 bg-stone-800 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/5">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-medium text-stone-200">
                Drag & drop crystal photography here, or <span className="text-[#D4AF37] underline underline-offset-4">browse files</span>
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Supports JPG, JPEG, PNG, WEBP • Up to 10 high-resolution images • Max 10MB per file
              </p>
            </div>
          </div>
        )}
      </div>

      {/* URL Input Toggle & Count Status */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-400">
          <strong className="text-[#D4AF37] font-semibold">{images.length}</strong> of {maxImages} images uploaded
          {images.length > 0 && <span className="text-stone-500 ml-2">• The 1st image will be the primary hero image</span>}
        </span>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[#D4AF37] hover:text-[#f3e5ab] inline-flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showUrlInput ? 'Hide URL Input' : 'Add Image via Direct URL'}
        </button>
      </div>

      {/* Direct URL Input Form */}
      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-stone-900/80 border border-[#D4AF37]/20 rounded-xl">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/photo-... or cloud URL"
            className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs rounded-lg hover:brightness-110 transition-all shadow-md shadow-[#D4AF37]/10"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Gallery Image Grid with Reordering Controls */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {images.map((imgUrl, index) => {
            const isHero = index === 0;
            return (
              <div
                key={`${imgUrl}-${index}`}
                className={`group relative aspect-square rounded-xl overflow-hidden bg-stone-950 border transition-all duration-300 ${
                  isHero
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/10'
                    : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Image */}
                <img
                  src={imgUrl}
                  alt={`Crystal specimen ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hero Badge */}
                {isHero && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 shadow-md z-10">
                    <Crown className="w-3 h-3" /> Hero Image
                  </div>
                )}

                {/* Image Index */}
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] flex items-center justify-center font-mono border border-white/10 z-10">
                  {index + 1}
                </div>

                {/* Overlay Action Controls on Hover */}
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-between p-2 z-20">
                  <div className="flex items-center justify-between w-full">
                    {!isHero ? (
                      <button
                        type="button"
                        onClick={() => handleSetHero(index)}
                        title="Set as Hero Image"
                        className="px-2 py-1 bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black rounded text-[10px] font-medium flex items-center gap-1 transition-all"
                      >
                        <Crown className="w-3 h-3" /> Make Hero
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#D4AF37] font-semibold">Primary Cover</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(imgUrl)}
                      title="Fullscreen Preview"
                      className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Reordering and Delete Actions */}
                  <div className="flex items-center gap-1 w-full justify-center">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveLeft(index)}
                      title="Move Image Left"
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:hover:bg-stone-800 transition-colors"
                    >
                      <MoveLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      title="Delete Image"
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => handleMoveRight(index)}
                      title="Move Image Right"
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:hover:bg-stone-800 transition-colors"
                    >
                      <MoveRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Preview Lightbox */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl">
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-white hover:text-black transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalUrl}
              alt="High resolution specimen preview"
              className="w-auto h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
