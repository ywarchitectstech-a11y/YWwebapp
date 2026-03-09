import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  expandedMenus: string[];
  toggleCollapse: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
  toggleMenu: (menuId: string) => void;
  setExpandedMenus: (menus: string[]) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  expandedMenus: ['projects', 'preSales'],
  
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  
  closeMobile: () => set({ isMobileOpen: false }),
  
  toggleMenu: (menuId: string) => set((state) => ({
    expandedMenus: state.expandedMenus.includes(menuId)
      ? state.expandedMenus.filter((id) => id !== menuId)
      : [...state.expandedMenus, menuId],
  })),
  
  setExpandedMenus: (menus: string[]) => set({ expandedMenus: menus }),
}));
