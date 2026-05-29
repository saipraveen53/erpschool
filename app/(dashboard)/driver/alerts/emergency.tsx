import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle, ArrowLeft, MapPin, Phone, Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const emergencyContacts = [
  { name: "Transport Manager", number: "9876543210", relation: "Manager" },
  { name: "School Admin", number: "9876543211", relation: "Admin" },
  { name: "Police Control Room", number: "100", relation: "Emergency" },
  { name: "Ambulance", number: "102", relation: "Emergency" },
];

export default function EmergencyAlert() {
  const router = useRouter();
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (isEmergencyMode) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isEmergencyMode]);

  const sendEmergencyAlert = () => {
    Alert.alert("Emergency Alert", "Are you sure you want to send emergency alert? All contacts will be notified immediately.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send Alert",
        style: "destructive",
        onPress: () => {
          setIsEmergencyMode(true);
          Alert.alert("Alert Sent", "Emergency alert has been sent to all contacts");
        },
      },
    ]);
  };

  const cancelEmergency = () => {
    Alert.alert("Cancel Alert", "Are you sure you want to cancel emergency mode?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => setIsEmergencyMode(false) },
    ]);
  };

  const makeCall = (number: string) => {
    Alert.alert("Call", `Calling ${number}`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Alert.alert("Calling", `Dialing ${number}...`) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Alert</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={[styles.emergencyButtonContainer, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.emergencyBtn, isEmergencyMode && styles.emergencyBtnActive]}
            onPress={isEmergencyMode ? cancelEmergency : sendEmergencyAlert}
            activeOpacity={0.8}
          >
            <AlertTriangle size={48} color="white" />
            <Text style={styles.emergencyBtnText}>{isEmergencyMode ? "CANCEL EMERGENCY" : "SEND EMERGENCY ALERT"}</Text>
          </TouchableOpacity>
        </Animated.View>
        {isEmergencyMode && (
          <View style={styles.emergencyStatus}>
            <View style={styles.pulseDot} />
            <Text style={styles.emergencyStatusText}>Emergency Mode Active</Text>
          </View>
        )}
      </Animated.View>

      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      {emergencyContacts.map((contact, index) => (
        <Animated.View key={index} style={[styles.contactCard, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={() => makeCall(contact.number)} style={styles.contactTouchable} activeOpacity={0.7}>
            <View style={styles.contactAvatar}>
              <Phone size={24} color="#2563eb" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRelation}>{contact.relation}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
            <View style={styles.callBtn}>
              <Phone size={20} color="#2563eb" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}

      <Animated.View style={[styles.locationCard, { opacity: fadeAnim }]}>
        <View style={styles.locationHeader}>
          <MapPin size={20} color="#111827" />
          <Text style={styles.locationTitle}>Share Location</Text>
        </View>
        <Text style={styles.locationText}>Your current location will be shared with emergency contacts when you send an alert</Text>
        <TouchableOpacity style={styles.shareLocationBtn} activeOpacity={0.7}>
          <Send size={18} color="#2563eb" />
          <Text style={styles.shareLocationText}>Share Current Location</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  emergencyButtonContainer: { padding: 16 },
  emergencyBtn: { backgroundColor: "#dc2626", padding: 24, borderRadius: 20, alignItems: "center", gap: 12 },
  emergencyBtnActive: { backgroundColor: "#991b1b" },
  emergencyBtnText: { color: "white", fontSize: 18, fontWeight: "bold" },
  emergencyStatus: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12, gap: 8 },
  pulseDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#dc2626" },
  emergencyStatusText: { fontSize: 14, color: "#dc2626", fontWeight: "500" },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  contactCard: { backgroundColor: "#ffffff", marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
  contactTouchable: { flexDirection: "row", alignItems: "center", padding: 12 },
  contactAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#eff6ff", alignItems: "center", justifyContent: "center" },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  contactRelation: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  contactNumber: { fontSize: 12, color: "#2563eb", marginTop: 2 },
  callBtn: { padding: 12 },
  locationCard: { backgroundColor: "#ffffff", marginHorizontal: 16, marginTop: 20, marginBottom: 24, padding: 16, borderRadius: 12 },
  locationHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  locationTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  locationText: { fontSize: 12, color: "#6b7280", lineHeight: 18, marginBottom: 12 },
  shareLocationBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#eff6ff", padding: 10, borderRadius: 8, gap: 8 },
  shareLocationText: { color: "#2563eb", fontSize: 14, fontWeight: "500" },
});