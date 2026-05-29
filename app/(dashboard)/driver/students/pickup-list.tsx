import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, CheckCircle, MapPin, Phone, Search, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const studentsData = [
  { id: 1, name: "Aarav Sharma", class: "5A", pickupPoint: "Raj Nagar", phone: "9876543210", status: "pending" },
  { id: 2, name: "Vihaan Kumar", class: "5B", pickupPoint: "Raj Nagar", phone: "9876543211", status: "pending" },
  { id: 3, name: "Sai Reddy", class: "6A", pickupPoint: "Indira Colony", phone: "9876543212", status: "pending" },
  { id: 4, name: "Ananya Singh", class: "6B", pickupPoint: "Indira Colony", phone: "9876543213", status: "pending" },
  { id: 5, name: "Diya Patel", class: "7A", pickupPoint: "Sai Nagar", phone: "9876543214", status: "pending" },
  { id: 6, name: "Arjun Nair", class: "7B", pickupPoint: "Sai Nagar", phone: "9876543215", status: "pending" },
  { id: 7, name: "Rohan Verma", class: "8A", pickupPoint: "Shivaji Park", phone: "9876543216", status: "pending" },
  { id: 8, name: "Ishita Gupta", class: "8B", pickupPoint: "Shivaji Park", phone: "9876543217", status: "pending" },
];

export default function PickupList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(studentsData);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef(studentsData.map(() => new Animated.Value(0))).current;

  const toggleStatus = (id: number) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, status: student.status === "pending" ? "picked" : "pending" }
          : student
      )
    );
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.pickupPoint.toLowerCase().includes(search.toLowerCase())
  );
  const pickedCount = students.filter((s) => s.status === "picked").length;
  const totalCount = students.length;
  const percentage = (pickedCount / totalCount) * 100;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.timing(progressAnim, { toValue: percentage, duration: 800, useNativeDriver: false }).start();
    cardAnimations.forEach((anim, idx) => {
      Animated.spring(anim, { toValue: 1, delay: idx * 80, useNativeDriver: true, tension: 50 }).start();
    });
  }, [percentage]);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pickup List</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={[styles.progressCard, { opacity: fadeAnim }]}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Pickup Progress</Text>
          <Text style={styles.progressCount}>
            {pickedCount}/{totalCount}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </Animated.View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or pickup point"
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredStudents.map((student, idx) => (
          <Animated.View key={student.id} style={[styles.studentCard, { opacity: cardAnimations[idx], transform: [{ scale: cardAnimations[idx] }] }]}>
            <View style={styles.studentAvatar}>
              <User size={24} color="#6b7280" />
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <View style={styles.studentDetails}>
                <View style={styles.detailItem}>
                  <MapPin size={12} color="#9ca3af" />
                  <Text style={styles.detailText}>{student.pickupPoint}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Phone size={12} color="#9ca3af" />
                  <Text style={styles.detailText}>{student.phone}</Text>
                </View>
              </View>
              <Text style={styles.studentClass}>Class {student.class}</Text>
            </View>
            <TouchableOpacity
              style={[styles.statusBtn, student.status === "picked" ? styles.pickedBtn : styles.pendingBtn]}
              onPress={() => toggleStatus(student.id)}
              activeOpacity={0.7}
            >
              {student.status === "picked" ? (
                <CheckCircle size={18} color="#16a34a" />
              ) : (
                <Text style={styles.statusBtnText}>Mark Picked</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  progressCard: { backgroundColor: "#ffffff", margin: 16, padding: 16, borderRadius: 12 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressTitle: { fontSize: 14, fontWeight: "500", color: "#111827" },
  progressCount: { fontSize: 14, fontWeight: "bold", color: "#2563eb" },
  progressBar: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#2563eb", borderRadius: 4 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", marginHorizontal: 16, marginBottom: 16, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb" },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#111827" },
  studentCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 12 },
  studentAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" },
  studentInfo: { flex: 1, marginLeft: 12 },
  studentName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  studentDetails: { flexDirection: "row", marginTop: 4, gap: 12 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  detailText: { fontSize: 12, color: "#6b7280" },
  studentClass: { fontSize: 12, color: "#2563eb", marginTop: 4 },
  statusBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pendingBtn: { backgroundColor: "#2563eb" },
  pickedBtn: { backgroundColor: "#dcfce7" },
  statusBtnText: { fontSize: 12, color: "#ffffff", fontWeight: "500" },
});