import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users, Search, X, GraduationCap, UserCircle2,
} from "lucide-react-native";
import { studentApi } from "@/app/utils/axiosInstance";

const COLORS = {
  background: "#F1F5F9",
  primary: "#24343D",
  accent: "#00BCD4",
  lightAccent: "#E0F7FA",
  white: "#FFFFFF",
  textMain: "#24343D",
  textSub: "#64748B",
  border: "#E2E8F0",
};

export default function AddStudent() {
  const { width } = useWindowDimensions();
  const [students, setStudents] = useState([]);
  const [studentsModal, setStudentsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.get("/api/student/allStudents");
      const studentsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setStudents(studentsData);
      setStudentsModal(true);
    } catch (error) {
      console.log("Students Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <SafeAreaView
  style={styles.container}
  edges={["left", "right", "bottom"]}
>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.header}>
          <Text style={styles.heading}>Add New Student</Text>
          <Text style={styles.subHeading}>Manage student records and admissions</Text>
        </View>

        <View style={styles.searchBox}>
          <Search size={20} color={COLORS.textSub} />
          <TextInput placeholder="Search students..." placeholderTextColor={COLORS.textSub} style={styles.searchInput} />
        </View>

        <TouchableOpacity style={styles.studentsCard} onPress={fetchStudents}>
          <Users size={42} color={COLORS.accent} />
          <Text style={styles.studentsTitle}>Students</Text>
          <Text style={styles.studentsDesc}>{loading ? "Loading..." : `${students.length} Total Records`}</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Student Information</Text>
          <TextInput placeholder="Student Name" placeholderTextColor={COLORS.textSub} style={styles.input} value={studentName} onChangeText={setStudentName} />
          <TextInput placeholder="Email Address" placeholderTextColor={COLORS.textSub} style={styles.input} value={email} onChangeText={setEmail} />
          <TextInput placeholder="Phone Number" placeholderTextColor={COLORS.textSub} style={styles.input} value={phone} onChangeText={setPhone} />
          <View style={styles.row}>
            <TextInput placeholder="Class" placeholderTextColor={COLORS.textSub} style={[styles.input, { flex: 0.48 }]} value={studentClass} onChangeText={setStudentClass} />
            <TextInput placeholder="Section" placeholderTextColor={COLORS.textSub} style={[styles.input, { flex: 0.48 }]} value={section} onChangeText={setSection} />
          </View>
          <TextInput placeholder="Roll Number" placeholderTextColor={COLORS.textSub} style={styles.input} value={rollNumber} onChangeText={setRollNumber} />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Save Student Record</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={studentsModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          {/* Constrain modal width for desktop */}
          <View style={[styles.modalCard, { width: width > 768 ? 600 : "90%" }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Students List</Text>
              <TouchableOpacity onPress={() => setStudentsModal(false)}><X size={24} color={COLORS.textMain} /></TouchableOpacity>
            </View>
            <FlatList
              data={students}
              keyExtractor={(item, index) => item.studentId || index.toString()}
              renderItem={({ item }) => (
                <View style={styles.studentCard}>
                  <View style={styles.studentTop}>
                    <UserCircle2 size={42} color={COLORS.accent} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={styles.studentName}>{item.fullName}</Text>
                      <Text style={styles.studentId}>{item.studentId}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <GraduationCap size={16} color={COLORS.accent} />
                    <Text style={styles.infoText}>Class: {item.grade} - {item.section}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  heading: { fontSize: 32, fontWeight: "900", color: COLORS.primary },
  subHeading: { marginTop: 6, fontSize: 14, color: COLORS.textSub },
  searchBox: { backgroundColor: COLORS.white, height: 56, borderRadius: 18, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 22, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.textMain },
  studentsCard: { backgroundColor: COLORS.white, borderRadius: 24, paddingVertical: 28, alignItems: "center", marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  studentsTitle: { marginTop: 12, fontSize: 20, fontWeight: "800", color: COLORS.primary },
  studentsDesc: { marginTop: 6, fontSize: 13, color: COLORS.textSub },
  form: { backgroundColor: COLORS.white, borderRadius: 28, padding: 22, borderWidth: 1, borderColor: COLORS.border },
  formTitle: { fontSize: 22, fontWeight: "900", color: COLORS.primary, marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 16, marginBottom: 18, fontSize: 15, color: COLORS.textMain },
  button: { backgroundColor: COLORS.accent, paddingVertical: 18, borderRadius: 18, alignItems: "center", marginTop: 8 },
  buttonText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalCard: { maxHeight: "80%", backgroundColor: COLORS.white, borderRadius: 28, padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: "900", color: COLORS.primary },
  studentCard: { backgroundColor: COLORS.background, borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  studentTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  studentName: { fontSize: 17, fontWeight: "800", color: COLORS.textMain },
  studentId: { marginTop: 2, fontSize: 12, color: COLORS.textSub },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  infoText: { marginLeft: 10, fontSize: 13, color: COLORS.textMain },
});