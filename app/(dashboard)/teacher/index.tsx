import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    BookOpen,
    Calendar,
    CalendarCheck,
    ClipboardCheck,
    ClipboardEdit,
    GraduationCap,
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

const isWeb = Platform.OS === "web";

const COLORS = {
  bgWhite: "#FFFFFF",
  darkBg: "#2A1308", // Deep Brown
  cardDark: "#3E1F0D", // Slightly lighter brown for cards
  cardLight: "#FFFCF8", // Soft off-white for cards on white bg
  accent: "#F4A460", // Sandy Orange
  primary: "#E35336", // Terracotta
  textSecondary: "#A0522D", // Sienna
  textPrimary: "#5C2E14", // Dark Brown
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
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

  // Responsive Grid Logic - Clamped to 1200px max width to match scrollContent
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const numColumns = isDesktop ? 4 : isTablet ? 3 : 2;

  // Calculate exact card width based on container boundaries, making it safe for BOTH Web and Android
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

      {/* --- TOP HEADER NAVIGATION --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.teacherName}>Sarah Jenkins</Text>
        </View>
        <TouchableOpacity style={styles.profileAvatar} activeOpacity={0.8}>
          <Text style={styles.avatarText}>SJ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- WELCOME BANNER --- */}
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
                  // Platform-specific wrapper styles
                  Platform.select({
                    android: {
                      minHeight: 140,
                    },
                    web: {
                      // No additional wrapper styling needed for web
                    },
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

        {/* --- RECENT ACTIVITY LIST (Placeholder for future expansion) --- */}
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
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
    ...Platform.select({
      web: { userSelect: "none" }, // Prevents ugly text highlighting on Web
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
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.textPrimary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0px 8px 12px rgba(92, 46, 20, 0.15)", // Premium smooth web shadow
      },
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
    gap: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
  },
  statNumber: {
    color: COLORS.white,
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
    alignItems: "flex-start", // Important: prevents cards from stretching to same height
  },
  moduleCard: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 20,
    // Remove height: "100%" to prevent stretching on Android
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        height: "100%", // Keep height:100% only for web where it works well
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
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
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
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
