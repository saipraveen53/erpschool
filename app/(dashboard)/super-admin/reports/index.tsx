import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import { Download, Building2, Users, TrendingUp, Filter, FileText, Database, ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function ReportsAnalytics() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("All");

  const reports = [
    { id: "1", title: "School Performance Overview", type: "PDF", date: "Today, 10:30 AM", size: "2.4 MB", icon: Building2 },
    { id: "2", title: "Global User Growth Analytics", type: "Excel", date: "Yesterday, 14:15 PM", size: "1.1 MB", icon: Users },
    { id: "3", title: "Revenue & Subscriptions", type: "CSV", date: "Oct 1, 2026", size: "856 KB", icon: TrendingUp },
    { id: "4", title: "System Error Logs", type: "TXT", date: "Sep 28, 2026", size: "4.2 MB", icon: Database },
  ];

  const filteredReports = activeTab === "All" ? reports : reports.filter(r => r.type === activeTab);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { padding: isMobile ? 16 : 24 }]}>
        <View>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 22 : 28 }]}>System Reports</Text>
          <Text style={styles.headerSubtitle}>Analyze platform metrics and download data exports</Text>
        </View>
        {!isMobile && (
          <TouchableOpacity style={styles.primaryBtn}>
            <FileText size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Generate New</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Analytics Summary Cards */}
        <View style={[styles.statsGrid, { flexDirection: isMobile ? "column" : "row" }]}>
          <View style={[styles.statCard, { backgroundColor: "#E35336" }]}>
            <View style={styles.statTop}>
              <View style={[styles.iconBox, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <FileText size={20} color="#fff" />
              </View>
              <Text style={styles.statLabel}>Total Reports</Text>
            </View>
            <Text style={styles.statValue}>1,284</Text>
            <Text style={styles.statTrend}>+12% this month</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#F4A460" }]}>
            <View style={styles.statTop}>
              <View style={[styles.iconBox, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Database size={20} color="#fff" />
              </View>
              <Text style={styles.statLabel}>Storage Used</Text>
            </View>
            <Text style={styles.statValue}>45.2 GB</Text>
            <Text style={styles.statTrend}>68% of capacity</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#A0522D" }]}>
            <View style={styles.statTop}>
              <View style={[styles.iconBox, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Download size={20} color="#fff" />
              </View>
              <Text style={styles.statLabel}>Total Downloads</Text>
            </View>
            <Text style={styles.statValue}>8,920</Text>
            <Text style={styles.statTrend}>+5% this week</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {["All", "PDF", "Excel", "CSV", "TXT"].map(tab => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                style={[styles.filterTab, activeTab === tab && styles.filterTabActive]}
              >
                <Text style={[styles.filterTabText, activeTab === tab && styles.filterTabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.iconBtn}>
            <Filter size={18} color="#A0522D" />
          </TouchableOpacity>
        </View>

        {/* Reports List */}
        <View style={styles.reportsWrapper}>
          <Text style={styles.sectionTitle}>Recent Exports</Text>
          {filteredReports.map((report, idx) => {
            const isLast = idx === filteredReports.length - 1;
            return (
              <View key={report.id} style={[styles.reportCard, !isLast && styles.reportCardBorder]}>
                <View style={styles.reportInfo}>
                  <View style={styles.reportIconContainer}>
                    <report.icon size={22} color="#E35336" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reportTitle} numberOfLines={1}>{report.title}</Text>
                    <View style={styles.reportMetaRow}>
                      <View style={styles.formatBadge}>
                        <Text style={styles.formatBadgeText}>{report.type}</Text>
                      </View>
                      <Text style={styles.reportMetaText}>• {report.size}</Text>
                      <Text style={styles.reportMetaText}>• {report.date}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.downloadAction}
                  onPress={() => router.push(`/super-admin/reports/${report.id}/download` as any)}
                >
                  <Text style={styles.downloadActionText}>Download</Text>
                  <ArrowRight size={16} color="#E35336" />
                </TouchableOpacity>
              </View>
            );
          })}
          {filteredReports.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No reports found for this format.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontWeight: "800", color: "#A0522D", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 6 },
  primaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#E35336", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  
  contentContainer: { padding: 20, paddingBottom: 60 },
  
  statsGrid: { gap: 16, marginBottom: 32 },
  statCard: { flex: 1, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  statTop: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 12 },
  statLabel: { color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: "600" },
  statValue: { color: "#ffffff", fontSize: 32, fontWeight: "800", marginBottom: 4 },
  statTrend: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "500" },

  filtersRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E6D8D2" },
  filterTabActive: { backgroundColor: "#A0522D", borderColor: "#A0522D" },
  filterTabText: { fontSize: 14, fontWeight: "600", color: "#8A6B5D" },
  filterTabTextActive: { color: "#fff" },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E6D8D2", marginLeft: 12 },

  reportsWrapper: { backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#A0522D", marginBottom: 20 },
  
  reportCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16 },
  reportCardBorder: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  reportInfo: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 16 },
  reportIconContainer: { width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(244, 164, 96, 0.15)", justifyContent: "center", alignItems: "center", marginRight: 16 },
  reportTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 6 },
  reportMetaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  formatBadge: { backgroundColor: "#F5F5DC", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  formatBadgeText: { fontSize: 11, fontWeight: "700", color: "#A0522D" },
  reportMetaText: { fontSize: 13, color: "#8A6B5D" },
  
  downloadAction: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(227, 83, 54, 0.1)", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, gap: 6 },
  downloadActionText: { color: "#E35336", fontSize: 13, fontWeight: "700" },

  emptyState: { padding: 40, alignItems: "center" },
  emptyStateText: { color: "#8A6B5D", fontSize: 14, fontWeight: "500" },
});
