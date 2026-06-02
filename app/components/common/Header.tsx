import { Bell, Menu, UserCircle } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuPress: () => void;
  isMobile: boolean;
}

export default function Header({ onMenuPress, isMobile }: HeaderProps) {
  const { user } = useAuth();

  // Format role string beautifully (e.g., VICE_PRINCIPAL -> Vice Principal)
  const formatRole = (role?: string) => {
    if (!role) return 'Staff';
    return role.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        {/* Hamburger Menu - Only visible on Mobile */}
        {isMobile && (
          <Pressable onPress={onMenuPress} style={styles.menuButton}>
            <Menu size={26} color="#5C2E14" />
          </Pressable>
        )}
        
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

      <View style={styles.rightSection}>
        <Pressable style={styles.iconButton}>
          <Bell size={22} color="#7A5A4A" />
          <View style={styles.notificationDot} />
        </Pressable>
        
        <View style={styles.divider} />
        
        <Pressable style={styles.profileSection}>
          <View style={styles.avatar}>
            <UserCircle size={32} color="#E35336" />
          </View>
          {!isMobile && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Admin User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'admin@school.com'}</Text>
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
    borderBottomColor: '#E8D5C4', // Soft warm border
    zIndex: 50,
    ...(Platform.OS === 'web' ? { position: 'sticky', top: 0 } : {}),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuButton: {
    padding: 8,
    marginLeft: -12,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 164, 96, 0.15)',
  },
  brandContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#5C2E14',
    letterSpacing: -0.5,
  },
  brandHighlight: {
    color: '#E35336',
  },
  roleBadge: {
    backgroundColor: 'rgba(227, 83, 54, 0.1)', // Soft terracotta background
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(227, 83, 54, 0.2)',
  },
  roleText: {
    fontSize: 10,
    color: '#E35336',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: '#E35336',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: 35,
    backgroundColor: '#E8D5C4',
    marginHorizontal: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: 'rgba(227, 83, 54, 0.1)',
    borderRadius: 20,
    padding: 2,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2A1308',
  },
  userEmail: {
    fontSize: 12,
    color: '#A0522D',
    fontWeight: '500',
  },
});