import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    BarChart3,
    Calendar,
    ChevronDown,
    Filter,
    Search,
    TrendingUp,
    Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#D32F2F",
  accent: "#F4A460",
  border: "#EAEAEE",
};

const DUMMY_GRADES = [
  {
    id: "1",
    exam: "Term 1 Finals",
    classStr: "10-A",
    subject: "Mathematics",
    avg: 78,
    highest: 98,
    passed: 38,
    total: 40,
    date: "2026-03-15",
    gradeDistribution: { A: 12, B: 18, C: 8, D: 2 },
  },
  {
    id: "2",
    exam: "Term 1 Finals",
    classStr: "11-Science",
    subject: "Physics",
    avg: 65,
    highest: 92,
    passed: 30,
    total: 35,
    date: "2026-03-18",
    gradeDistribution: { A: 8, B: 12, C: 10, D: 5 },
  },
  {
    id: "3",
    exam: "Unit Test 1",
    classStr: "10-B",
    subject: "Mathematics",
    avg: 82,
    highest: 100,
    passed: 39,
    total: 39,
    date: "2026-04-10",
    gradeDistribution: { A: 20, B: 15, C: 4, D: 0 },
  },
  {
    id: "4",
    exam: "Mid-Term",
    classStr: "9-A",
    subject: "English",
    avg: 71,
    highest: 95,
    passed: 28,
    total: 32,
    date: "2026-04-05",
    gradeDistribution: { A: 10, B: 14, C: 4, D: 4 },
  },
  {
    id: "5",
    exam: "Term 1 Finals",
    classStr: "12-Commerce",
    subject: "Economics",
    avg: 74,
    highest: 96,
    passed: 42,
    total: 45,
    date: "2026-03-20",
    gradeDistribution: { A: 15, B: 18, C: 9, D: 3 },
  },
];

type SortBy = "avg" | "date" | "passRate";
type SortOrder = "asc" | "desc";

export default function ViewGradesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique exam names for filter
  const examNames = ["all", ...new Set(DUMMY_GRADES.map((g) => g.exam))];

  const filteredAndSortedGrades = DUMMY_GRADES.filter((grade) => {
    const matchesSearch =
      grade.classStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.exam.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExam = selectedExam === "all" || grade.exam === selectedExam;
    return matchesSearch && matchesExam;
  }).sort((a, b) => {
    if (sortBy === "avg") {
      return sortOrder === "desc" ? b.avg - a.avg : a.avg - b.avg;
    } else if (sortBy === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    } else {
      const passRateA = (a.passed / a.total) * 100;
      const passRateB = (b.passed / b.total) * 100;
      return sortOrder === "desc"
        ? passRateB - passRateA
        : passRateA - passRateB;
    }
  });

  // Overall statistics
  const totalExams = DUMMY_GRADES.length;
  const overallAvg = Math.floor(
    DUMMY_GRADES.reduce((sum, g) => sum + g.avg, 0) / totalExams,
  );
  const totalPassed = DUMMY_GRADES.reduce((sum, g) => sum + g.passed, 0);
  const totalStudents = DUMMY_GRADES.reduce((sum, g) => sum + g.total, 0);
  const overallPassRate = Math.floor((totalPassed / totalStudents) * 100);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return COLORS.success;
    if (percentage >= 60) return COLORS.accent;
    if (percentage >= 40) return COLORS.warning;
    return COLORS.error;
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

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
        <TouchableOpacity
          style={styles.filterHeaderButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter
            size={20}
            color={showFilters ? COLORS.primary : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { maxWidth: isDesktop ? 1000 : "100%" },
        ]}
      >
        {/* Overall Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(227, 83, 54, 0.1)" },
              ]}
            >
              <BarChart3 size={22} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.statNumber}>{totalExams}</Text>
              <Text style={styles.statLabel}>Total Exams</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(244, 164, 96, 0.1)" },
              ]}
            >
              <TrendingUp size={22} color={COLORS.accent} />
            </View>
            <View>
              <Text style={styles.statNumber}>{overallAvg}%</Text>
              <Text style={styles.statLabel}>Avg. Score</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(76, 175, 80, 0.1)" },
              ]}
            >
              <Users size={22} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.statNumber}>{overallPassRate}%</Text>
              <Text style={styles.statLabel}>Pass Rate</Text>
            </View>
          </View>
        </View>

        {/* Search and Filters */}
        {showFilters && (
          <View style={styles.filtersPanel}>
            <View style={styles.searchContainer}>
              <Search size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by class, subject or exam..."
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== "" && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Exam Type</Text>
                <View style={styles.pickerContainer}>
                  {examNames.map((exam) => (
                    <TouchableOpacity
                      key={exam}
                      style={[
                        styles.pickerOption,
                        selectedExam === exam && styles.pickerOptionActive,
                      ]}
                      onPress={() => setSelectedExam(exam)}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          selectedExam === exam &&
                            styles.pickerOptionTextActive,
                        ]}
                      >
                        {exam === "all" ? "All Exams" : exam}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Sort By</Text>
                <View style={styles.sortRow}>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      sortBy === "avg" && styles.sortButtonActive,
                    ]}
                    onPress={() => setSortBy("avg")}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        sortBy === "avg" && styles.sortButtonTextActive,
                      ]}
                    >
                      Avg Score
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      sortBy === "date" && styles.sortButtonActive,
                    ]}
                    onPress={() => setSortBy("date")}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        sortBy === "date" && styles.sortButtonTextActive,
                      ]}
                    >
                      Date
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      sortBy === "passRate" && styles.sortButtonActive,
                    ]}
                    onPress={() => setSortBy("passRate")}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        sortBy === "passRate" && styles.sortButtonTextActive,
                      ]}
                    >
                      Pass Rate
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.orderButton}
                    onPress={() =>
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                    }
                  >
                    <ChevronDown
                      size={18}
                      color={COLORS.textPrimary}
                      style={{
                        transform: [
                          { rotate: sortOrder === "desc" ? "0deg" : "180deg" },
                        ],
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Results List */}
        {filteredAndSortedGrades.length === 0 ? (
          <View style={styles.emptyState}>
            <BarChart3 size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        ) : (
          filteredAndSortedGrades.map((result) => {
            const passRate = (result.passed / result.total) * 100;
            const avgColor = getGradeColor(result.avg);
            const gradeLetter = getGradeLetter(result.avg);

            return (
              <View key={result.id} style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleSection}>
                    <Text style={styles.examTitle}>{result.exam}</Text>
                    <Text style={styles.classSubtitle}>
                      {result.classStr} • {result.subject}
                    </Text>
                  </View>
                  <View style={styles.dateBadge}>
                    <Calendar size={12} color={COLORS.textSecondary} />
                    <Text style={styles.dateText}>
                      {formatDate(result.date)}
                    </Text>
                  </View>
                </View>

                {/* Main Stats Row */}
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Class Avg</Text>
                    <Text style={[styles.statValue, { color: avgColor }]}>
                      {result.avg}%
                    </Text>
                    <Text style={styles.gradeLetter}>{gradeLetter}</Text>
                  </View>

                  <View style={[styles.statBox, styles.statBorder]}>
                    <Text style={styles.statLabel}>Highest</Text>
                    <Text style={[styles.statValue, { color: COLORS.success }]}>
                      {result.highest}%
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Passed</Text>
                    <Text style={styles.statValue}>
                      {result.passed}/{result.total}
                    </Text>
                    <Text style={styles.passRateText}>{passRate}%</Text>
                  </View>
                </View>

                {/* Grade Distribution Bar */}
                <View style={styles.distributionContainer}>
                  <Text style={styles.distributionTitle}>
                    Grade Distribution
                  </Text>
                  <View style={styles.distributionBars}>
                    {Object.entries(result.gradeDistribution).map(
                      ([grade, count]) => {
                        const percentage =
                          ((count as number) / result.total) * 100;
                        let barColor = COLORS.success;
                        if (grade === "C") barColor = COLORS.accent;
                        if (grade === "D") barColor = COLORS.warning;
                        if (grade === "F") barColor = COLORS.error;
                        return (
                          <View
                            key={grade}
                            style={styles.distributionBarWrapper}
                          >
                            <View style={styles.distributionBarContainer}>
                              <View
                                style={[
                                  styles.distributionBar,
                                  {
                                    width: `${percentage}%`,
                                    backgroundColor: barColor,
                                  },
                                ]}
                              />
                            </View>
                            <Text style={styles.distributionLabel}>
                              {grade} ({count})
                            </Text>
                          </View>
                        );
                      },
                    )}
                  </View>
                </View>

                {/* View Details Button */}
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>
                    View Detailed Report
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
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
    borderBottomColor: COLORS.border,
    ...Platform.select({
      web: { userSelect: "none" },
    }),
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  filterHeaderButton: { padding: 8, marginRight: -8 },
  listContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
    gap: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      web: { boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" },
    }),
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  filtersPanel: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
      web: { boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" },
    }),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    marginLeft: 8,
    color: COLORS.textPrimary,
  },
  clearText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 12,
    paddingVertical: 10,
  },
  filterRow: {
    gap: 16,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  pickerOptionActive: {
    backgroundColor: COLORS.primary,
  },
  pickerOptionText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  pickerOptionTextActive: {
    color: COLORS.white,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  sortButtonTextActive: {
    color: COLORS.white,
  },
  orderButton: {
    padding: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
  },
  resultCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      web: { boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
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
    fontWeight: "500",
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  gradeLetter: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  passRateText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.success,
    marginTop: 2,
  },
  distributionContainer: {
    marginBottom: 16,
    gap: 8,
  },
  distributionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  distributionBars: {
    gap: 8,
  },
  distributionBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  distributionBar: {
    height: "100%",
    borderRadius: 4,
  },
  distributionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
    minWidth: 40,
  },
  detailsButton: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
