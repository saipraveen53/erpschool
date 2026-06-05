import { useRouter } from "expo-router";
import {
    AlertCircle,
    CheckCircle,
    IndianRupee,
    TrendingUp
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { rootApi } from "../../../utils/axiosInstance";

const BILLING_BASE_URL = "http://192.168.88.20:8083";

export default function BillingDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const [classesStats, setClassesStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await rootApi.get(
        `${BILLING_BASE_URL}/api/student/fee/admin/dashboard/stats`,
      );
      if (response.data) {
        setClassesStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch billing stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalExpected = classesStats.reduce(
    (sum, item) => sum + (item.totalExpectedFee || 0),
    0,
  );
  const totalCollected = classesStats.reduce(
    (sum, item) => sum + (item.totalCollectedFee || 0),
    0,
  );
  const totalPending = classesStats.reduce(
    (sum, item) => sum + (item.totalPendingFee || 0),
    0,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Billing & Fees</Text>
          <Text style={styles.headerSubtitle}>
            Check total fees collected and see how much is still pending.
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 12 : 24,
          paddingBottom: 40,
          paddingTop: 20,
        }}
      >
        {/* Overall Stats Cards */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <View style={[styles.statCard, { flex: 1 }]}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(59, 130, 246, 0.15)" },
              ]}
            >
              <TrendingUp size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.statLabel}>Total Expected</Text>
              <Text style={styles.statValue}>
                {formatCurrency(totalExpected)}
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { flex: 1 }]}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(34, 197, 94, 0.15)" },
              ]}
            >
              <CheckCircle size={20} color="#22c55e" />
            </View>
            <View>
              <Text style={styles.statLabel}>Total Collected</Text>
              <Text style={[styles.statValue, { color: "#16a34a" }]}>
                {formatCurrency(totalCollected)}
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { flex: 1 }]}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(239, 68, 68, 0.15)" },
              ]}
            >
              <AlertCircle size={20} color="#ef4444" />
            </View>
            <View>
              <Text style={styles.statLabel}>Total Pending</Text>
              <Text style={[styles.statValue, { color: "#dc2626" }]}>
                {formatCurrency(totalPending)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Class-wise Breakdown</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#E35336"
            style={{ marginTop: 40 }}
          />
        ) : classesStats.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <IndianRupee size={48} color="#E6D8D2" />
            <Text style={styles.emptyText}>No fee records found.</Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: -8,
            }}
          >
            {classesStats.map((item) => {
              const progress =
                item.totalExpectedFee > 0
                  ? (item.totalCollectedFee / item.totalExpectedFee) * 100
                  : 0;

              return (
                <View
                  key={item.classSectionId}
                  style={{ width: isMobile ? "100%" : "33.33%", padding: 8 }}
                >
                  <TouchableOpacity
                    style={styles.classCard}
                    onPress={() =>
                      router.push(
                        `/super-admin/billing/${item.classSectionId}` as any,
                      )
                    }
                  >
                    <View style={styles.classCardHeader}>
                      <View style={styles.classAvatar}>
                        <Text style={styles.classAvatarText}>
                          {item.className}
                        </Text>
                      </View>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          Section {item.section}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.classNameText}>
                      Class {item.className} - {item.section}
                    </Text>

                    <View style={styles.feeRow}>
                      <Text style={styles.feeLabel}>Expected</Text>
                      <Text style={styles.feeValue}>
                        {formatCurrency(item.totalExpectedFee)}
                      </Text>
                    </View>
                    <View style={styles.feeRow}>
                      <Text style={styles.feeLabel}>Collected</Text>
                      <Text style={[styles.feeValue, { color: "#16a34a" }]}>
                        {formatCurrency(item.totalCollectedFee)}
                      </Text>
                    </View>
                    <View style={styles.feeRow}>
                      <Text style={styles.feeLabel}>Pending</Text>
                      <Text style={[styles.feeValue, { color: "#dc2626" }]}>
                        {formatCurrency(item.totalPendingFee)}
                      </Text>
                    </View>

                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${Math.min(progress, 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {progress.toFixed(1)}% Collected
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E6D8D2",
    zIndex: 100,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },

  statCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6D8D2",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statLabel: {
    fontSize: 13,
    color: "#8A6B5D",
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#1C1917" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#A0522D",
    marginBottom: 16,
    marginLeft: 8,
  },

  emptyStateContainer: { alignItems: "center", marginTop: 60 },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
    color: "#B8A095",
    fontSize: 15,
  },

  classCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E6D8D2",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  classCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  classAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  classAvatarText: { fontSize: 18, fontWeight: "bold", color: "#E35336" },
  badge: {
    backgroundColor: "#F5F5DC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { fontSize: 12, fontWeight: "bold", color: "#A0522D" },

  classNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#A0522D",
    marginBottom: 16,
  },

  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  feeLabel: { fontSize: 14, color: "#8A6B5D", fontWeight: "500" },
  feeValue: { fontSize: 14, fontWeight: "700", color: "#334155" },

  progressBarBg: {
    height: 6,
    backgroundColor: "#E6D8D2",
    borderRadius: 3,
    marginTop: 16,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "#8A6B5D",
    marginTop: 6,
    textAlign: "right",
    fontWeight: "600",
  },
});
