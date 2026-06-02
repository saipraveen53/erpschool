import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  Bell,
  Bus,
  Calendar,
  CheckCircle,
  Clock,
  Fuel,
  LogOut,
  MapPin,
  Navigation,
  Play,
  Square,
  User,
  UserCheck,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import {
  endTrip,
  getBusCapacity,
  getDriverAlerts,
  getDriverRoute,
  getDriverStudents,
  getTodaySchedule,
  startTrip,
  syncOfflineQueue,
} from "../../services/driverService";
import { getUnreadCountForRole } from "../../services/notificationService";

export default function DriverDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [schedule, setSchedule] = useState({ pickup: "", drop: "" });
  const [onboardCount, setOnboardCount] = useState(0);
  const [busCapacity, setBusCapacity] = useState(32);
  const [tripActive, setTripActive] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const menuItems = [
    { title: "Assigned Route", icon: <MapPin size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/routes/assigned"), bgColor: "#fff" },
    { title: "Student Pickup List", icon: <Users size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/students/pickup-list"), bgColor: "#fff" },
    { title: "Attendance", icon: <UserCheck size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/attendance/confirmation"), bgColor: "#fff" },
    { title: "Live GPS", icon: <Navigation size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/tracking/gps"), bgColor: "#fff" },
    { title: "Vehicle Report", icon: <Bus size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/vehicle/reporting"), bgColor: "#fff" },
    { title: "Emergency", icon: <AlertTriangle size={24} color="#ff4b00" />, onPress: () => router.push("/(dashboard)/driver/alerts/emergency"), bgColor: "#fff" },
    { title: "Inspection", icon: <CheckCircle size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/inspection"), bgColor: "#fff" },
    { title: "Fuel Tracking", icon: <Fuel size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/fuel-tracking"), bgColor: "#fff" },
    { title: "My Profile", icon: <User size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/profile"), bgColor: "#fff" },
  ];

  const columns = isWeb ? (width >= 1024 ? 4 : width >= 768 ? 3 : 2) : 2;
  const cardWidth = `${(100 / columns) - 2}%`;

  const loadData = async () => {
    try {
      const [routeData, studentsData, alertsData, scheduleData, capacityData] = await Promise.all([
        getDriverRoute(), getDriverStudents(), getDriverAlerts(), getTodaySchedule(), getBusCapacity()
      ]);
      setRoute(routeData);
      setStudentCount(studentsData.length);
      setAlerts(alertsData);
      setSchedule(scheduleData);
      setOnboardCount(studentsData.filter(s => s.status === "picked").length);
      setBusCapacity(capacityData.capacity);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (user?.role) {
      const count = await getUnreadCountForRole(user.role);
      setUnreadCount(count);
    }
  };

  useEffect(() => {
    loadData();
    syncOfflineQueue();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [user])
  );

  useEffect(() => {
    if (!loading && !error) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [loading, error]);

  const handleStartTrip = async () => {
    if (silentMode) {
      Alert.alert("Silent Mode", "Please disable silent mode to start trip");
      return;
    }
    await startTrip();
    setTripActive(true);
    Alert.alert("Trip Started", "Live tracking now active");
  };

  const handleEndTrip = async () => {
    await endTrip();
    setTripActive(false);
    Alert.alert("Trip Ended", "Thank you for driving safely");
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) return <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;
  if (error) return <SafeAreaView style={styles.loadingContainer}><Text>{error}</Text><TouchableOpacity onPress={loadData} style={styles.retryBtn}><Text>Retry</Text></TouchableOpacity></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
        contentContainerStyle={isWeb && { maxWidth: 1200, alignSelf: "center", width: "100%" }}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.fullName || user?.username || "Driver"}!</Text>
            <Text style={styles.subGreeting}>Welcome to your dashboard</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push("/(dashboard)/common/notifications")} style={styles.notifIcon}>
              <Bell size={24} color="#0065ea" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={22} color="#0065ea" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.silentModeRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {silentMode ? <VolumeX size={20} color="#0065ea" /> : <Volume2 size={20} color="#0065ea" />}
            <Text style={styles.silentModeLabel}>Silent Mode (no inputs while driving)</Text>
          </View>
          <Switch
            value={silentMode}
            onValueChange={setSilentMode}
            trackColor={{ false: "#e2e8f0", true: "#0065ea" }}
            thumbColor={silentMode ? "#fff" : "#ff4b00"}
          />
        </View>

        <View style={styles.capacityCard}>
          <Text style={styles.capacityTitle}>Onboard Students</Text>
          <Text style={styles.capacityValue}>{onboardCount} / {busCapacity}</Text>
          <View style={styles.capacityBar}>
            <View style={[styles.capacityFill, { width: `${(onboardCount / busCapacity) * 100}%`, backgroundColor: "#0065ea" }]} />
          </View>
        </View>

        <View style={styles.tripButtons}>
          {!tripActive ? (
            <TouchableOpacity style={styles.startTripBtn} onPress={handleStartTrip}>
              <Play size={20} color="white" /><Text style={styles.tripBtnText}>Start Trip</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.endTripBtn} onPress={handleEndTrip}>
              <Square size={20} color="white" /><Text style={styles.tripBtnText}>End Trip</Text>
            </TouchableOpacity>
          )}
        </View>

        <Animated.View style={[styles.scheduleCard, { opacity: fadeAnim }]}>
          <View style={styles.scheduleHeader}>
            <Calendar size={20} color="#0065ea" />
            <Text style={styles.scheduleTitle}>Today's Schedule</Text>
          </View>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <Clock size={18} color="#0065ea" />
              <Text style={styles.scheduleLabel}>Pickup</Text>
              <Text style={styles.scheduleValue}>{schedule.pickup}</Text>
            </View>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleItem}>
              <Clock size={18} color="#0065ea" />
              <Text style={styles.scheduleLabel}>Drop</Text>
              <Text style={styles.scheduleValue}>{schedule.drop}</Text>
            </View>
          </View>
        </Animated.View>

        {route && (
          <Animated.View style={[styles.routeCard, { opacity: fadeAnim }]}>
            <View style={styles.routeHeader}>
              <Bus size={20} color="#fff" />
              <Text style={styles.routeTitle}>Assigned Route</Text>
              <TouchableOpacity onPress={() => router.push("/(dashboard)/driver/routes/assigned")}>
                <Text style={styles.viewAllBtn}>View</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.routeName}>{route.name}</Text>
            <View style={styles.routeStats}>
              <View style={styles.routeStat}>
                <Users size={16} color="#fff" />
                <Text style={styles.routeStatText}>{studentCount} Students</Text>
              </View>
              <View style={styles.routeStat}>
                <MapPin size={16} color="#fff" />
                <Text style={styles.routeStatText}>{route.distance}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={[styles.gridContainer, isWeb && styles.gridContainerWeb]}>
          {menuItems.map((item, index) => (
            <View key={index} style={{ width: cardWidth, marginBottom: 12 }}>
              <TouchableOpacity style={[styles.menuCard, { backgroundColor: item.bgColor }]} onPress={item.onPress}>
                {item.icon}
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Animated.View style={[styles.alertsSection, { opacity: fadeAnim }]}>
          <View style={styles.alertsHeader}>
            <Bell size={20} color="#0065ea" />
            <Text style={styles.alertsTitle}>Recent Alerts</Text>
          </View>
          {alerts.map(alert => (
            <View key={alert.id} style={styles.alertCard}>
              <View style={[styles.alertDot, { backgroundColor: alert.type === "warning" ? "#ff4b00" : "#0065ea" }]} />
              <View style={styles.alertContent}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  retryBtn: { backgroundColor: "#0065ea", padding: 12, borderRadius: 8, marginTop: 16 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { fontSize: 24, fontWeight: "bold", color: "#0065ea" },
  subGreeting: { fontSize: 14, color: "#0065ea", marginTop: 4 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  notifIcon: { position: "relative", padding: 4 },
  logoutButton: { padding: 4 },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#ff4b00",
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "white", fontSize: 10, fontWeight: "bold" },
  silentModeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", margin: 16, padding: 12, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1 },
  silentModeLabel: { fontSize: 14, color: "#0065ea" },
  capacityCard: { backgroundColor: "#fff", marginHorizontal: 16, padding: 16, borderRadius: 16 },
  capacityTitle: { fontSize: 14, fontWeight: "500", color: "#0065ea" },
  capacityValue: { fontSize: 28, fontWeight: "bold", color: "#0065ea", marginVertical: 4 },
  capacityBar: { height: 8, backgroundColor: "#e2e8f0", borderRadius: 4, overflow: "hidden" },
  capacityFill: { height: "100%", backgroundColor: "#0065ea" },
  tripButtons: { marginHorizontal: 16, marginTop: 8 },
  startTripBtn: { backgroundColor: "#00a652", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, borderRadius: 12, gap: 8 },
  endTripBtn: { backgroundColor: "#ff4b00", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, borderRadius: 12, gap: 8 },
  tripBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
  scheduleCard: { backgroundColor: "#fff", margin: 16, padding: 16, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05 },
  scheduleHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  scheduleTitle: { fontSize: 16, fontWeight: "600", color: "#0065ea" },
  scheduleRow: { flexDirection: "row", justifyContent: "space-around" },
  scheduleItem: { alignItems: "center", flex: 1 },
  scheduleLabel: { fontSize: 12, color: "#0065ea", marginTop: 4 },
  scheduleValue: { fontSize: 16, fontWeight: "bold", color: "#0065ea", marginTop: 2 },
  scheduleDivider: { width: 1, backgroundColor: "#e2e8f0" },
  routeCard: { backgroundColor: "#0065ea", marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 16 },
  routeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  routeTitle: { fontSize: 16, fontWeight: "600", color: "#fff", marginLeft: 8, flex: 1 },
  viewAllBtn: { color: "#fff", fontSize: 14 },
  routeName: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 12 },
  routeStats: { flexDirection: "row", gap: 16, marginTop: 12 },
  routeStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  routeStatText: { color: "#fff", fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea", marginHorizontal: 16, marginTop: 24, marginBottom: 12 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 12 },
  gridContainerWeb: { maxWidth: 1200, alignSelf: "center", width: "100%" },
  menuCard: { backgroundColor: "#fff", padding: 16, borderRadius: 16, alignItems: "center", gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1 },
  menuTitle: { fontSize: 14, fontWeight: "600", color: "#0065ea" },
  alertsSection: { backgroundColor: "#fff", margin: 16, padding: 16, borderRadius: 16 },
  alertsHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  alertsTitle: { fontSize: 16, fontWeight: "600", color: "#0065ea" },
  alertCard: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#fff" },
  alertDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  alertContent: { flex: 1 },
  alertMessage: { fontSize: 14, color: "#0065ea" },
  alertTime: { fontSize: 11, color: "#0065ea", marginTop: 2 },
});