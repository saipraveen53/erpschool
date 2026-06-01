import { useRouter } from "expo-router";
import { AlertCircle, ChevronDown, Clock, ServerCrash, ShieldAlert, Star } from "lucide-react-native";
import { useState } from "react";
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, useWindowDimensions, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SuperAdminDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Revenue");

  const [chartData, setChartData] = useState({
    expected: "$1,750",
    actual: "$5,960",
    labelExpected: "Last 7-14 days",
    labelActual: "--- Last 7 days",
    tooltip: "$5,960.00",
  });

  const [operations, setOperations] = useState([
    { id: 1, type: 'alert', title: "Server Downtime (4)", icon: ServerCrash, color: "#1E293B", route: "server-downtime" },
    { id: 2, type: 'normal', title: "Pending Support (2)", icon: Clock, color: "#64748b", route: "support-tickets" },
    { id: 3, type: 'normal', title: "Security Warnings (0)", icon: ShieldAlert, color: "#64748b", route: "security-logs" },
  ]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (tab === "Revenue") {
      setChartData({ expected: "$1,750", actual: "$5,960", labelExpected: "Last 7-14 days", labelActual: "--- Last 7 days", tooltip: "$5,960.00" });
    } else if (tab === "Enrollments") {
      setChartData({ expected: "450", actual: "520", labelExpected: "Expected Goal", labelActual: "Achieved", tooltip: "520 Students" });
    } else {
      setChartData({ expected: "12,000", actual: "14,350", labelExpected: "Previous Month", labelActual: "Current Month", tooltip: "14,350 Users" });
    }
  };

  const chartHeight = 200;
  const pathData = `M0,150 C50,120 100,180 150,130 C200,80 250,160 300,110 C350,60 400,90 450,50 C500,10 550,60 600,20 L600,200 L0,200 Z`;
  const linePath = `M0,150 C50,120 100,180 150,130 C200,80 250,160 300,110 C350,60 400,90 450,50 C500,10 550,60 600,20`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: isMobile ? 12 : 32, paddingBottom: 60 }}>
      <Text style={[styles.pageTitle, { fontSize: isMobile ? 22 : 28, marginBottom: isMobile ? 16 : 24 }]}>Overview</Text>

      <View style={{ flexDirection: (isMobile || isTablet) ? "column" : "row" }}>
        {/* Left Column */}
        <View style={{ flex: (isMobile || isTablet) ? 1 : 2, marginRight: (isMobile || isTablet) ? 0 : 24 }}>
          {/* Chart Card */}
          <View style={[styles.card, { padding: isMobile ? 14 : 24 }]}>
            <View style={{ flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? 12 : 32, gap: isMobile ? 10 : 0 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: isMobile ? 10 : 0 }}>
                  {["Revenue", "Enrollments", "Active Users"].map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => handleTabChange(tab)}
                      style={[styles.chartTab, activeTab === tab && styles.chartTabActive]}
                    >
                      <Text style={[styles.chartTabText, activeTab === tab && styles.chartTabTextActive]}>
                        {tab} {tab === "Revenue" && "($59k)"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View>
                  <Text style={styles.chartStatLabel}>Expected</Text>
                  <Text style={styles.chartStatValue}>{chartData.expected}</Text>
                  <Text style={styles.chartStatSub}>{chartData.labelExpected}</Text>
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text style={styles.chartStatLabel}>Actual</Text>
                  <Text style={styles.chartStatValue}>{chartData.actual}</Text>
                  <Text style={styles.chartStatSub}>{chartData.labelActual}</Text>
                </View>
              </View>
            </View>

            {/* SVG Chart */}
            <View style={{ height: isMobile ? 180 : 250, position: "relative" }}>
              <Svg width="100%" height={chartHeight} viewBox={`0 0 600 ${chartHeight}`} preserveAspectRatio="none">
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#2F6BFF" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="#2F6BFF" stopOpacity="0" />
                  </LinearGradient>
                </Defs>
                <Path d={pathData} fill="url(#grad)" />
                <Path d={linePath} fill="none" stroke="#2F6BFF" strokeWidth="4" strokeLinecap="round" />
                <Circle cx="300" cy="110" r="6" fill="#FFFFFF" stroke="#2F6BFF" strokeWidth="4" />
              </Svg>
              <View style={styles.tooltipMock}>
                <Text style={styles.tooltipText}>{chartData.tooltip}</Text>
              </View>
              <View style={styles.xAxis}>
                {["12/11", "13/11", "14/11", "15/11", "16/11", "17/11"].map((date, i) => (
                  <Text key={i} style={styles.axisText}>{date}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Bottom row: Progress + Top Schools */}
          <View style={{ flexDirection: isMobile ? "column" : "row", marginTop: 16 }}>
            {/* Progress Card */}
            <View style={[styles.card, { flex: 1, marginRight: isMobile ? 0 : 16, marginBottom: isMobile ? 16 : 0, padding: isMobile ? 14 : 24 }]}>
              <Text style={styles.cardTitle}>Monthly Progress</Text>
              <Text style={styles.cardSubtitle}>Earn benefits for great performance</Text>

              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>December progress</Text>
                <Text style={styles.progressStatus}>Not on track</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>November status</Text>
                <Text style={styles.progressStatus}>Target Met</Text>
              </View>

              <TouchableOpacity
                style={styles.darkButton}
                onPress={() => router.push("/super-admin/progress" as any)}
              >
                <Text style={styles.darkButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>

            {/* Top Performing Card */}
            <View style={[styles.card, { flex: 1, padding: isMobile ? 14 : 24 }]}>
              <Text style={styles.cardTitle}>Top-performing Schools</Text>
              <Text style={styles.cardSubtitle}>Ranked by active users</Text>

              <View style={styles.listContainer}>
                {[
                  { id: "1", name: "St. Josephs Higher Secondary School", users: 56, color: "#2F6BFF" },
                  { id: "2", name: "St. Mary's Academy", users: 51, color: "#10b981" },
                  { id: "3", name: "Oakridge Int.", users: 49, color: "#f59e0b" },
                  { id: "4", name: "Delhi Public", users: 43, color: "#6366f1" },
                ].map((item, idx) => (
                  <TouchableOpacity key={idx} style={styles.listItem} onPress={() => router.push(`/super-admin/schools/${item.id}`)}>
                    <View style={styles.listLeft}>
                      <View style={[styles.dot, { backgroundColor: item.color }]} />
                      <Text style={styles.listText} numberOfLines={1}>{item.name}</Text>
                    </View>
                    <Text style={styles.listValue}>{item.users}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Active Schools Bar */}
          <View style={[styles.card, { marginTop: 16, padding: isMobile ? 14 : 24 }]}>
            <Text style={[styles.cardTitle, { textAlign: "center" }]}>Active Schools (131)</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: "#bfdbfe" }]} /><Text style={styles.legendText}>New (56)</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: "#2F6BFF" }]} /><Text style={styles.legendText}>Returning (75)</Text></View>
            </View>
            <View style={styles.barContainer}>
              <View style={[styles.barSegment, { flex: 56, backgroundColor: "#bfdbfe" }]} />
              <View style={[styles.barSegment, { flex: 75, backgroundColor: "#2F6BFF" }]} />
            </View>
          </View>
        </View>

        {/* Right Column */}
        <View style={{ flex: 1, marginTop: (isMobile || isTablet) ? 16 : 0 }}>
          {/* Operations Card */}
          <View style={[styles.card, { padding: isMobile ? 14 : 24 }]}>
            <View style={styles.cardHeaderFlex}>
              <Text style={styles.cardTitle}>Operations <Text style={styles.cardTitleHighlight}>(needs attention)</Text></Text>
              <AlertCircle size={16} color="#94a3b8" />
            </View>

            {operations.map(op => (
              <TouchableOpacity
                key={op.id}
                style={op.type === 'alert' ? styles.operationAlert : styles.operationNormal}
                onPress={() => router.push(`/super-admin/operations/${op.route}` as any)}
              >
                <View style={styles.operationLeft}>
                  <op.icon size={op.type === 'alert' ? 18 : 16} color={op.color} />
                  <Text style={op.type === 'alert' ? styles.operationTextBold : styles.operationText}>{op.title}</Text>
                </View>
                <ChevronDown size={op.type === 'alert' ? 18 : 16} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Card */}
          <View style={[styles.card, { marginTop: 16, flex: 1, padding: isMobile ? 14 : 24 }]}>
            <Text style={styles.cardTitle}>Recent Feedback</Text>
            <Text style={styles.cardSubtitle}>29 reviews</Text>

            <View style={styles.feedbackList}>
              {[1, 2, 3].map((_, i) => (
                <View key={i} style={styles.feedbackItem}>
                  <View style={styles.feedbackImagePlaceholder} />
                  <View style={styles.feedbackContent}>
                    <Text style={styles.feedbackTitle}>"Great Infrastructure and Education Quality"</Text>
                    <Text style={styles.feedbackDate}>Tue 11/17</Text>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} color="#facc15" fill="#facc15" />)}
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.darkButton, { marginTop: "auto" }]}
              onPress={() => router.push("/super-admin/feedback" as any)}
            >
              <Text style={styles.darkButtonText}>View more</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
  },
  chartTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  chartTabActive: {
    backgroundColor: "#F8FAFC",
  },
  chartTabText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
  chartTabTextActive: {
    color: "#1E293B",
    fontWeight: "700",
  },
  chartStatLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  chartStatValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
  },
  chartStatSub: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 4,
  },
  tooltipMock: {
    position: "absolute",
    top: 50,
    left: "40%",
    backgroundColor: "#2F6BFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tooltipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  axisText: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  cardTitleHighlight: {
    color: "#94a3b8",
    fontWeight: "500",
    fontSize: 13,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 14,
  },
  progressLabel: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "600",
  },
  progressStatus: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  darkButton: {
    backgroundColor: "#1E293B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  darkButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  listLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    flexShrink: 0,
  },
  listText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
    flex: 1,
  },
  listValue: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "600",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#64748b",
  },
  barContainer: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  barSegment: {
    height: "100%",
  },
  cardHeaderFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  operationAlert: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  operationNormal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginBottom: 8,
  },
  operationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  operationTextBold: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 10,
  },
  operationText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
    marginLeft: 10,
  },
  feedbackList: {
    marginTop: 8,
  },
  feedbackItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  feedbackImagePlaceholder: {
    width: 52,
    height: 36,
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
    marginRight: 10,
    flexShrink: 0,
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  feedbackDate: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 4,
  },
  stars: {
    flexDirection: "row",
  },
});