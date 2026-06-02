// app/admin/classes/index.tsx

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
  School2,
  Users,
  BookOpen,
  Layers3,
  ChevronRight,
  ClipboardList,
  CalendarDays,
  BarChart3,
} from "lucide-react-native";

import { SafeAreaView } from "react-native-safe-area-context";

/* ========================================= */
/* COLORS */
/* ========================================= */

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const WHITE = "#FFFFFF";
const LIGHT_BROWN = "#E7D7C9";

const TEXT_DARK = "#111827";
const TEXT_LIGHT = "#6B7280";

/* ========================================= */
/* DATA */
/* ========================================= */

const stats = [
  {
    title: "Total Classes",
    value: "32",
    icon: "🏫",
    color: "#FDE68A",
  },

  {
    title: "Sections",
    value: "18",
    icon: "📚",
    color: "#DBEAFE",
  },

  {
    title: "Subjects",
    value: "42",
    icon: "📖",
    color: "#DCFCE7",
  },

  {
    title: "Students",
    value: "1250",
    icon: "👨‍🎓",
    color: "#EDE9FE",
  },
];

const classes = [
  {
    id: 1,
    name: "Class 1",
    students: 32,
    sections: 2,
    subjects: 6,
  },

  {
    id: 2,
    name: "Class 2",
    students: 40,
    sections: 3,
    subjects: 7,
  },

  {
    id: 3,
    name: "Class 3",
    students: 38,
    sections: 2,
    subjects: 8,
  },

  {
    id: 4,
    name: "Class 4",
    students: 45,
    sections: 4,
    subjects: 9,
  },
];

const recentActivities = [
  {
    title: "New Section Added",
    desc: "Section B added to Class 5",
    time: "2 hrs ago",
  },

  {
    title: "Subject Updated",
    desc: "Mathematics syllabus updated",
    time: "5 hrs ago",
  },

  {
    title: "Class Teacher Assigned",
    desc: "Mrs. Priya assigned to Class 2",
    time: "Yesterday",
  },
];

/* ========================================= */
/* COMPONENT */
/* ========================================= */

export default function ClassesIndex() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: isMobile ? 16 : 20,
          paddingBottom: 100,
        }}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>
              Classes Dashboard
            </Text>

            <Text style={styles.subheading}>
              Manage classes, sections and subjects
            </Text>
          </View>

          {/* HIDE BUTTON IN MOBILE */}

          {!isMobile && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.addButton}
            >
              <Plus size={16} color="#FFFFFF" />

              <Text style={styles.addButtonText}>
                Add Class
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SEARCH */}

        <View style={styles.searchBox}>
          <Search size={18} color={TEXT_LIGHT} />

          <TextInput
            placeholder="Search classes..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        {/* STATS */}

        <View
          style={[
            styles.statsContainer,
            {
              flexDirection: "row",
              flexWrap: "wrap",
            },
          ]}
        >
          {stats.map((item, index) => (
            <View
              key={index}
              style={[
                styles.statCard,
                {
                  backgroundColor: item.color,
                  width: isMobile ? "48%" : "48%",
                },
              ]}
            >
              <Text style={styles.statIcon}>
                {item.icon}
              </Text>

              <Text style={styles.statValue}>
                {item.value}
              </Text>

              <Text style={styles.statTitle}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>

        {/* QUICK ACTIONS */}

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View
          style={[
            styles.quickActions,
            {
              flexDirection: "row",
            },
          ]}
        >
          <TouchableOpacity style={styles.quickCard}>
            <School2 size={24} color={PRIMARY} />

            <Text style={styles.quickTitle}>
              Classes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard}>
            <Layers3 size={24} color={PRIMARY} />

            <Text style={styles.quickTitle}>
              Sections
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard}>
            <BookOpen size={24} color={PRIMARY} />

            <Text style={styles.quickTitle}>
              Subjects
            </Text>
          </TouchableOpacity>
        </View>

        {/* CLASS LIST */}

        <Text style={styles.sectionTitle}>
          Class Overview
        </Text>

        {classes.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={styles.classCard}
          >
            <View style={styles.classTop}>
              <View>
                <Text style={styles.className}>
                  {item.name}
                </Text>

                <Text style={styles.classDesc}>
                  Academic Management
                </Text>
              </View>

              <View style={styles.arrowBox}>
                <ChevronRight
                  size={18}
                  color={PRIMARY}
                />
              </View>
            </View>

            {/* DETAILS */}

            <View
              style={[
                styles.detailsRow,
                {
                  flexDirection: "row",
                },
              ]}
            >
              <View style={styles.detailCard}>
                <Users size={18} color={PRIMARY} />

                <Text style={styles.detailValue}>
                  {item.students}
                </Text>

                <Text style={styles.detailLabel}>
                  Students
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Layers3 size={18} color={PRIMARY} />

                <Text style={styles.detailValue}>
                  {item.sections}
                </Text>

                <Text style={styles.detailLabel}>
                  Sections
                </Text>
              </View>

              <View style={styles.detailCard}>
                <BookOpen size={18} color={PRIMARY} />

                <Text style={styles.detailValue}>
                  {item.subjects}
                </Text>

                <Text style={styles.detailLabel}>
                  Subjects
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* ACTIVITIES */}

        <Text style={styles.sectionTitle}>
          Recent Activities
        </Text>

        <View style={styles.activityBox}>
          {recentActivities.map((item, index) => (
            <View
              key={index}
              style={styles.activityItem}
            >
              <View style={styles.activityLeft}>
                <ClipboardList
                  size={16}
                  color={PRIMARY}
                />

                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.activityTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.activityDesc}>
                    {item.desc}
                  </Text>
                </View>
              </View>

              <Text style={styles.activityTime}>
                {item.time}
              </Text>
            </View>
          ))}
        </View>

        {/* PERFORMANCE */}

        <Text style={styles.sectionTitle}>
          Academic Performance
        </Text>

        <View style={styles.performanceBox}>
          <BarChart3 size={36} color={PRIMARY} />

          <Text style={styles.performanceText}>
            Academic analytics and class
            performance charts will appear here.
          </Text>
        </View>

        {/* SCHEDULE */}

        <Text style={styles.sectionTitle}>
          Upcoming Schedule
        </Text>

        <View style={styles.scheduleBox}>
          <View style={styles.scheduleRow}>
            <CalendarDays
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.scheduleText}>
              Parent Meeting - Monday
            </Text>
          </View>

          <View style={styles.scheduleRow}>
            <CalendarDays
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.scheduleText}>
              Unit Test Starts - Friday
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ========================================= */
/* STYLES */
/* ========================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 4,
    fontSize: 13,
    color: TEXT_LIGHT,
  },

  addButton: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  addButtonText: {
    color: "#FFFFFF",
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 13,
  },

  searchBox: {
    backgroundColor: WHITE,
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: TEXT_DARK,
  },

  statsContainer: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  statCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  statIcon: {
    fontSize: 22,
    marginBottom: 10,
  },

  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: TEXT_DARK,
  },

  statTitle: {
    marginTop: 4,
    color: TEXT_LIGHT,
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 14,
    marginTop: 6,
  },

  quickActions: {
    justifyContent: "space-between",
    marginBottom: 22,
  },

  quickCard: {
    width: "31%",
    backgroundColor: WHITE,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  quickTitle: {
    marginTop: 8,
    fontWeight: "700",
    color: TEXT_DARK,
    fontSize: 12,
    textAlign: "center",
  },

  classCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },

  classTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  className: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  classDesc: {
    color: TEXT_LIGHT,
    marginTop: 2,
    fontSize: 12,
  },

  arrowBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: LIGHT_BROWN,
    justifyContent: "center",
    alignItems: "center",
  },

  detailsRow: {
    marginTop: 16,
    justifyContent: "space-between",
  },

  detailCard: {
    width: "31%",
    backgroundColor: BACKGROUND,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  detailValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
  },

  detailLabel: {
    marginTop: 4,
    color: TEXT_LIGHT,
    fontSize: 11,
  },

  activityBox: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 22,
  },

  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  activityTitle: {
    fontWeight: "700",
    color: TEXT_DARK,
    fontSize: 13,
  },

  activityDesc: {
    marginTop: 2,
    color: TEXT_LIGHT,
    fontSize: 11,
  },

  activityTime: {
    color: PRIMARY,
    fontWeight: "600",
    fontSize: 11,
  },

  performanceBox: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 22,
  },

  performanceText: {
    marginTop: 12,
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 20,
    fontSize: 13,
  },

  scheduleBox: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
  },

  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  scheduleText: {
    marginLeft: 10,
    color: TEXT_DARK,
    fontWeight: "600",
    fontSize: 13,
  },
});