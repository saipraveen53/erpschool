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
  ShieldCheck,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const { width } = Dimensions.get("window");

export default function StaffProfile() {
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
            PS
          </Text>
        </View>

        <Text style={styles.name}>
          Dr. Priya Sharma
        </Text>

        <Text style={styles.roleText}>
          Mathematics Department
        </Text>
      </View>

      {/* INFO CARD */}

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Mail size={18} color={PRIMARY} />

          <Text style={styles.info}>
            priya@gmail.com
          </Text>
        </View>

        <View style={styles.row}>
          <Phone size={18} color={PRIMARY} />

          <Text style={styles.info}>
            +91 9876543210
          </Text>
        </View>

        <View style={styles.row}>
          <Briefcase size={18} color={PRIMARY} />

          <Text style={styles.info}>
            Employee ID: ST1024
          </Text>
        </View>
      </View>

      {/* PERFORMANCE */}

      <Text style={styles.sectionTitle}>
        Performance Insights
      </Text>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Award size={26} color={PRIMARY} />

          <Text style={styles.number}>
            A+
          </Text>

          <Text style={styles.label}>
            Rating
          </Text>
        </View>

        <View style={styles.statCard}>
          <UserCheck size={26} color={PRIMARY} />

          <Text style={styles.number}>
            98%
          </Text>

          <Text style={styles.label}>
            Attendance
          </Text>
        </View>

        <View style={styles.statCard}>
          <Calendar size={26} color={PRIMARY} />

          <Text style={styles.number}>
            12Y
          </Text>

          <Text style={styles.label}>
            Experience
          </Text>
        </View>
      </View>

      {/* SECURITY */}

      <View style={styles.securityCard}>
        <ShieldCheck size={34} color={PRIMARY} />

        <Text style={styles.securityTitle}>
          Verified Faculty Access
        </Text>

        <Text style={styles.securityText}>
          Staff identity, payroll and access permissions are protected with
          enterprise-grade security
        </Text>
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
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 100,
  },

  header: {
    alignItems: "center",
    marginBottom: 22,
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
    fontSize: 24,
    fontWeight: "900",
    color: PRIMARY,
    textAlign: "center",
  },

  roleText: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
  },

  infoCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 24,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  info: {
    marginLeft: 12,
    fontSize: 14,
    color: "#111827",
    flexShrink: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 14,
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statCard: {
    width: width * 0.27,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    elevation: 3,
  },

  number: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },

  label: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
  },

  securityCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 3,
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
    lineHeight: 20,
    color: "#6B7280",
    fontSize: 13,
  },

  editButton: {
    marginTop: 24,
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
  },

  editText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});