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
  // Custom theme palette
  primary: "#E35336", // Burnt Sienna
  accent: "#F5F50C", // Bright Yellow
  secondary: "#F4A460", // Sandy Brown

  // Derived shades
  primaryLight: "#FEE2DB",
  primaryDark: "#C73E21",
  secondaryLight: "#FEF0E8",
  accentLight: "#FEFCE8",

  // New background colors to reduce white
  bgWarm: "#FFF8F2", // Warm sandy background
  bgCard: "#FFFFFF",
  bgCardAlt: "#FFFBF7",
  bgHeader: "#FFFFFF",

  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  white: "#FFFFFF",
  border: "#F0E4D8",
  shadowLight: "#E8D5C4",
  shadowMedium: "#D4BFA8",

  // Status colors (using theme)
  present: "#F4A460", // Sandy Brown
  absent: "#E35336", // Burnt Sienna
  presentLight: "#FEF0E8",
  absentLight: "#FDE8E3",
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
        backgroundColor={COLORS.bgHeader}
        translucent={false}
      />

      {/* --- HEADER with theme accent --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mark Attendance</Text>
        <TouchableOpacity
          onPress={() => router.push("/teacher/attendance/history")}
          style={styles.historyButton}
          activeOpacity={0.7}
        >
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.contentWrapper, { maxWidth: isDesktop ? 800 : "100%" }]}
      >
        {/* --- CLASS SELECTOR DROPDOWN with warm card --- */}
        <View style={styles.selectorContainer}>
          <Text style={styles.label}>Select Class & Section</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.7}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>{selectedClass}</Text>
            <ChevronDown size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* --- STUDENT LIST with themed cards --- */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {students.map((student, index) => (
            <View
              key={student.id}
              style={[
                styles.studentCard,
                index === students.length - 1 && styles.lastCard,
                student.status === "present"
                  ? styles.presentCard
                  : styles.absentCard,
              ]}
            >
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
                  activeOpacity={0.7}
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
                      student.status === "present" && styles.btnTextActive,
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
                  activeOpacity={0.7}
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
                      student.status === "absent" && styles.btnTextActive,
                    ]}
                  >
                    A
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* --- BOTTOM ACTION BAR with gradient-like solid color --- */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>Submit Attendance</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CUSTOM DROPDOWN MODAL with warm styling --- */}
      <Modal visible={isDropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
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
                activeOpacity={0.7}
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
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.bgWarm, // Warm sandy background instead of white
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: COLORS.bgHeader,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  historyButton: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  historyText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },
  selectorContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: COLORS.bgCard,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.bgWarm,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  studentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
  },
  presentCard: {
    backgroundColor: COLORS.presentLight,
    borderColor: COLORS.present,
  },
  absentCard: {
    backgroundColor: COLORS.absentLight,
    borderColor: COLORS.absent,
  },
  lastCard: {
    marginBottom: 0,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgCard,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 18,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  studentRoll: {
    fontSize: 13,
    color: COLORS.textTertiary,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 6,
    minWidth: 64,
  },
  btnInactive: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnPresentActive: {
    backgroundColor: COLORS.present,
    shadowColor: COLORS.present,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnAbsentActive: {
    backgroundColor: COLORS.absent,
    shadowColor: COLORS.absent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnText: {
    fontWeight: "700",
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  btnTextActive: {
    color: COLORS.white,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: COLORS.bgHeader,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: COLORS.shadowLight,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.bgWarm,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: "70%",
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  modalOption: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  modalOptionActive: {
    backgroundColor: COLORS.secondaryLight,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
    paddingHorizontal: 12,
  },
  modalOptionTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
