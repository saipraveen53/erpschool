import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, BarChart3, TrendingUp, Users } from "lucide-react-native";
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
  textPrimary: "#5C2E14",
  textSecondary: "#A0522D",
  white: "#FFFFFF",
  success: "#2E7D32",
};

const DUMMY_GRADES = [
  {
    id: "1",
    exam: "Term 1 Finals",
    classStr: "10-A",
    subject: "Mathematics",
    avg: "78%",
    highest: "98%",
    passed: "38/40",
  },
  {
    id: "2",
    exam: "Term 1 Finals",
    classStr: "11-Science",
    subject: "Physics",
    avg: "65%",
    highest: "92%",
    passed: "30/35",
  },
  {
    id: "3",
    exam: "Unit Test 1",
    classStr: "10-B",
    subject: "Mathematics",
    avg: "82%",
    highest: "100%",
    passed: "39/39",
  },
];

export default function ViewGradesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Class Results</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.listContainer,
          { maxWidth: isDesktop ? 800 : "100%" },
        ]}
      >
        {DUMMY_GRADES.map((result) => (
          <View key={result.id} style={styles.resultCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.examTitle}>{result.exam}</Text>
                <Text style={styles.classSubtitle}>
                  {result.classStr} • {result.subject}
                </Text>
              </View>
              <View style={styles.iconCircle}>
                <BarChart3 size={20} color={COLORS.primary} />
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <View style={styles.statIconRow}>
                  <TrendingUp size={14} color={COLORS.textSecondary} />
                  <Text style={styles.statLabel}>Class Avg</Text>
                </View>
                <Text style={styles.statValue}>{result.avg}</Text>
              </View>

              <View style={[styles.statBox, styles.statBoxMiddle]}>
                <Text style={styles.statLabel}>Highest</Text>
                <Text style={[styles.statValue, { color: COLORS.success }]}>
                  {result.highest}
                </Text>
              </View>

              <View style={styles.statBox}>
                <View style={styles.statIconRow}>
                  <Users size={14} color={COLORS.textSecondary} />
                  <Text style={styles.statLabel}>Passed</Text>
                </View>
                <Text style={styles.statValue}>{result.passed}</Text>
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
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  listContainer: { padding: 24, alignSelf: "center", width: "100%", gap: 16 },

  resultCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  classSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  statBox: { flex: 1, alignItems: "center" },
  statBoxMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#EAEAEE",
  },
  statIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600" },
  statValue: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
});
