import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Search,
    User,
    XCircle,
} from "lucide-react-native";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const attendanceData = [
  { id: 1, name: "Aarav Sharma", status: "present", time: "7:45 AM" },
  { id: 2, name: "Vihaan Kumar", status: "present", time: "7:45 AM" },
  { id: 3, name: "Sai Reddy", status: "absent", time: "-" },
  { id: 4, name: "Ananya Singh", status: "present", time: "7:55 AM" },
  { id: 5, name: "Diya Patel", status: "present", time: "8:05 AM" },
  { id: 6, name: "Arjun Nair", status: "absent", time: "-" },
  { id: 7, name: "Rohan Verma", status: "present", time: "8:15 AM" },
  { id: 8, name: "Ishita Gupta", status: "present", time: "8:15 AM" },
];

export default function AttendanceConfirmation() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState(attendanceData);

  const toggleStatus = (id: number) => {
    setAttendance((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              status: student.status === "present" ? "absent" : "present",
              time:
                student.status === "present"
                  ? "-"
                  : new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
            }
          : student,
      ),
    );
  };

  const filteredStudents = attendance.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );
  const presentCount = attendance.filter((s) => s.status === "present").length;
  const totalCount = attendance.length;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <CheckCircle size={24} color="#16a34a" />
          <Text style={styles.summaryValue}>{presentCount}</Text>
          <Text style={styles.summaryLabel}>Present</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <XCircle size={24} color="#dc2626" />
          <Text style={styles.summaryValue}>{totalCount - presentCount}</Text>
          <Text style={styles.summaryLabel}>Absent</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <AlertCircle size={24} color="#f59e0b" />
          <Text style={styles.summaryValue}>0</Text>
          <Text style={styles.summaryLabel}>Late</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search student"
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredStudents.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentAvatar}>
              <User size={24} color="#6b7280" />
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              {student.status === "present" && (
                <Text style={styles.studentTime}>Picked at {student.time}</Text>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.statusBtn,
                student.status === "present"
                  ? styles.presentBtn
                  : styles.absentBtn,
              ]}
              onPress={() => toggleStatus(student.id)}
            >
              <Text style={styles.statusBtnText}>
                {student.status === "present" ? "Present" : "Absent"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitBtnText}>Submit Attendance</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    justifyContent: "space-around",
  },
  summaryItem: { alignItems: "center", flex: 1 },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  summaryLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: "#e5e7eb" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#111827" },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  studentInfo: { flex: 1, marginLeft: 12 },
  studentName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  studentTime: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  statusBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  presentBtn: { backgroundColor: "#dcfce7" },
  absentBtn: { backgroundColor: "#fee2e2" },
  statusBtnText: { fontSize: 12, fontWeight: "500" },
  submitBtn: {
    backgroundColor: "#2563eb",
    margin: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
