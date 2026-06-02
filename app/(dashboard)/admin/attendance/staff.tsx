import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";

import {
  Search,
  UserCheck,
  UserX,
  Clock3,
  CalendarDays,
  Filter,
  CircleCheck,
  CircleX,
  Sparkles,
  ShieldCheck,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

const PRIMARY = "#A0522D";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";

const { width } = Dimensions.get("window");

export default function StaffAttendance() {
  const staff = [
    {
      name: "Dr. Priya Sharma",
      department: "Mathematics",
      status: "Present",
    },

    {
      name: "Mr. Rahul Verma",
      department: "Physics",
      status: "Absent",
    },

    {
      name: "Mrs. Sneha Patel",
      department: "Biology",
      status: "Present",
    },

    {
      name: "Mr. Arjun Reddy",
      department: "Chemistry",
      status: "Late",
    },
  ];

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
            Staff Attendance
          </Text>

          <Text style={styles.subheading}>
            Faculty attendance and workforce analytics
          </Text>
        </View>
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <Sparkles size={36} color="#fff" />

        <Text style={styles.heroTitle}>
          Smart Workforce Monitoring
        </Text>

        <Text style={styles.heroText}>
          AI-powered staff attendance insights, punctuality tracking and
          department productivity reports
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
          <Filter size={16} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* STATS */}

      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: "#dbeafe" }]}>
          <UserCheck size={28} color={PRIMARY} />

          <Text style={styles.number}>
            258
          </Text>

          <Text style={styles.label}>
            Present
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fee2e2" }]}>
          <UserX size={28} color={PRIMARY} />

          <Text style={styles.number}>
            12
          </Text>

          <Text style={styles.label}>
            Absent
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fde68a" }]}>
          <Clock3 size={28} color={PRIMARY} />

          <Text style={styles.number}>
            6
          </Text>

          <Text style={styles.label}>
            Late
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#ede9fe" }]}>
          <CalendarDays size={28} color={PRIMARY} />

          <Text style={styles.number}>
            98%
          </Text>

          <Text style={styles.label}>
            Attendance
          </Text>
        </View>
      </View>

      {/* STAFF LIST */}

      <Text style={styles.sectionTitle}>
        Faculty Attendance
      </Text>

      {staff.map((member, index) => (
        <View key={index} style={styles.staffCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.staffName}>
              {member.name}
            </Text>

            <Text style={styles.staffInfo}>
              {member.department}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  member.status === "Present"
                    ? "#dcfce7"
                    : member.status === "Absent"
                    ? "#fee2e2"
                    : "#fde68a",
              },
            ]}
          >
            {member.status === "Present" ? (
              <CircleCheck size={14} color="green" />
            ) : member.status === "Absent" ? (
              <CircleX size={14} color="red" />
            ) : (
              <Clock3 size={14} color="#B45309" />
            )}

            <Text style={styles.statusText}>
              {member.status}
            </Text>
          </View>
        </View>
      ))}

      {/* SECURITY */}

      <Text style={styles.sectionTitle}>
        Attendance Security
      </Text>

      <View style={styles.securityCard}>
        <ShieldCheck size={34} color={PRIMARY} />

        <Text style={styles.securityTitle}>
          Biometric Attendance Active
        </Text>

        <Text style={styles.securityText}>
          Attendance records are synced securely using biometric and RFID-based
          verification systems
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
    lineHeight: 20,
    fontSize: 13,
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
    width: 34,
    height: 34,
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
    fontSize: 22,
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

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  statusText: {
    fontWeight: "700",
    fontSize: 11,
  },

  securityCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  securityTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
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