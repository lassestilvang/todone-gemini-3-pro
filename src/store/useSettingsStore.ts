import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
    theme: Theme;
    setTheme: (theme: Theme) => void;

    // Future settings
    startOfWeek: 'monday' | 'sunday';
    timeFormat: '12h' | '24h';
    setStartOfWeek: (day: 'monday' | 'sunday') => void;
    setTimeFormat: (format: '12h' | '24h') => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'system',
            startOfWeek: 'monday',
            timeFormat: '24h',

            setTheme: (theme) => set({ theme }),
            setStartOfWeek: (startOfWeek) => set({ startOfWeek }),
            setTimeFormat: (timeFormat) => set({ timeFormat }),
        }),
        {
            name: 'todone-settings',
        }
    )
);
