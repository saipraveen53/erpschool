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
    phone: "9876543211",
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
    phone: "9876543212",
    shift: "General (09:00 AM - 05:30 PM)",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
    efficiency: 92,
  },
  {
    id: "3",
    name: "Liam O'Connor",
    role: "Maintenance Lead",
    department: "Engineering",
    tasks: 5,
    done: 4,
    rating: 4.2,
    status: "active",
    phone: "9876543213",
    shift: "Evening (03:00 PM - 11:30 PM)",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&q=80",
    efficiency: 80,
  },
  {
    id: "4",
    name: "Sophie Dubois",
    role: "General Manager",
    department: "Management",
    tasks: 3,
    done: 3,
    rating: 4.9,
    status: "off-duty",
    phone: "9876543214",
    shift: "Morning (08:00 AM - 04:30 PM)",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
    efficiency: 100,
  },
  {
    id: "5",
    name: "Carlos Ramirez",
    role: "HK Supervisor",
    department: "Housekeeping",
    tasks: 10,
    done: 5,
    rating: 4.5,
    status: "active",
    phone: "9876543215",
    shift: "General (09:00 AM - 05:30 PM)",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&q=80",
    efficiency: 90,
  },
  {
    id: "6",
    name: "Emily Chen",
    role: "Maintenance Technician",
    department: "Engineering",
    tasks: 6,
    done: 5,
    rating: 4.3,
    status: "break",
    phone: "9876543216",
    shift: "Evening (03:00 PM - 11:30 PM)",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80",
    efficiency: 85,
  },
];

export default function StaffManagementScreen() {
  const { width: SW } = useWindowDimensions();
  const isWide = SW > 900;
  const isMid = SW > 600;

  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Staff");
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formDept, setFormDept] = useState("Housekeeping");
  const [formPhone, setFormPhone] = useState("");
  const [formShift, setFormShift] = useState("");
  const [formTasks, setFormTasks] = useState("10");
  const [formDone, setFormDone] = useState("0");
  const [formStatus, setFormStatus] = useState<StaffMember["status"]>("active");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const filteredStaff = staffList.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedFilter === "All Staff" || member.department === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  const triggerSuccessBanner = (msg: string) => {
    showNotification("success", msg);
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormErrors({});
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
    setFormErrors({});
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formName.trim()) {
      errors.name = "Employee name is required";
    } else if (formName.trim().length < 3) {
      errors.name = "Minimum 3 characters required";
    }

    if (!formRole.trim()) {
      errors.role = "Role designation is required";
    }

    const cleanPhone = formPhone.replace(/\D/g, "");
    if (!formPhone.trim()) {
      errors.phone = "Phone number is required";
    } else if (cleanPhone.length !== 10) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!formShift.trim()) {
      errors.shift = "Shift description parameter is required";
    }

    const tasks = Number(formTasks);
    const done = Number(formDone);

    if (formTasks.trim() === "" || isNaN(tasks) || tasks < 0) {
      errors.tasks = "Enter valid task load";
    }

    if (formDone.trim() === "" || isNaN(done) || done < 0) {
      errors.done = "Enter valid metric values";
    }

    if (!isNaN(tasks) && !isNaN(done) && done > tasks) {
      errors.done = "Completed tasks cannot exceed total quota";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      showNotification("error", "Validation failed. Please correct fields.");
      return false;
    }

    return true;
  };

  const handleSaveStaff = () => {
    if (!validateForm()) return;

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
                name: formName.trim(),
                role: formRole.trim(),
                department: formDept,
                phone: formPhone.trim(),
                shift: formShift.trim(),
                tasks: parsedTasks,
                done: parsedDone,
                status: formStatus,
                efficiency: Math.min(computedEfficiency, 100),
              }
            : item,
        ),
      );
      triggerSuccessBanner(`Updated details for: ${formName.trim()}`);
    } else {
      const newStaff: StaffMember = {
        id: String(Date.now()),
        name: formName.trim(),
        role: formRole.trim(),
        department: formDept,
        tasks: parsedTasks,
        done: parsedDone,
        rating: 5.0,
        status: formStatus,
        phone: formPhone.trim(),
        shift: formShift.trim(),
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        efficiency: Math.min(computedEfficiency, 100),
      };
      setStaffList((prev) => [newStaff, ...prev]);
      triggerSuccessBanner(`Successfully onboarded: ${formName.trim()}`);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteStaff = (id: string) => {
    const targetMember = staffList.find((item) => item.id === id);
    setStaffList((prev) => prev.filter((item) => item.id !== id));
    if (expandedStaff === id) setExpandedStaff(null);
    if (targetMember) {
      triggerSuccessBanner(`Purged personnel profile: ${targetMember.name}`);
    }
  };

  const padding = isWide ? 24 : 16;
  const heroTitleSize = isWide ? 26 : isMid ? 22 : 20;
  const heroSubSize = isWide ? 14 : 12;
  const cardColWidth = isWide ? "33.33%" : isMid ? "50%" : "100%";
  const modalWidth = isWide ? 550 : isMid ? Math.min(SW * 0.85, 480) : "100%";

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {notification && (
        <View
          style={[
            S.toastBannerContainer,
            notification.type === "success" ? S.successToast : S.errorToast,
          ]}
        >
          <Text style={S.toastBannerText}>{notification.message}</Text>
        </View>
      )}

      <ScrollView
        style={S.screen}
        contentContainerStyle={[S.content, { padding, paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            S.heroMeta,
            {
              flexDirection: isWide || isMid ? "row" : "column",
              alignItems: isWide || isMid ? "center" : "stretch",
              gap: 12,
            },
          ]}
        >
          <View style={{ flex: isWide || isMid ? 1 : undefined }}>
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
              !(isWide || isMid) && { alignSelf: "flex-start" },
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

      {/* ─── Modal Form Configuration Panel ─── */}
      <Modal
        visible={isFormModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFormModalOpen(false)}
      >
        <View style={S.modalOverlay}>
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
              {/* Field: Name */}
              <Text style={S.fieldLabel}>Employee Name *</Text>
              <TextInput
                style={[S.formInput, formErrors.name ? S.formInputError : null]}
                value={formName}
                onChangeText={(text) => {
                  setFormName(text);
                  if (formErrors.name)
                    setFormErrors((p) => ({ ...p, name: "" }));
                }}
                placeholder="E.g., Maria Santos"
                placeholderTextColor={C.textTer}
              />
              {formErrors.name && (
                <Text style={S.errorTextHint}>{formErrors.name}</Text>
              )}

              {/* Field: Role */}
              <Text style={S.fieldLabel}>Designation / Role *</Text>
              <TextInput
                style={[S.formInput, formErrors.role ? S.formInputError : null]}
                value={formRole}
                onChangeText={(text) => {
                  setFormRole(text);
                  if (formErrors.role)
                    setFormErrors((p) => ({ ...p, role: "" }));
                }}
                placeholder="E.g., Senior HK"
                placeholderTextColor={C.textTer}
              />
              {formErrors.role && (
                <Text style={S.errorTextHint}>{formErrors.role}</Text>
              )}

              {/* Field: Department */}
              <Text style={S.fieldLabel}>Department Assignment</Text>
              <View style={S.formPillRow}>
                {["Housekeeping", "Engineering", "Management"].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      S.formSelectPill,
                      formDept === d && S.formSelectPillActive,
                    ]}
                    onPress={() => setFormDept(d)}
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

              {/* Field: Deployment State */}
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

              {/* Fields: Tasks Analytics Block */}
              <View style={S.formSplitRow}>
                <View style={{ flex: 1 }}>
                  <Text style={S.fieldLabel}>Assigned Tasks</Text>
                  <TextInput
                    style={[
                      S.formInput,
                      formErrors.tasks ? S.formInputError : null,
                    ]}
                    value={formTasks}
                    onChangeText={(text) => {
                      setFormTasks(text);
                      setFormErrors((p) => ({ ...p, tasks: "", done: "" }));
                    }}
                    keyboardType="numeric"
                  />
                  {formErrors.tasks && (
                    <Text style={S.errorTextHint}>{formErrors.tasks}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={S.fieldLabel}>Completed Tasks</Text>
                  <TextInput
                    style={[
                      S.formInput,
                      formErrors.done ? S.formInputError : null,
                    ]}
                    value={formDone}
                    onChangeText={(text) => {
                      setFormDone(text);
                      setFormErrors((p) => ({ ...p, done: "" }));
                    }}
                    keyboardType="numeric"
                  />
                  {formErrors.done && (
                    <Text style={S.errorTextHint}>{formErrors.done}</Text>
                  )}
                </View>
              </View>

              {/* Field: Phone */}
              <Text style={S.fieldLabel}>Contact Mobile Number *</Text>
              <TextInput
                style={[
                  S.formInput,
                  formErrors.phone ? S.formInputError : null,
                ]}
                value={formPhone}
                onChangeText={(text) => {
                  setFormPhone(text);
                  if (formErrors.phone)
                    setFormErrors((p) => ({ ...p, phone: "" }));
                }}
                placeholder="E.g., 9876543210"
                placeholderTextColor={C.textTer}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {formErrors.phone && (
                <Text style={S.errorTextHint}>{formErrors.phone}</Text>
              )}

              {/* Field: Shift */}
              <Text style={S.fieldLabel}>Shift Timing Parameters *</Text>
              <TextInput
                style={[
                  S.formInput,
                  formErrors.shift ? S.formInputError : null,
                ]}
                value={formShift}
                onChangeText={(text) => {
                  setFormShift(text);
                  if (formErrors.shift)
                    setFormErrors((p) => ({ ...p, shift: "" }));
                }}
                placeholder="Morning (07:00 AM - 03:30 PM)"
                placeholderTextColor={C.textTer}
              />
              {formErrors.shift && (
                <Text style={S.errorTextHint}>{formErrors.shift}</Text>
              )}
            </ScrollView>

            <View style={S.modalFooter}>
              <TouchableOpacity
                style={S.cancelBtn}
                onPress={() => setIsFormModalOpen(false)}
              >
                <Text style={S.cancelBtnText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={S.saveBtn} onPress={handleSaveStaff}>
                <Text style={S.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Stylesheet Interface & Definition ───────────────────────────────────────

interface StylesheetInterface {
  screen: ViewStyle;
  content: ViewStyle;
  heroMeta: ViewStyle;
  heroTitle: TextStyle;
  heroSubtext: TextStyle;
  addBtn: ViewStyle;
  addBtnText: TextStyle;
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
  formInputError: TextStyle;
  errorTextHint: TextStyle;
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
  toastBannerContainer: ViewStyle;
  toastBannerText: TextStyle;
  successToast: ViewStyle;
  errorToast: ViewStyle;
}

const S = StyleSheet.create<StylesheetInterface>({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 40 },
  heroMeta: {
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 20,
    marginVertical: 10,
  },
  heroTitle: {
    fontWeight: "800",
    color: "#5C2E14",
  },
  heroSubtext: {
    color: "#5C2E14",
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
  directoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
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
    borderRadius: 8,
    padding: 6,
  },
  cardMainInfo: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textMetaBlock: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  staffNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  roleText: {
    fontSize: 13,
    color: C.textSec,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textPrimary,
    marginLeft: 4,
  },
  dotDivider: {
    marginHorizontal: 6,
    color: C.textTer,
  },
  deptText: {
    fontSize: 12,
    color: C.textSec,
    marginLeft: 4,
  },
  metricSection: {
    marginTop: 14,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: C.textSec,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textPrimary,
  },
  barTrack: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 100,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 100,
  },
  expandedContent: {
    marginTop: 12,
  },
  dividerLine: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  detailTexts: {
    flex: 1,
  },
  detailLabelTitle: {
    fontSize: 11,
    color: C.textTer,
  },
  detailValueText: {
    fontSize: 13,
    color: C.textPrimary,
    fontWeight: "500",
    marginTop: 1,
  },
  expandToggleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  expandActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.primary,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: C.white,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: C.textSec,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalSurface: {
    backgroundColor: C.white,
    borderRadius: 24,
    maxHeight: "85%",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  modalTitle: {
    fontWeight: "800",
    color: C.textPrimary,
  },
  closeModalBtn: {
    padding: 4,
  },
  modalFormScroll: {
    padding: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textPrimary,
    marginBottom: 6,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: C.textPrimary,
    backgroundColor: "#f8fafc",
  },
  formInputError: {
    borderColor: C.red,
    backgroundColor: "#fef2f2",
  },
  errorTextHint: {
    fontSize: 12,
    color: C.red,
    marginTop: 4,
    fontWeight: "500",
  },
  formPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  formSelectPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  formSelectPillActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  formPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textSec,
  },
  formPillTextActive: {
    color: C.white,
  },
  formSplitRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textSec,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: C.primary,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.white,
  },
  toastBannerContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 9999,
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  toastBannerText: {
    color: C.white,
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  successToast: {
    backgroundColor: C.green,
  },
  errorToast: {
    backgroundColor: C.red,
  },
});
