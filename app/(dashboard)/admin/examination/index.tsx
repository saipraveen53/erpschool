// app/admin/examination/index.tsx

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  Search,
  Plus,
  GraduationCap,
  FileCheck,
  ClipboardList,
  BarChart3,
  CalendarDays,
  Clock3,
  Users,
  ArrowRight,
  BookOpen,
  Award,
  FileText,
  CheckCircle2,
} from "lucide-react-native";

export default function ExaminationIndex() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          padding: isMobile ? 16 : 20,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Examination Center
          </Text>

          <Text style={styles.subheading}>
            Manage exams, hall tickets and results
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.createButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.createButtonText}>
              Create Exam
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}

      <View style={styles.searchBox}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search examination..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Final Semester Examination 2026
          </Text>

          <Text style={styles.heroSubtitle}>
            Smart examination scheduling and analytics
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroMiniCard}>
              <Users size={16} color="#A0522D" />

              <Text style={styles.heroMiniText}>
                1,240 Students
              </Text>
            </View>

            <View style={styles.heroMiniCard}>
              <BookOpen size={16} color="#A0522D" />

              <Text style={styles.heroMiniText}>
                24 Subjects
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>
            View Schedule
          </Text>

          <ArrowRight size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* STATS */}

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <ClipboardList
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            24
          </Text>

          <Text style={styles.statsLabel}>
            Exams
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <FileCheck
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            1,240
          </Text>

          <Text style={styles.statsLabel}>
            Hall Tickets
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <BarChart3
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            92%
          </Text>

          <Text style={styles.statsLabel}>
            Pass Rate
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <Award size={28} color="#A0522D" />

          <Text style={styles.statsNumber}>
            86%
          </Text>

          <Text style={styles.statsLabel}>
            Avg Score
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <ClipboardList
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Exams
          </Text>

          <Text style={styles.actionDesc}>
            Manage exams
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <FileCheck
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Hall Tickets
          </Text>

          <Text style={styles.actionDesc}>
            Generate tickets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <BarChart3
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Results
          </Text>

          <Text style={styles.actionDesc}>
            Publish results
          </Text>
        </TouchableOpacity>
      </View>

      {/* UPCOMING EXAMS */}

      <Text style={styles.sectionTitle}>
        Upcoming Exams
      </Text>

      <View style={styles.examList}>
        <View style={styles.examCard}>
          <View style={styles.examLeft}>
            <View style={styles.examIconBox}>
              <CalendarDays
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.examName}>
                Mathematics Final Exam
              </Text>

              <Text style={styles.examDate}>
                12 June 2026 • 10:00 AM
              </Text>
            </View>
          </View>

          <View style={styles.upcomingBadge}>
            <Text style={styles.upcomingText}>
              Upcoming
            </Text>
          </View>
        </View>

        <View style={styles.examCard}>
          <View style={styles.examLeft}>
            <View style={styles.examIconBox}>
              <Clock3
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.examName}>
                Science Practical
              </Text>

              <Text style={styles.examDate}>
                15 June 2026 • 09:30 AM
              </Text>
            </View>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>
              Active
            </Text>
          </View>
        </View>

        <View style={styles.examCard}>
          <View style={styles.examLeft}>
            <View style={styles.examIconBox}>
              <GraduationCap
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.examName}>
                English Assessment
              </Text>

              <Text style={styles.examDate}>
                20 June 2026 • 11:00 AM
              </Text>
            </View>
          </View>

          <View style={styles.completedBadge}>
            <CheckCircle2
              size={14}
              color="#15803D"
            />

            <Text style={styles.completedText}>
              Scheduled
            </Text>
          </View>
        </View>
      </View>

      {/* ACTIVITY */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <FileText size={20} color="#A0522D" />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Hall tickets generated
            </Text>

            <Text style={styles.activityTime}>
              2 hours ago
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <BarChart3 size={20} color="#A0522D" />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Midterm results published
            </Text>

            <Text style={styles.activityTime}>
              Yesterday
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <ClipboardList
            size={20}
            color="#A0522D"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              New exam schedule created
            </Text>

            <Text style={styles.activityTime}>
              3 days ago
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },

  content: {
    paddingBottom: 80,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: "#A0522D",
  },

  subheading: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },

  createButton: {
    backgroundColor: "#A0522D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  createButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },

  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  heroCard: {
    backgroundColor: "#A0522D",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },

  heroContent: {
    marginBottom: 16,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  heroSubtitle: {
    marginTop: 8,
    color: "#F5F5DC",
    fontSize: 13,
    lineHeight: 20,
  },

  heroStatsRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
    flexWrap: "wrap",
  },

  heroMiniCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  heroMiniText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#111827",
  },

  heroButton: {
    backgroundColor: "#7C2D12",
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statsCard: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  statsNumber: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },

  statsLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#A0522D",
    marginBottom: 14,
  },

  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  actionCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: "center",
  },

  actionTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  actionDesc: {
    marginTop: 4,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 11,
  },

  examList: {
    marginBottom: 24,
  },

  examCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  examLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  examIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F5F5DC",
    justifyContent: "center",
    alignItems: "center",
  },

  examName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  examDate: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  upcomingBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  upcomingText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 11,
  },

  activeBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  activeText: {
    color: "#15803D",
    fontWeight: "700",
    fontSize: 11,
  },

  completedBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  completedText: {
    color: "#B45309",
    fontWeight: "700",
    fontSize: 11,
  },

  activityContainer: {
    marginBottom: 50,
  },

  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  activityTime: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },
});