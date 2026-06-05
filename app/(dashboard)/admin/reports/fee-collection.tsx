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
  Search, Plus, IndianRupee, Wallet, TrendingUp, Users, Bell, 
  Download, Upload, PieChart, BarChart3, CreditCard, Receipt, 
  ChevronRight, Filter, CalendarDays, AlertTriangle, CheckCircle2, Activity,
} from "lucide-react-native";

/* ========================================= */
/* UPDATED COLORS */
/* ========================================= */
const PRIMARY = "#253238"; // Dark Slate
const ACCENT = "#22C7E5";  // Cyan
const BACKGROUND = "#F4F8FB";
const CARD = "#FFFFFF";
const BORDER = "#DCE7EF";
const TEXT_DARK = "#253238";
const TEXT_LIGHT = "#64748B";

export default function FeeCollectionReportsPage() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Fee Collection Reports</Text>
          <Text style={styles.subheading}>Smart fee analytics and financial performance monitoring</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={16} color="#fff" />
          <Text style={styles.addButtonText}>Generate Report</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Search size={16} color={TEXT_LIGHT} />
        <TextInput placeholder="Search financial reports..." placeholderTextColor={TEXT_LIGHT} style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsGrid}>
        {[
          { icon: Wallet, val: "₹24L", label: "Total Collection" },
          { icon: CheckCircle2, val: "92%", label: "Fee Completion" },
          { icon: AlertTriangle, val: "₹2.4L", label: "Pending Fees" },
          { icon: TrendingUp, val: "+18%", label: "Growth" }
        ].map((item, i) => (
          <View key={i} style={styles.statCard}>
            <item.icon size={24} color={ACCENT} />
            <Text style={styles.statValue}>{item.val}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* MODULES */}
      <Text style={styles.sectionTitle}>Financial Modules</Text>
      <View style={styles.moduleGrid}>
        {[
          { icon: PieChart, title: "Analytics" },
          { icon: BarChart3, title: "Revenue" },
          { icon: Activity, title: "Insights" }
        ].map((m, i) => (
          <TouchableOpacity key={i} style={styles.moduleCard}>
            <View style={styles.moduleIcon}><m.icon size={22} color="#fff" /></View>
            <Text style={styles.moduleTitle}>{m.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* RECENT PAYMENTS */}
      <Text style={styles.sectionTitle}>Recent Collections</Text>
      <View style={styles.listContainer}>
        {[
          { name: "Rahul Sharma", info: "Grade 10 • ₹45,000" },
          { name: "Priya Patel", info: "Grade 9 • ₹38,000" }
        ].map((p, i) => (
          <TouchableOpacity key={i} style={styles.paymentCard}>
            <View style={styles.paymentLeft}>
              <View style={styles.iconBox}><CreditCard size={18} color={ACCENT} /></View>
              <View>
                <Text style={styles.paymentName}>{p.name}</Text>
                <Text style={styles.paymentInfo}>{p.info}</Text>
              </View>
            </View>
            <ChevronRight size={18} color={TEXT_LIGHT} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  content: { padding: 20, paddingBottom: 80 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  heading: { fontSize: 24, fontWeight: "900", color: PRIMARY },
  subheading: { marginTop: 4, color: TEXT_LIGHT, fontSize: 12 },
  addButton: { backgroundColor: PRIMARY, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6 },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  searchContainer: { backgroundColor: CARD, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, flexDirection: "row", alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: BORDER },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: TEXT_DARK },
  filterButton: { width: 36, height: 36, borderRadius: 10, backgroundColor: BACKGROUND, justifyContent: "center", alignItems: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  statCard: { width: "48%", borderRadius: 20, padding: 18, marginBottom: 12, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER },
  statValue: { fontSize: 24, fontWeight: "900", color: TEXT_DARK, marginTop: 10 },
  statLabel: { marginTop: 4, fontSize: 12, color: TEXT_LIGHT },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: PRIMARY, marginBottom: 15 },
  moduleGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  moduleCard: { width: "31%", backgroundColor: CARD, borderRadius: 20, padding: 14, borderWidth: 1, borderColor: BORDER, alignItems: "center" },
  moduleIcon: { width: 45, height: 45, borderRadius: 14, backgroundColor: ACCENT, justifyContent: "center", alignItems: "center" },
  moduleTitle: { marginTop: 10, fontSize: 13, fontWeight: "800", color: TEXT_DARK },
  paymentCard: { backgroundColor: CARD, borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: BORDER },
  paymentLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: BACKGROUND, justifyContent: "center", alignItems: "center", marginRight: 12 },
  paymentName: { fontSize: 14, fontWeight: "800", color: TEXT_DARK },
  paymentInfo: { marginTop: 2, color: TEXT_LIGHT, fontSize: 12 },
});