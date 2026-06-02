 import { Clock, UserCheck } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AttendanceVerification() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Attendance Verification</Text>
          <Text style={styles.subtitle}>Review and approve daily attendance logs.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Staff</Text>
            <Text style={styles.statValue}>85</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pending Approvals</Text>
            <Text style={[styles.statValue, { color: '#E35336' }]}>4</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <UserCheck size={24} color="#E35336" />
            <Text style={styles.cardTitle}>Registers Pending Verification</Text>
          </View>
          
          {['Class IX-A', 'Class VIII-B', 'Class X-C'].map((cls, idx) => (
            <View key={idx} style={styles.listItem}>
              <Clock size={24} color="#A88D7D" />
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{cls} Attendance</Text>
                <Text style={styles.listSub}>Submitted by Class Teacher</Text>
              </View>
              <TouchableOpacity style={styles.approveBtn}>
                <Text style={styles.approveBtnText}>Approve</Text>
              </TouchableOpacity>
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
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E8D5C4' },
  statLabel: { fontSize: 13, color: '#7A5A4A', fontWeight: '700' },
  statValue: { fontSize: 28, fontWeight: '900', color: '#5C2E14', marginTop: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#2A1308', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#2A1308' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F4F7FA' },
  listInfo: { flex: 1, marginLeft: 16 },
  listTitle: { fontSize: 15, fontWeight: '700', color: '#5C2E14' },
  listSub: { fontSize: 13, color: '#7A5A4A', marginTop: 2 },
  approveBtn: { backgroundColor: '#E35336', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  approveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 }
});
