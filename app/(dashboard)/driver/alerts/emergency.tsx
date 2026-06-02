import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle, ArrowLeft, MapPin, Phone, Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEmergencyContacts, sendEmergencySOS } from "../../../services/driverService";

export default function EmergencyAlert() {
  const router = useRouter();
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [contacts, setContacts] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getEmergencyContacts().then(setContacts);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600 }).start();
  }, []);

  useEffect(() => {
    if (isEmergencyMode) {
      Animated.loop(Animated.sequence([Animated.timing(pulseAnim, { toValue: 1.2, duration: 800 }), Animated.timing(pulseAnim, { toValue: 1, duration: 800 })])).start();
    } else { pulseAnim.setValue(1); }
  }, [isEmergencyMode]);

  const sendEmergencyAlert = () => {
    Alert.alert("Emergency Alert", "Send alert? All contacts will be notified.", [
      { text: "Cancel", style: "cancel" },
      { text: "Send Alert", style: "destructive", onPress: async () => {
        setIsEmergencyMode(true);
        await sendEmergencySOS("general", { lat: 17.385, lng: 78.4867 });
        Alert.alert("Alert Sent", "Emergency alert has been sent to all contacts");
      }}
    ]);
  };

  const cancelEmergency = () => {
    Alert.alert("Cancel Alert", "Are you sure?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => setIsEmergencyMode(false) },
    ]);
  };

  const makeCall = (number) => Alert.alert("Call", `Calling ${number}`, [{ text: "Cancel" }, { text: "Call", onPress: () => Alert.alert("Calling", `Dialing ${number}...`) }]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="p-2"><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">Emergency Alert</Text>
        <View className="w-10" />
      </View>
      <Animated.View className="p-4" style={{ opacity: fadeAnim }}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity className={`p-6 rounded-2xl items-center gap-3 ${isEmergencyMode ? "bg-[#0065ea]" : "bg-[#ff4b00]"}`} onPress={isEmergencyMode ? cancelEmergency : sendEmergencyAlert} activeOpacity={0.8}>
            <AlertTriangle size={48} color="white" />
            <Text className="text-white font-bold text-lg">{isEmergencyMode ? "CANCEL EMERGENCY" : "SEND EMERGENCY ALERT"}</Text>
          </TouchableOpacity>
        </Animated.View>
        {isEmergencyMode && (
          <View className="flex-row items-center justify-center mt-3 gap-2">
            <View className="w-3 h-3 rounded-full bg-[#0065ea]" />
            <Text className="text-sm font-medium text-[#0065ea]">Emergency Mode Active</Text>
          </View>
        )}
      </Animated.View>
      <Text className="text-base font-semibold text-[#0065ea] mx-4 mt-5 mb-3">Emergency Contacts</Text>
      {contacts.map((contact, index) => (
        <Animated.View key={index} className="bg-white mx-4 mb-2 rounded-xl" style={{ opacity: fadeAnim }}>
          <TouchableOpacity className="flex-row items-center p-3" onPress={() => makeCall(contact.number)} activeOpacity={0.7}>
            <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center"><Phone size={24} color="#0065ea" /></View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-[#0065ea]">{contact.name}</Text>
              <Text className="text-xs text-[#0065ea] mt-0.5">{contact.relation}</Text>
              <Text className="text-xs text-[#0065ea] mt-0.5">{contact.number}</Text>
            </View>
            <View className="p-3"><Phone size={20} color="#0065ea" /></View>
          </TouchableOpacity>
        </Animated.View>
      ))}
      <Animated.View className="bg-white mx-4 mt-5 mb-6 p-4 rounded-xl" style={{ opacity: fadeAnim }}>
        <View className="flex-row items-center gap-2 mb-3">
          <MapPin size={20} color="#0065ea" />
          <Text className="text-sm font-semibold text-[#0065ea]">Share Location</Text>
        </View>
        <Text className="text-xs text-[#0065ea] leading-5 mb-3">Your current location will be shared with emergency contacts when you send an alert</Text>
        <TouchableOpacity className="flex-row items-center justify-center bg-white p-2.5 rounded-lg gap-2" activeOpacity={0.7}>
          <Send size={18} color="#0065ea" />
          <Text className="text-sm font-medium text-[#0065ea]">Share Current Location</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}