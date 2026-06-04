  
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  BookOpen,
  Download,
  FileSpreadsheet,
  Filter,
  Info,
  Medal,
  Sparkles
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
import Svg, { Path } from "react-native-svg";

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

const examTermsTabs = ["Term 1 Finals", "Mid-Term Assessment", "Term 2 Progress"];

const scholasticMarksPool = [
  { subject: "Mathematics & Analytics", marks: 96, max: 100, grade: "O", remarks: "Brilliant problem solving capability.", color: "#E35336" },
  { subject: "General Science & Labs", marks: 91, max: 100, grade: "A+", remarks: "Very active in experimental logic.", color: "#A0522D" },
  { subject: "English Language Arts", marks: 88, max: 100, grade: "A", remarks: "Excellent essay structure writing.", color: "#D97706" },
  { subject: "Social & Environmental Studies", marks: 93, max: 100, grade: "O", remarks: "Great analytical historical grasp.", color: "#16A34A" },
];

const coScholasticMetrics = [
  { activity: "Arts & Creative Design", grade: "Excellent (A+)" },
  { activity: "Sports & Physical Stamina", grade: "Outstanding (O)" },
  { activity: "Civic Discipline & Team Spirit", grade: "Excellent (A+)" },
];

const academicSummaryMetrics = {
  totalMarks: 368,
  maxAggregate: 400,
  percentage: 92,
  classRank: "03 / 32",
  finalGradeIndex: "Grade A+",
  attendanceSync: "94%",
  classTeacherRemarks: "Aarav has displayed exceptional velocity in analytical conceptual frameworks this entire term. Highly regular, curious, and disciplined companion.",
};

export default function ExaminationReportCardDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("Term 1 Finals");

  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);
  const isDesktop = windowWidth > 768;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });

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

    return () => subscription.remove();
  }, []);

  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

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

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Background Canvas */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}>
          <Svg height="350" width={windowWidth + 100} viewBox={`0 0 ${windowWidth + 100} 350`}>
            <Path
              d={`M0 130 C ${windowWidth / 3} 70, ${(2 * windowWidth) / 3} 190, ${windowWidth + 100} 110 L ${windowWidth + 100} 0 L 0 0 Z`}
              fill="rgba(227, 83, 54, 0.05)"
            />
            <Path
              d={`M0 250 C ${windowWidth / 4} 310, ${(3 * windowWidth) / 4} 170, ${windowWidth + 100} 230 L ${windowWidth + 100} 0 L 0 0 Z`}
              fill="rgba(160, 82, 45, 0.04)"
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Parallax Layer Glassmorphism Orbs */}
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
          
          {/* Top Main Header Card - Restructured layout mechanics to auto wrap seamlessly */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeftCluster}>
              <View style={styles.titleBadgeInlineRow}>
                <Text style={styles.pageTitleHeading}>Progressive Report Ledger</Text>
                <View style={styles.liveBroadcastBadge}>
                  <Sparkles size={11} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.liveBroadcastBadgeText}>Official Sync</Text>
                </View>
              </View>
              <Text style={styles.pageSubtitleMuted}>Comprehensive academic grading system and student performance indices terminal tracker</Text>
            </View>

            <TouchableOpacity style={styles.premiumDownloadReportCardBtn} activeOpacity={0.8}>
              <Download size={15} color={THEME.white} style={{ marginRight: 6 }} />
              <Text style={styles.downloadBtnLabelTextContent}>Download Report PDF</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Academic Summary Performance Score Modules Layout Wrapper */}
          <Text style={styles.sectionHeadingTitle}>Cumulative Scholastic Indices</Text>
          <View style={[styles.overviewMetricsWrapperGridRow, isDesktop && styles.rowDirectionLayoutGrid]}>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth]}>
              <Text style={styles.metricItemLabelText}>Aggregated Score Weight</Text>
              <Text style={styles.metricItemBigNumber}>{academicSummaryMetrics.totalMarks} / {academicSummaryMetrics.maxAggregate}</Text>
              <Text style={styles.metricItemFooterSubtext}>Calculated evaluation pools</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth, { backgroundColor: "#E7F9EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#16A34A" }]}>Percentage Velocity</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#16A34A" }]}>{academicSummaryMetrics.percentage}% Index</Text>
              <Text style={styles.metricItemFooterSubtext}>Nominal target tier standing</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth, { backgroundColor: "#FEF7EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#D97706" }]}>Campus Cohort Rank</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#D97706" }]}>Rank {academicSummaryMetrics.classRank}</Text>
              <Text style={styles.metricItemFooterSubtext}>Position across grade level</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth]}>
              <Text style={styles.metricItemLabelText}>Institutional Status Metric</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.primary }]}>{academicSummaryMetrics.finalGradeIndex}</Text>
              <Text style={styles.metricItemFooterSubtext}>Excellent academic standard</Text>
            </View>
          </View>

          {/* Examination Term Switcher Tab Bar */}
          <View style={styles.categoryFilterBarSectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerLayout}>
              <View style={styles.filterIconBackdropContainerBox}>
                <Filter size={14} color={THEME.darkAccent} />
              </View>
              {examTermsTabs.map((termTab, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.filterChipTabUnitCell, selectedTerm === termTab && styles.activeFilterChipTabUnitCell]}
                  onPress={() => setSelectedTerm(termTab)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipTabLabelTextText, selectedTerm === termTab && styles.activeFilterChipTabLabelTextText]}>
                    {termTab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Cross Platform Flexible Screen Grid Wrapper Split */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            
            {/* Left Box Panel Module: Subject Breakup Cards Stack Layout */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}>
              <Text style={styles.blockTitleLabelHeading}>Subject Assessment Breakup Ledger</Text>
              
              {scholasticMarksPool.map((subLog, index) => (
                <View key={index} style={styles.subjectScoreRowCardItemUnit}>
                  <View style={styles.subjectRowHeaderInlineRow}>
                    <View style={styles.subjectLeftGroupCluster}>
                      <View style={[styles.subjectIconBackdrop, { backgroundColor: subLog.color + "15" }]}>
                        <BookOpen size={16} color={subLog.color} />
                      </View>
                      <View style={styles.subjectTextMetaDetailsFrame}>
                        <Text style={styles.subjectNameMainTitleHeadingTextText} numberOfLines={1} elipsizeMode="tail">{subLog.subject}</Text>
                        <Text style={styles.subjectRemarksNoteText} numberOfLines={2}>{subLog.remarks}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.subjectRightGradesBlock}>
                      <Text style={styles.subjectScoreNumericBigValue}>
                        {subLog.marks}
                        <Text style={styles.subjectMaxWeightScaleMutedText}> / {subLog.max}</Text>
                      </Text>
                      <View style={[styles.subjectGradeMiniBadge, { backgroundColor: subLog.color + "15" }]}>
                        <Text style={[styles.subjectGradeBadgeLabelText, { color: subLog.color }]}>{subLog.grade}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Horizontal Gauge Fill */}
                  <View style={styles.subjectProgressBarBackdropTrack}>
                    <View style={[styles.subjectProgressBarFillGauge, { width: `${subLog.marks}%`, backgroundColor: subLog.color }]} />
                  </View>
                </View>
              ))}
            </View>

            {/* Right Box Stack Panel Modules */}
            <View style={[styles.responsiveRightBlockStack, isDesktop && styles.desktopFlexProportionWidthRightSide]}>
              
              {/* Co-Scholastic Evaluations Grading Table Panel Card */}
              <View style={styles.rightSideInternalCardWrapperPanelBox}>
                <View style={styles.cardHeaderWithIconTitleFlexRow}>
                  <Medal size={18} color={THEME.darkAccent} />
                  <Text style={styles.blockTitleLabelHeading}>Co-Scholastic Domain Evaluations</Text>
                </View>
                <View style={styles.coScholasticFieldsStackContainerGroup}>
                  {coScholasticMetrics.map((coMetric, idx) => (
                    <View key={idx} style={styles.coScholasticLineItemRow}>
                      <Text style={styles.coScholasticFieldLabelText} numberOfLines={1}>{coMetric.activity}</Text>
                      <Text style={styles.coScholasticFieldValueHeadingText}>{coMetric.grade}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Class Teacher Remarks Feedback Card Panel */}
              <View style={[styles.rightSideInternalCardWrapperPanelBox, { marginBottom: isDesktop ? 0 : 40 }]}>
                <View style={styles.cardHeaderWithIconTitleFlexRow}>
                  <FileSpreadsheet size={18} color={THEME.primary} />
                  <Text style={styles.blockTitleLabelHeading}>Class Teacher Summative Remarks</Text>
                </View>
                <View style={styles.remarksParagraphHolderGlassBox}>
                  <Text style={styles.remarksParagraphBodyTextContentText}>
                    "{academicSummaryMetrics.classTeacherRemarks}"
                  </Text>
                </View>
                <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}>
                  <Info size={14} color={THEME.darkAccent} style={{ marginTop: 1 }} />
                  <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}>
                    Electronically verified documentation trail log issued by Edvance Administration framework portal registry authority.
                  </Text>
                </View>
              </View>

            </View>

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
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(227, 83, 54, 0.05)",
    top: 140,
    right: -40,
    zIndex: -1,
  },
  orb3DTwo: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
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
    padding: 16,
    borderRadius: 22,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 14,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  headerLeftCluster: {
    width: "100%",
    gap: 6
  },
  titleBadgeInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  pageTitleHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: THEME.textDark,
    letterSpacing: -0.5
  },
  liveBroadcastBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveBroadcastBadgeText: {
    color: THEME.white,
    fontSize: 10,
    fontWeight: "800",
  },
  pageSubtitleMuted: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 16,
  },
  premiumDownloadReportCardBtn: {
    backgroundColor: THEME.textDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%", // Adapts nicely across flexible phone viewports
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  downloadBtnLabelTextContent: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeadingTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.textDark,
    marginHorizontal: 18,
    marginTop: 24,
    marginBottom: 10,
  },
  overviewMetricsWrapperGridRow: {
    paddingHorizontal: 12,
    gap: 8,
  },
  rowDirectionLayoutGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  metricCardUnitItem: {
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    flex: 1,
    minWidth: 260,
    shadowColor: "#000",
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 1,
  },
  desktopMetricFourth: {
    width: "23%",
    flex: 0
  },
  metricItemLabelText: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: "700",
  },
  metricItemBigNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.textDark,
    marginTop: 4,
  },
  metricItemFooterSubtext: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
  },
  categoryFilterBarSectionContainer: {
    marginTop: 12,
    paddingLeft: 16,
  },
  filterScrollViewInnerLayout: {
    alignItems: "center",
    gap: 6,
    paddingRight: 24,
  },
  filterIconBackdropContainerBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: THEME.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 2,
  },
  filterChipTabUnitCell: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: THEME.white,
  },
  activeFilterChipTabUnitCell: {
    backgroundColor: THEME.primary,
  },
  filterChipTabLabelTextText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  responsiveSplitMainLayoutFlexContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 14,
  },
  desktopFlexProportionWidth: {
    flex: 1.3,
  },
  desktopFlexProportionWidthRightSide: {
    flex: 1,
  },
  responsiveRightBlockStack: {
    flex: 1,
    gap: 14,
  },
  listFeedBlockSectionCard: {
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 22,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  blockTitleLabelHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.textDark,
  },
  subjectScoreRowCardItemUnit: {
    backgroundColor: "#FDFCF9",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
    gap: 10,
  },
  subjectRowHeaderInlineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 8
  },
  subjectLeftGroupCluster: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    minWidth: 180,
    gap: 10,
  },
  subjectIconBackdrop: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2
  },
  subjectTextMetaDetailsFrame: {
    flex: 1,
    gap: 2
  },
  subjectNameMainTitleHeadingTextText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textDark,
  },
  subjectRemarksNoteText: {
    fontSize: 11,
    color: THEME.textMuted,
    lineHeight: 14,
  },
  subjectRightGradesBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 90,
  },
  subjectScoreNumericBigValue: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.textDark,
  },
  subjectMaxWeightScaleMutedText: {
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  subjectGradeMiniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 4,
  },
  subjectGradeBadgeLabelText: {
    fontSize: 10,
    fontWeight: "800",
  },
  subjectProgressBarBackdropTrack: {
    height: 5,
    backgroundColor: "#F3ECE7",
    borderRadius: 2.5,
    width: "100%",
    overflow: "hidden",
  },
  subjectProgressBarFillGauge: {
    height: "100%",
    borderRadius: 2.5,
  },
  rightSideInternalCardWrapperPanelBox: {
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 22,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  cardHeaderWithIconTitleFlexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 10,
  },
  coScholasticFieldsStackContainerGroup: {
    gap: 8,
  },
  coScholasticLineItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FDFCF9",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
    gap: 12
  },
  coScholasticFieldLabelText: {
    fontSize: 12,
    color: THEME.textDark,
    fontWeight: "600",
    flex: 1,
  },
  coScholasticFieldValueHeadingText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.primary,
  },
  remarksParagraphHolderGlassBox: {
    backgroundColor: THEME.background,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
  },
  remarksParagraphBodyTextContentText: {
    fontSize: 12,
    color: THEME.textDark,
    lineHeight: 18,
    fontStyle: "italic",
    fontWeight: "500",
  },
  auditVerificationNoticeSafetyFooterCardStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 2,
  },
  auditVerificationNoticeSafetyFooterCardTextText: {
    fontSize: 11,
    color: THEME.textMuted,
    lineHeight: 14,
    flex: 1,
  },
});