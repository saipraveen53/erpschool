import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Calendar, DollarSign, Fuel, Gauge, Save, Search, TrendingDown, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
const averagePrice = totalLiters > 0 ? (totalAmount / totalLiters).toFixed(2) : 0;
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

  // ------------------------------------------------
  // NATIVE VERSION (Android/iOS) - IMPROVED UI
  // ------------------------------------------------
  if (!isWeb) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
        <StatusBar style="dark" />
        <RNView className="flex-row justify-between px-4 py-3 bg-white border-b border-gray-100">
          <RNTouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#0065ea" />
          </RNTouchableOpacity>
          <RNText className="text-lg font-semibold text-[#0065ea]">Fuel Tracking</RNText>
          <RNView className="w-10" />
        </RNView>

        <RNScrollView
          contentContainerClassName="p-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0065ea"]} tintColor="#0065ea" />
          }
        >
          {/* Stats Cards Row */}
          <RNView className="flex-row flex-wrap gap-3 mb-5">
            <RNView className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <Fuel size={24} color="#0065ea" />
              <RNText className="text-2xl font-bold text-gray-800 mt-2">{totalLiters.toFixed(1)} L</RNText>
              <RNText className="text-xs text-gray-500">Total Fuel</RNText>
            </RNView>
            <RNView className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <DollarSign size={24} color="#10b981" />
              <RNText className="text-2xl font-bold text-gray-800 mt-2">₹{totalAmount.toFixed(0)}</RNText>
              <RNText className="text-xs text-gray-500">Total Cost</RNText>
            </RNView>
            <RNView className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <TrendingUp size={24} color="#f59e0b" />
              <RNText className="text-2xl font-bold text-gray-800 mt-2">₹{averagePrice}</RNText>
              <RNText className="text-xs text-gray-500">Avg Price/L</RNText>
            </RNView>
          </RNView>

          {/* Add Fuel Form */}
          <RNView className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <RNView className="items-center mb-4">
              <Fuel size={40} color="#0065ea" />
              <RNText className="text-lg font-semibold text-[#0065ea] mt-2">Add Fuel Entry</RNText>
            </RNView>
            
            <RNText className="text-sm font-medium text-gray-700 mb-1">Liters Filled</RNText>
            <RNTextInput
              className="border border-gray-200 rounded-xl p-3 text-base bg-gray-50 mb-3"
              placeholder="e.g., 40"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={liters}
              onChangeText={setLiters}
            />
            
            <RNText className="text-sm font-medium text-gray-700 mb-1">Amount (₹)</RNText>
            <RNTextInput
              className="border border-gray-200 rounded-xl p-3 text-base bg-gray-50 mb-3"
              placeholder="e.g., 5000"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            
            <RNText className="text-sm font-medium text-gray-700 mb-1">Odometer (km) - Optional</RNText>
            <RNTextInput
              className="border border-gray-200 rounded-xl p-3 text-base bg-gray-50"
              placeholder="e.g., 12500"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={odometer}
              onChangeText={setOdometer}
            />
            
            <RNTouchableOpacity
              className="bg-[#0065ea] flex-row items-center justify-center p-3.5 rounded-xl mt-5 gap-2"
              onPress={handleSave}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Save size={20} color="white" />
                  <RNText className="text-white font-semibold text-base">Save Log</RNText>
                </>
              )}
            </RNTouchableOpacity>
          </RNView>

          {/* Filters */}
          <RNView className="bg-white rounded-2xl p-4 shadow-sm mb-5">
            <RNText className="text-base font-semibold text-[#0065ea] mb-3">Filter Logs</RNText>
            <RNView className="flex-row flex-wrap gap-2 mb-3">
              <RNTouchableOpacity
                onPress={() => setFilterType("all")}
                className={`px-4 py-2 rounded-full ${filterType === "all" ? "bg-[#0065ea]" : "bg-gray-100"}`}
              >
                <RNText className={filterType === "all" ? "text-white" : "text-gray-700"}>All</RNText>
              </RNTouchableOpacity>
              <RNTouchableOpacity
                onPress={() => setFilterType("date")}
                className={`px-4 py-2 rounded-full ${filterType === "date" ? "bg-[#0065ea]" : "bg-gray-100"}`}
              >
                <RNText className={filterType === "date" ? "text-white" : "text-gray-700"}>By Date</RNText>
              </RNTouchableOpacity>
              <RNTouchableOpacity
                onPress={() => setFilterType("month")}
                className={`px-4 py-2 rounded-full ${filterType === "month" ? "bg-[#0065ea]" : "bg-gray-100"}`}
              >
                <RNText className={filterType === "month" ? "text-white" : "text-gray-700"}>By Month</RNText>
              </RNTouchableOpacity>
            </RNView>

            {filterType === "date" && (
              <RNView className="flex-row items-center gap-2">
                <RNTextInput
                  placeholder="YYYY-MM-DD"
                  value={filterDate}
                  onChangeText={setFilterDate}
                  className="flex-1 border border-gray-200 rounded-lg p-2 bg-gray-50"
                />
                <RNTouchableOpacity onPress={applyDateFilter} className="bg-[#0065ea] p-2 rounded-lg">
                  <Search size={20} color="white" />
                </RNTouchableOpacity>
              </RNView>
            )}

            {filterType === "month" && (
              <RNView className="gap-2">
                <RNView className="flex-row gap-2">
                  <RNTextInput
                    placeholder="Year"
                    value={filterYear}
                    onChangeText={setFilterYear}
                    keyboardType="numeric"
                    className="flex-1 border border-gray-200 rounded-lg p-2 bg-gray-50"
                  />
                  <RNTextInput
                    placeholder="Month (1-12)"
                    value={filterMonth}
                    onChangeText={setFilterMonth}
                    keyboardType="numeric"
                    className="flex-1 border border-gray-200 rounded-lg p-2 bg-gray-50"
                  />
                </RNView>
                <RNTouchableOpacity onPress={applyMonthFilter} className="bg-[#0065ea] p-2 rounded-lg items-center">
                  <Search size={20} color="white" />
                </RNTouchableOpacity>
              </RNView>
            )}

            {filterType !== "all" && (
              <RNTouchableOpacity onPress={resetFilters} className="mt-2">
                <RNText className="text-red-500 text-sm text-center">Reset Filters</RNText>
              </RNTouchableOpacity>
            )}
          </RNView>

          {/* Fuel Logs List */}
          <RNView className="bg-white rounded-2xl p-4 shadow-sm mb-5">
            <RNView className="flex-row justify-between items-center mb-3">
              <RNText className="text-lg font-semibold text-[#0065ea]">Fuel Log History</RNText>
              <RNText className="text-xs text-gray-500">{totalEntries} entries</RNText>
            </RNView>
            
            {isLoading && !refreshing && <ActivityIndicator color="#0065ea" className="my-4" />}
            {error && <RNText className="text-red-500 text-center my-4">Failed to load logs. Pull to refresh.</RNText>}
            {fuelLogs && fuelLogs.length === 0 && !isLoading && (
              <RNText className="text-gray-500 text-center my-4">No fuel logs found.</RNText>
            )}
            {Array.isArray(fuelLogs) && fuelLogs.length > 0 ? (
  fuelLogs.map((log) => (
    <RNView key={log.fuelLogId} className="border-b border-gray-100 py-3">
      <RNView className="flex-row justify-between items-center">
        <RNView>
          <RNText className="text-[#0065ea] font-semibold text-lg">{log.litersFilled} L</RNText>
          {log.odometerReading && (
            <RNView className="flex-row items-center mt-1">
              <Gauge size={12} color="#9ca3af" />
              <RNText className="text-xs text-gray-500 ml-1">{log.odometerReading} km</RNText>
            </RNView>
          )}
        </RNView>
        <RNView className="items-end">
          <RNText className="text-gray-800 font-semibold">₹{log.amount}</RNText>
          <RNText className="text-xs text-gray-400 mt-1">{formatDate(log.fuelDate)}</RNText>
        </RNView>
      </RNView>
    </RNView>
  ))
) : (
  !isLoading && <RNText className="text-gray-500 text-center my-4">No fuel logs found.</RNText>
)}
          </RNView>
        </RNScrollView>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------
  // WEB VERSION - BENTO GRID LAYOUT
  // ------------------------------------------------
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