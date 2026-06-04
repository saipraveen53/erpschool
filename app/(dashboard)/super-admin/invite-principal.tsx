import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, useWindowDimensions, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Mail, User, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { rootApi } from '../../utils/axiosInstance';

export default function InvitePrincipal() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
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
      const response = await rootApi.post(`/api/superAdmin/invitePrinciple?role=${role}`, {
        email,
        fullName,
        role: role.toUpperCase()
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", `Invite link successfully sent to: ${email}`);
        setEmail('');
        setFullName('');
      } else {
        Alert.alert("Failed", `Could not send invite`);
      }
    } catch (error: any) {
      const errorText = error.response?.data?.message || error.message || "A network error occurred.";
      Alert.alert("Error", errorText);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: isMobile ? '100%' : 440, alignItems: 'flex-start', marginBottom: 24, marginTop: Platform.OS === 'ios' ? 20 : 0 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonInline}>
            <ArrowLeft size={24} color="#A0522D" />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { width: isMobile ? '100%' : 440, padding: isMobile ? 24 : 32 }]}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={28} color="#A0522D" />
        </View>
        
        <Text style={styles.title}>Send Invitation</Text>
        <Text style={styles.subtitle}>Onboard a new {role === 'principle' ? 'Principal' : role === 'vice_principal' ? 'Vice Principal' : 'Admin'} to the platform securely.</Text>

        <View style={styles.roleToggleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'principle' && styles.roleButtonActive]}
            onPress={() => { setRole('principle'); router.setParams({ defaultRole: 'principle' }); }}
          >
            <Text style={[styles.roleButtonText, role === 'principle' && styles.roleButtonTextActive]}>Principal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'vice_principal' && styles.roleButtonActive]}
            onPress={() => { setRole('vice_principal'); router.setParams({ defaultRole: 'vice_principal' }); }}
          >
            <Text style={[styles.roleButtonText, role === 'vice_principal' && styles.roleButtonTextActive]}>Vice Principal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'admin' && styles.roleButtonActive]}
            onPress={() => { setRole('admin'); router.setParams({ defaultRole: 'admin' }); }}
          >
            <Text style={[styles.roleButtonText, role === 'admin' && styles.roleButtonTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <User size={18} color="#B8A095" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Alice P."
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#B8A095"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color="#B8A095" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. alice@school.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#B8A095"
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  backButtonInline: {
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
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E6D8D2',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F5F5DC',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6D8D2',
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
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5DC',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E6D8D2',
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
    color: '#8A6B5D',
  },
  roleButtonTextActive: {
    color: '#A0522D',
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 16,
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
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
  } as any,
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
