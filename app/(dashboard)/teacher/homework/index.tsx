import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    FilePlus,
    ListTodo,
    Users,
} from "lucide-react-native";
import React from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
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
  border: "#EAEAEE",
};

// Mock data for recent assignments
const recentAssignments = [
  {
    id: "1",
    title: "Algebra Worksheet - Chapter 5",
    subject: "Mathematics",
    class: "Grade 10A",
    dueDate: "2024-06-05",
    submissions: 18,
    totalStudents: 32,
    status: "pending",
  },
  {
    id: "2",
    title: "Essay on Climate Change",
    subject: "English",
    class: "Grade 9B",
    dueDate: "2024-06-07",
    submissions: 24,
    totalStudents: 30,
    status: "partial",
  },
  {
    id: "3",
    title: "Physics Lab Report",
    subject: "Science",
    class: "Grade 11A",
    dueDate: "2024-06-03",
    submissions: 28,
    totalStudents: 28,
    status: "completed",
  },
  {
    id: "4",
    title: "History Timeline Project",
    subject: "Social Studies",
    class: "Grade 10B",
    dueDate: "2024-06-10",
    submissions: 5,
    totalStudents: 29,
    status: "pending",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return COLORS.success;
    case "partial":
      return COLORS.warning;
    default:
      return COLORS.primary;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "All Submitted";
    case "partial":
      return "Partial Submissions";
    default:
      return "Pending";
  }
};

export default function HomeworkIndexScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const pendingCount = recentAssignments.filter(
    (a) => a.status === "pending",
  ).length;
  const totalSubmissions = recentAssignments.reduce(
    (sum, a) => sum + a.submissions,
    0,
  );
  const totalStudents = recentAssignments.reduce(
    (sum, a) => sum + a.totalStudents,
    0,
  );
  const submissionRate = Math.round((totalSubmissions / totalStudents) * 100);

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
        <Text style={styles.headerTitle}>Homework</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentWrapper,
          { maxWidth: isDesktop ? 1000 : "100%" },
        ]}
      >
        {/* Stats Overview Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(227, 83, 54, 0.1)" },
              ]}
            >
              <BookOpen size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>{recentAssignments.length}</Text>
            <Text style={styles.statLabel}>Total Assignments</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(244, 164, 96, 0.1)" },
              ]}
            >
              <Clock size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending Review</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(76, 175, 80, 0.1)" },
              ]}
            >
              <CheckCircle size={24} color={COLORS.success} />
            </View>
            <Text style={styles.statNumber}>{submissionRate}%</Text>
            <Text style={styles.statLabel}>Submission Rate</Text>
          </View>
        </View>

        {/* Quick Actions Section */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => router.push("/teacher/homework/upload")}
          >
            <View style={styles.actionIconContainer}>
              <FilePlus size={28} color={COLORS.white} />
            </View>
            <Text style={styles.actionTitle}>Assign Homework</Text>
            <Text style={styles.actionDesc}>
              Upload new assignments, projects, or reading tasks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => router.push("/teacher/homework/assignments")}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: COLORS.textPrimary },
              ]}
            >
              <ListTodo size={28} color={COLORS.white} />
            </View>
            <Text style={styles.actionTitle}>View All Assignments</Text>
            <Text style={styles.actionDesc}>
              Track submissions, grade homework, and view history
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Assignments Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Assignments</Text>
            <TouchableOpacity
              onPress={() => router.push("/teacher/homework/assignments")}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentAssignments.map((assignment, index) => (
            <TouchableOpacity
              key={assignment.id}
              style={styles.assignmentCard}
              activeOpacity={0.7}
              onPress={() => router.push(`/teacher/homework/assignments`)}
            >
              <View style={styles.assignmentHeader}>
                <View style={styles.assignmentTitleContainer}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: `${getStatusColor(assignment.status)}15`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(assignment.status) },
                      ]}
                    >
                      {getStatusText(assignment.status)}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={COLORS.textSecondary} />
              </View>

              <View style={styles.assignmentDetails}>
                <View style={styles.detailItem}>
                  <BookOpen size={14} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{assignment.subject}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Users size={14} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{assignment.class}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={14} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${(assignment.submissions / assignment.totalStudents) * 100}%`,
                        backgroundColor: getStatusColor(assignment.status),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {assignment.submissions}/{assignment.totalStudents} Submitted
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Deadlines Notice */}
        <View style={styles.deadlineNotice}>
          <Clock size={20} color={COLORS.primary} />
          <Text style={styles.deadlineText}>
            Next deadline: Algebra Worksheet due in 2 days
          </Text>
        </View>
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
  contentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 16,
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
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
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
        cursor: "pointer",
        transition: "transform 0.2s",
      },
    }),
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  actionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  assignmentCard: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
      },
    }),
  },
  assignmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  assignmentTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  assignmentDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  progressSection: {
    marginTop: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  deadlineNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  deadlineText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
    flex: 1,
  },
});
