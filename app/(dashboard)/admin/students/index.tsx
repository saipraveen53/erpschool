import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  Users,
  Search,
  UserCheck,
  GraduationCap,
  Activity,
  ArrowRight,
  Filter,
  Download,
  Sparkles,
  BookOpen,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";

export default function StudentsIndex() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            Students Hub
          </Text>

          <Text style={styles.subheading}>
            Smart student administration and academic management
          </Text>
        </View>
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <Sparkles size={42} color="#fff" />

        <Text style={styles.heroTitle}>
          AI Student Analytics
        </Text>

        <Text style={styles.heroText}>
          Track attendance, performance, activities and student engagement
          through intelligent dashboards
        </Text>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" />

        <TextInput
          placeholder="Search students..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={18} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* STATS */}

      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: "#dbeafe" }]}>
          <Users size={34} color={PRIMARY} />

          <Text style={styles.number}>
            2,450
          </Text>

          <Text style={styles.label}>
            Total Students
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#dcfce7" }]}>
          <UserCheck size={34} color={PRIMARY} />

          <Text style={styles.number}>
            96%
          </Text>

          <Text style={styles.label}>
            Attendance
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fde68a" }]}>
          <GraduationCap size={34} color={PRIMARY} />

          <Text style={styles.number}>
            412
          </Text>

          <Text style={styles.label}>
            Top Performers
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#ede9fe" }]}>
          <Activity size={34} color={PRIMARY} />

          <Text style={styles.number}>
            89%
          </Text>

          <Text style={styles.label}>
            Engagement
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <Users size={32} color={PRIMARY} />

          <Text style={styles.actionTitle}>
            Students
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Download size={32} color={PRIMARY} />

          <Text style={styles.actionTitle}>
            Export Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <BookOpen size={32} color={PRIMARY} />

          <Text style={styles.actionTitle}>
            Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* STUDENT LIST */}

      <Text style={styles.sectionTitle}>
        Recent Students
      </Text>

      {[1, 2, 3, 4].map((item) => (
        <TouchableOpacity key={item} style={styles.studentCard}>
          <View>
            <Text style={styles.studentName}>
              Rahul Sharma
            </Text>

            <Text style={styles.studentInfo}>
              Grade 10 • Roll No 24
            </Text>
          </View>

          <ArrowRight size={20} color="#6B7280" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    padding: 16,
    paddingBottom: 80,
  },

  header: {
    marginBottom: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },

  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
  },

  heroText: {
    color: "#F5F5DC",
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
  },

  searchContainer: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },

  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3E8E2",
    justifyContent: "center",
    alignItems: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  card: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },

  number: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: 8,
    color: "#111827",
  },

  label: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 12,
  },

  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  actionCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },

  actionTitle: {
    marginTop: 8,
    fontWeight: "700",
    color: "#111827",
    fontSize: 11,
    textAlign: "center",
  },

  studentCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  studentName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  studentInfo: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
  },
});