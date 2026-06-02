// app/admin/fees/receipts.tsx

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
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Users,
  FileText,
  Filter,
  Share2,
  Eye,
  Wallet,
  CreditCard,
  Smartphone,
  CalendarDays,
} from "lucide-react-native";

export default function ReceiptsPage() {
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
            Receipt Management
          </Text>

          <Text style={styles.subheading}>
            Generate and manage fee receipts
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.createButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.createButtonText}>
              New Receipt
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search receipt or student..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#A0522D" />
        </TouchableOpacity>
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Digital Receipt System
          </Text>

          <Text style={styles.heroSubtitle}>
            Secure fee receipt generation and sharing
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroMiniCard}>
              <Receipt
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                5,240 Receipts
              </Text>
            </View>

            <View style={styles.heroMiniCard}>
              <IndianRupee
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                ₹24.5L Processed
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.heroButton}>
          <Download
            size={16}
            color="#fff"
          />

          <Text style={styles.heroButtonText}>
            Export PDF
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
          <Receipt
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            5,240
          </Text>

          <Text style={styles.statsLabel}>
            Total Receipts
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
            4,980
          </Text>

          <Text style={styles.statsLabel}>
            Generated
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Clock3
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            260
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
          <Users
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            1,120
          </Text>

          <Text style={styles.statsLabel}>
            Students
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Printer
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Print
          </Text>

          <Text style={styles.actionDesc}>
            Print receipt
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Share2
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Share
          </Text>

          <Text style={styles.actionDesc}>
            Send receipt
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Eye size={26} color="#A0522D" />

          <Text style={styles.actionTitle}>
            Preview
          </Text>

          <Text style={styles.actionDesc}>
            View receipt
          </Text>
        </TouchableOpacity>
      </View>

      {/* RECEIPTS */}

      <Text style={styles.sectionTitle}>
        Recent Receipts
      </Text>

      <View style={styles.receiptList}>
        <View style={styles.receiptCard}>
          <View style={styles.receiptLeft}>
            <View style={styles.iconBox}>
              <CreditCard
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.studentName}>
                Rahul Sharma
              </Text>

              <Text style={styles.receiptInfo}>
                Tuition Fee • RF1024
              </Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.amount}>
              ₹18,500
            </Text>

            <View style={styles.successBadge}>
              <Text style={styles.successText}>
                Generated
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.receiptCard}>
          <View style={styles.receiptLeft}>
            <View style={styles.iconBox}>
              <Wallet
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.studentName}>
                Priya Patel
              </Text>

              <Text style={styles.receiptInfo}>
                Transport Fee • RF1025
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

      {/* CATEGORIES */}

      <Text style={styles.sectionTitle}>
        Receipt Categories
      </Text>

      <View style={styles.categoryContainer}>
        <View style={styles.categoryCard}>
          <Wallet
            size={26}
            color="#A0522D"
          />

          <Text style={styles.categoryTitle}>
            Tuition
          </Text>

          <Text style={styles.categoryValue}>
            52%
          </Text>
        </View>

        <View style={styles.categoryCard}>
          <CalendarDays
            size={26}
            color="#A0522D"
          />

          <Text style={styles.categoryTitle}>
            Transport
          </Text>

          <Text style={styles.categoryValue}>
            28%
          </Text>
        </View>

        <View style={styles.categoryCard}>
          <FileText
            size={26}
            color="#A0522D"
          />

          <Text style={styles.categoryTitle}>
            Exams
          </Text>

          <Text style={styles.categoryValue}>
            20%
          </Text>
        </View>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Receipt Analytics
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            98%
          </Text>

          <Text style={styles.analyticsLabel}>
            Delivery
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            ₹24.5L
          </Text>

          <Text style={styles.analyticsLabel}>
            Verified
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            5.2K
          </Text>

          <Text style={styles.analyticsLabel}>
            Downloads
          </Text>
        </View>
      </View>

      {/* ACTIVITY */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <Receipt
            size={20}
            color="#15803D"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              240 receipts generated
            </Text>

            <Text style={styles.activityTime}>
              2 hours ago
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <Share2
            size={20}
            color="#A0522D"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Receipts shared
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

  createButton: {
    backgroundColor: "#A0522D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  createButtonText: {
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

  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F5DC",
    justifyContent: "center",
    alignItems: "center",
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

  receiptList: {
    marginBottom: 24,
  },

  receiptCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  receiptLeft: {
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

  receiptInfo: {
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

  successBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },

  successText: {
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

  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  categoryCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
  },

  categoryTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  categoryValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "900",
    color: "#A0522D",
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