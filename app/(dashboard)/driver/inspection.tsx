import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getInspectionItems } from "../../services/driverService";

export default function Inspection() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [checks, setChecks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInspectionItems().then(data => {
      setItems(data);
      const initial = {};
      data.forEach(item => { initial[item.id] = false; });
      setChecks(initial);
      setLoading(false);
    });
  }, []);

  const toggle = (id) => setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  const allChecked = items.every(item => checks[item.id] === true);

  const confirmTrip = () => {
    if (allChecked) { Alert.alert("Inspection Passed", "You can start the trip now"); router.back(); }
    else { Alert.alert("Incomplete", "Please complete all checks before starting trip"); }
  };

  if (loading) return <SafeAreaView style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}><TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity><Text style={styles.headerTitle}>Vehicle Inspection</Text><View style={{ width: 40 }} /></View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {items.map(item => (
          <TouchableOpacity key={item.id} style={styles.checkItem} onPress={() => toggle(item.id)}>
            {checks[item.id] ? <CheckCircle size={24} color="#00a652" /> : <Circle size={24} color="#0065ea" />}
            <Text style={styles.checkLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.submitBtn, !allChecked && styles.disabledBtn]} onPress={confirmTrip} disabled={!allChecked}>
          <Text style={styles.submitBtnText}>{allChecked ? "All Good, Start Trip" : "Complete All Checks"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea" },
  checkItem: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12 },
  checkLabel: { fontSize: 16, fontWeight: "500", color: "#0065ea" },
  submitBtn: { backgroundColor: "#0065ea", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  disabledBtn: { backgroundColor: "#ff4b00" },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});