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

/* ========================================= */
/* UPDATED COLORS */
/* ========================================= */

const PRIMARY = "#203744";

const ACCENT = "#22C7E5";

const BG = "#F1F5F9";

const CARD = "#FFFFFF";

const LIGHT = "#E7FAFD";

const BORDER = "#DCE7EF";

const TEXT_DARK = "#1E293B";

const TEXT_LIGHT = "#64748B";

export default function ReportsDashboard() {
  const { width } =
    useWindowDimensions();

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
      <StatusBar style="dark" />

      {/* ================= HEADER ================= */}

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Reports Dashboard
          </Text>

          <Text style={styles.subheading}>
            Smart analytics hub for
            academics, attendance,
            finance and student
            performance insights
          </Text>
        </View>

        {!isMobile && (
          <TouchableOpacity
            style={
              styles.createButton
            }
          >
            <Plus
              size={18}
              color="#fff"
            />

            <Text
              style={
                styles.createButtonText
              }
            >
              Generate Report
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ================= SEARCH ================= */}

      <View
        style={
          styles.searchContainer
        }
      >
        <Search
          size={20}
          color={TEXT_LIGHT}
        />

        <TextInput
          placeholder="Search reports..."
          placeholderTextColor={
            TEXT_LIGHT
          }
          style={styles.searchInput}
        />

        <TouchableOpacity
          style={styles.filterButton}
        >
          <Filter
            size={18}
            color={PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {/* ================= OVERVIEW STATS ================= */}

      <View style={styles.statsGrid}>
        <View
          style={styles.statsCard}
        >
          <GraduationCap
            size={30}
            color={ACCENT}
          />

          <Text
            style={styles.statsValue}
          >
            1.2K
          </Text>

          <Text
            style={styles.statsLabel}
          >
            Students
          </Text>
        </View>

        <View
          style={styles.statsCard}
        >
          <TrendingUp
            size={30}
            color={ACCENT}
          />

          <Text
            style={styles.statsValue}
          >
            94%
          </Text>

          <Text
            style={styles.statsLabel}
          >
            Performance Rate
          </Text>
        </View>

        <View
          style={styles.statsCard}
        >
          <Wallet
            size={30}
            color={ACCENT}
          />

          <Text
            style={styles.statsValue}
          >
            ₹48L
          </Text>

          <Text
            style={styles.statsLabel}
          >
            Fee Collection
          </Text>
        </View>

        <View
          style={styles.statsCard}
        >
          <ClipboardCheck
            size={30}
            color={ACCENT}
          />

          <Text
            style={styles.statsValue}
          >
            120+
          </Text>

          <Text
            style={styles.statsLabel}
          >
            Reports Generated
          </Text>
        </View>
      </View>

      {/* ================= REPORT MODULES ================= */}

      <Text style={styles.sectionTitle}>
        Report Categories
      </Text>

      <View style={styles.modulesGrid}>
        <TouchableOpacity
          style={styles.moduleCard}
        >
          <View
            style={
              styles.moduleIcon
            }
          >
            <BookOpen
              size={28}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.moduleTitle
            }
          >
            Academic Reports
          </Text>

          <Text
            style={styles.moduleDesc}
          >
            Student marks and
            performance analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moduleCard}
        >
          <View
            style={
              styles.moduleIcon
            }
          >
            <UserCheck
              size={28}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.moduleTitle
            }
          >
            Attendance Reports
          </Text>

          <Text
            style={styles.moduleDesc}
          >
            Daily attendance
            analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moduleCard}
        >
          <View
            style={
              styles.moduleIcon
            }
          >
            <IndianRupee
              size={28}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.moduleTitle
            }
          >
            Financial Reports
          </Text>

          <Text
            style={styles.moduleDesc}
          >
            Fee collection insights
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= SMART ANALYTICS ================= */}

      <Text style={styles.sectionTitle}>
        Smart AI Analytics
      </Text>

      <View style={styles.aiContainer}>
        <TouchableOpacity
          style={styles.aiCard}
        >
          <BrainCircuit
            size={30}
            color={ACCENT}
          />

          <Text style={styles.aiTitle}>
            Predictive Analytics
          </Text>

          <Text style={styles.aiDesc}>
            Forecast academic
            performance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aiCard}
        >
          <ShieldCheck
            size={30}
            color={ACCENT}
          />

          <Text style={styles.aiTitle}>
            Smart Accuracy
          </Text>

          <Text style={styles.aiDesc}>
            AI validated reporting
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aiCard}
        >
          <PieChart
            size={30}
            color={ACCENT}
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
        <TouchableOpacity
          style={styles.reportCard}
        >
          <View style={styles.cardLeft}>
            <View
              style={styles.iconBox}
            >
              <GraduationCap
                size={22}
                color={ACCENT}
              />
            </View>

            <View>
              <Text
                style={styles.cardTitle}
              >
                Grade 10 Academic
                Report
              </Text>

              <Text
                style={styles.cardInfo}
              >
                Updated today
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color={TEXT_LIGHT}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportCard}
        >
          <View style={styles.cardLeft}>
            <View
              style={styles.iconBox}
            >
              <CalendarDays
                size={22}
                color={ACCENT}
              />
            </View>

            <View>
              <Text
                style={styles.cardTitle}
              >
                Attendance Report
              </Text>

              <Text
                style={styles.cardInfo}
              >
                Monthly analytics
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color={TEXT_LIGHT}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportCard}
        >
          <View style={styles.cardLeft}>
            <View
              style={styles.iconBox}
            >
              <Wallet
                size={22}
                color={ACCENT}
              />
            </View>

            <View>
              <Text
                style={styles.cardTitle}
              >
                Fee Collection
                Analytics
              </Text>

              <Text
                style={styles.cardInfo}
              >
                Revenue insights
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color={TEXT_LIGHT}
          />
        </TouchableOpacity>
      </View>

      {/* ================= QUICK ACTIONS ================= */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickCard}
        >
          <Wand2
            size={30}
            color={ACCENT}
          />

          <Text
            style={styles.quickTitle}
          >
            Auto Generate
          </Text>

          <Text
            style={styles.quickDesc}
          >
            AI powered reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
        >
          <Download
            size={30}
            color={ACCENT}
          />

          <Text
            style={styles.quickTitle}
          >
            Export Reports
          </Text>

          <Text
            style={styles.quickDesc}
          >
            PDF & Excel reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
        >
          <Bell
            size={30}
            color={ACCENT}
          />

          <Text
            style={styles.quickTitle}
          >
            Smart Alerts
          </Text>

          <Text
            style={styles.quickDesc}
          >
            Notifications and
            updates
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= ADVANCED TOOLS ================= */}

      <Text style={styles.sectionTitle}>
        Advanced Reporting Tools
      </Text>

      <View
        style={
          styles.advancedContainer
        }
      >
        <View
          style={
            styles.advancedCard
          }
        >
          <MonitorSmartphone
            size={28}
            color={ACCENT}
          />

          <Text
            style={
              styles.advancedValue
            }
          >
            Mobile Reports
          </Text>

          <Text
            style={
              styles.advancedLabel
            }
          >
            Access reports anywhere
          </Text>
        </View>

        <View
          style={
            styles.advancedCard
          }
        >
          <Layers3
            size={28}
            color={ACCENT}
          />

          <Text
            style={
              styles.advancedValue
            }
          >
            Multi Reports
          </Text>

          <Text
            style={
              styles.advancedLabel
            }
          >
            Compare datasets
          </Text>
        </View>

        <View
          style={
            styles.advancedCard
          }
        >
          <BarChart3
            size={28}
            color={ACCENT}
          />

          <Text
            style={
              styles.advancedValue
            }
          >
            Live Charts
          </Text>

          <Text
            style={
              styles.advancedLabel
            }
          >
            Dynamic analytics
          </Text>
        </View>
      </View>

      {/* ================= ANALYTICS ================= */}

      <Text style={styles.sectionTitle}>
        Performance Insights
      </Text>

      <View
        style={
          styles.analyticsContainer
        }
      >
        <View
          style={
            styles.analyticsCard
          }
        >
          <Activity
            size={28}
            color={ACCENT}
          />

          <Text
            style={
              styles.analyticsValue
            }
          >
            +18%
          </Text>

          <Text
            style={
              styles.analyticsLabel
            }
          >
            Growth Rate
          </Text>
        </View>

        <View
          style={
            styles.analyticsCard
          }
        >
          <Clock3
            size={28}
            color={ACCENT}
          />

          <Text
            style={
              styles.analyticsValue
            }
          >
            2.4s
          </Text>

          <Text
            style={
              styles.analyticsLabel
            }
          >
            Avg Report Speed
          </Text>
        </View>

        <View
          style={
            styles.analyticsCard
          }
        >
          <AlertTriangle
            size={28}
            color={ACCENT}
          />

          <Text
            style={
              styles.analyticsValue
            }
          >
            3
          </Text>

          <Text
            style={
              styles.analyticsLabel
            }
          >
            Pending Reviews
          </Text>
        </View>
      </View>

      {/* ================= RECENT ACTIVITY ================= */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      <View
        style={
          styles.activityContainer
        }
      >
        <View
          style={styles.activityCard}
        >
          <CheckCircle2
            size={22}
            color={ACCENT}
          />

          <View
            style={
              styles.activityContent
            }
          >
            <Text
              style={
                styles.activityTitle
              }
            >
              Academic report
              generated
            </Text>

            <Text
              style={
                styles.activityTime
              }
            >
              2 hours ago
            </Text>
          </View>
        </View>

        <View
          style={styles.activityCard}
        >
          <Bell
            size={22}
            color={ACCENT}
          />

          <View
            style={
              styles.activityContent
            }
          >
            <Text
              style={
                styles.activityTitle
              }
            >
              Attendance analytics
              updated
            </Text>

            <Text
              style={
                styles.activityTime
              }
            >
              Today
            </Text>
          </View>
        </View>

        <View
          style={styles.activityCard}
        >
          <ArrowUpRight
            size={22}
            color={ACCENT}
          />

          <View
            style={
              styles.activityContent
            }
          >
            <Text
              style={
                styles.activityTitle
              }
            >
              Financial insights
              exported
            </Text>

            <Text
              style={
                styles.activityTime
              }
            >
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
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },

  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 6,
    color: TEXT_LIGHT,
    fontSize: 14,
    maxWidth: 520,
    lineHeight: 22,
  },

  createButton: {
    backgroundColor: ACCENT,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  createButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 28,
    padding: 22,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 12,
  },

  heroSubtitle: {
    color: "#DCE7EF",
    marginTop: 8,
    lineHeight: 22,
    fontSize: 14,
  },

  heroButton: {
    marginTop: 16,
    backgroundColor: ACCENT,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  heroBadge: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 22,
    alignItems: "center",
  },

  heroBadgeValue: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "900",
    color: PRIMARY,
  },

  heroBadgeLabel: {
    marginTop: 4,
    color: TEXT_LIGHT,
    fontSize: 12,
  },

  searchContainer: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: TEXT_DARK,
  },

  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
    marginBottom: 24,
  },

  statsCard: {
    width: "48%",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },

  statsValue: {
    fontSize: 30,
    fontWeight: "900",
    color: TEXT_DARK,
    marginTop: 12,
  },

  statsLabel: {
    marginTop: 6,
    color: TEXT_LIGHT,
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 18,
  },

  modulesGrid: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 24,
  },

  moduleCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },

  moduleIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },

  moduleTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  moduleDesc: {
    marginTop: 6,
    color: TEXT_LIGHT,
    lineHeight: 20,
    fontSize: 12,
  },

  aiContainer: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 24,
  },

  aiCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },

  aiTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  aiDesc: {
    marginTop: 6,
    color: TEXT_LIGHT,
    lineHeight: 20,
    fontSize: 12,
  },

  listContainer: {
    marginBottom: 24,
  },

  reportCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  cardInfo: {
    marginTop: 4,
    color: TEXT_LIGHT,
    fontSize: 12,
  },

  quickGrid: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 24,
  },

  quickCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },

  quickTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  quickDesc: {
    marginTop: 6,
    color: TEXT_LIGHT,
    lineHeight: 20,
    fontSize: 12,
  },

  advancedContainer: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 24,
  },

  advancedCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  advancedValue: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "900",
    color: PRIMARY,
  },

  advancedLabel: {
    marginTop: 6,
    color: TEXT_LIGHT,
    textAlign: "center",
    fontSize: 12,
  },

  analyticsContainer: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 24,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  analyticsValue: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: "900",
    color: PRIMARY,
  },

  analyticsLabel: {
    marginTop: 6,
    color: TEXT_LIGHT,
    textAlign: "center",
    fontSize: 12,
  },

  activityContainer: {
    marginBottom: 80,
  },

  activityCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
  },

  activityTime: {
    marginTop: 4,
    color: TEXT_LIGHT,
    fontSize: 12,
  },
});