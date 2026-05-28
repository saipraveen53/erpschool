import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center">About Us</Text>
          <View className="w-20 h-1 bg-blue-600 self-center mt-2 rounded-full" />
        </View>

        {/* Company Intro */}
        <View className="mb-8">
          <Text className="text-gray-700 leading-6 text-center">
            We are a team of education technology experts dedicated to transforming schools
            through innovative digital solutions. Our ERP system simplifies administration,
            enhances communication, and empowers teachers, students, and parents.
          </Text>
        </View>

        {/* Mission & Vision */}
        <View className="flex-row flex-wrap justify-between mb-8">
          <View className="w-[48%] bg-blue-50 p-4 rounded-xl mb-4">
            <Text className="text-xl mb-2">🎯</Text>
            <Text className="font-bold text-gray-900">Our Mission</Text>
            <Text className="text-gray-600 text-sm mt-1">
              To provide affordable, user-friendly school management solutions.
            </Text>
          </View>
          <View className="w-[48%] bg-green-50 p-4 rounded-xl mb-4">
            <Text className="text-xl mb-2">👁️</Text>
            <Text className="font-bold text-gray-900">Our Vision</Text>
            <Text className="text-gray-600 text-sm mt-1">
              Digitize every school and create a connected education ecosystem.
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="bg-gray-100 p-6 rounded-2xl mb-8">
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">500+</Text>
              <Text className="text-gray-600">Schools</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">50K+</Text>
              <Text className="text-gray-600">Students</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">10K+</Text>
              <Text className="text-gray-600">Teachers</Text>
            </View>
          </View>
        </View>

        {/* Team */}
        <View>
          <Text className="text-xl font-bold text-gray-900 text-center mb-4">Our Leadership</Text>
          <View className="space-y-4">
            {team.map((member, idx) => (
              <View key={idx} className="flex-row items-center bg-gray-50 p-4 rounded-xl">
                <View className="w-12 h-12 bg-gray-300 rounded-full items-center justify-center mr-4">
                  <Text className="text-gray-600 text-lg">{member.initial}</Text>
                </View>
                <View>
                  <Text className="font-semibold text-gray-900">{member.name}</Text>
                  <Text className="text-gray-500 text-sm">{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-8 bg-gray-200 py-3 rounded-full items-center"
        >
          <Text className="text-gray-700 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const team = [
  { name: 'John Doe', role: 'CEO & Founder', initial: 'JD' },
  { name: 'Jane Smith', role: 'CTO', initial: 'JS' },
  { name: 'Mike Johnson', role: 'Head of Education', initial: 'MJ' },
];