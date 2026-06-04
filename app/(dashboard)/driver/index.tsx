import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Activity,
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
  Shield,
  Square,
  Star,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Volume2,
  VolumeX
} from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
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

const isWeb = Platform.OS === "web";

export default function DriverDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const [currentTime, setCurrentTime] = useState(new Date());

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState(null);
  const scrollViewRef = useRef(null);
  const [studentCount, setStudentCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [schedule, setSchedule] = useState({ pickup: "", drop: "" });
  const [onboardCount, setOnboardCount] = useState(0);
  const [busCapacity, setBusCapacity] = useState(32);
  const [tripActive, setTripActive] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showStatusBar, setShowStatusBar] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Bento card animations
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const card4Anim = useRef(new Animated.Value(0)).current;
  const card5Anim = useRef(new Animated.Value(0)).current;
  const card6Anim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Pulse animation for trip active indicator
  useEffect(() => {
    if (tripActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [tripActive]);

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const threshold = 80;
      const shouldShow = value > threshold;
      if (shouldShow !== showStatusBar) {
        setShowStatusBar(shouldShow);
      }
      Animated.spring(headerOpacity, {
        toValue: Math.min(value / 150, 1),
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }).start();
    });
    return () => scrollY.removeListener(listener);
  }, [showStatusBar]);

  // Native Bento Grid Menu Items - Light Theme
  const mobileMenuItems = [
    { title: "Pickup List", icon: <Users size={26} color="#fff" />, bg: ["#10b981", "#059669"], onPress: () => router.push("/(dashboard)/driver/students/pickup-list") },
    { title: "Attendance", icon: <UserCheck size={26} color="#fff" />, bg: ["#8b5cf6", "#7c3aed"], onPress: () => router.push("/(dashboard)/driver/attendance/confirmation") },
    { title: "Live GPS", icon: <Navigation size={26} color="#fff" />, bg: ["#ef4444", "#dc2626"], onPress: () => router.push("/(dashboard)/driver/tracking/gps") },
    { title: "Vehicle", icon: <Bus size={26} color="#fff" />, bg: ["#f59e0b", "#d97706"], onPress: () => router.push("/(dashboard)/driver/vehicle/reporting") },
    { title: "Emergency", icon: <AlertTriangle size={26} color="#fff" />, bg: ["#dc2626", "#b91c1c"], onPress: () => router.push("/(dashboard)/driver/alerts/emergency") },
    { title: "Fuel", icon: <Fuel size={26} color="#fff" />, bg: ["#6366f1", "#4f46e5"], onPress: () => router.push("/(dashboard)/driver/fuel-tracking") },
    { title: "Profile", icon: <User size={26} color="#fff" />, bg: ["#ec4899", "#db2777"], onPress: () => router.push("/(dashboard)/driver/profile") },
  ];

  // Web menu items (full list)
  const webMenuItems = [
    { title: "Assigned Route", icon: <MapPin size={24} color="#3b82f6" />, onPress: () => router.push("/(dashboard)/driver/routes/assigned") },
    { title: "Pickup List", icon: <Users size={24} color="#10b981" />, onPress: () => router.push("/(dashboard)/driver/students/pickup-list") },
    { title: "Attendance", icon: <UserCheck size={24} color="#8b5cf6" />, onPress: () => router.push("/(dashboard)/driver/attendance/confirmation") },
    { title: "Live GPS", icon: <Navigation size={24} color="#ef4444" />, onPress: () => router.push("/(dashboard)/driver/tracking/gps") },
    { title: "Vehicle Report", icon: <Bus size={24} color="#f59e0b" />, onPress: () => router.push("/(dashboard)/driver/vehicle/reporting") },
    { title: "Emergency", icon: <AlertTriangle size={24} color="#dc2626" />, onPress: () => router.push("/(dashboard)/driver/alerts/emergency") },
    { title: "Inspection", icon: <CheckCircle size={24} color="#06b6d4" />, onPress: () => router.push("/(dashboard)/driver/inspection") },
    { title: "Fuel Tracking", icon: <Fuel size={24} color="#6366f1" />, onPress: () => router.push("/(dashboard)/driver/fuel-tracking") },
    { title: "My Profile", icon: <User size={24} color="#ec4899" />, onPress: () => router.push("/(dashboard)/driver/profile") },
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
    if (!loading && !error && !isWeb) {
      // Staggered bento card entrance animations
      const cards = [card1Anim, card2Anim, card3Anim, card4Anim, card5Anim, card6Anim];
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ...cards.map((anim, i) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            delay: i * 80,
            useNativeDriver: true,
          })
        ),
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
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => logout() }
      ]
    );
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getGreeting = () => {
    const h = currentTime.getHours();
    return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
  };

  if (loading) {
    if (isWeb) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0065ea]"></div>
        </div>
      );
    }
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0065ea" />
      </SafeAreaView>
    );
  }

  if (error) {
    const retryBtn = (
      <button onClick={loadData} className="bg-[#0065ea] text-white px-5 py-2 rounded-lg font-semibold">
        Retry
      </button>
    );
    if (isWeb) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="bg-red-50 text-red-600 text-center mb-4 p-4 rounded-xl">{error}</div>
          {retryBtn}
        </div>
      );
    }
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>{error}</Text>
        <TouchableOpacity onPress={loadData} className="bg-[#0065ea] p-3 rounded-lg mt-4">
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // -------------------------------
  // WEB VERSION - WITH NOTIFICATION AND LOGOUT ICONS
  // -------------------------------
  if (isWeb) {
    return (
      <>
        <StatusBar style="dark" />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 overflow-y-auto">
          
          {/* Hero Banner with Online Image - School Bus with Children */}
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <img 
              src="https://thumbs.dreamstime.com/b/back-to-school-happy-child-study-park-near-school-bus-schoolboy-doing-homework-online-education-outdoor-back-to-school-happy-240588365.jpg"
              alt="School Bus with Children"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Notification and Logout Icons for Web - Top Right */}
            <div className="absolute top-5 right-5 flex items-center gap-3 z-10">
              {/* Notification Button */}
              <button
                onClick={() => router.push("/(dashboard)/common/notifications")}
                className="relative bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-200 rounded-full p-2.5 border border-white/30 shadow-lg"
              >
                <Bell size={22} color="white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-200 rounded-full p-2.5 border border-white/30 shadow-lg"
              >
                <LogOut size={22} color="white" />
              </button>
            </div>

            <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
              <div className="max-w-4xl">
                <p className="text-white text-sm font-medium mb-2 tracking-wide">
                  {formatDate()}
                </p>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                  Good {getGreeting()}, {user?.fullName || user?.username || "Driver"}!
                </h1>
                <p className="text-white text-base md:text-lg max-w-2xl">
                  Your dashboard shows real-time updates for your assigned route, student pickup status, and vehicle health.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                    <Clock size={14} color="white" />
                    <span className="text-white text-sm">{formatTime()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                    <Activity size={14} color="white" />
                    <span className="text-white text-sm">{tripActive ? '🟢 Trip Active' : '⚪ Trip Inactive'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Stats Row - Light Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Onboard Students</p>
                    <p className="text-3xl font-bold text-gray-800">{onboardCount} <span className="text-sm text-gray-400">/ {busCapacity}</span></p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users size={20} color="#3b82f6" />
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(onboardCount / busCapacity) * 100}%` }} />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Students</p>
                    <p className="text-3xl font-bold text-gray-800">{studentCount}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UserCheck size={20} color="#8b5cf6" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">✓ Assigned to your route</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Alerts</p>
                    <p className="text-3xl font-bold text-gray-800">{alerts.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={20} color="#f59e0b" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Require immediate attention</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Safety Score</p>
                    <p className="text-3xl font-bold text-green-600">98%</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield size={20} color="#10b981" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  <span className="text-xs text-gray-500 ml-1">Excellent</span>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Column - Schedule & Route Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Today's Schedule Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} color="white" />
                      <h2 className="text-white font-semibold">Today's Schedule</h2>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <Clock size={20} color="#3b82f6" className="mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Pickup Time</p>
                        <p className="text-xl font-bold text-[#0065ea]">{schedule.pickup || "08:00 AM"}</p>
                        <p className="text-xs text-green-600 mt-1">On Schedule</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <Clock size={20} color="#f97316" className="mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Drop Time</p>
                        <p className="text-xl font-bold text-orange-600">{schedule.drop || "04:00 PM"}</p>
                        <p className="text-xs text-green-600 mt-1">On Schedule</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Route Card */}
                {route && (
                  <div className="bg-gradient-to-r from-[#0065ea] to-[#0099ff] rounded-xl shadow-md overflow-hidden">
                    <div className="p-5 text-white">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 rounded-full p-2">
                            <MapPin size={18} color="white" />
                          </div>
                          <span className="text-white/80 text-sm">Current Route</span>
                        </div>
                        <span className="bg-white/20 rounded-full px-3 py-1 text-xs">
                          Active
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mt-3">{route.name}</h3>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Users size={14} color="white" />
                          <span>{studentCount} Students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} color="white" />
                          <span>{route.distance || "12 km"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} color="white" />
                          <span>Est. {route.estimatedTime || "45 min"}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push("/(dashboard)/driver/routes/assigned")}
                        className="mt-4 text-sm font-medium underline decoration-white/30 hover:decoration-white transition"
                      >
                        View Route Details →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Trip Control & Silent Mode */}
              <div className="space-y-6">
                {/* Trip Control Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-400 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Navigation size={18} color="white" />
                      <h2 className="text-white font-semibold">Trip Control</h2>
                    </div>
                  </div>
                  <div className="p-5">
                    {!tripActive ? (
                      <button
                        onClick={handleStartTrip}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                      >
                        <Play size={18} />
                        <span>Start Trip</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleEndTrip}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                      >
                        <Square size={18} />
                        <span>End Trip</span>
                      </button>
                    )}
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">
                        {tripActive ? "🟢 Trip is ACTIVE - Parents can track you" : "⚪ Trip is INACTIVE"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Silent Mode Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-5 py-3">
                    <div className="flex items-center gap-2">
                      {silentMode ? <VolumeX size={18} color="white" /> : <Volume2 size={18} color="white" />}
                      <h2 className="text-white font-semibold">Silent Mode</h2>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">No inputs while driving</p>
                        <p className="text-xs text-gray-500 mt-1">Prevents distractions</p>
                      </div>
                      <Switch
                        value={silentMode}
                        onValueChange={setSilentMode}
                        trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
                        thumbColor={silentMode ? "#fff" : "#f59e0b"}
                      />
                    </div>
                    {silentMode && (
                      <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                        <p className="text-xs text-amber-600 text-center">⚠️ Silent mode is ON - Some actions are restricted</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0065ea] to-[#0099ff] rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
                <TrendingUp size={18} color="#10b981" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {webMenuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.onPress}
                    className="bg-white p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-gray-100 transition-all duration-200">
                      {item.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-[#0065ea] transition-colors duration-200">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Alerts Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={18} color="white" />
                    <h2 className="text-white font-semibold">Recent Alerts</h2>
                  </div>
                  <span className="bg-white/20 rounded-full px-2 py-0.5 text-white text-xs">{alerts.length}</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=80" 
                      alt="No alerts" 
                      className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                    />
                    <p className="text-gray-500">No alerts at this time</p>
                    <p className="text-xs text-gray-400 mt-1">All systems are running smoothly</p>
                  </div>
                ) : (
                  alerts.map((alert, idx) => (
                    <div key={alert.id} className="flex items-start p-4 hover:bg-gray-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${alert.type === "warning" ? "bg-red-500" : "bg-blue-500"}`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={10} className="text-gray-400" />
                          <p className="text-xs text-gray-400">{alert.time}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${alert.type === "warning" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                        {alert.type === "warning" ? "Urgent" : "Info"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center py-4 border-t border-gray-200">
              <p className="text-xs text-gray-400">© 2026 Transport Management System | Driver Dashboard</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <img 
                  src="https://images.unsplash.com/photo-1521791055366-0d553872125f?w=50&q=80" 
                  alt="Secure" 
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-xs text-gray-400">Secure Connection</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // -------------------------------
  // NATIVE VERSION (Android/iOS) - LIGHT THEME BENTO GRID
  // -------------------------------

  const BentoCard = ({ anim, children, style = {} }) => (
    <Animated.View
      style={[
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <StatusBar
        style={showStatusBar ? "dark" : "light"}
        translucent={true}
        backgroundColor="transparent"
        barStyle={showStatusBar ? "dark-content" : "light-content"}
      />

      {/* Animated Sticky Header - Light Theme */}
      <Animated.View
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
          opacity: headerOpacity,
          transform: [{ translateY: headerOpacity.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          backgroundColor: headerOpacity.interpolate({ inputRange: [0, 1], outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,0.97)"] }),
          paddingTop: 44, paddingBottom: 12, paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#0065ea", letterSpacing: 0.3 }}>
              Hey, {user?.fullName?.split(' ')[0] || "Driver"}
            </Text>
            <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>{formatTime()}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <TouchableOpacity onPress={() => router.push("/(dashboard)/common/notifications")} style={{ position: "relative", padding: 4 }}>
              <Bell size={22} color="#0065ea" />
              {unreadCount > 0 && (
                <View style={{
                  position: "absolute", top: 0, right: 0,
                  backgroundColor: "#ff4b00", borderRadius: 9, minWidth: 17, height: 17,
                  justifyContent: "center", alignItems: "center", paddingHorizontal: 3,
                }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={{ padding: 4 }}>
              <LogOut size={20} color="#0065ea" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Main Scroll */}
      <ScrollView
        ref={scrollViewRef}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#0065ea" />}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          scrollY.setValue(offsetY);
        }}
        scrollEventThrottle={16}
      >

        {/* ─── HERO SECTION ─── */}
        <View style={{ height: 320, width: "100%", position: "relative" }}>
          <Image
            source={{ uri: "https://thumbs.dreamstime.com/b/back-to-school-happy-child-study-park-near-school-bus-schoolboy-doing-homework-online-education-outdoor-back-to-school-happy-240588365.jpg" }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          {/* Light overlay */}
          <View style={{
            position: "absolute", inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
          }} />

          {/* Hero content */}
          <View style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tripActive ? "#00a652" : "#9ca3af" }} />
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>
                {tripActive ? "Live · Trip Active" : "Trip Inactive"}
              </Text>
            </View>
            <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800", letterSpacing: -0.5 }}>
              Good {getGreeting()},{"\n"}{user?.fullName?.split(' ')[0] || "Driver"}!
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 }}>
              {formatDate()}
            </Text>
          </View>

          {/* Notification and Logout Icons - Top Right for Mobile */}
          <View style={{ position: "absolute", top: 50, right: 20, flexDirection: "row", gap: 14 }}>
            {/* Notification Button */}
            <Pressable
              onPress={() => router.push("/(dashboard)/common/notifications")}
              android_ripple={{ color: "rgba(255,255,255,0.3)", borderless: false, radius: 40 }}
              style={{
                borderWidth: 1.5,
                borderColor: "rgba(255,255,255,0.4)",
                borderRadius: 22,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 6,
                paddingHorizontal: 16, 
                paddingVertical: 9,
                flexDirection: "row", 
                alignItems: "center", 
                gap: 8,
                backgroundColor: "rgba(255,255,255,0.25)",
              }}
            >
              <Bell size={24} color="#fff" />
              {unreadCount > 0 && (
                <View style={{
                  backgroundColor: "#ff4b00", borderRadius: 8,
                  minWidth: 16, height: 16, justifyContent: "center", alignItems: "center", paddingHorizontal: 3,
                }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
            </Pressable>

            {/* Logout Button */}
            <Pressable
              onPress={handleLogout}
              android_ripple={{ color: "rgba(255,255,255,0.3)", borderless: false, radius: 40 }}
              style={{
                borderWidth: 1.5,
                borderColor: "rgba(255,255,255,0.4)",
                borderRadius: 22,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 6,
                paddingHorizontal: 16, 
                paddingVertical: 9,
                backgroundColor: "rgba(255,255,255,0.25)",
              }}
            >
              <LogOut size={24} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* ─── BENTO GRID SECTION ─── */}
        <View style={{ paddingHorizontal: 14, paddingTop: 16 }}>

          {/* ── ROW 1: TRIP CONTROL (full width) ── */}
          <BentoCard anim={card1Anim} style={{ marginBottom: 10 }}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={tripActive ? handleEndTrip : handleStartTrip}
              style={{
                borderRadius: 24,
                overflow: "hidden",
                backgroundColor: tripActive ? "#fef2f2" : "#f0fdf4",
                borderWidth: 1,
                borderColor: tripActive ? "rgba(255,75,0,0.2)" : "rgba(0,166,82,0.2)",
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                      <View style={{
                        width: 10, height: 10, borderRadius: 5,
                        backgroundColor: tripActive ? "#ff4b00" : "#00a652",
                        shadowColor: tripActive ? "#ff4b00" : "#00a652",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.3, shadowRadius: 4, elevation: 2,
                      }} />
                    </Animated.View>
                    <Text style={{ color: tripActive ? "#dc2626" : "#059669", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" }}>
                      {tripActive ? "Trip Running" : "Ready to Drive"}
                    </Text>
                  </View>
                  <Text style={{ color: "#1f2937", fontSize: 22, fontWeight: "800" }}>
                    {tripActive ? "End Trip" : "Start Trip"}
                  </Text>
                  <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                    {tripActive ? "Tap to stop live tracking" : "Tap to begin live tracking"}
                  </Text>
                </View>
                <View style={{
                  width: 56, height: 56, borderRadius: 28,
                  backgroundColor: tripActive ? "rgba(255,75,0,0.1)" : "rgba(0,166,82,0.1)",
                  justifyContent: "center", alignItems: "center",
                  borderWidth: 1.5,
                  borderColor: tripActive ? "rgba(255,75,0,0.3)" : "rgba(0,166,82,0.3)",
                }}>
                  {tripActive
                    ? <Square size={24} color="#ff4b00" />
                    : <Play size={24} color="#00a652" />
                  }
                </View>
              </View>
            </TouchableOpacity>
          </BentoCard>

          {/* ── ROW 2: STATS (2 cards) ── */}
          <BentoCard anim={card2Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {/* Onboard Students */}
            <View style={{
              flex: 1, borderRadius: 22, padding: 16,
              backgroundColor: "#eff6ff",
              borderWidth: 1, borderColor: "rgba(59,130,246,0.2)",
            }}>
              <View style={{
                width: 36, height: 36, borderRadius: 12,
                backgroundColor: "rgba(59,130,246,0.1)",
                justifyContent: "center", alignItems: "center", marginBottom: 10,
              }}>
                <Users size={18} color="#3b82f6" />
              </View>
              <Text style={{ color: "#6b7280", fontSize: 11, marginBottom: 2 }}>Onboard</Text>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 3 }}>
                <Text style={{ color: "#1f2937", fontSize: 28, fontWeight: "800" }}>{onboardCount}</Text>
                <Text style={{ color: "#9ca3af", fontSize: 13 }}>/ {busCapacity}</Text>
              </View>
              <View style={{ height: 3, backgroundColor: "#e5e7eb", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                <View style={{
                  height: "100%", borderRadius: 2,
                  backgroundColor: "#3b82f6",
                  width: `${(onboardCount / busCapacity) * 100}%`,
                }} />
              </View>
            </View>

            {/* Total Students */}
            <View style={{
              flex: 1, borderRadius: 22, padding: 16,
              backgroundColor: "#f0fdf4",
              borderWidth: 1, borderColor: "rgba(16,185,129,0.2)",
            }}>
              <View style={{
                width: 36, height: 36, borderRadius: 12,
                backgroundColor: "rgba(16,185,129,0.1)",
                justifyContent: "center", alignItems: "center", marginBottom: 10,
              }}>
                <UserCheck size={18} color="#10b981" />
              </View>
              <Text style={{ color: "#6b7280", fontSize: 11, marginBottom: 2 }}>Total Students</Text>
              <Text style={{ color: "#1f2937", fontSize: 28, fontWeight: "800" }}>{studentCount}</Text>
              <Text style={{ color: "#10b981", fontSize: 11, marginTop: 4 }}>✓ On your route</Text>
            </View>
          </BentoCard>

          {/* ── ROW 3: SCHEDULE (full width) ── */}
          <BentoCard anim={card3Anim} style={{ marginBottom: 10 }}>
            <View style={{
              borderRadius: 22, padding: 18,
              backgroundColor: "#f5f3ff",
              borderWidth: 1, borderColor: "rgba(139,92,246,0.2)",
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Calendar size={16} color="#8b5cf6" />
                <Text style={{ color: "#8b5cf6", fontSize: 12, fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase" }}>Today's Schedule</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{
                  flex: 1, backgroundColor: "rgba(59,130,246,0.08)",
                  borderRadius: 16, padding: 14, alignItems: "center",
                  borderWidth: 1, borderColor: "rgba(59,130,246,0.15)",
                }}>
                  <Clock size={18} color="#3b82f6" />
                  <Text style={{ color: "#6b7280", fontSize: 10, marginTop: 6 }}>PICKUP</Text>
                  <Text style={{ color: "#1f2937", fontSize: 18, fontWeight: "800", marginTop: 2 }}>{schedule.pickup || "08:00"}</Text>
                  <Text style={{ color: "#6b7280", fontSize: 10 }}>AM</Text>
                </View>
                <View style={{
                  alignItems: "center", justifyContent: "center", paddingHorizontal: 4,
                }}>
                  <View style={{ width: 1, flex: 1, backgroundColor: "#e5e7eb" }} />
                  <View style={{
                    width: 28, height: 28, borderRadius: 14,
                    backgroundColor: "#f3f4f6",
                    justifyContent: "center", alignItems: "center", marginVertical: 6,
                  }}>
                    <Text style={{ color: "#9ca3af", fontSize: 10 }}>→</Text>
                  </View>
                  <View style={{ width: 1, flex: 1, backgroundColor: "#e5e7eb" }} />
                </View>
                <View style={{
                  flex: 1, backgroundColor: "rgba(245,158,11,0.08)",
                  borderRadius: 16, padding: 14, alignItems: "center",
                  borderWidth: 1, borderColor: "rgba(245,158,11,0.15)",
                }}>
                  <Clock size={18} color="#f59e0b" />
                  <Text style={{ color: "#6b7280", fontSize: 10, marginTop: 6 }}>DROP</Text>
                  <Text style={{ color: "#1f2937", fontSize: 18, fontWeight: "800", marginTop: 2 }}>{schedule.drop || "04:00"}</Text>
                  <Text style={{ color: "#6b7280", fontSize: 10 }}>PM</Text>
                </View>
              </View>
            </View>
          </BentoCard>

          {/* ── ROW 4: ROUTE + SILENT MODE (2 cards) ── */}
          <BentoCard anim={card4Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {/* Assigned Route */}
            {route ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push("/(dashboard)/driver/routes/assigned")}
                style={{
                  flex: 2, borderRadius: 22, padding: 16,
                  backgroundColor: "#eff6ff",
                  borderWidth: 1, borderColor: "rgba(0,101,234,0.3)",
                }}
              >
                <View style={{
                  width: 36, height: 36, borderRadius: 12,
                  backgroundColor: "rgba(0,101,234,0.1)",
                  justifyContent: "center", alignItems: "center", marginBottom: 10,
                }}>
                  <MapPin size={18} color="#0065ea" />
                </View>
                <Text style={{ color: "#6b7280", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>Route</Text>
                <Text style={{ color: "#1f2937", fontSize: 15, fontWeight: "700" }} numberOfLines={2}>{route.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 }}>
                  <View style={{
                    backgroundColor: "rgba(0,101,234,0.1)", borderRadius: 8,
                    paddingHorizontal: 8, paddingVertical: 3, flexDirection: "row", alignItems: "center", gap: 3,
                  }}>
                    <MapPin size={10} color="#0065ea" />
                    <Text style={{ color: "#0065ea", fontSize: 10 }}>{route.distance || "12 km"}</Text>
                  </View>
                </View>
                <Text style={{ color: "#0065ea", fontSize: 11, marginTop: 8 }}>View details →</Text>
              </TouchableOpacity>
            ) : (
              <View style={{
                flex: 2, borderRadius: 22, padding: 16,
                backgroundColor: "#f3f4f6",
                borderWidth: 1, borderColor: "rgba(0,101,234,0.2)",
                justifyContent: "center", alignItems: "center",
              }}>
                <Bus size={24} color="#9ca3af" />
                <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 8 }}>No route assigned</Text>
              </View>
            )}

            {/* Silent Mode */}
            <View style={{
              flex: 1, borderRadius: 22, padding: 16,
              backgroundColor: silentMode ? "#fef2f2" : "#f3f4f6",
              borderWidth: 1, borderColor: silentMode ? "rgba(255,75,0,0.2)" : "rgba(0,0,0,0.06)",
            }}>
              <View style={{
                width: 36, height: 36, borderRadius: 12,
                backgroundColor: silentMode ? "rgba(255,75,0,0.1)" : "rgba(0,0,0,0.05)",
                justifyContent: "center", alignItems: "center", marginBottom: 10,
              }}>
                {silentMode ? <VolumeX size={18} color="#ff4b00" /> : <Volume2 size={18} color="#6b7280" />}
              </View>
              <Text style={{ color: "#6b7280", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
                Silent
              </Text>
              <Switch
                value={silentMode}
                onValueChange={setSilentMode}
                trackColor={{ false: "#e5e7eb", true: "rgba(255,75,0,0.3)" }}
                thumbColor={silentMode ? "#ff4b00" : "#9ca3af"}
                style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }], marginLeft: -4 }}
              />
              <Text style={{ color: silentMode ? "#dc2626" : "#9ca3af", fontSize: 10, marginTop: 4 }}>
                {silentMode ? "ON" : "OFF"}
              </Text>
            </View>
          </BentoCard>

          {/* ── ROW 5: ALERTS (full width) ── */}
          <BentoCard anim={card5Anim} style={{ marginBottom: 10 }}>
            <View style={{
              borderRadius: 22, overflow: "hidden",
              backgroundColor: "#fffbeb",
              borderWidth: 1, borderColor: "rgba(245,158,11,0.2)",
            }}>
              <View style={{
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                paddingHorizontal: 16, paddingVertical: 12,
                borderBottomWidth: 1, borderBottomColor: "rgba(245,158,11,0.1)",
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Bell size={16} color="#f59e0b" />
                  <Text style={{ color: "#f59e0b", fontSize: 12, fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase" }}>Recent Alerts</Text>
                </View>
                <View style={{
                  backgroundColor: "rgba(245,158,11,0.1)", borderRadius: 10,
                  paddingHorizontal: 8, paddingVertical: 2,
                }}>
                  <Text style={{ color: "#f59e0b", fontSize: 11, fontWeight: "600" }}>{alerts.length}</Text>
                </View>
              </View>
              {alerts.length === 0 ? (
                <View style={{ paddingVertical: 24, alignItems: "center" }}>
                  <Text style={{ color: "#9ca3af", fontSize: 13 }}>No alerts right now</Text>
                  <Text style={{ color: "#d1d5db", fontSize: 11, marginTop: 3 }}>All clear ✓</Text>
                </View>
              ) : (
                alerts.slice(0, 3).map((alert, idx) => (
                  <View
                    key={alert.id}
                    style={{
                      flexDirection: "row", alignItems: "center",
                      paddingHorizontal: 16, paddingVertical: 12,
                      borderBottomWidth: idx < Math.min(alerts.length, 3) - 1 ? 1 : 0,
                      borderBottomColor: "rgba(0,0,0,0.05)",
                    }}
                  >
                    <View style={{
                      width: 8, height: 8, borderRadius: 4, marginRight: 12,
                      backgroundColor: alert.type === "warning" ? "#ff4b00" : "#3b82f6",
                      shadowColor: alert.type === "warning" ? "#ff4b00" : "#3b82f6",
                      shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 4,
                    }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#1f2937", fontSize: 13 }}>{alert.message}</Text>
                      <Text style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>{alert.time}</Text>
                    </View>
                    <View style={{
                      paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
                      backgroundColor: alert.type === "warning" ? "rgba(255,75,0,0.1)" : "rgba(59,130,246,0.1)",
                    }}>
                      <Text style={{ color: alert.type === "warning" ? "#dc2626" : "#2563eb", fontSize: 10, fontWeight: "600" }}>
                        {alert.type === "warning" ? "Urgent" : "Info"}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </BentoCard>

          {/* ── ROW 6: QUICK ACTIONS GRID ── */}
          <BentoCard anim={card6Anim}>
            <View style={{
              borderRadius: 22, padding: 16,
              backgroundColor: "#ffffff",
              borderWidth: 1, borderColor: "rgba(0,0,0,0.06)",
              marginBottom: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <TrendingUp size={15} color="#0065ea" />
                <Text style={{ color: "#0065ea", fontSize: 12, fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase" }}>Quick Actions</Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {mobileMenuItems.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={item.onPress}
                    activeOpacity={0.75}
                    style={{
                      width: "30%",
                      borderRadius: 20, padding: 16, alignItems: "center",
                      backgroundColor: "#f9fafb",
                      borderWidth: 1, borderColor: "rgba(0,0,0,0.05)",
                      marginBottom: 2,
                    }}
                  >
                    <View style={{
                      width: 48, height: 48, borderRadius: 14,
                      backgroundColor: `${item.bg[0]}90`,
                      justifyContent: "center", alignItems: "center",
                      marginBottom: 8,
                      borderWidth: 2.5,
                      borderColor: `${item.bg[0]}50`,
                      shadowColor: item.bg[0],
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                      elevation: 4,
                    }}>
                      {item.icon}
                    </View>
                    <Text style={{ color: "#4b5563", fontSize: 10.5, fontWeight: "600", textAlign: "center" }} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BentoCard>

        </View>
      </ScrollView>
    </View>
  );
}