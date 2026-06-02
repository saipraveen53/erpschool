import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const PRIMARY = "#A0522D";
const { width } = Dimensions.get("window");

export default function AddStaff() {
  const [modalVisible, setModalVisible] = useState(false);

  // INVITATION STATES

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // SEND INVITATION API

  const sendInvitation = async () => {
    if (!fullName || !email) {
      Alert.alert(
        "Error",
        "Please fill all required fields"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.88.20:8081/api/principle/invite-driver",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            fullName: fullName,
          }),
        }
      );

      const data = await response.text();

      console.log("Invitation Response:", data);

      if (response.ok) {
        Alert.alert(
          "Success",
          "Invitation email sent successfully"
        );

        // RESET FORM

        setFullName("");
        setEmail("");

        setModalVisible(false);
      } else {
        Alert.alert(
          "Error",
          "Failed to send invitation"
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Network request failed"
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <Text style={styles.heading}>
          Add New Staff
        </Text>

        <Text style={styles.subHeading}>
          Enter faculty and employee details
        </Text>

        {/* STAFF FORM */}

        <View style={styles.form}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TextInput
            placeholder="Department"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TextInput
            placeholder="Designation"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TextInput
            placeholder="Employee ID"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          {/* SAVE STAFF BUTTON */}

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              Save Staff Member
            </Text>
          </TouchableOpacity>

          {/* INVITE BUTTON */}

          <TouchableOpacity
            style={styles.registerButton}
            activeOpacity={0.85}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.registerContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                  👨‍🏫
                </Text>
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.registerTitle}>
                  Principal Invitation
                </Text>

                <Text style={styles.registerSubtitle}>
                  Send onboarding invitation email
                </Text>
              </View>

              <Text style={styles.arrow}>
                →
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* INVITATION MODAL */}

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              {/* HEADER */}

              <View style={styles.modalHeader}>
                <View style={styles.modalIconBox}>
                  <Text style={styles.modalIcon}>
                    📧
                  </Text>
                </View>

                <Text style={styles.modalTitle}>
                  Principal Invitation
                </Text>

                <Text style={styles.modalSubtitle}>
                  Send secure onboarding invitation
                </Text>
              </View>

              {/* FORM */}

              <View style={styles.formSection}>
                {/* FULL NAME */}

                <Text style={styles.label}>
                  Full Name
                </Text>

                <TextInput
                  placeholder="Enter full name"
                  placeholderTextColor="#9CA3AF"
                  style={styles.modalInput}
                  value={fullName}
                  onChangeText={setFullName}
                />

                {/* EMAIL */}

                <Text style={styles.label}>
                  Email Address
                </Text>

                <TextInput
                  placeholder="Enter email address"
                  placeholderTextColor="#9CA3AF"
                  style={styles.modalInput}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {/* SUBMIT BUTTON */}

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={sendInvitation}
                >
                  <Text style={styles.buttonText}>
                    Send Invitation
                  </Text>
                </TouchableOpacity>

                {/* CANCEL BUTTON */}

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: PRIMARY,
  },

  subHeading: {
    marginTop: 4,
    marginBottom: 18,
    color: "#6B7280",
    fontSize: 13,
  },

  form: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 24,
    elevation: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  /* INVITE BUTTON */

  registerButton: {
    marginTop: 18,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#8B4513",
    elevation: 6,
  },

  registerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 26,
  },

  textContainer: {
    flex: 1,
    marginLeft: 16,
  },

  registerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  registerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    fontSize: 12,
  },

  arrow: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    width: width > 900 ? "45%" : "92%",
    backgroundColor: "#fff",
    borderRadius: 30,
    overflow: "hidden",
    elevation: 10,
  },

  modalHeader: {
    backgroundColor: "#FFF7F2",
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  modalIconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  modalIcon: {
    fontSize: 34,
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: PRIMARY,
  },

  modalSubtitle: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
  },

  formSection: {
    padding: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    marginTop: 6,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 14,
    backgroundColor: "#FAFAFA",
    color: "#111827",
  },

  submitButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
  },

  cancelButton: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 8,
  },

  cancelText: {
    color: "#6B7280",
    fontWeight: "700",
    fontSize: 15,
  },
});