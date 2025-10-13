import React, { FC, ReactNode, useState } from "react";
import {Dimensions, StyleSheet, View, ScrollView, Text, Pressable} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from "react-native-reanimated";

type Props = {
    children: ReactNode;
    underPageContent?: ReactNode;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.8;
const VISIBLE_PART = 60;
const EXTRA_HEIGHT = 150;

export const Page: FC<Props> = ({ children, underPageContent }) => {
    const translateY = useSharedValue(SCREEN_HEIGHT - PANEL_HEIGHT);
    const [isOpen, setIsOpen] = useState(true);

    const openPanel = () => {
        translateY.value = withSpring(SCREEN_HEIGHT - PANEL_HEIGHT, {
            damping: 20,
            stiffness: 90
        });
        setIsOpen(true);
    };

    const closePanel = () => {
        translateY.value = withSpring(SCREEN_HEIGHT - VISIBLE_PART, {
            damping: 20,
            stiffness: 90
        });
        setIsOpen(false);
    };

    const togglePanel = () => {
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={["#8e44ad", "#6a1b9a", "#4a148c"]}
                style={styles.background}
            >
                <SafeAreaView style={styles.safeArea}>
                    {children}

                    <View style={styles.underPage}>
                        {underPageContent || (
                            <View style={styles.defaultUnderContent}>
                                <Text style={styles.underPageText}>
                                    Нажмите кнопку чтобы открыть панель
                                </Text>
                                <Text
                                    style={styles.toggleButton}
                                    onPress={togglePanel}
                                >
                                    {isOpen ? 'Закрыть' : 'Открыть'} панель
                                </Text>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <Animated.View style={[styles.foreground, animatedStyle]}>
                <Pressable style={styles.pullIndicator} onPress={togglePanel}>
                    <Text
                        style={styles.pullIndicatorText}
                    >
                        {isOpen ? '▼ Закрыть' : '▲ Открыть'}
                    </Text>
                </Pressable>
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{
                        minHeight: PANEL_HEIGHT,
                        backgroundColor: "#faf6ff"
                    }}>
                        <View style={styles.contentPlaceholder}>
                            <Text style={styles.contentTitle}>
                                Верхняя панель
                            </Text>
                            <Text style={styles.contentText}>
                                {isOpen ? 'Панель открыта' : 'Панель закрыта - видна только нижняя часть (80px)'}
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                            <Text style={styles.hintText}>
                                Теперь при анимации не видно нижнюю панель
                            </Text>
                        </View>
                    </View>
                    <View style={{height: EXTRA_HEIGHT}} />
                </ScrollView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#2E0854"
    },
    background: {
        ...StyleSheet.absoluteFillObject
    },
    safeArea: {
        flex: 1
    },
    underPage: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    defaultUnderContent: {
        alignItems: "center",
    },
    underPageText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    toggleButton: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 10,
    },
    foreground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: PANEL_HEIGHT + EXTRA_HEIGHT,
        backgroundColor: "#fff",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
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
        fontSize: 14,
        fontWeight: "600",
        color: "#8e44ad",
        height: 40,
    },

    foregroundContent: {
        flex: 1,
    },
    contentPlaceholder: {
        padding: 20,
    },
    contentTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    contentText: {
        fontSize: 16,
        color: "#666",
        lineHeight: 22,
        marginBottom: 10,
    },
    hintText: {
        fontSize: 14,
        color: "#999",
        fontStyle: 'italic',
    },
});