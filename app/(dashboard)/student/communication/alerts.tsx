 
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  Bell,
  Bus,
  ChevronRight,
  Filter,
  Info,
  Megaphone,
  ShieldAlert,
  Sparkles
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
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
import Svg, { Path } from "react-native-svg";


const THEME = {
  primary: "#E35336",       // Burnt Sienna Main
  background: "#F5F5DC",    // Beige Tint Base
  secondary: "#F44460",     // Pastel Salmon Accent
  darkAccent: "#A0522D",    // Deep Sienna Brown
  white: "#FFFFFF",         //
  textDark: "#2C1A14",      //
  textMuted: "#7A6862",      //
  glassBg: "rgba(255, 255, 255, 0.76)",
};

const filterTabs = ["All Alerts", "Urgent Only", "Academic Logs", "Transport Route"];

const criticalAlertsPool = [
  {
    id: "ALT-7701",
    type: "Urgent",
    iconType: "emergency",
    title: "Heavy Rainfall Delay Advisory",
    message: "Due to heavy logging rainfall blocks around Zone 4 junctions, route R-101 evening school transit bus dispatch sequence might be delayed by 25 minutes. Track live stream vector sync coordinates inside transport tab grid.",
    timestamp: "10 mins ago",
    sender: "Administration Desk",
    color: "#E35336"
  },
  {
    id: "ALT-7592",
    type: "Transport Route",
    iconType: "transport",
    title: "School Bus Route Swap Alert",
    message: "Emergency road maintenance works detected on Shivaji Park intersection bypass point. School Bus R-101 will divert through Sai Nagar sub-junction lane parameter permanently for this entire term cycle.",
    timestamp: "2 hours ago",
    sender: "Logistics Controller",
    color: "#A0522D"
  },
  {
    id: "ALT-7401",
    type: "Academic Logs",
    iconType: "academic",
    title: "Mid-Term Evaluation Schedule Change",
    message: "The Grade 4 mathematics evaluation matrix milestone test scheduled for upcoming Monday has been pushed back to Wednesday morning session frame. Syllabus index modules parameters stay intact.",
    timestamp: "1 day ago",
    sender: "Academic Coordinator",
    color: "#D97706"
  }
];

export default function CommunicationAlertsDashboard() {
  const router = useRouter(); //
  const { user } = useAuth(); //
  const [refreshing, setRefreshing] = useState(false); //
  const [selectedTab, setSelectedTab] = useState("All Alerts");
  const [activeDetailedAlert, setActiveDetailedAlert] = useState<any>(criticalAlertsPool[0]);

  const { width } = Dimensions.get("window"); //
  const isDesktop = width > 768; //

  // Parallax Fluid 3D Layers Control Vectors Setup
  const scrollYAnim = useRef(new Animated.Value(0)).current; //
  const fadeAnim = useRef(new Animated.Value(0)).current; //
  const slideAnim = useRef(new Animated.Value(45)).current; //
  const fluidMoveAnim = useRef(new Animated.Value(0)).current; //

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }), //
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }), //
    ]).start();

    // Constant non-intrusive ambient rotation background float matrix
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
    setRefreshing(true); //
    setTimeout(() => setRefreshing(false), 1000); //
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
    outputRange: [-20, 25, -20], //
  });

  // Render correct icon indicator depending on telemetry type
  const renderAlertIcon = (iconType: string, color: string) => {
    switch (iconType) {
      case "emergency": return <ShieldAlert size={18} color={color} />;
      case "transport": return <Bus size={18} color={color} />;
      default: return <Megaphone size={18} color={color} />;
    }
  };

  // Filters mapping helper function context matcher 
  const filteredAlerts = criticalAlertsPool.filter(item => {
    if (selectedTab === "Urgent Only") return item.type === "Urgent";
    if (selectedTab === "Academic Logs") return item.type === "Academic Logs";
    if (selectedTab === "Transport Route") return item.type === "Transport Route";
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Background Curved Liquid Arcs Vector Overlay Graphic Canvas */}
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} //
        contentContainerStyle={isDesktop ? styles.desktopCenter : null} //
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}> {/* */}
          
          {/* Top Main Branding Header Card Element */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeftCluster}>
              <View style={styles.titleBadgeInlineRow}>
                <Text style={styles.pageTitleHeading}>Emergency Bulletins Hub</Text>
                <View style={styles.liveBroadcastBadge}>
                  <Sparkles size={12} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.liveBroadcastBadgeText}>Live Ingress</Text>
                </View>
              </View>
              <Text style={styles.pageSubtitleMuted}>Advance Administration real-time security warning framework records</Text>
            </View>
            <View style={styles.headerIconCircleBackdrop}>
              <Bell size={22} color={THEME.white} />
            </View>
          </Animated.View>

          {/* Core Analytics Counter Overview Badges Block Grid */}
          <View style={styles.overviewMetricsWrapperGridRow}>
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird]}>
              <Text style={styles.metricItemLabelText}>Bulletins Logged</Text>
              <Text style={styles.metricItemBigNumber}>{criticalAlertsPool.length} Active</Text>
              <Text style={styles.metricItemFooterSubtext}>Aggregated historical term log</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird, { backgroundColor: "#FDF0F1" }]}>
              <Text style={[styles.metricItemLabelText, { color: THEME.secondary }]}>Severe High-Priority Alerts</Text>
              <Text style={[styles.metricItemBigNumber, { color: THEME.secondary }]}>1 Critical</Text>
              <Text style={styles.metricItemFooterSubtext}>Requires immediate check sync</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird, { backgroundColor: "#FEF7EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#D97706" }]}>System Ingress Channel</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#D97706" }]}>Auto-Sync</Text>
              <Text style={styles.metricItemFooterSubtext}>Secure server handshake stable</Text>
            </View>
          </View>

          {/* Category Filter Horizontal Carousel Command Switcher Layout Bar */}
          <View style={styles.categoryFilterBarSectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerLayout}>
              <View style={styles.filterIconBackdropContainerBox}>
                <Filter size={14} color={THEME.darkAccent} />
              </View>
              {filterTabs.map((tabLabel, idx) => (
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

          {/* Split Screen Dynamic Fluid Layout Setup (Desktop Dual Windows / Stacks Mobile) */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            
            {/* Left Box Component Window: Active Filtered List Entries Feed */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}>
              <Text style={styles.blockTitleLabelHeading}>Broadcast Logs Stack Registry</Text>
              {filteredAlerts.map((alertItem) => {
                const isSelected = activeDetailedAlert?.id === alertItem.id;
                return (
                  <TouchableOpacity
                    key={alertItem.id}
                    style={[styles.alertLogListItemRowCardUnit, isSelected && styles.selectedAlertLogListItemRowCardUnit]}
                    onPress={() => setActiveDetailedAlert(alertItem)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.alertLogVerticalHighlightStrip, { backgroundColor: alertItem.color }]} />
                    
                    <View style={styles.alertLogContentCoreBlockLeft}>
                      <View style={styles.alertLogIconAndIdHeaderRow}>
                        <View style={[styles.alertLogMiniIconBackdrop, { backgroundColor: alertItem.color + "15" }]}>
                          {renderAlertIcon(alertItem.iconType, alertItem.color)}
                        </View>
                        <Text style={styles.alertLogIdLabelStringText}>{alertItem.id}</Text>
                        <Text style={styles.alertLogTimestampTextString}>{alertItem.timestamp}</Text>
                      </View>
                      
                      <Text style={styles.alertLogMainTitleHeadingTextText} numberOfLines={1}>{alertItem.title}</Text>
                      <Text style={styles.alertLogMessageExcerptSnippet} numberOfLines={2}>{alertItem.message}</Text>
                    </View>

                    <ChevronRight size={16} color={THEME.textMuted} style={{ marginRight: 12 }} />
                  </TouchableOpacity>
                );
              })}
              {filteredAlerts.length === 0 && (
                <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No alerts mapped matching the selected telemetry parameters folder.</Text>
              )}
            </View>

            {/* Right Box Component Window: Detailed Audit Visualizer Inspection Panel Container Box */}
            {activeDetailedAlert && (
              <View style={[styles.detailedAuditInspectionPanelCard, isDesktop && styles.desktopFlexProportionWidthRightSide]}>
                <View style={styles.auditHeaderTopBarClusterRow}>
                  <View style={styles.auditTitleClusterLeft}>
                    <AlertCircle size={18} color={activeDetailedAlert.color} />
                    <Text style={styles.auditBlockTitleLabelText}>Detailed Ledger Inspection Audit</Text>
                  </View>
                  <View style={[styles.auditCategoryBadgeCapsule, { backgroundColor: activeDetailedAlert.color + "15" }]}>
                    <Text style={[styles.auditCategoryBadgeLabelStringText, { color: activeDetailedAlert.color }]}>
                      {activeDetailedAlert.type}
                    </Text>
                  </View>
                </View>

                <View style={styles.auditContentCoreBodyTextStack}>
                  <Text style={styles.auditMainHeadingTitleBigText}>{activeDetailedAlert.title}</Text>
                  
                  <View style={styles.auditMetadataFieldsFlexGridInlineBox}>
                    <View style={styles.metadataFieldColumnHalfItemUnit}>
                      <Text style={styles.metadataFieldLabelMutedTitleText}>Dispatched From Authority:</Text>
                      <Text style={styles.metadataFieldValueHeadingBoldText}>{activeDetailedAlert.sender}</Text>
                    </View>
                    <View style={styles.metadataFieldColumnHalfItemUnit}>
                      <Text style={styles.metadataFieldLabelMutedTitleText}>Handshake Latency Metric:</Text>
                      <Text style={styles.metadataFieldValueHeadingBoldText}>{activeDetailedAlert.timestamp}</Text>
                    </View>
                  </View>

                  <View style={styles.auditHorizontalDividerInternalMetricLine} />

                  <View style={styles.auditMessageParagraphHolderGlassBox}>
                    <Text style={styles.auditMessageParagraphBodyText}>{activeDetailedAlert.message}</Text>
                  </View>

                  <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}>
                    <Info size={14} color={THEME.darkAccent} />
                    <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}>
                      This alert has been cryptographically signed and routed automatically by Campus Safe synchronization servers link parameters channel.
                    </Text>
                  </View>
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
    gap: 16,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  headerLeftCluster: {
    flex: 1,
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
  headerIconCircleBackdrop: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  overviewMetricsWrapperGridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginTop: 20,
  },
  metricCardUnitItem: {
    width: "100%",
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    marginHorizontal: 4,
    flex: 1,
    minWidth: 240,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  desktopMetricThird: {
    width: "31.33%",
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
    marginTop: 18,
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
    flex: 1.25,
  },
  desktopFlexProportionWidthRightSide: {
    flex: 1,
  },
  listFeedBlockSectionCard: {
    backgroundColor: THEME.white,
    padding: 18,
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
    fontWeight: "700",
    color: THEME.textDark,
    marginBottom: 4,
  },
  alertLogListItemRowCardUnit: {
    backgroundColor: "#FDFCF9",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)",
  },
  selectedAlertLogListItemRowCardUnit: {
    backgroundColor: "#FFF8F5",
    borderColor: "rgba(227, 83, 54, 0.2)",
    shadowColor: THEME.primary,
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  alertLogVerticalHighlightStrip: {
    width: 5,
    height: "100%",
  },
  alertLogContentCoreBlockLeft: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  alertLogIconAndIdHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertLogMiniIconBackdrop: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  alertLogIdLabelStringText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textMuted,
  },
  alertLogTimestampTextString: {
    fontSize: 11,
    color: THEME.textMuted,
    marginLeft: "auto",
  },
  alertLogMainTitleHeadingTextText: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.textDark,
    marginTop: 2,
  },
  alertLogMessageExcerptSnippet: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 16,
    marginTop: 2,
  },
  fallbackEmptyLogsPlaceholderMutedText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  detailedAuditInspectionPanelCard: {
    backgroundColor: THEME.white,
    borderRadius: 26,
    padding: 20,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
    alignSelf: "flex-start",
    width: "100%",
  },
  auditHeaderTopBarClusterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 14,
  },
  auditTitleClusterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  auditBlockTitleLabelText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textDark,
  },
  auditCategoryBadgeCapsule: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  auditCategoryBadgeLabelStringText: {
    fontSize: 11,
    fontWeight: "700",
  },
  auditContentCoreBodyTextStack: {
    marginTop: 16,
    gap: 14,
  },
  auditMainHeadingTitleBigText: {
    fontSize: 19,
    fontWeight: "800",
    color: THEME.textDark,
    lineHeight: 25,
  },
  auditMetadataFieldsFlexGridInlineBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    backgroundColor: "#FDFCF9",
    padding: 12,
    borderRadius: 14,
  },
  metadataFieldColumnHalfItemUnit: {
    flex: 1,
    minWidth: 110,
    gap: 2,
  },
  metadataFieldLabelMutedTitleText: {
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: "500",
  },
  metadataFieldValueHeadingBoldText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textDark,
  },
  auditHorizontalDividerInternalMetricLine: {
    height: 1,
    backgroundColor: "#F5F5F5",
  },
  auditMessageParagraphHolderGlassBox: {
    backgroundColor: THEME.background,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)",
  },
  auditMessageParagraphBodyText: {
    fontSize: 13,
    color: THEME.textDark,
    lineHeight: 21,
    fontWeight: "500",
  },
  auditVerificationNoticeSafetyFooterCardStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 4,
  },
  auditVerificationNoticeSafetyFooterCardTextText: {
    fontSize: 11,
    color: THEME.textMuted,
    lineHeight: 15,
    flex: 1,
  },
});