import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Modal, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Save } from "lucide-react-native";
import { useState } from "react";

const { width } = Dimensions.get("window");
const isMobile = width < 768;


export default function CreateSchool() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    adminName: "",
    adminEmail: "",
    contactNumber: "",
    address: "",
  });
  const [isActive, setIsActive] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#A0522D" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Add New School</Text>
          <Text style={styles.headerSubtitle}>Register a new tenant in the system</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>School Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>School Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Greenwood High"
              value={formData.name}
              onChangeText={(text: string) => setFormData({...formData, name: text})}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tenant Domain</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. greenwood.edu"
              autoCapitalize="none"
              value={formData.domain}
              onChangeText={(text: string) => setFormData({...formData, domain: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Full address"
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(text: string) => setFormData({...formData, address: text})}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Admin Contact</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Admin Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={formData.adminName}
              onChangeText={(text: string) => setFormData({...formData, adminName: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Admin Email</Text>
            <TextInput
              style={styles.input}
              placeholder="admin@greenwood.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.adminEmail}
              onChangeText={(text: string) => setFormData({...formData, adminEmail: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+1 234 567 8900"
              keyboardType="phone-pad"
              value={formData.contactNumber}
              onChangeText={(text: string) => setFormData({...formData, contactNumber: text})}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.sectionTitle}>Active Status</Text>
              <Text style={styles.switchDesc}>Enable or disable this school account</Text>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#D0BDB3", true: "#3b82f6" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => setModalVisible(true)}
        >
          <Save size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Save School</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, width: 320, alignItems: 'center' }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Save size={30} color="#16a34a" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#A0522D', marginBottom: 8 }}>School Saved!</Text>
            <Text style={{ fontSize: 14, color: '#8A6B5D', textAlign: 'center', marginBottom: 24 }}>The new school has been successfully registered in the system.</Text>
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(false);
                const newSchool = {
                  id: Date.now().toString(),
                  name: formData.name || "New School",
                  domain: formData.domain || "new.edu",
                  status: isActive ? "Active" : "Inactive",
                  users: 1
                };
                router.push({
                  pathname: "/super-admin/schools",
                  params: { newSchool: JSON.stringify(newSchool) }
                });
              }} 
              style={{ backgroundColor: '#E35336', width: '100%', paddingVertical: 14, borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Back to List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: isMobile ? 16 : 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E6D8D2",
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A0522D",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8A6B5D",
    marginTop: 4,
  },
  formContainer: {
    padding: isMobile ? 16 : 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E6D8D2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#A0522D",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#705244",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D0BDB3",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#A0522D",
    backgroundColor: "#F5F5DC",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchDesc: {
    fontSize: 14,
    color: "#8A6B5D",
    marginTop: 4,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#E35336",
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
