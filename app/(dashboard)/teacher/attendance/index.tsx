import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Check, ChevronDown, UserX } from "lucide-react-native";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

const COLORS = {
  bgWhite: "#FFFFFF",
  lightGray: "#F5F5F5",
  primary: "#E35336", // Terracotta
  darkBg: "#2A1308", // Deep Brown
  textPrimary: "#5C2E14", // Dark Brown
  textSecondary: "#A0522D", // Sienna
  white: "#FFFFFF",
  success: "#2E7D32",
  danger: "#C62828",
};

const CLASSES = ["9-A", "9-B", "10-A", "10-B", "11-Science", "11-Commerce"];

// Dummy student data
const INITIAL_STUDENTS = [
  { id: "1", name: "Aarav Sharma", roll: "101", status: "present" },
  { id: "2", name: "Priya Patel", roll: "102", status: "present" },
  { id: "3", name: "Rohan Gupta", roll: "103", status: "present" },
  { id: "4", name: "Ananya Singh", roll: "104", status: "present" },
  { id: "5", name: "Kabir Verma", roll: "105", status: "present" },
];

export default function MarkAttendanceScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [selectedClass, setSelectedClass] = useState("10-A");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const toggleStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              status: student.status === "present" ? "absent" : "present",
            }
          : student,
      ),
    );
  };

  const handleSave = () => {
    const presentCount = students.filter((s) => s.status === "present").length;
    alert(
      `Saved! ${presentCount} Present, ${students.length - presentCount} Absent.`,
    );
    router.back();
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mark Attendance</Text>
        <TouchableOpacity
          onPress={() => router.push("/teacher/attendance/history")}
          style={styles.historyButton}
        >
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.contentWrapper, { maxWidth: isDesktop ? 800 : "100%" }]}
      >
        {/* --- CLASS SELECTOR DROPDOWN --- */}
        <View style={styles.selectorContainer}>
          <Text style={styles.label}>Select Class & Section</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.8}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>{selectedClass}</Text>
            <ChevronDown size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* --- STUDENT LIST --- */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {students.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {student.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>
                    Roll No: {student.roll}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusBtn,
                    student.status === "present"
                      ? styles.btnPresentActive
                      : styles.btnInactive,
                  ]}
                  onPress={() => toggleStatus(student.id)}
                >
                  <Check
                    size={16}
                    color={
                      student.status === "present"
                        ? COLORS.white
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.btnText,
                      student.status === "present" && { color: COLORS.white },
                    ]}
                  >
                    P
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusBtn,
                    student.status === "absent"
                      ? styles.btnAbsentActive
                      : styles.btnInactive,
                  ]}
                  onPress={() => toggleStatus(student.id)}
                >
                  <UserX
                    size={16}
                    color={
                      student.status === "absent"
                        ? COLORS.white
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.btnText,
                      student.status === "absent" && { color: COLORS.white },
                    ]}
                  >
                    A
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* --- BOTTOM ACTION BAR --- */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Submit Attendance</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CUSTOM DROPDOWN MODAL --- */}
      <Modal visible={isDropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Class</Text>
            {CLASSES.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.modalOption,
                  selectedClass === cls && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setSelectedClass(cls);
                  setDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedClass === cls && styles.modalOptionTextActive,
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  historyButton: {
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  historyText: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
  contentWrapper: { flex: 1, width: "100%", alignSelf: "center" },
  selectorContainer: {
    padding: 24,
    backgroundColor: COLORS.bgWhite,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAEAEE",
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  listContainer: { paddingHorizontal: 24, paddingBottom: 100 },
  studentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.bgWhite,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: COLORS.primary, fontWeight: "800", fontSize: 16 },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  studentRoll: { fontSize: 13, color: COLORS.textSecondary },
  actionButtons: { flexDirection: "row", gap: 8 },
  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  btnInactive: { backgroundColor: COLORS.lightGray },
  btnPresentActive: { backgroundColor: COLORS.success },
  btnAbsentActive: { backgroundColor: COLORS.danger },
  btnText: { fontWeight: "700", fontSize: 14, color: COLORS.textSecondary },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    backgroundColor: COLORS.bgWhite,
    borderTopWidth: 1,
    borderTopColor: "#EAEAEE",
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.bgWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
  },
  modalOptionActive: { backgroundColor: "rgba(227, 83, 54, 0.05)" },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  modalOptionTextActive: { color: COLORS.primary, fontWeight: "800" },
});
