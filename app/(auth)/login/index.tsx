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
  useWindowDimensions, // Added for responsive mobile view
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { width } = useWindowDimensions(); // Getting screen width
  const isMobile = width < 768; // Check if the device is mobile/tablet portrait

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP Phase & Demo Modal states
  const [isOTPPhase, setIsOTPPhase] = useState(false); // Replaced OTP modal state with inline phase
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempCredentials, setTempCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      setTempCredentials({ email, password });
      setIsOTPPhase(true); // Switch to OTP UI inline
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (otp === "123456") {
      setIsOTPPhase(false);
      setOtp("");
      router.replace("/");
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
      setOtp("");
    }
  };

  const handleResendOTP = () => {
    Alert.alert("OTP Sent", "Demo OTP: 123456 has been resent");
  };

  // Complete list of demo credentials for all dashboard roles
  const demoCredentials = [
    {
      role: "Super Admin",
      email: "superadmin@school.com",
      password: "super123",
    },
    { role: "Admin", email: "admin@school.com", password: "admin123" },
    {
      role: "Principal",
      email: "principal@school.com",
      password: "principal123",
    },
    { role: "Vice Principal", email: "vice@school.com", password: "vice123" },
    { role: "Teacher", email: "teacher@school.com", password: "teacher123" },
    { role: "Student", email: "student@school.com", password: "student123" },
    { role: "Parent", email: "parent@school.com", password: "parent123" },
    { role: "Driver", email: "driver@school.com", password: "driver123" },
    {
      role: "Housekeeping",
      email: "housekeeping@school.com",
      password: "house123",
    },
    {
      role: "Receptionist",
      email: "receptionist@school.com",
      password: "reception123",
    },
    {
      role: "Librarian",
      email: "librarian@school.com",
      password: "librarian123",
    },
  ];

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
    setShowDemoModal(false); 
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
              source={require('../../../assets/images/erp_login_cover.png')}
              style={[styles.cardBackgroundImage, { flexDirection: isMobile ? "column" : "row" }]}
              resizeMode="cover"
            >
              {/* LEFT SIDE: Responsive Wrapper */}
              <View style={[
                styles.leftContentArea, 
                isMobile && styles.mobileContentArea // Apply mobile specific styling if on small screen
              ]}>
                
                <View style={styles.loginFormContainer}>
                  
                  {/* Edvance Logo */}
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

                  {/* Inline Switch: Login vs OTP Phase */}
                  {!isOTPPhase ? (
                    <View style={styles.fadeContainer}>
                      <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
                      
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>User Email</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="you@school.com"
                          placeholderTextColor="#9ca3af"
                          value={email}
                          onChangeText={setEmail}
                          autoCapitalize="none"
                          keyboardType="email-address"
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
                  ) : (
                    // OTP INLINE FORM
                    <View style={styles.fadeContainer}>
                      <Text style={styles.welcomeText}>Verify OTP 🔐</Text>
                      
                      <Text style={styles.inlineModalSubtitle}>
                        Please enter the 6-digit verification code sent to your email
                      </Text>

                      <TextInput
                        style={styles.inlineOtpInput}
                        placeholder="Enter OTP"
                        placeholderTextColor="#B8A9A0"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                        textAlign="center"
                      />

                      <Text style={styles.inlineOtpHint}>Demo OTP: 123456</Text>

                      <TouchableOpacity
                        style={[styles.loginButton, { marginTop: 16 }]}
                        onPress={handleVerifyOTP}
                      >
                        <Text style={styles.loginButtonText}>Verify & Login</Text>
                      </TouchableOpacity>

                      <View style={styles.otpActionRow}>
                        <TouchableOpacity onPress={() => setIsOTPPhase(false)} style={styles.inlineBackBtn}>
                          <Text style={styles.inlineBackText}>← Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleResendOTP}>
                          <Text style={styles.inlineResendText}>Resend OTP</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                </View>
              </View>

              {/* RIGHT SIDE: Kept empty for illustration on desktop, hidden on mobile */}
              {!isMobile && <View style={styles.rightContentArea} />}

            </ImageBackground>
          </View>
        </View>

      </View>

      {/* DEMO ROLES MODAL */}
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
                  onPress={() => fillDemoCredentials(cred.email, cred.password)}
                >
                  <Text style={styles.demoGridItemText}>{cred.role}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.demoNoteText}>Demo OTP for all roles: 123456</Text>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainBackground: {
    flex: 1,
    backgroundColor: "#F3F4F6", 
    justifyContent: "center", 
    alignItems: "center",
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  mainCard: {
    width: "100%",
    maxWidth: 1100, 
    height: 560,    
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  cardBackgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  // LEFT CONTENT AREA
  leftContentArea: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: Platform.OS === 'web' ? 40 : 20,
  },
  // MOBILE FIX: Gives form a semi-transparent background to remain legible over the illustration
  mobileContentArea: {
    paddingLeft: 0,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Frosted glass effect for mobile
  },
  rightContentArea: {
    flex: 1.1, 
  },
  loginFormContainer: {
    width: "100%",
    maxWidth: 400, 
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  fadeContainer: {
    width: "100%",
  },

  // LOGO
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 42, 
    fontWeight: "900",
    color: "#5C2E14", 
    letterSpacing: -1,
  },
  logoHighlight: {
    color: "#E35336", 
  },
  subtitle: {
    fontSize: 14,
    color: "#A0522D", 
    marginTop: 2,
    letterSpacing: 4,
    fontWeight: "800",
  },

  // FORM TEXTS
  welcomeText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 24,
    textAlign: "center",
  },
  errorWrapper: {
    backgroundColor: "#FEE2E2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },

  // INPUTS
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    color: "#111827",
    fontSize: 15,
    fontWeight: "500",
  },

  // INLINE OTP STYLING
  inlineModalSubtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  inlineOtpInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: "900",
    color: "#E35336",
    textAlign: "center",
    letterSpacing: 10,
  },
  inlineOtpHint: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "600",
  },
  otpActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 10,
  },
  inlineBackText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  inlineResendText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },

  // ACTIONS & BUTTONS
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: -4,
    marginBottom: 24, 
  },
  forgotText: {
    color: "#2563EB", 
    fontSize: 13,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#E35336", 
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%", 
    alignItems: "center",
    shadowColor: "#E35336",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1,
  },

  // DEMO DIVIDER
  demoDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
  },
  
  // DEMO BUTTON
  demoLinkBtn: {
    backgroundColor: "rgba(227, 83, 54, 0.08)", 
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%", 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(227, 83, 54, 0.2)",
  },
  demoLinkText: {
    color: "#E35336",
    fontSize: 14,
    fontWeight: "800",
  },

  // MODAL STYLING (DEMO)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.75)", 
    justifyContent: "center",
    alignItems: "center",
  },
  demoModalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    width: "90%",
    maxWidth: 550, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  demoModalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
    lineHeight: 20,
  },
  demoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginBottom: 20,
  },
  demoGridItem: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB", 
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8, 
  },
  demoGridItemText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "700",
  },
  demoNoteText: {
    textAlign: "center",
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  modalClose: {
    fontSize: 22,
    color: "#9CA3AF",
    fontWeight: "bold",
    padding: 4,
  },
});
