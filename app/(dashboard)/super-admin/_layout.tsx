import { Slot, usePathname, useRouter } from "expo-router";
import {
  Bell,
  Building2,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Users,
  Menu,
  X
} from "lucide-react-native";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, useWindowDimensions, Platform, StatusBar } from "react-native";
import { useState } from "react";

export default function SuperAdminLayout() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, route: "/super-admin" },
    { name: "Schools", icon: Building2, route: "/super-admin/schools" },
    { name: "Users", icon: Users, route: "/super-admin/users" },
    { name: "Subscriptions", icon: CreditCard, route: "/super-admin/subscriptions" },
    { name: "Reports", icon: FileText, route: "/super-admin/reports" },
    { name: "Settings", icon: Settings, route: "/super-admin/settings" },
  ];

  const isMobile = width < 768;

  return (
    <SafeAreaView style={styles.container}>

      {!isMobile && (
        <View style={styles.sidebar}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SMART <Text style={styles.logoHighlight}>ERP</Text></Text>
            <Text style={styles.logoSubtitle}>Super Admin</Text>
          </View>

          <View style={styles.navMenu}>
            {menuItems.map((item) => {
              const isActive = item.route === "/super-admin"
                ? pathname === "/super-admin"
                : pathname.startsWith(item.route);

              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => router.push(item.route as any)}
                >
                  <item.icon
                    size={20}
                    color={isActive ? "#2F6BFF" : "#64748b"}
                    style={styles.navIcon}
                  />
                  <Text style={[styles.navText, isActive && styles.navTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          {isMobile && (
            <TouchableOpacity 
              style={{ marginRight: 16 }}
              onPress={() => setIsDrawerOpen(true)}
            >
              <Menu size={24} color="#1e293b" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.searchContainer, isMobile && { flex: 1, paddingHorizontal: 12, marginRight: 8 }]}
            onPress={() => router.push("/super-admin/search" as any)}
          >
            <Search size={18} color="#94a3b8" />
            {!isMobile && <Text style={styles.searchText}>Search...</Text>}
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push("/super-admin/notifications" as any)}
            >
              <Bell size={20} color="#64748b" />
              <View style={styles.badge} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.profileContainer}
              onPress={() => router.push("/super-admin/profile" as any)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>SA</Text>
              </View>
              {!isMobile && (
                <View style={styles.profileTextContainer}>
                  <Text style={styles.profileName}>Super Admin</Text>
                  <Text style={styles.profileRole}>System Owner</Text>
                </View>
              )}
              <ChevronDown size={16} color="#64748b" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={styles.pageContainer}>
          <Slot />
        </View>
      </View>

      {/* Mobile Drawer Modal */}
      {isMobile && (
        <Modal
          visible={isDrawerOpen}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsDrawerOpen(false)}
        >
          <View style={styles.drawerOverlay}>
            <View style={styles.drawerContent}>
              <View style={styles.drawerHeader}>
                <View style={styles.logoContainerMobile}>
                  <Text style={styles.logoText}>SMART <Text style={styles.logoHighlight}>ERP</Text></Text>
                  <Text style={styles.logoSubtitle}>Super Admin</Text>
                </View>
                <TouchableOpacity onPress={() => setIsDrawerOpen(false)}>
                  <X size={24} color="#1e293b" />
                </TouchableOpacity>
              </View>
              <View style={styles.drawerMenu}>
                {menuItems.map((item) => {
                  const isActive = item.route === "/super-admin"
                    ? pathname === "/super-admin"
                    : pathname.startsWith(item.route);

                  return (
                    <TouchableOpacity
                      key={item.name}
                      style={[styles.navItem, isActive && styles.navItemActive]}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        router.push(item.route as any);
                      }}
                    >
                      <item.icon
                        size={20}
                        color={isActive ? "#2F6BFF" : "#64748b"}
                        style={styles.navIcon}
                      />
                      <Text style={[styles.navText, isActive && styles.navTextActive]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <TouchableOpacity 
              style={styles.drawerCloseArea} 
              activeOpacity={1} 
              onPress={() => setIsDrawerOpen(false)} 
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F4F7FE", 
  },
  sidebar: {
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    paddingVertical: 24,
  },
  logoContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  logoHighlight: {
    color: "#2F6BFF",
  },
  logoSubtitle: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginTop: 2,
  },
  navMenu: {
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: "#EFF4FF",
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748b",
  },
  navTextActive: {
    color: "#2F6BFF",
    fontWeight: "700",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#F4F7FE",
  },
  topHeader: {
    height: Platform.OS === 'android' ? 72 + (StatusBar.currentHeight || 24) : 72 + (Platform.OS === 'ios' ? 44 : 0),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : (Platform.OS === 'ios' ? 44 : 0),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    width: 280,
  },
  searchText: {
    color: "#94a3b8",
    marginLeft: 8,
    fontSize: 14,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2F6BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  profileTextContainer: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  profileRole: {
    fontSize: 12,
    color: "#64748b",
  },
  pageContainer: {
    flex: 1,
  },
  // Mobile Drawer Styles
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerCloseArea: {
    flex: 1,
  },
  drawerContent: {
    width: 280,
    backgroundColor: '#FFFFFF',
    height: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  logoContainerMobile: {
    flexDirection: 'column',
  },
  drawerMenu: {
    padding: 16,
    flex: 1,
  },
});
