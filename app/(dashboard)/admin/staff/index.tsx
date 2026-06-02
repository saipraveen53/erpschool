import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  Users,
  Search,
  UserCheck,
  Briefcase,
  Activity,
  ArrowRight,
  Filter,
  Download,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";

const { width } = Dimensions.get("window");

export default function StaffIndex() {
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
            Staff Management
          </Text>

          <Text style={styles.subheading}>
            Smart faculty and employee administration system
          </Text>
        </View>
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <Sparkles size={38} color="#fff" />

        <Text style={styles.heroTitle}>
          AI Faculty Intelligence
        </Text>

        <Text style={styles.heroText}>
          Monitor staff attendance, teaching performance, workload and
          departmental activities with smart analytics
        </Text>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search staff..."
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
          <Users size={30} color={PRIMARY} />

          <Text style={styles.number}>
            285
          </Text>

          <Text style={styles.label}>
            Total Staff
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#dcfce7" }]}>
          <UserCheck size={30} color={PRIMARY} />

          <Text style={styles.number}>
            97%
          </Text>

          <Text style={styles.label}>
            Attendance
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fde68a" }]}>
          <Briefcase size={30} color={PRIMARY} />

          <Text style={styles.number}>
            24
          </Text>

          <Text style={styles.label}>
            Departments
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#ede9fe" }]}>
          <Activity size={30} color={PRIMARY} />

          <Text style={styles.number}>
            91%
          </Text>

          <Text style={styles.label}>
            Productivity
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <Users size={28} color={PRIMARY} />

          <Text style={styles.actionTitle}>
            Staff List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Download size={28} color={PRIMARY} />

          <Text style={styles.actionTitle}>
            Export
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <CalendarCheck size={28} color={PRIMARY} />

          <Text style={styles.actionTitle}>
            Schedule
          </Text>
        </TouchableOpacity>
      </View>

      {/* STAFF LIST */}

      <Text style={styles.sectionTitle}>
        Faculty Members
      </Text>

      {[1, 2, 3, 4].map((item) => (
        <TouchableOpacity key={item} style={styles.staffCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.staffName}>
              Dr. Priya Sharma
            </Text>

            <Text style={styles.staffInfo}>
              Mathematics Department
            </Text>
          </View>

          <ArrowRight size={18} color="#6B7280" />
        </TouchableOpacity>
      ))}

      {/* SECURITY */}

      <Text style={styles.sectionTitle}>
        Staff Security
      </Text>

      <View style={styles.securityCard}>
        <ShieldCheck size={38} color={PRIMARY} />

        <Text style={styles.securityTitle}>
          Verified Staff Records
        </Text>

        <Text style={styles.securityText}>
          All employee records are secured with smart access control and
          biometric authentication
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 100,
  },

  header: {
    marginBottom: 18,
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
    marginBottom: 18,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },

  heroText: {
    color: "#F5F5DC",
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
  },

  searchContainer: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
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
    backgroundColor: "#F3E8E2",
    justifyContent: "center",
    alignItems: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  card: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  number: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10,
    color: "#111827",
  },

  label: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 14,
  },

  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  actionCard: {
    width: width * 0.27,
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  actionTitle: {
    marginTop: 8,
    fontWeight: "700",
    color: "#111827",
    fontSize: 11,
    textAlign: "center",
  },

  staffCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  staffName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  staffInfo: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 12,
  },

  securityCard: {
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    marginTop: 6,
  },

  securityTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },

  securityText: {
    marginTop: 8,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 20,
    fontSize: 13,
  },
});