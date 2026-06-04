import {
  BarChart2,
  BookCheck,
  BookOpen,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  Search,
  Star,
  TrendingUp,
  Users
} from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';

export default function AcademicMonitoring() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  // --- ANIMATIONS ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(progressAnim, { toValue: 1, duration: 1200, useNativeDriver: false })
    ]).start();
  }, []);

  // --- DUMMY DATA ---
  const overviewStats = [
    { title: 'Total Classes', value: '45', icon: Users, color: '#4B49AC', bgColor: 'rgba(75, 73, 172, 0.1)' },
    { title: 'Total Subjects', value: '24', icon: BookOpen, color: '#7DA0FA', bgColor: 'rgba(125, 160, 250, 0.1)' },
    { title: 'Total Teachers', value: '112', icon: GraduationCap, color: '#7978E9', bgColor: 'rgba(121, 120, 233, 0.1)' },
    { title: 'Syllabus Comp.', value: '68%', icon: BookCheck, color: '#F3797E', bgColor: 'rgba(243, 121, 126, 0.1)' }, // Shortened Title
  ];

  const syllabusData = [
    { id: 1, class: 'Grade 10', subject: 'Mathematics', teacher: 'Mr. Rajesh', progress: 85, status: 'On Track', statusColor: '#57B657' },
    { id: 2, class: 'Grade 9-A', subject: 'Science', teacher: 'Mrs. Kavita', progress: 60, status: 'Lagging', statusColor: '#F3797E' },
    { id: 3, class: 'Grade 12-B', subject: 'Physics', teacher: 'Dr. Sharma', progress: 92, status: 'Ahead', statusColor: '#7DA0FA' },
    { id: 4, class: 'Grade 8-C', subject: 'English', teacher: 'Ms. Priya', progress: 75, status: 'On Track', statusColor: '#57B657' },
  ];

  const teacherPerformance = [
    { id: 1, name: 'Mrs. Kavita (Science)', classes: 42, plans: '100%', feedback: 4.8 },
    { id: 2, name: 'Mr. Rajesh (Maths)', classes: 38, plans: '90%', feedback: 4.5 },
    { id: 3, name: 'Dr. Sharma (Physics)', classes: 45, plans: '100%', feedback: 4.9 },
  ];

  const homeworkStats = {
    given: '1,240',
    pending: '85',
    submissionRate: '93.5%',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* Header Section */}
      <View style={[styles.header, !isDesktop && styles.headerMobile]}>
        <View style={!isDesktop ? { width: '100%' } : {}}>
          <Text style={styles.title}>Academic Monitoring</Text>
          <Text style={styles.subtitle}>Track class progression, syllabus, and performance.</Text>
        </View>
        <View style={[styles.searchContainer, !isDesktop && styles.searchContainerMobile]}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            style={[styles.searchInput, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
            placeholder="Search class or subject"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        
        {/* Overview Cards */}
        <View style={styles.overviewGrid}>
          {overviewStats.map((stat, index) => (
            <View 
              key={index} 
              style={[
                styles.statCard, 
                isDesktop ? { flex: 1 } : { width: '47%' } // Changed logic for robust wrapping
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
        <View style={[styles.mainLayout, !isDesktop && styles.mainLayoutMobile]}>
          
          {/* Left Column */}
          <View style={styles.columnLeft}>
            
            {/* Syllabus Tracking */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Syllabus Tracking</Text>
                <TouchableOpacity><Text style={styles.viewAllText}>View Detailed</Text></TouchableOpacity>
              </View>
              
              <View style={styles.listContainer}>
                {syllabusData.map((item) => (
                  <View key={item.id} style={styles.syllabusItem}>
                    <View style={styles.syllabusHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.syllClass}>{item.class} • <Text style={styles.syllSubject}>{item.subject}</Text></Text>
                        <Text style={styles.syllTeacher}>{item.teacher}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '15' }]}>
                        <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.progressRow}>
                      <View style={styles.progressBarBg}>
                        <Animated.View 
                          style={[
                            styles.progressBarFill, 
                            { 
                              backgroundColor: item.statusColor,
                              width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', `${item.progress}%`]
                              }) 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>{item.progress}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Academic Performance Summary */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Performance Summary</Text>
                <TrendingUp size={20} color="#4B49AC" />
              </View>
              
              <View style={styles.performanceGrid}>
                <View style={[styles.perfBox, { backgroundColor: 'rgba(125, 160, 250, 0.1)' }]}>
                  <Text style={styles.perfLabel}>Overall Pass %</Text>
                  <Text style={[styles.perfValue, { color: '#7DA0FA' }]}>88.4%</Text>
                </View>
                <View style={[styles.perfBox, { backgroundColor: 'rgba(75, 73, 172, 0.1)' }]}>
                  <Text style={styles.perfLabel}>Top Class</Text>
                  <Text style={[styles.perfValue, { color: '#4B49AC' }]}>Grade 10-A</Text>
                </View>
                <View style={[styles.perfBox, { backgroundColor: 'rgba(243, 121, 126, 0.1)' }]}>
                  <Text style={styles.perfLabel}>Needs Attention</Text>
                  <Text style={[styles.perfValue, { color: '#F3797E' }]}>Grade 9-C</Text>
                </View>
              </View>

              <Text style={styles.subHeading}>Subject-wise Pass Percentage</Text>
              <View style={styles.subjectBars}>
                <View style={styles.subjRow}><Text style={styles.subjName}>Mathematics</Text><Text style={styles.subjScore}>92%</Text></View>
                <View style={styles.subjRow}><Text style={styles.subjName}>Science</Text><Text style={styles.subjScore}>85%</Text></View>
                <View style={styles.subjRow}><Text style={styles.subjName}>English</Text><Text style={styles.subjScore}>96%</Text></View>
              </View>
            </View>

          </View>

          {/* Right Column */}
          <View style={styles.columnRight}>
            
            {/* Homework & Assignments */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Homework & Assignments</Text>
                <ClipboardList size={20} color="#F3797E" />
              </View>
              
              <View style={styles.hwStatsContainer}>
                <View style={styles.hwStatItem}>
                  <Text style={styles.hwStatValue}>{homeworkStats.given}</Text>
                  <Text style={styles.hwStatLabel}>Given (This Month)</Text>
                </View>
                <View style={styles.hwDivider} />
                <View style={styles.hwStatItem}>
                  <Text style={[styles.hwStatValue, { color: '#F3797E' }]}>{homeworkStats.pending}</Text>
                  <Text style={styles.hwStatLabel}>Pending Eval</Text>
                </View>
                <View style={styles.hwDivider} />
                <View style={styles.hwStatItem}>
                  <Text style={[styles.hwStatValue, { color: '#57B657' }]}>{homeworkStats.submissionRate}</Text>
                  <Text style={styles.hwStatLabel}>Submission Rate</Text>
                </View>
              </View>
            </View>

            {/* Teacher Performance */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Teacher Performance</Text>
                <Star size={20} color="#FFC100" />
              </View>
              
              <View style={styles.teacherList}>
                {teacherPerformance.map((teacher) => (
                  <View key={teacher.id} style={styles.teacherItem}>
                    <View style={styles.teacherAvatar}>
                      <Text style={styles.teacherInitial}>{teacher.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.teacherInfo}>
                      <Text style={styles.teacherName}>{teacher.name}</Text>
                      <View style={styles.teacherMetrics}>
                        <Text style={styles.metricText}>Classes: <Text style={{fontWeight: '700', color: '#1E293B'}}>{teacher.classes}</Text></Text>
                        <Text style={styles.metricText}>Plans: <Text style={{fontWeight: '700', color: '#1E293B'}}>{teacher.plans}</Text></Text>
                      </View>
                    </View>
                    <View style={styles.ratingBadge}>
                      <Star size={12} color="#FFF" fill="#FFF" />
                      <Text style={styles.ratingText}>{teacher.feedback}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Reports & Actions */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Academic Reports</Text>
                <BarChart2 size={20} color="#7978E9" />
              </View>
              
              <View style={styles.reportsContainer}>
                <Pressable style={styles.reportBtn}>
                  <View style={styles.reportBtnLeft}>
                    <FileText size={18} color="#4B49AC" />
                    <Text style={styles.reportBtnText}>Progress Report</Text>
                  </View>
                  <Download size={18} color="#9CA3AF" />
                </Pressable>
                
                <Pressable style={styles.reportBtn}>
                  <View style={styles.reportBtnLeft}>
                    <BookCheck size={18} color="#7DA0FA" />
                    <Text style={styles.reportBtnText}>Syllabus Report</Text>
                  </View>
                  <Download size={18} color="#9CA3AF" />
                </Pressable>
              </View>
            </View>

          </View>
        </View>

      </Animated.View>
      <View style={{ height: 60 }} />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 42,
    width: 250,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchContainerMobile: {
    width: '100%', // Makes search bar full width on mobile
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#4B49AC',
  },

  // Overview Cards
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // Consistent gap
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
    minWidth: 150, // Prevents collapsing too much on very small screens
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

  // General Card Styles
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
  viewAllText: {
    fontSize: 13,
    color: '#7DA0FA',
    fontWeight: '700',
  },

  // Syllabus Tracking
  listContainer: {
    gap: 16,
  },
  syllabusItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 16,
  },
  syllabusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  syllClass: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flexWrap: 'wrap',
  },
  syllSubject: {
    color: '#4B49AC',
  },
  syllTeacher: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    width: 35,
    textAlign: 'right',
  },

  // Academic Performance Summary
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Better wrap for mobile
    gap: 12,
    marginBottom: 24,
  },
  perfBox: {
    flex: 1,
    minWidth: 100, // Important for wrapping nicely on small screens
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  perfLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  perfValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  subjectBars: {
    gap: 12,
  },
  subjRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  subjName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B49AC',
  },
  subjScore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },

  // Homework & Assignments
  hwStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  hwStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  hwStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4B49AC',
    marginBottom: 4,
  },
  hwStatLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  hwDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },

  // Teacher Performance
  teacherList: {
    gap: 16,
  },
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  teacherAvatar: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(121, 120, 233, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teacherInitial: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7978E9',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  teacherMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metricText: {
    fontSize: 12,
    color: '#64748B',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC100',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Reports
  reportsContainer: {
    gap: 12,
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
});