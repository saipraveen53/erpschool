import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  LayoutGrid,
  LogIn,
  LogOut,
  MapPin,
  Search,
  Table,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const { width: SW } = Dimensions.get("window");
const isWide = SW > 900;

// Central Design Tokens
const C = {
  bg: "#f8f7ff",
  white: "#FFFFFF",
  dark: "#16082e",
  dark2: "#1e1135",
  textPrimary: "#0f172a",
  textSec: "#64748b",
  textTer: "#94a3b8",
  indigo: "#E35336",
  indigoLight: "#ffffff",
  green: "#10b981",
  greenLight: "#d1fae5",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  red: "#ef4444",
  redLight: "#fee2e2",
  sky: "#0ea5e9",
  border: "#f0e2e2",
};

interface AttendanceLog {
  id: string;
  employeeName: string;
  role: string;
  date: string;
  shift: string;
  clockIn: string;
  clockOut: string;
  status: "Present" | "Late" | "Absent" | "Half Day";
  locationTag: string;
  workHours: string;
  avatarUrl: string;
  isSelf?: boolean;
}

interface LeaveRequest {
  type: string;
  from: string;
  to: string;
  reason: string;
}

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = 0, style }) => {
  const op = useRef(new Animated.Value(0)).current;
  const sl = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(op, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sl, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, op, sl]);

  return (
    <Animated.View
      style={[{ opacity: op, transform: [{ translateY: sl }] }, style]}
    >
      {children}
    </Animated.View>
  );
};

const STATUS_MAP: Record<
  AttendanceLog["status"],
  { label: string; color: string; bg: string }
> = {
  Present: { label: "Present", color: C.green, bg: C.greenLight },
  Late: { label: "Late Arrival", color: C.amber, bg: C.amberLight },
  Absent: { label: "Absent", color: C.red, bg: C.redLight },
  "Half Day": { label: "Half Day", color: C.indigo, bg: C.indigoLight },
};

const LEAVE_TYPES = [
  "Sick Leave",
  "Casual Leave",
  "Emergency Leave",
  "Annual Leave",
  "Unpaid Leave",
];

const INITIAL_LOGS: AttendanceLog[] = [
  {
    id: "EMP-9021",
    employeeName: "Maria Santos",
    role: "Lead Environmental Specialist",
    date: "2026-06-02",
    shift: "Morning Shift",
    clockIn: "07:55 AM",
    clockOut: "04:30 PM",
    status: "Present",
    locationTag: "Washroom Complex B",
    workHours: "8.5 hrs",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    isSelf: true,
  },
  {
    id: "EMP-4481",
    employeeName: "James Kimani",
    role: "Sanitation Operator",
    date: "2026-06-02",
    shift: "Morning Shift",
    clockIn: "08:25 AM",
    clockOut: "05:00 PM",
    status: "Late",
    locationTag: "Lecture Hall Suite 102",
    workHours: "8.5 hrs",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
  },
  {
    id: "EMP-1102",
    employeeName: "Tom Baker",
    role: "Hazmat Disposal Tech",
    date: "2026-06-02",
    shift: "Afternoon Shift",
    clockIn: "02:00 PM",
    clockOut: "10:00 PM",
    status: "Present",
    locationTag: "Advanced Physics Lab 3",
    workHours: "8.0 hrs",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
  },
  {
    id: "EMP-3904",
    employeeName: "Sara Lee",
    role: "Night Supervisor",
    date: "2026-06-01",
    shift: "Night Shift",
    clockIn: "09:00 PM",
    clockOut: "05:00 AM",
    status: "Present",
    locationTag: "Main Admin Quad",
    workHours: "8.0 hrs",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
  },
  {
    id: "EMP-7721",
    employeeName: "Anna Petrov",
    role: "Floor Steward",
    date: "2026-06-01",
    shift: "Afternoon Shift",
    clockIn: "--:--",
    clockOut: "--:--",
    status: "Absent",
    locationTag: "Central Library Atrium",
    workHours: "0.0 hrs",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
  },
];

// ─── Leave Modal ──────────────────────────────────────────────────────────────
const LeaveModal = ({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (req: LeaveRequest) => void;
}) => {
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(300);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!fromDate || !toDate || !reason.trim()) return;
    onSubmit({ type: leaveType, from: fromDate, to: toDate, reason });
    setFromDate("");
    setToDate("");
    setReason("");
    setLeaveType(LEAVE_TYPES[0]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[S.modalOverlay, { opacity: opacityAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
        />
        <Animated.View
          style={[S.modalSheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={S.modalHeader}>
            <View style={S.modalTitleRow}>
              <View style={[S.modalIconBox, { backgroundColor: C.amberLight }]}>
                <FileText size={18} color={C.amber} />
              </View>
              <View>
                <Text style={S.modalTitle}>Apply for Leave</Text>
                <Text style={S.modalSubtitle}>Submit a new leave request</Text>
              </View>
            </View>
            <TouchableOpacity style={S.modalCloseBtn} onPress={onClose}>
              <X size={18} color={C.textSec} />
            </TouchableOpacity>
          </View>

          <View style={S.modalDivider} />

          {/* Leave Type */}
          <View style={S.modalField}>
            <Text style={S.modalFieldLabel}>Leave Type</Text>
            <TouchableOpacity
              style={S.dropdownBtn}
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <Text style={S.dropdownBtnText}>{leaveType}</Text>
              <ChevronDown size={15} color={C.textSec} />
            </TouchableOpacity>
            {showTypeDropdown && (
              <View style={S.dropdownList}>
                {LEAVE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      S.dropdownItem,
                      t === leaveType && S.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setLeaveType(t);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        S.dropdownItemText,
                        t === leaveType && {
                          color: C.indigo,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date Row */}
          <View style={S.dateRow}>
            <View style={[S.modalField, { flex: 1 }]}>
              <Text style={S.modalFieldLabel}>From Date</Text>
              <TextInput
                style={S.modalInput}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={C.textTer}
                value={fromDate}
                onChangeText={setFromDate}
              />
            </View>
            <View style={[S.modalField, { flex: 1 }]}>
              <Text style={S.modalFieldLabel}>To Date</Text>
              <TextInput
                style={S.modalInput}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={C.textTer}
                value={toDate}
                onChangeText={setToDate}
              />
            </View>
          </View>

          {/* Reason */}
          <View style={S.modalField}>
            <Text style={S.modalFieldLabel}>Reason</Text>
            <TextInput
              style={[S.modalInput, S.modalTextarea]}
              placeholder="Briefly describe the reason for leave..."
              placeholderTextColor={C.textTer}
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Actions */}
          <View style={S.modalActions}>
            <TouchableOpacity style={S.modalCancelBtn} onPress={onClose}>
              <Text style={S.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                S.modalSubmitBtn,
                (!fromDate || !toDate || !reason.trim()) &&
                  S.modalSubmitDisabled,
              ]}
              onPress={handleSubmit}
            >
              <Text style={S.modalSubmitText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// ─── Clock In/Out Toast ────────────────────────────────────────────────────────
const Toast = ({ message, visible }: { message: string; visible: boolean }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  return (
    <Animated.View
      style={[
        S.toast,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <CheckCircle2 size={15} color={C.green} />
      <Text style={S.toastText}>{message}</Text>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AttendanceScreen() {
  const [logs, setLogs] = useState<AttendanceLog[]>(INITIAL_LOGS);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastKey, setToastKey] = useState(0);

  // Self employee (isSelf: true) simulates the logged-in user
  const selfLog = logs.find((l) => l.isSelf);
  const isClockedIn = selfLog?.clockIn !== "--:--";
  const isClockedOut = selfLog?.clockOut !== "--:--" && isClockedIn;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastKey((k) => k + 1);
  };

  const handleClockIn = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = (hours % 12 || 12).toString().padStart(2, "0");
    const timeStr = `${h}:${minutes} ${ampm}`;

    const isLate = hours > 8 || (hours === 8 && now.getMinutes() > 15);

    setLogs((prev) =>
      prev.map((l) =>
        l.isSelf
          ? {
              ...l,
              clockIn: timeStr,
              clockOut: "--:--",
              status: isLate ? "Late" : "Present",
            }
          : l,
      ),
    );
    showToast(`Clocked in at ${timeStr}`);
  };

  const handleClockOut = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = (hours % 12 || 12).toString().padStart(2, "0");
    const timeStr = `${h}:${minutes} ${ampm}`;
    setLogs((prev) =>
      prev.map((l) => (l.isSelf ? { ...l, clockOut: timeStr } : l)),
    );
    showToast(`Clocked out at ${timeStr}`);
  };

  const handleLeaveSubmit = (req: LeaveRequest) => {
    showToast(`${req.type} request submitted`);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.locationTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <View style={S.screen}>
      {/* ── My Attendance Action Bar ───────────────────────────────── */}
      <FadeInUp delay={0}>
        <View style={S.myAttendanceBar}>
          <View style={S.myAttendanceLeft}>
            <Image source={{ uri: selfLog?.avatarUrl }} style={S.myAvatar} />
            <View>
              <Text style={S.myName}>{selfLog?.employeeName ?? "You"}</Text>
              <Text style={S.myShift}>{selfLog?.shift ?? "Morning Shift"}</Text>
              <Text style={S.myId}>{selfLog?.id ?? "ID not available"}</Text>
            </View>
          </View>

          <View style={S.myAttendanceActions}>
            <TouchableOpacity
              style={S.leaveBtn}
              onPress={() => setLeaveModalVisible(true)}
            >
              <FileText size={14} color={C.amber} />
              <Text style={S.leaveBtnText}>Apply Leave</Text>
            </TouchableOpacity>

            {/* Clock In / Out */}
            {!isClockedIn ? (
              <TouchableOpacity style={S.clockInBtn} onPress={handleClockIn}>
                <LogIn size={15} color={C.white} />
                <Text style={S.clockBtnText}>Clock In</Text>
              </TouchableOpacity>
            ) : !isClockedOut ? (
              <TouchableOpacity style={S.clockOutBtn} onPress={handleClockOut}>
                <LogOut size={15} color={C.white} />
                <Text style={S.clockBtnText}>Clock Out</Text>
              </TouchableOpacity>
            ) : (
              <View style={S.clockDoneChip}>
                <CheckCircle2 size={13} color={C.green} />
                <Text style={S.clockDoneText}>Done</Text>
              </View>
            )}
          </View>
        </View>

        {/* Today's own time summary if clocked in */}
        {isClockedIn && (
          <View style={S.selfTimeRow}>
            <View style={S.selfTimeBlock}>
              <Clock size={12} color={C.indigo} />
              <Text style={S.selfTimeLabel}>In</Text>
              <Text style={S.selfTimeVal}>{selfLog?.clockIn}</Text>
            </View>
            <View style={S.selfTimeDivider} />
            <View style={S.selfTimeBlock}>
              <Clock size={12} color={isClockedOut ? C.red : C.textTer} />
              <Text style={S.selfTimeLabel}>Out</Text>
              <Text
                style={[S.selfTimeVal, !isClockedOut && { color: C.textTer }]}
              >
                {isClockedOut ? selfLog?.clockOut : "—"}
              </Text>
            </View>
            <View style={S.selfTimeDivider} />
            <View style={S.selfTimeBlock}>
              <MapPin size={12} color={C.green} />
              <Text style={S.selfTimeLabel}>Zone</Text>
              <Text style={S.selfTimeVal} numberOfLines={1}>
                {selfLog?.locationTag}
              </Text>
            </View>
          </View>
        )}
      </FadeInUp>

      <ScrollView
        contentContainerStyle={S.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInUp delay={100}>
          <View style={S.toolbarRow}>
            <View style={S.searchBarContainer}>
              <Search size={18} color={C.textTer} style={S.searchIcon} />
              <TextInput
                placeholder="Search staff, ID, zone..."
                placeholderTextColor={C.textTer}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[
                  S.searchInputField,
                  Platform.OS === "web" && ({ outline: "none" } as any),
                ]}
              />
            </View>

            <View style={S.toggleWrapper}>
              <TouchableOpacity
                style={[S.toggleBtn, viewMode === "card" && S.toggleBtnActive]}
                onPress={() => setViewMode("card")}
              >
                <LayoutGrid
                  size={18}
                  color={viewMode === "card" ? C.white : C.textSec}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[S.toggleBtn, viewMode === "table" && S.toggleBtnActive]}
                onPress={() => setViewMode("table")}
              >
                <Table
                  size={18}
                  color={viewMode === "table" ? C.white : C.textSec}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={S.filterRibbon}
          >
            {["All", "Present", "Late", "Absent"].map((st) => {
              const isSelected = statusFilter === st;
              return (
                <TouchableOpacity
                  key={st}
                  onPress={() => setStatusFilter(st)}
                  style={[S.filterPill, isSelected && S.filterPillActive]}
                >
                  <Text
                    style={[
                      S.filterPillText,
                      isSelected && S.filterPillTextActive,
                    ]}
                  >
                    {st}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeInUp>

        {viewMode === "card" ? (
          <View style={S.ledgerGridContainer}>
            {filteredLogs.map((log, index) => {
              const statusCfg = STATUS_MAP[log.status] || STATUS_MAP["Present"];
              return (
                <FadeInUp key={log.id} delay={120 + index * 40}>
                  <View style={[S.attendanceCard, log.isSelf && S.selfCard]}>
                    {log.isSelf && (
                      <View style={S.selfCardBadge}>
                        <Text style={S.selfCardBadgeText}>You</Text>
                      </View>
                    )}
                    <View style={S.cardTopRow}>
                      <View style={S.identityCluster}>
                        <Image
                          source={{ uri: log.avatarUrl }}
                          style={S.cardAvatarImage}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={S.employeeNameText}>
                            {log.employeeName}
                          </Text>
                          <Text style={S.roleText}>
                            {log.role} •{" "}
                            <Text style={{ fontWeight: "700" }}>{log.id}</Text>
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          S.statusBadge,
                          { backgroundColor: statusCfg.bg },
                        ]}
                      >
                        <Text
                          style={[
                            S.statusBadgeText,
                            { color: statusCfg.color },
                          ]}
                        >
                          {statusCfg.label}
                        </Text>
                      </View>
                    </View>

                    <View style={S.cardDivider} />

                    <View style={S.cardMetricsRow}>
                      <View style={S.timeBlock}>
                        <Clock size={14} color={C.textSec} />
                        <Text style={S.timeLabel}>In:</Text>
                        <Text style={S.timeValue}>{log.clockIn}</Text>
                      </View>
                      <View style={S.timeBlock}>
                        <Clock size={14} color={C.textSec} />
                        <Text style={S.timeLabel}>Out:</Text>
                        <Text style={S.timeValue}>{log.clockOut}</Text>
                      </View>
                      <View style={[S.timeBlock, { marginLeft: "auto" }]}>
                        <CalendarIcon size={14} color={C.textSec} />
                        <Text style={S.timeValue}>{log.workHours}</Text>
                      </View>
                    </View>

                    {log.status !== "Absent" && (
                      <View style={S.geoTagRow}>
                        <MapPin size={13} color={C.indigo} />
                        <Text style={S.geoTagText} numberOfLines={1}>
                          Verified at {log.locationTag}
                        </Text>
                      </View>
                    )}
                  </View>
                </FadeInUp>
              );
            })}
          </View>
        ) : (
          <FadeInUp delay={120}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={S.tableOuterScroll}
            >
              <View style={S.tableContainerBlock}>
                <View style={S.tableHeaderRow}>
                  <Text style={[S.tableHeadCell, { width: 80 }]}>Staff</Text>
                  <Text style={[S.tableHeadCell, { width: 120 }]}>
                    Employee ID
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 200 }]}>
                    Staff Member
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 130 }]}>
                    Shift Period
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 120 }]}>
                    Clock In
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 120 }]}>
                    Clock Out
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 120 }]}>
                    Status Badge
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 120 }]}>
                    Duration
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 150 }]}>
                    Verified Location
                  </Text>
                </View>

                {filteredLogs.map((log, index) => {
                  const statusCfg =
                    STATUS_MAP[log.status] || STATUS_MAP["Present"];
                  return (
                    <View
                      key={log.id}
                      style={[
                        S.tableBodyRow,
                        index % 2 === 1 && { backgroundColor: C.bg },
                        log.isSelf && { backgroundColor: C.indigoLight },
                      ]}
                    >
                      <View style={{ width: 80 }}>
                        <Image
                          source={{ uri: log.avatarUrl }}
                          style={S.tableRowAvatar}
                        />
                      </View>
                      <Text
                        style={[
                          S.tableCellText,
                          { width: 120, fontWeight: "700" },
                        ]}
                      >
                        {log.id}
                      </Text>
                      <View style={{ width: 200, paddingRight: 8 }}>
                        <Text style={S.tableEmpNameText} numberOfLines={1}>
                          {log.employeeName}
                          {log.isSelf ? " (You)" : ""}
                        </Text>
                        <Text
                          style={{ fontSize: 11, color: C.textSec }}
                          numberOfLines={1}
                        >
                          {log.role}
                        </Text>
                      </View>
                      <Text
                        style={[S.tableCellText, { width: 130 }]}
                        numberOfLines={1}
                      >
                        {log.shift}
                      </Text>
                      <Text
                        style={[
                          S.tableCellText,
                          {
                            width: 120,
                            color:
                              log.status === "Late" ? C.amber : C.textPrimary,
                          },
                        ]}
                      >
                        {log.clockIn}
                      </Text>
                      <Text style={[S.tableCellText, { width: 120 }]}>
                        {log.clockOut}
                      </Text>
                      <View style={{ width: 120, justifyContent: "center" }}>
                        <View
                          style={[
                            S.statusBadge,
                            {
                              backgroundColor: statusCfg.bg,
                              alignSelf: "flex-start",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              S.statusBadgeText,
                              { color: statusCfg.color },
                            ]}
                          >
                            {statusCfg.label}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          S.tableCellText,
                          { width: 120, fontWeight: "600" },
                        ]}
                      >
                        {log.workHours}
                      </Text>
                      <Text
                        style={[
                          S.tableCellText,
                          { width: 200, fontWeight: "600" },
                        ]}
                      >
                        {log.locationTag}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </FadeInUp>
        )}

        {filteredLogs.length === 0 && (
          <View style={S.emptyBoxContainer}>
            <CheckCircle2 size={38} color={C.textTer} />
            <Text style={S.emptyTitleText}>No Log Files Evaluated</Text>
            <Text style={S.emptySubtitleText}>
              No active check-ins matched your selection parameters matrix
              rules.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── Leave Modal ──────────────────────────────────────────── */}
      <LeaveModal
        visible={leaveModalVisible}
        onClose={() => setLeaveModalVisible(false)}
        onSubmit={handleLeaveSubmit}
      />

      {/* ── Toast ────────────────────────────────────────────────── */}
      <Toast key={toastKey} message={toastMsg} visible={!!toastMsg} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbececb5" },
  content: { padding: isWide ? 28 : 20, paddingBottom: 50 },

  // ── My Attendance Bar ─────────────────────────────────────────
  myAttendanceBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#5C2E14",
    paddingHorizontal: isWide ? 28 : 16,
    paddingVertical: 14,
    gap: 12,
    flexWrap: "wrap",
  },
  myAttendanceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  myAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.indigoLight,
  },
  myName: {
    fontSize: 20,
    fontWeight: "700",
    color: C.white,
  },
  myShift: {
    fontSize: 12,
    color: C.white,
    marginTop: 1,
  },
  myId: {
    fontSize: 12,
    color: C.red,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  myAttendanceActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  leaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.amberLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  leaveBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.amber,
  },
  clockInBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.green,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  clockOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.red,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  clockBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.white,
  },
  clockDoneChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.greenLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  clockDoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.green,
  },

  // Self time summary strip
  selfTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.indigoLight,
    paddingHorizontal: isWide ? 28 : 16,
    paddingVertical: 10,
    gap: 0,
  },
  selfTimeBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
  },
  selfTimeDivider: {
    width: 1,
    height: 18,
    backgroundColor: C.border,
  },
  selfTimeLabel: {
    fontSize: 11,
    color: C.textSec,
    fontWeight: "500",
  },
  selfTimeVal: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textPrimary,
    flexShrink: 1,
  },

  // ── Self card highlight ───────────────────────────────────────
  selfCard: {
    borderColor: C.indigo,
    borderWidth: 1.5,
    position: "relative",
  },
  selfCardBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: C.indigoLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 1,
  },
  selfCardBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: C.indigo,
    letterSpacing: 0.5,
  },

  // ── Leave Modal ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSheet: {
    backgroundColor: C.white,
    borderRadius: 24,

    padding: 20,
    maxHeight: "85%",
    width: isWide ? 500 : "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 12,
    color: C.textSec,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  modalDivider: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 20,
  },
  modalField: {
    marginBottom: 16,
  },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textSec,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: C.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    fontWeight: "500",
    color: C.textPrimary,
  },
  modalTextarea: {
    height: 80,
    paddingTop: 11,
  },
  dropdownBtn: {
    backgroundColor: C.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: C.textPrimary,
  },
  dropdownList: {
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 4,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 99,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  dropdownItemActive: {
    backgroundColor: C.indigoLight,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: C.textPrimary,
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textSec,
  },
  modalSubmitBtn: {
    flex: 2,
    backgroundColor: C.indigo,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalSubmitDisabled: {
    opacity: 0.45,
  },
  modalSubmitText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.white,
  },

  // ── Toast ─────────────────────────────────────────────────────
  toast: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    backgroundColor: C.dark2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  toastText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.white,
  },

  // ── Existing styles (unchanged) ────────────────────────────────
  heroContainer: {
    padding: isWide ? 32 : 24,
    borderRadius: 24,
    marginBottom: 24,
    backgroundColor: C.dark2,
  },
  heroMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  heroTitle: {
    color: C.white,
    fontSize: isWide ? 32 : 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: C.textTer,
    fontSize: isWide ? 15 : 13,
    marginTop: 6,
    opacity: 0.9,
    lineHeight: 18,
  },
  metricsStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 26,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    flexWrap: "wrap",
    gap: 16,
  },
  metricBlock: { alignItems: "center", minWidth: 60 },
  metricNumber: { fontSize: 24, fontWeight: "800", color: C.white },
  metricLabel: { fontSize: 13, color: C.textTer, marginTop: 4 },
  stripDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  toolbarRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
    alignItems: "center",
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInputField: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: C.border,
    borderRadius: 12,
    padding: 4,
    gap: 2,
  },
  toggleBtn: { padding: 8, borderRadius: 10 },
  toggleBtnActive: { backgroundColor: C.dark2 },
  filterRibbon: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 6,
    marginBottom: 20,
  },
  filterPill: {
    backgroundColor: C.white,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterPillActive: { backgroundColor: C.indigo, borderColor: C.indigo },
  filterPillText: { fontSize: 13, fontWeight: "600", color: C.textSec },
  filterPillTextActive: { color: C.white },
  ledgerGridContainer: { gap: 16 },
  attendanceCard: {
    backgroundColor: C.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  identityCluster: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    alignItems: "center",
  },
  cardAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: C.indigoLight,
  },
  employeeNameText: { fontSize: 16, fontWeight: "700", color: C.textPrimary },
  roleText: { fontSize: 13, color: C.textSec, marginTop: 2 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: "700" },
  cardDivider: { height: 1, backgroundColor: C.border, marginVertical: 14 },
  cardMetricsRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
  },
  timeBlock: { flexDirection: "row", alignItems: "center", gap: 5 },
  timeLabel: { fontSize: 13, color: C.textSec, fontWeight: "500" },
  timeValue: { fontSize: 14, color: C.textPrimary, fontWeight: "600" },
  geoTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: C.bg,
    padding: 8,
    borderRadius: 10,
  },
  geoTagText: { fontSize: 13, fontWeight: "500", color: C.textSec },
  tableOuterScroll: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  tableContainerBlock: { padding: 16 },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 10,
    marginBottom: 6,
  },
  tableHeadCell: { fontSize: 13, fontWeight: "700", color: C.textSec },
  tableBodyRow: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRowAvatar: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: C.bg,
  },
  tableCellText: {
    fontSize: 14,
    fontWeight: "500",
    color: C.textPrimary,
    paddingRight: 8,
  },
  tableEmpNameText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
  },
  emptyBoxContainer: { alignItems: "center", padding: 44 },
  emptyTitleText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textSec,
    marginTop: 10,
  },
  emptySubtitleText: {
    fontSize: 13,
    color: C.textTer,
    marginTop: 4,
    textAlign: "center",
  },
});
