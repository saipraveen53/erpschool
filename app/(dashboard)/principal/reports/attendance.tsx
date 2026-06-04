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

// Analytics Roster Data
const mockReportData = [
  { id: '1', name: 'Class 10-A', type: 'Student', monthAvg: '94.2%', riskStudents: '2 Flagged', compliance: 'High', staffHead: 'Mrs. Anjali Sharma' },
  { id: '2', name: 'Class 10-B', type: 'Student', monthAvg: '#E35336_71.5%', riskStudents: '9 Flagged', compliance: 'Critical', staffHead: 'Mr. Amit Khurana' },
  { id: '3', name: 'Class 12-A', type: 'Student', monthAvg: '98.0%', riskStudents: '0 Flagged', compliance: 'Excellent', staffHead: 'Dr. Vikram Malhotra' },
  { id: '4', name: 'Class 9-C', type: 'Student', monthAvg: '86.4%', riskStudents: '4 Flagged', compliance: 'Medium', staffHead: 'Miss Sanya Kapoor' },
  { id: '5', name: 'Primary Faculty', type: 'Staff', monthAvg: '93.1%', riskStudents: '1 On Leave', compliance: 'High', staffHead: 'Mrs. Preeti Sen' },
];

export default function AttendanceReports() {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoster, setSelectedRoster] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isLargeScreen = width >= 768;

  const filteredReports = mockReportData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.staffHead.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerDrillDown = (roster) => {
    setSelectedRoster(roster);
    setModalVisible(true);
  };

  const executeExport = (format) => {
    Alert.alert("Report Compiled", `Comprehensive attendance audit sheets exported as institutional ${format} file.`);
  };

  const renderReportItem = ({ item }) => {
    // Parsing custom dynamic flags inside string if any
    const displayAvg = item.monthAvg.includes('_') ? item.monthAvg.split('_')[1] : item.monthAvg;
    const isCritical = item.compliance === 'Critical';
    const isExcellent = item.compliance === 'Excellent';

    let statusColor = '#F4A460'; // Medium/Average
    if (isExcellent || item.compliance === 'High') statusColor = '#16a34a';
    if (isCritical) statusColor = '#E35336';

    if (isLargeScreen) {
      return (
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.cellMainGroup]}>
            <Text style={styles.rowMainTitle}>{item.name}</Text>
            <Text style={styles.rowSubTitle}>In-Charge: {item.staffHead}</Text>
          </View>
          <Text style={[styles.tableCell, styles.cellMeta]}>{item.type}</Text>
          <Text style={[styles.tableCell, styles.cellMeta, { fontWeight: '700', color: statusColor }]}>{displayAvg}</Text>
          <Text style={[styles.tableCell, styles.cellMeta, { color: isCritical ? '#E35336' : '#8c7664' }]}>{item.riskStudents}</Text>
          <View style={[styles.tableCell, styles.cellBadgeBlock]}>
            <Text style={[styles.statusTextLabel, { color: statusColor }]}>• {item.compliance}</Text>
          </View>
          <TouchableOpacity style={styles.desktopAuditBtn} onPress={() => triggerDrillDown(item)}>
            <Icons.TrendingUp size={14} color="#ffffff" />
            <Text style={styles.desktopAuditBtnText}>Drill Down</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.mobileCard}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.cardMainTitle}>{item.name}</Text>
            <Text style={styles.cardSubTitle}>Supervisor: {item.staffHead}</Text>
          </View>
          <View style={[styles.miniStatusTag, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.miniStatusTagText, { color: statusColor }]}>{item.compliance}</Text>
          </View>
        </View>

        <View style={styles.cardMetricsSplitGrid}>
          <View style={styles.splitDataColumn}>
            <Text style={styles.splitLabel}>Monthly Mean</Text>
            <Text style={[styles.splitValue, { color: statusColor }]}>{displayAvg}</Text>
          </View>
          <View style={styles.splitDataColumn}>
            <Text style={styles.splitLabel}>Risk Flags</Text>
            <Text style={[styles.splitValue, { color: isCritical ? '#E35336' : '#2e2520' }]}>{item.riskStudents}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.mobileActionBtn} onPress={() => triggerDrillDown(item)}>
          <Icons.AreaChart size={14} color="#A0522D" />
          <Text style={styles.mobileActionBtnText}>Inspect Dynamic Roster Stack</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const RenderReportWorkspace = () => (
    <View style={{ flex: 1 }}>
      {/* 1. Analytical Summary Ribbons */}
      <View style={styles.analyticalRibbonFrame}>
        <View style={styles.ribbonSection}>
          <Text style={styles.ribbonLabel}>System Compliance Target</Text>
          <Text style={[styles.ribbonValue, { color: '#16a34a' }]}>92.4% Avg</Text>
        </View>
        <View style={styles.ribbonDividerLine} />
        <View style={styles.ribbonSection}>
          <Text style={styles.ribbonLabel}>Chronic Absenteeism</Text>
          <Text style={[styles.ribbonValue, { color: '#E35336' }]}>11 Students</Text>
        </View>
      </View>

      {/* 2. Control Row Search System */}
      <View style={styles.searchBarBox}>
        <Icons.Search color="#8c7664" size={18} style={styles.searchIconSpacing} />
        <TextInput
          style={styles.searchBarInputField}
          placeholder="Search reports ledger by group sector or supervisor signature..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#bc9e82"
        />
      </View>

      {/* 3. Export Action Bar */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Institutional Audits</Text>
        <View style={styles.documentActionGroupRow}>
          <TouchableOpacity style={styles.exportBtn} onPress={() => executeExport('CSV Spreadsheet')}>
            <Icons.FileText size={14} color="#A0522D" />
            <Text style={styles.exportText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportBtn} onPress={() => executeExport('PDF Ledger')}>
            <Icons.Download size={14} color="#A0522D" />
            <Text style={styles.exportText}>PDF</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Wide Desktop Headers Grid Layout */}
      {isLargeScreen && (
        <View style={styles.masterTableHeader}>
          <Text style={[styles.tableHeaderCell, styles.cellMainGroup]}>Roster Cluster Group</Text>
          <Text style={[styles.tableHeaderCell, styles.cellMeta]}>Classification</Text>
          <Text style={[styles.tableHeaderCell, styles.cellMeta]}>Monthly Average</Text>
          <Text style={[styles.tableHeaderCell, styles.cellMeta]}>Risk Demerits</Text>
          <Text style={[styles.tableHeaderCell, styles.cellBadgeBlock]}>Compliance State</Text>
          <Text style={[styles.tableHeaderCell, styles.cellActionHeader]}>Action</Text>
        </View>
      )}

      {/* 5. FlatList Render Block */}
      <FlatList 
        data={filteredReports} 
        keyExtractor={item => item.id} 
        renderItem={renderReportItem} 
        scrollEnabled={isLargeScreen}
        contentContainerStyle={styles.listFeedScrollOffset}
      />
    </View>
  );

  return (
    <View style={styles.appMasterBodyFrame}>
      {isLargeScreen ? (
        <View style={styles.container}>
          <View style={styles.headerTitleArea}>
            <Text style={styles.mainTitle}>Attendance Analysis Ledger</Text>
            <Text style={styles.mainSubtitle}>Decompile monthly presence rates, cross-verify compliance clusters, and isolate chronic absenteeism trends.</Text>
          </View>
          <RenderReportWorkspace />
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerTitleArea}>
            <Text style={styles.mainTitle}>Attendance Reports</Text>
            <Text style={styles.mainSubtitle}>Compile monthly data logs and institutional tracking metrics.</Text>
          </View>
          <RenderReportWorkspace />
        </ScrollView>
      )}

      {/* =========================================================
          DYNAMIC MONTHLY TIME SUMMARY DRILL-DOWN MODAL
          ========================================================= */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCardWrapper, { width: isLargeScreen ? 460 : '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Roster Drill-Down File</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}><Icons.X size={18} color="#A0522D" /></TouchableOpacity>
            </View>

            {selectedRoster && (
              <ScrollView contentContainerStyle={styles.modalScrollBody}>
                <View style={styles.modalSummaryStripHeader}>
                  <Text style={styles.summaryStripTitle}>{selectedRoster.name}</Text>
                  <Text style={styles.summaryStripSub}>Supervised under: {selectedRoster.staffHead}</Text>
                </View>

                <Text style={styles.inputFieldHeading}>Historical Semester Review Timeline:</Text>
                
                {/* Simulated time series data graph slots */}
                {['Week 1 Range Tracking', 'Week 2 Range Tracking', 'Week 3 Range Tracking'].map((week, idx) => {
                  const rates = ['96.2%', '91.0%', selectedRoster.name === 'Class 10-B' ? '68.4%' : '94.5%'];
                  return (
                    <View key={week} style={styles.timeSeriesLineRow}>
                      <Text style={styles.timeSeriesLabel}>{week}</Text>
                      <View style={styles.timeSeriesGraphSideBlock}>
                        <Text style={styles.timeSeriesValueText}>{rates[idx]}</Text>
                        <View style={styles.mockGraphBg}><View style={[styles.mockGraphFill, { width: rates[idx], backgroundColor: parseFloat(rates[idx]) < 75 ? '#E35336' : '#F4A460' }]} /></View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}

            <TouchableOpacity style={styles.dismissSubmitFullBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.dismissSubmitFullBtnText}>Close Audit Track</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  appMasterBodyFrame: { flex: 1, backgroundColor: '#F5F5DC' },
  container: { flex: 1, padding: 16 },
  headerTitleArea: { marginBottom: 20 },
  mainTitle: { fontSize: 22, fontWeight: '700', color: '#A0522D' },
  mainSubtitle: { fontSize: 14, color: '#8c7664', marginTop: 4, lineHeight: 20, fontWeight: '500' },

  /* --- ANALYTICAL CONSOLIDATED SUMMARY RIBBONS --- */
  analyticalRibbonFrame: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc', padding: 14, marginBottom: 16 },
  ribbonSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ribbonLabel: { fontSize: 11, fontWeight: '600', color: '#bc9e82', textTransform: 'uppercase' },
  ribbonValue: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  ribbonDividerLine: { width: 1, height: 30, backgroundColor: '#eaddcc', marginHorizontal: 4 },

  /* --- CONTROL TOOLBAR ELEMENT SYSTEM --- */
  searchBarBox: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 16 },
  searchIconSpacing: { marginRight: 8 },
  searchBarInputField: { flex: 1, fontSize: 14, color: '#2e2520' },
  
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#A0522D' },
  documentActionGroupRow: { flexDirection: 'row', gap: 6 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ffffff', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: '#eaddcc' },
  exportText: { fontSize: 12, fontWeight: '700', color: '#A0522D' },

  /* --- WIDE GRID TABLE CELL MATRIX DIMENSIONS --- */
  masterTableHeader: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 12, paddingHorizontal: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center' },
  tableHeaderCell: { fontSize: 13, fontWeight: '700', color: '#A0522D' },
  tableRow: { flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', alignItems: 'center' },
  tableCell: { fontSize: 14, color: '#2e2520' },
  cellMainGroup: { flex: 1.6 },
  cellMeta: { flex: 0.9 },
  cellBadgeBlock: { flex: 0.9 },
  cellActionHeader: { flex: 0.8, textAlign: 'center' },
  
  rowMainTitle: { fontSize: 14, fontWeight: '700', color: '#2e2520' },
  rowSubTitle: { fontSize: 12, color: '#8c7664', marginTop: 2, fontWeight: '500' },
  statusTextLabel: { fontSize: 13, fontWeight: '600' },
  desktopAuditBtn: { flex: 0.8, height: 32, backgroundColor: '#E35336', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  desktopAuditBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  /* --- PHONE VIEW COMPACT ADAPTIVE CARDS --- */
  listFeedScrollOffset: { paddingBottom: 24 },
  mobileCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#eaddcc' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardMainTitle: { fontSize: 15, fontWeight: '700', color: '#2e2520' },
  cardSubTitle: { fontSize: 12, color: '#8c7664', marginTop: 2, fontWeight: '500' },
  miniStatusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  miniStatusTagText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  cardMetricsSplitGrid: { flexDirection: 'row', backgroundColor: '#faf6f0', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#f5ebe0', marginBottom: 10 },
  splitDataColumn: { flex: 1, alignItems: 'flex-start' },
  splitLabel: { fontSize: 11, color: '#bc9e82', textTransform: 'uppercase', letterSpacing: 0.3 },
  splitValue: { fontSize: 14, fontWeight: '700', color: '#2e2520', marginTop: 3 },
  mobileActionBtn: { height: 36, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 },
  mobileActionBtnText: { color: '#A0522D', fontSize: 12, fontWeight: '700' },

  /* --- EXTENDED ACCORDION SUB-MODAL LAYOUTS --- */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(46, 37, 32, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCardWrapper: { backgroundColor: '#ffffff', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#eaddcc' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', backgroundColor: '#faf6f0' },
  modalHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#A0522D' },
  modalCloseBtn: { padding: 4 },
  modalScrollBody: { padding: 16 },
  
  modalSummaryStripHeader: { backgroundColor: '#faf6f0', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#f5ebe0' },
  summaryStripTitle: { fontSize: 15, fontWeight: '700', color: '#2e2520' },
  summaryStripSub: { fontSize: 12, color: '#8c7664', marginTop: 2, fontWeight: '500' },
  inputFieldHeading: { fontSize: 11, fontWeight: '700', color: '#A0522D', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  timeSeriesLineRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#faf6f0' },
  timeSeriesLabel: { fontSize: 13, fontWeight: '600', color: '#4a3e3d', marginBottom: 4 },
  timeSeriesGraphSideBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  timeSeriesValueText: { fontSize: 13, fontWeight: '700', color: '#2e2520', width: 44 },
  mockGraphBg: { flex: 1, height: 6, backgroundColor: '#f5ebe0', borderRadius: 3, overflow: 'hidden' },
  mockGraphFill: { height: '100%', borderRadius: 3 },
  
  dismissSubmitFullBtn: { height: 46, backgroundColor: '#A0522D', alignItems: 'center', justifyContent: 'center' },
  dismissSubmitFullBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' }
});