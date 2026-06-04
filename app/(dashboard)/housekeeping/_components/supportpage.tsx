import {
  AlertTriangle,
  CheckCircle,
  Key,
  Layers,
  ShieldAlert,
  UserCheck,
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
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  border: "#f1f5f9",
  red: "#ef4444",
  redLight: "#fee2e2",
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
            {
              opacity: backdropOpacity,
              transform: [{ scale: contentScale }],
            },
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

// ─── SECURITY & OPERATIONS HUB SCREEN ───
export default function SecuritySupportScreen() {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenRevoked, setTokenRevoked] = useState(false);

  const handleIncidentSubmit = () => {
    if (!reportText.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setReportText("");
      setActivePopup(null);
      alert("Incident dispatched to central routing control.");
    }, 1200);
  };

  return (
    <ScrollView
      style={S.screen}
      contentContainerStyle={S.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Security Banner Header */}
      <View style={S.heroMeta}>
        <View>
          <Text style={S.heroTitle}>Operations Console</Text>
          <Text style={S.heroSubtitle}>
            Deploy site allocations, view audit logs, and schedule daily tasks.
          </Text>
        </View>
      </View>

      {/* Grid Menu Targets */}
      <View style={S.sectionLabelHeader}>
        <View style={S.accentIndicatorDot} />
        <Text style={S.sectionLabelText}>ACTIVE RISK UTILITIES</Text>
      </View>

      <View style={S.actionMatrixGrid}>
        <TouchableOpacity
          style={S.actionGridCard}
          activeOpacity={0.8}
          onPress={() => setActivePopup("attendance_verify")}
        >
          <View style={[S.iconCircle, { backgroundColor: C.greenLight }]}>
            <UserCheck size={18} color={C.green} />
          </View>
          <Text style={S.actionCardLabel}>Verify Location</Text>
          <Text style={S.actionCardSubtext}>
            Audit active perimeter positioning signatures
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={S.actionGridCard}
          activeOpacity={0.8}
          onPress={() => setActivePopup("system_status")}
        >
          <View style={[S.iconCircle, { backgroundColor: C.indigoLight }]}>
            <Layers size={18} color={C.indigo} />
          </View>
          <Text style={S.actionCardLabel}>Telemetry Trace</Text>
          <Text style={S.actionCardSubtext}>
            Analyze storage distribution and ledger rates
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={S.actionGridCard}
          activeOpacity={0.8}
          onPress={() => setActivePopup("incident_alert")}
        >
          <View style={[S.iconCircle, { backgroundColor: C.redLight }]}>
            <AlertTriangle size={18} color={C.red} />
          </View>
          <Text style={S.actionCardLabel}>Structural Log</Text>
          <Text style={S.actionCardSubtext}>
            Review active structural facility tickets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={S.actionGridCard}
          activeOpacity={0.8}
          onPress={() => setActivePopup("dispatch_incident")}
        >
          <View style={[S.iconCircle, { backgroundColor: C.amberLight }]}>
            <ShieldAlert size={18} color={C.amber} />
          </View>
          <Text style={S.actionCardLabel}>Dispatch Report</Text>
          <Text style={S.actionCardSubtext}>
            Route security alerts directly to terminal control
          </Text>
        </TouchableOpacity>
      </View>

      {/* Secondary Tools List */}
      <View style={S.sectionLabelHeader}>
        <View style={[S.accentIndicatorDot, { backgroundColor: C.textSec }]} />
        <Text style={S.sectionLabelText}>SESSION IDENTITY ACTIONS</Text>
      </View>

      <View style={S.listContainer}>
        <TouchableOpacity
          style={S.listItemRow}
          activeOpacity={0.7}
          onPress={() => setActivePopup("token_rotation")}
        >
          <View style={S.listItemLeft}>
            <Key size={16} color={C.textSec} />
            <Text style={S.listItemText}>Rotate Bearer Credentials</Text>
          </View>
          <Text style={S.badgeMuted}>
            {tokenRevoked ? "Revoked" : "Active"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ─── POPUP OVERLAY DEFINITIONS ─── */}

      {/* Popup A: Attendance verification metadata */}
      <PopupOverlay
        visible={activePopup === "attendance_verify"}
        onClose={() => setActivePopup(null)}
        title="Spatial Geofence Active"
      >
        <View style={S.modalContextAlign}>
          <CheckCircle size={36} color={C.green} style={{ marginBottom: 12 }} />
          <Text style={S.contextHighlightHeadline}>GPS Token Validated</Text>
          <Text style={S.contextParagraphText}>
            Your mobile terminal footprint resolves perfectly inside the
            specified campus architecture coordinates. Attendance pipeline
            operational.
          </Text>
          <TouchableOpacity
            style={[S.modalActionCloseBtn, { backgroundColor: C.green }]}
            onPress={() => setActivePopup(null)}
          >
            <Text style={S.modalActionCloseBtnText}>Acknowledge Pipeline</Text>
          </TouchableOpacity>
        </View>
      </PopupOverlay>

      {/* Popup B: System Health Metrics */}
      <PopupOverlay
        visible={activePopup === "system_status"}
        onClose={() => setActivePopup(null)}
        title="Engine Diagnostic Overview"
      >
        <View style={S.metricStripRow}>
          <Text style={S.metricStripLabel}>Cluster Sync Rate</Text>
          <Text style={S.metricStripValue}>99.98%</Text>
        </View>
        <View style={S.metricStripRow}>
          <Text style={S.metricStripLabel}>API Ledger Latency</Text>
          <Text style={[S.metricStripValue, { color: C.green }]}>
            14ms (Optimal)
          </Text>
        </View>
        <View style={[S.metricStripRow, { borderBottomWidth: 0 }]}>
          <Text style={S.metricStripLabel}>Local Storage Delta</Text>
          <Text style={S.metricStripValue}>0.02 MB</Text>
        </View>
        <TouchableOpacity
          style={[
            S.modalActionCloseBtn,
            { backgroundColor: C.indigo, marginTop: 12 },
          ]}
          onPress={() => setActivePopup(null)}
        >
          <Text style={S.modalActionCloseBtnText}>
            Dismiss Diagnostic Trace
          </Text>
        </TouchableOpacity>
      </PopupOverlay>

      {/* Popup C: Incident Warning Alert */}
      <PopupOverlay
        visible={activePopup === "incident_alert"}
        onClose={() => setActivePopup(null)}
        title="Structural Fault Warning"
      >
        <Text style={S.contextParagraphText}>
          A high-priority incident token{" "}
          <Text style={{ fontWeight: "700", color: C.textPrimary }}>
            TKT-2026-44
          </Text>{" "}
          reports a continuous water main leakage line within the west office
          quadrant. Technical operators are moving to intercept.
        </Text>
        <TouchableOpacity
          style={[
            S.modalActionCloseBtn,
            { backgroundColor: C.dark, marginTop: 16 },
          ]}
          onPress={() => setActivePopup(null)}
        >
          <Text style={S.modalActionCloseBtnText}>Close Alerts</Text>
        </TouchableOpacity>
      </PopupOverlay>

      {/* Popup D: Dispatch Emergency Incident */}
      <PopupOverlay
        visible={activePopup === "dispatch_incident"}
        onClose={() => setActivePopup(null)}
        title="Dispatch Security Exception"
      >
        <Text style={[S.contextParagraphText, { marginBottom: 12 }]}>
          Provide structural detail markers or zone discrepancies to pass down
          cleanly onto terminal operator feeds.
        </Text>
        <TextInput
          style={S.modalInput}
          placeholder="Describe issue (e.g. Broken hardware locks zone B)..."
          placeholderTextColor={C.textTer}
          multiline
          numberOfLines={4}
          value={reportText}
          onChangeText={setReportText}
        />
        <TouchableOpacity
          style={[
            S.modalActionCloseBtn,
            { backgroundColor: C.red, marginTop: 8 },
          ]}
          onPress={handleIncidentSubmit}
          disabled={isSubmitting}
        >
          <Text style={S.modalActionCloseBtnText}>
            {isSubmitting ? "Routing Exception..." : "Fire Alert Dispatch"}
          </Text>
        </TouchableOpacity>
      </PopupOverlay>

      {/* Popup E: Credentials Control */}
      <PopupOverlay
        visible={activePopup === "token_rotation"}
        onClose={() => setActivePopup(null)}
        title="Bearer Security State"
      >
        <Text style={S.contextParagraphText}>
          Terminating or cycling verification records enforces local session
          invalidation. Active background tokens clear down immediately.
        </Text>
        <TouchableOpacity
          style={[
            S.modalActionCloseBtn,
            { backgroundColor: tokenRevoked ? C.indigo : C.red, marginTop: 16 },
          ]}
          onPress={() => {
            setTokenRevoked(!tokenRevoked);
            setActivePopup(null);
          }}
        >
          <Text style={S.modalActionCloseBtnText}>
            {tokenRevoked
              ? "Re-authorize Session Profile"
              : "Revoke Session Token Now"}
          </Text>
        </TouchableOpacity>
      </PopupOverlay>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fbececb5",
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
    padding: 20,
  },
  headerShieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  actionMatrixGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionGridCard: {
    flex: 1,
    minWidth: isWide ? 260 : 145,
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionCardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
  },
  actionCardSubtext: {
    fontSize: 11,
    color: C.textSec,
    marginTop: 2,
    lineHeight: 14,
  },
  listContainer: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: C.white,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textPrimary,
  },
  badgeMuted: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textSec,
    backgroundColor: C.bg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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
  heroMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
    marginVertical: 10,
  },
  heroTitle: {
    fontSize: isWide ? 26 : 22,
    fontWeight: "800",
    color: "#5C2E14",
  },
  heroSubtitle: {
    color: "#5C2E14",
    fontSize: isWide ? 14 : 12,
    marginTop: 4,
    opacity: 0.8,
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
  modalContextAlign: {
    alignItems: "center",
    textAlign: "center",
    paddingVertical: 4,
  },
  contextHighlightHeadline: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 6,
  },
  contextParagraphText: {
    fontSize: 12,
    color: C.textSec,
    lineHeight: 17,
    fontWeight: "500",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 12.5,
    color: C.textPrimary,
    backgroundColor: C.bg,
    height: 80,
    textAlignVertical: "top",
  },
  modalActionCloseBtn: {
    width: "100%",
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
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
});
