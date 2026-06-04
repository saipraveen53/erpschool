import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, useWindowDimensions, ActivityIndicator } from "react-native";
import { Search, Edit, X, Plus, ChevronRight, Users, GraduationCap, ArrowLeft, Mail, Phone, User, Book, Trash2 } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { rootApi } from "../../../utils/axiosInstance";
import * as DocumentPicker from "expo-document-picker";

export default function ClassesManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [classSections, setClassSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);

  const [activeClass, setActiveClass] = useState<any>(null); 
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [classSubjects, setClassSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [formData, setFormData] = useState({ className: "", section: "", academicYear: "", capacity: "0", classTeacherId: "", subjectIds: [] as string[] });

  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentFormData, setStudentFormData] = useState<any>({});
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
  
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);

  const handlePickPhoto = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedPhoto(result.assets[0]);
      }
    } catch (err) {
      console.error("Failed to pick document", err);
    }
  };
  
  useEffect(() => {
    fetchClassSections();
    fetchStudentCount();
  }, []);

  const fetchStudentCount = async () => {
    try {
      const res = await rootApi.get('/api/student/count');
      if (res.data) setStudentCount(res.data);
    } catch (e) {
      console.log("Failed to fetch student count");
    }
  };

  const fetchClassSections = async () => {
    try {
      setLoading(true);
      const response = await rootApi.get('/api/student/class-sections');
      if (response.data) setClassSections(response.data);
    } catch (error) {
      console.error("Failed to fetch class sections:", error);
      Alert.alert("Error", "Failed to load class sections.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForClass = async (classItem: any) => {
    setActiveClass(classItem);
    try {
      setLoadingStudents(true);
      const response = await rootApi.get(`/api/student/class/${classItem.classSectionId}/students`);
      if (response.data) setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      Alert.alert("Error", "Failed to load students for this class.");
    } finally {
      setLoadingStudents(false);
    }
    
    // Fetch subjects for this class section
    try {
      setLoadingSubjects(true);
      const subjectResponse = await rootApi.get(`/api/student/subject/assign/${classItem.classSectionId}`);
      if (subjectResponse.data) setClassSubjects(subjectResponse.data);
    } catch (error) {
      console.log("Failed to fetch subjects for class:", error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const openStudentDetails = async (studentId: string) => {
    setStudentModalVisible(true);
    setLoadingStudentDetails(true);
    try {
      const response = await rootApi.get(`/api/student/${studentId}`);
      if (response.data) {
        setSelectedStudent(response.data);
        setStudentFormData(response.data);
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error("Failed to fetch student details:", error);
      Alert.alert("Error", "Failed to load student details.");
    } finally {
      setLoadingStudentDetails(false);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      setSavingStudent(true);
      
      const updateData = {
        studentId: studentFormData.studentId || "",
        admissionNumber: studentFormData.admissionNumber || "",
        fullName: studentFormData.fullName || "",
        dateOfBirth: studentFormData.dateOfBirth || "",
        gender: studentFormData.gender || "",
        bloodGroup: studentFormData.bloodGroup || "",
        nationality: studentFormData.nationality || "",
        religion: studentFormData.religion || "",
        category: studentFormData.category || "",
        aadhaarNumber: studentFormData.aadhaarNumber || "",
        classSectionId: studentFormData.classSectionId || "",
        grade: studentFormData.grade || "",
        section: studentFormData.section || "",
        academicYear: studentFormData.academicYear || "",
        joiningDate: studentFormData.joiningDate || "",
        rollNumber: studentFormData.rollNumber || "",
        classTeacherId: studentFormData.classTeacherId || "",
        address: studentFormData.address || "",
        city: studentFormData.city || "",
        state: studentFormData.state || "",
        pincode: studentFormData.pincode || "",
        contactNumber: studentFormData.contactNumber || "",
        email: studentFormData.email || "",
        fatherName: studentFormData.fatherName || "",
        fatherContact: studentFormData.fatherContact || "",
        motherName: studentFormData.motherName || "",
        motherContact: studentFormData.motherContact || "",
        guardianName: studentFormData.guardianName || "",
        guardianContact: studentFormData.guardianContact || "",
        emergencyContactName: studentFormData.emergencyContactName || "",
        emergencyContactNumber: studentFormData.emergencyContactNumber || "",
        profileImageUrl: studentFormData.profileImageUrl || "",
        active: studentFormData.active,
        generatedPassword: studentFormData.generatedPassword || "",
        totalFee: parseFloat(studentFormData.totalFee) || 0
      };
      
      const formData = new FormData();
      try {
        formData.append("data", new Blob([JSON.stringify(updateData)], { type: "application/json" }));
      } catch (e) {
        // Fallback for React Native environments where Blob might fail in FormData
        formData.append("data", {
          name: "data.json",
          type: "application/json",
          uri: "data:application/json;utf8," + encodeURIComponent(JSON.stringify(updateData))
        } as any);
      }
      
      if (selectedPhoto) {
        formData.append("photo", {
          uri: selectedPhoto.uri,
          name: selectedPhoto.name,
          type: selectedPhoto.mimeType || "image/jpeg",
        } as any);
      }
      
      await rootApi.put(`/api/student/${selectedStudent.studentId}`, formData, {
        transformRequest: (data, headers) => {
          if (headers && headers["Content-Type"]) {
            delete headers["Content-Type"];
          }
          return data;
        },
      });
      Alert.alert("Success", "Student profile updated successfully.");
      setIsEditingStudent(false);
      openStudentDetails(selectedStudent.studentId);
      if (activeClass) {
        fetchStudentsForClass(activeClass);
      }
    } catch (error) {
      console.error("Failed to update student:", error);
      Alert.alert("Error", "Failed to update student profile.");
    } finally {
      setSavingStudent(false);
    }
  };

  const openEdit = (sectionItem: any) => {
    setEditingSection(sectionItem);
    setFormData({ 
      className: sectionItem.className, 
      section: sectionItem.section, 
      academicYear: sectionItem.academicYear, 
      capacity: String(sectionItem.capacity),
      classTeacherId: sectionItem.classTeacherId || "",
      subjectIds: sectionItem.subjectIds || []
    });
    setModalVisible(true);
  };

  const handleDeleteClass = (classId: string) => {
    Alert.alert(
      "Delete Class Section",
      "Are you sure you want to delete this class section?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await rootApi.put(`/api/superAdmin/delete/${classId}`);
              Alert.alert("Success", "Class section deleted successfully.");
              fetchClassSections();
            } catch (error) {
              console.error("Failed to delete class:", error);
              Alert.alert("Error", "Failed to delete class section.");
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.className || !formData.section) {
      Alert.alert("Error", "Please fill in Class Name and Section.");
      return;
    }
    if (editingSection) {
      try {
        await rootApi.put(`/api/student/class-sections/${editingSection.classSectionId}`, {
          ...formData, capacity: parseInt(formData.capacity, 10) || 0
        });
        Alert.alert("Success", "Class section updated successfully.");
        setModalVisible(false);
        fetchClassSections();
      } catch (error) {
        console.error("Failed to update class section:", error);
        Alert.alert("Error", "Failed to update class section.");
      }
    } else {
      Alert.alert("Notice", "Create endpoint not provided.");
      setModalVisible(false);
    }
  };

  const filteredSections = classSections.filter(c => 
    (c.className && c.className.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (c.section && c.section.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: isMobile ? 16 : 0 }]}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 28 }]} numberOfLines={1}>
            {activeClass ? `${activeClass.className} - ${activeClass.section}` : "Classes & Students"}
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: isMobile ? 12 : 14 }]} numberOfLines={1}>
            {activeClass ? `Academic Year: ${activeClass.academicYear} • Capacity: ${activeClass.capacity}` : "Manage classes, sections, and view students in an innovative way"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {!activeClass && (
            <View style={styles.countBadge}>
              <Users size={16} color="#E35336" />
              <Text style={styles.countBadgeText}>{studentCount} Total Students</Text>
            </View>
          )}
          {activeClass ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: '#F4A460' }]} 
                onPress={() => router.push(`/super-admin/class-sections/manage-subjects?classSectionId=${activeClass.classSectionId}&className=${encodeURIComponent(activeClass.className)}&section=${encodeURIComponent(activeClass.section)}` as any)}
              >
                <Book size={18} color="#5C2E14" />
                <Text style={[styles.addButtonText, { color: '#5C2E14' }]}>Subjects</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={() => setActiveClass(null)}>
                <ArrowLeft size={18} color="#fff" />
                <Text style={styles.backButtonText}>Back to Classes</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>

      {!activeClass && (
        <View style={{ marginHorizontal: isMobile ? 12 : 24, marginTop: 20, marginBottom: 10 }}>
          <View style={styles.searchBox}>
            <Search size={18} color="#B8A095" />
            <TextInput style={styles.searchInput} placeholder="Search classes..." placeholderTextColor="#B8A095" value={searchQuery} onChangeText={setSearchQuery} />
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: activeClass ? 24 : 10 }}>
        {!activeClass ? (
          // Classes Grid View
          loading ? (
            <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
          ) : filteredSections.length === 0 ? (
            <Text style={styles.emptyText}>No classes found.</Text>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 }}>
              {filteredSections.map(item => (
                <View key={item.classSectionId} style={{ width: isMobile ? "100%" : "33.33%", padding: 8 }}>
                  <TouchableOpacity style={styles.classCard} onPress={() => fetchStudentsForClass(item)} activeOpacity={0.8}>
                    <View style={styles.classCardHeader}>
                      <View style={styles.classAvatar}>
                        <GraduationCap size={24} color="#E35336" />
                      </View>
                      <View style={{ flexDirection: "row", gap: 12 }}>
                        <TouchableOpacity style={styles.editIconBtn} onPress={() => openEdit(item)}>
                          <Edit size={16} color="#8A6B5D" />
                        </TouchableOpacity>

                      </View>
                    </View>
                    <Text style={styles.classNameText}>{item.className} - {item.section}</Text>
                    <Text style={styles.classYearText}>Year: {item.academicYear}</Text>
                    <View style={styles.classCardFooter}>
                      <View style={styles.capacityBadge}>
                        <Text style={styles.capacityText}>Cap: {item.capacity}</Text>
                      </View>
                      <View style={styles.viewStudentsBtn}>
                        <Text style={styles.viewStudentsText}>View Students</Text>
                        <ChevronRight size={14} color="#E35336" style={{ marginLeft: 4 }} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )
        ) : (
          // Students & Subjects List View
          <View style={{ flex: 1 }}>
            {/* Subjects Header Section */}
            <View style={{ marginBottom: 24, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E6D8D2' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#5C2E14', marginBottom: 12 }}>Assigned Subjects</Text>
              {loadingSubjects ? (
                <ActivityIndicator size="small" color="#E35336" />
              ) : classSubjects.length === 0 ? (
                <Text style={{ color: '#B8A095', fontSize: 13 }}>No subjects assigned yet.</Text>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {classSubjects.map(sub => (
                    <View key={sub.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5DC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E6D8D2' }}>
                      <Book size={14} color="#E35336" style={{ marginRight: 6 }} />
                      <View>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#5C2E14' }}>{sub.subjectName}</Text>
                        <Text style={{ fontSize: 11, color: sub.teacherId ? '#166534' : '#c2410c', fontWeight: '600' }}>{sub.teacherId ? sub.teacherName : 'Unassigned'}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {loadingStudents ? (
            <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
          ) : students.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Users size={48} color="#E6D8D2" />
              <Text style={styles.emptyText}>No students in this class yet.</Text>
            </View>
          ) : (
            <View style={styles.tableContainer}>
              {isMobile ? (
                students.map((student, idx) => (
                  <TouchableOpacity key={student.studentId} style={[styles.mobileStudentCard, idx === students.length - 1 && { borderBottomWidth: 0 }]} onPress={() => openStudentDetails(student.studentId)}>
                    <Text style={styles.studentName}>{student.fullName}</Text>
                    <Text style={styles.studentId}>ID: {student.studentId}</Text>
                    <View style={{ flexDirection: "row", marginTop: 8, gap: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}><Mail size={12} color="#8A6B5D" style={{ marginRight: 4 }}/><Text style={styles.studentDetail}>{student.email}</Text></View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 4, gap: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}><User size={12} color="#8A6B5D" style={{ marginRight: 4 }}/><Text style={styles.studentDetail}>{student.fatherName}</Text></View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}><Phone size={12} color="#8A6B5D" style={{ marginRight: 4 }}/><Text style={styles.studentDetail}>{student.fatherContact}</Text></View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
                      <Text style={styles.feeText}>Fee: ₹{student.totalFee}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: student.active ? "#ecfdf5" : "#fff7ed" }]}>
                        <Text style={[styles.statusText, { color: student.active ? "#059669" : "#c2410c" }]}>{student.active ? "Active" : "Inactive"}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 2 }]}>Student</Text>
                    <Text style={[styles.th, { flex: 2 }]}>Contact Info</Text>
                    <Text style={[styles.th, { flex: 2 }]}>Parent Info</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Total Fee</Text>
                    <Text style={[styles.th, { flex: 1, textAlign: "center" }]}>Status</Text>
                  </View>
                  {students.map((student) => (
                    <TouchableOpacity key={student.studentId} style={styles.tableRow} onPress={() => openStudentDetails(student.studentId)}>
                      <View style={[styles.td, { flex: 2 }]}>
                        <Text style={styles.studentName}>{student.fullName}</Text>
                        <Text style={styles.studentId}>ID: {student.studentId}</Text>
                      </View>
                      <View style={[styles.td, { flex: 2 }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}><Mail size={12} color="#8A6B5D" style={{ marginRight: 6 }}/><Text style={styles.studentDetail}>{student.email}</Text></View>
                      </View>
                      <View style={[styles.td, { flex: 2 }]}>
                        <Text style={styles.studentDetail}>{student.fatherName}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}><Phone size={12} color="#8A6B5D" style={{ marginRight: 6 }}/><Text style={styles.studentDetail}>{student.fatherContact}</Text></View>
                      </View>
                      <View style={[styles.td, { flex: 1 }]}>
                        <Text style={styles.feeText}>₹{student.totalFee}</Text>
                      </View>
                      <View style={[styles.td, { flex: 1, alignItems: "center" }]}>
                        <View style={[styles.statusBadge, { backgroundColor: student.active ? "#ecfdf5" : "#fff7ed" }]}>
                          <Text style={[styles.statusText, { color: student.active ? "#059669" : "#c2410c" }]}>{student.active ? "Active" : "Inactive"}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "92%" : "90%", maxWidth: 500 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingSection ? "Edit Class Section" : "Add Class Section"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#8A6B5D" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: '80%' }}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Class Name</Text>
                <TextInput style={styles.input} value={formData.className} onChangeText={t => setFormData({ ...formData, className: t })} placeholder="e.g. Grade 10" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Section</Text>
                <TextInput style={styles.input} value={formData.section} onChangeText={t => setFormData({ ...formData, section: t })} placeholder="e.g. A" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Academic Year</Text>
                <TextInput style={styles.input} value={formData.academicYear} onChangeText={t => setFormData({ ...formData, academicYear: t })} placeholder="e.g. 2026-2027" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Capacity</Text>
                <TextInput style={styles.input} value={formData.capacity} onChangeText={t => setFormData({ ...formData, capacity: t })} keyboardType="numeric" placeholder="e.g. 40" />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Student Details Modal */}
      <Modal visible={studentModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "95%" : "80%", maxWidth: 800, maxHeight: "90%", padding: 0, overflow: "hidden" }]}>
            <View style={[styles.modalHeader, { padding: 24, borderBottomWidth: 1, borderBottomColor: "#E6D8D2", marginBottom: 0 }]}>
              <Text style={styles.modalTitle}>Student Profile</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                {!isEditingStudent ? (
                  <TouchableOpacity onPress={() => setIsEditingStudent(true)} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F4A460", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}>
                    <Edit size={16} color="#5C2E14" />
                    <Text style={{ marginLeft: 6, fontWeight: "bold", color: "#5C2E14" }}>Edit</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity onPress={() => setIsEditingStudent(false)} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
                      <Text style={{ fontWeight: "bold", color: "#8A6B5D" }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpdateStudent} disabled={savingStudent} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#10b981", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}>
                      {savingStudent ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ fontWeight: "bold", color: "#fff" }}>Save</Text>}
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity onPress={() => { setStudentModalVisible(false); setSelectedStudent(null); setIsEditingStudent(false); }}>
                  <X size={24} color="#8A6B5D" />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView style={{ padding: 24 }}>
              {loadingStudentDetails ? (
                <ActivityIndicator size="large" color="#E35336" style={{ marginVertical: 40 }} />
              ) : selectedStudent ? (
                <View>
                  {/* Personal Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Personal Information</Text>
                    {isEditingStudent && (
                      <View style={{ marginBottom: 16, alignItems: 'center' }}>
                        <TouchableOpacity onPress={handlePickPhoto} style={{ backgroundColor: '#F4A460', padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ color: '#5C2E14', fontWeight: 'bold' }}>{selectedPhoto ? "Change Photo" : "Upload Photo"}</Text>
                        </TouchableOpacity>
                        {selectedPhoto && <Text style={{ marginTop: 8, fontSize: 12, color: '#A0522D' }}>{selectedPhoto.name}</Text>}
                      </View>
                    )}
                    <View style={styles.detailGrid}>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Full Name</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.fullName} onChangeText={(v) => setStudentFormData({...studentFormData, fullName: v})} /> : <Text style={styles.detailValue}>{selectedStudent.fullName}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Student ID</Text><Text style={styles.detailValue}>{selectedStudent.studentId}</Text></View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Date of Birth</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.dateOfBirth} onChangeText={(v) => setStudentFormData({...studentFormData, dateOfBirth: v})} /> : <Text style={styles.detailValue}>{selectedStudent.dateOfBirth}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Gender</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.gender} onChangeText={(v) => setStudentFormData({...studentFormData, gender: v})} /> : <Text style={styles.detailValue}>{selectedStudent.gender}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Blood Group</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.bloodGroup} onChangeText={(v) => setStudentFormData({...studentFormData, bloodGroup: v})} /> : <Text style={styles.detailValue}>{selectedStudent.bloodGroup}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Aadhaar Number</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.aadhaarNumber} onChangeText={(v) => setStudentFormData({...studentFormData, aadhaarNumber: v})} /> : <Text style={styles.detailValue}>{selectedStudent.aadhaarNumber}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Nationality</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.nationality} onChangeText={(v) => setStudentFormData({...studentFormData, nationality: v})} /> : <Text style={styles.detailValue}>{selectedStudent.nationality}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Religion / Category</Text>{isEditingStudent ? <View style={{flexDirection: 'row'}}><TextInput style={[styles.detailInput, {flex: 1}]} value={studentFormData.religion} onChangeText={(v) => setStudentFormData({...studentFormData, religion: v})} /><Text> / </Text><TextInput style={[styles.detailInput, {flex: 1}]} value={studentFormData.category} onChangeText={(v) => setStudentFormData({...studentFormData, category: v})} /></View> : <Text style={styles.detailValue}>{selectedStudent.religion} / {selectedStudent.category}</Text>}</View>
                    </View>
                  </View>

                  {/* Academic Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Academic Information</Text>
                    <View style={styles.detailGrid}>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Grade & Section</Text>{isEditingStudent ? <View style={{flexDirection: 'row'}}><TextInput style={[styles.detailInput, {flex: 1}]} value={studentFormData.grade} onChangeText={(v) => setStudentFormData({...studentFormData, grade: v})} /><Text> - </Text><TextInput style={[styles.detailInput, {flex: 1}]} value={studentFormData.section} onChangeText={(v) => setStudentFormData({...studentFormData, section: v})} /></View> : <Text style={styles.detailValue}>{selectedStudent.grade} - {selectedStudent.section}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Roll Number</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.rollNumber} onChangeText={(v) => setStudentFormData({...studentFormData, rollNumber: v})} /> : <Text style={styles.detailValue}>{selectedStudent.rollNumber}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Academic Year</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.academicYear} onChangeText={(v) => setStudentFormData({...studentFormData, academicYear: v})} /> : <Text style={styles.detailValue}>{selectedStudent.academicYear}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Joining Date</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.joiningDate} onChangeText={(v) => setStudentFormData({...studentFormData, joiningDate: v})} /> : <Text style={styles.detailValue}>{selectedStudent.joiningDate}</Text>}</View>
                    </View>
                  </View>

                  {/* Contact Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Contact & Address</Text>
                    <View style={styles.detailGrid}>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Contact Number</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.contactNumber} onChangeText={(v) => setStudentFormData({...studentFormData, contactNumber: v})} /> : <Text style={styles.detailValue}>{selectedStudent.contactNumber}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Email</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.email} onChangeText={(v) => setStudentFormData({...studentFormData, email: v})} /> : <Text style={styles.detailValue}>{selectedStudent.email}</Text>}</View>
                      <View style={[styles.detailItem, { width: "100%" }]}><Text style={styles.detailLabel}>Address</Text>{isEditingStudent ? <View style={{flexDirection: 'row'}}><TextInput style={[styles.detailInput, {flex: 2}]} value={studentFormData.address} onChangeText={(v) => setStudentFormData({...studentFormData, address: v})} /><TextInput style={[styles.detailInput, {flex: 1}]} value={studentFormData.city} onChangeText={(v) => setStudentFormData({...studentFormData, city: v})} /><TextInput style={[styles.detailInput, {flex: 1}]} value={studentFormData.state} onChangeText={(v) => setStudentFormData({...studentFormData, state: v})} /><TextInput style={[styles.detailInput, {flex: 1}]} value={studentFormData.pincode} onChangeText={(v) => setStudentFormData({...studentFormData, pincode: v})} /></View> : <Text style={styles.detailValue}>{selectedStudent.address}, {selectedStudent.city}, {selectedStudent.state} - {selectedStudent.pincode}</Text>}</View>
                    </View>
                  </View>

                  {/* Family Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Family Information</Text>
                    <View style={styles.detailGrid}>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Father Name</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.fatherName} onChangeText={(v) => setStudentFormData({...studentFormData, fatherName: v})} /> : <Text style={styles.detailValue}>{selectedStudent.fatherName}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Father Contact</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.fatherContact} onChangeText={(v) => setStudentFormData({...studentFormData, fatherContact: v})} /> : <Text style={styles.detailValue}>{selectedStudent.fatherContact}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Mother Name</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.motherName} onChangeText={(v) => setStudentFormData({...studentFormData, motherName: v})} /> : <Text style={styles.detailValue}>{selectedStudent.motherName}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Mother Contact</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.motherContact} onChangeText={(v) => setStudentFormData({...studentFormData, motherContact: v})} /> : <Text style={styles.detailValue}>{selectedStudent.motherContact}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Guardian Name</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.guardianName} onChangeText={(v) => setStudentFormData({...studentFormData, guardianName: v})} /> : <Text style={styles.detailValue}>{selectedStudent.guardianName || "N/A"}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Guardian Contact</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={studentFormData.guardianContact} onChangeText={(v) => setStudentFormData({...studentFormData, guardianContact: v})} /> : <Text style={styles.detailValue}>{selectedStudent.guardianContact || "N/A"}</Text>}</View>
                    </View>
                  </View>

                  {/* Emergency Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Emergency & Fees</Text>
                    <View style={styles.detailGrid}>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Emergency Contact</Text>{isEditingStudent ? <View style={{flexDirection: 'row'}}><TextInput style={[styles.detailInput, {flex: 1}]} value={studentFormData.emergencyContactName} onChangeText={(v) => setStudentFormData({...studentFormData, emergencyContactName: v})} /><TextInput style={[styles.detailInput, {flex: 1}]} value={studentFormData.emergencyContactNumber} onChangeText={(v) => setStudentFormData({...studentFormData, emergencyContactNumber: v})} /></View> : <Text style={styles.detailValue}>{selectedStudent.emergencyContactName} ({selectedStudent.emergencyContactNumber})</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Total Fee</Text>{isEditingStudent ? <TextInput style={styles.detailInput} value={String(studentFormData.totalFee || '')} onChangeText={(v) => setStudentFormData({...studentFormData, totalFee: v})} keyboardType="numeric" /> : <Text style={styles.detailValue}>₹{selectedStudent.totalFee}</Text>}</View>
                      <View style={styles.detailItem}><Text style={styles.detailLabel}>Status</Text>{isEditingStudent ? <TouchableOpacity onPress={() => setStudentFormData({...studentFormData, active: !studentFormData.active})} style={[styles.statusBadge, { backgroundColor: studentFormData.active ? "#ecfdf5" : "#fff7ed" }]}><Text style={[styles.statusText, { color: studentFormData.active ? "#059669" : "#c2410c" }]}>{studentFormData.active ? "Active" : "Inactive"}</Text></TouchableOpacity> : <Text style={styles.detailValue}>{selectedStudent.active ? "Active" : "Inactive"}</Text>}</View>
                    </View>
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyText}>Student not found.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", zIndex: 100, elevation: 10 },
  headerTitle: { fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E35336", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  addButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  backButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#A0522D", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  backButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  countBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(227, 83, 54, 0.1)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "rgba(227, 83, 54, 0.2)" },
  countBadgeText: { color: "#E35336", fontWeight: "bold", marginLeft: 8, fontSize: 14 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E6D8D2", elevation: 1, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: "#A0522D" },
  emptyStateContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { textAlign: "center", marginTop: 16, color: "#B8A095", fontSize: 15 },

  // Grid
  classCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E6D8D2", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
  classCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  classAvatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: "rgba(227, 83, 54, 0.1)", alignItems: "center", justifyContent: "center" },
  editIconBtn: { padding: 8, backgroundColor: "#F5F5DC", borderRadius: 8 },
  classNameText: { fontSize: 18, fontWeight: "bold", color: "#A0522D", marginBottom: 4 },
  classYearText: { fontSize: 13, color: "#8A6B5D", marginBottom: 20 },
  classCardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F5F5DC" },
  capacityBadge: { backgroundColor: "#F5F5DC", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  capacityText: { fontSize: 12, fontWeight: "bold", color: "#A0522D" },
  viewStudentsBtn: { flexDirection: "row", alignItems: "center" },
  viewStudentsText: { fontSize: 13, fontWeight: "bold", color: "#E35336" },

  // Students Table
  tableContainer: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#E6D8D2", overflow: "hidden" },
  tableHeader: { flexDirection: "row", backgroundColor: "#F5F5DC", paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#E6D8D2" },
  th: { fontSize: 13, fontWeight: "bold", color: "#8A6B5D" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F5F5DC", paddingVertical: 16, paddingHorizontal: 16, alignItems: "center" },
  td: { paddingHorizontal: 4 },
  mobileStudentCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#E6D8D2" },
  studentName: { fontSize: 15, fontWeight: "bold", color: "#A0522D" },
  studentId: { fontSize: 12, color: "#B8A095", marginTop: 2 },
  studentDetail: { fontSize: 13, color: "#705244" },
  feeText: { fontSize: 14, fontWeight: "bold", color: "#E35336" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "bold" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D" },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#705244", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 8, padding: 12, fontSize: 15, color: "#A0522D", backgroundColor: "#F5F5DC" },
  modalInput: { borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, backgroundColor: "#fafaf9", color: "#5C2E14" },
  saveBtn: { backgroundColor: "#E35336", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  
  // Student Profile Detail Modal
  detailSection: { marginBottom: 24, backgroundColor: "#fff", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#E6D8D2" },
  detailSectionTitle: { fontSize: 15, fontWeight: "bold", color: "#E35336", marginBottom: 12, borderBottomWidth: 1, borderBottomColor: "#F5F5DC", paddingBottom: 8 },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 },
  detailItem: { width: "50%", paddingHorizontal: 8, marginBottom: 16 },
  detailLabel: { fontSize: 12, color: "#8A6B5D", marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#5C2E14" },
  detailInput: { borderBottomWidth: 1, borderBottomColor: "#A0522D", paddingVertical: 4, paddingHorizontal: 4, fontSize: 14, color: "#5C2E14", backgroundColor: "#fff7ed", borderRadius: 4, marginHorizontal: 2 }
});
