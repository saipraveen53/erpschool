import { Calendar, Megaphone, Plus, Search, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { rootApi } from "../../../utils/axiosInstance";

const NOTICE_BASE_URL = "https://school-management-crba.onrender.com";

export default function NoticesManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    noticeName: "",
    noticeDescription: "",
    noticeType: "GENERAL",
    noticeDate: new Date().toISOString().split('T')[0],
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await rootApi.get(`${NOTICE_BASE_URL}/api/student/notice/all`);
      if (response.data && Array.isArray(response.data)) {
        // Sort newest first
        const sorted = response.data.sort((a, b) => new Date(b.noticeDate).getTime() - new Date(a.noticeDate).getTime());
        setNotices(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openAdd = () => {
    setFormData({ 
      noticeName: "", 
      noticeDescription: "", 
      noticeType: "GENERAL", 
      noticeDate: new Date().toISOString().split('T')[0] 
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.noticeName || !formData.noticeDescription) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      const createPayload = {
        noticeName: formData.noticeName,
        noticeDescription: formData.noticeDescription,
        noticeType: formData.noticeType,
        noticeDate: formData.noticeDate
      };
      
      await rootApi.post(`${NOTICE_BASE_URL}/api/student/notice/create`, createPayload);
      Alert.alert("Success", "Notice created successfully.");
      
      setModalVisible(false);
      fetchNotices();
    } catch (error: any) {
      console.error("Failed to create notice:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to create notice.");
    } finally {
      setSaving(false);
    }
  };

  const filteredNotices = notices.filter(n => 
    n.noticeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.noticeDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Notices & Announcements</Text>
          <Text style={styles.headerSubtitle}>Manage announcements and alerts for everyone in the school.</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addButtonText}>Add Notice</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: isMobile ? 12 : 24, marginTop: 20, marginBottom: 10 }}>
        <View style={styles.searchBox}>
          <Search size={18} color="#B8A095" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search notices..." 
            placeholderTextColor="#B8A095" 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
        ) : filteredNotices.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Megaphone size={48} color="#E6D8D2" />
            <Text style={styles.emptyText}>No notices found.</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "column", gap: 16, width: "100%" }}>
            {filteredNotices.map(item => (
              <View key={item.id}>
                <View style={styles.noticeCard}>
                  <View style={styles.cardHeader}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                      <View style={[styles.iconBox, { backgroundColor: item.noticeType === 'URGENT' ? 'rgba(225, 29, 72, 0.1)' : 'rgba(244, 164, 96, 0.15)' }]}>
                        <Megaphone size={20} color={item.noticeType === 'URGENT' ? "#e11d48" : "#A0522D"} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.noticeName} numberOfLines={1}>{item.noticeName}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            <Calendar size={12} color="#B8A095" />
                            <Text style={styles.dateText}>{item.noticeDate}</Text>
                          </View>
                          <View style={[styles.typeBadge, { backgroundColor: item.noticeType === 'URGENT' ? 'rgba(225, 29, 72, 0.1)' : '#F5F5DC' }]}>
                            <Text style={[styles.typeBadgeText, { color: item.noticeType === 'URGENT' ? '#e11d48' : '#8A6B5D' }]}>{item.noticeType}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.cardBody}>
                    <Text style={styles.noticeDescription}>{item.noticeDescription}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Notice Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 500 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Notice</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#8A6B5D" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Notice Title *</Text>
                <TextInput style={styles.input} value={formData.noticeName} onChangeText={t => setFormData({...formData, noticeName: t})} placeholder="E.g., Welcome Back" placeholderTextColor="#B8A095" />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput 
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
                  value={formData.noticeDescription} 
                  onChangeText={t => setFormData({...formData, noticeDescription: t})} 
                  placeholder="Enter full details..." 
                  placeholderTextColor="#B8A095" 
                  multiline 
                />
              </View>
              
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Notice Type</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                    <TouchableOpacity 
                      style={[styles.radioBtn, formData.noticeType === 'GENERAL' && styles.radioBtnActive]} 
                      onPress={() => setFormData({...formData, noticeType: 'GENERAL'})}
                    >
                      <Text style={[styles.radioText, formData.noticeType === 'GENERAL' && styles.radioTextActive]}>General</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.radioBtn, formData.noticeType === 'URGENT' && styles.radioBtnActive]} 
                      onPress={() => setFormData({...formData, noticeType: 'URGENT'})}
                    >
                      <Text style={[styles.radioText, formData.noticeType === 'URGENT' && styles.radioTextActive]}>Urgent</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Notice Date</Text>
                  <TextInput 
                    style={styles.input} 
                    value={formData.noticeDate} 
                    onChangeText={t => setFormData({...formData, noticeDate: t})} 
                    placeholder="YYYY-MM-DD" 
                    placeholderTextColor="#B8A095" 
                  />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Publish Notice</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", zIndex: 100, elevation: 10, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 14, color: "#8A6B5D", marginTop: 4 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E35336", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  addButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E6D8D2", elevation: 1, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: "#A0522D" },
  emptyStateContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { textAlign: "center", marginTop: 16, color: "#B8A095", fontSize: 15 },

  noticeCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#E6D8D2", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, overflow: 'hidden' },
  cardHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5DC', backgroundColor: '#fafaf9' },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  noticeName: { fontSize: 16, fontWeight: "bold", color: "#A0522D" },
  dateText: { fontSize: 12, color: "#B8A095", fontWeight: '500' },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  typeBadgeText: { fontSize: 10, fontWeight: 'bold' },
  
  cardBody: { padding: 16 },
  noticeDescription: { fontSize: 14, color: "#705244", lineHeight: 22 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24, maxHeight: "90%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D" },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#705244", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 8, padding: 12, fontSize: 15, color: "#A0522D", backgroundColor: "#F5F5DC", ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any },
  
  radioBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E6D8D2', alignItems: 'center' },
  radioBtnActive: { backgroundColor: '#F4A460', borderColor: '#F4A460' },
  radioText: { fontSize: 13, fontWeight: '600', color: '#8A6B5D' },
  radioTextActive: { color: '#5C2E14' },
  
  saveBtn: { backgroundColor: "#E35336", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 16 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
