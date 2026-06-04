import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  Search,
  UserCheck,
  UserX,
  Clock3,
  CalendarDays,
  Filter,
  CircleCheck,
  CircleX,
  Sparkles,
} from "lucide-react-native";

import { studentAttendanceApi } from "@/app/utils/axiosInstance";

/* ======================================= */
/* UPDATED COLORS */
/* ======================================= */

const COLORS = {
  background: "#F4F8FB",
  card: "#FFFFFF",

  primary: "#1E293B",
  accent: "#22C7E5",

  textMain: "#1E293B",
  textSub: "#64748B",

  border: "#DCE7EF",

  white: "#FFFFFF",

  lightAccent: "#DDF8FD",
};

const PRIMARY = COLORS.primary;

const BG = COLORS.background;

const CARD = COLORS.card;

const { width } = Dimensions.get("window");

export default function StudentAttendance() {
  /* ======================================= */
  /* STATES */
  /* ======================================= */

  const [attendanceData, setAttendanceData] =
    useState<any>(null);

  const [dailyRecords, setDailyRecords] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [studentId, setStudentId] =
    useState("STU2026003");

  const [year, setYear] =
    useState("2026");

  const [month, setMonth] =
    useState("6");

  /* ======================================= */
  /* FETCH ATTENDANCE */
  /* ======================================= */

  const fetchAttendance =
    async () => {
      try {
        setLoading(true);

        const response =
          await studentAttendanceApi.get(
            `/api/student/attendance/${studentId}/${year}/${month}`,
          );

        console.log(
          "Attendance Response:",
          response.data,
        );

        setAttendanceData(response.data);

        setDailyRecords(
          response.data.dailyRecords || [],
        );
      } catch (error) {
        console.log(
          "Attendance Error:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAttendance();
  }, []);

  /* ======================================= */
  /* STATUS COLORS */
  /* ======================================= */

  const getStatusColor = (
    status: string,
  ) => {
    switch (status) {
      case "PRESENT":
        return "#DDF8FD";

      case "ABSENT":
        return "#FFE4E6";

      case "HOLIDAY":
        return "#E0F2FE";

      default:
        return "#CCFBF1";
    }
  };

  /* ======================================= */
  /* STATUS ICON */
  /* ======================================= */

  const renderStatusIcon = (
    status: string,
  ) => {
    switch (status) {
      case "PRESENT":
        return (
          <CircleCheck
            size={14}
            color="green"
          />
        );

      case "ABSENT":
        return (
          <CircleX
            size={14}
            color="red"
          />
        );

      case "HOLIDAY":
        return (
          <CalendarDays
            size={14}
            color="#0284C7"
          />
        );

      default:
        return (
          <Clock3
            size={14}
            color="#0F766E"
          />
        );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <StatusBar style="dark" />

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            Student Attendance
          </Text>

          <Text style={styles.subheading}>
            Smart attendance tracking
            and analytics
          </Text>
        </View>
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <Sparkles
          size={36}
          color="#fff"
        />

        <Text style={styles.heroTitle}>
          AI Attendance Insights
        </Text>

        <Text style={styles.heroText}>
          Real-time student attendance
          tracking with smart reporting
          and predictive analytics
        </Text>
      </View>

      {/* SEARCH SECTION */}

      <View style={styles.searchContainer}>
        <Search
          size={18}
          color={COLORS.textSub}
        />

        <TextInput
          placeholder="Student ID"
          placeholderTextColor={
            COLORS.textSub
          }
          style={styles.searchInput}
          value={studentId}
          onChangeText={setStudentId}
        />

        <TextInput
          placeholder="Year"
          placeholderTextColor={
            COLORS.textSub
          }
          style={styles.smallInput}
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Month"
          placeholderTextColor={
            COLORS.textSub
          }
          style={styles.smallInput}
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.filterButton}
          onPress={fetchAttendance}
        >
          <Filter
            size={16}
            color={PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {/* LOADER */}

      {loading && (
        <ActivityIndicator
          size="large"
          color={PRIMARY}
          style={{ marginBottom: 20 }}
        />
      )}

      {/* STATS */}

      <View style={styles.grid}>
        {/* PRESENT */}

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                "#DDF8FD",
            },
          ]}
        >
          <UserCheck
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.number}>
            {attendanceData?.present ||
              0}
          </Text>

          <Text style={styles.label}>
            Present
          </Text>
        </View>

        {/* ABSENT */}

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                "#FFE4E6",
            },
          ]}
        >
          <UserX
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.number}>
            {attendanceData?.absent ||
              0}
          </Text>

          <Text style={styles.label}>
            Absent
          </Text>
        </View>

        {/* HOLIDAYS */}

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                "#E0F2FE",
            },
          ]}
        >
          <CalendarDays
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.number}>
            {attendanceData?.holidays ||
              0}
          </Text>

          <Text style={styles.label}>
            Holidays
          </Text>
        </View>

        {/* PERCENTAGE */}

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                "#CCFBF1",
            },
          ]}
        >
          <Clock3
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.number}>
            {attendanceData?.percentage ||
              0}
            %
          </Text>

          <Text style={styles.label}>
            Attendance
          </Text>
        </View>
      </View>

      {/* RECORDS */}

      <Text style={styles.sectionTitle}>
        Daily Attendance Records
      </Text>

      <FlatList
        data={dailyRecords}
        scrollEnabled={false}
        keyExtractor={(item, index) =>
          index.toString()
        }
        renderItem={({ item }) => (
          <View
            style={styles.studentCard}
          >
            {/* DATE */}

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.studentName
                }
              >
                {item.date}
              </Text>

              <Text
                style={
                  styles.studentInfo
                }
              >
                Attendance Record
              </Text>
            </View>

            {/* STATUS */}

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    getStatusColor(
                      item.status,
                    ),
                },
              ]}
            >
              {renderStatusIcon(
                item.status,
              )}

              <Text
                style={
                  styles.statusText
                }
              >
                {item.status}
              </Text>
            </View>
          </View>
        )}
      />

      {/* PERFORMANCE */}

      <Text style={styles.sectionTitle}>
        Attendance Performance
      </Text>

      <View style={styles.performanceCard}>
        <Text
          style={
            styles.performanceTitle
          }
        >
          Student ID
        </Text>

        <Text
          style={
            styles.performanceValue
          }
        >
          {attendanceData?.studentId ||
            "N/A"}
        </Text>

        <Text
          style={styles.performanceSub}
        >
          Attendance analytics for{" "}
          {month}/{year}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 100,
  },

  header: {
    marginBottom: 18,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 4,
    color: COLORS.textSub,
    fontSize: 13,
    lineHeight: 18,
  },

  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },

  heroText: {
    color: "#E2F8FC",
    marginTop: 8,
    lineHeight: 20,
    fontSize: 13,
  },

  searchContainer: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textMain,
  },

  smallInput: {
    width: 60,
    marginLeft: 8,
    backgroundColor:
      COLORS.lightAccent,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 13,
    color: COLORS.textMain,
  },

  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor:
      COLORS.lightAccent,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
    marginBottom: 22,
  },

  card: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  number: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
    color: COLORS.textMain,
  },

  label: {
    marginTop: 4,
    color: COLORS.textSub,
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 14,
  },

  studentCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  studentName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textMain,
  },

  studentInfo: {
    marginTop: 3,
    color: COLORS.textSub,
    fontSize: 12,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  statusText: {
    fontWeight: "700",
    fontSize: 11,
    color: COLORS.textMain,
  },

  performanceCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  performanceTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
  },

  performanceValue: {
    fontSize: 26,
    fontWeight: "900",
    marginTop: 10,
    color: COLORS.textMain,
  },

  performanceSub: {
    marginTop: 6,
    color: COLORS.textSub,
    fontSize: 13,
  },
});