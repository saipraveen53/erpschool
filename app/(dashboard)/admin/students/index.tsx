import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {
  Search, Filter, Sparkles, UserPlus, Upload, IdCard, ArrowRight, User
} from "lucide-react-native";

const COLORS = {
  background: "#F1F5F9",
  card: "#FFFFFF",
  primary: "#24343D",
  accent: "#00BCD4",
  white: "#FFFFFF",
  textMain: "#24343D",
  textSub: "#64748B",
  border: "#E2E8F0",
  lightAccent: "#E0F7FA",
};

export default function StudentsIndex() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const recentStudents = [
    { id: 1, name: "Alice Johnson", grade: "Grade 10" },
    { id: 2, name: "Bob Smith", grade: "Grade 9" },
    { id: 3, name: "Charlie Davis", grade: "Grade 11" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.heading}>Students Hub</Text>
        <Text style={styles.subheading}>Overview of your academy data</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.sparkleBox}><Sparkles size={28} color={COLORS.accent} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>AI Analytics</Text>
          <Text style={styles.heroText}>Monitor attendance, engagement, and performance effortlessly.</Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>View Insights</Text>
            <ArrowRight size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.textSub} />
        <TextInput placeholder="Search students..." placeholderTextColor={COLORS.textSub} style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}><Filter size={18} color={COLORS.primary} /></TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={[styles.overviewContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        {[
          { label: "Add Student", icon: UserPlus, route: "/admin/students/addstudents" },
          { label: "Bulk Upload", icon: Upload, route: "/admin/students/bulkupload" },
          { label: "Student Profile", icon: IdCard, route: "/admin/students/studentprofile" }
        ].map((item, index) => (
          <TouchableOpacity key={index} style={[styles.overviewButton, { width: isMobile ? "100%" : "32%" }]} onPress={() => router.push(item.route)}>
            <View style={styles.overviewIcon}><item.icon size={24} color={COLORS.accent} /></View>
            <Text style={styles.overviewText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recent Enrollments</Text>
      <View style={styles.listContainer}>
        {recentStudents.map((student) => (
          <TouchableOpacity key={student.id} style={styles.listItem} onPress={() => router.push("/admin/students/studentdata")}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.avatar}><User size={20} color={COLORS.primary} /></View>
              <View>
                <Text style={styles.listTitle}>{student.name}</Text>
                <Text style={styles.listSub}>{student.grade}</Text>
              </View>
            </View>
            <ArrowRight size={18} color={COLORS.textSub} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 20 },
  heading: { fontSize: 28, fontWeight: "900", color: COLORS.primary },
  subheading: { color: COLORS.textSub, marginTop: 4, fontSize: 14 },
  heroCard: { backgroundColor: COLORS.primary, borderRadius: 20, padding: 20, marginBottom: 20, flexDirection: "row", alignItems: "center" },
  sparkleBox: { width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.lightAccent, justifyContent: "center", alignItems: "center", marginRight: 15 },
  heroTitle: { color: COLORS.white, fontSize: 18, fontWeight: "700" },
  heroText: { color: "#CBD5E1", marginTop: 4, fontSize: 12, lineHeight: 16 },
  heroButton: { marginTop: 12, backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, flexDirection: "row", alignSelf: 'flex-start', alignItems: 'center' },
  heroButtonText: { color: COLORS.white, fontWeight: "700", marginRight: 8, fontSize: 13 },
  searchContainer: { backgroundColor: COLORS.card, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.textMain },
  filterButton: { padding: 8, borderRadius: 10, backgroundColor: COLORS.lightAccent },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.primary, marginBottom: 12, marginTop: 8 },
  overviewContainer: { justifyContent: "space-between", marginBottom: 10 },
  overviewButton: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  overviewIcon: { marginBottom: 10, padding: 10, borderRadius: 12, backgroundColor: COLORS.lightAccent },
  overviewText: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
  listContainer: { backgroundColor: COLORS.card, borderRadius: 16, paddingHorizontal: 10, borderWidth: 1, borderColor: COLORS.border },
  listItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.lightAccent, justifyContent: "center", alignItems: "center", marginRight: 15 },
  listTitle: { fontWeight: "700", color: COLORS.primary },
  listSub: { color: COLORS.textSub, fontSize: 12 },
});