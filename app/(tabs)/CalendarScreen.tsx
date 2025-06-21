import { getScheduleTeacher } from "@/service/schedule/schedule.api";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Schedule } from "@/models/Schedule";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const scheduleData = await getScheduleTeacher(selectedDate, token || "");
        console.log(scheduleData);
        setSchedule(scheduleData || []); // Ensure schedule is always an array
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
        setSchedule([]); // Reset on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [selectedDate]);

  const renderScheduleItem = ({ item }: { item: Schedule }) => (
    <View style={styles.classItemContainer}>
      {/* --- Timeline Column --- */}
      <View style={styles.timelineColumn}>
        <View style={styles.slotContainer}>
          <Text style={styles.slotText}>Slot: {item.shift.id}</Text>
        </View>
        <View style={styles.timeline}>
          <Text style={styles.timeText}>{item.shift.startTime.substring(0, 5)}</Text>
          <View style={styles.timelineLine} />
          <Text style={styles.timeText}>{item.shift.endTime.substring(0, 5)}</Text>
        </View>
      </View>

      {/* --- Details Column --- */}
      <View style={styles.detailsColumn}>
        <Text style={styles.roomText}>Room: {item.classroom.name}</Text>
        <Text style={styles.subjectText}>Subject Code: {item.module.code}</Text>
        <Text style={styles.infoText}>Group class: {item.class.name}</Text>
        <Text style={styles.infoText}>Lecturer: {item.teacher.name}</Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, styles.presentButton]}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/ClassDetailScreen",
                params: { scheduleId: item.id.toString() },
              })
            }>
            <Text style={styles.buttonText}>Điểm danh</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: "#007BFF" },
          }}
          theme={{
            todayTextColor: "#007BFF",
            arrowColor: "#007BFF",
            selectedDayTextColor: '#ffffff',
          }}
        />

        <View style={styles.scheduleContainer}>
          {schedule.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5
                name="calendar-times"
                size={64}
                color="#ccc"
                style={{ opacity: 0.3 }}
              />
              <Text style={styles.noClass}>
                Không có lịch học trong ngày này
              </Text>
            </View>
          ) : (
            <View style={styles.dayContainer}>
              {/* --- Date Column --- */}
              <View style={styles.dateColumn}>
                <Text style={styles.dateText}>
                  {dayjs(selectedDate).format("D/M")}
                </Text>
                <Text style={styles.dayText}>
                  {dayjs(selectedDate).format("ddd")}
                </Text>
              </View>

              {/* --- Class List Column --- */}
              <FlatList
                data={schedule}
                keyExtractor={(item) => item.module.code + item.shift.id}
                renderItem={renderScheduleItem}
                ItemSeparatorComponent={() => (
                  <View style={styles.itemSeparator} />
                )}
                style={styles.classList}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: "#007BFF" },
        }}
        theme={{
          todayTextColor: "#007BFF",
          arrowColor: "#007BFF",
          selectedDayTextColor: '#ffffff',
        }}
      />

      <View style={styles.scheduleContainer}>
        {schedule.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5
              name="calendar-times"
              size={64}
              color="#ccc"
              style={{ opacity: 0.3 }}
            />
            <Text style={styles.noClass}>
              Không có lịch học trong ngày này
            </Text>
          </View>
        ) : (
          <View style={styles.dayContainer}>
            {/* --- Date Column --- */}
            <View style={styles.dateColumn}>
              <Text style={styles.dateText}>
                {dayjs(selectedDate).format("D/M")}
              </Text>
              <Text style={styles.dayText}>
                {dayjs(selectedDate).format("ddd")}
              </Text>
            </View>

            {/* --- Class List Column --- */}
            <FlatList
              data={schedule}
              keyExtractor={(item) => item.module.code + item.shift.id}
              renderItem={renderScheduleItem}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
              style={styles.classList}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scheduleContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 10,
  },
  dayContainer: {
    flex: 1,
    flexDirection: "row",
  },
  classList: {
    flex: 1,
  },
  dateColumn: {
    width: 60,
    alignItems: "center",
    paddingTop: 15,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  dateText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  dayText: {
    fontSize: 14,
    color: "#007BFF",
  },
  classItemContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
  },
  timelineColumn: {
    width: 70,
    alignItems: "center",
  },
  slotContainer: {
    position: 'absolute',
    left: -25,
    top:35,
    transform: [{ rotate: '-90deg' }],
    backgroundColor: '#F0F0F0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  slotText: {
    fontSize: 12,
    color: "#333",
    fontWeight: 'bold',
  },
  timeline: {
    paddingTop: 8,
    paddingLeft:20,
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  timelineLine: {
    width: 1,
    height: 50,
    backgroundColor: "#999",
    marginVertical: 4,
  },
  detailsColumn: {
    flex: 1,
    marginLeft: 10,
  },
  roomText: {
    fontWeight: "bold",
    color: "#8B4513",
    fontSize: 16,
  },
  subjectText: {
    fontWeight: "bold",
    color: "#00008B",
    fontSize: 16,
    marginVertical: 2,
  },
  infoText: {
    color: "#555",
    fontSize: 13,
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 10,
  },
  presentButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  daySeparator: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noClass: {
    fontSize: 16,
    marginTop: 10,
    color: "#999",
    textAlign: "center",
  },
});
