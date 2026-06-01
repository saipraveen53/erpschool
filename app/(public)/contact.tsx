import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">Contact Us</Text>
        <Text className="text-gray-600 text-center mb-8">We'd love to hear from you</Text>

        {/* Contact Info Cards */}
        <View className="flex-row justify-between mb-8">
          <View className="items-center flex-1">
            <Text className="text-2xl mb-1">📞</Text>
            <Text className="text-gray-700 text-sm">+91 98765 43210</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-2xl mb-1">✉️</Text>
            <Text className="text-gray-700 text-sm">support@schoolerp.com</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-2xl mb-1">📍</Text>
            <Text className="text-gray-700 text-sm">Hyderabad, India</Text>
          </View>
        </View>

        {/* Contact Form */}
        <View className="bg-gray-50 p-6 rounded-2xl">
          <Text className="text-lg font-bold text-gray-900 mb-4">Send a Message</Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Your Name</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Email</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-1">Message</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 h-32 text-align-top"
              placeholder="Your message..."
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`bg-blue-600 py-3 rounded-full items-center ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold">Send Message</Text>}
          </TouchableOpacity>
        </View>

        {/* Map Link */}
        <TouchableOpacity
          onPress={() => Linking.openURL('https://maps.google.com/?q=Hyderabad')}
          className="mt-6 bg-gray-100 py-4 rounded-xl items-center"
        >
          <Text className="text-gray-700">📍 View on Google Maps</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}