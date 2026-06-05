import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Modal, TextInput, ScrollView,
  useWindowDimensions, Alert, RefreshControl
} from 'react-native';
import {
  DollarSign, Users, Search, X, Eye,
  Clock, TrendingUp, CreditCard, Banknote,
  ChevronDown, ChevronUp, FileText
} from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';

export default function FeeMonitoring() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // States
  const [dashboardStats, setDashboardStats] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedClass, setSelectedClass] = useState(null);
  const [classDetailsModal, setClassDetailsModal] = useState(false);
  const [classStudents, setClassStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  // ─── Fetch API Data ───────────────────────────────────────────────
  const fetchDashboardStats = async () => {
    try {
      const res = await rootApi.get('/api/student/fee/admin/dashboard/stats');
      setDashboardStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
    }
  };

  const fetchClassSections = async () => {
    try {
      const res = await rootApi.get('/api/student/class-sections');
      setClassSections(res.data);
    } catch (error) {
      console.error("Error fetching class sections", error);
      Alert.alert('Error', 'Failed to fetch class sections');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchDashboardStats(), fetchClassSections()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardStats(), fetchClassSections()]);
    setRefreshing(false);
  };

  const handleClassClick = async (classItem) => {
    setSelectedClass(classItem);
    setClassDetailsModal(true);
    setLoadingStudents(true);
    try {
      const res = await rootApi.get(`/api/student/fee/admin/class-status/${classItem.classSectionId}`);
      setClassStudents(res.data || []);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setClassStudents([]);
      } else {
        console.error("Error fetching class student fees", error);
        Alert.alert('Error', 'Failed to fetch student fee records');
      }
    } finally {
      setLoadingStudents(false);
    }
  };

  // ─── Helper Functions ─────────────────────────────────────────────
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const toggleExpand = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ─── Data Processing ──────────────────────────────────────────────
  const mergedData = classSections.map(classSection => {
    const feeData = dashboardStats.find(s => s.classSectionId === classSection.classSectionId);
    return {
      ...classSection,
      totalExpectedFee: feeData?.totalExpectedFee || 0,
      totalCollectedFee: feeData?.totalCollectedFee || 0,
      totalPendingFee: feeData?.totalPendingFee || 0
    };
  });

  const filteredData = mergedData.filter(item => {
    const className = `${item.className} - ${item.section}`.toLowerCase();
    return className.includes(searchQuery.toLowerCase());
  });

  const totalExpected = mergedData.reduce((sum, item) => sum + item.totalExpectedFee, 0);
  const totalCollected = mergedData.reduce((sum, item) => sum + item.totalCollectedFee, 0);
  const totalPending = mergedData.reduce((sum, item) => sum + item.totalPendingFee, 0);
  const collectionRate = totalExpected > 0 ? ((totalCollected / totalExpected) * 100).toFixed(1) : 0;

  // ─── Render Components ────────────────────────────────────────────
  const renderDashboardCard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.statsGrid}>
        {/* Expected */}
        <View style={[styles.statCard, { borderTopColor: '#4caf50' }]}>
          <View style={[styles.statIconWrap, { backgroundColor: 'rgba(76,175,80,0.12)' }]}>
            <Banknote size={22} color="#4caf50" />
          </View>
          <Text style={styles.statValue}>{formatCurrency(totalExpected)}</Text>
          <Text style={styles.statLabel}>Total Expected</Text>
          <View style={[styles.statAccent, { backgroundColor: '#4caf50' }]} />
        </View>

        {/* Collected */}
        <View style={[styles.statCard, { borderTopColor: '#00BCD4' }]}>
          <View style={[styles.statIconWrap, { backgroundColor: 'rgba(0,188,212,0.12)' }]}>
            <CreditCard size={22} color="#00BCD4" />
          </View>
          <Text style={[styles.statValue, { color: '#00BCD4' }]}>{formatCurrency(totalCollected)}</Text>
          <Text style={styles.statLabel}>Collected</Text>
          <View style={[styles.statAccent, { backgroundColor: '#00BCD4' }]} />
        </View>

        {/* Pending */}
        <View style={[styles.statCard, { borderTopColor: '#FF7043' }]}>
          <View style={[styles.statIconWrap, { backgroundColor: 'rgba(255,112,67,0.12)' }]}>
            <Clock size={22} color="#FF7043" />
          </View>
          <Text style={[styles.statValue, { color: '#FF7043' }]}>{formatCurrency(totalPending)}</Text>
          <Text style={styles.statLabel}>Pending</Text>
          <View style={[styles.statAccent, { backgroundColor: '#FF7043' }]} />
        </View>

        {/* Rate */}
        <View style={[styles.statCard, { borderTopColor: '#AB47BC' }]}>
          <View style={[styles.statIconWrap, { backgroundColor: 'rgba(171,71,188,0.12)' }]}>
            <TrendingUp size={22} color="#AB47BC" />
          </View>
          <Text style={[styles.statValue, { color: '#AB47BC' }]}>{collectionRate}%</Text>
          <Text style={styles.statLabel}>Collection Rate</Text>
          <View style={[styles.statAccent, { backgroundColor: '#AB47BC' }]} />
        </View>
      </View>
    </View>
  );

  const renderMobileCard = ({ item }) => {
    const hasFee = item.totalExpectedFee > 0;
    const pct = hasFee ? ((item.totalCollectedFee / item.totalExpectedFee) * 100).toFixed(1) : 0;

    return (
      <TouchableOpacity style={styles.classCard} onPress={() => handleClassClick(item)} activeOpacity={0.85}>
        {/* Card top stripe */}
        <View style={styles.cardStripe} />

        <View style={styles.classCardHeader}>
          <View style={styles.classBadge}>
            <Text style={styles.classBadgeText}>Class {item.className} – {item.section}</Text>
          </View>
          <View style={styles.cardEyeBtn}>
            <Eye size={14} color="#00BCD4" />
          </View>
        </View>

        {!hasFee ? (
          <View style={styles.noFeeContainer}>
            <DollarSign size={28} color="#3a5060" />
            <Text style={styles.noFeeText}>No fee data available</Text>
          </View>
        ) : (
          <>
            <View style={styles.classStats}>
              <View style={styles.classStat}>
                <Text style={styles.classStatLabel}>Expected</Text>
                <Text style={styles.classStatValue}>{formatCurrency(item.totalExpectedFee)}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.classStat}>
                <Text style={styles.classStatLabel}>Collected</Text>
                <Text style={[styles.classStatValue, { color: '#00BCD4' }]}>{formatCurrency(item.totalCollectedFee)}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.classStat}>
                <Text style={styles.classStatLabel}>Pending</Text>
                <Text style={[styles.classStatValue, { color: '#FF7043' }]}>{formatCurrency(item.totalPendingFee)}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.progressText}>{pct}% collected</Text>
            </View>
          </>
        )}

        <View style={styles.classFooter}>
          <View style={styles.footerItem}>
            <Users size={11} color="#6a8a9a" />
            <Text style={styles.footerText}>{item.classTeacherName || 'No teacher assigned'}</Text>
          </View>
          <Text style={styles.viewDetailsText}>View Students →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDesktopRow = ({ item }) => {
    const isExpanded = expandedRows[item.classSectionId];
    const hasFee = item.totalExpectedFee > 0;
    const collectionPercent = hasFee ? ((item.totalCollectedFee / item.totalExpectedFee) * 100).toFixed(1) : 0;

    return (
      <View style={styles.tableRowWrapper}>
        <TouchableOpacity
          style={[styles.tableRow, isExpanded && styles.tableRowExpanded]}
          onPress={() => toggleExpand(item.classSectionId)}
          activeOpacity={0.75}
        >
          <View style={[styles.tableCell, styles.cellClass]}>
            <View style={styles.classChip}>
              <Text style={styles.classChipText}>{item.className}</Text>
            </View>
            <Text style={styles.sectionText}>{item.section}</Text>
          </View>
          <Text style={[styles.tableCell, styles.cellTeacher, { color: '#8faab8' }]}>
            {item.classTeacherName || '—'}
          </Text>
          <Text style={[styles.tableCell, styles.cellExpected, { color: '#c5d8e3' }]}>
            {formatCurrency(item.totalExpectedFee)}
          </Text>
          <Text style={[styles.tableCell, styles.cellCollected, { color: '#00BCD4' }]}>
            {formatCurrency(item.totalCollectedFee)}
          </Text>
          <Text style={[styles.tableCell, styles.cellPending, { color: '#FF7043' }]}>
            {formatCurrency(item.totalPendingFee)}
          </Text>
          <View style={[styles.tableCell, styles.cellProgress]}>
            {hasFee ? (
              <>
                <View style={styles.progressTrackSmall}>
                  <View style={[styles.progressFillSmall, { width: `${collectionPercent}%` }]} />
                </View>
                <Text style={styles.progressPercent}>{collectionPercent}%</Text>
              </>
            ) : (
              <Text style={styles.noFeeBadge}>N/A</Text>
            )}
          </View>
          <View style={[styles.tableCell, styles.cellAction]}>
            <TouchableOpacity style={styles.viewRowBtn} onPress={() => handleClassClick(item)}>
              <Users size={13} color="#00BCD4" />
              <Text style={styles.viewRowBtnText}>Students</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.expandBtn} onPress={() => toggleExpand(item.classSectionId)}>
            {isExpanded
              ? <ChevronUp size={17} color="#00BCD4" />
              : <ChevronDown size={17} color="#6a8a9a" />}
          </TouchableOpacity>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedRow}>
            <Text style={styles.expandedTitle}>Class Details</Text>
            <View style={styles.detailsGrid}>
              {[
                { label: 'Class Teacher', value: item.classTeacherName || 'Not assigned' },
                { label: 'Academic Year', value: item.academicYear || 'N/A' },
                { label: 'Capacity', value: String(item.capacity || 0) },
                { label: 'Current Strength', value: String(item.currentStrength || 0) },
              ].map((d, i) => (
                <View key={i} style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{d.label}</Text>
                  <Text style={styles.detailValue}>{d.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#00BCD4"
          colors={['#00BCD4']}
        />
      }
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconWrap}>
            <DollarSign size={20} color="#00BCD4" />
          </View>
          <View>
            <Text style={styles.title}>Fee Monitoring</Text>
            <Text style={styles.subtitle}>Track collection status across all classes</Text>
          </View>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{filteredData.length} Classes</Text>
        </View>
      </View>

      {/* ── Stats ── */}
      {renderDashboardCard()}

      {/* ── Search ── */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Search size={16} color="#00BCD4" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search class or section…"
            placeholderTextColor="#a0b4bc"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#6a8a9a" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Class List ── */}
      <View style={styles.scrollContentContainer}>
        {loading && classSections.length === 0 ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#00BCD4" />
            <Text style={styles.loaderText}>Loading classes…</Text>
          </View>
        ) : filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <DollarSign size={56} color="#2a4555" />
            <Text style={styles.emptyTitle}>No Classes Found</Text>
            <Text style={styles.emptyText}>No classes match your search query</Text>
          </View>
        ) : isMobile ? (
          <View style={styles.mobileListContainer}>
            {filteredData.map(item => (
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
                <Text style={[styles.tableHeaderCell, styles.cellTeacher]}>Teacher</Text>
                <Text style={[styles.tableHeaderCell, styles.cellExpected]}>Expected</Text>
                <Text style={[styles.tableHeaderCell, styles.cellCollected]}>Collected</Text>
                <Text style={[styles.tableHeaderCell, styles.cellPending]}>Pending</Text>
                <Text style={[styles.tableHeaderCell, styles.cellProgress]}>Progress</Text>
                <Text style={[styles.tableHeaderCell, styles.cellAction]}>Action</Text>
                <Text style={[styles.tableHeaderCell, { width: 40 }]}> </Text>
              </View>
              {filteredData.map(item => (
                <View key={item.classSectionId}>
                  {renderDesktopRow({ item })}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* ── Modal ── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={classDetailsModal}
        onRequestClose={() => setClassDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {
            width: isMobile ? '96%' : 720,
            maxHeight: '88%',
            padding: isMobile ? 18 : 28
          }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={styles.modalIconWrap}>
                  <Users size={18} color="#00BCD4" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>
                    Class {selectedClass?.className} – {selectedClass?.section}
                  </Text>
                  <Text style={styles.modalSubtitle}>Student Fee Records</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setClassDetailsModal(false)} style={styles.closeBtn}>
                <X size={20} color="#6a8a9a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {loadingStudents ? (
                <ActivityIndicator size="large" color="#00BCD4" style={{ marginTop: 50 }} />
              ) : classStudents.length > 0 ? (
                <View style={styles.studentTable}>
                  {!isMobile && (
                    <View style={styles.studentTableHeader}>
                      <Text style={[styles.studentTh, { flex: 2.5 }]}>Student</Text>
                      <Text style={[styles.studentTh, { flex: 1.5 }]}>Roll No</Text>
                      <Text style={[styles.studentTh, { flex: 2, textAlign: 'right' }]}>Total Fee</Text>
                      <Text style={[styles.studentTh, { flex: 2, textAlign: 'right' }]}>Balance</Text>
                      <Text style={[styles.studentTh, { flex: 1.5, textAlign: 'center' }]}>Status</Text>
                    </View>
                  )}
                  {classStudents.map((student, idx) => {
                    const isPaid = student.status === "PAID" || student.balanceAmount === 0;
                    return (
                      <View
                        key={student.studentId}
                        style={[
                          styles.studentRow,
                          idx === classStudents.length - 1 && { borderBottomWidth: 0 }
                        ]}
                      >
                        <View style={[styles.studentTd, { flex: isMobile ? 1 : 2.5, flexDirection: 'row', alignItems: 'center' }]}>
                          <View style={[styles.avatarContainer, { backgroundColor: isPaid ? 'rgba(0,188,212,0.15)' : 'rgba(255,112,67,0.12)' }]}>
                            <Text style={[styles.avatarText, { color: isPaid ? '#00BCD4' : '#FF7043' }]}>
                              {student.studentName?.charAt(0) || 'S'}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.studentNameText} numberOfLines={1}>{student.studentName}</Text>
                            {isMobile && <Text style={styles.rollNoMobile}>Roll: {student.rollNumber}</Text>}
                          </View>
                        </View>

                        {!isMobile && (
                          <View style={[styles.studentTd, { flex: 1.5 }]}>
                            <Text style={styles.rollNoText}>{student.rollNumber}</Text>
                          </View>
                        )}

                        <View style={[styles.studentTd, { flex: isMobile ? 0 : 2, alignItems: 'flex-end' }]}>
                          {!isMobile && (
                            <Text style={styles.feeAmountText}>{formatCurrency(student.totalFee)}</Text>
                          )}
                          <Text style={[styles.balanceAmountText, { color: isPaid ? '#4caf50' : '#FF7043' }]}>
                            {formatCurrency(student.balanceAmount)}{isMobile ? ' due' : ''}
                          </Text>
                          {isMobile && (
                            <View style={[styles.statusBadge, { backgroundColor: isPaid ? 'rgba(76,175,80,0.15)' : 'rgba(255,112,67,0.12)', marginTop: 4 }]}>
                              <Text style={[styles.statusText, { color: isPaid ? '#4caf50' : '#FF7043' }]}>
                                {isPaid ? 'PAID' : 'PENDING'}
                              </Text>
                            </View>
                          )}
                        </View>

                        {!isMobile && (
                          <View style={[styles.studentTd, { flex: 1.5, alignItems: 'center' }]}>
                            <View style={[styles.statusBadge, { backgroundColor: isPaid ? 'rgba(76,175,80,0.15)' : 'rgba(255,112,67,0.12)' }]}>
                              <Text style={[styles.statusText, { color: isPaid ? '#4caf50' : '#FF7043' }]}>
                                {isPaid ? 'PAID' : 'PENDING'}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Users size={52} color="#2a4555" />
                  <Text style={styles.noDataText}>No students or fee records found in this class.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ─── PALETTE ─────────────────────────────────────────────────────────────────
// bg:        #f5f7f9   (off-white page background)
// surface:   #ffffff   (cards, table rows)
// header:    #2D3F49   (top header bar — brand color)
// tableHead: #2D3F49   (table / modal header)
// border:    #e4eaed
// cyan:      #00BCD4
// text:      #1e2d36
// muted:     #7a96a4

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7f9' },

  // ── Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 18,
    backgroundColor: '#2D3F49',
    borderBottomWidth: 0,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(0,188,212,0.18)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0,188,212,0.35)',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#ffffff', letterSpacing: 0.3 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  headerBadge: {
    backgroundColor: 'rgba(0,188,212,0.18)',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,188,212,0.4)',
  },
  headerBadgeText: { fontSize: 12, fontWeight: '700', color: '#00BCD4' },

  // ── Dashboard Stats
  dashboardContainer: { padding: 16, paddingBottom: 8 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#e4eaed',
    borderTopWidth: 3, overflow: 'hidden',
    shadowColor: '#2D3F49', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  statIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  statValue: { fontSize: 15, fontWeight: '800', color: '#1e2d36', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#7a96a4', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statAccent: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, opacity: 0.4 },

  // ── Search
  searchWrapper: { paddingHorizontal: 16, paddingVertical: 10 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ffffff', paddingHorizontal: 14, paddingVertical: 11,
    borderRadius: 12, borderWidth: 1, borderColor: '#e4eaed', gap: 10,
    shadowColor: '#2D3F49', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1e2d36' },

  // ── Scroll
  scrollContentContainer: { paddingBottom: 32 },
  mobileListContainer: { paddingHorizontal: 16, paddingTop: 4 },
  loaderContainer: { padding: 60, justifyContent: 'center', alignItems: 'center', gap: 14 },
  loaderText: { fontSize: 14, color: '#7a96a4' },
  emptyState: { padding: 70, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#2D3F49' },
  emptyText: { fontSize: 13, color: '#a0b4bc', textAlign: 'center' },

  // ── Mobile Card
  classCard: {
    backgroundColor: '#ffffff', borderRadius: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#e4eaed', overflow: 'hidden',
    shadowColor: '#2D3F49', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  cardStripe: { height: 3, backgroundColor: '#00BCD4' },
  classCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingTop: 12, marginBottom: 10,
  },
  classBadge: {
    backgroundColor: 'rgba(0,188,212,0.08)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(0,188,212,0.22)',
  },
  classBadgeText: { fontSize: 12, fontWeight: '700', color: '#00BCD4' },
  cardEyeBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: 'rgba(0,188,212,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  noFeeContainer: {
    alignItems: 'center', paddingVertical: 20, gap: 8,
    paddingHorizontal: 14,
  },
  noFeeText: { fontSize: 13, color: '#a0b4bc', fontWeight: '500' },
  classStats: {
    flexDirection: 'row', paddingHorizontal: 14, marginBottom: 12,
  },
  classStat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#e4eaed', marginVertical: 4 },
  classStatLabel: { fontSize: 9, color: '#7a96a4', marginBottom: 4, fontWeight: '600', textTransform: 'uppercase' },
  classStatValue: { fontSize: 13, fontWeight: '700', color: '#1e2d36' },

  progressContainer: { paddingHorizontal: 14, marginBottom: 12 },
  progressTrack: { height: 5, backgroundColor: '#e8f0f3', borderRadius: 3, overflow: 'hidden', marginBottom: 5 },
  progressFill: { height: '100%', backgroundColor: '#00BCD4', borderRadius: 3 },
  progressText: { fontSize: 10, color: '#7a96a4', textAlign: 'right' },

  classFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#f0f4f6',
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerText: { fontSize: 10, color: '#7a96a4' },
  viewDetailsText: { fontSize: 11, color: '#00BCD4', fontWeight: '700' },

  // ── Desktop Table
  webTableWrapper: { marginHorizontal: 16 },
  tableContainer: {
    backgroundColor: '#ffffff', borderRadius: 14,
    borderWidth: 1, borderColor: '#e4eaed', overflow: 'hidden', minWidth: 1000,
    shadowColor: '#2D3F49', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2D3F49',
    paddingVertical: 13, paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  tableHeaderCell: {
    fontSize: 11, fontWeight: '700', color: '#ffffff',
    flex: 1, textTransform: 'uppercase', letterSpacing: 0.6,
  },
  tableRowWrapper: { borderBottomWidth: 1, borderBottomColor: '#f0f4f6' },
  tableRow: {
    flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 16,
    alignItems: 'center', backgroundColor: '#ffffff',
  },
  tableRowExpanded: { backgroundColor: '#f5f8fa' },
  tableCell: { fontSize: 13, color: '#1e2d36', flex: 1 },

  // Cell widths
  cellClass: { flex: 0.8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cellTeacher: { flex: 1 },
  cellExpected: { flex: 0.85 },
  cellCollected: { flex: 0.85 },
  cellPending: { flex: 0.85 },
  cellProgress: { flex: 0.75, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cellAction: { flex: 0.7 },

  classChip: {
    backgroundColor: 'rgba(45,63,73,0.08)',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
    borderWidth: 1, borderColor: 'rgba(45,63,73,0.15)',
  },
  classChipText: { fontSize: 11, fontWeight: '700', color: '#2D3F49' },
  sectionText: { fontSize: 13, color: '#7a96a4', fontWeight: '600' },

  progressTrackSmall: {
    flex: 1, height: 5, backgroundColor: '#e8f0f3', borderRadius: 3, overflow: 'hidden',
  },
  progressFillSmall: { height: '100%', backgroundColor: '#00BCD4', borderRadius: 3 },
  progressPercent: { fontSize: 11, fontWeight: '700', color: '#00BCD4', width: 44, textAlign: 'right' },
  noFeeBadge: { fontSize: 11, color: '#a0b4bc', fontStyle: 'italic' },

  viewRowBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    backgroundColor: 'rgba(0,188,212,0.08)',
    borderWidth: 1, borderColor: 'rgba(0,188,212,0.22)',
  },
  viewRowBtnText: { fontSize: 11, fontWeight: '700', color: '#00BCD4' },
  expandBtn: { width: 40, alignItems: 'center', padding: 8 },

  // ── Expanded Row
  expandedRow: {
    backgroundColor: '#f5f8fa', paddingHorizontal: 20, paddingVertical: 18,
    borderTopWidth: 1, borderTopColor: '#e4eaed',
  },
  expandedTitle: {
    fontSize: 12, fontWeight: '700', color: '#2D3F49',
    marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  detailItem: { flex: 1, minWidth: 140 },
  detailLabel: {
    fontSize: 10, fontWeight: '700', color: '#a0b4bc',
    marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  detailValue: { fontSize: 14, color: '#1e2d36', fontWeight: '600' },

  // ── Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(30,45,54,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    backgroundColor: '#ffffff', borderRadius: 18,
    borderWidth: 1, borderColor: '#e4eaed',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15, shadowRadius: 40, elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(0,188,212,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0,188,212,0.25)',
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#1e2d36' },
  modalSubtitle: { fontSize: 11, color: '#7a96a4', marginTop: 2 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: '#f5f7f9', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e4eaed',
  },

  // ── Student Table in Modal
  studentTable: { borderWidth: 1, borderColor: '#e4eaed', borderRadius: 12, overflow: 'hidden' },
  studentTableHeader: {
    flexDirection: 'row', backgroundColor: '#2D3F49',
    paddingVertical: 12, paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  studentTh: { fontSize: 11, fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
  studentRow: {
    flexDirection: 'row', paddingVertical: 13, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#f0f4f6',
    backgroundColor: '#ffffff', alignItems: 'center',
  },
  studentTd: { justifyContent: 'center' },

  avatarContainer: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  avatarText: { fontSize: 14, fontWeight: '800' },
  studentNameText: { fontSize: 13, fontWeight: '600', color: '#1e2d36' },
  rollNoMobile: { fontSize: 11, color: '#7a96a4', marginTop: 2 },
  rollNoText: { fontSize: 12, color: '#7a96a4', fontWeight: '500' },

  feeAmountText: { fontSize: 13, color: '#1e2d36', fontWeight: '600', marginBottom: 2 },
  balanceAmountText: { fontSize: 13, fontWeight: '800' },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  noDataContainer: { alignItems: 'center', padding: 50, gap: 14 },
  noDataText: { fontSize: 14, color: '#a0b4bc', textAlign: 'center', lineHeight: 22 },
});