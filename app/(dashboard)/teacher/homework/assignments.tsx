import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle,
    Clock,
    Download,
    Filter,
    GraduationCap,
    Search,
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
  success: "#2E7D32",
  warning: "#F57C00",
  accent: "#F4A460",
  border: "#EAEAEE",
  error: "#D32F2F",
};

const DUMMY_ASSIGNMENTS = [
  {
    id: "1",
    title: "Algebraic Equations Worksheet",
    classStr: "10-A",
    subject: "Mathematics",
    due: "2024-06-05",
    dueText: "Tomorrow",
    total: 40,
    submitted: 32,
    status: "active",
    description: "Complete all problems from Chapter 5: Linear Equations",
  },
  {
    id: "2",
    title: "Newton's Laws Essay",
    classStr: "11-Science",
    subject: "Physics",
    due: "2024-06-07",
    dueText: "June 5",
    total: 35,
    submitted: 10,
    status: "active",
    description: "500-word essay on applications of Newton's Laws",
  },
  {
    id: "3",
    title: "Trigonometry Basics",
    classStr: "10-B",
    subject: "Mathematics",
    due: "2024-05-30",
    dueText: "Past Due",
    total: 38,
    submitted: 38,
    status: "completed",
    description: "Practice problems from sections 7.1 to 7.4",
  },
  {
    id: "4",
    title: "Periodic Table Quiz",
    classStr: "9-C",
    subject: "Chemistry",
    due: "2024-06-08",
    dueText: "Next Week",
    total: 32,
    submitted: 15,
    status: "active",
    description: "Memorize first 20 elements and their properties",
  },
  {
    id: "5",
    title: "French Revolution Timeline",
    classStr: "9-A",
    subject: "History",
    due: "2024-06-04",
    dueText: "Due Today",
    total: 30,
    submitted: 28,
    status: "active",
    description: "Create a detailed timeline of key events",
  },
];

type FilterType = "all" | "active" | "completed";

export default function AssignmentsListScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const filteredAssignments = DUMMY_ASSIGNMENTS.filter((hw) => {
    const matchesSearch =
      hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.classStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || hw.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: DUMMY_ASSIGNMENTS.length,
    active: DUMMY_ASSIGNMENTS.filter((h) => h.status === "active").length,
    completed: DUMMY_ASSIGNMENTS.filter((h) => h.status === "completed").length,
    totalSubmissions: DUMMY_ASSIGNMENTS.reduce(
      (sum, h) => sum + h.submitted,
      0,
    ),
    totalStudents: DUMMY_ASSIGNMENTS.reduce((sum, h) => sum + h.total, 0),
  };

  const getDueStatusColor = (dueText: string) => {
    if (dueText === "Past Due") return COLORS.error;
    if (dueText === "Due Today") return COLORS.warning;
    if (dueText === "Tomorrow") return COLORS.accent;
    return COLORS.textSecondary;
  };

  const getProgressColor = (status: string, percent: number) => {
    if (status === "completed") return COLORS.success;
    if (percent >= 70) return COLORS.success;
    if (percent >= 40) return COLORS.warning;
    return COLORS.primary;
  };

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
        <Text style={styles.headerTitle}>All Assignments</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterVisible(!isFilterVisible)}
        >
          <Filter size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { maxWidth: isDesktop ? 1000 : "100%" },
        ]}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(227, 83, 54, 0.1)" },
              ]}
            >
              <BookOpen size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(244, 164, 96, 0.1)" },
              ]}
            >
              <Clock size={20} color={COLORS.accent} />
            </View>
            <View>
              <Text style={styles.statValue}>{stats.active}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(46, 125, 50, 0.1)" },
              ]}
            >
              <CheckCircle size={20} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(160, 82, 45, 0.1)" },
              ]}
            >
              <Users size={20} color={COLORS.textSecondary} />
            </View>
            <View>
              <Text style={styles.statValue}>
                {Math.round(
                  (stats.totalSubmissions / stats.totalStudents) * 100,
                )}
                %
              </Text>
              <Text style={styles.statLabel}>Rate</Text>
            </View>
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
            placeholder="Search by title, subject, or class..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
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
                activeFilter === "active" && styles.chipActive,
              ]}
              onPress={() => setActiveFilter("active")}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "active" && styles.chipTextActive,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                activeFilter === "completed" && styles.chipActive,
              ]}
              onPress={() => setActiveFilter("completed")}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "completed" && styles.chipTextActive,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Assignments List */}
        <View style={styles.assignmentsList}>
          {filteredAssignments.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateTitle}>No assignments found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          ) : (
            filteredAssignments.map((hw) => {
              const isCompleted = hw.status === "completed";
              const progressPercent = (hw.submitted / hw.total) * 100;
              const progressColor = getProgressColor(
                hw.status,
                progressPercent,
              );
              const dueColor = getDueStatusColor(hw.dueText);

              return (
                <TouchableOpacity
                  key={hw.id}
                  style={styles.hwCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push(`/teacher/homework/assignments/${hw.id}`)
                  }
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.classBadge}>
                      <GraduationCap size={12} color={COLORS.primary} />
                      <Text style={styles.classText}>
                        {hw.classStr} • {hw.subject}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dueBadge,
                        isCompleted && styles.completedBadge,
                        { backgroundColor: `${dueColor}15` },
                      ]}
                    >
                      {isCompleted ? (
                        <CheckCircle size={12} color={COLORS.success} />
                      ) : (
                        <Clock size={12} color={dueColor} />
                      )}
                      <Text
                        style={[
                          styles.dueText,
                          { color: dueColor },
                          isCompleted && { color: COLORS.success },
                        ]}
                      >
                        {hw.dueText}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.hwTitle}>{hw.title}</Text>
                  <Text style={styles.hwDescription} numberOfLines={2}>
                    {hw.description}
                  </Text>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Submissions</Text>
                      <Text style={styles.progressText}>
                        {hw.submitted} / {hw.total} students
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${progressPercent}%`,
                            backgroundColor: progressColor,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {!isCompleted && progressPercent >= 70 && (
                    <View style={styles.goodProgressBadge}>
                      <CheckCircle size={12} color={COLORS.success} />
                      <Text style={styles.goodProgressText}>Good progress</Text>
                    </View>
                  )}

                  {!isCompleted && hw.dueText === "Due Today" && (
                    <TouchableOpacity style={styles.remindButton}>
                      <Text style={styles.remindButtonText}>
                        Remind Students
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Export Button */}
        {filteredAssignments.length > 0 && (
          <TouchableOpacity style={styles.exportButton}>
            <Download size={18} color={COLORS.white} />
            <Text style={styles.exportButtonText}>Export Report</Text>
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
    paddingTop: 20,
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
  filterButton: { padding: 8, marginRight: -8 },
  listContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    justifyContent: "space-around",
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
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
    marginBottom: 16,
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
  },
  filterChips: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 16,
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
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  assignmentsList: {
    gap: 16,
    marginBottom: 24,
  },
  hwCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
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
        transition: "transform 0.2s",
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  classBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  classText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  dueBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  completedBadge: {
    backgroundColor: "rgba(46, 125, 50, 0.1)",
  },
  dueText: {
    fontSize: 12,
    fontWeight: "700",
  },
  hwTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  hwDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "800",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  goodProgressBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  goodProgressText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.success,
  },
  remindButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  remindButtonText: {
    fontSize: 13,
    fontWeight: "600",
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
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
});
