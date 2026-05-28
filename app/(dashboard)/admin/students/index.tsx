import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import studentsData from '../../../data/students.json';

export default function StudentsList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const filtered = studentsData.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Students</Text>
        <TouchableOpacity
          onPress={() => router.push('/admin/students/add')}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">+ Add</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search by name..."
        className="border border-gray-300 rounded-lg p-3 mb-4"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/admin/students/${item.id}`)}
            className="bg-gray-50 p-4 rounded-xl mb-2 flex-row justify-between"
          >
            <View>
              <Text className="font-semibold">{item.name}</Text>
              <Text className="text-gray-500 text-sm">Class {item.class} • Roll {item.rollNo}</Text>
            </View>
            <Text className="text-blue-600">{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}