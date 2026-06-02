 import { AlertTriangle, ShieldAlert } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DisciplineManagement() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Discipline Management</Text>
          <Text style={styles.subtitle}>Monitor incidents and student conduct.</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>+ Report Incident</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ShieldAlert size={24} color="#E35336" />
            <Text style={styles.cardTitle}>Recent Incidents</Text>
          </View>
          
          {['Dress Code Violation', 'Late Arrival', 'Disruptive Behavior'].map((incident, idx) => (
            <View key={idx} style={styles.listItem}>
              <AlertTriangle size={24} color="#DC2626" />
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{incident}</Text>
                <Text style={styles.listSub}>Reported today at 10:00 AM</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending Review</Text>
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
  primaryButton: { backgroundColor: '#E35336', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  primaryButtonText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  scrollContent: { padding: 24 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#2A1308', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#2A1308' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F4F7FA' },
  listInfo: { flex: 1, marginLeft: 16 },
  listTitle: { fontSize: 15, fontWeight: '700', color: '#5C2E14' },
  listSub: { fontSize: 13, color: '#7A5A4A', marginTop: 2 },
  statusBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#FECACA' },
  statusText: { color: '#DC2626', fontSize: 12, fontWeight: '700' }
});
