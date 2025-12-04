import { create } from 'zustand';

interface UIState {
    viewType: 'list' | 'board' | 'calendar' | 'settings';
    isSidebarOpen: boolean;
    activeModal: 'project' | 'label' | 'filter' | null;
    activeContext: {
        type: 'inbox' | 'today' | 'upcoming' | 'project' | 'label' | 'filter';
        id?: string;
    };

    setViewType: (view: 'list' | 'board' | 'calendar' | 'settings') => void;
    toggleSidebar: () => void;
    openModal: (modal: 'project' | 'label' | 'filter') => void;
    closeModal: () => void;
    setActiveContext: (context: UIState['activeContext']) => void;
}

export const useUIStore = create<UIState>((set) => ({
    viewType: 'list',
    isSidebarOpen: true,
    activeModal: null,
    activeContext: { type: 'inbox' },

    setViewType: (viewType) => set({ viewType }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null }),
    setActiveContext: (activeContext) => set({ activeContext }),
}));
