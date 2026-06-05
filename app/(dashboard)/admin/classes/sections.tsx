import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  Search,
  Plus,
  School2,
  BookOpen,
  CalendarDays,
  CircleCheckBig,
  ArrowLeft,
  Users,
  FileText,
} from "lucide-react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { sectionApi } from "@/app/utils/axiosInstance";

/* ========================================= */
/* UPDATED COLORS */
/* ========================================= */

const COLORS = {
  background: "#F4F8FB",
  card: "#FFFFFF", // White background for boxes
  primary: "#203744", // Dark Slate for main text
  accent: "#22C7E5", // Cyan for icons
  textDark: "#1E293B",
  textLight: "#64748B",
  border: "#DCE7EF",
  white: "#FFFFFF",
};

/* ========================================= */
/* COMPONENT */
/* ========================================= */

export default function SectionsPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activePage, setActivePage] = useState("");
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [sectionsData, setSectionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await sectionApi.get("/api/student/class-sections");
      setSectionsData(response.data);
    } catch (error) {
      console.log("Fetch Sections Error:", error);
      Alert.alert("Error", "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const filteredSections = sectionsData.filter((item: any) =>
    `${item.className} ${item.section}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderSectionDetails = () => {
    if (!selectedSection) return null;
    return (
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Class {selectedSection.className} - {selectedSection.section}</Text>
        {[
          { icon: Users, label: "Teacher:", value: selectedSection.classTeacherName || "Not Assigned" },
          { icon: School2, label: "Capacity:", value: selectedSection.capacity },
          { icon: BookOpen, label: "Current Strength:", value: selectedSection.currentStrength },
          { icon: CalendarDays, label: "Academic Year:", value: selectedSection.academicYear },
          { icon: FileText, label: "Subjects Count:", value: selectedSection.subjectIds?.length },
          { icon: CircleCheckBig, label: "Section ID:", value: selectedSection.classSectionId },
        ].map((item, idx) => (
          <View style={styles.infoRow} key={idx}>
            <item.icon size={18} color={COLORS.accent} />
            <Text style={styles.infoText}>{item.label} {item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: isMobile ? 16 : 22, paddingBottom: 120 }}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.heading, isMobile && { fontSize: 24 }]}>Sections Management</Text>
            <Text style={styles.subheading}>Manage academic sections and schedules</Text>
          </View>
          {!isMobile && (
            <TouchableOpacity style={styles.addButton}>
              <Plus size={16} color={COLORS.white} />
              <Text style={styles.addButtonText}>Add Section</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Search size={18} color={COLORS.accent} />
          <TextInput placeholder="Search sections..." placeholderTextColor={COLORS.textLight} style={styles.searchInput} value={searchText} onChangeText={setSearchText} />
        </View>

        {/* ... (Back button and conditional rendering logic remains as per your original structure) ... */}

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />
        ) : activePage === "" && !selectedSection ? (
          <>
            <Text style={styles.sectionTitle}>Section Wise Information</Text>
            <View style={[styles.buttonGrid, isMobile && { flexDirection: "column" }]}>
              {filteredSections.map((item: any, index) => (
                <TouchableOpacity key={index} style={[styles.bigButton, isMobile && { width: "100%" }]} onPress={() => setSelectedSection(item)}>
                  <School2 size={34} color={COLORS.accent} />
                  <Text style={styles.buttonTitle}>Class {item.className} - {item.section}</Text>
                  <Text style={styles.buttonDesc}>{item.academicYear}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : selectedSection ? renderSectionDetails() : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  heading: { fontSize: 30, fontWeight: "900", color: COLORS.primary },
  subheading: { marginTop: 4, fontSize: 13, color: COLORS.textLight },
  addButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 11, borderRadius: 16 },
  addButtonText: { color: COLORS.white, marginLeft: 6, fontWeight: "700", fontSize: 13 },
  searchBox: { backgroundColor: COLORS.card, height: 54, borderRadius: 16, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: COLORS.primary },
  sectionTitle: { fontSize: 24, fontWeight: "900", color: COLORS.primary, marginBottom: 18, marginTop: 6 },
  buttonGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  bigButton: { width: "48%", backgroundColor: COLORS.card, borderRadius: 22, paddingVertical: 32, paddingHorizontal: 18, alignItems: "center", marginBottom: 18, borderWidth: 1, borderColor: COLORS.border },
  buttonTitle: { marginTop: 16, fontSize: 18, fontWeight: "800", color: COLORS.primary, textAlign: "center" },
  buttonDesc: { marginTop: 8, fontSize: 12, color: COLORS.textLight, textAlign: "center" },
  detailsCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: COLORS.border },
  detailsTitle: { fontSize: 24, fontWeight: "900", color: COLORS.primary, marginBottom: 20 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  infoText: { marginLeft: 12, fontSize: 15, color: COLORS.primary, fontWeight: "600", flex: 1 },
});