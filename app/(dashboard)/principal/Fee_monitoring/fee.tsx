import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TouchableOpacity, 
  TextInput, useWindowDimensions, SafeAreaView 
} from 'react-native';
import * as Icons from 'lucide-react-native';

const feeData = [
  { id: '1', student: 'Rohan Verma', class: '10-B', total: 50000, paid: 25000, status: 'Urgent', dueDate: '05 Jun' },
  { id: '2', student: 'Aman Malhotra', class: '12-A', total: 60000, paid: 55000, status: 'Pending', dueDate: '10 Jun' },
  { id: '3', student: 'Vikram Singh', class: '11-A', total: 45000, paid: 45000, status: 'Paid', dueDate: 'Completed' },
  { id: '4', student: 'Sneha Reddy', class: '09-C', total: 30000, paid: 5000, status: 'Urgent', dueDate: '02 Jun' },
];

export default function FinanceHub() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return feeData.filter(item => {
      const matchesTab = activeTab === 'All' || item.status === activeTab;
      const matchesSearch = item.student.toLowerCase().includes(search.toLowerCase()) || 
                            item.class.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search, feeData]);

  const renderStudentRow = ({ item }) => {
    const progress = (item.paid / item.total) * 100;
    return (
      <View style={styles.card}>
        <View style={styles.rowContent}>
          <View style={styles.studentSection}>
            <View style={styles.avatar}><Text style={styles.avatarTxt}>{item.student[0]}</Text></View>
            <View>
              <Text style={styles.name}>{item.student}</Text>
              <Text style={styles.class}>{item.class}</Text>
            </View>
          </View>
          
          <View style={styles.paymentSection}>
            <Text style={styles.amtLabel}>₹{item.paid.toLocaleString()} / ₹{item.total.toLocaleString()}</Text>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
          </View>

          {isTablet && <Text style={styles.dateText}>{item.dueDate}</Text>}
          
          <View style={[styles.badge, { backgroundColor: item.status === 'Urgent' ? '#fee2e2' : '#dcfce7' }]}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: item.status === 'Urgent' ? '#991b1b' : '#166534' }}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Finance Overview</Text>
      
      {/* Stats Row */}
      <View style={styles.statsRow}>
        {['Total', 'Pending', 'Urgent'].map((label, i) => (
          <View key={i} style={styles.statBox}>
            <Text style={styles.statLbl}>{label}</Text>
            <Text style={styles.statVal}>{i === 0 ? '₹48.5L' : i === 1 ? '₹6.2L' : '14'}</Text>
          </View>
        ))}
      </View>

      {/* Filter/Search */}
      <View style={styles.controls}>
        <TextInput style={styles.search} placeholder="Search student or class..." onChangeText={setSearch} />
        <View style={styles.tabs}>
          {['All', 'Urgent', 'Paid'].map(tab => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
              <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList data={filteredData} renderItem={renderStudentRow} keyExtractor={item => item.id} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F0', padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#2e2520', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc' },
  statVal: { fontSize: 16, fontWeight: '800' },
  statLbl: { fontSize: 10, color: '#8c7664', textTransform: 'uppercase' },
  controls: { marginBottom: 15 },
  search: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc', marginBottom: 10 },
  tabs: { flexDirection: 'row', backgroundColor: '#eaddcc', padding: 4, borderRadius: 12 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#fff' },
  tabText: { color: '#8c7664', fontWeight: '600' },
  activeTabText: { color: '#A0522D', fontWeight: '700' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eaddcc' },
  rowContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  studentSection: { flex: 2, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#f3ede8', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarTxt: { fontWeight: 'bold', color: '#A0522D' },
  name: { fontWeight: '700' },
  class: { fontSize: 11, color: '#8c7664' },
  paymentSection: { flex: 1.5, alignItems: 'center' },
  amtLabel: { fontSize: 10, fontWeight: '700', marginBottom: 4 },
  progressBar: { width: '80%', height: 6, backgroundColor: '#f3ede8', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#A0522D' },
  dateText: { fontSize: 11, color: '#8c7664', width: 60, textAlign: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }
});