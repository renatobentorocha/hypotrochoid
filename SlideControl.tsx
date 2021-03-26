import React from 'react';
import { Dimensions, StyleProp, Text, View, ViewStyle } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { clamp } from 'react-native-redash';

const { width } = Dimensions.get('window');

export type SlideControlProps = {
  style?: StyleProp<ViewStyle>;
  title: string;
  translateX: Animated.SharedValue<number>;
};

export function SlideControl({ style, title, translateX }: SlideControlProps) {
  const handler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = clamp(translateX.value, 0, width - 30);
    },
    onActive: (event, ctx) => {
      translateX.value = clamp(ctx.startX + event.translationX, 0, width - 30);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: clamp(translateX.value, 0, width - 30) }],
  }));

  return (
    <View
      style={[
        {
          minHeight: 45,
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 24 }}>{title}</Text>
      <Animated.View style={{ alignItems: 'center' }}>
        <View
          style={{ width: width - 30, height: 5, backgroundColor: '#c3c3c3' }}
        />
        <PanGestureHandler onGestureEvent={handler}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: -15,
                left: 0,
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#9c7878',
              },
              animatedStyle,
            ]}
          />
        </PanGestureHandler>
      </Animated.View>
    </View>
  );
}
