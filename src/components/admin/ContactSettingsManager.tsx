import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  Clock,
  Youtube,
  Twitter,
  MapPin,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  MessageSquare,
  Building2,
  Sparkles,
} from 'lucide-react';

export interface SiteContactSettings {
  id?: number;
  primaryPhone: string;
  secondaryPhone: string | null;
  primaryEmail: string;
  consultationEmail: string | null;
  whatsappNumber: string | null;
  whatsappNotice: string | null;
  consultationTimings: string | null;
  appointmentNotice: string | null;
  youtubeUrl: string | null;
  youtubeHandle: string | null;
  twitterUrl: string | null;
  twitterHandle: string | null;
  officeAddress: string | null;
  collaborationNotice: string | null;
  adsensePublisherId?: string | null;
  adsenseEnabled?: boolean;
  adsenseAutoAds?: boolean;
  updatedAt?: string;
}

interface ContactSettingsManagerProps {
  userRole: 'admin' | 'editor' | 'viewer';
  onNotification?: (msg: string) => void;
}

export const ContactSettingsManager: React.FC<ContactSettingsManagerProps> = ({
  userRole,
  onNotification,
}) => {
  const [formData, setFormData] = useState<SiteContactSettings>({
    primaryPhone: '',
    secondaryPhone: '',
    primaryEmail: '',
    consultationEmail: '',
    whatsappNumber: '',
    whatsappNotice: '',
    consultationTimings: '',
    appointmentNotice: '',
    youtubeUrl: '',
    youtubeHandle: '',
    twitterUrl: '',
    twitterHandle: '',
    officeAddress: '',
    collaborationNotice: '',
    adsensePublisherId: 'ca-pub-9697854430800000',
    adsenseEnabled: true,
    adsenseAutoAds: false,
  });

  const [initialData, setInitialData] = useState<SiteContactSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canEdit = userRole === 'admin' || userRole === 'editor';

  // Load live contact settings from real PostgreSQL backend
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings/contact');
      if (!res.ok) {
        throw new Error(`Failed to load contact settings: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.settings) {
        const s = data.settings;
        const mapped: SiteContactSettings = {
          id: s.id,
          primaryPhone: s.primaryPhone || s.primary_phone || '',
          secondaryPhone: s.secondaryPhone || s.secondary_phone || '',
          primaryEmail: s.primaryEmail || s.primary_email || '',
          consultationEmail: s.consultationEmail || s.consultation_email || '',
          whatsappNumber: s.whatsappNumber || s.whatsapp_number || '',
          whatsappNotice: s.whatsappNotice || s.whatsapp_notice || '',
          consultationTimings: s.consultationTimings || s.consultation_timings || '',
          appointmentNotice: s.appointmentNotice || s.appointment_notice || '',
          youtubeUrl: s.youtubeUrl || s.youtube_url || '',
          youtubeHandle: s.youtubeHandle || s.youtube_handle || '',
          twitterUrl: s.twitterUrl || s.twitter_url || '',
          twitterHandle: s.twitterHandle || s.twitter_handle || '',
          officeAddress: s.officeAddress || s.office_address || '',
          collaborationNotice: s.collaborationNotice || s.collaboration_notice || '',
          adsensePublisherId: s.adsensePublisherId || s.adsense_publisher_id || 'ca-pub-9697854430800000',
          adsenseEnabled: s.adsenseEnabled !== undefined ? Boolean(s.adsenseEnabled) : (s.adsense_enabled !== undefined ? Boolean(s.adsense_enabled) : true),
          adsenseAutoAds: s.adsenseAutoAds !== undefined ? Boolean(s.adsenseAutoAds) : (s.adsense_auto_ads !== undefined ? Boolean(s.adsense_auto_ads) : false),
          updatedAt: s.updatedAt || s.updated_at,
        };
        setFormData(mapped);
        setInitialData(mapped);
      }
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError(err.message || 'Failed to connect to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field: keyof SiteContactSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      setError('You have viewer role only. Modifications require editor or admin role.');
      return;
    }

    if (!formData.primaryPhone.trim()) {
      setError('Primary phone number is required.');
      return;
    }
    if (!formData.primaryEmail.trim()) {
      setError('Primary email address is required.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admin/settings/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update contact settings');
      }

      setInitialData(formData);
      setSuccessMessage('Contact details successfully saved to database and live on website!');
      if (onNotification) {
        onNotification('Contact details updated successfully');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Database error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="font-serif text-sm text-stone-400">Loading current website contact details from database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-['Marcellus',serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/50 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-['Cinzel',serif] text-2xl font-bold text-amber-200">
              Admin Contact Details & Channels
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live on Website
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Modify institutional phone numbers, consultation desk emails, operational timings, and social knowledge channels.
            All modifications persist directly in the PostgreSQL database and immediately reflect on the public website.
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-serif border border-stone-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Alert Notices */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5 shadow-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5 shadow-md">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2-Column Responsive Layout: Form on Left, Real-time Website Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Card 1: Telephony & WhatsApp */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#1A0E08] border border-amber-900/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-900/40 pb-3">
              <Phone className="w-4 h-4 text-amber-400" />
              <h3 className="font-['Cinzel',serif] text-sm font-bold text-amber-100">
                Direct Telephony & WhatsApp
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-amber-300 mb-1">
                  Primary Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.primaryPhone}
                  onChange={(e) => handleChange('primaryPhone', e.target.value)}
                  placeholder="+91 98200 18272"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  Secondary / Consultation Desk Phone
                </label>
                <input
                  type="text"
                  value={formData.secondaryPhone || ''}
                  onChange={(e) => handleChange('secondaryPhone', e.target.value)}
                  placeholder="+91 98200 45678"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  WhatsApp Direct Number
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber || ''}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="+919820018272"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  WhatsApp Blueprint Sharing Notice
                </label>
                <input
                  type="text"
                  value={formData.whatsappNotice || ''}
                  onChange={(e) => handleChange('whatsappNotice', e.target.value)}
                  placeholder="✦ WhatsApp Available for Blueprint Sharing"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Institutional Email Channels */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#1A0E08] border border-amber-900/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-900/40 pb-3">
              <Mail className="w-4 h-4 text-amber-400" />
              <h3 className="font-['Cinzel',serif] text-sm font-bold text-amber-100">
                Institutional Email Channels
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-amber-300 mb-1">
                  Primary Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.primaryEmail}
                  onChange={(e) => handleChange('primaryEmail', e.target.value)}
                  placeholder="contact@vasturitam.com"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  Consultation Desk Email
                </label>
                <input
                  type="email"
                  value={formData.consultationEmail || ''}
                  onChange={(e) => handleChange('consultationEmail', e.target.value)}
                  placeholder="consultation@vasturitam.com"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Consultation Timings & Protocols */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#1A0E08] border border-amber-900/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-900/40 pb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="font-['Cinzel',serif] text-sm font-bold text-amber-100">
                Consultation Timings & Protocols
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  Consultation Hours & Schedule
                </label>
                <input
                  type="text"
                  value={formData.consultationTimings || ''}
                  onChange={(e) => handleChange('consultationTimings', e.target.value)}
                  placeholder="Monday – Saturday: 10:00 AM – 6:30 PM (IST)"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  Prior Appointment / Architectural Audit Protocol Notice
                </label>
                <input
                  type="text"
                  value={formData.appointmentNotice || ''}
                  onChange={(e) => handleChange('appointmentNotice', e.target.value)}
                  placeholder="Prior appointment required for in-depth architectural floor plan audit."
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Official Knowledge Channels & Address */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#1A0E08] border border-amber-900/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-900/40 pb-3">
              <Building2 className="w-4 h-4 text-amber-400" />
              <h3 className="font-['Cinzel',serif] text-sm font-bold text-amber-100">
                Social Channels & Sanctuary Address
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl || ''}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  placeholder="https://youtube.com/@vasturitam"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  YouTube Display Handle
                </label>
                <input
                  type="text"
                  value={formData.youtubeHandle || ''}
                  onChange={(e) => handleChange('youtubeHandle', e.target.value)}
                  placeholder="@VastuRitam"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  X / Twitter Profile URL
                </label>
                <input
                  type="url"
                  value={formData.twitterUrl || ''}
                  onChange={(e) => handleChange('twitterUrl', e.target.value)}
                  placeholder="https://x.com/vasturitam"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  X / Twitter Display Handle
                </label>
                <input
                  type="text"
                  value={formData.twitterHandle || ''}
                  onChange={(e) => handleChange('twitterHandle', e.target.value)}
                  placeholder="@VastuRitam"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  Sanctuary & Research Office Location
                </label>
                <input
                  type="text"
                  value={formData.officeAddress || ''}
                  onChange={(e) => handleChange('officeAddress', e.target.value)}
                  placeholder="Vastu Ritam Research & Vedic Architecture Sanctuary, Pune / Mumbai, Maharashtra, Bharat"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  Architect & Structural Engineer Collaboration Notice
                </label>
                <textarea
                  rows={2}
                  value={formData.collaborationNotice || ''}
                  onChange={(e) => handleChange('collaborationNotice', e.target.value)}
                  placeholder="Collaborations welcome from registered Architects (COA), Civil Structural Engineers, and Researchers."
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* 5. Google AdSense & Revenue Network Settings */}
          <div className="p-5 rounded-2xl bg-[#1C0F08] border border-amber-900/60 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                <h3 className="font-['Cinzel',serif] text-sm font-bold text-amber-200 uppercase tracking-wider">
                  Google AdSense & Publisher Monetization
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Official Integration
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                  Google AdSense Publisher ID (ca-pub-...)
                </label>
                <input
                  type="text"
                  value={formData.adsensePublisherId || ''}
                  onChange={(e) => handleChange('adsensePublisherId', e.target.value)}
                  placeholder="ca-pub-9697854430800000"
                  disabled={!canEdit || saving}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 placeholder-stone-600 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-stone-500 font-serif mt-1">
                  Used by all active AdSense placements (Leaderboards, In-Article units, Sticky Footer).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <input
                    type="checkbox"
                    id="adsenseEnabledCheck"
                    checked={formData.adsenseEnabled ?? true}
                    onChange={(e) => handleChange('adsenseEnabled', e.target.checked)}
                    disabled={!canEdit || saving}
                    className="w-4 h-4 rounded border-amber-800 bg-stone-900 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="adsenseEnabledCheck" className="text-xs text-stone-300 font-serif cursor-pointer">
                    <span className="font-bold block text-amber-200">Enable Google AdSense</span>
                    <span className="text-[10px] text-stone-400">Serve Google Ads in designated placements</span>
                  </label>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <input
                    type="checkbox"
                    id="adsenseAutoAdsCheck"
                    checked={formData.adsenseAutoAds ?? false}
                    onChange={(e) => handleChange('adsenseAutoAds', e.target.checked)}
                    disabled={!canEdit || saving}
                    className="w-4 h-4 rounded border-amber-800 bg-stone-900 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="adsenseAutoAdsCheck" className="text-xs text-stone-300 font-serif cursor-pointer">
                    <span className="font-bold block text-amber-200">AdSense Auto-Ads</span>
                    <span className="text-[10px] text-stone-400">Let Google automatically place responsive units</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Action */}
          {canEdit && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-serif border border-stone-700 transition-colors cursor-pointer"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 hover:shadow-amber-500/20 transition-all cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Publishing to Database...' : 'Save & Publish Live'}</span>
              </button>
            </div>
          )}
        </form>

        {/* Live Website Preview Column */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-2 border-b border-amber-900/40">
            <span className="font-['Cinzel',serif] text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Website Preview</span>
            </span>
            <span className="text-[10px] font-mono text-stone-400">Updates in real-time</span>
          </div>

          {/* 1. Contact Section Card Preview */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">
              1. Contact Page Direct Channels Card
            </span>
            <div className="section-teal-heritage rounded-2xl p-5 border-2 border-[#D4A72C] shadow-xl space-y-4 text-[#FFF7ED]">
              <h4 className="font-['Cinzel_Decorative'] text-sm font-black text-[#FFF7ED] border-b border-[#D4A72C]/40 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E88A16] inline-block" />
                <span>Direct Channels</span>
              </h4>

              {/* Phone Preview */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#2D1B14] border border-[#D4A72C]">
                <div className="w-8 h-8 rounded-lg bg-[#E88A16] flex items-center justify-center text-[#2D1B14] shrink-0 font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#D4A72C] font-bold block">
                    Mobile Number
                  </span>
                  <div className="font-['Marcellus'] text-sm font-bold text-[#FFF7ED] truncate">
                    {formData.primaryPhone || '+91 98200 18272'}
                  </div>
                  {formData.secondaryPhone && (
                    <div className="font-['Marcellus'] text-xs text-[#E8D3A8] truncate">
                      {formData.secondaryPhone} (Consultation Desk)
                    </div>
                  )}
                  {formData.whatsappNotice && (
                    <span className="text-[10px] text-[#FDE68A] font-serif block pt-0.5">
                      {formData.whatsappNotice}
                    </span>
                  )}
                </div>
              </div>

              {/* Email Preview */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#2D1B14] border border-[#D4A72C]">
                <div className="w-8 h-8 rounded-lg bg-[#B94E2C] flex items-center justify-center text-[#FFF7ED] shrink-0 font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#D4A72C] font-bold block">
                    Email Address
                  </span>
                  <div className="font-['Marcellus'] text-sm font-bold text-[#FFF7ED] truncate">
                    {formData.primaryEmail || 'contact@vasturitam.com'}
                  </div>
                  {formData.consultationEmail && (
                    <div className="font-['Marcellus'] text-xs text-[#E8D3A8] truncate">
                      {formData.consultationEmail}
                    </div>
                  )}
                </div>
              </div>

              {/* Channels Preview */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#D4A72C]/30">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#6B1F1F] border border-[#D4A72C] text-[#FFF7ED]">
                  <Youtube className="w-3.5 h-3.5 text-[#FFF7ED] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase block text-[#D4A72C]">YouTube</span>
                    <span className="text-[10px] font-serif block truncate">{formData.youtubeHandle || '@VastuRitam'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#283B63] border border-[#D4A72C] text-[#FFF7ED]">
                  <Twitter className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase block text-[#D4A72C]">X</span>
                    <span className="text-[10px] font-serif block truncate">{formData.twitterHandle || '@VastuRitam'}</span>
                  </div>
                </div>
              </div>

              {/* Timing Preview */}
              {formData.consultationTimings && (
                <div className="pt-2 border-t border-[#D4A72C]/30 flex items-start gap-2 text-xs font-['Marcellus'] text-[#E8D3A8]">
                  <Clock className="w-3.5 h-3.5 text-[#D4A72C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#FFF7ED] block text-[11px]">Consultation Timings:</strong>
                    <span className="text-[10px]">{formData.consultationTimings}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Sacred Footer Preview */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">
              2. Website Footer Preview
            </span>
            <div className="p-4 rounded-xl bg-[#110507] border border-[#D4A72C]/30 text-xs font-['Marcellus'] space-y-2 text-[#E8D3A8]">
              <div className="font-['Cinzel_Decorative'] text-xs uppercase tracking-wider text-[#D4A72C] font-bold border-b border-[#D4A72C]/20 pb-1.5">
                Contact & Channels
              </div>
              <div className="flex items-center gap-2 text-xs truncate">
                <Phone className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
                <span>{formData.primaryPhone || '+91 98200 18272'} {formData.secondaryPhone ? `/ ${formData.secondaryPhone}` : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-xs truncate">
                <Mail className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
                <span>{formData.primaryEmail || 'contact@vasturitam.com'}</span>
              </div>
              {formData.collaborationNotice && (
                <p className="text-[10px] text-[#E8D3A8]/70 pt-1 border-t border-[#D4A72C]/10 leading-relaxed">
                  {formData.collaborationNotice}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
