 import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    AlertCircle,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    ShieldAlert,
    UserCheck
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

// Mock Stats Data tailored for Vice Principal
const statsData = [
  {
    title: "Staff Present",
    value: "82/85",
    icon: <UserCheck size={24} color="#E35336" />, // Terracotta
    bgColor: "rgba(227, 83, 54, 0.1)",
  },
  {
    title: "Active Classes",
    value: "32",
    icon: <BookOpen size={24} color="#2563EB" />, // Blue
    bgColor: "#EFF6FF",
  },
  {
    title: "Discipline Issues",
    value: "3",
    icon: <ShieldAlert size={24} color="#DC2626" />, // Red
    bgColor: "#FEF2F2",
  },
  {
    title: "Upcoming Exams",
    value: "2",
    icon: <FileText size={24} color="#D97706" />, // Orange/Gold
    bgColor: "#FFFBEB",
  },
];

// Quick actions mapping to Vice Principal specific routes
const quickActions = [
  {
    title: "Academics",
    icon: <BookOpen size={22} color="#5C2E14" />, // Deep Brown
    path: "/(dashboard)/vice-principal/academics/monitoring",
    bgColor: "#F5F5DC", // Beige
  },
  {
    title: "Verify Attendance",
    icon: <CheckCircle size={22} color="#16A34A" />, // Green
    path: "/(dashboard)/vice-principal/attendance/verification",
    bgColor: "#DCFCE7",
  },
  {
    title: "Discipline",
    icon: <ShieldAlert size={22} color="#E35336" />, // Terracotta
    path: "/(dashboard)/vice-principal/discipline",
    bgColor: "rgba(227, 83, 54, 0.15)",
  },
  {
    title: "Exam Supervision",
    icon: <FileText size={22} color="#2563EB" />, // Blue
    path: "/(dashboard)/vice-principal/examinations/supervision",
    bgColor: "#DBEAFE",
  },
];

// Recent Activities feed for Vice Principal
const recentActivities = [
  {
    id: 1,
    title: "Teacher Substitution Assigned",
    time: "10:30 AM",
    description: "Mr. Sharma assigned to Class X-B for Mathematics.",
    type: "academic",
  },
  {
    id: 2,
    title: "Discipline Report Filed",
    time: "Yesterday, 2:15 PM",
    description: "Warning issued to Rahul (Class IX-A) for dress code violation.",
    type: "discipline",
  },
  {
    id: 3,
    title: "Attendance Verification",
    time: "Yesterday, 9:00 AM",
    description: "Approved daily staff and student attendance logs.",
    type: "attendance",
  },
];

export default function VicePrincipalDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getIconForActivity = (type: string) => {
    switch (type) {
      case "academic":
        return <BookOpen size={18} color="#2563EB" />;
      case "discipline":
        return <AlertCircle size={18} color="#DC2626" />;
      case "attendance":
        return <UserCheck size={18} color="#16A34A" />;
      default:
        return <Calendar size={18} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" backgroundColor="#F4F7FA" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E35336" />
        }
      >
        {/* Header Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>
            Welcome back, {user?.name?.split(' ')[0] || "Vice Principal"}! 👋
          </Text>
          <Text style={styles.greetingSubtitle}>
            Here is what's happening in the campus today.
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconWrapper, { backgroundColor: stat.bgColor }]}>
                {stat.icon}
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(action.path as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBox, { backgroundColor: action.bgColor }]}>
                {action.icon}
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Activity Feed */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Activity Log</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activitiesCard}>
          {recentActivities.map((activity, index) => (
            <View 
              key={activity.id} 
              style={[
                styles.activityItem, 
                index === recentActivities.length - 1 && styles.activityItemLast 
              ]}
            >
              <View style={styles.activityIconContainer}>
                {getIconForActivity(activity.type)}
                {index !== recentActivities.length - 1 && <View style={styles.activityTimeline} />}
              </View>
              
              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitleText}>{activity.title}</Text>
                  <View style={styles.timeBadge}>
                    <Clock size={12} color="#A88D7D" />
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
                <Text style={styles.activityDesc}>{activity.description}</Text>
              </View>
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
    backgroundColor: "#F4F7FA", // Classic school theme background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  
  // GREETING
  greetingContainer: {
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#2A1308", // Deep brown
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: "#7A5A4A",
    marginTop: 4,
    fontWeight: "500",
  },

  // STATS GRID
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#5C2E14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(232, 213, 196, 0.5)",
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2A1308",
  },
  statTitle: {
    fontSize: 12,
    color: "#7A5A4A",
    fontWeight: "600",
    marginTop: 2,
  },

  // SECTION HEADERS
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#5C2E14",
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E35336", // Terracotta
  },

  // QUICK ACTIONS
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#5C2E14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(232, 213, 196, 0.5)",
  },
  actionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5C2E14",
    textAlign: "center",
  },

  // ACTIVITIES LOG
  activitiesCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#5C2E14",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(232, 213, 196, 0.5)",
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  activityItemLast: {
    marginBottom: 0,
  },
  activityIconContainer: {
    alignItems: "center",
    marginRight: 16,
    width: 24,
  },
  activityTimeline: {
    width: 2,
    flex: 1,
    backgroundColor: "#E8D5C4",
    marginTop: 8,
    marginBottom: -20, // Extends to the next item
  },
  activityContent: {
    flex: 1,
    paddingBottom: 4,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  activityTitleText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2A1308",
    flex: 1,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F5F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  activityTime: {
    fontSize: 11,
    color: "#A88D7D",
    fontWeight: "600",
  },
  activityDesc: {
    fontSize: 13,
    color: "#7A5A4A",
    lineHeight: 20,
    marginTop: 4,
  },
});
