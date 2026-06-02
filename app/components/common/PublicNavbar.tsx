import { usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogIn, Menu, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // States for scroll and hover animations
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Responsive check
  const isDesktop = width >= 768;

  // Track scroll position to toggle between Capsule and Full-Width Navbar
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleScroll = (e: any) => {
        // Checking scrollTop accurately from the active scrolling container in RN Web
        const scrollTop = e.target?.scrollTop || window.scrollY || document.documentElement?.scrollTop || 0;
        if (scrollTop > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
      
      // 'true' uses capture phase which is required for React Native Web ScrollViews
      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, []);

  const navLinks = [
    { name: 'Home', path: '/(public)/home' },
    { name: 'Features', path: '/(public)/features' },
    { name: 'Roles', path: '/(public)/roles' },
    { name: 'About', path: '/(public)/about' },
    { name: 'Contact', path: '/(public)/contact' },
  ];

  const handleNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path as any);
  };

  return (
    <View style={styles.navWrapper} pointerEvents="box-none">
      {/* Dynamic Status Bar based on Scroll */}
      <StatusBar 
        style="dark" 
        backgroundColor={isScrolled ? "#FFFCF8" : "transparent"} 
        translucent={true} 
      />

      <SafeAreaView style={styles.safeArea} edges={['top']} pointerEvents="box-none">
        <View 
          style={[
            styles.container,
            {
              // Transitioning logic from Capsule to Full-width
              marginHorizontal: isScrolled ? 0 : (isDesktop ? 40 : 16),
              marginTop: isScrolled ? 0 : (isDesktop ? 24 : 16),
              borderRadius: isScrolled ? 0 : 999,
              borderBottomWidth: isScrolled ? 1 : 0,
              shadowOpacity: isScrolled ? 0.05 : 0.15,
              elevation: isScrolled ? 2 : 12,
              ...(Platform.OS === 'web' && { transition: 'all 0.3s ease-in-out' } as any)
            }
          ]}
        >
          {/* Left - Logo */}
          <Pressable
            onPress={() => handleNavigate('/(public)/home')}
            style={styles.logoContainer}
          >
            <Text style={styles.logoText}>
              Edvance<Text style={styles.logoHighlight}>.</Text>
            </Text>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>ERP</Text>
            </View>
          </Pressable>

          {/* Right - Desktop Navigation */}
          {isDesktop ? (
            <View style={styles.rightSection}>
              <View style={styles.navLinksContainer}>
                {navLinks.map((link, idx) => {
                  // FIX: Exact route matching for Expo Router resolution 
                  // It automatically converts '/(public)/home' to '/home' in pathname
                  const normalizedPath = link.path.replace('/(public)', '');
                  const isActive = pathname === normalizedPath || pathname === link.path || (pathname === '/' && link.name === 'Home');
                  
                  const isHovered = hoveredLink === link.name;
                  
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => handleNavigate(link.path)}
                      // @ts-ignore - Web-only event listeners for Hover
                      onHoverIn={() => setHoveredLink(link.name)}
                      onHoverOut={() => setHoveredLink(null)}
                      style={[
                        styles.navItem,
                        isHovered && styles.navItemHovered, // Soft background on hover
                      ]}
                    >
                      <Text
                        style={[
                          styles.navText,
                          isActive && styles.navTextActive, // Change color if active
                        ]}
                      >
                        {link.name}
                      </Text>
                      {/* Show underline indicator ONLY if it is the active page */}
                      {isActive && <View style={styles.activeIndicator} />}
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.divider} />

              <Pressable
                onPress={() => handleNavigate('/(auth)/login')}
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.loginButtonPressed,
                ]}
              >
                <Text style={styles.loginText}>Login</Text>
                <LogIn size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            /* Right - Mobile Hamburger Icon */
            <Pressable
              style={styles.hamburgerButton}
              onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X size={28} color="#A0522D" />
              ) : (
                <Menu size={28} color="#A0522D" />
              )}
            </Pressable>
          )}
        </View>

        {/* Mobile Menu Dropdown */}
        {!isDesktop && isMobileMenuOpen && (
          <View 
            style={[
              styles.mobileMenuContainer,
              {
                top: isScrolled ? '100%' : 85,
                left: isScrolled ? 0 : 16,
                right: isScrolled ? 0 : 16,
                borderRadius: isScrolled ? 0 : 24,
                ...(Platform.OS === 'web' && { transition: 'all 0.3s ease-in-out' } as any)
              }
            ]}
          >
            {navLinks.map((link, idx) => {
              const normalizedPath = link.path.replace('/(public)', '');
              const isActive = pathname === normalizedPath || pathname === link.path || (pathname === '/' && link.name === 'Home');
              
              return (
                <Pressable
                  key={idx}
                  onPress={() => handleNavigate(link.path)}
                  style={[
                    styles.mobileNavItem,
                    isActive && styles.mobileNavItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.mobileNavText,
                      isActive && styles.mobileNavTextActive,
                    ]}
                  >
                    {link.name}
                  </Text>
                </Pressable>
              );
            })}
            
            <View style={styles.mobileDivider} />
            
            <Pressable
              onPress={() => handleNavigate('/(auth)/login')}
              style={styles.mobileLoginButton}
            >
              <Text style={styles.mobileLoginText}>Login</Text>
              <LogIn size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999, // Super high index to always stay on top
  },
  safeArea: {
    flex: 1,
  },
  container: {
    pointerEvents: 'auto', // Important so you can click the navbar
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
    paddingVertical: 16,
    backgroundColor: '#FFFCF8',
    borderBottomColor: 'rgba(245, 245, 220, 0.5)',
    shadowColor: '#5C2E14',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#5C2E14', // Very dark brown for strong contrast
    letterSpacing: -0.5,
  },
  logoHighlight: {
    color: '#E35336', // Terracotta hex
  },
  logoBadge: {
    backgroundColor: '#F5F5DC', // Beige
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#F4A460', // Sandy Orange
  },
  logoBadgeText: {
    color: '#A0522D', // Sienna Brown
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLinksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    ...(Platform.OS === 'web' && { transition: 'all 0.2s ease' } as any)
  },
  navItemHovered: {
    backgroundColor: 'rgba(227, 83, 54, 0.08)', // Soft terracotta highlight background on hover
  },
  navText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A0522D', // Sienna Brown for inactive links
    ...(Platform.OS === 'web' && { transition: 'color 0.2s ease' } as any)
  },
  navTextActive: {
    color: '#E35336', // Terracotta for active link
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 20,
    height: 3,
    backgroundColor: '#E35336', // Terracotta underline pill
    borderRadius: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#F4A460', // Sandy orange divider
    marginHorizontal: 16,
    opacity: 0.5,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E35336', // Terracotta Button
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    gap: 8,
    shadowColor: '#E35336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    backgroundColor: '#C4422A', // Slightly darker terracotta on press
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  hamburgerButton: {
    padding: 4,
  },
  
  /* Mobile Menu Styles */
  mobileMenuContainer: {
    position: 'absolute',
    backgroundColor: '#F5F5DC', // Warm Beige for the dropdown
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4A460',
    shadowColor: '#5C2E14',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 999,
  },
  mobileNavItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 82, 45, 0.1)', // Faded sienna border
  },
  mobileNavItemActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    shadowColor: '#A0522D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mobileNavText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0522D',
  },
  mobileNavTextActive: {
    color: '#E35336',
  },
  mobileDivider: {
    height: 1,
    backgroundColor: 'rgba(160, 82, 45, 0.2)',
    marginVertical: 16,
  },
  mobileLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E35336',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  mobileLoginText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});