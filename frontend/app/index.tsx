import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { authStorage } from '@/utils/authStorage';

export default function SplashScreen() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if onboarding has been completed
      const hasSeenOnboarding = await authStorage.hasCompletedOnboarding();

      // Check if user opted for remember me
      const rememberMe = await authStorage.getRememberMe();
      const token = await authStorage.getToken();
      const user = await authStorage.getUser();

      // Wait minimum 1.5 seconds for splash screen visibility
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (rememberMe && token && user) {
        // User has remember me enabled and valid token - auto login
        // Note: If token is expired, API calls will handle it and redirect to login
        router.replace('/(tabs)');
      } else if (hasSeenOnboarding) {
        // User has seen onboarding before - go to login
        // Don't clear auth here - let user explicitly logout if needed
        router.replace('/auth/login');
      } else {
        // First time user - show onboarding
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, go to onboarding
      router.replace('/onboarding');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <LinearGradient
      colors={['#45BFD0', '#2B9EB3']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Thots</Text>
        <Text style={styles.subtitle}>Share your mind</Text>
        {isChecking && (
          <ActivityIndicator
            size="large"
            color="#FFFFFF"
            style={styles.loader}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'OpenSans_300Light',
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 32 * 1.4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'OpenSans_300Light',
    fontWeight: '300',
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 16 * 1.4,
  },
  loader: {
    marginTop: 20,
  },
});
