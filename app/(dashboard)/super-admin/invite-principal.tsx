import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { Mail, User, ShieldCheck } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InvitePrincipal() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { defaultRole } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState((defaultRole as string) || 'principle');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email || !fullName) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8081' : 'http://192.168.88.20:8081';
      const response = await fetch(`${baseUrl}/api/superAdmin/invitePrinciple?role=${role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ email, fullName, role: role.toUpperCase() })
      });

      if (response.ok) {
        Alert.alert("Success", `Invite link successfully sent to: ${email}`);
        setEmail('');
        setFullName('');
      } else {
        const errorText = await response.text();
        Alert.alert("Failed", `Could not send invite: ${errorText}`);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "A network error occurred. Make sure the backend is running.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { width: isMobile ? '100%' : 440, padding: isMobile ? 24 : 32 }]}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={28} color="#0F172A" />
        </View>
        
        <Text style={styles.title}>Send Invitation</Text>
        <Text style={styles.subtitle}>Onboard a new {role === 'principle' ? 'Principal' : 'Admin'} to the platform securely.</Text>

        <View style={styles.roleToggleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'principle' && styles.roleButtonActive]}
            onPress={() => setRole('principle')}
          >
            <Text style={[styles.roleButtonText, role === 'principle' && styles.roleButtonTextActive]}>Principal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'admin' && styles.roleButtonActive]}
            onPress={() => setRole('admin')}
          >
            <Text style={[styles.roleButtonText, role === 'admin' && styles.roleButtonTextActive]}>Administrator</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <User size={18} color="#64748B" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Alice P."
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color="#64748B" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. alice@school.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleInvite}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Send Secure Invite</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slate 50
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // Clean SaaS curve
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9', // Crisp gray border
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A', // Slate 900
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B', // Slate 500
    marginBottom: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  roleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  roleButtonTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155', // Slate 700
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate 200
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    height: 48,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#E35336', // Terracotta for pop
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#FCA5A5', 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  }
});
