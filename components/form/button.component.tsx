import {ComponentProps, FC} from "react";
import {Button as AntButton} from "@ant-design/react-native";
import {StyleSheet, View} from "react-native";

type Props = ComponentProps<typeof AntButton>
export const Button: FC<Props> = ({
    children,
    ...props
}) => {
    return (
        <View style={styles.button}>
            <AntButton {...props}>
                {children}
            </AntButton>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12
    }
})