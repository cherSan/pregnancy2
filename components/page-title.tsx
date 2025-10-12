import {FC} from "react";
import {StyleSheet, Text} from "react-native";

type Props = { children: string };

export const PageTitle: FC<Props> = ({ children }) => (
    <Text style={styles.title}>{children}</Text>
);

PageTitle.displayName = "PageTitle";

const styles = StyleSheet.create({
    title: {
        fontFamily: 'GreatVibes_400Regular',
        fontSize: 32,
        color: '#ccc',
        textAlign: 'center',
    },
});