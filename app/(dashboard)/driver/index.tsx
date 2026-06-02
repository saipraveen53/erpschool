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
    { title: "Assigned Route", icon: <MapPin size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/routes/assigned") },
    { title: "Student Pickup List", icon: <Users size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/students/pickup-list") },
    { title: "Attendance", icon: <UserCheck size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/attendance/confirmation") },
    { title: "Live GPS", icon: <Navigation size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/tracking/gps") },
    { title: "Vehicle Report", icon: <Bus size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/vehicle/reporting") },
    { title: "Emergency", icon: <AlertTriangle size={24} color="#ff4b00" />, onPress: () => router.push("/(dashboard)/driver/alerts/emergency") },
    { title: "Inspection", icon: <CheckCircle size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/inspection") },
    { title: "Fuel Tracking", icon: <Fuel size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/fuel-tracking") },
    { title: "My Profile", icon: <User size={24} color="#0065ea" />, onPress: () => router.push("/(dashboard)/driver/profile") },
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

  if (loading) return <SafeAreaView className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;
  if (error) return <SafeAreaView className="flex-1 justify-center items-center bg-white"><Text>{error}</Text><TouchableOpacity onPress={loadData} className="bg-[#0065ea] p-3 rounded-lg mt-4"><Text className="text-white">Retry</Text></TouchableOpacity></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
        contentContainerStyle={isWeb ? { maxWidth: 1200, alignSelf: "center", width: "100%" } : undefined}
      >
        <Animated.View className="px-5 pt-5 pb-3 bg-white border-b border-gray-100 flex-row justify-between items-center" style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View>
            <Text className="text-2xl font-bold text-[#0065ea]">Hello, {user?.fullName || user?.username || "Driver"}!</Text>
            <Text className="text-sm text-[#0065ea] mt-1">Welcome to your dashboard</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.push("/(dashboard)/common/notifications")} className="relative p-1">
              <Bell size={24} color="#0065ea" />
              {unreadCount > 0 && (
                <View className="absolute -top-1.5 -right-2 bg-[#ff4b00] rounded-full min-w-[18px] h-[18px] justify-center items-center px-1">
                  <Text className="text-white text-[10px] font-bold">{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} className="p-1">
              <LogOut size={22} color="#0065ea" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View className="flex-row justify-between items-center bg-white mx-4 my-4 p-3 rounded-xl shadow-sm">
          <View className="flex-row items-center gap-2">
            {silentMode ? <VolumeX size={20} color="#0065ea" /> : <Volume2 size={20} color="#0065ea" />}
            <Text className="text-sm text-[#0065ea]">Silent Mode (no inputs while driving)</Text>
          </View>
          <Switch
            value={silentMode}
            onValueChange={setSilentMode}
            trackColor={{ false: "#e2e8f0", true: "#0065ea" }}
            thumbColor={silentMode ? "#fff" : "#ff4b00"}
          />
        </View>

        <View className="bg-white mx-4 p-4 rounded-2xl">
          <Text className="text-sm font-medium text-[#0065ea]">Onboard Students</Text>
          <Text className="text-[28px] font-bold text-[#0065ea] my-1">{onboardCount} / {busCapacity}</Text>
          <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <View className="h-full bg-[#0065ea]" style={{ width: `${(onboardCount / busCapacity) * 100}%` }} />
          </View>
        </View>

        <View className="mx-4 mt-2">
          {!tripActive ? (
            <TouchableOpacity className="bg-[#00a652] flex-row items-center justify-center p-3.5 rounded-xl gap-2" onPress={handleStartTrip}>
              <Play size={20} color="white" /><Text className="text-white font-semibold text-base">Start Trip</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="bg-[#ff4b00] flex-row items-center justify-center p-3.5 rounded-xl gap-2" onPress={handleEndTrip}>
              <Square size={20} color="white" /><Text className="text-white font-semibold text-base">End Trip</Text>
            </TouchableOpacity>
          )}
        </View>

        <Animated.View className="bg-white mx-4 my-4 p-4 rounded-2xl shadow-sm" style={{ opacity: fadeAnim }}>
          <View className="flex-row items-center gap-2 mb-3">
            <Calendar size={20} color="#0065ea" />
            <Text className="text-base font-semibold text-[#0065ea]">Today's Schedule</Text>
          </View>
          <View className="flex-row justify-around">
            <View className="items-center flex-1">
              <Clock size={18} color="#0065ea" />
              <Text className="text-xs text-[#0065ea] mt-1">Pickup</Text>
              <Text className="text-base font-bold text-[#0065ea] mt-0.5">{schedule.pickup}</Text>
            </View>
            <View className="w-px bg-gray-100" />
            <View className="items-center flex-1">
              <Clock size={18} color="#0065ea" />
              <Text className="text-xs text-[#0065ea] mt-1">Drop</Text>
              <Text className="text-base font-bold text-[#0065ea] mt-0.5">{schedule.drop}</Text>
            </View>
          </View>
        </Animated.View>

        {route && (
          <Animated.View className="bg-[#0065ea] mx-4 mt-4 p-4 rounded-2xl" style={{ opacity: fadeAnim }}>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Bus size={20} color="#fff" />
                <Text className="text-base font-semibold text-white ml-2 flex-1">Assigned Route</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/(dashboard)/driver/routes/assigned")}>
                <Text className="text-white text-sm">View</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-lg font-bold text-white mt-3">{route.name}</Text>
            <View className="flex-row gap-4 mt-3">
              <View className="flex-row items-center gap-1">
                <Users size={16} color="#fff" />
                <Text className="text-white text-xs">{studentCount} Students</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MapPin size={16} color="#fff" />
                <Text className="text-white text-xs">{route.distance}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        <Text className="text-lg font-semibold text-[#0065ea] mx-4 mt-6 mb-3">Quick Actions</Text>
        <View className={`flex-row flex-wrap justify-between px-3 ${isWeb ? "max-w-5xl self-center w-full" : ""}`}>
          {menuItems.map((item, index) => (
            <View key={index} style={{ width: cardWidth, marginBottom: 12 }}>
              <TouchableOpacity className="bg-white p-4 rounded-2xl items-center gap-2 shadow-sm" onPress={item.onPress}>
                {item.icon}
                <Text className="text-sm font-semibold text-[#0065ea]">{item.title}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Animated.View className="bg-white mx-4 my-4 p-4 rounded-2xl" style={{ opacity: fadeAnim }}>
          <View className="flex-row items-center gap-2 mb-3">
            <Bell size={20} color="#0065ea" />
            <Text className="text-base font-semibold text-[#0065ea]">Recent Alerts</Text>
          </View>
          {alerts.map(alert => (
            <View key={alert.id} className="flex-row items-center py-3 border-b border-white">
              <View className={`w-2 h-2 rounded-full mr-3 ${alert.type === "warning" ? "bg-[#ff4b00]" : "bg-[#0065ea]"}`} />
              <View className="flex-1">
                <Text className="text-sm text-[#0065ea]">{alert.message}</Text>
                <Text className="text-[11px] text-[#0065ea] mt-0.5">{alert.time}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}