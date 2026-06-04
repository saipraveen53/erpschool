// app/admin/fees/collection.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Plus, Wallet, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react-native";

export default function FeeCollectionPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const classData = [
    { id: "1", name: "Class 1-b", due: "53,222", paid: "1,000", total: "54,222", status: "Due" },
    { id: "2", name: "Class 4-A", due: "0", paid: "0", total: "0", status: "All Clear" },
    { id: "3", name: "Class 4-b", due: "0", paid: "0", total: "0", status: "All Clear" },
    { id: "4", name: "Class 5-a", due: "4,433", paid: "0", total: "4,433", status: "Due" },
    { id: "5", name: "Class 6-A", due: "0", paid: "0", total: "0", status: "All Clear" },
    { id: "6", name: "Class 7-b", due: "173,350", paid: "255,407", total: "428,757", status: "Due" },
    { id: "7", name: "Class 8-A", due: "0", paid: "0", total: "0", status: "All Clear" },
    { id: "8", name: "Class 9-B", due: "50,000", paid: "25,000", total: "75,000", status: "Due" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { padding: isMobile ? 16 : 24 }]}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Accounts & Fee</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addButtonText}>Assign Fee</Text>
        </TouchableOpacity>
      </View>

      {/* SUMMARY CARDS - Stack vertically on mobile */}
      <View style={[styles.summaryGrid, { flexDirection: isMobile ? 'column' : 'row' }]}>
        <SummaryCard title="Total Expected" value="₹537,412" color="#27B3C7" icon={Wallet} />
        <SummaryCard title="Collected" value="₹256,407" color="#15803D" icon={CheckCircle2} />
        <SummaryCard title="Pending" value="₹281,005" color="#DC2626" icon={AlertTriangle} />
      </View>

      {/* CLASS PERFORMANCE */}
      <Text style={styles.sectionTitle}>Class Performance</Text>
      <View style={[styles.grid, { gap: isMobile ? 12 : 16 }]}>
        {classData.map((item) => (
          <View key={item.id} style={[styles.classCard, { width: isMobile ? "100%" : "31%" }]}>
            <View style={styles.cardHeader}>
              <View style={styles.classBadge}><Text style={styles.classBadgeText}>{item.id}</Text></View>
              <Text style={styles.className}>{item.name}</Text>
              <ChevronRight size={20} color="#6B7280" />
            </View>
            <View style={[styles.statusTag, { backgroundColor: item.status === "All Clear" ? "#DCFCE7" : "#FFFBEB" }]}>
              <Text style={{ color: item.status === "All Clear" ? "#15803D" : "#B45309", fontSize: 11, fontWeight: '700' }}>
                {item.status === "All Clear" ? "All Clear" : `Due: ₹${item.due}`}
              </Text>
            </View>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: item.status === "All Clear" ? '100%' : '40%' }]} /></View>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>₹{item.paid} Paid</Text>
              <Text style={styles.footerText}>Total: ₹{item.total}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function SummaryCard({ title, value, color, icon: Icon }: any) {
  return (
    <View style={styles.summaryCard}>
      <Icon size={24} color={color} />
      <View>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F9FA" },
  content: { paddingBottom: 40 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  heading: { fontSize: 28, fontWeight: "900", color: "#24343D" },
  addButton: { backgroundColor: "#27B3C7", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 8 },
  addButtonText: { color: "#fff", fontWeight: "800" },
  summaryGrid: { gap: 16, marginBottom: 32 },
  summaryCard: { flex: 1, backgroundColor: "#fff", padding: 20, borderRadius: 16, flexDirection: "row", alignItems: "center", gap: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  summaryTitle: { fontSize: 12, color: "#6B7280" },
  summaryValue: { fontSize: 20, fontWeight: "900" },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: "#24343D", marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  classCard: { backgroundColor: "#fff", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  classBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#F0F9FA", alignItems: 'center', justifyContent: 'center' },
  classBadgeText: { fontWeight: '900', color: '#27B3C7' },
  className: { flex: 1, fontSize: 16, fontWeight: '800', color: '#24343D' },
  statusTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 16 },
  progressBar: { height: 8, backgroundColor: '#F0F9FA', borderRadius: 4, marginBottom: 12 },
  progressFill: { height: 8, backgroundColor: '#27B3C7', borderRadius: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 11, color: '#6B7280' },
});