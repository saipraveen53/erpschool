import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, useWindowDimensions, Platform } from 'react-native';
import { Mail, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    if (!username) {
      Alert.alert("Error", "Please enter your username or email.");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8081' : 'http://192.168.88.20:8081';
      const response = await fetch(`${baseUrl}/api/superAdmin/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        Alert.alert(
          "OTP Sent", 
          "Please check your email for the reset instructions.",
          [{ text: "Continue", onPress: () => router.push(`/super-admin/reset-password?username=${encodeURIComponent(username)}`) }]
        );
      } else {
        const errorText = await response.text();
        Alert.alert("Failed", `Could not process request: ${errorText}`);
      }
    } catch (error) {
      Alert.alert("Error", "A network error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#A0522D" />
      </TouchableOpacity>

      <View style={[styles.card, { width: isMobile ? '100%' : 500 }]}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your username or email address and we'll send you an OTP to reset your password.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Username / Email</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color="#A0522D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. admin@school.edu"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#B8A095"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleResetRequest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.buttonText}>Send Reset OTP</Text>
              <ChevronRight size={18} color="#fff" style={{ marginLeft: 8 }} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: '#E6D8D2'
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
    borderColor: '#E6D8D2'
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
