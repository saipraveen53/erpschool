import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Building2, MapPin, Phone, Mail, Users, GraduationCap, DollarSign, Activity, CheckCircle, Clock } from "lucide-react-native";

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { padding: isMobile ? 14 : 24 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 18 : 24 }]}>School Details</Text>
          <Text style={styles.headerSubtitle}>Manage tenant information</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: isMobile ? 12 : 24, paddingBottom: 40 }}>
        {/* Info Card */}
        <View style={[styles.infoCard, { padding: isMobile ? 14 : 24, marginBottom: isMobile ? 12 : 24 }]}>
          <View style={[styles.schoolHeader, { marginBottom: isMobile ? 14 : 24 }]}>
            <View style={styles.avatar}>
              <Building2 size={isMobile ? 28 : 36} color="#2563eb" />
            </View>
            <View style={styles.schoolTitleContainer}>
              <Text style={[styles.schoolName, { fontSize: isMobile ? 16 : 20 }]} numberOfLines={2}>
                Greenwood High (ID: {id})
              </Text>
              <Text style={styles.schoolDomain}>greenwood.edu</Text>
            </View>
            <View style={styles.statusBadge}>
              <CheckCircle size={13} color="#166534" style={{ marginRight: 4 }} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <MapPin size={15} color="#64748b" />
              <Text style={styles.contactText}>123 Education Lane, NY</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={15} color="#64748b" />
              <Text style={styles.contactText}>+1 (555) 123-4567</Text>
            </View>
            <View style={styles.contactItem}>
              <Mail size={15} color="#64748b" />
              <Text style={styles.contactText}>admin@greenwood.edu</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={[styles.statsGrid, { marginBottom: isMobile ? 12 : 24 }]}>
          {[
            { icon: Users, color: "#2563eb", bg: "#eff6ff", value: "1,240", label: "Total Students" },
            { icon: GraduationCap, color: "#16a34a", bg: "#f0fdf4", value: "85", label: "Teachers" },
            { icon: DollarSign, color: "#d97706", bg: "#fef3c7", value: "$4,500", label: "Monthly Revenue" },
            { icon: Activity, color: "#9333ea", bg: "#f3e8ff", value: "99.9%", label: "Uptime" },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { width: isMobile ? "48%" : "23%", padding: isMobile ? 12 : 20 }]}>
              <View style={[styles.iconBox, { backgroundColor: stat.bg }]}>
                <stat.icon size={isMobile ? 20 : 24} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { fontSize: isMobile ? 18 : 24 }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { fontSize: isMobile ? 12 : 14 }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={[styles.sectionCard, { padding: isMobile ? 14 : 24 }]}>
          <Text style={[styles.sectionTitle, { fontSize: isMobile ? 16 : 18 }]}>Recent Activity</Text>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Clock size={16} color="#64748b" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Subscription Renewed</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  headerTitle: {
    fontWeight: "bold",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  schoolHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  schoolTitleContainer: {
    flex: 1,
  },
  schoolName: {
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  schoolDomain: {
    fontSize: 13,
    color: "#64748b",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
  },
  statusText: {
    color: "#166534",
    fontWeight: "600",
    fontSize: 13,
  },
  contactRow: {
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    marginLeft: 8,
    color: "#475569",
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    color: "#64748b",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 14,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
