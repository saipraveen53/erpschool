import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, ChevronDown, UploadCloud } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const COLORS = {
  primary: "#E35336",
  accent: "#F5F50C",
  secondary: "#F4A460",
  primaryLight: "#FEE2DB",
  secondaryLight: "#FEF0E8",
  bgWarm: "#FFF8F2",
  bgWhite: "#FFFFFF",
  textPrimary: "#3B2A1F",
  textSecondary: "#8B5E3C",
  textTertiary: "#B8956E",
  border: "#F0E4D8",
  white: "#FFFFFF",
};

const CLASSES = ["10-A", "10-B", "11-Science", "12-Science"];

export default function AssignHomeworkScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [selectedClass, setSelectedClass] = useState("Select Class");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAssign = () => {
    if (!title || selectedClass === "Select Class") {
      alert("Please fill in the class and title.");
      return;
    }
    alert("Homework Assigned Successfully!");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: COLORS.bgWhite }}
    >
      <StatusBar
        style="dark"
        backgroundColor={COLORS.bgWhite}
        translucent={false}
      />

      {/* Header */}
      <View
        className="flex-row items-center justify-between px-5 pb-4 border-b"
        style={{
          paddingTop: 40,
          backgroundColor: COLORS.bgWhite,
          borderBottomColor: COLORS.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-xl"
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text
          className="text-xl font-bold tracking-tight"
          style={{ color: COLORS.textPrimary }}
        >
          Assign Homework
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 24,
          alignSelf: "center",
          width: "100%",
          maxWidth: isDesktop ? 800 : "100%",
          paddingBottom: 100,
        }}
      >
        {/* Class Selector */}
        <View className="mb-5">
          <Text
            className="text-sm font-bold mb-2"
            style={{ color: COLORS.textPrimary }}
          >
            Class & Section
          </Text>
          <TouchableOpacity
            className="flex-row justify-between items-center px-4 py-4 rounded-xl"
            style={{
              backgroundColor: COLORS.lightGray,
            }}
            onPress={() => setDropdownVisible(true)}
          >
            <Text
              className="text-base font-semibold"
              style={{
                color:
                  selectedClass === "Select Class"
                    ? COLORS.textSecondary
                    : COLORS.textPrimary,
              }}
            >
              {selectedClass}
            </Text>
            <ChevronDown size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Assignment Title */}
        <View className="mb-5">
          <Text
            className="text-sm font-bold mb-2"
            style={{ color: COLORS.textPrimary }}
          >
            Assignment Title
          </Text>
          <TextInput
            className="px-4 py-4 rounded-xl text-base border border-transparent"
            style={{
              backgroundColor: COLORS.lightGray,
              color: COLORS.textPrimary,
            }}
            placeholder="e.g. Chapter 5 Practice Questions"
            placeholderTextColor={`${COLORS.textSecondary}80`}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Due Date */}
        <View className="mb-5">
          <Text
            className="text-sm font-bold mb-2"
            style={{ color: COLORS.textPrimary }}
          >
            Due Date
          </Text>
          <TextInput
            className="px-4 py-4 rounded-xl text-base border border-transparent"
            style={{
              backgroundColor: COLORS.lightGray,
              color: COLORS.textPrimary,
            }}
            placeholder="e.g. YYYY-MM-DD"
            placeholderTextColor={`${COLORS.textSecondary}80`}
            value={dueDate}
            onChangeText={setDueDate}
          />
        </View>

        {/* Description */}
        <View className="mb-5">
          <Text
            className="text-sm font-bold mb-2"
            style={{ color: COLORS.textPrimary }}
          >
            Description & Instructions
          </Text>
          <TextInput
            className="px-4 py-4 rounded-xl text-base border border-transparent min-h-[120px]"
            style={{
              backgroundColor: COLORS.lightGray,
              color: COLORS.textPrimary,
              textAlignVertical: "top",
            }}
            placeholder="Provide detailed instructions..."
            placeholderTextColor={`${COLORS.textSecondary}80`}
            multiline
            numberOfLines={4}
            value={desc}
            onChangeText={setDesc}
          />
        </View>

        {/* File Upload Placeholder */}
        <TouchableOpacity
          className="items-center py-8 mt-2 rounded-2xl border-2 border-dashed"
          style={{
            backgroundColor: `${COLORS.primary}0D`,
            borderColor: `${COLORS.primary}33`,
          }}
        >
          <UploadCloud
            size={32}
            color={COLORS.primary}
            style={{ marginBottom: 8 }}
          />
          <Text
            className="text-base font-bold"
            style={{ color: COLORS.primary }}
          >
            Attach a File
          </Text>
          <Text
            className="text-xs mt-1"
            style={{ color: COLORS.textSecondary }}
          >
            PDF, DOCX, or Images (Max 5MB)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Bar */}
      <View
        className="absolute bottom-0 w-full p-6 bg-white border-t"
        style={{
          backgroundColor: COLORS.bgWhite,
          borderTopColor: COLORS.border,
        }}
      >
        <TouchableOpacity
          className="py-4 rounded-xl items-center"
          style={{ backgroundColor: COLORS.primary }}
          onPress={handleAssign}
        >
          <Text
            className="text-white font-bold text-base"
            style={{ fontWeight: "800" }}
          >
            Assign Homework
          </Text>
        </TouchableOpacity>
      </View>

      {/* Class Selector Modal */}
      <Modal visible={isDropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View
            className="bg-white rounded-t-2xl p-6"
            style={{ backgroundColor: COLORS.bgWhite }}
          >
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: COLORS.textPrimary }}
            >
              Select Class
            </Text>
            {CLASSES.map((cls) => (
              <TouchableOpacity
                key={cls}
                className="py-4 border-b"
                style={[
                  selectedClass === cls && {
                    backgroundColor: `${COLORS.primary}0D`,
                  },
                  { borderBottomColor: COLORS.border },
                ]}
                onPress={() => {
                  setSelectedClass(cls);
                  setDropdownVisible(false);
                }}
              >
                <Text
                  className="text-base font-semibold"
                  style={[
                    { color: COLORS.textSecondary },
                    selectedClass === cls && {
                      color: COLORS.primary,
                      fontWeight: "800",
                    },
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}
