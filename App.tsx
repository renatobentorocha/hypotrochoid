import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  add,
  and,
  cond,
  eq,
  event,
  set,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Hypotrochoid } from './Hypotrochoid';

const { width, height } = Dimensions.get('window');

export default function App() {
  const translationX = useRef(new Animated.Value<number>(0)).current;
  const offsetX = useRef(new Animated.Value<number>(0)).current;
  const gestureState = useRef(new Animated.Value<State>(State.UNDETERMINED))
    .current;
  const gestureOldState = useRef(new Animated.Value<State>(State.UNDETERMINED))
    .current;

  const innerRadius = 125.0;
  const outerRadius = 75.0;
  const difference = innerRadius - outerRadius;
  const distance = 25.0;
  const amount = 1.0;
  const hue = 0.6;

  const gcd = (a: number, b: number) => {
    let _a = a;
    let _b = b;

    while (_b != 0) {
      const temp = _b;
      _b = _a % _b;
      _a = temp;
    }

    return _a;
  };

  const divisor = gcd(innerRadius, outerRadius);
  const endPoint = Math.ceil((2 * Math.PI * outerRadius) / divisor) * amount;

  const createPath = () => {
    const dPath = [];
    let theta = 0;
    const step = 0.01;

    while (theta <= endPoint) {
      const x =
        difference * Math.cos(theta) +
        distance * Math.cos((difference / outerRadius) * theta);

      const y =
        difference * Math.sin(theta) -
        distance * Math.sin((difference / outerRadius) * theta);

      if (theta === 0) {
        dPath.push(`M${x} ${y}`);
      } else {
        dPath.push(`L${x} ${y}`);
      }

      theta += step;
    }

    console.log({ dPath: dPath.join().replaceAll(',', ' ') });
    return dPath.join().replaceAll(',', ' ');
  };

  const onGestureEvent = event<PanGestureHandlerGestureEvent>([
    {
      nativeEvent: { translationX },
    },
  ]);

  const onHandlerStateChange = event<PanGestureHandlerStateChangeEvent>([
    {
      nativeEvent: { state: gestureState, oldState: gestureOldState },
    },
  ]);

  const translateX = cond(
    eq(gestureState, State.ACTIVE),
    add(offsetX, translationX),
    cond(
      and(eq(gestureOldState, State.ACTIVE), eq(gestureState, State.END)),
      set(offsetX, add(offsetX, translationX)),
      add(offsetX, translationX)
    )
  );

  return (
    <View style={styles.container}>
      <Svg width={width} height={360} viewBox={'-85 -75 200 200'}>
        <Path d={createPath()} fill="none" stroke={`hsl(${1}, 50%, 50%)`} />
      </Svg>
      {/* <Hypotrochoid amount={translateX} /> */}

      <Animated.View style={{ alignItems: 'center' }}>
        <View
          style={{ width: width - 30, height: 5, backgroundColor: '#c3c3c3' }}
        />
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
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
              { transform: [{ translateX }] },
            ]}
          />
        </PanGestureHandler>
      </Animated.View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
