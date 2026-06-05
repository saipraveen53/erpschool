 
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle, ArrowLeft, Bell, CheckCheck, CheckCircle2, Info, XCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../contexts/AuthContext";
import { getNotificationsForRole, markAllAsRead, markAsRead, Notification } from "../../../services/notificationService";

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    if (!user?.role) return;
    const data = await getNotificationsForRole(user.role);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    if (!user?.role) return;
    await markAllAsRead(user.role);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    Alert.alert("Success", "All notifications marked as read");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 size={20} color="#10b981" />;
      case "warning": return <AlertTriangle size={20} color="#f59e0b" />;
      case "error": return <XCircle size={20} color="#ef4444" />;
      default: return <Info size={20} color="#3b82f6" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
    <ArrowLeft size={24} color="#111827" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Notifications</Text>
  {notifications.some(n => !n.read) && (
    <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
      <CheckCheck size={20} color="#3b82f6" />
    </TouchableOpacity>
  )}
</View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>No notifications</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.notificationCard, !item.read && styles.unreadCard]}
              onPress={() => !item.read && handleMarkRead(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>{getIcon(item.type)}</View>
              <View style={styles.contentContainer}>
                <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  header: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: "#fff",
  borderBottomWidth: 1,
  borderBottomColor: "#e5e7eb",
},
backBtn: { padding: 4, marginRight: 12 },
headerTitle: { fontSize: 20, fontWeight: "600", color: "#111827", flex: 1 },
markAllBtn: { padding: 8 },
  listContent: { padding: 16, gap: 12 },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadCard: {
    backgroundColor: "#eff6ff",
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  iconContainer: { marginRight: 12, marginTop: 2 },
  contentContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: "500", color: "#111827", marginBottom: 4 },
  unreadTitle: { fontWeight: "700", color: "#1e3a8a" },
  message: { fontSize: 14, color: "#4b5563", marginBottom: 6, lineHeight: 20 },
  time: { fontSize: 12, color: "#9ca3af" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3b82f6", alignSelf: "center", marginLeft: 8 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 80 },
  emptyText: { fontSize: 18, fontWeight: "500", color: "#374151", marginTop: 16 },
  emptySubtext: { fontSize: 14, color: "#9ca3af", marginTop: 8 },
});