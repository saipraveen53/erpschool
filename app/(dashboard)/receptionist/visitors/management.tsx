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

export interface VisitorRecord {
  id: string;
  name: string;
  purpose: 'Parent-Teacher Meeting' | 'Vendor/Contractor' | 'Official Audit' | 'Personal Guest';
  hostStaff: string;
  checkInTime: string;
  checkOutTime: string | null;
  badgeNumber: string;
  contactNumber: string;
  status: 'Checked In' | 'Checked Out';
  remarks?: string;
}

const MOCK_VISITORS: VisitorRecord[] = [
  {
    id: 'VST-2026-440',
    name: 'Rohan Deshmukh',
    purpose: 'Parent-Teacher Meeting',
    hostStaff: 'Mrs. Caroline Vance (Grade 6 Coordinator)',
    checkInTime: '2026-05-29 02:15 PM',
    checkOutTime: null,
    badgeNumber: 'BADGE-089',
    contactNumber: '+91 98765 43210',
    status: 'Checked In',
    remarks: 'Pre-scheduled meeting regarding academic curriculum adjustments.',
  },
  {
    id: 'VST-2026-439',
    name: 'Vikram Sethi',
    purpose: 'Vendor/Contractor',
    hostStaff: 'Mr. Rajesh Nair (Logistics Department)',
    checkInTime: '2026-05-29 11:00 AM',
    checkOutTime: '2026-05-29 01:30 PM',
    badgeNumber: 'BADGE-114',
    contactNumber: '+91 91234 56789',
    status: 'Checked Out',
    remarks: 'Delivered facility hardware diagnostics supplies to primary annex.',
  },
  {
    id: 'VST-2026-438',
    name: 'Dr. Anita Roy',
    purpose: 'Official Audit',
    hostStaff: 'Dr. Aranya Sen (Vice Principal)',
    checkInTime: '2026-05-29 09:30 AM',
    checkOutTime: null,
    badgeNumber: 'BADGE-002',
    contactNumber: '+91 99887 76655',
    status: 'Checked In',
    remarks: 'Board certification facilities inspection overview panel.',
  }
];

export default function VisitorManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [isMounted, setIsMounted] = useState(false);
  const [visitorLog, setVisitorLog] = useState<VisitorRecord[]>(MOCK_VISITORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'All' | 'Active' | 'Concluded'>('All');

  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    purpose: 'Parent-Teacher Meeting' as VisitorRecord['purpose'],
    hostStaff: '',
    badgeNumber: '',
    contactNumber: '',
    remarks: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const visitorMetrics = useMemo(() => {
    return visitorLog.reduce(
      (acc, curr) => {
        acc.total++;
        if (curr.status === 'Checked In') acc.inside++;
        if (curr.status === 'Checked Out') acc.departed++;
        return acc;
      },
      { total: 0, inside: 0, departed: 0 }
    );
  }, [visitorLog]);

  const filteredVisitors = useMemo(() => {
    return visitorLog.filter((visitor) => {
      const matchesSearch =
        visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visitor.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visitor.hostStaff.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        filterMode === 'All' ||
        (filterMode === 'Active' && visitor.status === 'Checked In') ||
        (filterMode === 'Concluded' && visitor.status === 'Checked Out');

      return matchesSearch && matchesTab;
    });
  }, [visitorLog, searchQuery, filterMode]);

  const handleCheckInSubmit = () => {
    if (!form.name.trim() || !form.hostStaff.trim() || !form.badgeNumber.trim()) {
      alert('Security Directive: Visitor Name, Host Staff Target, and Physical Badge allocations are required.');
      return;
    }

    const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDateString = new Date().toISOString().split('T')[0];

    const newGuest: VisitorRecord = {
      id: `VST-2026-${visitorLog.length + 441}`,
      name: form.name.trim(),
      purpose: form.purpose,
      hostStaff: form.hostStaff.trim(),
      checkInTime: `${currentDateString} ${currentTimeString}`,
      checkOutTime: null,
      badgeNumber: form.badgeNumber.trim().toUpperCase(),
      contactNumber: form.contactNumber.trim() || 'N/A',
      status: 'Checked In',
      remarks: form.remarks.trim() || 'No supplementary security logs recorded.'
    };

    setVisitorLog([newGuest, ...visitorLog]);
    setForm({ name: '', purpose: 'Parent-Teacher Meeting', hostStaff: '', badgeNumber: '', contactNumber: '', remarks: '' });
    setIsCheckInModalOpen(false);
  };

  const handleCheckOutAction = (id: string) => {
    const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDateString = new Date().toISOString().split('T')[0];

    setVisitorLog((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'Checked Out', checkOutTime: `${currentDateString} ${currentTimeString}` }
          : item
      )
    );
    setSelectedVisitor(null);
  };

  if (!isMounted) {
    return (
      <SafeAreaView style={[styles.centerLoader, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loaderSubtext}>Initializing Gate Secure Logs...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.viewBaseArea}>
      {/* Header */}
      <View style={styles.appTitleNavbarHeader}>
        <View>
          <Text style={styles.dashboardTitleText}>Visitor Control & Tracking</Text>
          <Text style={styles.dashboardSubtitleText}>Monitor campus foot traffic, authorize physical badge tags, and timestamp exits cleanly.</Text>
        </View>
        <TouchableOpacity
          style={styles.headerPrimaryTriggerBtn}
          onPress={() => setIsCheckInModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.headerPrimaryTriggerBtnText}>🔑 Log New Entry Guest</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics */}
      <View style={styles.securityMetricsRowLayout}>
        <View style={[styles.securityMetricsCard, { borderLeftColor: '#3B82F6' }]}>
          <Text style={styles.metricsLabelMini}>TOTAL LOG ENTRIES</Text>
          <Text style={styles.metricsCounterValue}>{visitorMetrics.total}</Text>
        </View>
        <View style={[styles.securityMetricsCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.metricsLabelMini}>CURRENTLY ON CAMPUS</Text>
          <Text style={[styles.metricsCounterValue, { color: '#10B981' }]}>{visitorMetrics.inside}</Text>
        </View>
        <View style={[styles.securityMetricsCard, { borderLeftColor: '#64748B' }]}>
          <Text style={styles.metricsLabelMini}>CONCLUDED TRANSITS</Text>
          <Text style={styles.metricsCounterValue}>{visitorMetrics.departed}</Text>
        </View>
      </View>

      {/* Search & Filters */}
      <View style={styles.filterControlDeckWrapper}>
        <TextInput
          style={styles.searchBarBoxInput}
          placeholder="Lookup by visitor name, badge number, or host staff..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.tabPillMatrixRow}>
          {[
            { label: 'Comprehensive Logs', value: 'All' },
            { label: 'Inside Premises (Active)', value: 'Active' },
            { label: 'Checked-Out Logs', value: 'Concluded' }
          ].map((pill) => {
            const matchActive = filterMode === pill.value;
            return (
              <TouchableOpacity
                key={pill.value}
                style={[styles.tabFilterPillItem, matchActive && styles.tabFilterPillItemActive]}
                onPress={() => setFilterMode(pill.value as any)}
              >
                <Text style={[styles.tabFilterPillItemText, matchActive && styles.tabFilterPillItemTextActive]}>
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Visitor List */}
      <FlatList
        data={filteredVisitors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollListLayoutBody}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyFeedPlaceholder}>
            <Text style={styles.emptyFeedPlaceholderText}>No visitor records located matching query parameters.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.visitorRegistryListCard}
            onPress={() => setSelectedVisitor(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeaderFlexBoxRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.cardBadgesLayoutRow}>
                  <Text style={styles.cardBadgeIdText}>{item.id}</Text>
                  <Text style={styles.cardBadgeTagMarker}>{item.badgeNumber}</Text>
                </View>
                <Text style={styles.visitorNameHeadingText}>{item.name}</Text>
                <Text style={styles.visitorPurposeSubtitleLabel}>{item.purpose}</Text>
              </View>

              <View style={[
                styles.statusStateCapsule,
                item.status === 'Checked In' ? styles.statusStateCapsuleActive : styles.statusStateCapsuleClosed
              ]}>
                <Text style={[
                  styles.statusStateCapsuleText,
                  item.status === 'Checked In' ? styles.statusActiveText : styles.statusClosedText
                ]}>
                  {item.status === 'Checked In' ? '🟢 Present' : '⚪ Departed'}
                </Text>
              </View>
            </View>

            <View style={styles.cardInternalDossierSummaryBox}>
              <Text style={styles.internalDossierLabelItem}>Host: {item.hostStaff}</Text>
            </View>

            <View style={styles.cardFooterFlowLayout}>
              <Text style={styles.footerTimeLabelText}>In: {item.checkInTime}</Text>
              {item.checkOutTime && <Text style={styles.footerTimeLabelText}>Out: {item.checkOutTime}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      {selectedVisitor && (
        <Modal transparent visible={!!selectedVisitor} animationType="fade" onRequestClose={() => setSelectedVisitor(null)}>
          <View style={styles.darkenedBlurOverlayContainer}>
            <View style={[styles.modalViewportCoreCardBody, isMobile && { margin: 12, maxHeight: '92%' }]}>
              <Text style={styles.modalMainHeadingTitleText}>Visitor Pass Record</Text>
              <Text style={styles.modalSubheadingReferenceId}>{selectedVisitor.id}</Text>

              <ScrollView style={styles.modalDossierContentScroller} showsVerticalScrollIndicator={false}>
                <Text style={styles.dossierSectionMetaLabel}>Visitor Name</Text>
                <Text style={styles.dossierSectionValueText}>{selectedVisitor.name}</Text>

                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierSectionMetaLabel}>Badge ID</Text>
                    <Text style={styles.dossierSectionValueText}>{selectedVisitor.badgeNumber}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierSectionMetaLabel}>Contact</Text>
                    <Text style={styles.dossierSectionValueText}>{selectedVisitor.contactNumber}</Text>
                  </View>
                </View>

                <Text style={styles.dossierSectionMetaLabel}>Purpose</Text>
                <Text style={styles.dossierSectionValueText}>{selectedVisitor.purpose}</Text>

                <Text style={styles.dossierSectionMetaLabel}>Host Staff</Text>
                <Text style={styles.dossierSectionValueText}>{selectedVisitor.hostStaff}</Text>

                <View style={styles.timelineBracketWrapperBlock}>
                  <Text style={styles.timelineItemStampRow}>Check-In: <Text style={{ fontWeight: '600' }}>{selectedVisitor.checkInTime}</Text></Text>
                  {selectedVisitor.checkOutTime && (
                    <Text style={styles.timelineItemStampRow}>Check-Out: <Text style={{ fontWeight: '600' }}>{selectedVisitor.checkOutTime}</Text></Text>
                  )}
                </View>

                <Text style={styles.dossierSectionMetaLabel}>Remarks</Text>
                <Text style={styles.remarksBoxBlockParagraph}>{selectedVisitor.remarks}</Text>

                {selectedVisitor.status === 'Checked In' && (
                  <TouchableOpacity
                    style={styles.instantCheckoutTriggerBtn}
                    onPress={() => handleCheckOutAction(selectedVisitor.id)}
                  >
                    <Text style={styles.instantCheckoutTriggerBtnText}>📤 Check Out Visitor</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.closeDossierViewBtn} onPress={() => setSelectedVisitor(null)}>
                <Text style={styles.closeDossierViewBtnText}>Close Record</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Check-In Modal */}
      <Modal transparent visible={isCheckInModalOpen} animationType="slide" onRequestClose={() => setIsCheckInModalOpen(false)}>
        <View style={styles.darkenedBlurOverlayContainer}>
          <View style={[styles.modalViewportCoreCardBody, isMobile && { margin: 12, maxHeight: '92%' }]}>
            <Text style={styles.modalMainHeadingTitleText}>New Visitor Entry</Text>
            <Text style={styles.modalSubheadingReferenceId}>Register guest and issue badge</Text>

            <ScrollView style={styles.formContentScrollContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.formInputLabelHeader}>Visitor Name <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput
                style={styles.formInputTextControlBox}
                placeholder="Full name"
                placeholderTextColor="#A1A1AA"
                value={form.name}
                onChangeText={(val) => setForm({ ...form, name: val })}
              />

              <Text style={styles.formInputLabelHeader}>Badge Number <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput
                style={styles.formInputTextControlBox}
                placeholder="BADGE-XXX"
                placeholderTextColor="#A1A1AA"
                value={form.badgeNumber}
                onChangeText={(val) => setForm({ ...form, badgeNumber: val })}
              />

              <Text style={styles.formInputLabelHeader}>Contact Number</Text>
              <TextInput
                style={styles.formInputTextControlBox}
                placeholder="+91 XXXXXXXXXX"
                placeholderTextColor="#A1A1AA"
                keyboardType="phone-pad"
                value={form.contactNumber}
                onChangeText={(val) => setForm({ ...form, contactNumber: val })}
              />

              <Text style={styles.formInputLabelHeader}>Purpose</Text>
              <View style={styles.formFlexGridBadgeSelectionRow}>
                {(['Parent-Teacher Meeting', 'Vendor/Contractor', 'Official Audit', 'Personal Guest'] as const).map((pType) => (
                  <TouchableOpacity
                    key={pType}
                    style={[styles.badgeSelectorItemElement, form.purpose === pType && styles.badgeSelectorItemElementActive]}
                    onPress={() => setForm({ ...form, purpose: pType })}
                  >
                    <Text style={[styles.badgeSelectorItemElementText, form.purpose === pType && styles.badgeSelectorItemElementTextActive]}>
                      {pType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formInputLabelHeader}>Host Staff <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput
                style={styles.formInputTextControlBox}
                placeholder="Host staff name & designation"
                placeholderTextColor="#A1A1AA"
                value={form.hostStaff}
                onChangeText={(val) => setForm({ ...form, hostStaff: val })}
              />

              <Text style={styles.formInputLabelHeader}>Remarks</Text>
              <TextInput
                style={[styles.formInputTextControlBox, styles.formMultiLineTextAreaElement]}
                placeholder="Additional notes..."
                placeholderTextColor="#A1A1AA"
                value={form.remarks}
                onChangeText={(val) => setForm({ ...form, remarks: val })}
                multiline
                numberOfLines={3}
              />
            </ScrollView>

            <View style={styles.formActionControlsGroupRow}>
              <TouchableOpacity style={[styles.formActionBtnBaseElement, styles.formActionBtnCancel]} onPress={() => setIsCheckInModalOpen(false)}>
                <Text style={styles.formActionBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.formActionBtnBaseElement, styles.formActionBtnSubmit]} onPress={handleCheckInSubmit}>
                <Text style={styles.formActionBtnSubmitText}>Check In Visitor</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Responsive Premium Styling for Visitor Management
const styles = StyleSheet.create({
  centerLoader: { flex: 1, backgroundColor: '#F8FAFC' },
  loaderSubtext: { marginTop: 12, color: '#64748B', fontSize: 14 },

  viewBaseArea: { flex: 1, backgroundColor: '#F8FAFC' },

  appTitleNavbarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  dashboardTitleText: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  dashboardSubtitleText: { fontSize: 13.5, color: '#64748B', marginTop: 4 },

  headerPrimaryTriggerBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  headerPrimaryTriggerBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  securityMetricsRowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  securityMetricsCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
  },
  metricsLabelMini: { fontSize: 12.5, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  metricsCounterValue: { fontSize: 26, fontWeight: '700', marginTop: 8, color: '#0F172A' },

  filterControlDeckWrapper: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  searchBarBoxInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabPillMatrixRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, gap: 8 },
  tabFilterPillItem: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 22, backgroundColor: '#F1F5F9' },
  tabFilterPillItemActive: { backgroundColor: '#0F172A' },
  tabFilterPillItemText: { fontSize: 13.5, color: '#475569', fontWeight: '500' },
  tabFilterPillItemTextActive: { color: '#FFFFFF', fontWeight: '600' },

  scrollListLayoutBody: { padding: 16, gap: 12 },
  visitorRegistryListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderFlexBoxRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardBadgesLayoutRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardBadgeIdText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  cardBadgeTagMarker: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  visitorNameHeadingText: { fontSize: 17, fontWeight: '600', color: '#0F172A', marginTop: 4 },
  visitorPurposeSubtitleLabel: { fontSize: 13.5, color: '#64748B', marginTop: 3 },
  statusStateCapsule: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  statusStateCapsuleActive: { backgroundColor: '#D1FAE5' },
  statusStateCapsuleClosed: { backgroundColor: '#F1F5F9' },
  statusStateCapsuleText: { fontSize: 12.5, fontWeight: '600' },
  statusActiveText: { color: '#065F46' },
  statusClosedText: { color: '#475569' },
  cardInternalDossierSummaryBox: { marginTop: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 10 },
  internalDossierLabelItem: { fontSize: 13, color: '#475569' },
  cardFooterFlowLayout: { flexDirection: 'row', gap: 16, marginTop: 12 },
  footerTimeLabelText: { fontSize: 13, color: '#64748B' },

  emptyFeedPlaceholder: { alignItems: 'center', paddingVertical: 80 },
  emptyFeedPlaceholderText: { fontSize: 15, color: '#94A3B8' },

  darkenedBlurOverlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalViewportCoreCardBody: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
  },
  modalMainHeadingTitleText: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  modalSubheadingReferenceId: { fontSize: 13.5, color: '#10B981', marginTop: 4 },

  modalDossierContentScroller: { marginVertical: 12 },
  dossierSectionMetaLabel: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginTop: 16 },
  dossierSectionValueText: { fontSize: 16.5, color: '#0F172A', marginTop: 4 },

  timelineBracketWrapperBlock: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, marginTop: 16 },
  timelineItemStampRow: { fontSize: 13.5, color: '#475569', marginBottom: 6 },

  remarksBoxBlockParagraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },

  instantCheckoutTriggerBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  instantCheckoutTriggerBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  closeDossierViewBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  closeDossierViewBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  formContentScrollContainer: { flex: 1 },
  formInputLabelHeader: { fontSize: 13.5, fontWeight: '600', color: '#475569', marginTop: 14, marginBottom: 6 },
  formInputTextControlBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  formFlexGridBadgeSelectionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  badgeSelectorItemElement: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  badgeSelectorItemElementActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  badgeSelectorItemElementText: { fontSize: 13, color: '#475569' },
  badgeSelectorItemElementTextActive: { color: '#FFFFFF', fontWeight: '600' },
  formMultiLineTextAreaElement: { height: 100, textAlignVertical: 'top' },

  formActionControlsGroupRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  formActionBtnBaseElement: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  formActionBtnCancel: { backgroundColor: '#F1F5F9' },
  formActionBtnSubmit: { backgroundColor: '#10B981' },
  formActionBtnCancelText: { color: '#475569', fontWeight: '600', fontSize: 15 },
  formActionBtnSubmitText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});