import {
  AlertTriangle,
  CheckCircle,
  Cpu,
  Database,
  Key,
  Layers,
  Radio,
  ShieldAlert,
  Sliders,
  UserCheck,
  X,
  ZapOff,
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

export default function SecuritySupportScreen() {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // Incident & Operational States
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchError, setDispatchError] = useState<string | null>(null);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Custom Infrastructure Parametric States
  const [threatLevel, setThreatLevel] = useState<"low" | "standard" | "high">(
    "standard",
  );
  const [systemOverrideActive, setSystemOverrideActive] = useState(false);
  const [isProcessingOverride, setIsProcessingOverride] = useState(false);
  const [tokenRevoked, setTokenRevoked] = useState(false);
  const [rotationState, setRotationState] = useState<
    "idle" | "cycling" | "done"
  >("idle");

  useEffect(() => {
    if (activePopup === "dispatch_incident") {
      setReportText("");
      setDispatchError(null);
      setDispatchSuccess(null);
      setIsSubmitting(false);
    } else if (activePopup === "token_rotation") {
      setRotationState("idle");
    }
  }, [activePopup]);

  const handleIncidentSubmit = () => {
    if (!reportText.trim()) {
      setDispatchError("Exception markers require short description logs.");
      return;
    }
    if (reportText.trim().length < 10) {
      setDispatchError("Telemetry log must contain 10 characters minimum.");
      return;
    }

    setDispatchError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setDispatchSuccess(
        "Incident packet pushed down to central tracking feeds.",
      );
      setReportText("");
      setTimeout(() => {
        setActivePopup(null);
        setDispatchSuccess(null);
      }, 1500);
    }, 1200);
  };

  const handleOverrideToggle = () => {
    setIsProcessingOverride(true);
    setTimeout(() => {
      setSystemOverrideActive(!systemOverrideActive);
      setIsProcessingOverride(false);
      setTimeout(() => setActivePopup(null), 800);
    }, 1400);
  };

  const runTokenLifecycleUpdate = () => {
    setRotationState("cycling");
    setTimeout(() => {
      setTokenRevoked(!tokenRevoked);
      setRotationState("done");
      setTimeout(() => setActivePopup(null), 1000);
    }, 1400);
  };

  return (
    <ScrollView
      style={S.screen}
      contentContainerStyle={S.content}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={S.mainInnerWrapper}>
        {/* Security Banner Header */}
        <View style={S.heroMeta}>
          <View>
            <Text style={S.heroTitle}>Operations Console</Text>
            <Text style={S.heroSubtitle}>
              Deploy site allocations, view audit logs, and schedule daily
              tasks.
            </Text>
          </View>
        </View>

        {/* Live Infrastructure Metrics Grid */}
        <View style={S.sectionLabelHeader}>
          <View style={[S.accentIndicatorDot, { backgroundColor: C.indigo }]} />
          <Text style={S.sectionLabelText}>LIVE TELEMETRY TRACKING</Text>
        </View>

        <View style={S.metricsDataRow}>
          <View style={S.metricBlockCard}>
            <View style={S.metricBlockTop}>
              <Database size={16} color={C.indigo} />
              <Text style={S.metricBlockTitle}>Storage Volume</Text>
            </View>
            <Text style={S.metricBlockValue}>412.8 GB</Text>
            <Text style={S.metricBlockStatus}>
              82% of Total Cluster Capacity
            </Text>
          </View>

          <View style={S.metricBlockCard}>
            <View style={S.metricBlockTop}>
              <Cpu size={16} color={C.green} />
              <Text style={S.metricBlockTitle}>Processor Matrix</Text>
            </View>
            <Text style={S.metricBlockValue}>14.2%</Text>
            <Text style={[S.metricBlockStatus, { color: C.green }]}>
              Consistent Pipeline Latency
            </Text>
          </View>

          <View style={S.metricBlockCard}>
            <View style={S.metricBlockTop}>
              <Radio
                size={16}
                color={threatLevel === "high" ? C.red : C.amber}
              />
              <Text style={S.metricBlockTitle}>Threat Vector</Text>
            </View>
            <Text
              style={[
                S.metricBlockValue,
                { color: threatLevel === "high" ? C.red : C.textPrimary },
              ]}
            >
              {threatLevel.toUpperCase()}
            </Text>
            <Text style={S.metricBlockStatus}>Configured Network Level</Text>
          </View>
        </View>

        {/* Action Array Grid Target Links */}
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

          <TouchableOpacity
            style={S.actionGridCard}
            activeOpacity={0.8}
            onPress={() => setActivePopup("threat_mitigation")}
          >
            <View style={[S.iconCircle, { backgroundColor: C.indigoLight }]}>
              <Sliders size={18} color={C.indigo} />
            </View>
            <Text style={S.actionCardLabel}>Mitigation Layer</Text>
            <Text style={S.actionCardSubtext}>
              Modify deep firewall threshold levels
            </Text>
          </TouchableOpacity>
        </View>

        {/* Secondary Identity Actions */}
        <View style={S.sectionLabelHeader}>
          <View
            style={[S.accentIndicatorDot, { backgroundColor: C.textSec }]}
          />
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
            <View
              style={[
                S.statusBadge,
                tokenRevoked ? S.statusBadgeRevoked : S.statusBadgeActive,
              ]}
            >
              <Text
                style={[
                  S.statusBadgeText,
                  tokenRevoked
                    ? S.statusBadgeTextRevoked
                    : S.statusBadgeTextActive,
                ]}
              >
                {tokenRevoked ? "Revoked" : "Active"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              S.listItemRow,
              { borderTopWidth: 1, borderColor: C.border },
            ]}
            activeOpacity={0.7}
            onPress={() => setActivePopup("system_override")}
          >
            <View style={S.listItemLeft}>
              <ZapOff
                size={16}
                color={systemOverrideActive ? C.red : C.textSec}
              />
              <Text style={S.listItemText}>Global Protocol Override</Text>
            </View>
            <View
              style={[
                S.statusBadge,
                systemOverrideActive
                  ? S.statusBadgeRevoked
                  : { backgroundColor: C.bg },
              ]}
            >
              <Text
                style={[
                  S.statusBadgeText,
                  systemOverrideActive
                    ? S.statusBadgeTextRevoked
                    : { color: C.textSec },
                ]}
              >
                {systemOverrideActive ? "ENGAGED" : "Standby"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── POPUP OVERLAY SYSTEM DEFINITIONS ─── */}

      {/* Popup A: Location Validation */}
      <PopupOverlay
        visible={activePopup === "attendance_verify"}
        onClose={() => setActivePopup(null)}
        title="Spatial Geofence Active"
      >
        <View style={S.modalContextAlign}>
          <CheckCircle size={36} color={C.green} style={{ marginBottom: 12 }} />
          <Text style={S.contextHighlightHeadline}>GPS Token Validated</Text>
          <Text style={S.contextParagraphText}>
            Your mobile terminal footprint resolves perfectly inside specified
            campus coordinates.
          </Text>
          <TouchableOpacity
            style={[S.modalActionCloseBtn, { backgroundColor: C.green }]}
            onPress={() => setActivePopup(null)}
          >
            <Text style={S.modalActionCloseBtnText}>Acknowledge Pipeline</Text>
          </TouchableOpacity>
        </View>
      </PopupOverlay>

      {/* Popup B: System Metrics Trace */}
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

      {/* Popup C: Incident Log Alerts */}
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
          reports a water main discrepancy within the west quadrant.
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

      {/* Popup D: Security Exception Dispatches */}
      <PopupOverlay
        visible={activePopup === "dispatch_incident"}
        onClose={() => !dispatchSuccess && setActivePopup(null)}
        title="Dispatch Security Exception"
      >
        {dispatchSuccess ? (
          <View style={S.toastMessageSuccessCard}>
            <Text style={S.toastMessageSuccessText}>{dispatchSuccess}</Text>
          </View>
        ) : (
          <>
            <Text style={S.contextParagraphText}>
              Provide structural detail markers to pass down cleanly to operator
              terminals.
            </Text>
            <TextInput
              style={[S.modalInput, dispatchError ? S.modalInputInvalid : null]}
              placeholder="Describe zone issue..."
              placeholderTextColor={C.textTer}
              multiline
              numberOfLines={4}
              value={reportText}
              onChangeText={(t) => {
                setReportText(t);
                if (dispatchError) setDispatchError(null);
              }}
              editable={!isSubmitting}
            />
            {dispatchError && (
              <Text style={S.fieldErrorMessageLabel}>{dispatchError}</Text>
            )}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <TouchableOpacity
                disabled={isSubmitting}
                style={[S.actionFooterInlineBtn, { backgroundColor: C.bg }]}
                onPress={() => setActivePopup(null)}
              >
                <Text
                  style={[S.modalActionCloseBtnText, { color: C.textPrimary }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  S.actionFooterInlineBtn,
                  { backgroundColor: C.red, flex: 2 },
                ]}
                onPress={handleIncidentSubmit}
                disabled={isSubmitting}
              >
                <Text style={S.modalActionCloseBtnText}>
                  {isSubmitting ? "Routing..." : "Fire Alert Dispatch"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </PopupOverlay>

      {/* Popup E: Threat Level Interceptor Configuration */}
      <PopupOverlay
        visible={activePopup === "threat_mitigation"}
        onClose={() => setActivePopup(null)}
        title="Modify Mitigation Firewall"
      >
        <Text style={[S.contextParagraphText, { marginBottom: 16 }]}>
          Adjust the routing restriction rules applied directly to core ingress
          pathways.
        </Text>
        {(["low", "standard", "high"] as const).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              S.metricStripRow,
              {
                paddingVertical: 12,
                borderBottomWidth: 1,
                backgroundColor:
                  threatLevel === level ? C.indigoLight : "transparent",
                borderRadius: 8,
                paddingHorizontal: 8,
              },
            ]}
            onPress={() => {
              setThreatLevel(level);
              setTimeout(() => setActivePopup(null), 300);
            }}
          >
            <Text
              style={[
                S.metricStripLabel,
                {
                  color: threatLevel === level ? C.indigo : C.textPrimary,
                  fontWeight: threatLevel === level ? "700" : "500",
                },
              ]}
            >
              {level.toUpperCase()} PROTOCOLS
            </Text>
            {threatLevel === level && (
              <CheckCircle size={16} color={C.indigo} />
            )}
          </TouchableOpacity>
        ))}
      </PopupOverlay>

      {/* Popup F: Token Key Life Cycles */}
      <PopupOverlay
        visible={activePopup === "token_rotation"}
        onClose={() => rotationState !== "cycling" && setActivePopup(null)}
        title="Bearer Security State"
      >
        <Text style={S.contextParagraphText}>
          Terminating or cycling validation footprints clears active credentials
          immediately.
        </Text>
        {rotationState === "cycling" && (
          <View
            style={[
              S.toastMessageSuccessCard,
              {
                backgroundColor: C.amberLight,
                borderColor: C.amber,
                marginTop: 12,
              },
            ]}
          >
            <Text style={[S.toastMessageSuccessText, { color: "#92400e" }]}>
              Flushing tags...
            </Text>
          </View>
        )}
        {rotationState === "done" && (
          <View style={[S.toastMessageSuccessCard, { marginTop: 12 }]}>
            <Text style={S.toastMessageSuccessText}>
              Security tokens modified.
            </Text>
          </View>
        )}
        {rotationState === "idle" && (
          <TouchableOpacity
            style={[
              S.modalActionCloseBtn,
              {
                backgroundColor: tokenRevoked ? C.indigo : C.red,
                marginTop: 16,
              },
            ]}
            onPress={runTokenLifecycleUpdate}
          >
            <Text style={S.modalActionCloseBtnText}>
              {tokenRevoked
                ? "Re-authorize Session Profile"
                : "Revoke Session Token Now"}
            </Text>
          </TouchableOpacity>
        )}
      </PopupOverlay>

      {/* Popup G: Global System Bypass Overrides */}
      <PopupOverlay
        visible={activePopup === "system_override"}
        onClose={() => !isProcessingOverride && setActivePopup(null)}
        title="System Protocol Intercept"
      >
        <Text style={S.contextParagraphText}>
          Forcing absolute software environment overrides halts all validation
          checking pipelines. Execute only during critical structural system
          disconnects.
        </Text>
        {isProcessingOverride ? (
          <View
            style={[
              S.toastMessageSuccessCard,
              {
                backgroundColor: C.amberLight,
                borderColor: C.amber,
                marginTop: 16,
              },
            ]}
          >
            <Text style={[S.toastMessageSuccessText, { color: "#92400e" }]}>
              Overriding target modules...
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              S.modalActionCloseBtn,
              {
                backgroundColor: systemOverrideActive ? C.green : C.red,
                marginTop: 16,
              },
            ]}
            onPress={handleOverrideToggle}
          >
            <Text style={S.modalActionCloseBtnText}>
              {systemOverrideActive
                ? "Restore Standard Protocols"
                : "Engage Core Override Bypasses"}
            </Text>
          </TouchableOpacity>
        )}
      </PopupOverlay>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbececb5" },
  content: { flexGrow: 1, padding: isWide ? 24 : 16, paddingBottom: 40 },
  mainInnerWrapper: { flex: 1, width: "100%" },
  sectionLabelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 26,
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
  metricsDataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 4,
  },
  metricBlockCard: {
    flex: 1,
    minWidth: isWide ? 260 : 160,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  metricBlockTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  metricBlockTitle: { fontSize: 11, fontWeight: "600", color: C.textSec },
  metricBlockValue: { fontSize: 20, fontWeight: "800", color: C.textPrimary },
  metricBlockStatus: {
    fontSize: 10,
    color: C.textTer,
    marginTop: 4,
    fontWeight: "500",
  },
  actionMatrixGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionGridCard: {
    flex: 1,
    minWidth: isWide ? 260 : 145,
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  actionCardLabel: { fontSize: 14, fontWeight: "700", color: C.textPrimary },
  actionCardSubtext: {
    fontSize: 11,
    color: C.textSec,
    marginTop: 4,
    lineHeight: 15,
  },
  listContainer: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    marginTop: 4,
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: C.white,
  },
  listItemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  listItemText: { fontSize: 13, fontWeight: "600", color: C.textPrimary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeActive: { backgroundColor: C.greenLight },
  statusBadgeRevoked: { backgroundColor: C.redLight },
  statusBadgeText: { fontSize: 11, fontWeight: "700" },
  statusBadgeTextActive: { color: "#065f46" },
  statusBadgeTextRevoked: { color: "#991b1b" },
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
  backdropDismissArea: { flex: 1 },
  heroMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: isWide ? 26 : 22,
    fontWeight: "800",
    color: "#5C2E14",
  },
  heroSubtitle: {
    color: "#5C2E14",
    fontSize: isWide ? 13 : 12,
    marginTop: 6,
    lineHeight: 17,
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
  popupTitleText: { fontSize: 14, fontWeight: "800", color: C.textPrimary },
  popupCloseCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  popupInnerBody: { paddingTop: 4 },
  modalContextAlign: { alignItems: "center", paddingVertical: 4 },
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
    marginTop: 10,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  modalInputInvalid: { borderColor: C.red, backgroundColor: "#fff5f5" },
  fieldErrorMessageLabel: {
    color: C.red,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    marginLeft: 2,
  },
  toastMessageSuccessCard: {
    backgroundColor: C.greenLight,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderColor: C.green,
    alignItems: "center",
  },
  toastMessageSuccessText: {
    color: "#065f46",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  modalActionCloseBtn: {
    width: "100%",
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  actionFooterInlineBtn: {
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalActionCloseBtnText: { color: C.white, fontSize: 12, fontWeight: "700" },
  metricStripRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  metricStripLabel: { fontSize: 12, fontWeight: "600", color: C.textSec },
  metricStripValue: { fontSize: 12, fontWeight: "700", color: C.textPrimary },
});
