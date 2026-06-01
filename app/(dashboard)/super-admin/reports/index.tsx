import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from "react-native";
import { FileText, Download, TrendingUp, Users, Building2 } from "lucide-react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const isMobile = width < 768;

export default function ReportsAnalytics() {
  const router = useRouter();
  const reports = [
    { id: "1", title: "School Performance Overview", type: "PDF", date: "Today", icon: Building2 },
    { id: "2", title: "Global User Growth Analytics", type: "Excel", date: "Yesterday", icon: Users },
    { id: "3", title: "Revenue & Subscriptions", type: "CSV", date: "Oct 1, 2026", icon: TrendingUp },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Reports</Text>
        <Text style={styles.headerSubtitle}>Download and analyze platform metrics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Monthly Highlights</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>+12</Text>
              <Text style={styles.summaryLabel}>New Schools</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>+850</Text>
              <Text style={styles.summaryLabel}>New Users</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>$12.5k</Text>
              <Text style={styles.summaryLabel}>MRR Growth</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Reports</Text>
        {reports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportInfo}>
              <View style={styles.iconContainer}>
                <report.icon size={24} color="#3b82f6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reportTitle} numberOfLines={1}>{report.title}</Text>
                <Text style={styles.reportMeta}>{report.date} • {report.type}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.downloadBtn}
              onPress={() => router.push(`/super-admin/reports/${report.id}/download` as any)}
            >
              <Download size={20} color="#1d4ed8" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { padding: isMobile ? 16 : 20, backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  headerSubtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },
  contentContainer: { padding: isMobile ? 16 : 20, paddingBottom: 40 },
  summaryCard: { backgroundColor: "#2563eb", borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 32, shadowColor: "#2563eb", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  summaryTitle: { color: "#eff6ff", fontSize: 16, fontWeight: "600", marginBottom: 20 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryItem: { alignItems: "center" },
  summaryValue: { color: "#ffffff", fontSize: isMobile ? 20 : 24, fontWeight: "bold", marginBottom: 4 },
  summaryLabel: { color: "#bfdbfe", fontSize: isMobile ? 10 : 12, fontWeight: "500" },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#1e293b", marginBottom: 16 },
  reportCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ffffff", padding: isMobile ? 12 : 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  reportInfo: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 12 },
  iconContainer: { width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, borderRadius: 12, backgroundColor: "#eff6ff", justifyContent: "center", alignItems: "center", marginRight: isMobile ? 12 : 16 },
  reportTitle: { fontSize: isMobile ? 14 : 15, fontWeight: "600", color: "#1e293b", flexShrink: 1 },
  reportMeta: { fontSize: isMobile ? 12 : 13, color: "#64748b", marginTop: 4 },
  downloadBtn: { padding: isMobile ? 10 : 12, backgroundColor: "#eff6ff", borderRadius: 8 },
});
