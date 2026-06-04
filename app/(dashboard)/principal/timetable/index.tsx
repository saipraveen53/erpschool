import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Modal, TextInput, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { 
  Plus, 
  X, 
  BookOpen, 
  Tag, 
  User, 
  UserCheck, 
  GraduationCap, 
  Phone, 
  Mail, 
  Calendar, 
  Hash, 
  CheckCircle, 
  XCircle, 
  Save,
  Book,
  Clock,
  Users,
  Layers,
  School,
  Filter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Edit2,
  Trash2,
  AlertCircle,
  Eye
} from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';
import DateTimePicker from '@react-native-community/datetimepicker';

const TABS = [
  { id: 'Subjects', title: 'Subjects', icon: BookOpen, color: '#A0522D' },
  { id: 'Allocations', title: 'Allocations', icon: UserCheck, color: '#16a34a' },
  { id: 'ClassTeachers', title: 'Class Teachers', icon: Users, color: '#3b82f6' },
  { id: 'Timetable', title: 'Timetable', icon: Clock, color: '#f59e0b' },
  { id: 'Classes', title: 'Classes', icon: School, color: '#8b5cf6' }
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

export default function SubjectManagement() {
  const [activeTab, setActiveTab] = useState('Subjects');
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [allocationModalVisible, setAllocationModalVisible] = useState(false);
  const [timetableModalVisible, setTimetableModalVisible] = useState(false);
  const [viewTimetableModalVisible, setViewTimetableModalVisible] = useState(false);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState(null);
  const [newSubject, setNewSubject] = useState({ subjectName: '', subjectCode: '', active: true });
  const [newClass, setNewClass] = useState({ 
    className: '', 
    section: '', 
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    capacity: '',
    currentStrength: '',
    subjectIds: []
  });
  const [showPicker, setShowPicker] = useState({ show: false, idx: null, field: null });
  const [pickerDate, setPickerDate] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Subject-Teacher Allocation states
  const [allocationForm, setAllocationForm] = useState({
    classSectionId: '',
    subjectId: '',
    teacherId: ''
  });
  const [selectedClassForAllocation, setSelectedClassForAllocation] = useState(null);
  const [selectedSubjectForAllocation, setSelectedSubjectForAllocation] = useState(null);
  const [selectedTeacherForAllocation, setSelectedTeacherForAllocation] = useState(null);
  const [isAllocClassDropdownOpen, setIsAllocClassDropdownOpen] = useState(false);
  const [isAllocSubjectDropdownOpen, setIsAllocSubjectDropdownOpen] = useState(false);
  const [isAllocTeacherDropdownOpen, setIsAllocTeacherDropdownOpen] = useState(false);
  
  // View Allocations states
  const [selectedClassForView, setSelectedClassForView] = useState(null);
  const [classSubjectTeachers, setClassSubjectTeachers] = useState([]);
  const [loadingAllocations, setLoadingAllocations] = useState(false);
  const [isViewClassDropdownOpen, setIsViewClassDropdownOpen] = useState(false);
  
  // Assign class teacher states
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [isEditClassDropdownOpen, setIsEditClassDropdownOpen] = useState(false);
  const [isEditTeacherDropdownOpen, setIsEditTeacherDropdownOpen] = useState(false);

  // Timetable states
  const [timetableClassId, setTimetableClassId] = useState(null);
  const [timetableClassObj, setTimetableClassObj] = useState(null);
  const [isTTClassDropdownOpen, setIsTTClassDropdownOpen] = useState(false);
  const [periods, setPeriods] = useState([
    { day: '', subjectId: '', teacherId: '', startTime: '', endTime: '', 
      subjectObj: null, teacherObj: null, isDayOpen: false, isSubjectOpen: false, isTeacherOpen: false }
  ]);
  const [timetableErrors, setTimetableErrors] = useState({});
  
  // View Timetable states
  const [viewTimetableClassId, setViewTimetableClassId] = useState(null);
  const [viewTimetableClassObj, setViewTimetableClassObj] = useState(null);
  const [isViewTTClassDropdownOpen, setIsViewTTClassDropdownOpen] = useState(false);
  const [viewTimetableData, setViewTimetableData] = useState([]);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [viewPicker, setViewPicker] = useState({ show: false, periodId: null, field: null });
  const [editingPeriod, setEditingPeriod] = useState(null);

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  // Fetch subjects data
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/subject/allSubjects');
      setSubjects(res.data);
      setAvailableSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects", err);
      Alert.alert('Error', 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/class-sections');
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching classes", err);
      Alert.alert('Error', 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassTeachers = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/class-sections/class-teachers');
      const classesWithTeachers = res.data.filter(cls => cls.classTeacherId !== null);
      setClassTeachers(classesWithTeachers);
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching class teachers", err);
      Alert.alert('Error', 'Failed to fetch class teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await rootApi.get('/api/student/teacher/all');
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers", err);
      Alert.alert('Error', 'Failed to fetch teachers');
    }
  };

  const fetchSubjectTeachersByClassId = async (classSectionId) => {
    setLoadingAllocations(true);
    try {
      const res = await rootApi.get(`/api/student/subject/${classSectionId}/teachers`);
      let normalized = [];
      if (Array.isArray(res.data)) {
        const first = res.data[0];
        if (first && first.subjects) {
          normalized = first.subjects.map(s => ({
            subjectName: s.subject || s.subjectName || 'Unknown Subject',
            teacherName: s.teacher || s.teacherName || 'Not Assigned'
          }));
        } else {
          normalized = res.data.map(s => ({
            ...s,
            subjectName: s.subjectName || s.subject || 'Unknown Subject',
            teacherName: s.teacherName || s.teacher || 'Not Assigned'
          }));
        }
      } else if (res.data && res.data.subjects) {
        normalized = res.data.subjects.map(s => ({
          subjectName: s.subject || s.subjectName || 'Unknown Subject',
          teacherName: s.teacher || s.teacherName || 'Not Assigned'
        }));
      }
      setClassSubjectTeachers(normalized);
    } catch (err) {
      console.error("Error fetching subject teachers", err);
      setClassSubjectTeachers([]);
      const status = err?.response?.status;
      if (status === 500) {
        Alert.alert(
          'Backend Error',
          'Some subject assignments have incomplete data (teacher not properly linked). Please re-assign the subject teacher from the Assign Subject button.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to fetch subject teachers for this class');
      }
    } finally {
      setLoadingAllocations(false);
    }
  };

  const assignSubjectTeacher = async () => {
    if (!allocationForm.classSectionId) {
      Alert.alert('Validation Error', 'Please select a class');
      return;
    }
    if (!allocationForm.subjectId) {
      Alert.alert('Validation Error', 'Please select a subject');
      return;
    }
    if (!allocationForm.teacherId) {
      Alert.alert('Validation Error', 'Please select a teacher');
      return;
    }

    setSubmitting(true);
    try {
      await rootApi.post('/api/student/subject/assignSubjectTeacher', {
        classSectionId: allocationForm.classSectionId,
        subjectId: allocationForm.subjectId,
        teacherId: allocationForm.teacherId
      });
      Alert.alert('Success', 'Subject teacher assigned successfully!');
      setAllocationModalVisible(false);
      resetAllocationForm();
      if (selectedClassForView?.classSectionId === allocationForm.classSectionId) {
        fetchSubjectTeachersByClassId(allocationForm.classSectionId);
      }
    } catch (err) {
      console.error("Error assigning subject teacher", err);
      Alert.alert('Error', 'Failed to assign subject teacher');
    } finally {
      setSubmitting(false);
    }
  };

  const createSubject = async () => {
    if (!newSubject.subjectName.trim() || !newSubject.subjectCode.trim()) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      await rootApi.post('/api/student/subject/createSubject', newSubject);
      Alert.alert('Success', 'Subject created successfully!');
      setModalVisible(false);
      setNewSubject({ subjectName: '', subjectCode: '', active: true });
      fetchSubjects();
    } catch (err) {
      console.error("Error creating subject", err);
      Alert.alert('Error', 'Failed to create subject');
    } finally {
      setSubmitting(false);
    }
  };

  const createClass = async () => {
    if (!newClass.className.trim() || !newClass.section.trim() || !newClass.capacity) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }
    if (selectedSubjects.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one subject');
      return;
    }
    const classData = {
      className: newClass.className,
      section: newClass.section,
      academicYear: newClass.academicYear,
      capacity: parseInt(newClass.capacity),
      currentStrength: parseInt(newClass.currentStrength) || 0,
      subjectIds: selectedSubjects.map(s => s.subjectId)
    };
    setSubmitting(true);
    try {
      await rootApi.post('/api/student/class-sections', classData);
      Alert.alert('Success', 'Class created successfully!');
      setClassModalVisible(false);
      resetClassForm();
      fetchClasses();
    } catch (err) {
      console.error("Error creating class", err);
      Alert.alert('Error', 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  const assignClassTeacher = async () => {
    if (!selectedClass) { Alert.alert('Validation Error', 'Please select a class'); return; }
    if (!selectedTeacher) { Alert.alert('Validation Error', 'Please select a teacher'); return; }
    setSubmitting(true);
    try {
      await rootApi.post(`/api/student/teacher/assign/${selectedTeacher.teacherId}/${selectedClass.classSectionId}`);
      Alert.alert('Success', 'Class teacher assigned successfully!');
      setAssignModalVisible(false);
      resetAssignForm();
      fetchClassTeachers();
      fetchClasses();
    } catch (err) {
      console.error("Error assigning class teacher", err);
      Alert.alert('Error', 'Failed to assign class teacher');
    } finally {
      setSubmitting(false);
    }
  };

  const updateClassTeacher = async () => {
    if (!selectedClassForEdit) { Alert.alert('Validation Error', 'Please select a class'); return; }
    if (!selectedTeacherForEdit) { Alert.alert('Validation Error', 'Please select a teacher'); return; }
    setSubmitting(true);
    try {
      await rootApi.put(`/api/student/teacher/assign/update/${selectedClassForEdit.classSectionId}/${selectedTeacherForEdit.teacherId}`);
      Alert.alert('Success', 'Class teacher updated successfully!');
      setEditModalVisible(false);
      resetEditForm();
      fetchClassTeachers();
      fetchClasses();
    } catch (err) {
      console.error("Error updating class teacher", err);
      Alert.alert('Error', 'Failed to update class teacher');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (classItem) => {
    setSelectedClassForEdit(classItem);
    if (classItem.classTeacherId) {
      const currentTeacher = teachers.find(t => t.teacherId === classItem.classTeacherId);
      setSelectedTeacherForEdit(currentTeacher || null);
    } else {
      setSelectedTeacherForEdit(null);
    }
    setEditModalVisible(true);
  };

  // Timetable functions
  const fetchTimetable = async (classSectionId) => {
    setLoadingTimetable(true);
    try {
      const res = await rootApi.get(`/api/student/class-sections/${classSectionId}/timetable`);
      const timetableData = res.data;
      
      // Organize timetable by day
      const organizedData = DAYS.map(day => ({
        day: day,
        periods: timetableData.filter(period => period.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
      }));
      
      setViewTimetableData(organizedData);
    } catch (err) {
      console.error("Error fetching timetable", err);
      setViewTimetableData([]);
      if (err?.response?.status !== 404) {
        Alert.alert('Error', 'Failed to fetch timetable');
      }
    } finally {
      setLoadingTimetable(false);
    }
  };

  const updateTimetablePeriod = async (periodId, field, value) => {
    setSubmitting(true);
    try {
      await rootApi.put(`/api/student/timetable/${periodId}`, {
        [field]: value
      });
      Alert.alert('Success', 'Timetable updated successfully!');
      fetchTimetable(viewTimetableClassId);
    } catch (err) {
      console.error("Error updating timetable", err);
      Alert.alert('Error', 'Failed to update timetable');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTimetablePeriod = async (periodId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this period?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setSubmitting(true);
            try {
              await rootApi.delete(`/api/student/timetable/${periodId}`);
              Alert.alert('Success', 'Period deleted successfully!');
              fetchTimetable(viewTimetableClassId);
            } catch (err) {
              console.error("Error deleting timetable period", err);
              Alert.alert('Error', 'Failed to delete period');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const onTimeChange = (event, selectedDate, idx, field, isEdit = false, periodId = null) => {
    if (event.type === 'set' && selectedDate) {
      const timeString = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      if (isEdit && periodId) {
        updateTimetablePeriod(periodId, field, timeString);
      } else if (idx !== undefined && field) {
        updatePeriod(idx, field, timeString);
      }
    }
    if (isEdit) {
      setViewPicker({ show: false, periodId: null, field: null });
    } else {
      setShowPicker({ show: false, idx: null, field: null });
    }
  };

  const addPeriod = () => {
    setPeriods(prev => [...prev, {
      day: '', subjectId: '', teacherId: '', startTime: '', endTime: '',
      subjectObj: null, teacherObj: null, isDayOpen: false, isSubjectOpen: false, isTeacherOpen: false
    }]);
  };

  const removePeriod = (idx) => {
    if (periods.length === 1) { Alert.alert('Info', 'At least one period is required'); return; }
    setPeriods(prev => prev.filter((_, i) => i !== idx));
    setTimetableErrors(prev => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  };

  const updatePeriod = (idx, field, value) => {
    setPeriods(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
    setTimetableErrors(prev => {
      const next = { ...prev };
      if (next[idx]) delete next[idx][field];
      return next;
    });
  };

  const togglePeriodDropdown = (idx, field) => {
    setPeriods(prev => prev.map((p, i) => {
      if (i === idx) return { ...p, [field]: !p[field] };
      return { ...p, isDayOpen: false, isSubjectOpen: false, isTeacherOpen: false };
    }));
  };

  const validateTimetable = () => {
    const errors = {};
    if (!timetableClassId) errors.class = 'Please select a class';
    periods.forEach((p, i) => {
      const pErr = {};
      if (!p.day) pErr.day = 'Select a day';
      if (!p.subjectId) pErr.subjectId = 'Select a subject';
      if (!p.teacherId) pErr.teacherId = 'Select a teacher';
      if (!p.startTime) pErr.startTime = 'Enter start time';
      if (!p.endTime) pErr.endTime = 'Enter end time';
      if (p.startTime && p.endTime && p.startTime >= p.endTime) pErr.endTime = 'End time must be after start time';
      if (Object.keys(pErr).length > 0) errors[i] = pErr;
    });
    setTimetableErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createTimetable = async () => {
    if (!validateTimetable()) return;
    const payload = {
      classSectionId: timetableClassId,
      periods: periods.map(p => ({
        day: p.day,
        subjectId: p.subjectId,
        teacherId: p.teacherId,
        startTime: p.startTime,
        endTime: p.endTime
      }))
    };
    setSubmitting(true);
    try {
      await rootApi.post('/api/student/create/timetable', payload);
      Alert.alert('Success', 'Timetable created successfully!');
      setTimetableModalVisible(false);
      resetTimetableForm();
    } catch (err) {
      console.error("Error creating timetable", err);
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create timetable');
    } finally {
      setSubmitting(false);
    }
  };

  const resetTimetableForm = () => {
    setTimetableClassId(null);
    setTimetableClassObj(null);
    setIsTTClassDropdownOpen(false);
    setPeriods([{ day: '', subjectId: '', teacherId: '', startTime: '', endTime: '', subjectObj: null, teacherObj: null, isDayOpen: false, isSubjectOpen: false, isTeacherOpen: false }]);
    setTimetableErrors({});
  };

  const resetClassForm = () => {
    setNewClass({ 
      className: '', section: '', 
      academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
      capacity: '', currentStrength: '', subjectIds: []
    });
    setSelectedSubjects([]);
    setIsDropdownOpen(false);
  };

  const resetAssignForm = () => {
    setSelectedClass(null); setSelectedTeacher(null);
    setIsClassDropdownOpen(false); setIsTeacherDropdownOpen(false);
  };

  const resetEditForm = () => {
    setSelectedClassForEdit(null); setSelectedTeacherForEdit(null);
    setIsEditClassDropdownOpen(false); setIsEditTeacherDropdownOpen(false);
  };

  const resetAllocationForm = () => {
    setAllocationForm({ classSectionId: '', subjectId: '', teacherId: '' });
    setSelectedClassForAllocation(null); setSelectedSubjectForAllocation(null); setSelectedTeacherForAllocation(null);
    setIsAllocClassDropdownOpen(false); setIsAllocSubjectDropdownOpen(false); setIsAllocTeacherDropdownOpen(false);
  };

  const toggleSubjectSelection = (subject) => {
    if (selectedSubjects.find(s => s.subjectId === subject.subjectId)) {
      setSelectedSubjects(selectedSubjects.filter(s => s.subjectId !== subject.subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const removeSelectedSubject = (subjectId) => {
    setSelectedSubjects(selectedSubjects.filter(s => s.subjectId !== subjectId));
  };

  const openViewTimetable = (classItem) => {
    setViewTimetableClassId(classItem.classSectionId);
    setViewTimetableClassObj(classItem);
    setViewTimetableModalVisible(true);
    fetchTimetable(classItem.classSectionId);
  };

  useEffect(() => {
    if (activeTab === 'Subjects') fetchSubjects();
    if (activeTab === 'Classes') fetchClasses();
    if (activeTab === 'ClassTeachers') { fetchClassTeachers(); fetchTeachers(); }
    if (activeTab === 'Allocations') {
      fetchClasses(); fetchSubjects(); fetchTeachers();
      setSelectedClassForView(null); setClassSubjectTeachers([]);
    }
    if (activeTab === 'Timetable') { fetchClasses(); fetchSubjects(); fetchTeachers(); }
  }, [activeTab]);

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'Subjects': return { title: 'Subject Registry', desc: 'Manage all institutional subjects and curriculum codes.' };
      case 'Allocations': return { title: 'Subject Teacher Allocations', desc: 'Assign teachers to subjects for each class section.' };
      case 'ClassTeachers': return { title: 'Class Teacher Roster', desc: 'Assign primary custodians for each grade.' };
      case 'Timetable': return { title: 'Weekly Timetable', desc: 'Create and manage institutional timetables.' };
      case 'Classes': return { title: 'Class Management', desc: 'Create and manage class sections with subject allocations.' };
      default: return { title: '', desc: '' };
    }
  };

  const info = getHeaderInfo();

  const renderSubjectCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}><BookOpen size={20} color="#A0522D" /></View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.subjectName}</Text>
          <View style={styles.codeContainer}>
            <Tag size={12} color="#8c7664" />
            <Text style={styles.cardCode}>{item.subjectCode}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, item.active && styles.activeBadge]}>
          <Text style={[styles.statusText, item.active && styles.activeStatusText]}>
            {item.active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderClassCard = ({ item }) => (
    <View style={styles.classCard}>
      <View style={styles.classCardHeader}>
        <View style={styles.classIconContainer}><School size={24} color="#8b5cf6" /></View>
        <View style={styles.classInfo}>
          <Text style={styles.classTitle}>Class {item.className}-{item.section}</Text>
          <Text style={styles.classSubtitle}>{item.academicYear}</Text>
        </View>
        <View style={styles.classStats}>
          <View style={styles.statBadge}>
            <Users size={14} color="#8b5cf6" />
            <Text style={styles.statText}>{item.currentStrength}/{item.capacity}</Text>
          </View>
        </View>
      </View>
      <View style={styles.classDetails}>
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Class ID:</Text>
          <Text style={styles.detailValue}>{item.classSectionId}</Text>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Subjects:</Text>
          <Text style={styles.detailValue}>{item.subjectName?.length || 0} subjects</Text>
        </View>
        {item.classTeacherName && (
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Class Teacher:</Text>
            <Text style={styles.detailValue}>{item.classTeacherName}</Text>
          </View>
        )}
      </View>
      <View style={styles.classCardActions}>
        <TouchableOpacity 
          style={[styles.classActionBtn, { backgroundColor: '#f59e0b' }]}
          onPress={() => openViewTimetable(item)}
        >
          <Clock size={16} color="#fff" />
          <Text style={styles.classActionBtnText}>View Timetable</Text>
        </TouchableOpacity>
      </View>
      {item.subjectIds && item.subjectIds.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectTagsContainer}>
          {item.subjectIds.map((subjectId, idx) => (
            <View key={idx} style={styles.subjectTag}>
              <Text style={styles.subjectTagText}>{subjectId}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderClassTeacherCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}><Users size={20} color="#3b82f6" /></View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Class {item.className}-{item.section}</Text>
          <View style={styles.detailRow}><User size={12} color="#8c7664" /><Text style={styles.cardDetail}>{item.teacherName || 'Not Assigned'}</Text></View>
          <View style={styles.detailRow}><Hash size={12} color="#8c7664" /><Text style={styles.cardDetail}>Class ID: {item.classSectionId}</Text></View>
          <View style={styles.detailRow}><GraduationCap size={12} color="#8c7664" /><Text style={styles.cardDetail}>Academic Year: {item.academicYear}</Text></View>
        </View>
        <TouchableOpacity style={styles.editActionBtn} onPress={() => openEditModal(item)}>
          <Edit2 size={18} color="#3b82f6" />
          <Text style={styles.editActionText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Timetable period row renderer for creation
  const renderPeriodRow = (period, idx) => {
    const pErr = timetableErrors[idx] || {};
    return (
      <View key={idx} style={styles.periodCard}>
        <View style={styles.periodCardHeader}>
          <View style={styles.periodBadge}><Text style={styles.periodBadgeText}>Period {idx + 1}</Text></View>
          <TouchableOpacity style={styles.removePeriodBtn} onPress={() => removePeriod(idx)}>
            <X size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Day */}
        <View style={styles.periodField}>
          <Text style={styles.periodFieldLabel}>Day *</Text>
          <TouchableOpacity
            style={[styles.periodDropdownBtn, pErr.day && styles.fieldError]}
            onPress={() => togglePeriodDropdown(idx, 'isDayOpen')}
          >
            <Text style={[styles.periodDropdownText, !period.day && styles.placeholderText]}>
              {period.day || 'Select day'}
            </Text>
            {period.isDayOpen ? <ChevronUp size={16} color="#f59e0b" /> : <ChevronDown size={16} color="#f59e0b" />}
          </TouchableOpacity>
          {pErr.day && <Text style={styles.errorText}>{pErr.day}</Text>}
          {period.isDayOpen && (
            <View style={styles.periodDropdownList}>
              <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                {DAYS.map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.periodDropdownItem, period.day === d && styles.periodDropdownItemActive]}
                    onPress={() => { updatePeriod(idx, 'day', d); togglePeriodDropdown(idx, 'isDayOpen'); }}
                  >
                    <Text style={[styles.periodDropdownItemText, period.day === d && styles.periodDropdownItemTextActive]}>{d}</Text>
                    {period.day === d && <CheckCircle size={14} color="#fff" />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Time row */}
        <View style={styles.periodTimeRow}>
          <View style={[styles.periodField, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.periodFieldLabel}>Start Time *</Text>
            <TouchableOpacity
              style={[styles.periodTimeInput, pErr.startTime && styles.fieldError]}
              onPress={() => setShowPicker({ show: true, idx, field: 'startTime' })}
            >
              <Text style={[styles.periodDropdownText, !period.startTime && styles.placeholderText]}>
                {period.startTime || 'Select time'}
              </Text>
              <Clock size={16} color="#f59e0b" />
            </TouchableOpacity>
            {pErr.startTime && <Text style={styles.errorText}>{pErr.startTime}</Text>}
          </View>
          <View style={[styles.periodField, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.periodFieldLabel}>End Time *</Text>
            <TouchableOpacity
              style={[styles.periodTimeInput, pErr.endTime && styles.fieldError]}
              onPress={() => setShowPicker({ show: true, idx, field: 'endTime' })}
            >
              <Text style={[styles.periodDropdownText, !period.endTime && styles.placeholderText]}>
                {period.endTime || 'Select time'}
              </Text>
              <Clock size={16} color="#f59e0b" />
            </TouchableOpacity>
            {pErr.endTime && <Text style={styles.errorText}>{pErr.endTime}</Text>}
          </View>
        </View>

        {/* Subject */}
        <View style={styles.periodField}>
          <Text style={styles.periodFieldLabel}>Subject *</Text>
          <TouchableOpacity
            style={[styles.periodDropdownBtn, pErr.subjectId && styles.fieldError]}
            onPress={() => togglePeriodDropdown(idx, 'isSubjectOpen')}
          >
            <Text style={[styles.periodDropdownText, !period.subjectId && styles.placeholderText]}>
              {period.subjectObj ? period.subjectObj.subjectName : 'Select subject'}
            </Text>
            {period.isSubjectOpen ? <ChevronUp size={16} color="#f59e0b" /> : <ChevronDown size={16} color="#f59e0b" />}
          </TouchableOpacity>
          {pErr.subjectId && <Text style={styles.errorText}>{pErr.subjectId}</Text>}
          {period.isSubjectOpen && (
            <View style={styles.periodDropdownList}>
              <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                {subjects.filter(s => s.active).length > 0 ? subjects.filter(s => s.active).map(s => (
                  <TouchableOpacity
                    key={s.subjectId}
                    style={[styles.periodDropdownItem, period.subjectId === s.subjectId && styles.periodDropdownItemActive]}
                    onPress={() => {
                      updatePeriod(idx, 'subjectId', s.subjectId);
                      updatePeriod(idx, 'subjectObj', s);
                      togglePeriodDropdown(idx, 'isSubjectOpen');
                    }}
                  >
                    <View>
                      <Text style={[styles.periodDropdownItemText, period.subjectId === s.subjectId && styles.periodDropdownItemTextActive]}>{s.subjectName}</Text>
                      <Text style={[styles.periodDropdownItemSub, period.subjectId === s.subjectId && { color: 'rgba(255,255,255,0.7)' }]}>{s.subjectCode}</Text>
                    </View>
                    {period.subjectId === s.subjectId && <CheckCircle size={14} color="#fff" />}
                  </TouchableOpacity>
                )) : (
                  <View style={styles.dropdownEmpty}>
                    <AlertCircle size={20} color="#f59e0b" />
                    <Text style={styles.dropdownEmptyText}>No active subjects found</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Teacher */}
        <View style={styles.periodField}>
          <Text style={styles.periodFieldLabel}>Teacher *</Text>
          <TouchableOpacity
            style={[styles.periodDropdownBtn, pErr.teacherId && styles.fieldError]}
            onPress={() => togglePeriodDropdown(idx, 'isTeacherOpen')}
          >
            <Text style={[styles.periodDropdownText, !period.teacherId && styles.placeholderText]}>
              {period.teacherObj ? period.teacherObj.teacherName : 'Select teacher'}
            </Text>
            {period.isTeacherOpen ? <ChevronUp size={16} color="#f59e0b" /> : <ChevronDown size={16} color="#f59e0b" />}
          </TouchableOpacity>
          {pErr.teacherId && <Text style={styles.errorText}>{pErr.teacherId}</Text>}
          {period.isTeacherOpen && (
            <View style={styles.periodDropdownList}>
              <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                {teachers.length > 0 ? teachers.map(t => (
                  <TouchableOpacity
                    key={t.teacherId}
                    style={[styles.periodDropdownItem, period.teacherId === t.teacherId && styles.periodDropdownItemActive]}
                    onPress={() => {
                      updatePeriod(idx, 'teacherId', t.teacherId);
                      updatePeriod(idx, 'teacherObj', t);
                      togglePeriodDropdown(idx, 'isTeacherOpen');
                    }}
                  >
                    <View>
                      <Text style={[styles.periodDropdownItemText, period.teacherId === t.teacherId && styles.periodDropdownItemTextActive]}>{t.teacherName}</Text>
                      <Text style={[styles.periodDropdownItemSub, period.teacherId === t.teacherId && { color: 'rgba(255,255,255,0.7)' }]}>{t.email || t.teacherId}</Text>
                    </View>
                    {period.teacherId === t.teacherId && <CheckCircle size={14} color="#fff" />}
                  </TouchableOpacity>
                )) : (
                  <View style={styles.dropdownEmpty}>
                    <AlertCircle size={20} color="#f59e0b" />
                    <Text style={styles.dropdownEmptyText}>No teachers found</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  };

  // View Timetable renderer
  const renderViewTimetable = () => {
    const dayData = viewTimetableData.find(d => d.day === selectedDay);
    const periodsForDay = dayData?.periods || [];

    return (
      <View style={styles.viewTimetableContainer}>
        {/* Day Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {DAYS.map(day => (
            <TouchableOpacity
              key={day}
              style={[styles.dayTab, selectedDay === day && styles.dayTabActive]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayTabText, selectedDay === day && styles.dayTabTextActive]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Timetable Display */}
        {loadingTimetable ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={styles.loaderText}>Loading timetable...</Text>
          </View>
        ) : periodsForDay.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={64} color="#e0d4c8" />
            <Text style={styles.emptyTitle}>No Timetable Found</Text>
            <Text style={styles.emptyText}>No periods scheduled for {selectedDay}</Text>
          </View>
        ) : (
          <View style={styles.timetableGrid}>
            {periodsForDay.map((period, idx) => (
              <View key={period.periodId || idx} style={styles.timetableCard}>
                <View style={styles.timetableCardHeader}>
                  <View style={styles.timeBadge}>
                    <Clock size={12} color="#f59e0b" />
                    <Text style={styles.timeBadgeText}>{period.startTime} - {period.endTime}</Text>
                  </View>
                  <View style={styles.timetableActions}>
                    <TouchableOpacity 
                      style={styles.timetableEditBtn}
                      onPress={() => setEditingPeriod(editingPeriod === period.periodId ? null : period.periodId)}
                    >
                      <Edit2 size={16} color="#f59e0b" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.timetableDeleteBtn}
                      onPress={() => deleteTimetablePeriod(period.periodId)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {editingPeriod === period.periodId ? (
                  <View style={styles.editPeriodForm}>
                    {/* Subject Edit */}
                    <View style={styles.editField}>
                      <Text style={styles.editFieldLabel}>Subject</Text>
                      <View style={styles.editFieldValue}>
                        <BookOpen size={14} color="#8b5cf6" />
                        <Text style={styles.editFieldText}>{period.subjectName}</Text>
                      </View>
                    </View>

                    {/* Teacher Edit */}
                    <View style={styles.editField}>
                      <Text style={styles.editFieldLabel}>Teacher</Text>
                      <View style={styles.editFieldValue}>
                        <User size={14} color="#3b82f6" />
                        <Text style={styles.editFieldText}>{period.teacherName}</Text>
                      </View>
                    </View>

                    {/* Time Edit */}
                    <View style={styles.editTimeRow}>
                      <TouchableOpacity 
                        style={styles.editTimeBtn}
                        onPress={() => setViewPicker({ show: true, periodId: period.periodId, field: 'startTime' })}
                      >
                        <Text style={styles.editTimeLabel}>Start Time</Text>
                        <Text style={styles.editTimeValue}>{period.startTime}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.editTimeBtn}
                        onPress={() => setViewPicker({ show: true, periodId: period.periodId, field: 'endTime' })}
                      >
                        <Text style={styles.editTimeLabel}>End Time</Text>
                        <Text style={styles.editTimeValue}>{period.endTime}</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                      style={styles.saveEditBtn}
                      onPress={() => setEditingPeriod(null)}
                    >
                      <Save size={16} color="#fff" />
                      <Text style={styles.saveEditBtnText}>Done Editing</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View style={styles.timetableSubjectInfo}>
                      <BookOpen size={18} color="#8b5cf6" />
                      <Text style={styles.timetableSubject}>{period.subjectName}</Text>
                    </View>
                    <View style={styles.timetableTeacherInfo}>
                      <User size={14} color="#3b82f6" />
                      <Text style={styles.timetableTeacher}>{period.teacherName}</Text>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Subjects':
        return (
          <FlatList
            data={subjects}
            keyExtractor={(item, index) => item.subjectId || index.toString()}
            renderItem={renderSubjectCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <BookOpen size={64} color="#e0d4c8" />
                <Text style={styles.emptyTitle}>No Subjects Found</Text>
                <Text style={styles.emptyText}>Click the add button to create your first subject</Text>
              </View>
            )}
          />
        );
      
      case 'Classes':
        return (
          <FlatList
            data={classes}
            keyExtractor={(item, index) => item.classSectionId || index.toString()}
            renderItem={renderClassCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <School size={64} color="#e0d4c8" />
                <Text style={styles.emptyTitle}>No Classes Found</Text>
                <Text style={styles.emptyText}>Click the add button to create your first class</Text>
              </View>
            )}
          />
        );
      
      case 'Allocations':
        return (
          <View style={{ flex: 1 }}>
            {/* Class Selection */}
            <View style={styles.allocationClassSelector}>
              <Text style={styles.allocationSelectorLabel}>Select Class to View Allocations</Text>
              <TouchableOpacity 
                style={styles.allocationDropdownButton}
                onPress={() => setIsViewClassDropdownOpen(!isViewClassDropdownOpen)}
              >
                <View style={styles.dropdownButtonContent}>
                  <School size={18} color="#16a34a" />
                  <Text style={styles.dropdownButtonText}>
                    {selectedClassForView 
                      ? `Class ${selectedClassForView.className}-${selectedClassForView.section}` 
                      : 'Choose a class to view allocations'}
                  </Text>
                </View>
                {isViewClassDropdownOpen ? <ChevronUp size={20} color="#16a34a" /> : <ChevronDown size={20} color="#16a34a" />}
              </TouchableOpacity>

              {isViewClassDropdownOpen && (
                <View style={styles.dropdownList}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                    {classes.length > 0 ? classes.map((cls) => (
                      <TouchableOpacity
                        key={cls.classSectionId}
                        style={[styles.dropdownItem, selectedClassForView?.classSectionId === cls.classSectionId && styles.dropdownItemActiveAllocation]}
                        onPress={() => {
                          setSelectedClassForView(cls);
                          setIsViewClassDropdownOpen(false);
                          fetchSubjectTeachersByClassId(cls.classSectionId);
                        }}
                      >
                        <View style={styles.dropdownItemContent}>
                          <School size={16} color={selectedClassForView?.classSectionId === cls.classSectionId ? "#fff" : "#16a34a"} />
                          <Text style={[styles.dropdownItemName, selectedClassForView?.classSectionId === cls.classSectionId && styles.dropdownItemTextActive]}>
                            Class {cls.className}-{cls.section}
                          </Text>
                        </View>
                        {selectedClassForView?.classSectionId === cls.classSectionId && <CheckCircle size={16} color="#fff" />}
                      </TouchableOpacity>
                    )) : (
                      <View style={styles.dropdownEmpty}>
                        <ActivityIndicator size="small" color="#16a34a" />
                        <Text style={styles.dropdownEmptyText}>Loading classes...</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Allocation Summary Card */}
            {selectedClassForView && !loadingAllocations && classSubjectTeachers.length > 0 && (
              <View style={styles.allocationSummaryCard}>
                <View style={styles.allocationSummaryHeader}>
                  <View style={styles.allocationSummaryTitleRow}>
                    <School size={18} color="#16a34a" />
                    <Text style={styles.allocationSummaryTitle}>
                      Class {selectedClassForView.className}-{selectedClassForView.section}
                    </Text>
                  </View>
                  <View style={styles.allocationCountBadge}>
                    <Text style={styles.allocationCountText}>{classSubjectTeachers.length} subject{classSubjectTeachers.length !== 1 ? 's' : ''}</Text>
                  </View>
                </View>
                <View style={styles.allocationTable}>
                  <View style={styles.allocationTableHeader}>
                    <Text style={[styles.allocationTableHeaderText, { flex: 1 }]}>Subject</Text>
                    <Text style={[styles.allocationTableHeaderText, { flex: 1, textAlign: 'right' }]}>Teacher</Text>
                  </View>
                  {classSubjectTeachers.map((item, idx) => (
                    <View key={item.subjectId || idx} style={[styles.allocationTableRow, idx % 2 === 0 && styles.allocationTableRowAlt]}>
                      <View style={styles.allocationSubjectCell}>
                        <BookOpen size={14} color="#16a34a" />
                        <Text style={styles.allocationSubjectText}>{item.subjectName || item.subject}</Text>
                      </View>
                      <View style={styles.allocationTeacherCell}>
                        <Text style={styles.allocationTeacherText}>{item.teacherName || item.teacher}</Text>
                        <User size={14} color="#16a34a" />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {loadingAllocations ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#16a34a" />
                <Text style={styles.loaderText}>Loading allocations...</Text>
              </View>
            ) : selectedClassForView && classSubjectTeachers.length === 0 ? (
              <View style={styles.emptyState}>
                <UserCheck size={64} color="#e0d4c8" />
                <Text style={styles.emptyTitle}>No Allocations Found</Text>
                <Text style={styles.emptyText}>No subject teachers assigned for Class {selectedClassForView.className}-{selectedClassForView.section} yet.</Text>
                <TouchableOpacity 
                  style={styles.emptyAddBtn}
                  onPress={() => { fetchClasses(); fetchSubjects(); fetchTeachers(); setAllocationModalVisible(true); }}
                >
                  <Plus size={18} color="#fff" />
                  <Text style={styles.emptyAddBtnText}>Assign Subject Teacher</Text>
                </TouchableOpacity>
              </View>
            ) : !selectedClassForView ? (
              <View style={styles.emptyState}>
                <UserCheck size={64} color="#e0d4c8" />
                <Text style={styles.emptyTitle}>Select a Class</Text>
                <Text style={styles.emptyText}>Please select a class from the dropdown to view subject-teacher allocations.</Text>
              </View>
            ) : null}
          </View>
        );
      
      case 'ClassTeachers':
        return (
          <FlatList
            data={classTeachers}
            keyExtractor={(item, index) => item.classSectionId || index.toString()}
            renderItem={renderClassTeacherCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Users size={64} color="#e0d4c8" />
                <Text style={styles.emptyTitle}>No Class Teachers Assigned</Text>
                <Text style={styles.emptyText}>Click the assign button to assign class teachers</Text>
              </View>
            )}
          />
        );
      
      case 'Timetable':
        return (
          <View style={styles.timetableLandingContainer}>
            <View style={styles.timetableLandingCard}>
              <Clock size={56} color="#f59e0b" />
              <Text style={styles.timetableLandingTitle}>Timetable Management</Text>
              <Text style={styles.timetableLandingDesc}>
                Create class timetables by assigning subjects, teachers, and time slots for each day of the week.
              </Text>
              <TouchableOpacity
                style={styles.timetableCreateBtn}
                onPress={() => setTimetableModalVisible(true)}
              >
                <Plus size={20} color="#fff" />
                <Text style={styles.timetableCreateBtnText}>Create New Timetable</Text>
              </TouchableOpacity>
            </View>
            
            {/* Existing Timetables List */}
            {classes.filter(c => c.hasTimetable).length > 0 && (
              <View style={styles.existingTimetables}>
                <Text style={styles.existingTimetablesTitle}>Existing Timetables</Text>
                {classes.filter(c => c.hasTimetable).map(cls => (
                  <TouchableOpacity
                    key={cls.classSectionId}
                    style={styles.existingTimetableCard}
                    onPress={() => openViewTimetable(cls)}
                  >
                    <View style={styles.existingTimetableInfo}>
                      <School size={20} color="#f59e0b" />
                      <View>
                        <Text style={styles.existingTimetableClass}>Class {cls.className}-{cls.section}</Text>
                        <Text style={styles.existingTimetableYear}>{cls.academicYear}</Text>
                      </View>
                    </View>
                    <Eye size={20} color="#f59e0b" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.timetableInfoRow}>
              {[
                { icon: School, label: 'Select Class', color: '#8b5cf6' },
                { icon: Book, label: 'Pick Subjects', color: '#16a34a' },
                { icon: User, label: 'Assign Teachers', color: '#3b82f6' },
                { icon: Clock, label: 'Set Timings', color: '#f59e0b' },
              ].map(({ icon: Icon, label, color }, i) => (
                <View key={i} style={styles.timetableInfoStep}>
                  <View style={[styles.timetableStepIcon, { backgroundColor: color + '20' }]}>
                    <Icon size={22} color={color} />
                  </View>
                  <Text style={styles.timetableStepLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* DateTimePicker for timetable creation */}
      {showPicker.show && (
        <DateTimePicker
          value={pickerDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, date) => onTimeChange(event, date, showPicker.idx, showPicker.field)}
        />
      )}

      {/* DateTimePicker for timetable editing */}
      {viewPicker.show && (
        <DateTimePicker
          value={pickerDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, date) => onTimeChange(event, date, null, null, true, viewPicker.periodId, viewPicker.field)}
        />
      )}

      <View style={styles.headerArea}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.mainTitle}>{info.title}</Text>
          <Text style={styles.subTitle}>{info.desc}</Text>
        </View>
        {(activeTab === 'Subjects' || activeTab === 'Classes') && (
          <TouchableOpacity style={styles.addBtn} onPress={() => activeTab === 'Subjects' ? setModalVisible(true) : setClassModalVisible(true)}>
            <Plus size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add {activeTab === 'Subjects' ? 'Subject' : 'Class'}</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'ClassTeachers' && (
          <TouchableOpacity style={styles.addBtn} onPress={() => { fetchClasses(); fetchTeachers(); setAssignModalVisible(true); }}>
            <UserPlus size={18} color="#fff" />
            <Text style={styles.addBtnText}>Assign Teacher</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'Allocations' && (
          <TouchableOpacity style={styles.addBtn} onPress={() => { fetchClasses(); fetchSubjects(); fetchTeachers(); setAllocationModalVisible(true); }}>
            <UserCheck size={18} color="#fff" />
            <Text style={styles.addBtnText}>Assign Subject</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'Timetable' && (
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: '#f59e0b' }]} onPress={() => setTimetableModalVisible(true)}>
            <Plus size={18} color="#fff" />
            <Text style={styles.addBtnText}>Create Timetable</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabCardsContainer}>
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabCard, isActive && { backgroundColor: tab.color, borderColor: tab.color }]}
              onPress={() => setActiveTab(tab.id)}
            >
              <View style={[styles.tabIconContainer, isActive && styles.tabIconContainerActive]}>
                <IconComponent size={24} color={isActive ? "#fff" : tab.color} />
              </View>
              <Text style={[styles.tabCardTitle, isActive && styles.tabCardTitleActive]}>{tab.title}</Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.contentArea}>
        {loading && (activeTab === 'Subjects' || activeTab === 'Classes' || activeTab === 'ClassTeachers') ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#A0522D" />
            <Text style={styles.loaderText}>Loading...</Text>
          </View>
        ) : (
          renderContent()
        )}
      </View>

      {/* View Timetable Modal */}
      <Modal animationType="slide" transparent visible={viewTimetableModalVisible} onRequestClose={() => { setViewTimetableModalVisible(false); setEditingPeriod(null); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%', maxWidth: 900 }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Clock size={24} color="#f59e0b" />
                <Text style={[styles.modalTitle, { color: '#f59e0b' }]}>
                  Timetable - Class {viewTimetableClassObj?.className}-{viewTimetableClassObj?.section}
                </Text>
              </View>
              <TouchableOpacity onPress={() => { setViewTimetableModalVisible(false); setEditingPeriod(null); }} style={styles.closeBtn}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderViewTimetable()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Subject Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}><BookOpen size={24} color="#A0522D" /><Text style={styles.modalTitle}>Add New Subject</Text></View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}><X size={24} color="#666" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subject Name *</Text>
                <View style={styles.inputWrapper}>
                  <Book size={18} color="#A0522D" style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="e.g., Mathematics" placeholderTextColor="#b0a090" value={newSubject.subjectName} onChangeText={(text) => setNewSubject({ ...newSubject, subjectName: text })} />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subject Code *</Text>
                <View style={styles.inputWrapper}>
                  <Hash size={18} color="#A0522D" style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="e.g., MATH101" placeholderTextColor="#b0a090" value={newSubject.subjectCode} onChangeText={(text) => setNewSubject({ ...newSubject, subjectCode: text })} />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Status</Text>
                <View style={styles.statusOptions}>
                  <TouchableOpacity style={[styles.statusOption, newSubject.active && styles.statusOptionActive]} onPress={() => setNewSubject({ ...newSubject, active: true })}>
                    <CheckCircle size={16} color={newSubject.active ? "#fff" : "#666"} />
                    <Text style={[styles.statusOptionText, newSubject.active && styles.statusOptionTextActive]}>Active</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={createSubject} disabled={submitting}>
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <><Save size={18} color="#fff" /><Text style={styles.submitButtonText}>Create Subject</Text></>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Class Modal */}
      <Modal animationType="slide" transparent visible={classModalVisible} onRequestClose={() => setClassModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}><School size={24} color="#8b5cf6" /><Text style={styles.modalTitle}>Add New Class</Text></View>
              <TouchableOpacity onPress={() => setClassModalVisible(false)} style={styles.closeBtn}><X size={24} color="#666" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Class Name *</Text>
                  <TextInput style={styles.input} placeholder="e.g., 1, 2, 3..." placeholderTextColor="#b0a090" value={newClass.className} onChangeText={(text) => setNewClass({ ...newClass, className: text })} keyboardType="numeric" />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Section *</Text>
                  <TextInput style={styles.input} placeholder="e.g., A, B, C..." placeholderTextColor="#b0a090" value={newClass.section} onChangeText={(text) => setNewClass({ ...newClass, section: text.toUpperCase() })} />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Academic Year *</Text>
                <TextInput style={styles.input} placeholder="e.g., 2025-2026" placeholderTextColor="#b0a090" value={newClass.academicYear} onChangeText={(text) => setNewClass({ ...newClass, academicYear: text })} />
              </View>
              <View style={styles.formRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Capacity *</Text>
                  <TextInput style={styles.input} placeholder="Max students" placeholderTextColor="#b0a090" value={newClass.capacity} onChangeText={(text) => setNewClass({ ...newClass, capacity: text })} keyboardType="numeric" />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Current Strength</Text>
                  <TextInput style={styles.input} placeholder="Current students" placeholderTextColor="#b0a090" value={newClass.currentStrength} onChangeText={(text) => setNewClass({ ...newClass, currentStrength: text })} keyboardType="numeric" />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Assign Subjects *</Text>
                <Text style={styles.inputHelper}>Select subjects for this class</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => { if (availableSubjects.length === 0) fetchSubjects(); setIsDropdownOpen(!isDropdownOpen); }}>
                  <View style={styles.dropdownButtonContent}>
                    <Book size={18} color="#8b5cf6" />
                    <Text style={styles.dropdownButtonText}>{selectedSubjects.length > 0 ? `${selectedSubjects.length} subject(s) selected` : 'Select subjects'}</Text>
                  </View>
                  {isDropdownOpen ? <ChevronUp size={20} color="#8b5cf6" /> : <ChevronDown size={20} color="#8b5cf6" />}
                </TouchableOpacity>
                {isDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {availableSubjects.length > 0 ? availableSubjects.map((subject) => (
                        <TouchableOpacity key={subject.subjectId} style={[styles.dropdownItem, selectedSubjects.find(s => s.subjectId === subject.subjectId) && styles.dropdownItemActive]} onPress={() => toggleSubjectSelection(subject)}>
                          <View style={styles.dropdownItemContent}>
                            <Book size={16} color={selectedSubjects.find(s => s.subjectId === subject.subjectId) ? "#fff" : "#8b5cf6"} />
                            <View style={styles.dropdownItemTexts}>
                              <Text style={[styles.dropdownItemName, selectedSubjects.find(s => s.subjectId === subject.subjectId) && styles.dropdownItemTextActive]}>{subject.subjectName}</Text>
                              <Text style={[styles.dropdownItemCode, selectedSubjects.find(s => s.subjectId === subject.subjectId) && styles.dropdownItemTextActive]}>{subject.subjectCode}</Text>
                            </View>
                          </View>
                          {selectedSubjects.find(s => s.subjectId === subject.subjectId) && <CheckCircle size={16} color="#fff" />}
                        </TouchableOpacity>
                      )) : (
                        <View style={styles.dropdownEmpty}>
                          <ActivityIndicator size="small" color="#8b5cf6" />
                          <Text style={styles.dropdownEmptyText}>Loading subjects...</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
                {selectedSubjects.length > 0 && (
                  <View style={styles.selectedSubjectsContainer}>
                    <Text style={styles.selectedCount}>{selectedSubjects.length} subject(s) selected</Text>
                    <View style={styles.selectedTagsWrapper}>
                      {selectedSubjects.map((subject) => (
                        <View key={subject.subjectId} style={styles.selectedTag}>
                          <Text style={styles.selectedTagText}>{subject.subjectName}</Text>
                          <TouchableOpacity onPress={() => removeSelectedSubject(subject.subjectId)}><X size={14} color="#fff" /></TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setClassModalVisible(false); resetClassForm(); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={createClass} disabled={submitting}>
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <><Save size={18} color="#fff" /><Text style={styles.submitButtonText}>Create Class</Text></>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Assign Class Teacher Modal */}
      <Modal animationType="slide" transparent visible={assignModalVisible} onRequestClose={() => setAssignModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}><UserPlus size={24} color="#3b82f6" /><Text style={styles.modalTitle}>Assign Class Teacher</Text></View>
              <TouchableOpacity onPress={() => { setAssignModalVisible(false); resetAssignForm(); }} style={styles.closeBtn}><X size={24} color="#666" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Class *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsClassDropdownOpen(!isClassDropdownOpen)}>
                  <View style={styles.dropdownButtonContent}>
                    <School size={18} color="#3b82f6" />
                    <Text style={styles.dropdownButtonText}>{selectedClass ? `Class ${selectedClass.className}-${selectedClass.section}` : 'Choose a class'}</Text>
                  </View>
                  {isClassDropdownOpen ? <ChevronUp size={20} color="#3b82f6" /> : <ChevronDown size={20} color="#3b82f6" />}
                </TouchableOpacity>
                {isClassDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {classes.length > 0 ? classes.map((cls) => (
                        <TouchableOpacity key={cls.classSectionId} style={[styles.dropdownItem, selectedClass?.classSectionId === cls.classSectionId && styles.dropdownItemActive]} onPress={() => { setSelectedClass(cls); setIsClassDropdownOpen(false); }}>
                          <View style={styles.dropdownItemContent}>
                            <School size={16} color={selectedClass?.classSectionId === cls.classSectionId ? "#fff" : "#3b82f6"} />
                            <Text style={[styles.dropdownItemName, selectedClass?.classSectionId === cls.classSectionId && styles.dropdownItemTextActive]}>Class {cls.className}-{cls.section}</Text>
                          </View>
                          {selectedClass?.classSectionId === cls.classSectionId && <CheckCircle size={16} color="#fff" />}
                        </TouchableOpacity>
                      )) : (
                        <View style={styles.dropdownEmpty}><ActivityIndicator size="small" color="#3b82f6" /><Text style={styles.dropdownEmptyText}>Loading classes...</Text></View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Teacher *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}>
                  <View style={styles.dropdownButtonContent}>
                    <User size={18} color="#3b82f6" />
                    <Text style={styles.dropdownButtonText}>{selectedTeacher ? selectedTeacher.teacherName : 'Choose a teacher'}</Text>
                  </View>
                  {isTeacherDropdownOpen ? <ChevronUp size={20} color="#3b82f6" /> : <ChevronDown size={20} color="#3b82f6" />}
                </TouchableOpacity>
                {isTeacherDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {teachers.length > 0 ? teachers.map((teacher) => (
                        <TouchableOpacity key={teacher.teacherId} style={[styles.dropdownItem, selectedTeacher?.teacherId === teacher.teacherId && styles.dropdownItemActive]} onPress={() => { setSelectedTeacher(teacher); setIsTeacherDropdownOpen(false); }}>
                          <View style={styles.dropdownItemContent}>
                            <User size={16} color={selectedTeacher?.teacherId === teacher.teacherId ? "#fff" : "#3b82f6"} />
                            <View style={styles.dropdownItemTexts}>
                              <Text style={[styles.dropdownItemName, selectedTeacher?.teacherId === teacher.teacherId && styles.dropdownItemTextActive]}>{teacher.teacherName}</Text>
                              <Text style={[styles.dropdownItemCode, selectedTeacher?.teacherId === teacher.teacherId && styles.dropdownItemTextActive]}>{teacher.email || teacher.teacherId}</Text>
                            </View>
                          </View>
                          {selectedTeacher?.teacherId === teacher.teacherId && <CheckCircle size={16} color="#fff" />}
                        </TouchableOpacity>
                      )) : (
                        <View style={styles.dropdownEmpty}><ActivityIndicator size="small" color="#3b82f6" /><Text style={styles.dropdownEmptyText}>Loading teachers...</Text></View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setAssignModalVisible(false); resetAssignForm(); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={assignClassTeacher} disabled={submitting}>
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <><UserPlus size={18} color="#fff" /><Text style={styles.submitButtonText}>Assign Teacher</Text></>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Class Teacher Modal */}
      <Modal animationType="slide" transparent visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}><Edit2 size={24} color="#3b82f6" /><Text style={styles.modalTitle}>Edit Class Teacher</Text></View>
              <TouchableOpacity onPress={() => { setEditModalVisible(false); resetEditForm(); }} style={styles.closeBtn}><X size={24} color="#666" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Class</Text>
                <View style={styles.displayBox}>
                  <School size={18} color="#3b82f6" />
                  <Text style={styles.displayText}>Class {selectedClassForEdit?.className}-{selectedClassForEdit?.section}</Text>
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select New Teacher *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsEditTeacherDropdownOpen(!isEditTeacherDropdownOpen)}>
                  <View style={styles.dropdownButtonContent}>
                    <User size={18} color="#3b82f6" />
                    <Text style={styles.dropdownButtonText}>{selectedTeacherForEdit ? selectedTeacherForEdit.teacherName : 'Choose a teacher'}</Text>
                  </View>
                  {isEditTeacherDropdownOpen ? <ChevronUp size={20} color="#3b82f6" /> : <ChevronDown size={20} color="#3b82f6" />}
                </TouchableOpacity>
                {isEditTeacherDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {teachers.length > 0 ? teachers.map((teacher) => (
                        <TouchableOpacity key={teacher.teacherId} style={[styles.dropdownItem, selectedTeacherForEdit?.teacherId === teacher.teacherId && styles.dropdownItemActive]} onPress={() => { setSelectedTeacherForEdit(teacher); setIsEditTeacherDropdownOpen(false); }}>
                          <View style={styles.dropdownItemContent}>
                            <User size={16} color={selectedTeacherForEdit?.teacherId === teacher.teacherId ? "#fff" : "#3b82f6"} />
                            <View style={styles.dropdownItemTexts}>
                              <Text style={[styles.dropdownItemName, selectedTeacherForEdit?.teacherId === teacher.teacherId && styles.dropdownItemTextActive]}>{teacher.teacherName}</Text>
                              <Text style={[styles.dropdownItemCode, selectedTeacherForEdit?.teacherId === teacher.teacherId && styles.dropdownItemTextActive]}>{teacher.email || teacher.teacherId}</Text>
                            </View>
                          </View>
                          {selectedTeacherForEdit?.teacherId === teacher.teacherId && <CheckCircle size={16} color="#fff" />}
                        </TouchableOpacity>
                      )) : (
                        <View style={styles.dropdownEmpty}><ActivityIndicator size="small" color="#3b82f6" /><Text style={styles.dropdownEmptyText}>Loading teachers...</Text></View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
              {selectedClassForEdit?.classTeacherName && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxTitle}>Current Teacher</Text>
                  <Text style={styles.infoBoxText}>{selectedClassForEdit.classTeacherName}</Text>
                </View>
              )}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setEditModalVisible(false); resetEditForm(); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={updateClassTeacher} disabled={submitting}>
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <><Save size={18} color="#fff" /><Text style={styles.submitButtonText}>Update Teacher</Text></>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Subject-Teacher Allocation Modal */}
      <Modal animationType="slide" transparent visible={allocationModalVisible} onRequestClose={() => setAllocationModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}><UserCheck size={24} color="#16a34a" /><Text style={styles.modalTitle}>Assign Subject Teacher</Text></View>
              <TouchableOpacity onPress={() => { setAllocationModalVisible(false); resetAllocationForm(); }} style={styles.closeBtn}><X size={24} color="#666" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Class *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsAllocClassDropdownOpen(!isAllocClassDropdownOpen)}>
                  <View style={styles.dropdownButtonContent}>
                    <School size={18} color="#16a34a" />
                    <Text style={styles.dropdownButtonText}>{selectedClassForAllocation ? `Class ${selectedClassForAllocation.className}-${selectedClassForAllocation.section}` : 'Choose a class'}</Text>
                  </View>
                  {isAllocClassDropdownOpen ? <ChevronUp size={20} color="#16a34a" /> : <ChevronDown size={20} color="#16a34a" />}
                </TouchableOpacity>
                {isAllocClassDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {classes.length > 0 ? classes.map((cls) => (
                        <TouchableOpacity key={cls.classSectionId} style={[styles.dropdownItem, selectedClassForAllocation?.classSectionId === cls.classSectionId && styles.dropdownItemActiveAllocation]} onPress={() => { setSelectedClassForAllocation(cls); setAllocationForm({ ...allocationForm, classSectionId: cls.classSectionId }); setIsAllocClassDropdownOpen(false); }}>
                          <View style={styles.dropdownItemContent}>
                            <School size={16} color={selectedClassForAllocation?.classSectionId === cls.classSectionId ? "#fff" : "#16a34a"} />
                            <Text style={[styles.dropdownItemName, selectedClassForAllocation?.classSectionId === cls.classSectionId && styles.dropdownItemTextActive]}>Class {cls.className}-{cls.section}</Text>
                          </View>
                          {selectedClassForAllocation?.classSectionId === cls.classSectionId && <CheckCircle size={16} color="#fff" />}
                        </TouchableOpacity>
                      )) : (
                        <View style={styles.dropdownEmpty}><ActivityIndicator size="small" color="#16a34a" /><Text style={styles.dropdownEmptyText}>Loading classes...</Text></View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Subject *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsAllocSubjectDropdownOpen(!isAllocSubjectDropdownOpen)}>
                  <View style={styles.dropdownButtonContent}>
                    <Book size={18} color="#16a34a" />
                    <Text style={styles.dropdownButtonText}>{selectedSubjectForAllocation ? selectedSubjectForAllocation.subjectName : 'Choose a subject'}</Text>
                  </View>
                  {isAllocSubjectDropdownOpen ? <ChevronUp size={20} color="#16a34a" /> : <ChevronDown size={20} color="#16a34a" />}
                </TouchableOpacity>
                {isAllocSubjectDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {subjects.filter(s => s.active).length > 0 ? subjects.filter(s => s.active).map((subject) => (
                        <TouchableOpacity key={subject.subjectId} style={[styles.dropdownItem, selectedSubjectForAllocation?.subjectId === subject.subjectId && styles.dropdownItemActiveAllocation]} onPress={() => { setSelectedSubjectForAllocation(subject); setAllocationForm({ ...allocationForm, subjectId: subject.subjectId }); setIsAllocSubjectDropdownOpen(false); }}>
                          <View style={styles.dropdownItemContent}>
                            <Book size={16} color={selectedSubjectForAllocation?.subjectId === subject.subjectId ? "#fff" : "#16a34a"} />
                            <View style={styles.dropdownItemTexts}>
                              <Text style={[styles.dropdownItemName, selectedSubjectForAllocation?.subjectId === subject.subjectId && styles.dropdownItemTextActive]}>{subject.subjectName}</Text>
                              <Text style={[styles.dropdownItemCode, selectedSubjectForAllocation?.subjectId === subject.subjectId && styles.dropdownItemTextActive]}>{subject.subjectCode}</Text>
                            </View>
                          </View>
                          {selectedSubjectForAllocation?.subjectId === subject.subjectId && <CheckCircle size={16} color="#fff" />}
                        </TouchableOpacity>
                      )) : (
                        <View style={styles.dropdownEmpty}>
                          <AlertCircle size={20} color="#16a34a" />
                          <Text style={styles.dropdownEmptyText}>No active subjects found. Please add subjects first.</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Teacher *</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsAllocTeacherDropdownOpen(!isAllocTeacherDropdownOpen)}>
                  <View style={styles.dropdownButtonContent}>
                    <User size={18} color="#16a34a" />
                    <Text style={styles.dropdownButtonText}>{selectedTeacherForAllocation ? selectedTeacherForAllocation.teacherName : 'Choose a teacher'}</Text>
                  </View>
                  {isAllocTeacherDropdownOpen ? <ChevronUp size={20} color="#16a34a" /> : <ChevronDown size={20} color="#16a34a" />}
                </TouchableOpacity>
                {isAllocTeacherDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {teachers.length > 0 ? teachers.map((teacher) => (
                        <TouchableOpacity key={teacher.teacherId} style={[styles.dropdownItem, selectedTeacherForAllocation?.teacherId === teacher.teacherId && styles.dropdownItemActiveAllocation]} onPress={() => { setSelectedTeacherForAllocation(teacher); setAllocationForm({ ...allocationForm, teacherId: teacher.teacherId }); setIsAllocTeacherDropdownOpen(false); }}>
                          <View style={styles.dropdownItemContent}>
                            <User size={16} color={selectedTeacherForAllocation?.teacherId === teacher.teacherId ? "#fff" : "#16a34a"} />
                            <View style={styles.dropdownItemTexts}>
                              <Text style={[styles.dropdownItemName, selectedTeacherForAllocation?.teacherId === teacher.teacherId && styles.dropdownItemTextActive]}>{teacher.teacherName}</Text>
                              <Text style={[styles.dropdownItemCode, selectedTeacherForAllocation?.teacherId === teacher.teacherId && styles.dropdownItemTextActive]}>{teacher.email || teacher.teacherId}</Text>
                            </View>
                          </View>
                          {selectedTeacherForAllocation?.teacherId === teacher.teacherId && <CheckCircle size={16} color="#fff" />}
                        </TouchableOpacity>
                      )) : (
                        <View style={styles.dropdownEmpty}><ActivityIndicator size="small" color="#16a34a" /><Text style={styles.dropdownEmptyText}>Loading teachers...</Text></View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setAllocationModalVisible(false); resetAllocationForm(); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={assignSubjectTeacher} disabled={submitting}>
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <><UserCheck size={18} color="#fff" /><Text style={styles.submitButtonText}>Assign Teacher</Text></>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create Timetable Modal */}
      <Modal animationType="slide" transparent visible={timetableModalVisible} onRequestClose={() => { setTimetableModalVisible(false); resetTimetableForm(); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '92%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Clock size={24} color="#f59e0b" />
                <Text style={[styles.modalTitle, { color: '#f59e0b' }]}>Create Timetable</Text>
              </View>
              <TouchableOpacity onPress={() => { setTimetableModalVisible(false); resetTimetableForm(); }} style={styles.closeBtn}><X size={24} color="#666" /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Class *</Text>
                <TouchableOpacity
                  style={[styles.dropdownButton, { borderColor: timetableErrors.class ? '#ef4444' : '#eaddcc' }]}
                  onPress={() => setIsTTClassDropdownOpen(!isTTClassDropdownOpen)}
                >
                  <View style={styles.dropdownButtonContent}>
                    <School size={18} color="#f59e0b" />
                    <Text style={styles.dropdownButtonText}>{timetableClassObj ? `Class ${timetableClassObj.className}-${timetableClassObj.section}` : 'Choose a class'}</Text>
                  </View>
                  {isTTClassDropdownOpen ? <ChevronUp size={20} color="#f59e0b" /> : <ChevronDown size={20} color="#f59e0b" />}
                </TouchableOpacity>
                {timetableErrors.class && <Text style={styles.errorText}>{timetableErrors.class}</Text>}
                {isTTClassDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {classes.length > 0 ? classes.map((cls) => (
                        <TouchableOpacity
                          key={cls.classSectionId}
                          style={[styles.dropdownItem, timetableClassId === cls.classSectionId && styles.dropdownItemActiveTT]}
                          onPress={() => { setTimetableClassId(cls.classSectionId); setTimetableClassObj(cls); setIsTTClassDropdownOpen(false); setTimetableErrors(prev => { const n = {...prev}; delete n.class; return n; }); }}
                        >
                          <View style={styles.dropdownItemContent}>
                            <School size={16} color={timetableClassId === cls.classSectionId ? "#fff" : "#f59e0b"} />
                            <Text style={[styles.dropdownItemName, timetableClassId === cls.classSectionId && styles.dropdownItemTextActive]}>Class {cls.className}-{cls.section}</Text>
                          </View>
                          {timetableClassId === cls.classSectionId && <CheckCircle size={16} color="#fff" />}
                        </TouchableOpacity>
                      )) : (
                        <View style={styles.dropdownEmpty}><ActivityIndicator size="small" color="#f59e0b" /><Text style={styles.dropdownEmptyText}>Loading classes...</Text></View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.periodsSection}>
                <View style={styles.periodsSectionHeader}>
                  <Text style={styles.periodsSectionTitle}>Periods ({periods.length})</Text>
                  <TouchableOpacity style={styles.addPeriodBtn} onPress={addPeriod}>
                    <Plus size={16} color="#f59e0b" />
                    <Text style={styles.addPeriodBtnText}>Add Period</Text>
                  </TouchableOpacity>
                </View>
                {periods.map((p, i) => renderPeriodRow(p, i))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setTimetableModalVisible(false); resetTimetableForm(); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#f59e0b', flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' }]} onPress={createTimetable} disabled={submitting}>
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <><Save size={18} color="#fff" /><Text style={styles.submitButtonText}>Save Timetable</Text></>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F0', padding: 16 },
  headerArea: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: 20, flexWrap: 'wrap', gap: 12
  },
  headerTextContainer: { flex: 1, minWidth: 160 },
  mainTitle: { fontSize: 24, fontWeight: '800', color: '#A0522D', letterSpacing: 0.5 },
  subTitle: { fontSize: 13, color: '#8c7664', marginTop: 4, lineHeight: 18 },
  addBtn: { 
    backgroundColor: '#A0522D', paddingHorizontal: 16, paddingVertical: 10, 
    borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
    shadowColor: '#A0522D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4
  },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  
  tabCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  tabCard: {
    flex: 1,
    minWidth: '18%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0e6dc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tabIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fdf0e6', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  tabIconContainerActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  tabCardTitle: { fontSize: 12, fontWeight: '600', color: '#2e2520', textAlign: 'center' },
  tabCardTitleActive: { color: '#fff' },
  activeIndicator: { position: 'absolute', bottom: 8, width: 20, height: 3, backgroundColor: '#fff', borderRadius: 2 },
  
  contentArea: { flex: 1 },
  listContainer: { paddingBottom: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loaderText: { fontSize: 14, color: '#8c7664', marginTop: 10 },
  
  card: { 
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#f0e6dc',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2
  },
  cardHeader: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  iconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fdf0e6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2e2520', marginBottom: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardDetail: { fontSize: 13, color: '#8c7664' },
  codeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardCode: { fontSize: 13, color: '#8c7664', fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: '#f5f0ea' },
  activeBadge: { backgroundColor: '#e8f5e9' },
  statusText: { fontSize: 11, fontWeight: '600', color: '#8c7664' },
  activeStatusText: { color: '#4caf50' },
  editActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e8f0fe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editActionText: { fontSize: 12, fontWeight: '600', color: '#3b82f6' },
  
  // Class Card Actions
  classCardActions: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#f0e6dc', gap: 8 },
  classActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8 },
  classActionBtnText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  
  // View Timetable Styles
  viewTimetableContainer: { flex: 1 },
  daySelector: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  dayTab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#fde68a', marginRight: 8 },
  dayTabActive: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  dayTabText: { fontSize: 14, fontWeight: '600', color: '#92400e' },
  dayTabTextActive: { color: '#fff' },
  timetableGrid: { gap: 12 },
  timetableCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#fde68a' },
  timetableCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  timeBadgeText: { fontSize: 12, fontWeight: '600', color: '#92400e' },
  timetableActions: { flexDirection: 'row', gap: 8 },
  timetableEditBtn: { padding: 6, backgroundColor: '#fef3c7', borderRadius: 8 },
  timetableDeleteBtn: { padding: 6, backgroundColor: '#fee2e2', borderRadius: 8 },
  timetableSubjectInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  timetableSubject: { fontSize: 15, fontWeight: '700', color: '#2e2520' },
  timetableTeacherInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timetableTeacher: { fontSize: 13, color: '#8c7664' },
  editPeriodForm: { marginTop: 8 },
  editField: { marginBottom: 12 },
  editFieldLabel: { fontSize: 11, fontWeight: '600', color: '#92400e', marginBottom: 4 },
  editFieldValue: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fef3c7', padding: 8, borderRadius: 8 },
  editFieldText: { fontSize: 13, color: '#2e2520', flex: 1 },
  editTimeRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  editTimeBtn: { flex: 1, backgroundColor: '#fef3c7', padding: 10, borderRadius: 8, alignItems: 'center' },
  editTimeLabel: { fontSize: 10, color: '#92400e', marginBottom: 4 },
  editTimeValue: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  saveEditBtn: { backgroundColor: '#f59e0b', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, borderRadius: 8 },
  saveEditBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  
  // Existing Timetables
  existingTimetables: { marginTop: 20, marginBottom: 20 },
  existingTimetablesTitle: { fontSize: 16, fontWeight: '700', color: '#2e2520', marginBottom: 12 },
  existingTimetableCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#fde68a', marginBottom: 8 },
  existingTimetableInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  existingTimetableClass: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  existingTimetableYear: { fontSize: 11, color: '#8c7664', marginTop: 2 },
  
  // Allocation styles
  dropdownItemActiveAllocation: { backgroundColor: '#16a34a' },
  dropdownItemActiveTT: { backgroundColor: '#f59e0b' },
  allocationClassSelector: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e0d4c8', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  allocationSelectorLabel: { fontSize: 14, fontWeight: '600', color: '#2e2520', marginBottom: 12 },
  allocationDropdownButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#16a34a', borderRadius: 10, backgroundColor: '#f0fdf4', padding: 14 },
  
  allocationSummaryCard: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: '#bbf7d0', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  allocationSummaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#f0fdf4', borderBottomWidth: 1, borderBottomColor: '#bbf7d0' },
  allocationSummaryTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  allocationSummaryTitle: { fontSize: 16, fontWeight: '700', color: '#15803d' },
  allocationCountBadge: { backgroundColor: '#16a34a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  allocationCountText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  allocationTable: { padding: 0 },
  allocationTableHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#dcfce7' },
  allocationTableHeaderText: { fontSize: 12, fontWeight: '700', color: '#15803d', textTransform: 'uppercase', letterSpacing: 0.5 },
  allocationTableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0fdf4' },
  allocationTableRowAlt: { backgroundColor: '#f9fffe' },
  allocationSubjectCell: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  allocationSubjectText: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  allocationTeacherCell: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' },
  allocationTeacherText: { fontSize: 14, color: '#15803d', fontWeight: '500' },

  emptyAddBtn: { backgroundColor: '#16a34a', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginTop: 16 },
  emptyAddBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  // Class Card
  classCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#f0e6dc', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  classCardHeader: { flexDirection: 'row', padding: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0e6dc', backgroundColor: '#faf5f0' },
  classIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f3e8ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  classInfo: { flex: 1 },
  classTitle: { fontSize: 18, fontWeight: '700', color: '#2e2520' },
  classSubtitle: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  classStats: { alignItems: 'flex-end' },
  statBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f3e8ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statText: { fontSize: 12, fontWeight: '600', color: '#8b5cf6' },
  classDetails: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0e6dc' },
  detailSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 13, color: '#8c7664', fontWeight: '500' },
  detailValue: { fontSize: 13, color: '#2e2520', fontWeight: '600' },
  subjectTagsContainer: { padding: 16, flexDirection: 'row' },
  subjectTag: { backgroundColor: '#f3e8ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  subjectTagText: { fontSize: 12, color: '#8b5cf6', fontWeight: '500' },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#A0522D', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#b0a090', textAlign: 'center' },

  // Timetable landing
  timetableLandingContainer: { flex: 1, padding: 8 },
  timetableLandingCard: { backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#fde68a', marginBottom: 20, gap: 12 },
  timetableLandingTitle: { fontSize: 22, fontWeight: '800', color: '#b45309', textAlign: 'center' },
  timetableLandingDesc: { fontSize: 14, color: '#8c7664', textAlign: 'center', lineHeight: 22 },
  timetableCreateBtn: { backgroundColor: '#f59e0b', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12, marginTop: 8, shadowColor: '#f59e0b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  timetableCreateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  timetableInfoRow: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: 12 },
  timetableInfoStep: { alignItems: 'center', gap: 8, minWidth: 64 },
  timetableStepIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  timetableStepLabel: { fontSize: 12, fontWeight: '600', color: '#2e2520', textAlign: 'center' },

  // Period card in timetable modal
  periodsSection: { marginBottom: 8 },
  periodsSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  periodsSectionTitle: { fontSize: 15, fontWeight: '700', color: '#2e2520' },
  addPeriodBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  addPeriodBtnText: { fontSize: 13, fontWeight: '600', color: '#f59e0b' },
  periodCard: { backgroundColor: '#fffbeb', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#fde68a' },
  periodCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  periodBadge: { backgroundColor: '#f59e0b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  periodBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  removePeriodBtn: { backgroundColor: '#fee2e2', padding: 6, borderRadius: 8 },
  periodField: { marginBottom: 10 },
  periodFieldLabel: { fontSize: 12, fontWeight: '600', color: '#92400e', marginBottom: 6 },
  periodDropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#fcd34d', borderRadius: 8, backgroundColor: '#fff', padding: 10 },
  periodDropdownText: { fontSize: 14, color: '#2e2520', flex: 1 },
  placeholderText: { color: '#b0a090' },
  periodTimeRow: { flexDirection: 'row' },
  periodTimeInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#fcd34d', borderRadius: 8, backgroundColor: '#fff', padding: 10 },
  periodDropdownList: { marginTop: 4, borderWidth: 1, borderColor: '#fcd34d', borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' },
  periodDropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#fef3c7' },
  periodDropdownItemActive: { backgroundColor: '#f59e0b' },
  periodDropdownItemText: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  periodDropdownItemTextActive: { color: '#fff' },
  periodDropdownItemSub: { fontSize: 11, color: '#8c7664', marginTop: 2 },
  fieldError: { borderColor: '#ef4444' },
  errorText: { fontSize: 11, color: '#ef4444', marginTop: 4 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '92%', maxWidth: 560, maxHeight: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#A0522D' },
  closeBtn: { padding: 4 },
  inputGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#2e2520', marginBottom: 8 },
  inputHelper: { fontSize: 12, color: '#8c7664', marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, backgroundColor: '#fafafa' },
  inputIcon: { marginLeft: 12 },
  input: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 14, color: '#2e2520', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10 },
  displayBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, backgroundColor: '#f5f0ea', padding: 14 },
  displayText: { fontSize: 14, color: '#2e2520', fontWeight: '500' },
  infoBox: { backgroundColor: '#fef3c7', padding: 12, borderRadius: 10, marginBottom: 20 },
  infoBoxTitle: { fontSize: 12, fontWeight: '600', color: '#d97706', marginBottom: 4 },
  infoBoxText: { fontSize: 14, color: '#92400e', fontWeight: '500' },
  formRow: { flexDirection: 'row', gap: 16, marginBottom: 0 },
  statusOptions: { flexDirection: 'row', gap: 12 },
  statusOption: { flex: 1, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, borderWidth: 1, borderColor: '#eaddcc', backgroundColor: '#fff' },
  statusOptionActive: { backgroundColor: '#A0522D', borderColor: '#A0522D' },
  statusOptionText: { fontSize: 14, fontWeight: '600', color: '#666' },
  statusOptionTextActive: { color: '#fff' },
  
  dropdownButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, backgroundColor: '#fafafa', padding: 12 },
  dropdownButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dropdownButtonText: { fontSize: 14, color: '#2e2520' },
  dropdownList: { marginTop: 8, borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, backgroundColor: '#fff', maxHeight: 250, overflow: 'hidden' },
  dropdownScroll: { maxHeight: 250 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0e6dc' },
  dropdownItemActive: { backgroundColor: '#3b82f6' },
  dropdownItemContent: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  dropdownItemTexts: { flex: 1 },
  dropdownItemName: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  dropdownItemCode: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  dropdownItemTextActive: { color: '#fff' },
  dropdownEmpty: { padding: 20, alignItems: 'center', gap: 8 },
  dropdownEmptyText: { fontSize: 13, color: '#8c7664', textAlign: 'center' },
  
  selectedSubjectsContainer: { marginTop: 10, padding: 12, backgroundColor: '#f9f9f9', borderRadius: 10 },
  selectedCount: { fontSize: 12, fontWeight: '600', color: '#8b5cf6', marginBottom: 8 },
  selectedTagsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectedTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#8b5cf6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  selectedTagText: { fontSize: 12, color: '#fff', fontWeight: '500' },
  
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  cancelButton: { backgroundColor: '#f5f0ea', borderWidth: 1, borderColor: '#eaddcc' },
  cancelButtonText: { color: '#8c7664', fontWeight: '600', fontSize: 14 },
  submitButton: { backgroundColor: '#A0522D', flexDirection: 'row', gap: 8 },
  submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});