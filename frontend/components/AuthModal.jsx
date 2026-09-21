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
  Crown,
  Sparkles,
  LogOut,
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
    authError,
    loading,
    user,
    logout,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    if (authModalMode === 'register') {
      if (!fullName.trim()) {
        setValidationError('Please enter your full name');
        return;
      }
      if (!phone.trim()) {
        setValidationError('Please enter your phone number');
        return;
      }
      if (!email.trim()) {
        setValidationError('Please enter your email address');
        return;
      }
      if (!pincode.trim()) {
        setValidationError('Please enter your pincode');
        return;
      }
      if (!dob.trim()) {
        setValidationError('Please enter your date of birth (DD/MM/YYYY)');
        return;
      }
      if (!password) {
        setValidationError('Please create a password');
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
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        pincode: pincode.trim(),
        dob: dob.trim(),
        password,
      });

      if (res?.success || res?.ok) {
        setSuccessMsg('Account registered successfully! Welcome to the Sanctuary.');
        setTimeout(() => {
          handleClose();
        }, 1200);
      }
    } else {
      // Login mode
      if (!email.trim() || !password) {
        setValidationError('Please enter both email and password');
        return;
      }

      const res = await login(email.trim(), password);
      if (res?.success || res?.ok) {
        const cleanEmail = email.trim().toLowerCase();
        if (res?.isAdmin || cleanEmail === 'sumukcrystalz5@gmail.com') {
          setSuccessMsg('Welcome back, Founder Soumyaa Naveen! Opening Admin Dashboard...');
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className={`relative w-full ${
          isRegister ? 'max-w-4xl' : 'max-w-3xl'
        } bg-white rounded-3xl sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-slate-100 overflow-hidden flex flex-col md:flex-row transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* LEFT COLUMN: Form Section */}
        <div
          className={`w-full ${
            isRegister ? 'md:w-[58%] p-6 sm:p-9' : 'md:w-[54%] p-6 sm:p-10'
          } flex flex-col justify-center bg-white z-10`}
        >
          {/* Mode Switching Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-5 border border-slate-200/80">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                !isRegister
                  ? 'bg-[#1c192b] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>SIGN IN</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                isRegister
                  ? 'bg-[#641b94] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#641b94]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CREATE ACCOUNT</span>
            </button>
          </div>

          {/* Header Title */}
          <div className="mb-4 sm:mb-5">
            {isRegister ? (
              <div>
                <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#161424] uppercase">
                  Register as <span className="text-[#641b94]">New Patron</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Join the Sumuk Crystalz sanctuary to unlock consecrated specimens &amp; order tracking
                </p>
                <div className="mt-2 h-[3px] w-36 bg-gradient-to-r from-[#641b94] via-[#8b2fc9] to-transparent rounded-full" />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#161424] uppercase">
                  SIGN <span className="text-[#641b94]">IN</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access your consecrated energy orders and private sanctuary account
                </p>
                <div className="mt-2 h-[3px] w-28 bg-gradient-to-r from-[#641b94] via-[#8b2fc9] to-transparent rounded-full" />
              </div>
            )}
          </div>

          {/* Currently Logged In Banner with Quick Sign Out */}
          {user && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between text-xs font-mono">
              <div className="truncate pr-2">
                <p className="font-bold text-slate-800 truncate">Signed in: {user.name || user.email}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setSuccessMsg('Signed out of sanctuary session.');
                  setTimeout(() => setSuccessMsg(''), 2000);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[11px] flex items-center gap-1.5 transition flex-shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Feedback Alerts */}
          {(validationError || authError) && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{validationError || authError}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
            {isRegister ? (
              /* ================= REGISTER FORM ================= */
              <>
                {/* Full Name */}
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name*"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#641b94] focus:ring-2 focus:ring-[#641b94]/15 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none transition bg-white"
                  />
                </div>

                {/* Phone Number */}
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number*"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#641b94] focus:ring-2 focus:ring-[#641b94]/15 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none transition bg-white"
                  />
                </div>

                {/* Email Address */}
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                  <input
                    type="email"
                    required
                    placeholder="Email Address*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#641b94] focus:ring-2 focus:ring-[#641b94]/15 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none transition bg-white"
                  />
                </div>

                {/* 2-Column Row: Pincode & Date of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                    <input
                      type="text"
                      required
                      placeholder="Pincode*"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#641b94] focus:ring-2 focus:ring-[#641b94]/15 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none transition bg-white"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                    <input
                      type="text"
                      required
                      placeholder="Date of Birth (DD/MM/YYYY)*"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#641b94] focus:ring-2 focus:ring-[#641b94]/15 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none transition bg-white"
                    />
                  </div>
                </div>

                {/* 2-Column Row: Create Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Create Password*"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#641b94] focus:ring-2 focus:ring-[#641b94]/15 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none transition bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 stroke-[1.8]" />
                      ) : (
                        <Eye className="w-4 h-4 stroke-[1.8]" />
                      )}
                    </button>
                  </div>

                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm Password*"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#641b94] focus:ring-2 focus:ring-[#641b94]/15 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none transition bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 stroke-[1.8]" />
                      ) : (
                        <Eye className="w-4 h-4 stroke-[1.8]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-6 rounded-xl bg-[#1c192b] hover:bg-[#28243c] active:scale-[0.99] text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </>
            ) : (
              /* ================= SIGN IN FORM ================= */
              <>
                {/* Email Address */}
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                  <input
                    type="email"
                    required
                    placeholder="Email Address*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#641b94] focus:ring-2 focus:ring-[#641b94]/15 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none transition bg-white"
                  />
                </div>

                {/* Password */}
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password*"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:border-[#641b94] focus:ring-2 focus:ring-[#641b94]/15 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none transition bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-6 rounded-xl bg-[#1c192b] hover:bg-[#28243c] active:scale-[0.99] text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </>
            )}
          </form>

          {/* Footer Switching Links */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="text-[#641b94] font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="text-[#641b94] font-bold hover:underline"
                >
                  Register as new user
                </button>
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Crystal Artwork Section */}
        <div
          className={`w-full ${
            isRegister ? 'md:w-[42%]' : 'md:w-[46%]'
          } relative hidden md:flex flex-col justify-end bg-gradient-to-br from-purple-50/60 via-slate-50/40 to-purple-100/40 overflow-hidden border-l border-slate-100 min-h-[360px]`}
        >
          {/* Ambient Glows */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-300/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />

          {/* Decorative Sparkle Accents */}
          <div className="absolute top-8 right-10 text-purple-400/60 animate-pulse pointer-events-none">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute top-20 right-28 text-amber-400/60 animate-pulse delay-300 pointer-events-none">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Crystal Cluster Image */}
          <div className="relative w-full h-full flex items-end justify-center pt-8">
            <Image
              src="/auth-crystal.jpg"
              alt="Consecrated Amethyst & Quartz Crystal Sanctuary"
              width={600}
              height={600}
              priority
              className="w-full h-auto object-cover object-bottom transition-transform duration-700 hover:scale-105 select-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
