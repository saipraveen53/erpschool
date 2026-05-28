import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    AlertTriangle,
    Bell,
    Bus,
    Calendar,
    Clock,
    MapPin,
    Navigation,
    UserCheck,
    Users,
} from "lucide-react-native";
import { useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";

// Mock data (same as original)
const assignedRoute = {
  id: "R-101",
  name: "Route 101 - East Zone",
  stops: [
    "Main School",
    "Raj Nagar",
    "Indira Colony",
    "Sai Nagar",
    "Shivaji Park",
  ],
  totalStudents: 32,
  distance: "24.5 km",
  estimatedTime: "1 hour 15 min",
};

const todaySchedule = {
  pickup: "7:30 AM",
  drop: "4:30 PM",
};

const recentAlerts = [
  {
    id: 1,
    message: "Traffic jam on Main Road",
    time: "10 min ago",
    type: "warning",
  },
  {
    id: 2,
    message: "Student reported absent - Rohan S.",
    time: "20 min ago",
    type: "info",
  },
];

export default function DriverDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const menuItems = [
    {
      title: "Assigned Route",
      icon: <MapPin size={24} color="#2563eb" />,
      description: "View your route and stops",
      onPress: () => router.push("/(dashboard)/driver/routes/assigned"),
      bgColor: "#dbeafe",
    },
    {
      title: "Student Pickup List",
      icon: <Users size={24} color="#16a34a" />,
      description: "View students on your route",
      onPress: () => router.push("/(dashboard)/driver/students/pickup-list"),
      bgColor: "#dcfce7",
    },
    {
      title: "Attendance Confirmation",
      icon: <UserCheck size={24} color="#ea580c" />,
      description: "Mark student pickup/drop",
      onPress: () => router.push("/(dashboard)/driver/attendance/confirmation"),
      bgColor: "#ffedd5",
    },
    {
      title: "Live GPS Tracking",
      icon: <Navigation size={24} color="#7c3aed" />,
      description: "Share live location",
      onPress: () => router.push("/(dashboard)/driver/tracking/gps"),
      bgColor: "#ede9fe",
    },
    {
      title: "Vehicle Reporting",
      icon: <Bus size={24} color="#dc2626" />,
      description: "Report issues or maintenance",
      onPress: () => router.push("/(dashboard)/driver/vehicle/reporting"),
      bgColor: "#fee2e2",
    },
    {
      title: "Emergency Alert",
      icon: <AlertTriangle size={24} color="#b91c1c" />,
      description: "Send emergency alert",
      onPress: () => router.push("/(dashboard)/driver/alerts/emergency"),
      bgColor: "#fecaca",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name || "Driver"}!</Text>
          <Text style={styles.subGreeting}>Welcome to your dashboard</Text>
        </View>

        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Calendar size={20} color="#2563eb" />
            <Text style={styles.scheduleTitle}>Today's Schedule</Text>
          </View>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <Clock size={18} color="#6b7280" />
              <Text style={styles.scheduleLabel}>Pickup Time</Text>
              <Text style={styles.scheduleValue}>{todaySchedule.pickup}</Text>
            </View>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleItem}>
              <Clock size={18} color="#6b7280" />
              <Text style={styles.scheduleLabel}>Drop Time</Text>
              <Text style={styles.scheduleValue}>{todaySchedule.drop}</Text>
            </View>
          </View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <Bus size={20} color="#ffffff" />
            <Text style={styles.routeTitle}>Assigned Route</Text>
            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/driver/routes/assigned")}
            >
              <Text style={styles.viewAllBtn}>View</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.routeName}>{assignedRoute.name}</Text>
          <View style={styles.routeStats}>
            <View style={styles.routeStat}>
              <Users size={16} color="#bfdbfe" />
              <Text style={styles.routeStatText}>
                {assignedRoute.totalStudents} Students
              </Text>
            </View>
            <View style={styles.routeStat}>
              <MapPin size={16} color="#bfdbfe" />
              <Text style={styles.routeStatText}>{assignedRoute.distance}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <View
                style={[styles.menuIcon, { backgroundColor: item.bgColor }]}
              >
                {item.icon}
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.alertsSection}>
          <View style={styles.alertsHeader}>
            <Bell size={20} color="#111827" />
            <Text style={styles.alertsTitle}>Recent Alerts</Text>
          </View>
          {recentAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <View
                style={[
                  styles.alertDot,
                  {
                    backgroundColor:
                      alert.type === "warning" ? "#f59e0b" : "#3b82f6",
                  },
                ]}
              />
              <View style={styles.alertContent}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  greeting: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  subGreeting: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  scheduleCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  scheduleRow: { flexDirection: "row", justifyContent: "space-around" },
  scheduleItem: { alignItems: "center", flex: 1 },
  scheduleLabel: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  scheduleValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 2,
  },
  scheduleDivider: { width: 1, backgroundColor: "#e5e7eb" },
  routeCard: {
    backgroundColor: "#2563eb",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
    flex: 1,
  },
  viewAllBtn: { color: "#bfdbfe", fontSize: 14, fontWeight: "500" },
  routeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 12,
  },
  routeStats: { flexDirection: "row", marginTop: 12, gap: 16 },
  routeStat: { flexDirection: "row", alignItems: "center" },
  routeStatText: { color: "#bfdbfe", fontSize: 12, marginLeft: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  menuCard: {
    backgroundColor: "#ffffff",
    width: "48%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  menuDescription: { fontSize: 11, color: "#6b7280", lineHeight: 14 },
  alertsSection: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
  },
  alertsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  alertsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  alertDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  alertContent: { flex: 1 },
  alertMessage: { fontSize: 14, color: "#111827" },
  alertTime: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
});
