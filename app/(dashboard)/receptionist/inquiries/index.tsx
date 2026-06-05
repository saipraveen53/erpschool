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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface InquiryRecord {
  id: string;
  date: string;
  prospectName: string;
  phone: string;
  email: string;
  type: 'General' | 'Admission' | 'Fees' | 'Transport';
  source: 'Walk-In' | 'Website' | 'Phone Call';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved';
  details: string;
  resolutionNotes?: string;
}

const MOCK_INQUIRIES: InquiryRecord[] = [
  {
    id: 'INQ-2026-001',
    date: '2026-05-29',
    prospectName: 'Meenakshi Iyer',
    phone: '+91 94440 12345',
    email: 'meenakshi.iyer@gmail.com',
    type: 'Admission',
    source: 'Walk-In',
    priority: 'High',
    status: 'Pending',
    details:
      'Seeking immediate mid-term admission availability for Grade 8. Needs details regarding syllabus alignment and second language choices.',
  },
  {
    id: 'INQ-2026-002',
    date: '2026-05-29',
    prospectName: 'Kapil Dev Malhotra',
    phone: '+91 98100 55667',
    email: 'kdm.malhotra@gmail.com',
    type: 'Fees',
    source: 'Phone Call',
    priority: 'Medium',
    status: 'In Progress',
    details:
      'Inquiring if corporate installments or quarterly fee structures apply for long-term sibling admissions.',
  },
  {
    id: 'INQ-2026-003',
    date: '2026-05-28',
    prospectName: 'Sunita Deshmukh',
    phone: '+91 88888 44321',
    email: 'sunita.d@gmail.com',
    type: 'Transport',
    source: 'Website',
    priority: 'Low',
    status: 'Resolved',
    details:
      'Verifying if school transport services stretch beyond the current city limits to the technological park zone.',
    resolutionNotes:
      'Route manager mapped coordinate lines. Confirmed bus pickup point alternate route 12 stands operational nearby.',
  },
];

export default function InquiriesLog() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [isMounted, setIsMounted] = useState(false);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(MOCK_INQUIRIES);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Dropdown Open States
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<InquiryRecord | null>(null);

  const [resolutionModalVisible, setResolutionModalVisible] = useState(false);
  const [resolutionText, setResolutionText] = useState('');
  const [resolutionTargetId, setResolutionTargetId] = useState<string | null>(null);

  // Success Modal State
  const [successModal, setSuccessModal] = useState({ visible: false, title: '', message: '' });

  // Form States & Validation Errors
  const [form, setForm] = useState({
    prospectName: '',
    phone: '',
    email: '',
    type: 'Admission' as InquiryRecord['type'],
    source: 'Walk-In' as InquiryRecord['source'],
    priority: 'Medium' as InquiryRecord['priority'],
    details: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [updateForm, setUpdateForm] = useState({
    prospectName: '',
    phone: '',
    email: '',
    type: 'Admission' as InquiryRecord['type'],
    source: 'Walk-In' as InquiryRecord['source'],
    priority: 'Medium' as InquiryRecord['priority'],
    details: '',
  });
  const [updateFormErrors, setUpdateFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const crmMetrics = useMemo(() => {
    return inquiries.reduce(
      (acc, curr) => {
        acc.total++;
        if (curr.status === 'Pending') acc.open++;
        if (curr.status === 'In Progress') acc.progress++;
        if (curr.status === 'Resolved') acc.resolved++;
        return acc;
      },
      { total: 0, open: 0, progress: 0, resolved: 0 }
    );
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.prospectName.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
      const matchesDate = !dateFilter || item.date === dateFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesDate;
    });
  }, [inquiries, searchQuery, statusFilter, typeFilter, priorityFilter, dateFilter]);

  // Unified Strict Validation Function
  const validateForm = (data: typeof form, setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
    const errors: Record<string, string> = {};
    
    // Name Validation (At least 6 characters)
    if (!data.prospectName.trim()) {
      errors.prospectName = 'Prospect Name is required.';
    } else if (data.prospectName.trim().length < 6) {
      errors.prospectName = 'Name must be at least 6 characters long.';
    }

    // Phone Validation (Exactly 10 digits starting with 6 or 9)
    const cleanPhone = data.phone.replace(/[\s\-\+]/g, '');
    const phoneToTest = cleanPhone.startsWith('91') && cleanPhone.length === 12 ? cleanPhone.slice(2) : cleanPhone;
    
   if (!form.phone.trim()) {
      errors.phone = 'Phone Number is required.';
    } else if (!/^[6978]\d{9}$/.test(phoneToTest)) {
      errors.phone = 'Phone must be exactly 10 digits and start with 6, 9, 7, or 8.';
    }

    // Email Validation (Must have @gmail.com)
    if (!data.email.trim()) {
      errors.email = 'Email Address is required.';
    } else if (!data.email.toLowerCase().endsWith('@gmail.com')) {
      errors.email = 'Please enter a valid @gmail.com address.';
    }

    // Details Validation
    if (!data.details.trim()) {
      errors.details = 'Details description is required.';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateInquiry = () => {
    if (!validateForm(form, setFormErrors)) return;

    const newInquiry: InquiryRecord = {
      id: `INQ-2026-0${inquiries.length + 4}`,
      date: new Date().toISOString().split('T')[0],
      prospectName: form.prospectName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      type: form.type,
      source: form.source,
      priority: form.priority,
      status: 'Pending',
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
    setFormErrors({});
    setIsCreateModalOpen(false);
    
    // Trigger Success Modal
    setSuccessModal({ visible: true, title: 'Success!', message: 'New inquiry added successfully.' });
  };

  const handleUpdateInquiry = () => {
    if (!validateForm(updateForm, setUpdateFormErrors)) return;
    if (!selectedInquiry) return;

    const updatedInquiries = inquiries.map((item) =>
      item.id === selectedInquiry.id
        ? {
            ...item,
            prospectName: updateForm.prospectName.trim(),
            phone: updateForm.phone.trim(),
            email: updateForm.email.trim(),
            type: updateForm.type,
            source: updateForm.source,
            priority: updateForm.priority,
            details: updateForm.details.trim(),
          }
        : item
    );

    setInquiries(updatedInquiries);
    setUpdateForm({
      prospectName: '',
      phone: '',
      email: '',
      type: 'Admission',
      source: 'Walk-In',
      priority: 'Medium',
      details: '',
    });
    setUpdateFormErrors({});
    setSelectedInquiry(null);
    setIsUpdateModalOpen(false);
    
    // Trigger Success Modal
    setSuccessModal({ visible: true, title: 'Updated!', message: 'Inquiry updated successfully.' });
  };

  const handleDeleteInquiry = () => {
    if (!inquiryToDelete) return;

    setInquiries(inquiries.filter((item) => item.id !== inquiryToDelete.id));
    setInquiryToDelete(null);
    setSuccessModal({ visible: true, title: 'Deleted', message: 'Inquiry record has been removed.' });
  };

  const openUpdateModal = (inquiry: InquiryRecord) => {
    setSelectedInquiry(inquiry);
    setUpdateForm({
      prospectName: inquiry.prospectName,
      phone: inquiry.phone,
      email: inquiry.email,
      type: inquiry.type,
      source: inquiry.source,
      priority: inquiry.priority,
      details: inquiry.details,
    });
    setUpdateFormErrors({});
    setIsUpdateModalOpen(true);
  };

  const clearSearch = () => setSearchQuery('');

  const updateInquiryStatus = (
    id: string,
    nextStatus: InquiryRecord['status'],
    resolutionTextValue?: string
  ) => {
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              resolutionNotes: resolutionTextValue || item.resolutionNotes,
            }
          : item
      )
    );

    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              resolutionNotes: resolutionTextValue || prev.resolutionNotes,
            }
          : null
      );
    }
  };

  const openResolutionModal = (id: string) => {
    const current = inquiries.find((item) => item.id === id);

    setResolutionTargetId(id);
    setResolutionText(current?.resolutionNotes || '');
    setSelectedInquiry(null);

    setTimeout(() => {
      setResolutionModalVisible(true);
    }, 100);
  };

  const submitResolution = () => {
    if (!resolutionTargetId) return;

    if (!resolutionText.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please enter resolution notes.');
      } else {
        Alert.alert('Validation Warning', 'Please enter resolution notes.');
      }
      return;
    }

    updateInquiryStatus(resolutionTargetId, 'Resolved', resolutionText.trim());

    setResolutionModalVisible(false);
    setResolutionTargetId(null);
    setResolutionText('');
    setSuccessModal({ visible: true, title: 'Resolved', message: 'Inquiry resolved successfully.' });
  };

  if (!isMounted) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.fallbackText}>Loading Prospect Inquiries Log...</Text>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={{ zIndex: 9999 }}>
      <View style={styles.topHeaderPanel}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandTitleText}>Inquiries</Text>
          <Text style={styles.brandSubtitleText}>
            Track walk-in applications, route admission queries, and update resolution states.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerPrimaryAction}
          onPress={() => {
            setFormErrors({});
            setIsCreateModalOpen(true);
          }}
        >
          <Text style={styles.headerPrimaryActionText}>+ New Inquiry</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricsSummaryRow}>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#7F1D1D' }]}>
          <Text style={styles.metricLabelText}>TOTAL INQUIRIES</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.total}</Text>
        </View>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#DC2626' }]}>
          <Text style={styles.metricLabelText}>PENDING</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.open}</Text>
        </View>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#EF4444' }]}>
          <Text style={styles.metricLabelText}>IN PROGRESS</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.progress}</Text>
        </View>
        <View style={[styles.metricDisplayCard, { borderLeftColor: '#16A34A' }]}>
          <Text style={styles.metricLabelText}>RESOLVED</Text>
          <Text style={styles.metricValueNumber}>{crmMetrics.resolved}</Text>
        </View>
      </View>

      <View style={[styles.controlFilteringBox, { zIndex: 9999, ...(Platform.OS === 'web' ? { position: 'relative' } : {}) }]}>
        
        <View style={[isMobile ? styles.filterRowMobile : styles.filterRowWeb, { zIndex: 9999 }]}>
          
          <View style={[styles.filterItemSearch, isMobile && styles.filterItemHalf]}>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={16} color="#B91C1C" style={styles.searchIcon} />
              <TextInput
                style={styles.globalSearchBox}
                placeholder="Search name, ID..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch} activeOpacity={0.7}>
                  <Icon name="times" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={[styles.filterItem, { zIndex: 3000 }, isMobile && styles.filterItemHalf]}>
            <TouchableOpacity
              style={styles.dropdownSelectorBox}
              onPress={() => {
                setIsTypeDropdownOpen(!isTypeDropdownOpen);
                setIsPriorityDropdownOpen(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                {typeFilter === 'All' ? 'All Types' : typeFilter}
              </Text>
              <Icon name={isTypeDropdownOpen ? 'caret-up' : 'caret-down'} size={12} color="#7F1D1D" />
            </TouchableOpacity>
            
            {isTypeDropdownOpen && (
              <View style={styles.floatingDropdownList}>
                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                  {['All', 'Admission', 'Fees', 'Transport', 'General'].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.dropdownListItem, typeFilter === opt && styles.dropdownListItemActive]}
                      onPress={() => {
                        setTypeFilter(opt);
                        setIsTypeDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownListItemText, typeFilter === opt && styles.dropdownListItemTextActive]}>{opt === 'All' ? 'All Types' : opt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={[styles.filterItem, { zIndex: 2000 }, isMobile && styles.filterItemHalf]}>
            <TouchableOpacity
              style={styles.dropdownSelectorBox}
              onPress={() => {
                setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
                setIsTypeDropdownOpen(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                {priorityFilter === 'All' ? 'All Priorities' : priorityFilter}
              </Text>
              <Icon name={isPriorityDropdownOpen ? 'caret-up' : 'caret-down'} size={12} color="#7F1D1D" />
            </TouchableOpacity>
            
            {isPriorityDropdownOpen && (
              <View style={styles.floatingDropdownList}>
                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                  {['All', 'High', 'Medium', 'Low'].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.dropdownListItem, priorityFilter === opt && styles.dropdownListItemActive]}
                      onPress={() => {
                        setPriorityFilter(opt);
                        setIsPriorityDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownListItemText, priorityFilter === opt && styles.dropdownListItemTextActive]}>{opt === 'All' ? 'All Priorities' : opt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={[styles.filterItem, { zIndex: 1000 }, isMobile && styles.filterItemHalf]}>
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
                  style={styles.globalSearchBox}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
                  value={dateFilter}
                  onChangeText={setDateFilter}
                />
              )}
            </View>
          </View>

        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabFilterPillsWrapper}>
          {[
            { title: 'All Inquiries', key: 'All' },
            { title: 'Pending', key: 'Pending' },
            { title: 'In Progress', key: 'In Progress' },
            { title: 'Resolved', key: 'Resolved' },
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
    </View>
  );

  return (
    <SafeAreaView style={styles.viewRootContainer}>
      <FlatList
        data={filteredInquiries}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, zIndex: 1 }}
        contentContainerStyle={[styles.pageScrollContent, { zIndex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ zIndex: 9999 }} 
        ListEmptyComponent={
          <View style={styles.emptyStateContainerBox}>
            <Icon name="info-circle" size={48} color="#B91C1C" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyStateMsg}>No inquiries found matching your filters.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.dataLogItemCard, { zIndex: 1 }]}>
            <TouchableOpacity onPress={() => setSelectedInquiry(item)} activeOpacity={0.85}>
              <View style={styles.cardHeaderFlexRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.metaRowBadging}>
                    <Text style={styles.cardRecordId}>{item.id}</Text>
                    <Text style={styles.cardTypeLabel}>{item.type}</Text>
                  </View>
                  <Text style={styles.prospectNameHeading}>{item.prospectName}</Text>
                </View>

                <View
                  style={[
                    styles.professionalStatusBadge,
                    item.status === 'Pending' && styles.professionalStatusOpen,
                    item.status === 'In Progress' && styles.professionalStatusProgress,
                    item.status === 'Resolved' && styles.professionalStatusResolved,
                  ]}
                >
                  <Text
                    style={[
                      styles.professionalStatusText,
                      item.status === 'Pending' && styles.professionalStatusTextOpen,
                      item.status === 'In Progress' && styles.professionalStatusTextProgress,
                      item.status === 'Resolved' && styles.professionalStatusTextResolved,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardBodyExcerptText} numberOfLines={3}>
                {item.details}
              </Text>

              <View style={styles.cardFooterLayoutFlex}>
                <View style={styles.footerItem}>
                  <Icon name="calendar" size={13} color="#9F1239" style={{ marginRight: 6 }} />
                  <Text style={styles.footerMetaLabel}>{item.date}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Icon name="link" size={13} color="#9F1239" style={{ marginRight: 6 }} />
                  <Text style={styles.footerMetaLabel}>{item.source}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Icon name="phone" size={13} color="#9F1239" style={{ marginRight: 6 }} />
                  <Text style={styles.footerMetaLabel}>{item.phone}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.cardActionButtons}>
              <TouchableOpacity style={styles.actionButtonUpdate} onPress={() => openUpdateModal(item)}>
                {/* <Icon name="pencil" size={14} color="#7F1D1D" style={{ marginRight: 6 }} /> */}
                <Text style={styles.actionButtonTextUpdate}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonDelete} onPress={() => setInquiryToDelete(item)}>
                {/* <Icon name="trash" size={14} color="#B91C1C" style={{ marginRight: 6 }} /> */}
                <Text style={styles.actionButtonTextDelete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Detail View Modal */}
      {selectedInquiry && (
        <Modal
          transparent
          visible={!!selectedInquiry}
          animationType="fade"
          onRequestClose={() => setSelectedInquiry(null)}
        >
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

                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Priority</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.priority}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dossierFieldLabel}>Status</Text>
                    <Text style={styles.dossierFieldValue}>{selectedInquiry.status}</Text>
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
                      {selectedInquiry.status === 'Pending' && (
                        <TouchableOpacity
                          style={[styles.workflowActionButtonItem, { backgroundColor: '#FEE2E2' }]}
                          onPress={() => updateInquiryStatus(selectedInquiry.id, 'In Progress')}
                        >
                          <Text style={{ color: '#991B1B', fontWeight: '600' }}>Mark In Progress</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[styles.workflowActionButtonItem, { backgroundColor: '#DCFCE7' }]}
                        onPress={() => openResolutionModal(selectedInquiry.id)}
                      >
                        <Text style={{ color: '#047857', fontWeight: '600' }}>Mark Resolved</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.dismissDetailsModalBtn} onPress={() => setSelectedInquiry(null)}>
                <Icon name="times" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.dismissDetailsModalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Resolution Notes Modal */}
      <Modal
        transparent
        visible={resolutionModalVisible}
        animationType="fade"
        onRequestClose={() => setResolutionModalVisible(false)}
      >
        <View style={styles.glassviewOverlayScreen}>
          <View style={[styles.modalBodyCardLayout, { width: '92%', maxWidth: 460, flexShrink: 1 }]}>
            <Text style={styles.modalMainHeaderTitle}>Resolution Notes</Text>
            <Text style={styles.modalMainHeaderSubtitle}>Enter the resolution message for this inquiry</Text>

            <TextInput
              style={[styles.formInputBoxControl, styles.formMultiLineTextBoxElement, { marginTop: 16 }]}
              placeholder="Type resolution notes here..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              value={resolutionText}
              onChangeText={setResolutionText}
            />

            <View style={styles.formActionLayoutButtonsGroup}>
              <TouchableOpacity
                style={[styles.formActionBtnBase, styles.formActionBtnCancel]}
                onPress={() => {
                  setResolutionModalVisible(false);
                  setResolutionTargetId(null);
                  setResolutionText('');
                }}
              >
                <Text style={styles.formActionBtnTextCancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.formActionBtnBase, styles.formActionBtnSubmit]} onPress={submitResolution}>
                <Text style={styles.formActionBtnTextSubmit}>Save Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Inquiry Modal */}
      <Modal
        transparent
        visible={isCreateModalOpen}
        animationType="slide"
        onRequestClose={() => {
          setIsCreateModalOpen(false);
          setFormErrors({});
        }}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.glassviewOverlayScreen}>
            <View style={[styles.modalBodyCardLayout, { width: '95%', maxHeight: '90%' }, isMobile && { margin: 12, width: '94%' }]}>
              <Text style={styles.modalMainHeaderTitle}>New Inquiry</Text>
              <Text style={styles.modalMainHeaderSubtitle}>Record a new prospect inquiry</Text>

              <ScrollView
                style={{ flexShrink: 1, width: '100%' }}
                contentContainerStyle={{ paddingBottom: 24, paddingTop: 10 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.formFieldLabelText}>
                  Prospect Name <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.formInputBoxControl, formErrors.prospectName && styles.formInputErrorBorder]}
                  placeholder="Full Name"
                  placeholderTextColor="#B91C1C"
                  value={form.prospectName}
                  onChangeText={(text) => {
                    setForm((prev) => ({ ...prev, prospectName: text }));
                    if (formErrors.prospectName) setFormErrors(prev => ({...prev, prospectName: ''}));
                  }}
                  returnKeyType="next"
                />
                {formErrors.prospectName && <Text style={styles.errorText}>{formErrors.prospectName}</Text>}

                <Text style={styles.formFieldLabelText}>
                  Phone <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.formInputBoxControl, formErrors.phone && styles.formInputErrorBorder]}
                  placeholder="+91 XXXXXXXXXX"
                  placeholderTextColor="#B91C1C"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(text) => {
                    setForm((prev) => ({ ...prev, phone: text }));
                    if (formErrors.phone) setFormErrors(prev => ({...prev, phone: ''}));
                  }}
                />
                {formErrors.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}

                <Text style={styles.formFieldLabelText}>
                  Email <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.formInputBoxControl, formErrors.email && styles.formInputErrorBorder]}
                  placeholder="email@gmail.com"
                  placeholderTextColor="#B91C1C"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(text) => {
                    setForm((prev) => ({ ...prev, email: text }));
                    if (formErrors.email) setFormErrors(prev => ({...prev, email: ''}));
                  }}
                />
                {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}

                <Text style={styles.formFieldLabelText}>Inquiry Type</Text>
                <View style={styles.customPickerRowLayout}>
                  {(['Admission', 'Fees', 'Transport', 'General'] as const).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[styles.customPickerItemBadge, form.type === category && styles.customPickerItemActive]}
                      onPress={() => setForm((prev) => ({ ...prev, type: category }))}
                    >
                      <Text
                        style={[
                          styles.customPickerItemText,
                          form.type === category && styles.customPickerItemTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formFieldLabelText}>Priority</Text>
                <View style={styles.customPickerRowLayout}>
                  {(['High', 'Medium', 'Low'] as const).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[styles.customPickerItemBadge, form.priority === priority && styles.customPickerItemActive]}
                      onPress={() => setForm((prev) => ({ ...prev, priority }))}
                    >
                      <Text
                        style={[
                          styles.customPickerItemText,
                          form.priority === priority && styles.customPickerItemTextActive,
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
                  style={[styles.formInputBoxControl, styles.formMultiLineTextBoxElement, formErrors.details && styles.formInputErrorBorder]}
                  placeholder="Describe the inquiry..."
                  placeholderTextColor="#B91C1C"
                  multiline
                  textAlignVertical="top"
                  value={form.details}
                  onChangeText={(text) => {
                    setForm((prev) => ({ ...prev, details: text }));
                    if (formErrors.details) setFormErrors(prev => ({...prev, details: ''}));
                  }}
                />
                {formErrors.details && <Text style={styles.errorText}>{formErrors.details}</Text>}
              </ScrollView>

              <View style={styles.formActionLayoutButtonsGroup}>
                <TouchableOpacity
                  style={[styles.formActionBtnBase, styles.formActionBtnCancel]}
                  onPress={() => {
                    setIsCreateModalOpen(false);
                    setFormErrors({});
                  }}
                >
                  <Text style={styles.formActionBtnTextCancel}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.formActionBtnBase, styles.formActionBtnSubmit]}
                  onPress={handleCreateInquiry}
                >
                  <Text style={styles.formActionBtnTextSubmit}>Create Inquiry</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Update Inquiry Modal */}
      {isUpdateModalOpen && selectedInquiry && (
        <Modal
          transparent
          visible={isUpdateModalOpen}
          animationType="slide"
          onRequestClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedInquiry(null);
            setUpdateFormErrors({});
          }}
        >
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.glassviewOverlayScreen}>
              <View style={[styles.modalBodyCardLayout, isMobile && { margin: 12, width: '94%', maxHeight: '90%' }, { flexShrink: 1 }]}>
                <Text style={styles.modalMainHeaderTitle}>Update Inquiry</Text>
                <Text style={styles.modalMainHeaderSubtitle}>Edit inquiry {selectedInquiry.id}</Text>

                <ScrollView
                  style={{ flexShrink: 1, width: '100%' }}
                  contentContainerStyle={{ paddingBottom: 24, paddingTop: 10 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.formFieldLabelText}>
                    Prospect Name <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.formInputBoxControl, updateFormErrors.prospectName && styles.formInputErrorBorder]}
                    placeholder="Full Name"
                    placeholderTextColor="#B91C1C"
                    value={updateForm.prospectName}
                    onChangeText={(text) => {
                      setUpdateForm((prev) => ({ ...prev, prospectName: text }));
                      if (updateFormErrors.prospectName) setUpdateFormErrors(prev => ({...prev, prospectName: ''}));
                    }}
                  />
                  {updateFormErrors.prospectName && <Text style={styles.errorText}>{updateFormErrors.prospectName}</Text>}

                  <Text style={styles.formFieldLabelText}>
                    Phone <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.formInputBoxControl, updateFormErrors.phone && styles.formInputErrorBorder]}
                    placeholder="+91 XXXXXXXXXX"
                    placeholderTextColor="#B91C1C"
                    keyboardType="phone-pad"
                    value={updateForm.phone}
                    onChangeText={(text) => {
                      setUpdateForm((prev) => ({ ...prev, phone: text }));
                      if (updateFormErrors.phone) setUpdateFormErrors(prev => ({...prev, phone: ''}));
                    }}
                  />
                  {updateFormErrors.phone && <Text style={styles.errorText}>{updateFormErrors.phone}</Text>}

                  <Text style={styles.formFieldLabelText}>
                    Email <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.formInputBoxControl, updateFormErrors.email && styles.formInputErrorBorder]}
                    placeholder="email@gmail.com"
                    placeholderTextColor="#B91C1C"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={updateForm.email}
                    onChangeText={(text) => {
                      setUpdateForm((prev) => ({ ...prev, email: text }));
                      if (updateFormErrors.email) setUpdateFormErrors(prev => ({...prev, email: ''}));
                    }}
                  />
                  {updateFormErrors.email && <Text style={styles.errorText}>{updateFormErrors.email}</Text>}

                  <Text style={styles.formFieldLabelText}>Inquiry Type</Text>
                  <View style={styles.customPickerRowLayout}>
                    {(['Admission', 'Fees', 'Transport', 'General'] as const).map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.customPickerItemBadge,
                          updateForm.type === category && styles.customPickerItemActive,
                        ]}
                        onPress={() => setUpdateForm((prev) => ({ ...prev, type: category }))}
                      >
                        <Text
                          style={[
                            styles.customPickerItemText,
                            updateForm.type === category && styles.customPickerItemTextActive,
                          ]}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.formFieldLabelText}>Priority</Text>
                  <View style={styles.customPickerRowLayout}>
                    {(['High', 'Medium', 'Low'] as const).map((priority) => (
                      <TouchableOpacity
                        key={priority}
                        style={[
                          styles.customPickerItemBadge,
                          updateForm.priority === priority && styles.customPickerItemActive,
                        ]}
                        onPress={() => setUpdateForm((prev) => ({ ...prev, priority }))}
                      >
                        <Text
                          style={[
                            styles.customPickerItemText,
                            updateForm.priority === priority && styles.customPickerItemTextActive,
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
                    style={[styles.formInputBoxControl, styles.formMultiLineTextBoxElement, updateFormErrors.details && styles.formInputErrorBorder]}
                    placeholder="Describe the inquiry..."
                    placeholderTextColor="#B91C1C"
                    multiline
                    textAlignVertical="top"
                    value={updateForm.details}
                    onChangeText={(text) => {
                      setUpdateForm((prev) => ({ ...prev, details: text }));
                      if (updateFormErrors.details) setUpdateFormErrors(prev => ({...prev, details: ''}));
                    }}
                  />
                  {updateFormErrors.details && <Text style={styles.errorText}>{updateFormErrors.details}</Text>}
                </ScrollView>

                <View style={styles.formActionLayoutButtonsGroup}>
                  <TouchableOpacity
                    style={[styles.formActionBtnBase, styles.formActionBtnCancel]}
                    onPress={() => {
                      setIsUpdateModalOpen(false);
                      setSelectedInquiry(null);
                      setUpdateFormErrors({});
                    }}
                  >
                    <Text style={styles.formActionBtnTextCancel}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.formActionBtnBase, styles.formActionBtnSubmit]} onPress={handleUpdateInquiry}>
                    <Text style={styles.formActionBtnTextSubmit}>Update Inquiry</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* Delete Inquiry Modal */}
      {inquiryToDelete && (
        <Modal transparent visible={!!inquiryToDelete} animationType="fade" onRequestClose={() => setInquiryToDelete(null)}>
          <View style={styles.glassviewOverlayScreen}>
            <View style={[styles.modalBodyCardLayout, isMobile && { margin: 12, width: '94%' }, styles.deleteConfirmCard]}>
              <View style={styles.deleteIconWrapper}>
                <Icon name="trash-o" size={48} color="#B91C1C" />
              </View>
              <Text style={styles.deleteConfirmTitle}>Delete Inquiry?</Text>
              <Text style={styles.deleteConfirmSubtitle}>
                Are you sure you want to delete "{inquiryToDelete.prospectName}" inquiry?
              </Text>
              <Text style={styles.deleteConfirmWarning}>This action cannot be undone.</Text>

              <View style={styles.deleteConfirmActions}>
                <TouchableOpacity
                  style={[styles.formActionBtnBase, styles.formActionBtnCancel]}
                  onPress={() => setInquiryToDelete(null)}
                >
                  <Text style={styles.formActionBtnTextCancel}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.formActionBtnBase, styles.formActionBtnSubmit, styles.deleteConfirmButton]}
                  onPress={handleDeleteInquiry}
                >
                  <Text style={styles.formActionBtnTextSubmit}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* SUCCESS MODAL POPUP */}
      <Modal transparent visible={successModal.visible} animationType="fade" onRequestClose={() => setSuccessModal((p) => ({...p, visible: false}))}>
        <View style={styles.glassviewOverlayScreen}>
          <View style={[styles.modalBodyCardLayout, isMobile && { margin: 12, width: '94%' }, styles.deleteConfirmCard]}>
            <View style={[styles.deleteIconWrapper, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <Icon name="check" size={40} color="#16A34A" />
            </View>
            <Text style={styles.deleteConfirmTitle}>{successModal.title}</Text>
            <Text style={styles.deleteConfirmSubtitle}>{successModal.message}</Text>
            
            <View style={styles.deleteConfirmActions}>
              <TouchableOpacity
                style={[styles.formActionBtnBase, styles.formActionBtnSubmit, { backgroundColor: '#16A34A' }]}
                onPress={() => setSuccessModal((p) => ({...p, visible: false}))}
              >
                <Text style={styles.formActionBtnTextSubmit}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: { flex: 1, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center' },
  fallbackText: { marginTop: 12, color: '#B91C1C', fontSize: 14 },

  viewRootContainer: { flex: 1, backgroundColor: '#FFF1F2' },
  pageScrollContent: { paddingBottom: 18 },

  topHeaderPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#FECACA',
  },
  brandTitleText: { fontSize: 22, fontWeight: '700', color: '#7F1D1D' },
  brandSubtitleText: { fontSize: 13, color: '#9A3412', marginTop: 4 },

  headerPrimaryAction: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginLeft: 12,
  },
  headerPrimaryActionText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14.5 },

  metricsSummaryRow: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  metricDisplayCard: {
    flex: 1,
    minWidth: 135,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  metricLabelText: { fontSize: 12, color: '#9A3412', fontWeight: '600', textTransform: 'uppercase' },
  metricValueNumber: { fontSize: 26, fontWeight: '700', marginTop: 8, color: '#7F1D1D' },

  controlFilteringBox: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#FECACA' },

  // --- RESPONSIVE 4-FILTER ROW STYLES ---
  filterRowWeb: { flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 9999 },
  filterRowMobile: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, zIndex: 9999 },
  filterItemSearch: { flex: 1.5, position: 'relative', zIndex: 1 },
  filterItem: { flex: 1, position: 'relative' },
  filterItemHalf: { minWidth: '47%' },

  searchInputContainer: { position: 'relative', justifyContent: 'center' },
  searchIcon: { position: 'absolute', left: 14, top: 15, zIndex: 2 },
  globalSearchBox: {
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48, 
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    color: '#7F1D1D',
    paddingRight: 42,
    paddingLeft: 42,
  },
  clearSearchButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    zIndex: 5,
  },
  clearSearchButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // --- DROPDOWN SELECTOR UI STYLES ---
  dropdownSelectorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dropdownSelectorText: { fontSize: 14, color: '#7F1D1D', fontWeight: '600' },
  dropdownIconText: { fontSize: 10, color: '#9A3412', marginLeft: 8 },
  floatingDropdownList: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    maxHeight: 250,
    overflow: 'hidden',
    zIndex: 99999,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
      android: { elevation: 15 },
      default: {},
    }),
  },
  dropdownListItem: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#FFF1F2' },
  dropdownListItemActive: { backgroundColor: '#FEF2F2' },
  dropdownListItemText: { fontSize: 14, color: '#4B5563' },
  dropdownListItemTextActive: { color: '#DC2626', fontWeight: '700' },

  webNativeInputDatePicker: {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    borderRadius: '12px',
    border: '1px solid #FECACA',
    fontSize: '14px',
    color: '#7F1D1D',
    fontWeight: '600',
    fontFamily: 'inherit',
    backgroundColor: '#FFF1F2',
    boxSizing: 'border-box',
  },
  // ----------------------------------------

  tabFilterPillsWrapper: { flexDirection: 'row', marginTop: 14 },
  filterPillItem: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFF1F2',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  filterPillItemActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  filterPillText: { fontSize: 13, color: '#7F1D1D', fontWeight: '500' },
  filterPillTextActive: { color: '#FFFFFF', fontWeight: '600' },

  dataLogItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardHeaderFlexRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  metaRowBadging: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  cardRecordId: { fontSize: 13, fontWeight: '700', color: '#DC2626' },
  cardTypeLabel: { fontSize: 13, color: '#9F1239', fontWeight: '500' },
  prospectNameHeading: { fontSize: 17, fontWeight: '700', color: '#7F1D1D', marginBottom: 4 },
  
  professionalStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 104,
    justifyContent: 'center',
  },
  professionalStatusText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  professionalStatusOpen: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  professionalStatusTextOpen: { color: '#DC2626' },
  professionalStatusProgress: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  professionalStatusTextProgress: { color: '#D97706' },
  professionalStatusResolved: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  professionalStatusTextResolved: { color: '#059669' },

  cardBodyExcerptText: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 12 },
  cardFooterLayoutFlex: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerMetaLabel: { fontSize: 12.5, color: '#9F1239' },
  
  cardActionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
  },
  actionButtonUpdate: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 11,
    borderRadius: 11,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDelete: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 11,
    borderRadius: 11,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonTextUpdate: { color: '#7F1D1D', fontWeight: '600', fontSize: 14.5 },
  actionButtonTextDelete: { color: '#DC2626', fontWeight: '600', fontSize: 14.5 },

  emptyStateContainerBox: { alignItems: 'center', paddingVertical: 80 },
  emptyStateMsg: { fontSize: 15, color: '#B91C1C', textAlign: 'center' },

  glassviewOverlayScreen: { flex: 1, backgroundColor: 'rgba(60, 33, 20, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 12 },
  modalBodyCardLayout: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, width: '95%', maxWidth: 520, maxHeight: '95%' },
  modalMainHeaderTitle: { fontSize: 21, fontWeight: '700', color: '#7F1D1D' },
  modalMainHeaderSubtitle: { fontSize: 13.5, color: '#DC2626', marginTop: 4 },

  modalFormScrollContainer: { marginVertical: 12 },
  dossierFieldLabel: { fontSize: 12, fontWeight: '600', color: '#9A3412', textTransform: 'uppercase', marginTop: 16 },
  dossierFieldValue: { fontSize: 16, color: '#1F2937', marginTop: 4 },
  dossierTextAreaDisplay: { fontSize: 15, lineHeight: 22, color: '#4B5563', backgroundColor: '#FFF7F7', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA', marginTop: 8 },

  resolutionActionsBlock: { marginTop: 20, padding: 16, backgroundColor: '#FFF1F2', borderRadius: 12, borderWidth: 1, borderColor: '#FECACA' },
  resolutionActionsBlockLabel: { fontSize: 13.5, fontWeight: '600', color: '#7F1D1D', marginBottom: 12 },
  resolutionButtonLayoutGroupRow: { flexDirection: 'row', gap: 12 },
  workflowActionButtonItem: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  dismissDetailsModalBtn: { backgroundColor: '#7F1D1D', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  dismissDetailsModalBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  formFieldLabelText: { fontSize: 13.5, fontWeight: '600', color: '#7F1D1D', marginTop: 14, marginBottom: 6 },
  formInputBoxControl: { borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, backgroundColor: '#FFFFFF' },
  formInputErrorBorder: { borderColor: '#DC2626', borderWidth: 1.5 },
  errorText: { color: '#DC2626', fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: '600' },
  
  customPickerRowLayout: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  customPickerItemBadge: { paddingVertical: 9, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FFF1F2', flexDirection: 'row', alignItems: 'center' },
  customPickerItemActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  customPickerItemText: { fontSize: 13.5, color: '#7F1D1D' },
  customPickerItemTextActive: { color: '#FFFFFF', fontWeight: '600' },
  formMultiLineTextBoxElement: { minHeight: 120, height: 'auto', textAlignVertical: 'top' },
  
  formActionLayoutButtonsGroup: { flexDirection: 'row', gap: 12, marginTop: 16 },
  formActionBtnBase: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  formActionBtnCancel: { backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECACA' },
  formActionBtnSubmit: { backgroundColor: '#DC2626' },
  formActionBtnTextCancel: { color: '#7F1D1D', fontWeight: '600', fontSize: 15 },
  formActionBtnTextSubmit: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  deleteConfirmCard: { alignItems: 'center', padding: 24 },
  deleteIconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#FECACA' },
  deleteConfirmTitle: { fontSize: 20, fontWeight: '700', color: '#7F1D1D', textAlign: 'center' },
  deleteConfirmSubtitle: { fontSize: 15, color: '#4B5563', textAlign: 'center', marginTop: 12, lineHeight: 22 },
  deleteConfirmWarning: { fontSize: 13, color: '#B91C1C', textAlign: 'center', marginTop: 8, fontWeight: '600' },
  deleteConfirmActions: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  deleteConfirmButton: { backgroundColor: '#DC2626' },
});