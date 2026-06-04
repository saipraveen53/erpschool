  
 
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowDownToLine,
  ChevronRight,
  FileText,
  Filter,
  Info,
  Megaphone,
  Search,
  Sparkles
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
  primary: "#E35336",       // Burnt Sienna Main[cite: 17]
  background: "#F5F5DC",    // Beige Tint Base[cite: 17]
  secondary: "#F44460",     // Pastel Salmon Accent[cite: 17]
  darkAccent: "#A0522D",    // Deep Sienna Brown[cite: 17]
  white: "#FFFFFF",         //[cite: 17]
  textDark: "#2C1A14",      //[cite: 17]
  textMuted: "#7A6862",      //[cite: 17]
  glassBg: "rgba(255, 255, 255, 0.76)", //[cite: 17]
};

const filterTabs = ["All Notices", "Academic", "Circulars", "Events"];

const noticesDataPool = [
  {
    id: "NTC-4401",
    category: "Circulars",
    title: "Annual Science Exhibition Registration",
    summary: "Registrations for the upcoming Campus Safe Science Exhibition 2026 are officially open.",
    content: "We are pleased to invite all students from Grade 1 to 5 to participate in our Annual Science Exhibition. This year's focus is on sustainable engineering and clean telemetry systems. Parents can assist in project creation but live experiments should be student-driven.",
    date: "May 29, 2026",
    postedBy: "Principal's Office",
    hasAttachment: true,
    fileName: "science_expo_guidelines.pdf",
    color: "#E35336"
  },
  {
    id: "NTC-4382",
    category: "Academic",
    title: "Second Academic Term Book Distribution",
    summary: "Distribution of secondary course ledger textbook modules begins from next Monday morning.",
    content: "Please ensure all previous term term finance clear vouchers are updated at the counter before collecting the new term textbooks syllabus stack. Collection hours will be from 09:00 AM to 01:00 PM at the main administration block.",
    date: "May 25, 2026",
    postedBy: "Academic Registrar",
    hasAttachment: false,
    fileName: "",
    color: "#A0522D"
  },
  {
    id: "NTC-4102",
    category: "Events",
    title: "Parent-Teacher Interaction Meet Up",
    summary: "Mandatory mid-term tracking dialogue panel meeting structured inside campus auditorium.",
    content: "Join us for an analytical individual matrix evaluation feedback review session with your child's class teachers. Individual timeslots matching your roll number will be broadcasted on your private chat feed.",
    date: "May 18, 2026",
    postedBy: "Coordinator Desk",
    hasAttachment: true,
    fileName: "pti_schedule_terms.pdf",
    color: "#D97706"
  }
];

export default function CommunicationNoticesDashboard() {
  const router = useRouter(); //[cite: 17]
  const { user } = useAuth(); //[cite: 17]
  const [refreshing, setRefreshing] = useState(false); //[cite: 17]
  const [searchQuery, setSearchQuery] = useState(""); //[cite: 17]
  const [selectedTab, setSelectedTab] = useState("All Notices");
  const [activeDetailedNotice, setActiveDetailedNotice] = useState<any>(noticesDataPool[0]);

  const { width } = Dimensions.get("window"); //[cite: 17]
  const isDesktop = width > 768; //[cite: 17]

  // 3D Matrix Background Parallax Animation Configs
  const scrollYAnim = useRef(new Animated.Value(0)).current; //[cite: 17]
  const fadeAnim = useRef(new Animated.Value(0)).current; //[cite: 17]
  const slideAnim = useRef(new Animated.Value(45)).current; //[cite: 17]
  const fluidMoveAnim = useRef(new Animated.Value(0)).current; //[cite: 17]

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }), //[cite: 17]
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }), //[cite: 17]
    ]).start();

    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 16000, //[cite: 17]
        easing: Easing.inOut(Easing.sin), //[cite: 17]
        useNativeDriver: true, //[cite: 17]
      })
    ).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true); //[cite: 17]
    setTimeout(() => setRefreshing(false), 1000); //[cite: 17]
  };

  // Parallax transformations driven exclusively by manual scroll gestures
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [40, 0, -85], //[cite: 17]
    extrapolate: "clamp", //[cite: 17]
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 600],
    outputRange: [-25, 0, 60], //[cite: 17]
    extrapolate: "clamp", //[cite: 17]
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20], //[cite: 17]
  });

  const filteredNotices = noticesDataPool.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedTab === "Academic") return item.category === "Academic";
    if (selectedTab === "Circulars") return item.category === "Circulars";
    if (selectedTab === "Events") return item.category === "Events";
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}> {/*[cite: 17] */}
      <StatusBar style="dark" /> {/*[cite: 17] */}

      {/* SVG Background Fluids Graphic Canvas Layer */}
      <View style={styles.fluidBackgroundContainer} pointerEvents="none"> {/*[cite: 17] */}
        <Animated.View style={{ transform: [{ translateX: fluidHorizontalX }] }}> {/*[cite: 17] */}
          <Svg height="350" width={width + 100} viewBox={`0 0 ${width + 100} 350`}> {/*[cite: 17] */}
            <Path
              d={`M0 130 C ${width / 3} 70, ${(2 * width) / 3} 190, ${width + 100} 110 L ${width + 100} 0 L 0 0 Z`} //[cite: 17]
              fill="rgba(227, 83, 54, 0.05)" //[cite: 17]
            />
            <Path
              d={`M0 250 C ${width / 4} 310, ${(3 * width) / 4} 170, ${width + 100} 230 L ${width + 100} 0 L 0 0 Z`} //[cite: 17]
              fill="rgba(160, 82, 45, 0.04)" //[cite: 17]
            />
          </Svg>
        </Animated.View>
      </View>

      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} /> {/*[cite: 17] */}
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} /> {/*[cite: 17] */}

      {/* NO AUTO SCROLL: Pure manual tracking configuration loop gesture */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} //[cite: 17]
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }], //[cite: 17]
          { useNativeDriver: true } //[cite: 17]
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} //[cite: 17]
        contentContainerStyle={isDesktop ? styles.desktopCenter : null} //[cite: 17]
      >
        <View style={[styles.mainWrapper, isDesktop && styles.desktopWidth]}> {/*[cite: 17] */}
          
          {/* Top Page Header Profile Branding Section */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> {/*[cite: 17] */}
            <View style={styles.headerLeftCluster}> {/*[cite: 17] */}
              <View style={styles.titleBadgeInlineRow}> {/*[cite: 17] */}
                <Text style={styles.pageTitleHeading}>Broadcast Notices Board</Text> {/*[cite: 17] */}
                <View style={styles.liveBroadcastBadge}> {/*[cite: 17] */}
                  <Sparkles size={11} color={THEME.white} style={{ marginRight: 4 }} /> {/*[cite: 17] */}
                  <Text style={styles.liveBroadcastBadgeText}>Official Feed</Text> {/*[cite: 17] */}
                </View>
              </View>
              <Text style={styles.pageSubtitleMuted}>Advance Administration central documentation ledger database logs</Text> {/*[cite: 17] */}
            </View>
            <View style={styles.headerIconCircleBackdrop}> {/*[cite: 17] */}
              <Megaphone size={20} color={THEME.white} /> {/*[cite: 17] */}
            </View>
          </Animated.View>

          {/* Quick Metrics Statistics Strip Group */}
          <View style={styles.overviewMetricsWrapperGridRow}> {/*[cite: 17] */}
            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird]}> {/*[cite: 17] */}
              <Text style={styles.metricItemLabelText}>Active Broadcasts</Text> {/*[cite: 17] */}
              <Text style={styles.metricItemBigNumber}>{noticesDataPool.length} Records</Text> {/*[cite: 17] */}
              <Text style={styles.metricItemFooterSubtext}>Verified campus timeline ledger</Text> {/*[cite: 17] */}
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird, { backgroundColor: "#E7F9EE" }]}>
              <Text style={[styles.metricItemLabelText, { color: "#16A34A" }]}>Verification Status</Text>
              <Text style={[styles.metricItemBigNumber, { color: "#16A34A" }]}>Synced</Text>
              <Text style={styles.metricItemFooterSubtext}>Cryptographic channel connected</Text>
            </View>

            <View style={[styles.metricCardUnitItem, isDesktop && styles.desktopMetricThird, { backgroundColor: "#FEF7EE" }]}> {/*[cite: 17] */}
              <Text style={[styles.metricItemLabelText, { color: "#D97706" }]}>Important Downloads</Text> {/*[cite: 17] */}
              <Text style={[styles.metricItemBigNumber, { color: "#D97706" }]}>2 PDFs</Text> {/*[cite: 17] */}
              <Text style={styles.metricItemFooterSubtext}>Requires parent signature routing</Text> {/*[cite: 17] */}
            </View>
          </View>

          {/* Filter commands horizontal carousel selection switcher layer */}
          <View style={styles.categoryFilterBarSectionContainer}> {/*[cite: 17] */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewInnerLayout}> {/*[cite: 17] */}
              <View style={styles.filterIconBackdropContainerBox}> {/*[cite: 17] */}
                <Filter size={14} color={THEME.darkAccent} /> {/*[cite: 17] */}
              </View>
              {filterTabs.map((tabLabel, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.filterChipTabUnitCell, selectedTab === tabLabel && styles.activeFilterChipTabUnitCell]} //[cite: 17]
                  onPress={() => setSelectedTab(tabLabel)}
                  activeOpacity={0.7} //[cite: 17]
                >
                  <Text style={[styles.filterChipTabLabelTextText, selectedTab === tabLabel && styles.activeFilterChipTabLabelTextText]}> {/*[cite: 17] */}
                    {tabLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Split Screen Structural Grid Panels System (Desktop Adaptive Windows / Mobile In-line stack) */}
          <View style={[styles.responsiveSplitMainLayoutFlexContainer, isDesktop && styles.rowDirectionLayoutGrid]}> {/*[cite: 17] */}
            
            {/* Left Column Section: Dynamic Archive Notices Feed Cards */}
            <View style={[styles.listFeedBlockSectionCard, isDesktop && styles.desktopFlexProportionWidth]}> {/*[cite: 17] */}
              
              <View style={styles.searchBarWrapperBackdropControl}> {/*[cite: 17] */}
                <Search size={15} color={THEME.textMuted} style={{ marginRight: 8 }} /> {/*[cite: 17] */}
                <TextInput
                  style={styles.searchInputControlField} //[cite: 17]
                  placeholder="Filter active broadcast headings logs..."
                  placeholderTextColor={THEME.textMuted} //[cite: 17]
                  value={searchQuery} //[cite: 17]
                  onChangeText={setSearchQuery} //[cite: 17]
                />
              </View>

              <Text style={styles.blockTitleLabelHeading}>Active Board Releases</Text> {/*[cite: 17] */}
              {filteredNotices.map((noticeUnit) => {
                const isSelected = activeDetailedNotice?.id === noticeUnit.id;
                return (
                  <TouchableOpacity
                    key={noticeUnit.id}
                    style={[styles.noticeListItemRowCardUnit, isSelected && styles.selectedNoticeListItemRowCardUnit]} //[cite: 17]
                    onPress={() => setActiveDetailedNotice(noticeUnit)}
                    activeOpacity={0.8} //[cite: 17]
                  >
                    <View style={[styles.noticeVerticalHighlightStrip, { backgroundColor: noticeUnit.color }]} /> {/*[cite: 17] */}
                    <View style={styles.noticeContentCoreBlockLeft}> {/*[cite: 17] */}
                      <View style={styles.noticeIconAndIdHeaderRow}>
                        <View style={[styles.noticeMiniIconBackdrop, { backgroundColor: noticeUnit.color + "15" }]}>
                          <FileText size={14} color={noticeUnit.color} />
                        </View>
                        <Text style={styles.noticeIdLabelStringText}>{noticeUnit.id}</Text>
                        <Text style={styles.noticeTimestampTextString}>{noticeUnit.date}</Text>
                      </View>
                      <Text style={styles.noticeMainTitleHeadingTextText} numberOfLines={1}>{noticeUnit.title}</Text> {/*[cite: 17] */}
                      <Text style={styles.noticeMessageExcerptSnippet} numberOfLines={2}>{noticeUnit.summary}</Text> {/*[cite: 17] */}
                    </View>
                    <ChevronRight size={16} color={THEME.textMuted} style={{ marginRight: 12 }} /> {/*[cite: 17] */}
                  </TouchableOpacity>
                );
              })}
              {filteredNotices.length === 0 && (
                <Text style={styles.fallbackEmptyLogsPlaceholderMutedText}>No records located inside this category index matching search metrics.</Text>
              )}
            </View>

            {/* Right Column Section: Detailed Interactive Notice Visualizer Viewer Panel Box */}
            {activeDetailedNotice && (
              <View style={[styles.detailedNoticeInspectionPanelCard, isDesktop && styles.desktopFlexProportionWidthRightSide]}> {/*[cite: 17] */}
                <View style={styles.auditHeaderTopBarClusterRow}> {/*[cite: 17] */}
                  <View style={styles.auditTitleClusterLeft}> {/*[cite: 17] */}
                    <Megaphone size={16} color={activeDetailedNotice.color} />
                    <Text style={styles.auditBlockTitleLabelText}>Central Ledger Dispatch Audit</Text> {/*[cite: 17] */}
                  </View>
                  <View style={[styles.auditCategoryBadgeCapsule, { backgroundColor: activeDetailedNotice.color + "15" }]}> {/*[cite: 17] */}
                    <Text style={[styles.auditCategoryBadgeLabelStringText, { color: activeDetailedNotice.color }]}> {/*[cite: 17] */}
                      {activeDetailedNotice.category}
                    </Text>
                  </View>
                </View>

                <View style={styles.auditContentCoreBodyTextStack}> {/*[cite: 17] */}
                  <Text style={styles.auditMainHeadingTitleBigText}>{activeDetailedNotice.title}</Text> {/*[cite: 17] */}
                  
                  <View style={styles.auditMetadataFieldsFlexGridInlineBox}> {/*[cite: 17] */}
                    <View style={styles.metadataFieldColumnHalfItemUnit}> {/*[cite: 17] */}
                      <Text style={styles.metadataFieldLabelMutedTitleText}>Origin Authority Office:</Text> {/*[cite: 17] */}
                      <Text style={styles.metadataFieldValueHeadingBoldText}>{activeDetailedNotice.postedBy}</Text> {/*[cite: 17] */}
                    </View>
                    <View style={styles.metadataFieldColumnHalfItemUnit}> {/*[cite: 17] */}
                      <Text style={styles.metadataFieldLabelMutedTitleText}>Official Publish Date:</Text>
                      <Text style={styles.metadataFieldValueHeadingBoldText}>{activeDetailedNotice.date}</Text> {/*[cite: 17] */}
                    </View>
                  </View>

                  <View style={styles.auditHorizontalDividerInternalMetricLine} /> {/*[cite: 17] */}

                  <View style={styles.auditMessageParagraphHolderGlassBox}> {/*[cite: 17] */}
                    <Text style={styles.auditMessageParagraphBodyText}>{activeDetailedNotice.content}</Text> {/*[cite: 17] */}
                  </View>

                  {/* 3. Conditional File Attachment Download Actions Bar Mapping Rationale */}
                  {activeDetailedNotice.hasAttachment && (
                    <View style={styles.attachmentDownloadActionPanelCell}>
                      <View style={styles.attachmentLeftMetaGroup}>
                        <FileText size={18} color={THEME.primary} />
                        <View style={{ marginLeft: 10 }}>
                          <Text style={styles.attachmentFileNameLabelStringText}>{activeDetailedNotice.fileName}</Text>
                          <Text style={styles.attachmentFileSizeMutedLabel}>PDF Document Matrix  •  1.4 MB</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.downloadVectorActionTriggerBtn} activeOpacity={0.75}>
                        <ArrowDownToLine size={16} color={THEME.white} />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.auditVerificationNoticeSafetyFooterCardStrip}> {/*[cite: 17] */}
                    <Info size={14} color={THEME.darkAccent} /> {/*[cite: 17] */}
                    <Text style={styles.auditVerificationNoticeSafetyFooterCardTextText}> {/*[cite: 17] */}
                      This documentation framework release has been systematically approved by university coordinators matching your family sync account permissions parameters.
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
  container: { //[cite: 17]
    flex: 1, //[cite: 17]
    backgroundColor: THEME.background, //[cite: 17]
    position: "relative", //[cite: 17]
  },
  fluidBackgroundContainer: { //[cite: 17]
    position: "absolute", //[cite: 17]
    top: 0, //[cite: 17]
    left: -20, //[cite: 17]
    right: 0, //[cite: 17]
    zIndex: -2, //[cite: 17]
    opacity: 0.85, //[cite: 17]
  },
  orb3DOne: { //[cite: 17]
    position: "absolute", //[cite: 17]
    width: 330, //[cite: 17]
    height: 330, //[cite: 17]
    borderRadius: 165, //[cite: 17]
    backgroundColor: "rgba(227, 83, 54, 0.06)", //[cite: 17]
    top: 140, //[cite: 17]
    right: -40, //[cite: 17]
    zIndex: -1, //[cite: 17]
  },
  orb3DTwo: { //[cite: 17]
    position: "absolute", //[cite: 17]
    width: 390, //[cite: 17]
    height: 390, //[cite: 17]
    borderRadius: 195, //[cite: 17]
    backgroundColor: "rgba(160, 82, 45, 0.04)", //[cite: 17]
    bottom: 80, //[cite: 17]
    left: -110, //[cite: 17]
    zIndex: -1, //[cite: 17]
  },
  desktopCenter: { //[cite: 17]
    alignItems: "center", //[cite: 17]
    justifyContent: "center", //[cite: 17]
  },
  mainWrapper: { //[cite: 17]
    width: "100%", //[cite: 17]
    paddingBottom: 40, //[cite: 17]
  },
  desktopWidth: { //[cite: 17]
    maxWidth: 1140, //[cite: 17]
    paddingHorizontal: 20, //[cite: 17]
  },
  pageHeaderBlockCard: { //[cite: 17]
    backgroundColor: THEME.white, //[cite: 17]
    padding: 22, //[cite: 17]
    borderRadius: 26, //[cite: 17]
    marginHorizontal: 16, //[cite: 17]
    marginTop: 22, //[cite: 17]
    flexDirection: "row", //[cite: 17]
    alignItems: "center", //[cite: 17]
    justifyContent: "space-between", //[cite: 17]
    gap: 16, //[cite: 17]
    shadowColor: THEME.darkAccent, //[cite: 17]
    shadowOffset: { width: 0, height: 4 }, //[cite: 17]
    shadowOpacity: 0.04, //[cite: 17]
    shadowRadius: 12, //[cite: 17]
    elevation: 3, //[cite: 17]
  },
  headerLeftCluster: { //[cite: 17]
    flex: 1, //[cite: 17]
  },
  titleBadgeInlineRow: { //[cite: 17]
    flexDirection: "row", //[cite: 17]
    alignItems: "center", //[cite: 17]
    flexWrap: "wrap", //[cite: 17]
    gap: 10, //[cite: 17]
  },
  pageTitleHeading: { //[cite: 17]
    fontSize: 24, //[cite: 17]
    fontWeight: "bold", //[cite: 17]
    color: THEME.textDark, //[cite: 17]
  },
  liveBroadcastBadge: { //[cite: 17]
    flexDirection: "row", //[cite: 17]
    alignItems: "center", //[cite: 17]
    backgroundColor: THEME.primary, //[cite: 17]
    paddingHorizontal: 10, //[cite: 17]
    paddingVertical: 4, //[cite: 17]
    borderRadius: 10, //[cite: 17]
  },
  liveBroadcastBadgeText: { //[cite: 17]
    color: THEME.white, //[cite: 17]
    fontSize: 11, //[cite: 17]
    fontWeight: "700", //[cite: 17]
  },
  pageSubtitleMuted: { //[cite: 17]
    fontSize: 13, //[cite: 17]
    color: THEME.textMuted, //[cite: 17]
    marginTop: 4, //[cite: 17]
    lineHeight: 18, //[cite: 17]
  },
  headerIconCircleBackdrop: { //[cite: 17]
    width: 46, //[cite: 17]
    height: 46, //[cite: 17]
    borderRadius: 23, //[cite: 17]
    backgroundColor: THEME.primary, //[cite: 17]
    justifyContent: "center", //[cite: 17]
    alignItems: "center", //[cite: 17]
  },
  overviewMetricsWrapperGridRow: { //[cite: 17]
    flexDirection: "row", //[cite: 17]
    flexWrap: "wrap", //[cite: 17]
    paddingHorizontal: 12, //[cite: 17]
    marginTop: 20, //[cite: 17]
  },
  metricCardUnitItem: { //[cite: 17]
    width: "100%", //[cite: 17]
    backgroundColor: THEME.white, //[cite: 17]
    padding: 16, //[cite: 17]
    borderRadius: 22, //[cite: 17]
    marginBottom: 12, //[cite: 17]
    marginHorizontal: 4, //[cite: 17]
    flex: 1, //[cite: 17]
    minWidth: 240, //[cite: 17]
    shadowColor: "#000", //[cite: 17]
    shadowOpacity: 0.02, //[cite: 17]
    shadowRadius: 4, //[cite: 17]
    elevation: 2, //[cite: 17]
  },
  desktopMetricThird: {
    width: "31.33%", //[cite: 17]
  },
  metricItemLabelText: { //[cite: 17]
    fontSize: 12, //[cite: 17]
    color: THEME.textMuted, //[cite: 17]
    fontWeight: "600", //[cite: 17]
  },
  metricItemBigNumber: { //[cite: 17]
    fontSize: 24, //[cite: 17]
    fontWeight: "800", //[cite: 17]
    color: THEME.textDark, //[cite: 17]
    marginTop: 4, //[cite: 17]
  },
  metricItemFooterSubtext: { //[cite: 17]
    fontSize: 11, //[cite: 17]
    color: THEME.textMuted, //[cite: 17]
    marginTop: 4, //[cite: 17]
  },
  categoryFilterBarSectionContainer: { //[cite: 17]
    marginTop: 18, //[cite: 17]
    paddingLeft: 16, //[cite: 17]
  },
  filterScrollViewInnerLayout: { //[cite: 17]
    alignItems: "center", //[cite: 17]
    gap: 8, //[cite: 17]
    paddingRight: 24, //[cite: 17]
  },
  filterIconBackdropContainerBox: { //[cite: 17]
    width: 36, //[cite: 17]
    height: 36, //[cite: 17]
    borderRadius: 10, //[cite: 17]
    backgroundColor: THEME.white, //[cite: 17]
    justifyContent: "center", //[cite: 17]
    alignItems: "center", //[cite: 17]
    marginRight: 4, //[cite: 17]
  },
  filterChipTabUnitCell: { //[cite: 17]
    paddingHorizontal: 16, //[cite: 17]
    paddingVertical: 8, //[cite: 17]
    borderRadius: 12, //[cite: 17]
    backgroundColor: THEME.white, //[cite: 17]
  },
  activeFilterChipTabUnitCell: { //[cite: 17]
    backgroundColor: THEME.primary, //[cite: 17]
  },
  filterChipTabLabelTextText: { //[cite: 17]
    color: THEME.textMuted, //[cite: 17]
    fontSize: 13, //[cite: 17]
    fontWeight: "600", //[cite: 17]
  },
  activeFilterChipTabLabelTextText: { //[cite: 17]
    color: THEME.white, //[cite: 17]
  },
  responsiveSplitMainLayoutFlexContainer: { //[cite: 17]
    paddingHorizontal: 16, //[cite: 17]
    marginTop: 22, //[cite: 17]
    gap: 16, //[cite: 17]
  },
  rowDirectionLayoutGrid: { //[cite: 17]
    flexDirection: "row", //[cite: 17]
  },
  desktopFlexProportionWidth: { //[cite: 17]
    flex: 1.25, //[cite: 17]
  },
  desktopFlexProportionWidthRightSide: { //[cite: 17]
    flex: 1, //[cite: 17]
  },
  listFeedBlockSectionCard: { //[cite: 17]
    backgroundColor: THEME.white, //[cite: 17]
    padding: 18, //[cite: 17]
    borderRadius: 26, //[cite: 17]
    shadowColor: THEME.darkAccent, //[cite: 17]
    shadowOffset: { width: 0, height: 2 }, //[cite: 17]
    shadowOpacity: 0.03, //[cite: 17]
    shadowRadius: 6, //[cite: 17]
    elevation: 2, //[cite: 17]
    gap: 12, //[cite: 17]
  },
  searchBarWrapperBackdropControl: { //[cite: 17]
    backgroundColor: "#FDFCF9", //[cite: 17]
    flexDirection: "row", //[cite: 17]
    alignItems: "center", //[cite: 17]
    paddingHorizontal: 14, //[cite: 17]
    borderRadius: 14, //[cite: 17]
    height: 42, //[cite: 17]
    borderWidth: 1, //[cite: 17]
    borderColor: "rgba(160, 82, 45, 0.06)", //[cite: 17]
    marginBottom: 4, //[cite: 17]
  },
  searchInputControlField: { //[cite: 17]
    flex: 1, //[cite: 17]
    color: THEME.textDark, //[cite: 17]
    fontSize: 13, //[cite: 17]
    fontWeight: "500", //[cite: 17]
  },
  blockTitleLabelHeading: { //[cite: 17]
    fontSize: 15, //[cite: 17]
    fontWeight: "700", //[cite: 17]
    color: THEME.textDark, //[cite: 17]
    marginBottom: 4, //[cite: 17]
  },
  noticeListItemRowCardUnit: {
    backgroundColor: "#FDFCF9",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)",
  },
  selectedNoticeListItemRowCardUnit: {
    backgroundColor: "#FFF8F5",
    borderColor: "rgba(227, 83, 54, 0.2)",
    shadowColor: THEME.primary,
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  noticeVerticalHighlightStrip: {
    width: 5,
    height: "100%",
  },
  noticeContentCoreBlockLeft: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  noticeIconAndIdHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  noticeMiniIconBackdrop: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  noticeIdLabelStringText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textMuted,
  },
  noticeTimestampTextString: {
    fontSize: 11,
    color: THEME.textMuted,
    marginLeft: "auto",
  },
  noticeMainTitleHeadingTextText: {
    fontSize: 15, //[cite: 17]
    fontWeight: "700", //[cite: 17]
    color: THEME.textDark, //[cite: 17]
    marginTop: 2, //[cite: 17]
  },
  noticeMessageExcerptSnippet: {
    fontSize: 12, //[cite: 17]
    color: THEME.textMuted, //[cite: 17]
    lineHeight: 16, //[cite: 17]
    marginTop: 2, //[cite: 17]
  },
  fallbackEmptyLogsPlaceholderMutedText: {
    fontSize: 12, //[cite: 17]
    color: THEME.textMuted, //[cite: 17]
    fontStyle: "italic", //[cite: 17]
    textAlign: "center", //[cite: 17]
    paddingVertical: 12, //[cite: 17]
  },
  detailedNoticeInspectionPanelCard: {
    backgroundColor: THEME.white, //[cite: 17]
    borderRadius: 26, //[cite: 17]
    padding: 20, //[cite: 17]
    shadowColor: THEME.darkAccent, //[cite: 17]
    shadowOffset: { width: 0, height: 3 }, //[cite: 17]
    shadowOpacity: 0.04, //[cite: 17]
    shadowRadius: 8, //[cite: 17]
    elevation: 2, //[cite: 17]
    borderWidth: 1, //[cite: 17]
    borderColor: "rgba(160, 82, 45, 0.04)", //[cite: 17]
    alignSelf: "flex-start", //[cite: 17]
    width: "100%", //[cite: 17]
  },
  auditHeaderTopBarClusterRow: { //[cite: 17]
    flexDirection: "row", //[cite: 17]
    justifyContent: "space-between", //[cite: 17]
    alignItems: "center", //[cite: 17]
    borderBottomWidth: 1, //[cite: 17]
    borderBottomColor: "#F5F5F5", //[cite: 17]
    paddingBottom: 14, //[cite: 17]
  },
  auditTitleClusterLeft: { //[cite: 17]
    flexDirection: "row", //[cite: 17]
    alignItems: "center", //[cite: 17]
    gap: 8, //[cite: 17]
  },
  auditBlockTitleLabelText: { //[cite: 17]
    fontSize: 14, //[cite: 17]
    fontWeight: "700", //[cite: 17]
    color: THEME.textDark, //[cite: 17]
  },
  auditCategoryBadgeCapsule: { //[cite: 17]
    paddingHorizontal: 10, //[cite: 17]
    paddingVertical: 4, //[cite: 17]
    borderRadius: 10, //[cite: 17]
  },
  auditCategoryBadgeLabelStringText: { //[cite: 17]
    fontSize: 11, //[cite: 17]
    fontWeight: "700", //[cite: 17]
  },
  auditContentCoreBodyTextStack: { //[cite: 17]
    marginTop: 16, //[cite: 17]
    gap: 14, //[cite: 17]
  },
  auditMainHeadingTitleBigText: { //[cite: 17]
    fontSize: 19, //[cite: 17]
    fontWeight: "800", //[cite: 17]
    color: THEME.textDark, //[cite: 17]
    lineHeight: 25, //[cite: 17]
  },
  auditMetadataFieldsFlexGridInlineBox: { //[cite: 17]
    flexDirection: "row", //[cite: 17]
    flexWrap: "wrap", //[cite: 17]
    gap: 12, //[cite: 17]
    backgroundColor: "#FDFCF9", //[cite: 17]
    padding: 12, //[cite: 17]
    borderRadius: 14, //[cite: 17]
  },
  metadataFieldColumnHalfItemUnit: { //[cite: 17]
    flex: 1, //[cite: 17]
    minWidth: 110, //[cite: 17]
    gap: 2, //[cite: 17]
  },
  metadataFieldLabelMutedTitleText: { //[cite: 17]
    fontSize: 10, //[cite: 17]
    color: THEME.textMuted, //[cite: 17]
    fontWeight: "500", //[cite: 17]
  },
  metadataFieldValueHeadingBoldText: { //[cite: 17]
    fontSize: 12, //[cite: 17]
    fontWeight: "700", //[cite: 17]
    color: THEME.textDark, //[cite: 17]
  },
  auditHorizontalDividerInternalMetricLine: { //[cite: 17]
    height: 1, //[cite: 17]
    backgroundColor: "#F5F5F5", //[cite: 17]
  },
  auditMessageParagraphHolderGlassBox: { //[cite: 17]
    backgroundColor: THEME.background, //[cite: 17]
    padding: 16, //[cite: 17]
    borderRadius: 18, //[cite: 17]
    borderWidth: 1, //[cite: 17]
    borderColor: "rgba(160, 82, 45, 0.05)", //[cite: 17]
  },
  auditMessageParagraphBodyText: { //[cite: 17]
    fontSize: 13, //[cite: 17]
    color: THEME.textDark, //[cite: 17]
    lineHeight: 21, //[cite: 17]
    fontWeight: "500", //[cite: 17]
  },
  attachmentDownloadActionPanelCell: {
    backgroundColor: "#FDFCF9",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.06)",
  },
  attachmentLeftMetaGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  attachmentFileNameLabelStringText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textDark,
  },
  attachmentFileSizeMutedLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
  },
  downloadVectorActionTriggerBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  auditVerificationNoticeSafetyFooterCardStrip: { //[cite: 17]
    flexDirection: "row", //[cite: 17]
    alignItems: "flex-start", //[cite: 17]
    gap: 10, //[cite: 17]
    marginTop: 4, //[cite: 17]
  },
  auditVerificationNoticeSafetyFooterCardTextText: { //[cite: 17]
    fontSize: 11, //[cite: 17]
    color: THEME.textMuted, //[cite: 17]
    lineHeight: 15, //[cite: 17]
    flex: 1, //[cite: 17]
  },
});