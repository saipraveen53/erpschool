 // app/admin/transport/index.tsx

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  Bus,
  Route,
  MapPinned,
  Users,
  Fuel,
  Search,
  Filter,
  Plus,
  Activity,
  ShieldCheck,
  Clock3,
  Bell,
  Download,
  ChevronRight,
  Sparkles,
  Wifi,
  CarFront,
  BatteryCharging,
  ScanLine,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  Navigation,
  CalendarClock,
  UserCheck,
  Wrench,
  Truck,
  TimerReset,
  BarChart3,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const DARK = "#7C2D12";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function TransportDashboard() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HEADER ================= */}

      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            Smart Transport Hub
          </Text>

          <Text style={styles.subheading}>
            Intelligent fleet monitoring, GPS tracking, student safety and
            transport analytics
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Plus size={18} color="#fff" />

          <Text style={styles.addButtonText}>
            Add Vehicle
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= HERO ================= */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles size={42} color="#fff" />

          <Text style={styles.heroTitle}>
            AI Powered Transport System
          </Text>

          <Text style={styles.heroSubtitle}>
            Live GPS monitoring, RFID attendance, fuel optimization and smart
            route intelligence for safer school transportation
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Open Fleet Console
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <Truck size={36} color={PRIMARY} />

          <Text style={styles.heroBadgeValue}>
            32
          </Text>

          <Text style={styles.heroBadgeLabel}>
            Active Vehicles
          </Text>
        </View>
      </View>

      {/* ================= SEARCH ================= */}

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" />

        <TextInput
          placeholder="Search buses, drivers, routes..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={18} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* ================= STATS ================= */}

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <Bus size={34} color={PRIMARY} />

          <Text style={styles.statsValue}>
            32
          </Text>

          <Text style={styles.statsLabel}>
            School Buses
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <Users size={34} color={PRIMARY} />

          <Text style={styles.statsValue}>
            1.8K
          </Text>

          <Text style={styles.statsLabel}>
            Students Assigned
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Route size={34} color={PRIMARY} />

          <Text style={styles.statsValue}>
            24
          </Text>

          <Text style={styles.statsLabel}>
            Active Routes
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <ShieldCheck
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            100%
          </Text>

          <Text style={styles.statsLabel}>
            Safety Compliance
          </Text>
        </View>
      </View>

      {/* ================= QUICK MODULES ================= */}

      <Text style={styles.sectionTitle}>
        Smart Transport Modules
      </Text>

      <View style={styles.modulesGrid}>
        <TouchableOpacity style={styles.moduleCard}>
          <View style={styles.moduleIcon}>
            <Navigation
              size={32}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Live GPS Tracking
          </Text>

          <Text style={styles.moduleDesc}>
            Monitor buses in real-time with smart route intelligence
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
              size={32}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            RFID Attendance
          </Text>

          <Text style={styles.moduleDesc}>
            Automated pickup and drop attendance system
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
              size={32}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Vehicle Maintenance
          </Text>

          <Text style={styles.moduleDesc}>
            Predictive maintenance and service scheduling
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= LIVE FLEET ================= */}

      <Text style={styles.sectionTitle}>
        Live Fleet Monitoring
      </Text>

      <View style={styles.liveContainer}>
        <View style={styles.liveCard}>
          <Wifi size={34} color={PRIMARY} />

          <Text style={styles.liveValue}>
            29
          </Text>

          <Text style={styles.liveLabel}>
            GPS Online
          </Text>
        </View>

        <View style={styles.liveCard}>
          <Gauge size={34} color={PRIMARY} />

          <Text style={styles.liveValue}>
            64km/h
          </Text>

          <Text style={styles.liveLabel}>
            Avg Speed
          </Text>
        </View>

        <View style={styles.liveCard}>
          <Fuel size={34} color={PRIMARY} />

          <Text style={styles.liveValue}>
            92%
          </Text>

          <Text style={styles.liveLabel}>
            Fuel Efficiency
          </Text>
        </View>
      </View>

      {/* ================= ACTIVE VEHICLES ================= */}

      <Text style={styles.sectionTitle}>
        Active Vehicles
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.busCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <Bus size={22} color={PRIMARY} />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                EDX-102 • Route A
              </Text>

              <Text style={styles.cardInfo}>
                Driver: Ramesh Kumar • 42 Students
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.busCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <CarFront
                size={22}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                EDX-205 • Route C
              </Text>

              <Text style={styles.cardInfo}>
                GPS Active • ETA: 12 mins
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.busCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <MapPinned
                size={22}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                EDX-308 • Route F
              </Text>

              <Text style={styles.cardInfo}>
                Pickup Completed • Safe Arrival
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
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
          <Download size={34} color={PRIMARY} />

          <Text style={styles.quickTitle}>
            Export Reports
          </Text>

          <Text style={styles.quickDesc}>
            Download transport analytics and reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Bell size={34} color={PRIMARY} />

          <Text style={styles.quickTitle}>
            Send Alerts
          </Text>

          <Text style={styles.quickDesc}>
            Notify parents and transport staff instantly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <CalendarClock
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Schedule Service
          </Text>

          <Text style={styles.quickDesc}>
            Plan maintenance and inspections automatically
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= SMART ANALYTICS ================= */}

      <Text style={styles.sectionTitle}>
        Transport Analytics
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Activity size={30} color="#16A34A" />

          <Text style={styles.analyticsValue}>
            98%
          </Text>

          <Text style={styles.analyticsLabel}>
            On-Time Arrival
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <BatteryCharging
            size={30}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            88%
          </Text>

          <Text style={styles.analyticsLabel}>
            Fleet Health
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <TimerReset
            size={30}
            color="#DC2626"
          />

          <Text style={styles.analyticsValue}>
            4
          </Text>

          <Text style={styles.analyticsLabel}>
            Service Pending
          </Text>
        </View>
      </View>

      {/* ================= AI INSIGHTS ================= */}

      <Text style={styles.sectionTitle}>
        AI Safety Insights
      </Text>

      <View style={styles.aiContainer}>
        <TouchableOpacity style={styles.aiCard}>
          <ShieldCheck
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Safety Detection
          </Text>

          <Text style={styles.aiDesc}>
            Monitor unsafe driving patterns automatically
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <UserCheck
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Student Verification
          </Text>

          <Text style={styles.aiDesc}>
            Smart boarding and drop verification system
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <BarChart3
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Smart Analytics
          </Text>

          <Text style={styles.aiDesc}>
            Deep transport performance insights and trends
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= RECENT ACTIVITY ================= */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <CheckCircle2
            size={24}
            color="#16A34A"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Bus EDX-102 completed morning route successfully
            </Text>

            <Text style={styles.activityTime}>
              15 mins ago
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <ArrowUpRight
            size={24}
            color="#B45309"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Fuel efficiency increased by 8% this month
            </Text>

            <Text style={styles.activityTime}>
              Today
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <AlertTriangle
            size={24}
            color="#DC2626"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Bus EDX-205 maintenance due in 2 days
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
    padding: 24,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 28,
  },

  heading: {
    fontSize: 40,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 16,
    maxWidth: 620,
  },

  addButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 30,
    padding: 28,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  heroLeft: {
    maxWidth: "70%",
  },

  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 14,
  },

  heroSubtitle: {
    color: "#F5F5DC",
    marginTop: 10,
    lineHeight: 24,
    fontSize: 15,
  },

  heroButton: {
    marginTop: 22,
    backgroundColor: DARK,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    alignSelf: "flex-start",
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  heroBadge: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
  },

  heroBadgeValue: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: "900",
    color: PRIMARY,
  },

  heroBadgeLabel: {
    marginTop: 6,
    color: "#6B7280",
  },

  searchContainer: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },

  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  statsCard: {
    width: "48%",
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
  },

  statsValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#111827",
    marginTop: 16,
  },

  statsLabel: {
    marginTop: 8,
    color: "#6B7280",
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 20,
  },

  modulesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 34,
  },

  moduleCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 18,
  },

  moduleIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  moduleTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  moduleDesc: {
    marginTop: 8,
    color: "#6B7280",
    lineHeight: 22,
  },

  liveContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 34,
  },

  liveCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: "center",
  },

  liveValue: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: "900",
    color: PRIMARY,
  },

  liveLabel: {
    marginTop: 8,
    color: "#6B7280",
  },

  listContainer: {
    marginBottom: 34,
  },

  busCard: {
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  cardInfo: {
    marginTop: 6,
    color: "#6B7280",
  },

  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 34,
  },

  quickCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 24,
  },

  quickTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  quickDesc: {
    marginTop: 8,
    color: "#6B7280",
    lineHeight: 22,
  },

  analyticsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 34,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: "center",
  },

  analyticsValue: {
    marginTop: 14,
    fontSize: 30,
    fontWeight: "900",
    color: PRIMARY,
  },

  analyticsLabel: {
    marginTop: 8,
    color: "#6B7280",
    textAlign: "center",
  },

  aiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 34,
  },

  aiCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 24,
  },

  aiTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  aiDesc: {
    marginTop: 8,
    color: "#6B7280",
    lineHeight: 22,
  },

  activityContainer: {
    marginBottom: 100,
  },

  activityCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  activityTime: {
    marginTop: 6,
    color: "#6B7280",
  },
});
