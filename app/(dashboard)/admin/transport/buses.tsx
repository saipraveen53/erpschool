// app/admin/transport/buses.tsx

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
  Bus,
  Search,
  Filter,
  Plus,
  Users,
  MapPinned,
  Fuel,
  ShieldCheck,
  Activity,
  Bell,
  Download,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BatteryCharging,
  UserCheck,
  Route,
  ArrowUpRight,
  Wrench,
  CalendarClock,
  ScanLine,
  Gauge,
  TimerReset,
  Wifi,
  CarFront,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const DARK = "#7C2D12";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function TransportBusesPage() {
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
            Smart Bus Management
          </Text>

          <Text style={styles.subheading}>
            Monitor buses, drivers and live transport operations
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              Add New Bus
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles
            size={isMobile ? 28 : 34}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            AI Fleet Monitoring
          </Text>

          <Text style={styles.heroSubtitle}>
            Smart tracking with fuel optimization and live monitoring
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Open Fleet
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <Bus
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeValue}>
            32
          </Text>

          <Text style={styles.heroBadgeLabel}>
            Active Buses
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search buses..."
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
            styles.statsCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <Bus
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            32
          </Text>

          <Text style={styles.statsLabel}>
            Buses
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
            1.8K
          </Text>

          <Text style={styles.statsLabel}>
            Students
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Fuel
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            92%
          </Text>

          <Text style={styles.statsLabel}>
            Efficiency
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <ShieldCheck
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            100%
          </Text>

          <Text style={styles.statsLabel}>
            Safety
          </Text>
        </View>
      </View>

      {/* MODULES */}

      <Text style={styles.sectionTitle}>
        Fleet Modules
      </Text>

      <View style={styles.modulesGrid}>
        <TouchableOpacity style={styles.moduleCard}>
          <View style={styles.moduleIcon}>
            <Route
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Route Mapping
          </Text>

          <Text style={styles.moduleDesc}>
            Smart route planning
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: DARK },
            ]}
          >
            <ScanLine
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            RFID Attendance
          </Text>

          <Text style={styles.moduleDesc}>
            Pickup tracking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: "#92400E" },
            ]}
          >
            <Wrench
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Maintenance
          </Text>

          <Text style={styles.moduleDesc}>
            Vehicle servicing
          </Text>
        </TouchableOpacity>
      </View>

      {/* AI FEATURES */}

      <Text style={styles.sectionTitle}>
        AI Intelligence
      </Text>

      <View style={styles.aiContainer}>
        <TouchableOpacity style={styles.aiCard}>
          <Gauge
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Speed Monitor
          </Text>

          <Text style={styles.aiDesc}>
            Driving analysis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <BatteryCharging
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Fuel Optimization
          </Text>

          <Text style={styles.aiDesc}>
            Smart fuel saving
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <Wifi
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            GPS Tracking
          </Text>

          <Text style={styles.aiDesc}>
            Live route updates
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACTIVE BUSES */}

      <Text style={styles.sectionTitle}>
        Active Fleet
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.busCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <Bus
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Bus #EDX-102
              </Text>

              <Text style={styles.cardInfo}>
                Route A • Driver: Ramesh
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.busCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <CarFront
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Bus #EDX-205
              </Text>

              <Text style={styles.cardInfo}>
                Route C • GPS Enabled
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.busCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <MapPinned
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Bus #EDX-308
              </Text>

              <Text style={styles.cardInfo}>
                Route F • 42 Students
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
            Download analytics
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
            Notify parents
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <CalendarClock
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Schedule Service
          </Text>

          <Text style={styles.quickDesc}>
            Maintenance planning
          </Text>
        </TouchableOpacity>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Fleet Analytics
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
            On-Time
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <TimerReset
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            12m
          </Text>

          <Text style={styles.analyticsLabel}>
            Avg Delay
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <AlertTriangle
            size={24}
            color="#DC2626"
          />

          <Text style={styles.analyticsValue}>
            2
          </Text>

          <Text style={styles.analyticsLabel}>
            Services Pending
          </Text>
        </View>
      </View>

      {/* ACTIVITY */}

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
              Bus EDX-102 completed route
            </Text>

            <Text style={styles.activityTime}>
              15 mins ago
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <UserCheck
            size={20}
            color={PRIMARY}
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              42 students marked attendance
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
              Fuel efficiency improved
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
    lineHeight: 18,
  },

  aiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  aiCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
  },

  aiTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  aiDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 18,
  },

  listContainer: {
    marginBottom: 24,
  },

  busCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLeft: {
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