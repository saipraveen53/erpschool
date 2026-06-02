import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Bus, CheckCircle, Clock, ExternalLink, MapPin, Navigation, Users } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600 }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500 }),
        Animated.spring(headerScale, { toValue: 1, friction: 8 })
      ]).start();
    }
  }, [route]);

  const markCompleted = async (stopId) => {
    await markStopCompleted(stopId);
    loadRoute();
    Alert.alert("Stop Completed", "Stop marked as completed");
  };

  const openInMaps = (stopName) => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(stopName)}`);

  if (loading) return <SafeAreaView className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;
  if (error || !route) return <SafeAreaView className="flex-1 justify-center items-center bg-white"><Text>{error}</Text><TouchableOpacity onPress={loadRoute}><Text>Retry</Text></TouchableOpacity></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <LinearGradient colors={["#fff", "#fff"]} className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-xl font-bold text-[#0065ea]">Assigned Route</Text>
        <View className="w-10" />
      </LinearGradient>
      <ScrollView contentContainerClassName="pb-8">
        <Animated.View className="mx-4 rounded-2xl overflow-hidden shadow-lg" style={{ opacity: fadeAnim, transform: [{ scale: headerScale }] }}>
          <LinearGradient colors={["#0065ea", "#0065ea"]} className="p-6 items-center">
            <Bus size={40} color="#fff" />
            <Text className="text-[22px] font-bold text-white mt-3">{route.name}</Text>
            <Text className="text-sm text-white mt-1">Bus: {route.busNumber}</Text>
            <View className="flex-row justify-around w-full mt-6 bg-white/15 rounded-2xl py-3">
              <View className="items-center flex-1">
                <View className="w-9 h-9 rounded-full bg-white items-center justify-center mb-1.5">
                  <Users size={20} color="#0065ea" />
                </View>
                <Text className="text-lg font-bold text-white">{route.totalStudents}</Text>
                <Text className="text-[11px] text-white">Students</Text>
              </View>
              <View className="w-px h-[30px] bg-white/30" />
              <View className="items-center flex-1">
                <View className="w-9 h-9 rounded-full bg-white items-center justify-center mb-1.5">
                  <MapPin size={20} color="#0065ea" />
                </View>
                <Text className="text-lg font-bold text-white">{route.totalStops}</Text>
                <Text className="text-[11px] text-white">Stops</Text>
              </View>
              <View className="w-px h-[30px] bg-white/30" />
              <View className="items-center flex-1">
                <View className="w-9 h-9 rounded-full bg-white items-center justify-center mb-1.5">
                  <Clock size={20} color="#0065ea" />
                </View>
                <Text className="text-lg font-bold text-white">{route.estimatedTime}</Text>
                <Text className="text-[11px] text-white">Est. Time</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Text className="text-lg font-bold text-[#0065ea] mx-4 my-4">Route Stops • {route.distance}</Text>
        {route.stops.map((stop, index) => (
          <View key={stop.id} className="flex-row bg-white mx-4 mb-3 p-4 rounded-2xl items-center shadow-sm">
            <View className="w-10 items-center mr-3">
              <View className={`w-8 h-8 rounded-full bg-white items-center justify-center border border-[#0065ea] ${stop.type === "school" ? "bg-[#ff4b00]" : ""}`}>
                <Text className="text-sm font-bold text-[#0065ea]">{index + 1}</Text>
              </View>
              {index < route.stops.length - 1 && <View className="w-0.5 h-10 bg-gray-100 mt-1" />}
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-semibold text-[#0065ea]">{stop.name}</Text>
                <View className="flex-row items-center bg-white px-2 py-1 rounded-full gap-1">
                  <Clock size={12} color="#0065ea" />
                  <Text className="text-xs font-medium text-[#0065ea]">{stop.time}</Text>
                </View>
              </View>
              {stop.students > 0 && (
                <View className="flex-row items-center gap-1.5 mt-1">
                  <Users size={14} color="#0065ea" />
                  <Text className="text-xs text-[#0065ea]">{stop.students} students</Text>
                </View>
              )}
              {stop.type === "school" && (
                <View className="bg-[#ff4b00] px-2.5 py-1 rounded-full self-start mt-1.5">
                  <Text className="text-[11px] font-semibold text-white">School Stop</Text>
                </View>
              )}
              <View className="flex-row gap-3 mt-2">
                {!stop.completed && (
                  <TouchableOpacity className="flex-row items-center gap-1 bg-[#00a652] px-2.5 py-1 rounded-full" onPress={() => markCompleted(stop.id)}>
                    <CheckCircle size={16} color="#fff" />
                    <Text className="text-white text-xs">Complete</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity className="flex-row items-center gap-1 bg-white px-2.5 py-1 rounded-full" onPress={() => openInMaps(stop.name)}>
                  <ExternalLink size={16} color="#0065ea" />
                  <Text className="text-[#0065ea] text-xs">Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Navigation size={20} color="#0065ea" />
          </View>
        ))}
        <TouchableOpacity className="mx-4 rounded-3xl overflow-hidden shadow-md mt-2" onPress={() => router.push("/(dashboard)/driver/tracking/gps")}>
          <LinearGradient colors={["#0065ea", "#0065ea"]} className="flex-row items-center justify-center py-4 gap-3">
            <Navigation size={20} color="white" />
            <Text className="text-white font-bold text-base">Start Live Tracking</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}