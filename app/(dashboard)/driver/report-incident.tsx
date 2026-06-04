import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Send } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReportTypes, submitIncidentReport } from "../../services/driverService";

export default function ReportIncident() {
  const router = useRouter();
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => { getReportTypes().then(setTypes); }, []);

  const handleSubmit = async () => {
    if (!selectedType || !description) { Alert.alert("Error", "Please fill all fields"); return; }
    await submitIncidentReport({ type: selectedType, description });
    Alert.alert("Reported", "Incident report submitted");
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">Report Incident</Text>
        <View className="w-10" />
      </View>
      <ScrollView contentContainerClassName="p-4">
        <Text className="text-sm font-medium mt-4 mb-2 text-[#0065ea]">Incident Type</Text>
        <View className="flex-row flex-wrap gap-2">
          {types.map(type => (
            <TouchableOpacity key={type.id} className={`px-4 py-2 rounded-full ${selectedType === type.id ? "bg-[#0065ea]" : "bg-white"}`} onPress={() => setSelectedType(type.id)}>
              <Text className={`${selectedType === type.id ? "text-white" : "text-[#0065ea]"}`}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-sm font-medium mt-4 mb-2 text-[#0065ea]">Description</Text>
        <TextInput className="border border-[#0065ea] rounded-lg p-3 text-base min-h-[100px] text-left align-top text-[#0065ea]" placeholder="Describe the incident..." placeholderTextColor="#0065ea" multiline numberOfLines={4} value={description} onChangeText={setDescription} />
        <TouchableOpacity className="bg-[#0065ea] flex-row items-center justify-center p-3.5 rounded-xl mt-5 gap-2" onPress={handleSubmit}>
          <Send size={20} color="white" /><Text className="text-white font-semibold text-base">Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}