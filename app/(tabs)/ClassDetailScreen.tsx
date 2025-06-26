import FaceScanCamera from "@/components/FaceScanCamera";
import { Schedule } from "@/models/Schedule";
import { Student } from "@/models/Student";
import { StudentAttendance } from "@/models/StudentAttendance";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ClassDetailScreen() {
  const router = useRouter();
  const { scheduleId } = useLocalSearchParams<{ scheduleId: string }>();

  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [scheduleInfo, setScheduleInfo] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFaceScanCameraVisible, setIsFaceScanCameraVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [lateReasonModalVisible, setLateReasonModalVisible] = useState(false);
  const [lateReasonText, setLateReasonText] = useState("");
  const [lateReasonStudentId, setLateReasonStudentId] = useState<number | null>(null);
  const [lateReasons, setLateReasons] = useState<Record<number, string>>({});

  const handleVerificationSuccess = (verifiedStudentId: number) => {
    Toast.show({
      type: "success",
      text1: "Xác thực thành công!",
      text2: `Đã điểm danh sinh viên.`,
    });
    updateStatus(verifiedStudentId, 1); // 1: Có mặt
    setSelectedStudent(null);
  };

  const handleLateRadio = (studentId: number) => {
    setLateReasonStudentId(studentId);
    setLateReasonModalVisible(true);
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

        const mapStatus = (rawStatus: any): 1 | 2 | 3 => {
          // Nếu backend trả số
          if (rawStatus === 1) return 1; // Có mặt
          if (rawStatus === 2) return 2; // Đi muộn
          if (rawStatus === 3) return 3; // Vắng mặt
          // Nếu backend trả string
          if (rawStatus === "Đang học" || rawStatus === 0) return 1;
          if (rawStatus === "Đi muộn") return 2;
          if (rawStatus === "Vắng mặt") return 3;
          // Mặc định
          return 3;
        };

        // Ensure studentData is an array and filter out invalid entries
        if (Array.isArray(studentData)) {
          const initialStudents: StudentAttendance[] = studentData
            .filter((response: any) => response?.student)
            .map((response: { student: Student; status?: any; note?: string | null }) => ({
              student: response.student,
              status: mapStatus(response.status),
              note: response.note ?? null,
            }));
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
      <TouchableOpacity onPress={() => router.replace('/(tabs)/CalendarScreen')}>
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
          value={countByStatus(1)}
          color="#43A047"
          icon={<Ionicons name="checkmark-circle" size={24} color="#43A047" />}
        />
        <StatBox
          label="Đi muộn"
          value={countByStatus(2)}
          color="#FBC02D"
          icon={<MaterialIcons name="access-time" size={24} color="#FBC02D" />}
        />
        <StatBox
          label="Vắng mặt"
          value={countByStatus(3)}
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
          if (!item?.student) return null;
          return (
            <View style={styles.studentCard}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.student.name}</Text>
                <Text style={styles.id}>MSSV: {item.student.studentId}</Text>
                <View style={styles.radioRow}>
                  {renderRadio(
                    item.student.id,
                    1,
                    item.status,
                    updateStatus,
                    "Có mặt"
                  )}
                  {renderRadio(
                    item.student.id,
                    2,
                    item.status,
                    (id) => handleLateRadio(id),
                    "Đi muộn"
                  )}
                  {renderRadio(
                    item.student.id,
                    3,
                    item.status,
                    updateStatus,
                    "Vắng mặt"
                  )}
                </View>
                {lateReasons[item.student.id] && (
                  <Text style={{ color: '#F9A825', fontSize: 12, marginTop: 2 }}>
                    Lý do đi muộn: {lateReasons[item.student.id]}
                  </Text>
                )}
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

      <Modal
        visible={lateReasonModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setLateReasonModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập lý do đi muộn</Text>
            <View style={styles.modalInputWrapper}>
              <Text style={styles.modalLabel}>Lý do:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nhập lý do tại đây..."
                value={lateReasonText}
                onChangeText={setLateReasonText}
                multiline
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  if (lateReasonStudentId !== null) {
                    setLateReasons((prev) => ({
                      ...prev,
                      [lateReasonStudentId]: lateReasonText,
                    }));
                    updateStatus(lateReasonStudentId, 2); // 2: Đi muộn
                  }
                  setLateReasonModalVisible(false);
                  setLateReasonText("");
                  setLateReasonStudentId(null);
                }}
              >
                <Text style={styles.modalButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => {
                  setLateReasonModalVisible(false);
                  setLateReasonText("");
                  setLateReasonStudentId(null);
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#C62828' }]}>Quay lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    case 1:
      return "Có mặt";
    case 2:
      return "Đi muộn";
    case 3:
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
    case 1:
      return { ...common, backgroundColor: "#F1F8E9", color: "#2E7D32" };
    case 2:
      return { ...common, backgroundColor: "#FFF9C4", color: "#F9A825" };
    case 3:
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInputWrapper: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  modalInput: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#2E7D32',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalCancel: {
    backgroundColor: '#eee',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
