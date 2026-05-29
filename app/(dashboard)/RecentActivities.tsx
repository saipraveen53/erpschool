import { FlatList, StyleSheet, Text, View } from 'react-native';

interface Activity {
  id: number;
  title: string;
  time: string;
  description: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  itemDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  itemTime: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
});