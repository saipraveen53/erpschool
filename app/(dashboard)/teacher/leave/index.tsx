import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle,
  ChevronDown,
  Clock,
  XCircle,
} from "lucide-react-native";
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
  primary: "#E35336", // Terracotta
  textPrimary: "#5C2E14", // Dark Brown
  textSecondary: "#A0522D", // Sienna
  white: "#FFFFFF",
  border: "#EAEAEE",
  success: "#2E7D32",
  warning: "#F57C00",
  danger: "#C62828",
};

const LEAVE_TYPES = [
  "Casual Leave (CL)",
  "Sick Leave (SL)",
  "Earned Leave (EL)",
  "Other",
];

const LEAVE_BALANCES = [
  { type: "Casual", available: 4, total: 10 },
  { type: "Sick", available: 5, total: 8 },
  { type: "Earned", available: 12, total: 15 },
];

const LEAVE_HISTORY = [
  {
    id: "1",
    type: "Sick Leave (SL)",
    duration: "June 12, 2026 - June 13, 2026",
    days: 2,
    status: "Pending",
    reason: "Viral fever and weakness.",
  },
  {
    id: "2",
    type: "Casual Leave (CL)",
    duration: "May 20, 2026",
    days: 1,
    status: "Approved",
    reason: "Attending a family function.",
  },
  {
    id: "3",
    type: "Other",
    duration: "April 10, 2026 - April 14, 2026",
    days: 5,
    status: "Rejected",
    reason: "Personal travel.",
  },
];

export default function LeaveManagementScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [isApplyModalVisible, setApplyModalVisible] = useState(false);
  const [isTypeDropdownVisible, setTypeDropdownVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("Select Leave Type");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleApplyLeave = () => {
    if (selectedType === "Select Leave Type" || !startDate || !reason) {
      alert("Please fill in all required fields.");
      return;
    }
    alert("Leave application submitted successfully!");
    setApplyModalVisible(false);
    // Reset form
    setSelectedType("Select Leave Type");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Approved":
        return {
          color: COLORS.success,
          bg: "rgba(46, 125, 50, 0.1)",
          icon: CheckCircle,
        };
      case "Rejected":
        return {
          color: COLORS.danger,
          bg: "rgba(198, 40, 40, 0.1)",
          icon: XCircle,
        };
      default:
        return {
          color: COLORS.warning,
          bg: "rgba(245, 124, 0, 0.1)",
          icon: Clock,
        };
    }
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
        <Text style={styles.headerTitle}>Leave Management</Text>
        <TouchableOpacity
          style={styles.applyIconButton}
          onPress={() => setApplyModalVisible(true)}
        >
          <CalendarPlus size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.contentWrapper,
          { maxWidth: isDesktop ? 800 : "100%" },
        ]}
      >
        {/* --- BALANCES SECTION --- */}
        <Text style={styles.sectionTitle}>Leave Balances</Text>
        <View style={styles.balancesRow}>
          {LEAVE_BALANCES.map((balance, index) => (
            <View key={index} style={styles.balanceBox}>
              <Text style={styles.balanceAvailable}>{balance.available}</Text>
              <Text style={styles.balanceTotal}>/ {balance.total}</Text>
              <Text style={styles.balanceLabel}>{balance.type}</Text>
            </View>
          ))}
        </View>

        {/* --- APPLY BUTTON --- */}
        <TouchableOpacity
          style={styles.mainApplyButton}
          activeOpacity={0.9}
          onPress={() => setApplyModalVisible(true)}
        >
          <Text style={styles.mainApplyButtonText}>Apply for New Leave</Text>
        </TouchableOpacity>

        {/* --- HISTORY SECTION --- */}
        <Text style={styles.sectionTitle}>Leave History</Text>
        <View style={styles.historyContainer}>
          {LEAVE_HISTORY.map((leave) => {
            const StatusIcon = getStatusDisplay(leave.status).icon;
            const statusColor = getStatusDisplay(leave.status).color;
            const statusBg = getStatusDisplay(leave.status).bg;

            return (
              <View key={leave.id} style={styles.leaveCard}>
                <View style={styles.leaveHeader}>
                  <Text style={styles.leaveType}>{leave.type}</Text>
                  <View
                    style={[styles.statusBadge, { backgroundColor: statusBg }]}
                  >
                    <StatusIcon size={14} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {leave.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.leaveDuration}>
                  {leave.duration} • {leave.days} Day(s)
                </Text>

                <View style={styles.reasonBox}>
                  <Text style={styles.reasonText}>"{leave.reason}"</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* --- APPLY LEAVE MODAL --- */}
      <Modal visible={isApplyModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              {
                maxWidth: isDesktop ? 600 : "100%",
                width: "100%",
                alignSelf: "center",
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Leave</Text>
              <TouchableOpacity
                onPress={() => setApplyModalVisible(false)}
                style={styles.closeButton}
              >
                <XCircle size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Leave Type</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setTypeDropdownVisible(!isTypeDropdownVisible)}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      selectedType === "Select Leave Type" && {
                        color: "#A0522D80",
                      },
                    ]}
                  >
                    {selectedType}
                  </Text>
                  <ChevronDown size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
                {isTypeDropdownVisible && (
                  <View style={styles.dropdownList}>
                    {LEAVE_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedType(type);
                          setTypeDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Start Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#A0522D80"
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
                <View style={{ width: 16 }} />
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>End Date (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#A0522D80"
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reason</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Explain briefly..."
                  placeholderTextColor="#A0522D80"
                  multiline
                  numberOfLines={4}
                  value={reason}
                  onChangeText={setReason}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleApplyLeave}
            >
              <Text style={styles.submitBtnText}>Submit Application</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  applyIconButton: {
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    padding: 8,
    borderRadius: 8,
  },

  contentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
    paddingBottom: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },

  // Balances
  balancesRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  balanceBox: {
    flex: 1,
    backgroundColor: COLORS.bgWhite,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceAvailable: { fontSize: 28, fontWeight: "900", color: COLORS.primary },
  balanceTotal: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "700",
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  // Apply Button
  mainApplyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 32,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mainApplyButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // History
  historyContainer: { gap: 16 },
  leaveCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.textSecondary,
  },
  leaveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  leaveType: { fontSize: 16, fontWeight: "800", color: COLORS.textPrimary },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: { fontSize: 12, fontWeight: "800" },
  leaveDuration: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 12,
  },
  reasonBox: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  reasonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },

  // Modal
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
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  closeButton: { padding: 4 },
  inputGroup: { marginBottom: 20, zIndex: 10 },
  rowInputs: { flexDirection: "row", zIndex: 1 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  textArea: { minHeight: 100 },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  dropdownText: { fontSize: 16, color: COLORS.textPrimary, fontWeight: "600" },
  dropdownList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
});
