import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, CheckCircle, Search, User, XCircle } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDriverAttendance, updateAttendanceStatus } from "../../../services/driverService";

export default function AttendanceConfirmation() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadData = async () => {
    const data = await getDriverAttendance();
    setAttendance(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "present" ? "absent" : "present";
    await updateAttendanceStatus(id, newStatus);
    loadData();
  };

  useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 600 }).start(); }, []);

  if (loading) return <SafeAreaView style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;

  const filtered = attendance.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const present = attendance.filter(s => s.status === "present").length;
  const total = attendance.length;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}><TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity><Text style={styles.headerTitle}>Attendance</Text><View style={{ width: 40 }} /></View>
      <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
        <View style={styles.summaryItem}><CheckCircle size={24} color="#00a652" /><Text style={styles.summaryValue}>{present}</Text><Text>Present</Text></View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}><XCircle size={24} color="#ff4b00" /><Text style={styles.summaryValue}>{total - present}</Text><Text>Absent</Text></View>
      </Animated.View>
      <View style={styles.searchContainer}><Search size={20} color="#0065ea" /><TextInput placeholder="Search student" placeholderTextColor="#0065ea" value={search} onChangeText={setSearch} style={styles.searchInput} /></View>
      <ScrollView>
        {filtered.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentAvatar}><User size={24} color="#0065ea" /></View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              {student.status === "present" && <Text style={styles.studentTime}>Boarded at {student.time}</Text>}
            </View>
            <TouchableOpacity style={[styles.statusBtn, student.status === "present" ? styles.presentBtn : styles.absentBtn]} onPress={() => toggleStatus(student.id, student.status)}>
              <Text>{student.status === "present" ? "Present" : "Absent"}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.submitBtn} onPress={() => { Alert.alert("Submitted", "Attendance saved"); router.back(); }}><Text style={styles.submitBtnText}>Submit Attendance</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#0065ea" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea" },
  summaryCard: { flexDirection: "row", backgroundColor: "#fff", margin: 16, padding: 16, borderRadius: 12, justifyContent: "space-around" },
  summaryItem: { alignItems: "center", flex: 1 },
  summaryValue: { fontSize: 20, fontWeight: "bold", marginTop: 4, color: "#0065ea" },
  summaryDivider: { width: 1, backgroundColor: "#e2e8f0" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 16, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#0065ea" },
  searchInput: { flex: 1, marginLeft: 8, color: "#0065ea" },
  studentCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 12 },
  studentAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center" },
  studentInfo: { flex: 1, marginLeft: 12 },
  studentName: { fontSize: 16, fontWeight: "600", color: "#0065ea" },
  studentTime: { fontSize: 12, color: "#00a652", marginTop: 2 },
  statusBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  presentBtn: { backgroundColor: "#00a652" },
  absentBtn: { backgroundColor: "#ff4b00" },
  submitBtn: { backgroundColor: "#0065ea", margin: 16, padding: 14, borderRadius: 12, alignItems: "center" },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});