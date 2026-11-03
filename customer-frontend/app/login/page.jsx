'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuth';
import Floating3DSpheres from '@/components/Floating3DSpheres';
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams?.get('mode') === 'signup' ? 'register' : 'login';

  const { login, register, sendPasswordReset, user, isAuthenticated } = useAuthStore();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [dob, setDob] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to /account
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/account');
    }
  }, [isAuthenticated, user, router]);

  // Password strength calculation
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
    setValidationError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // 1. Forgot Password Mode
      if (mode === 'forgot') {
        const cleanEmail = email.trim();
        if (!cleanEmail) {
          setValidationError('Please enter your registered email address');
          setLoading(false);
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
          setValidationError('Please enter a valid email address');
          setLoading(false);
          return;
        }

        const res = await sendPasswordReset(cleanEmail);
        if (res?.success) {
          setSuccessMsg(res.message || "We've sent a password reset link to your email.");
        }
        setLoading(false);
        return;
      }

      // 2. Register Mode
      if (mode === 'register') {
        const cleanName = fullName.trim();
        const cleanPhone = phone.trim().replace(/\s+/g, '');
        const cleanEmail = email.trim().toLowerCase();
        const cleanPin = pincode.trim();
        const cleanDob = dob.trim();

        if (!cleanName) {
          setValidationError('Full Name is required');
          setLoading(false);
          return;
        }
        if (!cleanEmail) {
          setValidationError('Email Address is required');
          setLoading(false);
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
          setValidationError('Please enter a valid email address');
          setLoading(false);
          return;
        }
        if (cleanPhone && cleanPhone.length < 10) {
          setValidationError('Please enter a valid 10-digit mobile number');
          setLoading(false);
          return;
        }
        if (cleanPin && (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin))) {
          setValidationError('Please enter a valid 6-digit postal pincode');
          setLoading(false);
          return;
        }
        if (!password) {
          setValidationError('Password is required');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setValidationError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setValidationError('Passwords do not match');
          setLoading(false);
          return;
        }

        const res = await register({
          fullName: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          pincode: cleanPin,
          dob: cleanDob,
          password,
        });

        if (res?.success || res?.ok) {
          setSuccessMsg('Account created successfully! Welcome to the Sacred Sanctuary.');
          setTimeout(() => {
            router.push('/account');
          }, 1000);
        } else {
          setValidationError(res?.error || 'Registration failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      // 3. Login Mode
      if (mode === 'login') {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !password) {
          setValidationError('Please enter both your email address and password');
          setLoading(false);
          return;
        }

        const res = await login(cleanEmail, password);
        if (res?.success || res?.ok) {
          if (res?.isAdmin || cleanEmail === 'sumukcrystalz5@gmail.com') {
            setSuccessMsg('Welcome back, Founder Soumyaa Naveen! Opening Admin Sanctuary...');
            setTimeout(() => {
              window.location.href = 'http://localhost:3001';
            }, 1000);
          } else {
            setSuccessMsg(`Welcome back, ${res?.user?.name || 'Patron'}!`);
            setTimeout(() => {
              router.push('/account');
            }, 1000);
          }
        } else {
          setValidationError(res?.error || 'Invalid email or password. Please verify your credentials.');
        }
        setLoading(false);
      }
    } catch (err) {
      setValidationError(err.message || 'Authentication error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#29242D] relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans select-none">
      {/* ══════════════════════════════════════════════════════════
          1. FLOATING 3D SPHERES BACKGROUND (Interactive & Ethereal)
         ══════════════════════════════════════════════════════════ */}
      <Floating3DSpheres />

      {/* ══════════════════════════════════════════════════════════
          2. LUXURY GLASSMORPHIC LOGIN CARD
         ══════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Subtle decorative glow around the card */}
        <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-r from-[#EAE2F2] via-[#C8A65E]/20 to-[#EAE2F2] blur-xl opacity-70 pointer-events-none" />

        <div className="relative rounded-[32px] bg-white/85 backdrop-blur-2xl border border-[#EAE2F2] shadow-[0_20px_60px_rgba(41,36,45,0.06)] p-6 sm:p-8 space-y-6">
          
          {/* Brand Header with Sacred Gold Lotus Logo */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block group">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAE2F2] border border-[#EAE2F2] flex items-center justify-center text-[#C8A65E] shadow-sm group-hover:scale-105 transition-transform duration-300">
                <svg viewBox="0 0 100 100" className="w-9 h-9 fill-[#C8A65E]">
                  <path d="M50 20 C40 38 30 65 50 82 C70 65 60 38 50 20 Z" opacity="0.95" />
                  <path d="M50 35 C32 46 15 62 30 78 C42 78 48 60 50 35 Z" opacity="0.8" />
                  <path d="M50 35 C68 46 85 62 70 78 C58 78 52 60 50 35 Z" opacity="0.8" />
                  <path d="M50 50 C36 60 20 70 25 82 C38 82 45 70 50 50 Z" opacity="0.6" />
                  <path d="M50 50 C64 60 80 70 75 82 C62 82 55 70 50 50 Z" opacity="0.6" />
                </svg>
              </div>
            </Link>

            <div>
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#C8A65E] block">
                SUMUK CRYSTALZ 5
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#29242D] tracking-tight mt-1">
                {mode === 'login'
                  ? 'Sanctuary Access'
                  : mode === 'register'
                  ? 'Join the Sanctuary'
                  : 'Reset Key Access'}
              </h1>
              <p className="text-xs text-[#29242D]/60 mt-1 max-w-xs mx-auto">
                {mode === 'login'
                  ? 'Enter your patron credentials to access your consecrated crystal collection.'
                  : mode === 'register'
                  ? 'Create your dedicated patron account for consecrated orders and Vedic crystal attunements.'
                  : 'Provide your registered email to receive a secure recovery key.'}
              </p>
            </div>
          </div>

          {/* Tab Selector Pills: Sign In vs Create Account */}
          {mode !== 'forgot' && (
            <div className="p-1 rounded-full bg-[#F8F6F2] border border-[#EAE2F2] flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setValidationError('');
                  setSuccessMsg('');
                  setMode('login');
                }}
                className={`flex-1 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#79539B] text-white shadow-md shadow-[#79539B]/20'
                    : 'text-[#29242D]/70 hover:text-[#29242D]'
                }`}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => {
                  setValidationError('');
                  setSuccessMsg('');
                  setMode('register');
                }}
                className={`flex-1 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#79539B] text-white shadow-md shadow-[#79539B]/20'
                    : 'text-[#29242D]/70 hover:text-[#29242D]'
                }`}
              >
                CREATE ACCOUNT
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              3. ROUNDED INPUT FORM
             ══════════════════════════════════════════════════════════ */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* REGISTER EXTRA FIELDS */}
            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#29242D]/80 pl-3">
                    Full Name <span className="text-[#79539B]">*</span>
                  </label>
                  <div className="relative group">
                    <User className="w-4 h-4 text-[#29242D]/40 group-focus-within:text-[#79539B] absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Swayam A H"
                      className="w-full bg-white/90 border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full pl-11 pr-4 py-3 text-sm text-[#29242D] placeholder-[#29242D]/40 focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Phone & Pincode Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-3">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone className="w-4 h-4 text-[#29242D]/40 group-focus-within:text-[#79539B] absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 91117 16355"
                        className="w-full bg-white/90 border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full pl-11 pr-4 py-3 text-sm text-[#29242D] placeholder-[#29242D]/40 focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#29242D]/80 pl-3">
                      Postal Pincode
                    </label>
                    <div className="relative group">
                      <MapPin className="w-4 h-4 text-[#29242D]/40 group-focus-within:text-[#79539B] absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="411021"
                        className="w-full bg-white/90 border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full pl-11 pr-4 py-3 text-sm text-[#29242D] placeholder-[#29242D]/40 focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Date of Birth for Vedic Attunement */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#29242D]/80 pl-3">
                    Date of Birth <span className="text-[10px] text-[#C8A65E] font-normal">(for planetary attunements)</span>
                  </label>
                  <div className="relative group">
                    <Calendar className="w-4 h-4 text-[#29242D]/40 group-focus-within:text-[#79539B] absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-white/90 border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full pl-11 pr-4 py-3 text-sm text-[#29242D] focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#29242D]/80 pl-3">
                Email Address <span className="text-[#79539B]">*</span>
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-[#29242D]/40 group-focus-within:text-[#79539B] absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@sumukcrystalz5.com"
                  className="w-full bg-white/90 border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full pl-11 pr-4 py-3 text-sm text-[#29242D] placeholder-[#29242D]/40 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password (for Login and Register) */}
            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between pl-3 pr-1">
                  <label className="text-xs font-semibold text-[#29242D]/80">
                    Password <span className="text-[#79539B]">*</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setValidationError('');
                        setSuccessMsg('');
                        setMode('forgot');
                      }}
                      className="text-[11px] text-[#79539B] hover:text-[#684587] font-semibold transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                <div className="relative group">
                  <Lock className="w-4 h-4 text-[#29242D]/40 group-focus-within:text-[#79539B] absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your confidential password"
                    className="w-full bg-white/90 border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full pl-11 pr-11 py-3 text-sm text-[#29242D] placeholder-[#29242D]/40 focus:outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#29242D]/40 hover:text-[#29242D] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter for Register Mode */}
                {mode === 'register' && password && (
                  <div className="px-3 pt-1 space-y-1">
                    <div className="h-1.5 w-full bg-[#EAE2F2] rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength.score >= 1 ? strength.color.split(' ')[0] : 'bg-transparent'
                        }`}
                        style={{ width: '33.3%' }}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength.score >= 2 ? strength.color.split(' ')[0] : 'bg-transparent'
                        }`}
                        style={{ width: '33.3%' }}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength.score >= 3 ? strength.color.split(' ')[0] : 'bg-transparent'
                        }`}
                        style={{ width: '33.4%' }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#29242D]/60">Strength</span>
                      <span className={`font-semibold ${strength.color.split(' ')[1]}`}>
                        {strength.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password for Register */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#29242D]/80 pl-3">
                  Confirm Password <span className="text-[#79539B]">*</span>
                </label>
                <div className="relative group">
                  <KeyRound className="w-4 h-4 text-[#29242D]/40 group-focus-within:text-[#79539B] absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className="w-full bg-white/90 border border-[#EAE2F2] focus:border-[#79539B] focus:ring-2 focus:ring-[#79539B]/20 rounded-full pl-11 pr-11 py-3 text-sm text-[#29242D] placeholder-[#29242D]/40 focus:outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#29242D]/40 hover:text-[#29242D] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#79539B] to-[#684587] hover:brightness-105 active:scale-98 text-white font-semibold text-xs tracking-wider uppercase shadow-md shadow-[#79539B]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? 'UNLOCK SANCTUARY'
                      : mode === 'register'
                      ? 'CREATE SACRED ACCOUNT'
                      : 'SEND RECOVERY LINK'}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switch Footers */}
          <div className="pt-2 text-center text-xs text-[#29242D]/70 space-y-2">
            {mode === 'forgot' ? (
              <button
                type="button"
                onClick={() => {
                  setValidationError('');
                  setSuccessMsg('');
                  setMode('login');
                }}
                className="text-[#79539B] hover:text-[#684587] font-semibold transition-colors cursor-pointer"
              >
                &larr; Return to Sign In
              </button>
            ) : mode === 'login' ? (
              <p>
                New to Sumuk Crystalz 5?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setValidationError('');
                    setSuccessMsg('');
                    setMode('register');
                  }}
                  className="text-[#79539B] hover:text-[#684587] font-bold underline transition-colors cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setValidationError('');
                    setSuccessMsg('');
                    setMode('login');
                  }}
                  className="text-[#79539B] hover:text-[#684587] font-bold underline transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}

            {/* Return to Storefront link */}
            <div className="pt-2 border-t border-[#EAE2F2]">
              <Link
                href="/"
                className="text-[11px] text-[#29242D]/50 hover:text-[#29242D] transition-colors"
              >
                &larr; Back to Crystal Sanctuary Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center text-[#79539B] font-sans">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#79539B] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold tracking-wider uppercase">Loading Sanctuary Access...</span>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
