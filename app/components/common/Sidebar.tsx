import { usePathname, useRouter } from 'expo-router';
import {
    BookOpen,
    FileText,
    LayoutDashboard,
    LogOut,
    LucideIcon,
    ShieldAlert,
    UserCheck,
    X
} from 'lucide-react-native';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

type NavLink = { title: string; path: string; icon: LucideIcon };

export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  // Dynamically load links based on user role
  const getNavLinks = (): NavLink[] => {
    const role = user?.role?.toUpperCase() || '';

    switch (role) {
      case 'VICE_PRINCIPAL':
        return [
          { title: 'Dashboard', path: '/(dashboard)/vice-principal', icon: LayoutDashboard },
          { title: 'Academics', path: '/(dashboard)/vice-principal/academics/monitoring', icon: BookOpen },
          { title: 'Attendance', path: '/(dashboard)/vice-principal/attendance/verification', icon: UserCheck },
          { title: 'Discipline', path: '/(dashboard)/vice-principal/discipline', icon: ShieldAlert },
          { title: 'Examinations', path: '/(dashboard)/vice-principal/examinations/supervision', icon: FileText },
        ];
      // Add cases for other roles like PRINCIPAL, ADMIN here in the future
      default:
        return [
          { title: 'Dashboard', path: `/(dashboard)/${role.toLowerCase().replace('_', '-')}`, icon: LayoutDashboard }
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleNavigation = (path: string) => {
    router.push(path as any);
    if (isMobile) onClose();
  };

  if (isMobile && !isOpen) return null;

  return (
    <>
      {isMobile && isOpen && (
        <Pressable style={styles.backdrop} onPress={onClose} />
      )}

      <View style={[styles.sidebarContainer, isMobile && styles.sidebarMobile]}>
        
        {isMobile && (
          <View style={styles.mobileHeader}>
            <Text style={styles.mobileTitle}>Navigation</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#5C2E14" />
            </Pressable>
          </View>
        )}

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.menuLabel}>MAIN MENU</Text>
          
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            
            // EXPO ROUTER PATH MATCHING FIX:
            // pathname removes the group '(dashboard)', so we normalize our link.path
            const normalizedPath = link.path.replace('/(dashboard)', '');
            const pathSegments = normalizedPath.split('/'); 
            
            // Extract the base module (e.g., '/vice-principal/academics') to keep it active even in sub-pages
            const baseModulePath = pathSegments.length > 2 ? `/${pathSegments[1]}/${pathSegments[2]}` : normalizedPath;

            let isActive = false;
            if (pathSegments.length === 2) { 
              // This is the Dashboard root exact match (e.g., '/vice-principal')
              isActive = pathname === normalizedPath || pathname === `${normalizedPath}/`;
            } else {
              // This is a sub-module (e.g., '/vice-principal/academics/monitoring')
              isActive = pathname.startsWith(baseModulePath);
            }

            return (
              <Pressable
                key={index}
                onPress={() => handleNavigation(link.path)}
                style={[
                  styles.navItem,
                  isActive && styles.navItemActive,
                  Platform.OS === 'web' && { transition: 'all 0.2s ease' } as any
                ]}
              >
                <View style={[styles.activeIndicator, isActive && styles.activeIndicatorVisible]} />
                <Icon size={22} color={isActive ? "#E35336" : "#7A5A4A"} />
                <Text style={[styles.navText, isActive && styles.navTextActive]}>
                  {link.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* LOGOUT SECTION AT BOTTOM */}
        <View style={styles.sidebarFooter}>
          <Pressable 
            onPress={handleLogout} 
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && { opacity: 0.8 }
            ]}
          >
            <LogOut size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
          <Text style={styles.footerVersion}>Edvance v1.0.0</Text>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(42, 19, 8, 0.6)', 
    zIndex: 90,
  },
  sidebarContainer: {
    width: 260,
    backgroundColor: '#FFFCF8', 
    borderRightWidth: 1,
    borderRightColor: '#E8D5C4',
    height: '100%',
    zIndex: 100,
    flexDirection: 'column',
  },
  sidebarMobile: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    shadowColor: '#2A1308',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
  },
  mobileTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5C2E14',
  },
  closeButton: {
    padding: 6,
    backgroundColor: 'rgba(244, 164, 96, 0.2)',
    borderRadius: 8,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A88D7D',
    marginBottom: 16,
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 6,
    gap: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: 'rgba(227, 83, 54, 0.08)', 
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: 4,
    backgroundColor: '#E35336', 
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    opacity: 0,
  },
  activeIndicatorVisible: {
    opacity: 1,
  },
  navText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7A5A4A',
  },
  navTextActive: {
    color: '#E35336', 
    fontWeight: '800',
  },
  sidebarFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C4',
    backgroundColor: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    backgroundColor: '#FEF2F2', 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 16,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },
  footerVersion: {
    fontSize: 11,
    color: '#A88D7D',
    textAlign: 'center',
    fontWeight: '600',
  },
});