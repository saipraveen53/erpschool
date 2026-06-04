import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  ChevronRight,
  Megaphone,
  MessageSquare,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const COLORS = {
  // Theme palette
  primary: "#E35336",
  accent: "#F5F50C",
  secondary: "#F4A460",
  primaryLight: "#FEE2DB",
  secondaryLight: "#FEF0E8",
  bgWarm: "#FFF8F2",
  bgWhite: "#FFFFFF",
  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  border: "#F0E4D8",
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
    iconBg: "rgba(92, 46, 20, 0.1)",
    iconColor: COLORS.textPrimary,
  },
];

export default function CommunicationIndexScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Animation values
  const fadeAnims = useRef(navItems.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(navItems.map(() => new Animated.Value(30))).current;

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

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.bgWarm }}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* Header */}
      <View
        className="flex-row items-center justify-between px-5 pb-4 border-b"
        style={{
          paddingTop: 40,
          backgroundColor: COLORS.bgWhite,
          borderBottomColor: COLORS.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-xl"
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text
          className="text-xl font-bold tracking-tight"
          style={{ color: COLORS.textPrimary }}
        >
          Communication
        </Text>
        <View style={{ width: 40 }} />
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
        <Text
          className="text-base leading-6 mb-4"
          style={{ color: COLORS.textSecondary }}
        >
          Manage school-wide announcements or communicate directly with parents.
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
                  backgroundColor: COLORS.bgWhite,
                  borderColor: COLORS.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
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
      </ScrollView>
    </View>
  );
}
