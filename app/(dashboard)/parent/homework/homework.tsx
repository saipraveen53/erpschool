 import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Info,
  Paperclip,
  Sparkles,
  TrendingUp
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
  glassBg: "rgba(255, 255, 255, 0.76)",
};

const homeworkFilterTabs = ["All Homeworks", "Awaiting Action", "Evaluated / Graded"];

const homeworkSummaryMetrics = {
  totalAssigned: 24,
  pendingSubmission: 2,
  evaluatedChecked: 22,
  nextDeadline: "June 03, 2026",
};

const homeworkDiaryPool = [
  { id: "HW-4412", title: "Analytical Geometry Triangle Proofs", subject: "Mathematics", status: "Awaiting Action", color: "#E35336", date: "Due by Jun 03, 2026", hasAttachment: true, fileName: "geometry_worksheet_q2.pdf" },
  { id: "HW-4391", title: "Plant Cell Structural Organelles Diagram", subject: "General Science", status: "Awaiting Action", color: "#A0522D", date: "Due by Jun 04, 2026", hasAttachment: false, fileName: "" },
  { id: "HW-4102", title: "Classic Prose Vocabulary Composition", subject: "English Literature", status: "Evaluated", color: "#16A34A", date: "Graded: Excellent (A+)", hasAttachment: true, fileName: "composition_feedback_stamped.pdf" },
  { id: "HW-3984", title: "Water Cycle Lifecycle Processes Chart", subject: "Environmental Studies", status: "Evaluated", color: "#16A34A", date: "Graded: Outstanding (O)", hasAttachment: false, fileName: "" },
];

export default function HomeworkDiaryDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All Homeworks");
  const [activeDetailedTask, setActiveDetailedTask] = useState<any>(homeworkDiaryPool[0]);

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  // 3D Matrix & Background Parallax Layer Transform Systems
  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 16000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Interpolation calculations for real-time 3D parallax manually driven layout shifting
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [40, 0, -85],
    extrapolate: "clamp",
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [-25, 0, 60],
    extrapolate: "clamp",
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20],
  });

  // Circular Completion Chart (Evaluated 22 vs Total 24 Pool Representation Ratio)
  const chartRadius = 45;
  const chartCircumference = 2 * Math.PI * chartRadius;
  const taskCompletionPercentage = 91; // 91% of total term assignments successfully logged
  const strokeDashoffsetVal = chartCircumference - (taskCompletionPercentage / 100) * chartCircumference;

  const filteredHomeworks = homeworkDiaryPool.filter(item => {
    if (selectedTab === "Awaiting Action") return item.status === "Awaiting Action";
    if (selectedTab === "Evaluated / Graded") return item.status === "Evaluated";
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Background Curved Wave Arcs Layout Vector Canvas */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}>
          <Svg height="350" width={width + 100} viewBox={`0 0 ${width + 100} 350`}>
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

      {/* Floating Space Blurred Parallax Glassmorphism Orbs */}
      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} />
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} />

      {/* PURE HAND-DRIVEN SCROLL ONLY: Auto-scroll intervals are completely stripped out */}
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
          
          {/* Top Main Branding Header Card Element */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeftCluster}>
              <View style={styles.titleBadgeInlineRow}>
                <Text style={styles.pageTitleHeading}>Homework Diary Log</Text>
                <View style={styles.liveBroadcastBadge}>
                  <Sparkles size={11} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.liveBroadcastBadgeText}>Sync Dynamic</Text>
                </View>
              </View>
              <Text style={styles.pageSubtitleMuted}>Advance Administration daily curriculum task assignments allocation tracking platform</Text>
            </View>
            <View style={styles.headerIconCircleBackdrop}>
              <BookOpen size={20} color={THEME.white} />
            </View>
          </Animated.View>

          {/* Core Analytics Operational Breakdown Grid Matrix */}
          <Text style={styles.sectionHeadingTitle}>Assignments Telemetry Pool</Text>
          <View style={styles.overviewMetricsWrapperGridRow}>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth]}>
              <Text style={styles.metricItemLabelText}>Total Tasks Assigned</Text>
              <Text style={styles.metricItemBigNumber}>{homeworkSummaryMetrics.totalAssigned}</Text>
              <Text style={styles.metricItemFooterSubtext}>Term cumulative velocity</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth, { backgroundColor: "#FDF0F1" }]}>
              <Text style={[styles.metricItemLabelText, { color: THEME.secondary }]}>Awaiting Submissions</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.secondary }]}>{homeworkSummaryMetrics.pendingSubmission} Tasks</Text>
              <Text style={styles.metricItemFooterSubtext}>Next deadline: {homeworkSummaryMetrics.nextDeadline}</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth, { backgroundColor: "#E7F9EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#16A34A" }]}>Checked & Evaluated</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#16A34A" }]}>{homeworkSummaryMetrics.evaluatedChecked}</Text>
              <Text style={styles.metricItemFooterSubtext}>Marks entry synchronized</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth]}>
              <Text style={styles.metricItemLabelText}>Syllabus Compliance</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.primary }]}>Stable Zone</Text>
              <Text style={styles.metricItemFooterSubtext}>Pace ratio aligned completely</Text>
            </View>
          </View>

          {/* Quick Filter Switching Action Carousel Layout Bar */}
          <View style={styles.categoryFilterBarSectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerLayout}>
              <View style={styles.filterIconBackdropContainerBox}>
                <Filter size={14} color={THEME.darkAccent} />
              </View>
              {homeworkFilterTabs.map((tabLabel, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.filterChipTabUnitCell, selectedTab === tabLabel && styles.activeFilterChipTabUnitCell]}
                  onPress={() => setSelectedTab(tabLabel)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipTabLabelTextText, selectedTab === tabLabel && styles.activeFilterChipTabLabelTextText]}>
                    {tabLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Split Screen Grid Architecture Panels (Desktop Double Containers / Mobile In-line Stacks) */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            
            {/* Left Column Box Window: Interactive Active Transactions Statements Feed */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}>
              <Text style={styles.blockTitleLabelHeading}>Daily Tasks Statement Registry</Text>
              
              {filteredHomeworks.map((hwItem) => {
                const isEvaluated = hwItem.status === "Evaluated";
                return (
                  <TouchableOpacity 
                    key={hwItem.id} 
                    style={[styles.transactionRowCardItemUnit, activeDetailedTask?.id === hwItem.id && isDesktop && styles.selectedTransactionRowCardItemUnit]}
                    onPress={() => setActiveDetailedTask(hwItem)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.transactionHighlightVerticalStrip, { backgroundColor: hwItem.color }]} />
                    
                    <View style={styles.transactionCoreLeftContentCluster}>
                      <View style={styles.txMetaHeaderRowLine}>
                        <Text style={styles.txIdStringLabelTextText}>{hwItem.id}  •  <Text style={{ fontWeight: "700", color: THEME.primary }}>{hwItem.subject}</Text></Text>
                        <Text style={styles.txDateMutedLabelString}>{hwItem.date}</Text>
                      </View>
                      
                      <Text style={styles.txMainTitleHeadingTextText} numberOfLines={1}>{hwItem.title}</Text>
                    </View>

                    <View style={styles.transactionRightActionContextBlock}>
                      <View style={[styles.statusBadgeCapsule, { backgroundColor: hwItem.color + "14" }]}>
                        <Text style={[styles.statusBadgeText, { color: hwItem.color }]}>{hwItem.status}</Text>
                      </View>
                      <ChevronRight size={14} color={THEME.textMuted} />
                    </View>

                  </TouchableOpacity>
                );
              })}
              {filteredHomeworks.length === 0 && (
                <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No assignments records located inside this filter tier parameters.</Text>
              )}
            </View>

            {/* Right Column Box Window: Double Function Panel Visualizer (Desktop Only) */}
            {isDesktop && (
              <View style={[styles.responsiveRightBlockStack, styles.desktopFlexProportionWidthRightSide]}>
                
                {/* Visual Circle Radial Tracking Percentage */}
                <View style={styles.rightSideInternalCardWrapperPanelBox}>
                  <View style={styles.cardHeaderWithIconTitleFlexRow}>
                    <TrendingUp size={16} color={THEME.darkAccent} />
                    <Text style={styles.blockTitleLabelHeading}>Diary Completion Index Curve</Text>
                  </View>

                  <View style={styles.radialGraphCanvasHolderHolder}>
                    <Svg height="120" width="120" viewBox="0 0 110 110">
                      <G rotate="-90" origin="55, 55">
                        <Circle cx="55" cy="55" r={chartRadius} stroke="#F3ECE7" strokeWidth="9" fill="transparent" />
                        <Circle
                          cx="55"
                          cy="55"
                          r={chartRadius}
                          stroke="#16A34A"
                          strokeWidth="9"
                          fill="transparent"
                          strokeDasharray={chartCircumference}
                          strokeDashoffset={strokeDashoffsetVal}
                          strokeLinecap="round"
                        />
                      </G>
                    </Svg>
                    <View style={styles.radialChartAbsoluteLabelsCenterBlock}>
                      <Text style={styles.radialChartBigPercentageText}>{taskCompletionPercentage}%</Text>
                      <Text style={styles.radialChartMutedSubtext}>Completed</Text>
                    </View>
                  </View>
                </View>

                {/* Inspect Target Homework Attachment Data Panel */}
                {activeDetailedTask && activeDetailedTask.hasAttachment && (
                  <View style={styles.rightSideInternalCardWrapperPanelBox}>
                    <View style={styles.cardHeaderWithIconTitleFlexRow}>
                      <Paperclip size={16} color={THEME.primary} />
                      <Text style={styles.blockTitleLabelHeading}>Supporting Worksheet Resource</Text>
                    </View>
                    <View style={styles.attachmentDownloadActionPanelCell}>
                      <View style={styles.attachmentLeftMetaGroup}>
                        <FileText size={18} color={THEME.primary} />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={styles.attachmentFileNameLabelStringText} numberOfLines={1}>{activeDetailedTask.fileName}</Text>
                          <Text style={styles.attachmentFileSizeMutedLabel}>PDF Form Guidelines  •  840 KB</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.downloadReceiptMiniActionIconButton} activeOpacity={0.75}>
                        <Download size={14} color={THEME.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

              </View>
            )}

          </View>

          {/* Secure Audit Verification Note Footer Ticker */}
          <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}>
            <Info size={13} color={THEME.darkAccent} />
            <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}>
              Daily homework diaries curriculum frameworks entries are cryptographically signed and updated instantly onto structural sync accounts configuration nodes by school educators.
            </Text>
          </View>

        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.background,
    position: "relative",
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
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: "rgba(227, 83, 54, 0.06)",
    top: 140,
    right: -40,
    zIndex: -1,
  },
  orb3DTwo: {
    position: "absolute",
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: "rgba(160, 82, 45, 0.04)",
    bottom: 80,
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
  pageHeaderBlockCard: {
    backgroundColor: THEME.white,
    padding: 22,
    borderRadius: 26,
    marginHorizontal: 16,
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  headerLeftCluster: {
    flex: 1,
    minWidth: 280,
  },
  titleBadgeInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  pageTitleHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  liveBroadcastBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveBroadcastBadgeText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "700",
  },
  pageSubtitleMuted: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  headerIconCircleBackdrop: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeadingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.textDark,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 14,
  },
  overviewMetricsWrapperGridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginTop: 4,
  },
  metricCardUnitItem: {
    width: "100%",
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    marginHorizontal: 4,
    flex: 1,
    minWidth: 220,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  desktopMetricFourth: {
    width: "23%",
  },
  metricItemLabelText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  metricItemBigNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: THEME.textDark,
    marginTop: 4,
  },
  metricItemFooterSubtext: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 4,
  },
  categoryFilterBarSectionContainer: {
    marginTop: 14,
    paddingLeft: 16,
  },
  filterScrollViewInnerLayout: {
    alignItems: "center",
    gap: 8,
    paddingRight: 24,
  },
  filterIconBackdropContainerBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  filterChipTabUnitCell: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: THEME.white,
  },
  activeFilterChipTabUnitCell: {
    backgroundColor: THEME.primary,
  },
  filterChipTabLabelTextText: {
    color: THEME.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  activeFilterChipTabLabelTextText: {
    color: THEME.white,
  },
  responsiveSplitMainLayoutFlexContainer: {
    paddingHorizontal: 16,
    marginTop: 22,
    gap: 16,
  },
  rowDirectionLayoutGrid: {
    flexDirection: "row",
  },
  desktopFlexProportionWidth: {
    flex: 1.35,
  },
  desktopFlexProportionWidthRightSide: {
    flex: 1,
  },
  responsiveRightBlockStack: {
    flex: 1,
    gap: 16,
  },
  listFeedBlockSectionCard: {
    backgroundColor: THEME.white,
    padding: 20,
    borderRadius: 26,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  blockTitleLabelHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.textDark,
  },
  transactionRowCardItemUnit: {
    backgroundColor: "#FDFCF9",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)",
    minHeight: 74,
  },
  selectedTransactionRowCardItemUnit: {
    backgroundColor: "#FFF8F5",
    borderColor: "rgba(227, 83, 54, 0.16)",
  },
  transactionHighlightVerticalStrip: {
    width: 5,
    height: "100%",
  },
  transactionCoreLeftContentCluster: {
    flex: 1,
    paddingHorizontal: 14,
    gap: 4,
  },
  txMetaHeaderRowLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  txIdStringLabelTextText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textMuted,
  },
  txDateMutedLabelString: {
    fontSize: 11,
    color: THEME.textMuted,
    marginLeft: "auto",
  },
  txMainTitleHeadingTextText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textDark,
    marginTop: 1,
  },
  transactionRightActionContextBlock: {
    alignItems: "center",
    paddingRight: 14,
    gap: 10,
    flexDirection: "row",
  },
  statusBadgeCapsule: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  fallbackEmptyLogsPlaceholderMutedText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  rightSideInternalCardWrapperPanelBox: {
    backgroundColor: THEME.white,
    padding: 20,
    borderRadius: 26,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
    alignSelf: "flex-start",
    width: "100%",
  },
  cardHeaderWithIconTitleFlexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 12,
  },
  radialGraphCanvasHolderHolder: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    height: 130,
    width: "100%",
    marginTop: 10,
  },
  radialChartAbsoluteLabelsCenterBlock: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  radialChartBigPercentageText: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.textDark,
  },
  radialChartMutedSubtext: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  attachmentDownloadActionPanelCell: {
    backgroundColor: "#FDFCF9",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.06)",
    width: "100%",
  },
  attachmentLeftMetaGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  attachmentFileNameLabelStringText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textDark,
  },
  attachmentFileSizeMutedLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
  },
  downloadReceiptMiniActionIconButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  auditVerificationNoticeSafetyFooterCardStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  auditVerificationNoticeSafetyFooterCardTextText: {
    fontSize: 11,
    color: THEME.textMuted,
    lineHeight: 15,
    flex: 1,
  },
});
