// app/admin/examination/marks-entry.tsx

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  Search,
  Plus,
  ClipboardPen,
  Users,
  BookOpen,
  CheckCircle2,
  Clock3,
  Trophy,
  Save,
  Download,
  Upload,
  Filter,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react-native";

export default function MarksEntryPage() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          padding: isMobile ? 16 : 20,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Marks Entry System
          </Text>

          <Text style={styles.subheading}>
            Enter and manage examination marks
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              New Entry
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search student or subject..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>
            Mid-Term Marks Submission
          </Text>

          <Text style={styles.heroSubtitle}>
            Complete marks entry before 25 June 2026
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroMiniCard}>
              <Users
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                1,240 Students
              </Text>
            </View>

            <View style={styles.heroMiniCard}>
              <BookOpen
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                24 Subjects
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.heroButton}>
          <Save size={16} color="#fff" />

          <Text style={styles.heroButtonText}>
            Save All
          </Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <ClipboardPen
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            8,240
          </Text>

          <Text style={styles.statsLabel}>
            Marks Entered
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <CheckCircle2
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            92%
          </Text>

          <Text style={styles.statsLabel}>
            Completed
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Clock3
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            8%
          </Text>

          <Text style={styles.statsLabel}>
            Pending
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <Trophy
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            86%
          </Text>

          <Text style={styles.statsLabel}>
            Avg Score
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Upload
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Upload Marks
          </Text>

          <Text style={styles.actionDesc}>
            Import marks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Download
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Export Report
          </Text>

          <Text style={styles.actionDesc}>
            Download report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Filter
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Filter Entries
          </Text>

          <Text style={styles.actionDesc}>
            Filter records
          </Text>
        </TouchableOpacity>
      </View>

      {/* TABLE */}

      <Text style={styles.sectionTitle}>
        Recent Marks Entry
      </Text>

      <View style={styles.tableContainer}>
        {/* HEADER */}

        <View style={styles.tableHeader}>
          <Text
            style={[
              styles.tableHeaderText,
              { flex: 1.4 },
            ]}
          >
            Student
          </Text>

          <Text
            style={[
              styles.tableHeaderText,
              { flex: 1 },
            ]}
          >
            Subject
          </Text>

          <Text
            style={[
              styles.tableHeaderText,
              { flex: 0.8 },
            ]}
          >
            Marks
          </Text>

          <Text
            style={[
              styles.tableHeaderText,
              { flex: 1 },
            ]}
          >
            Status
          </Text>
        </View>

        {/* ROWS */}

        <View style={styles.tableRow}>
          <Text
            style={[
              styles.tableText,
              { flex: 1.4 },
            ]}
          >
            Rahul Sharma
          </Text>

          <Text
            style={[
              styles.tableText,
              { flex: 1 },
            ]}
          >
            Maths
          </Text>

          <Text
            style={[
              styles.tableMarks,
              { flex: 0.8 },
            ]}
          >
            92
          </Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: "#DCFCE7" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: "#15803D" },
              ]}
            >
              Saved
            </Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <Text
            style={[
              styles.tableText,
              { flex: 1.4 },
            ]}
          >
            Priya Patel
          </Text>

          <Text
            style={[
              styles.tableText,
              { flex: 1 },
            ]}
          >
            Science
          </Text>

          <Text
            style={[
              styles.tableMarks,
              { flex: 0.8 },
            ]}
          >
            88
          </Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: "#FEF3C7" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: "#B45309" },
              ]}
            >
              Pending
            </Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <Text
            style={[
              styles.tableText,
              { flex: 1.4 },
            ]}
          >
            Aryan Gupta
          </Text>

          <Text
            style={[
              styles.tableText,
              { flex: 1 },
            ]}
          >
            English
          </Text>

          <Text
            style={[
              styles.tableMarks,
              { flex: 0.8 },
            ]}
          >
            95
          </Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: "#DCFCE7" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: "#15803D" },
              ]}
            >
              Saved
            </Text>
          </View>
        </View>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Performance Insights
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            98%
          </Text>

          <Text style={styles.analyticsLabel}>
            Accuracy
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            1.2K
          </Text>

          <Text style={styles.analyticsLabel}>
            Students
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>
            124
          </Text>

          <Text style={styles.analyticsLabel}>
            Reviews
          </Text>
        </View>
      </View>

      {/* ALERTS */}

      <Text style={styles.sectionTitle}>
        Important Alerts
      </Text>

      <View style={styles.alertContainer}>
        <View style={styles.alertCard}>
          <AlertTriangle
            size={20}
            color="#B45309"
          />

          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>
              Pending Submission
            </Text>

            <Text style={styles.alertDesc}>
              Class 9 Science marks pending
            </Text>
          </View>
        </View>

        <View style={styles.alertCard}>
          <FileSpreadsheet
            size={20}
            color="#15803D"
          />

          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>
              Upload Successful
            </Text>

            <Text style={styles.alertDesc}>
              320 records updated
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },

  content: {
    paddingBottom: 80,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: "#A0522D",
  },

  subheading: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },

  addButton: {
    backgroundColor: "#A0522D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },

  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  heroCard: {
    backgroundColor: "#A0522D",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },

  heroLeft: {
    marginBottom: 16,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  heroSubtitle: {
    marginTop: 8,
    color: "#F5F5DC",
    fontSize: 13,
  },

  heroStatsRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
    flexWrap: "wrap",
  },

  heroMiniCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  heroMiniText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#111827",
  },

  heroButton: {
    backgroundColor: "#7C2D12",
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statsCard: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  statsNumber: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
    color: "#111827",
  },

  statsLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#A0522D",
    marginBottom: 14,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  actionCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: "center",
  },

  actionTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  actionDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
  },

  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 24,
  },

  tableHeader: {
    backgroundColor: "#A0522D",
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  tableHeaderText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  tableText: {
    fontSize: 12,
    color: "#111827",
  },

  tableMarks: {
    fontSize: 14,
    fontWeight: "900",
    color: "#A0522D",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statusText: {
    fontWeight: "700",
    fontSize: 10,
  },

  analyticsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
  },

  analyticsValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#A0522D",
  },

  analyticsLabel: {
    marginTop: 6,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 11,
  },

  alertContainer: {
    marginBottom: 50,
  },

  alertCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  alertContent: {
    flex: 1,
  },

  alertTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  alertDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },
});