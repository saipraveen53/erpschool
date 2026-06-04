import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationsData from '../data/notifications.json';

export interface Notification {
  id: string;
  role: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'read_notifications';

// Helper to get read IDs from AsyncStorage
const getReadIds = async (): Promise<Set<string>> => {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return new Set(stored ? JSON.parse(stored) : []);
};

const saveReadIds = async (ids: Set<string>) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
};

// Fetch notifications for current role
export const getNotificationsForRole = async (role: string): Promise<Notification[]> => {
  const readIds = await getReadIds();
  const all = notificationsData as Notification[];
  const filtered = all.filter(n => n.role === role);
  // mark read status from storage
  return filtered.map(n => ({ ...n, read: readIds.has(n.id) }));
};

// Mark a single notification as read
export const markAsRead = async (notificationId: string): Promise<void> => {
  const readIds = await getReadIds();
  readIds.add(notificationId);
  await saveReadIds(readIds);
};

// Mark all notifications as read for current role
export const markAllAsRead = async (role: string): Promise<void> => {
  const all = notificationsData as Notification[];
  const roleNotifications = all.filter(n => n.role === role);
  const readIds = await getReadIds();
  roleNotifications.forEach(n => readIds.add(n.id));
  await saveReadIds(readIds);
};

// Get unread count for a role
export const getUnreadCountForRole = async (role: string): Promise<number> => {
  const readIds = await getReadIds();
  const all = notificationsData as Notification[];
  const roleNotifications = all.filter(n => n.role === role);
  return roleNotifications.filter(n => !readIds.has(n.id)).length;
};