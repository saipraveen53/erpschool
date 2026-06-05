import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
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
  Platform,
  RefreshControl,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDriverAttendance, updateAttendanceStatus } from "../../../services/driverService";

const isWeb = Platform.OS === "web";

export default function AttendanceConfirmation() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;

  const loadData = async () => {
    const data = await getDriverAttendance();
    setAttendance(data);
    setLoading(false);
  };

  useEffect(() => { 
    loadData();
    
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
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "present" ? "absent" : "present";
    await updateAttendanceStatus(id, newStatus);
    loadData();
  };

  const onSubmitAttendance = () => {
    Alert.alert("Submitted", "Attendance saved successfully");
    router.back();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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

  const filtered = attendance.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));
  const present = attendance.filter(s => s.status === "present").length;
  const total = attendance.length;
  const percentage = total > 0 ? (present / total) * 100 : 0;

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

  // ------------------------------------------------
  // WEB VERSION - BENTO GRID LAYOUT
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
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#0065ea] to-[#0099ff] bg-clip-text text-transparent">Attendance</h1>
              <div className="w-10" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Bento Grid - 3 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-400/80 to-green-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle size={28} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <Users size={16} />
                  </div>
                </div>
                <p className="text-green-50 text-sm mb-1">Present Today</p>
                <p className="text-3xl font-bold">{present}</p>
                <p className="text-green-100 text-xs mt-2">Students attended</p>
              </div>

              <div className="bg-gradient-to-br from-red-400/80 to-red-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <XCircle size={28} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <Users size={16} />
                  </div>
                </div>
                <p className="text-red-50 text-sm mb-1">Absent Today</p>
                <p className="text-3xl font-bold">{total - present}</p>
                <p className="text-red-100 text-xs mt-2">Students absent</p>
              </div>

              <div className="bg-gradient-to-br from-blue-400/80 to-blue-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Users size={28} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <Calendar size={16} />
                  </div>
                </div>
                <p className="text-blue-50 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold">{total}</p>
                <p className="text-blue-100 text-xs mt-2">Enrolled in your bus</p>
              </div>
            </div>

            {/* Attendance Rate Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-8">
              <div className="bg-gradient-to-r from-[#0065ea] to-[#0099ff] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <Calendar size={20} color="white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Today's Attendance Rate</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Attendance</span>
                  <span className="font-semibold text-[#0065ea]">{Math.round(percentage)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>✅ {present} Present</span>
                  <span>❌ {total - present} Absent</span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search student by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all bg-white"
                />
              </div>
            </div>

            {/* Students List Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <User size={20} color="white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Student Attendance</h2>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Point</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boarding Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No students found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User size={18} color="#0065ea" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                <p className="text-xs text-gray-500">ID: {student.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            Class {student.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.pickupPoint}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.status === "present" ? (
                              <div className="flex items-center gap-1">
                                <Clock size={14} className="text-green-500" />
                                <span className="text-sm text-gray-600">{student.time || "08:15 AM"}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              student.status === "present" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${student.status === "present" ? "bg-green-500" : "bg-red-500"}`} />
                              {student.status === "present" ? "Present" : "Absent"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleStatus(student.id, student.status)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                student.status === "present"
                                  ? "bg-red-500 hover:bg-red-600 text-white"
                                  : "bg-green-500 hover:bg-green-600 text-white"
                              }`}
                            >
                              {student.status === "present" ? "Mark Absent" : "Mark Present"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={onRefresh}
                className="bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
              <button
                onClick={onSubmitAttendance}
                className="bg-gradient-to-r from-[#0065ea] to-[#0099ff] hover:from-[#0054c4] hover:to-[#0088ee] text-white font-medium py-2 px-6 rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Submit Attendance
              </button>
            </div>

            <div className="mt-8 text-center pb-6">
              <p className="text-xs text-gray-400">© 2026 Transport Management System | Attendance Management</p>
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
          Attendance
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

        {/* ── BENTO 1: STATS CARDS ROW ── */}
        <BentoCard anim={card1Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Present", value: present.toString(), bg: "#f0fdf4", border: "#bbf7d0", valColor: "#166534", iconBg: "#dcfce7", icon: <CheckCircle size={20} color="#16a34a" /> },
            { label: "Absent", value: (total - present).toString(), bg: "#fef2f2", border: "#fecaca", valColor: "#991b1b", iconBg: "#fee2e2", icon: <XCircle size={20} color="#dc2626" /> },
            { label: "Total", value: total.toString(), bg: "#eff6ff", border: "#bfdbfe", valColor: "#1d4ed8", iconBg: "#dbeafe", icon: <Users size={20} color="#2563eb" /> },
          ].map((stat, idx) => (
            <RNView key={idx} style={{
              flex: 1, borderRadius: 18, padding: 14, alignItems: "center",
              backgroundColor: stat.bg, borderWidth: 1.5, borderColor: stat.border,
            }}>
              <RNView style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: stat.iconBg, justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
                {stat.icon}
              </RNView>
              <RNText style={{ fontSize: 20, fontWeight: "800", color: stat.valColor }}>{stat.value}</RNText>
              <RNText style={{ fontSize: 11, color: "#64748b", fontWeight: "500", marginTop: 2 }}>{stat.label}</RNText>
            </RNView>
          ))}
        </BentoCard>

        {/* ── BENTO 2: ATTENDANCE RATE CARD ── */}
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
                <Calendar size={17} color="#0065ea" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e3a8a" }}>Today's Attendance Rate</RNText>
              <RNView style={{ marginLeft: "auto", backgroundColor: "#dbeafe", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                <RNText style={{ fontSize: 12, fontWeight: "700", color: "#0065ea" }}>{Math.round(percentage)}%</RNText>
              </RNView>
            </RNView>

            <RNView style={{ padding: 16 }}>
              <RNView style={{ height: 8, backgroundColor: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                <Animated.View style={{ height: "100%", width: percentage + "%", backgroundColor: "#16a34a", borderRadius: 4 }} />
              </RNView>
              <RNView style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <RNText style={{ fontSize: 11, color: "#94a3b8" }}>✅ {present} Present</RNText>
                <RNText style={{ fontSize: 11, color: "#94a3b8" }}>❌ {total - present} Absent</RNText>
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
            placeholder="Search student by name..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </Animated.View>

        {/* Students List */}
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
          marginBottom: 16,
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
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e293b" }}>Student Attendance</RNText>
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
                const isPresent = student.status === "present";
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
                      <RNView style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <RNView style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#dbeafe", alignItems: "center", justifyContent: "center" }}>
                          <User size={22} color="#0065ea" />
                        </RNView>
                        <RNView style={{ flex: 1 }}>
                          <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e293b" }}>{student.name}</RNText>
                          <RNText style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Class {student.class}</RNText>
                          <RNText style={{ fontSize: 11, color: "#94a3b8" }}>{student.pickupPoint}</RNText>
                          {isPresent && student.time && (
                            <RNView style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                              <Clock size={12} color="#16a34a" />
                              <RNText style={{ fontSize: 11, color: "#16a34a" }}>Boarded at {student.time}</RNText>
                            </RNView>
                          )}
                        </RNView>
                        <RNView style={{
                          backgroundColor: isPresent ? "#dcfce7" : "#fee2e2",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 12,
                        }}>
                          <RNText style={{ fontSize: 12, fontWeight: "600", color: isPresent ? "#166534" : "#991b1b" }}>
                            {isPresent ? "Present" : "Absent"}
                          </RNText>
                        </RNView>
                      </RNView>

                      {/* Action Button */}
                      <RNTouchableOpacity
                        onPress={() => toggleStatus(student.id, student.status)}
                        style={{
                          marginTop: 12,
                          backgroundColor: isPresent ? "#ef4444" : "#22c55e",
                          paddingVertical: 10,
                          borderRadius: 12,
                          alignItems: "center",
                        }}
                      >
                        <RNText style={{ color: "white", fontSize: 13, fontWeight: "600" }}>
                          {isPresent ? "Mark Absent" : "Mark Present"}
                        </RNText>
                      </RNTouchableOpacity>
                    </RNView>
                  </RNView>
                );
              })
            )}
          </RNView>
        </Animated.View>

        {/* Submit Button */}
        <RNTouchableOpacity
          onPress={onSubmitAttendance}
          style={{
            backgroundColor: "#0065ea",
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: "center",
            marginTop: 8,
            marginBottom: 16,
            shadowColor: "#0065ea",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <RNText style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Submit Attendance</RNText>
        </RNTouchableOpacity>

        {/* Footer */}
        <RNText style={{ textAlign: "center", fontSize: 10, color: "#cbd5e1", marginBottom: 8 }}>
          © 2026 Transport Management System | Attendance Management
        </RNText>
      </RNScrollView>
    </SafeAreaView>
  );
}