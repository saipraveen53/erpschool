import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, ScrollView,
  TouchableOpacity, FlatList, Modal, useWindowDimensions,
  ActivityIndicator, Alert, Image, Switch, Platform
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';

// ── OUTSIDE component — focus issue fix ────────────────────────────
const Field = ({ label, field, keyboardType, editForm, setEditForm, disabled }) => (
  <View style={styles.editFieldWrap}>
    <Text style={styles.editLabel}>{label}</Text>
    <TextInput
      style={[styles.editInput, disabled && styles.editInputDisabled]}
      value={editForm[field] ?? ''}
      onChangeText={val => !disabled && setEditForm(prev => ({ ...prev, [field]: val }))}
      keyboardType={keyboardType || 'default'}
      placeholder={label}
      placeholderTextColor="#b0967a"
      autoCorrect={false}
      autoCapitalize="words"
      editable={!disabled}
    />
  </View>
);

const ToggleField = ({ label, field, editForm, setEditForm }) => (
  <View style={styles.toggleRow}>
    <Text style={styles.editLabel}>{label}</Text>
    <View style={styles.toggleRight}>
      <Text style={[styles.toggleStatus, { color: editForm[field] ? '#16a34a' : '#E35336' }]}>
        {editForm[field] ? 'Active' : 'Inactive'}
      </Text>
      <Switch
        value={editForm[field] ?? false}
        onValueChange={val => setEditForm(prev => ({ ...prev, [field]: val }))}
        trackColor={{ false: '#fca5a5', true: '#86efac' }}
        thumbColor={editForm[field] ? '#16a34a' : '#E35336'}
      />
    </View>
  </View>
);

// ── Validation ─────────────────────────────────────────────────────
const validateForm = (form) => {
  const errors = [];

  if (!form.fullName?.trim())
    errors.push('Full Name is required.');
  else if (form.fullName.trim().length < 2)
    errors.push('Full Name must be at least 2 characters.');

  if (!form.dateOfBirth?.trim())
    errors.push('Date of Birth is required.');
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth.trim()))
    errors.push('Date of Birth must be in YYYY-MM-DD format.');

  if (!form.gender?.trim())
    errors.push('Gender is required.');

  if (!form.contactNumber?.trim())
    errors.push('Mobile Number is required.');
  else if (!/^[6-9]\d{9}$/.test(form.contactNumber.trim()))
    errors.push('Mobile Number must be a valid 10-digit Indian number.');

  if (!form.email?.trim())
    errors.push('Email is required.');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.push('Email format is invalid.');

  if (form.aadhaarNumber?.trim() && !/^\d{12}$/.test(form.aadhaarNumber.trim()))
    errors.push('Aadhaar Number must be exactly 12 digits.');

  if (form.pincode?.trim() && !/^\d{6}$/.test(form.pincode.trim()))
    errors.push('Pincode must be exactly 6 digits.');

  if (form.fatherContact?.trim() && !/^[6-9]\d{9}$/.test(form.fatherContact.trim()))
    errors.push("Father's Contact must be a valid 10-digit number.");

  if (form.motherContact?.trim() && !/^[6-9]\d{9}$/.test(form.motherContact.trim()))
    errors.push("Mother's Contact must be a valid 10-digit number.");

  if (form.emergencyContactNumber?.trim() && !/^[6-9]\d{9}$/.test(form.emergencyContactNumber.trim()))
    errors.push('Emergency Contact must be a valid 10-digit number.');

  if (!form.rollNumber?.trim())
    errors.push('Roll Number is required.');

  if (!form.joiningDate?.trim())
    errors.push('Joining Date is required.');
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.joiningDate.trim()))
    errors.push('Joining Date must be in YYYY-MM-DD format.');

  return errors;
};

// ──────────────────────────────────────────────────────────────────
export default function StudentDirectory() {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkStudents, setBulkStudents] = useState([]);
  const [sendingBulk, setSendingBulk] = useState(false);

  const isLargeScreen = width >= 768;

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/allStudents');
      setStudents(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  // ── Bulk upload logic ──────────────────────────────────────────────
  const pickStudentFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setBulkFileName(file.name);
        const response = await fetch(file.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          const mapped = jsonData.map(row => ({
            fullName: row.fullName || row['Full Name'] || row['FULL NAME'] || row.name || row.Name || '',
            email: row.email || row.Email || row['EMAIL'] || row['Email Address'] || '',
            grade: row.grade || row.Grade || row['GRADE'] || row.Class || row['class'] || '',
            section: row.section || row.Section || row['SECTION'] || '',
            academicYear: row.academicYear || row['Academic Year'] || row['ACADEMIC YEAR'] || '',
            fatherName: row.fatherName || row["Father Name"] || row["Father's Name"] || row['FATHER NAME'] || '',
            fatherContact: row.fatherContact || row["Father Contact"] || row["Father's Contact"] || row['FATHER CONTACT'] || '',
            totalFee: parseFloat(row.totalFee || row['Total Fee'] || row['TOTAL FEE'] || 0) || 0,
          })).filter(s => s.fullName && s.email);
          setBulkStudents(mapped);
        };
        reader.readAsArrayBuffer(blob);
      }
    } catch (error) {
      Alert.alert('Error', 'File reading failed.');
    }
  };

  const confirmAndSendStudents = () => {
    Alert.alert(
      "Confirm Bulk Create",
      `Are you sure you want to create ${bulkStudents.length} students?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK, Create", onPress: () => handleBulkCreate() }
      ]
    );
  };

  const handleBulkCreate = async () => {
    if (bulkStudents.length === 0) {
      Alert.alert("Warning", "No valid student data found. Please check the file.");
      return;
    }
    setSendingBulk(true);
    try {
      await rootApi.post('/api/student/bulk-create', bulkStudents);
      Alert.alert('Success', 'All students created successfully!');
      resetBulkModal();
      fetchStudents();
    } catch (error) {
      const errorMessage = error.response?.data || "Something went wrong, please try again.";
      const displayMessage = typeof errorMessage === 'string'
        ? errorMessage
        : (errorMessage.message || JSON.stringify(errorMessage));
      Alert.alert('Error', displayMessage);
    } finally {
      setSendingBulk(false);
    }
  };

  const resetBulkModal = () => {
    setBulkStudents([]);
    setBulkFileName('');
    setBulkModalVisible(false);
  };

  const transformStudentData = (s) => ({
    studentId: s.studentId || 'N/A',
    fullName: s.fullName || 'N/A',
    classSectionId: s.classSectionId || 'N/A',
    dateOfBirth: s.dateOfBirth || 'N/A',
    gender: s.gender || 'N/A',
    bloodGroup: s.bloodGroup || 'N/A',
    nationality: s.nationality || 'N/A',
    religion: s.religion || 'N/A',
    category: s.category || 'N/A',
    aadhaarNumber: s.aadhaarNumber || 'N/A',
    grade: s.grade || 'N/A',
    section: s.section || 'N/A',
    academicYear: s.academicYear || 'N/A',
    joiningDate: s.joiningDate || 'N/A',
    rollNumber: s.rollNumber || 'N/A',
    address: s.address || 'N/A',
    city: s.city || 'N/A',
    state: s.state || 'N/A',
    pincode: s.pincode || 'N/A',
    contactNumber: s.contactNumber || 'N/A',
    email: s.email || 'N/A',
    fatherName: s.fatherName || 'N/A',
    fatherContact: s.fatherContact || 'N/A',
    motherName: s.motherName || 'N/A',
    motherContact: s.motherContact || 'N/A',
    guardianName: s.guardianName || 'N/A',
    guardianContact: s.guardianContact || 'N/A',
    emergencyContactName: s.emergencyContactName || 'N/A',
    emergencyContactNumber: s.emergencyContactNumber || 'N/A',
    profileImageUrl: s.profileImageUrl || null,
    active: s.active ?? false,
    totalFee: s.totalFee || 0,
    trackingStatus: s.active ? 'Active' : 'Inactive',
    classDisplay: `${s.grade || 'N/A'}-${s.section || 'N/A'}`,
  });

  const filteredStudents = students
    .map(transformStudentData)
    .filter(item =>
      item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.grade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const openStudentProfile = (student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const openEditFromRow = (student) => {
    setSelectedStudent(student);
    const clean = (val) => (!val || val === 'N/A') ? '' : val;
    setEditForm({
      fullName: clean(student.fullName),
      dateOfBirth: clean(student.dateOfBirth),
      gender: clean(student.gender),
      bloodGroup: clean(student.bloodGroup),
      nationality: clean(student.nationality),
      religion: clean(student.religion),
      category: clean(student.category),
      aadhaarNumber: clean(student.aadhaarNumber),
      rollNumber: clean(student.rollNumber),
      joiningDate: clean(student.joiningDate),
      active: student.active ?? false,
      email: clean(student.email),
      contactNumber: clean(student.contactNumber),
      address: clean(student.address),
      city: clean(student.city),
      state: clean(student.state),
      pincode: clean(student.pincode),
      fatherName: clean(student.fatherName),
      fatherContact: clean(student.fatherContact),
      motherName: clean(student.motherName),
      motherContact: clean(student.motherContact),
      guardianName: clean(student.guardianName),
      guardianContact: clean(student.guardianContact),
      emergencyContactName: clean(student.emergencyContactName),
      emergencyContactNumber: clean(student.emergencyContactNumber),
    });
    setEditModalVisible(true);
  };

  const openReportModal = async (student) => {
    setSelectedStudent(student);
    setReportModalVisible(true);
    setReportLoading(true);
    setReportData(null);
    try {
      const res = await rootApi.get(`/api/student/${student.studentId}/report`);
      setReportData(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch student report.');
      setReportModalVisible(false);
    } finally {
      setReportLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    // Agar inactive hai toh sirf active toggle save karo
    if (!editForm.active) {
      await saveToServer({ active: false });
      return;
    }

    // Active hai toh full validation
    const errors = validateForm(editForm);
    if (errors.length > 0) {
      Alert.alert('Please fix the following:', errors.join('\n\n'));
      return;
    }

    await saveToServer(editForm);
  };

  const saveToServer = async (payload) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

      await rootApi.put(`/api/student/${selectedStudent.studentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updated = {
        ...selectedStudent,
        ...payload,
        trackingStatus: payload.active ? 'Active' : 'Inactive',
      };
      setSelectedStudent(updated);
      setStudents(prev =>
        prev.map(s => s.studentId === selectedStudent.studentId
          ? { ...s, ...payload, active: payload.active }
          : s
        )
      );
      Alert.alert('Success', 'Student updated successfully!');
      setEditModalVisible(false);
    } catch (error) {
      const msg = error.response?.data?.message || 'Update failed. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#A0522D" />
        <Text style={{ marginTop: 16, color: '#8c7664' }}>Loading student records...</Text>
      </View>
    );
  }

  const renderStudentRowOrCard = ({ item }) => {
    if (isLargeScreen) {
      return (
        <View style={[styles.tableRow, !item.active && styles.tableRowInactive]}>
          <View style={[styles.tableCell, styles.cellAvatarContainer]}>
            {item.profileImageUrl ? (
              <Image source={{ uri: item.profileImageUrl }} style={styles.avatarImageSmall} />
            ) : (
              <View style={[styles.avatarCircleSmall, !item.active && { backgroundColor: '#d1d5db' }]}>
                <Text style={styles.avatarInitialTextSmall}>{item.fullName?.[0] || '?'}</Text>
              </View>
            )}
          </View>
          <View style={[styles.tableCell, styles.cellNameBlock]}>
            <Text style={[styles.itemNameText, !item.active && styles.inactiveText]}>{item.fullName}</Text>
            <Text style={styles.itemClassText}>
              ID: {item.studentId} • Class: {item.classDisplay} • Roll: {item.rollNumber}
            </Text>
          </View>
          <Text style={[styles.tableCell, styles.cellMeta, !item.active && styles.inactiveText]}>
            {item.grade}-{item.section}
          </Text>
          <Text style={[styles.tableCell, styles.cellMeta, { color: item.active ? '#16a34a' : '#E35336', fontWeight: '600' }]}>
            {item.trackingStatus}
          </Text>
          <View style={styles.actionBtns}>
            <TouchableOpacity style={styles.desktopViewBtn} onPress={() => openStudentProfile(item)}>
              <Icons.User size={13} color="#ffffff" />
              <Text style={styles.desktopBtnText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.desktopEditBtn} onPress={() => openEditFromRow(item)}>
              <Icons.Pencil size={13} color="#ffffff" />
              <Text style={styles.desktopBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.desktopReportBtn} onPress={() => openReportModal(item)}>
              <Icons.FileText size={13} color="#ffffff" />
              <Text style={styles.desktopBtnText}>Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.mobileCard, !item.active && styles.mobileCardInactive]}>
        <View style={styles.cardHeader}>
          <View style={styles.mobileProfileBlock}>
            {item.profileImageUrl ? (
              <Image source={{ uri: item.profileImageUrl }} style={styles.avatarImageSmall} />
            ) : (
              <View style={[styles.avatarCircleSmall, !item.active && { backgroundColor: '#d1d5db' }]}>
                <Text style={styles.avatarInitialTextSmall}>{item.fullName?.[0] || '?'}</Text>
              </View>
            )}
            <View>
              <Text style={[styles.cardName, !item.active && styles.inactiveText]}>{item.fullName}</Text>
              <Text style={styles.cardClass}>ID: {item.studentId}</Text>
              <Text style={styles.cardClass}>Class: {item.classDisplay} • Roll: {item.rollNumber}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, item.active ? styles.badgeGreen : styles.badgeRed]}>
            <Text style={item.active ? styles.textGreen : styles.textRed}>{item.trackingStatus}</Text>
          </View>
        </View>
        <View style={styles.mobileActionRow}>
          <TouchableOpacity style={[styles.mobileActionBtn, { flex: 1 }]} onPress={() => openStudentProfile(item)}>
            <Text style={styles.mobileActionBtnText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mobileEditBtn, { flex: 1 }]} onPress={() => openEditFromRow(item)}>
            <Icons.Pencil size={14} color="#ffffff" />
            <Text style={styles.mobileActionBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.mobileReportBtn} onPress={() => openReportModal(item)}>
          <Icons.FileText size={14} color="#ffffff" />
          <Text style={styles.mobileActionBtnText}>View Report</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Inactive check — sirf toggle kaam kare
  const isInactive = !editForm.active;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.mainTitle}>Student Master Directory</Text>
          <Text style={styles.mainSubtitle}>
            Complete student information system with personal, academic, family, and contact details.
          </Text>
        </View>
        <TouchableOpacity style={styles.bulkAddButton} onPress={() => setBulkModalVisible(true)}>
          <Icons.Plus color="#ffffff" size={16} />
          <Text style={styles.bulkAddButtonText}>Bulk Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBarBox}>
        <Icons.Search color="#8c7664" size={18} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchField}
          placeholder="Search by name, student ID, grade, or section..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#bc9e82"
        />
      </View>

      {isLargeScreen && (
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.cellAvatarContainer]}>Photo</Text>
          <Text style={[styles.tableHeaderCell, styles.cellNameBlock]}>Student Details</Text>
          <Text style={[styles.tableHeaderCell, styles.cellMeta]}>Class</Text>
          <Text style={[styles.tableHeaderCell, styles.cellMeta]}>Status</Text>
          <Text style={[styles.tableHeaderCell, styles.cellActionHeader]}>Actions</Text>
        </View>
      )}

      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.studentId}
        renderItem={renderStudentRowOrCard}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No students found matching "{searchQuery}"</Text>
          </View>
        )}
      />

      {/* ── Profile Modal ─────────────────────────────────────── */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalWrapper, { width: isLargeScreen ? 700 : '95%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalHeaderTitle}>Student Profile</Text>
                <Text style={styles.modalHeaderSub}>ID: {selectedStudent?.studentId}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Icons.X size={18} color="#A0522D" />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <ScrollView contentContainerStyle={styles.modalScrollBody}>
                {/* Inactive banner */}
                {!selectedStudent.active && (
                  <View style={styles.inactiveBanner}>
                    <Icons.Lock size={14} color="#dc2626" />
                    <Text style={styles.inactiveBannerText}>
                      This student is Inactive. Profile is view-only.
                    </Text>
                  </View>
                )}

                <View style={styles.studentIdentCard}>
                  {selectedStudent.profileImageUrl ? (
                    <Image source={{ uri: selectedStudent.profileImageUrl }} style={styles.avatarLargeImage} />
                  ) : (
                    <View style={[styles.avatarLarge, !selectedStudent.active && { backgroundColor: '#9ca3af' }]}>
                      <Text style={styles.avatarLargeText}>{selectedStudent.fullName?.[0] || '?'}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.identName}>{selectedStudent.fullName}</Text>
                    <Text style={styles.identClass}>Class: {selectedStudent.classDisplay}</Text>
                    <Text style={styles.identClass}>Roll: {selectedStudent.rollNumber}</Text>
                    <Text style={[styles.identParent, { color: selectedStudent.active ? '#16a34a' : '#E35336' }]}>
                      Status: {selectedStudent.trackingStatus}
                    </Text>
                  </View>
                </View>

                {[
                  ['👤 Personal Information', [
                    ['Date of Birth', 'dateOfBirth'], ['Gender', 'gender'],
                    ['Blood Group', 'bloodGroup'], ['Nationality', 'nationality'],
                    ['Religion', 'religion'], ['Category', 'category'],
                    ['Aadhaar Number', 'aadhaarNumber'],
                  ]],
                  ['🎓 Academic Information', [
                    ['Grade', 'grade'], ['Section', 'section'],
                    ['Roll Number', 'rollNumber'], ['Academic Year', 'academicYear'],
                    ['Joining Date', 'joiningDate'],
                  ]],
                  ['📞 Contact Information', [
                    ['Email', 'email'], ['Mobile', 'contactNumber'],
                    ['Address', 'address'], ['City', 'city'],
                    ['State', 'state'], ['Pincode', 'pincode'],
                  ]],
                  ['👨‍👩‍👧 Family Information', [
                    ["Father's Name", 'fatherName'], ["Father's Contact", 'fatherContact'],
                    ["Mother's Name", 'motherName'], ["Mother's Contact", 'motherContact'],
                    ["Guardian's Name", 'guardianName'], ["Guardian's Contact", 'guardianContact'],
                  ]],
                  ['🚨 Emergency Contact', [
                    ['Contact Name', 'emergencyContactName'],
                    ['Contact Number', 'emergencyContactNumber'],
                  ]],
                ].map(([title, rows]) => (
                  <View key={title}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <View style={styles.infoGrid}>
                      {rows.map(([label, key]) => (
                        <View style={styles.infoRow} key={key}>
                          <Text style={styles.infoLabel}>{label}:</Text>
                          <Text style={styles.infoValue}>{selectedStudent[key]}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}

                <Text style={styles.sectionTitle}>💰 Fee Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Total Fee:</Text>
                    <Text style={[styles.infoValue, { color: '#A0522D', fontWeight: '700' }]}>
                      ₹{selectedStudent.totalFee?.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity style={styles.dismissBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.dismissBtnText}>Close Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Edit Modal ────────────────────────────────────────── */}
      <Modal animationType="slide" transparent visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalWrapper, { width: isLargeScreen ? 600 : '95%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalHeaderTitle}>Edit Student</Text>
                <Text style={styles.modalHeaderSub}>{selectedStudent?.fullName}</Text>
              </View>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeBtn}>
                <Icons.X size={18} color="#A0522D" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollBody}>

              {/* Inactive banner in edit */}
              {isInactive && (
                <View style={styles.inactiveBanner}>
                  <Icons.Lock size={14} color="#dc2626" />
                  <Text style={styles.inactiveBannerText}>
                    Student is Inactive. Only Status toggle is enabled. Activate to edit other fields.
                  </Text>
                </View>
              )}

              {/* Status toggle — always enabled */}
              <Text style={styles.sectionTitle}>🔘 Status</Text>
              <ToggleField label="Student Status" field="active" editForm={editForm} setEditForm={setEditForm} />

              {/* Personal */}
              <Text style={styles.sectionTitle}>👤 Personal</Text>
              <Field label="Full Name" field="fullName" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Date of Birth (YYYY-MM-DD)" field="dateOfBirth" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Gender" field="gender" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Blood Group" field="bloodGroup" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Nationality" field="nationality" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Religion" field="religion" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Category" field="category" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Aadhaar Number" field="aadhaarNumber" keyboardType="numeric" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />

              {/* Academic */}
              <Text style={styles.sectionTitle}>🎓 Academic</Text>
              <Field label="Roll Number" field="rollNumber" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Joining Date (YYYY-MM-DD)" field="joiningDate" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />

              {/* Contact */}
              <Text style={styles.sectionTitle}>📞 Contact</Text>
              <Field label="Email" field="email" keyboardType="email-address" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Mobile Number" field="contactNumber" keyboardType="phone-pad" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Address" field="address" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="City" field="city" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="State" field="state" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Pincode" field="pincode" keyboardType="numeric" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />

              {/* Family */}
              <Text style={styles.sectionTitle}>👨‍👩‍👧 Family</Text>
              <Field label="Father's Name" field="fatherName" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Father's Contact" field="fatherContact" keyboardType="phone-pad" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Mother's Name" field="motherName" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Mother's Contact" field="motherContact" keyboardType="phone-pad" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Guardian's Name" field="guardianName" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Guardian's Contact" field="guardianContact" keyboardType="phone-pad" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />

              {/* Emergency */}
              <Text style={styles.sectionTitle}>🚨 Emergency</Text>
              <Field label="Emergency Contact Name" field="emergencyContactName" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />
              <Field label="Emergency Contact Number" field="emergencyContactNumber" keyboardType="phone-pad" editForm={editForm} setEditForm={setEditForm} disabled={isInactive} />

            </ScrollView>

            <TouchableOpacity
              style={[styles.dismissBtn, saving && { opacity: 0.7 }]}
              onPress={handleSaveEdit}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.dismissBtnText}>
                  {isInactive ? 'Activate Student' : 'Save Changes'}
                </Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Report Modal ───────────────────────────────────────── */}
      <Modal animationType="fade" transparent visible={reportModalVisible} onRequestClose={() => setReportModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalWrapper, { width: isLargeScreen ? 720 : '95%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalHeaderTitle}>📊 Student Report</Text>
                <Text style={styles.modalHeaderSub}>{reportData?.fullName || selectedStudent?.fullName} • {reportData?.studentId || selectedStudent?.studentId}</Text>
              </View>
              <TouchableOpacity onPress={() => setReportModalVisible(false)} style={styles.closeBtn}>
                <Icons.X size={18} color="#A0522D" />
              </TouchableOpacity>
            </View>

            {reportLoading ? (
              <View style={styles.reportLoadingWrap}>
                <ActivityIndicator size="large" color="#A0522D" />
                <Text style={{ marginTop: 12, color: '#8c7664', fontSize: 14 }}>Loading report...</Text>
              </View>
            ) : reportData ? (
              <ScrollView contentContainerStyle={styles.modalScrollBody}>
                {/* Summary Card */}
                <View style={styles.reportSummaryCard}>
                  <View style={styles.reportSummaryRow}>
                    <View style={styles.reportSummaryItem}>
                      <Text style={styles.reportSummaryLabel}>Roll Number</Text>
                      <Text style={styles.reportSummaryValue}>{reportData.rollNumber}</Text>
                    </View>
                    <View style={styles.reportSummaryItem}>
                      <Text style={styles.reportSummaryLabel}>Academic Year</Text>
                      <Text style={styles.reportSummaryValue}>{reportData.academicYear}</Text>
                    </View>
                    <View style={styles.reportSummaryItem}>
                      <Text style={styles.reportSummaryLabel}>Overall %</Text>
                      <Text style={[styles.reportSummaryValue, { color: reportData.totalAggregatedPercentage >= 40 ? '#16a34a' : '#E35336', fontSize: 22 }]}>
                        {reportData.totalAggregatedPercentage}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Exam Performances */}
                {reportData.examPerformances?.map((exam, idx) => (
                  <View key={exam.examId || idx} style={styles.reportExamBlock}>
                    <View style={styles.reportExamHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reportExamTitle}>{exam.examName}</Text>
                        <Text style={styles.reportExamSub}>Exam ID: {exam.examId}</Text>
                      </View>
                      <View style={styles.reportExamMeta}>
                        <View style={[styles.reportResultBadge, exam.overallResultStatus === 'PASS' ? styles.badgeGreen : styles.badgeRed]}>
                          <Text style={exam.overallResultStatus === 'PASS' ? styles.textGreen : styles.textRed}>
                            {exam.overallResultStatus}
                          </Text>
                        </View>
                        <Text style={styles.reportExamPct}>{exam.examPercentage}%</Text>
                      </View>
                    </View>

                    {/* Subject Marks Table */}
                    {isLargeScreen ? (
                      <View style={styles.reportTableWrap}>
                        <View style={styles.reportTableHeaderRow}>
                          <Text style={[styles.reportTableHeaderCell, { flex: 1.5 }]}>Subject ID</Text>
                          <Text style={[styles.reportTableHeaderCell, { flex: 1 }]}>Marks</Text>
                          <Text style={[styles.reportTableHeaderCell, { flex: 1 }]}>Attendance</Text>
                          <Text style={[styles.reportTableHeaderCell, { flex: 2 }]}>Remarks</Text>
                        </View>
                        {exam.subjectMarks?.map((sub, sIdx) => (
                          <View key={sub.subjectId || sIdx} style={styles.reportTableDataRow}>
                            <Text style={[styles.reportTableDataCell, { flex: 1.5, fontWeight: '600' }]}>{sub.subjectId}</Text>
                            <Text style={[styles.reportTableDataCell, { flex: 1, color: '#A0522D', fontWeight: '700' }]}>{sub.obtainedMarks}</Text>
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                              <View style={[styles.reportAttendanceBadge, sub.attendanceStatus === 'PRESENT' ? styles.badgeGreen : styles.badgeRed]}>
                                <Text style={[sub.attendanceStatus === 'PRESENT' ? styles.textGreen : styles.textRed, { fontSize: 11 }]}>
                                  {sub.attendanceStatus}
                                </Text>
                              </View>
                            </View>
                            <Text style={[styles.reportTableDataCell, { flex: 2, color: '#64748b' }]}>{sub.remarks || '—'}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      /* Mobile: Card layout for subjects */
                      exam.subjectMarks?.map((sub, sIdx) => (
                        <View key={sub.subjectId || sIdx} style={styles.reportMobileSubjectCard}>
                          <View style={styles.reportMobileSubjectRow}>
                            <Text style={styles.reportMobileSubjectLabel}>Subject ID</Text>
                            <Text style={[styles.reportMobileSubjectValue, { fontWeight: '600' }]}>{sub.subjectId}</Text>
                          </View>
                          <View style={styles.reportMobileSubjectRow}>
                            <Text style={styles.reportMobileSubjectLabel}>Obtained Marks</Text>
                            <Text style={[styles.reportMobileSubjectValue, { color: '#A0522D', fontWeight: '700', fontSize: 16 }]}>{sub.obtainedMarks}</Text>
                          </View>
                          <View style={styles.reportMobileSubjectRow}>
                            <Text style={styles.reportMobileSubjectLabel}>Attendance</Text>
                            <View style={[styles.reportAttendanceBadge, sub.attendanceStatus === 'PRESENT' ? styles.badgeGreen : styles.badgeRed]}>
                              <Text style={[sub.attendanceStatus === 'PRESENT' ? styles.textGreen : styles.textRed, { fontSize: 11 }]}>
                                {sub.attendanceStatus}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.reportMobileSubjectRow}>
                            <Text style={styles.reportMobileSubjectLabel}>Remarks</Text>
                            <Text style={[styles.reportMobileSubjectValue, { color: '#64748b' }]}>{sub.remarks || '—'}</Text>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                ))}

                {(!reportData.examPerformances || reportData.examPerformances.length === 0) && (
                  <View style={styles.emptyState}>
                    <Icons.FileX size={32} color="#bc9e82" />
                    <Text style={[styles.emptyStateText, { marginTop: 8 }]}>No exam records found for this student.</Text>
                  </View>
                )}
              </ScrollView>
            ) : null}

            <TouchableOpacity style={styles.dismissBtn} onPress={() => setReportModalVisible(false)}>
              <Text style={styles.dismissBtnText}>Close Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Bulk Add Students Modal ─────────────────────────────── */}
      <Modal animationType="fade" transparent visible={bulkModalVisible} onRequestClose={resetBulkModal}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalWrapper, { width: isLargeScreen ? 560 : '95%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalHeaderTitle}>📥 Bulk Add Students</Text>
                <Text style={styles.modalHeaderSub}>Upload Excel/CSV with student data</Text>
              </View>
              <TouchableOpacity onPress={resetBulkModal} style={styles.closeBtn}>
                <Icons.X size={18} color="#A0522D" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollBody}>
              {bulkStudents.length === 0 ? (
                <View style={styles.bulkUploadArea}>
                  <View style={styles.bulkUploadIcon}>
                    <Icons.Upload size={32} color="#A0522D" />
                  </View>
                  <Text style={styles.bulkUploadTitle}>Upload Student Data</Text>
                  <Text style={styles.bulkUploadDesc}>
                    Excel/CSV file must have columns: Full Name, Email, Grade, Section, Academic Year, Father Name, Father Contact, Total Fee
                  </Text>
                  <TouchableOpacity style={styles.bulkSelectFileBtn} onPress={pickStudentFile}>
                    <Icons.FileSpreadsheet size={16} color="#ffffff" />
                    <Text style={styles.bulkSelectFileBtnText}>Select Excel / CSV File</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.bulkFileInfoCard}>
                    <View style={styles.bulkFileInfoRow}>
                      <Icons.FileCheck size={20} color="#16a34a" />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.bulkFileNameText}>{bulkFileName}</Text>
                        <Text style={styles.bulkFileCountText}>{bulkStudents.length} students ready to create</Text>
                      </View>
                    </View>
                  </View>

                  {/* Preview first 5 students */}
                  <Text style={styles.sectionTitle}>👁️ Preview (first 5)</Text>
                  <View style={styles.bulkPreviewTable}>
                    <View style={styles.bulkPreviewHeaderRow}>
                      <Text style={[styles.bulkPreviewHeaderCell, { flex: 1.5 }]}>Name</Text>
                      <Text style={[styles.bulkPreviewHeaderCell, { flex: 2 }]}>Email</Text>
                      <Text style={[styles.bulkPreviewHeaderCell, { flex: 0.7 }]}>Grade</Text>
                      <Text style={[styles.bulkPreviewHeaderCell, { flex: 0.7 }]}>Fee</Text>
                    </View>
                    {bulkStudents.slice(0, 5).map((s, i) => (
                      <View key={i} style={styles.bulkPreviewDataRow}>
                        <Text style={[styles.bulkPreviewDataCell, { flex: 1.5 }]} numberOfLines={1}>{s.fullName}</Text>
                        <Text style={[styles.bulkPreviewDataCell, { flex: 2, color: '#64748b' }]} numberOfLines={1}>{s.email}</Text>
                        <Text style={[styles.bulkPreviewDataCell, { flex: 0.7 }]}>{s.grade}-{s.section}</Text>
                        <Text style={[styles.bulkPreviewDataCell, { flex: 0.7, color: '#A0522D', fontWeight: '700' }]}>₹{s.totalFee}</Text>
                      </View>
                    ))}
                    {bulkStudents.length > 5 && (
                      <Text style={styles.bulkMoreText}>...and {bulkStudents.length - 5} more students</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.bulkSendBtn, sendingBulk && { opacity: 0.7 }]}
                    onPress={confirmAndSendStudents}
                    disabled={sendingBulk}
                  >
                    {sendingBulk
                      ? <ActivityIndicator color="#fff" />
                      : <>
                          <Icons.UserPlus size={16} color="#ffffff" />
                          <Text style={styles.bulkSendBtnText}>Create {bulkStudents.length} Students</Text>
                        </>
                    }
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => { setBulkStudents([]); setBulkFileName(''); }}
                    disabled={sendingBulk}
                    style={styles.bulkClearBtn}
                  >
                    <Icons.Trash2 size={14} color="#dc2626" />
                    <Text style={styles.bulkClearBtnText}>Clear File</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC', padding: 16 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  mainTitle: { fontSize: 22, fontWeight: '700', color: '#A0522D' },
  mainSubtitle: { fontSize: 14, color: '#8c7664', marginTop: 4, lineHeight: 20, fontWeight: '500' },
  bulkAddButton: { backgroundColor: '#A0522D', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  bulkAddButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  searchBarBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 20 },
  searchField: { flex: 1, fontSize: 14, color: '#2e2520' },

  avatarCircleSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eaddcc', alignItems: 'center', justifyContent: 'center' },
  avatarInitialTextSmall: { color: '#A0522D', fontWeight: '700', fontSize: 16 },
  avatarImageSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eaddcc' },
  mobileProfileBlock: { flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1 },

  tableHeader: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 12, paddingHorizontal: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center' },
  tableHeaderCell: { fontSize: 13, fontWeight: '700', color: '#A0522D' },
  tableRow: { flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', alignItems: 'center' },
  tableRowInactive: { backgroundColor: '#f9fafb' },
  tableCell: { fontSize: 14, color: '#334155' },
  cellAvatarContainer: { flex: 0.5 },
  cellNameBlock: { flex: 2.5 },
  cellMeta: { flex: 0.8 },
  cellActionHeader: { flex: 1, textAlign: 'center' },
  itemNameText: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  itemClassText: { fontSize: 12, color: '#8c7664', marginTop: 1 },
  inactiveText: { color: '#9ca3af' },

  actionBtns: { flex: 1.4, flexDirection: 'row', gap: 6, justifyContent: 'center', flexWrap: 'wrap' },
  desktopViewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#E35336' },
  desktopEditBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#A0522D' },
  desktopReportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#1e6ca1' },
  desktopBtnText: { fontSize: 11, fontWeight: '700', color: '#ffffff' },

  mobileCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#eaddcc' },
  mobileCardInactive: { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#2e2520' },
  cardClass: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  mobileActionRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  mobileActionBtn: { backgroundColor: '#E35336', height: 40, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  mobileEditBtn: { backgroundColor: '#A0522D', height: 40, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  mobileReportBtn: { backgroundColor: '#1e6ca1', height: 40, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 },
  mobileActionBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeGreen: { backgroundColor: '#dcfce7' },
  badgeRed: { backgroundColor: '#ffebee' },
  textGreen: { color: '#16a34a', fontSize: 12, fontWeight: '700' },
  textRed: { color: '#E35336', fontSize: 12, fontWeight: '700' },

  // Inactive banner
  inactiveBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff1f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 8, padding: 12, marginBottom: 16 },
  inactiveBannerText: { color: '#dc2626', fontSize: 12, fontWeight: '600', flex: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(46, 37, 32, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalWrapper: { backgroundColor: '#ffffff', borderRadius: 14, maxHeight: '90%', overflow: 'hidden', borderWidth: 1, borderColor: '#eaddcc' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', backgroundColor: '#faf6f0' },
  modalHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#A0522D' },
  modalHeaderSub: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  closeBtn: { padding: 4, backgroundColor: '#ffffff', borderRadius: 6, borderWidth: 1, borderColor: '#eaddcc' },
  modalScrollBody: { padding: 20 },

  studentIdentCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#faf6f0', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#f5ebe0', marginBottom: 20 },
  avatarLarge: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#A0522D', alignItems: 'center', justifyContent: 'center' },
  avatarLargeText: { color: '#ffffff', fontSize: 28, fontWeight: '700' },
  avatarLargeImage: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#eaddcc' },
  identName: { fontSize: 18, fontWeight: '700', color: '#2e2520' },
  identClass: { fontSize: 14, color: '#475569', marginTop: 2 },
  identParent: { fontSize: 13, color: '#8c7664', marginTop: 2, fontWeight: '500' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#A0522D', marginTop: 20, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eaddcc', paddingBottom: 6 },
  infoGrid: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, padding: 12, marginBottom: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f5ebe0' },
  infoLabel: { fontSize: 13, color: '#64748b', fontWeight: '600', flex: 0.4 },
  infoValue: { fontSize: 13, color: '#2e2520', fontWeight: '500', flex: 0.6, textAlign: 'right' },

  editFieldWrap: { marginBottom: 12 },
  editLabel: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 4 },
  editInput: { backgroundColor: '#faf6f0', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#2e2520' },
  editInputDisabled: { backgroundColor: '#f3f4f6', borderColor: '#e5e7eb', color: '#9ca3af' },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#faf6f0', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  toggleRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleStatus: { fontSize: 13, fontWeight: '700' },

  dismissBtn: { height: 52, backgroundColor: '#A0522D', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 },
  dismissBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },

  emptyState: { padding: 40, alignItems: 'center' },
  emptyStateText: { color: '#8c7664', fontSize: 14 },

  // Report modal styles
  reportLoadingWrap: { padding: 60, alignItems: 'center', justifyContent: 'center' },
  reportSummaryCard: { backgroundColor: '#faf6f0', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 12, padding: 16, marginBottom: 20 },
  reportSummaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  reportSummaryItem: { flex: 1, minWidth: 100, alignItems: 'center' },
  reportSummaryLabel: { fontSize: 11, color: '#8c7664', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  reportSummaryValue: { fontSize: 16, color: '#2e2520', fontWeight: '700' },
  reportExamBlock: { marginBottom: 20, borderWidth: 1, borderColor: '#eaddcc', borderRadius: 12, overflow: 'hidden' },
  reportExamHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#faf6f0', padding: 14, borderBottomWidth: 1, borderBottomColor: '#eaddcc' },
  reportExamTitle: { fontSize: 16, fontWeight: '700', color: '#A0522D' },
  reportExamSub: { fontSize: 11, color: '#8c7664', marginTop: 2 },
  reportExamMeta: { alignItems: 'flex-end', gap: 4 },
  reportResultBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  reportExamPct: { fontSize: 18, fontWeight: '800', color: '#A0522D' },
  reportTableWrap: { backgroundColor: '#ffffff' },
  reportTableHeaderRow: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 10, paddingHorizontal: 14 },
  reportTableHeaderCell: { fontSize: 12, fontWeight: '700', color: '#A0522D' },
  reportTableDataRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#f5ebe0' },
  reportTableDataCell: { fontSize: 13, color: '#2e2520' },
  reportAttendanceBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  reportMobileSubjectCard: { backgroundColor: '#ffffff', margin: 10, borderRadius: 10, borderWidth: 1, borderColor: '#f5ebe0', padding: 14, gap: 8 },
  reportMobileSubjectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportMobileSubjectLabel: { fontSize: 12, color: '#8c7664', fontWeight: '600' },
  reportMobileSubjectValue: { fontSize: 13, color: '#2e2520' },

  // Bulk upload modal styles
  bulkUploadArea: { alignItems: 'center', paddingVertical: 30 },
  bulkUploadIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#faf6f0', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#eaddcc', borderStyle: 'dashed' },
  bulkUploadTitle: { fontSize: 18, fontWeight: '700', color: '#2e2520', marginBottom: 8 },
  bulkUploadDesc: { fontSize: 12, color: '#8c7664', textAlign: 'center', lineHeight: 18, marginBottom: 20, paddingHorizontal: 10 },
  bulkSelectFileBtn: { backgroundColor: '#059669', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  bulkSelectFileBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  bulkFileInfoCard: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 10, padding: 14, marginBottom: 16 },
  bulkFileInfoRow: { flexDirection: 'row', alignItems: 'center' },
  bulkFileNameText: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  bulkFileCountText: { fontSize: 12, color: '#16a34a', fontWeight: '600', marginTop: 2 },
  bulkPreviewTable: { borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, overflow: 'hidden', marginBottom: 16 },
  bulkPreviewHeaderRow: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 8, paddingHorizontal: 10 },
  bulkPreviewHeaderCell: { fontSize: 11, fontWeight: '700', color: '#A0522D' },
  bulkPreviewDataRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', backgroundColor: '#ffffff' },
  bulkPreviewDataCell: { fontSize: 11, color: '#2e2520' },
  bulkMoreText: { textAlign: 'center', color: '#8c7664', fontSize: 12, paddingVertical: 8, backgroundColor: '#faf6f0', fontStyle: 'italic' },
  bulkSendBtn: { backgroundColor: '#A0522D', paddingVertical: 14, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 },
  bulkSendBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  bulkClearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  bulkClearBtnText: { color: '#dc2626', fontWeight: '600', fontSize: 13 },
});