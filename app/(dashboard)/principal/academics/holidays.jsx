import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, Modal, TextInput, ScrollView, useWindowDimensions } from 'react-native';
import { Calendar, Plus, X, Edit2, Trash2, ChevronLeft, ChevronRight, Gift, Info, AlertCircle, CheckCircle } from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';

export default function HolidaysCalendar() {
  const { width } = useWindowDimensions();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    fullDay: true
  });

  const isMobile = width < 768;

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if selected month/year is in the past
  const isPastMonth = () => {
    const today = new Date();
    const currentYearNow = today.getFullYear();
    const currentMonthNow = today.getMonth() + 1;
    
    if (currentYear < currentYearNow) return true;
    if (currentYear === currentYearNow && currentMonth < currentMonthNow) return true;
    return false;
  };

  // Check if selected month/year is current or future
  const isCurrentOrFutureMonth = () => {
    return !isPastMonth();
  };

  // Validate if date is in the past
  const isPastDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  // Fetch holidays
  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get(`/api/student/calender/${currentYear}/${currentMonth}`);
      setHolidays(res.data);
    } catch (err) {
      console.error("Error fetching holidays", err);
      Alert.alert('Error', 'Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  };

  // Create/Update holiday
  const saveHoliday = async () => {
    if (!formData.date || !formData.title.trim()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    // Past date validation
    if (isPastDate(formData.date)) {
      Alert.alert(
        'Invalid Date',
        'Cannot add holiday on a past date. Please select today or a future date.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Check for duplicate holiday on the same date
    const holidayExists = holidays.some(h => {
      const existingDate = new Date(h.date);
      const newDate = new Date(formData.date);
      return existingDate.getFullYear() === newDate.getFullYear() &&
             existingDate.getMonth() === newDate.getMonth() &&
             existingDate.getDate() === newDate.getDate();
    });
    
    if (holidayExists) {
      Alert.alert(
        'Duplicate Holiday',
        'A holiday is already scheduled for this date.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
       id: null,
        date: formData.date,
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullDay: true
      };
      
      await rootApi.post('/api/student/calender/holiday', payload);
      Alert.alert('Success', 'Holiday added successfully!');
      setModalVisible(false);
      resetForm();
      fetchHolidays();
    } catch (err) {
  console.error("Error saving holiday", err);

  const errorMessage =
    err?.response?.data?.message ||
    err?.message ||
    'Failed to save holiday';

  Alert.alert('Error', errorMessage);
} finally {
      setSubmitting(false);
    }
  };

  const openAddModal = () => {
    const today = getTodayDate();
    setFormData({
      date: today,
      title: '',
      description: '',
      fullDay: true
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      date: '',
      title: '',
      description: '',
      fullDay: true
    });
  };

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  useEffect(() => {
    fetchHolidays();
  }, [currentYear, currentMonth]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isTodayOrFuture = (dateString) => {
    return !isPastDate(dateString);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Holidays Calendar</Text>
          <Text style={styles.subtitle}>View and manage academic holidays</Text>
        </View>
        {/* Add button only for current or future months */}
        {isCurrentOrFutureMonth() && (
          <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
            <Plus size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add Holiday</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Month Navigator */}
      <View style={styles.navigator}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}>
          <ChevronLeft size={24} color="#A0522D" />
        </TouchableOpacity>
        <View style={styles.monthDisplay}>
          <Calendar size={20} color="#A0522D" />
          <Text style={styles.monthText}>{monthNames[currentMonth - 1]} {currentYear}</Text>
        </View>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}>
          <ChevronRight size={24} color="#A0522D" />
        </TouchableOpacity>
      </View>

      {/* Past Month Notice */}
      {isPastMonth() && (
        <View style={styles.pastNotice}>
          <AlertCircle size={16} color="#f44336" />
          <Text style={styles.pastNoticeText}>This month has passed. You cannot add or edit holidays for past months.</Text>
        </View>
      )}

      {/* Holidays List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#A0522D" />
          <Text style={styles.loaderText}>Loading holidays...</Text>
        </View>
      ) : holidays.length === 0 ? (
        <View style={styles.emptyState}>
          <Gift size={64} color="#e0d4c8" />
          <Text style={styles.emptyTitle}>No Holidays</Text>
          <Text style={styles.emptyText}>
            {isPastMonth() 
              ? 'No holidays were scheduled for this month' 
              : 'No holidays scheduled for this month'}
          </Text>
          {isCurrentOrFutureMonth() && (
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAddModal}>
              <Plus size={18} color="#fff" />
              <Text style={styles.emptyAddBtnText}>Add Holiday</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={holidays}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={[styles.holidayCard, isPastDate(item.date) && styles.pastHolidayCard]}>
              <View style={styles.holidayDate}>
                <Text style={styles.dateDay}>{new Date(item.date).getDate()}</Text>
                <Text style={styles.dateMonth}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}</Text>
                {isPastDate(item.date) && (
                  <View style={styles.pastBadge}>
                    <Text style={styles.pastBadgeText}>Past</Text>
                  </View>
                )}
              </View>
              <View style={styles.holidayInfo}>
                <Text style={styles.holidayTitle}>{item.title}</Text>
                <Text style={styles.holidayDesc} numberOfLines={2}>{item.description || 'No description'}</Text>
                <View style={styles.badgeContainer}>
                  {item.fullDay && (
                    <View style={styles.fullDayBadge}>
                      <Text style={styles.fullDayText}>Full Day</Text>
                    </View>
                  )}
                  {isTodayOrFuture(item.date) ? (
                    <View style={styles.upcomingBadge}>
                      <CheckCircle size={10} color="#4caf50" />
                      <Text style={styles.upcomingText}>Upcoming</Text>
                    </View>
                  ) : (
                    <View style={styles.expiredBadge}>
                      <AlertCircle size={10} color="#f44336" />
                      <Text style={styles.expiredText}>Expired</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* Add/Edit Holiday Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? '92%' : 500 }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Gift size={24} color="#A0522D" />
                <Text style={styles.modalTitle}>Add Holiday</Text>
              </View>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                resetForm();
              }} style={styles.closeBtn}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#b0a090"
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                />
                <Text style={styles.helperText}>Format: YYYY-MM-DD (e.g., 2026-12-25)</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Independence Day"
                  placeholderTextColor="#b0a090"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter description..."
                  placeholderTextColor="#b0a090"
                  multiline
                  numberOfLines={3}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>

            

              {formData.date && isPastDate(formData.date) && (
                <View style={styles.warningBox}>
                  <AlertCircle size={16} color="#f44336" />
                  <Text style={styles.warningText}>Warning: This date is in the past. Please select today or a future date.</Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.submitButton, formData.date && isPastDate(formData.date) && styles.disabledButton]} 
                  onPress={saveHoliday} 
                  disabled={submitting || (formData.date && isPastDate(formData.date))}
                >
                  {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitButtonText}>Add Holiday</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eaddcc', backgroundColor: '#FDF8F0' },
  title: { fontSize: 24, fontWeight: '700', color: '#A0522D' },
  subtitle: { fontSize: 13, color: '#8c7664', marginTop: 4 },
  addBtn: { backgroundColor: '#A0522D', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8, shadowColor: '#A0522D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  
  navigator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 16, paddingBottom: 16, backgroundColor: '#FDF8F0' },
  navBtn: { padding: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eaddcc', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  monthDisplay: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, borderWidth: 1, borderColor: '#eaddcc', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  monthText: { fontSize: 16, fontWeight: '600', color: '#A0522D' },
  
  pastNotice: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffebee', marginHorizontal: 20, marginBottom: 16, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#f44336' },
  pastNoticeText: { flex: 1, fontSize: 12, color: '#f44336', fontWeight: '500' },
  
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loaderText: { fontSize: 14, color: '#8c7664' },
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#A0522D', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#b0a090', textAlign: 'center' },
  emptyAddBtn: { backgroundColor: '#A0522D', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, gap: 8, marginTop: 8, shadowColor: '#A0522D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  emptyAddBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  
  listContainer: { padding: 20, paddingTop: 0, paddingBottom: 30 },
  
  holidayCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, padding: 16, borderWidth: 1, borderColor: '#f0e6dc', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  pastHolidayCard: { backgroundColor: '#fafafa', opacity: 0.8 },
  holidayDate: { alignItems: 'center', justifyContent: 'center', width: 70, height: 70, backgroundColor: '#fdf0e6', borderRadius: 16, marginRight: 14, position: 'relative' },
  dateDay: { fontSize: 28, fontWeight: '700', color: '#A0522D' },
  dateMonth: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  pastBadge: { position: 'absolute', bottom: -8, backgroundColor: '#f44336', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  pastBadgeText: { fontSize: 8, color: '#fff', fontWeight: '600' },
  holidayInfo: { flex: 1 },
  holidayTitle: { fontSize: 16, fontWeight: '700', color: '#2e2520', marginBottom: 4 },
  holidayDesc: { fontSize: 12, color: '#8c7664', lineHeight: 16, marginBottom: 6 },
  badgeContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  fullDayBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start' },
  fullDayText: { fontSize: 10, fontWeight: '600', color: '#4caf50' },
  upcomingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#e3f2fd', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  upcomingText: { fontSize: 10, fontWeight: '600', color: '#2196f3' },
  expiredBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ffebee', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  expiredText: { fontSize: 10, fontWeight: '600', color: '#f44336' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24, maxHeight: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#A0522D' },
  closeBtn: { padding: 4 },
  
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#2e2520', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#eaddcc', borderRadius: 12, padding: 12, fontSize: 14, color: '#2e2520', backgroundColor: '#fafafa' },
  textArea: { height: 80, textAlignVertical: 'top' },
  helperText: { fontSize: 11, color: '#bc9e82', marginTop: 6, marginLeft: 4 },
  
  warningBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffebee', padding: 12, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#f44336' },
  warningText: { fontSize: 12, color: '#f44336', flex: 1 },
  
  typeOptions: { flexDirection: 'row', gap: 12 },
  typeOption: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, backgroundColor: '#fff' },
  typeOptionActive: { backgroundColor: '#A0522D', borderColor: '#A0522D' },
  typeOptionText: { fontSize: 14, fontWeight: '600', color: '#666' },
  typeOptionTextActive: { color: '#fff' },
  
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: '#f5f0ea', borderWidth: 1, borderColor: '#eaddcc' },
  cancelButtonText: { color: '#8c7664', fontWeight: '600', fontSize: 14 },
  submitButton: { backgroundColor: '#A0522D' },
  disabledButton: { backgroundColor: '#d4c4b8', opacity: 0.6 },
  submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});