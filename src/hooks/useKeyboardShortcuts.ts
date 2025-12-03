import { useEffect } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    handler: ShortcutHandler;
    description?: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if input/textarea is focused, unless it's a special shortcut (like Escape or Cmd+Enter)
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

            // Allow Escape and Cmd+Enter even in inputs
            const isSpecial = e.key === 'Escape' || (e.key === 'Enter' && (e.metaKey || e.ctrlKey));

            if (isInput && !isSpecial) return;

            shortcuts.forEach(shortcut => {
                const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
                const ctrlMatch = !!shortcut.ctrl === e.ctrlKey;
                const metaMatch = !!shortcut.meta === e.metaKey;
                const shiftMatch = !!shortcut.shift === e.shiftKey;
                const altMatch = !!shortcut.alt === e.altKey;

                if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
                    e.preventDefault();
                    shortcut.handler(e);
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};
