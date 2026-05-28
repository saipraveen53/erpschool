import { Tabs } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const role = user?.role;
  
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {role === 'SUPER_ADMIN' && <Tabs.Screen name="super-admin" />}
      {role === 'ADMIN' && <Tabs.Screen name="admin" />}
      {role === 'PRINCIPAL' && <Tabs.Screen name="principal" />}
      {role === 'VICE_PRINCIPAL' && <Tabs.Screen name="vice-principal" />}
      {role === 'TEACHER' && <Tabs.Screen name="teacher" />}
      {role === 'STUDENT' && <Tabs.Screen name="student" />}
      {role === 'PARENT' && <Tabs.Screen name="parent" />}
      {role === 'DRIVER' && <Tabs.Screen name="driver" />}
      {role === 'HOUSEKEEPING' && <Tabs.Screen name="housekeeping" />}
      {role === 'RECEPTIONIST' && <Tabs.Screen name="receptionist" />}
      {role === 'LIBRARIAN' && <Tabs.Screen name="librarian" />}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});