import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  Upload,
  FileSpreadsheet,
  Download,
} from "lucide-react-native";

const PRIMARY = "#A0522D";

export default function BulkUpload() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Bulk Upload Students
      </Text>

      <View style={styles.uploadCard}>
        <Upload size={60} color={PRIMARY} />

        <Text style={styles.title}>
          Upload Excel or CSV File
        </Text>

        <Text style={styles.subtitle}>
          Import student records instantly
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Choose File
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionCard}>
          <FileSpreadsheet size={32} color={PRIMARY} />

          <Text style={styles.actionText}>
            Sample Template
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Download size={32} color={PRIMARY} />

          <Text style={styles.actionText}>
            Download Format
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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

  uploadCard: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 30,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 10,
    color: "#6B7280",
  },

  button: {
    marginTop: 24,
    backgroundColor: PRIMARY,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  actionCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
  },

  actionText: {
    marginTop: 12,
    fontWeight: "700",
  },
});