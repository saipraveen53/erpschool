import {
  AlertTriangle,
  Briefcase,
  ChevronRight,
  Clock,
  Edit2,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
  X,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageStyle,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

// Central Design System Tokens
const C = {
  bg: "#fbececb5",
  white: "#FFFFFF",
  primary: "#dc2626",
  primaryLight: "#f7eaea",
  textPrimary: "#0f172a",
  textSec: "#64748b",
  textTer: "#94a3b8",
  border: "#e2e8f0",
  red: "#ef4444",
  redLight: "#fee2e2",
  green: "#10b981",
  greenLight: "#d1fae5",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
};

// ─── Animation Components ───────────────────────────────────────────────────

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
  const sl = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(op, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sl, {
          toValue: 0,
          duration: 450,
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

const AnimatedProgressBar = ({
  percent,
  color,
  delay = 100,
}: {
  percent: number;
  color: string;
  delay?: number;
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: percent,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [percent]);

  return (
    <View style={S.barTrack}>
      <Animated.View
        style={[
          S.barFill,
          {
            backgroundColor: color,
            width: anim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
};

// ─── Interfaces & Structs ───────────────────────────────────────────────────

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  tasks: number;
  done: number;
  rating: number;
  status: "active" | "break" | "off-duty";
  phone: string;
  shift: string;
  avatar: string;
  efficiency: number;
}

const STATUS_CONFIG: Record<
  StaffMember["status"],
  { label: string; color: string; bg: string }
> = {
  active: { label: "On Duty", color: C.green, bg: C.greenLight },
  break: { label: "On Break", color: C.amber, bg: C.amberLight },
  "off-duty": { label: "Off Duty", color: C.textSec, bg: "#f1f5f9" },
};

const FILTERS = ["All Staff", "Housekeeping", "Engineering", "Management"];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "1",
    name: "Maria Santos",
    role: "Senior HK",
    department: "Housekeeping",
    tasks: 12,
    done: 11,
    rating: 4.6,
    status: "active",
    phone: "+91 98765 43211",
    shift: "Morning (07:00 AM - 03:30 PM)",
    avatar:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&q=80",
    efficiency: 84,
  },
  {
    id: "2",
    name: "Anna Petrov",
    role: "HK Attendant",
    department: "Housekeeping",
    tasks: 8,
    done: 8,
    rating: 4.8,
    status: "break",
    phone: "+91 98765 43212",
    shift: "General (09:00 AM - 05:30 PM)",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
    efficiency: 92,
  },
  {
    id: "3",
    name: "Maria Santos",
    role: "Senior HK",
    department: "Housekeeping",
    tasks: 12,
    done: 11,
    rating: 4.9,
    status: "active",
    phone: "+91 98765 43210",
    shift: "Morning (07:00 AM - 03:30 PM)",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80",
    efficiency: 96,
  },
  {
    id: "4",
    name: "James Kimani",
    role: "HK Attendant",
    department: "Housekeeping",
    tasks: 9,
    done: 6,
    rating: 4.6,
    status: "active",
    phone: "+91 98765 43211",
    shift: "Morning (07:00 AM - 03:30 PM)",
    avatar:
      "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
    efficiency: 84,
  },
  {
    id: "5",
    name: "Anna Petrov",
    role: "HK Attendant",
    department: "Housekeeping",
    tasks: 8,
    done: 8,
    rating: 4.8,
    status: "break",
    phone: "+91 98765 43212",
    shift: "General (09:00 AM - 05:30 PM)",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
    efficiency: 92,
  },
  {
    id: "6",
    name: "John Doe",
    role: "HK Attendant",
    department: "Housekeeping",
    tasks: 10,
    done: 5,
    rating: 4.5,
    status: "active",
    phone: "+91 98765 43213",
    shift: "Evening (03:30 PM - 11:00 PM)",
    avatar:
      "https://img.magnific.com/free-photo/horizontal-portrait-smiling-happy-young-pleasant-looking-female-wears-denim-shirt-stylish-glasses-with-straight-blonde-hair-expresses-positiveness-poses_176420-13176.jpg?semt=ais_hybrid&w=740&q=80",
    efficiency: 75,
  },
];

export default function StaffManagementScreen() {
  // ✅ useWindowDimensions re-renders on orientation/resize changes
  const { width: SW } = useWindowDimensions();
  const isWide = SW > 900;
  const isMid = SW > 600;

  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Staff");
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formDept, setFormDept] = useState("Housekeeping");
  const [formPhone, setFormPhone] = useState("");
  const [formShift, setFormShift] = useState("");
  const [formTasks, setFormTasks] = useState("10");
  const [formDone, setFormDone] = useState("0");
  const [formStatus, setFormStatus] = useState<StaffMember["status"]>("active");

  const filteredStaff = staffList.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedFilter === "All Staff" || member.department === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormName("");
    setFormRole("");
    setFormDept("Housekeeping");
    setFormPhone("");
    setFormShift("Morning (07:00 AM - 03:30 PM)");
    setFormTasks("10");
    setFormDone("0");
    setFormStatus("active");
    setIsFormModalOpen(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormDept(member.department);
    setFormPhone(member.phone);
    setFormShift(member.shift);
    setFormTasks(String(member.tasks));
    setFormDone(String(member.done));
    setFormStatus(member.status);
    setIsFormModalOpen(true);
  };

  const handleSaveStaff = () => {
    if (!formName.trim() || !formRole.trim()) return;

    const parsedTasks = parseInt(formTasks, 10) || 0;
    const parsedDone = parseInt(formDone, 10) || 0;
    const computedEfficiency =
      parsedTasks > 0 ? Math.round((parsedDone / parsedTasks) * 100) : 100;

    if (editingMember) {
      setStaffList((prev) =>
        prev.map((item) =>
          item.id === editingMember.id
            ? {
                ...item,
                name: formName,
                role: formRole,
                department: formDept,
                phone: formPhone,
                shift: formShift,
                tasks: parsedTasks,
                done: parsedDone,
                status: formStatus,
                efficiency: Math.min(computedEfficiency, 100),
              }
            : item,
        ),
      );
    } else {
      const newStaff: StaffMember = {
        id: String(Date.now()),
        name: formName,
        role: formRole,
        department: formDept,
        tasks: parsedTasks,
        done: parsedDone,
        rating: 5.0,
        status: formStatus,
        phone: formPhone || "+91 98765 00000",
        shift: formShift || "General (09:00 AM - 05:30 PM)",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        efficiency: Math.min(computedEfficiency, 100),
      };
      setStaffList((prev) => [newStaff, ...prev]);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((item) => item.id !== id));
    if (expandedStaff === id) setExpandedStaff(null);
  };

  const totalStaffCount = staffList.length;
  const onDutyCount = staffList.filter((s) => s.status === "active").length;

  // ✅ Compute responsive values derived from live window width
  const padding = isWide ? 24 : 16;
  const heroTitleSize = isWide ? 26 : isMid ? 22 : 20;
  const heroSubSize = isWide ? 14 : 12;
  const cardColWidth = isWide ? "33.33%" : isMid ? "50%" : "100%";
  const modalWidth = isWide ? 550 : isMid ? Math.min(SW * 0.85, 480) : "100%";
  const heroFlex = isWide || isMid ? "row" : "column";
  const heroBtnAlign = isWide || isMid ? "flex-start" : "stretch";

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={S.screen}
        contentContainerStyle={[S.content, { padding, paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            S.heroMeta,
            {
              flexDirection: heroFlex as any,
              alignItems: heroFlex === "row" ? "center" : "stretch",
              gap: 12,
            },
          ]}
        >
          <View style={{ flex: heroFlex === "row" ? 1 : undefined }}>
            <Text style={[S.heroTitle, { fontSize: heroTitleSize }]}>
              Team Configuration Matrix
            </Text>
            <Text style={[S.heroSubtext, { fontSize: heroSubSize }]}>
              Provision architectural permissions, track operations, and resolve
              active personnel nodes.
            </Text>
          </View>
          <TouchableOpacity
            style={[
              S.addBtn,
              heroFlex === "column" && { alignSelf: "flex-start" },
            ]}
            onPress={openAddModal}
            activeOpacity={0.8}
          >
            <Plus size={16} color={C.white} />
            <Text style={S.addBtnText}>Onboard Employee</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Search and Filter Action Ribbon ─── */}
        <FadeInUp delay={100}>
          <View style={S.searchContainer}>
            <Search size={18} color={C.textTer} style={S.searchIcon} />
            <TextInput
              placeholder="Search team member name or operational role..."
              placeholderTextColor={C.textTer}
              value={search}
              onChangeText={setSearch}
              style={S.searchInput}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={S.filterRibbon}
          >
            {FILTERS.map((item, index) => {
              const isActive = selectedFilter === item;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedFilter(item)}
                  style={[S.filterChip, isActive && S.filterChipActive]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      S.filterChipText,
                      isActive && S.filterChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeInUp>

        {/* ─── Directory Grid ─── */}
        {/* ✅ flexWrap grid with dynamic per-card width */}
        <View style={S.directoryGrid}>
          {filteredStaff.map((member, index) => {
            const isCurrentExpanded = expandedStaff === member.id;
            const status = STATUS_CONFIG[member.status];
            const taskPct =
              member.tasks > 0
                ? Math.round((member.done / member.tasks) * 100)
                : 0;

            return (
              <FadeInUp
                key={member.id}
                delay={150 + index * 50}
                style={[S.gridFlexItem, { width: cardColWidth }]}
              >
                <View
                  style={[
                    S.staffCard,
                    isCurrentExpanded && S.staffCardExpanded,
                  ]}
                >
                  {/* Operations Toolbar */}
                  <View style={S.cardActionHeader}>
                    <TouchableOpacity
                      onPress={() => openEditModal(member)}
                      style={S.iconActionBtn}
                    >
                      <Edit2 size={13} color={C.textSec} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteStaff(member.id)}
                      style={[S.iconActionBtn, { borderColor: C.redLight }]}
                    >
                      <Trash2 size={13} color={C.red} />
                    </TouchableOpacity>
                  </View>

                  {/* Primary Overview */}
                  <View style={S.cardMainInfo}>
                    <Image
                      source={{ uri: member.avatar }}
                      style={S.avatarImage}
                    />

                    <View style={S.textMetaBlock}>
                      <View style={S.nameRow}>
                        <Text style={S.staffNameText} numberOfLines={1}>
                          {member.name}
                        </Text>
                        <View
                          style={[
                            S.statusBadge,
                            { backgroundColor: status.bg },
                          ]}
                        >
                          <Text style={[S.statusText, { color: status.color }]}>
                            {status.label}
                          </Text>
                        </View>
                      </View>

                      <Text style={S.roleText}>{member.role}</Text>

                      <View style={S.ratingRow}>
                        <Star size={12} color={C.amber} fill={C.amber} />
                        <Text style={S.ratingVal}>{member.rating}</Text>
                        <Text style={S.dotDivider}>·</Text>
                        <Briefcase size={12} color={C.textSec} />
                        <Text style={S.deptText}>{member.department}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Task Progress */}
                  <View style={S.metricSection}>
                    <View style={S.metricHeader}>
                      <Text style={S.metricLabel}>Daily Task Clearance</Text>
                      <Text style={S.metricValue}>
                        {member.done}/{member.tasks} Done ({taskPct}%)
                      </Text>
                    </View>
                    <AnimatedProgressBar
                      percent={taskPct}
                      color={
                        taskPct >= 85
                          ? C.green
                          : taskPct >= 50
                            ? C.amber
                            : C.red
                      }
                      delay={200}
                    />
                  </View>

                  {/* Expanded Details */}
                  {isCurrentExpanded && (
                    <View style={S.expandedContent}>
                      <View style={S.dividerLine} />

                      <View style={S.detailRow}>
                        <Clock size={14} color={C.textSec} />
                        <View style={S.detailTexts}>
                          <Text style={S.detailLabelTitle}>
                            Assigned Work Shift
                          </Text>
                          <Text style={S.detailValueText}>{member.shift}</Text>
                        </View>
                      </View>

                      <View style={S.detailRow}>
                        <Phone size={14} color={C.textSec} />
                        <View style={S.detailTexts}>
                          <Text style={S.detailLabelTitle}>
                            Contact Mobile Number
                          </Text>
                          <Text style={S.detailValueText}>{member.phone}</Text>
                        </View>
                      </View>

                      <View style={S.detailRow}>
                        <Zap size={14} color={C.textSec} />
                        <View style={S.detailTexts}>
                          <Text style={S.detailLabelTitle}>
                            Calculated Operating Efficiency
                          </Text>
                          <Text style={S.detailValueText}>
                            {member.efficiency}% Average Standard Compliance
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Expand Toggle */}
                  <TouchableOpacity
                    style={S.expandToggleButton}
                    onPress={() =>
                      setExpandedStaff(isCurrentExpanded ? null : member.id)
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={S.expandActionText}>
                      {isCurrentExpanded
                        ? "Hide Shift Details"
                        : "View Operational Breakdown"}
                    </Text>
                    <ChevronRight
                      size={14}
                      color={C.primary}
                      style={{
                        transform: [
                          { rotate: isCurrentExpanded ? "270deg" : "0deg" },
                        ],
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </FadeInUp>
            );
          })}
        </View>

        {/* ─── Empty State ─── */}
        {filteredStaff.length === 0 && (
          <FadeInUp delay={100}>
            <View style={S.emptyBox}>
              <AlertTriangle size={32} color={C.textTer} />
              <Text style={S.emptyTitle}>No Team Members Found</Text>
              <Text style={S.emptySubtitle}>
                We couldn't match "{search}" within category {selectedFilter}.
                Verify parameter settings.
              </Text>
            </View>
          </FadeInUp>
        )}
      </ScrollView>

      {/* ─── Modal ─── */}
      <Modal
        visible={isFormModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFormModalOpen(false)}
      >
        <View style={S.modalOverlay}>
          {/* ✅ Modal width adapts to live SW */}
          <View style={[S.modalSurface, { width: modalWidth as any }]}>
            <View style={S.modalHeader}>
              <Text style={[S.modalTitle, { fontSize: isWide ? 18 : 16 }]}>
                {editingMember
                  ? "Modify Employee Context"
                  : "Onboard New Employee Node"}
              </Text>
              <TouchableOpacity
                onPress={() => setIsFormModalOpen(false)}
                style={S.closeModalBtn}
              >
                <X size={20} color={C.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={S.modalFormScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={S.fieldLabel}>Employee Name *</Text>
              <TextInput
                style={S.formInput}
                value={formName}
                onChangeText={setFormName}
                placeholder="E.g., Shanmukhi"
                placeholderTextColor={C.textTer}
              />

              <Text style={S.fieldLabel}>Designation / Role *</Text>
              <TextInput
                style={S.formInput}
                value={formRole}
                onChangeText={setFormRole}
                placeholder="E.g., Full-Stack Engineer"
                placeholderTextColor={C.textTer}
              />

              <Text style={S.fieldLabel}>Department Assignment</Text>
              <View style={S.formPillRow}>
                {["Housekeeping", "Engineering", "Management"].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      S.formSelectPill,
                      formDept === d && S.formSelectPillActive,
                    ]}
                    onPress={() => formDept !== d && setFormDept(d)}
                  >
                    <Text
                      style={[
                        S.formPillText,
                        formDept === d && S.formPillTextActive,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={S.fieldLabel}>Deployment State</Text>
              <View style={S.formPillRow}>
                {(["active", "break", "off-duty"] as const).map((st) => (
                  <TouchableOpacity
                    key={st}
                    style={[
                      S.formSelectPill,
                      formStatus === st && S.formSelectPillActive,
                    ]}
                    onPress={() => setFormStatus(st)}
                  >
                    <Text
                      style={[
                        S.formPillText,
                        formStatus === st && S.formPillTextActive,
                      ]}
                    >
                      {STATUS_CONFIG[st].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={S.formSplitRow}>
                <View style={{ flex: 1 }}>
                  <Text style={S.fieldLabel}>Assigned Tasks</Text>
                  <TextInput
                    style={S.formInput}
                    value={formTasks}
                    onChangeText={setFormTasks}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={S.fieldLabel}>Completed Tasks</Text>
                  <TextInput
                    style={S.formInput}
                    value={formDone}
                    onChangeText={setFormDone}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={S.fieldLabel}>Contact Mobile Number</Text>
              <TextInput
                style={S.formInput}
                value={formPhone}
                onChangeText={setFormPhone}
                placeholder="+91 98765 43210"
                placeholderTextColor={C.textTer}
                keyboardType="phone-pad"
              />

              <Text style={S.fieldLabel}>Shift Timing Parameters</Text>
              <TextInput
                style={S.formInput}
                value={formShift}
                onChangeText={setFormShift}
                placeholder="Morning (07:00 AM - 03:30 PM)"
                placeholderTextColor={C.textTer}
              />
            </ScrollView>

            <View style={S.modalFooter}>
              <TouchableOpacity
                style={S.cancelBtn}
                onPress={() => setIsFormModalOpen(false)}
              >
                <Text style={S.cancelBtnText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={S.saveBtn} onPress={handleSaveStaff}>
                <Text style={S.saveBtnText}>Commit Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Static Stylesheet (layout-independent values only) ─────────────────────
// All values that depend on screen width are applied inline above.

interface StylesheetInterface {
  screen: ViewStyle;
  content: ViewStyle;
  headerHero: ViewStyle;
  heroMeta: ViewStyle;
  heroTitle: TextStyle;
  heroSubtext: TextStyle;
  addBtn: ViewStyle;
  addBtnText: TextStyle;
  summaryStrip: ViewStyle;
  summaryItem: ViewStyle;
  summaryText: TextStyle;
  boldText: TextStyle;
  verticalDivider: ViewStyle;
  searchContainer: ViewStyle;
  searchIcon: ViewStyle;
  searchInput: TextStyle;
  filterRibbon: ViewStyle;
  filterChip: ViewStyle;
  filterChipActive: ViewStyle;
  filterChipText: TextStyle;
  filterChipTextActive: TextStyle;
  directoryGrid: ViewStyle;
  gridFlexItem: ViewStyle;
  staffCard: ViewStyle;
  staffCardExpanded: ViewStyle;
  cardActionHeader: ViewStyle;
  iconActionBtn: ViewStyle;
  cardMainInfo: ViewStyle;
  avatarImage: ImageStyle;
  textMetaBlock: ViewStyle;
  nameRow: ViewStyle;
  staffNameText: TextStyle;
  statusBadge: ViewStyle;
  statusText: TextStyle;
  roleText: TextStyle;
  ratingRow: ViewStyle;
  ratingVal: TextStyle;
  dotDivider: TextStyle;
  deptText: TextStyle;
  metricSection: ViewStyle;
  metricHeader: ViewStyle;
  metricLabel: TextStyle;
  metricValue: TextStyle;
  barTrack: ViewStyle;
  barFill: ViewStyle;
  expandedContent: ViewStyle;
  dividerLine: ViewStyle;
  detailRow: ViewStyle;
  detailTexts: ViewStyle;
  detailLabelTitle: TextStyle;
  detailValueText: TextStyle;
  expandToggleButton: ViewStyle;
  expandActionText: TextStyle;
  emptyBox: ViewStyle;
  emptyTitle: TextStyle;
  emptySubtitle: TextStyle;
  modalOverlay: ViewStyle;
  modalSurface: ViewStyle;
  modalHeader: ViewStyle;
  modalTitle: TextStyle;
  closeModalBtn: ViewStyle;
  modalFormScroll: ViewStyle;
  fieldLabel: TextStyle;
  formInput: TextStyle;
  formPillRow: ViewStyle;
  formSelectPill: ViewStyle;
  formSelectPillActive: ViewStyle;
  formPillText: TextStyle;
  formPillTextActive: TextStyle;
  formSplitRow: ViewStyle;
  modalFooter: ViewStyle;
  cancelBtn: ViewStyle;
  cancelBtnText: TextStyle;
  saveBtn: ViewStyle;
  saveBtnText: TextStyle;
}

const S = StyleSheet.create<StylesheetInterface>({
  screen: { flex: 1, backgroundColor: C.bg },
  // padding applied inline
  content: { paddingBottom: 40 },
  headerHero: {
    backgroundColor: "#1e1135",
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
    fontSize: 22,
    fontWeight: "800",
    color: "#5C2E14",
  },
  heroSubtext: {
    color: "#5C2E14",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 6,
  },
  addBtnText: { color: C.white, fontSize: 13, fontWeight: "700" },
  summaryStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    gap: 16,
  },
  summaryItem: { flexDirection: "row", alignItems: "center" },
  summaryText: { color: C.white, fontSize: 13 },
  boldText: { fontWeight: "800" },
  verticalDivider: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 14,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  filterRibbon: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
    marginBottom: 18,
  },
  filterChip: {
    backgroundColor: C.white,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterChipText: { fontSize: 13, fontWeight: "600", color: C.textSec },
  filterChipTextActive: { color: C.white },
  // ✅ directoryGrid uses flexWrap; per-card width is applied inline
  directoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  // ✅ width applied inline so it reacts to live SW
  gridFlexItem: {
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  staffCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },
  staffCardExpanded: { borderColor: "#cbd5e1" },
  cardActionHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
    marginBottom: 6,
  },
  iconActionBtn: {
    borderWidth: 1,
    borderColor: C.border,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  cardMainInfo: { flexDirection: "row", gap: 12, alignItems: "center" },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#cbd5e1",
  },
  textMetaBlock: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  staffNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textPrimary,
    flex: 1,
  },
  statusBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: "700" },
  roleText: { fontSize: 12, color: C.textSec, fontWeight: "500", marginTop: 2 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  ratingVal: { fontSize: 11, fontWeight: "700", color: C.textPrimary },
  dotDivider: { color: C.textTer, fontSize: 11 },
  deptText: { fontSize: 11, color: C.textSec, fontWeight: "500" },
  metricSection: {
    marginTop: 14,
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 12,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  metricLabel: { fontSize: 11, fontWeight: "600", color: "#475569" },
  metricValue: { fontSize: 11, fontWeight: "700", color: "#334155" },
  barTrack: {
    height: 6,
    backgroundColor: C.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 10 },
  expandedContent: { marginTop: 12 },
  dividerLine: { height: 1, backgroundColor: "#f1f5f9", marginBottom: 12 },
  detailRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  detailTexts: { flex: 1 },
  detailLabelTitle: {
    fontSize: 10,
    color: C.textTer,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  detailValueText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
    marginTop: 1,
  },
  expandToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  expandActionText: { fontSize: 11, fontWeight: "700", color: C.primary },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: C.textTer,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
    maxWidth: 280,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  // width applied inline
  modalSurface: {
    backgroundColor: C.white,
    borderRadius: 24,
    maxHeight: "85%",
    overflow: "hidden",
    elevation: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  modalTitle: { fontWeight: "800", color: C.textPrimary },
  closeModalBtn: { padding: 4 },
  modalFormScroll: { padding: 20, gap: 14 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textSec,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: -4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 14,
    color: C.textPrimary,
    fontSize: 14,
    fontWeight: "500",
    backgroundColor: "#fcfcfd",
  },
  formPillRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 4 },
  formSelectPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  formSelectPillActive: {
    backgroundColor: C.primaryLight,
    borderColor: C.primary,
  },
  formPillText: { fontSize: 13, fontWeight: "600", color: C.textSec },
  formPillTextActive: { color: C.primary, fontWeight: "700" },
  formSplitRow: { flexDirection: "row", gap: 12 },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: "#f8fafc",
  },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  cancelBtnText: { color: C.textSec, fontSize: 14, fontWeight: "600" },
  saveBtn: {
    backgroundColor: C.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  saveBtnText: { color: C.white, fontSize: 14, fontWeight: "700" },
});
