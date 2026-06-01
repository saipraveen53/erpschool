import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions, Alert } from "react-native";
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
            <View style={styles.statRow}>
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
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Auto Backup</Text>
              <Switch value={true} trackColor={{ true: "#3b82f6" }} thumbColor="#fff" />
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
              <Switch value={true} trackColor={{ true: "#3b82f6" }} thumbColor="#fff" />
            </View>
            <View style={styles.statRow}>
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
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Public API Access</Text>
              <Switch value={false} trackColor={{ false: "#D0BDB3" }} thumbColor="#fff" />
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
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Memory Usage</Text>
              <Text style={styles.statValue}>68% (11GB/16GB)</Text>
            </View>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.push("/super-admin/settings/restart" as any)}
            >
              <Text style={styles.primaryBtnText}>Restart Services</Text>
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
              <tab.icon size={18} color={activeTab === tab.id ? "#3b82f6" : "#8A6B5D"} style={{ marginRight: 8 }} />
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
    padding: isMobile ? 16 : 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E6D8D2",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A0522D",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8A6B5D",
    marginTop: 4,
  },
  tabContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E6D8D2",
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#8A6B5D",
  },
  activeTabText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  contentContainer: {
    padding: isMobile ? 16 : 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: isMobile ? 16 : 24,
    borderWidth: 1,
    borderColor: "#E6D8D2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#A0522D",
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F4A460",
  },
  statLabel: {
    fontSize: 15,
    color: "#705244",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#A0522D",
  },
  primaryBtn: {
    backgroundColor: "#F4A460",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E59551",
  },
  primaryBtnText: {
    color: "#C4412B",
    fontWeight: "600",
    fontSize: 15,
  },
});
