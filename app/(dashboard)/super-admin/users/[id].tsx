import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, UserCircle, Phone, Mail, Shield, CheckCircle, Clock, Key } from "lucide-react-native";
import { useState, useEffect } from "react";
import { rootApi } from "../../../utils/axiosInstance";

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await rootApi.get(`/api/student/teacher/${id}`);
        if (response.data) {
          const t = response.data;
          setUser({
            id: t.teacherId || t.id,
            name: t.teacherName || t.name,
            email: t.email || "No email provided",
            role: t.role || "TEACHER",
            status: t.active === false ? "Inactive" : (t.status || "Active"),
            phone: t.phone || t.mobile || "N/A"
          });
        }
      } catch (error) {
        console.error("Failed to fetch teacher details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E35336" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: "#A0522D", fontSize: 16 }}>User not found.</Text>
        <TouchableOpacity style={[styles.backButton, { marginTop: 20 }]} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#A0522D" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { padding: isMobile ? 14 : 24 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#A0522D" />
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
              <UserCircle size={isMobile ? 36 : 48} color="#E35336" />
            </View>
            <View style={styles.profileTitleContainer}>
              <Text style={[styles.profileName, { fontSize: isMobile ? 15 : 20 }]} numberOfLines={1}>
                {user.name} (ID: {user.id})
              </Text>
              <Text style={styles.profileRole}>{user.role}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: user.status === "Active" ? "#dcfce7" : "#fff7ed" }]}>
              <CheckCircle size={13} color={user.status === "Active" ? "#166534" : "#c2410c"} style={{ marginRight: 4 }} />
              <Text style={[styles.statusText, { color: user.status === "Active" ? "#166534" : "#c2410c" }]}>{user.status}</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Mail size={15} color="#8A6B5D" />
              <Text style={styles.contactText}>{user.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={15} color="#8A6B5D" />
              <Text style={styles.contactText}>{user.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Shield size={15} color="#8A6B5D" />
              <Text style={styles.contactText}>{user.role} Access</Text>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { padding: isMobile ? 14 : 24, marginBottom: isMobile ? 12 : 24 }]}>
          <Text style={[styles.sectionTitle, { fontSize: isMobile ? 15 : 18 }]}>Security Settings</Text>

          <View style={styles.securityRow}>
            <View style={[styles.securityIconBox, { backgroundColor: "#F4A460" }]}>
              <Key size={18} color="#E35336" />
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
                <Clock size={16} color="#8A6B5D" />
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
    backgroundColor: "#F5F5DC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E6D8D2",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4A460",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  headerTitle: {
    fontWeight: "bold",
    color: "#A0522D",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8A6B5D",
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6D8D2",
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
    backgroundColor: "#F4A460",
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
    color: "#A0522D",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 13,
    color: "#8A6B5D",
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
    borderTopColor: "#E6D8D2",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    marginLeft: 8,
    color: "#705244",
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6D8D2",
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#A0522D",
    marginBottom: 16,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F4A460",
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
    color: "#A0522D",
    marginBottom: 2,
  },
  securityDesc: {
    fontSize: 12,
    color: "#8A6B5D",
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: "#F4A460",
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
    borderBottomColor: "#F4A460",
  },
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F5DC",
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
    color: "#B8A095",
  },
});
