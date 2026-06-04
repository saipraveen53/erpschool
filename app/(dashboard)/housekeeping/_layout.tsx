import { Stack } from "expo-router";
import {
  CalendarClock,
  ClipboardCheckIcon,
  FileSearch2,
  LayoutDashboard,
  ReceiptText,
  User2Icon,
  Users2,
} from "lucide-react-native";
import React from "react";
import Sidebar from "./layout/Sidebar";

export default function AdminLayout() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/housekeeping/dashboard",
    },
    {
      name: "Attendance",
      icon: ClipboardCheckIcon,
      path: "/housekeeping/_components/attendance",
      badge: 3,
    },
    {
      name: "Staff",
      icon: Users2,
      path: "/housekeeping/_components/staff",
    },
    {
      name: "Complaints",
      icon: User2Icon,
      path: "/housekeeping/_components/complaints",
      badge: 5,
    },
    {
      name: "Inventory",
      icon: FileSearch2,
      path: "/housekeeping/_components/inventory",
    },
    {
      name: "Schedules",
      icon: CalendarClock,
      path: "/housekeeping/_components/schedules",
    },
    {
      name: "Task Management",
      icon: ReceiptText,
      path: "/housekeeping/_components/tasks",
      badge: 8,
    },
  ];

  return (
    <Sidebar
      menuItems={menuItems}
      userInfo={{
        name: "Housekeeping Admin",
        initials: "HA",
        role: "Administrator",
      }}
      onLogout={() => {
        console.log("Logout");
      }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="_components" />
      </Stack>
    </Sidebar>
  );
}
