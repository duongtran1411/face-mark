import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
export default function CheckAuthScreen(){
    const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setLoading(false);
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (error:any) {
        if(error){
            Toast.show({
                type:'error',
                text1:'Đã xảy ra lỗi'
            })
        }
      }
    };
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#297339" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});