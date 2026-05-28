import { useRouter } from 'expo-router';
import { LayoutDashboard, LogIn, UserPlus } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PublicNavbar() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
            <UserPlus size={16} color="#4b5563" />
            <Text style={styles.signupText}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.loginButton}
            activeOpacity={0.8}
          >
            <LogIn size={16} color="white" />
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  signupText: {
    color: '#4b5563',
    fontWeight: '500',
    marginLeft: 4,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  loginText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});