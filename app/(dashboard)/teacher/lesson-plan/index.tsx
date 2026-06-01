import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Clock,
    MoreVertical,
    Plus,
} from "lucide-react-native";
import React from "react";
import {
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
  success: "#2E7D32",
  warning: "#F57C00",
  pending: "#757575",
};

const DUMMY_PLANS = [
  {
    id: "1",
    classStr: "10-A",
    subject: "Mathematics",
    chapter: "Chapter 5: Quadratic Equations",
    status: "In Progress",
    progress: 65,
    date: "June 1 - June 10",
  },
  {
    id: "2",
    classStr: "11-Science",
    subject: "Physics",
    chapter: "Chapter 3: Laws of Motion",
    status: "Completed",
    progress: 100,
    date: "May 15 - May 28",
  },
  {
    id: "3",
    classStr: "10-B",
    subject: "Mathematics",
    chapter: "Chapter 6: Triangles",
    status: "Pending",
    progress: 0,
    date: "June 12 - June 24",
  },
];

export default function LessonPlanScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          color: COLORS.success,
          bg: "rgba(46, 125, 50, 0.1)",
          icon: CheckCircle2,
        };
      case "In Progress":
        return {
          color: COLORS.warning,
          bg: "rgba(245, 124, 0, 0.1)",
          icon: Clock,
        };
      default:
        return {
          color: COLORS.pending,
          bg: "rgba(117, 117, 117, 0.1)",
          icon: BookOpen,
        };
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lesson Plans</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.contentWrapper,
          { maxWidth: isDesktop ? 800 : "100%" },
        ]}
      >
        {/* --- SUMMARY STATS --- */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Active Plans</Text>
          </View>
          <View
            style={[
              styles.statBox,
              {
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: "#EAEAEE",
              },
            ]}
          >
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Syllabus Tracking</Text>

        {/* --- PLAN LIST --- */}
        <View style={styles.listContainer}>
          {DUMMY_PLANS.map((plan) => {
            const StatusIcon = getStatusConfig(plan.status).icon;
            const statusColor = getStatusConfig(plan.status).color;
            const statusBg = getStatusConfig(plan.status).bg;

            return (
              <View key={plan.id} style={styles.planCard}>
                {/* Header Row */}
                <View style={styles.cardHeader}>
                  <View style={styles.classBadge}>
                    <Text style={styles.classBadgeText}>
                      {plan.classStr} • {plan.subject}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <MoreVertical size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Chapter Title & Date */}
                <Text style={styles.chapterTitle}>{plan.chapter}</Text>
                <Text style={styles.dateText}>Duration: {plan.date}</Text>

                {/* Progress Section */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusBg },
                      ]}
                    >
                      <StatusIcon size={14} color={statusColor} />
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {plan.status}
                      </Text>
                    </View>
                    <Text style={styles.progressPercent}>{plan.progress}%</Text>
                  </View>

                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${plan.progress}%`,
                          backgroundColor: statusColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
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
    borderBottomColor: "#EAEAEE",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  addButton: {
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    padding: 8,
    borderRadius: 8,
  },

  contentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "600" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },

  // List
  listContainer: { gap: 16, paddingBottom: 40 },
  planCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  classBadge: {
    backgroundColor: "rgba(92, 46, 20, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  classBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  chapterTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 20,
  },

  // Progress bar area
  progressSection: { marginTop: 4 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  progressPercent: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
});
