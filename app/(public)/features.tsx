import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeaturesScreen() {
  const router = useRouter();

  const featureList = [
    { title: 'Student Management', description: 'Admissions, profiles, documents, transfers.', icon: '👨‍🎓', color: 'bg-blue-100' },
    { title: 'Staff Management', description: 'Teacher records, payroll, leave, attendance.', icon: '👩‍🏫', color: 'bg-green-100' },
    { title: 'Attendance System', description: 'Biometric, QR, manual – online/offline sync.', icon: '📊', color: 'bg-yellow-100' },
    { title: 'Timetable', description: 'Auto-generated class schedules with conflict check.', icon: '📅', color: 'bg-purple-100' },
    { title: 'Examination', description: 'Online exams, marks entry, report cards, hall tickets.', icon: '📝', color: 'bg-red-100' },
    { title: 'Fee Management', description: 'Fee structure, online payments, receipts, dues tracking.', icon: '💰', color: 'bg-indigo-100' },
    { title: 'Transport', description: 'Live bus tracking, route management, driver app.', icon: '🚌', color: 'bg-orange-100' },
    { title: 'Communication', description: 'SMS, email, in-app chat, notices, announcements.', icon: '💬', color: 'bg-pink-100' },
    { title: 'Library', description: 'Book catalog, issue/return, member management.', icon: '📚', color: 'bg-teal-100' },
    { title: 'Mobile App', description: 'Student, parent, teacher apps for iOS & Android.', icon: '📱', color: 'bg-gray-100' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">Features</Text>
        <Text className="text-gray-600 text-center mb-8">
          Everything you need to manage your school efficiently
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {featureList.map((feature, idx) => (
            <View key={idx} className="w-[48%] mb-4">
              <View className={`${feature.color} p-4 rounded-xl h-32 justify-between`}>
                <Text className="text-3xl">{feature.icon}</Text>
                <View>
                  <Text className="font-bold text-gray-900">{feature.title}</Text>
                  <Text className="text-gray-600 text-xs mt-1">{feature.description}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/register')}
          className="mt-4 bg-blue-600 py-3 rounded-full items-center"
        >
          <Text className="text-white font-semibold">Get Started Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}