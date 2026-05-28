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

export default function ForgotPasswordScreen() {
  const router = useRouter();
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you an OTP to reset your password.
          </Text>
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

          <TouchableOpacity
            onPress={handleSendOTP}
            disabled={loading}
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.sendButtonText}>Send OTP</Text>
            )}
          </TouchableOpacity>

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
  sendButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
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