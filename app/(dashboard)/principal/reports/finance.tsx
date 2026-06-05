import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput,
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Modal,
  Alert,
  useWindowDimensions,
  Platform
} from 'react-native';
import * as Icons from 'lucide-react-native';

// Heavy Ledger-Specific Static Data
const financialLedgerData = [
  { id: 'TXN-901', title: 'Quarter 1 Tuition Fee Collection', category: 'Revenue', amount: '₹14.20L', date: '28 May 2026', method: 'Online Gateways', clearance: 'Settled', volume: '480 Clearances' },
  { id: 'TXN-902', title: 'Campus STEM Lab Infrastructure Upgrade', category: 'Expense', amount: '₹3.50L', date: '26 May 2026', method: 'Bank Transfer', clearance: 'Approved', volume: 'Capital Outlay' },
  { id: 'TXN-903', title: 'Quarterly Staff Gratuity & Salary Dispatch', category: 'Expense', amount: '₹8.40L', date: '25 May 2026', method: 'Automated ACH', clearance: 'Settled', volume: '54 Disbursements' },
  { id: 'TXN-904', title: 'Transport Core Maintenance & Fuel Subsidy', category: 'Expense', amount: '₹1.15L', date: '24 May 2026', method: 'Corporate Card', clearance: 'Audited', volume: 'Operational' },
  { id: 'TXN-905', title: 'Annual Sports Kit Equipment Procurement', category: 'Expense', amount: '₹95,000', date: '20 May 2026', method: 'Vendor Draft', clearance: 'Pending Review', volume: 'Athletics' },
  { id: 'TXN-906', title: 'Alumni Trust Cultural Sponsorship Grant', category: 'Revenue', amount: '₹2.10L', date: '18 May 2026', method: 'Direct Wire', clearance: 'Settled', volume: 'Endowment' },
];

export default function FinanceReports() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // High-fidelity details sheet modal states
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isLargeScreen = width >= 768;

  // Ledger filter algorithm
  const filteredLedger = financialLedgerData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const openLedgerDetails = (txn) => {
    setSelectedTxn(txn);
    setModalVisible(true);
  };

  const triggerExportSystem = () => {
    Alert.alert("Audit Sync", "Syncing encrypted transaction data blocks with direct ERP auditor cache node.");
  };

  const renderLedgerRowOrCard = ({ item }) => {
    const isRevenue = item.category === 'Revenue';
    
    if (isLargeScreen) {
      // Wide Viewport Desktop Ledger Matrix
      return (
        <View style={styles.ledgerRow}>
          <Text style={styles.ledgerIdText}>{item.id}</Text>
          <View style={styles.ledgerTitleBlock}>
            <Text style={styles.ledgerMainTitle}>{item.title}</Text>
            <Text style={styles.ledgerSubText}>{item.method} • {item.volume}</Text>
          </View>
          <Text style={styles.ledgerDateText}>{item.date}</Text>
          <View style={styles.ledgerStatusBlock}>
            <View style={[styles.clearanceTag, item.clearance === 'Settled' ? styles.tagGreen : styles.tagAmber]}>
              <Text style={item.clearance === 'Settled' ? styles.tagTextGreen : styles.tagTextAmber}>{item.clearance}</Text>
            </View>
          </View>
          <Text style={[styles.ledgerAmountText, { color: isRevenue ? '#16a34a' : '#E35336' }]}>
            {isRevenue ? '+' : '-'} {item.amount}
          </Text>
          <TouchableOpacity style={styles.ledgerInspectBtn} onPress={() => openLedgerDetails(item)}>
            <Icons.Receipt size={14} color="#A0522D" />
          </TouchableOpacity>
        </View>
      );
    }

    // High-Contrast Adaptive Mobile Account Cards Layout
    return (
      <View style={styles.accountMobileCard}>
        <View style={styles.mobileCardHeader}>
          <View style={[styles.categoryIndicatorDot, { backgroundColor: isRevenue ? '#16a34a' : '#E35336' }]} />
          <Text style={styles.mobileCardId}>{item.id}</Text>
          <Text style={styles.mobileCardDate}>{item.date}</Text>
        </View>
        
        <Text style={styles.mobileCardTitle}>{item.title}</Text>
        <Text style={styles.mobileCardMetaText}>Channel Payload: {item.method}</Text>
        
        <View style={styles.mobileCardFooter}>
          <View style={[styles.clearanceTag, item.clearance === 'Settled' ? styles.tagGreen : styles.tagAmber]}>
            <Text style={item.clearance === 'Settled' ? styles.tagTextGreen : styles.tagTextAmber}>{item.clearance}</Text>
          </View>
          <View style={styles.mobileCardRightActionBlock}>
            <Text style={[styles.mobileCardAmount, { color: isRevenue ? '#16a34a' : '#E35336' }]}>
              {isRevenue ? '+' : '-'} {item.amount}
            </Text>
            <TouchableOpacity style={styles.mobileCardInspectBtn} onPress={() => openLedgerDetails(item)}>
              <Icons.ArrowUpRight size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const RenderMainLayoutStructure = () => (
    <View style={{ flex: 1 }}>
      {/* 1. Elite Unified Cashflow Ribbon Segment instead of separate cards */}
      <View style={styles.cashflowRibbonFrame}>
        <View style={styles.ribbonSection}>
          <Text style={styles.ribbonLabel}>Gross Revenue Inflow</Text>
          <Text style={[styles.ribbonValue, { color: '#16a34a' }]}>₹16.30 Lakhs</Text>
        </View>
        <View style={styles.ribbonDividerLine} />
        <View style={styles.ribbonSection}>
          <Text style={styles.ribbonLabel}>Disbursed Expenses Out</Text>
          <Text style={[styles.ribbonValue, { color: '#E35336' }]}>₹14.00 Lakhs</Text>
        </View>
        <View style={styles.ribbonDividerLine} />
        <View style={styles.ribbonSection}>
          <Text style={styles.ribbonLabel}>Net Operational Runway</Text>
          <Text style={[styles.ribbonValue, { color: '#A0522D' }]}>+₹2.30 Lakhs</Text>
        </View>
      </View>

      {/* 2. Tactical Toolbar Search Stack */}
      <View style={styles.toolbarBoxRow}>
        <View style={styles.searchContainerField}>
          <Icons.Search color="#8c7664" size={16} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchBarInputField}
            placeholder="Filter fiscal registers by token ID or transaction name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#bc9e82"
          />
        </View>
        <TouchableOpacity style={styles.syncBtnFrame} onPress={triggerExportSystem}>
          <Icons.RefreshCw size={14} color="#ffffff" />
          <Text style={styles.syncBtnText}>Sync Cache</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Account Filter Tabs Segment */}
      <View style={styles.tabFiltersWrapper}>
        {['All', 'Revenue', 'Expense'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity key={tab} style={[styles.tabFilterChip, isActive && styles.tabFilterChipActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabFilterChipText, isActive && styles.tabFilterChipTextActive]}>
                {tab === 'All' ? 'Master Registry' : `${tab} Stream`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. Desktop Ledger Board Label Headers */}
      {isLargeScreen && (
        <View style={styles.ledgerTableHeaderGrid}>
          <Text style={styles.ledgerHeaderCellToken}>Transaction Token</Text>
          <Text style={styles.ledgerHeaderCellTitle}>Allocation Narrative Summary</Text>
          <Text style={styles.ledgerHeaderCellDate}>Fiscal Date</Text>
          <Text style={styles.ledgerHeaderCellStatus}>Clearance State</Text>
          <Text style={styles.ledgerHeaderCellAmount}>Ledger Delta</Text>
          <Text style={styles.ledgerHeaderCellAction}>Inspect</Text>
        </View>
      )}

      {/* 5. FlatList Data Engine Feed */}
      <FlatList
        data={filteredLedger}
        keyExtractor={(item) => item.id}
        renderItem={renderLedgerRowOrCard}
        scrollEnabled={isLargeScreen}
        contentContainerStyle={styles.listContainerOffsetStyles}
        ListEmptyComponent={
          <View style={styles.fallbackEmptyBox}><Text style={styles.fallbackEmptyText}>No financial records logged inside this criteria branch node.</Text></View>
        }
      />
    </View>
  );

  return (
    <View style={styles.appMasterFinanceFrame}>
      {isLargeScreen ? (
        <View style={styles.container}>
          <View style={styles.headerTitleArea}>
            <Text style={styles.mainTitle}>Fiscal Accounts Ledger & Cashflow Terminal</Text>
            <Text style={styles.mainSubtitle}>Real-time monitoring interface for bank clearing streams, vendor disbursals, and tuition collection accounts.</Text>
          </View>
          <RenderMainLayoutStructure />
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerTitleArea}>
            <Text style={styles.mainTitle}>Fiscal Accounts Ledger</Text>
            <Text style={styles.mainSubtitle}>Real-time tracking of institutional balance flow sheets.</Text>
          </View>
          <RenderMainLayoutStructure />
        </ScrollView>
      )}

      {/* =========================================================
          HIGH-FIDELITY DETAILED FINANCIAL AUDIT RECEIPT MODAL
          ========================================================= */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCardWrapper, { width: isLargeScreen ? 450 : '90%' }]}>
            
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleBlock}>
                <Icons.Receipt color="#A0522D" size={18} />
                <Text style={styles.modalHeaderTitle}>Audit Receipt File</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <Icons.X size={18} color="#A0522D" />
              </TouchableOpacity>
            </View>

            {selectedTxn && (
              <ScrollView contentContainerStyle={styles.modalScrollBody}>
                <View style={styles.modalReceiptStripCard}>
                  <Text style={styles.receiptTokenLabel}>Allocation Target Stream</Text>
                  <Text style={styles.receiptTokenTitle}>{selectedTxn.title}</Text>
                  <Text style={styles.receiptTokenSubId}>System Reference Key ID: {selectedTxn.id}</Text>
                </View>

                <View style={styles.receiptDataStripsGroup}>
                  <View style={styles.receiptStripLine}><Text style={styles.stripLabel}>Roster Segment Allocation</Text><Text style={styles.stripValue}>{selectedTxn.category}</Text></View>
                  <View style={styles.receiptStripLine}><Text style={styles.stripLabel}>Clearance Timestamp</Text><Text style={styles.stripValue}>{selectedTxn.date}</Text></View>
                  <View style={styles.receiptStripLine}><Text style={styles.stripLabel}>Settlement Pathway Channel</Text><Text style={styles.stripValue}>{selectedTxn.method}</Text></View>
                  <View style={styles.receiptStripLine}><Text style={styles.stripLabel}>Volume Log Audit Particulars</Text><Text style={styles.stripValue}>{selectedTxn.volume}</Text></View>
                  <View style={styles.receiptStripLine}><Text style={styles.stripLabel}>Roster Authorization State</Text><Text style={styles.stripValue}>{selectedTxn.clearance}</Text></View>
                </View>

                <View style={styles.receiptLargeTotalBlock}>
                  <Text style={styles.largeTotalLabel}>Net Statement Balance Delta</Text>
                  <Text style={[styles.largeTotalValue, { color: selectedTxn.category === 'Revenue' ? '#16a34a' : '#E35336' }]}>
                    {selectedTxn.category === 'Revenue' ? '+' : '-'} {selectedTxn.amount}
                  </Text>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity style={styles.modalDismissFullBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalDismissFullBtnText}>Close Fiscal Audit Log</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  appMasterFinanceFrame: { flex: 1, backgroundColor: '#F5F5DC' },
  container: { flex: 1, padding: 16 },
  headerTitleArea: { marginBottom: 20 },
  mainTitle: { fontSize: 21, fontWeight: '700', color: '#A0522D' },
  mainSubtitle: { fontSize: 13, color: '#8c7664', marginTop: 4, lineHeight: 18, fontWeight: '500' },

  /* --- EXPERIMENTAL UNIFIED CASHFLOW RIBBON --- */
  cashflowRibbonFrame: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#eaddcc', padding: 16, marginBottom: 20, alignItems: 'center' },
  ribbonSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ribbonLabel: { fontSize: 11, fontWeight: '600', color: '#bc9e82', textTransform: 'uppercase', letterSpacing: 0.3 },
  ribbonValue: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  ribbonDividerLine: { width: 1, height: 32, backgroundColor: '#eaddcc', marginHorizontal: 4 },

  /* --- ACCOUNT TOOLBAR PANELS --- */
  toolbarBoxRow: { flexDirection: 'row', gap: 8, marginBottom: 16, width: '100%' },
  searchContainerField: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, height: 42 },
  searchBarInputField: { flex: 1, fontSize: 13, color: '#2e2520' },
  syncBtnFrame: { backgroundColor: '#A0522D', paddingHorizontal: 14, borderRadius: 8, height: 42, flexDirection: 'row', alignItems: 'center', gap: 6 },
  syncBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  /* --- FISCAL CHIP FILTER SEGMENTS --- */
  tabFiltersWrapper: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  tabFilterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc' },
  tabFilterChipActive: { backgroundColor: '#422414', borderColor: '#422414' }, // Rich Dark Brown highlight selection
  tabFilterChipText: { fontSize: 12, fontWeight: '600', color: '#8c7664' },
  tabFilterChipTextActive: { color: '#ffffff', fontWeight: '700' },

  /* --- DESKTOP STRUCTURE ACCOUNT LEDGER GRID --- */
  ledgerTableHeaderGrid: { flexDirection: 'row', backgroundColor: '#eaddcc', paddingVertical: 12, paddingHorizontal: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderHorizontal: 1, borderColor: '#eaddcc', alignItems: 'center' },
  tableHeaderCell: { fontSize: 12, fontWeight: '700', color: '#A0522D' },
  ledgerHeaderCellToken: { flex: 0.7, fontSize: 12, fontWeight: '700', color: '#A0522D' },
  ledgerHeaderCellTitle: { flex: 2.2, fontSize: 12, fontWeight: '700', color: '#A0522D' },
  ledgerHeaderCellDate: { flex: 0.8, fontSize: 12, fontWeight: '700', color: '#A0522D' },
  ledgerHeaderCellStatus: { flex: 0.8, fontSize: 12, fontWeight: '700', color: '#A0522D' },
  ledgerHeaderCellAmount: { flex: 1, fontSize: 12, fontWeight: '700', color: '#A0522D', textAlign: 'right', paddingRight: 8 },
  ledgerHeaderCellAction: { flex: 0.4, fontSize: 12, fontWeight: '700', color: '#A0522D', textAlign: 'center' },

  ledgerRow: { flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', alignItems: 'center' },
  ledgerIdText: { flex: 0.7, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 12, color: '#bc9e82', fontWeight: '600' },
  ledgerTitleBlock: { flex: 2.2, paddingRight: 8 },
  ledgerMainTitle: { fontSize: 14, fontWeight: '600', color: '#2e2520' },
  ledgerSubText: { fontSize: 12, color: '#8c7664', marginTop: 2, fontWeight: '500' },
  ledgerDateText: { flex: 0.8, fontSize: 13, color: '#4a3e3d', fontWeight: '500' },
  ledgerStatusBlock: { flex: 0.8 },
  ledgerAmountText: { flex: 1, fontSize: 15, fontWeight: '700', textAlign: 'right', paddingRight: 8 },
  ledgerInspectBtn: { flex: 0.4, padding: 6, borderRadius: 6, backgroundColor: '#faf6f0', borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center' },

  /* --- COMPACT ADAPTIVE MOBILE ACCOUNT LEDGERS --- */
  listContainerOffsetStyles: { paddingBottom: 24 },
  accountMobileCard: { backgroundColor: '#ffffff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eaddcc' },
  mobileCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  categoryIndicatorDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  mobileCardId: { fontSize: 11, fontFamily: 'monospace', color: '#bc9e82', fontWeight: '600', flex: 1 },
  mobileCardDate: { fontSize: 12, color: '#8c7664', fontWeight: '500' },
  mobileCardTitle: { fontSize: 14, fontWeight: '600', color: '#2e2520', marginBottom: 4 },
  mobileCardMetaText: { fontSize: 12, color: '#8c7664', fontWeight: '500', marginBottom: 10 },
  mobileCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f5ebe0' },
  mobileCardRightActionBlock: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mobileCardAmount: { fontSize: 14, fontWeight: '700' },
  mobileCardInspectBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E35336', alignItems: 'center', justifyContent: 'center' },

  /* --- FISCAL CHIP BADGES --- */
  clearanceTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start' },
  tagGreen: { backgroundColor: '#e8f5e9' }, tagTextGreen: { color: '#2e7d32', fontSize: 11, fontWeight: '700' },
  tagAmber: { backgroundColor: '#fff2e6' }, tagTextAmber: { color: '#b45309', fontSize: 11, fontWeight: '700' },

  /* --- HIGH-FIDELITY RECEIPTS OVERLAY SYSTEM --- */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(42, 21, 7, 0.45)', justifyContent: 'center', alignItems: 'center' },
  modalCardWrapper: { backgroundColor: '#ffffff', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#eaddcc' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', backgroundColor: '#faf6f0' },
  modalHeaderTitleBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modalHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#A0522D' },
  modalCloseBtn: { padding: 4 },
  modalScrollBody: { padding: 16 },
  
  modalReceiptStripCard: { backgroundColor: '#faf6f0', borderWidth: 1, borderColor: '#f5ebe0', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  receiptTokenLabel: { fontSize: 11, fontWeight: '700', color: '#bc9e82', textTransform: 'uppercase' },
  receiptTokenTitle: { fontSize: 14, fontWeight: '700', color: '#2e2520', marginTop: 4, textAlign: 'center' },
  receiptTokenSubId: { fontSize: 11, fontFamily: 'monospace', color: '#8c7664', marginTop: 2 },
  
  receiptDataStripsGroup: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 16 },
  receiptStripLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#faf6f0' },
  stripLabel: { fontSize: 12, color: '#8c7664', fontWeight: '500' },
  stripValue: { fontSize: 13, fontWeight: '600', color: '#2e2520' },
  
  receiptLargeTotalBlock: { backgroundColor: '#faf6f0', padding: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#f5ebe0' },
  largeTotalLabel: { fontSize: 11, fontWeight: '700', color: '#bc9e82', textTransform: 'uppercase' },
  largeTotalValue: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  
  modalDismissFullBtn: { height: 46, backgroundColor: '#422414', alignItems: 'center', justifyContent: 'center' },
  modalDismissFullBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  fallbackEmptyBox: { alignItems: 'center', padding: 24 }, fallbackEmptyText: { color: '#8c7664', fontSize: 13 }
});