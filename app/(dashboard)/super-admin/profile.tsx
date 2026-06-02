import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, useWindowDimensions } from "react-native";
import { User, Mail, Phone, Shield, Camera, Bell, Lock, LogOut, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Alert as RNAlert, Platform } from "react-native";

export default function SuperAdminProfile() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    name: "Super Admin",
    email: "superadmin@example.com",
    phone: "+1 (555) 000-0000",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      RNAlert.alert("Error", "Please fill in all password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      RNAlert.alert("Error", "New passwords do not match.");
      return;
    }

    setLoadingPassword(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8081' : 'http://192.168.88.20:8081';
      const response = await fetch(`${baseUrl}/api/superAdmin/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
          confirmNewPassword: passwordForm.confirmNewPassword
        })
      });

      if (response.ok) {
        RNAlert.alert("Success", "Your password has been changed successfully.");
        setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        const errorText = await response.text();
        RNAlert.alert("Failed", `Could not change password: ${errorText}`);
      }
    } catch (error) {
      RNAlert.alert("Error", "A network error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: isMobile ? 16 : 32 }}>
      
      {/* Header Profile Section */}
      <View style={[styles.profileHeader, { flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 24 }]}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{formData.name.charAt(0)}</Text>
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={[styles.headerInfo, { alignItems: isMobile ? "center" : "flex-start" }]}>
          <View style={styles.roleBadge}>
            <Shield size={12} color="#E35336" style={{ marginRight: 4 }} />
            <Text style={styles.roleText}>Super Administrator</Text>
          </View>
          <Text style={styles.profileName}>{formData.name}</Text>
          <Text style={styles.profileEmail}>{formData.email}</Text>
        </View>

        <View style={[styles.headerActions, { width: isMobile ? "100%" : "auto", marginTop: isMobile ? 8 : 0 }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={16} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.contentGrid, { flexDirection: isMobile ? "column" : "row", gap: 24 }]}>
        
        {/* Left Column: Personal Info */}
        <View style={[styles.card, { flex: 2 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <Text style={styles.cardSubtitle}>Update your personal details and contact info.</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <User size={18} color="#B8A095" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={formData.name}
                onChangeText={(t) => setFormData({...formData, name: t})}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Mail size={18} color="#B8A095" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={formData.email}
                onChangeText={(t) => setFormData({...formData, email: t})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Phone size={18} color="#B8A095" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={formData.phone}
                onChangeText={(t) => setFormData({...formData, phone: t})}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Right Column: Settings & Security */}
        <View style={{ flex: 1, gap: 24 }}>
          
          {/* Notifications Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Bell size={18} color="#A0522D" />
                <Text style={styles.cardTitle}>Notifications</Text>
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Email Notifications</Text>
                <Text style={styles.settingDesc}>Receive daily summary emails</Text>
              </View>
              <Switch 
                value={notifications.email} 
                onValueChange={(v) => setNotifications({...notifications, email: v})} 
                trackColor={{ false: "#D0BDB3", true: "#E35336" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDesc}>Alerts on your devices</Text>
              </View>
              <Switch 
                value={notifications.push} 
                onValueChange={(v) => setNotifications({...notifications, push: v})} 
                trackColor={{ false: "#D0BDB3", true: "#E35336" }}
                thumbColor="#fff"
              />
            </View>
          </View>

          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Lock size={18} color="#A0522D" />
                <Text style={styles.cardTitle}>Security & Password</Text>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#B8A095" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Old password"
                  value={passwordForm.oldPassword}
                  onChangeText={(t) => setPasswordForm({...passwordForm, oldPassword: t})}
                  placeholderTextColor="#B8A095"
                  secureTextEntry={!showOldPassword}
                />
                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                  {showOldPassword ? <EyeOff size={18} color="#B8A095" /> : <Eye size={18} color="#B8A095" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#B8A095" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="New password"
                  value={passwordForm.newPassword}
                  onChangeText={(t) => setPasswordForm({...passwordForm, newPassword: t})}
                  placeholderTextColor="#B8A095"
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff size={18} color="#B8A095" /> : <Eye size={18} color="#B8A095" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#B8A095" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmNewPassword}
                  onChangeText={(t) => setPasswordForm({...passwordForm, confirmNewPassword: t})}
                  placeholderTextColor="#B8A095"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} color="#B8A095" /> : <Eye size={18} color="#B8A095" />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.securityButton, loadingPassword && { backgroundColor: "#F5F5DC" }]} 
              onPress={handleChangePassword}
              disabled={loadingPassword}
            >
              {loadingPassword ? (
                <ActivityIndicator color="#A0522D" size="small" />
              ) : (
                <Text style={styles.securityButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.securityButton, { marginTop: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E6D8D2" }]}>
              <Text style={[styles.securityButtonText, { color: "#A0522D" }]}>Enable Two-Factor Auth</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  
  profileHeader: { backgroundColor: "#fff", padding: 24, borderRadius: 16, marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, alignItems: "center" },
  avatarWrapper: { position: "relative" },
  avatarContainer: { width: 88, height: 88, borderRadius: 44, backgroundColor: "#F4A460", justifyContent: "center", alignItems: "center", borderWidth: 4, borderColor: "#fff", shadowColor: "#E35336", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
  avatarText: { fontSize: 32, fontWeight: "bold", color: "#E35336" },
  cameraButton: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#E35336", width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  
  headerInfo: { flex: 1, justifyContent: "center" },
  roleBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#F4A460", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 8, alignSelf: "flex-start" },
  roleText: { fontSize: 12, fontWeight: "700", color: "#E35336" },
  profileName: { fontSize: 24, fontWeight: "bold", color: "#A0522D", marginBottom: 4 },
  profileEmail: { fontSize: 14, color: "#8A6B5D" },
  
  headerActions: { justifyContent: "center", alignItems: "flex-end" },
  logoutButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#fef2f2", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: "#fee2e2", gap: 8, justifyContent: "center" },
  logoutText: { color: "#ef4444", fontWeight: "600", fontSize: 14 },

  contentGrid: { marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader: { marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#A0522D", marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: "#8A6B5D" },
  
  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#705244", marginBottom: 8 },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E6D8D2", borderRadius: 10, backgroundColor: "#F5F5DC", paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#A0522D" },
  
  saveButton: { backgroundColor: "#E35336", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 8 },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F4A460" },
  settingLabel: { fontSize: 15, fontWeight: "600", color: "#A0522D", marginBottom: 2 },
  settingDesc: { fontSize: 12, color: "#8A6B5D" },
  
  securityButton: { backgroundColor: "#F4A460", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  securityButtonText: { color: "#705244", fontWeight: "600", fontSize: 14 },
});
