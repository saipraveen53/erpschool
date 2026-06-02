// app/admin/_layout.tsx

import { Stack, router, usePathname } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";


import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";

import { useState } from "react";

import { StatusBar } from "expo-status-bar";

import {
  BookOpen,
  Bus,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  School2,
  Search,
  Users,
  X,
} from "lucide-react-native";

/* ======================================= */
/* THEME */
/* ======================================= */

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const WHITE = "#FFFFFF";
const LIGHT_BROWN = "#E7D7C9";

/* ======================================= */
/* MENU ITEMS */
/* ======================================= */

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    route: "/admin",
  },

  {
    title: "Students",
    icon: GraduationCap,
    route: "/admin/students",

    children: [
      {
        title: "Overview",
        route: "/admin/students",
      },

      {
        title: "Add Student",
        route: "/admin/students/add",
      },

      {
        title: "Bulk Upload",
        route: "/admin/students/bulk-upload",
      },

      {
        title: "Student Profile",
        route: "/admin/students/[id]",
      },
    ],
  },

  {
    title: "Staff",
    icon: Users,
    route: "/admin/staff",

    children: [
      {
        title: "Overview",
        route: "/admin/staff",
      },

      {
        title: "Add Staff",
        route: "/admin/staff/add",
      },

      {
        title: "Staff Profile",
        route: "/admin/staff/[id]",
      },
    ],
  },

  {
    title: "Attendance",
    icon: ClipboardCheck,
    route: "/admin/attendance",

    children: [
      {
        title: "Students",
        route: "/admin/attendance/student",
      },

      {
        title: "Staff",
        route: "/admin/attendance/staff",
      },
    ],
  },

  {
    title: "Classes",
    icon: School2,
    route: "/admin/classes",

    children: [
      {
        title: "Overview",
        route: "/admin/classes",
      },

      {
        title: "Sections",
        route: "/admin/classes/sections",
      },

      {
        title: "Subjects",
        route: "/admin/classes/subjects",
      },
    ],
  },

  {
    title: "Fees Collection",
    icon: CreditCard,
    route: "/admin/fees",

    children: [
      {
        title: "Overview",
        route: "/admin/fees",
      },

      {
        title: "Payments",
        route: "/admin/fees/payments",
      },

      {
        title: "Receipts",
        route: "/admin/fees/receipts",
      },

      {
        title: "Structure",
        route: "/admin/fees/structure",
      },
    ],
  },

  {
    title: "Examinations",
    icon: FileText,
    route: "/admin/examination",

    children: [
      {
        title: "Overview",
        route: "/admin/examination",
      },

      {
        title: "Exams",
        route: "/admin/examination/exams",
      },

      {
        title: "Hall Tickets",
        route: "/admin/examination/hall-tickets",
      },

      {
        title: "Marks Entry",
        route: "/admin/examination/marks-entry",
      },

      {
        title: "Results",
        route: "/admin/examination/results",
      },
    ],
  },

  {
    title: "Library",
    icon: BookOpen,
    route: "/admin/library",

    children: [
      {
        title: "Overview",
        route: "/admin/library",
      },

      {
        title: "Books",
        route: "/admin/library/books",
      },

      {
        title: "Issued Books",
        route: "/admin/library/issued",
      },
    ],
  },

  {
    title: "Timetable",
    icon: CalendarDays,
    route: "/admin/timetable",

    children: [
      {
        title: "Overview",
        route: "/admin/timetable",
      },

      {
        title: "Setup",
        route: "/admin/timetable/setup",
      },
    ],
  },

  {
    title: "Transport",
    icon: Bus,
    route: "/admin/transport",

    children: [
      {
        title: "Overview",
        route: "/admin/transport",
      },

      {
        title: "Buses",
        route: "/admin/transport/buses",
      },

      {
        title: "Routes",
        route: "/admin/transport/routes",
      },

      {
        title: "Tracking",
        route: "/admin/transport/tracking",
      },
    ],
  },

  {
    title: "Communication",
    icon: MessageSquare,
    route: "/admin/communication",

    children: [
      {
        title: "Overview",
        route: "/admin/communication",
      },

      {
        title: "Circulars",
        route: "/admin/communication/circulars",
      },

      {
        title: "Notices",
        route: "/admin/communication/notices",
      },
    ],
  },

  {
    title: "Reports",
    icon: FileText,
    route: "/admin/reports",

    children: [
      {
        title: "Overview",
        route: "/admin/reports",
      },

      {
        title: "Academic",
        route: "/admin/reports/academic",
      },

      {
        title: "Attendance",
        route: "/admin/reports/attendance",
      },

      {
        title: "Fee Collection",
        route: "/admin/reports/fee-collection",
      },
    ],
  },

  {
    title: "Holidays",
    icon: CalendarDays,
    route: "/admin/holidays",

    children: [
      {
        title: "Overview",
        route: "/admin/holidays",
      },
    ],
  },
];

/* ======================================= */
/* SIDEBAR */
/* ======================================= */

function Sidebar({
  collapsed,
  isMobile,
  setCollapsed,
}: any) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const [openMenus, setOpenMenus] =
    useState<any>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View
      style={{
        width:
          collapsed && !isMobile
            ? 85
            : isMobile
            ? 260
            : 270,

        backgroundColor: WHITE,

        borderRightWidth: 1,
        borderRightColor: "#ECECEC",

        paddingTop: isMobile ? 50 : 18,

        paddingHorizontal:
          collapsed && !isMobile
            ? 10
            : 14,

        height: "100%",
      }}
    >
      {/* CLOSE BUTTON */}

      {isMobile && (
        <TouchableOpacity
          onPress={() =>
            setCollapsed(false)
          }
          style={{
            position: "absolute",

            top:
              Platform.OS === "android"
                ? RNStatusBar.currentHeight
                  ? RNStatusBar.currentHeight + 8
                  : 18
                : 50,

            right: 12,

            width: 36,
            height: 36,

            borderRadius: 100,

            backgroundColor: "#F3F4F6",

            justifyContent: "center",
            alignItems: "center",

            zIndex: 999,
          }}
        >
          <X size={18} color="#111827" />
        </TouchableOpacity>
      )}

      {/* DESKTOP COLLAPSE */}

      {!isMobile && (
        <TouchableOpacity
          onPress={() =>
            setCollapsed(!collapsed)
          }
          style={{
            position: "absolute",
            top: 24,
            right: -12,

            width: 28,
            height: 28,

            borderRadius: 100,

            backgroundColor: WHITE,

            justifyContent: "center",
            alignItems: "center",

            elevation: 5,

            zIndex: 999,
          }}
        >
          {collapsed ? (
            <ChevronRight
              size={16}
              color="#111827"
            />
          ) : (
            <ChevronLeft
              size={16}
              color="#111827"
            />
          )}
        </TouchableOpacity>
      )}

      {/* LOGO */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          marginBottom: 24,

          paddingHorizontal: 4,
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,

            borderRadius: 12,

            backgroundColor: PRIMARY,

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <School2
            size={20}
            color="#FFFFFF"
          />
        </View>

        {!collapsed && (
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",

              color: PRIMARY,

              marginLeft: 12,
            }}
          >
            Edux
          </Text>
        )}
      </View>

      {/* MENU */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {menuItems.map(
          (item: any, index) => {
            const Icon = item.icon;

            const active =
              pathname === item.route ||
              (item.route !== "/admin" &&
                pathname.startsWith(
                  item.route
                ));

            const hasChildren =
              item.children;

            const menuKey = item.title
              .toLowerCase()
              .replace(/\s/g, "");

            return (
              <View key={index}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    if (hasChildren) {
                      toggleMenu(menuKey);
                    } else {
                      router.push(
                        item.route as any
                      );

                      if (isMobile) {
                        setCollapsed(
                          false
                        );
                      }
                    }
                  }}
                  style={{
                    flexDirection: "row",

                    alignItems: "center",

                    justifyContent:
                      "space-between",

                    paddingVertical: 13,
                    paddingHorizontal: 14,

                    borderRadius: 16,

                    marginBottom: 8,

                    backgroundColor:
                      active
                        ? PRIMARY
                        : "transparent",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      size={20}
                      color={
                        active
                          ? "#FFFFFF"
                          : "#6B7280"
                      }
                    />

                    {!collapsed && (
                      <Text
                        style={{
                          marginLeft: 14,

                          fontSize: 14,

                          fontWeight:
                            active
                              ? "700"
                              : "600",

                          color: active
                            ? "#FFFFFF"
                            : "#374151",
                        }}
                      >
                        {item.title}
                      </Text>
                    )}
                  </View>

                  {!collapsed &&
                    hasChildren && (
                      <>
                        {openMenus[
                          menuKey
                        ] ? (
                          <ChevronDown
                            size={16}
                            color={
                              active
                                ? "#FFFFFF"
                                : "#6B7280"
                            }
                          />
                        ) : (
                          <ChevronRight
                            size={16}
                            color={
                              active
                                ? "#FFFFFF"
                                : "#6B7280"
                            }
                          />
                        )}
                      </>
                    )}
                </TouchableOpacity>

                {!collapsed &&
                  hasChildren &&
                  openMenus[
                    menuKey
                  ] && (
                    <View
                      style={{
                        marginLeft: 18,
                        marginBottom: 10,
                      }}
                    >
                      {item.children.map(
                        (
                          child: any,
                          childIndex: number
                        ) => {
                          const childActive =
                            pathname ===
                            child.route;

                          return (
                            <TouchableOpacity
                              key={
                                childIndex
                              }
                              onPress={() => {
                                router.push(
                                  child.route as any
                                );

                                if (
                                  isMobile
                                ) {
                                  setCollapsed(
                                    false
                                  );
                                }
                              }}
                              style={{
                                paddingVertical: 10,
                                paddingHorizontal: 14,

                                borderRadius: 12,

                                marginBottom: 6,

                                backgroundColor:
                                  childActive
                                    ? LIGHT_BROWN
                                    : "transparent",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,

                                  fontWeight:
                                    childActive
                                      ? "700"
                                      : "500",

                                  color:
                                    childActive
                                      ? PRIMARY
                                      : "#6B7280",
                                }}
                              >
                                {
                                  child.title
                                }
                              </Text>
                            </TouchableOpacity>
                          );
                        }
                      )}
                    </View>
                  )}
              </View>
            );
          }
        )}
      </ScrollView>

{/* LOGOUT */}

<View
  style={{
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",

    paddingTop: 12,
    paddingBottom: 10,
  }}
>
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={async () => {
      try {
        await logout();

        router.replace("/");
      } catch (error) {
        console.log(
          "Logout Error:",
          error
        );
      }
    }}
    style={{
      flexDirection: "row",

      alignItems: "center",

      paddingVertical: 13,
      paddingHorizontal: 14,

      borderRadius: 16,

      backgroundColor: "#FEE2E2",
    }}
  >
    <LogOut
      size={20}
      color="#DC2626"
    />

    {!collapsed && (
      <Text
        style={{
          marginLeft: 14,

          fontSize: 14,

          fontWeight: "700",

          color: "#DC2626",
        }}
      >
        Logout
      </Text>
    )}
  </TouchableOpacity>
</View>
    </View>
  );
}

/* ======================================= */
/* NAVBAR */
/* ======================================= */

function Navbar({
  isMobile,
  setMobileSidebarOpen,
}: any) {
  return (
    <View
      style={{
        paddingTop:
          isMobile && Platform.OS === "android"
            ? RNStatusBar.currentHeight
            : isMobile
            ? 44
            : 0,

        height: isMobile ? 95 : 70,

        backgroundColor: WHITE,

        borderBottomWidth: 1,
        borderBottomColor: "#ECECEC",

        flexDirection: "row",
        alignItems: "center",

        justifyContent: "space-between",

        paddingHorizontal:
          isMobile ? 14 : 24,
      }}
    >
      {/* LEFT */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          flex: 1,
        }}
      >
        {/* MOBILE MENU */}

        {isMobile && (
          <TouchableOpacity
            onPress={() =>
              setMobileSidebarOpen(true)
            }
            style={{
              width: 38,
              height: 38,

              borderRadius: 12,

              backgroundColor: "#F5F5F5",

              justifyContent: "center",
              alignItems: "center",

              marginRight: 10,
            }}
          >
            <Menu
              size={20}
              color={PRIMARY}
            />
          </TouchableOpacity>
        )}

        {/* SEARCH BAR */}

        <View
          style={{
            flex: 1,

            height: isMobile ? 38 : 40,

            borderWidth: 1,
            borderColor: "#EFEFEF",

            borderRadius: 20,

            flexDirection: "row",
            alignItems: "center",

            paddingHorizontal: 12,

            backgroundColor: "#FAFAFA",
          }}
        >
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
            style={{
              flex: 1,

              fontSize: isMobile
                ? 12
                : 13,

              color: "#111827",

              paddingVertical: 0,
            }}
          />

          <Search
            size={14}
            color={PRIMARY}
          />
        </View>
      </View>

      {/* DESKTOP PROFILE */}

      {!isMobile && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            marginLeft: 14,
          }}
        >
          <Image
            source={{
              uri: "https://i.pravatar.cc/100",
            }}
            style={{
              width: 42,
              height: 42,

              borderRadius: 100,
            }}
          />
        </View>
      )}
    </View>
  );
}

/* ======================================= */
/* MAIN LAYOUT */
/* ======================================= */

export default function AdminLayout() {
  const [collapsed, setCollapsed] =
    useState(false);

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const { width } =
    useWindowDimensions();

  const isMobile = width < 768;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",

        backgroundColor: BACKGROUND,
      }}
    >
      <StatusBar style="light" />

      {/* MOBILE SIDEBAR */}

      {isMobile &&
        mobileSidebarOpen && (
          <>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                setMobileSidebarOpen(
                  false
                )
              }
              style={{
                position: "absolute",

                width: "100%",
                height: "100%",

                backgroundColor:
                  "rgba(0,0,0,0.35)",

                zIndex: 998,
              }}
            />

            <View
              style={{
                position: "absolute",

                left: 0,
                top: 0,

                height: "100%",

                zIndex: 999,
              }}
            >
              <Sidebar
                collapsed={false}
                isMobile={true}
                setCollapsed={
                  setMobileSidebarOpen
                }
              />
            </View>
          </>
        )}

      {/* DESKTOP SIDEBAR */}

      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          isMobile={false}
          setCollapsed={setCollapsed}
        />
      )}

      {/* MAIN */}

      <View
        style={{
          flex: 1,
        }}
      >
        <Navbar
          isMobile={isMobile}
          setMobileSidebarOpen={
            setMobileSidebarOpen
          }
        />

        <View
          style={{
            flex: 1,
          }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </View>
      </View>
    </View>
  );
}