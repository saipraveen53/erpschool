import { useAuth } from "@/app/contexts/AuthContext";
import { examsApi } from "@/app/utils/axiosInstance";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
  textMuted: "#7A6862"
};

const MONTHS_LIST = [
  { label: "January", value: "01" }, { label: "February", value: "02" },
  { label: "March", value: "03" }, { label: "April", value: "04" },
  { label: "May", value: "05" }, { label: "June", value: "06" },
  { label: "July", value: "07" }, { label: "August", value: "08" },
  { label: "September", value: "09" }, { label: "October", value: "10" },
  { label: "November", value: "11" }, { label: "December", value: "12" }
];

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DESKTOP_BREAKPOINT = 768;
const CALENDAR_PADDING = 16;
const GRID_GAP = 6;

export default function ExamScheduleDashboard() {
  const router = useRouter(); 
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false); 

  // Core Exam Schedule Logs States Mapping Hooks
  const [examTimetablePool, setExamTimetablePool] = useState<any[]>([]);
  const [activeExamsPool, setActiveExamsPool] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [apiLoading, setApiLoading] = useState(true);
  
  // Real-time Date Control Vectors 
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("06");
  const [activeFocusedDayNum, setActiveFocusedDayNum] = useState(3); // Defaults highlighting June 3rd matching response markers

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth > DESKTOP_BREAKPOINT;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const getCellSize = () => {
    const maxAvailableWidth = isDesktop ? 300 : windowWidth - 40;
    return (maxAvailableWidth - (GRID_GAP * 6) - (CALENDAR_PADDING * 2)) / 7;
  };
  const cellSize = getCellSize();

  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  const fetchExamScheduleTelemetry = async () => {
    try {
      setApiLoading(true);
      const studentId = user?.username || "STU2026004";
      
      // 1. Fetch Dynamic Exam Timetable Pipeline Mappings
      const timetableRes = await examsApi.get(`/api/parent/exams/timetable?studentId=${studentId}`);
      const scheduleData = timetableRes.data || [];
      setExamTimetablePool(scheduleData);

      // 2. Fetch Active Assessment Cycles Metadata
      const activeExamsRes = await examsApi.get(`/api/parent/exams?studentId=${studentId}`);
      const activeExamsData = activeExamsRes.data || [];
      setActiveExamsPool(activeExamsData);

      if (scheduleData.length > 0 && !selectedExamId) {
        setSelectedExamId(scheduleData[0].examId || "");
      }
    } catch (err) {
      console.error("Error synchronizing parallel exam schedule telemetries:", err);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchExamScheduleTelemetry();

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
  }, [user]);

  const generateCalendarMatrix = () => {
    const yearNum = parseInt(selectedYear) || 2026;
    const monthIndex = parseInt(selectedMonth) - 1;
    const startDayOfWeek = new Date(yearNum, monthIndex, 1).getDay();
    const totalDays = new Date(yearNum, monthIndex + 1, 0).getDate();
    
    const daysArray = [];
    for (let i = 0; i < startDayOfWeek; i++) daysArray.push(null);
    for (let d = 1; d <= totalDays; d++) daysArray.push(d);
    return daysArray;
  };

  // Filter individual periods under active select tab states maps
  const getFilteredExamSchedulesList = () => {
    if (!selectedExamId) return examTimetablePool;
    return examTimetablePool.filter((sch: any) => sch.examId === selectedExamId);
  };

  const handleMonthStepChange = (direction: "prev" | "next") => {
    let currentMonthNum = parseInt(selectedMonth);
    let currentYearNum = parseInt(selectedYear);

    if (direction === "prev") {
      currentMonthNum--;
      if (currentMonthNum < 1) {
        currentMonthNum = 12;
        currentYearNum--;
      }
    } else {
      currentMonthNum++;
      if (currentMonthNum > 12) {
        currentMonthNum = 1;
        currentYearNum++;
      }
    }
    setSelectedMonth(("0" + currentMonthNum).slice(-2));
    setSelectedYear(currentYearNum.toString());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExamScheduleTelemetry();
    setRefreshing(false);
  };

  if (apiLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingText}>Synchronizing Examination Assessment Pipeline...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Background Layer Curved Canvas */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidMoveAnim }] }}>
          <Svg height="350" width={windowWidth + 100} viewBox={`0 0 ${windowWidth + 100} 350`}>
            <Path d={`M0 120 C ${windowWidth / 3} 60, ${(2 * windowWidth) / 3} 180, ${windowWidth + 100} 100 L ${windowWidth + 100} 0 L 0 0 Z`} fill="rgba(227, 83, 54, 0.04)" />
          </Svg>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={isDesktop ? styles.desktopCenter : null}>
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          
          <Text style={styles.dashboardMainTitleLabelHeading}>Exam Schedule</Text>

          {/* Active Cycle Cycle Identity Banner Header mapping examName and startDate variables */}
          {activeExamsPool.map((examMeta: any, idx: number) => (
            <View key={examMeta.examId || idx} style={styles.examIdentityHeaderCard}>
              <View style={styles.examIconCircleBackdrop}>
                <Award size={22} color={THEME.white} />
              </View>
              <View style={styles.examNameInfoGroup}>
                <Text style={styles.examCellLabelMuted}>ACTIVE CYCLE TIER</Text>
                <Text style={styles.examCellMainHeadingName}>{examMeta.examName || "Annual Exam"}</Text>
                <Text style={styles.examCellSubtextTimeline}>Commencement Series Horizon: {examMeta.startDate || "2026-06-03"}</Text>
              </View>
            </View>
          ))}

          {/* Dynamic Selector commanding chips row strip */}
          <Text style={styles.sectionGroupingLabelTitle}>Select Assessment Phase</Text>
          <View style={styles.examsFilterStripWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.examsFilterStripScrollContainer}>
              {examTimetablePool.map((sch: any, idx: number) => {
                const isSelectedChip = sch.examId === selectedExamId;
                const associatedMetaName = activeExamsPool[idx]?.examName || `Assessment Block (ID: ${sch.examId?.substring(3, 7)})`;
                return (
                  <TouchableOpacity
                    key={sch.scheduleId || idx}
                    style={[styles.examFilterTabChipUnit, isSelectedChip && styles.examFilterTabChipUnitActive]}
                    onPress={() => setSelectedExamId(sch.examId)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.examFilterChipLabelText, isSelectedChip && styles.examFilterChipLabelTextActive]}>
                      {associatedMetaName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Multi Column Cross Platform Layout Grid Engine */}
          <View style={[styles.responsiveLayoutSplitFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            
            {/* Left Block Segment: Timeline Period Mapping Cards */}
            <View style={styles.splitLeftColumnScheduleBlock}>
              <Text style={styles.subBlockContextHeaderTitleLabel}>Active Session Routine Mappings</Text>
              
              {getFilteredExamSchedulesList().length === 0 ? (
                <View style={styles.scheduleRecordCardUnit}>
                  <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No matching schedule metrics mapped under this criteria block key.</Text>
                </View>
              ) : (
                getFilteredExamSchedulesList().map((item: any) => (
                  <View key={item.scheduleId} style={styles.scheduleRecordCardUnit}>
                    <View style={styles.scheduleCardDayIndicatorBadge}>
                      <Text style={styles.scheduleDayBadgeTextString}>
                        {new Date(item.examDate).toLocaleDateString('en-US', { weekday: 'short' })?.toUpperCase() || "WED"}
                      </Text>
                    </View>
                    
                    <View style={styles.scheduleCardTimeBlockHolderRange}>
                      <Clock size={14} color={THEME.textMuted} style={{ marginRight: 6 }} />
                      <Text style={styles.scheduleTimeRangeStringValueText}>{item.startTime} - {item.endTime}</Text>
                    </View>

                    <View style={styles.scheduleDetailsMetaStackBlock}>
                      <Text style={styles.scheduleDetailLabelTextString}><Text style={{ fontWeight: "bold" }}>Date: </Text>{item.examDate}</Text>
                      <Text style={styles.scheduleDetailLabelTextString}><Text style={{ fontWeight: "bold" }}>Section Ref: </Text>{item.classSectionId}</Text>
                      <Text style={styles.scheduleDetailLabelTextString}><Text style={{ fontWeight: "bold" }}>Subject Track: </Text>{item.subjectId}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Right Block Segment: Compact Mini Calendar Component Display Sheet View Card */}
            <View style={styles.splitRightColumnCalendarBlock}>
              <View style={styles.calendarSheetWidgetCardBodyContainer}>
                
                <View style={styles.calendarWidgetControlNavigationRowHeader}>
                  <TouchableOpacity style={styles.arrowNavigationTouchAreaMiniBtn} onPress={() => handleMonthStepChange("prev")}>
                    <ChevronLeft size={16} color="#F97316" />
                  </TouchableOpacity>
                  <Text style={styles.calendarWidgetMonthYearTitleStringText}>
                    {MONTHS_LIST.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                  </Text>
                  <TouchableOpacity style={styles.arrowNavigationTouchAreaMiniBtn} onPress={() => handleMonthStepChange("next")}>
                    <ChevronRight size={16} color="#F97316" />
                  </TouchableOpacity>
                </View>

                <View style={styles.calendarWeekdaysStripHeaderRow}>
                  {WEEKDAYS_SHORT.map((wLabel) => (
                    <Text key={wLabel} style={[styles.calendarWeekdayHeaderTextLabel, { width: cellSize }]}>{wLabel}</Text>
                  ))}
                </View>

                <View style={styles.calendarDaysNumericFlexGridContainer}>
                  {generateCalendarMatrix().map((dayVal, index) => {
                    if (dayVal === null) {
                      return <View key={`empty-grid-${index}`} style={[styles.dayCellEmptyPlaceholderBox, { width: cellSize, height: cellSize }]} />;
                    }

                    const isCellTargetActiveFocused = dayVal === activeFocusedDayNum;

                    return (
                      <TouchableOpacity
                        key={`day-cell-${dayVal}`}
                        style={[
                          styles.dayCellInteractiveContainerBoxCell,
                          { width: cellSize, height: cellSize },
                          isCellTargetActiveFocused && styles.dayCellActiveMarkerCircularHighlightFill
                        ]}
                        onPress={() => setActiveFocusedDayNum(dayVal)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.dayCellNumericalLabelStringText, isCellTargetActiveFocused && { color: THEME.white }]}>
                          {dayVal}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

              </View>

              {/* Legal Verification Compliance Footer Sticker Box */}
              <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}>
                <Info size={13} color={THEME.darkAccent} style={{ marginTop: 2 }} />
                <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}>
                  Examination calendar index matrix logs represent dynamic query references synced automatically from regional educational administrative safe nodes.
                </Text>
              </View>
            </View>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, position: "relative" },
  loadingContainer: { flex: 1, backgroundColor: THEME.background, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 12, fontSize: 14, color: THEME.textDark, fontWeight: "600" },
  fluidBackgroundContainer: { position: "absolute", top: 0, left: 0, right: 0, zIndex: -2 },
  desktopCenter: { alignItems: "center" },
  mainWrapper: { width: "100%", paddingBottom: 40 },
  desktopWidth: { maxWidth: 1140, paddingHorizontal: 20 },
  
  dashboardMainTitleLabelHeading: { fontSize: 22, fontWeight: "bold", color: THEME.textDark, marginHorizontal: 20, marginTop: 24, marginBottom: 14 },
  
  examIdentityHeaderCard: { backgroundColor: THEME.white, padding: 18, borderRadius: 16, marginHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: THEME.textDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, elevation: 1, marginBottom: 10 },
  examIconCircleBackdrop: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F97316", justifyContent: "center", alignItems: "center" },
  examNameInfoGroup: { gap: 2, flex: 1 },
  examCellLabelMuted: { fontSize: 10, fontWeight: "700", color: THEME.textMuted, letterSpacing: 0.5 },
  examCellMainHeadingName: { fontSize: 16, fontWeight: "800", color: THEME.textDark },
  examCellSubtextTimeline: { fontSize: 12, color: THEME.textMuted, fontWeight: "500", marginTop: 2 },

  sectionGroupingLabelTitle: { fontSize: 16, fontWeight: "700", color: THEME.textDark, marginHorizontal: 20, marginTop: 24, marginBottom: 12 },
  examsFilterStripWrapper: { width: "100%", paddingHorizontal: 4 },
  examsFilterStripScrollContainer: { paddingLeft: 16, gap: 10, paddingRight: 24 },
  
  examFilterTabChipUnit: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 16, backgroundColor: THEME.white, borderWidth: 1, borderColor: "rgba(44,26,20,0.05)" },
  examFilterTabChipUnitActive: { backgroundColor: "#F97316" },
  examFilterChipLabelText: { fontSize: 13, fontWeight: "600", color: THEME.textMuted },
  examFilterChipLabelTextActive: { color: THEME.white, fontWeight: "700" },

  responsiveLayoutSplitFlexContainer: { paddingHorizontal: 16, marginTop: 14, gap: 20 },
  rowDirectionLayoutGrid: { flexDirection: "row", alignItems: "flex-start" },
  splitLeftColumnScheduleBlock: { flex: 1.5, width: "100%" },
  splitRightColumnCalendarBlock: { flex: 1, width: "100%", maxWidth: 320, alignSelf: "flex-start" },
  
  subBlockContextHeaderTitleLabel: { fontSize: 14, fontWeight: "600", color: THEME.textMuted, marginTop: 12, marginBottom: 12 },
  
  scheduleRecordCardUnit: { backgroundColor: THEME.white, borderRadius: 16, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.01, elevation: 1, flexWrap: "wrap", gap: 12 },
  scheduleCardDayIndicatorBadge: { backgroundColor: "#FFF7ED", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  scheduleDayBadgeTextString: { fontSize: 12, fontWeight: "800", color: "#F97316" },
  scheduleCardTimeBlockHolderRange: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9F9F6", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, minWidth: 150, justifyContent: "center" },
  scheduleTimeRangeStringValueText: { fontSize: 12, fontWeight: "700", color: THEME.textDark },
  scheduleDetailsMetaStackBlock: { gap: 3, minWidth: 140 },
  scheduleDetailLabelTextString: { fontSize: 12, color: THEME.textDark },
  fallbackEmptyLogsPlaceholderMutedText: { fontSize: 12, color: THEME.textMuted, fontStyle: "italic", paddingVertical: 8 },

  calendarSheetWidgetCardBodyContainer: { backgroundColor: THEME.white, padding: CALENDAR_PADDING, borderRadius: 20, width: "100%", shadowColor: "#000", shadowOpacity: 0.01, elevation: 1 },
  calendarWidgetControlNavigationRowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingHorizontal: 4 },
  arrowNavigationTouchAreaMiniBtn: { padding: 6 },
  calendarWidgetMonthYearTitleStringText: { fontSize: 14, fontWeight: "800", color: THEME.textDark },
  calendarWeekdaysStripHeaderRow: { flexDirection: "row", gap: GRID_GAP, marginBottom: 10, width: "100%" },
  calendarWeekdayHeaderTextLabel: { fontSize: 11, fontWeight: "600", color: THEME.textMuted, textAlign: "center" },
  calendarDaysNumericFlexGridContainer: { flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP, width: "100%" },
  dayCellInteractiveContainerBoxCell: { backgroundColor: "transparent", borderRadius: 16, justifyContent: "center", alignItems: "center" },
  dayCellEmptyPlaceholderBox: { backgroundColor: "transparent" },
  dayCellNumericalLabelStringText: { fontSize: 12, fontWeight: "700", color: THEME.textDark },
  dayCellActiveMarkerCircularHighlightFill: { backgroundColor: "#F97316" },

  auditVerificationNoticeSafetyFooterCardStrip: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 16, paddingHorizontal: 4 },
  auditVerificationNoticeSafetyFooterCardTextText: { fontSize: 11, color: THEME.textMuted, lineHeight: 15, flex: 1 }
});