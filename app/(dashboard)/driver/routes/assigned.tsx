import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertCircle, ArrowLeft, Bus, Calendar, CheckCircle, Clock, MapPin, Navigation, TrendingUp } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  Text as RNText,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { rootApi } from "../../../utils/axiosInstance";

const isWeb = Platform.OS === "web";

interface TransportRoute {
  routeId: string;
  routeName: string;
  pickupStartTime: string;
  dropStartTime: string;
  vehicleName: string;
  vehicleNumber: string;
}

const fetchAssignedRoutes = async (): Promise<TransportRoute[]> => {
  const response = await rootApi.get<TransportRoute[]>("/api/student/transport/driver/my-routes");
  return response.data || [];
};

export default function AssignedRoutesList() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const { data: routes, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["driverAssignedRoutes"],
    queryFn: fetchAssignedRoutes,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const totalRoutes = routes?.length || 0;
  const activeRoutes = routes?.filter(r => r.routeName).length || 0;
  const totalVehicles = routes?.length || 0;
  const completionRate = totalRoutes > 0 ? Math.round((activeRoutes / totalRoutes) * 100) : 0;

  const sortedRoutes = routes ? [...routes].sort((a, b) => {
    const timeA = a.pickupStartTime.split(':').map(Number);
    const timeB = b.pickupStartTime.split(':').map(Number);
    return timeA[0] - timeB[0] || timeA[1] - timeB[1];
  }) : [];

  // ============================================================
  // WEB VERSION - ENHANCED TIMELINE GRID WITH SCROLLING
  // ============================================================
  if (isWeb) {
    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="animate-spin rounded-full h-14 w-14 border-b-3 border-[#0065ea] mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading your routes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          <div className="bg-red-50 rounded-2xl p-6 text-center max-w-md">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-3" />
            <div className="text-red-600 text-center mb-3 font-medium">Failed to load routes</div>
            <p className="text-gray-500 text-sm mb-4">Please check your connection and try again</p>
            <button onClick={() => refetch()} className="bg-red-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-red-600 transition">Try Again</button>
          </div>
        </div>
      );
    }

    if (!routes || routes.length === 0) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Bus size={48} className="text-gray-300" />
            </div>
            <div className="text-gray-700 text-center mb-3 text-xl font-semibold">No Routes Assigned</div>
            <p className="text-gray-400 text-sm mb-6">You don't have any routes assigned yet. Please contact your administrator.</p>
            <button onClick={() => refetch()} className="bg-[#0065ea] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#0054c4] transition">Refresh</button>
          </div>
        </div>
      );
    }

    return (
      <>
        <StatusBar style="dark" />
        {/* Main scrollable container */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto">
          {/* Sticky Header with Glassmorphism */}
          <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button 
                onClick={() => router.back()} 
                className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft size={24} color="#0065ea" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#0065ea] to-[#0099ff] bg-clip-text text-transparent">
                  My Routes
                </h1>
              </div>
              <div className="w-10" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            
            {/* Enhanced Stats Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="group bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Routes</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{totalRoutes}</p>
                    <p className="text-xs text-green-600 mt-2">+{activeRoutes} active</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin size={22} color="#3b82f6" />
                  </div>
                </div>
              </div>
              
              <div className="group bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Active Routes</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{activeRoutes}</p>
                    <p className="text-xs text-gray-500 mt-2">{completionRate}% of total</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle size={22} color="#10b981" />
                  </div>
                </div>
              </div>
              
              <div className="group bg-white rounded-xl p-5 shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Vehicles</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{totalVehicles}</p>
                    <p className="text-xs text-gray-500 mt-2">Deployed</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bus size={22} color="#8b5cf6" />
                  </div>
                </div>
              </div>
              
              <div className="group bg-white rounded-xl p-5 shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Today's Trips</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{totalRoutes}</p>
                    <p className="text-xs text-orange-600 mt-2">Scheduled</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar size={22} color="#f97316" />
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Progress Bar */}
            <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} color="#0065ea" />
                  <span className="text-sm font-semibold text-gray-700">Route Completion Rate</span>
                </div>
                <span className="text-sm font-bold text-[#0065ea]">{completionRate}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0065ea] to-[#0099ff] rounded-full transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{activeRoutes} out of {totalRoutes} routes currently active</p>
            </div>

            {/* Timeline Header with Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-[#0065ea] to-[#0099ff] rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">Route Timeline</h2>
                <div className="bg-[#0065ea]/10 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-[#0065ea]">{sortedRoutes.length} Routes</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Clock size={12} />
                <span>Chronological Order by Pickup Time</span>
              </div>
            </div>

            {/* Enhanced Timeline Grid */}
            <div className="relative pb-8">
              {/* Vertical Timeline Line - Animated */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0065ea] via-purple-400 to-orange-400 hidden md:block"></div>
              
              {sortedRoutes.map((route, index) => (
                <div 
                  key={route.routeId} 
                  className="relative flex flex-col md:flex-row gap-5 mb-8 group"
                  onMouseEnter={() => setHoveredCard(route.routeId)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Enhanced Timeline Dot with Animation */}
                  <div className="hidden md:flex absolute left-6 w-5 h-5 bg-white border-2 border-[#0065ea] rounded-full z-10 group-hover:scale-125 transition-transform duration-300">
                    <div className="absolute inset-0 rounded-full bg-[#0065ea]/30 animate-ping"></div>
                  </div>
                  
                  {/* Time Card - Enhanced */}
                  <div className="md:w-48 flex-shrink-0">
                    <div className="bg-gradient-to-br from-[#0065ea] to-[#0099ff] rounded-xl p-4 text-white text-center shadow-md transform transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <Clock size={18} />
                      </div>
                      <p className="text-xs opacity-90 uppercase tracking-wide">Pickup Time</p>
                      <p className="text-2xl font-bold mt-1">{route.pickupStartTime}</p>
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <p className="text-xs opacity-75">Drop → {route.dropStartTime}</p>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-[#0065ea]">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Card - Enhanced with Hover Effects */}
                  <div 
                    className={`flex-1 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                      hoveredCard === route.routeId ? 'shadow-xl -translate-y-1' : ''
                    }`}
                  >
                    <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#0065ea]/10 rounded-full flex items-center justify-center">
                            <Bus size={16} color="#0065ea" />
                          </div>
                          <h3 className="font-bold text-gray-800 text-lg">{route.routeName}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                            Active
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clock size={14} color="#0065ea" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Pickup Start</p>
                            <p className="font-semibold text-gray-800 text-sm">{route.pickupStartTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Clock size={14} color="#ff4b00" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Drop Start</p>
                            <p className="font-semibold text-gray-800 text-sm">{route.dropStartTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Bus size={14} color="#10b981" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Vehicle Number</p>
                            <p className="font-semibold text-gray-800 text-sm">{route.vehicleNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <MapPin size={14} color="#8b5cf6" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Vehicle Name</p>
                            <p className="font-semibold text-gray-800 text-sm">{route.vehicleName}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <p className="text-xs text-gray-400 font-mono">Route ID: {route.routeId}</p>
                        </div>
                        <button className="text-xs text-[#0065ea] hover:text-[#0054c4] font-medium hover:underline transition flex items-center gap-1">
                          View Details 
                          <span className="text-lg">&rarr;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sticky bottom-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
              <button 
                onClick={() => router.push("/(dashboard)/driver/tracking/gps")} 
                className="flex-1 bg-gradient-to-r from-[#0065ea] to-[#0099ff] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <Navigation size={18} />
                <span>Start Live Tracking</span>
              </button>
              <button 
                onClick={onRefresh} 
                disabled={isRefetching}
                className="px-6 py-3.5 bg-white text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRefetching ? "Syncing..." : "Sync Routes"}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center pb-6">
              <p className="text-xs text-gray-400">© 2026 Transport Management System | Routes Timeline</p>
              <p className="text-xs text-gray-300 mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ============================================================
  // NATIVE VERSION (Android/iOS)
  // ============================================================
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (routes && routes.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [routes]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0065ea" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100 p-4">
        <RNText className="text-red-500 text-center mb-4">Failed to load routes</RNText>
        <RNTouchableOpacity onPress={() => refetch()} className="bg-[#0065ea] px-5 py-2 rounded-lg">
          <RNText className="text-white font-semibold">Retry</RNText>
        </RNTouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!routes || routes.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100 p-4">
        <RNText className="text-gray-600 text-center mb-4">No routes assigned to you.</RNText>
        <RNTouchableOpacity onPress={() => refetch()} className="bg-[#0065ea] px-5 py-2 rounded-lg">
          <RNText className="text-white font-semibold">Refresh</RNText>
        </RNTouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderRouteCard = ({ item: route }: { item: TransportRoute }) => (
    <RNView className="bg-white mx-4 mb-4 rounded-2xl shadow-md overflow-hidden">
      <LinearGradient colors={["#0065ea", "#0099ff"]} className="p-4">
        <RNView className="flex-row items-center">
          <Bus size={24} color="#fff" />
          <RNText className="text-white font-bold text-lg ml-3 flex-1">{route.routeName}</RNText>
        </RNView>
      </LinearGradient>
      <RNView className="p-4">
        <RNView className="flex-row justify-between items-center py-2">
          <RNView className="flex-row items-center gap-2"><Clock size={16} color="#0065ea" /><RNText className="text-sm font-medium text-gray-700">Pickup Start</RNText></RNView>
          <RNText className="text-gray-900 font-semibold">{route.pickupStartTime}</RNText>
        </RNView>
        <RNView className="flex-row justify-between items-center py-2">
          <RNView className="flex-row items-center gap-2"><Clock size={16} color="#0065ea" /><RNText className="text-sm font-medium text-gray-700">Drop Start</RNText></RNView>
          <RNText className="text-gray-900 font-semibold">{route.dropStartTime}</RNText>
        </RNView>
        <RNView className="flex-row justify-between items-center py-2">
          <RNView className="flex-row items-center gap-2"><Bus size={16} color="#0065ea" /><RNText className="text-sm font-medium text-gray-700">Vehicle</RNText></RNView>
          <RNText className="text-gray-900 font-semibold">{route.vehicleNumber} ({route.vehicleName})</RNText>
        </RNView>
        <RNView className="flex-row justify-between items-center pt-2">
          <RNView className="flex-row items-center gap-2"><MapPin size={16} color="#0065ea" /><RNText className="text-sm font-medium text-gray-700">Route ID</RNText></RNView>
          <RNText className="text-gray-900 font-semibold">{route.routeId}</RNText>
        </RNView>
      </RNView>
    </RNView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <LinearGradient colors={["#f9fafb", "#f9fafb"]} className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
        <RNTouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#0065ea" /></RNTouchableOpacity>
        <RNText className="text-xl font-bold text-[#0065ea]">My Routes</RNText>
        <RNView className="w-10" />
      </LinearGradient>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <FlatList data={routes} keyExtractor={(item) => item.routeId} renderItem={renderRouteCard} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16 }} refreshing={isRefetching || refreshing} onRefresh={onRefresh} />
      </Animated.View>
      <RNTouchableOpacity className="mx-4 rounded-3xl overflow-hidden shadow-md mb-6 mt-2" onPress={() => router.push("/(dashboard)/driver/tracking/gps")}>
        <LinearGradient colors={["#0065ea", "#0099ff"]} className="flex-row items-center justify-center py-4 gap-3">
          <Navigation size={20} color="white" />
          <RNText className="text-white font-bold text-base">Start Live Tracking</RNText>
        </LinearGradient>
      </RNTouchableOpacity>
    </SafeAreaView>
  );
}