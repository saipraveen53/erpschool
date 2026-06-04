// app/admin/examination/index.tsx

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Search,
  Plus,
  GraduationCap,
  FileCheck,
  ClipboardList,
  BarChart3,
  CalendarDays,
  Clock3,
  Users,
  ArrowRight,
  BookOpen,
  Award,
  PenTool,
} from "lucide-react-native";

export default function ExaminationIndex() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { padding: isMobile ? 16 : 32 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Examination Center</Text>
          <Text style={styles.subheading}>Manage exams, hall tickets and results</Text>
        </View>
        {!isMobile && (
          <TouchableOpacity style={styles.createButton} onPress={() => router.push("/admin/examination/create")}>
            <Plus size={18} color="#fff" />
            <Text style={styles.createButtonText}>Create Exam</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Search size={20} color="#27B3C7" />
        <TextInput
          placeholder="Search examination..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* HERO */}
      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Final Semester Examination 2026</Text>
          <Text style={styles.heroSubtitle}>Smart examination scheduling and analytics</Text>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroMiniCard}>
              <Users size={16} color="#27B3C7" />
              <Text style={styles.heroMiniText}>1,240 Students</Text>
            </View>
            <View style={styles.heroMiniCard}>
              <BookOpen size={16} color="#27B3C7" />
              <Text style={styles.heroMiniText}>24 Subjects</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.heroButton} onPress={() => router.push("/admin/examination/schedule")}>
          <Text style={styles.heroButtonText}>View Schedule</Text>
          <ArrowRight size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsGrid}>
        {[
          { icon: ClipboardList, val: "24", label: "Exams" },
          { icon: FileCheck, val: "1,240", label: "Hall Tickets" },
          { icon: BarChart3, val: "92%", label: "Pass Rate" },
          { icon: Award, val: "86%", label: "Avg Score" },
        ].map((item, index) => (
          <View key={index} style={[styles.statsCard, { width: isMobile ? "47%" : "23%" }]}>
            <item.icon size={26} color="#27B3C7" />
            <Text style={styles.statsNumber}>{item.val}</Text>
            <Text style={styles.statsLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {[
          { icon: ClipboardList, title: "Exams", route: "/admin/examination/exams" },
          { icon: FileCheck, title: "Hall Tickets", route: "/admin/examination/hall-tickets" },
          { icon: PenTool, title: "Marks Entry", route: "/admin/examination/marks-entry" },
          { icon: BarChart3, title: "Results", route: "/admin/examination/results" },
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.actionCard, { width: isMobile ? "47%" : "23%" }]} 
            onPress={() => router.push(item.route as any)}
          >
            <item.icon size={24} color="#27B3C7" />
            <Text style={styles.actionTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* UPCOMING EXAMS */}
      <Text style={styles.sectionTitle}>Upcoming Exams</Text>
      <View style={styles.examList}>
        {[
          { name: "Mathematics Final Exam", date: "12 June 2026 • 10:00 AM", status: "Upcoming", icon: CalendarDays },
          { name: "Science Practical", date: "15 June 2026 • 09:30 AM", status: "Active", icon: Clock3 },
        ].map((item, index) => (
          <View key={index} style={styles.examCard}>
            <View style={styles.examLeft}>
              <View style={styles.examIconBox}><item.icon size={20} color="#27B3C7" /></View>
              <View><Text style={styles.examName}>{item.name}</Text><Text style={styles.examDate}>{item.date}</Text></View>
            </View>
            <View style={styles.upcomingBadge}><Text style={styles.upcomingText}>{item.status}</Text></View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F9FA" },
  content: { paddingBottom: 80 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  heading: { fontSize: 28, fontWeight: "900", color: "#24343D" },
  subheading: { marginTop: 4, fontSize: 13, color: "#6B7280" },
  createButton: { backgroundColor: "#27B3C7", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6 },
  createButtonText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  searchBox: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", marginBottom: 24, borderWidth: 1, borderColor: "#E5E7EB" },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: "#24343D" },
  heroCard: { backgroundColor: "#24343D", borderRadius: 20, padding: 24, marginBottom: 24 },
  heroContent: { marginBottom: 16 },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "900" },
  heroSubtitle: { marginTop: 6, color: "#DDF7FB", fontSize: 13 },
  heroStatsRow: { flexDirection: "row", marginTop: 16, gap: 12 },
  heroMiniCard: { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6 },
  heroMiniText: { fontWeight: "700", fontSize: 12, color: "#24343D" },
  heroButton: { backgroundColor: "#27B3C7", paddingVertical: 10, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 },
  heroButtonText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 },
  statsCard: { backgroundColor: "#F0F9FA", borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: "#E0F2F4" },
  statsNumber: { marginTop: 8, fontSize: 22, fontWeight: "900", color: "#24343D" },
  statsLabel: { marginTop: 4, color: "#6B7280", fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#24343D", marginBottom: 16 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 },
  actionCard: { backgroundColor: "#fff", paddingVertical: 20, borderRadius: 16, alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 10 },
  actionTitle: { marginTop: 8, fontSize: 13, fontWeight: "800", color: "#24343D", textAlign: "center" },
  examList: { marginBottom: 24 },
  examCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB" },
  examLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  examIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#F0F9FA", justifyContent: "center", alignItems: "center" },
  examName: { fontSize: 13, fontWeight: "800", color: "#24343D" },
  examDate: { marginTop: 4, color: "#6B7280", fontSize: 11 },
  upcomingBadge: { backgroundColor: "#E0F2F4", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  upcomingText: { color: "#27B3C7", fontWeight: "700", fontSize: 10 },
});