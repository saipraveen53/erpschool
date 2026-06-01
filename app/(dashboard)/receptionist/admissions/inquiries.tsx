import React, { useState, useMemo } from 'react';
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
  useWindowDimensions,
  Alert,
  KeyboardAvoidingView
} from 'react-native';

export interface Inquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  gradeOfInterest: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  notes: string;
}

const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-2026-001',
    studentName: 'Aarav Sharma',
    parentName: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@email.com',
    gradeOfInterest: 'Grade 5',
    date: '2026-05-28',
    status: 'Pending',
    notes: 'Inquired about curriculum frameworks, extracurricular activities, and school transport options.',
  },
  {
    id: 'INQ-2026-002',
    studentName: 'Ananya Iyer',
    parentName: 'Meenakshi Iyer',
    phone: '+91 87654 32109',
    email: 'meenakshi.i@email.com',
    gradeOfInterest: 'Grade 11 (Science)',
    date: '2026-05-25',
    status: 'In Progress',
    notes: 'Inquired about scholarship cutoff percentages and laboratory facilities.',
  },
  {
    id: 'INQ-2026-003',
    studentName: 'Kabir Verma',
    parentName: 'Amit Verma',
    phone: '+91 76543 21098',
    email: 'amit.verma@email.com',
    gradeOfInterest: 'Kindergarten',
    date: '2026-05-20',
    status: 'Resolved',
    notes: 'Admission documentation finalized and fee receipt generated.',
  },
];

export default function InquiriesScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form, setForm] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    gradeOfInterest: '',
    notes: '',
  });

  const metrics = useMemo(() => {
    return inquiries.reduce(
      (acc, curr) => {
        acc.total++;
        if (curr.status === 'Pending') acc.pending++;
        if (curr.status === 'In Progress') acc.inProgress++;
        if (curr.status === 'Resolved') acc.resolved++;
        return acc;
      },
      { total: 0, pending: 0, inProgress: 0, resolved: 0 }
    );
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.studentName.toLowerCase().includes(query) ||
        item.parentName.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);
      
      const matchesStatus = activeFilter === 'All' || item.status === activeFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchQuery, activeFilter]);

  const handleCreateInquiry = () => {
    if (!form.studentName.trim() || !form.parentName.trim() || !form.phone.trim()) {
      Alert.alert('Error', 'Please complete all required fields (*).');
      return;
    }

    const nextIdNumber = inquiries.length + 1;
    const paddedId = String(nextIdNumber).padStart(3, '0');

    const newEntry: Inquiry = {
      id: `INQ-2026-${paddedId}`,
      studentName: form.studentName.trim(),
      parentName: form.parentName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      gradeOfInterest: form.gradeOfInterest.trim() || 'Unspecified',
      notes: form.notes.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    setInquiries([newEntry, ...inquiries]);
    setForm({ studentName: '', parentName: '', phone: '', email: '', gradeOfInterest: '', notes: '' });
    setIsCreateModalOpen(false);
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.topNavbar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandTitle}>Admission Inquiries</Text>
          <Text style={styles.brandSubtitle}>Reception Desk & Prospect Management Dashboard</Text>
        </View>
        <TouchableOpacity 
          style={styles.primaryActionButton} 
          onPress={() => setIsCreateModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryActionButtonText}>+ Log New Inquiry</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.analyticsRow}>
        <View style={[styles.metricCard, styles.borderLeftTotal]}>
          <Text style={styles.metricLabel}>TOTAL VOLUME</Text>
          <Text style={styles.metricValue}>{metrics.total}</Text>
        </View>
        <View style={[styles.metricCard, styles.borderLeftPending]}>
          <Text style={styles.metricLabel}>PENDING</Text>
          <Text style={[styles.metricValue, { color: '#F59E0B' }]}>{metrics.pending}</Text>
        </View>
        <View style={[styles.metricCard, styles.borderLeftProgress]}>
          <Text style={styles.metricLabel}>IN PROGRESS</Text>
          <Text style={[styles.metricValue, { color: '#3B82F6' }]}>{metrics.inProgress}</Text>
        </View>
        <View style={[styles.metricCard, styles.borderLeftResolved]}>
          <Text style={styles.metricLabel}>RESOLVED</Text>
          <Text style={[styles.metricValue, { color: '#10B981' }]}>{metrics.resolved}</Text>
        </View>
      </View>

      <View style={styles.controlContainer}>
        <TextInput
          style={styles.searchInputElement}
          placeholder="Search by Inquiry ID, Student, or Parent name..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabsWrapper}>
          {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => {
            const isSelected = activeFilter === status;
            return (
              <TouchableOpacity
                key={status}
                style={[styles.tabItem, isSelected && styles.tabItemActive]}
                onPress={() => setActiveFilter(status)}
              >
                <Text style={[styles.tabItemText, isSelected && styles.tabItemTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredInquiries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainerStyles}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.dataCard} 
            onPress={() => setSelectedInquiry(item)}
            activeOpacity={0.8}
          >
            <View style={styles.dataCardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardIdBadge}>{item.id}</Text>
                <Text style={styles.cardStudentName}>{item.studentName}</Text>
                <Text style={styles.cardParentLabel}>Parent: {item.parentName}</Text>
              </View>
              <View style={[
                styles.badgeContainer, 
                item.status === 'Pending' && styles.badgePending,
                item.status === 'In Progress' && styles.badgeProgress,
                item.status === 'Resolved' && styles.badgeResolved,
              ]}>
                <Text style={[
                  styles.badgeText,
                  item.status === 'Pending' && styles.textPending,
                  item.status === 'In Progress' && styles.textProgress,
                  item.status === 'Resolved' && styles.textResolved,
                ]}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.dataCardFooter}>
              <Text style={styles.footerMetaItem}>🎯 {item.gradeOfInterest}</Text>
              <Text style={styles.footerMetaItem}>📅 {item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      <Modal transparent visible={!!selectedInquiry} animationType="fade" onRequestClose={() => setSelectedInquiry(null)}>
        <View style={styles.overlayGlass}>
          <View style={[styles.modalBaseCard, isMobile && { margin: 12, width: '94%', maxHeight: '92%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeadingText}>Inquiry Details</Text>
              <Text style={styles.modalSubheadingText}>{selectedInquiry?.id}</Text>
            </View>
            <ScrollView style={styles.modalScrollBody}>
              <Text style={styles.fieldLabel}>Prospective Student</Text>
              <Text style={styles.fieldValue}>{selectedInquiry?.studentName}</Text>
              <Text style={styles.fieldLabel}>Primary Parent/Guardian</Text>
              <Text style={styles.fieldValue}>{selectedInquiry?.parentName}</Text>
              <Text style={styles.fieldLabel}>Telephone Channel</Text>
              <Text style={styles.fieldValue}>{selectedInquiry?.phone}</Text>
              <Text style={styles.fieldLabel}>Email Endpoint</Text>
              <Text style={styles.fieldValue}>{selectedInquiry?.email || 'Not Provided'}</Text>
              <Text style={styles.fieldLabel}>Target Academic Class</Text>
              <Text style={styles.fieldValue}>{selectedInquiry?.gradeOfInterest}</Text>
              <Text style={styles.fieldLabel}>Logged Date</Text>
              <Text style={styles.fieldValue}>{selectedInquiry?.date}</Text>
              <Text style={styles.fieldLabel}>Detailed Communication Log</Text>
              <Text style={styles.fieldValueNotes}>{selectedInquiry?.notes || 'No descriptive summary.'}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.dismissDetailsButton} onPress={() => setSelectedInquiry(null)}>
              <Text style={styles.dismissDetailsButtonText}>Close View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Modal - Optimized for Android */}
      <Modal 
        transparent 
        visible={isCreateModalOpen} 
        animationType="slide" 
        onRequestClose={() => setIsCreateModalOpen(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalKeyboardWrapper}
        >
          <View style={styles.overlayGlass}>
            <View style={[styles.modalBaseCard, isMobile && { margin: 10, width: '95%', maxHeight: '90%' }]}>
              <Text style={styles.modalHeadingText}>Log New Inquiry</Text>
              <Text style={styles.modalFormInstruction}>Provide prospect and contact details</Text>
              
              <ScrollView 
                contentContainerStyle={{ paddingBottom: 40 }}
                style={styles.formInnerScrollContainer} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.formInputLabel}>Student Name <Text style={{color:'#EF4444'}}>*</Text></Text>
                <TextInput style={styles.formInputField} value={form.studentName} onChangeText={(val) => setForm({ ...form, studentName: val })} placeholder="Enter full name" placeholderTextColor="#A1A1AA" />
                <Text style={styles.formInputLabel}>Parent or Guardian Name <Text style={{color:'#EF4444'}}>*</Text></Text>
                <TextInput style={styles.formInputField} value={form.parentName} onChangeText={(val) => setForm({ ...form, parentName: val })} placeholder="Enter guardian name" placeholderTextColor="#A1A1AA" />
                <Text style={styles.formInputLabel}>Primary Phone Contact <Text style={{color:'#EF4444'}}>*</Text></Text>
                <TextInput style={styles.formInputField} value={form.phone} onChangeText={(val) => setForm({ ...form, phone: val })} keyboardType="phone-pad" placeholder="e.g. +91 99999 88888" placeholderTextColor="#A1A1AA" />
                <Text style={styles.formInputLabel}>Email Address</Text>
                <TextInput style={styles.formInputField} value={form.email} onChangeText={(val) => setForm({ ...form, email: val })} keyboardType="email-address" autoCapitalize="none" placeholder="parent@domain.com" placeholderTextColor="#A1A1AA" />
                <Text style={styles.formInputLabel}>Target Grade Level</Text>
                <TextInput style={styles.formInputField} value={form.gradeOfInterest} onChangeText={(val) => setForm({ ...form, gradeOfInterest: val })} placeholder="e.g. Grade 4" placeholderTextColor="#A1A1AA" />
                <Text style={styles.formInputLabel}>Communication Notes</Text>
                <TextInput style={[styles.formInputField, styles.formMultiLineTextArea]} value={form.notes} onChangeText={(val) => setForm({ ...form, notes: val })} multiline textAlignVertical="top" placeholder="Log details..." placeholderTextColor="#A1A1AA" />
              </ScrollView>

              <View style={styles.modalActionButtonsGroup}>
                <TouchableOpacity style={[styles.modalButtonBase, styles.modalButtonCancel]} onPress={() => setIsCreateModalOpen(false)}>
                  <Text style={styles.modalButtonTextCancel}>Discard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButtonBase, styles.modalButtonSubmit]} onPress={handleCreateInquiry}>
                  <Text style={styles.modalButtonTextSubmit}>Save Record</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  topNavbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  brandTitle: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  brandSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  primaryActionButton: { backgroundColor: '#0EA5E9', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  primaryActionButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14.5 },
  analyticsRow: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  metricCard: { flex: 1, minWidth: 135, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 5 },
  borderLeftTotal: { borderLeftColor: '#0F172A' },
  borderLeftPending: { borderLeftColor: '#F59E0B' },
  borderLeftProgress: { borderLeftColor: '#3B82F6' },
  borderLeftResolved: { borderLeftColor: '#10B981' },
  metricLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  metricValue: { fontSize: 26, fontWeight: '700', marginTop: 8, color: '#0F172A' },
  controlContainer: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  searchInputElement: { backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' },
  filterTabsWrapper: { marginTop: 12 },
  tabItem: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 22, backgroundColor: '#F1F5F9', marginRight: 8 },
  tabItemActive: { backgroundColor: '#0F172A' },
  tabItemText: { fontSize: 13.5, color: '#475569', fontWeight: '500' },
  tabItemTextActive: { color: '#FFFFFF', fontWeight: '600' },
  listContainerStyles: { padding: 16, gap: 12 },
  dataCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' },
  dataCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardIdBadge: { fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  cardStudentName: { fontSize: 17, fontWeight: '600', color: '#0F172A', marginTop: 6 },
  cardParentLabel: { fontSize: 13.5, color: '#64748B', marginTop: 3 },
  badgeContainer: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  badgePending: { backgroundColor: '#FEF3C7' },
  badgeProgress: { backgroundColor: '#DBEAFE' },
  badgeResolved: { backgroundColor: '#D1FAE5' },
  badgeText: { fontSize: 12.5, fontWeight: '600' },
  textPending: { color: '#B45309' },
  textProgress: { color: '#1D4ED8' },
  textResolved: { color: '#047857' },
  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  dataCardFooter: { flexDirection: 'row', gap: 20, marginTop: 6 },
  footerMetaItem: { fontSize: 13.5, color: '#64748B', fontWeight: '500' },
  overlayGlass: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.65)', justifyContent: 'center', alignItems: 'center', padding: 12 },
  modalKeyboardWrapper: { flex: 1, width: '100%' },
  modalBaseCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, width: '100%', maxWidth: 520 },
  modalHeaderRow: { borderBottomWidth: 1, borderColor: '#E2E8F0', paddingBottom: 14, marginBottom: 12 },
  modalHeadingText: { fontSize: 21, fontWeight: '700', color: '#0F172A' },
  modalSubheadingText: { fontSize: 13.5, color: '#3B82F6', marginTop: 4 },
  modalFormInstruction: { fontSize: 14, color: '#64748B', marginTop: 6 },
  modalScrollBody: { marginVertical: 8 },
  fieldLabel: { fontSize: 12.5, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginTop: 16 },
  fieldValue: { fontSize: 16, color: '#1E293B', marginTop: 4 },
  fieldValueNotes: { fontSize: 15, color: '#475569', lineHeight: 22, marginTop: 6, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  dismissDetailsButton: { backgroundColor: '#0F172A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  dismissDetailsButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  formInnerScrollContainer: { flexGrow: 0 },
  formInputLabel: { fontSize: 13.5, fontWeight: '600', color: '#475569', marginTop: 14, marginBottom: 6 },
  formInputField: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#1E293B' },
  formMultiLineTextArea: { height: 80 },
  modalActionButtonsGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  modalButtonBase: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#F1F5F9' },
  modalButtonSubmit: { backgroundColor: '#0EA5E9' },
  modalButtonTextCancel: { color: '#475569', fontWeight: '600', fontSize: 15 },
  modalButtonTextSubmit: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});