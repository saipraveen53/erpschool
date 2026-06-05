import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Award,
  Book,
  Calendar,
  Clock,
  FileEdit,
  GraduationCap,
  TrendingUp,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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
  white: "#FFFFFF",
  lightGray: "#F3F4F6",
};

export default function ExaminationIndexScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [activeTab, setActiveTab] = useState<"my_exams" | "class_exams">(
    "my_exams",
  );

  // Teacher Info State
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");

  const [myExams, setMyExams] = useState<any[]>([]);
  const [classExams, setClassExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation values
  const statAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const statSlideAnims = useRef(
    [0, 1, 2].map(() => new Animated.Value(20)),
  ).current;
  const actionAnims = useRef([0, 1].map(() => new Animated.Value(0))).current;
  const actionSlideAnims = useRef(
    [0, 1].map(() => new Animated.Value(20)),
  ).current;

  const myExamAnims = useRef<Animated.Value[]>([]);
  const myExamSlideAnims = useRef<Animated.Value[]>([]);
  const classExamAnims = useRef<Animated.Value[]>([]);
  const classExamSlideAnims = useRef<Animated.Value[]>([]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Fetch Exams & Teacher Data on Mount (using teacherClient)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let currentTeacherId = "";
        if (Platform.OS === "web") {
          currentTeacherId = localStorage.getItem("userUsername") || "";
        } else {
          currentTeacherId = (await AsyncStorage.getItem("userUsername")) || "";
        }
        setTeacherId(currentTeacherId);

        // 1. Fetch Teacher Info (Name and Class) from class-sections
        try {
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
        } catch (error) {
          console.error("Failed to load teacher info:", error);
          setTeacherName("Error");
          setAssignedClass("Error");
        }

        // 2. Fetch All Exams for the Teacher using teacherClient
        const myExamsRes = await teacherClient.get(
          `/api/teacher/${currentTeacherId}`,
        );
        const fetchedMyExams = myExamsRes.data || [];
        setMyExams(fetchedMyExams);

        // Extract class section IDs from the fetched exams to query class exams
        let classSectionIds = new Set<string>();
        fetchedMyExams.forEach((exam: any) => {
          if (
            exam.assignedClassSectionIds &&
            Array.isArray(exam.assignedClassSectionIds)
          ) {
            exam.assignedClassSectionIds.forEach((id: string) =>
              classSectionIds.add(id),
            );
          }
        });

        const classIdsQuery = Array.from(classSectionIds).join(",");

        // 3. Fetch Class specific exams
        if (classIdsQuery) {
          const classExamsRes = await teacherClient.get(
            `/api/teacher/${currentTeacherId}?classSectionIds=${classIdsQuery}`,
          );
          setClassExams(classExamsRes.data || []);
        } else {
          // If no specific class IDs found, default to showing the same list
          setClassExams(fetchedMyExams);
        }
      } catch (error) {
        console.error("Failed to fetch exams data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize dynamic refs for lists based on fetched data length
  if (myExamAnims.current.length !== myExams.length) {
    myExamAnims.current = myExams.map(() => new Animated.Value(0));
    myExamSlideAnims.current = myExams.map(() => new Animated.Value(20));
  }
  if (classExamAnims.current.length !== classExams.length) {
    classExamAnims.current = classExams.map(() => new Animated.Value(0));
    classExamSlideAnims.current = classExams.map(() => new Animated.Value(20));
  }

  // Entrance animations for static elements
  useEffect(() => {
    Animated.stagger(
      100,
      statAnims.map((anim, idx) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(statSlideAnims[idx], {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();

    Animated.stagger(
      120,
      actionAnims.map((anim, idx) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(actionSlideAnims[idx], {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
  }, []);

  // Animations for tabs content
  useEffect(() => {
    if (loading) return;

    if (activeTab === "my_exams") {
      myExamAnims.current.forEach((a) => a.setValue(0));
      myExamSlideAnims.current.forEach((a) => a.setValue(20));
      Animated.stagger(
        100,
        myExamAnims.current.map((anim, idx) =>
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.spring(myExamSlideAnims.current[idx], {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
          ]),
        ),
      ).start();
    } else {
      classExamAnims.current.forEach((a) => a.setValue(0));
      classExamSlideAnims.current.forEach((a) => a.setValue(20));
      Animated.stagger(
        100,
        classExamAnims.current.map((anim, idx) =>
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.spring(classExamSlideAnims.current[idx], {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
          ]),
        ),
      ).start();
    }
  }, [activeTab, loading, myExams.length, classExams.length]);

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
            Examinations
          </Text>
          <TouchableOpacity className="p-2 rounded-full bg-white/10">
            <Book size={20} color={COLORS.surface} />
          </TouchableOpacity>
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
          Teacher: {teacherName} ({teacherId || "Loading..."})
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
          maxWidth: isDesktop ? 1000 : "100%",
          alignSelf: "center",
          width: "100%",
          gap: 24,
        }}
      >
        {/* Stats Grid */}
        <View className="flex-row justify-between gap-3">
          {[
            {
              icon: GraduationCap,
              label: "Assigned Exams",
              value: myExams.length.toString(),
              bg: `${COLORS.primary}15`,
              iconColor: COLORS.primary,
            },
            {
              icon: Calendar,
              label: "Class Exams",
              value: classExams.length.toString(),
              bg: `${COLORS.secondary}15`,
              iconColor: COLORS.secondary,
            },
            {
              icon: TrendingUp,
              label: "Avg. Score",
              value: "82%",
              bg: `${COLORS.success}15`,
              iconColor: COLORS.success,
            },
          ].map((stat, idx) => (
            <Animated.View
              key={idx}
              style={{
                flex: 1,
                opacity: statAnims[idx],
                transform: [{ translateY: statSlideAnims[idx] }],
              }}
            >
              <View
                className="items-center p-4 rounded-2xl border"
                style={{
                  backgroundColor: COLORS.surface,
                  borderColor: COLORS.border,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 6,
                    },
                    android: { elevation: 2 },
                    web: { boxShadow: "0px 2px 6px rgba(0,0,0,0.05)" },
                  }),
                }}
              >
                <View
                  className="w-11 h-11 rounded-full justify-center items-center mb-3"
                  style={{ backgroundColor: stat.bg }}
                >
                  <stat.icon size={22} color={stat.iconColor} />
                </View>
                <Text
                  className="text-2xl font-black text-center mb-1"
                  style={{ color: COLORS.textPrimary }}
                >
                  {stat.value}
                </Text>
                <Text
                  className="text-xs font-semibold text-center"
                  style={{ color: COLORS.textSecondary }}
                >
                  {stat.label}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Current Examination Banner */}
        {/* <View
          className="p-6 rounded-2xl overflow-hidden"
          style={{
            backgroundColor: COLORS.primary,
            ...Platform.select({
              ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              },
              android: { elevation: 8 },
              web: { boxShadow: `0px 8px 12px ${COLORS.primary}40` },
            }),
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View
              className="w-12 h-12 rounded-full justify-center items-center"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <GraduationCap size={28} color={COLORS.surface} />
            </View>
            <View
              className="px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Text
                className="text-xs font-bold tracking-wide"
                style={{ color: COLORS.surface }}
              >
                Active Term
              </Text>
            </View>
          </View>
          <Text
            className="text-xl font-black mb-2"
            style={{ color: COLORS.surface }}
          >
            Term Examinations
          </Text>
          <Text
            className="text-sm font-medium mb-5"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Manage your assigned subjects & enter marks
          </Text>
          <View>
            <View className="flex-row justify-between mb-2">
              <Text
                className="text-xs font-semibold"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Term Progress
              </Text>
              <Text
                className="text-xs font-bold"
                style={{ color: COLORS.surface }}
              >
                65%
              </Text>
            </View>
            <View
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <View
                className="h-full rounded-full"
                style={{ width: "65%", backgroundColor: COLORS.secondary }}
              />
            </View>
          </View>
        </View> */}

        {/* Quick Actions */}
        <Text
          className="text-lg font-bold"
          style={{ color: COLORS.textPrimary }}
        >
          Quick Actions
        </Text>
        <View className="flex-row gap-4">
          {[
            {
              title: "Enter Marks",
              desc: "Input and update student scores",
              icon: FileEdit,
              route: "/teacher/examination/marks-entry",
              color: COLORS.primary,
            },
            {
              title: "View Grades",
              desc: "Review report cards and performance",
              icon: Award,
              route: "/teacher/examination/grades",
              color: COLORS.textPrimary,
            },
          ].map((action, idx) => (
            <Animated.View
              key={idx}
              style={{
                flex: 1,
                opacity: actionAnims[idx],
                transform: [{ translateY: actionSlideAnims[idx] }],
              }}
            >
              <TouchableOpacity
                className="items-center p-5 rounded-2xl border"
                style={{
                  backgroundColor: COLORS.surface,
                  borderColor: COLORS.border,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 6,
                    },
                    android: { elevation: 2 },
                    web: { boxShadow: "0px 2px 6px rgba(0,0,0,0.05)" },
                  }),
                }}
                activeOpacity={0.8}
                onPress={() => router.push(action.route as any)}
              >
                <View
                  className="w-14 h-14 rounded-full justify-center items-center mb-4"
                  style={{ backgroundColor: action.color }}
                >
                  <action.icon size={26} color={COLORS.surface} />
                </View>
                <Text
                  className="text-base font-bold text-center mb-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  {action.title}
                </Text>
                <Text
                  className="text-xs text-center"
                  style={{ color: COLORS.textSecondary }}
                >
                  {action.desc}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Tabs */}
        <View
          className="flex-row p-1 rounded-xl mb-4"
          style={{
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <TouchableOpacity
            className="flex-1 py-2.5 rounded-lg items-center"
            style={{
              backgroundColor:
                activeTab === "my_exams" ? COLORS.primary : "transparent",
            }}
            onPress={() => setActiveTab("my_exams")}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color:
                  activeTab === "my_exams"
                    ? COLORS.surface
                    : COLORS.textSecondary,
              }}
            >
              My Exams
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-2.5 rounded-lg items-center"
            style={{
              backgroundColor:
                activeTab === "class_exams" ? COLORS.primary : "transparent",
            }}
            onPress={() => setActiveTab("class_exams")}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color:
                  activeTab === "class_exams"
                    ? COLORS.surface
                    : COLORS.textSecondary,
              }}
            >
              Class Exams
            </Text>
          </TouchableOpacity>
        </View>

        {/* Exam Lists */}
        {loading ? (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text
              className="mt-3 text-sm"
              style={{ color: COLORS.textSecondary }}
            >
              Loading exams...
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {activeTab === "my_exams" &&
              (myExams.length === 0 ? (
                <View className="py-8 items-center">
                  <Text style={{ color: COLORS.textSecondary }}>
                    No assigned exams found.
                  </Text>
                </View>
              ) : (
                myExams.map((exam, idx) => (
                  <Animated.View
                    key={exam.examId}
                    style={{
                      opacity: myExamAnims.current[idx],
                      transform: [
                        { translateY: myExamSlideAnims.current[idx] },
                      ],
                    }}
                  >
                    <TouchableOpacity
                      className="p-5 rounded-2xl border"
                      style={{
                        backgroundColor: COLORS.surface,
                        borderColor: COLORS.border,
                        ...Platform.select({
                          ios: {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 6,
                          },
                          android: { elevation: 2 },
                          web: { boxShadow: "0px 2px 6px rgba(0,0,0,0.05)" },
                        }),
                      }}
                      activeOpacity={0.7}
                      onPress={() =>
                        router.push("/teacher/examination/marks-entry")
                      }
                    >
                      <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1 pr-3">
                          <Text
                            className="text-lg font-bold mb-2"
                            style={{ color: COLORS.textPrimary }}
                          >
                            {exam.examName}
                          </Text>
                          <View className="flex-row items-center gap-1.5">
                            <Book size={14} color={COLORS.textSecondary} />
                            <Text
                              className="text-xs"
                              style={{ color: COLORS.textSecondary }}
                            >
                              Academic Year: {exam.academicYear}
                            </Text>
                          </View>
                        </View>
                        <View
                          className="flex-row items-center px-2 py-1 rounded-md gap-1"
                          style={{ backgroundColor: `${COLORS.secondary}15` }}
                        >
                          <Award size={12} color={COLORS.secondary} />
                          <Text
                            className="text-xs font-bold"
                            style={{ color: COLORS.secondary }}
                          >
                            {exam.status || "Assigned"}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row flex-wrap gap-4 mb-4">
                        <View className="flex-row items-center gap-1.5">
                          <Calendar size={16} color={COLORS.textSecondary} />
                          <Text
                            className="text-xs"
                            style={{ color: COLORS.textSecondary }}
                          >
                            Start: {formatDate(exam.startDate)}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1.5">
                          <Clock size={16} color={COLORS.textSecondary} />
                          <Text
                            className="text-xs"
                            style={{ color: COLORS.textSecondary }}
                          >
                            End: {formatDate(exam.endDate)}
                          </Text>
                        </View>
                      </View>

                      <View
                        className="py-2.5 rounded-lg items-center"
                        style={{ backgroundColor: COLORS.primaryLight }}
                      >
                        <Text
                          className="text-sm font-semibold"
                          style={{ color: COLORS.primary }}
                        >
                          Enter Marks
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              ))}

            {activeTab === "class_exams" &&
              (classExams.length === 0 ? (
                <View className="py-8 items-center">
                  <Text style={{ color: COLORS.textSecondary }}>
                    No class exams scheduled.
                  </Text>
                </View>
              ) : (
                classExams.map((exam, idx) => (
                  <Animated.View
                    key={exam.examId}
                    style={{
                      opacity: classExamAnims.current[idx],
                      transform: [
                        { translateY: classExamSlideAnims.current[idx] },
                      ],
                    }}
                  >
                    <View
                      className="p-5 rounded-2xl border"
                      style={{
                        backgroundColor: COLORS.surface,
                        borderColor: COLORS.border,
                        ...Platform.select({
                          ios: {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 6,
                          },
                          android: { elevation: 2 },
                          web: { boxShadow: "0px 2px 6px rgba(0,0,0,0.05)" },
                        }),
                      }}
                    >
                      <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1 pr-3">
                          <Text
                            className="text-lg font-bold mb-2"
                            style={{ color: COLORS.textPrimary }}
                          >
                            {exam.examName}
                          </Text>
                          <View className="flex-row items-center gap-1.5">
                            <GraduationCap
                              size={14}
                              color={COLORS.textSecondary}
                            />
                            <Text
                              className="text-xs"
                              style={{ color: COLORS.textSecondary }}
                            >
                              Academic Year: {exam.academicYear}
                            </Text>
                          </View>
                        </View>
                        <View
                          className="flex-row items-center px-2 py-1 rounded-md gap-1"
                          style={{
                            backgroundColor:
                              exam.status === "COMPLETED"
                                ? `${COLORS.success}15`
                                : `${COLORS.warning}15`,
                          }}
                        >
                          <Award
                            size={12}
                            color={
                              exam.status === "COMPLETED"
                                ? COLORS.success
                                : COLORS.warning
                            }
                          />
                          <Text
                            className="text-xs font-bold"
                            style={{
                              color:
                                exam.status === "COMPLETED"
                                  ? COLORS.success
                                  : COLORS.warning,
                            }}
                          >
                            {exam.status || "Upcoming"}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row flex-wrap gap-4">
                        <View className="flex-row items-center gap-1.5">
                          <Calendar size={16} color={COLORS.textSecondary} />
                          <Text
                            className="text-xs"
                            style={{ color: COLORS.textSecondary }}
                          >
                            Start: {formatDate(exam.startDate)}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1.5">
                          <Clock size={16} color={COLORS.textSecondary} />
                          <Text
                            className="text-xs"
                            style={{ color: COLORS.textSecondary }}
                          >
                            End: {formatDate(exam.endDate)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                ))
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
