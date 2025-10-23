import {FC, ReactNode} from "react";
import {StyleSheet, View} from "react-native";
export const PageContent: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    return (
        <View style={styles.content}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        gap: 10,
        flexDirection: "column",
        overflow: "hidden",
    },
});