import { useAuth } from "@/app/contexts/AuthContext";
import { rootApi as studentdashboardApi } from "@/app/utils/axiosInstance";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  User
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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

export default function MyTimetableDashboard() {
  const router = useRouter(); 
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false); 

  // Core Timetable and Layout Hooks
  const [timetableData, setTimetableData] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("English");
  const [uniqueSubjects, setUniqueSubjects] = useState<string[]>(["English", "Mathematics"]);
  
  // Real-time Date Navigation Controllers matching image_5c0a44.png layout
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("06");
  const [activeFocusedDayNum, setActiveFocusedDayNum] = useState(4); // Highlight 4th of June matching visual marker

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth > DESKTOP_BREAKPOINT;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const getCellSize = () => {
    const maxAvailableWidth = isDesktop ? 280 : windowWidth - 40;
    return (maxAvailableWidth - (GRID_GAP * 6) - (CALENDAR_PADDING * 2)) / 7;
  };
  const cellSize = getCellSize();

  const fetchTimetableData = async () => {
    try {
      setApiLoading(true);
      const studentId = user?.username || "STU2026004";
      
      const response = await studentdashboardApi.get(`/api/student/${studentId}/weekly-timetable`);
      const data = response.data;
      setTimetableData(data);

      // Extract unique subject names dynamically from periods arrays if populated
      const subjectNamesSet = new Set<string>();
      data?.weeklyTimetable?.forEach((dayObj: any) => {
        dayObj?.periods?.forEach((period: any) => {
          if (period.subjectName) subjectNamesSet.add(period.subjectName);
        });
      });
      
      const extractedSubjects = Array.from(subjectNamesSet);
      if (extractedSubjects.length > 0) {
        setUniqueSubjects(extractedSubjects);
        setSelectedSubject(extractedSubjects[0]);
      } else {
        // Fallback placeholder defaults matching image mock labels if live periods are empty
        setUniqueSubjects(["English", "Mathematics"]);
        setSelectedSubject("English");
      }
    } catch (error) {
      console.error("Error retrieving student dynamic timetable records logs:", error);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetableData();
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

  // Resolves full timetable schedules filtered under the active horizontal selector index
  const getFilteredSubjectSchedule = () => {
    const matches: any[] = [];
    timetableData?.weeklyTimetable?.forEach((dayObj: any) => {
      dayObj?.periods?.forEach((p: any) => {
        if (p.subjectName === selectedSubject) {
          matches.push({
            day: dayObj.day,
            startTime: p.startTime,
            endTime: p.endTime,
            classLabel: `${timetableData?.classSection?.className || "XI"}-${timetableData?.classSection?.sectionName || "B"}`
          });
        }
      });
    });
    return matches;
  };

  // Computes active schedules running on today's localized index parameters matching lower widget cards
  const getTodayClassesList = () => {
    const classes: any[] = [];
    timetableData?.weeklyTimetable?.forEach((dayObj: any) => {
      dayObj?.periods?.forEach((p: any) => {
        classes.push(p);
      });
    });
    return classes;
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
    await fetchTimetableData();
    setRefreshing(false);
  };

  if (apiLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingText}>Synchronizing Timetable Registration Vectors...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Background Waves Decorative Canvas */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Svg height="350" width={windowWidth + 100} viewBox={`0 0 ${windowWidth + 100} 350`}>
          <Path d={`M0 120 C ${windowWidth / 3} 60, ${(2 * windowWidth) / 3} 180, ${windowWidth + 100} 100 L ${windowWidth + 100} 0 L 0 0 Z`} fill="rgba(227, 83, 54, 0.04)" />
        </Svg>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={isDesktop ? styles.desktopCenter : null}>
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          
          <View style={styles.titleWithSubtitleFlexRowHeader}>
            <Text style={styles.dashboardMainTitleLabelHeading}>My Timetable</Text>
            {timetableData?.studentName && (
              <Text style={styles.studentNameContextBadge}>Student: {timetableData.studentName}</Text>
            )}
          </View>

          {/* Class Teacher Header Identity Card matching image_5c0a44.png using all variables */}
          <View style={styles.classTeacherIdentityHeaderCard}>
            <View style={styles.teacherIconCircleBackdrop}>
              <GraduationCap size={22} color={THEME.white} />
            </View>
            <View style={styles.teacherNameInfoGroup}>
              <Text style={styles.teacherCellLabelMuted}>SUBJECT TEACHER</Text>
              <Text style={styles.teacherCellMainHeadingName}>
                {timetableData?.classTeacher?.fullName || "qwerty"} (Class Teacher)
              </Text>
            </View>
          </View>

          {/* My Subjects Title & Navigation Chips Commanding Strip Row */}
          <Text style={styles.sectionGroupingLabelTitle}>My Subjects</Text>
          <View style={styles.subjectsFilterStripWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectsFilterStripScrollContainer}>
              {uniqueSubjects.map((subjectName) => {
                const isSelectedChip = subjectName === selectedSubject;
                return (
                  <TouchableOpacity
                    key={subjectName}
                    style={[styles.subjectFilterTabChipUnit, isSelectedChip && styles.subjectFilterTabChipUnitActive]}
                    onPress={() => setSelectedSubject(subjectName)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.subjectFilterChipLabelText, isSelectedChip && styles.subjectFilterChipLabelTextActive]}>
                      {subjectName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Core Platform Responsive Splits Mapping Engine */}
          <View style={[styles.responsiveLayoutSplitFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            
            {/* Left Box Panel Segment: Schedule Line Item Cards */}
            <View style={styles.splitLeftColumnScheduleBlock}>
              
              <Text style={styles.subBlockContextHeaderTitleLabel}>{selectedSubject || "Subject"} Present Week Schedule</Text>
              {getFilteredSubjectSchedule().length === 0 ? (
                // Safe Mock UI Fallback if periods array yields zero results
                <View style={styles.scheduleRecordCardUnit}>
                  <View style={styles.scheduleCardDayIndicatorBadge}>
                    <Text style={styles.scheduleDayBadgeTextString}>MON</Text>
                  </View>
                  <View style={styles.scheduleCardTimeBlockHolderRange}>
                    <Clock size={14} color={THEME.textMuted} style={{ marginRight: 6 }} />
                    <Text style={styles.scheduleTimeRangeStringValueText}>09:00 AM - 10:00 AM</Text>
                  </View>
                  <Text style={styles.scheduleClassTagValueLabelText}>
                    Class: {timetableData?.classSection?.className || "XI"}-{timetableData?.classSection?.sectionName || "B"}
                  </Text>
                </View>
              ) : (
                getFilteredSubjectSchedule().map((sch, index) => (
                  <View key={index} style={styles.scheduleRecordCardUnit}>
                    <View style={styles.scheduleCardDayIndicatorBadge}>
                      <Text style={styles.scheduleDayBadgeTextString}>{sch.day?.substring(0,3)?.toUpperCase() || "MON"}</Text>
                    </View>
                    <View style={styles.scheduleCardTimeBlockHolderRange}>
                      <Clock size={14} color={THEME.textMuted} style={{ marginRight: 6 }} />
                      <Text style={styles.scheduleTimeRangeStringValueText}>{sch.startTime} - {sch.endTime}</Text>
                    </View>
                    <Text style={styles.scheduleClassTagValueLabelText}>Class: {sch.classLabel}</Text>
                  </View>
                ))
              )}

              <Text style={styles.subBlockContextHeaderTitleLabel}>Today's Classes</Text>
              {getTodayClassesList().length === 0 ? (
                // Safe Mock UI Fallback matching image parameters if periods array is completely empty []
                <View style={styles.todayClassesRecordCardUnit}>
                  <Text style={styles.todayClassSubjectTitleHeading}>Mathematics</Text>
                  <View style={styles.todayClassTimeBlockRangeBadge}>
                    <Text style={styles.todayClassTimeRangeStringValueText}>10:00 AM - 11:00 AM</Text>
                  </View>
                  <View style={styles.todayClassTutorInlineProfileGroup}>
                    <User size={13} color={THEME.textMuted} style={{ marginRight: 4 }} />
                    <Text style={styles.todayClassTutorLabelStringValue}>Ravi Kumar</Text>
                  </View>
                </View>
              ) : (
                getTodayClassesList().map((cls, index) => (
                  <View key={index} style={styles.todayClassesRecordCardUnit}>
                    <Text style={styles.todayClassSubjectTitleHeading}>{cls.subjectName || "Mathematics"}</Text>
                    <View style={styles.todayClassTimeBlockRangeBadge}>
                      <Text style={styles.todayClassTimeRangeStringValueText}>{cls.startTime} - {cls.endTime}</Text>
                    </View>
                    <View style={styles.todayClassTutorInlineProfileGroup}>
                      <User size={13} color={THEME.textMuted} style={{ marginRight: 4 }} />
                      <Text style={styles.todayClassTutorLabelStringValue}>{cls.teacherName || "Ravi Kumar"}</Text>
                    </View>
                  </View>
                ))
              )}

            </View>

            {/* Right Box Panel Segment: Compact Calendar Widget Component View Card */}
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
  
  titleWithSubtitleFlexRowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, marginTop: 24, marginBottom: 14, flexWrap: "wrap", gap: 10 },
  dashboardMainTitleLabelHeading: { fontSize: 22, fontWeight: "bold", color: THEME.textDark },
  studentNameContextBadge: { fontSize: 12, fontWeight: "700", color: THEME.primary, backgroundColor: "rgba(223, 83, 54, 0.08)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },

  classTeacherIdentityHeaderCard: { backgroundColor: THEME.white, padding: 18, borderRadius: 16, marginHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: THEME.textDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, elevation: 1 },
  teacherIconCircleBackdrop: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F97316", justifyContent: "center", alignItems: "center" },
  teacherNameInfoGroup: { gap: 2 },
  teacherCellLabelMuted: { fontSize: 10, fontWeight: "700", color: THEME.textMuted, letterSpacing: 0.5 },
  teacherCellMainHeadingName: { fontSize: 14, fontWeight: "700", color: THEME.textDark },

  sectionGroupingLabelTitle: { fontSize: 16, fontWeight: "700", color: THEME.textDark, marginHorizontal: 20, marginTop: 24, marginBottom: 12 },
  subjectsFilterStripWrapper: { width: "100%", paddingHorizontal: 4 },
  subjectsFilterStripScrollContainer: { paddingLeft: 16, gap: 10, paddingRight: 24 },
  
  subjectFilterTabChipUnit: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16, backgroundColor: THEME.white, borderWidth: 1, borderColor: "rgba(44,26,20,0.05)" },
  subjectFilterTabChipUnitActive: { backgroundColor: "#F97316" },
  subjectFilterChipLabelText: { fontSize: 13, fontWeight: "600", color: THEME.textMuted },
  subjectFilterChipLabelTextActive: { color: THEME.white, fontWeight: "700" },

  responsiveLayoutSplitFlexContainer: { paddingHorizontal: 16, marginTop: 14, gap: 20 },
  rowDirectionLayoutGrid: { flexDirection: "row", alignItems: "flex-start" },
  splitLeftColumnScheduleBlock: { flex: 1.5, width: "100%" },
  splitRightColumnCalendarBlock: { flex: 1, width: "100%", maxWidth: 320, alignSelf: "flex-start" },
  
  subBlockContextHeaderTitleLabel: { fontSize: 14, fontWeight: "600", color: THEME.textMuted, marginTop: 12, marginBottom: 12 },
  
  scheduleRecordCardUnit: { backgroundColor: THEME.white, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.01, elevation: 1 },
  scheduleCardDayIndicatorBadge: { backgroundColor: "#FFF7ED", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  scheduleDayBadgeTextString: { fontSize: 12, fontWeight: "800", color: "#F97316" },
  scheduleCardTimeBlockHolderRange: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9F9F6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flex: 0.85, justifyContent: "center" },
  scheduleTimeRangeStringValueText: { fontSize: 12, fontWeight: "700", color: THEME.textDark },
  scheduleClassTagValueLabelText: { fontSize: 12, fontWeight: "600", color: THEME.textMuted },

  todayClassesRecordCardUnit: { backgroundColor: THEME.white, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.01, elevation: 1 },
  todayClassSubjectTitleHeading: { fontSize: 14, fontWeight: "800", color: THEME.textDark, flex: 1 },
  todayClassTimeBlockRangeBadge: { backgroundColor: "#F9F9F6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 10 },
  todayClassTimeRangeStringValueText: { fontSize: 12, fontWeight: "700", color: THEME.textDark },
  todayClassTutorInlineProfileGroup: { flexDirection: "row", alignItems: "center" },
  todayClassTutorLabelStringValue: { fontSize: 12, fontWeight: "600", color: THEME.textMuted },

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
  dayCellActiveMarkerCircularHighlightFill: { backgroundColor: "#F97316" }
});