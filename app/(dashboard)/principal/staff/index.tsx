import React, { useState, useEffect } from 'react';
import { rootApi } from '../../../utils/axiosInstance';
import {
  StyleSheet, View, Text, TouchableOpacity, Modal,
  Alert, ActivityIndicator, TextInput, ScrollView, FlatList
} from 'react-native';
import * as Icons from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';

export default function StaffManagement() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [sendingBulk, setSendingBulk] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadedEmails, setUploadedEmails] = useState([]);

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // View Modal States
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);

  // ─── Fetch all teachers ───────────────────────────────────────────
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/teacher/all');
      setStaffList(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not load staff list.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Fetch teacher attendance ─────────────────────────────────────
  const fetchTeacherAttendance = async (teacherId) => {
    setViewLoading(true);
    try {
      const res = await rootApi.get(`/api/student/teacher/teacher/${teacherId}/attendance`);
      setAttendanceData(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not load attendance data.');
      setAttendanceData([]);
    } finally {
      setViewLoading(false);
    }
  };

  const handleViewPress = async (teacher) => {
    setSelectedTeacher(teacher);
    setViewModalVisible(true);
    await fetchTeacherAttendance(teacher.teacherId);
  };

  // ─── Search filter ────────────────────────────────────────────────
  const filteredStaff = staffList.filter(teacher => {
    const q = searchQuery.toLowerCase();
    return (
      teacher.teacherName?.toLowerCase().includes(q) ||
      teacher.email?.toLowerCase().includes(q) ||
      teacher.teacherId?.toLowerCase().includes(q) ||
      teacher.phone?.toLowerCase().includes(q)
    );
  });

  // ─── Bulk upload logic (untouched) ───────────────────────────────
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFileName(file.name);
        const response = await fetch(file.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          const extracted = jsonData
            .map(row => row.email || row.Email || row['EMAIL'] || row['Email Address'])
            .filter(e => typeof e === 'string' && e.includes('@'));
          setUploadedEmails([...new Set(extracted)]);
        };
        reader.readAsArrayBuffer(blob);
      }
    } catch (error) {
      Alert.alert('Error', 'File reading failed.');
    }
  };

  const confirmAndSend = () => {
    Alert.alert(
      "Confirm Send",
      `Are you sure you want to send invites to ${uploadedEmails.length} staff members?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK, Send", onPress: () => handleUploadAndSend() }
      ]
    );
  };

  const handleUploadAndSend = async () => {
    if (uploadedEmails.length === 0) {
      Alert.alert("Warning", "No valid emails found. Please check the file.");
      return;
    }
    setSendingBulk(true);
    try {
      await rootApi.post('/api/student/teacher/register-link/bulk', { emails: uploadedEmails });
      Alert.alert('Success', 'All invites sent successfully!');
      resetModal();
    } catch (error) {
      const errorMessage = error.response?.data || "Something went wrong, please try again.";
      const displayMessage = typeof errorMessage === 'string'
        ? errorMessage
        : (errorMessage.message || JSON.stringify(errorMessage));
      Alert.alert('Validation Error', displayMessage);
    } finally {
      setSendingBulk(false);
    }
  };

  const resetModal = () => {
    setUploadedEmails([]);
    setFileName('');
    setAddModalVisible(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PRESENT': return '#4caf50';
      case 'ABSENT': return '#f44336';
      case 'HALF_DAY': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusBgColor = (status) => {
    switch(status) {
      case 'PRESENT': return '#e8f5e9';
      case 'ABSENT': return '#ffebee';
      case 'HALF_DAY': return '#fff3e0';
      default: return '#f5f5f5';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ─── Table Row ────────────────────────────────────────────────────
  const renderRow = ({ item, index }) => (
    <View style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <Text style={[styles.cell, styles.cellId]} numberOfLines={1}>{item.teacherId}</Text>
      <View style={styles.cellName}>
        <Text style={styles.nameText} numberOfLines={1}>{item.teacherName}</Text>
        <Text style={styles.emailText} numberOfLines={1}>{item.email}</Text>
      </View>
      <Text style={[styles.cell, styles.cellPhone]} numberOfLines={1}>{item.phone}</Text>
      <Text style={[styles.cell, styles.cellExp]}>{item.experience}y</Text>
      <TouchableOpacity
        style={styles.viewBtn}
        onPress={() => handleViewPress(item)}
      >
        <Text style={styles.viewBtnText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* ── Header Row ── */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.mainTitle}>Staff Management</Text>
          <Text style={styles.subTitle}>Manage your teaching staff</Text>
        </View>
        <TouchableOpacity style={styles.addStaffButton} onPress={() => setAddModalVisible(true)}>
          <Icons.Plus color="#ffffff" size={16} />
          <Text style={styles.addStaffButtonText}>Bulk Add</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchBox}>
        <Icons.Search size={16} color="#a07850" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, ID or phone..."
          placeholderTextColor="#b0967a"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icons.X size={16} color="#a07850" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Table ── */}
      {loading ? (
        <ActivityIndicator size="large" color="#A0522D" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.cellId]}>ID</Text>
            <Text style={[styles.headerCell, styles.cellName]}>Name</Text>
            <Text style={[styles.headerCell, styles.cellPhone]}>Phone</Text>
            <Text style={[styles.headerCell, styles.cellExp]}>Exp</Text>
            <Text style={[styles.headerCell, { width: 60 }]}>Action</Text>
          </View>

          <FlatList
            data={filteredStaff}
            keyExtractor={(item) => item.teacherId}
            renderItem={renderRow}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No staff found.</Text>
            }
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* ── Bulk Add Modal (untouched) ── */}
      <Modal visible={addModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bulk Invitation</Text>
              <TouchableOpacity onPress={resetModal}>
                <Icons.X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {uploadedEmails.length === 0 ? (
              <TouchableOpacity style={[styles.actionButton, styles.selectBtn]} onPress={pickDocument}>
                <Text style={styles.btnText}>Select Excel / CSV File</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.previewContainer}>
                <Text style={styles.fileText}>File: {fileName}</Text>
                <Text style={styles.countText}>{uploadedEmails.length} Valid Emails Ready</Text>

                <TouchableOpacity
                  style={[styles.actionButton, styles.sendBtn]}
                  onPress={confirmAndSend}
                  disabled={sendingBulk}
                >
                  {sendingBulk
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>Send Invites Now</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setUploadedEmails([])}
                  disabled={sendingBulk}
                  style={styles.cancelBtn}
                >
                  <Text style={{ color: '#dc2626', fontWeight: '600' }}>Clear File</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Updated View Modal with Basic Teacher Details ── */}
      <Modal visible={viewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.viewModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Teacher Profile</Text>
              <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                <Icons.X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Teacher Avatar and Basic Info */}
              {selectedTeacher && (
                <>
                  <View style={styles.profileHeader}>
                    <View style={styles.profileAvatar}>
                      <Text style={styles.profileAvatarText}>
                        {selectedTeacher.teacherName?.charAt(0) || 'T'}
                      </Text>
                    </View>
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{selectedTeacher.teacherName}</Text>
                      <Text style={styles.profileId}>{selectedTeacher.teacherId}</Text>
                    </View>
                  </View>

                  {/* Contact Information Section */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>
                      <Icons.User size={14} color="#A0522D" /> Contact Information
                    </Text>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{selectedTeacher.email || 'N/A'}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Phone</Text>
                        <Text style={styles.infoValue}>{selectedTeacher.phone || 'N/A'}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Experience</Text>
                        <Text style={styles.infoValue}>{selectedTeacher.experience ? `${selectedTeacher.experience} years` : 'N/A'}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Qualification</Text>
                        <Text style={styles.infoValue}>{selectedTeacher.qualification || 'N/A'}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Address Section */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>
                      <Icons.MapPin size={14} color="#A0522D" /> Address
                    </Text>
                    <View style={styles.addressCard}>
                      <Text style={styles.addressText}>
                        {selectedTeacher.address || 'No address provided'}
                      </Text>
                    </View>
                  </View>
                </>
              )}

              <View style={styles.divider} />

              {/* Attendance Section */}
              <Text style={styles.sectionTitle}>
                <Icons.Calendar size={14} color="#A0522D" /> Attendance History
              </Text>

              {viewLoading ? (
                <ActivityIndicator size="large" color="#A0522D" style={{ marginTop: 20 }} />
              ) : attendanceData.length === 0 ? (
                <View style={styles.noDataContainer}>
                  <Icons.Calendar size={48} color="#e0d4c8" />
                  <Text style={styles.noDataText}>No attendance records found</Text>
                </View>
              ) : (
                <View style={styles.attendanceList}>
                  {/* Attendance Summary Stats */}
                  <View style={styles.attendanceStats}>
                    <View style={styles.attendanceStatItem}>
                      <Text style={styles.attendanceStatNumber}>
                        {attendanceData.filter(r => r.status === 'PRESENT').length}
                      </Text>
                      <Text style={styles.attendanceStatLabel}>Present</Text>
                    </View>
                    <View style={styles.attendanceStatItem}>
                      <Text style={styles.attendanceStatNumber}>
                        {attendanceData.filter(r => r.status === 'ABSENT').length}
                      </Text>
                      <Text style={styles.attendanceStatLabel}>Absent</Text>
                    </View>
                    <View style={styles.attendanceStatItem}>
                      <Text style={styles.attendanceStatNumber}>
                        {attendanceData.filter(r => r.status === 'HALF_DAY').length}
                      </Text>
                      <Text style={styles.attendanceStatLabel}>Half Day</Text>
                    </View>
                    <View style={styles.attendanceStatItem}>
                      <Text style={styles.attendanceStatNumber}>
                        {attendanceData.length}
                      </Text>
                      <Text style={styles.attendanceStatLabel}>Total</Text>
                    </View>
                  </View>

                  {/* Attendance Records List */}
                  {attendanceData.map((record, index) => (
                    <View key={record.id || index} style={styles.attendanceCard}>
                      <View style={styles.attendanceHeader}>
                        <View>
                          <Text style={styles.attendanceDate}>{record.attendanceDate}</Text>
                          <Text style={styles.attendanceDay}>
                            {new Date(record.attendanceDate).toLocaleDateString('en-IN', { weekday: 'long' })}
                          </Text>
                        </View>
                        <View style={[styles.attendanceStatusBadge, { backgroundColor: getStatusBgColor(record.status) }]}>
                          {record.status === 'PRESENT' && <Icons.CheckCircle size={12} color="#4caf50" />}
                          {record.status === 'ABSENT' && <Icons.XCircle size={12} color="#f44336" />}
                          {record.status === 'HALF_DAY' && <Icons.Clock size={12} color="#ff9800" />}
                          <Text style={[styles.attendanceStatusText, { color: getStatusColor(record.status) }]}>
                            {record.status}
                          </Text>
                        </View>
                      </View>
                      {record.remarks && (
                        <View style={styles.remarksContainer}>
                          <Icons.FileText size={14} color="#8c7664" />
                          <Text style={styles.remarksText}>{record.remarks}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5DC' },

  // Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  mainTitle: { fontSize: 22, fontWeight: '800', color: '#A0522D' },
  subTitle: { fontSize: 12, color: '#8c7664' },
  addStaffButton: { backgroundColor: '#A0522D', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  addStaffButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Search
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16, borderWidth: 1, borderColor: '#eaddcc', gap: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#2e2520' },

  // Table Header
  tableHeader: { flexDirection: 'row', backgroundColor: '#A0522D', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 8, marginBottom: 4 },
  headerCell: { color: '#fff', fontWeight: '700', fontSize: 11 },

  // Table Rows
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 6, marginBottom: 3 },
  rowEven: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eaddcc' },
  rowOdd: { backgroundColor: '#faf6f0', borderWidth: 1, borderColor: '#eaddcc' },

  // Cells
  cell: { fontSize: 11, color: '#555' },
  cellId: { width: 72 },
  cellName: { flex: 1 },
  cellPhone: { width: 90 },
  cellExp: { width: 28, textAlign: 'center' },
  nameText: { fontSize: 12, fontWeight: '700', color: '#2e2520' },
  emailText: { fontSize: 10, color: '#888', marginTop: 1 },

  // View Button
  viewBtn: { backgroundColor: '#A0522D', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6 },
  viewBtnText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 14 },

  // Bulk Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#A0522D' },
  actionButton: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, width: '100%' },
  selectBtn: { backgroundColor: '#059669' },
  sendBtn: { backgroundColor: '#A0522D' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  previewContainer: { alignItems: 'center' },
  fileText: { fontSize: 12, color: '#666' },
  countText: { marginVertical: 15, fontWeight: 'bold', fontSize: 16, color: '#2e2520' },
  cancelBtn: { marginTop: 15 },

  // Updated View Modal Styles
  viewModalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, width: '90%', maxHeight: '85%' },
  
  // Profile Header
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eaddcc' },
  profileAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fdf0e6', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#A0522D' },
  profileAvatarText: { fontSize: 28, fontWeight: '700', color: '#A0522D' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700', color: '#2e2520', marginBottom: 4 },
  profileId: { fontSize: 13, color: '#8c7664' },
  
  // Info Sections
  infoSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#A0522D', marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  infoItem: { flex: 1, minWidth: '45%', backgroundColor: '#faf8f5', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#f0e6dc' },
  infoLabel: { fontSize: 10, fontWeight: '600', color: '#bc9e82', marginBottom: 4, textTransform: 'uppercase' },
  infoValue: { fontSize: 13, color: '#2e2520', fontWeight: '500' },
  
  // Address Card
  addressCard: { backgroundColor: '#faf8f5', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#f0e6dc' },
  addressText: { fontSize: 13, color: '#2e2520', lineHeight: 18 },
  
  // Divider
  divider: { height: 1, backgroundColor: '#eaddcc', marginVertical: 16 },
  
  // Attendance Stats
  attendanceStats: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  attendanceStatItem: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#eaddcc' },
  attendanceStatNumber: { fontSize: 18, fontWeight: '700', color: '#A0522D' },
  attendanceStatLabel: { fontSize: 10, color: '#8c7664', marginTop: 4 },
  
  // Attendance List
  attendanceList: { maxHeight: 300 },
  attendanceCard: { backgroundColor: '#faf8f5', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eaddcc' },
  attendanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  attendanceDate: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  attendanceDay: { fontSize: 10, color: '#bc9e82', marginTop: 2 },
  attendanceStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  attendanceStatusText: { fontSize: 11, fontWeight: '600' },
  remarksContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#eaddcc' },
  remarksText: { fontSize: 12, color: '#8c7664', flex: 1 },
  
  noDataContainer: { alignItems: 'center', padding: 40, gap: 12 },
  noDataText: { fontSize: 14, color: '#b0a090', textAlign: 'center' },
});