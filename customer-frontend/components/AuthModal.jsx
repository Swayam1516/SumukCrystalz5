'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuth';
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

export default function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    sendPasswordReset,
    authError,
    loading,
    user,
  } = useAuthStore();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [dob, setDob] = useState('');

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhone('');
    setPincode('');
    setDob('');
    setValidationError('');
    setSuccessMsg('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSwitchMode = (mode) => {
    setValidationError('');
    setSuccessMsg('');
    setAuthModalMode(mode);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

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

    // Mode 1: Forgot Password
    if (authModalMode === 'forgot-password') {
      const cleanEmail = email.trim();
      if (!cleanEmail) {
        setValidationError('Please enter your registered email address');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setValidationError('Please enter a valid email address (e.g. name@domain.com)');
        return;
      }

      const res = await sendPasswordReset(cleanEmail);
      if (res?.success) {
        setSuccessMsg(res.message || "If an account exists, we've sent a secure password reset link to your email.");
      }
      return;
    }

    // Mode 2: Registration (7 Fields)
    if (authModalMode === 'register') {
      const cleanName = fullName.trim();
      const cleanPhone = phone.trim().replace(/\s+/g, '');
      const cleanEmail = email.trim().toLowerCase();
      const cleanPin = pincode.trim();
      const cleanDob = dob.trim();

      if (!cleanName) {
        setValidationError('Full Name is required');
        return;
      }
      if (!cleanEmail) {
        setValidationError('Email Address is required');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setValidationError('Please enter a valid email address (e.g. name@domain.com)');
        return;
      }
      if (!cleanPhone) {
        setValidationError('Contact Number is required');
        return;
      }
      const phoneDigits = cleanPhone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        setValidationError('Please enter a valid 10-digit mobile number');
        return;
      }
      if (!cleanDob) {
        setValidationError('Date of Birth is required');
        return;
      }
      if (!cleanPin) {
        setValidationError('Pincode is required');
        return;
      }
      if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
        setValidationError('Please enter a valid 6-digit postal pincode');
        return;
      }
      if (!password) {
        setValidationError('Password is required');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match. Please verify your confirm password.');
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
        if (res.sessionActive) {
          setSuccessMsg('Account created successfully! Welcome to the Sacred Sanctuary.');
          setTimeout(() => {
            handleClose();
          }, 1200);
        } else {
          setSuccessMsg(res.message || 'Account registered! Please check your email to confirm or proceed to sign in.');
          setTimeout(() => {
            handleSwitchMode('login');
          }, 2200);
        }
      }
      return;
    }

    // Mode 3: Login
    if (authModalMode === 'login') {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !password) {
        setValidationError('Please enter both your email address and password');
        return;
      }

      const res = await login(cleanEmail, password);
      if (res?.success || res?.ok) {
        if (res?.isAdmin || cleanEmail === 'sumukcrystalz5@gmail.com') {
          setSuccessMsg('Welcome back, Founder Soumyaa Naveen! Opening Admin Sanctuary...');
          setTimeout(() => {
            handleClose();
            router.push('/admin');
          }, 1000);
        } else {
          setSuccessMsg(`Welcome back, ${res?.user?.name || 'Patron'}!`);
          setTimeout(() => {
            handleClose();
          }, 1200);
        }
      }
    }
  };

  const isRegister = authModalMode === 'register';
  const isForgot = authModalMode === 'forgot-password';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className={`relative w-full my-auto ${
          isRegister ? 'max-w-4xl' : isForgot ? 'max-w-md' : 'max-w-3xl'
        } bg-white rounded-3xl sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(76,29,149,0.3)] border border-purple-100 overflow-hidden flex flex-col ${
          !isForgot ? 'md:flex-row' : ''
        } transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-purple-50 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* LEFT COLUMN: Form Section */}
        <div
          className={`w-full ${
            !isForgot
              ? isRegister
                ? 'md:w-[58%] p-6 sm:p-9'
                : 'md:w-[54%] p-6 sm:p-10'
              : 'p-7 sm:p-9'
          } flex flex-col justify-center bg-white z-10`}
        >
          {/* Mode Switching Tabs for Login / Register */}
          {!isForgot && (
            <div className="flex items-center p-1 bg-purple-50/80 rounded-2xl mb-5 border border-purple-100">
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !isRegister
                    ? 'bg-[#1C132B] text-white shadow-md'
                    : 'text-purple-900 hover:text-purple-950'
                }`}
              >
                <span>SIGN IN</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('register')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isRegister
                    ? 'bg-[#1C132B] text-white shadow-md'
                    : 'text-purple-900 hover:text-purple-950'
                }`}
              >
                <span>REGISTER</span>
              </button>
            </div>
          )}

          {/* Title and Subtitle */}
          <div className="mb-5">
            {isForgot ? (
              <>
                <div className="w-10 h-10 rounded-2xl bg-purple-100/70 border border-purple-200 flex items-center justify-center text-purple-700 mb-3 shadow-xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1C132B]">
                  Reset Your Password
                </h2>
                <p className="text-xs text-[#6B5C82] mt-1">
                  Enter your registered email address. We&apos;ll send a secure password reset link.
                </p>
              </>
            ) : isRegister ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1C132B]">
                  Patron Registration
                </h2>
                <p className="text-xs text-[#6B5C82] mt-1">
                  Create your sacred collector account for consecrated provenance &amp; insured courier tracking.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1C132B]">
                  Patron Sign In
                </h2>
                <p className="text-xs text-[#6B5C82] mt-1">
                  Access your consecrated crystals, order provenance, and saved energy bands.
                </p>
              </>
            )}
          </div>

          {/* Validation and Server Errors */}
          {(validationError || authError) && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">{validationError || authError}</div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <div className="leading-snug">{successMsg}</div>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 1. FORGOT PASSWORD MODE */}
            {isForgot && (
              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                  />
                </div>
                <p className="text-[10px] text-slate-500 italic pt-1">
                  Didn&apos;t receive it? Check your Spam or Promotions folder.
                </p>
              </div>
            )}

            {/* 2. REGISTRATION MODE (7 Required Fields) */}
            {isRegister && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shresht A H"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                    <input
                      type="email"
                      required
                      placeholder="patron@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Contact Number (Phone) */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs cursor-pointer"
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                    Pincode *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 411001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-purple-200 text-xs font-mono font-bold text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                      Password *
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
                      placeholder="Create secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SIGN IN MODE */}
            {!isRegister && !isForgot && (
              <div className="space-y-3.5">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                    <input
                      type="email"
                      required
                      placeholder="patron@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10.5px] font-mono font-bold tracking-wider uppercase text-[#1C132B]">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('forgot-password')}
                      className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 transition cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-700" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your registered password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-purple-50/40 border border-purple-200 text-xs text-[#1C132B] placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#1C132B] via-[#2D1B4E] to-[#1C132B] hover:from-[#2D1B4E] hover:to-[#3D256B] text-white font-extrabold text-xs uppercase tracking-[0.16em] shadow-lg shadow-purple-950/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying with Supabase...</span>
                  </span>
                ) : (
                  <>
                    <span>
                      {isForgot
                        ? 'Send Reset Link'
                        : isRegister
                        ? 'Create Sanctuary Account'
                        : 'Sign In to Sanctuary'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Mode Switchers */}
          <div className="mt-5 pt-4 border-t border-purple-100 text-center text-xs text-[#6B5C82]">
            {isForgot ? (
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="font-bold text-purple-800 hover:text-purple-950 transition cursor-pointer"
              >
                ← Back to Sign In
              </button>
            ) : isRegister ? (
              <p>
                Already have a patron account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="font-bold text-purple-800 hover:text-purple-950 underline transition cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to Sumuk Crystalz?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="font-bold text-purple-800 hover:text-purple-950 underline transition cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Luxury Art Visual (for Login / Register) */}
        {!isForgot && (
          <div
            className={`w-full ${
              isRegister ? 'md:w-[42%]' : 'md:w-[46%]'
            } relative bg-gradient-to-br from-[#1C132B] via-[#2A1647] to-[#120B20] text-white p-7 sm:p-9 flex flex-col justify-between overflow-hidden`}
          >
            {/* Ambient Purple Glow */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Background Crystal Image */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
              <Image
                src="/images/crystal-sanctuary-bg.jpg"
                alt="Sumuk Crystalz Sanctuary"
                fill
                className="object-cover"
              />
            </div>

            {/* Top Badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-widest text-purple-200 uppercase font-bold">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>SACRED PATRON SANCTUARY</span>
              </div>
            </div>

            {/* Middle Quote */}
            <div className="relative z-10 py-8 space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-white">
                &ldquo;Pure crystals for a brighter, consecrated tomorrow.&rdquo;
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed font-sans">
                Each specimen is authenticated, vibrationally consecrated, and protected with insured door-to-door transit.
              </p>
            </div>

            {/* Bottom Trust Row */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-purple-200/90 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Secure Cloud Auth</span>
              </span>
              <span>•</span>
              <span>Genuine Crystals</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
