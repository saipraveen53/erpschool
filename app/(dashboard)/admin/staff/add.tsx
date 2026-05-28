 
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';

export default function AddStudent() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', class: '', rollNo: '' });

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    // Mock save – would call service later
    Alert.alert('Success', 'Student added', [{ text: 'OK', onPress: () => router.back() }]);
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Add New Student</Text>
      <TextInput placeholder="Full Name" className="border p-3 rounded-lg mb-3" onChangeText={text => setForm({ ...form, name: text })} />
      <TextInput placeholder="Email" keyboardType="email-address" className="border p-3 rounded-lg mb-3" onChangeText={text => setForm({ ...form, email: text })} />
      <TextInput placeholder="Phone" keyboardType="phone-pad" className="border p-3 rounded-lg mb-3" onChangeText={text => setForm({ ...form, phone: text })} />
      <TextInput placeholder="Class" className="border p-3 rounded-lg mb-3" onChangeText={text => setForm({ ...form, class: text })} />
      <TextInput placeholder="Roll Number" className="border p-3 rounded-lg mb-6" onChangeText={text => setForm({ ...form, rollNo: text })} />
      <TouchableOpacity onPress={handleSubmit} className="bg-blue-600 py-3 rounded-lg"><Text className="text-white text-center font-semibold">Save Student</Text></TouchableOpacity>
    </ScrollView>
  );
}