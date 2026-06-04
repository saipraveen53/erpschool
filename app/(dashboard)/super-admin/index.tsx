import { useRouter } from "expo-router";
import { 
  AlertCircle, 
  ChevronDown, 
  Clock, 
  ServerCrash, 
  ShieldAlert, 
  Star, 
  HardDrive, 
  Cpu, 
  Activity, 
  ArrowUpRight,
  User,
  Users,
  Bell,
  Calendar,
  Megaphone,
  Truck,
  BookOpen,
  IndianRupee,
  TrendingUp,
  CheckCircle,
  Shield,
  CircleCheck,
  CircleX,
  FileText,
  Table,
  Award
} from "lucide-react-native";
import { useState, useEffect } from "react";
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, useWindowDimensions, View, Alert, Switch, ActivityIndicator } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop, G, Text as SvgText } from "react-native-svg";
import { rootApi } from "../../utils/axiosInstance";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SuperAdminDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const router = useRouter();

  const [studentCount, setStudentCount] = useState<number | string>("...");
  const [genderData, setGenderData] = useState<any>({ malePercentage: 0, femalePercentage: 0 });
  const [recentNotices, setRecentNotices] = useState<any[]>([]);
  const [billingStats, setBillingStats] = useState({ expected: 0, collected: 0, pending: 0 });

  const [overviewStats, setOverviewStats] = useState({
    students: "...",
    teachers: "...",
    drivers: "...",
    users: "..."
  });

  const [globalMetrics, setGlobalMetrics] = useState<any>(null);

  // User Activation Widget State
  const [dashboardUsers, setDashboardUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [togglingUser, setTogglingUser] = useState<string | null>(null);

  // Leave Stats State
  const [leaveStats, setLeaveStats] = useState({
    totalRejectedLeaves: 0,
    totalPendingRequests: 0,
    teachersOnLeaveToday: 0
  });

  useEffect(() => {
    fetchGlobalMetrics();
    fetchDashboardMetrics();
    fetchNotices();
    fetchBillingStats();
    fetchDashboardUsers();
    fetchLeaveStats();
  }, []);

  const fetchGlobalMetrics = async () => {
    try {
      const response = await rootApi.get('/api/global');
      if (response.data) {
        setGlobalMetrics(response.data);
      }
    } catch (e) {
      console.log("Failed to fetch global metrics", e);
    }
  };

  const fetchLeaveStats = async () => {
    try {
      const response = await rootApi.get('/api/teacher/leave/getStats');
      if (response.data) {
        setLeaveStats({
          totalRejectedLeaves: response.data.totalRejectedLeaves || 0,
          totalPendingRequests: response.data.totalPendingRequests || 0,
          teachersOnLeaveToday: response.data.teachersOnLeaveToday || 0,
        });
      }
    } catch (error) {
      console.log("Failed to fetch leave stats", error);
    }
  };

  const fetchBillingStats = async () => {
    try {
      const response = await rootApi.get(`http://192.168.88.20:8081/api/student/fee/admin/dashboard/stats`);
      if (response.data && Array.isArray(response.data)) {
        const expected = response.data.reduce((sum, item) => sum + (item.totalExpectedFee || 0), 0);
        const collected = response.data.reduce((sum, item) => sum + (item.totalCollectedFee || 0), 0);
        const pending = response.data.reduce((sum, item) => sum + (item.totalPendingFee || 0), 0);
        setBillingStats({ expected, collected, pending });
      }
    } catch (error) {
      console.log("Failed to fetch billing stats for dashboard", error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await rootApi.get('http://192.168.88.20:8081/api/student/notice/all');
      if (response.data && Array.isArray(response.data)) {
        const sorted = response.data.sort((a, b) => new Date(b.noticeDate).getTime() - new Date(a.noticeDate).getTime());
        setRecentNotices(sorted.slice(0, 3));
      }
    } catch (e) {
      console.log("Failed to fetch notices", e);
    }
  };

  const fetchDashboardMetrics = async () => {
    try {
      const countRes = await rootApi.get('/api/student/count').catch(e => ({ data: 0 }));
      const genderRes = await rootApi.get('/api/student/dashboard/gender-percentage').catch(e => ({ data: null }));
      
      let fetchedCount = countRes.data || 0;
      setStudentCount(fetchedCount);
      if (genderRes.data) {
        setGenderData({
          malePercentage: Math.round(genderRes.data.MALE || 0),
          femalePercentage: Math.round(genderRes.data.FEMALE || 0)
        });
      }

      const overviewRes = await rootApi.get('http://192.168.88.20:8081/api/superAdmin/dashboard').catch(() => ({ data: {} }));
      
      setOverviewStats({
        students: String(overviewRes.data?.totalStudents || 0),
        teachers: String(overviewRes.data?.totalTeachers || 0),
        drivers: String(overviewRes.data?.totalDrivers || 0),
        users: String(overviewRes.data?.totalUsers || 0)
      });
    } catch (e) {
      console.log("Failed to process dashboard metrics", e);
    }
  };

  const fetchDashboardUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await rootApi.get(`http://192.168.88.20:8081/api/superAdmin/users`);
      if (response.data && Array.isArray(response.data)) {
        const filtered = response.data.filter(u => u.role !== "SUPER_ADMIN");
        setDashboardUsers(filtered);
      }
    } catch (error) {
      console.log("Failed to fetch dashboard users", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUserStatus = (username: string, currentStatus: boolean) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} user ${username}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, I'm sure", 
          style: currentStatus ? "destructive" : "default",
          onPress: async () => {
            const newStatus = !currentStatus;
            setTogglingUser(username);
            try {
              await rootApi.put(`http://192.168.88.20:8081/api/superAdmin/users/${username}/status?active=${newStatus}`);
              setDashboardUsers(prev => prev.map(u => u.username === username ? { ...u, isAvailable: newStatus } : u));
            } catch (error) {
              console.error("Failed to toggle user status:", error);
              Alert.alert("Error", "Failed to update user status.");
            } finally {
              setTogglingUser(null);
            }
          }
        }
      ]
    );
  };

  const chartHeight = 176;
  const cx = 100;
  const cy = chartHeight / 2;
  const radius = 64;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;

  const malePercent = genderData.malePercentage || 0;
  const femalePercent = genderData.femalePercentage || 0;
  
  const maleDash = (malePercent / 100) * circumference;
  const femaleDash = (femalePercent / 100) * circumference;



  const generateExcel = async () => {
    try {
      Alert.alert("Exporting", "Gathering full school data...");
      
      // Fetch Detailed Data for Export
      const feesRes = await rootApi.get(`http://192.168.88.20:8081/api/student/fee/admin/dashboard/stats`).catch(() => ({data: []}));
      const detailedFees = Array.isArray(feesRes.data) ? feesRes.data : [];

      const pendingLeavesRes = await rootApi.get(`/api/teacher/leave/byStatus?status=PENDING`).catch(() => ({data: []}));
      const approvedLeavesRes = await rootApi.get(`/api/teacher/leave/byStatus?status=APPROVED`).catch(() => ({data: []}));
      const rejectedLeavesRes = await rootApi.get(`/api/teacher/leave/byStatus?status=REJECTED`).catch(() => ({data: []}));
      const allLeaves = [
        ...(Array.isArray(pendingLeavesRes.data) ? pendingLeavesRes.data : []),
        ...(Array.isArray(approvedLeavesRes.data) ? approvedLeavesRes.data : []),
        ...(Array.isArray(rejectedLeavesRes.data) ? rejectedLeavesRes.data : [])
      ];

      const usersRes = await rootApi.get(`http://192.168.88.20:8081/api/superAdmin/users`).catch(() => ({data: []}));
      const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];

      // 1. Prepare data
      const overviewData = [
        ["Metric", "Value"],
        ["Total Students", overviewStats.students],
        ["Total Teachers", overviewStats.teachers],
        ["Total Drivers", overviewStats.drivers],
        ["Total Users", overviewStats.users],
        ["Male Students (%)", genderData.malePercentage],
        ["Female Students (%)", genderData.femalePercentage]
      ];
      
      const financialData = [
        ["Class/Section", "Expected Fees (₹)", "Collected Fees (₹)", "Pending Fees (₹)"]
      ];
      detailedFees.forEach(f => {
        financialData.push([
          f.className || "Unknown", 
          f.totalExpectedFee || 0, 
          f.totalCollectedFee || 0, 
          f.totalPendingFee || 0
        ]);
      });

      const leaveData = [
        ["Leave ID", "Teacher ID", "Start Date", "End Date", "Status", "Reason"]
      ];
      allLeaves.forEach(l => {
        leaveData.push([
          l.leaveId || "-", 
          l.teacherId || "-", 
          l.startDate || "-", 
          l.endDate || "-", 
          l.leaveStatus || "-", 
          l.reason || l.remarks || "-"
        ]);
      });

      const usersData = [
        ["Username", "Name", "Role", "Email", "Phone", "Status"]
      ];
      allUsers.forEach(u => {
        usersData.push([
          u.username || "-",
          u.firstName ? `${u.firstName} ${u.lastName || ""}` : "-",
          u.role || "-",
          u.email || "-",
          u.phone || "-",
          u.isAvailable ? "Active" : "Inactive"
        ]);
      });

      // 2. Create workbook and sheets
      const wb = XLSX.utils.book_new();
      const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
      const wsFinancial = XLSX.utils.aoa_to_sheet(financialData);
      const wsLeaves = XLSX.utils.aoa_to_sheet(leaveData);
      const wsUsers = XLSX.utils.aoa_to_sheet(usersData);
      
      XLSX.utils.book_append_sheet(wb, wsOverview, "System Overview");
      XLSX.utils.book_append_sheet(wb, wsFinancial, "Detailed Fees");
      XLSX.utils.book_append_sheet(wb, wsLeaves, "All Leaves");
      XLSX.utils.book_append_sheet(wb, wsUsers, "All Users");

      // 3. Export
      if (Platform.OS === 'web') {
        XLSX.writeFile(wb, "Dashboard_Report.xlsx");
      } else {
        const base64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
        const fileUri = ((FileSystem as any).documentDirectory || '') + "Dashboard_Report.xlsx";
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: 'base64' as any });
        
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        } else {
          Alert.alert("Success", `Report saved to: ${fileUri}`);
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to generate Excel report");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: isMobile ? 12 : 28, paddingBottom: 60 }}>
      <View style={[styles.pageHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 100, elevation: 100 }]}>
        <View>
          <Text style={[styles.pageTitle, { fontSize: isMobile ? 22 : 30 }]}>System Overview</Text>
          <Text style={styles.pageSubtitle}>Real-time analytics and platform health</Text>
        </View>
        <TouchableOpacity style={styles.downloadButton} onPress={generateExcel}>
          <Table size={16} color="#FFF" />
          {!isMobile && <Text style={styles.downloadText}>Export Excel</Text>}
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'column', width: '100%', flex: 1, gap: 20 }}>

        {/* NEW GLOBAL METRICS SECTION */}
        {globalMetrics && (
          <View style={[styles.card, { padding: isMobile ? 16 : 24 }]}>
            <View style={styles.cardHeaderFlex}>
              <View>
                <Text style={styles.cardTitle}>Academic Performance Overview</Text>
                <Text style={styles.cardSubtitle}>School-wide pass rates and active enrollments</Text>
              </View>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(3, 105, 161, 0.1)' }]}>
                <Award size={18} color="#0369a1" />
              </View>
            </View>

            <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: 16, marginTop: 20 }}>
              <View style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 16, borderRadius: 12 }}>
                <Text style={{ fontSize: 12, color: '#0369a1', fontWeight: '700', textTransform: 'uppercase' }}>Active Students</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0c4a6e', marginTop: 8 }}>{globalMetrics.totalActiveStudents}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#f0fdf4', padding: 16, borderRadius: 12 }}>
                <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700', textTransform: 'uppercase' }}>Total Classes</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#14532d', marginTop: 8 }}>{globalMetrics.totalClassSections}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#fef2f2', padding: 16, borderRadius: 12 }}>
                <Text style={{ fontSize: 12, color: '#dc2626', fontWeight: '700', textTransform: 'uppercase' }}>Overall Pass Rate</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#7f1d1d', marginTop: 8 }}>{globalMetrics.overallPassPercentage}%</Text>
              </View>
            </View>
          </View>
        )}

        {/* TOP ROW: PLATFORM OVERVIEW (Left) & USER STATUS GAUGE (Right) */}
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: 20 }}>
          
          {/* PLATFORM OVERVIEW BAR CHART */}
          <View style={[styles.card, { flex: 1, padding: isMobile ? 16 : 24 }]}>
            <View style={styles.cardHeaderFlex}>
              <View>
                <Text style={styles.cardTitle}>Platform Scale Overview</Text>
                <Text style={styles.cardSubtitle}>Distribution of users across the system</Text>
              </View>
              <View style={styles.statusLiveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>

            <View style={{ height: 160, marginTop: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingHorizontal: 10, backgroundColor: '#FDFBF7', borderRadius: 16, paddingBottom: 16, paddingTop: 24, borderWidth: 1, borderColor: '#F5E6DF' }}>
              {(() => {
                const s = parseInt(overviewStats.students) || 0;
                const t = parseInt(overviewStats.teachers) || 0;
                const d = parseInt(overviewStats.drivers) || 0;
                const u = parseInt(overviewStats.users) || 0;
                const maxBar = Math.max(s, t, d, u, 10);
                const data = [
                  { label: 'Students', val: s, col: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
                  { label: 'Teachers', val: t, col: '#F4A460', bg: 'rgba(244, 164, 96, 0.15)' },
                  { label: 'Drivers', val: d, col: '#E35336', bg: 'rgba(227, 83, 54, 0.15)' },
                  { label: 'Total', val: u, col: '#5C2E14', bg: 'rgba(92, 46, 20, 0.15)' }
                ];

                return data.map(item => (
                  <View key={item.label} style={{ alignItems: 'center', width: '22%' }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: item.col, marginBottom: 8 }}>{item.val}</Text>
                    <View style={{ width: '100%', height: 90, justifyContent: 'flex-end', backgroundColor: item.bg, borderRadius: 10, overflow: 'hidden' }}>
                      <View style={{ width: '100%', height: `${(item.val / maxBar) * 100}%`, backgroundColor: item.col, borderRadius: 10 }} />
                    </View>
                    <Text style={{ fontSize: 11, color: '#8A6B5D', fontWeight: '700', marginTop: 10 }} numberOfLines={1}>{item.label}</Text>
                  </View>
                ));
              })()}
            </View>
          </View>

          {/* ACTIVE VS INACTIVE USERS GAUGE */}
          <View style={[styles.card, { flex: 1, padding: isMobile ? 16 : 24 }]}>
            <View style={styles.cardHeaderFlex}>
              <View>
                <Text style={styles.cardTitle}>User Account Status</Text>
                <Text style={styles.cardSubtitle}>Compare active and disabled accounts</Text>
              </View>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(92, 46, 20, 0.1)' }]}>
                <ShieldAlert size={18} color="#5C2E14" />
              </View>
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
              {loadingUsers ? (
                <ActivityIndicator size="large" color="#E35336" />
              ) : dashboardUsers.length === 0 ? (
                <View style={{ alignItems: 'center' }}>
                  <Shield size={32} color="#E6D8D2" />
                  <Text style={{ color: '#8A6B5D', fontSize: 12, marginTop: 10 }}>No user data available.</Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  {(() => {
                    const activeCount = dashboardUsers.filter(u => u.isAvailable !== false).length;
                    const inactiveCount = dashboardUsers.length - activeCount;
                    const totalCount = dashboardUsers.length;
                    const activePercent = totalCount ? Math.round((activeCount / totalCount) * 100) : 0;
                    
                    // Simple Donut for Active vs Inactive
                    const aDash = (activePercent / 100) * circumference;
                    const iDash = ((100 - activePercent) / 100) * circumference;

                    return (
                      <View style={{ alignItems: 'center', width: '100%' }}>
                        <View style={{ height: 140, position: "relative", alignItems: 'center', justifyContent: 'center' }}>
                          <Svg width="100%" height={140} viewBox={`0 0 200 140`}>
                            <G rotation="-90" origin={`100, 70`}>
                              <Circle cx="100" cy="70" r="50" stroke="#fca5a5" strokeWidth="20" fill="transparent" />
                              <Circle cx="100" cy="70" r="50" stroke="#16a34a" strokeWidth="20" fill="transparent" strokeDasharray={`${aDash * (50/64)} ${circumference * (50/64)}`} strokeLinecap="round" />
                            </G>
                            <SvgText x="100" y="66" fontSize="24" fontWeight="900" fill="#5C2E14" textAnchor="middle" alignmentBaseline="middle">{activePercent}%</SvgText>
                            <SvgText x="100" y="86" fontSize="10" fontWeight="700" fill="#8A6B5D" textAnchor="middle" alignmentBaseline="middle">Active</SvgText>
                          </Svg>
                        </View>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 16, width: '100%', paddingHorizontal: 20 }}>
                          <View style={{ alignItems: 'center', flex: 1, backgroundColor: 'rgba(22, 163, 74, 0.1)', padding: 10, borderRadius: 12 }}>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: '#16a34a' }}>{activeCount}</Text>
                            <Text style={{ fontSize: 10, color: '#166534', fontWeight: '700', textTransform: 'uppercase', marginTop: 2 }}>Enabled</Text>
                          </View>
                          <View style={{ alignItems: 'center', flex: 1, backgroundColor: 'rgba(220, 38, 38, 0.1)', padding: 10, borderRadius: 12 }}>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: '#dc2626' }}>{inactiveCount}</Text>
                            <Text style={{ fontSize: 10, color: '#991b1b', fontWeight: '700', textTransform: 'uppercase', marginTop: 2 }}>Disabled</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })()}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* MIDDLE ROW: BILLING CARDS */}
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: 16 }}>
          <TouchableOpacity style={[styles.card, { flex: 1, padding: 18, flexDirection: 'row', alignItems: 'center' }]} onPress={() => router.push("/super-admin/billing" as any)}>
            <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <TrendingUp size={22} color="#3b82f6" />
            </View>
            <View>
              <Text style={{ fontSize: 14, color: "#8A6B5D", fontWeight: "700", marginBottom: 3 }}>Expected Fees</Text>
              <Text style={{ fontSize: 20, fontWeight: "900", color: "#1C1917" }}>₹{billingStats.expected.toLocaleString('en-IN')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { flex: 1, padding: 18, flexDirection: 'row', alignItems: 'center' }]} onPress={() => router.push("/super-admin/billing" as any)}>
            <View style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <CheckCircle size={22} color="#22c55e" />
            </View>
            <View>
              <Text style={{ fontSize: 14, color: "#8A6B5D", fontWeight: "700", marginBottom: 3 }}>Collected Fees</Text>
              <Text style={{ fontSize: 20, fontWeight: "900", color: "#16a34a" }}>₹{billingStats.collected.toLocaleString('en-IN')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { flex: 1, padding: 18, flexDirection: 'row', alignItems: 'center' }]} onPress={() => router.push("/super-admin/billing" as any)}>
            <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <AlertCircle size={22} color="#ef4444" />
            </View>
            <View>
              <Text style={{ fontSize: 14, color: "#8A6B5D", fontWeight: "700", marginBottom: 3 }}>Pending Fees</Text>
              <Text style={{ fontSize: 20, fontWeight: "900", color: "#dc2626" }}>₹{billingStats.pending.toLocaleString('en-IN')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* LEAVE STATS ROW */}
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: 16 }}>
          <TouchableOpacity style={[styles.card, { flex: 1, padding: 18, flexDirection: 'row', alignItems: 'center' }]} onPress={() => router.push("/super-admin/leaves" as any)}>
            <View style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <Clock size={22} color="#eab308" />
            </View>
            <View>
              <Text style={{ fontSize: 14, color: "#8A6B5D", fontWeight: "700", marginBottom: 3 }}>Pending Leaves</Text>
              <Text style={{ fontSize: 20, fontWeight: "900", color: "#ca8a04" }}>{leaveStats.totalPendingRequests}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { flex: 1, padding: 18, flexDirection: 'row', alignItems: 'center' }]} onPress={() => router.push("/super-admin/leaves" as any)}>
            <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <User size={22} color="#3b82f6" />
            </View>
            <View>
              <Text style={{ fontSize: 14, color: "#8A6B5D", fontWeight: "700", marginBottom: 3 }}>On Leave Today</Text>
              <Text style={{ fontSize: 20, fontWeight: "900", color: "#2563eb" }}>{leaveStats.teachersOnLeaveToday}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { flex: 1, padding: 18, flexDirection: 'row', alignItems: 'center' }]} onPress={() => router.push("/super-admin/leaves" as any)}>
            <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <CircleX size={22} color="#ef4444" />
            </View>
            <View>
              <Text style={{ fontSize: 14, color: "#8A6B5D", fontWeight: "700", marginBottom: 3 }}>Rejected Leaves</Text>
              <Text style={{ fontSize: 20, fontWeight: "900", color: "#dc2626" }}>{leaveStats.totalRejectedLeaves}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* BOTTOM ROW: DONUT CHART (LEFT) & RECENT NOTICES (RIGHT) */}
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: 20 }}>
          
          {/* DEMOGRAPHICS DONUT CHART */}
          <View style={[styles.card, { flex: 1, padding: isMobile ? 16 : 24 }]}>
            <View style={styles.cardHeaderFlex}>
              <View>
                <Text style={styles.cardTitle}>Student Demographics</Text>
                <Text style={styles.cardSubtitle}>Total student breakdown</Text>
              </View>
            </View>
            
            <View style={{ height: chartHeight, position: "relative", alignItems: 'center', justifyContent: 'center', shadowColor: "#E35336", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5, marginTop: 10 }}>
              <Svg width="100%" height={chartHeight} viewBox={`0 0 200 ${chartHeight}`}>
                <G rotation="-90" origin={`${cx}, ${cy}`}>
                  <Circle cx={cx} cy={cy} r={radius} stroke="#F5E6DF" strokeWidth={strokeWidth} fill="transparent" />
                  <Circle cx={cx} cy={cy} r={radius} stroke="#F4A460" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={`${maleDash} ${circumference}`} strokeLinecap="round" />
                  <Circle cx={cx} cy={cy} r={radius} stroke="#E35336" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={`${femaleDash} ${circumference}`} strokeDashoffset={-maleDash} strokeLinecap="round" />
                </G>
                <SvgText x={cx} y={cy - 4} fontSize="22" fontWeight="900" fill="#5C2E14" textAnchor="middle" alignmentBaseline="middle">{studentCount}</SvgText>
                <SvgText x={cx} y={cy + 14} fontSize="11" fontWeight="700" fill="#8A6B5D" textAnchor="middle" alignmentBaseline="middle">Students</SvgText>
              </Svg>
            </View>

            <View style={{ flexDirection: "row", justifyContent: 'center', gap: 16, marginTop: 24 }}>
              <View style={[styles.chartTab, { backgroundColor: 'rgba(244, 164, 96, 0.1)', borderColor: 'rgba(244, 164, 96, 0.3)' }]}>
                <Text style={[styles.chartTabText, { color: '#F4A460' }]}>Male: {genderData.malePercentage || 0}%</Text>
              </View>
              <View style={[styles.chartTab, { backgroundColor: 'rgba(227, 83, 54, 0.1)', borderColor: 'rgba(227, 83, 54, 0.3)' }]}>
                <Text style={[styles.chartTabText, { color: '#E35336' }]}>Female: {genderData.femalePercentage || 0}%</Text>
              </View>
            </View>
          </View>

          {/* RECENT NOTICES */}
          <View style={[styles.card, { flex: 1, padding: isMobile ? 16 : 24 }]}>
            <View style={styles.cardHeaderFlex}>
              <View>
                <Text style={styles.cardTitle}>Recent Notices</Text>
                <Text style={styles.cardSubtitle}>Latest school announcements</Text>
              </View>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(227, 83, 54, 0.1)' }]}>
                <Bell size={18} color="#E35336" />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              {recentNotices.length === 0 ? (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 16 }}>
                  <Text style={{ color: '#8A6B5D', fontSize: 12 }}>No recent notices found.</Text>
                </View>
              ) : (
                recentNotices.map((notice, index) => (
                  <View key={notice.id} style={{ marginBottom: 14, borderBottomWidth: index === recentNotices.length - 1 ? 0 : 1, borderBottomColor: '#F5E6DF', paddingBottom: index === recentNotices.length - 1 ? 0 : 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Megaphone size={12} color="#E35336" style={{ marginRight: 6 }} />
                      <Text style={{ fontSize: 13, fontWeight: '800', color: '#5C2E14', flex: 1 }}>{notice.noticeName}</Text>
                      <Text style={{ fontSize: 10, color: '#A0522D', fontWeight: '700', backgroundColor: 'rgba(244, 164, 96, 0.2)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 }}>{notice.noticeType}</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: '#8A6B5D', marginBottom: 8, lineHeight: 18 }} numberOfLines={2}>{notice.noticeDescription}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Calendar size={11} color="#B8A095" style={{ marginRight: 4 }} />
                      <Text style={{ fontSize: 11, color: '#B8A095', fontWeight: '600' }}>{new Date(notice.noticeDate).toLocaleDateString()}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            <TouchableOpacity style={[styles.premiumButtonOutline, { marginTop: 'auto' }]} onPress={() => router.push("/super-admin/notices" as any)}>
              <Text style={styles.premiumButtonOutlineText}>Manage All Notices</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4EAE6", // Premium deeper beige
  },
  pageHeader: {
    marginBottom: 26,
    zIndex: 100,
    elevation: 100,
  },
  pageTitle: {
    fontWeight: "900",
    color: "#5C2E14",
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#8A6B5D",
    marginTop: 4,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24, // Very soft round edges
    shadowColor: "#8A6B5D", // Warm tinted shadow
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(230, 216, 210, 0.6)',
  },
  cardHeaderFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#5C2E14",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#A0522D",
    fontWeight: "600",
  },
  statusLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#A0522D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTabText: {
    fontSize: 12,
    fontWeight: "800",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumButton: {
    backgroundColor: '#5C2E14',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#5C2E14",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  premiumButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  premiumButtonOutline: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E6D8D2',
    marginTop: 16,
  },
  premiumButtonOutlineText: {
    color: '#E35336',
    fontWeight: '700',
    fontSize: 13,
  },
  dropdownMenu: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F5E6DF',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C2E14',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F5E6DF',
    marginVertical: 4,
  },
  downloadButton: {
    backgroundColor: '#5C2E14',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: "#5C2E14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  downloadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  }
});