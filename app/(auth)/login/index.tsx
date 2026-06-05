import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Demo OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [demoUserData, setDemoUserData] = useState<{
    role: string;
    username: string;
    fullName: string;
  } | null>(null);

  // Demo credentials (same as before)
  const demoCredentials = [
    { role: "Super Admin", username: "superadmin@school.com", password: "super123" },
    { role: "Admin", username: "admin@school.com", password: "admin123" },
    { role: "Principal", username: "principal@school.com", password: "principal123" },
    { role: "Vice Principal", username: "vice@school.com", password: "vice123" },
    { role: "Teacher", username: "teacher@school.com", password: "teacher123" },
    { role: "Student", username: "student@school.com", password: "student123" },
    { role: "Parent", username: "parent@school.com", password: "parent123" },
    { role: "Driver", username: "driver@school.com", password: "driver123" },
    { role: "Housekeeping", username: "housekeeping@school.com", password: "house123" },
    { role: "Receptionist", username: "receptionist@school.com", password: "reception123" },
    { role: "Librarian", username: "librarian@school.com", password: "librarian123" },
  ];

  const fillDemoCredentials = (demoUsername: string, demoPassword: string, role: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setError("");
    setShowDemoModal(false);
    // Store the selected role for later use during demo OTP flow
    setDemoUserData({
      role: role.toUpperCase().replace(" ", "_"),
      username: demoUsername,
      fullName: role,
    });
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");

    // Check if this is a demo login (credentials match any demo role)
    const matchedDemo = demoCredentials.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (matchedDemo) {
      // Demo flow: no API call, show OTP modal
      setDemoUserData({
        role: matchedDemo.role.toUpperCase().replace(" ", "_"),
        username: matchedDemo.username,
        fullName: matchedDemo.role,
      });
      setLoading(false);
      setShowOtpModal(true);
      return;
    }

    // Real login flow
    try {
      await login(username, password);
      // AuthContext will redirect to dashboard
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper: map role to dashboard route
  const getDashboardRoute = (role: string): string => {
    const roleMap: Record<string, string> = {
      SUPER_ADMIN: "/super-admin",
      ADMIN: "/admin",
      PRINCIPAL: "/principal",
      VICE_PRINCIPAL: "/vice-principal",
      TEACHER: "/teacher",
      STUDENT: "/student",
      PARENT: "/parent",
      DRIVER: "/driver",
      HOUSEKEEPING: "/housekeeping",
      RECEPTIONIST: "/receptionist",
      LIBRARIAN: "/librarian",
    };
    const path = roleMap[role] || "/admin";
    return `/(dashboard)${path}`;
  };

  const handleVerifyOtp = async () => {
    if (otp !== "123456") {
      Alert.alert("Error", "Invalid OTP. Please try again.");
      setOtp("");
      return;
    }

    if (!demoUserData) return;

    try {
      // Clear any existing session to avoid stale AuthContext data
      await AsyncStorage.multiRemove([
        "userToken",
        "refreshToken",
        "userRole",
        "userUsername",
        "authenticated",
      ]);

      // Create fake token and store new demo session
      const fakeToken = `fake-jwt-token-${Date.now()}`;
      await AsyncStorage.setItem("userToken", fakeToken);
      await AsyncStorage.setItem("userRole", demoUserData.role);
      await AsyncStorage.setItem("userUsername", demoUserData.username);
      await AsyncStorage.setItem("userFullName", demoUserData.fullName);
      await AsyncStorage.setItem("authenticated", "true");

      setShowOtpModal(false);
      setOtp("");

      // Navigate directly to the role's dashboard (bypass index.tsx)
      const route = getDashboardRoute(demoUserData.role);
      router.replace(route as any);
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.mainBackground}>
        <View style={styles.centerWrapper}>
          <View style={styles.mainCard}>
            <ImageBackground
              source={require("../../../assets/images/erp_login_cover.png")}
              style={[styles.cardBackgroundImage, { flexDirection: isMobile ? "column" : "row" }]}
              resizeMode="cover"
            >
              <View style={[styles.leftContentArea, isMobile && styles.mobileContentArea]}>
                <View style={styles.loginFormContainer}>
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>
                      Edvance<Text style={styles.logoHighlight}>.</Text>
                    </Text>
                    <Text style={styles.subtitle}>SCHOOL ERP</Text>
                  </View>

                  {error ? (
                    <View style={styles.errorWrapper}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : null}

                  <View style={styles.fadeContainer}>
                    <Text style={styles.welcomeText}>Welcome Back! 👋</Text>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Username / Email</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="you@school.com"
                        placeholderTextColor="#9ca3af"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                      />
                    </View>

                    <View style={styles.forgotPasswordContainer}>
                      <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={handleLogin}
                      disabled={loading}
                      style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                    >
                      {loading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.loginButtonText}>Sign In</Text>
                      )}
                    </TouchableOpacity>

                    <View style={styles.demoDivider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>OR</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity onPress={() => setShowDemoModal(true)} style={styles.demoLinkBtn}>
                      <Text style={styles.demoLinkText}>Try Demo Roles ➔</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {!isMobile && <View style={styles.rightContentArea} />}
            </ImageBackground>
          </View>
        </View>
      </View>

      {/* Demo Roles Modal */}
      <Modal
        visible={showDemoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDemoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.demoModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Demo Role</Text>
              <TouchableOpacity onPress={() => setShowDemoModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.demoModalSubtitle}>
              Click on any role below to auto-fill the login credentials.
            </Text>
            <View style={styles.demoGrid}>
              {demoCredentials.map((cred, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.demoGridItem}
                  onPress={() => fillDemoCredentials(cred.username, cred.password, cred.role)}
                >
                  <Text style={styles.demoGridItemText}>{cred.role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* OTP Verification Modal (only for demo login) */}
      <Modal visible={showOtpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.otpModalContainer}>
            <Text style={styles.otpModalTitle}>Verify OTP</Text>
            <Text style={styles.otpModalSubtitle}>
              Enter the 6-digit verification code sent to your email
            </Text>
            <TextInput
              style={styles.otpInput}
              placeholder="123456"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              textAlign="center"
            />
            <Text style={styles.otpHint}>Demo OTP: 123456</Text>
            <TouchableOpacity style={styles.otpVerifyBtn} onPress={handleVerifyOtp}>
              <Text style={styles.otpVerifyBtnText}>Verify & Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.otpCancelBtn}
              onPress={() => {
                setShowOtpModal(false);
                setOtp("");
              }}
            >
              <Text style={styles.otpCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// Styles – keep all existing styles plus add OTP modal styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  mainBackground: { flex: 1, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  centerWrapper: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, width: "100%" },
  mainCard: { width: "100%", maxWidth: 1100, height: 560, backgroundColor: "#FFF", borderRadius: 24, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 20 },
  cardBackgroundImage: { flex: 1, width: "100%", height: "100%" },
  leftContentArea: { flex: 1, justifyContent: "center", alignItems: "center", paddingLeft: Platform.OS === "web" ? 40 : 20 },
  mobileContentArea: { paddingLeft: 0, paddingHorizontal: 20, backgroundColor: "rgba(255,255,255,0.85)" },
  rightContentArea: { flex: 1.1 },
  loginFormContainer: { width: "100%", maxWidth: 400, paddingHorizontal: 20, paddingVertical: 10 },
  fadeContainer: { width: "100%" },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logoText: { fontSize: 42, fontWeight: "900", color: "#5C2E14", letterSpacing: -1 },
  logoHighlight: { color: "#E35336" },
  subtitle: { fontSize: 14, color: "#A0522D", marginTop: 2, letterSpacing: 4, fontWeight: "800" },
  welcomeText: { fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 24, textAlign: "center" },
  errorWrapper: { backgroundColor: "#FEE2E2", padding: 10, borderRadius: 8, marginBottom: 16 },
  errorText: { color: "#DC2626", fontWeight: "600", fontSize: 13, textAlign: "center" },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8, height: 48, paddingHorizontal: 16, color: "#111827", fontSize: 15, fontWeight: "500" },
  forgotPasswordContainer: { alignItems: "flex-end", marginTop: -4, marginBottom: 24 },
  forgotText: { color: "#2563EB", fontSize: 13, fontWeight: "600" },
  loginButton: { backgroundColor: "#E35336", paddingVertical: 14, borderRadius: 8, width: "100%", alignItems: "center", shadowColor: "#E35336", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: "#FFF", fontWeight: "800", fontSize: 16, letterSpacing: 1 },
  demoDivider: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { marginHorizontal: 10, color: "#9CA3AF", fontSize: 12, fontWeight: "600" },
  demoLinkBtn: { backgroundColor: "rgba(227,83,54,0.08)", paddingVertical: 14, borderRadius: 8, width: "100%", alignItems: "center", borderWidth: 1, borderColor: "rgba(227,83,54,0.2)" },
  demoLinkText: { color: "#E35336", fontSize: 14, fontWeight: "800" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(17,24,39,0.75)", justifyContent: "center", alignItems: "center" },
  demoModalContainer: { backgroundColor: "#FFF", borderRadius: 24, padding: 30, width: "90%", maxWidth: 550, shadowColor: "#000", shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.3, shadowRadius: 30, elevation: 15 },
  demoModalSubtitle: { fontSize: 14, color: "#6B7280", marginBottom: 24, lineHeight: 20 },
  demoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 20 },
  demoGridItem: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  demoGridItemText: { fontSize: 13, color: "#374151", fontWeight: "700" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 24, fontWeight: "800", color: "#111827" },
  modalClose: { fontSize: 22, color: "#9CA3AF", fontWeight: "bold", padding: 4 },

  // OTP Modal Styles
  otpModalContainer: { backgroundColor: "#FFF", borderRadius: 24, padding: 30, width: "90%", maxWidth: 400, alignItems: "center" },
  otpModalTitle: { fontSize: 24, fontWeight: "800", color: "#111827", marginBottom: 8 },
  otpModalSubtitle: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 24, lineHeight: 20 },
  otpInput: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 24, fontWeight: "900", color: "#E35336", textAlign: "center", letterSpacing: 10, width: "100%", marginBottom: 12 },
  otpHint: { fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 24, fontWeight: "600" },
  otpVerifyBtn: { backgroundColor: "#E35336", paddingVertical: 14, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 12, shadowColor: "#E35336", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  otpVerifyBtnText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
  otpCancelBtn: { paddingVertical: 10 },
  otpCancelBtnText: { color: "#2563EB", fontSize: 14, fontWeight: "600" },
});