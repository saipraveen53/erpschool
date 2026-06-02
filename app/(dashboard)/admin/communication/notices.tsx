// app/admin/communication/notices.tsx

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

import { SafeAreaView } from "react-native-safe-area-context";

import {
  Search,
  Plus,
  Bell,
  Users,
  CalendarDays,
  Clock3,
  Eye,
  Pencil,
  Trash2,
  Send,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  ChevronRight,
  FileText,
} from "lucide-react-native";

/* ========================================= */
/* COLORS */
/* ========================================= */

const PRIMARY = "#A0522D";
const BACKGROUND = "#F5F5DC";
const WHITE = "#FFFFFF";
const LIGHT_BROWN = "#E7D7C9";

const TEXT_DARK = "#111827";
const TEXT_LIGHT = "#6B7280";

/* ========================================= */
/* DATA */
/* ========================================= */

const statsData = [
  {
    title: "Total Notices",
    value: "54",
    icon: "📄",
    color: "#DBEAFE",
  },

  {
    title: "Active Notices",
    value: "38",
    icon: "📢",
    color: "#DCFCE7",
  },

  {
    title: "Urgent Notices",
    value: "9",
    icon: "⚠️",
    color: "#FDE68A",
  },

  {
    title: "Recipients",
    value: "1.8K",
    icon: "👥",
    color: "#EDE9FE",
  },
];

const notices = [
  {
    id: 1,
    title: "School Reopens Monday",
    category: "General Notice",
    audience: "All Students",
    date: "12 July 2026",
    status: "Published",
  },

  {
    id: 2,
    title: "Exam Hall Ticket Collection",
    category: "Examination",
    audience: "Classes 9-10",
    date: "15 July 2026",
    status: "Urgent",
  },

  {
    id: 3,
    title: "Transport Delay Update",
    category: "Transport",
    audience: "Parents",
    date: "17 July 2026",
    status: "Draft",
  },
];

const activities = [
  {
    title: "Notice Published",
    desc: "Holiday notice published",
    time: "20 mins ago",
  },

  {
    title: "Urgent Alert",
    desc: "Transport update sent",
    time: "1 hour ago",
  },

  {
    title: "Notice Drafted",
    desc: "Exam schedule prepared",
    time: "Yesterday",
  },
];

/* ========================================= */
/* COMPONENT */
/* ========================================= */

export default function NoticesPage() {
  const { width } =
    useWindowDimensions();

  const isMobile = width < 768;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          padding: isMobile ? 16 : 22,
          paddingBottom: 100,
        }}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>
              Notice Board
            </Text>

            <Text
              style={styles.subheading}
            >
              Manage announcements and
              school notices
            </Text>
          </View>

          {/* DESKTOP ONLY */}

          {!isMobile && (
            <TouchableOpacity
              style={styles.addButton}
            >
              <Plus
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.addButtonText
                }
              >
                Add Notice
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SEARCH + FILTER */}

        <View
          style={[
            styles.searchRow,
            {
              flexDirection: isMobile
                ? "column"
                : "row",
            },
          ]}
        >
          <View style={styles.searchBox}>
            <Search
              size={20}
              color={TEXT_LIGHT}
            />

            <TextInput
              placeholder="Search notices..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
          >
            <Filter
              size={18}
              color={PRIMARY}
            />

            <Text
              style={styles.filterText}
            >
              Filter
            </Text>
          </TouchableOpacity>
        </View>

        {/* STATS */}

        <View
          style={[
            styles.statsContainer,
            {
              flexDirection: isMobile
                ? "column"
                : "row",
            },
          ]}
        >
          {statsData.map(
            (item, index) => (
              <View
                key={index}
                style={[
                  styles.statCard,
                  {
                    backgroundColor:
                      item.color,

                    width: isMobile
                      ? "100%"
                      : "48%",
                  },
                ]}
              >
                <Text
                  style={styles.statIcon}
                >
                  {item.icon}
                </Text>

                <Text
                  style={styles.statValue}
                >
                  {item.value}
                </Text>

                <Text
                  style={styles.statTitle}
                >
                  {item.title}
                </Text>
              </View>
            )
          )}
        </View>

        {/* QUICK ACTIONS */}

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View
          style={[
            styles.quickActions,
            {
              flexDirection: isMobile
                ? "column"
                : "row",
            },
          ]}
        >
          <TouchableOpacity
            style={styles.quickCard}
          >
            <Megaphone
              size={28}
              color={PRIMARY}
            />

            <Text
              style={styles.quickTitle}
            >
              Publish Notice
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
          >
            <Bell
              size={28}
              color={PRIMARY}
            />

            <Text
              style={styles.quickTitle}
            >
              Push Alert
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
          >
            <Send
              size={28}
              color={PRIMARY}
            />

            <Text
              style={styles.quickTitle}
            >
              Broadcast Message
            </Text>
          </TouchableOpacity>
        </View>

        {/* RECENT NOTICES */}

        <Text style={styles.sectionTitle}>
          Recent Notices
        </Text>

        {notices.map((item) => (
          <View
            key={item.id}
            style={styles.noticeCard}
          >
            {/* TOP */}

            <View
              style={styles.noticeTop}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={styles.noticeTitle}
                >
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.noticeCategory
                  }
                >
                  {item.category}
                </Text>
              </View>

              <View style={styles.arrowBox}>
                <ChevronRight
                  size={18}
                  color={PRIMARY}
                />
              </View>
            </View>

            {/* DETAILS */}

            <View
              style={[
                styles.detailsRow,
                {
                  flexDirection:
                    isMobile
                      ? "column"
                      : "row",
                },
              ]}
            >
              <View
                style={styles.detailCard}
              >
                <Users
                  size={18}
                  color={PRIMARY}
                />

                <Text
                  style={
                    styles.detailValue
                  }
                >
                  {item.audience}
                </Text>

                <Text
                  style={
                    styles.detailLabel
                  }
                >
                  Audience
                </Text>
              </View>

              <View
                style={styles.detailCard}
              >
                <CalendarDays
                  size={18}
                  color={PRIMARY}
                />

                <Text
                  style={
                    styles.detailValue
                  }
                >
                  {item.date}
                </Text>

                <Text
                  style={
                    styles.detailLabel
                  }
                >
                  Date
                </Text>
              </View>

              <View
                style={styles.detailCard}
              >
                <Clock3
                  size={18}
                  color={PRIMARY}
                />

                <Text
                  style={[
                    styles.detailValue,
                    {
                      color:
                        item.status ===
                        "Published"
                          ? "#15803D"
                          : item.status ===
                            "Urgent"
                          ? "#DC2626"
                          : "#D97706",
                    },
                  ]}
                >
                  {item.status}
                </Text>

                <Text
                  style={
                    styles.detailLabel
                  }
                >
                  Status
                </Text>
              </View>
            </View>

            {/* ACTIONS */}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={
                  styles.secondaryButton
                }
              >
                <Eye
                  size={15}
                  color={PRIMARY}
                />

                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  View
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.secondaryButton
                }
              >
                <Pencil
                  size={15}
                  color={PRIMARY}
                />

                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.secondaryButton
                }
              >
                <Trash2
                  size={15}
                  color="#DC2626"
                />

                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.primaryButton
                }
              >
                <Send
                  size={15}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* RECENT ACTIVITY */}

        <Text style={styles.sectionTitle}>
          Recent Activities
        </Text>

        <View style={styles.activityBox}>
          {activities.map(
            (item, index) => (
              <View
                key={index}
                style={
                  styles.activityItem
                }
              >
                <View
                  style={
                    styles.activityLeft
                  }
                >
                  <CheckCircle2
                    size={18}
                    color={PRIMARY}
                  />

                  <View
                    style={{
                      marginLeft: 12,
                    }}
                  >
                    <Text
                      style={
                        styles.activityTitle
                      }
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={
                        styles.activityDesc
                      }
                    >
                      {item.desc}
                    </Text>
                  </View>
                </View>

                <Text
                  style={
                    styles.activityTime
                  }
                >
                  {item.time}
                </Text>
              </View>
            )
          )}
        </View>

        {/* ALERTS */}

        <Text style={styles.sectionTitle}>
          Urgent Alerts
        </Text>

        <View style={styles.alertBox}>
          <View style={styles.alertItem}>
            <AlertTriangle
              size={20}
              color="#DC2626"
            />

            <View
              style={{ marginLeft: 12 }}
            >
              <Text
                style={styles.alertTitle}
              >
                Transport Delay
              </Text>

              <Text
                style={styles.alertDesc}
              >
                Buses delayed due to rain
              </Text>
            </View>
          </View>

          <View style={styles.alertItem}>
            <AlertTriangle
              size={20}
              color="#DC2626"
            />

            <View
              style={{ marginLeft: 12 }}
            >
              <Text
                style={styles.alertTitle}
              >
                Exam Hall Update
              </Text>

              <Text
                style={styles.alertDesc}
              >
                Seating arrangement changed
              </Text>
            </View>
          </View>
        </View>

        {/* DRAFTS */}

        <Text style={styles.sectionTitle}>
          Draft Notices
        </Text>

        <View style={styles.draftBox}>
          <View style={styles.draftItem}>
            <FileText
              size={20}
              color={PRIMARY}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={styles.draftTitle}
              >
                Sports Meet Schedule
              </Text>

              <Text
                style={styles.draftDesc}
              >
                Draft saved today
              </Text>
            </View>

            <TouchableOpacity>
              <Trash2
                size={18}
                color="#DC2626"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.draftItem}>
            <FileText
              size={20}
              color={PRIMARY}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={styles.draftTitle}
              >
                Holiday Notice
              </Text>

              <Text
                style={styles.draftDesc}
              >
                Draft saved yesterday
              </Text>
            </View>

            <TouchableOpacity>
              <Trash2
                size={18}
                color="#DC2626"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ========================================= */
/* STYLES */
/* ========================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 22,
    flexWrap: "wrap",
  },

  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 5,
    fontSize: 14,
    color: TEXT_LIGHT,
  },

  addButton: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 15,
    marginTop: 8,
  },

  addButtonText: {
    color: "#FFFFFF",
    marginLeft: 7,
    fontWeight: "700",
    fontSize: 14,
  },

  searchRow: {
    marginBottom: 22,
    gap: 10,
  },

  searchBox: {
    flex: 1,
    backgroundColor: WHITE,
    height: 54,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: TEXT_DARK,
  },

  filterButton: {
    height: 50,
    backgroundColor: LIGHT_BROWN,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  filterText: {
    marginLeft: 7,
    color: PRIMARY,
    fontWeight: "700",
    fontSize: 13,
  },

  statsContainer: {
    justifyContent:
      "space-between",
    flexWrap: "wrap",
    marginBottom: 18,
  },

  statCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 12,
  },

  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: TEXT_DARK,
  },

  statTitle: {
    marginTop: 5,
    color: TEXT_LIGHT,
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 16,
    marginTop: 8,
  },

  quickActions: {
    justifyContent:
      "space-between",
    marginBottom: 24,
  },

  quickCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 12,
  },

  quickTitle: {
    marginTop: 12,
    fontWeight: "700",
    color: TEXT_DARK,
    fontSize: 14,
  },

  noticeCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  noticeTop: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  noticeTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  noticeCategory: {
    color: TEXT_LIGHT,
    marginTop: 3,
    fontSize: 12,
  },

  arrowBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: LIGHT_BROWN,
    justifyContent: "center",
    alignItems: "center",
  },

  detailsRow: {
    marginTop: 16,
    justifyContent:
      "space-between",
  },

  detailCard: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 10,
  },

  detailValue: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: "900",
    color: PRIMARY,
    textAlign: "center",
  },

  detailLabel: {
    marginTop: 3,
    color: TEXT_LIGHT,
    fontSize: 11,
  },

  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },

  primaryButton: {
    height: 40,
    backgroundColor: PRIMARY,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 8,
    marginRight: 8,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 6,
    fontSize: 12,
  },

  secondaryButton: {
    height: 40,
    backgroundColor: LIGHT_BROWN,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 14,
    marginTop: 8,
    marginRight: 8,
  },

  secondaryButtonText: {
    color: PRIMARY,
    fontWeight: "700",
    marginLeft: 6,
    fontSize: 12,
  },

  activityBox: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },

  activityItem: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  activityTitle: {
    fontWeight: "700",
    color: TEXT_DARK,
    fontSize: 13,
  },

  activityDesc: {
    marginTop: 3,
    color: TEXT_LIGHT,
    fontSize: 11,
  },

  activityTime: {
    color: PRIMARY,
    fontWeight: "600",
    fontSize: 11,
  },

  alertBox: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },

  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  alertTitle: {
    fontWeight: "700",
    color: TEXT_DARK,
    fontSize: 13,
  },

  alertDesc: {
    marginTop: 3,
    color: TEXT_LIGHT,
    fontSize: 11,
  },

  draftBox: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    marginBottom: 34,
  },

  draftItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  draftTitle: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
  },

  draftDesc: {
    marginLeft: 12,
    marginTop: 3,
    fontSize: 11,
    color: TEXT_LIGHT,
  },
});