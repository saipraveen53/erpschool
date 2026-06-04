import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getInspectionItems } from "../../services/driverService";

export default function Inspection() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [checks, setChecks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInspectionItems().then(data => {
      setItems(data);
      const initial = {};
      data.forEach(item => { initial[item.id] = false; });
      setChecks(initial);
      setLoading(false);
    });
  }, []);

  const toggle = (id) => setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  const allChecked = items.every(item => checks[item.id] === true);

  const confirmTrip = () => {
    if (allChecked) { Alert.alert("Inspection Passed", "You can start the trip now"); router.back(); }
    else { Alert.alert("Incomplete", "Please complete all checks before starting trip"); }
  };

  if (loading) return <SafeAreaView className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">Vehicle Inspection</Text>
        <View className="w-10" />
      </View>
      <ScrollView contentContainerClassName="p-4">
        {items.map(item => (
          <TouchableOpacity key={item.id} className="flex-row items-center gap-3 bg-white p-4 rounded-xl mb-3" onPress={() => toggle(item.id)}>
            {checks[item.id] ? <CheckCircle size={24} color="#00a652" /> : <Circle size={24} color="#0065ea" />}
            <Text className="text-base font-medium text-[#0065ea]">{item.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity className={`p-4 rounded-xl items-center mt-6 ${allChecked ? "bg-[#0065ea]" : "bg-[#ff4b00]"}`} onPress={confirmTrip} disabled={!allChecked}>
          <Text className="text-white font-semibold text-base">{allChecked ? "All Good, Start Trip" : "Complete All Checks"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}