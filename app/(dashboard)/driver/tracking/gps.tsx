import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Bell, Navigation, Share2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GPSTracking() {
  const router = useRouter();
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState({
    lat: 17.385,
    lng: 78.4867,
    address: "Main School, Hyderabad",
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setLocation((prev) => ({
          ...prev,
          lat: prev.lat + 0.0001,
          lng: prev.lng + 0.0001,
        }));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const toggleTracking = () => {
    if (!isTracking) {
      Alert.alert(
        "Start Live Tracking",
        "Parents will be able to see your live location",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Start", onPress: () => setIsTracking(true) },
        ],
      );
    } else {
      setIsTracking(false);
    }
  };

  const shareLocation = () => {
    Alert.alert(
      "Location Shared",
      "Your current location has been shared with school admin",
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live GPS Tracking</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mapPlaceholder}>
        <View style={styles.mapOverlay}>
          <Navigation size={48} color="#2563eb" />
          <Text style={styles.locationText}>Current Location</Text>
          <Text style={styles.addressText}>{location.address}</Text>
          <Text style={styles.coordsText}>
            {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
          </Text>
        </View>
      </View>

      <View style={styles.controlsCard}>
        <View style={styles.controlRow}>
          <View style={styles.controlInfo}>
            <Bell size={20} color="#111827" />
            <Text style={styles.controlText}>Live Tracking</Text>
          </View>
          <Switch
            value={isTracking}
            onValueChange={toggleTracking}
            trackColor={{ false: "#e5e7eb", true: "#2563eb" }}
            thumbColor={isTracking ? "#ffffff" : "#f3f4f6"}
          />
        </View>
        {isTracking && (
          <View style={styles.trackingStatus}>
            <View style={styles.trackingDot} />
            <Text style={styles.trackingText}>
              Your location is being shared with parents
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.shareBtn} onPress={shareLocation}>
          <Share2 size={20} color="#2563eb" />
          <Text style={styles.shareBtnText}>Share Current Location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Live Tracking</Text>
        <Text style={styles.infoText}>
          • Parents can track the bus in real-time{"\n"}• Your location is
          updated every 3 seconds{"\n"}• Location data is secure and encrypted
          {"\n"}• You can stop sharing anytime
        </Text>
      </View>
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
  mapPlaceholder: {
    height: 300,
    backgroundColor: "#e5e7eb",
    margin: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  mapOverlay: { alignItems: "center" },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
  },
  addressText: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  coordsText: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
  controlsCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  controlText: { fontSize: 16, fontWeight: "500", color: "#111827" },
  trackingStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16a34a",
    marginRight: 8,
  },
  trackingText: { fontSize: 12, color: "#6b7280" },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  shareBtnText: { color: "#2563eb", fontSize: 14, fontWeight: "500" },
  infoCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  infoText: { fontSize: 12, color: "#6b7280", lineHeight: 20 },
});
