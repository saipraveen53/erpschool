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
  KeyboardAvoidingView
} from 'react-native';

export interface InquiryRecord {
  id: string;
  date: string;
  prospectName: string;
  phone: string;
  email: string;
  type: 'General' | 'Admission' | 'Fees' | 'Transport';
  source: 'Walk-In' | 'Website' | 'Phone Call';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  details: string;
  resolutionNotes?: string;
}

const MOCK_INQUIRIES: InquiryRecord[] = [
  {
    id: 'INQ-2026-001',
    date: '2026-05-29',
    prospectName: 'Meenakshi Iyer',
    phone: '+91 94440 12345',
    email: 'meenakshi.iyer@example.com',
    type: 'Admission',
    source: 'Walk-In',
    priority: 'High',
    status: 'Open',
    details: 'Seeking immediate mid-term admission availability for Grade 8. Needs details regarding syllabus alignment and second language choices.',
  },
  {
    id: 'INQ-2026-002',
    date: '2026-05-29',
    prospectName: 'Kapil Dev Malhotra',
    phone: '+91 98100 55667',
    email: 'kdm.malhotra@example.com',
    type: 'Fees',
    source: 'Phone Call',
    priority: 'Medium',
    status: 'In Progress',
    details: 'Inquiring if corporate installments or quarterly fee structures apply for long-term sibling admissions.',
  },
  {
    id: 'INQ-2026-003',
    date: '2026-05-28',
    prospectName: 'Sunita Deshmukh',
    phone: '+91 88888 44321',
    email: 'sunita.d@example.com',
    type: 'Transport',
    source: 'Website',
    priority: 'Low',
    status: 'Resolved',
    details: 'Verifying if school transport services stretch beyond the current city limits to the technological park zone.',
    resolutionNotes: 'Route manager mapped coordinate lines. Confirmed bus pickup point alternate route 12 stands operational nearby.',
  },
];

export default function InquiriesLog() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [isMounted, setIsMounted] = useState(false);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(MOCK_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form, setForm] = useState({
    prospectName: '',
    phone: '',
    email: '',
    type: 'Admission' as InquiryRecord['type'],
    source: 'Walk-In' as InquiryRecord['source'],
    priority: 'Medium' as InquiryRecord['priority'],
    details: '',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const crmMetrics = useMemo(() => {
    return inquiries.reduce(
      (acc, curr) => {
        acc.total++;
        if (curr.status === 'Open') acc.open++;
        if (curr.status === 'In Progress') acc.progress++;
        if (curr.status === 'Resolved') acc.resolved++;
        return acc;
      },
      { total: 0, open: 0, progress: 0, resolved: 0 }
    );
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesSearch =
        item.prospectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchQuery, statusFilter]);

  const handleCreateInquiry = () => {
    if (!form.prospectName.trim() || !form.phone.trim() || !form.details.trim()) {
      Alert.alert('Validation Warning', 'Please fill Applicant Name, Phone Contact, and Context Description.');
      return;
    }

    const newInquiry: InquiryRecord = {
      id: `INQ-2026-0${inquiries.length + 4}`,
      date: new Date().toISOString().split('T')[0],
      prospectName: form.prospectName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || 'N/A',
      type: form.type,
      source: form.source,
      priority: form.priority,
      status: 'Open',
      details: form.details.trim(),
    };

    setInquiries([newInquiry, ...inquiries]);
    setForm({
      prospectName: '',
      phone: '',
      email: '',
      type: 'Admission',
      source: 'Walk-In',
      priority: 'Medium',
      details: '',
    });
    setIsCreateModalOpen(false);
  };

  const updateInquiryStatus = (id: string, nextStatus: InquiryRecord['status'], resolutionText?: string) => {
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: nextStatus, resolutionNotes: resolutionText || item.resolutionNotes }
          : item
      )
    );
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) =>
        prev ? { ...prev, status: nextStatus, resolutionNotes: resolutionText || prev.resolutionNotes } : null
      );
    }
  };

  if (!isMounted) {
    return (
      <SafeAreaView style={[styles.fallbackContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.fallbackText}>Loading Prospect Inquiries Log...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.viewRootContainer}>
      {/* Header */}
      <View style={styles.topHeaderPanel}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandTitleText}>Prospect Inquiries Log</Text>
          <Text style={styles.brandSubtitleText}>Track walk-in applications, route admission queries, and update resolution states.</Text>
        </View>
        <TouchableOpacity
          style={styles.headerPrimaryAction}
          onPress={() => setIsCreateModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.headerPrimaryActionText}>+ Create New Inquiry</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics */}
      <View style={styles.metricsSummaryRow}>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#64748B' }]}>
          <Text style={styles.metricLabelText}>TOTAL LOGGED</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.total}</Text>
        </View>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#EF4444' }]}>
          <Text style={styles.metricLabelText}>OPEN PIPELINE</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.open}</Text>
        </View>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#3B82F6' }]}>
          <Text style={styles.metricLabelText}>IN PROGRESS</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.progress}</Text>
        </View>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.metricLabelText}>RESOLVED</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.resolved}</Text>
        </View>
      </View>

      {/* Search & Filters */}
      <View style={styles.controlFilteringBox}>
        <TextInput
          style={styles.globalSearchBox}
          placeholder="Search by prospect name, query ID, or type..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabFilterPillsWrapper}>
          {[
            { title: 'All Inquiries', key: 'All' },
            { title: 'Open Pipeline', key: 'Open' },
            { title: 'Under Processing', key: 'In Progress' },
            { title: 'Closed / Resolved', key: 'Resolved' },
          ].map((tab) => {
            const currentSelected = statusFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterPillItem, currentSelected && styles.filterPillItemActive]}
                onPress={() => setStatusFilter(tab.key)}
              >
                <Text style={[styles.filterPillText, currentSelected && styles.filterPillTextActive]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredInquiries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainerLayout}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyStateContainerBox}>
            <Text style={styles.emptyStateMsg}>No inquiries found matching your filters.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dataLogItemCard}
            onPress={() => setSelectedInquiry(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeaderFlexRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.metaRowBadging}>
                  <Text style={styles.cardRecordId}>{item.id}</Text>
                  <Text style={styles.cardTypeLabel}>{item.type}</Text>
                </View>
                <Text style={styles.prospectNameHeading}>{item.prospectName}</Text>
              </View>

              <View style={[
                styles.cardStatusCapsule,
                item.status === 'Open' && styles.capsuleOpenState,
                item.status === 'In Progress' && styles.capsuleProgressState,
                item.status === 'Resolved' && styles.capsuleResolvedState,
              ]}>
                <Text style={[
                  styles.cardStatusCapsuleText,
                  item.status === 'Open' && styles.textOpenState,
                  item.status === 'In Progress' && styles.textProgressState,
                  item.status === 'Resolved' && styles.textResolvedState,
                ]}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.cardBodyExcerptText} numberOfLines={2}>{item.details}</Text>

            <View style={styles.cardFooterLayoutFlex}>
              <Text style={styles.footerMetaLabel}>📅 {item.date}</Text>
              <Text style={styles.footerMetaLabel}>🔗 {item.source}</Text>
              <Text style={styles.footerMetaLabel}>📞 {item.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      {selectedInquiry && (
        <Modal transparent visible={!!selectedInquiry} animationType="fade" onRequestClose={() => setSelectedInquiry(null)}>
          <View style={styles.glassviewOverlayScreen}>
            <View style={[styles.modalBodyCardLayout, isMobile && { margin: 12, width: '94%', maxHeight: '92%' }]}>
              <Text style={styles.modalMainHeaderTitle}>Inquiry Details</Text>
              <Text style={styles.modalMainHeaderSubtitle}>{selectedInquiry.id}</Text>

              <ScrollView style={styles.modalFormScrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.dossierFieldLabel}>Prospect Name</Text>
                <Text style={styles.dossierFieldValue}>{selectedInquiry.prospectName}</Text>

                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Phone</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.phone}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Email</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.email}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Type</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.type}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Source</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.source}</Text>
                  </View>
                </View>

                <Text style={styles.dossierFieldLabel}>Details</Text>
                <Text style={styles.dossierTextAreaDisplay}>{selectedInquiry.details}</Text>

                {selectedInquiry.resolutionNotes && (
                  <>
                    <Text style={styles.dossierFieldLabel}>Resolution Notes</Text>
                    <Text style={styles.dossierTextAreaDisplay}>{selectedInquiry.resolutionNotes}</Text>
                  </>
                )}

                {selectedInquiry.status !== 'Resolved' && (
                  <View style={styles.resolutionActionsBlock}>
                    <Text style={styles.resolutionActionsBlockLabel}>Update Status</Text>
                    <View style={styles.resolutionButtonLayoutGroupRow}>
                      {selectedInquiry.status === 'Open' && (
                        <TouchableOpacity
                          style={[styles.workflowActionButtonItem, { backgroundColor: '#DBEAFE' }]}
                          onPress={() => updateInquiryStatus(selectedInquiry.id, 'In Progress')}
                        >
                          <Text style={{ color: '#1E40AF', fontWeight: '600' }}>Mark In Progress</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[styles.workflowActionButtonItem, { backgroundColor: '#D1FAE5' }]}
                        onPress={() => {
                          const notes = prompt('Enter resolution notes:');
                          if (notes !== null) {
                            updateInquiryStatus(selectedInquiry.id, 'Resolved', notes);
                          }
                        }}
                      >
                        <Text style={{ color: '#065F46', fontWeight: '600' }}>Mark Resolved</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.dismissDetailsModalBtn} onPress={() => setSelectedInquiry(null)}>
                <Text style={styles.dismissDetailsModalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Create Modal - Enhanced for Android & Web */}
   <Modal
  transparent
  visible={isCreateModalOpen}
  animationType="slide"
  onRequestClose={() => setIsCreateModalOpen(false)}
>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <View style={styles.glassviewOverlayScreen}>
      <View
        style={[
          styles.modalBodyCardLayout,
          {
            width: '95%',
            maxHeight: '95%',
          },
        ]}
      >
        <Text style={styles.modalMainHeaderTitle}>New Inquiry</Text>
        <Text style={styles.modalMainHeaderSubtitle}>
          Record a new prospect inquiry
        </Text>

     <ScrollView
  style={{ width: '100%' }}
  contentContainerStyle={{
    paddingBottom: 30,
  }}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
          <Text style={styles.formFieldLabelText}>
            Prospect Name <Text style={{ color: '#EF4444' }}>*</Text>
          </Text>

          <TextInput
            style={styles.formInputBoxControl}
            placeholder="Full Name"
            value={form.prospectName}
            onChangeText={(text) =>
              setForm((prev) => ({
                ...prev,
                prospectName: text,
              }))
            }
            returnKeyType="next"
          />

          <Text style={styles.formFieldLabelText}>
            Phone <Text style={{ color: '#EF4444' }}>*</Text>
          </Text>

          <TextInput
            style={styles.formInputBoxControl}
            placeholder="+91 XXXXXXXXXX"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) =>
              setForm((prev) => ({
                ...prev,
                phone: text,
              }))
            }
          />

          <Text style={styles.formFieldLabelText}>Email</Text>

          <TextInput
            style={styles.formInputBoxControl}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) =>
              setForm((prev) => ({
                ...prev,
                email: text,
              }))
            }
          />

          <Text style={styles.formFieldLabelText}>Inquiry Type</Text>

          <View style={styles.customPickerRowLayout}>
            {(['Admission', 'Fees', 'Transport', 'General'] as const).map(
              (category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.customPickerItemBadge,
                    form.type === category &&
                      styles.customPickerItemActive,
                  ]}
                  onPress={() =>
                    setForm((prev) => ({
                      ...prev,
                      type: category,
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.customPickerItemText,
                      form.type === category &&
                        styles.customPickerItemTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <Text style={styles.formFieldLabelText}>Priority</Text>

          <View style={styles.customPickerRowLayout}>
            {(['High', 'Medium', 'Low'] as const).map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.customPickerItemBadge,
                  form.priority === priority &&
                    styles.customPickerItemActive,
                ]}
                onPress={() =>
                  setForm((prev) => ({
                    ...prev,
                    priority,
                  }))
                }
              >
                <Text
                  style={[
                    styles.customPickerItemText,
                    form.priority === priority &&
                      styles.customPickerItemTextActive,
                  ]}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formFieldLabelText}>
            Details <Text style={{ color: '#EF4444' }}>*</Text>
          </Text>

          <TextInput
            style={[
              styles.formInputBoxControl,
              styles.formMultiLineTextBoxElement,
            ]}
            placeholder="Describe the inquiry..."
            multiline
            textAlignVertical="top"
            value={form.details}
            onChangeText={(text) =>
              setForm((prev) => ({
                ...prev,
                details: text,
              }))
            }
          />
        </ScrollView>

        <View style={styles.formActionLayoutButtonsGroup}>
          <TouchableOpacity
            style={[
              styles.formActionBtnBase,
              styles.formActionBtnCancel,
            ]}
            onPress={() => setIsCreateModalOpen(false)}
          >
            <Text style={styles.formActionBtnTextCancel}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.formActionBtnBase,
              styles.formActionBtnSubmit,
            ]}
            onPress={handleCreateInquiry}
          >
            <Text style={styles.formActionBtnTextSubmit}>
              Create Inquiry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </KeyboardAvoidingView>
</Modal>
    </SafeAreaView>
  );
}

// Responsive Premium Styling
const styles = StyleSheet.create({
  fallbackContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  fallbackText: { marginTop: 12, color: '#64748B', fontSize: 14 },

  viewRootContainer: { flex: 1, backgroundColor: '#F8FAFC' },

  topHeaderPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  brandTitleText: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  brandSubtitleText: { fontSize: 13, color: '#64748B', marginTop: 4 },

  headerPrimaryAction: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  headerPrimaryActionText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14.5 },

  metricsSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  metricDisplayCard: {
    flex: 1,
    minWidth: 135,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
  },
  metricLabelText: { fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  metricValueNumber: { fontSize: 26, fontWeight: '700', marginTop: 8, color: '#0F172A' },

  controlFilteringBox: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  globalSearchBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabFilterPillsWrapper: { flexDirection: 'row', marginTop: 12 },
  filterPillItem: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8 },
  filterPillItemActive: { backgroundColor: '#0F172A' },
  filterPillText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterPillTextActive: { color: '#FFFFFF', fontWeight: '600' },

  listContainerLayout: { padding: 16, gap: 12 },
  dataLogItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderFlexRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaRowBadging: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardRecordId: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  cardTypeLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  prospectNameHeading: { fontSize: 17, fontWeight: '600', color: '#0F172A', marginTop: 4 },
  cardStatusCapsule: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  capsuleOpenState: { backgroundColor: '#FEE2E2' },
  capsuleProgressState: { backgroundColor: '#DBEAFE' },
  capsuleResolvedState: { backgroundColor: '#D1FAE5' },
  cardStatusCapsuleText: { fontSize: 12.5, fontWeight: '600' },
  textOpenState: { color: '#B91C1C' },
  textProgressState: { color: '#1D4ED8' },
  textResolvedState: { color: '#047857' },
  cardBodyExcerptText: { fontSize: 14, color: '#475569', marginTop: 12, lineHeight: 20 },
  cardFooterLayoutFlex: { flexDirection: 'row', gap: 16, marginTop: 12, flexWrap: 'wrap' },
  footerMetaLabel: { fontSize: 13, color: '#64748B' },

  emptyStateContainerBox: { alignItems: 'center', paddingVertical: 80 },
  emptyStateMsg: { fontSize: 15, color: '#94A3B8', textAlign: 'center' },

  glassviewOverlayScreen: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
modalBodyCardLayout: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  padding: 20,
  width: '95%',
  maxWidth: 520,
  maxHeight: '95%',
},
  modalMainHeaderTitle: { fontSize: 21, fontWeight: '700', color: '#0F172A' },
  modalMainHeaderSubtitle: { fontSize: 13.5, color: '#F59E0B', marginTop: 4 },

  modalFormScrollContainer: { marginVertical: 12 },
  dossierFieldLabel: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginTop: 16 },
  dossierFieldValue: { fontSize: 16, color: '#1E293B', marginTop: 4 },
  dossierTextAreaDisplay: {
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

  resolutionActionsBlock: { marginTop: 20, padding: 16, backgroundColor: '#FEFCE8', borderRadius: 12, borderWidth: 1, borderColor: '#FDE047' },
  resolutionActionsBlockLabel: { fontSize: 13.5, fontWeight: '600', color: '#854D0E', marginBottom: 12 },
  resolutionButtonLayoutGroupRow: { flexDirection: 'row', gap: 12 },

  workflowActionButtonItem: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },

  dismissDetailsModalBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  dismissDetailsModalBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

 formViewScrollBodyArea: {
  flexGrow: 1,
},
  formFieldLabelText: { fontSize: 13.5, fontWeight: '600', color: '#475569', marginTop: 14, marginBottom: 6 },
  formInputBoxControl: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  customPickerRowLayout: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  customPickerItemBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FEFCE8',
  },
  customPickerItemActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  customPickerItemText: { fontSize: 13, color: '#854D0E' },
  customPickerItemTextActive: { color: '#FFFFFF', fontWeight: '600' },
formMultiLineTextBoxElement: {
  minHeight: 120,
  textAlignVertical: 'top',
},
  formActionLayoutButtonsGroup: { flexDirection: 'row', gap: 12, marginTop: 24 },
  formActionBtnBase: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  formActionBtnCancel: { backgroundColor: '#F1F5F9' },
  formActionBtnSubmit: { backgroundColor: '#F59E0B' },
  formActionBtnTextCancel: { color: '#475569', fontWeight: '600', fontSize: 15 },
  formActionBtnTextSubmit: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});