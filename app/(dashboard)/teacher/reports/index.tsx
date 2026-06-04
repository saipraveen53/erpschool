import AsyncStorage from "@react-native-async-storage/async-storage";
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

const COLORS = {
  primary: "#E35336",
  accent: "#F5F50C",
  secondary: "#F4A460",
  primaryLight: "#FEE2DB",
  secondaryLight: "#FEF0E8",
  bgWarm: "#FFF8F2",
  bgWhite: "#FFFFFF",
  lightGray: "#F8F9FA",
  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  border: "#F0E4D8",
  white: "#FFFFFF",
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

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ present: 0, absent: 0, halfDay: 0 });

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      setLoading(true);
      try {
        let teacherId = "TCH2026001"; // Fallback ID
        if (Platform.OS === "web") {
          teacherId = localStorage.getItem("userUsername") || teacherId;
        } else {
          teacherId = (await AsyncStorage.getItem("userUsername")) || teacherId;
        }

        const res = await teacherClient.get(
          `/api/student/teacher/teacher/${teacherId}/attendance`,
        );

        const data = res.data || [];

        // Sort records by date (newest first)
        const sortedData = data.sort(
          (a: any, b: any) =>
            new Date(b.attendanceDate).getTime() -
            new Date(a.attendanceDate).getTime(),
        );

        setRecords(sortedData);

        // Calculate basic stats for the summary cards
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

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.bgWarm }}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* Header */}
      <View
        className="flex-row items-center justify-between px-5 pb-4 border-b"
        style={{
          paddingTop: Platform.OS === "android" ? 50 : 40,
          backgroundColor: COLORS.bgWhite,
          borderBottomColor: COLORS.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-xl"
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text
          className="text-xl font-bold tracking-tight"
          style={{ color: COLORS.textPrimary }}
        >
          My Attendance
        </Text>
        <View style={{ width: 40 }} />
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
            className="flex-1 bg-white p-4 rounded-2xl border items-center"
            style={{ borderColor: COLORS.border, ...platformShadow }}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: `${COLORS.success}1A` }}
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
            className="flex-1 bg-white p-4 rounded-2xl border items-center"
            style={{ borderColor: COLORS.border, ...platformShadow }}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: `${COLORS.danger}1A` }}
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
            className="flex-1 bg-white p-4 rounded-2xl border items-center"
            style={{ borderColor: COLORS.border, ...platformShadow }}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: `${COLORS.warning}1A` }}
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
            className="bg-white p-8 rounded-2xl border items-center"
            style={{ borderColor: COLORS.border, ...platformShadow }}
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
                  className="bg-white p-5 rounded-2xl border"
                  style={{
                    backgroundColor: COLORS.bgWhite,
                    borderColor: COLORS.border,
                    ...platformShadow,
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: COLORS.lightGray }}
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
                        <Text className="font-semibold text-textPrimary">
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
