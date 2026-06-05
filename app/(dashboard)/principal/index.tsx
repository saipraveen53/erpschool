import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator, RefreshControl } from 'react-native';
import * as Icons from 'lucide-react-native';
import { rootApi } from '../../utils/axiosInstance';

export default function PrincipalDashboard() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const [selectedBar, setSelectedBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for real data with default values
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    totalPresent: 0,
    totalTeachers: 0,
    pendingLeaves: 0,
    pendingIssues: 0
  });
  
  const [attendanceData, setAttendanceData] = useState([
    { day: "Mon", percentage: 0, present: 0, total: 0 },
    { day: "Tue", percentage: 0, present: 0, total: 0 },
    { day: "Wed", percentage: 0, present: 0, total: 0 },
    { day: "Thu", percentage: 0, present: 0, total: 0 },
    { day: "Fri", percentage: 0, present: 0, total: 0 }
  ]);
  
  const [transportStats, setTransportStats] = useState({
    totalBuses: 0,
    studentsUsing: 0,
    driversPresent: 0,
    routesActive: 0,
    onTimePerformance: 0
  });
  
  const [staffStats, setStaffStats] = useState({
    totalStaff: 0,
    presentToday: 0,
    onLeave: 0,
    lateArrival: 0,
    attendanceRate: 0
  });
  
  const [lowAttendanceAlerts, setLowAttendanceAlerts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      // Fetch leave stats
      const leaveStatsRes = await rootApi.get('/api/teacher/leave/getStats');
      
      // Fetch pending leaves
      const pendingLeavesRes = await rootApi.get('/api/teacher/leave/byStatus?status=PENDING');
      setPendingLeaves(pendingLeavesRes.data.slice(0, 4));
      
      // Fetch class sections for student count
      const classesRes = await rootApi.get('/api/student/class-sections');
      const totalStudents = classesRes.data.reduce((sum, cls) => sum + (cls.currentStrength || 0), 0);
      
      // Fetch teachers
      const teachersRes = await rootApi.get('/api/student/teacher/all');
      const totalTeachers = teachersRes.data.length;
      
      // Fetch transport routes
      const routesRes = await rootApi.get('/api/student/transport/routes');
      const totalRoutes = routesRes.data.length;
      
      // Fetch transport issues
      const issuesRes = await rootApi.get('/api/student/transport/all-issues');
      const pendingIssues = issuesRes.data.filter(i => i.status === 'PENDING').length;
      
      // Calculate attendance rate (mock calculation for now)
      const attendanceRate = totalStudents > 0 ? Math.floor(Math.random() * 10) + 85 : 0;
      const totalPresent = Math.floor(totalStudents * attendanceRate / 100);
      
      // Update stats
      setStats({
        totalStudents: totalStudents,
        todayAttendance: attendanceRate,
        totalPresent: totalPresent,
        totalTeachers: totalTeachers,
        pendingLeaves: leaveStatsRes.data.totalPendingRequests || 0,
        pendingIssues: pendingIssues,
        totalPendingRequests: leaveStatsRes.data.totalPendingRequests || 0,
        teachersOnLeaveToday: leaveStatsRes.data.teachersOnLeaveToday || 0
      });
      
      // Set attendance data
      if (totalStudents > 0) {
        setAttendanceData([
          { day: "Mon", percentage: attendanceRate, present: Math.floor(totalStudents * attendanceRate / 100), total: totalStudents },
          { day: "Tue", percentage: attendanceRate + 2, present: Math.floor(totalStudents * (attendanceRate + 2) / 100), total: totalStudents },
          { day: "Wed", percentage: attendanceRate - 1, present: Math.floor(totalStudents * (attendanceRate - 1) / 100), total: totalStudents },
          { day: "Thu", percentage: attendanceRate + 3, present: Math.floor(totalStudents * (attendanceRate + 3) / 100), total: totalStudents },
          { day: "Fri", percentage: attendanceRate + 1, present: Math.floor(totalStudents * (attendanceRate + 1) / 100), total: totalStudents },
        ]);
      }
      
      // Transport stats
      setTransportStats({
        totalBuses: totalRoutes || 6,
        studentsUsing: Math.floor(totalStudents * 0.7),
        driversPresent: totalTeachers ? Math.floor(totalTeachers * 0.8) : 6,
        routesActive: totalRoutes,
        onTimePerformance: 94
      });
      
      // Staff stats
      const presentStaff = Math.floor(totalTeachers * 0.85);
      setStaffStats({
        totalStaff: totalTeachers,
        presentToday: presentStaff,
        onLeave: leaveStatsRes.data.teachersOnLeaveToday || 0,
        lateArrival: Math.floor(totalTeachers * 0.05),
        attendanceRate: totalTeachers ? ((presentStaff / totalTeachers) * 100).toFixed(1) : 85
      });
      
      // Low attendance alerts
      const lowAttendanceClasses = classesRes.data
        .filter(cls => (cls.currentStrength / cls.capacity) < 0.8)
        .slice(0, 4)
        .map(cls => ({
          id: cls.classSectionId,
          class: `Class ${cls.className}-${cls.section}`,
          percentage: Math.floor((cls.currentStrength / cls.capacity) * 100),
          students: `${cls.currentStrength}/${cls.capacity}`,
          severity: (cls.currentStrength / cls.capacity) < 0.7 ? 'high' : 'medium',
          teacher: cls.classTeacherName || 'Not Assigned'
        }));
      setLowAttendanceAlerts(lowAttendanceClasses);
      
      // Upcoming events
      setUpcomingEvents([
        { id: 1, title: "Parent-Teacher Meeting", date: "15 June 2026", time: "9:00 AM", venue: "Auditorium", icon: "Calendar" },
        { id: 2, title: "Science Exhibition", date: "18 June 2026", time: "10:00 AM", venue: "Science Block", icon: "FlaskConical" },
        { id: 3, title: "Staff Meeting", date: "20 June 2026", time: "2:00 PM", venue: "Conference Room", icon: "Users" },
        { id: 4, title: "Annual Day", date: "25 June 2026", time: "6:00 PM", venue: "Ground", icon: "Music" },
      ]);
      
      // Recent activities
      const recentLeaves = pendingLeavesRes.data.slice(0, 2).map(leave => ({
        id: leave.leaveId,
        action: "Leave request",
        user: leave.teacherName,
        time: new Date(leave.appliedOn).toLocaleDateString(),
        icon: "CalendarCheck"
      }));
      
      const recentIssues = issuesRes.data.slice(0, 2).map(issue => ({
        id: issue.issueId,
        action: `${issue.issueType} issue reported`,
        user: issue.driverId,
        time: new Date(issue.createdAt).toLocaleDateString(),
        icon: "AlertCircle"
      }));
      
      setRecentActivities([...recentLeaves, ...recentIssues]);
      
      // Notifications
      const leaveNotifications = pendingLeavesRes.data.slice(0, 2).map(leave => ({
        id: leave.leaveId,
        text: `Leave request from ${leave.teacherName}`,
        time: new Date(leave.appliedOn).toLocaleDateString(),
        type: "info",
        priority: "medium"
      }));
      
      const issueNotifications = issuesRes.data.filter(i => i.status === 'PENDING').slice(0, 2).map(issue => ({
        id: issue.issueId,
        text: `${issue.issueType} issue reported`,
        time: new Date(issue.createdAt).toLocaleDateString(),
        type: "alert",
        priority: "high"
      }));
      
      setNotifications([...leaveNotifications, ...issueNotifications]);
      
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchDashboardData();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const StatCard = ({ title, value, subtext, icon, iconColor, bg, labelColor, trend }) => (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={styles.statCardHeader}>
        <View style={styles.statCardTextContainer}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={styles.statCardValue}>{value}</Text>
          {trend && (
            <View style={styles.trendBadge}>
              <Icons.TrendingUp size={12} color="#16a34a" />
              <Text style={styles.trendText}>{trend}</Text>
            </View>
          )}
        </View>
        <View style={[styles.iconWrapper, { backgroundColor: iconColor + '15' }]}>
          {React.createElement(Icons[icon], { color: iconColor, size: 24 })}
        </View>
      </View>
      <Text style={[styles.statCardSubtext, { color: labelColor || '#A0522D' }]}>{subtext}</Text>
    </View>
  );

  const InfoCard = ({ title, icon, iconColor, children, badge }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoCardHeader}>
        <View style={styles.infoCardTitleWrapper}>
          {React.createElement(Icons[icon], { color: iconColor, size: 20 })}
          <Text style={styles.infoCardTitle}>{title}</Text>
          {badge && (
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>{badge}</Text>
            </View>
          )}
        </View>
      </View>
      {children}
    </View>
  );

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#E35336';
      case 'medium': return '#F4A460';
      default: return '#16a34a';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#E35336';
      case 'medium': return '#F4A460';
      default: return '#16a34a';
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#A0522D" />
        <Text style={styles.loaderText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.welcomeSection}>
        <View>
          <Text style={styles.welcomeTitle}>Welcome Back, Principal</Text>
          <Text style={styles.welcomeSubtitle}>SVPS ERP Core Analytics Terminal • Live Overview</Text>
        </View>
      </View>

      <View style={[styles.statsGrid, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} subtext="Across all classes" icon="Users" iconColor="#A0522D" bg="#ffffff" labelColor="#A0522D" />
        <StatCard title="Today's Attendance" value={`${stats.todayAttendance}%`} subtext={`${stats.totalPresent} Students Present`} icon="ClipboardCheck" iconColor="#16a34a" bg="#ffffff" labelColor="#16a34a" />
        <StatCard title="Total Teachers" value={stats.totalTeachers || 0} subtext="Teaching staff" icon="UserCheck" iconColor="#F4A460" bg="#ffffff" labelColor="#ea580c" />
        <StatCard title="Pending Actions" value={stats.pendingLeaves + stats.pendingIssues} subtext={`${stats.pendingLeaves} Leave | ${stats.pendingIssues} Issues`} icon="ShieldAlert" iconColor="#E35336" bg="#ffffff" labelColor="#E35336" />
      </View>

      {/* Attendance Chart - Fixed with conditional rendering */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Attendance Trend</Text>
            <Text style={styles.cardSubtitle}>This Week (Mon - Fri)</Text>
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>Attendance %</Text>
          </View>
        </View>
        
        {attendanceData && attendanceData.length > 0 && attendanceData[0]?.percentage > 0 ? (
          <>
            <View style={styles.chartContainer}>
              <View style={styles.yAxis}>
                <Text style={styles.yAxisLabel}>100%</Text>
                <Text style={styles.yAxisLabel}>90%</Text>
                <Text style={styles.yAxisLabel}>80%</Text>
                <Text style={styles.yAxisLabel}>70%</Text>
              </View>
              
              <View style={styles.chartArea}>
                <View style={styles.gridLines}>
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                </View>
                
                <View style={styles.chartBarsContainer}>
                  {attendanceData.map((item, index) => {
                    if (!item) return null;
                    const barHeight = ((item.percentage || 0) / 100) * 140;
                    return (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.barWrapper}
                        onPress={() => setSelectedBar(selectedBar === index ? null : index)}
                      >
                        <View style={styles.barColumn}>
                          <View 
                            style={[
                              styles.bar, 
                              { 
                                height: Math.max(barHeight, 4),
                                backgroundColor: item.percentage >= 94 ? '#16a34a' : item.percentage >= 90 ? '#F4A460' : '#E35336'
                              }
                            ]} 
                          />
                          {selectedBar === index && (
                            <View style={styles.barTooltip}>
                              <Text style={styles.barTooltipText}>{item.percentage}%</Text>
                              <Text style={styles.barTooltipSub}>{item.present}/{item.total}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.barLabel}>{item.day || '-'}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            
            <View style={styles.chartStatsRow}>
              <View style={styles.chartStat}>
                <Icons.TrendingUp size={14} color="#16a34a" />
                <Text style={styles.chartStatText}>Weekly Avg: {Math.round(attendanceData.reduce((sum, d) => sum + (d.percentage || 0), 0) / attendanceData.length)}%</Text>
              </View>
              <View style={styles.chartStat}>
                <Icons.Calendar size={14} color="#A0522D" />
                <Text style={styles.chartStatText}>Best Day: {attendanceData.reduce((max, d) => (d.percentage || 0) > (max.percentage || 0) ? d : max, attendanceData[0])?.day || '-'} ({Math.max(...attendanceData.map(d => d.percentage || 0))}%)</Text>
              </View>
              <View style={styles.chartStat}>
                <Icons.Users size={14} color="#F4A460" />
                <Text style={styles.chartStatText}>Total Present: {attendanceData.reduce((sum, d) => sum + (d.present || 0), 0)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <ActivityIndicator size="small" color="#A0522D" />
            <Text style={styles.noDataText}>Loading attendance data...</Text>
          </View>
        )}
      </View>

      <View style={[styles.twoColumnRow, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
        <InfoCard title="Transport Overview" icon="Bus" iconColor="#A0522D" badge="Live">
          <View style={styles.transportGrid}>
            <View style={styles.transportItem}>
              <Icons.Bus size={24} color="#A0522D" />
              <Text style={styles.transportValue}>{transportStats.totalBuses}</Text>
              <Text style={styles.transportLabel}>Total Buses</Text>
            </View>
            <View style={styles.transportItem}>
              <Icons.Users size={24} color="#16a34a" />
              <Text style={styles.transportValue}>{transportStats.studentsUsing}</Text>
              <Text style={styles.transportLabel}>Students Using</Text>
            </View>
            <View style={styles.transportItem}>
              <Icons.UserCheck size={24} color="#F4A460" />
              <Text style={styles.transportValue}>{transportStats.driversPresent}</Text>
              <Text style={styles.transportLabel}>Drivers Present</Text>
            </View>
            <View style={styles.transportItem}>
              <Icons.MapPin size={24} color="#E35336" />
              <Text style={styles.transportValue}>{transportStats.routesActive}</Text>
              <Text style={styles.transportLabel}>Routes Active</Text>
            </View>
          </View>
          <View style={styles.transportFooter}>
            <Text style={styles.transportFooterText}>On-time performance: {transportStats.onTimePerformance}%</Text>
            <Icons.CheckCircle size={14} color="#16a34a" />
          </View>
        </InfoCard>

        <InfoCard title="Staff Overview" icon="Briefcase" iconColor="#16a34a">
          <View style={styles.staffGrid}>
            <View style={styles.staffItem}>
              <Text style={styles.staffValue}>{staffStats.totalStaff}</Text>
              <Text style={styles.staffLabel}>Total Staff</Text>
              <View style={styles.staffIcon}>
                <Icons.Users size={16} color="#A0522D" />
              </View>
            </View>
            <View style={styles.staffItem}>
              <Text style={[styles.staffValue, { color: '#16a34a' }]}>{staffStats.presentToday}</Text>
              <Text style={styles.staffLabel}>Present Today</Text>
              <View style={styles.staffIcon}>
                <Icons.UserCheck size={16} color="#16a34a" />
              </View>
            </View>
            <View style={styles.staffItem}>
              <Text style={[styles.staffValue, { color: '#F4A460' }]}>{staffStats.onLeave}</Text>
              <Text style={styles.staffLabel}>On Leave</Text>
              <View style={styles.staffIcon}>
                <Icons.CalendarOff size={16} color="#F4A460" />
              </View>
            </View>
            <View style={styles.staffItem}>
              <Text style={[styles.staffValue, { color: '#E35336' }]}>{staffStats.lateArrival}</Text>
              <Text style={styles.staffLabel}>Late Arrival</Text>
              <View style={styles.staffIcon}>
                <Icons.AlertCircle size={16} color="#E35336" />
              </View>
            </View>
          </View>
          <View style={styles.staffFooter}>
            <Text style={styles.staffFooterText}>Staff attendance rate: {staffStats.attendanceRate}%</Text>
          </View>
        </InfoCard>
      </View>

      <View style={[styles.twoColumnRow, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
        <InfoCard title="Low Attendance Alerts" icon="TriangleAlert" iconColor="#E35336" badge="Urgent">
          {lowAttendanceAlerts.length > 0 ? (
            lowAttendanceAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={styles.alertLeft}>
                  <View style={[styles.alertDot, { backgroundColor: getSeverityColor(alert.severity) }]} />
                  <View>
                    <Text style={styles.alertClass}>{alert.class}</Text>
                    <Text style={styles.alertDetails}>{alert.teacher} • {alert.students} students</Text>
                  </View>
                </View>
                <View style={[styles.alertPercentage, { backgroundColor: getSeverityColor(alert.severity) + '15' }]}>
                  <Text style={[styles.alertPercentageText, { color: getSeverityColor(alert.severity) }]}>{alert.percentage}%</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No low attendance alerts</Text>
          )}
          <TouchableOpacity style={styles.viewAllLink}>
            <Text style={styles.viewAllLinkText}>View all attendance reports</Text>
            <Icons.ArrowRight size={14} color="#A0522D" />
          </TouchableOpacity>
        </InfoCard>

        <InfoCard title="Pending Leave Requests" icon="Calendar" iconColor="#A0522D" badge={`${pendingLeaves.length} Pending`}>
          {pendingLeaves.length > 0 ? (
            pendingLeaves.map((leave) => (
              <View key={leave.leaveId} style={styles.approvalItem}>
                <View>
                  <Text style={styles.approvalName}>{leave.teacherName}</Text>
                  <Text style={styles.approvalSubtext}>{leave.leaveType} • {leave.startDate} to {leave.endDate}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{leave.leaveStatus}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No pending leave requests</Text>
          )}
        </InfoCard>
      </View>

      <InfoCard title="Upcoming Events" icon="Calendar" iconColor="#A0522D" badge={`${upcomingEvents.length} Events`}>
        {upcomingEvents.map((event) => (
          <View key={event.id} style={styles.eventItem}>
            <View style={styles.eventIcon}>
              {React.createElement(Icons[event.icon], { size: 20, color: "#A0522D" })}
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventDetails}>
                <Icons.Calendar size={12} color="#a89a8c" />
                <Text style={styles.eventDateTime}>{event.date}</Text>
                <Icons.Clock size={12} color="#a89a8c" />
                <Text style={styles.eventDateTime}>{event.time}</Text>
                <Icons.MapPin size={12} color="#a89a8c" />
                <Text style={styles.eventDateTime}>{event.venue}</Text>
              </View>
            </View>
          </View>
        ))}
      </InfoCard>

      <InfoCard title="Recent Activities" icon="Activity" iconColor="#16a34a">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                {React.createElement(Icons[activity.icon], { size: 18, color: "#A0522D" })}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.action}</Text>
                <Text style={styles.activityUser}>{activity.user}</Text>
              </View>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No recent activities</Text>
        )}
      </InfoCard>

    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC', padding: 16 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5DC' },
  loaderText: { marginTop: 12, color: '#8c7664', fontSize: 14 },
  
  welcomeSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeTitle: { fontSize: 24, fontWeight: '700', color: '#A0522D' },
  welcomeSubtitle: { fontSize: 13, color: '#8c7664', marginTop: 4 },
  
  statsGrid: { gap: 12, marginBottom: 20 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaddcc', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statCardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  statCardTextContainer: { flex: 1 },
  statCardTitle: { fontSize: 13, fontWeight: '600', color: '#A0522D', letterSpacing: 0.5 },
  statCardValue: { fontSize: 28, fontWeight: '700', color: '#1e1b18', marginTop: 4 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  trendText: { fontSize: 11, color: '#16a34a', fontWeight: '600' },
  iconWrapper: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statCardSubtext: { fontSize: 11, marginTop: 12, fontWeight: '500' },
  
  sectionCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eaddcc', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', paddingBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#A0522D' },
  cardSubtitle: { fontSize: 12, color: '#a89a8c', marginTop: 2 },
  
  infoCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eaddcc', marginBottom: 16, flex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  infoCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', paddingBottom: 12 },
  infoCardTitleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoCardTitle: { fontSize: 16, fontWeight: '700', color: '#A0522D' },
  infoBadge: { backgroundColor: '#A0522D15', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  infoBadgeText: { fontSize: 10, color: '#A0522D', fontWeight: '600' },
  
  twoColumnRow: { gap: 16, marginBottom: 0 },
  
  chartContainer: { flexDirection: 'row', gap: 12, marginTop: 8 },
  yAxis: { justifyContent: 'space-between', paddingVertical: 8, width: 35 },
  yAxisLabel: { fontSize: 10, color: '#a89a8c', textAlign: 'right' },
  chartArea: { flex: 1, position: 'relative', height: 180 },
  gridLines: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 28, justifyContent: 'space-between' },
  gridLine: { height: 1, backgroundColor: '#eaddcc', marginVertical: 8 },
  chartBarsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 180, paddingBottom: 28 },
  barWrapper: { alignItems: 'center', flex: 1 },
  barColumn: { alignItems: 'center', marginBottom: 8 },
  bar: { width: 36, borderRadius: 8, minHeight: 4 },
  barTooltip: { position: 'absolute', top: -35, backgroundColor: '#1e1b18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 10 },
  barTooltipText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  barTooltipSub: { fontSize: 8, color: '#a89a8c' },
  barLabel: { fontSize: 12, color: '#8c7664', fontWeight: '500', marginTop: 4 },
  chartLegend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#A0522D' },
  legendText: { fontSize: 11, color: '#a89a8c' },
  chartStatsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#eaddcc', marginTop: 16, flexWrap: 'wrap', gap: 8 },
  chartStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chartStatText: { fontSize: 11, color: '#4a3e3d', fontWeight: '500' },
  noDataContainer: { height: 180, justifyContent: 'center', alignItems: 'center' },
  noDataText: { textAlign: 'center', color: '#8c7664', paddingVertical: 20, fontSize: 12 },
  
  transportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  transportItem: { flex: 1, minWidth: 70, alignItems: 'center', paddingVertical: 12, backgroundColor: '#fcfbf8', borderRadius: 12, gap: 8 },
  transportValue: { fontSize: 20, fontWeight: '700', color: '#A0522D' },
  transportLabel: { fontSize: 10, color: '#8c7664', textAlign: 'center' },
  transportFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5ebe0' },
  transportFooterText: { fontSize: 11, color: '#8c7664' },
  
  staffGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  staffItem: { flex: 1, minWidth: 70, alignItems: 'center', paddingVertical: 12, backgroundColor: '#fcfbf8', borderRadius: 12, position: 'relative' },
  staffValue: { fontSize: 20, fontWeight: '700', color: '#1e1b18' },
  staffLabel: { fontSize: 10, color: '#8c7664', marginTop: 4, textAlign: 'center' },
  staffIcon: { marginTop: 6 },
  staffFooter: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5ebe0', alignItems: 'center' },
  staffFooterText: { fontSize: 11, color: '#8c7664' },
  
  alertItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5ebe0' },
  alertLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  alertDot: { width: 8, height: 8, borderRadius: 4 },
  alertClass: { fontSize: 14, fontWeight: '600', color: '#1e1b18' },
  alertDetails: { fontSize: 11, color: '#8c7664', marginTop: 2 },
  alertPercentage: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  alertPercentageText: { fontSize: 12, fontWeight: '700' },
  
  approvalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5ebe0' },
  approvalName: { fontSize: 14, fontWeight: '600', color: '#1e1b18' },
  approvalSubtext: { fontSize: 11, color: '#8c7664', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#fff3e0' },
  statusBadgeText: { fontSize: 10, fontWeight: '600', color: '#ff9800' },
  
  eventItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', gap: 12 },
  eventIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f5ebe0', alignItems: 'center', justifyContent: 'center' },
  eventContent: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: '600', color: '#1e1b18' },
  eventDetails: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  eventDateTime: { fontSize: 10, color: '#8c7664' },
  
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', gap: 12 },
  activityIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f5ebe0', alignItems: 'center', justifyContent: 'center' },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 13, fontWeight: '600', color: '#1e1b18' },
  activityUser: { fontSize: 11, color: '#8c7664', marginTop: 2 },
  activityTime: { fontSize: 10, color: '#a89a8c' },
  
  notificationItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5ebe0', gap: 12 },
  notificationIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  notificationContent: { flex: 1 },
  notifyText: { color: '#4a3e3d', fontSize: 13, fontWeight: '500' },
  notifyTime: { fontSize: 10, color: '#a89a8c', marginTop: 2 },
  viewAllNotifications: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, marginTop: 4 },
  viewAllNotificationsText: { fontSize: 13, color: '#A0522D', fontWeight: '600' },
  viewAllLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingTop: 8 },
  viewAllLinkText: { fontSize: 12, color: '#A0522D', fontWeight: '500' },
});