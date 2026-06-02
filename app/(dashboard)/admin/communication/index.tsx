// app/admin/communication/index.tsx

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { router } from "expo-router";

import {
  Megaphone,
  Bell,
  MessageSquare,
  Search,
  Plus,
  Users,
  Send,
  Mail,
  Phone,
  TrendingUp,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";

export default function CommunicationIndex() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          padding: isMobile ? 14 : 18,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Communication Center
          </Text>

          <Text style={styles.subheading}>
            Manage circulars, notices and school communication
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              New Message
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search communication..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* STATS */}

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dbeafe" },
          ]}
        >
          <MessageSquare
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsNumber}>
            2,430
          </Text>

          <Text style={styles.statsLabel}>
            Total Messages
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <Megaphone
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsNumber}>
            128
          </Text>

          <Text style={styles.statsLabel}>
            Circulars
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Bell
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsNumber}>
            54
          </Text>

          <Text style={styles.statsLabel}>
            Notices
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#ede9fe" },
          ]}
        >
          <Users
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsNumber}>
            3.1K
          </Text>

          <Text style={styles.statsLabel}>
            Recipients
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            router.push(
              "/admin/communication/circulars"
            )
          }
        >
          <Megaphone
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.actionTitle}>
            Circulars
          </Text>

          <Text style={styles.actionDesc}>
            Create school circulars
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            router.push(
              "/admin/communication/notices"
            )
          }
        >
          <Bell
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.actionTitle}>
            Notices
          </Text>

          <Text style={styles.actionDesc}>
            Publish notices
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Send
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.actionTitle}>
            Broadcast
          </Text>

          <Text style={styles.actionDesc}>
            Send announcements
          </Text>
        </TouchableOpacity>
      </View>

      {/* RECENT COMMUNICATION */}

      <Text style={styles.sectionTitle}>
        Recent Communication
      </Text>

      <View style={styles.communicationList}>
        <View style={styles.communicationCard}>
          <View style={styles.communicationLeft}>
            <Mail
              size={18}
              color={PRIMARY}
            />

            <View>
              <Text style={styles.communicationTitle}>
                Exam Schedule Notice
              </Text>

              <Text style={styles.communicationTime}>
                Sent 2 hours ago
              </Text>
            </View>
          </View>

          <Text style={styles.sentText}>
            Sent
          </Text>
        </View>

        <View style={styles.communicationCard}>
          <View style={styles.communicationLeft}>
            <Phone
              size={18}
              color={PRIMARY}
            />

            <View>
              <Text style={styles.communicationTitle}>
                Parent Meeting Circular
              </Text>

              <Text style={styles.communicationTime}>
                Yesterday
              </Text>
            </View>
          </View>

          <Text style={styles.pendingText}>
            Pending
          </Text>
        </View>

        <View style={styles.communicationCard}>
          <View style={styles.communicationLeft}>
            <TrendingUp
              size={18}
              color={PRIMARY}
            />

            <View>
              <Text style={styles.communicationTitle}>
                Fee Reminder
              </Text>

              <Text style={styles.communicationTime}>
                3 days ago
              </Text>
            </View>
          </View>

          <Text style={styles.sentText}>
            Sent
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    paddingBottom: 80,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
    flexWrap: "wrap",
    gap: 14,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  addButton: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  searchContainer: {
    backgroundColor: CARD,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#111827",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  statsCard: {
    width: "48%",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },

  statsNumber: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
    color: "#0F172A",
  },

  statsLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#6B7280",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 14,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 24,
  },

  actionCard: {
    width: "31%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 18,
  },

  actionTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  actionDesc: {
    marginTop: 4,
    color: "#6B7280",
    lineHeight: 18,
    fontSize: 11,
  },

  communicationList: {
    marginBottom: 50,
  },

  communicationCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  communicationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  communicationTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  communicationTime: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 11,
  },

  sentText: {
    color: "#16A34A",
    fontWeight: "700",
    fontSize: 11,
  },

  pendingText: {
    color: "#D97706",
    fontWeight: "700",
    fontSize: 11,
  },
});