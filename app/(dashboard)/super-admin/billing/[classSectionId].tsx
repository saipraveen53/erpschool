import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator, Modal, Alert } from "react-native";
import { ArrowLeft, UserCircle, IndianRupee, CheckCircle, AlertCircle, X } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { rootApi } from "../../../utils/axiosInstance";

const BILLING_BASE_URL = "http://192.168.88.20:8081";

export default function ClassBillingDetails() {
  const { classSectionId } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [studentSummary, setStudentSummary] = useState<any>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classSectionId) return;
      try {
        setLoading(true);
        const response = await rootApi.get(`${BILLING_BASE_URL}/api/student/fee/admin/class-status/${classSectionId}`);
        if (response.data) {
          setStudents(response.data);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          Alert.alert("Notice", "no students in here");
          setStudents([]);
        } else {
          console.error("Failed to fetch class status:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [classSectionId]);

  const openStudentSummary = async (student: any) => {
    setSelectedStudent(student);
    setStudentSummary(null);
    setModalVisible(true);
    setSummaryLoading(true);

    try {
      const response = await rootApi.get(`${BILLING_BASE_URL}/api/student/fee/student/summary/${student.studentId}`);
      if (response.data) {
        setStudentSummary(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch student summary:", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { padding: isMobile ? 14 : 24 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#A0522D" />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 18 : 24 }]}>Class Fee Status</Text>
          <Text style={styles.headerSubtitle}>Check and update fee records for each student in this class.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
        ) : students.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <IndianRupee size={48} color="#E6D8D2" />
            <Text style={styles.emptyText}>No fee records for this class.</Text>
          </View>
        ) : (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2.5 }]}>Student</Text>
              {!isMobile && <Text style={[styles.th, { flex: 1.5, textAlign: "center" }]}>Roll No</Text>}
              <Text style={[styles.th, { flex: 2, textAlign: "right" }]}>Total Fee</Text>
              <Text style={[styles.th, { flex: 2, textAlign: "right" }]}>Balance</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: "center" }]}>Status</Text>
            </View>
            
            {students.map((student, idx) => {
              const isPaid = student.status === "PAID" || student.balanceAmount === 0;
              return (
                <TouchableOpacity
                  key={student.studentId}
                  style={[styles.tableRow, idx === students.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => openStudentSummary(student)}
                >
                  <View style={[styles.td, { flex: 2.5, flexDirection: "row", alignItems: "center" }]}>
                    <View style={styles.avatarContainer}>
                      <Text style={styles.avatarText}>{student.studentName?.charAt(0) || "S"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName} numberOfLines={1}>{student.studentName}</Text>
                      {isMobile && <Text style={styles.rollNoMobile}>Roll: {student.rollNumber}</Text>}
                    </View>
                  </View>

                  {!isMobile && (
                    <View style={[styles.td, { flex: 1.5, alignItems: "center" }]}>
                      <Text style={styles.rollNoText}>{student.rollNumber}</Text>
                    </View>
                  )}

                  <View style={[styles.td, { flex: 2, alignItems: "flex-end" }]}>
                    <Text style={styles.feeAmount}>{formatCurrency(student.totalFee)}</Text>
                  </View>

                  <View style={[styles.td, { flex: 2, alignItems: "flex-end" }]}>
                    <Text style={[styles.balanceAmount, isPaid ? { color: '#16a34a' } : { color: '#dc2626' }]}>
                      {formatCurrency(student.balanceAmount)}
                    </Text>
                  </View>

                  <View style={[styles.td, { flex: 1.5, alignItems: "center" }]}>
                    <View style={[styles.statusBadge, { backgroundColor: isPaid ? "#dcfce7" : "#fee2e2" }]}>
                      <Text style={[styles.statusText, { color: isPaid ? "#166534" : "#991b1b" }]}>
                        {isPaid ? "PAID" : "PENDING"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Student Summary Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 450 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Fee Summary</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#8A6B5D" />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <View style={styles.studentProfileMini}>
                <UserCircle size={48} color="#A0522D" />
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.studentProfileName}>{selectedStudent.studentName}</Text>
                  <Text style={styles.studentProfileId}>ID: {selectedStudent.studentId} • Roll: {selectedStudent.rollNumber}</Text>
                </View>
              </View>
            )}

            {summaryLoading ? (
              <ActivityIndicator size="large" color="#E35336" style={{ marginVertical: 30 }} />
            ) : studentSummary ? (
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Fee</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(studentSummary.totalFee)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Paid Amount</Text>
                  <Text style={[styles.summaryValue, { color: '#16a34a' }]}>{formatCurrency(studentSummary.paidAmount)}</Text>
                </View>
                <View style={[styles.summaryRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
                  <Text style={[styles.summaryLabel, { fontWeight: '700', color: '#dc2626' }]}>Pending Balance</Text>
                  <Text style={[styles.summaryValue, { color: '#dc2626', fontSize: 18 }]}>{formatCurrency(studentSummary.pendingAmount)}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.emptyText}>Failed to load summary.</Text>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2" },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#F4A460", justifyContent: "center", alignItems: "center", marginRight: 14 },
  headerTitle: { fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 13, color: "#8A6B5D", marginTop: 2 },
  
  emptyStateContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { textAlign: "center", marginTop: 16, color: "#B8A095", fontSize: 15 },

  tableContainer: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: "#E6D8D2" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F4A460", paddingVertical: 14, paddingHorizontal: 8, alignItems: "center" },
  th: { fontSize: 12, fontWeight: "600", color: "#8A6B5D" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F5F5DC", paddingVertical: 16, paddingHorizontal: 8, alignItems: "center" },
  td: { paddingHorizontal: 4, justifyContent: 'center' },
  
  avatarContainer: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#F5F5DC", justifyContent: "center", alignItems: "center", marginRight: 10, flexShrink: 0 },
  avatarText: { fontSize: 14, fontWeight: "bold", color: "#E35336" },
  studentName: { fontSize: 15, fontWeight: "600", color: "#A0522D" },
  rollNoMobile: { fontSize: 12, color: "#8A6B5D", marginTop: 2 },
  rollNoText: { fontSize: 13, color: "#705244", fontWeight: '500' },
  
  feeAmount: { fontSize: 14, color: "#334155", fontWeight: "600" },
  balanceAmount: { fontSize: 14, fontWeight: "700" },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: "700" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D" },
  
  studentProfileMini: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#E6D8D2' },
  studentProfileName: { fontSize: 16, fontWeight: 'bold', color: '#1C1917', marginBottom: 4 },
  studentProfileId: { fontSize: 13, color: '#78716C' },
  
  summaryBox: { backgroundColor: '#F5F5DC', borderRadius: 12, padding: 16, marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E6D8D2' },
  summaryLabel: { fontSize: 14, color: '#705244', fontWeight: '600' },
  summaryValue: { fontSize: 16, fontWeight: 'bold', color: '#334155' },

  closeBtn: { backgroundColor: "#F4A460", padding: 14, borderRadius: 8, alignItems: "center" },
  closeBtnText: { color: "#334155", fontWeight: "bold", fontSize: 15 },
});
