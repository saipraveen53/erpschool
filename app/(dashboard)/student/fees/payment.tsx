import { useAuth } from "@/app/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileText,
  Info,
  Lock,
  ShieldCheck,
  Smartphone
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
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

export default function FeesPaymentGatewayDashboard() {
  const router = useRouter(); 
  const { user } = useAuth(); 
  const params = useLocalSearchParams();
  
  const [refreshing, setRefreshing] = useState(false); 
  const [selectedMethod, setSelectedMethod] = useState("card"); 
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Dynamic values resolving natively from index router selection parameters
  const activeFeeId = (params.feeId as string) || "FEE2026002";
  const activeFeeName = (params.feeName as string) || "Term 2 Fee Liability";
  const activeAmount = parseFloat((params.amount as string) || "16666.67");
  const activeDueDate = (params.dueDate as string) || "2026-10-15";

  const convenienceTax = 120;
  const grandTotalAggregate = activeAmount + convenienceTax;

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardHolder, setCardHolder] = useState(user?.fullName || "Aarav Sharma");
  const [upiVpa, setUpiVpa] = useState("");

  const { width } = Dimensions.get("window"); 
  const isDesktop = width > 768; 

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

  const handleCheckoutCommit = () => {
    setSuccessModalVisible(true);
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

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16} 
          contentContainerStyle={isDesktop ? styles.desktopCenter : null}
        >
          <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}> 
            
            <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> 
              <View style={styles.headerLeftCluster}> 
                <TouchableOpacity style={styles.backNavigationRowBtn} onPress={() => router.push("/student/fees")}>
                  <ArrowLeft size={16} color={THEME.primary} />
                  <Text style={styles.backBtnTextString}>Back to Dues Overview</Text>
                </TouchableOpacity>
                <View style={[styles.titleBadgeInlineRow, { marginTop: 10 }]}> 
                  <Text style={styles.pageTitleHeading}>Secure Checkout Gateway</Text> 
                  <View style={styles.liveBroadcastBadge}> 
                    <Lock size={12} color={THEME.white} style={{ marginRight: 4 }} />
                    <Text style={styles.liveBroadcastBadgeText}>PCI-DSS Safe</Text> 
                  </View>
                </View>
              </View>
              <View style={styles.headerIconCircleBackdrop}> 
                <ShieldCheck size={22} color={THEME.white} />
              </View>
            </Animated.View>

            <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}> 
              <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}> 
                <Text style={styles.blockTitleLabelHeading}>1. Select Payment Instrument</Text>
                
                <View style={styles.instrumentMethodOptionsStackColumn}>
                  <TouchableOpacity style={[styles.instrumentOptionRowCell, selectedMethod === "card" && styles.selectedInstrumentOptionRowCell]} onPress={() => setSelectedMethod("card")}>
                    <View style={styles.customRadioCircleOuter}>{selectedMethod === "card" && <View style={styles.customRadioCircleInnerFill} />}</View>
                    <CreditCard size={18} color={THEME.primary} style={{ marginLeft: 12 }} />
                    <Text style={styles.instrumentLabelTextString}>Credit / Debit Payment Card</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.instrumentOptionRowCell, selectedMethod === "upi" && styles.selectedInstrumentOptionRowCell]} onPress={() => setSelectedMethod("upi")}>
                    <View style={styles.customRadioCircleOuter}>{selectedMethod === "upi" && <View style={styles.customRadioCircleInnerFill} />}</View>
                    <Smartphone size={18} color={THEME.darkAccent} style={{ marginLeft: 12 }} />
                    <Text style={styles.instrumentLabelTextString}>Instant UPI Handle (BHIM, GooglePay, PhonePe)</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.blockTitleLabelHeading, { marginTop: 14 }]}>2. Provide Authentication Parameters</Text>
                
                {selectedMethod === "card" && (
                  <View style={styles.formFieldsInputsStackGroup}>
                    <View style={styles.inputFieldContainerBlockBox}>
                      <Text style={styles.fieldHeadingLabelText}>Cardholders Legal Name</Text>
                      <TextInput style={styles.textFieldElementControl} value={cardHolder} onChangeText={cardHolder} />
                    </View>
                    <View style={styles.inputFieldContainerBlockBox}>
                      <Text style={styles.fieldHeadingLabelText}>Credit Card Primary Number (PAN)</Text>
                      <TextInput style={styles.textFieldElementControl} placeholder="XXXX XXXX XXXX XXXX" placeholderTextColor={THEME.textMuted} value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" />
                    </View>
                    <View style={styles.formSplitInlineRowFields}>
                      <View style={[styles.inputFieldContainerBlockBox, { flex: 1 }]}>
                        <Text style={styles.fieldHeadingLabelText}>Expiry MM/YY</Text>
                        <TextInput style={styles.textFieldElementControl} placeholder="12/28" placeholderTextColor={THEME.textMuted} value={cardExpiry} onChangeText={setCardExpiry} />
                      </View>
                      <View style={[styles.inputFieldContainerBlockBox, { flex: 1 }]}>
                        <Text style={styles.fieldHeadingLabelText}>Secure CVV</Text>
                        <TextInput style={styles.textFieldElementControl} placeholder="***" placeholderTextColor={THEME.textMuted} secureTextEntry keyboardType="numeric" />
                      </View>
                    </View>
                  </View>
                )}

                {selectedMethod === "upi" && (
                  <View style={styles.formFieldsInputsStackGroup}>
                    <View style={styles.inputFieldContainerBlockBox}>
                      <Text style={styles.fieldHeadingLabelText}>Virtual Payment Address (VPA / UPI ID)</Text>
                      <TextInput style={styles.textFieldElementControl} placeholder="username@okhdfcbank" placeholderTextColor={THEME.textMuted} value={upiVpa} onChangeText={setUpiVpa} autoCapitalize="none" />
                    </View>
                  </View>
                )}
              </View>

              {/* Breakdown breakdown visual summary matching image_4ceb03.png exactly */}
              <View style={[styles.detailedBreakdownSummaryCardPanel, isDesktop && styles.desktopFlexProportionWidthRightSide, { marginBottom: isDesktop ? 0 : 32 }]}> 
                <View style={styles.cardHeaderWithIconTitleFlexRow}> 
                  <FileText size={16} color={THEME.darkAccent} />
                  <Text style={styles.blockTitleLabelHeading}>Checkout Invoices Breakout Breakdown</Text> 
                </View>

                <View style={styles.breakdownTableFieldsStackList}>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>Target Student Context ID:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>{user?.username || "STU2026004"}</Text>
                  </View>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>Active Invoices Allocation ID:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>{activeFeeId}</Text>
                  </View>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>Timeline Expiry Milestone Due:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>{activeDueDate}</Text>
                  </View>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>{activeFeeName}:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>₹{activeAmount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>Gateway Convenience Tax:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>₹{convenienceTax.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.tableHorizontalInternalDividerLine} /> 
                  
                  <View style={[styles.tableRowLineItem, { borderBottomWidth: 0, backgroundColor: "#FFF8F5" }]}>
                    <Text style={[styles.tableRowFieldLabelText, { fontSize: 14, color: THEME.textDark, fontWeight: "700" }]}>Aggregate Amount Payable:</Text>
                    <Text style={styles.tableRowGrandTotalAmountValue}>₹{grandTotalAggregate.toLocaleString()}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.gatewayCheckoutCommitActionBtn} onPress={handleCheckoutCommit} activeOpacity={0.85}>
                  <Lock size={15} color={THEME.white} style={{ marginRight: 6 }} />
                  <Text style={styles.commitBtnLabelTextContentString}>Authorize Secure Transaction</Text>
                </TouchableOpacity>

                <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}> 
                  <Info size={13} color={THEME.darkAccent} /> 
                  <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}> 
                    Identity token fields matching standard criteria profiles. Aadhaar or native parameters are tokens excluded.
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="fade" transparent={true} visible={successModalVisible} onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.successAlertBlurOverlayPanelBackdropContainer}>
          <View style={styles.successAlertGlassContainerBodyBlockUnit}>
            <View style={styles.successIconOuterBackdropCircleScaleAnimationHolder}><CheckCircle2 size={32} color={THEME.white} /></View>
            <Text style={styles.successAlertHeadingMainTitleTextString}>Transaction Token Settled!</Text>
            <Text style={styles.successAlertParagraphDescriptionBodyTextContentParagraph}>
              Your student clearing allocation aggregate amount of ₹{grandTotalAggregate.toLocaleString()} has been processed securely. Signed receipts are uploaded to your terminal database ledger.
            </Text>
            <TouchableOpacity style={styles.successAlertDismissActionConfirmationBtnFullWidthBtn} onPress={() => { setSuccessModalVisible(false); router.push("/student/fees"); }} activeOpacity={0.8}>
              <Text style={styles.successAlertDismissBtnLabelTextTextString}>Return to Fees Overview</Text>
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
  backNavigationRowBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backBtnTextString: { fontSize: 13, fontWeight: "750", color: THEME.primary },
  titleBadgeInlineRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 },
  pageTitleHeading: { fontSize: 22, fontWeight: "bold", color: THEME.textDark },
  liveBroadcastBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#16A34A", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  liveBroadcastBadgeText: { color: THEME.white, fontSize: 11, fontWeight: "700" },
  pageSubtitleMuted: { fontSize: 13, color: THEME.textMuted, marginTop: 4, lineHeight: 18 },
  headerIconCircleBackdrop: { width: 46, height: 46, borderRadius: 23, backgroundColor: THEME.primary, justifyContent: "center", alignItems: "center" },
  responsiveSplitMainLayoutFlexContainer: { paddingHorizontal: 16, marginTop: 22, gap: 16 },
  rowDirectionLayoutGrid: { flexDirection: "row" },
  desktopFlexProportionWidth: { flex: 1.3 },
  desktopFlexProportionWidthRightSide: { flex: 1 },
  listFeedBlockSectionCard: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 12 },
  blockTitleLabelHeading: { fontSize: 15, fontWeight: "800", color: THEME.textDark },
  instrumentMethodOptionsStackColumn: { gap: 8, marginTop: 4 },
  instrumentOptionRowCell: { backgroundColor: "#FDFCF9", borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.05)" },
  selectedInstrumentOptionRowCell: { backgroundColor: "#FFF8F5", borderColor: "rgba(227, 83, 54, 0.16)" },
  customRadioCircleOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: THEME.primary, justifyContent: "center", alignItems: "center" },
  customRadioCircleInnerFill: { width: 10, height: 10, borderRadius: 5, backgroundColor: THEME.primary },
  instrumentLabelTextString: { fontSize: 13, fontWeight: "650", color: THEME.textDark, marginLeft: 12, flex: 1 },
  formFieldsInputsStackGroup: { gap: 12, marginTop: 4 },
  inputFieldContainerBlockBox: { gap: 6 },
  fieldHeadingLabelText: { fontSize: 12, color: THEME.textMuted, fontWeight: "600" },
  textFieldElementControl: { backgroundColor: "#FDFCF9", borderRadius: 12, paddingHorizontal: 14, height: 42, color: THEME.textDark, fontSize: 13, fontWeight: "600", borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.06)" },
  formSplitInlineRowFields: { flexDirection: "row", gap: 12 },
  detailedBreakdownSummaryCardPanel: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 14, alignSelf: "flex-start", width: "100%" },
  breakdownTableFieldsStackList: { gap: 10, marginTop: 4 },
  tableRowLineItem: { flexDirection: "row", justifyBox: "space-between", alignItems: "center", backgroundColor: "#FDFCF9", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.04)", justifyContent: "space-between" },
  tableRowFieldLabelText: { fontSize: 13, color: THEME.textMuted, fontWeight: "600" },
  tableRowFieldValueHeadingBoldText: { fontSize: 13, fontWeight: "700", color: THEME.textDark },
  tableHorizontalInternalDividerLine: { height: 1, backgroundColor: "#F5F5F5", marginVertical: 4 },
  tableRowGrandTotalAmountValue: { fontSize: 18, fontWeight: "850", color: THEME.primary },
  gatewayCheckoutCommitActionBtn: { backgroundColor: THEME.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 14, marginTop: 8, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  commitBtnLabelTextContentString: { color: THEME.white, fontSize: 14, fontWeight: "750" },
  auditVerificationNoticeSafetyFooterCardStrip: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 2 },
  auditVerificationNoticeSafetyFooterCardTextText: { fontSize: 11, color: THEME.textMuted, lineHeight: 15, flex: 1 },
  successAlertBlurOverlayPanelBackdropContainer: { flex: 1, backgroundColor: "rgba(44, 26, 20, 0.48)", justifyContent: "center", alignItems: "center", padding: 24 },
  successAlertGlassContainerBodyBlockUnit: { width: "100%", maxWidth: 440, backgroundColor: THEME.white, borderRadius: 28, padding: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.16, shadowRadius: 24, elevation: 12 },
  successIconOuterBackdropCircleScaleAnimationHolder: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#16A34A", justifyContent: "center", alignItems: "center", marginBottom: 18 },
  successAlertHeadingMainTitleTextString: { fontSize: 18, fontWeight: "800", color: THEME.textDark, textAlign: "center" },
  successAlertParagraphDescriptionBodyTextContentParagraph: { fontSize: 13, color: THEME.textMuted, textAlign: "center", lineHeight: 20, marginTop: 8, marginBottom: 24 },
  successAlertDismissActionConfirmationBtnFullWidthBtn: { backgroundColor: THEME.textDark, paddingVertical: 12, width: "100%", borderRadius: 12, alignSelf: "center", alignItems: "center" },
  successAlertDismissBtnLabelTextTextString: { color: THEME.white, fontWeight: "700", fontSize: 14 }
});