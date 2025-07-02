import { Student } from "@/models/Student";
import { Teacher } from "@/models/Teacher";
import { TokenPayload } from "@/models/TokenPaylod";
import { getProfileTeacher } from "@/service/profile/teacher.api";
import { getProfileStudent } from "@/service/student/student.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const [teacher, setTeacher] = useState<Teacher>();
  const [student, setStudent] = useState<Student>();
  const router = useRouter();

  useEffect(() => {
    const fetchTeacher = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        const decoded = jwtDecode<TokenPayload>(token);
        const userId = decoded.sub;
        if (userId) {
          debugger;
          if (Array.isArray(decoded.roles) && decoded.roles.includes("STUDENT")) {
            const response = await getProfileStudent(userId, token);
            if (response) {
              setStudent(response);
              return;
            }
          }
          const response = await getProfileTeacher(userId, token);
          if (response) {
            setTeacher(response);
            return;
          }
        }
      }
    };
    fetchTeacher();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Image
          source={require("@/assets/images/user.png")}
          style={styles.avatar}
        />
        <Text style={styles.title}>Thông tin giáo viên</Text>
      </View>
      {teacher && !student ? (
        <View style={styles.profileBox}>
          <Text style={styles.label}>Họ tên:</Text>
          <Text style={styles.value}>{teacher.name}</Text>
          <Text style={styles.label}>Giới tính:</Text>
          <Text style={styles.value}>{teacher.gender || "Chưa cập nhật"}</Text>
          <Text style={styles.label}>Ngày sinh:</Text>
          <Text style={styles.value}>{teacher.birthdate}</Text>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{teacher.phone || "Chưa cập nhật"}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{teacher.email || "Chưa cập nhật"}</Text>
          <Text style={styles.label}>Ngày vào làm:</Text>
          <Text style={styles.value}>
            {teacher.working_date || "Chưa cập nhật"}
          </Text>
        </View>
      ) : !teacher && student ? (
        <View style={styles.profileBox}>
          <Text style={styles.label}>Họ tên:</Text>
          <Text style={styles.value}>{student.name}</Text>
          <Text style={styles.label}>Giới tính:</Text>
          <Text style={styles.value}>{student.gender || "Chưa cập nhật"}</Text>
          <Text style={styles.label}>Ngày sinh:</Text>
          <Text style={styles.value}>{student.birthdate}</Text>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{student.phone || "Chưa cập nhật"}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student.email || "Chưa cập nhật"}</Text>
          <Text style={styles.label}>Địa chỉ:</Text>
          <Text style={styles.value}>
            {student.permanentResidence || "Chưa cập nhật"}
          </Text>
        </View>
      ) : (
        <Text>Đang tải thông tin...</Text>
      )}
      <View style={styles.logoutBox}>
        <Text style={styles.logoutHint}>
          Bạn muốn đăng xuất khỏi tài khoản?
        </Text>
        <Text
          style={styles.logoutButton}
          onPress={async () => {
            await AsyncStorage.removeItem("access_token");
            router.replace("/(auth)/login");
          }}>
          Đăng xuất
        </Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  headerBox: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 0,
  },
  profileBox: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#2E7D32",
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  logoutBox: {
    width: "100%",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  logoutHint: {
    color: "#888",
    marginBottom: 8,
  },
  logoutButton: {
    color: "#fff",
    backgroundColor: "#C62828",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 16,
    overflow: "hidden",
  },
});
