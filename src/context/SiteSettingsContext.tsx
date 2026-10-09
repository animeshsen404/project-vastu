import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface SiteSettings {
  id?: number;
  primaryPhone: string;
  secondaryPhone?: string | null;
  primaryEmail: string;
  consultationEmail?: string | null;
  whatsappNumber?: string | null;
  whatsappNotice?: string | null;
  consultationTimings?: string | null;
  appointmentNotice?: string | null;
  youtubeUrl?: string | null;
  youtubeHandle?: string | null;
  twitterUrl?: string | null;
  twitterHandle?: string | null;
  officeAddress?: string | null;
  collaborationNotice?: string | null;
  logoUrl?: string | null;
  adsensePublisherId?: string | null;
  adsenseEnabled?: boolean;
  adsenseAutoAds?: boolean;
}

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  logoUrl: string;
  updateLogoUrl: (newLogoUrl: string) => void;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const DEFAULT_LOGO = '/trademark-logo.jpg';

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  logoUrl: DEFAULT_LOGO,
  updateLogoUrl: () => {},
  refreshSettings: async () => {},
  loading: true,
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/contact-details');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.logoUrl) {
            setLogoUrl(data.settings.logoUrl);
          }
        }
      }
    } catch (err) {
      console.warn('Could not load site settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateLogoUrl = useCallback((newLogoUrl: string) => {
    setLogoUrl(newLogoUrl);
    setSettings((prev) => (prev ? { ...prev, logoUrl: newLogoUrl } : { primaryPhone: '', primaryEmail: '', logoUrl: newLogoUrl }));
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        logoUrl: logoUrl || DEFAULT_LOGO,
        updateLogoUrl,
        refreshSettings: fetchSettings,
        loading,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
