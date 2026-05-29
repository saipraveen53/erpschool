import { Slot, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  Platform, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SIDEBAR_ITEMS = [
  { label: 'Admissions Panel', route: '/receptionist/admissions/inquiries', icon: 'document-text-outline' },
  { label: 'Appointments', route: '/receptionist/appointments/scheduling', icon: 'calendar-outline' },
  { label: 'Communication Hub', route: '/receptionist/communication/front-desk', icon: 'chatbubble-outline' },
  { label: 'Inquiries Log', route: '/receptionist', icon: 'search-outline' },
  { label: 'Visitor Tracker', route: '/receptionist/visitors/management', icon: 'shield-checkmark-outline' },
];

export default function ReceptionistLayout() {
  const router = useRouter();
  const currentPathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isItemActive = (route: string) => {
    if (route === '/receptionist') {
      return currentPathname === '/receptionist' || currentPathname === '/receptionist/';
    }
    return currentPathname.startsWith(route);
  };

  const filteredSidebarItems = SIDEBAR_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigation = (route: string) => {
    router.replace(route as any);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  return (
    <View style={styles.masterContainer}>
      {/* Sidebar - Web + Mobile Overlay */}
      {((Platform.OS === 'web' && !isMobile) || isMobileMenuOpen) && (
        <View style={[
          styles.sidebarWrapper, 
          isMobile && styles.mobileSidebarOverlay
        ]}>
          {/* Header */}
          <View style={styles.sidebarHeader}>
            <View style={styles.brandIconWrapper}>
              <Ionicons name="school" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.sidebarBrandText}>SVPS <Text style={styles.brandHighlightText}>ERP</Text></Text>
              <Text style={styles.sidebarRoleBadge}>Reception Console</Text>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInputField}
              placeholder="Search panels..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Navigation */}
          <ScrollView style={styles.navigationScrollBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.menuSectionHeader}>CONSOLE PANELS</Text>
            {filteredSidebarItems.map((item) => {
              const active = isItemActive(item.route);
              return (
                <TouchableOpacity
                  key={item.route}
                  style={[styles.navListItem, active && styles.navListItemActive]}
                  onPress={() => handleNavigation(item.route)}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={20} 
                    color={active ? '#0EA5E9' : '#CBD5E1'} 
                    style={styles.navItemIcon} 
                  />
                  <Text style={[styles.navListItemText, active && styles.navListItemTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer Profile */}
          <View style={styles.sidebarFooter}>
            <TouchableOpacity style={styles.profileCardWrapper}>
              <View style={styles.profileAvatarBubble}>
                <Text style={styles.profileAvatarInitials}>RD</Text>
              </View>
              <View style={styles.profileDetailsMeta}>
                <Text style={styles.profileUserName}>Reception Desk</Text>
                <Text style={styles.profileUserRole}>Front Desk Operator</Text>
              </View>
              <Ionicons name="settings-outline" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Mobile Hamburger Menu Button */}
      {isMobile && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity 
            style={styles.hamburgerButton} 
            onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Ionicons 
              name={isMobileMenuOpen ? "close" : "menu"} 
              size={26} 
              color="#0F172A" 
            />
          </TouchableOpacity>
          <Text style={styles.mobileHeaderTitle}>SVPS ERP</Text>
        </View>
      )}

      {/* Main Content Area */}
      <View style={[
        styles.viewscreenContentArea, 
        isMobile && isMobileMenuOpen && styles.mobileContentDimmed
      ]}>
        <Slot />
      </View>
    </View>
  );
}

// Responsive Professional Sidebar Styling
const styles = StyleSheet.create({
  masterContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: '#F8FAFC' 
  },

  // Sidebar
  sidebarWrapper: { 
    width: 280, 
    backgroundColor: '#0F172A', 
    paddingHorizontal: 18, 
    paddingVertical: 24,
    borderRightWidth: 1,
    borderRightColor: '#1E2937',
    zIndex: 10,
  },
  mobileSidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },

  sidebarHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 28, 
    gap: 14 
  },
  brandIconWrapper: { 
    width: 42, 
    height: 42, 
    borderRadius: 10, 
    backgroundColor: '#1E2937', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sidebarBrandText: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#FFFFFF',
    letterSpacing: -0.5 
  },
  brandHighlightText: { color: '#60A5FA' },
  sidebarRoleBadge: { 
    fontSize: 12, 
    color: '#94A3B8', 
    marginTop: 2 
  },

  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1E2937', 
    borderRadius: 12, 
    paddingHorizontal: 14, 
    height: 44,
    marginBottom: 24 
  },
  searchInputField: { 
    flex: 1, 
    color: '#E2E8F0', 
    fontSize: 14.5,
    ...Platform.select({ web: { outlineStyle: 'none' } as any })
  },

  menuSectionHeader: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#64748B', 
    marginBottom: 12, 
    paddingHorizontal: 12, 
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },

  navigationScrollBody: { flex: 1 },

  navListItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 13, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    marginBottom: 4 
  },
  navListItemActive: { 
    backgroundColor: '#1E2937',
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9'
  },
  navItemIcon: { marginRight: 14 },
  navListItemText: { 
    fontSize: 14.5, 
    fontWeight: '500', 
    color: '#CBD5E1' 
  },
  navListItemTextActive: { 
    color: '#FFFFFF', 
    fontWeight: '600' 
  },

  sidebarFooter: { 
    marginTop: 'auto', 
    paddingTop: 20, 
    borderTopWidth: 1, 
    borderColor: '#1E2937' 
  },
  profileCardWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 12,
    backgroundColor: '#1E2937',
    gap: 12 
  },
  profileAvatarBubble: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#60A5FA', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileAvatarInitials: { 
    color: '#0F172A', 
    fontWeight: '700', 
    fontSize: 15 
  },
  profileDetailsMeta: { flex: 1 },
  profileUserName: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  profileUserRole: { 
    color: '#94A3B8', 
    fontSize: 12 
  },

  // Mobile Header
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 50,
  },
  hamburgerButton: {
    padding: 8,
    marginRight: 12,
  },
  mobileHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Main Content
  viewscreenContentArea: { 
    flex: 1,
  },
  mobileContentDimmed: {
    opacity: 0.6,
  },
});