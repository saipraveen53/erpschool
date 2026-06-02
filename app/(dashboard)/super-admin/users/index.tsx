import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, useWindowDimensions } from "react-native";
import { Search, Shield, Edit, Trash2, X, Plus, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function UsersManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([
    { id: "1", name: "Alice Freeman", email: "alice@greenwood.edu", role: "ADMIN", status: "Active", lastLogin: "2 hours ago" },
    { id: "2", name: "Bob Smith", email: "bsmith@stmarys.org", role: "PRINCIPAL", status: "Active", lastLogin: "5 hours ago" },
    { id: "3", name: "Carol Davis", email: "cdavis@oakridge.net", role: "TEACHER", status: "Inactive", lastLogin: "2 days ago" },
  ]);
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
      { text: "Delete", style: "destructive", onPress: () => setUsers(users.filter(u => u.id !== id)) }
    ]);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) {
      Alert.alert("Error", "Please fill in Name, Email, and Role.");
      return;
    }
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      setUsers([...users, { id: Date.now().toString(), lastLogin: "Just now", ...formData }]);
    }
    setModalVisible(false);
    setFormData({ name: "", email: "", role: "ADMIN", status: "Active" });
    setEditingUser(null);
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setModalVisible(true);
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 12 : 0 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 24 }]}>User Management</Text>
          <Text style={styles.headerSubtitle}>View and manage all system users</Text>
        </View>
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: 12, width: isMobile ? "100%" : "auto" }}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: "#F4A460", width: isMobile ? "100%" : "auto" }]}
            onPress={() => router.push("/super-admin/invite-principal" as any)}
          >
            <Plus size={18} color="#fff" />
            <Text style={styles.addButtonText}>Invite Principal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: "#E35336", width: isMobile ? "100%" : "auto" }]}
            onPress={() => router.push("/super-admin/invite-principal?defaultRole=admin" as any)}
          >
            <Shield size={18} color="#fff" />
            <Text style={styles.addButtonText}>Invite Admin</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={styles.filterTab}>
            <Plus size={14} color="#8A6B5D" style={{ marginRight: 4 }} />
            <Text style={styles.filterTabText}>Add Role</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40 }}>
        {filteredUsers.length === 0 && (
          <Text style={styles.emptyText}>No users found.</Text>
        )}

        {isMobile ? (
          filteredUsers.map(user => (
            <TouchableOpacity
              key={user.id}
              style={styles.card}
              onPress={() => router.push(`/super-admin/users/${user.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{user.name}</Text>
                  <Text style={styles.cardEmail}>{user.email}</Text>
                </View>
                <ChevronRight size={18} color="#D0BDB3" />
              </View>
              <View style={styles.cardMeta}>
                <View style={styles.roleBadge}>
                  <Shield size={10} color="#E35336" style={{ marginRight: 4 }} />
                  <Text style={styles.roleText}>{user.role}</Text>
                </View>
                <Text style={styles.schoolText} numberOfLines={1}>{user.role === "ADMIN" || user.role === "PRINCIPAL" ? "System Access" : "Staff"}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => toggleStatus(user.id)}>
                    <View style={[styles.statusBadge, { backgroundColor: user.status === "Active" ? "#dcfce7" : "#F4A460" }]}>
                      <Text style={[styles.statusText, { color: user.status === "Active" ? "#166534" : "#8A6B5D" }]}>{user.status}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { marginLeft: 8 }]} onPress={() => openEdit(user)}>
                    <Edit size={14} color="#8A6B5D" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { marginLeft: 6 }]} onPress={() => handleDelete(user.id)}>
                    <Trash2 size={14} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          /* ── Desktop Table Layout ── */
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <View style={{ width: 40, justifyContent: "center" }}>
                <TouchableOpacity onPress={toggleSelectAll} style={[styles.checkbox, selectedIds.length === filteredUsers.length && filteredUsers.length > 0 && styles.checkboxActive]}>
                  {selectedIds.length === filteredUsers.length && filteredUsers.length > 0 && <View style={styles.checkboxInner} />}
                </TouchableOpacity>
              </View>
              <Text style={[styles.th, { flex: 2.5 }]}>User</Text>
              <Text style={[styles.th, { flex: 2 }]}>Role</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: "center" }]}>Last Login</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: "center" }]}>Status</Text>
              <Text style={[styles.th, { flex: 1, textAlign: "center" }]}>Actions</Text>
            </View>
            {filteredUsers.map(user => (
              <TouchableOpacity
                key={user.id}
                style={styles.tableRow}
                onPress={() => router.push(`/super-admin/users/${user.id}`)}
              >
                <View style={[styles.td, { width: 40 }]}>
                  <TouchableOpacity onPress={() => toggleSelect(user.id)} style={[styles.checkbox, selectedIds.includes(user.id) && styles.checkboxActive]}>
                    {selectedIds.includes(user.id) && <View style={styles.checkboxInner} />}
                  </TouchableOpacity>
                </View>
                <View style={[styles.td, { flex: 2.5, flexDirection: "row", alignItems: "center" }]}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName} numberOfLines={1}>{user.name}</Text>
                    <Text style={styles.cardEmail} numberOfLines={1}>{user.email}</Text>
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
                <View style={[styles.td, { flex: 1, flexDirection: "row", justifyContent: "center" }]}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(user)}>
                    <Edit size={14} color="#8A6B5D" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { marginLeft: 4 }]} onPress={() => handleDelete(user.id)}>
                    <Trash2 size={14} color="#ef4444" />
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
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2" },
  headerTitle: { fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E35336", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8, justifyContent: "center" },
  addButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E6D8D2", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, gap: 10, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, color: "#A0522D" },
  filterTabsRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", paddingBottom: 16, gap: 16, marginBottom: 20 },
  filterTab: { flexDirection: "row", alignItems: "center", paddingBottom: 6 },
  filterTabActive: { borderBottomWidth: 2, borderBottomColor: "#E35336" },
  filterTabText: { fontSize: 14, color: "#8A6B5D", fontWeight: "500" },
  filterTabTextActive: { color: "#A0522D", fontWeight: "700" },
  emptyText: { textAlign: "center", marginVertical: 40, color: "#B8A095", fontSize: 15 },

  // Mobile Cards
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardName: { fontSize: 15, fontWeight: "700", color: "#A0522D" },
  cardEmail: { fontSize: 12, color: "#8A6B5D", marginTop: 2 },
  cardMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F4A460", flexWrap: "wrap", gap: 6 },
  cardActions: { flexDirection: "row", alignItems: "center" },
  schoolText: { fontSize: 12, color: "#705244", flex: 1, textAlign: "center" },

  // Avatar
  avatarContainer: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#F4A460", justifyContent: "center", alignItems: "center", marginRight: 10, flexShrink: 0 },
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
