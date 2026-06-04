import { Stack } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";

export default function VicePrincipalLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 1024; 

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Header 
        onMenuPress={() => setSidebarOpen(!isSidebarOpen)} 
        isMobile={isMobile} 
      />

      <View style={styles.mainLayout}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isMobile={isMobile} 
        />

        <View style={styles.contentArea}>
          <Stack screenOptions={{ 
            headerShown: false, 
            animation: Platform.OS === 'web' ? 'none' : 'default',
            contentStyle: { backgroundColor: '#F4F7FA' }
          }}>
            <Stack.Screen name="index" />
            {/* FIXED: Exact file paths declared for Expo Router */}
            <Stack.Screen name="academics/monitoring" />
            <Stack.Screen name="attendance/verification" />
            <Stack.Screen name="discipline/index" />
            <Stack.Screen name="examinations/supervision" />
          </Stack>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F7FA', 
    position: 'relative',
  },
  contentArea: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
});