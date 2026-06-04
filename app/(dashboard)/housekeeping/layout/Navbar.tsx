import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Bell, ChevronDown, LogOut, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";

import { useRouter } from "expo-router";

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

// Derived navbar tokens
const NB = {
  bg: COLORS.bgWhite,
  border: "rgba(92,46,20,0.09)",
  borderMed: "rgba(92,46,20,0.15)",
  searchBg: COLORS.cardLight,
  searchFocusBorder: "rgba(227,83,54,0.35)",
  iconColor: COLORS.textSecondary,
  iconHoverBg: "rgba(227,83,54,0.08)",
  iconHoverBorder: "rgba(227,83,54,0.20)",
  iconHoverColor: COLORS.primary,
  breadcrumbMuted: "rgba(162, 76, 36, 0.61)",
  divider: "rgba(92,46,20,0.09)",
  badgeBg: COLORS.primary,
  profilePressed: "rgba(227,83,54,0.07)",
  profilePressedBorder: "rgba(227,83,54,0.22)",
  kbdBorder: "rgba(92,46,20,0.14)",
  kbdText: "rgba(160,82,45,0.50)",
  notifBadgeBg: COLORS.primary,
  hamburgerColor: COLORS.textSecondary,
  shadow: COLORS.darkBg,
  // Notification panel
  notifBg: COLORS.bgWhite,
  notifBorder: "rgba(92,46,20,0.12)",
  notifCritical: COLORS.primary,
  notifWarning: "#BA7517",
  notifInfo: "#185FA5",
  // Profile dropdown
  dropBg: COLORS.bgWhite,
  dropBorder: "rgba(92,46,20,0.12)",
  dropItemHover: "rgba(227,83,54,0.06)",
};

const SB = {
  bg: COLORS.cardLight,
  bgActive: "rgba(227,83,54,0.09)",
  bgHover: "rgba(244,164,96,0.10)",
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

interface NavbarProps {
  title?: string;
  breadcrumbs?: string[];
  onMenuPress?: () => void;
  unreadNotificationCount?: number;
  isScrolled?: boolean;
  userInfo?: {
    name?: string;
    initials?: string;
    role?: string;
  };
  navigation?: any;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
  onLogout?: () => void;
}

const NOTIF_DATA = [
  {
    type: "critical" as const,
    msg: "Biohazard spill — Room 304 · Immediate attention",
    time: "5 min ago",
  },
  {
    type: "warning" as const,
    msg: "Linen supply low — Floor 3 stock at 15%",
    time: "18 min ago",
  },
  {
    type: "info" as const,
    msg: "VIP check-in — Room 512 priority by 2 PM",
    time: "1 hr ago",
  },
];

const NOTIF_COLORS = {
  critical: NB.notifCritical,
  warning: NB.notifWarning,
  info: NB.notifInfo,
};

const NotifTypeDot = ({ type }: { type: keyof typeof NOTIF_COLORS }) => (
  <View
    style={{
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: NOTIF_COLORS[type],
      marginTop: 4,
      flexShrink: 0,
    }}
  />
);

const IconBtn = ({
  children,
  onPress,
  accessibilityLabel,
  badge,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  badge?: number;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[S.iconBtn, hovered && S.iconBtnHovered]}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            color: hovered ? COLORS.primary : NB.iconColor,
          })
        : children}
      {badge !== undefined && badge > 0 && (
        <View style={S.iconBadge}>
          <Text style={S.iconBadgeText}>{badge > 9 ? "9+" : badge}</Text>
        </View>
      )}
    </Pressable>
  );
};

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
              Are you sure you want to exit the{" "}
              <Text style={{ fontWeight: "800" }}>
                Edvance Housekeeping Panel
              </Text>
              ? Unsaved tracking changes or active local cache updates will
              clear.
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

const Navbar = ({
  title = "Dashboard",
  breadcrumbs,
  onMenuPress,
  unreadNotificationCount = 3,
  isScrolled = false,
  userInfo = {
    name: "Housekeeping Lead",
    initials: "HL",
    role: "Senior Staff",
  },
  navigation,
  onProfilePress,
  onSettingsPress,
  onNotificationsPress,
  onLogout,
}: NavbarProps) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [logoutPopupVisible, setLogoutPopupVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const closeDropdowns = () => {
    setShowNotifs(false);
    setShowProfile(false);
  };

  const handleNotificationPress = () => {
    closeDropdowns();
    if (onNotificationsPress) onNotificationsPress();
    router.push("/(dashboard)/housekeeping/_components/Alerts");
  };

  const handleLogoutTrigger = () => {
    closeDropdowns();
    setLogoutPopupVisible(true); // Open confirmation modal first
  };

  const handleConfirmLogout = () => {
    setLogoutPopupVisible(false);

    if (onLogout) {
      onLogout();
    }

    router.replace("/home");
  };

  const toggleNotifications = () => {
    setShowProfile(false);
    setShowNotifs(!showNotifs);
  };

  const toggleProfile = () => {
    setShowNotifs(false);
    setShowProfile(!showProfile);
    if (onProfilePress) onProfilePress();
  };

  return (
    <>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Backdrop overlay to handle closing menus when clicking outside */}
      {(showNotifs || showProfile) && (
        <TouchableWithoutFeedback onPress={closeDropdowns}>
          <View style={S.backdrop} />
        </TouchableWithoutFeedback>
      )}

      {/* Render the Custom Logout Popup Modal */}
      <LogoutPopupOverlay
        visible={logoutPopupVisible}
        onClose={() => setLogoutPopupVisible(false)}
        onConfirm={handleConfirmLogout}
      />

      <Animated.View
        style={[
          S.wrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          isScrolled && S.wrapperScrolled,
        ]}
      >
        <View style={S.statusBarSpace} />
        <View style={S.navContent}>
          <View style={S.leftSection}>
            {isMobile && (
              <TouchableOpacity style={S.iconBtn} onPress={onMenuPress}>
                <View style={S.hamburgerStack}>
                  <View style={S.hamburgerLine} />
                  <View style={[S.hamburgerLine, { width: 12 }]} />
                  <View style={S.hamburgerLine} />
                </View>
              </TouchableOpacity>
            )}

            <View>
              <Text style={S.pageTitle}>{title}</Text>
              <Text style={S.pageSubtitle}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </Text>
            </View>
          </View>

          <View style={S.rightSection}>
            <View style={{ zIndex: 2001 }}>
              <IconBtn
                badge={unreadNotificationCount}
                onPress={toggleNotifications}
              >
                <Bell size={19} strokeWidth={1.8} />
              </IconBtn>

              {/* ─── Notifications Dropdown ─── */}
              {showNotifs && (
                <View style={[S.dropdown, { right: 0 }]}>
                  <View style={S.dropHead}>
                    <Text style={S.dropTitle}>Notifications</Text>
                    <TouchableOpacity onPress={closeDropdowns}>
                      <Text style={S.dropAction}>Mark all read</Text>
                    </TouchableOpacity>
                  </View>

                  {NOTIF_DATA.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={handleNotificationPress}
                      style={[
                        S.notifRow,
                        index < NOTIF_DATA.length - 1 && S.notifBorder,
                      ]}
                    >
                      <NotifTypeDot type={item.type} />
                      <View style={{ flex: 1 }}>
                        <Text style={S.notifMsg}>{item.msg}</Text>
                        <Text style={S.notifTime}>{item.time}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}

                  <View style={S.dropFooter}>
                    <TouchableOpacity
                      style={{ alignItems: "center" }}
                      onPress={handleNotificationPress}
                    >
                      <Text style={S.dropFooterText}>See all alerts</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View style={{ zIndex: 2001 }}>
              <Pressable
                style={({ pressed }) => [
                  S.profileCard,
                  pressed && S.profileChipPressed,
                ]}
                onPress={toggleProfile}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primary]}
                  style={S.avatar}
                >
                  <Text style={S.avatarText}>{userInfo.initials}</Text>
                </LinearGradient>

                {!isMobile && (
                  <>
                    <View style={S.profileTextBlock}>
                      <Text style={S.profileName} numberOfLines={1}>
                        {userInfo.name}
                      </Text>
                      <Text style={S.profileRole} numberOfLines={1}>
                        {userInfo.role}
                      </Text>
                    </View>
                    <ChevronDown size={14} color={COLORS.textSecondary} />
                  </>
                )}
              </Pressable>

              {/* ─── Profile Dropdown ─── */}
              {showProfile && (
                <View style={[S.dropdown, { right: 0, minWidth: 220 }]}>
                  <View style={S.dropHead}>
                    <View>
                      <Text style={S.dropTitle}>{userInfo.name}</Text>
                      <View style={S.onlineRow}>
                        <View style={S.onlineDot} />
                        <Text style={S.dropSubTitle}>Active Now</Text>
                      </View>
                    </View>
                  </View>

                  {/* <TouchableOpacity
                    style={S.dropItem}
                    onPress={() => {
                      router.push(
                        "/(dashboard)/housekeeping/_components/Profile",
                      );
                      closeDropdowns();
                    }}
                  >
                    <User size={16} color={COLORS.textSecondary} />
                    <Text style={S.dropItemText}>My Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={S.dropItem}
                    onPress={() => {
                      router.push(
                        "/(dashboard)/housekeeping/_components/supportpage",
                      );
                      closeDropdowns();
                    }}
                  >
                    <Shield size={16} color={COLORS.textSecondary} />
                    <Text style={S.dropItemText}>Security</Text>
                  </TouchableOpacity> */}

                  <View style={S.dropDivider} />

                  <TouchableOpacity
                    style={[S.dropItem, { marginBottom: 4 }]}
                    onPress={handleLogoutTrigger}
                  >
                    <LogOut size={16} color={COLORS.primary} />
                    <Text
                      style={[
                        S.dropItemText,
                        { color: COLORS.primary, fontWeight: "600" },
                      ]}
                    >
                      Log Out
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const S = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  wrapper: {
    width: "100%",
    backgroundColor: NB.bg,
    borderBottomWidth: 1,
    borderBottomColor: NB.border,
    shadowColor: NB.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1000,
  },
  wrapperScrolled: {
    shadowOpacity: 0.12,
    elevation: 10,
  },
  statusBarSpace: {
    height: Platform.select({
      ios: 48,
      android: RNStatusBar.currentHeight ?? 24,
      default: 0,
    }),
  },
  navContent: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    gap: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    flexShrink: 0,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: NB.border,
    backgroundColor: NB.bg,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "visible",
  },
  iconBtnHovered: {
    backgroundColor: NB.iconHoverBg,
    borderColor: NB.iconHoverBorder,
  },
  hamburgerStack: { gap: 4, alignItems: "flex-start" },
  hamburgerLine: {
    width: 15,
    height: 1.5,
    backgroundColor: NB.hamburgerColor,
    borderRadius: 1,
  },
  iconBadge: {
    position: "absolute",
    top: 0,
    right: 2,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: NB.badgeBg,
    borderWidth: 1.5,
    borderColor: NB.bg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  iconBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: COLORS.white,
  },
  searchBarFocused: {
    borderColor: NB.searchFocusBorder,
    backgroundColor: NB.bg,
    ...Platform.select({
      web: {
        boxShadow: "0 0 0 3px rgba(227,83,54,0.08)",
      } as any,
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.textPrimary,
    fontWeight: "400",
  },
  rightSection: {
    marginLeft: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  profileChipPressed: {
    backgroundColor: NB.profilePressed,
    borderColor: NB.profilePressedBorder,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  profileTextBlock: {
    flex: 1,
    overflow: "hidden",
    maxWidth: 100,
  },
  dropdown: {
    position: "absolute",
    top: 48,
    minWidth: 280,
    backgroundColor: NB.dropBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NB.dropBorder,
    shadowColor: COLORS.darkBg,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 14,
    zIndex: 2002,
    ...Platform.select({
      web: {
        boxShadow: "0 8px 30px rgba(42,19,8,0.11)",
      } as any,
    }),
  },
  dropHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: NB.border,
    gap: 10,
  },
  dropTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  dropSubTitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    opacity: 0.65,
  },
  dropAction: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16a34a",
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  notifBorder: {
    borderBottomWidth: 1,
    borderBottomColor: NB.border,
  },
  notifMsg: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textPrimary,
    lineHeight: 17,
  },
  notifTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
    opacity: 0.6,
    marginTop: 2,
  },
  dropFooter: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: NB.border,
  },
  dropFooterText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: COLORS.primary,
  },
  dropItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dropItemText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  dropDivider: {
    height: 1,
    backgroundColor: NB.border,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  pageSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  searchWrapper: {
    flex: 1,
    maxWidth: 500,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(92,46,20,0.08)",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    gap: 10,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(92,46,20,0.08)",
    borderRadius: 14,
    paddingHorizontal: 8,
    height: 46,
  },
  profileName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  profileRole: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
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

export default Navbar;
