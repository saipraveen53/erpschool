import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
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
  ArrowRight,
  CheckCircle2,
  Rocket,
  ShieldCheck
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

// Orbiting Images Data
const objectivesData = [
  { title: 'Digitize', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80' },
  { title: 'Paperless', img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=300&q=80' },
  { title: 'Communicate', img: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=300&q=80' },
  { title: 'Transparent', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80' },
  { title: 'Centralize', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80' },
  { title: 'Efficiency', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80' },
  { title: 'Reports', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&q=80' },
  { title: 'Monitoring', img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&q=80' }
];

// Updated DPR Modules with Images and Tags for the new Card UI
const dprModules = [
  { title: 'Academic Management', tag: 'ACADEMICS', desc: 'Manage classes, subjects, and complete academic workflow.', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80' },
  { title: 'Student Lifecycle', tag: 'STUDENTS', desc: 'From admission to alumni, track every student detail.', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&q=80' },
  { title: 'Attendance Monitoring', tag: 'TRACKING', desc: 'Real-time tracking for students and staff with reports.', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80' },
  { title: 'Examination', tag: 'ASSESSMENTS', desc: 'Hall tickets, grading, and automated report cards.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMpHBxFPitN4k2Ll4h6as14zCly_SvSxqLIQ&s' },
  { title: 'Fee & Finance', tag: 'PAYMENTS', desc: 'Online payments, receipts, and pending dues tracking.', img: 'https://www.timeshighereducation.com/sites/default/files/styles/the_breaking_news_image_style/public/fees_increase.jpg?itok=9XGaMAk6' },
  { title: 'Communication', tag: 'NOTICES', desc: 'Instant notices, circulars, and parent messaging.', img: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500&q=80' },
  { title: 'Transport', tag: 'LOGISTICS', desc: 'Live bus tracking, route mapping, and driver app.', img: 'https://5.imimg.com/data5/WP/UB/GLADMIN-9221148/tata-marcopolo-school-variant.png' },
  { title: 'Parent Portal', tag: 'ENGAGEMENT', desc: 'Dedicated portal for parents to monitor child progress.', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80' },
  { title: 'Reports & Analytics', tag: 'DASHBOARDS', desc: 'Comprehensive dashboards for principal and admin.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80' },
];

const whyChooseUsBullets = [
  "Seamless Integration across all departments.",
  "Real-time analytics and dynamic reporting.",
  "Highly secure and data privacy compliant.",
  "User-friendly mobile and web interfaces."
];

export default function HomeScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();

  // Responsive Breakpoints
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  // Hero Entrance Animations
  const fadeAnimBadge = useRef(new Animated.Value(0)).current;
  const slideAnimTitle = useRef(new Animated.Value(50)).current;
  const fadeAnimTitle = useRef(new Animated.Value(0)).current;
  const fadeAnimSub = useRef(new Animated.Value(0)).current;
  const fadeAnimBtns = useRef(new Animated.Value(0)).current;
  const scaleAnimImage = useRef(new Animated.Value(0.8)).current;
  const fadeAnimImage = useRef(new Animated.Value(0)).current;
  const floatAnimImage = useRef(new Animated.Value(0)).current;

  // Scroll Triggered Animation Values
  const statsAnim = useRef(new Animated.Value(0)).current;
  const objAnim = useRef(new Animated.Value(0)).current;
  const infoAnim = useRef(new Animated.Value(0)).current;
  const modAnim = useRef(new Animated.Value(0)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  // Card Grid Staggered Animations
  const cardSlideAnims = useRef(dprModules.map(() => new Animated.Value(50))).current;
  const cardFadeAnims = useRef(dprModules.map(() => new Animated.Value(0))).current;

  // Infinite Spin Animation Logic
  const spinAnim = useRef(new Animated.Value(0)).current;
  const isPaused = useRef(false);
  const currentSpin = useRef(0);

  // Track Layout Positions
  const sectionLayouts = useRef({ stats: 0, obj: 0, mod: 0, cta: 0 }).current;
  const triggered = useRef({ stats: false, obj: false, mod: false, cta: false }).current;

  const [hoveredObj, setHoveredObj] = useState<number | null>(null);
  const [statsCount, setStatsCount] = useState({ schools: 0, students: 0, paperless: 0 });
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  // Continuous Rotation Effect
  useEffect(() => {
    spinAnim.addListener(({ value }) => {
      currentSpin.current = value;
    });
    return () => spinAnim.removeAllListeners();
  }, []);

  const startSpin = () => {
    if (isPaused.current) return;
    const remaining = 1 - currentSpin.current;
    const duration = remaining * 30000; // 30 seconds for a full rotation (smooth & slow)

    Animated.timing(spinAnim, {
      toValue: 1,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        spinAnim.setValue(0);
        currentSpin.current = 0;
        startSpin(); // Loop continuously
      }
    });
  };

  useEffect(() => {
    startSpin();
  }, []);

  const handleHoverIn = () => {
    isPaused.current = true;
    spinAnim.stopAnimation();
  };

  const handleHoverOut = () => {
    isPaused.current = false;
    startSpin();
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const reverseSpin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg']
  });

  // Hero Entrance
  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(fadeAnimBadge, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(fadeAnimTitle, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
        Animated.spring(slideAnimTitle, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
      ]),
      Animated.spring(fadeAnimSub, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.spring(fadeAnimBtns, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(fadeAnimImage, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
        Animated.spring(scaleAnimImage, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ])
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnimImage, { toValue: -15, duration: 2500, useNativeDriver: true }),
          Animated.timing(floatAnimImage, { toValue: 0, duration: 2500, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  // Run Counters ONLY when section is visible
  useEffect(() => {
    if (!isStatsVisible) return;

    let schoolCount = 0;
    let studentCount = 0;
    let paperlessCount = 0;
    const interval = setInterval(() => {
      schoolCount = schoolCount < 500 ? schoolCount + 10 : 500;
      studentCount = studentCount < 50000 ? studentCount + 1000 : 50000;
      paperlessCount = paperlessCount < 100 ? paperlessCount + 2 : 100;

      setStatsCount({ schools: schoolCount, students: studentCount, paperless: paperlessCount });

      if (schoolCount >= 500 && studentCount >= 50000 && paperlessCount >= 100) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [isStatsVisible]);

  // Scroll Handler (Fixed Trigger Logic)
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const triggerPoint = scrollY + height * 0.85;

    if (sectionLayouts.stats > 0 && !triggered.stats && triggerPoint > sectionLayouts.stats) {
      Animated.spring(statsAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
      triggered.stats = true;
      setIsStatsVisible(true);
    }
    if (sectionLayouts.obj > 0 && !triggered.obj && triggerPoint > sectionLayouts.obj) {
      Animated.parallel([
        Animated.spring(objAnim, { toValue: 1, friction: 5, tension: 30, useNativeDriver: true }),
        Animated.spring(infoAnim, { toValue: 1, friction: 7, tension: 30, delay: 200, useNativeDriver: true })
      ]).start();
      triggered.obj = true;
    }
    if (sectionLayouts.mod > 0 && !triggered.mod && triggerPoint > sectionLayouts.mod) {
      Animated.parallel([
        Animated.spring(modAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
        Animated.stagger(150, cardSlideAnims.map(anim => Animated.spring(anim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }))),
        Animated.stagger(150, cardFadeAnims.map(anim => Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true })))
      ]).start();
      triggered.mod = true;
    }
    if (sectionLayouts.cta > 0 && !triggered.cta && triggerPoint > sectionLayouts.cta) {
      Animated.spring(ctaAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
      triggered.cta = true;
    }
  };

  // Math for Responsive Circular Layout
  const circleSize = isDesktop ? 130 : Math.max(Math.min(width * 0.22, 90), 60);
  const circleRadius = isDesktop ? 220 : Math.max(Math.min(width * 0.35, 140), 100);
  const angleStep = (2 * Math.PI) / objectivesData.length;
  const circleContainerHeight = isDesktop ? 550 : (circleRadius * 2) + circleSize + 40;

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" backgroundColor={COLORS.bgWhite} translucent={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >

        {/* --- 1. HERO SECTION (WHITE) --- */}
        <View style={[styles.heroWrapper, { minHeight: height }]}>
          <View style={[styles.heroOverlay, { paddingTop: 140, paddingBottom: 60 }]}>
            <View style={[styles.splitContainer, { flexDirection: isDesktop ? 'row' : 'column' }]}>
              <View style={[styles.leftContent, { alignItems: isDesktop ? 'flex-start' : 'center' }]}>
                <Animated.View style={[styles.heroBadge, { opacity: fadeAnimBadge }]}>
                  <ShieldCheck size={14} color={COLORS.primary} />
                  <Text style={styles.heroBadgeText}>SMART SCHOOL ERP MANAGEMENT SYSTEM</Text>
                </Animated.View>

                <Animated.Text style={[
                  styles.heroTitle,
                  {
                    opacity: fadeAnimTitle,
                    transform: [{ translateY: slideAnimTitle }],
                    fontSize: isDesktop ? 64 : (isTablet ? 48 : 36),
                    lineHeight: isDesktop ? 74 : (isTablet ? 58 : 46),
                    textAlign: isDesktop ? 'left' : 'center'
                  }
                ]}>
                  Centralized Digital{'\n'}
                  <Text style={styles.heroTitleHighlight}>Platform.</Text>
                </Animated.Text>

                <Animated.Text style={[styles.heroSubtitle, {
                  opacity: fadeAnimSub,
                  textAlign: isDesktop ? 'left' : 'center'
                }]}>
                  A complete cloud-based School ERP solution for managing academics, administration, communication, finance, staff, students, and parents.
                </Animated.Text>

                <Animated.View style={[styles.heroButtons, {
                  opacity: fadeAnimBtns,
                  flexDirection: isDesktop ? 'row' : (width < 380 ? 'column' : 'row'),
                  justifyContent: isDesktop ? 'flex-start' : 'center'
                }]}>
                  <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.primaryBtn} activeOpacity={0.8}>
                    <Text style={styles.primaryBtnText}>Get Started</Text>
                    <ArrowRight size={18} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/(public)/contact')} style={styles.secondaryBtn} activeOpacity={0.8}>
                    <Text style={styles.secondaryBtnText}>Request Demo</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              <View style={styles.rightContent}>
                <Animated.Image
                  source={require('../../assets/images/hero-illustration.png')}
                  style={[styles.heroImage, { opacity: fadeAnimImage, transform: [{ scale: scaleAnimImage }, { translateY: floatAnimImage }] }]}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>

        {/* --- 2. STATS SECTION (DARK BROWN) --- */}
        <View
          style={[styles.section, { backgroundColor: COLORS.darkBg, paddingVertical: isDesktop ? 100 : 60 }]}
          onLayout={(e) => { sectionLayouts.stats = e.nativeEvent.layout.y; }}
        >
          <Animated.View style={{ opacity: statsAnim, transform: [{ translateY: statsAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }}>
            {/* Increased Heading Size */}
            <Text style={[styles.sectionTitle, { color: COLORS.white, fontSize: isDesktop ? 48 : 36 }]}>Trusted Worldwide</Text>
            <Text style={[styles.sectionSubtitle, { color: COLORS.accent }]}>Delivering measurable impact through our comprehensive ERP platform.</Text>

            <View style={[styles.statsContainer, { flexDirection: isDesktop || isTablet ? 'row' : 'column', gap: isDesktop ? 80 : 40 }]}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>{statsCount.schools}+</Text>
                <Text style={styles.statBoxLabel}>Institutions</Text>
              </View>
              <View style={[styles.statDivider, { width: isDesktop || isTablet ? 1 : '80%', height: isDesktop || isTablet ? 80 : 1 }]} />
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>{statsCount.students.toLocaleString()}+</Text>
                <Text style={styles.statBoxLabel}>Active Students</Text>
              </View>
              <View style={[styles.statDivider, { width: isDesktop || isTablet ? 1 : '80%', height: isDesktop || isTablet ? 80 : 1 }]} />
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>{statsCount.paperless}%</Text>
                <Text style={styles.statBoxLabel}>Paperless Ops</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* --- 3. PROJECT OBJECTIVES CIRCULAR (WHITE) --- */}
        <View
          style={[styles.section, { backgroundColor: COLORS.bgWhite, paddingVertical: isDesktop ? 120 : 80, overflow: 'hidden' }]}
          onLayout={(e) => { sectionLayouts.obj = e.nativeEvent.layout.y; }}
        >
          <View style={styles.centeredObjContainer}>
            {/* Increased Heading Size */}
            <Text style={[styles.sectionTitle, { fontSize: isDesktop ? 48 : 36 }]}>Why Choose Edvance?</Text>
            <Text style={styles.sectionSubtitle}>
              We bring innovation to your fingertips. Hover over the interactive spheres to explore our core values.
            </Text>

            {/* Split Layout: Circles on Left, Information on Right */}
            <View style={[styles.objSplitWrapper, { flexDirection: isDesktop ? 'row' : 'column' }]}>

              {/* Left Side: Circular Explosion Layout with Infinite Spin & Hover Pause */}
              <Pressable
                style={[styles.circleContainer, { height: circleContainerHeight, width: isDesktop ? '55%' : '100%' }]}
                onHoverIn={handleHoverIn}
                onHoverOut={handleHoverOut}
                onPressIn={handleHoverIn}
                onPressOut={handleHoverOut}
              >
                <Animated.View style={{
                  ...StyleSheet.absoluteFillObject,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ rotate: spin }]
                }}>
                  {/* Center Circle with Edvance Image & Text */}
                  <Animated.View style={[
                    styles.orbitCircle,
                    {
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                      zIndex: 10,
                      borderColor: COLORS.primary,
                      borderWidth: 4,
                      transform: [{ rotate: reverseSpin }] // Counter-rotate so it stays upright
                    }
                  ]}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80' }}
                      style={styles.orbitImage}
                    />
                    <View style={styles.orbitImageOverlay}>
                      <Text style={[styles.orbitTextHovered, { fontSize: isDesktop ? 18 : 14, color: COLORS.accent, fontWeight: '900' }]}>Edvance</Text>
                    </View>
                  </Animated.View>

                  {/* Surrounding Objective Orbits Animating OUT from the center */}
                  {objectivesData.map((obj, i) => {
                    const x = Math.cos(i * angleStep) * circleRadius;
                    const y = Math.sin(i * angleStep) * circleRadius;

                    return (
                      <Animated.View
                        key={i}
                        style={[
                          styles.orbitItem,
                          {
                            zIndex: 1,
                            transform: [
                              { translateX: objAnim.interpolate({ inputRange: [0, 1], outputRange: [0, x] }) },
                              { translateY: objAnim.interpolate({ inputRange: [0, 1], outputRange: [0, y] }) },
                              { scale: objAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) },
                              { rotate: reverseSpin } // Counter-rotate so images/text stay upright!
                            ]
                          }
                        ]}
                      >
                        <Pressable
                          onHoverIn={() => setHoveredObj(i)}
                          onHoverOut={() => setHoveredObj(null)}
                          onPressIn={() => setHoveredObj(i)}
                          onPressOut={() => setHoveredObj(null)}
                          style={[
                            styles.orbitCircle,
                            { width: circleSize, height: circleSize, borderRadius: circleSize / 2 },
                            hoveredObj === i && styles.orbitCircleHovered
                          ]}
                        >
                          <Image source={{ uri: obj.img }} style={styles.orbitImage} />
                          <View style={styles.orbitImageOverlay}>
                            <Text style={[styles.orbitTextHovered, { fontSize: isDesktop ? 14 : 10 }]}>{obj.title}</Text>
                          </View>
                        </Pressable>
                      </Animated.View>
                    );
                  })}
                </Animated.View>
              </Pressable>

              {/* Right Side: Additional Information Animated via infoAnim */}
              <Animated.View style={[
                styles.objRightContent,
                {
                  width: isDesktop ? '40%' : '100%',
                  marginTop: isDesktop ? 0 : 40,
                  opacity: infoAnim,
                  transform: [{ translateX: infoAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }]
                }
              ]}>
                <Text style={styles.objRightTitle}>Transforming Education with Technology</Text>
                <Text style={styles.objRightDesc}>
                  Edvance ERP is built from the ground up to empower educational institutions. Our platform ensures that every stakeholder—from administrators to parents—experiences a seamless, transparent, and highly efficient workflow.
                </Text>

                {whyChooseUsBullets.map((bullet, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <CheckCircle2 size={20} color={COLORS.primary} />
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}

                {/* Routed to features instead of about */}
                <TouchableOpacity
                  style={styles.objLearnMoreBtn}
                  activeOpacity={0.8}
                  onPress={() => router.push('/(public)/features')}
                >
                  <Text style={styles.objLearnMoreText}>Discover More</Text>
                  <ArrowRight size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </Animated.View>

            </View>
          </View>
        </View>

        {/* --- 4. COMPREHENSIVE MODULES (DARK BROWN) --- */}
        <View
          style={[styles.section, { backgroundColor: COLORS.darkBg, paddingVertical: 100 }]}
          onLayout={(e) => { sectionLayouts.mod = e.nativeEvent.layout.y; }}
        >
          <Animated.View style={{ opacity: modAnim, transform: [{ translateY: modAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }}>
            {/* Increased Heading Size */}
            <Text style={[styles.sectionTitle, { color: COLORS.white, textAlign: 'center', fontSize: isDesktop ? 48 : 36 }]}>Comprehensive Modules</Text>
            <Text style={[styles.sectionSubtitle, { color: COLORS.accent, textAlign: 'center', marginBottom: 60 }]}>Role-based access with separate dashboards and permissions.</Text>

            <View style={styles.modulesGrid}>
              {dprModules.map((module, idx) => (
                <Animated.View
                  key={idx}
                  style={[
                    styles.imageModuleCardWrapper,
                    { width: isDesktop ? '31%' : (isTablet ? '48%' : '100%') },
                    {
                      opacity: cardFadeAnims[idx],
                      transform: [{ translateY: cardSlideAnims[idx] }]
                    }
                  ]}
                >
                  <TouchableOpacity activeOpacity={0.95} style={styles.imageModuleCard}>
                    {/* Image height adjusted and width set to 90% to match screenshot offset */}
                    <Image source={{ uri: module.img }} style={styles.imageModuleImg} resizeMode="cover" />

                    {/* Overlapping White Card UI offset to the right */}
                    <View style={styles.imageModuleOverlayCard}>
                      <Text style={styles.imageModuleTag}>{module.tag}</Text>
                      <Text style={styles.imageModuleTitle}>{module.title}</Text>
                      <Text style={styles.imageModuleDesc}>{module.desc}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* --- 5. CTA SECTION (WHITE) --- */}
        <View
          style={styles.ctaSection}
          onLayout={(e) => { sectionLayouts.cta = e.nativeEvent.layout.y; }}
        >
          <Animated.View style={[styles.ctaContent, { opacity: ctaAnim, transform: [{ translateY: ctaAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            {/* Increased Heading Size */}
            <Text style={[styles.ctaTitle, { fontSize: isDesktop ? 48 : 36 }]}>Ready to Transform Your Campus?</Text>
            <Text style={styles.ctaSubtitle}>Join forward-thinking schools using Edvance ERP today and step into the future of education.</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.ctaBtn} activeOpacity={0.9}>
              <Text style={styles.ctaBtnText}>Start Your Free Trial</Text>
              <Rocket size={18} color={COLORS.white} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* --- 6. FOOTER (DARK BROWN) --- */}
        <PublicFooter />

      </ScrollView>
      <PublicNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bgWhite },
  scrollView: { flex: 1 },

  // --- HERO SECTION ---
  heroWrapper: { width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: COLORS.bgWhite },
  
  // FIX APPLIED HERE: Removing 'position: absolute' allows content to naturally stretch downwards
  heroOverlay: {
    flex: 1,
    paddingHorizontal: 24, 
    justifyContent: 'center', 
    zIndex: 10,
  },
  
  splitContainer: {
    alignItems: 'center', justifyContent: 'space-between',
    width: '100%', maxWidth: 1400, alignSelf: 'center', gap: 40,
  },
  leftContent: { flex: 1, width: '100%' },
  rightContent: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  heroImage: { width: '100%', height: 350, minHeight: 350, maxWidth: 700 },
  heroBadge: {
    backgroundColor: 'rgba(227, 83, 54, 0.1)', borderRadius: 999,
    paddingHorizontal: 16, paddingVertical: 8, marginBottom: 24,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(227, 83, 54, 0.3)', alignSelf: 'flex-start'
  },
  heroBadgeText: { color: COLORS.primary, fontSize: 10, fontWeight: '700', marginLeft: 8, letterSpacing: 1 },
  heroTitle: {
    fontWeight: '900', color: COLORS.textPrimary,
    letterSpacing: -1.5, marginBottom: 20,
  },
  heroTitleHighlight: { color: COLORS.primary },
  heroSubtitle: {
    fontSize: 16, color: COLORS.textSecondary,
    lineHeight: 28, fontWeight: '500', maxWidth: 600, marginBottom: 36,
  },
  heroButtons: { gap: 16, width: '100%' },
  primaryBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 16,
    borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  primaryBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16, marginRight: 8 },
  secondaryBtn: {
    backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.primary,
    paddingHorizontal: 32, paddingVertical: 16, borderRadius: 999, justifyContent: 'center', alignItems: 'center'
  },
  secondaryBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 16 },

  // --- STATS SECTION ---
  statsContainer: {
    justifyContent: 'center', alignItems: 'center',
    marginTop: 40,
  },
  statBox: { alignItems: 'center', width: '100%', maxWidth: 200 },
  statBoxValue: { fontSize: 48, fontWeight: '900', color: COLORS.primary, textAlign: 'center' },
  statBoxLabel: { fontSize: 16, color: COLORS.white, marginTop: 8, fontWeight: '600', letterSpacing: 1, textAlign: 'center' },
  statDivider: { backgroundColor: 'rgba(255,255,255,0.1)' },

  // --- INTERACTIVE CIRCLE OBJECTIVES SPLIT LAYOUT ---
  centeredObjContainer: {
    alignItems: 'center', justifyContent: 'center',
    width: '100%', maxWidth: 1400, alignSelf: 'center',
  },
  objSplitWrapper: {
    width: '100%', alignItems: 'center', justifyContent: 'space-between', marginTop: 20
  },
  circleContainer: {
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  orbitItem: { position: 'absolute' },
  orbitCircle: {
    backgroundColor: COLORS.cardLight,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.textPrimary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 15, elevation: 8,
    borderWidth: 3, borderColor: COLORS.bgWhite, overflow: 'hidden',
  },
  orbitCircleHovered: {
    transform: [{ scale: 1.15 }],
    shadowOpacity: 0.4, shadowRadius: 20,
    borderColor: COLORS.primary, zIndex: 20,
  },
  orbitImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  orbitImageOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(42, 19, 8, 0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  orbitTextHovered: {
    color: COLORS.white, fontWeight: '800', textAlign: 'center', paddingHorizontal: 4, letterSpacing: 0.5,
  },

  // Right side Info Styling
  objRightContent: {
    justifyContent: 'center', paddingHorizontal: 16,
  },
  objRightTitle: {
    fontSize: 28, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 16, letterSpacing: -0.5,
  },
  objRightDesc: {
    fontSize: 16, color: COLORS.textSecondary, lineHeight: 26, marginBottom: 24,
  },
  bulletRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12,
  },
  bulletText: {
    fontSize: 16, color: COLORS.textPrimary, fontWeight: '600', flex: 1,
  },
  objLearnMoreBtn: {
    flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8, alignSelf: 'flex-start'
  },
  objLearnMoreText: {
    fontSize: 16, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5,
  },

  // --- SECTIONS ---
  section: { paddingHorizontal: 24 },
  sectionTitle: { fontWeight: '900', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 16, letterSpacing: -0.5 },
  sectionSubtitle: { color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24, fontSize: 16, maxWidth: 600, alignSelf: 'center', lineHeight: 24 },

  // --- NEW MODULES GRID (OVERLAPPING CARDS UI) ---
  modulesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, width: '100%',
  },
  imageModuleCardWrapper: {
    marginBottom: 40,
  },
  imageModuleCard: {
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    alignItems: 'flex-start', // Ensures image stays left-aligned
  },
  imageModuleImg: {
    width: '90%', // Reduced width so card can stick out on the right
    height: 350,
    borderRadius: 24,
    backgroundColor: '#3E1F0D',
  },
  imageModuleOverlayCard: {
    backgroundColor: COLORS.bgWhite,
    alignSelf: 'flex-end', // Aligns the card to the right edge of the container
    width: '90%', // Same width as image but shifted
    marginTop: -70, // Overlap deeply into the image
    borderRadius: 24, // Matches the smooth rounded corners
    padding: 28,
    minHeight: 150, // Ensures a minimum white space area
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  imageModuleTag: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  imageModuleTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  imageModuleDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // --- CTA SECTION (WHITE BG) ---
  ctaSection: { backgroundColor: COLORS.bgWhite, paddingVertical: 100, paddingHorizontal: 24, alignItems: 'center' },
  ctaContent: { maxWidth: 800, alignItems: 'center' },
  ctaTitle: { fontWeight: '900', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 16, letterSpacing: -1 },
  ctaSubtitle: { fontSize: 18, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 40, lineHeight: 28 },
  ctaBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 36, paddingVertical: 18,
    borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  ctaBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 18 },
});