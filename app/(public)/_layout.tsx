import { Stack, useNavigation, usePathname } from 'expo-router';
import { ArrowUp } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';

const COLORS = {
  primary: '#E35336', 
  darkBg: '#2A1308', 
  white: '#FFFFFF',
};

export default function PublicLayout() {
  const [showBtn, setShowBtn] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  const pathname = usePathname(); 
  const navigation = useNavigation();

  const handleScrollToTop = () => {
    if (Platform.OS === 'web') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        if (el.scrollTop > 0) {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  };

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: showBtn ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showBtn]);

  useEffect(() => {
    setShowBtn(false);
  }, [pathname]);

  useEffect(() => {
     const unsubscribe = navigation.addListener('state', () => {
      setShowBtn(false);
      handleScrollToTop(); 
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleScroll = (e: any) => {
        const scrollTop = e.target?.scrollTop || window.scrollY || document.documentElement?.scrollTop || 0;
        if (scrollTop > 400) {
          setShowBtn(true);
        } else {
          setShowBtn(false);
        }
      };

      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Pages Navigation */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="features" />
        <Stack.Screen name="roles" />
        <Stack.Screen name="about" />
        <Stack.Screen name="contact" />
      </Stack>

      {/* Global Scroll To Top Button (Visible only on Web when scrolled) */}
      {Platform.OS === 'web' && (
        <Animated.View 
          style={[
            styles.fabContainer, 
            { 
              opacity: opacityAnim, 
              pointerEvents: showBtn ? 'auto' : 'none' 
            }
          ]}
        >
          <Pressable 
            style={({ pressed }) => [
              styles.fab,
              pressed && styles.fabPressed
            ]} 
            onPress={handleScrollToTop}
          >
            <ArrowUp size={24} color={COLORS.white} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    zIndex: 9999,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.darkBg,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    // Web only style
    ...(Platform.OS === 'web' && { cursor: 'pointer' } as any),
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: '#C4422A', // Slightly darker terracotta on press
  }
});