import ParallaxScrollView from '@/components/parallax-scroll-view';
import { useSession } from '@/store/sessionSlice';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { user } = useSession();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerContent={
        <SafeAreaView className="flex-1">
          <View className="items-center justify-center flex-1">
            <View className="flex-col items-center gap-2">
              <Text className="text-2xl font-bold dark:text-white">Welcome Back! 👋</Text>
              <Text className="text-lg font-bold text-blue-800 dark:text-blue-200">
                {user?.full_name}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      }
    >
      {user && (
        <>
          <Text className="pb-3 mb-3 text-xl font-bold text-center border-b border-black/50 white:border-white/50 dark:text-white">
            Your Profile
          </Text>
          <Text className="dark:text-white">ID: {user.id}</Text>
          <Text className="dark:text-white">Name: {user.name}</Text>
          <Text className="dark:text-white">Email: {user.email}</Text>
        </>
      )}
    </ParallaxScrollView>
  );
}
