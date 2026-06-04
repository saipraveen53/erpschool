import { Slot, usePathname, useRouter, useGlobalSearchParams } from "expo-router";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  Search,
  Users,
  Menu,
  X,
  Layers,
  Truck,
  Banknote,
  User,
  UserPlus,
  ShieldAlert,
  BookOpen,
  ClipboardList,
  Calendar,
  Bus
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View, Modal, useWindowDimensions, Platform, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { rootApi } from "../../utils/axiosInstance";
export default function SuperAdminLayout() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const router = useRouter();
  const { defaultRole } = useGlobalSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInviteExpanded, setIsInviteExpanded] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await rootApi.get("/api/profile/me");
        if (response.data) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, route: "/super-admin" },
    { name: "Security", icon: ShieldAlert, route: "/super-admin/security" },
    { name: "Teachers", icon: Users, route: "/super-admin/users" },
    { name: "Classes", icon: Layers, route: "/super-admin/class-sections" },
    { name: "Drivers", icon: Truck, route: "/super-admin/drivers" },
    { name: "Billing", icon: Banknote, route: "/super-admin/billing" },
    { name: "Notices", icon: Bell, route: "/super-admin/notices" },
    { name: "Exams", icon: BookOpen, route: "/super-admin/exams" },
    { name: "Reports", icon: ClipboardList, route: "/super-admin/reports" },
    { name: "Leaves", icon: FileText, route: "/super-admin/leaves" },
    { name: "Holidays", icon: Calendar, route: "/super-admin/holidays" },
    { name: "Transport", icon: Bus, route: "/super-admin/transport" },
    { name: "Profile", icon: User, route: "/super-admin/profile" },
  ];

  const isMobile = width < 768;

  return (
    <SafeAreaView style={styles.container}>
      {pathname === "/super-admin/onboarding" || 
       pathname === "/super-admin/forgot-password" || 
       pathname === "/super-admin/reset-password" ? (
        <Slot />
      ) : (
        <>
          {!isMobile && (
        <View style={styles.sidebar}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>edvance<Text style={styles.logoHighlight}>.</Text></Text>
            <Text style={styles.logoSubtitle}>Super Admin</Text>
          </View>

          <ScrollView style={styles.navMenu} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => {
              if (item.name === "Profile") return null;
              
              const isActive = item.route === "/super-admin"
                ? pathname === "/super-admin"
                : pathname.startsWith(item.route);

              const isDashboard = item.name === "Dashboard";

              return (
                <View key={item.name}>
                  <TouchableOpacity
                    style={[
                      styles.navItem, 
                      isActive && styles.navItemActive
                    ]}
                    onPress={() => router.push(item.route as any)}
                  >
                    <item.icon
                      size={20}
                      color={isActive ? "#E35336" : "#78716C"}
                      style={styles.navIcon}
                    />
                    <Text style={[
                      styles.navText, 
                      isActive && styles.navTextActive
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>

                  {isDashboard && (
                    <View style={{ marginBottom: 4 }}>
                      <TouchableOpacity
                        style={[
                          styles.navItem, 
                          pathname.includes("/super-admin/invite") && styles.navItemActive
                        ]}
                        onPress={() => setIsInviteExpanded(!isInviteExpanded)}
                      >
                        <UserPlus size={20} color={pathname.includes("/super-admin/invite") ? "#E35336" : "#78716C"} style={styles.navIcon} />
                        <Text style={[styles.navText, pathname.includes("/super-admin/invite") && styles.navTextActive, { flex: 1 }]}>
                          Invite Staff
                        </Text>
                        {isInviteExpanded ? <ChevronDown size={16} color="#78716C" /> : <ChevronRight size={16} color="#78716C" />}
                      </TouchableOpacity>
                      {isInviteExpanded && (
                        <View style={{ paddingLeft: 44, marginTop: 4, marginBottom: 8, gap: 14 }}>
                          <TouchableOpacity onPress={() => router.push("/super-admin/invite-principal")}>
                            <Text style={{ fontSize: 14, color: pathname === "/super-admin/invite-principal" && (!defaultRole || defaultRole === 'principle') ? "#E35336" : "#78716C", fontWeight: pathname === "/super-admin/invite-principal" && (!defaultRole || defaultRole === 'principle') ? '700' : '500' }}>Principal</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => router.push("/super-admin/invite-principal?defaultRole=vice_principal")}>
                            <Text style={{ fontSize: 14, color: pathname === "/super-admin/invite-principal" && defaultRole === "vice_principal" ? "#E35336" : "#78716C", fontWeight: pathname === "/super-admin/invite-principal" && defaultRole === "vice_principal" ? '700' : '500' }}>Vice Principal</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => router.push("/super-admin/invite-principal?defaultRole=admin")}>
                            <Text style={{ fontSize: 14, color: pathname === "/super-admin/invite-principal" && defaultRole === "admin" ? "#E35336" : "#78716C", fontWeight: pathname === "/super-admin/invite-principal" && defaultRole === "admin" ? '700' : '500' }}>System Admin</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
            
            <TouchableOpacity
              style={[
                styles.navItem, 
                { marginTop: "auto", backgroundColor: "#FEF2F2", borderColor: "#FCA5A5", borderWidth: 1 }
              ]}
              onPress={() => router.push("/super-admin/profile" as any)}
            >
              <User size={20} color="#DC2626" style={styles.navIcon} />
              <Text style={[styles.navText, { color: "#DC2626", fontWeight: "700" }]}>
                Profile
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      
      <View style={styles.mainContent}>


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
                  <Text style={styles.logoText}>edvance<Text style={styles.logoHighlight}>.</Text></Text>
                  <Text style={styles.logoSubtitle}>Super Admin</Text>
                </View>
                <TouchableOpacity onPress={() => setIsDrawerOpen(false)}>
                  <X size={24} color="#1C1917" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.drawerMenu} showsVerticalScrollIndicator={false}>
                {menuItems.map((item) => {
                  if (item.name === "Profile") return null;

                  const isActive = item.route === "/super-admin"
                    ? pathname === "/super-admin"
                    : pathname.startsWith(item.route);

                  const isDashboard = item.name === "Dashboard";

                  return (
                    <View key={item.name}>
                      <TouchableOpacity
                        style={[
                          styles.navItem, 
                          isActive && styles.navItemActive
                        ]}
                        onPress={() => {
                          setIsDrawerOpen(false);
                          router.push(item.route as any);
                        }}
                      >
                        <item.icon
                          size={20}
                          color={isActive ? "#E35336" : "#78716C"}
                          style={styles.navIcon}
                        />
                        <Text style={[
                          styles.navText, 
                          isActive && styles.navTextActive
                        ]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>

                      {isDashboard && (
                        <View style={{ marginBottom: 4 }}>
                          <TouchableOpacity
                            style={[
                              styles.navItem, 
                              pathname.includes("/super-admin/invite") && styles.navItemActive
                            ]}
                            onPress={() => setIsInviteExpanded(!isInviteExpanded)}
                          >
                            <UserPlus size={20} color={pathname.includes("/super-admin/invite") ? "#E35336" : "#78716C"} style={styles.navIcon} />
                            <Text style={[styles.navText, pathname.includes("/super-admin/invite") && styles.navTextActive, { flex: 1 }]}>
                              Invite Staff
                            </Text>
                            {isInviteExpanded ? <ChevronDown size={16} color="#78716C" /> : <ChevronRight size={16} color="#78716C" />}
                          </TouchableOpacity>
                          {isInviteExpanded && (
                            <View style={{ paddingLeft: 44, marginTop: 4, marginBottom: 8, gap: 14 }}>
                              <TouchableOpacity onPress={() => { router.push("/super-admin/invite-principal"); setIsDrawerOpen(false); }}>
                                <Text style={{ fontSize: 14, color: pathname === "/super-admin/invite-principal" && (!defaultRole || defaultRole === 'principle') ? "#E35336" : "#78716C", fontWeight: pathname === "/super-admin/invite-principal" && (!defaultRole || defaultRole === 'principle') ? '700' : '500' }}>Principal</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => { if(isMobile) setIsDrawerOpen(false); router.push("/super-admin/invite-principal?defaultRole=vice_principal"); }}>
                                <Text style={{ fontSize: 14, color: pathname === "/super-admin/invite-principal" && defaultRole === "vice_principal" ? "#E35336" : "#78716C", fontWeight: pathname === "/super-admin/invite-principal" && defaultRole === "vice_principal" ? '700' : '500' }}>Vice Principal</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => { if(isMobile) setIsDrawerOpen(false); router.push("/super-admin/invite-principal?defaultRole=admin"); }}>
                                <Text style={{ fontSize: 14, color: pathname === "/super-admin/invite-principal" && defaultRole === "admin" ? "#E35336" : "#78716C", fontWeight: pathname === "/super-admin/invite-principal" && defaultRole === "admin" ? '700' : '500' }}>System Admin</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}

                <TouchableOpacity
                  style={[
                    styles.navItem, 
                    { marginTop: "auto", backgroundColor: "#FEF2F2", borderColor: "#FCA5A5", borderWidth: 1 }
                  ]}
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.push("/super-admin/profile" as any);
                  }}
                >
                  <User size={20} color="#DC2626" style={styles.navIcon} />
                  <Text style={[styles.navText, { color: "#DC2626", fontWeight: "700" }]}>
                    Profile
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <TouchableOpacity 
              style={styles.drawerCloseArea} 
              activeOpacity={1} 
              onPress={() => setIsDrawerOpen(false)} 
            />
          </View>
        </Modal>
      )}
      </>
      )}

      {/* FAB Menu Button for Mobile */}
      {isMobile && pathname !== "/super-admin/onboarding" && pathname !== "/super-admin/forgot-password" && pathname !== "/super-admin/reset-password" && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setIsDrawerOpen(true)}
        >
          <Menu size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FAFAF9", 
  },
  sidebar: {
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#F5F5F4",
    paddingVertical: 24,
  },
  logoContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1C1917", // Stone 900
    letterSpacing: -0.5,
  },
  logoHighlight: {
    color: "#E35336",
  },
  logoSubtitle: {
    fontSize: 12,
    color: "#A8A29E",
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  navMenu: {
    paddingHorizontal: 12,
    flex: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: "#FFF1F2", // Very light red/terracotta tint
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#78716C",
  },
  navTextActive: {
    color: "#E35336",
    fontWeight: "700",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#FAFAF9",
  },
  topHeader: {
    height: Platform.OS === 'android' ? 72 + (StatusBar.currentHeight || 24) : 72 + (Platform.OS === 'ios' ? 44 : 0),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : (Platform.OS === 'ios' ? 44 : 0),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F4",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    width: 280,
  },
  searchText: {
    color: "#78716C",
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500'
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E35336",
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
    backgroundColor: "#E35336",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  profileTextContainer: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1917",
  },
  profileRole: {
    fontSize: 12,
    color: "#78716C",
    fontWeight: '500'
  },
  pageContainer: {
    flex: 1,
  },
  // Mobile Drawer Styles
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawerCloseArea: {
    flex: 1,
  },
  drawerContent: {
    width: 280,
    backgroundColor: '#FFFFFF',
    height: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },
  logoContainerMobile: {
    flexDirection: 'column',
  },
  drawerMenu: {
    padding: 16,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E35336', // Red color
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000
  }
});
