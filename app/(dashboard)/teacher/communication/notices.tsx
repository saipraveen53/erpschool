import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Filter,
  Megaphone,
  Plus,
  Search,
  Users,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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
  error: "#EF4444",
  border: "#F0E4D8",
  white: "#FFFFFF",
  primaryDark: "#C73E21",
};

type FilterType = "all" | "urgent" | "event" | "meeting" | "academic";

export default function NoticesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Teacher info
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");

  // Notices data
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch notices and teacher info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentTeacherId =
          Platform.OS === "web"
            ? localStorage.getItem("userUsername")
            : await AsyncStorage.getItem("userUsername");
        if (!currentTeacherId) {
          setErrorMsg("Teacher ID not found.");
          setLoading(false);
          return;
        }
        setTeacherId(currentTeacherId);

        // Fetch teacher info (class and name)
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
        } catch (err) {
          console.error("Failed to fetch teacher info:", err);
        }

        // Fetch notices
        const res = await teacherClient.get("/api/student/notice/all");
        const data = res.data;
        if (Array.isArray(data)) {
          // Map API fields to our expected structure
          const mapped = data.map((item: any) => ({
            id: item.id,
            title: item.noticeName,
            desc: item.noticeDescription,
            date: item.noticeDate,
            formattedDate: new Date(item.noticeDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            ),
            // Determine category from noticeType or fallback
            category:
              item.noticeType === "GENERAL"
                ? "General"
                : item.noticeType === "EMERGENCY"
                  ? "Emergency"
                  : item.noticeType === "EVENT"
                    ? "Event"
                    : "General",
            isUrgent: item.noticeType === "EMERGENCY",
            audience: "All", // API doesn't provide, we can set a default
            isPinned: false, // API doesn't support pinning yet
          }));
          setNotices(mapped);
        } else {
          setNotices([]);
        }
      } catch (err: any) {
        console.error("Error loading notices:", err);
        setErrorMsg(err.response?.data?.message || "Failed to load notices.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.desc.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (activeFilter === "urgent") {
      matchesFilter = notice.isUrgent;
    } else if (activeFilter === "event") {
      matchesFilter = notice.category === "Event";
    } else if (activeFilter === "meeting") {
      matchesFilter = notice.category === "Meeting";
    } else if (activeFilter === "academic") {
      matchesFilter = notice.category === "Academic";
    }

    return matchesSearch && matchesFilter;
  });

  const urgentCount = notices.filter((n) => n.isUrgent).length;
  const pinnedNotices = filteredNotices.filter((n) => n.isPinned);
  const regularNotices = filteredNotices.filter((n) => !n.isPinned);

  // Animation refs (updated to support dynamic updates)
  const pinnedAnims = useRef<Animated.Value[]>([]);
  const pinnedSlideAnims = useRef<Animated.Value[]>([]);
  const regularAnims = useRef<Animated.Value[]>([]);
  const regularSlideAnims = useRef<Animated.Value[]>([]);

  // Sync lengths during render to prevent undefined crashes on Android
  if (pinnedAnims.current.length !== pinnedNotices.length) {
    pinnedAnims.current = pinnedNotices.map(() => new Animated.Value(0));
    pinnedSlideAnims.current = pinnedNotices.map(() => new Animated.Value(20));
  }
  if (regularAnims.current.length !== regularNotices.length) {
    regularAnims.current = regularNotices.map(() => new Animated.Value(0));
    regularSlideAnims.current = regularNotices.map(
      () => new Animated.Value(20),
    );
  }

  useEffect(() => {
    if (pinnedNotices.length === 0 && regularNotices.length === 0) return;

    // Animate pinned notices
    Animated.stagger(
      100,
      pinnedAnims.current.map((anim, idx) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(pinnedSlideAnims.current[idx], {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();

    // Animate regular notices
    Animated.stagger(
      100,
      regularAnims.current.map((anim, idx) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(regularSlideAnims.current[idx], {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
  }, [pinnedNotices, regularNotices]);

  const handleDeleteAll = async () => {
    // Placeholder – you'd need an API endpoint for bulk delete
    alert("Delete all notices functionality not implemented in API yet.");
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
        <Text
          className="text-xl font-bold tracking-tight"
          style={{ color: COLORS.textPrimary }}
        >
          Notices
        </Text>
        <TouchableOpacity
          className="p-2 rounded-lg"
          style={{ backgroundColor: COLORS.primaryLight }}
          onPress={() => router.push("/teacher/communication/notices/create")}
        >
          <Plus size={20} color={COLORS.primary} />
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

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            className="mt-4 text-sm font-semibold"
            style={{ color: COLORS.textSecondary }}
          >
            Loading notices...
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
              Unable to Load Notices
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
                setLoading(true);
                setErrorMsg(null);
                const refetch = async () => {
                  try {
                    const res = await teacherClient.get(
                      "/api/student/notice/all",
                    );
                    const data = res.data;
                    const mapped = data.map((item: any) => ({
                      id: item.id,
                      title: item.noticeName,
                      desc: item.noticeDescription,
                      date: item.noticeDate,
                      formattedDate: new Date(
                        item.noticeDate,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }),
                      category:
                        item.noticeType === "GENERAL"
                          ? "General"
                          : item.noticeType === "EMERGENCY"
                            ? "Emergency"
                            : "General",
                      isUrgent: item.noticeType === "EMERGENCY",
                      audience: "All",
                      isPinned: false,
                    }));
                    setNotices(mapped);
                  } catch (err) {
                    setErrorMsg("Failed to reload.");
                  } finally {
                    setLoading(false);
                  }
                };
                refetch();
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
            gap: 16,
          }}
        >
          {/* Stats Banner */}
          <View
            className="flex-row rounded-2xl p-4 justify-around items-center border"
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
            <View className="items-center gap-1.5">
              <Megaphone size={20} color={COLORS.primary} />
              <Text
                className="text-xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                {notices.length}
              </Text>
              <Text
                className="text-[11px] font-medium"
                style={{ color: COLORS.textSecondary }}
              >
                Total Notices
              </Text>
            </View>
            <View
              style={{ width: 1, height: 30, backgroundColor: COLORS.border }}
            />
            <View className="items-center gap-1.5">
              <AlertCircle size={20} color={COLORS.error} />
              <Text
                className="text-xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                {urgentCount}
              </Text>
              <Text
                className="text-[11px] font-medium"
                style={{ color: COLORS.textSecondary }}
              >
                Urgent
              </Text>
            </View>
            <View
              style={{ width: 1, height: 30, backgroundColor: COLORS.border }}
            />
            <View className="items-center gap-1.5">
              <Calendar size={20} color={COLORS.secondary} />
              <Text
                className="text-xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                {
                  notices.filter((n) => {
                    const d = new Date(n.date);
                    const today = new Date();
                    const weekLater = new Date();
                    weekLater.setDate(today.getDate() + 7);
                    return d >= today && d <= weekLater;
                  }).length
                }
              </Text>
              <Text
                className="text-[11px] font-medium"
                style={{ color: COLORS.textSecondary }}
              >
                This Week
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View
            className="flex-row items-center px-4 rounded-xl border"
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
              placeholder="Search notices..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ color: COLORS.textPrimary }}
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
                  activeFilter !== "all" ? COLORS.primary : COLORS.textSecondary
                }
              />
            </TouchableOpacity>
          </View>

          {/* Filter Chips */}
          {isFilterVisible && (
            <View className="flex-row flex-wrap gap-2.5 mt-2">
              <TouchableOpacity
                className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border"
                style={[
                  activeFilter === "all"
                    ? {
                        backgroundColor: COLORS.primary,
                        borderColor: COLORS.primary,
                      }
                    : {
                        backgroundColor: COLORS.bgWhite,
                        borderColor: COLORS.border,
                      },
                ]}
                onPress={() => setActiveFilter("all")}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{
                    color:
                      activeFilter === "all"
                        ? COLORS.white
                        : COLORS.textSecondary,
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border"
                style={[
                  activeFilter === "urgent"
                    ? {
                        backgroundColor: COLORS.primary,
                        borderColor: COLORS.primary,
                      }
                    : {
                        backgroundColor: COLORS.bgWhite,
                        borderColor: COLORS.border,
                      },
                ]}
                onPress={() => setActiveFilter("urgent")}
              >
                <AlertCircle
                  size={14}
                  color={
                    activeFilter === "urgent" ? COLORS.white : COLORS.error
                  }
                />
                <Text
                  className="text-xs font-semibold"
                  style={{
                    color:
                      activeFilter === "urgent"
                        ? COLORS.white
                        : COLORS.textSecondary,
                  }}
                >
                  Urgent
                </Text>
              </TouchableOpacity>

              {["event", "meeting", "academic"].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  className="px-3.5 py-2 rounded-full border"
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
                  onPress={() => setActiveFilter(filter as FilterType)}
                >
                  <Text
                    className="text-xs font-semibold capitalize"
                    style={{
                      color:
                        activeFilter === filter
                          ? COLORS.white
                          : COLORS.textSecondary,
                    }}
                  >
                    {filter === "academic" ? "Academic" : filter + "s"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Pinned Notices Section */}
          {pinnedNotices.length > 0 && (
            <>
              <View className="mt-2 mb-1">
                <Text
                  className="text-base font-bold"
                  style={{ color: COLORS.textPrimary }}
                >
                  📌 Pinned Notices
                </Text>
              </View>
              {pinnedNotices.map((notice, idx) => (
                <Animated.View
                  key={notice.id}
                  style={{
                    opacity: pinnedAnims.current[idx],
                    transform: [{ translateY: pinnedSlideAnims.current[idx] }],
                  }}
                >
                  <TouchableOpacity
                    className="relative p-5 rounded-2xl border"
                    style={[
                      {
                        backgroundColor: COLORS.bgWhite,
                        borderColor: COLORS.border,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        elevation: 2,
                      },
                      notice.isUrgent && {
                        borderLeftWidth: 4,
                        borderLeftColor: COLORS.primary,
                        backgroundColor: "rgba(227, 83, 54, 0.02)",
                      },
                    ]}
                    activeOpacity={1}
                  >
                    <View
                      className="absolute top-4 right-4 px-2 py-1 rounded-md"
                      style={{ backgroundColor: COLORS.secondary }}
                    >
                      <Text className="text-[10px] font-bold text-white">
                        Pinned
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-row items-center gap-2 flex-1 pr-20">
                        <Megaphone
                          size={20}
                          color={
                            notice.isUrgent
                              ? COLORS.primary
                              : COLORS.textPrimary
                          }
                        />
                        <Text
                          className="text-base font-bold flex-shrink"
                          style={{
                            color: notice.isUrgent
                              ? COLORS.primary
                              : COLORS.textPrimary,
                          }}
                        >
                          {notice.title}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Calendar size={12} color={COLORS.textSecondary} />
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {formatDate(notice.date)}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className="text-sm leading-6 mb-3"
                      style={{ color: COLORS.textSecondary }}
                      numberOfLines={2}
                    >
                      {notice.desc}
                    </Text>
                    <View className="flex-row justify-between items-center mt-1">
                      <View
                        className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: "rgba(160, 82, 45, 0.1)" }}
                      >
                        <Users size={12} color={COLORS.textSecondary} />
                        <Text
                          className="text-[11px] font-semibold"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {notice.audience}
                        </Text>
                      </View>
                      <View
                        className="px-2.5 py-1 rounded-md"
                        style={{
                          backgroundColor: notice.isUrgent
                            ? "rgba(227, 83, 54, 0.1)"
                            : "rgba(92, 46, 20, 0.1)",
                        }}
                      >
                        <Text
                          className="text-[11px] font-semibold"
                          style={{
                            color: notice.isUrgent
                              ? COLORS.primary
                              : COLORS.textPrimary,
                          }}
                        >
                          {notice.isUrgent ? "Urgent" : notice.category}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </>
          )}

          {/* Regular Notices Section */}
          {regularNotices.length > 0 && (
            <>
              <View className="mt-2 mb-1">
                <Text
                  className="text-base font-bold"
                  style={{ color: COLORS.textPrimary }}
                >
                  All Notices
                </Text>
              </View>
              {regularNotices.map((notice, idx) => (
                <Animated.View
                  key={notice.id}
                  style={{
                    opacity: regularAnims.current[idx],
                    transform: [{ translateY: regularSlideAnims.current[idx] }],
                  }}
                >
                  <TouchableOpacity
                    className="p-5 rounded-2xl border"
                    style={[
                      {
                        backgroundColor: COLORS.bgWhite,
                        borderColor: COLORS.border,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        elevation: 2,
                      },
                      notice.isUrgent && {
                        borderLeftWidth: 4,
                        borderLeftColor: COLORS.primary,
                        backgroundColor: "rgba(227, 83, 54, 0.02)",
                      },
                    ]}
                    activeOpacity={1}
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-row items-center gap-2 flex-1 pr-20">
                        <Megaphone
                          size={18}
                          color={
                            notice.isUrgent
                              ? COLORS.primary
                              : COLORS.textSecondary
                          }
                        />
                        <Text
                          className="text-base font-bold flex-shrink"
                          style={{
                            color: notice.isUrgent
                              ? COLORS.primary
                              : COLORS.textPrimary,
                          }}
                        >
                          {notice.title}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Calendar size={12} color={COLORS.textSecondary} />
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {formatDate(notice.date)}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className="text-sm leading-6 mb-3"
                      style={{ color: COLORS.textSecondary }}
                      numberOfLines={2}
                    >
                      {notice.desc}
                    </Text>
                    <View className="flex-row justify-between items-center mt-1">
                      <View
                        className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: "rgba(160, 82, 45, 0.1)" }}
                      >
                        <Users size={12} color={COLORS.textSecondary} />
                        <Text
                          className="text-[11px] font-semibold"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {notice.audience}
                        </Text>
                      </View>
                      <View
                        className="px-2.5 py-1 rounded-md"
                        style={{
                          backgroundColor: notice.isUrgent
                            ? "rgba(227, 83, 54, 0.1)"
                            : "rgba(92, 46, 20, 0.1)",
                        }}
                      >
                        <Text
                          className="text-[11px] font-semibold"
                          style={{
                            color: notice.isUrgent
                              ? COLORS.primary
                              : COLORS.textPrimary,
                          }}
                        >
                          {notice.isUrgent ? "Urgent" : notice.category}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </>
          )}

          {/* Empty state */}
          {filteredNotices.length === 0 && (
            <View className="items-center justify-center py-12 gap-3">
              <Megaphone size={48} color={COLORS.textSecondary} />
              <Text
                className="text-lg font-bold mt-2"
                style={{ color: COLORS.textPrimary }}
              >
                No notices found
              </Text>
              <Text
                className="text-sm text-center mb-4"
                style={{ color: COLORS.textSecondary }}
              >
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
