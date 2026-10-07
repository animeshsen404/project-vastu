import React from 'react';
import { VastuCompassWidget } from './VastuCompassWidget';
import { FolioReveal } from './FolioReveal';
import { Compass, Sparkles, HelpCircle, CheckCircle2, ShieldCheck, PhoneCall, BookOpen, ArrowRight } from 'lucide-react';
import { PageType } from '../types';
import { BrandName } from './BrandName';
import { useTheme } from '../context/ThemeContext';

interface VastuCompassSectionProps {
  onNavigate: (page: PageType, subTab?: string) => void;
}

export const VastuCompassSection: React.FC<VastuCompassSectionProps> = ({ onNavigate }) => {
  const { isLight } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <FolioReveal>
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2 text-xs font-serif uppercase tracking-widest text-[#E88A16] font-bold">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Interactive Classical Tool · दिक्-साधन साधनम्</span>
          </div>
          <h1
            className={`font-['Cinzel_Decorative'] text-3xl sm:text-4xl md:text-5xl font-black drop-shadow-md ${
              isLight ? 'text-stone-950' : 'text-[#FFF7ED]'
            }`}
          >
            Digital Vastu Compass & Spatial Matrix
          </h1>
          <p
            className={`font-['Marcellus'] text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-[var(--color-text-body)]' : 'text-[#E8D3A8]'
            }`}
          >
            Determine standard directions and visualize classical 16-zone Vastu-compliant room placements calibrated precisely to your dwelling's entrance orientation.
          </p>
        </div>
      </FolioReveal>

      {/* Main Full-Page Compass Widget */}
      <FolioReveal>
        <VastuCompassWidget
          fullPage={true}
          onNavigateContact={() => onNavigate('contact')}
        />
      </FolioReveal>

      {/* How to Measure House Orientation Accurately (Shastric & Scientific Guide) */}
      <FolioReveal>
        <div
          className={`rounded-3xl border-2 p-6 sm:p-10 text-left space-y-6 shadow-xl ${
            isLight
              ? 'bg-white border-[var(--color-border)] text-[var(--color-text-heading)] shadow-amber-900/5'
              : 'bg-[#22130B] border-[#D4A72C] text-[#FFF7ED]'
          }`}
        >
          <div className="border-b-2 border-[#D4A72C]/40 pb-4">
            <span className="text-xs font-serif uppercase tracking-wider text-[#E88A16] font-bold">
              Field Methodology & Accuracy
            </span>
            <h3
              className={`font-['Cinzel_Decorative'] text-xl sm:text-2xl font-black mt-1 ${
                isLight ? 'text-stone-950' : 'text-[#FFF7ED]'
              }`}
            >
              How to Accurately Measure Your Home's Facing Direction
            </h3>
            <p className={`font-['Marcellus'] text-xs sm:text-sm mt-1 ${isLight ? 'text-[var(--color-text-body)]' : 'text-[#E8D3A8]'}`}>
              Avoid common measurement errors. Follow the classical *Dina-Shuddhi* and modern magnetometer protocol:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-2xl border ${isLight ? 'bg-amber-50/70 border-[var(--color-border)]' : 'bg-[#1A0F0A] border-[#D4A72C]/40'} space-y-2`}>
              <div className="w-8 h-8 rounded-lg bg-[#E88A16] text-[#2D1B14] font-bold flex items-center justify-center font-serif text-sm">
                1
              </div>
              <h4 className="font-['Cinzel_Decorative'] font-bold text-sm">Stand at Main Entrance Door</h4>
              <p className={`font-['Marcellus'] text-xs leading-relaxed ${isLight ? 'text-[var(--color-text-body)]' : 'text-[#E8D3A8]'}`}>
                Stand at the threshold of your main door with your back towards the inside of the house, looking outward toward the street/corridor.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isLight ? 'bg-amber-50/70 border-[var(--color-border)]' : 'bg-[#1A0F0A] border-[#D4A72C]/40'} space-y-2`}>
              <div className="w-8 h-8 rounded-lg bg-[#E88A16] text-[#2D1B14] font-bold flex items-center justify-center font-serif text-sm">
                2
              </div>
              <h4 className="font-['Cinzel_Decorative'] font-bold text-sm">Eliminate Ferrous Interference</h4>
              <p className={`font-['Marcellus'] text-xs leading-relaxed ${isLight ? 'text-[var(--color-text-body)]' : 'text-[#E8D3A8]'}`}>
                Hold your smartphone or magnetic compass horizontally at waist height. Ensure you are at least 3 feet away from iron safety grills, steel beams, or electrical panels.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isLight ? 'bg-amber-50/70 border-[var(--color-border)]' : 'bg-[#1A0F0A] border-[#D4A72C]/40'} space-y-2`}>
              <div className="w-8 h-8 rounded-lg bg-[#E88A16] text-[#2D1B14] font-bold flex items-center justify-center font-serif text-sm">
                3
              </div>
              <h4 className="font-['Cinzel_Decorative'] font-bold text-sm">Input Exact Bearing in Degrees</h4>
              <p className={`font-['Marcellus'] text-xs leading-relaxed ${isLight ? 'text-[var(--color-text-body)]' : 'text-[#E8D3A8]'}`}>
                Note down the exact degree pointing directly ahead (e.g. 88° East, 42° North-East) and slide the Digital Compass to that degree to see your house grid.
              </p>
            </div>
          </div>
        </div>
      </FolioReveal>

      {/* CTA Box */}
      <FolioReveal>
        <div className="bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-secondary)] border-2 border-[var(--color-primary-light)] rounded-3xl p-8 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-xs uppercase font-serif tracking-widest text-[var(--color-accent-orange)] font-bold">
              Detailed Architectural Analysis · वास्तु सम्परीक्षा
            </span>
            <h3 className="font-['Cinzel_Decorative'] text-2xl sm:text-3xl font-black text-white">
              Need a Scaled CAD Blueprint Audit?
            </h3>
            <p className="font-['Marcellus'] text-zinc-100 text-sm sm:text-base max-w-xl">
              Our research scholar and architectural team provide millimeter-accurate 16-zone grid overlays on CAD architectural plans with non-destructive remedies.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="whitespace-nowrap px-8 py-3.5 rounded-xl bg-white hover:bg-[var(--color-surface-soft)] text-[var(--color-primary)] font-serif font-bold text-sm sm:text-base border border-white shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all cursor-pointer flex items-center gap-2"
          >
            <PhoneCall className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Consult <BrandName size="inherit" /></span>
          </button>
        </div>
      </FolioReveal>
    </div>
  );
};
