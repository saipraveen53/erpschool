import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, UserCircle, Phone, Mail, Shield, CheckCircle, Clock, Key } from "lucide-react-native";

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { padding: isMobile ? 14 : 24 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 18 : 24 }]}>User Profile</Text>
          <Text style={styles.headerSubtitle}>View and manage user details</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: isMobile ? 12 : 24, paddingBottom: 40 }}>
        <View style={[styles.profileCard, { padding: isMobile ? 14 : 24, marginBottom: isMobile ? 12 : 24 }]}>
          <View style={[styles.profileHeader, { marginBottom: isMobile ? 14 : 24 }]}>
            <View style={styles.avatar}>
              <UserCircle size={isMobile ? 36 : 48} color="#2563eb" />
            </View>
            <View style={styles.profileTitleContainer}>
              <Text style={[styles.profileName, { fontSize: isMobile ? 15 : 20 }]} numberOfLines={1}>
                Admin User (ID: {id})
              </Text>
              <Text style={styles.profileRole}>System Administrator</Text>
            </View>
            <View style={styles.statusBadge}>
              <CheckCircle size={13} color="#166534" style={{ marginRight: 4 }} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Mail size={15} color="#64748b" />
              <Text style={styles.contactText}>admin@erpschool.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={15} color="#64748b" />
              <Text style={styles.contactText}>+1 (555) 987-6543</Text>
            </View>
            <View style={styles.contactItem}>
              <Shield size={15} color="#64748b" />
              <Text style={styles.contactText}>Full Access</Text>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { padding: isMobile ? 14 : 24, marginBottom: isMobile ? 12 : 24 }]}>
          <Text style={[styles.sectionTitle, { fontSize: isMobile ? 15 : 18 }]}>Security Settings</Text>

          <View style={styles.securityRow}>
            <View style={[styles.securityIconBox, { backgroundColor: "#eff6ff" }]}>
              <Key size={18} color="#2563eb" />
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Password</Text>
              <Text style={styles.securityDesc}>Last changed 30 days ago</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.securityRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={[styles.securityIconBox, { backgroundColor: "#f0fdf4" }]}>
              <CheckCircle size={18} color="#16a34a" />
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Two-Factor Auth</Text>
              <Text style={styles.securityDesc}>Enabled via Authenticator App</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.sectionCard, { padding: isMobile ? 14 : 24 }]}>
          <Text style={[styles.sectionTitle, { fontSize: isMobile ? 15 : 18 }]}>Recent Logins</Text>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Clock size={16} color="#64748b" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>MacBook Pro • Chrome</Text>
                <Text style={styles.activityTime}>New York, USA • {i + 1} hours ago</Text>
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
  profileCard: {
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
  profileHeader: {
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
  profileTitleContainer: {
    flex: 1,
  },
  profileName: {
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  profileRole: {
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
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  securityIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  securityDesc: {
    fontSize: 12,
    color: "#64748b",
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
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
