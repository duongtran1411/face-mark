import FaceScanCamera from "@/components/FaceScanCamera";
import { Schedule } from "@/models/Schedule";
import { Student } from "@/models/Student";
import { getScheduleById } from "@/service/schedule/schedule.api";
import { getStudentByClass } from "@/service/student/student.api";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

// Student type now directly uses the Student model
type StudentAttendance = {
  student: Student;
  status: "Đang học" | "late" | "vắng mặt";
};

export default function ClassDetailScreen() {
  const router = useRouter();
  const { scheduleId } = useLocalSearchParams<{ scheduleId: string }>();

  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [scheduleInfo, setScheduleInfo] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFaceScanCameraVisible, setIsFaceScanCameraVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleVerificationSuccess = (verifiedStudentId: number) => {
    Toast.show({
      type: "success",
      text1: "Xác thực thành công!",
      text2: `Đã điểm danh sinh viên.`,
    });
    updateStatus(verifiedStudentId, "Đang học");
    setSelectedStudent(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!scheduleId) return;
      setIsLoading(true);
      try {
        const token = (await AsyncStorage.getItem("access_token")) || "";

        // Fetch both schedule details and student list concurrently
        const [scheduleData, studentData] = await Promise.all([
          getScheduleById(parseInt(scheduleId, 10), token),
          getStudentByClass(parseInt(scheduleId, 10), token),
        ]);

        setScheduleInfo(scheduleData);

        // Ensure studentData is an array and filter out invalid entries
        if (Array.isArray(studentData)) {
          const initialStudents: StudentAttendance[] = studentData
            .filter((response: any) => {
              return response?.student; // Check if student exists directly
            })
            .map((response: { student: Student; status?: string }) => {
              return {
                student: response.student,
                status: 'vắng mặt',
              };
            });
          setStudents(initialStudents);
        } else {
          setStudents([]);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [scheduleId]);

  const updateStatus = (id: number, newStatus: StudentAttendance["status"]) => {
    setStudents((prev) =>
      prev.map((s) => (s.student.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const countByStatus = (status: StudentAttendance["status"]) =>
    students.filter((s) => s.status === status).length;

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Đang tải dữ liệu lớp học...</Text>
      </View>
    );
  }

  if (!scheduleInfo) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Không thể tải thông tin lớp học.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Điểm danh lớp {scheduleInfo.class.name}</Text>
      <Text style={styles.subtitle}>
        {scheduleInfo.module.code} -{" "}
        {scheduleInfo.shift.startTime.substring(0, 5)} - Phòng{" "}
        {scheduleInfo.classroom.name}
      </Text>
      <Text style={styles.subtitle}>Ngày: {scheduleInfo.date}</Text>

      <View style={styles.statsRow}>
        <StatBox
          label="Tổng số"
          value={students.length}
          color="#1E88E5"
          icon={<FontAwesome name="users" size={24} color="#1E88E5" />}
        />
        <StatBox
          label="Có mặt"
          value={countByStatus("Đang học")}
          color="#43A047"
          icon={<Ionicons name="checkmark-circle" size={24} color="#43A047" />}
        />
        <StatBox
          label="Đi muộn"
          value={countByStatus("late")}
          color="#FBC02D"
          icon={<MaterialIcons name="access-time" size={24} color="#FBC02D" />}
        />
        <StatBox
          label="Vắng mặt"
          value={countByStatus("vắng mặt")}
          color="#E53935"
          icon={<Ionicons name="close-circle" size={24} color="#E53935" />}
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsFaceScanCameraVisible(true)}
        >
          <Ionicons name="camera" size={18} color="#fff" />
          <Text style={styles.buttonText}> Xác thực khuôn mặt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary}>
          <Ionicons name="checkbox" size={18} color="#00796B" />
          <Text style={styles.buttonSecondaryText}> Điểm danh tất cả</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Danh sách học sinh</Text>
      <FlatList
        data={students}
        keyExtractor={(item, index) =>
          item?.student?.id?.toString() ?? index.toString()
        }
        renderItem={({ item }) => {
          // Skip rendering if student data is invalid
          if (!item?.student) {
            return null;
          }

          return (
            <View style={styles.studentCard}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.student.name}</Text>
                <Text style={styles.id}>MSSV: {item.student.studentId}</Text>
                <View style={styles.radioRow}>
                  {renderRadio(
                    item.student.id,
                    "Đang học",
                    item.status,
                    updateStatus,
                    "Có mặt"
                  )}
                  {renderRadio(
                    item.student.id,
                    "late",
                    item.status,
                    updateStatus,
                    "Đi muộn"
                  )}
                  {renderRadio(
                    item.student.id,
                    "vắng mặt",
                    item.status,
                    updateStatus,
                    "Vắng mặt"
                  )}
                </View>
              </View>
              <View style={styles.statusTag}>
                <Text style={[styles.tagText, getStatusStyle(item.status)]}>
                  {getStatusText(item.status)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedStudent(item.student);
                    setIsFaceScanCameraVisible(true);
                  }}
                >
                  <Ionicons
                    name="camera"
                    size={20}
                    color="#777"
                    style={{ marginTop: 4 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal
        visible={isFaceScanCameraVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setIsFaceScanCameraVisible(false);
          setSelectedStudent(null);
        }}
      >
        {selectedStudent && scheduleId && (
          <FaceScanCamera
            onClose={() => {
              setIsFaceScanCameraVisible(false);
              setSelectedStudent(null);
            }}
            onVerificationSuccess={handleVerificationSuccess}
            studentName={selectedStudent.name}
            studentId={selectedStudent.id}
            scheduleId={parseInt(scheduleId, 10)}
          />
        )}
      </Modal>
    </View>
  );
}

function StatBox({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <View style={[styles.statBox, { borderColor: color }]}>
      {icon}
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function renderRadio(
  id: number,
  value: StudentAttendance["status"],
  current: StudentAttendance["status"],
  update: (id: number, newStatus: StudentAttendance["status"]) => void,
  label: string
) {
  return (
    <Pressable
      onPress={() => update(id, value)}
      style={{ flexDirection: "row", alignItems: "center", marginRight: 12 }}
    >
      <View
        style={{
          height: 14,
          width: 14,
          borderRadius: 7,
          borderWidth: 2,
          borderColor: "#555",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 4,
        }}
      >
        {current === value && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#2E7D32",
            }}
          />
        )}
      </View>
      <Text style={{ fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

function getStatusText(status: StudentAttendance["status"]) {
  switch (status) {
    case "Đang học":
      return "Có mặt";
    case "late":
      return "Đi muộn";
    case "vắng mặt":
      return "Vắng mặt";
  }
}

function getStatusStyle(status: StudentAttendance["status"]) {
  const common = {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: "bold" as const,
  };

  switch (status) {
    case "Đang học":
      return { ...common, backgroundColor: "#F1F8E9", color: "#2E7D32" };
    case "late":
      return { ...common, backgroundColor: "#FFF9C4", color: "#F9A825" };
    case "vắng mặt":
      return { ...common, backgroundColor: "#FFEBEE", color: "#C62828" };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  back: { color: "#2E7D32", marginBottom: 10, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", color: "#2E7D32" },
  subtitle: { fontSize: 14, color: "#555" },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 8,
    justifyContent: "space-between",
  },
  statBox: {
    width: "23%",
    borderWidth: 1.5,
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  statLabel: { fontSize: 13, color: "#333" },
  statValue: { fontSize: 20, fontWeight: "bold" },
  actionRow: { flexDirection: "row", gap: 10, marginVertical: 12 },
  button: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#263238",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  buttonSecondary: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#E0F2F1",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00796B",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondaryText: {
    color: "#00796B",
    fontWeight: "bold",
  },
  sectionTitle: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  studentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#2E7D32" },
  id: { fontSize: 14, color: "#555", marginBottom: 6 },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    marginTop: 4,
  },
  statusTag: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  tagText: { fontSize: 12 },
});
