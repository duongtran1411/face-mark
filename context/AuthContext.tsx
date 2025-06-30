import { TokenPayload } from "@/models/TokenPayload";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
interface AuthContextType {
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  const loadToken = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      console.log('decoded',decoded);
      if (Array.isArray(decoded.roles) && decoded.roles.includes("TEACHER")) {
        
        setUserToken(token);
        setIsLoggedIn(true);
        router.replace("/(tabs)")
        return
      }

      if(decoded.roles.includes('STUDENT')){
        setUserToken(token);
        setIsLoggedIn(true);
        router.replace("/(tabs)")
        return
      }
    } else {
      setUserToken(null);
      router.replace("/(auth)/login");
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
