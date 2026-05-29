import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Platform,
  Pressable,
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
  Eye,
  Globe,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react-native';

const isWeb = Platform.OS === 'web';

// Original Website Theme Colors
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

// --- DATA ARRAYS ---
const journeyData = [
  { year: '2016', title: 'The Inception', desc: 'Anasol Consultancy Services was founded with a vision to transform businesses through technology.' },
  { year: '2022', title: 'Edvance ERP Launch', desc: 'Identified the gap in the education sector and launched our flagship School ERP system.' },
  { year: '2024', title: 'Global Reach', desc: 'Expanded our services to over 500+ schools globally, bringing paperless operations to life.' },
  { year: '2026', title: 'Future Innovations', desc: 'Integrating AI-driven analytics and advanced modules for next-gen campus management.' }
];

const benefitsData = [
  { icon: <Zap size={24} color={COLORS.primary} />, title: 'High Performance', desc: 'Lightning-fast cloud servers ensuring zero downtime and smooth operations.' },
  { icon: <ShieldCheck size={24} color={COLORS.primary} />, title: 'Data Security', desc: 'End-to-end encryption to protect sensitive student and financial data.' },
  { icon: <TrendingUp size={24} color={COLORS.primary} />, title: 'Scalability', desc: 'Grows seamlessly as your institution expands from 100 to 10,000 students.' },
  { icon: <Globe size={24} color={COLORS.primary} />, title: 'Anywhere Access', desc: 'Web and mobile apps for easy access on any device, anywhere, anytime.' }
];

const teamData = [
  { name: 'Alex Mercer', role: 'Lead Frontend Developer', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { name: 'Sarah Jenkins', role: 'Product Manager', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
  { name: 'Michael Chen', role: 'Lead Backend Architect', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
  { name: 'Priya Sharma', role: 'UI/UX Designer', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' }
];

// Split into two rows for opposing animations and multiplied for smooth infinite scroll
const clientSchoolsRow1 = [
  "Delhi Public School", "Greenwood High", "Oakridge International", 
  "Silver Oaks", "Kendriya Vidyalaya", "Chirec International"
];
const clientSchoolsRow2 = [
  "Narayana E-Techno", "Sri Chaitanya", "Global Indian Int. School",
  "VIBGYOR High", "Ryan International", "Jain International"
];

// Multiply arrays to ensure they fill the screen for the marquee
const repeatedRow1 = [...clientSchoolsRow1, ...clientSchoolsRow1, ...clientSchoolsRow1, ...clientSchoolsRow1];
const repeatedRow2 = [...clientSchoolsRow2, ...clientSchoolsRow2, ...clientSchoolsRow2, ...clientSchoolsRow2];

export default function AboutScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);

  // Header Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(30)).current;

  // Scroll Animations Refs
  const introFade = useRef(new Animated.Value(0)).current;
  const missionFade = useRef(new Animated.Value(0)).current;
  const journeyFade = useRef(new Animated.Value(0)).current;
  const erpFade = useRef(new Animated.Value(0)).current;
  const benefitsFade = useRef(new Animated.Value(0)).current;
  const teamFade = useRef(new Animated.Value(0)).current;
  const clientsFade = useRef(new Animated.Value(0)).current;

  // ERP Image Floating Animation
  const erpImageFloat = useRef(new Animated.Value(0)).current;

  // Marquee Animations for Client Schools
  const marqueeLeftAnim = useRef(new Animated.Value(0)).current;
  const marqueeRightAnim = useRef(new Animated.Value(-1500)).current;

  // Layout Tracking
  const layoutYs = useRef({ intro: 0, mission: 0, journey: 0, erp: 0, benefits: 0, team: 0, clients: 0 });
  const triggered = useRef({ intro: false, mission: false, journey: false, erp: false, benefits: false, team: false, clients: false });

  useEffect(() => {
    // Header Intro
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();

    // ERP Image Continuous Floating Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(erpImageFloat, { toValue: -20, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(erpImageFloat, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Start Infinite Marquee Loops (Fixed for smooth scroll)
    Animated.loop(
      Animated.timing(marqueeLeftAnim, {
        toValue: -1500, // Move left
        duration: 25000, 
        easing: Easing.linear,
        useNativeDriver: isWeb ? false : true, 
      })
    ).start();

    Animated.loop(
      Animated.timing(marqueeRightAnim, {
        toValue: 0, // Move right from -1500
        duration: 25000, 
        easing: Easing.linear,
        useNativeDriver: isWeb ? false : true,
      })
    ).start();
  }, []);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const triggerPoint = scrollY + height * 0.85;

    // Helper to trigger animations
    const checkAndTrigger = (key: keyof typeof layoutYs.current, animRef: Animated.Value) => {
      if (layoutYs.current[key] > 0 && !triggered.current[key] && triggerPoint > layoutYs.current[key]) {
        triggered.current[key] = true;
        Animated.timing(animRef, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      }
    };

    checkAndTrigger('intro', introFade);
    checkAndTrigger('mission', missionFade);
    checkAndTrigger('journey', journeyFade);
    checkAndTrigger('erp', erpFade);
    checkAndTrigger('benefits', benefitsFade);
    checkAndTrigger('team', teamFade);
    checkAndTrigger('clients', clientsFade);
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
        
        {/* --- HERO HEADER --- */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80' }} 
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            <Animated.View style={[styles.headerContent, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
              <View style={styles.badgeWrapper}>
                <Text style={styles.badgeText}>WHO WE ARE</Text>
              </View>
              <Text style={[styles.title, { fontSize: isDesktop ? 64 : 40 }]}>About Edvance</Text>
              <Text style={styles.subtitle}>
                Powered by Anasol Consultancy Services, we are dedicated to transforming educational institutions through innovative technology.
              </Text>
            </Animated.View>
          </View>
        </ImageBackground>

        {/* --- 1. COMPANY INTRODUCTION --- */}
        <View style={styles.sectionWrapper} onLayout={(e) => layoutYs.current.intro = e.nativeEvent.layout.y}>
          <Animated.View style={[styles.contentContainer, { opacity: introFade, transform: [{ translateY: introFade.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            <Text style={styles.sectionTitle}>Welcome to Anasol Consultancy Services Pvt Ltd</Text>
            <Text style={styles.sectionDesc}>
              Anasol Consultancy Services specializes in delivering high-quality, tailored technology solutions. Our flagship product, <Text style={{fontWeight: '800', color: COLORS.primary}}>Edvance ERP</Text>, was born from a deep understanding of the challenges faced by educational institutions today. We bridge the gap between administrators, teachers, parents, and students by providing a seamless, secure, and highly efficient cloud-based management platform.
            </Text>
          </Animated.View>
        </View>

        {/* --- 2. MISSION & VISION --- */}
        <View style={[styles.sectionWrapper, { backgroundColor: COLORS.cardLight }]} onLayout={(e) => layoutYs.current.mission = e.nativeEvent.layout.y}>
          <Animated.View style={[styles.contentContainer, { flexDirection: isDesktop ? 'row' : 'column', gap: 32 }, { opacity: missionFade, transform: [{ translateY: missionFade.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            
            <View style={[styles.missionCard, { width: isDesktop ? '48%' : '100%' }]}>
              <View style={styles.iconCircle}><Target size={32} color={COLORS.white} /></View>
              <Text style={styles.cardTitle}>Our Mission</Text>
              <Text style={styles.cardDesc}>
                To digitalize and simplify campus operations worldwide, empowering educators to focus on what truly matters: delivering quality education to students.
              </Text>
            </View>

            <View style={[styles.missionCard, { width: isDesktop ? '48%' : '100%' }]}>
              <View style={styles.iconCircle}><Eye size={32} color={COLORS.white} /></View>
              <Text style={styles.cardTitle}>Our Vision</Text>
              <Text style={styles.cardDesc}>
                To be the most trusted and universally adopted School ERP platform globally, recognized for continuous innovation, reliability, and unparalleled user experience.
              </Text>
            </View>

          </Animated.View>
        </View>

        {/* --- 3. COMPANY JOURNEY (TIMELINE) --- */}
        <View style={styles.sectionWrapper} onLayout={(e) => layoutYs.current.journey = e.nativeEvent.layout.y}>
          <Animated.View style={[styles.contentContainer, { opacity: journeyFade }]}>
            <Text style={styles.sectionTitle}>Our Journey</Text>
            <Text style={[styles.sectionDesc, { textAlign: 'center', marginBottom: 60 }]}>The milestones that shaped Edvance ERP.</Text>

            <View style={styles.timelineContainer}>
              <View style={[styles.timelineLine, { left: isDesktop ? '50%' : 24 }]} />
              
              {journeyData.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const isLeft = isDesktop && isEven;
                
                return (
                  <View key={idx} style={[styles.timelineItem, { flexDirection: isDesktop ? (isEven ? 'row' : 'row-reverse') : 'column' }]}>
                    <View style={[styles.timelineDot, { left: isDesktop ? '50%' : 24 }]} />
                    <View style={[styles.timelineContent, isLeft ? styles.timelineLeft : (isDesktop ? styles.timelineRight : styles.timelineMobile)]}>
                      <View style={styles.timelineCard}>
                        <Text style={styles.timelineYear}>{item.year}</Text>
                        <Text style={styles.timelineTitle}>{item.title}</Text>
                        <Text style={styles.timelineDesc}>{item.desc}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

          </Animated.View>
        </View>

        {/* --- 4. WHAT IS ERP & HOW IT WORKS --- */}
        <View style={[styles.sectionWrapper, { backgroundColor: COLORS.cardLight }]} onLayout={(e) => layoutYs.current.erp = e.nativeEvent.layout.y}>
          <Animated.View style={[styles.contentContainer, { opacity: erpFade, transform: [{ translateY: erpFade.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            
            <View style={[styles.erpWrapper, { flexDirection: isDesktop ? 'row' : 'column' }]}>
              {/* Left Side: Animated Floating Image */}
              <View style={[styles.erpImageContainer, { width: isDesktop ? '45%' : '100%', marginBottom: isDesktop ? 0 : 40 }]}>
                <Animated.Image 
                  source={require('../../assets/images/erp.png')} 
                  style={[styles.erpImage, { transform: [{ translateY: erpImageFloat }] }]} 
                  resizeMode="contain"
                />
              </View>

              {/* Right Side: Information */}
              <View style={[styles.erpTextContainer, { width: isDesktop ? '50%' : '100%' }]}>
                <Text style={styles.sectionTitleLeft}>What is an ERP?</Text>
                <Text style={styles.erpText}>
                  ERP stands for <Text style={{fontWeight: 'bold', color: COLORS.textPrimary}}>Enterprise Resource Planning</Text>. In the context of education, an ERP acts as the central nervous system for a school or college. Instead of using multiple disconnected software for admissions, fees, timetable, and attendance, an ERP brings everything into one unified platform.
                </Text>
                <Text style={styles.sectionSubtitleLeft}>How it Works</Text>
                <Text style={styles.erpText}>
                  Edvance ERP connects all departments through a secure cloud database. When a parent pays a fee, the finance dashboard updates instantly, the student's profile reflects the payment, and an automated receipt is generated. This seamless data flow eliminates manual entry, reduces errors, and gives management real-time insights into campus operations.
                </Text>
              </View>
            </View>

          </Animated.View>
        </View>

        {/* --- 5. WHY EDVANCE ERP (BENEFITS WITH HOVER) --- */}
        <View style={[styles.sectionWrapper, { backgroundColor: COLORS.darkBg }]} onLayout={(e) => layoutYs.current.benefits = e.nativeEvent.layout.y}>
          <Animated.View style={[styles.contentContainer, { opacity: benefitsFade, transform: [{ translateY: benefitsFade.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            <Text style={[styles.sectionTitle, { color: COLORS.white }]}>Why Edvance ERP?</Text>
            <Text style={[styles.sectionDesc, { color: COLORS.accent, textAlign: 'center', marginBottom: 60 }]}>Core benefits that set us apart from the competition.</Text>

            <View style={styles.benefitsGrid}>
              {benefitsData.map((benefit, idx) => (
                <Pressable 
                  key={idx} 
                  onHoverIn={() => setHoveredBenefit(idx)}
                  onHoverOut={() => setHoveredBenefit(null)}
                  style={[
                    styles.benefitCard, 
                    { width: isDesktop ? '23%' : (isTablet ? '48%' : '100%') },
                    hoveredBenefit === idx && styles.benefitCardHovered
                  ]}
                >
                  <View style={[styles.benefitIconBox, hoveredBenefit === idx && styles.benefitIconBoxHovered]}>
                    {benefit.icon}
                  </View>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* --- 6. TEAM INFORMATION --- */}
        <View style={styles.sectionWrapper} onLayout={(e) => layoutYs.current.team = e.nativeEvent.layout.y}>
          <Animated.View style={[styles.contentContainer, { opacity: teamFade }]}>
            <Text style={styles.sectionTitle}>Meet The Team</Text>
            <Text style={[styles.sectionDesc, { textAlign: 'center', marginBottom: 60 }]}>The brilliant minds at Anasol Consultancy driving Edvance forward.</Text>

            <View style={styles.teamGrid}>
              {teamData.map((member, idx) => (
                <View key={idx} style={[styles.teamCard, { width: isDesktop ? '23%' : (isTablet ? '48%' : '100%') }]}>
                  <Image source={{ uri: member.img }} style={styles.teamImg} />
                  <Text style={styles.teamName}>{member.name}</Text>
                  <Text style={styles.teamRole}>{member.role}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* --- 7. CLIENT SCHOOLS --- */}
        <View style={[styles.sectionWrapper, { backgroundColor: COLORS.cardLight, overflow: 'hidden' }]} onLayout={(e) => layoutYs.current.clients = e.nativeEvent.layout.y}>
          <Animated.View style={[{ opacity: clientsFade }]}>
            <Text style={styles.sectionTitle}>Trusted By Industry Leaders</Text>
            <Text style={[styles.sectionDesc, { textAlign: 'center', marginBottom: 60 }]}>Over 500+ institutions rely on Edvance ERP daily.</Text>

            {/* Marquee Row 1: Scrolling Left */}
            <View style={styles.marqueeWrapper}>
              <Animated.View style={[styles.marqueeInner, { transform: [{ translateX: marqueeLeftAnim }] }]}>
                {repeatedRow1.map((school, idx) => (
                  <View key={`row1-${idx}`} style={styles.clientTag}>
                    <Award size={18} color={COLORS.primary} />
                    <Text style={styles.clientText}>{school}</Text>
                  </View>
                ))}
              </Animated.View>
            </View>

            {/* Marquee Row 2: Scrolling Right */}
            <View style={styles.marqueeWrapper}>
              <Animated.View style={[styles.marqueeInner, { transform: [{ translateX: marqueeRightAnim }] }]}>
                {repeatedRow2.map((school, idx) => (
                  <View key={`row2-${idx}`} style={styles.clientTag}>
                    <Award size={18} color={COLORS.primary} />
                    <Text style={styles.clientText}>{school}</Text>
                  </View>
                ))}
              </Animated.View>
            </View>

          </Animated.View>
        </View>

        {/* --- CTA SECTION --- */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, { fontSize: isDesktop ? 48 : 32 }]}>Be Part of Our Story</Text>
          <Text style={styles.ctaSubtitle}>Join forward-thinking schools using Edvance ERP today.</Text>
          <TouchableOpacity onPress={() => router.push('/(public)/contact')} style={styles.ctaBtn} activeOpacity={0.9}>
            <Text style={styles.ctaBtnText}>Contact Us Now</Text>
            <Rocket size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <PublicFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bgWhite },
  scrollView: { flex: 1 },

  /* HEADER (ADDED PADDING TOP TO FIX NAVBAR OVERLAP) */
  headerBackground: { width: '100%', minHeight: 400 },
  headerOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(42, 19, 8, 0.85)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 140, // Increased to clear the floating navbar
    paddingBottom: 80, 
    paddingHorizontal: 24 
  },
  headerContent: { alignItems: 'center', maxWidth: 900 },
  badgeWrapper: { backgroundColor: 'rgba(227, 83, 54, 0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(227, 83, 54, 0.5)' },
  badgeText: { color: COLORS.primary, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { fontWeight: '900', color: COLORS.white, textAlign: 'center', marginBottom: 24, letterSpacing: -1 },
  subtitle: { fontSize: 20, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', lineHeight: 32 },

  /* GENERAL SECTIONS */
  sectionWrapper: { paddingVertical: 80, paddingHorizontal: 24 },
  contentContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center' },
  sectionTitle: { fontSize: 40, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 24, letterSpacing: -1 },
  sectionTitleLeft: { fontSize: 36, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 20, letterSpacing: -1 },
  sectionSubtitleLeft: { fontSize: 24, fontWeight: '800', color: COLORS.primary, marginTop: 24, marginBottom: 12 },
  sectionDesc: { fontSize: 18, color: COLORS.textSecondary, lineHeight: 30, textAlign: 'center', maxWidth: 800, alignSelf: 'center' },

  /* MISSION & VISION CARDS */
  missionCard: { backgroundColor: COLORS.bgWhite, padding: 40, borderRadius: 24, shadowColor: COLORS.textPrimary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5, borderWidth: 1, borderColor: 'rgba(244, 164, 96, 0.2)' },
  iconCircle: { width: 64, height: 64, backgroundColor: COLORS.primary, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  cardTitle: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 16 },
  cardDesc: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 26 },

  /* TIMELINE */
  timelineContainer: { position: 'relative', paddingVertical: 20 },
  timelineLine: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(227, 83, 54, 0.3)', marginLeft: -1 },
  timelineItem: { width: '100%', marginBottom: 60, position: 'relative', minHeight: 100 },
  timelineDot: { position: 'absolute', top: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary, marginLeft: -10, borderWidth: 4, borderColor: COLORS.bgWhite, zIndex: 10 },
  timelineContent: { width: '50%', position: 'relative' },
  timelineLeft: { paddingRight: 60, alignItems: 'flex-end' },
  timelineRight: { paddingLeft: 60, alignItems: 'flex-start' },
  timelineMobile: { width: '100%', paddingLeft: 60 },
  timelineCard: { backgroundColor: COLORS.cardLight, padding: 24, borderRadius: 16, width: '100%', maxWidth: 450, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  timelineYear: { color: COLORS.primary, fontSize: 18, fontWeight: '900', marginBottom: 8 },
  timelineTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  timelineDesc: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 24 },

  /* ERP EXPLANATION SECTION */
  erpWrapper: { alignItems: 'center', justifyContent: 'space-between', gap: 40 },
  erpImageContainer: { alignItems: 'center', justifyContent: 'center' },
  erpImage: { width: '100%', height: 350 },
  erpTextContainer: { justifyContent: 'center' },
  erpText: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 28 },

  /* ERP BENEFITS */
  benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  benefitCard: { backgroundColor: COLORS.cardDark, padding: 32, borderRadius: 16, borderTopWidth: 4, borderTopColor: COLORS.accent, transition: 'all 0.3s ease' },
  benefitCardHovered: { transform: [{ scale: 1.05 }, { translateY: -10 }], shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 12, borderTopColor: COLORS.primary },
  benefitIconBox: { width: 56, height: 56, backgroundColor: 'rgba(244, 164, 96, 0.1)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20, transition: 'all 0.3s ease' },
  benefitIconBoxHovered: { backgroundColor: 'rgba(227, 83, 54, 0.2)' },
  benefitTitle: { fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 12 },
  benefitDesc: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 24 },

  /* TEAM GRID */
  teamGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  teamCard: { backgroundColor: COLORS.bgWhite, padding: 32, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  teamImg: { width: 120, height: 120, borderRadius: 60, marginBottom: 20, backgroundColor: COLORS.cardLight },
  teamName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 4 },
  teamRole: { fontSize: 14, color: COLORS.primary, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },

  /* CLIENTS MARQUEE */
  marqueeWrapper: { width: '100%', overflow: 'hidden', marginBottom: 24 },
  marqueeInner: { flexDirection: 'row', width: 4000, gap: 16 },
  clientTag: { 
    flexDirection: 'row', alignItems: 'center', gap: 12, 
    backgroundColor: COLORS.bgWhite, paddingHorizontal: 24, paddingVertical: 16, 
    borderRadius: 999, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, shadowRadius: 4, marginRight: 16 
  },
  clientText: { 
    fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, 
    ...Platform.select({ web: { whiteSpace: 'nowrap' } }) 
  },

  /* CTA */
  ctaSection: { backgroundColor: COLORS.darkBg, paddingVertical: 100, paddingHorizontal: 24, alignItems: 'center' },
  ctaTitle: { fontWeight: '900', color: COLORS.white, textAlign: 'center', marginBottom: 16, letterSpacing: -1 },
  ctaSubtitle: { fontSize: 20, color: COLORS.accent, textAlign: 'center', marginBottom: 40, lineHeight: 32, maxWidth: 600 },
  ctaBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 40, paddingVertical: 20, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  ctaBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 18 },
});