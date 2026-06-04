 
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
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
  primary: "#E35336",       // Burnt Sienna Main[cite: 29]
  background: "#F5F5DC",    // Beige Tint Base[cite: 29]
  secondary: "#F44460",     // Pastel Salmon Accent[cite: 29]
  darkAccent: "#A0522D",    // Deep Sienna Brown[cite: 29]
  white: "#FFFFFF",         //[cite: 29]
  textDark: "#2C1A14",      //[cite: 29]
  textMuted: "#7A6862",      //[cite: 29]
  glassBg: "rgba(255, 255, 255, 0.76)", //[cite: 29]
};

const filterReceiptTabs = ["All Receipts", "Tuition Pool", "Transport Quota"];

const receiptsDataPool = [
  {
    id: "RCT-4102", //[cite: 29]
    title: "Quarter 1 Term Assessment Enrollment", //[cite: 29]
    category: "Tuition",
    amount: "₹18,000", //[cite: 29]
    date: "April 10, 2026",
    paymentMode: "Credit Card (Visa - 4021)",
    bankRefNo: "TXN-BANK8840192",
    fileName: "receipt_q1_tuition.pdf", //[cite: 29]
    status: "Verified Settlement",
    color: "#E35336" //[cite: 29]
  },
  {
    id: "RCT-3941", //[cite: 29]
    title: "Annual Sports Kit & Activity Charges", //[cite: 29]
    category: "Tuition",
    amount: "₹3,500", //[cite: 29]
    date: "March 05, 2026",
    paymentMode: "Instant UPI Handle (GPay)",
    bankRefNo: "TXN-UPI9940214",
    fileName: "receipt_sports_kit.pdf", //[cite: 29]
    status: "Verified Settlement",
    color: "#A0522D" //[cite: 29]
  },
  {
    id: "RCT-2281",
    title: "Term 1 Bus Transport Fee Route 101",
    category: "Transport",
    amount: "₹2,500",
    date: "January 04, 2026",
    paymentMode: "Corporate Netbanking",
    bankRefNo: "TXN-NETB2201943",
    fileName: "receipt_t1_transport.pdf",
    status: "Verified Settlement",
    color: "#D97706"
  }
];

export default function FeesReceiptsDashboard() {
  const router = useRouter(); //[cite: 29]
  const { user } = useAuth(); //[cite: 29]
  const [refreshing, setRefreshing] = useState(false); //[cite: 29]
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Receipts");
  const [activeDetailedReceipt, setActiveDetailedReceipt] = useState<any>(receiptsDataPool[0]);

  const { width } = Dimensions.get("window"); //[cite: 29]
  const isDesktop = width > 768; //[cite: 29]

  // 3D Matrix & Background Parallax Layer Transform Systems[cite: 29]
  const scrollYAnim = useRef(new Animated.Value(0)).current; //[cite: 29]
  const fadeAnim = useRef(new Animated.Value(0)).current; //[cite: 29]
  const slideAnim = useRef(new Animated.Value(45)).current; //[cite: 29]
  const fluidMoveAnim = useRef(new Animated.Value(0)).current; //[cite: 29]

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }), //[cite: 29]
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }), //[cite: 29]
    ]).start();

    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 16000, //[cite: 29]
        easing: Easing.inOut(Easing.sin), //[cite: 29]
        useNativeDriver: true, //[cite: 29]
      })
    ).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true); //[cite: 29]
    setTimeout(() => setRefreshing(false), 1000); //[cite: 29]
  };

  // Parallax layer calculations triggered purely upon manual scrolling configurations
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [40, 0, -85], //[cite: 29]
    extrapolate: "clamp", //[cite: 29]
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [-25, 0, 60], //[cite: 29]
    extrapolate: "clamp", //[cite: 29]
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20], //[cite: 29]
  });

  const filteredReceipts = receiptsDataPool.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedTab === "Tuition Pool") return item.category === "Tuition";
    if (selectedTab === "Transport Quota") return item.category === "Transport";
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}> {/*[cite: 29] */}
      <StatusBar style="dark" /> {/*[cite: 29] */}

      {/* SVG Background Curved Wave Arcs Layout Vector Canvas[cite: 29] */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none"> {/*[cite: 29] */}
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}> {/*[cite: 29] */}
          <Svg height="350" width={width + 100} viewBox={`0 0 ${width + 100} 350`}> {/*[cite: 29] */}
            <Path
              d={`M0 130 C ${width / 3} 70, ${(2 * width) / 3} 190, ${width + 100} 110 L ${width + 100} 0 L 0 0 Z`} //[cite: 29]
              fill="rgba(227, 83, 54, 0.05)" //[cite: 29]
            />
            <Path
              d={`M0 250 C ${width / 4} 310, ${(3 * width) / 4} 170, ${width + 100} 230 L ${width + 100} 0 L 0 0 Z`} //[cite: 29]
              fill="rgba(160, 82, 45, 0.04)" //[cite: 29]
            />
          </Svg>
        </Animated.View>
      </View>

      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} /> {/*[cite: 29] */}
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} /> {/*[cite: 29] */}

      {/* PURE HAND-DRIVEN SCROLL ONLY: No auto-scroll intervals are configured here */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} //[cite: 29]
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }], //[cite: 29]
          { useNativeDriver: true } //[cite: 29]
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} //[cite: 29]
        contentContainerStyle={isDesktop ? styles.desktopCenter : null} //[cite: 29]
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}> {/*[cite: 29] */}
          
          {/* Top Main Branding Header Card Element[cite: 29] */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> {/*[cite: 29] */}
            <View style={styles.headerLeftCluster}> {/*[cite: 29] */}
              <TouchableOpacity style={styles.backNavigationRowBtn} onPress={() => router.push("/parent/fees")}>
                <ArrowLeft size={14} color={THEME.primary} />
                <Text style={styles.backBtnTextString}>Back to Fees Control</Text>
              </TouchableOpacity>
              <View style={[styles.titleBadgeInlineRow, { marginTop: 10 }]}> {/*[cite: 29] */}
                <Text style={styles.pageTitleHeading}>Settled Receipts Archive</Text>
                <View style={styles.liveBroadcastBadge}> {/*[cite: 29] */}
                  <ShieldCheck size={12} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.liveBroadcastBadgeText}>Signed Ledger</Text> {/*[cite: 29] */}
                </View>
              </View>
            </View>
            <View style={styles.headerIconCircleBackdrop}> {/*[cite: 29] */}
              <Receipt size={20} color={THEME.white} /> {/*[cite: 29] */}
            </View>
          </Animated.View>

          {/* Core Analytics Operational Balances Breakdown Grid Matrix[cite: 29] */}
          <View style={styles.overviewMetricsWrapperGridRow}> {/*[cite: 29] */}
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird, { backgroundColor: "#E7F9EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#16A34A" }]}>Lifetime Quota Settled</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#16A34A" }]}>₹24,000</Text>
              <Text style={styles.metricItemFooterSubtext}>Total cleared funds trail</Text> {/*[cite: 29] */}
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird]}> {/*[cite: 29] */}
              <Text style={styles.metricItemLabelText}>Receipt Tokens Generated</Text> {/*[cite: 29] */}
              <Text style={styles.metricItemBigNumber}>{receiptsDataPool.length} Active PDFs</Text>
              <Text style={styles.metricItemFooterSubtext}>Cryptographically stamped</Text> {/*[cite: 29] */}
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird, { backgroundColor: "#FEF7EE" }]}> {/*[cite: 29] */}
              <Text style={[styles.metricItemLabelText, { color: "#D97706" }]}>System Verification</Text> {/*[cite: 29] */}
              <Text style={[styles.metricItemBigNumber, { color: "#D97706" }]}>100% Secure</Text>
              <Text style={styles.metricItemFooterSubtext}>Audit trail nodes matched</Text> {/*[cite: 29] */}
            </View>
          </View>

          {/* Quick Filter Switching Action Carousel Layout Bar[cite: 29] */}
          <View style={styles.categoryFilterBarSectionContainer}> {/*[cite: 29] */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerLayout}> {/*[cite: 29] */}
              <View style={styles.filterIconBackdropContainerBox}> {/*[cite: 29] */}
                <Filter size={14} color={THEME.darkAccent} /> {/*[cite: 29] */}
              </View>
              {filterReceiptTabs.map((tabLabel, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.filterChipTabUnitCell, selectedTab === tabLabel && styles.activeFilterChipTabUnitCell]} //[cite: 29]
                  onPress={() => setSelectedTab(tabLabel)} //[cite: 29]
                  activeOpacity={0.7} //[cite: 29]
                >
                  <Text style={[styles.filterChipTabLabelTextText, selectedTab === tabLabel && styles.activeFilterChipTabLabelTextText]}> {/*[cite: 29] */}
                    {tabLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Split Screen Grid Architecture Panels (Desktop Double Containers / Mobile In-line Stacks)[cite: 29] */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}> {/*[cite: 29] */}
            
            {/* Left Column Box Window: Interactive Active Receipts Statements Feed */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}> {/*[cite: 29] */}
              
              <View style={styles.searchBarWrapperBackdropControl}> {/*[cite: 29] */}
                <Search size={15} color={THEME.textMuted} style={{ marginRight: 8 }} /> {/*[cite: 29] */}
                <TextInput
                  style={styles.searchInputControlField} //[cite: 29]
                  placeholder="Filter by receipt reference tokens..."
                  placeholderTextColor={THEME.textMuted} //[cite: 29]
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <Text style={styles.blockTitleLabelHeading}>Cleared Transactions Registry</Text> {/*[cite: 29] */}
              
              {filteredReceipts.map((txItem) => {
                const isSelected = activeDetailedReceipt?.id === txItem.id;
                return (
                  <TouchableOpacity 
                    key={txItem.id} 
                    style={[styles.transactionRowCardItemUnit, isSelected && isDesktop && styles.selectedTransactionRowCardItemUnit]}
                    onPress={() => setActiveDetailedReceipt(txItem)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.transactionHighlightVerticalStrip, { backgroundColor: txItem.color }]} /> {/*[cite: 29] */}
                    
                    <View style={styles.transactionCoreLeftContentCluster}> {/*[cite: 29] */}
                      <View style={styles.txMetaHeaderRowLine}> {/*[cite: 29] */}
                        <Text style={styles.txIdStringLabelTextText}>{txItem.id}</Text> {/*[cite: 29] */}
                        <Text style={styles.txDateMutedLabelString}>{txItem.date}</Text>
                      </View>
                      <Text style={styles.txMainTitleHeadingTextText} numberOfLines={1}>{txItem.title}</Text> {/*[cite: 29] */}
                    </View>

                    <View style={styles.transactionRightActionContextBlock}> {/*[cite: 29] */}
                      <Text style={styles.transactionAmountLabelText}>{txItem.amount}</Text> {/*[cite: 29] */}
                      <ChevronRight size={14} color={THEME.textMuted} />
                    </View>
                  </TouchableOpacity>
                );
              })}
              {filteredReceipts.length === 0 && (
                <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No archived payment tokens found matching this telemetry scale index.</Text>
              )}
            </View>

            {/* Right Column Box Window: Detailed Interactive Audit Panel Viewer (Desktop Viewport Variant) */}
            {activeDetailedReceipt && (
              <View style={[styles.detailedAnalyticsPanelCard, isDesktop && styles.desktopFlexProportionWidthRightSide, { marginBottom: isDesktop ? 0 : 32 }]}> {/*[cite: 29] */}
                <View style={styles.cardHeaderWithIconTitleFlexRow}> {/*[cite: 29] */}
                  <Receipt size={16} color={activeDetailedReceipt.color} />
                  <Text style={styles.blockTitleLabelHeading}>Receipt Parameter Verification</Text> {/*[cite: 29] */}
                </View>

                <View style={styles.auditDetailsContentStack}>
                  <Text style={styles.auditMainHeadingTitleText}>{activeDetailedReceipt.title}</Text>
                  
                  <View style={styles.auditFieldsBoxBackdropRowGrid}>
                    <View style={styles.metadataFieldHalfUnit}>
                      <Text style={styles.metadataFieldLabel}>Transaction Reference ID:</Text>
                      <Text style={styles.metadataFieldValue}>{activeDetailedReceipt.id}</Text>
                    </View>
                    <View style={styles.metadataFieldHalfUnit}>
                      <Text style={styles.metadataFieldLabel}>Settlement Date Stamp:</Text>
                      <Text style={styles.metadataFieldValue}>{activeDetailedReceipt.date}</Text>
                    </View>
                    <View style={styles.metadataFieldHalfUnit}>
                      <Text style={styles.metadataFieldLabel}>Authorized Gateway Route:</Text>
                      <Text style={styles.metadataFieldValue}>{activeDetailedReceipt.paymentMode}</Text>
                    </View>
                    <View style={styles.metadataFieldHalfUnit}>
                      <Text style={styles.metadataFieldLabel}>Core Bank Reference PAN:</Text>
                      <Text style={styles.metadataFieldValue}>{activeDetailedReceipt.pan || activeDetailedReceipt.bankRefNo}</Text>
                    </View>
                  </View>

                  <View style={styles.auditHorizontalDividerInternalMetricLine} /> {/*[cite: 29] */}

                  <View style={styles.auditGrandTotalRowLine}>
                    <Text style={styles.grandTotalLabel}>Net Amount Paid Cleared:</Text>
                    <Text style={styles.grandTotalValueText}>{activeDetailedReceipt.amount}</Text>
                  </View>

                  {/* High-End Direct Download Simulated Hook Action Button */}
                  <TouchableOpacity style={styles.downloadOfficialAssetBtn} activeOpacity={0.8}>
                    <Download size={15} color={THEME.white} style={{ marginRight: 6 }} />
                    <Text style={styles.downloadBtnTextContent}>Download Digitally Stamped PDF</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.auditVerificationNoticeSafetyFooterCardStrip, { marginTop: 16 }]}> {/*[cite: 29] */}
                  <Info size={13} color={THEME.darkAccent} /> {/*[cite: 29] */}
                  <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}> {/*[cite: 29] */}
                    This receipt token structure is cryptographically compiled and cleared by university finance systems nodes parameters.
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
  container: { //[cite: 29]
    flex: 1, //[cite: 29]
    backgroundColor: THEME.background, //[cite: 29]
    position: "relative", //[cite: 29]
  },
  fluidBackgroundContainer: { //[cite: 29]
    position: "absolute", //[cite: 29]
    top: 0, //[cite: 29]
    left: -20, //[cite: 29]
    right: 0, //[cite: 29]
    zIndex: -2, //[cite: 29]
    opacity: 0.85, //[cite: 29]
  },
  orb3DOne: { //[cite: 29]
    position: "absolute", //[cite: 29]
    width: 330, //[cite: 29]
    height: 330, //[cite: 29]
    borderRadius: 165, //[cite: 29]
    backgroundColor: "rgba(227, 83, 54, 0.06)", //[cite: 29]
    top: 140, //[cite: 29]
    right: -40, //[cite: 29]
    zIndex: -1, //[cite: 29]
  },
  orb3DTwo: { //[cite: 29]
    position: "absolute", //[cite: 29]
    width: 390, //[cite: 29]
    height: 390, //[cite: 29]
    borderRadius: 195, //[cite: 29]
    backgroundColor: "rgba(160, 82, 45, 0.04)", //[cite: 29]
    bottom: 80, //[cite: 29]
    left: -110, //[cite: 29]
    zIndex: -1, //[cite: 29]
  },
  desktopCenter: { //[cite: 29]
    alignItems: "center", //[cite: 29]
    justifyContent: "center", //[cite: 29]
  },
  mainWrapper: { //[cite: 29]
    width: "100%", //[cite: 29]
    paddingBottom: 40, //[cite: 29]
  },
  desktopWidth: { //[cite: 29]
    maxWidth: 1140, //[cite: 29]
    paddingHorizontal: 20, //[cite: 29]
  },
  pageHeaderBlockCard: { //[cite: 29]
    backgroundColor: THEME.white, //[cite: 29]
    padding: 22, //[cite: 27]
    borderRadius: 26, //[cite: 29]
    marginHorizontal: 16, //[cite: 29]
    marginTop: 22, //[cite: 29]
    flexDirection: "row", //[cite: 29]
    alignItems: "center", //[cite: 29]
    justifyContent: "space-between", //[cite: 29]
    flexWrap: "wrap", //[cite: 29]
    gap: 16, //[cite: 29]
    shadowColor: THEME.darkAccent, //[cite: 29]
    shadowOffset: { width: 0, height: 4 }, //[cite: 29]
    shadowOpacity: 0.04, //[cite: 29]
    shadowRadius: 12, //[cite: 29]
    elevation: 3, //[cite: 29]
  },
  headerLeftCluster: { //[cite: 29]
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
  titleBadgeInlineRow: { //[cite: 29]
    flexDirection: "row", //[cite: 29]
    alignItems: "center", //[cite: 29]
    flexWrap: "wrap", //[cite: 29]
    gap: 10, //[cite: 29]
  },
  pageTitleHeading: { //[cite: 29]
    fontSize: 22,
    fontWeight: "bold",
    color: THEME.textDark, //[cite: 29]
  },
  liveBroadcastBadge: { //[cite: 29]
    flexDirection: "row", //[cite: 29]
    alignItems: "center", //[cite: 29]
    backgroundColor: THEME.primary, //[cite: 29]
    paddingHorizontal: 10, //[cite: 29]
    paddingVertical: 4, //[cite: 29]
    borderRadius: 10, //[cite: 29]
  },
  liveBroadcastBadgeText: { //[cite: 29]
    color: THEME.white, //[cite: 29]
    fontSize: 11, //[cite: 29]
    fontWeight: "700", //[cite: 29]
  },
  pageSubtitleMuted: { //[cite: 29]
    fontSize: 13, //[cite: 29]
    color: THEME.textMuted, //[cite: 29]
    marginTop: 4, //[cite: 29]
    lineHeight: 18, //[cite: 29]
  },
  headerIconCircleBackdrop: { //[cite: 29]
    width: 46, //[cite: 29]
    height: 46, //[cite: 29]
    borderRadius: 23, //[cite: 29]
    backgroundColor: THEME.primary, //[cite: 29]
    justifyContent: "center", //[cite: 29]
    alignItems: "center", //[cite: 29]
  },
  overviewMetricsWrapperGridRow: { //[cite: 29]
    flexDirection: "row", //[cite: 29]
    flexWrap: "wrap", //[cite: 29]
    paddingHorizontal: 12, //[cite: 29]
    marginTop: 20,
  },
  metricCardUnitItem: { //[cite: 29]
    width: "100%", //[cite: 29]
    backgroundColor: THEME.white, //[cite: 29]
    padding: 16, //[cite: 29]
    borderRadius: 22, //[cite: 29]
    marginBottom: 12, //[cite: 29]
    marginHorizontal: 4, //[cite: 29]
    flex: 1, //[cite: 29]
    minWidth: 240, //[cite: 29]
    shadowColor: "#000", //[cite: 29]
    shadowOpacity: 0.02, //[cite: 29]
    shadowRadius: 4, //[cite: 29]
    elevation: 2, //[cite: 29]
  },
  desktopMetricThird: {
    width: "31.33%",
  },
  metricItemLabelText: { //[cite: 29]
    fontSize: 12, //[cite: 29]
    color: THEME.textMuted, //[cite: 29]
    fontWeight: "600", //[cite: 29]
  },
  metricItemBigNumber: { //[cite: 29]
    fontSize: 24, //[cite: 29]
    fontWeight: "800", //[cite: 29]
    color: THEME.textDark, //[cite: 29]
    marginTop: 4, //[cite: 29]
  },
  metricItemFooterSubtext: { //[cite: 29]
    fontSize: 11, //[cite: 29]
    color: THEME.textMuted, //[cite: 29]
    marginTop: 4, //[cite: 29]
  },
  categoryFilterBarSectionContainer: { //[cite: 29]
    marginTop: 14, //[cite: 29]
    paddingLeft: 16, //[cite: 29]
  },
  filterScrollViewInnerLayout: { //[cite: 29]
    alignItems: "center", //[cite: 29]
    gap: 8, //[cite: 29]
    paddingRight: 24, //[cite: 29]
  },
  filterIconBackdropContainerBox: { //[cite: 29]
    width: 36, //
    height: 36, //[cite: 29]
    borderRadius: 10, //[cite: 29]
    backgroundColor: THEME.white, //[cite: 29]
    justifyContent: "center", //[cite: 29]
    alignItems: "center", //[cite: 29]
    marginRight: 4, //[cite: 29]
  },
  filterChipTabUnitCell: { //[cite: 29]
    paddingHorizontal: 16, //[cite: 29]
    paddingVertical: 8, //[cite: 29]
    borderRadius: 12, //[cite: 29]
    backgroundColor: THEME.white, //[cite: 29]
  },
  activeFilterChipTabUnitCell: { //[cite: 29]
    backgroundColor: THEME.primary, //[cite: 29]
  },
  filterChipTabLabelTextText: { //[cite: 29]
    color: THEME.textMuted, //[cite: 29]
    fontSize: 13, //[cite: 29]
    fontWeight: "600", //[cite: 29]
  },
  activeFilterChipTabLabelTextText: { //[cite: 29]
    color: THEME.white, //[cite: 29]
  },
  responsiveSplitMainLayoutFlexContainer: { //[cite: 29]
    paddingHorizontal: 16, //[cite: 29]
    marginTop: 22, //[cite: 29]
    gap: 16, //[cite: 29]
  },
  rowDirectionLayoutGrid: { //[cite: 29]
    flexDirection: "row", //[cite: 29]
  },
  desktopFlexProportionWidth: { //[cite: 29]
    flex: 1.3, //[cite: 29]
  },
  desktopFlexProportionWidthRightSide: { //[cite: 29]
    flex: 1, //[cite: 29]
  },
  listFeedBlockSectionCard: { //[cite: 29]
    backgroundColor: THEME.white, //[cite: 29]
    padding: 20, //[cite: 29]
    borderRadius: 26, //[cite: 29]
    shadowColor: THEME.darkAccent, //[cite: 29]
    shadowOffset: { width: 0, height: 2 }, //[cite: 29]
    shadowOpacity: 0.03, //[cite: 29]
    shadowRadius: 6, //[cite: 29]
    elevation: 2, //[cite: 29]
    gap: 12, //[cite: 29]
  },
  blockTitleLabelHeading: { //[cite: 29]
    fontSize: 15, //[cite: 29]
    fontWeight: "800", //[cite: 29]
    color: THEME.textDark, //[cite: 29]
  },
  searchBarWrapperBackdropControl: { //[cite: 29]
    backgroundColor: "#FDFCF9", //[cite: 29]
    flexDirection: "row", //[cite: 29]
    alignItems: "center", //[cite: 29]
    paddingHorizontal: 14, //[cite: 29]
    borderRadius: 14, //[cite: 14]
    height: 42, //[cite: 29]
    borderWidth: 1, //[cite: 29]
    borderColor: "rgba(160, 82, 45, 0.06)", //[cite: 29]
    marginBottom: 4, //[cite: 29]
  },
  searchInputControlField: { //[cite: 29]
    flex: 1, //[cite: 29]
    color: THEME.textDark, //[cite: 29]
    fontSize: 13, //[cite: 29]
    fontWeight: "500", //[cite: 29]
  },
  transactionRowCardItemUnit: {
    backgroundColor: "#FDFCF9",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)",
    minHeight: 74,
  },
  selectedTransactionRowCardItemUnit: {
    backgroundColor: "#FFF8F5",
    borderColor: "rgba(227, 83, 54, 0.16)",
  },
  transactionHighlightVerticalStrip: {
    width: 5, //[cite: 29]
    height: "100%", //[cite: 29]
  },
  transactionCoreLeftContentCluster: {
    flex: 1, //[cite: 29]
    paddingHorizontal: 14, //[cite: 29]
    gap: 4, //[cite: 29]
  },
  txMetaHeaderRowLine: {
    flexDirection: "row", //[cite: 29]
    alignItems: "center", //[cite: 29]
    gap: 8, //[cite: 29]
  },
  txIdStringLabelTextText: {
    fontSize: 11, //[cite: 29]
    fontWeight: "700", //[cite: 29]
    color: THEME.textMuted, //[cite: 29]
  },
  txDateMutedLabelString: {
    fontSize: 11, //[cite: 29]
    color: THEME.textMuted, //[cite: 29]
    marginLeft: "auto", //[cite: 29]
  },
  txMainTitleHeadingTextText: {
    fontSize: 14, //[cite: 29]
    fontWeight: "700", //[cite: 29]
    color: THEME.textDark, //[cite: 29]
    marginTop: 1, //[cite: 29]
  },
  transactionRightActionContextBlock: {
    alignItems: "center",
    paddingRight: 14,
    gap: 8,
    flexDirection: "row",
  },
  transactionAmountLabelText: {
    fontSize: 15, //[cite: 29]
    fontWeight: "800", //[cite: 29]
    color: "#16A34A", //[cite: 29]
  },
  fallbackEmptyLogsPlaceholderMutedText: {
    fontSize: 12, //[cite: 29]
    color: THEME.textMuted, //[cite: 29]
    fontStyle: "italic", //[cite: 29]
    textAlign: "center", //[cite: 29]
    paddingVertical: 12, //[cite: 29]
  },
  detailedAnalyticsPanelCard: {
    backgroundColor: THEME.white,
    padding: 20,
    borderRadius: 26,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
    alignSelf: "flex-start",
    width: "100%",
  },
  cardHeaderWithIconTitleFlexRow: { //[cite: 29]
    flexDirection: "row", //[cite: 29]
    alignItems: "center", //[cite: 29]
    gap: 10, //[cite: 29]
    borderBottomWidth: 1, //[cite: 29]
    borderBottomColor: "#F5F5F5", //[cite: 29]
    paddingBottom: 12, //[cite: 29]
  },
  auditDetailsContentStack: {
    gap: 12,
    marginTop: 4,
  },
  auditMainHeadingTitleText: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.textDark,
    lineHeight: 22,
  },
  auditFieldsBoxBackdropRowGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    backgroundColor: "#FDFCF9",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
  },
  metadataFieldHalfUnit: {
    width: "48%",
    minWidth: 120,
    gap: 2,
    marginBottom: 4,
  },
  metadataFieldLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  metadataFieldValue: {
    fontSize: 12,
    fontWeight: "750",
    color: THEME.textDark,
  },
  auditHorizontalDividerInternalMetricLine: { //[cite: 29]
    height: 1, //[cite: 29]
    backgroundColor: "#F5F5F5", //[cite: 29]
  },
  auditGrandTotalRowLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  grandTotalLabel: {
    fontSize: 13,
    color: THEME.textMuted,
    fontWeight: "700",
  },
  grandTotalValueText: {
    fontSize: 18,
    fontWeight: "850",
    color: "#16A34A",
  },
  downloadOfficialAssetBtn: {
    backgroundColor: THEME.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  downloadBtnTextContent: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "750",
  },
  auditVerificationNoticeSafetyFooterCardStrip: { //[cite: 29]
    flexDirection: "row", //[cite: 29]
    alignItems: "flex-start", //[cite: 29]
    gap: 8, //[cite: 29]
    marginTop: 2, //[cite: 29]
  },
  auditVerificationNoticeSafetyFooterCardTextText: { //[cite: 29]
    fontSize: 11, //[cite: 29]
    color: THEME.textMuted, //[cite: 29]
    lineHeight: 15, //[cite: 29]
    flex: 1, //[cite: 29]
  },
});