import create from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userRole: 'admin' | 'moderator' | 'user' | null;
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: null,
  user: null,
  login: (userData) => set({ isAuthenticated: true, user: userData, userRole: userData.role }),
  logout: () => set({ isAuthenticated: false, user: null, userRole: null }),
}));