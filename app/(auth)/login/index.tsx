import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [showOTPModal, setShowOTPModal] = useState(false);
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
      // Store temp credentials and show OTP modal instead of Alert
      setTempCredentials({ email, password });
      setShowOTPModal(true);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (otp === "123456") {
      setShowOTPModal(false);
      setOtp("");
      // Login successful – redirect to root index which will handle role-based navigation
      router.replace("/");
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
      setOtp("");
    }
  };

  const handleResendOTP = () => {
    Alert.alert("OTP Sent", "Demo OTP: 123456 has been resent");
  };

  // Fake credentials for demo
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
    { role: "Teacher", email: "teacher@school.com", password: "teacher123" },
    { role: "Parent", email: "parent@school.com", password: "parent123" },
    { role: "Student", email: "student@school.com", password: "student123" },
    { role: "Driver", email: "driver@school.com", password: "driver123" },
  ];

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials Section */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Demo Credentials</Text>
            <View style={styles.demoGrid}>
              {demoCredentials.map((cred, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.demoButton}
                  onPress={() => fillDemoCredentials(cred.email, cred.password)}
                >
                  <Text style={styles.demoButtonText}>{cred.role}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.demoNote}>Demo OTP: 123456</Text>
          </View>
        </View>
      </ScrollView>

      {/* OTP Modal */}
      <Modal
        visible={showOTPModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOTPModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>OTP Verification</Text>
              <TouchableOpacity onPress={() => setShowOTPModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Please enter the 6-digit verification code sent to your email
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              placeholderTextColor="#9ca3af"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
            />

            <Text style={styles.otpHint}>Demo OTP: 123456</Text>

            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={handleVerifyOTP}
            >
              <Text style={styles.verifyBtnText}>Verify & Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendBtn}
              onPress={handleResendOTP}
            >
              <Text style={styles.resendBtnText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  label: {
    color: "#374151",
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#111827",
  },
  forgotButton: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: "#2563eb",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#6b7280",
  },
  registerLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
  demoSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  demoTitle: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 12,
  },
  demoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  demoButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  demoButtonText: {
    fontSize: 12,
    color: "#374151",
  },
  demoNote: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  modalClose: {
    fontSize: 20,
    color: "#6b7280",
    fontWeight: "bold",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
  },
  otpInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    letterSpacing: 8,
  },
  otpHint: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 12,
  },
  verifyBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  verifyBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendBtn: {
    alignItems: "center",
    marginTop: 16,
  },
  resendBtnText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
  },
});