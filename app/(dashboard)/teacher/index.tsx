import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Bell,
  BookOpen,
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardEdit,
  GraduationCap,
  LogOut,
  MessageSquare,
  PieChart,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { teacherClient } from "./Axios/teacherClient";

const isWeb = Platform.OS === "web";

const COLORS = {
  primary: "#E35336",
  accent: "#F5F50C",
  secondary: "#F4A460",
  primaryLight: "#FDE8E3",
  primaryDark: "#C73E21",
  secondaryLight: "#FEF0E8",
  accentLight: "#FEFCE8",
  bgWhite: "#FFFFFF",
  darkBg: "#2A1308",
  cardDark: "#3E1F0D",
  cardLight: "#FFFCF8",
  textTertiary: "#B8956E",
  textSecondary: "#8B5E3C",
  textPrimary: "#5C2E14",
  white: "#FFFFFF",
  lightGray: "#F8F9FA",
  border: "#F0E4D8",
  shadowLight: "#E8D5C4",
  gradientStart: "#FFF8F2",
  gradientEnd: "#FEE2DB",
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

const teacherModules = [
  {
    title: "Attendance",
    route: "/teacher/attendance",
    icon: ClipboardCheck,
    desc: "Mark & view history",
  },
  {
    title: "Timetable",
    route: "/teacher/timetable",
    icon: Calendar,
    desc: "View daily schedule",
  },
  {
    title: "Homework",
    route: "/teacher/homework",
    icon: BookOpen,
    desc: "Assign & upload work",
  },
  {
    title: "Lesson Plan",
    route: "/teacher/lesson-plan",
    icon: ClipboardEdit,
    desc: "Manage curriculum",
  },
  {
    title: "Examination",
    route: "/teacher/examination",
    icon: GraduationCap,
    desc: "Grades & marks entry",
  },
  {
    title: "Communication",
    route: "/teacher/communication",
    icon: MessageSquare,
    desc: "Notices & parents",
  },
  {
    title: "Leave",
    route: "/teacher/leave",
    icon: CalendarCheck,
    desc: "Apply & track leaves",
  },
  {
    title: "My Attendance",
    route: "/teacher/reports",
    icon: PieChart,
    desc: "View attendance reports",
  },
];

export default function TeacherDashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { logout } = useAuth();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const numColumns = isDesktop ? 4 : isTablet ? 3 : 2;
  const containerWidth = Math.min(width, 1200);
  const cardWidth = (containerWidth - 48 - (numColumns - 1) * 16) / numColumns;

  // Teacher info
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");
  const [classSectionId, setClassSectionId] = useState("");

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState({
    totalActiveStudents: 0,
    totalClassSections: 0,
    overallPassPercentage: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Assigned Subjects & Count Stats State
  const [assignedStats, setAssignedStats] = useState({
    assignmentCount: 0,
    assignedSubjectCount: 0,
  });
  const [assignedLoading, setAssignedLoading] = useState(true);

  // Attendance summary state (present, absent, half-day)
  const [attendanceSummary, setAttendanceSummary] = useState({
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0,
  });
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  // Notifications
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bellPosition, setBellPosition] = useState({ y: 0, height: 0 });

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Module animations
  const fadeAnims = useRef(
    teacherModules.map(() => new Animated.Value(0)),
  ).current;
  const slideAnims = useRef(
    teacherModules.map(() => new Animated.Value(20)),
  ).current;

  // Campus feed state
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedImageModalVisible, setFeedImageModalVisible] = useState(false);
  const [feedPreviewImage, setFeedPreviewImage] = useState("");

  // Notices state
  const [notices, setNotices] = useState<any[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);

  const calendarDates = useMemo(() => {
    const dates = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 3);
    for (let i = 0; i < 14; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  // Fetch teacher info (using teacherClient)
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
          setClassSectionId(assigned.classSectionId);
        } else {
          setTeacherName("Not Found");
          setAssignedClass("None");
        }
      } catch (error) {
        console.error("Failed to load teacher info:", error);
      }
    };
    fetchTeacherInfo();
  }, []);

  // Fetch Teacher Dashboard Stats
  useEffect(() => {
    if (!teacherId) return;

    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);
        const res = await teacherClient.get(
          `/api/teacher/dashboard/${teacherId}`,
        );
        if (res.data) {
          setDashboardStats({
            totalActiveStudents: res.data.totalActiveStudents || 0,
            totalClassSections: res.data.totalClassSections || 0,
            overallPassPercentage: res.data.overallPassPercentage || 0,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [teacherId]);

  // Fetch Assigned Subjects & Assignment Counts
  useEffect(() => {
    const fetchAssignedStats = async () => {
      try {
        setAssignedLoading(true);
        const res = await teacherClient.get(
          "/api/student/teacher/assignedCount",
        );
        if (res.data) {
          setAssignedStats({
            assignmentCount: res.data.assignmentCount || 0,
            assignedSubjectCount: res.data.assignedSubjectCount || 0,
          });
        }
      } catch (error) {
        console.error("Failed to load assigned stats:", error);
      } finally {
        setAssignedLoading(false);
      }
    };

    fetchAssignedStats();
  }, []);

  // Fetch attendance summary
  useEffect(() => {
    if (!teacherId) return;

    const fetchAttendanceSummary = async () => {
      setAttendanceLoading(true);
      const month = selectedDate.getMonth() + 1; // getMonth() is 0-indexed
      const year = selectedDate.getFullYear();
      try {
        const res = await teacherClient.get(
          "/api/student/teacher/dashboard/attendance",
          {
            params: {
              teacherId,
              month,
              year,
            },
          },
        );
        const data = res.data;
        setAttendanceSummary({
          presentCount: data.presentCount ?? 0,
          absentCount: data.absentCount ?? 0,
          leaveCount: data.leaveCount ?? 0,
        });
      } catch (error) {
        console.error("Failed to load attendance summary:", error);
        setAttendanceSummary({
          presentCount: 0,
          absentCount: 0,
          leaveCount: 0,
        });
      } finally {
        setAttendanceLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, [teacherId, selectedDate]);

  // Fetch campus feed (using teacherClient)
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await teacherClient.get("/api/student/feed/all");
        setFeedItems(res.data);
      } catch (err) {
        console.error("Failed to load feed:", err);
      } finally {
        setFeedLoading(false);
      }
    };
    fetchFeed();
  }, []);

  // Fetch school notices (using teacherClient)
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await teacherClient.get("/api/student/notice/all");
        setNotices(res.data);
      } catch (err) {
        console.error("Failed to load notices:", err);
      } finally {
        setNoticesLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Helper for feed image URL
  const getFeedImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseURL = teacherClient.defaults.baseURL || "";
    return `${baseURL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // Fetch unread count (using teacherClient)
  const fetchUnreadCount = async () => {
    if (!teacherId) return;
    try {
      const res = await teacherClient.get(
        `/api/student/notifications/unread-count/${teacherId}`,
      );
      setUnreadCount(res.data);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  // Fetch notifications (with pagination) (using teacherClient)
  const fetchNotifications = async (reset = false) => {
    if (!teacherId) return;
    const currentPage = reset ? 0 : page;
    setNotificationsLoading(reset);
    setLoadingMore(!reset);
    try {
      const res = await teacherClient.get(
        `/api/student/notifications/all/${teacherId}?page=${currentPage}&size=10`,
      );
      const data = res.data;
      if (reset) {
        setNotifications(data);
        setPage(1);
        setHasMore(data.length === 10);
      } else {
        setNotifications((prev) => [...prev, ...data]);
        setPage(currentPage + 1);
        setHasMore(data.length === 10);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setNotificationsLoading(false);
      setLoadingMore(false);
    }
  };

  // Mark notification as read (using teacherClient)
  const markAsRead = async (notificationId: number) => {
    try {
      await teacherClient.post(
        `/api/student/notifications/read/${notificationId}`,
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, readFlag: true } : notif,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Open dropdown
  const openDropdown = () => {
    if (notifications.length === 0) {
      fetchNotifications(true);
    }
    setDropdownVisible(true);
  };

  // Load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !notificationsLoading) {
      fetchNotifications();
    }
  };

  // Initial unread count fetch
  useEffect(() => {
    if (teacherId) {
      fetchUnreadCount();
    }
  }, [teacherId]);

  // Module entrance animations
  useEffect(() => {
    Animated.stagger(
      100,
      fadeAnims.map((anim, idx) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnims[idx], {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // Platform-specific dropdown width & offset
  const dropdownWidth =
    Platform.OS === "android"
      ? Math.min(width - 32, 340)
      : Math.min(width - 40, 400);
  const dropdownRightOffset = Platform.OS === "android" ? 16 : 20;

  // Helper to format month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.lightGray }}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* Modern Header */}
      <View
        style={{
          backgroundColor: COLORS.bgWhite,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingTop: Platform.OS === "android" ? 48 : 40,
          paddingBottom: 20,
          paddingHorizontal: 24,
          ...Platform.select({
            android: {
              elevation: 6,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            web: {
              boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
            },
          }),
        }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text
              className="text-sm font-semibold"
              style={{ color: COLORS.textSecondary }}
            >
              Welcome back,
            </Text>
            <Text
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: COLORS.textPrimary }}
            >
              {teacherName}
            </Text>
            <View className="flex-row items-center mt-1 flex-wrap gap-1">
              <View className="bg-primaryLight px-2 py-0.5 rounded-full">
                <Text className="text-xs" style={{ color: COLORS.primaryDark }}>
                  ID: {teacherId}
                </Text>
              </View>
              <Text className="text-xs" style={{ color: COLORS.textSecondary }}>
                •
              </Text>
              <View className="bg-primaryLight px-2 py-0.5 rounded-full">
                <Text className="text-xs" style={{ color: COLORS.primaryDark }}>
                  Class: {assignedClass}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-4">
            {/* Bell Icon with Badge */}
            <View
              onLayout={(event) => {
                const { y, height } = event.nativeEvent.layout;
                setBellPosition({ y, height });
              }}
            >
              <TouchableOpacity
                onPress={openDropdown}
                activeOpacity={0.7}
                className="relative"
              >
                <Bell size={24} color={COLORS.textPrimary} />
                {unreadCount > 0 && (
                  <View
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[20px] h-[20px] justify-center items-center px-1"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <Text className="text-white text-[10px] font-bold">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="w-12 h-12 rounded-full justify-center items-center"
              style={{ backgroundColor: COLORS.primary }}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">
                {teacherName.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 rounded-full"
              style={{ backgroundColor: COLORS.primaryLight }}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Dropdown Backdrop */}
      {dropdownVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
        />
      )}

      {/* Notifications Dropdown */}
      {dropdownVisible && (
        <Animated.View
          style={{
            position: "absolute",
            right: dropdownRightOffset,
            top: bellPosition.y + bellPosition.height + 10,
            width: dropdownWidth,
            maxHeight: 520,
            backgroundColor: COLORS.bgWhite,
            borderRadius: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 12,
            zIndex: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            overflow: "hidden",
          }}
        >
          <View
            className="flex-row justify-between items-center p-4 border-b"
            style={{
              borderBottomColor: COLORS.border,
              backgroundColor: COLORS.primaryLight,
            }}
          >
            <Text
              className="text-lg font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              Notifications
            </Text>
            <TouchableOpacity onPress={() => setDropdownVisible(false)}>
              <X size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {notificationsLoading && notifications.length === 0 ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <ScrollView
              className="max-h-[420px]"
              onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } =
                  nativeEvent;
                if (
                  layoutMeasurement.height + contentOffset.y >=
                  contentSize.height - 30
                ) {
                  handleLoadMore();
                }
              }}
              scrollEventThrottle={400}
              showsVerticalScrollIndicator={false}
            >
              {notifications.length === 0 ? (
                <View className="py-16 items-center">
                  <Bell
                    size={40}
                    color={COLORS.textTertiary}
                    strokeWidth={1.5}
                  />
                  <Text
                    className="mt-3"
                    style={{ color: COLORS.textSecondary }}
                  >
                    No notifications
                  </Text>
                </View>
              ) : (
                <>
                  {notifications.map((notif) => (
                    <TouchableOpacity
                      key={notif.id}
                      className="p-4 border-b"
                      style={{
                        borderBottomColor: COLORS.border,
                        backgroundColor: notif.readFlag
                          ? COLORS.bgWhite
                          : `${COLORS.primaryLight}40`,
                      }}
                      onPress={() => {
                        if (!notif.readFlag) markAsRead(notif.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-3">
                          <Text
                            className="font-bold text-base mb-1"
                            style={{ color: COLORS.textPrimary }}
                          >
                            {notif.title}
                          </Text>
                          <Text
                            className="text-sm mb-2 leading-5"
                            style={{ color: COLORS.textSecondary }}
                            numberOfLines={2}
                          >
                            {notif.message}
                          </Text>
                          <Text
                            className="text-xs"
                            style={{ color: COLORS.textTertiary }}
                          >
                            {new Date(notif.createdAt).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </Text>
                        </View>
                        {!notif.readFlag && (
                          <View
                            className="w-2.5 h-2.5 rounded-full mt-1"
                            style={{ backgroundColor: COLORS.primary }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                  {loadingMore && (
                    <View className="py-4 items-center">
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          )}
        </Animated.View>
      )}

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: 24,
          maxWidth: 1200,
          width: "100%",
          alignSelf: "center",
        }}
      >
        {/* Horizontal Calendar - modernized */}
        <View
          className="p-5 rounded-3xl mb-8 bg-white"
          style={{
            borderColor: COLORS.border,
            borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View className="flex-row justify-between items-center mb-5 px-2">
            <TouchableOpacity activeOpacity={0.7}>
              <ChevronLeft size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text
              className="text-base font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <ChevronRight size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {calendarDates.map((date, index) => {
              const isSelected =
                date.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedDate(date)}
                  activeOpacity={0.8}
                  className="w-[65px] h-[90px] justify-center items-center"
                  style={{
                    borderRadius: 30,
                    backgroundColor: isSelected ? COLORS.primary : "#FFFFFF",
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: COLORS.border,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.15 : 0.02,
                    shadowRadius: 4,
                    elevation: isSelected ? 4 : 1,
                  }}
                >
                  <Text
                    className="text-[11px] mb-1 font-semibold uppercase tracking-wider"
                    style={{ color: isSelected ? "#FFFFFF" : "#9CA3AF" }}
                  >
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </Text>
                  <Text
                    className="text-[22px] font-extrabold"
                    style={{ color: isSelected ? "#FFFFFF" : "#1F2937" }}
                  >
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Banner - updated with dynamic API data */}
        <View
          className="p-6 rounded-3xl mb-8 overflow-hidden"
          style={{
            backgroundColor: COLORS.darkBg,
            shadowColor: COLORS.textPrimary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text className="text-white text-2xl font-black mb-6">
            Your Teaching Dashboard
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <View
              className="flex-1 min-w-[100px] p-4 rounded-xl"
              style={{
                backgroundColor: "rgba(244, 164, 96, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(244, 164, 96, 0.4)",
              }}
            >
              <Text
                className="text-3xl font-black mb-1"
                style={{ color: COLORS.secondary }}
              >
                {statsLoading ? "-" : dashboardStats.totalClassSections}
              </Text>
              <Text
                className="text-xs font-medium"
                style={{ color: COLORS.cardLight }}
              >
                Class Sections
              </Text>
            </View>
            <View
              className="flex-1 min-w-[100px] p-4 rounded-xl"
              style={{
                backgroundColor: "rgba(244, 164, 96, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(244, 164, 96, 0.4)",
              }}
            >
              <Text
                className="text-3xl font-black mb-1"
                style={{ color: COLORS.secondary }}
              >
                {statsLoading ? "-" : dashboardStats.totalActiveStudents}
              </Text>
              <Text
                className="text-xs font-medium"
                style={{ color: COLORS.cardLight }}
              >
                Active Students
              </Text>
            </View>
            <View
              className="flex-1 min-w-[100px] p-4 rounded-xl"
              style={{
                backgroundColor: "rgba(244, 164, 96, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(244, 164, 96, 0.4)",
              }}
            >
              <Text
                className="text-3xl font-black mb-1"
                style={{ color: COLORS.secondary }}
              >
                {statsLoading
                  ? "-"
                  : `${dashboardStats.overallPassPercentage}%`}
              </Text>
              <Text
                className="text-xs font-medium"
                style={{ color: COLORS.cardLight }}
              >
                Pass Percentage
              </Text>
            </View>

            {/* Assigned Stats Cards */}
            <View
              className="flex-1 min-w-[100px] p-4 rounded-xl"
              style={{
                backgroundColor: "rgba(244, 164, 96, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(244, 164, 96, 0.4)",
              }}
            >
              <Text
                className="text-3xl font-black mb-1"
                style={{ color: COLORS.secondary }}
              >
                {assignedLoading ? "-" : assignedStats.assignedSubjectCount}
              </Text>
              <Text
                className="text-xs font-medium"
                style={{ color: COLORS.cardLight }}
              >
                Assigned Subjects
              </Text>
            </View>
            <View
              className="flex-1 min-w-[100px] p-4 rounded-xl"
              style={{
                backgroundColor: "rgba(244, 164, 96, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(244, 164, 96, 0.4)",
              }}
            >
              <Text
                className="text-3xl font-black mb-1"
                style={{ color: COLORS.secondary }}
              >
                {assignedLoading ? "-" : assignedStats.assignmentCount}
              </Text>
              <Text
                className="text-xs font-medium"
                style={{ color: COLORS.cardLight }}
              >
                Assignments
              </Text>
            </View>
          </View>
        </View>

        {/* Attendance Summary Card (Present, Absent, Half-Day) */}
        <View
          className="p-5 rounded-3xl mb-8 bg-white"
          style={{
            borderColor: COLORS.border,
            borderWidth: 1,
            ...platformShadow,
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className="text-xl font-extrabold"
              style={{ color: COLORS.textPrimary }}
            >
              Attendance Summary
            </Text>
            <Text
              className="text-sm font-medium"
              style={{ color: COLORS.textSecondary }}
            >
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Text>
          </View>

          {attendanceLoading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text
                className="text-sm mt-2"
                style={{ color: COLORS.textSecondary }}
              >
                Loading attendance...
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-4">
              <View
                className="flex-1 min-w-[100px] p-4 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${COLORS.primaryLight}60` }}
              >
                <Text
                  className="text-3xl font-black mb-1"
                  style={{ color: COLORS.primaryDark }}
                >
                  {attendanceSummary.presentCount}
                </Text>
                <Text
                  className="text-xs font-bold"
                  style={{ color: COLORS.primaryDark }}
                >
                  Present
                </Text>
              </View>
              <View
                className="flex-1 min-w-[100px] p-4 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${COLORS.textTertiary}20` }}
              >
                <Text
                  className="text-3xl font-black mb-1"
                  style={{ color: COLORS.textTertiary }}
                >
                  {attendanceSummary.absentCount}
                </Text>
                <Text
                  className="text-xs font-bold"
                  style={{ color: COLORS.textTertiary }}
                >
                  Absent
                </Text>
              </View>
              <View
                className="flex-1 min-w-[100px] p-4 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${COLORS.secondary}20` }}
              >
                <Text
                  className="text-3xl font-black mb-1"
                  style={{ color: COLORS.secondary }}
                >
                  {attendanceSummary.leaveCount}
                </Text>
                <Text
                  className="text-xs font-bold"
                  style={{ color: COLORS.secondary }}
                >
                  Half Day / Leave
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Access */}
        <View className="mb-5">
          <Text
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: COLORS.textPrimary }}
          >
            Quick Access
          </Text>
          <Text
            className="text-sm mt-1"
            style={{ color: COLORS.textSecondary }}
          >
            Your frequently used tools
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-4 mb-8 items-start">
          {teacherModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Animated.View
                key={index}
                style={{
                  opacity: fadeAnims[index],
                  transform: [{ translateY: slideAnims[index] }],
                  width: cardWidth,
                  marginBottom: 16,
                }}
              >
                <TouchableOpacity
                  className="bg-white p-5 rounded-2xl border"
                  style={{
                    backgroundColor: COLORS.bgWhite,
                    borderColor: COLORS.border,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                    elevation: 3,
                    ...Platform.select({
                      web: {
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        ":hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                        },
                      },
                    }),
                  }}
                  activeOpacity={0.8}
                  onPress={() => router.push(module.route as any)}
                >
                  <View
                    className="w-12 h-12 rounded-xl justify-center items-center mb-4"
                    style={{ backgroundColor: COLORS.primaryLight }}
                  >
                    <Icon size={26} color={COLORS.primary} strokeWidth={1.8} />
                  </View>
                  <Text
                    className="text-base font-extrabold mb-1"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {module.title}
                  </Text>
                  <Text
                    className="text-xs leading-5"
                    style={{ color: COLORS.textSecondary }}
                  >
                    {module.desc}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Dynamic Wrapper for Web Side-by-Side Layout */}
        <View
          style={
            Platform.OS === "web"
              ? { flexDirection: "row", gap: 24, alignItems: "flex-start" }
              : { flexDirection: "column" }
          }
        >
          {/* Left side: Campus Happenings */}
          <View
            style={Platform.OS === "web" ? { flex: 1, overflow: "hidden" } : {}}
          >
            <View className={Platform.OS === "web" ? "mb-5" : "mt-8 mb-5"}>
              <Text
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: COLORS.textPrimary }}
              >
                🌟 Campus Happenings
              </Text>
              <Text
                className="text-sm mt-1"
                style={{ color: COLORS.textSecondary }}
              >
                Latest updates from the campus
              </Text>
            </View>

            {/* Campus Happenings Box */}
            <View
              className="rounded-3xl border overflow-hidden"
              style={{
                backgroundColor: COLORS.bgWhite,
                borderColor: COLORS.border,
                height: 400,
                ...platformShadow,
              }}
            >
              {feedLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text
                    className="mt-2 text-sm"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Loading happenings...
                  </Text>
                </View>
              ) : feedItems.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                  <Text
                    className="text-base font-semibold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    No updates available
                  </Text>
                  <Text
                    className="text-sm mt-1 text-center"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Check back later for campus news
                  </Text>
                </View>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 20, gap: 16 }}
                >
                  {feedItems.map((item) => {
                    const imageUrl = getFeedImageUrl(item.imageUrl);
                    const hasImage =
                      imageUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.8}
                        onPress={() => {
                          if (hasImage) {
                            setFeedPreviewImage(imageUrl);
                            setFeedImageModalVisible(true);
                          }
                        }}
                        className="w-full bg-white rounded-2xl border overflow-hidden"
                        style={{
                          backgroundColor: COLORS.bgWhite,
                          borderColor: COLORS.border,
                        }}
                      >
                        {hasImage && (
                          <Image
                            source={{ uri: imageUrl }}
                            style={{ width: "100%", height: 140 }}
                            resizeMode="cover"
                          />
                        )}
                        <View className="p-4">
                          <View className="flex-row justify-between items-start mb-2">
                            <Text
                              className="font-bold text-base flex-1 mr-2"
                              style={{ color: COLORS.textPrimary }}
                            >
                              {item.title}
                            </Text>
                            <View
                              className="px-2 py-1 rounded-full"
                              style={{ backgroundColor: COLORS.primaryLight }}
                            >
                              <Text
                                className="text-[10px] font-bold uppercase"
                                style={{ color: COLORS.primary }}
                              >
                                {item.type}
                              </Text>
                            </View>
                          </View>
                          <Text
                            className="text-sm leading-5 mb-3"
                            style={{ color: COLORS.textSecondary }}
                            numberOfLines={3}
                          >
                            {item.description}
                          </Text>
                          <View
                            className="flex-row justify-between items-center pt-2 border-t"
                            style={{ borderTopColor: COLORS.border }}
                          >
                            <View className="flex-row items-center gap-1">
                              <Calendar size={12} color={COLORS.textTertiary} />
                              <Text
                                className="text-xs font-semibold"
                                style={{ color: COLORS.textTertiary }}
                              >
                                {new Date(item.postDate).toLocaleDateString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </Text>
                            </View>
                            <Text
                              className="text-xs italic"
                              style={{ color: COLORS.textTertiary }}
                            >
                              by {item.postedBy}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </View>

          {/* Right side: School Notices */}
          <View
            style={Platform.OS === "web" ? { flex: 1, overflow: "hidden" } : {}}
          >
            <View
              className={`flex-row justify-between items-end ${Platform.OS === "web" ? "mb-5" : "mt-8 mb-5"}`}
            >
              <View className="flex-1">
                <Text
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ color: COLORS.textPrimary }}
                >
                  📢 School Notices
                </Text>
                <Text
                  className="text-sm mt-1"
                  style={{ color: COLORS.textSecondary }}
                >
                  Important announcements and updates
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.push("/teacher/communication/notices" as any)
                }
              >
                <Text
                  className="text-sm font-bold"
                  style={{ color: COLORS.primary }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {/* Notice Box */}
            <View
              className="rounded-3xl border overflow-hidden"
              style={{
                backgroundColor: COLORS.bgWhite,
                borderColor: COLORS.border,
                height: 400,
                ...platformShadow,
              }}
            >
              {noticesLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text
                    className="mt-2 text-sm"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Loading notices...
                  </Text>
                </View>
              ) : notices.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                  <Text
                    className="text-base font-semibold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    No notices available
                  </Text>
                </View>
              ) : (
                <View style={{ padding: 20, gap: 16 }}>
                  {notices.slice(0, 2).map((notice) => (
                    <View
                      key={notice.id}
                      className="w-full bg-white rounded-2xl border p-5"
                      style={{
                        backgroundColor: COLORS.bgWhite,
                        borderColor: COLORS.border,
                      }}
                    >
                      <View className="flex-row justify-between items-start mb-3">
                        <Text
                          className="font-bold text-base flex-1 mr-2"
                          style={{ color: COLORS.textPrimary }}
                          numberOfLines={2}
                        >
                          {notice.noticeName}
                        </Text>
                        <View
                          className="px-2 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              notice.noticeType === "EMERGENCY"
                                ? `${COLORS.primary}20`
                                : notice.noticeType === "ACADEMIC"
                                  ? `${COLORS.secondary}20`
                                  : COLORS.primaryLight,
                          }}
                        >
                          <Text
                            className="text-[10px] font-bold uppercase"
                            style={{
                              color:
                                notice.noticeType === "EMERGENCY"
                                  ? COLORS.primaryDark
                                  : notice.noticeType === "ACADEMIC"
                                    ? COLORS.secondary
                                    : COLORS.primary,
                            }}
                          >
                            {notice.noticeType}
                          </Text>
                        </View>
                      </View>
                      <Text
                        className="text-sm leading-5 mb-4"
                        style={{ color: COLORS.textSecondary }}
                        numberOfLines={3}
                      >
                        {notice.noticeDescription}
                      </Text>
                      <View
                        className="flex-row items-center gap-1.5 mt-auto pt-3 border-t"
                        style={{ borderTopColor: COLORS.border }}
                      >
                        <Calendar size={12} color={COLORS.textTertiary} />
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: COLORS.textTertiary }}
                        >
                          {new Date(notice.noticeDate).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Image preview modal for feed images */}
      <Modal
        visible={feedImageModalVisible}
        transparent={true}
        onRequestClose={() => setFeedImageModalVisible(false)}
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
          onPress={() => setFeedImageModalVisible(false)}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
            onPress={() => setFeedImageModalVisible(false)}
          >
            <X size={30} color={COLORS.white} />
          </TouchableOpacity>
          <Image
            source={{ uri: feedPreviewImage }}
            style={{ width: "90%", height: "70%" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
