// app/admin/fees/index.tsx

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
  IndianRupee,
  Search,
  Plus,
  Wallet,
  CreditCard,
  CircleDollarSign,
  TrendingUp,
  Users,
  Clock3,
  Receipt,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  ArrowUpRight,
  BarChart3,
} from "lucide-react-native";

export default function FeesDashboard() {
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
      {/* HEADER */}

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Fees Management
          </Text>

          <Text style={styles.subheading}>
            Manage fee collection, dues and payments
          </Text>
        </View>

        {/* SHOW ONLY ON DESKTOP */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              Add Payment
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search student or receipt..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Monthly Collection Overview
          </Text>

          <Text style={styles.heroSubtitle}>
            Total collection and pending fee analytics for June 2026
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroMiniCard}>
              <Wallet size={16} color="#A0522D" />

              <Text style={styles.heroMiniText}>
                ₹24.5L Collected
              </Text>
            </View>

            <View style={styles.heroMiniCard}>
              <Clock3 size={16} color="#A0522D" />

              <Text style={styles.heroMiniText}>
                ₹3.2L Pending
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.heroButton}>
          <BarChart3 size={16} color="#fff" />

          <Text style={styles.heroButtonText}>
            View Reports
          </Text>
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
          <IndianRupee size={28} color="#A0522D" />

          <Text style={styles.statsNumber}>
            ₹24.5L
          </Text>

          <Text style={styles.statsLabel}>
            Collection
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <CheckCircle2
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            1,120
          </Text>

          <Text style={styles.statsLabel}>
            Fees Paid
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <AlertTriangle
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            120
          </Text>

          <Text style={styles.statsLabel}>
            Pending
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <TrendingUp
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            +18%
          </Text>

          <Text style={styles.statsLabel}>
            Growth
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <CreditCard
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Collect Fees
          </Text>

          <Text style={styles.actionDesc}>
            Add fee payment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Receipt size={26} color="#A0522D" />

          <Text style={styles.actionTitle}>
            Receipts
          </Text>

          <Text style={styles.actionDesc}>
            Generate receipt
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Download size={26} color="#A0522D" />

          <Text style={styles.actionTitle}>
            Reports
          </Text>

          <Text style={styles.actionDesc}>
            Download reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* TRANSACTIONS */}

      <Text style={styles.sectionTitle}>
        Recent Transactions
      </Text>

      <View style={styles.transactionList}>
        {/* CARD */}

        <View style={styles.transactionCard}>
          <View style={styles.transactionLeft}>
            <View style={styles.iconBox}>
              <CircleDollarSign
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.studentName}>
                Rahul Sharma
              </Text>

              <Text style={styles.paymentInfo}>
                Tuition Fee • Class 10-A
              </Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.amount}>
              ₹18,500
            </Text>

            <View style={styles.paidBadge}>
              <Text style={styles.paidText}>
                Paid
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionCard}>
          <View style={styles.transactionLeft}>
            <View style={styles.iconBox}>
              <Users size={20} color="#A0522D" />
            </View>

            <View>
              <Text style={styles.studentName}>
                Priya Patel
              </Text>

              <Text style={styles.paymentInfo}>
                Transport Fee • Class 9-B
              </Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.amount}>
              ₹8,200
            </Text>

            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>
                Pending
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Fee Analytics
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            ₹3.2L
          </Text>

          <Text style={styles.analyticsLabel}>
            Pending
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            92%
          </Text>

          <Text style={styles.analyticsLabel}>
            Collection
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            +18%
          </Text>

          <Text style={styles.analyticsLabel}>
            Growth
          </Text>
        </View>
      </View>

      {/* ACTIVITY */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <ArrowUpRight
            size={20}
            color="#15803D"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Payment received from Class 10
            </Text>

            <Text style={styles.activityTime}>
              2 hours ago
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <Receipt size={20} color="#A0522D" />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              240 receipts generated today
            </Text>

            <Text style={styles.activityTime}>
              Today
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
    backgroundColor: "#F5F5DC",
  },

  content: {
    paddingBottom: 80,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: "#A0522D",
  },

  subheading: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },

  addButton: {
    backgroundColor: "#A0522D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },

  searchContainer: {
    backgroundColor: "#fff",
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
    fontSize: 14,
  },

  heroCard: {
    backgroundColor: "#A0522D",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },

  heroContent: {
    marginBottom: 16,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  heroSubtitle: {
    marginTop: 8,
    color: "#F5F5DC",
    fontSize: 13,
    lineHeight: 20,
  },

  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
  },

  heroMiniCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  heroMiniText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#111827",
  },

  heroButton: {
    backgroundColor: "#7C2D12",
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statsCard: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  statsNumber: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
    color: "#111827",
  },

  statsLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#A0522D",
    marginBottom: 14,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  actionCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: "center",
  },

  actionTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  actionDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
  },

  transactionList: {
    marginBottom: 24,
  },

  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F5F5DC",
    justifyContent: "center",
    alignItems: "center",
  },

  studentName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  paymentInfo: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  rightSection: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 14,
    fontWeight: "900",
    color: "#A0522D",
  },

  paidBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },

  paidText: {
    color: "#15803D",
    fontWeight: "700",
    fontSize: 11,
  },

  pendingBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },

  pendingText: {
    color: "#B45309",
    fontWeight: "700",
    fontSize: 11,
  },

  analyticsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
  },

  analyticsValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#A0522D",
  },

  analyticsLabel: {
    marginTop: 6,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 11,
  },

  activityContainer: {
    marginBottom: 50,
  },

  activityCard: {
    backgroundColor: "#fff",
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
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  activityTime: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },
});