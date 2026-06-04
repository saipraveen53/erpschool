import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Heart,
  MapPin,
  Phone,
  Send,
  Shield,
  User,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  RefreshControl,
  ScrollView as RNScrollView,
  Text as RNText,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getEmergencyContacts,
  sendEmergencySOS,
} from "../../../services/driverService";

const isWeb = Platform.OS === "web";

export default function EmergencyAlert() {
  const router = useRouter();
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getEmergencyContacts().then(setContacts);
    
    const cards = [card1Anim, card2Anim, card3Anim];
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      ...cards.map((anim, i) =>
        Animated.timing(anim, { 
          toValue: 1, 
          duration: 480, 
          delay: 60 + i * 80, 
          useNativeDriver: true 
        })
      ),
    ]).start();
  }, []);

  useEffect(() => {
    if (isEmergencyMode) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isEmergencyMode]);

  const BentoCard = ({ anim, children, style = {} }: any) => (
    <Animated.View
      style={[
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  const sendEmergencyAlert = () => {
    Alert.alert(
      "🚨 Emergency Alert",
      "This will notify ALL your emergency contacts immediately. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Alert",
          style: "destructive",
          onPress: async () => {
            setIsEmergencyMode(true);
            await sendEmergencySOS("general", { lat: 17.385, lng: 78.4867 });
            Alert.alert(
              "✅ Alert Sent",
              "Emergency alert has been sent to all contacts."
            );
          },
        },
      ]
    );
  };

  const cancelEmergency = () => {
    Alert.alert("Cancel Emergency", "Are you sure you want to cancel?", [
      { text: "No, Keep Active", style: "cancel" },
      { text: "Yes, Cancel", onPress: () => setIsEmergencyMode(false) },
    ]);
  };

  const makeCall = (number: string) =>
    Alert.alert("📞 Call", `Calling ${number}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => Alert.alert("Calling", `Dialing ${number}...`),
      },
    ]);

  const onRefresh = async () => {
    setRefreshing(true);
    const freshContacts = await getEmergencyContacts();
    setContacts(freshContacts);
    setRefreshing(false);
  };

  // ------------------------------------------------
  // WEB VERSION - UNCHANGED
  // ------------------------------------------------
  if (isWeb) {
    return (
      <>
        <StatusBar style="dark" />
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-red-50/30 to-orange-50/30 overflow-hidden">
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all"
              >
                <ArrowLeft size={22} color="#ff4b00" />
              </button>
              <h1 className="text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Emergency Alert
              </h1>
              <div className="w-8" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                <div className="lg:col-span-2">
                  <div
                    className={`rounded-xl shadow-lg overflow-hidden ${
                      isEmergencyMode
                        ? "bg-gradient-to-br from-[#0065ea] to-blue-600"
                        : "bg-gradient-to-br from-red-500 to-orange-500"
                    }`}
                  >
                    <button
                      onClick={
                        isEmergencyMode ? cancelEmergency : sendEmergencyAlert
                      }
                      className="w-full py-8 text-center group"
                    >
                      {isEmergencyMode ? (
                        <>
                          <div className="animate-pulse mb-2">
                            <AlertTriangle
                              size={48}
                              color="white"
                              className="mx-auto"
                            />
                          </div>
                          <Text className="text-white font-bold text-xl mb-1">
                            CANCEL EMERGENCY
                          </Text>
                          <Text className="text-white/70 text-xs">
                            Tap to cancel emergency mode
                          </Text>
                        </>
                      ) : (
                        <>
                          <AlertTriangle
                            size={48}
                            color="white"
                            className="mx-auto mb-2 group-hover:scale-110 transition-transform"
                          />
                          <Text className="text-white font-bold text-xl mb-1">
                            SEND EMERGENCY ALERT
                          </Text>
                          <Text className="text-white/70 text-xs">
                            All contacts will be notified
                          </Text>
                        </>
                      )}
                    </button>
                  </div>
                  {isEmergencyMode && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0065ea] animate-ping" />
                      <Text className="text-xs font-medium text-[#0065ea]">
                        Emergency Mode Active
                      </Text>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl shadow p-3 text-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <User size={16} color="#ff4b00" />
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {contacts.length}
                    </p>
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

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Emergency Contacts
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 rounded-full p-1.5">
                            <Phone size={12} color="white" />
                          </div>
                          <h3 className="text-white font-semibold text-sm">
                            Contact {index + 1}
                          </h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <User size={20} color="#ff4b00" />
                          </div>
                          <div>
                            <Text className="text-base font-bold text-gray-800">
                              {contact.name}
                            </Text>
                            <Text className="text-xs text-gray-500">
                              {contact.relation}
                            </Text>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-3">
                          <Text className="text-xs text-gray-500">Phone</Text>
                          <Text className="text-xs font-semibold text-gray-800">
                            {contact.number}
                          </Text>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white/20 rounded-full p-1.5">
                      <MapPin size={18} color="white" />
                    </div>
                    <h2 className="text-base font-semibold text-white">
                      Share Location
                    </h2>
                  </div>
                  <p className="text-blue-100 text-xs mb-3">
                    Your current location will be shared with emergency contacts
                    when you send an alert
                  </p>
                  <button
                    onClick={() =>
                      Alert.alert(
                        "Location Shared",
                        "Your current location has been shared"
                      )
                    }
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
                    <h2 className="text-base font-semibold text-white">
                      Safety Tips
                    </h2>
                  </div>
                  <ul className="space-y-1 text-green-100 text-xs">
                    <li className="flex items-start gap-2">
                      • Share live location with family
                    </li>
                    <li className="flex items-start gap-2">
                      • Keep emergency contacts updated
                    </li>
                    <li className="flex items-start gap-2">
                      • Stay calm in emergency
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center pb-6">
                <p className="text-xs text-gray-400">
                  © 2026 Transport Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ------------------------------------------------
  // NATIVE VERSION (Android/iOS) - REDESIGNED WITH BENTO CARDS
  // ------------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2fb" }} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Header with back button - matching other screens */}
      <Animated.View style={{
        opacity: fadeAnim,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingTop: 6,
        paddingBottom: 12,
        backgroundColor: "#eef2fb",
      }}>
        <RNTouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#ff4b00",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <ArrowLeft size={20} color="#ff4b00" />
        </RNTouchableOpacity>
        
        <RNText style={{ fontSize: 17, fontWeight: "700", color: "#1e293b", letterSpacing: 0.2 }}>
          Emergency Alert
        </RNText>
        
        {/* Contact count badge */}
        <RNView style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: "#fff0eb",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#ff4b00",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <RNText style={{ fontSize: 14, fontWeight: "700", color: "#ff4b00" }}>
            {contacts.length}
          </RNText>
        </RNView>
      </Animated.View>

      <RNScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 14 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ff4b00"]} tintColor="#ff4b00" />
        }
      >
        {/* Emergency Mode Banner */}
        {isEmergencyMode && (
          <Animated.View style={{
            backgroundColor: "#fef3c7",
            borderRadius: 14,
            paddingVertical: 10,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
            marginTop: 4,
            borderWidth: 1,
            borderColor: "#fde68a",
          }}>
            <RNView style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#e67e00" }} />
            <RNText style={{ fontSize: 12, fontWeight: "600", color: "#92400e", flex: 1 }}>
              Emergency Mode Active — Contacts Notified
            </RNText>
          </Animated.View>
        )}

        {/* ── BENTO 1: SOS BUTTON ── */}
        <BentoCard anim={card1Anim} style={{ marginBottom: 16 }}>
          <Animated.View style={{ transform: [{ scale: isEmergencyMode ? pulseAnim : 1 }] }}>
            <RNTouchableOpacity
              onPress={isEmergencyMode ? cancelEmergency : sendEmergencyAlert}
              activeOpacity={0.85}
              style={{
                borderRadius: 24,
                overflow: "hidden",
                shadowColor: isEmergencyMode ? "#0065ea" : "#ff4b00",
                shadowOpacity: 0.35,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 10,
              }}
            >
              <RNView style={{
                backgroundColor: isEmergencyMode ? "#0065ea" : "#ff4b00",
                paddingVertical: 32,
                paddingHorizontal: 24,
                alignItems: "center",
                gap: 12,
              }}>
                <RNView style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <AlertTriangle size={40} color="white" />
                </RNView>
                <RNText style={{ color: "#fff", fontWeight: "800", fontSize: 20, letterSpacing: 1 }}>
                  {isEmergencyMode ? "CANCEL EMERGENCY" : "SEND SOS ALERT"}
                </RNText>
                <RNText style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, textAlign: "center" }}>
                  {isEmergencyMode
                    ? "Tap to deactivate emergency mode"
                    : "All emergency contacts will be notified instantly"}
                </RNText>
              </RNView>
            </RNTouchableOpacity>
          </Animated.View>
        </BentoCard>

        {/* ── BENTO 2: STATS CARDS ROW ── */}
        <BentoCard anim={card2Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Contacts", value: contacts.length.toString(), bg: "#fff0eb", border: "#ffddd6", valColor: "#ff4b00", iconBg: "#ffe0d6", icon: <User size={20} color="#ff4b00" /> },
            { label: "Support", value: "24/7", bg: "#fff7ed", border: "#fed7aa", valColor: "#f97316", iconBg: "#ffedd5", icon: <Clock size={20} color="#f97316" /> },
            { label: "Protected", value: "Safe", bg: "#ecfdf5", border: "#bbf7d0", valColor: "#10b981", iconBg: "#dcfce7", icon: <Shield size={20} color="#10b981" /> },
          ].map((stat, idx) => (
            <RNView key={idx} style={{
              flex: 1, borderRadius: 18, padding: 14, alignItems: "center",
              backgroundColor: stat.bg, borderWidth: 1.5, borderColor: stat.border,
            }}>
              <RNView style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: stat.iconBg, justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
                {stat.icon}
              </RNView>
              <RNText style={{ fontSize: 20, fontWeight: "800", color: stat.valColor }}>{stat.value}</RNText>
              <RNText style={{ fontSize: 11, color: "#64748b", fontWeight: "500", marginTop: 2 }}>{stat.label}</RNText>
            </RNView>
          ))}
        </BentoCard>

        {/* ── BENTO 3: EMERGENCY CONTACTS ── */}
        <BentoCard anim={card3Anim} style={{ marginBottom: 16 }}>
          <RNView style={{
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: "#fff",
            shadowColor: "#1e293b",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.07,
            shadowRadius: 10,
            elevation: 3,
            borderWidth: 1,
            borderColor: "#f1f5f9",
          }}>
            {/* Header */}
            <RNView style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 16,
              paddingVertical: 13,
              backgroundColor: "#fffaf5",
              borderBottomWidth: 1,
              borderBottomColor: "#fee2e2",
            }}>
              <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#fee2e2", justifyContent: "center", alignItems: "center" }}>
                <Phone size={17} color="#ff4b00" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#7c2d12" }}>Emergency Contacts</RNText>
              <RNView style={{ marginLeft: "auto", backgroundColor: "#fee2e2", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                <RNText style={{ fontSize: 12, fontWeight: "700", color: "#ff4b00" }}>{contacts.length}</RNText>
              </RNView>
            </RNView>

            <RNView style={{ padding: 12 }}>
              {contacts.length === 0 ? (
                <RNView style={{ alignItems: "center", paddingVertical: 28 }}>
                  <RNView style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: "#fef2f2", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                    <User size={26} color="#ff4b00" />
                  </RNView>
                  <RNText style={{ color: "#475569", fontSize: 13, fontWeight: "500" }}>No contacts found</RNText>
                  <RNText style={{ color: "#94a3b8", fontSize: 11, marginTop: 3 }}>Add emergency contacts in settings</RNText>
                </RNView>
              ) : (
                contacts.map((contact, index) => (
                  <RNView key={index} style={{
                    borderRadius: 16,
                    marginBottom: 10,
                    backgroundColor: "#f8fafc",
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    overflow: "hidden",
                  }}>
                    {/* Color accent strip */}
                    <RNView style={{ height: 3, backgroundColor: index % 2 === 0 ? "#ff4b00" : "#0065ea" }} />
                    <RNView style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
                      {/* Avatar */}
                      <RNView style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        backgroundColor: index % 2 === 0 ? "#fff0eb" : "#e8f0fe",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <User size={24} color={index % 2 === 0 ? "#ff4b00" : "#0065ea"} />
                      </RNView>

                      {/* Info */}
                      <RNView style={{ flex: 1 }}>
                        <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e293b", marginBottom: 2 }}>
                          {contact.name}
                        </RNText>
                        <RNText style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>
                          {contact.relation}
                        </RNText>
                        <RNText style={{ fontSize: 12, color: "#64748b" }}>
                          {contact.number}
                        </RNText>
                      </RNView>

                      {/* Call Button */}
                      <RNTouchableOpacity
                        onPress={() => makeCall(contact.number)}
                        activeOpacity={0.75}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: index % 2 === 0 ? "#ff4b00" : "#0065ea",
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: index % 2 === 0 ? "#ff4b00" : "#0065ea",
                          shadowOpacity: 0.3,
                          shadowRadius: 6,
                          shadowOffset: { width: 0, height: 3 },
                          elevation: 4,
                        }}
                      >
                        <Phone size={20} color="white" />
                      </RNTouchableOpacity>
                    </RNView>
                  </RNView>
                ))
              )}
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── SHARE LOCATION CARD ── */}
        <Animated.View style={{
          backgroundColor: "#0065ea",
          borderRadius: 20,
          padding: 18,
          marginBottom: 12,
          shadowColor: "#0065ea",
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <RNView style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <RNView style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={18} color="white" />
            </RNView>
            <RNText style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>Share Location</RNText>
          </RNView>
          <RNText style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 19, marginBottom: 14 }}>
            Your current location will be shared with all emergency contacts when you trigger an alert.
          </RNText>
          <RNTouchableOpacity
            onPress={() => Alert.alert("Location Shared", "Your current location has been shared with contacts.")}
            activeOpacity={0.85}
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: 14,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Send size={16} color="#0065ea" />
            <RNText style={{ fontSize: 14, fontWeight: "700", color: "#0065ea" }}>Share Current Location</RNText>
          </RNTouchableOpacity>
        </Animated.View>

        {/* ── SAFETY TIPS CARD ── */}
        <Animated.View style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 18,
          marginBottom: 8,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <RNView style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <RNView style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#ecfdf5", alignItems: "center", justifyContent: "center" }}>
              <Heart size={18} color="#10b981" />
            </RNView>
            <RNText style={{ fontSize: 16, fontWeight: "700", color: "#1e293b" }}>Safety Tips</RNText>
          </RNView>

          {[
            { icon: <MapPin size={14} color="#0065ea" />, tip: "Share your live location with family before long trips", bg: "#e8f0fe" },
            { icon: <User size={14} color="#ff4b00" />, tip: "Keep emergency contact details up to date", bg: "#fff0eb" },
            { icon: <Shield size={14} color="#10b981" />, tip: "Stay calm and follow safety protocols during emergencies", bg: "#ecfdf5" },
            { icon: <Phone size={14} color="#f97316" />, tip: "Save local emergency numbers (police, ambulance, fire)", bg: "#fff7ed" },
          ].map((item, i) => (
            <RNView key={i} style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: i < 3 ? 12 : 0,
              backgroundColor: "#f9fafb",
              borderRadius: 14,
              padding: 12,
            }}>
              <RNView style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: item.bg, alignItems: "center", justifyContent: "center" }}>
                {item.icon}
              </RNView>
              <RNText style={{ fontSize: 13, color: "#475569", lineHeight: 18, flex: 1 }}>
                {item.tip}
              </RNText>
            </RNView>
          ))}
        </Animated.View>

        {/* Footer */}
        <RNText style={{ textAlign: "center", fontSize: 11, color: "#cbd5e1", marginTop: 16, marginBottom: 8 }}>
          © 2026 Transport Management System
        </RNText>
      </RNScrollView>
    </SafeAreaView>
  );
}