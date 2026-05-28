import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChartCard from '../../components/dashboard/ChartCard';
import RecentActivities from '../../components/dashboard/RecentActivities';
import StatsCard from '../../components/dashboard/StatsCard';
import { activities, chartData, statsData } from '../../data/dashboard-stats.json';

export default function AdminDashboard() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="px-4 py-6">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</Text>
        <Text className="text-gray-500 mb-6">Welcome back, Admin</Text>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {statsData.map((stat, idx) => (
            <View key={idx} className="w-[48%] mb-4">
              <StatsCard title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
            </View>
          ))}
        </View>

        {/* Chart */}
        <ChartCard title="Fee Collection (Monthly)" data={chartData} type="line" />

        {/* Recent Activities */}
        <RecentActivities activities={activities} />
      </ScrollView>
    </SafeAreaView>
  );
}