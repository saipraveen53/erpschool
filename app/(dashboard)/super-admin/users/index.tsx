import { useRouter } from "expo-router";
import { ChevronDown, ChevronRight, Plus, Search, Shield, User, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { rootApi } from "../../../utils/axiosInstance";

export default function UsersManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await rootApi.get('/api/student/teacher/all');
      if (response.data) {
        const fetchedUsers = response.data.map((t: any) => ({
          id: t.teacherId || t.id,
          name: t.teacherName || t.name,
          email: t.email,
          role: t.role || "TEACHER",
          status: t.active === false ? "Inactive" : (t.status || "Active"),
          lastLogin: t.phone || t.lastLogin || "N/A"
        }));
        setUsers(fetchedUsers);
      }
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      Alert.alert("Error", "Failed to load staff data.");
    } finally {
      setLoading(false);
    }
  };
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "ADMIN", status: "Active" });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || u.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) setSelectedIds([]);
    else setSelectedIds(filteredUsers.map(u => u.id));
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to remove this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await rootApi.delete(`/api/student/teacher/${id}`);
            Alert.alert("Success", "User deleted successfully");
            fetchTeachers();
          } catch (error) {
            Alert.alert("Error", "Failed to delete user");
          }
        }
      }
    ]);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      Alert.alert("Error", "Please fill in Name, Email, and Role.");
      return;
    }

    try {
      if (editingUser) {
        await rootApi.put(`/api/student/teacher/${editingUser.id}`, formData);
        Alert.alert("Success", "User updated successfully");
      } else {
        await rootApi.post(`/api/student/teacher`, formData);
        Alert.alert("Success", "User created successfully");
      }
      setModalVisible(false);
      setFormData({ name: "", email: "", role: "ADMIN", status: "Active" });
      setEditingUser(null);
      fetchTeachers();
    } catch (error) {
      Alert.alert("Error", "Failed to save user");
    }
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setModalVisible(true);
  };

  const toggleStatus = async (id: string) => {
    try {
      await rootApi.put(`/api/student/teacher/${id}/toggle-status`);
      fetchTeachers();
    } catch (error) {
      Alert.alert("Error", "Failed to toggle status");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 18 : 24 }]} numberOfLines={1}>Teacher Management</Text>
          <Text style={[styles.headerSubtitle, { fontSize: isMobile ? 12 : 14 }]} numberOfLines={1}>View and manage all teachers</Text>
        </View>
      </View>

      {/* Search & Filters */}
      <View style={{ marginHorizontal: isMobile ? 12 : 24, marginTop: 20 }}>
        <View style={styles.searchBox}>
          <Search size={18} color="#B8A095" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, or role..."
            placeholderTextColor="#B8A095"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.filterTabsRow}>
          {["All", "Active", "Inactive"].map(filter => (
            <TouchableOpacity key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}>
              <Text style={[styles.filterTabText, activeFilter === filter && styles.filterTabTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
        ) : filteredUsers.length === 0 ? (
          <Text style={styles.emptyText}>No staff found.</Text>
        ) : isMobile ? (
          <View style={{ backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: "#E6D8D2", marginBottom: 20 }}>
            {filteredUsers.map((user, idx) => (
              <TouchableOpacity
                key={user.id}
                style={[styles.mobileListItem, idx === filteredUsers.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => router.push(`/super-admin/users/${user.id}` as any)}
                activeOpacity={0.7}
              >
                <View style={styles.mobileAvatarContainer}>
                  <Text style={styles.mobileAvatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.mobileName} numberOfLines={1}>{user.name}</Text>
                  <Text style={styles.mobileEmail} numberOfLines={1}>{user.email}</Text>
                </View>
                <View style={styles.mobileRightArea}>
                  <Text style={styles.mobileRole}>{user.role}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={[styles.statusDot, { backgroundColor: user.status === "Active" ? "#10b981" : "#f97316", marginRight: 4 }]} />
                    <Text style={{ fontSize: 12, color: user.status === "Active" ? "#10b981" : "#f97316", marginRight: 4 }}>{user.status}</Text>
                    <ChevronRight size={16} color="#B8A095" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>

              <Text style={[styles.th, { flex: 2.5 }]}>Staff Member</Text>
              <Text style={[styles.th, { flex: 2 }]}>Role</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: "center" }]}>Phone</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: "center" }]}>Status</Text>
            </View>
            {filteredUsers.map(user => (
              <TouchableOpacity
                key={user.id}
                style={styles.tableRow}
                onPress={() => router.push(`/super-admin/users/${user.id}`)}
              >

                <View style={[styles.td, { flex: 2.5, flexDirection: "row", alignItems: "center" }]}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mobileName} numberOfLines={1}>{user.name}</Text>
                    <Text style={styles.mobileEmail} numberOfLines={1}>{user.email}</Text>
                  </View>
                </View>
                <View style={[styles.td, { flex: 2, justifyContent: "center" }]}>
                  <View style={styles.roleBadge}>
                    <Shield size={10} color="#E35336" style={{ marginRight: 4 }} />
                    <Text style={styles.roleText}>{user.role}</Text>
                  </View>
                </View>
                <View style={[styles.td, { flex: 1.5, alignItems: "center" }]}>
                  <Text style={styles.dateText}>{user.lastLogin}</Text>
                </View>
                <View style={[styles.td, { flex: 1.5, alignItems: "center" }]}>
                  <TouchableOpacity onPress={() => toggleStatus(user.id)}>
                    <View style={[styles.statusBadge, { backgroundColor: user.status === "Active" ? "#ecfdf5" : "#fff7ed", borderColor: user.status === "Active" ? "#a7f3d0" : "#fed7aa" }]}>
                      <View style={[styles.statusDot, { backgroundColor: user.status === "Active" ? "#10b981" : "#f97316" }]} />
                      <Text style={[styles.statusText, { color: user.status === "Active" ? "#059669" : "#c2410c" }]}>{user.status}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "92%" : "90%", maxWidth: 500 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingUser ? "Edit User" : "Add New User"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#8A6B5D" />
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={formData.name} onChangeText={t => setFormData({ ...formData, name: t })} placeholder="e.g. John Doe" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} value={formData.email} onChangeText={t => setFormData({ ...formData, email: t })} placeholder="e.g. john@example.com" keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Role</Text>
              <TextInput style={styles.input} value={formData.role} onChangeText={t => setFormData({ ...formData, role: t.toUpperCase() })} placeholder="ADMIN" />
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{editingUser ? "Save Changes" : "Create User"}</Text>
            </TouchableOpacity>
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
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E35336", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8, justifyContent: "center" },
  addButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  dropdownMenu: { position: "absolute", top: "100%", right: 0, marginTop: 8, backgroundColor: "#fff", borderRadius: 12, padding: 8, borderWidth: 1, borderColor: "#E6D8D2", shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 8, zIndex: 50, minWidth: 200 },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: 8, flexDirection: "row", alignItems: "center" },
  dropdownIconBg: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", marginRight: 12 },
  dropdownItemText: { fontSize: 14, color: "#A0522D", fontWeight: "700" },
  dropdownItemSub: { fontSize: 11, color: "#8A6B5D", marginTop: 2 },
  dropdownDivider: { height: 1, backgroundColor: "#F5F5DC", marginVertical: 4 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E6D8D2", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, gap: 10, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, color: "#A0522D" },
  filterTabsRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", paddingBottom: 16, gap: 16, marginBottom: 20 },
  filterTab: { flexDirection: "row", alignItems: "center", paddingBottom: 6 },
  filterTabActive: { borderBottomWidth: 2, borderBottomColor: "#E35336" },
  filterTabText: { fontSize: 14, color: "#8A6B5D", fontWeight: "500" },
  filterTabTextActive: { color: "#A0522D", fontWeight: "700" },
  emptyText: { textAlign: "center", marginVertical: 40, color: "#B8A095", fontSize: 15 },

  // Mobile List
  mobileListItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F5F5DC" },
  mobileAvatarContainer: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#F5F5DC", justifyContent: "center", alignItems: "center", marginRight: 12, borderWidth: 1, borderColor: "#E6D8D2" },
  mobileAvatarText: { fontSize: 16, fontWeight: "bold", color: "#E35336" },
  mobileName: { fontSize: 15, fontWeight: "600", color: "#A0522D" },
  mobileEmail: { fontSize: 13, color: "#8A6B5D", marginTop: 2 },
  mobileRole: { fontSize: 12, fontWeight: "700", color: "#A0522D", marginBottom: 6 },
  mobileRightArea: { alignItems: "flex-end", justifyContent: "center" },

  // Avatar
  avatarContainer: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#F5F5DC", justifyContent: "center", alignItems: "center", marginRight: 10, flexShrink: 0 },
  avatarText: { fontSize: 14, fontWeight: "bold", color: "#E35336" },

  // Role
  roleBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#F4A460", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: "#E59551" },
  roleText: { fontSize: 11, fontWeight: "700", color: "#E35336" },

  // Table
  tableContainer: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2, marginBottom: 40, borderWidth: 1, borderColor: "#F4A460" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F4A460", paddingVertical: 14, paddingHorizontal: 8, alignItems: "center" },
  th: { fontSize: 12, fontWeight: "600", color: "#8A6B5D" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F5F5DC", paddingVertical: 16, paddingHorizontal: 8, alignItems: "center" },
  td: { paddingHorizontal: 4 },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: "#D0BDB3", justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: "#E35336", borderColor: "#E35336" },
  checkboxInner: { width: 8, height: 8, borderRadius: 2, backgroundColor: "#fff" },

  // Shared
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: "600" },
  actionBtn: { padding: 7, backgroundColor: "#F4A460", borderRadius: 8 },
  dateText: { fontSize: 13, color: "#8A6B5D" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D" },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#705244", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 8, padding: 12, fontSize: 15, color: "#A0522D", backgroundColor: "#F5F5DC" },
  saveBtn: { backgroundColor: "#E35336", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
