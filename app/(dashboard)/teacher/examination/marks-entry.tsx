import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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
  border: "#F0E4D8",
  white: "#FFFFFF",
  lightGray: "#F3F4F6",
  error: "#EF4444",
};

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
        token = localStorage.getItem("userToken");
      } else {
        token = await AsyncStorage.getItem("userToken");
      }
    } catch (error) {
      console.error("Error retrieving token from storage:", error);
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

  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 3. Fetch Assigned Exams on Mount (Token is handled automatically now)
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        const res = await examClient.get("/api/exams/my-subjects");
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

  // 4. Fetch Students when selectedExam changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedExam) return;

      try {
        setLoadingStudents(true);
        setStudents([]); // Clear current list while loading

        const res = await examClient.get(
          `/api/exams/my-subjects/${selectedExam.examSubjectId}/students`,
        );

        // Map API response and add local 'marks' and 'remarks' fields for state management
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

    // Prevent entering marks higher than maxMarks
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

    // Filter out students who don't have marks entered yet
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

      await examClient.post("/api/exams/marks", payload);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: COLORS.bgWarm }}
    >
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
          Enter Marks
        </Text>
        <View style={{ width: 40 }} />
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
            You do not have any subjects assigned for marks entry at the moment.
          </Text>
        </View>
      ) : (
        <View
          className="flex-1 w-full self-center"
          style={{ maxWidth: isDesktop ? 800 : "100%" }}
        >
          {/* Exam Selector */}
          <View
            className="p-6 bg-white mb-4 border-b"
            style={{
              backgroundColor: COLORS.bgWhite,
              borderBottomColor: COLORS.border,
            }}
          >
            <Text
              className="text-sm font-semibold mb-2 uppercase tracking-wider"
              style={{ color: COLORS.textSecondary }}
            >
              Select Exam & Subject
            </Text>
            <TouchableOpacity
              className="flex-row justify-between items-center px-4 py-4 rounded-xl border"
              style={{
                backgroundColor: COLORS.lightGray,
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
          <View className="flex-row justify-between px-8 pb-3">
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
                paddingBottom: 100,
              }}
            >
              {students.map((student) => (
                <View
                  key={student.studentId}
                  className="bg-white p-4 rounded-2xl mb-4 border"
                  style={{
                    backgroundColor: COLORS.bgWhite,
                    borderColor: COLORS.border,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row justify-between items-center mb-3">
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
                        className="w-[75px] text-center text-lg font-bold py-2 rounded-lg border"
                        style={{
                          backgroundColor: COLORS.lightGray,
                          color: COLORS.primary,
                          borderColor: COLORS.border,
                          ...Platform.select({
                            web: { outlineStyle: "none" } as any,
                          }),
                        }}
                        keyboardType="numeric"
                        maxLength={3}
                        placeholder="--"
                        placeholderTextColor={`${COLORS.textSecondary}80`}
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
                      className="w-full text-sm py-2.5 px-3 rounded-lg border"
                      style={{
                        backgroundColor: COLORS.bgWhite,
                        color: COLORS.textPrimary,
                        borderColor: COLORS.border,
                        ...Platform.select({
                          web: { outlineStyle: "none" } as any,
                        }),
                      }}
                      placeholder="Add remarks (optional)..."
                      placeholderTextColor={`${COLORS.textSecondary}80`}
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

          {/* Bottom Bar */}
          <View
            className="absolute bottom-0 w-full p-6 bg-white border-t"
            style={{
              backgroundColor: COLORS.bgWhite,
              borderTopColor: COLORS.border,
            }}
          >
            <TouchableOpacity
              className="py-4 rounded-xl items-center flex-row justify-center gap-2"
              style={{
                backgroundColor:
                  isSaving || loadingStudents || students.length === 0
                    ? COLORS.textSecondary
                    : COLORS.primary,
              }}
              onPress={handleSave}
              disabled={isSaving || loadingStudents || students.length === 0}
            >
              {isSaving && (
                <ActivityIndicator size="small" color={COLORS.white} />
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
            style={{ backgroundColor: COLORS.bgWhite }}
          >
            <Text
              className="text-xl font-black mb-5"
              style={{ color: COLORS.textPrimary }}
            >
              Choose Assessment
            </Text>
            {exams.map((exam) => {
              const isSelected =
                selectedExam?.examSubjectId === exam.examSubjectId;
              return (
                <TouchableOpacity
                  key={exam.examSubjectId}
                  className="py-4 px-4 border-b rounded-xl mb-2"
                  style={[
                    isSelected && {
                      backgroundColor: `${COLORS.primary}1A`,
                      borderColor: COLORS.primary,
                      borderWidth: 1,
                    },
                    !isSelected && { borderBottomColor: COLORS.border },
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
                        fontWeight: "900",
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
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}
