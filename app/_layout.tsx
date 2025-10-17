import '@/global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { meApi } from '@/api/auth';
import { getPersistedToken, initializeApi } from '@/api/client';
import ActivityTracker from '@/components/activity-tracker';
import AuthGate from '@/components/auth-gate';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { store, type AppDispatch } from '@/store';
import { clearSession, setCredentials, setUser } from '@/store/sessionSlice';
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

export const unstable_settings = {
  anchor: '(tabs)',
};

initializeApi(store);

function Bootstrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getPersistedToken();
        if (token) {
          if (!mounted) return;
          dispatch(setCredentials({ token }));
          try {
            const me = await meApi();
            if (!mounted) return;
            dispatch(setUser(me));
          } catch {
            // Any failure clears session
            dispatch(clearSession());
          }
        } else {
          dispatch(clearSession());
        }
      } catch {
        dispatch(clearSession());
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Bootstrapper>
          <ActivityTracker />
          <AuthGate>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: 'transparent' },
                headerShown: false,
                animation: 'slide_from_left',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="lock" />
            </Stack>
          </AuthGate>
          <StatusBar style="auto" />
        </Bootstrapper>
      </ThemeProvider>
    </Provider>
  );
}
