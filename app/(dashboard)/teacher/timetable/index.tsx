import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Clock, MapPin } from "lucide-react-native";
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
  danger: "#EF4444",
  warning: "#F59E0B",
  cardBg: "#FFFFFF",
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TimetableScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [activeTab, setActiveTab] = useState<
    "MY_TIMETABLE" | "CLASS_TIMETABLE"
  >("MY_TIMETABLE");

  const [isLoading, setIsLoading] = useState(true);
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [assignedClass, setAssignedClass] = useState("Loading...");
  const [classSectionId, setClassSectionId] = useState("");

  // Store the fetched and formatted data
  const [myTimetable, setMyTimetable] = useState<Record<string, any[]>>({});
  const [classTimetable, setClassTimetable] = useState<Record<string, any[]>>(
    {},
  );

  // Helper function to transform API response into the UI-friendly format
  const formatTimetableData = (apiData: any[]) => {
    const formattedData: Record<string, any[]> = {};

    // Initialize all days as empty arrays
    DAYS.forEach((day) => {
      formattedData[day] = [];
    });

    apiData.forEach((dayData) => {
      // Capitalize first letter of day (e.g., MONDAY -> Monday)
      const dayName =
        dayData.day.charAt(0).toUpperCase() +
        dayData.day.slice(1).toLowerCase();

      if (formattedData[dayName]) {
        formattedData[dayName] = dayData.periods.map(
          (p: any, index: number) => ({
            id: `${dayName}-${index}`,
            startTime: p.startTime,
            endTime: p.endTime,
            subject: p.subjectName,
            classStr: `${p.className}-${p.section.toUpperCase()}`,
            room: p.room || "TBD",
            type: "class",
          }),
        );
      }
    });

    return formattedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentTeacherId =
          Platform.OS === "web"
            ? localStorage.getItem("userUsername")
            : await AsyncStorage.getItem("userUsername");

        if (!currentTeacherId) {
          console.error("No teacher ID found in storage.");
          setIsLoading(false);
          return;
        }

        setTeacherId(currentTeacherId);

        // 1. Fetch class sections to find the teacher's own class (like dashboard)
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
          setTeacherName(assigned.classTeacherName.trim());
          setClassSectionId(assigned.classSectionId);
        } else {
          setAssignedClass("None");
          setTeacherName("Not Found");
          setClassSectionId("");
        }

        // 2. Fetch timetables (my timetable and class timetable)
        // Use the teacher ID for both; the backend will return appropriate data
        const [myRes, classRes] = await Promise.all([
          teacherClient.get(
            `/api/student/teacher/${currentTeacherId}/weekly-timetable`,
          ),
          teacherClient.get(
            `/api/student/teacher/${currentTeacherId}/class-timetable`,
          ),
        ]);

        if (myRes.data) {
          if (myRes.data.teacherName && teacherName === "") {
            setTeacherName(myRes.data.teacherName);
          }
          setMyTimetable(formatTimetableData(myRes.data.weeklyTimetable));
        }

        if (classRes.data) {
          setClassTimetable(formatTimetableData(classRes.data.weeklyTimetable));
        }
      } catch (error) {
        console.error("Error fetching timetables:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Determine which dataset to display based on the active tab
  const currentSchedule =
    activeTab === "MY_TIMETABLE"
      ? myTimetable[selectedDay] || []
      : classTimetable[selectedDay] || [];

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
            Timetable
          </Text>
          <View style={{ width: 40 }} />
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

        {/* Tab Switcher - modernized */}
        <View className="flex-row p-4 mt-2 gap-3">
          <TouchableOpacity
            className="flex-1 py-3 items-center rounded-xl"
            style={{
              backgroundColor:
                activeTab === "MY_TIMETABLE" ? COLORS.primary : COLORS.surface,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                },
                android: { elevation: activeTab === "MY_TIMETABLE" ? 2 : 0 },
                web: {
                  boxShadow:
                    activeTab === "MY_TIMETABLE"
                      ? "0px 2px 4px rgba(0,0,0,0.1)"
                      : "none",
                },
              }),
            }}
            onPress={() => setActiveTab("MY_TIMETABLE")}
            activeOpacity={0.8}
          >
            <Text
              className="font-bold text-sm"
              style={{
                color:
                  activeTab === "MY_TIMETABLE"
                    ? COLORS.surface
                    : COLORS.textSecondary,
              }}
            >
              My Timetable
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 py-3 items-center rounded-xl"
            style={{
              backgroundColor:
                activeTab === "CLASS_TIMETABLE"
                  ? COLORS.primary
                  : COLORS.surface,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                },
                android: { elevation: activeTab === "CLASS_TIMETABLE" ? 2 : 0 },
                web: {
                  boxShadow:
                    activeTab === "CLASS_TIMETABLE"
                      ? "0px 2px 4px rgba(0,0,0,0.1)"
                      : "none",
                },
              }),
            }}
            onPress={() => setActiveTab("CLASS_TIMETABLE")}
            activeOpacity={0.8}
          >
            <Text
              className="font-bold text-sm"
              style={{
                color:
                  activeTab === "CLASS_TIMETABLE"
                    ? COLORS.surface
                    : COLORS.textSecondary,
              }}
            >
              Class Timetable
            </Text>
          </TouchableOpacity>
        </View>

        {/* Day Selector - modernized */}
        <View className="py-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {DAYS.map((day) => {
              const isActive = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  className="px-5 py-2.5 rounded-full"
                  style={[
                    isActive
                      ? { backgroundColor: COLORS.primary }
                      : {
                          backgroundColor: COLORS.surface,
                          borderWidth: 1,
                          borderColor: COLORS.border,
                        },
                  ]}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: isActive ? COLORS.surface : COLORS.textSecondary,
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Timetable List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text
              className="mt-4 text-sm font-semibold"
              style={{ color: COLORS.textSecondary }}
            >
              Loading schedule...
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 40,
            }}
          >
            {currentSchedule.length === 0 ? (
              <View className="items-center justify-center mt-16">
                <Text
                  className="text-base font-semibold"
                  style={{ color: COLORS.textSecondary }}
                >
                  No classes scheduled for {selectedDay}.
                </Text>
              </View>
            ) : (
              currentSchedule.map((period, index) => {
                const isFree = period.type === "free";
                return (
                  <View key={period.id} className="flex-row mb-5">
                    {/* Left Timeline */}
                    <View className="w-[85px] items-end pr-4 relative">
                      <Text
                        className="text-sm font-bold mb-1"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {period.startTime}
                      </Text>
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {period.endTime}
                      </Text>
                      {index !== currentSchedule.length - 1 && (
                        <View
                          className="absolute right-0 top-10 -bottom-7 w-[2px]"
                          style={{ backgroundColor: COLORS.border }}
                        />
                      )}
                    </View>

                    {/* Right Details - Card style */}
                    <View
                      className="flex-1 rounded-2xl p-4 border-l-4"
                      style={[
                        isFree
                          ? {
                              backgroundColor: COLORS.primaryLight,
                              borderLeftColor: COLORS.textTertiary,
                            }
                          : {
                              backgroundColor: COLORS.surface,
                              borderLeftColor: COLORS.primary,
                              ...Platform.select({
                                ios: {
                                  shadowColor: "#000",
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.05,
                                  shadowRadius: 4,
                                },
                                android: { elevation: 2 },
                                web: {
                                  boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
                                },
                              }),
                            },
                      ]}
                    >
                      <View className="flex-row justify-between items-center mb-3">
                        <Text
                          className="text-lg font-bold capitalize"
                          style={{
                            color: isFree
                              ? COLORS.textSecondary
                              : COLORS.textPrimary,
                          }}
                        >
                          {period.subject}
                        </Text>
                        {!isFree && (
                          <View
                            className="px-2.5 py-1 rounded-lg"
                            style={{ backgroundColor: COLORS.primaryLight }}
                          >
                            <Text
                              className="text-xs font-bold"
                              style={{ color: COLORS.primary }}
                            >
                              Class {period.classStr}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View className="flex-row flex-wrap gap-4">
                        <View className="flex-row items-center gap-1.5">
                          <Clock size={14} color={COLORS.textSecondary} />
                          <Text
                            className="text-xs font-medium"
                            style={{ color: COLORS.textSecondary }}
                          >
                            60 mins
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1.5">
                          <MapPin size={14} color={COLORS.textSecondary} />
                          <Text
                            className="text-xs font-medium"
                            style={{ color: COLORS.textSecondary }}
                          >
                            {period.room}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
