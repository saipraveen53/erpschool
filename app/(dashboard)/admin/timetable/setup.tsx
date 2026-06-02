// app/admin/timetable/set-up.tsx

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
  CalendarDays,
  Clock3,
  Users,
  School,
  BookOpen,
  Sparkles,
  Search,
  Filter,
  Bell,
  Download,
  Upload,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Activity,
  LayoutGrid,
  TimerReset,
  GraduationCap,
  ClipboardCheck,
  Plus,
  Settings2,
  Wand2,
  Layers3,
  Laptop2,
  BrainCircuit,
  Building2,
  MonitorSmartphone,
  ShieldCheck,
  Repeat,
  BookMarked,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const DARK = "#7C2D12";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function TimetableSetupPage() {
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
            Timetable Setup
          </Text>

          <Text style={styles.subheading}>
            Build intelligent schedules with smart automation
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.createButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.createButtonText}>
              Create Timetable
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* HERO SECTION */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles
            size={isMobile ? 28 : 34}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            AI Timetable Generator
          </Text>

          <Text style={styles.heroSubtitle}>
            Automatically generate optimized schedules
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Start Smart Setup
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <CalendarDays
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeValue}>
            48
          </Text>

          <Text style={styles.heroBadgeLabel}>
            Schedules
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search timetable..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* OVERVIEW STATS */}

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <LayoutGrid
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            48
          </Text>

          <Text style={styles.statsLabel}>
            Timetables
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <Users
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            86
          </Text>

          <Text style={styles.statsLabel}>
            Faculty
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <School
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            32
          </Text>

          <Text style={styles.statsLabel}>
            Classes
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <Clock3
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            8
          </Text>

          <Text style={styles.statsLabel}>
            Periods
          </Text>
        </View>
      </View>

      {/* CORE MODULES */}

      <Text style={styles.sectionTitle}>
        Core Setup Modules
      </Text>

      <View style={styles.modulesGrid}>
        <TouchableOpacity style={styles.moduleCard}>
          <View style={styles.moduleIcon}>
            <BookOpen
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Subject Allocation
          </Text>

          <Text style={styles.moduleDesc}>
            Assign subjects
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: DARK },
            ]}
          >
            <Users
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Faculty Mapping
          </Text>

          <Text style={styles.moduleDesc}>
            Link teachers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: "#92400E" },
            ]}
          >
            <Settings2
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Scheduling Rules
          </Text>

          <Text style={styles.moduleDesc}>
            Configure rules
          </Text>
        </TouchableOpacity>
      </View>

      {/* SMART FEATURES */}

      <Text style={styles.sectionTitle}>
        Smart Features
      </Text>

      <View style={styles.smartFeaturesContainer}>
        <TouchableOpacity style={styles.smartCard}>
          <BrainCircuit
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.smartTitle}>
            AI Scheduler
          </Text>

          <Text style={styles.smartDesc}>
            Generate schedules
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smartCard}>
          <Repeat
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.smartTitle}>
            Conflict Detection
          </Text>

          <Text style={styles.smartDesc}>
            Detect overlaps
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smartCard}>
          <ShieldCheck
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.smartTitle}>
            Faculty Protection
          </Text>

          <Text style={styles.smartDesc}>
            Prevent overload
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACTIVE CONFIGURATION */}

      <Text style={styles.sectionTitle}>
        Active Configurations
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.configCard}>
          <View style={styles.configLeft}>
            <View style={styles.iconBox}>
              <GraduationCap
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.configTitle}>
                Grade 10 Science
              </Text>

              <Text style={styles.configInfo}>
                8 Periods • 6 Subjects
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.configCard}>
          <View style={styles.configLeft}>
            <View style={styles.iconBox}>
              <BookMarked
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.configTitle}>
                Grade 9 Commerce
              </Text>

              <Text style={styles.configInfo}>
                Smart faculty allocation
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.configCard}>
          <View style={styles.configLeft}>
            <View style={styles.iconBox}>
              <Building2
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.configTitle}>
                Shared Lab Management
              </Text>

              <Text style={styles.configInfo}>
                Computer lab scheduling
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
          <Wand2
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Auto Generate
          </Text>

          <Text style={styles.quickDesc}>
            AI automation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Upload
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Import Timetable
          </Text>

          <Text style={styles.quickDesc}>
            Upload schedules
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Download
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Export Schedule
          </Text>

          <Text style={styles.quickDesc}>
            Download PDF
          </Text>
        </TouchableOpacity>
      </View>

      {/* ADVANCED OPTIONS */}

      <Text style={styles.sectionTitle}>
        Advanced Configuration
      </Text>

      <View style={styles.advancedContainer}>
        <View style={styles.advancedCard}>
          <MonitorSmartphone
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.advancedValue}>
            Mobile Sync
          </Text>

          <Text style={styles.advancedLabel}>
            Sync with apps
          </Text>
        </View>

        <View style={styles.advancedCard}>
          <TimerReset
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.advancedValue}>
            Auto Refresh
          </Text>

          <Text style={styles.advancedLabel}>
            Dynamic updates
          </Text>
        </View>

        <View style={styles.advancedCard}>
          <Layers3
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.advancedValue}>
            Multi-Layer
          </Text>

          <Text style={styles.advancedLabel}>
            Multiple groups
          </Text>
        </View>
      </View>

      {/* INSIGHTS */}

      <Text style={styles.sectionTitle}>
        Smart Insights
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Activity
            size={24}
            color="#16A34A"
          />

          <Text style={styles.analyticsValue}>
            98%
          </Text>

          <Text style={styles.analyticsLabel}>
            Conflict-Free
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <TimerReset
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            12min
          </Text>

          <Text style={styles.analyticsLabel}>
            Setup Time
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <AlertTriangle
            size={24}
            color="#DC2626"
          />

          <Text style={styles.analyticsValue}>
            3
          </Text>

          <Text style={styles.analyticsLabel}>
            Pending Issues
          </Text>
        </View>
      </View>

      {/* RECENT ACTIVITY */}

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
              Grade 10 timetable generated
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
              Faculty conflict resolved
            </Text>

            <Text style={styles.activityTime}>
              Today
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <AlertTriangle
            size={20}
            color="#B45309"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Lab allocation pending
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
    paddingBottom: 80,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 13,
    maxWidth: 500,
  },

  createButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  createButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 22,
    padding: 18,
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
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },

  heroSubtitle: {
    color: "#F5F5DC",
    marginTop: 8,
    lineHeight: 20,
    fontSize: 12,
  },

  heroButton: {
    marginTop: 14,
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
    padding: 14,
    borderRadius: 18,
    alignItems: "center",
  },

  heroBadgeValue: {
    marginTop: 8,
    fontSize: 20,
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
    width: 36,
    height: 36,
    borderRadius: 10,
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
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },

  statsValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    marginTop: 10,
  },

  statsLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 14,
  },

  modulesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  moduleCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 12,
  },

  moduleIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  moduleTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  moduleDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  smartFeaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  smartCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
  },

  smartTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  smartDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 18,
  },

  listContainer: {
    marginBottom: 24,
  },

  configCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  configLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  configTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  configInfo: {
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
    borderRadius: 18,
    padding: 14,
  },

  quickTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  quickDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 18,
  },

  advancedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  advancedCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  advancedValue: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "900",
    color: PRIMARY,
  },

  advancedLabel: {
    marginTop: 4,
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
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  analyticsValue: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
  },

  analyticsLabel: {
    marginTop: 4,
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
    padding: 14,
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