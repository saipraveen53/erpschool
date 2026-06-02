import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    Edit2,
    Filter,
    Plus,
    Save,
    Search,
    Target,
    Trash2,
    TrendingUp,
    Users,
    X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    Platform,
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
  success: "#4CAF50",
  warning: "#FF9800",
  pending: "#757575",
  accent: "#F4A460",
  border: "#EAEAEE",
  error: "#D32F2F",
};

// Mock data for lesson plans
const DUMMY_PLANS = [
  {
    id: "1",
    classStr: "10-A",
    subject: "Mathematics",
    chapter: "Chapter 5: Quadratic Equations",
    topics: ["Quadratic Formula", "Discriminant", "Nature of Roots"],
    status: "In Progress",
    progress: 65,
    startDate: "2026-06-01",
    endDate: "2026-06-10",
    description: "Understanding quadratic equations and their applications",
    resources: ["Textbook Chapter 5", "Practice Worksheet", "Video Lectures"],
    assignments: ["Problem Set 5.1", "Group Project"],
  },
  {
    id: "2",
    classStr: "11-Science",
    subject: "Physics",
    chapter: "Chapter 3: Laws of Motion",
    topics: ["Newton's Laws", "Friction", "Circular Motion"],
    status: "Completed",
    progress: 100,
    startDate: "2026-05-15",
    endDate: "2026-05-28",
    description: "Study of motion and forces",
    resources: ["Lab Manual", "Simulation Software"],
    assignments: ["Lab Report", "Numerical Problems"],
  },
  {
    id: "3",
    classStr: "10-B",
    subject: "Mathematics",
    chapter: "Chapter 6: Triangles",
    topics: ["Similarity", "Pythagoras Theorem", "Area Theorems"],
    status: "Pending",
    progress: 0,
    startDate: "2026-06-12",
    endDate: "2026-06-24",
    description: "Properties and theorems of triangles",
    resources: ["Geometry Kit", "Reference Book"],
    assignments: ["Proof Exercises", "MCQ Test"],
  },
];

type FilterType = "all" | "in-progress" | "completed" | "pending";

export default function LessonPlanScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [lessonPlans, setLessonPlans] = useState(DUMMY_PLANS);

  // Form state
  const [formData, setFormData] = useState({
    classStr: "",
    subject: "",
    chapter: "",
    description: "",
    startDate: "",
    endDate: "",
    topics: "",
    resources: "",
    assignments: "",
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          color: COLORS.success,
          bg: "rgba(76, 175, 80, 0.1)",
          icon: CheckCircle2,
          label: "Completed",
        };
      case "In Progress":
        return {
          color: COLORS.warning,
          bg: "rgba(255, 152, 0, 0.1)",
          icon: Clock,
          label: "In Progress",
        };
      default:
        return {
          color: COLORS.pending,
          bg: "rgba(117, 117, 117, 0.1)",
          icon: BookOpen,
          label: "Pending",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const filteredPlans = lessonPlans.filter((plan) => {
    const matchesSearch =
      plan.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.classStr.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (activeFilter === "in-progress") {
      matchesFilter = plan.status === "In Progress";
    } else if (activeFilter === "completed") {
      matchesFilter = plan.status === "Completed";
    } else if (activeFilter === "pending") {
      matchesFilter = plan.status === "Pending";
    }

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: lessonPlans.length,
    active: lessonPlans.filter((p) => p.status === "In Progress").length,
    completed: lessonPlans.filter((p) => p.status === "Completed").length,
    pending: lessonPlans.filter((p) => p.status === "Pending").length,
    averageProgress: Math.floor(
      lessonPlans.reduce((sum, p) => sum + p.progress, 0) / lessonPlans.length,
    ),
  };

  const handleCreatePlan = () => {
    if (!formData.classStr || !formData.subject || !formData.chapter) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      classStr: formData.classStr,
      subject: formData.subject,
      chapter: formData.chapter,
      topics: formData.topics.split(",").map((t) => t.trim()),
      status: "Pending",
      progress: 0,
      startDate: formData.startDate || new Date().toISOString().split("T")[0],
      endDate: formData.endDate || new Date().toISOString().split("T")[0],
      description: formData.description,
      resources: formData.resources
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r),
      assignments: formData.assignments
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
    };

    if (editingPlan) {
      setLessonPlans(
        lessonPlans.map((p) =>
          p.id === editingPlan.id ? { ...newPlan, id: p.id } : p,
        ),
      );
      Alert.alert("Success", "Lesson plan updated successfully");
    } else {
      setLessonPlans([newPlan, ...lessonPlans]);
      Alert.alert("Success", "Lesson plan created successfully");
    }

    resetForm();
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      classStr: plan.classStr,
      subject: plan.subject,
      chapter: plan.chapter,
      description: plan.description,
      startDate: plan.startDate,
      endDate: plan.endDate,
      topics: plan.topics.join(", "),
      resources: plan.resources?.join(", ") || "",
      assignments: plan.assignments?.join(", ") || "",
    });
    setIsModalVisible(true);
  };

  const handleDeletePlan = (id: string) => {
    Alert.alert(
      "Delete Lesson Plan",
      "Are you sure you want to delete this lesson plan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setLessonPlans(lessonPlans.filter((p) => p.id !== id));
            Alert.alert("Success", "Lesson plan deleted successfully");
          },
        },
      ],
    );
  };

  const updateProgress = (id: string, newProgress: number) => {
    setLessonPlans(
      lessonPlans.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              progress: newProgress,
              status:
                newProgress === 100
                  ? "Completed"
                  : newProgress > 0
                    ? "In Progress"
                    : "Pending",
            }
          : plan,
      ),
    );
  };

  const resetForm = () => {
    setFormData({
      classStr: "",
      subject: "",
      chapter: "",
      description: "",
      startDate: "",
      endDate: "",
      topics: "",
      resources: "",
      assignments: "",
    });
    setEditingPlan(null);
    setIsModalVisible(false);
  };

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
        <Text style={styles.headerTitle}>Lesson Plans</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setIsModalVisible(true);
          }}
        >
          <Plus size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentWrapper,
          { maxWidth: isDesktop ? 1000 : "100%" },
        ]}
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(227, 83, 54, 0.1)" },
              ]}
            >
              <BookOpen size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Plans</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(255, 152, 0, 0.1)" },
              ]}
            >
              <Clock size={24} color={COLORS.warning} />
            </View>
            <Text style={styles.statNumber}>{stats.active}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(76, 175, 80, 0.1)" },
              ]}
            >
              <CheckCircle2 size={24} color={COLORS.success} />
            </View>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(244, 164, 96, 0.1)" },
              ]}
            >
              <TrendingUp size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.statNumber}>{stats.averageProgress}%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by chapter, subject, or class..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={() => setIsFilterVisible(!isFilterVisible)}
          >
            <Filter
              size={20}
              color={
                activeFilter !== "all" ? COLORS.primary : COLORS.textSecondary
              }
            />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        {isFilterVisible && (
          <View style={styles.filterChips}>
            <TouchableOpacity
              style={[styles.chip, activeFilter === "all" && styles.chipActive]}
              onPress={() => setActiveFilter("all")}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "all" && styles.chipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                activeFilter === "in-progress" && styles.chipActive,
              ]}
              onPress={() => setActiveFilter("in-progress")}
            >
              <Clock
                size={14}
                color={
                  activeFilter === "in-progress" ? COLORS.white : COLORS.warning
                }
              />
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "in-progress" && styles.chipTextActive,
                ]}
              >
                In Progress
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                activeFilter === "completed" && styles.chipActive,
              ]}
              onPress={() => setActiveFilter("completed")}
            >
              <CheckCircle2
                size={14}
                color={
                  activeFilter === "completed" ? COLORS.white : COLORS.success
                }
              />
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "completed" && styles.chipTextActive,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                activeFilter === "pending" && styles.chipActive,
              ]}
              onPress={() => setActiveFilter("pending")}
            >
              <Target
                size={14}
                color={
                  activeFilter === "pending" ? COLORS.white : COLORS.pending
                }
              />
              <Text
                style={[
                  styles.chipText,
                  activeFilter === "pending" && styles.chipTextActive,
                ]}
              >
                Pending
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lesson Plans List */}
        {filteredPlans.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>No lesson plans found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter criteria
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                resetForm();
                setIsModalVisible(true);
              }}
            >
              <Plus size={20} color={COLORS.white} />
              <Text style={styles.createButtonText}>Create New Plan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredPlans.map((plan) => {
              const StatusIcon = getStatusConfig(plan.status).icon;
              const statusColor = getStatusConfig(plan.status).color;
              const statusBg = getStatusConfig(plan.status).bg;

              return (
                <View key={plan.id} style={styles.planCard}>
                  {/* Header Row */}
                  <View style={styles.cardHeader}>
                    <View style={styles.classBadge}>
                      <Users size={12} color={COLORS.primary} />
                      <Text style={styles.classBadgeText}>
                        {plan.classStr} • {plan.subject}
                      </Text>
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={() => handleEditPlan(plan)}
                      >
                        <Edit2 size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 size={18} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Chapter Title */}
                  <Text style={styles.chapterTitle}>{plan.chapter}</Text>

                  {/* Description */}
                  <Text style={styles.description} numberOfLines={2}>
                    {plan.description}
                  </Text>

                  {/* Topics */}
                  {plan.topics && plan.topics.length > 0 && (
                    <View style={styles.topicsContainer}>
                      {plan.topics.slice(0, 3).map((topic, index) => (
                        <View key={index} style={styles.topicTag}>
                          <Text style={styles.topicText}>{topic}</Text>
                        </View>
                      ))}
                      {plan.topics.length > 3 && (
                        <View style={styles.topicTag}>
                          <Text style={styles.topicText}>
                            +{plan.topics.length - 3} more
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Progress Section */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusBg },
                        ]}
                      >
                        <StatusIcon size={14} color={statusColor} />
                        <Text
                          style={[styles.statusText, { color: statusColor }]}
                        >
                          {plan.status}
                        </Text>
                      </View>
                      <View style={styles.progressControls}>
                        <TouchableOpacity
                          style={styles.progressButton}
                          onPress={() =>
                            updateProgress(
                              plan.id,
                              Math.max(0, plan.progress - 10),
                            )
                          }
                        >
                          <Text style={styles.progressButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.progressPercent}>
                          {plan.progress}%
                        </Text>
                        <TouchableOpacity
                          style={styles.progressButton}
                          onPress={() =>
                            updateProgress(
                              plan.id,
                              Math.min(100, plan.progress + 10),
                            )
                          }
                        >
                          <Text style={styles.progressButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${plan.progress}%`,
                            backgroundColor: statusColor,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Date Range */}
                  <View style={styles.dateRangeContainer}>
                    <Calendar size={14} color={COLORS.textSecondary} />
                    <Text style={styles.dateRangeText}>
                      {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { width: isDesktop ? 600 : "90%" }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPlan ? "Edit Lesson Plan" : "Create New Lesson Plan"}
              </Text>
              <TouchableOpacity onPress={resetForm} style={styles.closeButton}>
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Class *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 10-A"
                  value={formData.classStr}
                  onChangeText={(text) =>
                    setFormData({ ...formData, classStr: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Subject *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Mathematics"
                  value={formData.subject}
                  onChangeText={(text) =>
                    setFormData({ ...formData, subject: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Chapter *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Chapter 5: Quadratic Equations"
                  value={formData.chapter}
                  onChangeText={(text) =>
                    setFormData({ ...formData, chapter: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Brief description of the lesson plan"
                  multiline
                  numberOfLines={3}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Start Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={formData.startDate}
                    onChangeText={(text) =>
                      setFormData({ ...formData, startDate: text })
                    }
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>End Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={formData.endDate}
                    onChangeText={(text) =>
                      setFormData({ ...formData, endDate: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Topics (comma-separated)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Quadratic Formula, Discriminant, Nature of Roots"
                  value={formData.topics}
                  onChangeText={(text) =>
                    setFormData({ ...formData, topics: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Resources (comma-separated)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Textbook, Worksheet, Video"
                  value={formData.resources}
                  onChangeText={(text) =>
                    setFormData({ ...formData, resources: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Assignments (comma-separated)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Problem Set, Quiz, Project"
                  value={formData.assignments}
                  onChangeText={(text) =>
                    setFormData({ ...formData, assignments: text })
                  }
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCreatePlan}
              >
                <Save size={20} color={COLORS.white} />
                <Text style={styles.saveButtonText}>
                  {editingPlan ? "Update Plan" : "Create Plan"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    borderBottomColor: COLORS.border,
    ...Platform.select({
      web: { userSelect: "none" },
    }),
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  addButton: {
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    padding: 8,
    borderRadius: 8,
  },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
    paddingVertical: 12,
    marginRight: 12,
  },
  filterIconButton: {
    padding: 8,
    marginRight: -8,
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bgWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: COLORS.bgWhite,
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  classBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  classBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionIcon: {
    padding: 4,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  topicsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  topicTag: {
    backgroundColor: "rgba(160, 82, 45, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  topicText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  progressSection: {
    marginTop: 4,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  progressControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  dateRangeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 20,
    padding: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
});
