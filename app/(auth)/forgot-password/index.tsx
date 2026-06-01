import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(
        'OTP Sent',
        'A verification code has been sent to your email.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/otp-verification') }]
      );
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                isMobile && styles.mobileContentArea 
              ]}>
                
                <View style={styles.formContainer}>
                  
                  {/* Edvance Logo */}
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>
                      Edvance<Text style={styles.logoHighlight}>.</Text>
                    </Text>
                    <Text style={styles.subtitle}>SCHOOL ERP</Text>
                  </View>

                  <Text style={styles.welcomeText}>Reset Password 🔒</Text>
                  <Text style={styles.instructionText}>
                    Enter your email and we'll send you an OTP to reset your password.
                  </Text>
                  
                  {error ? (
                    <View style={styles.errorWrapper}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : null}

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
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

                  <TouchableOpacity
                    onPress={handleSendOTP}
                    disabled={loading}
                    style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.actionButtonText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.backContainer}>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                      <Text style={styles.backText}>← Back to Login</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>

              {/* RIGHT SIDE: Kept empty for illustration on desktop, hidden on mobile */}
              {!isMobile && <View style={styles.rightContentArea} />}

            </ImageBackground>
          </View>
        </View>

      </View>
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
  mobileContentArea: {
    paddingLeft: 0,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.85)", 
  },
  rightContentArea: {
    flex: 1.1, 
  },
  formContainer: {
    width: "100%",
    maxWidth: 400, 
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
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
    marginBottom: 24, // Added extra margin for better spacing
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

  // ACTIONS & BUTTONS
  actionButton: {
    backgroundColor: "#E35336", // Matched with login theme
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
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1,
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  backText: {
    color: '#2563eb', // Blue link color
    fontWeight: '600',
    fontSize: 14,
  },
});