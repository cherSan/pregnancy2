import {FC, ReactNode, useEffect} from "react";
import {StyleSheet} from "react-native";
import {HEADER_GAP, HEADER_HEIGHT, ROUNDED} from "@/components/page/page.const";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {usePage} from "@/components/page/page.context";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export const ForegroundHeader: FC<{ children: ReactNode }> = ({ children }) => {
    const { isForegroundOpen } = usePage();
    const headerTranslateY = useSharedValue(0);
    const safeArea = useSafeAreaInsets()

    const headerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: headerTranslateY.value - HEADER_GAP + safeArea.top }],
    }));

    useEffect(() => {
        if (isForegroundOpen) {
            headerTranslateY.value = withSpring(0, {
                damping: 20,
                stiffness: 90
            });
        } else {
            headerTranslateY.value = withSpring(-200, {
                damping: 20,
                stiffness: 90
            });
        }
    }, [headerTranslateY, isForegroundOpen])

    return (
        <Animated.View style={[
            styles.foregroundHeader,
            headerAnimatedStyle
        ]}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    foregroundHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT + HEADER_GAP,
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        elevation: 10,
        borderBottomLeftRadius: ROUNDED,
        borderBottomRightRadius: ROUNDED,
        overflow: 'hidden',
        zIndex: 1
    },
});