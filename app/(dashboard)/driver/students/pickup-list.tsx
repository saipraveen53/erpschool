import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, CheckCircle, Home, MapPin, MessageCircle, Phone, Search, User, XCircle } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDriverStudents, updateStudentPickupStatus } from "../../../services/driverService";

export default function PickupList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const loadStudents = async () => {
    const data = await getDriverStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => { loadStudents(); }, []);

  const updateStatus = async (id, newStatus) => {
    await updateStudentPickupStatus(id, newStatus);
    loadStudents();
    Alert.alert("Status Updated", `Student marked as ${newStatus}`);
  };

  const callParent = (phone) => Linking.openURL(`tel:${phone}`);
  const whatsappParent = (phone) => Linking.openURL(`https://wa.me/${phone}`);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.pickupPoint.toLowerCase().includes(search.toLowerCase()));
  const picked = students.filter(s => s.status === "picked").length;
  const total = students.length;
  const percentage = (picked / total) * 100;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600 }).start();
    Animated.timing(progressAnim, { toValue: percentage, duration: 800 }).start();
  }, [percentage]);

  if (loading) return <SafeAreaView style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}><TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity><Text style={styles.headerTitle}>Pickup List</Text><View style={{ width: 40 }} /></View>
      <Animated.View style={[styles.progressCard, { opacity: fadeAnim }]}>
        <View style={styles.progressHeader}><Text style={styles.progressTitle}>Today's Pickup Progress</Text><Text style={styles.progressCount}>{picked}/{total}</Text></View>
        <View style={styles.progressBar}><Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) }]} /></View>
      </Animated.View>
      <View style={styles.searchContainer}><Search size={20} color="#0065ea" /><TextInput style={styles.searchInput} placeholder="Search by name or pickup point" placeholderTextColor="#0065ea" value={search} onChangeText={setSearch} /></View>
      <ScrollView>
        {filtered.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentAvatar}><User size={24} color="#0065ea" /></View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <View style={styles.detailRow}><MapPin size={12} color="#0065ea" /><Text style={styles.detailText}>{student.pickupPoint}</Text></View>
              <Text style={styles.studentClass}>Class {student.class}</Text>
              <View style={styles.actionRow}>
                {student.status !== "picked" && <TouchableOpacity style={styles.pickupBtn} onPress={() => updateStatus(student.id, "picked")}><CheckCircle size={16} color="white" /><Text>Picked</Text></TouchableOpacity>}
                {student.status !== "absent" && <TouchableOpacity style={styles.absentBtn} onPress={() => updateStatus(student.id, "pending")}><XCircle size={16} color="white" /><Text>Absent</Text></TouchableOpacity>}
                {student.status === "picked" && <TouchableOpacity style={styles.dropBtn} onPress={() => updateStatus(student.id, "dropped")}><Home size={16} color="white" /><Text>Dropped</Text></TouchableOpacity>}
                <TouchableOpacity style={styles.callBtn} onPress={() => callParent(student.phone)}><Phone size={16} color="#0065ea" /></TouchableOpacity>
                <TouchableOpacity style={styles.whatsappBtn} onPress={() => whatsappParent(student.phone)}><MessageCircle size={16} color="#25D366" /></TouchableOpacity>
              </View>
            </View>
            <Text style={styles.statusBadge}>{student.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#0065ea" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea" },
  progressCard: { backgroundColor: "#fff", margin: 16, padding: 16, borderRadius: 12 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  progressTitle: { fontSize: 14, fontWeight: "500", color: "#0065ea" },
  progressCount: { fontSize: 14, fontWeight: "bold", color: "#0065ea" },
  progressBar: { height: 8, backgroundColor: "#e2e8f0", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#0065ea" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 16, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#0065ea" },
  searchInput: { flex: 1, marginLeft: 8, color: "#0065ea" },
  studentCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 12 },
  studentAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center" },
  studentInfo: { flex: 1, marginLeft: 12 },
  studentName: { fontSize: 16, fontWeight: "600", color: "#0065ea" },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  detailText: { fontSize: 12, color: "#0065ea" },
  studentClass: { fontSize: 12, color: "#0065ea", marginTop: 2 },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" },
  pickupBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#00a652", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  absentBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#ff4b00", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  dropBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#0065ea", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  callBtn: { padding: 6, backgroundColor: "#fff", borderRadius: 20 },
  whatsappBtn: { padding: 6, backgroundColor: "#e8f5e9", borderRadius: 20 },
  statusBadge: { fontSize: 10, fontWeight: "500", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: "#fff", color: "#0065ea" },
});