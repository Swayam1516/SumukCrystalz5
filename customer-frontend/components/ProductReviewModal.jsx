'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Star, Upload, X, CheckCircle2, AlertCircle, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { submitProductReview } from '@/lib/accountService';

export default function ProductReviewModal({
  isOpen,
  onClose,
  productItem,
  orderId,
  userId,
  onReviewSuccess,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(0);
      setComment('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, productItem]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen || !productItem) return null;

  const handleFileChange = (e) => {
    setErrorMessage('');
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, or WEBP).');
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage('Image file size must be less than 5MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getRatingLabel = (stars) => {
    switch (stars) {
      case 5:
        return '5 Stars — Transcendental Energy & Quality';
      case 4:
        return '4 Stars — Highly Resonant & Beautiful';
      case 3:
        return '3 Stars — Average Vibration';
      case 2:
        return '2 Stars — Below Expectation';
      case 1:
        return '1 Star — Disappointing Experience';
      default:
        return 'Select Your Vibration Rating';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!comment.trim()) {
      setErrorMessage('Please provide a few words about your experience with this crystal.');
      return;
    }

    if (comment.trim().length < 10) {
      setErrorMessage('Please write a review with at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitProductReview({
        userId,
        productId: productItem.product_id || productItem.id,
        orderId: orderId,
        orderItemId: productItem.id,
        rating,
        comment,
        photoFile: selectedFile,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to post review');
      }

      setSuccessMessage('Thank you! Your verified review and energetic resonance have been recorded.');
      
      setTimeout(() => {
        if (onReviewSuccess) {
          onReviewSuccess(productItem.id, result.review);
        }
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Error publishing review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#0e0b16] border border-amber-500/30 rounded-2xl shadow-2xl shadow-purple-950/60 overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-amber-400"></div>

        <div className="flex items-center justify-between p-5 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-display text-lg font-semibold text-white">Write a Product Review</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 border-b border-zinc-800/60 bg-zinc-950/50 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/60 flex-shrink-0">
            {productItem.product_image ? (
              <img
                src={productItem.product_image}
                alt={productItem.product_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-zinc-100 truncate">
              {productItem.product_name}
            </h4>
            <p className="text-xs text-amber-400/90 mt-0.5">
              Verified Crystal Purchase • ₹{Number(productItem.price || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Energetic Resonance & Rating
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const isFilled = (hoverRating || rating) >= starIndex;
                  return (
                    <button
                      key={starIndex}
                      type="button"
                      onClick={() => setRating(starIndex)}
                      onMouseEnter={() => setHoverRating(starIndex)}
                      className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-zinc-600 fill-transparent'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-amber-300/80 mt-1.5 font-medium">
              {getRatingLabel(hoverRating || rating)}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="modal-review-comment" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Your Review
              </label>
              <span className="text-[11px] text-zinc-500">{comment.length} characters</span>
            </div>
            <textarea
              id="modal-review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the crystal's craftsmanship, frequency, aesthetics, packaging, or energetic presence..."
              className="w-full bg-zinc-900/80 border border-zinc-700/70 focus:border-amber-400 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Add Photo of Your Crystal <span className="text-zinc-500 font-normal">(Optional, max 5MB)</span>
            </label>

            {previewUrl ? (
              <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-amber-500/40 bg-zinc-900">
                <img
                  src={previewUrl}
                  alt="Review upload preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isSubmitting}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  id="modal-review-image-input"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="modal-review-image-input"
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-700 hover:border-amber-400/60 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 cursor-pointer transition-colors group"
                >
                  <Upload className="w-6 h-6 text-zinc-400 group-hover:text-amber-400 mb-1 transition-colors" />
                  <span className="text-xs text-zinc-300 font-medium">Click to upload crystal photo</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">JPEG, PNG, or WEBP up to 5MB</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing Review...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Submit Verified Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
