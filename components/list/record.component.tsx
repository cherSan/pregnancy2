import {ComponentProps, FC, ReactNode, useMemo} from "react";
import {StyleSheet, View, Text, StyleProp, TextStyle, Pressable} from "react-native";
import {Icon, SwipeAction, SwipeoutButtonProps} from "@ant-design/react-native";
import {useTheme} from "@/theme/main";

type Props = {
    title?: string;
    description?: string;
    icon?: ReactNode;
    extra?: string | ReactNode;
    children?: ReactNode;
    onPress?: () => void;
    arrow?: boolean;
    actions?: ComponentProps<typeof SwipeAction>;
}

export const Record: FC<Props> = ({
    title,
    description,
    icon,
    extra,
    children,
    onPress,
    arrow = false,
    actions
}) => {
    const theme = useTheme();

    const content = useMemo(() => {
        if (
            !title
            && !description
            && !icon
            && !extra
            && !children
        ) return null;

        if (
            !title
            && !description
            && !icon
            && !extra
        ) return (
            <View style={styles.content}>
                {typeof children === 'string' ? <Text>{children}</Text> : children}
            </View>
        );

        if (
            !title
            && !description
            && !extra
        ) return (
            <View
                style={styles.header}
            >
                <View
                    style={styles.icon}
                >
                    { icon }
                </View>
                <View style={styles.content}>
                    {typeof children === 'string' ? <Text>{children}</Text> : children}
                </View>
            </View>
        );
        return (
            <View style={styles.mainContent}>
                <View
                    style={styles.header}
                >
                    {
                        icon
                            ? (
                                <View
                                    style={styles.icon}
                                >
                                    { icon }
                                </View>
                            )
                            : null
                    }
                    {
                        title || extra || description
                            ? (
                                <View
                                    style={styles.headerData}
                                >
                                    <View
                                        style={styles.headerDataRow}
                                    >
                                        {title ? <Text style={[styles.title, { color: theme.color_text_base }]}>{title}</Text> : null}
                                        {
                                            extra
                                                ? (
                                                    typeof extra === 'string'
                                                        ? <Text style={[styles.extra, { color: theme.color_text_caption }]}>{extra}</Text>
                                                        : extra
                                                )
                                                : null
                                        }
                                    </View>
                                    {
                                        description
                                            ? (
                                                <View>
                                                    <Text style={styles.description}>
                                                        {description}
                                                    </Text>
                                                </View>
                                            )
                                            : null
                                    }
                                </View>
                            )
                            : null
                    }
                    {
                        arrow ? <View style={styles.arrow}><Icon name={"right"} /></View> : null
                    }
                </View>
                {
                    children
                        ? (
                            <View style={styles.content}>
                                {typeof children === 'string' ? <Text>{children}</Text> : children}
                            </View>
                        )
                        : null
                }
            </View>
        );
    }, [arrow, children, description, extra, icon, theme, title]);

    const pressable = useMemo(() => {
        if (!content) return null;
        return onPress
            ? (
                <Pressable style={styles.container} onPress={onPress}>
                    {content}
                </Pressable>
            )
            : (
                <View style={styles.container}>
                    {content}
                </View>
            );
    }, [content, onPress]);

    const styledActions = useMemo<ComponentProps<typeof SwipeAction> | null>(() => {
        if (!actions) return null;

        const mainStyles: StyleProp<TextStyle> = {
            paddingHorizontal: 12,
            paddingVertical: 0,
            display: 'flex',
            justifyContent: 'center',
            margin: 0,
            fontSize: 14,
            elevation: 6
        }

        return {
            ...actions,
            right: actions.right?.map<SwipeoutButtonProps>(button => ({
                ...button,
                style: {
                    ...mainStyles,
                    ...StyleSheet.flatten(button.style),
                }
            })),
            left: actions.left?.map<SwipeoutButtonProps>(button => ({
                ...button,
                style: {
                    ...mainStyles,
                    ...StyleSheet.flatten(button.style),
                }
            }))
        }
    }, [actions])

    if (!pressable) return null;

    return styledActions
        ? (
            <SwipeAction
                closeOnAction={true}
                closeOnTouchOutside={true}
                useNativeAnimations={true}
                {...styledActions}
            >
                {pressable}
            </SwipeAction>
        )
        : pressable
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'transparent',
        alignItems: "center",
        padding: 8
    },
    arrow: {
        width: 30,
        paddingLeft: 8,
        backgroundColor: 'transparent',
    },
    mainContent: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'transparent',
    },
    header: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'transparent',
    },
    icon: {
        width: 30,
        paddingRight: 8,
        backgroundColor: 'transparent',
    },
    headerData: {
        display: "flex",
        flex: 1,
        gap: 6,
        flexDirection: "column",
        backgroundColor: 'transparent',
        overflow: "hidden",
    },
    headerDataRow: {
        display: "flex",
        flex: 1,
        gap: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: 'transparent',
        overflow: "hidden",
        maxWidth: '100%'
    },
    title: {
        fontWeight: "bold",
        backgroundColor: 'transparent',
        flex: 1,
        flexWrap: "wrap",
        flexShrink: 1,
    },
    extra: {
        fontWeight: "bold",
        backgroundColor: 'transparent',
        justifyContent: "flex-end",
        textAlign: 'right',
        minWidth: 30,
    },
    description: {
        backgroundColor: 'transparent',
    },
    content: {
        display: "flex",
        backgroundColor: 'transparent',
    }
});