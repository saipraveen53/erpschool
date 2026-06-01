import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import { CreditCard, CheckCircle, AlertCircle, Plus, Search, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function SubscriptionsManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const subscriptions = [
    { id: "1", school: "Greenwood High", plan: "Enterprise", status: "Active", amount: "$499/mo", nextBilling: "Oct 15, 2026" },
    { id: "2", school: "St. Mary's Academy", plan: "Pro", status: "Active", amount: "$299/mo", nextBilling: "Oct 12, 2026" },
    { id: "3", school: "Oakridge International", plan: "Basic", status: "Past Due", amount: "$99/mo", nextBilling: "Sep 28, 2026" },
  ];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredSubscriptions = subscriptions.filter(s => activeFilter === "All" || s.status === activeFilter);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubscriptions.length) setSelectedIds([]);
    else setSelectedIds(filteredSubscriptions.map(s => s.id));
  };

  const planColors: Record<string, string> = {
    Enterprise: "#7c3aed",
    Pro: "#2563eb",
    Basic: "#0891b2",
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 12 : 0 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 24 }]}>Subscriptions</Text>
          <Text style={styles.headerSubtitle}>Manage school billing and plans</Text>
        </View>
        <TouchableOpacity style={[styles.addButton, { width: isMobile ? "100%" : "auto" }]}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addButtonText}>New Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filters */}
      <View style={{ marginHorizontal: isMobile ? 12 : 24, marginTop: 20 }}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94a3b8" />
          <Text style={styles.searchPlaceholder}>Search subscriptions...</Text>
        </View>
        <View style={styles.filterTabsRow}>
          {["All", "Active", "Past Due"].map(filter => (
            <TouchableOpacity key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}>
              <Text style={[styles.filterTabText, activeFilter === filter && styles.filterTabTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.filterTab}>
            <Plus size={14} color="#64748b" style={{ marginRight: 4 }} />
            <Text style={styles.filterTabText}>More Filters</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40 }}>
        {isMobile ? (
          /* ── Mobile Card Layout ── */
          filteredSubscriptions.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={styles.card}
              onPress={() => router.push(`/super-admin/subscriptions/${sub.id}/plan` as any)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <View style={styles.iconWrap}>
                  <CreditCard size={18} color="#2563eb" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardSchool}>{sub.school}</Text>
                  <Text style={styles.cardBilling}>Next billing: {sub.nextBilling}</Text>
                </View>
                <ChevronRight size={18} color="#cbd5e1" />
              </View>

              <View style={styles.cardMeta}>
                <View style={[styles.planBadge, { backgroundColor: (planColors[sub.plan] || "#64748b") + "18" }]}>
                  <Text style={[styles.planText, { color: planColors[sub.plan] || "#64748b" }]}>{sub.plan}</Text>
                </View>
                <Text style={styles.amountText}>{sub.amount}</Text>
                <View style={[styles.statusBadge, { backgroundColor: sub.status === "Active" ? "#dcfce7" : "#fee2e2" }]}>
                  {sub.status === "Active"
                    ? <CheckCircle size={11} color="#166534" style={{ marginRight: 4 }} />
                    : <AlertCircle size={11} color="#991b1b" style={{ marginRight: 4 }} />
                  }
                  <Text style={[styles.statusText, { color: sub.status === "Active" ? "#166534" : "#991b1b" }]}>{sub.status}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.manageBtn}
                onPress={() => router.push(`/super-admin/subscriptions/${sub.id}/plan` as any)}
              >
                <Text style={styles.manageBtnText}>Manage Plan</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          /* ── Desktop Table Layout ── */
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <View style={{ width: 40, justifyContent: "center" }}>
                <TouchableOpacity onPress={toggleSelectAll} style={[styles.checkbox, selectedIds.length === filteredSubscriptions.length && filteredSubscriptions.length > 0 && styles.checkboxActive]}>
                  {selectedIds.length === filteredSubscriptions.length && filteredSubscriptions.length > 0 && <View style={styles.checkboxInner} />}
                </TouchableOpacity>
              </View>
              <Text style={[styles.th, { flex: 2.5 }]}>School</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>Plan</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>Amount</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: "center" }]}>Status</Text>
              <Text style={[styles.th, { flex: 1, textAlign: "center" }]}>Action</Text>
            </View>
            {filteredSubscriptions.map(sub => (
              <View key={sub.id} style={styles.tableRow}>
                <View style={[styles.td, { width: 40 }]}>
                  <TouchableOpacity onPress={() => toggleSelect(sub.id)} style={[styles.checkbox, selectedIds.includes(sub.id) && styles.checkboxActive]}>
                    {selectedIds.includes(sub.id) && <View style={styles.checkboxInner} />}
                  </TouchableOpacity>
                </View>
                <View style={[styles.td, { flex: 2.5, flexDirection: "row", alignItems: "center" }]}>
                  <View style={styles.iconWrap}>
                    <CreditCard size={15} color="#2563eb" />
                  </View>
                  <View>
                    <Text style={styles.cardSchool} numberOfLines={1}>{sub.school}</Text>
                    <Text style={styles.cardBilling}>{sub.nextBilling}</Text>
                  </View>
                </View>
                <View style={[styles.td, { flex: 1.5, justifyContent: "center" }]}>
                  <Text style={styles.planText}>{sub.plan}</Text>
                </View>
                <View style={[styles.td, { flex: 1.5, justifyContent: "center" }]}>
                  <Text style={styles.amountText}>{sub.amount}</Text>
                </View>
                <View style={[styles.td, { flex: 1.5, alignItems: "center" }]}>
                  <View style={[styles.statusBadge, { backgroundColor: sub.status === "Active" ? "#ecfdf5" : "#fff7ed", borderColor: sub.status === "Active" ? "#a7f3d0" : "#fed7aa" }]}>
                    <View style={[styles.statusDot, { backgroundColor: sub.status === "Active" ? "#10b981" : "#f97316" }]} />
                    <Text style={[styles.statusText, { color: sub.status === "Active" ? "#059669" : "#c2410c" }]}>{sub.status}</Text>
                  </View>
                </View>
                <View style={[styles.td, { flex: 1, justifyContent: "center", alignItems: "center" }]}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/super-admin/subscriptions/${sub.id}/plan` as any)}
                  >
                    <Text style={styles.actionButtonText}>Manage</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  headerTitle: { fontWeight: "bold", color: "#1e293b" },
  headerSubtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#2563eb", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8, justifyContent: "center" },
  addButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, gap: 10, marginBottom: 16 },
  searchPlaceholder: { fontSize: 15, color: "#94a3b8" },
  filterTabsRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 16, gap: 16, marginBottom: 20 },
  filterTab: { flexDirection: "row", alignItems: "center", paddingBottom: 6 },
  filterTabActive: { borderBottomWidth: 2, borderBottomColor: "#2563eb" },
  filterTabText: { fontSize: 14, color: "#64748b", fontWeight: "500" },
  filterTabTextActive: { color: "#1e293b", fontWeight: "700" },

  // Mobile Cards
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#eff6ff", justifyContent: "center", alignItems: "center", marginRight: 12, flexShrink: 0 },
  cardSchool: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  cardBilling: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  cardMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#f1f5f9", borderBottomWidth: 1, borderBottomColor: "#f1f5f9", marginBottom: 12 },
  planBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  planText: { fontSize: 13, fontWeight: "700" },
  amountText: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  manageBtn: { backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  manageBtnText: { fontSize: 14, fontWeight: "600", color: "#1e293b" },

  // Shared
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: "600" },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: "#cbd5e1", justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  checkboxInner: { width: 8, height: 8, borderRadius: 2, backgroundColor: "#fff" },

  // Table
  tableContainer: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2, marginBottom: 40, borderWidth: 1, borderColor: "#f1f5f9" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f1f5f9", paddingVertical: 14, paddingHorizontal: 8, alignItems: "center" },
  th: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f8fafc", paddingVertical: 16, paddingHorizontal: 8, alignItems: "center" },
  td: { paddingHorizontal: 4 },
  actionButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "#fff" },
  actionButtonText: { fontSize: 13, fontWeight: "500", color: "#1e293b" },
});
