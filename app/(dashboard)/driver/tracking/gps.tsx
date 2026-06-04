import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Bell, Clock, Gauge, MapPin, Navigation, Share2, Target, Wifi, WifiOff } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Platform, Switch, Text, TouchableOpacity, View } from "react-native";
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600 }).start();
    return () => { if (isTracking) stopLocationTracking(); };
  }, []);

  const toggleTracking = () => {
    if (!isTracking) {
      Alert.alert("Start Live Tracking", "Parents and admin will see your location", [
        { text: "Cancel", style: "cancel" },
        { text: "Start", onPress: () => {
          setIsTracking(true);
          startLocationTracking((data) => {
            setLocation({ lat: data.lat, lng: data.lng, address: "En route" });
            setSpeed(data.speed);
            setProgress(data.progress);
            setRemainingStops(data.remainingStops);
            setEta(data.eta);
            Animated.sequence([Animated.timing(pulseAnim, { toValue: 1.2, duration: 200 }), Animated.timing(pulseAnim, { toValue: 1, duration: 200 })]).start();
          });
        }}
      ]);
    } else {
      stopLocationTracking();
      setIsTracking(false);
    }
  };

  const shareLocation = () => Alert.alert("Location Shared", "Your current location shared with admin");

  // ------------------------------------------------
  // WEB VERSION - STUNNING BENTO GRID WITH SCROLLING
  // ------------------------------------------------
  if (isWeb) {
    return (
      <>
        <StatusBar style="dark" />
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
          {/* Sticky header with glassmorphism */}
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

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Map/Animation Bento Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="relative h-96 flex items-center justify-center">
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 to-transparent"></div>
                  
                  {/* Animated pulse ring */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#0065ea]/30 animate-ping" style={{ width: 120, height: 120, left: -36, top: -36 }}></div>
                    <div className="relative w-12 h-12 bg-[#0065ea] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Navigation size={24} color="white" />
                    </div>
                  </div>
                  
                  {/* Location info overlay */}
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

              {/* Stats Bento Grid - 3 cards */}
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

              {/* Progress Section Bento Card */}
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

              {/* Tracking Control Bento Card */}
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

              {/* Info Banner */}
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

              {/* Footer */}
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
  // NATIVE VERSION (Android/iOS) - KEPT SAME
  // ------------------------------------------------
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-[#0065ea]">Live GPS Tracking</Text>
        <View className="w-10" />
      </View>
      <Animated.View className="h-[350px] bg-gray-100 mx-4 my-4 rounded-2xl justify-center items-center" style={{ opacity: fadeAnim }}>
        <Animated.View className="items-center" style={{ transform: [{ scale: pulseAnim }] }}>
          <Navigation size={48} color="#0065ea" />
          <Text className="text-base font-semibold mt-3 text-[#0065ea]">Current Location</Text>
          <Text className="text-sm text-gray-500 mt-1">{location.address}</Text>
          <Text className="text-xs text-[#0065ea] mt-1">{location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E</Text>
          <View className="flex-row justify-around w-full mt-4">
            <View className="items-center">
              <Gauge size={20} color="#0065ea" />
              <Text className="text-lg font-bold text-[#0065ea] mt-1">{Math.round(speed)} km/h</Text>
              <Text className="text-xs text-gray-500">Speed</Text>
            </View>
            <View className="items-center">
              <Clock size={20} color="#0065ea" />
              <Text className="text-lg font-bold text-[#0065ea] mt-1">{eta}</Text>
              <Text className="text-xs text-gray-500">ETA</Text>
            </View>
            <View className="items-center">
              <MapPin size={20} color="#0065ea" />
              <Text className="text-lg font-bold text-[#0065ea] mt-1">{remainingStops}</Text>
              <Text className="text-xs text-gray-500">Stops left</Text>
            </View>
          </View>
          <View className="mt-4 w-full px-4">
            <Text className="text-xs text-[#0065ea]">Route Progress</Text>
            <View className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <View className="h-full bg-[#0065ea]" style={{ width: `${progress}%` }} />
            </View>
            <Text className="text-xs text-[#0065ea] mt-0.5 text-right">{Math.round(progress)}%</Text>
          </View>
        </Animated.View>
      </Animated.View>
      <Animated.View className="bg-white mx-4 p-4 rounded-2xl" style={{ opacity: fadeAnim }}>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-3">
            <Bell size={20} color="#0065ea" />
            <Text className="text-base font-medium text-[#0065ea]">Live Tracking</Text>
          </View>
          <Switch value={isTracking} onValueChange={toggleTracking} trackColor={{ false: "#e2e8f0", true: "#0065ea" }} thumbColor={isTracking ? "#fff" : "#ff4b00"} />
        </View>
        {isTracking && (
          <View className="flex-row items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <View className="w-2 h-2 rounded-full bg-[#00a652]" />
            <Text className="text-sm text-gray-500">Your location is being shared with parents</Text>
          </View>
        )}
        <TouchableOpacity className="flex-row items-center justify-center bg-white mt-4 p-3 rounded-xl gap-2" onPress={shareLocation}>
          <Share2 size={20} color="#0065ea" />
          <Text className="text-sm font-medium text-[#0065ea]">Share Current Location</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}