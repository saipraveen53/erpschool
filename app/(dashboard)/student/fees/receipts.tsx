import { useAuth } from "@/app/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Filter,
  Info,
  Receipt,
  Search,
  ShieldCheck
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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
  primary: "#E35336",       // Burnt Sienna Main
  background: "#F5F5DC",    // Beige Tint Base
  secondary: "#F44460",     // Pastel Salmon Accent
  darkAccent: "#A0522D",    // Deep Sienna Brown
  white: "#FFFFFF",         
  textDark: "#2C1A14",      
  textMuted: "#7A6862",      
  glassBg: "rgba(255, 255, 255, 0.76)", 
};

const filterReceiptTabs = ["All Receipts"];

export default function FeesReceiptsDashboard() {
  const router = useRouter(); 
  const { user } = useAuth(); 
  const params = useLocalSearchParams();

  const [refreshing, setRefreshing] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Receipts");

  // Dynamic state hooks managing incoming response properties seamlessly
  const incomingPaymentId = (params.paymentId as string) || "PAY2026001";
  const incomingFeeId = (params.feeId as string) || "FEE2026001";
  const incomingAmount = parseFloat((params.amount as string) || "16666.67");
  const incomingPaymentDate = (params.paymentDate as string) || "2026-06-04T12:41:45";
  const incomingMethod = (params.method as string) || "PHONEPAY";
  const incomingTransactionRef = (params.transactionRef as string) || "TXN-300aff6f-b2f4-407b-b455-7fa748b77761";

  // Re-mapping incoming telemetry indices into the main data structure array
  const dynamicReceiptsPool = [
    {
      id: incomingPaymentId,
      feeId: incomingFeeId,
      title: `${incomingFeeId === "FEE2026001" ? "Term 1" : "Term 2"} Academic Assessment Fee`, 
      category: "Tuition",
      amount: `₹${incomingAmount.toLocaleString()}`,
      rawAmount: incomingAmount,
      date: incomingPaymentDate.substring(0, 10),
      paymentMode: incomingMethod,
      bankRefNo: incomingTransactionRef,
      status: "PAID",
      color: "#16A34A"
    }
  ];

  const [activeDetailedReceipt, setActiveDetailedReceipt] = useState<any>(dynamicReceiptsPool[0]);

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

  // Compiles and launches HTML printer document buffers configured exactly to image formats
  const handleDownloadAndPrintReceipt = async () => {
    const studentIdStr = user?.username || "STU2026004";
    const currentTimestamp = new Date().toLocaleString();

    const officialHtmlDocumentString = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Receipt - Edvance</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2C1A14; padding: 30px; line-height: 1.4; }
          .receipt-container { border: 2px solid #E35336; padding: 25px; border-radius: 12px; max-width: 700px; margin: 0 auto; background: #FFF; }
          .header-table { width: 100%; border-bottom: 2px dashed #A0522D; padding-bottom: 20px; margin-bottom: 20px; }
          .school-logo { font-size: 24px; font-weight: bold; color: #E35336; text-transform: uppercase; letter-spacing: 0.5px; }
          .school-meta { text-align: right; font-size: 12px; color: #7A6862; }
          .title-banner { text-align: center; font-size: 16px; font-weight: bold; color: #A0522D; letter-spacing: 1px; margin-bottom: 25px; text-transform: uppercase; }
          .metadata-table { width: 100%; font-size: 13px; margin-bottom: 30px; border-collapse: collapse; }
          .metadata-table td { padding: 6px 0; vertical-align: top; }
          .label-col { color: #7A6862; font-weight: 600; width: 22%; }
          .val-col { font-weight: 700; width: 28%; color: #2C1A14; }
          .status-paid { color: #16A34A; font-weight: 800; }
          .itemized-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
          .itemized-table th { background: #FFF2EF; border-top: 1px solid #2C1A14; border-bottom: 1px solid #2C1A14; padding: 10px; text-align: left; font-weight: 700; }
          .itemized-table td { padding: 12px 10px; border-bottom: 1px solid #F5F5F5; }
          .total-row { font-weight: 800; font-size: 15px; background: #FDFCF9; }
          .total-row td { border-top: 1px solid #2C1A14; border-bottom: 2px double #2C1A14; color: #16A34A; }
          .footer-note { font-size: 10px; color: #7A6862; border-top: 1px solid #F5F5F5; padding-top: 15px; margin-top: 40px; text-align: center; }
          .signature-area { margin-top: 40px; text-align: right; font-size: 12px; font-weight: bold; padding-right: 10px; }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <table class="header-table">
            <tr>
              <td class="school-logo">Edvance Techno School</td>
              <td class="school-meta">Hyderabad, Telangana<br>Ph: +91 98765 43210</td>
            </tr>
          </table>
          
          <div class="title-banner">Payment Receipt</div>
          
          <table class="metadata-table">
            <tr>
              <td class="label-col">Receipt No:</td>
              <td class="val-col">#${activeDetailedReceipt.id}</td>
              <td class="label-col">Student ID:</td>
              <td class="val-col">${studentIdStr}</td>
            </tr>
            <tr>
              <td class="label-col">Transaction ID:</td>
              <td class="val-col" style="word-break: break-all; font-size:11px;">${activeDetailedReceipt.bankRefNo}</td>
              <td class="label-col">Session:</td>
              <td class="val-col">2026-2027</td>
            </tr>
            <tr>
              <td class="label-col">Date:</td>
              <td class="val-col">${activeDetailedReceipt.date}</td>
              <td class="label-col">Status:</td>
              <td class="val-col status-paid">${activeDetailedReceipt.status}</td>
            </tr>
            <tr>
              <td class="label-col">Mode:</td>
              <td class="val-col">${activeDetailedReceipt.paymentMode}</td>
              <td class="label-col"></td>
              <td class="val-col"></td>
            </tr>
          </table>
          
          <table class="itemized-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${activeDetailedReceipt.title}</td>
                <td style="text-align: right;">${activeDetailedReceipt.amount}</td>
              </tr>
              <tr class="total-row">
                <td>TOTAL RECEIVED</td>
                <td style="text-align: right;">${activeDetailedReceipt.amount}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="signature-area">
            <span style="border-top: 1px solid #2C1A14; padding-top: 5px; width: 150px; display: inline-block; text-align: center;">Authorized Signatory</span>
          </div>
          
          <div class="footer-note">
            Generated on: ${currentTimestamp}<br>
            Computer generated receipt. No signature required.
          </div>
        </div>
      </body>
      </html>
    `;

    if (Platform.OS === 'web') {
      const openWindowContainer = window.open("", "_blank");
      if (openWindowContainer) {
        openWindowContainer.document.write(officialHtmlDocumentString);
        openWindowContainer.document.close();
        openWindowContainer.print();
      }
    } else {
      // Lazy inject print packages if compiling natively inside Android or iOS mobile bundles
      try {
        const PrintEngine = require("expo-print");
        await PrintEngine.printAsync({ html: officialHtmlDocumentString });
      } catch (nativeErr) {
        console.error("Print sub-routine fault:", nativeErr);
        alert("Local printer hardware communication exception.");
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true); 
    setTimeout(() => setRefreshing(false), 1000); 
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

  const filteredReceipts = dynamicReceiptsPool.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedTab === "Tuition Pool") return item.category === "Tuition";
    if (selectedTab === "Transport Quota") return item.category === "Transport";
    return true;
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

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} 
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollYAnim } } }], { useNativeDriver: true })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
        contentContainerStyle={isDesktop ? styles.desktopCenter : null} 
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}> 
          
          {/* Header */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> 
            <View style={styles.headerLeftCluster}> 
              <TouchableOpacity style={styles.backNavigationRowBtn} onPress={() => router.push("/student/fees")}>
                <ArrowLeft size={14} color={THEME.primary} />
                <Text style={styles.backBtnTextString}>Back to Fees Control</Text>
              </TouchableOpacity>
              <View style={[styles.titleBadgeInlineRow, { marginTop: 10 }]}> 
                <Text style={styles.pageTitleHeading}>Settled Receipts Archive</Text>
                <View style={styles.liveBroadcastBadge}> 
                  <ShieldCheck size={12} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.liveBroadcastBadgeText}>Signed Ledger</Text> 
                </View>
              </View>
            </View>
            <View style={styles.headerIconCircleBackdrop}> 
              <Receipt size={20} color={THEME.white} /> 
            </View>
          </Animated.View>

          {/* Core Analytics Blocks Matrix */}
          {/*<View style={styles.overviewMetricsWrapperGridRow}> 
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird, { backgroundColor: "#E7F9EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#16A34A" }]}>Lifetime Quota Settled</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#16A34A" }]}>₹{incomingAmount.toLocaleString()}</Text>
              <Text style={styles.metricItemFooterSubtext}>Total cleared funds trail</Text> 
            </View>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird]}> 
              <Text style={styles.metricItemLabelText}>Receipt Tokens Generated</Text> 
              <Text style={styles.metricItemBigNumber}>{dynamicReceiptsPool.length} Active PDF</Text>
              <Text style={styles.metricItemFooterSubtext}>Cryptographically stamped</Text> 
            </View>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird, { backgroundColor: "#FEF7EE" }]}> 
              <Text style={[styles.metricItemLabelText, { color: "#D97706" }]}>System Verification</Text> 
              <Text style={[styles.metricItemBigNumber, { color: "#D97706" }]}>100% Secure</Text>
              <Text style={styles.metricItemFooterSubtext}>Audit trail nodes matched</Text> 
            </View>
          </View>*/}

          {/* Tab Filters commanding row bar strip */}
          <View style={styles.categoryFilterBarSectionContainer}> 
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerLayout}> 
              <View style={styles.filterIconBackdropContainerBox}><Filter size={14} color={THEME.darkAccent} /></View>
              {filterReceiptTabs.map((tabLabel, idx) => (
                <TouchableOpacity key={idx} style={[styles.filterChipTabUnitCell, selectedTab === tabLabel && styles.activeFilterChipTabUnitCell]} onPress={() => setSelectedTab(tabLabel)}>
                  <Text style={[styles.filterChipTabLabelTextText, selectedTab === tabLabel && styles.activeFilterChipTabLabelTextText]}>{tabLabel}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Split Screen Grid Architecture Panels */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}> 
            
            {/* Left Column Box Window: Interactive Active Receipts Statements Feed */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}> 
              <View style={styles.searchBarWrapperBackdropControl}> 
                <Search size={15} color={THEME.textMuted} style={{ marginRight: 8 }} /> 
                <TextInput style={styles.searchInputControlField} placeholder="Filter by receipt reference tokens..." placeholderTextColor={THEME.textMuted} value={searchQuery} onChangeText={setSearchQuery} />
              </View>

              <Text style={styles.blockTitleLabelHeading}>Cleared Transactions Registry</Text> 
              
              {filteredReceipts.map((txItem) => {
                const isSelected = activeDetailedReceipt?.id === txItem.id;
                return (
                  <TouchableOpacity key={txItem.id} style={[styles.transactionRowCardItemUnit, isSelected && isDesktop && styles.selectedTransactionRowCardItemUnit]} onPress={() => setActiveDetailedReceipt(txItem)}>
                    <View style={[styles.transactionHighlightVerticalStrip, { backgroundColor: txItem.color }]} /> 
                    <View style={styles.transactionCoreLeftContentCluster}> 
                      <View style={styles.txMetaHeaderRowLine}> 
                        <Text style={styles.txIdStringLabelTextText}>{txItem.id}</Text> 
                        <Text style={styles.txDateMutedLabelString}>{txItem.date}</Text>
                      </View>
                      <Text style={styles.txMainTitleHeadingTextText} numberOfLines={1}>{txItem.title}</Text> 
                    </View>
                    <View style={styles.transactionRightActionContextBlock}> 
                      <Text style={styles.transactionAmountLabelText}>{txItem.amount}</Text> 
                      <ChevronRight size={14} color={THEME.textMuted} />
                    </View>
                  </TouchableOpacity>
                );
              })}
              {filteredReceipts.length === 0 && (
                <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No archived payment tokens found matching this telemetry scale index.</Text>
              )}
            </View>

            {/* Right Column Box Window: Detailed Interactive Audit Panel Viewer (Matching image_41215a.png paper formatting specifications rules) */}
            {activeDetailedReceipt && (
              <View style={[styles.detailedAnalyticsPanelCard, isDesktop && styles.desktopFlexProportionWidthRightSide, { marginBottom: isDesktop ? 0 : 32 }]}> 
                <View style={styles.cardHeaderWithIconTitleFlexRow}> 
                  <Receipt size={16} color={activeDetailedReceipt.color} />
                  <Text style={styles.blockTitleLabelHeading}>Receipt Parameter Verification</Text> 
                </View>

                <View style={styles.auditDetailsContentStack}>
                  <Text style={styles.auditMainHeadingTitleText}>{activeDetailedReceipt.title}</Text>
                  
                  <View style={styles.auditFieldsBoxBackdropRowGrid}>
                    <View style={styles.metadataFieldHalfUnit}>
                      <Text style={styles.metadataFieldLabel}>Transaction Receipt No:</Text>
                      <Text style={styles.metadataFieldValue}>{activeDetailedReceipt.id}</Text>
                    </View>
                    <View style={styles.metadataFieldHalfUnit}>
                      <Text style={styles.metadataFieldLabel}>Student Profile ID:</Text>
                      <Text style={styles.metadataFieldValue}>{user?.username || "STU2026004"}</Text>
                    </View>
                    <View style={styles.metadataFieldHalfUnit}>
                      <Text style={styles.metadataFieldLabel}>Settlement Date Stamp:</Text>
                      <Text style={styles.metadataFieldValue}>{activeDetailedReceipt.date}</Text>
                    </View>
                    <View style={styles.metadataFieldHalfUnit}>
                      <Text style={styles.metadataFieldLabel}>Authorized Gateway Mode:</Text>
                      <Text style={styles.metadataFieldValue}>{activeDetailedReceipt.paymentMode}</Text>
                    </View>
                    <View style={[styles.metadataFieldHalfUnit, { width: "100%" }]}>
                      <Text style={styles.metadataFieldLabel}>Core Bank Reference Transaction ID:</Text>
                      <Text style={[styles.metadataFieldValue, { fontSize: 11 }]}>{activeDetailedReceipt.bankRefNo}</Text>
                    </View>
                  </View>

                  <View style={styles.auditHorizontalDividerInternalMetricLine} /> 

                  <View style={styles.auditGrandTotalRowLine}>
                    <Text style={styles.grandTotalLabel}>TOTAL AMOUNT RECEIVED:</Text>
                    <Text style={styles.grandTotalValueText}>{activeDetailedReceipt.amount}</Text>
                  </View>

                  <TouchableOpacity style={styles.downloadOfficialAssetBtn} onPress={handleDownloadAndPrintReceipt} activeOpacity={0.8}>
                    <Download size={15} color={THEME.white} style={{ marginRight: 6 }} />
                    <Text style={styles.downloadBtnTextContent}>Download Edvance Paper Receipt</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.auditVerificationNoticeSafetyFooterCardStrip, { marginTop: 16 }]}> 
                  <Info size={13} color={THEME.darkAccent} /> 
                  <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}> 
                    This receipt data structure is cryptographically generated and cleared under Edvance school systems nodes.
                  </Text>
                </View>
              </View>
            )}

          </View>

        </View>
      </Animated.ScrollView>
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
  liveBroadcastBadge: { flexDirection: "row", alignItems: "center", backgroundColor: THEME.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  liveBroadcastBadgeText: { color: THEME.white, fontSize: 11, fontWeight: "700" },
  pageSubtitleMuted: { fontSize: 13, color: THEME.textMuted, marginTop: 4, lineHeight: 18 },
  headerIconCircleBackdrop: { width: 46, height: 46, borderRadius: 23, backgroundColor: THEME.primary, justifyContent: "center", alignItems: "center" },
  overviewMetricsWrapperGridRow: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, marginTop: 20 },
  metricCardUnitItem: { width: "100%", backgroundColor: THEME.white, padding: 16, borderRadius: 22, marginBottom: 12, marginHorizontal: 4, flex: 1, minWidth: 240, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 2 },
  desktopMetricThird: { width: "31.33%" },
  metricItemLabelText: { fontSize: 12, color: THEME.textMuted, fontWeight: "600" },
  metricItemBigNumber: { fontSize: 24, fontWeight: "800", color: THEME.textDark, marginTop: 4 },
  metricItemFooterSubtext: { fontSize: 11, color: THEME.textMuted, marginTop: 4 },
  categoryFilterBarSectionContainer: { marginTop: 14, paddingLeft: 16 },
  filterScrollViewInnerLayout: { alignItems: "center", gap: 8, paddingRight: 24 },
  filterIconBackdropContainerBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: THEME.white, justifyContent: "center", alignItems: "center", marginRight: 4 },
  filterChipTabUnitCell: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: THEME.white },
  activeFilterChipTabUnitCell: { backgroundColor: THEME.primary },
  filterChipTabLabelTextText: { color: THEME.textMuted, fontSize: 13, fontWeight: "600" },
  activeFilterChipTabLabelTextText: { color: THEME.white },
  responsiveSplitMainLayoutFlexContainer: { paddingHorizontal: 16, marginTop: 22, gap: 16 },
  rowDirectionLayoutGrid: { flexDirection: "row" },
  desktopFlexProportionWidth: { flex: 1.2 },
  desktopFlexProportionWidthRightSide: { flex: 1 },
  listFeedBlockSectionCard: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 12 },
  blockTitleLabelHeading: { fontSize: 15, fontWeight: "800", color: THEME.textDark },
  searchBarWrapperBackdropControl: { backgroundColor: "#FDFCF9", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, borderRadius: 14, height: 42, borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.06)", marginBottom: 4 },
  searchInputControlField: { flex: 1, color: THEME.textDark, fontSize: 13, fontWeight: "500" },
  transactionRowCardItemUnit: { backgroundColor: "#FDFCF9", borderRadius: 18, flexDirection: "row", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.05)", minHeight: 74 },
  selectedTransactionRowCardItemUnit: { backgroundColor: "#FFF8F5", borderColor: "rgba(227, 83, 54, 0.16)" },
  transactionHighlightVerticalStrip: { width: 5, height: "100%" },
  transactionCoreLeftContentCluster: { flex: 1, paddingHorizontal: 14, gap: 4 },
  txMetaHeaderRowLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  txIdStringLabelTextText: { fontSize: 11, fontWeight: "700", color: THEME.textMuted },
  txDateMutedLabelString: { fontSize: 11, color: THEME.textMuted, marginLeft: "auto" },
  txMainTitleHeadingTextText: { fontSize: 14, fontWeight: "700", color: THEME.textDark, marginTop: 1 },
  transactionRightActionContextBlock: { alignItems: "center", paddingRight: 14, gap: 8, flexDirection: "row" },
  transactionAmountLabelText: { fontSize: 15, fontWeight: "800", color: "#16A34A" },
  fallbackEmptyLogsPlaceholderMutedText: { fontSize: 12, color: THEME.textMuted, fontStyle: "italic", textAlign: "center", paddingVertical: 12 },
  detailedAnalyticsPanelCard: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 14, alignSelf: "flex-start", width: "100%" },
  auditDetailsContentStack: { gap: 12, marginTop: 4 },
  auditMainHeadingTitleText: { fontSize: 16, fontWeight: "800", color: THEME.textDark, lineHeight: 22 },
  auditFieldsBoxBackdropRowGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, backgroundColor: "#FDFCF9", padding: 12, borderRadius: 14, borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.04)" },
  metadataFieldHalfUnit: { width: "48%", minWidth: 120, gap: 2, marginBottom: 4 },
  metadataFieldLabel: { fontSize: 11, color: THEME.textMuted, fontWeight: "600" },
  metadataFieldValue: { fontSize: 12, fontWeight: "750", color: THEME.textDark },
  auditHorizontalDividerInternalMetricLine: { height: 1, backgroundColor: "#F5F5F5" },
  auditGrandTotalRowLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  grandTotalLabel: { fontSize: 13, color: THEME.textMuted, fontWeight: "700" },
  grandTotalValueText: { fontSize: 18, fontWeight: "850", color: "#16A34A" },
  downloadOfficialAssetBtn: { backgroundColor: THEME.primary, flexDirection: "row", alignItems: "center", justifyBox: "center", paddingVertical: 12, borderRadius: 12, marginTop: 6, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3, justifyContent: "center" },
  downloadBtnTextContent: { color: THEME.white, fontSize: 13, fontWeight: "750" },
  auditVerificationNoticeSafetyFooterCardStrip: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 2 },
  auditVerificationNoticeSafetyFooterCardTextText: { fontSize: 11, color: THEME.textMuted, lineHeight: 15, flex: 1 }
});