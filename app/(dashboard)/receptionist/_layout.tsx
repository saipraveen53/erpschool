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
  useWindowDimensions,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SIDEBAR_ITEMS = [
  { label: 'Admissions Panel', route: '/receptionist/admissions/inquiries', icon: 'document-text-outline' },
  { label: 'Appointments', route: '/receptionist/appointments/scheduling', icon: 'calendar-outline' },
  { label: 'Communication Hub', route: '/receptionist/communication/front-desk', icon: 'chatbubble-outline' },
  { label: 'Inquiries Log', route: '/receptionist', icon: 'search-outline' },
  { label: 'Visitor Tracker', route: '/receptionist/visitors/management', icon: 'shield-checkmark-outline' },
];

function SidebarInner({
  searchQuery,
  setSearchQuery,
  isItemActive,
  handleNavigation,
  handleProfileNavigation,
}: any) {
  return (
    <View style={styles.sidebarWrapper}>
      <View style={styles.sidebarHeader}>
        <View style={styles.brandIconWrapper}>
          <Ionicons name="school" size={24} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.sidebarBrandText}>
            Edvance. <Text style={styles.brandHighlightText}>ERP</Text>
          </Text>
          <Text style={styles.sidebarRoleBadge}>Reception Console</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={16}
          color="#4D3A30"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInputField}
          placeholder="Search panels..."
          placeholderTextColor="#A0938E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.navigationScrollBody}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.menuSectionHeader}>CONSOLE PANELS</Text>
        {SIDEBAR_ITEMS.filter((i) =>
          i.label.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((item) => {
          const active = isItemActive(item.route);
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navListItem, active && styles.navListItemActive]}
              onPress={() => handleNavigation(item.route)}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={active ? '#DC2626' : '#4D3A30'}
                style={styles.navItemIcon}
              />
              <Text
                style={[
                  styles.navListItemText,
                  active && styles.navListItemTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.sidebarFooter}>
        <TouchableOpacity
          style={styles.profileCardWrapper}
          activeOpacity={0.85}
          onPress={handleProfileNavigation}
        >
          <View style={styles.profileAvatarBubble}>
            <Text style={styles.profileAvatarInitials}>RD</Text>
          </View>

          <View style={styles.profileDetailsMeta}>
            <Text style={styles.profileUserName}>Reception Desk</Text>
            <Text style={styles.profileUserRole}>Front Desk Operator</Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#A0938E" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ReceptionistLayout() {
  const router = useRouter();
  const currentPathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isItemActive = (route: string) =>
    route === '/receptionist'
      ? currentPathname === '/receptionist'
      : currentPathname === route;

  const handleNavigation = (route: string) => {
    router.replace(route as any);
    setIsMobileMenuOpen(false);
  };

  const handleProfileNavigation = () => {
    router.push('/receptionist/profile/profile' as any);
    setIsMobileMenuOpen(false);
  };

  return (
    <SafeAreaView style={styles.masterContainer} edges={['top', 'left', 'right']}>
      <StatusBar
        translucent={false}
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      {isMobile && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => setIsMobileMenuOpen(true)}>
            <Ionicons name="menu" size={26} color="#f1f1f1" />
          </TouchableOpacity>
          <Text style={styles.mobileHeaderTitle}>Edvance. ERP</Text>
        </View>
      )}

      <View style={styles.layoutBody}>
        {!isMobile && (
          <SidebarInner
            {...{
              searchQuery,
              setSearchQuery,
              isItemActive,
              handleNavigation,
              handleProfileNavigation,
            }}
          />
        )}
        <View style={styles.viewscreenContentArea}>
          <Slot />
        </View>
      </View>

      {isMobileMenuOpen && (
        <View style={styles.mobileOverlay}>
          <SidebarInner
            {...{
              searchQuery,
              setSearchQuery,
              isItemActive,
              handleNavigation,
              handleProfileNavigation,
            }}
          />
          <Pressable
            style={styles.backdrop}
            onPress={() => setIsMobileMenuOpen(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  layoutBody: { flex: 1, flexDirection: 'row' },
  sidebarWrapper: {
    width: 280,
    backgroundColor: '#FFFFFF',
    padding: 20,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#F5EBE9',
  },
  mobileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    flexDirection: 'row',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  brandIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarBrandText: { fontSize: 18, fontWeight: '800', color: '#4D3A30' },
  brandHighlightText: { color: '#DC2626' },
  sidebarRoleBadge: { fontSize: 11, color: '#A0938E' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 20,
  },
  searchInputField: {
    flex: 1,
    color: '#4D3A30',
    fontSize: 14,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  menuSectionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0938E',
    marginBottom: 10,
    paddingHorizontal: 8,
    textTransform: 'uppercase',
  },
  navigationScrollBody: { flex: 1 },
  navListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  navListItemActive: { backgroundColor: '#FFF5F2' },
  navItemIcon: { marginRight: 12 },
  navListItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4D3A30',
  },
  navListItemTextActive: { color: '#DC2626', fontWeight: '600' },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F5EBE9',
  },
  profileCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileDetailsMeta: { flex: 1 },
  profileAvatarBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarInitials: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 14,
  },
  profileUserName: { color: '#4D3A30', fontSize: 13, fontWeight: '600' },
  profileUserRole: { color: '#A0938E', fontSize: 11 },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#DC2626',
    borderBottomWidth: 1,
    borderBottomColor: '#F5EBE9',
  },
  mobileHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f1f1',
    marginLeft: 16,
  },
  viewscreenContentArea: { flex: 1 },
});