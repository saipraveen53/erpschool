import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
 TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  Search,
  Plus,
  School2,
  BookOpen,
  CalendarDays,
  CircleCheckBig,
  ArrowLeft,
  Users,
  FileText,
} from "lucide-react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { sectionApi } from "@/app/utils/axiosInstance";

/* ========================================= */
/* UPDATED COLORS */
/* ========================================= */

const COLORS = {
  background: "#F4F8FB",

  card: "#FFFFFF",

  primary: "#203744",

  accent: "#22C7E5",

  secondaryDark: "#162A33",

  lightAccent: "#DDF8FD",

  textDark: "#1E293B",

  textLight: "#64748B",

  border: "#DCE7EF",

  white: "#FFFFFF",
};

const PRIMARY = COLORS.primary;

const ACCENT = COLORS.accent;

const DARK = COLORS.secondaryDark;

const BACKGROUND =
  COLORS.background;

const WHITE = COLORS.card;

const TEXT_DARK =
  COLORS.textDark;

const TEXT_LIGHT =
  COLORS.textLight;

/* ========================================= */
/* COMPONENT */
/* ========================================= */

export default function SectionsPage() {
  const { width } =
    useWindowDimensions();

  const isMobile = width < 768;

  const [activePage, setActivePage] =
    useState("");

  const [
    selectedSection,
    setSelectedSection,
  ] = useState<any>(null);

  const [sectionsData, setSectionsData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  /* ========================================= */
  /* FETCH SECTIONS */
  /* ========================================= */

  const fetchSections = async () => {
    try {
      setLoading(true);

      const response =
        await sectionApi.get(
          "/api/student/class-sections",
        );

      setSectionsData(response.data);
    } catch (error) {
      console.log(
        "Fetch Sections Error:",
        error,
      );

      Alert.alert(
        "Error",
        "Failed to fetch sections",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================= */
  /* INITIAL LOAD */
  /* ========================================= */

  useEffect(() => {
    fetchSections();
  }, []);

  /* ========================================= */
  /* FILTERED DATA */
  /* ========================================= */

  const filteredSections =
    sectionsData.filter(
      (item: any) =>
        `${item.className} ${item.section}`
          .toLowerCase()
          .includes(
            searchText.toLowerCase(),
          ),
    );

  /* ========================================= */
  /* SECTION DETAILS */
  /* ========================================= */

  const renderSectionDetails = () => {
    if (!selectedSection) return null;

    return (
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>
          Class{" "}
          {selectedSection.className} -
          {selectedSection.section}
        </Text>

        <View style={styles.infoRow}>
          <Users
            size={18}
            color={ACCENT}
          />

          <Text style={styles.infoText}>
            Teacher:{" "}
            {selectedSection.classTeacherName ||
              "Not Assigned"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <School2
            size={18}
            color={ACCENT}
          />

          <Text style={styles.infoText}>
            Capacity:{" "}
            {selectedSection.capacity}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <BookOpen
            size={18}
            color={ACCENT}
          />

          <Text style={styles.infoText}>
            Current Strength:{" "}
            {
              selectedSection.currentStrength
            }
          </Text>
        </View>

        <View style={styles.infoRow}>
          <CalendarDays
            size={18}
            color={ACCENT}
          />

          <Text style={styles.infoText}>
            Academic Year:{" "}
            {
              selectedSection.academicYear
            }
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FileText
            size={18}
            color={ACCENT}
          />

          <Text style={styles.infoText}>
            Subjects Count:{" "}
            {
              selectedSection.subjectIds
                ?.length
            }
          </Text>
        </View>

        <View style={styles.infoRow}>
          <CircleCheckBig
            size={18}
            color={ACCENT}
          />

          <Text style={styles.infoText}>
            Section ID:{" "}
            {
              selectedSection.classSectionId
            }
          </Text>
        </View>
      </View>
    );
  };

  /* ========================================= */
  /* MAIN UI */
  /* ========================================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          padding: isMobile
            ? 16
            : 22,
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.heading,
                isMobile && {
                  fontSize: 24,
                },
              ]}
            >
              Sections Management
            </Text>

            <Text
              style={styles.subheading}
            >
              Manage academic
              sections and schedules
            </Text>
          </View>

          {!isMobile && (
            <TouchableOpacity
              style={styles.addButton}
            >
              <Plus
                size={16}
                color={COLORS.white}
              />

              <Text
                style={
                  styles.addButtonText
                }
              >
                Add Section
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SEARCH */}

        <View style={styles.searchBox}>
          <Search
            size={18}
            color={ACCENT}
          />

          <TextInput
            placeholder="Search sections..."
            placeholderTextColor={
              TEXT_LIGHT
            }
            style={styles.searchInput}
            value={searchText}
            onChangeText={
              setSearchText
            }
          />
        </View>

        {/* BACK BUTTON */}

        {(activePage !== "" ||
          selectedSection) && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setActivePage("");
              setSelectedSection(
                null,
              );
            }}
          >
            <ArrowLeft
              size={18}
              color={COLORS.white}
            />

            <Text
              style={styles.backText}
            >
              Back
            </Text>
          </TouchableOpacity>
        )}

        {/* LOADING */}

        {loading ? (
          <ActivityIndicator
            size="large"
            color={ACCENT}
            style={{
              marginTop: 50,
            }}
          />
        ) : activePage === "" &&
          !selectedSection ? (
          <>
            {/* SECTION BUTTONS */}

            <Text
              style={styles.sectionTitle}
            >
              Section Wise
              Information
            </Text>

            <View
              style={[
                styles.buttonGrid,
                isMobile && {
                  flexDirection:
                    "column",
                },
              ]}
            >
              {filteredSections.map(
                (
                  item: any,
                  index,
                ) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.bigButton,
                      isMobile && {
                        width: "100%",
                      },
                    ]}
                    onPress={() =>
                      setSelectedSection(
                        item,
                      )
                    }
                  >
                    <School2
                      size={34}
                      color={ACCENT}
                    />

                    <Text
                      style={
                        styles.buttonTitle
                      }
                    >
                      Class{" "}
                      {
                        item.className
                      }{" "}
                      -{" "}
                      {item.section}
                    </Text>

                    <Text
                      style={
                        styles.buttonDesc
                      }
                    >
                      {
                        item.academicYear
                      }
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            {/* UTILITIES */}

            <Text
              style={styles.sectionTitle}
            >
              Academic Utilities
            </Text>

            <View
              style={[
                styles.buttonGrid,
                isMobile && {
                  flexDirection:
                    "column",
                },
              ]}
            >
              {/* WEEKLY SCHEDULE */}

              <TouchableOpacity
                style={[
                  styles.bigButton,
                  isMobile && {
                    width: "100%",
                  },
                ]}
                onPress={() =>
                  setActivePage(
                    "schedule",
                  )
                }
              >
                <CalendarDays
                  size={34}
                  color={ACCENT}
                />

                <Text
                  style={
                    styles.buttonTitle
                  }
                >
                  Weekly Schedule
                </Text>

                <Text
                  style={
                    styles.buttonDesc
                  }
                >
                  View school timings
                </Text>
              </TouchableOpacity>

              {/* SUBJECT INFO */}

              <TouchableOpacity
                style={[
                  styles.bigButton,
                  isMobile && {
                    width: "100%",
                  },
                ]}
                onPress={() =>
                  setActivePage(
                    "subjects",
                  )
                }
              >
                <BookOpen
                  size={34}
                  color={ACCENT}
                />

                <Text
                  style={
                    styles.buttonTitle
                  }
                >
                  Subject Information
                </Text>

                <Text
                  style={
                    styles.buttonDesc
                  }
                >
                  Academic subject
                  data
                </Text>
              </TouchableOpacity>

              {/* GUIDELINES */}

              <TouchableOpacity
                style={[
                  styles.bigButton,
                  isMobile && {
                    width: "100%",
                  },
                ]}
                onPress={() =>
                  setActivePage(
                    "guidelines",
                  )
                }
              >
                <CircleCheckBig
                  size={34}
                  color={ACCENT}
                />

                <Text
                  style={
                    styles.buttonTitle
                  }
                >
                  Guidelines
                </Text>

                <Text
                  style={
                    styles.buttonDesc
                  }
                >
                  School rules and
                  policies
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : selectedSection ? (
          renderSectionDetails()
        ) : (
          <View style={styles.detailsCard}>
            {activePage ===
              "schedule" && (
              <>
                <Text
                  style={
                    styles.detailsTitle
                  }
                >
                  Weekly Schedule
                </Text>

                <Text
                  style={
                    styles.detailText
                  }
                >
                  • Morning Shift:
                  8:30 AM - 1:00 PM
                </Text>

                <Text
                  style={
                    styles.detailText
                  }
                >
                  • Afternoon Shift:
                  1:30 PM - 5:00 PM
                </Text>

                <Text
                  style={
                    styles.detailText
                  }
                >
                  • Saturday
                  Activities: 10:00 AM
                </Text>
              </>
            )}

            {activePage ===
              "subjects" && (
              <>
                <Text
                  style={
                    styles.detailsTitle
                  }
                >
                  Subject Information
                </Text>

                <Text
                  style={
                    styles.detailText
                  }
                >
                  • Mathematics Lab
                  Available
                </Text>

                <Text
                  style={
                    styles.detailText
                  }
                >
                  • Science
                  Practicals Every
                  Wednesday
                </Text>

                <Text
                  style={
                    styles.detailText
                  }
                >
                  • English
                  Communication
                  Classes on Fridays
                </Text>
              </>
            )}

            {activePage ===
              "guidelines" && (
              <>
                <Text
                  style={
                    styles.detailsTitle
                  }
                >
                  Section Guidelines
                </Text>

                <Text
                  style={
                    styles.detailText
                  }
                >
                  • Attendance before
                  10:00 AM
                </Text>

                <Text
                  style={
                    styles.detailText
                  }
                >
                  • Homework updates
                  every Friday
                </Text>

                <Text
                  style={
                    styles.detailText
                  }
                >
                  • Monthly Parent
                  Meetings
                </Text>
              </>
            )}
          </View>
        )}
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
    backgroundColor:
      COLORS.background,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: DARK,
  },

  subheading: {
    marginTop: 4,
    fontSize: 13,
    color: TEXT_LIGHT,
  },

  addButton: {
    backgroundColor: ACCENT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 16,
  },

  addButtonText: {
    color: COLORS.white,
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 13,
  },

  searchBox: {
    backgroundColor:
      COLORS.lightAccent,
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: TEXT_DARK,
  },

  backButton: {
    backgroundColor: DARK,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 20,
  },

  backText: {
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: DARK,
    marginBottom: 18,
    marginTop: 6,
  },

  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  bigButton: {
    width: "48%",
    backgroundColor:
      COLORS.lightAccent,
    borderRadius: 22,
    paddingVertical: 32,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  buttonTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: DARK,
    textAlign: "center",
  },

  buttonDesc: {
    marginTop: 8,
    fontSize: 12,
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 18,
  },

  detailsCard: {
    backgroundColor:
      COLORS.lightAccent,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  detailsTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: DARK,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  infoText: {
    marginLeft: 12,
    fontSize: 15,
    color: TEXT_DARK,
    fontWeight: "600",
    flex: 1,
  },

  detailText: {
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
});