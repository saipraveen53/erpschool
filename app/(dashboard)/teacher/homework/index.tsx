import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  GraduationCap,
  Paperclip,
  Plus,
  Search,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
};

type FilterType = "all" | "active" | "completed";

// Helper to format date as YYYY-MM-DD using local time (no UTC shift)
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get first day of month (0 = Sunday)
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export default function AssignmentsListScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [isLoading, setIsLoading] = useState(true);
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [assignedClass, setAssignedClass] = useState("");
  const [classSectionId, setClassSectionId] = useState("");

  const [assignments, setAssignments] = useState<any[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Create Modal States
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  // Date picker modal
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [pickerCurrentMonth, setPickerCurrentMonth] = useState(
    new Date().getMonth(),
  );
  const [pickerCurrentYear, setPickerCurrentYear] = useState(
    new Date().getFullYear(),
  );

  // Image preview modal state
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [imageLoadError, setImageLoadError] = useState(false);

  // Helper to get full image URL
  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    let baseURL = teacherClient.defaults.baseURL || "";
    if (!baseURL && Platform.OS === "web") {
      baseURL = window.location.origin;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseURL}${normalizedPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const currentTeacherId =
          Platform.OS === "web"
            ? localStorage.getItem("userUsername")
            : await AsyncStorage.getItem("userUsername");

        if (!currentTeacherId) {
          setErrorMessage("Teacher ID not found in storage.");
          setIsLoading(false);
          return;
        }

        setTeacherId(currentTeacherId);

        // 1. Fetch teacher's classes & subjects
        try {
          const classesRes = await teacherClient.get(
            `/api/student/teacher/${currentTeacherId}/classes-subjects`,
          );
          if (classesRes.data && classesRes.data.classes) {
            setTeacherClasses(classesRes.data.classes);
            if (classesRes.data.teacherName) {
              setTeacherName(classesRes.data.teacherName);
            }
          }
        } catch (err) {
          console.error("Error loading teacher classes:", err);
          setErrorMessage("Failed to load class/subject data.");
        }

        // 2. Fetch assigned class for display
        try {
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
            setClassSectionId(assigned.classSectionId);
            if (!teacherName) setTeacherName(assigned.classTeacherName.trim());
          } else {
            setAssignedClass("None");
          }
        } catch (err) {
          console.error("Error fetching class-sections:", err);
        }

        // 3. Fetch assignments list
        try {
          const assignmentsRes = await teacherClient.get(
            `/api/student/assignments/teacher/${currentTeacherId}`,
          );
          if (assignmentsRes.data && assignmentsRes.data.status === "ERROR") {
            setErrorMessage(assignmentsRes.data.message);
            setAssignments([]);
          } else if (
            assignmentsRes.data &&
            Array.isArray(assignmentsRes.data)
          ) {
            setAssignments(assignmentsRes.data);
            setErrorMessage(null);
          } else {
            setAssignments([]);
          }
        } catch (err: any) {
          console.error("Error loading assignments:", err);
          const serverMsg =
            err.response?.data?.message ||
            err.message ||
            "Failed to load assignments.";
          setErrorMessage(serverMsg);
          setAssignments([]);
        }
      } catch (error: any) {
        console.error("General Error fetching data:", error);
        setErrorMessage(error.message || "Unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilePick = () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png";
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedFile(file);
          setFileName(file.name);
        }
      };
      input.click();
    } else {
      alert("File upload is not supported on native yet. Coming soon!");
    }
  };

  const handleCreateAssignment = async () => {
    if (
      !newTitle ||
      !newDescription ||
      !newDueDate ||
      !selectedClass ||
      !selectedSubject
    ) {
      alert("Please fill in all required fields and select a class & subject.");
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const assignmentData = {
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate,
      };
      const jsonString = JSON.stringify(assignmentData);
      const blob = new Blob([jsonString], { type: "application/json" });
      formData.append("data", blob, "data.json");

      await teacherClient.post(
        `/api/student/assignment/${teacherId}/${selectedSubject.subjectId}/${selectedClass.classSectionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Assignment created successfully!");
      setIsCreateModalVisible(false);

      setNewTitle("");
      setNewDescription("");
      setNewDueDate("");
      setSelectedClass(null);
      setSelectedSubject(null);
      setSelectedFile(null);
      setFileName("");

      try {
        const refreshRes = await teacherClient.get(
          `/api/student/assignments/teacher/${teacherId}`,
        );
        if (refreshRes.data && Array.isArray(refreshRes.data)) {
          setAssignments(refreshRes.data);
          setErrorMessage(null);
        }
      } catch (refreshErr) {
        console.warn("Could not refresh assignments after creation");
      }
    } catch (error: any) {
      console.error("Error creating assignment:", error);
      alert(error.response?.data?.message || "Failed to create assignment.");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredAssignments = assignments.filter((hw) => {
    const matchesSearch =
      (hw.title &&
        hw.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (hw.assignedTo &&
        hw.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
    const isCompleted = hw.status === "COMPLETED";
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "completed" && isCompleted) ||
      (activeFilter === "active" && !isCompleted);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: assignments.length,
    active: assignments.filter((h) => h.status === "ASSIGNED").length,
    completed: assignments.filter((h) => h.status !== "ASSIGNED").length,
  };

  const getDueStatusColor = (dueDateStr: string) => {
    if (!dueDateStr) return COLORS.textSecondary;
    const today = new Date();
    const due = new Date(dueDateStr);
    if (due < today) return COLORS.error;
    return COLORS.secondary;
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
        <View className="items-center">
          <Text
            className="text-xl font-bold tracking-tight"
            style={{ color: COLORS.textPrimary }}
          >
            All Assignments
          </Text>
        </View>
        <TouchableOpacity
          className="p-2 -mr-2"
          onPress={() => setIsFilterVisible(!isFilterVisible)}
        >
          <Filter size={20} color={COLORS.textPrimary} />
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
          Teacher: {teacherName || "Loading..."} ({teacherId})
        </Text>
        <Text
          className="text-xs font-bold"
          style={{ color: COLORS.primaryDark }}
          numberOfLines={1}
        >
          Class: {assignedClass || "Loading..."}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            className="mt-4 text-sm font-semibold"
            style={{ color: COLORS.textSecondary }}
          >
            Loading assignments...
          </Text>
        </View>
      ) : errorMessage ? (
        <View className="flex-1 justify-center items-center px-6">
          <View
            className="bg-red-50 rounded-2xl p-6 items-center border"
            style={{ borderColor: COLORS.error, backgroundColor: "#FEF2F2" }}
          >
            <Text
              className="text-lg font-bold mb-2"
              style={{ color: COLORS.error }}
            >
              Unable to Load Assignments
            </Text>
            <Text
              className="text-sm text-center mb-4"
              style={{ color: COLORS.textSecondary }}
            >
              {errorMessage}
            </Text>
            <TouchableOpacity
              className="px-6 py-3 rounded-full"
              style={{ backgroundColor: COLORS.primary }}
              onPress={() => {
                setErrorMessage(null);
                setIsLoading(true);
                const fetchData = async () => {
                  try {
                    const currentTeacherId =
                      Platform.OS === "web"
                        ? localStorage.getItem("userUsername")
                        : await AsyncStorage.getItem("userUsername");
                    if (currentTeacherId) {
                      const res = await teacherClient.get(
                        `/api/student/assignments/teacher/${currentTeacherId}`,
                      );
                      if (res.data && Array.isArray(res.data)) {
                        setAssignments(res.data);
                        setErrorMessage(null);
                      } else if (res.data?.status === "ERROR") {
                        setErrorMessage(res.data.message);
                      } else {
                        setAssignments([]);
                      }
                    }
                  } catch (err: any) {
                    setErrorMessage(
                      err.response?.data?.message || "Failed to retry.",
                    );
                  } finally {
                    setIsLoading(false);
                  }
                };
                fetchData();
              }}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 24,
            maxWidth: isDesktop ? 1000 : "100%",
            alignSelf: "center",
            width: "100%",
            paddingBottom: 100,
          }}
        >
          {/* Stats Overview */}
          <View
            className="flex-row bg-white rounded-2xl p-4 mb-6 justify-around border"
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
            {[
              {
                icon: BookOpen,
                label: "Total",
                value: stats.total,
                bg: `${COLORS.primary}1A`,
                iconColor: COLORS.primary,
              },
              {
                icon: Clock,
                label: "Active",
                value: stats.active,
                bg: `${COLORS.secondary}1A`,
                iconColor: COLORS.secondary,
              },
              {
                icon: CheckCircle,
                label: "Completed",
                value: stats.completed,
                bg: `${COLORS.success}1A`,
                iconColor: COLORS.success,
              },
            ].map((stat, idx) => (
              <View key={idx} className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-full justify-center items-center"
                  style={{ backgroundColor: stat.bg }}
                >
                  <stat.icon size={20} color={stat.iconColor} />
                </View>
                <View>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    className="text-[11px] font-medium"
                    style={{ color: COLORS.textSecondary }}
                  >
                    {stat.label}
                  </Text>
                </View>
                {idx < 2 && (
                  <View
                    className="w-px h-7 mx-2"
                    style={{ backgroundColor: COLORS.border }}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Search Bar */}
          <View
            className="flex-row items-center bg-white rounded-xl px-4 mb-4 border"
            style={{ borderColor: COLORS.border }}
          >
            <Search
              size={20}
              color={COLORS.textSecondary}
              style={{ marginRight: 12 }}
            />
            <TextInput
              className="flex-1 py-3 text-base"
              placeholder="Search by title or class..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ color: COLORS.textPrimary }}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text
                  className="font-semibold text-sm py-3"
                  style={{ color: COLORS.primary }}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Chips */}
          {isFilterVisible && (
            <View className="flex-row gap-3 mb-6">
              {(["all", "active", "completed"] as FilterType[]).map(
                (filter) => (
                  <TouchableOpacity
                    key={filter}
                    className="px-4 py-2 rounded-full border"
                    style={[
                      activeFilter === filter
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
                    <Text
                      className="text-sm font-semibold capitalize"
                      style={{
                        color:
                          activeFilter === filter
                            ? COLORS.white
                            : COLORS.textSecondary,
                      }}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          )}

          {/* Assignments List */}
          <View className="gap-4 mb-6">
            {filteredAssignments.length === 0 ? (
              <View className="items-center justify-center py-12 gap-3">
                <BookOpen size={48} color={COLORS.textSecondary} />
                <Text
                  className="text-lg font-bold mt-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  No assignments found
                </Text>
                <Text
                  className="text-sm text-center"
                  style={{ color: COLORS.textSecondary }}
                >
                  Try adjusting your search criteria
                </Text>
              </View>
            ) : (
              filteredAssignments.map((hw) => {
                const isCompleted = hw.status !== "ASSIGNED";
                const dueColor = getDueStatusColor(hw.dueDate);
                const imageUrl = hw.attachedFiles
                  ? getImageUrl(hw.attachedFiles)
                  : null;
                const isImage =
                  imageUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl);

                return (
                  <TouchableOpacity
                    key={hw.assignmentId}
                    activeOpacity={0.7}
                    onPress={() => {
                      router.push({
                        pathname: "/teacher/homework/assignments",
                        params: {
                          assignmentId: hw.assignmentId,
                          subjectId: hw.subjectId,
                        },
                      });
                    }}
                  >
                    <View
                      className="bg-white p-5 rounded-2xl border"
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
                      <View className="flex-row justify-between items-center mb-3">
                        <View
                          className="flex-row items-center px-2.5 py-1 rounded-md gap-1.5"
                          style={{ backgroundColor: `${COLORS.primary}1A` }}
                        >
                          <GraduationCap size={12} color={COLORS.primary} />
                          <Text
                            className="text-xs font-bold uppercase"
                            style={{ color: COLORS.textPrimary }}
                          >
                            Class {hw.assignedTo}
                          </Text>
                        </View>
                        <View
                          className="flex-row items-center px-2 py-1 rounded-md gap-1"
                          style={{ backgroundColor: `${dueColor}15` }}
                        >
                          {isCompleted ? (
                            <CheckCircle size={12} color={COLORS.success} />
                          ) : (
                            <Clock size={12} color={dueColor} />
                          )}
                          <Text
                            className="text-xs font-bold"
                            style={{
                              color: isCompleted ? COLORS.success : dueColor,
                            }}
                          >
                            {isCompleted ? "Completed" : `Due: ${hw.dueDate}`}
                          </Text>
                        </View>
                      </View>

                      <Text
                        className="text-lg font-bold mb-2"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {hw.title}
                      </Text>
                      <Text
                        className="text-sm leading-5 mb-3"
                        style={{ color: COLORS.textSecondary }}
                        numberOfLines={2}
                      >
                        {hw.description}
                      </Text>

                      <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center gap-2">
                          <Calendar size={12} color={COLORS.textTertiary} />
                          <Text
                            className="text-xs"
                            style={{ color: COLORS.textTertiary }}
                          >
                            Assigned: {hw.assignedDate}
                          </Text>
                        </View>
                        <Text
                          className="text-xs"
                          style={{ color: COLORS.textTertiary }}
                        >
                          Subject ID: {hw.subjectId}
                        </Text>
                      </View>

                      {isImage && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={(e) => {
                            e.stopPropagation();
                            setPreviewImageUrl(imageUrl);
                            setImageLoadError(false);
                            setImageModalVisible(true);
                          }}
                        >
                          <Image
                            source={{ uri: imageUrl }}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 8,
                              marginTop: 8,
                              borderWidth: 1,
                              borderColor: COLORS.border,
                            }}
                            resizeMode="cover"
                            onError={() =>
                              console.warn(
                                "Thumbnail failed to load:",
                                imageUrl,
                              )
                            }
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      {/* Floating Create Assignment Button */}
      {!isLoading && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
          style={{
            backgroundColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 6,
          }}
          onPress={() => setIsCreateModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}

      {/* CREATE ASSIGNMENT MODAL (with calendar picker) */}
      <Modal
        visible={isCreateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View
            className="rounded-t-3xl px-6 pt-6 pb-8"
            style={{ backgroundColor: COLORS.bgWhite, maxHeight: "90%" }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text
                className="text-2xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                New Assignment
              </Text>
              <TouchableOpacity onPress={() => setIsCreateModalVisible(false)}>
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 20 }}
            >
              {/* Select Class */}
              <View>
                <Text
                  className="text-sm font-semibold mb-2"
                  style={{ color: COLORS.textSecondary }}
                >
                  Select Class <Text style={{ color: COLORS.error }}>*</Text>
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {teacherClasses.map((cls) => {
                    const isSelected =
                      selectedClass?.classSectionId === cls.classSectionId;
                    return (
                      <TouchableOpacity
                        key={cls.classSectionId}
                        className="px-4 py-2 rounded-lg border"
                        style={{
                          backgroundColor: isSelected
                            ? COLORS.primary
                            : COLORS.bgWhite,
                          borderColor: isSelected
                            ? COLORS.primary
                            : COLORS.border,
                        }}
                        onPress={() => {
                          setSelectedClass(cls);
                          setSelectedSubject(null);
                        }}
                      >
                        <Text
                          className="font-semibold text-sm"
                          style={{
                            color: isSelected
                              ? COLORS.white
                              : COLORS.textSecondary,
                          }}
                        >
                          Class {cls.className}-{cls.section.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Select Subject */}
              <View>
                <Text
                  className="text-sm font-semibold mb-2"
                  style={{ color: COLORS.textSecondary }}
                >
                  Select Subject <Text style={{ color: COLORS.error }}>*</Text>
                </Text>
                {!selectedClass ? (
                  <Text
                    className="text-sm italic"
                    style={{ color: COLORS.textTertiary }}
                  >
                    Select a class first
                  </Text>
                ) : selectedClass.subjectsTaught?.length === 0 ? (
                  <Text
                    className="text-sm italic"
                    style={{ color: COLORS.textTertiary }}
                  >
                    No subjects assigned to this class
                  </Text>
                ) : (
                  <View className="flex-row flex-wrap gap-2">
                    {selectedClass.subjectsTaught.map((sub: any) => (
                      <TouchableOpacity
                        key={sub.subjectId}
                        className="px-4 py-2 rounded-lg border"
                        style={{
                          backgroundColor:
                            selectedSubject?.subjectId === sub.subjectId
                              ? COLORS.primary
                              : COLORS.bgWhite,
                          borderColor:
                            selectedSubject?.subjectId === sub.subjectId
                              ? COLORS.primary
                              : COLORS.border,
                        }}
                        onPress={() => setSelectedSubject(sub)}
                      >
                        <Text
                          className="font-semibold text-sm"
                          style={{
                            color:
                              selectedSubject?.subjectId === sub.subjectId
                                ? COLORS.white
                                : COLORS.textSecondary,
                          }}
                        >
                          {sub.subjectName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Title */}
              <View>
                <Text
                  className="text-sm font-semibold mb-2"
                  style={{ color: COLORS.textSecondary }}
                >
                  Title <Text style={{ color: COLORS.error }}>*</Text>
                </Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-xl border text-base"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                    backgroundColor: COLORS.bgWarm,
                  }}
                  placeholder="Ex: Chapter 1 Homework"
                  placeholderTextColor={COLORS.textTertiary}
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>

              {/* Description */}
              <View>
                <Text
                  className="text-sm font-semibold mb-2"
                  style={{ color: COLORS.textSecondary }}
                >
                  Description <Text style={{ color: COLORS.error }}>*</Text>
                </Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-xl border text-base"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                    backgroundColor: COLORS.bgWarm,
                    minHeight: 100,
                  }}
                  placeholder="Enter assignment details..."
                  placeholderTextColor={COLORS.textTertiary}
                  multiline
                  textAlignVertical="top"
                  value={newDescription}
                  onChangeText={setNewDescription}
                />
              </View>

              {/* Due Date – button opens calendar modal (FIXED: uses local date format) */}
              <View>
                <Text
                  className="text-sm font-semibold mb-2"
                  style={{ color: COLORS.textSecondary }}
                >
                  Due Date <Text style={{ color: COLORS.error }}>*</Text>
                </Text>
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3 rounded-xl border"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.bgWarm,
                  }}
                  onPress={() => setDatePickerModalVisible(true)}
                >
                  <Calendar
                    size={18}
                    color={COLORS.textSecondary}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className="text-base"
                    style={{
                      color: newDueDate
                        ? COLORS.textPrimary
                        : COLORS.textTertiary,
                    }}
                  >
                    {newDueDate ? newDueDate : "Select Due Date"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Attach File */}
              <View>
                <Text
                  className="text-sm font-semibold mb-2"
                  style={{ color: COLORS.textSecondary }}
                >
                  Attach File
                </Text>
                <TouchableOpacity
                  className="flex-row items-center justify-center px-4 py-3 rounded-xl border"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.bgWarm,
                    gap: 8,
                  }}
                  onPress={handleFilePick}
                >
                  <Paperclip size={18} color={COLORS.primary} />
                  <Text className="text-base" style={{ color: COLORS.primary }}>
                    {fileName ? fileName : "Choose File"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Calendar Picker Modal – FIXED: uses local date formatting */}
            <Modal
              visible={datePickerModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setDatePickerModalVisible(false)}
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
                      Select Due Date
                    </Text>
                    <TouchableOpacity
                      onPress={() => setDatePickerModalVisible(false)}
                    >
                      <X size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <View className="p-4">
                    {/* Month header */}
                    <View className="flex-row justify-between items-center mb-4">
                      <TouchableOpacity
                        onPress={() => {
                          if (pickerCurrentMonth === 0) {
                            setPickerCurrentMonth(11);
                            setPickerCurrentYear(pickerCurrentYear - 1);
                          } else {
                            setPickerCurrentMonth(pickerCurrentMonth - 1);
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
                        {new Date(
                          pickerCurrentYear,
                          pickerCurrentMonth,
                        ).toLocaleString("default", { month: "long" })}{" "}
                        {pickerCurrentYear}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (pickerCurrentMonth === 11) {
                            setPickerCurrentMonth(0);
                            setPickerCurrentYear(pickerCurrentYear + 1);
                          } else {
                            setPickerCurrentMonth(pickerCurrentMonth + 1);
                          }
                        }}
                        className="p-2"
                      >
                        <ChevronRight size={24} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>

                    {/* Weekday headers */}
                    <View className="flex-row mb-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <View key={day} className="flex-1 items-center">
                            <Text
                              className="text-xs font-semibold"
                              style={{ color: COLORS.textSecondary }}
                            >
                              {day}
                            </Text>
                          </View>
                        ),
                      )}
                    </View>

                    {/* Days grid – using local date format */}
                    <FlatList
                      data={(() => {
                        const daysInMonth = getDaysInMonth(
                          pickerCurrentYear,
                          pickerCurrentMonth,
                        );
                        const firstDay = getFirstDayOfMonth(
                          pickerCurrentYear,
                          pickerCurrentMonth,
                        );
                        const daysArray = [];
                        for (let i = 0; i < firstDay; i++) {
                          daysArray.push({ date: null, key: `empty-${i}` });
                        }
                        for (let d = 1; d <= daysInMonth; d++) {
                          const dateObj = new Date(
                            pickerCurrentYear,
                            pickerCurrentMonth,
                            d,
                          );
                          const dateStr = formatLocalDate(dateObj); // FIXED: local format
                          daysArray.push({
                            date: dateObj,
                            day: d,
                            dateStr,
                            key: d.toString(),
                          });
                        }
                        return daysArray;
                      })()}
                      numColumns={7}
                      keyExtractor={(item) => item.key}
                      renderItem={({ item }) => (
                        <View className="flex-1 aspect-square p-1">
                          {item.date ? (
                            <TouchableOpacity
                              className="flex-1 justify-center items-center rounded-full"
                              style={{
                                backgroundColor:
                                  newDueDate === item.dateStr
                                    ? COLORS.primary
                                    : "transparent",
                              }}
                              onPress={() => {
                                setNewDueDate(item.dateStr); // stores local YYYY-MM-DD
                                setDatePickerModalVisible(false);
                              }}
                            >
                              <Text
                                className="text-sm font-semibold"
                                style={{
                                  color:
                                    newDueDate === item.dateStr
                                      ? COLORS.white
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

                  <View
                    className="p-4 border-t"
                    style={{ borderColor: COLORS.border }}
                  >
                    <TouchableOpacity
                      onPress={() => setDatePickerModalVisible(false)}
                      className="py-3 rounded-xl items-center"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      <Text className="text-white font-semibold">Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Action Buttons */}
            <View className="flex-row gap-4 mt-8">
              <TouchableOpacity
                className="flex-1 py-4 rounded-2xl items-center border"
                style={{ borderColor: COLORS.border }}
                onPress={() => setIsCreateModalVisible(false)}
              >
                <Text
                  className="font-semibold text-base"
                  style={{ color: COLORS.textSecondary }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-4 rounded-2xl items-center flex-row justify-center gap-2"
                style={{ backgroundColor: COLORS.primary }}
                onPress={handleCreateAssignment}
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Plus size={18} color={COLORS.white} />
                    <Text className="text-white font-bold text-base">
                      Post Assignment
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
        animationType="fade"
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.95)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setImageModalVisible(false)}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
            onPress={() => setImageModalVisible(false)}
          >
            <X size={30} color={COLORS.white} />
          </TouchableOpacity>
          {imageLoadError ? (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: COLORS.white, marginBottom: 10 }}>
                Failed to load image
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setImageLoadError(false);
                  setPreviewImageUrl(previewImageUrl);
                }}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: COLORS.white }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Image
              source={{ uri: previewImageUrl }}
              style={{ width: "90%", height: "70%" }}
              resizeMode="contain"
              onError={() => setImageLoadError(true)}
              onLoadStart={() => setImageLoadError(false)}
            />
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
