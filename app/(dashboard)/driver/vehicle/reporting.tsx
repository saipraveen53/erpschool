import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle, ArrowLeft, Car, Fuel, Send, Wrench } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReportTypes, submitVehicleReport } from "../../../services/driverService";

export default function VehicleReporting() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [reportTypes, setReportTypes] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    getReportTypes().then(setReportTypes);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!selectedType) { Alert.alert("Error", "Please select a report type"); return; }
    if (!description.trim()) { Alert.alert("Error", "Please provide description"); return; }
    await submitVehicleReport(selectedType, description);
    Alert.alert("Report Submitted", "Your vehicle report has been submitted", [{ text: "OK", onPress: () => router.back() }]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Report</Text><View style={{ width: 40 }} />
      </View>
      <ScrollView>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>Select Issue Type</Text>
          <View style={styles.typesContainer}>
            {reportTypes.map((type) => (
              <TouchableOpacity key={type.id} style={[styles.typeCard, selectedType === type.id && styles.typeCardSelected]} onPress={() => setSelectedType(type.id)} activeOpacity={0.7}>
                {type.id === "mechanical" && <Wrench size={20} color={selectedType === type.id ? "#fff" : "#0065ea"} />}
                {type.id === "accident" && <AlertTriangle size={20} color={selectedType === type.id ? "#fff" : "#0065ea"} />}
                {type.id === "fuel" && <Fuel size={20} color={selectedType === type.id ? "#fff" : "#0065ea"} />}
                {type.id === "other" && <Car size={20} color={selectedType === type.id ? "#fff" : "#0065ea"} />}
                <Text style={[styles.typeLabel, selectedType === type.id && styles.typeLabelSelected]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput style={styles.descriptionInput} placeholder="Describe the issue in detail..." placeholderTextColor="#0065ea" multiline numberOfLines={6} value={description} onChangeText={setDescription} />
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Vehicle Information</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Bus Number:</Text><Text style={styles.infoValue}>AP 28 AB 1234</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Route:</Text><Text style={styles.infoValue}>Route 101 - East Zone</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Driver:</Text><Text style={styles.infoValue}>Rajesh Kumar</Text></View>
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}><Send size={20} color="white" /><Text style={styles.submitBtnText}>Submit Report</Text></TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea" },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#0065ea", marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  typesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 12 },
  typeCard: { width: "48%", backgroundColor: "#fff", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: "#0065ea" },
  typeCardSelected: { borderColor: "#0065ea", backgroundColor: "#0065ea" },
  typeLabel: { fontSize: 14, color: "#0065ea", marginTop: 8 },
  typeLabelSelected: { color: "#fff", fontWeight: "500" },
  descriptionInput: { backgroundColor: "#fff", marginHorizontal: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#0065ea", fontSize: 14, color: "#0065ea", textAlignVertical: "top", minHeight: 120 },
  infoCard: { backgroundColor: "#fff", marginHorizontal: 16, marginTop: 20, padding: 16, borderRadius: 12 },
  infoTitle: { fontSize: 14, fontWeight: "600", color: "#0065ea", marginBottom: 12 },
  infoRow: { flexDirection: "row", marginBottom: 8 },
  infoLabel: { width: 100, fontSize: 14, color: "#0065ea" },
  infoValue: { flex: 1, fontSize: 14, color: "#0065ea", fontWeight: "500" },
  submitBtn: { backgroundColor: "#0065ea", flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 16, padding: 14, borderRadius: 12, gap: 8 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});