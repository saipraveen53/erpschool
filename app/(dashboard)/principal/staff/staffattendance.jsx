import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  useWindowDimensions,
  Alert,
  RefreshControl
} from 'react-native';
import {
  Calendar as CalendarIcon,
  UserCheck,
  UserX,
  Clock,
  Search,
  X,
  Save,
  CheckCircle,
  Users,
  Plus,
  ChevronDown,
  MessageSquare,
  Filter
} from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';
import DateTimePicker from '@react-native-community/datetimepicker';

const STATUS_COLORS = {
  PRESENT: '#10b981',
  ABSENT: '#ef4444',
  HALF_DAY: '#f59e0b'
};

const STATUS_ICONS = {
  PRESENT: UserCheck,
  ABSENT: UserX,
  HALF_DAY: Clock
};

const STATUS_OPTIONS = [
  { value: 'PRESENT', label: 'Present', color: '#10b981', icon: UserCheck },
  { value: 'ABSENT', label: 'Absent', color: '#ef4444', icon: UserX },
  { value: 'HALF_DAY', label: 'Half Day', color: '#f59e0b', icon: Clock }
];

export default function StaffAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [markModalVisible, setMarkModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [markStatus, setMarkStatus] = useState('');
  const [markRemarks, setMarkRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    halfDay: 0
  });

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isMobile = width < 480;

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAttendance = async (date, status = null) => {
    setLoading(true);
    try {
      const formattedDate = formatDate(date);
      let url = `/api/student/teacher/teacher/attendance/date/${formattedDate}`;
      if (status && status !== 'ALL') {
        url += `?status=${status}`;
      }
      const res = await rootApi.get(url);
      const data = Array.isArray(res.data) ? res.data : [];
      setAttendanceData(data);
      setFilteredData(data);
      calculateStats(data);
    } catch (err) {
      console.error("Error fetching attendance", err);
      if (err?.response?.status !== 404) {
        Alert.alert('Error', 'Failed to fetch attendance data');
      }
      setAttendanceData([]);
      setFilteredData([]);
      setStats({ total: 0, present: 0, absent: 0, halfDay: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const present = data.filter(item => item.status === 'PRESENT').length;
    const absent = data.filter(item => item.status === 'ABSENT').length;
    const halfDay = data.filter(item => item.status === 'HALF_DAY').length;
    setStats({ total, present, absent, halfDay });
  };

  const markAttendance = async () => {
    if (!selectedTeacher) return;
    
    setSubmitting(true);
    try {
      await rootApi.post('/api/student/teacher/attendance', {
        teacherId: selectedTeacher.teacherId,
        status: markStatus,
        remarks: markRemarks || null
      });
      
      Alert.alert('Success', 'Attendance marked successfully!');
      setMarkModalVisible(false);
      // Refresh data after marking
      await fetchAttendance(selectedDate, statusFilter !== 'ALL' ? statusFilter : null);
      setSelectedTeacher(null);
      setMarkStatus('');
      setMarkRemarks('');
    } catch (err) {
      console.error("Error marking attendance", err);
      Alert.alert('Error', err?.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      fetchAttendance(date, statusFilter !== 'ALL' ? statusFilter : null);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === 'ALL') {
      setFilteredData(attendanceData);
    } else {
      const filtered = attendanceData.filter(item => item.status === status);
      setFilteredData(filtered);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredData(attendanceData);
    } else {
      const filtered = attendanceData.filter(item =>
        item.teacherName?.toLowerCase().includes(query.toLowerCase()) ||
        item.teacherId?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const openMarkModal = (teacher) => {
    setSelectedTeacher(teacher);
    setMarkStatus('');
    setMarkRemarks('');
    setMarkModalVisible(true);
  };

  const StatCard = ({ title, value, color, icon: Icon }) => (
    <View style={[styles.statCard, { borderBottomColor: color }]}>
      <View style={styles.statContent}>
        <View style={[styles.statIconWrapper, { backgroundColor: color + '15' }]}>
          <Icon size={18} color={color} />
        </View>
        <View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{title}</Text>
        </View>
      </View>
    </View>
  );

  const AttendanceCard = ({ item }) => {
    const StatusIcon = STATUS_ICONS[item.status] || UserCheck;
    const statusColor = STATUS_COLORS[item.status] || '#6b7280';
    const hasAttendance = item.status && item.status !== '';
    
    return (
      <View style={styles.attendanceCard}>
        <View style={styles.cardContent}>
          <View style={styles.teacherSection}>
            <View style={[styles.avatar, { backgroundColor: statusColor + '15' }]}>
              <Text style={[styles.avatarText, { color: statusColor }]}>
                {item.teacherName?.charAt(0) || 'T'}
              </Text>
            </View>
            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{item.teacherName}</Text>
              <Text style={styles.teacherId}>ID: {item.teacherId}</Text>
              {item.remarks && (
                <View style={styles.remarksRow}>
                  <MessageSquare size={10} color="#9ca3af" />
                  <Text style={styles.remarksTextSmall}>{item.remarks}</Text>
                </View>
              )}
            </View>
          </View>
          
          {hasAttendance ? (
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '10' }]}>
              <StatusIcon size={14} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status?.replace('_', ' ')}
              </Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.markButton}
              onPress={() => openMarkModal(item)}
            >
              <Plus size={16} color="#A0522D" />
              <Text style={styles.markButtonText}>Mark</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconWrapper}>
            <Users size={28} color="#A0522D" />
          </View>
          <View>
            <Text style={styles.title}>Staff Attendance</Text>
            <Text style={styles.subtitle}>Manage teacher attendance records</Text>
          </View>
        </View>
      </View>

      {/* Date Picker Card */}
      <View style={styles.datePickerCard}>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <CalendarIcon size={20} color="#A0522D" />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <ChevronDown size={18} color="#8c7664" />
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={isSmallScreen ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard title="Total" value={stats.total} color="#8b5cf6" icon={Users} />
        <StatCard title="Present" value={stats.present} color="#10b981" icon={UserCheck} />
        <StatCard title="Absent" value={stats.absent} color="#ef4444" icon={UserX} />
        <StatCard title="Half Day" value={stats.halfDay} color="#f59e0b" icon={Clock} />
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color="#8c7664" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or ID..."
            placeholderTextColor="#b0a090"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <X size={16} color="#8c7664" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[styles.filterChip, statusFilter === 'ALL' && styles.filterChipActive]}
          onPress={() => handleStatusFilter('ALL')}
        >
          <Text style={[styles.filterChipText, statusFilter === 'ALL' && styles.filterChipTextActive]}>
            All ({stats.total})
          </Text>
        </TouchableOpacity>
        
        {STATUS_OPTIONS.map(option => {
          const IconComponent = option.icon;
          const count = option.value === 'PRESENT' ? stats.present : option.value === 'ABSENT' ? stats.absent : stats.halfDay;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterChip,
                statusFilter === option.value && { 
                  backgroundColor: option.color + '15',
                  borderColor: option.color
                }
              ]}
              onPress={() => handleStatusFilter(option.value)}
            >
              <IconComponent size={14} color={statusFilter === option.value ? option.color : '#8c7664'} />
              <Text style={[
                styles.filterChipText,
                statusFilter === option.value && { color: option.color }
              ]}>
                {option.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Attendance List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#A0522D" />
          <Text style={styles.loaderText}>Loading attendance records...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id?.toString() || item.teacherId}
          renderItem={({ item }) => <AttendanceCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchAttendance(selectedDate, statusFilter !== 'ALL' ? statusFilter : null);
              }}
              colors={['#A0522D']}
              tintColor="#A0522D"
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Users size={64} color="#e0d4c8" />
              <Text style={styles.emptyTitle}>No Attendance Records</Text>
              <Text style={styles.emptyText}>
                {statusFilter !== 'ALL' 
                  ? `No ${statusFilter.toLowerCase()} records found for ${selectedDate.toLocaleDateString()}`
                  : `No attendance records found for ${selectedDate.toLocaleDateString()}`}
              </Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={() => fetchAttendance(selectedDate)}
              >
                <Users size={18} color="#fff" />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Mark Attendance Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={markModalVisible}
        onRequestClose={() => setMarkModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isMobile && styles.modalContentMobile]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Plus size={24} color="#A0522D" />
                <Text style={styles.modalTitle}>Mark Attendance</Text>
              </View>
              <TouchableOpacity onPress={() => setMarkModalVisible(false)} style={styles.closeBtn}>
                <X size={24} color="#8c7664" />
              </TouchableOpacity>
            </View>

            {selectedTeacher && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.teacherInfoCard}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>
                      {selectedTeacher.teacherName?.charAt(0) || 'T'}
                    </Text>
                  </View>
                  <View style={styles.modalTeacherInfo}>
                    <Text style={styles.modalTeacherName}>{selectedTeacher.teacherName}</Text>
                    <Text style={styles.modalTeacherId}>ID: {selectedTeacher.teacherId}</Text>
                    <Text style={styles.modalTeacherDate}>
                      {selectedDate.toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Attendance Status *</Text>
                  <View style={styles.statusGrid}>
                    {STATUS_OPTIONS.map(option => {
                      const IconComponent = option.icon;
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.statusOption,
                            markStatus === option.value && { 
                              backgroundColor: option.color,
                              borderColor: option.color
                            }
                          ]}
                          onPress={() => setMarkStatus(option.value)}
                        >
                          <IconComponent 
                            size={20} 
                            color={markStatus === option.value ? "#fff" : option.color} 
                          />
                          <Text style={[
                            styles.statusOptionText,
                            markStatus === option.value && { color: "#fff" }
                          ]}>
                            {option.label}
                          </Text>
                          {markStatus === option.value && (
                            <CheckCircle size={16} color="#fff" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Remarks (Optional)</Text>
                  <View style={styles.remarksInputContainer}>
                    <MessageSquare size={18} color="#A0522D" />
                    <TextInput
                      style={styles.remarksInput}
                      placeholder="Add remarks or notes..."
                      placeholderTextColor="#b0a090"
                      value={markRemarks}
                      onChangeText={setMarkRemarks}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={() => setMarkModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.submitButton]} 
                    onPress={markAttendance}
                    disabled={submitting || !markStatus}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <CheckCircle size={18} color="#fff" />
                        <Text style={styles.submitButtonText}>Mark Attendance</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF8F0',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e6dc',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fdf0e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#A0522D',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#8c7664',
    marginTop: 4,
  },
  datePickerCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0e6dc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#2e2520',
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderBottomWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2e2520',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8c7664',
    marginTop: 2,
  },
  searchSection: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0e6dc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2e2520',
    padding: 0,
  },
  filterScroll: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterContainer: {
    gap: 8,
    paddingBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0e6dc',
  },
  filterChipActive: {
    backgroundColor: '#fdf0e6',
    borderColor: '#A0522D',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8c7664',
  },
  filterChipTextActive: {
    color: '#A0522D',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  attendanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0e6dc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teacherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e2520',
    marginBottom: 2,
  },
  teacherId: {
    fontSize: 12,
    color: '#8c7664',
  },
  remarksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  remarksTextSmall: {
    fontSize: 11,
    color: '#8c7664',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  markButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fdf0e6',
    borderWidth: 1,
    borderColor: '#A0522D',
  },
  markButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A0522D',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    fontSize: 14,
    color: '#8c7664',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A0522D',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#b0a090',
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#A0522D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
  },
  modalContentMobile: {
    width: '95%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#A0522D',
  },
  closeBtn: {
    padding: 4,
  },
  teacherInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fdf0e6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#A0522D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  modalTeacherInfo: {
    flex: 1,
  },
  modalTeacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e2520',
    marginBottom: 2,
  },
  modalTeacherId: {
    fontSize: 12,
    color: '#8c7664',
    marginBottom: 2,
  },
  modalTeacherDate: {
    fontSize: 11,
    color: '#A0522D',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e2520',
    marginBottom: 10,
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f0e6dc',
    backgroundColor: '#fff',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8c7664',
  },
  remarksInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#f0e6dc',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    padding: 12,
  },
  remarksInput: {
    flex: 1,
    fontSize: 14,
    color: '#2e2520',
    textAlignVertical: 'top',
    minHeight: 60,
    padding: 0,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f0ea',
    borderWidth: 1,
    borderColor: '#f0e6dc',
  },
  cancelButtonText: {
    color: '#8c7664',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#A0522D',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});