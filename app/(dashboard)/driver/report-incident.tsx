import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Send } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReportTypes, submitIncidentReport } from "../../services/driverService";

export default function ReportIncident() {
  const router = useRouter();
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => { getReportTypes().then(setTypes); }, []);

  const handleSubmit = async () => {
    if (!selectedType || !description) { Alert.alert("Error", "Please fill all fields"); return; }
    await submitIncidentReport({ type: selectedType, description });
    Alert.alert("Reported", "Incident report submitted");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}><TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity><Text style={styles.headerTitle}>Report Incident</Text><View style={{ width: 40 }} /></View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.label}>Incident Type</Text>
        <View style={styles.typeContainer}>
          {types.map(type => (
            <TouchableOpacity key={type.id} style={[styles.typeBtn, selectedType === type.id && styles.typeBtnActive]} onPress={() => setSelectedType(type.id)}>
              <Text style={[styles.typeBtnText, selectedType === type.id && styles.typeBtnTextActive]}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.textArea} placeholder="Describe the incident..." placeholderTextColor="#0065ea" multiline numberOfLines={4} value={description} onChangeText={setDescription} />
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}><Send size={20} color="white" /><Text style={styles.submitBtnText}>Submit Report</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea" },
  label: { fontSize: 14, fontWeight: "500", marginTop: 16, marginBottom: 8, color: "#0065ea" },
  typeContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff" },
  typeBtnActive: { backgroundColor: "#0065ea" },
  typeBtnText: { color: "#0065ea" },
  typeBtnTextActive: { color: "#fff" },
  textArea: { borderWidth: 1, borderColor: "#0065ea", borderRadius: 8, padding: 12, fontSize: 16, minHeight: 100, textAlignVertical: "top", color: "#0065ea" },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#0065ea", padding: 14, borderRadius: 12, marginTop: 20, gap: 8 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});