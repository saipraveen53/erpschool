import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform
} from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter, usePathname } from "expo-router";
import * as Icons from 'lucide-react-native';

const menuConfig = [
  { title: 'Dashboard', icon: 'LayoutDashboard', id: 'index', path: '/principal' },

  {
    title: 'Students',
    icon: 'Users',
    id: 'students',
    path: '/principal/students',
    children: [
      { title: 'Student Profiles', path: '/principal/students' },
            { title: 'Student Attendance', path: '/principal/students/studentattendance' },
      { title: 'Discipline Logs', path: '/principal/students/discipline' }
    ]
  },

  {
    title: 'Staff Management',
    icon: 'Briefcase',
    id: 'staff',
    path: '/principal/staff',
    children: [
      { title: 'All Staff', path: '/principal/staff' },
      { title: 'Staff Attendance', path: '/principal/staff/staffattendance' },
      { title: 'Leave Requests', path: '/principal/staff/leave-requests' }
    ]
  },

  {
    title: 'Reports',
    icon: 'BarChart3',
    id: 'reports',
    path: '/principal/reports',
    children: [
      { title: 'Academic Reports', path: '/principal/reports/' },
      { title: 'Attendance Reports', path: '/principal/reports/attendance' },
      { title: 'Finance Reports', path: '/principal/reports/finance' }
    ]
  },

  { title: 'Academics & Timetable', icon: 'Calendar', id: 'timetable', path: '/principal/timetable' },
  { title: 'Holidays & Calendar', icon: 'Calendar', id: 'holidays', path: '/principal/academics/holidays' },
{
  title: 'Examinations',
  icon: 'FileSpreadsheet',
  id: 'examinations',
  path: '/principal/examinations',
  children: [
    { title: 'Hall Tickets and Exams', path: '/principal/examinations' }
  ]
},

  { title: 'Communication', icon: 'Megaphone', id: 'communication', path: '/principal/communication' },
    { title: 'Fee Management', icon: 'Megaphone', id: 'fee', path: '/principal/Fee_monitoring/fee' },
   { title: 'Transport', icon: 'Bus', id: 'transport', path: '/principal/transport/bus' }
];

export default function PrincipalLayout() {
  const { width } = useWindowDimensions();
  const [openDrawer, setOpenDrawer] = useState(false);

  // ✅ SINGLE STATE FOR ALL DROPDOWNS
  const [openDropdown, setOpenDropdown] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  const isLargeScreen = width >= 768;

  const renderIcon = (iconName, color = '#bc9e82', size = 20) => {
    const IconComponent = Icons[iconName] || Icons.HelpCircle;
    return <IconComponent color={color} size={size} strokeWidth={2} />;
  };

  const renderSidebarContent = () => (
    <SafeAreaView style={styles.sidebarContainer} edges={['top', 'bottom', 'left']}>

      {/* HEADER */}
      <View style={styles.brandHeader}>
        <View style={styles.logoPlaceholder}>
          <Icons.Grid color="#fff" size={16} />
        </View>
        <Text style={styles.brandText}>SVPS <Text style={styles.brandHighlight}>ERP</Text></Text>
      </View>

      {/* MENU */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {menuConfig.map((item) => {
          const hasChildren = !!item.children;
          const isActive = pathname === item.path;
          const isOpen = openDropdown === item.id;

          return (
            <View key={item.id} style={styles.menuGroupContainer}>

              {/* PARENT ITEM */}
              <TouchableOpacity
                style={[styles.menuItem, isActive && styles.activeMenuItem]}
                onPress={() => {
                  if (hasChildren) {
                    setOpenDropdown(isOpen ? null : item.id);
                  } else {
                    router.push(item.path);
                    if (!isLargeScreen) setOpenDrawer(false);
                  }
                }}
              >
                <View style={styles.menuItemLeft}>
                  {renderIcon(item.icon, isActive ? '#E35336' : '#dcbfa6')}
                  <Text style={[styles.menuItemText, isActive && styles.activeMenuText]}>
                    {item.title}
                  </Text>
                </View>

                {hasChildren && (
                  isOpen
                    ? <Icons.ChevronDown size={16} color="#dcbfa6" />
                    : <Icons.ChevronRight size={16} color="#dcbfa6" />
                )}
              </TouchableOpacity>

              {/* DROPDOWN */}
              {hasChildren && isOpen && (
                <View style={styles.subMenuBox}>
                  {item.children.map((subItem) => {
                    const isSubActive = pathname === subItem.path;

                    return (
                      <TouchableOpacity
                        key={subItem.path}
                        style={[styles.subMenuItem, isSubActive && styles.activeSubMenuItem]}
                        onPress={() => {
                          router.push(subItem.path);
                          if (!isLargeScreen) setOpenDrawer(false);
                        }}
                      >
                        <Text style={[styles.subMenuItemText, isSubActive && styles.activeSubMenuText]}>
                          • {subItem.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.sidebarFooter}>
      

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.replace("/login")}
        >
          {renderIcon('LogOut', '#E35336', 18)}
          <Text style={[styles.footerButtonText, { color: '#E35336' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );

  return (
    <View style={styles.appContainer}>
      <Drawer
        open={openDrawer}
        onOpen={() => setOpenDrawer(true)}
        onClose={() => setOpenDrawer(false)}
        drawerType={isLargeScreen ? 'permanent' : 'front'}
        drawerStyle={{ width: 260 }}
        renderDrawerContent={renderSidebarContent}
      >
        <View style={styles.mainContentWrapper}>

          {/* NAVBAR */}
          <SafeAreaView style={styles.navbarContainer}>
            <View style={styles.navbarInner}>

              <View style={styles.navbarLeft}>
                {!isLargeScreen && (
                  <TouchableOpacity onPress={() => setOpenDrawer(true)}>
                    <Icons.Menu color="#A0522D" size={24} />
                  </TouchableOpacity>
                )}
                <Text style={styles.navbarTitle}>Principal Workspace</Text>
              </View>

              <View style={styles.navbarRight}>
              
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>P</Text>
                </View>
              </View>

            </View>
          </SafeAreaView>

          {/* CONTENT */}
          <View style={styles.pageWorkspace}>
            <Slot />
          </View>

        </View>
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#F5F5DC' }, // Master background is Light Beige
  mainContentWrapper: { flex: 1 },
  navbarContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#F4A460', // Border bottom accent uses Sandy Orange
    ...Platform.select({
      ios: { shadowColor: '#A0522D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 3 }
    })
  },
  navbarInner: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  navbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navbarTitle: { fontSize: 18, fontWeight: '700', color: '#A0522D' }, // Titles use Sienna Brown
  navbarRight: { flexDirection: 'row', alignItems: 'center', gap: 16, marginLeft: 'auto' },
  iconButton: { padding: 6 },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E35336', alignItems: 'center', justifyContent: 'center' }, // Avatar base is Coral Red
  avatarText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  
  /* --- WARM EARTH SIDEBAR SYSTEM --- */
  sidebarContainer: { flex: 1, backgroundColor: '#2d180d' }, // Deep Rich Sienna Variant Background
  brandHeader: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#422414' },
  logoPlaceholder: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#E35336', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  brandText: { fontSize: 20, fontWeight: '700', color: '#ffffff' },
  brandHighlight: { color: '#F4A460' }, // Branding highlight is Sandy Orange
  scrollContent: { paddingVertical: 12, paddingHorizontal: 12 },
  menuGroupContainer: { marginBottom: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8 },
  activeMenuItem: { backgroundColor: '#422414' }, // Highlighted cell background variant
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuItemText: { fontSize: 15, fontWeight: '500', color: '#dcbfa6' },
  activeMenuText: { color: '#ffffff', fontWeight: '700' },
  
  /* Sub-menu Box Styles */
  subMenuBox: { backgroundColor: '#1f1008', borderRadius: 8, marginTop: 2, paddingLeft: 12, paddingVertical: 4 },
  subMenuItem: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6, marginVertical: 1 },
  activeSubMenuItem: { backgroundColor: '#2d180d' },
  subMenuItemText: { fontSize: 14, color: '#bc9e82', fontWeight: '500' },
  activeSubMenuText: { color: '#F4A460', fontWeight: '700' }, // Active child highlights in Sandy Orange
  
  sidebarFooter: { padding: 16, borderTopWidth: 1, borderTopColor: '#422414', gap: 8 },
  footerButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12 },
  footerButtonText: { fontSize: 14, fontWeight: '500', color: '#bc9e82' },
  pageWorkspace: { flex: 1, backgroundColor: '#F5F5DC' }, // Light Beige workspace wrap
});