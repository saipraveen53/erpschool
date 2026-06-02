import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Fuel, Save } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addFuelLog } from "../../services/driverService";

export default function FuelTracking() {
  const router = useRouter();
  const [liters, setLiters] = useState("");
  const [amount, setAmount] = useState("");
  const [odometer, setOdometer] = useState("");

  const handleSave = async () => {
    if (!liters || !amount) { Alert.alert("Error", "Please enter liters and amount"); return; }
    await addFuelLog({ liters: parseFloat(liters), amount: parseFloat(amount), odometer: odometer ? parseInt(odometer) : null });
    Alert.alert("Saved", "Fuel log added successfully");
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">Fuel Tracking</Text>
        <View className="w-10" />
      </View>
      <ScrollView contentContainerClassName="p-4">
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Fuel size={32} color="#0065ea" className="self-center mb-4" />
          <Text className="text-sm font-medium mt-3 mb-1 text-[#0065ea]">Liters filled</Text>
          <TextInput className="border border-[#0065ea] rounded-lg p-3 text-base text-[#0065ea]" placeholder="e.g., 40" placeholderTextColor="#0065ea" keyboardType="numeric" value={liters} onChangeText={setLiters} />
          <Text className="text-sm font-medium mt-3 mb-1 text-[#0065ea]">Amount (₹)</Text>
          <TextInput className="border border-[#0065ea] rounded-lg p-3 text-base text-[#0065ea]" placeholder="e.g., 5000" placeholderTextColor="#0065ea" keyboardType="numeric" value={amount} onChangeText={setAmount} />
          <Text className="text-sm font-medium mt-3 mb-1 text-[#0065ea]">Odometer reading (km) - optional</Text>
          <TextInput className="border border-[#0065ea] rounded-lg p-3 text-base text-[#0065ea]" placeholder="e.g., 12500" placeholderTextColor="#0065ea" keyboardType="numeric" value={odometer} onChangeText={setOdometer} />
          <TouchableOpacity className="bg-[#0065ea] flex-row items-center justify-center p-3.5 rounded-xl mt-5 gap-2" onPress={handleSave}>
            <Save size={20} color="white" /><Text className="text-white font-semibold text-base">Save Log</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}