import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  CornerUpLeft,
  LayoutGrid,
  ListTodo,
  MapPin,
  Play,
  Plus,
  Search,
  Table,
  User,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");
const isWide = SW > 900;
const isMid = SW > 600;

const C = {
  bg: "#f8f7ff",
  white: "#FFFFFF",
  dark: "#16082e",
  dark2: "#1e1135",
  textPrimary: "#0f172a",
  textSec: "#64748b",
  textTer: "#94a3b8",
  indigo: "#6366f1",
  indigoLight: "#eef2ff",
  green: "#10b981",
  greenLight: "#d1fae5",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  red: "#ef4444",
  redLight: "#fee2e2",
  sky: "#0ea5e9",
  purple: "#8b5cf6",
  purpleLight: "#f5f3ff",
  border: "#f1f5f9",

  classroom: "#E35336",
  washroom: "#2D8A4E",
  laboratory: "#7C3AED",
  library: "#2563EB",
  playground: "#059669",
  office: "#D97706",
};

const FadeInUp = ({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) => {
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
  }, []);

  return (
    <Animated.View
      style={[{ opacity: op, transform: [{ translateY: sl }] }, style]}
    >
      {children}
    </Animated.View>
  );
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  Assigned: { label: "Assigned", color: C.sky, bg: "#e0f2fe", icon: Clock },
  "In Progress": {
    label: "In Progress",
    color: C.amber,
    bg: C.amberLight,
    icon: Play,
  },
  Completed: {
    label: "Completed",
    color: C.green,
    bg: C.greenLight,
    icon: CheckCircle2,
  },
  Reopened: {
    label: "Reopened",
    color: C.red,
    bg: C.redLight,
    icon: CornerUpLeft,
  },
  Escalated: {
    label: "Escalated",
    color: C.purple,
    bg: C.purpleLight,
    icon: AlertOctagon,
  },
};
interface CleaningTask {
  id: string;
  title: string;
  area: string;
  zoneKey: "washroom" | "laboratory" | "classroom" | "office";
  shift: string;
  status: string;
  priority: string;
  type: string;
  timing: string;
  assignee: string;
  image: string;
}
const INITIAL_TASKS = [
  {
    id: "TSK-8092",
    title: "Sanitize all high-touch surface counters",
    area: "Washroom Complex B (Floor 2)",
    zoneKey: "washroom" as const,
    shift: "Morning Shift",
    status: "Assigned",
    priority: "High",
    type: "Daily Cleaning",
    timing: "08:30 AM",
    assignee: "Maria Santos",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
  },
  {
    id: "TSK-8075",
    title: "Emergency Spill Cleanup: Chemical residue leak",
    area: "Advanced Physics Lab 3",
    zoneKey: "laboratory" as const,
    shift: "Morning Shift",
    status: "Escalated",
    priority: "Critical",
    type: "Emergency Request",
    timing: "Immediate Action",
    assignee: "Tom Baker",
    image:
      "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?w=400&q=80",
  },
  {
    id: "TSK-7994",
    title: "Deep scrub and vacuum carpet runner lines",
    area: "Lecture Hall Suite 102",
    zoneKey: "classroom" as const,
    shift: "Afternoon Shift",
    status: "In Progress",
    priority: "Medium",
    type: "Recurring Scheduled",
    timing: "02:00 PM",
    assignee: "James Kimani",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80",
  },
  {
    id: "TSK-8095",
    title: "Sanitize all high-touch surface counters",
    area: "Washroom Complex B (Floor 2)",
    zoneKey: "washroom" as const,
    shift: "Morning Shift",
    status: "Assigned",
    priority: "High",
    type: "Daily Cleaning",
    timing: "08:30 AM",
    assignee: "Maria Santos",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
  },
];

export default function TaskManagementScreen() {
  const [tasks, setTasks] = useState<CleaningTask[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // New Form Fields State
  const [newTitle, setNewTitle] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newZone, setNewZone] = useState<
    "washroom" | "classroom" | "laboratory" | "office"
  >("washroom");
  const [newShift, setNewShift] = useState("Morning Shift");
  const [newAssignee, setNewAssignee] = useState("");

  const handleCreateTask = () => {
    if (!newTitle || !newArea) return;

    const newTask = {
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      area: newArea,
      zoneKey: newZone,
      shift: newShift,
      status: "Assigned",
      priority: "Medium",
      type: "Daily Cleaning",
      timing: "As Scheduled",
      assignee: newAssignee || "Unassigned",
      image:
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80", // Fallback clean image token
    };

    setTasks([newTask, ...tasks]);
    setModalVisible(false);

    // Reset Form Fields
    setNewTitle("");
    setNewArea("");
    setNewAssignee("");
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={S.screen}>
      <ScrollView
        contentContainerStyle={S.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Billboard Header Banner */}
        <FadeInUp delay={0}>
          <View style={S.heroMeta}>
            <View>
              <Text style={S.heroTitle}>Operations Console</Text>
              <Text style={S.heroSubtitle}>
                Deploy site allocations, view audit logs, and schedule daily
                tasks.
              </Text>
            </View>
            <TouchableOpacity
              style={S.addTaskBtn}
              activeOpacity={0.85}
              onPress={() => setModalVisible(true)}
            >
              <Plus size={14} color={C.dark} strokeWidth={3} />
              <Text style={S.addTaskBtnText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </FadeInUp>

        {/* Layout Controller Toolbar Strip */}
        <FadeInUp delay={100}>
          <View style={S.toolbarRow}>
            <View style={S.searchBarContainer}>
              <Search size={16} color={C.textTer} style={S.searchIcon} />
              <TextInput
                placeholder="Search allocations, operational tokens, operators..."
                placeholderTextColor={C.textTer}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[S.searchInputField, { outline: "none" }]}
              />
            </View>

            {/* Layout Presentation Toggle Controls */}
            <View style={S.toggleWrapper}>
              <TouchableOpacity
                style={[S.toggleBtn, viewMode === "card" && S.toggleBtnActive]}
                onPress={() => setViewMode("card")}
              >
                <LayoutGrid
                  size={16}
                  color={viewMode === "card" ? C.white : C.textSec}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[S.toggleBtn, viewMode === "table" && S.toggleBtnActive]}
                onPress={() => setViewMode("table")}
              >
                <Table
                  size={16}
                  color={viewMode === "table" ? C.white : C.textSec}
                />
              </TouchableOpacity>
            </View>
          </View>
        </FadeInUp>

        {viewMode === "card" ? (
          /* Cards Grid Array Layout Matrix */
          <View style={S.ledgerGridContainer}>
            {filteredTasks.map((task, index) => {
              const status =
                STATUS_CONFIG[task.status] || STATUS_CONFIG["Assigned"];
              const StatusIcon = status.icon;
              const areaColor = C[task.zoneKey as keyof typeof C] || C.indigo;

              return (
                <FadeInUp key={task.id} delay={120 + index * 40}>
                  <View style={S.taskCard}>
                    <View style={S.cardInnerHorizontalRow}>
                      <Image
                        source={{ uri: task.image }}
                        style={S.cardMediaThumbnail}
                      />

                      <View style={S.cardContentTextFrame}>
                        <View style={S.taskCardHeader}>
                          <Text style={S.taskIdString}>{task.id}</Text>
                          <View
                            style={[
                              S.statusBadge,
                              { backgroundColor: status.bg },
                            ]}
                          >
                            <StatusIcon
                              size={10}
                              color={status.color}
                              style={{ marginRight: 3 }}
                            />
                            <Text
                              style={[
                                S.statusBadgeText,
                                { color: status.color },
                              ]}
                            >
                              {status.label}
                            </Text>
                          </View>
                        </View>

                        <Text style={S.taskMainTitle} numberOfLines={2}>
                          {task.title}
                        </Text>

                        <View style={S.spatialTargetLine}>
                          <MapPin size={11} color={areaColor} />
                          <Text
                            style={[S.spatialAreaText, { color: areaColor }]}
                            numberOfLines={1}
                          >
                            {task.area}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={S.dividerLine} />

                    <View style={S.taskCardFooter}>
                      <Text style={S.footerParamText}>
                        {task.timing} • {task.shift}
                      </Text>
                      <View style={S.assigneeCluster}>
                        <User size={11} color={C.textSec} />
                        <Text style={S.assigneeNameText} numberOfLines={1}>
                          {task.assignee}
                        </Text>
                      </View>
                    </View>
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
                {/* Header */}
                <View style={S.tableHeaderRow}>
                  <Text style={[S.tableHeadCell, { width: 90 }]}>Image</Text>
                  <Text style={[S.tableHeadCell, { width: 120 }]}>Task ID</Text>
                  <Text style={[S.tableHeadCell, { width: 280 }]}>
                    Allocation Title
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 220 }]}>
                    Spatial Area
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 130 }]}>Status</Text>
                  <Text style={[S.tableHeadCell, { width: 150 }]}>
                    Assignee
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 150 }]}>
                    Shift & Timing
                  </Text>
                </View>

                {filteredTasks.map((task, index) => {
                  const status =
                    STATUS_CONFIG[task.status] || STATUS_CONFIG["Assigned"];

                  return (
                    <View
                      key={task.id}
                      style={[
                        S.tableBodyRow,
                        {
                          flexDirection: "row",
                          alignItems: "center",
                        },
                        index % 2 === 1 && {
                          backgroundColor: C.bg,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: 90,

                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={{ uri: task.image }}
                          style={S.tableRowThumbnail}
                        />
                      </View>

                      <Text
                        style={[
                          S.tableCellText,
                          {
                            width: 120,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {task.id}
                      </Text>

                      <Text
                        style={[S.tableCellText, { width: 280 }]}
                        numberOfLines={2}
                      >
                        {task.title}
                      </Text>

                      <Text
                        style={[
                          S.tableCellText,
                          {
                            width: 220,
                            color:
                              C[task.zoneKey as keyof typeof C] ||
                              C.textPrimary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {task.area}
                      </Text>

                      {/* Status */}
                      <View
                        style={{
                          width: 130,
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={[
                            S.statusBadge,
                            {
                              backgroundColor: status.bg,
                              alignSelf: "flex-start",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              S.statusBadgeText,
                              {
                                color: status.color,
                                fontSize: 10,
                              },
                            ]}
                          >
                            {status.label}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          S.tableCellText,
                          {
                            width: 150,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {task.assignee}
                      </Text>
                      <Text
                        style={[
                          S.tableCellText,
                          {
                            width: 200,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {task.shift} • {task.timing}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </FadeInUp>
        )}
        {/* Empty Search Fallback Template */}
        {filteredTasks.length === 0 && (
          <View style={S.emptyBoxContainer}>
            <ListTodo size={32} color={C.textTer} />
            <Text style={S.emptyTitleText}>No Allocations Listed</Text>
          </View>
        )}
      </ScrollView>

      {/* ─── FORM MODAL POPUP SHEET ENGINE ─── */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={S.modalOverlayFrame}>
          <View style={S.modalContentSheet}>
            <View style={S.modalFormHeaderRow}>
              <Text style={S.modalTitleString}>Create Operational Task</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={S.modalCloseCircle}
              >
                <X size={16} color={C.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={S.modalFormScrollFrame}
              showsVerticalScrollIndicator={false}
            >
              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>
                  Task Title / Cleaning Objective
                </Text>
                <TextInput
                  placeholder="e.g., Deep clean layout partitions and glass mirrors"
                  placeholderTextColor={C.textTer}
                  value={newTitle}
                  onChangeText={setNewTitle}
                  style={S.formInputField}
                />
              </View>

              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>Area Location Location</Text>
                <TextInput
                  placeholder="e.g., Washroom Block A Level 3"
                  placeholderTextColor={C.textTer}
                  value={newArea}
                  onChangeText={setNewArea}
                  style={S.formInputField}
                />
              </View>

              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>
                  Structural Zone Classification Tag
                </Text>
                <View style={S.inlineSelectorRibbon}>
                  {(
                    ["washroom", "classroom", "laboratory", "office"] as const
                  ).map((zone) => (
                    <TouchableOpacity
                      key={zone}
                      style={[
                        S.selectorPillItem,
                        newZone === zone && {
                          backgroundColor: C[zone],
                          borderColor: C[zone],
                        },
                      ]}
                      onPress={() => setNewZone(zone)}
                    >
                      <Text
                        style={[
                          S.selectorPillText,
                          newZone === zone && { color: C.white },
                        ]}
                      >
                        {zone.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>
                  Operator / Assignee Personnel Name
                </Text>
                <TextInput
                  placeholder="e.g., Maria Santos"
                  placeholderTextColor={C.textTer}
                  value={newAssignee}
                  onChangeText={setNewAssignee}
                  style={S.formInputField}
                />
              </View>

              <TouchableOpacity
                style={S.modalSubmitActionButton}
                activeOpacity={0.85}
                onPress={handleCreateTask}
              >
                <Text style={S.modalSubmitButtonText}>
                  Inject Allocation Order
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbececb5" },
  content: { padding: isWide ? 24 : 16, paddingBottom: 40 },
  heroContainer: {
    padding: isWide ? 28 : 20,
    borderRadius: 24,
    marginBottom: 20,
  },
  heroMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
    marginVertical: 10,
  },
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
  addTaskBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 4,
  },
  addTaskBtnText: { color: C.dark, fontSize: 13, fontWeight: "700" },
  metricsStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  metricBlock: { alignItems: "center" },
  metricNumber: { fontSize: 18, fontWeight: "800", color: C.white },
  metricLabel: { fontSize: 11, color: C.textTer, marginTop: 2 },
  stripDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  toolbarRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: { marginRight: 6 },
  searchInputField: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 12,
    fontWeight: "500",
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: C.border,
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  toggleBtn: { padding: 6, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: C.dark2 },
  ledgerGridContainer: { gap: 12 },
  taskCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
  },
  cardInnerHorizontalRow: { flexDirection: "row", gap: 12 },
  cardMediaThumbnail: {
    width: 75,
    height: 75,
    borderRadius: 12,
    backgroundColor: C.bg,
  },
  cardContentTextFrame: { flex: 1, justifyContent: "space-between" },
  taskCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskIdString: { fontSize: 11, fontWeight: "700", color: C.textPrimary },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  statusBadgeText: { fontSize: 10, fontWeight: "700" },
  taskMainTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
    marginTop: 3,
  },
  spatialTargetLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  spatialAreaText: { fontSize: 11, fontWeight: "600" },
  dividerLine: { height: 1, backgroundColor: C.border, marginVertical: 10 },
  taskCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerParamText: { fontSize: 11, color: C.textSec, fontWeight: "500" },
  assigneeCluster: { flexDirection: "row", alignItems: "center", gap: 4 },
  assigneeNameText: {
    fontSize: 11,
    fontWeight: "600",
    color: C.textPrimary,
    maxWidth: 90,
  },
  tableOuterScroll: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  tableContainerBlock: { padding: 14 },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 52,
  },

  tableBodyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  tableHeadCell: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },

  tableCellText: {
    fontSize: 13,
    color: "#1e293b",
  },
  tableRowThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: C.bg,
  },

  emptyBoxContainer: { alignItems: "center", padding: 36 },
  emptyTitleText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textSec,
    marginTop: 8,
  },
  modalOverlayFrame: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentSheet: {
    backgroundColor: C.white,
    borderRadius: 24,

    padding: 20,
    maxHeight: "85%",
    width: isWide ? 500 : "90%",
  },
  modalFormHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitleString: { fontSize: 16, fontWeight: "800", color: C.textPrimary },
  modalCloseCircle: {
    backgroundColor: C.bg,
    padding: 6,
    borderRadius: 100,
  },
  modalFormScrollFrame: { marginBottom: 10 },
  formGroup: { marginBottom: 14 },
  formFieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 6,
  },
  formInputField: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 13,
    color: C.textPrimary,
  },
  inlineSelectorRibbon: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  selectorPillItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  selectorPillText: { fontSize: 10, fontWeight: "700", color: C.textSec },
  modalSubmitActionButton: {
    backgroundColor: C.classroom,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  modalSubmitButtonText: { color: C.white, fontSize: 13, fontWeight: "700" },
});
