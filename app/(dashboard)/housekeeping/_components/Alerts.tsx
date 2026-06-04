import {
  ArrowRight,
  CheckCircle,
  Clock,
  Filter,
  MapPin,
  Search,
  ShieldAlert,
  UserCheck,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const { width: SW } = Dimensions.get("window");
const isWide = SW > 900;

// Central Design Tokens (Perfectly synced with your attendance module)
const C = {
  bg: "#f8f7ff",
  white: "#FFFFFF",
  dark: "#16082e",
  dark2: "#dc2626",
  textPrimary: "#0f172a",
  textSec: "#64748b",
  textTer: "#94a3b8",
  indigo: "#dc2626",
  indigoLight: "#eef2ff",
  green: "#10b981",
  greenLight: "#d1fae5",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  red: "#ef4444",
  redLight: "#fee2e2",
  sky: "#0ea5e9",
  border: "#e2e8f0",
};

interface OperationalAlert {
  id: string;
  type:
    | "Geofence_Violation"
    | "Critical_Tardy"
    | "Unresolved_Absence"
    | "Hardware_Fault";
  title: string;
  description: string;
  timestamp: string;
  severity: "High" | "Medium" | "Low";
  impactedEntity: string;
  zone: string;
  resolved: boolean;
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

const SEVERITY_MAP: Record<
  OperationalAlert["severity"],
  { label: string; color: string; bg: string }
> = {
  High: { label: "Critical Risk", color: C.red, bg: C.redLight },
  Medium: { label: "Warning", color: C.amber, bg: C.amberLight },
  Low: { label: "Notice", color: C.sky, bg: "#e0f2fe" },
};

const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: "ALT-8821",
    type: "Geofence_Violation",
    title: "Out-of-Bounds Clock In Attempt",
    description:
      "Device attempted remote shift signature 420 meters outside designated operational range.",
    timestamp: "10 mins ago",
    severity: "High",
    impactedEntity: "James Kimani (EMP-4481)",
    zone: "Lecture Hall Suite 102",
    resolved: false,
  },
  {
    id: "ALT-4902",
    type: "Hardware_Fault",
    title: "Biometric Terminal Disconnect",
    description:
      "Main gate scanner terminal failed handshake cycle packet drop detected.",
    timestamp: "24 mins ago",
    severity: "High",
    impactedEntity: "Terminal Node-B4",
    zone: "Washroom Complex B",
    resolved: false,
  },
  {
    id: "ALT-1109",
    type: "Critical_Tardy",
    title: "Shift Absenteeism Threshold Breach",
    description:
      "No clock-in sequence initiated within 120 minutes of designated morning shift baseline.",
    timestamp: "1 hr ago",
    severity: "Medium",
    impactedEntity: "Anna Petrov (EMP-7721)",
    zone: "Central Library Atrium",
    resolved: false,
  },
  {
    id: "ALT-3301",
    type: "Unresolved_Absence",
    title: "Supervisor Overrides Triggered",
    description:
      "Manual override logs forced attendance state change without secondary peer approval token.",
    timestamp: "3 hrs ago",
    severity: "Low",
    impactedEntity: "Sara Lee (Sys-Admin)",
    zone: "Main Admin Quad",
    resolved: true,
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<OperationalAlert[]>(INITIAL_ALERTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("All");

  const toggleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((alt) =>
        alt.id === id ? { ...alt, resolved: !alt.resolved } : alt,
      ),
    );
  };

  const filteredAlerts = alerts.filter((alt) => {
    const matchesSearch =
      alt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.impactedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "All" || alt.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const criticalCount = alerts.filter(
    (a) => !a.resolved && a.severity === "High",
  ).length;
  const warningCount = alerts.filter(
    (a) => !a.resolved && a.severity === "Medium",
  ).length;

  return (
    <View style={S.screen}>
      <ScrollView
        contentContainerStyle={S.content}
        showsVerticalScrollIndicator={false}
      >
        {criticalCount > 0 && (
          <FadeInUp delay={100}>
            <Text style={S.sectionLabel}>Action Required Matrix</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={isWide ? 420 : SW - 40}
              decelerationRate="fast"
              contentContainerStyle={S.carouselContainer}
            >
              {alerts
                .filter((a) => a.severity === "High" && !a.resolved)
                .map((alt) => (
                  <View key={`card-${alt.id}`} style={S.carouselCard}>
                    <View style={S.carouselHeader}>
                      <View style={S.alertIconContainer}>
                        <ShieldAlert size={20} color={C.red} />
                      </View>
                      <Text style={S.carouselId}>{alt.id}</Text>
                    </View>
                    <Text style={S.carouselTitle} numberOfLines={1}>
                      {alt.title}
                    </Text>
                    <Text style={S.carouselDesc} numberOfLines={2}>
                      {alt.description}
                    </Text>
                    <View style={S.carouselTargetContainer}>
                      <Text style={S.targetLabel}>Scope:</Text>
                      <Text style={S.targetValue} numberOfLines={1}>
                        {alt.impactedEntity}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleResolve(alt.id)}
                      style={S.actionResolveBtn}
                    >
                      <Text style={S.actionResolveText}>Evaluate</Text>
                      <ArrowRight size={14} color={C.white} />
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </FadeInUp>
        )}

        {/* ─── ENGINE FILTERS RIBBON ─── */}
        <FadeInUp delay={150}>
          <View style={S.toolbarRow}>
            <View style={S.searchBarContainer}>
              <Search size={18} color={C.textTer} style={S.searchIcon} />
              <TextInput
                placeholder="Search metrics, targets, exception logs..."
                placeholderTextColor={C.textTer}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={S.searchInputField}
              />
            </View>
            <View style={S.filterAddonBox}>
              <Filter size={18} color={C.textSec} />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={S.filterRibbon}
          >
            {["All", "High", "Medium", "Low"].map((sev) => {
              const isSelected = severityFilter === sev;
              return (
                <TouchableOpacity
                  key={sev}
                  onPress={() => setSeverityFilter(sev)}
                  style={[S.filterPill, isSelected && S.filterPillActive]}
                >
                  <Text
                    style={[
                      S.filterPillText,
                      isSelected && S.filterPillTextActive,
                    ]}
                  >
                    {sev === "All" ? "Full Matrix" : `${sev} Tier`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeInUp>

        {/* ─── GRANULAR ALERTS LOG TRAIL ─── */}
        <View style={S.logsFeedStack}>
          {filteredAlerts.map((alt, index) => {
            const sevCfg = SEVERITY_MAP[alt.severity];
            return (
              <FadeInUp key={alt.id} delay={200 + index * 40}>
                <View
                  style={[S.logItemCard, alt.resolved && S.logItemCardResolved]}
                >
                  <View style={S.logItemHeader}>
                    <View style={S.logMetaGroup}>
                      <View
                        style={[
                          S.dotIndicator,
                          {
                            backgroundColor: alt.resolved
                              ? C.textTer
                              : sevCfg.color,
                          },
                        ]}
                      />
                      <Text
                        style={[S.logIdText, alt.resolved && S.textThrough]}
                      >
                        {alt.id}
                      </Text>
                      <Text style={S.logTimeText}>• {alt.timestamp}</Text>
                    </View>
                    <View
                      style={[
                        S.severityBadge,
                        {
                          backgroundColor: alt.resolved ? C.border : sevCfg.bg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          S.severityBadgeText,
                          { color: alt.resolved ? C.textSec : sevCfg.color },
                        ]}
                      >
                        {alt.resolved ? "Resolved" : sevCfg.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={[S.logTitleText, alt.resolved && S.textMuted]}>
                    {alt.title}
                  </Text>
                  <Text style={S.logDescText}>{alt.description}</Text>

                  <View style={S.logEntityMatrixRow}>
                    <Text style={S.entityFocusText} numberOfLines={1}>
                      Target:{" "}
                      <Text style={{ color: C.textPrimary }}>
                        {alt.impactedEntity}
                      </Text>
                    </Text>
                    <View style={S.zoneAnchor}>
                      <MapPin size={12} color={C.textSec} />
                      <Text style={S.zoneAnchorText} numberOfLines={1}>
                        {alt.zone}
                      </Text>
                    </View>
                  </View>

                  <View style={S.logFooterActionRow}>
                    <TouchableOpacity
                      onPress={() => toggleResolve(alt.id)}
                      style={[
                        S.inlineToggleBtn,
                        alt.resolved && S.inlineToggleBtnSuccess,
                      ]}
                    >
                      {alt.resolved ? (
                        <>
                          <UserCheck size={14} color={C.green} />
                          <Text
                            style={[S.inlineToggleText, { color: C.green }]}
                          >
                            Archived Check
                          </Text>
                        </>
                      ) : (
                        <>
                          <Clock size={14} color={C.indigo} />
                          <Text
                            style={[S.inlineToggleText, { color: C.indigo }]}
                          >
                            Mark Resolved
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </FadeInUp>
            );
          })}
        </View>

        {/* ─── EMPTY MATRIX FALLBACK ─── */}
        {filteredAlerts.length === 0 && (
          <View style={S.emptyBoxContainer}>
            <CheckCircle size={38} color={C.textTer} />
            <Text style={S.emptyTitleText}>Workspace Secured</Text>
            <Text style={S.emptySubtitleText}>
              No infrastructure telemetry faults or geofence breaches detected
              inside this scope.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

interface StylesheetInterface {
  screen: ViewStyle;
  content: ViewStyle;
  heroContainer: ViewStyle;
  heroMeta: ViewStyle;
  heroTitle: TextStyle;
  heroSubtitle: TextStyle;
  alertCounterBadge: ViewStyle;
  counterText: TextStyle;
  metricsStrip: ViewStyle;
  metricBlock: ViewStyle;
  metricNumber: TextStyle;
  metricLabel: TextStyle;
  stripDivider: ViewStyle;
  sectionLabel: TextStyle;
  carouselContainer: ViewStyle;
  carouselCard: ViewStyle;
  carouselHeader: ViewStyle;
  alertIconContainer: ViewStyle;
  carouselId: TextStyle;
  carouselTitle: TextStyle;
  carouselDesc: TextStyle;
  carouselTargetContainer: ViewStyle;
  targetLabel: TextStyle;
  targetValue: TextStyle;
  actionResolveBtn: ViewStyle;
  actionResolveText: TextStyle;
  toolbarRow: ViewStyle;
  searchBarContainer: ViewStyle;
  searchIcon: ViewStyle;
  searchInputField: TextStyle;
  filterAddonBox: ViewStyle;
  filterRibbon: ViewStyle;
  filterPill: ViewStyle;
  filterPillActive: ViewStyle;
  filterPillText: TextStyle;
  filterPillTextActive: TextStyle;
  logsFeedStack: ViewStyle;
  logItemCard: ViewStyle;
  logItemCardResolved: ViewStyle;
  logItemHeader: ViewStyle;
  logMetaGroup: ViewStyle;
  dotIndicator: ViewStyle;
  logIdText: TextStyle;
  logTimeText: TextStyle;
  severityBadge: ViewStyle;
  severityBadgeText: TextStyle;
  logTitleText: TextStyle;
  logDescText: TextStyle;
  logEntityMatrixRow: ViewStyle;
  entityFocusText: TextStyle;
  zoneAnchor: ViewStyle;
  zoneAnchorText: TextStyle;
  logFooterActionRow: ViewStyle;
  inlineToggleBtn: ViewStyle;
  inlineToggleBtnSuccess: ViewStyle;
  inlineToggleText: TextStyle;
  textThrough: TextStyle;
  textMuted: TextStyle;
  emptyBoxContainer: ViewStyle;
  emptyTitleText: TextStyle;
  emptySubtitleText: TextStyle;
}

const S = StyleSheet.create<StylesheetInterface>({
  screen: { flex: 1, backgroundColor: "#fbececb5" },
  content: { padding: isWide ? 28 : 20, paddingBottom: 50 },
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
  alertCounterBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.red,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  counterText: { color: C.white, fontSize: 12, fontWeight: "700" },
  metricsStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 26,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  metricBlock: { alignItems: "center", flex: 1 },
  metricNumber: { fontSize: 24, fontWeight: "800" },
  metricLabel: {
    fontSize: 12,
    color: C.textTer,
    marginTop: 4,
    fontWeight: "500",
  },
  stripDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: C.textSec,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  carouselContainer: { gap: 14, paddingBottom: 24 },
  carouselCard: {
    backgroundColor: C.white,
    width: isWide ? 400 : SW - 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  carouselHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertIconContainer: {
    backgroundColor: C.redLight,
    padding: 8,
    borderRadius: 10,
  },
  carouselId: { fontSize: 13, fontWeight: "700", color: C.textTer },
  carouselTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.textPrimary,
    marginTop: 14,
  },
  carouselDesc: {
    fontSize: 13,
    color: C.textSec,
    marginTop: 4,
    lineHeight: 18,
  },
  carouselTargetContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: C.bg,
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  targetLabel: { fontSize: 12, fontWeight: "600", color: C.textSec },
  targetValue: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textPrimary,
    flex: 1,
  },
  actionResolveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: C.dark2,
    borderRadius: 12,
    height: 40,
    marginTop: 14,
  },
  actionResolveText: { color: C.white, fontSize: 13, fontWeight: "700" },
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
  filterAddonBox: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    height: 48,
    width: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRibbon: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 6,
    marginBottom: 16,
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
  logsFeedStack: { gap: 14 },
  logItemCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },
  logItemCardResolved: { opacity: 0.65, backgroundColor: "#fcfcff" },
  logItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logMetaGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  dotIndicator: { width: 8, height: 8, borderRadius: 4 },
  logIdText: { fontSize: 13, fontWeight: "700", color: C.textPrimary },
  logTimeText: { fontSize: 12, color: C.textTer, fontWeight: "500" },
  severityBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  severityBadgeText: { fontSize: 11, fontWeight: "700" },
  logTitleText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textPrimary,
    marginTop: 10,
  },
  logDescText: { fontSize: 13, color: C.textSec, marginTop: 4, lineHeight: 18 },
  logEntityMatrixRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: 16,
  },
  entityFocusText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textSec,
    flex: 1,
  },
  zoneAnchor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: "50%",
  },
  zoneAnchorText: { fontSize: 12, color: C.textSec, fontWeight: "500" },
  logFooterActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  inlineToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.indigoLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  inlineToggleBtnSuccess: { backgroundColor: C.greenLight },
  inlineToggleText: { fontSize: 12, fontWeight: "700" },
  textThrough: { textDecorationLine: "line-through", color: C.textTer },
  textMuted: { color: C.textSec },
  emptyBoxContainer: { alignItems: "center", padding: 44, marginTop: 20 },
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
    lineHeight: 18,
  },
});
