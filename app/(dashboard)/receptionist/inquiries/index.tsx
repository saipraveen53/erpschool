 
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
  ActivityIndicator
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
  const [isMounted, setIsMounted] = useState(false);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(MOCK_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal contexts
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State parameters
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

  // Compute CRM pipeline metrics
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

  // Handle advanced search and filtration logic
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
      alert('Validation Warning: Please fill inside fields for Applicant Name, Phone Contact, and Context Description.');
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
        <Text style={styles.fallbackText}>Loading Front-Desk Inquiry Logs...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.viewRootContainer}>
      {/* 1. Header Navbar Component */}
      <View style={styles.topHeaderPanel}>
        <View>
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

      {/* 2. Analytical Counter Rows */}
      <View style={styles.metricsSummaryRow}>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#64748B' }]}>
          <Text style={styles.metricLabelText}>Total Logged</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.total}</Text>
        </View>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#EF4444' }]}>
          <Text style={styles.metricLabelText}>Unassigned / Open</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.open}</Text>
        </View>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#3B82F6' }]}>
          <Text style={styles.metricLabelText}>In Progress</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.progress}</Text>
        </View>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.metricLabelText}>Resolved Tickets</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.resolved}</Text>
        </View>
      </View>

      {/* 3. Filtering Control Framework */}
      <View style={styles.controlFilteringBox}>
        <TextInput
          style={styles.globalSearchBox}
          placeholder="Search by prospect name, query ID, or operational division..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.tabFilterPillsWrapper}>
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
        </View>
      </View>

      {/* 4. Core Informational Records Feed */}
      <FlatList
        data={filteredInquiries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainerLayout}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyStateContainerBox}>
            <Text style={styles.emptyStateMsg}>No candidate inquiries found matching standard query configurations.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dataLogItemCard}
            onPress={() => setSelectedInquiry(item)}
            activeOpacity={0.75}
          >
            <View style={styles.cardHeaderFlexRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.metaRowBadging}>
                  <Text style={styles.cardRecordId}>{item.id}</Text>
                  <Text style={styles.metaDividerDot}>•</Text>
                  <Text style={styles.cardTypeLabel}>{item.type} Ticket</Text>
                  <Text style={styles.metaDividerDot}>•</Text>
                  <Text style={[
                    styles.priorityLabelFlag,
                    item.priority === 'High' && { color: '#EF4444' },
                    item.priority === 'Medium' && { color: '#F59E0B' },
                    item.priority === 'Low' && { color: '#10B981' }
                  ]}>{item.priority} Priority</Text>
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

            <View style={styles.cardRowSeparator} />

            <View style={styles.cardFooterLayoutFlex}>
              <Text style={styles.footerMetaLabel}>📅 Logged: {item.date}</Text>
              <Text style={styles.footerMetaLabel}>🔗 Channel: {item.source}</Text>
              <Text style={styles.footerMetaLabel}>📞 {item.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* 5. MODAL: Insight Detail Inspection Window */}
      {selectedInquiry && (
        <Modal transparent visible={!!selectedInquiry} animationType="fade" onRequestClose={() => setSelectedInquiry(null)}>
          <View style={styles.glassviewOverlayScreen}>
            <View style={styles.modalBodyCardLayout}>
              <View style={styles.modalHeadingBlock}>
                <Text style={styles.modalMainHeaderTitle}>Inquiry Dossier Detail</Text>
                <Text style={styles.modalMainHeaderSubtitle}>Reference Code Node ID: {selectedInquiry.id}</Text>
              </View>

              <ScrollView style={styles.modalFormScrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.dossierFieldLabel}>Prospect Name</Text>
                <Text style={styles.dossierFieldValue}>{selectedInquiry.prospectName}</Text>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Phone Contact</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.phone}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Email Address</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.email}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Inquiry Classification</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.type}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Source Channel</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.source}</Text>
                  </View>
                </View>

                <Text style={styles.dossierFieldLabel}>Core Request Context Details</Text>
                <Text style={styles.dossierTextAreaDisplay}>{selectedInquiry.details}</Text>

                {selectedInquiry.resolutionNotes && (
                  <>
                    <Text style={styles.dossierFieldLabel}>Administrative Resolution Log Notes</Text>
                    <Text style={[styles.dossierTextAreaDisplay, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                      {selectedInquiry.resolutionNotes}
                    </Text>
                  </>
                )}

                {selectedInquiry.status !== 'Resolved' && (
                  <View style={styles.resolutionActionsBlock}>
                    <Text style={styles.resolutionActionsBlockLabel}>Update Process Workflow State:</Text>
                    <View style={styles.resolutionButtonLayoutGroupRow}>
                      {selectedInquiry.status === 'Open' && (
                        <TouchableOpacity
                          style={[styles.workflowActionButtonItem, { backgroundColor: '#DBEAFE' }]}
                          onPress={() => updateInquiryStatus(selectedInquiry.id, 'In Progress')}
                        >
                          <Text style={{ color: '#1E40AF', fontWeight: '600', fontSize: 13 }}>Trigger In-Progress</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[styles.workflowActionButtonItem, { backgroundColor: '#D1FAE5' }]}
                        onPress={() => {
                          const notes = prompt('Enter resolution fulfillment confirmation notes:');
                          if (notes !== null) {
                            updateInquiryStatus(selectedInquiry.id, 'Resolved', notes || 'Resolved by front desk receptionist office.');
                          }
                        }}
                      >
                        <Text style={{ color: '#065F46', fontWeight: '600', fontSize: 13 }}>Close & Mark Resolved</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.dismissDetailsModalBtn} onPress={() => setSelectedInquiry(null)}>
                <Text style={styles.dismissDetailsModalBtnText}>Dismiss Record View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* 6. MODAL: Create New Inquiry Registry Record Form */}
      <Modal transparent visible={isCreateModalOpen} animationType="slide" onRequestClose={() => setIsCreateModalOpen(false)}>
        <View style={styles.glassviewOverlayScreen}>
          <View style={styles.modalBodyCardLayout}>
            <Text style={styles.modalMainHeaderTitle}>Log New Prospect Inquiry</Text>
            <Text style={styles.modalMainHeaderSubtitle}>Populate lead metrics information parameters securely.</Text>

            <ScrollView style={styles.formViewScrollBodyArea} showsVerticalScrollIndicator={false}>
              <Text style={styles.formFieldLabelText}>Prospect/Parent Full Name <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput
                style={styles.formInputBoxControl}
                placeholder="First and last structural name parameters"
                placeholderTextColor="#A1A1AA"
                value={form.prospectName}
                onChangeText={(val) => setForm({ ...form, prospectName: val })}
              />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formFieldLabelText}>Contact Phone Line <Text style={{color:'#EF4444'}}>*</Text></Text>
                  <TextInput
                    style={styles.formInputBoxControl}
                    placeholder="e.g. +91 99999 88888"
                    placeholderTextColor="#A1A1AA"
                    keyboardType="phone-pad"
                    value={form.phone}
                    onChangeText={(val) => setForm({ ...form, phone: val })}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formFieldLabelText}>Email Address Address</Text>
                  <TextInput
                    style={styles.formInputBoxControl}
                    placeholder="name@example.com"
                    placeholderTextColor="#A1A1AA"
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(val) => setForm({ ...form, email: val })}
                  />
                </View>
              </View>

              <Text style={styles.formFieldLabelText}>Inquiry Category Node Classification</Text>
              <View style={styles.customPickerRowLayout}>
                {(['Admission', 'Fees', 'Transport', 'General'] as InquiryRecord['type'][]).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.customPickerItemBadge, form.type === category && styles.customPickerItemActive]}
                    onPress={() => setForm({ ...form, type: category })}
                  >
                    <Text style={[styles.customPickerItemText, form.type === category && styles.customPickerItemTextActive]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Text style={styles.formFieldLabelText}>Lead Media Source</Text>
                  <select
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value as any })}
                    style={webSelectStyle}
                  >
                    <option value="Walk-In">🚶 Walk-In</option>
                    <option value="Phone Call">📞 Phone Call</option>
                    <option value="Website">🌐 Website</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <Text style={styles.formFieldLabelText}>Urgency Core Priority</Text>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    style={webSelectStyle}
                  >
                    <option value="Low">🟢 Low Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="High">🔴 High Priority</option>
                  </select>
                </div>
              </View>

              <Text style={styles.formFieldLabelText}>Inquiry Context Scope & Details <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput
                style={[styles.formInputBoxControl, styles.formMultiLineTextBoxElement]}
                placeholder="Log precise student context or questions items requested..."
                placeholderTextColor="#A1A1AA"
                value={form.details}
                onChangeText={(val) => setForm({ ...form, details: val })}
                multiline
                numberOfLines={4}
              />
            </ScrollView>

            <View style={styles.formActionLayoutButtonsGroup}>
              <TouchableOpacity style={[styles.formActionBtnBase, styles.formActionBtnCancel]} onPress={() => setIsCreateModalOpen(false)}>
                <Text style={styles.formActionBtnTextCancel}>Discard Draft</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.formActionBtnBase, styles.formActionBtnSubmit]} onPress={handleCreateInquiry}>
                <Text style={styles.formActionBtnTextSubmit}>Register Entry Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Inline pure style object definition for Cross-Platform Web elements representation
const webSelectStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #CBD5E1',
  backgroundColor: '#FFFFFF',
  color: '#1E293B',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
};

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  fallbackText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  viewRootContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeaderPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  brandTitleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandSubtitleText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  headerPrimaryAction: {
    backgroundColor: '#F59E0B', // Warm corporate amber tone layout configuration accent
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  headerPrimaryActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  metricsSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  metricDisplayCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  metricLabelText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValueNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 6,
  },
  controlFilteringBox: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  globalSearchBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabFilterPillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    gap: 8,
  },
  filterPillItem: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterPillItemActive: {
    backgroundColor: '#0F172A',
  },
  filterPillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContainerLayout: {
    padding: 20,
    gap: 14,
  },
  dataLogItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderFlexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaRowBadging: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardRecordId: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  metaDividerDot: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cardTypeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  priorityLabelFlag: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  prospectNameHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  cardStatusCapsule: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  capsuleOpenState: { backgroundColor: '#FEE2E2' },
  capsuleProgressState: { backgroundColor: '#DBEAFE' },
  capsuleResolvedState: { backgroundColor: '#D1FAE5' },
  cardStatusCapsuleText: { fontSize: 11, fontWeight: '600' },
  textOpenState: { color: '#991B1B' },
  textProgressState: { color: '#1E40AF' },
  textResolvedState: { color: '#065F46' },
  cardBodyExcerptText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginTop: 10,
  },
  cardRowSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  cardFooterLayoutFlex: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
  },
  footerMetaLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyStateContainerBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateMsg: {
    fontSize: 14,
    color: '#94A3B8',
  },
  glassviewOverlayScreen: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBodyCardLayout: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 520,
    maxHeight: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeadingBlock: {
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 12,
    marginBottom: 8,
  },
  modalMainHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalMainHeaderSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  modalFormScrollContainer: {
    marginVertical: 4,
  },
  dossierFieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginTop: 12,
  },
  dossierFieldValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    marginTop: 3,
  },
  dossierTextAreaDisplay: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginTop: 4,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resolutionActionsBlock: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resolutionActionsBlockLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  resolutionButtonLayoutGroupRow: {
    flexDirection: 'row',
    gap: 10,
  },
  workflowActionButtonItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  dismissDetailsModalBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  dismissDetailsModalBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  formViewScrollBodyArea: {
    flex: 1,
  },
  formFieldLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 12,
    marginBottom: 6,
  },
  formInputBoxControl: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  customPickerRowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  customPickerItemBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  customPickerItemActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  customPickerItemText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  customPickerItemTextActive: {
    color: '#B45309',
    fontWeight: '600',
  },
  formMultiLineTextBoxElement: {
    height: 90,
    textAlignVertical: 'top',
  },
  formActionLayoutButtonsGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  formActionBtnBase: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  formActionBtnCancel: {
    backgroundColor: '#F1F5F9',
  },
  formActionBtnSubmit: {
    backgroundColor: '#F59E0B',
  },
  formActionBtnTextCancel: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  formActionBtnTextSubmit: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});