import React, {FC, ReactNode, useCallback, useMemo, useState} from "react";
import {View, StyleSheet} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {PageContext, PageContextType} from "./page.context";
import {ForegroundHeader} from "@/components/page/foreground-header";
import {PageContent} from "@/components/page/content";
import {PageForeground} from "@/components/page/foreground";
import {Header} from "@/components/page/header";

type PageProps = {
    children: ReactNode;
};

export const Page: FC<PageProps> = ({ children }) => {
    const { header, content, foreground, foregroundHeader } = useMemo(() => {
        let header: ReactNode = null;
        let content: ReactNode = null;
        let foreground: ReactNode = null;
        let foregroundHeader: ReactNode = null;

        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child)) {
                switch (child.type) {
                    case Header:
                        header = child;
                        break;
                    case ForegroundHeader:
                        foregroundHeader = child;
                        break;
                    case PageContent:
                        content = child;
                        break;
                    case PageForeground:
                        foreground = child;
                        break;
                    default:
                        content = child;
                }
            }
        });

        return { header, content, foreground, foregroundHeader };
    }, [children]);

    const [isForegroundOpen, setIsForegroundOpen] = useState(!!foreground);
    const safeArea = useSafeAreaInsets()
    const openForeground = useCallback(() => {
        setIsForegroundOpen(true);
    }, []);

    const closeForeground = useCallback(() => {
        setIsForegroundOpen(false);
    }, []);

    const toggleForeground =  useCallback(() => {
        setIsForegroundOpen(value => !value);
    }, []);

    const contextValue: PageContextType = {
        isForegroundOpen,
        openForeground,
        closeForeground,
        toggleForeground
    };

    return (
        <PageContext.Provider value={contextValue}>
            <View style={styles.root}>
                {foregroundHeader}
                <LinearGradient
                    colors={["#8e44ad", "#6a1b9a", "#4a148c"]}
                    style={[
                        styles.background,
                        {
                            paddingTop: safeArea.top,
                            paddingBottom: safeArea.bottom,
                            paddingLeft: safeArea.left,
                            paddingRight: safeArea.right
                        }
                    ]}
                >
                    {header}
                    {content}
                </LinearGradient>
                {foreground}
            </View>
        </PageContext.Provider>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#2E0854"
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        padding: 20,
    }
});