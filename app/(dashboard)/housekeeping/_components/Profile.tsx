import { LinearGradient } from "expo-linear-gradient";
import {
  Award,
  Briefcase,
  ChevronRight,
  Edit2,
  MapPin,
  Shield,
  User,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");
const isWide = SW > 900;

const C = {
  bg: "#f8f7ff",
  white: "#FFFFFF",
  dark: "#16082e",
  dark2: "#1e1135",
  textPrimary: "#0f172a",
  textSec: "#64748b",
  textTer: "#94a3b8",
  indigo: "#6366f1",
  indigoLight: "#eef2ff",
  green: "#10b981",
  greenLight: "#d1fae5",
  border: "#f1f5f9",
};

// ─── REUSABLE POPUP OVERLAY COMPONENT ───
interface PopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PopupOverlay = ({ visible, onClose, title, children }: PopupProps) => {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 0.95,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={S.popupContainer}>
        <Animated.View style={[S.popupBackdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={S.backdropDismissArea}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            S.popupContentCard,
            { opacity: backdropOpacity, transform: [{ scale: contentScale }] },
          ]}
        >
          <View style={S.popupHeaderLine}>
            <Text style={S.popupTitleText}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={S.popupCloseCircle}
              activeOpacity={0.7}
            >
              <X size={16} color={C.textSec} />
            </TouchableOpacity>
          </View>
          <View style={S.popupInnerBody}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── MAIN USER PROFILE SCREEN ───
export default function ProfileScreen() {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [userName, setUserName] = useState("Shanmukhi");
  const [inputName, setInputName] = useState(userName);

  const saveProfileName = () => {
    setUserName(inputName);
    setActivePopup(null);
  };

  return (
    <ScrollView
      style={S.screen}
      contentContainerStyle={S.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Identity Header */}
      <View style={S.heroContainer}>
        <LinearGradient
          colors={[C.dark, C.dark2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={S.gradientPad}
        >
          <View style={S.profileHeaderRow}>
            <View style={S.avatarContainer}>
              <View style={S.avatarCircle}>
                <User size={32} color={C.indigo} />
              </View>
              <View style={S.statusIndicatorDot} />
            </View>

            <View style={S.identityTextInfo}>
              <View style={S.nameEditContainer}>
                <Text style={S.profileMainName}>{userName}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setInputName(userName);
                    setActivePopup("edit_profile");
                  }}
                  style={S.inlineEditBtn}
                >
                  <Edit2 size={12} color={C.textTer} />
                </TouchableOpacity>
              </View>
              <Text style={S.profileRoleText}>Software Developer</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Profile Details Grid Section */}
      <View style={S.sectionLabelHeader}>
        <View style={S.accentIndicatorDot} />
        <Text style={S.sectionLabelText}>CONTEXT METADATA</Text>
      </View>

      <View style={S.metadataGridGrid}>
        <View style={S.metaGridCard}>
          <Briefcase size={16} color={C.indigo} style={S.metaIconSpace} />
          <Text style={S.metaLabel}>Specialization</Text>
          <Text style={S.metaValue}>Full-Stack / AI Systems</Text>
        </View>

        <View style={S.metaGridCard}>
          <MapPin size={16} color={C.indigo} style={S.metaIconSpace} />
          <Text style={S.metaLabel}>Deployment Site</Text>
          <Text style={S.metaValue}>Hyderabad</Text>
        </View>
      </View>

      {/* Account Settings Options List */}
      <View style={S.sectionLabelHeader}>
        <View style={[S.accentIndicatorDot, { backgroundColor: C.textSec }]} />
        <Text style={S.sectionLabelText}>ACCOUNT MANIFEST CONFIGURATIONS</Text>
      </View>

      <View style={S.listContainer}>
        <TouchableOpacity
          style={S.listItemRow}
          activeOpacity={0.7}
          onPress={() => setActivePopup("credentials_view")}
        >
          <View style={S.listItemLeft}>
            <View style={[S.listIconWrap, { backgroundColor: C.indigoLight }]}>
              <Shield size={14} color={C.indigo} />
            </View>
            <Text style={S.listItemText}>Security Clearance Profile</Text>
          </View>
          <ChevronRight size={14} color={C.textTer} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[S.listItemRow, { borderBottomWidth: 0 }]}
          activeOpacity={0.7}
          onPress={() => setActivePopup("certifications_view")}
        >
          <View style={S.listItemLeft}>
            <View style={[S.listIconWrap, { backgroundColor: C.greenLight }]}>
              <Award size={14} color={C.green} />
            </View>
            <Text style={S.listItemText}>Professional Certifications</Text>
          </View>
          <ChevronRight size={14} color={C.textTer} />
        </TouchableOpacity>
      </View>

      {/* ─── POPUP OVERLAYS DEFINITIONS ─── */}

      {/* Popup A: Edit Identity Properties */}
      <PopupOverlay
        visible={activePopup === "edit_profile"}
        onClose={() => setActivePopup(null)}
        title="Modify Profile Properties"
      >
        <Text style={S.contextParagraphText}>
          Update your baseline account profile naming signature identifier.
        </Text>
        <TextInput
          style={S.modalTextInput}
          placeholder="Enter Profile Identification Name"
          placeholderTextColor={C.textTer}
          value={inputName}
          onChangeText={setInputName}
        />
        <TouchableOpacity
          style={[
            S.modalActionCloseBtn,
            { backgroundColor: C.indigo, marginTop: 12 },
          ]}
          onPress={saveProfileName}
        >
          <Text style={S.modalActionCloseBtnText}>Save Account Registry</Text>
        </TouchableOpacity>
      </PopupOverlay>

      {/* Popup B: Security Verification Status */}
      <PopupOverlay
        visible={activePopup === "credentials_view"}
        onClose={() => setActivePopup(null)}
        title="Clearance Parameters"
      >
        <View style={S.metricStripRow}>
          <Text style={S.metricStripLabel}>Security Role Identity</Text>
          <Text style={S.metricStripValue}>SYSTEM_OPERATOR</Text>
        </View>
        <View style={S.metricStripRow}>
          <Text style={S.metricStripLabel}>Token Encryption Stack</Text>
          <Text style={[S.metricStripValue, { color: C.green }]}>
            AES-GCM Authenticated
          </Text>
        </View>
        <TouchableOpacity
          style={[
            S.modalActionCloseBtn,
            { backgroundColor: C.dark, marginTop: 12 },
          ]}
          onPress={() => setActivePopup(null)}
        >
          <Text style={S.modalActionCloseBtnText}>
            Close Verification Trace
          </Text>
        </TouchableOpacity>
      </PopupOverlay>

      {/* Popup C: Professional Certifications Overview */}
      <PopupOverlay
        visible={activePopup === "certifications_view"}
        onClose={() => setActivePopup(null)}
        title="Verified Track Certifications"
      >
        <View style={S.certItemFrame}>
          <Text style={S.certTitle}>AI Fundamentals Portfolio</Text>
          <Text style={S.certSub}>IBM Verified Registry Token</Text>
        </View>
        <View
          style={[S.certItemFrame, { borderBottomWidth: 0, paddingBottom: 0 }]}
        >
          <Text style={S.certTitle}>Python for Data Science Stack</Text>
          <Text style={S.certSub}>IBM System Core Frameworks</Text>
        </View>
        <TouchableOpacity
          style={[
            S.modalActionCloseBtn,
            { backgroundColor: C.green, marginTop: 16 },
          ]}
          onPress={() => setActivePopup(null)}
        >
          <Text style={S.modalActionCloseBtnText}>Dismiss Record Stream</Text>
        </TouchableOpacity>
      </PopupOverlay>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    padding: isWide ? 24 : 16,
    paddingBottom: 40,
  },
  heroContainer: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  gradientPad: {
    padding: 24,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIndicatorDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.dark2,
  },
  identityTextInfo: {
    flex: 1,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileMainName: {
    fontSize: 18,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.3,
  },
  inlineEditBtn: {
    padding: 4,
  },
  profileRoleText: {
    fontSize: 12,
    color: C.textTer,
    fontWeight: "500",
    marginTop: 2,
  },
  sectionLabelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
    marginBottom: 12,
  },
  accentIndicatorDot: {
    width: 4,
    height: 12,
    borderRadius: 2,
    backgroundColor: C.indigo,
  },
  sectionLabelText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.textSec,
    letterSpacing: 0.8,
  },
  metadataGridGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaGridCard: {
    flex: 1,
    minWidth: isWide ? 260 : 145,
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },
  metaIconSpace: {
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: C.textSec,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
    marginTop: 2,
  },
  listContainer: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  listItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textPrimary,
  },

  /* ─── POPUP OVERLAY ARCHITECTURE STYLES ─── */
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  popupBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  backdropDismissArea: {
    flex: 1,
  },
  popupContentCard: {
    backgroundColor: C.white,
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  popupHeaderLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  popupTitleText: {
    fontSize: 14,
    fontWeight: "800",
    color: C.textPrimary,
  },
  popupCloseCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  popupInnerBody: {
    paddingTop: 4,
  },
  contextParagraphText: {
    fontSize: 12,
    color: C.textSec,
    lineHeight: 17,
    marginBottom: 12,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 10,
    fontSize: 13,
    color: C.textPrimary,
    backgroundColor: C.bg,
    height: 42,
  },
  modalActionCloseBtn: {
    width: "100%",
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalActionCloseBtnText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
  },
  metricStripRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  metricStripLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textSec,
  },
  metricStripValue: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textPrimary,
  },
  certItemFrame: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  certTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: C.textPrimary,
  },
  certSub: {
    fontSize: 11,
    color: C.textSec,
    marginTop: 1,
  },
});
