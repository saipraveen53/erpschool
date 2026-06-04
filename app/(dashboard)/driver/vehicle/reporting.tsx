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

  // Input states for filter fields
  const [filterDateInput, setFilterDateInput] = useState("");
  const [filterYearInput, setFilterYearInput] = useState("");
  const [filterMonthInput, setFilterMonthInput] = useState("");

  // Applied filter states
  const [appliedFilterDate, setAppliedFilterDate] = useState("");
  const [appliedFilterYear, setAppliedFilterYear] = useState("");
  const [appliedFilterMonth, setAppliedFilterMonth] = useState("");

  const [refreshing, setRefreshing] = useState(false);

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

  const totalIssues = issues?.length || 0;
  const openIssues = issues?.filter(i => i.status?.toLowerCase() === "open").length || 0;
  const resolvedIssues = issues?.filter(i => i.status?.toLowerCase() === "resolved").length || 0;
  const inProgressIssues = issues?.filter(i => i.status?.toLowerCase() === "in_progress").length || 0;

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
    if (!selectedType) { Alert.alert("Error", "Please select an issue type"); return; }
    if (!description.trim()) { Alert.alert("Error", "Please provide a description"); return; }
    submitIssue({ issueType: selectedType, description });
  };

  const applyDateFilter = () => {
    if (!filterDateInput) { Alert.alert("Error", "Please enter a date (YYYY-MM-DD)"); return; }
    setAppliedFilterDate(filterDateInput);
  };

  const applyMonthFilter = () => {
    if (!filterYearInput || !filterMonthInput) { Alert.alert("Error", "Please enter both year and month"); return; }
    setAppliedFilterYear(filterYearInput);
    setAppliedFilterMonth(filterMonthInput);
  };

  const resetFilters = () => {
    setFilterType("all");
    setFilterDateInput(""); setFilterYearInput(""); setFilterMonthInput("");
    setAppliedFilterDate(""); setAppliedFilterYear(""); setAppliedFilterMonth("");
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

  const issueTypes = [
    { id: "mechanical", label: "Mechanical", icon: <Wrench size={20} />, color: "from-purple-500 to-purple-600", tint: "#f5f3ff", border: "#ddd6fe", iconBg: "#ede9fe", iconColor: "#7c3aed" },
    { id: "accident",   label: "Accident",   icon: <AlertTriangle size={20} />, color: "from-red-500 to-red-600",    tint: "#fff1f2", border: "#fecdd3", iconBg: "#fee2e2", iconColor: "#dc2626" },
    { id: "fuel",       label: "Fuel Issue", icon: <Fuel size={20} />,          color: "from-orange-500 to-orange-600", tint: "#fff7ed", border: "#fed7aa", iconBg: "#ffedd5", iconColor: "#ea580c" },
    { id: "other",      label: "Other",      icon: <Car size={20} />,           color: "from-blue-500 to-blue-600",  tint: "#eff6ff", border: "#bfdbfe", iconBg: "#dbeafe", iconColor: "#2563eb" },
  ];

  // ------------------------------------------------
  // WEB VERSION - UNCHANGED
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
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm flex-shrink-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105">
                <ArrowLeft size={24} color="#0065ea" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#0065ea] to-[#0099ff] bg-clip-text text-transparent">Vehicle Report</h1>
              <div className="w-10" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4"><AlertCircle size={28} strokeWidth={1.5} /><div className="bg-white/20 rounded-full p-2"><FileText size={16} /></div></div>
                  <p className="text-blue-100 text-sm mb-1">Total Issues</p>
                  <p className="text-3xl font-bold">{totalIssues}</p>
                  <p className="text-blue-100 text-xs mt-2">Reported by you</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4"><AlertTriangle size={28} strokeWidth={1.5} /><div className="bg-white/20 rounded-full p-2"><Clock size={16} /></div></div>
                  <p className="text-yellow-100 text-sm mb-1">Open Issues</p>
                  <p className="text-3xl font-bold">{openIssues}</p>
                  <p className="text-yellow-100 text-xs mt-2">Need attention</p>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4"><Clock size={28} strokeWidth={1.5} /><div className="bg-white/20 rounded-full p-2"><Wrench size={16} /></div></div>
                  <p className="text-blue-100 text-sm mb-1">In Progress</p>
                  <p className="text-3xl font-bold">{inProgressIssues}</p>
                  <p className="text-blue-100 text-xs mt-2">Being resolved</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4"><CheckCircle size={28} strokeWidth={1.5} /><div className="bg-white/20 rounded-full p-2"><CheckCircle size={16} /></div></div>
                  <p className="text-green-100 text-sm mb-1">Resolved</p>
                  <p className="text-3xl font-bold">{resolvedIssues}</p>
                  <p className="text-green-100 text-xs mt-2">Completed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-[#0065ea] to-[#0099ff] px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-full p-2"><Send size={24} color="white" /></div>
                        <h2 className="text-xl font-semibold text-white">Report New Issue</h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Issue Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {issueTypes.map((type) => (
                            <button key={type.id} onClick={() => setSelectedType(type.id)}
                              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${selectedType === type.id ? `border-[#0065ea] bg-gradient-to-r ${type.color} text-white shadow-md` : "border-gray-200 bg-white text-gray-700 hover:border-[#0065ea] hover:shadow-md"}`}>
                              <div className={selectedType === type.id ? "text-white" : "text-[#0065ea]"}>{type.icon}</div>
                              <span className="text-xs font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all resize-none" />
                      </div>
                      <button onClick={handleSubmit} disabled={isPending} className="w-full bg-gradient-to-r from-[#0065ea] to-[#0099ff] hover:from-[#0054c4] hover:to-[#0088ee] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50">
                        {isPending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Send size={20} /><span>Submit Report</span></>}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-full p-2"><Search size={24} color="white" /></div>
                        <h2 className="text-xl font-semibold text-white">Filter Issues</h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-5">
                        {["all","date","month"].map(f => (
                          <button key={f} onClick={() => setFilterType(f as any)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filterType === f ? "bg-[#0065ea] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                            {f === "all" ? "All Issues" : f === "date" ? "By Date" : "By Month"}
                          </button>
                        ))}
                      </div>
                      {filterType === "date" && (
                        <div className="space-y-3">
                          <input type="date" value={filterDateInput} onChange={(e) => setFilterDateInput(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all" />
                          <button onClick={applyDateFilter} className="w-full bg-gradient-to-r from-[#0065ea] to-[#0099ff] text-white p-3 rounded-xl flex items-center justify-center gap-2"><Search size={20} /><span>Apply Date Filter</span></button>
                        </div>
                      )}
                      {filterType === "month" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input type="number" placeholder="Year" value={filterYearInput} onChange={(e) => setFilterYearInput(e.target.value)} className="border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all" />
                            <input type="number" placeholder="Month (1-12)" value={filterMonthInput} onChange={(e) => setFilterMonthInput(e.target.value)} className="border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0065ea]/20 focus:border-[#0065ea] transition-all" />
                          </div>
                          <button onClick={applyMonthFilter} className="w-full bg-gradient-to-r from-[#0065ea] to-[#0099ff] text-white p-3 rounded-xl flex items-center justify-center gap-2"><Search size={20} /><span>Apply Month Filter</span></button>
                        </div>
                      )}
                      {filterType !== "all" && <button onClick={resetFilters} className="mt-4 text-red-500 text-sm w-full text-center hover:text-red-600 transition-colors">Reset Filters</button>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2"><FileText size={24} color="white" /></div>
                      <h2 className="text-xl font-semibold text-white">Reported Issues</h2>
                    </div>
                    <div className="bg-white/20 rounded-full px-3 py-1"><span className="text-white text-sm font-medium">{totalIssues} total</span></div>
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
                        <tr><td colSpan={4} className="px-6 py-12 text-center"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0065ea]"></div></div><p className="mt-2 text-gray-500">Loading issues...</p></td></tr>
                      )}
                      {error && (
                        <tr><td colSpan={4} className="px-6 py-12 text-center"><div className="text-red-500">Failed to load issues.</div><button onClick={onRefresh} className="mt-2 text-[#0065ea] hover:underline">Retry</button></td></tr>
                      )}
                      {issues && issues.length === 0 && !isLoading && (
                        <tr><td colSpan={4} className="px-6 py-12 text-center"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle size={32} className="text-gray-400" /></div><p className="text-gray-500">No issues found. Everything looks good!</p></td></tr>
                      )}
                      {issues && issues.length > 0 && issues.map((issue) => (
                        <tr key={issue.issueId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" /><span className="text-sm text-gray-900">{formatDate(issue.createdAt)}</span></div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{issue.issueType.charAt(0).toUpperCase() + issue.issueType.slice(1)}</span></td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-md break-words">{issue.description.length > 80 ? issue.description.substring(0, 80) + "..." : issue.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>{getStatusIcon(issue.status)}{issue.status?.replace("_", " ")}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={onRefresh} disabled={refreshing} className="bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-medium transition-all duration-200 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  {refreshing ? "Refreshing..." : "Refresh Data"}
                </button>
              </div>
              <div className="mt-8 text-center pb-6"><p className="text-xs text-gray-400">© 2026 Transport Management System | Vehicle Reports</p></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ------------------------------------------------
  // NATIVE VERSION (Android/iOS) — WARM LIGHT BENTO REDESIGN
  // ------------------------------------------------

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const card4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const cards = [card1Anim, card2Anim, card3Anim, card4Anim];
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ...cards.map((anim, i) =>
        Animated.timing(anim, { toValue: 1, duration: 480, delay: 60 + i * 80, useNativeDriver: true })
      ),
    ]).start();
  }, []);

  const BentoCard = ({ anim, children, style = {} }: any) => (
    <Animated.View style={[{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );

  const getNativeStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":        return { bg: "#fefce8", border: "#fde68a", text: "#92400e", dot: "#f59e0b" };
      case "in_progress": return { bg: "#eff6ff", border: "#bfdbfe", text: "#1e3a8a", dot: "#3b82f6" };
      case "resolved":    return { bg: "#f0fdf4", border: "#bbf7d0", text: "#14532d", dot: "#22c55e" };
      default:            return { bg: "#f8fafc", border: "#e2e8f0", text: "#475569", dot: "#94a3b8" };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "mechanical": return { icon: <Wrench size={16} color="#7c3aed" />, bg: "#ede9fe", label: "Mechanical" };
      case "accident":   return { icon: <AlertTriangle size={16} color="#dc2626" />, bg: "#fee2e2", label: "Accident" };
      case "fuel":       return { icon: <Fuel size={16} color="#ea580c" />, bg: "#ffedd5", label: "Fuel Issue" };
      default:           return { icon: <Car size={16} color="#2563eb" />, bg: "#dbeafe", label: type || "Other" };
    }
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eef2fb" }}>
        <ActivityIndicator size="large" color="#0065ea" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2fb" }} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* ── HEADER ── */}
      <Animated.View style={{
        opacity: fadeAnim,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 18, paddingTop: 6, paddingBottom: 12,
        backgroundColor: "#eef2fb",
      }}>
        <RNTouchableOpacity onPress={() => router.back()} style={{
          width: 40, height: 40, borderRadius: 14, backgroundColor: "#fff",
          justifyContent: "center", alignItems: "center",
          shadowColor: "#0065ea", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
        }}>
          <ArrowLeft size={20} color="#0065ea" />
        </RNTouchableOpacity>
        <RNText style={{ fontSize: 17, fontWeight: "700", color: "#1e293b", letterSpacing: 0.2 }}>Vehicle Report</RNText>
        <RNView style={{ width: 40 }} />
      </Animated.View>

      <RNScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 14 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0065ea"]} tintColor="#0065ea" />}
      >

        {/* ── BENTO 1: STATS ROW ── */}
        <BentoCard anim={card1Anim} style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          {[
            { label: "Total", value: totalIssues,      bg: "#eff6ff", border: "#bfdbfe", valColor: "#1d4ed8", iconBg: "#dbeafe", icon: <FileText size={16} color="#2563eb" /> },
            { label: "Open",  value: openIssues,       bg: "#fefce8", border: "#fde68a", valColor: "#92400e", iconBg: "#fef9c3", icon: <AlertTriangle size={16} color="#ca8a04" /> },
            { label: "Active",value: inProgressIssues, bg: "#f0fdf4", border: "#bbf7d0", valColor: "#166534", iconBg: "#dcfce7", icon: <Clock size={16} color="#16a34a" /> },
            { label: "Fixed", value: resolvedIssues,   bg: "#f5f3ff", border: "#ddd6fe", valColor: "#5b21b6", iconBg: "#ede9fe", icon: <CheckCircle size={16} color="#7c3aed" /> },
          ].map((stat, idx) => (
            <RNView key={idx} style={{
              flex: 1, borderRadius: 18, padding: 12, alignItems: "center",
              backgroundColor: stat.bg, borderWidth: 1.5, borderColor: stat.border,
            }}>
              <RNView style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: stat.iconBg, justifyContent: "center", alignItems: "center", marginBottom: 7 }}>
                {stat.icon}
              </RNView>
              <RNText style={{ fontSize: 20, fontWeight: "800", color: stat.valColor }}>{stat.value}</RNText>
              <RNText style={{ fontSize: 10, color: "#64748b", fontWeight: "500", marginTop: 1 }}>{stat.label}</RNText>
            </RNView>
          ))}
        </BentoCard>

        {/* ── BENTO 2: REPORT FORM ── */}
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
                <Send size={17} color="#0065ea" />
              </RNView>
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e3a8a" }}>Report New Issue</RNText>
            </RNView>

            <RNView style={{ padding: 16 }}>
              {/* Issue Type Grid */}
              <RNText style={{ fontSize: 11, color: "#94a3b8", fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Select Issue Type</RNText>
              <RNView style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {issueTypes.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <RNTouchableOpacity
                      key={type.id}
                      onPress={() => setSelectedType(type.id)}
                      activeOpacity={0.75}
                      style={{
                        width: "47%",
                        flexDirection: "row", alignItems: "center", gap: 10,
                        borderRadius: 16, padding: 12,
                        backgroundColor: isSelected ? type.iconBg : "#f8fafc",
                        borderWidth: 1.5,
                        borderColor: isSelected ? type.border : "#e2e8f0",
                      }}
                    >
                      <RNView style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: type.iconBg, justifyContent: "center", alignItems: "center" }}>
                        {/* Re-render icon with correct color */}
                        {type.id === "mechanical" && <Wrench size={18} color={type.iconColor} />}
                        {type.id === "accident"   && <AlertTriangle size={18} color={type.iconColor} />}
                        {type.id === "fuel"        && <Fuel size={18} color={type.iconColor} />}
                        {type.id === "other"       && <Car size={18} color={type.iconColor} />}
                      </RNView>
                      <RNText style={{ fontSize: 12.5, fontWeight: isSelected ? "700" : "500", color: isSelected ? type.iconColor : "#475569", flex: 1 }}>{type.label}</RNText>
                      {isSelected && (
                        <RNView style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: type.iconColor }} />
                      )}
                    </RNTouchableOpacity>
                  );
                })}
              </RNView>

              {/* Description */}
              <RNText style={{ fontSize: 11, color: "#94a3b8", fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>Description</RNText>
              <RNTextInput
                style={{
                  backgroundColor: "#f8fafc", borderRadius: 16, padding: 14,
                  fontSize: 14, color: "#1e293b", minHeight: 100,
                  textAlignVertical: "top",
                  borderWidth: 1.5, borderColor: "#e2e8f0",
                  marginBottom: 14,
                }}
                placeholder="Describe the issue in detail..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />

              {/* Submit button */}
              <RNTouchableOpacity
                onPress={handleSubmit}
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
                    <Send size={18} color="#fff" />
                    <RNText style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Submit Report</RNText>
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
              <RNText style={{ fontSize: 15, fontWeight: "700", color: "#3b0764" }}>Filter Issues</RNText>
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
                <RNView style={{ flexDirection: "row", gap: 8 }}>
                  <RNTextInput
                    placeholder="YYYY-MM-DD"
                    value={filterDateInput}
                    onChangeText={setFilterDateInput}
                    style={{
                      flex: 1, backgroundColor: "#f8fafc", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
                      fontSize: 13, color: "#1e293b", borderWidth: 1.5, borderColor: "#e2e8f0",
                    }}
                    placeholderTextColor="#94a3b8"
                  />
                  <RNTouchableOpacity onPress={applyDateFilter} style={{
                    width: 44, height: 44, borderRadius: 14, backgroundColor: "#7c3aed",
                    justifyContent: "center", alignItems: "center",
                  }}>
                    <Search size={18} color="#fff" />
                  </RNTouchableOpacity>
                </RNView>
              )}

              {filterType === "month" && (
                <RNView style={{ gap: 8 }}>
                  <RNView style={{ flexDirection: "row", gap: 8 }}>
                    <RNTextInput
                      placeholder="Year (e.g. 2026)"
                      value={filterYearInput}
                      onChangeText={setFilterYearInput}
                      keyboardType="numeric"
                      style={{
                        flex: 1, backgroundColor: "#f8fafc", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
                        fontSize: 13, color: "#1e293b", borderWidth: 1.5, borderColor: "#e2e8f0",
                      }}
                      placeholderTextColor="#94a3b8"
                    />
                    <RNTextInput
                      placeholder="Month (1-12)"
                      value={filterMonthInput}
                      onChangeText={setFilterMonthInput}
                      keyboardType="numeric"
                      style={{
                        flex: 1, backgroundColor: "#f8fafc", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
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

        {/* ── BENTO 4: ISSUES LIST ── */}
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
                  <FileText size={17} color="#475569" />
                </RNView>
                <RNText style={{ fontSize: 15, fontWeight: "700", color: "#1e293b" }}>Reported Issues</RNText>
              </RNView>
              <RNView style={{ backgroundColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                <RNText style={{ fontSize: 12, fontWeight: "700", color: "#475569" }}>{totalIssues}</RNText>
              </RNView>
            </RNView>

            <RNView style={{ padding: 12 }}>
              {isLoading && !refreshing && (
                <ActivityIndicator color="#0065ea" style={{ marginVertical: 20 }} />
              )}
              {error && (
                <RNView style={{ alignItems: "center", paddingVertical: 20 }}>
                  <RNText style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>Failed to load issues.</RNText>
                  <RNTouchableOpacity onPress={onRefresh} style={{ backgroundColor: "#0065ea", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 }}>
                    <RNText style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Retry</RNText>
                  </RNTouchableOpacity>
                </RNView>
              )}
              {issues && issues.length === 0 && !isLoading && (
                <RNView style={{ alignItems: "center", paddingVertical: 28 }}>
                  <RNView style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: "#f0fdf4", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                    <CheckCircle size={26} color="#22c55e" />
                  </RNView>
                  <RNText style={{ color: "#475569", fontSize: 13, fontWeight: "500" }}>No issues found</RNText>
                  <RNText style={{ color: "#94a3b8", fontSize: 11, marginTop: 3 }}>Everything looks good!</RNText>
                </RNView>
              )}
              {issues && issues.length > 0 && issues.map((issue, idx) => {
                const st = getNativeStatusStyle(issue.status);
                const tp = getTypeIcon(issue.issueType);
                return (
                  <RNView key={issue.issueId} style={{
                    borderRadius: 18, padding: 14, marginBottom: 8,
                    backgroundColor: "#f8fafc",
                    borderWidth: 1, borderColor: "#e2e8f0",
                  }}>
                    {/* Top row: type chip + date + status */}
                    <RNView style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <RNView style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                        <RNView style={{ width: 28, height: 28, borderRadius: 9, backgroundColor: tp.bg, justifyContent: "center", alignItems: "center" }}>
                          {tp.icon}
                        </RNView>
                        <RNText style={{ fontSize: 12.5, fontWeight: "700", color: "#1e293b" }}>{tp.label}</RNText>
                      </RNView>
                      <RNView style={{ flexDirection: "row", alignItems: "center", gap: 5,
                        backgroundColor: st.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3,
                        borderWidth: 1, borderColor: st.border,
                      }}>
                        <RNView style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: st.dot }} />
                        <RNText style={{ fontSize: 10.5, fontWeight: "600", color: st.text }}>{issue.status?.replace("_", " ")}</RNText>
                      </RNView>
                    </RNView>

                    {/* Description */}
                    <RNText style={{ fontSize: 13, color: "#475569", lineHeight: 18, marginBottom: 6 }} numberOfLines={3}>
                      {issue.description}
                    </RNText>

                    {/* Date row */}
                    <RNView style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                      <Calendar size={11} color="#94a3b8" />
                      <RNText style={{ fontSize: 11, color: "#94a3b8" }}>{formatDate(issue.createdAt)}</RNText>
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