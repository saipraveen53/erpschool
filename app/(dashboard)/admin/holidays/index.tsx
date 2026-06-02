// app/admin/holidays/index.tsx

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
  Bell,
  Download,
  Upload,
  Sparkles,
  ChevronRight,
  Filter,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Activity,
  PartyPopper,
  School,
  CalendarCheck,
  Briefcase,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function HolidaysPage() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          padding: isMobile ? 14 : 18,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Holiday Management
          </Text>

          <Text style={styles.subheading}>
            Manage school holidays and academic calendar updates
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={15} color="#fff" />

            <Text style={styles.addButtonText}>
              Add Holiday
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles
            size={isMobile ? 26 : 30}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            Smart Holiday Planner
          </Text>

          <Text style={styles.heroSubtitle}>
            Organize academic holidays and events with smart scheduling
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              View Calendar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <CalendarDays
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeText}>
            28 Holidays
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={16} color="#6B7280" />

        <TextInput
          placeholder="Search holidays..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={14} color={PRIMARY} />
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
          <CalendarCheck
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            28
          </Text>

          <Text style={styles.statLabel}>
            Total Holidays
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <CheckCircle2
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            18
          </Text>

          <Text style={styles.statLabel}>
            Approved Holidays
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Clock3 size={24} color={PRIMARY} />

          <Text style={styles.statValue}>
            4
          </Text>

          <Text style={styles.statLabel}>
            Upcoming Events
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <Users size={24} color={PRIMARY} />

          <Text style={styles.statValue}>
            1.2K
          </Text>

          <Text style={styles.statLabel}>
            Students Impacted
          </Text>
        </View>
      </View>

      {/* HOLIDAY MODULES */}

      <Text style={styles.sectionTitle}>
        Holiday Categories
      </Text>

      <View style={styles.moduleGrid}>
        <TouchableOpacity style={styles.moduleCard}>
          <View style={styles.moduleIcon}>
            <PartyPopper
              size={22}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Festival Holidays
          </Text>

          <Text style={styles.moduleDesc}>
            National and cultural events
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: "#7C2D12" },
            ]}
          >
            <School
              size={22}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Academic Breaks
          </Text>

          <Text style={styles.moduleDesc}>
            Semester and exam vacations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: "#92400E" },
            ]}
          >
            <Briefcase
              size={22}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Staff Holidays
          </Text>

          <Text style={styles.moduleDesc}>
            Faculty leave schedules
          </Text>
        </TouchableOpacity>
      </View>

      {/* UPCOMING HOLIDAYS */}

      <Text style={styles.sectionTitle}>
        Upcoming Holidays
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.holidayCard}>
          <View style={styles.holidayLeft}>
            <View style={styles.iconBox}>
              <CalendarDays
                size={18}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.holidayName}>
                Independence Day
              </Text>

              <Text style={styles.holidayInfo}>
                15 August 2026
              </Text>
            </View>
          </View>

          <ChevronRight
            size={16}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.holidayCard}>
          <View style={styles.holidayLeft}>
            <View style={styles.iconBox}>
              <PartyPopper
                size={18}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.holidayName}>
                Diwali Vacation
              </Text>

              <Text style={styles.holidayInfo}>
                8 November 2026
              </Text>
            </View>
          </View>

          <ChevronRight
            size={16}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.holidayCard}>
          <View style={styles.holidayLeft}>
            <View style={styles.iconBox}>
              <School
                size={18}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.holidayName}>
                Winter Break
              </Text>

              <Text style={styles.holidayInfo}>
                24 December 2026
              </Text>
            </View>
          </View>

          <ChevronRight
            size={16}
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
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Export Calendar
          </Text>

          <Text style={styles.quickDesc}>
            Download holiday schedules
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Upload
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Upload Events
          </Text>

          <Text style={styles.quickDesc}>
            Import holiday calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Bell
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Notify Students
          </Text>

          <Text style={styles.quickDesc}>
            Send holiday reminders
          </Text>
        </TouchableOpacity>
      </View>

      {/* INSIGHTS */}

      <Text style={styles.sectionTitle}>
        Holiday Insights
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Activity
            size={20}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            28
          </Text>

          <Text style={styles.analyticsLabel}>
            Events Planned
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <CalendarDays
            size={20}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            180
          </Text>

          <Text style={styles.analyticsLabel}>
            Academic Days
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <AlertTriangle
            size={20}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            2
          </Text>

          <Text style={styles.analyticsLabel}>
            Conflicts Found
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
              Holiday calendar updated
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
              Festival notice published
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
              Winter vacation updated
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
    paddingBottom: 70,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 12,
    maxWidth: 480,
  },

  addButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroLeft: {
    flex: 1,
    paddingRight: 8,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 10,
  },

  heroSubtitle: {
    color: "#F5F5DC",
    marginTop: 6,
    lineHeight: 18,
    fontSize: 11,
  },

  heroButton: {
    marginTop: 14,
    backgroundColor: "#7A3B1A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },

  heroBadge: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 18,
    alignItems: "center",
  },

  heroBadgeText: {
    marginTop: 6,
    fontWeight: "800",
    color: PRIMARY,
    fontSize: 11,
  },

  searchContainer: {
    backgroundColor: CARD,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
  },

  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  statCard: {
    width: "48%",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    marginTop: 10,
  },

  statLabel: {
    marginTop: 5,
    fontSize: 10,
    color: "#6B7280",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 14,
  },

  moduleGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  moduleCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 12,
  },

  moduleIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  moduleTitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },

  moduleDesc: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 15,
  },

  listContainer: {
    marginBottom: 22,
  },

  holidayCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  holidayLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  holidayName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },

  holidayInfo: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 10,
  },

  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  quickCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 12,
  },

  quickTitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },

  quickDesc: {
    marginTop: 5,
    color: "#6B7280",
    lineHeight: 15,
    fontSize: 10,
  },

  analyticsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },

  analyticsValue: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
  },

  analyticsLabel: {
    marginTop: 5,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 10,
  },

  activityContainer: {
    marginBottom: 70,
  },

  activityCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    marginRight: 12,
  },

  activityTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },

  activityTime: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 10,
  },
});