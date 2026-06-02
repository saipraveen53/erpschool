 import { BookOpen, Search, UserCircle } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AcademicMonitoring() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Academic Monitoring</Text>
          <Text style={styles.subtitle}>Track class progression and syllabus completion.</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#5C2E14" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <BookOpen size={24} color="#E35336" />
            <Text style={styles.cardTitle}>Today's Ongoing Classes</Text>
          </View>
          
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.listItem}>
              <UserCircle size={36} color="#A0522D" />
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>Class {item + 7}-A (Mathematics)</Text>
                <Text style={styles.listSub}>Mr. Rajesh Sharma • Chapter {item + 2}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>On Track</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E8D5C4' },
  title: { fontSize: 24, fontWeight: '900', color: '#5C2E14' },
  subtitle: { fontSize: 14, color: '#A0522D', marginTop: 4 },
  searchButton: { padding: 10, backgroundColor: '#FDF7F4', borderRadius: 10 },
  scrollContent: { padding: 24 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#2A1308', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#2A1308' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F4F7FA' },
  listInfo: { flex: 1, marginLeft: 12 },
  listTitle: { fontSize: 15, fontWeight: '700', color: '#5C2E14' },
  listSub: { fontSize: 13, color: '#7A5A4A', marginTop: 2 },
  statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#16A34A', fontSize: 12, fontWeight: '700' }
});
