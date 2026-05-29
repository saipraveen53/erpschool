import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    AlertTriangle,
    ArrowLeft,
    Car,
    Fuel,
    Send,
    Wrench,
} from "lucide-react-native";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const reportTypes = [
  {
    id: "mechanical",
    label: "Mechanical Issue",
    icon: <Wrench size={20} color="#2563eb" />,
  },
  {
    id: "accident",
    label: "Accident",
    icon: <AlertTriangle size={20} color="#dc2626" />,
  },
  { id: "fuel", label: "Fuel Issue", icon: <Fuel size={20} color="#f59e0b" /> },
  { id: "other", label: "Other", icon: <Car size={20} color="#6b7280" /> },
];

export default function VehicleReporting() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert("Error", "Please select a report type");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please provide description");
      return;
    }
    Alert.alert(
      "Report Submitted",
      "Your vehicle report has been submitted to the transport department",
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Select Issue Type</Text>
        <View style={styles.typesContainer}>
          {reportTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                selectedType === type.id && styles.typeCardSelected,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              {type.icon}
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === type.id && styles.typeLabelSelected,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Describe the issue in detail..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Vehicle Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bus Number:</Text>
            <Text style={styles.infoValue}>AP 28 AB 1234</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Route:</Text>
            <Text style={styles.infoValue}>Route 101 - East Zone</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver:</Text>
            <Text style={styles.infoValue}>Rajesh Kumar</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Send size={20} color="white" />
          <Text style={styles.submitBtnText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  typeCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  typeCardSelected: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  typeLabel: { fontSize: 14, color: "#6b7280", marginTop: 8 },
  typeLabelSelected: { color: "#2563eb", fontWeight: "500" },
  descriptionInput: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
    minHeight: 120,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  infoRow: { flexDirection: "row", marginBottom: 8 },
  infoLabel: { width: 100, fontSize: 14, color: "#6b7280" },
  infoValue: { flex: 1, fontSize: 14, color: "#111827", fontWeight: "500" },
  submitBtn: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  submitBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
