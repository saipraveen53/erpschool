// app/admin/transport/routes.tsx

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
  Route,
  Search,
  Filter,
  Plus,
  MapPinned,
  Navigation,
  Bus,
  Users,
  Clock3,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Activity,
  Bell,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TimerReset,
  Fuel,
  LocateFixed,
  Map,
  Wifi,
  ScanSearch,
  BarChart3,
  Radar,
  CarFront,
  Gauge,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const DARK = "#7C2D12";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function TransportRoutesPage() {
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
            Smart Route Management
          </Text>

          <Text style={styles.subheading}>
            AI powered transport route planning and GPS tracking
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              Create Route
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
            Intelligent Route Optimization
          </Text>

          <Text style={styles.heroSubtitle}>
            Smart routing with live GPS and optimized pickup timing
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Open Smart Map
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <Route
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeValue}>
            24
          </Text>

          <Text style={styles.heroBadgeLabel}>
            Active Routes
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search routes..."
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
          <MapPinned
            size={26}
            color={PRIMARY}
          />

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
            { backgroundColor: "#dcfce7" },
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
            Assigned Buses
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
          <Clock3
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsValue}>
            98%
          </Text>

          <Text style={styles.statsLabel}>
            On-Time
          </Text>
        </View>
      </View>

      {/* MODULES */}

      <Text style={styles.sectionTitle}>
        Smart Modules
      </Text>

      <View style={styles.modulesGrid}>
        <TouchableOpacity style={styles.moduleCard}>
          <View style={styles.moduleIcon}>
            <Navigation
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            GPS Navigation
          </Text>

          <Text style={styles.moduleDesc}>
            Live route tracking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: DARK },
            ]}
          >
            <Radar
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Live Monitoring
          </Text>

          <Text style={styles.moduleDesc}>
            Smart tracking alerts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard}>
          <View
            style={[
              styles.moduleIcon,
              { backgroundColor: "#92400E" },
            ]}
          >
            <Fuel
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Fuel Optimization
          </Text>

          <Text style={styles.moduleDesc}>
            AI fuel saving
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIVE STATS */}

      <Text style={styles.sectionTitle}>
        Route Intelligence
      </Text>

      <View style={styles.liveContainer}>
        <View style={styles.liveCard}>
          <LocateFixed
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.liveValue}>
            18
          </Text>

          <Text style={styles.liveLabel}>
            Live Tracking
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
      </View>

      {/* ROUTES */}

      <Text style={styles.sectionTitle}>
        Route Directory
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.routeCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <Route
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Route A - North Zone
              </Text>

              <Text style={styles.cardInfo}>
                42 Stops • ETA 35 mins
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.routeCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <Map
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Route B - East Zone
              </Text>

              <Text style={styles.cardInfo}>
                GPS Active • Fuel Optimized
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.routeCard}>
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <CarFront
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Route C - South Zone
              </Text>

              <Text style={styles.cardInfo}>
                38 Stops • Smart Route
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
            Export Routes
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
          <ScanSearch
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Scan Traffic
          </Text>

          <Text style={styles.quickDesc}>
            AI traffic analysis
          </Text>
        </TouchableOpacity>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Route Analytics
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
            Accuracy
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <BarChart3
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            +12%
          </Text>

          <Text style={styles.analyticsLabel}>
            Efficiency
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
            Delay Alerts
          </Text>
        </View>
      </View>

      {/* SAFETY */}

      <Text style={styles.sectionTitle}>
        Safety & Monitoring
      </Text>

      <View style={styles.aiContainer}>
        <TouchableOpacity style={styles.aiCard}>
          <ShieldCheck
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Student Safety
          </Text>

          <Text style={styles.aiDesc}>
            Smart monitoring
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <CheckCircle2
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Verified Stops
          </Text>

          <Text style={styles.aiDesc}>
            Stop validation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aiCard}>
          <AlertTriangle
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.aiTitle}>
            Emergency Alerts
          </Text>

          <Text style={styles.aiDesc}>
            Real-time alerts
          </Text>
        </TouchableOpacity>
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
              Route A optimized successfully
            </Text>

            <Text style={styles.activityTime}>
              12 mins ago
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
              Traffic congestion rerouted
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
              Route C delayed by weather
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

  listContainer: {
    marginBottom: 24,
  },

  routeCard: {
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