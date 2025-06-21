import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function HomeScreen() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(tabs)/CalendarScreen'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Timetable</Text>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <Image style={styles.icon} source={require("../../assets/images/calendar-days.png")}/>
        <Text style={styles.label}>Weekly timetable</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
    tintColor: '#F59E0B', 
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
});
