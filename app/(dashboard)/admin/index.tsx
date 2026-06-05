// ======================================================
// FILE: app/admin/dashboard/index.tsx
// FULLY UPDATED DASHBOARD
// TIMETABLE REPLACED ATTENDANCE
// UPDATED COLORS
// ======================================================

import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  useWindowDimensions,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { router } from "expo-router";

import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";

import {
  Users,
  GraduationCap,
  School,
  Sparkles,
  UserCheck,
  ArrowRight,
  X,
  Bus,
  Wallet,
  LibraryBig,
  UserCog,
  CalendarDays,
  BellRing,
  Megaphone,
} from "lucide-react-native";

/* ====================================================== */
/* COLORS */
/* ====================================================== */

const COLORS = {
  background: "#FFFFFF",

  card: "#EDF4F7",

  softCard: "#E4EEF2",

  primary: "#12B5CB",

  darkPrimary: "#0E8EA0",

  sidebar: "#24343D",

  sidebarLight: "#2D3F49",

  text: "#1E293B",

  subText: "#64748B",

  white: "#FFFFFF",

  border: "#DCE7EC",

  noticeBg: "#EAF7FA",

  overviewBg: "#F4FAFC",
};

/* ====================================================== */
/* COMPONENT */
/* ====================================================== */

export default function AdminDashboard() {
  const { width } =
    useWindowDimensions();

  const isMobile = width < 768;

  const [
    activityModal,
    setActivityModal,
  ] = useState(false);

  /* ====================================================== */
  /* NOTICE DATA */
  /* ====================================================== */

  const notices = [
    {
      id: "NOT2026001",

      noticeName:
        "WELCOME SCHOOL",

      noticeDescription:
        "Hello all, the school is reopening on 12 June 2026.",

      noticeType: "GENERAL",

      noticeDate:
        "2026-06-03",
    },
  ];

  /* ====================================================== */
  /* DASHBOARD STATS */
  /* ====================================================== */

  const stats = [
    {
      title: "Students",

      value: "120",

      icon: (
        <GraduationCap
          size={28}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/students/addstudents",
    },

    {
      title: "Staff",

      value: "24",

      icon: (
        <Users
          size={28}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/staff/addstaff",
    },

    {
      title: "Classes",

      value: "18",

      icon: (
        <School
          size={28}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/classes",
    },

    {
      title: "Timetable",

      value: "12",

      icon: (
        <CalendarDays
          size={28}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/timetable",
    },
  ];

  /* ====================================================== */
  /* QUICK ACCESS */
  /* ====================================================== */

  const quickActions = [
    {
      title: "Students",

      icon: (
        <GraduationCap
          size={30}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/students/addstudents",
    },

    {
      title: "Staff",

      icon: (
        <UserCog
          size={30}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/staff/addstaff",
    },

    {
      title: "Timetable",

      icon: (
        <CalendarDays
          size={30}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/timetable",
    },

    {
      title: "Library",

      icon: (
        <LibraryBig
          size={30}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/library",
    },

    {
      title: "Fees",

      icon: (
        <Wallet
          size={30}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/fees",
    },

    {
      title: "Transport",

      icon: (
        <Bus
          size={30}
          color={COLORS.primary}
        />
      ),

      route:
        "/admin/transport",
    },
  ];

  /* ====================================================== */
  /* RECENT ACTIVITIES */
  /* ====================================================== */

  const activities = [
    {
      title:
        "New student admission completed",

      time: "2 mins ago",
    },

    {
      title:
        "Timetable updated successfully",

      time: "15 mins ago",
    },

    {
      title:
        "New teacher added",

      time: "1 hour ago",
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        <StatusBar style="dark" />

        {/* ====================================================== */}
        {/* HERO SECTION */}
        {/* ====================================================== */}

        <Animated.View
          entering={FadeInDown}
          style={[
            styles.heroCard,

            {
              flexDirection:
                isMobile
                  ? "column"
                  : "row",
            },
          ]}
        >
          {/* LEFT */}

          <View
            style={[
              styles.heroLeft,

              {
                alignItems:
                  isMobile
                    ? "center"
                    : "flex-start",
              },
            ]}
          >
            <View
              style={
                styles.sparkleBox
              }
            >
              <Sparkles
                size={30}
                color="#FFFFFF"
              />
            </View>

            <Text
              style={styles.heroTitle}
            >
              EduX Smart ERP
            </Text>

            <Text
              style={styles.heroText}
            >
              Modern school management
              dashboard with analytics,
              timetable tracking and
              administration tools.
            </Text>

            <TouchableOpacity
              style={
                styles.heroButton
              }
            >
              <Text
                style={
                  styles.heroButtonText
                }
              >
                View Reports
              </Text>

              <ArrowRight
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* RIGHT IMAGE */}

          <Animated.Image
            entering={ZoomIn}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
            }}
            style={styles.heroImage}
          />
        </Animated.View>

        {/* ====================================================== */}
        {/* OVERVIEW HEADER */}
        {/* ====================================================== */}

        <View style={styles.row}>
          <Text
            style={styles.sectionTitle}
          >
            Dashboard Overview
          </Text>

          <TouchableOpacity
  onPress={() =>
    setActivityModal(true)
  }
>      >
            <Text
              style={
                styles.activityButton
              }
            >
              Activities
            </Text>
          </TouchableOpacity>
        </View>

        {/* ====================================================== */}
        {/* STATS */}
        {/* ====================================================== */}

        <View
          style={styles.statsRow}
        >
          {stats.map(
            (item, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(
                  index * 100,
                )}
                style={{
                  width: isMobile
                    ? "48%"
                    : "23%",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={
                    styles.statsCard
                  }
                  onPress={() =>
                    router.push(
                      item.route as any,
                    )
                  }
                >
                  {item.icon}

                  <Text
                    style={
                      styles.statsValue
                    }
                  >
                    {item.value}
                  </Text>

                  <Text
                    style={
                      styles.statsTitle
                    }
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ),
          )}
        </View>

        {/* ====================================================== */}
        {/* QUICK ACCESS */}
        {/* ====================================================== */}

        <Text style={styles.sectionTitle}>
          Quick Access
        </Text>

        <View style={styles.grid}>
          {quickActions.map(
            (item, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(
                  index * 100,
                )}
                style={{
                  width: isMobile
                    ? "48%"
                    : "31%",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={
                    styles.actionCard
                  }
                  onPress={() =>
                    router.push(
                      item.route as any,
                    )
                  }
                >
                  {item.icon}

                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ),
          )}
        </View>

        {/* ====================================================== */}
        {/* NOTICE BOARD */}
        {/* ====================================================== */}

        {/* ====================================================== */}
{/* NOTICE BOARD */}
{/* ====================================================== */}

<TouchableOpacity
  style={styles.row}
  onPress={() => router.push("/admin/communication")}
>
  <Text style={styles.sectionTitle}>
    Notice Board
  </Text>

  <BellRing
    size={18}
    color={COLORS.primary}
  />
</TouchableOpacity>

{notices.map((item, index) => (
  <TouchableOpacity
    key={index}
    activeOpacity={0.9}
    onPress={() =>
      router.push("/admin/communication")
    }
  >
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      style={styles.noticeCard}
    >
      <View style={styles.noticeTop}>
        <View style={styles.noticeLeft}>
          <View style={styles.noticeIcon}>
            <Megaphone
              size={22}
              color="#FFFFFF"
            />
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: 12,
            }}
          >
            <Text style={styles.noticeTitle}>
              {item.noticeName}
            </Text>

            <Text style={styles.noticeType}>
              {item.noticeType}
            </Text>
          </View>
        </View>

        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            03 Jun
          </Text>
        </View>
      </View>

      <Text style={styles.noticeDesc}>
        {item.noticeDescription}
      </Text>
    </Animated.View>
  </TouchableOpacity>
))}

        {/* ====================================================== */}
        {/* SCHOOL OVERVIEW */}
        {/* ====================================================== */}

        <Text style={styles.sectionTitle}>
          School Overview
        </Text>

        <View
          style={styles.overviewCard}
        >
          <View
            style={
              styles.overviewRow
            }
          >
            <Text
              style={
                styles.overviewLabel
              }
            >
              Total Students
            </Text>

            <Text
              style={
                styles.overviewValue
              }
            >
              120
            </Text>
          </View>

          <View
            style={
              styles.overviewRow
            }
          >
            <Text
              style={
                styles.overviewLabel
              }
            >
              Total Staff
            </Text>

            <Text
              style={
                styles.overviewValue
              }
            >
              24
            </Text>
          </View>

          <View
            style={
              styles.overviewRow
            }
          >
            <Text
              style={
                styles.overviewLabel
              }
            >
              Active Classes
            </Text>

            <Text
              style={
                styles.overviewValue
              }
            >
              18
            </Text>
          </View>

          <View
            style={[
              styles.overviewRow,
              {
                borderBottomWidth: 0,
              },
            ]}
          >
            <Text
              style={
                styles.overviewLabel
              }
            >
              Active Timetables
            </Text>

            <Text
              style={[
                styles.overviewValue,

                {
                  color:
                    COLORS.primary,
                },
              ]}
            >
              12
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ====================================================== */}
      {/* ACTIVITIES MODAL */}
      {/* ====================================================== */}

      <Modal
        visible={activityModal}
        transparent
        animationType="slide"
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={styles.modalCard}
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <Text
                style={
                  styles.modalTitle
                }
              >
                Recent Activities
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setActivityModal(
                    false,
                  )
                }
              >
                <X
                  size={22}
                  color={
                    COLORS.text
                  }
                />
              </TouchableOpacity>
            </View>

            {activities.map(
              (item, index) => (
                <View
                  key={index}
                  style={
                    styles.activityCard
                  }
                >
                  <View
                    style={
                      styles.activityIcon
                    }
                  >
                    <UserCheck
                      size={15}
                      color="#FFFFFF"
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,

                      marginLeft: 12,
                    }}
                  >
                    <Text
                      style={
                        styles.activityTitle
                      }
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={
                        styles.activityTime
                      }
                    >
                      {item.time}
                    </Text>
                  </View>
                </View>
              ),
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

/* ====================================================== */
/* STYLES */
/* ====================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:
      COLORS.background,

    paddingHorizontal: 14,

    paddingTop: 14,
  },

  heroCard: {
    backgroundColor:
      COLORS.sidebar,

    borderRadius: 24,

    paddingHorizontal: 24,

    paddingVertical: 24,

    marginBottom: 26,

    justifyContent:
      "space-between",

    alignItems: "center",

    borderWidth: 1,

    borderColor: "#30434D",
  },

  heroLeft: {
    flex: 1,
  },

  sparkleBox: {
    width: 62,

    height: 62,

    borderRadius: 18,

    backgroundColor:
      "rgba(18,181,203,0.18)",

    justifyContent: "center",

    alignItems: "center",
  },

  heroTitle: {
    color: "#FFFFFF",

    fontSize: 30,

    fontWeight: "900",

    marginTop: 16,

    textAlign: "center",
  },

  heroText: {
    color: "#D7E6EC",

    marginTop: 10,

    fontSize: 14,

    lineHeight: 22,

    textAlign: "center",
  },

  heroButton: {
    marginTop: 22,

    backgroundColor:
      COLORS.primary,

    paddingHorizontal: 22,

    paddingVertical: 13,

    borderRadius: 16,

    flexDirection: "row",

    alignItems: "center",

    alignSelf: "center",
  },

  heroButtonText: {
    color: "#FFFFFF",

    fontWeight: "900",

    fontSize: 14,

    marginRight: 8,
  },

  heroImage: {
    width: 110,

    height: 110,

    resizeMode: "contain",

    marginTop: 18,
  },

  row: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 24,

    fontWeight: "900",

    color: COLORS.sidebar,

    marginBottom: 16,
  },

  activityButton: {
    color: COLORS.primary,

    fontWeight: "800",

    fontSize: 13,
  },

  statsRow: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent:
      "space-between",

    marginBottom: 24,
  },

  statsCard: {
    backgroundColor:
      COLORS.card,

    borderRadius: 22,

    paddingVertical: 22,

    alignItems: "center",

    borderWidth: 1,

    borderColor:
      COLORS.border,

    marginBottom: 14,

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 10,

    elevation: 3,
  },

  statsValue: {
    fontSize: 26,

    fontWeight: "900",

    color: COLORS.primary,

    marginTop: 12,
  },

  statsTitle: {
    marginTop: 8,

    color: COLORS.sidebar,

    fontWeight: "700",

    fontSize: 13,
  },

  grid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent:
      "space-between",

    marginBottom: 20,
  },

  actionCard: {
    backgroundColor:
      COLORS.softCard,

    borderRadius: 22,

    paddingVertical: 24,

    alignItems: "center",

    marginBottom: 16,

    borderWidth: 1,

    borderColor:
      COLORS.border,

    shadowColor: "#000",

    shadowOpacity: 0.04,

    shadowRadius: 8,

    elevation: 2,
  },

  actionText: {
    marginTop: 12,

    color: COLORS.sidebar,

    fontWeight: "800",

    fontSize: 14,
  },

  noticeCard: {
    backgroundColor:
      COLORS.noticeBg,

    borderRadius: 24,

    padding: 20,

    marginBottom: 20,

    borderWidth: 1,

    borderColor:
      COLORS.border,
  },

  noticeTop: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  noticeLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  noticeIcon: {
    width: 56,

    height: 56,

    borderRadius: 18,

    backgroundColor:
      COLORS.primary,

    justifyContent: "center",

    alignItems: "center",
  },

  noticeTitle: {
    fontSize: 17,

    fontWeight: "900",

    color: COLORS.sidebar,
  },

  noticeType: {
    marginTop: 4,

    color: COLORS.subText,

    fontWeight: "700",

    fontSize: 11,
  },

  noticeDesc: {
    marginTop: 16,

    color: COLORS.subText,

    fontSize: 14,

    lineHeight: 24,
  },

  dateBadge: {
    backgroundColor:
      COLORS.primary,

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderRadius: 12,
  },

  dateText: {
    color: "#FFFFFF",

    fontWeight: "800",

    fontSize: 11,
  },

  overviewCard: {
    backgroundColor:
      COLORS.overviewBg,

    borderRadius: 24,

    padding: 20,

    marginBottom: 40,

    borderWidth: 1,

    borderColor:
      COLORS.border,
  },

  overviewRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    paddingVertical: 16,

    borderBottomWidth: 1,

    borderBottomColor:
      "#D9E7ED",
  },

  overviewLabel: {
    color: COLORS.subText,

    fontWeight: "700",

    fontSize: 14,
  },

  overviewValue: {
    color: COLORS.primary,

    fontWeight: "900",

    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,

    backgroundColor:
      "rgba(0,0,0,0.45)",

    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor:
      COLORS.white,

    borderTopLeftRadius: 30,

    borderTopRightRadius: 30,

    padding: 24,
  },

  modalHeader: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 22,

    fontWeight: "900",

    color: COLORS.sidebar,
  },

  activityCard: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      COLORS.card,

    borderRadius: 18,

    padding: 16,

    marginBottom: 14,
  },

  activityIcon: {
    width: 42,

    height: 42,

    borderRadius: 14,

    backgroundColor:
      COLORS.primary,

    justifyContent: "center",

    alignItems: "center",
  },

  activityTitle: {
    fontWeight: "800",

    color: COLORS.sidebar,

    fontSize: 14,
  },

  activityTime: {
    marginTop: 4,

    color: COLORS.subText,

    fontSize: 12,
  },
});