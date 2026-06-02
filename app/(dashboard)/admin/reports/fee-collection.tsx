 // app/admin/reports/fee-collection.tsx

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
  Search,
  Plus,
  IndianRupee,
  Wallet,
  TrendingUp,
  Users,
  Bell,
  Download,
  Upload,
  PieChart,
  BarChart3,
  CreditCard,
  Receipt,
  Sparkles,
  ChevronRight,
  Filter,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function FeeCollectionReportsPage() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            Fee Collection Reports
          </Text>

          <Text style={styles.subheading}>
            Smart fee analytics and financial performance monitoring
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Plus size={18} color="#fff" />

          <Text style={styles.addButtonText}>
            Generate Report
          </Text>
        </TouchableOpacity>
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles size={42} color="#fff" />

          <Text style={styles.heroTitle}>
            Financial Intelligence
          </Text>

          <Text style={styles.heroSubtitle}>
            Track collections, pending fees and school revenue in real-time
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              View Insights
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <IndianRupee
            size={32}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeText}>
            ₹24L Collected
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" />

        <TextInput
          placeholder="Search financial reports..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={18} color={PRIMARY} />
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
          <Wallet size={34} color={PRIMARY} />

          <Text style={styles.statValue}>
            ₹24L
          </Text>

          <Text style={styles.statLabel}>
            Total Collection
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <CheckCircle2
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            92%
          </Text>

          <Text style={styles.statLabel}>
            Fee Completion
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <AlertTriangle
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            ₹2.4L
          </Text>

          <Text style={styles.statLabel}>
            Pending Fees
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <TrendingUp
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            +18%
          </Text>

          <Text style={styles.statLabel}>
            Revenue Growth
          </Text>
        </View>
      </View>

      {/* REPORT MODULES */}

      <Text style={styles.sectionTitle}>
        Financial Modules
      </Text>

      <View style={styles.moduleGrid}>
        <TouchableOpacity style={styles.moduleCard}>
          <View style={styles.moduleIcon}>
            <PieChart
              size={32}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Collection Analytics
          </Text>

          <Text style={styles.moduleDesc}>
            Analyze payment trends
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
              size={32}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Revenue Reports
          </Text>

          <Text style={styles.moduleDesc}>
            Monitor income growth
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
              size={32}
              color="#fff"
            />
          </View>

          <Text style={styles.moduleTitle}>
            Payment Insights
          </Text>

          <Text style={styles.moduleDesc}>
            Smart fee intelligence
          </Text>
        </TouchableOpacity>
      </View>

      {/* RECENT PAYMENTS */}

      <Text style={styles.sectionTitle}>
        Recent Collections
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.paymentCard}>
          <View style={styles.paymentLeft}>
            <View style={styles.iconBox}>
              <CreditCard
                size={22}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.paymentName}>
                Rahul Sharma
              </Text>

              <Text style={styles.paymentInfo}>
                Grade 10 • ₹45,000 Paid
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentCard}>
          <View style={styles.paymentLeft}>
            <View style={styles.iconBox}>
              <Receipt
                size={22}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.paymentName}>
                Priya Patel
              </Text>

              <Text style={styles.paymentInfo}>
                Grade 9 • ₹38,000 Paid
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentCard}>
          <View style={styles.paymentLeft}>
            <View style={styles.iconBox}>
              <IndianRupee
                size={22}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.paymentName}>
                Aryan Gupta
              </Text>

              <Text style={styles.paymentInfo}>
                Grade 8 • ₹40,000 Paid
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
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
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Export Reports
          </Text>

          <Text style={styles.quickDesc}>
            Download collection reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Upload
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Upload Records
          </Text>

          <Text style={styles.quickDesc}>
            Import payment records
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Bell
            size={34}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Payment Alerts
          </Text>

          <Text style={styles.quickDesc}>
            Notify pending payments
          </Text>
        </TouchableOpacity>
      </View>

      {/* INSIGHTS */}

      <Text style={styles.sectionTitle}>
        Financial Insights
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <TrendingUp
            size={30}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            +18%
          </Text>

          <Text style={styles.analyticsLabel}>
            Revenue Growth
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <CalendarDays
            size={30}
            color={PRIMARY}
          />

          <Text style={styles.analyticsValue}>
            ₹24L
          </Text>

          <Text style={styles.analyticsLabel}>
            Monthly Collection
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Users size={30} color={PRIMARY} />

          <Text style={styles.analyticsValue}>
            1.1K
          </Text>

          <Text style={styles.analyticsLabel}>
            Paid Students
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
              Grade 10 collection report generated
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
              Pending fee reminders sent
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
              Revenue analytics updated
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
    padding: 24,
    paddingBottom: 80,
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
  },

  heroButton: {
    marginTop: 22,
    backgroundColor: "#7A3B1A",
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
    padding: 22,
    borderRadius: 24,
    alignItems: "center",
  },

  heroBadgeText: {
    marginTop: 10,
    fontWeight: "800",
    color: PRIMARY,
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

  statCard: {
    width: "48%",
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
  },

  statValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#111827",
    marginTop: 16,
  },

  statLabel: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 20,
  },

  moduleGrid: {
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
  },

  listContainer: {
    marginBottom: 34,
  },

  paymentCard: {
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  paymentLeft: {
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

  paymentName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  paymentInfo: {
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

  activityContainer: {
    marginBottom: 80,
  },

  activityCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  activityDot: {
    width: 14,
    height: 14,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    marginRight: 16,
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
