import {FC, ReactNode} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
export const PageContent: FC<{ children: ReactNode }> = ({ children }) => (
    <ScrollView>
        <View style={styles.content}>
            { children }
        </View>
    </ScrollView>
);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 8,
    },
});