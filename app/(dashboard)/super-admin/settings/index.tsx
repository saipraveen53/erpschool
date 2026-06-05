import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions } from "react-native";
import { Database, Shield, Server, CloudCog, Activity, HardDrive } from "lucide-react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const isMobile = width < 768;

export default function SystemSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Database");
  
  const tabs = [
    { id: "Database", icon: Database },
    { id: "Security", icon: Shield },
    { id: "Server", icon: Server },
    { id: "API", icon: CloudCog },
    { id: "Backup", icon: HardDrive },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Database":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Database Monitoring</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Connection Status</Text>
              <Text style={[styles.statValue, { color: "#166534" }]}>Healthy</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Active Connections</Text>
              <Text style={styles.statValue}>142</Text>
            </View>
            <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.statLabel}>Query Performance</Text>
              <Text style={styles.statValue}>42ms avg</Text>
            </View>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.push("/super-admin/settings/optimize" as any)}
            >
              <Text style={styles.primaryBtnText}>Run Optimization</Text>
            </TouchableOpacity>
          </View>
        );
      case "Backup":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Backup Management</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Last Backup</Text>
              <Text style={styles.statValue}>Today, 02:00 AM</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Backup Size</Text>
              <Text style={styles.statValue}>14.2 GB</Text>
            </View>
            <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.statLabel}>Auto Backup</Text>
              <Switch value={true} trackColor={{ true: "rgba(227, 83, 54, 0.5)", false: "#E6D8D2" }} thumbColor={true ? "#E35336" : "#FFFFFF"} />
            </View>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.push("/super-admin/settings/backup" as any)}
            >
              <Text style={styles.primaryBtnText}>Trigger Manual Backup</Text>
            </TouchableOpacity>
          </View>
        );
      case "Security":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Security Control</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>2FA Requirement</Text>
              <Switch value={true} trackColor={{ true: "rgba(227, 83, 54, 0.5)", false: "#E6D8D2" }} thumbColor={true ? "#E35336" : "#FFFFFF"} />
            </View>
            <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.statLabel}>Failed Logins Lockout</Text>
              <Text style={styles.statValue}>5 attempts</Text>
            </View>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.push("/super-admin/settings/audit-logs" as any)}
            >
              <Text style={styles.primaryBtnText}>Audit Logs</Text>
            </TouchableOpacity>
          </View>
        );
      case "API":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>API Management</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Rate Limiting</Text>
              <Text style={styles.statValue}>1000 req/min</Text>
            </View>
            <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.statLabel}>Public API Access</Text>
              <Switch value={false} trackColor={{ false: "#E6D8D2" }} thumbColor="#FFFFFF" />
            </View>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.push("/super-admin/settings/api-keys" as any)}
            >
              <Text style={styles.primaryBtnText}>Generate API Key</Text>
            </TouchableOpacity>
          </View>
        );
      case "Server":
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Server Management</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>CPU Usage</Text>
              <Text style={styles.statValue}>42%</Text>
            </View>
            <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.statLabel}>Memory Usage</Text>
              <Text style={styles.statValue}>68% (11GB/16GB)</Text>
            </View>
            <TouchableOpacity 
              style={[styles.primaryBtn, { backgroundColor: '#FFFCF8', borderColor: '#E6D8D2', shadowOpacity: 0.02 }]}
              onPress={() => router.push("/super-admin/settings/restart" as any)}
            >
              <Text style={[styles.primaryBtnText, { color: '#E35336' }]}>Restart Services</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Settings & Monitor</Text>
        <Text style={styles.headerSubtitle}>Manage core infrastructure and security</Text>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, activeTab === tab.id && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} color={activeTab === tab.id ? "#E35336" : "#A0522D"} style={{ marginRight: 8 }} />
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.id}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    padding: isMobile ? 24 : 32,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(230, 216, 210, 0.5)",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#5C2E14",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#8A6B5D",
    marginTop: 6,
  },
  tabContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E6D8D2",
    shadowColor: "#A0522D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  tabsScroll: {
    paddingHorizontal: 24,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#E35336",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8A6B5D",
  },
  activeTabText: {
    color: "#E35336",
    fontWeight: "800",
  },
  contentContainer: {
    padding: isMobile ? 16 : 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: isMobile ? 24 : 32,
    shadowColor: "#A0522D",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(230, 216, 210, 0.5)",
    maxWidth: 600,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#5C2E14",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5DC",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8A6B5D",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#5C2E14",
  },
  primaryBtn: {
    backgroundColor: "#F4A460",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 32,
    borderWidth: 1,
    borderColor: "rgba(244, 164, 96, 0.8)",
    shadowColor: "#F4A460",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnText: {
    color: "#140804",
    fontWeight: "800",
    fontSize: 15,
  },
});
