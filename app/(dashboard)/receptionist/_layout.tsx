import { Slot, usePathname, useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { 
  Platform, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  useWindowDimensions,
  StatusBar,
  Pressable
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SIDEBAR_ITEMS = [
  { label: 'Admissions Panel', route: '/receptionist/admissions/inquiries', icon: 'document-text-outline' },
  { label: 'Appointments', route: '/receptionist/appointments/scheduling', icon: 'calendar-outline' },
  { label: 'Communication Hub', route: '/receptionist/communication/front-desk', icon: 'chatbubble-outline' },
  { label: 'Inquiries Log', route: '/receptionist', icon: 'search-outline' },
  { label: 'Visitor Tracker', route: '/receptionist/visitors/management', icon: 'shield-checkmark-outline' },
];

function SidebarInner({ searchQuery, setSearchQuery, isItemActive, handleNavigation }: any) {
  return (
    <View style={styles.sidebarWrapper}>
      <View style={styles.sidebarHeader}>
        <View style={styles.brandIconWrapper}>
          <Ionicons name="school" size={24} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.sidebarBrandText}>SVPS <Text style={styles.brandHighlightText}>ERP</Text></Text>
          <Text style={styles.sidebarRoleBadge}>Reception Console</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInputField}
          placeholder="Search panels..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.navigationScrollBody} showsVerticalScrollIndicator={false}>
        <Text style={styles.menuSectionHeader}>CONSOLE PANELS</Text>
        {SIDEBAR_ITEMS.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
          const active = isItemActive(item.route);
          return (
            <TouchableOpacity key={item.route} style={[styles.navListItem, active && styles.navListItemActive]} onPress={() => handleNavigation(item.route)}>
              <Ionicons name={item.icon as any} size={20} color={active ? '#0EA5E9' : '#CBD5E1'} style={styles.navItemIcon} />
              <Text style={[styles.navListItemText, active && styles.navListItemTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.sidebarFooter}>
        <View style={styles.profileCardWrapper}>
          <View style={styles.profileAvatarBubble}><Text style={styles.profileAvatarInitials}>RD</Text></View>
          <View style={styles.profileDetailsMeta}>
            <Text style={styles.profileUserName}>Reception Desk</Text>
            <Text style={styles.profileUserRole}>Front Desk Operator</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ReceptionistLayout() {
  const router = useRouter();
  const currentPathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const isItemActive = (route: string) => currentPathname.startsWith(route);
  const isItemActive = (route: string) => {
  if (route === '/receptionist') {
    return currentPathname === '/receptionist';
  }

  return currentPathname === route;
};
  const handleNavigation = (route: string) => { router.replace(route as any); setIsMobileMenuOpen(false); };

  return (
    <View style={[styles.masterContainer, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {isMobile && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => setIsMobileMenuOpen(true)}>
            <Ionicons name="menu" size={26} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.mobileHeaderTitle}>SVPS ERP</Text>
        </View>
      )}

      <View style={styles.layoutBody}>
        {!isMobile && <SidebarInner {...{searchQuery, setSearchQuery, isItemActive, handleNavigation}} />}
        
        <View style={styles.viewscreenContentArea}>
          <Slot />
        </View>
      </View>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <View style={styles.mobileOverlay}>
          <SidebarInner {...{searchQuery, setSearchQuery, isItemActive, handleNavigation}} />
          <Pressable style={styles.backdrop} onPress={() => setIsMobileMenuOpen(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  layoutBody: { flex: 1, flexDirection: 'row' },
  sidebarWrapper: { width: 280, backgroundColor: '#0F172A', padding: 20, height: '100%' },
  mobileOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, flexDirection: 'row' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  
  // Sidebar styling
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  brandIconWrapper: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#1E2937', justifyContent: 'center', alignItems: 'center' },
  sidebarBrandText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  brandHighlightText: { color: '#60A5FA' },
  sidebarRoleBadge: { fontSize: 11, color: '#94A3B8' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E2937', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 20 },
  searchInputField: { flex: 1, color: '#E2E8F0', fontSize: 14 },
  menuSectionHeader: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 10, paddingHorizontal: 8, textTransform: 'uppercase' },
  navigationScrollBody: { flex: 1 },
  navListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4 },
  navListItemActive: { backgroundColor: '#1E2937' },
  navItemIcon: { marginRight: 12 },
  navListItemText: { fontSize: 14, fontWeight: '500', color: '#CBD5E1' },
  navListItemTextActive: { color: '#FFFFFF', fontWeight: '600' },
  sidebarFooter: { marginTop: 'auto', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#1E2937' },
  profileCardWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  profileAvatarBubble: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#60A5FA', justifyContent: 'center', alignItems: 'center' },
  profileAvatarInitials: { color: '#0F172A', fontWeight: '800', fontSize: 14 },
  profileDetailsMeta: { flex: 1 },
  profileUserName: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  profileUserRole: { color: '#94A3B8', fontSize: 11 },
  
  mobileHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  mobileHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginLeft: 16 },
  viewscreenContentArea: { flex: 1 },
});