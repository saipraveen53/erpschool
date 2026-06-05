import { AlertCircle, Bell, Calendar, CheckCircle, Menu, Search, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuPress: () => void;
  isMobile: boolean;
}

export default function Header({ onMenuPress, isMobile }: HeaderProps) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Format role string beautifully (e.g., VICE_PRINCIPAL -> Vice Principal)
  const formatRole = (role?: string) => {
    if (!role) return 'Vice Principal'; // Defaulting to Vice Principal for Demo
    return role.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  // Convert Notifications to State to allow deletion
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Staff Leave Request',
      message: 'Mr. Rajesh (Math Dept) requested 2 days leave.',
      time: '10 mins ago',
      type: 'leave',
      unread: true,
    },
    {
      id: '2',
      title: 'Discipline Alert',
      message: 'Incident reported in Class IX-B by Class Teacher.',
      time: '1 hour ago',
      type: 'alert',
      unread: true,
    },
    {
      id: '3',
      title: 'Exam Schedule',
      message: 'Mid-term schedule drafted. Needs your final approval.',
      time: '3 hours ago',
      type: 'academic',
      unread: false,
    },
  ]);

  const hasUnread = notifications.some(n => n.unread);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'leave': return <Calendar size={18} color="#7978E9" />;
      case 'alert': return <AlertCircle size={18} color="#F3797E" />;
      case 'academic': return <CheckCircle size={18} color="#7DA0FA" />;
      default: return <Bell size={18} color="#4B49AC" />;
    }
  };

  // Function to delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Function to mark notification as read when clicked
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, unread: false } : notif)
    );
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        {/* Hamburger Menu - Visible always for sidebar toggle */}
        <Pressable onPress={onMenuPress} style={styles.menuButton}>
          <Menu size={24} color="#4B49AC" />
        </Pressable>
        
        {/* Brand/Role Title */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>
            Edvance<Text style={styles.brandHighlight}>.</Text> ERP
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{formatRole(user?.role)}</Text>
          </View>
        </View>
      </View>

      {/* Middle Section - Search Bar (Hidden on Mobile to save space) */}
      {!isMobile && (
        <View style={styles.middleSection}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#9CA3AF" />
            <TextInput
              style={[styles.searchInput, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              placeholder="Search now"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      )}

      <View style={styles.rightSection}>
        {/* Notification Bell & Dropdown Wrapper */}
        <View style={{ position: 'relative' }}>
          <Pressable 
            style={styles.iconButton} 
            onPress={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={22} color="#4B49AC" />
            {hasUnread && <View style={styles.notificationDot} />}
          </Pressable>

          {/* Notification Modal / Dropdown */}
          {showNotifications && (
            <View style={styles.notificationDropdown}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifHeaderText}>Notifications ({notifications.length})</Text>
                <Pressable onPress={() => setShowNotifications(false)}>
                  <X size={20} color="#4B49AC" />
                </Pressable>
              </View>
              
              <ScrollView style={styles.notifScroll} showsVerticalScrollIndicator={false}>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <Pressable 
                      key={notif.id} 
                      onPress={() => markAsRead(notif.id)}
                      style={[styles.notifItem, notif.unread && styles.notifItemUnread]}
                    >
                      <View style={styles.notifIconBox}>
                        {getNotifIcon(notif.type)}
                      </View>
                      
                      <View style={styles.notifContent}>
                        <View style={styles.notifTitleRow}>
                          <Text style={styles.notifTitle}>{notif.title}</Text>
                          {notif.unread && <View style={styles.unreadIndicator} />}
                        </View>
                        <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
                        <Text style={styles.notifTime}>{notif.time}</Text>
                      </View>

                      {/* Delete Action Button */}
                      <Pressable 
                        style={styles.deleteBtn}
                        onPress={() => deleteNotification(notif.id)}
                      >
                        <Trash2 size={16} color="#9CA3AF" />
                      </Pressable>
                    </Pressable>
                  ))
                ) : (
                  <View style={styles.emptyNotifContainer}>
                    <Bell size={32} color="#E5E7EB" style={{ marginBottom: 8 }} />
                    <Text style={styles.emptyNotifText}>You're all caught up!</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
        
        <View style={styles.divider} />
        
        {/* Profile Section */}
        <Pressable style={styles.profileSection}>
          {/* Fixed Dummy Profile Image */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' }} 
            style={styles.profileImage} 
          />
          {!isMobile && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Aamir Khan'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'vp@school.com'}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 75,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 50,
    ...(Platform.OS === 'web' ? { position: 'sticky', top: 0 } : {}),
  },
  
  // Left Section Styles
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: 260, 
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(152, 189, 255, 0.15)', 
  },
  brandContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4B49AC',
    letterSpacing: -0.5,
  },
  brandHighlight: {
    color: '#7DA0FA', 
  },
  roleBadge: {
    backgroundColor: 'rgba(121, 120, 233, 0.1)', 
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(121, 120, 233, 0.2)',
  },
  roleText: {
    fontSize: 10,
    color: '#7978E9', 
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Middle Section (Search Bar)
  middleSection: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 42,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#4B49AC',
    fontWeight: '500',
  },

  // Right Section Styles
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
    backgroundColor: 'rgba(152, 189, 255, 0.15)', 
    borderRadius: 12,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: '#F3797E', 
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  // Notification Modal Styles
  notificationDropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#4B49AC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    zIndex: 100,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  notifHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B49AC',
  },
  notifScroll: {
    maxHeight: 300,
  },
  notifItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'flex-start',
  },
  notifItemUnread: {
    backgroundColor: 'rgba(125, 160, 250, 0.05)', 
  },
  notifIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(152, 189, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
    paddingRight: 8,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B49AC',
  },
  unreadIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3797E',
  },
  notifMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignSelf: 'center',
  },
  emptyNotifContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyNotifText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B49AC',
  },
  userEmail: {
    fontSize: 12,
    color: '#7978E9',
    fontWeight: '500',
  },
});