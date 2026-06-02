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
  Trash2,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const COLORS = {
  bgWhite: "#FFFFFF",
  lightGray: "#F5F5F5",
  primary: "#E35336",
  textPrimary: "#5C2E14",
  textSecondary: "#A0522D",
  white: "#FFFFFF",
  accent: "#F4A460",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#D32F2F",
  border: "#EAEAEE",
};

const DUMMY_NOTICES = [
  {
    id: "1",
    title: "Upcoming Science Fair",
    date: "2026-06-10",
    formattedDate: "June 10, 2026",
    desc: "All 10th-grade students must submit their project proposals by this Friday. Please prepare your exhibits and submit the required documentation.",
    isUrgent: false,
    audience: "Grade 10 Students",
    category: "Event",
    isPinned: true,
  },
  {
    id: "2",
    title: "Emergency: Campus Closed",
    date: "2026-06-02",
    formattedDate: "June 2, 2026",
    desc: "Due to heavy rainfall and severe weather conditions, the school will remain closed tomorrow. All exams scheduled for tomorrow are postponed.",
    isUrgent: true,
    audience: "All Students & Staff",
    category: "Emergency",
    isPinned: true,
  },
  {
    id: "3",
    title: "Parent-Teacher Meeting",
    date: "2026-05-28",
    formattedDate: "May 28, 2026",
    desc: "Scheduled for this Saturday from 9 AM to 2 PM. Please ensure all grade books and student progress reports are updated before the meeting.",
    isUrgent: false,
    audience: "All Teachers",
    category: "Meeting",
    isPinned: false,
  },
  {
    id: "4",
    title: "Holiday Announcement",
    date: "2026-07-04",
    formattedDate: "July 4, 2026",
    desc: "School will remain closed on July 4th on account of Independence Day celebrations.",
    isUrgent: false,
    audience: "All Students & Staff",
    category: "Holiday",
    isPinned: false,
  },
  {
    id: "5",
    title: "Exam Schedule Released",
    date: "2026-06-15",
    formattedDate: "June 15, 2026",
    desc: "Final examination schedule for all grades has been released. Check the notice board for your class timetable.",
    isUrgent: true,
    audience: "All Students",
    category: "Academic",
    isPinned: false,
  },
];

type FilterType = "all" | "urgent" | "event" | "meeting" | "academic";

export default function NoticesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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

  const filteredNotices = DUMMY_NOTICES.filter((notice) => {
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

  const urgentCount = DUMMY_NOTICES.filter((n) => n.isUrgent).length;
  const pinnedNotices = filteredNotices.filter((n) => n.isPinned);
  const regularNotices = filteredNotices.filter((n) => !n.isPinned);

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notices</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/teacher/communication/notices/create")}
        >
          <Plus size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { maxWidth: isDesktop ? 1000 : "100%" },
        ]}
      >
        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Megaphone size={20} color={COLORS.primary} />
            <Text style={styles.statNumber}>{DUMMY_NOTICES.length}</Text>
            <Text style={styles.statLabel}>Total Notices</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <AlertCircle size={20} color={COLORS.error} />
            <Text style={styles.statNumber}>{urgentCount}</Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Calendar size={20} color={COLORS.accent} />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notices..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.filterIconButton}
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
          <View style={styles.filterChips}>
            <TouchableOpacity
              style={[styles.chip, activeFilter === "all" && styles.chipActive]}
              onPress={() => setActiveFilter("all")}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "all" && styles.chipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                activeFilter === "urgent" && styles.chipActive,
              ]}
              onPress={() => setActiveFilter("urgent")}
            >
              <AlertCircle
                size={14}
                color={activeFilter === "urgent" ? COLORS.white : COLORS.error}
              />
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "urgent" && styles.chipTextActive,
                ]}
              >
                Urgent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                activeFilter === "event" && styles.chipActive,
              ]}
              onPress={() => setActiveFilter("event")}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "event" && styles.chipTextActive,
                ]}
              >
                Events
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                activeFilter === "meeting" && styles.chipActive,
              ]}
              onPress={() => setActiveFilter("meeting")}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "meeting" && styles.chipTextActive,
                ]}
              >
                Meetings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                activeFilter === "academic" && styles.chipActive,
              ]}
              onPress={() => setActiveFilter("academic")}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "academic" && styles.chipTextActive,
                ]}
              >
                Academic
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pinned Notices Section */}
        {pinnedNotices.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📌 Pinned Notices</Text>
            </View>
            {pinnedNotices.map((notice) => (
              <TouchableOpacity
                key={notice.id}
                style={[
                  styles.noticeCard,
                  notice.isUrgent && styles.urgentCard,
                ]}
                activeOpacity={0.7}
                onPress={() =>
                  router.push(`/teacher/communication/notices/${notice.id}`)
                }
              >
                <View style={styles.pinnedBadge}>
                  <Text style={styles.pinnedText}>Pinned</Text>
                </View>
                <View style={styles.noticeHeader}>
                  <View style={styles.titleRow}>
                    <Megaphone
                      size={20}
                      color={
                        notice.isUrgent ? COLORS.primary : COLORS.textPrimary
                      }
                    />
                    <Text
                      style={[
                        styles.noticeTitle,
                        notice.isUrgent && { color: COLORS.primary },
                      ]}
                    >
                      {notice.title}
                    </Text>
                  </View>
                  <View style={styles.dateContainer}>
                    <Calendar size={12} color={COLORS.textSecondary} />
                    <Text style={styles.noticeDate}>
                      {formatDate(notice.date)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.noticeDesc} numberOfLines={2}>
                  {notice.desc}
                </Text>
                <View style={styles.noticeFooter}>
                  <View style={styles.audienceTag}>
                    <Users size={12} color={COLORS.textSecondary} />
                    <Text style={styles.audienceText}>{notice.audience}</Text>
                  </View>
                  <View
                    style={[
                      styles.categoryTag,
                      notice.isUrgent && styles.urgentTag,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        notice.isUrgent && styles.urgentText,
                      ]}
                    >
                      {notice.isUrgent ? "Urgent" : notice.category}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Regular Notices Section */}
        {regularNotices.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Notices</Text>
            </View>
            {regularNotices.map((notice) => (
              <TouchableOpacity
                key={notice.id}
                style={[
                  styles.noticeCard,
                  notice.isUrgent && styles.urgentCard,
                ]}
                activeOpacity={0.7}
                onPress={() =>
                  router.push(`/teacher/communication/notices/${notice.id}`)
                }
              >
                <View style={styles.noticeHeader}>
                  <View style={styles.titleRow}>
                    <Megaphone
                      size={18}
                      color={
                        notice.isUrgent ? COLORS.primary : COLORS.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.noticeTitle,
                        notice.isUrgent && { color: COLORS.primary },
                      ]}
                    >
                      {notice.title}
                    </Text>
                  </View>
                  <View style={styles.dateContainer}>
                    <Calendar size={12} color={COLORS.textSecondary} />
                    <Text style={styles.noticeDate}>
                      {formatDate(notice.date)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.noticeDesc} numberOfLines={2}>
                  {notice.desc}
                </Text>
                <View style={styles.noticeFooter}>
                  <View style={styles.audienceTag}>
                    <Users size={12} color={COLORS.textSecondary} />
                    <Text style={styles.audienceText}>{notice.audience}</Text>
                  </View>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{notice.category}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Empty State */}
        {filteredNotices.length === 0 && (
          <View style={styles.emptyState}>
            <Megaphone size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>No notices found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter criteria
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() =>
                router.push("/teacher/communication/notices/create")
              }
            >
              <Plus size={20} color={COLORS.white} />
              <Text style={styles.createButtonText}>Create New Notice</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Delete All Button */}
        {filteredNotices.length > 0 && (
          <TouchableOpacity style={styles.deleteButton}>
            <Trash2 size={18} color={COLORS.error} />
            <Text style={styles.deleteButtonText}>Delete All Notices</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      web: { userSelect: "none" },
    }),
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  addButton: {
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    padding: 8,
    borderRadius: 8,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
    gap: 16,
  },
  statsBanner: {
    flexDirection: "row",
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-around",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  statItem: {
    alignItems: "center",
    gap: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
    paddingVertical: 12,
    marginRight: 12,
  },
  filterIconButton: {
    padding: 8,
    marginRight: -8,
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bgWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  noticeCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
      },
    }),
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    backgroundColor: "rgba(227, 83, 54, 0.02)",
  },
  pinnedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
  },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    paddingRight: 80,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  noticeDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  noticeDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  noticeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  audienceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(160, 82, 45, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  audienceText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(92, 46, 20, 0.1)",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  urgentTag: {
    backgroundColor: "rgba(227, 83, 54, 0.1)",
  },
  urgentText: {
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.error,
  },
});
