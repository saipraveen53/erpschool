// app/admin/examination/exams.tsx

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
  CalendarDays,
  FileText,
  Clock3,
  GraduationCap,
  CheckCircle2,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Users,
  ArrowRight,
} from "lucide-react-native";

export default function ExamsPage() {
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
            Examination Hub
          </Text>

          <Text style={styles.subheading}>
            Manage exams, schedules and results
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
          placeholder="Search exams..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>
            Final Semester Exams
          </Text>

          <Text style={styles.heroSubtitle}>
            Starts from 12 June 2026
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroMiniCard}>
              <CalendarDays
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                18 Exams
              </Text>
            </View>

            <View style={styles.heroMiniCard}>
              <Users
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                1,240 Students
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>
            View Schedule
          </Text>

          <ArrowRight
            size={16}
            color="#fff"
          />
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
          <BookOpen
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            24
          </Text>

          <Text style={styles.statsLabel}>
            Total Exams
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <CheckCircle2
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            18
          </Text>

          <Text style={styles.statsLabel}>
            Completed
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Clock3
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            6
          </Text>

          <Text style={styles.statsLabel}>
            Upcoming
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <GraduationCap
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
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <ClipboardCheck
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Marks Entry
          </Text>

          <Text style={styles.actionDesc}>
            Enter marks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <FileText
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

      {/* EXAMS */}

      <Text style={styles.sectionTitle}>
        Upcoming Exams
      </Text>

      <View style={styles.examList}>
        <View style={styles.examCard}>
          <View style={styles.examLeft}>
            <View style={styles.examIconBox}>
              <BookOpen
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

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              Upcoming
            </Text>
          </View>
        </View>

        <View style={styles.examCard}>
          <View style={styles.examLeft}>
            <View style={styles.examIconBox}>
              <BookOpen
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

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: "#DCFCE7" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: "#15803D" },
              ]}
            >
              Active
            </Text>
          </View>
        </View>

        <View style={styles.examCard}>
          <View style={styles.examLeft}>
            <View style={styles.examIconBox}>
              <BookOpen
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

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: "#FEF3C7" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: "#B45309" },
              ]}
            >
              Scheduled
            </Text>
          </View>
        </View>
      </View>

      {/* PERFORMANCE */}

      <Text style={styles.sectionTitle}>
        Performance Overview
      </Text>

      <View style={styles.performanceCard}>
        <View style={styles.performanceItem}>
          <Text style={styles.performanceValue}>
            92%
          </Text>

          <Text style={styles.performanceLabel}>
            Pass Rate
          </Text>
        </View>

        <View style={styles.performanceDivider} />

        <View style={styles.performanceItem}>
          <Text style={styles.performanceValue}>
            86%
          </Text>

          <Text style={styles.performanceLabel}>
            Avg Score
          </Text>
        </View>

        <View style={styles.performanceDivider} />

        <View style={styles.performanceItem}>
          <Text style={styles.performanceValue}>
            1,240
          </Text>

          <Text style={styles.performanceLabel}>
            Students
          </Text>
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
    color: "#6B7280",
    fontSize: 13,
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
    fontWeight: "800",
    fontSize: 13,
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
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },

  heroCard: {
    backgroundColor: "#A0522D",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },

  heroLeft: {
    marginBottom: 16,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  heroSubtitle: {
    color: "#F5F5DC",
    marginTop: 8,
    fontSize: 13,
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
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
    color: "#0F172A",
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
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
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
    fontSize: 11,
    textAlign: "center",
  },

  examList: {
    marginBottom: 24,
  },

  examCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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

  statusBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 11,
  },

  performanceCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 50,
  },

  performanceItem: {
    alignItems: "center",
    flex: 1,
  },

  performanceValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#A0522D",
  },

  performanceLabel: {
    marginTop: 6,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 11,
  },

  performanceDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#E5E7EB",
  },
});