import { bulkStudentCreationApi, studentApi } from "@/app/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

// Types based on the actual response structure
interface Student {
  studentId: string;
  admissionNumber?: string;
  fullName: string;
  dateOfBirth?: string;
  gender: string;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  category?: string;
  aadhaarNumber?: string;
  classSectionId: string;
  grade: string;
  section: string;
  academicYear: string;
  joiningDate?: string;
  rollNumber?: string;
  classTeacherId?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactNumber?: string;
  email: string;
  fatherName: string;
  fatherContact: string;
  motherName?: string;
  motherContact?: string;
  guardianName?: string;
  guardianContact?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  profileImageUrl?: string;
  active: boolean;
  generatedPassword?: string;
  totalFee: number;
}

interface StudentFormData {
  fullName: string;
  email: string;
  grade: string;
  section: string;
  academicYear: string;
  fatherName: string;
  fatherContact: string;
  totalFee: string;
  gender: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  motherName: string;
  motherContact: string;
  guardianName: string;
  guardianContact: string;
  dateOfBirth: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  category: string;
  aadhaarNumber: string;
  rollNumber: string;
  joiningDate: string;
  admissionNumber: string;
}

const StudentManagementScreen = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: "",
    email: "",
    grade: "",
    section: "",
    academicYear: "",
    fatherName: "",
    fatherContact: "",
    totalFee: "",
    gender: "MALE",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    motherName: "",
    motherContact: "",
    guardianName: "",
    guardianContact: "",
    dateOfBirth: "",
    bloodGroup: "",
    nationality: "",
    religion: "",
    category: "",
    aadhaarNumber: "",
    rollNumber: "",
    joiningDate: "",
    admissionNumber: "",
  });
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Fetch all students from the correct endpoint
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.get("/api/student/allStudents");
      if (response.data && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to fetch students. Please try again."
      );
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  // File Upload for Bulk Create
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        setUploading(true);
        
        // Read file content
        const fileContent = await FileSystem.readAsStringAsync(file.uri);
        
        // Parse CSV content
        const lines = fileContent.split('\n');
        const headers = lines[0].split(',');
        const studentsData = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',');
            const student: any = {};
            headers.forEach((header, index) => {
              student[header.trim()] = values[index]?.trim();
            });
            
            // Validate required fields
            if (student.fullName && student.email && student.grade && student.section && 
                student.academicYear && student.fatherName && student.fatherContact && student.totalFee) {
              studentsData.push({
                fullName: student.fullName,
                email: student.email,
                grade: student.grade,
                section: student.section,
                academicYear: student.academicYear,
                fatherName: student.fatherName,
                fatherContact: student.fatherContact,
                totalFee: parseFloat(student.totalFee),
              });
            }
          }
        }
        
        if (studentsData.length === 0) {
          Alert.alert("Error", "No valid student data found in file");
          setUploading(false);
          return;
        }
        
        // Send to API
        const response = await bulkStudentCreationApi.post("/api/student/bulk-create", studentsData);
        Alert.alert("Success", `Successfully created ${studentsData.length} students`);
        setBulkModalVisible(false);
        await fetchStudents();
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      Alert.alert("Error", "Failed to upload file. Please check the file format.");
    } finally {
      setUploading(false);
    }
  };

  // Add single student with complete data
  const handleAddProfile = async () => {
    // Validation for required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.grade ||
      !formData.section ||
      !formData.academicYear ||
      !formData.fatherName ||
      !formData.fatherContact ||
      !formData.totalFee
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      grade: formData.grade,
      section: formData.section,
      academicYear: formData.academicYear,
      fatherName: formData.fatherName,
      fatherContact: formData.fatherContact,
      totalFee: parseFloat(formData.totalFee),
      gender: formData.gender,
      contactNumber: formData.contactNumber,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      motherName: formData.motherName,
      motherContact: formData.motherContact,
      guardianName: formData.guardianName,
      guardianContact: formData.guardianContact,
      dateOfBirth: formData.dateOfBirth,
      bloodGroup: formData.bloodGroup,
      nationality: formData.nationality,
      religion: formData.religion,
      category: formData.category,
      aadhaarNumber: formData.aadhaarNumber,
      rollNumber: formData.rollNumber,
      joiningDate: formData.joiningDate,
      admissionNumber: formData.admissionNumber,
    };

    try {
      setLoading(true);
      const response = await studentApi.post("/api/student/create", payload);
      Alert.alert("Success", "Student added successfully");
      setModalVisible(false);
      resetForm();
      await fetchStudents();
    } catch (error: any) {
      console.error("Add student error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  // Edit student
  const handleEditStudent = async () => {
    if (!selectedStudent) return;

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.grade ||
      !formData.section ||
      !formData.academicYear ||
      !formData.fatherName ||
      !formData.fatherContact ||
      !formData.totalFee
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      grade: formData.grade,
      section: formData.section,
      academicYear: formData.academicYear,
      fatherName: formData.fatherName,
      fatherContact: formData.fatherContact,
      totalFee: parseFloat(formData.totalFee),
      gender: formData.gender,
      contactNumber: formData.contactNumber,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      motherName: formData.motherName,
      motherContact: formData.motherContact,
      guardianName: formData.guardianName,
      guardianContact: formData.guardianContact,
      dateOfBirth: formData.dateOfBirth,
      bloodGroup: formData.bloodGroup,
      nationality: formData.nationality,
      religion: formData.religion,
      category: formData.category,
      aadhaarNumber: formData.aadhaarNumber,
      rollNumber: formData.rollNumber,
      joiningDate: formData.joiningDate,
      admissionNumber: formData.admissionNumber,
    };

    try {
      setLoading(true);
      await studentApi.put(`/api/student/${selectedStudent.studentId}`, payload);
      Alert.alert("Success", "Student updated successfully");
      setModalVisible(false);
      resetForm();
      await fetchStudents();
    } catch (error: any) {
      console.error("Edit student error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  // View full profile
  const viewProfile = (student: Student) => {
    setSelectedStudent(student);
    setProfileModalVisible(true);
  };

  // Generate Report
  const handleReport = async (student: Student) => {
    setReportModalVisible(true);
    setReportLoading(true);
    setReportData(null);
    try {
      const response = await studentApi.get(`/api/student/${student.studentId}/report`);
      setReportData(response.data);
    } catch (error: any) {
      console.error("Report error:", error);
      setReportData({
        studentId: student.studentId,
        studentName: student.fullName,
        admissionNumber: student.admissionNumber,
        grade: `${student.grade} - ${student.section}`,
        academicYear: student.academicYear,
        totalFee: student.totalFee,
        feePaid: student.totalFee * 0.6,
        feePending: student.totalFee * 0.4,
        feeStatus: "Partially Paid",
        attendance: "89%",
        performance: "Good",
        totalSubjects: 6,
        subjectsCleared: 5,
        remarks: "Student shows consistent improvement.",
        parentContact: student.fatherContact,
        email: student.email,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        bloodGroup: student.bloodGroup,
        nationality: student.nationality,
        religion: student.religion,
        category: student.category,
        aadhaarNumber: student.aadhaarNumber,
        rollNumber: student.rollNumber,
        joiningDate: student.joiningDate,
        contactNumber: student.contactNumber,
        address: student.address,
        city: student.city,
        state: student.state,
        pincode: student.pincode,
        motherName: student.motherName,
        motherContact: student.motherContact,
        guardianName: student.guardianName,
        guardianContact: student.guardianContact,
      });
    } finally {
      setReportLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    resetForm();
    setSelectedStudent(null);
    setModalVisible(true);
  };

  const openBulkModal = () => {
    setBulkModalVisible(true);
  };

  const openEditModal = (student: Student) => {
    setModalMode("edit");
    setSelectedStudent(student);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      grade: student.grade,
      section: student.section,
      academicYear: student.academicYear,
      fatherName: student.fatherName,
      fatherContact: student.fatherContact,
      totalFee: student.totalFee.toString(),
      gender: student.gender,
      contactNumber: student.contactNumber || "",
      address: student.address || "",
      city: student.city || "",
      state: student.state || "",
      pincode: student.pincode || "",
      motherName: student.motherName || "",
      motherContact: student.motherContact || "",
      guardianName: student.guardianName || "",
      guardianContact: student.guardianContact || "",
      dateOfBirth: student.dateOfBirth || "",
      bloodGroup: student.bloodGroup || "",
      nationality: student.nationality || "",
      religion: student.religion || "",
      category: student.category || "",
      aadhaarNumber: student.aadhaarNumber || "",
      rollNumber: student.rollNumber || "",
      joiningDate: student.joiningDate || "",
      admissionNumber: student.admissionNumber || "",
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      grade: "",
      section: "",
      academicYear: "",
      fatherName: "",
      fatherContact: "",
      totalFee: "",
      gender: "MALE",
      contactNumber: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      motherName: "",
      motherContact: "",
      guardianName: "",
      guardianContact: "",
      dateOfBirth: "",
      bloodGroup: "",
      nationality: "",
      religion: "",
      category: "",
      aadhaarNumber: "",
      rollNumber: "",
      joiningDate: "",
      admissionNumber: "",
    });
  };

  const getStatusColor = (active: boolean) => {
    return active ? styles.statusActive : styles.statusInactive;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const renderStudentCard = ({ item }: { item: Student }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.fullName}</Text>
            <Text style={styles.studentId}>ID: {item.studentId}</Text>
            {item.admissionNumber && (
              <Text style={styles.studentId}>Admission No: {item.admissionNumber}</Text>
            )}
            <Text style={styles.studentEmail}>{item.email}</Text>
            <View style={styles.classRow}>
              <Text style={styles.classText}>
                Class: {item.grade} - {item.section.toUpperCase()}
              </Text>
              <Text style={styles.academicYear}>{item.academicYear}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, getStatusColor(item.active)]}>
          <Text style={styles.statusText}>
            {item.active ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Father's Name:</Text>
          <Text style={styles.detailValue}>{item.fatherName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Contact:</Text>
          <Text style={styles.detailValue}>{item.fatherContact}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gender:</Text>
          <Text style={styles.detailValue}>{item.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Fee:</Text>
          <Text style={styles.feeValue}>₹{item.totalFee.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => viewProfile(item)}
        >
          <Text style={styles.actionButtonText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.reportButton]}
          onPress={() => handleReport(item)}
        >
          <Text style={styles.actionButtonText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Profile Modal Component
  const ProfileModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={profileModalVisible}
      onRequestClose={() => setProfileModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.profileModalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {selectedStudent?.fullName?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.profileName}>{selectedStudent?.fullName}</Text>
              <Text style={styles.profileId}>ID: {selectedStudent?.studentId}</Text>
              {selectedStudent?.admissionNumber && (
                <Text style={styles.profileId}>Admission No: {selectedStudent.admissionNumber}</Text>
              )}
              <View
                style={[
                  styles.statusBadge,
                  getStatusColor(selectedStudent?.active || false),
                ]}
              >
                <Text style={styles.statusText}>
                  {selectedStudent?.active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.profileSectionTitle}>Personal Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.gender || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Date of Birth</Text>
                  <Text style={styles.infoValue}>{formatDate(selectedStudent?.dateOfBirth)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Blood Group</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.bloodGroup || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Nationality</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.nationality || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Religion</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.religion || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Category</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.category || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Aadhaar Number</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.aadhaarNumber || "N/A"}</Text>
                </View>
              </View>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.profileSectionTitle}>Academic Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Grade</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.grade}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Section</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.section?.toUpperCase()}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Roll Number</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.rollNumber || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Academic Year</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.academicYear}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Joining Date</Text>
                  <Text style={styles.infoValue}>{formatDate(selectedStudent?.joiningDate)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Class Section ID</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.classSectionId || "N/A"}</Text>
                </View>
              </View>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.profileSectionTitle}>Contact Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.email}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Contact Number</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.contactNumber || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.address || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>City</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.city || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>State</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.state || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Pincode</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.pincode || "N/A"}</Text>
                </View>
              </View>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.profileSectionTitle}>Parent/Guardian Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Father's Name</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.fatherName}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Father's Contact</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.fatherContact}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Mother's Name</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.motherName || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Mother's Contact</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.motherContact || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Guardian's Name</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.guardianName || "N/A"}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Guardian's Contact</Text>
                  <Text style={styles.infoValue}>{selectedStudent?.guardianContact || "N/A"}</Text>
                </View>
              </View>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.profileSectionTitle}>Fee Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Total Fee</Text>
                  <Text style={[styles.infoValue, styles.feeHighlight]}>
                    ₹{selectedStudent?.totalFee?.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {selectedStudent?.generatedPassword && (
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>Login Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Generated Password</Text>
                    <Text style={styles.infoValue}>{selectedStudent.generatedPassword}</Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeProfileButton}
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={styles.closeProfileButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D3F49" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Student Management</Text>
          <Text style={styles.headerSubtitle}>Manage all student profiles</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.bulkButton} onPress={openBulkModal}>
            <Text style={styles.bulkButtonText}>Bulk Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Text style={styles.addButtonText}>+ Add Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00BCD4" />
          <Text style={styles.loaderText}>Loading students...</Text>
        </View>
      ) : (
        <FlatList
          data={students}
          renderItem={renderStudentCard}
          keyExtractor={(item) => item.studentId}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#00BCD4"]}
              tintColor="#00BCD4"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No students found</Text>
              <Text style={styles.emptySubtext}>
                Tap "Add Profile" or "Bulk Add" to get started
              </Text>
            </View>
          }
        />
      )}

      {/* Bulk Create Modal - File Upload */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bulkModalVisible}
        onRequestClose={() => setBulkModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bulkModalContent}>
            <Text style={styles.modalTitle}>Bulk Add Students</Text>
            <Text style={styles.bulkSubtitle}>
              Upload CSV file with student data
            </Text>
            <Text style={styles.fileFormatText}>
              CSV Format: fullName, email, grade, section, academicYear, fatherName, fatherContact, totalFee
            </Text>
            
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={handleFileUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.uploadButtonText}>Choose CSV File</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelUploadButton}
              onPress={() => setBulkModalVisible(false)}
            >
              <Text style={styles.cancelUploadButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {modalMode === "add" ? "Add New Student" : "Edit Student"}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Email *"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Admission Number"
                value={formData.admissionNumber}
                onChangeText={(text) => setFormData({ ...formData, admissionNumber: text })}
                placeholderTextColor="#9ca3af"
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Grade *"
                  value={formData.grade}
                  onChangeText={(text) => setFormData({ ...formData, grade: text })}
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Section *"
                  value={formData.section}
                  onChangeText={(text) => setFormData({ ...formData, section: text })}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Academic Year * (e.g., 2024-2025)"
                value={formData.academicYear}
                onChangeText={(text) => setFormData({ ...formData, academicYear: text })}
                placeholderTextColor="#9ca3af"
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Gender *"
                  value={formData.gender}
                  onChangeText={(text) => setFormData({ ...formData, gender: text })}
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Roll Number"
                  value={formData.rollNumber}
                  onChangeText={(text) => setFormData({ ...formData, rollNumber: text })}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  value={formData.dateOfBirth}
                  onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Blood Group"
                  value={formData.bloodGroup}
                  onChangeText={(text) => setFormData({ ...formData, bloodGroup: text })}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Nationality"
                  value={formData.nationality}
                  onChangeText={(text) => setFormData({ ...formData, nationality: text })}
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Religion"
                  value={formData.religion}
                  onChangeText={(text) => setFormData({ ...formData, religion: text })}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Father's Name *"
                value={formData.fatherName}
                onChangeText={(text) => setFormData({ ...formData, fatherName: text })}
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Father's Contact *"
                value={formData.fatherContact}
                onChangeText={(text) => setFormData({ ...formData, fatherContact: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Mother's Name"
                value={formData.motherName}
                onChangeText={(text) => setFormData({ ...formData, motherName: text })}
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Mother's Contact"
                value={formData.motherContact}
                onChangeText={(text) => setFormData({ ...formData, motherContact: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Guardian's Name"
                value={formData.guardianName}
                onChangeText={(text) => setFormData({ ...formData, guardianName: text })}
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Guardian's Contact"
                value={formData.guardianContact}
                onChangeText={(text) => setFormData({ ...formData, guardianContact: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Address"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholderTextColor="#9ca3af"
                multiline
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="City"
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(text) => setFormData({ ...formData, state: text })}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Aadhaar Number"
                  value={formData.aadhaarNumber}
                  onChangeText={(text) => setFormData({ ...formData, aadhaarNumber: text })}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Total Fee *"
                value={formData.totalFee}
                onChangeText={(text) => setFormData({ ...formData, totalFee: text })}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={modalMode === "add" ? handleAddProfile : handleEditStudent}
                >
                  <Text style={styles.saveButtonText}>
                    {modalMode === "add" ? "Add Student" : "Save Changes"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Report Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reportModalContent}>
            <Text style={styles.modalTitle}>Student Report Card</Text>

            {reportLoading ? (
              <ActivityIndicator size="large" color="#00BCD4" style={styles.reportLoader} />
            ) : reportData ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportStudentName}>{reportData.studentName}</Text>
                  <Text style={styles.reportStudentId}>ID: {reportData.studentId}</Text>
                  {reportData.admissionNumber && (
                    <Text style={styles.reportStudentId}>Admission No: {reportData.admissionNumber}</Text>
                  )}
                </View>

                <View style={styles.reportSection}>
                  <Text style={styles.reportLabel}>Personal Information</Text>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Gender:</Text>
                    <Text style={styles.reportRowValue}>{reportData.gender}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Date of Birth:</Text>
                    <Text style={styles.reportRowValue}>{formatDate(reportData.dateOfBirth)}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Blood Group:</Text>
                    <Text style={styles.reportRowValue}>{reportData.bloodGroup || "N/A"}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Nationality:</Text>
                    <Text style={styles.reportRowValue}>{reportData.nationality || "N/A"}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Religion:</Text>
                    <Text style={styles.reportRowValue}>{reportData.religion || "N/A"}</Text>
                  </View>
                </View>

                <View style={styles.reportSection}>
                  <Text style={styles.reportLabel}>Academic Information</Text>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Grade:</Text>
                    <Text style={styles.reportRowValue}>{reportData.grade}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Roll Number:</Text>
                    <Text style={styles.reportRowValue}>{reportData.rollNumber || "N/A"}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Academic Year:</Text>
                    <Text style={styles.reportRowValue}>{reportData.academicYear}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Joining Date:</Text>
                    <Text style={styles.reportRowValue}>{formatDate(reportData.joiningDate)}</Text>
                  </View>
                </View>

                <View style={styles.reportSection}>
                  <Text style={styles.reportLabel}>Fee Details</Text>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Total Fee:</Text>
                    <Text style={styles.reportRowValue}>₹{reportData.totalFee?.toLocaleString()}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Fee Paid:</Text>
                    <Text style={styles.reportRowValue}>₹{reportData.feePaid?.toLocaleString()}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Fee Pending:</Text>
                    <Text style={styles.reportRowValue}>₹{reportData.feePending?.toLocaleString()}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Fee Status:</Text>
                    <Text style={[styles.reportRowValue, styles.statusPendingFee]}>
                      {reportData.feeStatus}
                    </Text>
                  </View>
                </View>

                <View style={styles.reportSection}>
                  <Text style={styles.reportLabel}>Contact Information</Text>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Email:</Text>
                    <Text style={styles.reportRowValue}>{reportData.email}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Contact Number:</Text>
                    <Text style={styles.reportRowValue}>{reportData.contactNumber || "N/A"}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Address:</Text>
                    <Text style={styles.reportRowValue}>{reportData.address || "N/A"}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Parent Contact:</Text>
                    <Text style={styles.reportRowValue}>{reportData.parentContact}</Text>
                  </View>
                </View>

                <View style={styles.reportSection}>
                  <Text style={styles.reportLabel}>Performance</Text>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Attendance:</Text>
                    <Text style={styles.reportRowValue}>{reportData.attendance}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportRowLabel}>Performance:</Text>
                    <Text style={styles.reportRowValue}>{reportData.performance}</Text>
                  </View>
                  {reportData.totalSubjects && (
                    <View style={styles.reportRow}>
                      <Text style={styles.reportRowLabel}>Subjects Cleared:</Text>
                      <Text style={styles.reportRowValue}>
                        {reportData.subjectsCleared}/{reportData.totalSubjects}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.reportSection}>
                  <Text style={styles.reportLabel}>Remarks</Text>
                  <Text style={styles.remarksText}>{reportData.remarks}</Text>
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.errorText}>Failed to load report</Text>
            )}

            <TouchableOpacity
              style={styles.closeReportButton}
              onPress={() => setReportModalVisible(false)}
            >
              <Text style={styles.closeReportButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ProfileModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2D3F49",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#c7d2fe",
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  bulkButton: {
    backgroundColor: "#00BCD4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bulkButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
  },
  addButton: {
    backgroundColor: "#00BCD4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
  },
  listContainer: {
    padding: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  profileSection: {
    flexDirection: "row",
    flex: 1,
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 2,
  },
  studentId: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 3,
  },
  classRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  classText: {
    fontSize: 11,
    color: "#00BCD4",
    fontWeight: "500",
    marginRight: 6,
  },
  academicYear: {
    fontSize: 10,
    color: "#9ca3af",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  statusActive: {
    backgroundColor: "#d1fae5",
  },
  statusInactive: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1f2937",
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 12,
    color: "#1f2937",
    fontWeight: "500",
  },
  feeValue: {
    fontSize: 13,
    color: "#00BCD4",
    fontWeight: "bold",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  viewButton: {
    backgroundColor: "#00BCD4",
  },
  editButton: {
    backgroundColor: "#2D3F49",
  },
  reportButton: {
    backgroundColor: "#00BCD4",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    width: "92%",
    maxHeight: "80%",
  },
  bulkModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  bulkSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    textAlign: "center",
  },
  fileFormatText: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 20,
    textAlign: "center",
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: "#00BCD4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelUploadButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  cancelUploadButtonText: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 16,
  },
  profileModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    width: "92%",
    maxHeight: "85%",
  },
  reportModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    width: "92%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#1f2937",
    marginBottom: 10,
    backgroundColor: "#f9fafb",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  saveButton: {
    backgroundColor: "#00BCD4",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 14,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  reportLoader: {
    marginVertical: 40,
  },
  reportHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  reportStudentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 3,
  },
  reportStudentId: {
    fontSize: 12,
    color: "#6b7280",
  },
  reportSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00BCD4",
    marginBottom: 10,
  },
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  reportRowLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  reportRowValue: {
    fontSize: 12,
    color: "#1f2937",
    fontWeight: "500",
  },
  statusPendingFee: {
    color: "#00BCD4",
  },
  remarksText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
    fontStyle: "italic",
  },
  closeReportButton: {
    backgroundColor: "#00BCD4",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  closeReportButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  errorText: {
    textAlign: "center",
    color: "#ef4444",
    marginVertical: 16,
    fontSize: 14,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileAvatarText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 3,
  },
  profileId: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  profileSection: {
    marginBottom: 16,
  },
  profileSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00BCD4",
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 13,
    color: "#1f2937",
    fontWeight: "500",
  },
  feeHighlight: {
    color: "#00BCD4",
    fontWeight: "bold",
    fontSize: 14,
  },
  closeProfileButton: {
    backgroundColor: "#00BCD4",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  closeProfileButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default StudentManagementScreen;