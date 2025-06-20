import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  Entypo,
} from '@expo/vector-icons';

type Student = {
  id: string;
  name: string;
  status: 'present' | 'late' | 'excused' | 'unexcused';
};

export default function ClassDetailScreen() {
  const router = useRouter();
  const { className, subject, time, room, date } = useLocalSearchParams<{
    className: string;
    subject: string;
    time: string;
    room: string;
    date: string;
  }>();

  const [students, setStudents] = useState<Student[]>([
    { id: 'SV001', name: 'Nguyễn Văn An', status: 'present' },
    { id: 'SV002', name: 'Trần Thị Bình', status: 'present' },
    { id: 'SV003', name: 'Lê Văn Cường', status: 'late' },
    { id: 'SV004', name: 'Phạm Thị Dung', status: 'excused' },
    { id: 'SV005', name: 'Hoàng Thị Hà', status: 'unexcused' },
    { id: 'SV006', name: 'Ngô Văn Minh', status: 'present' },
    { id: 'SV007', name: 'Lê Thị Thu', status: 'present' },
    { id: 'SV008', name: 'Trịnh Văn Nam', status: 'present' },
  ]);

  const updateStatus = (id: string, newStatus: Student['status']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const countByStatus = (status: Student['status']) =>
    students.filter((s) => s.status === status).length;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Điểm danh lớp {className}</Text>
      <Text style={styles.subtitle}>
        {subject} - {time} - Phòng {room}
      </Text>
      <Text style={styles.subtitle}>Ngày: {date}</Text>

      <View style={styles.statsRow}>
        <StatBox
          label="Tổng số"
          value={students.length}
          color="#1E88E5"
          icon={<FontAwesome name="users" size={24} color="#1E88E5" />}
        />
        <StatBox
          label="Có mặt"
          value={countByStatus('present')}
          color="#43A047"
          icon={<Ionicons name="checkmark-circle" size={24} color="#43A047" />}
        />
        <StatBox
          label="Đi muộn"
          value={countByStatus('late')}
          color="#FBC02D"
          icon={<MaterialIcons name="access-time" size={24} color="#FBC02D" />}
        />
        <StatBox
          label="Nghỉ CP"
          value={countByStatus('excused')}
          color="#1976D2"
          icon={<Ionicons name="book" size={24} color="#1976D2" />}
        />
        <StatBox
          label="Nghỉ KP"
          value={countByStatus('unexcused')}
          color="#D32F2F"
          icon={<FontAwesome name="times-circle" size={24} color="#D32F2F" />}
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.button}>
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentCard}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.id}>MSSV: {item.id}</Text>
              <View style={styles.radioRow}>
                {renderRadio(item.id, 'present', item.status, updateStatus, 'Có mặt')}
                {renderRadio(item.id, 'late', item.status, updateStatus, 'Đi muộn')}
                {renderRadio(item.id, 'excused', item.status, updateStatus, 'Nghỉ CP')}
                {renderRadio(item.id, 'unexcused', item.status, updateStatus, 'Nghỉ KP')}
              </View>
            </View>
            <View style={styles.statusTag}>
              <Text style={[styles.tagText, getStatusStyle(item.status)]}>
                {getStatusText(item.status)}
              </Text>
              <Ionicons name="camera" size={20} color="#777" style={{ marginTop: 4 }} />
            </View>
          </View>
        )}
      />
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
  id: string,
  value: Student['status'],
  current: Student['status'],
  update: (id: string, newStatus: Student['status']) => void,
  label: string
) {
  return (
    <Pressable
      onPress={() => update(id, value)}
      style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
      <View
        style={{
          height: 14,
          width: 14,
          borderRadius: 7,
          borderWidth: 2,
          borderColor: '#555',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 4,
        }}>
        {current === value && (
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D32' }} />
        )}
      </View>
      <Text style={{ fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

function getStatusText(status: Student['status']) {
  switch (status) {
    case 'present':
      return 'Có mặt';
    case 'late':
      return 'Đi muộn';
    case 'excused':
      return 'Nghỉ CP';
    case 'unexcused':
      return 'Nghỉ KP';
  }
}

function getStatusStyle(status: Student['status']) {
  const common = {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: 'bold' as const,
  };

  switch (status) {
    case 'present':
      return { ...common, backgroundColor: '#F1F8E9', color: '#2E7D32' };
    case 'late':
      return { ...common, backgroundColor: '#FFF9C4', color: '#F9A825' };
    case 'excused':
      return { ...common, backgroundColor: '#E3F2FD', color: '#1976D2' };
    case 'unexcused':
      return { ...common, backgroundColor: '#FFEBEE', color: '#C62828' };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  back: { color: '#2E7D32', marginBottom: 10, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32' },
  subtitle: { fontSize: 14, color: '#555' },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 10,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '30%',
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  statLabel: { fontSize: 13, color: '#333' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 10, marginVertical: 12 },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#263238',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  buttonSecondary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E0F2F1',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00796B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    color: '#00796B',
    fontWeight: 'bold',
  },
  sectionTitle: { marginVertical: 10, fontSize: 16, fontWeight: 'bold', color: '#1B5E20' },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  id: { fontSize: 14, color: '#555', marginBottom: 6 },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    marginTop: 4,
  },
  statusTag: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  tagText: { fontSize: 12 },
});
