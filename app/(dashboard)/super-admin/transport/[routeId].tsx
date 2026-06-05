import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MapPin, Plus, X } from "lucide-react-native";
import { createElement, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { rootApi } from "../../../utils/axiosInstance";

export default function RouteDetails() {
  const { routeId } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const [routeDetails, setRouteDetails] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const [allDrivers, setAllDrivers] = useState<any[]>([]);
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  const [driverId, setDriverId] = useState("");
  const [assigningDriver, setAssigningDriver] = useState(false);

  const [assignStudentModal, setAssignStudentModal] = useState(false);
  const [assigningStudent, setAssigningStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({
    studentId: "",
    pickupStop: "",
    dropStop: "",
    pickupTime: "",
    dropTime: "",
    feeStatus: "PAID"
  });

  const fetchDetails = async () => {
    try {
      setLoading(true);
      // Fetch Route Details by looking up in routes
      const routesRes = await rootApi.get('/api/student/transport/routes');
      if (routesRes.data) {
        const route = routesRes.data.find((r: any) => r.routeId === routeId);
        if (route) setRouteDetails(route);
      }

      // Fetch assigned students
      try {
        const studentsRes = await rootApi.get(`/api/student/transport/route/${routeId}/students`);
        if (studentsRes.data && Array.isArray(studentsRes.data)) {
          setStudents(studentsRes.data);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setStudents([]);
        } else {
          console.error("Failed to fetch assigned students", err);
        }
      }
    } catch (e) {
      console.error("Failed to fetch route details", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // Fetch all students for the searchable dropdown
    rootApi.get('http://192.168.88.20:8081/api/student/allStudents').then(res => {
      if (res.data && Array.isArray(res.data)) {
        setAllStudents(res.data);
      }
    }).catch(err => console.error("Failed to fetch all students", err));
    // Fetch all drivers for the searchable dropdown
    rootApi.get('http://192.168.88.20:8081/api/driver/all').then(res => {
      if (res.data && Array.isArray(res.data)) {
        setAllDrivers(res.data);
      }
    }).catch(err => console.error("Failed to fetch all drivers", err));
  }, [routeId]);

  const handleAssignDriver = async () => {
    if (!driverId.trim()) return Alert.alert("Error", "Enter Driver ID");
    try {
      setAssigningDriver(true);
      await rootApi.put(`/api/student/transport/route/${routeId}/assign-driver?driverId=${driverId}`);
      Alert.alert("Success", "Driver assigned successfully.");
      setDriverId("");
      fetchDetails();
    } catch (e) {
      Alert.alert("Error", "Failed to assign driver.");
      console.error(e);
    } finally {
      setAssigningDriver(false);
    }
  };

  const handleAssignStudent = async () => {
    if (!studentForm.studentId || !studentForm.pickupStop || !studentForm.dropStop) {
      return Alert.alert("Error", "Please fill out required fields (Student ID, Pickup, Drop).");
    }
    try {
      setAssigningStudent(true);
      const payload = {
        routeId,
        pickupStop: studentForm.pickupStop,
        dropStop: studentForm.dropStop,
        pickupTime: studentForm.pickupTime,
        dropTime: studentForm.dropTime,
        feeStatus: studentForm.feeStatus
      };
      await rootApi.post(`/api/student/transport/assign/${studentForm.studentId}`, payload);
      Alert.alert("Success", "Student assigned successfully.");
      setAssignStudentModal(false);
      setStudentForm({ studentId: "", pickupStop: "", dropStop: "", pickupTime: "", dropTime: "", feeStatus: "PAID" });
      fetchDetails();
    } catch (e) {
      Alert.alert("Error", "Failed to assign student.");
      console.error(e);
    } finally {
      setAssigningStudent(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={20} color="#8A6B5D" />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.routeIdTag}>Route ID: {routeId}</Text>
          <Text style={styles.headerTitle}>{routeDetails?.routeName || "Loading Route..."}</Text>
          <Text style={styles.headerSubtitle}>
            {routeDetails ? `Vehicle: ${routeDetails.vehicleName} (${routeDetails.vehicleNumber}) | ${routeDetails.pickupStartTime} - ${routeDetails.dropStartTime}` : "Manage driver and students for this route."}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 250, paddingTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
        ) : (
          <View style={{ gap: 24 }}>

            {/* Driver Assignment Section */}
            <View style={[styles.sectionCard, { zIndex: 50 }]}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Assign Driver</Text>
                  <Text style={styles.sectionSubtitle}>Link a driver to this route.</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-end', zIndex: 40 }}>
                <View style={{ flex: 1, position: 'relative' }}>
                  <Text style={styles.label}>Driver ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Search by ID or Name..."
                    value={driverId}
                    onChangeText={t => {
                      setDriverId(t);
                      setShowDriverDropdown(true);
                    }}
                    onFocus={() => setShowDriverDropdown(true)}
                  />
                  {showDriverDropdown && (
                    <View style={[styles.dropdownContainer, { top: 75 }]}>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                        {allDrivers
                          .filter((d: any) =>
                          (String(d.id || "").toLowerCase().includes(driverId.toLowerCase()) ||
                            String(d.fullName || "").toLowerCase().includes(driverId.toLowerCase()))
                          )
                          .slice(0, 20)
                          .map((d: any, idx: number) => (
                            <TouchableOpacity
                              key={idx}
                              style={styles.dropdownItem}
                              onPress={() => {
                                setDriverId(d.id);
                                setShowDriverDropdown(false);
                              }}
                            >
                              <Text style={{ fontWeight: '600', color: '#A0522D' }}>{d.id}</Text>
                              <Text style={{ color: '#8A6B5D', fontSize: 13 }}>{d.fullName}</Text>
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                <TouchableOpacity style={[styles.submitBtn, { height: 48, justifyContent: 'center', paddingVertical: 0 }]} onPress={handleAssignDriver} disabled={assigningDriver}>
                  {assigningDriver ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>Assign</Text>}
                </TouchableOpacity>
              </View>
            </View>

            {/* Students Section */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Assigned Students</Text>
                  <Text style={styles.sectionSubtitle}>{students.length} students travel on this route.</Text>
                </View>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setAssignStudentModal(true)}>
                  <Plus size={16} color="#fff" />
                  <Text style={styles.actionBtnText}>Add Student</Text>
                </TouchableOpacity>
              </View>

              {students.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No students assigned yet.</Text>
                </View>
              ) : (
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Student</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Stops</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Timings</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Fee Status</Text>
                  </View>
                  {students.map((stu, i) => (
                    <View key={i} style={styles.tableRow}>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.tableCellMain}>{stu.studentId}</Text>
                        {stu.driverName && <Text style={styles.tableCellSub}>Driver: {stu.driverName}</Text>}
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.tableCellMain}><MapPin size={12} color="#16a34a" /> {stu.pickupStop}</Text>
                        <Text style={styles.tableCellMain}><MapPin size={12} color="#ef4444" /> {stu.dropStop}</Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.tableCellMain}>{stu.pickupTime} - {stu.dropTime}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.tableCellMain, { color: stu.feeStatus === 'PAID' ? '#16a34a' : '#E35336', fontWeight: 'bold' }]}>
                          {stu.feeStatus}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

          </View>
        )}
      </ScrollView>

      {/* Assign Student Modal */}
      <Modal visible={assignStudentModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 450 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Student</Text>
              <TouchableOpacity onPress={() => setAssignStudentModal(false)}>
                <X size={24} color="#8A6B5D" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 24 }} contentContainerStyle={{ paddingBottom: 150 }}>
              <View style={[styles.formGroup, { position: 'relative', zIndex: 50 }]}>
                <Text style={styles.label}>Student ID *</Text>
                <TextInput
                  style={styles.input}
                  value={studentForm.studentId}
                  onChangeText={t => {
                    setStudentForm({ ...studentForm, studentId: t });
                    setShowStudentDropdown(true);
                  }}
                  onFocus={() => setShowStudentDropdown(true)}
                  placeholder="Search by ID or Name..."
                />
                {showStudentDropdown && (
                  <View style={styles.dropdownContainer}>
                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                      {allStudents
                        .filter((stu: any) =>
                        (String(stu.studentId || "").toLowerCase().includes(studentForm.studentId.toLowerCase()) ||
                          String(stu.fullName || "").toLowerCase().includes(studentForm.studentId.toLowerCase()))
                        )
                        .slice(0, 20)
                        .map((stu: any, idx: number) => (
                          <TouchableOpacity
                            key={idx}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setStudentForm({ ...studentForm, studentId: stu.studentId });
                              setShowStudentDropdown(false);
                            }}
                          >
                            <Text style={{ fontWeight: '600', color: '#A0522D' }}>{stu.studentId}</Text>
                            <Text style={{ color: '#8A6B5D', fontSize: 13 }}>{stu.fullName}</Text>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Pickup Stop *</Text>
                  <TextInput
                    style={styles.input}
                    value={studentForm.pickupStop}
                    onChangeText={t => setStudentForm({ ...studentForm, pickupStop: t })}
                    placeholder="e.g., LB Nagar"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Drop Stop *</Text>
                  <TextInput
                    style={styles.input}
                    value={studentForm.dropStop}
                    onChangeText={t => setStudentForm({ ...studentForm, dropStop: t })}
                    placeholder="e.g., Hastinapuram"
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12, zIndex: 10 }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Pickup Time</Text>
                  {Platform.OS === 'web' ? (
                    createElement('input', {
                      type: 'time',
                      value: studentForm.pickupTime,
                      onChange: (e: any) => setStudentForm({ ...studentForm, pickupTime: e.target.value }),
                      style: {
                        backgroundColor: '#F5F5DC',
                        borderWidth: 1,
                        borderColor: '#E6D8D2',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 15,
                        color: '#A0522D',
                        fontFamily: 'inherit',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                      }
                    })
                  ) : (
                    <TextInput
                      style={styles.input}
                      value={studentForm.pickupTime}
                      onChangeText={t => setStudentForm({ ...studentForm, pickupTime: t })}
                      placeholder="10:00 AM"
                    />
                  )}
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Drop Time</Text>
                  {Platform.OS === 'web' ? (
                    createElement('input', {
                      type: 'time',
                      value: studentForm.dropTime,
                      onChange: (e: any) => setStudentForm({ ...studentForm, dropTime: e.target.value }),
                      style: {
                        backgroundColor: '#F5F5DC',
                        borderWidth: 1,
                        borderColor: '#E6D8D2',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 15,
                        color: '#A0522D',
                        fontFamily: 'inherit',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                      }
                    })
                  ) : (
                    <TextInput
                      style={styles.input}
                      value={studentForm.dropTime}
                      onChangeText={t => setStudentForm({ ...studentForm, dropTime: t })}
                      placeholder="12:00 PM"
                    />
                  )}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Fee Status</Text>
                <TextInput
                  style={styles.input}
                  value={studentForm.feeStatus}
                  onChangeText={t => setStudentForm({ ...studentForm, feeStatus: t })}
                  placeholder="PAID / PENDING"
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAssignStudent} disabled={assigningStudent}>
              {assigningStudent ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>Assign Student</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { backgroundColor: "#ffffff", paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: "#E6D8D2" },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtnText: { color: "#8A6B5D", fontSize: 14, fontWeight: '500' },
  routeIdTag: { fontSize: 12, color: '#8A6B5D', backgroundColor: '#F5F5DC', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },

  sectionCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E6D8D2', padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#A0522D' },
  sectionSubtitle: { fontSize: 13, color: '#8A6B5D', marginTop: 2 },

  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E35336', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, gap: 6 },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  emptyState: { padding: 32, alignItems: 'center', backgroundColor: '#F5F5DC', borderRadius: 8, borderWidth: 1, borderColor: '#E6D8D2', borderStyle: 'dashed' },
  emptyText: { color: '#8A6B5D', fontSize: 14 },

  tableContainer: { borderWidth: 1, borderColor: '#E6D8D2', borderRadius: 8, overflow: 'hidden' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#F5F5DC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E6D8D2' },
  tableHeaderCell: { fontSize: 12, fontWeight: '600', color: '#8A6B5D' },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E6D8D2', alignItems: 'center', backgroundColor: '#fff' },
  tableCellMain: { fontSize: 14, color: '#A0522D', fontWeight: '500' },
  tableCellSub: { fontSize: 12, color: '#8A6B5D', marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E6D8D2' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#A0522D' },

  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#A0522D', marginBottom: 8 },
  input: { backgroundColor: '#F5F5DC', borderWidth: 1, borderColor: '#E6D8D2', borderRadius: 8, padding: 12, fontSize: 15, color: '#A0522D' },

  dropdownContainer: { position: 'absolute', top: 75, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E6D8D2', zIndex: 9999, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5DC', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  submitBtn: { backgroundColor: '#E35336', padding: 16, alignItems: 'center', borderRadius: 8 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});