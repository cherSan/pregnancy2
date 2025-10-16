import {StyleSheet, TextInput, View} from "react-native";
import {ComponentProps, FC} from "react";
import {Text} from "@ant-design/react-native";
import {useTheme} from "@/theme/main";

type Props = ComponentProps<typeof TextInput> & {
    error?: string;
    inline?: boolean;
};

export const Input: FC<Props> = ({
    error,
    placeholder,
    inline = false,
    ...props
}) => {
    const theme = useTheme();
    return (
        <View style={[styles.inputWrapper]}>
            {
                inline
                    ? (
                        <View style={styles.placeholder}>
                            <Text
                                style={styles.placeholderText}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {placeholder}
                            </Text>
                        </View>
                    )
                    : null
            }
            <TextInput
                style={[styles.input, inline ? styles.inlineInput: {}, { color: theme.color_text_base }]}
                placeholder={!inline ? placeholder : ''}
                placeholderTextColor={theme.color_text_placeholder}
                {...props}
            />
            {
                error
                    ? (
                        <View style={styles.errorContainer}>
                            <Text style={[styles.error, {color: theme['brand_error']}]}>{error || ''}</Text>
                        </View>
                    )
                    : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    placeholderText: {
        textAlign: 'right',
        fontWeight: 'bold',
    },
    placeholder: {
        position: 'absolute',
        top: 10,
        width: '46%',
        overflow: 'hidden',
    },
    inlineInput: {
        paddingLeft: '50%',
        overflow: 'hidden',
        width: '100%',
    },
    inputWrapper: {
        position: "relative",
        paddingHorizontal: 4,
        paddingVertical: 0,
        display: "flex",
        flexDirection: 'column'
    },
    errorContainer: {
        display: 'flex',
        boxSizing: 'border-box',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'nowrap'
    },
    error: {
        fontSize: 10,
        lineHeight: 10,
    },
    input: {
        fontWeight: "bold",
        backgroundColor: 'transparent',
    }
})