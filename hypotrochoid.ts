import Animated from 'react-native-reanimated';

type CreatePathProps = {
  innerRadius: Animated.SharedValue<number>;
  outerRadius: Animated.SharedValue<number>;
  distance: Animated.SharedValue<number>;
};

export const createPath = ({
  innerRadius,
  outerRadius,
  distance,
}: CreatePathProps) => {
  'worklet';

  const dPath = [];
  let theta = 0;
  const step = 0.09;

  const difference = innerRadius.value - outerRadius.value;

  while (theta <= 300) {
    const x =
      difference * Math.cos(theta) +
      distance.value * Math.cos((difference / outerRadius.value) * theta);

    const y =
      difference * Math.sin(theta) -
      distance.value * Math.sin((difference / outerRadius.value) * theta);

    if (theta === 0) {
      dPath.push(`M${x} ${y}`);
    } else {
      dPath.push(`L${x} ${y}`);
    }

    theta += step;
  }

  return dPath.join().replaceAll(',', ' ');
};
