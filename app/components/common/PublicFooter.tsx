import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Mail, MapPin } from 'lucide-react-native';
import { Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

const isWeb = Platform.OS === 'web';

const COLORS = {
  bg: '#2A1308', // Very deep brown/almost black for contrast
  accent: '#F4A460', // Sandy Orange
  primary: '#E35336', // Terracotta
  textLight: '#F5F5DC', // Beige/Off-white for readability
  textMuted: 'rgba(245, 245, 220, 0.6)', // Faded beige
  divider: 'rgba(244, 164, 96, 0.2)', // Subtle orange line
};

export default function PublicFooter() {
  const router = useRouter();
  
  // Using useWindowDimensions for dynamic responsiveness on resize
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const quickLinks = [
    { name: 'Home', path: '/(public)/home' },
    { name: 'Features', path: '/(public)/features' },
    { name: 'Roles', path: '/(public)/roles' },
    { name: 'About Us', path: '/(public)/about' },
    { name: 'Contact', path: '/(public)/contact' },
  ];

  return (
    <View style={styles.footerContainer}>
      <View style={[styles.topSection, !isDesktop && styles.topSectionMobile]}>
        
        {/* Column 1: Brand Info & Socials */}
        <View style={[styles.column, styles.brandColumn, !isDesktop && styles.columnMobile]}>
          <Text style={styles.brandName}>
            Edvance<Text style={styles.brandDot}>.</Text>
          </Text>
          <Text style={styles.brandDesc}>
            The intelligent ERP for modern education. Unifying academics, administration, and finance into one beautifully crafted platform.
          </Text>
          
          {/* Social Media Icons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.8}>
              <FontAwesome5 name="facebook-f" size={16} color={COLORS.bg} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.8}>
              <FontAwesome5 name="twitter" size={16} color={COLORS.bg} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.8}>
              <FontAwesome5 name="instagram" size={16} color={COLORS.bg} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.8}>
              <FontAwesome5 name="linkedin-in" size={16} color={COLORS.bg} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Column 2: Quick Links */}
        <View style={[styles.column, !isDesktop && styles.columnMobile]}>
          <Text style={styles.columnTitle}>Quick Links</Text>
          <View style={styles.linksContainer}>
            {quickLinks.map((link, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => router.push(link.path as any)}
                style={styles.linkItem}
              >
                <Text style={styles.linkText}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Column 3: Contact Details */}
        <View style={[styles.column, !isDesktop && styles.columnMobile]}>
          <Text style={styles.columnTitle}>Contact Us</Text>
          <View style={styles.contactContainer}>
            <View style={styles.contactItem}>
              <MapPin size={18} color={COLORS.accent} />
              <Text style={styles.contactText}>Hyderabad, Telangana, India</Text>
            </View>
            {/* Phone Number Removed as requested */}
            <View style={styles.contactItem}>
              <Mail size={18} color={COLORS.accent} />
              <Text style={styles.contactText}>support@edvance.com</Text>
            </View>
          </View>
        </View>

      </View>

      {/* Bottom Section: Copyright */}
      <View style={[styles.bottomSection, !isDesktop && styles.bottomSectionMobile]}>
        <Text style={styles.copyrightText}>
          © {new Date().getFullYear()} Edvance School ERP. All rights reserved.
        </Text>
        {isDesktop && (
          <View style={styles.legalLinks}>
            <TouchableOpacity><Text style={styles.legalText}>Privacy Policy</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.legalText}>Terms of Service</Text></TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: COLORS.bg,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: isWeb ? 40 : 24,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  topSectionMobile: {
    flexDirection: 'column',
    gap: 40,
  },
  column: {
    flex: 1,
  },
  columnMobile: {
    width: '100%',
    alignItems: 'flex-start',
  },
  brandColumn: {
    flex: 1.5,
    paddingRight: isWeb ? 40 : 0,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textLight,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  brandDot: {
    color: COLORS.primary,
  },
  brandDesc: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 24,
    maxWidth: 350,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 20,
  },
  linksContainer: {
    gap: 12,
  },
  linkItem: {
    paddingVertical: 2,
  },
  linkText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  contactContainer: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    color: COLORS.textMuted,
    fontSize: 14,
    flex: 1,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    gap: 16,
  },
  bottomSectionMobile: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  copyrightText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    gap: 24,
  },
  legalText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});