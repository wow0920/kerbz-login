import { meApi } from '@/api/auth';
import { persistToken } from '@/api/client';
import ThemedBackground from '@/components/themed-background';
import type { AppDispatch } from '@/store';
import { clearSession, setLastActiveNow, setUser } from '@/store/sessionSlice';
import { GlassView } from 'expo-glass-effect';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function LockScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const unlock = async () => {
    setLoading(true);
    setError('');
    try {
      const me = await meApi();
      dispatch(setUser(me));
      dispatch(setLastActiveNow());
      router.replace('/');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      const msg = err?.response?.data?.message || err?.message || 'Unlock failed';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Ensure any persisted token is cleared when logging out
    await persistToken(null);
    dispatch(clearSession());
    router.replace('/login');
  };

  return (
    <ThemedBackground>
      <View className="items-stretch justify-center flex-1 gap-4 p-6">
        <View className="items-center">
          <Text className="mb-1 text-3xl font-extrabold text-primary">Session Locked</Text>
          <Text className="text-center text-gray-600 dark:text-gray-400">
            You were inactive for a while.
          </Text>
        </View>
        {!!error && <Text className="text-center text-red-700">{error}</Text>}
        <GlassView style={styles.glassView} glassEffectStyle="clear" isInteractive>
          <View className="gap-3 p-4 bg-black/5 dark:bg-white/5">
            <TouchableOpacity
              className="items-center py-3 rounded-lg bg-primary"
              onPress={unlock}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-semibold text-white">Unlock</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center py-3 rounded-lg bg-indigo-50 dark:bg-white/5"
              onPress={logout}
              disabled={loading}
            >
              <Text className="font-semibold text-primary">Logout</Text>
            </TouchableOpacity>
          </View>
        </GlassView>
      </View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  glassView: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
