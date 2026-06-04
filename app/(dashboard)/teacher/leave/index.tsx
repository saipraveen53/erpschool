import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle,
  ChevronDown,
  Clock,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
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
  primaryDark: "#C73E21",
  secondaryLight: "#FEF0E8",
  bgWarm: "#FFF8F2",
  bgWhite: "#FFFFFF",
  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  border: "#F0E4D8",
  white: "#FFFFFF",
  lightGray: "#F8F9FA",
};

// Dedicated axios instance for leave management endpoints
const leaveClient = axios.create({
  baseURL: "http://192.168.88.20:8081",
  timeout: 10000,
});

// Interceptor to attach JWT token from storage
leaveClient.interceptors.request.use(
  async (config) => {
    let token = null;
    const possibleKeys = [
      "authToken",
      "token",
      "jwt",
      "accessToken",
      "userToken",
    ];
    if (Platform.OS === "web") {
      for (const key of possibleKeys) {
        token = localStorage.getItem(key);
        if (token) break;
      }
    } else {
      for (const key of possibleKeys) {
        token = await AsyncStorage.getItem(key);
        if (token) break;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const LEAVE_TYPES = [
  { label: "Casual Leave (CL)", value: "CASUAL" },
  { label: "Sick Leave (SL)", value: "SICK" },
  { label: "Maternity Leave", value: "MATERNITY" },
  { label: "Other", value: "OTHER" },
];

const getLeaveTypeLabel = (value: string) => {
  const found = LEAVE_TYPES.find((t) => t.value === value);
  return found ? found.label : value;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusDisplay = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return {
        color: COLORS.success,
        bg: `${COLORS.success}1A`,
        icon: CheckCircle,
      };
    case "REJECTED":
      return { color: COLORS.error, bg: `${COLORS.error}1A`, icon: XCircle };
    default:
      return {
        color: COLORS.warning,
        bg: `${COLORS.warning}1A`,
        icon: Clock,
      };
  }
};

export default function LeaveManagementScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Teacher info (from original server)
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");

  // Leave stats
  const [totalPendingRequests, setTotalPendingRequests] = useState(0);
  const [totalRejectedLeaves, setTotalRejectedLeaves] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Apply leave modal
  const [isApplyModalVisible, setApplyModalVisible] = useState(false);
  const [isTypeDropdownVisible, setTypeDropdownVisible] = useState(false);
  const [selectedTypeValue, setSelectedTypeValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch teacher info (original server)
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

  // Fetch leave stats and history from the new server
  useEffect(() => {
    const fetchLeaveData = async () => {
      setStatsLoading(true);
      setHistoryLoading(true);
      setErrorMsg(null);
      try {
        // Fetch stats
        const statsRes = await leaveClient.get("/api/teacher/leave/getStats");
        setTotalPendingRequests(statsRes.data.totalPendingRequests || 0);
        setTotalRejectedLeaves(statsRes.data.totalRejectedLeaves || 0);

        // Fetch history
        const historyRes = await leaveClient.get("/api/teacher/leave/history");
        setLeaveHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      } catch (err: any) {
        console.error("Failed to load leave data:", err);
        setErrorMsg(err.response?.data?.message || "Failed to load data.");
      } finally {
        setStatsLoading(false);
        setHistoryLoading(false);
      }
    };
    fetchLeaveData();
  }, []);

  const handleApplyLeave = async () => {
    if (!selectedTypeValue || !startDate || !reason) {
      alert("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        reason,
        leaveType: selectedTypeValue,
        startDate,
        endDate: endDate || startDate,
      };
      await leaveClient.post("/api/teacher/leave/applyLeave", payload);
      alert("Leave application submitted successfully!");
      setApplyModalVisible(false);
      setSelectedTypeValue("");
      setStartDate("");
      setEndDate("");
      setReason("");

      // Refresh stats and history
      const statsRes = await leaveClient.get("/api/teacher/leave/getStats");
      setTotalPendingRequests(statsRes.data.totalPendingRequests || 0);
      setTotalRejectedLeaves(statsRes.data.totalRejectedLeaves || 0);

      const historyRes = await leaveClient.get("/api/teacher/leave/history");
      setLeaveHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
    } catch (err: any) {
      console.error("Failed to apply leave:", err);
      alert(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTypeLabel = selectedTypeValue
    ? getLeaveTypeLabel(selectedTypeValue)
    : "Select Leave Type";

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
          paddingTop: 40,
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
          Leave Management
        </Text>
        <TouchableOpacity
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${COLORS.primary}1A` }}
          onPress={() => setApplyModalVisible(true)}
        >
          <CalendarPlus size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Teacher Info Bar */}
      <View
        className="flex-row justify-between px-5 py-3 border-b"
        style={{
          backgroundColor: COLORS.primaryLight,
          borderBottomColor: COLORS.border,
        }}
      >
        <Text
          className="text-xs font-bold"
          style={{ color: COLORS.primaryDark, flex: 1 }}
          numberOfLines={1}
        >
          Teacher: {teacherName} ({teacherId})
        </Text>
        <Text
          className="text-xs font-bold"
          style={{ color: COLORS.primaryDark }}
          numberOfLines={1}
        >
          Class: {assignedClass}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 24,
          maxWidth: isDesktop ? 800 : "100%",
          alignSelf: "center",
          width: "100%",
          paddingBottom: 60,
        }}
      >
        {/* Leave Stats (replacing old balances) */}
        <Text
          className="text-lg font-bold mb-4"
          style={{ color: COLORS.textPrimary }}
        >
          Leave Statistics
        </Text>
        <View className="flex-row gap-4 mb-6">
          <View
            className="flex-1 bg-white py-5 rounded-2xl items-center border"
            style={{
              backgroundColor: COLORS.bgWhite,
              borderColor: COLORS.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {statsLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <Text
                  className="text-[28px] font-black"
                  style={{ color: COLORS.warning }}
                >
                  {totalPendingRequests}
                </Text>
                <Text
                  className="text-xs font-bold uppercase mt-1"
                  style={{ color: COLORS.textPrimary }}
                >
                  Pending
                </Text>
              </>
            )}
          </View>
          <View
            className="flex-1 bg-white py-5 rounded-2xl items-center border"
            style={{
              backgroundColor: COLORS.bgWhite,
              borderColor: COLORS.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {statsLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <Text
                  className="text-[28px] font-black"
                  style={{ color: COLORS.error }}
                >
                  {totalRejectedLeaves}
                </Text>
                <Text
                  className="text-xs font-bold uppercase mt-1"
                  style={{ color: COLORS.textPrimary }}
                >
                  Rejected
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Apply New Leave Button */}
        <TouchableOpacity
          className="py-[18px] rounded-2xl items-center mb-8"
          style={{
            backgroundColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
          activeOpacity={0.9}
          onPress={() => setApplyModalVisible(true)}
        >
          <Text className="text-white font-extrabold text-base tracking-wide">
            Apply for New Leave
          </Text>
        </TouchableOpacity>

        {/* Leave History */}
        <Text
          className="text-lg font-bold mb-4"
          style={{ color: COLORS.textPrimary }}
        >
          Leave History
        </Text>

        {historyLoading ? (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text
              className="mt-2 text-sm"
              style={{ color: COLORS.textSecondary }}
            >
              Loading history...
            </Text>
          </View>
        ) : errorMsg ? (
          <View
            className="bg-red-50 rounded-2xl p-6 items-center border"
            style={{ borderColor: COLORS.error }}
          >
            <Text
              className="text-lg font-bold mb-2"
              style={{ color: COLORS.error }}
            >
              Error
            </Text>
            <Text
              className="text-sm text-center mb-4"
              style={{ color: COLORS.textSecondary }}
            >
              {errorMsg}
            </Text>
            <TouchableOpacity
              className="px-6 py-3 rounded-full"
              style={{ backgroundColor: COLORS.primary }}
              onPress={() => {
                setStatsLoading(true);
                setHistoryLoading(true);
                setErrorMsg(null);
                const refetch = async () => {
                  try {
                    const statsRes = await leaveClient.get(
                      "/api/teacher/leave/getStats",
                    );
                    setTotalPendingRequests(
                      statsRes.data.totalPendingRequests || 0,
                    );
                    setTotalRejectedLeaves(
                      statsRes.data.totalRejectedLeaves || 0,
                    );
                    const historyRes = await leaveClient.get(
                      "/api/teacher/leave/history",
                    );
                    setLeaveHistory(
                      Array.isArray(historyRes.data) ? historyRes.data : [],
                    );
                  } catch (err: any) {
                    setErrorMsg(
                      err.response?.data?.message || "Failed to reload.",
                    );
                  } finally {
                    setStatsLoading(false);
                    setHistoryLoading(false);
                  }
                };
                refetch();
              }}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : leaveHistory.length === 0 ? (
          <View className="items-center py-12 gap-3">
            <CalendarPlus size={48} color={COLORS.textSecondary} />
            <Text
              className="text-lg font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              No leave applications yet
            </Text>
            <Text
              className="text-sm text-center"
              style={{ color: COLORS.textSecondary }}
            >
              Tap the + button to apply for leave
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {leaveHistory.map((leave) => {
              const StatusIcon = getStatusDisplay(leave.leaveStatus).icon;
              const statusColor = getStatusDisplay(leave.leaveStatus).color;
              const statusBg = getStatusDisplay(leave.leaveStatus).bg;
              const leaveTypeDisplay = getLeaveTypeLabel(leave.leaveType);
              const duration =
                leave.startDate === leave.endDate
                  ? formatDate(leave.startDate)
                  : `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`;
              const days =
                Math.ceil(
                  (new Date(leave.endDate).getTime() -
                    new Date(leave.startDate).getTime()) /
                    (1000 * 3600 * 24),
                ) + 1;

              return (
                <View
                  key={leave.leaveId}
                  className="bg-white p-5 rounded-2xl border-l-4"
                  style={{
                    backgroundColor: COLORS.bgWhite,
                    borderColor: COLORS.border,
                    borderLeftColor: COLORS.textSecondary,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text
                      className="text-base font-bold"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {leaveTypeDisplay}
                    </Text>
                    <View
                      className="flex-row items-center px-2 py-1 rounded-md gap-1"
                      style={{ backgroundColor: statusBg }}
                    >
                      <StatusIcon size={14} color={statusColor} />
                      <Text
                        className="text-xs font-bold"
                        style={{ color: statusColor }}
                      >
                        {leave.leaveStatus}
                      </Text>
                    </View>
                  </View>

                  <Text
                    className="text-xs font-semibold mb-3"
                    style={{ color: COLORS.textSecondary }}
                  >
                    {duration} • {days} Day(s)
                  </Text>

                  <View
                    className="bg-gray-100 p-3 rounded-lg"
                    style={{ backgroundColor: COLORS.lightGray }}
                  >
                    <Text
                      className="text-sm italic"
                      style={{ color: COLORS.textSecondary }}
                    >
                      "{leave.reason}"
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Apply Leave Modal (unchanged) */}
      <Modal visible={isApplyModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 bg-black/50 justify-end"
        >
          <View
            className="bg-white rounded-t-2xl p-6 max-h-[90%]"
            style={{
              backgroundColor: COLORS.bgWhite,
              maxWidth: isDesktop ? 600 : "100%",
              width: "100%",
              alignSelf: "center",
            }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text
                className="text-xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                Request Leave
              </Text>
              <TouchableOpacity
                onPress={() => setApplyModalVisible(false)}
                className="p-1"
              >
                <XCircle size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Leave Type Dropdown */}
              <View className="mb-5 z-10">
                <Text
                  className="text-sm font-bold mb-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  Leave Type
                </Text>
                <TouchableOpacity
                  className="flex-row justify-between items-center px-4 py-3.5 rounded-xl"
                  style={{ backgroundColor: COLORS.lightGray }}
                  onPress={() => setTypeDropdownVisible(!isTypeDropdownVisible)}
                >
                  <Text
                    className="text-base font-semibold"
                    style={{
                      color: !selectedTypeValue
                        ? `${COLORS.textSecondary}80`
                        : COLORS.textPrimary,
                    }}
                  >
                    {selectedTypeLabel}
                  </Text>
                  <ChevronDown size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
                {isTypeDropdownVisible && (
                  <View
                    className="bg-white rounded-xl mt-1 border"
                    style={{
                      borderColor: COLORS.border,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    {LEAVE_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type.value}
                        className="py-4 px-4 border-b"
                        style={{ borderBottomColor: COLORS.border }}
                        onPress={() => {
                          setSelectedTypeValue(type.value);
                          setTypeDropdownVisible(false);
                        }}
                      >
                        <Text
                          className="text-base font-medium"
                          style={{ color: COLORS.textPrimary }}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Start & End Date */}
              <View className="flex-row gap-4 mb-5">
                <View className="flex-1">
                  <Text
                    className="text-sm font-bold mb-2"
                    style={{ color: COLORS.textPrimary }}
                  >
                    Start Date
                  </Text>
                  <TextInput
                    className="px-4 py-3.5 rounded-xl text-base"
                    style={{
                      backgroundColor: COLORS.lightGray,
                      color: COLORS.textPrimary,
                    }}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={`${COLORS.textSecondary}80`}
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-bold mb-2"
                    style={{ color: COLORS.textPrimary }}
                  >
                    End Date (Optional)
                  </Text>
                  <TextInput
                    className="px-4 py-3.5 rounded-xl text-base"
                    style={{
                      backgroundColor: COLORS.lightGray,
                      color: COLORS.textPrimary,
                    }}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={`${COLORS.textSecondary}80`}
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>

              {/* Reason */}
              <View className="mb-5">
                <Text
                  className="text-sm font-bold mb-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  Reason
                </Text>
                <TextInput
                  className="px-4 py-3.5 rounded-xl text-base min-h-[100px]"
                  style={{
                    backgroundColor: COLORS.lightGray,
                    color: COLORS.textPrimary,
                    textAlignVertical: "top",
                  }}
                  placeholder="Explain briefly..."
                  placeholderTextColor={`${COLORS.textSecondary}80`}
                  multiline
                  numberOfLines={4}
                  value={reason}
                  onChangeText={setReason}
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              className="py-4 rounded-xl items-center mt-2"
              style={{ backgroundColor: COLORS.primary }}
              onPress={handleApplyLeave}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text className="text-white font-bold text-base">
                  Submit Application
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
