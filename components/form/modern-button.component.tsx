import {FC, JSX, useEffect, useRef, useState} from "react";
import {Pressable, StyleSheet, Text, Animated} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {purpleTheme} from "@/theme/main";

type ButtonProps = {
    onPress: () => void;
    children: string | string[] | JSX.Element | JSX.Element[];
}

export const ModernButton: FC<ButtonProps> = ({
    onPress,
    children
}) => {
    const [buttonWidth, setButtonWidth] = useState(0);
    const shimmerAnim = useRef(new Animated.Value(-1));

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim.current, {
                toValue: 1,
                duration: 3500,
                useNativeDriver: true,
            })
        ).start();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.current.interpolate({
        inputRange: [-1, 1],
        outputRange: [-buttonWidth-50, buttonWidth+50],
    });
    return (
        <Pressable
            onPress={onPress}
            onLayout={e => setButtonWidth(e.nativeEvent.layout.width)}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]}
        >
            <LinearGradient
                colors={['#6a1b9a', '#8e44ad']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.gradient}
            >
                <Text style={styles.buttonText}>
                    {children}
                </Text>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        { transform: [{ translateX }] }
                    ]}
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.shimmerGradient}
                    />
                </Animated.View>
            </LinearGradient>
        </Pressable>
    )
}

ModernButton.displayName = "ModernButtonComponent";

const styles = StyleSheet.create({
    button: {
        position: "relative",
        display: "flex",
        borderRadius: 12,
        borderColor: purpleTheme.border_color_base,
        borderWidth: 2,
        overflow: 'hidden',
        elevation: 6,
    },
    buttonPressed: {
        transform: [{ scale: 0.95 }],
    },
    gradient: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: purpleTheme.color_text_base_inverse,
        fontSize: 20,
        fontWeight: '700',
    },
    shimmerOverlay: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    shimmerGradient: {
        flex: 1
    }
});