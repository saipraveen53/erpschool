import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, useWindowDimensions } from "react-native";
import { Plus, Search, Building2, Edit, Trash2, X, ChevronRight } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function SchoolsManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [schools, setSchools] = useState([
    { id: "1", name: "Greenwood High", domain: "greenwood.edu", plan: "Enterprise", status: "Active", users: 1240, created: "11 Feb, 2024" },
    { id: "2", name: "St. Mary's Academy", domain: "stmarys.org", plan: "Pro", status: "Active", users: 850, created: "13 Feb, 2024" },
    { id: "3", name: "Oakridge International", domain: "oakridge.net", plan: "Basic", status: "Inactive", users: 320, created: "15 Feb, 2024" },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (params.newSchool) {
      try {
        const parsed = JSON.parse(params.newSchool as string);
        setSchools(prev => {
          if (!prev.find(s => s.id === parsed.id)) return [parsed, ...prev];
          return prev;
        });
      } catch (e) {}
    }
  }, [params.newSchool]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", domain: "", status: "Active" });

  const filteredSchools = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || s.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSchools.length) setSelectedIds([]);
    else setSelectedIds(filteredSchools.map(s => s.id));
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this school?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setSchools(schools.filter(s => s.id !== id)) },
    ]);
  };

  const handleSave = () => {
    if (!formData.name || !formData.domain) { Alert.alert("Error", "Please fill in all fields."); return; }
    if (editingSchool) {
      setSchools(schools.map(s => s.id === editingSchool.id ? { ...s, ...formData } : s));
    } else {
      setSchools([...schools, { id: Date.now().toString(), users: 0, plan: "Basic", created: "Just now", ...formData }]);
    }
    setModalVisible(false);
    setFormData({ name: "", domain: "", status: "Active" });
    setEditingSchool(null);
  };

  const openEdit = (school: any) => {
    setEditingSchool(school);
    setFormData({ name: school.name, domain: school.domain, status: school.status });
    setModalVisible(true);
  };

  const toggleStatus = (id: string) => {
    setSchools(schools.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 12 : 0 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 24 }]}>Schools Management</Text>
          <Text style={styles.headerSubtitle}>Manage all registered schools and tenants</Text>
        </View>
        <TouchableOpacity style={[styles.addButton, { width: isMobile ? "100%" : "auto" }]} onPress={() => router.push("/super-admin/schools/create")}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addButtonText}>Add School</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filters */}
      <View style={{ marginHorizontal: isMobile ? 12 : 20, marginTop: 20 }}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94a3b8" />
          <TextInput style={styles.searchInput} placeholder="Search schools by name or domain..." placeholderTextColor="#94a3b8" value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <View style={styles.filterTabsRow}>
          {["All", "Active", "Inactive"].map(filter => (
            <TouchableOpacity key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}>
              <Text style={[styles.filterTabText, activeFilter === filter && styles.filterTabTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.filterTab}>
            <Plus size={14} color="#64748b" style={{ marginRight: 4 }} />
            <Text style={styles.filterTabText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 20, paddingBottom: 40 }}>
        {filteredSchools.length === 0 && <Text style={styles.emptyText}>No schools found.</Text>}

        {isMobile ? (
          /* Mobile Cards */
          filteredSchools.map(school => (
            <TouchableOpacity key={school.id} style={styles.card} onPress={() => router.push(`/super-admin/schools/${school.id}`)} activeOpacity={0.8}>
              <View style={styles.cardTop}>
                <View style={styles.cardIconWrap}><Building2 size={18} color="#2F6BFF" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{school.name}</Text>
                  <Text style={styles.cardDomain}>{school.domain}</Text>
                </View>
                <ChevronRight size={18} color="#cbd5e1" />
              </View>
              <View style={styles.cardMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Users</Text>
                  <Text style={styles.metaValue}>{school.users}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Status</Text>
                  <TouchableOpacity onPress={() => toggleStatus(school.id)}>
                    <View style={[styles.statusBadge, { backgroundColor: school.status === "Active" ? "#dcfce7" : "#f1f5f9" }]}>
                      <Text style={[styles.statusText, { color: school.status === "Active" ? "#166534" : "#64748b" }]}>{school.status}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(school)}><Edit size={15} color="#64748b" /></TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { marginLeft: 8 }]} onPress={() => handleDelete(school.id)}><Trash2 size={15} color="#ef4444" /></TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          /* Desktop Table — flex columns fill full width */
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <View style={{ width: 40, justifyContent: "center" }}>
                <TouchableOpacity onPress={toggleSelectAll} style={[styles.checkbox, selectedIds.length === filteredSchools.length && filteredSchools.length > 0 && styles.checkboxActive]}>
                  {selectedIds.length === filteredSchools.length && filteredSchools.length > 0 && <View style={styles.checkboxInner} />}
                </TouchableOpacity>
              </View>
              <Text style={[styles.th, { flex: 2.5 }]}>School Name</Text>
              <Text style={[styles.th, { flex: 2 }]}>Domain</Text>
              <Text style={[styles.th, { flex: 1 }]}>Plan</Text>
              <Text style={[styles.th, { flex: 1, textAlign: "center" }]}>Users</Text>
              <Text style={[styles.th, { flex: 1.2, textAlign: "center" }]}>Created</Text>
              <Text style={[styles.th, { flex: 1.2, textAlign: "center" }]}>Status</Text>
              <Text style={[styles.th, { flex: 1, textAlign: "center" }]}>Actions</Text>
            </View>
            {filteredSchools.map(school => (
              <TouchableOpacity key={school.id} style={styles.tableRow} onPress={() => router.push(`/super-admin/schools/${school.id}`)}>
                <View style={[styles.td, { width: 40 }]}>
                  <TouchableOpacity onPress={() => toggleSelect(school.id)} style={[styles.checkbox, selectedIds.includes(school.id) && styles.checkboxActive]}>
                    {selectedIds.includes(school.id) && <View style={styles.checkboxInner} />}
                  </TouchableOpacity>
                </View>
                <View style={[styles.td, { flex: 2.5, flexDirection: "row", alignItems: "center" }]}>
                  <View style={styles.iconContainer}><Building2 size={15} color="#2F6BFF" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.schoolName} numberOfLines={1}>{school.name}</Text>
                  </View>
                </View>
                <View style={[styles.td, { flex: 2, justifyContent: "center" }]}>
                  <Text style={styles.schoolDomain} numberOfLines={1}>{school.domain}</Text>
                </View>
                <View style={[styles.td, { flex: 1, justifyContent: "center" }]}>
                  <Text style={styles.planText} numberOfLines={1}>{school.plan}</Text>
                </View>
                <View style={[styles.td, { flex: 1, alignItems: "center" }]}>
                  <Text style={styles.usersText}>{school.users}</Text>
                </View>
                <View style={[styles.td, { flex: 1.2, alignItems: "center" }]}>
                  <Text style={styles.dateText}>{school.created}</Text>
                </View>
                <View style={[styles.td, { flex: 1.2, alignItems: "center" }]}>
                  <TouchableOpacity onPress={() => toggleStatus(school.id)}>
                    <View style={[styles.statusBadge, { backgroundColor: school.status === "Active" ? "#ecfdf5" : "#fff7ed", borderColor: school.status === "Active" ? "#a7f3d0" : "#fed7aa" }]}>
                      <View style={[styles.statusDot, { backgroundColor: school.status === "Active" ? "#10b981" : "#f97316" }]} />
                      <Text style={[styles.statusText, { color: school.status === "Active" ? "#059669" : "#c2410c" }]}>{school.status}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.td, { flex: 1, flexDirection: "row", justifyContent: "center" }]}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(school)}><Edit size={14} color="#64748b" /></TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { marginLeft: 6 }]} onPress={() => handleDelete(school.id)}><Trash2 size={14} color="#ef4444" /></TouchableOpacity>
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
              <Text style={styles.modalTitle}>{editingSchool ? "Edit School" : "Add New School"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#64748b" /></TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>School Name</Text>
              <TextInput style={styles.input} value={formData.name} onChangeText={t => setFormData({ ...formData, name: t })} placeholder="e.g. Springfield High" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Domain</Text>
              <TextInput style={styles.input} value={formData.domain} onChangeText={t => setFormData({ ...formData, domain: t })} placeholder="e.g. springfield.edu" />
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{editingSchool ? "Save Changes" : "Create School"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7FE" },
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  headerTitle: { fontWeight: "bold", color: "#1e293b" },
  headerSubtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#2F6BFF", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8, justifyContent: "center" },
  addButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, gap: 10, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, color: "#1e293b" },
  filterTabsRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 16, gap: 16, marginBottom: 20 },
  filterTab: { flexDirection: "row", alignItems: "center", paddingBottom: 6 },
  filterTabActive: { borderBottomWidth: 2, borderBottomColor: "#2F6BFF" },
  filterTabText: { fontSize: 14, color: "#64748b", fontWeight: "500" },
  filterTabTextActive: { color: "#1e293b", fontWeight: "700" },
  emptyText: { textAlign: "center", marginVertical: 40, color: "#94a3b8", fontSize: 15 },
  // Mobile Cards
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#EFF4FF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  cardName: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  cardDomain: { fontSize: 13, color: "#64748b", marginTop: 2 },
  cardMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  metaItem: { alignItems: "flex-start" },
  metaLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "500", marginBottom: 4 },
  metaValue: { fontSize: 14, fontWeight: "700", color: "#1e293b" },
  cardActions: { flexDirection: "row", alignItems: "center" },
  tableContainer: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2, marginBottom: 40, borderWidth: 1, borderColor: "#f1f5f9" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f1f5f9", paddingVertical: 14, paddingHorizontal: 8, alignItems: "center" },
  th: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f8fafc", paddingVertical: 16, paddingHorizontal: 8, alignItems: "center" },
  td: { paddingHorizontal: 4 },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: "#cbd5e1", justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: "#2F6BFF", borderColor: "#2F6BFF" },
  checkboxInner: { width: 8, height: 8, borderRadius: 2, backgroundColor: "#fff" },
  iconContainer: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#eff6ff", justifyContent: "center", alignItems: "center", marginRight: 12, flexShrink: 0 },
  schoolName: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
  schoolDomain: { fontSize: 13, color: "#64748b" },
  planText: { fontSize: 13, color: "#475569", fontWeight: "500" },
  usersText: { fontSize: 13, color: "#475569" },
  dateText: { fontSize: 13, color: "#64748b" },
  // Shared
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: "600" },
  actionBtn: { padding: 6, backgroundColor: "#f1f5f9", borderRadius: 6 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#475569", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, padding: 12, fontSize: 15, color: "#1e293b", backgroundColor: "#f8fafc" },
  saveBtn: { backgroundColor: "#2F6BFF", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
