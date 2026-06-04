import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Calendar, DollarSign, Fuel, Gauge, Save, Search, TrendingDown, TrendingUp } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  RefreshControl,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { root1Api } from "../../utils/axiosInstance";

// Platform detection
const isWeb = Platform.OS === "web";

// Types based on Swagger schemas
interface FuelLogRequest {
  litersFilled: number;
  amount: number;
  odometerReading?: number;
}

interface FuelLog {
  fuelLogId: string;
  driverId: string;
  litersFilled: number;
  amount: number;
  odometerReading?: number;
  fuelDate: string;
}

// API functions – unchanged
const addFuelLogApi = async (data: FuelLogRequest) => {
  const response = await root1Api.post("/api/student/transport/addfuel", data);
  return response.data as FuelLog;
};

const fetchAllFuelLogs = async () => {
  const response = await root1Api.get("/api/student/transport/getALl");
  return response.data as FuelLog[];
};

const fetchFuelLogsByDate = async (date: string) => {
  const response = await root1Api.get(`/api/student/transport/date?date=${date}`);
  return response.data as FuelLog[];
};

const fetchFuelLogsByMonth = async (year: number, month: number) => {
  const response = await root1Api.get(`/api/student/transport/month?year=${year}&month=${month}`);
  return response.data as FuelLog[];
};

export default function FuelTracking() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form state
  const [liters, setLiters] = useState("");
  const [amount, setAmount] = useState("");
  const [odometer, setOdometer] = useState("");
  const [filterType, setFilterType] = useState<"all" | "date" | "month">("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Query
  const { data: fuelLogs, isLoading, error, refetch } = useQuery({
    queryKey: ["fuelLogs", filterType, filterDate, filterYear, filterMonth],
    queryFn: async () => {
      if (filterType === "date" && filterDate) {
        return fetchFuelLogsByDate(filterDate);
      } else if (filterType === "month" && filterYear && filterMonth) {
        return fetchFuelLogsByMonth(parseInt(filterYear), parseInt(filterMonth));
      } else {
        return fetchAllFuelLogs();
      }
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });

  // Calculate statistics with proper null/undefined checks
  const totalLiters = Array.isArray(fuelLogs) ? fuelLogs.reduce((sum, log) => sum + log.litersFilled, 0) : 0;
  const totalAmount = Array.isArray(fuelLogs) ? fuelLogs.reduce((sum, log) => sum + log.amount, 0) : 0;
  const averagePrice = totalLiters > 0 ? (totalAmount / totalLiters).toFixed(2) : "0";
  const totalEntries = Array.isArray(fuelLogs) ? fuelLogs.length : 0;

  // Mutation
  const { mutate: addFuel, isPending } = useMutation({
    mutationFn: addFuelLogApi,
    onSuccess: () => {
      Alert.alert("Success", "Fuel log added successfully");
      setLiters("");
      setAmount("");
      setOdometer("");
      queryClient.invalidateQueries({ queryKey: ["fuelLogs"] });
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to add fuel log");
    },
  });

  const handleSave = () => {
    if (!liters || !amount) {
      Alert.alert("Error", "Please enter liters and amount");
      return;
    }
    addFuel({
      litersFilled: parseFloat(liters),
      amount: parseFloat(amount),
      odometerReading: odometer ? parseFloat(odometer) : undefined,
    });
  };

  const applyDateFilter = () => {
    if (!filterDate) {
      Alert.alert("Error", "Please enter a date (YYYY-MM-DD)");
      return;
    }
    refetch();
  };

  const applyMonthFilter = () => {
    if (!filterYear || !filterMonth) {
      Alert.alert("Error", "Please enter both year and month");
      return;
    }
    refetch();
  };

  const resetFilters = () => {
    setFilterType("all");
    setFilterDate("");
    setFilterYear("");
    setFilterMonth("");
    queryClient.invalidateQueries({ queryKey: ["fuelLogs"] });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Animations for native only
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const card4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading && !error && !isWeb) {
      const cards = [card1Anim, card2Anim, card3Anim, card4Anim];
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ...cards.map((anim, i) =>
          Animated.timing(anim, { toValue: 1, duration: 480, delay: 60 + i * 80, useNativeDriver: true })
        ),
      ]).start();
    }
  }, [isLoading, error]);

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

  // ------------------------------------------------
  // WEB VERSION - UNCHANGED
  // ------------------------------------------------
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
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#0065ea] to-[#0099ff] bg-clip-text text-transparent">Fuel Tracking</h1>
              <div className="w-10" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Bento Grid - 4 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-400/80 to-blue-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Fuel size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <p className="text-blue-50 text-sm mb-1">Total Fuel</p>
                <p className="text-3xl font-bold">{totalLiters.toFixed(1)} L</p>
              </div>

              <div className="bg-gradient-to-br from-green-400/80 to-green-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <TrendingDown size={16} />
                  </div>
                </div>
                <p className="text-green-50 text-sm mb-1">Total Cost</p>
                <p className="text-3xl font-bold">₹{totalAmount.toFixed(0)}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-400/80 to-orange-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <Fuel size={16} />
                  </div>
                </div>
                <p className="text-orange-50 text-sm mb-1">Avg Price/Liter</p>
                <p className="text-3xl font-bold">₹{averagePrice}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-400/80 to-purple-500/80 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Calendar size={32} strokeWidth={1.5} />
                  <div className="bg-white/20 rounded-full p-2">
                    <Fuel size={16} />
                  </div>
                </div>
                <p className="text-purple-50 text-sm mb-1">Total Entries</p>
                <p className="text-3xl font-bold">{totalEntries}</p>
              </div>
            </div>

            {/* Two-column Bento Layout - Form & Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Add Fuel Form - Bento Card */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-[#0065ea]/80 to-[#0099ff]/80 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <Fuel size={24} color="white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Add Fuel Entry</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Liters Filled *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={liters}
                          onChange={(e) => setLiters(e.target.value)}
                          placeholder="e.g., 40.5"
                          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="e.g., 5000"
                          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Odometer Reading (km) - Optional</label>
                        <input
                          type="number"
                          step="1"
                          value={odometer}
                          onChange={(e) => setOdometer(e.target.value)}
                          placeholder="e.g., 12500"
                          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={isPending}
                      className="mt-6 w-full bg-gradient-to-r from-[#0065ea] to-[#0099ff] hover:from-[#0054c4] hover:to-[#0088ee] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                    >
                      {isPending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>Save Fuel Log</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters - Bento Card */}
              <div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-teal-400/80 to-cyan-400/80 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <Search size={24} color="white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Filter Logs</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-5">
                      <button
                        onClick={() => setFilterType("all")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          filterType === "all"
                            ? "bg-[#0065ea] text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        All Records
                      </button>
                      <button
                        onClick={() => setFilterType("date")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          filterType === "date"
                            ? "bg-[#0065ea] text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        By Date
                      </button>
                      <button
                        onClick={() => setFilterType("month")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          filterType === "month"
                            ? "bg-[#0065ea] text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        By Month
                      </button>
                    </div>

                    {filterType === "date" && (
                      <div className="space-y-3">
                        <input
                          type="date"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all"
                        />
                        <button
                          onClick={applyDateFilter}
                          className="w-full bg-gradient-to-r from-[#0065ea] to-[#0099ff] text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                        >
                          <Search size={20} />
                          <span>Apply Date Filter</span>
                        </button>
                      </div>
                    )}

                    {filterType === "month" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            placeholder="Year"
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all"
                          />
                          <input
                            type="number"
                            placeholder="Month (1-12)"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all"
                          />
                        </div>
                        <button
                          onClick={applyMonthFilter}
                          className="w-full bg-gradient-to-r from-[#0065ea] to-[#0099ff] text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                        >
                          <Search size={20} />
                          <span>Apply Month Filter</span>
                        </button>
                      </div>
                    )}

                    {filterType !== "all" && (
                      <button
                        onClick={resetFilters}
                        className="mt-4 text-red-500 text-sm w-full text-center hover:text-red-600 transition-colors"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Fuel Log History Table - Bento Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <Fuel size={24} color="white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Fuel Log History</h2>
                  </div>
                  <div className="bg-white/20 rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">{totalEntries} entries</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liters</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odometer (km)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Liter</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading && !refreshing && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0065ea]"></div>
                          </div>
                          <p className="mt-2 text-gray-500">Loading fuel logs...</p>
                        </td>
                      </tr>
                    )}
                    {error && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="text-red-500">Failed to load logs. Please try again.</div>
                          <button onClick={onRefresh} className="mt-2 text-[#0065ea] hover:underline">
                            Retry
                          </button>
                        </td>
                      </tr>
                    )}
                    {fuelLogs && fuelLogs.length === 0 && !isLoading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No fuel logs found. Add your first fuel entry above!
                        </td>
                      </tr>
                    )}
                    {fuelLogs && fuelLogs.length > 0 &&
                      fuelLogs.map((log) => (
                        <tr key={log.fuelLogId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              {formatDate(log.fuelDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-[#0065ea]">{log.litersFilled} L</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{log.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.odometerReading ? `${log.odometerReading} km` : "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            ₹{(log.amount / log.litersFilled).toFixed(2)}/L
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={onRefresh}
                className="bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
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

      {/* Header with back button - matching Vehicle Reporting style */}
      <Animated.View style={{
        opacity: fadeAnim,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 18, paddingTop: 6, paddingBottom: 12,
        backgroundColor: "#eef2fb",
      }}>
        <RNTouchableOpacity 
          onPress={() => router.back()} 
          style={{
            width: 40, height: 40, borderRadius: 14, backgroundColor: "#fff",
            justifyContent: "center", alignItems: "center",
            shadowColor: "#0065ea", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
          }}
        >
          <ArrowLeft size={20} color="#0065ea" />
        </RNTouchableOpacity>
        <RNText style={{ fontSize: 17, fontWeight: "700", color: "#1e293b", letterSpacing: 0.2 }}>Fuel Tracking</RNText>
        <RNView style={{ width: 40 }} />
      </Animated.View>

      <RNScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 14 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0065ea"]} tintColor="#0065ea" />}
      >

        {/* ── BENTO 1: STATS CARDS ROW ── */}
        <BentoCard anim={card1Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          {[
            { label: "Total Fuel", value: `${totalLiters.toFixed(1)} L`, bg: "#eff6ff", border: "#bfdbfe", valColor: "#1d4ed8", iconBg: "#dbeafe", icon: <Fuel size={20} color="#2563eb" /> },
            { label: "Total Cost", value: `₹${totalAmount.toFixed(0)}`, bg: "#f0fdf4", border: "#bbf7d0", valColor: "#166534", iconBg: "#dcfce7", icon: <DollarSign size={20} color="#16a34a" /> },
            { label: "Avg Price", value: `₹${averagePrice}`, bg: "#fefce8", border: "#fde68a", valColor: "#92400e", iconBg: "#fef9c3", icon: <TrendingUp size={20} color="#ca8a04" /> },
            { label: "Entries", value: `${totalEntries}`, bg: "#f5f3ff", border: "#ddd6fe", valColor: "#5b21b6", iconBg: "#ede9fe", icon: <Calendar size={20} color="#7c3aed" /> },
          ].map((stat, idx) => (
            <RNView key={idx} style={{
              flex: 1, borderRadius: 18, padding: 12, alignItems: "center",
              backgroundColor: stat.bg, borderWidth: 1.5, borderColor: stat.border,
            }}>
              <RNView style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: stat.iconBg, justifyContent: "center", alignItems: "center", marginBottom: 7 }}>
                {stat.icon}
              </RNView>
              <RNText style={{ fontSize: 16, fontWeight: "800", color: stat.valColor }}>{stat.value}</RNText>
              <RNText style={{ fontSize: 10, color: "#64748b", fontWeight: "500", marginTop: 2, textAlign: "center" }}>{stat.label}</RNText>
            </RNView>
          ))}
        </BentoCard>

        {/* ── BENTO 2: ADD FUEL FORM ── */}
        <BentoCard anim={card2Anim} style={{ marginBottom: 12 }}>
          <RNView style={{
            borderRadius: 24, overflow: "hidden", backgroundColor: "#fff",
            shadowColor: "#0065ea", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10, elevation: 3,
            borderWidth: 1, borderColor: "#e0eaff",
          }}>
            {/* Card header */}
            <RNView style={{
              flexDirection: "row", alignItems: "center", gap: 10,
              paddingHorizontal: 16, paddingVertical: 13,
              backgroundColor: "#f0f6ff",
              borderBottomWidth: 1, borderBottomColor: "#dbeafe",
            }}>
              <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center" }}>
                <Fuel size={17} color="#0065ea" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e3a8a" }}>Add Fuel Entry</RNText>
            </RNView>

            <RNView style={{ padding: 16 }}>
              {/* Liters Input */}
              <RNText style={{ fontSize: 12, color: "#475569", fontWeight: "600", marginBottom: 6 }}>Liters Filled *</RNText>
              <RNTextInput
                style={{
                  backgroundColor: "#f8fafc", borderRadius: 14, padding: 14,
                  fontSize: 14, color: "#1e293b",
                  borderWidth: 1.5, borderColor: "#e2e8f0",
                  marginBottom: 14,
                }}
                placeholder="e.g., 40.5"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={liters}
                onChangeText={setLiters}
              />

              {/* Amount Input */}
              <RNText style={{ fontSize: 12, color: "#475569", fontWeight: "600", marginBottom: 6 }}>Amount (₹) *</RNText>
              <RNTextInput
                style={{
                  backgroundColor: "#f8fafc", borderRadius: 14, padding: 14,
                  fontSize: 14, color: "#1e293b",
                  borderWidth: 1.5, borderColor: "#e2e8f0",
                  marginBottom: 14,
                }}
                placeholder="e.g., 5000"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              {/* Odometer Input */}
              <RNText style={{ fontSize: 12, color: "#475569", fontWeight: "600", marginBottom: 6 }}>Odometer (km) - Optional</RNText>
              <RNTextInput
                style={{
                  backgroundColor: "#f8fafc", borderRadius: 14, padding: 14,
                  fontSize: 14, color: "#1e293b",
                  borderWidth: 1.5, borderColor: "#e2e8f0",
                  marginBottom: 16,
                }}
                placeholder="e.g., 12500"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={odometer}
                onChangeText={setOdometer}
              />

              {/* Submit button */}
              <RNTouchableOpacity
                onPress={handleSave}
                disabled={isPending}
                activeOpacity={0.85}
                style={{
                  backgroundColor: "#0065ea", borderRadius: 16, paddingVertical: 14,
                  flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                  shadowColor: "#0065ea", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                {isPending ? <ActivityIndicator color="#fff" size="small" /> : (
                  <>
                    <Save size={18} color="#fff" />
                    <RNText style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Save Log</RNText>
                  </>
                )}
              </RNTouchableOpacity>
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── BENTO 3: FILTERS ── */}
        <BentoCard anim={card3Anim} style={{ marginBottom: 12 }}>
          <RNView style={{
            borderRadius: 24, overflow: "hidden", backgroundColor: "#fff",
            shadowColor: "#7c3aed", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
            borderWidth: 1, borderColor: "#f3f0ff",
          }}>
            <RNView style={{
              flexDirection: "row", alignItems: "center", gap: 10,
              paddingHorizontal: 16, paddingVertical: 13,
              backgroundColor: "#faf5ff",
              borderBottomWidth: 1, borderBottomColor: "#ede9fe",
            }}>
              <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#ede9fe", justifyContent: "center", alignItems: "center" }}>
                <Search size={17} color="#7c3aed" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#3b0764" }}>Filter Logs</RNText>
            </RNView>

            <RNView style={{ padding: 16 }}>
              {/* Filter type pills */}
              <RNView style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                {(["all", "date", "month"] as const).map((f) => (
                  <RNTouchableOpacity
                    key={f}
                    onPress={() => setFilterType(f)}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                      backgroundColor: filterType === f ? "#7c3aed" : "#f5f3ff",
                      borderWidth: 1.5,
                      borderColor: filterType === f ? "#7c3aed" : "#ddd6fe",
                    }}
                  >
                    <RNText style={{ fontSize: 12, fontWeight: "600", color: filterType === f ? "#fff" : "#6d28d9" }}>
                      {f === "all" ? "All" : f === "date" ? "By Date" : "By Month"}
                    </RNText>
                  </RNTouchableOpacity>
                ))}
              </RNView>

              {filterType === "date" && (
                <RNView style={{ gap: 8 }}>
                  <RNTextInput
                    placeholder="YYYY-MM-DD"
                    value={filterDate}
                    onChangeText={setFilterDate}
                    style={{
                      backgroundColor: "#f8fafc", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
                      fontSize: 13, color: "#1e293b", borderWidth: 1.5, borderColor: "#e2e8f0",
                    }}
                    placeholderTextColor="#94a3b8"
                  />
                  <RNTouchableOpacity onPress={applyDateFilter} style={{
                    backgroundColor: "#7c3aed", borderRadius: 14, paddingVertical: 12,
                    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    <Search size={16} color="#fff" />
                    <RNText style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Apply Date Filter</RNText>
                  </RNTouchableOpacity>
                </RNView>
              )}

              {filterType === "month" && (
                <RNView style={{ gap: 8 }}>
                  <RNView style={{ flexDirection: "row", gap: 8 }}>
                    <RNTextInput
                      placeholder="Year"
                      value={filterYear}
                      onChangeText={setFilterYear}
                      keyboardType="numeric"
                      style={{
                        flex: 1, backgroundColor: "#f8fafc", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
                        fontSize: 13, color: "#1e293b", borderWidth: 1.5, borderColor: "#e2e8f0",
                      }}
                      placeholderTextColor="#94a3b8"
                    />
                    <RNTextInput
                      placeholder="Month (1-12)"
                      value={filterMonth}
                      onChangeText={setFilterMonth}
                      keyboardType="numeric"
                      style={{
                        flex: 1, backgroundColor: "#f8fafc", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
                        fontSize: 13, color: "#1e293b", borderWidth: 1.5, borderColor: "#e2e8f0",
                      }}
                      placeholderTextColor="#94a3b8"
                    />
                  </RNView>
                  <RNTouchableOpacity onPress={applyMonthFilter} style={{
                    backgroundColor: "#7c3aed", borderRadius: 14, paddingVertical: 12,
                    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    <Search size={16} color="#fff" />
                    <RNText style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Apply Month Filter</RNText>
                  </RNTouchableOpacity>
                </RNView>
              )}

              {filterType !== "all" && (
                <RNTouchableOpacity onPress={resetFilters} style={{ marginTop: 10, alignItems: "center" }}>
                  <RNText style={{ color: "#dc2626", fontSize: 12, fontWeight: "600" }}>Reset Filters</RNText>
                </RNTouchableOpacity>
              )}
            </RNView>
          </RNView>
        </BentoCard>

        {/* ── BENTO 4: FUEL LOGS LIST ── */}
        <BentoCard anim={card4Anim} style={{ marginBottom: 10 }}>
          <RNView style={{
            borderRadius: 24, overflow: "hidden", backgroundColor: "#fff",
            shadowColor: "#1e293b", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
            borderWidth: 1, borderColor: "#f1f5f9",
          }}>
            {/* Card header */}
            <RNView style={{
              flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              paddingHorizontal: 16, paddingVertical: 13,
              backgroundColor: "#f8fafc",
              borderBottomWidth: 1, borderBottomColor: "#e2e8f0",
            }}>
              <RNView style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#e2e8f0", justifyContent: "center", alignItems: "center" }}>
                  <Fuel size={17} color="#475569" />
                </RNView>
                <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e293b" }}>Fuel Log History</RNText>
              </RNView>
              <RNView style={{ backgroundColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                <RNText style={{ fontSize: 12, fontWeight: "700", color: "#475569" }}>{totalEntries}</RNText>
              </RNView>
            </RNView>

            <RNView style={{ padding: 12 }}>
              {isLoading && !refreshing && (
                <ActivityIndicator color="#0065ea" style={{ marginVertical: 20 }} />
              )}
              {error && (
                <RNView style={{ alignItems: "center", paddingVertical: 20 }}>
                  <RNText style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>Failed to load logs.</RNText>
                  <RNTouchableOpacity onPress={onRefresh} style={{ backgroundColor: "#0065ea", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 }}>
                    <RNText style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Retry</RNText>
                  </RNTouchableOpacity>
                </RNView>
              )}
              {fuelLogs && fuelLogs.length === 0 && !isLoading && (
                <RNView style={{ alignItems: "center", paddingVertical: 28 }}>
                  <RNView style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: "#f0fdf4", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                    <Fuel size={26} color="#22c55e" />
                  </RNView>
                  <RNText style={{ color: "#475569", fontSize: 13, fontWeight: "500" }}>No fuel logs found</RNText>
                  <RNText style={{ color: "#94a3b8", fontSize: 11, marginTop: 3 }}>Add your first fuel entry above</RNText>
                </RNView>
              )}
              {fuelLogs && fuelLogs.length > 0 && fuelLogs.map((log, idx) => {
                const pricePerLiter = (log.amount / log.litersFilled).toFixed(2);
                return (
                  <RNView key={log.fuelLogId} style={{
                    borderRadius: 18, padding: 14, marginBottom: 8,
                    backgroundColor: "#f8fafc",
                    borderWidth: 1, borderColor: "#e2e8f0",
                  }}>
                    {/* Top row: liters and amount */}
                    <RNView style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <RNView style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <RNView style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center" }}>
                          <Fuel size={18} color="#2563eb" />
                        </RNView>
                        <RNView>
                          <RNText style={{ fontSize: 16, fontWeight: "800", color: "#1e293b" }}>{log.litersFilled} L</RNText>
                          {log.odometerReading && (
                            <RNView style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                              <Gauge size={12} color="#94a3b8" />
                              <RNText style={{ fontSize: 10, color: "#94a3b8" }}>{log.odometerReading} km</RNText>
                            </RNView>
                          )}
                        </RNView>
                      </RNView>
                      <RNView style={{ alignItems: "flex-end" }}>
                        <RNText style={{ fontSize: 16, fontWeight: "800", color: "#166534" }}>₹{log.amount}</RNText>
                        <RNText style={{ fontSize: 11, color: "#64748b" }}>₹{pricePerLiter}/L</RNText>
                      </RNView>
                    </RNView>

                    {/* Date row */}
                    <RNView style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 }}>
                      <Calendar size={11} color="#94a3b8" />
                      <RNText style={{ fontSize: 11, color: "#94a3b8" }}>{formatDate(log.fuelDate)}</RNText>
                    </RNView>
                  </RNView>
                );
              })}
            </RNView>
          </RNView>
        </BentoCard>

      </RNScrollView>
    </SafeAreaView>
  );
}