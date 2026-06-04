import {
  AlertCircle,
  Award,
  BarChart2,
  CalendarDays,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  Download,
  FileCheck,
  FileText,
  TrendingUp,
  X
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ExaminationManagement() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  // States for Interactivity
  const [modalVisible, setModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToastMsg, setShowToastMsg] = useState(false);

  // Form States
  const [examName, setExamName] = useState('');
  const [examClass, setExamClass] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Action Handlers
  const showToast = (message: string) => {
    setToastMessage(message);
    setShowToastMsg(true);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setShowToastMsg(false));
  };

  const handleScheduleExam = () => {
    if (!examName || !examClass || !startDate || !endDate) {
      showToast('Please fill all required fields!');
      return;
    }
    setModalVisible(false);
    showToast(`${examName} scheduled successfully!`);
    setExamName('');
    setExamClass('');
    setStartDate('');
    setEndDate('');
  };

  const handleGeneratePending = () => {
    showToast('Generating 120 pending hall tickets...');
  };

  const handleReviewPending = () => {
    showToast('Opening 3 results for review...');
  };

  const handleReportAction = (reportName: string) => {
    showToast(`Preparing ${reportName} to download...`);
  };

  // Mock Data for Overview Cards
  const overviewStats = [
    { title: 'Upcoming Exams', value: '12', icon: CalendarDays, color: '#6366F1', bgColor: '#EEF2FF' },
    { title: 'Ongoing Exams', value: '4', icon: Clock, color: '#F59E0B', bgColor: '#FFFBEB' },
    { title: 'Completed', value: '28', icon: CheckCircle2, color: '#10B981', bgColor: '#ECFDF5' },
    { title: 'Results Published', value: '22', icon: FileCheck, color: '#8B5CF6', bgColor: '#F5F3FF' },
  ];

  // Mock Data for Exam Schedule
  const examSchedule = [
    { id: 1, exam: 'Mid-Term: Science', class: 'Grade X', start: '15 Jun 2026', end: '15 Jun 2026', status: 'Upcoming' },
    { id: 2, exam: 'Unit Test 2: Math', class: 'Grade IX', start: '12 Jun 2026', end: '12 Jun 2026', status: 'Ongoing' },
    { id: 3, exam: 'Final Practicals', class: 'Grade XII', start: '18 Jun 2026', end: '20 Jun 2026', status: 'Upcoming' },
    { id: 4, exam: 'Mid-Term: English', class: 'Grade VIII', start: '05 Jun 2026', end: '05 Jun 2026', status: 'Completed' },
  ];

  // Mock Data for Class Performance
  const classPerformance = [
    { id: 1, class: 'Grade X-A', pass: '96%', avg: '84.5' },
    { id: 2, class: 'Grade IX-B', pass: '88%', avg: '76.2' },
    { id: 3, class: 'Grade XII-Sci', pass: '92%', avg: '81.0' },
  ];

  // Mock Data for Subject Analysis
  const subjectAnalysis = [
    { id: 1, subject: 'Mathematics', high: '100', low: '35', avg: '78' },
    { id: 2, subject: 'Physics', high: '98', low: '42', avg: '74' },
    { id: 3, subject: 'English', high: '95', low: '55', avg: '82' },
  ];

  return (
    <View style={styles.container}>
      {/* Decorative Top Background */}
      <View style={styles.topBackgroundAccent} />

      {/* Absolute Toast Notification */}
      {showToastMsg && (
        <Animated.View style={[
          styles.toastContainer, 
          {
            opacity: toastAnim,
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 20] }) }]
          }
        ]}>
          <CheckCircle size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Grand Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.title}>Examinations Hub</Text>
            <Text style={styles.subtitle}>Manage schedules, hall tickets, approvals, and performance analytics.</Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={() => setModalVisible(true)}>
            <FileText size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Schedule New Exam</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          
          {/* 1. Overview Cards (Premium Float Design) */}
          <View style={styles.overviewGrid}>
            {overviewStats.map((stat, idx) => (
              <View key={idx} style={styles.statCard}>
                <View style={styles.statCardInner}>
                  <View style={styles.statTextColumn}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                  </View>
                  <View style={[styles.iconGlassWrapper, { backgroundColor: stat.bgColor }]}>
                    <stat.icon size={26} color={stat.color} />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* 2. Schedule & Hall Tickets Layout */}
          <View style={styles.dualColumnLayout}>
            
            {/* Exam Schedule (Grand Table) */}
            <View style={[styles.mainCard, { flex: 1.8, marginBottom: 0 }]}>
              <View style={styles.cardHeaderFlex}>
                <View>
                  <Text style={styles.cardTitle}>Exam Schedule</Text>
                  <Text style={styles.cardSubtitle}>Upcoming and active examination timelines.</Text>
                </View>
                <TouchableOpacity onPress={() => showToast('Opening Full Calendar...')}>
                  <Text style={styles.linkText}>View Full Calendar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeadText, { flex: 1.5 }]}>EXAM NAME</Text>
                <Text style={[styles.tableHeadText, { flex: 1 }]}>CLASS</Text>
                <Text style={[styles.tableHeadText, { flex: 1 }]}>START DATE</Text>
                <Text style={[styles.tableHeadText, { flex: 1 }]}>END DATE</Text>
              </View>

              <View style={styles.listContainer}>
                {examSchedule.map((item, index) => {
                  const isLast = index === examSchedule.length - 1;
                  return (
                    <View key={item.id} style={[styles.tableRow, isLast && { borderBottomWidth: 0 }]}>
                      <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.indicatorDot, item.status === 'Ongoing' ? { backgroundColor: '#F59E0B' } : item.status === 'Completed' ? { backgroundColor: '#10B981' } : { backgroundColor: '#6366F1' }]} />
                        <Text style={styles.examNameText}>{item.exam}</Text>
                      </View>
                      <Text style={[styles.tableRowText, { flex: 1 }]}>{item.class}</Text>
                      <Text style={[styles.tableRowText, { flex: 1 }]}>{item.start}</Text>
                      <Text style={[styles.tableRowText, { flex: 1 }]}>{item.end}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Hall Ticket Status Card */}
            <View style={[styles.mainCard, { flex: 1, marginBottom: 0 }]}>
              <View style={styles.cardHeaderFlex}>
                <Text style={styles.cardTitle}>Hall Tickets</Text>
                <AlertCircle size={20} color="#F59E0B" />
              </View>
              
              <View style={styles.hallTicketVisual}>
                <View style={styles.circleProgress}>
                  <Text style={styles.circlePercentage}>90%</Text>
                  <Text style={styles.circleSub}>Ready</Text>
                </View>
              </View>

              <View style={styles.metricsList}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Generated</Text>
                  <Text style={[styles.metricValue, { color: '#10B981' }]}>1,080</Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Pending</Text>
                  <Text style={[styles.metricValue, { color: '#F43F5E' }]}>120</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleGeneratePending}>
                <Text style={styles.secondaryBtnText}>Generate Pending</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Results Overview (Dark Theme) & Approvals */}
          <View style={styles.dualColumnLayout}>
            
            {/* Dark Theme Metrics Box (Results Overview) */}
            <View style={[styles.darkCard, { flex: 1.5 }]}>
              <View style={styles.darkCardBgPattern} />
              <Text style={styles.darkCardTitle}>Results Overview</Text>
              <Text style={styles.darkCardSubtitle}>Academic performance from recently published results</Text>
              
              <View style={styles.darkMetricsWrapper}>
                <View style={styles.darkMetricBox}>
                  <TrendingUp size={24} color="#34D399" />
                  <Text style={styles.darkMetricCount}>92.5%</Text>
                  <Text style={styles.darkMetricLabel}>Overall Pass</Text>
                </View>
                <View style={styles.darkMetricDivider} />
                <View style={styles.darkMetricBox}>
                  <BarChart2 size={24} color="#F87171" />
                  <Text style={styles.darkMetricCount}>7.5%</Text>
                  <Text style={styles.darkMetricLabel}>Overall Fail</Text>
                </View>
                <View style={styles.darkMetricDivider} />
                <View style={styles.darkMetricBox}>
                  <Award size={24} color="#FBBF24" />
                  <Text style={[styles.darkMetricCount, { fontSize: 22, marginTop: 18 }]}>Grade X-A</Text>
                  <Text style={styles.darkMetricLabel}>Top Performers</Text>
                </View>
              </View>
            </View>

            {/* Result Approval Box */}
            <View style={[styles.mainCard, { flex: 1, marginBottom: 0 }]}>
              <Text style={styles.cardTitleBox}>Result Approvals</Text>
              <View style={styles.complaintList}>
                <View style={styles.complaintRow}>
                  <View style={styles.complaintLabelGroup}>
                    <View style={[styles.complaintDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.complaintText}>Pending Approval</Text>
                  </View>
                  <Text style={styles.complaintValueBold}>3</Text>
                </View>
                <View style={styles.complaintRow}>
                  <View style={styles.complaintLabelGroup}>
                    <View style={[styles.complaintDot, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.complaintText}>Published Results</Text>
                  </View>
                  <Text style={styles.complaintValueBold}>14</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.approveBtn} onPress={handleReviewPending}>
                <CheckSquare size={16} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.approveBtnText}>Review Pending</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Class-wise & Subject Analysis Data */}
          <View style={styles.dualColumnLayout}>
            
            {/* Class-wise Performance */}
            <View style={[styles.mainCard, { flex: 1, marginBottom: 0 }]}>
              <Text style={styles.cardTitleBox}>Class-wise Performance</Text>
              <View style={styles.tableHeaderSmall}>
                <Text style={[styles.tableHeadText, { flex: 1.5 }]}>CLASS</Text>
                <Text style={[styles.tableHeadText, { flex: 1 }]}>PASS %</Text>
                <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right' }]}>AVG MARKS</Text>
              </View>
              {classPerformance.map((item, idx) => (
                <View key={item.id} style={[styles.tableRowSmall, idx === classPerformance.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={[styles.tableRowText, { flex: 1.5, fontWeight: '700', color: '#1E293B' }]}>{item.class}</Text>
                  <Text style={[styles.tableRowText, { flex: 1, color: '#10B981', fontWeight: '800' }]}>{item.pass}</Text>
                  <Text style={[styles.tableRowText, { flex: 1, textAlign: 'right', fontWeight: '600' }]}>{item.avg}</Text>
                </View>
              ))}
            </View>

            {/* Subject Analysis */}
            <View style={[styles.mainCard, { flex: 1.5, marginBottom: 0 }]}>
              <Text style={styles.cardTitleBox}>Subject Analysis</Text>
              <View style={styles.tableHeaderSmall}>
                <Text style={[styles.tableHeadText, { flex: 1.5 }]}>SUBJECT</Text>
                <Text style={[styles.tableHeadText, { flex: 1 }]}>HIGH</Text>
                <Text style={[styles.tableHeadText, { flex: 1 }]}>LOW</Text>
                <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right' }]}>AVERAGE</Text>
              </View>
              {subjectAnalysis.map((item, idx) => (
                <View key={item.id} style={[styles.tableRowSmall, idx === subjectAnalysis.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={[styles.tableRowText, { flex: 1.5, fontWeight: '700', color: '#4B49AC' }]}>{item.subject}</Text>
                  <Text style={[styles.tableRowText, { flex: 1, color: '#10B981', fontWeight: '700' }]}>{item.high}</Text>
                  <Text style={[styles.tableRowText, { flex: 1, color: '#F43F5E', fontWeight: '700' }]}>{item.low}</Text>
                  <Text style={[styles.tableRowText, { flex: 1, textAlign: 'right', fontWeight: '700' }]}>{item.avg}</Text>
                </View>
              ))}
            </View>

          </View>

          {/* 5. Exam Reports Center */}
          <Text style={styles.sectionHeading}>Examination Reports</Text>
          <View style={styles.actionTrackerGrid}>
            {[
              { name: 'Toppers List', desc: 'Generate rank holders report', color: '#F59E0B', bg: '#FFFBEB', icon: Award },
              { name: 'Performance Reports', desc: 'Detailed student marksheets', color: '#6366F1', bg: '#EEF2FF', icon: FileCheck },
              { name: 'Comparative Reports', desc: 'Year-over-year analytics', color: '#10B981', bg: '#ECFDF5', icon: BarChart2 },
              { name: 'Download Archive', desc: 'Get past exam records', color: '#8B5CF6', bg: '#F5F3FF', icon: Download }
            ].map((action, index) => (
              <TouchableOpacity 
                activeOpacity={0.8} 
                key={index} 
                style={styles.actionTrackerCard}
                onPress={() => handleReportAction(action.name)}
              >
                <View style={[styles.actionIconHolder, { backgroundColor: action.bg }]}>
                  <action.icon size={22} color={action.color} />
                </View>
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.atCardTitle}>{action.name}</Text>
                  <Text style={styles.atCardDesc}>{action.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </Animated.View>
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* CREATE EXAM MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule New Exam</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>
            
            <Text style={styles.inputLabel}>Exam Name</Text>
            <TextInput
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              placeholder="e.g., Final Exams 2026"
              placeholderTextColor="#9CA3AF"
              value={examName}
              onChangeText={setExamName}
            />

            <Text style={styles.inputLabel}>Applicable Class</Text>
            <TextInput
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              placeholder="e.g., Grade X"
              placeholderTextColor="#9CA3AF"
              value={examClass}
              onChangeText={setExamClass}
            />

            <View style={styles.modalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <TextInput
                  style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
                  placeholder="DD MMM YYYY"
                  placeholderTextColor="#9CA3AF"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
              <View style={{ width: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TextInput
                  style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
                  placeholder="DD MMM YYYY"
                  placeholderTextColor="#9CA3AF"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.submitModalBtn} onPress={handleScheduleExam}>
              <CalendarDays size={18} color="#FFF" style={{marginRight: 8}}/>
              <Text style={styles.submitModalText}>Schedule Exam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBackgroundAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: '#EEF2FF', 
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 32,
  },
  // Toast Animation Styles
  toastContainer: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    backgroundColor: '#10B981', // Emerald Success
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  toastText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  headerTextWrapper: {
    flex: 1,
    minWidth: 250,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: '#6366F1', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  // Overview Grid
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '47%',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      web: { flex: 1, minWidth: 220 }
    })
  },
  statCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  statTextColumn: {
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconGlassWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Main Cards
  dualColumnLayout: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F8FAFC',
    minWidth: 300,
  },
  cardHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  linkText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 14,
  },
  // Tables
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
  },
  tableHeadText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  examNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  tableRowText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  // Circular Progress (Hall Ticket)
  hallTicketVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  circleProgress: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#10B981',
    borderLeftColor: '#F1F5F9', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePercentage: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  circleSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  metricsList: {
    gap: 12,
    marginBottom: 24,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  metricLabel: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 14,
  },
  // Dark Card
  darkCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
    minWidth: 300,
  },
  darkCardBgPattern: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#312E81',
    opacity: 0.5,
  },
  darkCardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  darkCardSubtitle: {
    fontSize: 14,
    color: '#A5B4FC',
    fontWeight: '500',
    marginBottom: 32,
  },
  darkMetricsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkMetricBox: {
    alignItems: 'center',
    flex: 1,
  },
  darkMetricCount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  darkMetricLabel: {
    fontSize: 13,
    color: '#A5B4FC',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  darkMetricDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#3730A3',
  },
  cardTitleBox: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 24,
  },
  complaintList: {
    gap: 20,
    marginBottom: 24,
  },
  complaintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  complaintLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complaintDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  complaintText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  complaintValueBold: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  approveBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  approveBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  tableHeaderSmall: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8,
  },
  tableRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 20,
  },
  actionTrackerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 32,
  },
  actionTrackerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    width: '47%',
    ...Platform.select({
      web: { flex: 1, minWidth: 240 }
    })
  },
  actionIconHolder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  atCardDesc: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    maxWidth: 180,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 2000,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 16,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitModalBtn: {
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitModalText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});