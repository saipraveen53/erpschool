import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Bus, Calendar, CreditCard, MapPin, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, ScrollView, Text, TouchableOpacity, View } from "react-native";
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

  if (loading) return <SafeAreaView className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="p-2"><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">My Profile</Text>
        <View className="w-10" />
      </View>
      <ScrollView contentContainerClassName="p-5 items-center">
        <Animated.View className="items-center mb-6" style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View className="w-[100px] h-[100px] rounded-full bg-white border-2 border-[#0065ea] items-center justify-center mb-3">
            <User size={48} color="#0065ea" />
          </View>
          <Text className="text-2xl font-bold text-[#0065ea] mb-1">{user?.name || "Driver"}</Text>
          <Text className="text-sm text-[#0065ea]">Driver</Text>
        </Animated.View>
        <Animated.View className="bg-white rounded-2xl p-5 w-full shadow-sm" style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
          <View className="flex-row items-center py-3">
            <Bus size={20} color="#0065ea" />
            <Text className="flex-1 text-sm font-medium text-[#0065ea] ml-3">Bus Number</Text>
            <Text className="text-sm text-[#0065ea] font-semibold text-right">{busNumber}</Text>
          </View>
          <View className="h-px bg-gray-100" />
          <View className="flex-row items-center py-3">
            <MapPin size={20} color="#0065ea" />
            <Text className="flex-1 text-sm font-medium text-[#0065ea] ml-3">Assigned Route</Text>
            <Text className="text-sm text-[#0065ea] font-semibold text-right">{routeName}</Text>
          </View>
          <View className="h-px bg-gray-100" />
          <View className="flex-row items-center py-3">
            <CreditCard size={20} color="#0065ea" />
            <Text className="flex-1 text-sm font-medium text-[#0065ea] ml-3">Licence Number</Text>
            <Text className="text-sm text-[#0065ea] font-semibold text-right">{licence.number}</Text>
          </View>
          <View className="h-px bg-gray-100" />
          <View className="flex-row items-center py-3">
            <Calendar size={20} color="#0065ea" />
            <Text className="flex-1 text-sm font-medium text-[#0065ea] ml-3">Licence Start</Text>
            <Text className="text-sm text-[#0065ea] font-semibold text-right">{licence.startDate}</Text>
          </View>
          <View className="h-px bg-gray-100" />
          <View className="flex-row items-center py-3">
            <Calendar size={20} color="#0065ea" />
            <Text className="flex-1 text-sm font-medium text-[#0065ea] ml-3">Licence End</Text>
            <Text className="text-sm text-[#0065ea] font-semibold text-right">{licence.endDate}</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}