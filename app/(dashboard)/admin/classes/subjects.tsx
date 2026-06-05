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
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  Search,
  Plus,
  BookOpen,
  Clock3,
  UserCheck,
  School2,
  CalendarDays,
  FileText,
  CircleCheckBig,
  ArrowLeft,
} from "lucide-react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { subjectApi } from "@/app/utils/axiosInstance";


/* ========================================= */
/* COLORS */
/* ========================================= */

const PRIMARY = "#A0522D";

const BACKGROUND = "#F5F5DC";

const WHITE = "#FFFFFF";

const TEXT_DARK = "#111827";

const TEXT_LIGHT = "#6B7280";

/* ========================================= */
/* COMPONENT */
/* ========================================= */

export default function SubjectsPage() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [activePage, setActivePage] =
    useState("");

  const [selectedSubject, setSelectedSubject] =
    useState<any>(null);

  const [subjectsData, setSubjectsData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [subjectName, setSubjectName] =
    useState("");

  const [subjectCode, setSubjectCode] =
    useState("");

  const [active, setActive] =
    useState(true);

  const [searchText, setSearchText] =
    useState("");

  /* ========================================= */
  /* FETCH SUBJECTS */
  /* ========================================= */

  const fetchSubjects = async () => {
    try {
      setLoading(true);

      const response = await subjectApi.get(
        "/api/student/subject/allSubjects",
      );

      setSubjectsData(response.data);
    } catch (error) {
      console.log("Fetch Subjects Error:", error);

      Alert.alert(
        "Error",
        "Failed to fetch subjects",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================= */
  /* CREATE SUBJECT */
  /* ========================================= */

  const createSubject = async () => {
    if (
      !subjectName.trim() ||
      !subjectCode.trim()
    ) {
      Alert.alert(
        "Validation",
        "Please enter all fields",
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        subjectName: subjectName,
        subjectCode: subjectCode,
        active: active,
      };

      const response =
        await subjectApi.post(
          "/api/student/subject/createSubject",
          payload,
        );

      Alert.alert(
        "Success",
        "Subject created successfully",
      );

      setModalVisible(false);

      setSubjectName("");
      setSubjectCode("");
      setActive(true);

      fetchSubjects();
    } catch (error) {
      console.log(
        "Create Subject Error:",
        error,
      );

      Alert.alert(
        "Error",
        "Failed to create subject",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================= */
  /* INITIAL LOAD */
  /* ========================================= */

  useEffect(() => {
    fetchSubjects();
  }, []);

  /* ========================================= */
  /* FILTER SUBJECTS */
  /* ========================================= */

  const filteredSubjects =
    subjectsData.filter((item: any) =>
      item.subjectName
        ?.toLowerCase()
        .includes(searchText.toLowerCase()),
    );

  /* ========================================= */
  /* SUBJECT DETAILS */
  /* ========================================= */

  const renderSubjectDetails = () => {
    if (!selectedSubject) return null;

    return (
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>
          {selectedSubject.subjectName}
        </Text>

        <View style={styles.infoRow}>
          <BookOpen
            size={18}
            color={PRIMARY}
          />

          <Text style={styles.infoText}>
            Subject Code:{" "}
            {selectedSubject.subjectCode}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <CircleCheckBig
            size={18}
            color={PRIMARY}
          />

          <Text style={styles.infoText}>
            Status:{" "}
            {selectedSubject.active
              ? "Active"
              : "Inactive"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FileText
            size={18}
            color={PRIMARY}
          />

          <Text style={styles.infoText}>
            Subject ID:{" "}
            {selectedSubject.subjectId}
          </Text>
        </View>
      </View>
    );
  };

  /* ========================================= */
  /* MAIN UI */
  /* ========================================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: isMobile ? 16 : 22,
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>
              Subjects Management
            </Text>

            <Text style={styles.subheading}>
              Manage subjects and
              academic schedules
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.addButton}
            onPress={() =>
              setModalVisible(true)
            }
          >
            <Plus
              size={16}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.addButtonText
              }
            >
              Add Subject
            </Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}

        <View style={styles.searchBox}>
          <Search
            size={18}
            color="#6B7280"
          />

          <TextInput
            placeholder="Search subjects..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* BACK BUTTON */}

        {(activePage !== "" ||
          selectedSubject) && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setActivePage("");
              setSelectedSubject(
                null,
              );
            }}
          >
            <ArrowLeft
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.backText}>
              Back
            </Text>
          </TouchableOpacity>
        )}

        {/* SUBJECTS */}

        {!selectedSubject ? (
          <>
            <Text style={styles.sectionTitle}>
              Subjects
            </Text>

            <View style={styles.buttonGrid}>
              {filteredSubjects.map(
                (item: any, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.bigButton}
                    onPress={() =>
                      setSelectedSubject(
                        item,
                      )
                    }
                  >
                    <BookOpen
                      size={34}
                      color={PRIMARY}
                    />

                    <Text
                      style={
                        styles.buttonTitle
                      }
                    >
                      {item.subjectName}
                    </Text>

                    <Text
                      style={
                        styles.buttonDesc
                      }
                    >
                      {
                        item.subjectCode
                      }
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </>
        ) : (
          renderSubjectDetails()
        )}
      </ScrollView>

      {/* ADD SUBJECT MODAL */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Create Subject
            </Text>

            <TextInput
              placeholder="Subject Name"
              style={styles.input}
              value={subjectName}
              onChangeText={
                setSubjectName
              }
            />

            <TextInput
              placeholder="Subject Code"
              style={styles.input}
              value={subjectCode}
              onChangeText={
                setSubjectCode
              }
            />

            <View style={styles.switchRow}>
              <Text
                style={styles.switchText}
              >
                Active
              </Text>

              <Switch
                value={active}
                onValueChange={setActive}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={createSubject}
            >
              <Text
                style={
                  styles.submitButtonText
                }
              >
                Submit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                setModalVisible(false)
              }
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: PRIMARY,
  },

  subheading: {
    marginTop: 4,
    fontSize: 13,
    color: TEXT_LIGHT,
  },

  addButton: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 16,
  },

  addButtonText: {
    color: "#FFFFFF",
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 13,
  },

  searchBox: {
    backgroundColor: WHITE,
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#000000",
  },

  backButton: {
    backgroundColor: PRIMARY,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 20,
  },

  backText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 18,
    marginTop: 6,
  },

  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  bigButton: {
    width: "48%",
    backgroundColor: WHITE,
    borderRadius: 22,
    paddingVertical: 32,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 18,
  },

  buttonTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_DARK,
    textAlign: "center",
  },

  buttonDesc: {
    marginTop: 8,
    fontSize: 12,
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 18,
  },

  detailsCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 22,
  },

  detailsTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  infoText: {
    marginLeft: 12,
    fontSize: 15,
    color: TEXT_DARK,
    fontWeight: "600",
    flex: 1,
  },

  modalContainer: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 22,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 20,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  switchText: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
  },

  submitButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },

  cancelButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },

  cancelButtonText: {
    fontWeight: "700",
    color: TEXT_DARK,
  },
});