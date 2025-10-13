import {FC, ReactNode, useEffect} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {Pressable, ScrollView, StyleSheet, View, Text} from "react-native";
import {EXTRA_HEIGHT, PANEL_HEIGHT, ROUNDED, SCREEN_HEIGHT, VISIBLE_PART} from "@/components/page/page.const";
import {usePage} from "@/components/page/page.context";

export const PageForeground: FC<{ children: ReactNode }> = ({ children }) => {
    const { isForegroundOpen, toggleForeground } = usePage();
    const translateY = useSharedValue(SCREEN_HEIGHT - PANEL_HEIGHT);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    useEffect(() => {
        if (isForegroundOpen) {
            translateY.value = withSpring(SCREEN_HEIGHT - PANEL_HEIGHT, {
                damping: 20,
                stiffness: 90
            });
        } else {
            translateY.value = withSpring(SCREEN_HEIGHT - VISIBLE_PART, {
                damping: 20,
                stiffness: 90
            });
        }
    }, [isForegroundOpen, translateY])

    return (
        <Animated.View style={[styles.foreground, animatedStyle]}>
            <Pressable style={styles.pullIndicator} onPress={toggleForeground}>
                <Text style={styles.pullIndicatorText}>
                    {isForegroundOpen ? '▼ Закрыть' : '▲ Открыть'}
                </Text>
            </Pressable>

            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.foregroundContent}>
                    {children}
                    <View style={{ height: EXTRA_HEIGHT }} />
                </View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    foreground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: PANEL_HEIGHT + EXTRA_HEIGHT,
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
        width: "100%",
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    pullIndicatorText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#8e44ad",
        height: 40,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    foregroundContent: {
        flex: 1,
        minHeight: PANEL_HEIGHT,
    },
});