import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { OpenSans_300Light, OpenSans_400Regular, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { usePushNotifications } from '@/utils/usePushNotifications';
import { ToastProvider } from '@/utils/ToastContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  usePushNotifications();

  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });

  // Handle deep link URLs (e.g. https://thoughts.co.in/poll/abc123)
  const handleDeepLink = (url: string) => {
    try {
      const parsed = new URL(url);
      const path = parsed.pathname; // e.g. "/poll/abc123" or "/profile/username"

      if (path.startsWith('/poll/')) {
        const pollId = path.replace('/poll/', '');
        if (pollId) {
          router.push(`/poll/${pollId}`);
        }
      } else if (path.startsWith('/profile/')) {
        const username = path.replace('/profile/', '');
        if (username) {
          router.push({ pathname: '/(tabs)/profile/[username]', params: { username } });
        }
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };

  useEffect(() => {
    // Handle URL that opened the app (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) {
        // Small delay to ensure navigation is ready
        setTimeout(() => handleDeepLink(url), 1000);
      }
    });

    // Handle URLs while app is already open (warm start)
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="auth/reset-password-sent" />
        <Stack.Screen name="auth/reset-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ToastProvider>
  );
}

