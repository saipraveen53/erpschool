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

const PRIMARY = "#A0522D";
const { width } = Dimensions.get("window");

export default function StudentProfile() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            RS
          </Text>
        </View>

        <Text style={styles.name}>
          Rahul Sharma
        </Text>

        <Text style={styles.classText}>
          Grade 10 • Section A
        </Text>
      </View>

      {/* INFO CARD */}

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Mail size={20} color={PRIMARY} />

          <Text style={styles.info}>
            rahul@gmail.com
          </Text>
        </View>

        <View style={styles.row}>
          <Phone size={20} color={PRIMARY} />

          <Text style={styles.info}>
            +91 9876543210
          </Text>
        </View>

        <View style={styles.row}>
          <GraduationCap size={20} color={PRIMARY} />

          <Text style={styles.info}>
            Roll No: 24
          </Text>
        </View>
      </View>

      {/* PERFORMANCE */}

      <Text style={styles.sectionTitle}>
        Performance
      </Text>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Award size={28} color={PRIMARY} />

          <Text style={styles.number}>
            A+
          </Text>

          <Text style={styles.label}>
            Grade
          </Text>
        </View>

        <View style={styles.statCard}>
          <UserCheck size={28} color={PRIMARY} />

          <Text style={styles.number}>
            96%
          </Text>

          <Text style={styles.label}>
            Attendance
          </Text>
        </View>

        <View style={styles.statCard}>
          <Calendar size={28} color={PRIMARY} />

          <Text style={styles.number}>
            12
          </Text>

          <Text style={styles.label}>
            Activities
          </Text>
        </View>
      </View>

      {/* BUTTON */}

      <TouchableOpacity style={styles.editButton}>
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
    backgroundColor: "#F5F5DC",
  },

  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 100,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
  },

  name: {
    marginTop: 16,
    fontSize: 26,
    fontWeight: "900",
    color: PRIMARY,
    textAlign: "center",
  },

  classText: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
  },

  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 22,
    marginBottom: 28,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  info: {
    marginLeft: 14,
    fontSize: 15,
    color: "#111827",
    flexShrink: 1,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 16,
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  statCard: {
    width: width * 0.27,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
    elevation: 3,
  },

  number: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },

  label: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 12,
    textAlign: "center",
  },

  editButton: {
    marginTop: 10,
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    elevation: 3,
  },

  editText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});