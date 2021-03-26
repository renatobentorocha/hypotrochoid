import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Dimensions, StyleSheet, SafeAreaView } from 'react-native';

import Animated, {
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';

import { useAnimatedProps } from 'react-native-reanimated';

import Svg, { G, Path } from 'react-native-svg';
import { createPath } from './hypotrochoid';
import { SlideControl } from './SlideControl';

const { width, height } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);

Animated.addWhitelistedNativeProps({ d: true });
Animated.addWhitelistedUIProps({ d: true });

export default function App() {
  const translateXinnerRadius = useSharedValue(125.0);
  const translateXouterRadius = useSharedValue(75.0);
  const translateXdistance = useSharedValue(25.0);
  const translateXhue = useSharedValue(1);
  const translateXsaturation = useSharedValue(50);
  const translateXlightness = useSharedValue(50);

  const innerRadius = useDerivedValue(() => {
    return translateXinnerRadius.value;
  });

  const outerRadius = useDerivedValue(() => {
    return translateXouterRadius.value;
  });

  const distance = useDerivedValue(() => {
    return translateXdistance.value;
  });

  const hue = useDerivedValue(() => {
    return translateXhue.value;
  });

  const saturation = useDerivedValue(() => {
    return translateXsaturation.value;
  });

  const lightness = useDerivedValue(() => {
    return translateXlightness.value;
  });

  const animatedProps = useAnimatedProps(() => {
    const d = createPath({
      innerRadius,
      outerRadius,
      distance,
    });

    return {
      d,
      stroke: `hsl(${hue.value}, ${saturation.value}%, ${lightness.value}%)`,
    };
  });

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Svg
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          width={width}
          height={height}
        >
          <G x={width / 2} y={height / 5}>
            <AnimatedPath {...{ animatedProps }} fill="none" strokeWidth={2} />
          </G>
        </Svg>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <SlideControl
            style={{ marginBottom: 30 }}
            title="Inner radius"
            translateX={translateXinnerRadius}
          />
          <SlideControl
            style={{ marginBottom: 30 }}
            title="Outer radius"
            translateX={translateXouterRadius}
          />
          <SlideControl
            style={{ marginBottom: 30 }}
            title="Distance"
            translateX={translateXdistance}
          />
          <SlideControl
            style={{ marginBottom: 30 }}
            title="Hue"
            translateX={translateXhue}
          />
          <SlideControl
            style={{ marginBottom: 30 }}
            title="Saturation"
            translateX={translateXsaturation}
          />
          <SlideControl title="Lightness" translateX={translateXlightness} />
        </View>

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 90,
  },
});
