import * as ImagePicker from "expo-image-picker";
import {
  AlertCircle,
  Camera,
  Clock,
  FileText,
  FlaskConicalIcon,
  Globe,
  LampDeskIcon,
  Layers,
  MapPin,
  Plus,
  Search,
  Sparkles,
  UploadCloud,
  User,
  Wrench,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
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
  indigo: "#dc2626",
  indigoLight: "#ffeeee",
  green: "#10b981",
  greenLight: "#d1fae5",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  red: "#ef4444",
  redLight: "#fee2e2",
  sky: "#0ea5e9",
  purple: "#dc2626",
  border: "#ffffff",

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

const CATEGORIES = [
  { label: "Washroom Issues", zone: "washroom", icon: Wrench },
  { label: "Water Leakage", zone: "washroom", icon: AlertCircle },
  { label: "Electrical Problems", zone: "office", icon: LampDeskIcon },
  { label: "Furniture Damage", zone: "classroom", icon: Layers },
  { label: "Classroom Cleaning", zone: "classroom", icon: Sparkles },
  { label: "Campus Cleanliness", zone: "playground", icon: Sparkles },
  { label: "Equipment Damage", zone: "laboratory", icon: FlaskConicalIcon },
];

const INITIAL_COMPLAINTS = [
  {
    id: "TKT-2026-44",
    title: "Flush valve failure & leaking pipe",
    category: "Washroom Issues",
    zoneKey: "washroom" as const,
    location: "Block B, 2nd Floor West Wing",
    status: "Pending",
    reportedAt: "Today, 02:15 PM",
    hasImage: true,
    urgency: "High",
    author: "Me",
  },
  {
    id: "TKT-2026-41",
    title: "Water clogging due to plastic leaves blocked inside line",
    category: "Water Leakage",
    zoneKey: "washroom" as const,
    location: "External Lawn Drainage Network",
    status: "Pending",
    reportedAt: "Today, 11:45 AM",
    hasImage: false,
    urgency: "Medium",
    author: "Rohan V. (Housekeeping)",
  },
  {
    id: "TKT-2026-39",
    title: "Projector mounting bracket completely loose",
    category: "Equipment Damage",
    zoneKey: "laboratory" as const,
    location: "Advanced Physics Lab 3",
    status: "In Progress",
    reportedAt: "Yesterday, 11:00 AM",
    hasImage: true,
    urgency: "Medium",
    author: "Me",
  },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> =
  {
    Pending: { label: "Pending Review", color: C.red, bg: C.redLight },
    "In Progress": { label: "Dispatched", color: C.amber, bg: C.amberLight },
    Resolved: { label: "Resolved", color: C.green, bg: C.greenLight },
  };

export default function ComplaintManagementScreen() {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [activeTab, setActiveTab] = useState<"raise" | "track">("track");
  const [scope, setScope] = useState<"mine" | "all">("all");

  // Form Field Tracks State
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationText, setLocationText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Search & Filter state configurations
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Inline Validation Banner System State
  const [formValidationError, setFormValidationError] = useState<string | null>(
    null,
  );

  // Media Library Integration Picker Logic Handler
  const handleImagePick = async () => {
    if (formValidationError) setFormValidationError(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setFormValidationError(
        "Permissions Error: Media access rights are required to attach evidence.",
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      setSelectedImage(pickerResult.assets[0].uri);
    }
  };

  // Submission Pipeline & Form Validation Layer
  const handleFormSubmit = () => {
    // 1. Mandatory Field Group Validations
    if (!selectedCategory) {
      setFormValidationError(
        "Validation Missing: A specific fault category classification is required.",
      );
      return;
    }
    if (!locationText.trim()) {
      setFormValidationError(
        "Validation Missing: Unit marker placement description location cannot be empty.",
      );
      return;
    }
    if (!descriptionText.trim() || descriptionText.trim().length < 10) {
      setFormValidationError(
        "Validation Missing: Detailed issue breakdown summary must contain at least 10 characters.",
      );
      return;
    }
    if (!selectedImage) {
      setFormValidationError(
        "Validation Missing: Fault visual verification proof image attachment is required.",
      );
      return;
    }

    // Clear validation error if all parameters match schema checklist rule
    setFormValidationError(null);

    const matchCategoryConfig = CATEGORIES.find(
      (cat) => cat.label === selectedCategory,
    );
    const assignedTicketId = `TKT-2026-${Math.floor(50 + Math.random() * 900)}`;

    const generatedTicketObject = {
      id: assignedTicketId,
      title: descriptionText.trim(),
      category: selectedCategory,
      zoneKey: (matchCategoryConfig?.zone || "classroom") as any,
      location: locationText.trim(),
      status: "Pending",
      reportedAt: "Just Now",
      hasImage: true,
      urgency: "Medium",
      author: "Me",
    };

    // Inject object into working memory array
    setComplaints([generatedTicketObject, ...complaints]);

    // Reset workflow fields parameters
    setSelectedCategory("");
    setLocationText("");
    setDescriptionText("");
    setSelectedImage(null);

    // Swap to operational list tracking framework
    setActiveTab("track");
  };

  const filteredComplaints = complaints.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    const matchesScope = scope === "all" || item.author === "Me";
    return matchesSearch && matchesStatus && matchesScope;
  });

  return (
    <ScrollView
      style={S.screen}
      contentContainerStyle={S.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Billboard Headliner */}
      <FadeInUp delay={0}>
        <View style={S.heroContainer}>
          <View style={{ flex: 1, paddingRight: isWide ? 16 : 0 }}>
            <Text style={S.heroTitle}>Support Hub</Text>
            <Text style={S.heroSubtitle}>
              Report facility issues, submit structural maintenance tickets, and
              audit workflows.
            </Text>
          </View>

          <View style={S.navigationToggleRow}>
            <TouchableOpacity
              style={[S.toggleTab, activeTab === "raise" && S.toggleTabActive]}
              onPress={() => setActiveTab("raise")}
            >
              <Plus
                size={18}
                color={activeTab === "raise" ? C.white : C.textSec}
              />
              <Text
                style={[
                  S.toggleTabText,
                  activeTab === "raise" && S.toggleTabTextActive,
                ]}
              >
                File Issue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.toggleTab, activeTab === "track" && S.toggleTabActive]}
              onPress={() => setActiveTab("track")}
            >
              <FileText
                size={18}
                color={activeTab === "track" ? C.white : C.textSec}
              />
              <Text
                style={[
                  S.toggleTabText,
                  activeTab === "track" && S.toggleTabTextActive,
                ]}
              >
                Track Status ({complaints.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </FadeInUp>

      {/* ─── TAB VIEW A: SUBMIT A COMPLAINT ─── */}
      {activeTab === "raise" && (
        <View>
          {/* Form Error Banner Notification engine overlay banner */}
          {formValidationError && (
            <FadeInUp delay={50}>
              <View style={S.validationErrorBannerLayout}>
                <AlertCircle
                  size={16}
                  color={C.red}
                  style={{ marginRight: 6 }}
                />
                <Text style={S.validationErrorBannerTextString}>
                  {formValidationError}
                </Text>
                <TouchableOpacity onPress={() => setFormValidationError(null)}>
                  <X size={14} color={C.textSec} />
                </TouchableOpacity>
              </View>
            </FadeInUp>
          )}

          <FadeInUp delay={100}>
            <View style={S.sectionLabelHeader}>
              <View style={S.accentIndicatorDot} />
              <Text style={S.sectionLabelText}>
                1. SELECT COMPLAINT CATEGORY
              </Text>
            </View>

            <View style={S.categoryMatrix}>
              {CATEGORIES.map((cat, i) => {
                const CatIcon = cat.icon;
                const isPicked = selectedCategory === cat.label;
                const activeColor = C[cat.zone as keyof typeof C] || C.indigo;

                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedCategory(cat.label);
                      if (formValidationError) setFormValidationError(null);
                    }}
                    style={[
                      S.categoryBox,
                      isPicked && {
                        borderColor: activeColor,
                        backgroundColor: C.white,
                      },
                    ]}
                  >
                    <View
                      style={[
                        S.iconFrame,
                        {
                          backgroundColor: isPicked ? activeColor + "15" : C.bg,
                        },
                      ]}
                    >
                      <CatIcon
                        size={18}
                        color={isPicked ? activeColor : C.textSec}
                      />
                    </View>
                    <Text
                      style={[
                        S.categoryBoxLabel,
                        isPicked && { color: C.textPrimary, fontWeight: "700" },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FadeInUp>

          <FadeInUp delay={160}>
            <View style={S.sectionLabelHeader}>
              <View style={S.accentIndicatorDot} />
              <Text style={S.sectionLabelText}>
                2. DETAILS & CONTEXTUAL PLACEMENT
              </Text>
            </View>

            <View style={S.inputFormCard}>
              <View style={S.inputGroup}>
                <Text style={S.fieldLabel}>
                  Specific Location / Unit Marker *
                </Text>
                <View style={S.inputFieldWrapper}>
                  <MapPin
                    size={16}
                    color={C.textTer}
                    style={S.fieldInnerIcon}
                  />
                  <TextInput
                    placeholder="e.g., Room 302, Washroom Complex B, Floor 1"
                    placeholderTextColor={C.textTer}
                    value={locationText}
                    onChangeText={(val) => {
                      setLocationText(val);
                      if (formValidationError) setFormValidationError(null);
                    }}
                    style={S.textInputControl}
                  />
                </View>
              </View>

              <View style={S.inputGroup}>
                <Text style={S.fieldLabel}>Detailed Issue Breakdown *</Text>
                <TextInput
                  placeholder="Provide precise details describing the physical fault (min 10 characters)..."
                  placeholderTextColor={C.textTer}
                  multiline
                  numberOfLines={4}
                  value={descriptionText}
                  onChangeText={(val) => {
                    setDescriptionText(val);
                    if (formValidationError) setFormValidationError(null);
                  }}
                  style={[S.textInputControl, S.multilineInputStyle]}
                />
              </View>
            </View>
          </FadeInUp>

          <FadeInUp delay={220}>
            <View style={S.sectionLabelHeader}>
              <View style={S.accentIndicatorDot} />
              <Text style={S.sectionLabelText}>3. EVIDENCE ATTACHMENT *</Text>
            </View>

            {/* Photo Uploader Selector Area */}
            <TouchableOpacity
              style={S.photoUploaderBox}
              activeOpacity={0.75}
              onPress={handleImagePick}
            >
              {selectedImage ? (
                <View style={S.imageWrapperPreviewBox}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={S.previewImageStyle}
                  />
                  <View style={S.imageReplaceOverlyBadge}>
                    <Camera
                      size={12}
                      color={C.white}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={S.imageReplaceText}>Change Photo</Text>
                  </View>
                </View>
              ) : (
                <View style={{ alignItems: "center" }}>
                  <View style={S.cloudRingContainer}>
                    <UploadCloud size={24} color={C.indigo} />
                  </View>
                  <Text style={S.uploadHeadlineText}>
                    Upload Fault Proof Photos
                  </Text>
                  <Text style={S.uploadSubText}>
                    Click to access device media storage reference photo library
                    files
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                S.dispatchSubmitButton,
                (!selectedCategory ||
                  !locationText.trim() ||
                  !descriptionText.trim() ||
                  !selectedImage) &&
                  S.dispatchDisabledButton,
              ]}
              activeOpacity={0.9}
              onPress={handleFormSubmit}
            >
              <Text style={S.dispatchButtonLabel}>Dispatch Urgent Request</Text>
            </TouchableOpacity>
          </FadeInUp>
        </View>
      )}

      {/* ─── TAB VIEW B: TRACK STATUS LIST ─── */}
      {activeTab === "track" && (
        <View>
          <FadeInUp delay={100}>
            <View style={S.searchFilterRow}>
              <View style={S.searchContainer}>
                <Search size={16} color={C.textTer} style={S.searchIcon} />
                <TextInput
                  placeholder="Search by token ID or keyword..."
                  placeholderTextColor={C.textTer}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={S.searchInputField}
                />
              </View>
            </View>
            <View style={S.scopeSelectorContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  S.scopeOptionButton,
                  scope === "all" && S.scopeOptionButtonActive,
                ]}
                onPress={() => setScope("all")}
              >
                <Globe
                  size={14}
                  color={scope === "all" ? C.white : C.textSec}
                />
                <Text
                  style={[
                    S.scopeOptionText,
                    scope === "all" && S.scopeOptionTextActive,
                  ]}
                >
                  All Campus Reports
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  S.scopeOptionButton,
                  scope === "mine" && S.scopeOptionButtonActive,
                ]}
                onPress={() => setScope("mine")}
              >
                <User
                  size={14}
                  color={scope === "mine" ? C.white : C.textSec}
                />
                <Text
                  style={[
                    S.scopeOptionText,
                    scope === "mine" && S.scopeOptionTextActive,
                  ]}
                >
                  My Raised Issues
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={S.pillStripWrapper}
            >
              {["All", "Pending", "In Progress", "Resolved"].map((st, idx) => {
                const isSelected = statusFilter === st;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setStatusFilter(st)}
                    style={[
                      S.statusPillItem,
                      isSelected && S.statusPillItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        S.statusPillText,
                        isSelected && S.statusPillTextActive,
                      ]}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </FadeInUp>

          {/* Ticket Ledger Layout */}
          <View style={S.ledgerGrid}>
            {filteredComplaints.map((ticket, index) => {
              const status = STATUS_MAP[ticket.status] || STATUS_MAP["Pending"];
              const accentColor =
                C[ticket.zoneKey as keyof typeof C] || C.indigo;

              return (
                <FadeInUp key={ticket.id} delay={140 + index * 50}>
                  <View style={S.ticketItemCard}>
                    <View style={S.ticketHeaderLine}>
                      <View style={S.identityGroup}>
                        <View
                          style={[
                            S.categoryDotTag,
                            { backgroundColor: accentColor },
                          ]}
                        />
                        <Text style={S.tokenIdString}>{ticket.id}</Text>
                        <Text style={S.bulletSpace}>•</Text>
                        <Text
                          style={[S.categoryBadgeLabel, { color: accentColor }]}
                        >
                          {ticket.category}
                        </Text>
                      </View>

                      <View
                        style={[
                          S.stateBadgeContainer,
                          { backgroundColor: status.bg },
                        ]}
                      >
                        <Text
                          style={[S.stateBadgeText, { color: status.color }]}
                        >
                          {status.label}
                        </Text>
                      </View>
                    </View>

                    <Text style={S.ticketMainTitle}>{ticket.title}</Text>

                    <View style={S.ticketLocationFooter}>
                      <View style={S.locLine}>
                        <MapPin size={12} color={C.textSec} />
                        <Text style={S.locValueString} numberOfLines={1}>
                          {ticket.location}
                        </Text>
                      </View>
                    </View>

                    <View style={S.cardBoundarySeparator} />

                    <View style={S.metaParametersLine}>
                      <View style={S.paramItem}>
                        <Clock size={11} color={C.textTer} />
                        <Text style={S.paramValueText}>
                          {ticket.reportedAt}
                        </Text>
                      </View>

                      <View style={S.paramItem}>
                        <View
                          style={[
                            S.urgencyIndicatorDot,
                            {
                              backgroundColor:
                                ticket.urgency === "High" ||
                                ticket.urgency === "Critical"
                                  ? C.red
                                  : C.amber,
                            },
                          ]}
                        />
                        <Text style={S.paramValueText}>
                          {ticket.urgency} Priority
                        </Text>
                      </View>

                      {ticket.hasImage && (
                        <View style={S.imagePresencePill}>
                          <Camera size={10} color={C.purple} />
                          <Text style={S.presenceText}>Photo</Text>
                        </View>
                      )}

                      <View
                        style={[
                          S.authorBadge,
                          ticket.author === "Me" && S.authorBadgeMine,
                        ]}
                      >
                        <Text
                          style={[
                            S.authorBadgeText,
                            ticket.author === "Me" && S.authorBadgeTextMine,
                          ]}
                        >
                          By: {ticket.author}
                        </Text>
                      </View>
                    </View>
                  </View>
                </FadeInUp>
              );
            })}

            {filteredComplaints.length === 0 && (
              <FadeInUp delay={100}>
                <View style={S.emptyStateBox}>
                  <AlertCircle size={32} color={C.textTer} />
                  <Text style={S.emptyTitleString}>No Match Found</Text>
                  <Text style={S.emptySubtitleString}>
                    No active tickets currently correspond to your scope or
                    filter constraints.
                  </Text>
                </View>
              </FadeInUp>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbececb5" },
  content: { padding: isWide ? 24 : 16, paddingBottom: 40 },
  heroContainer: {
    padding: 4,
    marginBottom: 20,
    flexDirection: isWide ? "row" : "column",
    justifyContent: "space-between",
    alignItems: isWide ? "center" : "flex-start",
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
  navigationToggleRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 14,
    padding: 4,
    marginTop: isWide ? 0 : 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  toggleTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  toggleTabActive: { backgroundColor: "#dc2626" },
  toggleTabText: { fontSize: 12, fontWeight: "600", color: C.textSec },
  toggleTabTextActive: { color: C.white },
  scopeSelectorContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 4,
    borderRadius: 12,
    marginBottom: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  scopeOptionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scopeOptionButtonActive: { backgroundColor: "#dc2626" },
  scopeOptionText: { fontSize: 12, fontWeight: "600", color: C.textSec },
  scopeOptionTextActive: { color: C.white, fontWeight: "700" },
  sectionLabelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 12,
  },
  accentIndicatorDot: {
    width: 4,
    height: 12,
    borderRadius: 2,
    backgroundColor: C.indigo,
  },
  sectionLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textSec,
    letterSpacing: 0.5,
  },
  categoryMatrix: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 16,
  },
  categoryBox: {
    width: isWide ? "23%" : isMid ? "30%" : "47%",
    paddingHorizontal: 4,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 16,
    padding: 14,
    flexDirection: "column",
    alignItems: "center",
    margin: 4,
  },
  iconFrame: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryBoxLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: C.textSec,
    textAlign: "center",
  },
  inputFormCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eedbdb",
  },
  inputGroup: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textPrimary,
    marginBottom: 6,
  },
  inputFieldWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#eedbdb",
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: C.bg,
  },
  fieldInnerIcon: { marginRight: 6 },
  textInputControl: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
  multilineInputStyle: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eedbdb",
    backgroundColor: C.bg,
    padding: 12,
    height: 90,
    textAlignVertical: "top",
  },

  // Custom styled photo uploader framework block handles
  photoUploaderBox: {
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: "#eedbdb",
    borderStyle: "dashed",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    minHeight: 140,
    overflow: "hidden",
  },
  cloudRingContainer: {
    width: 46,
    height: 46,
    borderRadius: 100,
    backgroundColor: C.indigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  uploadHeadlineText: { fontSize: 13, fontWeight: "700", color: C.textPrimary },
  uploadSubText: {
    fontSize: 11,
    color: C.textTer,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 16,
  },
  imageWrapperPreviewBox: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  previewImageStyle: { width: "100%", height: "100%", resizeMode: "cover" },
  imageReplaceOverlyBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  imageReplaceText: { color: C.white, fontSize: 10, fontWeight: "700" },

  // Validation message box element layouts
  validationErrorBannerLayout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.redLight,
    borderWidth: 1,
    borderColor: C.red,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  validationErrorBannerTextString: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: C.red,
  },

  dispatchSubmitButton: {
    backgroundColor: C.indigo,
    borderRadius: 14,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  dispatchDisabledButton: { backgroundColor: C.textTer, opacity: 0.4 },
  dispatchButtonLabel: { color: C.white, fontSize: 14, fontWeight: "700" },
  searchFilterRow: { flexDirection: "row", marginBottom: 10 },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#eedbdb",
  },
  searchIcon: { marginRight: 6 },
  searchInputField: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
  pillStripWrapper: {
    flexDirection: "row",
    gap: 6,
    paddingBottom: 4,
    marginBottom: 14,
  },
  statusPillItem: {
    backgroundColor: C.white,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#eedbdb",
  },
  statusPillItemActive: { backgroundColor: C.indigo, borderColor: C.indigo },
  statusPillText: { fontSize: 11, fontWeight: "600", color: C.textSec },
  statusPillTextActive: { color: C.white },
  ledgerGrid: { gap: 10 },
  ticketItemCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eedbdb",
  },
  ticketHeaderLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  identityGroup: { flexDirection: "row", alignItems: "center" },
  categoryDotTag: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  tokenIdString: { fontSize: 11, fontWeight: "700", color: C.textPrimary },
  bulletSpace: { color: C.textTer, marginHorizontal: 4 },
  categoryBadgeLabel: { fontSize: 11, fontWeight: "600" },
  stateBadgeContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  stateBadgeText: { fontSize: 10, fontWeight: "700" },
  ticketMainTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 8,
  },
  ticketLocationFooter: { flexDirection: "row", alignItems: "center" },
  locLine: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  locValueString: { fontSize: 12, color: C.textSec, fontWeight: "500" },
  cardBoundarySeparator: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 10,
  },
  metaParametersLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  paramItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  urgencyIndicatorDot: { width: 5, height: 5, borderRadius: 100 },
  paramValueText: { fontSize: 11, color: C.textSec, fontWeight: "500" },
  imagePresencePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: C.indigoLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  presenceText: { fontSize: 9, fontWeight: "700", color: C.purple },
  authorBadge: {
    backgroundColor: C.bg,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginLeft: "auto",
  },
  authorBadgeMine: { backgroundColor: C.greenLight },
  authorBadgeText: { fontSize: 10, color: C.textSec, fontWeight: "600" },
  authorBadgeTextMine: { color: C.green, fontWeight: "700" },
  emptyStateBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: C.white,
    borderRadius: 20,
    marginTop: 8,
  },
  emptyTitleString: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textSec,
    marginTop: 8,
  },
  emptySubtitleString: {
    fontSize: 11,
    color: C.textTer,
    textAlign: "center",
    marginTop: 2,
  },
});
