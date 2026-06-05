import * as ImagePicker from "expo-image-picker";
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  CornerUpLeft,
  Image as ImageIcon,
  LayoutGrid,
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
  }, [delay, op, sl]);

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

const INITIAL_TASKS: CleaningTask[] = [
  {
    id: "TSK-8092",
    title: "Sanitize all high-touch surface counters",
    area: "Washroom Complex B (Floor 2)",
    zoneKey: "washroom",
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
    zoneKey: "laboratory",
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
    id: "TSK-8075",
    title: "Emergency Spill Cleanup: Chemical residue leak",
    area: "Advanced Physics Lab 3",
    zoneKey: "laboratory",
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
    zoneKey: "classroom",
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
    id: "TSK-7994",
    title: "Deep scrub and vacuum carpet runner lines",
    area: "Lecture Hall Suite 102",
    zoneKey: "classroom",
    shift: "Afternoon Shift",
    status: "In Progress",
    priority: "Medium",
    type: "Recurring Scheduled",
    timing: "02:00 PM",
    assignee: "James Kimani",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80",
  },
];

export default function TaskManagementScreen() {
  const [tasks, setTasks] = useState<CleaningTask[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<"card" | "table">(
    isWide ? "table" : "card",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Parent Dashboard Alerts
  const [dashboardAlert, setDashboardAlert] = useState<{
    visible: boolean;
    text: string;
  } | null>(null);

  // Form Field Validation Banner State Engine
  const [modalAlert, setModalAlert] = useState<{
    text: string;
    type: "error" | "warning";
  } | null>(null);

  // Form Field Tracking States
  const [newTitle, setNewTitle] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newZone, setNewZone] = useState<
    "washroom" | "classroom" | "laboratory" | "office"
  >("washroom");
  const [newShift, setNewShift] = useState("Morning Shift");
  const [newAssignee, setNewAssignee] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const triggerDashboardSuccess = (id: string) => {
    setDashboardAlert({
      visible: true,
      text: `Success: Order ${id} added to the operations ledger.`,
    });
    setTimeout(() => setDashboardAlert(null), 4000);
  };

  // Image Picker Logic Handler
  const handlePickImage = async () => {
    if (modalAlert) setModalAlert(null);

    // Request device library permissions explicitly
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      setModalAlert({
        text: "Permission Denied: Access to device photo storage is required.",
        type: "error",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCreateTask = () => {
    // Validation Layer 1: Empty Required String Elements
    if (!newTitle.trim() || !newArea.trim()) {
      setModalAlert({
        text: "Missing Fields: Title and Area target are required.",
        type: "error",
      });
      return;
    }

    // Validation Layer 2: Requiring an Image Attachment
    if (!selectedImage) {
      setModalAlert({
        text: "Missing Attachment: An operational area reference image is required.",
        type: "error",
      });
      return;
    }

    const assignedIdNumber = Math.floor(1000 + Math.random() * 9000);
    const generatedIdString = `TSK-${assignedIdNumber}`;

    const newTask: CleaningTask = {
      id: generatedIdString,
      title: newTitle.trim(),
      area: newArea.trim(),
      zoneKey: newZone,
      shift: newShift,
      status: "Assigned",
      priority: "Medium",
      type: "Daily Cleaning",
      timing: "As Scheduled",
      assignee: newAssignee.trim() || "Unassigned",
      image: selectedImage, // Attaches local image URI path
    };

    setTasks([newTask, ...tasks]);
    setModalVisible(false);

    // Context Field Form Clear
    setNewTitle("");
    setNewArea("");
    setNewAssignee("");
    setSelectedImage(null);
    setModalAlert(null);

    triggerDashboardSuccess(generatedIdString);
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={S.screen}>
      {dashboardAlert && (
        <View style={S.dashAlertLayout}>
          <View style={S.alertTextCluster}>
            <CheckCircle2 size={16} color={C.green} />
            <Text style={S.dashAlertTextString}>{dashboardAlert.text}</Text>
          </View>
          <TouchableOpacity onPress={() => setDashboardAlert(null)}>
            <X size={14} color={C.green} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={S.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInUp delay={0}>
          <View style={S.heroMeta}>
            <View>
              <Text style={S.heroTitle}>Operations Console</Text>
              <Text style={S.heroSubtitle}>
                Deploy site allocations and attach audit visual streams.
              </Text>
            </View>
            <TouchableOpacity
              style={S.addTaskBtn}
              activeOpacity={0.85}
              onPress={() => {
                setModalAlert(null);
                setModalVisible(true);
              }}
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
                placeholder="Search allocations..."
                placeholderTextColor={C.textTer}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[S.searchInputField, { outline: "none" } as any]}
              />
            </View>

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
          <View style={S.ledgerGridContainer}>
            {filteredTasks.map((task, index) => {
              const status =
                STATUS_CONFIG[task.status] || STATUS_CONFIG["Assigned"];
              const StatusIcon = status.icon;
              const areaColor = C[task.zoneKey] || C.indigo;

              return (
                <FadeInUp
                  key={task.id}
                  delay={120 + index * 40}
                  style={S.gridCardWrapper}
                >
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    minHeight: 52,
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <Text style={[S.tableHeadCell, { width: 100 }]}>Image</Text>
                  <Text style={[S.tableHeadCell, { width: 120 }]}>Task ID</Text>
                  <Text style={[S.tableHeadCell, { width: 300 }]}>
                    Allocation Title
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 220 }]}>
                    Spatial Area
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 130 }]}>Status</Text>
                  <Text style={[S.tableHeadCell, { width: 150 }]}>
                    Assignee
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 180 }]}>Shift</Text>
                </div>

                {filteredTasks.map((task, index) => {
                  const status =
                    STATUS_CONFIG[task.status] || STATUS_CONFIG["Assigned"];
                  return (
                    <View
                      key={task.id}
                      style={[
                        S.tableBodyRow,
                        index % 2 === 1 && { backgroundColor: C.bg },
                      ]}
                    >
                      <View style={{ width: 90, justifyContent: "center" }}>
                        <Image
                          source={{ uri: task.image }}
                          style={S.tableRowThumbnail}
                        />
                      </View>
                      <Text
                        style={[
                          S.tableCellText,
                          { width: 120, fontWeight: "700" },
                        ]}
                      >
                        {task.id}
                      </Text>
                      <Text
                        style={[S.tableCellText, { width: 300 }]}
                        numberOfLines={2}
                      >
                        {task.title}
                      </Text>
                      <Text
                        style={[
                          S.tableCellText,
                          {
                            width: 220,
                            color: C[task.zoneKey] || C.textPrimary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {task.area}
                      </Text>
                      <View style={{ width: 130, justifyContent: "center" }}>
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
                            style={[S.statusBadgeText, { color: status.color }]}
                          >
                            {status.label}
                          </Text>
                        </View>
                      </View>
                      <Text style={[S.tableCellText, { width: 150 }]}>
                        {task.assignee}
                      </Text>
                      <Text style={[S.tableCellText, { width: 180 }]}>
                        {task.shift}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </FadeInUp>
        )}
      </ScrollView>

      {/* Form Action Sheet Modal Layer */}
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

            {modalAlert && (
              <View
                style={[
                  S.modalAlertWrapper,
                  modalAlert.type === "error"
                    ? { backgroundColor: C.redLight, borderColor: C.red }
                    : { backgroundColor: C.amberLight, borderColor: C.amber },
                ]}
              >
                <AlertOctagon
                  size={14}
                  color={modalAlert.type === "error" ? C.red : C.amber}
                />
                <Text
                  style={[
                    S.modalAlertText,
                    modalAlert.type === "error"
                      ? { color: C.red }
                      : { color: C.amber },
                  ]}
                >
                  {modalAlert.text}
                </Text>
              </View>
            )}

            <ScrollView
              style={S.modalFormScrollFrame}
              showsVerticalScrollIndicator={false}
            >
              {/* Image Picker Trigger Component Slot */}
              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>
                  Reference Image Attachment *
                </Text>
                <TouchableOpacity
                  style={S.imageUploadBox}
                  activeOpacity={0.8}
                  onPress={handlePickImage}
                >
                  {selectedImage ? (
                    <View style={S.selectedImageContainer}>
                      <Image
                        source={{ uri: selectedImage }}
                        style={S.uploadedPreviewImage}
                      />
                      <View style={S.imageChangeBadge}>
                        <Text style={S.imageChangeText}>Change Photo</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={S.uploadPlaceholderContainer}>
                      <ImageIcon size={24} color={C.textTer} />
                      <Text style={S.uploadPlaceholderText}>
                        Click to upload reference attachment photo
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>
                  Task Title / Cleaning Objective *
                </Text>
                <TextInput
                  placeholder="e.g., Deep clean layout partitions and glass mirrors"
                  placeholderTextColor={C.textTer}
                  value={newTitle}
                  onChangeText={(val) => {
                    setNewTitle(val);
                    if (modalAlert) setModalAlert(null);
                  }}
                  style={S.formInputField}
                />
              </View>

              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>
                  Area Location Matrix Target *
                </Text>
                <TextInput
                  placeholder="e.g., Washroom Block A Level 3"
                  placeholderTextColor={C.textTer}
                  value={newArea}
                  onChangeText={(val) => {
                    setNewArea(val);
                    if (modalAlert) setModalAlert(null);
                  }}
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
  dashAlertLayout: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.greenLight,
    borderWidth: 1,
    borderColor: C.green,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 4,
  },
  alertTextCluster: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  dashAlertTextString: {
    fontSize: 13,
    fontWeight: "600",
    color: C.green,
    flex: 1,
  },
  heroMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
    marginTop: 10,
  },
  heroTitle: {
    fontSize: isWide ? 26 : 22,
    fontWeight: "800",
    color: "#5C2E14",
  },
  heroSubtitle: { color: "#5C2E14", fontSize: isWide ? 14 : 12, marginTop: 4 },
  addTaskBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  addTaskBtnText: { color: C.dark, fontSize: 13, fontWeight: "700" },
  toolbarRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
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
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInputField: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: C.border,
    borderRadius: 12,
    padding: 4,
    gap: 2,
  },
  toggleBtn: { padding: 8, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: C.dark2 },
  ledgerGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  gridCardWrapper: {
    width: isWide ? "33.33%" : isMid ? "50%" : "100%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    height: "100%",
    justifyContent: "space-between",
  },
  cardInnerHorizontalRow: { flexDirection: "row", gap: 12 },
  cardMediaThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: C.bg,
  },
  cardContentTextFrame: { flex: 1, justifyContent: "space-between" },
  taskCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskIdString: { fontSize: 11, fontWeight: "700", color: C.textTer },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusBadgeText: { fontSize: 10, fontWeight: "700" },
  taskMainTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
    marginTop: 4,
  },
  spatialTargetLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  spatialAreaText: { fontSize: 11, fontWeight: "600" },
  dividerLine: { height: 1, backgroundColor: C.border, marginVertical: 12 },
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
    maxWidth: 100,
  },
  tableOuterScroll: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  tableContainerBlock: { padding: 8 },
  tableBodyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableHeadCell: { fontSize: 12, fontWeight: "700", color: C.textSec },
  tableCellText: { fontSize: 13, color: C.textPrimary },
  tableRowThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: C.bg,
  },
  emptyBoxContainer: { alignItems: "center", padding: 48 },
  emptyTitleText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textSec,
    marginTop: 8,
  },

  // Modal layout configurations
  modalOverlayFrame: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentSheet: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 24,
    maxHeight: "85%",
    width: isWide ? 500 : "92%",
  },
  modalFormHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitleString: { fontSize: 18, fontWeight: "800", color: C.textPrimary },
  modalCloseCircle: { backgroundColor: C.bg, padding: 6, borderRadius: 100 },
  modalAlertWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  modalAlertText: { fontSize: 12, fontWeight: "600", flex: 1 },
  modalFormScrollFrame: { marginBottom: 10 },
  formGroup: { marginBottom: 16 },
  formFieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 8,
  },
  formInputField: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 13,
    color: C.textPrimary,
  },
  inlineSelectorRibbon: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  selectorPillItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  selectorPillText: { fontSize: 11, fontWeight: "700", color: C.textSec },
  modalSubmitActionButton: {
    backgroundColor: C.classroom,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  modalSubmitButtonText: { color: C.white, fontSize: 14, fontWeight: "700" },

  // New Image Upload Box Styling Block
  imageUploadBox: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    height: 120,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
  },
  uploadPlaceholderContainer: { alignItems: "center", gap: 6, padding: 16 },
  uploadPlaceholderText: {
    fontSize: 11,
    color: C.textSec,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedImageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  uploadedPreviewImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imageChangeBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  imageChangeText: { color: C.white, fontSize: 10, fontWeight: "700" },
});
