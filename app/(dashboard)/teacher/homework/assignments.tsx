import AsyncStorage from "@react-native-async-storage/async-storage";
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

const COLORS = {
  primary: "#E35336",
  primaryLight: "#FEE2DB",
  primaryDark: "#C73E21",
  secondary: "#F4A460",
  secondaryLight: "#FEF0E8",
  bgWarm: "#FFF8F2",
  bgWhite: "#FFFFFF",
  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  border: "#F0E4D8",
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

  // Fetch teacher info (reuse same logic as other screens)
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
        <Text
          className="text-xl font-bold tracking-tight"
          style={{ color: COLORS.textPrimary }}
        >
          Submissions
        </Text>
        <View style={{ width: 40 }} />
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
          Teacher: {teacherName} ({teacherId})
        </Text>
        <Text
          className="text-xs font-bold"
          style={{ color: COLORS.primaryDark }}
          numberOfLines={1}
        >
          Class: {assignedClass}
        </Text>
      </View>

      {/* Assignment ID & Subject ID (optional info) */}
      <View
        className="px-5 py-3 bg-white border-b"
        style={{ borderBottomColor: COLORS.border }}
      >
        <Text
          className="text-xs font-semibold"
          style={{ color: COLORS.textSecondary }}
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
            className="bg-red-50 rounded-2xl p-6 items-center border"
            style={{ borderColor: COLORS.error, backgroundColor: "#FEF2F2" }}
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
                className="bg-white rounded-2xl p-5 border"
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
                    style={{ backgroundColor: COLORS.secondaryLight }}
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
                              // Optionally open link in browser or show a message
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

      {/* Image Preview Modal (same as in assignments list) */}
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
