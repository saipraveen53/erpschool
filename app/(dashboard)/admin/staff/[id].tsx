 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import studentsData from '../../../data/students.json';

export default function StudentDetail() {
  const { id } = useLocalSearchParams();
  const student = studentsData.find(s => s.id === parseInt(id));
  const router = useRouter();

  if (!student) return <View className="flex-1 justify-center items-center"><Text>Student not found</Text></View>;

  return (
    <View className="flex-1 bg-white p-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4"><Text className="text-blue-600">← Back</Text></TouchableOpacity>
      <View className="bg-gray-50 p-6 rounded-xl">
        <Text className="text-2xl font-bold">{student.name}</Text>
        <Text className="text-gray-600 mt-2">Email: {student.email}</Text>
        <Text className="text-gray-600">Phone: {student.phone}</Text>
        <Text className="text-gray-600">Class: {student.class}</Text>
        <Text className="text-gray-600">Roll No: {student.rollNo}</Text>
        <TouchableOpacity className="mt-6 bg-blue-600 py-2 rounded-lg"><Text className="text-white text-center">Edit Profile</Text></TouchableOpacity>
      </View>
    </View>
  );
}