import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'otp' | 'reset'>('otp');

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(
        'Password Reset',
        'Your password has been successfully reset. Please login.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 'otp' ? 'Verify OTP' : 'Set New Password'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'otp'
              ? 'Enter the 4-digit code sent to your email'
              : 'Create a new password for your account'}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {step === 'otp' ? (
            <>
              <View>
                <Text style={styles.label}>OTP Code</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="1234"
                  placeholderTextColor="#9ca3af"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              <TouchableOpacity
                onPress={handleVerifyOTP}
                disabled={loading}
                style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.verifyButtonText}>Verify OTP</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              <View>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={loading}
                style={[styles.resetButton, loading && styles.resetButtonDisabled]}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.resetButtonText}>Reset Password</Text>}
              </TouchableOpacity>
            </>
          )}

          <View style={styles.backContainer}>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  label: {
    color: '#374151',
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#111827',
  },
  otpInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#111827',
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 4,
  },
  verifyButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  backText: {
    color: '#2563eb',
  },
});