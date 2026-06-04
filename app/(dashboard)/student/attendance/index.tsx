import { useAuth } from "@/app/contexts/AuthContext";
import { rootApi as studentdashboardApi } from "@/app/utils/axiosInstance";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  Award,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Info,
  Sparkles,
  X,
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
  present: "#22C55E",       // Green
  absent: "#EF4444",        // Red
  holiday: "#A855F7"        // Purple matching image color tone matrix
};

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

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DESKTOP_BREAKPOINT = 768;
const CALENDAR_PADDING = 16;
const GRID_GAP = 8;

export default function AttendanceAnalyticsDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Dynamic Lookup State Vectors Parameters
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("06");
  const [attendanceYearlyData, setAttendanceYearlyData] = useState<any>(null);
  const [attendanceMonthlyData, setAttendanceMonthlyData] = useState<any>(null);
  const [attendanceRecordsMap, setAttendanceRecordsMap] = useState<Record<string, string>>({});
  const [apiLoading, setApiLoading] = useState(true);
  
  // Track currently active highlighted date status block matching image layout rules
  const [activeFocusedDate, setActiveFocusedDate] = useState("2026-06-04");

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth > DESKTOP_BREAKPOINT;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Compute cell width size maps strictly targeting standard calendar constraints
  const getCellSize = () => {
    const maxAvailableWidth = isDesktop ? 440 : windowWidth - 40;
    const totalGapsSpace = GRID_GAP * 6;
    const internalPaddingSpace = CALENDAR_PADDING * 2;
    return (maxAvailableWidth - totalGapsSpace - internalPaddingSpace) / 7;
  };
  const cellSize = getCellSize();

  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchAttendanceTelemetryData = async () => {
    try {
      setApiLoading(true);
      const studentId = user?.username || "STU2026004";

      // 1. Fire Year-wise Analytics Lookup Query Parameter Context
      const yearlyRes = await studentdashboardApi.get(`/api/student/attendance/${studentId}/year/${selectedYear}`);
      setAttendanceYearlyData(yearlyRes.data);

      // 2. Fire Month-isolated Records Layer Grid Map
      const monthlyRes = await studentdashboardApi.get(`/api/student/attendance/${studentId}/${selectedYear}/${selectedMonth}`);
      setAttendanceMonthlyData(monthlyRes.data);

      if (monthlyRes.data?.dailyRecords) {
        const recordsMap: Record<string, string> = {};
        monthlyRes.data.dailyRecords.forEach((rec: any) => {
          recordsMap[rec.date] = rec.status?.toLowerCase();
        });
        setAttendanceRecordsMap(recordsMap);
      }
    } catch (err) {
      console.error("Error updating parallel grid calendar endpoints:", err);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceTelemetryData();
  }, [user, selectedYear, selectedMonth]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceTelemetryData();
    setRefreshing(false);
  };

  // Maps true numerical grid rows with exact layout offset blocks matching image_5cd099.png
  const generateCalendarDaysMatrix = () => {
    const yearNum = parseInt(selectedYear) || 2026;
    const monthIndex = parseInt(selectedMonth) - 1;
    
    const startDayOfWeek = new Date(yearNum, monthIndex, 1).getDay();
    const totalDays = new Date(yearNum, monthIndex + 1, 0).getDate();
    
    const daysArray = [];
    // Inject padding null placeholders before day 1 matching previous month's trailing week layout block
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push(null);
    }
    
    // Inject active month days tracker blocks
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

  const getActiveFocusedDateLabelStatus = () => {
    const currentStatus = attendanceRecordsMap[activeFocusedDate];
    if (!currentStatus || currentStatus === "unrecorded") return "NOT MARKED";
    return currentStatus.toUpperCase();
  };

  if (apiLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingText}>Loading Real-time Attendance Framework...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={isDesktop ? styles.desktopCenter : null}
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          
          <Text style={styles.dashboardMainTitleLabelHeading}>My Attendance</Text>

          {/* Upper Telemetry Overview Grid Panel matching image_5cd099.png */}
          <View style={[styles.topSummaryWidgetCard, isDesktop && styles.desktopCardMaxWidthConstraint]}>
            <View style={styles.summaryTopPercentagesFlexRow}>
              <View style={styles.percentTextDataCellUnit}>
                <Text style={styles.percentCellLabelMuted}>YEARLY</Text>
                <Text style={styles.percentCellBigValueNumber}>
                  {attendanceYearlyData?.percentage ? `${(attendanceYearlyData.percentage).toFixed(1)}%` : "100.0%"}
                </Text>
              </View>

              <View style={styles.percentTextDataCellUnit}>
                <Text style={styles.percentCellLabelMuted}>MONTHLY</Text>
                <Text style={styles.percentCellBigValueNumber}>
                  {attendanceMonthlyData?.percentage ? `${(attendanceMonthlyData.percentage * 10).toFixed(1)}%` : "100.0%"}
                </Text>
              </View>

              <View style={styles.pieChartIconPlaceholderBackdrop}>
                <Svg height="36" width="36" viewBox="0 0 36 36">
                  <Circle cx="18" cy="18" r="16" fill="#F3ECE7" />
                  <Path d="M18 2 A 16 16 0 1 1 2 18 L 18 18 Z" fill={THEME.primary} />
                </Svg>
              </View>
            </View>

            <View style={styles.summaryBottomCountersRowSplitterGrid}>
              <View style={styles.counterDataRowItemColumn}>
                <Text style={[styles.counterBigNumberLabel, { color: THEME.present }]}>{attendanceMonthlyData?.present || 1}</Text>
                <Text style={styles.counterLabelMutedSubtext}>Present</Text>
              </View>
              <View style={styles.counterDataRowItemColumn}>
                <Text style={[styles.counterBigNumberLabel, { color: THEME.absent }]}>{attendanceMonthlyData?.absent || 0}</Text>
                <Text style={styles.counterLabelMutedSubtext}>Absent</Text>
              </View>
              <View style={styles.counterDataRowItemColumn}>
                <Text style={[styles.counterBigNumberLabel, { color: THEME.holiday }]}>{attendanceMonthlyData?.holidays || 4}</Text>
                <Text style={styles.counterLabelMutedSubtext}>Holidays</Text>
              </View>
            </View>
          </View>

          {/* Focused Highlight Day Strip Card Context */}
          <View style={[styles.focusedDayStatusTickerCardBox, isDesktop && styles.desktopCardMaxWidthConstraint]}>
            <View style={styles.focusedDayLeftTextBlock}>
              <Text style={styles.focusedDateHeadingLabel}>{activeFocusedDate}</Text>
              <Text style={styles.focusedDateMutedSubtitle}>Day Status</Text>
            </View>
            <View style={[styles.focusedStatusLabelBadgeCapsule, getActiveFocusedDateLabelStatus() === "NOT MARKED" ? styles.badgeColorNotMarked : styles.badgeColorMarked]}>
              <Text style={[styles.focusedStatusTextStringValue, getActiveFocusedDateLabelStatus() === "NOT MARKED" ? { color: "#D97706" } : { color: THEME.primary }]}>
                {getActiveFocusedDateLabelStatus()}
              </Text>
            </View>
          </View>

          {/* Real-time Attendance Calendar Section Block Container Component */}
          <View style={[styles.calendarSheetLayoutWrapperCard, isDesktop && styles.desktopCardMaxWidthConstraint]}>
            
            {/* Header Arrow Command Selector Controls Bar Component */}
            <View style={styles.calendarControlsHeaderNavigationRow}>
              <TouchableOpacity style={styles.arrowNavigationTouchAreaBtn} onPress={() => handleMonthStepChange("prev")}>
                <ChevronLeft size={20} color={THEME.primary} />
              </TouchableOpacity>
              
              <Text style={styles.calendarHeaderMonthTitleLabelText}>
                {MONTHS_LIST.find((m) => m.value === selectedMonth)?.label} {selectedYear}
              </Text>

              <TouchableOpacity style={styles.arrowNavigationTouchAreaBtn} onPress={() => handleMonthStepChange("next")}>
                <ChevronRight size={20} color={THEME.primary} />
              </TouchableOpacity>
            </View>

            {/* Standard Grid Day Labels Strips Title Layer Row */}
            <View style={styles.calendarWeekdayLabelsStripRow}>
              {WEEKDAYS_SHORT.map((dayLabelName) => (
                <Text key={dayLabelName} style={[styles.weekdayHeaderLabelTextString, { width: cellSize }]}>
                  {dayLabelName}
                </Text>
              ))}
            </View>

            {/* Core Numeric Multi-Row Grid Layout Block Mappings */}
            <View style={styles.calendarDaysFlexWrappingGrid}>
              {generateCalendarDaysMatrix().map((dayCell, index) => {
                if (dayCell === null) {
                  return (
                    <View key={`empty-cell-${index}`} style={[styles.dayCellContainerEmptyPlaceholder, { width: cellSize, height: cellSize }]} />
                  );
                }

                // Check active tracking conditional styling matrices
                const isSelectedCellFocused = dayCell.dateStr === activeFocusedDate;
                
                let backgroundStatusFillCircleColor = "transparent";
                let textStatusContrastFillColor = THEME.textDark;

                if (dayCell.status === "present" || dayCell.status === "p") {
                  backgroundStatusFillCircleColor = THEME.present;
                  textStatusContrastFillColor = THEME.white;
                } else if (dayCell.status === "absent" || dayCell.status === "a") {
                  backgroundStatusFillCircleColor = THEME.absent;
                  textStatusContrastFillColor = THEME.white;
                } else if (dayCell.status === "holiday" || dayCell.status === "h") {
                  backgroundStatusFillCircleColor = THEME.holiday;
                  textStatusContrastFillColor = THEME.white;
                }

                return (
                  <TouchableOpacity
                    key={dayCell.dateStr}
                    style={[
                      styles.dayCellInteractiveContainerUnit,
                      { width: cellSize, height: cellSize },
                      backgroundStatusFillCircleColor !== "transparent" && { backgroundColor: backgroundStatusFillCircleColor },
                      isSelectedCellFocused && styles.dayCellActiveBorderHighlightEdge
                    ]}
                    onPress={() => setActiveFocusedDate(dayCell.dateStr)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dayCellNumericalLabelStringText, { color: textStatusContrastFillColor }]}>
                      {dayCell.dayNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Under-grid Color Legend Map Strip Row Elements */}
            <View style={styles.bottomCalendarLegendRowMap}>
              <View style={styles.legendItemRowUnit}><View style={[styles.legendIndicatorDot, { backgroundColor: THEME.present }]} /><Text style={styles.legendLabelStringText}>Present</Text></View>
              <View style={styles.legendItemRowUnit}><View style={[styles.legendIndicatorDot, { backgroundColor: THEME.absent }]} /><Text style={styles.legendLabelStringText}>Absent</Text></View>
              <View style={styles.legendItemRowUnit}><View style={[styles.legendIndicatorDot, { backgroundColor: THEME.holiday }]} /><Text style={styles.legendLabelStringText}>Holiday</Text></View>
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
  
  // Locked maximum width formatting properties forcing clean balance on desktop browsers
  desktopCardMaxWidthConstraint: { maxWidth: 440, alignSelf: "flex-start", width: "100%" },

  // --- Summary Metrics Block Card Styling Layer Mappings ---
  topSummaryWidgetCard: { backgroundColor: THEME.white, padding: 20, borderRadius: 24, marginHorizontal: 16, shadowColor: THEME.textDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  summaryTopPercentagesFlexRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F8F8F6", paddingBottom: 16 },
  percentTextDataCellUnit: { flex: 1 },
  percentCellLabelMuted: { fontSize: 11, fontWeight: "700", color: THEME.textMuted, letterSpacing: 0.5 },
  percentCellBigValueNumber: { fontSize: 24, fontWeight: "800", color: THEME.textDark, marginTop: 4 },
  pieChartIconPlaceholderBackdrop: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF8F5", justifyContent: "center", alignItems: "center" },
  summaryBottomCountersRowSplitterGrid: { flexDirection: "row", justifyContent: "space-around", marginTop: 16 },
  counterDataRowItemColumn: { alignItems: "center" },
  counterBigNumberLabel: { fontSize: 18, fontWeight: "800" },
  counterLabelMutedSubtext: { fontSize: 12, fontWeight: "600", color: THEME.textMuted, marginTop: 2 },

  // --- Day Status Highlight Banner Panel Matrix Box ---
  focusedDayStatusTickerCardBox: { backgroundColor: THEME.white, padding: 16, borderRadius: 20, marginHorizontal: 16, marginTop: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "rgba(227,83,54,0.06)", borderLeftWidth: 4, borderLeftColor: "#FBBF24" },
  focusedDayLeftTextBlock: { gap: 2 },
  focusedDateHeadingLabel: { fontSize: 16, fontWeight: "700", color: THEME.textDark },
  focusedDateMutedSubtitle: { fontSize: 11, color: THEME.textMuted, fontWeight: "500" },
  focusedStatusLabelBadgeCapsule: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  badgeColorNotMarked: { backgroundColor: "#FFF7ED" },
  badgeColorMarked: { backgroundColor: "#FDF0F1" },
  focusedStatusTextStringValue: { fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },

  // --- Real-time Calendar Layer Canvas Container Elements ---
  calendarSheetLayoutWrapperCard: { backgroundColor: THEME.white, padding: CALENDAR_PADDING, borderRadius: 26, marginHorizontal: 16, marginTop: 14, shadowColor: THEME.textDark, shadowOpacity: 0.02, elevation: 1 },
  calendarControlsHeaderNavigationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingHorizontal: 4 },
  arrowNavigationTouchAreaBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#FFF2EF", justifyContent: "center", alignItems: "center" },
  calendarHeaderMonthTitleLabelText: { fontSize: 16, fontWeight: "800", color: THEME.textDark },
  
  calendarWeekdayLabelsStripRow: { flexDirection: "row", gap: GRID_GAP, marginBottom: 12, width: "100%" },
  weekdayHeaderLabelTextString: { fontSize: 12, fontWeight: "600", color: THEME.textMuted, textAlign: "center" },
  
  calendarDaysFlexWrappingGrid: { flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP, width: "100%" },
  dayCellInteractiveContainerUnit: { backgroundColor: "#F9F9F6", borderRadius: 20, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "transparent" },
  dayCellContainerEmptyPlaceholder: { backgroundColor: "transparent" },
  dayCellNumericalLabelStringText: { fontSize: 13, fontWeight: "700" },
  dayCellActiveBorderHighlightEdge: { borderColor: THEME.textDark },

  // --- Calendar Under-grid Legends Mappings Strip Row ---
  bottomCalendarLegendRowMap: { flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 20, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#F5F5F5" },
  legendItemRowUnit: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendIndicatorDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabelStringText: { fontSize: 12, fontWeight: "600", color: THEME.textMuted }
});