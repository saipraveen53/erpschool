import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Award, Bus, Calendar, Clock, CreditCard, Mail, MapPin, Phone, Shield, Star, TrendingUp } from "lucide-react-native";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  ScrollView as RNScrollView,
  Text as RNText,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { root1Api } from "../../utils/axiosInstance";

const isWeb = Platform.OS === "web";

// API fetch function
const fetchDriverProfile = async () => {
  const response = await root1Api.get("/api/student/transport/driver/profile");
  return response.data;
};

export default function DriverProfile() {
  const router = useRouter();
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["driverProfile"],
    queryFn: fetchDriverProfile,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const routeName = data?.routeName || "Not assigned";
  const busNumber = data?.busNumber || "N/A";
  const licence = {
    number: data?.licenceNumber || "Not available",
    startDate: data?.licenceStartDate || "N/A",
    endDate: data?.licenceEndDate || "N/A",
  };
  const fullName = data?.driverName || user?.name || "Driver";
  const email = data?.email || user?.username || "driver@school.com";
  const phone = data?.phone || "+91 98765 43210";
  const experience = data?.experience || "8 years";
  const status = data?.status || "Active";
  const emergencyContact = data?.emergencyContact || "+91 99887 76655";

  // Animations for native only
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const card4Anim = useRef(new Animated.Value(0)).current;
  const card5Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading && !error && !isWeb) {
      const cards = [card1Anim, card2Anim, card3Anim, card4Anim, card5Anim];
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
        ...cards.map((anim, i) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 480,
            delay: 80 + i * 70,
            useNativeDriver: true,
          })
        ),
      ]).start();
    }
  }, [isLoading, error]);

  if (isLoading) {
    if (isWeb) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0065ea]"></div>
        </div>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4ff" }}>
        <ActivityIndicator size="large" color="#0065ea" />
      </SafeAreaView>
    );
  }

  if (error) {
    const retryBtn = (
      <button onClick={() => refetch()} className="bg-[#0065ea] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#0054c4] transition">
        Retry
      </button>
    );
    if (isWeb) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="bg-red-50 text-red-600 text-center mb-4 p-4 rounded-xl">Failed to load profile</div>
          {retryBtn}
        </div>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4ff", padding: 16 }}>
        <RNText style={{ color: "#ef4444", textAlign: "center", marginBottom: 16 }}>Failed to load profile</RNText>
        <RNTouchableOpacity onPress={() => refetch()} style={{ backgroundColor: "#0065ea", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
          <RNText style={{ color: "#fff", fontWeight: "600" }}>Retry</RNText>
        </RNTouchableOpacity>
      </SafeAreaView>
    );
  }

  // -------------------------------
  // WEB VERSION - UNCHANGED
  // -------------------------------
  if (isWeb) {
    return (
      <>
        <StatusBar style="dark" />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 overflow-y-auto">
          {/* Sticky header */}
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105">
                <ArrowLeft size={24} color="#0065ea" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#0065ea] to-[#0099ff] bg-clip-text text-transparent">Driver Profile</h1>
              <div className="w-10" />
            </div>
          </div>

          {/* Main content – Bento Grid layout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#0065ea]/80 to-[#0099ff]/80 rounded-3xl shadow-xl p-8 mb-8 text-white">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-white/20 p-1">
                      <img
                        src="https://t4.ftcdn.net/jpg/11/43/02/25/360_F_1143022554_TgKNFmJ0SvaPlofl4AIjNiqF3n7XV1oy.jpg"
                        alt="Driver Profile"
                        className="w-full h-full rounded-full object-cover shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-xs font-semibold text-white/90">ID: {data?.driverId || "ACS-DRV-002"}</p>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold mb-2">{fullName}</h1>
                  <p className="text-blue-100 text-lg mb-4">⭐ Professional Driver | 5.0 Rating</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">✓ Verified Driver</span>
                    <span className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">✓ Insurance Active</span>
                    <span className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">✓ Background Checked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Grid - 4 cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-400/80 to-blue-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Bus size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2"><TrendingUp size={16} /></div>
                </div>
                <p className="text-blue-50 text-sm mb-1">Bus Number</p>
                <p className="text-2xl font-bold">{busNumber}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-400/80 to-purple-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <MapPin size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2"><Star size={16} /></div>
                </div>
                <p className="text-purple-50 text-sm mb-1">Assigned Route</p>
                <p className="text-2xl font-bold truncate">{routeName}</p>
              </div>
              <div className="bg-gradient-to-br from-green-400/80 to-green-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Award size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2"><Calendar size={16} /></div>
                </div>
                <p className="text-green-50 text-sm mb-1">Experience</p>
                <p className="text-2xl font-bold">{experience}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-400/80 to-orange-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Clock size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2"><Shield size={16} /></div>
                </div>
                <p className="text-orange-50 text-sm mb-1">Status</p>
                <p className="text-2xl font-bold">{status}</p>
              </div>
            </div>

            {/* License & Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-purple-400/80 to-pink-400/80 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2"><CreditCard size={24} color="white" /></div>
                    <h2 className="text-xl font-semibold text-white">License Details</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <p className="text-sm text-gray-500 mb-1">License Number</p>
                    <p className="font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{licence.number}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-green-600 mb-1">Valid From</p>
                      <p className="font-semibold text-gray-800">{licence.startDate}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm text-red-600 mb-1">Valid Until</p>
                      <p className="font-semibold text-gray-800">{licence.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-teal-400/80 to-cyan-400/80 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2"><Mail size={24} color="white" /></div>
                    <h2 className="text-xl font-semibold text-white">Contact Information</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="bg-blue-100 rounded-full p-2"><Mail size={18} color="#0065ea" /></div>
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-800">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="bg-green-100 rounded-full p-2"><Phone size={18} color="#0065ea" /></div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-800">{phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-red-50 rounded-lg p-3">
                    <div className="bg-red-100 rounded-full p-2"><Phone size={18} color="#dc2626" /></div>
                    <div>
                      <p className="text-xs text-red-600">Emergency Contact</p>
                      <p className="font-medium text-gray-800">{emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 justify-center pb-12">
              <button className="bg-gradient-to-r from-[#0065ea]/80 to-[#0099ff]/80 hover:from-[#0054c4]/80 hover:to-[#0088ee]/80 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:scale-105">
                ✏️ Edit Profile
              </button>
              <button className="bg-gradient-to-r from-gray-500/80 to-gray-600/80 hover:from-gray-600/80 hover:to-gray-700/80 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:scale-105">
                🔒 Change Password
              </button>
              <button className="bg-gradient-to-r from-emerald-400/80 to-teal-500/80 hover:from-emerald-500/80 hover:to-teal-600/80 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:scale-105">
                📊 View Statistics
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // -------------------------------
  // NATIVE VERSION (Android/iOS) — WARM LIGHT BENTO REDESIGN
  // -------------------------------

  const BentoCard = ({ anim, children, style = {} }) => (
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

  return (
    // Warm soft background: light blue-gray tint, not white, not dark
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2fb" }} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* ── HEADER ── */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          paddingHorizontal: 18, paddingTop: 6, paddingBottom: 12,
          backgroundColor: "#eef2fb",
        }}
      >
        <RNTouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40, height: 40, borderRadius: 14,
            backgroundColor: "#fff",
            justifyContent: "center", alignItems: "center",
            shadowColor: "#0065ea", shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
          }}
        >
          <ArrowLeft size={20} color="#0065ea" />
        </RNTouchableOpacity>
        <RNText style={{ fontSize: 17, fontWeight: "700", color: "#1e293b", letterSpacing: 0.2 }}>Driver Profile</RNText>
        <RNView style={{ width: 40 }} />
      </Animated.View>

      <RNScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36, paddingHorizontal: 14 }}>

        {/* ── BENTO 1: PROFILE HERO CARD ── */}
        <BentoCard anim={card1Anim} style={{ marginBottom: 12 }}>
          <RNView style={{
            borderRadius: 28, overflow: "hidden",
            shadowColor: "#0065ea", shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18, shadowRadius: 16, elevation: 6,
          }}>
            {/* Top gradient strip */}
            <RNView style={{
              backgroundColor: "#0065ea",
              paddingTop: 28, paddingBottom: 36,
              alignItems: "center",
            }}>
              {/* Decorative circles */}
              <RNView style={{
                position: "absolute", top: -30, right: -30,
                width: 120, height: 120, borderRadius: 60,
                backgroundColor: "rgba(255,255,255,0.07)",
              }} />
              <RNView style={{
                position: "absolute", top: 10, left: -20,
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: "rgba(255,255,255,0.06)",
              }} />

              {/* Avatar */}
              <RNView style={{
                width: 96, height: 96, borderRadius: 48,
                borderWidth: 3, borderColor: "rgba(255,255,255,0.4)",
                shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
                overflow: "hidden",
              }}>
                <Image
                  source={{ uri: "https://t4.ftcdn.net/jpg/11/43/02/25/360_F_1143022554_TgKNFmJ0SvaPlofl4AIjNiqF3n7XV1oy.jpg" }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </RNView>

              <RNText style={{ color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 12, letterSpacing: 0.3 }}>{fullName}</RNText>

              {/* Stars */}
              <RNView style={{ flexDirection: "row", alignItems: "center", marginTop: 4, gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={13} fill="#fbbf24" color="#fbbf24" />
                ))}
                <RNText style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginLeft: 5 }}>5.0 · 120 reviews</RNText>
              </RNView>

              {/* Badges */}
              <RNView style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                <RNView style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
                  borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
                }}>
                  <RNText style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>✓ Verified</RNText>
                </RNView>
                <RNView style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
                  borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
                }}>
                  <RNText style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>ID: {data?.driverId || "ACS-DRV-002"}</RNText>
                </RNView>
              </RNView>
            </RNView>

            {/* Stats strip — white with soft shadow lift */}
            <RNView style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              paddingVertical: 16,
            }}>
              {[
                { label: "Years Exp.", value: experience.split(' ')[0], color: "#0065ea" },
                { label: "Status", value: status, color: "#10b981" },
                { label: "Bus No.", value: busNumber, color: "#7c3aed" },
              ].map((stat, idx) => (
                <RNView key={idx} style={{
                  flex: 1, alignItems: "center",
                  borderRightWidth: idx < 2 ? 1 : 0,
                  borderRightColor: "#f1f5f9",
                }}>
                  <RNText style={{ fontSize: 20, fontWeight: "800", color: stat.color }}>{stat.value}</RNText>
                  <RNText style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 2, fontWeight: "500" }}>{stat.label}</RNText>
                </RNView>
              ))}
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── BENTO 2: STAT TILES ROW (bus + route) ── */}
        <BentoCard anim={card2Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          {/* Bus Number */}
          <RNView style={{
            flex: 1, borderRadius: 22, padding: 16,
            backgroundColor: "#eff6ff",
            borderWidth: 1.5, borderColor: "#bfdbfe",
          }}>
            <RNView style={{
              width: 38, height: 38, borderRadius: 13,
              backgroundColor: "#dbeafe",
              justifyContent: "center", alignItems: "center", marginBottom: 10,
            }}>
              <Bus size={20} color="#2563eb" />
            </RNView>
            <RNText style={{ color: "#64748b", fontSize: 11, fontWeight: "500", marginBottom: 2 }}>Bus Number</RNText>
            <RNText style={{ color: "#1e40af", fontSize: 22, fontWeight: "800" }}>{busNumber}</RNText>
          </RNView>

          {/* Route */}
          <RNView style={{
            flex: 1, borderRadius: 22, padding: 16,
            backgroundColor: "#faf5ff",
            borderWidth: 1.5, borderColor: "#e9d5ff",
          }}>
            <RNView style={{
              width: 38, height: 38, borderRadius: 13,
              backgroundColor: "#ede9fe",
              justifyContent: "center", alignItems: "center", marginBottom: 10,
            }}>
              <MapPin size={20} color="#7c3aed" />
            </RNView>
            <RNText style={{ color: "#64748b", fontSize: 11, fontWeight: "500", marginBottom: 2 }}>Route</RNText>
            <RNText style={{ color: "#6d28d9", fontSize: 15, fontWeight: "800" }} numberOfLines={2}>{routeName}</RNText>
          </RNView>
        </BentoCard>

        {/* ── BENTO 3: EXP + STATUS ROW ── */}
        <BentoCard anim={card3Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          {/* Experience */}
          <RNView style={{
            flex: 1, borderRadius: 22, padding: 16,
            backgroundColor: "#f0fdf4",
            borderWidth: 1.5, borderColor: "#bbf7d0",
          }}>
            <RNView style={{
              width: 38, height: 38, borderRadius: 13,
              backgroundColor: "#dcfce7",
              justifyContent: "center", alignItems: "center", marginBottom: 10,
            }}>
              <Award size={20} color="#16a34a" />
            </RNView>
            <RNText style={{ color: "#64748b", fontSize: 11, fontWeight: "500", marginBottom: 2 }}>Experience</RNText>
            <RNText style={{ color: "#15803d", fontSize: 22, fontWeight: "800" }}>{experience}</RNText>
          </RNView>

          {/* Status */}
          <RNView style={{
            flex: 1, borderRadius: 22, padding: 16,
            backgroundColor: "#fff7ed",
            borderWidth: 1.5, borderColor: "#fed7aa",
          }}>
            <RNView style={{
              width: 38, height: 38, borderRadius: 13,
              backgroundColor: "#ffedd5",
              justifyContent: "center", alignItems: "center", marginBottom: 10,
            }}>
              <Shield size={20} color="#ea580c" />
            </RNView>
            <RNText style={{ color: "#64748b", fontSize: 11, fontWeight: "500", marginBottom: 2 }}>Status</RNText>
            <RNView style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <RNView style={{
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: status === "Active" ? "#22c55e" : "#f59e0b",
                shadowColor: status === "Active" ? "#22c55e" : "#f59e0b",
                shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 4,
              }} />
              <RNText style={{ color: "#c2410c", fontSize: 18, fontWeight: "800" }}>{status}</RNText>
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── BENTO 4: LICENSE CARD ── */}
        <BentoCard anim={card4Anim} style={{ marginBottom: 12 }}>
          <RNView style={{
            borderRadius: 22, overflow: "hidden",
            backgroundColor: "#fff",
            shadowColor: "#7c3aed", shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
            borderWidth: 1, borderColor: "#f3f0ff",
          }}>
            {/* Card header */}
            <RNView style={{
              flexDirection: "row", alignItems: "center", gap: 10,
              paddingHorizontal: 16, paddingVertical: 13,
              backgroundColor: "#faf5ff",
              borderBottomWidth: 1, borderBottomColor: "#ede9fe",
            }}>
              <RNView style={{
                width: 34, height: 34, borderRadius: 11,
                backgroundColor: "#ede9fe", justifyContent: "center", alignItems: "center",
              }}>
                <CreditCard size={17} color="#7c3aed" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#3b0764" }}>License Details</RNText>
            </RNView>

            <RNView style={{ padding: 16 }}>
              {/* License number */}
              <RNView style={{
                backgroundColor: "#f8fafc", borderRadius: 14, padding: 12,
                marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0",
              }}>
                <RNText style={{ fontSize: 10, color: "#94a3b8", fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>
                  License Number
                </RNText>
                <RNText style={{ fontSize: 14, color: "#1e293b", fontFamily: "monospace", fontWeight: "600", letterSpacing: 1.5 }}>
                  {licence.number}
                </RNText>
              </RNView>

              {/* Validity row */}
              <RNView style={{ flexDirection: "row", gap: 10 }}>
                <RNView style={{
                  flex: 1, backgroundColor: "#f0fdf4",
                  borderRadius: 14, padding: 12,
                  borderWidth: 1, borderColor: "#bbf7d0",
                }}>
                  <RNText style={{ fontSize: 10, color: "#16a34a", fontWeight: "600", letterSpacing: 0.6, marginBottom: 4 }}>VALID FROM</RNText>
                  <RNText style={{ fontSize: 13, color: "#166534", fontWeight: "700" }}>{licence.startDate}</RNText>
                </RNView>
                <RNView style={{
                  flex: 1, backgroundColor: "#fff1f2",
                  borderRadius: 14, padding: 12,
                  borderWidth: 1, borderColor: "#fecdd3",
                }}>
                  <RNText style={{ fontSize: 10, color: "#dc2626", fontWeight: "600", letterSpacing: 0.6, marginBottom: 4 }}>VALID UNTIL</RNText>
                  <RNText style={{ fontSize: 13, color: "#991b1b", fontWeight: "700" }}>{licence.endDate}</RNText>
                </RNView>
              </RNView>
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── BENTO 5: CONTACT CARD ── */}
        <BentoCard anim={card5Anim} style={{ marginBottom: 14 }}>
          <RNView style={{
            borderRadius: 22, overflow: "hidden",
            backgroundColor: "#fff",
            shadowColor: "#0d9488", shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
            borderWidth: 1, borderColor: "#f0fdfa",
          }}>
            {/* Card header */}
            <RNView style={{
              flexDirection: "row", alignItems: "center", gap: 10,
              paddingHorizontal: 16, paddingVertical: 13,
              backgroundColor: "#f0fdfa",
              borderBottomWidth: 1, borderBottomColor: "#ccfbf1",
            }}>
              <RNView style={{
                width: 34, height: 34, borderRadius: 11,
                backgroundColor: "#ccfbf1", justifyContent: "center", alignItems: "center",
              }}>
                <Phone size={17} color="#0d9488" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#134e4a" }}>Contact Information</RNText>
            </RNView>

            <RNView style={{ padding: 14, gap: 8 }}>
              {/* Email */}
              <RNView style={{
                flexDirection: "row", alignItems: "center", gap: 12,
                backgroundColor: "#eff6ff", borderRadius: 16, padding: 12,
                borderWidth: 1, borderColor: "#dbeafe",
              }}>
                <RNView style={{
                  width: 36, height: 36, borderRadius: 12,
                  backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center",
                }}>
                  <Mail size={17} color="#2563eb" />
                </RNView>
                <RNView style={{ flex: 1 }}>
                  <RNText style={{ fontSize: 10, color: "#64748b", fontWeight: "600", letterSpacing: 0.5 }}>EMAIL</RNText>
                  <RNText style={{ fontSize: 13, color: "#1e3a8a", fontWeight: "600", marginTop: 1 }} numberOfLines={1}>{email}</RNText>
                </RNView>
              </RNView>

              {/* Phone */}
              <RNView style={{
                flexDirection: "row", alignItems: "center", gap: 12,
                backgroundColor: "#f0fdf4", borderRadius: 16, padding: 12,
                borderWidth: 1, borderColor: "#bbf7d0",
              }}>
                <RNView style={{
                  width: 36, height: 36, borderRadius: 12,
                  backgroundColor: "#dcfce7", justifyContent: "center", alignItems: "center",
                }}>
                  <Phone size={17} color="#16a34a" />
                </RNView>
                <RNView style={{ flex: 1 }}>
                  <RNText style={{ fontSize: 10, color: "#64748b", fontWeight: "600", letterSpacing: 0.5 }}>PHONE</RNText>
                  <RNText style={{ fontSize: 13, color: "#14532d", fontWeight: "600", marginTop: 1 }}>{phone}</RNText>
                </RNView>
              </RNView>

              {/* Emergency */}
              <RNView style={{
                flexDirection: "row", alignItems: "center", gap: 12,
                backgroundColor: "#fff1f2", borderRadius: 16, padding: 12,
                borderWidth: 1, borderColor: "#fecdd3",
              }}>
                <RNView style={{
                  width: 36, height: 36, borderRadius: 12,
                  backgroundColor: "#fee2e2", justifyContent: "center", alignItems: "center",
                }}>
                  <Phone size={17} color="#dc2626" />
                </RNView>
                <RNView style={{ flex: 1 }}>
                  <RNText style={{ fontSize: 10, color: "#dc2626", fontWeight: "600", letterSpacing: 0.5 }}>EMERGENCY</RNText>
                  <RNText style={{ fontSize: 13, color: "#7f1d1d", fontWeight: "600", marginTop: 1 }}>{emergencyContact}</RNText>
                </RNView>
              </RNView>
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── ACTION BUTTONS ── */}
        <Animated.View style={{ opacity: fadeAnim, flexDirection: "row", gap: 10 }}>
          <RNTouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 2,
              backgroundColor: "#0065ea",
              borderRadius: 18, paddingVertical: 15,
              alignItems: "center", justifyContent: "center",
              flexDirection: "row", gap: 8,
              shadowColor: "#0065ea", shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
            }}
          >
            <RNText style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>✏️  Edit Profile</RNText>
          </RNTouchableOpacity>
          <RNTouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              backgroundColor: "#f1f5f9",
              borderRadius: 18, paddingVertical: 15,
              alignItems: "center", justifyContent: "center",
              borderWidth: 1.5, borderColor: "#e2e8f0",
            }}
          >
            <RNText style={{ color: "#475569", fontWeight: "700", fontSize: 13 }}>🔒 Password</RNText>
          </RNTouchableOpacity>
        </Animated.View>

      </RNScrollView>
    </SafeAreaView>
  );
}