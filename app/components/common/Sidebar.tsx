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

  // LOGIC FIX: Mobile lo matrame motham close avvali. Desktop lo icons state ki vellali.
  if (isMobile && !isOpen) return null;

  // Collapse logic for Desktop
  const isCollapsed = !isMobile && !isOpen;
  const sidebarWidth = isMobile ? 260 : (isOpen ? 260 : 88); // Expanded: 260px, Collapsed: 88px

  return (
    <>
      {isMobile && isOpen && (
        <Pressable style={styles.backdrop} onPress={onClose} />
      )}

      <View 
        style={[
          styles.sidebarContainer, 
          isMobile && styles.sidebarMobile,
          { width: sidebarWidth },
          Platform.OS === 'web' && { transition: 'width 0.3s ease' } as any // Smooth collapse transition
        ]}
      >
        
        {isMobile && (
          <View style={styles.mobileHeader}>
            <Text style={styles.mobileTitle}>Navigation</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#4B49AC" />
            </Pressable>
          </View>
        )}

        <ScrollView style={styles.scrollArea} contentContainerStyle={[styles.scrollContent, isCollapsed && styles.scrollContentCollapsed]}>
          {!isCollapsed && <Text style={styles.menuLabel}>MAIN MENU</Text>}
          
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            
            // EXPO ROUTER PATH MATCHING FIX:
            const normalizedPath = link.path.replace('/(dashboard)', '');
            const pathSegments = normalizedPath.split('/'); 
            
            // Extract the base module to keep it active even in sub-pages
            const baseModulePath = pathSegments.length > 2 ? `/${pathSegments[1]}/${pathSegments[2]}` : normalizedPath;

            let isActive = false;
            if (pathSegments.length === 2) { 
              isActive = pathname === normalizedPath || pathname === `${normalizedPath}/`;
            } else {
              isActive = pathname.startsWith(baseModulePath);
            }

            return (
              <Pressable
                key={index}
                onPress={() => handleNavigation(link.path)}
                style={[
                  styles.navItem,
                  isActive && styles.navItemActive,
                  isCollapsed && styles.navItemCollapsed,
                  Platform.OS === 'web' && { transition: 'all 0.2s ease' } as any
                ]}
              >
                <View style={[styles.activeIndicator, isActive && styles.activeIndicatorVisible]} />
                <Icon size={22} color={isActive ? "#4B49AC" : "#64748B"} />
                {!isCollapsed && (
                  <Text style={[styles.navText, isActive && styles.navTextActive]} numberOfLines={1}>
                    {link.title}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* LOGOUT SECTION AT BOTTOM */}
        <View style={[styles.sidebarFooter, isCollapsed && styles.sidebarFooterCollapsed]}>
          <Pressable 
            onPress={handleLogout} 
            style={({ pressed }) => [
              styles.logoutButton,
              isCollapsed && styles.logoutButtonCollapsed,
              pressed && { opacity: 0.8 }
            ]}
          >
            <LogOut size={20} color="#DC2626" />
            {!isCollapsed && <Text style={styles.logoutText}>Log Out</Text>}
          </Pressable>
          {!isCollapsed && <Text style={styles.footerVersion}>Edvance v1.0.0</Text>}
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
    zIndex: 90,
  },
  sidebarContainer: {
    backgroundColor: '#FFFFFF', 
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6', 
    height: '100%',
    zIndex: 100,
    flexDirection: 'column',
    overflow: 'hidden', // IMPORTANT: Prevents text from spilling out when collapsed
  },
  sidebarMobile: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mobileTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4B49AC', 
  },
  closeButton: {
    padding: 6,
    backgroundColor: 'rgba(152, 189, 255, 0.15)', 
    borderRadius: 8,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  scrollContentCollapsed: {
    paddingHorizontal: 12, // Reduced padding for collapsed state
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF', 
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
    backgroundColor: 'rgba(75, 73, 172, 0.08)', 
  },
  navItemCollapsed: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: 4,
    backgroundColor: '#4B49AC', 
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
    color: '#64748B', 
    flex: 1,
  },
  navTextActive: {
    color: '#4B49AC', 
    fontWeight: '800',
  },
  sidebarFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  sidebarFooterCollapsed: {
    paddingHorizontal: 16,
    alignItems: 'center',
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
  logoutButtonCollapsed: {
    paddingHorizontal: 0,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#DC2626', 
    fontSize: 15,
    fontWeight: '700',
  },
  footerVersion: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '600',
  },
});