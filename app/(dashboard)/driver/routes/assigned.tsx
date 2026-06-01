import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Bus, CheckCircle, Clock, ExternalLink, MapPin, Navigation, Users } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDriverRoute, markStopCompleted } from "../../../services/driverService";

export default function AssignedRoute() {
  const router = useRouter();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0.95)).current;

  const loadRoute = async () => {
    try {
      const data = await getDriverRoute();
      setRoute(data);
    } catch (err) { setError("Failed to load route"); } finally { setLoading(false); }
  };

  useEffect(() => { loadRoute(); }, []);

  useEffect(() => {
    if (route) {
      Animated.parallel([Animated.timing(fadeAnim, { toValue: 1, duration: 600 }), Animated.timing(slideAnim, { toValue: 0, duration: 500 }), Animated.spring(headerScale, { toValue: 1, friction: 8 })]).start();
    }
  }, [route]);

  const markCompleted = async (stopId) => {
    await markStopCompleted(stopId);
    loadRoute();
    Alert.alert("Stop Completed", "Stop marked as completed");
  };

  const openInMaps = (stopName) => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(stopName)}`);

  if (loading) return <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;
  if (error || !route) return <SafeAreaView style={styles.loadingContainer}><Text>{error}</Text><TouchableOpacity onPress={loadRoute}><Text>Retry</Text></TouchableOpacity></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <LinearGradient colors={["#fff", "#fff"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Assigned Route</Text><View style={{ width: 40 }} />
      </LinearGradient>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Animated.View style={[styles.routeHeroCard, { opacity: fadeAnim, transform: [{ scale: headerScale }] }]}>
          <LinearGradient colors={["#0065ea", "#0065ea"]} style={styles.routeHeroGradient}>
            <Bus size={40} color="#fff" />
            <Text style={styles.routeName}>{route.name}</Text>
            <Text style={styles.routeDetail}>Bus: {route.busNumber}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}><View style={styles.statIconCircle}><Users size={20} color="#0065ea" /></View><Text style={styles.statValue}>{route.totalStudents}</Text><Text style={styles.statLabel}>Students</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><View style={styles.statIconCircle}><MapPin size={20} color="#0065ea" /></View><Text style={styles.statValue}>{route.totalStops}</Text><Text style={styles.statLabel}>Stops</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><View style={styles.statIconCircle}><Clock size={20} color="#0065ea" /></View><Text style={styles.statValue}>{route.estimatedTime}</Text><Text style={styles.statLabel}>Est. Time</Text></View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.sectionTitle}>Route Stops • {route.distance}</Text>
        {route.stops.map((stop, index) => (
          <View key={stop.id} style={styles.stopCard}>
            <View style={styles.stopNumberContainer}>
              <View style={[styles.stopNumberCircle, stop.type === "school" && styles.schoolStopCircle]}><Text style={styles.stopNumberText}>{index + 1}</Text></View>
              {index < route.stops.length - 1 && <View style={styles.stopConnectingLine} />}
            </View>
            <View style={styles.stopContent}>
              <View style={styles.stopHeader}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <View style={styles.timeBadge}><Clock size={12} color="#0065ea" /><Text style={styles.stopTime}>{stop.time}</Text></View>
              </View>
              {stop.students > 0 && <View style={styles.stopMeta}><Users size={14} color="#0065ea" /><Text style={styles.stopStudentsText}>{stop.students} students</Text></View>}
              {stop.type === "school" && <View style={styles.schoolBadge}><Text style={styles.schoolBadgeText}>School Stop</Text></View>}
              <View style={styles.actionButtons}>
                {!stop.completed && <TouchableOpacity style={styles.completeBtn} onPress={() => markCompleted(stop.id)}><CheckCircle size={16} color="#fff" /><Text>Complete</Text></TouchableOpacity>}
                <TouchableOpacity style={styles.navBtn} onPress={() => openInMaps(stop.name)}><ExternalLink size={16} color="#0065ea" /><Text>Navigate</Text></TouchableOpacity>
              </View>
            </View>
            <Navigation size={20} color="#0065ea" />
          </View>
        ))}
        <TouchableOpacity style={styles.startBtn} onPress={() => router.push("/(dashboard)/driver/tracking/gps")}>
          <LinearGradient colors={["#0065ea", "#0065ea"]} style={styles.startBtnGradient}><Navigation size={20} color="white" /><Text style={styles.startBtnText}>Start Live Tracking</Text></LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0065ea" },
  routeHeroCard: { margin: 16, borderRadius: 24, overflow: "hidden", shadowColor: "#0065ea", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, elevation: 8 },
  routeHeroGradient: { padding: 24, alignItems: "center" },
  routeName: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 12 },
  routeDetail: { fontSize: 14, color: "#fff", marginTop: 4 },
  statsContainer: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 24, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, paddingVertical: 12 },
  statItem: { alignItems: "center", flex: 1 },
  statIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  statLabel: { fontSize: 11, color: "#fff" },
  statDivider: { width: 1, height: 30, backgroundColor: "rgba(255,255,255,0.3)" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#0065ea", marginHorizontal: 16, marginBottom: 16 },
  stopCard: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 20, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, elevation: 2 },
  stopNumberContainer: { width: 40, alignItems: "center", marginRight: 12 },
  stopNumberCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#0065ea" },
  schoolStopCircle: { backgroundColor: "#ff4b00", borderColor: "#0065ea" },
  stopNumberText: { fontSize: 14, fontWeight: "bold", color: "#0065ea" },
  stopConnectingLine: { width: 2, height: 40, backgroundColor: "#e2e8f0", marginTop: 4 },
  stopContent: { flex: 1 },
  stopHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  stopName: { fontSize: 16, fontWeight: "600", color: "#0065ea" },
  timeBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, gap: 4 },
  stopTime: { fontSize: 12, fontWeight: "500", color: "#0065ea" },
  stopMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  stopStudentsText: { fontSize: 13, color: "#0065ea" },
  schoolBadge: { backgroundColor: "#ff4b00", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start", marginTop: 6 },
  schoolBadgeText: { fontSize: 11, fontWeight: "600", color: "#fff" },
  actionButtons: { flexDirection: "row", gap: 12, marginTop: 8 },
  completeBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#00a652", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  navBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  startBtn: { margin: 16, borderRadius: 30, overflow: "hidden", shadowColor: "#0065ea", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, elevation: 6 },
  startBtnGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 12 },
  startBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});