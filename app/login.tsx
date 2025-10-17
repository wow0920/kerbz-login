import { loginApi } from '@/api/auth';
import { persistToken } from '@/api/client';
import ThemedBackground from '@/components/themed-background';
import type { AppDispatch } from '@/store';
import { setCredentials, setUser } from '@/store/sessionSlice';
import { GlassView } from 'expo-glass-effect';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    const trimmedEmail = email.trim();

    // Basic email validation
    if (!trimmedEmail) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const data = await loginApi({ email: email.trim(), password });
      const token = data?.token;
      if (!token) throw new Error('No token returned');
      // Respect remember-me toggle; clear any old persisted token when off
      if (rememberMe) {
        await persistToken(token);
      } else {
        await persistToken(null);
      }
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
    <ThemedBackground>
      <View className="items-stretch justify-center flex-1 gap-4 p-6">
        <View className="items-center gap-2 mb-2">
          <View className="flex-row items-end gap-3">
            <Text className="text-3xl font-extrabold text-indigo-700 dark:text-primary">
              Welcome to
            </Text>
            <Image
              style={styles.logoImage}
              source={require('@/assets/images/favicon.png')}
              transition={500}
            />
          </View>
          <Text className="mt-1 text-sm text-black/50 dark:text-white/50">
            Please authenticate to continue
          </Text>
        </View>
        {!!error && <Text className="text-center text-red-700">{error}</Text>}
        <GlassView glassEffectStyle="regular" style={styles.glassView} isInteractive>
          <View className="gap-2 p-4 bg-black/5 dark:bg-white/5">
            <TextInput
              className="p-3 mb-1 border rounded-lg border-indigo-600/50 bg-black/5 dark:bg-white/5 dark:text-white dark:border-white/10"
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (emailError) {
                  // Re-validate on change to provide instant feedback clearing
                  if (/^\S+@\S+\.\S+$/.test(v.trim())) setEmailError('');
                }
              }}
            />
            {!!emailError && <Text className="mb-2 -mt-1 text-xs text-red-700">{emailError}</Text>}
            <TextInput
              className="p-3 mb-1 border rounded-lg border-indigo-600/50 bg-black/5 dark:bg-white/5 dark:text-white dark:border-white/10"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (passwordError) {
                  if (v.length >= 6) setPasswordError('');
                }
              }}
            />
            {!!passwordError && <Text className="-mt-1 text-xs text-red-700">{passwordError}</Text>}

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-800 dark:text-gray-200">Remember me</Text>
              <Switch value={rememberMe} onValueChange={setRememberMe} />
            </View>
          </View>
        </GlassView>
        <TouchableOpacity
          className="items-center py-3 rounded-lg bg-primary"
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size={24} />
          ) : (
            <Text className="text-lg font-semibold text-white">Sign In</Text>
          )}
        </TouchableOpacity>
        <Text className="mt-1 text-center text-gray-600 dark:text-gray-400">
          2025 © Made with ❤️ by Forrest Carlton
        </Text>
      </View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  glassView: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 24,
  },
});
