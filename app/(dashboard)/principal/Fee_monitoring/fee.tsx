import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  ActivityIndicator, Modal, TextInput, ScrollView,
  useWindowDimensions, Alert, RefreshControl
} from 'react-native';
import {
  DollarSign, Users, Calendar, Search, Filter, X,
  Eye, Plus, CheckCircle, XCircle, Clock, TrendingUp,
  FileText, CreditCard, Banknote, ChevronDown, ChevronUp
} from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';

export default function FeeManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // States
  const [dashboardStats, setDashboardStats] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [classDetailsModal, setClassDetailsModal] = useState(false);
  const [classFeeDetails, setClassFeeDetails] = useState([]);
  const [bulkCreateModal, setBulkCreateModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('');
  const [bulkForm, setBulkForm] = useState({
    feeName: '',
    amount: '',
    dueDate: '',
    isExtra: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  // ─── Fetch Dashboard Stats ─────────────────────────────────────────
  const fetchDashboardStats = async () => {
    try {
      const res = await rootApi.get('/api/student/fee/admin/dashboard/stats');
      setDashboardStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
    }
  };

  // ─── Fetch All Class Sections ─────────────────────────────────────
  const fetchClassSections = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/class-sections');
      setClassSections(res.data);
    } catch (error) {
      console.error("Error fetching class sections", error);
      Alert.alert('Error', 'Failed to fetch class sections');
    } finally {
      setLoading(false);
    }
  };

  // ─── Fetch Class Fee Details ──────────────────────────────────────
  const fetchClassFeeDetails = async (classSectionId) => {
    setLoading(true);
    try {
      const res = await rootApi.get(`/api/student/fee/admin/class-status/${classSectionId}`);
      setClassFeeDetails(res.data);
    } catch (error) {
      console.error("Error fetching class fee details", error);
      setClassFeeDetails([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Bulk Create Fee ──────────────────────────────────────────────
  const handleBulkCreate = async () => {
    if (!bulkForm.feeName.trim()) {
      Alert.alert('Validation Error', 'Please enter fee name');
      return;
    }
    if (!bulkForm.dueDate) {
      Alert.alert('Validation Error', 'Please enter due date');
      return;
    }
    if (!selectedStudentId) {
      Alert.alert('Validation Error', 'Student ID is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        studentId: selectedStudentId,
        feeName: bulkForm.feeName,
        amount: parseFloat(bulkForm.amount) || 0,
        dueDate: bulkForm.dueDate,
        isExtra: bulkForm.isExtra
      };

      await rootApi.post('/api/student/fee/admin/bulk-create', payload);
      Alert.alert('Success', 'Fee created successfully!');
      setBulkCreateModal(false);
      resetBulkForm();
      fetchDashboardStats();
      if (selectedClass) {
        fetchClassFeeDetails(selectedClass.classSectionId);
      }
    } catch (error) {
      console.error("Error creating fee", error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create fee');
    } finally {
      setSubmitting(false);
    }
  };

  const resetBulkForm = () => {
    setBulkForm({
      feeName: '',
      amount: '',
      dueDate: '',
      isExtra: false
    });
    setSelectedStudentId('');
  };

  // ─── Helper Functions ─────────────────────────────────────────────
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return '#4caf50';
      case 'PARTIAL': return '#ff9800';
      case 'PENDING': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'PAID': return '#e8f5e9';
      case 'PARTIAL': return '#fff3e0';
      case 'PENDING': return '#ffebee';
      default: return '#f5f5f5';
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClassClick = async (classItem) => {
    setSelectedClass(classItem);
    await fetchClassFeeDetails(classItem.classSectionId);
    setClassDetailsModal(true);
  };

  const openAddFeeModal = (classItem) => {
    setSelectedClass(classItem);
    setSelectedClassName(`${classItem.className} - ${classItem.section}`);
    setBulkCreateModal(true);
  };

  // Merge class sections with fee data
  const mergedData = classSections.map(classSection => {
    const feeData = dashboardStats.find(s => s.classSectionId === classSection.classSectionId);
    return {
      ...classSection,
      totalExpectedFee: feeData?.totalExpectedFee || 0,
      totalCollectedFee: feeData?.totalCollectedFee || 0,
      totalPendingFee: feeData?.totalPendingFee || 0
    };
  });

  // Filter classes
  const filteredData = mergedData.filter(item => {
    const className = `${item.className} - ${item.section}`.toLowerCase();
    return className.includes(searchQuery.toLowerCase());
  });

  // Calculate totals
  const totalExpected = mergedData.reduce((sum, item) => sum + item.totalExpectedFee, 0);
  const totalCollected = mergedData.reduce((sum, item) => sum + item.totalCollectedFee, 0);
  const totalPending = mergedData.reduce((sum, item) => sum + item.totalPendingFee, 0);
  const collectionRate = totalExpected > 0 ? ((totalCollected / totalExpected) * 100).toFixed(1) : 0;

  useEffect(() => {
    fetchDashboardStats();
    fetchClassSections();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardStats(), fetchClassSections()]);
    setRefreshing(false);
  };

  // ─── Render Components ────────────────────────────────────────────
  const renderDashboardCard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>Fee Collection Overview</Text>
        <Text style={styles.dashboardSubtitle}>All Classes</Text>
      </View>
      <View style={[styles.statsGrid, isMobile && styles.statsGridMobile]}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#e8f5e9' }]}>
            <Banknote size={24} color="#4caf50" />
          </View>
          <Text style={styles.statValue}>{formatCurrency(totalExpected)}</Text>
          <Text style={styles.statLabel}>Expected Fee</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#e3f2fd' }]}>
            <CreditCard size={24} color="#2196f3" />
          </View>
          <Text style={[styles.statValue, { color: '#2196f3' }]}>{formatCurrency(totalCollected)}</Text>
          <Text style={styles.statLabel}>Collected Fee</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#fff3e0' }]}>
            <Clock size={24} color="#ff9800" />
          </View>
          <Text style={[styles.statValue, { color: '#ff9800' }]}>{formatCurrency(totalPending)}</Text>
          <Text style={styles.statLabel}>Pending Fee</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#f3e5f5' }]}>
            <TrendingUp size={24} color="#9c27b0" />
          </View>
          <Text style={[styles.statValue, { color: '#9c27b0' }]}>{collectionRate}%</Text>
          <Text style={styles.statLabel}>Collection Rate</Text>
        </View>
      </View>
    </View>
  );

  const renderMobileCard = ({ item }) => {
    const hasFee = item.totalExpectedFee > 0;
    return (
      <TouchableOpacity style={styles.classCard} onPress={() => handleClassClick(item)}>
        <View style={styles.classCardHeader}>
          <View style={styles.classBadge}>
            <Text style={styles.classBadgeText}>Class {item.className} - {item.section}</Text>
          </View>
          <TouchableOpacity style={styles.bulkBtnSmall} onPress={() => openAddFeeModal(item)}>
            <Plus size={14} color="#fff" />
            <Text style={styles.bulkBtnSmallText}>Add Fee</Text>
          </TouchableOpacity>
        </View>

        {!hasFee ? (
          <View style={styles.noFeeContainer}>
            <DollarSign size={24} color="#e0d4c8" />
            <Text style={styles.noFeeText}>No fee records yet</Text>
            <Text style={styles.noFeeSubtext}>Click "Add Fee" to create</Text>
          </View>
        ) : (
          <>
            <View style={styles.classStats}>
              <View style={styles.classStat}>
                <Text style={styles.classStatLabel}>Expected</Text>
                <Text style={styles.classStatValue}>{formatCurrency(item.totalExpectedFee)}</Text>
              </View>
              <View style={styles.classStat}>
                <Text style={styles.classStatLabel}>Collected</Text>
                <Text style={[styles.classStatValue, { color: '#2196f3' }]}>{formatCurrency(item.totalCollectedFee)}</Text>
              </View>
              <View style={styles.classStat}>
                <Text style={styles.classStatLabel}>Pending</Text>
                <Text style={[styles.classStatValue, { color: '#ff9800' }]}>{formatCurrency(item.totalPendingFee)}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.totalExpectedFee > 0 ? ((item.totalCollectedFee / item.totalExpectedFee) * 100).toFixed(1) : 0}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {item.totalExpectedFee > 0 ? ((item.totalCollectedFee / item.totalExpectedFee) * 100).toFixed(1) : 0}% collected
              </Text>
            </View>
          </>
        )}

        <View style={styles.classFooter}>
          <View style={styles.footerItem}>
            <Users size={12} color="#8c7664" />
            <Text style={styles.footerText}>Teacher: {item.classTeacherName || 'Not assigned'}</Text>
          </View>
          <View style={styles.footerItem}>
            <Eye size={12} color="#A0522D" />
            <Text style={styles.viewDetailsText}>View Details</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDesktopRow = ({ item }) => {
    const isExpanded = expandedRows[item.classSectionId];
    const hasFee = item.totalExpectedFee > 0;
    const collectionPercent = item.totalExpectedFee > 0 ? ((item.totalCollectedFee / item.totalExpectedFee) * 100).toFixed(1) : 0;

    return (
      <View style={styles.tableRowWrapper}>
        <TouchableOpacity style={styles.tableRow} onPress={() => toggleExpand(item.classSectionId)} activeOpacity={0.7}>
          <Text style={[styles.tableCell, styles.cellClass]}>{item.className} - {item.section}</Text>
          <Text style={[styles.tableCell, styles.cellTeacher]}>{item.classTeacherName || 'Not assigned'}</Text>
          <Text style={[styles.tableCell, styles.cellExpected]}>{formatCurrency(item.totalExpectedFee)}</Text>
          <Text style={[styles.tableCell, styles.cellCollected, { color: '#2196f3' }]}>{formatCurrency(item.totalCollectedFee)}</Text>
          <Text style={[styles.tableCell, styles.cellPending, { color: '#ff9800' }]}>{formatCurrency(item.totalPendingFee)}</Text>
          <View style={[styles.tableCell, styles.cellProgress]}>
            {hasFee ? (
              <>
                <View style={styles.progressBarSmall}>
                  <View style={[styles.progressFillSmall, { width: `${collectionPercent}%` }]} />
                </View>
                <Text style={styles.progressPercent}>{collectionPercent}%</Text>
              </>
            ) : (
              <Text style={styles.noFeeBadge}>No Fee</Text>
            )}
          </View>
          <View style={[styles.tableCell, styles.cellAction]}>
            <TouchableOpacity style={styles.viewRowBtn} onPress={() => handleClassClick(item)}>
              <Eye size={14} color="#A0522D" />
              <Text style={styles.viewRowBtnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addFeeRowBtn} onPress={() => openAddFeeModal(item)}>
              <Plus size={14} color="#fff" />
              <Text style={styles.addFeeRowBtnText}>Add Fee</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.expandBtn} onPress={() => toggleExpand(item.classSectionId)}>
            {isExpanded ? <ChevronUp size={18} color="#A0522D" /> : <ChevronDown size={18} color="#A0522D" />}
          </TouchableOpacity>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedRow}>
            <View style={styles.expandedContent}>
              <View style={styles.expandedSection}>
                <Text style={styles.expandedTitle}>Class Details</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Class Teacher</Text>
                    <Text style={styles.detailValue}>{item.classTeacherName || 'Not assigned'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Academic Year</Text>
                    <Text style={styles.detailValue}>{item.academicYear || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Capacity</Text>
                    <Text style={styles.detailValue}>{item.capacity || 0}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Current Strength</Text>
                    <Text style={styles.detailValue}>{item.currentStrength || 0}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Fee Management</Text>
          <Text style={styles.subtitle}>Track and manage student fees</Text>
        </View>
      </View>

      {/* Dashboard Stats */}
      {renderDashboardCard()}

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#8c7664" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by class name or section..."
          placeholderTextColor="#bc9e82"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={18} color="#8c7664" />
          </TouchableOpacity>
        )}
      </View>

      {/* Class List */}
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && classSections.length === 0 ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#A0522D" />
            <Text style={styles.loaderText}>Loading classes...</Text>
          </View>
        ) : filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <DollarSign size={64} color="#e0d4c8" />
            <Text style={styles.emptyTitle}>No Classes Found</Text>
            <Text style={styles.emptyText}>No classes match your search</Text>
          </View>
        ) : isMobile ? (
          <View style={styles.mobileListContainer}>
            {filteredData.map((item) => (
              <View key={item.classSectionId}>
                {renderMobileCard({ item })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.webTableWrapper}>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.cellClass]}>Class</Text>
                <Text style={[styles.tableHeaderCell, styles.cellTeacher]}>Class Teacher</Text>
                <Text style={[styles.tableHeaderCell, styles.cellExpected]}>Expected Fee</Text>
                <Text style={[styles.tableHeaderCell, styles.cellCollected]}>Collected Fee</Text>
                <Text style={[styles.tableHeaderCell, styles.cellPending]}>Pending Fee</Text>
                <Text style={[styles.tableHeaderCell, styles.cellProgress]}>Progress</Text>
                <Text style={[styles.tableHeaderCell, styles.cellAction]}>Actions</Text>
                <Text style={[styles.tableHeaderCell, { width: 40 }]}> </Text>
              </View>
              {filteredData.map((item) => (
                <View key={item.classSectionId}>
                  {renderDesktopRow({ item })}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Class Details Modal */}
      <Modal animationType="slide" transparent={true} visible={classDetailsModal} onRequestClose={() => setClassDetailsModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? '92%' : 600, maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <FileText size={24} color="#A0522D" />
                <Text style={styles.modalTitle}>Fee Details - {selectedClass?.className} {selectedClass?.section}</Text>
              </View>
              <TouchableOpacity onPress={() => setClassDetailsModal(false)} style={styles.closeBtn}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {loading ? (
                <ActivityIndicator size="large" color="#A0522D" style={{ marginTop: 20 }} />
              ) : classFeeDetails.length > 0 ? (
                classFeeDetails.map((fee, index) => (
                  <View key={index} style={styles.feeDetailCard}>
                    <View style={styles.feeDetailHeader}>
                      <Text style={styles.feeDetailName}>{fee.feeName}</Text>
                      <View style={[styles.feeStatusBadge, { backgroundColor: getStatusBgColor(fee.status) }]}>
                        <Text style={[styles.feeStatusText, { color: getStatusColor(fee.status) }]}>{fee.status}</Text>
                      </View>
                    </View>
                    <View style={styles.feeDetailBody}>
                      <View style={styles.feeDetailRow}>
                        <Text style={styles.feeDetailLabel}>Student ID:</Text>
                        <Text style={styles.feeDetailValue}>{fee.studentId}</Text>
                      </View>
                      <View style={styles.feeDetailRow}>
                        <Text style={styles.feeDetailLabel}>Amount:</Text>
                        <Text style={styles.feeDetailValue}>{formatCurrency(fee.amount)}</Text>
                      </View>
                      <View style={styles.feeDetailRow}>
                        <Text style={styles.feeDetailLabel}>Paid:</Text>
                        <Text style={styles.feeDetailValue}>{formatCurrency(fee.amountPaid)}</Text>
                      </View>
                      <View style={styles.feeDetailRow}>
                        <Text style={styles.feeDetailLabel}>Due Date:</Text>
                        <Text style={styles.feeDetailValue}>{fee.dueDate}</Text>
                      </View>
                      {fee.isExtra && (
                        <View style={styles.extraBadge}>
                          <Text style={styles.extraBadgeText}>Extra Fee</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <DollarSign size={48} color="#e0d4c8" />
                  <Text style={styles.noDataText}>No fee records found</Text>
                  <TouchableOpacity style={styles.addFeeModalBtn} onPress={() => {
                    setClassDetailsModal(false);
                    openAddFeeModal(selectedClass);
                  }}>
                    <Plus size={16} color="#fff" />
                    <Text style={styles.addFeeModalBtnText}>Add Fee for this Class</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bulk Create Fee Modal */}
      <Modal animationType="slide" transparent={true} visible={bulkCreateModal} onRequestClose={() => { setBulkCreateModal(false); resetBulkForm(); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? '92%' : 450 }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Plus size={24} color="#A0522D" />
                <Text style={styles.modalTitle}>Add Fee</Text>
              </View>
              <TouchableOpacity onPress={() => { setBulkCreateModal(false); resetBulkForm(); }} style={styles.closeBtn}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.classInfoBox}>
                <Text style={styles.classInfoLabel}>Class</Text>
                <Text style={styles.classInfoValue}>{selectedClassName}</Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Student ID *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Student ID (e.g., STU2026001)"
                  placeholderTextColor="#bc9e82"
                  value={selectedStudentId}
                  onChangeText={setSelectedStudentId}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fee Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Term Fee, Tuition Fee"
                  placeholderTextColor="#bc9e82"
                  value={bulkForm.feeName}
                  onChangeText={(t) => setBulkForm({ ...bulkForm, feeName: t })}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount (optional)"
                  placeholderTextColor="#bc9e82"
                  keyboardType="numeric"
                  value={bulkForm.amount}
                  onChangeText={(t) => setBulkForm({ ...bulkForm, amount: t })}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Due Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#bc9e82"
                  value={bulkForm.dueDate}
                  onChangeText={(t) => setBulkForm({ ...bulkForm, dueDate: t })}
                />
              </View>
              <View style={styles.checkboxRow}>
                <TouchableOpacity
                  style={[styles.checkbox, bulkForm.isExtra && styles.checkboxChecked]}
                  onPress={() => setBulkForm({ ...bulkForm, isExtra: !bulkForm.isExtra })}
                >
                  {bulkForm.isExtra && <CheckCircle size={12} color="#fff" />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Mark as Extra Fee</Text>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setBulkCreateModal(false); resetBulkForm(); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleBulkCreate} disabled={submitting}>
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitButtonText}>Create Fee</Text>}
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
  container: { flex: 1, backgroundColor: '#FDF8F0' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eaddcc' },
  title: { fontSize: 24, fontWeight: '700', color: '#A0522D' },
  subtitle: { fontSize: 13, color: '#8c7664', marginTop: 4 },

  // Dashboard
  dashboardContainer: { margin: 16, marginBottom: 8 },
  dashboardHeader: { marginBottom: 16 },
  dashboardTitle: { fontSize: 16, fontWeight: '700', color: '#2e2520' },
  dashboardSubtitle: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statsGridMobile: { flexDirection: 'column', gap: 10 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#eaddcc' },
  statIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#2e2520', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#8c7664' },

  // Search
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc', gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#2e2520' },

  // Scroll
  mainScrollView: { flex: 1 },
  scrollContentContainer: { paddingBottom: 30 },
  mobileListContainer: { padding: 16, paddingTop: 0 },
  loaderContainer: { padding: 40, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loaderText: { fontSize: 14, color: '#8c7664' },
  emptyState: { padding: 60, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#A0522D', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#b0a090', textAlign: 'center' },

  // Mobile Card
  classCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, padding: 14, borderWidth: 1, borderColor: '#f0e6dc', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  classCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  classBadge: { backgroundColor: '#fdf0e6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  classBadgeText: { fontSize: 12, fontWeight: '700', color: '#A0522D' },
  bulkBtnSmall: { backgroundColor: '#A0522D', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  bulkBtnSmallText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  noFeeContainer: { alignItems: 'center', paddingVertical: 16, gap: 6 },
  noFeeText: { fontSize: 13, color: '#b0a090', fontWeight: '500' },
  noFeeSubtext: { fontSize: 11, color: '#d0c0b0' },
  classStats: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  classStat: { flex: 1, alignItems: 'center' },
  classStatLabel: { fontSize: 10, color: '#bc9e82', marginBottom: 4 },
  classStatValue: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  progressContainer: { marginBottom: 12 },
  progressBar: { height: 6, backgroundColor: '#f0e6dc', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: '#A0522D', borderRadius: 3 },
  progressText: { fontSize: 10, color: '#8c7664', textAlign: 'right' },
  classFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0e6dc' },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 10, color: '#8c7664' },
  viewDetailsText: { fontSize: 10, color: '#A0522D', fontWeight: '600' },

  // Web Table
  webTableWrapper: { marginHorizontal: 16, marginTop: 0, overflowX: 'auto' },
  tableContainer: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc', overflow: 'hidden', minWidth: 1000 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#fdf0e6', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eaddcc' },
  tableHeaderCell: { fontSize: 12, fontWeight: '700', color: '#A0522D', flex: 1 },
  tableRowWrapper: { borderBottomWidth: 1, borderBottomColor: '#f0e6dc' },
  tableRow: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center', backgroundColor: '#fff' },
  tableCell: { fontSize: 13, color: '#2e2520', flex: 1 },
  cellClass: { flex: 0.8 },
  cellTeacher: { flex: 1 },
  cellExpected: { flex: 0.8 },
  cellCollected: { flex: 0.8 },
  cellPending: { flex: 0.8 },
  cellProgress: { flex: 0.7, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cellAction: { flex: 0.9, flexDirection: 'row', gap: 6 },
  progressBarSmall: { flex: 1, height: 6, backgroundColor: '#f0e6dc', borderRadius: 3, overflow: 'hidden' },
  progressFillSmall: { height: '100%', backgroundColor: '#A0522D', borderRadius: 3 },
  progressPercent: { fontSize: 11, fontWeight: '600', color: '#A0522D', width: 45 },
  noFeeBadge: { fontSize: 11, color: '#b0a090', fontStyle: 'italic' },
  viewRowBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: '#fdf0e6' },
  viewRowBtnText: { fontSize: 10, fontWeight: '600', color: '#A0522D' },
  addFeeRowBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: '#A0522D' },
  addFeeRowBtnText: { fontSize: 10, fontWeight: '600', color: '#fff' },
  expandBtn: { width: 40, alignItems: 'center', padding: 8 },

  // Expanded Row
  expandedRow: { backgroundColor: '#faf8f5', paddingHorizontal: 12, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#f0e6dc' },
  expandedContent: { flex: 1 },
  expandedSection: { marginBottom: 8 },
  expandedTitle: { fontSize: 14, fontWeight: '700', color: '#A0522D', marginBottom: 12 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  detailItem: { flex: 1, minWidth: 150 },
  detailLabel: { fontSize: 11, fontWeight: '600', color: '#bc9e82', marginBottom: 4, textTransform: 'uppercase' },
  detailValue: { fontSize: 14, color: '#2e2520', fontWeight: '500' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#A0522D' },
  closeBtn: { padding: 4 },
  classInfoBox: { backgroundColor: '#fdf0e6', padding: 12, borderRadius: 10, marginBottom: 20 },
  classInfoLabel: { fontSize: 10, color: '#bc9e82', marginBottom: 2 },
  classInfoValue: { fontSize: 14, fontWeight: '600', color: '#A0522D' },

  // Fee Detail Cards
  feeDetailCard: { backgroundColor: '#faf8f5', borderRadius: 12, marginBottom: 12, padding: 14, borderWidth: 1, borderColor: '#eaddcc' },
  feeDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  feeDetailName: { fontSize: 14, fontWeight: '700', color: '#2e2520' },
  feeStatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  feeStatusText: { fontSize: 10, fontWeight: '600' },
  feeDetailBody: { gap: 6 },
  feeDetailRow: { flexDirection: 'row', gap: 10 },
  feeDetailLabel: { fontSize: 12, color: '#8c7664', width: 80 },
  feeDetailValue: { fontSize: 12, color: '#2e2520', fontWeight: '500' },
  extraBadge: { backgroundColor: '#fdf0e6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginTop: 6 },
  extraBadgeText: { fontSize: 10, fontWeight: '600', color: '#A0522D' },
  addFeeModalBtn: { backgroundColor: '#A0522D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 10, marginTop: 16 },
  addFeeModalBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Form
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#2e2520', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#eaddcc', borderRadius: 12, padding: 12, fontSize: 14, color: '#2e2520', backgroundColor: '#fafafa' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#eaddcc', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#A0522D', borderColor: '#A0522D' },
  checkboxLabel: { fontSize: 13, color: '#2e2520' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f5f0ea', borderWidth: 1, borderColor: '#eaddcc' },
  cancelButtonText: { color: '#8c7664', fontWeight: '600' },
  submitButton: { backgroundColor: '#A0522D' },
  submitButtonText: { color: '#fff', fontWeight: '600' },

  noDataContainer: { alignItems: 'center', padding: 40, gap: 12 },
  noDataText: { fontSize: 14, color: '#b0a090', textAlign: 'center' },
});