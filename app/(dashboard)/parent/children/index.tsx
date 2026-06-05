 
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Award,
  BookOpen,
  Bus,
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
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
  white: "#FFFFFF",         //
  textDark: "#2C1A14",      //
  textMuted: "#7A6862",      //
  glassBg: "rgba(255, 255, 255, 0.75)", //
};

// Simulated Multi-Children Core Telemetry Records Pool
const childrenData = [
  {
    id: "STU-2041",
    name: "Aarav Sharma",
    classSection: "Grade 4 - B",
    rollNo: "24",
    photoUri: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80",
    attendance: "94%", //
    academicIndex: "Grade A+", //
    busStatus: "On the way to school", //
    eta: "12 mins away", //
    feeStatus: "Dues Clear",
    teacherRemarks: "Excellent consistency in quantitative mathematics."
  },
  {
    id: "STU-2045",
    name: "Diya Sharma",
    classSection: "Grade 1 - A",
    rollNo: "09",
    photoUri: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=150&q=80",
    attendance: "97%",
    academicIndex: "Grade O",
    busStatus: "Reached Campus Safe",
    eta: "Arrived 08:05 AM",
    feeStatus: "Pending Q2",
    teacherRemarks: "Very expressive nature; displays brilliant artistic skills."
  }
];

export default function ChildrenOverviewDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;

  // Parallax Fluid Background Animations Configs
  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const fluidMoveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start();

    // Constant background 3D floating effect
    Animated.loop(
      Animated.timing(fluidMoveAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Interpolation mapping for 3D multi-dimensional manual scroll tracking depth
  const layer1TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [35, 0, -85],
    extrapolate: "clamp",
  });

  const layer2TranslateY = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [-25, 0, 60],
    extrapolate: "clamp",
  });

  const fluidHorizontalX = fluidMoveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 25, -20],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* SVG Background Water Fluids Curved Paths Layer Canvas */}
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

      {/* 3D Tilted Blurred Space Glassmorphism Backdrop Orbs */}
      <Animated.View style={[styles.orb3DOne, { transform: [{ translateY: layer1TranslateY }] }]} />
      <Animated.View style={[styles.orb3DTwo, { transform: [{ translateY: layer2TranslateY }] }]} />

      {/* MANUAL SCROLL ONLY: Auto-scroll block parameters are detached entirely */}
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
          
          {/* Top Page Header Profile Branding Section */}
          <Animated.View style={[styles.pageHeaderBlockCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerLeftTextGroup}>
              <View style={styles.titleBadgeInlineRow}>
                <Text style={styles.mainTitleHeadingText}>Registered Dependents</Text>
                <View style={styles.sparklesBadge}>
                  <Sparkles size={12} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.sparklesBadgeText}>Family Hub</Text>
                </View>
              </View>
              <Text style={styles.subTitleMutedDescriptionText}>Advance Administration Parent Portal Framework Registry</Text>
            </View>
            <View style={styles.iconBackdropCircle}>
              <Users size={22} color={THEME.white} />
            </View>
          </Animated.View>

          {/* Children Profiles Grid List (Stacked Mobile, Multi-Column Desktop Adaptive View) */}
          <Text style={styles.sectionDividerLabelTitleText}>Active Profiles ({childrenData.length} Students)</Text>
          <View style={[styles.childrenCardsFlexLayoutContainer, isDesktop && styles.rowDirectionGrid]}>
            {childrenData.map((kid) => (
              <View key={kid.id} style={[styles.childProfileCardUnitItem, isDesktop && styles.desktopHalfCardScalingUnit]}>
                
                {/* Upper Core Identity Block segment info */}
                <View style={styles.cardHeaderTopRow}>
                  <View style={styles.avatarImageWrapperBackdropSquare}>
                    <Image source={{ uri: kid.photoUri }} style={styles.avatarNativeImageStyle} />
                    <View style={styles.campusPresencePulseIndicator} />
                  </View>
                  <View style={styles.identityTextClusterGroup}>
                    <View style={styles.idLabelRowBadge}>
                      <Text style={styles.idLabelTextString}>{kid.id}</Text>
                    </View>
                    <Text style={styles.childNameMainTextHeading}>{kid.name}</Text>
                    <Text style={styles.childSubClassLabelTextText}>{kid.classSection}  •  <Text style={{ fontWeight: "700" }}>Roll No: {kid.rollNo}</Text></Text>
                  </View>
                  
                  {/* Inspect Details Chevron Navigation Action Trigger */}
                  <TouchableOpacity 
                    style={styles.inspectProfileCircleIconBtn}
                    onPress={() => router.push(`/parent/children/${kid.id}` as any)}
                    activeOpacity={0.7}
                  >
                    <ChevronRight size={18} color={THEME.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.internalContentCardDividerLine} />

                {/* Telemetry Quick Telemetry Stats Grid Rows mapping segments layout */}
                <View style={styles.childStatsGridRowLayoutInlineBox}>
                  
                  <View style={styles.gridStatMiniCellBoxUnit}>
                    <View style={styles.statCellHeaderInlineRow}>
                      <Calendar size={14} color={THEME.primary} />
                      <Text style={styles.statCellHeaderLabelText}>Attendance</Text>
                    </View>
                    <Text style={styles.statCellBigMetricTextNumber}>{kid.attendance}</Text>
                  </View>

                  <View style={styles.gridStatMiniCellBoxUnit}>
                    <View style={styles.statCellHeaderInlineRow}>
                      <Award size={14} color={THEME.darkAccent} />
                      <Text style={styles.statCellHeaderLabelText}>Academic Index</Text>
                    </View>
                    <Text style={[styles.statCellBigMetricTextNumber, { color: THEME.darkAccent }]}>{kid.academicIndex}</Text>
                  </View>

                  <View style={styles.gridStatMiniCellBoxUnit}>
                    <View style={styles.statCellHeaderInlineRow}>
                      <CreditCard size={14} color={kid.feeStatus.includes("Clear") ? "#16A34A" : THEME.secondary} />
                      <Text style={styles.statCellHeaderLabelText}>Finance Dues</Text>
                    </View>
                    <Text style={[styles.statCellBigMetricTextNumber, { color: kid.feeStatus.includes("Clear") ? "#16A34A" : THEME.secondary, fontSize: 15 }]}>
                      {kid.feeStatus}
                    </Text>
                  </View>

                </View>

                {/* Transit School Bus Live Tracking telemetry strip embedded object block */}
                <View style={styles.transitStatusBoxStripCardBackdrop}>
                  <View style={styles.transitLeftIconLabelGroupCluster}>
                    <View style={styles.busMiniIconBackdropSquare}>
                      <Bus size={14} color={THEME.white} />
                    </View>
                    <View>
                      <Text style={styles.transitStripLabelMetaTitle}>Transit Telemetry Status</Text>
                      <Text style={styles.transitStripValueHeadingMainText}>{kid.busStatus}</Text>
                    </View>
                  </View>
                  <View style={styles.transitStripEtaBadgeContainer}>
                    <Clock size={12} color={THEME.darkAccent} style={{ marginRight: 4 }} />
                    <Text style={styles.transitStripEtaValueTextString}>{kid.eta}</Text>
                  </View>
                </View>

                {/* Teacher remarks text description layer excerpt layout string block */}
                <View style={styles.teacherRemarksSummaryExcerptBoxHolder}>
                  <View style={styles.remarksLabelInlineRowHeader}>
                    <BookOpen size={14} color={THEME.textMuted} />
                    <Text style={styles.remarksSectionLabelTextTitleText}>Latest Academic Log Remarks Feed</Text>
                  </View>
                  <Text style={styles.remarksParagraphExcerptTextBody}>"{kid.teacherRemarks}"</Text>
                </View>

                {/* Direct Command Link Actions Footer Row Module navigation flow templates */}
                <View style={styles.cardFooterActionButtonsRowGridInline}>
                  <TouchableOpacity 
                    style={[styles.footerActionBtnUnitCell, { borderColor: "rgba(160, 82, 45, 0.15)" }]}
                    onPress={() => router.push("/parent/attendance")}
                  >
                    <Text style={styles.footerActionBtnLabelTextString}>Attendance Records</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.footerActionBtnUnitCell, { backgroundColor: THEME.primary, borderColor: THEME.primary }]}
                    onPress={() => router.push(`/parent/children/${kid.id}` as any)}
                  >
                    <Text style={[styles.footerActionBtnLabelTextString, { color: THEME.white }]}>Complete Analytics</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ))}
          </View>

          {/* Institutional Compliance Safety Certifications Trust Badge footer section panel */}
          <View style={styles.trustBadgeFooterSectionCardPanelContainer}>
            <ShieldCheck size={24} color="#16A34A" />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.trustTitleTextText}>Secure Encryption Channel Verification</Text>
              <Text style={styles.trustDescriptionBodyTextParagraphText}>
                All children profiling, grade summaries, operational geo-tracking streams, and transaction verification metrics records logs strictly match global dynamic state protocols encryption standards.
              </Text>
            </View>
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
    top: 100,
    right: -50,
    zIndex: -1,
  },
  orb3DTwo: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(160, 82, 45, 0.04)",
    bottom: 40,
    left: -120,
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
    padding: 24,
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
  headerLeftTextGroup: {
    flex: 1,
  },
  titleBadgeInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  mainTitleHeadingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  sparklesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.darkAccent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  sparklesBadgeText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "700",
  },
  subTitleMutedDescriptionText: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  iconBackdropCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionDividerLabelTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.textDark,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 14,
  },
  childrenCardsFlexLayoutContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  rowDirectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  desktopHalfCardScalingUnit: {
    width: "48.5%",
    marginHorizontal: "0.5%",
  },
  childProfileCardUnitItem: {
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
  },
  cardHeaderTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarImageWrapperBackdropSquare: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#F3ECE7",
    position: "relative",
    borderWidth: 1.5,
    borderColor: "rgba(227, 83, 54, 0.15)",
  },
  avatarNativeImageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  campusPresencePulseIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#16A34A",
    borderWidth: 2,
    borderColor: THEME.white,
  },
  identityTextClusterGroup: {
    marginLeft: 14,
    flex: 1,
    gap: 2,
  },
  idLabelRowBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(160, 82, 45, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idLabelTextString: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.darkAccent,
  },
  childNameMainTextHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.textDark,
  },
  childSubClassLabelTextText: {
    fontSize: 13,
    color: THEME.textMuted,
  },
  inspectProfileCircleIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FCEFEA",
    justifyContent: "center",
    alignItems: "center",
  },
  internalContentCardDividerLine: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginVertical: 16,
  },
  childStatsGridRowLayoutInlineBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  gridStatMiniCellBoxUnit: {
    flex: 1,
    backgroundColor: "#FDFCF7",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)",
  },
  statCellHeaderInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statCellHeaderLabelText: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  statCellBigMetricTextNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.textDark,
    marginTop: 6,
  },
  transitStatusBoxStripCardBackdrop: {
    backgroundColor: "#FCEFEA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 16,
    marginTop: 14,
  },
  transitLeftIconLabelGroupCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  busMiniIconBackdropSquare: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  transitStripLabelMetaTitle: {
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: "500",
  },
  transitStripValueHeadingMainText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textDark,
    marginTop: 1,
  },
  transitStripEtaBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  transitStripEtaValueTextString: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.darkAccent,
  },
  teacherRemarksSummaryExcerptBoxHolder: {
    backgroundColor: "#F5F5DC",
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)",
  },
  remarksLabelInlineRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  remarksSectionLabelTextTitleText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  remarksParagraphExcerptTextBody: {
    fontSize: 12,
    color: THEME.textDark,
    lineHeight: 18,
    fontStyle: "italic",
    marginTop: 6,
  },
  cardFooterActionButtonsRowGridInline: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  footerActionBtnUnitCell: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.white,
  },
  footerActionBtnLabelTextString: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textMuted,
  },
  trustBadgeFooterSectionCardPanelContainer: {
    backgroundColor: THEME.white,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    padding: 18,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  trustTitleTextText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textDark,
  },
  trustDescriptionBodyTextParagraphText: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 18,
    marginTop: 4,
  },
});