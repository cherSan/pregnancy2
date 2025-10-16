import {ComponentProps, FC, useEffect} from "react";
import {Pressable, StyleSheet} from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withSpring} from "react-native-reanimated";

type Props = ComponentProps<typeof Animated.View> & {
    onPress?: () => void;
}

export const Card: FC<Props> = ({
    children,
    style,
    onPress,
    ...props
}) => {
    const scale = useSharedValue(0.5);

    useEffect(() => {
        scale.value = withSequence(
            withSpring(1, { damping: 20, stiffness: 180 })
        );
    }, [scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    if (onPress) {
        return (
            <Pressable onPress={onPress}>
                <Animated.View {...props} style={[styles.card, style, animatedStyle]}>
                    {children}
                </Animated.View>
            </Pressable>
        );
    }

    return (
        <Animated.View {...props} style={[styles.card, style, animatedStyle]}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        display: "flex",
        flexDirection: "column",
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#fff',
        overflow: 'hidden',
        elevation: 6,
    }
});
