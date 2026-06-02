import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { rootApi } from '../../../utils/axiosInstance';

export default function TeacherRegistration({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teacherName: '', email: '', phone: '', qualification: '', 
    gender: '', experience: '', address: '', subjectIds: []
  });

  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.teacherName || !formData.email || formData.phone.length < 10) {
      Alert.alert("Validation", "Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const response = await rootApi.post('/api/student/teacher/register', {
        ...formData,
        experience: parseInt(formData.experience) || 0,
        subjectIds: formData.subjectIds // Ensure this is an array
      });
      
      Alert.alert("Success", "Registration Completed Successfully!");
      // navigation.navigate('Dashboard'); // Optional: Add navigation here
    } catch (error) {
      console.error(error);
      Alert.alert("Registration Failed", "Something went wrong. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <Text style={styles.mainTitle}>Complete Registration</Text>
          <Text style={styles.subTitle}>Fill in your professional details below.</Text>
        </View>

        <View style={styles.card}>
          <CustomInput label="Full Name" value={formData.teacherName} onChangeText={(t) => setFormData({...formData, teacherName: t})} />
          <CustomInput label="Institutional Email" value={formData.email} onChangeText={(t) => setFormData({...formData, email: t})} keyboard="email-address" />
          <CustomInput label="Phone Number" value={formData.phone} onChangeText={(t) => setFormData({...formData, phone: t})} keyboard="numeric" />
          <CustomInput label="Qualification" value={formData.qualification} onChangeText={(t) => setFormData({...formData, qualification: t})} />
          <CustomInput label="Experience (Years)" value={formData.experience} onChangeText={(t) => setFormData({...formData, experience: t})} keyboard="numeric" />
          <CustomInput label="Current Address" value={formData.address} onChangeText={(t) => setFormData({...formData, address: t})} multiline />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Registration</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Reusable Input Component
const CustomInput = ({ label, value, onChangeText, keyboard = 'default', multiline = false }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput 
      style={[styles.input, multiline && { height: 80 }]} 
      value={value} 
      onChangeText={onChangeText}
      keyboardType={keyboard}
      multiline={multiline}
      placeholderTextColor="#c0b5a8"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC' },
  headerBox: { padding: 20, paddingTop: 50 },
  mainTitle: { fontSize: 24, fontWeight: '800', color: '#A0522D' },
  subTitle: { fontSize: 14, color: '#8c7664', marginTop: 4 },
  card: { backgroundColor: '#ffffff', marginHorizontal: 20, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#eaddcc' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, color: '#8c7664', fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#faf6f0', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#f5ebe0', fontSize: 14, color: '#2e2520' },
  submitBtn: { backgroundColor: '#A0522D', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 }
});