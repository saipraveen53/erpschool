import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  useWindowDimensions, 
  Platform,
  ActivityIndicator,
  Modal,
  TextInput,
  RefreshControl
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';

export default function LeaveApprovals() {
  const { width } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState('PENDING');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPendingRequests: 0,
    totalRejectedLeaves: 0,
    teachersOnLeaveToday: 0
  });
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLargeScreen = width >= 768;

  // Fetch leaves by status
  const fetchLeavesByStatus = async (status) => {
    setLoading(true);
    try {
      const res = await rootApi.get(`/api/teacher/leave/byStatus?status=${status}`);
      setLeaveRequests(res.data);
    } catch (err) {
      console.error("Error fetching leaves", err);
      Alert.alert('Error', 'Failed to fetch leave requests');
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const res = await rootApi.get('/api/teacher/leave/getStats');
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  // Update leave status
  const updateLeaveStatus = async () => {
    if (!remarks.trim() && actionType !== 'APPROVED') {
      Alert.alert('Validation Error', 'Please provide remarks for rejection');
      return;
    }

    setSubmitting(true);
    try {
      await rootApi.put('/api/teacher/leave/action', {
        leaveId: selectedLeave?.leaveId,
        leaveStatus: actionType,
        remarks: remarks.trim()
      });
      
      Alert.alert('Success', `Leave ${actionType.toLowerCase()} successfully`);
      setActionModalVisible(false);
      setRemarks('');
      setSelectedLeave(null);
      fetchLeavesByStatus(activeFilter);
      fetchStats();
    } catch (err) {
      console.error("Error updating leave", err);
      Alert.alert('Error', 'Failed to update leave status');
    } finally {
      setSubmitting(false);
    }
  };

  const processLeave = (leave, action) => {
    setSelectedLeave(leave);
    setActionType(action);
    setActionModalVisible(true);
  };

  useEffect(() => {
    fetchLeavesByStatus(activeFilter);
    fetchStats();
  }, [activeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeavesByStatus(activeFilter);
    await fetchStats();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED': return '#4caf50';
      case 'REJECTED': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getStatusBgColor = (status) => {
    switch(status) {
      case 'APPROVED': return '#e8f5e9';
      case 'REJECTED': return '#ffebee';
      default: return '#fff3e0';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderLeaveCard = ({ item }) => {
    const isPending = item.leaveStatus === 'PENDING';
    
    return (
      <View style={[styles.leaveCard, isLargeScreen && styles.desktopCardWidth]}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.teacherName?.[0] || 'T'}</Text>
            </View>
            <View>
              <Text style={styles.staffName}>{item.teacherName || 'Unknown'}</Text>
              <Text style={styles.staffRole}>Leave ID: {item.leaveId}</Text>
            </View>
          </View>
          <View style={[styles.badgeContainer, { backgroundColor: getStatusBgColor(item.leaveStatus) }]}>
            <Text style={[styles.badgeText, { color: getStatusColor(item.leaveStatus) }]}>
              {item.leaveStatus || 'PENDING'}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.metaRow}>
            <Icons.Calendar size={15} color="#64748b" />
            <Text style={styles.metaText}>
              <Text style={styles.boldLabel}>Leave Type:</Text> {item.leaveType || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.metaRow}>
            <Icons.Calendar size={15} color="#64748b" />
            <Text style={styles.metaText}>
              <Text style={styles.boldLabel}>Duration:</Text> {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </Text>
          </View>

          <View style={styles.reasonBox}>
            <Text style={styles.reasonHeading}>Reason / Remarks:</Text>
            <Text style={styles.reasonText}>"{item.reason || 'No reason provided'}"</Text>
          </View>

          <View style={styles.substitutionBox}>
            <Icons.Clock size={14} color="#0284c7" />
            <Text style={styles.substitutionText}>Applied on: {formatDateTime(item.appliedOn)}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          {isPending ? (
            <View style={styles.actionButtonGroup}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.btnReject]} 
                onPress={() => processLeave(item, 'REJECTED')}
              >
                <Icons.XCircle size={14} color="#dc2626" />
                <Text style={styles.btnTextReject}>Reject</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtn, styles.btnApprove]} 
                onPress={() => processLeave(item, 'APPROVED')}
              >
                <Icons.CheckCircle size={14} color="#ffffff" />
                <Text style={styles.btnTextApprove}>Approve</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.finalStatusChip, item.leaveStatus === 'APPROVED' ? styles.chipSuccess : styles.chipDanger]}>
              <Icons.CheckCircle size={14} color={item.leaveStatus === 'APPROVED' ? '#4caf50' : '#f44336'} />
              <Text style={item.leaveStatus === 'APPROVED' ? styles.textSuccess : styles.textDanger}>
                {item.leaveStatus}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerTitleArea}>
        <Text style={styles.mainTitle}>Leave Management Board</Text>
        <Text style={styles.mainSubtitle}>Authorize institutional faculty leaves, evaluate reasons, and track status.</Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#fff3e0' }]}>
          <Icons.Clock size={24} color="#ff9800" />
          <Text style={[styles.statNumber, { color: '#ff9800' }]}>{stats.totalPendingRequests || 0}</Text>
          <Text style={styles.statLabel}>Pending Requests</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
          <Icons.CheckCircle size={24} color="#4caf50" />
          <Text style={[styles.statNumber, { color: '#4caf50' }]}>{stats.teachersOnLeaveToday || 0}</Text>
          <Text style={styles.statLabel}>On Leave Today</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ffebee' }]}>
          <Icons.XCircle size={24} color="#f44336" />
          <Text style={[styles.statNumber, { color: '#f44336' }]}>{stats.totalRejectedLeaves || 0}</Text>
          <Text style={styles.statLabel}>Total Rejected</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsWrapperContainer}>
        {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => {
          const isActive = activeFilter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTabButton, isActive && styles.filterTabButtonActive]}
              onPress={() => setActiveFilter(tab)}
            >
              <Text style={[styles.filterTabButtonText, isActive && styles.filterTabButtonTextActive]}>
                {tab.charAt(0) + tab.slice(1).toLowerCase()} Requests
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Leave List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#A0522D" />
          <Text style={styles.loaderText}>Loading leave requests...</Text>
        </View>
      ) : (
        <FlatList
          data={leaveRequests}
          keyExtractor={(item) => item.leaveId?.toString()}
          renderItem={renderLeaveCard}
          contentContainerStyle={styles.listContainerPadding}
          numColumns={isLargeScreen ? 2 : 1}
          key={isLargeScreen ? 'D-GRID' : 'M-LIST'}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.fallbackEmptyBox}>
              <Icons.Inbox color="#94a3b8" size={48} />
              <Text style={styles.fallbackEmptyText}>
                No leave applications found under "{activeFilter.toLowerCase()}" tab.
              </Text>
            </View>
          }
        />
      )}

      {/* Action Modal */}
      <Modal animationType="slide" transparent={true} visible={actionModalVisible} onRequestClose={() => setActionModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isLargeScreen ? 450 : '92%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Icons.FileText size={24} color="#A0522D" />
                <Text style={styles.modalTitle}>
                  {actionType === 'APPROVED' ? 'Approve Leave' : 'Reject Leave'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setActionModalVisible(false)} style={styles.closeBtn}>
                <Icons.X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedLeave && (
                <View style={styles.modalBody}>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Teacher:</Text>
                    <Text style={styles.modalValue}>{selectedLeave.teacherName}</Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Leave Type:</Text>
                    <Text style={styles.modalValue}>{selectedLeave.leaveType}</Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Duration:</Text>
                    <Text style={styles.modalValue}>{formatDate(selectedLeave.startDate)} - {formatDate(selectedLeave.endDate)}</Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Reason:</Text>
                    <Text style={styles.modalValue}>{selectedLeave.reason || 'No reason provided'}</Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      {actionType === 'APPROVED' ? 'Remarks (Optional)' : 'Remarks *'}
                    </Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder={actionType === 'APPROVED' ? 'Add any remarks...' : 'Provide reason for rejection...'}
                      placeholderTextColor="#bc9e82"
                      multiline
                      numberOfLines={3}
                      value={remarks}
                      onChangeText={setRemarks}
                    />
                  </View>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => {
                    setActionModalVisible(false);
                    setRemarks('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.modalButton, 
                    actionType === 'APPROVED' ? styles.approveButton : styles.rejectButton
                  ]} 
                  onPress={updateLeaveStatus} 
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {actionType === 'APPROVED' ? 'Approve' : 'Reject'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    padding: 16,
  },
  headerTitleArea: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#A0522D',
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#8c7664',
    marginTop: 4,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eaddcc',
    gap: 6,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: '#8c7664',
    fontWeight: '500',
  },
  tabsWrapperContainer: {
    flexDirection: 'row',
    backgroundColor: '#eaddcc',
    padding: 4,
    borderRadius: 8,
    marginBottom: 20,
    gap: 4,
  },
  filterTabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  filterTabButtonActive: {
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: { shadowColor: '#A0522D', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
      android: { elevation: 2 }
    })
  },
  filterTabButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8c7664',
  },
  filterTabButtonTextActive: {
    color: '#A0522D',
    fontWeight: '700',
  },
  listContainerPadding: {
    paddingBottom: 32,
    gap: 12,
  },
  leaveCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaddcc',
    padding: 16,
    marginBottom: 12,
  },
  desktopCardWidth: {
    flex: 1,
    marginHorizontal: 6,
    maxWidth: '49%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f5ebe0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5ebe0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eaddcc',
  },
  avatarText: {
    color: '#A0522D',
    fontWeight: '700',
    fontSize: 15,
  },
  staffName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2e2520',
  },
  staffRole: {
    fontSize: 12,
    color: '#8c7664',
    marginTop: 2,
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardBody: {
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#4a3e3d',
  },
  boldLabel: {
    fontWeight: '600',
    color: '#A0522D',
  },
  reasonBox: {
    backgroundColor: '#faf6f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5ebe0',
  },
  reasonHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0522D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: '#4a3e3d',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  substitutionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f5ebe0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eaddcc',
  },
  substitutionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0284c7',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5ebe0',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    height: 36,
  },
  btnApprove: {
    backgroundColor: '#A0522D',
  },
  btnReject: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  btnTextApprove: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  btnTextReject: {
    color: '#c62828',
    fontSize: 12,
    fontWeight: '600',
  },
  finalStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipSuccess: {
    backgroundColor: '#e8f5e9',
  },
  chipDanger: {
    backgroundColor: '#ffebee',
  },
  textSuccess: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4caf50',
  },
  textDanger: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f44336',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    fontSize: 14,
    color: '#8c7664',
  },
  fallbackEmptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    gap: 12,
  },
  fallbackEmptyText: {
    fontSize: 14,
    color: '#8c7664',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#A0522D',
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalInfoRow: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e6dc',
    paddingBottom: 8,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#bc9e82',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 14,
    color: '#2e2520',
  },
  inputGroup: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e2520',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eaddcc',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#2e2520',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f0ea',
    borderWidth: 1,
    borderColor: '#eaddcc',
  },
  approveButton: {
    backgroundColor: '#A0522D',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  cancelButtonText: {
    color: '#8c7664',
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});