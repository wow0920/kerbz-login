import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GlassView } from 'expo-glass-effect';

const HEADER_HEIGHT = 150;

type Props = PropsWithChildren<{
  headerContent: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerContent,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
      <Animated.View
        style={[
          styles.header,
          // { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}
      >
        <GlassView isInteractive style={styles.glassView}>
          {headerContent}
        </GlassView>
      </Animated.View>
      <View className="flex-1 gap-4 p-8 overflow-hidden bg-transparent">{children}</View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  glassView: {
    flex: 1,
  },
});
