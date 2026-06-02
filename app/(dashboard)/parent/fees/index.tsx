 
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowDownToLine,
  ChevronRight,
  Filter,
  Info,
  Receipt,
  Sparkles,
  Wallet
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
};

const financialFilterTabs = ["All Invoices", "Pending Dues", "Paid Receipts"];

const outstandingDuesSummary = {
  totalOutstanding: "₹18,500",
  tuitionFee: "₹15,000",
  transportFee: "₹2,500",
  activityCharges: "₹1,000",
  dueDate: "June 15, 2026",
  complianceStatus: "Action Required",
};

const feeTransactionsPool = [
  { id: "INV-9902", title: "Quarter 2 Tuition Quota Invoice", type: "Tuition", amount: "₹15,000", status: "Pending", color: "#E35336", date: "Due by Jun 15, 2026", hasReceipt: false },
  { id: "INV-9612", title: "Term 2 Bus Transport Fee Route 101", type: "Transport", amount: "₹2,500", status: "Pending", color: "#A0522D", date: "Due by Jun 15, 2026", hasReceipt: false },
  { id: "RCT-4102", title: "Quarter 1 Term Assessment Enrollment", type: "Academic", amount: "₹18,000", status: "Paid", color: "#16A34A", date: "Paid on Apr 10, 2026", hasReceipt: true, fileName: "receipt_q1_tuition.pdf" },
  { id: "RCT-3941", title: "Annual Sports Kit & Activity Charges", type: "Activity", amount: "₹3,500", status: "Paid", color: "#16A34A", date: "Paid on Mar 05, 2026", hasReceipt: true, fileName: "receipt_sports_kit.pdf" },
];

export default function FeesOverviewDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All Invoices");

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  // 3D Matrix & Background Parallax Layer Transform Systems
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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Interpolation calculations for real-time 3D parallax manually driven layout shifting
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

  // Circular Chart Computation (Paid ₹21,500 vs Pending ₹18,500 Total Pool Representation Ratio)
  const chartRadius = 45;
  const chartCircumference = 2 * Math.PI * chartRadius;
  const billingPaidPercentage = 54; // 54% of term lifecycle liabilities cleared
  const strokeDashoffsetVal = chartCircumference - (billingPaidPercentage / 100) * chartCircumference;

  const filteredTransactions = feeTransactionsPool.filter(item => {
    if (selectedTab === "Pending Dues") return item.status === "Pending";
    if (selectedTab === "Paid Receipts") return item.status === "Paid";
    return true;
  });

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

      {/* Floating Space Blurred Parallax Glassmorphism Orbs */}
      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} />
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} />

      {/* PURE HAND-DRIVEN SCROLL ONLY: Auto-scroll intervals are completely stripped out */}
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
          
          {/* Top Main Branding Header Card Element */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeftCluster}>
              <View style={styles.titleBadgeInlineRow}>
                <Text style={styles.pageTitleHeading}>Fee Accounting Ledger</Text>
                <View style={styles.liveBroadcastBadge}>
                  <Sparkles size={11} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.liveBroadcastBadgeText}>Gateway Sync</Text>
                </View>
              </View>
              <Text style={styles.pageSubtitleMuted}>Advance Administration comprehensive billing statement liability records tracking</Text>
            </View>

            {/* Direct Link Trigger to payment.tsx */}
            <TouchableOpacity 
              style={styles.premiumPaymentRoutingBtn} 
              onPress={() => router.push("/parent/fees/payment")}
              activeOpacity={0.8}
            >
              <Wallet size={16} color={THEME.white} style={{ marginRight: 6 }} />
              <Text style={styles.paymentBtnLabelTextContent}>Proceed to Online Checkout</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Core Analytics Operational Balances Breakdown Grid Matrix */}
          <Text style={styles.sectionHeadingTitle}>Liabilities Matrix Breakdown</Text>
          <View style={styles.overviewMetricsWrapperGridRow}>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth, { backgroundColor: "#FDF0F1" }]}>
              <Text style={[styles.metricItemLabelText, { color: THEME.secondary }]}>Total Outstanding Dues</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.secondary }]}>{outstandingDuesSummary.totalOutstanding}</Text>
              <Text style={styles.metricItemFooterSubtext}>Due timeline: {outstandingDuesSummary.dueDate}</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth]}>
              <Text style={styles.metricItemLabelText}>Tuition Pool Allocations</Text>
              <Text style={styles.metricItemBigNumber}>{outstandingDuesSummary.tuitionFee}</Text>
              <Text style={styles.metricItemFooterSubtext}>Mid-Term academic block</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth]}>
              <Text style={styles.metricItemLabelText}>Transport Route Fee Pool</Text>
              <Text style={styles.metricItemBigNumber}>{outstandingDuesSummary.transportFee}</Text>
              <Text style={styles.metricItemFooterSubtext}>School Bus route R-101 logistics</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth]}>
              <Text style={styles.metricItemLabelText}>Co-Scholastic Activities</Text>
              <Text style={styles.metricItemBigNumber}>{outstandingDuesSummary.activityCharges}</Text>
              <Text style={styles.metricItemFooterSubtext}>Sports & event lab overheads</Text>
            </View>
          </View>

          {/* Quick Filter Switching Action Carousel Layout Bar */}
          <View style={styles.categoryFilterBarSectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerLayout}>
              <View style={styles.filterIconBackdropContainerBox}>
                <Filter size={14} color={THEME.darkAccent} />
              </View>
              {financialFilterTabs.map((tabLabel, idx) => (
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

          {/* Split Screen Grid Architecture Panels (Desktop Double Containers / Mobile In-line Stacks) */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid, {marginBottom: isDesktop ? 0 : 32}]}>
            
            {/* Left Column Box Window: Interactive Active Transactions Statements Feed */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}>
              <Text style={styles.blockTitleLabelHeading}>Account Statement Statement Registry Logs</Text>
              
              {filteredTransactions.map((txItem) => {
                const isPaid = txItem.status === "Paid";
                return (
                  <View key={txItem.id} style={styles.transactionRowCardItemUnit}>
                    <View style={[styles.transactionHighlightVerticalStrip, { backgroundColor: txItem.color }]} />
                    
                    <View style={styles.transactionCoreLeftContentCluster}>
                      <View style={styles.txMetaHeaderRowLine}>
                        <View style={[styles.txMiniIconBackdropSquare, { backgroundColor: txItem.color + "12" }]}>
                          <Receipt size={14} color={txItem.color} />
                        </View>
                        <Text style={styles.txIdStringLabelTextText}>{txItem.id}</Text>
                        <Text style={styles.txDateMutedLabelString}>{txItem.date}</Text>
                      </View>
                      
                      <Text style={styles.txMainTitleHeadingTextText} numberOfLines={1}>{txItem.title}</Text>
                    </View>

                    {/* Right Side Conditional Action Trigger Module (Pay Now Link vs Download Receipts) */}
                    <View style={styles.transactionRightActionContextBlock}>
                      <Text style={[styles.transactionAmountLabelText, !isPaid && { color: THEME.secondary }]}>{txItem.amount}</Text>
                      
                      {isPaid ? (
                        <TouchableOpacity 
                          style={styles.downloadReceiptMiniActionIconButton} 
                          onPress={() => txItem.hasReceipt && router.push("/parent/fees/receipts")}
                          activeOpacity={0.75}
                        >
                          <ArrowDownToLine size={13} color={THEME.white} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity 
                          style={styles.payNowMiniTriggerRedirectBtn}
                          onPress={() => router.push("/parent/fees/payment")}
                          activeOpacity={0.75}
                        >
                          <ChevronRight size={14} color={THEME.white} />
                        </TouchableOpacity>
                      )}
                    </View>

                  </View>
                );
              })}
              {filteredTransactions.length === 0 && (
                <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No financial statements or matching transaction records located inside this filter tier.</Text>
              )}
            </View>

            {/* Right Column Box Window: Desktop Only Canvas Vector Percentage Visualizer Panel */}
            {isDesktop && (
              <View style={[styles.detailedAnalyticsRadialCardPanel, styles.desktopFlexProportionWidthRightSide]}>
                <View style={styles.cardHeaderWithIconTitleFlexRow}>
                  <Wallet size={16} color={THEME.darkAccent} />
                  <Text style={styles.blockTitleLabelHeading}>Term Liability Clearance Curve</Text>
                </View>

                <View style={styles.radialGraphCanvasHolderHolder}>
                  <Svg height="120" width="120" viewBox="0 0 110 110">
                    <G rotate="-90" origin="55, 55">
                      <Circle cx="55" cy="55" r={chartRadius} stroke="#F3ECE7" strokeWidth="9" fill="transparent" />
                      <Circle
                        cx="55"
                        cy="55"
                        r={chartRadius}
                        stroke="#16A34A"
                        strokeWidth="9"
                        fill="transparent"
                        strokeDasharray={chartCircumference}
                        strokeDashoffset={strokeDashoffsetVal}
                        strokeLinecap="round"
                      />
                    </G>
                  </Svg>
                  <View style={styles.radialChartAbsoluteLabelsCenterBlock}>
                    <Text style={styles.radialChartBigPercentageText}>{billingPaidPercentage}%</Text>
                    <Text style={styles.radialChartMutedSubtext}>Cleared</Text>
                  </View>
                </View>

                <View style={styles.auditHorizontalDividerInternalMetricLine} />

                <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}>
                  <Info size={13} color={THEME.darkAccent} />
                  <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}>
                    Real-time payment clearance curves scale mathematically mapped across global structural assets configurations listed inside current semester portfolio logs.
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
    width: 330,
    height: 330,
    borderRadius: 165,
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
    left: -110,
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
  pageHeaderBlockCard: {
    backgroundColor: THEME.white,
    padding: 22,
    borderRadius: 26,
    marginHorizontal: 16,
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  headerLeftCluster: {
    flex: 1,
    minWidth: 280,
  },
  titleBadgeInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  pageTitleHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  liveBroadcastBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveBroadcastBadgeText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "700",
  },
  pageSubtitleMuted: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  premiumPaymentRoutingBtn: {
    backgroundColor: THEME.textDark,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  paymentBtnLabelTextContent: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "750",
  },
  sectionHeadingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.textDark,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 14,
  },
  overviewMetricsWrapperGridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginTop: 4,
  },
  metricCardUnitItem: {
    width: "100%",
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    marginHorizontal: 4,
    flex: 1,
    minWidth: 220,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  desktopMetricFourth: {
    width: "23%",
  },
  metricItemLabelText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  metricItemBigNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: THEME.textDark,
    marginTop: 4,
  },
  metricItemFooterSubtext: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 4,
  },
  categoryFilterBarSectionContainer: {
    marginTop: 14,
    paddingLeft: 16,
  },
  filterScrollViewInnerLayout: {
    alignItems: "center",
    gap: 8,
    paddingRight: 24,
  },
  filterIconBackdropContainerBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  filterChipTabUnitCell: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: THEME.white,
  },
  activeFilterChipTabUnitCell: {
    backgroundColor: THEME.primary,
  },
  filterChipTabLabelTextText: {
    color: THEME.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  activeFilterChipTabLabelTextText: {
    color: THEME.white,
  },
  responsiveSplitMainLayoutFlexContainer: {
    paddingHorizontal: 16,
    marginTop: 22,
    gap: 16,
  },
  rowDirectionLayoutGrid: {
    flexDirection: "row",
  },
  desktopFlexProportionWidth: {
    flex: 1.3,
  },
  desktopFlexProportionWidthRightSide: {
    flex: 1,
  },
  listFeedBlockSectionCard: {
    backgroundColor: THEME.white,
    padding: 20,
    borderRadius: 26,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  blockTitleLabelHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.textDark,
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
  transactionHighlightVerticalStrip: {
    width: 5,
    height: "100%",
  },
  transactionCoreLeftContentCluster: {
    flex: 1,
    paddingHorizontal: 14,
    gap: 4,
  },
  txMetaHeaderRowLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  txMiniIconBackdropSquare: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  txIdStringLabelTextText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textMuted,
  },
  txDateMutedLabelString: {
    fontSize: 11,
    color: THEME.textMuted,
    marginLeft: "auto",
  },
  txMainTitleHeadingTextText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textDark,
    marginTop: 1,
  },
  transactionRightActionContextBlock: {
    alignItems: "flex-end",
    paddingRight: 14,
    gap: 6,
  },
  transactionAmountLabelText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#16A34A",
  },
  downloadReceiptMiniActionIconButton: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  payNowMiniTriggerRedirectBtn: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: THEME.textDark,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackEmptyLogsPlaceholderMutedText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  detailedAnalyticsRadialCardPanel: {
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
  cardHeaderWithIconTitleFlexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 12,
  },
  radialGraphCanvasHolderHolder: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    height: 130,
    width: "100%",
    marginTop: 10,
  },
  radialChartAbsoluteLabelsCenterBlock: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  radialChartBigPercentageText: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.textDark,
  },
  radialChartMutedSubtext: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  auditHorizontalDividerInternalMetricLine: {
    height: 1,
    backgroundColor: "#F5F5F5",
  },
  auditVerificationNoticeSafetyFooterCardStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 2,
  },
  auditVerificationNoticeSafetyFooterCardTextText: {
    fontSize: 11,
    color: THEME.textMuted,
    lineHeight: 15,
    flex: 1,
  },
});