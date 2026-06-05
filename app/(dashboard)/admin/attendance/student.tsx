import { studentAttendanceApi } from "@/app/utils/axiosInstance";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform,
  Alert,
  ScrollView,
} from "react-native";

// ─── Theme ────────────────────────────────────────────────────────────────────
const T = {
  teal:      "#00BCD4",
  tealDark:  "#0097A7",
  tealDeep:  "#005662",   // darker for text — more contrast
  tealLight: "#B2EBF2",
  tealPale:  "#E0F7FA",
  navy:      "#1A2B4A",
  navyMid:   "#243660",
  bgPage:    "#EEF4F7",
  bgCard:    "#FFFFFF",
  border:    "#C8E0EA",
  // Text — boosted contrast throughout
  textWhite: "#FFFFFF",
  textNavy:  "#0F1E36",   // deeper navy for primary text
  textSub:   "#2E4A68",   // was #4A6080, now darker
  textMuted: "#4A6A88",   // was #7A95B0, now darker
  textLight: "#B0C8D8",
};

const AVATAR_PALETTE = [
  "#00BCD4","#00BCD4","#00BCD4","#00BCD4","#00BCD4","#00BCD4",
];

const avatarColor = (id: string) =>
  AVATAR_PALETTE[id.charCodeAt(id.length - 1) % AVATAR_PALETTE.length];

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// ─── Types ────────────────────────────────────────────────────────────────────
interface DailyRecord {
  date: string;
  status: "PRESENT" | "ABSENT" | "HOLIDAY" | "NOT_MARKED" | "HALF_DAY";
}

interface StudentMonthlyAttendance {
  studentId: string;
  present: number;
  absent: number;
  holidays: number;
  percentage: number;
  dailyRecords: DailyRecord[];
}

interface ClassStudentRecord {
  status: string;
  studentId: string;
  name: string;
}

// ─── Status config ────────────────────────────────────────────────────────────
const getStatusCfg = (status: string) => {
  switch (status) {
    case "PRESENT":    return { color: T.tealDeep, bg: T.tealLight, label: "Present"    };
    case "ABSENT":     return { color: T.tealDeep, bg: T.tealLight, label: "Absent"     };
    case "HOLIDAY":    return { color: T.tealDeep, bg: T.tealLight, label: "Holiday"    };
    case "HALF_DAY":   return { color: T.tealDeep, bg: T.tealLight, label: "Half Day"   };
    case "NOT_MARKED": return { color: T.textMuted, bg: "#E8F0F6",  label: "Not Marked" };
    default:           return { color: T.textMuted, bg: "#E8F0F6",  label: status       };
  }
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const formatDate = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

const todayStr = () => {
  const n = new Date();
  return formatDate(n.getFullYear(), n.getMonth() + 1, n.getDate());
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <View style={S.statCard}>
    <Text style={S.statValue}>{value}</Text>
    <Text style={S.statLabel}>{label}</Text>
  </View>
);

// ─── Class Student Row Card ───────────────────────────────────────────────────
const ClassStudentCard = ({ item }: { item: ClassStudentRecord }) => {
  const cfg = getStatusCfg(item.status);
  const ac  = avatarColor(item.studentId);
  return (
    <View style={S.card}>
      <View style={[S.cardBar, { backgroundColor: ac }]} />
      <View style={[S.avatar, { backgroundColor: ac }]}>
        <Text style={S.avatarText}>{getInitials(item.name)}</Text>
      </View>
      <View style={S.cardBody}>
        <Text style={S.cardName}>{item.name}</Text>
        <Text style={S.cardId}>{item.studentId}</Text>
      </View>
      <View style={[S.pill, { backgroundColor: cfg.bg }]}>
        <Text style={[S.pillLabel, { color: cfg.color }]}>● {cfg.label}</Text>
      </View>
    </View>
  );
};

// ─── TAB: Monthly (stats + daily list only, no calendar) ─────────────────────
const MonthlyTab = ({ studentId }: { studentId: string }) => {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData]   = useState<StudentMonthlyAttendance | null>(null);
  const [loading, setLoading]     = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (y: number, m: number, isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await studentAttendanceApi.get<StudentMonthlyAttendance>(
        `/api/student/attendance/${studentId}/${y}/${m}`
      );
      setData(res.data);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || err?.message || "Failed to load.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentId]);

  useEffect(() => { fetchData(year, month); }, [year, month]);

  const shiftMonth = (dir: -1 | 1) => {
    let m = month + dir, y = year;
    if (m < 1)  { m = 12; y--; }
    if (m > 12) { m = 1;  y++; }
    setMonth(m); setYear(y);
  };

  const isCurrent = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={S.tabContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchData(year, month, true)}
          colors={[T.teal]}
          tintColor={T.teal}
        />
      }
    >
      {/* Month navigator */}
      <View style={S.monthNav}>
        <TouchableOpacity style={S.dateArrow} onPress={() => shiftMonth(-1)} activeOpacity={0.7}>
          <Text style={S.dateArrowTxt}>‹</Text>
        </TouchableOpacity>
        <Text style={S.monthTitle}>{MONTHS[month - 1]} {year}</Text>
        <TouchableOpacity
          style={[S.dateArrow, isCurrent && S.dateArrowOff]}
          onPress={() => shiftMonth(1)}
          disabled={isCurrent}
          activeOpacity={0.7}
        >
          <Text style={[S.dateArrowTxt, isCurrent && { color: T.border }]}>›</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={S.centerState}>
          <ActivityIndicator size="large" color={T.teal} />
          <Text style={S.stateMsg}>Loading…</Text>
        </View>
      ) : data ? (
        <>
          {/* ── 4 stat cards ── */}
          <View style={S.statsRow}>
            <StatCard label="Present"  value={data.present}  />
            <StatCard label="Absent"   value={data.absent}   />
            <StatCard label="Holidays" value={data.holidays} />
            <StatCard label="Score"    value={`${data.percentage}%`} />
          </View>

          {/* ── Attendance rate bar ── */}
          <View style={S.progressCard}>
            <View style={S.progressHeader}>
              <Text style={S.progressTitle}>Attendance Rate</Text>
              <Text style={S.progressPct}>{data.percentage}%</Text>
            </View>
            <View style={S.progressBg}>
              <View style={[S.progressFill, { width: `${Math.min(data.percentage, 100)}%` as any }]} />
            </View>
            <Text style={[S.progressHint, { color: data.percentage >= 75 ? T.tealDark : "#B45309" }]}>
              {data.percentage >= 75 ? "✓ Above 75% threshold" : "⚠ Below 75% threshold"}
            </Text>
          </View>

          {/* ── Daily records list ── */}
          <View style={S.sectionCard}>
            <Text style={S.sectionTitle}>Daily Records</Text>
            {data.dailyRecords.map((r, i) => {
              const cfg = getStatusCfg(r.status);
              const d = new Date(r.date + "T00:00:00");
              const dayLabel = d.toLocaleDateString("en-US", {
                weekday: "short", day: "numeric", month: "short",
              });
              return (
                <View
                  key={r.date}
                  style={[S.dailyRow, i < data.dailyRecords.length - 1 && S.dailyRowBorder]}
                >
                  <View style={S.dailyLeft}>
                    <Text style={S.dailyDayNum}>{d.getDate()}</Text>
                    <Text style={S.dailyDayName}>{d.toLocaleDateString("en-US", { weekday: "short" })}</Text>
                  </View>
                  <Text style={S.dailyDateFull}>{d.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</Text>
                  <View style={[S.pill, { backgroundColor: cfg.bg }]}>
                    <Text style={[S.pillLabel, { color: cfg.color }]}>● {cfg.label}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
};

// ─── TAB: Class by date ───────────────────────────────────────────────────────
const ClassDateTab = ({ classSectionId }: { classSectionId: string }) => {
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [records, setRecords]           = useState<ClassStudentRecord[]>([]);
  const [loading, setLoading]           = useState(false);
  const [refreshing, setRefreshing]     = useState(false);
  const today = todayStr();

  const fetchData = useCallback(async (date: string, isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await studentAttendanceApi.get<ClassStudentRecord[]>(
        `/api/student/attendance/class/${classSectionId}/date/${date}`
      );
      setRecords(res.data);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || err?.message || "Failed to load.");
      setRecords([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [classSectionId]);

  useEffect(() => { fetchData(selectedDate); }, [selectedDate]);

  const shiftDate = (dir: -1 | 1) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + dir);
    setSelectedDate(formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  };

  const counts = {
    PRESENT:    records.filter((r) => r.status === "PRESENT").length,
    ABSENT:     records.filter((r) => r.status === "ABSENT").length,
    HOLIDAY:    records.filter((r) => r.status === "HOLIDAY").length,
    NOT_MARKED: records.filter((r) => r.status === "NOT_MARKED").length,
  };

  const displayDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.studentId}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={S.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchData(selectedDate, true)}
          colors={[T.teal]}
          tintColor={T.teal}
        />
      }
      ListHeaderComponent={
        <>
          {/* Date navigator */}
          <View style={S.dateNav}>
            <TouchableOpacity style={S.dateArrow} onPress={() => shiftDate(-1)} activeOpacity={0.7}>
              <Text style={S.dateArrowTxt}>‹</Text>
            </TouchableOpacity>
            <Text style={S.dateTxt}>{displayDate}</Text>
            <TouchableOpacity
              style={[S.dateArrow, selectedDate === today && S.dateArrowOff]}
              onPress={() => shiftDate(1)}
              disabled={selectedDate === today}
              activeOpacity={0.7}
            >
              <Text style={[S.dateArrowTxt, selectedDate === today && { color: T.border }]}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Summary stats */}
          {records.length > 0 && (
            <View style={S.statsRow}>
              <StatCard label="Present"  value={counts.PRESENT}    />
              <StatCard label="Absent"   value={counts.ABSENT}     />
              <StatCard label="Holiday"  value={counts.HOLIDAY}    />
              <StatCard label="Unmarked" value={counts.NOT_MARKED} />
            </View>
          )}

          {records.length > 0 && (
            <Text style={S.sectionLabel}>
              Students{" "}
              <Text style={S.sectionCount}>({records.length})</Text>
            </Text>
          )}
        </>
      }
      ListEmptyComponent={
        loading ? (
          <View style={S.centerState}>
            <ActivityIndicator size="large" color={T.teal} />
            <Text style={S.stateMsg}>Loading…</Text>
          </View>
        ) : (
          <View style={S.centerState}>
            <Text style={S.stateIcon}>📋</Text>
            <Text style={S.stateMsg}>No records for this date.</Text>
          </View>
        )
      }
      renderItem={({ item }) => <ClassStudentCard item={item} />}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
interface Props {
  studentId?: string;
  classSectionId?: string;
  defaultTab?: "monthly" | "class";
}

const StudentAttendanceScreen: React.FC<Props> = ({
  studentId = "STU2026003",
  classSectionId = "CLS2026003",
  defaultTab = "monthly",
}) => {
  const [activeTab, setActiveTab] = useState<"monthly" | "class">(defaultTab);

  return (
    <View style={S.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.navy} />

      {/* Header */}
      <View style={S.header}>
        <Text style={S.headerTitle}>Student Attendance</Text>
        <Text style={S.headerSub}>{studentId}</Text>
      </View>

      {/* Tab bar */}
      <View style={S.tabBar}>
        {(["monthly", "class"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[S.tabBtn, activeTab === tab && S.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[S.tabBtnTxt, activeTab === tab && S.tabBtnTxtActive]}>
              {tab === "monthly" ? "Monthly View" : "Class by Date"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === "monthly"
        ? <MonthlyTab studentId={studentId} />
        : <ClassDateTab classSectionId={classSectionId} />
      }
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bgPage },

  // Header
  header: {
    backgroundColor: T.navy,
    paddingTop: Platform.OS === "ios" ? 54 : 36,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: T.textWhite, letterSpacing: -0.3 },
  headerSub:   { fontSize: 13, color: "#B2EBF2", marginTop: 4, fontWeight: "600" },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: T.navy,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.navyMid,
  },
  tabBtn: {
    flex: 1, paddingVertical: 13, alignItems: "center",
    borderBottomWidth: 3, borderBottomColor: "transparent",
  },
  tabBtnActive:    { borderBottomColor: T.teal },
  tabBtnTxt:       { fontSize: 13, fontWeight: "600", color: T.textLight },
  tabBtnTxtActive: { color: T.teal },

  // Tab content padding
  tabContent: { paddingBottom: 52 },

  // Month nav
  monthNav: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: T.navy,
    paddingVertical: 10, paddingHorizontal: 6,
    borderBottomWidth: 1, borderBottomColor: T.navyMid,
  },
  monthTitle: { flex: 1, textAlign: "center", fontSize: 15, fontWeight: "700", color: T.textWhite },

  // Date nav (class tab)
  dateNav: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: T.navy,
    paddingVertical: 10, paddingHorizontal: 6,
    borderBottomWidth: 1, borderBottomColor: T.navyMid,
  },
  dateArrow:    { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  dateArrowOff: { opacity: 0.25 },
  dateArrowTxt: { fontSize: 32, color: T.teal, lineHeight: 38, fontWeight: "300" },
  dateTxt:      { flex: 1, textAlign: "center", fontSize: 14, fontWeight: "700", color: T.textWhite },

  // Stats
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 14, paddingTop: 16, paddingBottom: 4, gap: 8,
  },
  statCard: {
    flex: 1, backgroundColor: T.tealLight, borderRadius: 14,
    paddingVertical: 14, alignItems: "center",
    elevation: 2,
    shadowColor: "#000", shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  statValue: { fontSize: 24, fontWeight: "800", color: T.tealDeep },
  statLabel: {
    fontSize: 10, fontWeight: "700", color: T.tealDark,
    marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5,
  },

  // Progress card
  progressCard: {
    marginHorizontal: 14, marginTop: 14,
    backgroundColor: T.bgCard, borderRadius: 14, padding: 16,
    elevation: 2, shadowColor: T.navy, shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
    borderWidth: 1, borderColor: T.border,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  progressTitle:  { fontSize: 15, fontWeight: "700", color: T.textNavy },
  progressPct:    { fontSize: 15, fontWeight: "800", color: T.tealDark },
  progressBg:     { height: 10, backgroundColor: T.tealPale, borderRadius: 5, overflow: "hidden" },
  progressFill:   { height: 10, backgroundColor: T.teal, borderRadius: 5 },
  progressHint:   { fontSize: 12, marginTop: 8, fontWeight: "600" },

  // Section card (daily list)
  sectionCard: {
    marginHorizontal: 14, marginTop: 14,
    backgroundColor: T.bgCard, borderRadius: 14, padding: 16,
    elevation: 2, shadowColor: T.navy, shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
    borderWidth: 1, borderColor: T.border,
  },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: T.textNavy, marginBottom: 14 },

  // Daily row
  dailyRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 11,
  },
  dailyRowBorder: { borderBottomWidth: 1, borderBottomColor: T.border },
  dailyLeft: { alignItems: "center", width: 38, marginRight: 12 },
  dailyDayNum:  { fontSize: 18, fontWeight: "800", color: T.tealDark },
  dailyDayName: { fontSize: 10, fontWeight: "700", color: T.textMuted, textTransform: "uppercase" },
  dailyDateFull:{ flex: 1, fontSize: 14, fontWeight: "600", color: T.textNavy },

  // Section label
  sectionLabel: {
    fontSize: 13, fontWeight: "700", color: T.textSub,
    marginTop: 18, marginBottom: 8, paddingHorizontal: 14,
    textTransform: "uppercase", letterSpacing: 0.6,
  },
  sectionCount: { color: T.textMuted, fontWeight: "500" },

  // Student card
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: T.bgCard, marginHorizontal: 14,
    borderRadius: 14, paddingVertical: 14, paddingRight: 14, paddingLeft: 0,
    overflow: "hidden",
    elevation: 2, shadowColor: T.navy, shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
    borderWidth: 1, borderColor: T.border,
  },
  cardBar:    { width: 4, alignSelf: "stretch", borderTopLeftRadius: 14, borderBottomLeftRadius: 14, marginRight: 12 },
  avatar:     { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { fontSize: 15, fontWeight: "800", color: "#FFFFFF" },
  cardBody:   { flex: 1 },
  cardName:   { fontSize: 15, fontWeight: "700", color: T.textNavy },
  cardId:     { fontSize: 13, color: T.textSub, marginTop: 2, fontWeight: "600" },

  // Pill
  pill:      { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginLeft: 8 },
  pillLabel: { fontSize: 12, fontWeight: "700" },

  // States
  centerState: { marginTop: 60, alignItems: "center", paddingHorizontal: 32 },
  stateIcon:   { fontSize: 48, marginBottom: 12 },
  stateMsg:    { fontSize: 15, color: T.textSub, textAlign: "center", lineHeight: 22, marginTop: 8, fontWeight: "500" },
});

export default StudentAttendanceScreen;