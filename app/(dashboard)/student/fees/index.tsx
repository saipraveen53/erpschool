import { useAuth } from "@/app/contexts/AuthContext";
import { studentdashboardApi } from "@/app/utils/axiosInstance";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowDownToLine,
  ChevronRight,
  Filter,
  Receipt,
  Sparkles
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const THEME = {
  primary: "#E35336",       // Burnt Sienna Main[cite: 21]
  background: "#F5F5DC",    // Beige Tint Base[cite: 21]
  secondary: "#F44460",     // Pastel Salmon Accent[cite: 21]
  darkAccent: "#A0522D",    // Deep Sienna Brown[cite: 21]
  white: "#FFFFFF",         //[cite: 21]
  textDark: "#2C1A14",      //[cite: 21]
  textMuted: "#7A6862",     //[cite: 21]
  glassBg: "rgba(255, 255, 255, 0.76)", //[cite: 21]
  success: "#16A34A"        //[cite: 21]
};

const financialFilterTabs = ["All Invoices", "Pending Dues", "Paid Receipts"];

export default function FeesOverviewDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All Invoices");

  // Dynamic API State Storage Matrix Links[cite: 21]
  const [feeSummary, setFeeSummary] = useState<any>(null);
  const [allFeesList, setAllFeesList] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState(true);

  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  const fetchFeeLedgerTelemetry = async () => {
    try {
      setApiLoading(true);
      const studentId = user?.username || "STU2026004";
      
      const response = await studentdashboardApi.get(`/api/student/fee/student/dashboard/${studentId}`);
      const data = response.data;

      setFeeSummary(data?.summary || { totalFee: 75000, paidAmount: 0, pendingAmount: 75000 });
      
      // Map the primary single allFees array directly from the response[cite: 21]
      setAllFeesList(data?.allFees || []);
    } catch (err) {
      console.error("Error retrieving student dynamic fee billing profiles:", err);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeLedgerTelemetry();

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

  const handlePendingInvoiceSelection = (invoice: any) => {
    router.push({
      pathname: "/student/fees/payment",
      params: {
        feeId: invoice.feeId,
        feeName: invoice.feeName,
        amount: invoice.amount,
        dueDate: invoice.dueDate
      }
    });
  };

  const handleReceiptViewerNavigation = (receipt: any) => {
    router.push({
      pathname: "/student/fees/receipts",
      params: {
        paymentId: `PAY${receipt.feeId?.substring(3) || "2026001"}`,
        feeId: receipt.feeId,
        amount: receipt.amountPaid || receipt.amount,
        paymentDate: new Date().toISOString(),
        method: "PHONEPAY",
        transactionRef: "TXN-300aff6f-b2f4-407b-b455-7fa748b77761"
      }
    });
  };

  // Restructured evaluation interceptor mapping arrays cleanly based on status context parameters[cite: 21]
  const getActiveFilteredTransactions = () => {
    if (selectedTab === "Pending Dues") {
      return allFeesList.filter((item: any) => item.status?.toUpperCase() === "PENDING");
    }
    if (selectedTab === "Paid Receipts") {
      return allFeesList.filter((item: any) => item.status?.toUpperCase() === "PAID");
    }
    return allFeesList;
  };

  const totalFeeAmount = feeSummary?.totalFee || 75000;
  const totalPaidAmount = feeSummary?.paidAmount || 0;
  const billingPaidPercentage = totalFeeAmount > 0 ? Math.round((totalPaidAmount / totalFeeAmount) * 100) : 0;

  if (apiLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingText}>Synchronizing Fee Invoice Statement Records...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <View style={styles.fluidBackgroundContainer} pointerEvents="none">
        <Animated.View style={{ transform: [{ translateX: fluidMoveAnim }] }}>
          <Svg height="350" width={width + 100} viewBox={`0 0 ${width + 100} 350`}>
            <Path d={`M0 130 C ${width / 3} 70, ${(2 * width) / 3} 190, ${width + 100} 110 L ${width + 100} 0 L 0 0 Z`} fill="rgba(227, 83, 54, 0.05)" />
            <Path d={`M0 250 C ${width / 4} 310, ${(3 * width) / 4} 170, ${width + 100} 230 L ${width + 100} 0 L 0 0 Z`} fill="rgba(160, 82, 45, 0.04)" />
          </Svg>
        </Animated.View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollYAnim } } }], { useNativeDriver: true })}
        contentContainerStyle={isDesktop ? styles.desktopCenter : null}
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}>
          
          {/* Top Branding Block Header */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeftCluster}>
              <View style={styles.titleBadgeInlineRow}>
                <Text style={styles.pageTitleHeading}>Fee Accounting Ledger</Text>
                <View style={styles.liveBroadcastBadge}>
                  <Sparkles size={11} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.liveBroadcastBadgeText}>Gateway Sync</Text>
                </View>
              </View>
              <Text style={styles.pageSubtitleMuted}>Comprehensive billing balance overview tracking for active campus enrollment slots.</Text>
            </View>

            {/*<TouchableOpacity style={styles.premiumPaymentRoutingBtn} onPress={() => router.push("/student/fees/payment")} activeOpacity={0.8}>
              <Wallet size={16} color={THEME.white} style={{ marginRight: 6 }} />
              <Text style={styles.paymentBtnLabelTextContent}>Proceed to Online Checkout</Text>
            </TouchableOpacity>*/}
          </Animated.View>

          {/* Metrics Overview Summary Badges */}
          <Text style={styles.sectionHeadingTitle}>Liabilities Matrix Breakdown</Text>
          <View style={styles.overviewMetricsWrapperGridRow}>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth, { backgroundColor: "#FDF0F1" }]}>
              <Text style={[styles.metricItemLabelText, { color: THEME.secondary }]}>Total Outstanding Dues</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.secondary }]}>₹{(feeSummary?.pendingAmount ?? 75000).toLocaleString()}</Text>
              <Text style={styles.metricItemFooterSubtext}>Immediate action status</Text>
            </View>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth, { backgroundColor: "#E7F9EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#16A34A" }]}>Cleared Volume Amount</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#16A34A" }]}>₹{(feeSummary?.paidAmount ?? 0).toLocaleString()}</Text>
              <Text style={styles.metricItemFooterSubtext}>Pushed into bank nodes</Text>
            </View>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricFourth]}>
              <Text style={styles.metricItemLabelText}>Aggregate Total Invoice Pool</Text>
              <Text style={styles.metricItemBigNumber}>₹{(feeSummary?.totalFee ?? 75000).toLocaleString()}</Text>
              <Text style={styles.metricItemFooterSubtext}>Term liabilities baseline</Text>
            </View>
          </View>

          {/* Quick Filter command carousel layout strip */}
          <View style={styles.categoryFilterBarSectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerLayout}>
              <View style={styles.filterIconBackdropContainerBox}><Filter size={14} color={THEME.darkAccent} /></View>
              {financialFilterTabs.map((tabLabel, idx) => (
                <TouchableOpacity key={idx} style={[styles.filterChipTabUnitCell, selectedTab === tabLabel && styles.activeFilterChipTabUnitCell]} onPress={() => setSelectedTab(tabLabel)}>
                  <Text style={[styles.filterChipTabLabelTextText, selectedTab === tabLabel && styles.activeFilterChipTabLabelTextText]}>{tabLabel}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* List Rendering Panel */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid, { marginBottom: isDesktop ? 0 : 48 }]}>
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}>
              <Text style={styles.blockTitleLabelHeading}>Account Statement Registry Logs ({getActiveFilteredTransactions().length})</Text>
              
              {getActiveFilteredTransactions().map((txItem, idx) => {
                // Strictly evaluate status to toggle visual presentation layouts cleanly[cite: 21]
                const isPaidType = txItem.status?.toUpperCase() === "PAID";
                const itemColor = isPaidType ? THEME.success : THEME.primary;

                return (
                  <View key={txItem.feeId || idx} style={styles.transactionRowCardItemUnit}>
                    <View style={[styles.transactionHighlightVerticalStrip, { backgroundColor: itemColor }]} />
                    <View style={styles.transactionCoreLeftContentCluster}>
                      <View style={styles.txMetaHeaderRowLine}>
                        <View style={[styles.txMiniIconBackdropSquare, { backgroundColor: itemColor + "12" }]}><Receipt size={14} color={itemColor} /></View>
                        <Text style={styles.txIdStringLabelTextText}>{txItem.feeId}</Text>
                        <Text style={styles.txDateMutedLabelString}>{txItem.dueDate || "Active Term"}</Text>
                      </View>
                      <Text style={styles.txMainTitleHeadingTextText} numberOfLines={1}>
                        {txItem.feeName || "Academic Assessment Tuition Invoice"}
                      </Text>
                    </View>
                    <View style={styles.transactionRightActionContextBlock}>
                      <Text style={[styles.transactionAmountLabelText, !isPaidType && { color: THEME.secondary }]}>
                        ₹{parseFloat(txItem.amount || "0").toLocaleString()}
                      </Text>
                      {isPaidType ? (
                        <TouchableOpacity style={styles.downloadReceiptMiniActionIconButton} onPress={() => handleReceiptViewerNavigation(txItem)}>
                          <ArrowDownToLine size={13} color={THEME.white} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={styles.payNowMiniTriggerRedirectBtn} onPress={() => handlePendingInvoiceSelection(txItem)}>
                          <ChevronRight size={14} color={THEME.white} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
              {getActiveFilteredTransactions().length === 0 && (
                <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No financial statements or matching transaction records located inside this filter tier.</Text>
              )}
            </View>
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
  titleBadgeInlineRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 },
  pageTitleHeading: { fontSize: 24, fontWeight: "bold", color: THEME.textDark },
  liveBroadcastBadge: { flexDirection: "row", alignItems: "center", backgroundColor: THEME.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  liveBroadcastBadgeText: { color: THEME.white, fontSize: 11, fontWeight: "700" },
  pageSubtitleMuted: { fontSize: 13, color: THEME.textMuted, marginTop: 4, lineHeight: 18 },
  premiumPaymentRoutingBtn: { backgroundColor: THEME.textDark, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  paymentBtnLabelTextContent: { color: THEME.white, fontSize: 13, fontWeight: "750" },
  sectionHeadingTitle: { fontSize: 18, fontWeight: "700", color: THEME.textDark, marginHorizontal: 20, marginTop: 30, marginBottom: 14 },
  overviewMetricsWrapperGridRow: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, marginTop: 4 },
  metricCardUnitItem: { width: "100%", backgroundColor: THEME.white, padding: 16, borderRadius: 22, marginBottom: 12, marginHorizontal: 4, flex: 1, minWidth: 220, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 2 },
  desktopMetricFourth: { width: "31%" },
  metricItemLabelText: { fontSize: 12, color: THEME.textMuted, fontWeight: "600" },
  metricItemBigNumber: { fontSize: 24, fontWeight: "800", color: THEME.textDark, marginTop: 4 },
  metricItemFooterSubtext: { fontSize: 11, color: THEME.textMuted, marginTop: 4 },
  categoryFilterBarSectionContainer: { marginTop: 14, paddingLeft: 16 },
  filterScrollViewInnerLayout: { alignItems: "center", gap: 8, paddingRight: 24 },
  filterIconBackdropContainerBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: THEME.white, justifyContent: "center", itemsAlign: "center", marginRight: 4 },
  filterChipTabUnitCell: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: THEME.white },
  activeFilterChipTabUnitCell: { backgroundColor: THEME.primary },
  filterChipTabLabelTextText: { color: THEME.textMuted, fontSize: 13, fontWeight: "600" },
  activeFilterChipTabLabelTextText: { color: THEME.white },
  responsiveSplitMainLayoutFlexContainer: { paddingHorizontal: 16, marginTop: 22, gap: 16 },
  rowDirectionLayoutGrid: { flexDirection: "row" },
  desktopFlexProportionWidth: { flex: 2 },
  listFeedBlockSectionCard: { backgroundColor: THEME.white, padding: 20, borderRadius: 26, shadowColor: THEME.darkAccent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, gap: 12 },
  blockTitleLabelHeading: { fontSize: 15, fontWeight: "800", color: THEME.textDark },
  transactionRowCardItemUnit: { backgroundColor: "#FDFCF9", borderRadius: 18, flexDirection: "row", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: "rgba(160, 82, 45, 0.05)", minHeight: 74 },
  transactionHighlightVerticalStrip: { width: 5, height: "100%" },
  transactionCoreLeftContentCluster: { flex: 1, paddingHorizontal: 14, gap: 4 },
  txMetaHeaderRowLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  txMiniIconBackdropSquare: { width: 24, height: 24, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  txIdStringLabelTextText: { fontSize: 11, fontWeight: "700", color: THEME.textMuted },
  txDateMutedLabelString: { fontSize: 11, color: THEME.textMuted, marginLeft: "auto" },
  txMainTitleHeadingTextText: { fontSize: 14, fontWeight: "700", color: THEME.textDark, marginTop: 1 },
  transactionRightActionContextBlock: { alignItems: "center", paddingRight: 14, gap: 8, flexDirection: "row" },
  transactionAmountLabelText: { fontSize: 15, fontWeight: "800", color: "#16A34A" },
  downloadReceiptMiniActionIconButton: { width: 24, height: 24, borderRadius: 8, backgroundColor: THEME.primary, justifyContent: "center", alignItems: "center" },
  payNowMiniTriggerRedirectBtn: { width: 24, height: 24, borderRadius: 8, backgroundColor: THEME.textDark, justifyContent: "center", alignItems: "center" },
  fallbackEmptyLogsPlaceholderMutedText: { fontSize: 12, color: THEME.textMuted, fontStyle: "italic", textAlign: "center", paddingVertical: 12 }
});