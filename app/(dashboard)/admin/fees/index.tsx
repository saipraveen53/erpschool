import { FlatList, Text, View } from 'react-native';
import feesData from '../../../data/fees.json';
import paymentsData from '../../../data/payments.json';

export default function FeesManagement() {
  const totalCollected = paymentsData.reduce((sum, p) => sum + p.amount, 0);
  const pending = feesData.reduce((sum, f) => sum + f.amount, 0) - totalCollected;

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between mb-6">
        <View className="bg-green-100 p-4 rounded-xl flex-1 mr-2"><Text className="text-green-800">Collected</Text><Text className="text-xl font-bold">₹{totalCollected}</Text></View>
        <View className="bg-red-100 p-4 rounded-xl flex-1 ml-2"><Text className="text-red-800">Pending</Text><Text className="text-xl font-bold">₹{pending}</Text></View>
      </View>
      <Text className="text-xl font-bold mb-3">Recent Payments</Text>
      <FlatList data={paymentsData.slice(0, 5)} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<View className="flex-row justify-between p-3 border-b"><Text>{item.studentName}</Text><Text>₹{item.amount}</Text><Text>{item.date}</Text></View>)} />
    </View>
  );
}