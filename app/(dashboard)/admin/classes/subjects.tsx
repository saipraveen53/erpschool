// app/admin/classes/subjects.tsx

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
  Clock3,
  UserCheck,
  School2,
  CalendarDays,
  FileText,
  CircleCheckBig,
} from "lucide-react-native";

import { SafeAreaView } from "react-native-safe-area-context";

/* ========================================= */
/* COLORS */
/* ========================================= */

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const WHITE = "#FFFFFF";

const TEXT_DARK = "#000000";
const BORDER = "#E5E7EB";

/* ========================================= */
/* DATA */
/* ========================================= */

const subjectsData = [
  {
    id: 1,
    subject: "Mathematics",
    teacher: "Mrs. Kavya",
    classes: "Class 2 & 3",
    timing: "9:00 AM - 10:00 AM",
    room: "201",
    syllabus: "Algebra, Geometry, Numbers",
  },

  {
    id: 2,
    subject: "Science",
    teacher: "Mr. Arjun",
    classes: "Class 3",
    timing: "10:30 AM - 11:30 AM",
    room: "301",
    syllabus: "Physics, Chemistry, Biology",
  },

  {
    id: 3,
    subject: "English",
    teacher: "Mrs. Priya",
    classes: "Class 1 & 2",
    timing: "11:30 AM - 12:30 PM",
    room: "102",
    syllabus: "Grammar, Reading, Writing",
  },

  {
    id: 4,
    subject: "Computer Science",
    teacher: "Mr. Rahul",
    classes: "Class 3",
    timing: "1:30 PM - 2:30 PM",
    room: "Lab 1",
    syllabus: "Programming Basics",
  },
];

/* ========================================= */
/* COMPONENT */
/* ========================================= */

export default function SubjectsPage() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: isMobile ? 16 : 22,
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>
              Subjects Management
            </Text>

            <Text style={styles.subheading}>
              Manage subjects, schedules and
              faculty information
            </Text>
          </View>

          {!isMobile && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.addButton}
            >
              <Plus size={16} color="#FFFFFF" />

              <Text style={styles.addButtonText}>
                Add Subject
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SEARCH */}

        <View style={styles.searchBox}>
          <Search size={18} color="#6B7280" />

          <TextInput
            placeholder="Search subjects..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        {/* SUBJECT CARDS */}

        <Text style={styles.sectionTitle}>
          Subjects Information
        </Text>

        <View style={styles.tablesWrapper}>
          {subjectsData.map((item) => (
            <View
              key={item.id}
              style={[
                styles.singleTableContainer,
                !isMobile && styles.desktopCard,
              ]}
            >
              {/* HEADER */}

              <View style={styles.singleHeader}>
                <Text style={styles.singleHeaderText}>
                  {item.subject}
                </Text>
              </View>

              {/* BODY */}

              <View style={styles.singleBody}>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    Subject Teacher
                  </Text>

                  <View style={styles.iconRow}>
                    <UserCheck
                      size={15}
                      color={PRIMARY}
                    />

                    <Text style={styles.valueInline}>
                      {item.teacher}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Classes
                  </Text>

                  <View style={styles.iconRow}>
                    <School2
                      size={15}
                      color={PRIMARY}
                    />

                    <Text style={styles.valueInline}>
                      {item.classes}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Timing
                  </Text>

                  <View style={styles.iconRow}>
                    <Clock3
                      size={15}
                      color={PRIMARY}
                    />

                    <Text style={styles.valueInline}>
                      {item.timing}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Room
                  </Text>

                  <Text style={styles.value}>
                    {item.room}
                  </Text>
                </View>

                <View style={styles.lastRow}>
                  <Text style={styles.label}>
                    Syllabus
                  </Text>

                  <Text style={styles.value}>
                    {item.syllabus}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* SUBJECT RULES */}

        <Text style={styles.sectionTitle}>
          Subject Guidelines
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <CircleCheckBig
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Weekly assignments should be
              uploaded every Friday.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <CircleCheckBig
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Subject attendance must be marked
              daily.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <CircleCheckBig
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Teachers should complete syllabus
              before examinations.
            </Text>
          </View>
        </View>

        {/* EXAM INFORMATION */}

        <Text style={styles.sectionTitle}>
          Examination Information
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <CalendarDays
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Mid Term Exams begin from
              September 12.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <CalendarDays
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Final Practical Exams scheduled
              every Wednesday.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <FileText
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Internal assessment marks updated
              monthly.
            </Text>
          </View>
        </View>

        {/* LAB INFORMATION */}

        <Text style={styles.sectionTitle}>
          Lab Information
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <BookOpen
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Computer Lab available for
              programming classes.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <BookOpen
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Science Lab practical sessions
              every Thursday.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <BookOpen
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Mathematics activity room open
              for workshops.
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
    marginBottom: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 4,
    fontSize: 13,
    color: "#000000",
  },

  addButton: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 16,
  },

  addButtonText: {
    color: "#FFFFFF",
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 13,
  },

  searchBox: {
    backgroundColor: WHITE,
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 28,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#000000",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 18,
    marginTop: 6,
  },

  /* SUBJECT GRID */

  tablesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  desktopCard: {
    width: "48.5%",
  },

  singleTableContainer: {
    backgroundColor: WHITE,
    borderRadius: 22,
    marginBottom: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    width: "100%",
  },

  singleHeader: {
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  singleHeaderText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  singleBody: {
    paddingHorizontal: 18,
    paddingVertical: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  lastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 16,
  },

  label: {
    width: "38%",
    fontSize: 14,
    fontWeight: "800",
    color: "#000000",
  },

  value: {
    width: "58%",
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
    lineHeight: 22,
  },

  iconRow: {
    width: "58%",
    flexDirection: "row",
    alignItems: "center",
  },

  valueInline: {
    marginLeft: 8,
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
  },

  /* EXTRA INFORMATION */

  infoContainer: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  infoText: {
    marginLeft: 12,
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    lineHeight: 22,
  },
});