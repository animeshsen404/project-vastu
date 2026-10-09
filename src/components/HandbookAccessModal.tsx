import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Lock,
  Mail,
  Phone,
  User,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Handbook } from '../types';

interface HandbookAccessModalProps {
  isOpen: boolean;
  handbook: Handbook | null;
  onClose: () => void;
  onSuccess: (accessData: {
    token: string;
    streamUrl: string;
    handbook: {
      id: string;
      title: string;
      subtitle?: string;
      pages: number;
      targetAudience: string;
    };
  }) => void;
}

export const HandbookAccessModal: React.FC<HandbookAccessModalProps> = ({
  isOpen,
  handbook,
  onClose,
  onSuccess,
}) => {
  const { isLight } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen || !handbook) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Strict Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 2. Strict Mobile validation (minimum 10 digits)
    const cleanPhone = mobileNumber.trim();
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      setFormError('Please enter your mobile contact number.');
      return;
    }
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setFormError('Please enter a valid mobile number with at least 10 digits.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/handbooks/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handbookId: handbook.id,
          fullName: fullName.trim(),
          email: cleanEmail,
          mobileNumber: cleanPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authorize handbook access.');
      }

      // Close access modal and immediately trigger reader modal
      onSuccess({
        token: data.token,
        streamUrl: data.streamUrl,
        handbook: data.handbook,
      });
    } catch (err: any) {
      console.error('Error submitting handbook access request:', err);
      setFormError(err.message || 'An error occurred while granting access. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl border-2 transition-all overflow-hidden ${
          isLight
            ? 'bg-[#FFFDF9] border-[#D4A72C]/60 text-[var(--color-text-heading)]'
            : 'bg-[#1E110D] border-[#D4A72C]/60 text-[#FFF7ED]'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="handbook-modal-title"
      >
        {/* Decorative Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-[#D4A72C] via-[#E88A16] to-[#B94E2C]" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-colors cursor-pointer ${
            isLight
              ? 'hover:bg-amber-100/80 text-amber-900/70 hover:text-amber-900'
              : 'hover:bg-white/10 text-amber-200/70 hover:text-white'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-[#6B1F1F] text-[#FFF7ED]">
                <BookOpen className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>Authorized Monograph</span>
              </span>
              <span className="text-xs font-serif font-bold text-[#E88A16] flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Protected Access</span>
              </span>
            </div>

            <h3
              id="handbook-modal-title"
              className="font-['Cinzel_Decorative'] text-xl sm:text-2xl font-black leading-tight pt-1"
            >
              {handbook.title}
            </h3>

            {handbook.subtitle && (
              <p
                className={`font-['Marcellus'] text-xs sm:text-sm italic ${
                  isLight ? 'text-[#9A3412]' : 'text-[#FDE68A]'
                }`}
              >
                {handbook.subtitle}
              </p>
            )}
          </div>

          {/* Handbook Meta Badges */}
          <div
            className={`p-3.5 rounded-xl border text-xs font-serif flex flex-wrap items-center justify-between gap-2 ${
              isLight
                ? 'bg-amber-50/80 border-amber-200/80 text-amber-950'
                : 'bg-black/30 border-[#D4A72C]/30 text-[#E8D3A8]'
            }`}
          >
            <div>
              <span className="opacity-70 block text-[10px] uppercase tracking-wider">Target Domain</span>
              <span className="font-bold">{handbook.targetAudience}</span>
            </div>
            <div>
              <span className="opacity-70 block text-[10px] uppercase tracking-wider">Volume</span>
              <span className="font-bold">{handbook.pages} Folio Pages (Full PDF)</span>
            </div>
            <div className="flex items-center gap-1 text-[#22C55E]">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[11px] font-bold">Peer Reviewed</span>
            </div>
          </div>

          {/* Prompt Information */}
          <p
            className={`font-['Marcellus'] text-xs sm:text-sm leading-relaxed ${
              isLight ? 'text-[var(--color-text-body)]' : 'text-[#E8D3A8]'
            }`}
          >
            To uphold traditional shastric reverence and provide direct consultation follow-up, please share your contact details. Access will be unlocked immediately in an embedded viewer.
          </p>

          {/* Error Notice */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Access Request Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Optional) */}
            <div className="space-y-1">
              <label
                htmlFor="hb-full-name"
                className={`block text-xs font-serif font-bold uppercase tracking-wider ${
                  isLight ? 'text-stone-800' : 'text-stone-300'
                }`}
              >
                Full Name <span className="text-[10px] font-normal lowercase opacity-70">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="hb-full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ar. Rajesh Sharma"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-['Marcellus'] border transition-all focus:outline-none focus:ring-2 focus:ring-[#D4A72C] ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400'
                      : 'bg-stone-900/80 border-stone-700 text-stone-100 placeholder:text-stone-500'
                  }`}
                />
              </div>
            </div>

            {/* Email Address (Strictly Validated) */}
            <div className="space-y-1">
              <label
                htmlFor="hb-email"
                className={`block text-xs font-serif font-bold uppercase tracking-wider ${
                  isLight ? 'text-stone-800' : 'text-stone-300'
                }`}
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="hb-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. architect@studio.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-['Marcellus'] border transition-all focus:outline-none focus:ring-2 focus:ring-[#D4A72C] ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400'
                      : 'bg-stone-900/80 border-stone-700 text-stone-100 placeholder:text-stone-500'
                  }`}
                />
              </div>
            </div>

            {/* Mobile Number (Strictly Validated) */}
            <div className="space-y-1">
              <label
                htmlFor="hb-mobile"
                className={`block text-xs font-serif font-bold uppercase tracking-wider ${
                  isLight ? 'text-stone-800' : 'text-stone-300'
                }`}
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="hb-mobile"
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="+91 98200 12345"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-['Marcellus'] border transition-all focus:outline-none focus:ring-2 focus:ring-[#D4A72C] ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400'
                      : 'bg-stone-900/80 border-stone-700 text-stone-100 placeholder:text-stone-500'
                  }`}
                />
              </div>
            </div>

            {/* Privacy Promise */}
            <div className="flex items-center gap-2 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
              <p className="text-[11px] font-serif opacity-75 leading-tight">
                Your contact details are encrypted and stored confidentially in our shastric database. No third-party sharing.
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-6 rounded-xl font-serif font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSubmitting
                    ? 'opacity-70 cursor-not-allowed'
                    : isLight
                    ? 'bg-[#6B1F1F] text-[#FFF7ED] hover:bg-[#8B2B2B] shadow-amber-900/20 hover:scale-[1.01]'
                    : 'bg-gradient-to-r from-[#E88A16] to-[#B94E2C] text-[#2D1B14] hover:brightness-110 shadow-black/40 hover:scale-[1.01]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validating & Authorizing...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock & Read Handbook</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
