import { createContext, useContext, type ReactNode } from 'react';
import { fallbackSettings } from '../data/fallbackData';
import { publicApi } from '../services/api';
import { useFetch } from './useFetch';

export interface SiteSettings {
  businessName: string;
  tagline: string;
  contactEmail?: string;
  phone?: string;
  whatsappNumber?: string;
  address?: string;
  social: Record<string, string | undefined>;
  home: Record<string, string | undefined>;
  tracking: { ga: string | null; gtm: string | null; metaPixel: string | null };
}

const defaults: SiteSettings = fallbackSettings;

const Ctx = createContext<SiteSettings>(defaults);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useFetch<SiteSettings>(() => publicApi.settings(), []);
  return <Ctx.Provider value={{ ...defaults, ...(data ?? {}) }}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);
