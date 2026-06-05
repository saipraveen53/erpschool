import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Plus,
  Calendar,
  X,
  CheckCircle,
  FileText,
  BookOpen,
  Eye,
  Users,
  Clock,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  createExamsApi, 
  addSubjectApi, 
  assignClassExamsApi,
  examsTimetableApi 
} from "@/app/utils/axiosInstance";
import DateTimePicker from '@react-native-community/datetimepicker';

const COLORS = {
  background: "#F4F8FB",
  card: "#FFFFFF",
  primary: "#24343D",
  accent: "#22C7E5",
  textLight: "#64748B",
  border: "#DCE7EF",
  white: "#FFFFFF",
  success: "#10B981",
  warning: "#F59E0B",
};

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [viewSubjectsVisible, setViewSubjectsVisible] = useState(false);
  const [assignClassModalVisible, setAssignClassModalVisible] = useState(false);
  const [timetableModalVisible, setTimetableModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [examSubjects, setExamSubjects] = useState<any[]>([]);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  
  // Form states
  const [examName, setExamName] = useState("");
  const [academicYear, setAcademicYear] = useState("2025");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("CREATED");
  const [createdBy, setCreatedBy] = useState("ADMIN");
  
  // Subject form states
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [passingMarks, setPassingMarks] = useState("40");
  
  // Timetable form states
  const [timetableClassId, setTimetableClassId] = useState("");
  const [timetableSubjectId, setTimetableSubjectId] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // Date picker
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showExamDatePicker, setShowExamDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());

  // Fetch exams on load
  useEffect(() => {
    fetchExams();
    fetchAvailableClasses();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await createExamsApi.get("/api/all-exams");
      if (response.data && Array.isArray(response.data)) {
        setExams(response.data);
      } else {
        setExams([
          { examId: "EXM001", examName: "First Term Exam", academicYear: "2025", startDate: "2025-06-15", endDate: "2025-06-25", status: "CREATED" },
          { examId: "EXM002", examName: "Second Term Exam", academicYear: "2025", startDate: "2025-09-10", endDate: "2025-09-20", status: "ONGOING" },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setExams([
        { examId: "EXM001", examName: "First Term Exam", academicYear: "2025", startDate: "2025-06-15", endDate: "2025-06-25", status: "CREATED" },
        { examId: "EXM002", examName: "Second Term Exam", academicYear: "2025", startDate: "2025-09-10", endDate: "2025-09-20", status: "ONGOING" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableClasses = async () => {
    try {
      const response = await assignClassExamsApi.get("/api/classes");
      if (response.data && Array.isArray(response.data)) {
        setAvailableClasses(response.data);
      } else {
        setAvailableClasses([
          { classSectionId: "CLS001", className: "5", section: "A" },
          { classSectionId: "CLS002", className: "5", section: "B" },
          { classSectionId: "CLS003", className: "6", section: "A" },
          { classSectionId: "CLS004", className: "6", section: "B" },
          { classSectionId: "CLS005", className: "7", section: "A" },
        ]);
      }
    } catch (error) {
      setAvailableClasses([
        { classSectionId: "CLS001", className: "5", section: "A" },
        { classSectionId: "CLS002", className: "5", section: "B" },
        { classSectionId: "CLS003", className: "6", section: "A" },
        { classSectionId: "CLS004", className: "6", section: "B" },
        { classSectionId: "CLS005", className: "7", section: "A" },
      ]);
    }
  };

  const fetchExamSubjects = async (examId: string) => {
    try {
      const response = await addSubjectApi.get(`/api/exams/${examId}/subjects`);
      setExamSubjects(response.data || []);
    } catch (error) {
      setExamSubjects([]);
    }
  };

  const handleCreateExam = async () => {
    if (!examName || !startDate || !endDate) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = { examName, academicYear, startDate, endDate, status, createdBy };
      const response = await createExamsApi.post("/api/exams", payload);
      Alert.alert("Success", "Exam created successfully");
      setModalVisible(false);
      resetForm();
      fetchExams();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!subjectId || !teacherId) {
      Alert.alert("Error", "Please select subject and teacher");
      return;
    }

    try {
      const payload = { subjectId, teacherId, maxMarks: parseInt(maxMarks), passingMarks: parseInt(passingMarks) };
      await addSubjectApi.post(`/api/exams/${selectedExam.examId}/subjects`, payload);
      Alert.alert("Success", "Subject added successfully");
      setSubjectModalVisible(false);
      resetSubjectForm();
      fetchExamSubjects(selectedExam.examId);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to add subject");
    }
  };

  const handleAssignClasses = async () => {
    if (selectedClassIds.length === 0) {
      Alert.alert("Error", "Please select at least one class");
      return;
    }

    try {
      setLoading(true);
      const payload = { classSectionIds: selectedClassIds };
      await assignClassExamsApi.post(`/api/exams/${selectedExam.examId}/classes`, payload);
      Alert.alert("Success", "Classes assigned successfully");
      setAssignClassModalVisible(false);
      setSelectedClassIds([]);
      fetchExams();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to assign classes");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleTimetable = async () => {
    if (!timetableClassId || !timetableSubjectId || !examDate || !startTime || !endTime) {
      Alert.alert("Error", "Please fill all timetable fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        examId: selectedExam.examId,
        classSectionId: timetableClassId,
        subjectId: timetableSubjectId,
        examDate: examDate,
        startTime: startTime,
        endTime: endTime,
      };
      const response = await examsTimetableApi.post("/api/exams/timetable", payload);
      Alert.alert("Success", "Timetable scheduled successfully");
      setTimetableModalVisible(false);
      resetTimetableForm();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to schedule timetable");
    } finally {
      setLoading(false);
    }
  };

  const toggleClassSelection = (classId: string) => {
    if (selectedClassIds.includes(classId)) {
      setSelectedClassIds(selectedClassIds.filter(id => id !== classId));
    } else {
      setSelectedClassIds([...selectedClassIds, classId]);
    }
  };

  const resetForm = () => {
    setExamName("");
    setAcademicYear("2025");
    setStartDate("");
    setEndDate("");
    setStatus("CREATED");
    setCreatedBy("ADMIN");
  };

  const resetSubjectForm = () => {
    setSubjectId("");
    setTeacherId("");
    setMaxMarks("100");
    setPassingMarks("40");
  };

  const resetTimetableForm = () => {
    setTimetableClassId("");
    setTimetableSubjectId("");
    setExamDate("");
    setStartTime("");
    setEndTime("");
  };

  const onStartDateChange = (event: any, date?: Date) => {
    setShowStartPicker(false);
    if (date) setStartDate(date.toISOString().split('T')[0]);
  };

  const onEndDateChange = (event: any, date?: Date) => {
    setShowEndPicker(false);
    if (date) setEndDate(date.toISOString().split('T')[0]);
  };

  const onExamDateChange = (event: any, date?: Date) => {
    setShowExamDatePicker(false);
    if (date) setExamDate(date.toISOString().split('T')[0]);
  };

  const onStartTimeChange = (event: any, time?: Date) => {
    setShowStartTimePicker(false);
    if (time) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const seconds = time.getSeconds().toString().padStart(2, '0');
      setStartTime(`${hours}:${minutes}:${seconds}`);
    }
  };

  const onEndTimeChange = (event: any, time?: Date) => {
    setShowEndTimePicker(false);
    if (time) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const seconds = time.getSeconds().toString().padStart(2, '0');
      setEndTime(`${hours}:${minutes}:${seconds}`);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "CREATED") return "#10B981";
    if (status === "ONGOING") return "#F59E0B";
    return "#6B7280";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Exams Management</Text>
          <Text style={styles.headerSubtitle}>Create and manage academic examinations</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add Exam</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>All Examinations</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.accent} />
        ) : exams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>No exams found</Text>
            <Text style={styles.emptySubtext}>Tap "Add Exam" to create your first exam</Text>
          </View>
        ) : (
          exams.map((exam) => (
            <View key={exam.examId} style={styles.examCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <FileText size={20} color={COLORS.white} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.examName}>{exam.examName}</Text>
                  <Text style={styles.examId}>ID: {exam.examId}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(exam.status) + "20" }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(exam.status) }]}>{exam.status}</Text>
                </View>
              </View>
              
              <View style={styles.cardDetails}>
                <Text style={styles.detailText}>Year: {exam.academicYear}</Text>
                <Text style={styles.detailText}>{exam.startDate} to {exam.endDate}</Text>
              </View>
              
              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.viewBtn]}
                  onPress={async () => {
                    setSelectedExam(exam);
                    await fetchExamSubjects(exam.examId);
                    setViewSubjectsVisible(true);
                  }}
                >
                  <Eye size={14} color={COLORS.white} />
                  <Text style={styles.actionBtnText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.addSubjectBtn]}
                  onPress={() => {
                    setSelectedExam(exam);
                    setSubjectModalVisible(true);
                  }}
                >
                  <Plus size={14} color={COLORS.white} />
                  <Text style={styles.actionBtnText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.assignClassBtn]}
                  onPress={() => {
                    setSelectedExam(exam);
                    setSelectedClassIds([]);
                    setAssignClassModalVisible(true);
                  }}
                >
                  <Users size={14} color={COLORS.white} />
                  <Text style={styles.actionBtnText}>Classes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.timetableBtn]}
                  onPress={() => {
                    setSelectedExam(exam);
                    resetTimetableForm();
                    setTimetableModalVisible(true);
                  }}
                >
                  <Clock size={14} color={COLORS.white} />
                  <Text style={styles.actionBtnText}>Schedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Exam Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Exam</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color={COLORS.textLight} /></TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.label}>Exam Name</Text>
              <TextInput style={styles.input} placeholder="Enter exam name" value={examName} onChangeText={setExamName} />
              
              <Text style={styles.label}>Academic Year</Text>
              <TextInput style={styles.input} placeholder="2025" value={academicYear} onChangeText={setAcademicYear} />
              
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowStartPicker(true)}>
                <Calendar size={20} color={COLORS.accent} />
                <Text style={styles.dateBtnText}>{startDate || "Select date"}</Text>
              </TouchableOpacity>
              
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowEndPicker(true)}>
                <Calendar size={20} color={COLORS.accent} />
                <Text style={styles.dateBtnText}>{endDate || "Select date"}</Text>
              </TouchableOpacity>
              
              <Text style={styles.label}>Status</Text>
              <TextInput style={styles.input} placeholder="CREATED" value={status} onChangeText={setStatus} />
              
              <Text style={styles.label}>Created By</Text>
              <TextInput style={styles.input} placeholder="ADMIN" value={createdBy} onChangeText={setCreatedBy} />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setModalVisible(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.createBtn]} onPress={handleCreateExam}><Text style={styles.createBtnText}>Create</Text></TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Subject Modal */}
      <Modal visible={subjectModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Subject</Text>
              <TouchableOpacity onPress={() => setSubjectModalVisible(false)}><X size={24} color={COLORS.textLight} /></TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.label}>Subject ID</Text>
              <TextInput style={styles.input} placeholder="SUB001" value={subjectId} onChangeText={setSubjectId} />
              
              <Text style={styles.label}>Teacher ID</Text>
              <TextInput style={styles.input} placeholder="TCH001" value={teacherId} onChangeText={setTeacherId} />
              
              <Text style={styles.label}>Max Marks</Text>
              <TextInput style={styles.input} placeholder="100" value={maxMarks} onChangeText={setMaxMarks} keyboardType="numeric" />
              
              <Text style={styles.label}>Passing Marks</Text>
              <TextInput style={styles.input} placeholder="40" value={passingMarks} onChangeText={setPassingMarks} keyboardType="numeric" />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setSubjectModalVisible(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.createBtn]} onPress={handleAddSubject}><Text style={styles.createBtnText}>Add</Text></TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Assign Classes Modal */}
      <Modal visible={assignClassModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Classes</Text>
              <TouchableOpacity onPress={() => setAssignClassModalVisible(false)}><X size={24} color={COLORS.textLight} /></TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.examInfoText}>Exam: {selectedExam?.examName}</Text>
              <Text style={styles.examInfoSubtext}>ID: {selectedExam?.examId}</Text>
              
              <Text style={styles.label}>Select Classes</Text>
              {availableClasses.map((cls) => (
                <TouchableOpacity
                  key={cls.classSectionId}
                  style={[
                    styles.classItem,
                    selectedClassIds.includes(cls.classSectionId) && styles.classItemSelected
                  ]}
                  onPress={() => toggleClassSelection(cls.classSectionId)}
                >
                  <Text style={[
                    styles.classItemText,
                    selectedClassIds.includes(cls.classSectionId) && styles.classItemTextSelected
                  ]}>
                    Class {cls.className} - {cls.section}
                  </Text>
                  {selectedClassIds.includes(cls.classSectionId) && (
                    <CheckCircle size={16} color={COLORS.accent} />
                  )}
                </TouchableOpacity>
              ))}
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setAssignClassModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.createBtn]} onPress={handleAssignClasses}>
                  <Text style={styles.createBtnText}>Assign</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Schedule Timetable Modal */}
      <Modal visible={timetableModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Timetable</Text>
              <TouchableOpacity onPress={() => setTimetableModalVisible(false)}><X size={24} color={COLORS.textLight} /></TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.examInfoText}>Exam: {selectedExam?.examName}</Text>
              <Text style={styles.examInfoSubtext}>ID: {selectedExam?.examId}</Text>
              
              <Text style={styles.label}>Class Section</Text>
              <TextInput 
                style={styles.input} 
                placeholder="CLS2026009" 
                value={timetableClassId} 
                onChangeText={setTimetableClassId} 
              />
              
              <Text style={styles.label}>Subject ID</Text>
              <TextInput 
                style={styles.input} 
                placeholder="SUB2026003" 
                value={timetableSubjectId} 
                onChangeText={setTimetableSubjectId} 
              />
              
              <Text style={styles.label}>Exam Date</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowExamDatePicker(true)}>
                <Calendar size={20} color={COLORS.accent} />
                <Text style={styles.dateBtnText}>{examDate || "Select date"}</Text>
              </TouchableOpacity>
              
              <Text style={styles.label}>Start Time</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowStartTimePicker(true)}>
                <Clock size={20} color={COLORS.accent} />
                <Text style={styles.dateBtnText}>{startTime || "HH:MM:SS"}</Text>
              </TouchableOpacity>
              
              <Text style={styles.label}>End Time</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowEndTimePicker(true)}>
                <Clock size={20} color={COLORS.accent} />
                <Text style={styles.dateBtnText}>{endTime || "HH:MM:SS"}</Text>
              </TouchableOpacity>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setTimetableModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.createBtn]} onPress={handleScheduleTimetable}>
                  <Text style={styles.createBtnText}>Schedule</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* View Subjects Modal */}
      <Modal visible={viewSubjectsVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Subjects for {selectedExam?.examName}</Text>
              <TouchableOpacity onPress={() => setViewSubjectsVisible(false)}><X size={24} color={COLORS.textLight} /></TouchableOpacity>
            </View>
            {examSubjects.length === 0 ? (
              <View style={styles.emptySubjects}>
                <BookOpen size={48} color={COLORS.border} />
                <Text style={styles.emptyText}>No subjects added</Text>
              </View>
            ) : (
              examSubjects.map((subj, idx) => (
                <View key={idx} style={styles.subjectCard}>
                  <Text style={styles.subjectName}>Subject: {subj.subjectId}</Text>
                  <Text style={styles.subjectDetail}>Teacher: {subj.teacherId}</Text>
                  <Text style={styles.subjectDetail}>Max Marks: {subj.maxMarks}</Text>
                  <Text style={styles.subjectDetail}>Passing: {subj.passingMarks}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </Modal>

      {/* Date and Time Pickers */}
      {showStartPicker && <DateTimePicker value={new Date()} mode="date" onChange={onStartDateChange} />}
      {showEndPicker && <DateTimePicker value={new Date()} mode="date" onChange={onEndDateChange} />}
      {showExamDatePicker && <DateTimePicker value={new Date()} mode="date" onChange={onExamDateChange} />}
      {showStartTimePicker && (
        <DateTimePicker 
          value={tempTime} 
          mode="time" 
          is24Hour={true}
          onChange={onStartTimeChange} 
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker 
          value={tempTime} 
          mode="time" 
          is24Hour={true}
          onChange={onEndTimeChange} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.white },
  headerSubtitle: { fontSize: 13, color: "#c7d2fe", marginTop: 4 },
  addButton: { backgroundColor: COLORS.accent, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  addButtonText: { color: COLORS.white, fontWeight: "600", fontSize: 14 },
  content: { padding: 16, paddingBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.primary, marginBottom: 16 },
  examCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.accent, justifyContent: "center", alignItems: "center", marginRight: 12 },
  cardInfo: { flex: 1 },
  examName: { fontSize: 16, fontWeight: "700", color: COLORS.primary },
  examId: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "600" },
  cardDetails: { flexDirection: "row", gap: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border, marginBottom: 12 },
  detailText: { fontSize: 12, color: COLORS.textLight },
  cardActions: { 
    flexDirection: "row", 
    justifyContent: "flex-end",
    gap: 6, 
    paddingTop: 8, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.border 
  },
  actionBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingHorizontal: 10,
    paddingVertical: 5, 
    borderRadius: 5, 
    gap: 3,
    minWidth: 55,
  },
  viewBtn: { backgroundColor: COLORS.primary },
  addSubjectBtn: { backgroundColor: COLORS.accent },
  assignClassBtn: { backgroundColor: "#22C7E5" },
  timetableBtn: { backgroundColor: "#22C7E5" },
  actionBtnText: { color: COLORS.white, fontSize: 10, fontWeight: "600" },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: "600", color: COLORS.textLight, marginTop: 16 },
  emptySubtext: { fontSize: 13, color: COLORS.textLight, marginTop: 8, textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, width: "90%", maxHeight: "85%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: COLORS.primary },
  label: { fontSize: 14, fontWeight: "600", color: COLORS.primary, marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, backgroundColor: COLORS.background, marginBottom: 4 },
  dateBtn: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: COLORS.background, marginBottom: 4 },
  dateBtnText: { fontSize: 14, color: COLORS.primary, flex: 1 },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 24, marginBottom: 10 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  cancelBtn: { backgroundColor: COLORS.border },
  cancelBtnText: { color: COLORS.primary, fontWeight: "600" },
  createBtn: { backgroundColor: COLORS.accent },
  createBtnText: { color: COLORS.white, fontWeight: "600" },
  emptySubjects: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  subjectCard: { backgroundColor: COLORS.background, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  subjectName: { fontSize: 14, fontWeight: "600", color: COLORS.primary, marginBottom: 6 },
  subjectDetail: { fontSize: 12, color: COLORS.textLight, marginBottom: 2 },
  examInfoText: { fontSize: 16, fontWeight: "600", color: COLORS.primary, marginBottom: 4 },
  examInfoSubtext: { fontSize: 12, color: COLORS.textLight, marginBottom: 16 },
  classItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  classItemSelected: { 
    backgroundColor: COLORS.accent + "20",
    borderColor: COLORS.accent,
  },
  classItemText: { 
    fontSize: 14, 
    color: COLORS.primary,
    flex: 1,
  },
  classItemTextSelected: { 
    color: COLORS.accent, 
    fontWeight: "600" 
  },
});