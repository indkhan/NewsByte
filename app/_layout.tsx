import React, { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Handle authentication routing
function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';

    if (!isLoggedIn && inAuthGroup) {
      // Redirect to login if trying to access protected routes while not logged in
      router.replace('/login');
    } else if (isLoggedIn && !inAuthGroup && segments[0] !== 'article' && segments[0] !== 'comments') {
      // Redirect to home if already logged in and trying to access auth screens
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments]);

  return <>{children}</>;
}

// Main layout component with theme handling
const RootLayoutNav = () => {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        <Stack.Screen name="article" options={{ headerShown: false }} />
        <Stack.Screen name="comments" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthRouteGuard>
          <RootLayoutNav />
        </AuthRouteGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}