import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertCircle, AlertTriangle, ArrowLeft, Calendar, Car, CheckCircle, Clock, FileText, Fuel, Search, Send, Wrench } from "lucide-react-native";
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
import { root1Api } from "../../../utils/axiosInstance";

const isWeb = Platform.OS === "web";

// Types
interface IssueRequest {
  issueType: string;
  description: string;
}

interface Issue {
  issueId: string;
  issueType: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

// API functions
const createIssue = async (data: IssueRequest): Promise<Issue> => {
  const response = await root1Api.post("/api/student/transport/createIssue", data);
  return response.data;
};

const fetchMyIssues = async (): Promise<Issue[]> => {
  const response = await root1Api.get("/api/student/transport/myIssues");
  return response.data;
};

const fetchIssuesByDate = async (date: string): Promise<Issue[]> => {
  const response = await root1Api.get(`/api/student/transport/date/Issue?date=${date}`);
  return response.data;
};

const fetchIssuesByMonth = async (year: number, month: number): Promise<Issue[]> => {
  const response = await root1Api.get(`/api/student/transport/month/issue?year=${year}&month=${month}`);
  return response.data;
};

export default function VehicleReporting() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form state
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  
  // Filter type (all / date / month)
  const [filterType, setFilterType] = useState<"all" | "date" | "month">("all");
  
  // Input states for filter fields (what user types)
  const [filterDateInput, setFilterDateInput] = useState("");
  const [filterYearInput, setFilterYearInput] = useState("");
  const [filterMonthInput, setFilterMonthInput] = useState("");
  
  // Applied filter states (actual values used in query)
  const [appliedFilterDate, setAppliedFilterDate] = useState("");
  const [appliedFilterYear, setAppliedFilterYear] = useState("");
  const [appliedFilterMonth, setAppliedFilterMonth] = useState("");
  
  const [refreshing, setRefreshing] = useState(false);

  // Query for issues list – uses applied filter values, not input values
  const { data: issues, isLoading, error, refetch } = useQuery({
    queryKey: ["vehicleIssues", filterType, appliedFilterDate, appliedFilterYear, appliedFilterMonth],
    queryFn: async () => {
      if (filterType === "date" && appliedFilterDate) {
        return fetchIssuesByDate(appliedFilterDate);
      } else if (filterType === "month" && appliedFilterYear && appliedFilterMonth) {
        return fetchIssuesByMonth(parseInt(appliedFilterYear), parseInt(appliedFilterMonth));
      } else {
        return fetchMyIssues();
      }
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });

  // Calculate statistics
  const totalIssues = issues?.length || 0;
  const openIssues = issues?.filter(i => i.status?.toLowerCase() === "open").length || 0;
  const resolvedIssues = issues?.filter(i => i.status?.toLowerCase() === "resolved").length || 0;
  const inProgressIssues = issues?.filter(i => i.status?.toLowerCase() === "in_progress").length || 0;

  // Mutation for creating an issue
  const { mutate: submitIssue, isPending } = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      Alert.alert("Success", "Issue reported successfully");
      setSelectedType("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["vehicleIssues"] });
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to report issue");
    },
  });

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert("Error", "Please select an issue type");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please provide a description");
      return;
    }
    submitIssue({ issueType: selectedType, description });
  };

  // Apply date filter – copy input to applied state
  const applyDateFilter = () => {
    if (!filterDateInput) {
      Alert.alert("Error", "Please enter a date (YYYY-MM-DD)");
      return;
    }
    setAppliedFilterDate(filterDateInput);
  };

  // Apply month filter – copy input to applied state
  const applyMonthFilter = () => {
    if (!filterYearInput || !filterMonthInput) {
      Alert.alert("Error", "Please enter both year and month");
      return;
    }
    setAppliedFilterYear(filterYearInput);
    setAppliedFilterMonth(filterMonthInput);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterType("all");
    setFilterDateInput("");
    setFilterYearInput("");
    setFilterMonthInput("");
    setAppliedFilterDate("");
    setAppliedFilterYear("");
    setAppliedFilterMonth("");
    queryClient.invalidateQueries({ queryKey: ["vehicleIssues"] });
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open": return <AlertCircle size={14} />;
      case "in_progress": return <Clock size={14} />;
      case "resolved": return <CheckCircle size={14} />;
      default: return <FileText size={14} />;
    }
  };

  // Issue type options
  const issueTypes = [
    { id: "mechanical", label: "Mechanical Issue", icon: <Wrench size={20} />, color: "from-purple-500 to-purple-600" },
    { id: "accident", label: "Accident", icon: <AlertTriangle size={20} />, color: "from-red-500 to-red-600" },
    { id: "fuel", label: "Fuel Issue", icon: <Fuel size={20} />, color: "from-orange-500 to-orange-600" },
    { id: "other", label: "Other", icon: <Car size={20} />, color: "from-blue-500 to-blue-600" },
  ];

  // ------------------------------------------------
  // WEB VERSION - STUNNING BENTO GRID UI WITH SCROLLING
  // ------------------------------------------------
  if (isWeb) {
    if (isLoading && !refreshing) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0065ea]"></div>
        </div>
      );
    }

    return (
      <>
        <StatusBar style="dark" />
        {/* Main container with fixed height and scrolling */}
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
          {/* Sticky header with glassmorphism - fixed at top */}
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm flex-shrink-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105">
                <ArrowLeft size={24} color="#0065ea" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#0065ea] to-[#0099ff] bg-clip-text text-transparent">Vehicle Report</h1>
              <div className="w-10" />
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Stats Bento Grid - 4 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <AlertCircle size={28} strokeWidth={1.5} />
                    <div className="bg-white/20 rounded-full p-2">
                      <FileText size={16} />
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm mb-1">Total Issues</p>
                  <p className="text-3xl font-bold">{totalIssues}</p>
                  <p className="text-blue-100 text-xs mt-2">Reported by you</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle size={28} strokeWidth={1.5} />
                    <div className="bg-white/20 rounded-full p-2">
                      <Clock size={16} />
                    </div>
                  </div>
                  <p className="text-yellow-100 text-sm mb-1">Open Issues</p>
                  <p className="text-3xl font-bold">{openIssues}</p>
                  <p className="text-yellow-100 text-xs mt-2">Need attention</p>
                </div>

                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Clock size={28} strokeWidth={1.5} />
                    <div className="bg-white/20 rounded-full p-2">
                      <Wrench size={16} />
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm mb-1">In Progress</p>
                  <p className="text-3xl font-bold">{inProgressIssues}</p>
                  <p className="text-blue-100 text-xs mt-2">Being resolved</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle size={28} strokeWidth={1.5} />
                    <div className="bg-white/20 rounded-full p-2">
                      <CheckCircle size={16} />
                    </div>
                  </div>
                  <p className="text-green-100 text-sm mb-1">Resolved</p>
                  <p className="text-3xl font-bold">{resolvedIssues}</p>
                  <p className="text-green-100 text-xs mt-2">Completed</p>
                </div>
              </div>

              {/* Two-column Bento Layout - Form & Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Report Issue Form - Bento Card */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-[#0065ea] to-[#0099ff] px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-full p-2">
                          <Send size={24} color="white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Report New Issue</h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Issue Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {issueTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setSelectedType(type.id)}
                              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${
                                selectedType === type.id
                                  ? `border-[#0065ea] bg-gradient-to-r ${type.color} text-white shadow-md`
                                  : "border-gray-200 bg-white text-gray-700 hover:border-[#0065ea] hover:shadow-md"
                              }`}
                            >
                              <div className={selectedType === type.id ? "text-white" : "text-[#0065ea]"}>
                                {type.icon}
                              </div>
                              <span className="text-xs font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe the issue in detail..."
                          className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all resize-none"
                        />
                      </div>
                      <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-[#0065ea] to-[#0099ff] hover:from-[#0054c4] hover:to-[#0088ee] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                      >
                        {isPending ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Send size={20} />
                            <span>Submit Report</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filters - Bento Card */}
                <div>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-full p-2">
                          <Search size={24} color="white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Filter Issues</h2>
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
                          All Issues
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
                            value={filterDateInput}
                            onChange={(e) => setFilterDateInput(e.target.value)}
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
                              value={filterYearInput}
                              onChange={(e) => setFilterYearInput(e.target.value)}
                              className="border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all"
                            />
                            <input
                              type="number"
                              placeholder="Month (1-12)"
                              value={filterMonthInput}
                              onChange={(e) => setFilterMonthInput(e.target.value)}
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

              {/* Issues List Table - Bento Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <FileText size={24} color="white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Reported Issues</h2>
                    </div>
                    <div className="bg-white/20 rounded-full px-3 py-1">
                      <span className="text-white text-sm font-medium">{totalIssues} total</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading && !refreshing && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0065ea]"></div>
                            </div>
                            <p className="mt-2 text-gray-500">Loading issues...</p>
                          </td>
                        </tr>
                      )}
                      {error && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="text-red-500">Failed to load issues. Please try again.</div>
                            <button onClick={onRefresh} className="mt-2 text-[#0065ea] hover:underline">
                              Retry
                            </button>
                          </td>
                        </tr>
                      )}
                      {issues && issues.length === 0 && !isLoading && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <CheckCircle size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500">No issues found. Everything looks good!</p>
                          </td>
                        </tr>
                      )}
                      {issues && issues.length > 0 && issues.map((issue) => (
                        <tr key={issue.issueId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-sm text-gray-900">{formatDate(issue.createdAt)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {issue.issueType.charAt(0).toUpperCase() + issue.issueType.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-md break-words">
                            {issue.description.length > 80 ? issue.description.substring(0, 80) + "..." : issue.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                              {getStatusIcon(issue.status)}
                              {issue.status?.replace("_", " ")}
                            </span>
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
                  disabled={refreshing}
                  className="bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {refreshing ? "Refreshing..." : "Refresh Data"}
                </button>
              </div>

              {/* Footer Note */}
              <div className="mt-8 text-center pb-6">
                <p className="text-xs text-gray-400">© 2026 Transport Management System | Vehicle Reports</p>
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0065ea" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <RNView className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <RNTouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#0065ea" />
        </RNTouchableOpacity>
        <RNText className="text-lg font-semibold text-[#0065ea]">Vehicle Report</RNText>
        <RNView className="w-10" />
      </RNView>

      <RNScrollView
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0065ea"]} tintColor="#0065ea" />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Form */}
          <RNView className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <RNText className="text-lg font-semibold text-[#0065ea] mb-4">Report New Issue</RNText>
            <RNView className="mb-4">
              <RNText className="text-sm font-medium text-gray-700 mb-2">Issue Type</RNText>
              <RNView className="flex-row flex-wrap justify-between gap-2">
                {issueTypes.map((type) => (
                  <RNTouchableOpacity
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    className={`w-[48%] p-3 rounded-xl border items-center flex-row justify-center gap-2 mb-2 ${
                      selectedType === type.id ? "border-[#0065ea] bg-[#0065ea]" : "border-gray-300 bg-white"
                    }`}
                  >
                    {type.icon}
                    <RNText className={selectedType === type.id ? "text-white" : "text-gray-700"}>{type.label}</RNText>
                  </RNTouchableOpacity>
                ))}
              </RNView>
            </RNView>

            <RNView className="mb-4">
              <RNText className="text-sm font-medium text-gray-700 mb-2">Description</RNText>
              <RNTextInput
                className="border border-gray-300 rounded-lg p-3 text-base min-h-[100px] text-left align-top"
                placeholder="Describe the issue in detail..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </RNView>

            <RNTouchableOpacity
              onPress={handleSubmit}
              disabled={isPending}
              className="bg-[#0065ea] flex-row items-center justify-center p-3.5 rounded-xl gap-2"
            >
              {isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Send size={20} color="white" />
                  <RNText className="text-white font-semibold text-base">Submit Report</RNText>
                </>
              )}
            </RNTouchableOpacity>
          </RNView>

          {/* Filters */}
          <RNView className="bg-gray-50 rounded-xl p-4 mb-4">
            <RNText className="text-base font-semibold text-[#0065ea] mb-3">Filter Issues</RNText>
            <RNView className="flex-row flex-wrap gap-2 mb-3">
              <RNTouchableOpacity
                onPress={() => setFilterType("all")}
                className={`px-4 py-2 rounded-full ${filterType === "all" ? "bg-[#0065ea]" : "bg-white border border-[#0065ea]"}`}
              >
                <RNText className={filterType === "all" ? "text-white" : "text-[#0065ea]"}>All</RNText>
              </RNTouchableOpacity>
              <RNTouchableOpacity
                onPress={() => setFilterType("date")}
                className={`px-4 py-2 rounded-full ${filterType === "date" ? "bg-[#0065ea]" : "bg-white border border-[#0065ea]"}`}
              >
                <RNText className={filterType === "date" ? "text-white" : "text-[#0065ea]"}>By Date</RNText>
              </RNTouchableOpacity>
              <RNTouchableOpacity
                onPress={() => setFilterType("month")}
                className={`px-4 py-2 rounded-full ${filterType === "month" ? "bg-[#0065ea]" : "bg-white border border-[#0065ea]"}`}
              >
                <RNText className={filterType === "month" ? "text-white" : "text-[#0065ea]"}>By Month</RNText>
              </RNTouchableOpacity>
            </RNView>

            {filterType === "date" && (
              <RNView className="flex-row items-center gap-2">
                <RNTextInput
                  placeholder="YYYY-MM-DD"
                  value={filterDateInput}
                  onChangeText={setFilterDateInput}
                  className="flex-1 border border-gray-300 rounded-lg p-2 text-[#0065ea]"
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
                    placeholder="Year (e.g., 2026)"
                    value={filterYearInput}
                    onChangeText={setFilterYearInput}
                    keyboardType="numeric"
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-[#0065ea]"
                  />
                  <RNTextInput
                    placeholder="Month (e.g., 6 or 06)"
                    value={filterMonthInput}
                    onChangeText={setFilterMonthInput}
                    keyboardType="numeric"
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-[#0065ea]"
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

          {/* Issues List (Native) */}
          <RNView className="bg-white rounded-2xl p-4 shadow-sm">
            <RNText className="text-lg font-semibold text-[#0065ea] mb-3">My Reported Issues</RNText>
            {isLoading && !refreshing && <ActivityIndicator color="#0065ea" className="my-4" />}
            {error && <RNText className="text-red-500 text-center my-4">Failed to load issues.</RNText>}
            {issues && issues.length === 0 && !isLoading && (
              <RNText className="text-gray-500 text-center my-4">No issues found.</RNText>
            )}
            {issues && issues.length > 0 && issues.map((issue) => (
              <RNView key={issue.issueId} className="border-b border-gray-100 py-3">
                <RNView className="flex-row justify-between items-center mb-1">
                  <RNText className="font-semibold text-gray-800">{issue.issueType}</RNText>
                  <RNText className="text-xs text-gray-500">{formatDate(issue.createdAt)}</RNText>
                </RNView>
                <RNText className="text-sm text-gray-600">{issue.description}</RNText>
                <RNView className="flex-row items-center mt-2">
                  <RNView className={`px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                    <RNText className="text-xs font-medium">{issue.status}</RNText>
                  </RNView>
                </RNView>
              </RNView>
            ))}
          </RNView>
        </Animated.View>
      </RNScrollView>
    </SafeAreaView>
  );
}