import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PublicNavbar from '../components/common/PublicNavbar';


import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Bus,
  Calendar,
  CheckCircle,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  Gift,
  Globe,
  GraduationCap,
  Headphones,
  Heart,
  LayoutDashboard,
  Library,
  Lock,
  MessageSquare,
  Phone,
  RefreshCw,
  Rocket,
  School,
  Settings,
  Smartphone,
  Sparkles,
  Star,
  UserCheck,
  UserCog,
  Users
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [statsCount, setStatsCount] = useState({ schools: 0, students: 0, teachers: 0 });

  useEffect(() => {
    // Force status bar to blue on this screen
    if (Platform.OS === 'android') {
      RNStatusBar.setBackgroundColor('#2563eb');
      RNStatusBar.setBarStyle('light-content');
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const interval = setInterval(() => {
      setStatsCount(prev => ({
        schools: prev.schools < 500 ? prev.schools + 25 : 500,
        students: prev.students < 50000 ? prev.students + 2500 : 50000,
        teachers: prev.teachers < 10000 ? prev.teachers + 500 : 10000,
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Web grid styles
  const webGrid3 = isWeb ? { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 } as any : {};
  const webGrid4 = isWeb ? { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 } as any : {};
  const webGrid5 = isWeb ? { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 } as any : {};

  return (
    <View style={styles.mainContainer}>
      {/* StatusBar explicitly set here so it always shows blue on this screen */}
      <StatusBar style="light" backgroundColor="#2563eb" translucent={false} />

      <PublicNavbar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View
            style={[styles.heroContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.heroBadge}>
              <Sparkles size={14} color="white" />
              <Text style={styles.heroBadgeText}>NEXT-GEN SCHOOL MANAGEMENT</Text>
            </View>
            <Text style={styles.heroTitle}>
              Smart <Text style={styles.heroTitleHighlight}>ERP</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Complete School Management System
            </Text>
            <Text style={styles.heroDescription}>
              Automate academics, administration, communication & finance with our all-in-one solution
            </Text>

            <View style={styles.heroButtons}>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                style={styles.loginBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.loginBtnText}>Login</Text>
                <ArrowRight size={18} color="#1d4ed8" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/register')}
                style={styles.getStartedBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.getStartedBtnText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* Stats Counter Section */}
        <View style={isWeb ? styles.statsContainerWeb : styles.statsContainer}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <School size={32} color="#2563eb" />
              <Text style={styles.statValue}>{statsCount.schools}+</Text>
              <Text style={styles.statLabel}>Schools</Text>
            </View>
            <View style={styles.statDivider}>
              <GraduationCap size={32} color="#16a34a" />
              <Text style={[styles.statValue, styles.greenText]}>{statsCount.students.toLocaleString()}+</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={32} color="#ea580c" />
              <Text style={[styles.statValue, styles.orangeText]}>{statsCount.teachers.toLocaleString()}+</Text>
              <Text style={styles.statLabel}>Teachers</Text>
            </View>
          </View>
        </View>

        {/* Why Choose Us Section - Grid 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          <Text style={styles.sectionSubtitle}>Trusted by 500+ schools across India</Text>

          <View style={isWeb ? webGrid3 : styles.grid2Mobile}>
            {whyChoose.map((item, idx) => (
              <View key={idx} style={[styles.whyCard, !isWeb && { width: '48%', marginBottom: 16 }]}>
                <View style={styles.iconCircle}>{item.icon}</View>
                <Text style={styles.whyTitle}>{item.title}</Text>
                <Text style={styles.whyDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section - Grid 4 */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Powerful Features</Text>
          <Text style={styles.sectionSubtitle}>Everything you need to manage your school</Text>

          <View style={isWeb ? webGrid4 : styles.grid2Mobile}>
            {features.map((feature, idx) => (
              <View key={idx} style={[styles.featureCard, !isWeb && { width: '48%', marginBottom: 16 }]}>
                <View style={styles.featureIconBox}>{feature.icon}</View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Roles Section - Grid 5 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Roles</Text>
          <Text style={styles.sectionSubtitle}>Role-based dashboards with specific permissions</Text>

          <View style={isWeb ? webGrid5 : styles.grid3Mobile}>
            {roles.map((role, idx) => (
              <View key={idx} style={[styles.roleCard, !isWeb && { width: '31%', marginBottom: 12 }, { backgroundColor: role.bgColor }]}>
                {role.icon}
                <Text style={styles.roleTitle}>{role.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonials Section - Grid 3 */}
        <View style={styles.testimonialsSection}>
          <Text style={[styles.sectionTitle, styles.whiteText]}>What Schools Say</Text>
          <Text style={[styles.sectionSubtitle, styles.indigoText]}>Trusted by educators nationwide</Text>

          {isWeb ? (
            <View style={webGrid3}>
              {testimonials.map((item, idx) => (
                <View key={idx} style={styles.testimonialCard}>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} color="#facc15" fill="#facc15" />
                    ))}
                  </View>
                  <Text style={styles.testimonialText}>{item.text}</Text>
                  <View style={styles.testimonialAuthor}>
                    <View style={styles.authorAvatar}>
                      <Text style={styles.authorInitial}>{item.name[0]}</Text>
                    </View>
                    <View style={styles.authorInfo}>
                      <Text style={styles.authorName}>{item.name}</Text>
                      <Text style={styles.authorRole}>{item.role}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {testimonials.map((item, idx) => (
                <View key={idx} style={styles.testimonialCardMobile}>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} color="#facc15" fill="#facc15" />
                    ))}
                  </View>
                  <Text style={styles.testimonialText}>{item.text}</Text>
                  <View style={styles.testimonialAuthor}>
                    <View style={styles.authorAvatar}>
                      <Text style={styles.authorInitial}>{item.name[0]}</Text>
                    </View>
                    <View style={styles.authorInfo}>
                      <Text style={styles.authorName}>{item.name}</Text>
                      <Text style={styles.authorRole}>{item.role}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Contact Section with CTA */}
        <View style={styles.section}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Transform Your School?</Text>
            <Text style={styles.ctaSubtitle}>Join 500+ schools already using our ERP</Text>

            <View style={styles.ctaButtons}>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/register')}
                style={styles.ctaPrimaryBtn}
              >
                <Text style={styles.ctaPrimaryText}>Start Free Trial</Text>
                <Rocket size={18} color="#1d4ed8" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(public)/contact')}
                style={styles.ctaSecondaryBtn}
              >
                <Headphones size={18} color="white" />
                <Text style={styles.ctaSecondaryText}>Contact Sales</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>SVPS School ERP</Text>
          <Text style={styles.footerText}>Complete School Management Solution</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => router.push('/(public)/home')}>
              <Text style={styles.footerLink}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Register</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.copyright}>© 2025 SVPS School. All rights reserved.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

// Data arrays
const whyChoose = [
  { title: 'Cloud Based', description: 'Access anywhere, anytime', icon: <Globe size={24} color="#2563eb" /> },
  { title: 'Secure', description: 'Bank-level data security', icon: <Lock size={24} color="#2563eb" /> },
  { title: 'Mobile App', description: 'iOS & Android support', icon: <Smartphone size={24} color="#2563eb" /> },
  { title: 'Fast Support', description: '24/7 dedicated support', icon: <Headphones size={24} color="#2563eb" /> },
  { title: 'Affordable', description: 'Best pricing in market', icon: <Gift size={24} color="#2563eb" /> },
  { title: 'Regular Updates', description: 'Monthly feature updates', icon: <RefreshCw size={24} color="#2563eb" /> },
];

const features = [
  { title: 'Student Management', description: 'Admissions, profiles, documents', icon: <GraduationCap size={20} color="white" /> },
  { title: 'Staff Management', description: 'Teachers & non-teaching staff', icon: <Users size={20} color="white" /> },
  { title: 'Smart Attendance', description: 'Biometric, QR, offline sync', icon: <UserCheck size={20} color="white" /> },
  { title: 'Timetable', description: 'Auto-generated schedules', icon: <Calendar size={20} color="white" /> },
  { title: 'Examination', description: 'Online exams, marks entry', icon: <FileText size={20} color="white" /> },
  { title: 'Fee Management', description: 'Online payments, receipts', icon: <CreditCard size={20} color="white" /> },
  { title: 'Transport', description: 'Live GPS tracking', icon: <Bus size={20} color="white" /> },
  { title: 'Communication', description: 'SMS, email, in-app chat', icon: <MessageSquare size={20} color="white" /> },
  { title: 'Library', description: 'Book catalog, issue/return', icon: <Library size={20} color="white" /> },
  { title: 'Analytics', description: 'Reports & insights', icon: <BarChart3 size={20} color="white" /> },
  { title: 'Payroll', description: 'Staff salary management', icon: <DollarSign size={20} color="white" /> },
  { title: 'Inventory', description: 'Asset & stock management', icon: <Settings size={20} color="white" /> },
];

const roles = [
  { title: 'Super Admin', icon: <UserCog size={24} color="#6b21a5" />, bgColor: '#f3e8ff' },
  { title: 'Admin', icon: <LayoutDashboard size={24} color="#2563eb" />, bgColor: '#dbeafe' },
  { title: 'Principal', icon: <Award size={24} color="#4f46e5" />, bgColor: '#e0e7ff' },
  { title: 'Vice Principal', icon: <ClipboardList size={24} color="#0891b2" />, bgColor: '#cffafe' },
  { title: 'Teacher', icon: <Users size={24} color="#16a34a" />, bgColor: '#dcfce7' },
  { title: 'Student', icon: <GraduationCap size={24} color="#ca8a04" />, bgColor: '#fef9c3' },
  { title: 'Parent', icon: <Heart size={24} color="#ea580c" />, bgColor: '#ffedd5' },
  { title: 'Driver', icon: <Bus size={24} color="#dc2626" />, bgColor: '#fee2e2' },
  { title: 'Librarian', icon: <BookOpen size={24} color="#0d9488" />, bgColor: '#ccfbf1' },
  { title: 'Receptionist', icon: <Phone size={24} color="#db2777" />, bgColor: '#fce7f3' },
  { title: 'Housekeeping', icon: <CheckCircle size={24} color="#4b5563" />, bgColor: '#e5e7eb' },
];

const testimonials = [
  { name: 'Dr. Suresh Kumar', role: 'Principal, Delhi Public School', text: 'SVPS ERP transformed our school management completely. Highly recommended!' },
  { name: 'Mrs. Priya Sharma', role: "Admin, St. Mary's School", text: 'Amazing platform! Fee collection and attendance tracking is now effortless.' },
  { name: 'Mr. Rajesh Verma', role: 'Parent', text: "I can track my child's progress, fees, and bus location in real-time." },
];

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Section
  heroSection: { backgroundColor: '#2563eb', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 80 },
  heroContent: { alignItems: 'center' },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 16, flexDirection: 'row' },
  heroBadgeText: { color: 'white', fontSize: 12, fontWeight: '600', marginLeft: 8 },
  heroTitle: { fontSize: 48, fontWeight: '800', color: 'white', textAlign: 'center' },
  heroTitleHighlight: { color: '#facc15' },
  heroSubtitle: { fontSize: 20, color: '#bfdbfe', textAlign: 'center', marginTop: 12, fontWeight: '300' },
  heroDescription: { color: '#bfdbfe', textAlign: 'center', marginTop: 8, fontSize: 14, maxWidth: 400, opacity: 0.9 },
  heroButtons: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  loginBtn: { backgroundColor: 'white', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 999, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  loginBtnText: { color: '#1d4ed8', fontWeight: 'bold', fontSize: 16, marginRight: 8 },
  getStartedBtn: { backgroundColor: 'transparent', borderWidth: 2, borderColor: 'white', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 999, marginLeft: 16 },
  getStartedBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },

  // Stats Section
  statsContainer: { paddingHorizontal: 16, marginTop: -32 },
  statsContainerWeb: { paddingHorizontal: 24, marginTop: -32 },
  statsCard: { backgroundColor: 'white', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, padding: 20, flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: { alignItems: 'center', flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 16 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#2563eb', marginTop: 8 },
  greenText: { color: '#16a34a' },
  orangeText: { color: '#ea580c' },
  statLabel: { color: '#6b7280', fontSize: 12, marginTop: 4 },

  // Section Common
  section: { paddingHorizontal: 24, paddingVertical: 48 },
  sectionTitle: { fontSize: 30, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 8 },
  sectionSubtitle: { color: '#6b7280', textAlign: 'center', marginBottom: 40 },
  featuresSection: { backgroundColor: '#f3f4f6', paddingHorizontal: 24, paddingVertical: 48, marginTop: 16 },

  // Grid Layouts (mobile only)
  grid2Mobile: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  grid3Mobile: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  // Cards
  whyCard: { backgroundColor: '#f9fafb', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  iconCircle: { width: 48, height: 48, backgroundColor: '#dbeafe', borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  whyTitle: { fontWeight: 'bold', color: '#111827', fontSize: 16 },
  whyDescription: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  featureCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, borderWidth: 1, borderColor: '#e5e7eb' },
  featureIconBox: { width: 40, height: 40, backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  featureTitle: { fontWeight: 'bold', color: '#1f2937' },
  featureDescription: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  roleCard: { padding: 12, borderRadius: 12, alignItems: 'center' },
  roleTitle: { fontWeight: '600', color: '#1f2937', fontSize: 12, textAlign: 'center', marginTop: 4 },

  // Testimonials
  testimonialsSection: { backgroundColor: '#312e81', paddingHorizontal: 24, paddingVertical: 48 },
  whiteText: { color: 'white' },
  indigoText: { color: '#a5b4fc' },
  testimonialCard: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 16 },
  testimonialCardMobile: { width: 288, backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 16, marginHorizontal: 8 },
  starsRow: { flexDirection: 'row', marginBottom: 8 },
  testimonialText: { color: 'white', fontSize: 14, lineHeight: 20 },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  authorAvatar: { width: 40, height: 40, backgroundColor: '#6366f1', borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  authorInitial: { color: 'white', fontWeight: 'bold' },
  authorInfo: { marginLeft: 12 },
  authorName: { color: 'white', fontWeight: '600', fontSize: 14 },
  authorRole: { color: '#c7d2fe', fontSize: 12 },
  horizontalScroll: { marginHorizontal: -8 },

  // CTA
  ctaCard: { backgroundColor: '#2563eb', borderRadius: 24, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  ctaTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  ctaSubtitle: { color: '#bfdbfe', textAlign: 'center', marginBottom: 24 },
  ctaButtons: { flexDirection: 'row', justifyContent: 'center' },
  ctaPrimaryBtn: { backgroundColor: 'white', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  ctaPrimaryText: { color: '#1d4ed8', fontWeight: 'bold', marginRight: 8 },
  ctaSecondaryBtn: { backgroundColor: 'transparent', borderWidth: 2, borderColor: 'white', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, flexDirection: 'row', alignItems: 'center' },
  ctaSecondaryText: { color: 'white', fontWeight: '600', marginLeft: 8 },

  // Footer
  footer: { backgroundColor: '#111827', paddingHorizontal: 24, paddingVertical: 32, marginTop: 16 },
  footerTitle: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  footerText: { color: '#9ca3af', textAlign: 'center', fontSize: 12, marginBottom: 16 },
  footerLinks: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 16 },
  footerLink: { color: '#9ca3af', fontSize: 12 },
  copyright: { color: '#6b7280', textAlign: 'center', fontSize: 12 },
});