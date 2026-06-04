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
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (!isLoading && !error && !isWeb) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.spring(cardScale, { toValue: 1, friction: 8, useNativeDriver: true }),
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
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
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
      <SafeAreaView className="flex-1 justify-center items-center bg-white p-4">
        <RNText className="text-red-500 text-center mb-4">Failed to load profile</RNText>
        <RNTouchableOpacity onPress={() => refetch()} className="bg-[#0065ea] px-5 py-2 rounded-lg">
          <RNText className="text-white font-semibold">Retry</RNText>
        </RNTouchableOpacity>
      </SafeAreaView>
    );
  }

  // -------------------------------
  // WEB VERSION - BENTO GRID + COLORFUL UI (80% intensity)
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
            
            {/* Hero Section - Profile Header (Large bento card) */}
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
                  {/* Driver ID moved BELOW the DP circle */}
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

            {/* Bento Grid - 4 cards row (80% intensity colors) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Bus Card - Blue with 80% intensity */}
              <div className="bg-gradient-to-br from-blue-400/80 to-blue-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Bus size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <p className="text-blue-50 text-sm mb-1">Bus Number</p>
                <p className="text-2xl font-bold">{busNumber}</p>
              </div>

              {/* Route Card - Purple with 80% intensity */}
              <div className="bg-gradient-to-br from-purple-400/80 to-purple-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <MapPin size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <Star size={16} />
                  </div>
                </div>
                <p className="text-purple-50 text-sm mb-1">Assigned Route</p>
                <p className="text-2xl font-bold truncate">{routeName}</p>
              </div>

              {/* Experience Card - Green with 80% intensity */}
              <div className="bg-gradient-to-br from-green-400/80 to-green-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Award size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <Calendar size={16} />
                  </div>
                </div>
                <p className="text-green-50 text-sm mb-1">Experience</p>
                <p className="text-2xl font-bold">{experience}</p>
              </div>

              {/* Status Card - Orange with 80% intensity */}
              <div className="bg-gradient-to-br from-orange-400/80 to-orange-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Clock size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <Shield size={16} />
                  </div>
                </div>
                <p className="text-orange-50 text-sm mb-1">Status</p>
                <p className="text-2xl font-bold">{status}</p>
              </div>
            </div>

            {/* License & Contact Details - 2 column bento layout (80% intensity headers) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* License Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-purple-400/80 to-pink-400/80 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <CreditCard size={24} color="white" />
                    </div>
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

              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-teal-400/80 to-cyan-400/80 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <Mail size={24} color="white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Contact Information</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Mail size={18} color="#0065ea" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-800">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <Phone size={18} color="#0065ea" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-800">{phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-red-50 rounded-lg p-3">
                    <div className="bg-red-100 rounded-full p-2">
                      <Phone size={18} color="#dc2626" />
                    </div>
                    <div>
                      <p className="text-xs text-red-600">Emergency Contact</p>
                      <p className="font-medium text-gray-800">{emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons (80% intensity) */}
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
  // NATIVE VERSION (Android/iOS) - KEPT SAME
  // -------------------------------
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      {/* Header */}
      <RNView className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-50">
        <RNTouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#0065ea" />
        </RNTouchableOpacity>
        <RNText className="text-lg font-semibold text-[#0065ea]">My Profile</RNText>
        <RNView className="w-10" />
      </RNView>

      <RNScrollView contentContainerClassName="p-5 items-center">
        {/* Avatar */}
        <Animated.View
          className="items-center mb-6"
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Image
            source={{ uri: "https://t4.ftcdn.net/jpg/11/43/02/25/360_F_1143022554_TgKNFmJ0SvaPlofl4AIjNiqF3n7XV1oy.jpg" }}
            className="w-[100px] h-[100px] rounded-full border-2 border-[#0065ea] mb-3"
          />
          <RNText className="text-2xl font-bold text-[#0065ea] mb-1">{fullName}</RNText>
          <RNText className="text-sm text-[#0065ea]">Driver</RNText>
          <RNText className="text-xs text-gray-500 mt-1">ID: {data?.driverId || "ACS-DRV-002"}</RNText>
        </Animated.View>

        {/* Stats cards */}
        <Animated.View
          className="bg-white rounded-2xl p-5 w-full shadow-sm mb-5"
          style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}
        >
          <RNView className="flex-row flex-wrap justify-between">
            <RNView className="w-[48%] mb-4">
              <Bus size={20} color="#0065ea" />
              <RNText className="text-xs text-gray-500 mt-1">Bus Number</RNText>
              <RNText className="font-semibold text-[#0065ea]">{busNumber}</RNText>
            </RNView>
            <RNView className="w-[48%] mb-4">
              <MapPin size={20} color="#0065ea" />
              <RNText className="text-xs text-gray-500 mt-1">Assigned Route</RNText>
              <RNText className="font-semibold text-[#0065ea]">{routeName}</RNText>
            </RNView>
            <RNView className="w-[48%] mb-4">
              <Award size={20} color="#0065ea" />
              <RNText className="text-xs text-gray-500 mt-1">Experience</RNText>
              <RNText className="font-semibold text-[#0065ea]">{experience}</RNText>
            </RNView>
            <RNView className="w-[48%] mb-4">
              <Clock size={20} color="#0065ea" />
              <RNText className="text-xs text-gray-500 mt-1">Status</RNText>
              <RNText className="font-semibold text-green-600">{status}</RNText>
            </RNView>
          </RNView>
        </Animated.View>

        {/* License & Contact Details */}
        <Animated.View
          className="bg-white rounded-2xl p-5 w-full shadow-sm"
          style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}
        >
          <RNView className="mb-6">
            <RNView className="flex-row items-center gap-2 mb-3">
              <CreditCard size={20} color="#0065ea" />
              <RNText className="text-base font-semibold text-[#0065ea]">License Details</RNText>
            </RNView>
            <RNView className="mb-3">
              <RNText className="text-xs text-gray-500">License Number</RNText>
              <RNText className="text-sm font-medium text-gray-800">{licence.number}</RNText>
            </RNView>
            <RNView className="flex-row justify-between">
              <RNView className="flex-1">
                <RNText className="text-xs text-gray-500">Valid From</RNText>
                <RNText className="text-sm font-medium text-gray-800">{licence.startDate}</RNText>
              </RNView>
              <RNView className="flex-1">
                <RNText className="text-xs text-gray-500">Valid Until</RNText>
                <RNText className="text-sm font-medium text-red-600">{licence.endDate}</RNText>
              </RNView>
            </RNView>
          </RNView>

          <RNView className="h-px bg-gray-100 my-3" />

          <RNView>
            <RNView className="flex-row items-center gap-2 mb-3">
              <Mail size={20} color="#0065ea" />
              <RNText className="text-base font-semibold text-[#0065ea]">Contact Information</RNText>
            </RNView>
            <RNView className="mb-3">
              <RNText className="text-xs text-gray-500">Email Address</RNText>
              <RNText className="text-sm font-medium text-gray-800">{email}</RNText>
            </RNView>
            <RNView className="mb-3">
              <RNText className="text-xs text-gray-500">Phone Number</RNText>
              <RNText className="text-sm font-medium text-gray-800">{phone}</RNText>
            </RNView>
            <RNView>
              <RNText className="text-xs text-gray-500">Emergency Contact</RNText>
              <RNText className="text-sm font-medium text-gray-800">{emergencyContact}</RNText>
            </RNView>
          </RNView>
        </Animated.View>
      </RNScrollView>
    </SafeAreaView>
  );
}