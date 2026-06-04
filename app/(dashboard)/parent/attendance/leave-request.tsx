import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowRight,
  Calendar,
  Check,
  FileText,
  Paperclip,
  Plus,
  Search,
  Trash2,
  X
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const THEME = {
  primary: "#E35336",       // Burnt Sienna Main
  background: "#F5F5DC",    // Beige Tint Base
  secondary: "#F44460",     // Pastel Salmon Accent
  darkAccent: "#A0522D",    // Deep Sienna Brown
  white: "#FFFFFF",
  textDark: "#2C1A14",
  textMuted: "#7A6862",
  glassBg: "rgba(255, 255, 255, 0.78)",
};

const leaveMetrics = {
  totalTaken: 8,
  remaining: 12,
  pending: 1,
  approved: 6,
  rejected: 1,
  emergencyUsed: 2,
};

const leaveCategories = [
  "Sick Leave",
  "Casual Leave",
  "Emergency Leave",
  "Medical Leave",
  "Family Function Leave",
  "Sports/Event Leave",
  "Vacation Leave",
  "Exam Preparation Leave"
];

const mockLeaveHistory = [
  { id: "LV-904", appliedDate: "May 25, 2026", type: "Sick Leave", dates: "May 26 - May 27", days: 2, status: "Pending", color: "#D97706", reviewer: "Awaiting review" },
  { id: "LV-881", appliedDate: "Apr 12, 2026", type: "Medical Leave", dates: "Apr 13 - Apr 15", days: 3, status: "Approved", color: "#16A34A", reviewer: "Principal Nair" },
  { id: "LV-712", appliedDate: "Jan 18, 2026", type: "Casual Leave", dates: "Jan 19 - Jan 19", days: 1, status: "Rejected", color: "#F44460", reviewer: "Coordinator David" },
];

export default function LeaveManagementDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHistoryFilter, setActiveHistoryFilter] = useState("All");

  // Form Modal Popups Interaction Hooks Control States
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Form Inputs Management Controlled States
  const [selectedType, setSelectedType] = useState("Sick Leave");
  const [fromDate, setFromDate] = useState("2026-06-02");
  const [toDate, setToDate] = useState("2026-06-04");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [attachments, setAttachments] = useState<string[]>(["medical_certificate.pdf"]);

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  // Parallax & Background Floating 3D Vector Systems Animations
  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 16000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleFormSubmission = () => {
    setApplyModalVisible(false);
    // Dynamic delay to smooth overlay context transition
    setTimeout(() => {
      setSuccessModalVisible(true);
    }, 400);
  };

  const simulateAddAttachment = () => {
    setAttachments([...attachments, `supporting_doc_${attachments.length + 1}.png`]);
  };

  const removeAttachmentIndex = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Parallax layers computations transformations
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [40, 0, -80],
    extrapolate: "clamp",
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [-25, 0, 55],
    extrapolate: "clamp",
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Fluid Arcs Background Vectors Layer Canvas */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}>
          <Svg height="350" width={width + 100} viewBox={`0 0 ${width + 100} 350`}>
            <Path
              d={`M0 130 C ${width / 3} 70, ${(2 * width) / 3} 190, ${width + 100} 110 L ${width + 100} 0 L 0 0 Z`}
              fill="rgba(227, 83, 54, 0.05)"
            />
            <Path
              d={`M0 250 C ${width / 4} 310, ${(3 * width) / 4} 170, ${width + 100} 230 L ${width + 100} 0 L 0 0 Z`}
              fill="rgba(160, 82, 45, 0.04)"
            />
          </Svg>
        </Animated.View>
      </View>

      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} />
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }],
          { useNativeDriver: true }
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={isDesktop ? styles.desktopCenter : null}
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          
          {/* Top Page Header Frame Branding Block Layout */}
          <Animated.View style={[styles.dashboardHeaderCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeftCluster}>
              <Text style={styles.pageTitleHeading}>Campus Leave Manager Portal</Text>
              <Text style={styles.pageSubtitleMuted}>Request configuration entries logs tracking system</Text>
            </View>
            
            {/* 2. Primary Command Flow Trigger Action Request Trigger Button Button */}
            <TouchableOpacity 
              style={styles.primaryApplyLeaveActionButtonBtn} 
              onPress={() => setApplyModalVisible(true)}
              activeOpacity={0.85}
            >
              <Plus size={18} color={THEME.white} style={{ marginRight: 6 }} />
              <Text style={styles.applyLeaveBtnLabelText}>File New Leave Form</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 1. Leave Management Dashboard Core Metric Cards Row Stack Grid */}
          <Text style={styles.sectionHeadingTitle}>Institutional Leaves Telemetry Balances</Text>
          <View style={styles.metricsWrapperRowGrid}>
            <View style={[styles.metricCardItemBlock, isDesktop && styles.desktopMetricSixth]}>
              <Text style={styles.metricItemLabelText}>Leaves Filed</Text>
              <Text style={styles.metricItemBigNumber}>{leaveMetrics.totalTaken}</Text>
              <Text style={styles.metricItemFooterSub}>Total index log</Text>
            </View>

            <View style={[styles.metricCardItemBlock, isDesktop && styles.desktopMetricSixth, { backgroundColor: "#E7F9EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#16A34A" }]}>Approved Logs</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#16A34A" }]}>{leaveMetrics.approved}</Text>
              <Text style={styles.metricItemFooterSub}>Tutor confirmed</Text>
            </View>

            <View style={[styles.metricCardItemBlock, isDesktop && styles.desktopMetricSixth, { backgroundColor: "#FEF7EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#D97706" }]}>Pending Logs</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#D97706" }]}>{leaveMetrics.pending}</Text>
              <Text style={styles.metricItemFooterSub}>Awaiting action</Text>
            </View>

            <View style={[styles.metricCardItemBlock, isDesktop && styles.desktopMetricSixth, { backgroundColor: "#FDF0F1" }]}>
              <Text style={[styles.metricItemLabelText, { color: THEME.secondary }]}>Rejected Logs</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.secondary }]}>{leaveMetrics.rejected}</Text>
              <Text style={styles.metricItemFooterSub}>Deducted quota</Text>
            </View>

            <View style={[styles.metricCardItemBlock, isDesktop && styles.desktopMetricSixth]}>
              <Text style={styles.metricItemLabelText}>Remaining Quota</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.primary }]}>{leaveMetrics.remaining}</Text>
              <Text style={styles.metricItemFooterSub}>Available terms pool</Text>
            </View>

            <View style={[styles.metricCardItemBlock, isDesktop && styles.desktopMetricSixth]}>
              <Text style={styles.metricItemLabelText}>Emergency Leaves</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.darkAccent }]}>{leaveMetrics.emergencyUsed}</Text>
              <Text style={styles.metricItemFooterSub}>Force majeure used</Text>
            </View>
          </View>

          {/* 7. Leave History Section Filters Search Command Row Block layout panel */}
          <Text style={styles.sectionHeadingTitle}>6. Archive Ledger Leave History Logs Registry</Text>
          <View style={styles.historyFiltersLayoutSearchContainerBar}>
            <View style={styles.searchBarWrapperBackdropControl}>
              <Search size={16} color={THEME.textMuted} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInputControlField}
                placeholder="Search archive history leave records requests logs..."
                placeholderTextColor={THEME.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRowInnerScroll}>
              {["All", "Pending", "Approved", "Rejected"].map((filterItemLabel, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.historyFilterChipTab, activeHistoryFilter === filterItemLabel && styles.activeHistoryFilterChipTab]}
                  onPress={() => setActiveHistoryFilter(filterItemLabel)}
                >
                  <Text style={[styles.historyFilterChipTabText, activeHistoryFilter === filterItemLabel && styles.activeHistoryFilterChipTabText]}>
                    {filterItemLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Render Leave History Mapping Cards Block List */}
          <View style={styles.historyRecordsListStackWrapperContainer}>
            {mockLeaveHistory.map((leaveRecordUnit) => (
              <View key={leaveRecordUnit.id} style={styles.historyRecordUnitItemCard}>
                <View style={styles.recordLeftIdentityBox}>
                  <View style={styles.recordIconBoxBackdrop}>
                    <FileText size={20} color={THEME.darkAccent} />
                  </View>
                  <View style={styles.recordCoreTextsMetaBlock}>
                    <View style={styles.recordIdClusterRow}>
                      <Text style={styles.recordIdTextLabel}>{leaveRecordUnit.id}</Text>
                      <Text style={styles.recordMetaAppliedDateText}>Filed on {leaveRecordUnit.appliedDate}</Text>
                    </View>
                    <Text style={styles.recordLeaveTypeMainHeadingTitle}>{leaveRecordUnit.type}</Text>
                    <Text style={styles.recordDateRangeDurationSubtext}>Timeline Range: <Text style={{ fontWeight: "700", color: THEME.textDark }}>{leaveRecordUnit.dates}</Text> ({leaveRecordUnit.days} Days)</Text>
                  </View>
                </View>

                {/* Status Indicator & Approver Identity Data Mapping Group */}
                <View style={styles.recordRightStatusVerificationBlock}>
                  <View style={[styles.statusBadgeCapsuleLabel, { backgroundColor: leaveRecordUnit.color + "15" }]}>
                    <View style={[styles.statusDotMarkerDot, { backgroundColor: leaveRecordUnit.color }]} />
                    <Text style={[styles.statusLabelTextContentString, { color: leaveRecordUnit.color }]}>{leaveRecordUnit.status}</Text>
                  </View>
                  <Text style={styles.reviewerIdentityTagText}>Auditor: {leaveRecordUnit.reviewer}</Text>
                </View>
              </View>
            ))}
          </View>

        </View>
      </Animated.ScrollView>

      {/* 2. Comprehensive Interactive Leave Application Entry Form Modal View Panel Layout Overlay */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={applyModalVisible}
        onRequestClose={() => setApplyModalVisible(false)}
      >
        <View style={styles.formModalBlurOverlayPanelBackdropContainer}>
          <View style={[styles.formModalGlassContainerBody, isDesktop && styles.desktopFormModalWidthScalingUnit]}>
            
            <View style={styles.formModalHeaderTopBarLineRow}>
              <View style={styles.formModalTitleClusterGroup}>
                <FileText size={20} color={THEME.primary} />
                <Text style={styles.formModalHeaderMainHeadingTitleText}>2. Campus Leave Application Request Form</Text>
              </View>
              <TouchableOpacity onPress={() => setApplyModalVisible(false)} style={styles.closeFormCrossActionBtn}>
                <X size={20} color={THEME.textDark} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Form Body Internal Stack Container layout fields wrapper */}
            <ScrollView style={styles.formModalContentFieldsScrollableContainerWrapper} showsVerticalScrollIndicator={false}>
              
              {/* 3. Leave Types Selection Array Dropdown Mock Selector Group */}
              <Text style={styles.formInputSectionHeadingLabelText}>3. Select Leave Category Type Parameter</Text>
              <View style={styles.formHorizontalChipSelectorRowGrid}>
                {leaveCategories.map((categoryStringUnit, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.formInputCategorySelectionChipUnit, selectedType === categoryStringUnit && styles.activeFormCategorySelectionChipUnit]}
                    onPress={() => setSelectedType(categoryStringUnit)}
                  >
                    <Text style={[styles.formCategorySelectionChipLabelTextString, selectedType === categoryStringUnit && styles.activeFormCategorySelectionChipLabelTextString]}>
                      {categoryStringUnit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Time Horizon Selection Range Inputs (From-To Dates Mocks Inputs Setup) */}
              <View style={styles.formFieldsSplitDualInlineRowGroup}>
                <View style={styles.splitFieldHalfColumnItemUnitBlock}>
                  <Text style={styles.formInputSectionHeadingLabelText}>From Effective Date:</Text>
                  <View style={styles.mockInputFieldControlBackdropHolderBox}>
                    <Calendar size={16} color={THEME.textMuted} style={{ marginRight: 8 }} />
                    <TextInput style={styles.inputTextFieldElementControl} value={fromDate} onChangeText={setFromDate} />
                  </View>
                </View>
                <View style={styles.splitFieldHalfColumnItemUnitBlock}>
                  <Text style={styles.formInputSectionHeadingLabelText}>To Expiry Date:</Text>
                  <View style={styles.mockInputFieldControlBackdropHolderBox}>
                    <Calendar size={16} color={THEME.textMuted} style={{ marginRight: 8 }} />
                    <TextInput style={styles.inputTextFieldElementControl} value={toDate} onChangeText={setToDate} />
                  </View>
                </View>
              </View>

              {/* Half-Day Config & Emergency Force Majeure Override Option Selectors Switchers */}
              <View style={styles.formSwitchesOptionsRowGridWrapperInline}>
                <TouchableOpacity 
                  style={[styles.formSwitchCheckboxButtonUnit, isHalfDay && styles.activeFormSwitchCheckboxButtonUnit]}
                  onPress={() => setIsHalfDay(!isHalfDay)}
                >
                  <View style={[styles.checkboxBoxGraphicIndicator, isHalfDay && styles.activeCheckboxBoxGraphicIndicator]}>
                    {isHalfDay && <Check size={12} color={THEME.white} />}
                  </View>
                  <Text style={styles.checkboxLabelTextContentString}>Request Half-Day Sessions Factor Route</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.formSwitchCheckboxButtonUnit, isEmergency && styles.activeFormSwitchCheckboxButtonUnit]}
                  onPress={() => setIsEmergency(!isEmergency)}
                >
                  <View style={[styles.checkboxBoxGraphicIndicator, isEmergency && styles.activeCheckboxBoxGraphicIndicator, { borderColor: THEME.secondary }]}>
                    {isEmergency && <Check size={12} color={THEME.white} />}
                  </View>
                  <Text style={[styles.checkboxLabelTextContentString, isEmergency && { color: THEME.secondary, fontWeight: "700" }]}>
                    🚨 Mark Emergency Leave Override Flag
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Text Input Block Description Area field mapping rationale */}
              <Text style={styles.formInputSectionHeadingLabelText}>Reason for Leave Allocation Statement Rationale</Text>
              <TextInput
                style={styles.formTextAreaInputControlFieldElement}
                multiline
                numberOfLines={4}
                placeholder="Provide complete verification details statement explaining context rationale for absence..."
                placeholderTextColor={THEME.textMuted}
                value={leaveReason}
                onChangeText={setLeaveReason}
              />

              {/* 4. Medical Certificate Upload Document Drag & Drop File Previews Holder Framework UI */}
              <View style={styles.titleWithActionBtnRowLayout}>
                <Text style={styles.formInputSectionHeadingLabelText}>4. Attach Certificates Supporting Documents (PDF, JPG, PNG)</Text>
                <TouchableOpacity style={styles.addAttachmentMiniTriggerCallActionBtn} onPress={simulateAddAttachment}>
                  <Paperclip size={14} color={THEME.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.addAttachmentBtnLabelTextStringText}>Upload File</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.attachmentsPreviewsWrapperContainerGroupListStack}>
                {attachments.map((fileStringNameUnit, index) => (
                  <View key={index} style={styles.attachmentFilePreviewRowUnitCardItem}>
                    <View style={styles.attachmentFileLeftInfoCluster}>
                      <FileText size={16} color={THEME.primary} />
                      <Text style={styles.attachmentFileStringNameLabelTextText} numberOfLines={1}>{fileStringNameUnit}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeAttachmentIndex(index)} style={styles.deleteAttachmentActionTriggerBtn}>
                      <Trash2 size={14} color={THEME.secondary} />
                    </TouchableOpacity>
                  </View>
                ))}
                {attachments.length === 0 && (
                  <Text style={styles.emptyAttachmentsFallbackPlaceholderMutedText}>No files attached. Upload certificates if filing medical/sick routes.</Text>
                )}
              </View>

              {/* 7. Leave Approval Workflow Linear Diagram Representation Graphics Trace */}
              <Text style={styles.formInputSectionHeadingLabelText}>5. Target Leave Approval Lifecycle Workflow Process Nodes Track</Text>
              <View style={styles.workflowNodesTraceGraphicRowFlexBox}>
                <View style={[styles.workflowNodeUnitItemCell, { backgroundColor: THEME.primary }]}>
                  <Text style={styles.workflowNodeUnitLabelTextTextString}>Parent File</Text>
                </View>
                <ArrowRight size={14} color={THEME.textMuted} />
                <View style={styles.workflowNodeUnitItemCell}>
                  <Text style={styles.workflowNodeUnitLabelTextTextString}>Teacher Check</Text>
                </View>
                <ArrowRight size={14} color={THEME.textMuted} />
                <View style={styles.workflowNodeUnitItemCell}>
                  <Text style={styles.workflowNodeUnitLabelTextTextString}>Coord Oks</Text>
                </View>
                <ArrowRight size={14} color={THEME.textMuted} />
                <View style={styles.workflowNodeUnitItemCell}>
                  <Text style={styles.workflowNodeUnitLabelTextTextString}>Principal Sign</Text>
                </View>
              </View>

              {/* Final Submit Core Action Triggers Grid Block Button footer */}
              <View style={styles.formActionButtonsGridFooterRow}>
                <TouchableOpacity style={styles.formCancelActionDismissBtnUnit} onPress={() => setApplyModalVisible(false)}>
                  <Text style={styles.cancelActionBtnLabelTextString}>Cancel Form Entries</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formSubmitActionCommitBtnUnit} onPress={handleFormSubmission}>
                  <Text style={styles.submitActionBtnLabelTextString}>Submit Leave Request</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>

          </View>
        </View>
      </Modal>

      {/* Success Transaction Confirmation Acknowledgment Notification Pop-Up Overlay Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successAlertBlurOverlayPanelBackdropContainer}>
          <View style={styles.successAlertGlassContainerBodyBlockUnit}>
            <View style={styles.successIconOuterBackdropCircleScaleAnimationHolder}>
              <Check size={32} color={THEME.white} />
            </View>
            <Text style={styles.successAlertHeadingMainTitleTextString}>Leave Request Lodged Successfully!</Text>
            <Text style={styles.successAlertParagraphDescriptionBodyTextContentParagraph}>
              Your campus leave request application ledger entries code has been transmitted securely into the database framework. Class instructors and system coordinators have been notified via auto-sync.
            </Text>
            <TouchableOpacity 
              style={styles.successAlertDismissActionConfirmationBtnFullWidthBtn} 
              onPress={() => setSuccessModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.successAlertDismissBtnLabelTextTextString}>Acknowledge & Back to Portal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.background,
    position: "relative",
  },
  fluidBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: -20,
    right: 0,
    zIndex: -2,
    opacity: 0.85,
  },
  orb3DOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(227, 83, 54, 0.06)",
    top: 140,
    right: -40,
    zIndex: -1,
  },
  orb3DTwo: {
    position: "absolute",
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: "rgba(160, 82, 45, 0.04)",
    bottom: 80,
    left: -100,
    zIndex: -1,
  },
  desktopCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  mainWrapper: {
    width: "100%",
    paddingBottom: 40,
  },
  desktopWidth: {
    maxWidth: 1140,
    paddingHorizontal: 20,
  },
  dashboardHeaderCard: {
    backgroundColor: THEME.white,
    padding: 22,
    borderRadius: 26,
    marginHorizontal: 16,
    marginTop: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  headerLeftCluster: {
    flex: 1,
    minWidth: 260,
  },
  pageTitleHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  pageSubtitleMuted: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
  },
  primaryApplyLeaveActionButtonBtn: {
    backgroundColor: THEME.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  applyLeaveBtnLabelText: {
    color: THEME.white,
    fontSize: 14,
    fontWeight: "700",
  },
  sectionHeadingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.textDark,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 14,
  },
  metricsWrapperRowGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  metricCardItemBlock: {
    width: "100%",
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    marginHorizontal: 4,
    flex: 1,
    minWidth: 160,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  desktopMetricSixth: {
    width: "15%",
  },
  metricItemLabelText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  metricItemBigNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: THEME.textDark,
    marginTop: 4,
  },
  metricItemFooterSub: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 4,
  },
  historyFiltersLayoutSearchContainerBar: {
    marginHorizontal: 16,
    gap: 12,
  },
  searchBarWrapperBackdropControl: {
    backgroundColor: THEME.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 16,
    height: 46,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.08)",
  },
  searchInputControlField: {
    flex: 1,
    color: THEME.textDark,
    fontSize: 13,
    fontWeight: "500",
  },
  filterChipsRowInnerScroll: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
  },
  historyFilterChipTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: THEME.white,
  },
  activeHistoryFilterChipTab: {
    backgroundColor: THEME.primary,
  },
  historyFilterChipTabText: {
    color: THEME.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  activeHistoryFilterChipTabText: {
    color: THEME.white,
  },
  historyRecordsListStackWrapperContainer: {
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 12,
  },
  historyRecordUnitItemCard: {
    backgroundColor: THEME.white,
    padding: 18,
    borderRadius: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  recordLeftIdentityBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 260,
  },
  recordIconBoxBackdrop: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F3ECE7",
    justifyContent: "center",
    alignItems: "center",
  },
  recordCoreTextsMetaBlock: {
    marginLeft: 14,
    flex: 1,
  },
  recordIdClusterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordIdTextLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.darkAccent,
  },
  recordMetaAppliedDateText: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  recordLeaveTypeMainHeadingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.textDark,
    marginTop: 2,
  },
  recordDateRangeDurationSubtext: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 4,
  },
  recordRightStatusVerificationBlock: {
    alignItems: "flex-end",
    gap: 6,
  },
  statusBadgeCapsuleLabel: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDotMarkerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusLabelTextContentString: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  reviewerIdentityTagText: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: "500",
  },
  formModalBlurOverlayPanelBackdropContainer: {
    flex: 1,
    backgroundColor: "rgba(44, 26, 20, 0.5)",
    justifyContent: "flex-end",
  },
  formModalGlassContainerBody: {
    backgroundColor: THEME.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "90%",
    width: "100%",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 15,
  },
  desktopFormModalWidthScalingUnit: {
    alignSelf: "center",
    maxWidth: 720,
    borderRadius: 32,
    height: "85%",
    bottom: 20,
  },
  formModalHeaderTopBarLineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(160, 82, 45, 0.1)",
    paddingBottom: 16,
  },
  formModalTitleClusterGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  formModalHeaderMainHeadingTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.textDark,
  },
  closeFormCrossActionBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: THEME.white,
  },
  formModalContentFieldsScrollableContainerWrapper: {
    flex: 1,
    marginTop: 16,
  },
  formInputSectionHeadingLabelText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textDark,
    marginTop: 16,
    marginBottom: 10,
  },
  formHorizontalChipSelectorRowGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  formInputCategorySelectionChipUnit: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.06)",
  },
  activeFormCategorySelectionChipUnit: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  formCategorySelectionChipLabelTextString: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  activeFormCategorySelectionChipLabelTextString: {
    color: THEME.white,
  },
  formFieldsSplitDualInlineRowGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  splitFieldHalfColumnItemUnitBlock: {
    flex: 1,
  },
  mockInputFieldControlBackdropHolderBox: {
    backgroundColor: THEME.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.08)",
  },
  inputTextFieldElementControl: {
    flex: 1,
    color: THEME.textDark,
    fontSize: 13,
    fontWeight: "600",
  },
  formSwitchesOptionsRowGridWrapperInline: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 18,
  },
  formSwitchCheckboxButtonUnit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  checkboxBoxGraphicIndicator: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCheckboxBoxGraphicIndicator: {
    backgroundColor: THEME.primary,
  },
  checkboxLabelTextContentString: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.textDark,
  },
  formTextAreaInputControlFieldElement: {
    backgroundColor: THEME.white,
    borderRadius: 16,
    padding: 14,
    color: THEME.textDark,
    fontSize: 13,
    fontWeight: "500",
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.08)",
  },
  titleWithActionBtnRowLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addAttachmentMiniTriggerCallActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addAttachmentBtnLabelTextStringText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.primary,
  },
  attachmentsPreviewsWrapperContainerGroupListStack: {
    backgroundColor: THEME.white,
    borderRadius: 16,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)",
  },
  attachmentFilePreviewRowUnitCardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  attachmentFileLeftInfoCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  attachmentFileStringNameLabelTextText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.textDark,
  },
  deleteAttachmentActionTriggerBtn: {
    padding: 4,
  },
  emptyAttachmentsFallbackPlaceholderMutedText: {
    fontSize: 11,
    color: THEME.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 4,
  },
  workflowNodesTraceGraphicRowFlexBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.white,
    padding: 12,
    borderRadius: 16,
    marginTop: 4,
  },
  workflowNodeUnitItemCell: {
    backgroundColor: "#F3ECE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  workflowNodeUnitLabelTextTextString: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textDark,
  },
  formActionButtonsGridFooterRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  formCancelActionDismissBtnUnit: {
    flex: 1,
    backgroundColor: THEME.white,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.15)",
  },
  cancelActionBtnLabelTextString: {
    color: THEME.textMuted,
    fontWeight: "700",
    fontSize: 14,
  },
  formSubmitActionCommitBtnUnit: {
    flex: 1.5,
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  submitActionBtnLabelTextString: {
    color: THEME.white,
    fontWeight: "700",
    fontSize: 14,
  },
  successAlertBlurOverlayPanelBackdropContainer: {
    flex: 1,
    backgroundColor: "rgba(44, 26, 20, 0.52)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  successAlertGlassContainerBodyBlockUnit: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: THEME.white,
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  successIconOuterBackdropCircleScaleAnimationHolder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  successAlertHeadingMainTitleTextString: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.textDark,
    textAlign: "center",
  },
  successAlertParagraphDescriptionBodyTextContentParagraph: {
    fontSize: 13,
    color: THEME.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  successAlertDismissActionConfirmationBtnFullWidthBtn: {
    backgroundColor: THEME.textDark,
    paddingVertical: 12,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
  },
  successAlertDismissBtnLabelTextTextString: {
    color: THEME.white,
    fontWeight: "700",
    fontSize: 14,
  },
});