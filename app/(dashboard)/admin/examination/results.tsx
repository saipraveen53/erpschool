import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Eye,
  Filter,
  X,
  ChevronDown,
  CheckCircle,
  FileText,
  Users,
  BookOpen,
  Calendar,
  Award,
  Download,
  Printer,
  Search,
  User,
  GraduationCap,
  Trophy,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { viewMarksApi, createExamsApi, getResultsApi } from "@/app/utils/axiosInstance";

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
  danger: "#EF4444",
};

interface Mark {
  markId: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName?: string;
  obtainedMarks: number;
  attendanceStatus: "PRESENT" | "ABSENT";
}

interface Exam {
  examId: string;
  examName: string;
  academicYear: string;
  status: string;
}

interface SubjectResult {
  subject: string;
  marks: number;
  maxMarks: number;
}

interface StudentResult {
  studentName: string;
  percentage: number;
  rank: number;
  subjects: SubjectResult[];
}

export default function ResultsPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [activeTab, setActiveTab] = useState<"marks" | "studentResult">("marks");
  
  // Marks View States
  const [marks, setMarks] = useState<Mark[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [searchText, setSearchText] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalPresent: 0,
    totalAbsent: 0,
    averageMarks: 0,
    highestMarks: 0,
    lowestMarks: 0,
  });

  // Student Result View States
  const [studentId, setStudentId] = useState("");
  const [studentResult, setStudentResult] = useState<StudentResult | null>(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [studentSearchModal, setStudentSearchModal] = useState(false);
  const [studentsList, setStudentsList] = useState<any[]>([]);

  // Fetch exams for dropdown
  const fetchExams = async () => {
    try {
      const response = await createExamsApi.get("/api/all-exams");
      if (response.data && Array.isArray(response.data)) {
        setExams(response.data);
        if (response.data.length > 0) {
          setSelectedExam(response.data[0]);
        }
      } else {
        setExams([
          { examId: "EXM001", examName: "First Term Exam", academicYear: "2025", status: "COMPLETED" },
          { examId: "EXM002", examName: "Second Term Exam", academicYear: "2025", status: "COMPLETED" },
        ]);
        if (exams.length === 0) {
          setSelectedExam({ examId: "EXM001", examName: "First Term Exam", academicYear: "2025", status: "COMPLETED" });
        }
      }
    } catch (error) {
      console.error("Fetch exams error:", error);
      setExams([
        { examId: "EXM001", examName: "First Term Exam", academicYear: "2025", status: "COMPLETED" },
        { examId: "EXM002", examName: "Second Term Exam", academicYear: "2025", status: "COMPLETED" },
      ]);
      setSelectedExam({ examId: "EXM001", examName: "First Term Exam", academicYear: "2025", status: "COMPLETED" });
    }
  };

  // Fetch marks for selected exam with filters
  const fetchMarks = async () => {
    if (!selectedExam) return;
    
    try {
      setLoading(true);
      let url = `/api/exams/${selectedExam.examId}/marks`;
      const params = new URLSearchParams();
      if (selectedSubject) params.append("subjectId", selectedSubject);
      if (selectedClass) params.append("classSectionId", selectedClass);
      if (selectedTeacher) params.append("teacherId", selectedTeacher);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await viewMarksApi.get(url);
      if (response.data && Array.isArray(response.data)) {
        setMarks(response.data);
        calculateStatistics(response.data);
      } else {
        const mockMarks: Mark[] = [
          { markId: "MRK001", studentId: "STU001", studentName: "John Doe", subjectId: "SUB001", obtainedMarks: 85, attendanceStatus: "PRESENT" },
          { markId: "MRK002", studentId: "STU002", studentName: "Jane Smith", subjectId: "SUB001", obtainedMarks: 92, attendanceStatus: "PRESENT" },
          { markId: "MRK003", studentId: "STU003", studentName: "Mike Johnson", subjectId: "SUB001", obtainedMarks: 78, attendanceStatus: "PRESENT" },
          { markId: "MRK004", studentId: "STU004", studentName: "Sarah Williams", subjectId: "SUB001", obtainedMarks: 45, attendanceStatus: "ABSENT" },
          { markId: "MRK005", studentId: "STU005", studentName: "David Brown", subjectId: "SUB001", obtainedMarks: 88, attendanceStatus: "PRESENT" },
        ];
        setMarks(mockMarks);
        calculateStatistics(mockMarks);
      }
    } catch (error) {
      console.error("Fetch marks error:", error);
      const mockMarks: Mark[] = [
        { markId: "MRK001", studentId: "STU001", studentName: "John Doe", subjectId: "SUB001", obtainedMarks: 85, attendanceStatus: "PRESENT" },
        { markId: "MRK002", studentId: "STU002", studentName: "Jane Smith", subjectId: "SUB001", obtainedMarks: 92, attendanceStatus: "PRESENT" },
        { markId: "MRK003", studentId: "STU003", studentName: "Mike Johnson", subjectId: "SUB001", obtainedMarks: 78, attendanceStatus: "PRESENT" },
        { markId: "MRK004", studentId: "STU004", studentName: "Sarah Williams", subjectId: "SUB001", obtainedMarks: 45, attendanceStatus: "ABSENT" },
        { markId: "MRK005", studentId: "STU005", studentName: "David Brown", subjectId: "SUB001", obtainedMarks: 88, attendanceStatus: "PRESENT" },
      ];
      setMarks(mockMarks);
      calculateStatistics(mockMarks);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student result by ID
  const fetchStudentResult = async () => {
    if (!selectedExam || !studentId) {
      Alert.alert("Error", "Please select exam and enter student ID");
      return;
    }

    try {
      setResultLoading(true);
      const response = await getResultsApi.get(`/api/parent/exams/result/${selectedExam.examId}?studentId=${studentId}`);
      if (response.data) {
        setStudentResult(response.data);
      } else {
        Alert.alert("Error", "No result found for this student");
        setStudentResult(null);
      }
    } catch (error: any) {
      console.error("Fetch student result error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch student result");
      setStudentResult(null);
    } finally {
      setResultLoading(false);
      setStudentSearchModal(false);
    }
  };

  // Fetch students list
  const fetchStudentsList = async () => {
    try {
      const response = await studentApi.get("/api/students");
      setStudentsList(response.data || []);
    } catch (error) {
      setStudentsList([
        { studentId: "STU001", fullName: "John Doe" },
        { studentId: "STU002", fullName: "Jane Smith" },
        { studentId: "STU003", fullName: "Mike Johnson" },
      ]);
    }
  };

  const calculateStatistics = (marksData: Mark[]) => {
    const total = marksData.length;
    const present = marksData.filter(m => m.attendanceStatus === "PRESENT").length;
    const absent = total - present;
    const marksList = marksData.map(m => m.obtainedMarks);
    const average = marksList.length > 0 ? marksList.reduce((a, b) => a + b, 0) / marksList.length : 0;
    const highest = marksList.length > 0 ? Math.max(...marksList) : 0;
    const lowest = marksList.length > 0 ? Math.min(...marksList) : 0;
    
    setStatistics({
      totalStudents: total,
      totalPresent: present,
      totalAbsent: absent,
      averageMarks: Math.round(average),
      highestMarks: highest,
      lowestMarks: lowest,
    });
  };

  const fetchFilterOptions = async () => {
    try {
      const subjectsRes = await viewMarksApi.get("/api/subjects");
      setSubjects(subjectsRes.data || [
        { subjectId: "SUB001", subjectName: "Mathematics" },
        { subjectId: "SUB002", subjectName: "Science" },
        { subjectId: "SUB003", subjectName: "English" },
      ]);
      
      const classesRes = await viewMarksApi.get("/api/classes");
      setClasses(classesRes.data || [
        { classSectionId: "CLS001", className: "5", section: "A" },
        { classSectionId: "CLS002", className: "5", section: "B" },
      ]);
      
      const teachersRes = await viewMarksApi.get("/api/teachers");
      setTeachers(teachersRes.data || [
        { teacherId: "TCH001", fullName: "Dr. Smith" },
        { teacherId: "TCH002", fullName: "Prof. Mary" },
      ]);
    } catch (error) {
      console.error("Fetch filter options error:", error);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchFilterOptions();
    fetchStudentsList();
  }, []);

  useEffect(() => {
    if (selectedExam && activeTab === "marks") {
      fetchMarks();
    }
  }, [selectedExam, selectedSubject, selectedClass, selectedTeacher, activeTab]);

  const applyFilters = () => {
    setFilterModalVisible(false);
    fetchMarks();
  };

  const resetFilters = () => {
    setSelectedSubject("");
    setSelectedClass("");
    setSelectedTeacher("");
    setSearchText("");
    setFilterModalVisible(false);
  };

  const getAttendanceColor = (status: string) => {
    return status === "PRESENT" ? COLORS.success : COLORS.danger;
  };

  const getMarksColor = (marks: number) => {
    if (marks >= 80) return COLORS.success;
    if (marks >= 60) return COLORS.warning;
    return COLORS.danger;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return COLORS.success;
    if (percentage >= 60) return COLORS.warning;
    return COLORS.danger;
  };

  const filteredMarks = marks.filter(mark =>
    mark.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
    mark.studentId.toLowerCase().includes(searchText.toLowerCase())
  );

  const Dropdown = ({ label, value, options, onSelect, placeholder, getLabel }: any) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const selectedOption = options.find((opt: any) => opt.value === value);
    
    return (
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>{label}</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setDropdownVisible(true)}>
          <Text style={[styles.dropdownButtonText, !value && { color: COLORS.textLight }]}>
            {selectedOption ? (getLabel ? getLabel(selectedOption) : selectedOption.label) : placeholder || `Select ${label}`}
          </Text>
          <ChevronDown size={16} color={COLORS.textLight} />
        </TouchableOpacity>
        
        <Modal visible={dropdownVisible} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownVisible(false)}>
            <View style={styles.dropdownModal}>
              <Text style={styles.dropdownTitle}>Select {label}</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {options.map((option: any) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.dropdownOption, value === option.value && styles.dropdownOptionSelected]}
                    onPress={() => {
                      onSelect(option.value);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={[styles.dropdownOptionText, value === option.value && styles.dropdownOptionTextSelected]}>
                      {getLabel ? getLabel(option) : option.label}
                    </Text>
                    {value === option.value && <CheckCircle size={16} color={COLORS.accent} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const renderMarksView = () => (
    <>
      {/* Statistics Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={24} color={COLORS.accent} />
          <Text style={styles.statValue}>{statistics.totalStudents}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color={COLORS.success} />
          <Text style={styles.statValue}>{statistics.averageMarks}</Text>
          <Text style={styles.statLabel}>Average Marks</Text>
        </View>
        <View style={styles.statCard}>
          <Trophy size={24} color={COLORS.warning} />
          <Text style={styles.statValue}>{statistics.highestMarks}</Text>
          <Text style={styles.statLabel}>Highest Marks</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color={COLORS.danger} />
          <Text style={styles.statValue}>{statistics.lowestMarks}</Text>
          <Text style={styles.statLabel}>Lowest Marks</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle size={24} color={COLORS.success} />
          <Text style={styles.statValue}>{statistics.totalPresent}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statCard}>
          <X size={24} color={COLORS.danger} />
          <Text style={styles.statValue}>{statistics.totalAbsent}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Search size={18} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student name or ID..."
          placeholderTextColor={COLORS.textLight}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Marks Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.studentCell]}>Student Name</Text>
            <Text style={[styles.headerCell, styles.idCell]}>Student ID</Text>
            <Text style={[styles.headerCell, styles.marksCell]}>Marks</Text>
            <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
          ) : filteredMarks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FileText size={48} color={COLORS.border} />
              <Text style={styles.emptyText}>No marks data available</Text>
            </View>
          ) : (
            filteredMarks.map((mark, index) => (
              <View key={mark.markId} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                <Text style={[styles.rowCell, styles.studentCell]}>{mark.studentName}</Text>
                <Text style={[styles.rowCell, styles.idCell]}>{mark.studentId}</Text>
                <Text style={[styles.rowCell, styles.marksCell, { color: getMarksColor(mark.obtainedMarks), fontWeight: "bold" }]}>
                  {mark.obtainedMarks}
                </Text>
                <View style={[styles.statusCell, styles.statusContainer]}>
                  <View style={[styles.attendanceBadge, { backgroundColor: getAttendanceColor(mark.attendanceStatus) + "20" }]}>
                    <Text style={[styles.attendanceText, { color: getAttendanceColor(mark.attendanceStatus) }]}>
                      {mark.attendanceStatus}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </>
  );

  const renderStudentResultView = () => (
    <View style={styles.studentResultContainer}>
      {/* Search Box */}
      <View style={styles.resultSearchBox}>
        <View style={styles.resultSearchHeader}>
          <User size={20} color={COLORS.accent} />
          <Text style={styles.resultSearchTitle}>Get Student Result</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.studentSearchButton} 
          onPress={() => setStudentSearchModal(true)}
        >
          <Text style={styles.studentSearchButtonText}>
            {studentId || "Select Student"}
          </Text>
          <ChevronDown size={18} color={COLORS.white} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.viewResultButton} onPress={fetchStudentResult}>
          <Eye size={18} color={COLORS.white} />
          <Text style={styles.viewResultButtonText}>View Result</Text>
        </TouchableOpacity>
      </View>

      {/* Result Display */}
      {resultLoading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={styles.resultLoader} />
      ) : studentResult ? (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <GraduationCap size={32} color={COLORS.accent} />
            <Text style={styles.resultStudentName}>{studentResult.studentName}</Text>
          </View>
          
          <View style={styles.resultStats}>
            <View style={styles.resultStatItem}>
              <Text style={styles.resultStatLabel}>Percentage</Text>
              <Text style={[styles.resultStatValue, { color: getPercentageColor(studentResult.percentage) }]}>
                {studentResult.percentage}%
              </Text>
            </View>
            <View style={styles.resultStatItem}>
              <Text style={styles.resultStatLabel}>Rank</Text>
              <Text style={styles.resultStatValue}>#{studentResult.rank}</Text>
            </View>
          </View>
          
          <Text style={styles.subjectsTitle}>Subject-wise Marks</Text>
          
          {studentResult.subjects.map((subject, index) => (
            <View key={index} style={styles.subjectResultCard}>
              <View style={styles.subjectResultHeader}>
                <BookOpen size={16} color={COLORS.accent} />
                <Text style={styles.subjectResultName}>{subject.subject}</Text>
              </View>
              <View style={styles.subjectResultDetails}>
                <Text style={styles.subjectResultMarks}>
                  Marks: {subject.marks} / {subject.maxMarks}
                </Text>
                <Text style={[styles.subjectResultPercentage, { color: getPercentageColor((subject.marks / subject.maxMarks) * 100) }]}>
                  {((subject.marks / subject.maxMarks) * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Results Management</Text>
          <Text style={styles.headerSubtitle}>View marks and student results</Text>
        </View>
        {activeTab === "marks" && (
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <Filter size={20} color={COLORS.white} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "marks" && styles.activeTab]}
          onPress={() => setActiveTab("marks")}
        >
          <FileText size={18} color={activeTab === "marks" ? COLORS.accent : COLORS.textLight} />
          <Text style={[styles.tabText, activeTab === "marks" && styles.activeTabText]}>View Marks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "studentResult" && styles.activeTab]}
          onPress={() => setActiveTab("studentResult")}
        >
          <User size={18} color={activeTab === "studentResult" ? COLORS.accent : COLORS.textLight} />
          <Text style={[styles.tabText, activeTab === "studentResult" && styles.activeTabText]}>Student Result</Text>
        </TouchableOpacity>
      </View>

      {/* Exam Selector */}
      <View style={styles.examSelector}>
        <Text style={styles.examSelectorLabel}>Select Exam</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examList}>
          {exams.map((exam) => (
            <TouchableOpacity
              key={exam.examId}
              style={[
                styles.examChip,
                selectedExam?.examId === exam.examId && styles.examChipActive
              ]}
              onPress={() => setSelectedExam(exam)}
            >
              <Text style={[
                styles.examChipText,
                selectedExam?.examId === exam.examId && styles.examChipTextActive
              ]}>
                {exam.examName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content based on active tab */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "marks" ? renderMarksView() : renderStudentResultView()}
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Marks</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Dropdown
                label="Subject"
                value={selectedSubject}
                options={subjects.map(s => ({ label: s.subjectName, value: s.subjectId }))}
                onSelect={setSelectedSubject}
                placeholder="All Subjects"
                getLabel={(opt: any) => opt.label}
              />
              
              <Dropdown
                label="Class"
                value={selectedClass}
                options={classes.map(c => ({ label: `Class ${c.className} - ${c.section}`, value: c.classSectionId }))}
                onSelect={setSelectedClass}
                placeholder="All Classes"
                getLabel={(opt: any) => opt.label}
              />
              
              <Dropdown
                label="Teacher"
                value={selectedTeacher}
                options={teachers.map(t => ({ label: t.fullName, value: t.teacherId }))}
                onSelect={setSelectedTeacher}
                placeholder="All Teachers"
                getLabel={(opt: any) => opt.label}
              />
              
              <View style={styles.filterButtons}>
                <TouchableOpacity style={[styles.filterActionBtn, styles.resetBtn]} onPress={resetFilters}>
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterActionBtn, styles.applyBtn]} onPress={applyFilters}>
                  <Text style={styles.applyBtnText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Student Search Modal */}
      <Modal visible={studentSearchModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Student</Text>
              <TouchableOpacity onPress={() => setStudentSearchModal(false)}>
                <X size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInputModal}
              placeholder="Search student by name or ID..."
              placeholderTextColor={COLORS.textLight}
              value={studentId}
              onChangeText={setStudentId}
            />
            <ScrollView style={{ maxHeight: 400 }}>
              {studentsList
                .filter(s => s.fullName?.toLowerCase().includes(studentId.toLowerCase()) || 
                           s.studentId?.toLowerCase().includes(studentId.toLowerCase()))
                .map((student) => (
                  <TouchableOpacity
                    key={student.studentId}
                    style={styles.studentOption}
                    onPress={() => {
                      setStudentId(student.studentId);
                      setStudentSearchModal(false);
                    }}
                  >
                    <User size={16} color={COLORS.accent} />
                    <View style={styles.studentOptionInfo}>
                      <Text style={styles.studentOptionName}>{student.fullName}</Text>
                      <Text style={styles.studentOptionId}>ID: {student.studentId}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#c7d2fe",
    marginTop: 4,
  },
  filterButton: {
    backgroundColor: COLORS.accent,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  filterButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: COLORS.accent + "10",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.accent,
  },
  examSelector: {
    backgroundColor: COLORS.card,
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  examSelectorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 12,
  },
  examList: {
    flexDirection: "row",
  },
  examChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  examChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  examChipText: {
    fontSize: 13,
    color: COLORS.primary,
  },
  examChipTextActive: {
    color: COLORS.white,
  },
  content: {
    paddingBottom: 30,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  searchBox: {
    backgroundColor: COLORS.card,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primary,
  },
  tableContainer: {
    margin: 16,
    marginTop: 0,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCell: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRowEven: {
    backgroundColor: COLORS.background,
  },
  rowCell: {
    fontSize: 13,
    color: COLORS.primary,
  },
  studentCell: {
    width: 150,
  },
  idCell: {
    width: 100,
  },
  marksCell: {
    width: 80,
    textAlign: "center",
  },
  statusCell: {
    width: 100,
  },
  statusContainer: {
    alignItems: "center",
  },
  attendanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  attendanceText: {
    fontSize: 11,
    fontWeight: "600",
  },
  loader: {
    marginTop: 50,
    marginBottom: 50,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 6,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  dropdownModal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: "80%",
    maxHeight: "70%",
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  dropdownOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownOptionSelected: {
    backgroundColor: COLORS.accent + "10",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  dropdownOptionTextSelected: {
    color: COLORS.accent,
    fontWeight: "600",
  },
  filterButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  filterActionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  resetBtn: {
    backgroundColor: COLORS.border,
  },
  resetBtnText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  applyBtn: {
    backgroundColor: COLORS.accent,
  },
  applyBtnText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  // Student Result Styles
  studentResultContainer: {
    padding: 16,
  },
  resultSearchBox: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  resultSearchHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  resultSearchTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  studentSearchButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  studentSearchButtonText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  viewResultButton: {
    backgroundColor: COLORS.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  viewResultButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  resultLoader: {
    marginTop: 50,
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultStudentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  resultStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultStatItem: {
    alignItems: "center",
  },
  resultStatLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  resultStatValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subjectsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 12,
  },
  subjectResultCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subjectResultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  subjectResultName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  subjectResultDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 24,
  },
  subjectResultMarks: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  subjectResultPercentage: {
    fontSize: 13,
    fontWeight: "600",
  },
  searchInputModal: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: COLORS.background,
    marginBottom: 16,
  },
  studentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  studentOptionInfo: {
    flex: 1,
  },
  studentOptionName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  studentOptionId: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
});