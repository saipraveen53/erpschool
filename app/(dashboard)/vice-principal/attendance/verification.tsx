import {
  AlertTriangle,
  BarChart2,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Filter,
  Search,
  UserCheck,
  Users,
  UserX,
  X
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';

export default function AttendanceVerification() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  // --- STATES ---
  const [chartType, setChartType] = useState('Daily');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dropdown States
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Grade X');
  const classOptions = ['Grade VIII', 'Grade IX', 'Grade X', 'Grade XI', 'Grade XII'];

  const [showSectionMenu, setShowSectionMenu] = useState(false);
  const [selectedSection, setSelectedSection] = useState('A');
  const sectionOptions = ['A', 'B', 'C', 'D'];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today, 3 Jun');

  // Leave Requests State (to allow removing items)
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'Mr. Rajesh', type: 'Staff', date: 'Jun 4 - Jun 5', reason: 'Sick Leave' },
    { id: 2, name: 'Arjun Das (IX-A)', type: 'Student', date: 'Jun 4', reason: 'Family Function' },
    { id: 3, name: 'Mrs. Kavita', type: 'Staff', date: 'Jun 5', reason: 'Personal' },
  ]);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [showToastMsg, setShowToastMsg] = useState(false);

  // --- ANIMATIONS ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(barAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: false })
    ]).start();
  }, []);

  // --- ACTION HANDLERS ---
  const showToast = (message: string) => {
    setToastMessage(message);
    setShowToastMsg(true);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setShowToastMsg(false));
  };

  const handleSendAlerts = () => {
    showToast('Alerts Sent to Parents Successfully!');
  };

  const handleLeaveAction = (id: number, action: string) => {
    showToast(`Leave Request ${action}!`);
    setLeaves(prev => prev.filter(leave => leave.id !== id));
  };

  // --- DUMMY DATA ---
  const overviewStats = [
    { title: "Today's Attendance", value: '92.4%', icon: BarChart2, color: '#4B49AC', bgColor: 'rgba(75, 73, 172, 0.1)' },
    { title: 'Students Present', value: '2,264', icon: UserCheck, color: '#57B657', bgColor: 'rgba(87, 182, 87, 0.1)' },
    { title: 'Students Absent', value: '186', icon: UserX, color: '#F3797E', bgColor: 'rgba(243, 121, 126, 0.1)' },
    { title: 'Teachers Absent', value: '4', icon: Users, color: '#7DA0FA', bgColor: 'rgba(125, 160, 250, 0.1)' },
  ];

  const defaulters = [
    { id: 1, name: 'Rahul Kumar', class: 'Grade X-A', percentage: 68 },
    { id: 2, name: 'Sneha Reddy', class: 'Grade IX-B', percentage: 71 },
    { id: 3, name: 'Amit Singh', class: 'Grade XI-C', percentage: 64 },
    { id: 4, name: 'Priya Patel', class: 'Grade VIII-A', percentage: 73 },
  ];

  const studentLogs = [
    { id: 1, name: 'Aarav Sharma', roll: '101', status: 'Present', percent: '95%' },
    { id: 2, name: 'Neha Gupta', roll: '102', status: 'Absent', percent: '82%' },
    { id: 3, name: 'Rohan Verma', roll: '103', status: 'Present', percent: '88%' },
    { id: 4, name: 'Ishita Jain', roll: '104', status: 'Leave', percent: '90%' },
  ];

  const barChartData = [
    { label: 'Mon', present: 95, absent: 5 },
    { label: 'Tue', present: 92, absent: 8 },
    { label: 'Wed', present: 88, absent: 12 },
    { label: 'Thu', present: 94, absent: 6 },
    { label: 'Fri', present: 91, absent: 9 },
  ];

  return (
    <View style={styles.container}>
      
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
        
        {/* Header Section */}
        <View style={[styles.header, !isDesktop && styles.headerMobile, { zIndex: 100 }]}>
          <View style={!isDesktop ? { width: '100%' } : {}}>
            <Text style={styles.title}>Attendance Verification</Text>
            <Text style={styles.subtitle}>Review and approve daily attendance logs & leaves.</Text>
          </View>
          
          <View style={[styles.headerActions, { zIndex: 50 }]}>
            <View style={{ position: 'relative' }}>
              <TouchableOpacity 
                style={styles.datePickerBtn}
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <Calendar size={16} color="#64748B" style={{ marginRight: 8 }} />
                <Text style={styles.datePickerText}>{selectedDate}</Text>
                <ChevronDown size={16} color="#64748B" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
              
              {showDatePicker && (
                <View style={styles.dropdownMenu}>
                  {['Today, 3 Jun', 'Yesterday, 2 Jun', 'Last 7 Days', 'This Month'].map((item) => (
                    <TouchableOpacity 
                      key={item} 
                      style={styles.dropdownMenuItem}
                      onPress={() => { setSelectedDate(item); setShowDatePicker(false); }}
                    >
                      <Text style={[styles.dropdownMenuItemText, selectedDate === item && styles.dropdownMenuItemTextActive]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <Animated.View style={{ opacity: fadeAnim, zIndex: 50 }}>
          
          {/* Overview Cards */}
          <View style={styles.overviewGrid}>
            {overviewStats.map((stat, index) => (
              <View 
                key={index} 
                style={[
                  styles.statCard, 
                  isDesktop ? { flex: 1 } : { width: '47%' } 
                ]}
              >
                <View style={[styles.iconWrapper, { backgroundColor: stat.bgColor }]}>
                  <stat.icon size={22} color={stat.color} />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Main Content Layout */}
          <View style={[styles.mainLayout, !isDesktop && styles.mainLayoutMobile, { zIndex: 40 }]}>
            
            {/* Left Column (Trends & Logs) */}
            <View style={[styles.columnLeft, { zIndex: 30 }]}>
              
              {/* Attendance Trends Chart */}
              <View style={[styles.card, { zIndex: 10 }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Weekly Attendance Trends</Text>
                  <View style={styles.chartToggle}>
                    <TouchableOpacity onPress={() => setChartType('Daily')}>
                      <Text style={[styles.toggleText, chartType === 'Daily' && styles.toggleTextActive]}>Daily</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setChartType('Monthly')}>
                      <Text style={[styles.toggleText, chartType === 'Monthly' && styles.toggleTextActive]}>Monthly</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Chart Legend */}
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#7DA0FA'}]} /><Text style={styles.legendText}>Present</Text></View>
                  <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#F3797E'}]} /><Text style={styles.legendText}>Absent</Text></View>
                </View>
                
                <View style={styles.chartContainer}>
                  {barChartData.map((data, idx) => (
                    <View key={idx} style={styles.barGroup}>
                      <View style={styles.bars}>
                        {/* Present Bar */}
                        <Animated.View 
                          style={[
                            styles.chartBar, 
                            { 
                              backgroundColor: '#7DA0FA', 
                              height: barAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', `${data.present}%`]
                              }) 
                            }
                          ]} 
                        />
                        {/* Absent Bar */}
                        <Animated.View 
                          style={[
                            styles.chartBar, 
                            { 
                              backgroundColor: '#F3797E', 
                              height: barAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', `${data.absent}%`]
                              }) 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.barLabelX}>{data.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Student Attendance Log */}
              <View style={[styles.card, { zIndex: 20 }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Student Attendance Logs</Text>
                  <TouchableOpacity style={styles.filterBtn} onPress={() => showToast('Filters applied!')}>
                    <Filter size={16} color="#4B49AC" style={{ marginRight: 6 }} />
                    <Text style={styles.filterBtnText}>Filters</Text>
                  </TouchableOpacity>
                </View>

                {/* Filters Dropdown UI */}
                <View style={[styles.filtersRow, { zIndex: 50 }]}>
                  
                  {/* Class Dropdown */}
                  <View style={[styles.filterInputWrapper, { zIndex: 60 }]}>
                    <Text style={styles.filterLabel}>Class</Text>
                    <TouchableOpacity 
                      style={styles.dropdownMock}
                      onPress={() => { setShowClassMenu(!showClassMenu); setShowSectionMenu(false); }}
                    >
                      <Text style={styles.dropdownText}>{selectedClass}</Text>
                      <ChevronDown size={14} color="#64748B" />
                    </TouchableOpacity>
                    {showClassMenu && (
                      <View style={styles.dropdownMenuList}>
                        {classOptions.map(cls => (
                          <TouchableOpacity 
                            key={cls} 
                            style={styles.dropdownMenuItem}
                            onPress={() => { setSelectedClass(cls); setShowClassMenu(false); }}
                          >
                            <Text style={styles.dropdownMenuItemText}>{cls}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Section Dropdown */}
                  <View style={[styles.filterInputWrapper, { zIndex: 50 }]}>
                    <Text style={styles.filterLabel}>Section</Text>
                    <TouchableOpacity 
                      style={styles.dropdownMock}
                      onPress={() => { setShowSectionMenu(!showSectionMenu); setShowClassMenu(false); }}
                    >
                      <Text style={styles.dropdownText}>{selectedSection}</Text>
                      <ChevronDown size={14} color="#64748B" />
                    </TouchableOpacity>
                    {showSectionMenu && (
                      <View style={styles.dropdownMenuList}>
                        {sectionOptions.map(sec => (
                          <TouchableOpacity 
                            key={sec} 
                            style={styles.dropdownMenuItem}
                            onPress={() => { setSelectedSection(sec); setShowSectionMenu(false); }}
                          >
                            <Text style={styles.dropdownMenuItemText}>{sec}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={[styles.filterInputWrapper, { flex: 1.5, zIndex: 10 }]}>
                    <Text style={styles.filterLabel}>Search Student</Text>
                    <View style={styles.searchMock}>
                      <Search size={14} color="#9CA3AF" />
                      <TextInput 
                        style={[styles.searchInput, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
                        placeholder="Name or Roll No..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                    </View>
                  </View>
                </View>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeadText, { flex: 2 }]}>Student Name</Text>
                  <Text style={[styles.tableHeadText, { flex: 1 }]}>Roll No</Text>
                  <Text style={[styles.tableHeadText, { flex: 1.5 }]}>Status</Text>
                  <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right' }]}>Att %</Text>
                </View>

                {/* Table List */}
                <View style={styles.listContainer}>
                  {studentLogs
                    .filter(log => log.name.toLowerCase().includes(searchQuery.toLowerCase()) || log.roll.includes(searchQuery))
                    .map((log) => (
                    <View key={log.id} style={styles.tableRow}>
                      <Text style={[styles.tableRowText, styles.textBold, { flex: 2 }]}>{log.name}</Text>
                      <Text style={[styles.tableRowText, { flex: 1 }]}>{log.roll}</Text>
                      <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
                        <View style={[
                          styles.statusBadge, 
                          log.status === 'Present' ? { backgroundColor: 'rgba(87, 182, 87, 0.1)' } : 
                          log.status === 'Absent' ? { backgroundColor: 'rgba(243, 121, 126, 0.1)' } :
                          { backgroundColor: 'rgba(255, 193, 0, 0.1)' }
                        ]}>
                          <Text style={[
                            styles.statusText,
                            log.status === 'Present' ? { color: '#57B657' } : 
                            log.status === 'Absent' ? { color: '#F3797E' } :
                            { color: '#FFC100' }
                          ]}>{log.status}</Text>
                        </View>
                      </View>
                      <Text style={[styles.tableRowText, styles.textBold, { flex: 1, textAlign: 'right', color: '#4B49AC' }]}>{log.percent}</Text>
                    </View>
                  ))}
                </View>
              </View>

            </View>

            {/* Right Column (Defaulters & Leaves) */}
            <View style={[styles.columnRight, { zIndex: 20 }]}>
              
              {/* Defaulters List (<75%) */}
              <View style={[styles.card, { zIndex: 10 }]}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AlertTriangle size={20} color="#F3797E" style={{ marginRight: 8 }} />
                    <Text style={styles.cardTitle}>Defaulters List</Text>
                  </View>
                  <Text style={styles.subtitleSmall}>&lt; 75% Att.</Text>
                </View>
                
                <View style={styles.listContainer}>
                  {defaulters.map((student) => (
                    <View key={student.id} style={styles.defaulterItem}>
                      <View style={styles.defaulterInfo}>
                        <Text style={styles.defaulterName}>{student.name}</Text>
                        <Text style={styles.defaulterClass}>{student.class}</Text>
                      </View>
                      <View style={styles.dangerBadge}>
                        <Text style={styles.dangerText}>{student.percentage}%</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.actionLinkBtn} onPress={handleSendAlerts}>
                  <Text style={styles.actionLinkText}>Send Alerts to Parents</Text>
                </TouchableOpacity>
              </View>

              {/* Leave Requests */}
              <View style={[styles.card, { zIndex: 10 }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Leave Requests</Text>
                  <View style={styles.notificationDotWrapper}>
                    <Text style={styles.notificationDotText}>{leaves.length}</Text>
                  </View>
                </View>
                
                <View style={styles.listContainer}>
                  {leaves.length > 0 ? (
                    leaves.map((leave) => (
                      <View key={leave.id} style={styles.leaveItem}>
                        <View style={styles.leaveHeader}>
                          <Text style={styles.leaveName}>{leave.name}</Text>
                          <Text style={styles.leaveType}>{leave.type}</Text>
                        </View>
                        <Text style={styles.leaveDetails}>{leave.date} • {leave.reason}</Text>
                        
                        <View style={styles.leaveActions}>
                          <TouchableOpacity 
                            style={[styles.actionBtn, styles.rejectBtn]}
                            onPress={() => handleLeaveAction(leave.id, 'Rejected')}
                          >
                            <X size={16} color="#F3797E" />
                            <Text style={styles.rejectText}>Reject</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.actionBtn, styles.approveBtn]}
                            onPress={() => handleLeaveAction(leave.id, 'Approved')}
                          >
                            <Check size={16} color="#FFF" />
                            <Text style={styles.approveText}>Approve</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>All caught up! No pending requests.</Text>
                  )}
                </View>
              </View>

              {/* Teacher Attendance Summary */}
              <View style={[styles.card, { zIndex: 10 }]}>
                <Text style={styles.cardTitle}>Teacher Attendance Summary</Text>
                <Text style={[styles.subtitleSmall, { marginBottom: 20 }]}>Today's Status</Text>
                
                <View style={styles.teacherSummaryRow}>
                  <View style={styles.teacherSummaryBox}>
                    <Text style={[styles.tsValue, { color: '#57B657' }]}>108</Text>
                    <Text style={styles.tsLabel}>Present</Text>
                  </View>
                  <View style={styles.teacherSummaryBox}>
                    <Text style={[styles.tsValue, { color: '#F3797E' }]}>2</Text>
                    <Text style={styles.tsLabel}>Absent</Text>
                  </View>
                  <View style={styles.teacherSummaryBox}>
                    <Text style={[styles.tsValue, { color: '#FFC100' }]}>2</Text>
                    <Text style={styles.tsLabel}>On Leave</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>

        </Animated.View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  scrollContent: {
    padding: 24,
  },
  
  // Toast Animation
  toastContainer: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    backgroundColor: '#57B657', // Success Green
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
    marginBottom: 24,
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  datePickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: 160,
    zIndex: 1000,
  },
  dropdownMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownMenuItemText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  dropdownMenuItemTextActive: {
    color: '#4B49AC',
    fontWeight: '700',
  },

  // Overview Cards
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    minWidth: 150,
  },
  iconWrapper: {
    width: 48, 
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  statTitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },

  // Main Layout
  mainLayout: {
    flexDirection: 'row',
    gap: 24,
  },
  mainLayoutMobile: {
    flexDirection: 'column',
  },
  columnLeft: {
    flex: 1.5,
    gap: 24,
  },
  columnRight: {
    flex: 1,
    gap: 24,
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitleSmall: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  // Charts
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 4,
  },
  toggleText: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    borderRadius: 6,
  },
  toggleTextActive: {
    backgroundColor: '#FFFFFF',
    color: '#4B49AC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12, height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
    paddingTop: 10,
  },
  barGroup: {
    alignItems: 'center',
    width: 45,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    gap: 4, // Gap between present and absent bars
  },
  chartBar: {
    flex: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabelX: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontWeight: '600',
  },

  // Filters & Table (Student Logs)
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(75, 73, 172, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterBtnText: {
    color: '#4B49AC',
    fontWeight: '700',
    fontSize: 13,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterInputWrapper: {
    flex: 1,
    minWidth: 100,
    position: 'relative',
  },
  filterLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '600',
  },
  dropdownMock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  dropdownMenuList: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  searchMock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#1E293B',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeadText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  listContainer: {
    gap: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowText: {
    fontSize: 14,
    color: '#334155',
  },
  textBold: {
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  // Defaulters List
  defaulterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  defaulterInfo: {
    flex: 1,
  },
  defaulterName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  defaulterClass: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  dangerBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dangerText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 13,
  },
  actionLinkBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(243, 121, 126, 0.1)',
    borderRadius: 8,
  },
  actionLinkText: {
    color: '#F3797E',
    fontWeight: '700',
    fontSize: 13,
  },

  // Leave Requests
  notificationDotWrapper: {
    backgroundColor: '#F3797E',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDotText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  leaveItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  leaveName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  leaveType: {
    fontSize: 11,
    color: '#7DA0FA',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  leaveDetails: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  leaveActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  rejectBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F3797E',
  },
  rejectText: {
    color: '#F3797E',
    fontWeight: '600',
    fontSize: 13,
  },
  approveBtn: {
    backgroundColor: '#4B49AC',
  },
  approveText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },

  // Teacher Summary
  teacherSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  teacherSummaryBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  tsValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  tsLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});