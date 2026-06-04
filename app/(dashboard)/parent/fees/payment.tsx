 
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe,
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
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";


const THEME = {
  primary: "#E35336",       // Burnt Sienna Main[cite: 27]
  background: "#F5F5DC",    // Beige Tint Base[cite: 27]
  secondary: "#F44460",     // Pastel Salmon Accent[cite: 27]
  darkAccent: "#A0522D",    // Deep Sienna Brown[cite: 27]
  white: "#FFFFFF",         //[cite: 27]
  textDark: "#2C1A14",      //[cite: 27]
  textMuted: "#7A6862",      //[cite: 27]
  glassBg: "rgba(255, 255, 255, 0.76)", //[cite: 27]
};

const checkoutBreakdown = {
  invoiceId: "INV-9902 / 9612",
  studentName: "Aarav Sharma",
  tuitionFee: 15000,
  transportFee: 2500,
  convenienceTax: 120,
  totalAggregate: 17620
};

export default function FeesPaymentGatewayDashboard() {
  const router = useRouter(); //[cite: 27]
  const { user } = useAuth(); //[cite: 27]
  const [refreshing, setRefreshing] = useState(false); //[cite: 27]
  const [selectedMethod, setSelectedMethod] = useState("card"); // card, upi, netbanking
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Form Controlled Text Input States
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardHolder, setCardHolder] = useState(checkoutBreakdown.studentName);
  const [upiVpa, setUpiVpa] = useState("");

  const { width } = Dimensions.get("window"); //[cite: 27]
  const isDesktop = width > 768; //[cite: 27]

  // 3D Matrix & Background Parallax Layer Transform Systems
  const scrollYAnim = useRef(new Animated.Value(0)).current; //[cite: 27]
  const fadeAnim = useRef(new Animated.Value(0)).current; //[cite: 27]
  const slideAnim = useRef(new Animated.Value(45)).current; //[cite: 27]
  const fluidMoveAnim = useRef(new Animated.Value(0)).current; //[cite: 27]

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }), //[cite: 27]
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }), //[cite: 27]
    ]).start();

    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 16000, //[cite: 27]
        easing: Easing.inOut(Easing.sin), //[cite: 27]
        useNativeDriver: true, //[cite: 27]
      })
    ).start();
  }, []);

  const handleCheckoutCommit = () => {
    setSuccessModalVisible(true);
  };

  const onRefresh = () => {
    setRefreshing(true); //[cite: 27]
    setTimeout(() => setRefreshing(false), 1000); //[cite: 27]
  };

  // Parallax layers manual transformations matching drag offset bounds
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [40, 0, -85], //[cite: 27]
    extrapolate: "clamp", //[cite: 27]
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [-25, 0, 60], //[cite: 27]
    extrapolate: "clamp", //[cite: 27]
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20], //[cite: 27]
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Background Curved Wave Arcs Layout Vector Canvas */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none"> {/*[cite: 27] */}
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}> {/*[cite: 27] */}
          <Svg height="350" width={width + 100} viewBox={`0 0 ${width + 100} 350`}> {/*[cite: 27] */}
            <Path
              d={`M0 130 C ${width / 3} 70, ${(2 * width) / 3} 190, ${width + 100} 110 L ${width + 100} 0 L 0 0 Z`} //[cite: 27]
              fill="rgba(227, 83, 54, 0.05)" //[cite: 27]
            />
            <Path
              d={`M0 250 C ${width / 4} 310, ${(3 * width) / 4} 170, ${width + 100} 230 L ${width + 100} 0 L 0 0 Z`} //[cite: 27]
              fill="rgba(160, 82, 45, 0.04)" //[cite: 27]
            />
          </Svg>
        </Animated.View>
      </View>

      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} /> {/*[cite: 27] */}
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} /> {/*[cite: 27] */}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        {/* PURE HAND-DRIVEN SCROLL ONLY: Auto-scroll intervals are completely stripped out */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16} //[cite: 27]
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }], //[cite: 27]
            { useNativeDriver: true } //[cite: 27]
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} //[cite: 27]
          contentContainerStyle={isDesktop ? styles.desktopCenter : null} //[cite: 27]
        >
          <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}> {/*[cite: 27] */}
            
            {/* Top Main Branding Header Card Element */}
            <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> {/*[cite: 27] */}
              <View style={styles.headerLeftCluster}> {/*[cite: 27] */}
                <TouchableOpacity style={styles.backNavigationRowBtn} onPress={() => router.push("/parent/fees")}>
                  <ArrowLeft size={16} color={THEME.primary} />
                  <Text style={styles.backBtnTextString}>Back to Dues Overview</Text>
                </TouchableOpacity>
                <View style={[styles.titleBadgeInlineRow, { marginTop: 10 }]}> {/*[cite: 27] */}
                  <Text style={styles.pageTitleHeading}>Secure Checkout Gateway</Text> {/*[cite: 27] */}
                  <View style={styles.liveBroadcastBadge}> {/*[cite: 27] */}
                    <Lock size={12} color={THEME.white} style={{ marginRight: 4 }} />
                    <Text style={styles.liveBroadcastBadgeText}>PCI-DSS Safe</Text> {/*[cite: 27] */}
                  </View>
                </View>
              </View>
              <View style={styles.headerIconCircleBackdrop}> {/*[cite: 27] */}
                <ShieldCheck size={22} color={THEME.white} />
              </View>
            </Animated.View>

            {/* Split Screen Grid Layout Mappings (Desktop Double Panels / Mobile In-line Stacks) */}
            <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}> {/*[cite: 27] */}
              
              {/* Left Column Box Window: Bill Breakup Summary Card Panel */}
              <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}> {/*[cite: 27] */}
                <Text style={styles.blockTitleLabelHeading}>1. Select Payment Instrument</Text>
                
                {/* Method Option Toggles Stack */}
                <View style={styles.instrumentMethodOptionsStackColumn}>
                  <TouchableOpacity 
                    style={[styles.instrumentOptionRowCell, selectedMethod === "card" && styles.selectedInstrumentOptionRowCell]}
                    onPress={() => setSelectedMethod("card")}
                  >
                    <View style={styles.customRadioCircleOuter}>
                      {selectedMethod === "card" && <View style={styles.customRadioCircleInnerFill} />}
                    </View>
                    <CreditCard size={18} color={THEME.primary} style={{ marginLeft: 12 }} />
                    <Text style={styles.instrumentLabelTextString}>Credit / Debit Payment Card</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.instrumentOptionRowCell, selectedMethod === "upi" && styles.selectedInstrumentOptionRowCell]}
                    onPress={() => setSelectedMethod("upi")}
                  >
                    <View style={styles.customRadioCircleOuter}>
                      {selectedMethod === "upi" && <View style={styles.customRadioCircleInnerFill} />}
                    </View>
                    <Smartphone size={18} color={THEME.darkAccent} style={{ marginLeft: 12 }} />
                    <Text style={styles.instrumentLabelTextString}>Instant UPI Handle (BHIM, GooglePay, PhonePe)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.instrumentOptionRowCell, selectedMethod === "netbanking" && styles.selectedInstrumentOptionRowCell]}
                    onPress={() => setSelectedMethod("netbanking")}
                  >
                    <View style={styles.customRadioCircleOuter}>
                      {selectedMethod === "netbanking" && <View style={styles.customRadioCircleInnerFill} />}
                    </View>
                    <Globe size={18} color={THEME.secondary} style={{ marginLeft: 12 }} />
                    <Text style={styles.instrumentLabelTextString}>Corporate Netbanking Online Gateway</Text>
                  </TouchableOpacity>
                </View>

                {/* Conditional Inputs Form Field Fields Rendering Mapping */}
                <Text style={[styles.blockTitleLabelHeading, { marginTop: 14 }]}>2. Provide Authentication Parameters</Text>
                
                {selectedMethod === "card" && (
                  <View style={styles.formFieldsInputsStackGroup}>
                    <View style={styles.inputFieldContainerBlockBox}>
                      <Text style={styles.fieldHeadingLabelText}>Cardholders Legal Name</Text>
                      <TextInput style={styles.textFieldElementControl} value={cardHolder} onChangeText={setCardHolder} />
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

                {selectedMethod === "netbanking" && (
                  <View style={styles.formFieldsInputsStackGroup}>
                    <Text style={styles.netbankingMutedFallbackNote}>You will be redirected securely to your authorized bank terminal gateway window upon clicking checkout button layout.</Text>
                  </View>
                )}
              </View>

              {/* Right Column Box Window: Virtual Summary Breakout Breakdowns Table Panel Panel */}
              <View style={[styles.detailedBreakdownSummaryCardPanel, isDesktop && styles.desktopFlexProportionWidthRightSide, { marginBottom: isDesktop ? 0 : 32 }]}> {/*[cite: 27] */}
                <View style={styles.cardHeaderWithIconTitleFlexRow}> {/*[cite: 27] */}
                  <FileText size={16} color={THEME.darkAccent} />
                  <Text style={styles.blockTitleLabelHeading}>Checkout Invoices Breakout Breakdown</Text> {/*[cite: 27] */}
                </View>

                <View style={styles.breakdownTableFieldsStackList}>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>Target Student Profile Name:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>{checkoutBreakdown.studentName}</Text>
                  </View>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>Active Invoices Aggregation:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>{checkoutBreakdown.invoiceId}</Text>
                  </View>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>Tuition Pool Liabilities Quota:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>₹{checkoutBreakdown.tuitionFee.toLocaleString()}</Text>
                  </View>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>Transport Route Logistics Fee:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>₹{checkoutBreakdown.transportFee.toLocaleString()}</Text>
                  </View>
                  <View style={styles.tableRowLineItem}>
                    <Text style={styles.tableRowFieldLabelText}>Gateway Convenience Tax:</Text>
                    <Text style={styles.tableRowFieldValueHeadingBoldText}>₹{checkoutBreakdown.convenienceTax.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.tableHorizontalInternalDividerLine} /> {/*[cite: 27] */}
                  
                  <View style={[styles.tableRowLineItem, { borderBottomWidth: 0 }]}>
                    <Text style={[styles.tableRowFieldLabelText, { fontSize: 15, color: THEME.textDark, fontWeight: "700" }]}>Aggregate Amount Payable:</Text>
                    <Text style={styles.tableRowGrandTotalAmountValue}>₹{checkoutBreakdown.totalAggregate.toLocaleString()}</Text>
                  </View>
                </View>

                {/* Final Gateway Execution Ingress Trigger Button */}
                <TouchableOpacity style={styles.gatewayCheckoutCommitActionBtn} onPress={handleCheckoutCommit} activeOpacity={0.85}>
                  <Lock size={15} color={THEME.white} style={{ marginRight: 6 }} />
                  <Text style={styles.commitBtnLabelTextContentString}>Authorize Secure Transaction</Text>
                </TouchableOpacity>

                <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}> {/*[cite: 27] */}
                  <Info size={13} color={THEME.darkAccent} /> {/*[cite: 27] */}
                  <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}> {/*[cite: 27] */}
                    Cryptographic tokenization algorithms parameters check running on active nodes handshake layer.
                  </Text>
                </View>
              </View>

            </View>

          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>

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
              <CheckCircle2 size={32} color={THEME.white} />
            </View>
            <Text style={styles.successAlertHeadingMainTitleTextString}>Transaction Token Settled!</Text>
            <Text style={styles.successAlertParagraphDescriptionBodyTextContentParagraph}>
              Your student dues clearing aggregate amount of ₹{checkoutBreakdown.totalAggregate.toLocaleString()} has been processed securely. Digital signed accounting ledger receipts are uploaded into your database receipts folder.
            </Text>
            <TouchableOpacity 
              style={styles.successAlertDismissActionConfirmationBtnFullWidthBtn} 
              onPress={() => {
                setSuccessModalVisible(false);
                router.push("/parent/fees");
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.successAlertDismissBtnLabelTextTextString}>Return to Fees Overview</Text>
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
  pageHeaderBlockCard: { //[cite: 27]
    backgroundColor: THEME.white, //[cite: 27]
    padding: 22, //[cite: 27]
    borderRadius: 26, //[cite: 27]
    marginHorizontal: 16, //[cite: 27]
    marginTop: 22, //[cite: 27]
    flexDirection: "row", //[cite: 27]
    alignItems: "center", //[cite: 27]
    justifyContent: "space-between", //[cite: 27]
    flexWrap: "wrap", //[cite: 27]
    gap: 16, //[cite: 27]
    shadowColor: THEME.darkAccent, //[cite: 27]
    shadowOffset: { width: 0, height: 4 }, //[cite: 27]
    shadowOpacity: 0.04, //[cite: 27]
    shadowRadius: 12, //[cite: 27]
    elevation: 3, //[cite: 27]
  },
  headerLeftCluster: { //[cite: 27]
    flex: 1,
    minWidth: 280,
  },
  backNavigationRowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backBtnTextString: {
    fontSize: 13,
    fontWeight: "750",
    color: THEME.primary,
  },
  titleBadgeInlineRow: { //[cite: 27]
    flexDirection: "row", //[cite: 27]
    alignItems: "center", //[cite: 27]
    flexWrap: "wrap", //[cite: 27]
    gap: 10, //[cite: 27]
  },
  pageTitleHeading: { //[cite: 27]
    fontSize: 22,
    fontWeight: "bold",
    color: THEME.textDark, //[cite: 27]
  },
  liveBroadcastBadge: { //[cite: 27]
    flexDirection: "row", //[cite: 27]
    alignItems: "center", //[cite: 27]
    backgroundColor: "#16A34A",
    paddingHorizontal: 10, //[cite: 27]
    paddingVertical: 4, //[cite: 27]
    borderRadius: 10, //[cite: 27]
  },
  liveBroadcastBadgeText: { //[cite: 27]
    color: THEME.white, //[cite: 27]
    fontSize: 11, //[cite: 27]
    fontWeight: "700", //[cite: 27]
  },
  pageSubtitleMuted: { //[cite: 27]
    fontSize: 13, //[cite: 27]
    color: THEME.textMuted, //[cite: 27]
    marginTop: 4, //[cite: 27]
    lineHeight: 18, //[cite: 27]
  },
  headerIconCircleBackdrop: { //[cite: 27]
    width: 46, //[cite: 27]
    height: 46, //[cite: 27]
    borderRadius: 23, //[cite: 27]
    backgroundColor: THEME.primary, //[cite: 27]
    justifyContent: "center", //[cite: 27]
    alignItems: "center", //[cite: 27]
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
  instrumentMethodOptionsStackColumn: {
    gap: 8,
    marginTop: 4,
  },
  instrumentOptionRowCell: {
    backgroundColor: "#FDFCF9",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)",
  },
  selectedInstrumentOptionRowCell: {
    backgroundColor: "#FFF8F5",
    borderColor: "rgba(227, 83, 54, 0.16)",
  },
  customRadioCircleOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  customRadioCircleInnerFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.primary,
  },
  instrumentLabelTextString: {
    fontSize: 13,
    fontWeight: "650",
    color: THEME.textDark,
    marginLeft: 12,
    flex: 1,
  },
  formFieldsInputsStackGroup: {
    gap: 12,
    marginTop: 4,
  },
  inputFieldContainerBlockBox: {
    gap: 6,
  },
  fieldHeadingLabelText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  textFieldElementControl: {
    backgroundColor: "#FDFCF9",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 42,
    color: THEME.textDark,
    fontSize: 13,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.06)",
  },
  formSplitInlineRowFields: {
    flexDirection: "row",
    gap: 12,
  },
  netbankingMutedFallbackNote: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 18,
    fontStyle: "italic",
    paddingVertical: 4,
  },
  detailedBreakdownSummaryCardPanel: {
    backgroundColor: THEME.white, //[cite: 27]
    padding: 20, //[cite: 27]
    borderRadius: 26, //[cite: 27]
    shadowColor: THEME.darkAccent, //[cite: 27]
    shadowOffset: { width: 0, height: 2 }, //[cite: 27]
    shadowOpacity: 0.03, //[cite: 27]
    shadowRadius: 6, //[cite: 27]
    elevation: 2, //[cite: 27]
    gap: 14, //[cite: 27]
    alignSelf: "flex-start", //[cite: 27]
    width: "100%", //[cite: 27]
  },
  cardHeaderWithIconTitleFlexRow: { //[cite: 27]
    flexDirection: "row", //[cite: 27]
    alignItems: "center", //[cite: 27]
    gap: 10, //[cite: 27]
    borderBottomWidth: 1, //[cite: 27]
    borderBottomColor: "#F5F5F5", //[cite: 27]
    paddingBottom: 12, //[cite: 27]
  },
  breakdownTableFieldsStackList: {
    gap: 10,
    marginTop: 4,
  },
  tableRowLineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FDFCF9",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
  },
  tableRowFieldLabelText: {
    fontSize: 13,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  tableRowFieldValueHeadingBoldText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textDark,
  },
  tableHorizontalInternalDividerLine: {
    height: 1, //[cite: 27]
    backgroundColor: "#F5F5F5", //[cite: 27]
    marginVertical: 4,
  },
  tableRowGrandTotalAmountValue: {
    fontSize: 18,
    fontWeight: "850",
    color: THEME.primary,
  },
  gatewayCheckoutCommitActionBtn: {
    backgroundColor: THEME.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  commitBtnLabelTextContentString: {
    color: THEME.white,
    fontSize: 14,
    fontWeight: "750",
  },
  auditHorizontalDividerInternalMetricLine: { //[cite: 27]
    height: 1, //[cite: 27]
    backgroundColor: "#F5F5F5", //[cite: 27]
  },
  auditVerificationNoticeSafetyFooterCardStrip: { //[cite: 27]
    flexDirection: "row", //[cite: 27]
    alignItems: "flex-start", //[cite: 27]
    gap: 8, //[cite: 27]
    marginTop: 2, //[cite: 27]
  },
  auditVerificationNoticeSafetyFooterCardTextText: { //[cite: 27]
    fontSize: 11, //[cite: 27]
    color: THEME.textMuted, //[cite: 27]
    lineHeight: 15, //[cite: 27]
    flex: 1, //[cite: 27]
  },
  successAlertBlurOverlayPanelBackdropContainer: {
    flex: 1,
    backgroundColor: "rgba(44, 26, 20, 0.48)",
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
    shadowOpacity: 0.16,
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