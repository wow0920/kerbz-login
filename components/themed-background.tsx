import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { PropsWithChildren, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export default function ThemedBackground({ children }: PropsWithChildren) {
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme();

  const size = useMemo(() => (width + height) * 0.5, [width, height]);

  return (
    <View className="flex-1">
      <View style={StyleSheet.absoluteFill} className="bg-[#fefcff] dark:bg-black z-[-10] absolute">
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {colorScheme === 'light' ? (
            <>
              <Defs>
                <RadialGradient id="blueGlow" cx="50%" cy="50%" r="100%">
                  <Stop offset="0%" stopColor="rgb(173, 216, 230)" stopOpacity={0.35} />
                  <Stop offset="50%" stopColor="rgb(173, 216, 230)" stopOpacity={0} />
                </RadialGradient>

                <RadialGradient id="pinkGlow" cx="50%" cy="50%" r="100%">
                  <Stop offset="0%" stopColor="rgb(255, 182, 193)" stopOpacity={0.4} />
                  <Stop offset="50%" stopColor="rgb(255, 182, 193)" stopOpacity={0} />
                </RadialGradient>
              </Defs>

              <Rect
                x={width * 0.3 - size * 0.4}
                y={height * 0.7 - size * 0.4}
                width={size * 0.8}
                height={size * 0.8}
                fill="url(#blueGlow)"
              />
              <Rect
                x={width * 0.7 - size * 0.4}
                y={height * 0.3 - size * 0.4}
                width={size * 0.8}
                height={size * 0.8}
                fill="url(#pinkGlow)"
              />
            </>
          ) : (
            <>
              <Defs>
                <RadialGradient id="purpleGlow" cx="50%" cy="50%" r="100%">
                  <Stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity={0.12} />
                  <Stop offset="50%" stopColor="rgb(147, 51, 234)" stopOpacity={0} />
                </RadialGradient>

                <RadialGradient id="blueGlow" cx="50%" cy="50%" r="100%">
                  <Stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity={0.1} />
                  <Stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity={0} />
                </RadialGradient>

                <RadialGradient id="pinkGlow" cx="50%" cy="50%" r="100%">
                  <Stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity={0.14} />
                  <Stop offset="50%" stopColor="rgb(236, 72, 153)" stopOpacity={0} />
                </RadialGradient>

                <RadialGradient id="greenGlow" cx="50%" cy="50%" r="100%">
                  <Stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity={0.08} />
                  <Stop offset="50%" stopColor="rgb(16, 185, 129)" stopOpacity={0} />
                </RadialGradient>
              </Defs>

              <Rect
                x={width * 0.25 - size * 0.55}
                y={height * 0.8 - size * 0.55}
                width={size * 1.1}
                height={size * 1.1}
                fill="url(#purpleGlow)"
              />
              <Rect
                x={width * 0.75 - size * 0.65}
                y={height * 0.15 - size * 0.65}
                width={size * 1.3}
                height={size * 1.3}
                fill="url(#blueGlow)"
              />
              <Rect
                x={width * 0.2 - size * 0.4}
                y={height * 0.3 - size * 0.4}
                width={size * 0.8}
                height={size * 0.8}
                fill="url(#pinkGlow)"
              />
              <Rect
                x={width * 0.6 - size * 0.5}
                y={height * 0.7 - size * 0.5}
                width={size}
                height={size}
                fill="url(#greenGlow)"
              />
            </>
          )}
        </Svg>
      </View>
      {children}
    </View>
  );
}
