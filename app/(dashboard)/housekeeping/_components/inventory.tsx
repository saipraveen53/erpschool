import {
  LayoutGrid,
  Package,
  Search,
  ShoppingCart,
  Table,
  Truck,
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
  indigoLight: "#e0e7ff",
  green: "#10b981",
  greenLight: "#d1fae5",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  red: "#ef4444",
  redLight: "#fee2e2",
  sky: "#0ea5e9",
  border: "#f1f5f9",
};

interface InventoryItem {
  id: string;
  name: string;
  category:
    | "Cleaning Liquids"
    | "Disinfectants"
    | "Mops"
    | "Brooms"
    | "Gloves"
    | "Dustbins"
    | "Cleaning Equipment";
  stockLevel: number;
  unit: string;
  minThreshold: number;
  alertType: "Optimal" | "Low Stock" | "Reorder Alert" | "Expiry Alert";
  vendorName: string;
  vendorContact: string;
  expiryDate?: string;
}

const FadeInUp = ({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) => {
  const op = useRef(new Animated.Value(0)).current;
  const sl = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(op, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sl, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, op, sl]);

  return (
    <Animated.View
      style={[{ opacity: op, transform: [{ translateY: sl }] }, style]}
    >
      {children}
    </Animated.View>
  );
};

const ALERT_MAP: Record<
  InventoryItem["alertType"],
  { label: string; color: string; bg: string }
> = {
  Optimal: { label: "In Stock", color: C.green, bg: C.greenLight },
  "Low Stock": { label: "Low Stock", color: C.amber, bg: C.amberLight },
  "Reorder Alert": { label: "Reorder Critical", color: C.red, bg: C.redLight },
  "Expiry Alert": {
    label: "Expiring Soon",
    color: C.indigo,
    bg: C.indigoLight,
  },
};

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "INV-4011",
    name: "Industrial Floor Cleaner Concentrate",
    category: "Cleaning Liquids",
    stockLevel: 14,
    unit: "Liters",
    minThreshold: 20,
    alertType: "Reorder Alert",
    vendorName: "Apex Chemical Labs",
    vendorContact: "supply@apexchem.com",
    expiryDate: "2027-04-12",
  },
  {
    id: "INV-2984",
    name: "Hospital-Grade Surface Disinfectant",
    category: "Disinfectants",
    stockLevel: 45,
    unit: "Bottles",
    minThreshold: 15,
    alertType: "Expiry Alert",
    vendorName: "BioShield Pharma",
    vendorContact: "orders@bioshield.org",
    expiryDate: "2026-07-15",
  },
  {
    id: "INV-2984",
    name: "Hospital-Grade Surface Disinfectant",
    category: "Disinfectants",
    stockLevel: 30,
    unit: "Bottles",
    minThreshold: 15,
    alertType: "Expiry Alert",
    vendorName: "BioShield Pharma",
    vendorContact: "orders@bioshield.org",
    expiryDate: "2026-07-15",
  },
  {
    id: "INV-2984",
    name: "Hospital-Grade Surface Disinfectant",
    category: "Disinfectants",
    stockLevel: 45,
    unit: "Bottles",
    minThreshold: 15,
    alertType: "Expiry Alert",
    vendorName: "BioShield Pharma",
    vendorContact: "orders@bioshield.org",
    expiryDate: "2026-07-15",
  },
];

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [requestModalVisible, setRequestModalVisible] = useState(false);

  // Supply Request Form States
  const [reqItemName, setReqItemName] = useState("");
  const [reqQty, setReqQty] = useState("");
  const [reqCategory, setReqCategory] =
    useState<InventoryItem["category"]>("Cleaning Liquids");

  // Validation, Error & Success Feedback States
  const [errors, setErrors] = useState<{ itemName?: string; qty?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear states when modal resets
  const resetForm = () => {
    setReqItemName("");
    setReqQty("");
    setReqCategory("Cleaning Liquids");
    setErrors({});
  };

  const handleCreateSupplyRequest = () => {
    const newErrors: { itemName?: string; qty?: string } = {};

    // 1. Validate Item Name
    if (!reqItemName.trim()) {
      newErrors.itemName = "Item name is required.";
    } else if (reqItemName.trim().length < 3) {
      newErrors.itemName = "Name must be at least 3 characters.";
    }

    // 2. Validate Replenishment Volume Quantity
    const parsedQty = parseInt(reqQty, 10);
    if (!reqQty) {
      newErrors.qty = "Quantity volume is required.";
    } else if (isNaN(parsedQty) || parsedQty <= 0) {
      newErrors.qty = "Quantity must be a valid number greater than 0.";
    }

    // Check errors map
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous validations if success scenario met
    setErrors({});

    const newItem: InventoryItem = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${reqItemName.trim()} (Requested Order)`,
      category: reqCategory,
      stockLevel: 0,
      unit: "Units",
      minThreshold: parsedQty,
      alertType: "Reorder Alert",
      vendorName: "Pending Assignment",
      vendorContact: "N/A",
    };

    setItems([newItem, ...items]);

    // Trigger localized volatile success message confirmation banner
    setSuccessMessage(
      `Successfully requested ${parsedQty} units of ${reqItemName.trim()}`,
    );

    // Dismiss configuration flow cleanly
    setTimeout(() => {
      setRequestModalVisible(false);
      setSuccessMessage(null);
      resetForm();
    }, 1800);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={S.screen}>
      <ScrollView
        contentContainerStyle={S.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Segment */}
        <FadeInUp delay={0}>
          <View style={S.heroMeta}>
            <View style={{ flex: 1, minWidth: 260 }}>
              <Text style={S.heroTitle}>Stock & Supplies Hub</Text>
              <Text style={S.heroSubtitle}>
                Monitor material consumables usage thresholds, track logistics
                vendors, and reorder assets.
              </Text>
            </View>
            <TouchableOpacity
              style={S.requestBtn}
              activeOpacity={0.85}
              onPress={() => {
                resetForm();
                setRequestModalVisible(true);
              }}
            >
              <ShoppingCart size={14} color={C.dark} strokeWidth={2.5} />
              <Text style={S.requestBtnText}>Supply Request</Text>
            </TouchableOpacity>
          </View>
        </FadeInUp>

        {/* Search Ribbon */}
        <FadeInUp delay={100}>
          <View style={S.toolbarRow}>
            <View style={S.searchBarContainer}>
              <Search size={16} color={C.textTer} style={S.searchIcon} />
              <TextInput
                placeholder="Search inventory, categories, vendor listings..."
                placeholderTextColor={C.textTer}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={S.searchInputField}
              />
            </View>

            <View style={S.toggleWrapper}>
              <TouchableOpacity
                style={[S.toggleBtn, viewMode === "card" && S.toggleBtnActive]}
                onPress={() => setViewMode("card")}
              >
                <LayoutGrid
                  size={16}
                  color={viewMode === "card" ? C.white : C.textSec}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[S.toggleBtn, viewMode === "table" && S.toggleBtnActive]}
                onPress={() => setViewMode("table")}
              >
                <Table
                  size={16}
                  color={viewMode === "table" ? C.white : C.textSec}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Filter Selection */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={S.filterRibbon}
          >
            {[
              "All",
              "Cleaning Liquids",
              "Disinfectants",
              "Mops",
              "Gloves",
              "Cleaning Equipment",
            ].map((cat) => {
              const isSelected = categoryFilter === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategoryFilter(cat)}
                  style={[S.filterPill, isSelected && S.filterPillActive]}
                >
                  <Text
                    style={[
                      S.filterPillText,
                      isSelected && S.filterPillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeInUp>

        {/* Main Render Output View Engines */}
        {viewMode === "card" ? (
          <View style={S.ledgerGridContainer}>
            {filteredItems.map((item, index) => {
              const alertCfg = ALERT_MAP[item.alertType];
              const isCritical =
                item.alertType === "Reorder Alert" ||
                item.alertType === "Low Stock";

              return (
                <FadeInUp key={item.id} delay={120 + index * 40}>
                  <View
                    style={[
                      S.itemCard,
                      isCritical && { borderColor: alertCfg.color + "30" },
                    ]}
                  >
                    <View style={S.cardTopLine}>
                      <View style={S.titleCluster}>
                        <Package size={16} color={C.textSec} />
                        <Text style={S.skuString}>{item.id}</Text>
                        <Text style={S.bulletDot}>•</Text>
                        <Text style={S.categoryLabelString}>
                          {item.category}
                        </Text>
                      </View>
                      <View
                        style={[S.alertBadge, { backgroundColor: alertCfg.bg }]}
                      >
                        <Text
                          style={[S.alertBadgeText, { color: alertCfg.color }]}
                        >
                          {alertCfg.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={S.itemMainTitle}>{item.name}</Text>
                    <View style={S.volumeProgressFrame}>
                      <View style={S.volumeDataLabels}>
                        <Text style={S.volumeCountText}>
                          Current Stock:{" "}
                          <Text
                            style={{ fontWeight: "800", color: C.textPrimary }}
                          >
                            {item.stockLevel} {item.unit}
                          </Text>
                        </Text>
                        <Text style={S.volumeMinText}>
                          Min Limit: {item.minThreshold}
                        </Text>
                      </View>
                      <View style={S.progressBarTrack}>
                        <View
                          style={[
                            S.progressBarFill,
                            {
                              backgroundColor: alertCfg.color,
                              width: `${Math.min((item.stockLevel / (item.minThreshold * 2)) * 100, 100)}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={S.cardDividerLine} />
                    <View style={S.cardFooterParameters}>
                      <View style={S.footerParamBlock}>
                        <Truck size={12} color={C.textSec} />
                        <Text style={S.footerParamText} numberOfLines={1}>
                          {item.vendorName}
                        </Text>
                      </View>
                    </View>
                  </View>
                </FadeInUp>
              );
            })}
          </View>
        ) : (
          <FadeInUp delay={120}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={S.tableOuterScroll}
            >
              <View style={S.tableContainerBlock}>
                <View style={S.tableHeaderRow}>
                  <Text style={[S.tableHeadCell, { width: 90 }]}>SKU ID</Text>
                  <Text style={[S.tableHeadCell, { width: 280 }]}>
                    Consumable Item
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 160 }]}>
                    Category
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 120 }]}>
                    Stock Volume
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 140 }]}>
                    Alert Status
                  </Text>
                </View>
                {filteredItems.map((item, index) => {
                  const alertCfg = ALERT_MAP[item.alertType];
                  return (
                    <View
                      key={item.id}
                      style={[
                        S.tableBodyRow,
                        index % 2 === 1 && { backgroundColor: C.bg },
                      ]}
                    >
                      <Text
                        style={[
                          S.tableCellText,
                          { width: 90, fontWeight: "700" },
                        ]}
                      >
                        {item.id}
                      </Text>
                      <Text
                        style={[
                          S.tableCellText,
                          { width: 280, fontWeight: "600" },
                        ]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text style={[S.tableCellText, { width: 160 }]}>
                        {item.category}
                      </Text>
                      <Text style={[S.tableCellText, { width: 120 }]}>
                        {item.stockLevel} {item.unit}
                      </Text>
                      <View style={{ width: 140, justifyContent: "center" }}>
                        <View
                          style={[
                            S.alertBadge,
                            {
                              backgroundColor: alertCfg.bg,
                              alignSelf: "flex-start",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              S.alertBadgeText,
                              { color: alertCfg.color, fontSize: 11 },
                            ]}
                          >
                            {alertCfg.label}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </FadeInUp>
        )}
      </ScrollView>

      {/* Procurement Modal Sheet */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={requestModalVisible}
        onRequestClose={() => {
          if (!successMessage) setRequestModalVisible(false);
        }}
      >
        <View style={S.modalOverlayFrame}>
          <View style={S.modalContentSheet}>
            <View style={S.modalFormHeaderRow}>
              <Text style={S.modalTitleString}>Raise Supply Order Request</Text>
              <TouchableOpacity
                disabled={!!successMessage}
                onPress={() => setRequestModalVisible(false)}
                style={[S.modalCloseCircle, successMessage && { opacity: 0.5 }]}
              >
                <X size={16} color={C.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={S.modalFormScrollFrame}
              showsVerticalScrollIndicator={false}
            >
              {/* Global Success Dynamic Message Card */}
              {successMessage && (
                <View style={S.successBannerContainer}>
                  <Text style={S.successBannerText}>{successMessage}</Text>
                </View>
              )}

              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>Supply Item Name</Text>
                <TextInput
                  editable={!successMessage}
                  placeholder="e.g., Nitrile Gloves Powder Free"
                  placeholderTextColor={C.textTer}
                  value={reqItemName}
                  onChangeText={(val) => {
                    setReqItemName(val);
                    if (errors.itemName)
                      setErrors((prev) => ({ ...prev, itemName: undefined }));
                  }}
                  style={[
                    S.formInputField,
                    errors.itemName && S.formInputFieldInvalid,
                  ]}
                />
                {errors.itemName && (
                  <Text style={S.formFieldErrorLabel}>{errors.itemName}</Text>
                )}
              </View>

              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>
                  Required Replenishment Volume Qty
                </Text>
                <TextInput
                  editable={!successMessage}
                  placeholder="e.g., 25"
                  placeholderTextColor={C.textTer}
                  keyboardType="numeric"
                  value={reqQty}
                  onChangeText={(val) => {
                    setReqQty(val);
                    if (errors.qty)
                      setErrors((prev) => ({ ...prev, qty: undefined }));
                  }}
                  style={[
                    S.formInputField,
                    errors.qty && S.formInputFieldInvalid,
                  ]}
                />
                {errors.qty && (
                  <Text style={S.formFieldErrorLabel}>{errors.qty}</Text>
                )}
              </View>

              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>
                  Inventory Material Category
                </Text>
                <View style={S.inlineSelectorRibbon}>
                  {[
                    "Cleaning Liquids",
                    "Disinfectants",
                    "Mops",
                    "Gloves",
                    "Dustbins",
                  ].map((cat) => (
                    <TouchableOpacity
                      disabled={!!successMessage}
                      key={cat}
                      style={[
                        S.selectorPillItem,
                        reqCategory === cat && S.selectorPillItemActive,
                        successMessage && { opacity: 0.6 },
                      ]}
                      onPress={() => setReqCategory(cat as any)}
                    >
                      <Text
                        style={[
                          S.selectorPillText,
                          reqCategory === cat && { color: C.white },
                        ]}
                      >
                        {cat.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                disabled={!!successMessage}
                style={[
                  S.modalSubmitActionButton,
                  successMessage && { backgroundColor: C.green },
                ]}
                activeOpacity={0.85}
                onPress={handleCreateSupplyRequest}
              >
                <Text style={S.modalSubmitButtonText}>
                  {successMessage
                    ? "Processing Request..."
                    : "Submit Procurement Request"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbececb5" },
  content: { padding: isWide ? 24 : 16, paddingBottom: 40 },
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
    opacity: 0.9,
  },
  requestBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  requestBtnText: { color: C.dark, fontSize: 13, fontWeight: "700" },
  toolbarRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 6 },
  searchInputField: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: "500",
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: C.border,
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  toggleBtn: { padding: 8, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: C.dark2 },
  filterRibbon: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: C.white,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterPillActive: { backgroundColor: C.dark2, borderColor: C.dark2 },
  filterPillText: { fontSize: 13, fontWeight: "600", color: C.textSec },
  filterPillTextActive: { color: C.white },
  ledgerGridContainer: { gap: 12 },
  itemCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },
  cardTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleCluster: { flexDirection: "row", alignItems: "center" },
  skuString: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textPrimary,
    marginLeft: 4,
  },
  bulletDot: { color: C.textTer, marginHorizontal: 4 },
  categoryLabelString: { fontSize: 11, fontWeight: "600", color: C.textSec },
  alertBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
  alertBadgeText: { fontSize: 11, fontWeight: "700" },
  itemMainTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 12,
  },
  volumeProgressFrame: { marginBottom: 12 },
  volumeDataLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  volumeCountText: { fontSize: 12, color: C.textSec },
  volumeMinText: { fontSize: 11, color: C.textTer },
  progressBarTrack: {
    height: 6,
    backgroundColor: C.bg,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 10 },
  cardDividerLine: { height: 1, backgroundColor: C.border, marginVertical: 10 },
  cardFooterParameters: { flexDirection: "row", alignItems: "center" },
  footerParamBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: "60%",
  },
  footerParamText: { fontSize: 12, color: C.textSec, fontWeight: "500" },
  tableOuterScroll: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  tableContainerBlock: { padding: 15 },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 12,
    marginBottom: 4,
  },
  tableHeadCell: { fontSize: 12, fontWeight: "700", color: C.textSec },
  tableBodyRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border + "50",
  },
  tableCellText: {
    fontSize: 13,
    fontWeight: "500",
    color: C.textPrimary,
    paddingRight: 6,
  },
  emptyBoxContainer: { alignItems: "center", padding: 40 },
  emptyTitleText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textSec,
    marginTop: 8,
  },
  modalOverlayFrame: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentSheet: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 24,
    maxHeight: "85%",
    width: isWide ? 500 : "90%",
  },
  modalFormHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitleString: { fontSize: 16, fontWeight: "800", color: C.textPrimary },
  modalCloseCircle: { backgroundColor: C.bg, padding: 6, borderRadius: 100 },
  modalFormScrollFrame: { marginBottom: 10 },
  formGroup: { marginBottom: 16 },
  formFieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 6,
  },

  // Validation Injection Elements
  formInputField: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 13,
    color: C.textPrimary,
  },
  formInputFieldInvalid: { borderColor: C.red, backgroundColor: "#fff5f5" },
  formFieldErrorLabel: {
    color: C.red,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
    marginLeft: 4,
  },
  successBannerContainer: {
    backgroundColor: C.greenLight,
    borderLeftWidth: 4,
    borderColor: C.green,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successBannerText: { color: "#065f46", fontSize: 12, fontWeight: "700" },

  inlineSelectorRibbon: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  selectorPillItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  selectorPillItemActive: { backgroundColor: C.dark2, borderColor: C.dark2 },
  selectorPillText: { fontSize: 11, fontWeight: "700", color: C.textSec },
  modalSubmitActionButton: {
    backgroundColor: C.red,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  modalSubmitButtonText: { color: C.white, fontSize: 14, fontWeight: "700" },
});
