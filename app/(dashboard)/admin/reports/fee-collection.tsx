// app/admin/reports/fee-collection.tsx

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  Search,
  Plus,
  IndianRupee,
  Wallet,
  TrendingUp,
  Users,
  Bell,
  Download,
  Upload,
  PieChart,
  BarChart3,
  CreditCard,
  Receipt,
  Sparkles,
  ChevronRight,
  Filter,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react-native";

/* ========================================= */
/* UPDATED COLORS */
/* ========================================= */

const PRIMARY = "#203744";

const ACCENT = "#22C7E5";

const BACKGROUND = "#F1F5F9";

const CARD = "#FFFFFF";

const LIGHT = "#E7FAFD";

const BORDER = "#DCE7EF";

const TEXT_DARK = "#1E293B";

const TEXT_LIGHT = "#64748B";

export default function FeeCollectionReportsPage() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <StatusBar style="dark" />

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            Fee Collection Reports
          </Text>

          <Text
            style={
              styles.subheading
            }
          >
            Smart fee analytics
            and financial
            performance
            monitoring
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
        >
          <Plus
            size={18}
            color="#fff"
          />

          <Text
            style={
              styles.addButtonText
            }
          >
            Generate Report
          </Text>
        </TouchableOpacity>
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Sparkles
            size={42}
            color="#fff"
          />

          <Text style={styles.heroTitle}>
            Financial Intelligence
          </Text>

          <Text
            style={
              styles.heroSubtitle
            }
          >
            Track collections,
            pending fees and
            school revenue in
            real-time
          </Text>

          <TouchableOpacity
            style={styles.heroButton}
          >
            <Text
              style={
                styles.heroButtonText
              }
            >
              View Insights
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadge}>
          <IndianRupee
            size={32}
            color={PRIMARY}
          />

          <Text
            style={
              styles.heroBadgeText
            }
          >
            ₹24L Collected
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View
        style={
          styles.searchContainer
        }
      >
        <Search
          size={20}
          color={TEXT_LIGHT}
        />

        <TextInput
          placeholder="Search financial reports..."
          placeholderTextColor={
            TEXT_LIGHT
          }
          style={styles.searchInput}
        />

        <TouchableOpacity
          style={styles.filterButton}
        >
          <Filter
            size={18}
            color={PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {/* STATS */}

      <View style={styles.statsGrid}>
        <View
          style={styles.statCard}
        >
          <Wallet
            size={34}
            color={ACCENT}
          />

          <Text
            style={styles.statValue}
          >
            ₹24L
          </Text>

          <Text
            style={styles.statLabel}
          >
            Total Collection
          </Text>
        </View>

        <View
          style={styles.statCard}
        >
          <CheckCircle2
            size={34}
            color={ACCENT}
          />

          <Text
            style={styles.statValue}
          >
            92%
          </Text>

          <Text
            style={styles.statLabel}
          >
            Fee Completion
          </Text>
        </View>

        <View
          style={styles.statCard}
        >
          <AlertTriangle
            size={34}
            color={ACCENT}
          />

          <Text
            style={styles.statValue}
          >
            ₹2.4L
          </Text>

          <Text
            style={styles.statLabel}
          >
            Pending Fees
          </Text>
        </View>

        <View
          style={styles.statCard}
        >
          <TrendingUp
            size={34}
            color={ACCENT}
          />

          <Text
            style={styles.statValue}
          >
            +18%
          </Text>

          <Text
            style={styles.statLabel}
          >
            Revenue Growth
          </Text>
        </View>
      </View>

      {/* REPORT MODULES */}

      <Text style={styles.sectionTitle}>
        Financial Modules
      </Text>

      <View style={styles.moduleGrid}>
        <TouchableOpacity
          style={styles.moduleCard}
        >
          <View
            style={
              styles.moduleIcon
            }
          >
            <PieChart
              size={32}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.moduleTitle
            }
          >
            Collection Analytics
          </Text>

          <Text
            style={styles.moduleDesc}
          >
            Analyze payment
            trends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moduleCard}
        >
          <View
            style={
              styles.moduleIcon
            }
          >
            <BarChart3
              size={32}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.moduleTitle
            }
          >
            Revenue Reports
          </Text>

          <Text
            style={styles.moduleDesc}
          >
            Monitor income growth
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moduleCard}
        >
          <View
            style={
              styles.moduleIcon
            }
          >
            <Activity
              size={32}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.moduleTitle
            }
          >
            Payment Insights
          </Text>

          <Text
            style={styles.moduleDesc}
          >
            Smart fee
            intelligence
          </Text>
        </TouchableOpacity>
      </View>

      {/* RECENT PAYMENTS */}

      <Text style={styles.sectionTitle}>
        Recent Collections
      </Text>

      <View
        style={
          styles.listContainer
        }
      >
        <TouchableOpacity
          style={styles.paymentCard}
        >
          <View
            style={
              styles.paymentLeft
            }
          >
            <View
              style={styles.iconBox}
            >
              <CreditCard
                size={22}
                color={ACCENT}
              />
            </View>

            <View>
              <Text
                style={
                  styles.paymentName
                }
              >
                Rahul Sharma
              </Text>

              <Text
                style={
                  styles.paymentInfo
                }
              >
                Grade 10 • ₹45,000
                Paid
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color={TEXT_LIGHT}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentCard}
        >
          <View
            style={
              styles.paymentLeft
            }
          >
            <View
              style={styles.iconBox}
            >
              <Receipt
                size={22}
                color={ACCENT}
              />
            </View>

            <View>
              <Text
                style={
                  styles.paymentName
                }
              >
                Priya Patel
              </Text>

              <Text
                style={
                  styles.paymentInfo
                }
              >
                Grade 9 • ₹38,000
                Paid
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color={TEXT_LIGHT}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentCard}
        >
          <View
            style={
              styles.paymentLeft
            }
          >
            <View
              style={styles.iconBox}
            >
              <IndianRupee
                size={22}
                color={ACCENT}
              />
            </View>

            <View>
              <Text
                style={
                  styles.paymentName
                }
              >
                Aryan Gupta
              </Text>

              <Text
                style={
                  styles.paymentInfo
                }
              >
                Grade 8 • ₹40,000
                Paid
              </Text>
            </View>
          </View>

          <ChevronRight
            size={20}
            color={TEXT_LIGHT}
          />
        </TouchableOpacity>
      </View>

      {/* QUICK ACTIONS */}

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickCard}
        >
          <Download
            size={34}
            color={ACCENT}
          />

          <Text
            style={styles.quickTitle}
          >
            Export Reports
          </Text>

          <Text
            style={styles.quickDesc}
          >
            Download collection
            reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
        >
          <Upload
            size={34}
            color={ACCENT}
          />

          <Text
            style={styles.quickTitle}
          >
            Upload Records
          </Text>

          <Text
            style={styles.quickDesc}
          >
            Import payment
            records
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
        >
          <Bell
            size={34}
            color={ACCENT}
          />

          <Text
            style={styles.quickTitle}
          >
            Payment Alerts
          </Text>

          <Text
            style={styles.quickDesc}
          >
            Notify pending
            payments
          </Text>
        </TouchableOpacity>
      </View>

      {/* INSIGHTS */}

      <Text style={styles.sectionTitle}>
        Financial Insights
      </Text>

      <View
        style={
          styles.analyticsContainer
        }
      >
        <View
          style={
            styles.analyticsCard
          }
        >
          <TrendingUp
            size={30}
            color={ACCENT}
          />

          <Text
            style={
              styles.analyticsValue
            }
          >
            +18%
          </Text>

          <Text
            style={
              styles.analyticsLabel
            }
          >
            Revenue Growth
          </Text>
        </View>

        <View
          style={
            styles.analyticsCard
          }
        >
          <CalendarDays
            size={30}
            color={ACCENT}
          />

          <Text
            style={
              styles.analyticsValue
            }
          >
            ₹24L
          </Text>

          <Text
            style={
              styles.analyticsLabel
            }
          >
            Monthly Collection
          </Text>
        </View>

        <View
          style={
            styles.analyticsCard
          }
        >
          <Users
            size={30}
            color={ACCENT}
          />

          <Text
            style={
              styles.analyticsValue
            }
          >
            1.1K
          </Text>

          <Text
            style={
              styles.analyticsLabel
            }
          >
            Paid Students
          </Text>
        </View>
      </View>

      {/* RECENT ACTIVITY */}

      <Text style={styles.sectionTitle}>
        Recent Activity
      </Text>

      <View
        style={
          styles.activityContainer
        }
      >
        <View
          style={styles.activityCard}
        >
          <View
            style={
              styles.activityDot
            }
          />

          <View>
            <Text
              style={
                styles.activityTitle
              }
            >
              Grade 10 collection
              report generated
            </Text>

            <Text
              style={
                styles.activityTime
              }
            >
              2 hours ago
            </Text>
          </View>
        </View>

        <View
          style={styles.activityCard}
        >
          <View
            style={
              styles.activityDot
            }
          />

          <View>
            <Text
              style={
                styles.activityTitle
              }
            >
              Pending fee reminders
              sent
            </Text>

            <Text
              style={
                styles.activityTime
              }
            >
              Today
            </Text>
          </View>
        </View>

        <View
          style={styles.activityCard}
        >
          <View
            style={
              styles.activityDot
            }
          />

          <View>
            <Text
              style={
                styles.activityTitle
              }
            >
              Revenue analytics
              updated
            </Text>

            <Text
              style={
                styles.activityTime
              }
            >
              Yesterday
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      BACKGROUND,
  },

  content: {
    padding: 24,
    paddingBottom: 80,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 28,
  },

  heading: {
    fontSize: 40,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 8,
    color: TEXT_LIGHT,
    fontSize: 16,
  },

  addButton: {
    backgroundColor:
      ACCENT,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  heroCard: {
    backgroundColor:
      PRIMARY,
    borderRadius: 30,
    padding: 28,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  heroLeft: {
    maxWidth: "70%",
  },

  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 14,
  },

  heroSubtitle: {
    color: "#DCE7EF",
    marginTop: 10,
    lineHeight: 24,
  },

  heroButton: {
    marginTop: 22,
    backgroundColor:
      ACCENT,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    alignSelf: "flex-start",
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  heroBadge: {
    backgroundColor:
      "#fff",
    padding: 22,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  heroBadgeText: {
    marginTop: 10,
    fontWeight: "800",
    color: PRIMARY,
  },

  searchContainer: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: BORDER,
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: TEXT_DARK,
  },

  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
    marginBottom: 32,
  },

  statCard: {
    width: "48%",
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },

  statValue: {
    fontSize: 34,
    fontWeight: "900",
    color: TEXT_DARK,
    marginTop: 16,
  },

  statLabel: {
    marginTop: 8,
    fontSize: 15,
    color: TEXT_LIGHT,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 20,
  },

  moduleGrid: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 34,
  },

  moduleCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },

  moduleIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor:
      ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },

  moduleTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  moduleDesc: {
    marginTop: 8,
    color: TEXT_LIGHT,
  },

  listContainer: {
    marginBottom: 34,
  },

  paymentCard: {
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  paymentName: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  paymentInfo: {
    marginTop: 6,
    color: TEXT_LIGHT,
  },

  quickGrid: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 34,
  },

  quickCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },

  quickTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  quickDesc: {
    marginTop: 8,
    color: TEXT_LIGHT,
    lineHeight: 22,
  },

  analyticsContainer: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 34,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: CARD,
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  analyticsValue: {
    marginTop: 14,
    fontSize: 30,
    fontWeight: "900",
    color: PRIMARY,
  },

  analyticsLabel: {
    marginTop: 8,
    color: TEXT_LIGHT,
    textAlign: "center",
  },

  activityContainer: {
    marginBottom: 80,
  },

  activityCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  activityDot: {
    width: 14,
    height: 14,
    borderRadius: 20,
    backgroundColor:
      ACCENT,
    marginRight: 16,
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
  },

  activityTime: {
    marginTop: 6,
    color: TEXT_LIGHT,
  },
});