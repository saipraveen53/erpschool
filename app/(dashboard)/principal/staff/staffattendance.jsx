import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  useWindowDimensions, 
  Platform,
  Alert
} from 'react-native';
import * as Icons from 'lucide-react-native';

const mockAttendanceList = [
  { id: '1', name: 'Mrs. Anjali Sharma', role: 'TGT Mathematics', department: 'Academics', clockIn: '08:12 AM', clockOut: '03:45 PM', status: 'Present', netRate: '96.4%', shiftHours: '7.5 Hrs' },
  { id: '2', name: 'Mr. Rajesh Kumar', role: 'Admin Coordinator', department: 'Administration', clockIn: '--:--', clockOut: '--:--', status: 'On Leave', netRate: '92.1%', shiftHours: '0 Hrs' },
  { id: '3', name: 'Dr. Vikram Malhotra', role: 'PGT Physics HOD', department: 'Academics', clockIn: '08:02 AM', clockOut: '04:00 PM', status: 'Present', netRate: '98.0%', shiftHours: '8.0 Hrs' },
  { id: '4', name: 'Miss Sanya Kapoor', role: 'Primary Class Teacher', department: 'Academics', clockIn: '08:48 AM', clockOut: '03:30 PM', status: 'Late', netRate: '89.5%', shiftHours: '6.7 Hrs' },
  { id: '5', name: 'Mr. Amit Khurana', role: 'Accounts Supervisor', department: 'Finance', clockIn: '--:--', clockOut: '--:--', status: 'Absent', netRate: '94.0%', shiftHours: '0 Hrs' },
];

export default function StaffAttendance() {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // State handles toggles for dropdown selection menus
  const [activeWarningDropdownId, setActiveWarningDropdownId] = useState(null);
  const [expandedMetricsId, setExpandedMetricsId] = useState(null);

  const isLargeScreen = width >= 768;

  const filteredAttendance = mockAttendanceList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleWarningMenu = (id) => {
    setActiveWarningDropdownId(activeWarningDropdownId === id ? null : id);
    setExpandedMetricsId(null);
  };

  const toggleMetricsView = (id) => {
    setExpandedMetricsId(expandedMetricsId === id ? null : id);
    setActiveWarningDropdownId(null);
  };

  const executeWarningDispatch = (name, type) => {
    Alert.alert("Warning Dispatched", `Official ERP alert flag [${type}] sent to ${name}.`);
    setActiveWarningDropdownId(null);
  };

  const renderAttendanceRowOrCard = ({ item }) => {
    let statusStyle = styles.chipGreen; let textStyle = styles.textGreen;
    if (item.status === 'Late') { statusStyle = styles.chipAmber; textStyle = styles.textAmber; }
    if (item.status === 'On Leave') { statusStyle = styles.chipPurple; textStyle = styles.textPurple; }
    if (item.status === 'Absent') { statusStyle = styles.chipRed; textStyle = styles.textRed; }

    const isWarningOpen = activeWarningDropdownId === item.id;
    const isMetricsOpen = expandedMetricsId === item.id;

    if (isLargeScreen) {
      return (
        <View style={styles.rowWrapperBlock}>
          <View style={styles.tableRow}>
            {/* Image Avatar Feature */}
            <View style={[styles.tableCell, styles.cellAvatarContainer]}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitialText}>{item.name.split(' ')[1]?.[0] || 'T'}</Text>
              </View>
            </View>

            <View style={[styles.tableCell, styles.cellNameBlock]}>
              <Text style={styles.itemStaffName}>{item.name}</Text>
              <Text style={styles.itemRoleText}>{item.role}</Text>
            </View>
            <Text style={[styles.tableCell, styles.cellDept]}>{item.department}</Text>
            <Text style={[styles.tableCell, styles.cellTime]}>{item.clockIn}</Text>
            <Text style={[styles.tableCell, styles.cellTime]}>{item.clockOut}</Text>
            
            <View style={[styles.tableCell, styles.cellStatusMaster]}>
              <View style={[styles.statusIndicatorChip, statusStyle]}>
                <Text style={textStyle}>{item.status}</Text>
              </View>
            </View>
            
            {/* Interactive Actions Grid */}
            <View style={[styles.tableCell, styles.cellActionsBlock]}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnView]} onPress={() => toggleMetricsView(item.id)}>
                <Icons.Eye size={14} color="#2563eb" />
                <Text style={styles.btnTextStyleView}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnWarning]} onPress={() => toggleWarningMenu(item.id)}>
                <Icons.AlertTriangle size={14} color="#dc2626" />
                <Text style={styles.btnTextStyleWarning}>Warning</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Expanded Dynamic Dropdown Menus */}
          {isWarningOpen && (
            <View style={styles.dropdownActionMenu}>
              <Text style={styles.dropdownTitle}>Issue Official Discrepancy Flag:</Text>
              <View style={styles.dropdownOptionsRow}>
                {['Late Entry Flag', 'Unexcused Absence', 'Half-Day Deduction'].map((opt) => (
                  <TouchableOpacity key={opt} style={styles.dropdownOptionBtn} onPress={() => executeWarningDispatch(item.name, opt)}>
                    <Text style={styles.dropdownOptionBtnText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {isMetricsOpen && (
            <View style={styles.dropdownMetricsMenu}>
              <Icons.TrendingUp size={16} color="#16a34a" />
              <Text style={styles.metricsDescriptionText}>
                Net Attendance Rate: <Text style={styles.metricsHighlightText}>{item.netRate}</Text> • Estimated Duty Duration Today: <Text style={styles.metricsHighlightText}>{item.shiftHours}</Text>
              </Text>
            </View>
          )}
        </View>
      );
    }

    // Adaptive Mobile Viewport System Cards
    return (
      <View style={styles.mobileCardWrapper}>
        <View style={styles.mobileCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.mobileProfileRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitialText}>{item.name.split(' ')[1]?.[0] || 'T'}</Text>
              </View>
              <View>
                <Text style={styles.cardStaffName}>{item.name}</Text>
                <Text style={styles.cardStaffRole}>{item.role} • {item.department}</Text>
              </View>
            </View>
            <View style={[styles.statusIndicatorChip, statusStyle]}>
              <Text style={textStyle}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.cardTimingGrid}>
            <View style={styles.timingColumn}><Text style={styles.timingLabel}>In</Text><Text style={styles.timingValue}>{item.clockIn}</Text></View>
            <View style={styles.timingColumn}><Text style={styles.timingLabel}>Out</Text><Text style={styles.timingValue}>{item.clockOut}</Text></View>
          </View>

          <View style={styles.cardActionsRowMobile}>
            <TouchableOpacity style={[styles.mobileActionBtn, styles.btnViewMobile]} onPress={() => toggleMetricsView(item.id)}>
              <Icons.Eye size={14} color="#2563eb" />
              <Text style={styles.btnTextStyleView}>View Metrics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mobileActionBtn, styles.btnWarningMobile]} onPress={() => toggleWarningMenu(item.id)}>
              <Icons.AlertTriangle size={14} color="#ffffff" />
              <Text style={styles.mobileBtnTextWarning}>Issue Warning</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isWarningOpen && (
          <View style={styles.dropdownActionMenuMobile}>
            {['Late Entry Flag', 'Unexcused Absence', 'Half-Day Deduction'].map((opt) => (
              <TouchableOpacity key={opt} style={styles.dropdownOptionBtnMobile} onPress={() => executeWarningDispatch(item.name, opt)}>
                <Text style={styles.dropdownOptionBtnTextMobile}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isMetricsOpen && (
          <View style={styles.dropdownMetricsMenuMobile}>
            <Text style={styles.metricsDescriptionText}>Net Roll Presence Rate: <Text style={styles.metricsHighlightText}>{item.netRate}</Text></Text>
            <Text style={styles.metricsDescriptionText}>Total Working Hours: <Text style={styles.metricsHighlightText}>{item.shiftHours}</Text></Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTitleArea}>
        <Text style={styles.mainTitle}>Staff Attendance Dashboard</Text>
        <Text style={styles.mainSubtitle}>Track active faculty parameters, handle duty exemptions, and dispatch shift warning flags.</Text>
      </View>

      {/* Tracker Widgets */}
      <View style={[styles.statsGridRow, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
        <View style={[styles.statWidgetCard, {borderColor: '#bbf7d0'}]}>
          <View style={[styles.widgetIconBox, { backgroundColor: '#e8f5e9' }]}><Icons.UserCheck color="#2e7d32" size={20} /></View>
          <View><Text style={[styles.widgetValue, {color: '#2e7d32'}]}>46 Faculty</Text><Text style={styles.widgetTitle}>Active & Present</Text></View>
        </View>
        <View style={[styles.statWidgetCard, {borderColor: '#fef08a'}]}>
          <View style={[styles.widgetIconBox, { backgroundColor: '#fefde8' }]}><Icons.AlertTriangle color="#a16207" size={20} /></View>
          <View><Text style={[styles.widgetValue, {color: '#a16207'}]}>4 Members</Text><Text style={styles.widgetTitle}>Late Logs Flagged</Text></View>
        </View>
        <View style={[styles.statWidgetCard, {borderColor: '#fca5a5'}]}>
          <View style={[styles.widgetIconBox, { backgroundColor: '#fee2e2' }]}><Icons.UserX color="#c62828" size={20} /></View>
          <View><Text style={[styles.widgetValue, {color: '#c62828'}]}>1 Absent</Text><Text style={styles.widgetTitle}>Unexcused Record</Text></View>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={[styles.controlsRow, { flexDirection: isLargeScreen ? 'row' : 'column', alignItems: isLargeScreen ? 'center' : 'stretch' }]}>
        <View style={styles.searchBarBox}>
          <Icons.Search color="#64748b" size={18} style={styles.searchIconSpacing} />
          <TextInput
            style={styles.searchBarInputField}
            placeholder="Search log records by staff keyword name or department..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.tabsDividerContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
            {['All', 'Present', 'Late', 'On Leave', 'Absent'].map((tab) => {
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
          <Text style={[styles.tableHeaderCell, styles.cellAvatarContainer]}>Avatar</Text>
          <Text style={[styles.tableHeaderCell, styles.cellNameBlock]}>Faculty Member</Text>
          <Text style={[styles.tableHeaderCell, styles.cellDept]}>Department</Text>
          <Text style={[styles.tableHeaderCell, styles.cellTime]}>Clock In</Text>
          <Text style={[styles.tableHeaderCell, styles.cellTime]}>Clock Out</Text>
          <Text style={[styles.tableHeaderCell, styles.cellStatusMaster]}>Status</Text>
          <Text style={[styles.tableHeaderCell, styles.cellActionsHeader]}>Roster Actions</Text>
        </View>
      )}

      <FlatList
        data={filteredAttendance}
        keyExtractor={(item) => item.id}
        renderItem={renderAttendanceRowOrCard}
        contentContainerStyle={styles.listFeedScrollOffset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC', padding: 16 }, // Base Beige
  headerTitleArea: { marginBottom: 16 },
  mainTitle: { fontSize: 22, fontWeight: '700', color: '#A0522D' }, // Sienna
  mainSubtitle: { fontSize: 14, color: '#8c7664', marginTop: 4, lineHeight: 20 },

  /* --- METRICS WIDGETS --- */
  statsGridRow: { gap: 12, marginBottom: 20 },
  statWidgetCard: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#eaddcc', gap: 12 },
  widgetIconBox: { width: 42, height: 42, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  widgetValue: { fontSize: 16, fontWeight: '700', color: '#2e2520' },
  widgetTitle: { fontSize: 12, color: '#8c7664', marginTop: 2 },

  /* --- CONTROL SHUFFLERS --- */
  controlsRow: { gap: 12, marginBottom: 16 },
  searchBarBox: { flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, height: 44 },
  searchIconSpacing: { marginRight: 8 },
  searchBarInputField: { flex: 1, fontSize: 14, color: '#2e2520' },
  tabsDividerContainer: { height: 44, justifyContent: 'center' },
  tabsScrollContent: { gap: 6, alignItems: 'center' },
  tabFilterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc' },
  tabFilterChipActive: { backgroundColor: '#A0522D', borderColor: '#A0522D' },
  tabFilterChipText: { fontSize: 13, fontWeight: '500', color: '#8c7664' },
  tabFilterChipTextActive: { color: '#ffffff', fontWeight: '700' },

  /* --- MASTER IMAGE AVATARS --- */
  avatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f5ebe0', borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center', justifyContent: 'center' },
  avatarInitialText: { color: '#A0522D', fontWeight: '700', fontSize: 14 },

  /* --- DESKTOP STRUCTURE DATA MATRIX --- */
  rowWrapperBlock: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f5ebe0' },
  tableMasterHeader: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 12, paddingHorizontal: 16 },
  masterTableHeader: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 12, paddingHorizontal: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center' },
  tableHeaderCell: { fontSize: 13, fontWeight: '700', color: '#A0522D' },
  tableRow: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center' },
  tableCell: { fontSize: 14, color: '#2e2520' },
  cellAvatarContainer: { flex: 0.4 },
  cellNameBlock: { flex: 1.8 },
  cellDept: { flex: 1 },
  cellTime: { flex: 0.8 },
  cellStatusMaster: { flex: 0.9 },
  cellActionsHeader: { flex: 1.6, textAlign: 'center' },
  cellActionsBlock: { flex: 1.6, flexDirection: 'row', gap: 8, justifyContent: 'center' },
  itemStaffName: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  itemRoleText: { fontSize: 12, color: '#8c7664', marginTop: 1 },

  /* --- DROPDOWN CONTROL MATRICES --- */
  dropdownActionMenu: { backgroundColor: '#faf6f0', borderTopWidth: 1, borderTopColor: '#f5ebe0', padding: 12, paddingLeft: 60 },
  dropdownTitle: { fontSize: 12, fontWeight: '700', color: '#A0522D', textTransform: 'uppercase', marginBottom: 8 },
  dropdownOptionBtn: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  dropdownOptionBtnText: { fontSize: 12, color: '#E35336', fontWeight: '600' },
  dropdownMetricsMenu: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fdf6f2', padding: 12, paddingLeft: 60 },
  metricsDescriptionText: { fontSize: 13, color: '#2e2520' },
  metricsHighlightText: { fontWeight: '700', color: '#A0522D' },

  /* --- ACTION HOOK BUTTONS --- */
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  btnView: { backgroundColor: '#f5ebe0' },
  btnWarning: { backgroundColor: '#ffebee' },
  btnTextStyleView: { fontSize: 12, fontWeight: '600', color: '#A0522D' },
  btnTextStyleWarning: { fontSize: 12, fontWeight: '600', color: '#E35336' },

  /* --- ADAPTIVE MOBILE COMPONENT CARDS --- */
  listFeedScrollOffset: { paddingBottom: 32 },
  mobileCardWrapper: { backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eaddcc', overflow: 'hidden' },
  mobileCard: { padding: 16 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  mobileProfileRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  cardStaffName: { fontSize: 15, fontWeight: '600', color: '#2e2520' },
  cardStaffRole: { fontSize: 12, color: '#8c7664', marginTop: 1 },
  cardTimingGrid: { flexDirection: 'row', gap: 16, backgroundColor: '#faf6f0', padding: 10, borderRadius: 8, marginBottom: 12 },
  timingColumn: { flex: 1 },
  timingLabel: { fontSize: 11, color: '#8c7664', textTransform: 'uppercase' },
  timingValue: { fontSize: 13, fontWeight: '600', color: '#2e2520', marginTop: 2 },
  cardActionsRowMobile: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#f5ebe0', paddingTop: 12 },
  mobileActionBtn: { flex: 1, height: 36, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnViewMobile: { backgroundColor: '#f5ebe0', borderWidth: 1, borderColor: '#eaddcc' },
  btnWarningMobile: { backgroundColor: '#E35336' },
  mobileBtnTextWarning: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  cardFooterRemarksRow: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12, backgroundColor: '#faf6f0' },
  cardRemarksText: { fontSize: 12, color: '#8c7664' },
  boldRemarksVal: { fontWeight: '600', color: '#2e2520' },

  /* --- DYNAMIC STATUS CHIPS --- */
  statusIndicatorChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  chipGreen: { backgroundColor: '#e8f5e9' }, textGreen: { color: '#2e7d32', fontSize: 12, fontWeight: '600' },
  chipAmber: { backgroundColor: '#fef3c7' }, textAmber: { color: '#b45309', fontSize: 12, fontWeight: '600' },
  chipPurple: { backgroundColor: '#f3e8ff' }, textPurple: { color: '#7e22ce', fontSize: 12, fontWeight: '600' },
  chipRed: { backgroundColor: '#ffebee' }, textRed: { color: '#c62828', fontSize: 12, fontWeight: '600' }
});