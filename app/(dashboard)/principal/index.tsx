import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    Calendar,
    ClipboardList,
    FileText,
    GraduationCap,
    MessageSquare,
    School,
    TrendingUp,
    UserCheck,
    Users,
} from "lucide-react-native";
import { useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";

// Mock data for principal dashboard
const statsData = [
  {
    title: "Total Students",
    value: 1250,
    icon: <GraduationCap size={24} color="#2563eb" />,
    color: "#dbeafe",
  },
  {
    title: "Total Staff",
    value: 85,
    icon: <Users size={24} color="#16a34a" />,
    color: "#dcfce7",
  },
  {
    title: "Present Today",
    value: "94%",
    icon: <UserCheck size={24} color="#ea580c" />,
    color: "#ffedd5",
  },
  {
    title: "Avg Performance",
    value: "87%",
    icon: <TrendingUp size={24} color="#7c3aed" />,
    color: "#ede9fe",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "Staff Meeting",
    time: "10:00 AM",
    description: "Monthly staff meeting scheduled",
  },
  {
    id: 2,
    title: "Exam Results",
    time: "Yesterday",
    description: "Mid-term results published",
  },
  {
    id: 3,
    title: "Parent Meeting",
    time: "2 days ago",
    description: "PTA meeting held successfully",
  },
];

const quickActions = [
  {
    title: "Attendance",
    icon: <UserCheck size={22} color="#2563eb" />,
    onPress: () => {},
    bgColor: "#dbeafe",
  },
  {
    title: "Exam Results",
    icon: <FileText size={22} color="#16a34a" />,
    onPress: () => {},
    bgColor: "#dcfce7",
  },
  {
    title: "Staff Leave",
    icon: <Calendar size={22} color="#ea580c" />,
    onPress: () => {},
    bgColor: "#ffedd5",
  },
  {
    title: "Reports",
    icon: <ClipboardList size={22} color="#7c3aed" />,
    onPress: () => {},
    bgColor: "#ede9fe",
  },
  {
    title: "Communication",
    icon: <MessageSquare size={22} color="#0891b2" />,
    onPress: () => {},
    bgColor: "#cffafe",
  },
  {
    title: "Discipline",
    icon: <School size={22} color="#dc2626" />,
    onPress: () => {},
    bgColor: "#fee2e2",
  },
];

export default function PrincipalDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.name || "Principal"}!
          </Text>
          <Text style={styles.subGreeting}>Welcome to your dashboard</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {statsData.map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: stat.color }]}
            >
              <View style={styles.statIcon}>{stat.icon}</View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: action.bgColor }]}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              {action.icon}
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesCard}>
          <Text style={styles.activitiesTitle}>Recent Activities</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View>
                <Text style={styles.activityTitleText}>{activity.title}</Text>
                <Text style={styles.activityDesc}>{activity.description}</Text>
              </View>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subGreeting: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  statTitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  actionCard: {
    width: "31%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginTop: 8,
  },
  activitiesCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
  },
  activitiesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityTitleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  activityDesc: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: "#9ca3af",
  },
});
