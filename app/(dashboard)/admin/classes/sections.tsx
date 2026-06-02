// app/admin/classes/sections.tsx

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
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Clock3,
  BookOpen,
  UserCheck,
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

const sectionsData = [
  {
    id: 1,
    section: "Class 1 - A",
    teacher: "Mrs. Priya",
    students: [
      "Aarav",
      "Rohan",
      "Ananya",
      "Diya",
    ],
    totalStudents: 32,
    room: "101",
    shift: "Morning",
    floor: "1st Floor",
    subject: "Primary Basics",
    phone: "+91 9876543210",
    email: "priya@edux.com",
  },

  {
    id: 2,
    section: "Class 1 - B",
    teacher: "Mr. Rahul",
    students: [
      "Vivaan",
      "Kabir",
      "Ishita",
      "Sneha",
    ],
    totalStudents: 30,
    room: "102",
    shift: "Morning",
    floor: "1st Floor",
    subject: "Primary Basics",
    phone: "+91 9988776655",
    email: "rahul@edux.com",
  },

  {
    id: 3,
    section: "Class 2 - A",
    teacher: "Mrs. Kavya",
    students: [
      "Arjun",
      "Meera",
      "Aditya",
      "Nisha",
    ],
    totalStudents: 36,
    room: "201",
    shift: "Afternoon",
    floor: "2nd Floor",
    subject: "Mathematics",
    phone: "+91 9123456789",
    email: "kavya@edux.com",
  },

  {
    id: 4,
    section: "Class 3 - A",
    teacher: "Mr. Arjun",
    students: [
      "Rahul",
      "Kiran",
      "Pooja",
      "Sai",
    ],
    totalStudents: 40,
    room: "301",
    shift: "Morning",
    floor: "3rd Floor",
    subject: "Science",
    phone: "+91 9345678912",
    email: "arjun@edux.com",
  },
];

/* ========================================= */
/* COMPONENT */
/* ========================================= */

export default function SectionsPage() {
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
              Sections Management
            </Text>

            <Text style={styles.subheading}>
              Manage class sections, teachers and
              students
            </Text>
          </View>

          {!isMobile && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.addButton}
            >
              <Plus size={16} color="#FFFFFF" />

              <Text style={styles.addButtonText}>
                Add Section
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SEARCH */}

        <View style={styles.searchBox}>
          <Search size={18} color="#6B7280" />

          <TextInput
            placeholder="Search sections..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        {/* SECTION TABLES */}

        <Text style={styles.sectionTitle}>
          Sections Information
        </Text>

        <View style={styles.tablesWrapper}>
          {sectionsData.map((item) => (
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
                  {item.section}
                </Text>
              </View>

              {/* BODY */}

              <View style={styles.singleBody}>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    Teacher
                  </Text>

                  <Text style={styles.value}>
                    {item.teacher}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Students
                  </Text>

                  <Text style={styles.value}>
                    {item.students.join(", ")}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Total Students
                  </Text>

                  <Text style={styles.value}>
                    {item.totalStudents}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Main Subject
                  </Text>

                  <Text style={styles.value}>
                    {item.subject}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Shift
                  </Text>

                  <Text style={styles.value}>
                    {item.shift}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Floor
                  </Text>

                  <View style={styles.iconRow}>
                    <MapPin
                      size={15}
                      color={PRIMARY}
                    />

                    <Text style={styles.valueInline}>
                      {item.floor}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Room No
                  </Text>

                  <Text style={styles.value}>
                    {item.room}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Contact
                  </Text>

                  <View style={styles.iconRow}>
                    <Phone
                      size={15}
                      color={PRIMARY}
                    />

                    <Text style={styles.valueInline}>
                      {item.phone}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Email
                  </Text>

                  <View style={styles.iconRow}>
                    <Mail
                      size={15}
                      color={PRIMARY}
                    />

                    <Text style={styles.valueInline}>
                      {item.email}
                    </Text>
                  </View>
                </View>

                <View style={styles.lastRow}>
                  <Text style={styles.label}>
                    Schedule
                  </Text>

                  <View style={styles.iconRow}>
                    <CalendarDays
                      size={15}
                      color={PRIMARY}
                    />

                    <Text style={styles.valueInline}>
                      Monday - Friday
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ================================= */}
        {/* SECTION SCHEDULE */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          Weekly Schedule
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Clock3 size={18} color={PRIMARY} />

            <Text style={styles.infoText}>
              Morning Shift: 8:30 AM - 1:00 PM
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Clock3 size={18} color={PRIMARY} />

            <Text style={styles.infoText}>
              Afternoon Shift: 1:30 PM - 5:00 PM
            </Text>
          </View>

          <View style={styles.infoRow}>
            <CalendarDays
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Saturday Activities: 10:00 AM
            </Text>
          </View>
        </View>

        {/* ================================= */}
        {/* SUBJECT INFORMATION */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          Subject Information
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <BookOpen
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Mathematics Lab Available for
              Classes 2 & 3
            </Text>
          </View>

          <View style={styles.infoRow}>
            <BookOpen
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Science Practical Sessions Every
              Wednesday
            </Text>
          </View>

          <View style={styles.infoRow}>
            <BookOpen
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              English Communication Classes on
              Fridays
            </Text>
          </View>
        </View>

        {/* ================================= */}
        {/* CLASS RULES */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          Section Guidelines
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <CircleCheckBig
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Attendance must be updated before
              10:00 AM
            </Text>
          </View>

          <View style={styles.infoRow}>
            <CircleCheckBig
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Homework reports submitted every
              Friday
            </Text>
          </View>

          <View style={styles.infoRow}>
            <CircleCheckBig
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Parent meetings conducted monthly
            </Text>
          </View>

          <View style={styles.infoRow}>
            <UserCheck
              size={18}
              color={PRIMARY}
            />

            <Text style={styles.infoText}>
              Class teachers responsible for
              discipline records
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

  /* TABLE GRID */

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