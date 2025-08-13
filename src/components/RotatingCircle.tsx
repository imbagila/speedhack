import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

type Props = {
    size?: number;
    color?: string;
    style?: ViewStyle;
};

export const RotatingCircle: React.FC<Props> = ({ size = 160, color = '#4B7BE5', style }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        loop.start();
        return () => {
            loop.stop();
        };
    }, [rotateAnim]);

    const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <Animated.View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: size * 0.06,
                    borderColor: color,
                    borderTopColor: 'transparent',
                    transform: [{ rotate }],
                },
                style,
            ]}
        />
    );
};


