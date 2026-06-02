// app/admin/reports/academic.tsx

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
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Download,
  Upload,
  Bell,
  CalendarDays,
  ClipboardCheck,
  Sparkles,
  ChevronRight,
  BookOpen,
  Trophy,
  Star,
  Filter,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function AcademicReportsPage() {
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

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Academic Reports
          </Text>

          <Text style={styles.subheading}>
            Analyze student performance, attendance and academic growth
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              Generate Report
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles
            size={isMobile ? 30 : 36}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            Smart Academic Analytics
          </Text>

          <Text style={styles.heroSubtitle}>
            AI-powered academic insights with real-time performance tracking
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Explore Insights
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <GraduationCap
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeText}>
            95% Success
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search reports..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* STATS */}

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <Users size={28} color={PRIMARY} />

          <Text style={styles.statValue}>
            1.2K
          </Text>

          <Text style={styles.statLabel}>
            Students
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <TrendingUp
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            92%
          </Text>

          <Text style={styles.statLabel}>
            Performance
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <ClipboardCheck
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            94%
          </Text>

          <Text style={styles.statLabel}>
            Attendance
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <Trophy size={28} color={PRIMARY} />

          <Text style={styles.statValue}>
            86
          </Text>

          <Text style={styles.statLabel}>
            Toppers
          </Text>
        </View>
      </View>

      {/* REPORT CARDS */}

      <Text style={styles.sectionTitle}>
        Academic Report Modules
      </Text>

      <View style={styles.reportGrid}>
        <TouchableOpacity style={styles.reportCard}>
          <View style={styles.reportIcon}>
            <BarChart3
              size={26}
              color="#fff"
            />
          </View>

          <Text style={styles.reportTitle}>
            Performance Report
          </Text>

          <Text style={styles.reportDesc}>
            Analyze marks & grades
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportCard}>
          <View
            style={[
              styles.reportIcon,
              { backgroundColor: "#7C2D12" },
            ]}
          >
            <PieChart
              size={26}
              color="#fff"
            />
          </View>

          <Text style={styles.reportTitle}>
            Attendance Analytics
          </Text>

          <Text style={styles.reportDesc}>
            Track attendance trends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportCard}>
          <View
            style={[
              styles.reportIcon,
              { backgroundColor: "#92400E" },
            ]}
          >
            <BookOpen
              size={26}
              color="#fff"
            />
          </View>

          <Text style={styles.reportTitle}>
            Subject Analysis
          </Text>

          <Text style={styles.reportDesc}>
            Compare subject growth
          </Text>
        </TouchableOpacity>
      </View>

      {/* TOP PERFORMERS */}

      <Text style={styles.sectionTitle}>
        Top Performers
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.studentCard}>
          <View style={styles.studentLeft}>
            <View style={styles.iconBox}>
              <Star
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.studentName}>
                Rahul Sharma
              </Text>

              <Text style={styles.studentClass}>
                Grade 10 • 98%
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.studentCard}>
          <View style={styles.studentLeft}>
            <View style={styles.iconBox}>
              <Trophy
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.studentName}>
                Priya Patel
              </Text>

              <Text style={styles.studentClass}>
                Grade 9 • 97%
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.studentCard}>
          <View style={styles.studentLeft}>
            <View style={styles.iconBox}>
              <GraduationCap
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.studentName}>
                Aryan Gupta
              </Text>

              <Text style={styles.studentClass}>
                Grade 8 • 96%
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.quickCard}>
          <Download
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Export Reports
          </Text>

          <Text style={styles.quickDesc}>
            Download academic reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Upload
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Upload Data
          </Text>

          <Text style={styles.quickDesc}>
            Import marks & attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Bell
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Notify Parents
          </Text>

          <Text style={styles.quickDesc}>
            Send academic alerts
          </Text>
        </TouchableOpacity>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Academic Insights
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <TrendingUp
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            +12%
          </Text>

          <Text style={styles.analyticsLabel}>
            Overall Improvement
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <CalendarDays
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            94%
          </Text>

          <Text style={styles.analyticsLabel}>
            Attendance Rate
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <FileSpreadsheet
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            120+
          </Text>

          <Text style={styles.analyticsLabel}>
            Reports Generated
          </Text>
        </View>
      </View>

      {/* RECENT ACTIVITY */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <View style={styles.activityDot} />

          <View>
            <Text style={styles.activityTitle}>
              Grade 10 report generated
            </Text>

            <Text style={styles.activityTime}>
              2 hours ago
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityDot} />

          <View>
            <Text style={styles.activityTitle}>
              Attendance analytics updated
            </Text>

            <Text style={styles.activityTime}>
              Today
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityDot} />

          <View>
            <Text style={styles.activityTitle}>
              Parent notifications sent
            </Text>

            <Text style={styles.activityTime}>
              Yesterday
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
    backgroundColor: BACKGROUND,
  },

  content: {
    paddingBottom: 80,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 22,
  },

  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 13,
    maxWidth: 520,
  },

  addButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 12,
  },

  heroSubtitle: {
    color: "#F5F5DC",
    marginTop: 8,
    lineHeight: 20,
    fontSize: 12,
  },

  heroButton: {
    marginTop: 16,
    backgroundColor: "#7A3B1A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  heroBadge: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },

  heroBadgeText: {
    marginTop: 8,
    fontWeight: "800",
    color: PRIMARY,
    fontSize: 12,
  },

  searchContainer: {
    backgroundColor: CARD,
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
    fontSize: 13,
  },

  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statCard: {
    width: "48%",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
    marginTop: 12,
  },

  statLabel: {
    marginTop: 6,
    fontSize: 11,
    color: "#6B7280",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 16,
  },

  reportGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  reportCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 14,
  },

  reportIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  reportTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  reportDesc: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 18,
  },

  listContainer: {
    marginBottom: 24,
  },

  studentCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  studentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  studentName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  studentClass: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  quickCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 16,
  },

  quickTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  quickDesc: {
    marginTop: 6,
    color: "#6B7280",
    lineHeight: 18,
    fontSize: 11,
  },

  analyticsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
  },

  analyticsValue: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
  },

  analyticsLabel: {
    marginTop: 6,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 11,
  },

  activityContainer: {
    marginBottom: 80,
  },

  activityCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    marginRight: 14,
  },

  activityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  activityTime: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },
});