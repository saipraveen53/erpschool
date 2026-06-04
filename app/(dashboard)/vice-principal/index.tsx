import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  FileText,
  Megaphone,
  Send,
  UserCheck,
  X
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';

export default function VicePrincipalDashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  // --- ANIMATIONS ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  // --- MODAL & DROPDOWN STATES ---
  const [modalVisible, setModalVisible] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeType, setNoticeType] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today (3 Jun 2026)');

  useEffect(() => {
    // Fade in whole dashboard
    Animated.timing(fadeAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();

    // Spring animation for Graphs (height transition)
    Animated.spring(barAnim, { 
      toValue: 1, 
      friction: 6,
      tension: 40,
      useNativeDriver: false 
    }).start();
  }, []);

  const handleCreateNotice = () => {
    if (!noticeTitle || !noticeDesc) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    Alert.alert('Success', 'Notice created successfully!');
    setModalVisible(false);
    setNoticeTitle('');
    setNoticeType('');
    setNoticeDesc('');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  // Quick Actions Routes mapping
  const quickActions = [
    { title: 'Verify Attendance', icon: UserCheck, color: '#7DA0FA', route: '/(dashboard)/vice-principal/attendance/verification' },
    { title: 'Monitor Academics', icon: BookOpen, color: '#4B49AC', route: '/(dashboard)/vice-principal/academics/monitoring' },
    { title: 'Discipline Log', icon: AlertTriangle, color: '#F3797E', route: '/(dashboard)/vice-principal/discipline' },
    { title: 'Exam Supervision', icon: FileText, color: '#7978E9', route: '/(dashboard)/vice-principal/examinations/supervision' },
  ];

  // Bar Chart Data (Attendance)
  const barChartData = [
    { label: 'Mon', present: 80, absent: 30 },
    { label: 'Tue', present: 60, absent: 40 },
    { label: 'Wed', present: 50, absent: 50 },
    { label: 'Thu', present: 90, absent: 20 },
    { label: 'Fri', present: 70, absent: 40 },
    { label: 'Sat', present: 40, absent: 20 },
  ];

  // Extra Notices Data
  const noticeDataList = [
    { id: '1', type: 'STAFF', title: 'Submit Lesson Plans by Friday', date: 'Today', color: '#4B49AC', bgColor: 'rgba(75, 73, 172, 0.1)' },
    { id: '2', type: 'URGENT', title: 'Heavy Rain Alert - Campus Closed', date: 'Yesterday', color: '#F3797E', bgColor: 'rgba(243, 121, 126, 0.1)' },
    { id: '3', type: 'EXAM', title: 'Mid-Term Timetable Published', date: '2 Days ago', color: '#7DA0FA', bgColor: 'rgba(125, 160, 250, 0.1)' },
    { id: '4', type: 'EVENT', title: 'Annual Science Fair Registration', date: '3 Days ago', color: '#7978E9', bgColor: 'rgba(121, 120, 233, 0.1)' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* Header Section */}
      <View style={[styles.header, !isDesktop && styles.headerMobile]}>
        <View>
          <Text style={styles.greeting}>Welcome Aamir</Text>
          <Text style={styles.subGreeting}>All systems are running smoothly! You have <Text style={{color: '#4B49AC', fontWeight: 'bold'}}>3 unread alerts!</Text></Text>
        </View>
        
        {/* Date Dropdown Setup */}
        <View style={{ position: 'relative', zIndex: 100 }}>
          <TouchableOpacity 
            style={styles.dateDropdown}
            onPress={() => setShowDatePicker(!showDatePicker)}
            activeOpacity={0.8}
          >
            <Text style={styles.dateText}>{selectedDate}</Text>
            <ChevronDown size={16} color="#64748B" />
          </TouchableOpacity>

          {showDatePicker && (
            <View style={styles.dropdownMenu}>
              {['Today (3 Jun 2026)', 'Yesterday', 'Last 7 Days', 'This Month'].map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.dropdownMenuItem}
                  onPress={() => handleDateSelect(item)}
                >
                  <Text style={[styles.dropdownMenuItemText, selectedDate === item && { color: '#4B49AC', fontWeight: '700' }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <Animated.View style={{ opacity: fadeAnim, zIndex: 1 }}>
        {/* Top Section: Big Image + 4 Stats */}
        <View style={[styles.topRow, !isDesktop && styles.topRowMobile]}>
          
          {/* Large Illustration Card */}
          <View style={[styles.bigCard, isDesktop ? { flex: 1.2 } : { width: '100%', height: 250 }]}>
            <ImageBackground 
              source={{ uri: 'https://img.freepik.com/free-vector/children-going-school-concept-illustration_114360-5456.jpg?w=800' }} 
              style={styles.bigCardImage}
              imageStyle={{ borderRadius: 16, opacity: 0.15 }} // Reduced opacity so the Skydash blue blends well
            >
              <View style={styles.bigCardOverlay}>
                <Text style={styles.bigCardTemp}>32°c <Text style={styles.bigCardCity}>Hyderabad{'\n'}Telangana</Text></Text>
                <Text style={styles.bigCardTitle}>Campus Overview</Text>
                <Text style={styles.bigCardSub}>Active learning in progress</Text>
              </View>
            </ImageBackground>
          </View>

          {/* 4 Colored Stat Cards */}
          <View style={[styles.statsGrid, isDesktop ? { flex: 1 } : { width: '100%' }]}>
            <View style={[styles.colorCard, { backgroundColor: '#7DA0FA' }]}>
              <Text style={styles.ccTitle}>Total Students</Text>
              <Text style={styles.ccValue}>2,450</Text>
              <Text style={styles.ccSub}>+10.00% (30 days)</Text>
            </View>
            <View style={[styles.colorCard, { backgroundColor: '#4B49AC' }]}>
              <Text style={styles.ccTitle}>Total Teachers</Text>
              <Text style={styles.ccValue}>112</Text>
              <Text style={styles.ccSub}>Stable</Text>
            </View>
            <View style={[styles.colorCard, { backgroundColor: '#7978E9' }]}>
              <Text style={styles.ccTitle}>Today's Attendance</Text>
              <Text style={styles.ccValue}>92%</Text>
              <Text style={styles.ccSub}>+2.00% (30 days)</Text>
            </View>
            <View style={[styles.colorCard, { backgroundColor: '#F3797E' }]}>
              <Text style={styles.ccTitle}>Absent / Late</Text>
              <Text style={styles.ccValue}>196</Text>
              <Text style={styles.ccSub}>-0.22% (30 days)</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions (Navigates to actual pages) */}
        <Text style={styles.sectionHeading}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionBtn}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                <action.icon size={22} color={action.color} />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Section: Charts */}
        <View style={[styles.bottomRow, !isDesktop && styles.bottomRowMobile]}>
          
          {/* Order Details equivalent -> Academic Details */}
          <View style={styles.chartCard}>
            <Text style={styles.cardMainTitle}>Academic Details</Text>
            <Text style={styles.cardDesc}>The total academic progression within the active term. Shows syllabus coverage and pass percentages.</Text>
            
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.srLabel}>Avg Score</Text>
                <Text style={styles.srValue}>82.3%</Text>
              </View>
              <View>
                <Text style={styles.srLabel}>Tests Conducted</Text>
                <Text style={styles.srValue}>45</Text>
              </View>
              <View>
                <Text style={styles.srLabel}>Syllabus</Text>
                <Text style={styles.srValue}>71.56%</Text>
              </View>
            </View>

            <Text style={styles.srLabel}>Top Performers</Text>
            <Text style={styles.srValueBlue}>Class 10-A</Text>

            {/* Fake Line Chart Animation */}
            <View style={styles.fakeLineChart}>
               <Animated.View style={[styles.lineGraphBar, { height: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '40%'] }) }]} />
               <Animated.View style={[styles.lineGraphBar, { height: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '80%'] }) }]} />
               <Animated.View style={[styles.lineGraphBar, { height: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '30%'] }) }]} />
               <Animated.View style={[styles.lineGraphBar, { height: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), backgroundColor: '#F3797E' }]} />
            </View>
          </View>

          {/* Sales Report equivalent -> Attendance Report */}
          <View style={styles.chartCard}>
            <View style={styles.cardHeaderFlex}>
              <Text style={styles.cardMainTitle}>Attendance Report</Text>
              <Text style={styles.viewAllText}>View all</Text>
            </View>
            <Text style={styles.cardDesc}>The total number of present vs absent students over the last week.</Text>
            
            <View style={styles.legendRow}>
              <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#7DA0FA'}]} /><Text style={styles.legendText}>Present</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#4B49AC'}]} /><Text style={styles.legendText}>Absent / Late</Text></View>
            </View>

            {/* Animated Bar Chart */}
            <View style={styles.barChartContainer}>
              {barChartData.map((data, idx) => (
                <View key={idx} style={styles.barGroup}>
                  <View style={styles.bars}>
                    <Animated.View style={[styles.chartBar, { backgroundColor: '#7DA0FA', height: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${data.present}%`] }) }]} />
                    <Animated.View style={[styles.chartBar, { backgroundColor: '#4B49AC', height: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${data.absent}%`] }) }]} />
                  </View>
                  <Text style={styles.barLabelX}>{data.label}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>

        {/* Notice Board Area with Create Notice Button */}
        <View style={styles.noticeBoardWrapper}>
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
             <Text style={styles.sectionHeading}>Campus Notice Board</Text>
             <TouchableOpacity 
               style={styles.createNoticeBtn}
               onPress={() => setModalVisible(true)}
             >
               <Megaphone size={16} color="#FFF" />
               <Text style={styles.createNoticeText}>Create Notice</Text>
             </TouchableOpacity>
           </View>
           
           <View style={styles.noticeCard}>
             {noticeDataList.map((notice) => (
               <View key={notice.id} style={styles.noticeRow}>
                 <View style={[styles.noticeType, {backgroundColor: notice.bgColor}]}>
                   <Text style={{color: notice.color, fontSize: 11, fontWeight: '800', letterSpacing: 0.5}}>{notice.type}</Text>
                 </View>
                 <Text style={styles.noticeTextTitle}>{notice.title}</Text>
                 <Text style={styles.noticeDate}>{notice.date}</Text>
               </View>
             ))}
           </View>
        </View>

      </Animated.View>

      {/* --- CREATE NOTICE MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Notice</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>
            
            <Text style={styles.inputLabel}>Notice Title</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., Annual Sports Day" 
              placeholderTextColor="#9CA3AF"
              value={noticeTitle}
              onChangeText={setNoticeTitle}
            />

            <Text style={styles.inputLabel}>Audience / Type</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., Students, Staff, Parents" 
              placeholderTextColor="#9CA3AF"
              value={noticeType}
              onChangeText={setNoticeType}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Type the announcement here..." 
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={noticeDesc}
              onChangeText={setNoticeDesc}
            />

            <TouchableOpacity style={styles.submitModalBtn} onPress={handleCreateNotice}>
              <Send size={18} color="#FFF" style={{marginRight: 8}}/>
              <Text style={styles.submitModalText}>Publish Notice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 100, // Important for dropdown
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748B',
  },
  
  // Date Dropdown Styles
  dateDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  dateText: {
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
    width: 180,
    zIndex: 1000,
  },
  dropdownMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },

  // Top Row (Image + Stats)
  topRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  topRowMobile: {
    flexDirection: 'column',
  },
  bigCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#98BDFF',
  },
  bigCardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  bigCardOverlay: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  bigCardTemp: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigCardCity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B49AC',
  },
  bigCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4B49AC',
  },
  bigCardSub: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    marginTop: 4,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  colorCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  ccTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  ccValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  ccSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '500',
  },

  // Quick Actions
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
    marginTop: 10,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexGrow: 1,
    minWidth: 150,
  },
  actionIcon: {
    width: 44, height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },

  // Bottom Row (Charts)
  bottomRow: {
    flexDirection: 'row',
    gap: 20,
  },
  bottomRowMobile: {
    flexDirection: 'column',
  },
  chartCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4B49AC',
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  srLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '600',
  },
  srValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4B49AC',
  },
  srValueBlue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#7DA0FA',
    marginBottom: 10,
  },

  // Fake Line Chart styling
  fakeLineChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    marginTop: 20,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lineGraphBar: {
    flex: 1,
    backgroundColor: '#7DA0FA',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    opacity: 0.6,
  },

  // Bar Chart Styling
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
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
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  barGroup: {
    alignItems: 'center',
    width: 35,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    gap: 2,
    width: '100%',
  },
  chartBar: {
    flex: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabelX: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
    fontWeight: '600',
  },

  // Notice Board
  noticeBoardWrapper: {
    marginTop: 32,
  },
  createNoticeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B49AC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createNoticeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  noticeType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 16,
    width: 75,
    alignItems: 'center',
  },
  noticeTextTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  noticeDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 10,
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
    color: '#4B49AC',
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitModalBtn: {
    flexDirection: 'row',
    backgroundColor: '#F3797E',
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