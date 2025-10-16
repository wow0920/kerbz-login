import { meApi } from '@/api/auth';
import type { AppDispatch } from '@/store';
import { clearSession, setLastActiveNow, setUser } from '@/store/sessionSlice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
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

  const logout = () => {
    dispatch(clearSession());
    router.replace('/login');
  };

  return (
    <View className="items-stretch justify-center flex-1 gap-3 p-6">
      <Text className="mb-1 text-3xl font-bold text-center">Session Locked</Text>
      <Text className="mb-3 text-center text-gray-600">You were inactive for a while.</Text>
      {!!error && <Text className="text-center text-red-700">{error}</Text>}
      <TouchableOpacity
        className="items-center py-3 bg-blue-600 rounded-lg"
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
        className="items-center py-3 bg-gray-100 rounded-lg"
        onPress={logout}
        disabled={loading}
      >
        <Text className="font-semibold text-blue-900">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
