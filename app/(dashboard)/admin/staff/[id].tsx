import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  Mail,
  Phone,
  Briefcase,
  Award,
  Calendar,
  UserCheck,
  GraduationCap,
  BookOpen,
} from "lucide-react-native";

/* ======================================= */
/* UPDATED COLOR THEME */
/* ======================================= */

const COLORS = {
  background: "#F4F8FB",
  card: "#FFFFFF",

  primary: "#1E293B",
  accent: "#22C7E5",

  white: "#FFFFFF",

  textMain: "#1E293B",
  textSub: "#64748B",

  border: "#DCE7EF",

  lightAccent: "#DDF8FD",
};

const { width } = Dimensions.get("window");

/* ======================================= */
/* STAFF DATA */
/* ======================================= */

const staffMembers = [
  {
    id: 1,
    initials: "PS",
    name: "Dr. Priya Sharma",
    department: "Mathematics Department",
    email: "priya@gmail.com",
    phone: "+91 9876543210",
    employeeId: "ST1024",
    qualification: "Ph.D Mathematics",
    subjects: "Algebra, Calculus",
    rating: "A+",
    attendance: "98%",
    experience: "12Y",
  },

  {
    id: 2,
    initials: "AM",
    name: "Arjun Mehta",
    department: "Physics Department",
    email: "arjun@gmail.com",
    phone: "+91 9876543222",
    employeeId: "ST1025",
    qualification: "M.Sc Physics",
    subjects: "Quantum Physics, Mechanics",
    rating: "A",
    attendance: "96%",
    experience: "9Y",
  },

  {
    id: 3,
    initials: "KR",
    name: "Kavya Reddy",
    department: "English Department",
    email: "kavya@gmail.com",
    phone: "+91 9876543333",
    employeeId: "ST1026",
    qualification: "M.A English",
    subjects: "Grammar, Literature",
    rating: "A+",
    attendance: "97%",
    experience: "8Y",
  },

  {
    id: 4,
    initials: "SN",
    name: "Sneha Nair",
    department: "Chemistry Department",
    email: "sneha@gmail.com",
    phone: "+91 9876543444",
    employeeId: "ST1027",
    qualification: "M.Sc Chemistry",
    subjects: "Organic Chemistry",
    rating: "A",
    attendance: "95%",
    experience: "10Y",
  },

  {
    id: 5,
    initials: "RV",
    name: "Rahul Verma",
    department: "Computer Science",
    email: "rahul@gmail.com",
    phone: "+91 9876543555",
    employeeId: "ST1028",
    qualification: "M.Tech CSE",
    subjects: "Programming, AI",
    rating: "A+",
    attendance: "99%",
    experience: "7Y",
  },
];

export default function StaffProfile() {
  const [selectedStaff, setSelectedStaff] =
    useState(staffMembers[0]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <StatusBar style="dark" />

      {/* ======================================= */}
      {/* STAFF BUTTONS */}
      {/* ======================================= */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        style={styles.staffTabs}
      >
        {staffMembers.map((staff) => (
          <TouchableOpacity
            key={staff.id}
            style={[
              styles.staffButton,

              selectedStaff.id ===
                staff.id &&
                styles.activeStaffButton,
            ]}
            onPress={() =>
              setSelectedStaff(staff)
            }
          >
            <Text
              style={[
                styles.staffButtonText,

                selectedStaff.id ===
                  staff.id &&
                  styles.activeStaffButtonText,
              ]}
            >
              {staff.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ======================================= */}
      {/* HEADER */}
      {/* ======================================= */}

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {
              selectedStaff.initials
            }
          </Text>
        </View>

        <Text style={styles.name}>
          {selectedStaff.name}
        </Text>

        <Text style={styles.roleText}>
          {
            selectedStaff.department
          }
        </Text>
      </View>

      {/* ======================================= */}
      {/* INFO CARD */}
      {/* ======================================= */}

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Mail
            size={20}
            color={COLORS.accent}
          />

          <Text style={styles.info}>
            {selectedStaff.email}
          </Text>
        </View>

        <View style={styles.row}>
          <Phone
            size={20}
            color={COLORS.accent}
          />

          <Text style={styles.info}>
            {selectedStaff.phone}
          </Text>
        </View>

        <View style={styles.row}>
          <Briefcase
            size={20}
            color={COLORS.accent}
          />

          <Text style={styles.info}>
            Employee ID:{" "}
            {
              selectedStaff.employeeId
            }
          </Text>
        </View>

        <View style={styles.row}>
          <GraduationCap
            size={20}
            color={COLORS.accent}
          />

          <Text style={styles.info}>
            Qualification:{" "}
            {
              selectedStaff.qualification
            }
          </Text>
        </View>

        <View style={styles.row}>
          <BookOpen
            size={20}
            color={COLORS.accent}
          />

          <Text style={styles.info}>
            Subjects:{" "}
            {
              selectedStaff.subjects
            }
          </Text>
        </View>
      </View>

      {/* ======================================= */}
      {/* PERFORMANCE */}
      {/* ======================================= */}

      <Text style={styles.sectionTitle}>
        Performance Insights
      </Text>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Award
            size={28}
            color={COLORS.accent}
          />

          <Text style={styles.number}>
            {
              selectedStaff.rating
            }
          </Text>

          <Text style={styles.label}>
            Rating
          </Text>
        </View>

        <View style={styles.statCard}>
          <UserCheck
            size={28}
            color={COLORS.accent}
          />

          <Text style={styles.number}>
            {
              selectedStaff.attendance
            }
          </Text>

          <Text style={styles.label}>
            Attendance
          </Text>
        </View>

        <View style={styles.statCard}>
          <Calendar
            size={28}
            color={COLORS.accent}
          />

          <Text style={styles.number}>
            {
              selectedStaff.experience
            }
          </Text>

          <Text style={styles.label}>
            Experience
          </Text>
        </View>
      </View>

      {/* ======================================= */}
      {/* BUTTON */}
      {/* ======================================= */}

      <TouchableOpacity
        style={styles.editButton}
      >
        <Text style={styles.editText}>
          Edit Profile
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 100,
  },

  /* STAFF TABS */

  staffTabs: {
    marginBottom: 26,
  },

  staffButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  activeStaffButton: {
    backgroundColor:
      COLORS.primary,
  },

  staffButtonText: {
    color: COLORS.textMain,
    fontWeight: "700",
    fontSize: 14,
  },

  activeStaffButtonText: {
    color: COLORS.white,
  },

  /* HEADER */

  header: {
    alignItems: "center",
    marginBottom: 26,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor:
      COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: "900",
  },

  name: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
  },

  roleText: {
    marginTop: 6,
    color: COLORS.textSub,
    fontSize: 15,
    textAlign: "center",
  },

  /* INFO CARD */

  infoCard: {
    backgroundColor: COLORS.card,
    padding: 22,
    borderRadius: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  info: {
    marginLeft: 14,
    fontSize: 15,
    color: COLORS.textMain,
    flexShrink: 1,
  },

  /* SECTION */

  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 18,
  },

  /* STATS */

  stats: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 28,
  },

  statCard: {
    width: width * 0.27,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  number: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
  },

  label: {
    marginTop: 6,
    color: COLORS.textSub,
    fontSize: 12,
    textAlign: "center",
  },

  /* BUTTON */

  editButton: {
    marginTop: 10,
    backgroundColor:
      COLORS.accent,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  editText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },
});