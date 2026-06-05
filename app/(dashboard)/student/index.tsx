import { studentdashboardApi } from "@/app/utils/axiosInstance";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  Award,
  Bell,
  BookOpen,
  Bus,
  Calendar as CalendarIcon,
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
  User,
  Users,
  X
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "../../contexts/AuthContext";

const THEME = {
  primary: "#E35336",       
  background: "#F5F5DC",    
  secondary: "#F44460",     
  darkAccent: "#A0522D",    
  white: "#FFFFFF",
  textDark: "#2C1A14",
  textMuted: "#7A6862",
  glassBg: "rgba(255, 255, 255, 0.75)",
  present: "#22C55E",      
  absent: "#EF4444",       
  holiday: "#3B82F6"       
};

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

const urgentAlertsQueue = [
  { id: "alert-fee", text: "🚨 Fee Due Deadline: Term 2 remaining dues must be cleared by June 5th.", color: "#E35336" },
  { id: "alert-bus", text: "🚌 Route R-101 Approaching: School bus is currently 2km away from your pickup point.", color: "#A0522D" },
];

const MONTHS_LIST = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DESKTOP_BREAKPOINT = 768;
const CALENDAR_PADDING = 16;
const GRID_GAP = 6;

export default function ParentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [currentTopAlert, setCurrentTopAlert] = useState<any>(null);
  const topAlertAnim = useRef(new Animated.Value(-120)).current;

  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [classMetrics, setClassMetrics] = useState({ total: 0, male: 0, female: 0 });
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [attendanceRecordsMap, setAttendanceRecordsMap] = useState<Record<string, string>>({});
  const [apiLoading, setApiLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(("0" + (new Date().getMonth() + 1)).slice(-2));

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth > DESKTOP_BREAKPOINT;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const getCellSize = () => {
    const maxAvailableWidth = isDesktop ? 420 : windowWidth - 40;
    const totalGapsSpace = GRID_GAP * 6;
    const internalPaddingSpace = CALENDAR_PADDING * 2;
    return (maxAvailableWidth - totalGapsSpace - internalPaddingSpace) / 7;
  };

  const cellSize = getCellSize();

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

  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  const fetchDashboardData = async () => {
    try {
      setApiLoading(true);
      const studentId = user?.username || "STU2026004";

      const profileRes = await studentdashboardApi.get(`/api/student/${studentId}`);
      const profileData = profileRes.data;
      setStudentProfile(profileData);
      setImageError(false); 

      if (profileData?.classSectionId) {
        const studentsRes = await studentdashboardApi.get(`/api/student/class/${profileData.classSectionId}/students`);
        const totalStudents = studentsRes.data || [];
        
        let maleCount = 0;
        let femaleCount = 0;
        totalStudents.forEach((st: any) => {
          if (st.gender?.toLowerCase() === "male" || st.gender?.toLowerCase() === "m") maleCount++;
          if (st.gender?.toLowerCase() === "female" || st.gender?.toLowerCase() === "f") femaleCount++;
        });

        setClassMetrics({
          total: totalStudents.length,
          male: maleCount,
          female: femaleCount
        });
      }

      const attendanceRes = await studentdashboardApi.get(`/api/student/attendance/${studentId}/year/${selectedYear}`);
      setAttendanceSummary(attendanceRes.data);
      
      if (attendanceRes.data?.dailyRecords) {
        const recordsMap: Record<string, string> = {};
        attendanceRes.data.dailyRecords.forEach((rec: any) => {
          recordsMap[rec.date] = rec.status?.toLowerCase();
        });
        setAttendanceRecordsMap(recordsMap);
      }

      await fetchCalendarEventsOnly();

    } catch (err) {
      console.error("Error synchronizing backend telemetry arrays metrics:", err);
    } finally {
      setApiLoading(false);
    }
  };

  const fetchCalendarEventsOnly = async () => {
    try {
      const calendarRes = await studentdashboardApi.get(`/api/student/calender/${selectedYear}/${selectedMonth}`);
      setCalendarEvents(calendarRes.data || []);
    } catch (err) {
      console.error("Error updating isolated calendar event indices lists:", err);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchDashboardData();
    }
  }, [user, selectedYear]);

  useEffect(() => {
    fetchCalendarEventsOnly();
  }, [selectedMonth]);

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

    const frameRateInterval = 30; 
    const pixelsPerFrame = 0.65; 

    const scrollerTimer = setInterval(() => {
      if (reviewsRef.current) {
        reviewScrollX.current += pixelsPerFrame;
        if (reviewScrollX.current >= teacherReviews.length * 285) {
          reviewScrollX.current = 0;
        }
        reviewsRef.current.scrollToOffset({ offset: reviewScrollX.current, animated: false });
      }
    }, frameRateInterval);

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
    await logout();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const generateCalendarDays = () => {
    const yearNum = parseInt(selectedYear) || new Date().getFullYear();
    const monthIndex = parseInt(selectedMonth) - 1; 
    
    const startDayOfWeek = new Date(yearNum, monthIndex, 1).getDay();
    const totalDays = new Date(yearNum, monthIndex + 1, 0).getDate();
    
    const daysArray = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push(null);
    }
    
    for (let d = 1; d <= totalDays; d++) {
      const dateString = `${yearNum}-${selectedMonth}-${("0" + d).slice(-2)}`;
      daysArray.push({
        dayNumber: d,
        dateStr: dateString,
        status: attendanceRecordsMap[dateString] || "unrecorded"
      });
    }
    return daysArray;
  };

  // Uses raw backend string or constructs context paths smoothly from the dynamic axios base config
  const getProfileImageUri = () => {
    const path = studentProfile?.profileImageUrl;
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return { uri: path };
    }
    // Pull the clean active API baseURL reference from your active interceptor instance setup dynamically
    const baseDomain = studentdashboardApi.defaults.baseURL || "";
    const cleanBase = baseDomain.endsWith("/") ? baseDomain.slice(0, -1) : baseDomain;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return { uri: `${cleanBase}${cleanPath}` };
  };

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

  if (apiLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingText}>Synchronizing Academic Core Telemetry Engine...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

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

      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}>
          <Svg height="340" width={windowWidth + 100} viewBox={`0 0 ${windowWidth + 100} 340`}>
            <Path
              d={`M0 120 C ${windowWidth / 3} 60, ${(2 * windowWidth) / 3} 180, ${windowWidth + 100} 100 L ${windowWidth + 100} 0 L 0 0 Z`}
              fill="rgba(227, 83, 54, 0.05)"
            />
            <Path
              d={`M0 240 C ${windowWidth / 4} 300, ${(3 * windowWidth) / 4} 160, ${windowWidth + 100} 220 L ${windowWidth + 100} 0 L 0 0 Z`}
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
          
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Welcome, {studentProfile?.fatherName || user?.fullName || "Parent"}</Text>
              <Text style={styles.subGreeting}>Analytical updates framework monitoring</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setUserMenuVisible(true)}
              style={styles.avatarCircle}
            >
              <User size={24} color={THEME.white} />
            </TouchableOpacity>
          </Animated.View>

          {/* Metrics */}
          <View style={[styles.statsFlexContainer, isDesktop && styles.rowDirection]}>
            <Animated.View style={[styles.trackingCard, isDesktop && styles.flexThird, { opacity: fadeAnim }]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.profileImageWrapper}>
                  {studentProfile?.profileImageUrl && !imageError ? (
                    <Image 
                      source={getProfileImageUri()} 
                      style={styles.avatarImageStyle}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <View style={styles.iconContainer}>
                      <Bus size={20} color={THEME.white} />
                    </View>
                  )}
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.studentName}>{studentProfile?.fullName || "Aarav Sharma"}</Text>
                  <Text style={styles.studentClass}>
                    Grade: {studentProfile?.grade || "N/A"} - Sec: {studentProfile?.section || "N/A"} • Roll: {studentProfile?.rollNumber || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusInfoRow}>
                <View>
                  <Text style={styles.statusLabel}>Transit Tracking</Text>
                  <Text style={styles.statusValue}>On the way to school</Text>
                </View>
                <View style={styles.etaBadge}>
                  <Clock size={12} color={THEME.darkAccent} style={{ marginRight: 4 }} />
                  <Text style={styles.etaText}>12 mins away</Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View style={[styles.metricCard, isDesktop && styles.flexThird, { opacity: fadeAnim }]}>
              <View style={styles.metricHeader}>
                <CalendarIcon size={18} color={THEME.primary} />
                <Text style={styles.metricTitle}>Overall Attendance</Text>
              </View>
              <Text style={styles.metricBigText}>
                {attendanceSummary?.percentage ? `${(attendanceSummary.percentage).toFixed(1)}%` : "0.0%"}
              </Text>
              <Text style={styles.metricSubtext}>P: {attendanceSummary?.present || 0} | A: {attendanceSummary?.absent || 0}</Text>
            </Animated.View>

            <Animated.View style={[styles.metricCard, isDesktop && styles.flexThird, { opacity: fadeAnim }]}>
              <View style={styles.metricHeader}>
                <Users size={18} color={THEME.darkAccent} />
                <Text style={styles.metricTitle}>Class Metrics</Text>
              </View>
              <Text style={[styles.metricBigText, { color: THEME.darkAccent }]}>{classMetrics.total} Str</Text>
              <Text style={[styles.metricSubtext, { color: THEME.textMuted }]}>M: {classMetrics.male} | F: {classMetrics.female}</Text>
            </Animated.View>
          </View>

          {/* Dual Column Layout Matrix Splitter Panel */}
          {isDesktop ? (
            <View style={styles.desktopSplitLayoutContainer}>
              {/* Left Segment: Attendance Tracking System */}
              <View style={styles.splitLeftColumn}>
                <Text style={styles.sectionTitleSplit}>Real-time Attendance Tracker</Text>
                <View style={styles.calendarControlContainerSplit}>
                  <View style={styles.yearInputHolder}>
                    <Text style={styles.controlLabel}>Select Year:</Text>
                    <TextInput 
                      style={styles.yearTextInput}
                      value={selectedYear}
                      onChangeText={(text) => text.length === 4 && setSelectedYear(text)}
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  </View>
                  <View style={styles.monthDropdownHolder}>
                    <Text style={styles.controlLabel}>Select Month:</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={selectedMonth}
                        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                        style={styles.dropdownPicker}
                        dropdownIconColor={THEME.textDark}
                      >
                        {MONTHS_LIST.map((m) => (
                          <Picker.Item key={m.value} label={m.label} value={m.value} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>

                <View style={styles.calendarMatrixCardSplit}>
                  <View style={styles.calendarLegendRow}>
                    <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: THEME.present }]} /><Text style={styles.legendText}>Present</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: THEME.absent }]} /><Text style={styles.legendText}>Absent</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: THEME.holiday }]} /><Text style={styles.legendText}>Holiday</Text></View>
                  </View>

                  <View style={styles.weekdaysHeaderStripRow}>
                    {WEEKDAYS.map((dayName) => (
                      <Text key={dayName} style={[styles.weekdayHeaderText, { width: cellSize }]}>
                        {dayName}
                      </Text>
                    ))}
                  </View>
                  
                  <View style={styles.calendarDaysGrid}>
                    {generateCalendarDays().map((day, idx) => {
                      if (day === null) {
                        return <View key={`empty-${idx}`} style={[styles.calendarDayCellEmpty, { width: cellSize, height: cellSize }]} />;
                      }
                      let borderHighlightColor = "transparent";
                      if (day.status === "present" || day.status === "p") borderHighlightColor = THEME.present;
                      if (day.status === "absent" || day.status === "a") borderHighlightColor = THEME.absent;
                      if (day.status === "holiday" || day.status === "h") borderHighlightColor = THEME.holiday;

                      return (
                        <View 
                          key={day.dateStr} 
                          style={[
                            styles.calendarDayCell, 
                            { width: cellSize, height: cellSize },
                            borderHighlightColor !== "transparent" && { borderColor: borderHighlightColor, borderWidth: 2.5 }
                          ]}
                        >
                          <Text style={styles.dayCellText}>{day.dayNumber}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Right Segment: Scrollable Institutional Events Registry */}
              <View style={styles.splitRightColumn}>
                <Text style={styles.sectionTitleSplit}>Institutional Event Framework ({calendarEvents.length})</Text>
                <View style={styles.eventTimelineContainerSplit}>
                  <ScrollView 
                    style={styles.innerLayoutEventScrollWindow} 
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                  >
                    {calendarEvents.length === 0 ? (
                      <Text style={styles.emptyEventsText}>No institutional schedule entries logged for this sector.</Text>
                    ) : (
                      calendarEvents.map((evt: any) => (
                        <View key={evt.id} style={styles.eventTimelineCard}>
                          <View style={styles.eventTimelineRibbon} />
                          <View style={styles.eventTimelineContent}>
                            <Text style={styles.eventTitleText}>{evt.title}</Text>
                            <Text style={styles.eventDescText}>{evt.description}</Text>
                            <Text style={styles.eventDateBadgeText}>📅 {evt.date} {evt.fullDay && "• All Day Event"}</Text>
                          </View>
                        </View>
                      ))
                    )}
                  </ScrollView>
                </View>
              </View>
            </View>
          ) : (
            /* Mobile Stack Architecture Viewport */
            <View>
              <Text style={styles.sectionTitle}>Real-time Attendance Tracker</Text>
              <View style={styles.calendarControlContainer}>
                <View style={styles.yearInputHolder}>
                  <Text style={styles.controlLabel}>Select Year:</Text>
                  <TextInput 
                    style={styles.yearTextInput}
                    value={selectedYear}
                    onChangeText={(text) => text.length === 4 && setSelectedYear(text)}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
                <View style={styles.monthDropdownHolder}>
                  <Text style={styles.controlLabel}>Select Month:</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedMonth}
                      onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                      style={styles.dropdownPicker}
                      dropdownIconColor={THEME.textDark}
                    >
                      {MONTHS_LIST.map((m) => (
                        <Picker.Item key={m.value} label={m.label} value={m.value} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={styles.calendarMatrixCard}>
                <View style={styles.calendarLegendRow}>
                  <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: THEME.present }]} /><Text style={styles.legendText}>Present</Text></View>
                  <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: THEME.absent }]} /><Text style={styles.legendText}>Absent</Text></View>
                  <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: THEME.holiday }]} /><Text style={styles.legendText}>Holiday</Text></View>
                </View>

                <View style={styles.weekdaysHeaderStripRow}>
                  {WEEKDAYS.map((dayName) => (
                    <Text key={dayName} style={[styles.weekdayHeaderText, { width: cellSize }]}>
                      {dayName}
                    </Text>
                  ))}
                </View>
                
                <View style={styles.calendarDaysGrid}>
                  {generateCalendarDays().map((day, idx) => {
                    if (day === null) {
                      return <View key={`empty-${idx}`} style={[styles.calendarDayCellEmpty, { width: cellSize, height: cellSize }]} />;
                    }
                    let borderHighlightColor = "transparent";
                    if (day.status === "present" || day.status === "p") borderHighlightColor = THEME.present;
                    if (day.status === "absent" || day.status === "a") borderHighlightColor = THEME.absent;
                    if (day.status === "holiday" || day.status === "h") borderHighlightColor = THEME.holiday;

                    return (
                      <View 
                        key={day.dateStr} 
                        style={[
                          styles.calendarDayCell, 
                          { width: cellSize, height: cellSize },
                          borderHighlightColor !== "transparent" && { borderColor: borderHighlightColor, borderWidth: 2.5 }
                        ]}
                      >
                        <Text style={styles.dayCellText}>{day.dayNumber}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <Text style={styles.sectionTitle}>Institutional Event Framework ({calendarEvents.length})</Text>
              <View style={styles.eventTimelineContainer}>
                {calendarEvents.length === 0 ? (
                  <Text style={styles.emptyEventsText}>No institutional schedule entries logged for this sector.</Text>
                ) : (
                  calendarEvents.map((evt: any) => (
                    <View key={evt.id} style={styles.eventTimelineCard}>
                      <View style={styles.eventTimelineRibbon} />
                      <View style={styles.eventTimelineContent}>
                        <Text style={styles.eventTitleText}>{evt.title}</Text>
                        <Text style={styles.eventDescText}>{evt.description}</Text>
                        <Text style={styles.eventDateBadgeText}>📅 {evt.date} {evt.fullDay && "• All Day Event"}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          {/* Quick Hub Grid */}
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

          {/* Remarks Scroller */}
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

          {/* Alerts Logger Stack */}
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

      {/* Modals Popup System Panel */}
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
                  <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
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
           <TouchableOpacity style={styles.userMenuOverlay} onPress={() => setUserMenuVisible(false)} activeOpacity={1}>
             <View style={styles.userMenuContainer}>
               <Text style={styles.userMenuLabel}>Signed in as</Text>
               <Text style={styles.userName}>{user?.username}</Text>
               
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
       
               <TouchableOpacity style={[styles.menuItemRow, styles.logoutItem]} onPress={handleLogout}>
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
  container: {   flex: 1,   backgroundColor: THEME.background,  position: "relative" },
  loadingContainer: { flex: 1, backgroundColor: THEME.background, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 12, fontSize: 14, color: THEME.textDark, fontWeight: "600", textAlign: "center" },
  topFloatingAlertContainer: {  position: "absolute",  top: 25,  left: 16,  right: 16,  zIndex: 999 },
  topAlertCardBody: {  backgroundColor: THEME.white,  paddingVertical: 14,  paddingHorizontal: 16,  borderRadius: 16,  flexDirection: "row",  alignItems: "center",  borderLeftWidth: 5,  shadowColor: THEME.textDark,  shadowOffset: { width: 0, height: 8 },  shadowOpacity: 0.12,  shadowRadius: 16,  elevation: 8 },
  topAlertTextContent: {  flex: 1,  fontSize: 13,  fontWeight: "600",  color: THEME.textDark,  lineHeight: 18 },
  alertCloseMiniBtn: {  padding: 4,  marginLeft: 8 },
  fluidBackgroundContainer: {  position: "absolute",  top: 0,  left: -20,  right: 0,  zIndex: -2,  opacity: 0.85 },
  orb3DOne: {  position: "absolute",  width: 320,  height: 320,  borderRadius: 160,  backgroundColor: "rgba(227, 83, 54, 0.07)",  top: -50,  right: -40,  zIndex: -1 },
  orb3DTwo: {  position: "absolute",  width: 380,  height: 380,  borderRadius: 190,  backgroundColor: "rgba(160, 82, 45, 0.05)",  bottom: 80,  left: -100,  zIndex: -1 },
  desktopCenter: {  alignItems: "center",  justifyContent: "center" },
  mainWrapper: {  width: "100%",  paddingBottom: 40 },
  desktopWidth: {  maxWidth: 1140,  paddingHorizontal: 20 },
  header: {   flexDirection: "row",  justifyContent: "space-between",  alignItems: "center",  paddingHorizontal: 22,   paddingTop: 24,   paddingBottom: 20,   backgroundColor: THEME.white,   borderBottomLeftRadius: 28,  borderBottomRightRadius: 28,  shadowColor: THEME.darkAccent,  shadowOffset: { width: 0, height: 4 },  shadowOpacity: 0.05,  shadowRadius: 12,  elevation: 3},
  headerLeft: { flex: 1 },
  greeting: { fontSize: 24, fontWeight: "bold", color: THEME.textDark },
  subGreeting: { fontSize: 13, color: THEME.textMuted, marginTop: 4 },
  avatarCircle: {  width: 48,  height: 48,  borderRadius: 24,  backgroundColor: THEME.primary,  justifyContent: "center",  alignItems: "center" },
  statsFlexContainer: {  paddingHorizontal: 16,  marginTop: 20,  gap: 14 },
  rowDirection: {  flexDirection: "row" },
  flexThird: {  flex: 1 },
  trackingCard: {   backgroundColor: THEME.primary,   padding: 20,   borderRadius: 22,  shadowColor: THEME.primary,  shadowOffset: { width: 0, height: 6 },  shadowOpacity: 0.16,  shadowRadius: 14,  elevation: 4 },
  cardHeaderRow: { flexDirection: "row", alignItems: "center" },
  profileImageWrapper: { width: 44, height: 44, borderRadius: 14, overflow: "hidden", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.22)" },
  avatarImageStyle: { width: "100%", height: "100%", resizeMode: "cover" },
  iconContainer: {  width: 42,  height: 42,  borderRadius: 14,  backgroundColor: "transparent",  justifyContent: "center",  alignItems: "center" },
  studentName: { fontSize: 19, fontWeight: "bold", color: THEME.white },
  studentClass: { fontSize: 12, color: "#FEECE9", marginTop: 2 },
  statusDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.18)", marginVertical: 14 },
  statusInfoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusLabel: { fontSize: 11, color: "#FEECE9", textTransform: "uppercase", letterSpacing: 0.5 },
  statusValue: { fontSize: 15, fontWeight: "600", color: THEME.white, marginTop: 2 },
  etaBadge: {   flexDirection: "row",   alignItems: "center",   backgroundColor: THEME.white,   paddingHorizontal: 12,   paddingVertical: 6,   borderRadius: 14 },
  etaText: { color: THEME.darkAccent, fontSize: 12, fontWeight: "700" },
  metricCard: {  backgroundColor: THEME.white,  borderRadius: 22,  padding: 18,  justifyContent: "center",  shadowColor: THEME.darkAccent,  shadowOffset: { width: 0, height: 3 },  shadowOpacity: 0.04,  shadowRadius: 6,  elevation: 2 },
  metricHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  metricTitle: { fontSize: 13, fontWeight: "600", color: THEME.textMuted, marginLeft: 8 },
  metricBigText: { fontSize: 26, fontWeight: "800", color: THEME.textDark },
  metricSubtext: { fontSize: 12, color: "#16A34A", marginTop: 3, fontWeight: "500" },
  
  desktopSplitLayoutContainer: { flexDirection: "row", paddingHorizontal: 20, gap: 24, marginTop: 20, width: "100%" },
  splitLeftColumn: { flex: 1, maxWidth: 440 },
  splitRightColumn: { flex: 1.2 },
  sectionTitleSplit: { fontSize: 18, fontWeight: "700", color: THEME.textDark, marginBottom: 14 },
  calendarControlContainerSplit: { flexDirection: "row", gap: 12, marginBottom: 12, alignItems: "center", width: "100%" },
  calendarMatrixCardSplit: { backgroundColor: THEME.white, borderRadius: 24, padding: CALENDAR_PADDING, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 6, elevation: 1, width: "100%" },
  eventTimelineContainerSplit: { backgroundColor: THEME.white, borderRadius: 24, padding: 16, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 6, elevation: 1, height: 310, width: "100%" },
  innerLayoutEventScrollWindow: { flex: 1 },

  calendarControlContainer: { flexDirection: "row", paddingHorizontal: 20, gap: 12, marginTop: 10, alignItems: "center", width: "100%" },
  yearInputHolder: { flex: 1 },
  monthDropdownHolder: { flex: 1.5 },
  controlLabel: { fontSize: 12, fontWeight: "600", color: THEME.textDark, marginBottom: 4 },
  yearTextInput: { backgroundColor: THEME.white, height: 44, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: "rgba(44, 26, 20, 0.15)", color: THEME.textDark, fontWeight: "600" },
  pickerWrapper: { backgroundColor: THEME.white, borderRadius: 12, borderWidth: 1, borderColor: "rgba(44, 26, 20, 0.15)", overflow: "hidden", height: 44, justifyContent: "center" },
  dropdownPicker: { height: 44, color: THEME.textDark },
  calendarMatrixCard: { backgroundColor: THEME.white, marginHorizontal: 20, marginTop: 12, borderRadius: 24, padding: CALENDAR_PADDING, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 6, elevation: 1, width: "100%", maxWidth: "90%" },
  calendarLegendRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F5F5F5", paddingBottom: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: THEME.textMuted, fontWeight: "500" },
  weekdaysHeaderStripRow: { flexDirection: "row", gap: GRID_GAP, justifyContent: "flex-start", marginBottom: 8, width: "100%" },
  weekdayHeaderText: { fontSize: 11, fontWeight: "700", color: THEME.textMuted, textAlign: "center" },
  calendarDaysGrid: { flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP, justifyContent: "flex-start", width: "100%" },
  calendarDayCell: { backgroundColor: "#F9F9F6", borderRadius: 12, justifyContent: "center", alignItems: "center", borderColor: "transparent" },
  calendarDayCellEmpty: { backgroundColor: "transparent" },
  dayCellText: { fontSize: 13, fontWeight: "700", color: THEME.textDark },
  eventTimelineContainer: { paddingHorizontal: 20, gap: 10, marginTop: 4, width: "100%" },
  emptyEventsText: { fontSize: 13, color: THEME.textMuted, fontStyle: "italic", paddingVertical: 10 },
  eventTimelineCard: { backgroundColor: THEME.white, borderRadius: 16, flexDirection: "row", overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, marginBottom: 10 },
  eventTimelineRibbon: { width: 5, backgroundColor: THEME.primary },
  eventTimelineContent: { flex: 1, padding: 14 },
  eventTitleText: { fontSize: 14, fontWeight: "700", color: THEME.textDark },
  eventDescText: { fontSize: 12, color: THEME.textMuted, marginTop: 2, lineHeight: 16 },
  eventDateBadgeText: { fontSize: 11, fontWeight: "600", color: THEME.darkAccent, marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: THEME.textDark, marginHorizontal: 20, marginTop: 28, marginBottom: 14 },
  titleWithBadgeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 20 },
  liveBadge: {  flexDirection: "row",  alignItems: "center",  backgroundColor: THEME.darkAccent,  paddingHorizontal: 10,  paddingVertical: 4,  borderRadius: 10,  marginTop: 14 },
  liveBadgeText: { color: THEME.white, fontSize: 11, fontWeight: "650" },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 14 },
  menuCardWrapperMobile: { width: "50%", padding: 6 },
  menuCardWrapperDesktop: { width: "33.33%", padding: 8 },
  menuCard: {   backgroundColor: THEME.white,   padding: 18,   borderRadius: 22,  minHeight: 140,  justifyContent: "space-between",  shadowColor: THEME.darkAccent,  shadowOffset: { width: 0, height: 3 },  shadowOpacity: 0.04,  shadowRadius: 6,  elevation: 2 },
  desktopGlassActionCard: {  backgroundColor: THEME.glassBg,  borderWidth: 1,  borderColor: "rgba(255, 255, 255, 0.4)" },
  menuIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  menuTitle: { fontSize: 15, fontWeight: "700", color: THEME.textDark },
  menuDescription: { fontSize: 11, color: THEME.textMuted, marginTop: 4, lineHeight: 16 },
  carouselContainer: {  paddingLeft: 16,  marginBottom: 10,  height: 145 },
  flatListScroller: {  flexDirection: "row" },
  reviewCardItem: {  backgroundColor: THEME.white,  width: 270,  padding: 16,  borderRadius: 20,  marginRight: 15,  shadowColor: THEME.darkAccent,  shadowOpacity: 0.04,  shadowRadius: 6,  elevation: 3,  borderLeftWidth: 4,  borderLeftColor: THEME.darkAccent },
  reviewHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  reviewAuthor: { fontSize: 13, fontWeight: "700", color: THEME.textDark, flex: 1 },
  reviewTextBody: { fontSize: 12, color: THEME.textMuted, fontStyle: "italic", lineHeight: 18 },
  ratingStarsRow: { flexDirection: "row", marginTop: 10 },
  alertsSection: {   backgroundColor: THEME.white,   marginHorizontal: 20,   marginTop: 24,   padding: 20,   borderRadius: 24,  shadowColor: "#000",  shadowOffset: { width: 0, height: 2 },  shadowOpacity: 0.03,  shadowRadius: 5,  elevation: 2 },
  alertsHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  alertsTitle: { fontSize: 16, fontWeight: "700", color: THEME.textDark, marginLeft: 8 },
  alertCard: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  alertDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  alertContent: { flex: 1 },
  alertMessage: { fontSize: 13, color: THEME.textDark, lineHeight: 18 },
  criticalText: { color: THEME.secondary, fontWeight: "600" },
  alertTime: { fontSize: 11, color: THEME.textMuted, marginTop: 4 },
  modalBlurOverlay: { flex: 1, backgroundColor: "rgba(44, 26, 20, 0.48)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalGlassContainer: { width: "100%", maxWidth: 500, backgroundColor: THEME.white, borderRadius: 28, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.16, shadowRadius: 24, elevation: 10 },
  modalHeaderTopBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F5F5F5", paddingBottom: 16 },
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
  userMenuOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)", justifyContent: "flex-start", paddingTop: 80 },
  userMenuContainer: { backgroundColor: THEME.white, borderRadius: 16, padding: 16, width: 280, maxWidth: 320, alignSelf: "flex-end", marginRight: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  userMenuLabel: { fontSize: 11, color: THEME.textMuted, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 },
  userName: { fontSize: 16, fontWeight: "700", color: THEME.textDark, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  menuItemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  menuItemText: { fontSize: 14, fontWeight: "500", color: THEME.textDark },
  logoutItem: { borderTopWidth: 1, borderTopColor: "#F5F5F5", marginTop: 4, paddingTop: 12 },
  logoutText: { color: THEME.secondary, fontWeight: "600" }
});