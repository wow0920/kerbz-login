import { persistToken } from '@/api/client';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import ThemedBackground from '@/components/themed-background';
import type { AppDispatch } from '@/store';
import { clearSession, useSession } from '@/store/sessionSlice';
import { GlassView } from 'expo-glass-effect';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

export default function DashboardScreen() {
  const { user } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const onLogout = async () => {
    await persistToken(null);
    dispatch(clearSession());
    router.replace('/login');
  };

  return (
    <ThemedBackground>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#4f46e5', dark: '#312e81' }}
        headerContent={
          <SafeAreaView className="flex-1">
            <View className="flex-1">
              <View className="flex-row items-center justify-between px-4 pt-2">
                <Image
                  className="w-12 h-12 rounded-xl"
                  source={require('@/assets/images/favicon.png')}
                />
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={onLogout}
                    className="px-3 py-1 rounded-full bg-primary dark:bg-white/20"
                    accessibilityRole="button"
                    accessibilityLabel="Log out"
                  >
                    <Text className="font-semibold text-white">Log out</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="items-center justify-center flex-1">
                <View className="flex-col items-center gap-2">
                  <Text className="text-2xl font-bold text-primary dark:text-white">
                    Welcome back 👋
                  </Text>
                  <Text className="text-lg font-semibold text-primary dark:text-white">
                    {user?.full_name}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        }
      >
        {user && (
          <View className="gap-4">
            <GlassView style={styles.glassView} glassEffectStyle="clear" isInteractive>
              <View className="p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                <Text className="mb-3 text-2xl font-extrabold text-center text-primary">
                  Your Profile
                </Text>
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-600 dark:text-gray-300">ID</Text>
                  <Text className="font-semibold dark:text-white">{user.id}</Text>
                </View>
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-600 dark:text-gray-300">Name</Text>
                  <Text className="font-semibold dark:text-white">{user.name}</Text>
                </View>
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-600 dark:text-gray-300">Email</Text>
                  <Text className="font-semibold dark:text-white">{user.email}</Text>
                </View>
                {user.email_verified_at && (
                  <View className="flex-row justify-between py-2">
                    <Text className="text-gray-600 dark:text-gray-300">Verified at</Text>
                    <Text className="font-semibold dark:text-white">
                      {new Date(user.email_verified_at).toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>
            </GlassView>
          </View>
        )}
      </ParallaxScrollView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  glassView: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
