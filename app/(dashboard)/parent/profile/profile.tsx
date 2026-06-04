 
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Bell,
  ChevronRight,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  User,
  Users
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";


const THEME = {
  primary: "#E35336",       // Burnt Sienna Main[cite: 22]
  background: "#F5F5DC",    // Beige Tint Base[cite: 22]
  secondary: "#F44460",     // Pastel Salmon Accent[cite: 22]
  darkAccent: "#A0522D",    // Deep Sienna Brown[cite: 22]
  white: "#FFFFFF",         //[cite: 22]
  textDark: "#2C1A14",      //[cite: 22]
  textMuted: "#7A6862",      //[cite: 22]
  glassBg: "rgba(255, 255, 255, 0.76)", //[cite: 22]
};

const parentProfileData = {
  uid: "PAR-9041",
  name: "Rajesh Sharma",
  email: "rajesh.sharma@gmail.com",
  phone: "+91 98765 43210",
  address: "Plot No. 42, Silicon Valley, Madhapur, Hyderabad, Telangana - 500081",
  relation: "Father / Primary Guardian",
  linkedChildrenCount: 2,
  securityLevel: "Tier 1 Verified",
};

export default function ParentProfileDashboard() {
  const router = useRouter(); //[cite: 22]
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false); //[cite: 22]
  const [smsToggle, setSmsToggle] = useState(true);
  const [emailToggle, setEmailToggle] = useState(true);

  const { width } = Dimensions.get("window"); //[cite: 22]
  const isDesktop = width > 768; //[cite: 22]

  // 3D Matrix & Background Parallax Layer Transform Systems[cite: 22]
  const scrollYAnim = useRef(new Animated.Value(0)).current; //[cite: 22]
  const fadeAnim = useRef(new Animated.Value(0)).current; //[cite: 22]
  const slideAnim = useRef(new Animated.Value(45)).current; //[cite: 22]
  const fluidMoveAnim = useRef(new Animated.Value(0)).current; //[cite: 22]

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }), //[cite: 22]
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }), //[cite: 22]
    ]).start();

    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 16000, //[cite: 22]
        easing: Easing.inOut(Easing.sin), //[cite: 22]
        useNativeDriver: true, //[cite: 22]
      })
    ).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true); //[cite: 22]
    setTimeout(() => setRefreshing(false), 1000); //[cite: 22]
  };

  // Interpolation calculations for real-time 3D parallax manually driven layout shifting[cite: 22]
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [40, 0, -85], //[cite: 22]
    extrapolate: "clamp", //[cite: 22]
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [-25, 0, 60], //[cite: 22]
    extrapolate: "clamp", //[cite: 22]
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20], //[cite: 22]
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}> {/*[cite: 22] */}
      <StatusBar style="dark" /> {/*[cite: 22] */}

      {/* SVG Background Curved Wave Arcs Layout Vector Canvas[cite: 22] */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none"> {/*[cite: 22] */}
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}> {/*[cite: 22] */}
          <Svg height="350" width={width + 100} viewBox={`0 0 ${width + 100} 350`}> {/*[cite: 22] */}
            <Path
              d={`M0 130 C ${width / 3} 70, ${(2 * width) / 3} 190, ${width + 100} 110 L ${width + 100} 0 L 0 0 Z`} //[cite: 22]
              fill="rgba(227, 83, 54, 0.05)" //[cite: 22]
            />
            <Path
              d={`M0 250 C ${width / 4} 310, ${(3 * width) / 4} 170, ${width + 100} 230 L ${width + 100} 0 L 0 0 Z`} //[cite: 22]
              fill="rgba(160, 82, 45, 0.04)" //[cite: 22]
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Floating Space Blurred Parallax Glassmorphism Orbs[cite: 22] */}
      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} /> {/*[cite: 22] */}
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} /> {/*[cite: 22] */}

      {/* PURE HAND-DRIVEN SCROLL ONLY: Auto-scroll metrics are entirely disabled here[cite: 22] */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} //[cite: 22]
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }], //[cite: 22]
          { useNativeDriver: true } //[cite: 22]
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} //[cite: 22]
        contentContainerStyle={isDesktop ? styles.desktopCenter : null} //[cite: 22]
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}> {/*[cite: 22] */}
          
          {/* Top 3D Profile Frame Layout Branding Block Panel */}
          <Animated.View style={[styles.profileHeaderBoxCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.profileMasterInfoRow}>
              
              <View style={styles.avatarImageWrapperBackdrop}>
                <User size={32} color={THEME.darkAccent} />
                <View style={styles.onlineStatusPulseIndicatorDot} />
              </View>

              <View style={styles.identityDetailsClusterTextsBlock}>
                <View style={styles.titleBadgeInlineRowGroup}>
                  <Text style={styles.parentNameHeadingTitle}>{parentProfileData.name}</Text>
                  <View style={styles.securityTierBadgeCapsule}>
                    <ShieldCheck size={12} color="#16A34A" style={{ marginRight: 4 }} />
                    <Text style={styles.securityTierBadgeLabelString}>{parentProfileData.securityLevel}</Text>
                  </View>
                </View>
                <Text style={styles.parentRoleLabelSubtext}>{parentProfileData.relation}</Text>
                <Text style={styles.parentUidLabelString}>Account Reference Matrix ID: {parentProfileData.uid}</Text>
              </View>

              <View style={styles.linkedChildrenMetricsBoxUnit}>
                <Users size={18} color={THEME.primary} />
                <Text style={styles.linkedChildrenCountBigNumber}>{parentProfileData.linkedChildrenCount}</Text>
                <Text style={styles.linkedChildrenMutedSubtext}>Linked Kids</Text>
              </View>

            </View>
          </Animated.View>

          {/* Split Screen Responsive Grid Layout Mappings (Desktop Double Panels / Mobile Stacks)[cite: 22] */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}> {/*[cite: 22] */}
            
            {/* Left Box Split Window Panel: Personal Account Field Ledgers */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}> {/*[cite: 22] */}
              <Text style={styles.blockTitleLabelHeading}>Personal Identity Registration Logs</Text>
              
              <View style={styles.fieldDataRowLineItemUnit}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <Mail size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Registered Email Address:</Text>
                </View>
                <Text style={styles.fieldValueContentStringText}>{parentProfileData.email}</Text>
              </View>

              <View style={styles.fieldDataRowLineItemUnit}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <Phone size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Primary Telephony Contact:</Text>
                </View>
                <Text style={styles.fieldValueContentStringText}>{parentProfileData.phone}</Text>
              </View>

              <View style={[styles.fieldDataRowLineItemUnit, { flexDirection: "column", alignItems: "flex-start", gap: 6 }]}>
                <View style={styles.fieldRowLeftIconLabelCluster}>
                  <MapPin size={16} color={THEME.primary} />
                  <Text style={styles.fieldMetaLabelText}>Residential Communication Address:</Text>
                </View>
                <Text style={[styles.fieldValueContentStringText, { textAlign: "left", lineHeight: 18, marginTop: 2 }]}>
                  {parentProfileData.address}
                </Text>
              </View>

              <TouchableOpacity style={styles.secondaryFormActionTriggerBtn} activeOpacity={0.75}>
                <Settings size={14} color={THEME.textDark} style={{ marginRight: 6 }} />
                <Text style={styles.secondaryActionBtnLabelTextContent}>Request Information Modification</Text>
              </TouchableOpacity>
            </View>

            {/* Right Box Split Window Panel: Portal Configurations & Security Mappings */}
            <View style={[styles.responsiveRightBlockStack, isDesktop && styles.desktopFlexProportionWidthRightSide]}>
              
              {/* Security Credentials Parameters Box Panel */}
              <View style={styles.rightSideInternalCardWrapperPanelBox}>
                <View style={styles.cardHeaderWithIconTitleFlexRow}>
                  <Lock size={16} color={THEME.darkAccent} />
                  <Text style={styles.blockTitleLabelHeading}>Security & Cryptography Tokens</Text>
                </View>
                
                <TouchableOpacity style={styles.securityOptionInlineRowCell} activeOpacity={0.7}>
                  <Text style={styles.securityOptionLabelHeadingText}>Modify Portal Access Password</Text>
                  <ChevronRight size={14} color={THEME.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.securityOptionInlineRowCell} activeOpacity={0.7}>
                  <Text style={styles.securityOptionLabelHeadingText}>Setup Biometric Node Authentication</Text>
                  <ChevronRight size={14} color={THEME.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Broadcast Notification Configurations Control Toggles Box Panel */}
              <View style={styles.rightSideInternalCardWrapperPanelBox}>
                <View style={styles.cardHeaderWithIconTitleFlexRow}>
                  <Bell size={16} color={THEME.primary} />
                  <Text style={styles.blockTitleLabelHeading}>Broadcast Push Configuration Controls</Text>
                </View>
                
                <View style={styles.toggleControlLineItemRow}>
                  <Text style={styles.toggleControlLabelTitleText}>Real-time SMS Telemetry Gateways</Text>
                  <TouchableOpacity 
                    style={[styles.customToggleTrackTrack, smsToggle ? styles.customToggleTrackActive : styles.customToggleTrackInactive]}
                    onPress={() => setSmsToggle(!smsToggle)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.customToggleThumbIndicator, smsToggle ? styles.customToggleThumbActive : styles.customToggleThumbInactive]} />
                  </TouchableOpacity>
                </View>

                <View style={styles.toggleControlLineItemRow}>
                  <Text style={styles.toggleControlLabelTitleText}>Automated Term Invoices Email Sync</Text>
                  <TouchableOpacity 
                    style={[styles.customToggleTrackTrack, emailToggle ? styles.customToggleTrackActive : styles.customToggleTrackInactive]}
                    onPress={() => setEmailToggle(!emailToggle)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.customToggleThumbIndicator, emailToggle ? styles.customToggleThumbActive : styles.customToggleThumbInactive]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Portal Session Sign Out Call Button */}
              <TouchableOpacity style={styles.portalLogOutSessionActionFullBtn} onPress={() => logout?.()} activeOpacity={0.85}>
                <LogOut size={16} color={THEME.white} style={{ marginRight: 6 }} />
                <Text style={styles.logOutBtnLabelTextContentStringText}>Terminate Portal Session</Text>
              </TouchableOpacity>

            </View>

          </View>

          {/* Secure Audit Verification Note Footer Ticker */}
          <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}> {/*[cite: 27] */}
            <Info size={13} color={THEME.darkAccent} /> {/*[cite: 27] */}
            <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}> {/*[cite: 27] */}
              Parent profiling account matrix keys are dynamically tokenized and synchronized across local administrative architecture safe nodes. All database requests follow standard privacy criteria regulations.
            </Text>
          </View>

        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.background, //[cite: 27]
    position: "relative", //[cite: 27]
  },
  fluidBackgroundContainer: { //[cite: 27]
    position: "absolute", //[cite: 27]
    top: 0, //[cite: 27]
    left: -20, //[cite: 27]
    right: 0, //[cite: 27]
    zIndex: -2, //[cite: 27]
    opacity: 0.85, //[cite: 27]
  },
  orb3DOne: { //[cite: 27]
    position: "absolute", //[cite: 27]
    width: 330, //[cite: 27]
    height: 330, //[cite: 27]
    borderRadius: 165, //[cite: 27]
    backgroundColor: "rgba(227, 83, 54, 0.06)", //[cite: 27]
    top: 140, //[cite: 27]
    right: -40, //[cite: 27]
    zIndex: -1, //[cite: 27]
  },
  orb3DTwo: { //[cite: 27]
    position: "absolute", //[cite: 27]
    width: 390, //[cite: 27]
    height: 390, //[cite: 27]
    borderRadius: 195, //[cite: 27]
    backgroundColor: "rgba(160, 82, 45, 0.04)", //[cite: 27]
    bottom: 80, //[cite: 27]
    left: -110, //[cite: 27]
    zIndex: -1, //[cite: 27]
  },
  desktopCenter: { //[cite: 27]
    alignItems: "center", //[cite: 27]
    justifyContent: "center", //[cite: 27]
  },
  mainWrapper: { //[cite: 27]
    width: "100%", //[cite: 27]
    paddingBottom: 40, //[cite: 27]
  },
  desktopWidth: { //[cite: 27]
    maxWidth: 1140, //[cite: 27]
    paddingHorizontal: 20, //[cite: 27]
  },
  profileHeaderBoxCard: {
    backgroundColor: THEME.white,
    padding: 24,
    borderRadius: 26,
    marginHorizontal: 16,
    marginTop: 22,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  profileMasterInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  avatarImageWrapperBackdrop: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#F3ECE7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1.5,
    borderColor: "rgba(227, 83, 54, 0.15)",
  },
  onlineStatusPulseIndicatorDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#16A34A",
    borderWidth: 2.5,
    borderColor: THEME.white,
  },
  identityDetailsClusterTextsBlock: {
    flex: 1,
    minWidth: 220,
    gap: 2,
  },
  titleBadgeInlineRowGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  parentNameHeadingTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  securityTierBadgeCapsule: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F9EE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  securityTierBadgeLabelString: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },
  parentRoleLabelSubtext: {
    fontSize: 14,
    color: THEME.textMuted,
    fontWeight: "500",
  },
  parentUidLabelString: {
    fontSize: 11,
    color: THEME.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  linkedChildrenMetricsBoxUnit: {
    backgroundColor: "#FFF8F5",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: "rgba(227, 83, 54, 0.08)",
  },
  linkedChildrenCountBigNumber: {
    fontSize: 18,
    fontWeight: "850",
    color: THEME.textDark,
    marginTop: 4,
  },
  linkedChildrenMutedSubtext: {
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: "600",
    marginTop: 1,
  },
  responsiveSplitMainLayoutFlexContainer: { //[cite: 27]
    paddingHorizontal: 16, //[cite: 27]
    marginTop: 22, //[cite: 27]
    gap: 16, //[cite: 27]
  },
  rowDirectionLayoutGrid: { //[cite: 27]
    flexDirection: "row", //[cite: 27]
  },
  desktopFlexProportionWidth: { //[cite: 27]
    flex: 1.3, //[cite: 27]
  },
  desktopFlexProportionWidthRightSide: { //[cite: 27]
    flex: 1, //[cite: 27]
  },
  responsiveRightBlockStack: {
    flex: 1,
    gap: 16,
  },
  listFeedBlockSectionCard: { //[cite: 27]
    backgroundColor: THEME.white, //[cite: 27]
    padding: 20, //[cite: 27]
    borderRadius: 26, //[cite: 27]
    shadowColor: THEME.darkAccent, //[cite: 27]
    shadowOffset: { width: 0, height: 2 }, //[cite: 27]
    shadowOpacity: 0.03, //[cite: 27]
    shadowRadius: 6, //[cite: 27]
    elevation: 2, //[cite: 27]
    gap: 12, //[cite: 27]
  },
  blockTitleLabelHeading: { //[cite: 27]
    fontSize: 15, //[cite: 27]
    fontWeight: "800", //[cite: 27]
    color: THEME.textDark, //[cite: 27]
  },
  fieldDataRowLineItemUnit: {
    backgroundColor: "#FDFCF9",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)",
    gap: 14,
    flexWrap: "wrap",
  },
  fieldRowLeftIconLabelCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fieldMetaLabelText: {
    fontSize: 13,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  fieldValueContentStringText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textDark,
    textAlign: "right",
  },
  secondaryFormActionTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3ECE7",
    height: 42,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.06)",
  },
  secondaryActionBtnLabelTextContent: {
    color: THEME.textDark,
    fontSize: 13,
    fontWeight: "700",
  },
  rightSideInternalCardWrapperPanelBox: {
    backgroundColor: THEME.white, //[cite: 27]
    padding: 20, //[cite: 27]
    borderRadius: 26, //[cite: 27]
    shadowColor: THEME.darkAccent, //[cite: 27]
    shadowOffset: { width: 0, height: 2 }, //[cite: 27]
    shadowOpacity: 0.03, //[cite: 27]
    shadowRadius: 6, //[cite: 27]
    elevation: 2, //[cite: 27]
    gap: 14, //[cite: 27]
  },
  cardHeaderWithIconTitleFlexRow: { //[cite: 27]
    flexDirection: "row", //[cite: 27]
    alignItems: "center", //[cite: 27]
    gap: 10, //[cite: 27]
    borderBottomWidth: 1, //[cite: 27]
    borderBottomColor: "#F5F5F5", //[cite: 27]
    paddingBottom: 12, //[cite: 27]
  },
  securityOptionInlineRowCell: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FDFCF9",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
  },
  securityOptionLabelHeadingText: {
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: "650",
  },
  toggleControlLineItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FDFCF9",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
  },
  toggleControlLabelTitleText: {
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: "600",
  },
  customToggleTrackTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  customToggleTrackActive: {
    backgroundColor: "#16A34A",
  },
  customToggleTrackInactive: {
    backgroundColor: "#E5E7EB",
  },
  customToggleThumbIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.white,
  },
  customToggleThumbActive: {
    alignSelf: "flex-end",
  },
  customToggleThumbInactive: {
    alignSelf: "flex-start",
  },
  portalLogOutSessionActionFullBtn: {
    backgroundColor: THEME.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  logOutBtnLabelTextContentStringText: {
    color: THEME.white,
    fontSize: 14,
    fontWeight: "750",
  },
  auditVerificationNoticeSafetyFooterCardStrip: { //[cite: 27]
    flexDirection: "row", //[cite: 27]
    alignItems: "flex-start", //[cite: 27]
    gap: 8, //[cite: 27]
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  auditVerificationNoticeSafetyFooterCardTextText: { //[cite: 27]
    fontSize: 11, //[cite: 27]
    color: THEME.textMuted, //[cite: 27]
    lineHeight: 15, //[cite: 27]
    flex: 1, //[cite: 27]
  },
});