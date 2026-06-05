import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  useWindowDimensions,
  RefreshControl,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  School,
  Users,
  Download,
  Search,
  Filter,
  X,
  Eye,
  CheckCircle,
  AlertCircle,
  Wallet,
  CreditCard,
  Receipt,
  BookOpen,
  User,
  Award,
  History,
  Clock,
  FileText,
  Upload,
  Plus,
  Trash2,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { feeApi, classSectionFeeApi, feeDashboardApi, feeBulkCreationApi } from "@/app/utils/axiosInstance";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');
const COLORS = {
  background: "#F4F8FB",
  card: "#FFFFFF",
  primary: "#24343D",
  accent: "#22C7E5",
  textLight: "#64748B",
  border: "#DCE7EF",
  white: "#FFFFFF",
  success: "#22C7E5",
  warning: "#22C7E5",
  danger: "#22C7E5",
  purple: "#22C7E5",
  indigo: "#22C7E5",
};

interface FeeStats {
  classSectionId: string;
  className: string;
  section: string;
  totalExpectedFee: number;
  totalCollectedFee: number;
  totalPendingFee: number;
}

interface ClassSection {
  classSectionId: string;
  className: string;
  section: string;
  academicYear: string;
  classTeacherId: string;
  classTeacherName: string;
  capacity: number;
  currentStrength: number;
  subjectIds: string[];
}

interface StudentFeeDetail {
  studentId: string;
  studentName: string;
  rollNumber: string | null;
  totalFee: number;
  paidAmount: number;
  balanceAmount: number;
  status: "PAID" | "PARTIAL" | "PENDING";
}

interface FeeItem {
  feeId: string;
  studentId: string;
  feeName: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  status: string;
  createdAt?: string;
}

interface ClassStatusResponse {
  students: StudentFeeDetail[];
  feeItems: FeeItem[];
}

interface BulkFeeItem {
  studentId: string;
  feeName: string;
  amount: number;
  dueDate: string;
}

interface FeeSummary {
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
}

interface PaymentHistory {
  paymentId: string;
  feeId: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  method: string;
  transactionRef: string;
}

interface StudentDashboardData {
  summary: FeeSummary;
  pendingFees: FeeItem[];
  allFees: FeeItem[];
  paymentHistory: PaymentHistory[];
}

interface SummaryData {
  totalExpectedFee: number;
  totalCollectedFee: number;
  totalPendingFee: number;
  collectionRate: number;
}

export default function FeeManagementPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  const [activeTab, setActiveTab] = useState<"admin" | "student" | "bulk">("admin");
  
  // Admin States
  const [feeStats, setFeeStats] = useState<FeeStats[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [studentFees, setStudentFees] = useState<StudentFeeDetail[]>([]);
  const [classFeeItems, setClassFeeItems] = useState<FeeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedClass, setSelectedClass] = useState<FeeStats | null>(null);
  const [selectedClassSection, setSelectedClassSection] = useState<ClassSection | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [studentsModalVisible, setStudentsModalVisible] = useState(false);
  const [classStatusModalVisible, setClassStatusModalVisible] = useState(false);
  const [summary, setSummary] = useState<SummaryData>({
    totalExpectedFee: 0,
    totalCollectedFee: 0,
    totalPendingFee: 0,
    collectionRate: 0,
  });

  // Student States
  const [studentId, setStudentId] = useState("");
  const [studentDashboard, setStudentDashboard] = useState<StudentDashboardData | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentSearchModal, setStudentSearchModal] = useState(false);
  const [studentsList, setStudentsList] = useState<any[]>([]);

  // Bulk Create States
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [bulkStudents, setBulkStudents] = useState<BulkFeeItem[]>([
    { studentId: "", feeName: "", amount: 0, dueDate: "" },
  ]);
  const [uploading, setUploading] = useState(false);

  // Fetch fee statistics
  const fetchFeeStats = async () => {
    try {
      setLoading(true);
      const response = await feeApi.get("/api/student/fee/admin/dashboard/stats");
      if (response.data && Array.isArray(response.data)) {
        setFeeStats(response.data);
        calculateSummary(response.data);
      } else {
        setFeeStats([]);
      }
    } catch (error: any) {
      console.error("Fetch fee stats error:", error);
      const mockData: FeeStats[] = [
        { classSectionId: "CLS001", className: "5", section: "B", totalExpectedFee: 150000, totalCollectedFee: 16667, totalPendingFee: 133333 },
        { classSectionId: "CLS002", className: "10", section: "B", totalExpectedFee: 0, totalCollectedFee: 0, totalPendingFee: 0 },
        { classSectionId: "CLS003", className: "2", section: "A", totalExpectedFee: 0, totalCollectedFee: 0, totalPendingFee: 0 },
        { classSectionId: "CLS004", className: "2", section: "B", totalExpectedFee: 0, totalCollectedFee: 0, totalPendingFee: 0 },
      ];
      setFeeStats(mockData);
      calculateSummary(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch class sections
  const fetchClassSections = async () => {
    try {
      const response = await classSectionFeeApi.get("/api/student/class-sections");
      if (response.data && Array.isArray(response.data)) {
        setClassSections(response.data);
      }
    } catch (error) {
      console.error("Fetch class sections error:", error);
    }
  };

  // Fetch class status
  const fetchClassStatus = async (classSectionId: string) => {
    try {
      setLoading(true);
      const response = await feeApi.get(`/api/student/fee/admin/class-status/${classSectionId}`);
      if (response.data) {
        setStudentFees(response.data.students || []);
        setClassFeeItems(response.data.feeItems || []);
      }
    } catch (error: any) {
      console.error("Fetch class status error:", error);
      Alert.alert("Error", "Failed to fetch class status");
    } finally {
      setLoading(false);
    }
  };

  // Fetch student dashboard data
  const fetchStudentDashboard = async () => {
    if (!studentId) {
      Alert.alert("Error", "Please enter a student ID");
      return;
    }

    try {
      setStudentLoading(true);
      const response = await feeDashboardApi.get(`/api/student/fee/student/dashboard/${studentId}`);
      if (response.data) {
        setStudentDashboard(response.data);
      } else {
        Alert.alert("Error", "No data found for this student");
        setStudentDashboard(null);
      }
    } catch (error: any) {
      console.error("Fetch student dashboard error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch student fee details");
      setStudentDashboard(null);
    } finally {
      setStudentLoading(false);
      setStudentSearchModal(false);
    }
  };

  // Bulk Create - File Upload
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        setUploading(true);
        
        const fileContent = await FileSystem.readAsStringAsync(file.uri);
        const lines = fileContent.split('\n');
        const headers = lines[0].split(',');
        const feesData: BulkFeeItem[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',');
            const fee: any = {};
            headers.forEach((header, index) => {
              fee[header.trim()] = values[index]?.trim();
            });
            
            if (fee.studentId && fee.feeName && fee.amount && fee.dueDate) {
              feesData.push({
                studentId: fee.studentId,
                feeName: fee.feeName,
                amount: parseFloat(fee.amount),
                dueDate: fee.dueDate,
              });
            }
          }
        }
        
        if (feesData.length === 0) {
          Alert.alert("Error", "No valid fee data found in file");
          setUploading(false);
          return;
        }
        
        await feeBulkCreationApi.post("/api/student/fee/admin/bulk-create", feesData);
        Alert.alert("Success", `Successfully created ${feesData.length} fee records`);
        setBulkModalVisible(false);
        setBulkStudents([{ studentId: "", feeName: "", amount: 0, dueDate: "" }]);
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      Alert.alert("Error", "Failed to upload file. Please check the file format.");
    } finally {
      setUploading(false);
    }
  };

  // Add bulk row
  const addBulkRow = () => {
    setBulkStudents([...bulkStudents, { studentId: "", feeName: "", amount: 0, dueDate: "" }]);
  };

  // Remove bulk row
  const removeBulkRow = (index: number) => {
    const updated = [...bulkStudents];
    updated.splice(index, 1);
    setBulkStudents(updated);
  };

  // Update bulk field
  const updateBulkField = (index: number, field: keyof BulkFeeItem, value: string | number) => {
    const updated = [...bulkStudents];
    updated[index] = { ...updated[index], [field]: value };
    setBulkStudents(updated);
  };

  // Submit bulk create
  const handleBulkSubmit = async () => {
    for (let i = 0; i < bulkStudents.length; i++) {
      const fee = bulkStudents[i];
      if (!fee.studentId || !fee.feeName || !fee.amount || !fee.dueDate) {
        Alert.alert("Error", `Please fill all fields for fee record ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);
      await feeBulkCreationApi.post("/api/student/fee/admin/bulk-create", bulkStudents);
      Alert.alert("Success", `Successfully created ${bulkStudents.length} fee records`);
      setBulkModalVisible(false);
      setBulkStudents([{ studentId: "", feeName: "", amount: 0, dueDate: "" }]);
    } catch (error: any) {
      console.error("Bulk create error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to create fee records");
    } finally {
      setLoading(false);
    }
  };

  // Fetch students list
  const fetchStudentsList = async () => {
    try {
      const response = await studentApi.get("/api/students");
      setStudentsList(response.data || []);
    } catch (error) {
      setStudentsList([
        { studentId: "STU001", fullName: "John Doe" },
        { studentId: "STU002", fullName: "Jane Smith" },
      ]);
    }
  };

  const calculateSummary = (data: FeeStats[]) => {
    const totalExpected = data.reduce((sum, item) => sum + item.totalExpectedFee, 0);
    const totalCollected = data.reduce((sum, item) => sum + item.totalCollectedFee, 0);
    const totalPending = data.reduce((sum, item) => sum + item.totalPendingFee, 0);
    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
    
    setSummary({
      totalExpectedFee: totalExpected,
      totalCollectedFee: totalCollected,
      totalPendingFee: totalPending,
      collectionRate: collectionRate,
    });
  };

  useEffect(() => {
    if (activeTab === "admin") {
      fetchFeeStats();
      fetchClassSections();
    } else if (activeTab === "student") {
      fetchStudentsList();
    }
  }, [activeTab]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "admin") {
      await Promise.all([fetchFeeStats(), fetchClassSections()]);
    } else if (activeTab === "student" && studentDashboard && studentId) {
      await fetchStudentDashboard();
    }
    setRefreshing(false);
  };

  const filteredStats = feeStats.filter(item =>
    `${item.className} ${item.section}`.toLowerCase().includes(searchText.toLowerCase()) ||
    item.classSectionId.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "PAID": return COLORS.success;
      case "PARTIAL": return COLORS.warning;
      case "PENDING": return COLORS.danger;
      default: return COLORS.textLight;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "PAID": return "Paid";
      case "PARTIAL": return "Partial";
      case "PENDING": return "Pending";
      default: return status;
    }
  };

  const handleViewClassStatus = async (item: FeeStats) => {
    setSelectedClass(item);
    await fetchClassStatus(item.classSectionId);
    setClassStatusModalVisible(true);
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color, bgColor }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color, backgroundColor: bgColor || COLORS.white }]}>
      <View style={styles.statCardIconContainer}>
        <Icon size={28} color={color} />
      </View>
      <View style={styles.statCardContent}>
        <Text style={styles.statCardTitle}>{title}</Text>
        <Text style={[styles.statCardValue, { color: color }]}>{value}</Text>
      </View>
    </View>
  );

  // Admin View
  const renderAdminView = () => (
    <>
      {/* Summary Cards Grid - Properly Spaced */}
      <View style={styles.summaryGrid}>
        <StatCard title="Total Expected" value={formatCurrency(summary.totalExpectedFee)} icon={Wallet} color={COLORS.primary} />
        <StatCard title="Total Collected" value={formatCurrency(summary.totalCollectedFee)} icon={CreditCard} color={COLORS.success} />
        <StatCard title="Total Pending" value={formatCurrency(summary.totalPendingFee)} icon={AlertCircle} color={COLORS.danger} />
        <StatCard title="Collection Rate" value={`${summary.collectionRate.toFixed(1)}%`} icon={TrendingUp} color={COLORS.accent} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Search size={18} color={COLORS.textLight} />
        <TextInput style={styles.searchInput} placeholder="Search by class (e.g., 5 B)..." placeholderTextColor={COLORS.textLight} value={searchText} onChangeText={setSearchText} />
      </View>

      <Text style={styles.sectionTitle}>Class-wise Fee Collection</Text>
      
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={styles.loader} />
      ) : filteredStats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Receipt size={64} color={COLORS.border} />
          <Text style={styles.emptyText}>No fee data available</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.classCell]}>Class</Text>
            <Text style={[styles.headerCell, styles.expectedCell]}>Expected</Text>
            <Text style={[styles.headerCell, styles.collectedCell]}>Collected</Text>
            <Text style={[styles.headerCell, styles.pendingCell]}>Pending</Text>
            <Text style={[styles.headerCell, styles.actionCell]}>Action</Text>
          </View>
          
          {/* Table Rows */}
          {filteredStats.map((item, index) => (
            <View key={item.classSectionId} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
              <Text style={[styles.rowCell, styles.classCell]}>{item.className} - {item.section.toUpperCase()}</Text>
              <Text style={[styles.rowCell, styles.expectedCell, styles.amountCell]}>{formatCurrency(item.totalExpectedFee)}</Text>
              <Text style={[styles.rowCell, styles.collectedCell, styles.amountCell, { color: COLORS.success }]}>{formatCurrency(item.totalCollectedFee)}</Text>
              <Text style={[styles.rowCell, styles.pendingCell, styles.amountCell, { color: COLORS.danger }]}>{formatCurrency(item.totalPendingFee)}</Text>
              <View style={[styles.actionCell, styles.actionButtons]}>
                <TouchableOpacity style={[styles.smallButton, styles.viewStatusBtn]} onPress={() => handleViewClassStatus(item)}>
                  <Eye size={14} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );

  // Student View
  const renderStudentView = () => (
    <View style={styles.studentContainer}>
      <View style={styles.studentSearchCard}>
        <Text style={styles.studentSearchTitle}>Student Fee Dashboard</Text>
        <Text style={styles.studentSearchSubtitle}>Enter student ID to view fee details</Text>
        
        <View style={styles.studentSearchInputContainer}>
          <TextInput style={styles.studentSearchInput} placeholder="Enter Student ID" placeholderTextColor={COLORS.textLight} value={studentId} onChangeText={setStudentId} />
          <TouchableOpacity style={styles.studentSearchBtn} onPress={() => setStudentSearchModal(true)}><Users size={20} color={COLORS.white} /></TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.viewResultBtn} onPress={fetchStudentDashboard}>
          <Eye size={18} color={COLORS.white} />
          <Text style={styles.viewResultBtnText}>View Result</Text>
        </TouchableOpacity>
      </View>

      {studentLoading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={styles.studentLoader} />
      ) : studentDashboard ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Student Summary Grid */}
          <View style={styles.studentSummaryGrid}>
            <View style={styles.studentSummaryCard}>
              <Wallet size={24} color={COLORS.primary} />
              <Text style={styles.studentSummaryLabel}>Total Fee</Text>
              <Text style={styles.studentSummaryValue}>{formatCurrency(studentDashboard.summary.totalFee)}</Text>
            </View>
            <View style={styles.studentSummaryCard}>
              <CreditCard size={24} color={COLORS.success} />
              <Text style={styles.studentSummaryLabel}>Paid Amount</Text>
              <Text style={[styles.studentSummaryValue, { color: COLORS.success }]}>{formatCurrency(studentDashboard.summary.paidAmount)}</Text>
            </View>
            <View style={styles.studentSummaryCard}>
              <AlertCircle size={24} color={COLORS.danger} />
              <Text style={styles.studentSummaryLabel}>Pending Amount</Text>
              <Text style={[styles.studentSummaryValue, { color: COLORS.danger }]}>{formatCurrency(studentDashboard.summary.pendingAmount)}</Text>
            </View>
          </View>

          {/* Pending Fees */}
          <View style={styles.feeSection}>
            <View style={styles.feeSectionHeader}><Clock size={20} color={COLORS.warning} /><Text style={styles.feeSectionTitle}>Pending Fees</Text></View>
            {studentDashboard.pendingFees.length === 0 ? (
              <Text style={styles.noDataText}>No pending fees</Text>
            ) : (
              studentDashboard.pendingFees.map((fee) => (
                <View key={fee.feeId} style={styles.feeCard}>
                  <View style={styles.feeCardHeader}>
                    <Text style={styles.feeName}>{fee.feeName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: COLORS.danger + "20" }]}>
                      <Text style={[styles.statusText, { color: COLORS.danger }]}>{fee.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.feeAmount}>Amount: {formatCurrency(fee.amount)}</Text>
                  <Text style={styles.feeDueDate}>Due Date: {formatDate(fee.dueDate)}</Text>
                </View>
              ))
            )}
          </View>

          {/* All Fees */}
          <View style={styles.feeSection}>
            <View style={styles.feeSectionHeader}><FileText size={20} color={COLORS.accent} /><Text style={styles.feeSectionTitle}>All Fees</Text></View>
            {studentDashboard.allFees.map((fee) => (
              <View key={fee.feeId} style={styles.feeCard}>
                <View style={styles.feeCardHeader}>
                  <Text style={styles.feeName}>{fee.feeName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(fee.status) + "20" }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(fee.status) }]}>{fee.status}</Text>
                  </View>
                </View>
                <Text style={styles.feeAmount}>Amount: {formatCurrency(fee.amount)}</Text>
                {fee.amountPaid > 0 && <Text style={styles.feePaid}>Paid: {formatCurrency(fee.amountPaid)}</Text>}
                <Text style={styles.feeDueDate}>Due Date: {formatDate(fee.dueDate)}</Text>
              </View>
            ))}
          </View>

          {/* Payment History */}
          {studentDashboard.paymentHistory.length > 0 && (
            <View style={styles.feeSection}>
              <View style={styles.feeSectionHeader}><History size={20} color={COLORS.purple} /><Text style={styles.feeSectionTitle}>Payment History</Text></View>
              {studentDashboard.paymentHistory.map((payment) => (
                <View key={payment.paymentId} style={styles.paymentCard}>
                  <View style={styles.paymentHeader}>
                    <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
                    <Text style={styles.paymentMethod}>{payment.method}</Text>
                  </View>
                  <Text style={styles.paymentDate}>Date: {formatDate(payment.paymentDate)}</Text>
                  <Text style={styles.paymentRef}>Ref: {payment.transactionRef}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : null}
    </View>
  );

  // Bulk Create View
  const renderBulkView = () => (
    <View style={styles.bulkContainer}>
      <View style={styles.bulkHeaderCard}>
        <Upload size={32} color={COLORS.accent} />
        <Text style={styles.bulkTitle}>Bulk Fee Creation</Text>
        <Text style={styles.bulkSubtitle}>Upload CSV file or manually add fee records</Text>
      </View>

      <View style={styles.bulkOptions}>
        <TouchableOpacity style={styles.bulkOption} onPress={handleFileUpload}>
          <Upload size={24} color={COLORS.white} />
          <Text style={styles.bulkOptionText}>Upload CSV File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bulkOption, styles.bulkManualOption]} onPress={() => setBulkModalVisible(true)}>
          <Plus size={24} color={COLORS.white} />
          <Text style={styles.bulkOptionText}>Add Manually</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.csvFormatCard}>
        <Text style={styles.csvFormatTitle}>CSV File Format</Text>
        <Text style={styles.csvFormatText}>studentId, feeName, amount, dueDate</Text>
        <Text style={styles.csvFormatExample}>Example: STU001, Tuition Fee, 50000, 2025-12-31</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Fee Management</Text>
          <Text style={styles.headerSubtitle}>Track and manage fee collections</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.bulkButton} onPress={() => setActiveTab("bulk")}>
            <Upload size={18} color={COLORS.white} />
            <Text style={styles.bulkButtonText}>Bulk Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Download size={18} color={COLORS.white} />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === "admin" && styles.activeTab]} onPress={() => setActiveTab("admin")}>
          <School size={18} color={activeTab === "admin" ? COLORS.accent : COLORS.textLight} />
          <Text style={[styles.tabText, activeTab === "admin" && styles.activeTabText]}>Admin View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === "student" && styles.activeTab]} onPress={() => setActiveTab("student")}>
          <User size={18} color={activeTab === "student" ? COLORS.accent : COLORS.textLight} />
          <Text style={[styles.tabText, activeTab === "student" && styles.activeTabText]}>Student View</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.accent]} />}
      >
        {activeTab === "admin" ? renderAdminView() : activeTab === "student" ? renderStudentView() : renderBulkView()}
      </ScrollView>

      {/* Class Status Modal */}
      <Modal visible={classStatusModalVisible} animationType="slide" transparent onRequestClose={() => setClassStatusModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Class {selectedClass?.className} - {selectedClass?.section?.toUpperCase()} - Fee Status</Text>
              <TouchableOpacity onPress={() => setClassStatusModalVisible(false)}><X size={24} color={COLORS.textLight} /></TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.detailSectionTitle}>Students ({studentFees.length})</Text>
              {studentFees.map((student) => (
                <View key={student.studentId} style={styles.studentStatusCard}>
                  <View style={styles.studentStatusHeader}>
                    <View style={styles.studentAvatarSmall}><Text style={styles.studentAvatarSmallText}>{student.studentName.charAt(0).toUpperCase()}</Text></View>
                    <View><Text style={styles.studentStatusName}>{student.studentName}</Text><Text style={styles.studentStatusId}>ID: {student.studentId}</Text></View>
                    <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor(student.status) + "20" }]}>
                      <Text style={[styles.statusBadgeLargeText, { color: getStatusColor(student.status) }]}>{getStatusText(student.status)}</Text>
                    </View>
                  </View>
                  <View style={styles.studentStatusDetails}>
                    <Text>Total: {formatCurrency(student.totalFee)}</Text>
                    <Text>Paid: {formatCurrency(student.paidAmount)}</Text>
                    <Text>Balance: {formatCurrency(student.balanceAmount)}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bulk Create Manual Modal */}
      <Modal visible={bulkModalVisible} animationType="slide" transparent onRequestClose={() => setBulkModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.bulkModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Fee Records Manually</Text>
              <TouchableOpacity onPress={() => setBulkModalVisible(false)}><X size={24} color={COLORS.textLight} /></TouchableOpacity>
            </View>
            <ScrollView>
              {bulkStudents.map((fee, index) => (
                <View key={index} style={styles.bulkRowCard}>
                  <View style={styles.bulkRowHeader}>
                    <Text style={styles.bulkRowTitle}>Fee Record {index + 1}</Text>
                    {bulkStudents.length > 1 && <TouchableOpacity onPress={() => removeBulkRow(index)}><Trash2 size={18} color={COLORS.danger} /></TouchableOpacity>}
                  </View>
                  <TextInput style={styles.input} placeholder="Student ID" value={fee.studentId} onChangeText={(text) => updateBulkField(index, "studentId", text)} />
                  <TextInput style={styles.input} placeholder="Fee Name" value={fee.feeName} onChangeText={(text) => updateBulkField(index, "feeName", text)} />
                  <TextInput style={styles.input} placeholder="Amount" keyboardType="numeric" value={fee.amount === 0 ? "" : fee.amount.toString()} onChangeText={(text) => updateBulkField(index, "amount", parseFloat(text) || 0)} />
                  <TextInput style={styles.input} placeholder="Due Date (YYYY-MM-DD)" value={fee.dueDate} onChangeText={(text) => updateBulkField(index, "dueDate", text)} />
                </View>
              ))}
              <TouchableOpacity style={styles.addRowButton} onPress={addBulkRow}><Plus size={16} color={COLORS.white} /><Text style={styles.addRowButtonText}>Add Another Fee</Text></TouchableOpacity>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setBulkModalVisible(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.createBtn]} onPress={handleBulkSubmit}><Text style={styles.createBtnText}>Create All</Text></TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Student Search Modal */}
      <Modal visible={studentSearchModal} animationType="slide" transparent onRequestClose={() => setStudentSearchModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Select Student</Text><TouchableOpacity onPress={() => setStudentSearchModal(false)}><X size={24} color={COLORS.textLight} /></TouchableOpacity></View>
            <TextInput style={styles.searchInputModal} placeholder="Search student..." placeholderTextColor={COLORS.textLight} value={studentId} onChangeText={setStudentId} />
            <ScrollView>
              {studentsList.filter(s => s.fullName?.toLowerCase().includes(studentId.toLowerCase()) || s.studentId?.toLowerCase().includes(studentId.toLowerCase())).map((student) => (
                <TouchableOpacity key={student.studentId} style={styles.studentOption} onPress={() => { setStudentId(student.studentId); setStudentSearchModal(false); }}>
                  <User size={16} color={COLORS.accent} />
                  <View><Text style={styles.studentOptionName}>{student.fullName}</Text><Text style={styles.studentOptionId}>ID: {student.studentId}</Text></View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  // Header Styles
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.white },
  headerSubtitle: { fontSize: 13, color: "#c7d2fe", marginTop: 4 },
  headerButtons: { flexDirection: "row", gap: 10 },
  bulkButton: { backgroundColor: COLORS.warning, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 6 },
  bulkButtonText: { color: COLORS.white, fontWeight: "600", fontSize: 12 },
  exportButton: { backgroundColor: COLORS.accent, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 6 },
  exportButtonText: { color: COLORS.white, fontWeight: "600", fontSize: 12 },
  
  // Tab Styles
  tabContainer: { flexDirection: "row", backgroundColor: COLORS.card, margin: 16, marginBottom: 0, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, gap: 8 },
  activeTab: { backgroundColor: COLORS.accent + "10", borderBottomWidth: 2, borderBottomColor: COLORS.accent },
  tabText: { fontSize: 14, fontWeight: "600", color: COLORS.textLight },
  activeTabText: { color: COLORS.accent },
  
  content: { flex: 1, paddingHorizontal: 16 },
  
  // Summary Grid - Properly Spaced
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20, gap: 12 },
  statCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.card, borderRadius: 16, padding: 16, width: width < 768 ? "48%" : "23%", borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  statCardIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center", marginRight: 12 },
  statCardContent: { flex: 1 },
  statCardTitle: { fontSize: 12, color: COLORS.textLight, fontWeight: "500" },
  statCardValue: { fontSize: 18, fontWeight: "bold", marginTop: 4 },
  
  searchBox: { backgroundColor: COLORS.card, marginBottom: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.primary },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.primary, marginBottom: 16 },
  
  // Table Styles
  tableContainer: { backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden", marginBottom: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 12 },
  headerCell: { fontSize: 12, fontWeight: "600", color: COLORS.white },
  classCell: { width: 90 }, expectedCell: { width: 95 }, collectedCell: { width: 95 }, pendingCell: { width: 95 }, actionCell: { width: 60 },
  tableRow: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, alignItems: "center" },
  tableRowEven: { backgroundColor: COLORS.background },
  rowCell: { fontSize: 12, color: COLORS.primary }, amountCell: { fontWeight: "500" },
  actionButtons: { flexDirection: "row", justifyContent: "center" },
  smallButton: { width: 32, height: 32, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  viewStatusBtn: { backgroundColor: COLORS.accent },
  
  loader: { marginTop: 50 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60, backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  emptyText: { fontSize: 16, fontWeight: "600", color: COLORS.textLight, marginTop: 16 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, width: "90%", maxHeight: "85%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.primary },
  detailSectionTitle: { fontSize: 16, fontWeight: "600", color: COLORS.primary, marginBottom: 12 },
  
  // Student Status Card
  studentStatusCard: { backgroundColor: COLORS.background, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  studentStatusHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  studentAvatarSmall: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.accent, justifyContent: "center", alignItems: "center" },
  studentAvatarSmallText: { fontSize: 14, fontWeight: "bold", color: COLORS.white },
  studentStatusName: { fontSize: 14, fontWeight: "600", color: COLORS.primary },
  studentStatusId: { fontSize: 10, color: COLORS.textLight },
  studentStatusDetails: { flexDirection: "row", justifyContent: "space-between", paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  statusBadgeLarge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeLargeText: { fontSize: 11, fontWeight: "600" },
  
  // Student View Styles
  studentContainer: { paddingBottom: 20 },
  studentSearchCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" },
  studentSearchTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.primary, marginBottom: 4 },
  studentSearchSubtitle: { fontSize: 13, color: COLORS.textLight, marginBottom: 20 },
  studentSearchInputContainer: { flexDirection: "row", gap: 12, marginBottom: 16, width: "100%" },
  studentSearchInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, backgroundColor: COLORS.background },
  studentSearchBtn: { backgroundColor: COLORS.accent, width: 48, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  viewResultBtn: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, gap: 8 },
  viewResultBtnText: { color: COLORS.white, fontSize: 14, fontWeight: "600" },
  studentLoader: { marginTop: 50 },
  studentSummaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  studentSummaryCard: { flex: 1, minWidth: "30%", backgroundColor: COLORS.card, borderRadius: 12, padding: 16, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  studentSummaryLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 8 },
  studentSummaryValue: { fontSize: 16, fontWeight: "bold", marginTop: 4 },
  
  // Fee Section Styles
  feeSection: { marginBottom: 20 },
  feeSectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  feeSectionTitle: { fontSize: 16, fontWeight: "600", color: COLORS.primary },
  feeCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  feeCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  feeName: { fontSize: 14, fontWeight: "600", color: COLORS.primary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: "600" },
  feeAmount: { fontSize: 13, color: COLORS.textLight, marginBottom: 4 },
  feePaid: { fontSize: 13, color: COLORS.success, marginBottom: 4 },
  feeDueDate: { fontSize: 12, color: COLORS.warning },
  paymentCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  paymentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  paymentAmount: { fontSize: 16, fontWeight: "bold", color: COLORS.success },
  paymentMethod: { fontSize: 12, color: COLORS.accent, fontWeight: "500" },
  paymentDate: { fontSize: 12, color: COLORS.textLight, marginBottom: 4 },
  paymentRef: { fontSize: 11, color: COLORS.textLight },
  noDataText: { textAlign: "center", color: COLORS.textLight, paddingVertical: 20 },
  
  // Bulk Create Styles
  bulkContainer: { paddingBottom: 20 },
  bulkHeaderCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  bulkTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.primary, marginTop: 12 },
  bulkSubtitle: { fontSize: 13, color: COLORS.textLight, marginTop: 4 },
  bulkOptions: { flexDirection: "row", gap: 16, marginBottom: 20 },
  bulkOption: { flex: 1, backgroundColor: COLORS.accent, borderRadius: 12, padding: 16, alignItems: "center", gap: 8 },
  bulkManualOption: { backgroundColor: COLORS.primary },
  bulkOptionText: { color: COLORS.white, fontSize: 14, fontWeight: "600" },
  csvFormatCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" },
  csvFormatTitle: { fontSize: 14, fontWeight: "600", color: COLORS.primary, marginBottom: 8 },
  csvFormatText: { fontSize: 12, color: COLORS.textLight, fontFamily: "monospace" },
  csvFormatExample: { fontSize: 11, color: COLORS.textLight, marginTop: 8 },
  
  bulkModalContent: { width: "95%", maxHeight: "85%" },
  bulkRowCard: { backgroundColor: COLORS.background, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  bulkRowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  bulkRowTitle: { fontSize: 14, fontWeight: "600", color: COLORS.primary },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, backgroundColor: COLORS.white, marginBottom: 8 },
  addRowButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 10, gap: 8, marginBottom: 16 },
  addRowButtonText: { color: COLORS.white, fontSize: 13, fontWeight: "600" },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  cancelBtn: { backgroundColor: COLORS.border }, cancelBtnText: { color: COLORS.primary, fontWeight: "600" },
  createBtn: { backgroundColor: COLORS.accent }, createBtnText: { color: COLORS.white, fontWeight: "600" },
  
  searchInputModal: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, backgroundColor: COLORS.background, marginBottom: 16 },
  studentOption: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12 },
  studentOptionName: { fontSize: 14, fontWeight: "600", color: COLORS.primary },
  studentOptionId: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
});