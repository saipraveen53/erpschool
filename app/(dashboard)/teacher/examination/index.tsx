import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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
  StyleSheet,
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
  primaryDark: "#C73E21", // Added for the info bar text
  secondaryLight: "#FEF0E8",
  bgWarm: "#FFF8F2",
  bgWhite: "#FFFFFF",
  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  success: "#10B981",
  warning: "#F59E0B",
  border: "#F0E4D8",
  white: "#FFFFFF",
  lightGray: "#F3F4F6",
};

// Isolated Axios instance for the exams microservice
const examClient = axios.create({
  baseURL: "http://192.168.88.24:8083",
  timeout: 10000,
});

// Request Interceptor: Automatically attach the token to ALL requests
examClient.interceptors.request.use(
  async (config) => {
    let token = null;
    try {
      if (Platform.OS === "web") {
        token =
          localStorage.getItem("userToken") ||
          localStorage.getItem("token") ||
          localStorage.getItem("authToken");
      } else {
        token =
          (await AsyncStorage.getItem("userToken")) ||
          (await AsyncStorage.getItem("token")) ||
          (await AsyncStorage.getItem("authToken"));
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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

  // Fetch Exams & Teacher Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let currentTeacherId = "TCH2026001"; // Fallback ID
        if (Platform.OS === "web") {
          currentTeacherId =
            localStorage.getItem("userUsername") || currentTeacherId;
        } else {
          currentTeacherId =
            (await AsyncStorage.getItem("userUsername")) || currentTeacherId;
        }
        setTeacherId(currentTeacherId);

        // 1. Fetch Teacher Info (Name and Class)
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

        // 2. Fetch All Exams for the Teacher
        const myExamsRes = await examClient.get(
          `/api/teacher/${currentTeacherId}`,
        );
        const fetchedMyExams = myExamsRes.data || [];
        setMyExams(fetchedMyExams);

        // Attempt to extract class section IDs from the fetched exams to query class exams
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
          const classExamsRes = await examClient.get(
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

  return (
    <View style={styles.container}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Examinations</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Book size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Teacher Info Bar */}
      <View style={styles.teacherInfoBar}>
        <Text style={styles.teacherInfoText} numberOfLines={1}>
          Teacher: {teacherName} ({teacherId || "Loading..."})
        </Text>
        <Text style={styles.teacherClassText} numberOfLines={1}>
          Class: {assignedClass}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: isDesktop ? 1000 : "100%" },
        ]}
      >
        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {[
            {
              icon: GraduationCap,
              label: "Assigned Exams",
              value: myExams.length.toString(),
              bg: COLORS.primaryLight,
              iconColor: COLORS.primary,
            },
            {
              icon: Calendar,
              label: "Class Exams",
              value: classExams.length.toString(),
              bg: `${COLORS.secondary}1A`,
              iconColor: COLORS.secondary,
            },
            {
              icon: TrendingUp,
              label: "Avg. Score",
              value: "82%",
              bg: `${COLORS.success}1A`,
              iconColor: COLORS.success,
            },
          ].map((stat, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.statCard,
                {
                  opacity: statAnims[idx],
                  transform: [{ translateY: statSlideAnims[idx] }],
                },
              ]}
            >
              <View
                style={[styles.statIconWrapper, { backgroundColor: stat.bg }]}
              >
                <stat.icon size={22} color={stat.iconColor} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Current Examination Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerHeader}>
            <View style={styles.bannerIconWrapper}>
              <GraduationCap size={28} color={COLORS.white} />
            </View>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>Active Term</Text>
            </View>
          </View>
          <Text style={styles.bannerTitle}>Term Examinations</Text>
          <Text style={styles.bannerSubtitle}>
            Manage your assigned subjects & enter marks
          </Text>
          <View>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Term Progress</Text>
              <Text style={styles.progressValue}>65%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: "65%" }]} />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
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
              style={[
                styles.actionCardWrapper,
                {
                  opacity: actionAnims[idx],
                  transform: [{ translateY: actionSlideAnims[idx] }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => router.push(action.route as any)}
              >
                <View
                  style={[
                    styles.actionIconWrapper,
                    { backgroundColor: action.color },
                  ]}
                >
                  <action.icon size={26} color={COLORS.white} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDesc}>{action.desc}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "my_exams" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("my_exams")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "my_exams" && styles.tabTextActive,
              ]}
            >
              My Exams
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "class_exams" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("class_exams")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "class_exams" && styles.tabTextActive,
              ]}
            >
              Class Exams
            </Text>
          </TouchableOpacity>
        </View>

        {/* Exam Lists */}
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 12, color: COLORS.textSecondary }}>
              Loading exams...
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {activeTab === "my_exams" &&
              (myExams.length === 0 ? (
                <View style={{ padding: 20, alignItems: "center" }}>
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
                      style={styles.examCard}
                      activeOpacity={0.7}
                      onPress={() =>
                        router.push("/teacher/examination/marks-entry")
                      }
                    >
                      <View style={styles.examCardHeader}>
                        <View style={styles.examCardTitleSection}>
                          <Text style={styles.examCardTitle}>
                            {exam.examName}
                          </Text>
                          <View style={styles.examCardSubtitleRow}>
                            <Book size={14} color={COLORS.textSecondary} />
                            <Text style={styles.examCardSubtitleText}>
                              Academic Year: {exam.academicYear}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: `${COLORS.secondary}1A` },
                          ]}
                        >
                          <Award size={12} color={COLORS.secondary} />
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: COLORS.secondary },
                            ]}
                          >
                            {exam.status || "Assigned"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.examDetailsRow}>
                        <View style={styles.examDetailItem}>
                          <Calendar size={16} color={COLORS.textSecondary} />
                          <Text style={styles.examDetailText}>
                            Start: {formatDate(exam.startDate)}
                          </Text>
                        </View>
                        <View style={styles.examDetailItem}>
                          <Clock size={16} color={COLORS.textSecondary} />
                          <Text style={styles.examDetailText}>
                            End: {formatDate(exam.endDate)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Enter Marks</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              ))}

            {activeTab === "class_exams" &&
              (classExams.length === 0 ? (
                <View style={{ padding: 20, alignItems: "center" }}>
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
                    <View style={styles.examCard}>
                      <View style={styles.examCardHeader}>
                        <View style={styles.examCardTitleSection}>
                          <Text style={styles.examCardTitle}>
                            {exam.examName}
                          </Text>
                          <View style={styles.examCardSubtitleRow}>
                            <GraduationCap
                              size={14}
                              color={COLORS.textSecondary}
                            />
                            <Text style={styles.examCardSubtitleText}>
                              Academic Year: {exam.academicYear}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                exam.status === "COMPLETED"
                                  ? `${COLORS.success}1A`
                                  : `${COLORS.warning}1A`,
                            },
                          ]}
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
                            style={[
                              styles.statusBadgeText,
                              {
                                color:
                                  exam.status === "COMPLETED"
                                    ? COLORS.success
                                    : COLORS.warning,
                              },
                            ]}
                          >
                            {exam.status || "Upcoming"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.examDetailsRow}>
                        <View style={styles.examDetailItem}>
                          <Calendar size={16} color={COLORS.textSecondary} />
                          <Text style={styles.examDetailText}>
                            Start: {formatDate(exam.startDate)}
                          </Text>
                        </View>
                        <View style={styles.examDetailItem}>
                          <Clock size={16} color={COLORS.textSecondary} />
                          <Text style={styles.examDetailText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgWarm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: Platform.OS === "android" ? 50 : 40,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  teacherInfoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  teacherInfoText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    flex: 1,
  },
  teacherClassText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
    gap: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
      },
    }),
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  bannerContainer: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
        shadowColor: COLORS.primary,
      },
      web: {
        boxShadow: `0px 8px 12px ${COLORS.primary}40`,
      },
    }),
  },
  bannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bannerIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  bannerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  bannerBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
  },
  progressValue: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  actionCardWrapper: {
    flex: 1,
  },
  actionCard: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
      },
    }),
  },
  actionIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  actionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.bgWhite,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    gap: 16,
  },
  examCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
      },
    }),
  },
  examCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  examCardTitleSection: {
    flex: 1,
    paddingRight: 12,
  },
  examCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  examCardSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  examCardSubtitleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  examDetailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  examDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  examDetailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
