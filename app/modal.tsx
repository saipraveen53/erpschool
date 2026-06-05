// app/modal.tsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { rootApi } from './utils/axiosInstance';

export default function ModalScreen() {
  const router = useRouter();
  const { role, token } = useLocalSearchParams<{ role?: string; token?: string }>();
  const isWeb = Platform.OS === 'web';

  // Normalize role: lowercase
  const rawRole = role?.toLowerCase() || '';
  const allowedRoles = ['admin', 'driver', 'teacher'];
  const isValidRole = allowedRoles.includes(rawRole);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [form, setForm] = useState({
    // Teacher fields
    teacherName: '',
    email: '',
    phone: '',
    qualification: '',
    gender: '',
    experience: '',
    address: '',
    subjectIds: [] as string[],
    // Driver fields
    fullName: '',
    password: '',
    licenseNumber: '',
    phoneNo: '',
    // Principal fields
    adminPassword: '',
    adminExperience: '',
    adminAddress: '',
    adminPhoneNo: '',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    Alert.alert('Error', msg);
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!token) {
      showError('Missing registration token. Please use the link from your email.');
      return;
    }

    setLoading(true);

    try {
      if (rawRole === 'teacher') {
        if (!form.teacherName || !form.email || !form.phone || !form.qualification || !form.gender || !form.experience || !form.address) {
          showError('Please fill all required fields for Teacher.');
          setLoading(false);
          return;
        }
        const payload = {
          teacherName: form.teacherName,
          email: form.email,
          phone: form.phone,
          qualification: form.qualification,
          gender: form.gender,
          experience: parseInt(form.experience, 10),
          address: form.address,
          subjectIds: form.subjectIds,
        };
        await rootApi.post(`/api/student/teacher/register?token=${token}`, payload);
        Alert.alert('Success', 'Teacher registration completed! You will be redirected to login.');
        router.replace('/');
      } 
      else if (rawRole === 'driver') {
        if (!form.fullName || !form.password || !form.address || !form.experience || !form.licenseNumber || !form.phoneNo) {
          showError('Please fill all required fields for Driver.');
          setLoading(false);
          return;
        }
        const payload = {
          fullName: form.fullName,
          password: form.password,
          address: form.address,
          experience: form.experience,
          licenseNumber: form.licenseNumber,
          phoneNo: form.phoneNo,
        };
        await rootApi.post(`/api/driver/complete-onboarding?token=${token}`, payload);
        Alert.alert('Success', 'Driver registration completed! You will be redirected to login.');
        router.replace('/');
      }
      else if (rawRole === 'admin') {
        if (!form.adminPassword || !form.adminExperience || !form.adminAddress || !form.adminPhoneNo) {
          showError('Please fill all required fields for Principal.');
          setLoading(false);
          return;
        }
        const payload = {
          password: form.adminPassword,
          experience: form.adminExperience,
          address: form.adminAddress,
          phoneNo: form.adminPhoneNo,
        };
        await rootApi.post(`/api/principle/complete-onboarding?token=${token}`, payload);
        Alert.alert('Success', 'Principal registration completed! You will be redirected to login.');
        router.replace('/');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label: string, field: string, placeholder: string, secure = false, required = true, keyboardType: 'default' | 'email-address' | 'numeric' | 'phone-pad' = 'default') => (
    <View className="mb-4" key={field}>
      <Text className="text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <TextInput
        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={form[field as keyof typeof form] as string}
        onChangeText={(text) => updateField(field, text)}
        secureTextEntry={secure}
        autoCapitalize="none"
        keyboardType={keyboardType}
        style={isWeb ? { outlineStyle: 'none' } : undefined}
      />
    </View>
  );

  if (!isValidRole) {
    return (
      <View className="flex-1 bg-black/50 justify-center items-center">
        <Stack.Screen options={{ presentation: 'modal', title: 'Error' }} />
        <View className="w-[90%] max-w-md bg-white rounded-3xl p-6 shadow-xl">
          <Text className="text-5xl text-center mb-4">❌</Text>
          <Text className="text-2xl font-bold text-red-600 text-center mb-3">Role Not Recognised</Text>
          <Text className="text-base text-gray-600 text-center mb-2">
            The role "{role || 'empty'}" is not recorded yet.
          </Text>
          <Text className="text-sm text-gray-400 text-center mb-6">
            Allowed roles: Admin, Driver, Teacher
          </Text>
          <TouchableOpacity className="bg-gray-100 py-3.5 rounded-full items-center" onPress={() => router.back()}>
            <Text className="text-gray-600 font-semibold text-base">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getTitle = () => {
    switch (rawRole) {
      case 'admin': return 'Principal Registration';
      case 'driver': return 'Driver Registration';
      case 'teacher': return 'Teacher Registration';
      default: return 'Registration Form';
    }
  };

  const getIcon = () => {
    switch (rawRole) {
      case 'admin': return '🎓';
      case 'driver': return '🚌';
      case 'teacher': return '👩‍🏫';
      default: return '📝';
    }
  };

  return (
    <View className="flex-1 bg-black/50 justify-center items-center p-4">
      <Stack.Screen options={{ presentation: 'modal', title: 'Register' }} />
      
      {/* Fixed width/height container with max dimensions */}
      <View 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={isWeb ? { maxHeight: '90vh' } : { flex: 0 }}
      >
        {/* Scrollable content area */}
        <ScrollView 
          className="p-6"
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-5xl mb-2">{getIcon()}</Text>
            <Text className="text-3xl font-extrabold text-gray-900 text-center">{getTitle()}</Text>
            <Text className="text-sm text-gray-500 mt-1 text-center">Please fill in the details below</Text>
          </View>

          {/* Forms - Grid layout for web */}
          <View className={isWeb ? "flex-row flex-wrap justify-between" : "flex-col"}>
            {rawRole === 'teacher' && (
              <>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Full Name', 'teacherName', 'John Doe')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Email', 'email', 'teacher@school.edu', false, true, 'email-address')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Phone', 'phone', '9876543210', false, true, 'phone-pad')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Qualification', 'qualification', 'M.Sc, B.Ed')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Gender', 'gender', 'Male/Female')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Experience (years)', 'experience', 'e.g., 5', false, true, 'numeric')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Address', 'address', '123 Teacher Colony')}
                </View>
              </>
            )}

            {rawRole === 'driver' && (
              <>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Full Name', 'fullName', 'John Driver')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Password', 'password', '••••••••', true)}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Address', 'address', 'Driver Colony')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Experience (years)', 'experience', 'e.g., 5', false, true, 'numeric')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('License Number', 'licenseNumber', 'DL-1234567890')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Phone Number', 'phoneNo', '9876543210', false, true, 'phone-pad')}
                </View>
              </>
            )}

            {rawRole === 'admin' && (
              <>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Password', 'adminPassword', '••••••••', true)}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Experience', 'adminExperience', 'e.g., 10 years')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Address', 'adminAddress', 'School Address')}
                </View>
                <View className={isWeb ? "w-[48%]" : "w-full"}>
                  {renderInput('Phone Number', 'adminPhoneNo', '9876543210', false, true, 'phone-pad')}
                </View>
              </>
            )}
          </View>

          {/* Loading indicator */}
          {loading && (
            <View className="my-4">
              <ActivityIndicator size="large" color="#E35336" />
            </View>
          )}

          {/* Submit & Cancel Buttons */}
          <TouchableOpacity 
            className="bg-[#E35336] py-4 rounded-full items-center mt-6 mb-3 shadow-md active:opacity-90"
            onPress={handleSubmit}
            disabled={loading}
            style={isWeb ? { cursor: 'pointer', transition: 'all 0.2s' } : undefined}
          >
            <Text className="text-white font-bold text-base">Submit Registration</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-3 items-center"
            onPress={() => router.replace("/")}
          >
            <Text className="text-gray-400 font-semibold text-sm">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}