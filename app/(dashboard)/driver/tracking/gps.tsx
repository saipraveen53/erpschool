import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Bell, Clock, Gauge, MapPin, Navigation, Share2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Switch, Text, TouchableOpacity, View } from "react-native";
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
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">Live GPS Tracking</Text>
        <View className="w-10" />
      </View>
      <Animated.View className="h-[350px] bg-gray-100 mx-4 my-4 rounded-2xl justify-center items-center" style={{ opacity: fadeAnim }}>
        <Animated.View className="items-center" style={{ transform: [{ scale: pulseAnim }] }}>
          <Navigation size={48} color="#0065ea" />
          <Text className="text-base font-semibold mt-3 text-[#0065ea]">Current Location</Text>
          <Text className="text-sm text-gray-500 mt-1">{location.address}</Text>
          <Text className="text-xs text-[#0065ea] mt-1">{location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E</Text>
          <View className="flex-row justify-around w-full mt-4">
            <View className="items-center">
              <Gauge size={20} color="#0065ea" />
              <Text className="text-lg font-bold text-[#0065ea] mt-1">{Math.round(speed)} km/h</Text>
              <Text className="text-xs text-gray-500">Speed</Text>
            </View>
            <View className="items-center">
              <Clock size={20} color="#0065ea" />
              <Text className="text-lg font-bold text-[#0065ea] mt-1">{eta}</Text>
              <Text className="text-xs text-gray-500">ETA</Text>
            </View>
            <View className="items-center">
              <MapPin size={20} color="#0065ea" />
              <Text className="text-lg font-bold text-[#0065ea] mt-1">{remainingStops}</Text>
              <Text className="text-xs text-gray-500">Stops left</Text>
            </View>
          </View>
          <View className="mt-4 w-full px-4">
            <Text className="text-xs text-[#0065ea]">Route Progress</Text>
            <View className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <View className="h-full bg-[#0065ea]" style={{ width: `${progress}%` }} />
            </View>
            <Text className="text-xs text-[#0065ea] mt-0.5 text-right">{Math.round(progress)}%</Text>
          </View>
        </Animated.View>
      </Animated.View>
      <Animated.View className="bg-white mx-4 p-4 rounded-2xl" style={{ opacity: fadeAnim }}>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-3">
            <Bell size={20} color="#0065ea" />
            <Text className="text-base font-medium text-[#0065ea]">Live Tracking</Text>
          </View>
          <Switch value={isTracking} onValueChange={toggleTracking} trackColor={{ false: "#e2e8f0", true: "#0065ea" }} thumbColor={isTracking ? "#fff" : "#ff4b00"} />
        </View>
        {isTracking && (
          <View className="flex-row items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <View className="w-2 h-2 rounded-full bg-[#00a652]" />
            <Text className="text-sm text-gray-500">Your location is being shared with parents</Text>
          </View>
        )}
        <TouchableOpacity className="flex-row items-center justify-center bg-white mt-4 p-3 rounded-xl gap-2" onPress={shareLocation}>
          <Share2 size={20} color="#0065ea" />
          <Text className="text-sm font-medium text-[#0065ea]">Share Current Location</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}