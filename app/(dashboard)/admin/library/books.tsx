// app/admin/library/books.tsx

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
  Library,
  Users,
  Clock3,
  Star,
  Bookmark,
  Download,
  Upload,
  TrendingUp,
  ChevronRight,
  Bell,
  Filter,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const CARD = "#FFFFFF";
const LIGHT = "#E7D7C9";

export default function LibraryBooksPage() {
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
            Library Books
          </Text>

          <Text style={styles.subheading}>
            Manage books, borrowing and inventory
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

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Library
            size={isMobile ? 28 : 34}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            Smart Digital Library
          </Text>

          <Text style={styles.heroSubtitle}>
            Organize books and manage borrowing efficiently
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              Explore Collection
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <BookOpen
            size={24}
            color={PRIMARY}
          />

          <Text style={styles.heroBadgeText}>
            12,450 Books
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
            Borrowed
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

      {/* FEATURED BOOKS */}

      <Text style={styles.sectionTitle}>
        Featured Books
      </Text>

      <View style={styles.featuredContainer}>
        <TouchableOpacity style={styles.bookCard}>
          <View style={styles.bookCover}>
            <BookOpen
              size={28}
              color="#fff"
            />
          </View>

          <Text style={styles.bookTitle}>
            Mathematics Basics
          </Text>

          <Text style={styles.bookAuthor}>
            John Peterson
          </Text>

          <View style={styles.ratingRow}>
            <Star
              size={14}
              color="#F59E0B"
              fill="#F59E0B"
            />

            <Text style={styles.ratingText}>
              4.8
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bookCard}>
          <View
            style={[
              styles.bookCover,
              { backgroundColor: "#7C2D12" },
            ]}
          >
            <Bookmark
              size={28}
              color="#fff"
            />
          </View>

          <Text style={styles.bookTitle}>
            Science Wonders
          </Text>

          <Text style={styles.bookAuthor}>
            Priya Sharma
          </Text>

          <View style={styles.ratingRow}>
            <Star
              size={14}
              color="#F59E0B"
              fill="#F59E0B"
            />

            <Text style={styles.ratingText}>
              4.7
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bookCard}>
          <View
            style={[
              styles.bookCover,
              { backgroundColor: "#92400E" },
            ]}
          >
            <Library
              size={28}
              color="#fff"
            />
          </View>

          <Text style={styles.bookTitle}>
            History of India
          </Text>

          <Text style={styles.bookAuthor}>
            Aryan Gupta
          </Text>

          <View style={styles.ratingRow}>
            <Star
              size={14}
              color="#F59E0B"
              fill="#F59E0B"
            />

            <Text style={styles.ratingText}>
              4.9
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* RECENT BOOKS */}

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
                Advanced Physics
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
                English Literature
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
                Biology Fundamentals
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
            Export Report
          </Text>

          <Text style={styles.quickDesc}>
            Download report
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
            Notify late returns
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACTIVITY */}

      <Text style={styles.sectionTitle}>
        Borrowing Activity
      </Text>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <View style={styles.activityDot} />

          <View>
            <Text style={styles.activityTitle}>
              Rahul borrowed Physics book
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
              New science books added
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
              12 books returned successfully
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

  featuredContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  bookCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
  },

  bookCover: {
    height: 90,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  bookTitle: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  bookAuthor: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  ratingText: {
    marginLeft: 6,
    fontWeight: "700",
    color: "#111827",
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