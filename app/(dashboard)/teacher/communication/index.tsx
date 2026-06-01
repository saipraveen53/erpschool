import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    ChevronRight,
    Megaphone,
    MessageSquare,
} from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

const COLORS = {
  bgWhite: "#FFFFFF",
  lightGray: "#F5F5F5",
  primary: "#E35336",
  darkBg: "#2A1308",
  textPrimary: "#5C2E14",
  textSecondary: "#A0522D",
  white: "#FFFFFF",
};

export default function CommunicationIndexScreen() {
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

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Communication</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.contentWrapper,
          { maxWidth: isDesktop ? 800 : "100%" },
        ]}
      >
        <Text style={styles.sectionDescription}>
          Manage school-wide announcements or communicate directly with parents.
        </Text>

        {/* NOTICES CARD */}
        <TouchableOpacity
          style={styles.navCard}
          activeOpacity={0.8}
          onPress={() => router.push("/teacher/communication/notices")}
        >
          <View style={styles.iconContainer}>
            <Megaphone size={28} color={COLORS.primary} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Notices & Circulars</Text>
            <Text style={styles.cardDesc}>
              Post and view announcements for students and staff.
            </Text>
          </View>
          <ChevronRight size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* PARENTS CARD */}
        <TouchableOpacity
          style={styles.navCard}
          activeOpacity={0.8}
          onPress={() => router.push("/teacher/communication/parents")}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: "rgba(92, 46, 20, 0.1)" },
            ]}
          >
            <MessageSquare size={28} color={COLORS.textPrimary} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Direct Messages</Text>
            <Text style={styles.cardDesc}>
              Chat securely with parents regarding student progress.
            </Text>
          </View>
          <ChevronRight size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
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
  contentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignSelf: "center",
    width: "100%",
  },
  sectionDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextContainer: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
});
