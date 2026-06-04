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
  GraduationCap,
  Award,
  Calendar,
  UserCheck,
} from "lucide-react-native";

/* ======================================= */
/* COLORS */
/* ======================================= */

const PRIMARY = "#24343D";
const ACCENT = "#00BCD4";
const BACKGROUND = "#F1F5F9";
const WHITE = "#FFFFFF";
const TEXT_MAIN = "#24343D";
const TEXT_SUB = "#64748B";

const { width } = Dimensions.get("window");

/* ======================================= */
/* STUDENTS DATA */
/* ======================================= */

const studentsData = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    className: "Grade 10",
    section: "A",
    rollNumber: "24",
    grade: "A+",
    attendance: "96%",
    activities: "12",
  },

  {
    id: 2,
    name: "Priya Verma",
    email: "priya@gmail.com",
    phone: "+91 9876501234",
    className: "Grade 9",
    section: "B",
    rollNumber: "18",
    grade: "A",
    attendance: "93%",
    activities: "9",
  },

  {
    id: 3,
    name: "Arjun Reddy",
    email: "arjun@gmail.com",
    phone: "+91 9123456780",
    className: "Grade 11",
    section: "C",
    rollNumber: "11",
    grade: "A+",
    attendance: "98%",
    activities: "15",
  },

  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@gmail.com",
    phone: "+91 9988776655",
    className: "Grade 8",
    section: "A",
    rollNumber: "30",
    grade: "B+",
    attendance: "90%",
    activities: "7",
  },

  {
    id: 5,
    name: "Karan Mehta",
    email: "karan@gmail.com",
    phone: "+91 9012345678",
    className: "Grade 12",
    section: "B",
    rollNumber: "7",
    grade: "A",
    attendance: "94%",
    activities: "10",
  },

  {
    id: 6,
    name: "Ananya Singh",
    email: "ananya@gmail.com",
    phone: "+91 9871234567",
    className: "Grade 10",
    section: "C",
    rollNumber: "15",
    grade: "A+",
    attendance: "97%",
    activities: "14",
  },

  {
    id: 7,
    name: "Rohit Kumar",
    email: "rohit@gmail.com",
    phone: "+91 9090909090",
    className: "Grade 9",
    section: "A",
    rollNumber: "21",
    grade: "B+",
    attendance: "89%",
    activities: "6",
  },

  {
    id: 8,
    name: "Meera Joshi",
    email: "meera@gmail.com",
    phone: "+91 9345678901",
    className: "Grade 11",
    section: "B",
    rollNumber: "9",
    grade: "A",
    attendance: "95%",
    activities: "11",
  },

  {
    id: 9,
    name: "Vikram Rao",
    email: "vikram@gmail.com",
    phone: "+91 9870001112",
    className: "Grade 8",
    section: "C",
    rollNumber: "28",
    grade: "B",
    attendance: "87%",
    activities: "5",
  },

  {
    id: 10,
    name: "Pooja Nair",
    email: "pooja@gmail.com",
    phone: "+91 9765432109",
    className: "Grade 12",
    section: "A",
    rollNumber: "3",
    grade: "A+",
    attendance: "99%",
    activities: "16",
  },
];

export default function StudentProfile() {
  /* SELECTED STUDENT */

  const [selectedStudent, setSelectedStudent] = useState(
    studentsData[0]
  );

  /* INITIALS */

  const initials = selectedStudent.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      {/* ======================================= */}
      {/* STUDENT BUTTONS */}
      {/* ======================================= */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.studentButtonsContainer}
      >
        {studentsData.map((student) => (
          <TouchableOpacity
            key={student.id}
            style={[
              styles.studentButton,
              selectedStudent.id === student.id &&
                styles.activeStudentButton,
            ]}
            onPress={() => setSelectedStudent(student)}
          >
            <Text
              style={[
                styles.studentButtonText,
                selectedStudent.id === student.id &&
                  styles.activeStudentButtonText,
              ]}
            >
              {student.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ======================================= */}
      {/* PROFILE HEADER */}
      {/* ======================================= */}

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.name}>
          {selectedStudent.name}
        </Text>

        <Text style={styles.classText}>
          {selectedStudent.className} • Section{" "}
          {selectedStudent.section}
        </Text>
      </View>

      {/* ======================================= */}
      {/* INFO CARD */}
      {/* ======================================= */}

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Mail size={20} color={ACCENT} />
          <Text style={styles.info}>
            {selectedStudent.email}
          </Text>
        </View>

        <View style={styles.row}>
          <Phone size={20} color={ACCENT} />
          <Text style={styles.info}>
            {selectedStudent.phone}
          </Text>
        </View>

        <View style={styles.row}>
          <GraduationCap size={20} color={ACCENT} />
          <Text style={styles.info}>
            Roll No: {selectedStudent.rollNumber}
          </Text>
        </View>
      </View>

      {/* ======================================= */}
      {/* PERFORMANCE */}
      {/* ======================================= */}

      <Text style={styles.sectionTitle}>Performance</Text>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Award size={28} color={ACCENT} />

          <Text style={styles.number}>
            {selectedStudent.grade}
          </Text>

          <Text style={styles.label}>Grade</Text>
        </View>

        <View style={styles.statCard}>
          <UserCheck size={28} color={ACCENT} />

          <Text style={styles.number}>
            {selectedStudent.attendance}
          </Text>

          <Text style={styles.label}>Attendance</Text>
        </View>

        <View style={styles.statCard}>
          <Calendar size={28} color={ACCENT} />

          <Text style={styles.number}>
            {selectedStudent.activities}
          </Text>

          <Text style={styles.label}>Activities</Text>
        </View>
      </View>

      {/* ======================================= */}
      {/* BUTTON */}
      {/* ======================================= */}

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  studentButtonsContainer: {
    paddingBottom: 20,
    gap: 12,
  },

  studentButton: {
    backgroundColor: WHITE,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  activeStudentButton: {
    backgroundColor: PRIMARY,
  },

  studentButtonText: {
    color: PRIMARY,
    fontWeight: "700",
    fontSize: 14,
  },

  activeStudentButtonText: {
    color: WHITE,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  avatarText: {
    color: WHITE,
    fontSize: 36,
    fontWeight: "900",
  },

  name: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "900",
    color: PRIMARY,
    textAlign: "center",
  },

  classText: {
    marginTop: 8,
    color: TEXT_SUB,
    fontSize: 15,
    textAlign: "center",
  },

  infoCard: {
  backgroundColor: WHITE,
  padding: 20,
  borderRadius: 24,
  marginBottom: 24,
  borderWidth: 1,
  borderColor: "#E2E8F0",
},

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  info: {
    marginLeft: 16,
    fontSize: 15,
    color: TEXT_MAIN,
    flexShrink: 1,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: PRIMARY,
    marginBottom: 16,
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  statCard: {
    width: width * 0.28,
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  number: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
  },

  label: {
    marginTop: 4,
    color: TEXT_SUB,
    fontSize: 12,
    textAlign: "center",
  },

  editButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  editText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 16,
  },
});