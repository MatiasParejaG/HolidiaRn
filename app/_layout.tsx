import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Toaster } from 'sonner-native';

import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import '../global.css';

import { SplashScreen, Stack, router } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { ReactNode, useCallback, useEffect } from 'react';
import { Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { APIProvider } from '~/core/api/api-provider';
import { hydrateAuth } from '~/core/auth';
import theme from '~/core/theme/use-theme-config';
import { logAPIUrl } from '~/core/utils/log';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

hydrateAuth();
SplashScreen.preventAutoHideAsync();

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    logAPIUrl();
  }, []);

  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (!url) return;

      try {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          console.log('handle stripe payment url');
          router.push('/payment-successful');
        } else {
        }
      } catch (error) {}
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getInitialURL = async () => {
      try {
        const initialURL = await Linking.getInitialURL();
        await handleDeepLink(initialURL);
      } catch (error) {}
    };
    getInitialURL();
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });
    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}>
        <APIProvider>
          <KeyboardProvider>
            <ThemeProvider value={theme}>
              <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
            </ThemeProvider>
          </KeyboardProvider>
        </APIProvider>
      </StripeProvider>
      <Toaster />
    </GestureHandlerRootView>
  );
};

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="properties/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="payment-successful" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}
