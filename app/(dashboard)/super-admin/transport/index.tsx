import { useRouter } from "expo-router";
import { AlertTriangle, Bus, Calendar, CheckCircle, ChevronRight, Clock, Map, Plus, X } from "lucide-react-native";
import { createElement, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { rootApi } from "../../../utils/axiosInstance";

export default function TransportDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"routes" | "issues" | "attendance">("routes");
  const [loading, setLoading] = useState(false);

  // Data States
  const [routes, setRoutes] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);

  // Create Route Modal State
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [routeForm, setRouteForm] = useState({
    routeName: "",
    pickupStartTime: "",
    dropStartTime: "",
    vehicleName: "",
    vehicleNumber: ""
  });

  // Attendance Date filter
  const [attendanceDate, setAttendanceDate] = useState(() => new Date());
  const [showAttendanceDatePicker, setShowAttendanceDatePicker] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "routes") {
        const res = await rootApi.get('/api/student/transport/routes');
        if (res.data) setRoutes(res.data);
      } else if (activeTab === "issues") {
        const res = await rootApi.get('/api/student/transport/all-issues');
        if (res.data) setIssues(res.data);
      } else if (activeTab === "attendance") {
        const formattedDate = attendanceDate.toISOString().split('T')[0];
        const res = await rootApi.get(`/api/student/transport/attendance-summary?date=${formattedDate}`);
        if (res.data) setAttendance(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch transport data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, attendanceDate]);

  const handleCreateRoute = async () => {
    if (!routeForm.routeName || !routeForm.vehicleName || !routeForm.vehicleNumber) {
      return Alert.alert("Error", "Please fill out route name and vehicle details.");
    }

    try {
      setCreating(true);
      await rootApi.post('/api/student/transport/route', routeForm);
      Alert.alert("Success", "Route created successfully.");
      setCreateModalVisible(false);
      setRouteForm({ routeName: "", pickupStartTime: "", dropStartTime: "", vehicleName: "", vehicleNumber: "" });
      fetchData();
    } catch (err) {
      Alert.alert("Error", "Failed to create route.");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    try {
      await rootApi.patch(`/api/student/transport/${issueId}/status?status=${newStatus}`);
      Alert.alert('Success', `Issue marked as ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error("Error updating status", err);
      Alert.alert('Error', 'Failed to update issue status');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { padding: isMobile ? 14 : 24, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: 16 }]}>
        <View style={{ flex: 1, marginBottom: isMobile ? 16 : 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Bus size={24} color="#E35336" />
            <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 26 }]}>Transport Management</Text>
          </View>
          <Text style={styles.headerSubtitle}>Manage school bus routes, driver assignments, and track attendance.</Text>
        </View>

        {activeTab === "routes" && (
          <TouchableOpacity style={styles.createBtn} onPress={() => setCreateModalVisible(true)}>
            <Plus size={20} color="#fff" />
            <Text style={styles.createBtnText}>Create Route</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "routes" && styles.tabBtnActive]}
            onPress={() => setActiveTab("routes")}
          >
            <Map size={16} color={activeTab === "routes" ? "#E35336" : "#8A6B5D"} />
            <Text style={[styles.tabText, activeTab === "routes" && styles.tabTextActive]}>Routes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "issues" && styles.tabBtnActive]}
            onPress={() => setActiveTab("issues")}
          >
            <AlertTriangle size={16} color={activeTab === "issues" ? "#E35336" : "#8A6B5D"} />
            <Text style={[styles.tabText, activeTab === "issues" && styles.tabTextActive]}>Driver Issues</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "attendance" && styles.tabBtnActive]}
            onPress={() => setActiveTab("attendance")}
          >
            <Calendar size={16} color={activeTab === "attendance" ? "#E35336" : "#8A6B5D"} />
            <Text style={[styles.tabText, activeTab === "attendance" && styles.tabTextActive]}>Attendance</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* ROUTES TAB */}
            {activeTab === "routes" && (
              routes.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Bus size={32} color="#E35336" style={{ marginBottom: 16 }} />
                  <Text style={styles.emptyTitle}>No Routes Found</Text>
                  <Text style={styles.emptyText}>Get started by creating a new transport route.</Text>
                </View>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 }}>
                  {routes.map((route, idx) => (
                    <View key={route.routeId || idx} style={{ width: isMobile ? "100%" : "33.33%", padding: 8 }}>
                      <TouchableOpacity style={styles.routeCard} onPress={() => router.push(`/super-admin/transport/${route.routeId}` as any)}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.routeName} numberOfLines={1}>{route.routeName}</Text>
                          <Text style={styles.routeIdTag}>{route.routeId}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Bus size={14} color="#8A6B5D" style={{ marginRight: 6 }} />
                          <Text style={styles.infoText}>{route.vehicleName} ({route.vehicleNumber})</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Clock size={14} color="#8A6B5D" style={{ marginRight: 6 }} />
                          <Text style={styles.infoText}>{route.pickupStartTime || 'N/A'} - {route.dropStartTime || 'N/A'}</Text>
                        </View>

                        <View style={styles.cardFooter}>
                          <Text style={styles.viewDetailsText}>Manage Route</Text>
                          <ChevronRight size={16} color="#E35336" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )
            )}

            {/* ISSUES TAB */}
            {activeTab === "issues" && (
              issues.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <CheckCircle size={32} color="#16a34a" style={{ marginBottom: 16 }} />
                  <Text style={styles.emptyTitle}>No Issues</Text>
                  <Text style={styles.emptyText}>All operations are running smoothly without driver reports.</Text>
                </View>
              ) : (
                <View style={styles.listContainer}>
                  {issues.map((issue, idx) => (
                    <View key={issue.issueId || idx} style={styles.listItem}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <View>
                          <Text style={styles.listItemTitle}>{issue.issueType}</Text>
                          <Text style={styles.listItemSub}>Driver: {issue.driverId} • {issue.reportDate}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: issue.status === 'RESOLVED' ? '#dcfce7' : '#fee2e2' }]}>
                          <Text style={[styles.statusText, { color: issue.status === 'RESOLVED' ? '#16a34a' : '#ef4444' }]}>{issue.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.listItemDesc}>{issue.description}</Text>
                      {issue.status !== 'RESOLVED' && (
                        <TouchableOpacity
                          style={{ marginTop: 12, backgroundColor: '#16a34a', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                          onPress={() => updateIssueStatus(issue.issueId, 'RESOLVED')}
                        >
                          <CheckCircle size={14} color="#fff" />
                          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Mark as Resolved</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === "attendance" && (
              <View style={styles.attendanceContainer}>
                <View style={{ marginBottom: 24 }}>
                  <Text style={styles.label}>Select Date</Text>
                  {Platform.OS === 'web' ? (
                    createElement('input', {
                      type: 'date',
                      value: attendanceDate.toISOString().split('T')[0],
                      onChange: (e: any) => {
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getTime())) setAttendanceDate(d);
                      },
                      style: {
                        padding: '12px', borderRadius: '8px', borderWidth: '1px', borderColor: '#E6D8D2', backgroundColor: '#FDF8F0', outline: 'none', color: '#0f172a'
                      }
                    })
                  ) : (
                    <>
                      <TouchableOpacity style={[styles.input, { justifyContent: 'center', width: 200 }]} onPress={() => setShowAttendanceDatePicker(true)}>
                        <Text style={{ color: '#0f172a' }}>{attendanceDate.toISOString().split('T')[0]}</Text>
                      </TouchableOpacity>
                      {showAttendanceDatePicker && (
                        <DateTimePicker
                          value={attendanceDate}
                          mode="date"
                          display="default"
                          onChange={(event, date) => {
                            setShowAttendanceDatePicker(false);
                            if (date) setAttendanceDate(date);
                          }}
                        />
                      )}
                    </>
                  )}
                </View>

                {attendance ? (
                  <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
                    <View style={styles.statCard}>
                      <Text style={styles.statLabel}>Total Students</Text>
                      <Text style={[styles.statValue, { color: '#0f172a' }]}>{attendance.total || 0}</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Text style={styles.statLabel}>Present</Text>
                      <Text style={[styles.statValue, { color: '#16a34a' }]}>{attendance.present || 0}</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Text style={styles.statLabel}>Absent</Text>
                      <Text style={[styles.statValue, { color: '#ef4444' }]}>{attendance.absent || 0}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.emptyText}>No attendance data available for this date.</Text>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Create Route Modal */}
      <Modal visible={createModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 450 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Route</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 24 }}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Route Name *</Text>
                <TextInput
                  style={styles.input}
                  value={routeForm.routeName}
                  onChangeText={t => setRouteForm({ ...routeForm, routeName: t })}
                  placeholder="e.g., Lb nagar"
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Pickup Start Time</Text>
                  {Platform.OS === 'web' ? (
                    createElement('input', {
                      type: 'time',
                      value: routeForm.pickupStartTime,
                      onChange: (e: any) => setRouteForm({ ...routeForm, pickupStartTime: e.target.value }),
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
                      value={routeForm.pickupStartTime}
                      onChangeText={t => setRouteForm({ ...routeForm, pickupStartTime: t })}
                      placeholder="8:00 AM"
                    />
                  )}
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Drop Start Time</Text>
                  {Platform.OS === 'web' ? (
                    createElement('input', {
                      type: 'time',
                      value: routeForm.dropStartTime,
                      onChange: (e: any) => setRouteForm({ ...routeForm, dropStartTime: e.target.value }),
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
                      value={routeForm.dropStartTime}
                      onChangeText={t => setRouteForm({ ...routeForm, dropStartTime: t })}
                      placeholder="4:00 PM"
                    />
                  )}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Vehicle Name *</Text>
                <TextInput
                  style={styles.input}
                  value={routeForm.vehicleName}
                  onChangeText={t => setRouteForm({ ...routeForm, vehicleName: t })}
                  placeholder="e.g., School Bus 1"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Vehicle Number *</Text>
                <TextInput
                  style={styles.input}
                  value={routeForm.vehicleNumber}
                  onChangeText={t => setRouteForm({ ...routeForm, vehicleNumber: t })}
                  placeholder="e.g., TS05ER6789"
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreateRoute} disabled={creating}>
              {creating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>Save Route</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", justifyContent: "space-between", zIndex: 100 },
  headerTitle: { fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },

  createBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E35336', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, gap: 8 },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  tabsContainer: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#E6D8D2' },
  tabsScroll: { paddingHorizontal: 24, flexDirection: 'row' },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent', gap: 8 },
  tabBtnActive: { borderBottomColor: '#E35336' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#8A6B5D' },
  tabTextActive: { color: '#E35336' },

  emptyStateContainer: { alignItems: "center", marginTop: 60, padding: 24, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E6D8D2', borderStyle: 'dashed' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#A0522D', marginBottom: 8 },
  emptyText: { textAlign: "center", color: "#8A6B5D", fontSize: 14, maxWidth: 300 },

  routeCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E6D8D2' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  routeName: { fontSize: 16, fontWeight: 'bold', color: '#A0522D', flex: 1, marginRight: 8 },
  routeIdTag: { fontSize: 12, color: '#8A6B5D', backgroundColor: '#F5F5DC', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#8A6B5D' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E6D8D2' },
  viewDetailsText: { fontSize: 14, fontWeight: '600', color: '#E35336' },

  listContainer: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E6D8D2', overflow: 'hidden' },
  listItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E6D8D2' },
  listItemTitle: { fontSize: 16, fontWeight: 'bold', color: '#A0522D', marginBottom: 2 },
  listItemSub: { fontSize: 12, color: '#8A6B5D' },
  listItemDesc: { fontSize: 14, color: '#475569', marginTop: 8 },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: 'bold' },

  attendanceContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 24, borderWidth: 1, borderColor: '#E6D8D2' },
  statCard: { flex: 1, minWidth: 100, backgroundColor: '#F5F5DC', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E6D8D2' },
  statLabel: { fontSize: 14, color: '#8A6B5D', marginBottom: 8 },
  statValue: { fontSize: 32, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E6D8D2' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#A0522D' },

  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#A0522D', marginBottom: 8 },
  input: { backgroundColor: '#F5F5DC', borderWidth: 1, borderColor: '#E6D8D2', borderRadius: 8, padding: 12, fontSize: 15, color: '#A0522D' },

  submitBtn: { backgroundColor: '#E35336', padding: 16, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});