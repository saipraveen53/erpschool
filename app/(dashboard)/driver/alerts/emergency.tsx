import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle, ArrowLeft, MapPin, Phone, Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEmergencyContacts, sendEmergencySOS } from "../../../services/driverService";

export default function EmergencyAlert() {
  const router = useRouter();
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [contacts, setContacts] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getEmergencyContacts().then(setContacts);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600 }).start();
  }, []);

  useEffect(() => {
    if (isEmergencyMode) {
      Animated.loop(Animated.sequence([Animated.timing(pulseAnim, { toValue: 1.2, duration: 800 }), Animated.timing(pulseAnim, { toValue: 1, duration: 800 })])).start();
    } else { pulseAnim.setValue(1); }
  }, [isEmergencyMode]);

  const sendEmergencyAlert = () => {
    Alert.alert("Emergency Alert", "Send alert? All contacts will be notified.", [
      { text: "Cancel", style: "cancel" },
      { text: "Send Alert", style: "destructive", onPress: async () => {
        setIsEmergencyMode(true);
        await sendEmergencySOS("general", { lat: 17.385, lng: 78.4867 });
        Alert.alert("Alert Sent", "Emergency alert has been sent to all contacts");
      }}
    ]);
  };

  const cancelEmergency = () => {
    Alert.alert("Cancel Alert", "Are you sure?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => setIsEmergencyMode(false) },
    ]);
  };

  const makeCall = (number) => Alert.alert("Call", `Calling ${number}`, [{ text: "Cancel" }, { text: "Call", onPress: () => Alert.alert("Calling", `Dialing ${number}...`) }]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Alert</Text><View style={{ width: 40 }} />
      </View>
      <Animated.View style={[styles.emergencyButtonContainer, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={[styles.emergencyBtn, isEmergencyMode && styles.emergencyBtnActive]} onPress={isEmergencyMode ? cancelEmergency : sendEmergencyAlert} activeOpacity={0.8}>
            <AlertTriangle size={48} color="white" />
            <Text style={styles.emergencyBtnText}>{isEmergencyMode ? "CANCEL EMERGENCY" : "SEND EMERGENCY ALERT"}</Text>
          </TouchableOpacity>
        </Animated.View>
        {isEmergencyMode && <View style={styles.emergencyStatus}><View style={styles.pulseDot} /><Text style={styles.emergencyStatusText}>Emergency Mode Active</Text></View>}
      </Animated.View>
      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      {contacts.map((contact, index) => (
        <Animated.View key={index} style={[styles.contactCard, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={() => makeCall(contact.number)} style={styles.contactTouchable} activeOpacity={0.7}>
            <View style={styles.contactAvatar}><Phone size={24} color="#0065ea" /></View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRelation}>{contact.relation}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
            <View style={styles.callBtn}><Phone size={20} color="#0065ea" /></View>
          </TouchableOpacity>
        </Animated.View>
      ))}
      <Animated.View style={[styles.locationCard, { opacity: fadeAnim }]}>
        <View style={styles.locationHeader}><MapPin size={20} color="#0065ea" /><Text style={styles.locationTitle}>Share Location</Text></View>
        <Text style={styles.locationText}>Your current location will be shared with emergency contacts when you send an alert</Text>
        <TouchableOpacity style={styles.shareLocationBtn} activeOpacity={0.7}><Send size={18} color="#0065ea" /><Text style={styles.shareLocationText}>Share Current Location</Text></TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea" },
  emergencyButtonContainer: { padding: 16 },
  emergencyBtn: { backgroundColor: "#ff4b00", padding: 24, borderRadius: 20, alignItems: "center", gap: 12 },
  emergencyBtnActive: { backgroundColor: "#0065ea" },
  emergencyBtnText: { color: "white", fontSize: 18, fontWeight: "bold" },
  emergencyStatus: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12, gap: 8 },
  pulseDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#0065ea" },
  emergencyStatusText: { fontSize: 14, color: "#0065ea", fontWeight: "500" },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#0065ea", marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  contactCard: { backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
  contactTouchable: { flexDirection: "row", alignItems: "center", padding: 12 },
  contactAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactName: { fontSize: 16, fontWeight: "600", color: "#0065ea" },
  contactRelation: { fontSize: 12, color: "#0065ea", marginTop: 2 },
  contactNumber: { fontSize: 12, color: "#0065ea", marginTop: 2 },
  callBtn: { padding: 12 },
  locationCard: { backgroundColor: "#fff", marginHorizontal: 16, marginTop: 20, marginBottom: 24, padding: 16, borderRadius: 12 },
  locationHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  locationTitle: { fontSize: 14, fontWeight: "600", color: "#0065ea" },
  locationText: { fontSize: 12, color: "#0065ea", lineHeight: 18, marginBottom: 12 },
  shareLocationBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 10, borderRadius: 8, gap: 8 },
  shareLocationText: { color: "#0065ea", fontSize: 14, fontWeight: "500" },
});