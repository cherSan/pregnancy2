import {Children, FC, ReactElement, ReactNode} from "react";
import {Text} from "@ant-design/react-native";
import {ScrollView, StyleSheet, View} from "react-native";
import {Card} from "../card";

type Props = {
    title?: string;
    children?: ReactElement | ReactElement[] | ReactNode | ReactNode[];
}

export const List: FC<Props> = ({children, title}) => {
    return (
        <Card>
            {
                title
                    ? (
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                    )
                    : null
            }
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    Children.toArray(children).map((element, index) => (
                        <View
                            key={index}
                            style={[styles.element, { borderTopWidth: index > 0 ? 1 : 0 }]}
                        >
                            {element}
                        </View>
                    ))
                }
            </ScrollView>
        </Card>
    )
}

const styles = StyleSheet.create({
    element: {
        paddingVertical: 8
    },
    header: {
        display: "flex",
        flexDirection: "row",
        paddingBottom: 14,
        justifyContent: "flex-end",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    }
});
