import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, CheckCircle, Home, MapPin, MessageCircle, Phone, Search, User, XCircle } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDriverStudents, updateStudentPickupStatus } from "../../../services/driverService";

export default function PickupList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const loadStudents = async () => {
    const data = await getDriverStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => { loadStudents(); }, []);

  const updateStatus = async (id, newStatus) => {
    await updateStudentPickupStatus(id, newStatus);
    loadStudents();
    Alert.alert("Status Updated", `Student marked as ${newStatus}`);
  };

  const callParent = (phone) => Linking.openURL(`tel:${phone}`);
  const whatsappParent = (phone) => Linking.openURL(`https://wa.me/${phone}`);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.pickupPoint.toLowerCase().includes(search.toLowerCase()));
  const picked = students.filter(s => s.status === "picked").length;
  const total = students.length;
  const percentage = (picked / total) * 100;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600 }).start();
    Animated.timing(progressAnim, { toValue: percentage, duration: 800 }).start();
  }, [percentage]);

  if (loading) return <SafeAreaView className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">Pickup List</Text>
        <View className="w-10" />
      </View>
      <Animated.View className="bg-white mx-4 my-4 p-4 rounded-xl" style={{ opacity: fadeAnim }}>
        <View className="flex-row justify-between mb-3">
          <Text className="text-sm font-medium text-[#0065ea]">Today's Pickup Progress</Text>
          <Text className="text-sm font-bold text-[#0065ea]">{picked}/{total}</Text>
        </View>
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <Animated.View className="h-full bg-[#0065ea]" style={{ width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) }} />
        </View>
      </Animated.View>
      <View className="flex-row items-center bg-white mx-4 mb-4 px-3 py-2.5 rounded-xl border border-[#0065ea]">
        <Search size={20} color="#0065ea" />
        <TextInput className="flex-1 ml-2 text-[#0065ea]" placeholder="Search by name or pickup point" placeholderTextColor="#0065ea" value={search} onChangeText={setSearch} />
      </View>
      <ScrollView>
        {filtered.map((student) => (
          <View key={student.id} className="flex-row items-center bg-white mx-4 mb-2 p-3 rounded-xl">
            <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center">
              <User size={24} color="#0065ea" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-[#0065ea]">{student.name}</Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <MapPin size={12} color="#0065ea" />
                <Text className="text-xs text-[#0065ea]">{student.pickupPoint}</Text>
              </View>
              <Text className="text-xs text-[#0065ea] mt-0.5">Class {student.class}</Text>
              <View className="flex-row gap-2 mt-2 flex-wrap">
                {student.status !== "picked" && (
                  <TouchableOpacity className="flex-row items-center gap-1 bg-[#00a652] px-2 py-1 rounded-xl" onPress={() => updateStatus(student.id, "picked")}>
                    <CheckCircle size={16} color="white" /><Text className="text-white text-xs">Picked</Text>
                  </TouchableOpacity>
                )}
                {student.status !== "absent" && (
                  <TouchableOpacity className="flex-row items-center gap-1 bg-[#ff4b00] px-2 py-1 rounded-xl" onPress={() => updateStatus(student.id, "pending")}>
                    <XCircle size={16} color="white" /><Text className="text-white text-xs">Absent</Text>
                  </TouchableOpacity>
                )}
                {student.status === "picked" && (
                  <TouchableOpacity className="flex-row items-center gap-1 bg-[#0065ea] px-2 py-1 rounded-xl" onPress={() => updateStatus(student.id, "dropped")}>
                    <Home size={16} color="white" /><Text className="text-white text-xs">Dropped</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity className="p-1.5 bg-white rounded-full" onPress={() => callParent(student.phone)}>
                  <Phone size={16} color="#0065ea" />
                </TouchableOpacity>
                <TouchableOpacity className="p-1.5 bg-green-50 rounded-full" onPress={() => whatsappParent(student.phone)}>
                  <MessageCircle size={16} color="#25D366" />
                </TouchableOpacity>
              </View>
            </View>
            <Text className="text-[10px] font-medium px-2 py-1 rounded-xl bg-white text-[#0065ea]">{student.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}