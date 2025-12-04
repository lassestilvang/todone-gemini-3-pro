import { create } from 'zustand';

interface UIState {
    viewType: 'list' | 'board' | 'calendar' | 'settings';
    isSidebarOpen: boolean;
    activeModal: 'project' | 'label' | 'filter' | 'task' | 'edit-project' | 'edit-label' | 'edit-filter' | null;
    editingItemId: string | null;
    activeContext: {
        type: 'inbox' | 'today' | 'upcoming' | 'project' | 'label' | 'filter';
        id?: string;
    };

    setViewType: (view: 'list' | 'board' | 'calendar' | 'settings') => void;
    toggleSidebar: () => void;
    openModal: (modal: 'project' | 'label' | 'filter' | 'task' | 'edit-project' | 'edit-label' | 'edit-filter') => void;
    closeModal: () => void;
    setActiveContext: (context: UIState['activeContext']) => void;
    setEditingItemId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    viewType: 'list',
    isSidebarOpen: true,
    activeModal: null,
    editingItemId: null,
    activeContext: { type: 'inbox' },

    setViewType: (viewType) => set({ viewType }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null, editingItemId: null }),
    setActiveContext: (activeContext) => set({ activeContext }),
    setEditingItemId: (editingItemId) => set({ editingItemId }),
}));
