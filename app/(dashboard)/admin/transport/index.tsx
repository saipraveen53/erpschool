import { useAuth } from "@/app/contexts/AuthContext";
import { studentdashboardApi } from "@/app/utils/axiosInstance";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  CheckCircle,
  Clock,
  Compass,
  Plus,
  Save,
  ShieldCheck,
  UserPlus,
  X
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
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
  primary: "#0F1E36",       // Burnt Sienna Main
  background: "#FFFFFF",    // Beige Tint Base
  secondary: "#00BCD4",     // Pastel Salmon Accent
  darkAccent: "#00BCD4",    // Deep Sienna Brown
  white: "#FFFFFF",         
  textDark: "#2C1A14",      
  textMuted: "#7A6862",     
  successGlow: "#16A34A",   
  cardBorder: "rgba(160, 82, 45, 0.08)" 
};

export default function TransportRoutesManagementDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [addRouteModalVisible, setAddRouteModalVisible] = useState(false);
  const [assignDriverModalVisible, setAssignDriverModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Dynamic Data States
  const [routesPoolList, setRoutesPoolList] = useState<any[]>([]);
  const [driversPoolList, setDriversPoolList] = useState<any[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");

  // Controlled Add Form Input State Parameters
  const [routeFormData, setRouteFormData] = useState({
    routeName: "",
    pickupStartTime: "08:00 AM",
    dropStartTime: "04:00 PM",
    vehicleName: "School Bus 1",
    vehicleNumber: ""
  });

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  // --- Fixed Core Scroll Parallax Value Trackers & Interceptors Matrix ---
  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  // Re-defined layout metrics curves to intercept scrolling variables cleanly
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

  const getCellSize = () => {
    const maxAvailableWidth = isDesktop ? 280 : width - 40;
    return (maxAvailableWidth - (6 * 6) - (16 * 2)) / 7;
  };
  const cellSize = getCellSize();

  const fetchRoutesAndDriversTelemetry = async () => {
    try {
      setApiLoading(true);
      const routesResponse = await studentdashboardApi.get("/api/student/transport/route");
      setRoutesPoolList(routesResponse.data || []);

      const driversResponse = await studentdashboardApi.get("/api/driver/all");
      const driversData = driversResponse.data || [];
      setDriversPoolList(driversData);
      
      if (driversData.length > 0) {
        setSelectedDriverId(driversData[0].id);
      }
    } catch (err) {
      console.error("Error downloading remote transport logs networks matrix:", err);
      setRoutesPoolList([
        { routeId: "TRT2026002", routeName: "MIYAPUR", pickupStartTime: "07:30 AM", dropStartTime: "04:00 PM", vehicleName: "School Bus 1", vehicleNumber: "TS-09-EA-1234" },
        { routeId: "TRT2026004", routeName: "LINGAMPALLY", pickupStartTime: "07:30 AM", dropStartTime: "04:00 PM", vehicleName: "School Bus 2", vehicleNumber: "TG-02-EA-213" },
        { routeId: "TRT2026006", routeName: "Lb nagar", pickupStartTime: "8:00AM", dropStartTime: "9:00AM", vehicleName: "BUS", vehicleNumber: "TS05ER6789" }
      ]);

      setDriversPoolList([
        { id: "ACS-DRV-001", fullName: "driver4", experience: "9", address: "sec", licenseNo: "DL00567890", phoneNo: "582963471" },
        { id: "ACS-DRV-002", fullName: "sai", experience: "5", address: "hyd", licenseNo: "DL001122", phoneNo: "7894561233" }
      ]);
      setSelectedDriverId("ACS-DRV-001");
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutesAndDriversTelemetry();

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

  const handlePostRouteCommit = async () => {
    if (!routeFormData.routeName || !routeFormData.vehicleNumber) {
      alert("Please populate all transport network parameters inputs.");
      return;
    }

    try {
      setApiLoading(true);
      const postPayload = {
        routeName: routeFormData.routeName,
        pickupStartTime: routeFormData.pickupStartTime.replace(/\s+/g, ''),
        dropStartTime: routeFormData.dropStartTime.replace(/\s+/g, ''),
        vehicleName: routeFormData.vehicleName,
        vehicleNumber: routeFormData.vehicleNumber.toUpperCase().trim()
      };

      await studentdashboardApi.post("/api/student/transport/route", postPayload);
      setAddRouteModalVisible(false);
      setRouteFormData({ routeName: "", pickupStartTime: "08:00 AM", dropStartTime: "04:00 PM", vehicleName: "School Bus 1", vehicleNumber: "" });
      await fetchActiveRoutesTelemetry();
    } catch (err) {
      console.error("Error pushing route configuration layer upstream:", err);
    } finally {
      setApiLoading(false);
    }
  };

  const handleLaunchDriverAssignmentForm = (routeId: string) => {
    setSelectedRouteId(routeId);
    setAssignDriverModalVisible(true);
  };

  const handlePutDriverAssignmentCommit = async () => {
    if (!selectedRouteId || !selectedDriverId) {
      alert("Missing route context allocation identifiers.");
      return;
    }

    try {
      setApiLoading(true);
      await studentdashboardApi.put(
        `/api/student/transport/route/${selectedRouteId}/assign-driver?driverId=${selectedDriverId}`
      );
      setAssignDriverModalVisible(false);
      await fetchRoutesAndDriversTelemetry();
      setTimeout(() => setSuccessModalVisible(true), 350);
    } catch (err) {
      console.error("Error processing driver assignment allocation stream:", err);
    } finally {
      setApiLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoutesAndDriversTelemetry();
    setRefreshing(false);
  };

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}>
          <Svg height="350" width={width + 100} viewBox={`0 0 ${width + 100} 350`}>
            <Path d={`M0 130 C ${width / 3} 70, ${(2 * width) / 3} 190, ${width + 100} 110 L ${width + 100} 0 L 0 0 Z`} fill="rgba(227, 83, 54, 0.05)" />
            <Path d={`M0 250 C ${width / 4} 310, ${(3 * width) / 4} 170, ${width + 100} 230 L ${width + 100} 0 L 0 0 Z`} fill="rgba(160, 82, 45, 0.04)" />
          </Svg>
        </Animated.View>
      </View>

      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} /> 
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} /> 

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollYAnim } } }], { useNativeDriver: true })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
        contentContainerStyle={isDesktop ? styles.desktopCenter : null}
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          
          <View style={styles.pageHeaderBlockCard}>
            <View style={styles.headerLeftCluster}>
              <View style={styles.titleBadgeInlineRow}>
                <Text style={styles.pageTitleHeading}>Transport Logistics Feed</Text>
                <View style={styles.liveBroadcastBadge}>
                  <ShieldCheck size={12} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.liveBroadcastBadgeText}>Active Nodes</Text>
                </View>
              </View>
              <Text style={styles.pageSubtitleMuted}>Monitor institutional route paths index tracking, vehicle records allocation, and timing logs.</Text>
            </View>

            <TouchableOpacity style={styles.triggerFormAddRouteBtn} onPress={() => setAddRouteModalVisible(true)} activeOpacity={0.85}>
              <Plus size={16} color={THEME.white} style={{ marginRight: 4 }} />
              <Text style={styles.addBtnLabelTextContent}>Add New Route</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeadingTitle}>Registered Transit Paths Archive ({routesPoolList.length})</Text>
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            <View style={styles.listFeedBlockSectionCard}>
              
              {routesPoolList.map((routeItem, idx) => {
                const cleanRouteId = routeItem.routeId || `TRT2026${("00" + (idx + 1)).slice(-3)}`;
                return (
                  <View key={cleanRouteId} style={styles.transactionRowCardItemUnit}>
                    <View style={[styles.transactionHighlightVerticalStrip, { backgroundColor: THEME.primary }]} />
                    
                    <View style={styles.transactionCoreLeftContentCluster}>
                      <View style={styles.txMetaHeaderRowLine}>
                        <Compass size={15} color={THEME.primary} style={{ marginRight: 6 }} />
                        <Text style={styles.txIdStringLabelTextText}>ID: {cleanRouteId}</Text>
                        <Text style={styles.txDateMutedLabelString}>Vehicle: {routeItem.vehicleName || "BUS"}</Text>
                      </View>
                      
                      <Text style={styles.txMainTitleHeadingTextText}>Destination: {routeItem.routeName || "N/A"}</Text>
                      <Text style={styles.licensePlateLabelText}>License Registration: {routeItem.vehicleNumber || "N/A"}</Text>
                      
                      <View style={styles.innerTimingStripInfoBadgeRow}>
                        <View style={styles.miniTimeBadgeSlot}>
                          <Clock size={12} color={THEME.textMuted} />
                          <Text style={styles.miniTimeTextSpan}>Pickup: {routeItem.pickupStartTime}</Text>
                        </View>
                        <View style={styles.miniTimeBadgeSlot}>
                          <Clock size={12} color={THEME.textMuted} />
                          <Text style={styles.miniTimeTextSpan}>Drop: {routeItem.dropStartTime}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.inlineActionButtonsContainerUnitCell}>
                      <TouchableOpacity style={styles.addDriverTriggerActionInlineBtn} onPress={() => handleLaunchDriverAssignmentForm(cleanRouteId)}>
                        <UserPlus size={13} color={THEME.white} style={{ marginRight: 4 }} />
                        <Text style={styles.addDriverBtnLabelStringText}>Add Driver</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Form 1: Add Route Sheet Overlay Modal */}
      <Modal animationType="slide" transparent={true} visible={addRouteModalVisible} onRequestClose={() => setAddRouteModalVisible(false)}>
        <View style={styles.formModalRootWindowBackdropContainer}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.formModalSheetWrapperBodyCard, isDesktop && styles.desktopModalFormSizing]}>
            <View style={styles.formModalHeaderTopRowStickyBar}>
              <View style={styles.modalHeadingTitleFlexCluster}>
                <Plus size={18} color={THEME.primary} />
                <Text style={styles.modalFormCoreHeadingTitleText}>Create Route Parameters Record</Text>
              </View>
              <TouchableOpacity style={styles.closeModalFormCircularActionDismissBtn} onPress={() => setAddRouteModalVisible(false)}><X size={18} color={THEME.textDark} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalFormInternalScrollableBodyWorkspace} showsVerticalScrollIndicator={false}>
              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Route Destination Name Location</Text>
                <TextInput style={styles.formTextInputFieldNode} placeholder="e.g. Lb nagar" placeholderTextColor={THEME.textMuted} value={routeFormData.routeName} onChangeText={(txt) => setRouteFormData({ ...routeFormData, routeName: txt })} />
              </View>
              <View style={styles.formFieldFlexInlineRowGroup}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabelMetaText}>Pickup Start Time</Text>
                  <View style={styles.timePickerBackdropRowBox}>
                    <Clock size={14} color={THEME.primary} style={{ marginRight: 6 }} />
                    <TextInput style={styles.timePickerInputControlInline} value={routeFormData.pickupStartTime} onChangeText={(txt) => setRouteFormData({ ...routeFormData, pickupStartTime: txt })} placeholder="8:00AM" placeholderTextColor={THEME.textMuted} />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabelMetaText}>Drop Start Time</Text>
                  <View style={styles.timePickerBackdropRowBox}>
                    <Clock size={14} color={THEME.darkAccent} style={{ marginRight: 6 }} />
                    <TextInput style={styles.timePickerInputControlInline} value={routeFormData.dropStartTime} onChangeText={(txt) => setRouteFormData({ ...routeFormData, dropStartTime: txt })} placeholder="9:00AM" placeholderTextColor={THEME.textMuted} />
                  </View>
                </View>
              </View>
              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Vehicle Classification Model Name</Text>
                <TextInput style={styles.formTextInputFieldNode} placeholder="e.g. BUS" placeholderTextColor={THEME.textMuted} value={routeFormData.vehicleName} onChangeText={(txt) => setRouteFormData({ ...routeFormData, vehicleName: txt })} />
              </View>
              <View style={styles.formFieldLayoutWrapperUnit}>
                <Text style={styles.formInputLabelMetaText}>Vehicle Registration Code Plate Number</Text>
                <TextInput style={styles.formTextInputFieldNode} placeholder="e.g. TS05ER6789" placeholderTextColor={THEME.textMuted} value={routeFormData.vehicleNumber} onChangeText={(txt) => setRouteFormData({ ...routeFormData, vehicleNumber: txt })} autoCapitalize="characters" />
              </View>
            </ScrollView>
            <View style={styles.formModalFooterActionButtonsStickyRow}>
              <TouchableOpacity style={styles.formModalCancelDismissBtnUnit} onPress={() => setAddRouteModalVisible(false)}><Text style={styles.formCancelBtnLabelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.formModalSubmitCommitBtnUnit} onPress={handlePostRouteCommit}><Save size={16} color={THEME.white} style={{ marginRight: 6 }} /><Text style={styles.formSubmitBtnLabelText}>Save Path Record</Text></TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Form 2: Assign Driver Dropdown Sheet Overlay Modal */}
      <Modal animationType="slide" transparent={true} visible={assignDriverModalVisible} onRequestClose={() => setAssignDriverModalVisible(false)}>
        <View style={styles.formModalRootWindowBackdropContainer}>
          <View style={[styles.formModalSheetWrapperBodyCard, isDesktop && styles.desktopModalFormSizing, { height: "auto", minHeight: 280 }]}>
            <View style={styles.formModalHeaderTopRowStickyBar}>
              <View style={styles.modalHeadingTitleFlexCluster}>
                <UserPlus size={18} color={THEME.darkAccent} />
                <Text style={styles.modalFormCoreHeadingTitleText}>Assign Driver to Route ({selectedRouteId})</Text>
              </View>
              <TouchableOpacity style={styles.closeModalFormCircularActionDismissBtn} onPress={() => setAssignDriverModalVisible(false)}><X size={18} color={THEME.textDark} /></TouchableOpacity>
            </View>

            <View style={[styles.formFieldLayoutWrapperUnit, { marginTop: 20, marginBottom: 24 }]}>
              <Text style={styles.formInputLabelMetaText}>Select Available Fleet Driver Node</Text>
              <View style={styles.pickerWrapperBackdropFieldBox}>
                <Picker
                  selectedValue={selectedDriverId}
                  onValueChange={(itemValue) => setSelectedDriverId(itemValue)}
                  style={styles.dropdownElementControlPicker}
                  dropdownIconColor={THEME.textDark}
                >
                  {driversPoolList.map((drv) => (
                    <Picker.Item key={drv.id} label={`${drv.fullName} (Exp: ${drv.experience} yrs | Lic: ${drv.licenseNo})`} value={drv.id} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formModalFooterActionButtonsStickyRow}>
              <TouchableOpacity style={styles.formModalCancelDismissBtnUnit} onPress={() => setAssignDriverModalVisible(false)}><Text style={styles.formCancelBtnLabelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.formModalSubmitCommitBtnUnit, { backgroundColor: THEME.darkAccent }]} onPress={handlePutDriverAssignmentCommit}>
                <Save size={16} color={THEME.white} style={{ marginRight: 6 }} /><Text style={styles.formSubmitBtnLabelText}>Assign Personnel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Notification Acknowledgment Modal Window */}
      <Modal animationType="fade" transparent={true} visible={successModalVisible} onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.successBlurOverlayRoot}>
          <View style={styles.successDialogueCardBoxContainer}>
            <CheckCircle size={56} color={THEME.successGlow} style={{ marginBottom: 14 }} />
            <Text style={styles.successDialogBigTitle}>Added Successfully</Text>
            <Text style={styles.successDialogSubtextBody}>Fleet operator context parameter has linked onto the target transit route row index.</Text>
            <TouchableOpacity style={styles.successDismissActionButtonBtn} onPress={() => setSuccessModalVisible(false)}>
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
  fluidBackgroundContainer: { position: "absolute", top: 0, left: -20, right: 0, zIndex: -2, opacity: 0.85 },
  orb3DOne: { position: "absolute", width: 330, height: 330, borderRadius: 165, backgroundColor: "rgba(227, 83, 54, 0.06)", top: 140, right: -40, zIndex: -1 },
  orb3DTwo: { position: "absolute", width: 390, height: 390, borderRadius: 195, backgroundColor: "rgba(160, 82, 45, 0.04)", bottom: 80, left: -110, zIndex: -1 },
  desktopCenter: { alignItems: "center", justifyContent: "center" },
  mainWrapper: { width: "100%", paddingBottom: 40 },
  desktopWidth: { maxWidth: 1140, paddingHorizontal: 20 },
  pageHeaderBlockCard: { backgroundColor: THEME.white, padding: 22, borderRadius: 26, marginHorizontal: 16, marginTop: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
  headerLeftCluster: { flex: 1, minWidth: 280 },
  titleBadgeInlineRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 },
  pageTitleHeading: { fontSize: 24, fontWeight: "bold", color: THEME.textDark },
  liveBroadcastBadge: { flexDirection: "row", alignItems: "center", backgroundColor: THEME.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  liveBroadcastBadgeText: { color: THEME.white, fontSize: 11, fontWeight: "700" },
  pageSubtitleMuted: { fontSize: 13, color: THEME.textMuted, marginTop: 4, lineHeight: 18 },
  triggerFormAddRouteBtn: { backgroundColor: THEME.textDark, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  addBtnLabelTextContent: { color: THEME.white, fontSize: 13, fontWeight: "750" },
  sectionHeadingTitle: { fontSize: 18, fontWeight: "700", color: THEME.textDark, marginHorizontal: 20, marginTop: 30, marginBottom: 14 },
  responsiveSplitMainLayoutFlexContainer: { paddingHorizontal: 16, marginTop: 10, gap: 16 },
  rowDirectionLayoutGrid: { flexDirection: "row" },
  listFeedBlockSectionCard: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 12, width: "100%" },
  transactionRowCardItemUnit: { backgroundColor: "#FDFCF9", borderRadius: 18, flexDirection: "row", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.05)", minHeight: 85, marginBottom: 12, paddingRight: 14 },
  transactionHighlightVerticalStrip: { width: 5, height: "100%" },
  transactionCoreLeftContentCluster: { flex: 1, paddingHorizontal: 14, gap: 4, paddingVertical: 12 },
  txMetaHeaderRowLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  txIdStringLabelTextText: { fontSize: 11, fontWeight: "700", color: THEME.textMuted },
  txDateMutedLabelString: { fontSize: 11, color: THEME.primary, fontWeight: "700", marginLeft: "auto" },
  txMainTitleHeadingTextText: { fontSize: 15, fontWeight: "700", color: THEME.textDark },
  licensePlateLabelText: { fontSize: 12, color: THEME.textMuted, fontWeight: "600" },
  innerTimingStripInfoBadgeRow: { flexDirection: "row", gap: 16, marginTop: 4, borderTopWidth: 1, borderTopColor: "#F5F5F5", paddingTop: 8 },
  miniTimeBadgeSlot: { flexDirection: "row", alignItems: "center", gap: 4 },
  miniTimeTextSpan: { fontSize: 12, fontWeight: "700", color: THEME.textDark },
  fallbackEmptyLogsPlaceholderMutedText: { fontSize: 12, color: THEME.textMuted, fontStyle: "italic", textAlign: "center", paddingVertical: 12 },
  inlineActionButtonsContainerUnitCell: { justifyContent: "center" },
  addDriverTriggerActionInlineBtn: { flexDirection: "row", alignItems: "center", backgroundColor: THEME.darkAccent, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  addDriverBtnLabelStringText: { color: THEME.white, fontSize: 11, fontWeight: "750" },
  formModalRootWindowBackdropContainer: { flex: 1, backgroundColor: "rgba(44, 26, 20, 0.5)", justifyContent: "flex-end", alignItems: "center" },
  formModalSheetWrapperBodyCard: { backgroundColor: THEME.white, width: "100%", height: "88%", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 20, overflow: "hidden" },
  desktopModalFormSizing: { maxWidth: 540, alignSelf: "center", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, bottom: "10%" },
  formModalHeaderTopRowStickyBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "rgba(44,26,20,0.08)" },
  modalHeadingTitleFlexCluster: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalFormCoreHeadingTitleText: { fontSize: 16, fontWeight: "800", color: THEME.textDark },
  closeModalFormCircularActionDismissBtn: { padding: 6, backgroundColor: "rgba(44,26,20,0.05)", borderRadius: 10 },
  modalFormInternalScrollableBodyWorkspace: { marginTop: 14, maxHeight: 350 },
  formFieldLayoutWrapperUnit: { marginBottom: 12, width: "100%" },
  formFieldFlexInlineRowGroup: { flexDirection: "row", gap: 12, width: "100%", marginBottom: 12 },
  formInputLabelMetaText: { fontSize: 12, fontWeight: "600", color: THEME.textMuted, marginBottom: 4 },
  formTextInputFieldNode: { backgroundColor: THEME.background, height: 44, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(44,26,20,0.12)", color: THEME.textDark, fontSize: 14, fontWeight: "600" },
  timePickerBackdropRowBox: { backgroundColor: THEME.background, height: 44, borderRadius: 12, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(44,26,20,0.12)" },
  timePickerInputControlInline: { flex: 1, color: THEME.textDark, fontSize: 13, fontWeight: "700" },
  pickerWrapperBackdropFieldBox: { backgroundColor: THEME.background, height: 44, borderRadius: 12, borderWidth: 1, borderColor: "rgba(44,26,20,0.12)", justifyContent: "center", overflow: "hidden" },
  dropdownElementControlPicker: { height: 44, color: THEME.textDark },
  formModalFooterActionButtonsStickyRow: { flexDirection: "row", gap: 12, borderTopWidth: 1, borderTopColor: "rgba(44,26,20,0.08)", paddingTop: 14, justifyContent: "flex-end" },
  formModalCancelDismissBtnUnit: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, backgroundColor: "rgba(44, 26, 20, 0.05)" },
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