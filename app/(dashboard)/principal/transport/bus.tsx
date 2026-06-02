import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import * as Icons from "lucide-react-native";

const mockBuses = [
  { id: "BUS-101", route: "North Route", driver: "Ramesh Kumar", students: 42, status: "Running", location: "Sector 12", arrival: "08:10 AM", condition: "Good", trips: 124, rating: 4.8, contact: "+91 98765 43210" },
  { id: "BUS-102", route: "South Route", driver: "Suresh Patel", students: 38, status: "Delayed", location: "Main Road", arrival: "08:25 AM", condition: "Good", trips: 118, rating: 4.5, contact: "+91 98765 43211" },
  { id: "BUS-103", route: "East Route", driver: "Amit Singh", students: 35, status: "Maintenance", location: "Depot", arrival: "--", condition: "Service Required", trips: 102, rating: 4.2, contact: "+91 98765 43212" },
  { id: "BUS-104", route: "West Route", driver: "Vikram Mehta", students: 40, status: "Running", location: "City Center", arrival: "08:15 AM", condition: "Excellent", trips: 130, rating: 4.9, contact: "+91 98765 43213" },
  { id: "BUS-105", route: "Central Route", driver: "Rajesh Kumar", students: 36, status: "Running", location: "Railway Station", arrival: "08:20 AM", condition: "Good", trips: 115, rating: 4.6, contact: "+91 98765 43214" },
];

export default function Bus() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedBus, setSelectedBus] = useState(null);
  const [busModal, setBusModal] = useState(false);
  const [driverModal, setDriverModal] = useState(false);

  const filteredBuses = useMemo(() => {
    return mockBuses.filter((bus) => {
      const matchesSearch = bus.id.toLowerCase().includes(search.toLowerCase()) || 
                            bus.route.toLowerCase().includes(search.toLowerCase()) ||
                            bus.driver.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "All" || bus.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [search, activeTab]);

  const getStatusIcon = (status) => {
    switch(status) {
      case "Running": return <Icons.Bus size={14} color="#16a34a" />;
      case "Delayed": return <Icons.AlertCircle size={14} color="#ea580c" />;
      default: return <Icons.Wrench size={14} color="#E35336" />;
    }
  };

  const renderItem = ({ item }) => {
    const statusStyle = item.status === "Running" ? styles.greenChip : item.status === "Delayed" ? styles.amberChip : styles.redChip;
    const statusIcon = getStatusIcon(item.status);

    if (isLargeScreen) {
      return (
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
            <Icons.Bus size={16} color="#A0522D" />
            <Text style={styles.busId}>{item.id}</Text>
          </View>
          <Text style={[styles.tableCell, { flex: 1.2 }]}>{item.route}</Text>
          <Text style={[styles.tableCell, { flex: 1.3 }]}>{item.driver}</Text>
          <Text style={[styles.tableCell, { flex: 0.8, fontWeight: '600' }]}>{item.students}</Text>
          <View style={{ flex: 1 }}>
            <View style={[styles.statusChip, statusStyle]}>
              {statusIcon}
              <Text style={[styles.statusText, { color: item.status === "Running" ? "#16a34a" : item.status === "Delayed" ? "#ea580c" : "#E35336" }]}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.viewBtn} onPress={() => { setSelectedBus(item); setBusModal(true); }}>
              <Icons.Eye size={14} color="#A0522D" />
              <Text style={styles.viewText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportBtn} onPress={() => { setSelectedBus(item); setDriverModal(true); }}>
              <Icons.FileText size={14} color="#fff" />
              <Text style={styles.reportText}>Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mobileCard}>
        <View style={styles.mobileCardHeader}>
          <View style={styles.mobileBusInfo}>
            <Icons.Bus size={20} color="#A0522D" />
            <Text style={styles.busTitle}>{item.id}</Text>
          </View>
          <View style={[styles.statusChip, statusStyle]}>
            {statusIcon}
            <Text style={[styles.statusText, { color: item.status === "Running" ? "#16a34a" : item.status === "Delayed" ? "#ea580c" : "#E35336" }]}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.mobileRouteInfo}>
          <Icons.MapPin size={14} color="#8c7664" />
          <Text style={styles.routeText}>{item.route}</Text>
        </View>
        <View style={styles.mobileDriverInfo}>
          <Icons.User size={14} color="#8c7664" />
          <Text style={styles.driverText}>Driver: {item.driver}</Text>
        </View>
        <View style={styles.mobileStudentInfo}>
          <Icons.Users size={14} color="#8c7664" />
          <Text style={styles.studentText}>Students: {item.students}</Text>
        </View>
        <View style={styles.mobileActions}>
          <TouchableOpacity style={styles.viewBtnMobile} onPress={() => { setSelectedBus(item); setBusModal(true); }}>
            <Icons.Eye size={14} color="#A0522D" />
            <Text style={styles.viewBtnMobileText}>View Bus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportBtnMobile} onPress={() => { setSelectedBus(item); setDriverModal(true); }}>
            <Icons.FileText size={14} color="#fff" />
            <Text style={styles.reportText}>Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.title}>Transport Monitoring Center</Text>
          <Text style={styles.subtitle}>Real-time bus tracking & fleet management</Text>
        </View>
        <Icons.Bus size={40} color="#A0522D" opacity={0.3} />
      </View>
      
      <View style={[styles.statsRow, { flexDirection: isLargeScreen ? "row" : "column" }]}>
        <View style={styles.statCard}>
          <View style={styles.statIconBg}>
            <Icons.Bus size={20} color="#A0522D" />
          </View>
          <View>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Active Buses</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: '#16a34a15' }]}>
            <Icons.UserCheck size={20} color="#16a34a" />
          </View>
          <View>
            <Text style={styles.statValue}>16</Text>
            <Text style={styles.statLabel}>Drivers On Duty</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: '#F4A46015' }]}>
            <Icons.Users size={20} color="#F4A460" />
          </View>
          <View>
            <Text style={styles.statValue}>1,245</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: '#E3533615' }]}>
            <Icons.AlertTriangle size={20} color="#E35336" />
          </View>
          <View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active Alerts</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchIcon}>
          <Icons.Search size={18} color="#a89a8c" />
        </View>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search by bus ID, route or driver..." 
          placeholderTextColor="#a89a8c"
          value={search} 
          onChangeText={setSearch} 
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} style={styles.clearBtn}>
            <Icons.X size={18} color="#a89a8c" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["All", "Running", "Delayed", "Maintenance"].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]} 
              onPress={() => setActiveTab(tab)}
            >
              {tab === "Running" && <Icons.Bus size={14} color={activeTab === tab ? "#fff" : "#A0522D"} />}
              {tab === "Delayed" && <Icons.Clock size={14} color={activeTab === tab ? "#fff" : "#A0522D"} />}
              {tab === "Maintenance" && <Icons.Wrench size={14} color={activeTab === tab ? "#fff" : "#A0522D"} />}
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredBuses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={isLargeScreen ? (
          <View style={styles.tableHeader}>
            <Text style={{ flex: 1, fontWeight: '700', color: '#A0522D' }}>Bus</Text>
            <Text style={{ flex: 1.2, fontWeight: '700', color: '#A0522D' }}>Route</Text>
            <Text style={{ flex: 1.3, fontWeight: '700', color: '#A0522D' }}>Driver</Text>
            <Text style={{ flex: 0.8, fontWeight: '700', color: '#A0522D' }}>Students</Text>
            <Text style={{ flex: 1, fontWeight: '700', color: '#A0522D' }}>Status</Text>
            <Text style={{ flex: 1.6, fontWeight: '700', color: '#A0522D' }}>Actions</Text>
          </View>
        ) : null}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icons.Bus size={60} color="#d6c5b5" />
            <Text style={styles.emptyText}>No buses found</Text>
          </View>
        }
      />

      <Modal visible={busModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { width: isLargeScreen ? "40%" : "90%" }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bus Information</Text>
              <TouchableOpacity onPress={() => setBusModal(false)}>
                <Icons.X size={24} color="#A0522D" />
              </TouchableOpacity>
            </View>
            {selectedBus && (
              <View style={styles.modalContent}>
                <View style={styles.modalInfoRow}>
                  <Icons.Bus size={18} color="#A0522D" />
                  <Text style={styles.modalLabel}>Bus ID:</Text>
                  <Text style={styles.modalValue}>{selectedBus.id}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Icons.MapPin size={18} color="#A0522D" />
                  <Text style={styles.modalLabel}>Location:</Text>
                  <Text style={styles.modalValue}>{selectedBus.location}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Icons.Activity size={18} color="#A0522D" />
                  <Text style={styles.modalLabel}>Condition:</Text>
                  <Text style={styles.modalValue}>{selectedBus.condition}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Icons.Clock size={18} color="#A0522D" />
                  <Text style={styles.modalLabel}>Arrival Time:</Text>
                  <Text style={styles.modalValue}>{selectedBus.arrival}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Icons.TrendingUp size={18} color="#A0522D" />
                  <Text style={styles.modalLabel}>Total Trips:</Text>
                  <Text style={styles.modalValue}>{selectedBus.trips}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setBusModal(false)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={driverModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { width: isLargeScreen ? "40%" : "90%" }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Driver Report</Text>
              <TouchableOpacity onPress={() => setDriverModal(false)}>
                <Icons.X size={24} color="#A0522D" />
              </TouchableOpacity>
            </View>
            {selectedBus && (
              <View style={styles.modalContent}>
                <View style={styles.driverAvatar}>
                  <Icons.User size={40} color="#fff" />
                </View>
                <Text style={styles.driverName}>{selectedBus.driver}</Text>
                <View style={styles.modalInfoRow}>
                  <Icons.Star size={18} color="#F4A460" />
                  <Text style={styles.modalLabel}>Rating:</Text>
                  <Text style={styles.modalValue}>{selectedBus.rating} ⭐</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Icons.Phone size={18} color="#A0522D" />
                  <Text style={styles.modalLabel}>Contact:</Text>
                  <Text style={styles.modalValue}>{selectedBus.contact}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Icons.Bus size={18} color="#A0522D" />
                  <Text style={styles.modalLabel}>Assigned Bus:</Text>
                  <Text style={styles.modalValue}>{selectedBus.id}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Icons.MapPin size={18} color="#A0522D" />
                  <Text style={styles.modalLabel}>Route:</Text>
                  <Text style={styles.modalValue}>{selectedBus.route}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setDriverModal(false)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC", padding: 16 },
  
  headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#A0522D" },
  subtitle: { fontSize: 13, color: "#8c7664", marginTop: 4 },
  
  statsRow: { gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "#fff", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#eaddcc", flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#A0522D15", alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 22, fontWeight: "700", color: "#1e1b18" },
  statLabel: { fontSize: 11, color: "#8c7664", marginTop: 2 },
  
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#eaddcc", marginBottom: 16, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchBar: { flex: 1, paddingVertical: 12, fontSize: 14, color: "#1e1b18" },
  clearBtn: { padding: 4 },
  
  tabContainer: { marginBottom: 16 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1, borderColor: '#A0522D', marginRight: 10 },
  activeTab: { backgroundColor: '#A0522D' },
  tabText: { color: '#A0522D', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: '#fff' },
  
  tableHeader: { flexDirection: "row", backgroundColor: "#f5ebe0", padding: 14, borderRadius: 12, marginTop: 10, marginBottom: 8 },
  tableRow: { flexDirection: "row", backgroundColor: "#fff", padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#f5ebe0", marginBottom: 8, alignItems: 'center' },
  tableCell: { fontSize: 13, color: "#4a3e3d" },
  busId: { fontWeight: "700", color: "#A0522D" },
  
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, alignSelf: "flex-start" },
  greenChip: { backgroundColor: "#dcfce7" },
  amberChip: { backgroundColor: "#fef3c7" },
  redChip: { backgroundColor: "#fee2e2" },
  statusText: { fontSize: 12, fontWeight: "600" },
  
  actionContainer: { flex: 1.6, flexDirection: "row", gap: 10 },
  viewBtn: { flexDirection: "row", alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#eaddcc", borderRadius: 8, backgroundColor: "#fff" },
  viewText: { color: "#A0522D", fontWeight: "600", fontSize: 12 },
  reportBtn: { flexDirection: "row", alignItems: 'center', gap: 6, backgroundColor: "#E35336", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  reportText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  
  mobileCard: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#eaddcc" },
  mobileCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mobileBusInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  busTitle: { fontSize: 16, fontWeight: "700", color: "#A0522D" },
  mobileRouteInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  mobileDriverInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  mobileStudentInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  routeText: { fontSize: 13, color: "#4a3e3d" },
  driverText: { fontSize: 13, color: "#4a3e3d" },
  studentText: { fontSize: 13, color: "#4a3e3d", fontWeight: '500' },
  mobileActions: { flexDirection: "row", gap: 10 },
  viewBtnMobile: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: "#eaddcc", borderRadius: 10, paddingVertical: 10, backgroundColor: "#fff" },
  viewBtnMobileText: { color: "#A0522D", fontWeight: "600", fontSize: 13 },
  reportBtnMobile: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: "#E35336", borderRadius: 10, paddingVertical: 10 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: "#a89a8c", marginTop: 12 },
  
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#f5ebe0", paddingBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#A0522D" },
  modalContent: { gap: 12 },
  modalInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalLabel: { fontSize: 13, fontWeight: "600", color: "#8c7664", width: 80 },
  modalValue: { fontSize: 13, color: "#1e1b18", flex: 1 },
  driverAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#A0522D", alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
  driverName: { fontSize: 18, fontWeight: "700", color: "#A0522D", textAlign: 'center', marginBottom: 16 },
  closeBtn: { backgroundColor: "#A0522D", paddingVertical: 12, borderRadius: 10, marginTop: 20, alignItems: "center" },
  closeBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});