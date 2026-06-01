import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Megaphone, Plus } from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
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

const DUMMY_NOTICES = [
  {
    id: "1",
    title: "Upcoming Science Fair",
    date: "June 10, 2026",
    desc: "All 10th-grade students must submit their project proposals by this Friday.",
    isUrgent: false,
  },
  {
    id: "2",
    title: "Emergency: Campus Closed",
    date: "June 2, 2026",
    desc: "Due to heavy rainfall, the school will remain closed tomorrow.",
    isUrgent: true,
  },
  {
    id: "3",
    title: "Parent-Teacher Meeting",
    date: "May 28, 2026",
    desc: "Scheduled for this Saturday. Please ensure all grade books are updated.",
    isUrgent: false,
  },
];

export default function NoticesScreen() {
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
        <Text style={styles.headerTitle}>Notices</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.listContainer,
          { maxWidth: isDesktop ? 800 : "100%" },
        ]}
      >
        {DUMMY_NOTICES.map((notice) => (
          <View
            key={notice.id}
            style={[styles.noticeCard, notice.isUrgent && styles.urgentCard]}
          >
            <View style={styles.noticeHeader}>
              <View style={styles.titleRow}>
                <Megaphone
                  size={18}
                  color={notice.isUrgent ? COLORS.primary : COLORS.textPrimary}
                />
                <Text
                  style={[
                    styles.noticeTitle,
                    notice.isUrgent && { color: COLORS.primary },
                  ]}
                >
                  {notice.title}
                </Text>
              </View>
              <Text style={styles.noticeDate}>{notice.date}</Text>
            </View>
            <Text style={styles.noticeDesc}>{notice.desc}</Text>
          </View>
        ))}
      </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEE",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  addButton: {
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    padding: 8,
    borderRadius: 8,
  },
  listContainer: { padding: 24, alignSelf: "center", width: "100%", gap: 16 },
  noticeCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.textSecondary,
  },
  urgentCard: {
    borderLeftColor: COLORS.primary,
    backgroundColor: "rgba(227, 83, 54, 0.02)",
  },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    paddingRight: 12,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  noticeDate: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600" },
  noticeDesc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
});
