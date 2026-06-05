import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Search, User } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
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

const DUMMY_CHATS = [
  {
    id: "1",
    parentName: "Rajiv Sharma",
    studentName: "Aarav Sharma",
    lastMessage: "Thank you for the update!",
    time: "10:30 AM",
    unread: 0,
  },
  {
    id: "2",
    parentName: "Meera Patel",
    studentName: "Priya Patel",
    lastMessage: "Will she need extra materials for the project?",
    time: "Yesterday",
    unread: 2,
  },
  {
    id: "3",
    parentName: "Vikram Gupta",
    studentName: "Rohan Gupta",
    lastMessage: "Noted.",
    time: "Monday",
    unread: 0,
  },
];

export default function ParentsCommunicationScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Teacher info state
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Loading...");
  const [assignedClass, setAssignedClass] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  // Animation refs for each chat item
  const fadeAnims = useRef(
    DUMMY_CHATS.map(() => new Animated.Value(0)),
  ).current;
  const slideAnims = useRef(
    DUMMY_CHATS.map(() => new Animated.Value(20)),
  ).current;

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
      120,
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
            Parent Chats
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

      <View
        className="flex-1 w-full self-center"
        style={{ maxWidth: isDesktop ? 800 : "100%" }}
      >
        {/* Search Bar */}
        <View
          className="flex-row items-center mx-5 mt-6 mb-4 rounded-xl border px-4"
          style={{
            backgroundColor: COLORS.surface,
            borderColor: COLORS.border,
          }}
        >
          <Search
            size={20}
            color={COLORS.textSecondary}
            style={{ marginRight: 12 }}
          />
          <TextInput
            className="flex-1 py-3.5 text-base"
            placeholder="Search by student or parent name..."
            placeholderTextColor={COLORS.textTertiary}
            style={{ color: COLORS.textPrimary }}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 40,
            gap: 12,
          }}
        >
          {loading ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            DUMMY_CHATS.map((chat, idx) => (
              <Animated.View
                key={chat.id}
                style={{
                  opacity: fadeAnims[idx],
                  transform: [{ translateY: slideAnims[idx] }],
                }}
              >
                <TouchableOpacity
                  className="flex-row items-center p-4 rounded-2xl border"
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
                  activeOpacity={0.7}
                  // onPress would route to individual chat room
                >
                  <View
                    className="w-12 h-12 rounded-full justify-center items-center mr-4"
                    style={{ backgroundColor: COLORS.primaryLight }}
                  >
                    <User size={24} color={COLORS.primary} />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-0.5">
                      <Text
                        className="text-base font-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {chat.parentName}
                      </Text>
                      <Text
                        className="text-xs"
                        style={[
                          { color: COLORS.textSecondary },
                          chat.unread > 0 && {
                            color: COLORS.primary,
                            fontWeight: "800",
                          },
                        ]}
                      >
                        {chat.time}
                      </Text>
                    </View>
                    <Text
                      className="text-xs font-bold mb-1"
                      style={{ color: COLORS.primary }}
                    >
                      Parent of {chat.studentName}
                    </Text>
                    <Text
                      className="text-sm"
                      numberOfLines={1}
                      style={[
                        { color: COLORS.textSecondary },
                        chat.unread > 0 && {
                          color: COLORS.textPrimary,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {chat.lastMessage}
                    </Text>
                  </View>

                  {chat.unread > 0 && (
                    <View
                      className="w-6 h-6 rounded-full justify-center items-center ml-3"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      <Text className="text-white text-xs font-bold">
                        {chat.unread}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
