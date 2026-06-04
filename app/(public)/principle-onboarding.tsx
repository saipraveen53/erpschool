import { Redirect, useLocalSearchParams } from 'expo-router';

export default function OldOnboardingRedirect() {
  const { token } = useLocalSearchParams();
  return <Redirect href={`/super-admin/onboarding?token=${token || ''}`} />;
}
