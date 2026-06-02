import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const PRIMARY = "#A0522D";
const { width } = Dimensions.get("window");

export default function AddStaff() {
  return (
    <ScrollView
      style={styles.container}
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

      {/* FORM */}

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

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Save Staff Member
          </Text>
        </TouchableOpacity>
      </View>

      {/* ANALYTICS CARD */}

      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>
          Smart Hiring Insights
        </Text>

        <Text style={styles.analyticsText}>
          AI recommendations help optimize faculty onboarding and department
          balancing
        </Text>
      </View>
    </ScrollView>
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
    borderRadius: 20,
    elevation: 3,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 14,
    color: "#111827",
    width: "100%",
  },

  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  analyticsCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  analyticsTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY,
    textAlign: "center",
  },

  analyticsText: {
    marginTop: 10,
    lineHeight: 20,
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
  },
});