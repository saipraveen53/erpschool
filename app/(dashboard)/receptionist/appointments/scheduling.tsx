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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface Appointment {
  id: string;
  visitorName: string;
  purpose: 'Admission Discussion' | 'Principal Meeting' | 'Grievance Drop' | 'Vendor Discussion' | 'Other';
  phone: string;
  email: string; // Added email
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
    email: 'suresh.bhatia@gmail.com',
    date: '2026-05-29',
    timeSlot: '14:30',
    assignedTo: 'Admissions Counselor (Ms. Priya)',
    status: 'Scheduled',
    notes: 'Wants to inspect secondary wing campus laboratories and review the fee structures.',
  },
  {
    id: 'APT-2026-043',
    visitorName: 'Dr. Kavita Reddy',
    purpose: 'Principal Meeting',
    phone: '+91 98480 22310',
    email: 'kavita.reddy@gmail.com',
    date: '2026-05-29',
    timeSlot: '16:00',
    assignedTo: 'Principal Desk',
    status: 'Scheduled',
    notes: 'Discussing guest lecture opportunities regarding biotechnology options for Grade 11 and 12.',
  },
  {
    id: 'APT-2026-041',
    visitorName: 'Ramesh Kumar',
    purpose: 'Grievance Drop',
    phone: '+91 77601 99283',
    email: 'ramesh.kumar@gmail.com',
    date: '2026-05-28',
    timeSlot: '11:00',
    assignedTo: 'Administrative Officer',
    status: 'Completed',
    notes: 'Resolved transport routing issue regarding Bus Route 4 pickup delays.',
  },
];

const PURPOSE_OPTIONS = [
  'Admission Discussion',
  'Principal Meeting',
  'Grievance Drop',
  'Vendor Discussion',
  'Other',
] as const;

const STATUS_OPTIONS: Appointment['status'][] = ['Scheduled', 'Completed', 'Missed', 'Cancelled'];

const FILTER_OPTIONS = [
  { label: 'All Operations', value: 'All' },
  { label: 'Upcoming', value: 'Scheduled' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Missed / Archived', value: 'Archived' },
] as const;

export default function Scheduling() {
  const { width } = useWindowDimensions();
  const isMobile = width < 992;
  const isWeb = Platform.OS === 'web';

  const [isMounted, setIsMounted] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [purposeFilter, setPurposeFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isPurposeDropdownOpen, setIsPurposeDropdownOpen] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Success Modal State
  const [successModal, setSuccessModal] = useState({ visible: false, title: '', message: '' });

  const [form, setForm] = useState({
    visitorName: '',
    purpose: 'Admission Discussion' as Appointment['purpose'],
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00',
    assignedTo: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        item.visitorName.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.assignedTo.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.notes.toLowerCase().includes(query);

      const matchesStatus =
        activeFilter === 'All' ||
        item.status === activeFilter ||
        (activeFilter === 'Archived' && (item.status === 'Missed' || item.status === 'Cancelled'));

      const matchesPurpose = purposeFilter === 'All' || item.purpose === purposeFilter;
      const matchesDate = !dateFilter || item.date === dateFilter;

      return matchesSearch && matchesStatus && matchesPurpose && matchesDate;
    });
  }, [appointments, searchQuery, activeFilter, purposeFilter, dateFilter]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Visitor Name Validation (At least 6 characters)
    if (!form.visitorName.trim()) {
      errors.visitorName = 'Visitor Name is required.';
    } else if (form.visitorName.trim().length < 6) {
      errors.visitorName = 'Name must be at least 6 characters long.';
    }

    // Phone Validation (Exactly 10 digits starting with 6 or 9)
    const cleanPhone = form.phone.replace(/[\s\-\+]/g, '');
    const phoneToTest = cleanPhone.startsWith('91') && cleanPhone.length === 12 ? cleanPhone.slice(2) : cleanPhone;
    
   if (!form.phone.trim()) {
      errors.phone = 'Phone Number is required.';
    } else if (!/^[6978]\d{9}$/.test(phoneToTest)) {
      errors.phone = 'Phone must be exactly 10 digits and start with 6, 9, 7, or 8.';
    }


    // Email Validation (Must have @gmail.com)
    if (!form.email.trim()) {
      errors.email = 'Email Address is required.';
    } else if (!form.email.toLowerCase().endsWith('@gmail.com')) {
      errors.email = 'Please enter a valid @gmail.com address.';
    }

    if (!form.assignedTo.trim()) errors.assignedTo = 'Assigned Staff is required.';
    if (!form.date) errors.date = 'Date is required.';
    if (!form.timeSlot.trim()) errors.timeSlot = 'Time Slot is required.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setForm({
      visitorName: '',
      purpose: 'Admission Discussion',
      phone: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '09:00',
      assignedTo: '',
      notes: '',
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditMode(false);
    setSelectedAppointment(null);
    setShowDetailsModal(false);
    setIsCreateModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedAppointment) return;
    setForm({
      visitorName: selectedAppointment.visitorName,
      purpose: selectedAppointment.purpose,
      phone: selectedAppointment.phone,
      email: selectedAppointment.email || '',
      date: selectedAppointment.date,
      timeSlot: selectedAppointment.timeSlot,
      assignedTo: selectedAppointment.assignedTo,
      notes: selectedAppointment.notes,
    });
    setFormErrors({});
    setIsEditMode(true);
    setShowDetailsModal(false);
    setIsCreateModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedAppointment(null);
    setShowDetailsModal(false);
  };

  const handleCreateOrUpdateAppointment = () => {
    if (!validateForm()) return;

    if (isEditMode && selectedAppointment) {
      const updated: Appointment = {
        ...selectedAppointment,
        visitorName: form.visitorName.trim(),
        purpose: form.purpose,
        phone: form.phone.trim(),
        email: form.email.trim(),
        date: form.date,
        timeSlot: form.timeSlot.trim(),
        assignedTo: form.assignedTo.trim(),
        notes: form.notes.trim(),
      };

      setAppointments((prev) => prev.map((item) => (item.id === selectedAppointment.id ? updated : item)));
      setSelectedAppointment(updated);
      setIsCreateModalOpen(false);
      setIsEditMode(false);
      setSuccessModal({ visible: true, title: 'Updated!', message: 'Your appointment was updated successfully.' });
      return;
    }

    const nextIdNumber = appointments.length + 42;
    const newEntry: Appointment = {
      id: `APT-2026-${nextIdNumber}`,
      visitorName: form.visitorName.trim(),
      purpose: form.purpose,
      phone: form.phone.trim(),
      email: form.email.trim(),
      date: form.date,
      timeSlot: form.timeSlot.trim(),
      assignedTo: form.assignedTo.trim(),
      notes: form.notes.trim(),
      status: 'Scheduled',
    };

    setAppointments([newEntry, ...appointments]);
    resetForm();
    setIsCreateModalOpen(false);
    setIsEditMode(false);
    setSuccessModal({ visible: true, title: 'Success!', message: 'Appointment booked successfully.' });
  };

  const updateStatus = (id: string, nextStatus: Appointment['status']) => {
    setAppointments((prev) => prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
    setSelectedAppointment((prev) => (prev && prev.id === id ? { ...prev, status: nextStatus } : prev));
    setSuccessModal({ visible: true, title: 'Status Updated', message: `Appointment status changed to ${nextStatus}.` });
  };

  const handleDeleteAppointment = () => {
    if (!selectedAppointment) return;
    const id = selectedAppointment.id;
    setAppointments((prev) => prev.filter((item) => item.id !== id));
    setShowDeleteConfirm(false);
    setShowDetailsModal(false);
    setSelectedAppointment(null);
    setSuccessModal({ visible: true, title: 'Deleted', message: 'Appointment record removed successfully.' });
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const selectedFilterLabel = FILTER_OPTIONS.find((opt) => opt.value === activeFilter)?.label || 'All Operations';

  if (!isMounted) {
    return (
      <SafeAreaView style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={{ marginTop: 12, color: '#DC2626', fontSize: 14, fontWeight: '600' }}>Loading Management Console...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={styles.pageScrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageShell}>
          
          {/* Header Dashboard Area */}
          <View style={styles.topNavbar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.brandTitle}>Appointment Booking</Text>
              <Text style={styles.brandSubtitle}>Front Desk Management & Visitor Coordination Console</Text>
            </View>
            <TouchableOpacity style={styles.primaryActionButton} onPress={openCreateModal} activeOpacity={0.85}>
              <Text style={styles.primaryActionButtonText}>+ Book Appointment</Text>
            </TouchableOpacity>
          </View>

          {/* Metric KPI View Counters */}
          <View style={styles.analyticsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.analyticsScrollContainer}>
              <View style={[styles.neoCard, styles.totalNeoCard]}>
                <Text style={styles.dashboardTitle}>Total Appointments</Text>
                <Text style={styles.dashboardValue}>{metrics.total}</Text>
              </View>
              <View style={[styles.neoCard, styles.scheduledNeoCard]}>
                <Text style={styles.dashboardTitle}>Scheduled</Text>
                <Text style={styles.dashboardValue}>{metrics.scheduled}</Text>
              </View>
              <View style={[styles.neoCard, styles.completedNeoCard]}>
                <Text style={styles.dashboardTitle}>Completed</Text>
                <Text style={styles.dashboardValue}>{metrics.completed}</Text>
              </View>
              <View style={[styles.neoCard, styles.inactiveNeoCard]}>
                <Text style={styles.dashboardTitle}>Missed / Cancelled</Text>
                <Text style={styles.dashboardValue}>{metrics.inactive}</Text>
              </View>
            </ScrollView>
          </View>

          {/* Core Controls & Filters Layout */}
          <View style={[styles.controlContainer, { zIndex: 9999, ...(Platform.OS === 'web' ? { position: 'relative' } : {}) }]}>
            <View style={[isMobile ? styles.filterGridMobile : styles.filterRowWeb, { zIndex: 9999 }]}>
              
              {/* Search Field Element */}
              <View style={[isMobile ? styles.mobileRowFullWidth : { flex: 1.5 }, { position: 'relative', zIndex: 1 }]}>
                <View style={styles.searchBoxWrap}>
                  <Icon name="search" size={15} color="#B91C1C" style={styles.searchMagnifyIcon} />
                  <TextInput
                    style={styles.searchInputElementIconification}
                    placeholder="Search visitor, ID, or officer..."
                    placeholderTextColor="#B91C1C"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {!!searchQuery && (
                    <TouchableOpacity style={styles.clearSearchButton} onPress={() => setSearchQuery('')}>
                      <Icon name="times" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Status Operations Droplist Controller */}
              <View style={[isMobile ? styles.mobileRowHalfWidth : styles.filterGroupItem, { zIndex: 3000 }]}>
                <TouchableOpacity
                  style={styles.dropdownSelector}
                  onPress={() => {
                    setIsFilterDropdownOpen(!isFilterDropdownOpen);
                    setIsPurposeDropdownOpen(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownText} numberOfLines={1}>{selectedFilterLabel}</Text>
                  <Icon name={isFilterDropdownOpen ? 'caret-up' : 'caret-down'} size={12} color="#7F1D1D" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                
                {isFilterDropdownOpen && (
                  <View style={styles.floatingDropdownMenu}>
                    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                      {FILTER_OPTIONS.map((option) => {
                        const active = activeFilter === option.value;
                        return (
                          <TouchableOpacity
                            key={option.value}
                            style={[styles.inlineDropdownItem, active && styles.inlineDropdownItemActive]}
                            onPress={() => {
                              setActiveFilter(option.value);
                              setIsFilterDropdownOpen(false);
                            }}
                          >
                            <Text style={[styles.inlineDropdownItemText, active && styles.inlineDropdownItemTextActive]}>{option.label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Functional Purpose Filter Configuration Droplist */}
              <View style={[isMobile ? styles.mobileRowHalfWidth : styles.filterGroupItem, { zIndex: 2000 }]}>
                <TouchableOpacity
                  style={styles.dropdownSelector}
                  onPress={() => {
                    setIsPurposeDropdownOpen(!isPurposeDropdownOpen);
                    setIsFilterDropdownOpen(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownText} numberOfLines={1}>{purposeFilter === 'All' ? 'All Purposes' : purposeFilter}</Text>
                  <Icon name={isPurposeDropdownOpen ? 'caret-up' : 'caret-down'} size={12} color="#7F1D1D" style={{ marginLeft: 8 }} />
                </TouchableOpacity>

                {isPurposeDropdownOpen && (
                  <View style={styles.floatingDropdownMenu}>
                    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                      <TouchableOpacity
                        style={[styles.inlineDropdownItem, purposeFilter === 'All' && styles.inlineDropdownItemActive]}
                        onPress={() => {
                          setPurposeFilter('All');
                          setIsPurposeDropdownOpen(false);
                        }}
                      >
                        <Text style={[styles.inlineDropdownItemText, purposeFilter === 'All' && styles.inlineDropdownItemTextActive]}>All Purposes</Text>
                      </TouchableOpacity>
                      {PURPOSE_OPTIONS.map((p) => {
                        const active = purposeFilter === p;
                        return (
                          <TouchableOpacity
                            key={p}
                            style={[styles.inlineDropdownItem, active && styles.inlineDropdownItemActive]}
                            onPress={() => {
                              setPurposeFilter(p);
                              setIsPurposeDropdownOpen(false);
                            }}
                          >
                            <Text style={[styles.inlineDropdownItemText, active && styles.inlineDropdownItemTextActive]}>{p}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Structured Responsive Date Filter Control */}
              <View style={[isMobile ? styles.mobileRowFullWidth : styles.filterGroupItem, { zIndex: 1000 }]}>
                <View style={styles.datePickerFilterWrapper}>
                  {Platform.OS === 'web' ? (
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      style={styles.webNativeInputDatePicker as any}
                    />
                  ) : (
                    <TextInput
                      style={styles.searchInputElement}
                      placeholder="Filter Date: YYYY-MM-DD"
                      placeholderTextColor="#B91C1C"
                      value={dateFilter}
                      onChangeText={setDateFilter}
                    />
                  )}
                  {!!dateFilter && (
                    <TouchableOpacity style={styles.clearDatePickerButton} onPress={() => setDateFilter('')}>
                      <Icon name="times" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

            </View>
          </View>

          {/* Graphical Presentation Elements Engine Layout */}
          {isWeb ? (
            <View style={[styles.webTableShell, { zIndex: 1 }]}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Visitor</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.4 }]}>Purpose</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Assigned To</Text>
                <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Scheduled Date</Text>
                <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Time Slot</Text>
                <Text style={[styles.tableHeaderCell, { flex: 0.75 }]}>Status Badge</Text>
              </View>

              {filteredAppointments.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyStateText}>No active appointments booked matching selected pipeline metrics.</Text>
                </View>
              ) : (
                filteredAppointments.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.tableDataRow} onPress={() => handleViewAppointment(item)} activeOpacity={0.9}>
                    <View style={[styles.tableDataCell, { flex: 1.2 }]}>
                      <Text style={styles.cardIdBadge}>{item.id}</Text>
                      <Text style={styles.cardVisitorName}>{item.visitorName}</Text>
                      <Text style={styles.mutedCellText}>{item.phone}</Text>
                    </View>
                    <View style={[styles.tableDataCell, { flex: 1.4 }]}>
                      <Text style={styles.primaryCellText}>{item.purpose}</Text>
                      <Text style={styles.mutedCellText} numberOfLines={1}>{item.notes || 'No notes provided.'}</Text>
                    </View>
                    <View style={[styles.tableDataCell, { flex: 1.2 }]}>
                      <Text style={styles.primaryCellText}>{item.assignedTo}</Text>
                    </View>
                    <View style={[styles.tableDataCell, { flex: 0.8 }]}>
                      <Text style={styles.primaryCellText}>{item.date}</Text>
                    </View>
                    <View style={[styles.tableDataCell, { flex: 0.6 }]}>
                      <Text style={styles.primaryCellText}>{item.timeSlot}</Text>
                    </View>
                    <View style={[styles.tableDataCell, { flex: 0.75, alignItems: 'flex-start' }]}>
                      <View style={[
                        styles.professionalStatusBadge,
                        item.status === 'Scheduled' && styles.professionalScheduled,
                        item.status === 'Completed' && styles.professionalCompleted,
                        (item.status === 'Missed' || item.status === 'Cancelled') && styles.professionalInactive,
                      ]}>
                        <Text style={styles.professionalStatusText}>{item.status}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          ) : (
            <FlatList
              data={filteredAppointments}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[styles.listContainerStyles, { zIndex: 1 }]}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyStateText}>No active appointments booked matching selected pipeline metrics.</Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.dataCard, { zIndex: 1 }]} onPress={() => handleViewAppointment(item)} activeOpacity={0.85}>
                  <View style={styles.dataCardHeaderModern}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardIdBadge}>{item.id}</Text>
                      <Text style={styles.cardVisitorName}>{item.visitorName}</Text>
                      <Text style={styles.cardOfficerLabel}>with {item.assignedTo}</Text>
                    </View>
                    <View style={[
                      styles.professionalStatusBadge,
                      item.status === 'Scheduled' && styles.professionalScheduled,
                      item.status === 'Completed' && styles.professionalCompleted,
                      (item.status === 'Missed' || item.status === 'Cancelled') && styles.professionalInactive,
                    ]}>
                      <Text style={styles.professionalStatusText}>{item.status}</Text>
                    </View>
                  </View>
                  <View style={styles.cardDivider} />
                  <View style={styles.dataCardFooter}>
                    <View style={styles.footerItem}>
                      <Icon name="clock-o" size={13} color="#9F1239" style={{ marginRight: 6 }} />
                      <Text style={styles.footerMetaItem}>{item.timeSlot} • {item.date}</Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Icon name="phone" size={13} color="#9F1239" style={{ marginRight: 6 }} />
                      <Text style={styles.footerMetaItem}>{item.phone}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Appointment Info Popup Modal Viewer */}
      {showDetailsModal && selectedAppointment && (
        <Modal transparent visible={showDetailsModal} animationType="fade" onRequestClose={closeDetailsModal} statusBarTranslucent>
          <TouchableOpacity style={styles.overlayGlass} activeOpacity={1} onPress={closeDetailsModal}>
            <TouchableOpacity style={[styles.modalBaseCard, isMobile && styles.modalMobileCard]} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalHeadingText}>Booking Details</Text>
                <Text style={styles.modalSubheadingText}>{selectedAppointment.id}</Text>
              </View>

              <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.fieldLabel}>Visitor</Text>
                <Text style={styles.fieldValue}>{selectedAppointment.visitorName}</Text>
                
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Contact</Text>
                    <Text style={styles.fieldValue}>{selectedAppointment.phone}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <Text style={styles.fieldValue}>{selectedAppointment.email || 'N/A'}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Purpose</Text>
                    <Text style={styles.fieldValue}>{selectedAppointment.purpose}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Assigned To</Text>
                    <Text style={styles.fieldValue}>{selectedAppointment.assignedTo}</Text>
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Scheduled Slot</Text>
                <Text style={styles.fieldValue}>{selectedAppointment.date} • {selectedAppointment.timeSlot}</Text>
                
                <Text style={styles.fieldLabel}>Notes</Text>
                <Text style={styles.fieldValueNotes}>{selectedAppointment.notes || 'No notes provided.'}</Text>
                
                <Text style={styles.fieldLabel}>Update Status</Text>
                <View style={styles.statusDropdownBlock}>
                  {STATUS_OPTIONS.map((status) => {
                    const active = selectedAppointment.status === status;
                    return (
                      <TouchableOpacity
                        key={status}
                        style={[styles.statusOptionButton, active && styles.statusOptionButtonActive]}
                        onPress={() => updateStatus(selectedAppointment.id, status)}
                      >
                        <Text style={[styles.statusOptionText, active && styles.statusOptionTextActive]}>{status}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.recordActionRow}>
                  <TouchableOpacity style={styles.editRecordButton} onPress={openEditModal}>
                    <Text style={styles.editRecordButtonText}>Edit Record</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteRecordButton} onPress={() => setShowDeleteConfirm(true)}>
                    <Text style={styles.deleteRecordButtonText}>Delete Record</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.dismissDetailsButton} onPress={closeDetailsModal}>
                <Text style={styles.dismissDetailsButtonText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Confirmation Removal Dynamic Overlay */}
      {showDeleteConfirm && (
        <Modal transparent visible={showDeleteConfirm} animationType="fade" onRequestClose={() => setShowDeleteConfirm(false)} statusBarTranslucent>
          <TouchableOpacity style={styles.overlayGlass} activeOpacity={1} onPress={() => setShowDeleteConfirm(false)}>
            <TouchableOpacity style={styles.confirmCard} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.confirmTitle}>Delete Appointment?</Text>
              <Text style={styles.confirmText}>This action will permanently remove the selected appointment record.</Text>
              <View style={styles.confirmButtonRow}>
                <TouchableOpacity style={[styles.confirmButton, styles.confirmCancelButton]} onPress={() => setShowDeleteConfirm(false)}>
                  <Text style={styles.confirmCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.confirmButton, styles.confirmDeleteButton]} onPress={handleDeleteAppointment}>
                  <Text style={styles.confirmDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Scheduler Dynamic Action Processing Screen Form Sheet */}
      {isCreateModalOpen && (
        <Modal transparent visible={isCreateModalOpen} animationType="slide" onRequestClose={() => {
          setIsCreateModalOpen(false);
          setFormErrors({});
        }} statusBarTranslucent>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.overlayGlass}>
              <View style={[styles.createModalContainer, isMobile && styles.createModalMobile, { flexShrink: 1 }]}>
                <View style={styles.createModalHeader}>
                  <Text style={styles.modalHeadingText}>{isEditMode ? 'Update Appointment' : 'New Appointment'}</Text>
                  <Text style={styles.modalFormInstruction}>{isEditMode ? 'Edit appointment details securely' : 'Schedule a visitor meeting'}</Text>
                </View>

                <ScrollView style={{ flexShrink: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 24, paddingTop: 10 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                  <Text style={styles.formInputLabel}>Visitor Name <Text style={{ color: '#EF4444' }}>*</Text></Text>
                  <TextInput
                    style={[styles.formInputField, formErrors.visitorName && styles.formInputErrorBorder]}
                    value={form.visitorName}
                    onChangeText={(val) => {
                      setForm({ ...form, visitorName: val });
                      if(formErrors.visitorName) setFormErrors(prev => ({...prev, visitorName: ''}));
                    }}
                    placeholder="Full Name"
                    placeholderTextColor="#B91C1C"
                  />
                  {formErrors.visitorName && <Text style={styles.errorText}>{formErrors.visitorName}</Text>}

                  <Text style={styles.formInputLabel}>Phone Number <Text style={{ color: '#EF4444' }}>*</Text></Text>
                  <TextInput
                    style={[styles.formInputField, formErrors.phone && styles.formInputErrorBorder]}
                    value={form.phone}
                    onChangeText={(val) => {
                      setForm({ ...form, phone: val });
                      if(formErrors.phone) setFormErrors(prev => ({...prev, phone: ''}));
                    }}
                    keyboardType="phone-pad"
                    placeholder="+91 XXXXX XXXXX"
                    placeholderTextColor="#B91C1C"
                  />
                  {formErrors.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}

                  <Text style={styles.formInputLabel}>Email <Text style={{ color: '#EF4444' }}>*</Text></Text>
                  <TextInput
                    style={[styles.formInputField, formErrors.email && styles.formInputErrorBorder]}
                    value={form.email}
                    onChangeText={(val) => {
                      setForm({ ...form, email: val });
                      if(formErrors.email) setFormErrors(prev => ({...prev, email: ''}));
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="email@gmail.com"
                    placeholderTextColor="#B91C1C"
                  />
                  {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}

                  <Text style={styles.formInputLabel}>Purpose</Text>
                  <View style={styles.pickerAlternativeRow}>
                    {PURPOSE_OPTIONS.map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={[styles.pickerAlternativeBadge, form.purpose === p && styles.pickerAlternativeActive]}
                        onPress={() => setForm({ ...form, purpose: p })}
                      >
                        <Text style={[styles.pickerAlternativeText, form.purpose === p && styles.pickerAlternativeTextActive]}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.formInputLabel}>Assigned To <Text style={{ color: '#EF4444' }}>*</Text></Text>
                  <TextInput
                    style={[styles.formInputField, formErrors.assignedTo && styles.formInputErrorBorder]}
                    value={form.assignedTo}
                    onChangeText={(val) => {
                      setForm({ ...form, assignedTo: val });
                      if(formErrors.assignedTo) setFormErrors(prev => ({...prev, assignedTo: ''}));
                    }}
                    placeholder="Staff / Department"
                    placeholderTextColor="#B91C1C"
                  />
                  {formErrors.assignedTo && <Text style={styles.errorText}>{formErrors.assignedTo}</Text>}

                  {/* Input Date Module Wrapper */}
                  <Text style={styles.formInputLabel}>Date <Text style={{ color: '#EF4444' }}>*</Text></Text>
                  <View style={styles.formInputWrapperRelative}>
                    {Platform.OS === 'web' ? (
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => {
                          setForm({ ...form, date: e.target.value });
                          if(formErrors.date) setFormErrors(prev => ({...prev, date: ''}));
                        }}
                        style={formErrors.date ? { ...styles.webFormNativeDateTimePicker, borderColor: '#DC2626', borderWidth: 1.5 } as any : styles.webFormNativeDateTimePicker as any}
                      />
                    ) : (
                      <TextInput
                        style={[styles.formInputField, formErrors.date && styles.formInputErrorBorder]}
                        value={form.date}
                        onChangeText={(val) => {
                          setForm({ ...form, date: val });
                          if(formErrors.date) setFormErrors(prev => ({...prev, date: ''}));
                        }}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#B91C1C"
                      />
                    )}
                  </View>
                  {formErrors.date && <Text style={styles.errorText}>{formErrors.date}</Text>}

                  {/* Input Time Module Wrapper */}
                  <Text style={styles.formInputLabel}>Time Slot <Text style={{ color: '#EF4444' }}>*</Text></Text>
                  <View style={styles.formInputWrapperRelative}>
                    {Platform.OS === 'web' ? (
                      <input
                        type="time"
                        value={form.timeSlot}
                        onChange={(e) => {
                          setForm({ ...form, timeSlot: e.target.value });
                          if(formErrors.timeSlot) setFormErrors(prev => ({...prev, timeSlot: ''}));
                        }}
                        style={formErrors.timeSlot ? { ...styles.webFormNativeDateTimePicker, borderColor: '#DC2626', borderWidth: 1.5 } as any : styles.webFormNativeDateTimePicker as any}
                      />
                    ) : (
                      <TextInput
                        style={[styles.formInputField, formErrors.timeSlot && styles.formInputErrorBorder]}
                        value={form.timeSlot}
                        onChangeText={(val) => {
                          setForm({ ...form, timeSlot: val });
                          if(formErrors.timeSlot) setFormErrors(prev => ({...prev, timeSlot: ''}));
                        }}
                        placeholder="HH:MM (e.g. 14:30)"
                        placeholderTextColor="#B91C1C"
                      />
                    )}
                  </View>
                  {formErrors.timeSlot && <Text style={styles.errorText}>{formErrors.timeSlot}</Text>}

                  <Text style={styles.formInputLabel}>Notes</Text>
                  <TextInput
                    style={[styles.formInputField, styles.formMultiLineTextArea]}
                    value={form.notes}
                    onChangeText={(val) => setForm({ ...form, notes: val })}
                    multiline
                    textAlignVertical="top"
                    placeholder="Additional details regarding this check-in session..."
                    placeholderTextColor="#B91C1C"
                  />
                </ScrollView>

                <View style={styles.modalActionButtonsGroup}>
                  <TouchableOpacity
                    style={[styles.modalButtonBase, styles.modalButtonCancel]}
                    onPress={() => {
                      setIsCreateModalOpen(false);
                      setIsEditMode(false);
                      resetForm();
                    }}
                  >
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.modalButtonBase, styles.modalButtonSubmit]} onPress={handleCreateOrUpdateAppointment}>
                    <Text style={styles.modalButtonTextSubmit}>{isEditMode ? 'Update Appointment' : 'Book Appointment'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* SUCCESS MODAL POPUP */}
      <Modal transparent visible={successModal.visible} animationType="fade" onRequestClose={() => setSuccessModal((p) => ({...p, visible: false}))}>
        <View style={styles.overlayGlass}>
          <View style={[styles.confirmCard, isMobile && { margin: 12, width: '94%' }]}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#A7F3D0' }}>
              <Icon name="check" size={40} color="#16A34A" />
            </View>
            <Text style={styles.confirmTitle}>{successModal.title}</Text>
            <Text style={styles.confirmText}>{successModal.message}</Text>
            
            <View style={styles.confirmButtonRow}>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: '#16A34A' }]}
                onPress={() => setSuccessModal((p) => ({...p, visible: false}))}
              >
                <Text style={styles.confirmDeleteText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#FFF1F2' },
  pageScrollContent: { flexGrow: 1 },
  pageShell: { maxWidth: 1400, width: '100%', alignSelf: 'center' },
  topNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 22,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  brandTitle: { fontSize: 26, fontWeight: '800', color: '#7F1D1D', letterSpacing: -0.75 },
  brandSubtitle: { fontSize: 13, color: '#9F1239', marginTop: 4, fontWeight: '600', letterSpacing: 0.2 },
  primaryActionButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryActionButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
  analyticsWrapper: { backgroundColor: '#FFF1F2' },
  analyticsScrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
  },
  neoCard: {
    width: 270,
    minWidth: 270,
    height: 120,
    marginRight: 16,
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  totalNeoCard: { borderLeftWidth: 6, borderLeftColor: '#7F1D1D' },
  scheduledNeoCard: { borderLeftWidth: 6, borderLeftColor: '#DC2626' },
  completedNeoCard: { borderLeftWidth: 6, borderLeftColor: '#16A34A' },
  inactiveNeoCard: { borderLeftWidth: 6, borderLeftColor: '#EF4444' },
  dashboardTitle: { fontSize: 13, fontWeight: '700', color: '#9F1239', textTransform: 'uppercase', letterSpacing: 0.5 },
  dashboardValue: { fontSize: 36, fontWeight: '800', color: '#7F1D1D' },
  controlContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FECACA',
    zIndex: 20,
  },
  filterRowWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  filterGridMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  mobileRowFullWidth: {
    width: '100%',
    position: 'relative',
  },
  mobileRowHalfWidth: {
    flex: 1,
    minWidth: '45%',
    position: 'relative',
  },
  filterGroupItem: {
    flex: 1,
    minWidth: 180,
    position: 'relative',
  },
  searchBoxWrap: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  searchMagnifyIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 10,
    top: '50%',
    marginTop: -7.5,
  },
  searchInputElement: {
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    color: '#7F1D1D',
    width: '100%',
    height: 46,
  },
  searchInputElementIconification: {
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
    paddingLeft: 42,
    paddingRight: 40,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    color: '#7F1D1D',
    width: '100%',
    height: 46,
  },
  clearSearchButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -11,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  clearSearchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    height: 46,
    width: '100%',
  },
  dropdownText: {
    fontSize: 14,
    color: '#7F1D1D',
    fontWeight: '600',
  },
  dropdownArrow: {
    fontSize: 11,
    color: '#9A3412',
    marginLeft: 8,
  },
  floatingDropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  inlineDropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF1F2',
  },
  inlineDropdownItemActive: {
    backgroundColor: '#FEF2F2',
  },
  inlineDropdownItemText: {
    fontSize: 14,
    color: '#4B5563',
  },
  inlineDropdownItemTextActive: {
    color: '#DC2626',
    fontWeight: '700',
  },
  datePickerFilterWrapper: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  webNativeInputDatePicker: {
    width: '100%',
    height: '46px',
    padding: '0 16px',
    borderRadius: '8px',
    border: '1px solid #FECACA',
    fontSize: '14px',
    color: '#7F1D1D',
    fontWeight: '600',
    fontFamily: 'inherit',
    backgroundColor: '#FFF1F2',
    boxSizing: 'border-box',
  },
  clearDatePickerButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -11,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  webTableShell: {
    margin: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  tableHeaderCell: {
    color: '#7F1D1D',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.75,
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE8E8',
    alignItems: 'center',
  },
  tableDataCell: {
    paddingRight: 12,
  },
  primaryCellText: {
    color: '#7F1D1D',
    fontSize: 14,
    fontWeight: '600',
  },
  mutedCellText: {
    color: '#B91C1C',
    fontSize: 13,
    marginTop: 4,
  },
  listContainerStyles: { padding: 24, gap: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
  emptyStateText: { fontSize: 15, color: '#B91C1C', textAlign: 'center', fontWeight: '500' },
  dataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  dataCardHeaderModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIdBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  cardVisitorName: { fontSize: 18, fontWeight: '700', color: '#7F1D1D', marginTop: 4 },
  cardOfficerLabel: { fontSize: 13, color: '#B91C1C', marginTop: 4, fontWeight: '500' },
  professionalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  professionalScheduled: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  professionalCompleted: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  professionalInactive: { backgroundColor: '#FDE8E8', borderColor: '#FECACA' },
  professionalStatusText: { fontWeight: '700', fontSize: 12, color: '#7F1D1D' },
  cardDivider: { height: 1, backgroundColor: '#FDE8E8', marginVertical: 14 },
  dataCardFooter: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerMetaItem: { fontSize: 13, color: '#9F1239', fontWeight: '600' },
  overlayGlass: {
    flex: 1,
    backgroundColor: 'rgba(60, 33, 20, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  modalMobileCard: {
    maxHeight: '90%',
    width: '95%',
  },
  modalHeaderRow: {
    borderBottomWidth: 1,
    borderColor: '#FECACA',
    paddingBottom: 14,
    marginBottom: 14,
  },
  modalHeadingText: { fontSize: 22, fontWeight: '800', color: '#7F1D1D', letterSpacing: -0.5 },
  modalSubheadingText: { fontSize: 13, color: '#DC2626', fontWeight: '800', marginTop: 4 },
  modalFormInstruction: { fontSize: 13, color: '#B91C1C', marginTop: 4, marginBottom: 10 },
  modalScrollBody: { marginVertical: 4 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
    textTransform: 'uppercase',
    marginTop: 14,
    letterSpacing: 0.75,
  },
  fieldValue: { fontSize: 15, color: '#7F1D1D', marginTop: 4, fontWeight: '600' },
  fieldValueNotes: {
    fontSize: 14,
    lineHeight: 22,
    color: '#7F1D1D',
    backgroundColor: '#FFF1F2',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 6,
  },
  statusDropdownBlock: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOptionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFFFFF',
  },
  statusOptionButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  statusOptionText: {
    color: '#7F1D1D',
    fontWeight: '700',
    fontSize: 13,
  },
  statusOptionTextActive: {
    color: '#FFFFFF',
  },
  recordActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  editRecordButton: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  editRecordButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
  deleteRecordButton: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteRecordButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
  dismissDetailsButton: {
    backgroundColor: '#7F1D1D',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  dismissDetailsButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  createModalContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
    borderRadius: 12,
    padding: 24,
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  createModalMobile: {
    width: '95%',
    maxHeight: '90%',
  },
  createModalHeader: { marginBottom: 12 },
  modalActionButtonsGroup: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  formInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7F1D1D',
    marginTop: 14,
    marginBottom: 6,
  },
  formInputField: {
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#7F1D1D',
    height: 46,
  },
  formInputErrorBorder: {
    borderColor: '#DC2626',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '600',
  },
  pickerAlternativeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  pickerAlternativeBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFF1F2',
  },
  pickerAlternativeActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  pickerAlternativeText: { fontSize: 13, color: '#7F1D1D', fontWeight: '600' },
  pickerAlternativeTextActive: { color: '#FFFFFF', fontWeight: '700' },
  formMultiLineTextArea: { minHeight: 100, height: 'auto', textAlignVertical: 'top' },
  modalButtonBase: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECACA' },
  modalButtonSubmit: { backgroundColor: '#DC2626' },
  modalButtonTextCancel: { color: '#7F1D1D', fontWeight: '700', fontSize: 14 },
  modalButtonTextSubmit: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  confirmTitle: { fontSize: 18, fontWeight: '800', color: '#7F1D1D', textAlign: 'center' },
  confirmText: { fontSize: 14, color: '#9F1239', marginTop: 8, lineHeight: 22, textAlign: 'center' },
  confirmButtonRow: { flexDirection: 'row', gap: 12, marginTop: 22 },
  confirmButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  confirmCancelButton: { backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECACA' },
  confirmDeleteButton: { backgroundColor: '#DC2626' },
  confirmCancelText: { color: '#7F1D1D', fontWeight: '700', fontSize: 14 },
  confirmDeleteText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  formInputWrapperRelative: {
    width: '100%',
  },
  webFormNativeDateTimePicker: {
    width: '100%',
    height: '46px',
    padding: '0 14px',
    borderRadius: '8px',
    border: '1px solid #FECACA',
    fontSize: '14px',
    color: '#7F1D1D',
    fontWeight: '600',
    fontFamily: 'inherit',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
});