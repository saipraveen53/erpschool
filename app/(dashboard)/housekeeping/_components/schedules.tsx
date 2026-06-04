import {
  AlertCircle,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageStyle,
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
const isMid = SW > 600;

// Centralized Enterprise Token System
const C = {
  bg: "#f3f4f6",
  white: "#FFFFFF",
  primary: "#dc2626",
  primaryLight: "#ffffff",
  slate900: "#0f172a",
  slate700: "#334155",
  slate400: "#94a3b8",
  border: "#e2e8f0",
  emerald: "#059669",
  emeraldLight: "#d1fae5",
  amber: "#d97706",
  amberLight: "#fef3c7",
  rose: "#dc2626",
  roseLight: "#fee2e2",
};

// ─── Animation Components ───────────────────────────────────────────────────

const SlideFadeItem = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const fade = useRef(new Animated.Value(0)).current;
  const transY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(transY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={{ opacity: fade, transform: [{ translateY: transY }] }}
    >
      {children}
    </Animated.View>
  );
};

// ─── Types and Interfaces ───────────────────────────────────────────────────

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

interface ScheduleZone {
  id: string;
  title: string;
  location: string;
  image: string;
  startTime: string; // 24hr format matching machine tracking "HH:MM"
  endTime: string;
  assignedStaff: string;
  supervisorName: string;
  checklist: ChecklistItem[];
  isVerified: boolean;
  verificationNotes?: string;
}

// Initial Data Matrix Mocking System Logs
const INITIAL_ZONES: ScheduleZone[] = [
  {
    id: "zone-1",
    title: "Classroom Cleaning Schedule",
    location: "Block A - Floor 1-3",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80",
    startTime: "07:00",
    endTime: "08:30",
    assignedStaff: "Maria Santos",
    supervisorName: "A. R. Rao",
    isVerified: false,
    checklist: [
      {
        id: "c1",
        task: "Sanitize high-touch student desks & chairs",
        completed: true,
      },
      {
        id: "c2",
        task: "Empty dry recycling and waste disposal bins",
        completed: true,
      },
      {
        id: "c3",
        task: "Dry sweep and damp mop entire floor perimeter",
        completed: false,
      },
      {
        id: "c4",
        task: "Wipe down whiteboard and restock markers",
        completed: false,
      },
    ],
  },
  {
    id: "zone-2",
    title: "Washroom Cleaning Schedule",
    location: "Central Complex Hub",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80",
    startTime: "09:00",
    endTime: "10:15",
    assignedStaff: "James Kimani",
    supervisorName: "A. R. Rao",
    isVerified: false,
    checklist: [
      {
        id: "w1",
        task: "Disinfect deep plumbing basins & toilets",
        completed: false,
      },
      {
        id: "w2",
        task: "Replenish automated paper towels and soap feeds",
        completed: false,
      },
      {
        id: "w3",
        task: "Polishing glass mirrors and surface chrome handles",
        completed: false,
      },
    ],
  },
  {
    id: "zone-3",
    title: "Laboratory Cleaning Schedule",
    location: "Bio-Chem Wing Block C",
    image:
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=500&q=80",
    startTime: "11:00",
    endTime: "12:30",
    assignedStaff: "Anna Petrov",
    supervisorName: "K. Vignesh",
    isVerified: true,
    verificationNotes:
      "All chemical containment units clean. Checked via standard inspection protocol.",
    checklist: [
      {
        id: "l1",
        task: "Decontaminate chemical containment work-stations",
        completed: true,
      },
      {
        id: "l2",
        task: "Check specialized emergency eyewash drain paths",
        completed: true,
      },
      {
        id: "l3",
        task: "Mopping floor paths with anti-static agents",
        completed: true,
      },
    ],
  },
  {
    id: "zone-4",
    title: "Library Cleaning Schedule",
    location: "North Reading Atrium",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80",
    startTime: "13:30",
    endTime: "15:00",
    assignedStaff: "Maria Santos",
    supervisorName: "A. R. Rao",
    isVerified: false,
    checklist: [
      {
        id: "b1",
        task: "Microfiber dust archive stacks and reference files",
        completed: false,
      },
      {
        id: "b2",
        task: "Vacuum layout carpets across reading enclosures",
        completed: false,
      },
      {
        id: "b3",
        task: "Wipe digital terminal keyboards and monitors",
        completed: false,
      },
    ],
  },
  {
    id: "zone-5",
    title: "Playground Maintenance Schedule",
    location: "Outdoor Sports Arena",
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=500&q=80",
    startTime: "15:30",
    endTime: "17:00",
    assignedStaff: "James Kimani",
    supervisorName: "K. Vignesh",
    isVerified: false,
    checklist: [
      {
        id: "p1",
        task: "Clear debris and track safety obstacles from turf",
        completed: true,
      },
      {
        id: "p2",
        task: "Inspect safety mount harnesses on open swings",
        completed: false,
      },
      {
        id: "p3",
        task: "Empty global perimeter waste containment hubs",
        completed: false,
      },
    ],
  },
  {
    id: "zone-6",
    title: "Office Cleaning Schedule",
    location: "Admin Block - Level 2",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80",
    startTime: "17:30",
    endTime: "19:00",
    assignedStaff: "Anna Petrov",
    supervisorName: "K. Vignesh",
    isVerified: false,
    checklist: [
      {
        id: "o1",
        task: "Sanitize corporate conference desks & interfaces",
        completed: false,
      },
      {
        id: "o2",
        task: "Shred secure open paper waste containers",
        completed: false,
      },
      {
        id: "o3",
        task: "Mop composite tiling layout and polish entryway",
        completed: false,
      },
    ],
  },
];

export default function ScheduleManagementScreen() {
  const [zones, setZones] = useState<ScheduleZone[]>(INITIAL_ZONES);
  const [activeZoneId, setActiveZoneId] = useState<string>("zone-1");
  const [currentTimeStr, setCurrentTimeStr] = useState("10:00"); // Standard tracking mock point
  const [verificationInput, setVerificationInput] = useState("");

  const activeZone = zones.find((z) => z.id === activeZoneId) || zones[0];

  // ─── Time-Based Operational Processing Core ────────────────────────────────
  const getZoneTimeContext = (start: string, end: string) => {
    const parseTime = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const currentMins = parseTime(currentTimeStr);
    const startMins = parseTime(start);
    const endMins = parseTime(end);

    if (currentMins > endMins) {
      return {
        label: "Shift Window Closed",
        bg: C.slate900,
        text: C.white,
        status: "closed",
      };
    }
    if (currentMins >= startMins && currentMins <= endMins) {
      const remaining = endMins - currentMins;
      return {
        label: `Active: Window Closes in ${remaining}m`,
        bg: C.amberLight,
        text: C.amber,
        status: "active",
      };
    }
    return {
      label: `Queued Shift: Starts in ${startMins - currentMins}m`,
      bg: C.primaryLight,
      text: C.primary,
      status: "queued",
    };
  };

  // ─── Checklist State Mutation Handler ──────────────────────────────────────
  const handleToggleChecklistItem = (itemId: string) => {
    setZones((prevZones) =>
      prevZones.map((z) => {
        if (z.id !== activeZoneId) return z;
        return {
          ...z,
          checklist: z.checklist.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item,
          ),
        };
      }),
    );
  };

  // ─── Supervisor Verification Commit Action ─────────────────────────────────
  const handleCommitVerification = () => {
    setZones((prevZones) =>
      prevZones.map((z) => {
        if (z.id !== activeZoneId) return z;
        return {
          ...z,
          isVerified: true,
          verificationNotes: verificationInput.trim() || "Inspection cleared.",
        };
      }),
    );
    setVerificationInput("");
  };

  const handleResetVerification = () => {
    setZones((prevZones) =>
      prevZones.map((z) => {
        if (z.id !== activeZoneId) return z;
        return { ...z, isVerified: false, verificationNotes: undefined };
      }),
    );
  };

  // Meta Operations Metric Processing
  const totalTasksCount = activeZone.checklist.length;
  const completedTasksCount = activeZone.checklist.filter(
    (c) => c.completed,
  ).length;
  const taskCompletionPct =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;
  const timeContext = getZoneTimeContext(
    activeZone.startTime,
    activeZone.endTime,
  );

  return (
    <ScrollView
      style={S.container}
      contentContainerStyle={S.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Top Enterprise Metadata Monitor Deck ─── */}
      <View style={S.dashboardDeck}>
        <View>
          <Text style={S.heroTitle}>Facility Automation Core</Text>
          <Text style={S.heroSubtitle}>
            Monitoring schedule constraints, real-time checklists, and
            supervisor handshakes.
          </Text>
        </View>

        <View style={S.timeTrackingBadgeRow}>
          <Clock size={15} color={C.white} style={{ marginRight: 6 }} />
          <Text style={S.timeTrackingText}>Operational Time Anchor: </Text>
          <TextInput
            style={S.timeInlineInput}
            value={currentTimeStr}
            onChangeText={setCurrentTimeStr}
            maxLength={5}
            placeholder="10:00"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
          <Text style={S.timeInlineFormatHint}>(24hr Matrix)</Text>
        </View>
      </View>

      {/* ─── Core Matrix Split Screen Hub ─── */}
      <View style={[S.mainLayoutGrid, isWide && S.rowOrientation]}>
        {/* LEFT COLUMN: Interactive Anchor Nav Ribbon */}
        <View style={[S.navColumnBlock, isWide && { width: 340 }]}>
          <Text style={S.columnSectionLabel}>Facility Node Clusters</Text>
          <ScrollView
            horizontal={!isWide}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              S.navScrollFlex,
              !isWide && S.navHorizontalGap,
            ]}
          >
            {zones.map((zone) => {
              const isActive = zone.id === activeZoneId;
              const completedCount = zone.checklist.filter(
                (c) => c.completed,
              ).length;
              const totalCount = zone.checklist.length;
              const isZoneAllDone = completedCount === totalCount;

              return (
                <TouchableOpacity
                  key={zone.id}
                  onPress={() => setActiveZoneId(zone.id)}
                  style={[
                    S.nodeSelectorCard,
                    isActive && S.nodeSelectorCardActive,
                    !isWide && { width: 240 },
                  ]}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: zone.image }} style={S.nodeThumbnail} />
                  <View style={S.nodeMetaPayload}>
                    <Text
                      style={[
                        S.nodeTitleText,
                        isActive && S.nodeTitleTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {zone.title}
                    </Text>
                    <View style={S.nodeHorizontalDetailLine}>
                      <MapPin size={11} color={C.slate400} />
                      <Text style={S.nodeSubtext} numberOfLines={1}>
                        {zone.location}
                      </Text>
                    </View>
                    <View style={S.nodeStatusFooterRow}>
                      <View
                        style={[
                          S.badgeContainer,
                          isZoneAllDone ? S.bgEmerald : S.bgSlate,
                        ]}
                      >
                        <Text
                          style={[
                            S.badgeText,
                            isZoneAllDone ? S.textEmerald : S.textSlate,
                          ]}
                        >
                          {completedCount}/{totalCount} Tasks
                        </Text>
                      </View>
                      {zone.isVerified && (
                        <View style={S.verifiedIconMarker}>
                          <ShieldCheck size={14} color={C.emerald} />
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* RIGHT COLUMN: Selected Operational Node Dashboard Engine */}
        <View style={S.workspaceColumnBlock}>
          <SlideFadeItem key={activeZone.id}>
            {/* Visual Hero Feature Node Banner */}
            <View style={S.workspaceHeroCard}>
              <Image
                source={{ uri: activeZone.image }}
                style={S.heroFeatureImage}
              />
              <View style={S.heroImageOverlayMask} />
              <View style={S.heroPayloadContext}>
                <View
                  style={[
                    S.timeIndicatorTag,
                    { backgroundColor: timeContext.bg },
                  ]}
                >
                  <Text
                    style={[S.timeIndicatorText, { color: timeContext.text }]}
                  >
                    {timeContext.label}
                  </Text>
                </View>
                <Text style={S.heroTitleHeader}>{activeZone.title}</Text>
                <Text style={S.heroLocationSubtext}>
                  {activeZone.location} · Window: {activeZone.startTime} -{" "}
                  {activeZone.endTime}
                </Text>
              </View>
            </View>

            {/* Split Metrics Framework Context */}
            <View style={S.metaStatusGridSplit}>
              <View style={S.metaMetricsBlock}>
                <UserCheck
                  size={16}
                  color={C.primary}
                  style={S.metaIconMargin}
                />
                <View style={{ flex: 1 }}>
                  <Text style={S.metaBlockLabel}>Deployed Operator</Text>
                  <Text style={S.metaBlockValue}>
                    {activeZone.assignedStaff}
                  </Text>
                </View>
              </View>
              <View style={S.metaMetricsBlock}>
                <BookmarkCheck
                  size={16}
                  color={C.emerald}
                  style={S.metaIconMargin}
                />
                <View style={{ flex: 1 }}>
                  <Text style={S.metaBlockLabel}>Compliance Yield</Text>
                  <Text style={S.metaBlockValue}>
                    {taskCompletionPct}% Complete
                  </Text>
                </View>
              </View>
            </View>

            {/* SECTION: Cleaning Checklists Matrix Component */}
            <View style={S.contentModuleCard}>
              <View style={S.moduleHeaderRow}>
                <View>
                  <Text style={S.moduleTitleText}>Mandatory Task Matrix</Text>
                  <Text style={S.moduleSubtextText}>
                    Operators must manually sign off steps upon physical
                    validation.
                  </Text>
                </View>
                <Text style={S.moduleCounterValue}>
                  {completedTasksCount}/{totalTasksCount}
                </Text>
              </View>

              <View style={S.checklistStack}>
                {activeZone.checklist.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      !activeZone.isVerified &&
                      handleToggleChecklistItem(item.id)
                    }
                    style={[
                      S.checkRowBtn,
                      item.completed && S.checkRowBtnCompleted,
                      activeZone.isVerified && S.checkRowDisabled,
                    ]}
                    activeOpacity={0.7}
                    disabled={activeZone.isVerified}
                  >
                    <CheckCircle2
                      size={18}
                      color={item.completed ? C.emerald : C.slate400}
                      fill={item.completed ? C.emeraldLight : "transparent"}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      style={[
                        S.checkItemLabel,
                        item.completed && S.checkItemLabelCompleted,
                      ]}
                    >
                      {item.task}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* SECTION: Supervisor Verification Module Sign-off Core */}
            <View style={S.contentModuleCard}>
              <View style={S.moduleHeaderRow}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <ShieldCheck
                    size={18}
                    color={activeZone.isVerified ? C.emerald : C.amber}
                  />
                  <Text style={S.moduleTitleText}>
                    Supervisor Inspection Verification
                  </Text>
                </View>
              </View>

              {activeZone.isVerified ? (
                /* Node Context State Verified View */
                <View style={S.verifiedStatusPanel}>
                  <View style={S.verifiedBannerRow}>
                    <UserCheck
                      size={16}
                      color={C.emerald}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={S.verifiedSignatoryAuthor}>
                      Authenticated by {activeZone.supervisorName}
                    </Text>
                  </View>
                  <Text style={S.verifiedNotesBodyText}>
                    "{activeZone.verificationNotes}"
                  </Text>

                  <TouchableOpacity
                    style={S.rollbackAuditBtn}
                    onPress={handleResetVerification}
                  >
                    <RotateCcw
                      size={13}
                      color={C.rose}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={S.rollbackAuditBtnText}>
                      Rollback Verification Parameters
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* Dynamic Verification Open Input Gate Form */
                <View style={S.verificationGateForm}>
                  <View style={S.warningSignAlertRow}>
                    <AlertCircle
                      size={14}
                      color={C.amber}
                      style={{ marginRight: 6, marginTop: 1 }}
                    />
                    <Text style={S.warningSignAlertText}>
                      Signing locks execution logs. Checklist modifications will
                      be restricted until parameter resets.
                    </Text>
                  </View>

                  <Text style={S.formEntryLabel}>
                    Audit Remarks / Inspection Notes
                  </Text>
                  <TextInput
                    style={S.formTextInputField}
                    placeholder="Provide evaluation logs (e.g., Sanitize standard clear. Checked airflow metrics...)"
                    placeholderTextColor={C.slate400}
                    value={verificationInput}
                    onChangeText={setVerificationInput}
                    multiline
                    numberOfLines={3}
                  />

                  <View style={S.formActionsWrapper}>
                    <View style={S.authorizingUserHintBlock}>
                      <FileText
                        size={12}
                        color={C.slate700}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={S.authorizingUserText}>
                        Acting Auditor:{" "}
                        <Text style={{ fontWeight: "700" }}>
                          {activeZone.supervisorName}
                        </Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        S.commitVerificationBtn,
                        taskCompletionPct === 0 &&
                          S.commitVerificationBtnDisabled,
                      ]}
                      onPress={handleCommitVerification}
                      disabled={taskCompletionPct === 0}
                    >
                      <CheckCircle2
                        size={14}
                        color={C.white}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={S.commitVerificationBtnText}>
                        Authorize Handshake
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </SlideFadeItem>
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Native Layout Interface Stylesheet Architecture ────────────────────────

interface StylesheetInterface {
  container: ViewStyle;
  scrollContent: ViewStyle;
  dashboardDeck: ViewStyle;
  deckMeta: ViewStyle;
  deckTitle: TextStyle;
  deckSubtitle: TextStyle;
  timeTrackingBadgeRow: ViewStyle;
  timeTrackingText: TextStyle;
  timeInlineInput: TextStyle;
  timeInlineFormatHint: TextStyle;
  mainLayoutGrid: ViewStyle;
  rowOrientation: ViewStyle;
  navColumnBlock: ViewStyle;
  columnSectionLabel: TextStyle;
  navScrollFlex: ViewStyle;
  navHorizontalGap: ViewStyle;
  nodeSelectorCard: ViewStyle;
  nodeSelectorCardActive: ViewStyle;
  nodeThumbnail: ImageStyle;
  nodeMetaPayload: ViewStyle;
  nodeTitleText: TextStyle;
  nodeTitleTextActive: TextStyle;
  nodeHorizontalDetailLine: ViewStyle;
  nodeSubtext: TextStyle;
  nodeStatusFooterRow: ViewStyle;
  badgeContainer: ViewStyle;
  bgEmerald: ViewStyle;
  bgSlate: ViewStyle;
  badgeText: TextStyle;
  textEmerald: TextStyle;
  textSlate: TextStyle;
  verifiedIconMarker: ViewStyle;
  workspaceWorkspaceBlock: ViewStyle;
  workspaceColumnBlock: ViewStyle;
  workspaceHeroCard: ViewStyle;
  heroFeatureImage: ImageStyle;
  heroImageOverlayMask: ViewStyle;
  heroPayloadContext: ViewStyle;
  timeIndicatorTag: ViewStyle;
  timeIndicatorText: TextStyle;
  heroTitleHeader: TextStyle;
  heroLocationSubtext: TextStyle;
  metaStatusGridSplit: ViewStyle;
  metaMetricsBlock: ViewStyle;
  metaIconMargin: ViewStyle;
  metaBlockLabel: TextStyle;
  metaBlockValue: TextStyle;
  contentModuleCard: ViewStyle;
  moduleHeaderRow: ViewStyle;
  moduleTitleText: TextStyle;
  moduleSubtextText: TextStyle;
  moduleCounterValue: TextStyle;
  checklistStack: ViewStyle;
  checkRowBtn: ViewStyle;
  checkRowBtnCompleted: ViewStyle;
  checkRowDisabled: ViewStyle;
  checkItemLabel: TextStyle;
  checkItemLabelCompleted: TextStyle;
  verifiedStatusPanel: ViewStyle;
  verifiedBannerRow: ViewStyle;
  verifiedSignatoryAuthor: TextStyle;
  verifiedNotesBodyText: TextStyle;
  rollbackAuditBtn: ViewStyle;
  rollbackAuditBtnText: TextStyle;
  verificationGateForm: ViewStyle;
  warningSignAlertRow: ViewStyle;
  warningSignAlertText: TextStyle;
  formEntryLabel: TextStyle;
  formTextInputField: TextStyle;
  formActionsWrapper: ViewStyle;
  authorizingUserHintBlock: ViewStyle;
  authorizingUserText: TextStyle;
  commitVerificationBtn: ViewStyle;
  commitVerificationBtnDisabled: ViewStyle;
  commitVerificationBtnText: TextStyle;
  heroTitle: TextStyle;
  heroSubtitle: TextStyle;
}

const S = StyleSheet.create<StylesheetInterface>({
  container: { flex: 1, backgroundColor: "#fbececb5" },
  scrollContent: { padding: isWide ? 24 : 14, paddingBottom: 60 },
  dashboardDeck: {
    borderRadius: 20,
    // padding: 10,
    marginBottom: 40,
  },
  deckMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  deckTitle: { fontSize: 18, fontWeight: "800", color: C.white },
  deckSubtitle: {
    fontSize: 13,
    color: C.slate400,
    marginTop: 4,
    lineHeight: 18,
  },
  timeTrackingBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(86, 14, 14)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 14,
  },
  timeTrackingText: { fontSize: 12, color: C.white, fontWeight: "500" },
  timeInlineInput: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: C.white,
    fontWeight: "700",
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 12,
    textAlign: "center",
    minWidth: 45,
  },
  timeInlineFormatHint: { fontSize: 11, color: C.slate400, marginLeft: 6 },
  mainLayoutGrid: { gap: 16 },
  rowOrientation: {
    flexDirection: isMid ? "row" : "column",
    alignItems: "flex-start",
  },
  navColumnBlock: { width: "100%", gap: 10 },
  columnSectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.slate700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  navScrollFlex: { flexDirection: "row", flexWrap: isWide ? "wrap" : "nowrap" },
  navHorizontalGap: { gap: 10, paddingBottom: 6 },
  nodeSelectorCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: C.border,
    padding: 10,
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: isWide ? 10 : 0,
  },
  nodeSelectorCardActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryLight,
  },
  nodeThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: C.bg,
  },
  nodeMetaPayload: { flex: 1, justifyContent: "center" },
  nodeTitleText: { fontSize: 14, fontWeight: "700", color: C.slate900 },
  nodeTitleTextActive: { color: C.primary },
  nodeHorizontalDetailLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  nodeSubtext: { fontSize: 12, color: C.slate700, flex: 1 },
  nodeStatusFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  badgeContainer: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6 },
  bgEmerald: { backgroundColor: C.emeraldLight },
  bgSlate: { backgroundColor: C.bg },
  badgeText: { fontSize: 10, fontWeight: "700" },
  textEmerald: { color: C.emerald },
  textSlate: { color: C.slate700 },
  verifiedIconMarker: { padding: 2 },
  workspaceColumnBlock: { flex: 1, gap: 16 },
  workspaceHeroCard: {
    height: 160,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  heroFeatureImage: { width: "100%", height: "100%" },
  heroImageOverlayMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  heroPayloadContext: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: "flex-start",
  },
  timeIndicatorTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  timeIndicatorText: { fontSize: 11, fontWeight: "700" },
  heroTitleHeader: { fontSize: 20, fontWeight: "800", color: C.white },
  heroLocationSubtext: { fontSize: 13, color: C.slate400, marginTop: 2 },
  metaStatusGridSplit: { flexDirection: "row", gap: 12 },
  metaMetricsBlock: {
    flex: 1,
    backgroundColor: C.white,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
  },
  metaIconMargin: { marginRight: 10 },
  metaBlockLabel: { fontSize: 11, color: C.slate700, fontWeight: "500" },
  metaBlockValue: {
    fontSize: 13,
    fontWeight: "700",
    color: C.slate900,
    marginTop: 1,
  },
  contentModuleCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: isWide ? 20 : 16,
    marginTop: 14,
  },
  moduleHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  moduleTitleText: { fontSize: 15, fontWeight: "800", color: C.slate900 },
  moduleSubtextText: { fontSize: 12, color: C.slate700, marginTop: 1 },
  moduleCounterValue: {
    fontSize: 14,
    fontWeight: "800",
    color: C.primary,
    backgroundColor: C.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  checklistStack: { gap: 8 },
  checkRowBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#fafafa",
  },
  checkRowBtnCompleted: {
    backgroundColor: C.white,
    borderColor: C.emeraldLight,
  },
  checkRowDisabled: { opacity: 0.75 },
  checkItemLabel: {
    fontSize: 13,
    color: C.slate900,
    fontWeight: "600",
    flex: 1,
  },
  checkItemLabelCompleted: {
    color: C.slate700,
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  verifiedStatusPanel: {
    backgroundColor: C.emeraldLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  verifiedBannerRow: { flexDirection: "row", alignItems: "center" },
  verifiedSignatoryAuthor: {
    fontSize: 13,
    fontWeight: "700",
    color: C.emerald,
  },
  verifiedNotesBodyText: {
    fontSize: 13,
    color: "#065f46",
    marginTop: 6,
    fontStyle: "italic",
    lineHeight: 18,
  },
  rollbackAuditBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    alignSelf: "flex-start",
  },
  rollbackAuditBtnText: { fontSize: 12, fontWeight: "700", color: C.rose },
  verificationGateForm: { gap: 12 },
  warningSignAlertRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: C.amberLight,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  warningSignAlertText: {
    fontSize: 11,
    color: C.amber,
    fontWeight: "600",
    flex: 1,
    lineHeight: 15,
  },
  formEntryLabel: { fontSize: 12, fontWeight: "700", color: C.slate700 },
  formTextInputField: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    color: C.slate900,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: "top",
    backgroundColor: "#fcfcfd",
  },
  formActionsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  authorizingUserHintBlock: { flexDirection: "row", alignItems: "center" },
  authorizingUserText: { fontSize: 12, color: C.slate700 },
  commitVerificationBtn: {
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  commitVerificationBtnDisabled: { backgroundColor: C.slate400, opacity: 0.5 },
  commitVerificationBtnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "700",
  },
  workspaceWorkspaceBlock: {},
  heroTitle: {
    fontSize: isWide ? 26 : 22,
    fontWeight: "800",
    color: "#5C2E14",
  },
  heroSubtitle: {
    color: "#5C2E14",
    fontSize: isWide ? 14 : 12,
    marginTop: 4,
    opacity: 0.8,
  },
});
