import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Maximize2,
  Minimize2,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HandbookReaderModalProps {
  isOpen: boolean;
  streamUrl: string;
  handbook: {
    id: string;
    title: string;
    subtitle?: string;
    pages: number;
    targetAudience?: string;
  } | null;
  onClose: () => void;
}

export const HandbookReaderModal: React.FC<HandbookReaderModalProps> = ({
  isOpen,
  streamUrl,
  handbook,
  onClose,
}) => {
  const { isLight } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset loading state when streamUrl changes
  useEffect(() => {
    if (isOpen) {
      setIframeLoaded(false);
      setLoadError(false);
    }
  }, [isOpen, streamUrl]);

  if (!isOpen || !handbook) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn transition-all ${
        isFullscreen ? 'p-0' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Reader for ${handbook.title}`}
    >
      <div
        className={`flex flex-col w-full h-full rounded-2xl shadow-2xl border transition-all overflow-hidden ${
          isFullscreen ? 'rounded-none border-0 max-w-none max-h-none h-screen' : 'max-w-6xl max-h-[94vh]'
        } ${
          isLight
            ? 'bg-[#FFFDF9] border-[#D4A72C]/50 text-stone-900'
            : 'bg-[#180E0A] border-[#D4A72C]/50 text-[#FFF7ED]'
        }`}
      >
        {/* Top Control Bar */}
        <div
          className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0 ${
            isLight
              ? 'bg-[#FDFBF7] border-amber-200/80 text-stone-900'
              : 'bg-[#22140E] border-[#D4A72C]/30 text-[#FFF7ED]'
          }`}
        >
          {/* Handbook Title & Folio Details */}
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 rounded-xl bg-[#6B1F1F] text-[#FFF7ED] shrink-0">
              <BookOpen className="w-5 h-5 text-[#D4A72C]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-serif uppercase tracking-widest px-2 py-0.5 rounded-full font-bold bg-[#E88A16]/20 text-[#E88A16]">
                  Authorized Reader
                </span>
                <span className="text-xs font-serif opacity-75 hidden sm:inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Confidential Verified Access</span>
                </span>
              </div>
              <h2 className="font-['Cinzel',serif] text-sm sm:text-base font-bold truncate">
                {handbook.title}
              </h2>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Open dedicated view / direct window */}
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-xl text-xs font-serif font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                isLight
                  ? 'hover:bg-amber-100 text-stone-700 hover:text-stone-900'
                  : 'hover:bg-white/10 text-stone-300 hover:text-white'
              }`}
              title="Open full document in browser reader"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Full Tab</span>
            </a>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-xl text-xs font-serif transition-colors cursor-pointer ${
                isLight
                  ? 'hover:bg-amber-100 text-stone-700 hover:text-stone-900'
                  : 'hover:bg-white/10 text-stone-300 hover:text-white'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer ml-1"
              title="Close reader (Esc)"
              aria-label="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Canvas Area */}
        <div className="relative flex-1 w-full h-full bg-[#1A1A1A] overflow-hidden">
          {/* Loading indicator */}
          {!iframeLoaded && !loadError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-stone-300 bg-[#1A1A1A]">
              <div className="w-12 h-12 rounded-full border-4 border-amber-600 border-t-amber-300 animate-spin mb-4" />
              <p className="font-serif text-sm font-bold tracking-wide">
                Streaming Authorized Vastu Handbook...
              </p>
              <p className="text-xs text-stone-400 font-serif mt-1">
                Decrypting high-resolution folio pages
              </p>
            </div>
          )}

          {/* Error / Mobile fallback notice */}
          {loadError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-[#1A1A1A] text-stone-200">
              <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
              <h4 className="font-serif text-base font-bold mb-1">
                Unable to embed PDF viewer directly in browser frame
              </h4>
              <p className="text-xs text-stone-400 max-w-md font-serif mb-4">
                Your browser or device security policy may restrict embedded PDF streaming. Click below to view the authorized PDF in a dedicated reader tab.
              </p>
              <a
                href={streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#E88A16] hover:bg-[#D97706] text-[#2D1B14] font-serif font-bold text-xs inline-flex items-center gap-2 shadow-lg"
              >
                <FileText className="w-4 h-4" />
                <span>Open Authorized PDF Stream</span>
              </a>
            </div>
          )}

          {/* Embedded PDF iframe */}
          <iframe
            src={`${streamUrl}#toolbar=1&navpanes=1&statusbar=1&view=FitH`}
            className="w-full h-full border-0"
            title={`Authorized Handbook: ${handbook.title}`}
            onLoad={() => setIframeLoaded(true)}
            onError={() => {
              setIframeLoaded(true);
              setLoadError(true);
            }}
          />
        </div>

        {/* Reader Bottom Bar */}
        <div
          className={`flex items-center justify-between px-4 py-2 text-[11px] font-serif border-t shrink-0 ${
            isLight
              ? 'bg-[#FBF8F2] border-amber-200/60 text-stone-600'
              : 'bg-[#180E0A] border-[#D4A72C]/20 text-stone-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <span>{handbook.pages} Folio Pages Total</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:inline">Protected Streaming DRM</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline opacity-75">
              Press <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">ESC</kbd> to exit reader
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-stone-500/10 hover:bg-stone-500/20 transition-colors font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
