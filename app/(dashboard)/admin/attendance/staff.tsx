import { teacherAttendanceApi } from "@/app/utils/axiosInstance";
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
  // Brand
  teal:        "#00BCD4",
  tealDark:    "#0097A7",
  tealLight:   "#B2EBF2",
  tealPale:    "#E0F7FA",
  // Navy
  navy:        "#2D3F49",
  navyMid:     "#2D3F49",
  // Backgrounds
  bgPage:      "#EEF4F7",
  bgCard:      "#FFFFFF",
  // Text
  textWhite:   "#FFFFFF",
  textNavy:    "#2D3F49",
  textSub:     "#4A6080",
  textMuted:   "#7A95B0",
  textLight:   "#B0C8D8",
  // Border
  border:      "#D0E8EE",
  // Status — all teal-family to match app theme
  presentColor:"#0097A7",  presentBg: "#B2EBF2",
  absentColor: "#0097A7",  absentBg:  "#B2EBF2",
  halfColor:   "#0097A7",  halfBg:    "#B2EBF2",
  leaveColor:  "#0097A7",  leaveBg:   "#B2EBF2",
};

const AVATAR_PALETTE = [
  "#00BCD4","#00BCD4","#00BCD4","#00BCD4","#00BCD4","#00BCD4",
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeacherAttendance {
  id: number;
  teacherId: string;
  teacherName: string;
  attendanceDate: string;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE";
  remarks: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (dateStr: string): string =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

const getStatusCfg = (status: string) => {
  // All share the same teal bg (matching your screenshot), text color distinguishes status
  const tealBg = T.tealLight; // #B2EBF2
  switch (status) {
    case "PRESENT":  return { color: "#2D3F49", bg: tealBg, label: "Present",  dot: "●" };
    case "ABSENT":   return { color: "#2D3F49", bg: tealBg, label: "Absent",   dot: "●" };
    case "HALF_DAY": return { color: "#2D3F49", bg: tealBg, label: "Half Day", dot: "◐" };
    case "LEAVE":    return { color: "#2D3F49", bg: tealBg, label: "Leave",    dot: "●" };
    default:         return { color: T.tealDark, bg: tealBg, label: status,   dot: "●" };
  }
};

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const avatarColor = (id: string) =>
  AVATAR_PALETTE[id.charCodeAt(id.length - 1) % AVATAR_PALETTE.length];

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({
  label, count, color, bg,
}: { label: string; count: number; color: string; bg: string }) => (
  <View style={[S.summaryCard, { backgroundColor: bg }]}>
    <Text style={[S.summaryCount, { color }]}>{count}</Text>
    <Text style={[S.summaryLabel, { color }]}>{label}</Text>
  </View>
);

// ─── Attendance Row Card ──────────────────────────────────────────────────────
const AttendanceCard = ({ item, index }: { item: TeacherAttendance; index: number }) => {
  const cfg = getStatusCfg(item.status);
  const ac  = avatarColor(item.teacherId);
  const showRemarks =
    item.remarks &&
    item.remarks.toUpperCase() !== item.status &&
    item.remarks.toLowerCase() !== "nothing";

  return (
    <View style={S.card}>
      {/* Left teal accent */}
      <View style={[S.cardBar, { backgroundColor: ac }]} />

      {/* Avatar circle */}
      <View style={[S.avatar, { backgroundColor: ac }]}>
        <Text style={S.avatarText}>{getInitials(item.teacherName)}</Text>
      </View>

      {/* Name / ID / remarks */}
      <View style={S.cardBody}>
        <Text style={S.cardName}>{item.teacherName}</Text>
        <Text style={S.cardId}>{item.teacherId}</Text>
        {showRemarks && (
          <Text style={S.cardRemarks} numberOfLines={1}>{item.remarks}</Text>
        )}
      </View>

      {/* Status pill */}
      <View style={[S.pill, { backgroundColor: cfg.bg }]}>
        <Text style={[S.pillDot, { color: cfg.color }]}>{cfg.dot} </Text>
        <Text style={[S.pillLabel, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    </View>
  );
};

// ─── Date Nav ─────────────────────────────────────────────────────────────────
const DateNav = ({
  date, onPrev, onNext, isToday,
}: { date: string; onPrev: () => void; onNext: () => void; isToday: boolean }) => (
  <View style={S.dateNav}>
    <TouchableOpacity style={S.dateArrow} onPress={onPrev} activeOpacity={0.7}>
      <Text style={S.dateArrowTxt}>‹</Text>
    </TouchableOpacity>
    <Text style={S.dateTxt}>{formatDisplayDate(date)}</Text>
    <TouchableOpacity
      style={[S.dateArrow, isToday && S.dateArrowOff]}
      onPress={onNext}
      disabled={isToday}
      activeOpacity={0.7}
    >
      <Text style={[S.dateArrowTxt, isToday && { color: T.border }]}>›</Text>
    </TouchableOpacity>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
const TeacherAttendanceScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [records, setRecords]           = useState<TeacherAttendance[]>([]);
  const [loading, setLoading]           = useState(false);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [filter, setFilter]             = useState("ALL");

  const today = formatDate(new Date());

  const fetchAttendance = useCallback(async (date: string, isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await teacherAttendanceApi.get<TeacherAttendance[]>(
        `/api/student/teacher/teacher/attendance/date/${date}`
      );
      setRecords(res.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load attendance.";
      setError(msg);
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAttendance(selectedDate); }, [selectedDate]);

  const shiftDate = (dir: -1 | 1) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + dir);
    setSelectedDate(formatDate(d));
    setFilter("ALL");
  };

  const counts = {
    PRESENT:  records.filter((r) => r.status === "PRESENT").length,
    ABSENT:   records.filter((r) => r.status === "ABSENT").length,
    HALF_DAY: records.filter((r) => r.status === "HALF_DAY").length,
    LEAVE:    records.filter((r) => r.status === "LEAVE").length,
  };

  const FILTERS = [
    { key: "ALL",      label: "All",      count: records.length },
    { key: "PRESENT",  label: "Present",  count: counts.PRESENT  },
    { key: "ABSENT",   label: "Absent",   count: counts.ABSENT   },
    { key: "HALF_DAY", label: "Half Day", count: counts.HALF_DAY },
    { key: "LEAVE",    label: "Leave",    count: counts.LEAVE    },
  ];

  const filtered = filter === "ALL" ? records : records.filter((r) => r.status === filter);

  return (
    <View style={S.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.navy} />

      {/* ── HEADER ── */}
      <View style={S.header}>
        <View>
          <Text style={S.headerTitle}>Staff Attendance</Text>
          <Text style={S.headerSub}>
            {records.length} staff member{records.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* ── DATE NAV ── */}
      <DateNav
        date={selectedDate}
        onPrev={() => shiftDate(-1)}
        onNext={() => shiftDate(1)}
        isToday={selectedDate === today}
      />

      {/* ── SCROLLABLE BODY ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={S.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAttendance(selectedDate, true)}
            colors={[T.teal]}
            tintColor={T.teal}
          />
        }
        // ── HEADER: summary + filter chips ──
        ListHeaderComponent={
          <>
            {/* Summary cards */}
            {records.length > 0 && (
              <View style={S.summaryRow}>
                <SummaryCard label="Present"  count={counts.PRESENT}  color={T.tealDark} bg={T.tealLight} />
                <SummaryCard label="Absent"   count={counts.ABSENT}   color={T.tealDark} bg={T.tealLight} />
                <SummaryCard label="Half Day" count={counts.HALF_DAY} color={T.tealDark} bg={T.tealLight} />
                <SummaryCard label="Leave"    count={counts.LEAVE}    color={T.tealDark} bg={T.tealLight} />
              </View>
            )}

            {/* Filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={S.chipRow}
              style={S.chipScroll}
            >
              {FILTERS.map((f) => {
                const active = filter === f.key;
                const cfg    = getStatusCfg(f.key);
                const activeBg = f.key === "ALL" ? T.teal : cfg.color;
                return (
                  <TouchableOpacity
                    key={f.key}
                    style={[
                      S.chip,
                      active
                        ? { backgroundColor: activeBg, borderColor: activeBg }
                        : { backgroundColor: T.bgCard, borderColor: T.border },
                    ]}
                    onPress={() => setFilter(f.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[S.chipTxt, active && { color: "#fff" }]}>
                      {f.label}{" "}
                      <Text style={[S.chipCount, active && { color: "#ffffffcc" }]}>
                        {f.count}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Section label */}
            {filtered.length > 0 && (
              <Text style={S.sectionLabel}>
                {filter === "ALL" ? "All Staff" : FILTERS.find((f) => f.key === filter)?.label}{" "}
                <Text style={S.sectionCount}>({filtered.length})</Text>
              </Text>
            )}
          </>
        }
        // ── EMPTY / LOADING ──
        ListEmptyComponent={
          loading ? (
            <View style={S.centerState}>
              <ActivityIndicator size="large" color={T.teal} />
              <Text style={S.stateMsg}>Loading attendance…</Text>
            </View>
          ) : error ? (
            <View style={S.centerState}>
              <Text style={S.stateIcon}>⚠️</Text>
              <Text style={[S.stateMsg, { color: "#B91C1C" }]}>{error}</Text>
              <TouchableOpacity
                style={S.retryBtn}
                onPress={() => fetchAttendance(selectedDate)}
              >
                <Text style={S.retryTxt}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={S.centerState}>
              <Text style={S.stateIcon}>📋</Text>
              <Text style={S.stateMsg}>No records for this date.</Text>
            </View>
          )
        }
        renderItem={({ item, index }) => <AttendanceCard item={item} index={index} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bgPage,
  },

  // Header
  header: {
    backgroundColor: T.navy,
    paddingTop: Platform.OS === "ios" ? 54 : 36,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: T.textWhite,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: T.tealLight,
    marginTop: 4,
    fontWeight: "500",
  },

  // Date Navigator
  dateNav: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.navy,           // stays navy, same band as header
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: T.navyMid,
  },
  dateArrow: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  dateArrowOff: { opacity: 0.25 },
  dateArrowTxt: {
    fontSize: 32,
    color: T.teal,
    lineHeight: 38,
    fontWeight: "300",
  },
  dateTxt: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: T.textWhite,               // white on navy — always visible
  },

  // Summary
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  summaryCount: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Filter chips
  chipScroll: {
    backgroundColor: "transparent",
    marginTop: 14,
  },
  chipRow: {
    paddingHorizontal: 14,
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1.5,
    marginRight: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  chipTxt: {
    fontSize: 13,
    fontWeight: "700",
    color: T.textSub,
  },
  chipCount: {
    fontSize: 12,
    fontWeight: "600",
    color: T.textMuted,
  },

  // Section label
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: T.textSub,
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 14,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  sectionCount: {
    color: T.textMuted,
    fontWeight: "500",
  },

  // List
  listContent: {
    paddingBottom: 48,
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.bgCard,
    marginHorizontal: 14,
    borderRadius: 14,
    paddingVertical: 14,
    paddingRight: 14,
    paddingLeft: 0,
    overflow: "hidden",
    elevation: 2,
    shadowColor: T.navy,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: T.border,
  },
  cardBar: {
    width: 4,
    alignSelf: "stretch",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "700",
    color: T.textNavy,             // dark navy — always readable on white card
  },
  cardId: {
    fontSize: 12,
    color: T.textSub,
    marginTop: 2,
    fontWeight: "500",
  },
  cardRemarks: {
    fontSize: 11,
    color: T.textMuted,
    marginTop: 3,
    fontStyle: "italic",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  pillDot: {
    fontSize: 8,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Empty / loading / error
  centerState: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  stateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  stateMsg: {
    fontSize: 14,
    color: T.textSub,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  retryBtn: {
    marginTop: 18,
    backgroundColor: T.teal,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default TeacherAttendanceScreen;