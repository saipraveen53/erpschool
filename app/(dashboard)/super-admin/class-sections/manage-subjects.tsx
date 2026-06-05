import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, useWindowDimensions } from "react-native";
import { ArrowLeft, Book, User, AlertCircle } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { rootApi } from "../../../utils/axiosInstance";

export default function ManageSubjects() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  const params = useLocalSearchParams();
  const { classSectionId, className, section } = params;

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classSectionId) {
      fetchSubjects();
    }
  }, [classSectionId]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await rootApi.get(`/api/student/subject/assign/${classSectionId}`);
      if (response.data) {
        setSubjects(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      Alert.alert("Error", "Failed to load subjects for this class.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = (subject: any) => {
    Alert.alert("Notice", "Assigning a teacher will be implemented once the update endpoint is provided.");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: isMobile ? 16 : 0 }]}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <View style={styles.headerTitleRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButtonInline}>
              <ArrowLeft size={20} color="#5C2E14" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontSize: isMobile ? 20 : 28 }]} numberOfLines={1}>
              {className} - {section} Subjects
            </Text>
          </View>
          <Text style={[styles.headerSubtitle, { fontSize: isMobile ? 12 : 14 }]} numberOfLines={1}>
            View and manage subject assignments for this class section
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 12 : 24, paddingBottom: 40, paddingTop: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E35336" style={{ marginTop: 40 }} />
        ) : subjects.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Book size={48} color="#E6D8D2" />
            <Text style={styles.emptyText}>No subjects assigned to this class yet.</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 }}>
            {subjects.map((item, idx) => (
              <View key={item.id || idx} style={{ width: isMobile ? "100%" : "33.33%", padding: 8 }}>
                <View style={styles.subjectCard}>
                  <View style={styles.subjectCardHeader}>
                    <View style={styles.subjectAvatar}>
                      <Book size={20} color="#E35336" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.subjectNameText}>{item.subjectName}</Text>
                      <Text style={styles.subjectIdText}>ID: {item.subjectId}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.teacherSection}>
                    {item.teacherId ? (
                      <View style={styles.teacherAssigned}>
                        <View style={styles.teacherIconBg}>
                          <User size={14} color="#166534" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={styles.teacherLabel}>Assigned Teacher</Text>
                          <Text style={styles.teacherName}>{item.teacherName}</Text>
                        </View>
                        <TouchableOpacity style={styles.changeBtn} onPress={() => handleAssignTeacher(item)}>
                          <Text style={styles.changeBtnText}>Change</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.teacherUnassigned}>
                        <View style={styles.unassignedIconBg}>
                          <AlertCircle size={14} color="#c2410c" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={styles.unassignedLabel}>No Teacher Assigned</Text>
                        </View>
                        <TouchableOpacity style={styles.assignBtn} onPress={() => handleAssignTeacher(item)}>
                          <Text style={styles.assignBtnText}>Assign</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    backgroundColor: "#E6D8D2",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(227, 83, 54, 0.1)",
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backButtonInline: {
    marginRight: 12,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
  },
  headerTitle: {
    fontWeight: "900",
    color: "#5C2E14",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: "#8A6B5D",
    marginLeft: 40,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#A0522D",
    fontWeight: "600",
  },
  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E6D8D2",
    shadowColor: "#A0522D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(227, 83, 54, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  subjectNameText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#5C2E14",
    marginBottom: 2,
  },
  subjectIdText: {
    fontSize: 12,
    color: "#B8A095",
    fontWeight: "500",
  },
  teacherSection: {
    borderTopWidth: 1,
    borderTopColor: "#F5F5DC",
    paddingTop: 16,
  },
  teacherAssigned: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  teacherIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  teacherLabel: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "700",
  },
  teacherName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#14532d",
    marginTop: 2,
  },
  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#166534",
    borderRadius: 6,
  },
  changeBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  teacherUnassigned: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffedd5",
  },
  unassignedIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#ffedd5",
    alignItems: "center",
    justifyContent: "center",
  },
  unassignedLabel: {
    fontSize: 13,
    color: "#c2410c",
    fontWeight: "700",
  },
  assignBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#c2410c",
    borderRadius: 6,
  },
  assignBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
