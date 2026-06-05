import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  User,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
  error: "#EF4444",
  warning: "#F59E0B",
  white: "#FFFFFF",
  lightGray: "#F8F9FA",
};

const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const baseURL = teacherClient.defaults.baseURL || "";
  return `${baseURL}${path}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return COLORS.success;
    case "REJECTED":
      return COLORS.error;
    default:
      return COLORS.warning;
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return <CheckCircle size={16} color={COLORS.white} />;
    case "REJECTED":
      return <XCircle size={16} color={COLORS.white} />;
    default:
      return <Clock size={16} color={COLORS.white} />;
  }
};

export default function AssignmentDetailsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const params = useLocalSearchParams();
  const { assignmentId, subjectId } = params as {
    assignmentId: string;
    subjectId: string;
  };

  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Image preview modal
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  // Fetch teacher info (using class-sections to get teacher's own class)
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const currentTeacherId =
          Platform.OS === "web"
            ? localStorage.getItem("userUsername")
            : await AsyncStorage.getItem("userUsername");
        if (currentTeacherId) setTeacherId(currentTeacherId);
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

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!assignmentId || !subjectId) {
        setErrorMsg("Missing assignment or subject ID.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const res = await teacherClient.get(
          `/api/student/assignment-submissions/${assignmentId}/${subjectId}/all`,
        );
        const data = res.data;
        if (Array.isArray(data)) {
          setSubmissions(data);
        } else {
          setSubmissions([]);
        }
      } catch (err: any) {
        console.error("Error fetching submissions:", err);
        setErrorMsg(
          err.response?.data?.message || "Failed to load submissions.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId, subjectId]);

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
            Submissions
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

      {/* Assignment ID & Subject ID info */}
      <View
        className="mx-4 mt-4 px-4 py-3 rounded-xl"
        style={{ backgroundColor: COLORS.primaryLight }}
      >
        <Text
          className="text-xs font-semibold"
          style={{ color: COLORS.primaryDark }}
        >
          Assignment ID: {assignmentId} • Subject ID: {subjectId}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            className="mt-4 text-sm"
            style={{ color: COLORS.textSecondary }}
          >
            Loading submissions...
          </Text>
        </View>
      ) : errorMsg ? (
        <View className="flex-1 justify-center items-center px-6">
          <View
            className="rounded-2xl p-6 items-center"
            style={{
              backgroundColor: COLORS.primaryLight,
              borderWidth: 1,
              borderColor: COLORS.error,
            }}
          >
            <Text
              className="text-lg font-bold mb-2"
              style={{ color: COLORS.error }}
            >
              Error
            </Text>
            <Text
              className="text-sm text-center mb-4"
              style={{ color: COLORS.textSecondary }}
            >
              {errorMsg}
            </Text>
            <TouchableOpacity
              className="px-6 py-3 rounded-full"
              style={{ backgroundColor: COLORS.primary }}
              onPress={() => {
                setIsLoading(true);
                setErrorMsg(null);
                const refetch = async () => {
                  try {
                    const res = await teacherClient.get(
                      `/api/student/assignment-submissions/${assignmentId}/${subjectId}/all`,
                    );
                    setSubmissions(Array.isArray(res.data) ? res.data : []);
                  } catch (err: any) {
                    setErrorMsg(
                      err.response?.data?.message || "Failed to reload.",
                    );
                  } finally {
                    setIsLoading(false);
                  }
                };
                refetch();
              }}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : submissions.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <FileText size={48} color={COLORS.textTertiary} />
          <Text
            className="text-lg font-bold mt-4"
            style={{ color: COLORS.textPrimary }}
          >
            No submissions yet
          </Text>
          <Text
            className="text-sm mt-2 text-center"
            style={{ color: COLORS.textSecondary }}
          >
            Students haven't submitted this assignment.
          </Text>
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
            gap: 16,
          }}
        >
          {submissions.map((sub, idx) => {
            const statusColor = getStatusColor(sub.status);
            const isImage = (url: string) =>
              /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
            return (
              <View
                key={idx}
                className="rounded-2xl p-5 border"
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
                {/* Header: Student name and status */}
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="w-8 h-8 rounded-full justify-center items-center"
                      style={{ backgroundColor: COLORS.primaryLight }}
                    >
                      <User size={14} color={COLORS.primary} />
                    </View>
                    <Text
                      className="text-base font-bold"
                      style={{ color: COLORS.textPrimary }}
                    >
                      Student: {sub.studentId}
                    </Text>
                  </View>
                  <View
                    className="flex-row items-center gap-1 px-2 py-1 rounded-full"
                    style={{ backgroundColor: statusColor + "20" }}
                  >
                    {getStatusIcon(sub.status)}
                    <Text
                      className="text-xs font-bold"
                      style={{ color: statusColor }}
                    >
                      {sub.status}
                    </Text>
                  </View>
                </View>

                {/* Submitted date */}
                <View className="flex-row items-center gap-2 mb-3">
                  <Calendar size={14} color={COLORS.textTertiary} />
                  <Text
                    className="text-xs"
                    style={{ color: COLORS.textTertiary }}
                  >
                    Submitted: {formatDate(sub.submittedDate)}
                  </Text>
                </View>

                {/* Note from student */}
                {sub.note ? (
                  <View
                    className="mb-3 p-3 rounded-xl"
                    style={{ backgroundColor: COLORS.primaryLight }}
                  >
                    <Text
                      className="text-xs font-semibold mb-1"
                      style={{ color: COLORS.textSecondary }}
                    >
                      Student's Note
                    </Text>
                    <Text
                      className="text-sm"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {sub.note}
                    </Text>
                  </View>
                ) : null}

                {/* Remark & reviewer */}
                {sub.remark && (
                  <View className="mb-3">
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: COLORS.textSecondary }}
                    >
                      Remark
                    </Text>
                    <Text
                      className="text-sm mt-1"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {sub.remark}
                    </Text>
                    {sub.reviewedBy && (
                      <Text
                        className="text-xs mt-1"
                        style={{ color: COLORS.textTertiary }}
                      >
                        Reviewed by: {sub.reviewedBy}
                      </Text>
                    )}
                  </View>
                )}

                {/* Attached files */}
                {sub.relatedLinks && sub.relatedLinks.length > 0 && (
                  <View className="mt-2">
                    <Text
                      className="text-xs font-semibold mb-2"
                      style={{ color: COLORS.textSecondary }}
                    >
                      Attachments
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {sub.relatedLinks.map((link: string, linkIdx: number) => {
                        const fullUrl = getImageUrl(link);
                        const isImg = isImage(link);
                        return isImg ? (
                          <TouchableOpacity
                            key={linkIdx}
                            onPress={() => {
                              setPreviewImageUrl(fullUrl);
                              setImageModalVisible(true);
                            }}
                          >
                            <Image
                              source={{ uri: fullUrl }}
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: COLORS.border,
                              }}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            key={linkIdx}
                            className="flex-row items-center gap-1 p-2 rounded-lg border"
                            style={{ borderColor: COLORS.border }}
                            onPress={() => {
                              alert(`File: ${link}`);
                            }}
                          >
                            <FileText size={16} color={COLORS.primary} />
                            <Text
                              className="text-xs"
                              style={{ color: COLORS.primary }}
                            >
                              File
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Image Preview Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 bg-black/90 justify-center items-center"
          onPress={() => setImageModalVisible(false)}
        >
          <TouchableOpacity
            className="absolute top-10 right-5 z-10 p-2"
            onPress={() => setImageModalVisible(false)}
          >
            <ArrowLeft size={30} color={COLORS.white} />
          </TouchableOpacity>
          <Image
            source={{ uri: previewImageUrl }}
            style={{ width: "90%", height: "70%" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
