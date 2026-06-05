import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  info: "#3B82F6",
  present: "#10B981",
  absent: "#EF4444",
  presentLight: "#D1FAE5",
  absentLight: "#FEE2E2",
};

// Format date as YYYY-MM-DD (local time)
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export default function MarkAttendanceScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [assignedClass, setAssignedClass] = useState("");
  const [classSectionId, setClassSectionId] = useState("");

  const [selectedClass, setSelectedClass] = useState("Loading...");
  const [students, setStudents] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFutureDateWarning, setIsFutureDateWarning] = useState(false);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const fetchAttendanceForDate = async (date: Date) => {
    if (!classSectionId) return;
    try {
      const dateStr = formatDateForAPI(date);
      const response = await teacherClient.get(
        `/api/student/attendance/class/${classSectionId}/date/${dateStr}`,
      );
      if (response.data && Array.isArray(response.data)) {
        const formatted = response.data.map((student: any) => ({
          id: student.studentId,
          name: student.name,
          roll: student.studentId,
          status: student.status === "ABSENT" ? "absent" : "present",
        }));
        setStudents(formatted);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Failed to fetch attendance for date:", error);
      Alert.alert("Error", "Could not load attendance for selected date.");
      setStudents([]);
    }
  };

  const handleDateChange = (newDate: Date) => {
    const todayStr = formatDateForAPI(new Date());
    const newDateStr = formatDateForAPI(newDate);
    const isFuture = newDateStr > todayStr;
    setIsFutureDateWarning(isFuture);
    setSelectedDate(newDate);
    setCalendarVisible(false);
  };

  const changeDateByDays = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    handleDateChange(newDate);
  };

  const resetToToday = () => {
    handleDateChange(new Date());
  };

  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const todayStr = formatDateForAPI(new Date());

    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push({ date: null, key: `empty-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const dateStr = formatDateForAPI(dateObj);
      const isSelected = dateStr === formatDateForAPI(selectedDate);
      const isToday = dateStr === todayStr;
      daysArray.push({
        date: dateObj,
        day: d,
        isSelected,
        isToday,
        key: d.toString(),
      });
    }

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            onPress={goPrevMonth}
            className="p-2 rounded-full bg-white/20"
          >
            <ChevronLeft size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text
            className="text-lg font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </Text>
          <TouchableOpacity
            onPress={goNextMonth}
            className="p-2 rounded-full bg-white/20"
          >
            <ChevronRight size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View className="flex-row mb-2">
          {weekDays.map((day) => (
            <View key={day} className="flex-1 items-center">
              <Text
                className="text-xs font-semibold"
                style={{ color: COLORS.textSecondary }}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        <FlatList
          data={daysArray}
          numColumns={7}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View className="flex-1 aspect-square p-1">
              {item.date ? (
                <TouchableOpacity
                  className="flex-1 justify-center items-center rounded-full"
                  style={[
                    item.isSelected && { backgroundColor: COLORS.primary },
                    item.isToday &&
                      !item.isSelected && {
                        backgroundColor: COLORS.primaryLight,
                      },
                  ]}
                  onPress={() => handleDateChange(item.date)}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: item.isSelected
                        ? COLORS.surface
                        : item.isToday
                          ? COLORS.primary
                          : COLORS.textPrimary,
                    }}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="flex-1" />
              )}
            </View>
          )}
          scrollEnabled={false}
        />
      </View>
    );
  };

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const currentTeacherId =
          Platform.OS === "web"
            ? localStorage.getItem("userUsername")
            : await AsyncStorage.getItem("userUsername");

        if (currentTeacherId) {
          setTeacherId(currentTeacherId);
        } else {
          console.error("No Teacher Username found in storage");
          setIsLoading(false);
          return;
        }

        const classSectionsRes = await teacherClient.get(
          "/api/student/class-sections",
        );
        const fetchedClasses = classSectionsRes.data;

        const assigned = fetchedClasses.find(
          (c: any) => c.classTeacherId === currentTeacherId,
        );

        if (assigned) {
          const classStr = `${assigned.className}-${assigned.section.toUpperCase()}`;
          setAssignedClass(classStr);
          setSelectedClass(classStr);
          setTeacherName(assigned.classTeacherName.trim());
          setClassSectionId(assigned.classSectionId);

          await fetchAttendanceForDate(selectedDate);
        } else {
          setAssignedClass("None");
          setSelectedClass("No Assigned Class");
          setTeacherName("Not Found");
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to load attendance framework records:", error);
        Alert.alert(
          "Error",
          "Could not synchronize attendance records with the server.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  useEffect(() => {
    if (classSectionId) {
      fetchAttendanceForDate(selectedDate);
    }
  }, [classSectionId, selectedDate]);

  const toggleStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              status: student.status === "present" ? "absent" : "present",
            }
          : student,
      ),
    );
  };

  const handleSave = async () => {
    if (!classSectionId || students.length === 0) {
      Alert.alert("Notice", "No active records to submit.");
      return;
    }

    if (isFutureDateWarning) {
      Alert.alert(
        "Future Date",
        "You are marking attendance for a future date. Are you sure?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Proceed", onPress: () => submitAttendance() },
        ],
      );
    } else {
      submitAttendance();
    }
  };

  const submitAttendance = async () => {
    setIsSubmitting(true);
    try {
      const dateStr = formatDateForAPI(selectedDate);
      const presentCount = students.filter(
        (s) => s.status === "present",
      ).length;

      const payload = {
        classSectionId: classSectionId,
        date: dateStr,
        entries: students.map((s) => ({
          studentId: s.id,
          status: s.status.toUpperCase(),
        })),
      };

      await teacherClient.post(
        `/api/student/attendance/mark/${classSectionId}/${teacherId}`,
        payload,
      );

      Alert.alert(
        "Saved Successfully",
        `Attendance for ${formatDisplayDate(selectedDate)} submitted.\n${presentCount} Present, ${students.length - presentCount} Absent.`,
      );
      router.back();
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("Submission Error", error.response.data.message);
      } else {
        Alert.alert("Error", "Failed to submit attendance records.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const WebDatePicker = () => (
    <input
      type="date"
      value={formatDateForAPI(selectedDate)}
      onChange={(e) => handleDateChange(new Date(e.target.value))}
      style={{
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        fontSize: 14,
        fontFamily: "system-ui",
        color: COLORS.textPrimary,
        width: "100%",
      }}
    />
  );

  const NativeDateNavigator = () => (
    <View className="flex-row items-center justify-between gap-3">
      <TouchableOpacity
        onPress={() => changeDateByDays(-1)}
        className="p-3 rounded-full"
        style={{ backgroundColor: COLORS.primaryLight }}
      >
        <ChevronLeft size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={resetToToday}
        className="px-5 py-2 rounded-full"
        style={{ backgroundColor: COLORS.secondaryLight || "#D1FAE5" }}
      >
        <Text
          className="text-xs font-semibold"
          style={{ color: COLORS.secondary }}
        >
          Today
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => changeDateByDays(1)}
        className="p-3 rounded-full"
        style={{ backgroundColor: COLORS.primaryLight }}
      >
        <ChevronRight size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.navy}
        translucent={false}
      />

      {/* Gradient Header */}
      <LinearGradient
        colors={[COLORS.navy, COLORS.navyLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          paddingTop: Platform.OS === "android" ? 48 : 40,
          paddingBottom: 20,
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
            Mark Attendance
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/teacher/attendance/history")}
            className="px-4 py-2 rounded-full bg-white/20"
          >
            <Text
              className="font-semibold text-sm"
              style={{ color: COLORS.surface }}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View
        className="flex-1 w-full self-center"
        style={{ maxWidth: isDesktop ? 800 : "100%" }}
      >
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
            Teacher: {teacherName || "Loading..."} ({teacherId || "Loading..."})
          </Text>
          <Text
            className="text-xs font-medium"
            style={{ color: COLORS.textSecondary }}
          >
            Class: {assignedClass || "Loading..."}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Assigned Class Card */}
          <View
            className="mx-4 mt-5 p-5 rounded-2xl"
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
              className="text-sm font-semibold mb-2"
              style={{ color: COLORS.textSecondary }}
            >
              Assigned Class
            </Text>
            <View
              className="px-4 py-3.5 rounded-xl"
              style={{ backgroundColor: COLORS.primaryLight }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text
                  className="text-base font-semibold"
                  style={{ color: COLORS.textPrimary }}
                >
                  {selectedClass}
                </Text>
              )}
            </View>
          </View>

          {/* Date Picker Card */}
          <View
            className="mx-4 mb-4 p-5 rounded-2xl"
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
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Calendar size={18} color={COLORS.primary} />
                <Text
                  className="font-semibold"
                  style={{ color: COLORS.textPrimary }}
                >
                  Select Date
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCalendarVisible(true)}
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: COLORS.primaryLight,
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: COLORS.primary }}
                >
                  Open Calendar
                </Text>
              </TouchableOpacity>
            </View>

            {Platform.OS === "web" ? (
              <WebDatePicker />
            ) : (
              <NativeDateNavigator />
            )}
            <Text
              className="text-center text-base font-bold mt-4"
              style={{ color: COLORS.textPrimary }}
            >
              {formatDisplayDate(selectedDate)}
            </Text>
            {isFutureDateWarning && (
              <Text
                className="text-xs text-center mt-2"
                style={{ color: COLORS.absent }}
              >
                ⚠️ Future date – marking may not be allowed by the system.
              </Text>
            )}
          </View>

          {/* Student List */}
          {isLoading ? (
            <View className="py-20 justify-center items-center">
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View className="px-4">
              {students.map((student) => (
                <View
                  key={student.id}
                  className="flex-row justify-between items-center p-4 rounded-2xl mb-3"
                  style={[
                    student.status === "present"
                      ? {
                          backgroundColor: COLORS.presentLight,
                          borderWidth: 1,
                          borderColor: COLORS.success,
                        }
                      : {
                          backgroundColor: COLORS.absentLight,
                          borderWidth: 1,
                          borderColor: COLORS.danger,
                        },
                  ]}
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-12 h-12 rounded-full justify-center items-center mr-3.5"
                      style={{
                        backgroundColor: COLORS.primaryLight,
                      }}
                    >
                      <Text
                        className="font-bold text-lg"
                        style={{ color: COLORS.primary }}
                      >
                        {student.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-base font-semibold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {student.name}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className="px-5 py-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          student.status === "present"
                            ? COLORS.success
                            : COLORS.surface,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                      }}
                      onPress={() => toggleStatus(student.id)}
                    >
                      <Text
                        className="font-bold text-sm"
                        style={{
                          color:
                            student.status === "present"
                              ? COLORS.surface
                              : COLORS.textSecondary,
                        }}
                      >
                        P
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="px-5 py-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          student.status === "absent"
                            ? COLORS.danger
                            : COLORS.surface,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                      }}
                      onPress={() => toggleStatus(student.id)}
                    >
                      <Text
                        className="font-bold text-sm"
                        style={{
                          color:
                            student.status === "absent"
                              ? COLORS.surface
                              : COLORS.textSecondary,
                        }}
                      >
                        A
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Fixed Submit Button */}
        <View
          className="absolute bottom-0 w-full px-5 pt-4 pb-6"
          style={{
            backgroundColor: COLORS.surface,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}
        >
          <TouchableOpacity
            className="py-4 rounded-2xl items-center"
            style={{ backgroundColor: COLORS.primary }}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Text className="text-white font-bold text-base">
                Submit Attendance
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={calendarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className="bg-white rounded-3xl w-11/12 max-w-md"
            style={{ backgroundColor: COLORS.surface }}
          >
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-row justify-between items-center p-4 rounded-t-3xl"
            >
              <Text
                className="text-lg font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                Select a Date
              </Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <X size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </LinearGradient>
            {renderCalendar()}
            <View
              className="p-4 border-t"
              style={{ borderColor: COLORS.border }}
            >
              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
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
