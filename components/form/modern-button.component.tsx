import {Pressable, StyleSheet, Text} from "react-native";
import {FC, JSX} from "react";
import {LinearGradient} from "expo-linear-gradient";

type ButtonProps = {
    onPress: () => void;
    children: string | string[] | JSX.Element | JSX.Element[];
}

export const ModernButton: FC<ButtonProps> = ({
    onPress,
    children
}) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]}
        >
            <LinearGradient
                colors={['#6a1b9a', '#8e44ad']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.gradient}
            >
                <Text style={styles.buttonText}>
                    {children}
                </Text>
            </LinearGradient>
        </Pressable>
    )
}

ModernButton.displayName = "ModernButtonComponent";

const styles = StyleSheet.create({
    button: {
        position: "relative",
        display: "flex",
        width: '100%',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8
        },
        backgroundColor: 'rgba(255,255,255,.3)',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonPressed: {
        transform: [{ scale: 0.97 }],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        elevation: 6,
    },
    gradient: {
        paddingVertical: 20,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        elevation: 5
    },
});