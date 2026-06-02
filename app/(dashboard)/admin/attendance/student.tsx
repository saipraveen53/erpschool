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
  Search,
  UserCheck,
  UserX,
  Clock3,
  CalendarDays,
  Filter,
  CircleCheck,
  CircleX,
  Sparkles,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";

const { width } = Dimensions.get("window");

export default function StudentAttendance() {
  const students = [
    {
      name: "Rahul Sharma",
      class: "Grade 10 - A",
      status: "Present",
    },

    {
      name: "Aarav Kumar",
      class: "Grade 9 - B",
      status: "Absent",
    },

    {
      name: "Sneha Patel",
      class: "Grade 8 - C",
      status: "Present",
    },

    {
      name: "Ananya Reddy",
      class: "Grade 7 - A",
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
            Student Attendance
          </Text>

          <Text style={styles.subheading}>
            Smart attendance tracking and analytics
          </Text>
        </View>
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <Sparkles size={36} color="#fff" />

        <Text style={styles.heroTitle}>
          AI Attendance Insights
        </Text>

        <Text style={styles.heroText}>
          Real-time student attendance tracking with smart reporting and
          predictive analytics
        </Text>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search student..."
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
            2,340
          </Text>

          <Text style={styles.label}>
            Present
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fee2e2" }]}>
          <UserX size={28} color={PRIMARY} />

          <Text style={styles.number}>
            110
          </Text>

          <Text style={styles.label}>
            Absent
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#fde68a" }]}>
          <Clock3 size={28} color={PRIMARY} />

          <Text style={styles.number}>
            42
          </Text>

          <Text style={styles.label}>
            Late
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#ede9fe" }]}>
          <CalendarDays size={28} color={PRIMARY} />

          <Text style={styles.number}>
            96%
          </Text>

          <Text style={styles.label}>
            Attendance
          </Text>
        </View>
      </View>

      {/* ATTENDANCE LIST */}

      <Text style={styles.sectionTitle}>
        Today's Attendance
      </Text>

      {students.map((student, index) => (
        <View key={index} style={styles.studentCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.studentName}>
              {student.name}
            </Text>

            <Text style={styles.studentInfo}>
              {student.class}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,

              {
                backgroundColor:
                  student.status === "Present"
                    ? "#dcfce7"
                    : student.status === "Absent"
                    ? "#fee2e2"
                    : "#fde68a",
              },
            ]}
          >
            {student.status === "Present" ? (
              <CircleCheck size={14} color="green" />
            ) : student.status === "Absent" ? (
              <CircleX size={14} color="red" />
            ) : (
              <Clock3 size={14} color="#B45309" />
            )}

            <Text style={styles.statusText}>
              {student.status}
            </Text>
          </View>
        </View>
      ))}

      {/* PERFORMANCE */}

      <Text style={styles.sectionTitle}>
        Attendance Performance
      </Text>

      <View style={styles.performanceCard}>
        <Text style={styles.performanceTitle}>
          Best Attendance Class
        </Text>

        <Text style={styles.performanceValue}>
          Grade 10 - A
        </Text>

        <Text style={styles.performanceSub}>
          99.2% attendance this month
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

  studentCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
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

  performanceCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
  },

  performanceTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
  },

  performanceValue: {
    fontSize: 26,
    fontWeight: "900",
    marginTop: 10,
    color: "#111827",
  },

  performanceSub: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 13,
  },
});