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

const PURPOSE_OPTIONS = [
  'Parent-Teacher Meeting',
  'Vendor/Contractor',
  'Official Audit',
  'Personal Guest',
] as const;

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
  },
];

export default function VisitorManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 992; // Adjusted breakpoint for 4 columns

  const [isMounted, setIsMounted] = useState(false);
  const [visitorLog, setVisitorLog] = useState<VisitorRecord[]>(MOCK_VISITORS);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'All' | 'Active' | 'Concluded'>('All');
  const [purposeFilter, setPurposeFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState('');

  // Dropdown UI States
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);

  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [visitorToDelete, setVisitorToDelete] = useState<VisitorRecord | null>(null);

  const [form, setForm] = useState({
    name: '',
    purpose: 'Parent-Teacher Meeting' as VisitorRecord['purpose'],
    hostStaff: '',
    badgeNumber: '',
    contactNumber: '',
    remarks: '',
  });

  const [updateForm, setUpdateForm] = useState({
    name: '',
    purpose: 'Parent-Teacher Meeting' as VisitorRecord['purpose'],
    hostStaff: '',
    badgeNumber: '',
    contactNumber: '',
    remarks: '',
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
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        visitor.name.toLowerCase().includes(q) ||
        visitor.badgeNumber.toLowerCase().includes(q) ||
        visitor.hostStaff.toLowerCase().includes(q);

      const matchesTab =
        filterMode === 'All' ||
        (filterMode === 'Active' && visitor.status === 'Checked In') ||
        (filterMode === 'Concluded' && visitor.status === 'Checked Out');

      const matchesPurpose = purposeFilter === 'All' || visitor.purpose === purposeFilter;
      const matchesDate = !dateFilter || visitor.checkInTime.startsWith(dateFilter);

      return matchesSearch && matchesTab && matchesPurpose && matchesDate;
    });
  }, [visitorLog, searchQuery, filterMode, purposeFilter, dateFilter]);

  const handleCheckInSubmit = () => {
    if (!form.name.trim() || !form.hostStaff.trim() || !form.badgeNumber.trim()) {
      Alert.alert('Validation Warning', 'Visitor Name, Host Staff, and Badge Number are required.');
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
      remarks: form.remarks.trim() || 'No supplementary security logs recorded.',
    };

    setVisitorLog([newGuest, ...visitorLog]);
    setForm({
      name: '',
      purpose: 'Parent-Teacher Meeting',
      hostStaff: '',
      badgeNumber: '',
      contactNumber: '',
      remarks: '',
    });
    setIsCheckInModalOpen(false);
  };

  const handleUpdateSubmit = () => {
    if (!updateForm.name.trim() || !updateForm.hostStaff.trim() || !updateForm.badgeNumber.trim()) {
      Alert.alert('Validation Warning', 'Visitor Name, Host Staff, and Badge Number are required.');
      return;
    }

    if (!selectedVisitor) return;

    const updatedLog = visitorLog.map((visitor) =>
      visitor.id === selectedVisitor.id
        ? {
            ...visitor,
            name: updateForm.name.trim(),
            purpose: updateForm.purpose,
            hostStaff: updateForm.hostStaff.trim(),
            badgeNumber: updateForm.badgeNumber.trim().toUpperCase(),
            contactNumber: updateForm.contactNumber.trim() || 'N/A',
            remarks: updateForm.remarks.trim() || 'No supplementary security logs recorded.',
          }
        : visitor
    );

    setVisitorLog(updatedLog);
    setUpdateForm({
      name: '',
      purpose: 'Parent-Teacher Meeting',
      hostStaff: '',
      badgeNumber: '',
      contactNumber: '',
      remarks: '',
    });
    setSelectedVisitor(null);
    setIsUpdateModalOpen(false);
    showSuccessAlert('Visitor record updated successfully.');
  };

  const handleDeleteVisitor = () => {
    if (!visitorToDelete) return;
    setVisitorLog(visitorLog.filter((visitor) => visitor.id !== visitorToDelete.id));
    setVisitorToDelete(null);
    showSuccessAlert('Visitor record deleted successfully.');
  };

  const showSuccessAlert = (message: string) => {
    if (Platform.OS === 'web') {
      setTimeout(() => {
        window.alert(message);
      }, 300);
    } else {
      Alert.alert('Success', message);
    }
  };

  const openUpdateModal = (visitor: VisitorRecord) => {
    setSelectedVisitor(visitor);
    setUpdateForm({
      name: visitor.name,
      purpose: visitor.purpose,
      hostStaff: visitor.hostStaff,
      badgeNumber: visitor.badgeNumber,
      contactNumber: visitor.contactNumber,
      remarks: visitor.remarks || '',
    });
    setIsUpdateModalOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
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

  const filterLabel = filterMode === 'All' ? 'All Visitors' : filterMode === 'Active' ? 'On Campus' : 'Checked Out';

  if (!isMounted) {
    return (
      <SafeAreaView style={[styles.fallbackContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#B91C1C" />
        <Text style={styles.fallbackText}>Initializing Visitor Control Log...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.viewRootContainer}>
      <ScrollView style={{ flex: 1, zIndex: 1 }} contentContainerStyle={styles.pageScrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageShell}>
          <View style={styles.topHeaderPanel}>
            <View style={{ flex: 1 }}>
              <Text style={styles.brandTitleText}>Visitor Control & Tracking</Text>
              <Text style={styles.brandSubtitleText}>Secure campus access management • Real-time monitoring</Text>
            </View>
            <TouchableOpacity style={styles.headerPrimaryAction} onPress={() => setIsCheckInModalOpen(true)}>
              <Icon name="plus" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.headerPrimaryActionText}>Log New Visitor</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsSummaryRow}>
            <View style={[styles.metricDisplayCard, styles.metricWine]}>
              <Icon name="inbox" size={20} color="#7F1D1D" style={{ marginBottom: 8 }} />
              <Text style={styles.metricLabelText}>TOTAL ENTRIES</Text>
              <Text style={styles.metricValueNumber}>{visitorMetrics.total}</Text>
            </View>
            <View style={[styles.metricDisplayCard, styles.metricRed]}>
              <Icon name="user" size={20} color="#B91C1C" style={{ marginBottom: 8 }} />
              <Text style={styles.metricLabelText}>ON CAMPUS</Text>
              <Text style={styles.metricValueNumber}>{visitorMetrics.inside}</Text>
            </View>
            <View style={[styles.metricDisplayCard, styles.metricRose]}>
              <Icon name="sign-out" size={20} color="#EF4444" style={{ marginBottom: 8 }} />
              <Text style={styles.metricLabelText}>CHECKED OUT</Text>
              <Text style={styles.metricValueNumber}>{visitorMetrics.departed}</Text>
            </View>
          </View>

          {/* FILTERING HEADER */}
          <View style={[styles.controlFilteringBox, { zIndex: 9999, ...(Platform.OS === 'web' ? { position: 'relative' } : {}) }]}>
            <View style={[isMobile ? styles.filterRowMobile : styles.filterRowWeb, { zIndex: 9999 }]}>
              
              {/* 1. Search Bar */}
              <View style={[styles.filterItemSearch, isMobile && styles.filterItemHalf]}>
                <View style={styles.searchWrapper}>
                  <Icon name="search" size={16} color="#B91C1C" style={styles.searchIcon} />
                  <TextInput
                    style={styles.globalSearchBox}
                    placeholder="Search name, badge..."
                    placeholderTextColor="#B91C1C"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {!!searchQuery && (
                    <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                      <Icon name="times" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* 2. Purpose Dropdown */}
              <View style={[styles.filterItem, { zIndex: 3000 }, isMobile && styles.filterItemHalf]}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => {
                    setShowPurposeDropdown(!showPurposeDropdown);
                    setShowStatusDropdown(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="briefcase" size={14} color="#7F1D1D" style={{ marginRight: 8 }} />
                    <Text style={styles.dropdownText} numberOfLines={1}>
                      {purposeFilter === 'All' ? 'All Purposes' : purposeFilter}
                    </Text>
                  </View>
                  <Icon name={showPurposeDropdown ? 'caret-up' : 'caret-down'} size={12} color="#7F1D1D" />
                </TouchableOpacity>
                {showPurposeDropdown && (
                  <View style={styles.dropdownMenuBelow}>
                    {/* Replaced nested ScrollView with View to prevent Android scrolling/clipping bugs */}
                    <View>
                      <TouchableOpacity
                        style={[styles.dropdownMenuItem, purposeFilter === 'All' && styles.dropdownMenuItemActive]}
                        onPress={() => { setPurposeFilter('All'); setShowPurposeDropdown(false); }}
                      >
                        <Text style={[styles.dropdownMenuText, purposeFilter === 'All' && styles.dropdownMenuTextActive]}>All Purposes</Text>
                      </TouchableOpacity>
                      {PURPOSE_OPTIONS.map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.dropdownMenuItem, purposeFilter === opt && styles.dropdownMenuItemActive]}
                          onPress={() => { setPurposeFilter(opt); setShowPurposeDropdown(false); }}
                        >
                          <Text style={[styles.dropdownMenuText, purposeFilter === opt && styles.dropdownMenuTextActive]}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* 3. Date Picker */}
              <View style={[styles.filterItem, { zIndex: 2000 }, isMobile && styles.filterItemHalf]}>
                <View style={{ position: 'relative', width: '100%' }}>
                  {Platform.OS === 'web' ? (
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      style={styles.webNativeInputDatePicker}
                    />
                  ) : (
                    <View style={styles.dropdownButton}>
                      <Icon name="calendar" size={14} color="#7F1D1D" style={{ marginRight: 8 }} />
                      <TextInput
                        style={{ flex: 1, color: '#7F1D1D', fontWeight: '600', padding: 0 }}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9F1239"
                        value={dateFilter}
                        onChangeText={setDateFilter}
                      />
                    </View>
                  )}
                </View>
              </View>

              {/* 4. Status Dropdown */}
              <View style={[styles.filterItem, { zIndex: 1000 }, isMobile && styles.filterItemHalf]}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => {
                    setShowStatusDropdown(!showStatusDropdown);
                    setShowPurposeDropdown(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="filter" size={14} color="#7F1D1D" style={{ marginRight: 8 }} />
                    <Text style={styles.dropdownText} numberOfLines={1}>{filterLabel}</Text>
                  </View>
                  <Icon name={showStatusDropdown ? 'caret-up' : 'caret-down'} size={12} color="#7F1D1D" />
                </TouchableOpacity>
                {showStatusDropdown && (
                  <View style={styles.dropdownMenuBelow}>
                    <View>
                      {(['All', 'Active', 'Concluded'] as const).map((opt) => {
                        const active = filterMode === opt;
                        const label = opt === 'All' ? 'All Visitors' : opt === 'Active' ? 'On Campus' : 'Checked Out';
                        return (
                          <TouchableOpacity
                            key={opt}
                            style={[styles.dropdownMenuItem, active && styles.dropdownMenuItemActive]}
                            onPress={() => {
                              setFilterMode(opt);
                              setShowStatusDropdown(false);
                            }}
                          >
                            <Icon name={active ? 'check' : 'circle-o'} size={14} color={active ? '#B91C1C' : '#7F1D1D'} style={{ marginRight: 8 }} />
                            <Text style={[styles.dropdownMenuText, active && styles.dropdownMenuTextActive]}>{label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>

            </View>
          </View>

          {isMobile ? (
            // MOBILE VIEW - Card with action buttons inside
            <FlatList
              data={filteredVisitors}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[styles.listContainerLayout, { zIndex: 1 }]}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyStateContainerBox}>
                  <Icon name="info-circle" size={48} color="#B91C1C" style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyStateMsg}>No matching visitor records found</Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.dataLogItemCard, { zIndex: 1 }]}
                  onPress={() => setSelectedVisitor(item)}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardHeaderFlexRow}>
                    <View style={styles.cardTitleBlock}>
                      <View style={styles.metaRowBadging}>
                        <Text style={styles.cardRecordId}>{item.id}</Text>
                        <View style={styles.badgeWrapper}>
                          <Text style={styles.cardTypeLabel}>{item.badgeNumber}</Text>
                        </View>
                      </View>
                      <View style={styles.nameWrapper}>
                        <Text style={styles.prospectNameHeading} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={styles.purposeWrapper}>
                        <Icon name="briefcase" size={14} color="#9F1239" style={{ marginRight: 6 }} />
                        <Text style={styles.visitorPurposeLabel} numberOfLines={1}>
                          {item.purpose}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.professionalStatusBadge,
                        item.status === 'Checked In' && styles.professionalStatusOpen,
                        item.status === 'Checked Out' && styles.professionalStatusResolved,
                      ]}
                    >
                      <Icon
                        name={item.status === 'Checked In' ? 'circle' : 'check-circle'}
                        size={10}
                        color={item.status === 'Checked In' ? '#991B1B' : '#DC2626'}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.professionalStatusText,
                          item.status === 'Checked In' && styles.professionalStatusTextOpen,
                          item.status === 'Checked Out' && styles.professionalStatusTextResolved,
                        ]}
                      >
                        {item.status === 'Checked In' ? 'ON CAMPUS' : 'DEPARTED'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardFooterLayoutFlex}>
                    <View style={styles.footerItem}>
                      <Text style={styles.footerMetaLabel} numberOfLines={2}>
                        {item.hostStaff}
                      </Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Icon name="clock-o" size={13} color="#9F1239" style={{ marginRight: 6 }} />
                      <Text style={styles.footerMetaLabel}>In: {item.checkInTime}</Text>
                    </View>
                    {item.checkOutTime && (
                      <View style={styles.footerItem}>
                        <Icon name="sign-out" size={13} color="#9F1239" style={{ marginRight: 6 }} />
                        <Text style={styles.footerMetaLabel}>Out: {item.checkOutTime}</Text>
                      </View>
                    )}
                  </View>

                  {/* Action buttons INSIDE the card */}
                  <View style={styles.cardDivider} />
                  <View style={styles.cardActionButtonsInside}>
                    <TouchableOpacity
                      style={styles.actionButtonIconInside}
                      onPress={() => setSelectedVisitor(item)}
                      activeOpacity={0.8}
                      accessibilityLabel="View visitor details"
                    >
                      <Icon name="eye" size={18} color="#7F1D1D" />
                      <Text style={styles.actionLabelInside}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButtonIconInside}
                      onPress={() => openUpdateModal(item)}
                      activeOpacity={0.8}
                      accessibilityLabel="Update visitor record"
                    >
                      <Icon name="pencil" size={16} color="#7F1D1D" />
                      <Text style={styles.actionLabelInside}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButtonIconDeleteInside}
                      onPress={() => setVisitorToDelete(item)}
                      activeOpacity={0.8}
                      accessibilityLabel="Delete visitor record"
                    >
                      <Icon name="trash" size={16} color="#B91C1C" />
                      <Text style={styles.actionLabelInsideDelete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            // DESKTOP VIEW - Professional uniform table
            <View style={[styles.tableWrapper, { zIndex: 1 }]}>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <View style={[styles.tableHeaderCell, styles.colIdWrapper]}>
                    <Text style={[styles.tableHeaderCellText]}>ID</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.colNameWrapper]}>
                    <Text style={[styles.tableHeaderCellText]}>Visitor Name</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.colPurposeWrapper]}>
                    <Text style={[styles.tableHeaderCellText]}>Purpose</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.colHostWrapper]}>
                    <Text style={[styles.tableHeaderCellText]}>Host Staff</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.colStatusWrapper]}>
                    <Text style={[styles.tableHeaderCellText]}>Status</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.colActionWrapper]}>
                    <Text style={[styles.tableHeaderCellText]}>Actions</Text>
                  </View>
                </View>

                <FlatList
                  data={filteredVisitors}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  contentContainerStyle={[styles.tableBody, { zIndex: 1 }]}
                  ListEmptyComponent={
                    <View style={styles.emptyStateContainerBox}>
                      <Icon name="info-circle" size={48} color="#B91C1C" style={{ marginBottom: 12 }} />
                      <Text style={styles.emptyStateMsg}>No matching visitor records found</Text>
                    </View>
                  }
                  renderItem={({ item }) => (
                    <View style={[styles.tableRow, { zIndex: 1 }]}>
                      <View style={[styles.tableCell, styles.colIdWrapper]}>
                        <Text style={styles.tableCellText} numberOfLines={1}>
                          {item.id}
                        </Text>
                      </View>
                      <View style={[styles.tableCell, styles.colNameWrapper]}>
                        <Text style={styles.tableCellText} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={[styles.tableCell, styles.colPurposeWrapper]}>
                        <Text style={styles.tableCellText} numberOfLines={1}>
                          {item.purpose}
                        </Text>
                      </View>
                      <View style={[styles.tableCell, styles.colHostWrapper]}>
                        <Text style={styles.tableCellText} numberOfLines={1}>
                          {item.hostStaff}
                        </Text>
                      </View>
                      <View style={[styles.tableCell, styles.colStatusWrapper]}>
                        <View style={[styles.statusBadge, item.status === 'Checked In' ? styles.statusIn : styles.statusOut]}>
                          <Text style={styles.statusText}>
                            {item.status === 'Checked In' ? 'ON CAMPUS' : 'DEPARTED'}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.tableCell, styles.colActionWrapper]}>
                        <View style={styles.tableActionButtons}>
                          <TouchableOpacity
                            style={styles.tableActionButton}
                            onPress={() => setSelectedVisitor(item)}
                            activeOpacity={0.7}
                            accessibilityLabel="View visitor details"
                          >
                            <Icon name="eye" size={16} color="#7F1D1D" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.tableActionButton}
                            onPress={() => openUpdateModal(item)}
                            activeOpacity={0.7}
                            accessibilityLabel="Update visitor record"
                          >
                            <Icon name="pencil" size={14} color="#7F1D1D" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.tableActionButtonDelete}
                            onPress={() => setVisitorToDelete(item)}
                            activeOpacity={0.7}
                            accessibilityLabel="Delete visitor record"
                          >
                            <Icon name="trash" size={14} color="#B91C1C" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* VISITOR DETAILS MODAL */}
      {selectedVisitor && (
        <Modal transparent visible={!!selectedVisitor} animationType="fade" onRequestClose={() => setSelectedVisitor(null)}>
          <View style={styles.glassviewOverlayScreen}>
            <View style={[styles.modalBodyCardLayout, isMobile && { margin: 12, width: '94%', maxHeight: '92%' }]}>
              <View style={styles.modalHeaderWrapper}>
                <Icon name="user-circle" size={28} color="#7F1D1D" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.modalMainHeaderTitle}>Visitor Pass Record</Text>
                  <Text style={styles.modalMainHeaderSubtitle}>{selectedVisitor.id}</Text>
                </View>
              </View>

              <ScrollView style={styles.modalFormScrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.fieldWrapper}>
                  <Icon name="user" size={14} color="#9F1239" style={{ marginRight: 8 }} />
                  <Text style={styles.dossierFieldLabel}>Visitor Name</Text>
                </View>
                <Text style={styles.dossierFieldValue}>{selectedVisitor.name}</Text>

                <View style={styles.detailTwoColRow}>
                  <View style={styles.detailCol}>
                    <View style={styles.fieldWrapper}>
                      <Icon name="id-badge" size={14} color="#9F1239" style={{ marginRight: 8 }} />
                      <Text style={styles.dossierFieldLabel}>Badge Number</Text>
                    </View>
                    <Text style={styles.dossierFieldValue}>{selectedVisitor.badgeNumber}</Text>
                  </View>
                  <View style={styles.detailCol}>
                    <View style={styles.fieldWrapper}>
                      <Icon name="phone" size={14} color="#9F1239" style={{ marginRight: 8 }} />
                      <Text style={styles.dossierFieldLabel}>Contact</Text>
                    </View>
                    <Text style={styles.dossierFieldValue}>{selectedVisitor.contactNumber}</Text>
                  </View>
                </View>

                <View style={styles.fieldWrapper}>
                  <Icon name="briefcase" size={14} color="#9F1239" style={{ marginRight: 8 }} />
                  <Text style={styles.dossierFieldLabel}>Purpose</Text>
                </View>
                <Text style={styles.dossierFieldValue}>{selectedVisitor.purpose}</Text>

                <View style={styles.fieldWrapper}>
                  <Icon name="user-tie" size={14} color="#9F1239" style={{ marginRight: 8 }} />
                  <Text style={styles.dossierFieldLabel}>Host Staff</Text>
                </View>
                <Text style={styles.dossierFieldValue}>{selectedVisitor.hostStaff}</Text>

                <View style={styles.fieldWrapper}>
                  <Icon name="clock-o" size={14} color="#9F1239" style={{ marginRight: 8 }} />
                  <Text style={styles.dossierFieldLabel}>Check-In Time</Text>
                </View>
                <Text style={styles.dossierFieldValue}>{selectedVisitor.checkInTime}</Text>

                {selectedVisitor.checkOutTime && (
                  <>
                    <View style={styles.fieldWrapper}>
                      <Icon name="sign-out" size={14} color="#9F1239" style={{ marginRight: 8 }} />
                      <Text style={styles.dossierFieldLabel}>Check-Out Time</Text>
                    </View>
                    <Text style={styles.dossierFieldValue}>{selectedVisitor.checkOutTime}</Text>
                  </>
                )}

                <View style={styles.fieldWrapper}>
                  <Icon name="file-text" size={14} color="#9F1239" style={{ marginRight: 8 }} />
                  <Text style={styles.dossierFieldLabel}>Remarks</Text>
                </View>
                <Text style={styles.dossierTextAreaDisplay}>{selectedVisitor.remarks}</Text>

                {selectedVisitor.status === 'Checked In' && (
                  <TouchableOpacity style={styles.workflowActionButtonItem} onPress={() => handleCheckOutAction(selectedVisitor.id)}>
                    <Icon name="sign-out" size={18} color="#991B1B" style={{ marginRight: 8 }} />
                    <Text style={styles.workflowActionButtonText}>Check Out Visitor</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.dismissDetailsModalBtn} onPress={() => setSelectedVisitor(null)}>
                <Icon name="times" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.dismissDetailsModalBtnText}>Close Record</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* CHECK-IN MODAL */}
      <Modal transparent visible={isCheckInModalOpen} animationType="slide" onRequestClose={() => setIsCheckInModalOpen(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.glassviewOverlayScreen}>
            <View style={[styles.modalBodyCardLayout, { width: '95%', maxHeight: '95%' }]}>
              <View style={styles.modalHeaderWrapper}>
                <Icon name="user-plus" size={28} color="#7F1D1D" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.modalMainHeaderTitle}>New Visitor Entry</Text>
                  <Text style={styles.modalMainHeaderSubtitle}>Register guest and issue secure badge</Text>
                </View>
              </View>

              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.formFieldLabelText}>
                  Visitor Name <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <Icon name="user" size={18} color="#B91C1C" style={styles.inputIcon} />
                  <TextInput
                    style={styles.formInputBoxControl}
                    placeholder="Full Name"
                    value={form.name}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                  />
                </View>

                <Text style={styles.formFieldLabelText}>
                  Badge Number <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <Icon name="id-badge" size={18} color="#B91C1C" style={styles.inputIcon} />
                  <TextInput
                    style={styles.formInputBoxControl}
                    placeholder="BADGE-001"
                    value={form.badgeNumber}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, badgeNumber: text.toUpperCase() }))}
                  />
                </View>

                <Text style={styles.formFieldLabelText}>Contact Number</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="phone" size={18} color="#B91C1C" style={styles.inputIcon} />
                  <TextInput
                    style={styles.formInputBoxControl}
                    placeholder="+91 XXXXXXXXXX"
                    keyboardType="phone-pad"
                    value={form.contactNumber}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, contactNumber: text }))}
                  />
                </View>

                <Text style={styles.formFieldLabelText}>
                  Host Staff <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <Icon name="user-tie" size={18} color="#B91C1C" style={styles.inputIcon} />
                  <TextInput
                    style={styles.formInputBoxControl}
                    placeholder="Host Staff Name & Designation"
                    value={form.hostStaff}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, hostStaff: text }))}
                  />
                </View>

                <Text style={styles.formFieldLabelText}>Purpose</Text>
                <View style={styles.customPickerRowLayout}>
                  {PURPOSE_OPTIONS.map((purpose) => (
                    <TouchableOpacity
                      key={purpose}
                      style={[styles.customPickerItemBadge, form.purpose === purpose && styles.customPickerItemActive]}
                      onPress={() => setForm((prev) => ({ ...prev, purpose }))}
                    >
                      <Icon
                        name={form.purpose === purpose ? 'check-circle' : 'circle-o'}
                        size={14}
                        color={form.purpose === purpose ? '#FFFFFF' : '#7F1D1D'}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.customPickerItemText, form.purpose === purpose && styles.customPickerItemTextActive]}>
                        {purpose}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formFieldLabelText}>Remarks</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="file-text-o" size={18} color="#B91C1C" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.formInputBoxControl, styles.formMultiLineTextBoxElement]}
                    placeholder="Additional notes..."
                    multiline
                    textAlignVertical="top"
                    value={form.remarks}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, remarks: text }))}
                  />
                </View>
              </ScrollView>

              <View style={styles.formActionLayoutButtonsGroup}>
                <TouchableOpacity style={[styles.formActionBtnBase, styles.formActionBtnCancel]} onPress={() => setIsCheckInModalOpen(false)}>
                  <Icon name="times" size={16} color="#7F1D1D" style={{ marginRight: 6 }} />
                  <Text style={styles.formActionBtnTextCancel}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.formActionBtnBase, styles.formActionBtnSubmit]} onPress={handleCheckInSubmit}>
                  <Icon name="check" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.formActionBtnTextSubmit}>Check In Visitor</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* UPDATE MODAL */}
      {isUpdateModalOpen && selectedVisitor && (
        <Modal transparent visible={isUpdateModalOpen} animationType="slide" onRequestClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedVisitor(null);
        }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.glassviewOverlayScreen}>
              <View style={[styles.modalBodyCardLayout, isMobile && { margin: 12, width: '94%', maxHeight: '95%' }]}>
                <View style={styles.modalHeaderWrapper}>
                  <Icon name="pencil-square-o" size={28} color="#7F1D1D" style={{ marginRight: 10 }} />
                  <View>
                    <Text style={styles.modalMainHeaderTitle}>Update Visitor Record</Text>
                    <Text style={styles.modalMainHeaderSubtitle}>Edit visitor {selectedVisitor.id}</Text>
                  </View>
                </View>

                <ScrollView
                  style={{ width: '100%' }}
                  contentContainerStyle={{ paddingBottom: 30 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.formFieldLabelText}>
                    Visitor Name <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="user" size={18} color="#B91C1C" style={styles.inputIcon} />
                    <TextInput
                      style={styles.formInputBoxControl}
                      placeholder="Full Name"
                      value={updateForm.name}
                      onChangeText={(text) => setUpdateForm((prev) => ({ ...prev, name: text }))}
                    />
                  </View>

                  <Text style={styles.formFieldLabelText}>
                    Badge Number <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="id-badge" size={18} color="#B91C1C" style={styles.inputIcon} />
                    <TextInput
                      style={styles.formInputBoxControl}
                      placeholder="BADGE-001"
                      value={updateForm.badgeNumber}
                      onChangeText={(text) => setUpdateForm((prev) => ({ ...prev, badgeNumber: text.toUpperCase() }))}
                    />
                  </View>

                  <Text style={styles.formFieldLabelText}>Contact Number</Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="phone" size={18} color="#B91C1C" style={styles.inputIcon} />
                    <TextInput
                      style={styles.formInputBoxControl}
                      placeholder="+91 XXXXXXXXXX"
                      keyboardType="phone-pad"
                      value={updateForm.contactNumber}
                      onChangeText={(text) => setUpdateForm((prev) => ({ ...prev, contactNumber: text }))}
                    />
                  </View>

                  <Text style={styles.formFieldLabelText}>
                    Host Staff <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="user-tie" size={18} color="#B91C1C" style={styles.inputIcon} />
                    <TextInput
                      style={styles.formInputBoxControl}
                      placeholder="Host Staff Name & Designation"
                      value={updateForm.hostStaff}
                      onChangeText={(text) => setUpdateForm((prev) => ({ ...prev, hostStaff: text }))}
                    />
                  </View>

                  <Text style={styles.formFieldLabelText}>Purpose</Text>
                  <View style={styles.customPickerRowLayout}>
                    {PURPOSE_OPTIONS.map((purpose) => (
                      <TouchableOpacity
                        key={purpose}
                        style={[styles.customPickerItemBadge, updateForm.purpose === purpose && styles.customPickerItemActive]}
                        onPress={() => setUpdateForm((prev) => ({ ...prev, purpose }))}
                      >
                        <Icon
                          name={updateForm.purpose === purpose ? 'check-circle' : 'circle-o'}
                          size={14}
                          color={updateForm.purpose === purpose ? '#FFFFFF' : '#7F1D1D'}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.customPickerItemText, updateForm.purpose === purpose && styles.customPickerItemTextActive]}>
                          {purpose}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.formFieldLabelText}>Remarks</Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="file-text-o" size={18} color="#B91C1C" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.formInputBoxControl, styles.formMultiLineTextBoxElement]}
                      placeholder="Additional notes..."
                      multiline
                      textAlignVertical="top"
                      value={updateForm.remarks}
                      onChangeText={(text) => setUpdateForm((prev) => ({ ...prev, remarks: text }))}
                    />
                  </View>
                </ScrollView>

                <View style={styles.formActionLayoutButtonsGroup}>
                  <TouchableOpacity
                    style={[styles.formActionBtnBase, styles.formActionBtnCancel]}
                    onPress={() => {
                      setIsUpdateModalOpen(false);
                      setSelectedVisitor(null);
                    }}
                  >
                    <Icon name="times" size={16} color="#7F1D1D" style={{ marginRight: 6 }} />
                    <Text style={styles.formActionBtnTextCancel}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.formActionBtnBase, styles.formActionBtnSubmit]}
                    onPress={handleUpdateSubmit}
                  >
                    <Icon name="check" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.formActionBtnTextSubmit}>Update Visitor</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {visitorToDelete && (
        <Modal transparent visible={!!visitorToDelete} animationType="fade" onRequestClose={() => setVisitorToDelete(null)}>
          <View style={styles.glassviewOverlayScreen}>
            <View style={[styles.modalBodyCardLayout, isMobile && { margin: 12, width: '94%' }, styles.deleteConfirmCard]}>
              <View style={styles.deleteIconWrapper}>
                <Icon name="trash-o" size={48} color="#B91C1C" />
              </View>
              <Text style={styles.deleteConfirmTitle}>Delete Visitor Record?</Text>
              <Text style={styles.deleteConfirmSubtitle}>
                Are you sure you want to delete "{visitorToDelete.name}"'s record?
              </Text>
              <Text style={styles.deleteConfirmWarning}>This action cannot be undone.</Text>

              <View style={styles.deleteConfirmActions}>
                <TouchableOpacity
                  style={[styles.formActionBtnBase, styles.formActionBtnCancel]}
                  onPress={() => setVisitorToDelete(null)}
                >
                  <Icon name="times" size={16} color="#7F1D1D" style={{ marginRight: 6 }} />
                  <Text style={styles.formActionBtnTextCancel}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.formActionBtnBase, styles.formActionBtnSubmit, styles.deleteConfirmButton]}
                  onPress={handleDeleteVisitor}
                >
                  <Icon name="trash" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.formActionBtnTextSubmit}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: { flex: 1, backgroundColor: '#FFF1F2' },
  fallbackText: { marginTop: 12, color: '#B91C1C', fontSize: 14 },

  viewRootContainer: { flex: 1, backgroundColor: '#FFF1F2' },
  pageScrollContent: { flexGrow: 1 },
  pageShell: { maxWidth: 1400, width: '100%', alignSelf: 'center' },

  topHeaderPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#FECACA',
  },
  brandTitleText: { fontSize: 23, fontWeight: '700', color: '#7F1D1D' },
  brandSubtitleText: { fontSize: 13.5, color: '#9F1239', marginTop: 4 },

  headerPrimaryAction: {
    backgroundColor: '#B91C1C',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerPrimaryActionText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  metricsSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 14,
  },
  metricDisplayCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  metricWine: { borderLeftWidth: 6, borderLeftColor: '#7F1D1D' },
  metricRed: { borderLeftWidth: 6, borderLeftColor: '#B91C1C' },
  metricRose: { borderLeftWidth: 6, borderLeftColor: '#EF4444' },
  metricLabelText: { fontSize: 12.5, color: '#9F1239', fontWeight: '600', textTransform: 'uppercase' },
  metricValueNumber: { fontSize: 28, fontWeight: '700', marginTop: 8, color: '#7F1D1D' },

  controlFilteringBox: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#FECACA',
  },
  
  // --- RESPONSIVE 4-FILTER ROW STYLES ---
  filterRowWeb: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  filterRowMobile: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  filterItemSearch: { flex: 1.5, position: 'relative' },
  filterItem: { flex: 1, position: 'relative' },
  filterItemHalf: { minWidth: '47%' },

  searchWrapper: { position: 'relative', justifyContent: 'center' },
  searchIcon: { position: 'absolute', left: 14, top: 15, zIndex: 1 },
  globalSearchBox: {
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 42,
    paddingLeft: 42,
    paddingVertical: 13,
    fontSize: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#FECACA',
    color: '#431407',
  },
  clearSearchButton: {
    position: 'absolute',
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },

  // --- DROPDOWN SELECTOR UI STYLES ---
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dropdownText: { fontSize: 14, color: '#7F1D1D', fontWeight: '600' },
  dropdownMenuBelow: {
    position: 'absolute',
    top: 54, 
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
      android: { elevation: 15 },
      default: {},
    }),
  },
  dropdownMenuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE8E8',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownMenuItemActive: { backgroundColor: '#FFF1F2' },
  dropdownMenuText: { color: '#7F1D1D', fontSize: 14.5, fontWeight: '500' },
  dropdownMenuTextActive: { color: '#B91C1C', fontWeight: '700' },

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

  listContainerLayout: { padding: 20, gap: 14 },

  dataLogItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardHeaderFlexRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  cardTitleBlock: { flex: 1, minWidth: 0 },
  metaRowBadging: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
  cardRecordId: { fontSize: 12.5, fontWeight: '700', color: '#DC2626' },
  badgeWrapper: { flexDirection: 'row', alignItems: 'center' },
  cardTypeLabel: { fontSize: 12.5, color: '#9F1239', fontWeight: '500' },
  nameWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  prospectNameHeading: { fontSize: 18, fontWeight: '600', color: '#7F1D1D' },
  purposeWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  visitorPurposeLabel: { fontSize: 13.5, color: '#9F1239' },

  professionalStatusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    minWidth: 115,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexDirection: 'row',
  },
  professionalStatusText: { fontSize: 13, fontWeight: '700' },
  professionalStatusOpen: { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
  professionalStatusTextOpen: { color: '#991B1B' },
  professionalStatusResolved: { backgroundColor: '#FFF1F2', borderColor: '#FECACA' },
  professionalStatusTextResolved: { color: '#DC2626' },

  cardFooterLayoutFlex: { marginTop: 14, gap: 8 },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerMetaLabel: { fontSize: 13.5, color: '#9F1239' },

  cardDivider: { height: 1, backgroundColor: '#FDE8E8', marginVertical: 14 },

  cardActionButtonsInside: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
  },
  actionButtonIconInside: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 6 },
  actionButtonIconDeleteInside: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 6 },
  actionLabelInside: { fontSize: 13, fontWeight: '600', color: '#7F1D1D' },
  actionLabelInsideDelete: { fontSize: 13, fontWeight: '600', color: '#B91C1C' },

  tableWrapper: { paddingHorizontal: 20, paddingBottom: 20 },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tableHeader: { flexDirection: 'row', backgroundColor: '#FFF1F2', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 2, borderBottomColor: '#FECACA' },
  tableHeaderCell: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  colIdWrapper: { flex: 1.2, minWidth: 120 },
  colNameWrapper: { flex: 2.2, minWidth: 200 },
  colPurposeWrapper: { flex: 1.8, minWidth: 170 },
  colHostWrapper: { flex: 2.4, minWidth: 240 },
  colStatusWrapper: { flex: 1.3, minWidth: 140 },
  colActionWrapper: { flex: 1.2, minWidth: 140, justifyContent: 'center' },
  tableHeaderCellText: { fontSize: 13, fontWeight: '700', color: '#7F1D1D' },
  tableBody: { paddingBottom: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#FDE8E8' },
  tableCell: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  tableCellId: { fontWeight: '600' },
  tableCellText: { fontSize: 14, color: '#431407', flex: 1 },
  tableActionButtons: { flexDirection: 'row', gap: 12, justifyContent: 'flex-start' },
  tableActionButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FDFBFB', borderWidth: 1, borderColor: '#FECACA', alignItems: 'center', justifyContent: 'center' },
  tableActionButtonDelete: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', alignItems: 'center', justifyContent: 'center' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, alignSelf: 'flex-start', minWidth: 108, alignItems: 'center', flexDirection: 'row' },
  statusIn: { backgroundColor: '#FEE2E2' },
  statusOut: { backgroundColor: '#FFF1F2' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#7F1D1D' },

  emptyStateContainerBox: { alignItems: 'center', paddingVertical: 90 },
  emptyStateMsg: { fontSize: 15.5, color: '#B91C1C', textAlign: 'center' },

  glassviewOverlayScreen: { flex: 1, backgroundColor: 'rgba(60, 33, 20, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBodyCardLayout: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 24, width: '95%', maxWidth: 540, maxHeight: '94%' },
  modalHeaderWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  modalMainHeaderTitle: { fontSize: 22, fontWeight: '700', color: '#7F1D1D' },
  modalMainHeaderSubtitle: { fontSize: 14, color: '#DC2626', marginTop: 4 },
  modalFormScrollContainer: { marginVertical: 16 },
  fieldWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  dossierFieldLabel: { fontSize: 12.5, fontWeight: '600', color: '#9F1239', textTransform: 'uppercase' },
  dossierFieldValue: { fontSize: 16.5, color: '#431407', marginTop: 4, fontWeight: '500' },
  detailTwoColRow: { flexDirection: 'row', gap: 16 },
  detailCol: { flex: 1, minWidth: 0 },
  dossierTextAreaDisplay: { fontSize: 15.5, lineHeight: 23, color: '#4B5563', backgroundColor: '#FFF1F2', padding: 18, borderRadius: 14, borderWidth: 1, borderColor: '#FECACA', marginTop: 8 },
  workflowActionButtonItem: { backgroundColor: '#FEE2E2', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 24, flexDirection: 'row', justifyContent: 'center' },
  workflowActionButtonText: { color: '#991B1B', fontWeight: '600', fontSize: 15 },
  dismissDetailsModalBtn: { backgroundColor: '#B91C1C', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 28, flexDirection: 'row', justifyContent: 'center' },
  dismissDetailsModalBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15.5 },

  formFieldLabelText: { fontSize: 14, fontWeight: '600', color: '#7F1D1D', marginTop: 16, marginBottom: 7 },
  inputWrapper: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 14, top: 13, zIndex: 1 },
  formInputBoxControl: { borderWidth: 1, borderColor: '#FECACA', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 13, fontSize: 15.5, backgroundColor: '#FFFFFF', paddingLeft: 42 },
  customPickerRowLayout: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 10 },
  customPickerItemBadge: { paddingVertical: 9, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FFF1F2', flexDirection: 'row', alignItems: 'center' },
  customPickerItemActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  customPickerItemText: { fontSize: 13.5, color: '#7F1D1D' },
  customPickerItemTextActive: { color: '#FFFFFF', fontWeight: '600' },
  formMultiLineTextBoxElement: { minHeight: 120, textAlignVertical: 'top', paddingLeft: 42 },

  formActionLayoutButtonsGroup: { flexDirection: 'row', gap: 14, marginTop: 28 },
  formActionBtnBase: { flex: 1, paddingVertical: 15, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  formActionBtnCancel: { backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECACA' },
  formActionBtnSubmit: { backgroundColor: '#DC2626' },
  formActionBtnTextCancel: { color: '#7F1D1D', fontWeight: '600', fontSize: 15.5 },
  formActionBtnTextSubmit: { color: '#FFFFFF', fontWeight: '600', fontSize: 15.5 },

  deleteConfirmCard: { alignItems: 'center', padding: 24 },
  deleteIconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#FECACA' },
  deleteConfirmTitle: { fontSize: 20, fontWeight: '700', color: '#7F1D1D', textAlign: 'center' },
  deleteConfirmSubtitle: { fontSize: 15, color: '#4B5563', textAlign: 'center', marginTop: 12, lineHeight: 22 },
  deleteConfirmWarning: { fontSize: 13, color: '#B91C1C', textAlign: 'center', marginTop: 8, fontWeight: '600' },
  deleteConfirmActions: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  deleteConfirmButton: { backgroundColor: '#DC2626' },
});