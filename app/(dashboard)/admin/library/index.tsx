// app/admin/library/index.tsx

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
  Search, Plus, Library, BookOpen, Bookmark, Users, Clock3, TrendingUp,
  Bell, Download, Upload, Star, ChevronRight, CalendarDays, BookMarked,
  Sparkles, ClipboardList,
} from "lucide-react-native";

// UPDATED COLOR PALETTE
const PRIMARY = "#14A7BC";    // Vibrant Teal
const SECONDARY = "#24343D";  // Deep Dark Charcoal
const BACKGROUND = "#F4F8FA"; // Light Off-White/Blue
const CARD = "#FFFFFF";

export default function LibraryDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND }}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true} // Enabled scroll indicator
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>Library Center</Text>
            <Text style={styles.subheading}>Smart digital library management</Text>
          </View>
          {!isMobile && (
            <TouchableOpacity style={styles.addButton}>
              <Plus size={16} color="#fff" />
              <Text style={styles.addButtonText}>Add Book</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* HERO SECTION */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Sparkles size={34} color="#fff" />
            <Text style={styles.heroTitle}>Modern Smart Library</Text>
            <Text style={styles.heroSubtitle}>Manage books, issue tracking and records</Text>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Explore Library</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroBadge}>
            <Library size={24} color={PRIMARY} />
            <Text style={styles.heroBadgeText}>12K+ Books</Text>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#6B7280" />
          <TextInput placeholder="Search books..." placeholderTextColor="#9CA3AF" style={styles.searchInput} />
        </View>

        {/* STATS */}
        <View style={styles.statsGrid}>
          {[
            { label: "Total Books", value: "12K+", icon: BookOpen },
            { label: "Readers", value: "1.2K", icon: Users },
            { label: "Issued", value: "420", icon: Clock3 },
            { label: "Growth", value: "+24%", icon: TrendingUp },
          ].map((item, i) => (
            <View key={i} style={styles.statCard}>
              <item.icon size={26} color={PRIMARY} />
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* CATEGORIES */}
        <Text style={styles.sectionTitle}>Featured Categories</Text>
        <View style={styles.categoriesGrid}>
          {["Academic", "Literature", "Science"].map((cat, i) => (
            <TouchableOpacity key={i} style={styles.categoryCard}>
              <View style={styles.categoryIcon}><BookMarked size={24} color="#fff" /></View>
              <Text style={styles.categoryTitle}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  heading: { fontSize: 28, fontWeight: "900", color: SECONDARY },
  subheading: { color: "#6B7280", marginTop: 4 },
  addButton: { backgroundColor: PRIMARY, padding: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6 },
  addButtonText: { color: "#fff", fontWeight: "700" },
  heroCard: { backgroundColor: SECONDARY, borderRadius: 22, padding: 24, marginBottom: 24, flexDirection: "row", justifyContent: "space-between" },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 10 },
  heroSubtitle: { color: "#CBD5E1", marginTop: 8 },
  heroButton: { marginTop: 16, backgroundColor: PRIMARY, padding: 10, borderRadius: 8, alignSelf: "flex-start" },
  heroButtonText: { color: "#fff", fontWeight: "bold" },
  heroBadge: { backgroundColor: "#fff", padding: 16, borderRadius: 16, alignItems: "center" },
  heroBadgeText: { marginTop: 8, fontWeight: "bold", color: PRIMARY },
  searchContainer: { backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 24, flexDirection: "row", alignItems: "center" },
  searchInput: { flex: 1, marginLeft: 10 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 },
  statCard: { width: "48%", backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  statValue: { fontSize: 20, fontWeight: "900", color: SECONDARY, marginTop: 8 },
  statLabel: { color: "#6B7280", fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: SECONDARY, marginBottom: 12 },
  categoriesGrid: { flexDirection: "row", justifyContent: "space-between" },
  categoryCard: { width: "31%", backgroundColor: CARD, padding: 16, borderRadius: 16, alignItems: "center" },
  categoryIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: PRIMARY, justifyContent: "center", alignItems: "center" },
  categoryTitle: { marginTop: 10, fontWeight: "700" },
});