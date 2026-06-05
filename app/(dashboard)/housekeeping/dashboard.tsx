import { LinearGradient } from "expo-linear-gradient";
import {
  AlertTriangle,
  BrushIcon,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Flame,
  Package,
  Phone,
  Plus,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
  X,
  XCircle,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const { width: SW } = Dimensions.get("window");
const isWide = SW > 900;
const isMobile = SW <= 480;

type StatusKey = "done" | "in-progress" | "pending" | "active" | "break";
type AlertLevel = "critical" | "warning" | "info";
type ChartMode = "bar" | "line";
type ModalKey = "assign" | "alert" | "report" | "call" | "reportDetail" | null;

// ─── Validation Types ──────────────────────────────────────────────────────────
interface ValidationError {
  field: string;
  message: string;
}

interface FeedbackState {
  type: "success" | "error" | null;
  message: string;
}

// ─── Validation Utilities ──────────────────────────────────────────────────────

const ROOM_REGEX = /^[a-zA-Z0-9\s\-\/,\.#]+$/;
const MIN_DESC_LENGTH = 10;
const MAX_DESC_LENGTH = 500;
const MAX_ROOM_LENGTH = 60;
const MAX_NAME_LENGTH = 80;

function validateRoom(room: string): string | null {
  const trimmed = room.trim();
  if (!trimmed) return "Room / Area is required.";
  if (trimmed.length < 2) return "Room / Area must be at least 2 characters.";
  if (trimmed.length > MAX_ROOM_LENGTH)
    return `Room / Area must be at most ${MAX_ROOM_LENGTH} characters.`;
  if (!ROOM_REGEX.test(trimmed))
    return "Room / Area contains invalid characters.";
  return null;
}

function validateLocation(loc: string): string | null {
  const trimmed = loc.trim();
  if (!trimmed) return "Location is required.";
  if (trimmed.length < 2) return "Location must be at least 2 characters.";
  if (trimmed.length > MAX_ROOM_LENGTH)
    return `Location must be at most ${MAX_ROOM_LENGTH} characters.`;
  if (!ROOM_REGEX.test(trimmed)) return "Location contains invalid characters.";
  return null;
}

function validateDescription(desc: string): string | null {
  const trimmed = desc.trim();
  if (!trimmed) return "Description is required.";
  if (trimmed.length < MIN_DESC_LENGTH)
    return `Description must be at least ${MIN_DESC_LENGTH} characters.`;
  if (trimmed.length > MAX_DESC_LENGTH)
    return `Description must be at most ${MAX_DESC_LENGTH} characters.`;
  return null;
}

function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Name(s) is required.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (trimmed.length > MAX_NAME_LENGTH)
    return `Name must be at most ${MAX_NAME_LENGTH} characters.`;
  return null;
}

function validateReportLocation(loc: string): string | null {
  const trimmed = loc.trim();
  if (!trimmed) return "Location is required.";
  if (trimmed.length < 2) return "Location must be at least 2 characters.";
  return null;
}

function validateReportDetails(details: string): string | null {
  const trimmed = details.trim();
  if (!trimmed) return "Details are required.";
  if (trimmed.length < MIN_DESC_LENGTH)
    return `Details must be at least ${MIN_DESC_LENGTH} characters.`;
  if (trimmed.length > MAX_DESC_LENGTH)
    return `Details must be at most ${MAX_DESC_LENGTH} characters.`;
  return null;
}

interface StatItem {
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  grad: [string, string];
  trend: "up" | "down";
  trendVal: string;
}

interface AlertItem {
  level: AlertLevel;
  msg: string;
  time: string;
  icon: React.ElementType;
}

interface ScheduleItem {
  room: string;
  staff: string;
  time: string;
  type: string;
  status: StatusKey;
}

interface ActivityItem {
  icon: React.ElementType;
  color: string;
  bg: string;
  msg: string;
  who: string;
  time: string;
}

interface StaffMember {
  name: string;
  role: string;
  tasks: number;
  done: number;
  rating: number;
  status: "active" | "break";
}

interface ReportItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  sub: string;
  details: Record<string, string | number>;
}

interface SupplyItem {
  item: string;
  used: number;
  max: number;
  color: string;
  unit: string;
}

const FadeIn = ({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) => {
  const op = useRef(new Animated.Value(0)).current;
  const sl = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(op, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sl, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);
  return (
    <Animated.View
      style={[{ opacity: op, transform: [{ translateY: sl }] }, style]}
    >
      {children}
    </Animated.View>
  );
};

const INITIAL_STATS: StatItem[] = [
  {
    label: "Total Staff",
    value: 24,
    sub: "18 on shift today",
    icon: Users,
    grad: ["#6366f1", "#818cf8"],
    trend: "up",
    trendVal: "+2",
  },
  {
    label: "Pending Tasks",
    value: 12,
    sub: "4 overdue",
    icon: ClipboardList,
    grad: ["#f59e0b", "#fbbf24"],
    trend: "down",
    trendVal: "-3",
  },
  {
    label: "Completed",
    value: 87,
    sub: "Today's tasks",
    icon: CheckCircle2,
    grad: ["#10b981", "#34d399"],
    trend: "up",
    trendVal: "+12",
  },
  {
    label: "Maintenance",
    value: 5,
    sub: "3 urgent",
    icon: Wrench,
    grad: ["#ef4444", "#f87171"],
    trend: "down",
    trendVal: "+1",
  },
];

const INITIAL_ALERTS: AlertItem[] = [
  {
    level: "critical",
    msg: "Biohazard spill — Room 304 · Immediate attention required",
    time: "5 min ago",
    icon: ShieldAlert,
  },
  {
    level: "warning",
    msg: "Linen supply running low — Floor 3 stock at 15%",
    time: "18 min ago",
    icon: AlertTriangle,
  },
  {
    level: "warning",
    msg: "Staff shortage — Floor 2 afternoon shift understaffed",
    time: "45 min ago",
    icon: Users,
  },
  {
    level: "info",
    msg: "VIP check-in — Room 512 needs priority servicing by 2 PM",
    time: "1 hr ago",
    icon: Star,
  },
];

const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    room: "Floor 1 — Lobby",
    staff: "Maria S.",
    time: "07:00 AM",
    type: "Deep Clean",
    status: "done",
  },
  {
    room: "Room 215",
    staff: "James K.",
    time: "08:30 AM",
    type: "Turn Down",
    status: "in-progress",
  },
  {
    room: "Conference A",
    staff: "Anna P.",
    time: "09:00 AM",
    type: "Sanitize",
    status: "in-progress",
  },
  {
    room: "Room 301",
    staff: "Tom B.",
    time: "10:00 AM",
    type: "Check-out Clean",
    status: "pending",
  },
  {
    room: "Pool Area",
    staff: "Sara L.",
    time: "10:30 AM",
    type: "Routine Clean",
    status: "pending",
  },
  {
    room: "Room 412",
    staff: "Luis M.",
    time: "11:00 AM",
    type: "Linen Change",
    status: "pending",
  },
  {
    room: "Restaurant",
    staff: "Priya N.",
    time: "12:00 PM",
    type: "Deep Clean",
    status: "pending",
  },
];

const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    icon: CheckCircle2,
    color: "#10b981",
    bg: "#d1fae5",
    msg: "Room 118 cleaning marked complete",
    who: "Maria S.",
    time: "8 min ago",
  },
  {
    icon: Wrench,
    color: "#f59e0b",
    bg: "#fef3c7",
    msg: "Maintenance ticket raised — Room 412 AC",
    who: "Tom B.",
    time: "22 min ago",
  },
  {
    icon: Package,
    color: "#6366f1",
    bg: "#eef2ff",
    msg: "Linen inventory restocked — Floor 2",
    who: "Admin",
    time: "1 hr ago",
  },
  {
    icon: UserCheck,
    color: "#0ea5e9",
    bg: "#e0f2fe",
    msg: "Staff check-in · 6 members clocked in",
    who: "System",
    time: "1 hr ago",
  },
  {
    icon: RefreshCw,
    color: "#8b5cf6",
    bg: "#ede9fe",
    msg: "Area inspection completed — Lobby",
    who: "Luis M.",
    time: "3 hr ago",
  },
  {
    icon: Star,
    color: "#f59e0b",
    bg: "#fef3c7",
    msg: "Guest review received · Room 305 ★ 4.8",
    who: "System",
    time: "2 hr ago",
  },
];

const STAFF: StaffMember[] = [
  {
    name: "Maria Santos",
    role: "Senior HK",
    tasks: 9,
    done: 9,
    rating: 4.9,
    status: "active",
  },
  {
    name: "James Kimani",
    role: "HK Attendant",
    tasks: 7,
    done: 5,
    rating: 4.6,
    status: "active",
  },
  {
    name: "Anna Petrov",
    role: "HK Attendant",
    tasks: 6,
    done: 6,
    rating: 4.8,
    status: "break",
  },
  {
    name: "Tom Baker",
    role: "Maintenance",
    tasks: 5,
    done: 2,
    rating: 4.3,
    status: "active",
  },
  {
    name: "Sara Lee",
    role: "HK Attendant",
    tasks: 8,
    done: 6,
    rating: 4.7,
    status: "active",
  },
];

const REPORTS: ReportItem[] = [
  {
    id: "daily",
    label: "Daily Cleaning Report",
    icon: BrushIcon,
    color: "#4338ca",
    bg: "#eef2ff",
    sub: "87 tasks · 94% complete",
    details: {
      Completed: 87,
      Pending: 12,
      Efficiency: "94%",
      Floors: 4,
      Remarks: "Excellent performance today",
    },
  },
  {
    id: "staff",
    label: "Staff Performance",
    icon: UserCheck,
    color: "#10b981",
    bg: "#d1fae5",
    sub: "Avg rating 4.7 ★",
    details: {
      Staff: 24,
      Active: 18,
      "Avg Rating": "4.7 ★",
      Productivity: "+5%",
      Remarks: "Productivity improved by 5%",
    },
  },
  {
    id: "maint",
    label: "Maintenance Report",
    icon: Wrench,
    color: "#f59e0b",
    bg: "#fef3c7",
    sub: "5 open · 12 resolved",
    details: {
      Open: 5,
      Resolved: 12,
      Urgent: 3,
      "Avg Resolution": "2.4 hrs",
      Remarks: "Most resolved within SLA",
    },
  },
];

const ANALYTICS = [
  {
    label: "Cleaning\nEfficiency",
    value: 94,
    color: "#6366f1",
    trend: "+2.3%",
    up: true,
  },
  {
    label: "Staff\nProductivity",
    value: 88,
    color: "#10b981",
    trend: "+5.1%",
    up: true,
  },
  {
    label: "Complaint\nResolution",
    value: 72,
    color: "#f59e0b",
    trend: "-1.2%",
    up: false,
  },
  {
    label: "Supply\nConsumption",
    value: 61,
    color: "#ef4444",
    trend: "+8.4%",
    up: false,
  },
];

const WEEK_DATA = [
  { day: "Mon", tasks: 72, complaints: 3 },
  { day: "Tue", tasks: 88, complaints: 1 },
  { day: "Wed", tasks: 65, complaints: 5 },
  { day: "Thu", tasks: 91, complaints: 2 },
  { day: "Fri", tasks: 78, complaints: 4 },
  { day: "Sat", tasks: 95, complaints: 1 },
  { day: "Sun", tasks: 60, complaints: 2 },
];

const SUPPLY: SupplyItem[] = [
  { item: "Bed Linen", used: 320, max: 400, color: "#6366f1", unit: "sets" },
  { item: "Towels", used: 180, max: 220, color: "#0ea5e9", unit: "pcs" },
  {
    item: "Cleaning Chemicals",
    used: 45,
    max: 80,
    color: "#10b981",
    unit: "L",
  },
  { item: "Toiletries", used: 290, max: 300, color: "#f59e0b", unit: "kits" },
  { item: "Trash Bags", used: 140, max: 200, color: "#8b5cf6", unit: "rolls" },
];

const STATUS_MAP: Record<
  StatusKey,
  { label: string; color: string; bg: string }
> = {
  done: { label: "Done", color: "#10b981", bg: "#d1fae5" },
  "in-progress": { label: "In Progress", color: "#6366f1", bg: "#eef2ff" },
  pending: { label: "Pending", color: "#f59e0b", bg: "#fef3c7" },
  active: { label: "On Duty", color: "#10b981", bg: "#d1fae5" },
  break: { label: "On Break", color: "#f59e0b", bg: "#fef3c7" },
};

const ALERT_STYLE: Record<AlertLevel, { border: string; bg: string }> = {
  critical: { border: "#ef4444", bg: "#fff5f5" },
  warning: { border: "#f59e0b", bg: "#fffbeb" },
  info: { border: "#6366f1", bg: "#eef2ff" },
};

const STAFF_OPTIONS = [
  "Maria Santos",
  "James Kimani",
  "Anna Petrov",
  "Tom Baker",
  "Sara Lee",
  "Luis Morales",
  "Priya Nair",
];
const TASK_TYPES = [
  "Deep Clean",
  "Turn Down",
  "Linen Change",
  "Routine Clean",
  "Sanitize",
  "Check-out Clean",
  "Inspection",
];
const ALERT_TYPES = [
  "Biohazard",
  "Safety hazard",
  "Staff shortage",
  "Supply emergency",
  "Maintenance urgent",
  "VIP request",
];
const REPORT_TYPES = [
  "Incident report",
  "Cleaning log",
  "Maintenance note",
  "Guest complaint",
  "Inventory update",
];

// ─── Reusable Animated Primitives ─────────────────────────────────────────────

const AnimatedCounter: React.FC<{ value: number; style?: any }> = ({
  value,
  style,
}) => {
  const [n, setN] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value: v }) => setN(Math.floor(v)));
    return () => anim.removeListener(id);
  }, [value]);

  return <Text style={style}>{n}</Text>;
};

const AnimatedBar: React.FC<{
  percent: number;
  color: string;
  delay?: number;
  height?: number;
}> = ({ percent, color, delay = 0, height = 6 }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(anim, {
        toValue: percent,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, delay);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <View
      style={{
        height,
        backgroundColor: "#f1f5f9",
        borderRadius: 4,
        overflow: "hidden",
        flex: 1,
      }}
    >
      <Animated.View
        style={{
          height: "100%",
          backgroundColor: color,
          borderRadius: 4,
          width: anim.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </View>
  );
};

const PulseDot: React.FC<{ color?: string }> = ({ color = "#07f261" }) => {
  const p = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(p, {
          toValue: 1.8,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(p, {
          toValue: 1,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View
      style={{
        width: 10,
        height: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          opacity: 0.3,
          transform: [{ scale: p }],
        }}
      />
      <View
        style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }}
      />
    </View>
  );
};

const FadeSlideIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: any;
}> = ({ children, delay = 0, style }) => {
  const op = useRef(new Animated.Value(0)).current;
  const sl = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(op, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sl, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  return (
    <Animated.View
      style={[{ opacity: op, transform: [{ translateY: sl }] }, style]}
    >
      {children}
    </Animated.View>
  );
};

const RingProgress: React.FC<{
  percent: number;
  color: string;
  size?: number;
}> = ({ percent, color, size = 64 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color + "18",
      borderWidth: 3,
      borderColor: color + "30",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.22, fontWeight: "800", color }}>
      {percent}%
    </Text>
  </View>
);

// ─── UI Helpers ───────────────────────────────────────────────────────────────

const Card: React.FC<{ children: React.ReactNode; style?: any }> = ({
  children,
  style,
}) => <View style={[S.card, style]}>{children}</View>;

const CardHeader: React.FC<{ title: string; right?: React.ReactNode }> = ({
  title,
  right,
}) => (
  <View style={S.cardHeader}>
    <Text style={S.cardTitle} numberOfLines={1}>
      {title}
    </Text>
    {right}
  </View>
);

const SectionLabel: React.FC<{ children: string }> = ({ children }) => (
  <View style={S.secLabelRow}>
    <View style={S.secLabelDot} />
    <Text style={S.secLabelText}>{children}</Text>
  </View>
);

const Pill: React.FC<{ label: string; color: string; bg: string }> = ({
  label,
  color,
  bg,
}) => (
  <View style={[S.pill, { backgroundColor: bg }]}>
    <Text style={[S.pillText, { color }]}>{label}</Text>
  </View>
);

const TrendBadge: React.FC<{ up: boolean; val: string }> = ({ up, val }) => (
  <View style={[S.trendBadge, { backgroundColor: up ? "#d1fae5" : "#fee2e2" }]}>
    {up ? (
      <TrendingUp size={10} color="#10b981" />
    ) : (
      <TrendingDown size={10} color="#ef4444" />
    )}
    <Text style={[S.trendText, { color: up ? "#10b981" : "#ef4444" }]}>
      {val}
    </Text>
  </View>
);

const ViewAllBtn: React.FC<{ label?: string }> = ({ label = "View all" }) => (
  <TouchableOpacity style={S.viewAllBtn}>
    <Text style={S.viewAllText}>{label}</Text>
    <ChevronRight size={13} color="#6366f1" />
  </TouchableOpacity>
);

// ─── Feedback Banner (Success + Error) ───────────────────────────────────────

const FeedbackBanner: React.FC<{
  feedback: FeedbackState;
  onDismiss?: () => void;
}> = ({ feedback, onDismiss }) => {
  if (!feedback.type) return null;

  const isSuccess = feedback.type === "success";

  return (
    <View
      style={[
        S.feedbackBanner,
        isSuccess ? S.feedbackSuccess : S.feedbackError,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={S.feedbackIconRow}>
        {isSuccess ? (
          <CheckCircle2 size={15} color={isSuccess ? "#065f46" : "#991b1b"} />
        ) : (
          <XCircle size={15} color="#991b1b" />
        )}
        <Text
          style={[S.feedbackText, { color: isSuccess ? "#065f46" : "#991b1b" }]}
        >
          {feedback.message}
        </Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={S.feedbackDismiss}>
          <X size={12} color={isSuccess ? "#065f46" : "#991b1b"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Field Error ──────────────────────────────────────────────────────────────

const FieldError: React.FC<{ error?: string }> = ({ error }) => {
  if (!error) return null;
  return (
    <View style={S.fieldErrorRow}>
      <AlertTriangle size={11} color="#dc2626" />
      <Text style={S.fieldErrorText}>{error}</Text>
    </View>
  );
};

// ─── Character Counter ────────────────────────────────────────────────────────

const CharCounter: React.FC<{
  current: number;
  max: number;
  min?: number;
}> = ({ current, max, min }) => {
  const remaining = max - current;
  const tooShort = min !== undefined && current > 0 && current < min;
  const tooLong = current > max;
  const color = tooLong ? "#dc2626" : tooShort ? "#d97706" : "#94a3b8";
  return (
    <Text style={[S.charCounter, { color }]}>
      {tooLong
        ? `${remaining} over limit`
        : tooShort
          ? `${min - current} more chars needed`
          : `${remaining} remaining`}
    </Text>
  );
};

// ─── Modal Shell ──────────────────────────────────────────────────────────────

const ModalShell: React.FC<{
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ visible, onClose, children }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={S.modalOverlay}
    >
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={S.modalCard}>
        <TouchableOpacity style={S.modalCloseBtn} onPress={onClose}>
          <X size={14} color="#64748b" />
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

// ─── Form helpers ─────────────────────────────────────────────────────────────

const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}> = ({ label, children, error, hint }) => (
  <View style={S.formGroup}>
    <Text style={S.formLabel}>{label}</Text>
    {children}
    {hint && !error && <Text style={S.fieldHint}>{hint}</Text>}
    <FieldError error={error} />
  </View>
);

// Simple picker using TouchableOpacity cycle (no native Picker dependency)
const CyclePicker: React.FC<{
  options: string[];
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}> = ({ options, value, onChange, hasError }) => {
  const idx = options.indexOf(value);
  const next = () => onChange(options[(idx + 1) % options.length]);
  return (
    <TouchableOpacity
      style={[S.cyclePicker, hasError && S.inputError]}
      onPress={next}
    >
      <Text style={S.cyclePickerText} numberOfLines={1}>
        {value}
      </Text>
      <ChevronRight size={14} color="#64748b" />
    </TouchableOpacity>
  );
};

const PrimaryButton: React.FC<{
  label: string;
  icon?: React.ReactNode;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
}> = ({ label, icon, color = "#6366f1", onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={disabled ? 1 : 0.85}
    style={[S.primaryBtn, { backgroundColor: disabled ? "#94a3b8" : color }]}
    disabled={disabled}
  >
    {icon}
    <Text style={S.primaryBtnText}>{label}</Text>
  </TouchableOpacity>
);

// ─── Assign Task Modal ────────────────────────────────────────────────────────

const AssignTaskModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: (d: { room: string; staff: string; type: string }) => void;
}> = ({ visible, onClose, onSubmit }) => {
  const [room, setRoom] = useState("");
  const [staff, setStaff] = useState(STAFF_OPTIONS[0]);
  const [type, setType] = useState(TASK_TYPES[0]);
  const [priority, setPriority] = useState("Normal");
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: null,
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setRoom("");
      setStaff(STAFF_OPTIONS[0]);
      setType(TASK_TYPES[0]);
      setPriority("Normal");
      setFeedback({ type: null, message: "" });
      setErrors({});
      setTouched({});
    }
  }, [visible]);

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const roomErr = validateRoom(room);
    if (roomErr) errs.room = roomErr;
    return errs;
  };

  const handleRoomBlur = () => {
    setTouched((t) => ({ ...t, room: true }));
    const errs = validate();
    setErrors(errs);
  };

  const submit = () => {
    const allTouched = { room: true };
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      setFeedback({
        type: "error",
        message: "Please fix the errors below before submitting.",
      });
      return;
    }

    onSubmit({ room: room.trim(), staff, type });
    setFeedback({ type: "success", message: "Task assigned successfully!" });
    setTimeout(() => {
      setFeedback({ type: null, message: "" });
      onClose();
    }, 1800);
  };

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={S.modalTitle}>Assign Task</Text>
      <Text style={S.modalSub}>Create and assign a new housekeeping task</Text>

      <FeedbackBanner
        feedback={feedback}
        onDismiss={() => setFeedback({ type: null, message: "" })}
      />

      <FormField
        label="Room / Area *"
        error={touched.room ? errors.room : undefined}
        hint="e.g. Room 301, Lobby, Conference A"
      >
        <TextInput
          style={[
            S.input,
            touched.room && errors.room ? S.inputError : undefined,
          ]}
          value={room}
          onChangeText={(v) => {
            setRoom(v);
            if (touched.room) {
              const err = validateRoom(v);
              setErrors((e) => ({ ...e, room: err ?? "" }));
            }
          }}
          onBlur={handleRoomBlur}
          placeholder="e.g. Room 301, Lobby..."
          placeholderTextColor="#94a3b8"
          maxLength={MAX_ROOM_LENGTH + 10}
          returnKeyType="done"
        />
        <CharCounter current={room.length} max={MAX_ROOM_LENGTH} min={2} />
      </FormField>

      <FormField label="Assign to">
        <CyclePicker
          options={STAFF_OPTIONS}
          value={staff}
          onChange={setStaff}
        />
      </FormField>

      <FormField label="Task type">
        <CyclePicker options={TASK_TYPES} value={type} onChange={setType} />
      </FormField>

      <FormField label="Priority">
        <CyclePicker
          options={["Normal", "High", "Urgent"]}
          value={priority}
          onChange={setPriority}
        />
      </FormField>

      <PrimaryButton
        label="Assign Task"
        icon={<Check size={15} color="#fff" />}
        onPress={submit}
        disabled={feedback.type === "success"}
      />
      <View style={{ height: 16 }} />
    </ModalShell>
  );
};

// ─── Raise Alert Modal ────────────────────────────────────────────────────────

const RaiseAlertModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: (a: AlertItem) => void;
}> = ({ visible, onClose, onSubmit }) => {
  const [alertType, setAlertType] = useState(ALERT_TYPES[0]);
  const [loc, setLoc] = useState("");
  const [sev, setSev] = useState<AlertLevel>("critical");
  const [desc, setDesc] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: null,
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (visible) {
      setAlertType(ALERT_TYPES[0]);
      setLoc("");
      setSev("critical");
      setDesc("");
      setFeedback({ type: null, message: "" });
      setErrors({});
      setTouched({});
    }
  }, [visible]);

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const locErr = validateLocation(loc);
    if (locErr) errs.loc = locErr;
    const descErr = validateDescription(desc);
    if (descErr) errs.desc = descErr;
    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate();
    setErrors(errs);
  };

  const submit = () => {
    setTouched({ loc: true, desc: true });
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      setFeedback({
        type: "error",
        message: `${Object.keys(errs).length} field(s) need attention before submitting.`,
      });
      return;
    }

    onSubmit({
      level: sev,
      msg: `${alertType} — ${loc.trim()} · ${desc.trim()}`,
      time: "Just now",
      icon: ShieldAlert,
    });
    setFeedback({ type: "success", message: "Alert raised successfully!" });
    setTimeout(() => {
      setFeedback({ type: null, message: "" });
      onClose();
    }, 1800);
  };

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={S.modalTitle}>Raise Alert</Text>
      <Text style={S.modalSub}>
        Report an issue requiring immediate attention
      </Text>

      <FeedbackBanner
        feedback={feedback}
        onDismiss={() => setFeedback({ type: null, message: "" })}
      />

      <FormField label="Alert type">
        <CyclePicker
          options={ALERT_TYPES}
          value={alertType}
          onChange={setAlertType}
        />
      </FormField>

      <FormField
        label="Location *"
        error={touched.loc ? errors.loc : undefined}
        hint="e.g. Room 304, Floor 2"
      >
        <TextInput
          style={[
            S.input,
            touched.loc && errors.loc ? S.inputError : undefined,
          ]}
          value={loc}
          onChangeText={(v) => {
            setLoc(v);
            if (touched.loc) {
              const err = validateLocation(v);
              setErrors((e) => ({ ...e, loc: err ?? "" }));
            }
          }}
          onBlur={() => handleBlur("loc")}
          placeholder="e.g. Room 304, Floor 2..."
          placeholderTextColor="#94a3b8"
          maxLength={MAX_ROOM_LENGTH + 10}
          returnKeyType="next"
        />
        <CharCounter current={loc.length} max={MAX_ROOM_LENGTH} min={2} />
      </FormField>

      <FormField label="Severity">
        <CyclePicker
          options={["critical", "warning", "info"]}
          value={sev}
          onChange={(v) => setSev(v as AlertLevel)}
        />
      </FormField>

      <FormField
        label="Description *"
        error={touched.desc ? errors.desc : undefined}
        hint={`Minimum ${MIN_DESC_LENGTH} characters — describe the issue clearly`}
      >
        <TextInput
          style={[
            S.input,
            { height: 88, textAlignVertical: "top" },
            touched.desc && errors.desc ? S.inputError : undefined,
          ]}
          value={desc}
          onChangeText={(v) => {
            setDesc(v);
            if (touched.desc) {
              const err = validateDescription(v);
              setErrors((e) => ({ ...e, desc: err ?? "" }));
            }
          }}
          onBlur={() => handleBlur("desc")}
          placeholder="Describe the issue in detail..."
          placeholderTextColor="#94a3b8"
          multiline
          maxLength={MAX_DESC_LENGTH + 20}
        />
        <CharCounter
          current={desc.length}
          max={MAX_DESC_LENGTH}
          min={MIN_DESC_LENGTH}
        />
      </FormField>

      <PrimaryButton
        label="Raise Alert"
        icon={<AlertTriangle size={15} color="#fff" />}
        color="#ef4444"
        onPress={submit}
        disabled={feedback.type === "success"}
      />
      <View style={{ height: 16 }} />
    </ModalShell>
  );
};

// ─── Log Report Modal ─────────────────────────────────────────────────────────

const LogReportModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ visible, onClose, onSubmit }) => {
  const [type, setType] = useState(REPORT_TYPES[0]);
  const [loc, setLoc] = useState("");
  const [details, setDetails] = useState("");
  const [involved, setInvolved] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: null,
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (visible) {
      setType(REPORT_TYPES[0]);
      setLoc("");
      setDetails("");
      setInvolved("");
      setFeedback({ type: null, message: "" });
      setErrors({});
      setTouched({});
    }
  }, [visible]);

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const locErr = validateReportLocation(loc);
    if (locErr) errs.loc = locErr;
    const detailsErr = validateReportDetails(details);
    if (detailsErr) errs.details = detailsErr;
    const nameErr = validateName(involved);
    if (nameErr) errs.involved = nameErr;
    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate();
    setErrors(errs);
  };

  const submit = () => {
    setTouched({ loc: true, details: true, involved: true });
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const count = Object.keys(errs).length;
      setFeedback({
        type: "error",
        message: `${count} required field${count > 1 ? "s are" : " is"} missing or invalid.`,
      });
      return;
    }

    onSubmit();
    setFeedback({ type: "success", message: "Report logged successfully!" });
    setTimeout(() => {
      setFeedback({ type: null, message: "" });
      onClose();
    }, 1800);
  };

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={S.modalTitle}>Log Report</Text>
      <Text style={S.modalSub}>Document an incident or activity report</Text>

      <FeedbackBanner
        feedback={feedback}
        onDismiss={() => setFeedback({ type: null, message: "" })}
      />

      <FormField label="Report type">
        <CyclePicker options={REPORT_TYPES} value={type} onChange={setType} />
      </FormField>

      <FormField
        label="Location *"
        error={touched.loc ? errors.loc : undefined}
        hint="Room number or area name"
      >
        <TextInput
          style={[
            S.input,
            touched.loc && errors.loc ? S.inputError : undefined,
          ]}
          value={loc}
          onChangeText={(v) => {
            setLoc(v);
            if (touched.loc) {
              const err = validateReportLocation(v);
              setErrors((e) => ({ ...e, loc: err ?? "" }));
            }
          }}
          onBlur={() => handleBlur("loc")}
          placeholder="Room / Area"
          placeholderTextColor="#94a3b8"
          returnKeyType="next"
        />
      </FormField>

      <FormField
        label="Details *"
        error={touched.details ? errors.details : undefined}
        hint={`Minimum ${MIN_DESC_LENGTH} characters`}
      >
        <TextInput
          style={[
            S.input,
            { height: 88, textAlignVertical: "top" },
            touched.details && errors.details ? S.inputError : undefined,
          ]}
          value={details}
          onChangeText={(v) => {
            setDetails(v);
            if (touched.details) {
              const err = validateReportDetails(v);
              setErrors((e) => ({ ...e, details: err ?? "" }));
            }
          }}
          onBlur={() => handleBlur("details")}
          placeholder="Describe what happened..."
          placeholderTextColor="#94a3b8"
          multiline
          maxLength={MAX_DESC_LENGTH + 20}
        />
        <CharCounter
          current={details.length}
          max={MAX_DESC_LENGTH}
          min={MIN_DESC_LENGTH}
        />
      </FormField>

      <FormField
        label="Staff involved *"
        error={touched.involved ? errors.involved : undefined}
        hint="Full name(s) of staff involved"
      >
        <TextInput
          style={[
            S.input,
            touched.involved && errors.involved ? S.inputError : undefined,
          ]}
          value={involved}
          onChangeText={(v) => {
            setInvolved(v);
            if (touched.involved) {
              const err = validateName(v);
              setErrors((e) => ({ ...e, involved: err ?? "" }));
            }
          }}
          onBlur={() => handleBlur("involved")}
          placeholder="Name(s)..."
          placeholderTextColor="#94a3b8"
          returnKeyType="done"
        />
      </FormField>

      <PrimaryButton
        label="Submit Report"
        icon={<FileText size={15} color="#fff" />}
        color="#10b981"
        onPress={submit}
        disabled={feedback.type === "success"}
      />
      <View style={{ height: 16 }} />
    </ModalShell>
  );
};

// ─── Call Staff Modal ─────────────────────────────────────────────────────────

const CallStaffModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const [callingName, setCallingName] = useState<string | null>(null);
  const [callFeedback, setCallFeedback] = useState<FeedbackState>({
    type: null,
    message: "",
  });

  useEffect(() => {
    if (!visible) {
      setCallingName(null);
      setCallFeedback({ type: null, message: "" });
    }
  }, [visible]);

  const call = (name: string) => {
    setCallingName(name);
    setCallFeedback({ type: "success", message: `Calling ${name}...` });
    setTimeout(() => {
      setCallingName(null);
      setCallFeedback({ type: null, message: "" });
    }, 2500);
  };

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={S.modalTitle}>Call Staff</Text>
      <Text style={S.modalSub}>Contact a staff member directly</Text>

      <FeedbackBanner
        feedback={callFeedback}
        onDismiss={() => setCallFeedback({ type: null, message: "" })}
      />

      {STAFF.map((s, i) => {
        const ini = s.name
          .split(" ")
          .map((n) => n[0])
          .join("");
        const st = STATUS_MAP[s.status];
        const isBeingCalled = callingName === s.name;
        return (
          <View
            key={i}
            style={[S.staffRow, i < STAFF.length - 1 && S.staffBorder]}
          >
            <View style={S.avatar}>
              <Text style={S.avatarText}>{ini}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.staffNameText}>{s.name}</Text>
              <Text style={S.staffRoleText}>{s.role}</Text>
            </View>
            <Pill label={st.label} color={st.color} bg={st.bg} />
            <TouchableOpacity
              onPress={() => call(s.name)}
              disabled={!!callingName}
              style={[
                S.callBtn,
                isBeingCalled && { backgroundColor: "#10b981" },
                !!callingName &&
                  !isBeingCalled && { backgroundColor: "#94a3b8" },
              ]}
            >
              {isBeingCalled ? (
                <Check size={12} color="#fff" />
              ) : (
                <Phone size={12} color="#fff" />
              )}
              <Text style={S.callBtnText}>
                {isBeingCalled ? "Calling" : "Call"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
      <View style={{ height: 16 }} />
    </ModalShell>
  );
};

// ─── Report Detail Modal ──────────────────────────────────────────────────────

const ReportDetailModal: React.FC<{
  report: ReportItem | null;
  visible: boolean;
  onClose: () => void;
}> = ({ report, visible, onClose }) => {
  if (!report) return null;

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={S.modalTitle}>{report.label}</Text>
      <Text style={S.modalSub}>{report.sub}</Text>
      <View style={S.divider} />
      {Object.entries(report.details).map(([k, v]) => (
        <View key={k} style={S.detailRow}>
          <Text style={S.detailKey}>{k}</Text>
          <Text style={S.detailVal}>{String(v)}</Text>
        </View>
      ))}
      <View style={{ height: 16 }} />
    </ModalShell>
  );
};

// ─── Chart Config ─────────────────────────────────────────────────────────────

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(99,102,241,${opacity})`,
  labelColor: () => "#94a3b8",
  strokeWidth: 2.5,
  barPercentage: 0.55,
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#6366f1" },
  propsForBackgroundLines: { stroke: "#f1f5f9" },
  decimalPlaces: 0,
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function HousekeepingDashboard() {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [stats, setStats] = useState<StatItem[]>(INITIAL_STATS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);
  const [chartMode, setChartMode] = useState<ChartMode>("bar");
  const [modal, setModal] = useState<ModalKey>(null);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const handleAssign = (d: { room: string; staff: string; type: string }) => {
    const staffShort =
      d.staff.split(" ")[0] + " " + (d.staff.split(" ")[1]?.[0] ?? "") + ".";
    setSchedule((prev) => [
      ...prev,
      {
        room: d.room,
        staff: staffShort,
        time: "—",
        type: d.type,
        status: "pending",
      },
    ]);
    setActivity((prev) => [
      {
        icon: ClipboardList,
        color: "#6366f1",
        bg: "#eef2ff",
        msg: `Task assigned: ${d.type} — ${d.room}`,
        who: d.staff.split(" ")[0],
        time: "Just now",
      },
      ...prev,
    ]);
    setStats((prev) =>
      prev.map((s) =>
        s.label === "Pending Tasks" ? { ...s, value: s.value + 1 } : s,
      ),
    );
  };

  const handleAlert = (a: AlertItem) => {
    setAlerts((prev) => [a, ...prev]);
  };

  const handleReport = () => {
    setActivity((prev) => [
      {
        icon: FileText,
        color: "#10b981",
        bg: "#d1fae5",
        msg: "New report logged",
        who: "Staff",
        time: "Just now",
      },
      ...prev,
    ]);
  };

  const openReportDetail = (r: ReportItem) => {
    setSelectedReport(r);
    setModal("reportDetail");
  };

  const weekChartData = {
    labels: WEEK_DATA.map((d) => d.day),
    datasets: [
      {
        data: WEEK_DATA.map((d) => d.tasks),
        color: (o = 1) => `rgba(99,102,241,${o})`,
        strokeWidth: 2.5,
      },
    ],
  };

  const supplyChartData = {
    labels: SUPPLY.map((s) => s.item.split(" ")[0]),
    datasets: [{ data: SUPPLY.map((s) => Math.round((s.used / s.max) * 100)) }],
  };

  const chartW = SW - (isMobile ? 24 : 32) - 32;

  return (
    <>
      <ScrollView
        style={S.screen}
        contentContainerStyle={S.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <FadeIn delay={0}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&auto=format&fit=crop",
            }}
            resizeMode="cover"
            style={S.hero}
            imageStyle={{ borderRadius: 22 }}
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0,0,0,0.38)",
                borderRadius: 22,
              }}
            />
            <View style={S.heroInner}>
              <View style={{ flex: 1 }}>
                <View style={S.liveRow}>
                  <PulseDot color="#07f261" />
                  <Text style={S.liveText}>
                    LIVE ·{" "}
                    {now
                      .toLocaleDateString("en-IN", {
                        weekday: isMobile ? "short" : "long",
                        day: "numeric",
                        month: isMobile ? "short" : "long",
                      })
                      .toUpperCase()}
                  </Text>
                </View>
                <Text style={S.heroTitle}>{greeting}, Housekeeping 👋</Text>
                <Text style={S.heroSub}>
                  {isMobile
                    ? "18 staff on duty · 4 floors active"
                    : "Property status is active — 18 staff on duty across 4 floors."}
                </Text>
                <View style={S.heroChips}>
                  <View style={S.heroChip}>
                    <Sparkles size={11} color="#a5f3fc" />
                    <Text style={S.heroChipText}>94% efficiency</Text>
                  </View>
                  <View style={S.heroChip}>
                    <Zap size={11} color="#fde68a" />
                    <Text style={S.heroChipText}>87 tasks done</Text>
                  </View>
                </View>
              </View>
              <View style={S.heroRight}>
                <Text style={S.heroStat}>73%</Text>
                <Text style={S.heroStatLabel}>Occupancy</Text>
                <View style={{ height: 8 }} />
                <Text style={S.heroStat2}>12</Text>
                <Text style={S.heroStatLabel}>Pending</Text>
              </View>
            </View>
          </ImageBackground>
        </FadeIn>

        {/* ══ STAT CARDS ════════════════════════════════════════════ */}
        <FadeSlideIn delay={60}>
          <SectionLabel>OVERVIEW</SectionLabel>
          <View style={S.statsGrid}>
            {stats.map((s, i) => (
              <FadeSlideIn key={i} delay={80 + i * 55} style={S.statFlex}>
                <Card style={S.statCard}>
                  <View style={S.statTop}>
                    <LinearGradient
                      colors={s.grad}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={S.statIcon}
                    >
                      <s.icon size={18} color="#fff" strokeWidth={1.8} />
                    </LinearGradient>
                    <TrendBadge up={s.trend === "up"} val={s.trendVal} />
                  </View>
                  <AnimatedCounter value={s.value} style={S.statVal} />
                  <Text style={S.statLabel}>{s.label}</Text>
                  <Text style={S.statSub}>{s.sub}</Text>
                </Card>
              </FadeSlideIn>
            ))}
          </View>
        </FadeSlideIn>

        {/* ══ ALERTS ════════════════════════════════════════════════ */}
        <FadeSlideIn delay={160}>
          <SectionLabel>EMERGENCY ALERTS</SectionLabel>
          <Card>
            <CardHeader
              title="⚡ Active Alerts"
              right={
                <View style={S.alertBadge}>
                  <Text style={S.alertBadgeText}>{alerts.length} active</Text>
                </View>
              }
            />
            {alerts.map((a, i) => {
              const st = ALERT_STYLE[a.level];
              return (
                <View
                  key={i}
                  style={[
                    S.alertRow,
                    { borderLeftColor: st.border, backgroundColor: st.bg },
                  ]}
                >
                  <View
                    style={[
                      S.alertIconBox,
                      { backgroundColor: st.border + "20" },
                    ]}
                  >
                    <a.icon size={14} color={st.border} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={S.alertMsg}>{a.msg}</Text>
                    <Text style={S.alertTime}>{a.time}</Text>
                  </View>
                  <View
                    style={[
                      S.alertLevelPill,
                      { backgroundColor: st.border + "20" },
                    ]}
                  >
                    <Text style={[S.alertLevelText, { color: st.border }]}>
                      {a.level.toUpperCase()}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </FadeSlideIn>

        {/* ══ QUICK ACTIONS ═════════════════════════════════════════ */}
        <FadeSlideIn delay={220}>
          <SectionLabel>QUICK ACTIONS</SectionLabel>
          <View style={S.qaGrid}>
            {[
              {
                label: "Assign Task",
                icon: Plus,
                color: "#6366f1",
                bg: "#eef2ff",
                key: "assign",
              },
              {
                label: "Raise Alert",
                icon: Flame,
                color: "#ef4444",
                bg: "#fee2e2",
                key: "alert",
              },
              {
                label: "Log Report",
                icon: FileText,
                color: "#10b981",
                bg: "#d1fae5",
                key: "report",
              },
              {
                label: "Call Staff",
                icon: Phone,
                color: "#f59e0b",
                bg: "#fef3c7",
                key: "call",
              },
            ].map((q, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                onPress={() => setModal(q.key as ModalKey)}
                style={[
                  S.qaBtn,
                  { backgroundColor: q.bg, borderColor: q.color + "40" },
                ]}
              >
                <View
                  style={[S.qaIconBox, { backgroundColor: q.color + "20" }]}
                >
                  <q.icon
                    size={isMobile ? 18 : 20}
                    color={q.color}
                    strokeWidth={2}
                  />
                </View>
                <Text style={[S.qaLabel, { color: q.color }]}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </FadeSlideIn>

        {/* ══ STAFF ═════════════════════════════════════════════════ */}
        <FadeSlideIn delay={360}>
          <SectionLabel>STAFF PERFORMANCE</SectionLabel>
          <Card>
            <CardHeader title="Today's Staff Overview" />
            {STAFF.map((s, i) => {
              const pct = Math.round((s.done / s.tasks) * 100);
              const barColor =
                pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
              const st = STATUS_MAP[s.status];
              const ini = s.name
                .split(" ")
                .map((n) => n[0])
                .join("");
              return (
                <View
                  key={i}
                  style={[
                    S.staffMobileRow,
                    i < STAFF.length - 1 && S.staffBorder,
                  ]}
                >
                  <View style={S.staffMobileTop}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View style={S.avatar}>
                        <Text style={S.avatarText}>{ini}</Text>
                      </View>
                      <View>
                        <Text style={S.staffNameText}>{s.name}</Text>
                        <Text style={S.staffRoleText}>{s.role}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: "flex-end", gap: 4 }}>
                      <Pill label={st.label} color={st.color} bg={st.bg} />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Star size={11} color="#f59e0b" fill="#f59e0b" />
                        <Text style={S.ratingText}>{s.rating}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={S.staffMobileBottom}>
                    <Text style={S.staffTasksText}>
                      {s.done}/{s.tasks} tasks
                    </Text>
                    <AnimatedBar
                      percent={pct}
                      color={barColor}
                      delay={400 + i * 60}
                    />
                    <Text style={[S.staffPct, { color: barColor }]}>
                      {pct}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </FadeSlideIn>

        {/* ══ ANALYTICS: KPI RINGS ══════════════════════════════════ */}
        <FadeSlideIn delay={420}>
          <SectionLabel>ANALYTICS</SectionLabel>
          <Card>
            <CardHeader
              title="Performance KPIs"
              right={
                <View style={S.weekPill}>
                  <Text style={S.weekPillText}>This week</Text>
                </View>
              }
            />
            <View style={S.kpiGrid}>
              {ANALYTICS.map((a, i) => (
                <View key={i} style={S.kpiItem}>
                  <RingProgress
                    percent={a.value}
                    color={a.color}
                    size={isMobile ? 58 : 68}
                  />
                  <Text style={S.kpiLabel}>{a.label}</Text>
                  <TrendBadge up={a.up} val={a.trend} />
                </View>
              ))}
            </View>
          </Card>
        </FadeSlideIn>

        {/* ══ WEEKLY CHART ══════════════════════════════════════════ */}
        <FadeSlideIn delay={460}>
          <Card>
            <CardHeader
              title="Weekly Tasks"
              right={
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {(["bar", "line"] as ChartMode[]).map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setChartMode(t)}
                      style={[S.chartTab, chartMode === t && S.chartTabActive]}
                    >
                      <Text
                        style={[
                          S.chartTabText,
                          chartMode === t && S.chartTabTextActive,
                        ]}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              }
            />
            {chartMode === "bar" ? (
              <BarChart
                data={weekChartData}
                width={chartW}
                height={180}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                style={{ borderRadius: 12, marginRight: -16 }}
                showValuesOnTopOfBars
                fromZero
              />
            ) : (
              <LineChart
                data={weekChartData}
                width={chartW}
                height={180}
                chartConfig={chartConfig}
                style={{ borderRadius: 12, marginLeft: -16 }}
                bezier
                fromZero
              />
            )}
            <View style={S.legendRow}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: "#6366f1",
                  }}
                />
                <Text style={S.legendText}>Tasks completed</Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#ef4444",
                  }}
                />
                <Text style={S.legendText}>Complaints</Text>
              </View>
            </View>
          </Card>
        </FadeSlideIn>

        {/* ══ REPORTS ═══════════════════════════════════════════════ */}
        <FadeSlideIn delay={500}>
          <SectionLabel>REPORTS</SectionLabel>
          <Card>
            <CardHeader title="Reports" />
            {REPORTS.map((r) => (
              <TouchableOpacity
                key={r.id}
                activeOpacity={0.85}
                onPress={() => openReportDetail(r)}
                style={[S.reportCard, { backgroundColor: r.bg }]}
              >
                <View
                  style={[S.reportIcon, { backgroundColor: r.color + "22" }]}
                >
                  <r.icon size={22} color={r.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[S.reportLabel, { color: r.color }]}>
                    {r.label}
                  </Text>
                  <Text style={S.reportSub}>{r.sub}</Text>
                </View>
                <ChevronRight size={18} color={r.color} />
              </TouchableOpacity>
            ))}
          </Card>
        </FadeSlideIn>

        {/* ══ SUPPLY ════════════════════════════════════════════════ */}
        <FadeSlideIn delay={540}>
          <SectionLabel>SUPPLY CONSUMPTION</SectionLabel>
          <Card>
            <CardHeader title="Inventory & Supply Usage" />
            {SUPPLY.map((s, i) => {
              const pct = Math.round((s.used / s.max) * 100);
              const isLow = pct > 85;
              const c = isLow ? "#ef4444" : s.color;
              return (
                <View
                  key={i}
                  style={[S.supplyRow, i < SUPPLY.length - 1 && S.supplyBorder]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={S.supplyTopRow}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Text style={S.supplyItem}>{s.item}</Text>
                        {isLow && (
                          <View style={S.lowBadge}>
                            <AlertTriangle size={9} color="#b91c1c" />
                            <Text style={S.lowText}>Low</Text>
                          </View>
                        )}
                      </View>
                      <Text style={S.supplyQty}>
                        {s.used}/{s.max} {s.unit}
                      </Text>
                    </View>
                    <AnimatedBar
                      percent={pct}
                      color={c}
                      delay={560 + i * 70}
                      height={7}
                    />
                  </View>
                  <Text style={[S.supplyPct, { color: c }]}>{pct}%</Text>
                </View>
              );
            })}
            <View style={{ marginTop: 16 }}>
              <Text style={S.chartSubLabel}>USAGE %</Text>
              <BarChart
                data={supplyChartData}
                width={chartW}
                height={150}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  ...chartConfig,
                  color: (o = 1) => `rgba(99,102,241,${o})`,
                }}
                style={{ borderRadius: 12, marginLeft: -16 }}
                fromZero
                showValuesOnTopOfBars
              />
            </View>
          </Card>
        </FadeSlideIn>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ══ MODALS ════════════════════════════════════════════════════ */}
      <AssignTaskModal
        visible={modal === "assign"}
        onClose={() => setModal(null)}
        onSubmit={handleAssign}
      />
      <RaiseAlertModal
        visible={modal === "alert"}
        onClose={() => setModal(null)}
        onSubmit={handleAlert}
      />
      <LogReportModal
        visible={modal === "report"}
        onClose={() => setModal(null)}
        onSubmit={handleReport}
      />
      <CallStaffModal
        visible={modal === "call"}
        onClose={() => setModal(null)}
      />
      <ReportDetailModal
        report={selectedReport}
        visible={modal === "reportDetail"}
        onClose={() => setModal(null)}
      />
    </>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbececb5" },
  content: { padding: isMobile ? 12 : 16, gap: 10 },

  // ── Hero ──────────────────────────────────────────────────────────
  hero: {
    borderRadius: 22,
    padding: isMobile ? 16 : 24,
    minHeight: isMobile ? 190 : 240,
    overflow: "hidden",
  },
  heroInner: { flexDirection: "row", alignItems: "center" },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
    marginTop: 24,
  },
  liveText: {
    fontSize: isMobile ? 10 : 12,
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: isMobile ? 20 : 34,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
    marginTop: 6,
  },
  heroSub: {
    fontSize: isMobile ? 12 : 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: 8,
    lineHeight: 18,
  },
  heroChips: { flexDirection: "row", gap: 6, marginTop: 16, flexWrap: "wrap" },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.75)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroChipText: { fontSize: 11, fontWeight: "600" },
  heroRight: { alignItems: "center", marginLeft: isMobile ? 12 : 20 },
  heroStat: {
    fontSize: isMobile ? 30 : 38,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
    lineHeight: isMobile ? 34 : 42,
  },
  heroStat2: {
    fontSize: isMobile ? 24 : 30,
    fontWeight: "800",
    color: "rgba(255,255,255,0.85)",
  },
  heroStatLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.55)",
    marginTop: 1,
  },

  // ── Stats ─────────────────────────────────────────────────────────
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statFlex: { width: isWide ? "24%" : "49%", minWidth: 0 },
  statCard: { padding: isMobile ? 12 : 14 },
  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  statIcon: {
    width: isMobile ? 32 : 38,
    height: isMobile ? 32 : 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  statVal: {
    fontSize: isMobile ? 24 : 30,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: isMobile ? 11 : 12,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 2,
  },
  statSub: { fontSize: 10, color: "#94a3b8", marginTop: 2 },

  // ── Trend badge ───────────────────────────────────────────────────
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: { fontSize: 10, fontWeight: "700" },

  // ── Card ──────────────────────────────────────────────────────────
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: isMobile ? 12 : 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  cardTitle: {
    fontSize: isMobile ? 13 : 14,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.2,
    flex: 1,
  },

  // ── Section label ─────────────────────────────────────────────────
  secLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 8,
  },
  secLabelDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6366f1",
  },
  secLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8b98aa",
    letterSpacing: 1.2,
  },

  // ── Pill ──────────────────────────────────────────────────────────
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    flexShrink: 0,
  },
  pillText: { fontSize: 10, fontWeight: "600" },

  // ── Alerts ────────────────────────────────────────────────────────
  alertBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  alertBadgeText: { fontSize: 11, fontWeight: "700", color: "#b91c1c" },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: isMobile ? 8 : 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  alertIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  alertMsg: {
    fontSize: isMobile ? 12 : 12.5,
    fontWeight: "500",
    color: "#1e293b",
    lineHeight: 17,
  },
  alertTime: { fontSize: 10, color: "#94a3b8", marginTop: 2 },
  alertLevelPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
    flexShrink: 0,
  },
  alertLevelText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },

  // ── Quick actions ─────────────────────────────────────────────────
  qaGrid: { flexDirection: "row", flexWrap: "wrap", gap: isMobile ? 8 : 10 },
  qaBtn: {
    width: "23.5%",
    borderRadius: 14,
    borderWidth: 1,
    padding: isMobile ? 10 : 14,
    alignItems: "center",
    gap: 6,
  },
  qaIconBox: {
    width: isMobile ? 36 : 42,
    height: isMobile ? 36 : 42,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  qaLabel: {
    fontSize: isMobile ? 10 : 11,
    fontWeight: "700",
    textAlign: "center",
  },

  // ── Staff ─────────────────────────────────────────────────────────
  staffMobileRow: { paddingVertical: 10, gap: 8 },
  staffMobileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  staffMobileBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  staffBorder: { borderBottomWidth: 1, borderBottomColor: "#f8fafc" },
  staffRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 9, fontWeight: "800", color: "#6366f1" },
  staffNameText: { fontSize: 12, fontWeight: "600", color: "#1e293b" },
  staffRoleText: { fontSize: 10, color: "#64748b" },
  staffTasksText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
    width: 64,
  },
  staffPct: { fontSize: 10, fontWeight: "700", width: 30, textAlign: "right" },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#f59e0b" },

  // ── KPI ───────────────────────────────────────────────────────────
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: isMobile ? 8 : 12,
    justifyContent: "space-between",
  },
  kpiItem: { alignItems: "center", gap: 6, width: "48%" },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
  },

  // ── Chart ─────────────────────────────────────────────────────────
  weekPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  weekPillText: { fontSize: 11, color: "#6366f1", fontWeight: "600" },
  chartTab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  chartTabActive: { backgroundColor: "#eef2ff" },
  chartTabText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  chartTabTextActive: { color: "#6366f1" },
  legendRow: { flexDirection: "row", gap: 16, marginTop: 8 },
  legendText: { fontSize: 11, color: "#94a3b8" },
  chartSubLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  // ── Reports ───────────────────────────────────────────────────────
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 14,
    marginBottom: 10,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  reportLabel: { fontSize: 13, fontWeight: "700" },
  reportSub: { fontSize: 11, color: "#64748b", marginTop: 2 },

  // ── Supply ────────────────────────────────────────────────────────
  supplyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  supplyBorder: { borderBottomWidth: 1, borderBottomColor: "#f8fafc" },
  supplyTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    alignItems: "center",
  },
  supplyItem: {
    fontSize: isMobile ? 12 : 13,
    fontWeight: "600",
    color: "#1e293b",
  },
  supplyQty: { fontSize: 11, color: "#64748b", fontWeight: "500" },
  supplyPct: { fontSize: 12, fontWeight: "700", width: 36, textAlign: "right" },
  lowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#fee2e2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
  },
  lowText: { fontSize: 9, fontWeight: "700", color: "#b91c1c" },

  // ── View all btn ──────────────────────────────────────────────────
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    flexShrink: 0,
  },
  viewAllText: { fontSize: 12, color: "#6366f1", fontWeight: "600" },

  // ── Modal ─────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 480,
    maxHeight: "85%",
    position: "relative",
  },
  modalCloseBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
    paddingRight: 30,
  },
  modalSub: { fontSize: 13, color: "#64748b", marginBottom: 14 },
  divider: { height: 0.5, backgroundColor: "#e2e8f0", marginVertical: 14 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  detailKey: { fontSize: 13, color: "#64748b" },
  detailVal: { fontSize: 13, fontWeight: "700", color: "#0f172a" },

  // ── Form ──────────────────────────────────────────────────────────
  formGroup: { marginBottom: 12 },
  formLabel: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    fontSize: 13,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fff5f5",
  },
  cyclePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
  cyclePickerText: { fontSize: 13, color: "#0f172a", flex: 1 },

  // ── Feedback Banner ───────────────────────────────────────────────
  feedbackBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
  },
  feedbackSuccess: {
    backgroundColor: "#d1fae5",
    borderWidth: 1,
    borderColor: "#6ee7b7",
  },
  feedbackError: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  feedbackIconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    flex: 1,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  feedbackDismiss: {
    padding: 3,
    borderRadius: 4,
    flexShrink: 0,
  },

  // ── Field error ───────────────────────────────────────────────────
  fieldErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  fieldErrorText: {
    fontSize: 11,
    color: "#dc2626",
    fontWeight: "500",
    flex: 1,
  },
  fieldHint: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 3,
  },

  // ── Char counter ──────────────────────────────────────────────────
  charCounter: {
    fontSize: 10,
    textAlign: "right",
    marginTop: 3,
    fontWeight: "500",
  },

  // ── Buttons ───────────────────────────────────────────────────────
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  primaryBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#6366f1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  callBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
