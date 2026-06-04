import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator, Modal, TextInput, Alert, Platform } from "react-native";
import { FileText, Calendar, Clock, CheckCircle, XCircle, User, X } from "lucide-react-native";
import { useState, useEffect } from "react";
import { rootApi } from "../../../utils/axiosInstance";


export default function LeavesManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");

  // Action Modal State
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [actionRemarks, setActionRemarks] = useState("");
  const [actionStatus, setActionStatus] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [processing, setProcessing] = useState(false);

  const statuses = ["PENDING", "APPROVED", "REJECTED"];

  const fetchLeaves = async (status: string) => {
    try {
      setLoading(true);
      const response = await rootApi.get(`/api/teacher/leave/byStatus?status=${status}`);
      if (response.data) {
        // Sort by appliedOn descending
        const sorted = response.data.sort((a: any, b: any) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime());
        setLeaves(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves(selectedStatus);
  }, [selectedStatus]);

  const openActionModal = (leave: any, status: "APPROVED" | "REJECTED") => {
    setSelectedLeave(leave);
    setActionStatus(status);
    setActionRemarks("");
    setActionModalVisible(true);
  };

  const submitAction = async () => {
    if (!actionRemarks.trim()) {
      Alert.alert("Error", "Please provide remarks for this action.");
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        remarks: actionRemarks,
        leaveStatus: actionStatus
      };
      await rootApi.put(`/api/teacher/leave/action?id=${selectedLeave.leaveId}`, payload);
      
      Alert.alert("Success", `Leave has been ${actionStatus?.toLowerCase()} successfully.`);
      setActionModalVisible(false);
      fetchLeaves(selectedStatus);
    } catch (error) {
      console.error("Failed to update leave:", error);
      Alert.alert("Error", "Failed to update leave status.");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "#16a34a"; // Green
      case "REJECTED": return "#dc2626"; // Red
      case "PENDING": default: return "#f59e0b"; // Yellow/Orange
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "#dcfce7";
      case "REJECTED": return "#fee2e2";
      case "PENDING": default: return "#fef3c7";
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { padding: isMobile ? 14 : 24, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 16 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 26 }]}>Staff Leaves</Text>
          <Text style={styles.headerSubtitle}>View and track leave applications from school staff.</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: isMobile ? 12 : 24, paddingTop: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
          {statuses.map(status => (
            <TouchableOpacity 
              key={status} 
              style={[styles.statusChip, selectedStatus === status && styles.statusChipActive]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[styles.statusChipText, selectedStatus === status && styles.statusChipTextActive]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
        ) : leaves.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <FileText size={48} color="#E7E5E4" />
            <Text style={styles.emptyText}>No {selectedStatus.toLowerCase()} leaves found.</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 }}>
            {leaves.map((leave) => (
              <View key={leave.leaveId} style={{ width: isMobile ? "100%" : "50%", padding: 8 }}>
                <View style={styles.leaveCard}>
                  <View style={styles.cardHeader}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                      <View style={styles.avatarContainer}>
                        <User size={20} color="#E35336" />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.teacherName} numberOfLines={1}>{leave.teacherName}</Text>
                        <Text style={styles.leaveType}>{leave.leaveType} LEAVE</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(leave.leaveStatus) }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(leave.leaveStatus) }]}>{leave.leaveStatus}</Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.dateRow}>
                      <View style={styles.dateItem}>
                        <Text style={styles.dateLabel}>Start Date</Text>
                        <View style={styles.dateValueContainer}>
                          <Calendar size={14} color="#78716C" style={{ marginRight: 6 }} />
                          <Text style={styles.dateValue}>{formatDate(leave.startDate)}</Text>
                        </View>
                      </View>
                      <View style={styles.dateDivider} />
                      <View style={styles.dateItem}>
                        <Text style={styles.dateLabel}>End Date</Text>
                        <View style={styles.dateValueContainer}>
                          <Calendar size={14} color="#78716C" style={{ marginRight: 6 }} />
                          <Text style={styles.dateValue}>{formatDate(leave.endDate)}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.reasonContainer}>
                      <Text style={styles.reasonLabel}>Reason:</Text>
                      <Text style={styles.reasonText}>{leave.reason}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Clock size={12} color="#A8A29E" style={{ marginRight: 4 }} />
                      <Text style={styles.appliedOnText}>Applied: {formatDate(leave.appliedOn)}</Text>
                    </View>
                    
                    {leave.leaveStatus === 'PENDING' && (
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity style={styles.actionBtnReject} onPress={() => openActionModal(leave, 'REJECTED')}>
                          <XCircle size={16} color="#dc2626" />
                          <Text style={styles.actionBtnRejectText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtnApprove} onPress={() => openActionModal(leave, 'APPROVED')}>
                          <CheckCircle size={16} color="#16a34a" />
                          <Text style={styles.actionBtnApproveText}>Approve</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action Modal */}
      <Modal visible={actionModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 450 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {actionStatus === "APPROVED" ? "Approve Leave" : "Reject Leave"}
              </Text>
              <TouchableOpacity onPress={() => setActionModalVisible(false)}>
                <X size={24} color="#A8A29E" />
              </TouchableOpacity>
            </View>

            {selectedLeave && (
              <View style={styles.modalSummaryBox}>
                <Text style={styles.modalSummaryText}><Text style={{fontWeight: 'bold'}}>Teacher:</Text> {selectedLeave.teacherName}</Text>
                <Text style={styles.modalSummaryText}><Text style={{fontWeight: 'bold'}}>Dates:</Text> {formatDate(selectedLeave.startDate)} - {formatDate(selectedLeave.endDate)}</Text>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Remarks *</Text>
              <TextInput 
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
                value={actionRemarks} 
                onChangeText={setActionRemarks} 
                placeholder={actionStatus === "APPROVED" ? "E.g., Approved, enjoy your leave." : "E.g., Not enough leave balance."} 
                placeholderTextColor="#A8A29E" 
                multiline 
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.saveBtn, 
                { backgroundColor: actionStatus === "APPROVED" ? "#16a34a" : "#dc2626" }
              ]} 
              onPress={submitAction} 
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>
                  Confirm {actionStatus === "APPROVED" ? "Approval" : "Rejection"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", justifyContent: "space-between" },
  headerTitle: { fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },
  
  statusChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E6D8D2" },
  statusChipActive: { backgroundColor: "#E35336", borderColor: "#E35336" },
  statusChipText: { fontSize: 13, fontWeight: "600", color: "#8A6B5D" },
  statusChipTextActive: { color: "#fff" },

  emptyStateContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { textAlign: "center", marginTop: 16, color: "#B8A095", fontSize: 15 },

  leaveCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#E6D8D2", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, overflow: 'hidden' },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#F5F5DC", backgroundColor: "#fafaf9" },
  
  avatarContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(227, 83, 54, 0.1)", justifyContent: "center", alignItems: "center" },
  teacherName: { fontSize: 16, fontWeight: "bold", color: "#A0522D" },
  leaveType: { fontSize: 11, color: "#8A6B5D", fontWeight: "600", marginTop: 2 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: "bold" },
  
  cardBody: { padding: 16 },
  dateRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F5F5DC", borderRadius: 12, padding: 12, marginBottom: 16 },
  dateItem: { flex: 1 },
  dateDivider: { width: 1, height: "80%", backgroundColor: "#E6D8D2", marginHorizontal: 12 },
  dateLabel: { fontSize: 11, color: "#8A6B5D", fontWeight: "600", marginBottom: 4, textTransform: "uppercase" },
  dateValueContainer: { flexDirection: "row", alignItems: "center" },
  dateValue: { fontSize: 14, fontWeight: "600", color: "#A0522D" },
  
  reasonContainer: { marginTop: 4 },
  reasonLabel: { fontSize: 12, fontWeight: "600", color: "#705244", marginBottom: 4 },
  reasonText: { fontSize: 14, color: "#A0522D", lineHeight: 20 },
  
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#F5F5DC" },
  appliedOnText: { fontSize: 11, color: "#B8A095", fontWeight: "500" },
  
  actionBtnReject: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  actionBtnRejectText: { color: '#dc2626', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  
  actionBtnApprove: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  actionBtnApproveText: { color: '#16a34a', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D" },
  
  modalSummaryBox: { backgroundColor: '#F5F5DC', padding: 12, borderRadius: 8, marginBottom: 16 },
  modalSummaryText: { fontSize: 14, color: '#705244', marginBottom: 4 },

  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#705244", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 8, padding: 12, fontSize: 15, color: "#A0522D", backgroundColor: "#F5F5DC", ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any },
  
  saveBtn: { padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
