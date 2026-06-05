import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, useWindowDimensions, ActivityIndicator, Platform } from "react-native";
import { Search, Edit, X, Plus, Trash2, Truck, Phone, MapPin, BadgeInfo } from "lucide-react-native";
import { useState, useEffect } from "react";
import { rootApi } from "../../../utils/axiosInstance";

const DRIVER_BASE_URL = "http://192.168.88.20:8081";

export default function DriversManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    experience: "",
    address: "",
    licenseNumber: "", // maps to licenseNo for PUT
    phoneNo: "",
  });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await rootApi.get(`${DRIVER_BASE_URL}/api/driver/all`);
      if (response.data) {
        setDrivers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);


  const openEdit = (driverItem: any) => {
    setEditingDriver(driverItem);
    setFormData({ 
      fullName: driverItem.fullName || "", 
      experience: String(driverItem.experience || ""), 
      address: driverItem.address || "", 
      licenseNumber: driverItem.licenseNo || "", 
      phoneNo: driverItem.phoneNo || ""
    });
    setModalVisible(true);
  };

  const handleDelete = (driverId: string) => {
    Alert.alert(
      "Delete Driver",
      "Are you sure you want to delete this driver?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await rootApi.delete(`${DRIVER_BASE_URL}/api/driver/${driverId}`);
              Alert.alert("Success", "Driver deleted successfully.");
              fetchDrivers();
            } catch (error) {
              console.error("Failed to delete driver:", error);
              Alert.alert("Error", "Failed to delete driver.");
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.phoneNo || !formData.licenseNumber) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      if (editingDriver) {
        // PUT /api/driver/{driverId}
        const updatePayload = {
          id: editingDriver.id,
          fullName: formData.fullName,
          experience: formData.experience,
          address: formData.address,
          licenseNo: formData.licenseNumber, // backend expects licenseNo for update
          phoneNo: formData.phoneNo
        };
        await rootApi.put(`${DRIVER_BASE_URL}/api/driver/${editingDriver.id}`, updatePayload);
        Alert.alert("Success", "Driver updated successfully.");
      }
      
      setModalVisible(false);
      fetchDrivers();
    } catch (error: any) {
      console.error("Failed to save driver:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to save driver.");
    } finally {
      setSaving(false);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.licenseNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.phoneNo?.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Drivers Management</Text>
          <Text style={styles.headerSubtitle}>View and update details of school bus drivers.</Text>
        </View>
      </View>

      <View style={{ marginHorizontal: isMobile ? 12 : 24, marginTop: 20, marginBottom: 10 }}>
        <View style={styles.searchBox}>
          <Search size={18} color="#B8A095" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search by name, license, or phone..." 
            placeholderTextColor="#B8A095" 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
        ) : filteredDrivers.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Truck size={48} color="#E6D8D2" />
            <Text style={styles.emptyText}>No drivers found.</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 }}>
            {filteredDrivers.map(item => (
              <View key={item.id} style={{ width: isMobile ? "100%" : "33.33%", padding: 8 }}>
                <View style={styles.driverCard}>
                  <View style={styles.driverCardHeader}>
                    <View style={styles.driverAvatar}>
                      <Truck size={24} color="#E35336" />
                    </View>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(item)}>
                        <Edit size={16} color="#8A6B5D" />
                      </TouchableOpacity>

                    </View>
                  </View>
                  <Text style={styles.driverNameText}>{item.fullName}</Text>
                  
                  <View style={styles.infoRow}>
                    <Phone size={14} color="#A0522D" />
                    <Text style={styles.infoText}>{item.phoneNo}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <BadgeInfo size={14} color="#A0522D" />
                    <Text style={styles.infoText}>License: {item.licenseNo}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MapPin size={14} color="#A0522D" />
                    <Text style={styles.infoText} numberOfLines={1}>{item.address}</Text>
                  </View>

                  <View style={styles.driverCardFooter}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.experience} Years Exp.</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isMobile ? "90%" : 500 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Driver</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#8A6B5D" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput style={styles.input} value={formData.fullName} onChangeText={t => setFormData({...formData, fullName: t})} placeholder="John Doe" placeholderTextColor="#B8A095" />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput style={styles.input} value={formData.phoneNo} onChangeText={t => setFormData({...formData, phoneNo: t})} placeholder="+1 234 567 890" placeholderTextColor="#B8A095" keyboardType="phone-pad" />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>License Number *</Text>
                <TextInput style={styles.input} value={formData.licenseNumber} onChangeText={t => setFormData({...formData, licenseNumber: t})} placeholder="DL00123" placeholderTextColor="#B8A095" />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Experience (Years)</Text>
                <TextInput style={styles.input} value={formData.experience} onChangeText={t => setFormData({...formData, experience: t})} placeholder="5" placeholderTextColor="#B8A095" keyboardType="numeric" />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput style={styles.input} value={formData.address} onChangeText={t => setFormData({...formData, address: t})} placeholder="Full address" placeholderTextColor="#B8A095" />
              </View>


            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Save Driver</Text>}
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

  driverCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E6D8D2", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  driverCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  driverAvatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: "rgba(227, 83, 54, 0.1)", justifyContent: "center", alignItems: "center" },
  actionBtn: { padding: 8, backgroundColor: "#F5F5DC", borderRadius: 8 },
  driverNameText: { fontSize: 18, fontWeight: "bold", color: "#A0522D", marginBottom: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 8 },
  infoText: { fontSize: 13, color: "#8A6B5D", flex: 1 },
  driverCardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F5F5DC", marginTop: 8 },
  badge: { backgroundColor: "#F5F5DC", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: "bold", color: "#A0522D" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24, maxHeight: "90%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D" },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#705244", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 8, padding: 12, fontSize: 15, color: "#A0522D", backgroundColor: "#F5F5DC", ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any },
  saveBtn: { backgroundColor: "#E35336", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
