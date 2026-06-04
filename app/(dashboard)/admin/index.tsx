import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import dashboardStats from "../../data/dashboard-stats.json";
import ChartCard from "../ChartCard";
import RecentActivities from "../RecentActivities";
import StatsCard from "../StatsCard";

const defaultStatsData = [
  { title: "Total Students", value: 1250, icon: "👨‍🎓", color: "#dbeafe" },
  { title: "Total Staff", value: 85, icon: "👩‍🏫", color: "#dcfce7" },
  { title: "Total Classes", value: 32, icon: "🏫", color: "#ffedd5" },
  { title: "Avg Attendance", value: "94%", icon: "📊", color: "#ede9fe" },
];

const defaultChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [50000, 55000, 60000, 58000, 65000, 70000],
};

const defaultActivities = [
  {
    id: 1,
    title: "New Student Admission",
    time: "10 min ago",
    description: "Rahul Kumar joined Class 5A",
  },
  {
    id: 2,
    title: "Fee Payment",
    time: "1 hour ago",
    description: "Aarav Sharma paid ₹25,000",
  },
  {
    id: 3,
    title: "Staff Leave",
    time: "Yesterday",
    description: "Mrs. Priya requested leave",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const statsData = dashboardStats?.statsData ?? defaultStatsData;
  const chartData = dashboardStats?.chartData ?? defaultChartData;
  const activities = dashboardStats?.activities ?? defaultActivities;
  const { logout } = useAuth();
  const handleLogout = async () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>Admin Dashboard</Text>
            <Text style={styles.subheading}>Welcome back, Admin</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#E35336" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statsData.map((stat, idx) => (
            <View key={idx} style={styles.statCardWrapper}>
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            </View>
          ))}
        </View>

        {/* Chart Card */}
        <ChartCard
          title="Fee Collection (Monthly)"
          data={chartData}
          type="line"
        />

        {/* Recent Activities */}
        <RecentActivities activities={activities} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#FDE8E3",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
});
