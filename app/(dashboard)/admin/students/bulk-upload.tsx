import React, { useState } from "react";
import {
  View,
  Text,
 StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { UploadCloud, FileText, Download } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function BulkUpload() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [targetClass, setTargetClass] = useState("");
  const [targetSection, setTargetSection] = useState("");

  return (
    <SafeAreaView
      style={styles.container}
      edges={isMobile ? ["left", "right", "bottom"] : ["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isMobile && styles.mobileContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            isMobile && styles.mobileHeader,
          ]}
        >
          <Text
            style={[
              styles.heading,
              isMobile && styles.mobileHeading,
            ]}
          >
            Bulk Upload Students
          </Text>

          <Text
            style={[
              styles.subHeading,
              isMobile && styles.mobileSubHeading,
            ]}
          >
            Import student records in bulk via Excel/CSV
          </Text>
        </View>

        {/* UPLOAD CARD */}
        <View
          style={[
            styles.uploadCard,
            isMobile && styles.mobileUploadCard,
          ]}
        >
          <View style={styles.uploadContent}>
            <View
              style={[
                styles.iconBox,
                isMobile && styles.mobileIconBox,
              ]}
            >
              <UploadCloud
                size={isMobile ? 38 : 48}
                color={COLORS.accent}
              />
            </View>

            <Text
              style={[
                styles.uploadTitle,
                isMobile && styles.mobileUploadTitle,
              ]}
            >
              Upload Excel or CSV File
            </Text>

            <Text
              style={[
                styles.uploadDesc,
                isMobile && styles.mobileUploadDesc,
              ]}
            >
              Select your file to begin the bulk import process
            </Text>

            {/* INPUTS */}
            <View
              style={[
                styles.inputRow,
                isMobile && styles.mobileInputRow,
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  isMobile && styles.mobileInput,
                ]}
                placeholder="Class"
                placeholderTextColor={COLORS.textSub}
                value={targetClass}
                onChangeText={setTargetClass}
              />

              <TextInput
                style={[
                  styles.input,
                  isMobile && styles.mobileInput,
                ]}
                placeholder="Section"
                placeholderTextColor={COLORS.textSub}
                value={targetSection}
                onChangeText={setTargetSection}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                isMobile && styles.mobileUploadButton,
              ]}
            >
              <Text
                style={[
                  styles.uploadButtonText,
                  isMobile && styles.mobileUploadButtonText,
                ]}
              >
                Choose File
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ACTION CARDS */}
        <View
          style={[
            styles.row,
            {
              flexDirection: isMobile ? "column" : "row",
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.actionCard,
              isMobile && styles.mobileActionCard,
            ]}
          >
            <FileText
              size={isMobile ? 22 : 28}
              color={COLORS.primary}
            />

            <Text
              style={[
                styles.actionTitle,
                isMobile && styles.mobileActionTitle,
              ]}
            >
              Sample Template
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              isMobile && styles.mobileActionCard,
            ]}
          >
            <Download
              size={isMobile ? 22 : 28}
              color={COLORS.primary}
            />

            <Text
              style={[
                styles.actionTitle,
                isMobile && styles.mobileActionTitle,
              ]}
            >
              Download Format
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    width: "100%",
  },

  mobileContent: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 25,
    alignItems: "center",
  },

  header: {
    marginBottom: 30,
  },

  mobileHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 18,
  },

  heading: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.primary,
  },

  mobileHeading: {
    fontSize: 24,
    textAlign: "center",
  },

  subHeading: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.textSub,
  },

  mobileSubHeading: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 6,
  },

  uploadCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 30,
    width: "100%",
  },

  mobileUploadCard: {
    paddingVertical: 22,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: 20,
  },

  uploadContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  iconBox: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: COLORS.lightAccent,
    borderRadius: 20,
  },

  mobileIconBox: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
  },

  uploadTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 8,
  },

  mobileUploadTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 6,
  },

  uploadDesc: {
    fontSize: 15,
    color: COLORS.textSub,
    marginBottom: 30,
  },

  mobileUploadDesc: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  inputRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 25,
    width: "100%",
    justifyContent: "center",
  },

  mobileInputRow: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },

  input: {
    width: "100%",
    maxWidth: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: COLORS.background,
  },

  mobileInput: {
    maxWidth: "100%",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    borderRadius: 10,
  },

  uploadButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 16,
  },

  mobileUploadButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 12,
  },

  uploadButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },

  mobileUploadButtonText: {
    fontSize: 14,
  },

  row: {
    justifyContent: "center",
    gap: 20,
    width: "100%",
  },

  actionCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  mobileActionCard: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
  },

  actionTitle: {
    marginTop: 15,
    fontWeight: "700",
    color: COLORS.primary,
    fontSize: 16,
    textAlign: "center",
  },

  mobileActionTitle: {
    fontSize: 14,
    marginTop: 10,
  },
});