import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Bell,
  Clock,
  Gauge,
  MapPin,
  Navigation,
  Share2,
  Target,
  Wifi,
  WifiOff
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
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { startLocationTracking, stopLocationTracking } from "../../../services/driverService";

const isWeb = Platform.OS === "web";

export default function GPSTracking() {
  const router = useRouter();
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState({ lat: 17.385, lng: 78.4867, address: "Main School" });
  const [speed, setSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [remainingStops, setRemainingStops] = useState(0);
  const [eta, setEta] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const card4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    const cards = [card1Anim, card2Anim, card3Anim, card4Anim];
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ...cards.map((anim, i) =>
        Animated.timing(anim, { 
          toValue: 1, 
          duration: 480, 
          delay: 60 + i * 80, 
          useNativeDriver: true 
        })
      ),
    ]).start();

    return () => {
      if (isTracking) stopLocationTracking();
    };
  }, []);

  // Pulse animation when tracking
  useEffect(() => {
    if (isTracking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isTracking]);

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

  const toggleTracking = () => {
    if (!isTracking) {
      Alert.alert("Start Live Tracking", "Parents and admin will see your location", [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Start", 
          onPress: () => {
            setIsTracking(true);
            startLocationTracking((data) => {
              setLocation({ lat: data.lat, lng: data.lng, address: "En route" });
              setSpeed(data.speed);
              setProgress(data.progress);
              setRemainingStops(data.remainingStops);
              setEta(data.eta);
            });
          }
        }
      ]);
    } else {
      stopLocationTracking();
      setIsTracking(false);
    }
  };

  const shareLocation = () => Alert.alert("Location Shared", "Your current location shared with admin");

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // ------------------------------------------------
  // WEB VERSION - UNCHANGED
  // ------------------------------------------------
  if (isWeb) {
    return (
      <>
        <StatusBar style="dark" />
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm flex-shrink-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105">
                <ArrowLeft size={24} color="#0065ea" />
              </button>
              <div className="flex items-center gap-2">
                <Target size={20} color="#0065ea" className="animate-pulse" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#0065ea] to-[#0099ff] bg-clip-text text-transparent">Live GPS Tracking</h1>
              </div>
              <div className="w-10" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="relative h-96 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 to-transparent"></div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#0065ea]/30 animate-ping" style={{ width: 120, height: 120, left: -36, top: -36 }}></div>
                    <div className="relative w-12 h-12 bg-[#0065ea] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Navigation size={24} color="white" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Text className="text-sm font-semibold text-gray-800">Current Location</Text>
                      {isTracking ? (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <Text className="text-xs text-green-600">Live</Text>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <Text className="text-xs text-gray-500">Offline</Text>
                        </div>
                      )}
                    </div>
                    <Text className="text-lg font-bold text-gray-900">{location.address}</Text>
                    <Text className="text-xs text-gray-500 mt-1 font-mono">{location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E</Text>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Gauge size={28} strokeWidth={1.5} />
                    <div className="bg-white/20 rounded-full p-2">
                      <Target size={16} />
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm mb-1">Current Speed</p>
                  <p className="text-3xl font-bold">{Math.round(speed)} <span className="text-lg">km/h</span></p>
                  <p className="text-blue-100 text-xs mt-2">Real-time update</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Clock size={28} strokeWidth={1.5} />
                    <div className="bg-white/20 rounded-full p-2">
                      <Target size={16} />
                    </div>
                  </div>
                  <p className="text-purple-100 text-sm mb-1">Estimated Arrival</p>
                  <p className="text-3xl font-bold">{eta || "--:--"}</p>
                  <p className="text-purple-100 text-xs mt-2">Expected time</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <MapPin size={28} strokeWidth={1.5} />
                    <div className="bg-white/20 rounded-full p-2">
                      <Target size={16} />
                    </div>
                  </div>
                  <p className="text-orange-100 text-sm mb-1">Remaining Stops</p>
                  <p className="text-3xl font-bold">{remainingStops}</p>
                  <p className="text-orange-100 text-xs mt-2">Students to pick</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <Target size={20} color="white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Trip Progress</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Route Progress</span>
                    <span className="font-semibold text-[#0065ea]">{Math.round(progress)}% Complete</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-gray-500">
                    <span>Start</span>
                    <span>School</span>
                    <span>Destination</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-[#0065ea] to-[#0099ff] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        {isTracking ? <Wifi size={20} color="white" /> : <WifiOff size={20} color="white" />}
                      </div>
                      <h2 className="text-xl font-semibold text-white">Live Tracking</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-700 font-medium">Enable Live Tracking</p>
                        <p className="text-xs text-gray-500 mt-1">Share your location with parents & admin</p>
                      </div>
                      <Switch 
                        value={isTracking} 
                        onValueChange={toggleTracking} 
                        trackColor={{ false: "#e2e8f0", true: "#0065ea" }} 
                        thumbColor={isTracking ? "#fff" : "#ff4b00"} 
                      />
                    </div>
                    {isTracking && (
                      <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <Text className="text-sm text-green-700">Your location is being shared with parents and admin</Text>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <Share2 size={20} color="white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Share Location</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">
                      Share your current location instantly with admin and emergency contacts
                    </p>
                    <button
                      onClick={shareLocation}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Share2 size={18} />
                      <span>Share Current Location</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell size={16} color="#0065ea" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Privacy Notice</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Your location is only shared when tracking is enabled. Parents and admin can see your real-time position for safety purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center pb-6">
                <p className="text-xs text-gray-400">© 2026 Transport Management System | GPS Tracking</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ------------------------------------------------
  // NATIVE VERSION (Android/iOS) - BENTO CARD DESIGN
  // ------------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2fb" }} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Header with back button */}
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
            shadowColor: "#0065ea",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <ArrowLeft size={20} color="#0065ea" />
        </RNTouchableOpacity>

        <RNView style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Target size={18} color="#0065ea" />
          <RNText style={{ fontSize: 17, fontWeight: "700", color: "#1e293b", letterSpacing: 0.2 }}>
            GPS Tracking
          </RNText>
        </RNView>

        {/* Status indicator */}
        <RNView style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: isTracking ? "#e8f0fe" : "#f1f5f9",
          justifyContent: "center",
          alignItems: "center",
        }}>
          {isTracking ? (
            <RNView style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981" }} />
          ) : (
            <RNView style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#94a3b8" }} />
          )}
        </RNView>
      </Animated.View>

      <RNScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 14 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0065ea"]} tintColor="#0065ea" />
        }
      >

        {/* ── BENTO 1: MAP / LOCATION CARD ── */}
        <BentoCard anim={card1Anim} style={{ marginBottom: 16 }}>
          <RNView style={{
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: "#1e293b",
            height: 280,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
          }}>
            {/* Animated pulse ring */}
            <RNView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Animated.View style={{ transform: [{ scale: isTracking ? pulseAnim : 1 }] }}>
                <RNView style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: "#0065ea",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#0065ea",
                  shadowOpacity: 0.5,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 8,
                }}>
                  <Navigation size={32} color="white" />
                </RNView>
              </Animated.View>

              {/* Status badge */}
              <RNView style={{
                position: "absolute",
                top: 16,
                right: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: "rgba(0,0,0,0.6)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <RNView style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isTracking ? "#10b981" : "#94a3b8" }} />
                <RNText style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>
                  {isTracking ? "LIVE" : "OFFLINE"}
                </RNText>
              </RNView>
            </RNView>

            {/* Location info overlay */}
            <RNView style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(255,255,255,0.95)",
              padding: 16,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
              <RNText style={{ fontSize: 12, fontWeight: "600", color: "#64748b", marginBottom: 2 }}>Current Location</RNText>
              <RNText style={{ fontSize: 16, fontWeight: "700", color: "#0065ea" }}>{location.address}</RNText>
              <RNText style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, fontFamily: "monospace" }}>
                {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
              </RNText>
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── BENTO 2: STATS CARDS ROW ── */}
        <BentoCard anim={card2Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Speed", value: `${Math.round(speed)}`, unit: "km/h", bg: "#eff6ff", border: "#bfdbfe", valColor: "#1d4ed8", iconBg: "#dbeafe", icon: <Gauge size={20} color="#2563eb" /> },
            { label: "ETA", value: eta || "--:--", unit: "", bg: "#f5f3ff", border: "#ddd6fe", valColor: "#6d28d9", iconBg: "#ede9fe", icon: <Clock size={20} color="#7c3aed" /> },
            { label: "Stops Left", value: remainingStops.toString(), unit: "", bg: "#fefce8", border: "#fde68a", valColor: "#92400e", iconBg: "#fef9c3", icon: <MapPin size={20} color="#ca8a04" /> },
          ].map((stat, idx) => (
            <RNView key={idx} style={{
              flex: 1, borderRadius: 18, padding: 14, alignItems: "center",
              backgroundColor: stat.bg, borderWidth: 1.5, borderColor: stat.border,
            }}>
              <RNView style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: stat.iconBg, justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
                {stat.icon}
              </RNView>
              <RNText style={{ fontSize: 18, fontWeight: "800", color: stat.valColor }}>{stat.value}</RNText>
              <RNText style={{ fontSize: 11, color: "#64748b", fontWeight: "500", marginTop: 2 }}>{stat.label}</RNText>
              {stat.unit && <RNText style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}>{stat.unit}</RNText>}
            </RNView>
          ))}
        </BentoCard>

        {/* ── BENTO 3: TRIP PROGRESS ── */}
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
            <RNView style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 16,
              paddingVertical: 13,
              backgroundColor: "#f0fdf4",
              borderBottomWidth: 1,
              borderBottomColor: "#dcfce7",
            }}>
              <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#dcfce7", justifyContent: "center", alignItems: "center" }}>
                <Target size={17} color="#16a34a" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#14532d" }}>Trip Progress</RNText>
              <RNView style={{ marginLeft: "auto", backgroundColor: "#dcfce7", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                <RNText style={{ fontSize: 12, fontWeight: "700", color: "#16a34a" }}>{Math.round(progress)}%</RNText>
              </RNView>
            </RNView>

            <RNView style={{ padding: 16 }}>
              <RNView style={{ height: 8, backgroundColor: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                <RNView style={{ height: "100%", width: `${progress}%`, backgroundColor: "#16a34a", borderRadius: 4 }} />
              </RNView>
              <RNView style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <RNText style={{ fontSize: 10, color: "#94a3b8" }}>Start</RNText>
                <RNText style={{ fontSize: 10, color: "#94a3b8" }}>Destination</RNText>
              </RNView>
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── BENTO 4: TRACKING CONTROL ── */}
        <BentoCard anim={card4Anim} style={{ marginBottom: 12 }}>
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
            <RNView style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 16,
              paddingVertical: 13,
              backgroundColor: "#f0f6ff",
              borderBottomWidth: 1,
              borderBottomColor: "#dbeafe",
            }}>
              <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center" }}>
                {isTracking ? <Wifi size={17} color="#0065ea" /> : <WifiOff size={17} color="#94a3b8" />}
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e3a8a" }}>Live Tracking</RNText>
            </RNView>

            <RNView style={{ padding: 16 }}>
              <RNView style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <RNView>
                  <RNText style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Enable Live Tracking</RNText>
                  <RNText style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Share location with parents & admin</RNText>
                </RNView>
                <Switch 
                  value={isTracking} 
                  onValueChange={toggleTracking} 
                  trackColor={{ false: "#e2e8f0", true: "#0065ea" }} 
                  thumbColor={isTracking ? "#fff" : "#ff4b00"} 
                />
              </RNView>

              {isTracking && (
                <RNView style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: "#e2e8f0",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <RNView style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981" }} />
                  <RNText style={{ fontSize: 12, color: "#10b981", fontWeight: "500" }}>
                    Location shared with parents & admin
                  </RNText>
                </RNView>
              )}
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── SHARE LOCATION BUTTON CARD ── */}
        <BentoCard anim={card4Anim} style={{ marginBottom: 12 }}>
          <RNTouchableOpacity
            onPress={shareLocation}
            activeOpacity={0.85}
            style={{
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor: "#fff",
              shadowColor: "#ec4899",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 3,
              borderWidth: 1,
              borderColor: "#fce7f3",
            }}
          >
            <RNView style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              paddingVertical: 16,
              backgroundColor: "#fdf2f8",
            }}>
              <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#fce7f3", justifyContent: "center", alignItems: "center" }}>
                <Share2 size={17} color="#ec4899" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#be185d" }}>Share Current Location</RNText>
            </RNView>
          </RNTouchableOpacity>
        </BentoCard>

        {/* ── PRIVACY NOTICE ── */}
        <Animated.View style={{
          backgroundColor: "#eff6ff",
          borderRadius: 16,
          padding: 14,
          marginTop: 8,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: "#dbeafe",
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <RNView style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
            <RNView style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#dbeafe", alignItems: "center", justifyContent: "center" }}>
              <Bell size={14} color="#0065ea" />
            </RNView>
            <RNView style={{ flex: 1 }}>
              <RNText style={{ fontSize: 12, fontWeight: "700", color: "#1e293b" }}>Privacy Notice</RNText>
              <RNText style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                Location shared only when tracking is enabled for safety purposes.
              </RNText>
            </RNView>
          </RNView>
        </Animated.View>

        {/* Footer */}
        <RNText style={{ textAlign: "center", fontSize: 10, color: "#cbd5e1", marginTop: 16, marginBottom: 8 }}>
          © 2026 Transport Management System | GPS Tracking
        </RNText>
      </RNScrollView>
    </SafeAreaView>
  );
}