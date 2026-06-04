import { useAuth } from "@/app/contexts/AuthContext";
import { studentdashboardApi } from "@/app/utils/axiosInstance";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Bus,
  Compass,
  Info,
  MapPin,
  Moon,
  Phone,
  Sun,
  User
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
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
  successGlow: "#16A34A",   
  cardBorder: "rgba(160, 82, 45, 0.08)" 
};

export default function StudentTransportDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
  // Real-time Transport States
  const [transportData, setTransportData] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(true);

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  const fetchTransportTelemetryData = async () => {
    try {
      setApiLoading(true);
      const studentId = user?.username || "STU2026004";
      const response = await studentdashboardApi.get(`/api/student/transport/${studentId}`);
      setTransportData(response.data);
    } catch (err) {
      console.error("Error retrieving student dynamic transport routing profiles:", err);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportTelemetryData();

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

  const handleDialDriverPhone = () => {
    if (!transportData?.driverPhone) return;
    Linking.openURL(`tel:${transportData.driverPhone}`).catch(() => {
      alert("Dialer component initialized failure on this node viewport.");
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransportTelemetryData();
    setRefreshing(false);
  };

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20],
  });

  if (apiLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingText}>Synchronizing Transit Fleet Telemetries Matrix...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Background Layer Curved Wave Arcs Layout Vector Canvas */}
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

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={isDesktop ? styles.desktopCenter : null}
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          
          <Text style={styles.dashboardTitleHeadingText}>My Transport</Text>

          {/* Core Responsive Split Container */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            
            {/* Left Hand Split: Assigned Route Box & Schedule Timelines Card block */}
            <View style={styles.splitLeftColumnBlock}>
              
              {/* Assigned Route Header Card Component */}
              <View style={styles.routeHeaderInfoBoxCard}>
                <View style={styles.routeIconBoxCircleBackdrop}>
                  <Compass size={22} color={THEME.primary} />
                </View>
                <View style={styles.routeDetailsTextCluster}>
                  <Text style={styles.routeMutedMetaLabelText}>ASSIGNED ROUTE</Text>
                  <Text style={styles.routeMainHeadingTitleText}>{transportData?.routeName || "Uppal - Himayatnagar"}</Text>
                </View>
              </View>

              {/* Stop Schedule Matrix Group Card Component */}
              <View style={styles.stopScheduleDetailsWidgetCardBox}>
                <Text style={styles.blockInternalTitleLabelHeadingText}>My Stop Schedule</Text>
                
                <View style={styles.stopDetailsAlertRowLineItemUnit}>
                  <MapPin size={16} color={THEME.primary} style={{ marginTop: 2 }} />
                  <View style={styles.stopTextMetaGroupCluster}>
                    <Text style={styles.stopIndicatorLineLabelTextString}><Text style={{ fontWeight: "bold" }}>Pickup: </Text>{transportData?.pickupStop || "Uppal X roads"}</Text>
                    <Text style={styles.stopIndicatorLineLabelTextString}><Text style={{ fontWeight: "bold" }}>Drop: </Text>{transportData?.dropStop || "Uppal X roads"}</Text>
                  </View>
                </View>

                {/* Inline Clock Matrix Subrow */}
                <View style={styles.timesBadgesInlineRowFlexContainer}>
                  <View style={styles.timeBadgeChipItemBlockUnit}>
                    <Text style={styles.timeBadgeLabelMutedText}>Pickup Time</Text>
                    <View style={styles.timeBadgeValueBubbleRow}>
                      <Sun size={14} color="#F59E0B" style={{ marginRight: 6 }} />
                      <Text style={styles.timeBadgeValueStringText}>{transportData?.pickupTime || "08:15 AM"}</Text>
                    </View>
                  </View>

                  <View style={styles.timeBadgeChipItemBlockUnit}>
                    <Text style={styles.timeBadgeLabelMutedText}>Drop Time</Text>
                    <View style={styles.timeBadgeValueBubbleRow}>
                      <Moon size={14} color={THEME.darkAccent} style={{ marginRight: 6 }} />
                      <Text style={styles.timeBadgeValueStringText}>{transportData?.dropTime || "04:30 PM"}</Text>
                    </View>
                  </View>
                </View>

              </View>
            </View>

            {/* Right Hand Split: Fleet Vehicle Specifications & Drivers Verification Profile Cards */}
            <View style={styles.splitRightColumnBlock}>
              
              {/* Vehicle Specifications Information Surface Panel Box */}
              <View style={styles.rightSideInternalCardWrapperPanelBox}>
                <Text style={styles.rightSideWidgetCardLabelHeadingText}>Vehicle Info</Text>
                <View style={styles.vehicleDataRowLineItemUnit}>
                  <View style={styles.vehicleIconSquareBackdrop}>
                    <Bus size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.vehicleMetaDetailsBlock}>
                    <Text style={styles.vehicleMainHeadingTitleText}>{transportData?.vehicleName || "TOYOTA"}</Text>
                    <Text style={styles.vehicleSubtextMutedLicenseCode}>{transportData?.vehicleNumber || "TS05CN1317"}</Text>
                  </View>
                </View>
              </View>

              {/* Drivers Operations Connection Surface Panel Box */}
              <View style={styles.rightSideInternalCardWrapperPanelBox}>
                <Text style={styles.rightSideWidgetCardLabelHeadingText}>Driver Info</Text>
                <View style={styles.personnelDataRowContainerItem}>
                  <View style={styles.personnelAvatarPlaceholderCircleBox}>
                    <User size={20} color={THEME.textMuted} />
                  </View>
                  <View style={styles.personnelMetaDetailsTextFlexContainer}>
                    <Text style={styles.personnelMainNameTypographyTitle}>{transportData?.driverName || "Ramesh"}</Text>
                    <Text style={styles.personnelSubtextLicenseRegPlateCode}>{transportData?.driverPhone || "9989898989"}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.personnelCommunicationCallActionButton} 
                    onPress={handleDialDriverPhone}
                    activeOpacity={0.75}
                  >
                    <Phone size={14} color={THEME.white} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Financial Accounts Fee Status Ticker Strip Capsule */}
              <View style={[styles.rightSideInternalCardWrapperPanelBox, styles.feeStatusRowLayoutBadgeBox, { borderLeftColor: transportData?.feeStatus?.toLowerCase() === "paid" ? THEME.successGlow : THEME.secondary }]}>
                <Text style={styles.feeStatusMainTitleHeadingLabelText}>Transport Fee Status</Text>
                <View style={[styles.feeStatusBadgeCapsule, transportData?.feeStatus?.toLowerCase() === "paid" ? styles.badgeColorPaid : styles.badgeColorPending]}>
                  <Text style={[styles.feeStatusTextStringValue, transportData?.feeStatus?.toLowerCase() === "paid" ? { color: THEME.successGlow } : { color: THEME.secondary }]}>
                    {(transportData?.feeStatus || "PENDING").toUpperCase()}
                  </Text>
                </View>
              </View>

            </View>

          </View>

          {/* System Audited Verification Note Footer Ticker */}
          <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}>
            <Info size={13} color={THEME.darkAccent} style={{ marginTop: 2 }} />
            <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}>
              Fleet coordination tracks are dynamically signed. Internal cloud nodes process transit latency loops automatically across active administrative servers.
            </Text>
          </View>

        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, position: "relative" },
  fluidBackgroundContainer: { position: "absolute", top: 0, left: -20, right: 0, zIndex: -2, opacity: 0.85 },
  desktopCenter: { alignItems: "center", justifyContent: "center" },
  mainWrapper: { width: "100%", paddingBottom: 40 },
  desktopWidth: { maxWidth: 1140, paddingHorizontal: 20 },
  
  dashboardTitleHeadingText: { fontSize: 22, fontWeight: "bold", color: THEME.textDark, marginHorizontal: 20, marginTop: 24, marginBottom: 14 },
  
  responsiveSplitMainLayoutFlexContainer: { paddingHorizontal: 16, marginTop: 10, gap: 16 },
  rowDirectionLayoutGrid: { flexDirection: "row" },
  splitLeftColumnBlock: { flex: 1.4, width: "100%", gap: 14 },
  splitRightColumnBlock: { flex: 1, width: "100%", gap: 14 },

  // --- Assigned Route Svg Card Blocks ---
  routeHeaderInfoBoxCard: { backgroundColor: THEME.white, padding: 20, borderRadius: 22, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, elevation: 1 },
  routeIconBoxCircleBackdrop: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF2EF", justifyContent: "center", alignItems: "center" },
  routeDetailsTextCluster: { gap: 2 },
  routeMutedMetaLabelText: { fontSize: 10, fontWeight: "700", color: THEME.textMuted, letterSpacing: 0.5 },
  routeMainHeadingTitleText: { fontSize: 16, fontWeight: "800", color: THEME.textDark },

  // --- Stop Schedule Main Card Content Blocks ---
  stopScheduleDetailsWidgetCardBox: { backgroundColor: THEME.white, padding: 20, borderRadius: 24, shadowColor: THEME.darkAccent, shadowOpacity: 0.02, elevation: 1 },
  blockInternalTitleLabelHeadingText: { fontSize: 15, fontWeight: "800", color: THEME.textDark, marginBottom: 14 },
  stopDetailsAlertRowLineItemUnit: { backgroundColor: "#FFF8F5", borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 12, borderWidth: 1, borderColor: THEME.cardBorder },
  stopTextMetaGroupCluster: { flex: 1, gap: 4 },
  stopIndicatorLineLabelTextString: { fontSize: 13, color: THEME.textDark, lineHeight: 18 },
  
  // --- Inner Time Grid Chips Elements ---
  timesBadgesInlineRowFlexContainer: { flexDirection: "row", gap: 12, marginTop: 16, borderTopWidth: 1, borderTopColor: "#F5F5F5", paddingTop: 14 },
  timeBadgeChipItemBlockUnit: { flex: 1, gap: 4 },
  timeBadgeLabelMutedText: { fontSize: 11, color: THEME.textMuted, fontWeight: "600", textAlign: "center" },
  timeBadgeValueBubbleRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FAF8F5", height: 38, borderRadius: 12, borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.04)" },
  timeBadgeValueStringText: { fontSize: 13, fontWeight: "700", color: THEME.textDark },

  // --- Right Side Panels Widgets Layout Matrices ---
  rightSideInternalCardWrapperPanelBox: { backgroundColor: THEME.white, padding: 18, borderRadius: 22, borderWidth: 1, borderColor: THEME.cardBorder, shadowColor: THEME.darkAccent, shadowOpacity: 0.02, elevation: 1 },
  rightSideWidgetCardLabelHeadingText: { fontSize: 13, fontWeight: "700", color: THEME.textMuted, marginBottom: 10 },
  
  vehicleDataRowLineItemUnit: { flexDirection: "row", alignItems: "center", gap: 12 },
  vehicleIconSquareBackdrop: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#EBF3FF", justifyContent: "center", alignItems: "center" },
  vehicleMetaDetailsBlock: { gap: 2 },
  vehicleMainHeadingTitleText: { fontSize: 15, fontWeight: "800", color: THEME.textDark },
  vehicleSubtextMutedLicenseCode: { fontSize: 11, color: THEME.textMuted, fontWeight: "600" },

  personnelDataRowContainerItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#FAF8F5", padding: 10, borderRadius: 14, borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.04)" },
  personnelAvatarPlaceholderCircleBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#F3ECE7", justifyContent: "center", alignItems: "center" },
  personnelMetaDetailsTextFlexContainer: { flex: 1, marginLeft: 12 },
  personnelMainNameTypographyTitle: { fontSize: 14, fontWeight: "700", color: THEME.textDark },
  personnelSubtextLicenseRegPlateCode: { fontSize: 12, color: THEME.textMuted, marginTop: 1 },
  personnelCommunicationCallActionButton: { width: 32, height: 32, borderRadius: 10, backgroundColor: THEME.successGlow, justifyContent: "center", alignItems: "center" },

  // --- Fee Status Badge Block Component Rows ---
  feeStatusRowLayoutBadgeBox: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderLeftWidth: 4 },
  feeStatusMainTitleHeadingLabelText: { fontSize: 14, fontWeight: "700", color: THEME.textDark },
  feeStatusBadgeCapsule: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  badgeColorPending: { backgroundColor: "#FDF0F1" },
  badgeColorPaid: { backgroundColor: "#E7F9EE" },
  feeStatusTextStringValue: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },

  auditVerificationNoticeSafetyFooterCardStrip: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginHorizontal: 16, marginTop: 24, marginBottom: 10 },
  auditVerificationNoticeSafetyFooterCardTextText: { fontSize: 11, color: THEME.textMuted, lineHeight: 15, flex: 1 }
});