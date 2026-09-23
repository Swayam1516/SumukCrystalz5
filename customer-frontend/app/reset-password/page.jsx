'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/useAuth';
import { supabase } from '../../lib/supabase';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  KeyRound,
} from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const { updatePassword, openAuthModal, loading: authLoading } = useAuthStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500 text-rose-600' };
    if (score === 2 || score === 3) return { score: 2, text: 'Medium', color: 'bg-amber-500 text-amber-600' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500 text-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await updatePassword(password, tokenParam, emailParam);
      if (res?.success || res?.ok) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res?.error || 'Failed to update password. Your reset link may have expired.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while updating your password.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueToLogin = () => {
    openAuthModal('login');
    router.push('/');
  };

  return (
    <div className="max-w-md w-full space-y-6 relative z-10">
      {/* SUCCESS SCREEN */}
      {isSuccess ? (
        <div className="p-8 sm:p-10 rounded-[32px] bg-white/95 backdrop-blur-xl border border-purple-100 shadow-[0_20px_60px_-15px_rgba(76,29,149,0.18)] text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold text-emerald-600 block mb-1">
              AUTHENTICATION UPDATED
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#110D23]">
              Password Updated
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5C82] mt-2 leading-relaxed">
              Your password has been changed successfully. You can now log in with your new credentials.
            </p>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleContinueToLogin}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1C132B] via-[#2D1B4E] to-[#1C132B] hover:from-[#2D1B4E] hover:to-[#3D256B] text-white font-extrabold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-lg shadow-purple-950/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      ) : (
        /* FORM SCREEN */
        <div className="p-8 sm:p-10 rounded-[32px] bg-white/95 backdrop-blur-xl border border-purple-100 shadow-[0_20px_60px_-15px_rgba(76,29,149,0.18)] space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-100/70 border border-purple-200 flex items-center justify-center text-purple-700 mx-auto shadow-xs">
              <KeyRound className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-purple-50 border border-purple-200/80 text-[10px] font-mono font-bold text-purple-800 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>SECURE PASSWORD RECOVERY</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#110D23]">
              Create New Password
            </h1>
            <p className="text-xs text-[#6B5C82] leading-relaxed">
              {emailParam ? `Resetting password for: ${emailParam}` : 'Please enter a new password for your Sumuk Crystalz account.'}
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                  New Password *
                </label>
                {password && (
                  <span className={`text-[10px] font-mono font-bold ${strength.color.split(' ')[1]}`}>
                    {strength.text}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter new password (min. 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing || authLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1C132B] via-[#2D1B4E] to-[#1C132B] hover:from-[#2D1B4E] hover:to-[#3D256B] text-white font-extrabold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-lg shadow-purple-950/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing || authLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </span>
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Back to Store */}
          <div className="pt-2 border-t border-purple-100 text-center text-xs text-[#6B5C82]">
            <Link
              href="/"
              className="font-bold text-purple-800 hover:text-purple-950 transition"
            >
              ← Return to Storefront
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-[#FAF7FD] via-[#F4EEFB] to-[#FAF8FC] text-[#1E1B4B]">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-300/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-[110px] pointer-events-none" />

      <Suspense fallback={
        <div className="p-8 rounded-3xl bg-white/90 border border-purple-100 shadow-xl text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#6B5C82] mt-3">Loading Secure Password Recovery...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
