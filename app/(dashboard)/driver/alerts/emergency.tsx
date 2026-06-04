import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle, ArrowLeft, Clock, Heart, MapPin, Phone, Send, Shield, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEmergencyContacts, sendEmergencySOS } from "../../../services/driverService";

const isWeb = Platform.OS === "web";

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

  // ------------------------------------------------
  // WEB VERSION - COMPACT BENTO GRID WITH SCROLLING
  // ------------------------------------------------
  if (isWeb) {
    return (
      <>
        <StatusBar style="dark" />
        {/* Main container with fixed height and scrolling */}
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-red-50/30 to-orange-50/30 overflow-hidden">
          {/* Compact header - fixed at top */}
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-100 rounded-full transition-all">
                <ArrowLeft size={22} color="#ff4b00" />
              </button>
              <h1 className="text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Emergency Alert</h1>
              <div className="w-8" />
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-5">
              {/* Main Emergency Row - Compact */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                {/* Emergency Button Card */}
                <div className="lg:col-span-2">
                  <div className={`rounded-xl shadow-lg overflow-hidden ${isEmergencyMode ? "bg-gradient-to-br from-[#0065ea] to-blue-600" : "bg-gradient-to-br from-red-500 to-orange-500"}`}>
                    <button
                      onClick={isEmergencyMode ? cancelEmergency : sendEmergencyAlert}
                      className="w-full py-8 text-center group"
                    >
                      {isEmergencyMode ? (
                        <>
                          <div className="animate-pulse mb-2">
                            <AlertTriangle size={48} color="white" className="mx-auto" />
                          </div>
                          <Text className="text-white font-bold text-xl mb-1">CANCEL EMERGENCY</Text>
                          <Text className="text-white/70 text-xs">Tap to cancel emergency mode</Text>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={48} color="white" className="mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <Text className="text-white font-bold text-xl mb-1">SEND EMERGENCY ALERT</Text>
                          <Text className="text-white/70 text-xs">All contacts will be notified</Text>
                        </>
                      )}
                    </button>
                  </div>
                  {isEmergencyMode && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0065ea] animate-ping" />
                      <Text className="text-xs font-medium text-[#0065ea]">Emergency Mode Active</Text>
                    </div>
                  )}
                </div>

                {/* Stats Cards - Compact */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl shadow p-3 text-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <User size={16} color="#ff4b00" />
                    </div>
                    <p className="text-xl font-bold text-gray-800">{contacts.length}</p>
                    <p className="text-xs text-gray-500">Contacts</p>
                  </div>

                  <div className="bg-white rounded-xl shadow p-3 text-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock size={16} color="#f97316" />
                    </div>
                    <p className="text-xl font-bold text-gray-800">24/7</p>
                    <p className="text-xs text-gray-500">Support</p>
                  </div>

                  <div className="bg-white rounded-xl shadow p-3 text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield size={16} color="#10b981" />
                    </div>
                    <p className="text-xl font-bold text-gray-800">Safe</p>
                    <p className="text-xs text-gray-500">Protected</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts - Compact Grid */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
                  <h2 className="text-base font-semibold text-gray-800">Emergency Contacts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.map((contact, index) => (
                    <div key={index} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-all">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 rounded-full p-1.5">
                            <Phone size={12} color="white" />
                          </div>
                          <h3 className="text-white font-semibold text-sm">Contact {index + 1}</h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <User size={20} color="#ff4b00" />
                          </div>
                          <div>
                            <Text className="text-base font-bold text-gray-800">{contact.name}</Text>
                            <Text className="text-xs text-gray-500">{contact.relation}</Text>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-3">
                          <Text className="text-xs text-gray-500">Phone</Text>
                          <Text className="text-xs font-semibold text-gray-800">{contact.number}</Text>
                        </div>
                        <button
                          onClick={() => makeCall(contact.number)}
                          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-all"
                        >
                          <Phone size={14} color="white" />
                          <span>Call {contact.name}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Location & Tips - Compact Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white/20 rounded-full p-1.5">
                      <MapPin size={18} color="white" />
                    </div>
                    <h2 className="text-base font-semibold text-white">Share Location</h2>
                  </div>
                  <p className="text-blue-100 text-xs mb-3">
                    Your current location will be shared with emergency contacts when you send an alert
                  </p>
                  <button
                    onClick={() => Alert.alert("Location Shared", "Your current location has been shared")}
                    className="w-full bg-white text-blue-600 font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-all hover:scale-105"
                  >
                    <Send size={14} />
                    <span>Share Location</span>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white/20 rounded-full p-1.5">
                      <Heart size={18} color="white" />
                    </div>
                    <h2 className="text-base font-semibold text-white">Safety Tips</h2>
                  </div>
                  <ul className="space-y-1 text-green-100 text-xs">
                    <li className="flex items-start gap-2">• Share live location with family</li>
                    <li className="flex items-start gap-2">• Keep emergency contacts updated</li>
                    <li className="flex items-start gap-2">• Stay calm in emergency</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pb-6">
                <p className="text-xs text-gray-400">© 2026 Transport Management System</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ------------------------------------------------
  // NATIVE VERSION (Android/iOS) - KEPT SAME
  // ------------------------------------------------
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