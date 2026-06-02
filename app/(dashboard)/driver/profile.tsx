import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Bus, Calendar, CreditCard, MapPin, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import driverData from "../../data/driverData.json";
import { getDriverRoute, getVehicleInfo } from "../../services/driverService";

export default function DriverProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [routeName, setRouteName] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [licence, setLicence] = useState({ number: "", startDate: "", endDate: "" });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const route = await getDriverRoute();
      const vehicle = await getVehicleInfo();
      setRouteName(route.name);
      setBusNumber(vehicle.busNumber);
      setLicence({
        number: driverData.licence?.number || "Not available",
        startDate: driverData.licence?.startDate || "N/A",
        endDate: driverData.licence?.endDate || "N/A",
      });
    } catch (error) { console.error(error); } finally {
      setLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.spring(cardScale, { toValue: 1, friction: 8, useNativeDriver: true }),
      ]).start();
    }
  };

  if (loading) return <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text><View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.avatarSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.avatarCircle}><User size={48} color="#0065ea" /></View>
          <Text style={styles.driverName}>{user?.name || "Driver"}</Text>
          <Text style={styles.driverRole}>Driver</Text>
        </Animated.View>
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: cardScale }] }]}>
          <View style={styles.infoRow}><Bus size={20} color="#0065ea" /><Text style={styles.infoLabel}>Bus Number</Text><Text style={styles.infoValue}>{busNumber}</Text></View>
          <View style={styles.divider} />
          <View style={styles.infoRow}><MapPin size={20} color="#0065ea" /><Text style={styles.infoLabel}>Assigned Route</Text><Text style={styles.infoValue}>{routeName}</Text></View>
          <View style={styles.divider} />
          <View style={styles.infoRow}><CreditCard size={20} color="#0065ea" /><Text style={styles.infoLabel}>Licence Number</Text><Text style={styles.infoValue}>{licence.number}</Text></View>
          <View style={styles.divider} />
          <View style={styles.infoRow}><Calendar size={20} color="#0065ea" /><Text style={styles.infoLabel}>Licence Start</Text><Text style={styles.infoValue}>{licence.startDate}</Text></View>
          <View style={styles.divider} />
          <View style={styles.infoRow}><Calendar size={20} color="#0065ea" /><Text style={styles.infoLabel}>Licence End</Text><Text style={styles.infoValue}>{licence.endDate}</Text></View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea" },
  scrollContent: { padding: 20, alignItems: "center" },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#fff", borderWidth: 2, borderColor: "#0065ea", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  driverName: { fontSize: 24, fontWeight: "bold", color: "#0065ea", marginBottom: 4 },
  driverRole: { fontSize: 14, color: "#0065ea" },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20, width: "100%", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  infoLabel: { flex: 1, fontSize: 14, fontWeight: "500", color: "#0065ea", marginLeft: 12 },
  infoValue: { fontSize: 14, color: "#0065ea", fontWeight: "600", textAlign: "right" },
  divider: { height: 1, backgroundColor: "#e2e8f0" },
});