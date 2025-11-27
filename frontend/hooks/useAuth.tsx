// hooks/useAuth.ts
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";


interface AuthContextType {
  isLoggedIn: boolean | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  guestLogin: (guestToken: string) => Promise<void>;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const token = await SecureStore.getItemAsync("token");
      const guest = await SecureStore.getItemAsync("guest_token");
      console.log("Auth check - token:", !!token, "guest:", !!guest);
      setIsLoggedIn(!!token || !!guest);
    };
    load();
  }, []);

  const login = async (token: string) => {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.deleteItemAsync("guest_token");
    setIsLoggedIn(true);
    setIsGuest(false);
  };

  const guestLogin = async (guestToken: string) => {
    await SecureStore.setItemAsync("guest_token", guestToken);
    await SecureStore.deleteItemAsync("token");
    setIsLoggedIn(true);
    setIsGuest(true);
  };
  
  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("guest_token");
    setIsLoggedIn(false);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, guestLogin, isGuest, setIsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
