import { CircleCheck, CircleX, Search, Shield, ShieldAlert, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { rootApi } from "../../../utils/axiosInstance";

const SECURITY_BASE_URL = "https://school-management-crba.onrender.com";

export default function SecurityManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [toggling, setToggling] = useState<string | null>(null);

  const roles = ["ALL", "SUPER_ADMIN", "ADMIN", "PRINCIPAL", "VICE_PRINCIPAL", "TEACHER", "STUDENT", "DRIVER"];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await rootApi.get(`${SECURITY_BASE_URL}/api/superAdmin/users`);
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      Alert.alert("Error", "Could not fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (username: string, currentStatus: boolean, role: string) => {
    if (role === "SUPER_ADMIN") {
      Alert.alert("Action Denied", "Cannot deactivate super admin accounts.");
      return;
    }

    const newStatus = !currentStatus;
    
    setToggling(username);
    try {
      await rootApi.put(`${SECURITY_BASE_URL}/api/superAdmin/users/${username}/status?active=${newStatus}`);
      setUsers(prev => prev.map(u => u.username === username ? { ...u, isAvailable: newStatus } : u));
    } catch (error: any) {
      console.error("Failed to toggle user status:", error);
      const errorMsg = error?.response?.data ? JSON.stringify(error.response.data) : error.message;
      Alert.alert(
        "Debugging Error", 
        `Failed to update user status.\n\nEndpoint: /api/superAdmin/users/${username}/status?active=${newStatus}\n\nDetails: ${errorMsg}`
      );
    } finally {
      setToggling(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = (u.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
                          (u.fullName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                          (u.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { padding: isMobile ? 14 : 24, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center' }]}>
        <View style={{ flex: isMobile ? undefined : 1, marginBottom: isMobile ? 16 : 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={24} color="#A0522D" />
            <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 26 }]}>Security & Access</Text>
          </View>
          <Text style={styles.headerSubtitle}>Manage users, their roles, and what they can access in the system.</Text>
        </View>

        <View style={[styles.searchContainer, { width: isMobile ? "100%" : 300 }]}>
          <Search size={18} color="#8A6B5D" style={{ marginLeft: 12 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#B8A095"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: isMobile ? 12 : 24, paddingTop: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
          {roles.map(role => (
            <TouchableOpacity 
              key={role} 
              style={[styles.roleChip, selectedRole === role && styles.roleChipActive]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={[styles.roleChipText, selectedRole === role && styles.roleChipTextActive]}>
                {role.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
        ) : filteredUsers.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Shield size={48} color="#E6D8D2" />
            <Text style={styles.emptyText}>No users found.</Text>
          </View>
        ) : (
          <View style={styles.tableContainer}>
            {!isMobile && (
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2.5 }]}>User Info</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>Username</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>Role</Text>
                <Text style={[styles.th, { flex: 1, textAlign: "center" }]}>Status</Text>
                <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Access</Text>
              </View>
            )}
            
            {filteredUsers.map((user, idx) => {
              const isActive = user.isAvailable !== false; // null or true means active in the payload
              
              return (
                <View key={user.id} style={[styles.tableRow, idx === filteredUsers.length - 1 && { borderBottomWidth: 0 }, isMobile && { flexDirection: 'column', alignItems: 'flex-start' }]}>
                  
                  <View style={[styles.td, { flex: 2.5, flexDirection: "row", alignItems: "center", width: isMobile ? '100%' : undefined, marginBottom: isMobile ? 12 : 0 }]}>
                    <View style={styles.avatarContainer}>
                      <User size={18} color="#E35336" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName} numberOfLines={1}>{user.fullName || "N/A"}</Text>
                      <Text style={styles.emailText} numberOfLines={1}>{user.email}</Text>
                    </View>
                  </View>

                  <View style={[styles.td, { flex: 1.5, width: isMobile ? '100%' : undefined, marginBottom: isMobile ? 8 : 0 }]}>
                    {isMobile && <Text style={styles.mobileLabel}>Username:</Text>}
                    <Text style={styles.rollNoText}>{user.username}</Text>
                  </View>

                  <View style={[styles.td, { flex: 1.5, width: isMobile ? '100%' : undefined, marginBottom: isMobile ? 12 : 0 }]}>
                    {isMobile && <Text style={styles.mobileLabel}>Role:</Text>}
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText}>{user.role.replace('_', ' ')}</Text>
                    </View>
                  </View>

                  <View style={[styles.td, { flex: 1, alignItems: isMobile ? "flex-start" : "center", width: isMobile ? '100%' : undefined, marginBottom: isMobile ? 16 : 0 }]}>
                    {isMobile && <Text style={styles.mobileLabel}>Status:</Text>}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {isActive ? <CircleCheck size={14} color="#16a34a" /> : <CircleX size={14} color="#dc2626" />}
                      <Text style={[styles.statusText, { color: isActive ? "#166534" : "#991b1b" }]}>
                        {isActive ? "Active" : "Disabled"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.td, { flex: 1, alignItems: isMobile ? "flex-start" : "flex-end", width: isMobile ? '100%' : undefined }]}>
                    {isMobile && <Text style={styles.mobileLabel}>Access Toggle:</Text>}
                    {user.role === "SUPER_ADMIN" ? (
                      <Text style={{ fontSize: 11, color: '#8A6B5D', fontStyle: 'italic' }}>Protected</Text>
                    ) : toggling === user.username ? (
                      <ActivityIndicator size="small" color="#E35336" />
                    ) : (
                      <Switch 
                        value={isActive} 
                        onValueChange={() => toggleUserStatus(user.username, isActive, user.role)} 
                        trackColor={{ false: "#fca5a5", true: "#86efac" }}
                        thumbColor={isActive ? "#16a34a" : "#dc2626"}
                      />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#E6D8D2", justifyContent: "space-between" },
  headerTitle: { fontWeight: "bold", color: "#A0522D" },
  headerSubtitle: { fontSize: 13, color: "#8A6B5D", marginTop: 4 },
  
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FDFBF7", borderRadius: 12, borderWidth: 1, borderColor: "#E6D8D2" },
  searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, fontSize: 14, color: "#5C2E14" },
  
  roleChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E6D8D2" },
  roleChipActive: { backgroundColor: "#E35336", borderColor: "#E35336" },
  roleChipText: { fontSize: 12, fontWeight: "600", color: "#8A6B5D" },
  roleChipTextActive: { color: "#fff" },

  emptyStateContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { textAlign: "center", marginTop: 16, color: "#B8A095", fontSize: 15 },

  tableContainer: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: "#E6D8D2" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F4A460", paddingVertical: 14, paddingHorizontal: 8, alignItems: "center" },
  th: { fontSize: 12, fontWeight: "600", color: "#8A6B5D" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F5F5DC", paddingVertical: 16, paddingHorizontal: 8, alignItems: "center" },
  td: { paddingHorizontal: 4, justifyContent: 'center' },
  
  avatarContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5E6DF", justifyContent: "center", alignItems: "center", marginRight: 12, flexShrink: 0 },
  studentName: { fontSize: 15, fontWeight: "700", color: "#334155" },
  emailText: { fontSize: 12, color: "#8A6B5D", marginTop: 2 },
  rollNoText: { fontSize: 13, color: "#705244", fontWeight: '500' },
  
  roleBadge: { backgroundColor: "#f3f4f6", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  roleBadgeText: { fontSize: 11, fontWeight: "700", color: "#4b5563" },
  
  statusText: { fontSize: 12, fontWeight: "600" },
  mobileLabel: { fontSize: 11, color: '#A0522D', fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' }
});
