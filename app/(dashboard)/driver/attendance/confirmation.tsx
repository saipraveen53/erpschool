import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, CheckCircle, Search, User, XCircle } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDriverAttendance, updateAttendanceStatus } from "../../../services/driverService";

export default function AttendanceConfirmation() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadData = async () => {
    const data = await getDriverAttendance();
    setAttendance(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "present" ? "absent" : "present";
    await updateAttendanceStatus(id, newStatus);
    loadData();
  };

  useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 600 }).start(); }, []);

  if (loading) return <SafeAreaView className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#0065ea" /></SafeAreaView>;

  const filtered = attendance.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const present = attendance.filter(s => s.status === "present").length;
  const total = attendance.length;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">Attendance</Text>
        <View className="w-10" />
      </View>
      <Animated.View className="flex-row bg-white mx-4 my-4 p-4 rounded-xl justify-around" style={{ opacity: fadeAnim }}>
        <View className="items-center flex-1">
          <CheckCircle size={24} color="#00a652" />
          <Text className="text-xl font-bold mt-1 text-[#0065ea]">{present}</Text>
          <Text className="text-sm text-gray-500">Present</Text>
        </View>
        <View className="w-px bg-gray-100" />
        <View className="items-center flex-1">
          <XCircle size={24} color="#ff4b00" />
          <Text className="text-xl font-bold mt-1 text-[#0065ea]">{total - present}</Text>
          <Text className="text-sm text-gray-500">Absent</Text>
        </View>
      </Animated.View>
      <View className="flex-row items-center bg-white mx-4 mb-4 px-3 py-2.5 rounded-xl border border-[#0065ea]">
        <Search size={20} color="#0065ea" />
        <TextInput className="flex-1 ml-2 text-[#0065ea]" placeholder="Search student" placeholderTextColor="#0065ea" value={search} onChangeText={setSearch} />
      </View>
      <ScrollView>
        {filtered.map((student) => (
          <View key={student.id} className="flex-row items-center bg-white mx-4 mb-2 p-3 rounded-xl">
            <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center">
              <User size={24} color="#0065ea" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-[#0065ea]">{student.name}</Text>
              {student.status === "present" && <Text className="text-xs text-[#00a652] mt-0.5">Boarded at {student.time}</Text>}
            </View>
            <TouchableOpacity className={`px-4 py-2 rounded-full ${student.status === "present" ? "bg-[#00a652]" : "bg-[#ff4b00]"}`} onPress={() => toggleStatus(student.id, student.status)}>
              <Text className="text-white text-sm">{student.status === "present" ? "Present" : "Absent"}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity className="bg-[#0065ea] mx-4 my-4 p-3.5 rounded-xl items-center" onPress={() => { Alert.alert("Submitted", "Attendance saved"); router.back(); }}>
        <Text className="text-white font-semibold text-base">Submit Attendance</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}