import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, Modal, TextInput, ScrollView, useWindowDimensions, RefreshControl, Platform } from 'react-native';
import {
  Truck,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  X,
  Calendar,
  Wrench,
  Fuel,
  Car,
  Eye,
  MapPin,
  Bus,
  Plus,
  Navigation,
  Clock as ClockIcon,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserX,
  UserCheck,
  Users,
  Phone,
  DollarSign
} from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TransportIssues() {
  const { width, height } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('issues');
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [routeForm, setRouteForm] = useState({
    routeName: '',
    pickupStartTime: '',
    dropStartTime: '',
    vehicleName: '',
    vehicleNumber: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // New states for missing features
  const [assignDriverModalVisible, setAssignDriverModalVisible] = useState(false);
  const [selectedRouteForAssign, setSelectedRouteForAssign] = useState(null);
  const [driverId, setDriverId] = useState('');
  const [assigningDriver, setAssigningDriver] = useState(false);
  const [driversList, setDriversList] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [driverDropdownOpen, setDriverDropdownOpen] = useState(false);

  const [assignStudentModalVisible, setAssignStudentModalVisible] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    routeId: '',
    pickupStop: '',
    dropStop: '',
    pickupTime: '',
    dropTime: '',
    feeStatus: 'PAID'
  });
  const [assigningStudent, setAssigningStudent] = useState(false);

  const [routeStudentsModalVisible, setRouteStudentsModalVisible] = useState(false);
  const [selectedRouteForStudents, setSelectedRouteForStudents] = useState(null);
  const [routeStudents, setRouteStudents] = useState([]);
  const [loadingRouteStudents, setLoadingRouteStudents] = useState(false);

  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, absent: 0, total: 0 });
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [showAttendanceDatePicker, setShowAttendanceDatePicker] = useState(false);

  // Time picker states
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showDropTimePicker, setShowDropTimePicker] = useState(false);
  const [showStudentPickupTimePicker, setShowStudentPickupTimePicker] = useState(false);
  const [showStudentDropTimePicker, setShowStudentDropTimePicker] = useState(false);
  const [tempPickupTime, setTempPickupTime] = useState(new Date());
  const [tempDropTime, setTempDropTime] = useState(new Date());
  const [tempStudentPickupTime, setTempStudentPickupTime] = useState(new Date());
  const [tempStudentDropTime, setTempStudentDropTime] = useState(new Date());

  const isMobile = width < 768;

  // ==================== VALIDATION FUNCTIONS ====================
  const validateRouteName = (name) => {
    if (!name || name.trim() === '') {
      return 'Route name is required';
    }
    if (name.trim().length < 3) {
      return 'Route name must be at least 3 characters';
    }
    if (name.trim().length > 100) {
      return 'Route name must be less than 100 characters';
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name.trim())) {
      return 'Route name can only contain letters, numbers, spaces, hyphens and underscores';
    }
    return null;
  };

  const validateVehicleName = (name) => {
    if (!name || name.trim() === '') {
      return 'Vehicle name is required';
    }
    if (name.trim().length < 2) {
      return 'Vehicle name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
      return 'Vehicle name must be less than 50 characters';
    }
    return null;
  };

  const validateVehicleNumber = (number) => {
    if (!number || number.trim() === '') {
      return 'Vehicle number is required';
    }
    const cleanNumber = number.trim().toUpperCase().replace(/\s/g, '');
    const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/;
    if (!vehicleRegex.test(cleanNumber)) {
      return 'Enter valid Indian vehicle number (e.g., TS09AB1234, MH12CD5678)';
    }
    return null;
  };

  const validateTime = (time, fieldName) => {
    if (!time || time.trim() === '') {
      return null;
    }
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
    if (!timeRegex.test(time.trim())) {
      return `${fieldName} must be in format HH:MM AM/PM (e.g., 07:30 AM or 04:30 PM)`;
    }
    return null;
  };

  const validateForm = () => {
    const errors = {};

    errors.routeName = validateRouteName(routeForm.routeName);
    errors.vehicleName = validateVehicleName(routeForm.vehicleName);
    errors.vehicleNumber = validateVehicleNumber(routeForm.vehicleNumber);
    errors.pickupStartTime = validateTime(routeForm.pickupStartTime, 'Pickup time');
    errors.dropStartTime = validateTime(routeForm.dropStartTime, 'Drop time');

    setValidationErrors(errors);
    return !errors.routeName && !errors.vehicleName && !errors.vehicleNumber && !errors.pickupStartTime && !errors.dropStartTime;
  };

  const validateStudentForm = () => {
    const errors = {};
    if (!studentForm.pickupStop.trim()) errors.pickupStop = 'Pickup stop is required';
    if (!studentForm.dropStop.trim()) errors.dropStop = 'Drop stop is required';
    if (!studentForm.pickupTime) errors.pickupTime = 'Pickup time is required';
    if (!studentForm.dropTime) errors.dropTime = 'Drop time is required';
    if (!studentForm.feeStatus) errors.feeStatus = 'Fee status is required';
    return errors;
  };

  const handleFieldChange = (field, value) => {
    setRouteForm({ ...routeForm, [field]: value });
    setTouchedFields({ ...touchedFields, [field]: true });

    let error = null;
    switch (field) {
      case 'routeName':
        error = validateRouteName(value);
        break;
      case 'vehicleName':
        error = validateVehicleName(value);
        break;
      case 'vehicleNumber':
        error = validateVehicleNumber(value);
        break;
      case 'pickupStartTime':
        error = validateTime(value, 'Pickup time');
        break;
      case 'dropStartTime':
        error = validateTime(value, 'Drop time');
        break;
    }
    setValidationErrors({ ...validationErrors, [field]: error });
  };

  // Time picker handlers
  const onPickupTimeChange = (event, selectedDate) => {
    setShowPickupTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTempPickupTime(selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      handleFieldChange('pickupStartTime', formattedTime);
    }
  };

  const onDropTimeChange = (event, selectedDate) => {
    setShowDropTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTempDropTime(selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      handleFieldChange('dropStartTime', formattedTime);
    }
  };

  const onStudentPickupTimeChange = (event, selectedDate) => {
    setShowStudentPickupTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTempStudentPickupTime(selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      setStudentForm({ ...studentForm, pickupTime: formattedTime });
    }
  };

  const onStudentDropTimeChange = (event, selectedDate) => {
    setShowStudentDropTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTempStudentDropTime(selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      setStudentForm({ ...studentForm, dropTime: formattedTime });
    }
  };

  // ==================== FETCH DRIVERS ====================
  const fetchDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const res = await rootApi.get('/api/driver/all');
      setDriversList(res.data);
    } catch (err) {
      console.error("Error fetching drivers", err);
      Alert.alert('Error', 'Failed to fetch drivers list');
    } finally {
      setLoadingDrivers(false);
    }
  };

  // ==================== FETCH STUDENTS ====================
  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await rootApi.get('/api/student/allStudents');
      setStudentsList(res.data);
    } catch (err) {
      console.error("Error fetching students", err);
      Alert.alert('Error', 'Failed to fetch students list');
    } finally {
      setLoadingStudents(false);
    }
  };

  // ==================== ISSUES API ====================
  const fetchAllIssues = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/transport/all-issues');
      setIssues(res.data);
      setFilteredIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues", err);
      Alert.alert('Error', 'Failed to fetch transport issues');
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    setUpdating(true);
    try {
      await rootApi.patch(`/api/student/transport/${issueId}/status?status=${newStatus}`);
      Alert.alert('Success', `Issue marked as ${newStatus}`);
      fetchAllIssues();
      setModalVisible(false);
    } catch (err) {
      console.error("Error updating status", err);
      Alert.alert('Error', 'Failed to update issue status');
    } finally {
      setUpdating(false);
    }
  };

  // ==================== ROUTES API ====================
  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/transport/routes');
      setRoutes(res.data);
    } catch (err) {
      console.error("Error fetching routes", err);
      Alert.alert('Error', 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const createRoute = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    try {
      await rootApi.post('/api/student/transport/route', routeForm);
      Alert.alert('Success', 'Route created successfully!');
      setRouteModalVisible(false);
      resetRouteForm();
      fetchRoutes();
    } catch (err) {
      console.error("Error creating route", err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to create route');
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== Assign Driver to Route ====================
  const assignDriverToRoute = async () => {
    if (!driverId.trim()) {
      Alert.alert('Validation Error', 'Please select a driver');
      return;
    }

    setAssigningDriver(true);
    try {
      await rootApi.put(`/api/student/transport/route/${selectedRouteForAssign.routeId}/assign-driver?driverId=${driverId}`);
      Alert.alert('Success', 'Driver assigned successfully!');
      setAssignDriverModalVisible(false);
      setDriverId('');
      setSelectedRouteForAssign(null);
      fetchRoutes();
    } catch (err) {
      console.error("Error assigning driver", err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to assign driver');
    } finally {
      setAssigningDriver(false);
    }
  };

  // ==================== Assign Student to Route ====================
  const assignStudentToRoute = async () => {
    const errors = validateStudentForm();
    if (Object.keys(errors).length > 0) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    if (!studentId.trim()) {
      Alert.alert('Validation Error', 'Please select a student');
      return;
    }

    setAssigningStudent(true);
    try {
      await rootApi.post(`/api/student/transport/assign/${studentId}`, studentForm);
      Alert.alert('Success', 'Student assigned to route successfully!');
      setAssignStudentModalVisible(false);
      resetStudentForm();
      fetchRoutes();
    } catch (err) {
      console.error("Error assigning student", err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to assign student');
    } finally {
      setAssigningStudent(false);
    }
  };

  // ==================== Get Students by Route ====================
  const fetchStudentsByRoute = async (route) => {
    setLoadingRouteStudents(true);
    setSelectedRouteForStudents(route);
    try {
      const res = await rootApi.get(`/api/student/transport/route/${route.routeId}/students`);
      setRouteStudents(res.data);
      setRouteStudentsModalVisible(true);
    } catch (err) {
      console.error("Error fetching students", err);
      Alert.alert('Error', 'Failed to fetch students for this route');
    } finally {
      setLoadingRouteStudents(false);
    }
  };

  // ==================== Get Attendance Summary ====================
  const fetchAttendanceSummary = async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const res = await rootApi.get(`/api/student/transport/attendance-summary?date=${formattedDate}`);
      setAttendanceSummary(res.data);
    } catch (err) {
      console.error("Error fetching attendance summary", err);
      setAttendanceSummary({ present: 0, absent: 0, total: 0 });
    }
  };

  const onAttendanceDateChange = (event, date) => {
    setShowAttendanceDatePicker(false);
    if (date) {
      setAttendanceDate(date);
      fetchAttendanceSummary(date);
    }
  };

  const resetRouteForm = () => {
    setRouteForm({
      routeName: '',
      pickupStartTime: '',
      dropStartTime: '',
      vehicleName: '',
      vehicleNumber: ''
    });
    setValidationErrors({});
    setTouchedFields({});
    setTempPickupTime(new Date());
    setTempDropTime(new Date());
  };

  const resetStudentForm = () => {
    setStudentId('');
    setStudentForm({
      routeId: '',
      pickupStop: '',
      dropStop: '',
      pickupTime: '',
      dropTime: '',
      feeStatus: 'PAID'
    });
  };

  const toggleExpand = (routeId) => {
    setExpandedRows(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  // ==================== FILTERS ====================
  const applyFilters = () => {
    let filtered = [...issues];

    if (searchQuery) {
      filtered = filtered.filter(issue =>
        issue.issueId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.issueType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.driverId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(issue => issue.issueType?.toLowerCase() === typeFilter.toLowerCase());
    }

    setFilteredIssues(filtered);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setFilteredIssues(issues);
    setShowFilters(false);
  };

  useEffect(() => {
    if (activeTab === 'issues') {
      fetchAllIssues();
    } else {
      fetchRoutes();
      fetchAttendanceSummary(attendanceDate);
      fetchDrivers();
      fetchStudents();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'issues') {
      applyFilters();
    }
  }, [searchQuery, statusFilter, typeFilter, issues]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'issues') {
      await fetchAllIssues();
    } else {
      await fetchRoutes();
      await fetchAttendanceSummary(attendanceDate);
      await fetchDrivers();
      await fetchStudents();
    }
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'RESOLVED': return '#4caf50';
      case 'PENDING': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'RESOLVED': return '#e8f5e9';
      case 'PENDING': return '#fff3e0';
      default: return '#f5f5f5';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'mechanical': return <Wrench size={16} color="#f44336" />;
      case 'fuel': return <Fuel size={16} color="#ff9800" />;
      case 'accident': return <Car size={16} color="#f44336" />;
      default: return <AlertCircle size={16} color="#9e9e9e" />;
    }
  };

  const getFeeStatusColor = (status) => {
    return status === 'PAID' ? '#4caf50' : '#f44336';
  };

  // ==================== Custom Dropdown Component ====================
  const CustomDropdown = ({ options, value, onSelect, placeholder, loading, labelKey, valueKey }) => {
    const [open, setOpen] = useState(false);
    const selected = options.find(opt => opt[valueKey] === value);

    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[styles.dropdownButton, open && styles.dropdownButtonOpen]}
          onPress={() => setOpen(!open)}
        >
          <Text style={[styles.dropdownButtonText, !selected && { color: '#bc9e82' }]}>
            {selected ? selected[labelKey] : placeholder}
          </Text>
          {open ? <ChevronUp size={18} color="#8c7664" /> : <ChevronDown size={18} color="#8c7664" />}
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
              {loading ? (
                <View style={styles.dropdownLoading}>
                  <ActivityIndicator size="small" color="#A0522D" />
                  <Text style={styles.dropdownLoadingText}>Loading...</Text>
                </View>
              ) : options.length === 0 ? (
                <Text style={styles.dropdownEmpty}>No options available</Text>
              ) : (
                options.map((opt) => (
                  <TouchableOpacity
                    key={opt[valueKey]}
                    style={[styles.dropdownItem, opt[valueKey] === value && styles.dropdownItemActive]}
                    onPress={() => {
                      onSelect(opt[valueKey]);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, opt[valueKey] === value && styles.dropdownItemTextActive]}>
                      {opt[labelKey]}
                    </Text>
                    {opt[valueKey] === value && <CheckCircle size={14} color="#A0522D" />}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  // ==================== RENDER COMPONENTS ====================
  const renderDesktopRouteRow = ({ item }) => {
    const isExpanded = expandedRows[item.routeId];

    return (
      <View style={styles.tableRowWrapper}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.cellRouteName]} numberOfLines={1}>{item.routeName}</Text>
          <Text style={[styles.tableCell, styles.cellVehicle]} numberOfLines={1}>{item.vehicleName}</Text>
          <Text style={[styles.tableCell, styles.cellVehicleNum]} numberOfLines={1}>{item.vehicleNumber}</Text>
          <Text style={[styles.tableCell, styles.cellTime]} numberOfLines={1}>{item.pickupStartTime || '-'}</Text>
          <Text style={[styles.tableCell, styles.cellTime]} numberOfLines={1}>{item.dropStartTime || '-'}</Text>
          <View style={[styles.tableCell, styles.cellAction]}>
            <TouchableOpacity
              style={styles.viewRouteBtn}
              onPress={() => toggleExpand(item.routeId)}
            >
              <Eye size={14} color="#A0522D" />
              <Text style={styles.viewRouteBtnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.assignDriverBtn}
              onPress={() => {
                setSelectedRouteForAssign(item);
                fetchDrivers();
                setAssignDriverModalVisible(true);
              }}
            >
              <UserPlus size={14} color="#fff" />
              <Text style={styles.assignDriverBtnText}>Assign Driver</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.assignStudentBtn}
              onPress={() => {
                setStudentForm({ ...studentForm, routeId: item.routeId });
                fetchStudents();
                setAssignStudentModalVisible(true);
              }}
            >
              <Users size={14} color="#fff" />
              <Text style={styles.assignStudentBtnText}>Assign Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewStudentsBtn}
              onPress={() => fetchStudentsByRoute(item)}
            >
              <UserCheck size={14} color="#fff" />
              <Text style={styles.viewStudentsBtnText}>View Students</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedRow}>
            <View style={styles.expandedContent}>
              <View style={styles.expandedSection}>
                <Text style={styles.expandedTitle}>Route Details</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Route Name</Text>
                    <Text style={styles.detailValue}>{item.routeName}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Vehicle Name</Text>
                    <Text style={styles.detailValue}>{item.vehicleName}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Vehicle Number</Text>
                    <Text style={styles.detailValue}>{item.vehicleNumber}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Pickup Start Time</Text>
                    <Text style={styles.detailValue}>{item.pickupStartTime || 'Not set'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Drop Start Time</Text>
                    <Text style={styles.detailValue}>{item.dropStartTime || 'Not set'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  // ==================== ROUTE CARD FOR MOBILE ====================
  const renderRouteCard = ({ item }) => (
    <View style={styles.routeCard}>
      <View style={styles.routeCardHeader}>
        <View style={styles.routeIconContainer}>
          <Bus size={28} color="#8b5cf6" />
        </View>
        <View style={styles.routeHeaderInfo}>
          <Text style={styles.routeName}>{item.routeName}</Text>
          <View style={styles.routeVehicleBadge}>
            <Car size={12} color="#8c7664" />
            <Text style={styles.routeVehicle}>{item.vehicleName}</Text>
          </View>
        </View>
      </View>

      <View style={styles.routeDetailRow}>
        <View style={styles.routeDetailItem}>
          <Text style={styles.routeDetailLabel}>Vehicle Number</Text>
          <Text style={styles.routeDetailValue}>{item.vehicleNumber}</Text>
        </View>
      </View>

      <View style={styles.routeTimeContainer}>
        <View style={styles.routeTimeItem}>
          <Navigation size={16} color="#8b5cf6" />
          <View>
            <Text style={styles.routeTimeLabel}>Pickup Time</Text>
            <Text style={styles.routeTimeValue}>{item.pickupStartTime || 'Not set'}</Text>
          </View>
        </View>
        <View style={styles.routeTimeDivider} />
        <View style={styles.routeTimeItem}>
          <ClockIcon size={16} color="#8b5cf6" />
          <View>
            <Text style={styles.routeTimeLabel}>Drop Time</Text>
            <Text style={styles.routeTimeValue}>{item.dropStartTime || 'Not set'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.routeActionButtons}>
        <TouchableOpacity
          style={styles.mobileAssignDriverBtn}
          onPress={() => {
            setSelectedRouteForAssign(item);
            fetchDrivers();
            setAssignDriverModalVisible(true);
          }}
        >
          <UserPlus size={16} color="#fff" />
          <Text style={styles.mobileBtnText}>Assign Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mobileAssignStudentBtn}
          onPress={() => {
            setStudentForm({ ...studentForm, routeId: item.routeId });
            fetchStudents();
            setAssignStudentModalVisible(true);
          }}
        >
          <Users size={16} color="#fff" />
          <Text style={styles.mobileBtnText}>Assign Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mobileViewStudentsBtn}
          onPress={() => fetchStudentsByRoute(item)}
        >
          <UserCheck size={16} color="#fff" />
          <Text style={styles.mobileBtnText}>View Students</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ==================== RENDER COMPONENTS ====================
  const renderIssueCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => { setSelectedIssue(item); setModalVisible(true); }} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.issueIdContainer}>
          <Truck size={16} color="#A0522D" />
          <Text style={styles.issueId}>{item.issueId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.typeContainer}>
          {getTypeIcon(item.issueType)}
          <Text style={styles.issueType}>{item.issueType || 'N/A'}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{item.description || 'No description'}</Text>
        <Text style={styles.driverIdText}>Driver: {item.driverId || 'N/A'}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Calendar size={12} color="#8c7664" />
          <Text style={styles.footerText}>{item.reportDate}</Text>
        </View>
        <View style={styles.footerItem}>
          <Clock size={12} color="#8c7664" />
          <Text style={styles.footerText}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDesktopIssueRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.cellId]} numberOfLines={1}>{item.issueId}</Text>
      <View style={[styles.tableCell, styles.cellType]}>
        {getTypeIcon(item.issueType)}
        <Text style={styles.typeText} numberOfLines={1}>{item.issueType || 'N/A'}</Text>
      </View>
      <Text style={[styles.tableCell, styles.cellDesc]} numberOfLines={1}>{item.description || '-'}</Text>
      <Text style={[styles.tableCell, styles.cellDate]} numberOfLines={1}>{item.reportDate}</Text>
      <View style={[styles.tableCell, styles.cellStatus]}>
        <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusBgColor(item.status) }]}>
          <Text style={[styles.statusTextSmall, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.viewBtn} onPress={() => { setSelectedIssue(item); setModalVisible(true); }}>
        <Eye size={16} color="#A0522D" />
        <Text style={styles.viewBtnText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStudentRow = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentHeader}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentAvatarText}>{item.studentId?.charAt(3) || 'S'}</Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentIdText}>{item.studentId}</Text>
          <View style={styles.feeStatusBadge}>
            <DollarSign size={12} color={getFeeStatusColor(item.feeStatus)} />
            <Text style={[styles.feeStatusText, { color: getFeeStatusColor(item.feeStatus) }]}>{item.feeStatus}</Text>
          </View>
        </View>
      </View>
      <View style={styles.studentDetails}>
        <View style={styles.studentStopRow}>
          <MapPin size={14} color="#8c7664" />
          <Text style={styles.stopLabel}>Pickup:</Text>
          <Text style={styles.stopValue}>{item.pickupStop}</Text>
          <ClockIcon size={14} color="#8c7664" />
          <Text style={styles.timeValue}>{item.pickupTime}</Text>
        </View>
        <View style={styles.studentStopRow}>
          <Navigation size={14} color="#8c7664" />
          <Text style={styles.stopLabel}>Drop:</Text>
          <Text style={styles.stopValue}>{item.dropStop}</Text>
          <ClockIcon size={14} color="#8c7664" />
          <Text style={styles.timeValue}>{item.dropTime}</Text>
        </View>
        {item.driverName && (
          <View style={styles.driverInfo}>
            <UserCheck size={14} color="#8b5cf6" />
            <Text style={styles.driverText}>Driver: {item.driverName}</Text>
            <Phone size={12} color="#8c7664" />
            <Text style={styles.driverPhoneText}>{item.driverPhone}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Transport Management</Text>
          <Text style={styles.subtitle}>Track issues and manage transport routes</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'issues' && styles.activeTab]}
          onPress={() => setActiveTab('issues')}
        >
          <AlertCircle size={18} color={activeTab === 'issues' ? "#fff" : "#A0522D"} />
          <Text style={[styles.tabText, activeTab === 'issues' && styles.activeTabText]}>Issues ({issues.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'routes' && styles.activeTab]}
          onPress={() => setActiveTab('routes')}
        >
          <Bus size={18} color={activeTab === 'routes' ? "#fff" : "#A0522D"} />
          <Text style={[styles.tabText, activeTab === 'routes' && styles.activeTabText]}>Routes ({routes.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Main ScrollView for all content */}
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Issues Tab */}
        {activeTab === 'issues' && (
          <View style={styles.tabContent}>
            <View style={styles.searchContainer}>
              <Search size={18} color="#8c7664" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by ID, type, driver or description..."
                placeholderTextColor="#bc9e82"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color="#8c7664" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(!showFilters)}>
                <Filter size={18} color="#A0522D" />
              </TouchableOpacity>
            </View>

            {showFilters && (
              <View style={styles.filtersPanel}>
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Status:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['ALL', 'PENDING', 'RESOLVED'].map(status => (
                      <TouchableOpacity key={status} style={[styles.filterChip, statusFilter === status && styles.filterChipActive]} onPress={() => setStatusFilter(status)}>
                        <Text style={[styles.filterChipText, statusFilter === status && styles.filterChipTextActive]}>{status}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Type:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['ALL', 'mechanical', 'fuel', 'accident'].map(type => (
                      <TouchableOpacity key={type} style={[styles.filterChip, typeFilter === type && styles.filterChipActive]} onPress={() => setTypeFilter(type)}>
                        <Text style={[styles.filterChipText, typeFilter === type && styles.filterChipTextActive]}>{type.toUpperCase()}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                  <X size={14} color="#fff" />
                  <Text style={styles.resetBtnText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{issues.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#fff3e0' }]}>
                <Text style={[styles.statNumber, { color: '#ff9800' }]}>{issues.filter(i => i.status === 'PENDING').length}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
                <Text style={[styles.statNumber, { color: '#4caf50' }]}>{issues.filter(i => i.status === 'RESOLVED').length}</Text>
                <Text style={styles.statLabel}>Resolved</Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#A0522D" />
                <Text style={styles.loaderText}>Loading issues...</Text>
              </View>
            ) : filteredIssues.length === 0 ? (
              <View style={styles.emptyState}>
                <Truck size={64} color="#e0d4c8" />
                <Text style={styles.emptyTitle}>No Issues Found</Text>
                <Text style={styles.emptyText}>No transport issues match your filters</Text>
              </View>
            ) : isMobile ? (
              <View style={styles.mobileListContainer}>
                {filteredIssues.map((item) => (
                  <View key={item.issueId}>
                    {renderIssueCard({ item })}
                  </View>
                ))}
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.webTableWrapper} contentContainerStyle={styles.webTableContent}>
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, styles.cellId]}>ID</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellType]}>Type</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellDesc]}>Description</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellDate]}>Date</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellStatus]}>Status</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellAction, { textAlign: 'center' }]}>Action</Text>
                  </View>
                  {filteredIssues.map((item) => (
                    <View key={item.issueId}>
                      {renderDesktopIssueRow({ item })}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        )}

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <View style={styles.tabContent}>
            <View style={styles.routeHeaderBar}>
              <View>
                <Text style={styles.routeListTitle}>Transport Routes</Text>
                <Text style={styles.routeListSubtitle}>{routes.length} route{routes.length !== 1 ? 's' : ''} configured</Text>
              </View>
              <TouchableOpacity style={styles.addRouteBtn} onPress={() => { resetRouteForm(); setRouteModalVisible(true); }}>
                <Plus size={20} color="#fff" />
                <Text style={styles.addRouteBtnText}>Add Route</Text>
              </TouchableOpacity>
            </View>

            {/* Attendance Summary Section */}
            <View style={styles.attendanceContainer}>
              <Text style={styles.attendanceTitle}>Attendance Summary</Text>
              <TouchableOpacity style={styles.attendanceDateBtn} onPress={() => setShowAttendanceDatePicker(true)}>
                <Calendar size={16} color="#A0522D" />
                <Text style={styles.attendanceDateText}>{attendanceDate.toISOString().split('T')[0]}</Text>
              </TouchableOpacity>
              {showAttendanceDatePicker && (
                <DateTimePicker
                  value={attendanceDate}
                  mode="date"
                  display={isMobile ? "default" : "calendar"}
                  onChange={onAttendanceDateChange}
                />
              )}
              <View style={styles.attendanceStats}>
                <View style={styles.attendanceStatCard}>
                  <UserCheck size={20} color="#4caf50" />
                  <Text style={[styles.attendanceStatNumber, { color: '#4caf50' }]}>{attendanceSummary.present}</Text>
                  <Text style={styles.attendanceStatLabel}>Present</Text>
                </View>
                <View style={styles.attendanceStatCard}>
                  <UserX size={20} color="#f44336" />
                  <Text style={[styles.attendanceStatNumber, { color: '#f44336' }]}>{attendanceSummary.absent}</Text>
                  <Text style={styles.attendanceStatLabel}>Absent</Text>
                </View>
                <View style={styles.attendanceStatCard}>
                  <Users size={20} color="#A0522D" />
                  <Text style={[styles.attendanceStatNumber, { color: '#A0522D' }]}>{attendanceSummary.total}</Text>
                  <Text style={styles.attendanceStatLabel}>Total</Text>
                </View>
              </View>
            </View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#A0522D" />
                <Text style={styles.loaderText}>Loading routes...</Text>
              </View>
            ) : routes.length === 0 ? (
              <View style={styles.emptyState}>
                <Bus size={64} color="#e0d4c8" />
                <Text style={styles.emptyTitle}>No Routes Found</Text>
                <Text style={styles.emptyText}>Click the add button to create your first route</Text>
              </View>
            ) : isMobile ? (
              <View style={styles.mobileListContainer}>
                {routes.map((item) => (
                  <View key={item.routeId}>
                    {renderRouteCard({ item })}
                  </View>
                ))}
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.webTableWrapper} contentContainerStyle={styles.webTableContent}>
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, styles.cellRouteName]}>Route Name</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellVehicle]}>Vehicle</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellVehicleNum]}>Number</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellTime]}>Pickup Time</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellTime]}>Drop Time</Text>
                    <Text style={[styles.tableHeaderCell, styles.cellAction, { textAlign: 'center' }]}>Actions</Text>
                  </View>
                  {routes.map((item) => (
                    <View key={item.routeId}>
                      {renderDesktopRouteRow({ item })}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>

      {/* Issue Detail Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? '92%' : 500 }]}>
            {selectedIssue && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <Truck size={24} color="#A0522D" />
                    <Text style={styles.modalTitle}>Issue Details</Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                    <X size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Issue ID</Text>
                    <Text style={styles.detailValue}>{selectedIssue.issueId}</Text>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <View style={styles.typeDetail}>
                      {getTypeIcon(selectedIssue.issueType)}
                      <Text style={styles.detailValue}>{selectedIssue.issueType || 'N/A'}</Text>
                    </View>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailValue}>{selectedIssue.description || 'No description'}</Text>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Driver ID</Text>
                    <Text style={styles.detailValue}>{selectedIssue.driverId || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Report Date</Text>
                    <Text style={styles.detailValue}>{selectedIssue.reportDate}</Text>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusBgColor(selectedIssue.status) }]}>
                      <Text style={[styles.statusTextLarge, { color: getStatusColor(selectedIssue.status) }]}>{selectedIssue.status}</Text>
                    </View>
                  </View>
                  {selectedIssue.status !== 'RESOLVED' && (
                    <TouchableOpacity style={styles.resolveBtn} onPress={() => updateIssueStatus(selectedIssue.issueId, 'RESOLVED')} disabled={updating}>
                      {updating ? <ActivityIndicator size="small" color="#fff" /> : <><CheckCircle size={18} color="#fff" /><Text style={styles.resolveBtnText}>Mark as Resolved</Text></>}
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Route Creation Modal */}
      <Modal animationType="slide" transparent={true} visible={routeModalVisible} onRequestClose={() => { setRouteModalVisible(false); resetRouteForm(); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? '92%' : 550, maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Bus size={24} color="#8b5cf6" />
                <Text style={styles.modalTitle}>Add New Route</Text>
              </View>
              <TouchableOpacity onPress={() => { setRouteModalVisible(false); resetRouteForm(); }} style={styles.closeBtn}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Route Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, validationErrors.routeName && touchedFields.routeName && styles.inputError]}
                  placeholder="e.g., North Campus Route"
                  placeholderTextColor="#bc9e82"
                  value={routeForm.routeName}
                  onChangeText={(t) => handleFieldChange('routeName', t)}
                  onBlur={() => setTouchedFields({ ...touchedFields, routeName: true })}
                />
                {touchedFields.routeName && validationErrors.routeName && (
                  <Text style={styles.errorText}>{validationErrors.routeName}</Text>
                )}
                <Text style={styles.helperText}>Minimum 3 characters, only letters, numbers, spaces, hyphens and underscores</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Vehicle Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, validationErrors.vehicleName && touchedFields.vehicleName && styles.inputError]}
                  placeholder="e.g., Toyota Bus, Volvo Bus"
                  placeholderTextColor="#bc9e82"
                  value={routeForm.vehicleName}
                  onChangeText={(t) => handleFieldChange('vehicleName', t)}
                  onBlur={() => setTouchedFields({ ...touchedFields, vehicleName: true })}
                />
                {touchedFields.vehicleName && validationErrors.vehicleName && (
                  <Text style={styles.errorText}>{validationErrors.vehicleName}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Vehicle Number <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, validationErrors.vehicleNumber && touchedFields.vehicleNumber && styles.inputError]}
                  placeholder="e.g., TS09AB1234"
                  placeholderTextColor="#bc9e82"
                  value={routeForm.vehicleNumber}
                  onChangeText={(t) => handleFieldChange('vehicleNumber', t.toUpperCase())}
                  onBlur={() => setTouchedFields({ ...touchedFields, vehicleNumber: true })}
                  autoCapitalize="characters"
                />
                {touchedFields.vehicleNumber && validationErrors.vehicleNumber && (
                  <Text style={styles.errorText}>{validationErrors.vehicleNumber}</Text>
                )}
                <Text style={styles.helperText}>Format: 2 letters + 1-2 numbers + 1-2 letters + 1-4 numbers</Text>
              </View>

              <View style={styles.rowInputGroup}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Pickup Start Time</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowPickupTimePicker(true)}
                  >
                    <ClockIcon size={18} color="#8c7664" />
                    <Text style={[styles.timePickerText, routeForm.pickupStartTime ? styles.timePickerTextFilled : null]}>
                      {routeForm.pickupStartTime || 'Select pickup time'}
                    </Text>
                  </TouchableOpacity>
                  {showPickupTimePicker && (
                    <DateTimePicker
                      value={tempPickupTime}
                      mode="time"
                      is24Hour={false}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onPickupTimeChange}
                    />
                  )}
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Drop Start Time</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowDropTimePicker(true)}
                  >
                    <ClockIcon size={18} color="#8c7664" />
                    <Text style={[styles.timePickerText, routeForm.dropStartTime ? styles.timePickerTextFilled : null]}>
                      {routeForm.dropStartTime || 'Select drop time'}
                    </Text>
                  </TouchableOpacity>
                  {showDropTimePicker && (
                    <DateTimePicker
                      value={tempDropTime}
                      mode="time"
                      is24Hour={false}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onDropTimeChange}
                    />
                  )}
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setRouteModalVisible(false); resetRouteForm(); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={createRoute} disabled={submitting}>
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitButtonText}>Create Route</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Assign Driver Modal with Dropdown */}
      <Modal animationType="slide" transparent={true} visible={assignDriverModalVisible} onRequestClose={() => { setAssignDriverModalVisible(false); setDriverId(''); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? '92%' : 450 }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <UserPlus size={24} color="#A0522D" />
                <Text style={styles.modalTitle}>Assign Driver</Text>
              </View>
              <TouchableOpacity onPress={() => { setAssignDriverModalVisible(false); setDriverId(''); }} style={styles.closeBtn}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Route: {selectedRouteForAssign?.routeName}</Text>
                <Text style={styles.inputLabel}>Select Driver *</Text>
                <CustomDropdown
                  options={driversList.map(d => ({ driverId: d.driverId, label: `${d.driverName} (${d.driverId})` }))}
                  value={driverId}
                  onSelect={setDriverId}
                  placeholder="Select a driver"
                  loading={loadingDrivers}
                  labelKey="label"
                  valueKey="driverId"
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setAssignDriverModalVisible(false); setDriverId(''); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={assignDriverToRoute} disabled={assigningDriver}>
                  {assigningDriver ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitButtonText}>Assign Driver</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Assign Student Modal with Dropdown */}
      <Modal animationType="slide" transparent={true} visible={assignStudentModalVisible} onRequestClose={() => { setAssignStudentModalVisible(false); resetStudentForm(); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? '92%' : 550, maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Users size={24} color="#A0522D" />
                <Text style={styles.modalTitle}>Assign Student to Route</Text>
              </View>
              <TouchableOpacity onPress={() => { setAssignStudentModalVisible(false); resetStudentForm(); }} style={styles.closeBtn}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Student *</Text>
                <CustomDropdown
                  options={studentsList.map(s => ({ studentId: s.studentId, label: `${s.studentName} (${s.studentId})` }))}
                  value={studentId}
                  onSelect={setStudentId}
                  placeholder="Select a student"
                  loading={loadingStudents}
                  labelKey="label"
                  valueKey="studentId"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Pickup Stop *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter pickup stop"
                  placeholderTextColor="#bc9e82"
                  value={studentForm.pickupStop}
                  onChangeText={(t) => setStudentForm({ ...studentForm, pickupStop: t })}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Drop Stop *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter drop stop"
                  placeholderTextColor="#bc9e82"
                  value={studentForm.dropStop}
                  onChangeText={(t) => setStudentForm({ ...studentForm, dropStop: t })}
                />
              </View>
              <View style={styles.rowInputGroup}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Pickup Time *</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowStudentPickupTimePicker(true)}
                  >
                    <ClockIcon size={18} color="#8c7664" />
                    <Text style={[styles.timePickerText, studentForm.pickupTime ? styles.timePickerTextFilled : null]}>
                      {studentForm.pickupTime || 'Select time'}
                    </Text>
                  </TouchableOpacity>
                  {showStudentPickupTimePicker && (
                    <DateTimePicker
                      value={tempStudentPickupTime}
                      mode="time"
                      is24Hour={false}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onStudentPickupTimeChange}
                    />
                  )}
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Drop Time *</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowStudentDropTimePicker(true)}
                  >
                    <ClockIcon size={18} color="#8c7664" />
                    <Text style={[styles.timePickerText, studentForm.dropTime ? styles.timePickerTextFilled : null]}>
                      {studentForm.dropTime || 'Select time'}
                    </Text>
                  </TouchableOpacity>
                  {showStudentDropTimePicker && (
                    <DateTimePicker
                      value={tempStudentDropTime}
                      mode="time"
                      is24Hour={false}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onStudentDropTimeChange}
                    />
                  )}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fee Status *</Text>
                <View style={styles.feeStatusOptions}>
                  <TouchableOpacity
                    style={[styles.feeStatusOption, studentForm.feeStatus === 'PAID' && styles.feeStatusOptionActive]}
                    onPress={() => setStudentForm({ ...studentForm, feeStatus: 'PAID' })}
                  >
                    <Text style={[styles.feeStatusOptionText, studentForm.feeStatus === 'PAID' && styles.feeStatusOptionTextActive]}>PAID</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.feeStatusOption, studentForm.feeStatus === 'PENDING' && styles.feeStatusOptionActive]}
                    onPress={() => setStudentForm({ ...studentForm, feeStatus: 'PENDING' })}
                  >
                    <Text style={[styles.feeStatusOptionText, studentForm.feeStatus === 'PENDING' && styles.feeStatusOptionTextActive]}>PENDING</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setAssignStudentModalVisible(false); resetStudentForm(); }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={assignStudentToRoute} disabled={assigningStudent}>
                  {assigningStudent ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitButtonText}>Assign Student</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* View Students Modal */}
      <Modal animationType="slide" transparent={true} visible={routeStudentsModalVisible} onRequestClose={() => { setRouteStudentsModalVisible(false); setRouteStudents([]); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? '92%' : 600, maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Users size={24} color="#A0522D" />
                <Text style={styles.modalTitle}>Students - {selectedRouteForStudents?.routeName}</Text>
              </View>
              <TouchableOpacity onPress={() => { setRouteStudentsModalVisible(false); setRouteStudents([]); }} style={styles.closeBtn}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {loadingRouteStudents ? (
              <ActivityIndicator size="large" color="#A0522D" style={{ marginTop: 20 }} />
            ) : routeStudents.length === 0 ? (
              <View style={styles.noStudentsContainer}>
                <Users size={48} color="#e0d4c8" />
                <Text style={styles.noStudentsText}>No students assigned to this route</Text>
              </View>
            ) : (
              <FlatList
                data={routeStudents}
                keyExtractor={(item) => item.studentId}
                renderItem={renderStudentRow}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F0' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eaddcc' },
  title: { fontSize: 24, fontWeight: '700', color: '#A0522D' },
  subtitle: { fontSize: 13, color: '#8c7664', marginTop: 4 },

  mainScrollView: { flex: 1 },
  scrollContentContainer: { flexGrow: 1, paddingBottom: 30 },
  tabContent: { flex: 1 },

  tabContainer: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#eaddcc' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 8 },
  activeTab: { backgroundColor: '#A0522D' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#A0522D' },
  activeTabText: { color: '#fff' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc', gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#2e2520' },
  filterBtn: { padding: 4 },
  filtersPanel: { backgroundColor: '#fff', margin: 16, marginTop: 0, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc' },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10, flexWrap: 'wrap' },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#2e2520' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f5f0ea', marginRight: 8 },
  filterChipActive: { backgroundColor: '#A0522D' },
  filterChipText: { fontSize: 12, color: '#8c7664' },
  filterChipTextActive: { color: '#fff' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#A0522D', paddingVertical: 8, borderRadius: 8, marginTop: 8 },
  resetBtnText: { color: '#fff', fontWeight: '600', fontSize: 12 },

  statsContainer: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#eaddcc' },
  statNumber: { fontSize: 22, fontWeight: '700', color: '#A0522D' },
  statLabel: { fontSize: 11, color: '#8c7664', marginTop: 4 },

  routeHeaderBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: 12 },
  routeListTitle: { fontSize: 18, fontWeight: '700', color: '#2e2520' },
  routeListSubtitle: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  addRouteBtn: { backgroundColor: '#8b5cf6', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, shadowColor: '#8b5cf6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  addRouteBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  attendanceContainer: { backgroundColor: '#fff', margin: 16, marginTop: 0, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc' },
  attendanceTitle: { fontSize: 14, fontWeight: '700', color: '#2e2520', marginBottom: 12 },
  attendanceDateBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fdf0e6', padding: 10, borderRadius: 8, marginBottom: 12, alignSelf: 'flex-start' },
  attendanceDateText: { fontSize: 13, color: '#A0522D', fontWeight: '500' },
  attendanceStats: { flexDirection: 'row', gap: 12 },
  attendanceStatCard: { flex: 1, alignItems: 'center', padding: 10, backgroundColor: '#faf8f5', borderRadius: 10, gap: 6 },
  attendanceStatNumber: { fontSize: 20, fontWeight: '700' },
  attendanceStatLabel: { fontSize: 11, color: '#8c7664' },

  mobileListContainer: { padding: 16, paddingTop: 0 },
  webTableWrapper: { marginHorizontal: 16, marginTop: 0 },
  webTableContent: { minWidth: 1100, flexGrow: 1, paddingBottom: 8 },
  tableContainer: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc', overflow: 'hidden', width: '100%' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#fdf0e6', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eaddcc', width: '100%' },
  tableHeaderCell: { fontSize: 12, fontWeight: '700', color: '#A0522D', flex: 1 },

  routeCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#f0e6dc', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 3 },
  routeCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  routeIconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f3e8ff', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  routeHeaderInfo: { flex: 1 },
  routeName: { fontSize: 18, fontWeight: '700', color: '#2e2520', marginBottom: 4 },
  routeVehicleBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeVehicle: { fontSize: 13, color: '#8c7664' },
  routeDetailRow: { marginBottom: 16 },
  routeDetailItem: { backgroundColor: '#faf8f5', padding: 12, borderRadius: 12 },
  routeDetailLabel: { fontSize: 11, fontWeight: '600', color: '#bc9e82', marginBottom: 4, textTransform: 'uppercase' },
  routeDetailValue: { fontSize: 15, fontWeight: '600', color: '#2e2520' },
  routeTimeContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#faf8f5', borderRadius: 12, padding: 12, marginBottom: 16 },
  routeTimeItem: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  routeTimeDivider: { width: 1, backgroundColor: '#eaddcc', marginHorizontal: 12 },
  routeTimeLabel: { fontSize: 10, fontWeight: '600', color: '#bc9e82', textTransform: 'uppercase', marginBottom: 2 },
  routeTimeValue: { fontSize: 13, fontWeight: '500', color: '#2e2520' },
  routeActionButtons: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  mobileAssignDriverBtn: { flex: 1, backgroundColor: '#A0522D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8 },
  mobileAssignStudentBtn: { flex: 1, backgroundColor: '#8b5cf6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8 },
  mobileViewStudentsBtn: { flex: 1, backgroundColor: '#4caf50', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8 },
  mobileBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  tableRowWrapper: { borderBottomWidth: 1, borderBottomColor: '#f0e6dc', width: '100%' },
  tableRow: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center', backgroundColor: '#fff', width: '100%' },
  tableCell: { fontSize: 13, color: '#2e2520', flex: 1 },
  expandedRow: { backgroundColor: '#faf8f5', paddingHorizontal: 12, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#f0e6dc' },
  expandedContent: { flex: 1 },
  expandedSection: { marginBottom: 8 },
  expandedTitle: { fontSize: 14, fontWeight: '700', color: '#A0522D', marginBottom: 12 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  detailItem: { flex: 1, minWidth: 200 },
  detailLabel: { fontSize: 11, fontWeight: '600', color: '#bc9e82', marginBottom: 4, textTransform: 'uppercase' },
  detailValue: { fontSize: 14, color: '#2e2520', fontWeight: '500' },

  viewRouteBtn: { backgroundColor: '#fdf0e6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 6 },
  viewRouteBtnText: { fontSize: 10, fontWeight: '600', color: '#A0522D' },
  assignDriverBtn: { backgroundColor: '#A0522D', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  assignDriverBtnText: { fontSize: 10, fontWeight: '600', color: '#fff' },
  assignStudentBtn: { backgroundColor: '#8b5cf6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  assignStudentBtnText: { fontSize: 10, fontWeight: '600', color: '#fff' },
  viewStudentsBtn: { backgroundColor: '#4caf50', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewStudentsBtnText: { fontSize: 10, fontWeight: '600', color: '#fff' },

  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, padding: 14, borderWidth: 1, borderColor: '#f0e6dc', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  issueIdContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  issueId: { fontSize: 12, fontWeight: '600', color: '#A0522D' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '600' },
  cardBody: { marginBottom: 10, gap: 6 },
  typeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  issueType: { fontSize: 13, fontWeight: '600', color: '#2e2520' },
  description: { fontSize: 12, color: '#8c7664', lineHeight: 16 },
  driverIdText: { fontSize: 10, color: '#bc9e82' },
  cardFooter: { flexDirection: 'row', gap: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0e6dc' },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 10, color: '#bc9e82' },

  studentCard: { backgroundColor: '#faf8f5', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#eaddcc' },
  studentHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  studentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fdf0e6', alignItems: 'center', justifyContent: 'center' },
  studentAvatarText: { fontSize: 16, fontWeight: '700', color: '#A0522D' },
  studentInfo: { flex: 1 },
  studentIdText: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  feeStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  feeStatusText: { fontSize: 10, fontWeight: '600' },
  studentDetails: { gap: 8 },
  studentStopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  stopLabel: { fontSize: 11, fontWeight: '600', color: '#8c7664' },
  stopValue: { fontSize: 12, color: '#2e2520', flex: 1 },
  timeValue: { fontSize: 12, color: '#A0522D', fontWeight: '500' },
  driverInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#eaddcc' },
  driverText: { fontSize: 11, color: '#8b5cf6' },
  driverPhoneText: { fontSize: 11, color: '#8c7664' },

  // Dropdown Styles
  dropdownContainer: { position: 'relative', zIndex: 1000, marginBottom: 16 },
  dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 12, padding: 12, backgroundColor: '#fafafa' },
  dropdownButtonOpen: { borderColor: '#A0522D', borderWidth: 2 },
  dropdownButtonText: { fontSize: 14, color: '#2e2520', flex: 1 },
  dropdownList: { position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc', zIndex: 2000, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  dropdownLoading: { padding: 20, alignItems: 'center', gap: 8 },
  dropdownLoadingText: { fontSize: 12, color: '#8c7664' },
  dropdownEmpty: { padding: 20, textAlign: 'center', color: '#bc9e82', fontSize: 12 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0e6dc' },
  dropdownItemActive: { backgroundColor: '#fdf0e6' },
  dropdownItemText: { fontSize: 13, color: '#2e2520', flex: 1 },
  dropdownItemTextActive: { color: '#A0522D', fontWeight: '600' },

  cellId: { flex: 0.8, paddingRight: 8 },
  cellType: { flex: 0.8, flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 8 },
  cellDesc: { flex: 2, paddingRight: 8 },
  cellDate: { flex: 0.8, paddingRight: 8 },
  cellStatus: { flex: 0.7, paddingRight: 8 },
  cellAction: { flex: 1.5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 6 },
  cellRouteName: { flex: 1.2, paddingRight: 8 },
  cellVehicle: { flex: 1, paddingRight: 8 },
  cellVehicleNum: { flex: 1, paddingRight: 8 },
  cellTime: { flex: 0.9, paddingRight: 8 },

  typeText: { fontSize: 13, color: '#2e2520' },
  statusBadgeSmall: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start' },
  statusTextSmall: { fontSize: 10, fontWeight: '600' },
  viewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#fdf0e6' },
  viewBtnText: { fontSize: 11, fontWeight: '600', color: '#A0522D' },

  loaderContainer: { padding: 40, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loaderText: { fontSize: 14, color: '#8c7664' },
  emptyState: { padding: 60, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#A0522D', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#b0a090', textAlign: 'center' },
  noStudentsContainer: { padding: 40, alignItems: 'center', gap: 12 },
  noStudentsText: { fontSize: 14, color: '#b0a090', textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#A0522D' },
  modalSection: { marginBottom: 20 },
  modalLabel: { fontSize: 14, fontWeight: '600', color: '#2e2520', marginBottom: 8 },
  closeBtn: { padding: 4 },
  detailSection: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0e6dc', paddingBottom: 12 },
  detailLabel: { fontSize: 11, fontWeight: '600', color: '#bc9e82', marginBottom: 4, textTransform: 'uppercase' },
  typeDetail: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  statusBadgeLarge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginTop: 4 },
  statusTextLarge: { fontSize: 13, fontWeight: '600' },
  resolveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4caf50', paddingVertical: 14, borderRadius: 12, marginTop: 8 },
  resolveBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  inputGroup: { marginBottom: 20 },
  rowInputGroup: { flexDirection: 'row', gap: 12 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#2e2520', marginBottom: 8 },
  requiredStar: { color: '#f44336' },
  input: { borderWidth: 1, borderColor: '#eaddcc', borderRadius: 12, padding: 12, fontSize: 14, color: '#2e2520', backgroundColor: '#fafafa' },
  inputError: { borderColor: '#f44336', borderWidth: 2, backgroundColor: '#fff5f5' },
  errorText: { fontSize: 11, color: '#f44336', marginTop: 4, marginLeft: 4 },
  helperText: { fontSize: 10, color: '#bc9e82', marginTop: 4, marginLeft: 4 },

  timePickerButton: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#eaddcc', borderRadius: 12, padding: 12, backgroundColor: '#fafafa' },
  timePickerText: { flex: 1, fontSize: 14, color: '#bc9e82' },
  timePickerTextFilled: { color: '#2e2520' },

  feeStatusOptions: { flexDirection: 'row', gap: 12 },
  feeStatusOption: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f5f0ea', alignItems: 'center', borderWidth: 1, borderColor: '#eaddcc' },
  feeStatusOptionActive: { backgroundColor: '#fdf0e6', borderColor: '#A0522D' },
  feeStatusOptionText: { fontSize: 13, fontWeight: '600', color: '#8c7664' },
  feeStatusOptionTextActive: { color: '#A0522D' },

  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f5f0ea', borderWidth: 1, borderColor: '#eaddcc' },
  cancelButtonText: { color: '#8c7664', fontWeight: '600' },
  submitButton: { backgroundColor: '#8b5cf6' },
  submitButtonText: { color: '#fff', fontWeight: '600' },
});