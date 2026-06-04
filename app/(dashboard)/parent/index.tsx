import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  Award,
  Bell,
  BookOpen,
  Bus,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Info,
  LogOut,
  MapPin,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingUp,
  User,
  X
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G, Path } from "react-native-svg";
import { useAuth } from "../../contexts/AuthContext";

const THEME = {
  primary: "#E35336",       // Burnt Sienna Main
  background: "#F5F5DC",    // Beige Tint Base
  secondary: "#F44460",     // Pastel Salmon Accent
  darkAccent: "#A0522D",    // Deep Sienna Brown
  white: "#FFFFFF",
  textDark: "#2C1A14",
  textMuted: "#7A6862",
  glassBg: "rgba(255, 255, 255, 0.75)",
};

const activeStudent = {
  name: "Aarav Sharma",
  class: "Grade 4 - B",
  rollNo: "24",
  attendanceRate: "94%",
  busStatus: "On the way to school",
  eta: "12 mins away",
  academicPerf: "Grade A+",
  pendingAssignments: "2 Homeworks",
};

const monthlyAttendanceData = [
  { month: "Jan", rate: 92 },
  { month: "Feb", rate: 95 },
  { month: "Mar", rate: 88 },
  { month: "Apr", rate: 94 },
  { month: "May", rate: 96 },
];

const teacherReviews = [
  { id: "1", author: "Mrs. Priya Nair (Class Teacher)", text: "Aarav is showing great focus in analytical maths experiments.", rating: 5 },
  { id: "2", author: "Mr. David (Sports Coach)", text: "Excellent team spirit displayed during the annual football practice sessions.", rating: 5 },
  { id: "3", author: "Dr. Ramesh (Science Dept)", text: "Very curious nature; actively participates in live science laboratory setups.", rating: 4 },
  { id: "4", author: "Miss Kavitha (English Dept)", text: "Creative vocabulary expansion skills. Active in classic prose reviews.", rating: 5 },
  { id: "5", author: "Mr. Joseph (Arts Instructor)", text: "Outstanding abstract charcoal landscape works completed this week.", rating: 4 },
];

const recentNotifications = [
  { id: 1, text: "School Bus R-101 has departed from Main Gate.", time: "5 min ago", critical: false },
  { id: 2, text: "Fees pending for Q2 Academic Term Assessment Cycles.", time: "2 hrs ago", critical: true },
  { id: 3, text: "Parent-Teacher Convention scheduled for next second Saturday.", time: "1 day ago", critical: false },
  { id: 4, text: "Science Expo registrations closing by tomorrow evening.", time: "2 days ago", critical: true },
];

// In-App Urgent Floating Sliders Queue Data
const urgentAlertsQueue = [
  { id: "alert-fee", text: "🚨 Fee Due Deadline: Term 2 remaining dues must be cleared by June 5th.", color: "#E35336" },
  { id: "alert-bus", text: "🚌 Route R-101 Approaching: School bus is currently 2km away from your pickup point.", color: "#A0522D" },
];

export default function ParentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  // In-App System Alerts Overlay Engine States
  const [currentTopAlert, setCurrentTopAlert] = useState<any>(null);
  const topAlertAnim = useRef(new Animated.Value(-120)).current;

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  // Linear Micro-scrolling System configuration for flatList
  const reviewsRef = useRef<FlatList>(null);
  const reviewScrollX = useRef(0);

  const quickActions = [
    {
      title: "Live Bus Tracking",
      icon: <MapPin size={24} color={THEME.primary} />,
      description: "Track your child's school bus",
      onPress: () => router.push("/(dashboard)/parent/transport/bus-tracking"),
      bgColor: "#FCEFEA", 
    },
    {
      title: "Attendance & Leaves",
      icon: <CheckCircle2 size={24} color={THEME.darkAccent} />,
      description: "Apply leave & view logs",
      onPress: () => router.push("/(dashboard)/parent/attendance/attendence"),
      bgColor: "#F3ECE7",
    },
    {
      title: "Fee Payments",
      icon: <CreditCard size={24} color={THEME.secondary} />,
      description: "Pay online & download bills",
      onPress: () => router.push("/(dashboard)/parent/fees/payment"),
      bgColor: "#FDF0F1",
    },
    {
      title: "Report Cards",
      icon: <Award size={24} color={THEME.primary} />,
      description: "Check academic results",
      onPress: () => router.push("/(dashboard)/parent/examination/report-card"),
      bgColor: "#FCEFEA",
    },
    {
      title: "Homework Diary",
      icon: <BookOpen size={24} color={THEME.darkAccent} />,
      description: "Daily school task schedules",
      onPress: () => router.push("/(dashboard)/parent/homework/homework"),
      bgColor: "#F3ECE7",
    },
    {
      title: "Emergency Contact",
      icon: <ShieldAlert size={24} color={THEME.secondary} />,
      description: "Direct line to administration",
      onPress: () => router.push("/(dashboard)/parent/communication/alerts"),
      bgColor: "#FDF0F1",
    },
  ];

  // Animation Framework Configurations
  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 14000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();

    // Pure Linear Soft Scroll Matrix for Feedback Loop Cards
    const frameRateInterval = 30; 
    const pixelsPerFrame = 0.65; 

  
    const scrollerTimer = setInterval(() => {
      if (reviewsRef.current) {
        reviewScrollX.current += pixelsPerFrame;
        // Total data array dynamic width offset limits checker
        if (reviewScrollX.current >= teacherReviews.length * 285) {
          reviewScrollX.current = 0;
        }
        reviewsRef.current.scrollToOffset({ offset: reviewScrollX.current, animated: false });
      }
    }, frameRateInterval);

    // Sequence Queue Processor for Bottom-To-Top Screen Status Ingress Notifications
    const alertTimer1 = setTimeout(() => triggerSystemTopAlert(urgentAlertsQueue[0]), 1500);
    const alertTimer2 = setTimeout(() => triggerSystemTopAlert(urgentAlertsQueue[1]), 8500);

    return () => {
      clearInterval(scrollerTimer);
      clearTimeout(alertTimer1);
      clearTimeout(alertTimer2);
    };
  }, []);

  const triggerSystemTopAlert = (alertObj: any) => {
    setCurrentTopAlert(alertObj);
    Animated.sequence([
      Animated.timing(topAlertAnim, {
        toValue: 14, 
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.delay(4500),
      Animated.timing(topAlertAnim, {
        toValue: -140,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentTopAlert(null);
    });
  };

  const handleActionPress = (item: any) => {
    if (isDesktop) {
      setSelectedAction(item);
      setModalVisible(true);
    } else {
      item.onPress();
    }
  };
  const handleLogout = async () => {
    // Call your logout service
    router.replace("/(public)/home");
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Parallax calculations transformations
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [30, 0, -80],
    extrapolate: "clamp",
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [-20, 0, 50],
    extrapolate: "clamp",
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-15, 20, -15],
  });

  // Pie chart computations mappings (75% Syllabus Complete metric context illustration)
  const pieRadius = 50;
  const circumference = 2 * Math.PI * pieRadius;
  const syllabusPercentage = 78;
  const strokeDashoffset = circumference - (syllabusPercentage / 100) * circumference;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Dynamic Floating Ingress Alerts Panel System */}
      {currentTopAlert && (
        <Animated.View style={[styles.topFloatingAlertContainer, { transform: [{ translateY: topAlertAnim }] }]}>
          <View style={[styles.topAlertCardBody, { borderLeftColor: currentTopAlert.color }]}>
            <Info size={20} color={currentTopAlert.color} style={{ marginRight: 12 }} />
            <Text style={styles.topAlertTextContent} numberOfLines={2}>{currentTopAlert.text}</Text>
            <TouchableOpacity onPress={() => Animated.timing(topAlertAnim, { toValue: -140, duration: 250, useNativeDriver: true }).start()} style={styles.alertCloseMiniBtn}>
              <X size={16} color={THEME.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* SVG Fluid Arcs Background Vectors Layer */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}>
          <Svg height="340" width={width + 100} viewBox={`0 0 ${width + 100} 340`}>
            <Path
              d={`M0 120 C ${width / 3} 60, ${(2 * width) / 3} 180, ${width + 100} 100 L ${width + 100} 0 L 0 0 Z`}
              fill="rgba(227, 83, 54, 0.05)"
            />
            <Path
              d={`M0 240 C ${width / 4} 300, ${(3 * width) / 4} 160, ${width + 100} 220 L ${width + 100} 0 L 0 0 Z`}
              fill="rgba(160, 82, 45, 0.04)"
            />
          </Svg>
        </Animated.View>
      </View>

      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} />
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }],
          { useNativeDriver: true }
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={isDesktop ? styles.desktopCenter : null}
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          
          {/* Dashboard Profile Branding Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Welcome, {user?.name || "Parent"}</Text>
              <Text style={styles.subGreeting}>Analytical updates framework monitoring</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setUserMenuVisible(true)}
              style={styles.avatarCircle}
            >
              <User size={24} color={THEME.white} />
            </TouchableOpacity>
          </Animated.View>

          {/* Core Telemetry Metrics Row Structure */}
          <View style={[styles.statsFlexContainer, isDesktop && styles.rowDirection]}>
            
            <Animated.View style={[styles.trackingCard, isDesktop && styles.flexThird, { opacity: fadeAnim }]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconContainer}>
                  <Bus size={20} color={THEME.white} />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.studentName}>{activeStudent.name}</Text>
                  <Text style={styles.studentClass}>{activeStudent.class} • Roll: {activeStudent.rollNo}</Text>
                </View>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusInfoRow}>
                <View>
                  <Text style={styles.statusLabel}>Transit Tracking</Text>
                  <Text style={styles.statusValue}>{activeStudent.busStatus}</Text>
                </View>
                <View style={styles.etaBadge}>
                  <Clock size={12} color={THEME.darkAccent} style={{ marginRight: 4 }} />
                  <Text style={styles.etaText}>{activeStudent.eta}</Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View style={[styles.metricCard, isDesktop && styles.flexThird, { opacity: fadeAnim }]}>
              <View style={styles.metricHeader}>
                <Calendar size={18} color={THEME.primary} />
                <Text style={styles.metricTitle}>Overall Attendance</Text>
              </View>
              <Text style={styles.metricBigText}>{activeStudent.attendanceRate}</Text>
              <Text style={styles.metricSubtext}>Consistency rate highly stable</Text>
            </Animated.View>

            <Animated.View style={[styles.metricCard, isDesktop && styles.flexThird, { opacity: fadeAnim }]}>
              <View style={styles.metricHeader}>
                <TrendingUp size={18} color={THEME.darkAccent} />
                <Text style={styles.metricTitle}>Academic Index</Text>
              </View>
              <Text style={[styles.metricBigText, { color: THEME.darkAccent }]}>{activeStudent.academicPerf}</Text>
              <Text style={[styles.metricSubtext, { color: THEME.textMuted }]}>{activeStudent.pendingAssignments} pending</Text>
            </Animated.View>

          </View>

          {/* Desktop-Only Charts Analytics Matrix Section: Dual Representation Layout */}
          {isDesktop && (
            <View style={styles.dualChartRowContainer}>
              
              {/* Left Bar Columns Array Structure */}
              <View style={[styles.chartBoxWrapper, { flex: 1.4 }]}>
                <Text style={styles.chartTitleHeading}>Month-wise Attendance Velocity</Text>
                <View style={styles.barChartWrapper}>
                  {monthlyAttendanceData.map((data, idx) => (
                    <View key={idx} style={styles.barColumn}>
                      <View style={styles.barContainerStyle}>
                        <View style={[styles.barFillMetric, { height: `${data.rate}%` }]}>
                          <Text style={styles.barPercentLabel}>{data.rate}%</Text>
                        </View>
                      </View>
                      <Text style={styles.barMonthText}>{data.month}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Right Side Complex Radial Vector SVG Pie Metrics Canvas */}
              <View style={[styles.chartBoxWrapper, { flex: 1, alignItems: "center" }]}>
                <Text style={[styles.chartTitleHeading, { alignSelf: "flex-start" }]}>Syllabus Tracking Curve</Text>
                <View style={styles.pieCanvasHolder}>
                  <Svg height="130" width="130" viewBox="0 0 120 120">
                    <G rotate="-90" origin="60, 60">
                      <Circle cx="60" cy="60" r={pieRadius} stroke="#F3ECE7" strokeWidth="10" fill="transparent" />
                      <Circle
                        cx="60"
                        cy="60"
                        r={pieRadius}
                        stroke={THEME.primary}
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </G>
                  </Svg>
                  <View style={styles.pieAbsoluteCenterLabels}>
                    <Text style={styles.pieCenterBigText}>{syllabusPercentage}%</Text>
                    <Text style={styles.pieCenterSubText}>Complete</Text>
                  </View>
                </View>
                <Text style={styles.radialFooterIndicatorText}>Current Academic term timeline syllabus progression</Text>
              </View>

            </View>
          )}

          {/* Quick Hub Adaptive Module Routing Grid */}
          <Text style={styles.sectionTitle}>Quick Hub</Text>
          <View style={styles.gridContainer}>
            {quickActions.map((item, index) => (
              <Animated.View
                key={index}
                style={[isDesktop ? styles.menuCardWrapperDesktop : styles.menuCardWrapperMobile]}
              >
                <TouchableOpacity 
                  style={[styles.menuCard, isDesktop && styles.desktopGlassActionCard]} 
                  onPress={() => handleActionPress(item)} 
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.bgColor }]}>{item.icon}</View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription} numberOfLines={2}>{item.description}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Linear Non-snapping Horizontal Feed Panel */}
          <View style={styles.titleWithBadgeRow}>
            <Text style={styles.sectionTitle}>Real-time Teacher Remarks Feed</Text>
            <View style={styles.liveBadge}>
              <Sparkles size={12} color={THEME.white} style={{ marginRight: 4 }} />
              <Text style={styles.liveBadgeText}>Auto-Sync</Text>
            </View>
          </View>
          <View style={styles.carouselContainer}>
            <FlatList
              ref={reviewsRef}
              data={teacherReviews}
              horizontal
              scrollEnabled={true} 
              style={styles.flatListScroller}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              removeClippedSubviews={false}
              renderItem={({ item }) => (
                <View style={styles.reviewCardItem}>
                  <View style={styles.reviewHeaderRow}>
                    <MessageSquare size={16} color={THEME.primary} />
                    <Text style={styles.reviewAuthor} numberOfLines={1}>{item.author}</Text>
                  </View>
                  <Text style={styles.reviewTextBody}>"{item.text}"</Text>
                  <View style={styles.ratingStarsRow}>
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={12} color="#FBBF24" fill="#FBBF24" style={{ marginRight: 2 }} />
                    ))}
                  </View>
                </View>
              )}
            />
          </View>

          {/* Extended Operational Logs & Updates Stack */}
          <Animated.View style={[styles.alertsSection, { opacity: fadeAnim, marginBottom: isDesktop ? 0 : 42 }]}>
            <View style={styles.alertsHeader}>
              <Bell size={20} color={THEME.textDark} />
              <Text style={styles.alertsTitle}>Recent Updates Framework ({recentNotifications.length} logs)</Text>
            </View>
            {recentNotifications.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                {alert.critical ? (
                  <AlertCircle size={18} color={THEME.secondary} style={{ marginRight: 12 }} />
                ) : (
                  <View style={[styles.alertDot, { backgroundColor: THEME.primary }]} />
                )}
                <View style={styles.alertContent}>
                  <Text style={[styles.alertMessage, alert.critical && styles.criticalText]}>
                    {alert.text}
                  </Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
            ))}
          </Animated.View>

        </View>
      </Animated.ScrollView>

      {/* Desktop Modal Window Hub Popups Panel Overlay */}
      {selectedAction && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBlurOverlay}>
            <View style={styles.modalGlassContainer}>
              <View style={styles.modalHeaderTopBar}>
                <View style={styles.modalTitleCluster}>
                  <View style={styles.modalIconBackdrop}>{selectedAction.icon}</View>
                  <Text style={styles.modalMainHeading}>{selectedAction.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                  <X size={20} color={THEME.textDark} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContentCore}>
                <Text style={styles.modalDescriptionBody}>{selectedAction.description}</Text>
                
                <View style={styles.modalDataBox}>
                  <Text style={styles.dataBoxHeader}>Active Gateway Sync Status</Text>
                  <View style={styles.dataSyncRow}>
                    <Check size={16} color="#16A34A" />
                    <Text style={styles.dataSyncText}>Secure campus servers link connected.</Text>
                  </View>
                </View>

                <View style={styles.modalActionButtonsGrid}>
                  <TouchableOpacity 
                    style={styles.modalCancelBtn} 
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelBtnText}>Dismiss</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalSubmitBtn} 
                    onPress={() => {
                      setModalVisible(false);
                      selectedAction.onPress();
                    }}
                  >
                    <Text style={styles.submitBtnText}>Proceed to Module</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {userMenuVisible && (
         <Modal
           animationType="fade"
           transparent={true}
           visible={userMenuVisible}
           onRequestClose={() => setUserMenuVisible(false)}
         >
           <TouchableOpacity 
             style={styles.userMenuOverlay}
             onPress={() => setUserMenuVisible(false)}
             activeOpacity={1}
           >
             <View style={styles.userMenuContainer}>
               <Text style={styles.userMenuLabel}>Signed in as</Text>
               <Text style={styles.userName}>{user?.name}</Text>
               
               <TouchableOpacity 
                 style={styles.menuItemRow}
                 onPress={() => {
                   router.push("/(dashboard)/parent/profile/profile");
                   setUserMenuVisible(false);
                 }}
               >
                 <User size={18} color={THEME.textDark} />
                 <Text style={styles.menuItemText}>Profile Settings</Text>
               </TouchableOpacity>
       
               {/*<TouchableOpacity 
                 style={styles.menuItemRow}
                 onPress={() => {
                   router.push("/(auth)/parent/change-password");
                   setUserMenuVisible(false);
                 }}
               >
                 <Lock size={18} color={THEME.textDark} />
                 <Text style={styles.menuItemText}>Change Password</Text>
               </TouchableOpacity>*/}
       
               <TouchableOpacity 
                 style={[styles.menuItemRow, styles.logoutItem]}
                 onPress={handleLogout}
               >
                 <LogOut size={18} color={THEME.secondary} />
                 <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
               </TouchableOpacity>
             </View>
           </TouchableOpacity>
         </Modal>
       )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {   flex: 1,   backgroundColor: THEME.background,  position: "relative",},
  topFloatingAlertContainer: {  position: "absolute",  top: 25,  left: 16,  right: 16,  zIndex: 999,},
  topAlertCardBody: {  backgroundColor: THEME.white,  paddingVertical: 14,  paddingHorizontal: 16,  borderRadius: 16,  flexDirection: "row",  alignItems: "center",  borderLeftWidth: 5,  shadowColor: THEME.textDark,  shadowOffset: { width: 0, height: 8 },  shadowOpacity: 0.12,  shadowRadius: 16,  elevation: 8,},
  topAlertTextContent: {  flex: 1,  fontSize: 13,  fontWeight: "600",  color: THEME.textDark,  lineHeight: 18,},
  alertCloseMiniBtn: {  padding: 4,  marginLeft: 8,},
  fluidBackgroundContainer: {  position: "absolute",  top: 0,  left: -20,  right: 0,  zIndex: -2,  opacity: 0.85,},
  orb3DOne: {  position: "absolute",  width: 320,  height: 320,  borderRadius: 160,  backgroundColor: "rgba(227, 83, 54, 0.07)",  top: -50,  right: -40,  zIndex: -1,},
  orb3DTwo: {  position: "absolute",  width: 380,  height: 380,  borderRadius: 190,  backgroundColor: "rgba(160, 82, 45, 0.05)",  bottom: 80,  left: -100,  zIndex: -1,},
  desktopCenter: {  alignItems: "center",  justifyContent: "center",},
  mainWrapper: {  width: "100%",  paddingBottom: 40,},
  desktopWidth: {  maxWidth: 1140,  paddingHorizontal: 20,},
  header: {   flexDirection: "row",  justifyContent: "space-between",  alignItems: "center",  paddingHorizontal: 22,   paddingTop: 24,   paddingBottom: 20,   backgroundColor: THEME.white,   borderBottomLeftRadius: 28,  borderBottomRightRadius: 28,  shadowColor: THEME.darkAccent,  shadowOffset: { width: 0, height: 4 },  shadowOpacity: 0.05,  shadowRadius: 12,  elevation: 3},
  headerLeft: { flex: 1 },
  greeting: { fontSize: 24, fontWeight: "bold", color: THEME.textDark },
  subGreeting: { fontSize: 13, color: THEME.textMuted, marginTop: 4 },
  avatarCircle: {  width: 48,  height: 48,  borderRadius: 24,  backgroundColor: THEME.primary,  justifyContent: "center",  alignItems: "center",},
  statsFlexContainer: {  paddingHorizontal: 16,  marginTop: 20,  gap: 14,},
  rowDirection: {  flexDirection: "row",},
  flexThird: {  flex: 1,},
  trackingCard: {   backgroundColor: THEME.primary,   padding: 20,   borderRadius: 22,  shadowColor: THEME.primary,  shadowOffset: { width: 0, height: 6 },  shadowOpacity: 0.16,  shadowRadius: 14,  elevation: 4,},
  cardHeaderRow: { flexDirection: "row", alignItems: "center" },
  iconContainer: {  width: 42,  height: 42,  borderRadius: 14,  backgroundColor: "rgba(255,255,255,0.22)",  justifyContent: "center",  alignItems: "center",},
  studentName: { fontSize: 19, fontWeight: "bold", color: THEME.white },
  studentClass: { fontSize: 12, color: "#FEECE9", marginTop: 2 },
  statusDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.18)", marginVertical: 14 },
  statusInfoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusLabel: { fontSize: 11, color: "#FEECE9", textTransform: "uppercase", letterSpacing: 0.5 },
  statusValue: { fontSize: 15, fontWeight: "600", color: THEME.white, marginTop: 2 },
  etaBadge: {   flexDirection: "row",   alignItems: "center",   backgroundColor: THEME.white,   paddingHorizontal: 12,   paddingVertical: 6,   borderRadius: 14 },
  etaText: { color: THEME.darkAccent, fontSize: 12, fontWeight: "700" },
  metricCard: {  backgroundColor: THEME.white,  borderRadius: 22,  padding: 18,  justifyContent: "center",  shadowColor: THEME.darkAccent,  shadowOffset: { width: 0, height: 3 },  shadowOpacity: 0.04,  shadowRadius: 6,  elevation: 2,},
  metricHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  metricTitle: { fontSize: 13, fontWeight: "600", color: THEME.textMuted, marginLeft: 8 },
  metricBigText: { fontSize: 30, fontWeight: "800", color: THEME.textDark },
  metricSubtext: { fontSize: 12, color: "#16A34A", marginTop: 3, fontWeight: "500" },
  dualChartRowContainer: {  flexDirection: "row",  marginHorizontal: 16,  marginTop: 24,  gap: 16,},
  chartBoxWrapper: {  backgroundColor: THEME.white,  padding: 20,  borderRadius: 24,  shadowColor: "#000",  shadowOpacity: 0.03,  shadowRadius: 6,  elevation: 2,},
  chartTitleHeading: {  fontSize: 14,  fontWeight: "700",  color: THEME.textDark,  marginBottom: 4,},
  barChartWrapper: {  flexDirection: "row",  justifyContent: "space-around",  alignItems: "flex-end",  height: 140,  paddingTop: 10,},
  barColumn: {  alignItems: "center",  flex: 1,},
  barContainerStyle: {  height: 95,  width: 28,  backgroundColor: "#F3ECE7",  borderRadius: 6,  justifyContent: "flex-end",  overflow: "hidden",},
  barFillMetric: {  width: "100%",  backgroundColor: THEME.primary,  borderRadius: 6,  alignItems: "center",  justifyContent: "flex-start",  paddingTop: 4,},
  barPercentLabel: {  fontSize: 8,  color: THEME.white,  fontWeight: "bold",},
  barMonthText: {  marginTop: 8,  fontSize: 11,  fontWeight: "600",  color: THEME.textDark,},
  pieCanvasHolder: {  position: "relative",  justifyContent: "center",  alignItems: "center",  marginTop: 10,  height: 120,  width: 120,},
  pieAbsoluteCenterLabels: {  position: "absolute",  justifyContent: "center",  alignItems: "center",},
  pieCenterBigText: {  fontSize: 20,  fontWeight: "800",  color: THEME.textDark,},
  pieCenterSubText: {  fontSize: 10,  color: THEME.textMuted,  fontWeight: "500",},
  radialFooterIndicatorText: {  fontSize: 11,  color: THEME.textMuted,  textAlign: "center",  marginTop: 12,  lineHeight: 15,},
  sectionTitle: { fontSize: 18, fontWeight: "700", color: THEME.textDark, marginHorizontal: 20, marginTop: 28, marginBottom: 14 },
  titleWithBadgeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 20 },
  liveBadge: {  flexDirection: "row",  alignItems: "center",  backgroundColor: THEME.darkAccent,  paddingHorizontal: 10,  paddingVertical: 4,  borderRadius: 10,  marginTop: 14,},
  liveBadgeText: { color: THEME.white, fontSize: 11, fontWeight: "650" },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 14 },
  menuCardWrapperMobile: { width: "50%", padding: 6 },
  menuCardWrapperDesktop: { width: "33.33%", padding: 8 },
  menuCard: {   backgroundColor: THEME.white,   padding: 18,   borderRadius: 22,  minHeight: 140,  justifyContent: "space-between",  shadowColor: THEME.darkAccent,  shadowOffset: { width: 0, height: 3 },  shadowOpacity: 0.04,  shadowRadius: 6,  elevation: 2,},
  desktopGlassActionCard: {  backgroundColor: THEME.glassBg,  borderWidth: 1,  borderColor: "rgba(255, 255, 255, 0.4)",},
  menuIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  menuTitle: { fontSize: 15, fontWeight: "700", color: THEME.textDark },
  menuDescription: { fontSize: 11, color: THEME.textMuted, marginTop: 4, lineHeight: 16 },
  carouselContainer: {  paddingLeft: 16,  marginBottom: 10,  height: 145,},
  flatListScroller: {  flexDirection: "row",},
  reviewCardItem: {  backgroundColor: THEME.white,  width: 270,  padding: 16,  borderRadius: 20,  marginRight: 15,  shadowColor: THEME.darkAccent,  shadowOpacity: 0.04,  shadowRadius: 6,  elevation: 3,  borderLeftWidth: 4,  borderLeftColor: THEME.darkAccent,},
  reviewHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  reviewAuthor: { fontSize: 13, fontWeight: "700", color: THEME.textDark, flex: 1 },
  reviewTextBody: { fontSize: 12, color: THEME.textMuted, fontStyle: "italic", lineHeight: 18 },
  ratingStarsRow: { flexDirection: "row", marginTop: 10 },
  alertsSection: {   backgroundColor: THEME.white,   marginHorizontal: 20,   marginTop: 24,   padding: 20,   borderRadius: 24,  shadowColor: "#000",  shadowOffset: { width: 0, height: 2 },  shadowOpacity: 0.03,  shadowRadius: 5,  elevation: 2,},
  alertsHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  alertsTitle: { fontSize: 16, fontWeight: "700", color: THEME.textDark, marginLeft: 8 },
  alertCard: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  alertDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  alertContent: { flex: 1 },
  alertMessage: { fontSize: 13, color: THEME.textDark, lineHeight: 18 },
  criticalText: { color: THEME.secondary, fontWeight: "600" },
  alertTime: { fontSize: 11, color: THEME.textMuted, marginTop: 4 },
  modalBlurOverlay: { flex: 1, backgroundColor: "rgba(44, 26, 20, 0.48)", justifyContent: "center", alignItems: "center", padding: 24, },
  modalGlassContainer: { width: "100%", maxWidth: 500, backgroundColor: THEME.white, borderRadius: 28, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.16, shadowRadius: 24, elevation: 10, },
  modalHeaderTopBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F5F5F5", paddingBottom: 16, },
  modalTitleCluster: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalIconBackdrop: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#FCEFEA", justifyContent: "center", alignItems: "center" },
  modalMainHeading: { fontSize: 18, fontWeight: "700", color: THEME.textDark },
  closeModalButton: { padding: 6, borderRadius: 8, backgroundColor: "#F5F5F5" },
  modalContentCore: { marginTop: 18 },
  modalDescriptionBody: { fontSize: 14, color: THEME.textMuted, lineHeight: 22 },
  modalDataBox: { backgroundColor: "#F5F5DC", padding: 14, borderRadius: 14, marginTop: 16 },
  dataBoxHeader: { fontSize: 12, fontWeight: "700", color: THEME.darkAccent, textTransform: "uppercase", marginBottom: 6 },
  dataSyncRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dataSyncText: { fontSize: 13, color: THEME.textDark },
  modalActionButtonsGrid: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 24 },
  modalCancelBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, backgroundColor: "#F5F5F5" },
  cancelBtnText: { color: THEME.textMuted, fontWeight: "600", fontSize: 14 },
  modalSubmitBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, backgroundColor: THEME.primary },
  submitBtnText: { color: THEME.white, fontWeight: "600", fontSize: 14 },
  userMenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  userMenuContainer: {
    backgroundColor: THEME.white,
    borderRadius: 16,
    padding: 16,
    width: 280,
    maxWidth: 320,
    alignSelf: "flex-end",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  userMenuLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.textDark,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: THEME.textDark,
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    marginTop: 4,
    paddingTop: 12,
  },
  logoutText: {
    color: THEME.secondary,
    fontWeight: "600",
  },
});