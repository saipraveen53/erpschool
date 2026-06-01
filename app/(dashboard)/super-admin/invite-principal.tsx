import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { Mail, User } from 'lucide-react-native';

export default function InvitePrincipal() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email || !fullName) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // NOTE: Adjust the API URL if needed based on the environment setup.
      const response = await fetch('http://192.168.88.13:8081/api/superAdmin/invitePrinciple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({ email, fullName })
      });

      if (response.ok) {
        Alert.alert("Success", `Invite link successfully sent to: ${email}`);
        setEmail('');
        setFullName('');
      } else {
        const errorText = await response.text();
        Alert.alert("Failed", `Could not send invite: ${errorText}`);
      }
    } catch (error) {
      Alert.alert("Error", "A network error occurred. Make sure the backend is running.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { width: isMobile ? '100%' : 500 }]}>
        <Text style={styles.title}>Invite a Principal</Text>
        <Text style={styles.subtitle}>Enter their details below to send an onboarding link.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <User size={18} color="#A0522D" style={styles.icon} />
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
            <Mail size={18} color="#A0522D" style={styles.icon} />
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
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Invite</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A0522D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8A6B5D',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0522D',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6D8D2',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5DC',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#A0522D',
  },
  button: {
    backgroundColor: '#E35336',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
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
