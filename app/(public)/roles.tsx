import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RolesScreen() {
  const router = useRouter();

  const roles = [
    { title: 'Super Admin', description: 'Full system control, multi-school management, analytics.', icon: '👑', bg: 'bg-purple-100' },
    { title: 'Admin', description: 'School administration, student/staff/fees management.', icon: '🏫', bg: 'bg-blue-100' },
    { title: 'Principal', description: 'Academic monitoring, staff performance, reports.', icon: '👔', bg: 'bg-indigo-100' },
    { title: 'Vice Principal', description: 'Assist principal, exam supervision, discipline.', icon: '📋', bg: 'bg-cyan-100' },
    { title: 'Teacher', description: 'Attendance, homework, marks, parent communication.', icon: '👩‍🏫', bg: 'bg-green-100' },
    { title: 'Student', description: 'View timetable, attendance, results, homework.', icon: '👨‍🎓', bg: 'bg-yellow-100' },
    { title: 'Parent', description: 'Track child progress, fee payment, bus location.', icon: '👪', bg: 'bg-orange-100' },
    { title: 'Driver', description: 'Route management, student pickup, GPS tracking.', icon: '🚌', bg: 'bg-red-100' },
    { title: 'Librarian', description: 'Book issue/return, catalog management.', icon: '📚', bg: 'bg-teal-100' },
    { title: 'Receptionist', description: 'Visitor management, inquiries, appointments.', icon: '📞', bg: 'bg-pink-100' },
    { title: 'Housekeeping', description: 'Task assignments, cleaning schedules, inventory.', icon: '🧹', bg: 'bg-gray-100' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">User Roles</Text>
        <Text className="text-gray-600 text-center mb-8">
          Each role has a dedicated dashboard with specific permissions
        </Text>

        {roles.map((role, idx) => (
          <View key={idx} className={`${role.bg} p-4 rounded-xl mb-4 flex-row items-center`}>
            <Text className="text-3xl mr-4">{role.icon}</Text>
            <View className="flex-1">
              <Text className="font-bold text-gray-900">{role.title}</Text>
              <Text className="text-gray-600 text-sm">{role.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}