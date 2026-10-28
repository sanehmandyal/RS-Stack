import { createContext, useContext } from 'react';
import { fallbackSettings } from '../data/fallbackData';
import { publicApi } from '../services/api';
import { useFetch } from './useFetch';
const defaults = fallbackSettings;
const Ctx = createContext(defaults);
export function SettingsProvider({ children }) {
    const { data } = useFetch(() => publicApi.settings(), []);
    const merged = {
        ...defaults,
        ...(data ?? {}),
        home: { ...(defaults.home ?? {}), ...(data?.home ?? {}) },
        social: { ...(defaults.social ?? {}), ...(data?.social ?? {}) },
    };
    return <Ctx.Provider value={merged}>{children}</Ctx.Provider>;
}
export const useSettings = () => useContext(Ctx);
