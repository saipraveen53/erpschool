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

// Student Live Tracking Static Data
const mockStudentAttendance = [
  { id: '1', name: 'Aarav Sharma', class: '10-A', rollNo: '01', status: 'Present', netRate: '95.2%', records: { totalDays: 180, present: 172, absent: 8 } },
  { id: '2', name: 'Rohan Verma', class: '10-B', rollNo: '23', status: 'Absent', netRate: '72.4%', records: { totalDays: 180, present: 130, absent: 50 } },
  { id: '3', name: 'Isha Patel', class: '12-A', rollNo: '14', status: 'Present', netRate: '98.5%', records: { totalDays: 180, present: 177, absent: 3 } },
  { id: '4', name: 'Sneha Reddy', class: '09-C', rollNo: '19', status: 'Late', netRate: '88.0%', records: { totalDays: 180, present: 158, absent: 22 } },
  { id: '5', name: 'Kabir Thapar', class: '11-B', rollNo: '07', status: 'Late', netRate: '84.3%', records: { totalDays: 180, present: 151, absent: 29 } },
];

export default function StudentAttendance() {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Dual Modals Architecture States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);

  // Warning Form Data States
  const [warningType, setWarningType] = useState('Select Action Type');
  const [warningReason, setWarningReason] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isLargeScreen = width >= 768;

  const filteredData = mockStudentAttendance.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.class.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const triggerViewModal = (student) => {
    setSelectedStudent(student);
    setViewModalVisible(true);
  };

  const triggerWarningModal = (student) => {
    setSelectedStudent(student);
    setWarningType('Select Action Type');
    setWarningReason('');
    setIsDropdownOpen(false);
    setWarningModalVisible(true);
  };

  const submitWarningForm = () => {
    if (warningType === 'Select Action Type' || !warningReason.trim()) {
      Alert.alert("Execution Denied", "Please select a warning category action type and fill the reason memo.");
      return;
    }
    
    Alert.alert(
      "Warning Action Dispatched",
      `Official ERP tracking penalty [${warningType}] registered successfully for ${selectedStudent.name}.\nReason Logged: "${warningReason}"`,
      [{ text: "OK", onPress: () => setWarningModalVisible(false) }]
    );
  };

  const renderItem = ({ item }) => {
    let statusStyle = styles.chipGreen; let textStyle = styles.textGreen;
    if (item.status === 'Late') { statusStyle = styles.chipAmber; textStyle = styles.textAmber; }
    if (item.status === 'Absent') { statusStyle = styles.chipRed; textStyle = styles.textRed; }

    if (isLargeScreen) {
      return (
        <View style={styles.tableRow}>
          {/* Avatar Rendering */}
          <View style={[styles.tableCell, styles.cellAvatar]}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
          </View>
          <View style={[styles.tableCell, styles.cellInfoBlock]}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSubText}>Class {item.class} • Roll No: {item.rollNo}</Text>
          </View>
          <Text style={[styles.tableCell, styles.cellRate]}>{item.netRate}</Text>
          <View style={[styles.tableCell, styles.cellStatus]}>
            <View style={[styles.statusIndicatorChip, statusStyle]}>
              <Text style={textStyle}>{item.status}</Text>
            </View>
          </View>
          {/* Actions Block */}
          <View style={[styles.tableCell, styles.cellActions]}>
            <TouchableOpacity style={[styles.actionBtn, styles.btnView]} onPress={() => triggerViewModal(item)}>
              <Icons.Eye size={14} color="#A0522D" />
              <Text style={styles.btnTextStyleView}>View Stack</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.btnWarning]} onPress={() => triggerWarningModal(item)}>
              <Icons.AlertTriangle size={14} color="#ffffff" />
              <Text style={styles.btnTextStyleWarning}>Warning</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mobileCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.mobileProfileBlock}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <View>
              <Text style={styles.cardStudentName}>{item.name}</Text>
              <Text style={styles.cardStudentClass}>Class {item.class} (Roll No: {item.rollNo})</Text>
            </View>
          </View>
          <View style={[styles.statusIndicatorChip, statusStyle]}>
            <Text style={textStyle}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.cardBodyRow}>
          <Text style={styles.cardRateText}>Net Attendance Weight: <Text style={{fontWeight: '700', color: '#A0522D'}}>{item.netRate}</Text></Text>
        </View>
        <View style={styles.cardActionsRowMobile}>
          <TouchableOpacity style={[styles.mobileActionBtn, styles.mobileBtnView]} onPress={() => triggerViewModal(item)}>
            <Icons.Eye size={14} color="#A0522D" />
            <Text style={styles.btnTextStyleView}>View Stack</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mobileActionBtn, styles.mobileBtnWarning]} onPress={() => triggerWarningModal(item)}>
            <Icons.AlertTriangle size={14} color="#ffffff" />
            <Text style={styles.mobileBtnTextWarning}>Issue Warning</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Page Title Header Area */}
      <View style={styles.headerTitleArea}>
        <Text style={styles.mainTitle}>Student Attendance Matrix</Text>
        <Text style={styles.mainSubtitle}>Review daily tracking rolls, trace academic semester counters, and file performance adjustments.</Text>
      </View>

      {/* Tracker Widgets */}
      <View style={[styles.statsGridRow, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
        <View style={styles.statWidgetCard}>
          <View style={[styles.widgetIconBox, { backgroundColor: '#eaddcc' }]}><Icons.Users color="#A0522D" size={20} /></View>
          <View><Text style={styles.widgetValue}>1,245 Students</Text><Text style={styles.widgetTitle}>Enrolled Active Ledger</Text></View>
        </View>
        <View style={styles.statWidgetCard}>
          <View style={[styles.widgetIconBox, { backgroundColor: '#ffebee' }]}><Icons.AlertTriangle color="#E35336" size={20} /></View>
          <View><Text style={[styles.widgetValue, {color: '#E35336'}]}>12 Flagged</Text><Text style={styles.widgetTitle}>Critical Attendance Warnings</Text></View>
        </View>
      </View>

      {/* Control Actions Row */}
      <View style={[styles.controlsRow, { flexDirection: isLargeScreen ? 'row' : 'column', alignItems: isLargeScreen ? 'center' : 'stretch' }]}>
        <View style={styles.searchBarBox}>
          <Icons.Search color="#8c7664" size={18} style={styles.searchIconSpacing} />
          <TextInput
            style={styles.searchBarInputField}
            placeholder="Search student profile matrix by keyword name or class index..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#bc9e82"
          />
        </View>

        <View style={styles.tabsDividerContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
            {['All', 'Present', 'Late', 'Absent'].map((tab) => {
              const isActive = statusFilter === tab;
              return (
                <TouchableOpacity key={tab} style={[styles.tabFilterChip, isActive && styles.tabFilterChipActive]} onPress={() => setStatusFilter(tab)}>
                  <Text style={[styles.tabFilterChipText, isActive && styles.tabFilterChipTextActive]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Desktop Headers */}
      {isLargeScreen && (
        <View style={styles.masterTableHeader}>
          <Text style={[styles.tableHeaderCell, styles.cellAvatar]}>Avatar</Text>
          <Text style={[styles.tableHeaderCell, styles.cellInfoBlock]}>Student Roster Info</Text>
          <Text style={[styles.tableHeaderCell, styles.cellRate]}>Attendance Rate</Text>
          <Text style={[styles.tableHeaderCell, styles.cellStatus]}>Status</Text>
          <Text style={[styles.tableHeaderCell, styles.cellActionsHeader]}>Operational Control Actions</Text>
        </View>
      )}

      <FlatList data={filteredData} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={styles.listFeedScrollOffset} />

      {/* =========================================================
          MODAL ONE: VIEW ATTENDANCE SCORE STACK
          ========================================================= */}
      <Modal animationType="fade" transparent={true} visible={viewModalVisible} onRequestClose={() => setViewModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCardWrapper, { width: isLargeScreen ? 480 : '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Attendance Stack Report</Text>
              <TouchableOpacity onPress={() => setViewModalVisible(false)} style={styles.modalCloseBtn}><Icons.X size={18} color="#A0522D" /></TouchableOpacity>
            </View>
            
            {selectedStudent && (
              <ScrollView contentContainerStyle={styles.modalScrollBody}>
                <View style={styles.profileSummaryRow}>
                  <View style={styles.avatarCircleLarge}><Text style={styles.avatarLargeText}>{selectedStudent.name[0]}</Text></View>
                  <View>
                    <Text style={styles.modalProfileName}>{selectedStudent.name}</Text>
                    <Text style={styles.modalProfileSub}>Class {selectedStudent.class} • Roll Number {selectedStudent.rollNo}</Text>
                  </View>
                </View>

                <View style={styles.largeMetricsBox}>
                  <Text style={styles.largeMetricsLabel}>Cumulative Score Rate</Text>
                  <Text style={[styles.largeMetricsValue, {color: parseFloat(selectedStudent.netRate) < 75 ? '#E35336' : '#16a34a'}]}>{selectedStudent.netRate}</Text>
                </View>

                <View style={styles.statsSplitGrid}>
                  <View style={styles.statsSplitCard}><Text style={styles.splitCardLabel}>Total Roster Days</Text><Text style={styles.splitCardValue}>{selectedStudent.records.totalDays}</Text></View>
                  <View style={styles.statsSplitCard}><Text style={styles.splitCardLabel}>Days Present</Text><Text style={[styles.splitCardValue, {color: '#16a34a'}]}>{selectedStudent.records.present}</Text></View>
                  <View style={styles.statsSplitCard}><Text style={styles.splitCardLabel}>Days Absent</Text><Text style={[styles.splitCardValue, {color: '#E35336'}]}>{selectedStudent.records.absent}</Text></View>
                </View>
              </ScrollView>
            )}
            <TouchableOpacity style={[styles.modalDismissBtn, {backgroundColor: '#A0522D'}]} onPress={() => setViewModalVisible(false)}><Text style={styles.modalDismissBtnText}>Close Report Stack</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          MODAL TWO: WARNING & ACTION GENERATOR DISPATCHER
          ========================================================= */}
      <Modal animationType="fade" transparent={true} visible={warningModalVisible} onRequestClose={() => setWarningModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCardWrapper, { width: isLargeScreen ? 500 : '92%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>File Official Warning Flag</Text>
              <TouchableOpacity onPress={() => setWarningModalVisible(false)} style={styles.modalCloseBtn}><Icons.X size={18} color="#A0522D" /></TouchableOpacity>
            </View>

            {selectedStudent && (
              <View style={styles.modalScrollBody}>
                <Text style={styles.warningFormLabel}>Target Profile: <Text style={{fontWeight: '700', color: '#2e2520'}}>{selectedStudent.name} ({selectedStudent.class})</Text></Text>
                
                {/* Custom Selection Dropdown Module Box */}
                <Text style={styles.inputHeading}>Select Disciplinary Action Category:</Text>
                <TouchableOpacity style={styles.dropdownTriggerSelector} onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <Text style={styles.dropdownTriggerText}>{warningType}</Text>
                  <Icons.ChevronDown size={16} color="#A0522D" />
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View style={styles.dropdownExpandableBox}>
                    {['Suspend Student', 'Too Late Warning Check', 'Parent Meeting Notice'].map((option) => (
                      <TouchableOpacity key={option} style={styles.dropdownOptionRowItem} onPress={() => { setWarningType(option); setIsDropdownOpen(false); }}>
                        <Text style={styles.dropdownOptionRowItemText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Multiline Reason Input Area */}
                <Text style={styles.inputHeading}>Write Disciplinary Grounds/Reason Statement:</Text>
                <TextInput
                  style={styles.reasonMultilineInput}
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Type the official warning reason summary here for parent terminal transmission..."
                  placeholderTextColor="#bc9e82"
                  value={warningReason}
                  onChangeText={setWarningReason}
                />
              </View>
            )}

            <TouchableOpacity style={[styles.modalDismissBtn, {backgroundColor: '#E35336'}]} onPress={submitWarningForm}>
              <Text style={styles.modalDismissBtnText}>Dispatch Warning Notice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC', padding: 16 },
  headerTitleArea: { marginBottom: 16 },
  mainTitle: { fontSize: 22, fontWeight: '700', color: '#A0522D' },
  mainSubtitle: { fontSize: 14, color: '#8c7664', marginTop: 4, lineHeight: 20, fontWeight: '500' },

  /* --- WIDGET CARDS --- */
  statsGridRow: { gap: 12, marginBottom: 20 },
  statWidgetCard: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#eaddcc', gap: 12 },
  widgetIconBox: { width: 42, height: 42, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  widgetValue: { fontSize: 16, fontWeight: '700', color: '#2e2520' },
  widgetTitle: { fontSize: 12, color: '#8c7664', marginTop: 2 },

  /* --- TOOLBAR CONTROLS --- */
  controlsRow: { gap: 12, marginBottom: 16 },
  searchBarBox: { flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, height: 44 },
  searchIconSpacing: { marginRight: 8 },
  searchBarInputField: { flex: 1, fontSize: 14, color: '#2e2520' },
  tabsDividerContainer: { height: 44, justifyContent: 'center' },
  tabsScrollContent: { gap: 6, alignItems: 'center' },
  tabFilterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc' },
  tabFilterChipActive: { backgroundColor: '#F4A460', borderColor: '#F4A460' },
  tabFilterChipText: { fontSize: 13, fontWeight: '600', color: '#8c7664' },
  tabFilterChipTextActive: { color: '#ffffff', fontWeight: '700' },

  /* --- AVATAR CIRCLES --- */
  avatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eaddcc', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#A0522D', fontWeight: '700', fontSize: 14 },

  /* --- DESKTOP STRUCTURE DATA MATRIX --- */
  masterTableHeader: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 12, paddingHorizontal: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center' },
  tableHeaderCell: { fontSize: 13, fontWeight: '700', color: '#A0522D' },
  tableRow: { flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', alignItems: 'center' },
  tableCell: { fontSize: 14, color: '#334155' },
  cellAvatar: { flex: 0.4 },
  cellInfoBlock: { flex: 1.8 },
  cellRate: { flex: 0.8, fontWeight: '600', color: '#2e2520' },
  cellStatus: { flex: 0.8 },
  cellActionsHeader: { flex: 1.8, textAlign: 'center' },
  cellActions: { flex: 1.8, flexDirection: 'row', gap: 8, justifyContent: 'center' },
  itemName: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  itemSubText: { fontSize: 12, color: '#8c7664', marginTop: 1 },

  /* --- COMPONENT LAYOUT BUTTONS --- */
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  btnView: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc' },
  btnWarning: { backgroundColor: '#E35336' },
  btnTextStyleView: { fontSize: 12, fontWeight: '700', color: '#A0522D' },
  btnTextStyleWarning: { fontSize: 12, fontWeight: '700', color: '#ffffff' },

  /* --- ADAPTIVE MOBILE UI SYSTEM CARDS --- */
  listFeedScrollOffset: { paddingBottom: 32 },
  mobileCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#eaddcc' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  mobileProfileBlock: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  cardStudentName: { fontSize: 15, fontWeight: '600', color: '#2e2520' },
  cardStudentClass: { fontSize: 12, color: '#8c7664', marginTop: 1 },
  cardBodyRow: { backgroundColor: '#faf6f0', padding: 10, borderRadius: 6, marginBottom: 12, borderWidth: 1, borderColor: '#f5ebe0' },
  cardRateText: { fontSize: 13, color: '#8c7664', fontWeight: '500' },
  cardActionsRowMobile: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#f5ebe0', paddingTop: 12 },
  mobileActionBtn: { flex: 1, height: 38, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  mobileBtnView: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc' },
  mobileBtnWarning: { backgroundColor: '#E35336' },
  mobileBtnTextWarning: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  /* --- HIGH-FIDELITY OVERLAY MODALS --- */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(46, 37, 32, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCardWrapper: { backgroundColor: '#ffffff', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#eaddcc' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', backgroundColor: '#faf6f0' },
  modalHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#A0522D' },
  modalCloseBtn: { padding: 4, backgroundColor: '#ffffff', borderRadius: 6, borderWidth: 1, borderColor: '#eaddcc' },
  modalScrollBody: { padding: 16 },

  /* --- REPORT VIEW COMPONENT STYLES --- */
  profileSummaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, backgroundColor: '#faf6f0', padding: 12, borderRadius: 8 },
  avatarCircleLarge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#A0522D', alignItems: 'center', justifyContent: 'center' },
  avatarLargeText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  modalProfileName: { fontSize: 16, fontWeight: '700', color: '#2e2520' },
  modalProfileSub: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  largeMetricsBox: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  largeMetricsLabel: { fontSize: 12, fontWeight: '600', color: '#8c7664', textTransform: 'uppercase' },
  largeMetricsValue: { fontSize: 26, fontWeight: '800', marginTop: 4 },
  statsSplitGrid: { flexDirection: 'row', gap: 6 },
  statsSplitCard: { flex: 1, backgroundColor: '#faf6f0', padding: 10, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#f5ebe0' },
  splitCardLabel: { fontSize: 11, color: '#8c7664', fontWeight: '500' },
  splitCardValue: { fontSize: 16, fontWeight: '700', color: '#2e2520', marginTop: 4 },

  /* --- PENALTY DISPATCH FORM COMPONENT STYLES --- */
  warningFormLabel: { fontSize: 14, color: '#8c7664', marginBottom: 14, fontWeight: '500' },
  inputHeading: { fontSize: 12, fontWeight: '700', color: '#A0522D', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 10, marginBottom: 6 },
  dropdownTriggerSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', paddingHorizontal: 12, height: 42, borderRadius: 6, marginBottom: 8 },
  dropdownTriggerText: { fontSize: 14, color: '#2e2520', fontWeight: '600' },
  dropdownExpandableBox: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 6, paddingVertical: 4, marginBottom: 12 },
  dropdownOptionRowItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#faf6f0' },
  dropdownOptionRowItemText: { fontSize: 13, color: '#E35336', fontWeight: '600' },
  reasonMultilineInput: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 6, padding: 12, fontSize: 14, color: '#2e2520', minHeight: 80, textAlignVertical: 'top' },
  modalDismissBtn: { height: 46, alignItems: 'center', justifyContent: 'center' },
  modalDismissBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },

  /* --- STATUS STRIPS --- */
  statusIndicatorChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  chipGreen: { backgroundColor: '#e8f5e9' }, textGreen: { color: '#2e7d32', fontSize: 12, fontWeight: '700' },
  chipAmber: { backgroundColor: '#fef3c7' }, textAmber: { color: '#b45309', fontSize: 12, fontWeight: '700' },
  chipRed: { backgroundColor: '#ffebee' }, textRed: { color: '#c62828', fontSize: 12, fontWeight: '700' }
}); 