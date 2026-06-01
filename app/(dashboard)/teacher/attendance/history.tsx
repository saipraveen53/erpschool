import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Calendar, Users } from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

const COLORS = {
  bgWhite: "#FFFFFF",
  lightGray: "#F5F5F5",
  primary: "#E35336",
  darkBg: "#2A1308",
  textPrimary: "#5C2E14",
  textSecondary: "#A0522D",
  white: "#FFFFFF",
  success: "#2E7D32",
  danger: "#C62828",
};

// Dummy historical data
const HISTORY_DATA = [
  {
    id: "1",
    date: "2026-06-01",
    classStr: "10-A",
    period: "1st Period",
    present: 32,
    absent: 3,
  },
  {
    id: "2",
    date: "2026-06-01",
    classStr: "9-B",
    period: "3rd Period",
    present: 28,
    absent: 2,
  },
  {
    id: "3",
    date: "2026-05-31",
    classStr: "11-Science",
    period: "2nd Period",
    present: 40,
    absent: 1,
  },
  {
    id: "4",
    date: "2026-05-31",
    classStr: "10-A",
    period: "4th Period",
    present: 31,
    absent: 4,
  },
  {
    id: "5",
    date: "2026-05-30",
    classStr: "9-A",
    period: "1st Period",
    present: 35,
    absent: 0,
  },
];

export default function AttendanceHistoryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Helper to format date nicely
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance History</Text>
        <View style={{ width: 40 }} /> {/* Empty view for flex balancing */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          {
            maxWidth: isDesktop ? 800 : "100%",
            alignSelf: "center",
            width: "100%",
          },
        ]}
      >
        {HISTORY_DATA.map((record) => (
          <View key={record.id} style={styles.historyCard}>
            {/* Top Row: Date and Class Info */}
            <View style={styles.cardHeader}>
              <View style={styles.dateBadge}>
                <Calendar size={16} color={COLORS.primary} />
                <Text style={styles.dateText}>{formatDate(record.date)}</Text>
              </View>
              <Text style={styles.periodText}>{record.period}</Text>
            </View>

            {/* Middle Row: Main Class Detail */}
            <View style={styles.classDetailsRow}>
              <View style={styles.classIcon}>
                <Users size={20} color={COLORS.white} />
              </View>
              <View>
                <Text style={styles.classTitle}>Class {record.classStr}</Text>
                <Text style={styles.totalStudentsText}>
                  Total Students: {record.present + record.absent}
                </Text>
              </View>
            </View>

            {/* Bottom Row: Present / Absent Stats */}
            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statBox,
                  { backgroundColor: "rgba(46, 125, 50, 0.1)" },
                ]}
              >
                <Text style={styles.statLabel}>Present</Text>
                <Text style={[styles.statNumber, { color: COLORS.success }]}>
                  {record.present}
                </Text>
              </View>
              <View
                style={[
                  styles.statBox,
                  { backgroundColor: "rgba(198, 40, 40, 0.1)" },
                ]}
              >
                <Text style={styles.statLabel}>Absent</Text>
                <Text style={[styles.statNumber, { color: COLORS.danger }]}>
                  {record.absent}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  listContainer: { paddingHorizontal: 24, paddingVertical: 24, gap: 16 },
  historyCard: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  dateText: { color: COLORS.primary, fontWeight: "700", fontSize: 13 },
  periodText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: "600" },
  classDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  classIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.textPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  classTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  totalStudentsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  statLabel: { fontSize: 14, fontWeight: "600", color: COLORS.textPrimary },
  statNumber: { fontSize: 18, fontWeight: "900" },
});
