import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Clock, MapPin, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

const COLORS = {
  bgWhite: "#FFFFFF",
  lightGray: "#F5F5F5",
  primary: "#E35336", // Terracotta
  darkBg: "#2A1308", // Deep Brown
  textPrimary: "#5C2E14", // Dark Brown
  textSecondary: "#A0522D", // Sienna
  white: "#FFFFFF",
  accentLight: "rgba(227, 83, 54, 0.1)", // Light Terracotta for accents
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Dummy Timetable Data structured by day
const TIMETABLE_DATA: Record<string, any[]> = {
  Monday: [
    {
      id: "1",
      startTime: "08:00 AM",
      endTime: "08:45 AM",
      subject: "Mathematics",
      classStr: "10-A",
      room: "Room 204",
      type: "class",
    },
    {
      id: "2",
      startTime: "08:45 AM",
      endTime: "09:30 AM",
      subject: "Mathematics",
      classStr: "10-B",
      room: "Room 205",
      type: "class",
    },
    {
      id: "3",
      startTime: "09:30 AM",
      endTime: "10:15 AM",
      subject: "Free Period",
      classStr: "-",
      room: "Staff Room",
      type: "free",
    },
    {
      id: "4",
      startTime: "10:30 AM",
      endTime: "11:15 AM",
      subject: "Physics",
      classStr: "11-Science",
      room: "Science Lab",
      type: "class",
    },
    {
      id: "5",
      startTime: "11:15 AM",
      endTime: "12:00 PM",
      subject: "Physics",
      classStr: "12-Science",
      room: "Science Lab",
      type: "class",
    },
  ],
  Tuesday: [
    {
      id: "1",
      startTime: "08:00 AM",
      endTime: "08:45 AM",
      subject: "Physics",
      classStr: "11-Science",
      room: "Science Lab",
      type: "class",
    },
    {
      id: "2",
      startTime: "08:45 AM",
      endTime: "09:30 AM",
      subject: "Free Period",
      classStr: "-",
      room: "Staff Room",
      type: "free",
    },
    {
      id: "3",
      startTime: "09:30 AM",
      endTime: "10:15 AM",
      subject: "Mathematics",
      classStr: "10-A",
      room: "Room 204",
      type: "class",
    },
  ],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

export default function TimetableScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [selectedDay, setSelectedDay] = useState("Monday");

  const currentSchedule = TIMETABLE_DATA[selectedDay] || [];

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Timetable</Text>
        <View style={{ width: 40 }} /> {/* Spacer for centering title */}
      </View>

      <View
        style={[styles.contentWrapper, { maxWidth: isDesktop ? 800 : "100%" }]}
      >
        {/* --- DAY SELECTOR --- */}
        <View style={styles.daySelectorContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayScrollContent}
          >
            {DAYS.map((day) => {
              const isActive = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayButton, isActive && styles.dayButtonActive]}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      isActive && styles.dayButtonTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* --- TIMETABLE LIST --- */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {currentSchedule.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No classes scheduled for {selectedDay}.
              </Text>
            </View>
          ) : (
            currentSchedule.map((period, index) => {
              const isFree = period.type === "free";
              return (
                <View key={period.id} style={styles.periodCard}>
                  {/* Left Timeline Side */}
                  <View style={styles.timeLineContainer}>
                    <Text style={styles.startTime}>{period.startTime}</Text>
                    <Text style={styles.endTime}>{period.endTime}</Text>
                    {/* Connecting line */}
                    {index !== currentSchedule.length - 1 && (
                      <View style={styles.verticalLine} />
                    )}
                  </View>

                  {/* Right Details Side */}
                  <View
                    style={[
                      styles.detailsContainer,
                      isFree && styles.detailsContainerFree,
                    ]}
                  >
                    <View style={styles.subjectHeader}>
                      <Text
                        style={[
                          styles.subjectText,
                          isFree && { color: COLORS.textSecondary },
                        ]}
                      >
                        {period.subject}
                      </Text>
                      {!isFree && (
                        <View style={styles.classBadge}>
                          <Text style={styles.classBadgeText}>
                            {period.classStr}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.metaRowContainer}>
                      <View style={styles.metaItem}>
                        <Clock size={14} color={COLORS.textSecondary} />
                        <Text style={styles.metaText}>45 mins</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MapPin size={14} color={COLORS.textSecondary} />
                        <Text style={styles.metaText}>{period.room}</Text>
                      </View>
                      {!isFree && (
                        <View style={styles.metaItem}>
                          <Users size={14} color={COLORS.textSecondary} />
                          <Text style={styles.metaText}>40 Students</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  contentWrapper: { flex: 1, width: "100%", alignSelf: "center" },

  // Day Selector
  daySelectorContainer: {
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
    paddingVertical: 12,
  },
  dayScrollContent: { paddingHorizontal: 24, gap: 12 },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  dayButtonActive: { backgroundColor: COLORS.primary },
  dayButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  dayButtonTextActive: { color: COLORS.white, fontWeight: "800" },

  // Timetable List
  listContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  periodCard: { flexDirection: "row", marginBottom: 20 },

  // Left Timeline
  timeLineContainer: {
    width: 85,
    alignItems: "flex-end",
    paddingRight: 16,
    position: "relative",
  },
  startTime: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  endTime: { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary },
  verticalLine: {
    position: "absolute",
    right: 0,
    top: 40,
    bottom: -30,
    width: 2,
    backgroundColor: "#EAEAEE",
    marginRight: -1,
  },

  // Right Details
  detailsContainer: {
    flex: 1,
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  detailsContainerFree: {
    borderLeftColor: COLORS.textSecondary,
    backgroundColor: "rgba(160, 82, 45, 0.05)",
    shadowOpacity: 0,
  }, // Softer look for free periods
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectText: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  classBadge: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  classBadgeText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },

  // Meta Info inside details
  metaRowContainer: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "500" },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: { fontSize: 16, color: COLORS.textSecondary, fontWeight: "600" },
});
