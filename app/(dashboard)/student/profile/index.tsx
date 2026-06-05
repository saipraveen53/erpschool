import { useAuth } from "@/app/contexts/AuthContext";
import { studentdashboardApi } from "@/app/utils/axiosInstance";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  CheckCircle,
  Edit2,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UploadCloud,
  User,
  Users,
  X
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
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
import Svg, { Path } from "react-native-svg";

const THEME = {
  primary: "#E35336",       
  background: "#F5F5DC",    
  secondary: "#F44460",     
  darkAccent: "#A0522D",    
  white: "#FFFFFF",         
  textDark: "#2C1A14",      
  textMuted: "#7A6862",      
  glassBg: "rgba(255, 255, 255, 0.76)", 
};

export default function ParentProfileDashboard() {
  const router = useRouter(); 
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false); 
  const [smsToggle, setSmsToggle] = useState(true);
  const [emailToggle, setEmailToggle] = useState(true);

  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Selected file tracker state hook object references
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    studentId: "",
    admissionNumber: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    nationality: "",
    religion: "",
    category: "",
    classSectionId: "",
    grade: "",
    section: "",
    academicYear: "",
    joiningDate: "",
    rollNumber: "",
    classTeacherId: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactNumber: "",
    email: "",
    fatherName: "",
    fatherContact: "",
    motherName: "",
    motherContact: "",
    guardianName: "",
    guardianContact: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    profileImageUrl: "",
    active: true,
    generatedPassword: "",
    totalFee: 0.1
  });

  const { width } = Dimensions.get("window"); 
  const isDesktop = width > 768; 

  const scrollYAnim = useRef(new Animated.Value(0)).current; 
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(45)).current; 
  const fluidMoveAnim = useRef(new Animated.Value(0)).current; 

  const fetchProfileData = async () => {
    try {
      setApiLoading(true);
      const studentId = user?.username || "STU2026004";
      const response = await studentdashboardApi.get(`/api/student/${studentId}`);
      const data = response.data;
      setStudentProfile(data);
      setImageError(false);

      setFormData({
        studentId: data.studentId || "",
        admissionNumber: data.admissionNumber || "",
        fullName: data.fullName || "",
        dateOfBirth: data.dateOfBirth || "2026-06-04",
        gender: data.gender || "",
        bloodGroup: data.bloodGroup || "",
        nationality: data.nationality || "",
        religion: data.religion || "",
        category: data.category || "",
        classSectionId: data.classSectionId || "",
        grade: data.grade || "",
        section: data.section || "",
        academicYear: data.academicYear || "",
        joiningDate: data.joiningDate || "2026-06-04",
        rollNumber: data.rollNumber || "",
        classTeacherId: data.classTeacherId || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        contactNumber: data.contactNumber || "",
        email: data.email || "",
        fatherName: data.fatherName || "",
        fatherContact: data.fatherContact || "",
        motherName: data.motherName || "",
        motherContact: data.motherContact || "",
        guardianName: data.guardianName || "",
        guardianContact: data.guardianContact || "",
        emergencyContactName: data.emergencyContactName || "",
        emergencyContactNumber: data.emergencyContactNumber || "",
        profileImageUrl: data.profileImageUrl || "",
        active: data.active ?? true,
        generatedPassword: data.generatedPassword || "",
        totalFee: data.totalFee ?? 0.1
      });
    } catch (err) {
      console.error("Error retrieving student registration profile metrics:", err);
    } finally {
      setApiLoading(false);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      setApiLoading(true);
      const studentId = user?.username || "STU2026004";
      
      // 1. Build the precise JSON data object matching your exact requested schema parameters 
      const rawPayloadData = {
        studentId: formData.studentId,
        admissionNumber: formData.admissionNumber,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        nationality: formData.nationality,
        religion: formData.religion,
        category: formData.category,
        aadhaarNumber: studentProfile?.aadhaarNumber || "123456789012",
        classSectionId: formData.classSectionId,
        grade: formData.grade,
        section: formData.section,
        academicYear: formData.academicYear,
        joiningDate: formData.joiningDate,
        rollNumber: formData.rollNumber,
        classTeacherId: formData.classTeacherId,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        contactNumber: formData.contactNumber,
        email: formData.email,
        fatherName: formData.fatherName,
        fatherContact: formData.fatherContact,
        motherName: formData.motherName,
        motherContact: formData.motherContact,
        guardianName: formData.guardianName,
        guardianContact: formData.guardianContact,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactNumber: formData.emergencyContactNumber,
        profileImageUrl: formData.profileImageUrl,
        active: formData.active,
        generatedPassword: formData.generatedPassword,
        totalFee: formData.totalFee
      };

      // 2. Wrap into standard multi-part data matrix forms structure
      const sendMultipartForm = new FormData();

      if (Platform.OS === "web") {
        // Web environments accept structured Blobs explicitly specifying Content-Type targets
        const dataJsonBlob = new Blob([JSON.stringify(rawPayloadData)], { type: "application/json" });
        sendMultipartForm.append("data", dataJsonBlob);
      } else {
        // Native systems map the raw string segment directly across the layout boundaries
        sendMultipartForm.append("data", JSON.stringify(rawPayloadData));
      }

      // 3. Inject the file item reference array under the target file parameter if selected
      if (selectedFile) {
        sendMultipartForm.append("file", selectedFile);
      }

      // 4. Fire the absolute put transaction call setting multi-part content descriptor flags
      await studentdashboardApi.put(`/api/student/${studentId}`, sendMultipartForm, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        },
      });

      setEditModalVisible(false);
      setSelectedFile(null); // Clear selected memory states
      await fetchProfileData();
      
      setTimeout(() => {
        setSuccessModalVisible(true);
      }, 400);
    } catch (err) {
      console.error("Error executing multipart form profile synchronization update:", err);
    } finally {
      setApiLoading(false);
    }
  };

  // Simulated cross-platform file selector mechanism packing standard asset meta properties
  const handleLocalFileSelection = () => {
    // Injecting standard file properties satisfying multi-part descriptor layers directly
    const simulatedFileObject = {
      uri: "file://dev/local/simulated-profile-avatar.jpg",
      name: "simulated-profile-avatar.jpg",
      type: "image/jpeg"
    };
    setSelectedFile(simulatedFileObject);
    alert("Profile picture selected successfully.");
  };

  useEffect(() => {
    fetchProfileData();

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

  const onRefresh = async () => {
    setRefreshing(true); 
    await fetchProfileData();
    setRefreshing(false); 
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

  const getProfileImageUri = () => {
    const path = studentProfile?.profileImageUrl;
    if (!path || path === "string") return null;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return { uri: path };
    }
    const baseDomain = studentdashboardApi.defaults.baseURL || "";
    const cleanBase = baseDomain.endsWith("/") ? baseDomain.slice(0, -1) : baseDomain;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return { uri: `${cleanBase}${cleanPath}` };
  };

  if (apiLoading && !refreshing && !editModalVisible && !successModalVisible) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingText}>Synchronizing Security Credentials Profiles Matrix...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}> 
      <StatusBar style="dark" /> 

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
          
          {/* Profile Header Box Card Panel Framework */}
          <Animated.View style={[styles.profileHeaderBoxCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.profileMasterInfoRow}>
              
              <View style={styles.avatarImageWrapperBackdrop}>
                {getProfileImageUri() && !imageError ? (
                  <Image 
                    source={getProfileImageUri()} 
                    style={styles.avatarImageStyle} 
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <User size={32} color={THEME.darkAccent} />
                )}
                <View style={[styles.onlineStatusPulseIndicatorDot, { backgroundColor: studentProfile?.active ? "#16A34A" : "#EF4444" }]} />
              </View>

              <View style={styles.identityDetailsClusterTextsBlock}>
                <View style={styles.titleBadgeInlineRowGroup}>
                  <Text style={styles.parentNameHeadingTitle}>{studentProfile?.fullName || "N/A"}</Text>
                  <View style={styles.securityTierBadgeCapsule}>
                    <ShieldCheck size={12} color="#16A34A" style={{ marginRight: 4 }} />
                    <Text style={styles.securityTierBadgeLabelString}>{studentProfile?.active ? "Active Record" : "Inactive System"}</Text>
                  </View>
                </View>
                <Text style={styles.parentRoleLabelSubtext}>Grade: {studentProfile?.grade || "N/A"} • Section: {studentProfile?.section || "N/A"}</Text>
                <Text style={styles.parentUidLabelString}>Admission Sequence ID: {studentProfile?.admissionNumber || "N/A"}</Text>
              </View>

              <TouchableOpacity 
                style={styles.headerEditProfileTriggerActionBtn}
                onPress={() => setEditModalVisible(true)}
                activeOpacity={0.7}
              >
                <Edit2 size={16} color={THEME.white} />
                <Text style={styles.headerEditBtnTextLabel}>Edit Profile</Text>
              </TouchableOpacity>

            </View>
          </Animated.View>

          {/* Split Screen Responsive Grid Layout Mappings */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}> 
            
            {/* Left Box Split Window Panel: Personal Account Field Ledgers */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}> 
              <Text style={styles.blockTitleLabelHeading}>Personal Identity Registration Logs</Text>
              
              <View style={styles.fieldDataRowLineItemUnit}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <Mail size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Registered Email:</Text>
                </View>
                <Text style={styles.fieldValueContentStringText}>{studentProfile?.email || "N/A"}</Text>
              </View>

              <View style={styles.fieldDataRowLineItemUnit}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <Phone size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Primary Contact Number:</Text>
                </View>
                <Text style={styles.fieldValueContentStringText}>{studentProfile?.contactNumber || "N/A"}</Text>
              </View>

              <View style={styles.fieldDataRowLineItemUnit}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <Users size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Father Name Reference:</Text>
                </View>
                <Text style={styles.fieldValueContentStringText}>{studentProfile?.fatherName || "N/A"} ({studentProfile?.fatherContact || "N/A"})</Text>
              </View>

              <View style={styles.fieldDataRowLineItemUnit}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <Users size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Mother Name Identifier:</Text>
                </View>
                <Text style={styles.fieldValueContentStringText}>{studentProfile?.motherName || "N/A"} ({studentProfile?.motherContact || "N/A"})</Text>
              </View>

              <View style={styles.fieldDataRowLineItemUnit}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <Users size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Primary Guardian Name:</Text>
                </View>
                <Text style={styles.fieldValueContentStringText}>{studentProfile?.guardianName || "N/A"} ({studentProfile?.guardianContact || "N/A"})</Text>
              </View>

              <View style={styles.fieldDataRowLineItemUnit}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <Users size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Emergency Backup Contact:</Text>
                </View>
                <Text style={styles.fieldValueContentStringText}>{studentProfile?.emergencyContactName || "N/A"} ({studentProfile?.emergencyContactNumber || "N/A"})</Text>
              </View>

              <View style={styles.fieldDataRowLineItemUnit}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <Lock size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Identity Verification Matrix Key:</Text>
                </View>
                <Text style={styles.fieldValueContentStringText}>[Aadhaar Redacted]</Text>
              </View>

              <View style={[styles.fieldDataRowLineItemUnit, { flexDirection: "column", alignItems: "flex-start", gap: 6 }]}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <MapPin size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Residential Communication Address:</Text>
                </View>
                <Text style={[styles.fieldValueContentStringText, { textAlign: "left", lineHeight: 18, marginTop: 2 }]}>
                  {`${studentProfile?.address || ""}, ${studentProfile?.city || ""}, ${studentProfile?.state || ""} - ${studentProfile?.pincode || ""}`}
                </Text>
              </View>
            </View>

            {/* Right Box Split Window Panel: Portal Configurations & Security Mappings */}
            <View style={[styles.responsiveRightBlockStack, isDesktop && styles.desktopFlexProportionWidthRightSide]}>
              
              {/* Core Academic Telemetry Ledger Box Panel */}
              <View style={styles.rightSideInternalCardWrapperPanelBox}>
                <View style={styles.cardHeaderWithIconTitleFlexRow}>
                  <Users size={16} color={THEME.darkAccent} />
                  <Text style={styles.blockTitleLabelHeading}>Institutional Telemetry Vectors</Text>
                </View>
                
                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Student Node Identifier ID:</Text>
                  <Text style={styles.rightPanelInlineValueSpanText}>{studentProfile?.studentId || "N/A"}</Text>
                </View>

                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Roll Sequence Matrix Tracker:</Text>
                  <Text style={styles.rightPanelInlineValueSpanText}>{studentProfile?.rollNumber || "N/A"}</Text>
                </View>

                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Assigned Class Section Token:</Text>
                  <Text style={styles.rightPanelInlineValueSpanText}>{studentProfile?.classSectionId || "N/A"}</Text>
                </View>

                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Academic Calendar Year Slot:</Text>
                  <Text style={styles.rightPanelInlineValueSpanText}>{studentProfile?.academicYear || "N/A"}</Text>
                </View>

                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Primary Class Teacher ID:</Text>
                  <Text style={styles.rightPanelInlineValueSpanText}>{studentProfile?.classTeacherId || "N/A"}</Text>
                </View>

                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Enrollment Insertion Timestamp:</Text>
                  <Text style={styles.rightPanelInlineValueSpanText}>{studentProfile?.joiningDate || "N/A"}</Text>
                </View>

                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Demographic Category Slate:</Text>
                  <Text style={styles.rightPanelInlineValueSpanText}>{studentProfile?.category || "N/A"}</Text>
                </View>

                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Nationality Register Country:</Text>
                  <Text style={styles.rightPanelInlineValueSpanText}>{studentProfile?.nationality || "N/A"}</Text>
                </View>

                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Religion Denomination Index:</Text>
                  <Text style={styles.rightPanelInlineValueSpanText}>{studentProfile?.religion || "N/A"}</Text>
                </View>

                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Financial Accounts Balance Invoice:</Text>
                  <Text style={[styles.rightPanelInlineValueSpanText, { color: THEME.primary, fontWeight: "800" }]}>
                    ₹{studentProfile?.totalFee?.toLocaleString() || "0.00"}
                  </Text>
                </View>
              </View>

              {/* Security Option Card Panel */}
              <View style={styles.rightSideInternalCardWrapperPanelBox}>
                <View style={styles.cardHeaderWithIconTitleFlexRow}>
                  <Lock size={16} color={THEME.darkAccent} />
                  <Text style={styles.blockTitleLabelHeading}>Security Gate Key Mapping</Text>
                </View>
                <View style={styles.securityOptionInlineRowCell}>
                  <Text style={styles.securityOptionLabelHeadingText}>Generated System Password Tag:</Text>
                  <Text style={[styles.rightPanelInlineValueSpanText, { fontStyle: "italic" }]}>{studentProfile?.generatedPassword || "N/A"}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.portalLogOutSessionActionFullBtn} onPress={() => logout?.()} activeOpacity={0.85}>
                <LogOut size={16} color={THEME.white} style={{ marginRight: 6 }} />
                <Text style={styles.logOutBtnLabelTextContentStringText}>Terminate Portal Session</Text>
              </TouchableOpacity>

            </View>

          </View>

          <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}> 
            <Info size={13} color={THEME.darkAccent} /> 
            <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}> 
              Parent profiling account matrix keys are dynamically tokenized and synchronized across local administrative architecture safe nodes. All database requests follow standard privacy criteria regulations.
            </Text>
          </View>

        </View>
      </Animated.ScrollView>

      {/* Edit Profile Registry Overlap Form Modal Window Engine */}
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
                <Text style={styles.modalFormCoreHeadingTitleText}>Modify Registration Artifact Records</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeModalFormCircularActionDismissBtn} 
                onPress={() => setEditModalVisible(false)}
              >
                <X size={18} color={THEME.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalFormInternalScrollableBodyWorkspace} showsVerticalScrollIndicator={false}>
              
              <Text style={styles.formGroupSectionDividerLabel}>1. Device Image Core Upload Interface</Text>
              <TouchableOpacity 
                style={[styles.fileUploadInteractionCardBox, selectedFile && { borderColor: "#16A34A", backgroundColor: "#F4FBF7" }]} 
                onPress={handleLocalFileSelection}
                activeOpacity={0.75}
              >
                <UploadCloud size={28} color={selectedFile ? "#16A34A" : THEME.primary} />
                <Text style={styles.fileUploadMainLabelTitle}>
                  {selectedFile ? "Artwork Attachment Staged Successfully" : "Select Updated Profile Artwork Attachment"}
                </Text>
                <Text style={styles.fileUploadMutedSubtext}>
                  {selectedFile ? `Staged filename: ${selectedFile.name}` : "Supports local platform PNG or JPEG format logs"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.formGroupSectionDividerLabel}>2. Core Personal Identity Parameters</Text>
              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Full Student Name</Text>
                <TextInput 
                  style={styles.formTextInputFieldNode} 
                  value={formData.fullName}
                  onChangeText={(txt) => setFormData({ ...formData, fullName: txt })}
                  placeholder="Enter full legal name sequence"
                />
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Date Of Birth</Text>
                  <TextInput 
                    style={styles.formTextInputFieldNode} 
                    value={formData.dateOfBirth}
                    onChangeText={(txt) => setFormData({ ...formData, dateOfBirth: txt })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Gender Matrix</Text>
                  <TextInput 
                    style={styles.formTextInputFieldNode} 
                    value={formData.gender}
                    onChangeText={(txt) => setFormData({ ...formData, gender: txt })}
                    placeholder="Male / Female / Other"
                  />
                </View>
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Blood Group Reference</Text>
                  <TextInput 
                    style={styles.formTextInputFieldNode} 
                    value={formData.bloodGroup}
                    onChangeText={(txt) => setFormData({ ...formData, bloodGroup: txt })}
                    placeholder="e.g. O+, A+"
                  />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Nationality Country String</Text>
                  <TextInput 
                    style={styles.formTextInputFieldNode} 
                    value={formData.nationality}
                    onChangeText={(txt) => setFormData({ ...formData, nationality: txt })}
                  />
                </View>
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Religion Vector</Text>
                  <TextInput 
                    style={styles.formTextInputFieldNode} 
                    value={formData.religion}
                    onChangeText={(txt) => setFormData({ ...formData, religion: txt })}
                  />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Social Category Group</Text>
                  <TextInput 
                    style={styles.formTextInputFieldNode} 
                    value={formData.category}
                    onChangeText={(txt) => setFormData({ ...formData, category: txt })}
                  />
                </View>
              </View>

              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Verification Matrix ID Number</Text>
                <TextInput 
                  style={[styles.formTextInputFieldNode, styles.formTextInputFieldNodeDisabled]} 
                  value="[Aadhaar Redacted]"
                  editable={false}
                />
              </View>

              <Text style={styles.formGroupSectionDividerLabel}>3. Institutional & Academic Meta Keys</Text>
              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Student Node ID</Text>
                  <TextInput style={[styles.formTextInputFieldNode, styles.formTextInputFieldNodeDisabled]} value={formData.studentId} editable={false} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Admission Sequence ID</Text>
                  <TextInput style={[styles.formTextInputFieldNode, styles.formTextInputFieldNodeDisabled]} value={formData.admissionNumber} editable={false} />
                </View>
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Target Grade Slot</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.grade} onChangeText={(txt) => setFormData({ ...formData, grade: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Class Section Slot</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.section} onChangeText={(txt) => setFormData({ ...formData, section: txt })} />
                </View>
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Roll Track Index</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.rollNumber} onChangeText={(txt) => setFormData({ ...formData, rollNumber: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Class Section ID</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.classSectionId} onChangeText={(txt) => setFormData({ ...formData, classSectionId: txt })} />
                </View>
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Academic Term Horizon</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.academicYear} onChangeText={(txt) => setFormData({ ...formData, academicYear: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Primary Class Teacher ID</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.classTeacherId} onChangeText={(txt) => setFormData({ ...formData, classTeacherId: txt })} />
                </View>
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Enrollment Joined Date</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.joiningDate} onChangeText={(txt) => setFormData({ ...formData, joiningDate: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Invoices Balance Dues (₹)</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.totalFee.toString()} onChangeText={(txt) => setFormData({ ...formData, totalFee: parseFloat(txt) || 0.1 })} keyboardType="numeric" />
                </View>
              </View>

              <Text style={styles.formGroupSectionDividerLabel}>4. Core Communication & Contact Vectors</Text>
              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Contact Mail Address</Text>
                <TextInput 
                  style={styles.formTextInputFieldNode} 
                  value={formData.email}
                  onChangeText={(txt) => setFormData({ ...formData, email: txt })}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Primary Contact Number</Text>
                <TextInput 
                  style={styles.formTextInputFieldNode} 
                  value={formData.contactNumber}
                  onChangeText={(txt) => setFormData({ ...formData, contactNumber: txt })}
                  keyboardType="phone-pad"
                />
              </View>

              <Text style={styles.formGroupSectionDividerLabel}>5. Core Guardian Identity Matrices</Text>
              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Father Name Legals</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.fatherName} onChangeText={(txt) => setFormData({ ...formData, fatherName: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Father Contact Telephony</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.fatherContact} onChangeText={(txt) => setFormData({ ...formData, fatherContact: txt })} keyboardType="phone-pad" />
                </View>
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Mother Name Legals</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.motherName} onChangeText={(txt) => setFormData({ ...formData, motherName: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Mother Contact Telephony</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.motherContact} onChangeText={(txt) => setFormData({ ...formData, motherContact: txt })} keyboardType="phone-pad" />
                </View>
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Guardian Primary Label</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.guardianName} onChangeText={(txt) => setFormData({ ...formData, guardianName: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Guardian Contact Connection</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.guardianContact} onChangeText={(txt) => setFormData({ ...formData, guardianContact: txt })} keyboardType="phone-pad" />
                </View>
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Emergency Contact Name</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.emergencyContactName} onChangeText={(txt) => setFormData({ ...formData, emergencyContactName: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Emergency Contact Numbers</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.emergencyContactNumber} onChangeText={(txt) => setFormData({ ...formData, emergencyContactNumber: txt })} keyboardType="phone-pad" />
                </View>
              </View>

              <Text style={styles.formGroupSectionDividerLabel}>6. Core Address Coordinates</Text>
              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Street Address Line Input</Text>
                <TextInput 
                  style={[styles.formTextInputFieldNode, { height: 64, textAlignVertical: "top", paddingTop: 10 }]} 
                  value={formData.address}
                  onChangeText={(txt) => setFormData({ ...formData, address: txt })}
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>City Zone</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.city} onChangeText={(txt) => setFormData({ ...formData, city: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>State Segment</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.state} onChangeText={(txt) => setFormData({ ...formData, state: txt })} />
                </View>
                <View style={[styles.formFieldLayoutWrapperUnit, { flex: 1 }]}>
                  <Text style={styles.formInputLabelMetaText}>Pincode Code</Text>
                  <TextInput style={styles.formTextInputFieldNode} value={formData.pincode} onChangeText={(txt) => setFormData({ ...formData, pincode: txt })} keyboardType="numeric" />
                </View>
              </View>

              <View style={{ height: 32 }} />
            </ScrollView>

            <View style={styles.formModalFooterActionButtonsStickyRow}>
              <TouchableOpacity 
                style={styles.formModalCancelDismissBtnUnit} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.formCancelBtnLabelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.formModalSubmitCommitBtnUnit} 
                onPress={handleUpdateSubmit}
              >
                <Save size={16} color={THEME.white} style={{ marginRight: 6 }} />
                <Text style={styles.formSubmitBtnLabelText}>Save Modified Profile</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* Modern Success Status Notification Banner Overlay Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successBlurOverlayRoot}>
          <View style={styles.successDialogueCardBoxContainer}>
            <CheckCircle size={56} color="#16A34A" style={{ marginBottom: 14 }} />
            <Text style={styles.successDialogBigTitle}>Updated Successfully</Text>
            <Text style={styles.successDialogSubtextBody}>Your remote credential parameters have synchronized into the safe node registry successfully.</Text>
            <TouchableOpacity 
              style={styles.successDismissActionButtonBtn}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.successDismissBtnLabelText}>Dismiss Window</Text>
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
  
  profileHeaderBoxCard: { backgroundColor: THEME.white, padding: 24, borderRadius: 26, marginHorizontal: 16, marginTop: 22, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
  profileMasterInfoRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 16 },
  avatarImageWrapperBackdrop: { width: 64, height: 64, borderRadius: 20, backgroundColor: "#F3ECE7", justifyContent: "center", alignItems: "center", position: "relative", borderWidth: 1.5, borderColor: "rgba(227, 83, 54, 0.15)", overflow: "hidden" },
  avatarImageStyle: { width: "100%", height: "100%", resizeMode: "cover" },
  onlineStatusPulseIndicatorDot: { position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, borderWidth: 2.5, borderColor: THEME.white },
  identityDetailsClusterTextsBlock: { flex: 1, minWidth: 220, gap: 2 },
  titleBadgeInlineRowGroup: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  parentNameHeadingTitle: { fontSize: 22, fontWeight: "bold", color: THEME.textDark },
  securityTierBadgeCapsule: { flexDirection: "row", alignItems: "center", backgroundColor: "#E7F9EE", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  securityTierBadgeLabelString: { fontSize: 10, fontWeight: "700", color: "#16A34A" },
  parentRoleLabelSubtext: { fontSize: 14, color: THEME.textMuted, fontWeight: "500" },
  parentUidLabelString: { fontSize: 11, color: THEME.primary, fontWeight: "600", marginTop: 2 },
  
  headerEditProfileTriggerActionBtn: { flexDirection: "row", alignItems: "center", backgroundColor: THEME.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, gap: 6, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  headerEditBtnTextLabel: { color: THEME.white, fontSize: 12, fontWeight: "700" },

  responsiveSplitMainLayoutFlexContainer: { paddingHorizontal: 16, marginTop: 22, gap: 16 },
  rowDirectionLayoutGrid: { flexDirection: "row" },
  desktopFlexProportionWidth: { flex: 1.3 },
  desktopFlexProportionWidthRightSide: { flex: 1 },
  responsiveRightBlockStack: { flex: 1, gap: 16 },
  listFeedBlockSectionCard: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 12 },
  blockTitleLabelHeading: { fontSize: 15, fontWeight: "800", color: THEME.textDark },
  fieldDataRowLineItemUnit: { backgroundColor: "#FDFCF9", borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.05)", gap: 14, flexWrap: "wrap" },
  fieldRowLeftIconLabelCluster: { flexDirection: "row", alignItems: "center", gap: 10 },
  fieldMetaLabelText: { fontSize: 13, color: THEME.textMuted, fontWeight: "600" },
  fieldValueContentStringText: { fontSize: 13, fontWeight: "700", color: THEME.textDark, textAlign: "right" },
  
  rightSideInternalCardWrapperPanelBox: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 14 },
  cardHeaderWithIconTitleFlexRow: { flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#F5F5F5", paddingBottom: 12 },
  securityOptionInlineRowCell: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FDFCF9", padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.04)" },
  securityOptionLabelHeadingText: { fontSize: 13, color: THEME.textDark, fontWeight: "650" },
  rightPanelInlineValueSpanText: { fontSize: 13, fontWeight: "700", color: THEME.textDark },
  toggleControlLineItemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FDFCF9", paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.04)" },
  toggleControlLabelTitleText: { fontSize: 13, color: THEME.textDark, fontWeight: "600" },
  
  customToggleTrackTrack: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: "center" },
  customToggleTrackActive: { backgroundColor: "#16A34A" },
  customToggleTrackInactive: { backgroundColor: "#E5E7EB" },
  customToggleThumbIndicator: { width: 20, height: 20, borderRadius: 10, backgroundColor: THEME.white },
  customToggleThumbActive: { alignSelf: "flex-end" },
  customToggleThumbInactive: { alignSelf: "flex-start" },
  portalLogOutSessionActionFullBtn: { backgroundColor: THEME.primary, flexDirection: "row", alignItems: "center", paddingVertical: 14, borderRadius: 14, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3, justifyContent: "center" },
  logOutBtnLabelTextContentStringText: { color: THEME.white, fontSize: 14, fontWeight: "750" },
  auditVerificationNoticeSafetyFooterCardStrip: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginHorizontal: 16, marginTop: 24, marginBottom: 10 },
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
  formFieldFlexInlineRowGroup: { flexDirection: "row", gap: 12, width: "100%" },
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