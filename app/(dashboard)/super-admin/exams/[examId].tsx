import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator, Modal, TextInput, Alert, Platform } from "react-native";
import { BookOpen, Plus, Calendar, Clock, ChevronLeft, Search, X, Users, CheckCircle, FileText, User, Send } from "lucide-react-native";
import { useState, useEffect, createElement } from "react";
import { rootApi } from "../../../utils/axiosInstance";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ExamDetails() {
  const { examId } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"classes" | "subjects" | "timetable" | "marks" | "publish" | "halltickets">("classes");


  const [classModalVisible, setClassModalVisible] = useState(false);
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [timetableModalVisible, setTimetableModalVisible] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [classSections, setClassSections] = useState<any[]>([]);
  const [assignClassDropdown, setAssignClassDropdown] = useState(false);
  const [timetableClassDropdown, setTimetableClassDropdown] = useState(false);
  const [examDetails, setExamDetails] = useState<any>(null);
  const [assignedClasses, setAssignedClasses] = useState<any[]>([]);

  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  const [examMarks, setExamMarks] = useState<any[]>([]);
  const [marksLoading, setMarksLoading] = useState(false);
  const [marksFilterSubject, setMarksFilterSubject] = useState("");

  const fetchMarks = async () => {
    try {
      setMarksLoading(true);
      const res = await rootApi.get(`/api/exams/${examId}/marks`);
      if (res.data) setExamMarks(res.data);
    } catch (e) {
      console.error("Failed to fetch marks", e);
    } finally {
      setMarksLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "marks") {
      fetchMarks();
    }
  }, [activeTab]);
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [teachers, setTeachers] = useState<any[]>([]);
  const [teacherDropdown, setTeacherDropdown] = useState(false);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [addSubjectDropdown, setAddSubjectDropdown] = useState(false);
  const [timetableSubjectDropdown, setTimetableSubjectDropdown] = useState(false);
  const [examSubjects, setExamSubjects] = useState<any[]>([]);
  const [examTimetable, setExamTimetable] = useState<any[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await rootApi.get('/api/student/class-sections');
        if (response.data) setClassSections(response.data);

        const teacherRes = await rootApi.get('/api/student/teacher/all');
        if (teacherRes.data) {
          const tData = Array.isArray(teacherRes.data) ? teacherRes.data : (teacherRes.data.data || []);
          const fetchedTeachers = tData.map((t: any) => ({
            id: t.teacherId || t.id,
            name: t.teacherName || t.name || t.firstName || "Unknown Teacher"
          }));
          setTeachers(fetchedTeachers);
        }

        const subjectRes = await rootApi.get('/api/student/subject/allSubjects');
        if (subjectRes.data) setAllSubjects(subjectRes.data);


        const allExamsRes = await rootApi.get('/api/all-exams');
        if (allExamsRes.data && Array.isArray(allExamsRes.data)) {
          const examData = allExamsRes.data.find((e: any) => e.examId === examId);
          if (examData) {
            setExamDetails(examData);
            if (examData.assignedClassSectionIds && Array.isArray(examData.assignedClassSectionIds) && response.data) {
              const assigned = response.data.filter((c: any) => examData.assignedClassSectionIds.includes(c.classSectionId));
              setAssignedClasses(assigned);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchClasses();
  }, []);

  // Form states
  const [classSectionId, setClassSectionId] = useState("");

  const [publishClassId, setPublishClassId] = useState("");
  const [publishDropdown, setPublishDropdown] = useState(false);

  const handlePublish = async () => {
    if (!publishClassId) return Alert.alert("Error", "Select a Class Section to publish results.");
    try {
      setProcessing(true);
      await rootApi.put(`/api/exams/${examId}/publish/${publishClassId}`);
      Alert.alert('Success', 'Results calculated and published successfully.');
      setPublishClassId("");
    } catch (error) {
      Alert.alert('Error', 'Failed to publish results');
    } finally {
      setProcessing(false);
    }
  };

  const [htClassId, setHtClassId] = useState("");
  const [hallTickets, setHallTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [htDropdown, setHtDropdown] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!htClassId) return;
      setLoadingTickets(true);
      try {
        const res = await rootApi.get(`/api/exam/${examId}/class-section/${htClassId}`);
        if (res.data) setHallTickets(res.data);
      } catch (e) {
        setHallTickets([]);
      } finally {
        setLoadingTickets(false);
      }
    };
    if (activeTab === "halltickets" && htClassId) {
      fetchTickets();
    }
  }, [htClassId, activeTab, examId]);

  const [subjectForm, setSubjectForm] = useState({
    subjectId: "",
    teacherId: "",
    maxMarks: "100",
    passingMarks: "40"
  });

  const [timetableForm, setTimetableForm] = useState({
    classSectionId: "",
    subjectId: "",
    examDate: "",
    startTime: "",
    endTime: ""
  });

  const [showExamDate, setShowExamDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const onExamDateChange = (event: any, selectedDate?: Date) => {
    setShowExamDate(Platform.OS === 'ios');
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setTimetableForm({ ...timetableForm, examDate: formatted });
    }
  };

  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTime(Platform.OS === 'ios');
    if (selectedDate) {
      const hh = selectedDate.getHours().toString().padStart(2, '0');
      const mm = selectedDate.getMinutes().toString().padStart(2, '0');
      setTimetableForm({ ...timetableForm, startTime: `${hh}:${mm}` });
    }
  };

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTime(Platform.OS === 'ios');
    if (selectedDate) {
      const hh = selectedDate.getHours().toString().padStart(2, '0');
      const mm = selectedDate.getMinutes().toString().padStart(2, '0');
      setTimetableForm({ ...timetableForm, endTime: `${hh}:${mm}` });
    }
  };

  const handleAssignClass = async () => {
    if (!classSectionId) return Alert.alert("Error", "Enter a Class Section ID.");

    try {
      setProcessing(true);
      await rootApi.post(`/api/exams/${examId}/classes`, {
        classSectionIds: [classSectionId]
      });
      const newlyAssigned = classSections.find(c => c.classSectionId === classSectionId);
      if (newlyAssigned) setAssignedClasses([...assignedClasses, newlyAssigned]);
      Alert.alert("Success", "Class assigned successfully.");
      setClassModalVisible(false);
      setClassSectionId("");
    } catch (error) {
      Alert.alert("Error", "Failed to assign class.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddSubject = async () => {
    if (!subjectForm.subjectId || !subjectForm.maxMarks || !subjectForm.passingMarks) {
      return Alert.alert("Error", "Fill all required fields.");
    }

    try {
      setProcessing(true);
      const payload = {
        subjectId: subjectForm.subjectId,
        teacherId: subjectForm.teacherId || "N/A",
        maxMarks: Number(subjectForm.maxMarks),
        passingMarks: Number(subjectForm.passingMarks)
      };
      await rootApi.post(`/api/exams/${examId}/subjects`, payload);
      setExamSubjects([...examSubjects, payload]);
      Alert.alert("Success", "Subject added successfully.");
      setSubjectModalVisible(false);
      setSubjectForm({ subjectId: "", teacherId: "", maxMarks: "100", passingMarks: "40" });
    } catch (error) {
      Alert.alert("Error", "Failed to add subject.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const fetchStudentsForClass = async (classSectionId: string) => {
    if (expandedClassId === classSectionId) {
      setExpandedClassId(null);
      return;
    }
    try {
      setExpandedClassId(classSectionId);
      setLoadingStudents(true);
      const res = await rootApi.get(`/api/exam/${examId}/class-section/${classSectionId}`);
      if (res.data) {
        setClassStudents(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch class students:", e);
      Alert.alert("Error", "Could not fetch students for this class.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleScheduleTimetable = async () => {
    if (!timetableForm.classSectionId || !timetableForm.subjectId || !timetableForm.examDate || !timetableForm.startTime || !timetableForm.endTime) {
      return Alert.alert("Error", "Fill all required fields.");
    }

    try {
      setProcessing(true);

      const formatTime = (t: string) => {
        if (!t) return "";
        const parts = t.split(":");
        if (parts.length === 2) {
          return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
        }
        return t;
      };

      const formatDateStr = (d: string) => {
        if (!d) return "";
        const parts = d.split("-");
        if (parts.length === 3) {
          return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
        }
        return d;
      };

      const payload = {
        examId,
        classSectionId: timetableForm.classSectionId,
        subjectId: timetableForm.subjectId,
        examDate: formatDateStr(timetableForm.examDate),
        startTime: formatTime(timetableForm.startTime),
        endTime: formatTime(timetableForm.endTime)
      };
      await rootApi.post(`/api/exams/timetable`, payload);
      setExamTimetable([...examTimetable, payload]);
      Alert.alert("Success", "Timetable scheduled successfully.");
      setTimetableModalVisible(false);
      setTimetableForm({ classSectionId: "", subjectId: "", examDate: "", startTime: "", endTime: "" });
    } catch (error) {
      Alert.alert("Error", "Failed to schedule timetable.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={20} color="#64748b" />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.examIdTag}>ID: {examId} {examDetails?.status ? `• ${examDetails.status}` : ''}</Text>
          <Text style={styles.headerTitle}>{examDetails?.examName || "Exam Configuration"}</Text>
          <Text style={styles.headerSubtitle}>
            {examDetails ? `Academic Year: ${examDetails.academicYear} | ${examDetails.startDate} to ${examDetails.endDate}` : "Manage classes, subjects, and timetables for this exam."}
          </Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "classes" && styles.tabBtnActive]}
            onPress={() => setActiveTab("classes")}
          >
            <Users size={16} color={activeTab === "classes" ? "#0284c7" : "#64748b"} />
            <Text style={[styles.tabText, activeTab === "classes" && styles.tabTextActive]}>Assigned Classes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "subjects" && styles.tabBtnActive]}
            onPress={() => setActiveTab("subjects")}
          >
            <BookOpen size={16} color={activeTab === "subjects" ? "#0284c7" : "#64748b"} />
            <Text style={[styles.tabText, activeTab === "subjects" && styles.tabTextActive]}>Exam Subjects</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "timetable" && styles.tabBtnActive]}
            onPress={() => setActiveTab("timetable")}
          >
            <Calendar size={16} color={activeTab === "timetable" ? "#0284c7" : "#64748b"} />
            <Text style={[styles.tabText, activeTab === "timetable" && styles.tabTextActive]}>Timetable</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "marks" && styles.tabBtnActive]}
            onPress={() => setActiveTab("marks")}
          >
            <FileText size={16} color={activeTab === "marks" ? "#0284c7" : "#64748b"} />
            <Text style={[styles.tabText, activeTab === "marks" && styles.tabTextActive]}>Marks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "publish" && styles.tabBtnActive]}
            onPress={() => setActiveTab("publish")}
          >
            <Send size={16} color={activeTab === "publish" ? "#0284c7" : "#64748b"} />
            <Text style={[styles.tabText, activeTab === "publish" && styles.tabTextActive]}>Publish</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "halltickets" && styles.tabBtnActive]}
            onPress={() => setActiveTab("halltickets")}
          >
            <User size={16} color={activeTab === "halltickets" ? "#0284c7" : "#64748b"} />
            <Text style={[styles.tabText, activeTab === "halltickets" && styles.tabTextActive]}>Hall Tickets</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {activeTab === "classes" && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Classes Assigned</Text>
                <Text style={styles.sectionSubtitle}>Attach classes that will take this exam.</Text>
              </View>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setClassModalVisible(true)}>
                <Plus size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Assign Class</Text>
              </TouchableOpacity>
            </View>
            {assignedClasses.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No classes assigned yet. Click 'Assign Class' to start.</Text>
              </View>
            ) : (
              <View style={{ padding: 16 }}>
                {assignedClasses.map((cls, idx) => (
                  <View key={idx} style={{ borderBottomWidth: 1, borderBottomColor: '#F5F5DC' }}>
                    <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckCircle size={16} color="#E35336" style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 15, color: '#A0522D', fontWeight: '500' }}>{cls.className} - {cls.section}</Text>
                      </View>
                      <TouchableOpacity
                        style={{ backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}
                        onPress={() => fetchStudentsForClass(cls.classSectionId)}
                      >
                        <Text style={{ fontSize: 12, color: '#0369a1', fontWeight: '600' }}>
                          {expandedClassId === cls.classSectionId ? "Hide Students" : "View Students"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {expandedClassId === cls.classSectionId && (
                      <View style={{ padding: 12, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: '#e2e8f0' }}>
                        {loadingStudents ? (
                          <ActivityIndicator size="small" color="#0284c7" />
                        ) : classStudents.length === 0 ? (
                          <Text style={{ color: '#64748b', fontSize: 13 }}>No students found for this class.</Text>
                        ) : (
                          classStudents.map((stu, sIdx) => (
                            <TouchableOpacity
                              key={sIdx}
                              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: sIdx === classStudents.length - 1 ? 0 : 1, borderBottomColor: '#e2e8f0' }}
                              onPress={() => router.push(`/super-admin/reports?studentId=${stu.studentId}`)}
                            >
                              <User size={14} color="#64748b" style={{ marginRight: 8 }} />
                              <View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#334155' }}>{stu.studentName}</Text>
                                <Text style={{ fontSize: 12, color: '#94a3b8' }}>ID: {stu.studentId} {stu.rollNumber ? `• Roll No: ${stu.rollNumber}` : ''}</Text>
                              </View>
                            </TouchableOpacity>
                          ))
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === "subjects" && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Exam Subjects</Text>
                <Text style={styles.sectionSubtitle}>Add subjects to be tested in this exam.</Text>
              </View>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setSubjectModalVisible(true)}>
                <Plus size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Add Subject</Text>
              </TouchableOpacity>
            </View>
            {examSubjects.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No subjects added yet. Click 'Add Subject' to start.</Text>
              </View>
            ) : (
              <View style={{ padding: 16 }}>
                {examSubjects.map((sub, idx) => (
                  <View key={idx} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5DC', flexDirection: 'row', alignItems: 'center' }}>
                    <BookOpen size={16} color="#E35336" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={{ fontSize: 15, color: '#A0522D', fontWeight: '500' }}>
                        {allSubjects.find(s => s.subjectId === sub.subjectId)?.subjectName || sub.subjectId}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#8A6B5D' }}>Max Marks: {sub.maxMarks} | Passing: {sub.passingMarks}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === "timetable" && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Exam Timetable</Text>
                <Text style={styles.sectionSubtitle}>Schedule dates and times for each subject.</Text>
              </View>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setTimetableModalVisible(true)}>
                <Plus size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Schedule Exam</Text>
              </TouchableOpacity>
            </View>

            {examTimetable.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No timetable scheduled yet. Click 'Schedule Exam' to start.</Text>
              </View>
            ) : (
              <View style={{ padding: 16 }}>
                {examTimetable.map((tt, idx) => {
                  const cls = classSections.find(c => c.classSectionId === tt.classSectionId);
                  const sub = allSubjects.find(s => s.subjectId === tt.subjectId);
                  return (
                    <View key={idx} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5DC', flexDirection: 'row', alignItems: 'center' }}>
                      <Calendar size={16} color="#E35336" style={{ marginRight: 8 }} />
                      <View>
                        <Text style={{ fontSize: 15, color: '#A0522D', fontWeight: '500' }}>
                          {sub?.subjectName || tt.subjectId} - {cls?.className} {cls?.section}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#8A6B5D' }}>
                          {tt.examDate} | {tt.startTime} to {tt.endTime}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
        {activeTab === "marks" && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Exam Marks</Text>
                <Text style={styles.sectionSubtitle}>View marks obtained by students.</Text>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              {marksLoading ? (
                <ActivityIndicator size="small" color="#E35336" />
              ) : examMarks.length === 0 ? (
                <Text style={{ color: '#8A6B5D', textAlign: 'center', marginVertical: 20 }}>No marks found for this exam.</Text>
              ) : (
                examMarks.map((m, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#F5F5DC', borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#E6D8D2' }}>
                    <View>
                      <Text style={{ fontWeight: '600', color: '#A0522D' }}>{m.studentName}</Text>
                      <Text style={{ fontSize: 12, color: '#8A6B5D' }}>Sub: {m.subjectId} • {m.attendanceStatus}</Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', color: '#E35336', fontSize: 16 }}>{m.obtainedMarks}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {activeTab === "publish" && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Publish Results</Text>
                <Text style={styles.sectionSubtitle}>Publish compiled results for a class section.</Text>
              </View>
            </View>
            <View style={{ padding: 24, zIndex: 10 }}>
              <View style={[styles.formGroup, { zIndex: 50 }]}>
                <Text style={styles.label}>Select Class Section *</Text>
                <TouchableOpacity
                  style={[styles.input, { justifyContent: 'center' }]}
                  onPress={() => setPublishDropdown(!publishDropdown)}
                >
                  <Text style={{ color: publishClassId ? "#0f172a" : "#94a3b8" }}>
                    {publishClassId ? classSections.find(c => c.classSectionId === publishClassId)?.className + " - " + classSections.find(c => c.classSectionId === publishClassId)?.section || publishClassId : "Select Class Section"}
                  </Text>
                </TouchableOpacity>

                {publishDropdown && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                      {classSections.map(cls => (
                        <TouchableOpacity
                          key={cls.classSectionId}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setPublishClassId(cls.classSectionId);
                            setPublishDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{cls.className} - {cls.section}</Text>
                        </TouchableOpacity>
                      ))}
                      {classSections.length === 0 && <Text style={{ padding: 10, color: '#94a3b8' }}>No classes found</Text>}
                    </ScrollView>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.submitBtn} onPress={handlePublish} disabled={processing}>
                {processing ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>Publish Results</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === "halltickets" && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Hall Tickets</Text>
                <Text style={styles.sectionSubtitle}>View and print hall tickets for a class section.</Text>
              </View>
            </View>
            <View style={{ padding: 24, zIndex: 10 }}>
              <View style={[styles.formGroup, { zIndex: 50 }]}>
                <Text style={styles.label}>Select Class Section *</Text>
                <TouchableOpacity
                  style={[styles.input, { justifyContent: 'center' }]}
                  onPress={() => setHtDropdown(!htDropdown)}
                >
                  <Text style={{ color: htClassId ? "#0f172a" : "#94a3b8" }}>
                    {htClassId ? classSections.find(c => c.classSectionId === htClassId)?.className + " - " + classSections.find(c => c.classSectionId === htClassId)?.section || htClassId : "Choose Class"}
                  </Text>
                </TouchableOpacity>

                {htDropdown && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                      {classSections.map(cls => (
                        <TouchableOpacity
                          key={cls.classSectionId}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setHtClassId(cls.classSectionId);
                            setHtDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{cls.className} - {cls.section}</Text>
                        </TouchableOpacity>
                      ))}
                      {classSections.length === 0 && <Text style={{ padding: 10, color: '#94a3b8' }}>No classes found</Text>}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            <View style={{ padding: 16, backgroundColor: '#f8fafc' }}>
              {loadingTickets ? (
                <ActivityIndicator size="large" color="#E35336" />
              ) : hallTickets.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>{htClassId ? "No students found for this class." : "Select a class section to view hall tickets."}</Text>
                </View>
              ) : (
                hallTickets.map((item, idx) => (
                  <View key={item.studentId || String(idx)} style={styles.htTicket}>
                    <View style={styles.htTicketHeader}>
                      <Text style={styles.htTicketSchool}>ERP School Hall Ticket</Text>
                      <Text style={styles.htTicketExamName}>{item.examName || examDetails?.examName || "Exam"}</Text>
                    </View>
                    <View style={styles.htTicketBody}>
                      <View style={styles.htAvatar}><User size={30} color="#E35336" /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.htStudentName}>{item.studentName}</Text>
                        <View style={styles.htRow}><Text style={styles.htLabel}>Roll No:</Text><Text style={styles.htVal}>{item.rollNumber || 'N/A'}</Text></View>
                        <View style={styles.htRow}><Text style={styles.htLabel}>Class:</Text><Text style={styles.htVal}>{item.classSectionName || (classSections.find(c => c.classSectionId === htClassId)?.className + " - " + classSections.find(c => c.classSectionId === htClassId)?.section)}</Text></View>
                        <View style={styles.htRow}><Text style={styles.htLabel}>Academic Year:</Text><Text style={styles.htVal}>{item.academicYear || examDetails?.academicYear}</Text></View>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Assign Class Modal */}
      <Modal visible={classModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 400 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Class</Text>
              <TouchableOpacity onPress={() => setClassModalVisible(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={[styles.formGroup, { zIndex: 50 }]}>
              <Text style={styles.label}>Class Section *</Text>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setAssignClassDropdown(!assignClassDropdown)}
              >
                <Text style={{ color: classSectionId ? "#0f172a" : "#94a3b8" }}>
                  {classSectionId ? classSections.find(c => c.classSectionId === classSectionId)?.className + " - " + classSections.find(c => c.classSectionId === classSectionId)?.section || classSectionId : "Select Class Section"}
                </Text>
              </TouchableOpacity>

              {assignClassDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                    {classSections.map(cls => (
                      <TouchableOpacity
                        key={cls.classSectionId}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setClassSectionId(cls.classSectionId);
                          setAssignClassDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{cls.className} - {cls.section}</Text>
                      </TouchableOpacity>
                    ))}
                    {classSections.length === 0 && <Text style={{ padding: 10, color: '#94a3b8' }}>No classes found</Text>}
                  </ScrollView>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAssignClass} disabled={processing}>
              {processing ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>Assign Class</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Subject Modal */}
      <Modal visible={subjectModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 450 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Subject to Exam</Text>
              <TouchableOpacity onPress={() => setSubjectModalVisible(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={[styles.formGroup, { zIndex: 60 }]}>
              <Text style={styles.label}>Subject ID *</Text>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setAddSubjectDropdown(!addSubjectDropdown)}
              >
                <Text style={{ color: subjectForm.subjectId ? "#0f172a" : "#94a3b8" }}>
                  {subjectForm.subjectId ? allSubjects.find(s => s.subjectId === subjectForm.subjectId)?.subjectName || subjectForm.subjectId : "Select Subject"}
                </Text>
              </TouchableOpacity>

              {addSubjectDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                    {allSubjects.map(sub => (
                      <TouchableOpacity
                        key={sub.subjectId}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSubjectForm({ ...subjectForm, subjectId: sub.subjectId });
                          setAddSubjectDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{sub.subjectName} ({sub.subjectCode})</Text>
                      </TouchableOpacity>
                    ))}
                    {allSubjects.length === 0 && <Text style={{ padding: 10, color: '#94a3b8' }}>No subjects found</Text>}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={[styles.formGroup, { zIndex: 50 }]}>
              <Text style={styles.label}>Teacher (Optional)</Text>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setTeacherDropdown(!teacherDropdown)}
              >
                <Text style={{ color: subjectForm.teacherId ? "#0f172a" : "#94a3b8" }}>
                  {subjectForm.teacherId ? teachers.find(t => t.id === subjectForm.teacherId)?.name || subjectForm.teacherId : "Select Teacher"}
                </Text>
              </TouchableOpacity>

              {teacherDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                    {teachers.map(t => (
                      <TouchableOpacity
                        key={t.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSubjectForm({ ...subjectForm, teacherId: t.id });
                          setTeacherDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{t.name}</Text>
                      </TouchableOpacity>
                    ))}
                    {teachers.length === 0 && <Text style={{ padding: 10, color: '#94a3b8' }}>No teachers found</Text>}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Max Marks *</Text>
                <TextInput style={styles.input} value={subjectForm.maxMarks} onChangeText={t => setSubjectForm({ ...subjectForm, maxMarks: t })} keyboardType="numeric" />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Passing Marks *</Text>
                <TextInput style={styles.input} value={subjectForm.passingMarks} onChangeText={t => setSubjectForm({ ...subjectForm, passingMarks: t })} keyboardType="numeric" />
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddSubject} disabled={processing}>
              {processing ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>Add Subject</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Schedule Timetable Modal */}
      <Modal visible={timetableModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 450 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Timetable</Text>
              <TouchableOpacity onPress={() => setTimetableModalVisible(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
              <View style={{ flexDirection: 'row', gap: 12, zIndex: 50 }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Class Section *</Text>
                  <TouchableOpacity
                    style={[styles.input, { justifyContent: 'center' }]}
                    onPress={() => setTimetableClassDropdown(!timetableClassDropdown)}
                  >
                    <Text style={{ color: timetableForm.classSectionId ? "#0f172a" : "#94a3b8" }}>
                      {timetableForm.classSectionId ? classSections.find(c => c.classSectionId === timetableForm.classSectionId)?.className + " - " + classSections.find(c => c.classSectionId === timetableForm.classSectionId)?.section || timetableForm.classSectionId : "Select Class Section"}
                    </Text>
                  </TouchableOpacity>

                  {timetableClassDropdown && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                        {classSections.map(cls => (
                          <TouchableOpacity
                            key={cls.classSectionId}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setTimetableForm({ ...timetableForm, classSectionId: cls.classSectionId });
                              setTimetableClassDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{cls.className} - {cls.section}</Text>
                          </TouchableOpacity>
                        ))}
                        {classSections.length === 0 && <Text style={{ padding: 10, color: '#94a3b8' }}>No classes found</Text>}
                      </ScrollView>
                    </View>
                  )}
                </View>
                <View style={[styles.formGroup, { flex: 1, zIndex: 60 }]}>
                  <Text style={styles.label}>Subject ID *</Text>
                  <TouchableOpacity
                    style={[styles.input, { justifyContent: 'center' }]}
                    onPress={() => setTimetableSubjectDropdown(!timetableSubjectDropdown)}
                  >
                    <Text style={{ color: timetableForm.subjectId ? "#0f172a" : "#94a3b8" }}>
                      {timetableForm.subjectId ? allSubjects.find(s => s.subjectId === timetableForm.subjectId)?.subjectName || timetableForm.subjectId : "Select Subject"}
                    </Text>
                  </TouchableOpacity>

                  {timetableSubjectDropdown && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                        {allSubjects.map(sub => (
                          <TouchableOpacity
                            key={sub.subjectId}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setTimetableForm({ ...timetableForm, subjectId: sub.subjectId });
                              setTimetableSubjectDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{sub.subjectName} ({sub.subjectCode})</Text>
                          </TouchableOpacity>
                        ))}
                        {allSubjects.length === 0 && <Text style={{ padding: 10, color: '#94a3b8' }}>No subjects found</Text>}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              <View style={[styles.formGroup, { zIndex: 10 }]}>
                <Text style={styles.label}>Exam Date *</Text>
                {Platform.OS === 'web' ? (
                  createElement('input', {
                    type: 'date',
                    value: timetableForm.examDate,
                    onChange: (e: any) => setTimetableForm({ ...timetableForm, examDate: e.target.value }),
                    style: {
                      borderWidth: '1px',
                      borderColor: "#E6D8D2",
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '15px',
                      color: "#A0522D",
                      backgroundColor: "#F5F5DC",
                      outline: 'none',
                      fontFamily: 'system-ui',
                      width: '100%',
                      boxSizing: 'border-box'
                    }
                  })
                ) : (
                  <>
                    <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowExamDate(true)}>
                      <Text style={{ color: timetableForm.examDate ? "#0f172a" : "#94a3b8" }}>
                        {timetableForm.examDate || "YYYY-MM-DD"}
                      </Text>
                    </TouchableOpacity>
                    {showExamDate && (
                      <DateTimePicker
                        value={timetableForm.examDate ? new Date(timetableForm.examDate) : new Date()}
                        mode="date"
                        display="default"
                        onChange={onExamDateChange}
                      />
                    )}
                  </>
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: 12, zIndex: 10 }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Start Time *</Text>
                  {Platform.OS === 'web' ? (
                    createElement('input', {
                      type: 'time',
                      value: timetableForm.startTime,
                      onChange: (e: any) => setTimetableForm({ ...timetableForm, startTime: e.target.value }),
                      style: {
                        borderWidth: '1px',
                        borderColor: "#E6D8D2",
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '15px',
                        color: "#A0522D",
                        backgroundColor: "#F5F5DC",
                        outline: 'none',
                        fontFamily: 'system-ui',
                        width: '100%',
                        boxSizing: 'border-box'
                      }
                    })
                  ) : (
                    <>
                      <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowStartTime(true)}>
                        <Text style={{ color: timetableForm.startTime ? "#0f172a" : "#94a3b8" }}>
                          {timetableForm.startTime || "HH:MM"}
                        </Text>
                      </TouchableOpacity>
                      {showStartTime && (
                        <DateTimePicker
                          value={new Date()}
                          mode="time"
                          display="default"
                          onChange={onStartTimeChange}
                        />
                      )}
                    </>
                  )}
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>End Time *</Text>
                  {Platform.OS === 'web' ? (
                    createElement('input', {
                      type: 'time',
                      value: timetableForm.endTime,
                      onChange: (e: any) => setTimetableForm({ ...timetableForm, endTime: e.target.value }),
                      style: {
                        borderWidth: '1px',
                        borderColor: "#E6D8D2",
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '15px',
                        color: "#A0522D",
                        backgroundColor: "#F5F5DC",
                        outline: 'none',
                        fontFamily: 'system-ui',
                        width: '100%',
                        boxSizing: 'border-box'
                      }
                    })
                  ) : (
                    <>
                      <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowEndTime(true)}>
                        <Text style={{ color: timetableForm.endTime ? "#0f172a" : "#94a3b8" }}>
                          {timetableForm.endTime || "HH:MM"}
                        </Text>
                      </TouchableOpacity>
                      {showEndTime && (
                        <DateTimePicker
                          value={new Date()}
                          mode="time"
                          display="default"
                          onChange={onEndTimeChange}
                        />
                      )}
                    </>
                  )}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={handleScheduleTimetable} disabled={processing}>
              {processing ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>Schedule Timetable</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", padding: 24, paddingBottom: 0 },
  backBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  backBtnText: { fontSize: 14, fontWeight: '600', color: '#8A6B5D', marginLeft: 4 },

  examIdTag: { color: '#E35336', fontSize: 12, fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4, marginBottom: 20 },

  tabsContainer: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E6D8D2' },
  tabsScroll: { paddingHorizontal: 24, flexDirection: 'row', gap: 24 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: 'transparent', gap: 8 },
  tabBtnActive: { borderBottomColor: '#E35336' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#8A6B5D' },
  tabTextActive: { color: '#E35336' },

  contentContainer: { padding: 24, paddingBottom: 40 },

  sectionCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E6D8D2', overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F5F5DC' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: "#A0522D" },
  sectionSubtitle: { fontSize: 13, color: '#8A6B5D', marginTop: 2 },

  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E35336', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, gap: 6 },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  emptyState: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#B8A095', fontSize: 14, textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D" },

  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#705244", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 8, padding: 12, fontSize: 15, color: "#A0522D", backgroundColor: "#F5F5DC", ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any },

  submitBtn: { backgroundColor: "#E35336", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  dropdownMenu: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6D8D2', borderRadius: 8, marginTop: 4, zIndex: 9999, maxHeight: 150, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  dropdownContainer: { borderWidth: 1, borderColor: '#E6D8D2', borderRadius: 8, backgroundColor: '#fff', marginTop: 4, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5DC' },
  dropdownItemText: { fontSize: 14, color: '#A0522D' },

  htTicket: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E6D8D2', overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3
  },
  htTicketHeader: { backgroundColor: '#E35336', padding: 16, alignItems: 'center' },
  htTicketSchool: { color: '#fff', fontSize: 12, fontWeight: '600', letterSpacing: 1, opacity: 0.9 },
  htTicketExamName: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 4 },
  htTicketBody: { flexDirection: 'row', padding: 20, gap: 20, alignItems: 'center' },
  htAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F5F5DC', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E6D8D2' },
  htStudentName: { fontSize: 18, fontWeight: '700', color: '#A0522D', marginBottom: 8 },
  htRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  htLabel: { fontSize: 13, color: '#8A6B5D', width: 90 },
  htVal: { fontSize: 13, fontWeight: '600', color: '#A0522D' },
});