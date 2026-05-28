 
// student.tsx
import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import studentsData from '../../../data/students.json';

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState({});
  const toggle = (id) => setAttendance(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Mark Student Attendance</Text>
      <FlatList data={studentsData} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<View className="flex-row justify-between items-center p-3 border-b"><Text>{item.name}</Text><TouchableOpacity onPress={() => toggle(item.id)} className={`px-4 py-2 rounded ${attendance[item.id] ? 'bg-green-500' : 'bg-gray-300'}`}><Text className="text-white">{attendance[item.id] ? 'Present' : 'Absent'}</Text></TouchableOpacity></View>)} />
      <TouchableOpacity className="mt-6 bg-blue-600 py-3 rounded-lg"><Text className="text-white text-center">Save Attendance</Text></TouchableOpacity>
    </View>
  );
}