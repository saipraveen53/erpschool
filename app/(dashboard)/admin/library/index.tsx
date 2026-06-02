// app/admin/library/index.tsx

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
  Library,
  BookOpen,
  Bookmark,
  Users,
  Clock3,
  TrendingUp,
  Bell,
  Download,
  Upload,
  Star,
  ChevronRight,
  CalendarDays,
  BookMarked,
  Sparkles,
  ClipboardList,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function LibraryDashboard() {
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
            Library Center
          </Text>

          <Text style={styles.subheading}>
            Smart digital library management for books and students
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              Add Book
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* HERO SECTION */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles
            size={isMobile ? 28 : 34}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            Modern Smart Library
          </Text>

          <Text style={styles.heroSubtitle}>
            Manage books, issue tracking and digital records
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Explore Library
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <Library
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeText}>
            12K+ Books
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search books..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* STATS */}

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <BookOpen
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            12K+
          </Text>

          <Text style={styles.statLabel}>
            Total Books
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <Users
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            1.2K
          </Text>

          <Text style={styles.statLabel}>
            Readers
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Clock3
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
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <TrendingUp
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statValue}>
            +24%
          </Text>

          <Text style={styles.statLabel}>
            Growth
          </Text>
        </View>
      </View>

      {/* FEATURED CATEGORIES */}

      <Text style={styles.sectionTitle}>
        Featured Categories
      </Text>

      <View style={styles.categoriesGrid}>
        <TouchableOpacity style={styles.categoryCard}>
          <View style={styles.categoryIcon}>
            <BookMarked
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.categoryTitle}>
            Academic
          </Text>

          <Text style={styles.categoryCount}>
            4,200 Books
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryCard}>
          <View
            style={[
              styles.categoryIcon,
              { backgroundColor: "#7C2D12" },
            ]}
          >
            <Bookmark
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.categoryTitle}>
            Literature
          </Text>

          <Text style={styles.categoryCount}>
            2,800 Books
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryCard}>
          <View
            style={[
              styles.categoryIcon,
              { backgroundColor: "#92400E" },
            ]}
          >
            <Library
              size={24}
              color="#fff"
            />
          </View>

          <Text style={styles.categoryTitle}>
            Science
          </Text>

          <Text style={styles.categoryCount}>
            3,100 Books
          </Text>
        </TouchableOpacity>
      </View>

      {/* RECENTLY ADDED */}

      <Text style={styles.sectionTitle}>
        Recently Added
      </Text>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.listCard}>
          <View style={styles.listLeft}>
            <View style={styles.iconBox}>
              <BookOpen
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.listTitle}>
                Physics Advanced
              </Text>

              <Text style={styles.listSubtitle}>
                Added on 20 June 2026
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listCard}>
          <View style={styles.listLeft}>
            <View style={styles.iconBox}>
              <Bookmark
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.listTitle}>
                English Grammar
              </Text>

              <Text style={styles.listSubtitle}>
                Added on 18 June 2026
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listCard}>
          <View style={styles.listLeft}>
            <View style={styles.iconBox}>
              <Library
                size={20}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.listTitle}>
                Biology Essentials
              </Text>

              <Text style={styles.listSubtitle}>
                Added on 16 June 2026
              </Text>
            </View>
          </View>

          <ChevronRight
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.quickCard}>
          <Upload
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Import Books
          </Text>

          <Text style={styles.quickDesc}>
            Bulk upload inventory
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <Download
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.quickTitle}>
            Export Reports
          </Text>

          <Text style={styles.quickDesc}>
            Download reports
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
            Notify overdue books
          </Text>
        </TouchableOpacity>
      </View>

      {/* TODAY SUMMARY */}

      <Text style={styles.sectionTitle}>
        Today's Summary
      </Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <ClipboardList
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.summaryValue}>
            120
          </Text>

          <Text style={styles.summaryLabel}>
            Books Issued
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <CalendarDays
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.summaryValue}>
            45
          </Text>

          <Text style={styles.summaryLabel}>
            Returns Today
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Star
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.summaryValue}>
            4.9
          </Text>

          <Text style={styles.summaryLabel}>
            User Rating
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
              Rahul borrowed Science book
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
              New literature books added
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
              15 books returned successfully
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

  categoriesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  categoryCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
  },

  categoryIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  categoryTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  categoryCount: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  listContainer: {
    marginBottom: 24,
  },

  listCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  listLeft: {
    flexDirection: "row",
    alignItems: "center",
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

  listTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  listSubtitle: {
    marginTop: 4,
    color: "#6B7280",
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