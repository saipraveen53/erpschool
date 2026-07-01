import React, {
    useState,
} from "react";

import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";

import {
    BriefcaseBusiness,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Search,
    UserCircle2,
    Users,
    X,
} from "lucide-react-native";

import { staffApi } from "@/app/utils/axiosInstance";

/* ===================================== */
/* COLORS */
/* ===================================== */

const COLORS = {
  background: "#F4F8FB",
  card: "#FFFFFF",

  primary: "#1E293B",
  accent: "#22C7E5",

  textMain: "#1E293B",
  textSub: "#64748B",

  border: "#DCE7EF",

  lightAccent: "#DDF8FD",

  white: "#FFFFFF",
};

const PRIMARY = COLORS.primary;

const { width } = Dimensions.get("window");

/* ===================================== */
/* COMPONENT */
/* ===================================== */

export default function AddStaff() {
  /* ===================================== */
  /* STAFF STATES */
  /* ===================================== */

  const [teachers, setTeachers] =
    useState<any[]>([]);

  const [teachersModal, setTeachersModal] =
    useState(false);

  const [loadingTeachers, setLoadingTeachers] =
    useState(false);

  /* ===================================== */
  /* MODAL */
  /* ===================================== */

  const [modalVisible, setModalVisible] =
    useState(false);

  /* ===================================== */
  /* REGISTRATION STATES */
  /* ===================================== */

  const [password, setPassword] =
    useState("");

  const [experience, setExperience] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [phoneNo, setPhoneNo] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* ===================================== */
  /* FETCH STAFF */
  /* ===================================== */

  const fetchTeachers =
    async () => {
      try {
        setLoadingTeachers(true);

        const response =
          await staffApi.get(
            "/api/student/teacher/all",
          );

        const teachersData =
          Array.isArray(response.data)
            ? response.data
            : response.data.data || [];

        setTeachers(teachersData);

        setTeachersModal(true);
      } catch (error) {
        console.log(
          "Teachers Fetch Error:",
          error,
        );
      } finally {
        setLoadingTeachers(false);
      }
    };

  /* ===================================== */
  /* REGISTER PRINCIPAL */
  /* ===================================== */

  const submitRegistration = async () => {
    if (
      !password ||
      !experience ||
      !address ||
      !phoneNo
    ) {
      Alert.alert(
        "Error",
        "Please fill all required fields",
      );

      return;
    }

    try {
      setLoading(true);

      const token =
        await AsyncStorage.getItem(
          "userToken",
        );

      if (!token) {
        Alert.alert(
          "Error",
          "Token not found",
        );

        return;
      }

      const response = await fetch(
        `https://school-management-crba.onrender.com/api/principle/complete-onboarding?token=${token}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            password,
            experience,
            address,
            phoneNo,
          }),
        },
      );

      const data =
        await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          "Principal Registration Completed Successfully",
        );

        setPassword("");
        setExperience("");
        setAddress("");
        setPhoneNo("");

        setModalVisible(false);
      } else {
        Alert.alert(
          "Error",
          data?.message ||
            "Registration Failed",
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Network Request Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={
          styles.contentContainer
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <Text style={styles.heading}>
          Staff Management
        </Text>

        <Text style={styles.subHeading}>
          Manage faculty and staff
          records
        </Text>

        {/* SEARCH */}

        <View style={styles.searchBox}>
          <Search
            size={20}
            color={COLORS.textSub}
          />

          <TextInput
            placeholder="Search staff..."
            placeholderTextColor={
              COLORS.textSub
            }
            style={styles.searchInput}
          />
        </View>

        {/* STAFF CARD */}

        <TouchableOpacity
          style={styles.staffCard}
          onPress={fetchTeachers}
        >
          <Users
            size={42}
            color={COLORS.accent}
          />

          <Text style={styles.staffTitle}>
            Teachers
          </Text>

          <Text style={styles.staffDesc}>
            {loadingTeachers
              ? "Loading..."
              : `${teachers.length} Staff Members`}
          </Text>
        </TouchableOpacity>

        {/* STAFF FORM */}

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            Add New Staff
          </Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor={
              COLORS.textSub
            }
            style={styles.input}
          />

          <TextInput
            placeholder="Email Address"
            placeholderTextColor={
              COLORS.textSub
            }
            style={styles.input}
          />

          <TextInput
            placeholder="Phone Number"
            placeholderTextColor={
              COLORS.textSub
            }
            style={styles.input}
          />

          <TextInput
            placeholder="Department"
            placeholderTextColor={
              COLORS.textSub
            }
            style={styles.input}
          />

          <TextInput
            placeholder="Designation"
            placeholderTextColor={
              COLORS.textSub
            }
            style={styles.input}
          />

          <TextInput
            placeholder="Employee ID"
            placeholderTextColor={
              COLORS.textSub
            }
            style={styles.input}
          />

          {/* SAVE BUTTON */}

          <TouchableOpacity
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              Save Staff Member
            </Text>
          </TouchableOpacity>

          {/* PRINCIPAL INVITATION */}

          <TouchableOpacity
            style={styles.registerButton}
            activeOpacity={0.9}
            onPress={() =>
              setModalVisible(true)
            }
          >
            <View
              style={
                styles.registerContent
              }
            >
              <View
                style={
                  styles.iconContainer
                }
              >
                <Text style={styles.icon}>
                  👨‍🏫
                </Text>
              </View>

              <View
                style={
                  styles.textContainer
                }
              >
                <Text
                  style={
                    styles.registerTitle
                  }
                >
                  Principal Invitation
                </Text>

                <Text
                  style={
                    styles.registerSubtitle
                  }
                >
                  Open principal
                  registration form
                </Text>
              </View>

              <Text style={styles.arrow}>
                →
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ===================================== */}
      {/* STAFF MODAL */}
      {/* ===================================== */}

      <Modal
        visible={teachersModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View
            style={styles.staffModal}
          >
            {/* HEADER */}

            <View
              style={
                styles.staffModalHeader
              }
            >
              <Text
                style={
                  styles.staffModalTitle
                }
              >
                Teachers List
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setTeachersModal(
                    false,
                  )
                }
              >
                <X
                  size={24}
                  color={
                    COLORS.textMain
                  }
                />
              </TouchableOpacity>
            </View>

            {/* LIST */}

            <FlatList
              data={teachers}
              keyExtractor={(
                item,
                index,
              ) =>
                item.teacherId ||
                index.toString()
              }
              renderItem={({ item }) => (
                <View
                  style={
                    styles.teacherCard
                  }
                >
                  <View
                    style={
                      styles.teacherTop
                    }
                  >
                    <UserCircle2
                      size={46}
                      color={
                        COLORS.accent
                      }
                    />

                    <View
                      style={{
                        marginLeft: 12,
                        flex: 1,
                      }}
                    >
                      <Text
                        style={
                          styles.teacherName
                        }
                      >
                        {
                          item.teacherName
                        }
                      </Text>

                      <Text
                        style={
                          styles.teacherId
                        }
                      >
                        {
                          item.teacherId
                        }
                      </Text>
                    </View>
                  </View>

                  {/* EMAIL */}

                  <View
                    style={
                      styles.infoRow
                    }
                  >
                    <Mail
                      size={16}
                      color={
                        COLORS.accent
                      }
                    />

                    <Text
                      style={
                        styles.infoText
                      }
                    >
                      {item.email}
                    </Text>
                  </View>

                  {/* PHONE */}

                  <View
                    style={
                      styles.infoRow
                    }
                  >
                    <Phone
                      size={16}
                      color={
                        COLORS.accent
                      }
                    />

                    <Text
                      style={
                        styles.infoText
                      }
                    >
                      {item.phone}
                    </Text>
                  </View>

                  {/* QUALIFICATION */}

                  <View
                    style={
                      styles.infoRow
                    }
                  >
                    <GraduationCap
                      size={16}
                      color={
                        COLORS.accent
                      }
                    />

                    <Text
                      style={
                        styles.infoText
                      }
                    >
                      Qualification:{" "}
                      {
                        item.qualification
                      }
                    </Text>
                  </View>

                  {/* EXPERIENCE */}

                  <View
                    style={
                      styles.infoRow
                    }
                  >
                    <BriefcaseBusiness
                      size={16}
                      color={
                        COLORS.accent
                      }
                    />

                    <Text
                      style={
                        styles.infoText
                      }
                    >
                      Experience:{" "}
                      {item.experience}{" "}
                      Years
                    </Text>
                  </View>

                  {/* ADDRESS */}

                  <View
                    style={
                      styles.infoRow
                    }
                  >
                    <MapPin
                      size={16}
                      color={
                        COLORS.accent
                      }
                    />

                    <Text
                      style={
                        styles.infoText
                      }
                    >
                      {item.address}
                    </Text>
                  </View>

                  {/* SUBJECTS */}

                  <View
                    style={
                      styles.subjectBox
                    }
                  >
                    <Text
                      style={
                        styles.subjectText
                      }
                    >
                      Subjects:{" "}
                      {item.subjectIds
                        ?.length || 0}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* PRINCIPAL MODAL */}

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View
            style={styles.modalContainer}
          >
            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >
              <View
                style={styles.modalHeader}
              >
                <View
                  style={
                    styles.modalIconBox
                  }
                >
                  <Text
                    style={
                      styles.modalIcon
                    }
                  >
                    👨‍🏫
                  </Text>
                </View>

                <Text
                  style={styles.modalTitle}
                >
                  Principal Registration
                </Text>

                <Text
                  style={
                    styles.modalSubtitle
                  }
                >
                  Complete onboarding
                  registration
                </Text>
              </View>

              <View
                style={styles.formSection}
              >
                <Text style={styles.label}>
                  Password
                </Text>

                <TextInput
                  placeholder="Enter password"
                  placeholderTextColor={
                    COLORS.textSub
                  }
                  style={
                    styles.modalInput
                  }
                  secureTextEntry
                  value={password}
                  onChangeText={
                    setPassword
                  }
                />

                <Text style={styles.label}>
                  Experience
                </Text>

                <TextInput
                  placeholder="Enter experience"
                  placeholderTextColor={
                    COLORS.textSub
                  }
                  style={
                    styles.modalInput
                  }
                  value={experience}
                  onChangeText={
                    setExperience
                  }
                />

                <Text style={styles.label}>
                  Address
                </Text>

                <TextInput
                  placeholder="Enter address"
                  placeholderTextColor={
                    COLORS.textSub
                  }
                  style={[
                    styles.modalInput,
                    {
                      height: 70,
                      textAlignVertical:
                        "top",
                    },
                  ]}
                  multiline
                  value={address}
                  onChangeText={
                    setAddress
                  }
                />

                <Text style={styles.label}>
                  Phone Number
                </Text>

                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor={
                    COLORS.textSub
                  }
                  style={
                    styles.modalInput
                  }
                  keyboardType="phone-pad"
                  value={phoneNo}
                  onChangeText={
                    setPhoneNo
                  }
                />

                <TouchableOpacity
                  style={
                    styles.submitButton
                  }
                  onPress={
                    submitRegistration
                  }
                  disabled={loading}
                >
                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {loading
                      ? "Submitting..."
                      : "Submit Registration"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.cancelButton
                  }
                  onPress={() =>
                    setModalVisible(
                      false,
                    )
                  }
                >
                  <Text
                    style={
                      styles.cancelText
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ===================================== */
/* STYLES */
/* ===================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },

  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.primary,
  },

  subHeading: {
    marginTop: 4,
    marginBottom: 18,
    color: COLORS.textSub,
    fontSize: 13,
  },

  /* SEARCH */

  searchBox: {
    backgroundColor: COLORS.card,
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.textMain,
  },

  /* STAFF CARD */

  staffCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  staffTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textMain,
  },

  staffDesc: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textSub,
  },

  /* FORM */

  form: {
    backgroundColor: COLORS.card,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  formTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 14,
    color: COLORS.textMain,
    backgroundColor:
      COLORS.white,
  },

  button: {
    backgroundColor:
      COLORS.accent,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 14,
  },

  registerButton: {
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor:
      COLORS.primary,
    elevation: 5,
  },

  registerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 24,
  },

  textContainer: {
    flex: 1,
    marginLeft: 14,
  },

  registerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
  },

  registerSubtitle: {
    color:
      "rgba(255,255,255,0.8)",
    marginTop: 3,
    fontSize: 12,
  },

  arrow: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
  },

  /* STAFF MODAL */

  staffModal: {
    width: "88%",
    maxHeight: "82%",
    backgroundColor:
      COLORS.white,
    borderRadius: 28,
    padding: 20,
  },

  staffModalHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  staffModalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
  },

  teacherCard: {
    backgroundColor:
      "#F8FBFD",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  teacherTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  teacherName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textMain,
  },

  teacherId: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSub,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 13,
    color: COLORS.textMain,
    flex: 1,
  },

  subjectBox: {
    marginTop: 16,
    backgroundColor:
      COLORS.lightAccent,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  subjectText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 13,
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    width:
      width > 900
        ? "34%"
        : "88%",
    backgroundColor:
      COLORS.white,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 10,
  },

  modalHeader: {
    backgroundColor:
      COLORS.lightAccent,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  modalIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor:
      COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  modalIcon: {
    fontSize: 28,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
  },

  modalSubtitle: {
    marginTop: 4,
    color: COLORS.textSub,
    fontSize: 12,
    textAlign: "center",
  },

  formSection: {
    padding: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
    marginTop: 4,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 13,
    backgroundColor:
      "#FAFAFA",
    color: COLORS.textMain,
  },

  submitButton: {
    backgroundColor:
      COLORS.accent,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4,
  },

  cancelButton: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 6,
  },

  cancelText: {
    color: COLORS.textSub,
    fontWeight: "700",
    fontSize: 14,
  },
});