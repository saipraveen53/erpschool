import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  User,
  Users,
  XCircle
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Linking,
  Platform,
  RefreshControl,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateStudentPickupStatus } from "../../../services/driverService";
import { root1Api } from "../../../utils/axiosInstance";

const isWeb = Platform.OS === "web";

// Interface matching the API response for /api/student/transport/route/{routeId}/students
interface RouteStudent {
  studentId: string;
  fullName: string;
  grade: string;
  section: string;
  rollNumber: string;
  pickupStop: string;
  dropStop: string;
  pickupTime: string;
  dropTime: string;
  status: string; // "active", "inactive", etc.
  parentContact: string;
}

// Map to the shape used by the component
interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  pickupPoint: string;
  status: string; // "picked", "absent", "pending", "dropped"
  time?: string;
}

export default function PickupList() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;

  const fetchStudentsByRoute = async (rId: string) => {
    try {
      const response = await root1Api.get<RouteStudent[]>(`/api/student/transport/driver/route/${rId}/students`);
      // Transform API data to component's expected format
      const mapped: Student[] = response.data.map((s) => ({
        id: s.studentId,
        name: s.fullName,
        class: `${s.grade} ${s.section}`,
        phone: s.parentContact,
        pickupPoint: s.pickupStop,
        // status mapping: API might have "active" -> "pending" etc. Assume default "pending"
        // The updateStatus function will set "picked"/"absent"/"dropped"
        status: "pending",
        // Optionally store pickupTime for display
        time: s.pickupTime,
      }));
      return mapped;
    } catch (err) {
      console.error("Failed to fetch students for route", err);
      throw err;
    }
  };

  const loadStudents = async () => {
    if (!routeId) {
      setError("No route selected");
      setLoading(false);
      return;
    }
    try {
      const data = await fetchStudentsByRoute(routeId);
      setStudents(data);
      setError(null);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadStudents();
    
    const cards = [card1Anim, card2Anim];
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ...cards.map((anim, i) =>
        Animated.timing(anim, { 
          toValue: 1, 
          duration: 480, 
          delay: 60 + i * 80, 
          useNativeDriver: true 
        })
      ),
    ]).start();
  }, [routeId]);

  const updateStatus = async (id: string, newStatus: string) => {
    // Call the existing service to update pickup status
    await updateStudentPickupStatus(id, newStatus);
    // Refresh list after update
    await loadStudents();
    Alert.alert("Status Updated", `Student marked as ${newStatus}`);
  };

  const callParent = (phone: string) => Linking.openURL(`tel:${phone}`);
  const whatsappParent = (phone: string) => Linking.openURL(`https://wa.me/${phone}`);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  const filtered = students.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.pickupPoint?.toLowerCase().includes(search.toLowerCase())
  );
  const picked = students.filter(s => s.status === "picked").length;
  const total = students.length;
  const percentage = total > 0 ? (picked / total) * 100 : 0;
  const absent = students.filter(s => s.status === "absent").length;
  const pending = students.filter(s => s.status === "pending").length;

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: percentage, duration: 800, useNativeDriver: false }).start();
  }, [percentage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "picked": return { bg: "#dcfce7", text: "#166534", dot: "#22c55e", label: "Picked", border: "#bbf7d0" };
      case "absent": return { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444", label: "Absent", border: "#fecaca" };
      case "pending": return { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b", label: "Pending", border: "#fde68a" };
      case "dropped": return { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6", label: "Dropped", border: "#bfdbfe" };
      default: return { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8", label: status, border: "#e2e8f0" };
    }
  };

  const BentoCard = ({ anim, children, style = {} }: any) => (
    <Animated.View
      style={[
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (loading) {
    if (isWeb) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0065ea]"></div>
        </div>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eef2fb" }}>
        <ActivityIndicator size="large" color="#0065ea" />
      </SafeAreaView>
    );
  }

  if (error) {
    const retryButton = isWeb ? (
      <button onClick={loadStudents} className="bg-[#0065ea] text-white px-5 py-2 rounded-lg font-semibold">Retry</button>
    ) : (
      <RNTouchableOpacity onPress={loadStudents} style={{ backgroundColor: "#0065ea", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
        <RNText style={{ color: "#fff", fontWeight: "600" }}>Retry</RNText>
      </RNTouchableOpacity>
    );
    if (isWeb) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="bg-red-50 text-red-600 text-center mb-4 p-4 rounded-xl">{error}</div>
          {retryButton}
        </div>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eef2fb", padding: 16 }}>
        <RNText style={{ color: "#ef4444", textAlign: "center", marginBottom: 16 }}>{error}</RNText>
        {retryButton}
      </SafeAreaView>
    );
  }

  // ------------------------------------------------
  // WEB VERSION - BENTO GRID LAYOUT (unchanged except data)
  // ------------------------------------------------
  if (isWeb) {
    return (
      <>
        <StatusBar style="dark" />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 overflow-y-auto">
          {/* Sticky header */}
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105">
                <ArrowLeft size={24} color="#0065ea" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#0065ea] to-[#0099ff] bg-clip-text text-transparent">Pickup List</h1>
              <div className="w-10" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-400/80 to-blue-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Users size={28} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2"><User size={16} /></div>
                </div>
                <p className="text-blue-50 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold">{total}</p>
              </div>

              <div className="bg-gradient-to-br from-green-400/80 to-green-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle size={28} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2"><CheckCircle size={16} /></div>
                </div>
                <p className="text-green-50 text-sm mb-1">Picked Up</p>
                <p className="text-3xl font-bold">{picked}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-400/80 to-yellow-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Clock size={28} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2"><AlertCircle size={16} /></div>
                </div>
                <p className="text-yellow-50 text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold">{pending}</p>
              </div>

              <div className="bg-gradient-to-br from-red-400/80 to-red-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <XCircle size={28} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2"><XCircle size={16} /></div>
                </div>
                <p className="text-red-50 text-sm mb-1">Absent</p>
                <p className="text-3xl font-bold">{absent}</p>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-8">
              <div className="bg-gradient-to-r from-[#0065ea] to-[#0099ff] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2"><Users size={20} color="white" /></div>
                  <h2 className="text-xl font-semibold text-white">Today's Pickup Progress</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Completion</span>
                  <span className="font-semibold text-[#0065ea]">{Math.round(percentage)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0065ea] to-[#0099ff] rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>{picked} Picked</span>
                  <span>{pending} Pending</span>
                  <span>{absent} Absent</span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or pickup point..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all bg-white"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2"><User size={20} color="white" /></div>
                  <h2 className="text-xl font-semibold text-white">Student List</h2>
                  <div className="ml-auto bg-white/20 rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">{filtered.length} students</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Point</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No students found</td>
                      </tr>
                    ) : (
                      filtered.map((student) => {
                        const statusStyle = getStatusColor(student.status);
                        return (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User size={18} color="#0065ea" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                  <p className="text-xs text-gray-500">{student.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-600">{student.pickupPoint}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {student.class}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium`}
                                style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                                {statusStyle.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                {student.status !== "picked" && (
                                  <button
                                    onClick={() => updateStatus(student.id, "picked")}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
                                  >
                                    <CheckCircle size={14} /> Pick
                                  </button>
                                )}
                                {student.status !== "absent" && (
                                  <button
                                    onClick={() => updateStatus(student.id, "absent")}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
                                  >
                                    <XCircle size={14} /> Absent
                                  </button>
                                )}
                                {student.status === "picked" && (
                                  <button
                                    onClick={() => updateStatus(student.id, "dropped")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
                                  >
                                    <Home size={14} /> Drop
                                  </button>
                                )}
                                <button
                                  onClick={() => callParent(student.phone)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded-lg transition-all"
                                >
                                  <Phone size={16} />
                                </button>
                                <button
                                  onClick={() => whatsappParent(student.phone)}
                                  className="bg-green-50 hover:bg-green-100 p-1.5 rounded-lg transition-all"
                                >
                                  <MessageCircle size={16} color="#25D366" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={onRefresh}
                className="bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
            </div>
            <div className="mt-8 text-center pb-6">
              <p className="text-xs text-gray-400">© 2026 Transport Management System | Pickup Management</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ------------------------------------------------
  // NATIVE VERSION (Android/iOS) - BENTO CARD DESIGN
  // ------------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2fb" }} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={{
        opacity: fadeAnim,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingTop: 6,
        paddingBottom: 12,
        backgroundColor: "#eef2fb",
      }}>
        <RNTouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#0065ea",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <ArrowLeft size={20} color="#0065ea" />
        </RNTouchableOpacity>

        <RNText style={{ fontSize: 17, fontWeight: "700", color: "#1e293b", letterSpacing: 0.2 }}>
          Pickup List
        </RNText>

        <RNView style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: "#eff6ff",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <RNText style={{ fontSize: 14, fontWeight: "700", color: "#0065ea" }}>{total}</RNText>
        </RNView>
      </Animated.View>

      <RNScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 14 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0065ea"]} tintColor="#0065ea" />
        }
      >

        {/* Stats Row */}
        <BentoCard anim={card1Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Total", value: total.toString(), bg: "#eff6ff", border: "#bfdbfe", valColor: "#1d4ed8", iconBg: "#dbeafe", icon: <Users size={20} color="#2563eb" /> },
            { label: "Picked", value: picked.toString(), bg: "#f0fdf4", border: "#bbf7d0", valColor: "#166534", iconBg: "#dcfce7", icon: <CheckCircle size={20} color="#16a34a" /> },
            { label: "Pending", value: pending.toString(), bg: "#fefce8", border: "#fde68a", valColor: "#92400e", iconBg: "#fef9c3", icon: <Clock size={20} color="#ca8a04" /> },
            { label: "Absent", value: absent.toString(), bg: "#fef2f2", border: "#fecaca", valColor: "#991b1b", iconBg: "#fee2e2", icon: <XCircle size={20} color="#dc2626" /> },
          ].map((stat, idx) => (
            <RNView key={idx} style={{
              flex: 1, borderRadius: 18, padding: 12, alignItems: "center",
              backgroundColor: stat.bg, borderWidth: 1.5, borderColor: stat.border,
            }}>
              <RNView style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: stat.iconBg, justifyContent: "center", alignItems: "center", marginBottom: 6 }}>
                {stat.icon}
              </RNView>
              <RNText style={{ fontSize: 18, fontWeight: "800", color: stat.valColor }}>{stat.value}</RNText>
              <RNText style={{ fontSize: 10, color: "#64748b", fontWeight: "500", marginTop: 1 }}>{stat.label}</RNText>
            </RNView>
          ))}
        </BentoCard>

        {/* Progress Card */}
        <BentoCard anim={card2Anim} style={{ marginBottom: 16 }}>
          <RNView style={{
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: "#fff",
            shadowColor: "#1e293b",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.07,
            shadowRadius: 10,
            elevation: 3,
            borderWidth: 1,
            borderColor: "#f1f5f9",
          }}>
            <RNView style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 16,
              paddingVertical: 13,
              backgroundColor: "#f0f6ff",
              borderBottomWidth: 1,
              borderBottomColor: "#dbeafe",
            }}>
              <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center" }}>
                <Users size={17} color="#0065ea" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e3a8a" }}>Today's Pickup Progress</RNText>
              <RNView style={{ marginLeft: "auto", backgroundColor: "#dbeafe", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                <RNText style={{ fontSize: 12, fontWeight: "700", color: "#0065ea" }}>{picked}/{total}</RNText>
              </RNView>
            </RNView>

            <RNView style={{ padding: 16 }}>
              <RNView style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <RNText style={{ fontSize: 12, color: "#64748b" }}>Completion</RNText>
                <RNText style={{ fontSize: 12, fontWeight: "600", color: "#0065ea" }}>{Math.round(percentage)}%</RNText>
              </RNView>
              <RNView style={{ height: 8, backgroundColor: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                <Animated.View style={{ height: "100%", width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }), backgroundColor: "#0065ea", borderRadius: 4 }} />
              </RNView>
              <RNView style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <RNText style={{ fontSize: 10, color: "#94a3b8" }}>✅ {picked} Picked</RNText>
                <RNText style={{ fontSize: 10, color: "#94a3b8" }}>⏳ {pending} Pending</RNText>
                <RNText style={{ fontSize: 10, color: "#94a3b8" }}>❌ {absent} Absent</RNText>
              </RNView>
            </RNView>
          </RNView>
        </BentoCard>

        {/* Search Bar */}
        <Animated.View style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          marginBottom: 16,
          paddingHorizontal: 14,
          paddingVertical: 4,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderWidth: 1.5,
          borderColor: "#e2e8f0",
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <Search size={18} color="#94a3b8" />
          <RNTextInput
            style={{ flex: 1, paddingVertical: 12, fontSize: 14, color: "#1e293b" }}
            placeholder="Search by name or pickup point"
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </Animated.View>

        {/* Students List Cards */}
        <Animated.View style={{
          borderRadius: 24,
          overflow: "hidden",
          backgroundColor: "#fff",
          shadowColor: "#1e293b",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
          elevation: 3,
          borderWidth: 1,
          borderColor: "#f1f5f9",
          marginBottom: 8,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <RNView style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 13,
            backgroundColor: "#f8fafc",
            borderBottomWidth: 1,
            borderBottomColor: "#e2e8f0",
          }}>
            <RNView style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#e2e8f0", justifyContent: "center", alignItems: "center" }}>
                <User size={17} color="#475569" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e293b" }}>Student List</RNText>
            </RNView>
            <RNView style={{ backgroundColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
              <RNText style={{ fontSize: 12, fontWeight: "700", color: "#475569" }}>{filtered.length}</RNText>
            </RNView>
          </RNView>

          <RNView style={{ padding: 12 }}>
            {filtered.length === 0 ? (
              <RNView style={{ alignItems: "center", paddingVertical: 40 }}>
                <RNView style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: "#f1f5f9", justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
                  <Search size={28} color="#94a3b8" />
                </RNView>
                <RNText style={{ color: "#475569", fontSize: 14, fontWeight: "500" }}>No students found</RNText>
                <RNText style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Try a different search term</RNText>
              </RNView>
            ) : (
              filtered.map((student) => {
                const statusStyle = getStatusColor(student.status);
                return (
                  <RNView key={student.id} style={{
                    borderRadius: 18,
                    marginBottom: 10,
                    backgroundColor: "#f8fafc",
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    overflow: "hidden",
                  }}>
                    <RNView style={{ padding: 14 }}>
                      {/* Header Row */}
                      <RNView style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <RNView style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#dbeafe", alignItems: "center", justifyContent: "center" }}>
                          <User size={22} color="#0065ea" />
                        </RNView>
                        <RNView style={{ flex: 1 }}>
                          <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e293b" }}>{student.name}</RNText>
                          <RNView style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                            <MapPin size={12} color="#94a3b8" />
                            <RNText style={{ fontSize: 11, color: "#64748b" }}>{student.pickupPoint}</RNText>
                          </RNView>
                          <RNText style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Class {student.class}</RNText>
                        </RNView>
                        <RNView style={{
                          backgroundColor: statusStyle.bg,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: statusStyle.border,
                        }}>
                          <RNText style={{ fontSize: 10, fontWeight: "600", color: statusStyle.text }}>{statusStyle.label}</RNText>
                        </RNView>
                      </RNView>

                      {/* Action Buttons */}
                      <RNView style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                        {student.status !== "picked" && (
                          <RNTouchableOpacity
                            onPress={() => updateStatus(student.id, "picked")}
                            style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#22c55e", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}
                          >
                            <CheckCircle size={14} color="white" />
                            <RNText style={{ color: "white", fontSize: 11, fontWeight: "600" }}>Pick</RNText>
                          </RNTouchableOpacity>
                        )}
                        {student.status !== "absent" && (
                          <RNTouchableOpacity
                            onPress={() => updateStatus(student.id, "absent")}
                            style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#ef4444", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}
                          >
                            <XCircle size={14} color="white" />
                            <RNText style={{ color: "white", fontSize: 11, fontWeight: "600" }}>Absent</RNText>
                          </RNTouchableOpacity>
                        )}
                        {student.status === "picked" && (
                          <RNTouchableOpacity
                            onPress={() => updateStatus(student.id, "dropped")}
                            style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#3b82f6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}
                          >
                            <Home size={14} color="white" />
                            <RNText style={{ color: "white", fontSize: 11, fontWeight: "600" }}>Drop</RNText>
                          </RNTouchableOpacity>
                        )}
                        <RNTouchableOpacity
                          onPress={() => callParent(student.phone)}
                          style={{ backgroundColor: "#f1f5f9", padding: 8, borderRadius: 10 }}
                        >
                          <Phone size={16} color="#0065ea" />
                        </RNTouchableOpacity>
                        <RNTouchableOpacity
                          onPress={() => whatsappParent(student.phone)}
                          style={{ backgroundColor: "#dcfce7", padding: 8, borderRadius: 10 }}
                        >
                          <MessageCircle size={16} color="#25D366" />
                        </RNTouchableOpacity>
                      </RNView>
                    </RNView>
                  </RNView>
                );
              })
            )}
          </RNView>
        </Animated.View>

        {/* Footer */}
        <RNText style={{ textAlign: "center", fontSize: 10, color: "#cbd5e1", marginTop: 16, marginBottom: 8 }}>
          © 2026 Transport Management System | Pickup Management
        </RNText>
      </RNScrollView>
    </SafeAreaView>
  );
}