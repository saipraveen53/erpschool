// app/admin/dashboard/index.tsx

import React, { useEffect } from "react";

import { StatusBar } from "expo-status-bar";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import {
  Users,
  GraduationCap,
  School,
  IndianRupee,
  Bus,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  UserCheck,
} from "lucide-react-native";

/* ========================================= */
/* COLORS */
/* ========================================= */

const PRIMARY = "#A0522D";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";

/* ========================================= */
/* COMPONENT */
/* ========================================= */

export default function AdminDashboard() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const fade = useSharedValue(0);
  const slide = useSharedValue(20);

  useEffect(() => {
    fade.value = withSpring(1);
    slide.value = withSpring(0);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: slide.value }],
  }));

  /* ========================================= */
  /* DATA */
  /* ========================================= */

  const stats = [
    {
      title: "Students",
      value: "2,450",
      icon: (
        <GraduationCap
          size={24}
          color={PRIMARY}
        />
      ),
      color: "#DBEAFE",
    },

    {
      title: "Staff",
      value: "285",
      icon: (
        <Users size={24} color={PRIMARY} />
      ),
      color: "#DCFCE7",
    },

    {
      title: "Classes",
      value: "42",
      icon: (
        <School size={24} color={PRIMARY} />
      ),
      color: "#FDE68A",
    },

    {
      title: "Attendance",
      value: "96%",
      icon: (
        <ClipboardCheck
          size={24}
          color={PRIMARY}
        />
      ),
      color: "#EDE9FE",
    },
  ];

  const quickActions = [
    {
      title: "Students",
      icon: (
        <GraduationCap
          size={24}
          color={PRIMARY}
        />
      ),
    },

    {
      title: "Fees",
      icon: (
        <IndianRupee
          size={24}
          color={PRIMARY}
        />
      ),
    },

    {
      title: "Library",
      icon: (
        <BookOpen
          size={24}
          color={PRIMARY}
        />
      ),
    },

    {
      title: "Transport",
      icon: (
        <Bus size={24} color={PRIMARY} />
      ),
    },
  ];

  const activities = [
    {
      title: "New Student Admission",
      time: "2 min ago",
    },

    {
      title: "Fee Payment Received",
      time: "15 min ago",
    },

    {
      title: "Bus Route Updated",
      time: "1 hour ago",
    },

    {
      title: "Exam Schedule Published",
      time: "2 hours ago",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 60,
      }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      {/* HERO */}

      <Animated.View
        style={[
          styles.heroCard,
          animatedStyle,
        ]}
      >
        <View style={styles.heroLeft}>
          <Sparkles
            size={32}
            color="#FFFFFF"
          />

          <Text style={styles.heroTitle}>
            Smart ERP
          </Text>

          <Text style={styles.heroText}>
            Manage admissions, fees, and
            attendance.
          </Text>

          <TouchableOpacity
            style={styles.heroButton}
          >
            <Text
              style={styles.heroButtonText}
            >
              Analytics
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{
            uri:
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.heroImage}
        />
      </Animated.View>

      {/* STATS */}

      <View style={styles.statsGrid}>
        {stats.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.statCard,
              {
                backgroundColor: item.color,
              },
            ]}
          >
            {item.icon}

            <Text style={styles.statNumber}>
              {item.value}
            </Text>

            <Text style={styles.statLabel}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickGrid}>
        {quickActions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickCard}
          >
            {item.icon}

            <Text style={styles.quickText}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ANALYTICS */}

      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsLabel}>
          Monthly Revenue
        </Text>

        <Text style={styles.analyticsValue}>
          ₹12.4L
        </Text>
      </View>

      {/* RECENT ACTIVITIES */}

      <Text style={styles.sectionTitle}>
        Recent Activities
      </Text>

      {activities.map((item, index) => (
        <View
          key={index}
          style={styles.activityCard}
        >
          <UserCheck
            size={20}
            color={PRIMARY}
          />

          <View
            style={{ marginLeft: 15 }}
          >
            <Text
              style={styles.activityTitle}
            >
              {item.title}
            </Text>

            <Text
              style={styles.activityTime}
            >
              {item.time}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

/* ========================================= */
/* STYLES */
/* ========================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    padding: 16,
  },

  /* HERO */

  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    marginBottom: 20,
  },

  heroLeft: {
    flex: 1,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
  },

  heroText: {
    color: "#F5F5DC",
    fontSize: 12,
    marginTop: 4,
  },

  heroButton: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
  },

  heroButtonText: {
    color: PRIMARY,
    fontWeight: "800",
  },

  heroImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  /* STATS */

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  statCard: {
    width: "23%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  /* QUICK ACTIONS */

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
    marginVertical: 12,
  },

  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  quickCard: {
    width: "23%",
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  quickText: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "700",
  },

  /* ANALYTICS */

  analyticsCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
  },

  analyticsLabel: {
    color: "#6B7280",
    fontSize: 12,
  },

  analyticsValue: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 5,
  },

  /* ACTIVITIES */

  activityCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  activityTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  activityTime: {
    fontSize: 11,
    color: "#6B7280",
  },
});