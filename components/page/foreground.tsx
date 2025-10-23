import {FC, ReactNode, useEffect} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {Pressable, ScrollView, StyleSheet, View, Text} from "react-native";
import {BUFFER, PANEL_HEIGHT, ROUNDED} from "@/components/page/page.const";
import {usePage} from "@/components/page/page.context";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export const PageForeground: FC<{ children: ReactNode }> = ({ children }) => {
    const safeArea = useSafeAreaInsets();
    const { isForegroundOpen, toggleForeground } = usePage();
    const translateY = useSharedValue(BUFFER);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    useEffect(() => {
        if (isForegroundOpen) {
            translateY.value = withSpring(BUFFER, {
                damping: 20,
                stiffness: 90
            });
        } else {
            translateY.value = withSpring(PANEL_HEIGHT + BUFFER - 40 - safeArea.bottom, {
                damping: 20,
                stiffness: 90
            });
        }
    }, [isForegroundOpen, safeArea.bottom, translateY])

    return (
        <Animated.View style={[
            styles.foreground,
            animatedStyle,
            {
                paddingLeft: safeArea.left,
                paddingRight: safeArea.right
            }
        ]}>
            <Pressable style={styles.pullIndicator} onPress={toggleForeground}>
                <Text style={styles.pullIndicatorText}>
                    {isForegroundOpen ? '▼ Закрыть' : '▲ Открыть'}
                </Text>
            </Pressable>

            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    {
                        paddingVertical: safeArea.bottom
                    }
                ]}
            >
                <View style={styles.foregroundContent}>
                    {children}
                    <View style={{ height: BUFFER }} />
                </View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    foreground: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: PANEL_HEIGHT + BUFFER,
        backgroundColor: "#fff",
        borderTopLeftRadius: ROUNDED,
        borderTopRightRadius: ROUNDED,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: -5,
        },
        elevation: 10,
    },
    pullIndicator: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    pullIndicatorText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#8e44ad",
    },
    foregroundContent: {
        flex: 1,
        minHeight: PANEL_HEIGHT,
    },
});