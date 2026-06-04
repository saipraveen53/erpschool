import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import {
  Search,
  Filter,
  Sparkles,
  UserPlus,
  IdCard,
  ArrowRight,
  User,
  Briefcase,
} from "lucide-react-native";

/* ======================================= */
/* UPDATED STAFF THEME COLORS */
/* ======================================= */

const COLORS = {
  background: "#F4F8FB",
  card: "#FFFFFF",

  /* MAIN COLORS */
  primary: "#1E293B",
  accent: "#22C7E5",

  white: "#FFFFFF",

  /* TEXT */
  textMain: "#1E293B",
  textSub: "#64748B",

  /* BORDERS */
  border: "#DCE7EF",

  /* LIGHT CYAN */
  lightAccent: "#DDF8FD",
};

export default function StaffOverview() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  /* ======================================= */
  /* RECENT STAFF */
  /* ======================================= */

  const recentStaff = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      department: "Mathematics Department",
    },

    {
      id: 2,
      name: "Mr. Arjun Mehta",
      department: "Physics Department",
    },

    {
      id: 3,
      name: "Mrs. Kavya Reddy",
      department: "English Department",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      {/* ======================================= */}
      {/* HEADER */}
      {/* ======================================= */}

      <View style={styles.header}>
        <Text style={styles.heading}>
          Staff Hub
        </Text>

        <Text style={styles.subheading}>
          Manage faculty operations and staff performance
        </Text>
      </View>

      {/* ======================================= */}
      {/* HERO CARD */}
      {/* ======================================= */}

      <View style={styles.heroCard}>
        <View style={styles.sparkleBox}>
          <Sparkles size={28} color={COLORS.accent} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>
            AI Faculty Insights
          </Text>

          <Text style={styles.heroText}>
            Monitor attendance, department productivity,
            teaching quality and staff activities seamlessly.
          </Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              View Analytics
            </Text>

            <ArrowRight
              size={16}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ======================================= */}
      {/* SEARCH */}
      {/* ======================================= */}

      <View style={styles.searchContainer}>
        <Search
          size={20}
          color={COLORS.textSub}
        />

        <TextInput
          placeholder="Search staff..."
          placeholderTextColor={COLORS.textSub}
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.filterButton}>
          <Filter
            size={18}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* ======================================= */}
      {/* QUICK ACCESS */}
      {/* ======================================= */}

      <Text style={styles.sectionTitle}>
        Quick Access
      </Text>

      <View
        style={[
          styles.overviewContainer,
          {
            flexDirection: isMobile
              ? "column"
              : "row",
          },
        ]}
      >
        {[
          {
            label: "Add Staff",
            icon: UserPlus,
            route: "/admin/staff/addstaff",
          },

          {
            label: "Staff Profile",
            icon: IdCard,
            route: "/admin/staff/staffprofile",
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.overviewButton,
              {
                width: isMobile
                  ? "100%"
                  : "48%",
              },
            ]}
            onPress={() =>
              router.push(item.route)
            }
          >
            <View style={styles.overviewIcon}>
              <item.icon
                size={24}
                color={COLORS.accent}
              />
            </View>

            <Text style={styles.overviewText}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ======================================= */}
      {/* RECENT STAFF */}
      {/* ======================================= */}

      <Text style={styles.sectionTitle}>
        Faculty Members
      </Text>

      <View style={styles.listContainer}>
        {recentStaff.map((staff) => (
          <TouchableOpacity
            key={staff.id}
            style={styles.listItem}
            onPress={() =>
              router.push(
                "/admin/staff/staffprofile"
              )
            }
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={styles.avatar}>
                <User
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View>
                <Text style={styles.listTitle}>
                  {staff.name}
                </Text>

                <Text style={styles.listSub}>
                  {staff.department}
                </Text>
              </View>
            </View>

            <ArrowRight
              size={18}
              color={COLORS.textSub}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* ======================================= */}
      {/* STAFF PERFORMANCE */}
      {/* ======================================= */}

      <Text style={styles.sectionTitle}>
        Staff Performance
      </Text>

      <View style={styles.performanceCard}>
        <Briefcase
          size={40}
          color={COLORS.accent}
        />

        <Text style={styles.performanceTitle}>
          Faculty Productivity
        </Text>

        <Text style={styles.performanceText}>
          Track department achievements, attendance,
          lectures handled, and teaching performance
          using AI-driven monitoring tools.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /* ======================================= */
  /* MAIN */
  /* ======================================= */

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 100,
  },

  /* ======================================= */
  /* HEADER */
  /* ======================================= */

  header: {
    marginBottom: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.primary,
  },

  subheading: {
    color: COLORS.textSub,
    marginTop: 4,
    fontSize: 14,
  },

  /* ======================================= */
  /* HERO */
  /* ======================================= */

  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  sparkleBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.lightAccent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "800",
  },

  heroText: {
    color: "#DDEAF4",
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
  },

  heroButton: {
    marginTop: 14,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
  },

  heroButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    marginRight: 8,
    fontSize: 13,
  },

  /* ======================================= */
  /* SEARCH */
  /* ======================================= */

  searchContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textMain,
  },

  filterButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: COLORS.lightAccent,
  },

  /* ======================================= */
  /* SECTION */
  /* ======================================= */

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 14,
    marginTop: 8,
  },

  /* ======================================= */
  /* QUICK ACCESS */
  /* ======================================= */

  overviewContainer: {
    justifyContent: "space-between",
    marginBottom: 10,
  },

  overviewButton: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },

  overviewIcon: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.lightAccent,
  },

  overviewText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },

  /* ======================================= */
  /* STAFF LIST */
  /* ======================================= */

  listContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.lightAccent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  listTitle: {
    fontWeight: "700",
    color: COLORS.primary,
    fontSize: 14,
  },

  listSub: {
    color: COLORS.textSub,
    fontSize: 12,
    marginTop: 2,
  },

  /* ======================================= */
  /* PERFORMANCE CARD */
  /* ======================================= */

  performanceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 6,
  },

  performanceTitle: {
    marginTop: 14,
    fontSize: 19,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
  },

  performanceText: {
    marginTop: 10,
    textAlign: "center",
    color: COLORS.textSub,
    lineHeight: 20,
    fontSize: 13,
  },
});