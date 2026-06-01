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
  BarChart3,
  Briefcase,
  Bus,
  Calendar,
  DollarSign,
  FileText,
  Library,
  MessageSquare,
  Rocket,
  Smartphone,
  UserCheck,
  Users
} from 'lucide-react-native';

const isWeb = Platform.OS === 'web';

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

// Features Data - Fixed Images, Added Reliable URLs, Moved Mobile App to Last
const featuresData = [
  { 
    id: '1', title: 'Student Management', 
    desc: 'Complete student lifecycle from admissions and profiles to documents and transfers. Maintain a comprehensive digital record for every student effortlessly.', 
    icon: <Users size={32} color={COLORS.primary} />, 
    img: 'https://t4.ftcdn.net/jpg/05/54/63/33/360_F_554633341_3DaUXXSJSj7f5TUC4IvYkeeQAqVWG02a.jpg' 
  },
  { 
    id: '2', title: 'Staff Management', 
    desc: 'Maintain teacher records, handle payroll, manage leave requests, and track attendance. Empower your staff with dedicated self-service portals.', 
    icon: <Briefcase size={32} color={COLORS.primary} />, 
    img: 'https://img.magnific.com/free-photo/management-coaching-business-dealing-mentor-concept_53876-133858.jpg?semt=ais_hybrid&w=740&q=80' 
  },
  { 
    id: '3', title: 'Attendance', 
    desc: 'Biometric integration, QR scans, manual entry, and auto-sync offline/online. Get instant absentee alerts and daily summary reports.', 
    icon: <UserCheck size={32} color={COLORS.primary} />, 
    img: 'https://t3.ftcdn.net/jpg/04/69/79/70/360_F_469797034_i1FM7TbG567D73MjLNrNE0pFYPONlNeH.jpg' 
  },
  { 
    id: '4', title: 'Timetable', 
    desc: 'Auto-generated class schedules, teacher substitution management, and conflict checks. Ensure no overlapping periods for teachers or classes.', 
    icon: <Calendar size={32} color={COLORS.primary} />, 
    img: 'https://media.istockphoto.com/id/2188188739/photo/planning-and-scheduling-meeting-calendars-activities-time-management-notifications-and.jpg?s=612x612&w=0&k=20&c=t6CR7uO1TbW-oL18gtDDBAFkX4SFfQrz5nibBfarzfM=' 
  },
  { 
    id: '5', title: 'Examination', 
    desc: 'Conduct online exams, simplify marks entry, and automate report card generation. Share real-time academic progress with parents seamlessly.', 
    icon: <FileText size={32} color={COLORS.primary} />, 
    img: 'https://img.freepik.com/free-photo/team-college-students-working-project-related-business-management_482257-118389.jpg?semt=ais_hybrid&w=740&q=80' 
  },
  { 
    id: '6', title: 'Fees', 
    desc: 'Dynamic fee structures, secure online payments, instant receipts, and dues tracking. Auto-send reminders to parents for upcoming or overdue payments.', 
    icon: <DollarSign size={32} color={COLORS.primary} />,
    img: 'https://images.ctfassets.net/9xz6pxlw3y5u/4zOW3RlxXleonWV6ujOmr4/9ad9de72ba2c404b40d374001187a59e/fees-780x470.jpg?w=1170&q=90' 
  },
  { 
    id: '7', title: 'Transport', 
    desc: 'Live GPS bus tracking, intelligent route management, and dedicated driver app. Guarantee student safety with boarding and dropping notifications.', 
    icon: <Bus size={32} color={COLORS.primary} />, 
    img: 'https://busesandvans.tatamotors.com/assets/buses/files/2024-03/tata-skool-buses%20%281%29.jpg?VersionId=DOQZhv6vo6qEwl7.jjhG5qeHsFARrWO6' 
  },
  { 
    id: '8', title: 'Communication', 
    desc: 'Automated SMS, emails, in-app chat, digital notice boards, and quick circulars. Bridge the gap between school administration, teachers, and parents.', 
    icon: <MessageSquare size={32} color={COLORS.primary} />, 
    img: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&q=80' 
  },
  { 
    id: '9', title: 'Reports', 
    desc: 'Detailed analytics, performance metrics, and comprehensive dashboards for admins. Take data-driven decisions to grow your educational institution.', 
    icon: <BarChart3 size={32} color={COLORS.primary} />, 
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' 
  },
  { 
    id: '10', title: 'Library', 
    desc: 'Digital book cataloging, automated issue/return processing, and member tracking. Manage inventory, barcoding, and late return fines easily.', 
    icon: <Library size={32} color={COLORS.primary} />, 
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80' 
  },
  { 
    id: '11', title: 'Mobile App', 
    desc: 'Dedicated cross-platform mobile apps for students, parents, and teachers. Push notifications and quick access to all ERP features on the go.', 
    icon: <Smartphone size={32} color={COLORS.primary} />, 
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80' 
  }
];

export default function FeaturesScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  
  // Responsive Breakpoints
  const isDesktop = width >= 1024;
  
  // Header Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(30)).current;
  
  // Scroll-triggered animations for each feature block (Left and Right Slide Logic)
  const featureFades = useRef(featuresData.map(() => new Animated.Value(0))).current;
  
  // Slide logic: Even index starts from Left (-200), Odd starts from Right (+200)
  const featureSlidesX = useRef(featuresData.map((_, i) => new Animated.Value(i % 2 === 0 ? -200 : 200))).current;
  
  const layoutYs = useRef<number[]>(featuresData.map(() => 0)).current;
  const triggered = useRef<boolean[]>(featuresData.map(() => false)).current;

  useEffect(() => {
    // Header Initial Animation
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();

    // Trigger the first feature automatically assuming it's visible on load
    setTimeout(() => {
      triggered[0] = true;
      Animated.parallel([
        Animated.timing(featureFades[0], { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(featureSlidesX[0], { toValue: 0, friction: 7, tension: 40, useNativeDriver: true })
      ]).start();
    }, 300);
  }, []);

  // Handle Scroll to trigger alternating slide animations when elements come into view
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const triggerPoint = scrollY + height * 0.85; 

    layoutYs.forEach((y, index) => {
      if (y > 0 && !triggered[index] && triggerPoint > y) {
        triggered[index] = true;
        Animated.parallel([
          Animated.timing(featureFades[index], { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.spring(featureSlidesX[index], { toValue: 0, friction: 7, tension: 40, useNativeDriver: true })
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
          source={{ uri: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80' }} 
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            <Animated.View style={[styles.headerContent, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
              <View style={styles.badgeWrapper}>
                <Text style={styles.badgeText}>EVERYTHING YOU NEED</Text>
              </View>
              <Text style={[styles.title, { fontSize: isDesktop ? 64 : 40 }]}>Powerful Features</Text>
              <Text style={styles.subtitle}>
                A unified suite of tools designed to streamline your institution's daily operations and elevate the educational experience.
              </Text>
            </Animated.View>
          </View>
        </ImageBackground>

        {/* --- DEEP DIVE FEATURES (ALTERNATING LAYOUT) --- */}
        <View style={styles.featuresListContainer}>
          {featuresData.map((feature, idx) => {
            // Logic for alternating layout (Image Left or Image Right) on Desktop
            const isImageLeft = idx % 2 === 0;
            const flexDirection = isDesktop 
              ? (isImageLeft ? 'row' : 'row-reverse') 
              : 'column'; // Always column on mobile for better UX

            return (
              <View 
                key={feature.id} 
                onLayout={(e) => { layoutYs[idx] = e.nativeEvent.layout.y; }}
                style={styles.featureBlockWrapper}
              >
                <Animated.View 
                  style={[
                    styles.featureBlock, 
                    { flexDirection },
                    { 
                      opacity: featureFades[idx], 
                      transform: [{ translateX: featureSlidesX[idx] }] // Slides from Left/Right
                    }
                  ]}
                >
                  {/* Image Container */}
                  <View style={[styles.featureImgContainer, { width: isDesktop ? '48%' : '100%' }]}>
                    <Image source={{ uri: feature.img }} style={styles.featureImg} resizeMode="cover" />
                  </View>
                  
                  {/* Text Container */}
                  <View style={[styles.featureTextContainer, { width: isDesktop ? '45%' : '100%', marginTop: isDesktop ? 0 : 40 }]}>
                    <View style={styles.iconContainer}>
                      {feature.icon}
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <View style={styles.orangeLine} />
                    <Text style={styles.featureDesc}>{feature.desc}</Text>
                  </View>
                </Animated.View>
              </View>
            );
          })}
        </View>

        {/* --- BOTTOM CTA --- */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, { fontSize: isDesktop ? 48 : 32 }]}>Experience the Difference</Text>
          <Text style={styles.ctaSubtitle}>Join hundreds of schools already using our comprehensive ERP platform.</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.ctaBtn} activeOpacity={0.9}>
            <Text style={styles.ctaBtnText}>Get Started Now</Text>
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
    backgroundColor: 'rgba(244, 164, 96, 0.2)', // Sandy Orange transparent
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(244, 164, 96, 0.5)',
  },
  badgeText: {
    color: COLORS.accent,
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

  /* DEEP DIVE FEATURES STYLES */
  featuresListContainer: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    overflow: 'hidden', // Prevents horizontal scrollbars during slide animations
  },
  featureBlockWrapper: {
    paddingVertical: 60,
  },
  featureBlock: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureImgContainer: {
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  featureImg: {
    width: '100%',
    height: 450, // Large portrait/square feel
    borderRadius: 32,
    backgroundColor: COLORS.darkBg,
  },
  featureTextContainer: {
    justifyContent: 'center',
    paddingHorizontal: isWeb ? 20 : 0,
  },
  iconContainer: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(227, 83, 54, 0.1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -1,
    marginBottom: 16,
  },
  orangeLine: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 24,
  },
  featureDesc: {
    fontSize: 18,
    color: COLORS.textSecondary,
    lineHeight: 30,
  },

  /* CTA STYLES */
  ctaSection: { 
    backgroundColor: COLORS.darkBg, 
    paddingVertical: 120, 
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