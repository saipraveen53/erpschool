import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  BookOpen,
  Calendar,
  CalendarCheck,
  ClipboardCheck,
  ClipboardEdit,
  GraduationCap,
  LogOut,
  MessageSquare,
  PieChart,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext"; // Import your AuthContext

const isWeb = Platform.OS === "web";

const COLORS = {
  // Theme palette (Burnt Sienna, Sandy Brown, Yellow)
  primary: "#E35336", // Burnt Sienna
  accent: "#F5F50C", // Bright Yellow
  secondary: "#F4A460", // Sandy Brown

  // Derived shades
  primaryLight: "#FDE8E3",
  primaryDark: "#C73E21",
  secondaryLight: "#FEF0E8",
  accentLight: "#FEFCE8",

  bgWhite: "#FFFFFF",
  darkBg: "#2A1308", // Deep Brown
  cardDark: "#3E1F0D",
  cardLight: "#FFFCF8",
  textSecondary: "#8B5E3C", // Sienna
  textPrimary: "#5C2E14", // Dark Brown
  white: "#FFFFFF",
  lightGray: "#F8F9FA",
  border: "#F0E4D8",
  shadowLight: "#E8D5C4",
};

// Map the modules directly to the folder structure provided
const teacherModules = [
  {
    title: "Attendance",
    route: "/teacher/attendance",
    icon: ClipboardCheck,
    desc: "Mark & view history",
  },
  {
    title: "Timetable",
    route: "/teacher/timetable",
    icon: Calendar,
    desc: "View daily schedule",
  },
  {
    title: "Homework",
    route: "/teacher/homework",
    icon: BookOpen,
    desc: "Assign & upload work",
  },
  {
    title: "Lesson Plan",
    route: "/teacher/lesson-plan",
    icon: ClipboardEdit,
    desc: "Manage curriculum",
  },
  {
    title: "Examination",
    route: "/teacher/examination",
    icon: GraduationCap,
    desc: "Grades & marks entry",
  },
  {
    title: "Communication",
    route: "/teacher/communication",
    icon: MessageSquare,
    desc: "Notices & parents",
  },
  {
    title: "Leave",
    route: "/teacher/leave",
    icon: CalendarCheck,
    desc: "Apply & track leaves",
  },
  {
    title: "Reports",
    route: "/teacher/reports",
    icon: PieChart,
    desc: "Student performance",
  },
];

export default function TeacherDashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { logout } = useAuth();

  // Responsive Grid Logic
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const numColumns = isDesktop ? 4 : isTablet ? 3 : 2;
  const containerWidth = Math.min(width, 1200);
  const cardWidth = (containerWidth - 48 - (numColumns - 1) * 16) / numColumns;

  // Staggered Entrance Animation
  const fadeAnims = useRef(
    teacherModules.map(() => new Animated.Value(0)),
  ).current;
  const slideAnims = useRef(
    teacherModules.map(() => new Animated.Value(20)),
  ).current;

  useEffect(() => {
    Animated.stagger(
      100,
      fadeAnims.map((anim, index) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnims[index], {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
  }, []);

  // Logout handler – clears token and redirects to root page
  const handleLogout = async () => {
    await logout();
  };

  // Quick Stats Data
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* --- TOP HEADER NAVIGATION with Logout Button --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.teacherName}>Sarah Jenkins</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.profileAvatar} activeOpacity={0.8}>
            <Text style={styles.avatarText}>SJ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- WELCOME BANNER (enhanced with theme colors) --- */}
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerDate}>{today}</Text>
          <Text style={styles.bannerTitle}>Your Teaching Dashboard</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Classes Today</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Pending Assignments</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>86%</Text>
              <Text style={styles.statLabel}>Avg. Attendance</Text>
            </View>
          </View>
        </View>

        {/* --- MODULES GRID --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={styles.gridContainer}>
          {teacherModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Animated.View
                key={index}
                style={[
                  {
                    opacity: fadeAnims[index],
                    transform: [{ translateY: slideAnims[index] }],
                    width: cardWidth,
                    marginBottom: 16,
                  },
                  Platform.select({
                    android: { minHeight: 140 },
                    web: {},
                  }),
                ]}
              >
                <TouchableOpacity
                  style={styles.moduleCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(module.route as any)}
                >
                  <View style={styles.iconContainer}>
                    <Icon size={28} color={COLORS.primary} />
                  </View>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleDesc}>{module.desc}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* --- UPCOMING CLASSES (enhanced) --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Classes</Text>
        </View>
        <View style={styles.activityCard}>
          <View style={styles.activityRow}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeText}>09:00 AM</Text>
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activitySubject}>
                Mathematics - Grade 10A
              </Text>
              <Text style={styles.activityRoom}>Room 204</Text>
            </View>
          </View>
          <View
            style={[
              styles.activityRow,
              { borderBottomWidth: 0, paddingBottom: 0 },
            ]}
          >
            <View style={styles.timeBlock}>
              <Text style={styles.timeText}>11:30 AM</Text>
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activitySubject}>
                Physics Lab - Grade 11B
              </Text>
              <Text style={styles.activityRoom}>Science Block</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      web: { userSelect: "none" },
    }),
  },
  greetingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  teacherName: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  bannerContainer: {
    backgroundColor: COLORS.darkBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.textPrimary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      web: { boxShadow: "0px 8px 12px rgba(92, 46, 20, 0.15)" },
    }),
  },
  bannerDate: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(244, 164, 96, 0.15)", // sandy brown with opacity
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  statNumber: {
    color: COLORS.secondary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.cardLight,
    fontSize: 12,
    fontWeight: "500",
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
    alignItems: "flex-start",
  },
  moduleCard: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      web: {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  moduleDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  activityCard: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      web: { boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)" },
    }),
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  timeBlock: {
    width: 80,
    borderRightWidth: 2,
    borderRightColor: COLORS.primary,
    paddingRight: 12,
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  activityDetails: {
    flex: 1,
  },
  activitySubject: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  activityRoom: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
