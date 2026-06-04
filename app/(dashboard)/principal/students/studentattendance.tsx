import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, ScrollView, useWindowDimensions } from 'react-native';
import { Calendar, CheckCircle, XCircle, Users, ChevronDown, ChevronUp, Clock } from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';

export default function StudentAttendance() {
  const { width } = useWindowDimensions();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isMobile = width < 768;

  // Fetch classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/class-sections');
      setClasses(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance by class and date
  const fetchAttendance = async () => {
    if (!selectedClass) return;
    
    setLoading(true);
    try {
      const res = await rootApi.get(`/api/student/attendance/class/${selectedClass.classSectionId}/date/${selectedDate}`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle attendance status
  const toggleAttendance = async (studentId, currentStatus) => {
    setUpdating(true);
    try {
      const newStatus = !currentStatus;
      await rootApi.post(`/api/student/attendance/mark`, {
        studentId,
        classSectionId: selectedClass.classSectionId,
        date: selectedDate,
        status: newStatus
      });
      
      // Update local state
      setStudents(prev => prev.map(s => 
        s.studentId === studentId ? { ...s, present: newStatus } : s
      ));
    } catch (err) {
      Alert.alert('Error', 'Failed to update attendance');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const stats = {
    present: students.filter(s => s.present).length,
    absent: students.filter(s => !s.present).length,
    total: students.length,
    percentage: students.length ? ((students.filter(s => s.present).length / students.length) * 100).toFixed(1) : 0
  };

  return (
    <ScrollView style={styles.container} showsVerticalSc
    
    Indicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Student Attendance</Text>
        <Text style={styles.subtitle}>Mark and track daily attendance</Text>
      </View>

      {/* Class Selector */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Select Class</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowClassDropdown(!showClassDropdown)}
        >
          <View style={styles.dropdownLeft}>
            <Users size={18} color="#A0522D" />
            <Text style={styles.dropdownText}>
              {selectedClass ? `${selectedClass.className}-${selectedClass.section}` : 'Choose a class'}
            </Text>
          </View>
          {showClassDropdown ? <ChevronUp size={18} color="#A0522D" /> : <ChevronDown size={18} color="#A0522D" />}
        </TouchableOpacity>

        {showClassDropdown && (
          <View style={styles.dropdownList}>
            {classes.map(cls => (
              <TouchableOpacity
                key={cls.classSectionId}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedClass(cls);
                  setShowClassDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Class {cls.className}-{cls.section}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Date Selector */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Select Date</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowDatePicker(!showDatePicker)}
        >
          <View style={styles.dropdownLeft}>
            <Calendar size={18} color="#A0522D" />
            <Text style={styles.dropdownText}>{selectedDate}</Text>
          </View>
          {showDatePicker ? <ChevronUp size={18} color="#A0522D" /> : <ChevronDown size={18} color="#A0522D" />}
        </TouchableOpacity>

        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <ScrollView style={styles.dateList}>
              {[...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                return (
                  <TouchableOpacity
                    key={dateStr}
                    style={[styles.dateItem, selectedDate === dateStr && styles.dateItemActive]}
                    onPress={() => {
                      setSelectedDate(dateStr);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={[styles.dateItemText, selectedDate === dateStr && styles.dateItemTextActive]}>
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Statistics Cards */}
      {selectedClass && students.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
            <CheckCircle size={24} color="#4caf50" />
            <Text style={[styles.statNumber, { color: '#4caf50' }]}>{stats.present}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#ffebee' }]}>
            <XCircle size={24} color="#f44336" />
            <Text style={[styles.statNumber, { color: '#f44336' }]}>{stats.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
            <Users size={24} color="#2196f3" />
            <Text style={[styles.statNumber, { color: '#2196f3' }]}>{stats.percentage}%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
        </View>
      )}

      {/* Student List */}
      {selectedClass && (
        <View style={styles.studentListCard}>
          <Text style={styles.sectionTitle}>
            Students - Class {selectedClass.className}-{selectedClass.section}
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#A0522D" style={styles.loader} />
          ) : students.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color="#e0d4c8" />
              <Text style={styles.emptyText}>No attendance records found</Text>
              <Text style={styles.emptySubtext}>Select a date to mark attendance</Text>
            </View>
          ) : (
            students.map((student, index) => (
              <View key={student.studentId || index} style={styles.studentRow}>
                <View style={styles.studentInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{student.fullName?.[0] || 'S'}</Text>
                  </View>
                  <View>
                    <Text style={styles.studentName}>{student.fullName || student.name}</Text>
                    <Text style={styles.studentRoll}>Roll No: {student.studentId || '-'}</Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={[styles.statusBtn, student.present && styles.presentBtn]}
                  onPress={() => toggleAttendance(student.studentId, student.present)}
                  disabled={updating}
                >
                  {student.present ? (
                    <CheckCircle size={20} color="#fff" />
                  ) : (
                    <XCircle size={20} color="#fff" />
                  )}
                  <Text style={styles.statusBtnText}>
                    {student.present ? 'Present' : 'Absent'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F0' },
  header: { padding: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: '700', color: '#A0522D' },
  subtitle: { fontSize: 14, color: '#8c7664', marginTop: 4 },
  
  card: { backgroundColor: '#fff', margin: 16, marginBottom: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#f0e6dc', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#2e2520', marginBottom: 12 },
  
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, padding: 12, backgroundColor: '#fafafa' },
  dropdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropdownText: { fontSize: 14, color: '#2e2520' },
  dropdownList: { marginTop: 8, borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, backgroundColor: '#fff', maxHeight: 200 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0e6dc' },
  dropdownItemText: { fontSize: 14, color: '#2e2520' },
  
  datePickerContainer: { marginTop: 8, borderWidth: 1, borderColor: '#eaddcc', borderRadius: 10, backgroundColor: '#fff', maxHeight: 250 },
  dateList: { maxHeight: 250 },
  dateItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0e6dc' },
  dateItemActive: { backgroundColor: '#A0522D' },
  dateItemText: { fontSize: 14, color: '#2e2520' },
  dateItemTextActive: { color: '#fff' },
  
  statsContainer: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', gap: 6 },
  statNumber: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 12, color: '#666', fontWeight: '500' },
  
  studentListCard: { backgroundColor: '#fff', margin: 16, marginTop: 0, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#f0e6dc' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2e2520', marginBottom: 16 },
  
  studentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0e6dc' },
  studentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fdf0e6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '600', color: '#A0522D' },
  studentName: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  studentRoll: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  
  statusBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f44336' },
  presentBtn: { backgroundColor: '#4caf50' },
  statusBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  
  loader: { marginVertical: 40 },
  emptyState: { alignItems: 'center', padding: 40, gap: 12 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#8c7664' },
  emptySubtext: { fontSize: 13, color: '#bc9e82', textAlign: 'center' },
});