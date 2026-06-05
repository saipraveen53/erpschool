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

/* ========================================= */
/* UPDATED COLORS */
/* ========================================= */

const PRIMARY = "#203744";

const ACCENT = "#22C7E5";

const BACKGROUND = "#F1F5F9";

const CARD = "#FFFFFF";

const LIGHT = "#E7FAFD";

const BORDER = "#DCE7EF";

const TEXT_DARK = "#1E293B";

const TEXT_LIGHT = "#64748B";

export default function AcademicReportsPage() {
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

      {/* HEADER */}

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Academic Reports
          </Text>

          <Text style={styles.subheading}>
            Analyze student
            performance, attendance
            and academic growth
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity
            style={styles.addButton}
          >
            <Plus
              size={16}
              color="#fff"
            />

            <Text
              style={
                styles.addButtonText
              }
            >
              Generate Report
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}

      <View
        style={
          styles.searchContainer
        }
      >
        <Search
          size={18}
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
            size={16}
            color={PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {/* STATS */}

      <View style={styles.statsGrid}>
        <View
          style={styles.statCard}
        >
          <Users
            size={28}
            color={ACCENT}
          />

          <Text
            style={styles.statValue}
          >
            1.2K
          </Text>

          <Text
            style={styles.statLabel}
          >
            Students
          </Text>
        </View>

        <View
          style={styles.statCard}
        >
          <TrendingUp
            size={28}
            color={ACCENT}
          />

          <Text
            style={styles.statValue}
          >
            92%
          </Text>

          <Text
            style={styles.statLabel}
          >
            Performance
          </Text>
        </View>

        <View
          style={styles.statCard}
        >
          <ClipboardCheck
            size={28}
            color={ACCENT}
          />

          <Text
            style={styles.statValue}
          >
            94%
          </Text>

          <Text
            style={styles.statLabel}
          >
            Attendance
          </Text>
        </View>

        <View
          style={styles.statCard}
        >
          <Trophy
            size={28}
            color={ACCENT}
          />

          <Text
            style={styles.statValue}
          >
            86
          </Text>

          <Text
            style={styles.statLabel}
          >
            Toppers
          </Text>
        </View>
      </View>

      {/* REPORT CARDS */}

      <Text style={styles.sectionTitle}>
        Academic Report Modules
      </Text>

      <View style={styles.reportGrid}>
        <TouchableOpacity
          style={styles.reportCard}
        >
          <View
            style={
              styles.reportIcon
            }
          >
            <BarChart3
              size={26}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.reportTitle
            }
          >
            Performance Report
          </Text>

          <Text
            style={styles.reportDesc}
          >
            Analyze marks & grades
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportCard}
        >
          <View
            style={
              styles.reportIcon
            }
          >
            <PieChart
              size={26}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.reportTitle
            }
          >
            Attendance Analytics
          </Text>

          <Text
            style={styles.reportDesc}
          >
            Track attendance trends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportCard}
        >
          <View
            style={
              styles.reportIcon
            }
          >
            <BookOpen
              size={26}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.reportTitle
            }
          >
            Subject Analysis
          </Text>

          <Text
            style={styles.reportDesc}
          >
            Compare subject growth
          </Text>
        </TouchableOpacity>
      </View>

      {/* TOP PERFORMERS */}

      <Text style={styles.sectionTitle}>
        Top Performers
      </Text>

      <View
        style={
          styles.listContainer
        }
      >
        <TouchableOpacity
          style={styles.studentCard}
        >
          <View
            style={
              styles.studentLeft
            }
          >
            <View
              style={styles.iconBox}
            >
              <Star
                size={20}
                color={ACCENT}
              />
            </View>

            <View>
              <Text
                style={
                  styles.studentName
                }
              >
                Rahul Sharma
              </Text>

              <Text
                style={
                  styles.studentClass
                }
              >
                Grade 10 • 98%
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color={TEXT_LIGHT}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.studentCard}
        >
          <View
            style={
              styles.studentLeft
            }
          >
            <View
              style={styles.iconBox}
            >
              <Trophy
                size={20}
                color={ACCENT}
              />
            </View>

            <View>
              <Text
                style={
                  styles.studentName
                }
              >
                Priya Patel
              </Text>

              <Text
                style={
                  styles.studentClass
                }
              >
                Grade 9 • 97%
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color={TEXT_LIGHT}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.studentCard}
        >
          <View
            style={
              styles.studentLeft
            }
          >
            <View
              style={styles.iconBox}
            >
              <GraduationCap
                size={20}
                color={ACCENT}
              />
            </View>

            <View>
              <Text
                style={
                  styles.studentName
                }
              >
                Aryan Gupta
              </Text>

              <Text
                style={
                  styles.studentClass
                }
              >
                Grade 8 • 96%
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color={TEXT_LIGHT}
          />
        </TouchableOpacity>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickCard}
        >
          <Download
            size={28}
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
            Download academic
            reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
        >
          <Upload
            size={28}
            color={ACCENT}
          />

          <Text
            style={styles.quickTitle}
          >
            Upload Data
          </Text>

          <Text
            style={styles.quickDesc}
          >
            Import marks &
            attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
        >
          <Bell
            size={28}
            color={ACCENT}
          />

          <Text
            style={styles.quickTitle}
          >
            Notify Parents
          </Text>

          <Text
            style={styles.quickDesc}
          >
            Send academic alerts
          </Text>
        </TouchableOpacity>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Academic Insights
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
          <TrendingUp
            size={24}
            color={ACCENT}
          />

          <Text
            style={
              styles.analyticsValue
            }
          >
            +12%
          </Text>

          <Text
            style={
              styles.analyticsLabel
            }
          >
            Overall Improvement
          </Text>
        </View>

        <View
          style={
            styles.analyticsCard
          }
        >
          <CalendarDays
            size={24}
            color={ACCENT}
          />

          <Text
            style={
              styles.analyticsValue
            }
          >
            94%
          </Text>

          <Text
            style={
              styles.analyticsLabel
            }
          >
            Attendance Rate
          </Text>
        </View>

        <View
          style={
            styles.analyticsCard
          }
        >
          <FileSpreadsheet
            size={24}
            color={ACCENT}
          />

          <Text
            style={
              styles.analyticsValue
            }
          >
            120+
          </Text>

          <Text
            style={
              styles.analyticsLabel
            }
          >
            Reports Generated
          </Text>
        </View>
      </View>

      {/* RECENT ACTIVITY */}

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
          <View
            style={
              styles.activityDot
            }
          />

          <View>
            <Text
              style={
                styles.activityTitle
              }
            >
              Grade 10 report
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
          <View
            style={
              styles.activityDot
            }
          />

          <View>
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
          <View
            style={
              styles.activityDot
            }
          />

          <View>
            <Text
              style={
                styles.activityTitle
              }
            >
              Parent notifications
              sent
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
    backgroundColor:
      BACKGROUND,
  },

  content: {
    paddingBottom: 80,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
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
    color: TEXT_LIGHT,
    fontSize: 13,
    maxWidth: 520,
  },

  addButton: {
    backgroundColor:
      ACCENT,
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
    backgroundColor:
      PRIMARY,
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
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
    fontSize: 24,
    fontWeight: "900",
    marginTop: 12,
  },

  heroSubtitle: {
    color: "#DCE7EF",
    marginTop: 8,
    lineHeight: 20,
    fontSize: 12,
  },

  heroButton: {
    marginTop: 16,
    backgroundColor:
      ACCENT,
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
    backgroundColor:
      "#fff",
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
    borderWidth: 1,
    borderColor: BORDER,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: TEXT_DARK,
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
    justifyContent:
      "space-between",
    marginBottom: 24,
  },

  statCard: {
    width: "48%",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },

  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: TEXT_DARK,
    marginTop: 12,
  },

  statLabel: {
    marginTop: 6,
    fontSize: 11,
    color: TEXT_LIGHT,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 16,
  },

  reportGrid: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 24,
  },

  reportCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },

  reportIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor:
      ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },

  reportTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  reportDesc: {
    marginTop: 6,
    color: TEXT_LIGHT,
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
    justifyContent:
      "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
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
    color: TEXT_DARK,
  },

  studentClass: {
    marginTop: 4,
    color: TEXT_LIGHT,
    fontSize: 11,
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
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },

  quickTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  quickDesc: {
    marginTop: 6,
    color: TEXT_LIGHT,
    lineHeight: 18,
    fontSize: 11,
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
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  analyticsValue: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
  },

  analyticsLabel: {
    marginTop: 6,
    color: TEXT_LIGHT,
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
    borderWidth: 1,
    borderColor: BORDER,
  },

  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 20,
    backgroundColor:
      ACCENT,
    marginRight: 14,
  },

  activityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT_DARK,
  },

  activityTime: {
    marginTop: 4,
    color: TEXT_LIGHT,
    fontSize: 11,
  },
});