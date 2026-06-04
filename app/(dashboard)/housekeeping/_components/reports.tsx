import { LinearGradient } from "expo-linear-gradient";
import { Clock3, Sparkles } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ComingSoon = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),

      Animated.spring(translateAnim, {
        toValue: 0,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={["#ffffff", "#ffffff", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.card}>
          <LinearGradient
            colors={["#7c3aed", "#2563eb"]}
            style={styles.iconContainer}
          >
            <Clock3 size={38} color="#ffffff" />
          </LinearGradient>

          <View style={styles.badge}>
            <Sparkles size={14} color="#7c3aed" />
            <Text style={styles.badgeText}>Launching Soon</Text>
          </View>

          <Text style={styles.title}>reports Coming Soon</Text>

          <Text style={styles.subtitle}>
            We’re crafting something premium and powerful for your workspace
            experience.
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default ComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    overflow: "hidden",
  },

  blurTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 200,
    backgroundColor: "rgba(124,58,237,0.10)",
  },

  blurBottom: {
    position: "absolute",
    bottom: -120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 200,
    backgroundColor: "rgba(37,99,235,0.10)",
  },

  cardWrapper: {
    width: "100%",
    maxWidth: 500,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 32,
    paddingVertical: 50,
    paddingHorizontal: 34,
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.83)",

    shadowColor: "#0f172a",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 25,

    elevation: 12,

    ...Platform.select({
      web: {
        backdropFilter: "blur(16px)" as any,
      },
    }),
  },

  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,

    shadowColor: "#7c3aed",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,

    backgroundColor: "#f3e8ff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 22,
  },

  badgeText: {
    color: "#7c3aed",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.4,
  },

  title: {
    fontSize: 35,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 14,
    letterSpacing: -1,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 16,
  },

  description: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 34,
    maxWidth: 400,
  },

  button: {
    height: 56,
    paddingHorizontal: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
