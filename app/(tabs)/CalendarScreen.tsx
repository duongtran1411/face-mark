import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

type ClassItem = {
  subject: string;
  time: string;
  className: string;
  students: number;
  room: string;
};

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const teachingDays: Record<string, ClassItem[]> = {
    '2025-06-19': [
      { subject: 'Toán học', time: '07:30 - 09:00', className: '10A1', students: 35, room: 'B201' },
      { subject: 'Vật lý', time: '09:15 - 10:45', className: '11A2', students: 32, room: 'B202' },
      { subject: 'Toán học', time: '13:30 - 15:00', className: '12A1', students: 38, room: 'B203' },
    ],
  };

  const markedDates = Object.keys(teachingDays).reduce((acc, date) => {
    acc[date] = {
      customStyles: {
        container: {
          backgroundColor: date === selectedDate ? '#A5D6A7' : undefined,
        },
        text: {
          color: '#000',
        },
        // Gạch ngang hiển thị dưới số ngày
        marked: true,
      },
    };

    return acc;
  }, {} as Record<string, any>);

  const classList = teachingDays[selectedDate] || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>📘 Hệ thống điểm danh học sinh</Text>
        <TouchableOpacity >
          <Ionicons name="log-out-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <Calendar
        markingType="custom"
        markedDates={Object.keys(teachingDays).reduce((acc, date) => {
          const isSelected = date === selectedDate;
          acc[date] = {
            customStyles: {
              container: {
                backgroundColor: isSelected ? '#A5D6A7' : 'transparent',
                borderBottomWidth: isSelected ? 0 : 2,
                borderBottomColor: '#4CAF50',
              },
              text: {
                color: isSelected ? '#fff' : '#000',
              },
            },
          };
          return acc;
        }, {} as Record<string, any>)}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: '#4CAF50',
          todayTextColor: '#4CAF50',
          arrowColor: '#4CAF50',
        }}
      />



      {/* Date Title */}
      <Text style={styles.title}>
        📅 Lịch học ngày {dayjs(selectedDate).format('DD/MM/YYYY')}
      </Text>

      {/* Class List */}
      {classList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="calendar-times" size={64} color="#ccc" style={{ opacity: 0.3 }} />
          <Text style={styles.noClass}>Không có lớp học nào trong ngày này</Text>
        </View>) : (
        <FlatList
          data={classList}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/ClassDetailScreen',
                  params: {
                    className: item.className,
                    subject: item.subject,
                    time: item.time,
                    room: item.room,
                    date: dayjs(selectedDate).format('DD/MM/YYYY'),
                  },
                })
              }>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.subject}>{item.subject}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.detail}>
                    <FontAwesome5 name="chalkboard-teacher" size={14} /> Lớp: {item.className} ({item.students} học sinh)
                  </Text>
                  <Text style={styles.detail}>
                    <FontAwesome5 name="school" size={14} /> Phòng: {item.room}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    height: 50
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',

  },
  title: { fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#2E7D32' },
  card: {
    marginTop: 14,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subject: { fontSize: 18, fontWeight: '600', color: '#1B5E20' },
  time: {
    fontSize: 13,
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#004D40',
    fontWeight: 'bold',
  },
  cardContent: { marginTop: 4 },
  detail: {
    fontSize: 14,
    color: '#424242',
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  noClass: {
    fontSize: 16,
    marginTop: 10,
    color: '#999',
    textAlign: 'center',
  },
});
