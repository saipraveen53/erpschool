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
  useWindowDimensions,
  Alert,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface CommunicationLog {
  id: string;
  timestamp: string;
  channel: 'SMS' | 'Email' | 'App Push';
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

const TARGET_GROUPS = [
  'Grade 10 Parents',
  'Grade 8 Parents',
  'All Faculty & Staff',
  'Transport Operators Group',
  'Admissions Team',
  'Student Council',
] as const;

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
  },
];

const MOCK_STAFF: StaffContact[] = [
  { id: 'STF-401', name: 'Dr. Aranya Sen', role: 'Vice Principal', department: 'Administration', extension: 'XT-102', status: 'Available' },
  { id: 'STF-102', name: 'Ms. Priya Sharma', role: 'Senior Admissions Counselor', department: 'Admissions Office', extension: 'XT-115', status: 'Busy' },
  { id: 'STF-289', name: 'Mr. Rajesh Nair', role: 'Head of Logistics & Transit', department: 'Transport Wing', extension: 'XT-304', status: 'In Class' },
  { id: 'STF-504', name: 'Mrs. Caroline Vance', role: 'Grievance Resolution Officer', department: 'Student Welfare', extension: 'XT-108', status: 'Available' },
];

const THEME = {
  background: '#FFF8F1',
  surface: '#FFFFFF',
  surfaceSoft: '#FFF3E8',
  border: '#F5D7BF',
  primary: '#f92525',
  primaryDark: '#DC2626',
  primarySoft: '#FFEDD5',
  text: '#7C2D12',
  textStrong: '#431407',
  textMuted: '#9A3412',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  info: '#DC2626',
  shadow: '#E7B78F',
  inputBg: '#FFFDFB',
};

export default function CommunicationManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 992;

  const [isMounted, setIsMounted] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'Broadcast' | 'Directory'>('Broadcast');
  const [logs, setLogs] = useState<CommunicationLog[]>(MOCK_LOGS);
  
  const [staffQuery, setStaffQuery] = useState('');
  
  // Filtering States
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Dispatched' | 'Pending' | 'Failed'>('All');
  const [targetFilter, setTargetFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState('');
  
  // Dropdown UI States
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [isFormTargetDropdownOpen, setIsFormTargetDropdownOpen] = useState(false);

  const [selectedLog, setSelectedLog] = useState<CommunicationLog | null>(null);
  const [staffToCall, setStaffToCall] = useState<StaffContact | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Success Modal State
  const [successModal, setSuccessModal] = useState({ visible: false, title: '', message: '' });

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
    return logs.filter((log) => {
      const q = logSearchQuery.toLowerCase();
      const matchesSearch =
        log.subject.toLowerCase().includes(q) ||
        log.targetGroup.toLowerCase().includes(q) ||
        log.channel.toLowerCase().includes(q);
      
      const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
      const matchesTarget = targetFilter === 'All' || log.targetGroup === targetFilter;
      const matchesChannel = channelFilter === 'All' || log.channel === channelFilter;
      const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);

      return matchesSearch && matchesStatus && matchesTarget && matchesChannel && matchesDate;
    });
  }, [logs, logSearchQuery, statusFilter, targetFilter, channelFilter, dateFilter]);

  const filteredStaff = useMemo(() => {
    return MOCK_STAFF.filter((person) => {
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
      Alert.alert('Validation Error', 'Fill out target recipients, summary line, and message.');
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

    // Trigger Success Modal
    setSuccessModal({ visible: true, title: 'Broadcast Sent!', message: 'The communication has been dispatched successfully.' });
  };

  const clearSearch = () => {
    setLogSearchQuery('');
  };

  const clearStaffSearch = () => {
    setStaffQuery('');
  };

  if (!isMounted) {
    return (
      <SafeAreaView style={[styles.loadingFallback, styles.centerContent]}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingFallbackText}>Loading Communication Control Room...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.appViewContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.pageScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.appHeaderNavbar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.navbarDisplayTitle}>Communication Control Room</Text>
            <Text style={styles.navbarDisplaySubtitle}>
              Broadcast emergency dispatches, cross-notify parent cohorts, and connect internal phone nodes.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerPrimaryAction}
            onPress={() => {
              setForm({ ...form, targetGroup: '' });
              setIsDispatchModalOpen(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.headerPrimaryActionText}>+ Dispatch Broadcast</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryShell}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Broadcast Overview</Text>
            <Text style={styles.summarySubtitle}>Swipe horizontally to review each metric</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryDashboardRow}>
            <View style={[styles.dashboardCard, styles.cardTotal]}>
              <Text style={styles.dashboardCardLabel}>Total Despatches</Text>
              <Text style={styles.dashboardCardValue}>{communicationMetrics.total}</Text>
              <Text style={styles.dashboardCardFoot}>All recorded messages</Text>
            </View>

            <View style={[styles.dashboardCard, styles.cardSent]}>
              <Text style={styles.dashboardCardLabel}>Successfully Sent</Text>
              <Text style={[styles.dashboardCardValue, { color: THEME.success }]}>{communicationMetrics.sent}</Text>
              <Text style={styles.dashboardCardFoot}>Delivered to recipients</Text>
            </View>

            <View style={[styles.dashboardCard, styles.cardFailed]}>
              <Text style={styles.dashboardCardLabel}>Transmission Drops</Text>
              <Text style={[styles.dashboardCardValue, { color: THEME.danger }]}>{communicationMetrics.failed}</Text>
              <Text style={styles.dashboardCardFoot}>Needs retry or review</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.navigationTabSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                  Staff Details
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {activeWorkspaceTab === 'Broadcast' ? (
          <View style={styles.workspaceBodyRegion}>
            <View style={styles.searchFilteringWrapper}>
              
              <View style={isMobile ? styles.filterRowMobile : styles.filterRowWeb}>
                
                {/* 1. Enhanced Professional Search Bar */}
                <View style={[styles.filterItemSearch, isMobile && styles.filterItemHalf]}>
                  <View style={styles.searchInputContainer}>
                    <TextInput
                      style={styles.workspaceSearchInput}
                      placeholder="Search Broadcasts..."
                      placeholderTextColor="#A16207"
                      value={logSearchQuery}
                      onChangeText={setLogSearchQuery}
                    />
                    {logSearchQuery.length > 0 && (
                      <TouchableOpacity
                        style={styles.clearSearchButton}
                        onPress={clearSearch}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.clearSearchButtonText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* 2. Target Group Dropdown Filter */}
                <View style={[styles.filterItem, { zIndex: 40 }, isMobile && styles.filterItemHalf]}>
                  <TouchableOpacity
                    style={styles.dropdownSelectorBox}
                    onPress={() => {
                      setIsTargetDropdownOpen(!isTargetDropdownOpen);
                      setIsChannelDropdownOpen(false);
                      setIsStatusDropdownOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                      {targetFilter === 'All' ? 'All Targets' : targetFilter}
                    </Text>
                    <Text style={styles.dropdownIconText}>{isTargetDropdownOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  
                  {isTargetDropdownOpen && (
                    <View style={styles.floatingDropdownList}>
                      {/* Removed ScrollView to fix nested scroll issues on Mobile Apps */}
                      <View>
                        <TouchableOpacity
                          style={[styles.dropdownListItem, targetFilter === 'All' && styles.dropdownListItemActive]}
                          onPress={() => {
                            setTargetFilter('All');
                            setIsTargetDropdownOpen(false);
                          }}
                        >
                          <Text style={[styles.dropdownListItemText, targetFilter === 'All' && styles.dropdownListItemTextActive]}>All Targets</Text>
                        </TouchableOpacity>
                        {TARGET_GROUPS.map((opt) => (
                          <TouchableOpacity
                            key={opt}
                            style={[styles.dropdownListItem, targetFilter === opt && styles.dropdownListItemActive]}
                            onPress={() => {
                              setTargetFilter(opt);
                              setIsTargetDropdownOpen(false);
                            }}
                          >
                            <Text style={[styles.dropdownListItemText, targetFilter === opt && styles.dropdownListItemTextActive]}>
                              {opt}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* 3. Channel Dropdown Filter */}
                <View style={[styles.filterItem, { zIndex: 30 }, isMobile && styles.filterItemHalf]}>
                  <TouchableOpacity
                    style={styles.dropdownSelectorBox}
                    onPress={() => {
                      setIsChannelDropdownOpen(!isChannelDropdownOpen);
                      setIsTargetDropdownOpen(false);
                      setIsStatusDropdownOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                      {channelFilter === 'All' ? 'All Channels' : channelFilter}
                    </Text>
                    <Text style={styles.dropdownIconText}>{isChannelDropdownOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  
                  {isChannelDropdownOpen && (
                    <View style={styles.floatingDropdownList}>
                      <View>
                        {['All', 'SMS', 'Email', 'App Push'].map((opt) => (
                          <TouchableOpacity
                            key={opt}
                            style={[styles.dropdownListItem, channelFilter === opt && styles.dropdownListItemActive]}
                            onPress={() => {
                              setChannelFilter(opt);
                              setIsChannelDropdownOpen(false);
                            }}
                          >
                            <Text style={[styles.dropdownListItemText, channelFilter === opt && styles.dropdownListItemTextActive]}>
                              {opt === 'All' ? 'All Channels' : opt}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* 4. Date Picker Filter */}
                <View style={[styles.filterItem, { zIndex: 10 }, isMobile && styles.filterItemHalf]}>
                  <View style={{ position: 'relative', width: '100%' }}>
                    {Platform.OS === 'web' ? (
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={styles.webNativeInputDatePicker as any}
                      />
                    ) : (
                      <TextInput
                        style={styles.formInputBoxElement}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#A16207"
                        value={dateFilter}
                        onChangeText={setDateFilter}
                      />
                    )}
                  </View>
                </View>

                {/* 5. Status Dropdown Filter */}
                <View style={[styles.filterItem, { zIndex: 20 }, isMobile && styles.filterItemHalf]}>
                  <TouchableOpacity
                    style={styles.dropdownSelectorBox}
                    onPress={() => {
                      setIsStatusDropdownOpen(!isStatusDropdownOpen);
                      setIsTargetDropdownOpen(false);
                      setIsChannelDropdownOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                      {statusFilter === 'All' ? 'All Status' : statusFilter}
                    </Text>
                    <Text style={styles.dropdownIconText}>{isStatusDropdownOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  
                  {isStatusDropdownOpen && (
                    <View style={styles.floatingDropdownList}>
                      <View>
                        {['All', 'Dispatched', 'Pending', 'Failed'].map((opt) => (
                          <TouchableOpacity
                            key={opt}
                            style={[styles.dropdownListItem, statusFilter === opt && styles.dropdownListItemActive]}
                            onPress={() => {
                              setStatusFilter(opt as any);
                              setIsStatusDropdownOpen(false);
                            }}
                          >
                            <Text style={[styles.dropdownListItemText, statusFilter === opt && styles.dropdownListItemTextActive]}>
                              {opt}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

              </View>
            </View>

            <FlatList
              data={filteredLogs}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.dynamicFeedContentList}
              ListEmptyComponent={
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateContainerText}>No transmission logs found.</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.transmissionRecordCardWrapper}>
                  <TouchableOpacity
                    style={styles.transmissionRecordCard}
                    onPress={() => setSelectedLog(item)}
                    activeOpacity={0.85}
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

                      <View
                        style={[
                          styles.statusBadgeCapsule,
                          item.status === 'Dispatched' && styles.statusBadgeDispatched,
                          item.status === 'Failed' && styles.statusBadgeFailed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeCapsuleText,
                            item.status === 'Dispatched' && styles.textStatusDispatched,
                            item.status === 'Failed' && styles.textStatusFailed,
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.recordTruncatedExcerpt} numberOfLines={2}>
                      {item.body}
                    </Text>

                    <View style={styles.recordCardFooterMetaLayout}>
                      <Text style={styles.footerMetaLabelItem}>🕒 {item.timestamp}</Text>
                      <Text style={styles.footerMetaLabelItem}>By {item.sender}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ) : (
          <View style={styles.workspaceBodyRegion}>
            <View style={styles.searchFilteringWrapper}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.workspaceSearchInput}
                  placeholder="Search staff by name, role or department..."
                  placeholderTextColor="#A16207"
                  value={staffQuery}
                  onChangeText={setStaffQuery}
                />
                {staffQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearSearchButton}
                    onPress={clearStaffSearch}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.clearSearchButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <FlatList
              data={filteredStaff}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.dynamicFeedContentList}
              renderItem={({ item }) => (
                <View style={styles.staffDirectoryNodeCard}>
                  <View style={styles.staffNodeMainBlock}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.staffNodeNameTitle}>{item.name}</Text>
                      <Text style={styles.staffNodeSubDescriptor}>
                        {item.role} • {item.department}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.staffStatusPill,
                        item.status === 'Available' && styles.staffPillAvailable,
                        item.status === 'Busy' && styles.staffPillBusy,
                        item.status === 'In Class' && styles.staffPillInClass,
                      ]}
                    >
                      <Text
                        style={[
                          styles.staffStatusPillText,
                          item.status === 'Available' && styles.textStaffAvailable,
                          item.status === 'Busy' && styles.textStaffBusy,
                          item.status === 'In Class' && styles.textStaffInClass,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.directoryActionControlsRow}>
                    <Text style={styles.extensionNumberCode}>Ext: {item.extension}</Text>
                    <TouchableOpacity
                      style={styles.directoryTriggerCallButton}
                      onPress={() => setStaffToCall(item)}
                    >
                      <Text style={styles.directoryTriggerCallButtonText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>

      {/* Details Modal */}
      {selectedLog && (
        <Modal transparent visible={!!selectedLog} animationType="fade" onRequestClose={() => setSelectedLog(null)}>
          <View style={styles.glassviewModalOverlayContainer}>
            <View style={[styles.modalViewportBaseCard, isMobile && styles.modalMobileCard]}>
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

              <View style={styles.modalDetailActions}>
                <TouchableOpacity
                  style={styles.dismissDossierOverlayButton}
                  onPress={() => setSelectedLog(null)}
                >
                  <Text style={styles.dismissDossierOverlayButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Call Confirmation Modal */}
      {staffToCall && (
        <Modal transparent visible={!!staffToCall} animationType="fade" onRequestClose={() => setStaffToCall(null)}>
          <View style={styles.glassviewModalOverlayContainer}>
            <View style={[styles.modalViewportBaseCard, isMobile && styles.modalMobileCard, { maxWidth: 360, paddingVertical: 28 }]}>
              <Text style={[styles.modalViewportHeaderTitle, { textAlign: 'center', fontSize: 20 }]}>Confirm Call</Text>
              <Text style={{ fontSize: 15, color: THEME.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 22 }}>
                Are you sure you want to call <Text style={{fontWeight: '700', color: THEME.textStrong}}>{staffToCall.name}</Text> on extension <Text style={{fontWeight: '700', color: THEME.textStrong}}>{staffToCall.extension}</Text>?
              </Text>

              <View style={styles.formActionsLayoutGroup}>
                <TouchableOpacity
                  style={[styles.formActionButtonBase, styles.formCancelActionButton]}
                  onPress={() => setStaffToCall(null)}
                >
                  <Text style={styles.formCancelActionButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.formActionButtonBase, styles.formSubmitActionButton]}
                  onPress={() => {
                    setStaffToCall(null);
                  }}
                >
                  <Text style={styles.formSubmitActionButtonText}>Call Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* New Dispatch Modal Form */}
      <Modal
        transparent
        visible={isDispatchModalOpen}
        animationType="slide"
        onRequestClose={() => setIsDispatchModalOpen(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.glassviewModalOverlayContainer}
            onPress={() => {
              setIsDispatchModalOpen(false);
              setIsFormTargetDropdownOpen(false);
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.modalViewportBaseCard, isMobile && styles.modalMobileCard]}
              onPress={() => setIsFormTargetDropdownOpen(false)}
            >
              <Text style={styles.modalViewportHeaderTitle}>New Broadcast</Text>
              <Text style={styles.modalViewportHeaderSubtitle}>Create and send a new communication</Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 30 }}
              >
                <Text style={styles.formInputLabelText}>Channel</Text>

                <View style={styles.pickerSelectorRow}>
                  {(['SMS', 'Email', 'App Push'] as const).map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[
                        styles.pickerSelectorItemBadge,
                        form.channel === mode && styles.pickerSelectorActiveBadge,
                      ]}
                      onPress={() => setForm({ ...form, channel: mode })}
                    >
                      <Text
                        style={[
                          styles.pickerSelectorItemText,
                          form.channel === mode && styles.pickerSelectorActiveItemText,
                        ]}
                      >
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Form Target Group Dropdown */}
                <Text style={styles.formInputLabelText}>
                  Target Group<Text style={{ color: THEME.danger }}> *</Text>
                </Text>
                <View style={{ zIndex: 50, position: 'relative' }}>
                  <TouchableOpacity
                    style={[styles.dropdownSelectorBox, { backgroundColor: THEME.inputBg }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      setIsFormTargetDropdownOpen(!isFormTargetDropdownOpen);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                      {form.targetGroup || 'Select Target Group'}
                    </Text>
                    <Text style={styles.dropdownIconText}>{isFormTargetDropdownOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  
                  {isFormTargetDropdownOpen && (
                    <View style={[styles.floatingDropdownList, { maxHeight: 400 }]}>
                      {/* Removed ScrollView to avoid nested scrolling collision inside modal */}
                      <View>
                        {TARGET_GROUPS.map((opt) => (
                          <TouchableOpacity
                            key={opt}
                            style={[styles.dropdownListItem, form.targetGroup === opt && styles.dropdownListItemActive]}
                            onPress={() => {
                              setForm({ ...form, targetGroup: opt });
                              setIsFormTargetDropdownOpen(false);
                            }}
                          >
                            <Text style={[styles.dropdownListItemText, form.targetGroup === opt && styles.dropdownListItemTextActive]}>
                              {opt}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                <Text style={styles.formInputLabelText}>
                  Subject<Text style={{ color: THEME.danger }}> *</Text>
                </Text>
                <TextInput
                  style={styles.formInputBoxElement}
                  placeholder="Broadcast subject"
                  placeholderTextColor="#A16207"
                  value={form.subject}
                  onChangeText={(val) => setForm({ ...form, subject: val })}
                  returnKeyType="next"
                />

                <Text style={styles.formInputLabelText}>
                  Message<Text style={{ color: THEME.danger }}> *</Text>
                </Text>
                <TextInput
                  style={[styles.formInputBoxElement, styles.formMultiLineTextAreaElement]}
                  placeholder="Enter communication message..."
                  placeholderTextColor="#A16207"
                  value={form.body}
                  onChangeText={(val) => setForm({ ...form, body: val })}
                  multiline
                  textAlignVertical="top"
                  returnKeyType="done"
                />

                <View style={styles.formActionsLayoutGroup}>
                  <TouchableOpacity
                    style={[styles.formActionButtonBase, styles.formCancelActionButton]}
                    onPress={() => setIsDispatchModalOpen(false)}
                  >
                    <Text style={styles.formCancelActionButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.formActionButtonBase, styles.formSubmitActionButton]}
                    onPress={handleDispatchMessage}
                  >
                    <Text style={styles.formSubmitActionButtonText}>Send Broadcast</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* SUCCESS MODAL POPUP */}
      <Modal transparent visible={successModal.visible} animationType="fade" onRequestClose={() => setSuccessModal((p) => ({...p, visible: false}))}>
        <View style={styles.glassviewModalOverlayContainer}>
          <View style={[styles.modalViewportBaseCard, isMobile && styles.modalMobileCard, { alignItems: 'center', maxWidth: 400 }]}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#A7F3D0' }}>
              <Ionicons name="checkmark" size={40} color="#16A34A" />
            </View>
            <Text style={[styles.modalViewportHeaderTitle, { textAlign: 'center' }]}>{successModal.title}</Text>
            <Text style={{ fontSize: 15, color: THEME.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 22 }}>{successModal.message}</Text>
            
            <View style={[styles.formActionsLayoutGroup, { width: '100%' }]}>
              <TouchableOpacity
                style={[styles.formActionButtonBase, { backgroundColor: '#16A34A' }]}
                onPress={() => setSuccessModal((p) => ({...p, visible: false}))}
              >
                <Text style={styles.formSubmitActionButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFallback: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  loadingFallbackText: {
    marginTop: 12,
    color: THEME.textMuted,
    fontSize: 14,
  },

  appViewContainer: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  pageScrollContent: {
    paddingBottom: 24,
  },

  appHeaderNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderColor: THEME.border,
    ...Platform.select({
      ios: {
        shadowColor: THEME.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  navbarDisplayTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.textStrong,
  },
  navbarDisplaySubtitle: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },

  headerPrimaryAction: {
    backgroundColor: THEME.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  headerPrimaryActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  summaryShell: {
    backgroundColor: THEME.surfaceSoft,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 22,
    padding: 14,
    marginTop: 12,
    marginBottom: 14,
    marginHorizontal: 16,
  },
  summaryHeader: {
    marginBottom: 12,
  },
  summaryTitle: {
    color: THEME.textStrong,
    fontSize: 15,
    fontWeight: '800',
  },
  summarySubtitle: {
    color: THEME.textMuted,
    fontSize: 12.5,
    marginTop: 4,
  },
  summaryDashboardRow: {
    paddingRight: 8,
  },
  dashboardCard: {
    width: 190,
    marginRight: 12,
    backgroundColor: THEME.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    ...Platform.select({
      ios: {
        shadowColor: THEME.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  cardTotal: {
    borderTopWidth: 4,
    borderTopColor: THEME.primaryDark,
  },
  cardSent: {
    borderTopWidth: 4,
    borderTopColor: THEME.success,
  },
  cardFailed: {
    borderTopWidth: 4,
    borderTopColor: THEME.danger,
  },
  dashboardCardLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dashboardCardValue: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 8,
    color: THEME.textStrong,
  },
  dashboardCardFoot: {
    fontSize: 11.5,
    color: THEME.textMuted,
    marginTop: 6,
    lineHeight: 16,
  },

  navigationTabSection: {
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 16,
  },
  navigationTabRow: {
    flexDirection: 'row',
    gap: 24,
  },
  navigationTabItem: {
    paddingVertical: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  navigationTabItemActive: {
    borderBottomColor: THEME.primary,
  },
  navigationTabItemText: {
    fontSize: 14.5,
    color: THEME.textMuted,
    fontWeight: '600',
  },
  navigationTabItemTextActive: {
    color: THEME.primaryDark,
    fontWeight: '800',
  },

  workspaceBodyRegion: {
    flex: 1,
  },
  searchFilteringWrapper: {
    padding: 16,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderColor: THEME.border,
    zIndex: 10,
  },
  
  filterRowWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  filterRowMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    zIndex: 10,
  },
  filterItemSearch: {
    flex: 1.5,
    position: 'relative',
    zIndex: 1,
  },
  filterItem: {
    flex: 1,
    position: 'relative',
  },
  filterItemHalf: {
    minWidth: '47%',
  },

  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0C8A4',
    height: 48,
    paddingHorizontal: 14,
    ...Platform.select({
      ios: { shadowColor: '#D9A77D', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
      default: {},
    }),
  },
  workspaceSearchInput: {
    flex: 1,
    fontSize: 15,
    color: THEME.textStrong,
    height: '100%',
    ...Platform.select({ web: { outlineStyle: 'none' } as any, default: {} }),
  },
  clearSearchButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearSearchButtonText: {
    color: THEME.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },

  dropdownSelectorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.inputBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#F0C8A4',
  },
  dropdownSelectorText: {
    fontSize: 14,
    color: THEME.textStrong,
    fontWeight: '600',
  },
  dropdownIconText: {
    fontSize: 10,
    color: THEME.textMuted,
    marginLeft: 8,
  },
  floatingDropdownList: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: THEME.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    maxHeight: 400,
    overflow: 'hidden',
    zIndex: 9999,
    ...Platform.select({
      ios: { shadowColor: THEME.shadow, shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 10 },
      default: {},
    }),
  },
  dropdownListItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF3E8',
  },
  dropdownListItemActive: {
    backgroundColor: THEME.primarySoft,
  },
  dropdownListItemText: {
    fontSize: 14,
    color: THEME.textStrong,
  },
  dropdownListItemTextActive: {
    color: THEME.primaryDark,
    fontWeight: '700',
  },

  webNativeInputDatePicker: {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    borderRadius: '14px',
    border: '1px solid #F0C8A4',
    fontSize: '14px',
    color: THEME.textStrong,
    fontWeight: '600',
    fontFamily: 'inherit',
    backgroundColor: THEME.inputBg,
    boxSizing: 'border-box',
  },

  dynamicFeedContentList: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  transmissionRecordCardWrapper: {
    gap: 8,
  },
  transmissionRecordCard: {
    backgroundColor: THEME.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.border,
    ...Platform.select({
      ios: {
        shadowColor: THEME.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  recordCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metaRowLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  metaIdCode: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.primaryDark,
  },
  metaChannelLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '600',
  },
  recordMainTopicHeading: {
    fontSize: 16.5,
    fontWeight: '800',
    color: THEME.textStrong,
  },
  recordRecipientSubtitle: {
    fontSize: 13.5,
    color: THEME.textMuted,
    marginTop: 4,
  },
  statusBadgeCapsule: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  statusBadgeDispatched: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeFailed: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeCapsuleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textStatusDispatched: {
    color: '#166534',
  },
  textStatusFailed: {
    color: '#991B1B',
  },
  recordTruncatedExcerpt: {
    fontSize: 14,
    color: '#6B4A36',
    marginTop: 12,
    lineHeight: 20,
  },
  footerMetaLabelItem: {
    fontSize: 12.5,
    color: THEME.textMuted,
    fontWeight: '600',
  },
  recordCardFooterMetaLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
    flexWrap: 'wrap',
  },

  staffDirectoryNodeCard: {
    backgroundColor: THEME.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  staffNodeMainBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  staffNodeNameTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.textStrong,
  },
  staffNodeSubDescriptor: {
    fontSize: 13.5,
    color: THEME.textMuted,
    marginTop: 3,
  },
  staffStatusPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  staffPillAvailable: {
    backgroundColor: '#DCFCE7',
  },
  staffPillBusy: {
    backgroundColor: '#FEF3C7',
  },
  staffPillInClass: {
    backgroundColor: '#FFEDD5',
  },
  staffStatusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textStaffAvailable: {
    color: '#166534',
  },
  textStaffBusy: {
    color: '#DC2626',
  },
  textStaffInClass: {
    color: '#DC2626',
  },
  directoryActionControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  extensionNumberCode: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textStrong,
  },
  directoryTriggerCallButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  directoryTriggerCallButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateContainerText: {
    fontSize: 15,
    color: THEME.textMuted,
  },

  glassviewModalOverlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(60, 33, 20, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  modalViewportBaseCard: {
    backgroundColor: THEME.surface,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 520,
    maxHeight: '95%',
  },
  modalMobileCard: {
    width: '95%',
    maxHeight: '92%',
  },
  modalViewportHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.textStrong,
  },
  modalViewportHeaderSubtitle: {
    fontSize: 13.5,
    color: THEME.primaryDark,
    marginTop: 4,
    fontWeight: '600',
  },
  modalBodyScrollArea: {
    marginVertical: 12,
  },
  dossierFieldLabelText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.textMuted,
    textTransform: 'uppercase',
    marginTop: 16,
    letterSpacing: 0.4,
  },
  dossierFieldValueText: {
    fontSize: 16,
    color: THEME.textStrong,
    marginTop: 4,
    lineHeight: 23,
  },
  dossierNotesTextAreaBlock: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B4A36',
    backgroundColor: '#FFF7ED',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0C8A4',
    marginTop: 8,
  },
  dismissDossierOverlayButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  dismissDossierOverlayButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  modalDetailActions: {
    paddingHorizontal: 8,
  },

  formInputLabelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: THEME.text,
    marginTop: 14,
    marginBottom: 6,
  },
  pickerSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pickerSelectorItemBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F0C8A4',
    backgroundColor: THEME.primarySoft,
  },
  pickerSelectorActiveBadge: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  pickerSelectorItemText: {
    fontSize: 13,
    color: THEME.textStrong,
    fontWeight: '600',
  },
  pickerSelectorActiveItemText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formInputBoxElement: {
    borderWidth: 1,
    borderColor: '#F0C8A4',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: THEME.inputBg,
    color: THEME.textStrong,
  },
  formMultiLineTextAreaElement: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  formActionsLayoutGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  formActionButtonBase: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  formCancelActionButton: {
    backgroundColor: THEME.primarySoft,
    borderWidth: 1,
    borderColor: '#F0C8A4',
  },
  formSubmitActionButton: {
    backgroundColor: THEME.primary,
  },
  formCancelActionButtonText: {
    color: THEME.textStrong,
    fontWeight: '700',
    fontSize: 15,
  },
  formSubmitActionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});