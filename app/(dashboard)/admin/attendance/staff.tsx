import { useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import staffData from '../../../data/staff.json';

export default function StaffList() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between mb-4"><Text className="text-2xl font-bold">Staff</Text><TouchableOpacity onPress={() => router.push('/admin/staff/add')} className="bg-blue-600 px-4 py-2 rounded-lg"><Text className="text-white">+ Add</Text></TouchableOpacity></View>
      <FlatList data={staffData} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<TouchableOpacity onPress={() => router.push(`/admin/staff/${item.id}`)} className="bg-gray-50 p-4 rounded-xl mb-2"><Text className="font-semibold">{item.name}</Text><Text className="text-gray-500">{item.role}</Text></TouchableOpacity>)} />
    </View>
  );
}