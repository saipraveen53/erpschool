import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Modal,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Search,
  Plus,
  BookOpen,
  CircleCheckBig,
  FileText,
  ArrowLeft,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { subjectApi } from "@/app/utils/axiosInstance";

/* ========================================= */
/* UPDATED COLORS */
/* ========================================= */

const COLORS = {
  background: "#F4F8FB",
  card: "#FFFFFF",
  primary: "#1E293B",    // Dark Slate
  accent: "#22C7E5",     // Cyan
  textDark: "#1E293B",
  textLight: "#64748B",
  border: "#DCE7EF",
  white: "#FFFFFF",
};

export default function SubjectsPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [subjectsData, setSubjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [active, setActive] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectApi.get("/api/student/subject/allSubjects");
      setSubjectsData(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const filteredSubjects = subjectsData.filter((item: any) =>
    item.subjectName?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Subjects Management</Text>
            <Text style={styles.subheading}>Manage subjects and academic schedules</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={16} color={COLORS.white} />
            <Text style={styles.addButtonText}>Add Subject</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Search size={18} color={COLORS.accent} />
          <TextInput placeholder="Search subjects..." placeholderTextColor={COLORS.textLight} style={styles.searchInput} value={searchText} onChangeText={setSearchText} />
        </View>

        {/* CONTENT */}
        {!selectedSubject ? (
          <>
            <Text style={styles.sectionTitle}>Subjects List</Text>
            <View style={styles.buttonGrid}>
              {filteredSubjects.map((item: any, index) => (
                <TouchableOpacity key={index} style={styles.bigButton} onPress={() => setSelectedSubject(item)}>
                  <BookOpen size={34} color={COLORS.accent} />
                  <Text style={styles.buttonTitle}>{item.subjectName}</Text>
                  <Text style={styles.buttonDesc}>{item.subjectCode}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.detailsCard}>
            <TouchableOpacity style={styles.backButton} onPress={() => setSelectedSubject(null)}>
              <ArrowLeft size={18} color={COLORS.white} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.detailsTitle}>{selectedSubject.subjectName}</Text>
            <View style={styles.infoRow}><BookOpen size={18} color={COLORS.accent} /><Text style={styles.infoText}>Code: {selectedSubject.subjectCode}</Text></View>
            <View style={styles.infoRow}><CircleCheckBig size={18} color={COLORS.accent} /><Text style={styles.infoText}>Status: {selectedSubject.active ? "Active" : "Inactive"}</Text></View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { padding: 22, paddingBottom: 120 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  heading: { fontSize: 30, fontWeight: "900", color: COLORS.primary },
  subheading: { marginTop: 4, fontSize: 13, color: COLORS.textLight },
  addButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 11, borderRadius: 16 },
  addButtonText: { color: COLORS.white, marginLeft: 6, fontWeight: "700", fontSize: 13 },
  searchBox: { backgroundColor: COLORS.card, height: 54, borderRadius: 16, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: COLORS.primary },
  sectionTitle: { fontSize: 24, fontWeight: "900", color: COLORS.primary, marginBottom: 18 },
  buttonGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  bigButton: { width: "48%", backgroundColor: COLORS.card, borderRadius: 22, paddingVertical: 32, paddingHorizontal: 18, alignItems: "center", marginBottom: 18, borderWidth: 1, borderColor: COLORS.border },
  buttonTitle: { marginTop: 16, fontSize: 18, fontWeight: "800", color: COLORS.primary, textAlign: "center" },
  buttonDesc: { marginTop: 8, fontSize: 12, color: COLORS.textLight, textAlign: "center" },
  detailsCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: COLORS.border },
  detailsTitle: { fontSize: 24, fontWeight: "900", color: COLORS.primary, marginBottom: 20 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  infoText: { marginLeft: 12, fontSize: 15, color: COLORS.primary, fontWeight: "600" },
  backButton: { backgroundColor: COLORS.primary, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, marginBottom: 20 },
  backText: { color: COLORS.white, marginLeft: 8, fontWeight: "700" },
});