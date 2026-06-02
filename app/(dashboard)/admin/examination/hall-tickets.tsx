// app/admin/examination/hall-tickets.tsx

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
  Search,
  Plus,
  Ticket,
  Users,
  Download,
  Printer,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  FileText,
  Eye,
  Send,
  CalendarDays,
  UserCheck,
} from "lucide-react-native";

export default function HallTicketsPage() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          padding: isMobile ? 16 : 20,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            Hall Ticket Center
          </Text>

          <Text style={styles.subheading}>
            Generate and distribute examination hall tickets
          </Text>
        </View>

        {/* DESKTOP ONLY */}

        {!isMobile && (
          <TouchableOpacity style={styles.createButton}>
            <Plus size={16} color="#fff" />

            <Text style={styles.createButtonText}>
              Generate Tickets
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>
            Final Exam Hall Tickets
          </Text>

          <Text style={styles.heroSubtitle}>
            Distribution starts from 10 June 2026
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroMiniCard}>
              <Users
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                1,240 Students
              </Text>
            </View>

            <View style={styles.heroMiniCard}>
              <CalendarDays
                size={16}
                color="#A0522D"
              />

              <Text style={styles.heroMiniText}>
                18 Exams
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.heroButton}>
          <Download
            size={16}
            color="#fff"
          />

          <Text style={styles.heroButtonText}>
            Download All
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}

      <View style={styles.searchBox}>
        <Search size={18} color="#6B7280" />

        <TextInput
          placeholder="Search hall tickets..."
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
          <Ticket
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            1,240
          </Text>

          <Text style={styles.statsLabel}>
            Total Tickets
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#dcfce7" },
          ]}
        >
          <CheckCircle2
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            1,120
          </Text>

          <Text style={styles.statsLabel}>
            Issued
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: "#fde68a" },
          ]}
        >
          <Clock3
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            120
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
          <ShieldCheck
            size={28}
            color="#A0522D"
          />

          <Text style={styles.statsNumber}>
            100%
          </Text>

          <Text style={styles.statsLabel}>
            Verified
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <Printer
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Print Tickets
          </Text>

          <Text style={styles.actionDesc}>
            Print tickets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Send
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Send Online
          </Text>

          <Text style={styles.actionDesc}>
            Email tickets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Eye
            size={26}
            color="#A0522D"
          />

          <Text style={styles.actionTitle}>
            Preview
          </Text>

          <Text style={styles.actionDesc}>
            Preview tickets
          </Text>
        </TouchableOpacity>
      </View>

      {/* RECENT TICKETS */}

      <Text style={styles.sectionTitle}>
        Recent Hall Tickets
      </Text>

      <View style={styles.ticketList}>
        <View style={styles.ticketCard}>
          <View style={styles.ticketLeft}>
            <View style={styles.ticketIconBox}>
              <FileText
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.ticketName}>
                Class 10 Final Exams
              </Text>

              <Text style={styles.ticketDetails}>
                Generated • 540 Tickets
              </Text>
            </View>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              Published
            </Text>
          </View>
        </View>

        <View style={styles.ticketCard}>
          <View style={styles.ticketLeft}>
            <View style={styles.ticketIconBox}>
              <UserCheck
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.ticketName}>
                Class 12 Midterm Exams
              </Text>

              <Text style={styles.ticketDetails}>
                Pending Approval
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: "#FEF3C7" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: "#B45309" },
              ]}
            >
              Pending
            </Text>
          </View>
        </View>

        <View style={styles.ticketCard}>
          <View style={styles.ticketLeft}>
            <View style={styles.ticketIconBox}>
              <Printer
                size={20}
                color="#A0522D"
              />
            </View>

            <View>
              <Text style={styles.ticketName}>
                Science Practical Exams
              </Text>

              <Text style={styles.ticketDetails}>
                Printed Successfully
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: "#DCFCE7" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: "#15803D" },
              ]}
            >
              Completed
            </Text>
          </View>
        </View>
      </View>

      {/* ANALYTICS */}

      <Text style={styles.sectionTitle}>
        Distribution Analytics
      </Text>

      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>
            96%
          </Text>

          <Text style={styles.analyticsLabel}>
            Delivered
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>
            1.1K
          </Text>

          <Text style={styles.analyticsLabel}>
            Downloads
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsNumber}>
            98%
          </Text>

          <Text style={styles.analyticsLabel}>
            Verification
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },

  content: {
    paddingBottom: 80,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: "#A0522D",
  },

  subheading: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },

  createButton: {
    backgroundColor: "#A0522D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  createButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },

  heroCard: {
    backgroundColor: "#A0522D",
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
  },

  heroLeft: {
    marginBottom: 16,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  heroSubtitle: {
    color: "#F5F5DC",
    marginTop: 8,
    fontSize: 13,
  },

  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
  },

  heroMiniCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  heroMiniText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#111827",
  },

  heroButton: {
    backgroundColor: "#7C2D12",
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  searchBox: {
    backgroundColor: "#fff",
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
    fontSize: 14,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  statsCard: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  statsNumber: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
    color: "#111827",
  },

  statsLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#A0522D",
    marginBottom: 14,
  },

  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  actionCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: "center",
  },

  actionTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  actionDesc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
  },

  ticketList: {
    marginBottom: 24,
  },

  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ticketLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  ticketIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F5F5DC",
    justifyContent: "center",
    alignItems: "center",
  },

  ticketName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  ticketDetails: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },

  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    color: "#15803D",
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
    fontSize: 20,
    fontWeight: "900",
    color: "#A0522D",
  },

  analyticsLabel: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
  },
});