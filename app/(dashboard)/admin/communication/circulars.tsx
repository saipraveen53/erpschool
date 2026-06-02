// app/admin/communication/circulars.tsx

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

import {
  Megaphone,
  Search,
  Plus,
  Clock3,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  Send,
  CalendarDays,
  Download,
  Eye,
} from "lucide-react-native";

const PRIMARY = "#A0522D";
const BG = "#F5F5DC";
const CARD = "#FFFFFF";

export default function CircularsPage() {
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
            Circular Management
          </Text>

          <Text style={styles.subheading}>
            Manage school circulars, notices and announcements
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.addButtonText}>
              Create Circular
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search circulars..."
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
          <FileText
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsNumber}>
            128
          </Text>

          <Text style={styles.statsLabel}>
            Total Circulars
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
            112
          </Text>

          <Text style={styles.statsLabel}>
            Published
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Clock3
            size={26}
            color={PRIMARY}
          />

          <Text style={styles.statsNumber}>
            16
          </Text>

          <Text style={styles.statsLabel}>
            Pending
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
            2.4K
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
        <TouchableOpacity style={styles.actionCard}>
          <Send size={28} color={PRIMARY} />

          <Text style={styles.actionTitle}>
            Send Circular
          </Text>

          <Text style={styles.actionDesc}>
            Broadcast circular instantly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <CalendarDays
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.actionTitle}>
            Schedule
          </Text>

          <Text style={styles.actionDesc}>
            Schedule future circulars
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Download
            size={28}
            color={PRIMARY}
          />

          <Text style={styles.actionTitle}>
            Export
          </Text>

          <Text style={styles.actionDesc}>
            Download circular reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* RECENT CIRCULARS */}

      <Text style={styles.sectionTitle}>
        Recent Circulars
      </Text>

      <View style={styles.circularList}>
        <View style={styles.circularCard}>
          <View style={styles.circularLeft}>
            <View style={styles.iconBox}>
              <Megaphone
                size={18}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.circularTitle}>
                Annual Sports Day Circular
              </Text>

              <Text style={styles.circularTime}>
                Published • 2 hours ago
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <CheckCircle2
              size={16}
              color="#16A34A"
            />

            <Text style={styles.publishedText}>
              Published
            </Text>
          </View>
        </View>

        <View style={styles.circularCard}>
          <View style={styles.circularLeft}>
            <View style={styles.iconBox}>
              <FileText
                size={18}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.circularTitle}>
                Fee Payment Reminder
              </Text>

              <Text style={styles.circularTime}>
                Scheduled • Tomorrow
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <AlertCircle
              size={16}
              color="#D97706"
            />

            <Text style={styles.pendingText}>
              Pending
            </Text>
          </View>
        </View>

        <View style={styles.circularCard}>
          <View style={styles.circularLeft}>
            <View style={styles.iconBox}>
              <Eye
                size={18}
                color={PRIMARY}
              />
            </View>

            <View>
              <Text style={styles.circularTitle}>
                Exam Hall Instructions
              </Text>

              <Text style={styles.circularTime}>
                Published • Yesterday
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <CheckCircle2
              size={16}
              color="#16A34A"
            />

            <Text style={styles.publishedText}>
              Published
            </Text>
          </View>
        </View>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Circular Analytics
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>
            96%
          </Text>

          <Text style={styles.analyticsLabel}>
            Read Rate
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>
            1.8K
          </Text>

          <Text style={styles.analyticsLabel}>
            Downloads
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>
            324
          </Text>

          <Text style={styles.analyticsLabel}>
            Responses
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

  circularList: {
    marginBottom: 24,
  },

  circularCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  circularLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F5F5DC",
    justifyContent: "center",
    alignItems: "center",
  },

  circularTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  circularTime: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 11,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  publishedText: {
    color: "#16A34A",
    fontWeight: "700",
    fontSize: 11,
  },

  pendingText: {
    color: "#D97706",
    fontWeight: "700",
    fontSize: 11,
  },

  analyticsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
  },

  analyticsNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
  },

  analyticsLabel: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 11,
  },
});