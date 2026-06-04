import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert,
  useWindowDimensions, 
  Platform 
} from 'react-native';
import * as Icons from 'lucide-react-native';

const globalIncidents = [
  { id: '1', student: 'Rohan Verma', class: '10-B', severity: 'Critical', issue: 'Repeated Bunking & Insubordination', date: 'Today', tracking: 'Parent Notified' },
  { id: '2', student: 'Aman Malhotra', class: '12-A', severity: 'High', issue: 'Chemistry Lab Property Damage', date: 'Yesterday', tracking: 'Fine Imposed' },
  { id: '3', student: 'Vikram Singh', class: '11-A', severity: 'Medium', issue: 'Out of Bounds Gate Violation', date: '25 May 2026', tracking: 'Suspended' },
  { id: '4', student: 'Sneha Reddy', class: '09-C', severity: 'Low', issue: 'Dress Code Infraction', date: '24 May 2026', tracking: 'Resolved' },
];

export default function SchoolDisciplineLedger() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  // Warning Form System States
  const [incidentsList, setIncidentsList] = useState(globalIncidents);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeverityFilter, setActiveSeverityFilter] = useState('All');
  
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [penaltyAction, setPenaltyAction] = useState('Select Action Type');
  const [warningMemo, setWarningMemo] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter Chain Computations
  const filteredIncidents = incidentsList.filter(item => {
    const matchesSearch = item.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.issue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = activeSeverityFilter === 'All' ? true : item.severity === activeSeverityFilter;
    return matchesSearch && matchesSeverity;
  });

  const openWarningInterface = (incident) => {
    setSelectedIncident(incident);
    setPenaltyAction('Select Action Type');
    setWarningMemo('');
    setIsDropdownOpen(false);
    setWarningModalVisible(true);
  };

  const dispatchWarningLogSubmission = () => {
    if (penaltyAction === 'Select Action Type' || !warningMemo.trim()) {
      Alert.alert("Execution Blocked", "Please choose an enforcement penalty tier category and provide background case context.");
      return;
    }

    setIncidentsList(prev => 
      prev.map(item => item.id === selectedIncident.id ? { ...item, tracking: 'Resolved' } : item)
    );

    Alert.alert(
      "Enforcement Dispatched",
      `Disciplinary flag [${penaltyAction}] has been filed. Case file status marked as Resolved.`,
      [{ text: "OK", onPress: () => setWarningModalVisible(false) }]
    );
  };

  const renderIncidentRowOrCard = ({ item }) => {
    let severityStyle = styles.bgRed; let txtStyle = styles.txRed;
    if (item.severity === 'High') { severityStyle = styles.bgOrange; txtStyle = styles.txOrange; }
    if (item.severity === 'Medium' || item.severity === 'Low') { severityStyle = styles.bgSlate; txtStyle = styles.txSlate; }

    const isActionTaken = item.tracking === 'Resolved' || item.tracking === 'Suspended' || item.tracking === 'Fine Imposed';

    if (isLargeScreen) {
      return (
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.cellAvatarContainer]}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.student[0]}</Text>
            </View>
          </View>
          
          <View style={[styles.tableCell, styles.cellNameBlock]}>
            <Text style={styles.itemNameText}>{item.student}</Text>
            <Text style={styles.itemClassText}>Class {item.class}</Text>
          </View>
          
          <Text style={[styles.tableCell, styles.cellIssueText]}>{item.issue}</Text>
          
          <View style={[styles.tableCell, styles.cellBadgeBox]}>
            <View style={[styles.miniBadge, severityStyle]}><Text style={[styles.miniBadgeText, txtStyle]}>{item.severity}</Text></View>
          </View>
          
          <Text style={[styles.tableCell, styles.cellDateText]}>{item.date}</Text>
          <Text style={[styles.tableCell, styles.cellTrackingText, isActionTaken && { color: '#16a34a' }]}>{item.tracking}</Text>
          
          <View style={styles.cellActionBoxWrapper}>
            {isActionTaken ? (
              <View style={styles.resolvedInlineBadge}>
                <Icons.CheckCircle2 size={14} color="#16a34a" />
                <Text style={styles.resolvedInlineBadgeText}>Resolved</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.desktopWarningBtn} onPress={() => openWarningInterface(item)}>
                <Icons.AlertTriangle size={12} color="#ffffff" />
                <Text style={styles.desktopWarningBtnText}>Warn</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mobileCard}>
        <View style={styles.cardHeader}>
          <View style={styles.mobileProfileBlock}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.student[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardName} numberOfLines={1}>{item.student}</Text>
              <Text style={styles.cardClass}>Class {item.class} • Logged: {item.date}</Text>
            </View>
          </View>
          <View style={[styles.miniBadge, severityStyle]}><Text style={[styles.miniBadgeText, txtStyle]}>{item.severity}</Text></View>
        </View>
        
        <View style={styles.mobileIssueDetailsCard}>
          <Text style={styles.issueText}>Violation Narrative:</Text>
          <Text style={styles.issueTextContent}>"{item.issue}"</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.trackingStatusText}>Status: <Text style={{color: isActionTaken ? '#16a34a' : '#A0522D', fontWeight: '700'}}>{item.tracking}</Text></Text>
          
          {isActionTaken ? (
            <View style={styles.resolvedMobileBadge}>
              <Icons.CheckCircle2 size={13} color="#16a34a" />
              <Text style={styles.resolvedMobileBadgeText}>Resolved</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.mobileActionWarningBtn} onPress={() => openWarningInterface(item)}>
              <Icons.AlertTriangle size={13} color="#ffffff" />
              <Text style={styles.mobileActionWarningBtnText}>Warn</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Content rendering wrapper blocks definition
  const DashboardRosterViews = () => (
    <View style={{ flex: 1 }}>
      {/* Analytics Matrix Cards Block */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { borderColor: '#fca5a5' }]}>
          <View style={[styles.iconFrameBox, { backgroundColor: '#ffebee' }]}><Icons.AlertOctagon color="#E35336" size={18} /></View>
          <View style={styles.statTextWrap}><Text style={[styles.statValue, {color: '#E35336'}]}>1 Critical</Text><Text style={styles.statLabel}>Action Item</Text></View>
        </View>
        <View style={[styles.statBox, { borderColor: '#fed7aa' }]}>
          <View style={[styles.iconFrameBox, { backgroundColor: '#fff2e6' }]}><Icons.ShieldAlert color="#F4A460" size={18} /></View>
          <View style={styles.statTextWrap}><Text style={[styles.statValue, {color: '#A0522D'}]}>3 Active</Text><Text style={styles.statLabel}>Suspensions</Text></View>
        </View>
        <View style={[styles.statBox, { borderColor: '#eaddcc' }]}>
          <View style={[styles.iconFrameBox, { backgroundColor: '#e8f5e9' }]}><Icons.CheckCircle2 color="#16a34a" size={18} /></View>
          <View style={styles.statTextWrap}><Text style={[styles.statValue, {color: '#16a34a'}]}>14 Cases</Text><Text style={styles.statLabel}>Resolved Logs</Text></View>
        </View>
      </View>

      {/* Modern Theme Tool Search Box Component */}
      <View style={styles.searchBarBox}>
        <Icons.Search color="#8c7664" size={18} style={styles.searchIconSpacing} />
        <TextInput
          style={styles.searchBarInputField}
          placeholder="Search by student name, violation issue details..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#bc9e82"
        />
      </View>

      {/* Earthy Segmented Segment Filter Tabs */}
      <View style={styles.tabsDividerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
          {['All', 'Critical', 'High', 'Medium', 'Low'].map((tab) => {
            const isActive = activeSeverityFilter === tab;
            return (
              <TouchableOpacity key={tab} style={[styles.tabFilterChip, isActive && styles.tabFilterChipActive]} onPress={() => setActiveSeverityFilter(tab)}>
                <Text style={[styles.tabFilterChipText, isActive && styles.tabFilterChipTextActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLargeScreen && (
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.cellAvatarContainer]}>Avatar</Text>
          <Text style={[styles.tableHeaderCell, styles.cellNameBlock]}>Student Roster</Text>
          <Text style={[styles.tableHeaderCell, styles.cellIssueText]}>Infraction Case File</Text>
          <Text style={[styles.tableHeaderCell, styles.cellBadgeBox]}>Risk Tier</Text>
          <Text style={[styles.tableHeaderCell, styles.cellDateText]}>Logged</Text>
          <Text style={[styles.tableHeaderCell, styles.cellTrackingText]}>Current Tracking Status</Text>
          <Text style={[styles.tableHeaderCell, styles.cellActionHeader]}>Action State</Text>
        </View>
      )}

      {/* Main Stream FlatList Feed System Core */}
      <FlatList 
        data={filteredIncidents} 
        keyExtractor={item => item.id} 
        renderItem={renderIncidentRowOrCard} 
        scrollEnabled={isLargeScreen} // Master native wrapper handles phone scrolls
        contentContainerStyle={styles.listContainerStylesOffset} 
        ListEmptyComponent={
          <View style={styles.emptyContainerStateFallback}><Text style={styles.emptyFallbackText}>No incident parameters match current selection matrix criteria.</Text></View>
        }
      />
    </View>
  );

  return (
    <View style={styles.appMasterBodyFrame}>
      {isLargeScreen ? (
        <View style={styles.container}>
          <View style={styles.titleArea}>
            <Text style={styles.mainTitle}>Global Disciplinary Ledger</Text>
            <Text style={styles.mainSubtitle}>School-wide executive portal for compliance mapping, active suspensions, and behavioral trends tracking.</Text>
          </View>
          <DashboardRosterViews />
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.titleArea}>
            <Text style={styles.mainTitle}>Global Disciplinary Ledger</Text>
            <Text style={styles.mainSubtitle}>School-wide executive portal for behavioral trends tracking.</Text>
          </View>
          <DashboardRosterViews />
        </ScrollView>
      )}

      {/* =========================================================
          DYNAMIC ENFORCEMENT DROPDOWN MEMO MODAL
          ========================================================= */}
      <Modal animationType="fade" transparent={true} visible={warningModalVisible} onRequestClose={() => setWarningModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalWrapper, { width: isLargeScreen ? 480 : '90%' }]}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>File Institutional Infraction Penalty</Text>
              <TouchableOpacity onPress={() => setWarningModalVisible(false)} style={styles.modalCloseBtn}>
                <Icons.X size={18} color="#A0522D" />
              </TouchableOpacity>
            </View>

            {selectedIncident && (
              <View style={styles.modalScrollBody}>
                <Text style={styles.targetStudentLabel}>Target Student Entity: <Text style={{fontWeight: '700', color: '#2e2520'}}>{selectedIncident.student} ({selectedIncident.class})</Text></Text>
                
                <Text style={styles.inputFieldHeading}>Select Warning Enforcement Tier:</Text>
                <TouchableOpacity style={styles.dropdownSelectorTrigger} onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <Text style={styles.dropdownSelectorTriggerText}>{penaltyAction}</Text>
                  <Icons.ChevronDown size={16} color="#A0522D" />
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View style={styles.dropdownExpandableBoxContainer}>
                    {['Severe Late-In Demerit', 'Parent Tele-Meeting Notification', 'In-School Suspension Audit'].map((opt) => (
                      <TouchableOpacity key={opt} style={styles.dropdownOptionRowItem} onPress={() => { setPenaltyAction(opt); setIsDropdownOpen(false); }}>
                        <Text style={styles.dropdownOptionRowItemText}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={styles.inputFieldHeading}>Grounds Summary Memo Details:</Text>
                <TextInput
                  style={styles.multilineMemoInputField}
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Provide structured evaluation summary text here..."
                  placeholderTextColor="#bc9e82"
                  value={warningMemo}
                  onChangeText={setWarningMemo}
                />
              </View>
            )}

            <TouchableOpacity style={styles.dismissSubmitBtn} onPress={dispatchWarningLogSubmission}>
              <Text style={styles.dismissSubmitBtnText}>Dispatch Official Warning</Text>
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
  titleArea: { marginBottom: 20 },
  mainTitle: { fontSize: 22, fontWeight: '700', color: '#A0522D' },
  mainSubtitle: { fontSize: 14, color: '#8c7664', marginTop: 4, lineHeight: 20, fontWeight: '500' },
  
  /* --- STATS GRID MANAGEMENT WITH FLEX WRAPPING --- */
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statBox: { flex: 1, minWidth: '47%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, padding: 10 },
  iconFrameBox: { width: 34, height: 34, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  statTextWrap: { flex: 1 },
  statValue: { fontSize: 14, fontWeight: '700' },
  statLabel: { fontSize: 11, color: '#8c7664', marginTop: 1, fontWeight: '500' },
  
  /* --- SEARCH INTERFACE MATRIX --- */
  searchBarBox: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 16 },
  searchIconSpacing: { marginRight: 8 },
  searchBarInputField: { flex: 1, fontSize: 14, color: '#2e2520' },
  
  /* --- TABS SYSTEM MATRICES --- */
  tabsDividerContainer: { height: 44, justifyContent: 'center', marginBottom: 16 },
  tabsScrollContent: { gap: 6, alignItems: 'center' },
  tabFilterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc' },
  tabFilterChipActive: { backgroundColor: '#F4A460', borderColor: '#F4A460' },
  tabFilterChipText: { fontSize: 13, fontWeight: '600', color: '#8c7664' },
  tabFilterChipTextActive: { color: '#ffffff', fontWeight: '700' },

  avatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eaddcc', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#A0522D', fontWeight: '700', fontSize: 14 },

  /* --- DATA GRID DIMENSIONS MATRIX --- */
  tableHeader: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 12, paddingHorizontal: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center' },
  tableHeaderCell: { fontSize: 13, fontWeight: '700', color: '#A0522D' },
  tableRow: { flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', alignItems: 'center' },
  tableCell: { fontSize: 14, color: '#334155' },
  cellAvatarContainer: { flex: 0.4 },
  cellNameBlock: { flex: 1.2, paddingRight: 4 },
  cellIssueText: { flex: 2, fontWeight: '500', color: '#2e2520', paddingRight: 4 },
  cellBadgeBox: { flex: 0.8 },
  cellDateText: { flex: 0.8 },
  cellTrackingText: { flex: 1.2, fontWeight: '600', color: '#F4A460' },
  cellActionHeader: { flex: 0.7, textAlign: 'center' },
  cellActionBoxWrapper: { flex: 0.7, alignItems: 'center', justifyContent: 'center' },
  itemNameText: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  itemClassText: { fontSize: 12, color: '#8c7664', marginTop: 1 },
  
  desktopWarningBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6, borderRadius: 6, backgroundColor: '#E35336' },
  desktopWarningBtnText: { fontSize: 12, fontWeight: '700', color: '#ffffff' },
  resolvedInlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e8f5e9', borderRadius: 4 },
  resolvedInlineBadgeText: { fontSize: 12, fontWeight: '700', color: '#12632b' },

  /* --- MOBILE ADAPTIVE STRUCTURE CONFIGURATIONS --- */
  listContainerStylesOffset: { paddingBottom: 24 },
  mobileCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#eaddcc' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mobileProfileBlock: { flexDirection: 'row', gap: 10, alignItems: 'center', flex: 1, paddingRight: 8 },
  cardName: { fontSize: 15, fontWeight: '600', color: '#2e2520' },
  cardClass: { fontSize: 12, color: '#8c7664', marginTop: 1 },
  mobileIssueDetailsCard: { backgroundColor: '#faf6f0', padding: 10, borderRadius: 6, marginVertical: 6, borderWidth: 1, borderColor: '#f5ebe0' },
  issueText: { fontSize: 11, fontWeight: '700', color: '#bc9e82', textTransform: 'uppercase' },
  issueTextContent: { fontSize: 13, color: '#475569', fontStyle: 'italic', marginTop: 2, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f5ebe0' },
  trackingStatusText: { fontSize: 13, color: '#8c7664', fontWeight: '500' },
  mobileActionWarningBtn: { backgroundColor: '#E35336', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  mobileActionWarningBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  resolvedMobileBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#e8f5e9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  resolvedMobileBadgeText: { fontSize: 12, fontWeight: '700', color: '#15803d' },

  miniBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  miniBadgeText: { fontSize: 11, fontWeight: '700' },
  bgRed: { backgroundColor: '#ffebee' }, bgOrange: { backgroundColor: '#fff2e6' }, bgSlate: { backgroundColor: '#f1f5f9' },
  txRed: { color: '#E35336' }, txOrange: { color: '#F4A460' }, txSlate: { color: '#64748b' },

  /* --- MODAL DIALOG DESIGNS --- */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(46, 37, 32, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalWrapper: { backgroundColor: '#ffffff', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#eaddcc' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', backgroundColor: '#faf6f0' },
  modalHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#A0522D' },
  modalCloseBtn: { padding: 4, backgroundColor: '#ffffff', borderRadius: 6, borderWidth: 1, borderColor: '#eaddcc' },
  modalScrollBody: { padding: 16 },
  targetStudentLabel: { fontSize: 14, color: '#8c7664', marginBottom: 14, fontWeight: '500' },
  inputFieldHeading: { fontSize: 11, fontWeight: '700', color: '#A0522D', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  dropdownSelectorTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', paddingHorizontal: 12, height: 42, borderRadius: 6, marginBottom: 8 },
  dropdownSelectorTriggerText: { fontSize: 14, color: '#2e2520', fontWeight: '600' },
  dropdownExpandableBoxContainer: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 6, paddingVertical: 4, marginBottom: 12 },
  dropdownOptionRowItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#faf6f0' },
  dropdownOptionRowItemText: { fontSize: 13, color: '#E35336', fontWeight: '600' },
  multilineMemoInputField: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 6, padding: 12, fontSize: 14, color: '#2e2520', minHeight: 80, textAlignVertical: 'top' },
  dismissSubmitBtn: { height: 46, backgroundColor: '#E35336', alignItems: 'center', justifyContent: 'center' },
  dismissSubmitBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  
  emptyContainerStateFallback: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyFallbackText: { fontSize: 13, color: '#8c7664', textAlign: 'center', fontWeight: '500' }
});