import {
  Bell,
  ChevronRight,
  Database,
  Fingerprint,
  Lock,
  Moon,
  RotateCcw,
  User,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
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
  red: "#ef4444",
  redLight: "#fee2e2",
  border: "#f1f5f9",
};

// ─── REUSABLE POPUP ENGINE WRAPPER ───
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
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.back(1.4)),
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
      <View style={S.popupOverlayContainer}>
        <Animated.View style={[S.popupBackdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            S.popupCardBody,
            { opacity: backdropOpacity, transform: [{ scale: contentScale }] },
          ]}
        >
          <View style={S.popupHeaderRow}>
            <Text style={S.popupTitleText}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={S.popupCloseCircle}
              activeOpacity={0.7}
            >
              <X size={14} color={C.textSec} />
            </TouchableOpacity>
          </View>
          <View style={S.popupInnerContent}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── MAIN SETTINGS CONTEXT WINDOW ───
export default function SettingsScreen() {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // Quick State Toggles
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineSync, setOfflineSync] = useState(true);

  // Global Mock Account Context Data States
  const [userProfile, setUserProfile] = useState({
    fullName: "Shanmukhi",
    contactEmail: "shanmukhi@enterprise.corp",
    routingHandle: "@shan_dev_admin",
  });

  // Profile Form Interaction Temporaries
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [profileErrors, setProfileErrors] = useState<{
    fullName?: string;
    contactEmail?: string;
  }>({});
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Credentials Update Temporaries
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credErrors, setCredErrors] = useState<{
    currentPass?: string;
    newPass?: string;
    confirmPass?: string;
  }>({});
  const [credSuccess, setCredSuccess] = useState<string | null>(null);

  // Safe Lifecycle Form Initializers
  useEffect(() => {
    if (activePopup === "profile_meta") {
      setEditName(userProfile.fullName);
      setEditEmail(userProfile.contactEmail);
      setProfileErrors({});
      setProfileSuccess(null);
    } else if (activePopup === "credentials") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCredErrors({});
      setCredSuccess(null);
    }
  }, [activePopup]);

  // Profile Meta Commit Workflow Verification Engine
  const commitProfileChanges = () => {
    const errorsMap: typeof profileErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!editName.trim()) {
      errorsMap.fullName = "Display name label field cannot be blank.";
    } else if (editName.trim().length < 3) {
      errorsMap.fullName = "Name handle must be 3 or more characters.";
    }

    if (!editEmail.trim()) {
      errorsMap.contactEmail =
        "Enterprise target routing endpoint is required.";
    } else if (!emailRegex.test(editEmail.trim())) {
      errorsMap.contactEmail =
        "Input does not conform to valid standard email structures.";
    }

    if (Object.keys(errorsMap).length > 0) {
      setProfileErrors(errorsMap);
      return;
    }

    setProfileErrors({});
    setUserProfile((prev) => ({
      ...prev,
      fullName: editName.trim(),
      contactEmail: editEmail.trim(),
    }));

    setProfileSuccess("User environment details successfully configured.");
    setTimeout(() => {
      setActivePopup(null);
      setProfileSuccess(null);
    }, 1400);
  };

  // Credential Security Policy Evaluation Layer
  const commitCredentialReset = () => {
    const errorsMap: typeof credErrors = {};

    if (!currentPassword) {
      errorsMap.currentPass = "Active verification passphrase must be input.";
    }
    if (!newPassword) {
      errorsMap.newPass = "Security token initialization requires a value.";
    } else if (newPassword.length < 8) {
      errorsMap.newPass =
        "Passphrase strength matrix requires at least 8 characters.";
    }
    if (newPassword !== confirmPassword) {
      errorsMap.confirmPass = "Mismatched validation entries detected.";
    }

    if (Object.keys(errorsMap).length > 0) {
      setCredErrors(errorsMap);
      return;
    }

    setCredErrors({});
    setCredSuccess("Master Authorization Headers Synchronized.");
    setTimeout(() => {
      setActivePopup(null);
      setCredSuccess(null);
    }, 1400);
  };

  return (
    <ScrollView
      style={S.screen}
      contentContainerStyle={S.content}
      showsVerticalScrollIndicator={false}
    >
      {/* SECTION 1: IDENTITY MATCHERS */}
      <View style={S.sectionLabelHeader}>
        <View style={S.accentIndicatorDot} />
        <Text style={S.sectionLabelText}>ACCOUNT & SECURITY</Text>
      </View>

      <View style={S.settingsBlockCard}>
        <TouchableOpacity
          style={S.rowItem}
          activeOpacity={0.7}
          onPress={() => setActivePopup("profile_meta")}
        >
          <View style={[S.iconWrapper, { backgroundColor: C.indigoLight }]}>
            <User size={16} color={C.indigo} />
          </View>
          <View style={S.rowContent}>
            <Text style={S.rowTitle}>Profile Metadata</Text>
            <Text style={S.rowSubtitle}>
              Manage display handles and contact endpoints
            </Text>
          </View>
          <ChevronRight size={16} color={C.textTer} />
        </TouchableOpacity>

        <View style={S.rowSeparator} />

        <TouchableOpacity
          style={S.rowItem}
          activeOpacity={0.7}
          onPress={() => setActivePopup("credentials")}
        >
          <View style={[S.iconWrapper, { backgroundColor: "#e0f2fe" }]}>
            <Lock size={16} color="#0284c7" />
          </View>
          <View style={S.rowContent}>
            <Text style={S.rowTitle}>Credentials & Authorization</Text>
            <Text style={S.rowSubtitle}>
              Update passphrases and structural access keys
            </Text>
          </View>
          <ChevronRight size={16} color={C.textTer} />
        </TouchableOpacity>

        <View style={S.rowSeparator} />

        <View style={S.rowItem}>
          <View style={[S.iconWrapper, { backgroundColor: C.greenLight }]}>
            <Fingerprint size={16} color={C.green} />
          </View>
          <View style={S.rowContent}>
            <Text style={S.rowTitle}>Biometric Authentication</Text>
            <Text style={S.rowSubtitle}>
              Hardware fingerprint or face validation parameters
            </Text>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={(val) => {
              setBiometricsEnabled(val);
              if (val) setActivePopup("biometrics_success");
            }}
            trackColor={{ false: C.border, true: C.indigo }}
            thumbColor={C.white}
          />
        </View>
      </View>

      {/* SECTION 2: SYSTEM RUNTIME PREFERENCES */}
      <View style={S.sectionLabelHeader}>
        <View style={S.accentIndicatorDot} />
        <Text style={S.sectionLabelText}>PREFERENCES & DATA PIPELINES</Text>
      </View>

      <View style={S.settingsBlockCard}>
        <View style={S.rowItem}>
          <View style={[S.iconWrapper, { backgroundColor: "#fee2e2" }]}>
            <Bell size={16} color={C.red} />
          </View>
          <View style={S.rowContent}>
            <Text style={S.rowTitle}>Push Stream Alerts</Text>
            <Text style={S.rowSubtitle}>
              Instant notifications for platform ticket changes
            </Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: C.border, true: C.indigo }}
            thumbColor={C.white}
          />
        </View>

        <View style={S.rowSeparator} />

        <View style={S.rowItem}>
          <View style={[S.iconWrapper, { backgroundColor: "#fae8ff" }]}>
            <Moon size={16} color="#c026d3" />
          </View>
          <View style={S.rowContent}>
            <Text style={S.rowTitle}>Dark Appearance Layer</Text>
            <Text style={S.rowSubtitle}>
              Optimize UI threshold contrast vectors
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: C.border, true: C.indigo }}
            thumbColor={C.white}
          />
        </View>

        <View style={S.rowSeparator} />

        <View style={S.rowItem}>
          <View style={[S.iconWrapper, { backgroundColor: "#ffedd5" }]}>
            <Database size={16} color="#ea580c" />
          </View>
          <View style={S.rowContent}>
            <Text style={S.rowTitle}>Local Cache Engine Offline Sync</Text>
            <Text style={S.rowSubtitle}>
              Retain structural layout datasets locally
            </Text>
          </View>
          <Switch
            value={offlineSync}
            onValueChange={setOfflineSync}
            trackColor={{ false: C.border, true: C.indigo }}
            thumbColor={C.white}
          />
        </View>
      </View>

      {/* PURGE TRIGGER FOOTER BUTTON */}
      <TouchableOpacity
        style={S.purgeCacheActionButton}
        activeOpacity={0.85}
        onPress={() => setActivePopup("purge_cache_confirm")}
      >
        <RotateCcw size={14} color={C.red} />
        <Text style={S.purgeActionLabelText}>Wipe Runtime Cache State</Text>
      </TouchableOpacity>

      {/* ─── INTERACTIVE MODAL OVERLAY STREAMS ─── */}

      {/* Popup 1: Profile Meta Configuration Form */}
      <PopupOverlay
        visible={activePopup === "profile_meta"}
        onClose={() => !profileSuccess && setActivePopup(null)}
        title="Edit Profile Information"
      >
        {profileSuccess && (
          <View style={S.successInlineMessageCard}>
            <Text style={S.successInlineMessageText}>{profileSuccess}</Text>
          </View>
        )}

        <View style={S.inputFieldControlGroup}>
          <Text style={S.inputFieldLabel}>Display Target Name</Text>
          <TextInput
            editable={!profileSuccess}
            value={editName}
            onChangeText={(v) => {
              setEditName(v);
              if (profileErrors.fullName)
                setProfileErrors((p) => ({ ...p, fullName: undefined }));
            }}
            placeholder="Input display profile identification"
            placeholderTextColor={C.textTer}
            style={[
              S.interactiveTextInput,
              profileErrors.fullName && S.interactiveTextInputInvalid,
            ]}
          />
          {profileErrors.fullName && (
            <Text style={S.validationErrorMessageLabel}>
              {profileErrors.fullName}
            </Text>
          )}
        </View>

        <View style={S.inputFieldControlGroup}>
          <Text style={S.inputFieldLabel}>
            Enterprise Routing Endpoint (Email)
          </Text>
          <TextInput
            editable={!profileSuccess}
            value={editEmail}
            onChangeText={(v) => {
              setEditEmail(v);
              if (profileErrors.contactEmail)
                setProfileErrors((p) => ({ ...p, contactEmail: undefined }));
            }}
            placeholder="username@company.domain"
            placeholderTextColor={C.textTer}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              S.interactiveTextInput,
              profileErrors.contactEmail && S.interactiveTextInputInvalid,
            ]}
          />
          {profileErrors.contactEmail && (
            <Text style={S.validationErrorMessageLabel}>
              {profileErrors.contactEmail}
            </Text>
          )}
        </View>

        <View style={S.dualActionButtonLayoutContainer}>
          <TouchableOpacity
            disabled={!!profileSuccess}
            style={[S.actionButtonPrimary, { backgroundColor: C.bg, flex: 1 }]}
            onPress={() => setActivePopup(null)}
          >
            <Text style={[S.actionButtonText, { color: C.textPrimary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!!profileSuccess}
            style={[
              S.actionButtonPrimary,
              { backgroundColor: C.indigo, flex: 1 },
            ]}
            onPress={commitProfileChanges}
          >
            <Text style={S.actionButtonText}>Save Details</Text>
          </TouchableOpacity>
        </View>
      </PopupOverlay>

      {/* Popup 2: Credentials Security Token Form */}
      <PopupOverlay
        visible={activePopup === "credentials"}
        onClose={() => !credSuccess && setActivePopup(null)}
        title="Update Security Parameters"
      >
        {credSuccess && (
          <View style={S.successInlineMessageCard}>
            <Text style={S.successInlineMessageText}>{credSuccess}</Text>
          </View>
        )}

        <View style={S.inputFieldControlGroup}>
          <Text style={S.inputFieldLabel}>Current Verification Key</Text>
          <TextInput
            secureTextEntry
            editable={!credSuccess}
            value={currentPassword}
            onChangeText={(v) => {
              setCurrentPassword(v);
              if (credErrors.currentPass)
                setCredErrors((p) => ({ ...p, currentPass: undefined }));
            }}
            placeholder="••••••••"
            placeholderTextColor={C.textTer}
            style={[
              S.interactiveTextInput,
              credErrors.currentPass && S.interactiveTextInputInvalid,
            ]}
          />
          {credErrors.currentPass && (
            <Text style={S.validationErrorMessageLabel}>
              {credErrors.currentPass}
            </Text>
          )}
        </View>

        <View style={S.inputFieldControlGroup}>
          <Text style={S.inputFieldLabel}>New Security Passphrase Token</Text>
          <TextInput
            secureTextEntry
            editable={!credSuccess}
            value={newPassword}
            onChangeText={(v) => {
              setNewPassword(v);
              if (credErrors.newPass)
                setCredErrors((p) => ({ ...p, newPass: undefined }));
            }}
            placeholder="Minimum 8 symbols"
            placeholderTextColor={C.textTer}
            style={[
              S.interactiveTextInput,
              credErrors.newPass && S.interactiveTextInputInvalid,
            ]}
          />
          {credErrors.newPass && (
            <Text style={S.validationErrorMessageLabel}>
              {credErrors.newPass}
            </Text>
          )}
        </View>

        <View style={S.inputFieldControlGroup}>
          <Text style={S.inputFieldLabel}>Confirm New Entry Token</Text>
          <TextInput
            secureTextEntry
            editable={!credSuccess}
            value={confirmPassword}
            onChangeText={(v) => {
              setConfirmPassword(v);
              if (credErrors.confirmPass)
                setCredErrors((p) => ({ ...p, confirmPass: undefined }));
            }}
            placeholder="Match input explicitly"
            placeholderTextColor={C.textTer}
            style={[
              S.interactiveTextInput,
              credErrors.confirmPass && S.interactiveTextInputInvalid,
            ]}
          />
          {credErrors.confirmPass && (
            <Text style={S.validationErrorMessageLabel}>
              {credErrors.confirmPass}
            </Text>
          )}
        </View>

        <View style={S.dualActionButtonLayoutContainer}>
          <TouchableOpacity
            disabled={!!credSuccess}
            style={[S.actionButtonPrimary, { backgroundColor: C.bg, flex: 1 }]}
            onPress={() => setActivePopup(null)}
          >
            <Text style={[S.actionButtonText, { color: C.textPrimary }]}>
              Abandone
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!!credSuccess}
            style={[
              S.actionButtonPrimary,
              { backgroundColor: C.indigo, flex: 1 },
            ]}
            onPress={commitCredentialReset}
          >
            <Text style={S.actionButtonText}>Update Keys</Text>
          </TouchableOpacity>
        </View>
      </PopupOverlay>

      {/* Popup 3: Biometrics Sync Notification Badge */}
      <PopupOverlay
        visible={activePopup === "biometrics_success"}
        onClose={() => setActivePopup(null)}
        title="Biometrics Sync Complete"
      >
        <Text style={S.popupBodyParagraph}>
          Hardware biometric validation tags have successfully mapped to your
          local device security context. Future workspace access tokens can
          resolve using Face/Touch signature routines.
        </Text>
        <TouchableOpacity
          style={[S.actionButtonPrimary, { backgroundColor: C.green }]}
          onPress={() => setActivePopup(null)}
        >
          <Text style={S.actionButtonText}>Excellent</Text>
        </TouchableOpacity>
      </PopupOverlay>

      {/* Popup 4: Danger Cache Purge Interceptor */}
      <PopupOverlay
        visible={activePopup === "purge_cache_confirm"}
        onClose={() => setActivePopup(null)}
        title="Confirm Structural Wipe"
      >
        <Text style={S.popupBodyParagraph}>
          Warning: Erasing the runtime state cache drops all local indices.
          Non-synchronized changes will require full data fetches from servers.
        </Text>
        <View style={{ gap: 8 }}>
          <TouchableOpacity
            style={[S.actionButtonPrimary, { backgroundColor: C.red }]}
            onPress={() => {
              setBiometricsEnabled(false);
              setPushEnabled(true);
              setDarkMode(false);
              setOfflineSync(true);
              setActivePopup(null);
            }}
          >
            <Text style={S.actionButtonText}>Confirm and Clear Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[S.actionButtonPrimary, { backgroundColor: C.bg }]}
            onPress={() => setActivePopup(null)}
          >
            <Text style={[S.actionButtonText, { color: C.textPrimary }]}>
              Abort Operation
            </Text>
          </TouchableOpacity>
        </View>
      </PopupOverlay>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbececb5" },
  content: { padding: isWide ? 24 : 16, paddingBottom: 40 },
  telemetryBoard: {
    backgroundColor: C.dark2,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.indigo,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: C.white, fontWeight: "800", fontSize: 14 },
  telemetryTitle: { color: C.white, fontSize: 16, fontWeight: "800" },
  telemetrySubtitle: {
    color: C.textTer,
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
  },
  sectionLabelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
    marginBottom: 10,
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
  settingsBlockCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",

    justifyContent: "center",
  },
  rowContent: { flex: 1, justifyContent: "center" },
  rowTitle: { fontSize: 13, fontWeight: "700", color: C.textPrimary },
  rowSubtitle: { fontSize: 11, color: C.textSec, marginTop: 2, lineHeight: 14 },
  rowSeparator: { height: 1, backgroundColor: C.border },
  purgeCacheActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: C.red + "25",
    backgroundColor: C.redLight,
    borderRadius: 14,
    height: 42,
    marginTop: 24,
  },
  purgeActionLabelText: { color: C.red, fontSize: 12, fontWeight: "700" },

  /* ─── ENHANCED INPUTS & VALIDATION GRAPHICS ─── */
  inputFieldControlGroup: { marginBottom: 14 },
  inputFieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 5,
  },
  interactiveTextInput: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 12,
    color: C.textPrimary,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  interactiveTextInputInvalid: {
    borderColor: C.red,
    backgroundColor: "#fff5f5",
  },
  validationErrorMessageLabel: {
    color: C.red,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    marginLeft: 2,
  },
  successInlineMessageCard: {
    backgroundColor: C.greenLight,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderColor: C.green,
  },
  successInlineMessageText: {
    color: "#065f46",
    fontSize: 11,
    fontWeight: "700",
  },
  dualActionButtonLayoutContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },

  /* ─── POPUP STYLE SCHEMAS ─── */
  popupOverlayContainer: {
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
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  popupCardBody: {
    backgroundColor: C.white,
    borderRadius: 24,
    width: "100%",
    maxWidth: 380,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  popupHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  popupTitleText: { fontSize: 14, fontWeight: "800", color: C.textPrimary },
  popupCloseCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  popupInnerContent: { paddingTop: 4 },
  popupBodyParagraph: {
    fontSize: 12,
    color: C.textSec,
    lineHeight: 17,
    fontWeight: "500",
    marginBottom: 16,
  },
  actionButtonPrimary: {
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  actionButtonText: { color: C.white, fontSize: 12, fontWeight: "700" },
});
