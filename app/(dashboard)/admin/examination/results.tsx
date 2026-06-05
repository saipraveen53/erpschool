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
  Trophy,
  Medal,
  GraduationCap,
  Users,
  FileBarChart,
  Download,
  Upload,
  Eye,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Star,
  Award,
  BarChart3,
  Filter,
  Printer,
  BookOpen,
} from "lucide-react-native";
import React from "react";

/* ========================================= */
/* UPDATED COLORS BASED ON REFERENCE */
/* ========================================= */

const COLORS = {
  background: "#F4F8FB",
  card: "#FFFFFF",
  primary: "#22C7E5",    // Cyan/Turquoise
  textDark: "#253238",   // Dark Slate
  textLight: "#64748B",
  border: "#DCE7EF",
  white: "#FFFFFF",
};

export default function ResultsPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { padding: isMobile ? 16 : 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Results Center</Text>
          <Text style={styles.subheading}>
            Publish and manage examination results
          </Text>
        </View>

        {!isMobile && (
          <TouchableOpacity style={styles.publishButton}>
            <Upload size={16} color="#fff" />
            <Text style={styles.publishButtonText}>Publish Results</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Search size={18} color={COLORS.textLight} />
        <TextInput
          placeholder="Search results..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* STATS */}
      <View style={styles.statsGrid}>
        <View style={[styles.statsCard, { backgroundColor: COLORS.card }]}>
          <FileBarChart size={28} color={COLORS.primary} />
          <Text style={styles.statsNumber}>1,240</Text>
          <Text style={styles.statsLabel}>Published</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: COLORS.card }]}>
          <CheckCircle2 size={28} color={COLORS.primary} />
          <Text style={styles.statsNumber}>92%</Text>
          <Text style={styles.statsLabel}>Pass Rate</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: COLORS.card }]}>
          <TrendingUp size={28} color={COLORS.primary} />
          <Text style={styles.statsNumber}>86%</Text>
          <Text style={styles.statsLabel}>Avg Score</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: COLORS.card }]}>
          <Star size={28} color={COLORS.primary} />
          <Text style={styles.statsNumber}>128</Text>
          <Text style={styles.statsLabel}>Distinctions</Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        {[Download, Printer, Filter].map((Icon, i) => (
          <TouchableOpacity key={i} style={styles.actionCard}>
            <Icon size={26} color={COLORS.primary} />
            <Text style={styles.actionTitle}>Action</Text>
            <Text style={styles.actionDesc}>Manage data</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 80 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  heading: { fontSize: 28, fontWeight: "900", color: COLORS.textDark },
  subheading: { marginTop: 4, color: COLORS.textLight, fontSize: 13 },
  publishButton: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 6 },
  publishButtonText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  searchBox: { backgroundColor: COLORS.card, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, flexDirection: "row", alignItems: "center", marginBottom: 22, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.textDark },
  heroCard: { backgroundColor: COLORS.primary, borderRadius: 22, padding: 20, marginBottom: 24 },
  heroContent: { marginBottom: 16 },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "900" },
  heroSubtitle: { marginTop: 8, color: "#e0f7fa", fontSize: 13 },
  heroStats: { flexDirection: "row", gap: 10, marginTop: 16 },
  heroMiniCard: { backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 6 },
  heroMiniText: { fontWeight: "700", fontSize: 12, color: COLORS.textDark },
  heroButton: { backgroundColor: "rgba(0,0,0,0.2)", paddingVertical: 12, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  heroButtonText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 },
  statsCard: { width: "48%", borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  statsNumber: { fontSize: 22, fontWeight: "900", marginTop: 10, color: COLORS.textDark },
  statsLabel: { marginTop: 4, color: COLORS.textLight, fontSize: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: COLORS.textDark, marginBottom: 14 },
  quickActions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  actionCard: { width: "31%", backgroundColor: COLORS.card, paddingVertical: 18, borderRadius: 18, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  actionTitle: { marginTop: 10, fontSize: 13, fontWeight: "800", color: COLORS.textDark },
  actionDesc: { marginTop: 4, color: COLORS.textLight, fontSize: 11 },
});