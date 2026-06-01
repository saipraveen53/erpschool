import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    Award,
    Calendar,
    ChevronRight,
    Clock,
    FileEdit,
    GraduationCap,
    PlusCircle,
    TrendingUp,
    Users,
} from "lucide-react-native";
import React, { useState } from "react";
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
  primary: "#E35336", // Terracotta
  textPrimary: "#5C2E14", // Dark Brown
  textSecondary: "#A0522D", // Sienna
  white: "#FFFFFF",
  accent: "#F4A460",
  success: "#4CAF50",
  warning: "#FF9800",
  border: "#EAEAEE",
};

// Mock data for exams
const upcomingExams = [
  {
    id: "1",
    title: "Mathematics Final Exam",
    subject: "Mathematics",
    class: "Grade 10A",
    date: "2024-06-15",
    time: "09:00 AM",
    duration: "3 hours",
    totalMarks: 100,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Physics Practical",
    subject: "Physics",
    class: "Grade 11B",
    date: "2024-06-18",
    time: "11:00 AM",
    duration: "2 hours",
    totalMarks: 50,
    status: "upcoming",
  },
];

const recentExams = [
  {
    id: "3",
    title: "Chemistry Mid-Term",
    subject: "Chemistry",
    class: "Grade 10B",
    date: "2024-05-20",
    averageScore: 78,
    participated: 32,
    total: 35,
    status: "completed",
  },
  {
    id: "4",
    title: "English Literature",
    subject: "English",
    class: "Grade 9A",
    date: "2024-05-18",
    averageScore: 82,
    participated: 28,
    total: 30,
    status: "completed",
  },
];

export default function ExaminationIndexScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [activeTab, setActiveTab] = useState<"upcoming" | "recent">("upcoming");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
        <Text style={styles.headerTitle}>Examinations</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/teacher/examination/create-exam")}
        >
          <PlusCircle size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentWrapper,
          { maxWidth: isDesktop ? 1000 : "100%" },
        ]}
      >
        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(227, 83, 54, 0.1)" },
              ]}
            >
              <GraduationCap size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Active Exams</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(244, 164, 96, 0.1)" },
              ]}
            >
              <Users size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(76, 175, 80, 0.1)" },
              ]}
            >
              <TrendingUp size={24} color={COLORS.success} />
            </View>
            <Text style={styles.statNumber}>82%</Text>
            <Text style={styles.statLabel}>Avg. Score</Text>
          </View>
        </View>

        {/* Current Examination Banner */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIconWrapper}>
              <GraduationCap size={28} color={COLORS.white} />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Active Term</Text>
            </View>
          </View>
          <Text style={styles.summaryTitle}>Mid-Term Examinations 2026</Text>
          <Text style={styles.summaryDesc}>
            Deadline for marks entry: June 15, 2026
          </Text>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Marks Entry Progress</Text>
              <Text style={styles.progressValue}>65%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "65%" }]} />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => router.push("/teacher/examination/marks-entry")}
          >
            <View style={styles.actionIconContainer}>
              <FileEdit size={28} color={COLORS.white} />
            </View>
            <Text style={styles.actionTitle}>Enter Marks</Text>
            <Text style={styles.actionDesc}>
              Input and update student scores
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => router.push("/teacher/examination/grades")}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: COLORS.textPrimary },
              ]}
            >
              <Award size={28} color={COLORS.white} />
            </View>
            <Text style={styles.actionTitle}>View Grades</Text>
            <Text style={styles.actionDesc}>
              Review report cards and performance
            </Text>
          </TouchableOpacity>
        </View>

        {/* Exams Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "upcoming" && styles.activeTabText,
              ]}
            >
              Upcoming Exams
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "recent" && styles.activeTab]}
            onPress={() => setActiveTab("recent")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "recent" && styles.activeTabText,
              ]}
            >
              Recent Exams
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Exams List */}
        {activeTab === "upcoming" && (
          <View style={styles.examsList}>
            {upcomingExams.map((exam) => (
              <TouchableOpacity
                key={exam.id}
                style={styles.examCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/teacher/examination/${exam.id}`)}
              >
                <View style={styles.examHeader}>
                  <View>
                    <Text style={styles.examTitle}>{exam.title}</Text>
                    <View style={styles.examMetadata}>
                      <View style={styles.metadataItem}>
                        <GraduationCap size={14} color={COLORS.textSecondary} />
                        <Text style={styles.metadataText}>
                          {exam.subject} • {exam.class}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.upcomingBadge}>
                    <Clock size={12} color={COLORS.accent} />
                    <Text style={styles.upcomingBadgeText}>Upcoming</Text>
                  </View>
                </View>

                <View style={styles.examDetails}>
                  <View style={styles.detailItem}>
                    <Calendar size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>
                      {formatDate(exam.date)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>
                      {exam.time} • {exam.duration}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Award size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>
                      Total Marks: {exam.totalMarks}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.prepareButton}>
                  <Text style={styles.prepareButtonText}>Prepare Exam</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Exams List */}
        {activeTab === "recent" && (
          <View style={styles.examsList}>
            {recentExams.map((exam) => (
              <TouchableOpacity
                key={exam.id}
                style={styles.examCard}
                activeOpacity={0.7}
                onPress={() =>
                  router.push(`/teacher/examination/${exam.id}/results`)
                }
              >
                <View style={styles.examHeader}>
                  <View>
                    <Text style={styles.examTitle}>{exam.title}</Text>
                    <View style={styles.examMetadata}>
                      <View style={styles.metadataItem}>
                        <GraduationCap size={14} color={COLORS.textSecondary} />
                        <Text style={styles.metadataText}>
                          {exam.subject} • {exam.class}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.completedBadge}>
                    <Award size={12} color={COLORS.success} />
                    <Text style={styles.completedBadgeText}>Completed</Text>
                  </View>
                </View>

                <View style={styles.examDetails}>
                  <View style={styles.detailItem}>
                    <Calendar size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>
                      {formatDate(exam.date)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Users size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>
                      {exam.participated}/{exam.total} participated
                    </Text>
                  </View>
                </View>

                <View style={styles.scoreContainer}>
                  <View style={styles.scoreHeader}>
                    <Text style={styles.scoreLabel}>Class Average</Text>
                    <Text style={styles.scoreValue}>{exam.averageScore}%</Text>
                  </View>
                  <View style={styles.scoreBarBg}>
                    <View
                      style={[
                        styles.scoreBarFill,
                        { width: `${exam.averageScore}%` },
                      ]}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.viewResultsButton}>
                  <Text style={styles.viewResultsText}>
                    View Detailed Results
                  </Text>
                  <ChevronRight size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Notice Board */}
        <View style={styles.noticeBoard}>
          <Text style={styles.noticeTitle}>Important Dates</Text>
          <View style={styles.noticeItem}>
            <View style={styles.noticeDot} />
            <Text style={styles.noticeText}>
              Marks entry deadline: June 15, 2026
            </Text>
          </View>
          <View style={styles.noticeItem}>
            <View style={styles.noticeDot} />
            <Text style={styles.noticeText}>
              Report cards to be published: June 20, 2026
            </Text>
          </View>
          <View style={styles.noticeItem}>
            <View style={styles.noticeDot} />
            <Text style={styles.noticeText}>
              Parent-Teacher meeting: June 25, 2026
            </Text>
          </View>
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
  addButton: { padding: 8, marginRight: -8 },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
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
  summaryCard: {
    backgroundColor: COLORS.primary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0px 8px 12px rgba(227, 83, 54, 0.3)",
      },
    }),
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  summaryTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  summaryDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  progressValue: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: "800",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.accent,
    borderRadius: 3,
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.bgWhite,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  examsList: {
    gap: 16,
    marginBottom: 24,
  },
  examCard: {
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
      },
    }),
  },
  examHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  examMetadata: {
    flexDirection: "row",
    gap: 12,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metadataText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  upcomingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 164, 96, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  upcomingBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.accent,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  completedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.success,
  },
  examDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
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
  prepareButton: {
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  prepareButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  scoreContainer: {
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  scoreValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "800",
  },
  scoreBarBg: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    backgroundColor: COLORS.success,
    borderRadius: 3,
  },
  viewResultsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  viewResultsText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  noticeBoard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  noticeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  noticeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  noticeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
});
