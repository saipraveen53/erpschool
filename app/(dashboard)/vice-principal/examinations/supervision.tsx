 import { ClipboardList, FileText } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ExamSupervision() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Exam Supervision</Text>
          <Text style={styles.subtitle}>Manage invigilators and exam duty allocations.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FileText size={24} color="#E35336" />
            <Text style={styles.cardTitle}>Upcoming Examinations</Text>
          </View>
          
          {['Mid-Term: Science (Class X)', 'Mid-Term: Math (Class IX)'].map((exam, idx) => (
            <View key={idx} style={styles.listItem}>
              <View style={styles.iconBox}>
                <ClipboardList size={20} color="#E35336" />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{exam}</Text>
                <Text style={styles.listSub}>Date: 15th June 2026 • 10:00 AM</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Invigilators Assigned</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E8D5C4' },
  title: { fontSize: 24, fontWeight: '900', color: '#5C2E14' },
  subtitle: { fontSize: 14, color: '#A0522D', marginTop: 4 },
  scrollContent: { padding: 24 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#2A1308', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#2A1308' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F4F7FA' },
  iconBox: { backgroundColor: '#FDF7F4', padding: 12, borderRadius: 12 },
  listInfo: { flex: 1, marginLeft: 16 },
  listTitle: { fontSize: 15, fontWeight: '700', color: '#5C2E14' },
  listSub: { fontSize: 13, color: '#7A5A4A', marginTop: 4 },
  badge: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { color: '#4B5563', fontSize: 12, fontWeight: '700' }
});
