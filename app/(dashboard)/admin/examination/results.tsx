// app/admin/examination/results.tsx

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
  Trophy,
  Medal,
  GraduationCap,
  Users,
  FileBarChart,
  Download,
  Upload,
  Eye,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Star,
  Award,
  BarChart3,
  Filter,
  Printer,
  BookOpen,
} from "lucide-react-native";

export default function ResultsPage() {
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
            Results Center
          </Text>

          <Text style={styles.subheading}>
            Publish and manage examination results
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.publishButton}>
            <Upload size={16} color="#fff" />

            <Text style={styles.publishButtonText}>
              Publish Results
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}

      <View style={styles.searchBox}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search results..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Final Semester Results 2026
          </Text>

          <Text style={styles.heroSubtitle}>
            Performance analytics and report generation
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroMiniCard}>
              <Users
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                1,240 Students
              </Text>
            </View>

            <View style={styles.heroMiniCard}>
              <GraduationCap
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                92% Pass Rate
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.heroButton}>
          <Eye size={16} color="#fff" />

          <Text style={styles.heroButtonText}>
            View Reports
          </Text>
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
          <FileBarChart
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            1,240
          </Text>

          <Text style={styles.statsLabel}>
            Published
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
            92%
          </Text>

          <Text style={styles.statsLabel}>
            Pass Rate
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <TrendingUp
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            86%
          </Text>

          <Text style={styles.statsLabel}>
            Avg Score
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <Star size={28} color="#A0522D" />

          <Text style={styles.statsNumber}>
            128
          </Text>

          <Text style={styles.statsLabel}>
            Distinctions
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Download
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Download Reports
          </Text>

          <Text style={styles.actionDesc}>
            Export reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Printer
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Print Results
          </Text>

          <Text style={styles.actionDesc}>
            Print reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Filter
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Filter Analytics
          </Text>

          <Text style={styles.actionDesc}>
            Filter results
          </Text>
        </TouchableOpacity>
      </View>

      {/* TOPPERS */}

      <Text style={styles.sectionTitle}>
        Top Performers
      </Text>

      <View style={styles.topperContainer}>
        <View style={styles.topperCard}>
          <View style={styles.rankCircle}>
            <Trophy size={22} color="#fff" />
          </View>

          <Text style={styles.topperName}>
            Rahul Sharma
          </Text>

          <Text style={styles.topperMarks}>
            98%
          </Text>

          <Text style={styles.topperClass}>
            Class 10-A
          </Text>
        </View>

        <View style={styles.topperCard}>
          <View
            style={[
              styles.rankCircle,
              { backgroundColor: "#B45309" },
            ]}
          >
            <Medal size={20} color="#fff" />
          </View>

          <Text style={styles.topperName}>
            Priya Patel
          </Text>

          <Text style={styles.topperMarks}>
            96%
          </Text>

          <Text style={styles.topperClass}>
            Class 10-B
          </Text>
        </View>

        <View style={styles.topperCard}>
          <View
            style={[
              styles.rankCircle,
              { backgroundColor: "#6B7280" },
            ]}
          >
            <Award size={20} color="#fff" />
          </View>

          <Text style={styles.topperName}>
            Aryan Gupta
          </Text>

          <Text style={styles.topperMarks}>
            95%
          </Text>

          <Text style={styles.topperClass}>
            Class 10-C
          </Text>
        </View>
      </View>

      {/* RECENT RESULTS */}

      <Text style={styles.sectionTitle}>
        Recent Result Activity
      </Text>

      <View style={styles.resultList}>
        <View style={styles.resultCard}>
          <View style={styles.resultLeft}>
            <View style={styles.resultIconBox}>
              <BookOpen
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.resultTitle}>
                Mathematics Results Published
              </Text>

              <Text style={styles.resultTime}>
                2 hours ago
              </Text>
            </View>
          </View>

          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>
              Published
            </Text>
          </View>
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultLeft}>
            <View style={styles.resultIconBox}>
              <Clock3
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.resultTitle}>
                Science Review Pending
              </Text>

              <Text style={styles.resultTime}>
                5 hours ago
              </Text>
            </View>
          </View>

          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>
              Pending
            </Text>
          </View>
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultLeft}>
            <View style={styles.resultIconBox}>
              <BarChart3
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.resultTitle}>
                Analytics Generated
              </Text>

              <Text style={styles.resultTime}>
                Yesterday
              </Text>
            </View>
          </View>

          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>
              Completed
            </Text>
          </View>
        </View>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Performance Overview
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            98%
          </Text>

          <Text style={styles.analyticsLabel}>
            Highest Score
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            86%
          </Text>

          <Text style={styles.analyticsLabel}>
            Average Score
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            92%
          </Text>

          <Text style={styles.analyticsLabel}>
            Pass Percentage
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

  publishButton: {
    backgroundColor: "#A0522D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  publishButtonText: {
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

  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
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

  quickActions: {
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
    fontSize: 11,
    textAlign: "center",
  },

  topperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  topperCard: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
  },

  rankCircle: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#A0522D",
    justifyContent: "center",
    alignItems: "center",
  },

  topperName: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  topperMarks: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "900",
    color: "#A0522D",
  },

  topperClass: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  resultList: {
    marginBottom: 24,
  },

  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resultLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  resultIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F5F5DC",
    justifyContent: "center",
    alignItems: "center",
  },

  resultTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  resultTime: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  completedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  completedText: {
    color: "#15803D",
    fontWeight: "700",
    fontSize: 11,
  },

  pendingBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  pendingText: {
    color: "#B45309",
    fontWeight: "700",
    fontSize: 11,
  },

  analyticsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
  },

  analyticsValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#A0522D",
  },

  analyticsLabel: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
  },
});