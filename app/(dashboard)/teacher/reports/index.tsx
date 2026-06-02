import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Award,
  ChevronDown,
  ShieldCheck,
  Star,
} from "lucide-react-native";
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
  textPrimary: "#5C2E14", // Dark Brown
  textSecondary: "#A0522D", // Sienna
  border: "#EAEAEE",
  success: "#2E7D32",
  warning: "#F57C00",
  danger: "#C62828",
};

const CLASSES = ["10-A", "10-B", "11-Science", "12-Science"];

// Comprehensive student data
const DUMMY_STUDENTS = [
  {
    id: "1",
    name: "Aarav Sharma",
    score: 92,
    grade: "A+",
    discipline: "Excellent",
    overall: "Outstanding",
  },
  {
    id: "2",
    name: "Priya Patel",
    score: 85,
    grade: "A",
    discipline: "Good",
    overall: "Very Good",
  },
  {
    id: "3",
    name: "Rohan Gupta",
    score: 65,
    grade: "C",
    discipline: "Needs Attention",
    overall: "Average",
  },
  {
    id: "4",
    name: "Ananya Singh",
    score: 42,
    grade: "F",
    discipline: "Poor",
    overall: "Needs Help",
  },
];

export default function ComprehensiveReportsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [selectedClass, setSelectedClass] = useState("10-A");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return COLORS.success;
    if (score >= 60) return COLORS.warning;
    return COLORS.danger;
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
        <Text style={styles.headerTitle}>Class Performance</Text>
        <View style={{ width: 40 }} />
      </View>

      <View
        style={[styles.contentWrapper, { maxWidth: isDesktop ? 800 : "100%" }]}
      >
        {/* --- CLASS FILTER --- */}
        <View style={styles.selectorContainer}>
          <Text style={styles.label}>Select Class</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.8}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>{selectedClass}</Text>
            <ChevronDown size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* --- COMPREHENSIVE STUDENT LIST --- */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {DUMMY_STUDENTS.map((student) => {
            const statusColor = getPerformanceColor(student.score);
            return (
              <View key={student.id} style={styles.studentCard}>
                {/* Header: Name & Overall Badge */}
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <View
                    style={[
                      styles.overallBadge,
                      { backgroundColor: `${statusColor}15` },
                    ]}
                  >
                    <Star
                      size={12}
                      color={statusColor}
                      fill={statusColor}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.overallText, { color: statusColor }]}>
                      {student.overall}
                    </Text>
                  </View>
                </View>

                {/* Metrics Grid */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metricBox}>
                    <View style={styles.metricIconRow}>
                      <Award size={14} color={COLORS.textSecondary} />
                      <Text style={styles.metricLabel}>Grade</Text>
                    </View>
                    <Text style={[styles.metricValue, { color: statusColor }]}>
                      {student.grade}
                    </Text>
                  </View>

                  <View style={[styles.metricBox, styles.metricBoxMiddle]}>
                    <View style={styles.metricIconRow}>
                      <ShieldCheck size={14} color={COLORS.textSecondary} />
                      <Text style={styles.metricLabel}>Discipline</Text>
                    </View>
                    <Text style={styles.metricValue}>{student.discipline}</Text>
                  </View>

                  <View style={styles.metricBox}>
                    <View style={styles.metricIconRow}>
                      <Text style={styles.metricLabel}>Marks</Text>
                    </View>
                    <Text style={[styles.metricValue, { fontSize: 20 }]}>
                      {student.score}%
                    </Text>
                  </View>
                </View>

                {/* Progress Bar for Marks */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${student.score}%`,
                          backgroundColor: statusColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* --- DROPDOWN MODAL --- */}
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
    paddingTop: 40,
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

  listContainer: { paddingHorizontal: 24, paddingBottom: 40, gap: 16 },

  studentCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  studentName: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  overallBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  overallText: { fontSize: 12, fontWeight: "800", textTransform: "uppercase" },

  metricsGrid: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  metricBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  metricBoxMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
  },
  metricIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  metricLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600" },
  metricValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  progressContainer: { marginTop: 4 },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 3 },

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
