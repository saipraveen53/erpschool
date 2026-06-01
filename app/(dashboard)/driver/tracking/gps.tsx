import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Bell, Clock, Gauge, MapPin, Navigation, Share2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { startLocationTracking, stopLocationTracking } from "../../../services/driverService";

export default function GPSTracking() {
  const router = useRouter();
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState({ lat: 17.385, lng: 78.4867, address: "Main School" });
  const [speed, setSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [remainingStops, setRemainingStops] = useState(0);
  const [eta, setEta] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600 }).start();
    return () => { if (isTracking) stopLocationTracking(); };
  }, []);

  const toggleTracking = () => {
    if (!isTracking) {
      Alert.alert("Start Live Tracking", "Parents and admin will see your location", [
        { text: "Cancel", style: "cancel" },
        { text: "Start", onPress: () => {
          setIsTracking(true);
          startLocationTracking((data) => {
            setLocation({ lat: data.lat, lng: data.lng, address: "En route" });
            setSpeed(data.speed);
            setProgress(data.progress);
            setRemainingStops(data.remainingStops);
            setEta(data.eta);
            Animated.sequence([Animated.timing(pulseAnim, { toValue: 1.2, duration: 200 }), Animated.timing(pulseAnim, { toValue: 1, duration: 200 })]).start();
          });
        }}
      ]);
    } else {
      stopLocationTracking();
      setIsTracking(false);
    }
  };

  const shareLocation = () => Alert.alert("Location Shared", "Your current location shared with admin");

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}><TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity><Text style={styles.headerTitle}>Live GPS Tracking</Text><View style={{ width: 40 }} /></View>
      <Animated.View style={[styles.mapPlaceholder, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.mapOverlay, { transform: [{ scale: pulseAnim }] }]}>
          <Navigation size={48} color="#0065ea" />
          <Text style={styles.locationText}>Current Location</Text>
          <Text style={styles.addressText}>{location.address}</Text>
          <Text style={styles.coordsText}>{location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}><Gauge size={20} color="#0065ea" /><Text style={styles.statValue}>{Math.round(speed)} km/h</Text><Text>Speed</Text></View>
            <View style={styles.statItem}><Clock size={20} color="#0065ea" /><Text style={styles.statValue}>{eta}</Text><Text>ETA</Text></View>
            <View style={styles.statItem}><MapPin size={20} color="#0065ea" /><Text style={styles.statValue}>{remainingStops}</Text><Text>Stops left</Text></View>
          </View>
          <View style={styles.progressContainer}><Text style={styles.progressLabel}>Route Progress</Text><View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: "#0065ea" }]} /></View><Text style={styles.progressPercent}>{Math.round(progress)}%</Text></View>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.controlsCard, { opacity: fadeAnim }]}>
        <View style={styles.controlRow}><View style={styles.controlInfo}><Bell size={20} color="#0065ea" /><Text style={styles.controlText}>Live Tracking</Text></View><Switch value={isTracking} onValueChange={toggleTracking} trackColor={{ false: "#e2e8f0", true: "#0065ea" }} thumbColor={isTracking ? "#fff" : "#ff4b00"} /></View>
        {isTracking && <View style={styles.trackingStatus}><View style={styles.trackingDot} /><Text>Your location is being shared with parents</Text></View>}
        <TouchableOpacity style={styles.shareBtn} onPress={shareLocation}><Share2 size={20} color="#0065ea" /><Text style={styles.shareBtnText}>Share Current Location</Text></TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#0065ea" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0065ea" },
  mapPlaceholder: { height: 350, backgroundColor: "#e2e8f0", margin: 16, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  mapOverlay: { alignItems: "center" },
  locationText: { fontSize: 16, fontWeight: "600", marginTop: 12, color: "#0065ea" },
  addressText: { fontSize: 14, color: "#64748b", marginTop: 4 },
  coordsText: { fontSize: 12, color: "#0065ea", marginTop: 4 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 16 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#0065ea", marginTop: 4 },
  progressContainer: { marginTop: 16, width: "100%", paddingHorizontal: 16 },
  progressLabel: { fontSize: 12, color: "#0065ea" },
  progressBar: { height: 6, backgroundColor: "#e2e8f0", borderRadius: 3, marginTop: 4, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#0065ea" },
  progressPercent: { fontSize: 12, color: "#0065ea", marginTop: 2, textAlign: "right" },
  controlsCard: { backgroundColor: "#fff", margin: 16, padding: 16, borderRadius: 16 },
  controlRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  controlInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  controlText: { fontSize: 16, fontWeight: "500", color: "#0065ea" },
  trackingStatus: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#e2e8f0" },
  trackingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#00a652" },
  shareBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", marginTop: 16, padding: 12, borderRadius: 12, gap: 8 },
  shareBtnText: { color: "#0065ea", fontSize: 14, fontWeight: "500" },
});