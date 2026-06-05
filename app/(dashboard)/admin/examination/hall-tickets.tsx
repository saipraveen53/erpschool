// app/admin/examination/hall-tickets.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { rootApi, hallticket192Api } from '@/app/utils/axiosInstance';
import { ClipboardList, ChevronRight, User } from "lucide-react-native";

export default function HallTicketsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    fetchAllExams();
  }, []);

  // Fetch all exams from rootApi
  const fetchAllExams = async () => {
    try {
      const res = await rootApi.get('/api/all-exams');
      setExams(res.data);
    } catch (e) {
      console.error("Failed to fetch exams");
    } finally {
      setLoadingExams(false);
    }
  };

  // Fetch class-specific tickets using the hallticket192Api IP from image_4e4c9e.png
  const fetchClassTickets = async (examId: string, classId: string) => {
    setLoadingStudents(true);
    try {
      const res = await hallticket192Api.get(`/api/exam/${examId}/class-section/${classId}`);
      setStudents(res.data);
    } catch (e) {
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Examination Hub</Text>
      <Text style={styles.sectionTitle}>Available Exams</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {loadingExams ? (
          <ActivityIndicator color="#27B3C7" style={{marginTop: 20}} />
        ) : (
          exams.map((exam) => (
            <TouchableOpacity 
              key={exam.examId} 
              style={styles.examCard}
              onPress={() => exam.assignedClassSectionIds.length > 0 
                ? fetchClassTickets(exam.examId, exam.assignedClassSectionIds[0])
                : null
              }
            >
              <View style={styles.examIcon}><ClipboardList size={20} color="#27B3C7" /></View>
              <View style={{flex: 1}}>
                <Text style={styles.examName}>{exam.examName}</Text>
                <Text style={styles.examMeta}>Year: {exam.academicYear}</Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))
        )}

        {/* Student List Display Area */}
        {loadingStudents && <ActivityIndicator color="#27B3C7" style={{marginVertical: 20}} />}
        {students.map((stu, i) => (
          <View key={i} style={styles.studentRow}>
            <View style={styles.avatar}><User size={16} color="#475569" /></View>
            <View>
              <Text style={styles.stuName}>{stu.studentName}</Text>
              <Text style={styles.stuMeta}>Roll No: {stu.rollNumber} • {stu.classSectionName}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 40 },
  headerTitle: { fontSize: 32, fontWeight: "900", color: "#1E293B", marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#334155", marginBottom: 20 },
  examCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#fff", padding: 18, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  examIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#F1F5F9", justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  examName: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  examMeta: { fontSize: 12, color: "#64748B" },
  studentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#fff", padding: 15, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E2E8F0", justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  stuName: { fontSize: 14, fontWeight: "600", color: "#1E293B" },
  stuMeta: { fontSize: 11, color: "#64748B" }
});