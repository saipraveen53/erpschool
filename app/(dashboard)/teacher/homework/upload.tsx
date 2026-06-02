import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, ChevronDown, UploadCloud } from "lucide-react-native";
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
  border: "#EAEAEE",
  white: "#FFFFFF",
};

const CLASSES = ["10-A", "10-B", "11-Science", "12-Science"];

export default function AssignHomeworkScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [selectedClass, setSelectedClass] = useState("Select Class");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAssign = () => {
    if (!title || selectedClass === "Select Class") {
      alert("Please fill in the class and title.");
      return;
    }
    alert("Homework Assigned Successfully!");
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
        <Text style={styles.headerTitle}>Assign Homework</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.formContainer,
          { maxWidth: isDesktop ? 800 : "100%" },
        ]}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Class & Section</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownVisible(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                selectedClass === "Select Class" && {
                  color: COLORS.textSecondary,
                },
              ]}
            >
              {selectedClass}
            </Text>
            <ChevronDown size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assignment Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Chapter 5 Practice Questions"
            placeholderTextColor="#A0522D80"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. YYYY-MM-DD"
            placeholderTextColor="#A0522D80"
            value={dueDate}
            onChangeText={setDueDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description & Instructions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide detailed instructions..."
            placeholderTextColor="#A0522D80"
            multiline
            numberOfLines={4}
            value={desc}
            onChangeText={setDesc}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.uploadBox}>
          <UploadCloud
            size={32}
            color={COLORS.primary}
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.uploadTitle}>Attach a File</Text>
          <Text style={styles.uploadSub}>PDF, DOCX, or Images (Max 5MB)</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleAssign}>
          <Text style={styles.submitBtnText}>Assign Homework</Text>
        </TouchableOpacity>
      </View>

      {/* Class Selector Modal */}
      <Modal visible={isDropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Class</Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bgWhite },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  formContainer: {
    padding: 24,
    alignSelf: "center",
    width: "100%",
    paddingBottom: 100,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: "transparent",
  },
  textArea: { minHeight: 120 },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  dropdownText: { fontSize: 16, color: COLORS.textPrimary, fontWeight: "600" },
  uploadBox: {
    backgroundColor: "rgba(227, 83, 54, 0.05)",
    borderWidth: 2,
    borderColor: "rgba(227, 83, 54, 0.2)",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginTop: 10,
  },
  uploadTitle: { fontSize: 16, fontWeight: "700", color: COLORS.primary },
  uploadSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    backgroundColor: COLORS.bgWhite,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
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
