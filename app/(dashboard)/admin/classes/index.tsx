import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  School2,
  Layers3,
  BookOpen,
  Users,
  ClipboardCheck,
  X,
  Mail,
  Phone,
  UserCircle2,
  GraduationCap,
  Users2,
} from "lucide-react-native";
import { router } from "expo-router";
import { teachersApi, classApi } from "@/app/utils/axiosInstance";

/* ======================================= */
/* UPDATED COLORS (Modern Slate & Blue) */
/* ======================================= */

const COLORS = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#0F1E36",
  accent: "#00BCD4",
  textDark: "#00BCD4",
  textLight: "#64748B",
  border: "#E2E8F0",
  lightAccent: "#EFF6FF",
};

const PRIMARY = COLORS.primary;
const BACKGROUND = COLORS.background;
const WHITE = COLORS.card;
const TEXT_DARK = COLORS.textDark;
const TEXT_LIGHT = COLORS.textLight;

/* ======================================= */
/* COMPONENT */
/* ======================================= */

export default function ClassesIndex() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachersModal, setTeachersModal] = useState(false);
  const [classesModal, setClassesModal] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ======================================= */
  /* API METHODS */
  /* ======================================= */

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teachersApi.get("/api/student/teacher/all");
      const teachersData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setTeachers(teachersData);
      setTeachersModal(true);
    } catch (error) {
      console.log("Teachers Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classApi.get("/api/student/class-sections");
      const classesData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setClasses(classesData);
      setClassesModal(true);
    } catch (error) {
      console.log("Classes Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, isMobile && { paddingHorizontal: 14, paddingTop: 8 }]}
      >
        <View style={styles.header}>
          <Text style={[styles.heading, isMobile && { fontSize: 26 }]}>Classes Management</Text>
          <Text style={[styles.subHeading, isMobile && { fontSize: 12 }]}>Manage academic structure</Text>
        </View>

        <View style={[styles.searchBox, isMobile && { height: 50, borderRadius: 14, marginBottom: 18 }]}>
          <Search size={18} color={TEXT_LIGHT} />
          <TextInput placeholder="Search..." placeholderTextColor={TEXT_LIGHT} style={[styles.searchInput, isMobile && { fontSize: 14 }]} />
        </View>

        <View style={[styles.buttonRow, isMobile && { flexDirection: "column", gap: 14 }]}>
          <TouchableOpacity style={[styles.bigButton, isMobile && { width: "100%", paddingVertical: 22 }]} onPress={fetchClasses}>
            <School2 size={isMobile ? 30 : 34} color={PRIMARY} />
            <Text style={[styles.buttonTitle, isMobile && { fontSize: 15 }]}>Classes</Text>
            <Text style={[styles.buttonDesc, isMobile && { fontSize: 11 }]}>{loading ? "Loading..." : `${classes.length} Classes`}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigButton, isMobile && { width: "100%", paddingVertical: 22 }]} onPress={() => router.push("/admin/classes/sections")}>
            <Layers3 size={isMobile ? 30 : 34} color={PRIMARY} />
            <Text style={[styles.buttonTitle, isMobile && { fontSize: 15 }]}>Sections</Text>
            <Text style={[styles.buttonDesc, isMobile && { fontSize: 11 }]}>View sections</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigButton, isMobile && { width: "100%", paddingVertical: 22 }]} onPress={() => router.push("/admin/classes/subjects")}>
            <BookOpen size={isMobile ? 30 : 34} color={PRIMARY} />
            <Text style={[styles.buttonTitle, isMobile && { fontSize: 15 }]}>Subjects</Text>
            <Text style={[styles.buttonDesc, isMobile && { fontSize: 11 }]}>View subjects</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigButton, isMobile && { width: "100%", paddingVertical: 22 }]} onPress={fetchTeachers}>
            <Users size={isMobile ? 30 : 34} color={PRIMARY} />
            <Text style={[styles.buttonTitle, isMobile && { fontSize: 15 }]}>Teachers</Text>
            <Text style={[styles.buttonDesc, isMobile && { fontSize: 11 }]}>{teachers.length} Teachers</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionHeading, isMobile && { fontSize: 24 }]}>Academic Insights</Text>
        <TouchableOpacity style={[styles.insightCard, isMobile && { flexDirection: "column", alignItems: "flex-start" }]}>
          <View style={styles.insightIcon}>
            <ClipboardCheck size={28} color="#FFFFFF" />
          </View>
          <View style={[styles.insightTextBox, isMobile && { marginLeft: 0, marginTop: 14 }]}>
            <Text style={[styles.insightTitle, isMobile && { fontSize: 18 }]}>Attendance Overview</Text>
            <Text style={[styles.insightDesc, isMobile && { fontSize: 12, lineHeight: 18 }]}>Monitor attendance and student presence records.</Text>
          </View>
        </TouchableOpacity>

        {/* --- Modals remain unchanged in structure but now only open on press --- */}
        <Modal visible={classesModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, isMobile && { width: "94%", padding: 16 }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, isMobile && { fontSize: 20 }]}>Classes List</Text>
                <TouchableOpacity onPress={() => setClassesModal(false)}><X size={22} color={TEXT_DARK} /></TouchableOpacity>
              </View>
              <FlatList data={classes} renderItem={({ item }) => (
                <View style={styles.teacherCard}>
                  <View style={styles.teacherTop}>
                    <GraduationCap size={38} color={PRIMARY} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={styles.teacherName}>Class {item.className} - {item.section}</Text>
                      <Text style={styles.teacherId}>{item.classSectionId}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Users2 size={16} color={PRIMARY} />
                    <Text style={styles.infoText}>Teacher: {item.classTeacherName || "Not Assigned"}</Text>
                  </View>
                </View>
              )} />
            </View>
          </View>
        </Modal>

        <Modal visible={teachersModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, isMobile && { width: "94%", padding: 16 }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, isMobile && { fontSize: 20 }]}>Teachers List</Text>
                <TouchableOpacity onPress={() => setTeachersModal(false)}><X size={22} color={TEXT_DARK} /></TouchableOpacity>
              </View>
              <FlatList data={teachers} renderItem={({ item }) => (
                <View style={styles.teacherCard}>
                  <View style={styles.teacherTop}>
                    <UserCircle2 size={40} color={PRIMARY} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={styles.teacherName}>{item.teacherName || "Teacher"}</Text>
                      <Text style={styles.teacherId}>{item.teacherId}</Text>
                    </View>
                  </View>
                  {item.email && (
                    <View style={styles.infoRow}><Mail size={16} color={PRIMARY} /><Text style={styles.infoText}>{item.email}</Text></View>
                  )}
                  {item.phone && (
                    <View style={styles.infoRow}><Phone size={16} color={PRIMARY} /><Text style={styles.infoText}>{item.phone}</Text></View>
                  )}
                </View>
              )} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  scrollContainer: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 30 },
  header: { marginBottom: 14 },
  heading: { fontSize: 32, fontWeight: "900", color: PRIMARY },
  subHeading: { marginTop: 4, fontSize: 14, color: TEXT_LIGHT },
  searchBox: { backgroundColor: WHITE, height: 54, borderRadius: 16, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 22, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: TEXT_DARK },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap" },
  bigButton: { width: "23.5%", backgroundColor: WHITE, borderRadius: 22, paddingVertical: 28, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  buttonTitle: { marginTop: 12, fontSize: 16, fontWeight: "800", color: TEXT_DARK },
  buttonDesc: { marginTop: 6, fontSize: 12, color: TEXT_LIGHT },
  sectionHeading: { fontSize: 30, fontWeight: "900", color: PRIMARY, marginBottom: 14 },
  insightCard: { backgroundColor: WHITE, borderRadius: 24, padding: 20, flexDirection: "row", alignItems: "center", marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  insightIcon: { width: 64, height: 64, borderRadius: 18, backgroundColor: PRIMARY, justifyContent: "center", alignItems: "center" },
  insightTextBox: { flex: 1, marginLeft: 16 },
  insightTitle: { fontSize: 22, fontWeight: "800", color: TEXT_DARK },
  insightDesc: { marginTop: 6, fontSize: 13, lineHeight: 20, color: TEXT_LIGHT },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalCard: { width: "85%", maxHeight: "80%", backgroundColor: WHITE, borderRadius: 24, padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: "900", color: PRIMARY },
  teacherCard: { backgroundColor: COLORS.lightAccent, borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  teacherTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  teacherName: { fontSize: 18, fontWeight: "800", color: TEXT_DARK },
  teacherId: { marginTop: 2, fontSize: 12, color: TEXT_LIGHT },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  infoText: { marginLeft: 10, fontSize: 13, color: TEXT_DARK, marginTop: 4 },
});