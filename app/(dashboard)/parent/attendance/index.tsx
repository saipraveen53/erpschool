import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  Award,
  Calendar,
  Clock,
  Filter,
  Info,
  Sparkles,
  X
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
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
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G, Path } from "react-native-svg";


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

const studentProfile = {
  name: "Aarav Sharma",
  classSection: "Grade 4 - B",
  rollNo: "24",
  academicYear: "2025 - 2026",
  photoUri: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80"
};

const attendanceSummary = {
  workingDays: 220,
  presentDays: 205,
  absentDays: 10,
  lateDays: 5,
  leaveDays: 3,
  percentage: 93,
  consecutiveStreak: 18,
  warningLimit: 85, // Threshold triggers below 85%
};

const filterOptions = ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "Custom Date Range"];

const monthlyTrends = [
  { month: "Jan", rate: 92, absent: 8 },
  { month: "Feb", rate: 95, absent: 5 },
  { month: "Mar", rate: 88, absent: 12 },
  { month: "Apr", rate: 94, absent: 6 },
  { month: "May", rate: 96, absent: 4 },
];

const simulatedHistoricalLogs = [
  { id: "1", date: "May 28, 2026", status: "Present (Late Arrival)", badgeColor: "#D97706" },
  { id: "2", date: "May 27, 2026", status: "Present", badgeColor: "#16A34A" },
  { id: "3", date: "May 26, 2026", status: "Absent (Medical Leave)", badgeColor: "#F44460" },
];

const mockDetailedAttendance = {
  date: "May 28, 2026",
  status: "Present (Late Arrival)",
  checkIn: "08:12 AM",
  checkOut: "03:45 PM",
  busBoarding: "07:35 AM",
  lateMinutes: "12 mins",
  remarks: "Aarav missed the first morning assembly bell but caught up quickly in class tests.",
  leaveReason: "N/A (Delayed due to heavy rain junction block traffic)"
};

const urgentAlertsQueue = [
  { id: "alert-warn", text: "⚠️ Mandatory Notice: Aggregate attendance parameter compliance benchmark check running.", color: "#E35336" },
  { id: "alert-sync", text: "🔄 Ledger Synchronized: Mid-Term attendance analytics logs verified by Class Tutor.", color: "#A0522D" },
];

export default function AttendanceAnalyticsDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Monthly");

  // Floating Status Ticker Overlay Engine States
  const [currentTopAlert, setCurrentTopAlert] = useState<any>(null);
  const topAlertAnim = useRef(new Animated.Value(-120)).current;

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  // Soft Auto-scroll setup parameters for historical mini log feed cards
  const scrollerRef = useRef<FlatList>(null);
  const horizontalScrollOffset = useRef(0);

  // 3D Matrix & Background Parallax Layer Transform Systems
  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start();

    // Constant 3D fluid movement cycle logic
    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 14000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();

    // Pure Soft Micro-Scrolling Engine configuration
    const loopInterval = 35;
    const scrollStepStep = 0.5;
    const tickerTimer = setInterval(() => {
      if (scrollerRef.current) {
        horizontalScrollOffset.current += scrollStepStep;
        if (horizontalScrollOffset.current >= simulatedHistoricalLogs.length * 240) {
          horizontalScrollOffset.current = 0;
        }
        scrollerRef.current.scrollToOffset({ offset: horizontalScrollOffset.current, animated: false });
      }
    }, loopInterval);

    // Initial load prompt trigger sequential items logs inside queue frame 
    const initialAlertTimer = setTimeout(() => triggerTopIngressNotice(urgentAlertsQueue[0]), 1200);
    const secondaryAlertTimer = setTimeout(() => triggerTopIngressNotice(urgentAlertsQueue[1]), 9000);

    return () => {
      clearInterval(tickerTimer);
      clearTimeout(initialAlertTimer);
      clearTimeout(secondaryAlertTimer);
    };
  }, []);

  const triggerTopIngressNotice = (alertObj: any) => {
    setCurrentTopAlert(alertObj);
    Animated.sequence([
      Animated.timing(topAlertAnim, {
        toValue: 14,
        duration: 550,
        easing: Easing.out(Easing.back(1.05)),
        useNativeDriver: true,
      }),
      Animated.delay(4800),
      Animated.timing(topAlertAnim, {
        toValue: -140,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start(() => setCurrentTopAlert(null));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Parallax transformations
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [35, 0, -75],
    extrapolate: "clamp",
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [-25, 0, 60],
    extrapolate: "clamp",
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-25, 20, -25],
  });

  // Pie chart variables configuration matrix vectors bounds calculation 
  const radius = 45;
  const perimeterCircumference = 2 * Math.PI * radius;
  const complianceWeightRatio = 88; // Target indicator performance scale representation
  const targetStrokeOffsetVal = perimeterCircumference - (complianceWeightRatio / 100) * perimeterCircumference;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Floating System Overlay Notifier Element */}
      {currentTopAlert && (
        <Animated.View style={[styles.topFloatingAlertContainer, { transform: [{ translateY: topAlertAnim }] }]}>
          <View style={[styles.topAlertCardBody, { borderLeftColor: currentTopAlert.color }]}>
            <Info size={18} color={currentTopAlert.color} style={{ marginRight: 10 }} />
            <Text style={styles.topAlertTextContent} numberOfLines={2}>{currentTopAlert.text}</Text>
            <TouchableOpacity onPress={() => Animated.timing(topAlertAnim, { toValue: -140, duration: 200, useNativeDriver: true }).start()} style={styles.alertCloseMiniBtn}>
              <X size={14} color={THEME.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Background Curved Wave Arcs Layout Vector Canvas */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}>
          <Svg height="340" width={width + 100} viewBox={`0 0 ${width + 100} 340`}>
            <Path
              d={`M0 130 C ${width / 3} 70, ${(2 * width) / 3} 190, ${width + 100} 110 L ${width + 100} 0 L 0 0 Z`}
              fill="rgba(227, 83, 54, 0.05)"
            />
            <Path
              d={`M0 250 C ${width / 4} 310, ${(3 * width) / 4} 170, ${width + 100} 230 L ${width + 100} 0 L 0 0 Z`}
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
          
          {/* 1. Page Header Section Module Frame */}
          <Animated.View style={[styles.profileHeaderBox, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.profileMainLayoutRow}>
              
              <View style={styles.profileImageContainerBackdrop}>
                <Image source={{ uri: studentProfile.photoUri }} style={styles.studentAvatarPhotoSpec} />
                <View style={styles.onlineStatusBadgeDot} />
              </View>

              <View style={styles.profileIdentityDetailsBlock}>
                <Text style={styles.identityTitleHeading}>{studentProfile.name}</Text>
                <Text style={styles.identityMetaSubtext}>
                  {studentProfile.classSection}  •  <Text style={{ fontWeight: "700" }}>Roll #{studentProfile.rollNo}</Text>
                </Text>
                <Text style={styles.identityAcademicYearValue}>Academic Horizon: {studentProfile.academicYear}</Text>
              </View>

              {/* Attendance Summary Circular Percent Badge Layout */}
              <View style={styles.headerRadialMetricsGroup}>
                <Svg height="82" width="82" viewBox="0 0 90 90">
                  <G rotate="-90" origin="45, 45">
                    <Circle cx="45" cy="45" r="38" stroke="#F3ECE7" strokeWidth="6" fill="transparent" />
                    <Circle
                      cx="45"
                      cy="45"
                      r="38"
                      stroke={THEME.primary}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 38}
                      strokeDashoffset={(2 * Math.PI * 38) * (1 - attendanceSummary.percentage / 100)}
                      strokeLinecap="round"
                    />
                  </G>
                </Svg>
                <View style={styles.radialCenterAbsoluteLabelsCluster}>
                  <Text style={styles.radialCenterBigNumber}>{attendanceSummary.percentage}%</Text>
                </View>
              </View>

            </View>

            {/* Attendance Summary Breakup Badges Subrow */}
            <View style={styles.summaryBadgesInlineRow}>
              <View style={[styles.summaryBadgeChip, { backgroundColor: "#E7F9EE" }]}>
                <Text style={[styles.summaryBadgeChipText, { color: "#16A34A" }]}>{attendanceSummary.presentDays} Present Days</Text>
              </View>
              <View style={[styles.summaryBadgeChip, { backgroundColor: "#FDF0F1" }]}>
                <Text style={[styles.summaryBadgeChipText, { color: THEME.secondary }]}>{attendanceSummary.absentDays} Absent Days</Text>
              </View>
              <View style={[styles.summaryBadgeChip, { backgroundColor: "#FEF7EE" }]}>
                <Text style={[styles.summaryBadgeChipText, { color: "#D97706" }]}>{attendanceSummary.lateDays} Late Arrivals</Text>
              </View>
              <View style={[styles.summaryBadgeChip, { backgroundColor: "#F3ECE7" }]}>
                <Text style={[styles.summaryBadgeChipText, { color: THEME.darkAccent }]}>{attendanceSummary.leaveDays} Leave Days</Text>
              </View>
            </View>
          </Animated.View>

          {/* Conditional Legal Warning Bar Ticker */}
          {attendanceSummary.percentage > attendanceSummary.warningLimit && (
            <View style={styles.warningAlertBannerWrapper}>
              <AlertTriangle size={18} color={THEME.white} style={{ marginRight: 10 }} />
              <Text style={styles.warningAlertBannerTextContent}>
                System Alert Warning: Institutional aggregate tracking parameter threshold standard metrics nominal.
              </Text>
            </View>
          )}

          {/* 7. Attendance Filter Context Horizontal Command Switcher Bar */}
          <View style={styles.filterBarLayoutContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerContent}>
              <View style={styles.filterBarLeadIconHolder}>
                <Filter size={14} color={THEME.darkAccent} />
              </View>
              {filterOptions.map((filterItem, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.filterSelectionTabChip, selectedFilter === filterItem && styles.activeSelectionTabChip]}
                  onPress={() => setSelectedFilter(filterItem)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterTabChipTextText, selectedFilter === filterItem && styles.activeTabChipTextText]}>
                    {filterItem}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Attendance Overview Cards Segment Block Row Mapping Grid */}
          <Text style={styles.sectionHeadingTitle}>Attendance Overview Cards</Text>
          <View style={styles.telemetryCardsWrapperGrid}>
            
            <View style={[styles.telemetryCardUnit, isDesktop && styles.desktopThirdWidthBlock]}>
              <Text style={styles.telemetryUnitLabel}>Total Working Days</Text>
              <Text style={styles.telemetryUnitMainNumber}>{attendanceSummary.workingDays} Days</Text>
              <Text style={styles.telemetryUnitFooterSubtext}>Aggregated academic catalog logs</Text>
            </View>

            <View style={[styles.telemetryCardUnit, isDesktop && styles.desktopThirdWidthBlock]}>
              <Text style={styles.telemetryUnitLabel}>Consecutive Present Streak</Text>
              <View style={styles.streakCountRowFlexBox}>
                <Text style={[styles.telemetryUnitMainNumber, { color: "#16A34A" }]}>{attendanceSummary.consecutiveStreak} Days</Text>
                <Award size={18} color="#16A34A" style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.telemetryUnitFooterSubtext}>Active sequence baseline run pace</Text>
            </View>

            <View style={[styles.telemetryCardUnit, isDesktop && styles.desktopThirdWidthBlock]}>
              <Text style={styles.telemetryUnitLabel}>Attendance Percentage</Text>
              <Text style={[styles.telemetryUnitMainNumber, { color: THEME.primary }]}>{attendanceSummary.percentage}% Index</Text>
              <Text style={styles.telemetryUnitFooterSubtext}>Institutional quota standard safe zone</Text>
            </View>

          </View>

          {/* 5 & 6 Dual Split Analytical Chart Canvas Blocks Framework (Desktop Inline / Stacked Mobile) */}
          {isDesktop && (
            <View style={styles.analyticsDualChartsRowLayoutContainer}>
              
              {/* Left Side Container: 5. Monthly Attendance Percentage Progression Chart Matrix */}
              <View style={[styles.chartBoxWrapperCardPanel, { flex: 1.35 }]}>
                <Text style={styles.chartPanelTitleHeading}>5. Monthly Attendance Percentage Chart</Text>
                <Text style={styles.chartPanelSubheadingMutedDescription}>Monthly trend tracking parameters evaluated against historical terms baseline matrix</Text>
                
                <View style={styles.barChartCanvasHolderRow}>
                  {monthlyTrends.map((trendData, index) => (
                    <View key={index} style={styles.barMetricColumnStack}>
                      
                      <View style={styles.barStructureDoubleTrackHolder}>
                        {/* Present rate fill column bar */}
                        <View style={[styles.barFillColumnTrack, { height: `${trendData.rate}%`, backgroundColor: THEME.primary }]}>
                          <Text style={styles.barInlineValueMarkerText}>{trendData.rate}%</Text>
                        </View>
                      </View>

                      <Text style={styles.barAxisMonthLabelText}>{trendData.month}</Text>
                    </View>
                  ))}
                </View>

                {/* Simulated Average Attendance Threshold Anchor Line vector overlay marker */}
                <View style={styles.chartOverlayTargetThresholdAnchorRow}>
                  <Text style={styles.thresholdAnchorLabelText}>Average Attendance Line Benchmark Threshold (92.5%)</Text>
                  <View style={styles.dashedVectorLineDividerGraphic} />
                </View>
              </View>

              {/* Right Side Container: 6. Yearly Attendance Analytics Progression Canvas */}
              <View style={[styles.chartBoxWrapperCardPanel, { flex: 1 }]}>
                <Text style={styles.chartPanelTitleHeading}>6. Yearly Attendance Analytics Performance</Text>
                <Text style={styles.chartPanelSubheadingMutedDescription}>Historical benchmark evaluation index tracking matrix</Text>
                
                <View style={styles.yearlyHistoryComparisonBoxGroup}>
                  <View style={styles.yearlyComparisonDataRowLineItem}>
                    <Text style={styles.yearlyCompareLabelText}>Current Term Frame (2025-26)</Text>
                    <Text style={styles.yearlyCompareValueText}>93% Stability</Text>
                  </View>
                  <View style={styles.yearlyComparisonDataRowLineItem}>
                    <Text style={styles.yearlyCompareLabelText}>Previous Term Frame (2024-25)</Text>
                    <Text style={styles.yearlyCompareValueText}>90% Stability</Text>
                  </View>
                </View>

                <View style={styles.chartCanvasHorizontalInternalDividerLine} />
                
                <View style={styles.bestLowestExtremeHighlightsBox}>
                  <Text style={styles.extremeHighlightRowLabelText}>🌟 Best Attendance Month: <Text style={styles.extremePrimaryBoldHighlightText}>May (96%)</Text></Text>
                  <Text style={styles.extremeHighlightRowLabelText}>⚠️ Lowest Attendance Month: <Text style={styles.extremeDarkAccentBoldHighlightText}>March (88%)</Text></Text>
                </View>
              </View>

            </View>
          )}

          {/* Interactive Detailed Daily Attendance Registry Trigger Header */}
          <View style={styles.titleWithActionBtnRowLayout}>
            <Text style={styles.sectionHeadingTitle}>Detailed Ledger Registry Records Logs</Text>
            <TouchableOpacity style={styles.triggerAuditPopupModalBtn} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
              <Text style={styles.triggerBtnLabelTextContentText}>Inspect Latest Log Popup Window</Text>
              <Sparkles size={14} color={THEME.primary} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* Soft Scrolling FlatList Mini Micro Ledger Cards Feed */}
          <View style={styles.softScrollerContainerFrameHolder}>
            <FlatList
              ref={scrollerRef}
              data={simulatedHistoricalLogs}
              horizontal
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              removeClippedSubviews={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.softScrollerCardItemUnit} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
                  <View style={styles.scrollerCardHeaderTopRow}>
                    <Calendar size={14} color={THEME.primary} />
                    <Text style={styles.scrollerCardDateText}>{item.date}</Text>
                  </View>
                  <View style={[styles.scrollerCardStatusIndicatorBadge, { backgroundColor: item.badgeColor + "20" }]}>
                    <View style={[styles.badgeIndicatorCircleDotMarker, { backgroundColor: item.badgeColor }]} />
                    <Text style={[styles.badgeIndicatorLabelTextText, { color: item.badgeColor }]}>{item.status}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

        </View>
      </Animated.ScrollView>

      {/* Detailed Daily Attendance Popup Modal Window Component View */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBlurOverlayPanelContainer}>
          <View style={styles.modalGlassCardContainerBody}>
            
            <View style={styles.modalHeaderTopBarWrapperLineRow}>
              <View style={styles.modalHeaderTitleClusterGroup}>
                <Clock size={20} color={THEME.primary} />
                <Text style={styles.modalHeaderMainHeadingTitleText}>Detailed Daily Attendance Popup Audit</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalCrossActionBtn}>
                <X size={18} color={THEME.textDark} />
              </TouchableOpacity>
            </View>

            {/* Core Data Points Fields List Mapping Stack */}
            <View style={styles.modalContentCoreContainerStack}>
              
              <View style={styles.modalDataRowLineItemUnit}>
                <Text style={styles.dataFieldMetaLabelText}>Audit Log Target Date:</Text>
                <Text style={styles.dataFieldValueContentText}>{mockDetailedAttendance.date}</Text>
              </View>

              <View style={styles.modalDataRowLineItemUnit}>
                <Text style={styles.dataFieldMetaLabelText}>Compliance Status Index:</Text>
                <Text style={[styles.dataFieldValueContentText, { color: THEME.primary, fontWeight: "700" }]}>
                  {mockDetailedAttendance.status}
                </Text>
              </View>

              <View style={styles.modalSplitDataFieldsRowGroupInline}>
                <View style={styles.splitFieldColumnHalfUnit}>
                  <Text style={styles.dataFieldMetaLabelText}>Check-In Time:</Text>
                  <Text style={styles.dataFieldValueContentText}>{mockDetailedAttendance.checkIn}</Text>
                </View>
                <View style={styles.splitFieldColumnHalfUnit}>
                  <Text style={styles.dataFieldMetaLabelText}>Check-Out Time:</Text>
                  <Text style={styles.dataFieldValueContentText}>{mockDetailedAttendance.checkOut}</Text>
                </View>
              </View>

              <View style={styles.modalDataRowLineItemUnit}>
                <Text style={styles.dataFieldMetaLabelText}>Bus Boarding Sync Time Stamp:</Text>
                <Text style={styles.dataFieldValueContentText}>{mockDetailedAttendance.busBoarding}</Text>
              </View>

              <View style={styles.modalDataRowLineItemUnit}>
                <Text style={styles.dataFieldMetaLabelText}>Late Minutes Register Duration:</Text>
                <Text style={[styles.dataFieldValueContentText, { color: THEME.secondary }]}>{mockDetailedAttendance.lateMinutes}</Text>
              </View>

              <View style={styles.modalTutorRemarksBlockBox}>
                <Text style={styles.remarksBoxBlockHeaderLabelText}> Tutors Observation & Remarks</Text>
                <Text style={styles.remarksBoxParagraphBodyText}>"{mockDetailedAttendance.remarks}"</Text>
              </View>

              <View style={[styles.modalDataRowLineItemUnit, { borderBottomWidth: 0, marginTop: 10 }]}>
                <Text style={styles.dataFieldMetaLabelText}>Leave Reason Allocation Parameter:</Text>
                <Text style={styles.dataFieldValueContentText} numberOfLines={2}>{mockDetailedAttendance.leaveReason}</Text>
              </View>

              <TouchableOpacity 
                style={styles.modalDismissCallActionFullWidthWidthBtn} 
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalDismissBtnLabelTextContent}>Dismiss Telemetry Audit Window</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.background,
    position: "relative",
  },
  topFloatingAlertContainer: {
    position: "absolute",
    top:  25,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  topAlertCardBody: {
    backgroundColor: THEME.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 5,
    shadowColor: THEME.textDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  topAlertTextContent: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: THEME.textDark,
    lineHeight: 18,
  },
  alertCloseMiniBtn: {
    padding: 4,
    marginLeft: 8,
  },
  fluidBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: -20,
    right: 0,
    zIndex: -2,
    opacity: 0.85,
  },
  orb3DOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(227, 83, 54, 0.07)",
    top: 140,
    right: -50,
    zIndex: -1,
  },
  orb3DTwo: {
    position: "absolute",
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: "rgba(160, 82, 45, 0.05)",
    bottom: 60,
    left: -110,
    zIndex: -1,
  },
  desktopCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  mainWrapper: {
    width: "100%",
    paddingBottom: 40,
  },
  desktopWidth: {
    maxWidth: 1140,
    paddingHorizontal: 20,
  },
  profileHeaderBox: {
    backgroundColor: THEME.white,
    padding: 22,
    borderRadius: 26,
    marginHorizontal: 16,
    marginTop: 22,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  profileMainLayoutRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainerBackdrop: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: "#F3ECE7",
    position: "relative",
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  studentAvatarPhotoSpec: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  onlineStatusBadgeDot: {
    position: "absolute",
    bottom: -3,
    right: -3,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#16A34A",
    borderWidth: 2.5,
    borderColor: THEME.white,
  },
  profileIdentityDetailsBlock: {
    marginLeft: 16,
    flex: 1,
  },
  identityTitleHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  identityMetaSubtext: {
    fontSize: 14,
    color: THEME.textMuted,
    fontWeight: "500",
    marginTop: 3,
  },
  identityAcademicYearValue: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: "600",
    marginTop: 5,
  },
  headerRadialMetricsGroup: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  radialCenterAbsoluteLabelsCluster: {
    position: "absolute",
  },
  radialCenterBigNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.textDark,
  },
  summaryBadgesInlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 16,
  },
  summaryBadgeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  summaryBadgeChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  warningAlertBannerWrapper: {
    backgroundColor: THEME.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 14,
  },
  warningAlertBannerTextContent: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  filterBarLayoutContainer: {
    marginTop: 24,
    paddingLeft: 16,
  },
  filterScrollViewInnerContent: {
    alignItems: "center",
    gap: 8,
    paddingRight: 24,
  },
  filterBarLeadIconHolder: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  filterSelectionTabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: THEME.white,
  },
  activeSelectionTabChip: {
    backgroundColor: THEME.primary,
  },
  filterTabChipTextText: {
    color: THEME.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabChipTextText: {
    color: THEME.white,
  },
  sectionHeadingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.textDark,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 14,
  },
  telemetryCardsWrapperGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
  },
  telemetryCardUnit: {
    width: "100%",
    backgroundColor: THEME.white,
    padding: 18,
    borderRadius: 22,
    marginBottom: 12,
    marginHorizontal: 4,
    flex: 1,
    minWidth: 260,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  desktopThirdWidthBlock: {
    width: "31.33%",
  },
  telemetryUnitLabel: {
    fontSize: 13,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  telemetryUnitMainNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: THEME.textDark,
    marginTop: 6,
  },
  streakCountRowFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  telemetryUnitFooterSubtext: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 6,
  },
  analyticsDualChartsRowLayoutContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    gap: 16,
  },
  chartBoxWrapperCardPanel: {
    backgroundColor: THEME.white,
    padding: 22,
    borderRadius: 26,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  chartPanelTitleHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.textDark,
  },
  chartPanelSubheadingMutedDescription: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
    marginBottom: 14,
  },
  barChartCanvasHolderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 135,
    paddingTop: 10,
  },
  barMetricColumnStack: {
    alignItems: "center",
    flex: 1,
  },
  barStructureDoubleTrackHolder: {
    height: 90,
    width: 28,
    backgroundColor: "#F3ECE7",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFillColumnTrack: {
    width: "100%",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  barInlineValueMarkerText: {
    fontSize: 8,
    color: THEME.white,
    fontWeight: "bold",
  },
  barAxisMonthLabelText: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "600",
    color: THEME.textDark,
  },
  chartOverlayTargetThresholdAnchorRow: {
    marginTop: 18,
    gap: 6,
  },
  thresholdAnchorLabelText: {
    fontSize: 11,
    color: THEME.primary,
    fontWeight: "700",
  },
  dashedVectorLineDividerGraphic: {
    height: 1,
    borderWidth: 1,
    borderColor: THEME.primary,
    borderStyle: "dashed",
    width: "100%",
    opacity: 0.4,
  },
  yearlyHistoryComparisonBoxGroup: {
    marginTop: 14,
    gap: 8,
  },
  yearlyComparisonDataRowLineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.background,
    padding: 12,
    borderRadius: 12,
  },
  yearlyCompareLabelText: {
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: "600",
  },
  yearlyCompareValueText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.darkAccent,
  },
  chartCanvasHorizontalInternalDividerLine: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginVertical: 14,
  },
  bestLowestExtremeHighlightsBox: {
    gap: 8,
  },
  extremeHighlightRowLabelText: {
    fontSize: 13,
    color: THEME.textDark,
  },
  extremePrimaryBoldHighlightText: {
    fontWeight: "700",
    color: THEME.primary,
  },
  extremeDarkAccentBoldHighlightText: {
    fontWeight: "700",
    color: THEME.darkAccent,
  },
  titleWithActionBtnRowLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 20,
  },
  triggerAuditPopupModalBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  triggerBtnLabelTextContentText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.primary,
  },
  softScrollerContainerFrameHolder: {
    paddingLeft: 16,
    marginBottom: 24,
    height: 90,
  },
  flatListScroller: {
    flexDirection: "row",
  },
  softScrollerCardItemUnit: {
    backgroundColor: THEME.white,
    width: 220,
    padding: 14,
    borderRadius: 18,
    marginRight: 14,
    shadowColor: THEME.darkAccent,
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  scrollerCardHeaderTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scrollerCardDateText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textDark,
  },
  scrollerCardStatusIndicatorBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10,
  },
  badgeIndicatorCircleDotMarker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeIndicatorLabelTextText: {
    fontSize: 11,
    fontWeight: "700",
  },
  modalBlurOverlayPanelContainer: {
    flex: 1,
    backgroundColor: "rgba(44, 26, 20, 0.48)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalGlassCardContainerBody: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: THEME.white,
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeaderTopBarWrapperLineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 16,
  },
  modalHeaderTitleClusterGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalHeaderMainHeadingTitleText: {
    fontSize: 17,
    fontWeight: "700",
    color: THEME.textDark,
  },
  closeModalCrossActionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  modalContentCoreContainerStack: {
    marginTop: 16,
  },
  modalDataRowLineItemUnit: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  dataFieldMetaLabelText: {
    fontSize: 13,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  dataFieldValueContentText: {
    fontSize: 14,
    color: THEME.textDark,
    fontWeight: "600",
  },
  modalSplitDataFieldsRowGroupInline: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingVertical: 12,
  },
  splitFieldColumnHalfUnit: {
    flex: 1,
    gap: 4,
  },
  modalTutorRemarksBlockBox: {
    backgroundColor: THEME.background,
    padding: 14,
    borderRadius: 14,
    marginTop: 14,
  },
  remarksBoxBlockHeaderLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.darkAccent,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  remarksBoxParagraphBodyText: {
    fontSize: 13,
    color: THEME.textDark,
    lineHeight: 19,
    fontStyle: "italic",
  },
  modalDismissCallActionFullWidthWidthBtn: {
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },
  modalDismissBtnLabelTextContent: {
    color: THEME.white,
    fontWeight: "700",
    fontSize: 14,
  },
});