import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';

// Type declarations for data management architectures
export interface CommunicationLog {
  id: string;
  timestamp: string;
  channel: 'SMS' | 'Email' | 'PA System' | 'App Push';
  targetGroup: string;
  sender: string;
  subject: string;
  status: 'Dispatched' | 'Pending' | 'Failed';
  body: string;
}

export interface StaffContact {
  id: string;
  name: string;
  role: string;
  department: string;
  extension: string;
  status: 'Available' | 'In Class' | 'On Leave' | 'Busy';
}

const MOCK_LOGS: CommunicationLog[] = [
  {
    id: 'COM-2026-901',
    timestamp: '2026-05-29 11:30 AM',
    channel: 'App Push',
    targetGroup: 'Grade 10 Parents',
    sender: 'Front Desk Admin',
    subject: 'Delayed Bus Route 4 update Notification',
    body: 'Notice issued to parents regarding Route 4 delays caused by localized arterial traffic disruptions near the terminal roundabout.',
    status: 'Dispatched',
  },
  {
    id: 'COM-2026-902',
    timestamp: '2026-05-29 09:15 AM',
    channel: 'Email',
    targetGroup: 'All Faculty & Staff',
    sender: 'Reception Desk',
    subject: 'Emergency Maintenance Shutdown Notice',
    body: 'Water supply lines in the primary block annex will undergo technical repairs starting at 03:00 PM today.',
    status: 'Dispatched',
  },
  {
    id: 'COM-2026-903',
    timestamp: '2026-05-28 04:45 PM',
    channel: 'SMS',
    targetGroup: 'Transport Operators Group',
    sender: 'Administrative Lead',
    subject: 'Mandatory Route Audit Submissions',
    body: 'Drivers must submit structural logbooks and daily compliance checklists before operating morning routes next week.',
    status: 'Failed',
  }
];

const MOCK_STAFF: StaffContact[] = [
  { id: 'STF-401', name: 'Dr. Aranya Sen', role: 'Vice Principal', department: 'Administration', extension: 'XT-102', status: 'Available' },
  { id: 'STF-102', name: 'Ms. Priya Sharma', role: 'Senior Admissions Counselor', department: 'Admissions Office', extension: 'XT-115', status: 'Busy' },
  { id: 'STF-289', name: 'Mr. Rajesh Nair', role: 'Head of Logistics & Transit', department: 'Transport Wing', extension: 'XT-304', status: 'In Class' },
  { id: 'STF-504', name: 'Mrs. Caroline Vance', role: 'Grievance Resolution Officer', department: 'Student Welfare', extension: 'XT-108', status: 'Available' },
];

export default function CommunicationManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [isMounted, setIsMounted] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'Broadcast' | 'Directory'>('Broadcast');
  const [logs, setLogs] = useState<CommunicationLog[]>(MOCK_LOGS);
  const [staffQuery, setStaffQuery] = useState('');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  
  const [selectedLog, setSelectedLog] = useState<CommunicationLog | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  const [form, setForm] = useState({
    channel: 'SMS' as CommunicationLog['channel'],
    targetGroup: '',
    subject: '',
    body: '',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const communicationMetrics = useMemo(() => {
    return logs.reduce(
      (acc, curr) => {
        acc.total++;
        if (curr.status === 'Dispatched') acc.sent++;
        if (curr.status === 'Failed') acc.failed++;
        return acc;
      },
      { total: 0, sent: 0, failed: 0 }
    );
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const q = logSearchQuery.toLowerCase();
      return (
        log.subject.toLowerCase().includes(q) ||
        log.targetGroup.toLowerCase().includes(q) ||
        log.channel.toLowerCase().includes(q)
      );
    });
  }, [logs, logSearchQuery]);

  const filteredStaff = useMemo(() => {
    return MOCK_STAFF.filter(person => {
      const q = staffQuery.toLowerCase();
      return (
        person.name.toLowerCase().includes(q) ||
        person.role.toLowerCase().includes(q) ||
        person.department.toLowerCase().includes(q)
      );
    });
  }, [staffQuery]);

  const handleDispatchMessage = () => {
    if (!form.targetGroup.trim() || !form.subject.trim() || !form.body.trim()) {
      alert('Validation Error: Fill out target recipients, summary line, and context log information.');
      return;
    }

    const newLogItem: CommunicationLog = {
      id: `COM-2026-${logs.length + 904}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      channel: form.channel,
      targetGroup: form.targetGroup.trim(),
      sender: 'Front Desk Operator (You)',
      subject: form.subject.trim(),
      body: form.body.trim(),
      status: 'Dispatched',
    };

    setLogs([newLogItem, ...logs]);
    setForm({ channel: 'SMS', targetGroup: '', subject: '', body: '' });
    setIsDispatchModalOpen(false);
  };

  if (!isMounted) {
    return (
      <SafeAreaView style={[styles.loadingFallback, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.loadingFallbackText}>Loading Communication Control Room...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.appViewContainer}>
      {/* Header */}
      <View style={styles.appHeaderNavbar}>
        <View>
          <Text style={styles.navbarDisplayTitle}>Communication Control Room</Text>
          <Text style={styles.navbarDisplaySubtitle}>Broadcast emergency dispatches, cross-notify parent cohorts, and connect internal phone nodes.</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.headerPrimaryAction} 
          onPress={() => setIsDispatchModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.headerPrimaryActionText}>📣 Dispatch Broadcast</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics */}
      <View style={styles.summaryDashboardRow}>
        <View style={[styles.dashboardCard, { borderLeftColor: '#0EA5E9' }]}>
          <Text style={styles.dashboardCardLabel}>TOTAL DESPATCHES</Text>
          <Text style={styles.dashboardCardValue}>{communicationMetrics.total}</Text>
        </View>
        <View style={[styles.dashboardCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.dashboardCardLabel}>SUCCESSFULLY SENT</Text>
          <Text style={styles.dashboardCardValue}>{communicationMetrics.sent}</Text>
        </View>
        <View style={[styles.dashboardCard, { borderLeftColor: '#EF4444' }]}>
          <Text style={styles.dashboardCardLabel}>TRANSMISSION DROPS</Text>
          <Text style={styles.dashboardCardValue}>{communicationMetrics.failed}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.navigationTabSection}>
        <View style={styles.navigationTabRow}>
          <TouchableOpacity 
            style={[styles.navigationTabItem, activeWorkspaceTab === 'Broadcast' && styles.navigationTabItemActive]}
            onPress={() => setActiveWorkspaceTab('Broadcast')}
          >
            <Text style={[styles.navigationTabItemText, activeWorkspaceTab === 'Broadcast' && styles.navigationTabItemTextActive]}>
              Transmission Logs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navigationTabItem, activeWorkspaceTab === 'Directory' && styles.navigationTabItemActive]}
            onPress={() => setActiveWorkspaceTab('Directory')}
          >
            <Text style={[styles.navigationTabItemText, activeWorkspaceTab === 'Directory' && styles.navigationTabItemTextActive]}>
              Staff Directory
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      {activeWorkspaceTab === 'Broadcast' ? (
        <View style={styles.workspaceBodyRegion}>
          <View style={styles.searchFilteringWrapper}>
            <TextInput 
              style={styles.workspaceSearchInput}
              placeholder="Filter by subject, group or channel..."
              placeholderTextColor="#94A3B8"
              value={logSearchQuery}
              onChangeText={setLogSearchQuery}
            />
          </View>

          <FlatList
            data={filteredLogs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.dynamicFeedContentList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateContainerText}>No transmission logs found.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.transmissionRecordCard} 
                onPress={() => setSelectedLog(item)}
                activeOpacity={0.8}
              >
                <View style={styles.recordCardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.metaRowLayout}>
                      <Text style={styles.metaIdCode}>{item.id}</Text>
                      <Text style={styles.metaChannelLabel}>{item.channel}</Text>
                    </View>
                    <Text style={styles.recordMainTopicHeading}>{item.subject}</Text>
                    <Text style={styles.recordRecipientSubtitle}>To: {item.targetGroup}</Text>
                  </View>
                  
                  <View style={[
                    styles.statusBadgeCapsule,
                    item.status === 'Dispatched' && styles.statusBadgeDispatched,
                    item.status === 'Failed' && styles.statusBadgeFailed,
                  ]}>
                    <Text style={[
                      styles.statusBadgeCapsuleText,
                      item.status === 'Dispatched' && styles.textStatusDispatched,
                      item.status === 'Failed' && styles.textStatusFailed,
                    ]}>{item.status}</Text>
                  </View>
                </View>
                
                <Text style={styles.recordTruncatedExcerpt} numberOfLines={2}>{item.body}</Text>
                
                <View style={styles.recordCardFooterMetaLayout}>
                  <Text style={styles.footerMetaLabelItem}>🕒 {item.timestamp}</Text>
                  <Text style={styles.footerMetaLabelItem}>By {item.sender}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View style={styles.workspaceBodyRegion}>
          <View style={styles.searchFilteringWrapper}>
            <TextInput 
              style={styles.workspaceSearchInput}
              placeholder="Search staff by name, role or department..."
              placeholderTextColor="#94A3B8"
              value={staffQuery}
              onChangeText={setStaffQuery}
            />
          </View>

          <FlatList
            data={filteredStaff}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.dynamicFeedContentList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.staffDirectoryNodeCard}>
                <View style={styles.staffNodeMainBlock}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.staffNodeNameTitle}>{item.name}</Text>
                    <Text style={styles.staffNodeSubDescriptor}>{item.role} • {item.department}</Text>
                  </View>
                  
                  <View style={[
                    styles.staffStatusPill,
                    item.status === 'Available' && styles.staffPillAvailable,
                    item.status === 'Busy' && styles.staffPillBusy,
                    item.status === 'In Class' && styles.staffPillInClass,
                  ]}>
                    <Text style={[
                      styles.staffStatusPillText,
                      item.status === 'Available' && styles.textStaffAvailable,
                      item.status === 'Busy' && styles.textStaffBusy,
                      item.status === 'In Class' && styles.textStaffInClass,
                    ]}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.directoryActionControlsRow}>
                  <Text style={styles.extensionNumberCode}>Ext: {item.extension}</Text>
                  <TouchableOpacity style={styles.directoryTriggerCallButton} onPress={() => alert(`Calling extension ${item.extension}`)}>
                    <Text style={styles.directoryTriggerCallButtonText}>Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <Modal transparent visible={!!selectedLog} animationType="fade" onRequestClose={() => setSelectedLog(null)}>
          <View style={styles.glassviewModalOverlayContainer}>
            <View style={[styles.modalViewportBaseCard, isMobile && { margin: 12, maxHeight: '92%' }]}>
              <Text style={styles.modalViewportHeaderTitle}>Dispatch Details</Text>
              <Text style={styles.modalViewportHeaderSubtitle}>{selectedLog.id}</Text>

              <ScrollView style={styles.modalBodyScrollArea} showsVerticalScrollIndicator={false}>
                <Text style={styles.dossierFieldLabelText}>CHANNEL</Text>
                <Text style={styles.dossierFieldValueText}>{selectedLog.channel}</Text>

                <Text style={styles.dossierFieldLabelText}>RECIPIENTS</Text>
                <Text style={styles.dossierFieldValueText}>{selectedLog.targetGroup}</Text>

                <Text style={styles.dossierFieldLabelText}>SUBJECT</Text>
                <Text style={styles.dossierFieldValueText}>{selectedLog.subject}</Text>

                <Text style={styles.dossierFieldLabelText}>MESSAGE</Text>
                <Text style={styles.dossierNotesTextAreaBlock}>{selectedLog.body}</Text>
              </ScrollView>

              <TouchableOpacity style={styles.dismissDossierOverlayButton} onPress={() => setSelectedLog(null)}>
                <Text style={styles.dismissDossierOverlayButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Dispatch Modal */}
      <Modal transparent visible={isDispatchModalOpen} animationType="slide" onRequestClose={() => setIsDispatchModalOpen(false)}>
        <View style={styles.glassviewModalOverlayContainer}>
          <View style={[styles.modalViewportBaseCard, isMobile && { margin: 12, maxHeight: '92%' }]}>
            <Text style={styles.modalViewportHeaderTitle}>New Broadcast</Text>
            <Text style={styles.modalViewportHeaderSubtitle}>Create and send a new communication</Text>

            <ScrollView style={styles.formInnerScrollContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.formInputLabelText}>Channel</Text>
              <View style={styles.pickerSelectorRow}>
                {(['SMS', 'Email', 'App Push', 'PA System'] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.pickerSelectorItemBadge, form.channel === mode && styles.pickerSelectorActiveBadge]}
                    onPress={() => setForm({ ...form, channel: mode })}
                  >
                    <Text style={[styles.pickerSelectorItemText, form.channel === mode && styles.pickerSelectorActiveItemText]}>{mode}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formInputLabelText}>Target Group <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput 
                style={styles.formInputBoxElement}
                placeholder="e.g. Grade 8 Parents, All Staff"
                placeholderTextColor="#A1A1AA"
                value={form.targetGroup}
                onChangeText={(val) => setForm({ ...form, targetGroup: val })}
              />

              <Text style={styles.formInputLabelText}>Subject <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput 
                style={styles.formInputBoxElement}
                placeholder="Brief summary"
                placeholderTextColor="#A1A1AA"
                value={form.subject}
                onChangeText={(val) => setForm({ ...form, subject: val })}
              />

              <Text style={styles.formInputLabelText}>Message <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput 
                style={[styles.formInputBoxElement, styles.formMultiLineTextAreaElement]}
                placeholder="Full message content..."
                placeholderTextColor="#A1A1AA"
                value={form.body}
                onChangeText={(val) => setForm({ ...form, body: val })}
                multiline
                numberOfLines={5}
              />
            </ScrollView>

            <View style={styles.formActionsLayoutGroup}>
              <TouchableOpacity style={[styles.formActionButtonBase, styles.formCancelActionButton]} onPress={() => setIsDispatchModalOpen(false)}>
                <Text style={styles.formCancelActionButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.formActionButtonBase, styles.formSubmitActionButton]} onPress={handleDispatchMessage}>
                <Text style={styles.formSubmitActionButtonText}>Send Broadcast</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Responsive Premium Styling for Communication Hub
const styles = StyleSheet.create({
  loadingFallback: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingFallbackText: { marginTop: 12, color: '#64748B', fontSize: 14 },

  appViewContainer: { flex: 1, backgroundColor: '#F0F9FF' },

  appHeaderNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#BAE6FD',
  },
  navbarDisplayTitle: { fontSize: 24, fontWeight: '700', color: '#0C4A6E' },
  navbarDisplaySubtitle: { fontSize: 13, color: '#64748B', marginTop: 4, lineHeight: 18 },

  headerPrimaryAction: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  headerPrimaryActionText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  summaryDashboardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  dashboardCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderLeftWidth: 5,
  },
  dashboardCardLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  dashboardCardValue: { fontSize: 26, fontWeight: '700', marginTop: 8, color: '#0C4A6E' },

  navigationTabSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 20,
  },
  navigationTabRow: { flexDirection: 'row', gap: 24 },
  navigationTabItem: { paddingVertical: 16, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  navigationTabItemActive: { borderBottomColor: '#0EA5E9' },
  navigationTabItemText: { fontSize: 14.5, color: '#64748B', fontWeight: '500' },
  navigationTabItemTextActive: { color: '#0EA5E9', fontWeight: '600' },

  workspaceBodyRegion: { flex: 1 },
  searchFilteringWrapper: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#BAE6FD' },
  workspaceSearchInput: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },

  dynamicFeedContentList: { padding: 16, gap: 12 },

  transmissionRecordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  recordCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaRowLayout: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  metaIdCode: { fontSize: 12, fontWeight: '700', color: '#0EA5E9' },
  metaChannelLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  recordMainTopicHeading: { fontSize: 16.5, fontWeight: '600', color: '#0C4A6E' },
  recordRecipientSubtitle: { fontSize: 13.5, color: '#64748B', marginTop: 4 },
  statusBadgeCapsule: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20 },
  statusBadgeDispatched: { backgroundColor: '#D1FAE5' },
  statusBadgeFailed: { backgroundColor: '#FEE2E2' },
  statusBadgeCapsuleText: { fontSize: 12, fontWeight: '600' },
  textStatusDispatched: { color: '#065F46' },
  textStatusFailed: { color: '#B91C1C' },
  recordTruncatedExcerpt: { fontSize: 14, color: '#475569', marginTop: 12, lineHeight: 20 },
  recordCardFooterMetaLayout: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },

  staffDirectoryNodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  staffNodeMainBlock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  staffNodeNameTitle: { fontSize: 17, fontWeight: '600', color: '#0C4A6E' },
  staffNodeSubDescriptor: { fontSize: 13.5, color: '#64748B', marginTop: 3 },
  staffStatusPill: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20 },
  staffPillAvailable: { backgroundColor: '#D1FAE5' },
  staffPillBusy: { backgroundColor: '#FEF3C7' },
  staffPillInClass: { backgroundColor: '#DBEAFE' },
  staffStatusPillText: { fontSize: 12, fontWeight: '600' },
  textStaffAvailable: { color: '#065F46' },
  textStaffBusy: { color: '#92400E' },
  textStaffInClass: { color: '#1D4ED8' },
  directoryActionControlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  extensionNumberCode: { fontSize: 15, fontWeight: '600', color: '#0C4A6E' },
  directoryTriggerCallButton: { backgroundColor: '#0EA5E9', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  directoryTriggerCallButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },

  emptyStateContainer: { alignItems: 'center', paddingVertical: 80 },
  emptyStateContainerText: { fontSize: 15, color: '#94A3B8' },

  glassviewModalOverlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(12, 74, 110, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalViewportBaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
  },
  modalViewportHeaderTitle: { fontSize: 22, fontWeight: '700', color: '#0C4A6E' },
  modalViewportHeaderSubtitle: { fontSize: 13.5, color: '#0EA5E9', marginTop: 4 },

  modalBodyScrollArea: { marginVertical: 12 },
  dossierFieldLabelText: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginTop: 16 },
  dossierFieldValueText: { fontSize: 16, color: '#0C4A6E', marginTop: 4 },
  dossierNotesTextAreaBlock: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: 8,
  },

  dismissDossierOverlayButton: {
    backgroundColor: '#0C4A6E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  dismissDossierOverlayButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  formInnerScrollContainer: { flex: 1 },
  formInputLabelText: { fontSize: 13.5, fontWeight: '600', color: '#475569', marginTop: 14, marginBottom: 6 },
  pickerSelectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  pickerSelectorItemBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  pickerSelectorActiveBadge: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  pickerSelectorItemText: { fontSize: 13, color: '#475569' },
  pickerSelectorActiveItemText: { color: '#FFFFFF', fontWeight: '600' },

  formInputBoxElement: {
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  formMultiLineTextAreaElement: { height: 120, textAlignVertical: 'top' },

  formActionsLayoutGroup: { flexDirection: 'row', gap: 12, marginTop: 24 },
  formActionButtonBase: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  formCancelActionButton: { backgroundColor: '#E0F2FE' },
  formSubmitActionButton: { backgroundColor: '#0EA5E9' },
  formCancelActionButtonText: { color: '#0C4A6E', fontWeight: '600', fontSize: 15 },
  formSubmitActionButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});