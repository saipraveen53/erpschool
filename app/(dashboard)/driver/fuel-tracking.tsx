import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Fuel, Save } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addFuelLog } from "../../services/driverService";

export default function FuelTracking() {
  const router = useRouter();
  const [liters, setLiters] = useState("");
  const [amount, setAmount] = useState("");
  const [odometer, setOdometer] = useState("");

  const handleSave = async () => {
    if (!liters || !amount) { Alert.alert("Error", "Please enter liters and amount"); return; }
    await addFuelLog({ liters: parseFloat(liters), amount: parseFloat(amount), odometer: odometer ? parseInt(odometer) : null });
    Alert.alert("Saved", "Fuel log added successfully");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}><TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity><Text style={styles.headerTitle}>Fuel Tracking</Text><View style={{ width: 40 }} /></View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.card}>
          <Fuel size={32} color="#0065ea" style={{ alignSelf: "center", marginBottom: 16 }} />
          <Text style={styles.label}>Liters filled</Text>
          <TextInput style={styles.input} placeholder="e.g., 40" placeholderTextColor="#0065ea" keyboardType="numeric" value={liters} onChangeText={setLiters} />
          <Text style={styles.label}>Amount (₹)</Text>
          <TextInput style={styles.input} placeholder="e.g., 5000" placeholderTextColor="#0065ea" keyboardType="numeric" value={amount} onChangeText={setAmount} />
          <Text style={styles.label}>Odometer reading (km) - optional</Text>
          <TextInput style={styles.input} placeholder="e.g., 12500" placeholderTextColor="#0065ea" keyboardType="numeric" value={odometer} onChangeText={setOdometer} />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Save size={20} color="white" /><Text style={styles.saveBtnText}>Save Log</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#0065ea" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1 },
  label: { fontSize: 14, fontWeight: "500", marginTop: 12, marginBottom: 4, color: "#0065ea" },
  input: { borderWidth: 1, borderColor: "#0065ea", borderRadius: 8, padding: 12, fontSize: 16, color: "#0065ea" },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#0065ea", padding: 14, borderRadius: 12, marginTop: 20, gap: 8 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});