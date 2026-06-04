import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Image,
  Alert,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

type ThemeMode = 'Light' | 'Dark' | 'System';
type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu';

type ProfileState = {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  school: string;
  bio: string;
  avatarUri: string | null;
};

const SWITCH_ON_TRACK = '#FCA5A5';
const SWITCH_OFF_TRACK = '#FECACA';
const SWITCH_THUMB = '#DC2626';
const SWITCH_THUMB_OFF = '#FFFFFF';

export default function ReceptionistProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [profile, setProfile] = useState<ProfileState>({
    fullName: 'Reception Desk',
    role: 'Front Desk Operator',
    email: 'reception@svps.edu',
    phone: '+91 90000 12345',
    department: 'Reception',
    school: 'SVPS International School',
    bio: 'Managing visitor flow, inquiries, and front desk operations.',
    avatarUri: null,
  });

  const [draftProfile, setDraftProfile] = useState(profile);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [photoActionOpen, setPhotoActionOpen] = useState(false);

  const [themeMode, setThemeMode] = useState<ThemeMode>('Light');
  const [language, setLanguage] = useState<Language>('English');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const initials = useMemo(() => {
    return profile.fullName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [profile.fullName]);

  const notify = (title: string, message: string) => {
    if (Platform.OS === 'web') window.alert(`${title}\n\n${message}`);
    else Alert.alert(title, message);
  };

  const saveProfile = () => {
    if (!draftProfile.fullName.trim() || !draftProfile.email.trim()) {
      notify('Validation', 'Name and email are required.');
      return;
    }
    setProfile(draftProfile);
    setEditModalOpen(false);
    notify('Success', 'Profile updated successfully.');
  };

  const pickImageFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      notify('Permission Required', 'Photo library permission is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfile((prev) => ({ ...prev, avatarUri: result.assets[0].uri }));
    }
  };

  const pickImageFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      notify('Permission Required', 'Camera permission is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfile((prev) => ({ ...prev, avatarUri: result.assets[0].uri }));
    }
  };

  const openAvatarPicker = () => {
    if (Platform.OS === 'web') {
      pickImageFromLibrary();
      return;
    }
    setPhotoActionOpen(true);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      notify('Validation', 'Please fill all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      notify('Validation', 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      notify('Validation', 'New password and confirm password do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordModalOpen(false);
    notify('Success', 'Password changed successfully.');
  };

  const handleLogout = async () => {
    try {
      setPhotoActionOpen(false);
      setEditModalOpen(false);
      setPasswordModalOpen(false);
      if (router.canDismiss?.()) router.dismissAll();
      router.replace('/home' as any);
    } catch {
      router.replace('/home' as any);
    }
  };

  const SettingRow = ({
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.settingRow}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <View>{children}</View>
    </View>
  );

  const QuickCard = ({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.quickCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.quickIconWrap}>
        <Ionicons name={icon} size={18} color="#DC2626" />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 12 }}>
        <Text style={styles.quickTitle}>{title}</Text>
        <Text style={styles.quickSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#DC2626" />
    </TouchableOpacity>
  );

  const RedSwitch = ({
    value,
    onValueChange,
  }: {
    value: boolean;
    onValueChange: (v: boolean) => void;
  }) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: SWITCH_OFF_TRACK, true: SWITCH_ON_TRACK }}
      thumbColor={value ? SWITCH_THUMB : SWITCH_THUMB_OFF}
      activeThumbColor={SWITCH_THUMB}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isMobile ? styles.contentMobile : styles.contentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <TouchableOpacity
            style={styles.avatarWrap}
            activeOpacity={0.9}
            onPress={openAvatarPicker}
          >
            {profile.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
            <View style={styles.cameraChip}>
              <Ionicons name="camera" size={13} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <View>
                <Text style={styles.name}>{profile.fullName}</Text>
                <Text style={styles.role}>{profile.role}</Text>
              </View>
            </View>

            <Text style={styles.meta}>{profile.school}</Text>

            <View style={styles.badgeRow}>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
              <View style={styles.badgeAlt}>
                <Text style={styles.badgeAltText}>Reception Profile</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.photoStrip}>
          <TouchableOpacity style={styles.photoAction} onPress={openAvatarPicker}>
            <Ionicons name="images-outline" size={18} color="#DC2626" />
            <Text style={styles.photoActionText}>Upload Photo</Text>
          </TouchableOpacity>

          {Platform.OS !== 'web' ? (
            <TouchableOpacity style={styles.photoAction} onPress={pickImageFromCamera}>
              <Ionicons name="camera-outline" size={18} color="#DC2626" />
              <Text style={styles.photoActionText}>Take Photo</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.photoAction, styles.photoActionDisabled]}>
              <Ionicons name="camera-outline" size={18} color="#A1A1AA" />
              <Text style={styles.photoActionTextDisabled}>Camera not available on web</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Tasks Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Open Queries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
            <TouchableOpacity
              style={styles.inlineMiniButton}
              onPress={() => {
                setDraftProfile(profile);
                setEditModalOpen(true);
              }}
            >
              <Ionicons name="create-outline" size={14} color="#DC2626" />
              <Text style={styles.inlineMiniButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <InfoRow label="Full Name" value={profile.fullName} />
          <InfoRow label="Role" value={profile.role} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Phone" value={profile.phone} />
          <InfoRow label="Department" value={profile.department} />
          <InfoRow label="School" value={profile.school} />
          <InfoRow label="Bio" value={profile.bio} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <SettingRow title="Push Notifications" subtitle="Receive in-app alerts">
            <RedSwitch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          </SettingRow>

          <SettingRow title="Email Updates" subtitle="Get updates by email">
            <RedSwitch value={emailUpdates} onValueChange={setEmailUpdates} />
          </SettingRow>

          <SettingRow title="SMS Alerts" subtitle="Receive SMS for important items">
            <RedSwitch value={smsUpdates} onValueChange={setSmsUpdates} />
          </SettingRow>

          <View style={styles.segmentRow}>
            {(['Light', 'Dark', 'System'] as ThemeMode[]).map((mode) => {
              const active = themeMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[styles.segmentItem, active && styles.segmentItemActive]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {mode}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* <View style={styles.languageRow}>
            {(['English', 'Hindi', 'Tamil', 'Telugu'] as Language[]).map((lang) => {
              const active = language === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[styles.languageChip, active && styles.languageChipActive]}
                  onPress={() => setLanguage(lang)}
                >
                  <Text
                    style={[
                      styles.languageChipText,
                      active && styles.languageChipTextActive,
                    ]}
                  >
                    {lang}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View> */}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Security & Access</Text>

          <QuickCard
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update login credentials"
            onPress={() => setPasswordModalOpen(true)}
          />
          <QuickCard
            icon="shield-checkmark-outline"
            title="Privacy & Permissions"
            subtitle="Manage account access"
            onPress={() => notify('Privacy', 'Privacy settings can be connected here.')}
          />
          <QuickCard
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get assistance and documentation"
            onPress={() => notify('Support', 'Support section can be connected here.')}
          />

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={photoActionOpen} transparent animationType="fade" onRequestClose={() => setPhotoActionOpen(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setPhotoActionOpen(false)}>
          <Pressable style={styles.sheetCard} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Update Photo</Text>
            <Text style={styles.sheetSubtitle}>Choose how you want to add your profile photo</Text>

            <TouchableOpacity
              style={styles.sheetAction}
              onPress={() => {
                setPhotoActionOpen(false);
                pickImageFromLibrary();
              }}
            >
              <Ionicons name="images-outline" size={18} color="#DC2626" />
              <Text style={styles.sheetActionText}>Choose from gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetAction}
              onPress={() => {
                setPhotoActionOpen(false);
                pickImageFromCamera();
              }}
            >
              <Ionicons name="camera-outline" size={18} color="#DC2626" />
              <Text style={styles.sheetActionText}>Take photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCancel}
              onPress={() => setPhotoActionOpen(false)}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={editModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.modalSubtitle}>Update all your personal details</Text>

            <Field label="Full Name" value={draftProfile.fullName} onChangeText={(t) => setDraftProfile((p) => ({ ...p, fullName: t }))} />
            <Field label="Role" value={draftProfile.role} onChangeText={(t) => setDraftProfile((p) => ({ ...p, role: t }))} />
            <Field label="Email" value={draftProfile.email} onChangeText={(t) => setDraftProfile((p) => ({ ...p, email: t }))} />
            <Field label="Phone" value={draftProfile.phone} onChangeText={(t) => setDraftProfile((p) => ({ ...p, phone: t }))} />
            <Field label="Department" value={draftProfile.department} onChangeText={(t) => setDraftProfile((p) => ({ ...p, department: t }))} />
            <Field label="School" value={draftProfile.school} onChangeText={(t) => setDraftProfile((p) => ({ ...p, school: t }))} />
            <Field label="Bio" value={draftProfile.bio} onChangeText={(t) => setDraftProfile((p) => ({ ...p, bio: t }))} multiline />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setEditModalOpen(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={saveProfile}
              >
                <Text style={styles.modalBtnSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={passwordModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.modalSubtitle}>Keep your account secure</Text>

            <Field label="Current Password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
            <Field label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
            <Field label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setPasswordModalOpen(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalBtnSaveText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  secureTextEntry,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
}) {
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF1F2' },
  content: { paddingBottom: 24 },
  contentMobile: { paddingHorizontal: 16, paddingTop: 16 },
  contentDesktop: {
    paddingHorizontal: 24,
    paddingTop: 20,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 22 },
  cameraChip: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  name: { fontSize: 20, fontWeight: '800', color: '#7F1D1D' },
  role: { fontSize: 14, color: '#B91C1C', marginTop: 3, fontWeight: '600' },
  meta: { fontSize: 13, color: '#7C2D12', marginTop: 6 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  activeBadgeText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeAlt: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badgeAltText: { color: '#C2410C', fontSize: 12, fontWeight: '700' },
  photoStrip: { flexDirection: 'row', gap: 12, marginTop: 14, flexWrap: 'wrap' },
  photoAction: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoActionDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E5E7EB',
  },
  photoActionText: { color: '#7F1D1D', fontWeight: '700', fontSize: 14 },
  photoActionTextDisabled: { color: '#6B7280', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: '#7F1D1D' },
  statLabel: { fontSize: 13, color: '#9A3412', marginTop: 6, fontWeight: '600' },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7F1D1D',
  },
  inlineMiniButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  inlineMiniButtonText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9A3412',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
  },
  settingTitle: { fontSize: 15.5, fontWeight: '700', color: '#1F2937' },
  settingSubtitle: { fontSize: 12.5, color: '#9A3412', marginTop: 4 },
  segmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  segmentItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  segmentItemActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  segmentText: { fontSize: 12.5, color: '#7F1D1D', fontWeight: '700' },
  segmentTextActive: { color: '#FFFFFF' },
  languageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  languageChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#FFF7F7',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  languageChipActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  languageChipText: { fontSize: 12.5, color: '#7F1D1D', fontWeight: '700' },
  languageChipTextActive: { color: '#FFFFFF' },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F7',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  quickIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  quickTitle: { fontSize: 14.5, fontWeight: '700', color: '#1F2937' },
  quickSubtitle: { fontSize: 12.5, color: '#9A3412', marginTop: 4 },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: { color: '#DC2626', fontWeight: '700', fontSize: 14.5 },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7F1D1D',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#9A3412',
    marginTop: 4,
    marginBottom: 14,
  },
  sheetAction: {
    backgroundColor: '#FFF7F7',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sheetActionText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#7F1D1D',
  },
  sheetCancel: {
    marginTop: 6,
    alignItems: 'center',
    paddingVertical: 12,
  },
  sheetCancelText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(68, 24, 24, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#7F1D1D' },
  modalSubtitle: { fontSize: 13, color: '#9A3412', marginTop: 4, marginBottom: 14 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9A3412',
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFF7F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  modalBtnSave: { backgroundColor: '#DC2626' },
  modalBtnCancelText: { color: '#7F1D1D', fontWeight: '700' },
  modalBtnSaveText: { color: '#FFFFFF', fontWeight: '700' },
});