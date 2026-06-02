import { useRouter } from "expo-router";
import { 
  AlertCircle, 
  ChevronDown, 
  Clock, 
  ServerCrash, 
  ShieldAlert, 
  Star, 
  HardDrive, 
  Cpu, 
  Activity, 
  ArrowUpRight,
  User,
  Users
} from "lucide-react-native";
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
  const [activeTab, setActiveTab] = useState("MRR");

  const [chartData, setChartData] = useState({
    expected: "$52,500",
    actual: "$59,600",
    labelExpected: "Target MRR",
    labelActual: "Current MRR",
    tooltip: "$59,600.00",
    growth: "+13.5%",
  });

  const [operations, setOperations] = useState([
    { id: 1, type: 'alert', title: "Database Sync Delay", time: "10 mins ago", icon: ServerCrash, color: "#E35336", route: "server-downtime" },
    { id: 2, type: 'warning', title: "High CPU Usage", time: "45 mins ago", icon: Cpu, color: "#F4A460", route: "server-downtime" },
    { id: 3, type: 'normal', title: "Pending Support (5)", time: "2 hours ago", icon: Clock, color: "#8A6B5D", route: "support-tickets" },
    { id: 4, type: 'normal', title: "Security Scan Clear", time: "5 hours ago", icon: ShieldAlert, color: "#8A6B5D", route: "security-logs" },
  ]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (tab === "MRR") {
      setChartData({ expected: "$52,500", actual: "$59,600", labelExpected: "Target MRR", labelActual: "Current MRR", tooltip: "$59,600.00", growth: "+13.5%" });
    } else if (tab === "Students") {
      setChartData({ expected: "14,000", actual: "15,240", labelExpected: "Expected Goal", labelActual: "Total Active", tooltip: "15,240 Students", growth: "+8.2%" });
    } else {
      setChartData({ expected: "1,200", actual: "1,450", labelExpected: "Previous Month", labelActual: "DAU Peak", tooltip: "1,450 Users/Day", growth: "+20.8%" });
    }
  };

  const chartHeight = 220;
  // Dynamic smooth path
  const pathData = `M0,170 C50,140 100,200 150,150 C200,100 250,180 300,130 C350,80 400,110 450,70 C500,30 550,80 600,40 L600,220 L0,220 Z`;
  const linePath = `M0,170 C50,140 100,200 150,150 C200,100 250,180 300,130 C350,80 400,110 450,70 C500,30 550,80 600,40`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: isMobile ? 12 : 32, paddingBottom: 60 }}>
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { fontSize: isMobile ? 24 : 32 }]}>System Overview</Text>
        <Text style={styles.pageSubtitle}>Real-time analytics and platform health</Text>
      </View>

      <View style={{ flexDirection: (isMobile || isTablet) ? "column" : "row" }}>
        {/* Left Column */}
        <View style={{ flex: (isMobile || isTablet) ? 1 : 2.2, marginRight: (isMobile || isTablet) ? 0 : 24 }}>
          
          {/* Main Chart Card */}
          <View style={[styles.card, { padding: isMobile ? 16 : 28 }]}>
            <View style={{ flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? 16 : 36, gap: isMobile ? 16 : 0 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: isMobile ? 12 : 0 }}>
                  {["MRR", "Students", "DAU"].map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => handleTabChange(tab)}
                      style={[styles.chartTab, activeTab === tab && styles.chartTabActive]}
                    >
                      <Text style={[styles.chartTabText, activeTab === tab && styles.chartTabTextActive]}>
                        {tab} {tab === "MRR" && "($59.6k)"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <View>
                  <Text style={styles.chartStatLabel}>{chartData.labelExpected}</Text>
                  <Text style={styles.chartStatValueDisabled}>{chartData.expected}</Text>
                </View>
                <View style={{ marginLeft: 28, position: 'relative' }}>
                  <Text style={styles.chartStatLabel}>{chartData.labelActual}</Text>
                  <Text style={styles.chartStatValue}>{chartData.actual}</Text>
                  <View style={styles.growthBadge}>
                    <ArrowUpRight size={12} color="#166534" />
                    <Text style={styles.growthText}>{chartData.growth}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* SVG Chart Premium Update */}
            <View style={{ height: chartHeight, position: "relative" }}>
              <Svg width="100%" height={chartHeight} viewBox={`0 0 600 ${chartHeight}`} preserveAspectRatio="none">
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#E35336" stopOpacity="0.25" />
                    <Stop offset="0.8" stopColor="#E35336" stopOpacity="0.01" />
                    <Stop offset="1" stopColor="#F5F5DC" stopOpacity="0" />
                  </LinearGradient>
                </Defs>
                <Path d={pathData} fill="url(#grad)" />
                <Path d={linePath} fill="none" stroke="#E35336" strokeWidth="5" strokeLinecap="round" />
                
                {/* Glow Effect / Shadow Drop for point */}
                <Circle cx="300" cy="130" r="14" fill="rgba(227, 83, 54, 0.2)" />
                <Circle cx="300" cy="130" r="7" fill="#FFFFFF" stroke="#E35336" strokeWidth="4" />
              </Svg>
              <View style={styles.tooltipPremium}>
                <Text style={styles.tooltipText}>{chartData.tooltip}</Text>
              </View>
              <View style={styles.xAxis}>
                {["Nov 12", "Nov 13", "Nov 14", "Nov 15", "Nov 16", "Nov 17"].map((date, i) => (
                  <Text key={i} style={styles.axisText}>{date}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Bottom row: System Health */}
          <View style={{ flexDirection: isMobile ? "column" : "row", marginTop: 20 }}>
            {/* System Health Card */}
            <View style={[styles.card, { flex: 1, padding: isMobile ? 16 : 28 }]}>
              <View style={styles.cardHeaderFlex}>
                <View>
                  <Text style={styles.cardTitle}>System Health</Text>
                  <Text style={styles.cardSubtitle}>Real-time infrastructure status</Text>
                </View>
                <View style={styles.statusLiveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Operational</Text>
                </View>
              </View>

              <View style={styles.healthGrid}>
                <View style={styles.healthItem}>
                  <View style={[styles.healthIconBox, { backgroundColor: 'rgba(244, 164, 96, 0.15)' }]}>
                    <Activity size={20} color="#F4A460" />
                  </View>
                  <View>
                    <Text style={styles.healthLabel}>Uptime (30d)</Text>
                    <Text style={styles.healthValue}>99.99%</Text>
                  </View>
                </View>

                <View style={styles.healthItem}>
                  <View style={[styles.healthIconBox, { backgroundColor: 'rgba(227, 83, 54, 0.15)' }]}>
                    <Cpu size={20} color="#E35336" />
                  </View>
                  <View>
                    <Text style={styles.healthLabel}>CPU Load</Text>
                    <Text style={styles.healthValue}>42% <Text style={{fontSize: 12, color: '#A0522D', fontWeight: '500'}}>Avg</Text></Text>
                  </View>
                </View>

                <View style={styles.healthItem}>
                  <View style={[styles.healthIconBox, { backgroundColor: 'rgba(160, 82, 45, 0.15)' }]}>
                    <HardDrive size={20} color="#A0522D" />
                  </View>
                  <View>
                    <Text style={styles.healthLabel}>Storage Used</Text>
                    <Text style={styles.healthValue}>2.4 TB</Text>
                  </View>
                </View>
                
                <View style={styles.healthItem}>
                  <View style={[styles.healthIconBox, { backgroundColor: 'rgba(92, 46, 20, 0.1)' }]}>
                    <Users size={20} color="#5C2E14" />
                  </View>
                  <View>
                    <Text style={styles.healthLabel}>Concurrent Users</Text>
                    <Text style={styles.healthValue}>842</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.premiumButton}
                onPress={() => router.push("/super-admin/infrastructure" as any)}
              >
                <Text style={styles.premiumButtonText}>View Infrastructure Metrics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Right Column */}
        <View style={{ flex: 1, marginTop: (isMobile || isTablet) ? 20 : 0 }}>
          
          {/* Operations Card */}
          <View style={[styles.card, { padding: isMobile ? 16 : 28 }]}>
            <View style={styles.cardHeaderFlex}>
              <View>
                <Text style={styles.cardTitle}>Operations Log</Text>
                <Text style={styles.cardSubtitle}>Recent system activities</Text>
              </View>
              <TouchableOpacity style={styles.iconCircle}>
                <AlertCircle size={18} color="#A0522D" />
              </TouchableOpacity>
            </View>

            {operations.map((op, idx) => (
              <TouchableOpacity
                key={op.id}
                style={[
                  styles.operationItem, 
                  op.type === 'alert' && styles.operationAlert,
                  idx !== operations.length - 1 && styles.operationBorder
                ]}
                onPress={() => router.push(`/super-admin/operations/${op.route}` as any)}
              >
                <View style={styles.operationLeft}>
                  <View style={[styles.opIconWrap, { backgroundColor: op.color + "1A" }]}>
                    <op.icon size={16} color={op.color} />
                  </View>
                  <View>
                    <Text style={op.type === 'alert' ? styles.operationTextAlert : styles.operationText}>{op.title}</Text>
                    <Text style={styles.operationTime}>{op.time}</Text>
                  </View>
                </View>
                <ChevronDown size={16} color="#B8A095" style={{ transform: [{ rotate: '-90deg' }] }} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Card */}
          <View style={[styles.card, { marginTop: 20, flex: 1, padding: isMobile ? 16 : 28 }]}>
            <View style={styles.cardHeaderFlex}>
              <View>
                <Text style={styles.cardTitle}>Recent Feedback</Text>
                <Text style={styles.cardSubtitle}>Insights from end-users</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Star size={14} color="#5C2E14" fill="#5C2E14" />
                <Text style={styles.ratingBadgeText}>4.8 Avg</Text>
              </View>
            </View>

            <View style={styles.feedbackList}>
              {[
                { name: "Sarah J.", role: "Principal", quote: "The new attendance module saves us hours every week.", time: "2 hrs ago", stars: 5, color: "#E35336" },
                { name: "Michael T.", role: "Teacher", quote: "Gradebook sync was slightly delayed yesterday morning.", time: "1 day ago", stars: 4, color: "#F4A460" },
                { name: "Amanda L.", role: "Admin", quote: "Absolutely seamless onboarding process for our staff.", time: "3 days ago", stars: 5, color: "#A0522D" },
              ].map((fb, i) => (
                <View key={i} style={styles.feedbackItem}>
                  <View style={[styles.feedbackAvatar, { backgroundColor: fb.color + "20" }]}>
                    <Text style={[styles.feedbackAvatarText, { color: fb.color }]}>{fb.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.feedbackContent}>
                    <View style={styles.feedbackHeader}>
                      <Text style={styles.feedbackName}>{fb.name}</Text>
                      <View style={styles.roleTag}>
                        <Text style={styles.roleTagText}>{fb.role}</Text>
                      </View>
                      <Text style={styles.feedbackTime}>{fb.time}</Text>
                    </View>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} color={s <= fb.stars ? "#F4A460" : "#E6D8D2"} fill={s <= fb.stars ? "#F4A460" : "transparent"} />
                      ))}
                    </View>
                    <Text style={styles.feedbackQuote}>"{fb.quote}"</Text>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.premiumButtonOutline, { marginTop: "auto" }]}
              onPress={() => router.push("/super-admin/feedback" as any)}
            >
              <Text style={styles.premiumButtonOutlineText}>View All Feedback</Text>
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
    backgroundColor: "#F5F5DC", // Warm Beige Background
  },
  pageHeader: {
    marginBottom: 28,
  },
  pageTitle: {
    fontWeight: "900",
    color: "#5C2E14", // Dark Brown
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 15,
    color: "#8A6B5D",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24, // Softer, more premium curves
    shadowColor: "#A0522D", // Tinted warm shadow
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(230, 216, 210, 0.5)', // Extremely subtle border
  },
  chartTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chartTabActive: {
    backgroundColor: "#FFFCF8", // cardLight
    borderColor: "#E6D8D2",
    shadowColor: "#A0522D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chartTabText: {
    fontSize: 14,
    color: "#8A6B5D",
    fontWeight: "600",
  },
  chartTabTextActive: {
    color: "#E35336", // Primary Terracotta
    fontWeight: "800",
  },
  chartStatLabel: {
    fontSize: 13,
    color: "#A0522D", // Secondary Text
    marginBottom: 6,
    fontWeight: "600",
  },
  chartStatValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#5C2E14",
    letterSpacing: -0.5,
  },
  chartStatValueDisabled: {
    fontSize: 24,
    fontWeight: "800",
    color: "#B8A095", // Muted
  },
  growthBadge: {
    position: 'absolute',
    top: -24,
    right: -10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0'
  },
  growthText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
    marginLeft: 2,
  },
  tooltipPremium: {
    position: "absolute",
    top: 65,
    left: "40%",
    backgroundColor: "#5C2E14",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  axisText: {
    fontSize: 11,
    color: "#B8A095",
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#5C2E14",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#8A6B5D",
    marginBottom: 8,
  },
  cardHeaderFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  statusLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 164, 96, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 164, 96, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F4A460',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A0522D',
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 24,
  },
  healthItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  healthLabel: {
    fontSize: 12,
    color: '#8A6B5D',
    fontWeight: '600',
    marginBottom: 2,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#5C2E14',
  },
  premiumButton: {
    backgroundColor: "#E35336",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#E35336",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  premiumButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  premiumButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#F4A460",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  premiumButtonOutlineText: {
    color: "#A0522D",
    fontSize: 14,
    fontWeight: "700",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(230, 216, 210, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  operationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  operationBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5DC",
  },
  operationAlert: {
    backgroundColor: "rgba(227, 83, 54, 0.05)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: -12,
  },
  operationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  opIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  operationTextAlert: {
    fontSize: 14,
    fontWeight: "800",
    color: "#E35336",
    marginBottom: 2,
  },
  operationText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5C2E14",
    marginBottom: 2,
  },
  operationTime: {
    fontSize: 12,
    color: "#A0522D",
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4A460',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5C2E14',
    marginLeft: 6,
  },
  feedbackList: {
    marginTop: 4,
  },
  feedbackItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  feedbackAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  feedbackAvatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  feedbackName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#5C2E14",
  },
  roleTag: {
    backgroundColor: '#F5F5DC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0522D',
  },
  feedbackTime: {
    fontSize: 11,
    color: "#B8A095",
    marginLeft: 'auto',
  },
  stars: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 2,
  },
  feedbackQuote: {
    fontSize: 13,
    color: "#8A6B5D",
    lineHeight: 20,
    fontStyle: 'italic',
  }
});