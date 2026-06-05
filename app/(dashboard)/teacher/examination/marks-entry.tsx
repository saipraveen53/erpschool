import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  error: "#EF4444",
  white: "#FFFFFF",
  lightGray: "#F3F4F6",
};

// Helper for cross-platform alerts
const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    if (onOk) onOk();
  } else {
    Alert.alert(title, message, [{ text: "OK", onPress: onOk }]);
  }
};

export default function MarksEntryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Teacher info state (for display bar)
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");

  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch teacher info (using class-sections to get teacher's own class)
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

  // Fetch assigned exams on mount (using teacherClient)
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        const res = await teacherClient.get("/api/exams/my-subjects");
        const fetchedExams = res.data;
        setExams(fetchedExams);
        if (fetchedExams.length > 0) {
          setSelectedExam(fetchedExams[0]);
        }
      } catch (error) {
        console.error("Failed to load assigned exams:", error);
        showAlert(
          "Error",
          "Failed to load assigned subjects. Please try again.",
        );
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  // Fetch students when selectedExam changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedExam) return;

      try {
        setLoadingStudents(true);
        setStudents([]);
        const res = await teacherClient.get(
          `/api/exams/my-subjects/${selectedExam.examSubjectId}/students`,
        );
        const mappedStudents = res.data.map((student: any) => ({
          ...student,
          marks: "",
          remarks: "",
        }));
        setStudents(mappedStudents);
      } catch (error) {
        console.error("Failed to load students:", error);
        showAlert("Error", "Failed to load students for this exam.");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedExam]);

  const updateMarks = (studentId: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (
      numericValue &&
      selectedExam &&
      parseInt(numericValue) > selectedExam.maxMarks
    ) {
      return;
    }
    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === studentId
          ? { ...student, marks: numericValue }
          : student,
      ),
    );
  };

  const updateRemarks = (studentId: string, text: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === studentId
          ? { ...student, remarks: text }
          : student,
      ),
    );
  };

  const handleSave = async () => {
    if (!selectedExam) return;
    const marksData = students
      .filter((s) => s.marks !== "")
      .map((s) => ({
        studentId: s.studentId,
        obtainedMarks: parseInt(s.marks, 10),
        remarks: s.remarks.trim(),
      }));
    if (marksData.length === 0) {
      showAlert(
        "Notice",
        "No marks entered. Please enter marks for at least one student.",
      );
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        examSubjectId: selectedExam.examSubjectId,
        marks: marksData,
      };
      await teacherClient.post("/api/exams/marks", payload);
      showAlert("Success", "Marks saved successfully!", () => {
        router.back();
      });
    } catch (error) {
      console.error("Failed to save marks:", error);
      showAlert("Error", "Failed to save marks. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Header padding values: reduced for web
  const headerPaddingTop =
    Platform.OS === "web" ? 16 : Platform.OS === "android" ? 48 : 40;
  const headerPaddingBottom = Platform.OS === "web" ? 16 : 20;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
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
            Enter Marks
          </Text>
          <View style={{ width: 40 }} />
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

      {loadingExams ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            className="mt-4 text-sm font-semibold"
            style={{ color: COLORS.textSecondary }}
          >
            Loading assignments...
          </Text>
        </View>
      ) : exams.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <View
            className="p-6 rounded-2xl items-center"
            style={{
              backgroundColor: COLORS.primaryLight,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              className="text-lg font-bold text-center mb-2"
              style={{ color: COLORS.textPrimary }}
            >
              No Exams Assigned
            </Text>
            <Text
              className="text-sm text-center"
              style={{ color: COLORS.textSecondary }}
            >
              You do not have any subjects assigned for marks entry at the
              moment.
            </Text>
          </View>
        </View>
      ) : (
        <View
          className="flex-1 w-full self-center"
          style={{ maxWidth: isDesktop ? 800 : "100%" }}
        >
          {/* Exam Selector Card */}
          <View
            className="mx-4 mt-5 p-5 rounded-2xl"
            style={{
              backgroundColor: COLORS.surface,
              borderWidth: 1,
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
            <Text
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: COLORS.textSecondary }}
            >
              Select Exam & Subject
            </Text>
            <TouchableOpacity
              className="flex-row justify-between items-center px-4 py-3.5 rounded-xl border"
              style={{
                backgroundColor: COLORS.background,
                borderColor: COLORS.border,
              }}
              activeOpacity={0.8}
              onPress={() => setDropdownVisible(true)}
            >
              <Text
                className="text-base font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                {selectedExam ? `${selectedExam.examName}` : "Select..."}
              </Text>
              <ChevronDown size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* List Header */}
          <View className="flex-row justify-between px-8 pt-5 pb-2">
            <Text
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: COLORS.textSecondary }}
            >
              Student Info
            </Text>
            <Text
              className="text-xs font-bold uppercase tracking-wider text-right"
              style={{ color: COLORS.textSecondary }}
            >
              Marks ({selectedExam ? selectedExam.maxMarks : "--"})
            </Text>
          </View>

          {/* Student List */}
          {loadingStudents ? (
            <View className="py-10 items-center">
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : students.length === 0 ? (
            <View className="py-10 items-center px-6">
              <Text
                className="text-center font-medium"
                style={{ color: COLORS.textSecondary }}
              >
                No students found for this subject/exam configuration.
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 120,
              }}
            >
              {students.map((student) => (
                <View
                  key={student.studentId}
                  className="p-5 rounded-2xl mb-4 border"
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
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-1 pr-3">
                      <Text
                        className="text-base font-bold mb-1"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {student.fullName}
                      </Text>
                      <Text
                        className="text-xs font-medium"
                        style={{ color: COLORS.textSecondary }}
                      >
                        Roll No: {student.rollNumber}
                      </Text>
                    </View>
                    <View className="items-end">
                      <TextInput
                        className="w-[80px] text-center text-lg font-bold py-2.5 rounded-xl border"
                        style={{
                          backgroundColor: COLORS.background,
                          color: COLORS.primary,
                          borderColor: COLORS.border,
                          ...Platform.select({
                            web: { outlineStyle: "none" } as any,
                          }),
                        }}
                        keyboardType="numeric"
                        maxLength={3}
                        placeholder="--"
                        placeholderTextColor={COLORS.textTertiary}
                        value={student.marks}
                        onChangeText={(val) =>
                          updateMarks(student.studentId, val)
                        }
                      />
                    </View>
                  </View>

                  {/* Remarks Input */}
                  <View>
                    <TextInput
                      className="w-full text-sm py-2.5 px-4 rounded-xl border"
                      style={{
                        backgroundColor: COLORS.background,
                        color: COLORS.textPrimary,
                        borderColor: COLORS.border,
                        ...Platform.select({
                          web: { outlineStyle: "none" } as any,
                        }),
                      }}
                      placeholder="Add remarks (optional)..."
                      placeholderTextColor={COLORS.textTertiary}
                      value={student.remarks}
                      onChangeText={(val) =>
                        updateRemarks(student.studentId, val)
                      }
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Bottom Bar (fixed) */}
          <View
            className="absolute bottom-0 w-full px-5 py-4 border-t"
            style={{
              backgroundColor: COLORS.surface,
              borderTopColor: COLORS.border,
            }}
          >
            <TouchableOpacity
              className="py-3.5 rounded-xl items-center flex-row justify-center gap-2"
              style={{
                backgroundColor:
                  isSaving || loadingStudents || students.length === 0
                    ? COLORS.textTertiary
                    : COLORS.primary,
              }}
              onPress={handleSave}
              disabled={isSaving || loadingStudents || students.length === 0}
            >
              {isSaving && (
                <ActivityIndicator size="small" color={COLORS.surface} />
              )}
              <Text className="text-white font-bold text-base tracking-wide">
                {isSaving ? "Saving..." : "Save Marks"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Dropdown Modal */}
      <Modal visible={isDropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View
            className="bg-white rounded-t-3xl p-6 pb-10"
            style={{ backgroundColor: COLORS.surface }}
          >
            <Text
              className="text-xl font-black mb-5"
              style={{ color: COLORS.textPrimary }}
            >
              Choose Assessment
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {exams.map((exam) => {
                const isSelected =
                  selectedExam?.examSubjectId === exam.examSubjectId;
                return (
                  <TouchableOpacity
                    key={exam.examSubjectId}
                    className="py-4 px-4 rounded-xl mb-2 border"
                    style={[
                      isSelected
                        ? {
                            backgroundColor: COLORS.primaryLight,
                            borderColor: COLORS.primary,
                            borderWidth: 1,
                          }
                        : {
                            backgroundColor: COLORS.surface,
                            borderColor: COLORS.border,
                            borderWidth: 1,
                          },
                    ]}
                    onPress={() => {
                      setSelectedExam(exam);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text
                      className="text-base font-bold mb-1"
                      style={[
                        { color: COLORS.textSecondary },
                        isSelected && {
                          color: COLORS.primary,
                        },
                      ]}
                    >
                      {exam.examName}
                    </Text>
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: COLORS.textTertiary }}
                    >
                      Subject ID: {exam.subjectId} • Max Marks: {exam.maxMarks}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}
