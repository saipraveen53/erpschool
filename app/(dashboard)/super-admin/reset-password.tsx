import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, useWindowDimensions } from 'react-native';
import { Lock, KeyRound, User, ChevronRight, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function ResetPassword() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  

  const { username: prefillUsername } = useLocalSearchParams();

  const [form, setForm] = useState({
    username: (prefillUsername as string) || '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!form.username || !form.otp || !form.newPassword || !form.confirmNewPassword) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8081' : 'http://192.168.88.20:8081';
      const response = await fetch(`${baseUrl}/api/superAdmin/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          username: form.username,
          otp: form.otp,
          newPassword: form.newPassword,
          confirmNewPassword: form.confirmNewPassword
        })
      });

      if (response.ok) {
        Alert.alert(
          "Success", 
          "Your password has been reset successfully. You can now log in.",
          [{ text: "Go to Login", onPress: () => router.replace('/login') }]
        );
      } else {
        const errorText = await response.text();
        Alert.alert("Failed", `Could not reset password: ${errorText}`);
      }
    } catch (error) {
      Alert.alert("Error", "A network error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#A0522D" />
      </TouchableOpacity>

      <View style={[styles.card, { width: isMobile ? '100%' : 500 }]}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to your email along with your new password.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Username / Email</Text>
          <View style={styles.inputWrapper}>
            <User size={18} color="#A0522D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. admin@school.edu"
              value={form.username}
              onChangeText={(t) => setForm({...form, username: t})}
              autoCapitalize="none"
              placeholderTextColor="#B8A095"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>OTP Code</Text>
          <View style={styles.inputWrapper}>
            <KeyRound size={18} color="#A0522D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onChangeText={(t) => setForm({...form, otp: t})}
              placeholderTextColor="#B8A095"
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color="#A0522D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Create a new password"
              value={form.newPassword}
              onChangeText={(t) => setForm({...form, newPassword: t})}
              placeholderTextColor="#B8A095"
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <EyeOff size={18} color="#A0522D" /> : <Eye size={18} color="#A0522D" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color="#A0522D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              value={form.confirmNewPassword}
              onChangeText={(t) => setForm({...form, confirmNewPassword: t})}
              placeholderTextColor="#B8A095"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={18} color="#A0522D" /> : <Eye size={18} color="#A0522D" />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.buttonText}>Reset Password</Text>
              <ChevronRight size={18} color="#fff" style={{ marginLeft: 8 }} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F5F5DC',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E6D8D2',
    zIndex: 10
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E6D8D2',
    marginTop: 60
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#A0522D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#8A6B5D',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A0522D',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6D8D2',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F5F5DC',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#A0522D',
  },
  button: {
    backgroundColor: '#E35336',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: '#F4A460',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
