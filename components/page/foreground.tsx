import {FC, ReactNode, useContext, useEffect, useMemo} from "react";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Pressable, ScrollView, StyleSheet, View, Text} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {PANEL_HEIGHT, PULL_INDICATOR_HEIGHT, ROUNDED} from "@/components/page/page.const";
import {PageContext, usePage} from "@/components/page/page.context";

type Props = {
    children: ReactNode;
    gapContent: ReactNode;
}

export const PageForeground: FC<Props> = ({ children }) => {
    const safeArea = useSafeAreaInsets();
    const page = useContext(PageContext);
    const { isForegroundOpen, toggleForeground } = usePage();
    const buffer = useMemo(() => page?.hasTabBar ? 66 : 0, [page?.hasTabBar])
    const translateY = useSharedValue(buffer);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    useEffect(() => {
        if (isForegroundOpen) {
            translateY.value = withTiming(buffer, {
                duration: 800,
                easing: Easing.out(Easing.exp),
            });
        } else {
            translateY.value = withTiming(PANEL_HEIGHT - PULL_INDICATOR_HEIGHT - (page?.hasTabBar ? 0 : safeArea.bottom), {
                duration: 800,
                easing: Easing.out(Easing.exp),
            });
        }
    }, [buffer, isForegroundOpen, page?.hasTabBar, safeArea.bottom, translateY])

    return (
        <Animated.View style={[
            styles.foreground,
            animatedStyle,
            {
                paddingLeft: safeArea.left,
                paddingRight: safeArea.right,
                paddingBottom: 20,
                height: PANEL_HEIGHT,
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
        height: PULL_INDICATOR_HEIGHT,
        backgroundColor: "#fff",
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