import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import PublicFooter from '../components/common/PublicFooter';
import PublicNavbar from '../components/common/PublicNavbar';

import { FontAwesome5 } from '@expo/vector-icons';
import {
  Mail,
  MapPin,
  Phone,
  Rocket,
  Send
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

export default function ContactScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  
  // Responsive Breakpoints
  const isDesktop = width >= 1024;
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    phone: '',
    message: ''
  });

  // Header Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(30)).current;
  
  // Content Animations
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentLeftSlide = useRef(new Animated.Value(-100)).current;
  const contentRightSlide = useRef(new Animated.Value(100)).current;
  
  // Scroll tracking
  const layoutY = useRef(0);
  const triggered = useRef(false);

  useEffect(() => {
    // Header Initial Animation
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();
  }, []);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const triggerPoint = scrollY + height * 0.85; 

    if (!triggered.current && layoutY.current > 0 && triggerPoint > layoutY.current) {
      triggered.current = true;
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(contentLeftSlide, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
        Animated.spring(contentRightSlide, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true })
      ]).start();
    }
  };

  const handleSubmit = () => {
    // Basic validation & submit logic
    if(!formData.name || !formData.email) {
      alert("Please fill in your Name and Email.");
      return;
    }
    alert("Demo Request Sent Successfully! We will contact you soon.");
    setFormData({ name: '', email: '', school: '', phone: '', message: '' });
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
          source={{ uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80' }} 
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            <Animated.View style={[styles.headerContent, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
              <View style={styles.badgeWrapper}>
                <Text style={styles.badgeText}>GET IN TOUCH</Text>
              </View>
              <Text style={[styles.title, { fontSize: isDesktop ? 64 : 40 }]}>Contact Us</Text>
              <Text style={styles.subtitle}>
                Ready to transform your institution? Request a demo or reach out to our team for any inquiries.
              </Text>
            </Animated.View>
          </View>
        </ImageBackground>

        {/* --- CONTACT SECTION (SPLIT LAYOUT) --- */}
        <View 
          style={styles.contactSection}
          onLayout={(e) => { layoutY.current = e.nativeEvent.layout.y; }}
        >
          <View style={[styles.contactContainer, { flexDirection: isDesktop ? 'row' : 'column' }]}>
            
            {/* LEFT: Contact Information */}
            <Animated.View 
              style={[
                styles.contactInfoWrapper, 
                { width: isDesktop ? '45%' : '100%', marginBottom: isDesktop ? 0 : 40 },
                { opacity: contentFade, transform: [{ translateX: contentLeftSlide }] }
              ]}
            >
              <Text style={styles.infoTitle}>Let's start a conversation</Text>
              <Text style={styles.infoDesc}>
                Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.
              </Text>

              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <View style={styles.iconBox}>
                    <Mail size={24} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.itemLabel}>Email Us</Text>
                    <Text style={styles.itemValue}>hello@edvance.com</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.iconBox}>
                    <Phone size={24} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.itemLabel}>Call Us</Text>
                    <Text style={styles.itemValue}>+1 (800) 123-4567</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.iconBox}>
                    <MapPin size={24} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.itemLabel}>Visit Us</Text>
                    <Text style={styles.itemValue}>123 Education Lane, Tech City, TX 75001</Text>
                  </View>
                </View>
              </View>

              {/* Social Links with FontAwesome5 Icons */}
              <Text style={styles.socialTitle}>Follow Us</Text>
              <View style={styles.socialLinks}>
                <TouchableOpacity style={styles.socialIcon} activeOpacity={0.8}>
                  <FontAwesome5 name="facebook-f" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon} activeOpacity={0.8}>
                  <FontAwesome5 name="twitter" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon} activeOpacity={0.8}>
                  <FontAwesome5 name="instagram" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon} activeOpacity={0.8}>
                  <FontAwesome5 name="linkedin-in" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* RIGHT: Demo Request Form */}
            <Animated.View 
              style={[
                styles.formWrapper, 
                { width: isDesktop ? '50%' : '100%' },
                { opacity: contentFade, transform: [{ translateX: contentRightSlide }] }
              ]}
            >
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Request a Free Demo</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="John Doe" 
                    placeholderTextColor="#9CA3AF"
                    value={formData.name}
                    onChangeText={(text) => setFormData({...formData, name: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="john@school.edu" 
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})}
                  />
                </View>

                <View style={[styles.inputRow, { flexDirection: isDesktop || width > 600 ? 'row' : 'column' }]}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>School/Institution</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Edvance Academy" 
                      placeholderTextColor="#9CA3AF"
                      value={formData.school}
                      onChangeText={(text) => setFormData({...formData, school: text})}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="+1 (xxx) xxx-xxxx" 
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      value={formData.phone}
                      onChangeText={(text) => setFormData({...formData, phone: text})}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>How can we help you?</Text>
                  <TextInput 
                    style={styles.textArea} 
                    placeholder="Tell us about your requirements..." 
                    placeholderTextColor="#9CA3AF"
                    multiline={true}
                    numberOfLines={4}
                    value={formData.message}
                    onChangeText={(text) => setFormData({...formData, message: text})}
                  />
                </View>

                <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn} activeOpacity={0.9}>
                  <Text style={styles.submitBtnText}>Request Demo</Text>
                  <Send size={18} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </Animated.View>

          </View>
        </View>

        {/* --- BOTTOM CTA --- */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, { fontSize: isDesktop ? 48 : 32 }]}>Ready to Transform Your Campus?</Text>
          <Text style={styles.ctaSubtitle}>Join forward-thinking schools using Edvance ERP today and step into the future of education.</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.ctaBtn} activeOpacity={0.9}>
            <Text style={styles.ctaBtnText}>Start Your Free Trial</Text>
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

  /* CONTACT SECTION */
  contactSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    backgroundColor: COLORS.bgWhite,
  },
  contactContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },

  /* LEFT: CONTACT INFO */
  contactInfoWrapper: {
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: -1,
  },
  infoDesc: {
    fontSize: 18,
    color: COLORS.textSecondary,
    lineHeight: 28,
    marginBottom: 40,
    maxWidth: 500,
  },
  infoList: {
    gap: 32,
    marginBottom: 48,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(244, 164, 96, 0.15)', // Sandy Orange light
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemValue: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(227, 83, 54, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(227, 83, 54, 0.2)',
  },

  /* RIGHT: FORM */
  formWrapper: {
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 24,
    padding: 32,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(244, 164, 96, 0.2)',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 32,
  },
  inputRow: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: 'rgba(160, 82, 45, 0.2)', // Sienna with low opacity
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  textArea: {
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: 'rgba(160, 82, 45, 0.2)',
    borderRadius: 12,
    minHeight: 120,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
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