import {
  Archive,
  Calendar,
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
  indigo: "#fa0606",
  indigoLight: "#eeeeee",
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
  }, []);

  return (
    <Animated.View
      style={[{ opacity: op, transform: [{ translateY: sl }] }, style]}
    >
      {children}
    </Animated.View>
  );
};

// Alert Configuration Color Mapping Matrix
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
    id: "INV-7822",
    name: "Microfiber Spin Mop Heads",
    category: "Mops",
    stockLevel: 8,
    unit: "Units",
    minThreshold: 10,
    alertType: "Low Stock",
    vendorName: "Tex-Clean Manufacturing",
    vendorContact: "sales@texclean.com",
  },
  {
    id: "INV-9023",
    name: "Heavy-Duty Nitrile Gloves (Box of 100)",
    category: "Gloves",
    stockLevel: 120,
    unit: "Boxes",
    minThreshold: 30,
    alertType: "Optimal",
    vendorName: "SafeHand Protections",
    vendorContact: "support@safehand.com",
  },
  {
    id: "INV-1140",
    name: "Heavy Duty Commercial Floor Buffer",
    category: "Cleaning Equipment",
    stockLevel: 3,
    unit: "Units",
    minThreshold: 2,
    alertType: "Optimal",
    vendorName: "Titan Machinery Corp",
    vendorContact: "service@titanmach.com",
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

  const handleCreateSupplyRequest = () => {
    if (!reqItemName || !reqQty) return;

    // Simulate auto-injecting requested items as low stock pending allocations
    const newItem: InventoryItem = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${reqItemName} (Requested Order)`,
      category: reqCategory,
      stockLevel: 0,
      unit: "Units",
      minThreshold: parseInt(reqQty, 10),
      alertType: "Reorder Alert",
      vendorName: "Pending Assignment",
      vendorContact: "N/A",
    };

    setItems([newItem, ...items]);
    setRequestModalVisible(false);
    setReqItemName("");
    setReqQty("");
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
        {/* ─── Hero Data Matrix Banner ─── */}
        <FadeInUp delay={0}>
          <View style={S.heroMeta}>
            <View>
              <Text style={S.heroTitle}>Stock & Supplies Hub</Text>
              <Text style={S.heroSubtitle}>
                Monitor material consumables usage thresholds, track logistics
                vendors, and reorder assets.
              </Text>
            </View>
            <TouchableOpacity
              style={S.requestBtn}
              activeOpacity={0.85}
              onPress={() => setRequestModalVisible(true)}
            >
              <ShoppingCart size={14} color={C.dark} strokeWidth={2.5} />
              <Text style={S.requestBtnText}>Supply Request</Text>
            </TouchableOpacity>
          </View>
        </FadeInUp>

        {/* ─── Search & Controls Ribbon ─── */}
        <FadeInUp delay={100}>
          <View style={S.toolbarRow}>
            <View style={S.searchBarContainer}>
              <Search size={16} color={C.textTer} style={S.searchIcon} />
              <TextInput
                placeholder="Search inventory, categories, vendor listings..."
                placeholderTextColor={C.textTer}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[S.searchInputField, { outline: "none" }]}
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

          {/* Quick Segment Category Horizontal Carousel Selection */}
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

        {/* ─── ASSET DATA DISPATCH SWAPPER ENGINE ─── */}
        {viewMode === "card" ? (
          /* Card Visualization Dynamic Layout Matrix Grid */
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

                    {/* Stock Volume Visual Level Bars */}
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

                    {/* Vendor and Expiry Footers */}
                    <View style={S.cardFooterParameters}>
                      <View style={S.footerParamBlock}>
                        <Truck size={12} color={C.textSec} />
                        <Text style={S.footerParamText} numberOfLines={1}>
                          {item.vendorName}
                        </Text>
                      </View>

                      {item.expiryDate && (
                        <View
                          style={[S.footerParamBlock, { marginLeft: "auto" }]}
                        >
                          <Calendar size={12} color={C.textTer} />
                          <Text
                            style={[
                              S.footerParamText,
                              item.alertType === "Expiry Alert" && {
                                color: C.indigo,
                                fontWeight: "700",
                              },
                            ]}
                          >
                            Exp: {item.expiryDate}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </FadeInUp>
              );
            })}
          </View>
        ) : (
          /* Corporate Stock Audit Ledger Table Matrix Display Layout */
          <FadeInUp delay={120}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={S.tableOuterScroll}
            >
              <View style={S.tableContainerBlock}>
                <View style={S.tableHeaderRow}>
                  <Text style={[S.tableHeadCell, { width: 90 }]}>SKU ID</Text>
                  <Text style={[S.tableHeadCell, { width: 300 }]}>
                    Consumable Item
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 200 }]}>
                    Category
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 150 }]}>
                    Stock Volume
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 150 }]}>
                    Alert Status
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 150 }]}>
                    Logistics Vendor
                  </Text>
                  <Text style={[S.tableHeadCell, { width: 150 }]}>
                    Vendor Contact
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
                          { width: 300, fontWeight: "600" },
                        ]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          S.tableCellText,
                          { width: 200, fontWeight: "600" },
                        ]}
                        numberOfLines={1}
                      >
                        {item.category}
                      </Text>
                      <Text style={[S.tableCellText, { width: 150 }]}>
                        {item.stockLevel} {item.unit}
                      </Text>
                      <View style={{ width: 150, justifyContent: "center" }}>
                        <View
                          style={[
                            S.alertBadge,
                            {
                              backgroundColor: alertCfg.bg,
                              alignSelf: "flex-start",
                              paddingVertical: 1,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              S.alertBadgeText,
                              { color: alertCfg.color, fontSize: 13 },
                            ]}
                          >
                            {alertCfg.label}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[S.tableCellText, { width: 150 }]}
                        numberOfLines={1}
                      >
                        {item.vendorName}
                      </Text>
                      <Text
                        style={[
                          S.tableCellText,
                          { width: 150, color: C.textSec },
                        ]}
                        numberOfLines={1}
                      >
                        {item.vendorContact}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </FadeInUp>
        )}

        {/* Empty Inventory Filter Fallback */}
        {filteredItems.length === 0 && (
          <View style={S.emptyBoxContainer}>
            <Archive size={32} color={C.textTer} />
            <Text style={S.emptyTitleText}>No Supply SKUs Listed</Text>
          </View>
        )}
      </ScrollView>

      {/* ─── SUPPLY PROCUREMENT MODAL REQUEST CONTROLLER ─── */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={requestModalVisible}
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <View style={S.modalOverlayFrame}>
          <View style={S.modalContentSheet}>
            <View style={S.modalFormHeaderRow}>
              <Text style={S.modalTitleString}>Raise Supply Order Request</Text>
              <TouchableOpacity
                onPress={() => setRequestModalVisible(false)}
                style={S.modalCloseCircle}
              >
                <X size={16} color={C.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={S.modalFormScrollFrame}
              showsVerticalScrollIndicator={false}
            >
              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>Supply Item Name</Text>
                <TextInput
                  placeholder="e.g., Nitrile Gloves Powder Free"
                  placeholderTextColor={C.textTer}
                  value={reqItemName}
                  onChangeText={setReqItemName}
                  style={S.formInputField}
                />
              </View>

              <View style={S.formGroup}>
                <Text style={S.formFieldLabel}>
                  Required Replenishment Volume Qty
                </Text>
                <TextInput
                  placeholder="e.g., 25"
                  placeholderTextColor={C.textTer}
                  keyboardType="numeric"
                  value={reqQty}
                  onChangeText={setReqQty}
                  style={S.formInputField}
                />
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
                      key={cat}
                      style={[
                        S.selectorPillItem,
                        reqCategory === cat && {
                          backgroundColor: C.indigo,
                          borderColor: C.indigo,
                        },
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
                style={S.modalSubmitActionButton}
                activeOpacity={0.85}
                onPress={handleCreateSupplyRequest}
              >
                <Text style={S.modalSubmitButtonText}>
                  Submit Procurement Request
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Layout Functional System Stylesheet
const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbececb5" },
  content: { padding: isWide ? 24 : 16, paddingBottom: 40 },
  heroContainer: {
    padding: isWide ? 26 : 20,
    borderRadius: 24,
    marginBottom: 20,
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
  requestBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 4,
  },
  requestBtnText: { color: C.dark, fontSize: 13, fontWeight: "700" },
  metricsStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    flexWrap: "wrap",
    gap: 12,
  },
  metricBlock: { alignItems: "center" },
  metricNumber: { fontSize: 18, fontWeight: "800", color: C.white },
  metricLabel: { fontSize: 13, color: C.textTer, marginTop: 1 },
  stripDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
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
    height: 42,
  },
  searchIcon: { marginRight: 6 },
  searchInputField: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 12,
    fontWeight: "500",
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: C.border,
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  toggleBtn: { padding: 6, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: C.dark2 },
  filterRibbon: {
    flexDirection: "row",
    gap: 6,
    paddingBottom: 4,
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: C.white,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterPillActive: { backgroundColor: C.indigo, borderColor: C.indigo },
  filterPillText: { fontSize: 13, fontWeight: "600", color: C.textSec },
  filterPillTextActive: { color: C.white },
  ledgerGridContainer: { gap: 12 },
  itemCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
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
  alertBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
  alertBadgeText: { fontSize: 12, fontWeight: "700" },
  itemMainTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 12,
  },
  volumeProgressFrame: { marginBottom: 12 },
  volumeDataLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  volumeCountText: { fontSize: 11, color: C.textSec },
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
  footerParamText: { fontSize: 11, color: C.textSec, fontWeight: "500" },
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
    paddingBottom: 15,
    marginBottom: 4,
  },
  tableHeadCell: { fontSize: 12, fontWeight: "700", color: C.textSec },
  tableBodyRow: {
    flexDirection: "row",
    paddingVertical: 15,
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
  emptyBoxContainer: { alignItems: "center", padding: 36 },
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

    padding: 20,
    maxHeight: "85%",
    width: isWide ? 500 : "90%",
  },
  modalFormHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitleString: { fontSize: 16, fontWeight: "800", color: C.textPrimary },
  modalCloseCircle: { backgroundColor: C.bg, padding: 6, borderRadius: 100 },
  modalFormScrollFrame: { marginBottom: 10 },
  formGroup: { marginBottom: 14 },
  formFieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 6,
  },
  formInputField: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 13,
    color: C.textPrimary,
  },
  inlineSelectorRibbon: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  selectorPillItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  selectorPillText: { fontSize: 12, fontWeight: "700", color: C.textSec },
  modalSubmitActionButton: {
    backgroundColor: "#ef4444",
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  modalSubmitButtonText: { color: C.white, fontSize: 13, fontWeight: "700" },
});
