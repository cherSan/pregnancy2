import {Children, FC, isValidElement, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {StyleSheet, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {PageContent} from "@/components/page/content";
import {PageForeground} from "@/components/page/foreground";
import {Header} from "@/components/page/header";
import {HEADER_HEIGHT} from "@/components/page/page.const";
import {PageContext, PageContextType} from "./page.context";

type PageProps = {
    children: ReactNode;
    hasTabBar?: boolean;
};

export const Page: FC<PageProps> = ({
                                        children,
                                        hasTabBar = false,
}) => {
    const safeArea = useSafeAreaInsets();

    const {header, content, foreground, gapContent} = useMemo(() => {
        let header: ReactNode = null;
        let content: ReactNode = null;
        let foreground: ReactNode = null;
        let gapContent: ReactNode = null;

        Children.forEach(children, (child) => {
            if (isValidElement(child)) {
                switch (child.type) {
                    case Header:
                        header = child;
                        break;
                    case PageContent:
                        content = child;
                        break;
                    case PageForeground:
                        foreground = child;
                        gapContent = (child  as ReactElement<{ gapContent?: ReactNode }>).props.gapContent ?? null;
                        break;
                    default:
                        content = child;
                }
            }
        });

        return {header, content, foreground, gapContent};
    }, [children]);

    const [isForegroundOpen, setIsForegroundOpen] = useState(!!foreground);
    const translateY = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateY: translateY.value}],
    }));


    useEffect(() => {
        if (!foreground) return;
        if (isForegroundOpen) {
            translateY.value = withTiming(0, {
                duration: 800,
                easing: Easing.out(Easing.exp),
            });
        } else {
            translateY.value = withTiming(-HEADER_HEIGHT - safeArea.top - 1, {
                duration: 800,
                easing: Easing.out(Easing.exp),
            });
        }
    }, [foreground, isForegroundOpen, safeArea.top, translateY]);

    const openForeground = useCallback(() => {
        setIsForegroundOpen(true);
    }, []);

    const closeForeground = useCallback(() => {
        setIsForegroundOpen(false);
    }, []);

    const toggleForeground = useCallback(() => {
        setIsForegroundOpen(value => !value);
    }, []);

    const contextValue: PageContextType = {
        isForegroundOpen,
        openForeground,
        closeForeground,
        toggleForeground,
        hasTabBar
    };
    return (
        <PageContext.Provider value={contextValue}>
            <Animated.View
                style={[
                    styles.page,
                    animatedStyle,
                    {
                        paddingTop: safeArea.top,
                        paddingBottom: safeArea.bottom,
                        paddingLeft: safeArea.left,
                        paddingRight: safeArea.right,
                    },
                    {
                        top: -safeArea.top,
                        bottom: -safeArea.top - HEADER_HEIGHT - 2,
                    }
                ]}
            >
                <LinearGradient
                    colors={["#8e44ad", "#6a1b9a", "#4a148c"]}
                    style={styles.background}
                />
                {header}
                <View
                    style={[
                        styles.wrapper,
                        {
                            paddingLeft: safeArea.left + 4,
                            paddingRight: safeArea.right + 4,
                            paddingTop: safeArea.top,
                            paddingBottom: safeArea.bottom,
                        }
                    ]}
                >
                    {gapContent && (
                        <View
                            style={[
                                styles.gapContent,
                                {
                                    marginBottom: safeArea.top,
                                }
                            ]}
                        >
                            {gapContent}
                        </View>
                    )}
                    {content}
                </View>
            </Animated.View>
            {foreground}
        </PageContext.Provider>
    );
};

const styles = StyleSheet.create({
    page: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wrapper: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    gapContent: {
        height: 80,
        overflow: "hidden",
        justifyContent: "center",
    }
});