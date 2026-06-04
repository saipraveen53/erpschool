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
  ShieldCheck,
} from "lucide-react-native";

import { StatusBar } from "expo-status-bar";

import { staffAttendanceApi } from "@/app/utils/axiosInstance";

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

export default function StaffAttendance() {
  /* ======================================= */
  /* STATES */
  /* ======================================= */

  const [attendanceData, setAttendanceData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [classSectionId, setClassSectionId] =
    useState("CLS2026003");

  const [date, setDate] =
    useState("2026-06-03");

  /* ======================================= */
  /* FETCH ATTENDANCE */
  /* ======================================= */

  const fetchAttendance =
    async () => {
      try {
        setLoading(true);

        const response =
          await staffAttendanceApi.get(
            `/api/student/attendance/class/${classSectionId}/date/${date}`,
          );

        console.log(
          "Staff Attendance Response:",
          response.data,
        );

        const attendance =
          Array.isArray(response.data)
            ? response.data
            : [];

        setAttendanceData(attendance);
      } catch (error) {
        console.log(
          "Attendance Fetch Error:",
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
  /* COUNTS */
  /* ======================================= */

  const presentCount =
    attendanceData.filter(
      (item) =>
        item.status === "PRESENT",
    ).length;

  const absentCount =
    attendanceData.filter(
      (item) =>
        item.status === "ABSENT",
    ).length;

  const holidayCount =
    attendanceData.filter(
      (item) =>
        item.status === "HOLIDAY",
    ).length;

  const notMarkedCount =
    attendanceData.filter(
      (item) =>
        item.status === "NOT_MARKED",
    ).length;

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
            Staff Attendance
          </Text>

          <Text style={styles.subheading}>
            Faculty attendance and
            workforce analytics
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
          Smart Workforce Monitoring
        </Text>

        <Text style={styles.heroText}>
          AI-powered staff attendance
          insights, punctuality
          tracking and department
          productivity reports
        </Text>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search
          size={18}
          color={COLORS.textSub}
        />

        <TextInput
          placeholder="Class Section ID"
          placeholderTextColor={
            COLORS.textSub
          }
          style={styles.searchInput}
          value={classSectionId}
          onChangeText={
            setClassSectionId
          }
        />

        <TextInput
          placeholder="YYYY-MM-DD"
          placeholderTextColor={
            COLORS.textSub
          }
          style={styles.dateInput}
          value={date}
          onChangeText={setDate}
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
            {presentCount}
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
            {absentCount}
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
            {holidayCount}
          </Text>

          <Text style={styles.label}>
            Holidays
          </Text>
        </View>

        {/* NOT MARKED */}

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
            {notMarkedCount}
          </Text>

          <Text style={styles.label}>
            Not Marked
          </Text>
        </View>
      </View>

      {/* ATTENDANCE LIST */}

      <Text style={styles.sectionTitle}>
        Faculty Attendance
      </Text>

      <FlatList
        data={attendanceData}
        scrollEnabled={false}
        keyExtractor={(item, index) =>
          index.toString()
        }
        renderItem={({ item }) => (
          <View
            style={styles.staffCard}
          >
            {/* STAFF INFO */}

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.staffName
                }
              >
                {item.name}
              </Text>

              <Text
                style={
                  styles.staffInfo
                }
              >
                {item.studentId}
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

      {/* SECURITY */}

      <Text style={styles.sectionTitle}>
        Attendance Security
      </Text>

      <View style={styles.securityCard}>
        <ShieldCheck
          size={34}
          color={PRIMARY}
        />

        <Text
          style={styles.securityTitle}
        >
          Biometric Attendance Active
        </Text>

        <Text
          style={styles.securityText}
        >
          Attendance records are synced
          securely using biometric and
          RFID-based verification
          systems
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

  dateInput: {
    width: 110,
    marginLeft: 8,
    backgroundColor:
      COLORS.lightAccent,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 12,
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

  staffCard: {
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

  staffName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textMain,
  },

  staffInfo: {
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

  securityCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  securityTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
    textAlign: "center",
  },

  securityText: {
    marginTop: 8,
    textAlign: "center",
    color: COLORS.textSub,
    lineHeight: 20,
    fontSize: 13,
  },
});