// app/admin/reports/index.tsx

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
  FileBarChart2,
  TrendingUp,
  Users,
  IndianRupee,
  CalendarDays,
  ClipboardCheck,
  Search,
  Filter,
  Download,
  Bell,
  Sparkles,
  ChevronRight,
  PieChart,
  BarChart3,
  Activity,
  ShieldCheck,
  BrainCircuit,
  Clock3,
  GraduationCap,
  Wallet,
  BookOpen,
  UserCheck,
  AlertTriangle,
  MonitorSmartphone,
  Layers3,
  ArrowUpRight,
  CheckCircle2,
  Plus,
  Wand2,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const DARK = "#7C2D12";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function ReportsDashboard() {
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
      {/* ================= HEADER ================= */}

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Reports Dashboard
          </Text>

          <Text style={styles.subheading}>
            Smart analytics hub for academics, attendance, finance and student
            performance insights
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.createButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.createButtonText}>
              Generate Report
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ================= HERO SECTION ================= */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles
            size={isMobile ? 30 : 36}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            AI Powered Reporting System
          </Text>

          <Text style={styles.heroSubtitle}>
            Generate powerful academic, attendance and financial insights with
            smart analytics and automated reporting
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Explore Analytics
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <FileBarChart2
            size={30}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeValue}>
            120+
          </Text>

          <Text style={styles.heroBadgeLabel}>
            Reports Generated
          </Text>
        </View>
      </View>

      {/* ================= SEARCH ================= */}

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

      {/* ================= OVERVIEW STATS ================= */}

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <GraduationCap
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            1.2K
          </Text>

          <Text style={styles.statsLabel}>
            Students
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <TrendingUp
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            94%
          </Text>

          <Text style={styles.statsLabel}>
            Performance Rate
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Wallet
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            ₹48L
          </Text>

          <Text style={styles.statsLabel}>
            Fee Collection
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <ClipboardCheck
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            120+
          </Text>

          <Text style={styles.statsLabel}>
            Reports Generated
          </Text>
        </View>
      </View>

      {/* ================= REPORT MODULES ================= */}

      <Text style={styles.sectionTitle}>
        Report Categories
      </Text>

      <View style={styles.modulesGrid}>
        <TouchableOpacity style={styles.moduleCard}>
          <View style={styles.moduleIcon}>
            <BookOpen
              size={26}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Academic Reports
          </Text>

          <Text style={styles.moduleDesc}>
            Student marks and performance analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: DARK },
            ]}
          >
            <UserCheck
              size={26}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Attendance Reports
          </Text>

          <Text style={styles.moduleDesc}>
            Daily attendance analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: "#92400E" },
            ]}
          >
            <IndianRupee
              size={26}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Financial Reports
          </Text>

          <Text style={styles.moduleDesc}>
            Fee collection insights
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= SMART ANALYTICS ================= */}

      <Text style={styles.sectionTitle}>
        Smart AI Analytics
      </Text>

      <View style={styles.aiContainer}>
        <TouchableOpacity style={styles.aiCard}>
          <BrainCircuit
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Predictive Analytics
          </Text>

          <Text style={styles.aiDesc}>
            Forecast academic performance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <ShieldCheck
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Smart Accuracy
          </Text>

          <Text style={styles.aiDesc}>
            AI validated reporting
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <PieChart
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Visual Insights
          </Text>

          <Text style={styles.aiDesc}>
            Dynamic visual analytics
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= RECENT REPORTS ================= */}

      <Text style={styles.sectionTitle}>
        Recent Reports
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.reportCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <GraduationCap
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Grade 10 Academic Report
              </Text>

              <Text style={styles.cardInfo}>
                Updated today
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <CalendarDays
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Attendance Report
              </Text>

              <Text style={styles.cardInfo}>
                Monthly analytics
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <Wallet
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Fee Collection Analytics
              </Text>

              <Text style={styles.cardInfo}>
                Revenue insights
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {/* ================= QUICK ACTIONS ================= */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.quickCard}>
          <Wand2
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Auto Generate
          </Text>

          <Text style={styles.quickDesc}>
            AI powered reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Download
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Export Reports
          </Text>

          <Text style={styles.quickDesc}>
            PDF & Excel reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Bell
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Smart Alerts
          </Text>

          <Text style={styles.quickDesc}>
            Notifications and updates
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= ADVANCED TOOLS ================= */}

      <Text style={styles.sectionTitle}>
        Advanced Reporting Tools
      </Text>

      <View style={styles.advancedContainer}>
        <View style={styles.advancedCard}>
          <MonitorSmartphone
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.advancedValue}>
            Mobile Reports
          </Text>

          <Text style={styles.advancedLabel}>
            Access reports anywhere
          </Text>
        </View>

        <View style={styles.advancedCard}>
          <Layers3
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.advancedValue}>
            Multi Reports
          </Text>

          <Text style={styles.advancedLabel}>
            Compare datasets
          </Text>
        </View>

        <View style={styles.advancedCard}>
          <BarChart3
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.advancedValue}>
            Live Charts
          </Text>

          <Text style={styles.advancedLabel}>
            Dynamic analytics
          </Text>
        </View>
      </View>

      {/* ================= ANALYTICS ================= */}

      <Text style={styles.sectionTitle}>
        Performance Insights
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Activity
            size={26}
            color="#16A34A"
          />

          <Text style={styles.analyticsValue}>
            +18%
          </Text>

          <Text style={styles.analyticsLabel}>
            Growth Rate
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Clock3
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            2.4s
          </Text>

          <Text style={styles.analyticsLabel}>
            Avg Report Speed
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <AlertTriangle
            size={26}
            color="#DC2626"
          />

          <Text style={styles.analyticsValue}>
            3
          </Text>

          <Text style={styles.analyticsLabel}>
            Pending Reviews
          </Text>
        </View>
      </View>

      {/* ================= RECENT ACTIVITY ================= */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <CheckCircle2
            size={20}
            color="#16A34A"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Academic report generated
            </Text>

            <Text style={styles.activityTime}>
              2 hours ago
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <Bell
            size={20}
            color={PRIMARY}
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Attendance analytics updated
            </Text>

            <Text style={styles.activityTime}>
              Today
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <ArrowUpRight
            size={20}
            color="#B45309"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Financial insights exported
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
    backgroundColor: BG,
  },

  content: {
    paddingBottom: 100,
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

  createButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  createButtonText: {
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
    backgroundColor: DARK,
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

  heroBadgeValue: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
  },

  heroBadgeLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
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

  statsCard: {
    width: "48%",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  statsValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
    marginTop: 12,
  },

  statsLabel: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 11,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 16,
  },

  modulesGrid: {
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
    lineHeight: 18,
    fontSize: 11,
  },

  aiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  aiCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 16,
  },

  aiTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  aiDesc: {
    marginTop: 6,
    color: "#6B7280",
    lineHeight: 18,
    fontSize: 11,
  },

  listContainer: {
    marginBottom: 24,
  },

  reportCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLeft: {
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

  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  cardInfo: {
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

  advancedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  advancedCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  advancedValue: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "900",
    color: PRIMARY,
  },

  advancedLabel: {
    marginTop: 6,
    color: "#6B7280",
    textAlign: "center",
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
    marginTop: 12,
    fontSize: 24,
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
    gap: 12,
  },

  activityContent: {
    flex: 1,
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