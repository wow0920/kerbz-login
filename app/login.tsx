import { loginApi } from '@/api/auth';
import { persistToken } from '@/api/client';
import type { AppDispatch } from '@/store';
import { setCredentials, setUser } from '@/store/sessionSlice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await loginApi({ email: email.trim(), password });
      const token = data?.token;
      if (!token) throw new Error('No token returned');
      await persistToken(token);
      dispatch(setCredentials({ token }));

      // set user data from /login directly since /me returns 404 always
      dispatch(setUser(data.user));
      router.replace('/');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      const msg = err?.response?.data?.message || err?.message || 'Login failed';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="items-stretch justify-center flex-1 gap-3 p-6">
      <Text className="mb-3 text-3xl font-bold text-center dark:text-white">Kerbz Login</Text>
      {!!error && <Text className="text-center text-red-700">{error}</Text>}
      <TextInput
        className="p-3 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-white"
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="p-3 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-white"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="items-center py-3 bg-blue-600 rounded-lg"
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-semibold text-white">Sign In</Text>
        )}
      </TouchableOpacity>
      <Text className="mt-1 text-center text-gray-600 dark:text-gray-400">
        2025 © Made with ❤️ by Forrest Carlton
      </Text>
    </View>
  );
}
