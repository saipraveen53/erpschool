// app/admin/examination/exams.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Save, BookOpen, Users, Clock3, ClipboardList, FileCheck, BarChart3, Award, PenTool } from "lucide-react-native";

// Import your axios instance
import { createExamApi } from '@/app/utils/axiosInstance'; 

export default function CreateExamPage() {
  const router = useRouter();
  
  const [examData, setExamData] = useState({ 
    examName: "", 
    academicYear: "2026", 
    startDate: "", 
    endDate: "" 
  });
  const [loading, setLoading] = useState(false);

  const handleCreateExam = async () => {
    setLoading(true);
    try {
      // Mapping the state to the exact payload structure required by your API
      const payload = {
        examId: "Annuka", 
        examName: examData.examName,
        academicYear: examData.academicYear,
        startDate: examData.startDate,
        endDate: examData.endDate,
        status: "CREATED",
        createdBy: "ADMIN",
        createdAt: new Date().toISOString(),
        updatedBy: "ADMIN",
        updatedAt: new Date().toISOString()
      };
      
      console.log("Sending Payload:", payload); // Debugging
      const response = await createExamApi.post('/api/exams', payload);
      
      Alert.alert("Success", `Exam Created! ID: ${response.data.examId}`);
    } catch (error: any) {
      console.error("API Error Details:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to create exam. Please verify field names.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Create New Examination</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Exam Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Annual Exam" 
          value={examData.examName}
          onChangeText={(t) => setExamData({...examData, examName: t})} 
        />
        
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={examData.startDate} onChangeText={(t) => setExamData({...examData, startDate: t})} />
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.label}>End Date</Text>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={examData.endDate} onChangeText={(t) => setExamData({...examData, endDate: t})} />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleCreateExam} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Save size={18} color="#fff" />}
          <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Create Exam"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepsContainer}>
        <StepCard title="Add Subjects" icon={BookOpen} description="Add subjects to the created exam" />
        <StepCard title="Assign Classes" icon={Users} description="Link class sections to this exam" />
        <StepCard title="Schedule Timetable" icon={Clock3} description="Define exam slots" />
      </View>
    </ScrollView>
  );
}

function StepCard({ title, icon: Icon, description }: any) {
  return (
    <TouchableOpacity style={styles.stepCard}>
      <View style={styles.iconBox}><Icon size={24} color="#27B3C7" /></View>
      <View style={{flex: 1}}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{description}</Text>
      </View>
      <Plus size={20} color="#27B3C7" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F9FA" },
  content: { padding: 32 },
  heading: { fontSize: 28, fontWeight: "900", color: "#24343D", marginBottom: 24 },
  formCard: { backgroundColor: "#fff", padding: 24, borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 24 },
  label: { fontSize: 13, fontWeight: "800", color: "#6B7280", marginBottom: 8 },
  input: { backgroundColor: "#F0F9FA", borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  row: { flexDirection: 'row' },
  saveButton: { backgroundColor: "#27B3C7", padding: 16, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  saveButtonText: { color: "#fff", fontWeight: "800" },
  stepsContainer: { gap: 16 },
  stepCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#fff", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  iconBox: { width: 50, height: 50, borderRadius: 14, backgroundColor: "#F0F9FA", justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  stepTitle: { fontSize: 15, fontWeight: "800", color: "#24343D" },
  stepDesc: { fontSize: 12, color: "#6B7280" },
});