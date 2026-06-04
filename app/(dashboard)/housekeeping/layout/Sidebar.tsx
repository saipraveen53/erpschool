import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import {
  BarChart3,
  Bell,
  Building2,
  CheckSquare,
  ChevronDown,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import Navbar from "./Navbar";

// ─── Brand Colors ─────────────────────────────────────────────────────────────

const COLORS = {
  bgWhite: "#FFFFFF",
  darkBg: "#2A1308",
  cardDark: "#3E1F0D",
  cardLight: "#ffffff",
  accent: "#F4A460",
  primary: "#E35336",
  textSecondary: "#A0522D",
  textPrimary: "#5C2E14",
  white: "#FFFFFF",
};

// Derived sidebar tokens
const SB = {
  bg: COLORS.cardLight, // Soft off-white sidebar bg
  bgActive: "rgba(227,83,54,0.09)", // Primary tint for active row
  bgHover: "rgba(244,164,96,0.10)", // Accent tint for hover
  border: "rgba(92,46,20,0.09)",
  borderMed: "rgba(92,46,20,0.15)",
  sectionLabel: "rgba(160,82,45,0.45)",
  iconDefault: "rgba(160,82,45,0.55)",
  logoBg1: COLORS.primary,
  logoBg2: COLORS.accent,
  activeBar: COLORS.primary,
  badgeBg: COLORS.primary,
  badgeWarnBg: "rgba(244,164,96,0.22)",
  badgeWarnText: "#854F0B",
  logoutIcon: COLORS.primary,
  logoutIconBg: "rgba(227,83,54,0.10)",
  logoutText: COLORS.primary,
  onlineDot: "#16a34a",
  subDot: "rgba(160,82,45,0.35)",
  subDotActive: COLORS.primary,
  resizeBar: "rgba(92,46,20,0.18)",
  overlay: "rgba(42,19,8,0.30)",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubItem {
  name: string;
  path?: string;
}

interface MenuItem {
  name: string;
  icon: React.ComponentType<any>;
  path?: string;
  badge?: number;
  badgeWarn?: string;
  subItems?: SubItem[];
}

interface SidebarProps {
  children: React.ReactNode;
  menuItems?: MenuItem[];
  hideNavbar?: boolean;
  activePath?: string;
  onLogout?: () => void;
  userInfo?: {
    name?: string;
    initials?: string;
    role?: string;
  };
}

export const SidebarContext = createContext({
  isDrawerOpen: false,
  setIsDrawerOpen: (_: boolean) => {},
});
export const useSidebar = () => useContext(SidebarContext);

const DEFAULT_ITEMS: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  {
    name: "Rooms",
    icon: Building2,
    subItems: [
      { name: "All Rooms", path: "/rooms" },
      { name: "Occupied", path: "/rooms/occupied" },
      { name: "Vacant", path: "/rooms/vacant" },
    ],
  },
  { name: "Tasks", icon: CheckSquare, path: "/tasks", badge: 4 },
  { name: "Staff", icon: Users, path: "/staff" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Reports", icon: LayoutDashboard, path: "/reports" },
];

const OPS_ITEMS: MenuItem[] = [
  {
    name: "Alerts",
    icon: Bell,
    path: "housekeeping/_components/Alerts",
    badge: 2,
  },
];

const SYSTEM_ITEMS: MenuItem[] = [
  {
    name: "Settings",
    icon: Settings,
    path: "housekeeping/_components/settings",
  },
  {
    name: "Help & Support",
    icon: HelpCircle,
    path: "housekeeping/_components/supportpage",
  },
];

// ─── Reusable Logout Prompt Popup ─────────────────────────────────────────────

interface LogoutPopupProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutPopupOverlay = ({
  visible,
  onClose,
  onConfirm,
}: LogoutPopupProps) => {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 0.95,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={S.popupOverlayContainer}>
        <Animated.View style={[S.popupBackdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            S.popupCardBody,
            { opacity: backdropOpacity, transform: [{ scale: contentScale }] },
          ]}
        >
          <View style={S.popupHeaderRow}>
            <Text style={S.popupTitleText}>Terminate Session</Text>
            <TouchableOpacity
              onPress={onClose}
              style={S.popupCloseCircle}
              activeOpacity={0.7}
            >
              <X size={13} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={S.popupInnerContent}>
            <Text style={S.popupBodyParagraph}>
              Are you sure you want to exit the **Edvance Housekeeping Panel**?
              Unsaved tracking changes or active local cache updates will clear.
            </Text>

            <View style={S.popupActionRow}>
              <TouchableOpacity
                style={S.popupBtnCancel}
                activeOpacity={0.75}
                onPress={onClose}
              >
                <Text style={S.popupBtnCancelText}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={S.popupBtnConfirm}
                activeOpacity={0.75}
                onPress={onConfirm}
              >
                <Text style={S.popupBtnConfirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── Sidebar Content ──────────────────────────────────────────────────────────

interface SidebarContentProps {
  isMobile: boolean;
  isCollapsed: boolean;
  pathname: string;
  mainItems: MenuItem[];
  opsItems: MenuItem[];
  systemItems: MenuItem[];
  sidebarWidth: number;
  resizeHandlers?: any;
  onToggle?: () => void;
  onClose?: () => void;
  onTriggerLogoutPopup: () => void;
  userInfo?: SidebarProps["userInfo"];
}

const SidebarContent = ({
  isMobile,
  isCollapsed,
  pathname,
  mainItems,
  opsItems,
  systemItems,
  sidebarWidth,
  resizeHandlers,
  onToggle,
  onClose,
  onTriggerLogoutPopup,
  userInfo,
}: SidebarContentProps) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const routerPathname = usePathname();
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const showLabels = !isCollapsed || isMobile;

  const isActive = (item: MenuItem | SubItem) =>
    pathname === item.path ||
    (item.path ? pathname.startsWith(item.path + "/") : false);

  const toggleExpand = (name: string) =>
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );

  const navigate = (path?: string) => {
    if (path) {
      router.push(path as any);
      if (isMobile) onClose?.();
    }
  };

  const renderSubItems = (subItems: SubItem[]) =>
    subItems.map((sub, i) => {
      const active = isActive(sub);
      return (
        <TouchableOpacity
          key={i}
          style={[S.subItem, active && S.subItemActive]}
          onPress={() => navigate(sub.path)}
          activeOpacity={0.75}
        >
          <View style={[S.subDot, active && S.subDotActive]} />
          <Text style={[S.subItemText, active && S.subItemTextActive]}>
            {sub.name}
          </Text>
        </TouchableOpacity>
      );
    });

  const renderItem = (item: MenuItem, index: number) => {
    const active = isActive(item);
    const hovered = hoveredItem === item.name;
    const hasChildren = item.subItems && item.subItems.length > 0;
    const expanded = expandedItems.includes(item.name);

    const subExpandAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

    const handlePress = () => {
      if (hasChildren) {
        const next = !expanded;
        toggleExpand(item.name);
        Animated.timing(subExpandAnim, {
          toValue: next ? 1 : 0,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      } else {
        navigate(item.path);
      }
    };

    const iconColor = active
      ? COLORS.primary
      : hovered
        ? COLORS.primary
        : SB.iconDefault;

    return (
      <View key={index}>
        <Pressable
          onHoverIn={() => setHoveredItem(item.name)}
          onHoverOut={() => setHoveredItem(null)}
          onPress={handlePress}
          style={[
            S.menuItem,
            isCollapsed && !isMobile && S.menuItemCollapsed,
            hovered && !active && S.menuItemHovered,
            active && S.menuItemActive,
          ]}
          accessibilityLabel={item.name}
        >
          {active && <View style={S.activeBar} />}

          <View
            style={[
              S.iconBox,
              active && S.iconBoxActive,
              hovered && !active && S.iconBoxHovered,
            ]}
          >
            <item.icon size={17} color={iconColor} strokeWidth={1.8} />
          </View>

          {showLabels && (
            <View style={S.labelRow}>
              <Text
                style={[S.itemLabel, active && S.itemLabelActive]}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              {item.badge !== undefined && item.badge > 0 && (
                <View style={S.badge}>
                  <Text style={S.badgeText}>{item.badge}</Text>
                </View>
              )}

              {item.badgeWarn && (
                <View style={S.badgeWarn}>
                  <Text style={S.badgeWarnText}>{item.badgeWarn}</Text>
                </View>
              )}

              {hasChildren && (
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: subExpandAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "180deg"],
                        }),
                      },
                    ],
                  }}
                >
                  <ChevronDown
                    size={13}
                    color={active ? COLORS.primary : SB.iconDefault}
                    strokeWidth={2}
                  />
                </Animated.View>
              )}
            </View>
          )}

          {!showLabels && item.badge !== undefined && item.badge > 0 && (
            <View style={S.collapsedDot} />
          )}
        </Pressable>

        {hasChildren && expanded && showLabels && (
          <Animated.View style={[S.subContainer, { opacity: subExpandAnim }]}>
            {renderSubItems(item.subItems!)}
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        S.sidebar,
        !isMobile
          ? isCollapsed
            ? S.sidebarCollapsed
            : { width: sidebarWidth }
          : S.sidebarMobile,
        {
          opacity: entranceAnim,
          transform: [
            {
              translateX: entranceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Brand header */}
      <View style={[S.header, !showLabels && S.headerCollapsed]}>
        {showLabels ? (
          <TouchableOpacity
            style={S.logoRow}
            onPress={() => router.push("/")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={S.logoMark}
            >
              <Sparkles size={15} color={COLORS.white} strokeWidth={1.5} />
            </LinearGradient>
            <View>
              <Text style={S.logoText}>
                Edvance<Text style={S.logoHighlight}>.</Text>
              </Text>
              <Text style={S.logoSub}>HouseKeeping panel</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}

        {isMobile ? (
          <TouchableOpacity style={S.headerBtn} onPress={onClose}>
            <X size={15} color={COLORS.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        ) : onToggle ? (
          <TouchableOpacity style={S.headerBtn} onPress={onToggle}>
            {isCollapsed ? (
              <PanelLeftOpen size={14} color={COLORS.primary} strokeWidth={2} />
            ) : (
              <PanelLeftClose
                size={14}
                color={COLORS.primary}
                strokeWidth={2}
              />
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Scrollable nav */}
      <ScrollView
        style={S.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={S.scrollContent}
      >
        {showLabels && <Text style={S.sectionLabel}>MAIN MENU</Text>}
        {mainItems.map((item, i) => renderItem(item, i))}

        <View style={S.divider} />

        {showLabels && <Text style={S.sectionLabel}>OPERATIONS</Text>}
        {opsItems.map((item, i) => renderItem(item, mainItems.length + i))}

        <View style={S.divider} />

        {showLabels && <Text style={S.sectionLabel}>SYSTEM</Text>}
        {systemItems.map((item, i) =>
          renderItem(item, mainItems.length + opsItems.length + i),
        )}
      </ScrollView>

      {/* Bottom deck: logout + user status */}
      <View style={S.bottom}>
        <View style={S.bottomDivider} />

        <TouchableOpacity
          style={S.logoutBtn}
          onPress={onTriggerLogoutPopup}
          activeOpacity={0.75}
        >
          <View style={S.logoutIcon}>
            <LogOut size={15} color={SB.logoutText} strokeWidth={2} />
          </View>
          {showLabels && <Text style={S.logoutText}>Logout</Text>}
        </TouchableOpacity>

        <View style={[S.userRow, !showLabels && S.userRowCollapsed]}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={S.userAvatar}
          >
            <Text style={S.userAvatarText}>{userInfo?.initials ?? "HL"}</Text>
          </LinearGradient>

          {showLabels && (
            <View style={S.userInfo}>
              <Text style={S.userName} numberOfLines={1}>
                {userInfo?.name ?? "Housekeeping Lead"}
              </Text>
              <View style={S.onlineRow}>
                <View style={S.onlineDot} />
                <Text style={S.userRole}>
                  {userInfo?.role ?? "Senior Staff"}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Drag-to-resize handle */}
      {!isMobile && !isCollapsed && (
        <View {...resizeHandlers} style={S.resizeHandle}>
          <View style={S.resizeBar} />
        </View>
      )}
    </Animated.View>
  );
};

// ─── Main Sidebar Shell ───────────────────────────────────────────────────────

const Sidebar = ({
  children,
  menuItems,
  hideNavbar,
  activePath,
  onLogout,
  userInfo = {
    name: "Housekeeping Lead",
    initials: "HL",
    role: "Senior Staff",
  },
}: SidebarProps) => {
  const routerPathname = usePathname();
  const router = useRouter();
  const pathname = activePath ?? routerPathname;
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [logoutPopupVisible, setLogoutPopupVisible] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { moveX }) => {
        if (moveX >= 200 && moveX <= 360) setSidebarWidth(moveX);
      },
    }),
  ).current;

  const mainItems: MenuItem[] = menuItems ?? DEFAULT_ITEMS;
  const allItems = [...mainItems, ...OPS_ITEMS, ...SYSTEM_ITEMS];
  const activeItem =
    allItems.find((i) => pathname === i.path) ??
    allItems.flatMap((i) => i.subItems ?? []).find((s) => pathname === s.path);

  const handleConfirmLogout = () => {
    setLogoutPopupVisible(false);
    setIsDrawerOpen(false);

    if (onLogout) {
      onLogout();
    }

    router.replace("/home"); // Navigate to home page
  };

  const contentProps: SidebarContentProps = {
    isMobile,
    isCollapsed,
    pathname,
    mainItems,
    opsItems: OPS_ITEMS,
    systemItems: SYSTEM_ITEMS,
    sidebarWidth,
    resizeHandlers: panResponder.panHandlers,
    onToggle: () => setIsCollapsed((c) => !c),
    onClose: () => setIsDrawerOpen(false),
    onTriggerLogoutPopup: () => setLogoutPopupVisible(true),
    userInfo,
  };

  return (
    <SidebarContext.Provider value={{ isDrawerOpen, setIsDrawerOpen }}>
      <View style={S.shell}>
        {/* Desktop sidebar content frame */}
        {!isMobile && <SidebarContent {...contentProps} />}

        {/* Mobile overlay drawer sheet */}
        {isMobile && isDrawerOpen && (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                zIndex: 9999,
                elevation: 9999,
              },
            ]}
          >
            <TouchableWithoutFeedback onPress={() => setIsDrawerOpen(false)}>
              <View style={S.overlay} />
            </TouchableWithoutFeedback>
            <View style={S.drawerWrapper}>
              <SidebarContent {...contentProps} isMobile />
            </View>
          </View>
        )}

        {/* Main core view viewports */}
        <View style={S.main}>
          {!hideNavbar && (
            <Navbar
              title={activeItem?.name ?? "Dashboard"}
              onMenuPress={() => setIsDrawerOpen(true)}
              userInfo={userInfo}
            />
          )}
          <View style={S.content}>{children}</View>
        </View>

        {/* Modular overlay engine mounts */}
        <LogoutPopupOverlay
          visible={logoutPopupVisible}
          onClose={() => setLogoutPopupVisible(false)}
          onConfirm={handleConfirmLogout}
        />
      </View>
    </SidebarContext.Provider>
  );
};

// ─── Component Styles Layouts ─────────────────────────────────────────────────

const S = StyleSheet.create({
  shell: { flex: 1, flexDirection: "row", backgroundColor: "#ffffff" },
  main: { flex: 1, flexDirection: "column", overflow: "hidden" as any },
  content: { flex: 1 },

  // Sidebar container styles
  sidebar: {
    height: "100%",
    backgroundColor: SB.bg,
    borderRightWidth: 1,
    borderRightColor: SB.border,
    flexDirection: "column",
    shadowColor: COLORS.darkBg,
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
    position: "relative",
    ...Platform.select({
      ios: { paddingTop: 52 },
      android: { paddingTop: 40 },
      web: { paddingTop: 0 },
    }),
  },
  sidebarCollapsed: { width: 70 },
  sidebarMobile: { width: 264, height: "100%" },

  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: SB.border,
  },
  headerCollapsed: { justifyContent: "center", paddingHorizontal: 10 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  logoSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
    opacity: 0.7,
  },
  headerBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: SB.borderMed,
    backgroundColor: COLORS.bgWhite,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  // Scroll layouts
  scroll: { flex: 1, paddingHorizontal: 8 },
  scrollContent: { paddingTop: 10, paddingBottom: 14 },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: SB.sectionLabel,
    letterSpacing: 1.5,
    paddingLeft: 8,
    paddingBottom: 6,
    paddingTop: 4,
    textTransform: "uppercase",
  },

  // Navigation rows
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 6,
    marginBottom: 4,
    position: "relative",
    overflow: "hidden",
  },
  menuItemCollapsed: {
    width: 50,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignSelf: "center",
  },
  menuItemHovered: { backgroundColor: SB.bgHover },
  menuItemActive: { backgroundColor: SB.bgActive },

  activeBar: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: SB.activeBar,
    borderRadius: 0,
  },

  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
    flexShrink: 0,
  },
  iconBoxActive: { backgroundColor: "rgba(227,83,54,0.10)" },
  iconBoxHovered: { backgroundColor: "rgba(244,164,96,0.12)" },

  labelRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6 },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  itemLabelActive: { color: COLORS.primary, fontWeight: "700" },

  badge: {
    backgroundColor: SB.badgeBg,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 9, fontWeight: "700", color: COLORS.white },

  badgeWarn: {
    backgroundColor: SB.badgeWarnBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeWarnText: { fontSize: 9, fontWeight: "700", color: SB.badgeWarnText },

  collapsedDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: SB.bg,
  },

  // Sub menu matrices
  subContainer: {
    marginLeft: 14,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: SB.border,
    marginBottom: 4,
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 33,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 1,
    gap: 8,
  },
  subItemActive: { backgroundColor: SB.bgActive },
  subDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: SB.subDot },
  subDotActive: { backgroundColor: SB.subDotActive },
  subItemText: {
    fontSize: 12.5,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  subItemTextActive: { color: COLORS.primary, fontWeight: "600" },

  divider: {
    height: 1,
    backgroundColor: SB.border,
    marginVertical: 8,
    marginHorizontal: 4,
  },

  // Footer context layouts
  bottom: {
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === "ios" ? 30 : 14,
  },
  bottomDivider: { height: 1, backgroundColor: SB.border, marginBottom: 10 },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 6,
    marginBottom: 6,
    gap: 10,
  },
  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: SB.logoutIconBg,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  logoutText: { fontSize: 13, fontWeight: "600", color: SB.logoutText },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 4,
    paddingVertical: 5,
  },
  userRowCollapsed: { justifyContent: "center" },
  userAvatar: {
    width: 33,
    height: 33,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#5C2E14",
    letterSpacing: -0.5,
  },
  logoHighlight: {
    color: "#E35336",
  },
  userAvatarText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  userInfo: { flex: 1, overflow: "hidden" },
  userName: { fontSize: 12.5, fontWeight: "600", color: COLORS.textPrimary },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SB.onlineDot,
  },
  userRole: { fontSize: 10.5, color: COLORS.textSecondary, opacity: 0.7 },

  // Boundary sliders
  resizeHandle: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 6,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "web" ? ({ cursor: "col-resize" } as any) : {}),
  },
  resizeBar: {
    width: 3,
    height: 32,
    backgroundColor: SB.resizeBar,
    borderRadius: 2,
  },

  // Overlay vectors
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: SB.overlay },
  drawerWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 264,
    zIndex: 9999,
    elevation: 9999,
  },

  /* ─── MODAL INTERACTIVE POPUP STYLES ─── */
  popupOverlayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  popupBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(42, 19, 8, 0.45)",
  },
  popupCardBody: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 20,
    width: "100%",
    maxWidth: 360,
    padding: 20,
    borderWidth: 1,
    borderColor: SB.border,
    shadowColor: COLORS.darkBg,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  popupHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: SB.border,
  },
  popupTitleText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  popupCloseCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(92,46,20,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  popupInnerContent: {
    paddingTop: 2,
  },
  popupBodyParagraph: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontWeight: "500",
    marginBottom: 20,
  },
  popupActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  popupBtnCancel: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(92,46,20,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  popupBtnCancelText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  popupBtnConfirm: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  popupBtnConfirmText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
});

export default Sidebar;
