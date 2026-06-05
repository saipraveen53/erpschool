import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  ChevronRight,
  Megaphone,
  MessageSquare,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { teacherClient } from "../Axios/teacherClient";

// Modern, vibrant color palette (matches dashboard)
const COLORS = {
  primary: "#F59E0B", // Amber
  primaryDark: "#D97706",
  primaryLight: "#FEF3C7",
  secondary: "#10B981", // Emerald
  secondaryDark: "#059669",
  accent: "#3B82F6", // Blue
  navy: "#0F172A",
  navyLight: "#1E293B",
  surface: "#FFFFFF",
  background: "#F1F5F9", // Slate-100
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  border: "#E2E8F0",
  success: "#10B981",
  warning: "#F59E0B",
  white: "#FFFFFF",
  lightGray: "#F3F4F6",
};

const navItems = [
  {
    title: "Notices & Circulars",
    desc: "Post and view announcements for students and staff.",
    icon: Megaphone,
    route: "/teacher/communication/notices",
    iconBg: COLORS.primaryLight,
    iconColor: COLORS.primary,
  },
  {
    title: "Direct Messages",
    desc: "Chat securely with parents regarding student progress.",
    icon: MessageSquare,
    route: "/teacher/communication/parents",
    iconBg: `${COLORS.textPrimary}10`,
    iconColor: COLORS.textPrimary,
  },
];

export default function CommunicationIndexScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Teacher info state
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  // Animation values
  const fadeAnims = useRef(navItems.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(navItems.map(() => new Animated.Value(30))).current;

  // Fetch teacher info (using class-sections to get teacher's own class)
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const currentTeacherId =
          Platform.OS === "web"
            ? localStorage.getItem("userUsername")
            : await AsyncStorage.getItem("userUsername");
        if (!currentTeacherId) return;
        setTeacherId(currentTeacherId);

        const classSectionsRes = await teacherClient.get(
          "/api/student/class-sections",
        );
        const fetchedClasses = classSectionsRes.data;
        const assigned = fetchedClasses.find(
          (c: any) => c.classTeacherId === currentTeacherId,
        );
        if (assigned) {
          setTeacherName(assigned.classTeacherName.trim());
          setAssignedClass(
            `${assigned.className}-${assigned.section.toUpperCase()}`,
          );
        } else {
          setTeacherName("Not Found");
          setAssignedClass("None");
        }
      } catch (err) {
        console.error("Failed to load teacher info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherInfo();
  }, []);

  useEffect(() => {
    Animated.stagger(
      150,
      fadeAnims.map((anim, idx) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnims[idx], {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
  }, []);

  // Header padding values: reduced for web
  const headerPaddingTop =
    Platform.OS === "web" ? 16 : Platform.OS === "android" ? 48 : 40;
  const headerPaddingBottom = Platform.OS === "web" ? 16 : 20;

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.navy}
        translucent={false}
      />

      {/* Modern Gradient Header */}
      <LinearGradient
        colors={[COLORS.navy, COLORS.navyLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          paddingTop: headerPaddingTop,
          paddingBottom: headerPaddingBottom,
          paddingHorizontal: 24,
        }}
      >
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full bg-white/10"
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={COLORS.surface} />
          </TouchableOpacity>
          <Text
            className="text-xl font-bold tracking-tight"
            style={{ color: COLORS.surface }}
          >
            Communication
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {/* Teacher Info Bar */}
      <View
        className="flex-row justify-between px-5 py-3 mx-4 mt-4 rounded-2xl"
        style={{
          backgroundColor: COLORS.surface,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            },
            android: { elevation: 2 },
            web: { boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" },
          }),
        }}
      >
        <Text
          className="text-xs font-medium"
          style={{ color: COLORS.textSecondary, flex: 1 }}
          numberOfLines={1}
        >
          Teacher: {teacherName} ({teacherId})
        </Text>
        <Text
          className="text-xs font-medium"
          style={{ color: COLORS.textSecondary }}
          numberOfLines={1}
        >
          Class: {assignedClass}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 32,
          maxWidth: isDesktop ? 800 : "100%",
          alignSelf: "center",
          width: "100%",
          gap: 16,
        }}
      >
        {loading ? (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            <Text
              className="text-base leading-6 mb-2"
              style={{ color: COLORS.textSecondary }}
            >
              Manage school-wide announcements or communicate directly with
              parents.
            </Text>

            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Animated.View
                  key={index}
                  style={{
                    opacity: fadeAnims[index],
                    transform: [{ translateY: slideAnims[index] }],
                  }}
                >
                  <TouchableOpacity
                    className="flex-row items-center p-5 rounded-2xl border"
                    style={{
                      backgroundColor: COLORS.surface,
                      borderColor: COLORS.border,
                      ...Platform.select({
                        ios: {
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.05,
                          shadowRadius: 6,
                        },
                        android: { elevation: 2 },
                        web: { boxShadow: "0px 2px 6px rgba(0,0,0,0.05)" },
                      }),
                    }}
                    activeOpacity={0.8}
                    onPress={() => router.push(item.route as any)}
                  >
                    <View
                      className="w-14 h-14 rounded-2xl justify-center items-center mr-4"
                      style={{ backgroundColor: item.iconBg }}
                    >
                      <Icon size={28} color={item.iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-lg font-bold mb-1"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        className="text-xs leading-5"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {item.desc}
                      </Text>
                    </View>
                    <ChevronRight size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}
