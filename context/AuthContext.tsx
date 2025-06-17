import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
interface AuthContextType {
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  debugger;

  const loadToken = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      setUserToken(token);
      setIsLoggedIn(true);
      router.replace("/(tabs)");
    } else {
      setUserToken(null);
      router.replace("/(auth)/login");
    }
    setLoading(!true);
    console.log("set loading", loading);
  };

  useEffect(() => {
    loadToken();
  }, []);

  

  // if (loading) {
  //   return (
  //     <View style={styles.loaderContainer}>
  //       <ActivityIndicator size="large" color="#297339" />
  //     </View>
  //   );
  // }

  useEffect(() => {
    console.log("loading đã thay đổi thành", loading);
  }, [loading]);

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

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
