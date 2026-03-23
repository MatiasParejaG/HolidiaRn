import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from '../storage';

type TokenType = {
  access: string;
};

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: 'idle',
      setUser: (user) => {
        set({
          user,
        });
      },
      signIn: (token) => {
        set({
          token: token,
          status: 'signIn',
        });
      },
      signOut: () => {
        set({
          status: 'signOut',
          token: null,
          user: null,
        });
      },
      hydrate: () => {
        const { token } = get();
        if (token) {
          set({
            status: 'signIn',
          });
        } else {
          set({
            status: 'signOut',
            user: null,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useAuth;

export const getToken = () => useAuth.getState().token;
export const signOut = () => useAuth.getState().signOut();
export const hydrateAuth = () => useAuth.getState().hydrate();
