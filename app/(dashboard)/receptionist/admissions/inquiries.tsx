import React, { useMemo, useState, useEffect } from 'react';
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
  KeyboardAvoidingView,
  StatusBar,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

const GRADE_OPTIONS = [
  'Nursery',
  'LKG',
  'UKG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
] as const;

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
    gradeOfInterest: 'Grade 10',
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
    gradeOfInterest: 'UKG',
    date: '2026-05-20',
    status: 'Resolved',
    notes: 'Admission documentation finalized and fee receipt generated.',
  },
];

const THEME = {
  background: '#FFF9F4',
  surface: '#FFFFFF',
  surfaceSoft: '#FFF4EA',
  border: '#F0E3D7',
  text: '#5C341A',
  textStrong: '#3D2313',
  textMuted: '#9A6E55',
  primary: '#F05A34',
  primaryDark: '#D94A25',
  success: '#16A34A',
  warning: '#F59E0B',
  info: '#3B82F6',
  danger: '#EF4444',
  shadow: '#D8B59C',
  inputBg: '#FFFDFC',
};

type GradePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

function GradePicker({ value, onChange }: GradePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.gradeFilterWrap}>
      <TouchableOpacity style={styles.gradeFilterButton} activeOpacity={0.85} onPress={() => setOpen(true)}>
        <Text style={[styles.gradeFilterButtonText, !value && styles.gradeFilterPlaceholder]}>
          {value || 'All Grades'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={THEME.textMuted} />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.pickerSheet} onPress={() => {}}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Filter by Grade</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={22} color={THEME.textStrong} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <TouchableOpacity
                style={[styles.pickerOption, !value && styles.pickerOptionSelected]}
                onPress={() => {
                  onChange('');
                  setOpen(false);
                }}
              >
                <Text style={[styles.pickerOptionText, !value && styles.pickerOptionTextSelected]}>All Grades</Text>
                {!value && <Ionicons name="checkmark" size={18} color={THEME.primary} />}
              </TouchableOpacity>

              {GRADE_OPTIONS.map((item) => {
                const selected = value === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.pickerOption, selected && styles.pickerOptionSelected]}
                    onPress={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.pickerOptionText, selected && styles.pickerOptionTextSelected]}>{item}</Text>
                    {selected && <Ionicons name="checkmark" size={18} color={THEME.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.pickerClearBtn}
              onPress={() => {
                onChange('');
                setOpen(false);
              }}
            >
              <Text style={styles.pickerClearText}>Clear Selection</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

type FormGradePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function FormGradePicker({ label, value, onChange, placeholder = 'Select grade' }: FormGradePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.formInputLabel}>{label}</Text>

      <TouchableOpacity style={styles.pickerTrigger} activeOpacity={0.85} onPress={() => setOpen(true)}>
        <Text style={[styles.pickerTriggerText, !value && styles.pickerPlaceholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={THEME.textMuted} />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.pickerSheet} onPress={() => {}}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Grade</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={22} color={THEME.textStrong} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {GRADE_OPTIONS.map((item) => {
                const selected = value === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.pickerOption, selected && styles.pickerOptionSelected]}
                    onPress={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.pickerOptionText, selected && styles.pickerOptionTextSelected]}>{item}</Text>
                    {selected && <Ionicons name="checkmark" size={18} color={THEME.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.pickerClearBtn}
              onPress={() => {
                onChange('');
                setOpen(false);
              }}
            >
              <Text style={styles.pickerClearText}>Clear Selection</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function InquiriesScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    const query = searchQuery.toLowerCase().trim();

    return inquiries.filter((item) => {
      const matchesSearch =
        item.studentName.toLowerCase().includes(query) ||
        item.parentName.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.gradeOfInterest.toLowerCase().includes(query) ||
        item.notes.toLowerCase().includes(query);

      const matchesStatus = activeFilter === 'All' || item.status === activeFilter;
      const matchesGrade = !gradeFilter || item.gradeOfInterest === gradeFilter;
      const matchesDate = !dateFilter || item.date.startsWith(dateFilter);

      return matchesSearch && matchesStatus && matchesGrade && matchesDate;
    });
  }, [inquiries, searchQuery, activeFilter, gradeFilter, dateFilter]);

  const resetForm = () => {
    setForm({
      studentName: '',
      parentName: '',
      phone: '',
      email: '',
      gradeOfInterest: '',
      notes: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditMode(false);
    setSelectedInquiry(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedInquiry) return;
    setForm({
      studentName: selectedInquiry.studentName,
      parentName: selectedInquiry.parentName,
      phone: selectedInquiry.phone,
      email: selectedInquiry.email,
      gradeOfInterest: selectedInquiry.gradeOfInterest,
      notes: selectedInquiry.notes,
    });
    setIsEditMode(true);
    setIsCreateModalOpen(true);
  };

  const handleCreateOrUpdateInquiry = () => {
    if (!form.studentName.trim() || !form.parentName.trim() || !form.phone.trim()) {
      Alert.alert('Error', 'Please complete all required fields (*).');
      return;
    }

    if (!form.gradeOfInterest.trim()) {
      Alert.alert('Error', 'Please select a grade.');
      return;
    }

    if (isEditMode && selectedInquiry) {
      const updated: Inquiry = {
        ...selectedInquiry,
        studentName: form.studentName.trim(),
        parentName: form.parentName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        gradeOfInterest: form.gradeOfInterest,
        notes: form.notes.trim(),
      };

      setInquiries((prev) => prev.map((item) => (item.id === selectedInquiry.id ? updated : item)));
      setSelectedInquiry(updated);
      setIsCreateModalOpen(false);
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
      gradeOfInterest: form.gradeOfInterest,
      notes: form.notes.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    setInquiries([newEntry, ...inquiries]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const openDeleteConfirm = () => {
    if (!selectedInquiry) return;
    setShowDeleteConfirm(true);
  };

  const handleDeleteInquiry = () => {
    if (!selectedInquiry) return;
    setInquiries((prev) => prev.filter((item) => item.id !== selectedInquiry.id));
    setSelectedInquiry(null);
    setShowDeleteConfirm(false);
  };

  const renderMetric = (label: string, value: number, color: string, borderColor: string) => (
    <View style={[styles.metricCard, { borderLeftColor: borderColor }]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.pageScrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageWrapper}>
          <View style={styles.heroBanner}>
            <View style={styles.heroBannerTextWrap}>
              <Text style={styles.heroEyebrow}>Smart School ERP Management System</Text>
              <Text style={styles.heroTitle}>Admission Inquiries</Text>
              <Text style={styles.heroDescription}>
                Track inquiries, monitor status, and manage prospective student communication from one responsive interface.
              </Text>
            </View>

            <TouchableOpacity style={styles.primaryActionButton} onPress={openCreateModal} activeOpacity={0.85}>
              <Text style={styles.primaryActionButtonText}>+ New Admission Inquiry</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.analyticsRow, isMobile ? styles.analyticsRowMobile : styles.analyticsRowWeb]}>
            {renderMetric('Total Admissions', metrics.total, THEME.textStrong, THEME.textStrong)}
            {renderMetric('Pending', metrics.pending, THEME.warning, THEME.warning)}
            {renderMetric('In Progress', metrics.inProgress, THEME.info, THEME.info)}
            {renderMetric('Resolved', metrics.resolved, THEME.success, THEME.success)}
          </View>

          <View style={styles.controlContainer}>
            <View style={styles.searchAndGradeRow}>
              <View style={styles.searchBoxWrap}>
                <Ionicons name="search" size={18} color={THEME.textMuted} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInputElement}
                  placeholder="Search by ID, Name, Grade, or Contact..."
                  placeholderTextColor="#B78D73"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {!!searchQuery && (
                  <TouchableOpacity style={styles.clearSearchButton} onPress={() => setSearchQuery('')}>
                    <Text style={styles.clearSearchButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Flex Container for Dropdowns to easily sit side-by-side on mobile */}
              <View style={styles.dropdownsContainer}>
                <GradePicker value={gradeFilter} onChange={setGradeFilter} />
                
                <View style={styles.dateFilterWrap}>
                  {Platform.OS === 'web' ? (
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      style={styles.webNativeInputDatePicker as any}
                    />
                  ) : (
                    <View style={styles.gradeFilterButton}>
                      <Ionicons name="calendar-outline" size={18} color={THEME.textMuted} />
                      <TextInput
                        style={{ flex: 1, color: THEME.textStrong, fontWeight: '600', padding: 0, fontSize: 14.5 }}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#B78D73"
                        value={dateFilter}
                        onChangeText={setDateFilter}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabsWrapper}>
              {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => {
                const isSelected = activeFilter === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.tabItem, isSelected && styles.tabItemActive]}
                    onPress={() => setActiveFilter(status)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tabItemText, isSelected && styles.tabItemTextActive]}>{status}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <FlatList
            data={filteredInquiries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContainerStyles, { paddingBottom: 30 }, isTablet && { paddingHorizontal: 4 }]}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dataCard} onPress={() => setSelectedInquiry(item)} activeOpacity={0.85}>
                <View style={styles.dataCardHeader}>
                  <View style={styles.cardTextBlock}>
                    <Text style={styles.cardIdBadge}>{item.id}</Text>
                    <Text style={styles.cardStudentName} numberOfLines={2}>
                      {item.studentName}
                    </Text>
                    <Text style={styles.cardParentLabel} numberOfLines={2}>
                      Parent: {item.parentName}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badgeContainer,
                      item.status === 'Pending' && styles.badgePending,
                      item.status === 'In Progress' && styles.badgeProgress,
                      item.status === 'Resolved' && styles.badgeResolved,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        item.status === 'Pending' && styles.textPending,
                        item.status === 'In Progress' && styles.textProgress,
                        item.status === 'Resolved' && styles.textResolved,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.dataCardFooter}>
                  <Text style={styles.footerMetaItem} numberOfLines={1}>
                    🎯 {item.gradeOfInterest}
                  </Text>
                  <Text style={styles.footerMetaItem} numberOfLines={1}>
                    📅 {item.date}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>No inquiries found</Text>
                <Text style={styles.emptyStateText}>Try a different search term, grade, date, or change the status filter.</Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      <Modal transparent visible={!!selectedInquiry} animationType="fade" onRequestClose={() => setSelectedInquiry(null)}>
        <View style={styles.overlayGlass}>
          <View style={[styles.modalBaseCard, isMobile && styles.modalMobileCard]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeadingText}>Inquiry Details</Text>
              <Text style={styles.modalSubheadingText}>{selectedInquiry?.id}</Text>
            </View>

            <ScrollView
              style={styles.modalScrollBody}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.detailField}>
                <Text style={styles.fieldLabel}>Prospective Student</Text>
                <Text style={styles.fieldValue}>{selectedInquiry?.studentName}</Text>
              </View>

              <View style={styles.detailField}>
                <Text style={styles.fieldLabel}>Primary Parent / Guardian</Text>
                <Text style={styles.fieldValue}>{selectedInquiry?.parentName}</Text>
              </View>

              <View style={styles.detailField}>
                <Text style={styles.fieldLabel}>Telephone Channel</Text>
                <Text style={styles.fieldValue}>{selectedInquiry?.phone}</Text>
              </View>

              <View style={styles.detailField}>
                <Text style={styles.fieldLabel}>Email Endpoint</Text>
                <Text style={styles.fieldValue}>{selectedInquiry?.email || 'Not Provided'}</Text>
              </View>

              <View style={styles.detailField}>
                <Text style={styles.fieldLabel}>Target Academic Class</Text>
                <Text style={styles.fieldValue}>{selectedInquiry?.gradeOfInterest}</Text>
              </View>

              <View style={styles.detailField}>
                <Text style={styles.fieldLabel}>Logged Date</Text>
                <Text style={styles.fieldValue}>{selectedInquiry?.date}</Text>
              </View>

              <View style={styles.detailField}>
                <Text style={styles.fieldLabel}>Detailed Communication Log</Text>
                <Text style={styles.fieldValueNotes}>{selectedInquiry?.notes || 'No descriptive summary.'}</Text>
              </View>
            </ScrollView>

            <View style={styles.detailActionRow}>
              <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                <Text style={styles.editButtonText}>Edit Record</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={openDeleteConfirm}>
                <Text style={styles.deleteButtonText}>Delete Record</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.dismissDetailsButton} onPress={() => setSelectedInquiry(null)}>
              <Text style={styles.dismissDetailsButtonText}>Close View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showDeleteConfirm} animationType="fade" onRequestClose={() => setShowDeleteConfirm(false)}>
        <View style={styles.overlayGlass}>
          <View style={[styles.confirmCard, isMobile && styles.modalMobileCard]}>
            <Text style={styles.confirmTitle}>Delete record?</Text>
            <Text style={styles.confirmText}>This action will permanently remove the inquiry record from the list.</Text>

            <View style={styles.confirmButtonRow}>
              <TouchableOpacity style={[styles.confirmButton, styles.confirmCancelButton]} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.confirmButton, styles.confirmDeleteButton]} onPress={handleDeleteInquiry}>
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={isCreateModalOpen} animationType="slide" onRequestClose={() => setIsCreateModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalKeyboardWrapper}>
          <View style={styles.overlayGlass}>
            <View style={[styles.modalBaseCard, isMobile && styles.modalMobileCard]}>
              <Text style={styles.modalHeadingText}>{isEditMode ? 'Update Inquiry' : 'Log New Inquiry'}</Text>
              <Text style={styles.modalFormInstruction}>
                {isEditMode ? 'Update the inquiry details below.' : 'Provide prospect and contact details.'}
              </Text>

              <ScrollView
                contentContainerStyle={styles.formScrollContent}
                style={styles.formInnerScrollContainer}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.formInputLabel}>
                  Student Name <Text style={styles.requiredMark}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInputField}
                  value={form.studentName}
                  onChangeText={(val) => setForm({ ...form, studentName: val })}
                  placeholder="Enter full name"
                  placeholderTextColor="#B78D73"
                />

                <Text style={styles.formInputLabel}>
                  Parent or Guardian Name <Text style={styles.requiredMark}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInputField}
                  value={form.parentName}
                  onChangeText={(val) => setForm({ ...form, parentName: val })}
                  placeholder="Enter guardian name"
                  placeholderTextColor="#B78D73"
                />

                <Text style={styles.formInputLabel}>
                  Primary Phone Contact <Text style={styles.requiredMark}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInputField}
                  value={form.phone}
                  onChangeText={(val) => setForm({ ...form, phone: val })}
                  keyboardType="phone-pad"
                  placeholder="e.g. +91 99999 88888"
                  placeholderTextColor="#B78D73"
                />

                <Text style={styles.formInputLabel}>Email Address</Text>
                <TextInput
                  style={styles.formInputField}
                  value={form.email}
                  onChangeText={(val) => setForm({ ...form, email: val })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="parent@domain.com"
                  placeholderTextColor="#B78D73"
                />

                <FormGradePicker
                  label="Target Grade Level"
                  value={form.gradeOfInterest}
                  onChange={(val) => setForm({ ...form, gradeOfInterest: val })}
                  placeholder="Select Grade"
                />

                <Text style={styles.formInputLabel}>Communication Notes</Text>
                <TextInput
                  style={[styles.formInputField, styles.formMultiLineTextArea]}
                  value={form.notes}
                  onChangeText={(val) => setForm({ ...form, notes: val })}
                  multiline
                  textAlignVertical="top"
                  placeholder="Log details..."
                  placeholderTextColor="#B78D73"
                />
              </ScrollView>

              <View style={styles.modalActionButtonsGroup}>
                <TouchableOpacity
                  style={[styles.modalButtonBase, styles.modalButtonCancel]}
                  onPress={() => setIsCreateModalOpen(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>Discard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalButtonBase, styles.modalButtonSubmit]} onPress={handleCreateOrUpdateInquiry}>
                  <Text style={styles.modalButtonTextSubmit}>{isEditMode ? 'Update Record' : 'Save Record'}</Text>
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
  screenContainer: { flex: 1, backgroundColor: THEME.background },
  pageScrollContent: { flexGrow: 1, paddingBottom: 24 },
  pageWrapper: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },

  heroBanner: {
    backgroundColor: THEME.surfaceSoft,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
  },
  heroBannerTextWrap: { flex: 1, minWidth: 240, maxWidth: 760 },
  heroEyebrow: {
    color: THEME.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: { color: THEME.textStrong, fontSize: 26, fontWeight: '800', marginTop: 8, lineHeight: 34 },
  heroDescription: { color: THEME.text, fontSize: 14.5, marginTop: 8, lineHeight: 22 },

  primaryActionButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 18,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14.5 },

  analyticsRow: { width: '100%', marginBottom: 16 },
  analyticsRowWeb: { flexDirection: 'row', flexWrap: 'nowrap', gap: 12 },
  analyticsRowMobile: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: {
    flexGrow: 1,
    flexBasis: Platform.OS === 'web' ? '0%' : '48%',
    flexShrink: 1,
    minWidth: Platform.OS === 'web' ? 0 : 150,
    backgroundColor: THEME.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: THEME.border,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: THEME.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 1 },
      default: {},
    }),
  },
  metricLabel: {
    fontSize: 10.5,
    color: THEME.textMuted,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  metricValue: { fontSize: 22, fontWeight: '800', marginTop: 8, textAlign: 'center' },

  controlContainer: {
    padding: 16,
    backgroundColor: THEME.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 16,
  },
  searchAndGradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    width: '100%',
  },
  searchBoxWrap: {
    flex: 1,
    minWidth: 200,
    position: 'relative',
    justifyContent: 'center', // Fix container stretching edge-cases
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: 14,
    zIndex: 2,
  },
  searchInputElement: {
    backgroundColor: THEME.inputBg,
    borderRadius: 16,
    paddingHorizontal: 42,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    color: THEME.textStrong,
    borderWidth: 1,
    borderColor: '#EFD6C5',
    height: 46,
  },
  clearSearchButton: {
    position: 'absolute',
    right: 12,
    top: 12, // Fixed exact positioning instead of relying on 50%
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  clearSearchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: -1,
  },
  
  // Custom container for dropdown and date to sit nicely on mobile
  dropdownsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 260,
  },
  gradeFilterWrap: {
    flex: 1,
  },
  dateFilterWrap: {
    flex: 1,
  },

  gradeFilterButton: {
    backgroundColor: THEME.inputBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#EFD6C5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    height: 46,
  },
  gradeFilterButtonText: { fontSize: 14.5, color: THEME.textStrong, fontWeight: '700' },
  gradeFilterPlaceholder: { color: '#B78D73', fontWeight: '600' },

  webNativeInputDatePicker: {
    width: '100%',
    height: '46px',
    padding: '0 14px',
    borderRadius: '16px',
    border: '1px solid #EFD6C5',
    fontSize: '14.5px',
    color: THEME.textStrong,
    fontWeight: '600',
    fontFamily: 'inherit',
    backgroundColor: THEME.inputBg,
    boxSizing: 'border-box',
  },

  filterTabsWrapper: { flexDirection: 'row', gap: 10, marginTop: 12, paddingRight: 4 },
  tabItem: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#FFF1E4',
    borderWidth: 1,
    borderColor: '#F1D1B8',
  },
  tabItemActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  tabItemText: { fontSize: 13.5, color: THEME.text, fontWeight: '600' },
  tabItemTextActive: { color: '#FFFFFF', fontWeight: '700' },

  listContainerStyles: { paddingBottom: 20, gap: 12 },
  dataCard: {
    backgroundColor: THEME.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  dataCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  cardTextBlock: { flex: 1, minWidth: 0 },
  cardIdBadge: { fontSize: 12, fontWeight: '800', color: THEME.primaryDark, textTransform: 'uppercase', letterSpacing: 0.4 },
  cardStudentName: { fontSize: 17, fontWeight: '800', color: THEME.textStrong, marginTop: 6, flexShrink: 1 },
  cardParentLabel: { fontSize: 13.5, color: THEME.textMuted, marginTop: 4, flexShrink: 1 },
  badgeContainer: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999, alignSelf: 'flex-start' },
  badgePending: { backgroundColor: '#FFF4D6' },
  badgeProgress: { backgroundColor: '#DBEAFE' },
  badgeResolved: { backgroundColor: '#DCFCE7' },
  badgeText: { fontSize: 12.5, fontWeight: '700' },
  textPending: { color: '#B45309' },
  textProgress: { color: '#1D4ED8' },
  textResolved: { color: '#047857' },
  cardDivider: { height: 1, backgroundColor: '#F5E7DA', marginVertical: 14 },
  dataCardFooter: { flexDirection: 'row', gap: 18, flexWrap: 'wrap' },
  footerMetaItem: { fontSize: 13.5, color: THEME.textMuted, fontWeight: '600' },
  emptyStateCard: {
    backgroundColor: THEME.surface,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
  },
  emptyStateTitle: { fontSize: 17, fontWeight: '800', color: THEME.textStrong },
  emptyStateText: { fontSize: 14, color: THEME.textMuted, marginTop: 6, textAlign: 'center' },

  overlayGlass: {
    flex: 1,
    backgroundColor: 'rgba(60, 33, 20, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  modalKeyboardWrapper: { flex: 1, width: '100%' },
  modalBaseCard: {
    backgroundColor: THEME.surface,
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 580,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  modalMobileCard: {
    marginHorizontal: 10,
    width: '95%',
    maxHeight: '94%',
    padding: 16,
  },
  modalHeaderRow: {
    borderBottomWidth: 1,
    borderColor: '#F0E3D7',
    paddingBottom: 14,
    marginBottom: 12,
  },
  modalHeadingText: { fontSize: 22, fontWeight: '800', color: THEME.textStrong },
  modalSubheadingText: { fontSize: 13.5, color: THEME.primaryDark, marginTop: 4, fontWeight: '700' },
  modalFormInstruction: { fontSize: 14, color: THEME.textMuted, marginTop: 6, marginBottom: 4 },
  modalScrollBody: { flexGrow: 0 },
  modalScrollContent: { paddingBottom: 12 },
  detailField: { marginBottom: 6 },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: THEME.textMuted,
    textTransform: 'uppercase',
    marginTop: 16,
    letterSpacing: 0.4,
  },
  fieldValue: { fontSize: 16, color: THEME.textStrong, marginTop: 5, lineHeight: 23, flexShrink: 1 },
  fieldValueNotes: {
    fontSize: 15,
    color: THEME.text,
    lineHeight: 24,
    marginTop: 6,
    backgroundColor: '#FFF7F1',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1D1B8',
  },
  detailActionRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  editButton: { flex: 1, backgroundColor: '#DBEAFE', paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
  editButtonText: { color: '#1D4ED8', fontWeight: '700', fontSize: 14.5 },
  deleteButton: { flex: 1, backgroundColor: '#FEE2E2', paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
  deleteButtonText: { color: '#B91C1C', fontWeight: '700', fontSize: 14.5 },
  dismissDetailsButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  dismissDetailsButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  confirmCard: {
    backgroundColor: THEME.surface,
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  confirmTitle: { fontSize: 20, fontWeight: '800', color: THEME.textStrong },
  confirmText: { fontSize: 14.5, color: THEME.text, marginTop: 8, lineHeight: 22 },
  confirmButtonRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  confirmButton: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  confirmCancelButton: { backgroundColor: '#FFF1E4', borderWidth: 1, borderColor: '#F1D1B8' },
  confirmDeleteButton: { backgroundColor: THEME.danger },
  confirmCancelText: { color: THEME.text, fontWeight: '700', fontSize: 15 },
  confirmDeleteText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  formInnerScrollContainer: { flexGrow: 0 },
  formScrollContent: { paddingBottom: 12 },
  formInputLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: THEME.text,
    marginTop: 14,
    marginBottom: 6,
  },
  requiredMark: { color: THEME.danger },
  formInputField: {
    borderWidth: 1,
    borderColor: '#EFD6C5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: THEME.textStrong,
    backgroundColor: THEME.inputBg,
  },
  formMultiLineTextArea: { minHeight: 110, textAlignVertical: 'top' },

  pickerTrigger: {
    backgroundColor: THEME.inputBg,
    borderWidth: 1,
    borderColor: '#EFD6C5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerTriggerText: { fontSize: 15, color: THEME.textStrong, fontWeight: '600' },
  pickerPlaceholderText: { color: '#B78D73', fontWeight: '500' },

  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(60, 33, 20, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  pickerSheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: THEME.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 18,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerTitle: { fontSize: 18, fontWeight: '800', color: THEME.textStrong },
  pickerOption: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1E1D3',
    backgroundColor: '#FFFDFC',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerOptionSelected: {
    borderColor: THEME.primary,
    backgroundColor: '#FFF1EA',
  },
  pickerOptionText: { fontSize: 15, color: THEME.textStrong, fontWeight: '600' },
  pickerOptionTextSelected: { color: THEME.primaryDark },
  pickerClearBtn: {
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#FFF1E4',
    borderWidth: 1,
    borderColor: '#F1D1B8',
  },
  pickerClearText: { color: THEME.text, fontWeight: '700' },

  modalActionButtonsGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
  modalButtonBase: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#FFF1E4', borderWidth: 1, borderColor: '#F1D1B8' },
  modalButtonSubmit: { backgroundColor: THEME.primary },
  modalButtonTextCancel: { color: THEME.text, fontWeight: '700', fontSize: 15 },
  modalButtonTextSubmit: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});