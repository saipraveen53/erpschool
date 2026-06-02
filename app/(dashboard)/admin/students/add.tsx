import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const PRIMARY = "#A0522D";

export default function AddStudent() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        Add New Student
      </Text>

      <View style={styles.form}>
        <TextInput placeholder="Student Name" style={styles.input} />
        <TextInput placeholder="Email Address" style={styles.input} />
        <TextInput placeholder="Phone Number" style={styles.input} />
        <TextInput placeholder="Class" style={styles.input} />
        <TextInput placeholder="Section" style={styles.input} />
        <TextInput placeholder="Roll Number" style={styles.input} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Save Student
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
    padding: 24,
  },

  heading: {
    fontSize: 34,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 24,
  },

  form: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },

  button: {
    backgroundColor: PRIMARY,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});