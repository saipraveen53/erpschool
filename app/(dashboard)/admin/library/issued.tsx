// app/admin/library/issued.tsx

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
  BookOpen,
  Users,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Bell,
  Download,
  CalendarDays,
  ChevronRight,
  Filter,
  ClipboardList,
  RotateCcw,
  Sparkles,
  Library,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function IssuedBooksPage() {
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

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Issued Books
          </Text>

          <Text style={styles.subheading}>
            Track issued books and return activity
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              Issue Book
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles
            size={isMobile ? 28 : 34}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            Smart Book Tracking
          </Text>

          <Text style={styles.heroSubtitle}>
            Monitor active borrowings and overdue returns
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              View Reports
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <BookOpen
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeText}>
            420 Issued
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search student or book..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* STATS */}

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <ClipboardList
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            420
          </Text>

          <Text style={styles.statLabel}>
            Issued Books
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <CheckCircle2
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            320
          </Text>

          <Text style={styles.statLabel}>
            Returned
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <AlertTriangle
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            42
          </Text>

          <Text style={styles.statLabel}>
            Overdue
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <TrendingUp
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            +18%
          </Text>

          <Text style={styles.statLabel}>
            Growth
          </Text>
        </View>
      </View>

      {/* ACTIVE ISSUES */}

      <Text style={styles.sectionTitle}>
        Active Book Issues
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.issueCard}>
          <View style={styles.issueLeft}>
            <View style={styles.iconBox}>
              <BookOpen
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.issueTitle}>
                Physics Advanced
              </Text>

              <Text style={styles.issueSubtitle}>
                Rahul Sharma • Due 28 June
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.issueCard}>
          <View style={styles.issueLeft}>
            <View style={styles.iconBox}>
              <Library
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.issueTitle}>
                Biology Essentials
              </Text>

              <Text style={styles.issueSubtitle}>
                Priya Patel • Due 30 June
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.issueCard}>
          <View style={styles.issueLeft}>
            <View style={styles.iconBox}>
              <AlertTriangle
                size={20}
                color="#B45309"
              />
            </View>

            <View>
              <Text style={styles.issueTitle}>
                Mathematics Basics
              </Text>

              <Text style={styles.issueSubtitle}>
                Aryan Gupta • Overdue
              </Text>
            </View>
          </View>

          <View style={styles.overdueBadge}>
            <Text style={styles.overdueText}>
              Late
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.quickCard}>
          <RotateCcw
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Return Book
          </Text>

          <Text style={styles.quickDesc}>
            Mark returns
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Bell
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Send Reminder
          </Text>

          <Text style={styles.quickDesc}>
            Notify students
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Download
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Export Report
          </Text>

          <Text style={styles.quickDesc}>
            Download records
          </Text>
        </TouchableOpacity>
      </View>

      {/* DUE TODAY */}

      <Text style={styles.sectionTitle}>
        Due Today
      </Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <CalendarDays
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.summaryValue}>
            18
          </Text>

          <Text style={styles.summaryLabel}>
            Due Returns
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Users
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.summaryValue}>
            12
          </Text>

          <Text style={styles.summaryLabel}>
            Students
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Clock3
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.summaryValue}>
            5
          </Text>

          <Text style={styles.summaryLabel}>
            Overdue
          </Text>
        </View>
      </View>

      {/* ACTIVITY */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <View style={styles.activityDot} />

          <View>
            <Text style={styles.activityTitle}>
              Rahul issued Science book
            </Text>

            <Text style={styles.activityTime}>
              2 hours ago
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityDot} />

          <View>
            <Text style={styles.activityTitle}>
              Biology book returned
            </Text>

            <Text style={styles.activityTime}>
              Today
            </Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityDot} />

          <View>
            <Text style={styles.activityTitle}>
              Reminder sent for overdue books
            </Text>

            <Text style={styles.activityTime}>
              Yesterday
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
    backgroundColor: BACKGROUND,
  },

  content: {
    paddingBottom: 80,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 20,
  },

  addButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },

  heroSubtitle: {
    color: "#F5F5DC",
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
  },

  heroButton: {
    marginTop: 16,
    backgroundColor: "#7A3B1A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  heroBadge: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  heroBadgeText: {
    marginTop: 8,
    fontWeight: "800",
    fontSize: 12,
    color: PRIMARY,
  },

  searchContainer: {
    backgroundColor: CARD,
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

  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statCard: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    marginTop: 10,
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 14,
  },

  listContainer: {
    marginBottom: 24,
  },

  issueCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  issueLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  issueTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  issueSubtitle: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  overdueBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  overdueText: {
    color: "#B91C1C",
    fontWeight: "700",
    fontSize: 11,
  },

  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  quickCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },

  quickTitle: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  quickDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
  },

  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  summaryCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
  },

  summaryValue: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
  },

  summaryLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
  },

  activityContainer: {
    marginBottom: 50,
  },

  activityCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    marginRight: 12,
  },

  activityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  activityTime: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },
});