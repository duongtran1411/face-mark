import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading,setLoading] = useState<Boolean>(false)
  useEffect(() => {
    const token = null;
    if (token) setIsLoggedIn(true);
  }, []);

  const loadToken = async () => {
    const token = await AsyncStorage.getItem("token");
    setUserToken(token);
    setLoading(false);
  };

  useEffect(()=>{
    loadToken()
  },[])

  const login = (username: string, password: string):Promise<void> => {
    setIsLoggedIn(true)
    return Promise.resolve();
  };
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
