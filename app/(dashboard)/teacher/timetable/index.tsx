import AsyncStorage from "@react-native-async-storage/async-storage";
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

const COLORS = {
  primary: "#E35336",
  accent: "#F5F50C",
  primaryDark: "#C73E21",
  secondary: "#F4A460",
  primaryLight: "#FEE2DB",
  secondaryLight: "#FEF0E8",
  bgWarm: "#FFF8F2",
  bgWhite: "#FFFFFF",
  white: "#FFFFFF",
  lightGray: "#F8F9FA",
  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  border: "#F0E4D8",
  accentLight: "rgba(227, 83, 54, 0.1)",
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
  const [assignedClasses, setAssignedClasses] = useState<any[]>([]);

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

  // Format assigned classes for display
  const getAssignedClassesDisplay = () => {
    if (assignedClasses.length === 0) return "None";
    return assignedClasses
      .map((c) => `${c.className}-${c.sectionName.toUpperCase()}`)
      .join(", ");
  };

  useEffect(() => {
    const fetchTimetables = async () => {
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

        // Fetch assigned classes, my timetable, and class timetable concurrently
        const [classesRes, myRes, classRes] = await Promise.all([
          teacherClient.get(
            `/api/student/teacher/assigned-classes/${currentTeacherId}`,
          ),
          teacherClient.get(
            `/api/student/teacher/${currentTeacherId}/weekly-timetable`,
          ),
          teacherClient.get(
            `/api/student/teacher/${currentTeacherId}/class-timetable`,
          ),
        ]);

        if (classesRes.data && Array.isArray(classesRes.data)) {
          setAssignedClasses(classesRes.data);
          // If teacher name not yet set, try to get from first class
          if (
            classesRes.data.length > 0 &&
            classesRes.data[0].classTeacherName
          ) {
            setTeacherName(classesRes.data[0].classTeacherName);
          }
        }

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

    fetchTimetables();
  }, []);

  // Determine which dataset to display based on the active tab
  const currentSchedule =
    activeTab === "MY_TIMETABLE"
      ? myTimetable[selectedDay] || []
      : classTimetable[selectedDay] || [];

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.lightGray }}>
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
          Timetable
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <View
        className="flex-1 w-full self-center"
        style={{ maxWidth: isDesktop ? 800 : "100%" }}
      >
        {/* Profile Info Banner - Teacher name, ID, and assigned class(es) */}
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
            Teacher: {teacherName || "Loading..."} ({teacherId || "Loading..."})
          </Text>
          <Text
            className="text-xs font-bold"
            style={{ color: COLORS.primaryDark }}
            numberOfLines={1}
          >
            Class: {getAssignedClassesDisplay()}
          </Text>
        </View>

        {/* Tab Switcher (unchanged) */}
        <View
          className="flex-row p-4 bg-white border-b"
          style={{ borderBottomColor: COLORS.border }}
        >
          <TouchableOpacity
            className="flex-1 py-3 items-center rounded-l-xl border-y border-l"
            style={{
              backgroundColor:
                activeTab === "MY_TIMETABLE" ? COLORS.primary : COLORS.white,
              borderColor:
                activeTab === "MY_TIMETABLE" ? COLORS.primary : COLORS.border,
            }}
            onPress={() => setActiveTab("MY_TIMETABLE")}
            activeOpacity={0.8}
          >
            <Text
              className="font-bold text-sm"
              style={{
                color:
                  activeTab === "MY_TIMETABLE"
                    ? COLORS.white
                    : COLORS.textSecondary,
              }}
            >
              My Timetable
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 py-3 items-center rounded-r-xl border-y border-r"
            style={{
              backgroundColor:
                activeTab === "CLASS_TIMETABLE" ? COLORS.primary : COLORS.white,
              borderColor:
                activeTab === "CLASS_TIMETABLE"
                  ? COLORS.primary
                  : COLORS.border,
            }}
            onPress={() => setActiveTab("CLASS_TIMETABLE")}
            activeOpacity={0.8}
          >
            <Text
              className="font-bold text-sm"
              style={{
                color:
                  activeTab === "CLASS_TIMETABLE"
                    ? COLORS.white
                    : COLORS.textSecondary,
              }}
            >
              Class Timetable
            </Text>
          </TouchableOpacity>
        </View>

        {/* Day Selector (unchanged) */}
        <View
          className="bg-white border-b py-3"
          style={{ borderBottomColor: COLORS.border }}
        >
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
                      : { backgroundColor: COLORS.lightGray },
                  ]}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: isActive ? COLORS.white : COLORS.textSecondary,
                      fontWeight: isActive ? "800" : "600",
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Timetable List (unchanged) */}
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

                    {/* Right Details */}
                    <View
                      className="flex-1 rounded-2xl p-4 border-l-4"
                      style={[
                        isFree
                          ? {
                              backgroundColor: `${COLORS.textSecondary}0D`,
                              borderLeftColor: COLORS.textSecondary,
                            }
                          : {
                              backgroundColor: COLORS.bgWhite,
                              borderLeftColor: COLORS.primary,
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.05,
                              shadowRadius: 4,
                              elevation: 2,
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
                            style={{ backgroundColor: COLORS.accentLight }}
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
