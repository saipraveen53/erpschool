import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LayoutDashboard, LogIn, UserPlus } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PublicNavbar() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Status bar ni force chestundi – light icons, blue background */}
      <StatusBar style="light" backgroundColor="#2563eb" translucent={false} />
      
      <View style={styles.innerContainer}>
        {/* Left - School Name with Logo */}
        <TouchableOpacity 
          onPress={() => router.push('/(public)/home')}
          style={styles.logoContainer}
          activeOpacity={0.7}
        >
          <View style={styles.logoBox}>
            <LayoutDashboard size={18} color="white" />
          </View>
          <Text style={styles.logoText}>
            SVPS <Text style={styles.logoHighlight}>ERP</Text>
          </Text>
        </TouchableOpacity>

        {/* Right - Signup & Login Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            style={styles.signupButton}
            activeOpacity={0.7}
          >
            <UserPlus size={16} color="white" />
            <Text style={styles.signupText}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.loginButton}
            activeOpacity={0.8}
          >
            <LogIn size={16} color="#2563eb" />
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2563eb',   // blue background – status bar kinda extension
    borderBottomWidth: 0,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',   // white content area
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  logoHighlight: {
    color: '#2563eb',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  signupText: {
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 4,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  loginText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});