import React from 'react';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useSettingsStore, type Theme } from '../../store/useSettingsStore';
import { cn } from '../../lib/utils';

export const SettingsPage = () => {
    const { theme, setTheme, startOfWeek, setStartOfWeek, timeFormat, setTimeFormat } = useSettingsStore();

    const ThemeOption = ({ value, icon: Icon, label }: { value: Theme; icon: any; label: string }) => (
        <button
            onClick={() => setTheme(value)}
            className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all w-32",
                theme === value
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
            )}
        >
            <Icon size={24} />
            <span className="text-sm font-medium">{label}</span>
            {theme === value && <div className="absolute top-2 right-2 text-primary-500"><Check size={16} /></div>}
        </button>
    );

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

            <section className="mb-10">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
                <div className="flex gap-4">
                    <ThemeOption value="light" icon={Sun} label="Light" />
                    <ThemeOption value="dark" icon={Moon} label="Dark" />
                    <ThemeOption value="system" icon={Monitor} label="System" />
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">Start of week</div>
                            <div className="text-sm text-gray-500">Set the first day of your calendar week</div>
                        </div>
                        <select
                            value={startOfWeek}
                            onChange={(e) => setStartOfWeek(e.target.value as 'monday' | 'sunday')}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                        >
                            <option value="monday">Monday</option>
                            <option value="sunday">Sunday</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">Time format</div>
                            <div className="text-sm text-gray-500">Choose your preferred time format</div>
                        </div>
                        <select
                            value={timeFormat}
                            onChange={(e) => setTimeFormat(e.target.value as '12h' | '24h')}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                        >
                            <option value="24h">24 Hour</option>
                            <option value="12h">12 Hour</option>
                        </select>
                    </div>
                </div>
            </section>
        </div>
    );
};
