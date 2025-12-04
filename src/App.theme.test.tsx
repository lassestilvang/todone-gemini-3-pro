import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import App from './App';
import { useSettingsStore } from './store/useSettingsStore';
import { useUIStore } from './store/useUIStore';
import { useProjectStore } from './store/useProjectStore';
import { useTaskStore } from './store/useTaskStore';
import { useLabelStore } from './store/useLabelStore';
import { useFilterStore } from './store/useFilterStore';

// Mock all stores
vi.mock('./store/useSettingsStore');
vi.mock('./store/useUIStore');
vi.mock('./store/useProjectStore');
vi.mock('./store/useTaskStore');
vi.mock('./store/useLabelStore');
vi.mock('./store/useFilterStore');
vi.mock('./hooks/useSeedData', () => ({ useSeedData: vi.fn() }));
vi.mock('./hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: vi.fn() }));

describe('App Theme Integration', () => {
    let matchMediaMock: any;
    let listeners: Record<string, Function[]> = {};

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Setup default store values
        (useSettingsStore as unknown as Mock).mockReturnValue({
            theme: 'system',
        });
        (useUIStore as unknown as Mock).mockReturnValue({
            viewType: 'list',
            setViewType: vi.fn(),
            activeContext: { type: 'inbox' },
        });
        (useProjectStore as unknown as Mock).mockReturnValue({
            projects: [],
            fetchProjects: vi.fn(),
        });
        (useTaskStore as unknown as Mock).mockReturnValue({
            tasks: [],
            fetchTasks: vi.fn(),
        });
        (useLabelStore as unknown as Mock).mockReturnValue({
            labels: [],
            fetchLabels: vi.fn(),
        });
        (useFilterStore as unknown as Mock).mockReturnValue({
            filters: [],
            fetchFilters: vi.fn(),
        });

        // Mock window.matchMedia
        listeners = {};
        matchMediaMock = vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // deprecated
            removeListener: vi.fn(), // deprecated
            addEventListener: vi.fn((type, callback) => {
                if (!listeners[type]) listeners[type] = [];
                listeners[type].push(callback);
            }),
            removeEventListener: vi.fn((type, callback) => {
                if (listeners[type]) {
                    listeners[type] = listeners[type].filter(cb => cb !== callback);
                }
            }),
            dispatchEvent: vi.fn(),
        }));
        window.matchMedia = matchMediaMock;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.documentElement.className = '';
    });

    it('applies dark mode when theme is system and system prefers dark', () => {
        // Setup system preference to dark
        matchMediaMock.mockImplementation((query: string) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }));

        render(<App />);

        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('applies light mode when theme is system and system prefers light', () => {
        // Setup system preference to light (not dark)
        matchMediaMock.mockImplementation((query: string) => ({
            matches: false, // Not dark
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }));

        render(<App />);

        expect(document.documentElement.classList.contains('dark')).toBe(false);
        // Depending on implementation, it might add 'light' or just remove 'dark'
        // The current implementation adds 'light' explicitly
        expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('applies dark mode explicitly when theme is dark', () => {
        (useSettingsStore as unknown as Mock).mockReturnValue({
            theme: 'dark',
        });

        render(<App />);

        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('applies light mode explicitly when theme is light', () => {
        (useSettingsStore as unknown as Mock).mockReturnValue({
            theme: 'light',
        });

        render(<App />);

        expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('updates theme when system preference changes while in system mode', () => {
        // Start with light preference
        let changeCallback: (e: any) => void = () => { };
        const mediaQueryList = {
            matches: false,
            media: '(prefers-color-scheme: dark)',
            addEventListener: vi.fn((event, cb) => {
                if (event === 'change') changeCallback = cb;
            }),
            removeEventListener: vi.fn(),
        };

        matchMediaMock.mockReturnValue(mediaQueryList);

        render(<App />);

        expect(document.documentElement.classList.contains('light')).toBe(true);

        // Simulate system change to dark
        // Update the LIVE object
        mediaQueryList.matches = true;

        // Trigger the callback
        act(() => {
            changeCallback({ matches: true, media: '(prefers-color-scheme: dark)' });
        });

        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
});
