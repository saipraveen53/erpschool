// app/admin/transport/tracking.tsx

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
  MapPinned,
  LocateFixed,
  Radar,
  Navigation,
  Users,
  ShieldCheck,
  Wifi,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Sparkles,
  Route,
  Gauge,
  Fuel,
  BatteryCharging,
  Camera,
  ScanSearch,
  Download,
  ChevronRight,
  ArrowUpRight,
  TimerReset,
  CarFront,
  Map,
  Satellite,
  Plus,
  Eye,
  Siren,
  Cpu,
  BarChart3,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const DARK = "#7C2D12";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function TransportTrackingPage() {
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
            Live Transport Tracking
          </Text>

          <Text style={styles.subheading}>
            Real-time GPS tracking and smart route monitoring
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              Track Vehicle
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
            AI Powered Tracking
          </Text>

          <Text style={styles.heroSubtitle}>
            Smart satellite monitoring with predictive ETA tracking
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Open Command Center
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <Satellite
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeValue}>
            29
          </Text>

          <Text style={styles.heroBadgeLabel}>
            Vehicles Online
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
          <LocateFixed
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            29
          </Text>

          <Text style={styles.statsLabel}>
            Live Tracking
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <Route
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            24
          </Text>

          <Text style={styles.statsLabel}>
            Routes
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
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

      {/* FEATURES */}

      <Text style={styles.sectionTitle}>
        Smart Features
      </Text>

      <View style={styles.modulesGrid}>
        <TouchableOpacity style={styles.moduleCard}>
          <View style={styles.moduleIcon}>
            <Radar
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Live Radar
          </Text>

          <Text style={styles.moduleDesc}>
            Real-time monitoring
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: DARK },
            ]}
          >
            <Navigation
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Smart Navigation
          </Text>

          <Text style={styles.moduleDesc}>
            AI route guidance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: "#92400E" },
            ]}
          >
            <Camera
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            CCTV Monitoring
          </Text>

          <Text style={styles.moduleDesc}>
            Smart surveillance
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIVE INTELLIGENCE */}

      <Text style={styles.sectionTitle}>
        Fleet Intelligence
      </Text>

      <View style={styles.liveContainer}>
        <View style={styles.liveCard}>
          <Wifi
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.liveValue}>
            100%
          </Text>

          <Text style={styles.liveLabel}>
            GPS Connected
          </Text>
        </View>

        <View style={styles.liveCard}>
          <Gauge
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.liveValue}>
            64km/h
          </Text>

          <Text style={styles.liveLabel}>
            Avg Speed
          </Text>
        </View>

        <View style={styles.liveCard}>
          <Fuel
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.liveValue}>
            91%
          </Text>

          <Text style={styles.liveLabel}>
            Fuel Efficiency
          </Text>
        </View>
      </View>

      {/* MAP */}

      <Text style={styles.sectionTitle}>
        Live Tracking Feed
      </Text>

      <View style={styles.mapCard}>
        <View style={styles.mapTop}>
          <View>
            <Text style={styles.mapTitle}>
              Smart GPS Monitoring
            </Text>

            <Text style={styles.mapSubtitle}>
              AI tracking enabled
            </Text>
          </View>

          <TouchableOpacity style={styles.liveBadge}>
            <Activity size={14} color="#fff" />

            <Text style={styles.liveBadgeText}>
              LIVE
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapArea}>
          <Map
            size={70}
            color={PRIMARY}
          />

          <Text style={styles.mapAreaTitle}>
            Real-Time Monitoring
          </Text>

          <Text style={styles.mapAreaDesc}>
            Smart GPS tracking and predictive analytics
          </Text>
        </View>
      </View>

      {/* VEHICLES */}

      <Text style={styles.sectionTitle}>
        Active Vehicles
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
                EDX-102 • Route A
              </Text>

              <Text style={styles.cardInfo}>
                ETA 8 mins • 42 Students
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
              <Navigation
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                EDX-205 • Route C
              </Text>

              <Text style={styles.cardInfo}>
                Smart Navigation Enabled
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
                EDX-308 • Route F
              </Text>

              <Text style={styles.cardInfo}>
                Safe Arrival Confirmed
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
        Smart Actions
      </Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.quickCard}>
          <Bell
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Send Alerts
          </Text>

          <Text style={styles.quickDesc}>
            Notify transport staff
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
            Download analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <ScanSearch
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Smart Scanning
          </Text>

          <Text style={styles.quickDesc}>
            AI traffic analysis
          </Text>
        </TouchableOpacity>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        AI Analytics
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <BarChart3
            size={24}
            color="#16A34A"
          />

          <Text style={styles.analyticsValue}>
            98%
          </Text>

          <Text style={styles.analyticsLabel}>
            Accuracy
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <BatteryCharging
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            88%
          </Text>

          <Text style={styles.analyticsLabel}>
            Health
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <TimerReset
            size={24}
            color="#DC2626"
          />

          <Text style={styles.analyticsValue}>
            3
          </Text>

          <Text style={styles.analyticsLabel}>
            Delay Warnings
          </Text>
        </View>
      </View>

      {/* SAFETY */}

      <Text style={styles.sectionTitle}>
        AI Safety Center
      </Text>

      <View style={styles.aiContainer}>
        <TouchableOpacity style={styles.aiCard}>
          <Eye
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Surveillance
          </Text>

          <Text style={styles.aiDesc}>
            Intelligent monitoring
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <Siren
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Emergency Alerts
          </Text>

          <Text style={styles.aiDesc}>
            Instant communication
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <Cpu
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            AI Intelligence
          </Text>

          <Text style={styles.aiDesc}>
            Smart transport analytics
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACTIVITY */}

      <Text style={styles.sectionTitle}>
        Activity Feed
      </Text>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <CheckCircle2
            size={20}
            color="#16A34A"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Bus safely reached destination
            </Text>

            <Text style={styles.activityTime}>
              10 mins ago
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
              Route rerouted due to traffic
            </Text>

            <Text style={styles.activityTime}>
              Today
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <AlertTriangle
            size={20}
            color="#DC2626"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Speed alert detected
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

  liveContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  liveCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  liveValue: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
  },

  liveLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  mapCard: {
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 16,
    marginBottom: 24,
  },

  mapTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  mapTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },

  mapSubtitle: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4,
  },

  liveBadgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 10,
  },

  mapArea: {
    height: 220,
    borderRadius: 20,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  mapAreaTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
  },

  mapAreaDesc: {
    marginTop: 8,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    fontSize: 11,
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