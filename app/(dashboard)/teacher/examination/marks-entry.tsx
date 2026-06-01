import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

const COLORS = {
  bgWhite: "#FFFFFF",
  lightGray: "#F5F5F5",
  primary: "#E35336",
  textPrimary: "#5C2E14",
  textSecondary: "#A0522D",
  white: "#FFFFFF",
  border: "#EAEAEE",
};

const EXAMS = [
  "Mid-Term: 10-A Math",
  "Mid-Term: 11-Sci Physics",
  "Unit Test 2: 10-B Math",
];

const INITIAL_STUDENTS = [
  { id: "1", name: "Aarav Sharma", roll: "101", marks: "85" },
  { id: "2", name: "Priya Patel", roll: "102", marks: "92" },
  { id: "3", name: "Rohan Gupta", roll: "103", marks: "" },
  { id: "4", name: "Ananya Singh", roll: "104", marks: "78" },
];

export default function MarksEntryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [selectedExam, setSelectedExam] = useState(EXAMS[0]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const updateMarks = (id: string, value: string) => {
    // Basic validation to allow only numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, marks: numericValue } : student,
      ),
    );
  };

  const handleSave = () => {
    alert("Marks updated successfully!");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Marks</Text>
        <View style={{ width: 40 }} />
      </View>

      <View
        style={[styles.contentWrapper, { maxWidth: isDesktop ? 800 : "100%" }]}
      >
        <View style={styles.selectorContainer}>
          <Text style={styles.label}>Select Exam & Class</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.8}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>{selectedExam}</Text>
            <ChevronDown size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.colHeader}>Student Info</Text>
          <Text style={styles.colHeaderRight}>Marks (100)</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {students.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentRoll}>Roll No: {student.roll}</Text>
              </View>
              <TextInput
                style={styles.marksInput}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="--"
                placeholderTextColor="#A0522D80"
                value={student.marks}
                onChangeText={(val) => updateMarks(student.id, val)}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Marks</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Modal */}
      <Modal visible={isDropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Assessment</Text>
            {EXAMS.map((exam) => (
              <TouchableOpacity
                key={exam}
                style={[
                  styles.modalOption,
                  selectedExam === exam && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setSelectedExam(exam);
                  setDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedExam === exam && styles.modalOptionTextActive,
                  ]}
                >
                  {exam}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
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
    borderBottomColor: COLORS.border,
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
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
    borderColor: COLORS.border,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingBottom: 8,
  },
  colHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
  },
  colHeaderRight: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    textAlign: "right",
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
  studentInfo: { flex: 1 },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  studentRoll: { fontSize: 13, color: COLORS.textSecondary },
  marksInput: {
    backgroundColor: COLORS.lightGray,
    width: 70,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    backgroundColor: COLORS.bgWhite,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
    borderBottomColor: COLORS.border,
  },
  modalOptionActive: { backgroundColor: "rgba(227, 83, 54, 0.05)" },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  modalOptionTextActive: { color: COLORS.primary, fontWeight: "800" },
});
