import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput,
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Modal,
  Alert,
  useWindowDimensions,
  Platform
} from 'react-native';
import * as Icons from 'lucide-react-native';

const academicData = [
  { class: 'Class 12-A', avg: '89%', status: 'Excellent', segment: 'High School', studentCount: '42 Students', topper: '98.5%', lowScore: '61%', subjects: { Math: '91%', Science: '94%', English: '88%' } },
  { class: 'Class 10-A', avg: '84%', status: 'Good', segment: 'High School', studentCount: '45 Students', topper: '96.2%', lowScore: '58%', subjects: { Math: '82%', Science: '88%', English: '85%' } },
  { class: 'Class 10-B', avg: '72%', status: 'Average', segment: 'High School', studentCount: '38 Students', topper: '89.0%', lowScore: '45%', subjects: { Math: '68%', Science: '74%', English: '75%' } },
  { class: 'Class 9-A', avg: '65%', status: 'Needs Imp.', segment: 'High School', studentCount: '40 Students', topper: '82.4%', lowScore: '33%', subjects: { Math: '51%', Science: '62%', English: '60%' } },
  { class: 'Class 8-A', avg: '78%', status: 'Good', segment: 'Middle School', studentCount: '35 Students', topper: '91.2%', lowScore: '52%', subjects: { Math: '76%', Science: '80%', English: '82%' } },
];

export default function AcademicReports() {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegmentFilter, setActiveSegmentFilter] = useState('All');

  // Dual Modals Configuration States
  const [selectedClass, setSelectedClass] = useState(null);
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);

  // Warning Form Context Fields State
  const [noticeType, setNoticeType] = useState('Select Review Category');
  const [noticeReason, setNoticeReason] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isLargeScreen = width >= 768;

  const filteredData = academicData.filter(item => {
    const matchesSearch = item.class.toLowerCase().includes(searchQuery.toLowerCase()) || item.status.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = activeSegmentFilter === 'All' ? true : item.segment === activeSegmentFilter;
    return matchesSearch && matchesSegment;
  });

  const openAnalyticsModal = (item) => {
    setSelectedClass(item);
    setAnalyticsModalVisible(true);
  };

  const openWarningModal = (item) => {
    setSelectedClass(item);
    setNoticeType('Select Review Category');
    setNoticeReason('');
    setIsDropdownOpen(false);
    setWarningModalVisible(true);
  };

  const dispatchNoticeLogSubmission = () => {
    if (noticeType === 'Select Review Category' || !noticeReason.trim()) {
      Alert.alert("Execution Denied", "Please pick a clear enforcement category and provide observation grounds context.");
      return;
    }
    Alert.alert(
      "Notice Dispatched Successfully",
      `Disciplinary academic warning [${noticeType}] has been registered for the faculty head of ${selectedClass.class}.`,
      [{ text: "OK", onPress: () => setWarningModalVisible(false) }]
    );
  };

  const renderItem = ({ item }) => {
    let statusColor = '#16a34a'; 
    if (item.status === 'Average') statusColor = '#F4A460'; 
    if (item.status === 'Needs Imp.') statusColor = '#E35336'; 

    const isLowPerformer = item.status === 'Needs Imp.' || item.status === 'Average';

    if (isLargeScreen) {
      return (
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.cellClassBlock]}>
            <Text style={styles.itemClassText}>{item.class}</Text>
            <Text style={styles.itemStudentCountText}>{item.studentCount}</Text>
          </View>
          
          <View style={[styles.tableCell, styles.cellProgressBlock]}>
            <Text style={styles.progressValueText}>{item.avg} Average</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: item.avg, backgroundColor: statusColor }]} />
            </View>
          </View>
          
          <Text style={[styles.tableCell, styles.cellMeta, { color: '#16a34a', fontWeight: '700' }]}>{item.topper}</Text>
          <Text style={[styles.tableCell, styles.cellMeta, { color: '#E35336', fontWeight: '600' }]}>{item.lowScore}</Text>
          
          <View style={[styles.tableCell, styles.cellStatusBlock]}>
            <Text style={[styles.statusTextLabel, { color: statusColor }]}>• {item.status}</Text>
          </View>

          {/* Large Screen Desktop Actions Grid layout buttons */}
          <View style={[styles.tableCell, styles.cellDesktopActionsGroup]}>
            <TouchableOpacity style={[styles.desktopActionBtn, styles.btnViewBlue]} onPress={() => openAnalyticsModal(item)}>
              <Icons.Eye size={13} color="#A0522D" />
              <Text style={styles.btnTextStyleView}>Metrics</Text>
            </TouchableOpacity>
            
            {isLowPerformer && (
              <TouchableOpacity style={[styles.desktopActionBtn, styles.btnActionWarning]} onPress={() => openWarningModal(item)}>
                <Icons.AlertTriangle size={13} color="#ffffff" />
                <Text style={styles.btnTextStyleWarning}>Notice</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mobileCard}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.cardClassTitle}>{item.class}</Text>
            <Text style={styles.cardStudentCount}>{item.studentCount} • {item.segment}</Text>
          </View>
          <Text style={[styles.statusTextLabel, { color: statusColor }, { fontWeight: '700', fontSize: 12 }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>

        <View style={styles.cardMetricsTrackRow}>
          <Text style={styles.cardMetricsLabelText}>Class Mean Score Rate:</Text>
          <Text style={[styles.cardMetricsValueText, { color: statusColor }]}>{item.avg}</Text>
        </View>
        <View style={styles.progressContainerMobile}>
          <View style={[styles.progressBar, { width: item.avg, backgroundColor: statusColor }]} />
        </View>

        <View style={styles.cardFooterGrid}>
          <View style={styles.footerDataColumn}>
            <Text style={styles.footerMetaLabel}>Topper Score</Text>
            <Text style={[styles.footerMetaValue, { color: '#16a34a' }]}>{item.topper}</Text>
          </View>
          <View style={styles.footerDataColumn}>
            <Text style={styles.footerMetaLabel}>Lowest Score</Text>
            <Text style={[styles.footerMetaValue, { color: '#E35336' }]}>{item.lowScore}</Text>
          </View>
        </View>

        {/* Mobile Action Buttons Footer Matrix Split layout logic */}
        <View style={styles.cardActionsRowMobile}>
          <TouchableOpacity style={[styles.mobileActionBtn, styles.mobileBtnView]} onPress={() => openAnalyticsModal(item)}>
            <Icons.BarChart3 size={14} color="#A0522D" />
            <Text style={styles.btnTextStyleView}>Inspect Analytics</Text>
          </TouchableOpacity>
          
          {isLowPerformer && (
            <TouchableOpacity style={[styles.mobileActionBtn, styles.mobileBtnWarning]} onPress={() => openWarningModal(item)}>
              <Icons.AlertTriangle size={14} color="#ffffff" />
              <Text style={styles.mobileBtnTextWarning}>Issue Notice</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const RenderDashboardContent = () => (
    <View style={{ flex: 1 }}>
      {/* Overview Stats Row widgets */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.iconWrapperBox, { backgroundColor: '#eaddcc' }]}><Icons.Award color="#A0522D" size={18} /></View>
          <View style={styles.statCardTextWrap}><Text style={styles.statLabel}>Avg School Performance</Text><Text style={styles.statValue}>76.5%</Text></View>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.iconWrapperBox, { backgroundColor: '#e8f5e9' }]}><Icons.CheckCircle2 color="#16a34a" size={18} /></View>
          <View style={styles.statCardTextWrap}><Text style={styles.statLabel}>Top Performing Cohort</Text><Text style={[styles.statValue, { color: '#16a34a' }]}>Class 12-A</Text></View>
        </View>
      </View>

      <View style={styles.searchBarBox}>
        <Icons.Search color="#8c7664" size={18} style={styles.searchIconSpacing} />
        <TextInput
          style={styles.searchBarInputField}
          placeholder="Search performance logs by class keyword index..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#bc9e82"
        />
      </View>

      <View style={styles.tabsDividerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
          {['All', 'High School', 'Middle School'].map((tab) => {
            const isActive = activeSegmentFilter === tab;
            return (
              <TouchableOpacity key={tab} style={[styles.tabFilterChip, isActive && styles.tabFilterChipActive]} onPress={() => setActiveSegmentFilter(tab)}>
                <Text style={[styles.tabFilterChipText, isActive && styles.tabFilterChipTextActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLargeScreen && (
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.cellClassBlock]}>Class Identifier</Text>
          <Text style={[styles.tableHeaderCell, styles.cellProgressBlock]}>Batch Mean Progress</Text>
          <Text style={[styles.tableHeaderCell, styles.cellMeta]}>Topper</Text>
          <Text style={[styles.tableHeaderCell, styles.cellMeta]}>Lowest</Text>
          <Text style={[styles.tableHeaderCell, styles.cellStatusBlock]}>Enforcement</Text>
          <Text style={[styles.tableHeaderCell, styles.cellDesktopActionsGroupHeader]}>Roster Controls</Text>
        </View>
      )}

      <FlatList
        data={filteredData}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={renderItem}
        scrollEnabled={isLargeScreen}
        contentContainerStyle={styles.listFeedContentPadding}
      />
    </View>
  );

  return (
    <View style={styles.appMasterBodyWrapper}>
      {isLargeScreen ? (
        <View style={styles.container}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Academic Performance Terminal</Text>
            <Text style={styles.welcomeSubtitle}>Track sectional class averages, evaluate data matrices, and enforce corrective syllabus notice orders.</Text>
          </View>
          <RenderDashboardContent />
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Academic Reports</Text>
            <Text style={styles.welcomeSubtitle}>Overview tracking averages and warnings logs.</Text>
          </View>
          <RenderDashboardContent />
        </ScrollView>
      )}

      {/* =========================================================
          MODAL ONE: DETAILED CLASS PERFORMANCE BREAKDOWN
          ========================================================= */}
      <Modal animationType="fade" transparent={true} visible={analyticsModalVisible} onRequestClose={() => setAnalyticsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCardWrapper, { width: isLargeScreen ? 460 : '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Subject Breakdown Metrics</Text>
              <TouchableOpacity onPress={() => setAnalyticsModalVisible(false)} style={styles.modalCloseBtn}><Icons.X size={18} color="#A0522D" /></TouchableOpacity>
            </View>

            {selectedClass && (
              <ScrollView contentContainerStyle={styles.modalScrollBody}>
                <Text style={styles.modalSectionSubHeading}>Roster Track: <Text style={{fontWeight: '700', color: '#2e2520'}}>{selectedClass.class} ({selectedClass.studentCount})</Text></Text>
                
                {Object.entries(selectedClass.subjects).map(([subject, rate]) => (
                  <View key={subject} style={styles.subjectRowCard}>
                    <View style={styles.subjectTextMetaRow}>
                      <Text style={styles.subjectNameText}>{subject} Performance</Text>
                      <Text style={styles.subjectRateValueText}>{rate}</Text>
                    </View>
                    <View style={styles.subjectProgressBarTrackBg}>
                      <View style={[styles.progressBar, { width: rate, backgroundColor: '#F4A460' }]} />
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity style={[styles.modalFooterDismissFullBtn, {backgroundColor: '#A0522D'}]} onPress={() => setAnalyticsModalVisible(false)}>
              <Text style={styles.modalFooterDismissFullBtnText}>Close Analytics File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          MODAL TWO: LOW PERFORMER CORRECTIVE WARNING DISPATCHER
          ========================================================= */}
      <Modal animationType="fade" transparent={true} visible={warningModalVisible} onRequestClose={() => setWarningModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCardWrapper, { width: isLargeScreen ? 480 : '92%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Deploy Corrective Notice Order</Text>
              <TouchableOpacity onPress={() => setWarningModalVisible(false)} style={styles.modalCloseBtn}><Icons.X size={18} color="#A0522D" /></TouchableOpacity>
            </View>

            {selectedClass && (
              <View style={styles.modalScrollBody}>
                <Text style={styles.targetStudentLabel}>Target Cohort Sector: <Text style={{fontWeight: '700', color: '#2e2520'}}>{selectedClass.class} (Mean Avg: {selectedClass.avg})</Text></Text>
                
                <Text style={styles.inputHeading}>Select Disciplinary Review Type Category:</Text>
                <TouchableOpacity style={styles.dropdownSelectorTriggerField} onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <Text style={styles.dropdownSelectorTriggerFieldText}>{noticeType}</Text>
                  <Icons.ChevronDown size={16} color="#A0522D" />
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View style={styles.dropdownOptionContainerBlockBox}>
                    {['Syllabus Slack Alert Notification', 'Remedial Class Target Enforced', 'Urgent Faculty Performance Review'].map((option) => (
                      <TouchableOpacity key={option} style={styles.dropdownOptionItemRowElement} onPress={() => { setNoticeType(option); setIsDropdownOpen(false); }}>
                        <Text style={styles.dropdownOptionItemRowElementText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={styles.inputHeading}>Write Performance Discrepancy Evaluation Memo:</Text>
                <TextInput
                  style={styles.reasonInputTextMultilineBox}
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Provide structured target statements or instructions for faculty improvements here..."
                  placeholderTextColor="#bc9e82"
                  value={noticeReason}
                  onChangeText={setNoticeReason}
                />
              </View>
            )}

            <TouchableOpacity style={[styles.modalFooterDismissFullBtn, {backgroundColor: '#E35336'}]} onPress={dispatchNoticeLogSubmission}>
              <Text style={styles.modalFooterDismissFullBtnText}>Dispatch Faculty Notice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  appMasterBodyWrapper: { flex: 1, backgroundColor: '#F5F5DC' },
  container: { flex: 1, padding: 16 },
  welcomeSection: { marginBottom: 20 },
  welcomeTitle: { fontSize: 22, fontWeight: '700', color: '#A0522D' },
  welcomeSubtitle: { fontSize: 14, color: '#8c7664', marginTop: 4, lineHeight: 20, fontWeight: '500' },
  
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, minWidth: '47%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#ffffff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#eaddcc' },
  iconWrapperBox: { width: 36, height: 36, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  statCardTextWrap: { flex: 1 },
  statLabel: { fontSize: 11, color: '#8c7664', fontWeight: '500' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#A0522D', marginTop: 2 },
  
  searchBarBox: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 16 },
  searchIconSpacing: { marginRight: 8 },
  searchBarInputField: { flex: 1, fontSize: 14, color: '#2e2520' },
  tabsDividerContainer: { height: 44, justifyContent: 'center', marginBottom: 16 },
  tabsScrollContent: { gap: 6, alignItems: 'center' },
  tabFilterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc' },
  tabFilterChipActive: { backgroundColor: '#F4A460', borderColor: '#F4A460' },
  tabFilterChipText: { fontSize: 13, fontWeight: '600', color: '#8c7664' },
  tabFilterChipTextActive: { color: '#ffffff', fontWeight: '700' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#A0522D' },

  /* --- WIDE GRID CELLS SYSTEM --- */
  tableHeader: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 12, paddingHorizontal: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center' },
  tableHeaderCell: { fontSize: 13, fontWeight: '700', color: '#A0522D' },
  tableRow: { flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', alignItems: 'center' },
  tableCell: { fontSize: 14, color: '#2e2520' },
  cellClassBlock: { flex: 1 },
  cellProgressBlock: { flex: 1.8, paddingRight: 12 },
  cellMeta: { flex: 0.7 },
  cellStatusBlock: { flex: 0.8 },
  cellDesktopActionsGroupHeader: { flex: 1.8, textAlign: 'center' },
  cellDesktopActionsGroup: { flex: 1.8, flexDirection: 'row', gap: 6, justifyContent: 'center' },
  
  itemClassText: { fontSize: 14, fontWeight: '700', color: '#2e2520' },
  itemStudentCountText: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  progressValueText: { fontSize: 12, fontWeight: '700', color: '#4a3e3d', marginBottom: 4 },
  progressContainer: { width: '100%', height: 6, backgroundColor: '#f5ebe0', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 },
  statusTextLabel: { fontSize: 13, fontWeight: '600' },
  
  /* --- MASTER DESKTOP LAYOUT SHIFTERS --- */
  desktopActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  btnViewBlue: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc' },
  btnActionWarning: { backgroundColor: '#E35336' },
  btnTextStyleView: { fontSize: 12, fontWeight: '700', color: '#A0522D' },
  btnTextStyleWarning: { fontSize: 12, fontWeight: '700', color: '#ffffff' },

  /* --- ADAPTIVE PHONE CARDS GRAPHICS --- */
  listFeedContentPadding: { paddingBottom: 24 },
  mobileCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#eaddcc' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardClassTitle: { fontSize: 16, fontWeight: '700', color: '#2e2520' },
  cardStudentCount: { fontSize: 12, color: '#8c7664', marginTop: 2, fontWeight: '500' },
  cardMetricsTrackRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  cardMetricsLabelText: { fontSize: 13, color: '#4a3e3d', fontWeight: '500' },
  cardMetricsValueText: { fontSize: 14, fontWeight: '700' },
  progressContainerMobile: { width: '100%', height: 6, backgroundColor: '#f5ebe0', borderRadius: 3, overflow: 'hidden', marginVertical: 8 },
  cardFooterGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#faf6f0', padding: 10, borderRadius: 8, marginTop: 4, borderWidth: 1, borderColor: '#f5ebe0' },
  footerDataColumn: { alignItems: 'flex-start' },
  footerMetaLabel: { fontSize: 11, color: '#bc9e82', textTransform: 'uppercase' },
  footerMetaValue: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  cardActionsRowMobile: { flexDirection: 'row', gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f5ebe0' },
  mobileActionBtn: { flex: 1, height: 36, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  mobileBtnView: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc' },
  mobileBtnWarning: { backgroundColor: '#E35336' },
  mobileBtnTextWarning: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  /* --- MULTI-MODALS INTERFACE CORES --- */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(46, 37, 32, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCardWrapper: { backgroundColor: '#ffffff', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#eaddcc' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', backgroundColor: '#faf6f0' },
  modalHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#A0522D' },
  modalCloseBtn: { padding: 4, backgroundColor: '#ffffff', borderRadius: 6, borderWidth: 1, borderColor: '#eaddcc' },
  modalScrollBody: { padding: 16 },

  /* --- SUBJECT SPECIFIC OVERVIEW BLOCKS --- */
  modalSectionSubHeading: { fontSize: 14, color: '#8c7664', marginBottom: 14, fontWeight: '500' },
  subjectRowCard: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#faf6f0', paddingVertical: 12 },
  subjectTextMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  subjectNameText: { fontSize: 14, fontWeight: '600', color: '#4a3e3d' },
  subjectRateValueText: { fontSize: 14, fontWeight: '700', color: '#A0522D' },
  subjectProgressBarTrackBg: { width: '100%', height: 6, backgroundColor: '#f5ebe0', borderRadius: 3, overflow: 'hidden' },

  /* --- NOTICE FILING BLOCKS FORM SYSTEM --- */
  targetStudentLabel: { fontSize: 14, color: '#8c7664', marginBottom: 14, fontWeight: '500' },
  inputHeading: { fontSize: 11, fontWeight: '700', color: '#A0522D', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  dropdownSelectorTriggerField: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', paddingHorizontal: 12, height: 42, borderRadius: 6, marginBottom: 8 },
  dropdownSelectorTriggerFieldText: { fontSize: 14, color: '#2e2520', fontWeight: '600' },
  dropdownOptionContainerBlockBox: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 6, paddingVertical: 4, marginBottom: 12 },
  dropdownOptionItemRowElement: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#faf6f0' },
  dropdownOptionItemRowElementText: { fontSize: 13, color: '#E35336', fontWeight: '600' },
  reasonInputTextMultilineBox: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 6, padding: 12, fontSize: 14, color: '#2e2520', minHeight: 80, textAlignVertical: 'top' },
  
  modalFooterDismissFullBtn: { height: 46, alignItems: 'center', justifyContent: 'center' },
  modalFooterDismissFullBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  fallbackEmptyBox: { alignItems: 'center', padding: 24 }, fallbackEmptyText: { color: '#8c7664', fontSize: 13 }
});