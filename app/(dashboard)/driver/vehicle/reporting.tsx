import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle, ArrowLeft, Car, Fuel, Send, Wrench } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReportTypes, submitVehicleReport } from "../../../services/driverService";

export default function VehicleReporting() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [reportTypes, setReportTypes] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    getReportTypes().then(setReportTypes);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!selectedType) { Alert.alert("Error", "Please select a report type"); return; }
    if (!description.trim()) { Alert.alert("Error", "Please provide description"); return; }
    await submitVehicleReport(selectedType, description);
    Alert.alert("Report Submitted", "Your vehicle report has been submitted", [{ text: "OK", onPress: () => router.back() }]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="p-2"><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">Vehicle Report</Text>
        <View className="w-10" />
      </View>
      <ScrollView>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text className="text-base font-semibold text-[#0065ea] mx-4 mt-5 mb-3">Select Issue Type</Text>
          <View className="flex-row flex-wrap justify-between px-3">
            {reportTypes.map((type) => (
              <TouchableOpacity key={type.id} className={`w-[48%] bg-white p-4 rounded-xl items-center mb-3 border ${selectedType === type.id ? "border-[#0065ea] bg-[#0065ea]" : "border-[#0065ea]"}`} onPress={() => setSelectedType(type.id)} activeOpacity={0.7}>
                {type.id === "mechanical" && <Wrench size={20} color={selectedType === type.id ? "#fff" : "#0065ea"} />}
                {type.id === "accident" && <AlertTriangle size={20} color={selectedType === type.id ? "#fff" : "#0065ea"} />}
                {type.id === "fuel" && <Fuel size={20} color={selectedType === type.id ? "#fff" : "#0065ea"} />}
                {type.id === "other" && <Car size={20} color={selectedType === type.id ? "#fff" : "#0065ea"} />}
                <Text className={`text-sm mt-2 ${selectedType === type.id ? "text-white font-medium" : "text-[#0065ea]"}`}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text className="text-base font-semibold text-[#0065ea] mx-4 mt-2 mb-3">Description</Text>
          <TextInput className="bg-white mx-4 p-4 rounded-xl border border-[#0065ea] text-sm text-[#0065ea] min-h-[120px] text-left align-top" placeholder="Describe the issue in detail..." placeholderTextColor="#0065ea" multiline numberOfLines={6} value={description} onChangeText={setDescription} />
          <View className="bg-white mx-4 mt-5 p-4 rounded-xl">
            <Text className="text-sm font-semibold text-[#0065ea] mb-3">Vehicle Information</Text>
            <View className="flex-row mb-2"><Text className="w-[100px] text-sm text-[#0065ea]">Bus Number:</Text><Text className="flex-1 text-sm text-[#0065ea] font-medium">AP 28 AB 1234</Text></View>
            <View className="flex-row mb-2"><Text className="w-[100px] text-sm text-[#0065ea]">Route:</Text><Text className="flex-1 text-sm text-[#0065ea] font-medium">Route 101 - East Zone</Text></View>
            <View className="flex-row"><Text className="w-[100px] text-sm text-[#0065ea]">Driver:</Text><Text className="flex-1 text-sm text-[#0065ea] font-medium">Rajesh Kumar</Text></View>
          </View>
          <TouchableOpacity className="bg-[#0065ea] flex-row items-center justify-center mx-4 my-4 p-3.5 rounded-xl gap-2" onPress={handleSubmit} activeOpacity={0.8}>
            <Send size={20} color="white" /><Text className="text-white font-semibold text-base">Submit Report</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}