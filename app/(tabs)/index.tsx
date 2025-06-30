import { TokenPayload } from "@/models/TokenPayload";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function HomeScreen() {
  const router = useRouter();

  const handlePress = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.roles.includes("TEACHER")) {
        router.push("/(tabs)/CalendarScreen");
      }

      if (decoded.roles.includes("STUDENT")) {
        router.push("/(tabs)/CalendarStudentScreen");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Timetable</Text>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <Image
          style={styles.icon}
          source={require("../../assets/images/calendar-days.png")}
        />
        <Text style={styles.label}>Weekly timetable</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
    backgroundColor: "#F6F6F6",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1D4ED8",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
    tintColor: "#F59E0B",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
  },
});
