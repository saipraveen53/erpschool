import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, TextInput, ActivityIndicator, Alert, Platform } from "react-native";
import { Search, User, BookOpen, GraduationCap, CheckCircle, XCircle, Award } from "lucide-react-native";
import { useState, useEffect } from "react";
import { rootApi } from "../../../utils/axiosInstance";
import { useLocalSearchParams } from "expo-router";

export default function StudentReportViewer() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { studentId: paramStudentId } = useLocalSearchParams<{ studentId?: string }>();

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await rootApi.get('/api/student/allStudents');
      if (response.data && Array.isArray(response.data)) {
        setAllStudents(response.data);
      }
    } catch(e) {
      console.error("Failed to fetch all students for dropdown:", e);
    }
  };

  useEffect(() => {
    if (paramStudentId) {
      setStudentId(paramStudentId);
      handleSearch(paramStudentId);
    }
  }, [paramStudentId]);

  const handleSearch = async (searchId: string = studentId) => {
    if (!searchId.trim()) {
      return Alert.alert("Error", "Please enter a Student ID");
    }

    try {
      setLoading(true);
      setReportData(null);
      const response = await rootApi.get(`/api/student/${searchId.trim()}/report`);
      if (response.data) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
      Alert.alert("Error", "Failed to fetch student report. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header & Search */}
      <View style={[styles.header, { padding: isMobile ? 16 : 24, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: 16, zIndex: 100, elevation: 100 }]}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Award size={24} color="#E35336" />
            <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 26 }]}>Student Reports</Text>
          </View>
          <Text style={styles.headerSubtitle}>Search and view detailed academic performance reports.</Text>
        </View>

        <View style={{ zIndex: 50, width: 320, maxWidth: '100%' }}>
          <View style={[styles.searchContainer, { width: '100%' }]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter Student ID (e.g., STU2026004)"
              placeholderTextColor="#8A6B5D"
              value={studentId}
              onChangeText={(t) => {
                setStudentId(t);
                if (t.trim() === '') {
                  setReportData(null);
                  setShowDropdown(false);
                } else {
                  setShowDropdown(true);
                }
              }}
              onSubmitEditing={() => {
                setShowDropdown(false);
                handleSearch();
              }}
              onFocus={() => setShowDropdown(true)}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={() => {
              setShowDropdown(false);
              handleSearch();
            }} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Search size={20} color="#fff" />}
            </TouchableOpacity>
          </View>

          {showDropdown && allStudents.length > 0 && (
            <View style={styles.dropdownContainer}>
              <ScrollView 
                nestedScrollEnabled 
                keyboardShouldPersistTaps="handled" 
                style={[{ maxHeight: 200 }, Platform.OS === 'web' ? { overflowY: 'auto' } : ({} as any)]} 
                showsVerticalScrollIndicator={true}
              >
                {allStudents
                  .filter(s => s.studentId?.toLowerCase().includes(studentId.toLowerCase()) || s.studentName?.toLowerCase().includes(studentId.toLowerCase()) || s.fullName?.toLowerCase().includes(studentId.toLowerCase()))
                  .map((stu, i) => (
                    <TouchableOpacity 
                      key={i} 
                      style={styles.dropdownItem} 
                      onPress={() => {
                        setStudentId(stu.studentId);
                        setShowDropdown(false);
                        handleSearch(stu.studentId);
                      }}
                    >
                      <Text style={{ fontWeight: '600', color: '#A0522D' }}>{stu.studentId}</Text>
                      <Text style={{ color: '#8A6B5D', fontSize: 13 }}>{stu.studentName || stu.fullName}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: isMobile ? 12 : 24, paddingBottom: 40 }}>
        {!reportData && !loading && (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconCircle}>
              <Search size={32} color="#E35336" />
            </View>
            <Text style={styles.emptyTitle}>Search Student Report</Text>
            <Text style={styles.emptyText}>Enter a student ID in the search bar above to fetch their academic report card.</Text>
          </View>
        )}

        {reportData && (
          <View style={styles.reportContainer}>
            {/* Student Profile Overview */}
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarCircle}>
                  <User size={32} color="#E35336" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{reportData.fullName}</Text>
                  <Text style={styles.studentDetails}>ID: {reportData.studentId}  •  Roll No: {reportData.rollNumber}</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeLabel}>Aggregate</Text>
                  <Text style={styles.scoreBadgeValue}>{reportData.totalAggregatedPercentage}%</Text>
                </View>
              </View>
              
              <View style={styles.profileFooter}>
                <View style={styles.footerItem}>
                  <GraduationCap size={16} color="#8A6B5D" style={{ marginRight: 6 }} />
                  <Text style={styles.footerItemText}>Class: {reportData.classSectionId}</Text>
                </View>
                <View style={styles.footerItem}>
                  <BookOpen size={16} color="#8A6B5D" style={{ marginRight: 6 }} />
                  <Text style={styles.footerItemText}>Year: {reportData.academicYear}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Exam Performances</Text>

            {reportData.examPerformances?.length === 0 ? (
              <Text style={{ color: '#8A6B5D' }}>No exam performances recorded.</Text>
            ) : (
              reportData.examPerformances?.map((exam: any, idx: number) => (
                <View key={idx} style={styles.examCard}>
                  <View style={styles.examHeader}>
                    <View>
                      <Text style={styles.examName}>{exam.examName}</Text>
                      <Text style={styles.examIdTag}>{exam.examId}</Text>
                    </View>
                    <View style={styles.examResultBox}>
                      <Text style={styles.examPercentage}>{exam.examPercentage}%</Text>
                      <View style={[styles.statusBadge, { backgroundColor: exam.overallResultStatus === 'PASS' ? '#dcfce7' : '#fee2e2' }]}>
                        {exam.overallResultStatus === 'PASS' ? (
                          <CheckCircle size={12} color="#16a34a" style={{ marginRight: 4 }} />
                        ) : (
                          <XCircle size={12} color="#ef4444" style={{ marginRight: 4 }} />
                        )}
                        <Text style={[styles.statusText, { color: exam.overallResultStatus === 'PASS' ? '#16a34a' : '#ef4444' }]}>
                          {exam.overallResultStatus}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, { flex: 2 }]}>Subject ID</Text>
                      <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Marks</Text>
                      <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Attendance</Text>
                      <Text style={[styles.tableHeaderText, { flex: 2 }]}>Remarks</Text>
                    </View>
                    {exam.subjectMarks?.map((sub: any, sIdx: number) => (
                      <View key={sIdx} style={styles.tableRow}>
                        <Text style={[styles.tableRowText, { flex: 2, fontWeight: '600', color: '#A0522D' }]}>{sub.subjectId}</Text>
                        <Text style={[styles.tableRowText, { flex: 1, textAlign: 'center' }]}>{sub.obtainedMarks}</Text>
                        <Text style={[styles.tableRowText, { flex: 1, textAlign: 'center', color: sub.attendanceStatus === 'PRESENT' ? '#16a34a' : '#ef4444' }]}>{sub.attendanceStatus}</Text>
                        <Text style={[styles.tableRowText, { flex: 2, color: '#8A6B5D' }]} numberOfLines={1}>{sub.remarks || "-"}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", justifyContent: "space-between", zIndex: 100 },
  headerTitle: { fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5DC', borderRadius: 8, paddingLeft: 12, borderWidth: 1, borderColor: '#E6D8D2', width: 320, maxWidth: '100%' },
  searchInput: { flex: 1, height: 44, color: '#A0522D', fontSize: 14, ...({ outlineStyle: 'none' } as any) },
  searchBtn: { backgroundColor: '#E35336', width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },

  dropdownContainer: { position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E6D8D2', zIndex: 100, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5DC', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  emptyStateContainer: { alignItems: "center", marginTop: 60, padding: 24, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E6D8D2', borderStyle: 'dashed' },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F5F5DC', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#A0522D', marginBottom: 8 },
  emptyText: { textAlign: "center", color: "#8A6B5D", fontSize: 14, maxWidth: 300 },

  reportContainer: { gap: 24 },
  
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E6D8D2', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F5F5DC', alignItems: 'center', justifyContent: 'center' },
  studentName: { fontSize: 22, fontWeight: 'bold', color: '#A0522D', marginBottom: 4 },
  studentDetails: { fontSize: 14, color: '#8A6B5D' },
  
  scoreBadge: { backgroundColor: '#E35336', padding: 12, borderRadius: 12, alignItems: 'center' },
  scoreBadgeLabel: { color: '#F5F5DC', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  scoreBadgeValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

  profileFooter: { flexDirection: 'row', gap: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E6D8D2' },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerItemText: { fontSize: 14, color: '#A0522D', fontWeight: '500' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#A0522D', marginTop: 8 },

  examCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E6D8D2' },
  examHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  examName: { fontSize: 16, fontWeight: 'bold', color: '#A0522D', marginBottom: 4 },
  examIdTag: { fontSize: 12, color: '#8A6B5D' },
  
  examResultBox: { alignItems: 'flex-end' },
  examPercentage: { fontSize: 20, fontWeight: 'bold', color: '#A0522D', marginBottom: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: 'bold' },

  tableContainer: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#E6D8D2' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F5F5DC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E6D8D2' },
  tableHeaderText: { fontSize: 12, fontWeight: '600', color: '#8A6B5D' },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E6D8D2', alignItems: 'center' },
  tableRowText: { fontSize: 13, color: '#A0522D' }
});
