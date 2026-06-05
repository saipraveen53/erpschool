import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CalendarX,
  Clock,
  FileText,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { teacherClient } from "../Axios/teacherClient";

// Modern, vibrant color palette (matches dashboard)
const COLORS = {
  primary: "#F59E0B", // Amber
  primaryDark: "#D97706",
  primaryLight: "#FEF3C7",
  secondary: "#10B981", // Emerald
  secondaryDark: "#059669",
  accent: "#3B82F6", // Blue
  navy: "#0F172A",
  navyLight: "#1E293B",
  surface: "#FFFFFF",
  background: "#F1F5F9", // Slate-100
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  border: "#E2E8F0",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  white: "#FFFFFF",
  lightGray: "#F3F4F6",
};

const platformShadow = Platform.select({
  web: { boxShadow: "0px 4px 16px rgba(0,0,0,0.04)" } as any,
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
});

export default function TeacherAttendanceHistoryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Teacher info state
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ present: 0, absent: 0, halfDay: 0 });

  // Fetch teacher info (using class-sections to get teacher's own class)
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const currentTeacherId =
          Platform.OS === "web"
            ? localStorage.getItem("userUsername")
            : await AsyncStorage.getItem("userUsername");
        if (!currentTeacherId) return;
        setTeacherId(currentTeacherId);

        const classSectionsRes = await teacherClient.get(
          "/api/student/class-sections",
        );
        const fetchedClasses = classSectionsRes.data;
        const assigned = fetchedClasses.find(
          (c: any) => c.classTeacherId === currentTeacherId,
        );
        if (assigned) {
          setTeacherName(assigned.classTeacherName.trim());
          setAssignedClass(
            `${assigned.className}-${assigned.section.toUpperCase()}`,
          );
        } else {
          setTeacherName("Not Found");
          setAssignedClass("None");
        }
      } catch (err) {
        console.error("Failed to load teacher info:", err);
      }
    };
    fetchTeacherInfo();
  }, []);

  // Fetch attendance history
  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      setLoading(true);
      try {
        let currentTeacherId = "";
        if (Platform.OS === "web") {
          currentTeacherId = localStorage.getItem("userUsername") || "";
        } else {
          currentTeacherId = (await AsyncStorage.getItem("userUsername")) || "";
        }
        if (!currentTeacherId) {
          setLoading(false);
          return;
        }

        const res = await teacherClient.get(
          `/api/student/teacher/teacher/${currentTeacherId}/attendance`,
        );
        const data = res.data || [];

        const sortedData = data.sort(
          (a: any, b: any) =>
            new Date(b.attendanceDate).getTime() -
            new Date(a.attendanceDate).getTime(),
        );
        setRecords(sortedData);

        let present = 0,
          absent = 0,
          halfDay = 0;
        sortedData.forEach((record: any) => {
          const status = record.status?.toUpperCase();
          if (status === "PRESENT") present++;
          else if (status === "ABSENT") absent++;
          else if (status === "HALF_DAY") halfDay++;
        });
        setStats({ present, absent, halfDay });
      } catch (error) {
        console.error("Failed to load attendance history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceHistory();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PRESENT":
        return {
          color: COLORS.success,
          bg: `${COLORS.success}15`,
          label: "Present",
        };
      case "ABSENT":
        return {
          color: COLORS.danger,
          bg: `${COLORS.danger}15`,
          label: "Absent",
        };
      case "HALF_DAY":
        return {
          color: COLORS.warning,
          bg: `${COLORS.warning}15`,
          label: "Half Day",
        };
      case "LEAVE":
        return {
          color: COLORS.secondary,
          bg: `${COLORS.secondary}15`,
          label: "On Leave",
        };
      default:
        return {
          color: COLORS.textSecondary,
          bg: COLORS.lightGray,
          label: status || "Unknown",
        };
    }
  };

  // Header padding values: reduced for web
  const headerPaddingTop =
    Platform.OS === "web" ? 16 : Platform.OS === "android" ? 48 : 40;
  const headerPaddingBottom = Platform.OS === "web" ? 16 : 20;

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.navy}
        translucent={false}
      />

      {/* Modern Gradient Header */}
      <LinearGradient
        colors={[COLORS.navy, COLORS.navyLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          paddingTop: headerPaddingTop,
          paddingBottom: headerPaddingBottom,
          paddingHorizontal: 24,
        }}
      >
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full bg-white/10"
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={COLORS.surface} />
          </TouchableOpacity>
          <Text
            className="text-xl font-bold tracking-tight"
            style={{ color: COLORS.surface }}
          >
            My Attendance
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {/* Teacher Info Bar */}
      <View
        className="flex-row justify-between px-5 py-3 mx-4 mt-4 rounded-2xl"
        style={{
          backgroundColor: COLORS.surface,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            },
            android: { elevation: 2 },
            web: { boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" },
          }),
        }}
      >
        <Text
          className="text-xs font-medium"
          style={{ color: COLORS.textSecondary, flex: 1 }}
          numberOfLines={1}
        >
          Teacher: {teacherName} ({teacherId})
        </Text>
        <Text
          className="text-xs font-medium"
          style={{ color: COLORS.textSecondary }}
          numberOfLines={1}
        >
          Class: {assignedClass}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 24,
          maxWidth: isDesktop ? 800 : "100%",
          alignSelf: "center",
          width: "100%",
        }}
      >
        {/* Quick Stats Summary */}
        <View className="flex-row justify-between gap-4 mb-6">
          <View
            className="flex-1 items-center p-4 rounded-2xl border"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
              ...platformShadow,
            }}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: `${COLORS.success}15` }}
            >
              <CalendarCheck size={20} color={COLORS.success} />
            </View>
            <Text
              className="text-2xl font-black"
              style={{ color: COLORS.textPrimary }}
            >
              {stats.present}
            </Text>
            <Text
              className="text-xs font-semibold uppercase tracking-wider mt-1"
              style={{ color: COLORS.textSecondary }}
            >
              Present
            </Text>
          </View>

          <View
            className="flex-1 items-center p-4 rounded-2xl border"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
              ...platformShadow,
            }}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: `${COLORS.danger}15` }}
            >
              <CalendarX size={20} color={COLORS.danger} />
            </View>
            <Text
              className="text-2xl font-black"
              style={{ color: COLORS.textPrimary }}
            >
              {stats.absent}
            </Text>
            <Text
              className="text-xs font-semibold uppercase tracking-wider mt-1"
              style={{ color: COLORS.textSecondary }}
            >
              Absent
            </Text>
          </View>

          <View
            className="flex-1 items-center p-4 rounded-2xl border"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
              ...platformShadow,
            }}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: `${COLORS.warning}15` }}
            >
              <Clock size={20} color={COLORS.warning} />
            </View>
            <Text
              className="text-2xl font-black"
              style={{ color: COLORS.textPrimary }}
            >
              {stats.halfDay}
            </Text>
            <Text
              className="text-xs font-semibold uppercase tracking-wider mt-1"
              style={{ color: COLORS.textSecondary }}
            >
              Half Days
            </Text>
          </View>
        </View>

        <Text
          className="text-lg font-bold mb-4"
          style={{ color: COLORS.textPrimary }}
        >
          Attendance History
        </Text>

        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text
              className="mt-4 font-semibold text-sm"
              style={{ color: COLORS.textSecondary }}
            >
              Loading records...
            </Text>
          </View>
        ) : records.length === 0 ? (
          <View
            className="p-8 rounded-2xl border items-center"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
              ...platformShadow,
            }}
          >
            <Calendar size={40} color={COLORS.textTertiary} strokeWidth={1.5} />
            <Text
              className="text-base font-bold mt-4"
              style={{ color: COLORS.textPrimary }}
            >
              No records found
            </Text>
            <Text
              className="text-sm mt-1 text-center"
              style={{ color: COLORS.textSecondary }}
            >
              Your attendance history will appear here once marked.
            </Text>
          </View>
        ) : (
          <View className="gap-4 pb-10">
            {records.map((record) => {
              const statusConfig = getStatusConfig(record.status);
              return (
                <View
                  key={record.id}
                  className="p-5 rounded-2xl border"
                  style={{
                    backgroundColor: COLORS.surface,
                    borderColor: COLORS.border,
                    ...platformShadow,
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: COLORS.background }}
                      >
                        <Calendar size={22} color={COLORS.textSecondary} />
                      </View>
                      <View>
                        <Text
                          className="text-base font-bold"
                          style={{ color: COLORS.textPrimary }}
                        >
                          {formatDate(record.attendanceDate)}
                        </Text>
                        <Text
                          className="text-xs font-medium mt-0.5"
                          style={{ color: COLORS.textTertiary }}
                        >
                          ID: {record.teacherId}
                        </Text>
                      </View>
                    </View>

                    <View
                      className="px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: statusConfig.bg }}
                    >
                      <Text
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: statusConfig.color }}
                      >
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>

                  {record.remarks && (
                    <View
                      className="mt-4 pt-4 border-t flex-row items-start gap-2"
                      style={{ borderTopColor: COLORS.border }}
                    >
                      <FileText
                        size={16}
                        color={COLORS.textTertiary}
                        style={{ marginTop: 2 }}
                      />
                      <Text
                        className="text-sm leading-5 flex-1"
                        style={{ color: COLORS.textSecondary }}
                      >
                        <Text
                          className="font-semibold"
                          style={{ color: COLORS.textPrimary }}
                        >
                          Remarks:{" "}
                        </Text>
                        {record.remarks}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
