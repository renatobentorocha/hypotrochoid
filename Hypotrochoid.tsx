import React from 'react';
import { Dimensions } from 'react-native';
import Animated, { divide, multiply } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('screen');

export type HypotrochoidProps = {
  innerRadius?: number;
  outerRadius?: number;
  distance?: number;
  amount?: Animated.Node<number>;
  hue?: number;
};

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

export const Hypotrochoid = ({
  innerRadius = 125.0,
  outerRadius = 75.0,
  distance = 25.0,
  amount = new Animated.Value(1),
  hue = 0.6,
}: HypotrochoidProps) => {
  const difference = innerRadius - outerRadius;

  const divisor = gcd(innerRadius, outerRadius);

  const circunference = multiply(multiply(2, Math.PI), outerRadius);

  const endPoint = Animated.ceil(
    multiply(divide(circunference, divisor), amount)
  );

  // const endPoint = Math.ceil((2 * Math.PI * outerRadius) / divisor) * amount;

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

    return dPath.join().replaceAll(',', ' ');
  };

  return (
    <Svg width={width} height={360} viewBox={'-85 -75 200 200'}>
      <Path d={createPath()} fill="none" stroke={`hsl(${1}, 50%, 50%)`} />
    </Svg>
  );
};
