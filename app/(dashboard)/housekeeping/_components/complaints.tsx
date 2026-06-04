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

const COMPLAINTS_DATA = [
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
  {
    id: "TKT-2026-35",
    title: "Broken armrests on 4 desks in Row G",
    category: "Furniture Damage",
    zoneKey: "classroom" as const,
    location: "Seminar Complex Room 402",
    status: "Resolved",
    reportedAt: "May 30, 2026",
    hasImage: true,
    urgency: "Low",
    author: "Ananya R. (Faculty)",
  },
  {
    id: "TKT-2026-31",
    title: "HVAC Unit short circuit throwing sparks",
    category: "Electrical Problems",
    zoneKey: "office" as const,
    location: "Main Admin Conference Hall",
    status: "Resolved",
    reportedAt: "May 28, 2026",
    hasImage: false,
    urgency: "Critical",
    author: "Kiran Kumar (Office Admin)",
  },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> =
  {
    Pending: { label: "Pending Review", color: C.red, bg: C.redLight },
    "In Progress": { label: "Dispatched", color: C.amber, bg: C.amberLight },
    Resolved: { label: "Resolved", color: C.green, bg: C.greenLight },
  };

export default function ComplaintManagementScreen() {
  const [activeTab, setActiveTab] = useState<"raise" | "track">("track"); // Default set to track to showcase lists
  const [scope, setScope] = useState<"mine" | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationText, setLocationText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredComplaints = COMPLAINTS_DATA.filter((item) => {
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
          <View>
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
                size={20}
                color={activeTab === "raise" ? C.white : C.textTer}
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
                size={20}
                color={activeTab === "track" ? C.white : C.textTer}
              />
              <Text
                style={[
                  S.toggleTabText,
                  activeTab === "track" && S.toggleTabTextActive,
                ]}
              >
                Track Status ({COMPLAINTS_DATA.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </FadeInUp>

      {/* ─── TAB VIEW A: SUBMIT A COMPLAINT ─── */}
      {activeTab === "raise" && (
        <View>
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
                    onPress={() => setSelectedCategory(cat.label)}
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
                  Specific Location / Unit Marker
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
                    onChangeText={setLocationText}
                    style={S.textInputControl}
                  />
                </View>
              </View>

              <View style={S.inputGroup}>
                <Text style={S.fieldLabel}>Detailed Issue Breakdown</Text>
                <TextInput
                  placeholder="Provide precise details describing the physical fault..."
                  placeholderTextColor={C.textTer}
                  multiline
                  numberOfLines={4}
                  value={descriptionText}
                  onChangeText={setDescriptionText}
                  style={[S.textInputControl, S.multilineInputStyle]}
                />
              </View>
            </View>
          </FadeInUp>

          <FadeInUp delay={220}>
            <View style={S.sectionLabelHeader}>
              <View style={S.accentIndicatorDot} />
              <Text style={S.sectionLabelText}>3. EVIDENCE ATTACHMENT</Text>
            </View>

            <TouchableOpacity style={S.photoUploaderBox} activeOpacity={0.75}>
              <View style={S.cloudRingContainer}>
                <UploadCloud size={24} color={C.indigo} />
              </View>
              <Text style={S.uploadHeadlineText}>
                Upload Fault Proof Photos
              </Text>
              <Text style={S.uploadSubText}>
                Capture directly via hardware camera or drop files (.JPEG, max
                8MB)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                S.dispatchSubmitButton,
                !selectedCategory && S.dispatchDisabledButton,
              ]}
              activeOpacity={0.9}
            >
              <Text style={S.dispatchButtonLabel}>Dispatch Urgent Request</Text>
            </TouchableOpacity>
          </FadeInUp>
        </View>
      )}

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

          {/* Ticket Ledger System */}
          <View style={S.ledgerGrid}>
            {filteredComplaints.map((ticket, index) => {
              const status = STATUS_MAP[ticket.status];
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

                      {/* Reporter Identifier Label */}
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

// Stylesheet Extensions
const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fbececb5",
  },
  content: {
    padding: isWide ? 24 : 16,
    paddingBottom: 40,
  },
  heroContainer: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,

    flexDirection: isWide ? "row" : "column",
    justifyContent: "space-between",
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
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 14,
    padding: 4,
    marginTop: 20,
    gap: 4,
  },
  toggleTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  toggleTabActive: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    width: "auto",
    color: C.white,
  },
  toggleTabText: {
    fontSize: 12,
    fontWeight: "600",

    // color: C.textTer,
  },
  toggleTabTextActive: {
    color: C.white,
  },
  scopeSelectorContainer: {
    flexDirection: "row",
    backgroundColor: C.border,
    padding: 4,
    borderRadius: 12,
    marginBottom: 14,
    gap: 4,
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
  scopeOptionButtonActive: {
    backgroundColor: "#dc2626",
  },
  scopeOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textSec,
  },
  scopeOptionTextActive: {
    color: C.white,
    fontWeight: "700",
  },
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
    width: isWide ? "10%" : isMid ? "20%" : "50%",
    paddingHorizontal: 4,
    marginBottom: 8,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 8,
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
    fontSize: 12,
    fontWeight: "600",
    color: C.textSec,
  },
  inputFormCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
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

    borderColor: "#fa0606",
    paddingHorizontal: 12,
    height: 42,
  },
  fieldInnerIcon: {
    marginRight: 6,
  },
  textInputControl: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 12,
    fontWeight: "500",
  },
  multilineInputStyle: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fa0606",
    shadowColor: "#fa0606",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,

    padding: 12,
    height: 90,
    textAlignVertical: "top",
  },
  photoUploaderBox: {
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.border,
    borderStyle: "dashed",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  cloudRingContainer: {
    width: 46,
    height: 46,
    borderRadius: 100,
    backgroundColor: C.indigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  uploadHeadlineText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
  },
  uploadSubText: {
    fontSize: 11,
    color: C.textTer,
    textAlign: "center",
    marginTop: 4,
  },
  dispatchSubmitButton: {
    backgroundColor: C.indigo,
    borderRadius: 14,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  dispatchDisabledButton: {
    backgroundColor: C.textTer,
    opacity: 0.5,
  },
  dispatchButtonLabel: {
    color: C.white,
    fontSize: 13,
    fontWeight: "700",
  },
  searchFilterRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  searchContainer: {
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
  searchIcon: {
    marginRight: 6,
  },
  searchInputField: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 12,
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
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
  },
  statusPillItemActive: {
    backgroundColor: C.indigo,
    borderColor: C.indigo,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: C.textSec,
  },
  statusPillTextActive: {
    color: C.white,
  },
  ledgerGrid: {
    gap: 10,
  },
  ticketItemCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
  },
  ticketHeaderLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  identityGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDotTag: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  tokenIdString: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textPrimary,
  },
  bulletSpace: {
    color: C.textTer,
    marginHorizontal: 4,
  },
  categoryBadgeLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  stateBadgeContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  stateBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  ticketMainTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 8,
  },
  ticketLocationFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  locLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  locValueString: {
    fontSize: 12,
    color: C.textSec,
    fontWeight: "500",
  },
  cardBoundarySeparator: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 10,
  },
  metaParametersLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  paramItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  urgencyIndicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 100,
  },
  paramValueText: {
    fontSize: 11,
    color: C.textSec,
    fontWeight: "500",
  },
  imagePresencePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: C.indigoLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  presenceText: {
    fontSize: 9,
    fontWeight: "700",
    color: C.purple,
  },
  authorBadge: {
    backgroundColor: C.border,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginLeft: "auto",
  },
  authorBadgeMine: {
    backgroundColor: C.greenLight,
  },
  authorBadgeText: {
    fontSize: 10,
    color: C.textSec,
    fontWeight: "600",
  },
  authorBadgeTextMine: {
    color: C.green,
    fontWeight: "700",
  },
  emptyStateBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
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
