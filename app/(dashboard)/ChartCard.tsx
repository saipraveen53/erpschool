import { StyleSheet, Text, View } from 'react-native';

interface ChartCardProps {
  title: string;
  data: any;
  type: 'line' | 'bar';
}

export default function ChartCard({ title, data, type }: ChartCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>Chart Preview: {type}</Text>
        <Text style={styles.placeholderSubtext}>
          {data?.labels?.join(' - ') || 'No labels'} | Values: {data?.datasets?.join(', ') || 'No data'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 192,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6b7280',
    fontSize: 14,
  },
  placeholderSubtext: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
});