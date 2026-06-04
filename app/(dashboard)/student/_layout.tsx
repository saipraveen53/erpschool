import { Stack, usePathname, useRouter } from "expo-router";
import {
  Award,
  BookOpen,
  Bus,
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Home,
  LogOut,
  MessageSquare,
  School,
  User
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const THEME = {
  primary: "#E35336",      // Burnt Sienna Main
  sidebarBg: "#2C1A14",    // Deep Sienna Brown
  activeBg: "rgba(227, 83, 54, 0.15)",
  subActiveBg: "rgba(255, 255, 255, 0.06)",
  textLight: "#FFFFFF",
  textMuted: "#A08E88",
  border: "#442E26",
  white: "#FFFFFF",
  tabBarBg: "#FFFFFF",     // Premium Mobile Bottom Bar base color
};

export default function ParentLayout() {
  const router = useRouter();
  const currentPath = usePathname();
  const insets = useSafeAreaInsets(); // Dynamic system insets tracker to completely eliminate navigation overlaps
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
 // const { logout } = useAuth();
//const handleLogout = async () => {
//await logout();
//};

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = dimensions.width > 768;

  const menuConfig = [
    { name: "Dashboard", id: "dashboard", icon: <Home size={18} />, hasSub: false, path: "/student" },
    { 
      name: "Attendance", id: "attendance", icon: <Calendar size={18} />, hasSub: true,
      subItems: [
        { name: "Attendance Logs", path: "/student/attendance" },
        { name: "Class Time-table", path: "/student/attendance/leave-request" }
      ]
    },
    { 
      name: "Communication", id: "communication", icon: <MessageSquare size={18} />, hasSub: true,
      subItems: [
        { name: "Broadcast Notices", path: "/student/communication/notices" },
        { name: "Emergency Alerts", path: "/student/communication/alerts" },
        { name: "Teacher Chat Room", path: "/student/communication/chat" }
      ]
    },
    { 
      name: "Examination", id: "examination", icon: <Award size={18} />, hasSub: true,
      subItems: [
        { name: "Term Report Cards", path: "/student/examinations/report-card" },
        { name: "Academic Results", path: "/student/examinations/results" },
        { name: "Exam Schedule", path: "/student/examinations/timetable" }
      ]
    },
    { 
      name: "Fees & Dues", id: "fees", icon: <CreditCard size={18} />, hasSub: true,
      subItems: [
        { name: "Dues Overview", path: "/student/fees" },
        { name: "Payment Gateway", path: "/student/fees/payment" },
        { name: "Receipt Ledger", path: "/student/fees/receipts" }
      ]
    },
    { 
      name: "Homework Diary", id: "homework", icon: <BookOpen size={18} />, hasSub: true,
      subItems: [{ name: "Daily Assignments", path: "/student/homework" }]
    },
    { 
      name: "Transport Live", id: "transport", icon: <Bus size={18} />, hasSub: true,
      subItems: [
        { name: "Live Bus Tracking", path: "/student/transport/bus-tracking" },
        { name: "Route Alerts", path: "/student/transport/alerts" }
      ]
    },
    { 
      name: "My Profile", id: "profile", icon: <User size={18} />, hasSub: true,
      subItems: [{ name: "Account Details", path: "/student/profile" }]
    },
  ];

  const mobileTabsConfig = [
    { name: "Home", icon: <Home size={20} />, path: "/student" },
    { name: "Communication", icon: <MessageSquare size={20} />, path: "/student/communication/chat" },
    { name: "Fees", icon: <CreditCard size={20} />, path: "/student/fees" },
    { name: "Examination", icon: <Award size={20} />, path: "/student/examinations/report-card" },
    { name: "Transport", icon: <Bus size={20} />, path: "/student/transport/bus-tracking" },
  ];

  const toggleDropdown = (menuId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenDropdown(openDropdown === menuId ? null : menuId);
  };

  const handleNavigation = (path: string) => {
    router.push(path as any);
  };

  // Secure user routing mechanism linking out clean state structures back down root public path profiles
  const handleLogoutActionExecution = () => {
    router.replace("/(public)/home" as any);
  };

  const isTabRouteActive = (tabPath: string) => {
    if (tabPath === "/student") {
      return currentPath === "/student" || currentPath === "/student/";
    }
    return currentPath.startsWith(tabPath);
  };

  const renderSidebar = () => (
    <View style={styles.sidebarContainer}>
      <View style={styles.brandWrapper}>
        <View style={styles.brandIconHolder}>
          <School size={22} color={THEME.white} />
        </View>
        <View style={styles.brandTextCluster}>
          <Text style={styles.brandTextMain}>Edvance Administration</Text>
          <Text style={styles.brandTextSub}>Parent Portal</Text>
        </View>
      </View>
      
      <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
        {menuConfig.map((menu, index) => {
          const hasSub = menu.hasSub;
          const isDropdownOpen = openDropdown === menu.id;
          
          const isParentActive = !hasSub && (currentPath === menu.path || currentPath === `${menu.path}/`);
          const isChildActive = hasSub && menu.subItems?.some(sub => currentPath === sub.path);

          return (
            <View key={index} style={styles.menuGroupWrapper}>
              <TouchableOpacity
                style={[
                  styles.menuItem, 
                  isParentActive && styles.activeMenuItem,
                  isChildActive && styles.activeParentMenuContainer
                ]}
                onPress={() => hasSub ? toggleDropdown(menu.id) : handleNavigation(menu.path!)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeftSection}>
                  <View style={[styles.iconWrapper, (isParentActive || isChildActive) && styles.activeIconWrapper]}>
                    {React.cloneElement(menu.icon, { 
                      color: (isParentActive || isChildActive) ? THEME.primary : THEME.textMuted 
                    })}
                  </View>
                  <Text style={[styles.menuItemText, (isParentActive || isChildActive) && styles.activeMenuText]}>
                    {menu.name}
                  </Text>
                </View>

                {hasSub && (
                  <View style={styles.chevronIconHolder}>
                    {isDropdownOpen ? <ChevronUp size={16} color={THEME.textMuted} /> : <ChevronDown size={16} color={THEME.textMuted} />}
                  </View>
                )}
                {isParentActive && <View style={styles.activeIndicatorLine} />}
              </TouchableOpacity>

              {hasSub && isDropdownOpen && (
                <View style={styles.subItemsDropdownContainer}>
                  {menu.subItems?.map((sub, sIdx) => {
                    const isSubActive = currentPath === sub.path;
                    return (
                      <TouchableOpacity
                        key={sIdx}
                        style={[styles.subMenuItemTab, isSubActive && styles.activeSubMenuItemTab]}
                        onPress={() => handleNavigation(sub.path)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.subItemDotMarker, isSubActive && styles.activeSubItemDotMarker]} />
                        <Text style={[styles.subMenuItemTabText, isSubActive && styles.activeSubMenuItemTabText]}>
                          {sub.name}
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

      {/* Styled Interactive Logout Trigger Action Panel Replacing Static Text Footer */}
      <View style={styles.sidebarFooter}>
        <TouchableOpacity 
          style={styles.sidebarLogoutButtonAnchor} 
          onPress={handleLogoutActionExecution}
          activeOpacity={0.8}
        >
          <LogOut size={16} color="#F44460" />
          <Text style={styles.logoutButtonTextLabel}>Portal Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.footerVersionTrackingLabelText}>v1.0.4 Campus Safe</Text>
      </View>
    </View>
  );

  const renderMobileBottomTabBar = () => (
    <View 
      style={[
        styles.mobileTabBarContainer, 
        { 
          // Inject dynamic programmatic padding calculations balancing phone systems navigation indicators natively
          height: 62 + Math.max(insets.bottom, 12),
          paddingBottom: Math.max(insets.bottom, 10)
        }
      ]}
    >
      {mobileTabsConfig.map((tab, idx) => {
        const isActive = isTabRouteActive(tab.path);
        return (
          <TouchableOpacity
            key={idx}
            style={styles.mobileTabElementButton}
            activeOpacity={0.7}
            onPress={() => handleNavigation(tab.path)}
          >
            <View style={[styles.mobileTabIconWrapper, isActive && styles.mobileActiveIconActiveState]}>
              {React.cloneElement(tab.icon, {
                color: isActive ? THEME.primary : "#55433C",
                size: isActive ? 21 : 20
              })}
            </View>
            <Text style={[styles.mobileTabTextTypography, isActive && styles.mobileActiveTabTextActiveState]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.rootContainer}>
      {isDesktop && renderSidebar()}

      <View style={[styles.contentContainer]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="attendance/index" />
          <Stack.Screen name="attendance/leave-request" />
          <Stack.Screen name="calender/index" />
          {/*<Stack.Screen name="children/[id]" />*/}
          <Stack.Screen name="communication/notices" />
          <Stack.Screen name="communication/alerts" />
          <Stack.Screen name="communication/chat" />
          <Stack.Screen name="examinations/report-card" />
          <Stack.Screen name="examinations/results" />
          <Stack.Screen name="examinations/timetable" />
          <Stack.Screen name="fees/index" />
          <Stack.Screen name="fees/payment" />
          <Stack.Screen name="fees/receipts" />
          <Stack.Screen name="homework/index" />
          <Stack.Screen name="profile/index" />
          <Stack.Screen name="transport/index" />
          <Stack.Screen name="transport/bus-tracking" />
        </Stack>
      </View>

      {!isDesktop && renderMobileBottomTabBar()}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F5F5DC",
  },
  sidebarContainer: {
    width: 275,
    backgroundColor: THEME.sidebarBg,
    borderRightWidth: 1,
    borderRightColor: THEME.border,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  brandWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 22,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  brandIconHolder: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  brandTextCluster: {
    flex: 1,
    gap: 2,
  },
  brandTextMain: {
    color: THEME.textLight,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  brandTextSub: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  menuScroll: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    position: "relative",
  },
  menuItemLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.02)",
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconWrapper: {
    backgroundColor: "rgba(227, 83, 54, 0.15)",
  },
  activeMenuItem: {
    backgroundColor: THEME.activeBg,
  },
  activeParentMenuContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  menuItemText: {
    color: THEME.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  activeMenuText: {
    color: THEME.primary,
    fontWeight: "700",
  },
  chevronIconHolder: {
    paddingRight: 4,
  },
  activeIndicatorLine: {
    position: "absolute",
    right: -12,
    top: 10,
    bottom: 10,
    width: 3.5,
    backgroundColor: THEME.primary,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  subItemsDropdownContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 12,
    marginTop: 2,
    paddingVertical: 6,
    paddingLeft: 14,
    gap: 2,
  },
  subMenuItemTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 10,
  },
  activeSubMenuItemTab: {
    backgroundColor: THEME.activeBg,
  },
  subItemDotMarker: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: THEME.textMuted,
    opacity: 0.5,
  },
  activeSubItemDotMarker: {
    backgroundColor: THEME.primary,
    opacity: 1,
  },
  subMenuItemTabText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  activeSubMenuItemTabText: {
    color: THEME.primary,
    fontWeight: "700",
  },
  sidebarFooter: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    gap: 10
  },
  sidebarLogoutButtonAnchor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(244, 68, 96, 0.08)",
    paddingVertical: 11,
    borderRadius: 12,
    gap: 10,
    width: "100%"
  },
  logoutButtonTextLabel: {
    color: "#F44460",
    fontSize: 13,
    fontWeight: "700"
  },
  footerVersionTrackingLabelText: {
    color: THEME.textMuted,
    fontSize: 11,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    height: "100%",
  },
  mobileTabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.tabBarBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "rgba(44, 26, 20, 0.08)",
    shadowColor: "#2C1A14",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 999
  },
  mobileTabElementButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  mobileTabIconWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileActiveIconActiveState: {
    backgroundColor: "rgba(227, 83, 54, 0.08)",
  },
  mobileTabTextTypography: {
    fontSize: 10,
    fontWeight: "600",
    color: "#7A6862",
    marginTop: 3,
  },
  mobileActiveTabTextActiveState: {
    color: THEME.primary,
    fontWeight: "800",
  },
});