import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { Lock, MapPin, Phone, Briefcase, ChevronRight, Eye, EyeOff } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CompleteOnboarding() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  
  // Extract token from URL /super-admin/onboarding?token=XYZ
  const { token } = useLocalSearchParams();

  const [form, setForm] = useState({
    password: '',
    experience: '',
    address: '',
    phoneNo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert("Error", "Missing invite token in URL.");
      return;
    }

    if (!form.password || !form.experience || !form.address || !form.phoneNo) {
      Alert.alert("Error", "Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8081' : 'http://192.168.88.20:8081';
      const response = await fetch(`${baseUrl}/api/principle/complete-onboarding?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          password: form.password,
          experience: form.experience,
          address: form.address,
          phoneNo: form.phoneNo
        })
      });

      if (response.ok) {
        Alert.alert(
          "Success", 
          "Onboarding completed successfully! You can now log in.",
          [{ text: "Go to Login", onPress: () => router.replace('/login') }]
        );
      } else {
        const errorText = await response.text();
        Alert.alert("Failed", `Could not complete onboarding: ${errorText}`);
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
      <View style={[styles.card, { width: isMobile ? '100%' : 600 }]}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Please complete your profile to get started.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Set Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color="#A0522D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Create a strong password"
              value={form.password}
              onChangeText={(t) => setForm({...form, password: t})}
              placeholderTextColor="#B8A095"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} color="#A0522D" /> : <Eye size={18} color="#A0522D" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Years of Experience</Text>
          <View style={styles.inputWrapper}>
            <Briefcase size={18} color="#A0522D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. 15 Years"
              value={form.experience}
              onChangeText={(t) => setForm({...form, experience: t})}
              placeholderTextColor="#B8A095"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <View style={styles.inputWrapper}>
            <MapPin size={18} color="#A0522D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Full address"
              value={form.address}
              onChangeText={(t) => setForm({...form, address: t})}
              placeholderTextColor="#B8A095"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Phone size={18} color="#A0522D" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 000-0000"
              value={form.phoneNo}
              onChangeText={(t) => setForm({...form, phoneNo: t})}
              keyboardType="phone-pad"
              placeholderTextColor="#B8A095"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.buttonText}>Complete Onboarding</Text>
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
    marginTop: 24,
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
