import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    Bus,
    Clock,
    MapPin,
    Navigation,
    Users,
} from "lucide-react-native";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const routeData = {
  name: "Route 101 - East Zone",
  busNumber: "AP 28 AB 1234",
  driverName: "Rajesh Kumar",
  totalStops: 8,
  totalStudents: 32,
  estimatedTime: "1 hour 15 min",
  distance: "24.5 km",
  stops: [
    {
      id: 1,
      name: "Main School",
      time: "7:30 AM",
      students: 0,
      type: "school",
    },
    { id: 2, name: "Raj Nagar", time: "7:45 AM", students: 8, type: "stop" },
    {
      id: 3,
      name: "Indira Colony",
      time: "7:55 AM",
      students: 6,
      type: "stop",
    },
    { id: 4, name: "Sai Nagar", time: "8:05 AM", students: 10, type: "stop" },
    { id: 5, name: "Shivaji Park", time: "8:15 AM", students: 8, type: "stop" },
  ],
};

export default function AssignedRoute() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assigned Route</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.routeInfoCard}>
          <Bus size={32} color="#2563eb" />
          <Text style={styles.routeName}>{routeData.name}</Text>
          <Text style={styles.routeDetail}>Bus: {routeData.busNumber}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={18} color="#6b7280" />
              <Text style={styles.statValue}>{routeData.totalStudents}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <MapPin size={18} color="#6b7280" />
              <Text style={styles.statValue}>{routeData.totalStops}</Text>
              <Text style={styles.statLabel}>Stops</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={18} color="#6b7280" />
              <Text style={styles.statValue}>{routeData.estimatedTime}</Text>
              <Text style={styles.statLabel}>Est. Time</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Route Stops</Text>
        {routeData.stops.map((stop, index) => (
          <View key={stop.id} style={styles.stopCard}>
            <View style={styles.stopNumber}>
              <Text style={styles.stopNumberText}>{index + 1}</Text>
              {index < routeData.stops.length - 1 && (
                <View style={styles.stopLine} />
              )}
            </View>
            <View style={styles.stopContent}>
              <View style={styles.stopHeader}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopTime}>{stop.time}</Text>
              </View>
              {stop.students > 0 && (
                <View style={styles.stopStudents}>
                  <Users size={14} color="#6b7280" />
                  <Text style={styles.stopStudentsText}>
                    {stop.students} students
                  </Text>
                </View>
              )}
              {stop.type === "school" && (
                <View style={styles.schoolBadge}>
                  <Text style={styles.schoolBadgeText}>School</Text>
                </View>
              )}
            </View>
            <Navigation size={20} color="#9ca3af" />
          </View>
        ))}

        <TouchableOpacity style={styles.startBtn}>
          <Navigation size={20} color="white" />
          <Text style={styles.startBtnText}>Start Navigation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  routeInfoCard: {
    backgroundColor: "#ffffff",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 12,
  },
  routeDetail: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  statItem: { alignItems: "center" },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  statLabel: { fontSize: 12, color: "#6b7280" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  stopCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  stopNumber: { width: 32, alignItems: "center", position: "relative" },
  stopNumberText: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    color: "#ffffff",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },
  stopLine: { width: 2, height: 40, backgroundColor: "#d1d5db", marginTop: 4 },
  stopContent: { flex: 1, marginLeft: 12 },
  stopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stopName: { fontSize: 16, fontWeight: "500", color: "#111827" },
  stopTime: { fontSize: 12, color: "#6b7280" },
  stopStudents: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  stopStudentsText: { fontSize: 12, color: "#6b7280", marginLeft: 4 },
  schoolBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  schoolBadgeText: { fontSize: 10, color: "#2563eb", fontWeight: "500" },
  startBtn: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  startBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
