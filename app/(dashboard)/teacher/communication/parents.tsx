import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Search, User } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const COLORS = {
  bgWhite: "#FFFFFF",
  lightGray: "#F5F5F5",
  primary: "#E35336",
  textPrimary: "#5C2E14",
  textSecondary: "#A0522D",
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

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parent Chats</Text>
        <View style={{ width: 40 }} />
      </View>

      <View
        style={[styles.contentWrapper, { maxWidth: isDesktop ? 800 : "100%" }]}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search by student or parent name..."
            placeholderTextColor="#A0522D80"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {DUMMY_CHATS.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatCard}
              activeOpacity={0.7}
            >
              <View style={styles.avatar}>
                <User size={24} color={COLORS.primary} />
              </View>

              <View style={styles.chatDetails}>
                <View style={styles.chatHeader}>
                  <Text style={styles.parentName}>{chat.parentName}</Text>
                  <Text
                    style={[
                      styles.timeText,
                      chat.unread > 0 && {
                        color: COLORS.primary,
                        fontWeight: "800",
                      },
                    ]}
                  >
                    {chat.time}
                  </Text>
                </View>
                <Text style={styles.studentName}>
                  Parent of {chat.studentName}
                </Text>
                <Text
                  style={[
                    styles.lastMessage,
                    chat.unread > 0 && {
                      color: COLORS.textPrimary,
                      fontWeight: "600",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
              </View>

              {chat.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{chat.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  contentWrapper: { flex: 1, width: "100%", alignSelf: "center" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgWhite,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#EAEAEE",
  },
  searchIcon: { marginRight: 12 },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  listContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgWhite,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  chatDetails: { flex: 1 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  parentName: { fontSize: 16, fontWeight: "800", color: COLORS.textPrimary },
  timeText: { fontSize: 12, color: COLORS.textSecondary },
  studentName: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: 4,
  },
  lastMessage: { fontSize: 14, color: COLORS.textSecondary },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  unreadText: { color: COLORS.white, fontSize: 12, fontWeight: "800" },
});
