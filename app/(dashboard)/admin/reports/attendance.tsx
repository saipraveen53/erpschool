// app/admin/reports/attendance.tsx

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
  ClipboardCheck,
  Users,
  TrendingUp,
  CalendarDays,
  Bell,
  Download,
  Upload,
  PieChart,
  BarChart3,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Filter,
  School,
  UserCheck,
  Activity,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function AttendanceReportsPage() {
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
            Attendance Reports
          </Text>

          <Text style={styles.subheading}>
            Smart attendance analytics and performance tracking dashboard
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

      {/* HERO SECTION */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles
            size={isMobile ? 30 : 36}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            Attendance Intelligence
          </Text>

          <Text style={styles.heroSubtitle}>
            Monitor student attendance trends with real-time insights
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Explore Analytics
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <ClipboardCheck
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeText}>
            94% Attendance
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search attendance reports..."
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
          <CheckCircle2
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            94%
          </Text>

          <Text style={styles.statLabel}>
            Present Rate
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Clock3 size={28} color={PRIMARY} />

          <Text style={styles.statValue}>
            52
          </Text>

          <Text style={styles.statLabel}>
            Late Entries
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <TrendingUp
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            +8%
          </Text>

          <Text style={styles.statLabel}>
            Monthly Growth
          </Text>
        </View>
      </View>

      {/* ANALYTICS MODULES */}

      <Text style={styles.sectionTitle}>
        Attendance Modules
      </Text>

      <View style={styles.moduleGrid}>
        <TouchableOpacity style={styles.moduleCard}>
          <View style={styles.moduleIcon}>
            <PieChart
              size={26}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Daily Analytics
          </Text>

          <Text style={styles.moduleDesc}>
            View daily attendance trends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: "#7C2D12" },
            ]}
          >
            <BarChart3
              size={26}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Monthly Reports
          </Text>

          <Text style={styles.moduleDesc}>
            Analyze monthly records
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: "#92400E" },
            ]}
          >
            <Activity
              size={26}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Performance Insights
          </Text>

          <Text style={styles.moduleDesc}>
            Compare attendance impact
          </Text>
        </TouchableOpacity>
      </View>

      {/* TOP ATTENDANCE */}

      <Text style={styles.sectionTitle}>
        Top Attendance Students
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.studentCard}>
          <View style={styles.studentLeft}>
            <View style={styles.iconBox}>
              <UserCheck
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.studentName}>
                Rahul Sharma
              </Text>

              <Text style={styles.studentClass}>
                Grade 10 • 99%
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
              <School
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.studentName}>
                Priya Patel
              </Text>

              <Text style={styles.studentClass}>
                Grade 9 • 98%
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
              <ClipboardCheck
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.studentName}>
                Aryan Gupta
              </Text>

              <Text style={styles.studentClass}>
                Grade 8 • 97%
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
            Download attendance reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Upload
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Upload Records
          </Text>

          <Text style={styles.quickDesc}>
            Import attendance sheets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Bell
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Send Alerts
          </Text>

          <Text style={styles.quickDesc}>
            Notify absentees instantly
          </Text>
        </TouchableOpacity>
      </View>

      {/* ATTENDANCE INSIGHTS */}

      <Text style={styles.sectionTitle}>
        Attendance Insights
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <TrendingUp
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            +8%
          </Text>

          <Text style={styles.analyticsLabel}>
            Attendance Growth
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
            Average Attendance
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <AlertTriangle
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            42
          </Text>

          <Text style={styles.analyticsLabel}>
            Low Attendance Cases
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
              Grade 10 attendance updated
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
              Absentee notifications sent
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
              Monthly report exported
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

  moduleGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  moduleCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 14,
  },

  moduleIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  moduleTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  moduleDesc: {
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