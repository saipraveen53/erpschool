import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator, Modal, TextInput, Alert, Platform } from "react-native";
import { BookOpen, Plus, Calendar, Clock, ChevronRight, Search, X, Users } from "lucide-react-native";
import { useState, useEffect, createElement } from "react";
import { rootApi } from "../../../utils/axiosInstance";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ExamsManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal state
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    examName: "",
    academicYear: new Date().getFullYear().toString(),
    startDate: "",
    endDate: ""
  });
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDate(Platform.OS === 'ios');
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, startDate: formatted });
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDate(Platform.OS === 'ios');
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, endDate: formatted });
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await rootApi.get('/api/all-exams');
      if (response.data) {
        // Handle both wrapped and direct array responses
        const examList = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setExams(examList);
      } else {
        setExams([]);
      }
    } catch (error) {
      console.error("Failed to fetch exams", error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async () => {
    if (!formData.examName || !formData.academicYear || !formData.startDate || !formData.endDate) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      setCreating(true);
      const newExamId = `EXM${Date.now()}`;
      const now = new Date().toISOString();
      const payload = {
        examId: newExamId,
        examName: formData.examName,
        academicYear: formData.academicYear,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: "CREATED",
        createdBy: "SUPER_ADMIN",
        updatedBy: "SUPER_ADMIN",
        createdAt: now,
        updatedAt: now
      };

      const response = await rootApi.post('/api/exams', payload);
      const createdExam = response.data || payload;
      
      setExams([createdExam, ...exams]);

      Alert.alert("Success", "Exam created successfully.");
      setCreateModalVisible(false);
      
      router.push(`/super-admin/exams/${createdExam.examId}` as any);
    } catch (error) {
      console.error("Failed to create exam:", error);
      Alert.alert("Error", "Failed to create exam. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if(isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { padding: isMobile ? 14 : 24, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: 16 }]}>
        <View style={{ flex: 1, marginBottom: isMobile ? 16 : 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <BookOpen size={24} color="#0369a1" />
            <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 26 }]}>Exam Management</Text>
          </View>
          <Text style={styles.headerSubtitle}>Create, schedule, and manage academic examinations.</Text>
        </View>

        <TouchableOpacity style={styles.createBtn} onPress={() => setCreateModalVisible(true)}>
          <Plus size={20} color="#fff" />
          <Text style={styles.createBtnText}>Create Exam</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0369a1" style={{ marginTop: 40 }} />
        ) : exams.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconCircle}>
              <BookOpen size={32} color="#0284c7" />
            </View>
            <Text style={styles.emptyTitle}>No Exams Found</Text>
            <Text style={styles.emptyText}>Get started by creating a new academic exam.</Text>
            <TouchableOpacity style={[styles.createBtn, { marginTop: 16 }]} onPress={() => setCreateModalVisible(true)}>
              <Text style={styles.createBtnText}>Create New Exam</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 }}>
            {exams.map((exam, idx) => (
              <View key={exam.examId || idx} style={{ width: isMobile ? "100%" : "33.33%", padding: 8 }}>
                <TouchableOpacity style={styles.examCard} onPress={() => router.push(`/super-admin/exams/${exam.examId}` as any)}>
                  <View style={styles.cardHeader}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{exam.status || 'CREATED'}</Text>
                    </View>
                    <Text style={styles.yearBadge}>{exam.academicYear}</Text>
                  </View>
                  
                  <Text style={styles.examName} numberOfLines={2}>{exam.examName}</Text>
                  
                  <View style={styles.dateRow}>
                    <Calendar size={14} color="#64748b" style={{ marginRight: 6 }} />
                    <Text style={styles.dateText}>{formatDate(exam.startDate)} - {formatDate(exam.endDate)}</Text>
                  </View>
                  
                  <View style={[styles.dateRow, { marginTop: 4 }]}>
                    <Users size={14} color="#64748b" style={{ marginRight: 6 }} />
                    <Text style={[styles.dateText, { flex: 1 }]} numberOfLines={1}>
                      {exam.assignedClassSectionIds && exam.assignedClassSectionIds.length > 0 
                        ? `Classes: ${exam.assignedClassSectionIds.join(", ")}`
                        : "No Classes Assigned"}
                    </Text>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <Text style={styles.viewDetailsText}>Configure & Schedule</Text>
                    <ChevronRight size={16} color="#0369a1" />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Exam Modal */}
      <Modal visible={createModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 450 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Exam</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Exam Name *</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.examName} 
                  onChangeText={t => setFormData({...formData, examName: t})} 
                  placeholder="e.g., Annual Exam 2026" 
                  placeholderTextColor="#94a3b8" 
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Academic Year *</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.academicYear} 
                  onChangeText={t => setFormData({...formData, academicYear: t})} 
                  placeholder="e.g., 2026" 
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8" 
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Start Date *</Text>
                  {Platform.OS === 'web' ? (
                    createElement('input', {
                      type: 'date',
                      value: formData.startDate,
                      onChange: (e: any) => setFormData({...formData, startDate: e.target.value}),
                      style: {
                        borderWidth: '1px',
                        borderColor: "#e2e8f0",
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '14px',
                        color: "#0f172a",
                        backgroundColor: "#f8fafc",
                        outline: 'none',
                        fontFamily: 'system-ui',
                        width: '100%',
                        boxSizing: 'border-box'
                      }
                    })
                  ) : (
                    <>
                      <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowStartDate(true)}>
                        <Text style={{ color: formData.startDate ? "#0f172a" : "#94a3b8" }}>
                          {formData.startDate || "YYYY-MM-DD"}
                        </Text>
                      </TouchableOpacity>
                      {showStartDate && (
                        <DateTimePicker
                          value={formData.startDate ? new Date(formData.startDate) : new Date()}
                          mode="date"
                          display="default"
                          onChange={onStartDateChange}
                        />
                      )}
                    </>
                  )}
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>End Date *</Text>
                  {Platform.OS === 'web' ? (
                    createElement('input', {
                      type: 'date',
                      value: formData.endDate,
                      onChange: (e: any) => setFormData({...formData, endDate: e.target.value}),
                      style: {
                        borderWidth: '1px',
                        borderColor: "#e2e8f0",
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '14px',
                        color: "#0f172a",
                        backgroundColor: "#f8fafc",
                        outline: 'none',
                        fontFamily: 'system-ui',
                        width: '100%',
                        boxSizing: 'border-box'
                      }
                    })
                  ) : (
                    <>
                      <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowEndDate(true)}>
                        <Text style={{ color: formData.endDate ? "#0f172a" : "#94a3b8" }}>
                          {formData.endDate || "YYYY-MM-DD"}
                        </Text>
                      </TouchableOpacity>
                      {showEndDate && (
                        <DateTimePicker
                          value={formData.endDate ? new Date(formData.endDate) : new Date()}
                          mode="date"
                          display="default"
                          onChange={onEndDateChange}
                        />
                      )}
                    </>
                  )}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreateExam} disabled={creating}>
              {creating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>Create Exam</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", justifyContent: "space-between" },
  headerTitle: { fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },
  
  createBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#E35336", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, justifyContent: 'center', shadowColor: "#E35336", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  createBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14, marginLeft: 8 },

  emptyStateContainer: { alignItems: "center", marginTop: 60, padding: 24, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E6D8D2', borderStyle: 'dashed' },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F5F5DC', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#A0522D', marginBottom: 8 },
  emptyText: { textAlign: "center", color: "#8A6B5D", fontSize: 14, maxWidth: 300 },

  examCard: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E6D8D2", padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: '#166534', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  yearBadge: { color: '#8A6B5D', fontSize: 12, fontWeight: '600' },
  
  examName: { fontSize: 18, fontWeight: 'bold', color: "#A0522D", marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5DC', padding: 8, borderRadius: 6, marginBottom: 16 },
  dateText: { fontSize: 13, color: '#705244', fontWeight: '500' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F5F5DC', paddingTop: 12 },
  viewDetailsText: { fontSize: 13, fontWeight: '600', color: '#A0522D' },
  
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5DC', padding: 10, borderRadius: 8 },
  actionBtnText: { color: '#A0522D', fontSize: 13, fontWeight: 'bold', marginLeft: 4 },
  
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D" },
  
  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#705244", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 8, padding: 12, fontSize: 15, color: "#A0522D", backgroundColor: "#F5F5DC", ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any },
  
  submitBtn: { backgroundColor: "#E35336", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
