import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  MoreVertical,
  Search,
  ShieldAlert,
  TrendingUp,
  UserCheck,
  UserX,
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

export default function DisciplineManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  
  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Interactivity States
  const [toastMessage, setToastMessage] = useState('');
  const [showToastMsg, setShowToastMsg] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  // Form States for New Incident
  const [newStudent, setNewStudent] = useState('');
  const [newClass, setNewClass] = useState('');
  const [newIncident, setNewIncident] = useState('');

  // Dynamic Incident List State
  const [incidentsList, setIncidentList] = useState([
    { id: 1, student: 'Rahul Kumar', class: '10-A', incident: 'Cyberbullying', severity: 'Critical', status: 'Under Review' },
    { id: 2, student: 'Sneha Reddy', class: '9-B', incident: 'Continuous Late Arrival', severity: 'Low', status: 'Resolved' },
    { id: 3, student: 'Arjun Das', class: '11-B', incident: 'Classroom Disruption', severity: 'Medium', status: 'Warning Issued' },
    { id: 4, student: 'Vikram Singh', class: '12-C', incident: 'Academic Malpractice', severity: 'High', status: 'Parent Called' },
    { id: 5, student: 'Kavya Sharma', class: '8-A', incident: 'Dress Code Violation', severity: 'Low', status: 'Warning Issued' },
  ]);

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

  const handleReportIncident = () => {
    if (!newStudent || !newClass || !newIncident) {
      showToast('Please fill all required fields!');
      return;
    }
    const newEntry = {
      id: incidentsList.length + 1,
      student: newStudent,
      class: newClass,
      incident: newIncident,
      severity: 'Medium', // Defaulting for mock
      status: 'Under Review'
    };
    setIncidentList([newEntry, ...incidentsList]);
    setReportModalVisible(false);
    showToast('Incident reported successfully!');
    setNewStudent('');
    setNewClass('');
    setNewIncident('');
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (selectedIncident) {
      const updatedList = incidentsList.map(item => 
        item.id === selectedIncident.id ? { ...item, status: newStatus } : item
      );
      setIncidentList(updatedList);
      setStatusModalVisible(false);
      showToast(`Status updated to ${newStatus}`);
    }
  };

  const handleActionTrackerClick = (actionName: string) => {
    showToast(`Initializing ${actionName} protocol...`);
  };

  // Mock Data for Overview Cards - Vibrant Theme
  const overviewStats = [
    { title: 'Total Cases', value: incidentsList.length.toString(), icon: ShieldAlert, color: '#6366F1', bgColor: '#EEF2FF' }, // Indigo
    { title: 'Open Cases', value: incidentsList.filter(i => i.status !== 'Resolved').length.toString(), icon: Clock, color: '#F59E0B', bgColor: '#FFFBEB' }, // Amber
    { title: 'Resolved Cases', value: incidentsList.filter(i => i.status === 'Resolved').length.toString(), icon: CheckCircle2, color: '#10B981', bgColor: '#ECFDF5' }, // Emerald
    { title: 'Suspensions', value: '4', icon: UserX, color: '#F43F5E', bgColor: '#FFF1F2' }, // Rose
  ];

  // Premium Severity Badges
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Low': return { color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' }; // Emerald
      case 'Medium': return { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' }; // Amber
      case 'High': return { color: '#E11D48', bg: '#FFE4E6', border: '#FECDD3' }; // Rose
      case 'Critical': return { color: '#FFFFFF', bg: '#E11D48', border: '#BE123C' }; // Solid Rose
      default: return { color: '#475569', bg: '#F1F5F9', border: '#E2E8F0' };
    }
  };

  const filteredIncidents = incidentsList.filter(item => {
    const matchesSearch = item.student.toLowerCase().includes(searchQuery.toLowerCase()) || item.incident.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || item.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

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
            <Text style={styles.title}>Discipline Command Center</Text>
            <Text style={styles.subtitle}>Real-time monitoring of campus conduct and disciplinary actions.</Text>
          </View>
          <TouchableOpacity style={styles.reportBtn} activeOpacity={0.8} onPress={() => setReportModalVisible(true)}>
            <AlertOctagon size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.reportBtnText}>Report Incident</Text>
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

          {/* 2. Incident Management Grid Section (Grand Table) */}
          <View style={styles.mainCard}>
            <View style={styles.cardHeaderFlex}>
              <View>
                <Text style={styles.cardTitle}>Active Incidents List</Text>
                <Text style={styles.cardSubtitle}>Track and manage student behavior reports.</Text>
              </View>
              
              <View style={styles.severitySelector}>
                {['All', 'Low', 'Medium', 'High', 'Critical'].map((level) => (
                  <TouchableOpacity 
                    key={level} 
                    style={[
                      styles.severityTab, 
                      selectedSeverity === level && styles.severityTabActive,
                      selectedSeverity === level && level === 'Critical' && { backgroundColor: '#E11D48' }
                    ]}
                    onPress={() => setSelectedSeverity(level)}
                  >
                    <Text style={[
                      styles.severityTabText, 
                      selectedSeverity === level && styles.severityTabTextActive,
                      selectedSeverity === level && level === 'Critical' && { color: '#FFF' }
                    ]}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Premium Search Box */}
            <View style={styles.searchContainer}>
              <Search size={18} color="#6366F1" />
              <TextInput
                style={[styles.searchInput, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
                placeholder="Search by student name or incident type..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeadText, { flex: 1.5 }]}>STUDENT INFO</Text>
              <Text style={[styles.tableHeadText, { flex: 2 }]}>INCIDENT DETAILS</Text>
              <Text style={[styles.tableHeadText, { flex: 1 }]}>SEVERITY</Text>
              <Text style={[styles.tableHeadText, { flex: 1.2, textAlign: 'right' }]}>CURRENT STATUS</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Table Body */}
            <View style={styles.listContainer}>
              {filteredIncidents.map((item, index) => {
                const stylesSeverity = getSeverityStyle(item.severity);
                const isLast = index === filteredIncidents.length - 1;
                return (
                  <View key={item.id} style={[styles.tableRow, isLast && { borderBottomWidth: 0 }]}>
                    <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{item.student.charAt(0)}</Text>
                      </View>
                      <View>
                        <Text style={styles.studentNameText}>{item.student}</Text>
                        <Text style={styles.classText}>Class {item.class}</Text>
                      </View>
                    </View>
                    
                    <Text style={[styles.incidentText, { flex: 2 }]}>{item.incident}</Text>
                    
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                      <View style={[styles.statusBadge, { backgroundColor: stylesSeverity.bg, borderColor: stylesSeverity.border }]}>
                        <Text style={[styles.statusText, { color: stylesSeverity.color }]}>{item.severity}</Text>
                      </View>
                    </View>
                    
                    <Text style={[styles.statusColumnText, { flex: 1.2 }]}>{item.status}</Text>
                    
                    {/* Action Button to Change Status */}
                    <TouchableOpacity 
                      style={{ width: 40, alignItems: 'center', padding: 8 }}
                      onPress={() => {
                        setSelectedIncident(item);
                        setStatusModalVisible(true);
                      }}
                    >
                      <MoreVertical size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 3. Dual Column Layout - Grand High Contrast Design */}
          <View style={styles.dualColumnLayout}>
            
            {/* Dark Theme Metrics Box (Behavior Records) */}
            <View style={[styles.darkCard, { flex: 1.2 }]}>
              <View style={styles.darkCardBgPattern} />
              <Text style={styles.darkCardTitle}>Behavioral Operations</Text>
              <Text style={styles.darkCardSubtitle}>Current month intervention statistics</Text>
              
              <View style={styles.darkMetricsWrapper}>
                <View style={styles.darkMetricBox}>
                  <AlertTriangle size={24} color="#FBBF24" />
                  <Text style={styles.darkMetricCount}>24</Text>
                  <Text style={styles.darkMetricLabel}>Warnings</Text>
                </View>
                <View style={styles.darkMetricDivider} />
                <View style={styles.darkMetricBox}>
                  <MessageSquare size={24} color="#60A5FA" />
                  <Text style={styles.darkMetricCount}>14</Text>
                  <Text style={styles.darkMetricLabel}>Meetings</Text>
                </View>
                <View style={styles.darkMetricDivider} />
                <View style={styles.darkMetricBox}>
                  <UserCheck size={24} color="#34D399" />
                  <Text style={styles.darkMetricCount}>18</Text>
                  <Text style={styles.darkMetricLabel}>Counseling</Text>
                </View>
              </View>
            </View>

            {/* Complaints Portal Box */}
            <View style={[styles.mainCard, { flex: 1, marginBottom: 0 }]}>
              <Text style={styles.cardTitleBox}>Complaints Overview</Text>
              <View style={styles.complaintList}>
                <View style={styles.complaintRow}>
                  <View style={styles.complaintLabelGroup}>
                    <View style={[styles.complaintDot, { backgroundColor: '#6366F1' }]} />
                    <Text style={styles.complaintText}>Student Complaints</Text>
                  </View>
                  <Text style={styles.complaintValueBold}>5</Text>
                </View>
                <View style={styles.complaintRow}>
                  <View style={styles.complaintLabelGroup}>
                    <View style={[styles.complaintDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.complaintText}>Teacher Complaints</Text>
                  </View>
                  <Text style={styles.complaintValueBold}>9</Text>
                </View>
                <View style={styles.complaintRow}>
                  <View style={styles.complaintLabelGroup}>
                    <View style={[styles.complaintDot, { backgroundColor: '#F43F5E' }]} />
                    <Text style={styles.complaintText}>Parent Complaints</Text>
                  </View>
                  <Text style={styles.complaintValueBold}>3</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 4. Action Tracker Matrix Grid */}
          <Text style={styles.sectionHeading}>Standard Disciplinary Protocols</Text>
          <View style={styles.actionTrackerGrid}>
            {[
              { name: 'Warning Letter', desc: 'Generate official warnings', color: '#6366F1', bg: '#EEF2FF' },
              { name: 'Detention', desc: 'Schedule after-school holds', color: '#F59E0B', bg: '#FFFBEB' },
              { name: 'Suspension', desc: 'Process temporary bans', color: '#F43F5E', bg: '#FFF1F2' },
              { name: 'Counseling', desc: 'Refer to school therapist', color: '#10B981', bg: '#ECFDF5' }
            ].map((action, index) => (
              <TouchableOpacity 
                activeOpacity={0.8} 
                key={index} 
                style={styles.actionTrackerCard}
                onPress={() => handleActionTrackerClick(action.name)}
              >
                <View style={[styles.actionIconHolder, { backgroundColor: action.bg }]}>
                  <FileText size={22} color={action.color} />
                </View>
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.atCardTitle}>{action.name}</Text>
                  <Text style={styles.atCardDesc}>{action.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 5. Discipline Analytics Segment */}
          <View style={[styles.mainCard, { paddingVertical: 28 }]}>
            <View style={styles.analyticsHeaderFlex}>
              <View>
                <Text style={styles.cardTitle}>Analytics & Trends</Text>
                <Text style={styles.cardSubtitle}>Data-driven insights for better campus management</Text>
              </View>
              <View style={styles.analyticsIconWrap}>
                <TrendingUp size={24} color="#6366F1" />
              </View>
            </View>
            
            <View style={styles.analyticsRowGrid}>
              <View style={styles.analyticsInfoColumn}>
                <Text style={styles.analyticsSectionLabel}>Highest Flagged Classes</Text>
                <Text style={styles.analyticsSubtextBold}>Grade IX-C & X-A</Text>
                <Text style={styles.analyticsDescText}>Representing 45% of total active incident files.</Text>
              </View>
              
              <View style={styles.verticalDividerLine} />
              
              <View style={styles.analyticsInfoColumn}>
                <Text style={styles.analyticsSectionLabel}>Monthly Trajectory</Text>
                <Text style={[styles.analyticsSubtextBold, { color: '#10B981' }]}>-12.4% Decrease</Text>
                <Text style={styles.analyticsDescText}>Improved conduct indexes compared to last month.</Text>
              </View>
              
              <View style={styles.verticalDividerLine} />
              
              <View style={styles.analyticsInfoColumn}>
                <Text style={styles.analyticsSectionLabel}>Frequent Offenders</Text>
                <Text style={[styles.analyticsSubtextBold, { color: '#F43F5E' }]}>3 Students</Text>
                <Text style={styles.analyticsDescText}>Continuous monitoring pipeline established.</Text>
              </View>
            </View>
          </View>

        </Animated.View>
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* REPORT INCIDENT MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report New Incident</Text>
              <Pressable onPress={() => setReportModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>
            
            <Text style={styles.inputLabel}>Student Name</Text>
            <TextInput
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              placeholder="e.g., John Doe"
              placeholderTextColor="#9CA3AF"
              value={newStudent}
              onChangeText={setNewStudent}
            />

            <Text style={styles.inputLabel}>Class / Section</Text>
            <TextInput
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              placeholder="e.g., 10-A"
              placeholderTextColor="#9CA3AF"
              value={newClass}
              onChangeText={setNewClass}
            />

            <Text style={styles.inputLabel}>Incident Description</Text>
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              placeholder="Describe the incident..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={newIncident}
              onChangeText={setNewIncident}
            />

            <TouchableOpacity style={styles.submitModalBtn} onPress={handleReportIncident}>
              <AlertOctagon size={18} color="#FFF" style={{marginRight: 8}}/>
              <Text style={styles.submitModalText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* UPDATE STATUS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Action Status</Text>
              <Pressable onPress={() => setStatusModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>
            
            <Text style={{ fontSize: 14, color: '#475569', marginBottom: 20 }}>
              Select a new status for <Text style={{fontWeight: '700', color: '#0F172A'}}>{selectedIncident?.student}</Text>'s incident.
            </Text>

            <View style={{ gap: 12 }}>
              {['Under Review', 'Warning Issued', 'Parent Called', 'Suspended', 'Resolved'].map((statusOption) => (
                <TouchableOpacity 
                  key={statusOption}
                  style={[
                    styles.statusOptionBtn,
                    selectedIncident?.status === statusOption && { borderColor: '#6366F1', backgroundColor: '#EEF2FF' }
                  ]}
                  onPress={() => handleUpdateStatus(statusOption)}
                >
                  <Text style={[
                    styles.statusOptionText,
                    selectedIncident?.status === statusOption && { color: '#6366F1', fontWeight: '800' }
                  ]}>{statusOption}</Text>
                </TouchableOpacity>
              ))}
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Lighter, cleaner background
  },
  topBackgroundAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: '#EEF2FF', // Soft indigo wash at the top
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
  reportBtn: {
    backgroundColor: '#E11D48', // Vibrant Rose for primary action
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  reportBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
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
    marginBottom: 32,
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
  severitySelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 12,
    gap: 4,
  },
  severityTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  severityTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  severityTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  severityTabTextActive: {
    color: '#0F172A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
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
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6366F1',
  },
  studentNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  classText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  incidentText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusColumnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'right',
  },
  dualColumnLayout: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
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
  analyticsHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  analyticsIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsRowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 24,
  },
  analyticsInfoColumn: {
    flex: 1,
    minWidth: 200,
  },
  analyticsSectionLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  analyticsSubtextBold: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  analyticsDescText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '500',
  },
  verticalDividerLine: {
    width: 1,
    height: '100%',
    minHeight: 80,
    backgroundColor: '#E2E8F0',
    ...Platform.select({
      mobile: { display: 'none' }
    })
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
  submitModalBtn: {
    flexDirection: 'row',
    backgroundColor: '#E11D48',
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
  statusOptionBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  statusOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  }
});