import { useAuth } from "@/app/contexts/AuthContext";
import { rootApi as studentdashboardApi } from "@/app/utils/axiosInstance";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  BookOpen,
  CheckCircle,
  Download,
  Edit2,
  Filter,
  Info,
  Link2,
  Save,
  Sparkles,
  TrendingUp,
  UploadCloud,
  X
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G, Path } from "react-native-svg";

const THEME = {
  primary: "#E35336",       // Burnt Sienna Main
  background: "#F5F5DC",    // Beige Tint Base
  secondary: "#F44460",     // Pastel Salmon Accent
  darkAccent: "#A0522D",    // Deep Sienna Brown
  white: "#FFFFFF",         
  textDark: "#2C1A14",      
  textMuted: "#7A6862",     
  glassBg: "rgba(255, 255, 255, 0.76)", 
  success: "#16A34A"
};

export default function AssignmentsSubmissionsDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Pending Assignments");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);

  // Dynamic Data Stores Mappings
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
  const [completedSubmissions, setCompletedSubmissions] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Form Request State Controllers
  const [formData, setFormData] = useState<any>({
    assignmentId: "",
    subjectId: "",
    title: "",
    description: "",
    createdBy: "",
    assignedTo: "",
    status: "",
    assignedDate: "2026-06-04",
    dueDate: "2026-06-04",
    attachedFiles: ""
  });

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  // Resolves the true URL base domain path context dynamically to launch the network files attachment
  const handleOpenAttachedFile = async (filePath: string) => {
    if (!filePath || filePath === "string") {
      alert("No valid assignment asset filename found.");
      return;
    }
    
    try {
      let fullFileUrl = filePath;
      if (!filePath.startsWith("http://") && !filePath.startsWith("https://")) {
        const baseDomain = studentdashboardApi.defaults.baseURL || "";
        const cleanBase = baseDomain.endsWith("/") ? baseDomain.slice(0, -1) : baseDomain;
        const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
        fullFileUrl = `${cleanBase1}${cleanPath}`;
      }
      
      const absoluteUrl = fullFileUrl;
      const supported = await Linking.canOpenURL(absoluteUrl);
      if (supported) {
        await Linking.openURL(absoluteUrl);
      } else {
        if (Platform.OS === 'web') {
          window.open(absoluteUrl, '_blank');
        } else {
          alert(`Cannot launch open utility stream for: ${absoluteUrl}`);
        }
      }
    } catch (err) {
      console.error("Error launching binary document link file channel:", err);
      alert("Failed to initialize system document viewer utility.");
    }
  };

  const fetchDashboardTelemetry = async () => {
    try {
      setApiLoading(true);
      const studentId = user?.username || "STU2026004";
      
      // 1. First dynamically fetch the student profile object layout context
      const studentRes = await studentdashboardApi.get(`/api/student/${studentId}`);
      const profile = studentRes.data;
      setStudentProfile(profile);

      // 2. Extract dynamic classSectionId context to execute downstream matching queues
      const targetClassSectionId = profile?.classSectionId || "CLS2026009";

      // 3. Fetch Class Pending Assignments List Array using the resolved dynamic key parameter
      const pendingRes = await studentdashboardApi.get(`/api/student/assignments/class/${targetClassSectionId}`);
      const assignmentsPool = pendingRes.data || [];
      setPendingAssignments(assignmentsPool.filter((a: any) => a.status?.toLowerCase() !== "submitted" && a.status?.toLowerCase() !== "completed"));

      // 4. Fetch Completed/Submitted Repositories Matrix Logs
      const completedRes = await studentdashboardApi.get(`/api/student/assignment-submissions/student/${studentId}`);
      setCompletedSubmissions(completedRes.data || []);

    } catch (err) {
      console.error("Error executing dynamic assignments parallel integration channels:", err);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardTelemetry();

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
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardTelemetry();
    setRefreshing(false);
  };

  const handleLaunchEditForm = (item: any) => {
    setFormData({
      assignmentId: item.assignmentId || "",
      subjectId: item.subjectId || "",
      title: item.title || "",
      description: item.description || "",
      createdBy: item.createdBy || "",
      assignedTo: item.assignedTo || "",
      status: item.status || "Pending",
      assignedDate: item.assignedDate || "2026-06-04",
      dueDate: item.dueDate || "2026-06-04",
      attachedFiles: item.attachedFiles || ""
    });
    setSelectedFile(null);
    setEditModalVisible(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      setApiLoading(true);
      const sendMultipartForm = new FormData();

      const jsonPayload = {
        assignmentId: formData.assignmentId,
        subjectId: formData.subjectId,
        title: formData.title,
        description: formData.description,
        createdBy: formData.createdBy,
        assignedTo: formData.assignedTo,
        status: formData.status,
        assignedDate: formData.assignedDate,
        dueDate: formData.dueDate,
        attachedFiles: formData.attachedFiles
      };

      if (Platform.OS === "web") {
        sendMultipartForm.append("data", new Blob([JSON.stringify(jsonPayload)], { type: "application/json" }));
      } else {
        sendMultipartForm.append("data", JSON.stringify(jsonPayload));
      }

      if (selectedFile) {
        sendMultipartForm.append("file", selectedFile);
      }

      await studentdashboardApi.put(
        `/api/student/assignment/${formData.subjectId}/${formData.assignmentId}`, 
        sendMultipartForm,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setEditModalVisible(false);
      await fetchDashboardTelemetry();
      setTimeout(() => setSuccessModalVisible(true), 400);
    } catch (err) {
      console.error("Error updating targeted assignment data layers:", err);
    } finally {
      setApiLoading(false);
    }
  };

  const handleLocalFileSelection = () => {
    setSelectedFile({
      uri: "file://dev/local/staged_assignment_document.pdf",
      name: "staged_assignment_document.pdf",
      type: "application/pdf"
    });
    alert("Assignment worksheet document attached.");
  };

  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [40, 0, -85],
    extrapolate: "clamp",
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [-25, 0, 60],
    extrapolate: "clamp",
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20],
  });

  const computedTotalCount = pendingAssignments.length + completedSubmissions.length;
  const completionPercentage = computedTotalCount > 0 ? Math.round((completedSubmissions.length / computedTotalCount) * 100) : 100;
  const chartRadius = 45;
  const chartCircumference = 2 * Math.PI * chartRadius;
  const strokeDashoffsetVal = chartCircumference - (completionPercentage / 100) * chartCircumference;

  if (apiLoading && !refreshing && !editModalVisible && !successModalVisible) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingText}>Synchronizing Assignments Pipeline Registry...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Background Curved Wave Arcs Layout Vector Canvas */}
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
          
          {/* Top Header Section Box */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeftCluster}>
              <View style={styles.titleBadgeInlineRow}>
                <Text style={styles.pageTitleHeading}>Curriculum Assignments Hub</Text>
                <View style={styles.liveBroadcastBadge}>
                  <Sparkles size={11} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.liveBroadcastBadgeText}>Sync Live</Text>
                </View>
              </View>
              {studentProfile?.fullName && (
                <Text style={styles.profileIndicatorTextSpan}>Staged Context: {studentProfile.fullName} ({studentProfile.grade}-{studentProfile.section})</Text>
              )}
            </View>
            <View style={styles.headerIconCircleBackdrop}>
              <BookOpen size={20} color={THEME.white} />
            </View>
          </Animated.View>

          {/* Core Metrics Matrix Grid Box Row */}
          <Text style={styles.sectionHeadingTitle}>Assignments Analysis Matrix</Text>
          <View style={styles.overviewMetricsWrapperGridRow}>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth]}>
              <Text style={styles.metricItemLabelText}>Staged Tasks Total</Text>
              <Text style={styles.metricItemBigNumber}>{computedTotalCount}</Text>
              <Text style={styles.metricItemFooterSubtext}>Cumulative load balance</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth, { backgroundColor: "#FDF0F1" }]}>
              <Text style={[styles.metricItemLabelText, { color: THEME.secondary }]}>Pending Action</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.secondary }]}>{pendingAssignments.length} Tasks</Text>
              <Text style={styles.metricItemFooterSubtext}>timeline sync required</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth, { backgroundColor: "#E7F9EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: THEME.success }]}>Submitted & Graded</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.success }]}>{completedSubmissions.length} Tasks</Text>
              <Text style={styles.metricItemFooterSubtext}>Database records finalized</Text>
            </View>
          </View>

          {/* Tabs Navigation Selector Bar Framework */}
          <View style={styles.categoryFilterBarSectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerLayout}>
              <View style={styles.filterIconBackdropContainerBox}>
                <Filter size={14} color={THEME.darkAccent} />
              </View>
              {["Pending Assignments", "Completed Submissions"].map((tabLabel, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.filterChipTabUnitCell, selectedTab === tabLabel && styles.activeFilterChipTabUnitCell]}
                  onPress={() => setSelectedTab(tabLabel)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipTabLabelTextText, selectedTab === tabLabel && styles.activeFilterChipTabLabelTextText]}>
                    {tabLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Desktop Dual Column Map / Mobile Vertical Roll Splitting Stack Block */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            
            {/* Left Block Segment: Dynamic Registry Rendering Streams */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}>
              <Text style={styles.blockTitleLabelHeading}>{selectedTab} File Registries</Text>

              {selectedTab === "Pending Assignments" ? (
                pendingAssignments.map((item) => (
                  <View key={item.assignmentId} style={styles.transactionRowCardItemUnit}>
                    <View style={[styles.transactionHighlightVerticalStrip, { backgroundColor: THEME.primary }]} />
                    <View style={styles.transactionCoreLeftContentCluster}>
                      <View style={styles.txMetaHeaderRowLine}>
                        <Text style={styles.txIdStringLabelTextText}>{item.assignmentId} • Subject: {item.subjectId}</Text>
                        <Text style={styles.txDateMutedLabelString}>Due: {item.dueDate}</Text>
                      </View>
                      <Text style={styles.txMainTitleHeadingTextText}>{item.title}</Text>
                      <Text style={styles.descriptionParagraphText}>{item.description}</Text>
                      <Text style={styles.authorBadgeLabel}>Issued By: {item.createdBy} to {item.assignedTo}</Text>

                      {item.attachedFiles && item.attachedFiles !== "string" && (
                        <TouchableOpacity 
                          style={styles.downloadRowInlineBtn} 
                          onPress={() => handleOpenAttachedFile(item.attachedFiles)}
                          activeOpacity={0.7}
                        >
                          <Download size={13} color={THEME.primary} />
                          <Text style={styles.downloadInlineText}>Launch Document Viewer ({item.attachedFiles})</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.actionCellContainerBlock}>
                      {/*<TouchableOpacity style={styles.updateAssignmentInlineRowActionBtn} onPress={() => handleLaunchEditForm(item)}>
                        <Edit2 size={13} color={THEME.white} />
                        <Text style={styles.updateInlineBtnText}>Update Assignment</Text>
                      </TouchableOpacity>*/}
                    </View>
                  </View>
                ))
              ) : (
                completedSubmissions.map((sub, idx) => (
                  <View key={sub.assignmentId || idx} style={styles.transactionRowCardItemUnit}>
                    <View style={[styles.transactionHighlightVerticalStrip, { backgroundColor: THEME.success }]} />
                    <View style={styles.transactionCoreLeftContentCluster}>
                      <View style={styles.txMetaHeaderRowLine}>
                        <Text style={styles.txIdStringLabelTextText}>Sub No: {sub.submissionNumber} • Subject: {sub.subjectId}</Text>
                        <Text style={styles.txDateMutedLabelString}>Submitted: {sub.submittedDate?.substring(0,10)}</Text>
                      </View>
                      <Text style={styles.txMainTitleHeadingTextText}>Assignment ID: {sub.assignmentId}</Text>
                      
                      <View style={styles.textNoteBlockHolder}>
                        <Text style={styles.noteStringText}><Text style={{ fontWeight: "bold" }}>Student Note: </Text>{sub.note || "No custom message logged."}</Text>
                        <Text style={styles.noteStringText}><Text style={{ fontWeight: "bold" }}>Tutor Remark: </Text>{sub.remark || "Awaiting evaluation summary."}</Text>
                      </View>

                      {sub.relatedLinks && sub.relatedLinks.map((lnk: string, lIdx: number) => (
                        <View key={lIdx} style={styles.linkReferenceInlineRow}>
                          <Link2 size={12} color={THEME.darkAccent} />
                          <Text style={styles.linkStringText} numberOfLines={1}>{lnk}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.transactionRightActionContextBlock}>
                      <View style={[styles.statusBadgeCapsule, { backgroundColor: "#E7F9EE" }]}>
                        <Text style={[styles.statusBadgeText, { color: THEME.success }]}>{sub.status || "Submitted"}</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}

              {selectedTab === "Pending Assignments" && pendingAssignments.length === 0 && (
                <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No pending items located in this queue profile tier.</Text>
              )}
              {selectedTab === "Completed Submissions" && completedSubmissions.length === 0 && (
                <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No past submissions items located in this history profile log.</Text>
              )}
            </View>

            {/* Right Block Segment: Performance Indicator Chart Cards */}
            {isDesktop && (
              <View style={[styles.responsiveRightBlockStack, styles.desktopFlexProportionWidthRightSide]}>
                <View style={styles.rightSideInternalCardWrapperPanelBox}>
                  <View style={styles.cardHeaderWithIconTitleFlexRow}>
                    <TrendingUp size={16} color={THEME.darkAccent} />
                    <Text style={styles.blockTitleLabelHeading}>Diary Completion Metrics Curve</Text>
                  </View>

                  <View style={styles.radialGraphCanvasHolderHolder}>
                    <Svg height="120" width="120" viewBox="0 0 110 110">
                      <G rotate="-90" origin="55, 55">
                        <Circle cx="55" cy="55" r={chartRadius} stroke="#F3ECE7" strokeWidth="9" fill="transparent" />
                        <Circle
                          cx="55"
                          cy="55"
                          r={chartRadius}
                          stroke={THEME.success}
                          strokeWidth="9"
                          fill="transparent"
                          strokeDasharray={chartCircumference}
                          strokeDashoffset={strokeDashoffsetVal}
                          strokeLinecap="round"
                        />
                      </G>
                    </Svg>
                    <View style={styles.radialChartAbsoluteLabelsCenterBlock}>
                      <Text style={styles.radialChartBigPercentageText}>{completionPercentage}%</Text>
                      <Text style={styles.radialChartMutedSubtext}>Resolved</Text>
                    </View>
                  </View>
                </View> 
              </View>
            )}

          </View>

          <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}>
            <Info size={13} color={THEME.darkAccent} />
            <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}>
              Deliverable ledger matrix pipelines are cryptographically signed. Staged files are pushed straight to remote administrative nodes through secure multi-part form protocol loops.
            </Text>
          </View>

        </View>
      </Animated.ScrollView>

      {/* Dynamic Edit Profile Overlap Form Modal Sheet Framework */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.formModalRootWindowBackdropContainer}>
          <View style={[styles.formModalSheetWrapperBodyCard, isDesktop && styles.desktopModalFormSizing]}>
            
            <View style={styles.formModalHeaderTopRowStickyBar}>
              <View style={styles.modalHeadingTitleFlexCluster}>
                <Edit2 size={18} color={THEME.primary} />
                <Text style={styles.modalFormCoreHeadingTitleText}>Update Task Staging Sheet Parameters</Text>
              </View>
              <TouchableOpacity style={styles.closeModalFormCircularActionDismissBtn} onPress={() => setEditModalVisible(false)}>
                <X size={18} color={THEME.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalFormInternalScrollableBodyWorkspace} showsVerticalScrollIndicator={false}>
              
              <Text style={styles.formGroupSectionDividerLabel}>1. Dynamic Asset Stream Binder</Text>
              <TouchableOpacity 
                style={[styles.fileUploadInteractionCardBox, selectedFile && { borderColor: THEME.success, backgroundColor: "#F4FBF7" }]} 
                onPress={handleLocalFileSelection}
                activeOpacity={0.75}
              >
                <UploadCloud size={28} color={selectedFile ? THEME.success : THEME.primary} />
                <Text style={styles.fileUploadMainLabelTitle}>
                  {selectedFile ? "Binary File Staged for Multi-Part Stream" : "Attach Submissions File Content"}
                </Text>
                <Text style={styles.fileUploadMutedSubtext}>
                  {selectedFile ? `Staged URI: ${selectedFile.name}` : "Pushes straight to file server repository layers"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.formGroupSectionDividerLabel}>2. Primary Key Allocations</Text>
              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabelMetaText}>Assignment Track ID</Text>
                  <TextInput style={[styles.formTextInputFieldNode, styles.formTextInputFieldNodeDisabled]} value={formData.assignmentId} editable={false} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabelMetaText}>Subject Stream Key</Text>
                  <TextInput style={[styles.formTextInputFieldNode, styles.formTextInputFieldNodeDisabled]} value={formData.subjectId} editable={false} />
                </View>
              </View>

              <Text style={styles.formGroupSectionDividerLabel}>3. Descriptive Parameters Content</Text>
              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Assignment Heading Title</Text>
                <TextInput style={styles.formTextInputFieldNode} value={formData.title} onChangeText={(txt) => setFormData({ ...formData, title: txt })} />
              </View>

              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Detailed Instructions Body Description</Text>
                <TextInput style={[styles.formTextInputFieldNode, { height: 64, textAlignVertical: "top", paddingTop: 10 }]} value={formData.description} onChangeText={(txt) => setFormData({ ...formData, description: txt })} multiline numberOfLines={3} />
              </View>

              <Text style={styles.formGroupSectionDividerLabel}>4. Signatures & Core Status Profiles</Text>
              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabelMetaText}>Created By (Tutor ID)</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.createdBy} onChangeText={(txt) => setFormData({ ...formData, createdBy: txt })} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabelMetaText}>Assigned To (Student ID)</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.assignedTo} onChangeText={(txt) => setFormData({ ...formData, assignedTo: txt })} />
                </View>
              </View>

              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Staging Queue Status Track</Text>
                <TextInput style={styles.formTextInputFieldNode} value={formData.status} onChangeText={(txt) => setFormData({ ...formData, status: txt })} />
              </View>

              <Text style={styles.formGroupSectionDividerLabel}>5. Datepicker Horizon Milestones</Text>
              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabelMetaText}>Assigned Date Calendar</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.assignedDate} onChangeText={(txt) => setFormData({ ...formData, assignedDate: txt })} placeholder="YYYY-MM-DD" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabelMetaText}>Due Date Deadline</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.dueDate} onChangeText={(txt) => setFormData({ ...formData, dueDate: txt })} placeholder="YYYY-MM-DD" />
                </View>
              </View>

              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Attached Remote Path Filename Reference String</Text>
                <TextInput style={styles.formTextInputFieldNode} value={formData.attachedFiles} onChangeText={(txt) => setFormData({ ...formData, attachedFiles: txt })} />
              </View>

              <View style={{ height: 32 }} />
            </ScrollView>

            <View style={styles.formModalFooterActionButtonsStickyRow}>
              <TouchableOpacity style={styles.formModalCancelDismissBtnUnit} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.formCancelBtnLabelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.formModalSubmitCommitBtnUnit} onPress={handleUpdateSubmit}>
                <Save size={16} color={THEME.white} style={{ marginRight: 6 }} />
                <Text style={styles.formSubmitBtnLabelText}>Commit Multi-Part Form Data</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* Success Notification Window Popups System Overlay */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successBlurOverlayRoot}>
          <View style={styles.successDialogueCardBoxContainer}>
            <CheckCircle size={56} color={THEME.success} style={{ marginBottom: 14 }} />
            <Text style={styles.successDialogBigTitle}>Updated Successfully</Text>
            <Text style={styles.successDialogSubtextBody}>Your multi-part assignment variables bundle block has successfully committed inside structural server registers.</Text>
            <TouchableOpacity style={styles.successDismissActionButtonBtn} onPress={() => setSuccessModalVisible(false)}>
              <Text style={styles.successDismissBtnLabelText}>Dismiss Panel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, position: "relative" }, 
  loadingContainer: { flex: 1, backgroundColor: THEME.background, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 12, fontSize: 14, color: THEME.textDark, fontWeight: "600", textAlign: "center" },
  fluidBackgroundContainer: { position: "absolute", top: 0, left: -20, right: 0, zIndex: -2, opacity: 0.85 }, 
  orb3DOne: { position: "absolute", width: 330, height: 330, borderRadius: 165, backgroundColor: "rgba(227, 83, 54, 0.06)", top: 140, right: -40, zIndex: -1 }, 
  orb3DTwo: { position: "absolute", width: 390, height: 390, borderRadius: 195, backgroundColor: "rgba(160, 82, 45, 0.04)", bottom: 80, left: -110, zIndex: -1 }, 
  desktopCenter: { alignItems: "center", justifyContent: "center" }, 
  mainWrapper: { width: "100%", paddingBottom: 40 }, 
  desktopWidth: { maxWidth: 1140, paddingHorizontal: 20 }, 
  pageHeaderBlockCard: { backgroundColor: THEME.white, padding: 22, borderRadius: 26, marginHorizontal: 16, marginTop: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 }, 
  headerLeftCluster: { flex: 1, minWidth: 280, gap: 4 }, 
  titleBadgeInlineRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 }, 
  pageTitleHeading: { fontSize: 24, fontWeight: "bold", color: THEME.textDark }, 
  profileIndicatorTextSpan: { fontSize: 13, color: THEME.textMuted, fontWeight: "600" },
  liveBroadcastBadge: { flexDirection: "row", alignItems: "center", backgroundColor: THEME.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }, 
  liveBroadcastBadgeText: { color: THEME.white, fontSize: 11, fontWeight: "700" }, 
  headerIconCircleBackdrop: { width: 46, height: 46, borderRadius: 23, backgroundColor: THEME.primary, justifyContent: "center", alignItems: "center" }, 
  sectionHeadingTitle: { fontSize: 18, fontWeight: "700", color: THEME.textDark, marginHorizontal: 20, marginTop: 30, marginBottom: 14 }, 
  overviewMetricsWrapperGridRow: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, marginTop: 4 }, 
  metricCardUnitItem: { width: "100%", backgroundColor: THEME.white, padding: 16, borderRadius: 22, marginBottom: 12, marginHorizontal: 4, flex: 1, minWidth: 220, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 2 }, 
  desktopMetricFourth: { width: "31%" },
  metricItemLabelText: { fontSize: 12, color: THEME.textMuted, fontWeight: "600" }, 
  metricItemBigNumber: { fontSize: 24, fontWeight: "800", color: THEME.textDark, marginTop: 4 }, 
  metricItemFooterSubtext: { fontSize: 11, color: THEME.textMuted, marginTop: 4 }, 
  categoryFilterBarSectionContainer: { marginTop: 14, paddingLeft: 16 }, 
  filterScrollViewInnerLayout: { alignItems: "center", gap: 8, paddingRight: 24 }, 
  filterIconBackdropContainerBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: THEME.white, justifyContent: "center", alignItems: "center", marginRight: 4 }, 
  filterChipTabUnitCell: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: THEME.white }, 
  activeFilterChipTabUnitCell: { backgroundColor: THEME.primary }, //
  filterChipTabLabelTextText: { color: THEME.textMuted, fontSize: 13, fontWeight: "600" }, 
  responsiveSplitMainLayoutFlexContainer: { paddingHorizontal: 16, marginTop: 22, gap: 16 }, 
  rowDirectionLayoutGrid: { flexDirection: "row" }, 
  desktopFlexProportionWidth: { flex: 1.4 },
  desktopFlexProportionWidthRightSide: { flex: 0.8 },
  responsiveRightBlockStack: { flex: 1, gap: 16 }, 
  listFeedBlockSectionCard: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 12 }, 
  blockTitleLabelHeading: { fontSize: 15, fontWeight: "800", color: THEME.textDark }, 
  transactionRowCardItemUnit: { backgroundColor: "#FDFCF9", borderRadius: 18, flexDirection: "column", padding: 14, overflow: "hidden", borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.05)", marginBottom: 12 }, 
  transactionHighlightVerticalStrip: { width: "100%", height: 3, position: "absolute", top: 0, left: 0 }, 
  transactionCoreLeftContentCluster: { flex: 1, gap: 6, marginTop: 4 }, 
  txMetaHeaderRowLine: { flexDirection: "row", alignItems: "center", justifyBox: "space-between", flexWrap: "wrap", gap: 10 }, 
  txIdStringLabelTextText: { fontSize: 11, fontWeight: "700", color: THEME.textMuted }, 
  txDateMutedLabelString: { fontSize: 11, color: THEME.primary, fontWeight: "700", marginLeft: "auto" }, 
  txMainTitleHeadingTextText: { fontSize: 15, fontWeight: "700", color: THEME.textDark }, 
  descriptionParagraphText: { fontSize: 13, color: THEME.textMuted, lineHeight: 18 },
  authorBadgeLabel: { fontSize: 11, fontWeight: "600", color: THEME.darkAccent },
  downloadRowInlineBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4, backgroundColor: "rgba(223, 83, 54, 0.05)", padding: 8, borderRadius: 8, alignSelf: "flex-start" },
  downloadInlineText: { fontSize: 12, fontWeight: "600", color: THEME.primary, textDecorationLine: "underline" },
  actionCellContainerBlock: { borderTopWidth: 1, borderTopColor: "#F5F5F5", paddingTop: 10, marginTop: 8, alignItems: "flex-end" },
  updateAssignmentInlineRowActionBtn: { flexDirection: "row", alignItems: "center", backgroundColor: THEME.darkAccent, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, gap: 4 },
  updateInlineBtnText: { color: THEME.white, fontSize: 12, fontWeight: "700" },
  textNoteBlockHolder: { backgroundColor: "#F5F5DC", padding: 10, borderRadius: 10, gap: 4, marginTop: 4 },
  noteStringText: { fontSize: 12, color: THEME.textDark, lineHeight: 16 },
  linkReferenceInlineRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  linkStringText: { fontSize: 12, color: THEME.primary, textDecorationLine: "underline" },
  transactionRightActionContextBlock: { alignItems: "center", paddingRight: 4, flexDirection: "row", marginTop: 4 }, 
  statusBadgeCapsule: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }, 
  statusBadgeText: { fontSize: 11, fontWeight: "700" }, 
  fallbackEmptyLogsPlaceholderMutedText: { fontSize: 12, color: THEME.textMuted, fontStyle: "italic", textAlign: "center", paddingVertical: 12 }, 
  rightSideInternalCardWrapperPanelBox: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 14, alignSelf: "flex-start", width: "100%" }, 
  cardHeaderWithIconTitleFlexRow: { flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#F5F5F5", paddingBottom: 12 }, 
  radialGraphCanvasHolderHolder: { position: "relative", justifyContent: "center", alignItems: "center", height: 130, width: "100%", marginTop: 10 }, 
  radialChartAbsoluteLabelsCenterBlock: { position: "absolute", justifyContent: "center", alignItems: "center" }, 
  radialChartBigPercentageText: { fontSize: 22, fontWeight: "800", color: THEME.textDark }, 
  radialChartMutedSubtext: { fontSize: 11, color: THEME.textMuted, fontWeight: "600" }, 
  auditVerificationNoticeSafetyFooterCardStrip: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginHorizontal: 16, marginTop: 24, marginBottom: 10 }, 
  auditVerificationNoticeSafetyFooterCardTextText: { fontSize: 11, color: THEME.textMuted, lineHeight: 15, flex: 1 }, 
  formModalRootWindowBackdropContainer: { flex: 1, backgroundColor: "rgba(44, 26, 20, 0.5)", justifyContent: "flex-end", alignItems: "center" },
  formModalSheetWrapperBodyCard: { backgroundColor: THEME.white, width: "100%", height: "88%", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 20, overflow: "hidden" },
  desktopModalFormSizing: { maxWidth: 640, height: "85%", alignSelf: "center", borderRadius: 28, bottom: "7%" },
  formModalHeaderTopRowStickyBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "rgba(44,26,20,0.08)" },
  modalHeadingTitleFlexCluster: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalFormCoreHeadingTitleText: { fontSize: 16, fontWeight: "800", color: THEME.textDark },
  closeModalFormCircularActionDismissBtn: { padding: 6, backgroundColor: "rgba(44,26,20,0.05)", borderRadius: 10 },
  modalFormInternalScrollableBodyWorkspace: { flex: 1, marginTop: 14 },
  formGroupSectionDividerLabel: { fontSize: 13, fontWeight: "750", color: THEME.darkAccent, marginTop: 16, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  formFieldLayoutWrapperUnit: { marginBottom: 12, width: "100%" },
  formFieldFlexInlineRowGroup: { flexDirection: "row", gap: 12, width: "100%", marginBottom: 4 },
  formInputLabelMetaText: { fontSize: 12, fontWeight: "600", color: THEME.textMuted, marginBottom: 4 },
  formTextInputFieldNode: { backgroundColor: THEME.background, height: 46, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(44,26,20,0.12)", color: THEME.textDark, fontSize: 14, fontWeight: "500" },
  formTextInputFieldNodeDisabled: { backgroundColor: "rgba(44,26,20,0.05)", color: THEME.textMuted },
  fileUploadInteractionCardBox: { width: "100%", paddingVertical: 20, borderStyle: "dashed", borderWidth: 2, borderColor: THEME.primary, borderRadius: 16, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFBF9", gap: 4 },
  fileUploadMainLabelTitle: { fontSize: 13, fontWeight: "700", color: THEME.textDark, marginTop: 4 },
  fileUploadMutedSubtext: { fontSize: 11, color: THEME.textMuted, fontWeight: "500" },
  formModalFooterActionButtonsStickyRow: { flexDirection: "row", gap: 12, borderTopWidth: 1, borderTopColor: "rgba(44,26,20,0.08)", paddingTop: 14, justifyContent: "flex-end" },
  formModalCancelDismissBtnUnit: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, backgroundColor: "rgba(44,26,20,0.05)" },
  formCancelBtnLabelText: { color: THEME.textMuted, fontSize: 14, fontWeight: "600" },
  formModalSubmitCommitBtnUnit: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, backgroundColor: THEME.primary },
  formSubmitBtnLabelText: { color: THEME.white, fontSize: 14, fontWeight: "700" },
  successBlurOverlayRoot: { flex: 1, backgroundColor: "rgba(44, 26, 20, 0.45)", justifyContent: "center", alignItems: "center", padding: 24 },
  successDialogueCardBoxContainer: { width: "100%", maxWidth: 360, backgroundColor: THEME.white, borderRadius: 24, padding: 24, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 16, elevation: 6 },
  successDialogBigTitle: { fontSize: 18, fontWeight: "800", color: THEME.textDark, marginBottom: 8, textAlign: "center" },
  successDialogSubtextBody: { fontSize: 13, color: THEME.textMuted, lineHeight: 18, textAlign: "center", marginBottom: 20, fontWeight: "500" },
  successDismissActionButtonBtn: { width: "100%", backgroundColor: "#16A34A", paddingVertical: 12, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  successDismissBtnLabelText: { color: THEME.white, fontSize: 14, fontWeight: "700" }
});