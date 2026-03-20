// import { create } from 'zustand';

// export type UserRole =
//   | 'admin'
//   | 'principal'
//   | 'project_head'
//   | 'architect'
//   | 'planner'
//   | 'draftsman'
//   | 'noc_officer'
//   | 'site_coordinator'
//   | 'accountant'
//   | 'client';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   avatar?: string;
//   department?: string;
// }

// interface UserState {
//   user: User | null;
//   isAuthenticated: boolean;
//   setUser: (user: User) => void;
//   logout: () => void;
// }

// // Mock user for demo
// const mockUser: User = {
//   id: '1',
//   name: 'Prajwal ',
//   email: 'prajwal@architects.com',
//   role: 'principal',
//   avatar: undefined,
//   department: 'Architecture',
// };

// export const useUserStore = create<UserState>((set) => ({
//   user: mockUser,
//   isAuthenticated: true,

//   setUser: (user: User) => set({ user, isAuthenticated: true }),

//   logout: () => set({ user: null, isAuthenticated: false }),
// }));

import { create } from "zustand";

// ── Must match backend exactly ────────────────────────────────
export type UserRole = "ADMIN";
("CO_FOUNDER");
("SR_ARCHITECT");
("JR_ARCHITECT");
("SR_ENGINEER");
("DRAFTSMAN");
("LIAISON_MANAGER");
("LIAISON_OFFICER");
("LIAISON_ASSISTANT");
("HR");
("CLIENT");

export interface User {
  userId: number;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  loadFromStorage: () => void;
  logout: () => void;
}

function readFromStorage(): User | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export const useUserStore = create<UserState>((set) => ({
  user: readFromStorage(),
  isAuthenticated: !!readFromStorage(),

  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  loadFromStorage: () => {
    const user = readFromStorage();
    set({ user, isAuthenticated: !!user });
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },
}));
