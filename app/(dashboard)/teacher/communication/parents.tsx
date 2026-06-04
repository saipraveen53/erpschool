import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Search, User } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
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
  white: "#FFFFFF",
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

  // Animation refs for each chat item
  const fadeAnims = useRef(
    DUMMY_CHATS.map(() => new Animated.Value(0)),
  ).current;
  const slideAnims = useRef(
    DUMMY_CHATS.map(() => new Animated.Value(20)),
  ).current;

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
          Parent Chats
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View
        className="flex-1 w-full self-center"
        style={{ maxWidth: isDesktop ? 800 : "100%" }}
      >
        {/* Search Bar */}
        <View
          className="flex-row items-center mx-5 mt-6 mb-4 rounded-xl border px-4"
          style={{
            backgroundColor: COLORS.bgWhite,
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
            placeholderTextColor={`${COLORS.textSecondary}80`}
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
          {DUMMY_CHATS.map((chat, idx) => (
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
                  backgroundColor: COLORS.bgWhite,
                  borderColor: COLORS.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
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
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
