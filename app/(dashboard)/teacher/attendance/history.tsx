import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Users,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
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
  primaryDark: "#C73E21",
  secondaryLight: "#FEF0E8",
  bgWarm: "#FFF8F2",
  bgWhite: "#FFFFFF",
  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  successLight: "#D1FAE5",
  dangerLight: "#FEE2E2",
  warningLight: "#FEF3C7",
  border: "#F0E4D8",
  present: "#10B981",
  absent: "#EF4444",
  holiday: "#F59E0B",
  notMarked: "#9CA3AF",
  presentLight: "#D1FAE5",
  absentLight: "#FEE2E2",
  holidayLight: "#FEF3C7",
  notMarkedLight: "#F3F4F6",
};

const formatDateForAPI = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

export default function AttendanceHistoryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Teacher & class info
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");
  const [classSectionId, setClassSectionId] = useState("");

  // Date range
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());

  // Date Picker Modal State
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [activePicker, setActivePicker] = useState<"start" | "end" | null>(
    null,
  );
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  // Attendance history data
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Animation refs
  const fadeAnims = useRef<Animated.Value[]>([]);
  const slideAnims = useRef<Animated.Value[]>([]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return { bg: COLORS.presentLight, text: COLORS.present };
      case "ABSENT":
        return { bg: COLORS.absentLight, text: COLORS.absent };
      case "HOLIDAY":
        return { bg: COLORS.holidayLight, text: COLORS.holiday };
      default:
        return { bg: COLORS.notMarkedLight, text: COLORS.notMarked };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "Present";
      case "ABSENT":
        return "Absent";
      case "HOLIDAY":
        return "Holiday";
      default:
        return "Not Marked";
    }
  };

  // Fetch teacher info once
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const currentTeacherId =
          Platform.OS === "web"
            ? localStorage.getItem("userUsername")
            : await AsyncStorage.getItem("userUsername");
        if (!currentTeacherId) {
          setErrorMsg("Teacher ID not found.");
          return;
        }
        setTeacherId(currentTeacherId);

        const classSectionsRes = await teacherClient.get(
          "/api/student/class-sections",
        );
        const fetchedClasses = classSectionsRes.data;
        const assigned = fetchedClasses.find(
          (c: any) => c.classTeacherId === currentTeacherId,
        );
        if (!assigned) {
          setErrorMsg("No assigned class found for this teacher.");
          return;
        }
        setTeacherName(assigned.classTeacherName.trim());
        setAssignedClass(
          `${assigned.className}-${assigned.section.toUpperCase()}`,
        );
        setClassSectionId(assigned.classSectionId);
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Failed to load teacher info.");
      }
    };
    fetchTeacherInfo();
  }, []);

  // Fetch attendance for the selected date range
  const fetchHistory = async () => {
    if (!classSectionId) {
      setErrorMsg("Class section not loaded yet.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const startStr = formatDateForAPI(startDate);
      const endStr = formatDateForAPI(endDate);
      const response = await teacherClient.get(
        `/api/student/attendance/class/${classSectionId}/range?startDate=${startStr}&endDate=${endStr}`,
      );
      const data = response.data;
      if (data && data.history && Array.isArray(data.history)) {
        setHistoryData(data.history);
      } else {
        setHistoryData([]);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setErrorMsg(
        err.response?.data?.message || "Failed to fetch attendance history.",
      );
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when classSectionId is ready
  useEffect(() => {
    if (classSectionId) {
      fetchHistory();
    }
  }, [classSectionId]);

  // Ensure animation refs are initialized BEFORE render
  if (fadeAnims.current.length !== historyData.length) {
    fadeAnims.current = historyData.map(() => new Animated.Value(0));
    slideAnims.current = historyData.map(() => new Animated.Value(30));
  }

  // Update animations when historyData changes
  useEffect(() => {
    if (historyData.length === 0) return;

    Animated.stagger(
      120,
      fadeAnims.current.map((anim, idx) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnims.current[idx], {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
  }, [historyData]);

  // Web date pickers
  const WebDatePicker = () => (
    <View className="flex-row gap-4 mb-4">
      <View className="flex-1">
        <Text
          className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: COLORS.textSecondary }}
        >
          Start Date
        </Text>
        <input
          type="date"
          value={formatDateForAPI(startDate)}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.border,
            backgroundColor: COLORS.bgWhite,
            fontSize: 14,
            color: COLORS.textPrimary,
          }}
        />
      </View>
      <View className="flex-1">
        <Text
          className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: COLORS.textSecondary }}
        >
          End Date
        </Text>
        <input
          type="date"
          value={formatDateForAPI(endDate)}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.border,
            backgroundColor: COLORS.bgWhite,
            fontSize: 14,
            color: COLORS.textPrimary,
          }}
        />
      </View>
    </View>
  );

  // Native custom calendar picker
  const NativeDatePicker = () => (
    <View className="flex-row gap-4 mb-4">
      <View className="flex-1">
        <Text
          className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: COLORS.textSecondary }}
        >
          Start Date
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-between border rounded-xl p-3.5"
          style={{
            borderColor: COLORS.border,
            backgroundColor: COLORS.bgWhite,
          }}
          onPress={() => {
            setActivePicker("start");
            setPickerMonth(startDate.getMonth());
            setPickerYear(startDate.getFullYear());
            setDatePickerVisible(true);
          }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: COLORS.textPrimary }}
          >
            {formatDateForAPI(startDate)}
          </Text>
          <CalendarIcon size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        <Text
          className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: COLORS.textSecondary }}
        >
          End Date
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-between border rounded-xl p-3.5"
          style={{
            borderColor: COLORS.border,
            backgroundColor: COLORS.bgWhite,
          }}
          onPress={() => {
            setActivePicker("end");
            setPickerMonth(endDate.getMonth());
            setPickerYear(endDate.getFullYear());
            setDatePickerVisible(true);
          }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: COLORS.textPrimary }}
          >
            {formatDateForAPI(endDate)}
          </Text>
          <CalendarIcon size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(pickerYear, pickerMonth);
    const firstDay = getFirstDayOfMonth(pickerYear, pickerMonth);
    const daysArray: { date: Date | null; day?: number; key: string }[] = [];

    for (let i = 0; i < firstDay; i++) {
      daysArray.push({ date: null, key: `empty-${i}` });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(pickerYear, pickerMonth, d);
      daysArray.push({
        date: dateObj,
        day: d,
        key: d.toString(),
      });
    }

    return (
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            onPress={() => {
              if (pickerMonth === 0) {
                setPickerMonth(11);
                setPickerYear(pickerYear - 1);
              } else {
                setPickerMonth(pickerMonth - 1);
              }
            }}
            className="p-2"
          >
            <ChevronLeft size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text
            className="text-lg font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            {new Date(pickerYear, pickerMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {pickerYear}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (pickerMonth === 11) {
                setPickerMonth(0);
                setPickerYear(pickerYear + 1);
              } else {
                setPickerMonth(pickerMonth + 1);
              }
            }}
            className="p-2"
          >
            <ChevronRight size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <View className="flex-row mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <View key={d} className="flex-1 items-center">
              <Text
                className="text-xs font-semibold"
                style={{ color: COLORS.textSecondary }}
              >
                {d}
              </Text>
            </View>
          ))}
        </View>
        <FlatList
          data={daysArray}
          numColumns={7}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            if (!item.date) {
              return (
                <View className="flex-1 aspect-square p-1">
                  <View className="flex-1" />
                </View>
              );
            }

            const dateStr = formatDateForAPI(item.date);
            const isSelected =
              activePicker === "start"
                ? formatDateForAPI(startDate) === dateStr
                : formatDateForAPI(endDate) === dateStr;

            return (
              <View className="flex-1 aspect-square p-1">
                <TouchableOpacity
                  className="flex-1 justify-center items-center rounded-full"
                  style={{
                    backgroundColor: isSelected
                      ? COLORS.primary
                      : "transparent",
                  }}
                  onPress={() => {
                    if (activePicker === "start") {
                      setStartDate(item.date!);
                    } else {
                      setEndDate(item.date!);
                    }
                    setDatePickerVisible(false);
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: isSelected ? COLORS.white : COLORS.textPrimary,
                    }}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          scrollEnabled={false}
        />
      </View>
    );
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
          className="text-xl font-bold tracking-tight text-center"
          style={{ color: COLORS.textPrimary }}
        >
          Attendance History
        </Text>
        <View style={{ width: 40 }} />
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

      {/* Date Range Selector */}
      <View
        className="px-5 pt-4 pb-4 bg-white border-b"
        style={{ borderBottomColor: COLORS.border }}
      >
        {Platform.OS === "web" ? <WebDatePicker /> : <NativeDatePicker />}
        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-1 mr-4">
            <Text
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: COLORS.textSecondary }}
            >
              Selected Range
            </Text>
            <Text
              className="text-sm font-semibold"
              style={{ color: COLORS.textPrimary }}
            >
              {formatDisplayDate(startDate)} → {formatDisplayDate(endDate)}
            </Text>
          </View>
          <TouchableOpacity
            className="px-5 py-3 rounded-full flex-row items-center justify-center gap-2"
            style={{ backgroundColor: COLORS.primary, minWidth: 100 }}
            onPress={fetchHistory}
            disabled={loading}
          >
            <Search size={16} color={COLORS.white} />
            <Text className="text-white font-bold text-sm">Fetch</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            className="mt-4 text-sm"
            style={{ color: COLORS.textSecondary }}
          >
            Loading history...
          </Text>
        </View>
      ) : errorMsg ? (
        <View className="flex-1 justify-center items-center px-6">
          <View
            className="bg-red-50 rounded-2xl p-6 items-center border"
            style={{ borderColor: COLORS.danger, backgroundColor: "#FEF2F2" }}
          >
            <AlertCircle size={40} color={COLORS.danger} />
            <Text
              className="text-lg font-bold mb-2 mt-2"
              style={{ color: COLORS.danger }}
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
              onPress={fetchHistory}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : historyData.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <CalendarIcon size={48} color={COLORS.textTertiary} />
          <Text
            className="text-lg font-bold mt-4"
            style={{ color: COLORS.textPrimary }}
          >
            No records found
          </Text>
          <Text
            className="text-sm mt-2"
            style={{ color: COLORS.textSecondary }}
          >
            Select a date range and tap Fetch
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 24,
            maxWidth: isDesktop ? 800 : "100%",
            alignSelf: "center",
            width: "100%",
            gap: 16,
          }}
        >
          {historyData.map((record, index) => (
            <Animated.View
              key={record.date}
              style={{
                opacity: fadeAnims.current[index],
                transform: [{ translateY: slideAnims.current[index] }],
              }}
            >
              <View
                className="rounded-2xl p-5 border"
                style={{
                  backgroundColor: COLORS.bgWhite,
                  borderColor: COLORS.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                {/* Header row: date badge + status badges */}
                <View
                  className="flex-row justify-between items-center mb-4 pb-3 border-b"
                  style={{ borderBottomColor: COLORS.border }}
                >
                  <View
                    className="flex-row items-center px-3 py-1.5 rounded-full gap-1.5"
                    style={{ backgroundColor: COLORS.primaryLight }}
                  >
                    <CalendarIcon size={14} color={COLORS.primary} />
                    <Text
                      className="font-semibold text-xs"
                      style={{ color: COLORS.primary }}
                    >
                      {formatDate(record.date)}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    {record.isHoliday ? (
                      <View
                        className="px-2 py-1 rounded-md"
                        style={{ backgroundColor: COLORS.secondaryLight }}
                      >
                        <Text
                          className="text-[10px] font-bold"
                          style={{ color: COLORS.secondary }}
                        >
                          Holiday
                        </Text>
                      </View>
                    ) : record.notMarkedCount > 0 ? (
                      <View
                        className="px-2 py-1 rounded-md"
                        style={{ backgroundColor: COLORS.warningLight }}
                      >
                        <Text
                          className="text-[10px] font-bold"
                          style={{ color: COLORS.warning }}
                        >
                          Not Marked
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {/* Class info */}
                <View className="flex-row items-center gap-3 mb-4">
                  <View
                    className="w-11 h-11 rounded-xl justify-center items-center"
                    style={{ backgroundColor: COLORS.textPrimary }}
                  >
                    <Users size={20} color={COLORS.white} />
                  </View>
                  <View>
                    <Text
                      className="text-lg font-bold"
                      style={{ color: COLORS.textPrimary }}
                    >
                      Class {assignedClass}
                    </Text>
                    <Text
                      className="text-xs font-medium"
                      style={{ color: COLORS.textTertiary }}
                    >
                      Total Students: {record.students?.length || 0}
                    </Text>
                  </View>
                </View>

                {/* Summary stats row (if not holiday and not all not marked) */}
                {!record.isHoliday &&
                  record.presentCount + record.absentCount > 0 && (
                    <View className="flex-row gap-3 mb-4">
                      <View
                        className="flex-1 flex-row justify-between items-center px-4 py-3 rounded-xl"
                        style={{ backgroundColor: COLORS.successLight }}
                      >
                        <Text
                          className="font-semibold text-sm"
                          style={{ color: COLORS.textPrimary }}
                        >
                          Present
                        </Text>
                        <Text
                          className="font-bold text-lg"
                          style={{ color: COLORS.success }}
                        >
                          {record.presentCount}
                        </Text>
                      </View>
                      <View
                        className="flex-1 flex-row justify-between items-center px-4 py-3 rounded-xl"
                        style={{ backgroundColor: COLORS.dangerLight }}
                      >
                        <Text
                          className="font-semibold text-sm"
                          style={{ color: COLORS.textPrimary }}
                        >
                          Absent
                        </Text>
                        <Text
                          className="font-bold text-lg"
                          style={{ color: COLORS.danger }}
                        >
                          {record.absentCount}
                        </Text>
                      </View>
                    </View>
                  )}

                {/* Student list */}
                {record.students && record.students.length > 0 && (
                  <View className="mt-2">
                    <Text
                      className="text-sm font-semibold mb-2"
                      style={{ color: COLORS.textPrimary }}
                    >
                      Student Attendance
                    </Text>
                    <View className="gap-2">
                      {record.students.map((student: any, idx: number) => {
                        const { bg, text } = getStatusColor(student.status);
                        const statusText = getStatusText(student.status);
                        return (
                          <View
                            key={student.studentId || idx}
                            className="flex-row items-center justify-between p-3 rounded-xl"
                            style={{ backgroundColor: bg }}
                          >
                            <View className="flex-row items-center gap-2 flex-1">
                              <User size={16} color={text} />
                              <Text
                                className="font-medium text-sm"
                                style={{ color: COLORS.textPrimary }}
                              >
                                {student.name}
                              </Text>
                            </View>
                            <View
                              className="px-2 py-1 rounded-md"
                              style={{ backgroundColor: text + "20" }}
                            >
                              <Text
                                className="text-xs font-semibold"
                                style={{ color: text }}
                              >
                                {statusText}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Message when no students data */}
                {(!record.students || record.students.length === 0) &&
                  !record.isHoliday && (
                    <View className="py-3 items-center rounded-xl bg-gray-100">
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: COLORS.textSecondary }}
                      >
                        No student attendance data available
                      </Text>
                    </View>
                  )}

                {/* Holiday message */}
                {record.isHoliday && (
                  <View
                    className="py-3 items-center rounded-xl"
                    style={{ backgroundColor: COLORS.holidayLight }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: COLORS.holiday }}
                    >
                      Holiday - No attendance taken
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      )}

      {/* Custom Calendar Modal */}
      <Modal
        visible={datePickerVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className="bg-white rounded-3xl w-11/12 max-w-md"
            style={{ backgroundColor: COLORS.bgWhite }}
          >
            <View
              className="flex-row justify-between items-center p-4 border-b"
              style={{ borderColor: COLORS.border }}
            >
              <Text
                className="text-lg font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                Select {activePicker === "start" ? "Start" : "End"} Date
              </Text>
              <TouchableOpacity onPress={() => setDatePickerVisible(false)}>
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            {renderCalendar()}
            <View
              className="p-4 border-t"
              style={{ borderColor: COLORS.border }}
            >
              <TouchableOpacity
                onPress={() => setDatePickerVisible(false)}
                className="py-3 rounded-xl items-center"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Text className="text-white font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
