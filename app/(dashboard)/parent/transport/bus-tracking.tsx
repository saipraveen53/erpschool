import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  Clock,
  Compass,
  Layers,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  User
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dynamic programmatic import engine safely routing cross-platform view vectors inside bundlers
let WebViewMobileComponent: any = null;
if (Platform.OS !== "web") {
  try {
    WebViewMobileComponent = require("react-native-webview").WebView;
  } catch (e) {
    console.warn("WebView implementation layer fallback offline:", e);
  }
}

// ==========================================
// 1. TYPES & DATA STRATEGIES
// ==========================================
export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface TelemetryData {
  routeId: string;
  busNo: string;
  driverName: string;
  driverPhone: string;
  speedKmh: number;
  nextStop: string;
  etaMins: number;
  totalStopsRemaining: number;
  parentHomeCoordinates: Coordinate;
}

const THEME = {
  primary: "#E35336",       // Burnt Sienna Main
  background: "#F5F5DC",    // Beige Tint Base
  secondary: "#F44460",     // Pastel Salmon Accent
  darkAccent: "#A0522D",    // Deep Sienna Brown
  white: "#FFFFFF",
  textDark: "#2C1A14",
  textMuted: "#7A6862",
  successGlow: "#16A34A",
  cardBorder: "rgba(160, 82, 45, 0.08)"
};

const FIXED_ROUTE_PATH: Coordinate[] = [
  { latitude: 17.4550, longitude: 78.3850 },
  { latitude: 17.4525, longitude: 78.3820 },
  { latitude: 17.4500, longitude: 78.3780 },
  { latitude: 17.4475, longitude: 78.3740 },
  { latitude: 17.4450, longitude: 78.3710 },
];

const REAL_BUS_ICON_URI = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=120";

// ==========================================
// 2. MATHEMATICAL BEARING UTILITIES
// ==========================================
const calculateBearing = (start: Coordinate, end: Coordinate): number => {
  const lat1 = start.latitude * (Math.PI / 180);
  const lon1 = start.longitude * (Math.PI / 180);
  const lat2 = end.latitude * (Math.PI / 180);
  const lon2 = end.longitude * (Math.PI / 180);
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return ((Math.atan2(y, x) * (180 / Math.PI)) + 360) % 360;
};

export default function TransportBusTrackingDashboard() {
  const router = useRouter();
  const webMapRef = useRef<any>(null);
  const webBusMarkerRef = useRef<any>(null);
  const mobileWebViewRef = useRef<any>(null);
  
  const [refreshing, setRefreshing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  const pathIndexRef = useRef(0);
  const [pathIndex, setPathIndex] = useState(0);
  
  const busMoveValueRef = useRef(new Animated.Value(0)).current;
  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const entryFade = useRef(new Animated.Value(0)).current;
  const entrySlide = useRef(new Animated.Value(30)).current;

  const [currentLiveLocation, setCurrentLiveLocation] = useState<Coordinate>(FIXED_ROUTE_PATH[0]);
  const [busAngle, setBusAngle] = useState<number>(0);

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    routeId: "R-101 (East Zone)",
    busNo: "TS-09-EA-4211",
    driverName: "Srinivas Rao",
    driverPhone: "+919440123456",
    speedKmh: 42,
    nextStop: "Indira Colony Junction",
    etaMins: 12,
    totalStopsRemaining: 3,
    parentHomeCoordinates: { latitude: 17.4450, longitude: 78.3710 },
  });

  const isDesktop = windowWidth > 992;

  // Global standard document template matching parameters mapping layout configurations beautifully
  const generateLeafletHTMLMapSource = () => {
    const parentDropIndex = Math.floor(FIXED_ROUTE_PATH.length * 0.7);
    const parentPosition = FIXED_ROUTE_PATH[parentDropIndex];
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #FAF9F5; }
          .leaflet-attribution-flag { display: none !important; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${parentPosition.latitude}, ${parentPosition.longitude}], 15);
          
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
          }).addTo(map);

          var points = ${JSON.stringify(FIXED_ROUTE_PATH)};
          var polylinePoints = points.map(function(p) { return [p.latitude, p.longitude]; });
          L.polyline(polylinePoints, { color: '#10B981', weight: 6, opacity: 0.7, lineCap: 'round' }).addTo(map);

          var schoolIcon = L.divIcon({
            html: '<div style="background-color: #F59E0B; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.2); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;"><svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg></div>',
            className: '', iconSize: [36, 36], iconAnchor: [18, 18]
          });

          var homeIcon = L.divIcon({
            html: '<div style="background-color: #3B82F6; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.2); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;"><svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>',
            className: '', iconSize: [36, 36], iconAnchor: [18, 18]
          });

          var terminalIcon = L.divIcon({
            html: '<div style="background-color: #64748B; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.2); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;"><svg style="width: 16px; height: 16px; color: white;" fill="currentColor" viewBox="0 0 24 24"><path d="M19 8l-7 5-7-5M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>',
            className: '', iconSize: [32, 32], iconAnchor: [16, 16]
          });

          L.marker([points[0].latitude, points[0].longitude], { icon: schoolIcon }).addTo(map);
          L.marker([${telemetry.parentHomeCoordinates.latitude}, ${telemetry.parentHomeCoordinates.longitude}], { icon: homeIcon }).addTo(map);
          L.marker([points[points.length-1].latitude, points[points.length-1].longitude], { icon: terminalIcon }).addTo(map);

          var busIcon = L.divIcon({
            html: '<div id="bus-vector-rotator" style="transform: rotate(0deg); transform-origin: center; width: 36px; height: 72px;"><svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg" style="width: 36px; height: 72px; filter: drop-shadow(0px 6px 4px rgba(0,0,0,0.35));"><rect x="15" y="10" width="70" height="180" rx="15" fill="#F59E0B" stroke="#B45309" stroke-width="3"/><rect x="20" y="30" width="60" height="25" rx="5" fill="#1E293B"/><rect x="20" y="160" width="60" height="15" rx="3" fill="#1E293B"/><circle cx="28" cy="16" r="5" fill="#FEF08A"/><circle cx="72" cy="16" r="5" fill="#FEF08A"/><rect x="35" y="80" width="30" height="40" rx="5" fill="#FCD34D" stroke="#D97706" stroke-width="2"/></svg></div>',
            className: '', iconSize: [36, 72], iconAnchor: [18, 36]
          });

          var busMarker = L.marker([points[0].latitude, points[0].longitude], { icon: busIcon }).addTo(map);

          // Runtime bridge communication protocol layout handler layers
          function updatePositionStream(lat, lng, angle) {
            var newLatLng = new L.LatLng(lat, lng);
            busMarker.setLatLng(newLatLng);
            map.panTo(newLatLng);
            var el = document.getElementById('bus-vector-rotator');
            if(el) { el.style.transform = 'rotate(' + angle + 'deg)'; }
          }

          window.addEventListener('message', function(e) {
            var data = JSON.parse(e.data);
            if(data && data.type === 'TRACK_UPDATE') {
              updatePositionStream(data.lat, data.lng, data.angle);
            }
          });
          document.addEventListener('message', function(e) {
            var data = JSON.parse(e.data);
            if(data && data.type === 'TRACK_UPDATE') {
              updatePositionStream(data.lat, data.lng, data.angle);
            }
          });
        </script>
      </body>
      </html>
    `;
  };

  // Web Only Init layer
  useEffect(() => {
    if (Platform.OS === "web") {
      const initWebMap = () => {
        const L = (window as any).L;
        if (!L || webMapRef.current) return;

        const mapContainer = document.getElementById("leaflet-web-container");
        if (!mapContainer) return;

        const parentDropIndex = Math.floor(FIXED_ROUTE_PATH.length * 0.7);
        const parentPosition = FIXED_ROUTE_PATH[parentDropIndex];

        const map = L.map("leaflet-web-container", { zoomControl: false, attributionControl: false }).setView(
          [parentPosition.latitude, parentPosition.longitude],
          15
        );
        webMapRef.current = map;

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
        }).addTo(map);

        const polylinePoints = FIXED_ROUTE_PATH.map(pt => [pt.latitude, pt.longitude]);
        L.polyline(polylinePoints, { color: "#10B981", weight: 6, opacity: 0.6, lineCap: "round" }).addTo(map);

        const schoolIcon = L.divIcon({
          html: `<div style="background-color: #F59E0B; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>
                </div>`,
          className: "", iconSize: [36, 36], iconAnchor: [18, 18],
        });

        const parentStopIcon = L.divIcon({
          html: `<div style="background-color: #3B82F6; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>`,
          className: "", iconSize: [36, 36], iconAnchor: [18, 18],
        });

        const terminalIcon = L.divIcon({
          html: `<div style="background-color: #64748B; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 16px; height: 16px; color: white;" fill="currentColor" viewBox="0 0 24 24"><path d="M19 8l-7 5-7-5M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>`,
          className: "", iconSize: [32, 32], iconAnchor: [16, 16],
        });

        L.marker([FIXED_ROUTE_PATH[0].latitude, FIXED_ROUTE_PATH[0].longitude], { icon: schoolIcon }).addTo(map);
        L.marker([telemetry.parentHomeCoordinates.latitude, telemetry.parentHomeCoordinates.longitude], { icon: parentStopIcon }).addTo(map);
        L.marker([FIXED_ROUTE_PATH[FIXED_ROUTE_PATH.length - 1].latitude, FIXED_ROUTE_PATH[FIXED_ROUTE_PATH.length - 1].longitude], { icon: terminalIcon }).addTo(map);

        const busIcon = L.divIcon({
          html: `<div id="web-bus-rotating-svg-wrapper" style="transform: rotate(0deg); transition: transform 0.4s ease; width: 36px; height: 72px;">
                  <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg" style="width: 36px; height: 72px; filter: drop-shadow(0px 8px 6px rgba(0,0,0,0.4));">
                    <rect x="15" y="10" width="70" height="180" rx="15" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
                    <rect x="20" y="30" width="60" height="25" rx="5" fill="#1E293B"/> 
                    <rect x="20" y="160" width="60" height="15" rx="3" fill="#1E293B"/>
                    <circle cx="28" cy="16" r="5" fill="#FEF08A"/>
                    <circle cx="72" cy="16" r="5" fill="#FEF08A"/>
                    <rect x="35" y="80" width="30" height="40" rx="5" fill="#FCD34D" stroke="#D97706" stroke-width="2"/>
                  </svg>
                 </div>`,
          className: "", iconSize: [36, 72], iconAnchor: [18, 36],
        });

        webBusMarkerRef.current = L.marker([FIXED_ROUTE_PATH[0].latitude, FIXED_ROUTE_PATH[0].longitude], { icon: busIcon }).addTo(map);
      };

      if (!(window as any).L) {
        const link = document.createElement("link");
        link.rel = "stylesheet"; link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initWebMap;
        document.body.appendChild(script);
      } else {
        initWebMap();
      }
    }
  }, []);

  // ==========================================
  // 4. ANIMATION TIMELINE STREAM SCHEDULERS
  // ==========================================
  useEffect(() => {
    Animated.parallel([
      Animated.timing(entryFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(entrySlide, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start();

    const triggerNextSegmentAnimation = () => {
      busMoveValueRef.setValue(0);
      Animated.timing(busMoveValueRef, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          const nextIndex = (pathIndexRef.current + 1) % (FIXED_ROUTE_PATH.length - 1);
          pathIndexRef.current = nextIndex;
          setPathIndex(nextIndex);
          
          setTelemetry(prev => ({
            ...prev,
            speedKmh: Math.floor(35 + Math.random() * 15),
            etaMins: Math.max(2, prev.etaMins - (Math.random() > 0.6 ? 1 : 0))
          }));
          
          triggerNextSegmentAnimation();
        }
      });
    };

    triggerNextSegmentAnimation();

    const animatedListenerId = busMoveValueRef.addListener(({ value }) => {
      const currentIndex = pathIndexRef.current;
      const startNode = FIXED_ROUTE_PATH[currentIndex];
      const endNode = FIXED_ROUTE_PATH[currentIndex + 1] || FIXED_ROUTE_PATH[currentIndex];
      
      if (startNode && endNode) {
        const calculatedLat = startNode.latitude + (endNode.latitude - startNode.latitude) * value;
        const calculatedLng = startNode.longitude + (endNode.longitude - startNode.longitude) * value;
        
        const updatedLocation = { latitude: calculatedLat, longitude: calculatedLng };
        setCurrentLiveLocation(updatedLocation);

        const currentBearing = calculateBearing(startNode, endNode);
        setBusAngle(currentBearing);

        // Update Web Client Matrix Layers directly
        if (Platform.OS === "web" && webBusMarkerRef.current && webMapRef.current) {
          webBusMarkerRef.current.setLatLng([calculatedLat, calculatedLng]);
          webMapRef.current.panTo([calculatedLat, calculatedLng]);
          const busSvg = document.getElementById("web-bus-rotating-svg-wrapper");
          if (busSvg) { busSvg.style.transform = `rotate(${currentBearing}deg)`; }
        }

        // Native Bridges Layer Post Messaging Stream Strategy
        if (Platform.OS !== "web" && mobileWebViewRef.current) {
          const payload = JSON.stringify({
            type: "TRACK_UPDATE",
            lat: calculatedLat,
            lng: calculatedLng,
            angle: currentBearing
          });
          mobileWebViewRef.current.postMessage(payload);
        }
      }
    });

    return () => {
      busMoveValueRef.removeListener(animatedListenerId);
      busMoveValueRef.stopAnimation();
    };
  }, []);

  const handlePhoneCall = () => {
    Linking.openURL(`tel:${telemetry.driverPhone}`).catch(() => {
      alert("Phone dialer could not be launched on this platform.");
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setTelemetry(prev => ({ ...prev, etaMins: 11 }));
    }, 1200);
  };

  const backgroundParallaxLayerOne = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [50, 0, -80],
    extrapolate: "clamp"
  });

  const backgroundParallaxLayerTwo = scrollYAnim.interpolate({
    inputRange: [-100, 0, 500],
    outputRange: [-30, 0, 60],
    extrapolate: "clamp"
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <View style={styles.absoluteLayerContainer} pointerEvents="none">
        <Animated.View style={[styles.parallaxSphereOrbOne, { transform: [{ translateY: backgroundParallaxLayerOne }] }]} />
        <Animated.View style={[styles.parallaxSphereOrbTwo, { transform: [{ translateY: backgroundParallaxLayerTwo }] }]} />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={THEME.primary} />
        }
        contentContainerStyle={isDesktop ? styles.scrollContainerDesktopCenter : null}
      >
        <Animated.View 
          style={[
            styles.mainLayoutWrapper, 
            isDesktop && styles.desktopLayoutConstraintsWidth,
            { opacity: entryFade, transform: [{ translateY: entrySlide }] }
          ]}
        >
          
          {/* Header Card Backdrop */}
          <View style={styles.heroHeaderSectionCard}>
            <View style={styles.headerLayoutLeftGroup}>
              <View style={styles.liveBadgeClusterRow}>
                <Text style={styles.mainHeaderTypographyTitle}>Transit Telemetry</Text>
                <View style={styles.activePulseSignalIndicatorBadge}>
                  <Navigation size={12} color={THEME.white} style={{ marginRight: 4 }} />
                  <Text style={styles.activePulseSignalIndicatorText}>LIVE TRACKING</Text>
                </View>
              </View>
              <Text style={styles.subHeaderTypographyDescription}>
                Real-time satellite GPS tracking interface optimized for real-time fleet operations.
              </Text>
            </View>
            <View style={styles.headerGraphicCircularBadgeBackdrop}>
              <Image source={{ uri: REAL_BUS_ICON_URI }} style={styles.headerMiniImageAvatar} />
            </View>
          </View>

          {/* Metrics Status Grid Panel */}
          <View style={[styles.metricsFlexibleLayoutGridContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            <View style={[styles.metricCardGridItemUnit, isDesktop && styles.desktopGridProportionalQuarterItem]}>
              <View style={styles.metricCardHeaderMetaFlexRow}>
                <Layers size={14} color={THEME.textMuted} />
                <Text style={styles.metricCardLabelTypographyTitle}>Fleet Route</Text>
              </View>
              <Text style={styles.metricCardPrimaryLargeValueText}>{telemetry.routeId}</Text>
              <Text style={styles.metricCardSecondaryFooterText}>Assigned Fleet Tracking Code</Text>
            </View>

            <View style={[styles.metricCardGridItemUnit, isDesktop && styles.desktopGridProportionalQuarterItem, styles.highlightedCardTintVariantBg]}>
              <View style={styles.metricCardHeaderMetaFlexRow}>
                <Clock size={14} color={THEME.primary} />
                <Text style={[styles.metricCardLabelTypographyTitle, { color: THEME.primary }]}>Arrival ETA</Text>
              </View>
              <Text style={[styles.metricCardPrimaryLargeValueText, { color: THEME.primary }]}>{telemetry.etaMins} Mins</Text>
              <Text style={styles.metricCardSecondaryFooterText}>Approaching: {telemetry.nextStop}</Text>
            </View>

            <View style={[styles.metricCardGridItemUnit, isDesktop && styles.desktopGridProportionalQuarterItem, styles.successCardTintVariantBg]}>
              <View style={styles.metricCardHeaderMetaFlexRow}>
                <Compass size={14} color={THEME.successGlow} />
                <Text style={[styles.metricCardLabelTypographyTitle, { color: THEME.successGlow }]}>Telemetry Speed</Text>
              </View>
              <Text style={[styles.metricCardPrimaryLargeValueText, { color: THEME.successGlow }]}>{telemetry.speedKmh} km/h</Text>
              <Text style={styles.metricCardSecondaryFooterText}>Satellite positioning stream active</Text>
            </View>

            <View style={[styles.metricCardGridItemUnit, isDesktop && styles.desktopGridProportionalQuarterItem]}>
              <View style={styles.metricCardHeaderMetaFlexRow}>
                <MapPin size={14} color={THEME.darkAccent} />
                <Text style={styles.metricCardLabelTypographyTitle}>Remaining Stops</Text>
              </View>
              <Text style={[styles.metricCardPrimaryLargeValueText, { color: THEME.darkAccent }]}>{telemetry.totalStopsRemaining} Waypoints</Text>
              <Text style={styles.metricCardSecondaryFooterText}>Pending route scheduling queue</Text>
            </View>
          </View>

          {/* Split Structural Section Wrapper Layout */}
          <View style={[styles.responsiveSplitSectionFlexLayoutContainer, isDesktop && styles.rowDirectionLayoutGrid]}>
            
            {/* Interactive GPS Engine Panel Canvas Frame */}
            <View style={[styles.geoTrackingCardFrameBoxPanel, isDesktop && styles.desktopFlexScalePrimacyWidthSide]}>
              <View style={styles.geoTrackingCardHeaderBarStrip}>
                <Compass size={16} color={THEME.white} />
                <Text style={styles.geoTrackingCardHeaderBarTitleText}>Live GPS Engine Positioning Canvas</Text>
              </View>

              <View style={styles.mapContainerViewportBox}>
                {Platform.OS === "web" ? (
                  /* Web Browser Element Target Node Canvas */
                  <div id="leaflet-web-container" style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }} />
                ) : WebViewMobileComponent ? (
                  /* Android/iOS hardware container safely displaying cross platform dynamic maps layout structures */
                  <WebViewMobileComponent
                    ref={mobileWebViewRef}
                    originWhitelist={["*"]}
                    source={{ html: generateLeafletHTMLMapSource() }}
                    style={{ flex: 1, backgroundColor: "#FAF9F5" }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                  />
                ) : (
                  <View style={styles.loadingPlaceholderMapBox}>
                    <Text style={styles.metricCardSecondaryFooterText}>Loading GPS Terminal Graphics Engine...</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Right Stack Control Dashboard Grid */}
            <View style={[styles.rightControlPanelVerticalStackBox, isDesktop && styles.desktopFlexScaleSecondaryWidthSide]}>
              <View style={styles.rightSideInternalWidgetCardSurfaceBox}>
                <View style={styles.rightSideWidgetCardHeaderRowTitleFlexRow}>
                  <User size={16} color={THEME.darkAccent} />
                  <Text style={styles.rightSideWidgetCardLabelHeadingText}>Assigned Fleet Personnel</Text>
                </View>

                <View style={styles.personnelDataRowContainerItem}>
                  <View style={styles.personnelAvatarPlaceholderCircleBox}>
                    <Text style={styles.personnelAvatarInitialsLabelTypographyText}>SR</Text>
                  </View>
                  <View style={styles.personnelMetaDetailsTextFlexContainer}>
                    <Text style={styles.personnelMainNameTypographyTitle}>{telemetry.driverName}</Text>
                    <Text style={styles.personnelSubtextLicenseRegPlateCode}>License & Vehicle: {telemetry.busNo}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.personnelCommunicationCallActionButton} 
                    activeOpacity={0.8}
                    onPress={handlePhoneCall}
                  >
                    <Phone size={14} color={THEME.white} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.rightSideInternalWidgetCardSurfaceBox, { marginBottom: isDesktop ? 0 : 32 }]}>
                <View style={styles.rightSideWidgetCardHeaderRowTitleFlexRow}>
                  <ShieldCheck size={16} color={THEME.primary} />
                  <Text style={styles.rightSideWidgetCardLabelHeadingText}>Security Diagnostics</Text>
                </View>

                <View style={styles.safetyDiagnosticsGlassParagraphBoxContainer}>
                  <Text style={styles.safetyDiagnosticsParagraphBodyContentText}>
                    Transport tracking links employ high-frequency secure tokens. Latency synchronization matrices loop automatically every 4 seconds.
                  </Text>
                </View>

                <View style={styles.safetyVerificationNoticeFooterRowStrip}>
                  <AlertTriangle size={12} color={THEME.darkAccent} style={{ marginRight: 4 }} />
                  <Text style={styles.safetyVerificationNoticeFooterTypographyText}>
                    Audit logs register nominal tracks across internal cloud coordination nodes.
                  </Text>
                </View>
              </View>
            </View>

          </View>

        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    position: "relative"
  },
  scrollContainerDesktopCenter: {
    alignItems: "center",
    justifyContent: "center"
  },
  mainLayoutWrapper: {
    width: "100%",
    paddingBottom: 50,
    paddingHorizontal: 16
  },
  desktopLayoutConstraintsWidth: {
    maxWidth: 1200,
    paddingHorizontal: 24
  },
  absoluteLayerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: "hidden"
  },
  parallaxSphereOrbOne: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(227, 83, 54, 0.05)",
    top: 100,
    right: -80
  },
  parallaxSphereOrbTwo: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: "rgba(160, 82, 45, 0.04)",
    bottom: 40,
    left: -120
  },
  heroHeaderSectionCard: {
    backgroundColor: THEME.white,
    padding: 24,
    borderRadius: 24,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 3
  },
  headerLayoutLeftGroup: {
    flex: 1,
    paddingRight: 16
  },
  liveBadgeClusterRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12
  },
  mainHeaderTypographyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: THEME.textDark,
    letterSpacing: -0.5
  },
  activePulseSignalIndicatorBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  activePulseSignalIndicatorText: {
    color: THEME.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5
  },
  subHeaderTypographyDescription: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 6,
    lineHeight: 18
  },
  headerGraphicCircularBadgeBackdrop: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  headerMiniImageAvatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  metricsFlexibleLayoutGridContainer: {
    marginTop: 16,
    gap: 12
  },
  rowDirectionLayoutGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  metricCardGridItemUnit: {
    backgroundColor: THEME.white,
    padding: 18,
    borderRadius: 20,
    flex: 1,
    minWidth: 220,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: "#000",
    shadowOpacity: 0.01,
    shadowRadius: 6,
    elevation: 2
  },
  desktopGridProportionalQuarterItem: {
    width: "23%",
    flex: 0
  },
  metricCardHeaderMetaFlexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8
  },
  metricCardLabelTypographyTitle: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: "700"
  },
  metricCardPrimaryLargeValueText: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.textDark,
    letterSpacing: -0.5
  },
  metricCardSecondaryFooterText: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 6
  },
  highlightedCardTintVariantBg: {
    backgroundColor: "#FFF8F5"
  },
  successCardTintVariantBg: {
    backgroundColor: "#E8F8EE"
  },
  responsiveSplitSectionFlexLayoutContainer: {
    marginTop: 16,
    gap: 16
  },
  desktopFlexScalePrimacyWidthSide: {
    flex: 1.6,
    minHeight: 460
  },
  desktopFlexScaleSecondaryWidthSide: {
    flex: 1
  },
  geoTrackingCardFrameBoxPanel: {
    backgroundColor: THEME.white,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2
  },
  geoTrackingCardHeaderBarStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.darkAccent,
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10
  },
  geoTrackingCardHeaderBarTitleText: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.white,
    letterSpacing: 0.2
  },
  mapContainerViewportBox: {
    flex: 1,
    minHeight: 380,
    backgroundColor: "#EFECE6",
    position: "relative"
  },
  loadingPlaceholderMapBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF9F5",
    padding: 24
  },
  rightControlPanelVerticalStackBox: {
    gap: 16
  },
  rightSideInternalWidgetCardSurfaceBox: {
    backgroundColor: THEME.white,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
    gap: 14
  },
  rightSideWidgetCardHeaderRowTitleFlexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F5F2",
    paddingBottom: 12
  },
  rightSideWidgetCardLabelHeadingText: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.textDark
  },
  personnelDataRowContainerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF8F5",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.04)"
  },
  personnelAvatarPlaceholderCircleBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F3ECE7",
    justifyContent: "center",
    alignItems: "center"
  },
  personnelAvatarInitialsLabelTypographyText: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.darkAccent
  },
  personnelMetaDetailsTextFlexContainer: {
    flex: 1,
    marginLeft: 14
  },
  personnelMainNameTypographyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.textDark
  },
  personnelSubtextLicenseRegPlateCode: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2
  },
  personnelCommunicationCallActionButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: THEME.successGlow,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.successGlow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  safetyDiagnosticsGlassParagraphBoxContainer: {
    backgroundColor: THEME.background,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(160, 82, 45, 0.05)"
  },
  safetyDiagnosticsParagraphBodyContentText: {
    fontSize: 13,
    color: THEME.textDark,
    lineHeight: 20,
    fontStyle: "italic"
  },
  safetyVerificationNoticeFooterRowStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2
  },
  safetyVerificationNoticeFooterTypographyText: {
    fontSize: 11,
    color: THEME.textMuted,
    flex: 1
  }
});