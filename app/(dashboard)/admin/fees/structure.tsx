// app/admin/fees/structure.tsx

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
  IndianRupee,
  Layers3,
  GraduationCap,
  Bus,
  BookOpen,
  FileText,
  Users,
  CheckCircle2,
  Clock3,
  Download,
  Upload,
  Filter,
  Wallet,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react-native";

export default function FeeStructurePage() {
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
            Fee Structure
          </Text>

          <Text style={styles.subheading}>
            Configure tuition and transport fee structures
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.createButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.createButtonText}>
              Add Structure
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search fee structure..."
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
            Academic Year 2026 Fee Plan
          </Text>

          <Text style={styles.heroSubtitle}>
            Smart fee management and category analytics
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroMiniCard}>
              <Layers3
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                12 Structures
              </Text>
            </View>

            <View style={styles.heroMiniCard}>
              <IndianRupee
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                ₹24.5L Revenue
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.heroButton}>
          <BarChart3
            size={16}
            color="#fff"
          />

          <Text style={styles.heroButtonText}>
            Analytics
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
          <Layers3
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            12
          </Text>

          <Text style={styles.statsLabel}>
            Structures
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <Users
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            1,240
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

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <CheckCircle2
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            92%
          </Text>

          <Text style={styles.statsLabel}>
            Collection
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Upload
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Import
          </Text>

          <Text style={styles.actionDesc}>
            Upload plans
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Download
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Export
          </Text>

          <Text style={styles.actionDesc}>
            Download report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Wallet
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Discounts
          </Text>

          <Text style={styles.actionDesc}>
            Manage waivers
          </Text>
        </TouchableOpacity>
      </View>

      {/* STRUCTURE LIST */}

      <Text style={styles.sectionTitle}>
        Fee Categories
      </Text>

      <View style={styles.structureList}>
        <View style={styles.structureCard}>
          <View style={styles.structureLeft}>
            <View style={styles.iconBox}>
              <GraduationCap
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.structureTitle}>
                Tuition Fee
              </Text>

              <Text style={styles.structureInfo}>
                Classes 1 - 12
              </Text>
            </View>
          </View>

          <View style={styles.structureRight}>
            <Text style={styles.amount}>
              ₹18,500
            </Text>

            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>
                Active
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.structureCard}>
          <View style={styles.structureLeft}>
            <View style={styles.iconBox}>
              <Bus
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.structureTitle}>
                Transport Fee
              </Text>

              <Text style={styles.structureInfo}>
                Route-wise pricing
              </Text>
            </View>
          </View>

          <View style={styles.structureRight}>
            <Text style={styles.amount}>
              ₹8,200
            </Text>

            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>
                Updated
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.structureCard}>
          <View style={styles.structureLeft}>
            <View style={styles.iconBox}>
              <BookOpen
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.structureTitle}>
                Examination Fee
              </Text>

              <Text style={styles.structureInfo}>
                Semester based
              </Text>
            </View>
          </View>

          <View style={styles.structureRight}>
            <Text style={styles.amount}>
              ₹5,400
            </Text>

            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>
                Approved
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* BREAKDOWN */}

      <Text style={styles.sectionTitle}>
        Fee Distribution
      </Text>

      <View style={styles.breakdownContainer}>
        <View style={styles.breakdownCard}>
          <GraduationCap
            size={26}
            color="#A0522D"
          />

          <Text style={styles.breakdownTitle}>
            Tuition
          </Text>

          <Text style={styles.breakdownValue}>
            52%
          </Text>
        </View>

        <View style={styles.breakdownCard}>
          <Bus
            size={26}
            color="#A0522D"
          />

          <Text style={styles.breakdownTitle}>
            Transport
          </Text>

          <Text style={styles.breakdownValue}>
            28%
          </Text>
        </View>

        <View style={styles.breakdownCard}>
          <BookOpen
            size={26}
            color="#A0522D"
          />

          <Text style={styles.breakdownTitle}>
            Exams
          </Text>

          <Text style={styles.breakdownValue}>
            20%
          </Text>
        </View>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Structure Analytics
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            ₹24.5L
          </Text>

          <Text style={styles.analyticsLabel}>
            Revenue
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
            1.2K
          </Text>

          <Text style={styles.analyticsLabel}>
            Students
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
              Tuition fee updated
            </Text>

            <Text style={styles.activityTime}>
              2 hours ago
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <Wallet
            size={20}
            color="#A0522D"
          />

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Scholarship configured
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
    lineHeight: 20,
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

  structureList: {
    marginBottom: 24,
  },

  structureCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  structureLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  structureRight: {
    alignItems: "flex-end",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F5F5DC",
    justifyContent: "center",
    alignItems: "center",
  },

  structureTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  structureInfo: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  amount: {
    fontSize: 14,
    fontWeight: "900",
    color: "#A0522D",
  },

  activeBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },

  activeText: {
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

  breakdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  breakdownCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
  },

  breakdownTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  breakdownValue: {
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