import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import PublicFooter from '../components/common/PublicFooter';
import PublicNavbar from '../components/common/PublicNavbar';

import {
  Award,
  BookOpen,
  Building,
  Bus,
  GraduationCap,
  Heart,
  Library,
  Phone,
  Rocket,
  ShieldAlert,
  Users,
  Wrench
} from 'lucide-react-native';

const isWeb = Platform.OS === 'web';

// Restored Original Website Theme Colors
const COLORS = {
  bgWhite: '#FFFFFF',      
  darkBg: '#2A1308',       // Deep Brown
  cardDark: '#3E1F0D',     // Slightly lighter brown for cards
  cardLight: '#FFFCF8',    // Soft off-white for cards on white bg
  accent: '#F4A460',       // Sandy Orange
  primary: '#E35336',      // Terracotta
  textSecondary: '#A0522D',// Sienna
  textPrimary: '#5C2E14',  // Dark Brown
  white: '#FFFFFF',
};

// User Roles Data with Access Information
const rolesData = [
  { 
    id: '1', title: 'Super Admin', 
    access: 'Full system control, multi-school management, billing, subscription handling, and global analytics.', 
    icon: <ShieldAlert size={24} color={COLORS.white} />, 
    img: 'data:image/png;base64,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',
    tag: 'Management Level'
  },
  { 
    id: '2', title: 'Admin', 
    access: 'Campus administration, user approvals, student/staff data management, and fee structure configuration.', 
    icon: <Building size={24} color={COLORS.white} />, 
    img: 'https://img.magnific.com/free-vector/follow-me-social-business-theme-design_24877-50426.jpg?semt=ais_hybrid&w=740&q=80',
    tag: 'Management Level'
  },
  { 
    id: '3', title: 'Principal', 
    access: 'Academic monitoring, staff performance tracking, disciplinary actions, and high-level institution reports.', 
    icon: <GraduationCap size={24} color={COLORS.white} />, 
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHKNiLx9KQFG9n-E5JYbQeNudqFbpf-l8QHw&s',
    tag: 'Academic Core'
  },
  { 
    id: '4', title: 'Vice Principal', 
    access: 'Assists principal, manages examination supervision, tracks daily attendance, and handles student discipline.', 
    icon: <Award size={24} color={COLORS.white} />, 
    img: 'https://img.freepik.com/premium-vector/cofee-shop-concept_118813-4647.jpg?semt=ais_hybrid&w=740&q=80',
    tag: 'Academic Core'
  },
  { 
    id: '5', title: 'Teacher', 
    access: 'Class attendance tracking, homework assignment creation, grading, and direct parent communication.', 
    icon: <BookOpen size={24} color={COLORS.white} />, 
    img: 'https://img.magnific.com/premium-vector/friendly-approachable-cartoon-male-teacher-standing-confidently-front-blackboard_851674-43572.jpg?semt=ais_hybrid&w=740&q=80',
    tag: 'Academic Core'
  },
  { 
    id: '6', title: 'Driver', 
    access: 'Transport route management, live GPS tracking toggles, emergency alerts, and student pickup confirmation.', 
    icon: <Bus size={24} color={COLORS.white} />, 
    img: 'https://t3.ftcdn.net/jpg/01/02/03/80/360_F_102038045_1ropJBtqleEFaOu7V37WWpOe7ccUZM7R.jpg',
    tag: 'Non-Teaching Staff'
  },
  { 
    id: '7', title: 'Housekeeping', 
    access: 'Daily task assignments, campus cleaning schedules updates, and facility inventory/maintenance logging.', 
    icon: <Wrench size={24} color={COLORS.white} />, 
    img: 'https://img.magnific.com/free-vector/cleaners-with-cleaning-products-housekeeping-service_18591-52068.jpg?semt=ais_hybrid&w=740&q=80',
    tag: 'Non-Teaching Staff'
  },
  { 
    id: '8', title: 'Receptionist', 
    access: 'Visitor management logs, new admission inquiries tracking, front-desk appointments, and call management.', 
    icon: <Phone size={24} color={COLORS.white} />, 
    img: 'https://img.freepik.com/free-vector/hand-drawn-receptionist-cartoon-illustration_23-2151046533.jpg?semt=ais_hybrid&w=740&q=80',
    tag: 'Non-Teaching Staff'
  },
  { 
    id: '9', title: 'Librarian', 
    access: 'Digital book cataloging, automated issue/return processing, late fine tracking, and library member management.', 
    icon: <Library size={24} color={COLORS.white} />, 
    img: 'https://thumbs.dreamstime.com/z/friendly-librarian-7578678.jpg',
    tag: 'Non-Teaching Staff'
  },
  { 
    id: '10', title: 'Parent', 
    access: "Track child's academic progress, pay school fees online securely, monitor bus location, and chat with teachers.", 
    icon: <Heart size={24} color={COLORS.white} />, 
    img: 'https://img.magnific.com/free-vector/parents-preparing-cute-daughter-school-love-study-backpack-flat-illustration-cartoon-illustration_74855-14475.jpg?semt=ais_hybrid&w=740&q=80',
    tag: 'End Users'
  },
  { 
    id: '11', title: 'Student', 
    access: 'Access class timetable, view daily attendance & exam results, and submit homework assignments online.', 
    icon: <Users size={24} color={COLORS.white} />, 
    img: 'https://as2.ftcdn.net/jpg/02/06/10/17/1000_F_206101771_CFQzGEEKiYd1GWnJ52xKwBPRZXpEhL0j.jpg',
    tag: 'End Users'
  },
];

export default function RolesScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  
  // Responsive Breakpoints
  const isDesktop = width >= 1024;
  
  // Header Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(30)).current;
  
  // Scroll-triggered animations for Timeline Nodes
  const nodeFades = useRef(rolesData.map(() => new Animated.Value(0))).current;
  const nodeSlidesX = useRef(rolesData.map((_, i) => new Animated.Value(isDesktop ? (i % 2 === 0 ? -100 : 100) : 100))).current;
  
  // Ref to hold the Y position of the whole Timeline Section
  const timelineSectionY = useRef(0);
  const layoutYs = useRef(rolesData.map(() => 0));
  const triggered = useRef(rolesData.map(() => false));

  useEffect(() => {
    // Header Initial Animation
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();

    // Trigger the first 2 nodes automatically
    setTimeout(() => {
      [0, 1].forEach(index => {
        if (rolesData[index]) {
          triggered.current[index] = true;
          Animated.parallel([
            Animated.timing(nodeFades[index], { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(nodeSlidesX[index], { toValue: 0, friction: 7, tension: 40, useNativeDriver: true })
          ]).start();
        }
      });
    }, 400);
  }, []);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const triggerPoint = scrollY + height * 0.85; 

    layoutYs.current.forEach((y, index) => {
      // Check if the trigger point has crossed the absolute Y position of the element
      if (y > 0 && !triggered.current[index] && triggerPoint > y) {
        triggered.current[index] = true;
        Animated.parallel([
          Animated.timing(nodeFades[index], { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.spring(nodeSlidesX[index], { toValue: 0, friction: 7, tension: 40, useNativeDriver: true })
        ]).start();
      }
    });
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="light" backgroundColor="transparent" translucent={true} />
      <PublicNavbar />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        
        {/* --- PAGE HEADER WITH BACKGROUND IMAGE --- */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80' }} 
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            <Animated.View style={[styles.headerContent, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
              <View style={styles.badgeWrapper}>
                <Text style={styles.badgeText}>ACCESS CONTROL</Text>
              </View>
              <Text style={[styles.title, { fontSize: isDesktop ? 64 : 40 }]}>User Roles</Text>
              <Text style={styles.subtitle}>
                Customized portals and specific permissions ensuring every stakeholder has exactly the tools they need.
              </Text>
            </Animated.View>
          </View>
        </ImageBackground>

        {/* --- SECTION HEADING --- */}
        <View style={styles.sectionHeadingWrapper}>
          <Text style={styles.sectionTitle}>Role Hierarchy & Permissions</Text>
          <Text style={styles.sectionSubtitle}>Explore what each role can access and manage inside the ERP.</Text>
        </View>

        {/* --- TREE / TIMELINE SECTION --- */}
        <View 
          style={styles.timelineSection}
          onLayout={(e) => { timelineSectionY.current = e.nativeEvent.layout.y; }}
        >
          <View style={styles.timelineContainer}>
            
            {/* The Central Vertical Line */}
            <View style={[styles.timelineLine, { left: isDesktop ? '50%' : 40 }]} />

            {rolesData.map((role, idx) => {
              const isEven = idx % 2 === 0;
              const isLeft = isDesktop && isEven;
              
              return (
                <View 
                  key={role.id} 
                  style={[styles.timelineItem, { flexDirection: isDesktop ? (isEven ? 'row' : 'row-reverse') : 'column' }]}
                  onLayout={(e) => { 
                    // Calculate Absolute Y Position by adding section offset to element offset
                    layoutYs.current[idx] = timelineSectionY.current + e.nativeEvent.layout.y; 
                  }}
                >
                  
                  {/* Central Node Image (Positioned absolutely on the line) */}
                  <View style={[styles.nodeWrapper, { left: isDesktop ? '50%' : 40 }]}>
                    <View style={styles.nodeGlow}>
                      <Image source={{ uri: role.img }} style={styles.nodeImage} />
                    </View>
                  </View>

                  {/* Content Card Layout */}
                  <Animated.View 
                    style={[
                      styles.contentWrapper,
                      isLeft ? styles.contentLeft : (isDesktop ? styles.contentRight : styles.contentMobile),
                      { 
                        opacity: nodeFades[idx], 
                        transform: [{ translateX: nodeSlidesX[idx] }] 
                      }
                    ]}
                  >
                    
                    {/* Floating Tag */}
                    <View style={[styles.floatingTag, isLeft ? styles.tagLeft : styles.tagRight]}>
                       <Text style={styles.tagText}>{role.tag}</Text>
                    </View>

                    {/* The White Info Card */}
                    <TouchableOpacity activeOpacity={0.9} style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <View style={styles.cardIconBox}>
                          {role.icon}
                        </View>
                        <Text style={styles.cardTitle}>{role.title}</Text>
                      </View>
                      <Text style={styles.cardDesc}>{role.access}</Text>
                    </TouchableOpacity>

                  </Animated.View>

                </View>
              );
            })}

          </View>
        </View>

        {/* --- BOTTOM CTA --- */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, { fontSize: isDesktop ? 48 : 32 }]}>Empower Your Team</Text>
          <Text style={styles.ctaSubtitle}>Experience personalized dashboards for every role. Get started with Edvance ERP.</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.ctaBtn} activeOpacity={0.9}>
            <Text style={styles.ctaBtnText}>Login to Dashboard</Text>
            <Rocket size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* --- FOOTER --- */}
        <PublicFooter />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: COLORS.cardLight 
  },
  scrollView: { 
    flex: 1 
  },

  /* HEADER STYLES */
  headerBackground: {
    width: '100%',
    minHeight: 450,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 19, 8, 0.75)', // Dark brown overlay for readability
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 140,    
    paddingBottom: 80, 
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
    maxWidth: 900,
  },
  badgeWrapper: {
    backgroundColor: 'rgba(227, 83, 54, 0.2)', // Terracotta transparent
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(227, 83, 54, 0.5)',
  },
  badgeText: {
    color: COLORS.primary, // Terracotta
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 32,
  },

  /* SECTION HEADING */
  sectionHeadingWrapper: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
    backgroundColor: COLORS.cardLight,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 600,
  },

  /* TIMELINE STYLES */
  timelineSection: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: COLORS.cardLight,
    overflow: 'hidden', // Prevents horizontal scroll from sliding animations
  },
  timelineContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
    paddingTop: 20,
    paddingBottom: 40,
  },
  timelineLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.primary,
    marginLeft: -2, // Center the line on its coordinate
    borderRadius: 2,
  },
  timelineItem: {
    width: '100%',
    marginBottom: 80,
    position: 'relative',
    minHeight: 120,
  },
  
  /* NODE STYLES */
  nodeWrapper: {
    position: 'absolute',
    top: 0,
    marginLeft: -60, // Half of node width to strictly center it
    zIndex: 10,
  },
  nodeGlow: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(227, 83, 54, 0.1)', // Outer glow Terracotta
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: COLORS.bgWhite,
  },

  /* CONTENT WRAPPER STYLES */
  contentWrapper: {
    width: '50%',
    position: 'relative',
  },
  contentLeft: {
    paddingRight: 100, // Space from center line
    alignItems: 'flex-end',
  },
  contentRight: {
    paddingLeft: 100, // Space from center line
    alignItems: 'flex-start',
  },
  contentMobile: {
    width: '100%',
    paddingLeft: 100, // Space for the line on mobile
    marginTop: 20,
  },

  /* FLOATING TAG STYLES */
  floatingTag: {
    backgroundColor: 'rgba(244, 164, 96, 0.15)', // Sandy Orange Light
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 164, 96, 0.3)',
  },
  tagLeft: {
    alignSelf: 'flex-end',
  },
  tagRight: {
    alignSelf: 'flex-start',
  },
  tagText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* CARD STYLES */
  infoCard: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  cardIconBox: {
    width: 52,
    height: 52,
    backgroundColor: COLORS.darkBg, // Deep Brown matching original theme
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  cardDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },

  /* CTA STYLES */
  ctaSection: { 
    backgroundColor: COLORS.darkBg, 
    paddingVertical: 100, 
    paddingHorizontal: 24, 
    alignItems: 'center' 
  },
  ctaTitle: { 
    fontWeight: '900', 
    color: COLORS.white, 
    textAlign: 'center', 
    marginBottom: 16, 
    letterSpacing: -1 
  },
  ctaSubtitle: { 
    fontSize: 20, 
    color: COLORS.accent, 
    textAlign: 'center', 
    marginBottom: 40, 
    lineHeight: 32,
    maxWidth: 600,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary, 
    paddingHorizontal: 40, 
    paddingVertical: 20,
    borderRadius: 999, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12,
    shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, 
    shadowRadius: 16, 
    elevation: 8,
  },
  ctaBtnText: { 
    color: COLORS.white, 
    fontWeight: '800', 
    fontSize: 18 
  },
});