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

export interface Appointment {
  id: string;
  visitorName: string;
  purpose: 'Admission Discussion' | 'Principal Meeting' | 'Grievance Drop' | 'Vendor Discussion' | 'Other';
  phone: string;
  date: string;
  timeSlot: string;
  assignedTo: string;
  status: 'Scheduled' | 'Completed' | 'Missed' | 'Cancelled';
  notes: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-2026-042',
    visitorName: 'Suresh Bhatia',
    purpose: 'Admission Discussion',
    phone: '+91 91234 56789',
    date: '2026-05-29',
    timeSlot: '02:30 PM',
    assignedTo: 'Admissions Counselor (Ms. Priya)',
    status: 'Scheduled',
    notes: 'Wants to inspect secondary wing campus laboratories and review the fee structures.',
  },
  {
    id: 'APT-2026-043',
    visitorName: 'Dr. Kavita Reddy',
    purpose: 'Principal Meeting',
    phone: '+91 98480 22310',
    date: '2026-05-29',
    timeSlot: '04:00 PM',
    assignedTo: 'Principal Desk',
    status: 'Scheduled',
    notes: 'Discussing guest lecture opportunities regarding biotechnology options for Grade 11 and 12.',
  },
  {
    id: 'APT-2026-041',
    visitorName: 'Ramesh Kumar',
    purpose: 'Grievance Drop',
    phone: '+91 77601 99283',
    date: '2026-05-28',
    timeSlot: '11:00 AM',
    assignedTo: 'Administrative Officer',
    status: 'Completed',
    notes: 'Resolved transport routing issue regarding Bus Route 4 pickup delays.',
  },
];

export default function Scheduling() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [isMounted, setIsMounted] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form, setForm] = useState({
    visitorName: '',
    purpose: 'Admission Discussion' as Appointment['purpose'],
    phone: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    assignedTo: '',
    notes: '',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const metrics = useMemo(() => {
    return appointments.reduce(
      (acc, curr) => {
        acc.total++;
        if (curr.status === 'Scheduled') acc.scheduled++;
        if (curr.status === 'Completed') acc.completed++;
        if (curr.status === 'Missed' || curr.status === 'Cancelled') acc.inactive++;
        return acc;
      },
      { total: 0, scheduled: 0, completed: 0, inactive: 0 }
    );
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.visitorName.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.assignedTo.toLowerCase().includes(query);

      const matchesStatus =
        activeFilter === 'All' ||
        item.status === activeFilter ||
        (activeFilter === 'Archived' && (item.status === 'Missed' || item.status === 'Cancelled'));

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchQuery, activeFilter]);

  const handleCreateAppointment = () => {
    if (!form.visitorName.trim() || !form.phone.trim() || !form.timeSlot.trim() || !form.assignedTo.trim() || !form.date) {
      alert('Validation Error: Please fill all required fields.');
      return;
    }

    const nextIdNumber = appointments.length + 42; 
    const newEntry: Appointment = {
      id: `APT-2026-${nextIdNumber}`,
      visitorName: form.visitorName.trim(),
      purpose: form.purpose,
      phone: form.phone.trim(),
      date: form.date,
      timeSlot: form.timeSlot.trim(),
      assignedTo: form.assignedTo.trim(),
      notes: form.notes.trim(),
      status: 'Scheduled',
    };

    setAppointments([newEntry, ...appointments]);
    setForm({
      visitorName: '',
      purpose: 'Admission Discussion',
      phone: '',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '',
      assignedTo: '',
      notes: '',
    });
    setIsCreateModalOpen(false);
  };

  const updateStatus = (id: string, nextStatus: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(item => (item.id === id ? { ...item, status: nextStatus } : item))
    );
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  if (!isMounted) {
    return (
      <SafeAreaView style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={{ marginTop: 12, color: '#64748B', fontSize: 14 }}>Loading Scheduling Console...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.topNavbar}>
        <View>
          <Text style={styles.brandTitle}>Appointment Booking</Text>
          <Text style={styles.brandSubtitle}>Front Desk Management & Visitor Coordination Console</Text>
        </View>
        <TouchableOpacity 
          style={styles.primaryActionButton} 
          onPress={() => setIsCreateModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryActionButtonText}>+ Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Analytics */}
      <View style={styles.analyticsRow}>
        <View style={[styles.metricCard, styles.borderLeftTotal]}>
          <Text style={styles.metricLabel}>TOTAL TRACKING</Text>
          <Text style={styles.metricValue}>{metrics.total}</Text>
        </View>
        <View style={[styles.metricCard, styles.borderLeftScheduled]}>
          <Text style={styles.metricLabel}>UPCOMING SLOTS</Text>
          <Text style={[styles.metricValue, { color: '#0EA5E9' }]}>{metrics.scheduled}</Text>
        </View>
        <View style={[styles.metricCard, styles.borderLeftCompleted]}>
          <Text style={styles.metricLabel}>CHECKED IN</Text>
          <Text style={[styles.metricValue, { color: '#10B981' }]}>{metrics.completed}</Text>
        </View>
        <View style={[styles.metricCard, styles.borderLeftInactive]}>
          <Text style={styles.metricLabel}>MISSED/CANCELLED</Text>
          <Text style={[styles.metricValue, { color: '#EF4444' }]}>{metrics.inactive}</Text>
        </View>
      </View>

      {/* Search & Filters */}
      <View style={styles.controlContainer}>
        <TextInput
          style={styles.searchInputElement}
          placeholder="Search by Visitor Name, Appointment ID, or Officer Assigned..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterTabsWrapper}>
          {[
            { label: 'All Operations', value: 'All' },
            { label: 'Upcoming', value: 'Scheduled' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Archived / Inactive', value: 'Archived' },
          ].map((tab) => {
            const isSelected = activeFilter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                style={[styles.tabItem, isSelected && styles.tabItemActive]}
                onPress={() => setActiveFilter(tab.value)}
              >
                <Text style={[styles.tabItemText, isSelected && styles.tabItemTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainerStyles}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyStateText}>No active appointments booked matching selected pipeline metrics.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.dataCard} 
            onPress={() => setSelectedAppointment(item)}
            activeOpacity={0.8}
          >
            <View style={styles.dataCardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardIdBadge}>{item.id}</Text>
                <Text style={styles.cardVisitorName}>{item.visitorName}</Text>
                <Text style={styles.cardOfficerLabel}>with {item.assignedTo}</Text>
              </View>
              <View style={[
                styles.badgeContainer, 
                item.status === 'Scheduled' && styles.badgeScheduled,
                item.status === 'Completed' && styles.badgeCompleted,
                (item.status === 'Missed' || item.status === 'Cancelled') && styles.badgeInactive,
              ]}>
                <Text style={[
                  styles.badgeText,
                  item.status === 'Scheduled' && styles.textScheduled,
                  item.status === 'Completed' && styles.textCompleted,
                  (item.status === 'Missed' || item.status === 'Cancelled') && styles.textInactive,
                ]}>{item.status}</Text>
              </View>
            </View>
            
            <View style={styles.cardDivider} />
            
            <View style={styles.dataCardFooter}>
              <Text style={styles.footerMetaItem}>🕒 {item.timeSlot} • {item.date}</Text>
              <Text style={styles.footerMetaItem}>📞 {item.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      {selectedAppointment && (
        <Modal transparent visible={!!selectedAppointment} animationType="fade" onRequestClose={() => setSelectedAppointment(null)}>
          <View style={styles.overlayGlass}>
            <View style={[styles.modalBaseCard, isMobile && { margin: 12, maxHeight: '92%' }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalHeadingText}>Booking Details</Text>
                <Text style={styles.modalSubheadingText}>{selectedAppointment.id}</Text>
              </View>
              
              <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.fieldLabel}>VISITOR</Text>
                <Text style={styles.fieldValue}>{selectedAppointment.visitorName}</Text>

                <Text style={styles.fieldLabel}>PURPOSE</Text>
                <Text style={styles.fieldValue}>{selectedAppointment.purpose}</Text>

                <Text style={styles.fieldLabel}>CONTACT</Text>
                <Text style={styles.fieldValue}>{selectedAppointment.phone}</Text>

                <Text style={styles.fieldLabel}>ASSIGNED TO</Text>
                <Text style={styles.fieldValue}>{selectedAppointment.assignedTo}</Text>

                <Text style={styles.fieldLabel}>SCHEDULED SLOT</Text>
                <Text style={styles.fieldValue}>{selectedAppointment.date} • {selectedAppointment.timeSlot}</Text>

                <Text style={styles.fieldLabel}>NOTES</Text>
                <Text style={styles.fieldValueNotes}>{selectedAppointment.notes || 'No notes provided.'}</Text>

                {selectedAppointment.status === 'Scheduled' && (
                  <View style={styles.statusTransitionBlock}>
                    <Text style={styles.transitionLabel}>Update Status</Text>
                    <View style={styles.transitionButtonsRow}>
                      <TouchableOpacity 
                        style={[styles.transitionButton, { backgroundColor: '#D1FAE5' }]} 
                        onPress={() => updateStatus(selectedAppointment.id, 'Completed')}
                      >
                        <Text style={{ color: '#065F46', fontWeight: '600' }}>Mark as Completed</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.transitionButton, { backgroundColor: '#FEE2E2' }]} 
                        onPress={() => updateStatus(selectedAppointment.id, 'Missed')}
                      >
                        <Text style={{ color: '#991B1B', fontWeight: '600' }}>Mark as Missed</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.dismissDetailsButton} onPress={() => setSelectedAppointment(null)}>
                <Text style={styles.dismissDetailsButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal transparent visible={isCreateModalOpen} animationType="slide" onRequestClose={() => setIsCreateModalOpen(false)}>
        <View style={styles.overlayGlass}>
          <View style={[styles.modalBaseCard, isMobile && { margin: 12, maxHeight: '92%' }]}>
            <Text style={styles.modalHeadingText}>New Appointment</Text>
            <Text style={styles.modalFormInstruction}>Schedule a visitor meeting</Text>
            
            <ScrollView 
              style={styles.formInnerScrollContainer} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.formInputLabel}>Visitor Name <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput style={styles.formInputField} value={form.visitorName} onChangeText={(val) => setForm({ ...form, visitorName: val })} placeholder="Full name" placeholderTextColor="#A1A1AA" />

              <Text style={styles.formInputLabel}>Phone Number <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput style={styles.formInputField} value={form.phone} onChangeText={(val) => setForm({ ...form, phone: val })} keyboardType="phone-pad" placeholder="+91 XXXXX XXXXX" placeholderTextColor="#A1A1AA" />

              <Text style={styles.formInputLabel}>Purpose</Text>
              <View style={styles.pickerAlternativeRow}>
                {(['Admission Discussion', 'Principal Meeting', 'Grievance Drop', 'Vendor Discussion'] as const).map((p) => (
                  <TouchableOpacity key={p} style={[styles.pickerAlternativeBadge, form.purpose === p && styles.pickerAlternativeActive]} onPress={() => setForm({ ...form, purpose: p })}>
                    <Text style={[styles.pickerAlternativeText, form.purpose === p && styles.pickerAlternativeTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formInputLabel}>Assigned To <Text style={{color:'#EF4444'}}>*</Text></Text>
              <TextInput style={styles.formInputField} value={form.assignedTo} onChangeText={(val) => setForm({ ...form, assignedTo: val })} placeholder="Staff / Department" placeholderTextColor="#A1A1AA" />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabel}>Date <Text style={{color:'#EF4444'}}>*</Text></Text>
                  {Platform.OS === 'web' ? (
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 15 }} />
                  ) : (
                    <TextInput style={styles.formInputField} value={form.date} onChangeText={(val) => setForm({ ...form, date: val })} placeholder="YYYY-MM-DD" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabel}>Time <Text style={{color:'#EF4444'}}>*</Text></Text>
                  <TextInput style={styles.formInputField} value={form.timeSlot} onChangeText={(val) => setForm({ ...form, timeSlot: val })} placeholder="02:30 PM" />
                </View>
              </View>

              <Text style={styles.formInputLabel}>Notes</Text>
              <TextInput style={[styles.formInputField, styles.formMultiLineTextArea]} value={form.notes} onChangeText={(val) => setForm({ ...form, notes: val })} multiline numberOfLines={4} placeholder="Additional details..." />
            </ScrollView>

            <View style={styles.modalActionButtonsGroup}>
              <TouchableOpacity style={[styles.modalButtonBase, styles.modalButtonCancel]} onPress={() => setIsCreateModalOpen(false)}>
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButtonBase, styles.modalButtonSubmit]} onPress={handleCreateAppointment}>
                <Text style={styles.modalButtonTextSubmit}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Responsive Premium Styling
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F0F9FF' },

  topNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#BAE6FD',
  },
  brandTitle: { fontSize: 24, fontWeight: '700', color: '#0C4A6E' },
  brandSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },

  primaryActionButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  primaryActionButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  analyticsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderLeftWidth: 5,
  },
  borderLeftTotal: { borderLeftColor: '#475569' },
  borderLeftScheduled: { borderLeftColor: '#0EA5E9' },
  borderLeftCompleted: { borderLeftColor: '#10B981' },
  borderLeftInactive: { borderLeftColor: '#EF4444' },
  metricLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  metricValue: { fontSize: 26, fontWeight: '700', marginTop: 8, color: '#0C4A6E' },

  controlContainer: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#BAE6FD' },
  searchInputElement: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  filterTabsWrapper: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, gap: 8 },
  tabItem: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 22, backgroundColor: '#E0F2FE' },
  tabItemActive: { backgroundColor: '#0C4A6E' },
  tabItemText: { fontSize: 13.5, color: '#475569', fontWeight: '500' },
  tabItemTextActive: { color: '#FFFFFF', fontWeight: '600' },

  listContainerStyles: { padding: 16, gap: 12 },
  dataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  dataCardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardIdBadge: { fontSize: 12, fontWeight: '700', color: '#0EA5E9', textTransform: 'uppercase' },
  cardVisitorName: { fontSize: 17, fontWeight: '600', color: '#0C4A6E', marginTop: 6 },
  cardOfficerLabel: { fontSize: 13.5, color: '#64748B', marginTop: 4 },
  badgeContainer: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  badgeScheduled: { backgroundColor: '#E0F2FE' },
  badgeCompleted: { backgroundColor: '#D1FAE5' },
  badgeInactive: { backgroundColor: '#FEE2E2' },
  badgeText: { fontSize: 12.5, fontWeight: '600' },
  textScheduled: { color: '#0369A1' },
  textCompleted: { color: '#047857' },
  textInactive: { color: '#B91C1C' },
  cardDivider: { height: 1, backgroundColor: '#E0F2FE', marginVertical: 16 },
  dataCardFooter: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
  footerMetaItem: { fontSize: 13.5, color: '#64748B' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyStateText: { fontSize: 15, color: '#94A3B8', textAlign: 'center' },

  overlayGlass: {
    flex: 1,
    backgroundColor: 'rgba(12, 74, 110, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
  },
  modalHeaderRow: { borderBottomWidth: 1, borderColor: '#BAE6FD', paddingBottom: 14, marginBottom: 12 },
  modalHeadingText: { fontSize: 21, fontWeight: '700', color: '#0C4A6E' },
  modalSubheadingText: { fontSize: 13.5, color: '#0EA5E9', marginTop: 4 },
  modalFormInstruction: { fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 16 },

  modalScrollBody: { marginVertical: 8 },
  fieldLabel: { fontSize: 12.5, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginTop: 16 },
  fieldValue: { fontSize: 16, color: '#0C4A6E', marginTop: 4 },
  fieldValueNotes: {
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

  statusTransitionBlock: { marginTop: 20, padding: 16, backgroundColor: '#F0F9FF', borderRadius: 12, borderWidth: 1, borderColor: '#BAE6FD' },
  transitionLabel: { fontSize: 13.5, fontWeight: '600', color: '#0C4A6E', marginBottom: 12 },
  transitionButtonsRow: { flexDirection: 'row', gap: 12 },
  transitionButton: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },

  dismissDetailsButton: {
    backgroundColor: '#0C4A6E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  dismissDetailsButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  formInnerScrollContainer: { flex: 1 },
  formInputLabel: { fontSize: 13.5, fontWeight: '600', color: '#475569', marginTop: 14, marginBottom: 6 },
  formInputField: {
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  pickerAlternativeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  pickerAlternativeBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  pickerAlternativeActive: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  pickerAlternativeText: { fontSize: 12.5, color: '#475569' },
  pickerAlternativeTextActive: { color: '#FFFFFF', fontWeight: '600' },
  formMultiLineTextArea: { height: 110, textAlignVertical: 'top' },

  modalActionButtonsGroup: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalButtonBase: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#E0F2FE' },
  modalButtonSubmit: { backgroundColor: '#0EA5E9' },
  modalButtonTextCancel: { color: '#0C4A6E', fontWeight: '600', fontSize: 15 },
  modalButtonTextSubmit: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});