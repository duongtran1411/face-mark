import { loginApi } from "@/service/auth/login.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleLogin = async () => {
    try {
      const response = await loginApi(username, password);
      if (response) {
        AsyncStorage.setItem("access_token", response.access_token);
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      if (error) {
        Toast.show({
          type: "error",
          text1:
            error.response.data.message || error.message || "Đã có lỗi xảy ra",
        });
      }
    }
  };
  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios" || Platform.OS === "android"
            ? "padding"
            : undefined
        }
        style={styles.container}
      >
        {/* Đã ép rộng 100% và padding ở đây */}
        <View style={styles.innerContainer}>
          <View style={styles.containerImage}>
            <Image
              style={styles.image}
              source={require("../../assets/images/Demo 1.png")}
              resizeMode="contain"
            />
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="username"
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLogin()}
            >
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%", // Đảm bảo chiếm toàn bộ chiều rộng
  },
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%", // Đảm bảo chiếm toàn bộ chiều rộng
  },
  innerContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  containerImage: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  form: {
    gap: 15,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#297339",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
