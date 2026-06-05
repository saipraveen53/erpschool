import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Alert, useWindowDimensions, Platform, Switch } from "react-native";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Info } from "lucide-react-native";
import { useState, useEffect } from "react";
import { rootApi } from "../../../utils/axiosInstance";

const HOLIDAY_BASE_URL = "http://192.168.88.20:8081";

export default function HolidaysManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [editingId, setEditingId] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDay: true
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await rootApi.get(`${HOLIDAY_BASE_URL}/api/student/calender/${year}/${month}`);
      if (response.data) {
        setHolidays(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [year, month]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(year, currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  // Calendar calculations
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 (Sun) to 6 (Sat)
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const openDateModal = (day: number) => {
    const dStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const existing = holidays.find(h => h.date === dStr);
    
    setSelectedDateStr(dStr);
    if (existing) {
      setEditingId(existing.id || 0);
      setFormData({
        title: existing.title || "",
        description: existing.description || "",
        fullDay: existing.fullDay !== false
      });
    } else {
      setEditingId(0);
      setFormData({
        title: "",
        description: "",
        fullDay: true
      });
    }
    setModalVisible(true);
  };

  const handleSaveHoliday = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a holiday title.");
      return;
    }
    try {
      setSaving(true);
      const payload: any = {
        date: selectedDateStr,
        title: formData.title,
        description: formData.description,
        fullDay: formData.fullDay
      };

      await rootApi.post(`/api/student/calender/holiday`, payload);
      setModalVisible(false);
      fetchHolidays();
    } catch (error) {
      console.error("Failed to save holiday:", error);
      Alert.alert("Error", "Failed to save holiday.");
    } finally {
      setSaving(false);
    }
  };

  const renderCalendar = () => {
    const cells = [];
    // empty cells before 1st day
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.dayCellEmpty} />);
    }
    
    // actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Get current date string for "today" check
      const todayDate = new Date();
      const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
      
      const isToday = todayStr === dStr;
      const holiday = holidays.find(h => h.date === dStr);

      cells.push(
        <TouchableOpacity 
          key={`day-${day}`} 
          style={[
            styles.dayCell, 
            isMobile ? { height: 70 } : { height: 100 },
            isToday && styles.dayCellToday, 
            holiday && styles.dayCellHoliday
          ]} 
          onPress={() => openDateModal(day)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dayText, isToday && styles.dayTextToday, holiday && styles.dayTextHoliday]}>{day}</Text>
          {holiday && (
            <View style={[styles.holidayBadge, isMobile && { paddingHorizontal: 2, paddingVertical: 1 }]}>
              <Text style={styles.holidayBadgeText} numberOfLines={2}>{holiday.title}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    // fill remaining to complete rows of 7
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) {
        cells.push(<View key={`empty-end-${i}`} style={styles.dayCellEmpty} />);
      }
    }

    return cells;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Academic Calendar</Text>
          <Text style={styles.headerSubtitle}>View and manage school holidays and important dates.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: 20 }}>
        
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeaderRow}>
            <Text style={styles.monthYearText}>{monthNames[month - 1]} {year}</Text>
            <View style={styles.monthNavigation}>
              <TouchableOpacity style={styles.navButton} onPress={() => changeMonth(-1)}>
                <ChevronLeft size={20} color="#78716C" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={() => { setCurrentDate(new Date()) }}>
                <Text style={styles.todayBtnText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={() => changeMonth(1)}>
                <ChevronRight size={20} color="#78716C" />
              </TouchableOpacity>
            </View>
          </View>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#E35336" />
            </View>
          )}

          <View style={styles.daysHeader}>
            {dayNames.map((d, i) => (
              <View key={`dh-${i}`} style={styles.dayHeaderCell}>
                <Text style={styles.dayHeaderText}>{d}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {renderCalendar()}
          </View>
        </View>

      </ScrollView>

      {/* View/Edit Holiday Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 400 }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <CalendarIcon size={20} color="#E35336" />
                <Text style={styles.modalTitle}>{editingId ? "Edit Holiday" : "Add Holiday"}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#A8A29E" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateLabelContainer}>
              <Text style={styles.dateLabel}>Date:</Text>
              <Text style={styles.dateValue}>{selectedDateStr}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Holiday Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(t) => setFormData({ ...formData, title: t })}
                placeholder="E.g., Summer Break"
                placeholderTextColor="#A8A29E"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                value={formData.description}
                onChangeText={(t) => setFormData({ ...formData, description: t })}
                placeholder="Details about the holiday..."
                placeholderTextColor="#A8A29E"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Day Holiday?</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Switch 
                  value={formData.fullDay} 
                  onValueChange={(val) => setFormData({ ...formData, fullDay: val })}
                  trackColor={{ false: '#E6D8D2', true: '#E35336' }}
                  thumbColor={'#fff'}
                />
                <Text style={{ marginLeft: 8, fontSize: 15, color: '#44403C' }}>
                  {formData.fullDay ? "Yes" : "No (Half Day)"}
                </Text>
              </View>
            </View>

            <View style={styles.btnGroup}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSaveHoliday} 
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", zIndex: 100, elevation: 5, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },
  
  calendarCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E6D8D2", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, position: 'relative' },
  calendarHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  monthYearText: { fontSize: 20, fontWeight: "bold", color: "#A0522D" },
  monthNavigation: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navButton: { padding: 8, borderRadius: 8, backgroundColor: "#F5F5DC", alignItems: 'center', justifyContent: 'center' },
  todayBtnText: { fontSize: 13, fontWeight: "600", color: "#A0522D" },
  
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },

  daysHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: "#E6D8D2", paddingBottom: 8, marginBottom: 8 },
  dayHeaderCell: { flex: 1, alignItems: 'center' },
  dayHeaderText: { fontSize: 13, fontWeight: "600", color: "#8A6B5D", textTransform: 'uppercase' },

  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCellEmpty: { width: '14.28%', aspectRatio: 1 },
  dayCell: { width: '14.28%', padding: 4, borderTopWidth: 1, borderTopColor: 'transparent' },
  dayCellToday: { backgroundColor: '#F5E6DF', borderRadius: 8 },
  dayCellHoliday: { backgroundColor: '#FEF3C7', borderRadius: 8, borderWidth: 1, borderColor: '#FDE68A' },
  
  dayText: { fontSize: 14, fontWeight: "500", color: "#705244", textAlign: 'center', marginBottom: 4 },
  dayTextToday: { color: "#E35336", fontWeight: "bold" },
  dayTextHoliday: { color: "#B45309", fontWeight: "bold" },
  
  holidayBadge: { backgroundColor: '#E35336', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, alignSelf: 'center', width: '100%' },
  holidayBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D" },
  
  dateLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F5F5DC', padding: 12, borderRadius: 8, marginBottom: 20 },
  dateLabel: { fontSize: 14, color: '#8A6B5D', fontWeight: '500' },
  dateValue: { fontSize: 14, color: "#A0522D", fontWeight: 'bold' },

  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#705244", marginBottom: 6 },
  helpText: { fontSize: 12, color: '#A8A29E', marginTop: 2 },
  input: { borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 8, padding: 12, fontSize: 15, color: "#A0522D", backgroundColor: "#F5F5DC", ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any },
  
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#E6D8D2', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#E35336', borderColor: '#E35336' },
  checkboxLabel: { fontSize: 14, color: '#705244', fontWeight: '500' },

  btnGroup: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: '#F5F5DC', alignItems: 'center' },
  cancelBtnText: { color: '#8A6B5D', fontWeight: '600', fontSize: 15 },
  saveBtn: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: '#E35336', alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
