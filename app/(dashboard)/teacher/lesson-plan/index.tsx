import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Edit2,
  Filter,
  Plus,
  Save,
  Search,
  Target,
  Trash2,
  Users,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  secondaryLight: "#FEF0E8",
  bgWarm: "#FFF8F2",
  bgWhite: "#FFFFFF",
  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  success: "#10B981",
  warning: "#F59E0B",
  pending: "#6B7280",
  border: "#F0E4D8",
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

type FilterType = "all" | "completed" | "pending";
type ViewMode = "ALL" | "SPECIFIC";

interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
}

interface TeacherClass {
  classSectionId: string;
  className: string;
  section: string;
  academicYear: string;
  isPrimaryClassTeacher: boolean;
  subjectsTaught: Subject[];
}

interface ApiLessonPlan {
  lessonPlanId: string;
  classSectionId: string;
  className: string;
  section: string;
  subjectName: string;
  teacherName: string;
  topicName: string;
  plannedDate: string;
  isCompleted: boolean;
}

interface MappedLessonPlan {
  id: string;
  classStr: string;
  subject: string;
  chapter: string;
  status: "Completed" | "Pending";
  plannedDate: string;
  originalData?: ApiLessonPlan;
}

// Helper to ensure alerts show up on web
const showAlert = (title: string, message: string) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function LessonPlanScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [teacherId, setTeacherId] = useState<string>("");
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("ALL");
  const [lessonPlans, setLessonPlans] = useState<MappedLessonPlan[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Modal & Form State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MappedLessonPlan | null>(null);
  const [formData, setFormData] = useState({
    chapter: "",
    plannedDate: "",
  });

  useEffect(() => {
    fetchClassesAndSubjects();
  }, []);

  const fetchClassesAndSubjects = async () => {
    try {
      setIsLoadingClasses(true);
      setError(null);

      const currentTeacherId =
        Platform.OS === "web"
          ? localStorage.getItem("userUsername")
          : await AsyncStorage.getItem("userUsername");

      if (!currentTeacherId) {
        setError("Teacher ID not found. Please log in again.");
        return;
      }

      setTeacherId(currentTeacherId);

      const response = await teacherClient.get(
        `/api/student/teacher/${currentTeacherId}/classes-subjects`,
      );

      if (response.data && response.data.classes) {
        setTeacherClasses(response.data.classes);
      }

      await fetchAllLessonPlans(currentTeacherId);
    } catch (err) {
      console.error("Failed to fetch classes/subjects:", err);
      setError("Failed to load your assigned classes.");
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const fetchAllLessonPlans = async (tid: string) => {
    try {
      setIsLoadingPlans(true);
      setViewMode("ALL");
      setSelectedClass(null);
      setSelectedSubject(null);

      const response = await teacherClient.get<ApiLessonPlan[]>(
        `/api/student/lesson-plans/teacher/${tid}`,
      );
      mapAndSetLessonPlans(response.data);
    } catch (err) {
      console.error("Failed to fetch all lesson plans:", err);
      setLessonPlans([]);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const fetchSpecificLessonPlans = async (classId: string, subId: string) => {
    try {
      setIsLoadingPlans(true);
      setViewMode("SPECIFIC");

      const response = await teacherClient.get<ApiLessonPlan[]>(
        `/api/student/lesson-plans/list/${classId}/${subId}`,
      );
      mapAndSetLessonPlans(response.data);
    } catch (err) {
      console.error("Failed to fetch specific lesson plans:", err);
      setLessonPlans([]);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const mapAndSetLessonPlans = (apiData: ApiLessonPlan[]) => {
    if (!apiData || !Array.isArray(apiData)) {
      setLessonPlans([]);
      return;
    }
    const mappedData: MappedLessonPlan[] = apiData.map((item) => ({
      id: item.lessonPlanId,
      classStr: `${item.className}-${item.section}`,
      subject: item.subjectName,
      chapter: item.topicName,
      status: item.isCompleted ? "Completed" : "Pending",
      plannedDate: item.plannedDate,
      originalData: item,
    }));
    setLessonPlans(mappedData);
  };

  useEffect(() => {
    if (viewMode === "SPECIFIC" && selectedClass && selectedSubject) {
      fetchSpecificLessonPlans(
        selectedClass.classSectionId,
        selectedSubject.subjectId,
      );
    }
  }, [selectedClass, selectedSubject, viewMode]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          color: COLORS.success,
          bg: `${COLORS.success}1A`,
          icon: CheckCircle2,
        };
      default:
        return {
          color: COLORS.pending,
          bg: `${COLORS.pending}1A`,
          icon: BookOpen,
        };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredPlans = lessonPlans.filter((plan) => {
    const matchesSearch =
      plan.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.classStr.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (activeFilter === "completed")
      matchesFilter = plan.status === "Completed";
    else if (activeFilter === "pending")
      matchesFilter = plan.status === "Pending";

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: lessonPlans.length,
    completed: lessonPlans.filter((p) => p.status === "Completed").length,
    pending: lessonPlans.filter((p) => p.status === "Pending").length,
  };

  const handleCreatePlan = async () => {
    if (!formData.chapter) {
      showAlert("Error", "Please fill in the chapter/topic name.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingPlan) {
        const classSectionId =
          editingPlan.originalData?.classSectionId ||
          selectedClass?.classSectionId;
        const subjectName = editingPlan.subject;

        let subjectId = selectedSubject?.subjectId;
        if (!subjectId && classSectionId) {
          const cls = teacherClasses.find(
            (c) => c.classSectionId === classSectionId,
          );
          const sub = cls?.subjectsTaught.find(
            (s) => s.subjectName === subjectName,
          );
          subjectId = sub?.subjectId;
        }

        if (!classSectionId || !subjectId) {
          showAlert("Error", "Missing class or subject info. Cannot update.");
          setIsSubmitting(false);
          return;
        }

        const payload = {
          classSectionId: classSectionId,
          subjectId: subjectId,
          teacherId: teacherId,
          topicName: formData.chapter,
          plannedDate:
            formData.plannedDate || new Date().toISOString().split("T")[0],
          isCompleted: editingPlan.originalData?.isCompleted || false,
        };

        await teacherClient.put(
          `/api/student/lesson-plans/${editingPlan.id}`,
          payload,
        );
        showAlert("Success", "Lesson plan updated successfully.");
      } else {
        if (!selectedClass || !selectedSubject) {
          showAlert("Error", "Please ensure class and subject are selected.");
          setIsSubmitting(false);
          return;
        }

        const payload = {
          classSectionId: selectedClass.classSectionId,
          subjectId: selectedSubject.subjectId,
          teacherId: teacherId,
          topicName: formData.chapter,
          plannedDate:
            formData.plannedDate || new Date().toISOString().split("T")[0],
          isCompleted: false,
        };

        await teacherClient.post("/api/student/lesson-plans", payload);
        showAlert("Success", "Lesson plan created successfully.");
      }

      if (viewMode === "ALL") {
        fetchAllLessonPlans(teacherId);
      } else if (selectedClass && selectedSubject) {
        fetchSpecificLessonPlans(
          selectedClass.classSectionId,
          selectedSubject.subjectId,
        );
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save lesson plan:", err);
      showAlert("Error", "Failed to save lesson plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPlan = (plan: MappedLessonPlan) => {
    setEditingPlan(plan);
    setFormData({
      chapter: plan.chapter,
      plannedDate: plan.plannedDate,
    });
    setIsModalVisible(true);
  };

  const executeDelete = async (id: string) => {
    try {
      await teacherClient.delete(`/api/student/lesson-plans/${id}`);
      setLessonPlans((prev) => prev.filter((p) => p.id !== id));
      showAlert("Success", "Lesson plan deleted successfully.");
    } catch (err) {
      console.error("Failed to delete lesson plan:", err);
      showAlert("Error", "Failed to delete lesson plan.");
    }
  };

  const handleDeletePlan = (id: string) => {
    const confirmMessage = "Are you sure you want to delete this lesson plan?";

    if (Platform.OS === "web") {
      if (window.confirm(confirmMessage)) {
        executeDelete(id);
      }
    } else {
      Alert.alert("Delete Lesson Plan", confirmMessage, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => executeDelete(id),
        },
      ]);
    }
  };

  const handleMarkAsComplete = async (plan: MappedLessonPlan) => {
    try {
      const classSectionId =
        plan.originalData?.classSectionId || selectedClass?.classSectionId;
      const subjectName = plan.subject;

      let subjectId = selectedSubject?.subjectId;
      if (!subjectId && classSectionId) {
        const cls = teacherClasses.find(
          (c) => c.classSectionId === classSectionId,
        );
        const sub = cls?.subjectsTaught.find(
          (s) => s.subjectName === subjectName,
        );
        subjectId = sub?.subjectId;
      }

      if (!classSectionId || !subjectId) {
        showAlert("Error", "Missing class or subject info. Cannot update.");
        return;
      }

      const payload = {
        classSectionId: classSectionId,
        subjectId: subjectId,
        teacherId: teacherId,
        topicName: plan.chapter,
        plannedDate: plan.plannedDate,
        isCompleted: true,
      };

      await teacherClient.put(`/api/student/lesson-plans/${plan.id}`, payload);

      setLessonPlans((current) =>
        current.map((p) =>
          p.id === plan.id
            ? {
                ...p,
                status: "Completed",
                originalData: { ...p.originalData!, isCompleted: true },
              }
            : p,
        ),
      );

      showAlert("Success", "Lesson plan marked as completed.");
    } catch (err) {
      console.error("Failed to mark as complete:", err);
      showAlert("Error", "Failed to update lesson plan status.");
    }
  };

  const resetForm = () => {
    setFormData({
      chapter: "",
      plannedDate: "",
    });
    setEditingPlan(null);
    setIsModalVisible(false);
  };

  const shouldShowData =
    viewMode === "ALL" ||
    (viewMode === "SPECIFIC" && selectedClass && selectedSubject);

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
          Lesson Plans
        </Text>
        <TouchableOpacity
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${COLORS.primary}1A` }}
          onPress={() => {
            if (viewMode === "ALL" || !selectedClass || !selectedSubject) {
              showAlert(
                "Notice",
                "Please select a specific class and subject below to create a new plan.",
              );
              return;
            }
            resetForm();
            setIsModalVisible(true);
          }}
        >
          <Plus size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Class & Subject Selector */}
      <View
        className="bg-white border-b px-5 py-4"
        style={{ borderBottomColor: COLORS.border }}
      >
        {isLoadingClasses ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : error ? (
          <Text
            className="text-sm font-semibold"
            style={{ color: COLORS.error }}
          >
            {error}
          </Text>
        ) : (
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: COLORS.textSecondary }}
              >
                Filter By Class
              </Text>
              <TouchableOpacity
                onPress={() => fetchAllLessonPlans(teacherId)}
                className="px-3 py-1.5 rounded-lg border"
                style={{
                  backgroundColor:
                    viewMode === "ALL" ? COLORS.primary : COLORS.white,
                  borderColor:
                    viewMode === "ALL" ? COLORS.primary : COLORS.border,
                }}
              >
                <Text
                  className="font-bold text-xs"
                  style={{
                    color:
                      viewMode === "ALL" ? COLORS.white : COLORS.textPrimary,
                  }}
                >
                  Show All Plans
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {teacherClasses.map((cls) => {
                  const isSelected =
                    viewMode === "SPECIFIC" &&
                    selectedClass?.classSectionId === cls.classSectionId;
                  return (
                    <TouchableOpacity
                      key={cls.classSectionId}
                      onPress={() => {
                        setViewMode("SPECIFIC");
                        setSelectedClass(cls);
                        setSelectedSubject(cls.subjectsTaught[0] || null);
                      }}
                      className="px-4 py-2 rounded-lg border"
                      style={{
                        backgroundColor: isSelected
                          ? COLORS.primary
                          : COLORS.white,
                        borderColor: isSelected
                          ? COLORS.primary
                          : COLORS.border,
                      }}
                    >
                      <Text
                        className="font-semibold text-sm"
                        style={{
                          color: isSelected ? COLORS.white : COLORS.textPrimary,
                        }}
                      >
                        {cls.className}-{cls.section}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {viewMode === "SPECIFIC" &&
              selectedClass &&
              selectedClass.subjectsTaught.length > 0 && (
                <View>
                  <Text
                    className="text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Select Subject
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                  >
                    {selectedClass.subjectsTaught.map((sub) => {
                      const isSelected =
                        selectedSubject?.subjectId === sub.subjectId;
                      return (
                        <TouchableOpacity
                          key={sub.subjectId}
                          onPress={() => setSelectedSubject(sub)}
                          className="px-4 py-2 rounded-lg border"
                          style={{
                            backgroundColor: isSelected
                              ? COLORS.secondary
                              : COLORS.white,
                            borderColor: isSelected
                              ? COLORS.secondary
                              : COLORS.border,
                          }}
                        >
                          <Text
                            className="font-semibold text-sm"
                            style={{
                              color: isSelected
                                ? COLORS.white
                                : COLORS.textPrimary,
                            }}
                          >
                            {sub.subjectName}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
          </View>
        )}
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
        {/* Stats Cards */}
        {!isLoadingPlans && shouldShowData && lessonPlans.length > 0 && (
          <View
            className={
              Platform.OS === "web"
                ? "flex-row flex-wrap w-full gap-4 mb-6"
                : `flex-row flex-wrap justify-between w-full mb-6 ${isDesktop ? "gap-6" : "gap-3"}`
            }
          >
            {[
              {
                icon: BookOpen,
                label: "Total Plans",
                value: stats.total,
                bg: `${COLORS.primary}1A`,
                iconColor: COLORS.primary,
              },
              {
                icon: Target,
                label: "Pending",
                value: stats.pending,
                bg: `${COLORS.warning}1A`,
                iconColor: COLORS.warning,
              },
              {
                icon: CheckCircle2,
                label: "Completed",
                value: stats.completed,
                bg: `${COLORS.success}1A`,
                iconColor: COLORS.success,
              },
            ].map((stat, idx) => (
              <View
                key={idx}
                className="flex-1 min-w-[30%] flex-col items-center justify-center rounded-2xl border"
                style={{
                  ...(Platform.OS === "web" ? { flex: 1 } : {}),
                  padding: isDesktop ? 24 : 16,
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
                    size={isDesktop ? 28 : 24}
                    color={stat.iconColor}
                  />
                </View>
                <Text
                  className="font-black text-center mb-1"
                  style={{
                    color: COLORS.textPrimary,
                    fontSize: isDesktop ? 28 : 22,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  className="font-bold text-center uppercase tracking-wider"
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: isDesktop ? 12 : 10,
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Search and Filter */}
        {!isLoadingPlans && shouldShowData && lessonPlans.length > 0 && (
          <>
            <View
              className="flex-row items-center rounded-xl px-4 py-1.5 mb-5 border"
              style={{
                backgroundColor: COLORS.bgWhite,
                borderColor: COLORS.border,
              }}
            >
              <Search
                size={20}
                color={COLORS.textSecondary}
                style={{ marginRight: 12 }}
              />
              <TextInput
                className="flex-1 py-3 text-base"
                placeholder="Search topics..."
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
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text
                    className="font-semibold text-sm py-3 mr-3"
                    style={{ color: COLORS.primary }}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="p-2 -mr-2"
                onPress={() => setIsFilterVisible(!isFilterVisible)}
              >
                <Filter
                  size={20}
                  color={
                    activeFilter !== "all"
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>

            {isFilterVisible && (
              <View className="flex-row flex-wrap gap-2.5 mb-5">
                {(["all", "completed", "pending"] as FilterType[]).map(
                  (filter) => {
                    let IconComponent = null;
                    let iconColor = COLORS.textSecondary;
                    if (filter === "completed") {
                      IconComponent = CheckCircle2;
                      iconColor = COLORS.success;
                    }
                    if (filter === "pending") {
                      IconComponent = Target;
                      iconColor = COLORS.pending;
                    }

                    const isActive = activeFilter === filter;
                    return (
                      <TouchableOpacity
                        key={filter}
                        className="flex-row items-center gap-1.5 px-4 py-2.5 rounded-full border"
                        style={[
                          isActive
                            ? {
                                backgroundColor: COLORS.primary,
                                borderColor: COLORS.primary,
                              }
                            : {
                                backgroundColor: COLORS.bgWhite,
                                borderColor: COLORS.border,
                              },
                        ]}
                        onPress={() => setActiveFilter(filter)}
                      >
                        {IconComponent && (
                          <IconComponent
                            size={14}
                            color={isActive ? COLORS.white : iconColor}
                          />
                        )}
                        <Text
                          className="text-xs font-bold capitalize"
                          style={{
                            color: isActive
                              ? COLORS.white
                              : COLORS.textSecondary,
                          }}
                        >
                          {filter === "all" ? "All" : filter}
                        </Text>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
            )}
          </>
        )}

        {/* Loading / Error / Data List */}
        {isLoadingPlans ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text
              className="mt-4 font-bold"
              style={{ color: COLORS.textSecondary }}
            >
              Loading lesson plans...
            </Text>
          </View>
        ) : viewMode === "SPECIFIC" && (!selectedClass || !selectedSubject) ? (
          <View className="items-center justify-center py-20 gap-3">
            <BookOpen size={48} color={COLORS.textTertiary} />
            <Text
              className="text-lg font-bold mt-2"
              style={{ color: COLORS.textPrimary }}
            >
              Select Class & Subject
            </Text>
            <Text
              className="text-sm text-center font-medium"
              style={{ color: COLORS.textSecondary }}
            >
              Please select a class and subject to view the lesson plans.
            </Text>
          </View>
        ) : filteredPlans.length === 0 ? (
          <View className="items-center justify-center py-20 gap-3">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: COLORS.border }}
            >
              <BookOpen size={32} color={COLORS.textSecondary} />
            </View>
            <Text
              className="text-xl font-black mt-2"
              style={{ color: COLORS.textPrimary }}
            >
              {viewMode === "ALL"
                ? "No lesson plans found"
                : "No plans for this class & subject"}
            </Text>
            <Text
              className="text-sm text-center mb-4 font-medium"
              style={{ color: COLORS.textSecondary }}
            >
              Try adjusting your search or select a different class.
            </Text>
            {viewMode === "SPECIFIC" && (
              <TouchableOpacity
                className="flex-row items-center gap-2 px-6 py-3.5 rounded-xl"
                style={{ backgroundColor: COLORS.primary }}
                onPress={() => {
                  resetForm();
                  setIsModalVisible(true);
                }}
              >
                <Plus size={20} color={COLORS.white} />
                <Text className="font-bold text-white">Create New Plan</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="gap-4">
            {filteredPlans.map((plan) => {
              const {
                icon: StatusIcon,
                color: statusColor,
                bg: statusBg,
              } = getStatusConfig(plan.status);

              return (
                <View
                  key={plan.id}
                  className="p-5 rounded-2xl border"
                  style={{
                    backgroundColor: COLORS.bgWhite,
                    borderColor: COLORS.border,
                    ...platformShadow,
                  }}
                >
                  <View className="flex-row justify-between items-center flex-wrap gap-2 mb-4">
                    <View
                      className="flex-row items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: `${COLORS.primary}1A` }}
                    >
                      <Users size={14} color={COLORS.primary} />
                      <Text
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {plan.classStr} • {plan.subject}
                      </Text>
                    </View>
                    <View className="flex-row gap-4 items-center">
                      <TouchableOpacity onPress={() => handleEditPlan(plan)}>
                        <Edit2 size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 size={18} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text
                    className="text-xl font-black mb-2 tracking-tight"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {plan.chapter}
                  </Text>

                  <View
                    className="flex-row items-center justify-between pt-4 border-t mt-4"
                    style={{ borderTopColor: COLORS.border }}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className="flex-row items-center px-3 py-1.5 rounded-lg gap-2"
                        style={{ backgroundColor: statusBg }}
                      >
                        <StatusIcon size={14} color={statusColor} />
                        <Text
                          className="text-xs font-black uppercase tracking-wider"
                          style={{ color: statusColor }}
                        >
                          {plan.status}
                        </Text>
                      </View>

                      {plan.status === "Pending" && (
                        <TouchableOpacity
                          onPress={() => handleMarkAsComplete(plan)}
                          className="flex-row items-center px-3 py-1.5 rounded-lg gap-1 border"
                          style={{
                            backgroundColor: COLORS.white,
                            borderColor: COLORS.success,
                          }}
                        >
                          <CheckCircle2 size={14} color={COLORS.success} />
                          <Text
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: COLORS.success }}
                          >
                            Mark Complete
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View className="flex-row items-center gap-2">
                      <Calendar size={14} color={COLORS.textSecondary} />
                      <Text
                        className="text-xs font-bold"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {formatDate(plan.plannedDate)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={resetForm}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="rounded-2xl p-6 max-h-[90%]"
            style={{
              width: isDesktop ? 600 : "90%",
              backgroundColor: COLORS.bgWhite,
              ...platformShadow,
            }}
          >
            <View
              className="flex-row justify-between items-center mb-6 border-b pb-4"
              style={{ borderBottomColor: COLORS.border }}
            >
              <Text
                className="text-xl font-black"
                style={{ color: COLORS.textPrimary }}
              >
                {editingPlan ? "Edit Lesson Plan" : "Create Lesson Plan"}
              </Text>
              <TouchableOpacity
                onPress={resetForm}
                className="p-2 bg-gray-100 rounded-full"
                style={{ backgroundColor: COLORS.lightGray }}
              >
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-5">
                <View>
                  <Text
                    className="text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Topic Name *
                  </Text>
                  <TextInput
                    className="border-2 rounded-xl p-3.5 text-sm font-medium"
                    style={
                      Platform.OS === "web"
                        ? ({
                            borderColor: COLORS.lightGray,
                            color: COLORS.textPrimary,
                            backgroundColor: COLORS.white,
                            outlineStyle: "none",
                          } as any)
                        : {
                            borderColor: COLORS.lightGray,
                            color: COLORS.textPrimary,
                            backgroundColor: COLORS.white,
                          }
                    }
                    placeholder="e.g., Quadratic Equations"
                    placeholderTextColor={COLORS.textTertiary}
                    value={formData.chapter}
                    onChangeText={(text) =>
                      setFormData({ ...formData, chapter: text })
                    }
                  />
                </View>

                <View>
                  <Text
                    className="text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Planned Date
                  </Text>
                  <TextInput
                    className="border-2 rounded-xl p-3.5 text-sm font-medium"
                    style={
                      Platform.OS === "web"
                        ? ({
                            borderColor: COLORS.lightGray,
                            color: COLORS.textPrimary,
                            backgroundColor: COLORS.white,
                            outlineStyle: "none",
                          } as any)
                        : {
                            borderColor: COLORS.lightGray,
                            color: COLORS.textPrimary,
                            backgroundColor: COLORS.white,
                          }
                    }
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={COLORS.textTertiary}
                    value={formData.plannedDate}
                    onChangeText={(text) =>
                      setFormData({ ...formData, plannedDate: text })
                    }
                  />
                </View>

                <TouchableOpacity
                  className="flex-row items-center justify-center gap-2 py-4 rounded-xl mt-4 mb-2 shadow-sm"
                  style={{
                    backgroundColor: isSubmitting
                      ? COLORS.textSecondary
                      : COLORS.primary,
                  }}
                  onPress={handleCreatePlan}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <>
                      <Save size={20} color={COLORS.white} />
                      <Text className="font-black text-white text-base tracking-wide">
                        {editingPlan ? "UPDATE PLAN" : "SAVE PLAN"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
