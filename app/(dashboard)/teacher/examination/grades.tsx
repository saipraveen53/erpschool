import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ChevronDown,
  Filter,
  Search,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const COLORS = {
  primary: "#E35336",
  accent: "#F5F50C",
  secondary: "#F4A460",
  primaryLight: "#FEE2DB",
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
  lightGray: "#F3F4F6",
};

// --- Cross-Platform Shadow Helper ---
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

// 1. Isolated Axios instance for the exams microservice
const examClient = axios.create({
  baseURL: "http://192.168.88.24:8083",
  timeout: 10000,
});

// 2. Request Interceptor: Automatically attaches the token to ALL requests
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
  (error) => Promise.reject(error),
);

type SortBy = "avg" | "date" | "passRate";
type SortOrder = "asc" | "desc";

export default function ViewGradesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Data States
  const [teacherId, setTeacherId] = useState<string>("");
  const [exams, setExams] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);

  // Modal / Marks State
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  const [marksData, setMarksData] = useState<any[]>([]);
  const [loadingMarks, setLoadingMarks] = useState(false);
  const [stats, setStats] = useState({
    avg: 0,
    highest: 0,
    passed: 0,
    total: 0,
    dist: { A: 0, B: 0, C: 0, D: 0, F: 0 },
  });

  // Animation refs
  const statAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const statSlideAnims = useRef(
    [0, 1, 2].map(() => new Animated.Value(20)),
  ).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const filterSlideAnim = useRef(new Animated.Value(20)).current;

  // 3. Fetch Exams on Mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        let currentTeacherId = "TCH2026001"; // Fallback
        if (Platform.OS === "web") {
          currentTeacherId =
            localStorage.getItem("userUsername") || currentTeacherId;
        } else {
          currentTeacherId =
            (await AsyncStorage.getItem("userUsername")) || currentTeacherId;
        }
        setTeacherId(currentTeacherId);

        const res = await examClient.get(`/api/teacher/${currentTeacherId}`);
        setExams(res.data || []);
      } catch (error) {
        console.error("Failed to load exams:", error);
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  // 4. Fetch Marks when an exam is selected
  useEffect(() => {
    const fetchMarks = async () => {
      if (!selectedExam || !selectedClassId) return;

      try {
        setLoadingMarks(true);
        let url = `/api/exams/${selectedExam.examId}/marks?classSectionId=${selectedClassId}`;
        if (selectedSubjectId) {
          url += `&subjectId=${selectedSubjectId}`;
        }

        const res = await examClient.get(url);
        const data = res.data || [];
        setMarksData(data);
        calculateStats(data);
      } catch (error) {
        console.error("Failed to load marks:", error);
        setMarksData([]);
        calculateStats([]);
      } finally {
        setLoadingMarks(false);
      }
    };

    if (selectedExam) {
      fetchMarks();
    }
  }, [selectedExam, selectedClassId, selectedSubjectId]);

  const calculateStats = (data: any[]) => {
    let total = data.length;
    let sum = 0;
    let highest = 0;
    let passed = 0;
    let dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };

    data.forEach((m) => {
      const mark = m.obtainedMarks || 0;
      sum += mark;
      if (mark > highest) highest = mark;
      if (mark >= 40) passed++;

      if (mark >= 90) dist.A++;
      else if (mark >= 80) dist.B++;
      else if (mark >= 70) dist.C++;
      else if (mark >= 60) dist.D++;
      else dist.F++;
    });

    setStats({
      avg: total > 0 ? Math.round(sum / total) : 0,
      highest,
      passed,
      total,
      dist,
    });
  };

  const handleOpenReport = (exam: any) => {
    setSelectedExam(exam);
    // Auto-select the first assigned class section
    if (
      exam.assignedClassSectionIds &&
      exam.assignedClassSectionIds.length > 0
    ) {
      setSelectedClassId(exam.assignedClassSectionIds[0]);
    }
    setSelectedSubjectId("");
  };

  const closeReport = () => {
    setSelectedExam(null);
    setMarksData([]);
  };

  // Entrance Animations
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
  }, []);

  useEffect(() => {
    if (showFilters) {
      Animated.parallel([
        Animated.timing(filterAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(filterSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      filterAnim.setValue(0);
    }
  }, [showFilters]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return COLORS.success;
    if (percentage >= 60) return COLORS.secondary;
    if (percentage >= 40) return COLORS.warning;
    return COLORS.error;
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  // Filter exams for main screen
  const filteredExams = exams
    .filter((exam) => {
      return exam.examName?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }
      return 0; // Other sorts can be implemented if needed
    });

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
          Class Results
        </Text>
        <TouchableOpacity
          className="p-2 -mr-2"
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter
            size={20}
            color={showFilters ? COLORS.primary : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 24,
          maxWidth: isDesktop ? 1000 : "100%",
          alignSelf: "center",
          width: "100%",
        }}
      >
        <View className="flex-col gap-6 w-full">
          {/* Overall Stats Cards */}
          <View
            className={
              Platform.OS === "web"
                ? "flex-row flex-wrap w-full gap-4"
                : `flex-row flex-wrap justify-between w-full ${isDesktop ? "gap-6" : "gap-3"}`
            }
          >
            {[
              {
                icon: BarChart3,
                label: "Total Exams",
                value: exams.length,
                bg: COLORS.primaryLight,
                iconColor: COLORS.primary,
              },
              {
                icon: TrendingUp,
                label: "Active Terms",
                value: "2",
                bg: `${COLORS.secondary}1A`,
                iconColor: COLORS.secondary,
              },
              {
                icon: Users,
                label: "Your Classes",
                value: "3",
                bg: `${COLORS.success}1A`,
                iconColor: COLORS.success,
              },
            ].map((stat, idx) => (
              <Animated.View
                key={idx}
                className="flex-1 min-w-[100px] flex-col items-center justify-center rounded-2xl border"
                style={{
                  ...(Platform.OS === "web" ? { flex: 1 } : {}),
                  padding: isDesktop ? 24 : 16,
                  opacity: statAnims[idx],
                  transform: [{ translateY: statSlideAnims[idx] }],
                  backgroundColor: COLORS.bgWhite,
                  borderColor: COLORS.border,
                  ...platformShadow,
                }}
              >
                <View
                  className="rounded-full justify-center items-center mb-3"
                  style={{
                    backgroundColor: stat.bg,
                    width: isDesktop ? 56 : 44,
                    height: isDesktop ? 56 : 44,
                  }}
                >
                  <stat.icon
                    size={isDesktop ? 28 : 22}
                    color={stat.iconColor}
                  />
                </View>
                <Text
                  className="font-black text-center"
                  style={{
                    color: COLORS.textPrimary,
                    fontSize: isDesktop ? 28 : 20,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  className="font-bold text-center mt-1 uppercase tracking-wider"
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: isDesktop ? 12 : 10,
                  }}
                >
                  {stat.label}
                </Text>
              </Animated.View>
            ))}
          </View>

          {/* Filters Panel */}
          {showFilters && (
            <Animated.View
              className="rounded-2xl p-5 border"
              style={{
                opacity: filterAnim,
                transform: [{ translateY: filterSlideAnim }],
                backgroundColor: COLORS.bgWhite,
                borderColor: COLORS.border,
                ...platformShadow,
              }}
            >
              <View
                className="flex-row items-center rounded-xl px-4 py-2 mb-5"
                style={{ backgroundColor: COLORS.lightGray }}
              >
                <Search size={18} color={COLORS.textSecondary} />
                <TextInput
                  className="flex-1 py-2.5 text-sm ml-2"
                  placeholder="Search exams..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={
                    Platform.OS === "web"
                      ? ({
                          color: COLORS.textPrimary,
                          outlineStyle: "none",
                        } as any)
                      : { color: COLORS.textPrimary }
                  }
                />
                {searchQuery !== "" && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    className="ml-2"
                  >
                    <Text
                      className="font-bold text-xs py-2"
                      style={{ color: COLORS.primary }}
                    >
                      Clear
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View className="gap-3">
                <Text
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: COLORS.textSecondary }}
                >
                  Sort By
                </Text>
                <View className="flex-row flex-wrap items-center gap-2.5">
                  {(["date"] as SortBy[]).map((sort) => (
                    <TouchableOpacity
                      key={sort}
                      className="px-4 py-2.5 rounded-full"
                      style={[
                        sortBy === sort
                          ? { backgroundColor: COLORS.primary }
                          : { backgroundColor: COLORS.lightGray },
                      ]}
                      onPress={() => setSortBy(sort)}
                    >
                      <Text
                        className="text-xs font-bold"
                        style={{
                          color:
                            sortBy === sort ? COLORS.white : COLORS.textPrimary,
                        }}
                      >
                        Date
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    className="p-2.5 rounded-full ml-auto"
                    style={{ backgroundColor: COLORS.lightGray }}
                    onPress={() =>
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                    }
                  >
                    <ChevronDown
                      size={18}
                      color={COLORS.textPrimary}
                      style={{
                        transform: [
                          { rotate: sortOrder === "desc" ? "0deg" : "180deg" },
                        ],
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Results List */}
          {loadingExams ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text
                className="mt-4 font-semibold text-sm"
                style={{ color: COLORS.textSecondary }}
              >
                Loading exams...
              </Text>
            </View>
          ) : filteredExams.length === 0 ? (
            <View className="items-center justify-center py-20 gap-3">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: COLORS.border }}
              >
                <BarChart3 size={32} color={COLORS.textSecondary} />
              </View>
              <Text
                className="text-xl font-black mt-2"
                style={{ color: COLORS.textPrimary }}
              >
                No exams found
              </Text>
            </View>
          ) : (
            <View className="flex-col gap-4">
              {filteredExams.map((exam) => (
                <View
                  key={exam.examId}
                  className="rounded-2xl border"
                  style={{
                    backgroundColor: COLORS.bgWhite,
                    borderColor: COLORS.border,
                    padding: isDesktop ? 24 : 20,
                    ...platformShadow,
                  }}
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1 pr-4">
                      <Text
                        className="text-xl font-black mb-1.5 tracking-tight"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {exam.examName}
                      </Text>
                      <Text
                        className="text-sm font-bold"
                        style={{ color: COLORS.textSecondary }}
                      >
                        Academic Year: {exam.academicYear}
                      </Text>
                    </View>
                    <View
                      className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg"
                      style={{ backgroundColor: COLORS.lightGray }}
                    >
                      <Calendar size={14} color={COLORS.textSecondary} />
                      <Text
                        className="text-xs font-bold"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {formatDate(exam.startDate)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2 mb-6">
                    {exam.assignedClassSectionIds?.map((classId: string) => (
                      <View
                        key={classId}
                        className="px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: COLORS.primaryLight }}
                      >
                        <Text
                          className="text-xs font-bold uppercase"
                          style={{ color: COLORS.primaryDark }}
                        >
                          Class: {classId}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    className="py-3.5 rounded-xl items-center border-2"
                    style={{
                      borderColor: COLORS.primaryLight,
                      backgroundColor: COLORS.bgWhite,
                    }}
                    activeOpacity={0.7}
                    onPress={() => handleOpenReport(exam)}
                  >
                    <Text
                      className="text-sm font-black tracking-wide"
                      style={{ color: COLORS.primary }}
                    >
                      View Detailed Results
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* DETAILED RESULTS MODAL */}
      <Modal visible={!!selectedExam} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View
            className="bg-white rounded-t-3xl pt-6 pb-10"
            style={{ height: "90%", backgroundColor: COLORS.bgWhite }}
          >
            {/* Modal Header */}
            <View className="flex-row justify-between items-center px-6 mb-6">
              <View>
                <Text
                  className="text-xl font-black"
                  style={{ color: COLORS.textPrimary }}
                >
                  {selectedExam?.examName} Results
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeReport}
                className="p-2 bg-gray-100 rounded-full"
                style={{ backgroundColor: COLORS.lightGray }}
              >
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Class & Subject Selector */}
            <View className="px-6 mb-4">
              <Text
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: COLORS.textSecondary }}
              >
                Select Class
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {selectedExam?.assignedClassSectionIds?.map(
                  (classId: string) => (
                    <TouchableOpacity
                      key={classId}
                      onPress={() => setSelectedClassId(classId)}
                      className="px-4 py-2 rounded-lg border"
                      style={{
                        backgroundColor:
                          selectedClassId === classId
                            ? COLORS.primary
                            : COLORS.white,
                        borderColor:
                          selectedClassId === classId
                            ? COLORS.primary
                            : COLORS.border,
                      }}
                    >
                      <Text
                        className="font-semibold text-sm"
                        style={{
                          color:
                            selectedClassId === classId
                              ? COLORS.white
                              : COLORS.textPrimary,
                        }}
                      >
                        {classId}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </ScrollView>

              <Text
                className="text-xs font-bold uppercase tracking-wider mt-4 mb-2"
                style={{ color: COLORS.textSecondary }}
              >
                Subject Filter (Optional)
              </Text>
              <TextInput
                className="border rounded-xl p-3.5 text-sm font-medium mb-2"
                style={
                  Platform.OS === "web"
                    ? ({
                        borderColor: COLORS.border,
                        color: COLORS.textPrimary,
                        backgroundColor: COLORS.white,
                        outlineStyle: "none",
                      } as any)
                    : {
                        borderColor: COLORS.border,
                        color: COLORS.textPrimary,
                        backgroundColor: COLORS.white,
                      }
                }
                placeholder="Enter Subject ID (e.g. SUB2026003)"
                placeholderTextColor={COLORS.textTertiary}
                value={selectedSubjectId}
                onChangeText={setSelectedSubjectId}
              />
            </View>

            {loadingMarks ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text
                  className="mt-4 font-semibold text-sm"
                  style={{ color: COLORS.textSecondary }}
                >
                  Fetching marks...
                </Text>
              </View>
            ) : marksData.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <Text
                  className="font-semibold text-lg"
                  style={{ color: COLORS.textSecondary }}
                >
                  No marks found for this class.
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 24,
                  paddingBottom: 40,
                }}
              >
                {/* Main Stats Row */}
                <View
                  className="flex-row justify-between items-center rounded-xl p-4 mb-6"
                  style={{ backgroundColor: COLORS.lightGray }}
                >
                  <View className="flex-1 items-center">
                    <Text
                      className="text-xs font-bold mb-1 uppercase tracking-wider"
                      style={{ color: COLORS.textSecondary }}
                    >
                      Class Avg
                    </Text>
                    <Text
                      className="text-2xl font-black"
                      style={{ color: getGradeColor(stats.avg) }}
                    >
                      {stats.avg}%
                    </Text>
                    <Text
                      className="text-[10px] font-black uppercase mt-1 px-2 py-0.5 rounded-md bg-white/60"
                      style={{ color: COLORS.textSecondary }}
                    >
                      Grade {getGradeLetter(stats.avg)}
                    </Text>
                  </View>
                  <View
                    className="w-px h-12 bg-gray-200 mx-2"
                    style={{ backgroundColor: COLORS.border }}
                  />
                  <View className="flex-1 items-center">
                    <Text
                      className="text-xs font-bold mb-1 uppercase tracking-wider"
                      style={{ color: COLORS.textSecondary }}
                    >
                      Highest
                    </Text>
                    <Text
                      className="text-2xl font-black"
                      style={{ color: COLORS.success }}
                    >
                      {stats.highest}
                    </Text>
                  </View>
                  <View
                    className="w-px h-12 bg-gray-200 mx-2"
                    style={{ backgroundColor: COLORS.border }}
                  />
                  <View className="flex-1 items-center">
                    <Text
                      className="text-xs font-bold mb-1 uppercase tracking-wider"
                      style={{ color: COLORS.textSecondary }}
                    >
                      Passed
                    </Text>
                    <Text
                      className="text-xl font-black mt-1"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {stats.passed}
                      <Text
                        className="text-sm font-bold"
                        style={{ color: COLORS.textSecondary }}
                      >
                        /{stats.total}
                      </Text>
                    </Text>
                  </View>
                </View>

                {/* Grade Distribution */}
                <View className="mb-6">
                  <Text
                    className="text-sm font-bold mb-3"
                    style={{ color: COLORS.textPrimary }}
                  >
                    Grade Distribution
                  </Text>
                  <View className="gap-3">
                    {Object.entries(stats.dist).map(([grade, count]) => {
                      const percentage =
                        ((count as number) / stats.total) * 100;
                      let barColor = COLORS.success;
                      if (grade === "C") barColor = COLORS.secondary;
                      if (grade === "D") barColor = COLORS.warning;
                      if (grade === "F") barColor = COLORS.error;

                      return (
                        <View
                          key={grade}
                          className="flex-row items-center gap-3"
                        >
                          <Text
                            className="text-xs font-black w-4 text-center"
                            style={{ color: COLORS.textPrimary }}
                          >
                            {grade}
                          </Text>
                          <View
                            className="flex-1 h-2.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: COLORS.lightGray }}
                          >
                            <View
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: barColor,
                              }}
                            />
                          </View>
                          <Text
                            className="text-xs font-bold w-12 text-right"
                            style={{ color: COLORS.textSecondary }}
                          >
                            {count} <Text className="font-normal">st.</Text>
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Student Marks List */}
                <Text
                  className="text-sm font-bold mb-3 mt-4"
                  style={{ color: COLORS.textPrimary }}
                >
                  Student Performance
                </Text>
                {marksData.map((mark) => (
                  <View
                    key={mark.markId}
                    className="flex-row items-center justify-between p-4 bg-white border rounded-xl mb-3"
                    style={{ borderColor: COLORS.border }}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className="w-10 h-10 rounded-full justify-center items-center bg-gray-100"
                        style={{ backgroundColor: COLORS.lightGray }}
                      >
                        <User size={18} color={COLORS.textSecondary} />
                      </View>
                      <View>
                        <Text
                          className="font-bold text-base"
                          style={{ color: COLORS.textPrimary }}
                        >
                          {mark.studentName}
                        </Text>
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: COLORS.textSecondary }}
                        >
                          Subject: {mark.subjectId}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text
                        className="text-lg font-black"
                        style={{ color: getGradeColor(mark.obtainedMarks) }}
                      >
                        {mark.obtainedMarks}
                      </Text>
                      <Text
                        className="text-[10px] font-bold uppercase mt-1"
                        style={{
                          color:
                            mark.attendanceStatus === "PRESENT"
                              ? COLORS.success
                              : COLORS.error,
                        }}
                      >
                        {mark.attendanceStatus}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
